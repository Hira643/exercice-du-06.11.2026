#!/usr/bin/env bash
set -e
cd -- "$(dirname -- "$0")/quickstart"
if ! command -v node >/dev/null 2>&1 && [ -s "$HOME/.nvm/nvm.sh" ]; then
  . "$HOME/.nvm/nvm.sh"
  nvm use --silent 24
fi
if ! command -v node >/dev/null 2>&1; then
  printf "Node.js est necessaire pour Angular.\n" >&2
  exit 1
fi
if [ ! -x node_modules/.bin/ng ]; then
  npm ci
fi
exec npm start
