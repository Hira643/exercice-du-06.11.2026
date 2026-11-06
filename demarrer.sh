#!/usr/bin/env bash
set -e
cd -- "$(dirname -- "$0")"
printf "Ouvre http://localhost:8000 dans le navigateur.\n"
exec python3 -m http.server 8000 --bind 127.0.0.1
