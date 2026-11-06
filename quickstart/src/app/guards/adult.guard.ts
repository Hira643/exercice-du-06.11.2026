import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccessService } from '../services/access.service';

// Le toggle est une autorisation pédagogique, pas une authentification serveur.
export const adultGuard: CanActivateFn = () => {
  const access = inject(AccessService);
  if (access.adultMode()) return true;

  access.message.set(
    'Accès à la fiche bloqué. Activez le mode adulte dans le menu pour consulter les détails.',
  );
  return inject(Router).createUrlTree(['/']);
};
