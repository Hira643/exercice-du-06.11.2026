import { Component, inject, OnDestroy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ShowCard } from '../../components/show-card/show-card';
import { LoadState, Show } from '../../models/show';
import { TvmazeService } from '../../services/tvmaze.service';

@Component({
  selector: 'app-home',
  imports: [FormsModule, ShowCard],
  templateUrl: './home.html',
})
export class Home implements OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(TvmazeService);
  private routeSubscription: Subscription;
  private searchSubscription?: Subscription;

  query = this.route.snapshot.queryParamMap.get('q') ?? 'Sherlock';
  submittedQuery = this.query;

  // Un signal permet à Angular d'actualiser la page quand les données changent.
  state = signal<LoadState<Show[]>>({ loading: true, data: [], error: '' });

  constructor() {
    this.routeSubscription = this.route.queryParamMap.subscribe((params) => {
      this.query = (params.get('q') ?? 'Sherlock').trim();
      this.submittedQuery = this.query;
      this.loadShows();
    });
  }

  search(value = this.query) {
    this.router.navigate(['/'], { queryParams: { q: value.trim() } });
  }

  private loadShows() {
    // On arrête l'ancienne recherche avant d'en commencer une nouvelle.
    this.searchSubscription?.unsubscribe();

    if (this.submittedQuery === '') {
      this.state.set({ loading: false, data: [], error: '' });
      return;
    }

    this.state.set({ loading: true, data: [], error: '' });

    this.searchSubscription = this.api.search(this.submittedQuery).subscribe({
      next: (shows) => {
        this.state.set({ loading: false, data: shows, error: '' });
      },
      error: () => {
        this.state.set({
          loading: false,
          data: [],
          error: 'Impossible de charger les séries. Vérifiez votre connexion puis réessayez.',
        });
      },
    });
  }

  retry() {
    this.loadShows();
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
    this.searchSubscription?.unsubscribe();
  }
}
