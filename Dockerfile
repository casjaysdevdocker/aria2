FROM casjaysdevdocker/nginx:latest as build

ARG ARIANG_VERSION=1.2.4 \
  DOMAIN=0.0.0.0:8080


RUN mkdir -p /bin/ /config/ /data/ && \
  rm -Rf /bin/.gitkeep /config/.gitkeep /data/.gitkeep && \
  apk -U update && \
  apk add --no-cache \
  aria2 \
  unzip && \
  rm -R /etc/nginx && \
  mkdir -p /aria2/config /aria2/data /tmp/ariang /usr/local/www/ariang && \
  cd /tmp/ariang && \
  curl -q -LSsf https://github.com/mayswind/AriaNg/releases/download/$ARIANG_VERSION/AriaNg-$ARIANG_VERSION.zip -o /tmp/AriaNg-$ARIANG_VERSION.zip && \
  unzip /tmp/AriaNg-$ARIANG_VERSION.zip && \
  rsync -ahP /tmp/ariang/. /usr/local/www/ariang/ && \
  rm -Rf /tmp/ariang

WORKDIR /usr/local/www/ariang

COPY ./config/. /etc/
COPY ./data/. /data/
COPY ./bin/. /usr/local/bin/

FROM scratch
ARG BUILD_DATE="$(date +'%Y-%m-%d %H:%M')"

LABEL org.label-schema.name="aria2" \
  org.label-schema.description="Aria2 downloader and AriaNg webui Docker image based on Alpine Linux" \
  org.label-schema.url="https://github.com/casjaysdevdocker/aria2/aria2" \
  org.label-schema.vcs-url="https://github.com/casjaysdevdocker/aria2/aria2" \
  org.label-schema.build-date=$BUILD_DATE \
  org.label-schema.version=$BUILD_DATE \
  org.label-schema.vcs-ref=$BUILD_DATE \
  org.label-schema.license="WTFPL" \
  org.label-schema.vcs-type="Git" \
  org.label-schema.schema-version="latest" \
  org.label-schema.vendor="CasjaysDev" \
  maintainer="CasjaysDev <docker-admin@casjaysdev.com>"

ENV SHELL="/bin/bash" \
  TERM="xterm-256color" \
  HOSTNAME="casjaysdev-aria2" \
  TZ="${TZ:-America/New_York}"

WORKDIR /aria2
VOLUME ["/aria2/data", "/aria2/config"]
EXPOSE 6800

COPY --from=build /. /

HEALTHCHECK CMD [ "/usr/local/bin/entrypoint-aria2.sh", "healthcheck" ]
ENTRYPOINT [ "/usr/local/bin/entrypoint-aria2.sh" ]

