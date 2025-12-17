FROM postgres:15.3-alpine3.18
COPY init-db.env.production.sh /docker-entrypoint-initdb.d