#!/usr/bin/env bash
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
##@Version           :  202505131551-git
# @@Author           :  CasjaysDev
# @@Contact          :  CasjaysDev <docker-admin@casjaysdev.pro>
# @@License          :  MIT
# @@ReadME           :
# @@Copyright        :  Copyright 2023 CasjaysDev
# @@Created          :  Mon Aug 28 06:48:42 PM EDT 2023
# @@File             :  05-custom.sh
# @@Description      :  script to run custom
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# shellcheck shell=bash
# shellcheck disable=SC2016
# shellcheck disable=SC2031
# shellcheck disable=SC2120
# shellcheck disable=SC2155
# shellcheck disable=SC2199
# shellcheck disable=SC2317
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Set bash options
set -o pipefail
[ "$DEBUGGER" = "on" ] && echo "Enabling debugging" && set -x$DEBUGGER_OPTIONS
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Set env variables
exitCode=0
ARIANG_TEMP_FILE="/tmp/AriaNg.zip"
ARIANG_HOME="/usr/local/share/ariang"
ARIANG_VERSION="${ARIANG_VERSION:-1.3.9}"
ARIANG_LASTEST="$(curl -q -LSsf "https://api.github.com/repos/mayswind/AriaNg/releases" | jq -rc '.[].tag_name' | sort -rV | head -n1 | grep '^' || false)"
ARIANG_ARCHIVE_FILE="https://github.com/mayswind/AriaNg/releases/download/${ARIANG_LASTEST:-$ARIANG_VERSION}/AriaNg-${ARIANG_LASTEST:-$ARIANG_VERSION}.zip"
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Predefined actions
\rm -Rf "${ARIANG_HOME:?}"
\mkdir -p "${ARIANG_HOME:?}"
if curl -q -LSsf "$ARIANG_ARCHIVE_FILE" -o "$ARIANG_TEMP_FILE"; then
  unzip -qq "$ARIANG_TEMP_FILE" -d "$ARIANG_HOME"
  exitCode=$?
else
  exitCode=9
fi
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Main script

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Set the exit code
#exitCode=$?
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
exit $exitCode
