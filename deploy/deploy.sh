#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

git pull --ff-only origin main
composer install --no-dev --optimize-autoloader --no-interaction
npm ci --prefix dashboard
npm run build --prefix dashboard
php artisan migrate --force
php artisan storage:link || true
php artisan config:cache
php artisan route:cache
php artisan view:cache

if command -v caddy >/dev/null 2>&1; then
  caddy reload --config /etc/caddy/Caddyfile || true
fi
