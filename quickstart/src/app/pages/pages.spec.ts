import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../app.routes';
import { AccessService } from '../services/access.service';
import { FavoritesService } from '../services/favorites.service';
import { ShowDetail } from './show-detail/show-detail';
import { Favorites } from './favorites/favorites';

const show = {
  id: 82,
  name: 'Game of Thrones',
  url: '',
  image: null,
  summary: '<p>Un <b>royaume</b>.</p>',
  status: 'Ended',
  genres: ['Drama'],
  language: 'English',
  premiered: '2011-04-17',
  rating: { average: 8.9 },
};
const detail = {
  ...show,
  _embedded: {
    episodes: [
      { id: 1, season: 1, number: 1, name: 'Winter Is Coming' },
      { id: 2, season: 2, number: null, name: 'Episode spécial' },
    ],
  },
};

describe('Navigation, fiches et favoris', () => {
  let http: HttpTestingController;
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  it('bloque aussi une ouverture directe de /show/82', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/show/82');
    expect(TestBed.inject(Router).url).toBe('/');
    http.expectNone('https://api.tvmaze.com/shows/82?embed=episodes');
    http.expectOne('https://api.tvmaze.com/search/shows?q=Sherlock').flush([]);
  });

  it('charge la fiche, rend son résumé et filtre les épisodes par saison', async () => {
    TestBed.inject(AccessService).toggle();
    const harness = await RouterTestingHarness.create();
    const page = await harness.navigateByUrl('/show/82', ShowDetail);
    expect(harness.routeNativeElement?.textContent).toContain('loading...');
    http.expectOne('https://api.tvmaze.com/shows/82?embed=episodes').flush(detail);
    await harness.fixture.whenStable();
    expect(harness.routeNativeElement?.querySelector('.summary b')?.textContent).toBe('royaume');
    expect(harness.routeNativeElement?.querySelectorAll('.episode-list li').length).toBe(2);
    page.selectedSeason.set('2');
    await harness.fixture.whenStable();
    expect(harness.routeNativeElement?.querySelectorAll('.episode-list li').length).toBe(1);
    expect(harness.routeNativeElement?.textContent).toContain('SPÉCIAL');
    TestBed.inject(FavoritesService).toggle(page.state().data!);
    expect(TestBed.inject(FavoritesService).has(82)).toBe(true);
  });

  it('affiche une erreur claire pour une série inexistante', async () => {
    TestBed.inject(AccessService).toggle();
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/show/999999', ShowDetail);
    http
      .expectOne('https://api.tvmaze.com/shows/999999?embed=episodes')
      .flush('', { status: 404, statusText: 'Not Found' });
    await harness.fixture.whenStable();
    expect(harness.routeNativeElement?.textContent).toContain('Cette série est introuvable');
  });

  it('rejette un identifiant invalide sans requête HTTP', async () => {
    TestBed.inject(AccessService).toggle();
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/show/abc', ShowDetail);
    expect(harness.routeNativeElement?.textContent).toContain('Identifiant de série invalide');
    http.expectNone((request) => request.url.includes('/shows/'));
  });

  it('attend tous les favoris et conserve leur ordre malgré les réponses inversées', async () => {
    const favorites = TestBed.inject(FavoritesService);
    favorites.toggle(show);
    favorites.toggle({ ...show, id: 335, name: 'Sherlock' });
    const harness = await RouterTestingHarness.create();
    const page = await harness.navigateByUrl('/favorites', Favorites);
    const firstRequest = http.expectOne('https://api.tvmaze.com/shows/82');
    const secondRequest = http.expectOne('https://api.tvmaze.com/shows/335');

    secondRequest.flush({ ...show, id: 335, name: 'Sherlock' });
    expect(page.state().loading).toBe(true);
    firstRequest.flush('', { status: 503, statusText: 'Unavailable' });
    await harness.fixture.whenStable();

    expect(page.state().loading).toBe(false);
    expect(page.state().data.map((item) => item.id)).toEqual([82, 335]);
    expect(page.state().error).toContain('version sauvegardée');
    expect(harness.routeNativeElement?.querySelectorAll('app-show-card').length).toBe(2);
  });

  it('annule les requêtes en cours quand la liste des favoris change', async () => {
    const favorites = TestBed.inject(FavoritesService);
    favorites.toggle(show);
    const harness = await RouterTestingHarness.create();
    const page = await harness.navigateByUrl('/favorites', Favorites);
    const request = http.expectOne('https://api.tvmaze.com/shows/82');

    favorites.toggle(show);
    await harness.fixture.whenStable();

    expect(request.cancelled).toBe(true);
    expect(page.state().loading).toBe(false);
    expect(page.state().data).toEqual([]);
    expect(harness.routeNativeElement?.textContent).toContain('Votre collection commence ici');
  });

  it('conserve une copie locale lors d’une panne puis affiche @empty après retrait', async () => {
    const favorites = TestBed.inject(FavoritesService);
    favorites.toggle(show);
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/favorites', Favorites);
    http
      .expectOne('https://api.tvmaze.com/shows/82')
      .flush('', { status: 503, statusText: 'Unavailable' });
    await harness.fixture.whenStable();
    expect(harness.routeNativeElement?.textContent).toContain('Game of Thrones');
    expect(harness.routeNativeElement?.textContent).toContain('version sauvegardée');
    (harness.routeNativeElement?.querySelector('.favorite-button') as HTMLButtonElement).click();
    await harness.fixture.whenStable();
    expect(favorites.count()).toBe(0);
    expect(harness.routeNativeElement?.textContent).toContain('Votre collection commence ici');
  });
});
