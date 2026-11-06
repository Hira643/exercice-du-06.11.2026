import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ShowCard } from '../../components/show-card/show-card';
import { FavoritesService } from '../../services/favorites.service';
import { TvmazeService } from '../../services/tvmaze.service';
import { LoadState, Show } from '../../models/show';

@Component({
  selector: 'app-favorites',
  imports: [RouterLink, ShowCard],
  templateUrl: './favorites.html',
})
export class Favorites {
  favorites = inject(FavoritesService);
  private api = inject(TvmazeService);
  state = signal<LoadState<Show[]>>({ loading: true, data: [], error: '' });

  constructor() {
    // L'effet relance le chargement quand on ajoute ou retire un favori.
    effect((onCleanup) => {
      const requests = this.loadFavorites(this.favorites.shows());
      onCleanup(() => requests.unsubscribe());
    });
  }

  private loadFavorites(saved: Show[]): Subscription {
    const requests = new Subscription();

    if (saved.length === 0) {
      this.state.set({ loading: false, data: [], error: '' });
      return requests;
    }

    this.state.set({ loading: true, data: [], error: '' });
    const shows = saved.slice();
    let remaining = saved.length;
    let hasError = false;

    // On affiche la liste lorsque toutes les requêtes sont terminées.
    const finishRequest = () => {
      remaining--;
      if (remaining === 0) {
        let message = '';
        if (hasError) {
          message =
            'Certaines séries n’ont pas pu être actualisées. Leur version sauvegardée est affichée.';
        }
        this.state.set({ loading: false, data: shows, error: message });
      }
    };

    for (let index = 0; index < saved.length; index++) {
      const request = this.api.getShow(saved[index].id).subscribe({
        next: (show) => {
          shows[index] = show;
        },
        error: () => {
          // La copie locale reste dans la liste si l'API ne répond pas.
          hasError = true;
          finishRequest();
        },
        complete: () => {
          finishRequest();
        },
      });
      requests.add(request);
    }

    return requests;
  }
}
