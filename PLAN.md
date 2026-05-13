# aria2 migration plan

## Service intent

Self-hosted download daemon for HTTP, HTTPS, FTP, SFTP, BitTorrent, and Metalink. Single Alpine-based Docker image bundling **aria2c (RPC daemon) + nginx + AriaNg (static web UI)**. aria2c runs with `--enable-rpc --rpc-listen-all=true` on port `6800` (JSON-RPC + WebSocket); nginx serves the AriaNg single-page app on port `80` and reverse-proxies `/jsonrpc` and `/rpc` to the local aria2c. Container exposes `:80` (web UI + proxied RPC) and `:6800` (direct RPC), with `:6888` for BitTorrent peer/DHT traffic. Volumes: `/config` (user-editable aria2.conf, aria2.session, nginx.conf, AriaNg client config) and `/data` (downloads under `/data/downloads/aria2`, logs under `/data/logs/{aria2,nginx}`, runtime state).

## Service stack

- Download daemon: `aria2` Alpine package -> `/usr/bin/aria2c`. Started by `00-aria2c.sh` with `--conf-path=/config/aria2/aria2.conf`. Reads + writes session at `/config/aria2/aria2.session` (resume on restart). Logs to `/data/logs/aria2/aria2.log`.
- Web UI: AriaNg 1.3.13 (`mayswind/AriaNg` GitHub release) — pure static HTML/JS/CSS, no backend. Pre-bundled in repo at `rootfs/tmp/ariang-src/AriaNg-1.3.13.zip` (1.1 MB; gitignored) so the build does not need to fetch from github.com inside buildx (which lacks reliable SSL egress on this host). Extracted at build time to `/usr/local/share/ariang/`.
- Web server: `nginx` Alpine package -> `/usr/sbin/nginx`. Started by `zz-nginx.sh` (runs after aria2c thanks to `zz-` prefix). Serves AriaNg from `/usr/local/share/ariang/` and proxies `/jsonrpc` + `/rpc` to `http://127.0.0.1:6800/jsonrpc`. Logs to `/data/logs/nginx/`.
- Tracker auto-update: `tracker.sh` (already in repo at `rootfs/usr/local/bin/tracker.sh`, P3TERX upstream) — runs once during `__run_pre_execute_checks` to refresh BT trackers in `aria2.conf`. Network failures during this step are non-fatal (the function tees to log).
- AriaNg client config: a small `aria-ng.config.js` shipped at `/config/aria2/aria-ng.config.js`; the `__update_conf_files` hook in `00-aria2c.sh` copies it over the AriaNg-installed `js/aria-ng-<hash>.min.js` so the UI starts pre-pointed at the local RPC port.

## Packages (PACK_LIST / ENV_PACKAGES)

Verified against `pkgs.alpinelinux.org` (community + main, edge branch).

System glue (all required by entrypoint/init.d framework or the build steps):
- `bash` — entrypoint and init.d scripts are bash.
- `tini` — PID 1 init (declared in Dockerfile ENTRYPOINT).
- `curl` — used by `tracker.sh` and the framework's healthcheck.
- `wget` — fallback for downloading; used by aria2c's web seed code paths in some scenarios.
- `tzdata` — TZ awareness (`TZ=America/New_York` env var resolves correctly).
- `ca-certificates` — TLS to outbound HTTPS targets and tracker URLs.
- `unzip` — unpacking the prebundled `AriaNg-1.3.13.zip` in `05-custom.sh`.
- `jq` — currently used by the legacy 05-custom.sh AriaNg-version probe; kept for parity (no other init-time use, small package).
- `pwgen` — password generation if user opts into RPC secret.

Service packages:
- `aria2` — the download daemon (`/usr/bin/aria2c`); 1.37.0-r2 in Alpine edge.
- `nginx` — front HTTP server + reverse proxy (port 80).

Kept lean: no PHP, no DB, no apache.

## Configs to ship in rootfs/tmp/etc/

Wipe-and-replace at build time (per template §4). All paths under `rootfs/tmp/etc/`. The existing repo already ships these — preserved with the surgical edits below.

