import { TestBed } from '@angular/core/testing';
import { FavoritesService } from './favorites.service';
import { Show } from '../models/show';

const show: Show = {
  id: 82,
  name: 'Game of Thrones',
  url: 'https://www.tvmaze.com/shows/82/game-of-thrones',
  image: null,
  summary: null,
  status: 'Ended',
  genres: ['Drama'],
  language: 'English',
  premiered: '2011-04-17',
  rating: { average: 8.9 },
};

describe('FavoritesService', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('ajoute, restaure après rechargement et retire un favori', () => {
    const service = TestBed.inject(FavoritesService);
    service.toggle(show);
    expect(service.count()).toBe(1);
    expect(new FavoritesService().has(82)).toBe(true);
    service.toggle(show);
    expect(service.count()).toBe(0);
    expect(new FavoritesService().shows()).toEqual([]);
  });

  it('ignore les données locales corrompues', () => {
    localStorage.setItem('tvmaze-explorer.favorites.v1', '{broken');
    expect(new FavoritesService().shows()).toEqual([]);
    localStorage.setItem(
      'tvmaze-explorer.favorites.v1',
      JSON.stringify([null, { id: 1 }, show, show]),
    );
    expect(new FavoritesService().count()).toBe(1);
  });

  it('garde les favoris en mémoire si le stockage est refusé', () => {
    const service = TestBed.inject(FavoritesService);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Quota');
    });
    service.toggle(show);
    expect(service.has(82)).toBe(true);
    expect(service.storageWarning()).toContain('session');
  });
});
