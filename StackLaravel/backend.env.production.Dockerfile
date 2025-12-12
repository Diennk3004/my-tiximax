FROM php:8.4-fpm
RUN apt-get update
RUN apt-get install -y libpq-dev && docker-php-ext-install pdo pdo_pgsql pgsql
RUN rm -rf /var/www/html/
COPY . .
EXPOSE 7575
CMD ["php","artisan","serve","--env=production","--host","0.0.0.0"]