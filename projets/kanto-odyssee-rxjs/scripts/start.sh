#!/usr/bin/env bash
set -e
cd -- "$(dirname -- "$0")/.."
if [ ! -x node_modules/.bin/vite ]; then
  npm ci
fi
exec npm run dev
