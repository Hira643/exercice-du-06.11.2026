import { Component, inject, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Episode, LoadState, ShowDetail as ShowData } from '../../models/show';
import { TvmazeService } from '../../services/tvmaze.service';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-show-detail',
  imports: [RouterLink],
  templateUrl: './show-detail.html',
})
export class ShowDetail implements OnDestroy {
  private route = inject(ActivatedRoute);
  private api = inject(TvmazeService);
  private routeSubscription: Subscription;
  private showSubscription?: Subscription;

  favorites = inject(FavoritesService);
  selectedSeason = signal('all');
  imageFailed = signal(false);
  state = signal<LoadState<ShowData | null>>({ loading: true, data: null, error: '' });

  constructor() {
    this.routeSubscription = this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      this.loadShow(id);
    });
  }

  private loadShow(id: number) {
    this.showSubscription?.unsubscribe();
    this.selectedSeason.set('all');
    this.imageFailed.set(false);

    if (!Number.isSafeInteger(id) || id <= 0) {
      this.state.set({ loading: false, data: null, error: 'Identifiant de série invalide.' });
      return;
    }

    this.state.set({ loading: true, data: null, error: '' });

    this.showSubscription = this.api.getShowDetail(id).subscribe({
      next: (show) => {
        this.state.set({ loading: false, data: show, error: '' });
      },
      error: (error: HttpErrorResponse) => {
        let message = 'Impossible de charger cette série. Vérifiez votre connexion et réessayez.';
        if (error.status === 404) {
          message = 'Cette série est introuvable.';
        }
        this.state.set({ loading: false, data: null, error: message });
      },
    });
  }

  episodes(): Episode[] {
    const show = this.state().data;
    if (!show || !show._embedded) {
      return [];
    }
    return show._embedded.episodes ?? [];
  }

  seasons(): number[] {
    const seasons: number[] = [];
    for (const episode of this.episodes()) {
      if (!seasons.includes(episode.season)) {
        seasons.push(episode.season);
      }
    }
    return seasons.sort((a, b) => a - b);
  }

  visibleEpisodes(): Episode[] {
    if (this.selectedSeason() === 'all') {
      return this.episodes();
    }

    const episodes: Episode[] = [];
    for (const episode of this.episodes()) {
      if (episode.season === Number(this.selectedSeason())) {
        episodes.push(episode);
      }
    }
    return episodes;
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
    this.showSubscription?.unsubscribe();
  }
}
