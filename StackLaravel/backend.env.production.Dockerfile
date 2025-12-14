FROM php:8.4-fpm
RUN apt-get update && \
    apt-get install -y \ 
        libpq-dev 
RUN docker-php-ext-install pdo pdo_pgsql pgsql 
WORKDIR /var/www/html
COPY . .
RUN rm -rf node_modules
RUN rm -rf package-lock.json
EXPOSE 7575
CMD ["php","artisan","serve","--env=production","--host","0.0.0.0"]