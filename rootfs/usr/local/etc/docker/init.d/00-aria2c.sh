#!/usr/bin/env bash
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# https://www.gnu.org/software/bash/manual/html_node/The-Set-Builtin.html
[ "$DEBUGGER" = "on" ] && echo "Enabling debugging" && set -o pipefail -x$DEBUGGER_OPTIONS || set -o pipefail
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
export PATH="/usr/local/etc/docker/bin:/usr/local/bin:/usr/bin:/usr/sbin:/bin:/sbin"
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# run trap command on exit
trap 'retVal=$?;[ "$SERVICE_IS_RUNNING" != "true" ] && [ -f "/run/init.d/$EXEC_CMD_BIN.pid" ] && rm -Rf "/run/init.d/$EXEC_CMD_BIN.pid";exit $retVal' SIGINT SIGTERM EXIT
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# import the functions file
if [ -f "/usr/local/etc/docker/functions/entrypoint.sh" ]; then
  . "/usr/local/etc/docker/functions/entrypoint.sh"
fi
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# import variables
for set_env in "/root/env.sh" "/usr/local/etc/docker/env"/*.sh "/config/env"/*.sh; do
  [ -f "$set_env" ] && . "$set_env"
done
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Custom functions

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# execute command variables
WORKDIR=""                                        # set working directory
SERVICE_UID="0"                                   # set the user id
SERVICE_USER="root"                               # execute command as another user
SERVICE_PORT=""                                   # port which service is listening on
EXEC_CMD_BIN="aria2c"                             # command to execute
EXEC_CMD_ARGS="--conf-path=/etc/aria2/aria2.conf" # command arguments
PRE_EXEC_MESSAGE=""                               # Show message before execute
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Other variables that are needed
ARIA2RPCPORT="${ARIA2RPCPORT:-$SERVICE_PORT}"
etc_dir="/etc/aria2"
conf_dir="/config/aria2"
www_dir="/usr/local/share/ariang"
data_dir="$(grep -Rs 'dir=' "/config/aria2/aria2.conf" | awk -F'=' '{print $2}')"
get_config="$(find "$www_dir/js" -name 'aria-ng-*.min.js' | grep -v 'f1dd57abb9.min' | head -n1)"
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# use this function to update config files - IE: change port
__update_conf_files() {
  [ -d "$etc_dir" ] || mkdir -p "$etc_dir"
  [ -d "$data_dir" ] || mkdir -p "$data_dir"
  cp -Rf "$conf_dir/." "$etc_dir/"
  if [ -f "$etc_dir/aria-ng.config.js" ]; then
    rm -Rf "$get_config"
    ln -sf "$etc_dir/aria-ng.config.js" "$get_config"
    ln -sf "$etc_dir/aria-ng.config.js" "$www_dir/js/aria-ng-f1dd57abb9.min.js"
    [ -n "$CONTAINER_IP_ADDRESS" ] && sed "s|127.0.0.1|0.0.0.0|g" "$etc_dir/aria-ng.config.js"
  fi
  if [ -n "$RPC_SECRET" ]; then
    echo "Changing rpc secret to $RPC_SECRET"
    if grep -sq "rpc-secret=*" "$etc_dir/aria2.conf"; then
      sed -i "s|secret: '',|secret: ''$RPC_SECRET'',|g" "$www_dir/js/aria-ng.config.js"
      sed -i "s|rpc-secret=.*|rpc-secret=$RPC_SECRET|g" "$etc_dir/aria2.conf"
    else
      echo "rpc-secret=$RPC_SECRET" >>"$etc_dir/aria2.conf"
    fi
  fi
  return 0
}
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# use this function to setup ssl support
__update_ssl_conf() {

  return 0
}
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# function to run before executing
__pre_execute() {
  [ -n "$PRE_EXEC_MESSAGE" ] && echo "$PRE_EXEC_MESSAGE"

  return 0
}
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# script to start server
__run_start_script() {
  case "$1" in
  check) shift 1 && __pgrep $EXEC_CMD_BIN || return 5 ;;
  *) su_cmd $EXEC_CMD_BIN $EXEC_CMD_ARGS || return 10 ;;
  esac
}
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# process check functions
__pcheck() { [ -n "$(type -P pgrep 2>/dev/null)" ] && pgrep -x "$1" &>/dev/null && return 0 || return 10; }
__pgrep() { __pcheck "${1:-EXEC_CMD_BIN}" || __ps aux 2>/dev/null | grep -Fw " ${1:-$EXEC_CMD_BIN}" | grep -qv ' grep' | grep '^' && return 0 || return 10; }
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Allow ENV_ variable
[ -f "/config/env/$EXEC_CMD_BIN.sh" ] && "/config/env/$EXEC_CMD_BIN.sh" # Import env file
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
WORKDIR="${ENV_WORKDIR:-$WORKDIR}"                            # change to directory
SERVICE_USER="${ENV_SERVICE_USER:-$SERVICE_USER}"             # execute command as another user
SERVICE_UID="${ENV_SERVICE_UID:-$SERVICE_UID}"                # set the user id
SERVICE_PORT="${ENV_SERVICE_PORT:-$SERVICE_PORT}"             # port which service is listening on
EXEC_CMD_BIN="${ENV_EXEC_CMD_BIN:-$EXEC_CMD_BIN}"             # command to execute
EXEC_CMD_ARGS="${ENV_EXEC_CMD_ARGS:-$EXEC_CMD_ARGS}"          # command arguments
PRE_EXEC_MESSAGE="${ENV_PRE_EXEC_MESSAGE:-$PRE_EXEC_MESSAGE}" # Show message before execute
SERVICE_EXIT_CODE=0                                           # default exit code
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
printf '%s\n' "# - - - Attempting to start $EXEC_CMD_BIN - - - #"
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# ensure the command exists
if [ ! -f "$(type -P "$EXEC_CMD_BIN")" ] && [ -z "$EXEC_CMD_BIN" ]; then
  echo "$EXEC_CMD_BIN is not a valid command"
  exit 2
fi
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# check if process is already running
if __pgrep "$EXEC_CMD_BIN"; then
  SERVICE_IS_RUNNING="true"
  echo "$EXEC_CMD_BIN is running"
  exit 0
fi
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# show message if env exists
if [ -n "$EXEC_CMD_BIN" ]; then
  [ -n "$SERVICE_USER" ] && echo "Setting up service to run as $SERVICE_USER"
  [ -n "$SERVICE_PORT" ] && echo "$EXEC_CMD_BIN will be running on $SERVICE_PORT"
fi
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Change to working directory
[ -n "$WORKDIR" ] && mkdir -p "$WORKDIR" && __cd "$WORKDIR" && echo "Changed to $PWD"
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Updating config files
__update_conf_files
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Initialize ssl
__update_ssl_conf
__update_ssl_certs
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# run the pre execute commands
__pre_execute
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
WORKDIR="${WORKDIR:-}"
if [ "$SERVICE_USER" = "root" ] || [ -z "$SERVICE_USER" ]; then
  su_cmd_bin="eval"
  su_cmd() { "$@" || return 1; }
elif [ "$(builtin type -P gosu)" ]; then
  su_cmd_bin="gosu $SERVICE_USER"
  su_cmd() { eval $su_cmd_bin "$@" || return 1; }
elif [ "$(builtin type -P runuser)" ]; then
  su_cmd_bin="runuser -u $SERVICE_USER"
  su_cmd() { eval $su_cmd_bin "$@" || return 1; }
elif [ "$(builtin type -P sudo)" ]; then
  su_cmd_bin="sudo -u $SERVICE_USER"
  su_cmd() { eval $su_cmd_bin "$@" || return 1; }
elif [ "$(builtin type -P su)" ]; then
  su_cmd_bin="su -s /bin/sh - $SERVICE_USER"
  su_cmd() { eval $su_cmd_bin -c "$@" || return 1; }
else
  echo "Can not switch to $SERVICE_USER"
  exit 10
fi
if [ -n "$WORKDIR" ] && [ -n "$SERVICE_USER" ]; then
  echo "Fixing file permissions"
  su_cmd chown -Rf $SERVICE_USER $WORKDIR
fi
echo "Starting service: $EXEC_CMD_BIN $EXEC_CMD_ARGS"
export -f __run_start_script
export SERVICE_IS_RUNNING="true"
su_cmd "touch /run/init.d/$EXEC_CMD_BIN.pid"
su_cmd __run_start_script "$@" || echo "Failed to execute: $EXEC_CMD_BIN $EXEC_CMD_ARGS"
[ "$?" -ne 0 ] && SERVICE_IS_RUNNING="false" && SERVICE_EXIT_CODE=10 && rm -Rf "/run/init.d/$EXEC_CMD_BIN.pid"
#  su_cmd "$EXEC_CMD_BIN $EXEC_CMD_ARGS"
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
exit $SERVICE_EXIT_CODE
