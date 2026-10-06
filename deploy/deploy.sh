#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if [[ ! -f .env ]]; then
  echo ".env is missing from the uploaded release." >&2
  exit 1
fi

chmod 600 .env
chmod -R ug+rwx storage bootstrap/cache

if command -v php >/dev/null 2>&1; then
  PHP_BIN="$(command -v php)"
else
  PHP_BIN="$(ls -d /opt/cpanel/ea-php8*/root/usr/bin/php 2>/dev/null | sort | tail -n 1)"
fi

if [[ -z "${PHP_BIN}" ]]; then
  echo "PHP was not found on this cPanel account." >&2
  exit 1
fi

"$PHP_BIN" artisan migrate --force
"$PHP_BIN" artisan storage:link || true
"$PHP_BIN" artisan config:cache
"$PHP_BIN" artisan route:cache
"$PHP_BIN" artisan view:cache
