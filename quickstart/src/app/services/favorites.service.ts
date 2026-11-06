import { Injectable, signal } from '@angular/core';
import { Show } from '../models/show';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private key = 'tvmaze-explorer.favorites.v1';
  private saved = signal<Show[]>(this.restore());
  shows = this.saved.asReadonly();
  storageWarning = signal('');

  count() {
    return this.saved().length;
  }

  has(id: number) {
    for (const show of this.saved()) {
      if (show.id === id) {
        return true;
      }
    }
    return false;
  }

  toggle(show: Show) {
    if (this.has(show.id)) {
      const remaining = this.saved().filter((item) => item.id !== show.id);
      this.saved.set(remaining);
    } else {
      // On garde les infos de la carte, sans enregistrer tous les épisodes.
      const favorite: Show = {
        id: show.id,
        name: show.name,
        url: show.url,
        image: show.image,
        summary: show.summary,
        status: show.status,
        genres: show.genres,
        language: show.language,
        premiered: show.premiered,
        rating: show.rating,
      };
      const shows = this.saved().slice();
      shows.push(favorite);
      this.saved.set(shows);
    }

    try {
      localStorage.setItem(this.key, JSON.stringify(this.saved()));
      this.storageWarning.set('');
    } catch {
      this.storageWarning.set(
        'Le navigateur ne permet pas la sauvegarde : vos favoris sont conservés pour cette session seulement.',
      );
    }
  }

  private restore(): Show[] {
    try {
      const data = JSON.parse(localStorage.getItem(this.key) ?? '[]');
      if (!Array.isArray(data)) {
        return [];
      }

      const shows: Show[] = [];
      for (const show of data) {
        // Une sauvegarde abîmée ne doit pas empêcher la page de s'ouvrir.
        if (!show || !Number.isSafeInteger(show.id) || show.id <= 0) {
          continue;
        }
        if (typeof show.name !== 'string' || typeof show.status !== 'string') {
          continue;
        }
        if (!Array.isArray(show.genres) || !show.rating) {
          continue;
        }
        if (
          show.image !== null &&
          (typeof show.image?.medium !== 'string' || typeof show.image?.original !== 'string')
        ) {
          continue;
        }

        const duplicate = shows.some((item) => item.id === show.id);
        if (!duplicate) {
          shows.push(show);
        }
      }
      return shows;
    } catch {
      return [];
    }
  }
}
