#!/usr/bin/env bash
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
##@Version       : 202202020147-git
# @Author        : Jason Hempstead
# @Contact       : jason@casjaysdev.com
# @License       : WTFPL
# @ReadME        : docker-entrypoint --help
# @Copyright     : Copyright: (c) 2022 Jason Hempstead, Casjays Developments
# @Created       : Wednesday, Feb 02, 2022 01:47 EST
# @File          : docker-entrypoint
# @Description   :
# @TODO          :
# @Other         :
# @Resource      :
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
APPNAME="$(basename "$0")"
VERSION="202202020147-git"
USER="${SUDO_USER:-${USER}}"
HOME="${USER_HOME:-${HOME}}"
SRC_DIR="${BASH_SOURCE%/*}"
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Set bash options
if [[ "$1" == "--debug" ]]; then shift 1 && set -xo pipefail && export SCRIPT_OPTS="--debug" && export _DEBUG="on"; fi
trap 'exitCode=${exitCode:-$?};[ -n "$DOCKER_ENTRYPOINT_TEMP_FILE" ] && [ -f "$DOCKER_ENTRYPOINT_TEMP_FILE" ] && rm -Rf "$DOCKER_ENTRYPOINT_TEMP_FILE" &>/dev/null' EXIT

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
ARIA2RPCPORT="${ARIA2RPCPORT:-6800}"
export TZ="${TZ:-America/New_York}"
export HOSTNAME="${HOSTNAME:-casjaysdev-aria2}"

[ -n "${TZ}" ] && echo "${TZ}" >/etc/timezone
[ -n "${HOSTNAME}" ] && echo "${HOSTNAME}" >/etc/hostname
[ -n "${HOSTNAME}" ] && echo "127.0.0.1 $HOSTNAME localhost" >/etc/hosts
[ -f "/usr/share/zoneinfo/${TZ}" ] && ln -sf "/usr/share/zoneinfo/${TZ}" "/etc/localtime"

# copy nginx config
[ -d "/aria2/config/nginx" ] &&
  cp -Rf "/aria2/config/nginx/." "/etc/nginx/"

# copy aria config
[ -f "/aria2/config/aria2.conf" ] &&
  cp -Rf "/aria2/config/aria2.conf" "/etc/aria2.conf"

# copy ariang js script to webdir
if [ -f "/aria2/config/ariang.js" ]; then
  ln -sf "/aria2/config/ariang.js" "/usr/local/www/ariang/js/aria-ng-f1dd57abb9.min.js"
else
  cp -Rf "/etc/ariang.js" "/aria2/config/ariang.js"
  ln -sf "/aria2/config/ariang.js" "/usr/local/www/ariang/js/aria-ng-f1dd57abb9.min.js"
fi

# allow Changing of port [unsupported]
if [[ -n "$ARIA2RPCPORT" ]] && [[ "$ARIA2RPCPORT" != "6800" ]]; then
  echo "Changing rpc request port to $ARIA2RPCPORT"
  sed -i "s|6800|${ARIA2RPCPORT}|g" "/etc/nginx/nginx.conf"
  sed -i "ss|6800|${ARIA2RPCPORT}|g" ""
fi

# set rpc secret
if [ -n "$RPC_SECRET" ]; then
  echo "Changing rpc secret to $RPC_SECRET"
  grep -sq "rpc-secret=*" "/etc/aria2.conf" ||
    echo "rpc-secret=$RPC_SECRET" >>"/etc/aria2.conf" ||
    sed -i "s|rpc-secret=.*|rpc-secret=$RPC_SECRET|g" "/etc/aria2.conf"
  sed -i "s|secret: |secret: $RPC_SECRET|g" "/usr/local/www/ariang/js/aria-ng-f1dd57abb9.min.js"
fi

# create directories
[[ -d "/aria2/config" ]] || mkdir -p "/aria2/config"
[[ -d "/aria2/data" ]] || mkdir -p "/aria2/data"
chmod -Rf 777 "/aria2"

#
[ -d "/etc/nginx" ] && cp -Rf "/etc/nginx/." "/aria2/config/nginx/"
[ -f "/etc/aria2.conf" ] && cp -Rf "/etc/aria2.conf" "/aria2/config/aria2.conf"
[ -f "/aria2/config/aria2.session" ] || touch "/aria2/config/aria2.session"

case "$1" in
healthcheck)
  if curl -q -LSsf -o /dev/null -s -w "200" "http://localhost:$ARIA2RPCPORT"; then
    echo "OK"
    exit 0
  else
    echo "FAIL"
    exit 10
  fi
  ;;

bash | shell | sh)
  ARGS="$*"
  exec /bin/bash ${ARGS:-}
  ;;

*)
  [ -f "/etc/nginx/nginx.conf" ] && nginx -c /etc/nginx/nginx.conf &
  [ -f "/etc/aria2.conf" ] && exec aria2c --conf-path="/etc/aria2.conf" || exit 10
  ;;
esac
