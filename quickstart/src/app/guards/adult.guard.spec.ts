import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  provideRouter,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { adultGuard } from './adult.guard';
import { AccessService } from '../services/access.service';

describe('adultGuard', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));
  const runGuard = () =>
    TestBed.runInInjectionContext(() =>
      adultGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );

  it('redirige vers l’accueil et explique le refus par défaut', () => {
    const result = runGuard() as UrlTree;
    expect(TestBed.inject(Router).serializeUrl(result)).toBe('/');
    expect(TestBed.inject(AccessService).message()).toContain('bloqué');
  });

  it('autorise les fiches uniquement tant que le mode est actif', () => {
    const access = TestBed.inject(AccessService);
    access.toggle();
    expect(runGuard()).toBe(true);
    access.toggle();
    expect(runGuard()).toBeInstanceOf(UrlTree);
  });
});
