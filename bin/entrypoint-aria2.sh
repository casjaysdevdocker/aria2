#!/usr/bin/env bash
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
##@Version           :  202207112232-git
# @Author            :  Jason Hempstead
# @Contact           :  jason@casjaysdev.com
# @License           :  LICENSE.md
# @ReadME            :  entrypoint-aria2.sh --help
# @Copyright         :  Copyright: (c) 2022 Jason Hempstead, Casjays Developments
# @Created           :  Monday, Jul 11, 2022 22:32 EDT
# @File              :  entrypoint-aria2.sh
# @Description       :
# @TODO              :
# @Other             :
# @Resource          :
# @sudo/root         :  no
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Set bash options
[ -n "$DEBUG" ] && set -x
set -o pipefail
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
APPNAME="$(basename "$0" 2>/dev/null)"
VERSION="202207112232-git"
HOME="${USER_HOME:-$HOME}"
USER="${SUDO_USER:-$USER}"
RUN_USER="${SUDO_USER:-$USER}"
SRC_DIR="${BASH_SOURCE%/*}"
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Set functions
__exec_bash() {
  local cmd="${*:-/bin/bash}"
  local exitCode=0
  echo "Executing command: $cmd"
  $cmd || exitCode=10
  return ${exitCode:-$?}
}
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
__find() { ls -A "$*" 2>/dev/null; }
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Define default variables
TZ="${TZ:-America/New_York}"
HOSTNAME="${HOSTNAME:-casjaysdev-bin}"
BIN_DIR="${BIN_DIR:-/usr/local/bin}"
DATA_DIR="${DATA_DIR:-$(__find /data/ 2>/dev/null | grep '^' || false)}"
CONFIG_DIR="${CONFIG_DIR:-$(__find /config/ 2>/dev/null | grep '^' || false)}"
CONFIG_COPY="${CONFIG_COPY:-false}"
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Additional variables
ARIA2RPCPORT="${ARIA2RPCPORT:-6800}"

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Export variables
export TZ HOSTNAME
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# import variables from file
[[ -f "/root/env.sh" ]] && . "/root/env.sh"
[[ -f "/config/.env.sh" ]] && . "/config/.env.sh"
[[ -f "/root/env.sh" ]] && [[ ! -f "/config/.env.sh" ]] && cp -Rf "/root/env.sh" "/config/.env.sh"
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Set timezone
[[ -n "${TZ}" ]] && echo "${TZ}" >/etc/timezone
[[ -f "/usr/share/zoneinfo/${TZ}" ]] && ln -sf "/usr/share/zoneinfo/${TZ}" "/etc/localtime"
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Set hostname
if [[ -n "${HOSTNAME}" ]]; then
  echo "${HOSTNAME}" >/etc/hostname
  echo "127.0.0.1 ${HOSTNAME} localhost ${HOSTNAME}.local" >/etc/hosts
fi
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Delete any gitkeep files
[[ -n "${CONFIG_DIR}" ]] && { [[ -d "${CONFIG_DIR}" ]] && rm -Rf "${CONFIG_DIR}/.gitkeep" || mkdir -p "/config/"; }
[[ -n "${DATA_DIR}" ]] && { [[ -d "${DATA_DIR}" ]] && rm -Rf "${DATA_DIR}/.gitkeep" || mkdir -p "/data/"; }
[[ -n "${BIN_DIR}" ]] && { [[ -d "${BIN_DIR}" ]] && rm -Rf "${BIN_DIR}/.gitkeep" || mkdir -p "/bin/"; }
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Copy config files to /etc
if [[ -n "${CONFIG_DIR}" ]] && [[ "${CONFIG_COPY}" = "true" ]]; then
  for config in ${CONFIG_DIR}; do
    if [[ -d "/config/$config" ]]; then
      [[ -d "/etc/$config" ]] || mkdir -p "/etc/$config"
      cp -Rf "/config/$config/." "/etc/$config/"
    elif [[ -f "/config/$config" ]]; then
      cp -Rf "/config/$config" "/etc/$config"
    fi
  done
fi
[[ -f "/etc/.env.sh" ]] && rm -Rf "/etc/.env.sh"
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Additional commands
if [ -f "/aria2/config/ariang.js" ]; then
  ln -sf "/aria2/config/ariang.js" "/usr/local/www/ariang/js/aria-ng-f1dd57abb9.min.js"
else
  cp -Rf "/etc/ariang.js" "/aria2/config/ariang.js"
  ln -sf "/aria2/config/ariang.js" "/usr/local/www/ariang/js/aria-ng-f1dd57abb9.min.js"
fi
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
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
--help) # Help message
  echo 'Docker container for '$APPNAME''
  echo "Usage: $APPNAME [healthcheck, bash, command]"
  echo "Failed command will have exit code 10"
  echo
  exitCode=$?
  ;;

healthcheck) # Docker healthcheck
  if curl -q -LSsf -o /dev/null -s -w "200" "http://localhost:$ARIA2RPCPORT"; then
    echo "$(uname -s) $(uname -m) is running"
    exit 0
  else
    echo "FAIL"
    exit 10
  fi
  exitCode=$?
  ;;

*/bin/sh | */bin/bash | bash | shell | sh) # Launch shell
  shift 1
  __exec_bash "${@:-/bin/bash}"
  exitCode=$?
  ;;

*) # Execute primary command
  [ -f "/etc/nginx/nginx.conf" ] && nginx -c /etc/nginx/nginx.conf &
  if [[ $# -eq 0 ]]; then
    [ -f "/etc/aria2.conf" ] &&
      __exec_bash aria2c --conf-path="/etc/aria2.conf" || exit 10
  else
    __exec_bash "/bin/bash"
  fi
  exitCode=$?
  ;;
esac
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# end of entrypoint
exit ${exitCode:-$?}
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
