# Exercice du 06/11/2026

Ce projet nettoye est maintenant place directement dans le dossier Windows `cda 1/exercice du 06.11.2026`.
Les dependances et les resultats de compilation ne sont pas copies depuis Ubuntu.
Pour Angular, `./demarrer-angular.sh` installe automatiquement les dependances dans ce dossier au premier lancement.

La structure du dossier Windows ekiwax est reprise ici, avec les memes noms de dossiers personnels.
Le code des anciens exercices, leurs jeux de donnees et leurs images ne sont pas recopies.
Les dossiers correspondants sont conserves, y compris components, pages, services, guards et models.
Les configurations de projet et les fichiers de dependances sont conserves.
Les dossiers techniques node_modules, dist, .angular et .cache sont regeneres sous Ubuntu par les outils.
Le dossier Windows original reste intact.

## Ouvrir dans Ubuntu

```bash
cd "/mnt/c/Users/Ekiwax/Documents/HTML CSS PREPANUM/cda 1/exercice du 06.11.2026"
code .
```

## Base HTML, CSS et JavaScript

```bash
./demarrer.sh
```

Ouvrir http://localhost:8000. Ctrl+C arrete le serveur.
Commencer dans index.html, workspace/bases/css/style.css et workspace/bases/js/shop.js.
Les fichiers css/style.css et js/script.js du premier dossier de depart sont egalement conserves, vides.

## Base Angular quickstart

```bash
./demarrer-angular.sh
```

Ouvrir http://localhost:4201 une fois la compilation terminee.
Le TP **TVmaze Explorer** est réalisé dans `quickstart` : recherche de séries, fiches avec épisodes, mode adulte protégé par un guard et favoris persistants.
Voir `quickstart/README.md` pour les fichiers, le fonctionnement et les commandes de vérification.
Les dossiers vides des anciens composants sont conservés.

## Autres bases conservees

- projets/clement : HTML et CSS.
- projets/kanto-odyssee-rxjs : JavaScript, RxJS et Vite, avec npm ci puis npm run dev.
- projets/pokemon-game-angular : deuxieme base Angular, avec npm ci puis npm start, sur le port 4202.
- assets-generated : anciens dossiers d'images conserves, vides.
- workspace/bases : base HTML, CSS et JavaScript.

## Sauvegarde avant transfert

/home/ekiwax/projets/sauvegardes/exercice-06-11-2026-avant-transfert-20261105-170046.tar.gz
