FROM postgres:15.3-alpine3.18
COPY init-db.sh /docker-entrypoint-initdb.d