#!/usr/bin/env bash
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
##@Version           :  202605101200-git
# @@Author           :  CasjaysDev
# @@Contact          :  CasjaysDev <docker-admin@casjaysdev.pro>
# @@License          :  MIT
# @@ReadME           :
# @@Copyright        :  Copyright 2026 CasjaysDev
# @@Created          :  Mon Aug 28 06:48:42 PM EDT 2023
# @@File             :  05-custom.sh
# @@Description      :  build-time custom: install AriaNg from prebundled zip + wipe-and-replace configs
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# shellcheck shell=bash
# shellcheck disable=SC2016,SC2031,SC2120,SC2155,SC2199,SC2317
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Set bash options
set -o pipefail
[ "$DEBUGGER" = "on" ] && echo "Enabling debugging" && set -x$DEBUGGER_OPTIONS
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Set env variables
exitCode=0
ARIANG_HOME="/usr/local/share/ariang"
ARIANG_SRC_DIR="/tmp/ariang-src"
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Wipe-and-replace per-service configs (per template §4)
for d in aria2 nginx; do
  [ -d "/tmp/etc/$d" ] || continue
  echo "Wiping /etc/$d and copying from /tmp/etc/$d"
  rm -Rf "/etc/$d"/*
  cp -Rf "/tmp/etc/$d/." "/etc/$d/"
  # restage template-files/config so first-run seed gets the optimized config
  mkdir -p "/usr/local/share/template-files/config/$d"
  cp -Rf "/etc/$d/." "/usr/local/share/template-files/config/$d/"
done
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Install AriaNg from the host-prebundled zip (buildx network can't reach github reliably)
\rm -Rf "${ARIANG_HOME:?}"
\mkdir -p "${ARIANG_HOME:?}"
ARIANG_ZIP=""
if [ -d "$ARIANG_SRC_DIR" ]; then
  ARIANG_ZIP="$(ls -1 "$ARIANG_SRC_DIR"/AriaNg-*.zip 2>/dev/null | head -n1 || true)"
fi
if [ -n "$ARIANG_ZIP" ] && [ -f "$ARIANG_ZIP" ]; then
  echo "Extracting prebundled AriaNg: $ARIANG_ZIP -> $ARIANG_HOME"
  unzip -qq "$ARIANG_ZIP" -d "$ARIANG_HOME"
  exitCode=$?
else
  echo "ERROR: AriaNg zip not found at $ARIANG_SRC_DIR/AriaNg-*.zip" >&2
  echo "       Place AriaNg-X.Y.Z.zip from https://github.com/mayswind/AriaNg/releases there." >&2
  exitCode=9
fi
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Create runtime dirs that aria2 + nginx need on first start
mkdir -p /run/nginx /run/aria2 /data/downloads/aria2 /data/logs/aria2 /data/logs/nginx /var/log/nginx
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
exit $exitCode
