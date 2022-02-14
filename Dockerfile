FROM casjaysdev/alpine:latest AS build

ENV \
  ARIANG_VERSION=1.2.3 \
  DOMAIN=0.0.0.0:8080 

RUN apk -U upgrade && \
  apk add --no-cache \
  nginx \
  aria2 && \
  rm -R /etc/nginx && \
  mkdir -p /aria2/config /aria2/data /usr/local/www/ariang

# AriaNG
WORKDIR /usr/local/www/ariang
COPY ./src/web/. ./

# config files
COPY ./config/. /etc/
COPY ./bin/. /usr/local/bin/

FROM build
ARG BUILD_DATE="$(date +'%Y-%m-%d %H:%M')" 

LABEL \
  org.label-schema.name="aria2" \
  org.label-schema.description="Aria2 downloader and AriaNg webui Docker image based on Alpine Linux" \
  org.label-schema.url="https://github.com/casjaysdev/aria2" \
  org.label-schema.vcs-url="https://github.com/casjaysdev/aria2" \
  org.label-schema.build-date=$BUILD_DATE \
  org.label-schema.version=$BUILD_DATE \
  org.label-schema.vcs-ref=$BUILD_DATE \
  org.label-schema.license="MIT" \
  org.label-schema.vcs-type="Git" \
  org.label-schema.schema-version="1.0" \
  org.label-schema.vendor="CasjaysDev" \
  maintainer="CasjaysDev <docker-admin@casjaysdev.com>" 

WORKDIR /aria2
VOLUME ["/aria2/data", "/aria2/config"]

EXPOSE 6800

HEALTHCHECK CMD ["/usr/local/bin/entrypoint-aria2.sh", "healthcheck"]
ENTRYPOINT ["/usr/local/bin/entrypoint-aria2.sh"]
