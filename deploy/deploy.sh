#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

git pull --ff-only origin main

if [[ -z "${ENV_FILE_B64:-}" ]]; then
  echo "ENV_FILE_B64 is missing. Set the ENV_PRODUCTION GitHub secret." >&2
  exit 1
fi

printf '%s' "$ENV_FILE_B64" | tr -d '[:space:]' | base64 -d > .env
chmod 600 .env

if command -v composer >/dev/null 2>&1; then
  composer install --no-dev --optimize-autoloader --no-interaction
else
  php composer.phar install --no-dev --optimize-autoloader --no-interaction
fi

php artisan migrate --force
php artisan storage:link || true
php artisan config:cache
php artisan route:cache
php artisan view:cache

rm -rf public/dashboard
