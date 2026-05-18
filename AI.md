# aria2 — THE HOW

## Build flow

Multi-stage Alpine Dockerfile (`casjaysdev/alpine` base → `FROM scratch` final).

1. **Package install**: `pkmgr install aria2 bash tini curl wget tzdata ca-certificates unzip jq pwgen nginx` installs all components in one layer.
2. **Setup scripts** (`rootfs/root/docker/setup/`): `03-files.sh` auto-installs everything under `rootfs/tmp/` into the image (`/etc/aria2/`, `/etc/nginx/`, `/usr/local/etc/docker/bin/`, etc.). `05-custom.sh` performs the wipe-and-replace — removes distro defaults from `/etc/aria2/` and `/etc/nginx/`, installs our optimized configs, and unpacks the pre-bundled AriaNg zip from `rootfs/tmp/ariang-src/AriaNg-*.zip` into `/usr/local/share/ariang/`.
3. **AriaNg pre-bundle**: GitHub SSL is blocked inside the buildx sandbox on this host, so the AriaNg zip must be downloaded on the host first and placed at `rootfs/tmp/ariang-src/AriaNg-1.3.13.zip` (gitignored) before running `buildx`.
4. **Final stage**: `FROM scratch` + `COPY --from=build /. /` produces a minimal image with tini as PID 1.

## Runtime boot chain

```
tini → /usr/local/bin/entrypoint.sh → /usr/local/etc/docker/init.d/00-aria2c.sh → /usr/local/etc/docker/bin/start-aria2
```

- `entrypoint.sh` seeds `/config/` and `/data/` on first run (via `__initialize_config_dir` / `__initialize_data_dir`), then calls `__start_init_scripts` which sources and executes `init.d/00-aria2c.sh`.
- `00-aria2c.sh` sources `functions/entrypoint.sh`, runs hook functions (`__run_pre_execute_checks` → `tracker.sh` to refresh BT trackers; `__update_conf_files` → token substitution: `REPLACE_RPC_PORT`, `REPLACE_SERVER_ADDR`, optional `rpc-secret` toggle, DHT port, log path, file-allocation, AriaNg config overlay), then calls the framework's `__run_start_script`.
- `start-aria2` backgrounds `aria2c --conf-path=/config/aria2/aria2.conf`, waits for port 6800 to open, then `exec`s `nginx -c /config/nginx/nginx.conf -g 'daemon off;'` as the foreground process (becomes PID adopted by tini).

## Key paths

| Path | Role |
|---|---|
| `/usr/bin/aria2c` | Download daemon binary |
| `/usr/sbin/nginx` | HTTP server binary |
| `/usr/local/share/ariang/` | AriaNg static files (index.html, JS, CSS) |
| `/usr/local/etc/docker/bin/start-aria2` | Wrapper: backgrounds aria2c, foregrounds nginx |
| `/usr/local/etc/docker/init.d/00-aria2c.sh` | Init.d script — wires up the service |
| `/usr/local/bin/tracker.sh` | P3TERX BT tracker updater |
| `/config/aria2/aria2.conf` | User-editable aria2c config (seeded from `rootfs/tmp/etc/aria2/aria2.conf`) |
| `/config/nginx/nginx.conf` | User-editable nginx config (seeded from `rootfs/tmp/etc/nginx/nginx.conf`) |
| `/data/downloads/aria2/` | Download destination |
| `/data/logs/aria2/aria2.log` | aria2c log |
| `/data/logs/nginx/` | nginx access + error logs |

## Config token substitution (00-aria2c.sh `__update_conf_files`)

Tokens in `/config/aria2/aria2.conf` replaced at each container start:

| Token | Replaced with |
|---|---|
| `REPLACE_RPC_PORT` | `${RPC_PORT:-6800}` |
| `REPLACE_SERVER_ADDR` | Container IPv4 (via `__get_ip4`) |
| `rpc-secret=REPLACE_RPC_SECRET` | Commented out unless `RPC_SECRET` env var is set |
| `dht-listen-port=.*` | `dht-listen-port=6888` |
| `log=.*` | `log=/data/logs/aria2/aria2.log` |
| `file-allocation=.*` | `file-allocation=prealloc` |

The AriaNg client config (`/config/aria2/aria-ng.config.js`) is also overlaid onto the bundled `js/aria-ng-*.min.js` so the UI auto-connects to the local RPC endpoint without user configuration.

## Single init.d design

The framework's `__start_init_scripts` only reliably runs the first `init.d/*.sh`. Two separate scripts (`00-aria2c.sh` + `zz-nginx.sh`) would only start aria2c. The resolution is a single init.d entry (`00-aria2c.sh`) pointing at the `start-aria2` wrapper script which manages both processes.
