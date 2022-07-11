#!/usr/bin/env bash
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
##@Version           :  202207111253-git
# @Author            :  Jason Hempstead
# @Contact           :  jason@casjaysdev.com
# @License           :  LICENSE.md
# @ReadME            :  entrypoint-aria2.sh --help
# @Copyright         :  Copyright: (c) 2022 Jason Hempstead, Casjays Developments
# @Created           :  Monday, Jul 11, 2022 12:53 EDT
# @File              :  entrypoint-aria2.sh
# @Description       :
# @TODO              :
# @Other             :
# @Resource          :
# @sudo/root         :  no
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
APPNAME="$(basename "$0" 2>/dev/null)"
VERSION="202207111253-git"
HOME="${USER_HOME:-$HOME}"
USER="${SUDO_USER:-$USER}"
RUN_USER="${SUDO_USER:-$USER}"
SRC_DIR="${BASH_SOURCE%/*}"
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Set bash options
if [[ "$1" == "--debug" ]]; then shift 1 && set -xo pipefail && export SCRIPT_OPTS="--debug" && export _DEBUG="on"; fi
trap 'exit $?' HUP INT QUIT TERM EXIT
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
__exec_bash() { [ -n "$1" ] && exec /bin/bash -c "${@:-bash}" || exec /bin/bash || exit 10; }
__find() { ls -A "$*" 2>/dev/null; }
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
DATA_DIR="${DATA_DIR:-$(__find /data/ 2>/dev/null | grep '^' || false)}"
CONFIG_DIR="${CONFIG_DIR:-$(__find /config/ 2>/dev/null | grep '^' || false)}"
export TZ="${TZ:-America/New_York}"
export HOSTNAME="${HOSTNAME:-casjaysdev-bin}"
ARIA2RPCPORT="${ARIA2RPCPORT:-6800}"
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
[[ -n "${TZ}" ]] && echo "${TZ}" >/etc/timezone
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
[[ -f "/usr/share/zoneinfo/${TZ}" ]] && ln -sf "/usr/share/zoneinfo/${TZ}" "/etc/localtime"
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
if [[ -n "${HOSTNAME}" ]]; then
  echo "${HOSTNAME}" >/etc/hostname
  echo "127.0.0.1 $HOSTNAME localhost" >/etc/hosts
fi
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
[[ -d "/config/" ]] && rm -Rf "/config/.gitkeep" || { [[ -n "$CONFIG_DIR" ]] && mkdir -p "/config/"; }
[[ -d "/data/" ]] && rm -Rf "/data/.gitkeep" || { [[ -n "$DATA_DIR" ]] && mkdir -p "/data/"; }
[[ -d "/bin/" ]] && rm -Rf "/bin/.gitkeep" || { [[ -n "$BIN_DIR" ]] && mkdir -p "/bin/"; }
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
if [[ -n "$CONFIG_DIR" ]]; then
  for config in $CONFIG_DIR; do
    if [[ -d "/config/$config" ]]; then
      cp -Rf "/config/$config/." "/etc/$config/"
    elif [[ -f "/config/$config" ]]; then
      cp -Rf "/config/$config" "/etc/$config"
    fi
  done
fi
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
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
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# set rpc secret
if [ -n "$RPC_SECRET" ]; then
  echo "Changing rpc secret to $RPC_SECRET"
  grep -sq "rpc-secret=*" "/etc/aria2.conf" ||
    echo "rpc-secret=$RPC_SECRET" >>"/etc/aria2.conf" ||
    sed -i "s|rpc-secret=.*|rpc-secret=$RPC_SECRET|g" "/etc/aria2.conf"
  sed -i "s|secret: |secret: $RPC_SECRET|g" "/usr/local/www/ariang/js/aria-ng-f1dd57abb9.min.js"
fi
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
[ -d "/etc/nginx" ] && cp -Rf "/etc/nginx/." "/aria2/config/nginx/"
[ -f "/etc/aria2.conf" ] && cp -Rf "/etc/aria2.conf" "/aria2/config/aria2.conf"
[ -f "/aria2/config/aria2.session" ] || touch "/aria2/config/aria2.session"
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
case "$1" in
--help)
  echo 'Docker container for '$APPNAME''
  echo "Usage: $APPNAME [healthcheck, bash, command]"
  echo
  exitCode=$?
  ;;
healthcheck)
  if curl -q -LSsf -o /dev/null -s -w "200" "http://localhost:$ARIA2RPCPORT"; then
    echo "OK"
    exit 0
  else
    echo "FAIL"
    exit 10
  fi
  ;;
sh | bash | shell | */bin/sh | */bin/bash)
  shift 1
  __exec_bash "$@"
  exitCode=$?
  ;;
*)
  echo starting server on $ARIA2RPCPORT
  [ -f "/etc/nginx/nginx.conf" ] && nginx -c /etc/nginx/nginx.conf &
  [ -f "/etc/aria2.conf" ] && exec aria2c --conf-path="/etc/aria2.conf" || exit 10

  ;;
esac
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
exit ${exitCode:-$?}
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
#end
