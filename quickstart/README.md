# TVmaze Explorer — TP Angular

Application standalone Angular : recherche, fiches et épisodes, guard fonctionnel et favoris persistants.

```bash
npm ci
npm start
```

Ouvrir **http://127.0.0.1:4201/**. Depuis la racine du dossier, `npm run start:angular` ou `./demarrer-angular.sh` lancent également cette application.
Sous Windows, double-cliquer sur `Lancer-TVmaze.cmd` lance le serveur dans Ubuntu. Garder sa fenêtre ouverte.
Le suivi des fichiers utilise `--poll 1000` pour détecter aussi les modifications faites depuis Windows sur le dossier partagé avec WSL.

## Utilisation

- `/` : recherche par titre (Sherlock au premier affichage), suggestions, cartes avec affiches et cœurs favoris.
- Activer **Mode adulte** dans le header avant de consulter une fiche. Ce mode est désactivé à chaque rechargement. Le désactiver depuis une fiche ramène à l’accueil.
- `/show/:id` : affiche originale, résumé, statut et épisodes filtrables par saison.
- `/favorites` : favoris sauvegardés dans le localStorage, actualisés via l’API. En cas de panne réseau, les copies locales restent affichées.
- Les états de chargement affichent `loading...`. Les listes vides utilisent `@empty`. Les erreurs et affiches absentes sont prises en charge.

## Organisation

```text
src/app/
├── components/header/           Navigation et toggle
├── components/show-card/        Carte réutilisable et cœur favori
├── guards/adult.guard.ts        Protection de /show/:id
├── models/show.ts               Types de l’API
├── pages/home/                  Recherche HTTP et annulation des anciennes requêtes
├── pages/show-detail/           Fiche et épisodes
├── pages/favorites/             Collection personnelle
├── services/access.service.ts  État partagé du mode adulte
├── services/favorites.service.ts  Persistance locale
└── services/tvmaze.service.ts   Appels HttpClient
```

Les anciens dossiers vides de la base sont conservés. Aucun compte ni clé API n’est nécessaire.
Le guard illustre le contrôle de navigation côté navigateur demandé dans le TP ; il ne constitue pas une authentification serveur.
Les résumés HTML passent par la sanitisation standard d’Angular via `[innerHTML]`.

## Vérification

```bash
npm run build
npm test -- --watch=false
```

Vérifier aussi : accès direct à une fiche avec le mode désactivé, activation et désactivation depuis une fiche, recherche sans résultat, ajout/retrait et conservation des favoris après rechargement, affichage mobile.

Documentation : [API TVmaze](https://www.tvmaze.com/api), [guards Angular](https://angular.dev/guide/routing/route-guards).
Données et images : [TVmaze](https://www.tvmaze.com), sous [CC BY-SA](https://creativecommons.org/licenses/by-sa/4.0/).
