FROM php:8.3-fpm

RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    locales \
    zip \
    jpegoptim optipng pngquant gifsicle \
    vim \
    unzip \
    git \
    curl \
    libzip-dev \
    libonig-dev \
    libpq-dev \
    && docker-php-ext-install pdo_mysql mbstring zip exif pcntl \
    && docker-php-ext-install gd

# Composer telepítése
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Munkakönyvtár beállítása
WORKDIR /var/www

# Fájlok másolása és jogosultságok
COPY . .
RUN chown -R www-data:www-data /var/www
RUN chmod -R 775 /var/www/storage

# Expose port
EXPOSE 9000

# Az ENTRYPOINT törölve, így az alap `php-fpm` parancs fog lefutni,
# ami tökéletes.
CMD ["php-fpm"]