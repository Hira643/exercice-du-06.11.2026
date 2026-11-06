import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AccessService } from '../../services/access.service';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
})
export class Header {
  readonly access = inject(AccessService);
  readonly favorites = inject(FavoritesService);
  private readonly router = inject(Router);

  toggleAccess() {
    this.access.toggle();
    if (!this.access.adultMode() && this.router.url.startsWith('/show/')) {
      void this.router.navigate(['/']);
    }
  }
}
