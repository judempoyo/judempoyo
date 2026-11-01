FROM node:alpine AS builder
WORKDIR /app

ARG NUXT_APP_BASE_URL=/
ARG NUXT_PUBLIC_SITE_URL=https://jude.jkantech.net
ARG NUXT_PUBLIC_WHATSAPP_NUMBER=243975889135

ENV NUXT_APP_BASE_URL=${NUXT_APP_BASE_URL}
ENV NUXT_PUBLIC_SITE_URL=${NUXT_PUBLIC_SITE_URL}
ENV NUXT_PUBLIC_WHATSAPP_NUMBER=${NUXT_PUBLIC_WHATSAPP_NUMBER}

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build && \
    if [ ! -d "dist" ] && [ -d ".output/public" ]; then cp -r .output/public dist; fi

FROM php:8.3-apache
WORKDIR /var/www/html

RUN mkdir -p /data && chown www-data:www-data /data

ENV TMPDIR=/data

COPY --from=builder /app/dist/ /var/www/html/

EXPOSE 80
