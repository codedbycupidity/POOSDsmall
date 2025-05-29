FROM php:8.2-apache

RUN apt-get update && apt-get install -y \
    libzip-dev \
    libpng-dev \
    && docker-php-ext-install pdo_mysql mysqli zip

RUN a2enmod rewrite
