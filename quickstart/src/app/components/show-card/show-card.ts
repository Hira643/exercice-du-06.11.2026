import { Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Show } from '../../models/show';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-show-card',
  imports: [RouterLink],
  templateUrl: './show-card.html',
})
export class ShowCard {
  readonly show = input.required<Show>();
  readonly favorites = inject(FavoritesService);
  readonly imageFailed = signal(false);
}
