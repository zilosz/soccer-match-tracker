#!/bin/bash
set -e

until mysqladmin ping -h "localhost" --silent; do
  echo "Waiting for MySQL server..."
  sleep 2
done

echo "MySQL server is up!"

mysql -u "root" -p"$MYSQL_ROOT_PASSWORD" <<-EOSQL
  GRANT SELECT, INSERT, UPDATE, DELETE ON ${MYSQL_DATABASE}.* TO '${MYSQL_USER}'@'%';
  FLUSH PRIVILEGES;
EOSQL
