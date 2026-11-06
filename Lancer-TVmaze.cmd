@echo off
title TVmaze Explorer
echo Demarrage de TVmaze dans Ubuntu...
echo Attendez la fin de la compilation puis ouvrez http://127.0.0.1:4201/
echo Gardez cette fenetre ouverte pendant l'utilisation du site.
wsl.exe -d Ubuntu --cd "%~dp0." -- bash ./demarrer-angular.sh
pause
