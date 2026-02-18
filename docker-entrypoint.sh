#!/bin/sh
# Migrações: use MIGRATE_DATABASE_URL (Session pooler ou direct) se definida.
export MIGRATE_URL="${MIGRATE_DATABASE_URL:-$DATABASE_URL}"
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
echo "Starting application..."
exec node dist/src/main
