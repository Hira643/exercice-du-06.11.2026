#  TP Angular (3H) : TV Maze ExplorerBienvenue dans ce TP d'application pratique sous **Angular**. Vous allez développer une application web moderne de recherche et d'exploration de séries télévisées en vous appuyant sur l'API publique et gratuite **TV Maze**.
**API TV Maze** (aucune clé d'API requise) :
  * Recherche de séries : `GET https://api.tvmaze.com/search/shows?q={query}`  * Détails d'une série avec ses épisodes : `GET https://api.tvmaze.com/shows/{id}?embed=episodes`---##  1. Fonctionnalités à DévelopperL'application s'articule autour de **deux vues principales** et d'un **système de contrôle d'accès** ainsi qu'une **vue favoris** :### Header
**TvMaze :** Lien de retour vers l'acceuil
**Bouton :** Un bouton Toggle (Activer/Désactiver le "Mode Adulte" / "Accès Fiche").
**Favoris :** Lien vers la page des favoris
### Vue 1 : Accueil & Recherche (/)
**Barre de recherche :** Permet de saisir le nom d'une série.
**Grille de résultats :** Affiche les cartes des séries trouvées.
**Gestion des états :** Affichage d'un paragraphe de chargement **loading...** pendant les requêtes HTTP, et gestion du cas sans résultat (@empty).
### Composant : Carte
**Lien :** vers le detail d'une série
**Titre :** de la série.
**Image :** affiche de la série.
### Vue 2 : Fiche Détail d'une Série (/show/:id)
**Infos générales :** Grand visuel/affiche(original), résumé de la série (summary), statut(status).
**Liste des épisodes :** Affichage propre des épisodes (Saison, Numéro d'épisode, Titre).
### Sécurité & Routage (Guard)
**Functional Guard (adult.guard.ts) :** Protège l'accès à la route /show/:id. 
  * Si l'utilisateur n'a pas activé l'autorisation dans le header, l'accès à la fiche detail est bloqué.### Vue des Favoris ('/favorites')
**Grille de résultats :** Affiche les cartes des séries mises en favoris.
**Gestion des états :** Affichage d'un paragraphe de chargement **loading...** pendant les requêtes HTTP, et gestion du cas sans résultat (@empty).

Good luck & happy coding!