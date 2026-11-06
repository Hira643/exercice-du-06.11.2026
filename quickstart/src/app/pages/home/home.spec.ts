import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Home } from './home';

describe('Accueil et recherche', () => {
  let params: BehaviorSubject<ReturnType<typeof convertToParamMap>>;
  let http: HttpTestingController;

  beforeEach(() => {
    params = new BehaviorSubject(convertToParamMap({ q: 'Sherlock' }));
    TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParamMap: params.value }, queryParamMap: params },
        },
      ],
    });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('affiche loading puis @empty pour une recherche sans résultat', async () => {
    const fixture = TestBed.createComponent(Home);
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('loading...');
    http.expectOne('https://api.tvmaze.com/search/shows?q=Sherlock').flush([]);
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Aucune série trouvée');
    expect(fixture.nativeElement.textContent).not.toContain('loading...');
  });

  it('annule une ancienne requête et accepte une nouvelle recherche après erreur', () => {
    const fixture = TestBed.createComponent(Home);
    const old = http.expectOne('https://api.tvmaze.com/search/shows?q=Sherlock');
    params.next(convertToParamMap({ q: 'Dark' }));
    expect(old.cancelled).toBe(true);
    http
      .expectOne('https://api.tvmaze.com/search/shows?q=Dark')
      .flush('error', { status: 500, statusText: 'Error' });
    expect(fixture.componentInstance.state().error).toContain('Impossible');
    fixture.componentInstance.retry();
    http.expectOne('https://api.tvmaze.com/search/shows?q=Dark').flush([]);
    expect(fixture.componentInstance.state().error).toBe('');
  });

  it('ne contacte pas l’API pour une recherche vide', () => {
    params.next(convertToParamMap({ q: '   ' }));
    const fixture = TestBed.createComponent(Home);
    http.expectNone((request) => request.url.includes('api.tvmaze.com'));
    expect(fixture.componentInstance.state().loading).toBe(false);
  });
});
