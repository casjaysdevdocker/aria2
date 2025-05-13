#!/usr/bin/env bash
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
##@Version           :  202210191942-git
# @@Author           :  Jason Hempstead
# @@Contact          :  git-admin@casjaysdev.pro
# @@License          :  LICENSE.md
# @@ReadME           :  post-hook.sh --help
# @@Copyright        :  Copyright: (c) 2022 Jason Hempstead, Casjays Developments
# @@Created          :  Wednesday, Oct 19, 2022 19:42 EDT
# @@File             :  post-hook.sh
# @@Description      :  post script
# @@Changelog        :  newScript
# @@TODO             :  Refactor code
# @@Other            :
# @@Resource         :  https://aria2.github.io/manual/en/html/aria2c.html#event-hook
# @@Terminal App     :  no
# @@sudo/root        :  no
# @@Template         :  bash/system
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
set -eu

echo "[INFO] $(date -u +'%Y-%m-%dT%H:%M:%SZ') Aria2 hook triggered with parameters: GID [$1], Files Count: [$2], Files Path: [$3]"
