#!/bin/sh
# Migrações NÃO podem usar o pooler em Transaction mode (porta 6543): causa "prepared statement already exists".
# Use MIGRATE_DATABASE_URL com Session mode (porta 5432 no mesmo host do pooler) ou conexão direta.
export MIGRATE_URL="${MIGRATE_DATABASE_URL:-$DATABASE_URL}"
if echo "$MIGRATE_URL" | grep -q ':6543'; then
  echo "WARNING: Migrations cannot use Transaction pooler (port 6543). Set MIGRATE_DATABASE_URL to Session pooler (port 5432). Skipping migrate, starting app..."
else
  echo "Running migrations..."
  DATABASE_URL="$MIGRATE_URL" npx prisma migrate deploy > /tmp/migrate.log 2>&1
  EXIT=$?
  cat /tmp/migrate.log
  if [ "$EXIT" -ne 0 ]; then
    if grep -q "P3005\|schema is not empty" /tmp/migrate.log 2>/dev/null; then
      echo "Database schema already exists (P3005). Starting app..."
    else
      echo "Migration failed (exit $EXIT)." >&2
      exit $EXIT
    fi
  fi
fi
echo "Starting application..."
exec node dist/src/main