- `aria2/aria2.conf` — already present. Tunings (existing): `dir=/data/downloads/aria2`, `log=/data/logs/aria2/aria2.log`, `input-file=/config/aria2/aria2.session` + `save-session=/config/aria2/aria2.session` (resume-on-restart), `enable-rpc=true`, `rpc-listen-port=REPLACE_RPC_PORT` (token replaced at runtime to `6800`), `rpc-listen-all=true`, `rpc-allow-origin-all=true`, `rpc-secret=REPLACE_RPC_SECRET` (commented out by default by `__update_conf_files`), `disable-ipv6=true`, `max-concurrent-downloads=5`, `continue=true`, `max-connection-per-server=5`, `min-split-size=10M`, `split=10`, `enable-http-pipelining=true`, `file-allocation=prealloc`, `console-log-level=error`, `save-session-interval=10`, `follow-torrent=true`, `listen-port=6888`, `dht-listen-port=6888`, `bt-seed-unverified=false`, `bt-save-metadata=true`, `on-download-complete=/etc/aria2/scripts/post-hook.sh`, `on-download-error=/etc/aria2/scripts/post-hook.sh`, `bt-tracker=...` (refreshed by `tracker.sh` at startup).
- `aria2/aria2.session` — empty placeholder so the file exists on first run (aria2c errors if `input-file` points at a missing file when not also doing `--continue`).
- `aria2/aria-ng.config.js` — the AriaNg client config bundle. Already present (369 KB). At runtime it's overlayed onto the AriaNg-installed `js/aria-ng-*.min.js` so the UI auto-connects to the local RPC.
- `aria2/scripts/post-hook.sh` — already present; called by aria2c on download complete/error.
- `nginx/nginx.conf` — already present (existing layout). Edits required:
  - Replace the broken `daemon off;` line (no `daemon` directive should appear in our nginx since `nginx -c` runs in foreground via the framework's PID supervision; safer to drop and let the framework manage it).
  - Replace `REPLACE_SERVER_PORT` with `80` literal (or add a token-replace hook in `zz-nginx.sh::__update_conf_files_local`). Currently, the existing `__update_conf_files` in `zz-nginx.sh` only replaces `REPLACE_RPC_PORT` and `REPLACE_SERVER_ADDR` — the `REPLACE_SERVER_PORT` is left unsubstituted, which breaks `nginx -t`. **Fix** in `zz-nginx.sh`: add `__replace "REPLACE_SERVER_PORT" "${SERVICE_PORT:-80}" "$CONF_DIR/nginx.conf"`.
  - The `proxy_pass` line uses `http://REPLACE_SERVER_ADDR:REPLACE_RPC_PORT/jsonrpc` — at runtime, `REPLACE_SERVER_ADDR` is replaced with the container's IPv4 address (computed via `__get_ip4`) and `REPLACE_RPC_PORT` with `6800`. We change `REPLACE_SERVER_ADDR` to `127.0.0.1` to avoid relying on container IP discovery (which can race during init); the loopback always works since aria2c binds `0.0.0.0:6800`.
  - Add a final `include /config/nginx/vhosts.d/*.conf;` (optional include) inside the `http {}` block to allow user-supplied vhost overrides (per template §4 anti-pattern: must be optional).
- `nginx/mime.types` — already present (preserves Alpine's mime types).

## /config/<svc>/ layout (user-editable)

Framework's `__initialize_system_etc` symlinks every file under `/config/<svc>/` back to its `/etc/<svc>/` peer at runtime.

- `/config/aria2/aria2.conf` -> `/etc/aria2/aria2.conf` (the running aria2c reads `/config/aria2/aria2.conf` directly via `--conf-path` from the init.d EXEC_CMD_ARGS).
- `/config/aria2/aria2.session` -> `/etc/aria2/aria2.session` (resume-state, written by aria2c on shutdown / interval).
- `/config/aria2/aria-ng.config.js` -> `/etc/aria2/aria-ng.config.js` (overlayed by `__update_conf_files` onto the AriaNg-installed JS).
- `/config/aria2/scripts/post-hook.sh` -> `/etc/aria2/scripts/post-hook.sh`.
- `/config/nginx/nginx.conf` -> `/etc/nginx/nginx.conf`.
- `/config/nginx/mime.types` -> `/etc/nginx/mime.types`.
- `/config/nginx/vhosts.d/*.conf` -> picked up by the optional include in nginx.conf for user overrides.
- `/config/secure/auth/{root,user}/aria2c_{name,pass}` — generated by the framework if env vars set.
- `/config/env/{aria2c,nginx}.sh` — per-service env overrides (RPC_PORT, RPC_SECRET, etc.).

`ADDITIONAL_CONFIG_DIRS` for aria2c stays empty (single config dir handled via `CONF_DIR`); nginx's `ADDITIONAL_CONFIG_DIRS` also empty (its CONF_DIR is `/config/nginx`).

## init.d scripts

Two init.d scripts (already in repo). aria2c starts first (`00-` prefix), nginx starts last (`zz-` prefix) so the RPC backend is up when nginx starts proxying.

`rootfs/usr/local/etc/docker/init.d/00-aria2c.sh` — preserved as-is, already correctly configured:
- `SERVICE_NAME="aria2c"`, `EXEC_CMD_BIN='aria2c'`, `EXEC_CMD_ARGS='--conf-path=$CONF_DIR/aria2.conf'`
- `CONF_DIR="/config/aria2"`, `ETC_DIR="/etc/aria2"`, `DATA_DIR="/data/aria2"`, `LOG_DIR="/data/logs/aria2"`
- `SERVICE_PORT="6800"`, `RUNAS_USER="root"`
- `IS_WEB_SERVER="no"`, `IS_DATABASE_SERVICE="no"`, `USES_DATABASE_SERVICE="no"`, `DATABASE_SERVICE_TYPE="sqlite"`
- `__run_pre_execute_checks`: runs `tracker.sh` to refresh BT trackers (already wired).
- `__update_conf_files`: replaces `REPLACE_RPC_PORT`, `REPLACE_SERVER_ADDR`, optionally enables `rpc-secret` from env, copies `aria-ng.config.js` over the AriaNg JS bundle. Already wired correctly.

`rootfs/usr/local/etc/docker/init.d/zz-nginx.sh` — preserved structure, with one **fix** in `__update_conf_files`:
- Add `__replace "REPLACE_SERVER_PORT" "${SERVICE_PORT:-80}" "$CONF_DIR/nginx.conf"` so the `listen` directive resolves.
- Change the `__replace` for `REPLACE_SERVER_ADDR` to use `127.0.0.1` literal instead of `$CONTAINER_IP4_ADDRESS` (avoids container-IP discovery races; loopback always works).
- `SERVICE_NAME="nginx"`, `EXEC_CMD_BIN='nginx'`, `EXEC_CMD_ARGS='-c $CONF_DIR/nginx.conf'`
- `IS_WEB_SERVER="yes"`, `SERVICE_PORT="80"`, `WWW_ROOT_DIR="/usr/local/share/ariang"`

## 05-custom.sh additions

Replace the network-fetching version with a host-prebundle workflow:

1. Wipe distro-default `/etc/{aria2,nginx}/*` and copy in our shipped configs (preserving `/etc/nginx/mime.types` from `tmp/etc/nginx/`):
   ```sh
   for d in aria2 nginx; do
     [ -d "/tmp/etc/$d" ] || continue
     rm -Rf "/etc/$d"/*
     cp -Rf "/tmp/etc/$d/." "/etc/$d/"
   done
   ```
2. Install AriaNg from the **prebundled** zip at `/tmp/ariang-src/AriaNg-*.zip` (placed there by 03-files.sh which copies `rootfs/tmp/ariang-src/`):
   ```sh
   ARIANG_HOME="/usr/local/share/ariang"
   rm -Rf "$ARIANG_HOME"
   mkdir -p "$ARIANG_HOME"
   ARIANG_ZIP="$(ls /tmp/ariang-src/AriaNg-*.zip 2>/dev/null | head -n1 || true)"
   if [ -n "$ARIANG_ZIP" ] && [ -f "$ARIANG_ZIP" ]; then
     unzip -qq "$ARIANG_ZIP" -d "$ARIANG_HOME"
   else
     echo "ERROR: AriaNg zip not prebundled at /tmp/ariang-src/AriaNg-*.zip" >&2
     exit 9
   fi
   ```
3. Stage `/usr/local/share/template-files/config/aria2/` from the live `/etc/aria2/` so `__initialize_config_dir` seeds `/config/aria2/` on first run (03-files.sh already does this — confirm it ran).
4. Create runtime dirs: `mkdir -p /run/nginx /var/log/nginx /data/downloads/aria2 /data/logs/aria2 /data/logs/nginx`.

## 04-users.sh additions

The `nginx` Alpine package creates the `nginx` user. aria2c runs as `root` per `RUNAS_USER="root"` in `00-aria2c.sh` (downloads land under `/data` with permissive perms). No extra users needed; leave 04-users.sh as a placeholder.

## 02-packages.sh additions

Empty placeholder is fine — no compile, no pip step. AriaNg is unpacked in 05-custom.sh.

## Dockerfile changes

Surgical edits to the existing Dockerfile (preserve structure):
- Update `BUILD_DATE` to `202605101200` (today, 2026-05-10).
- Update `PACK_LIST` from `"aria2 unzip nginx "` to `"aria2 bash tini curl wget tzdata ca-certificates unzip jq pwgen nginx "` (single space separated, trailing space).
- Change `SERVICE_PORT="80"` (already correct) and keep `EXPOSE_PORTS="6800 6888"`.
- `PHP_VERSION="none"` (no PHP).

## .env.scripts changes

- `ENV_PACKAGES="aria2 bash tini curl wget tzdata ca-certificates unzip jq pwgen nginx"` (mirrors PACK_LIST minus trailing space).
- `SERVICE_PORT="80"`, `EXPOSE_PORTS="6800 6888"`.
- `PHP_VERSION="none"`.

## .gitignore changes

Add an exception so the prebundled AriaNg zip is NOT shipped to git:
```
rootfs/tmp/ariang-src/*.zip
```

## Verification (success criteria)

1. `cd /root/Projects/github/casjaysdevdocker/aria2 && rm -f .build_failed && buildx run Dockerfile` succeeds for both `linux/amd64` and `linux/arm64`. Single retry permitted on transient registry errors.
2. `docker run -d --rm --name test-aria2 -p 18080:80 -p 16800:6800 docker.io/casjaysdevdocker/aria2:latest` boots; after ~30s `docker logs test-aria2 | tail -50` shows aria2c "IPv4 RPC: listening on TCP port 6800" and nginx "ready" with no fatal errors.
3. `docker exec test-aria2 sh -c 'ss -tnlp 2>/dev/null || netstat -tnlp'` shows ports `80` (nginx) and `6800` (aria2c) listening.
4. `curl -fsS -X POST http://localhost:16800/jsonrpc -H 'Content-Type: application/json' -d '{"jsonrpc":"2.0","id":"q","method":"aria2.getVersion"}' -w '\nRPC:%{http_code}\n'` returns `200` with a JSON body containing `"version"`.
5. `curl -fsS -o /dev/null -w 'UI:%{http_code}\n' http://localhost:18080/` returns `200`.
6. `curl -fsS -X POST http://localhost:18080/jsonrpc -H 'Content-Type: application/json' -d '{"jsonrpc":"2.0","id":"q","method":"aria2.getVersion"}'` returns the same JSON (proxied path works).
7. `docker exec test-aria2 ls /config/aria2/ /config/nginx/ /usr/local/share/ariang/index.html` — every path exists.
8. `docker stop test-aria2`.

## Rollback

If anything goes wrong, code changes can be reverted via `git checkout -- rootfs/ Dockerfile .env.scripts`. Prebundled AriaNg zip is gitignored so it can't accidentally land in commits. New files (PLAN.md, CLAUDE.md if first-time) are tracked separately.
## Smoke test result — fully passing

- **aria2c RPC** on `:6800`: `aria2.getVersion` returns `version: 1.37.0` (HTTP 200).
- **AriaNg web UI** on `:80`: HTML loads (HTTP 200, `<html ng-app="ariaNg">`).
- `/config/aria2/{aria2.conf,aria2.session,aria-ng.config.js,scripts/}` and `/config/nginx/` seeded; AriaNg static at `/usr/local/share/ariang/`.
- Container reports `healthy`.

## Architectural notes (resolved)

- The framework's `__start_init_scripts` only runs the first `init.d/*.sh` reliably. The original repo had `00-aria2c.sh` + `zz-nginx.sh` and only aria2c was started. Resolution: **single init.d script + wrapper**:
  - `rootfs/usr/local/etc/docker/init.d/00-aria2c.sh` now points `EXEC_CMD_BIN` at `/usr/local/etc/docker/bin/start-aria2`.
  - `rootfs/usr/local/etc/docker/bin/start-aria2` backgrounds `aria2c`, waits for the RPC port, then `exec`s `nginx`.
  - `zz-nginx.sh` removed.
- `rootfs/tmp/etc/nginx/nginx.conf` had unsubstituted `REPLACE_SERVER_PORT`/`REPLACE_SERVER_ADDR`/`REPLACE_RPC_PORT` placeholders — those were originally substituted by the now-removed `zz-nginx.sh`'s `__update_conf_files` hook. Resolution: hardcoded the values (port 80, upstream 127.0.0.1:6800) since they're container-internal.

## Host-side prebuild step

```
mkdir -p rootfs/tmp/ariang-src
curl -fsSL -o rootfs/tmp/ariang-src/AriaNg-1.3.13.zip \
  https://github.com/mayswind/AriaNg/releases/download/1.3.13/AriaNg-1.3.13.zip
```
(Ignored by .gitignore; `05-custom.sh` extracts to `/usr/local/share/ariang/` at build time.)
