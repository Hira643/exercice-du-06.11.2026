import { Routes } from '@angular/router';
import { adultGuard } from './guards/adult.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then((m) => m.Home) },
  {
    path: 'favorites',
    loadComponent: () => import('./pages/favorites/favorites').then((m) => m.Favorites),
  },
  {
    path: 'show/:id',
    canActivate: [adultGuard],
    loadComponent: () => import('./pages/show-detail/show-detail').then((m) => m.ShowDetail),
  },
  { path: '**', redirectTo: '' },
];
