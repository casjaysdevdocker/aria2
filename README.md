## 👋 Welcome to aria2 🚀

A self-contained Docker image running **aria2c** (multi-protocol download daemon) with the **AriaNg** web UI served by **nginx**. Supports HTTP/HTTPS, FTP, BitTorrent, Metalink, and WebSocket RPC.

---

## 🚀 Quick start

```shell
docker run -d \
  --restart always \
  --name casjaysdevdocker-aria2 \
  --hostname aria2 \
  -e TZ=${TIMEZONE:-America/New_York} \
  -v /srv/docker/aria2/config:/config:z \
  -v /srv/docker/aria2/data:/data:z \
  -p 80:80 \
  -p 6800:6800 \
  -p 6888:6888 \
  casjaysdevdocker/aria2:latest
```

Open `http://localhost` to access the AriaNg web interface.

---

## 🐳 docker-compose

```yaml
version: "2"
services:
  aria2:
    image: casjaysdevdocker/aria2:latest
    container_name: casjaysdevdocker-aria2
    hostname: aria2
    restart: always
    environment:
      - TZ=America/New_York
    volumes:
      - /srv/docker/aria2/config:/config:z
      - /srv/docker/aria2/data:/data:z
    ports:
      - 80:80       # AriaNg web UI + proxied RPC
      - 6800:6800   # aria2c direct JSON-RPC / WebSocket
      - 6888:6888   # BitTorrent peer / DHT
```

---

## 🔧 Environment variables

| Variable | Default | Description |
|---|---|---|
| `TZ` | `America/New_York` | Container timezone |
| `RPC_PORT` | `6800` | aria2c RPC listen port |
| `RPC_SECRET` | _(unset)_ | aria2c RPC secret token (blank = no auth) |
| `CUSTOM_TRACKER_URL` | _(unset)_ | URL to fetch fresh BT tracker list (P3TERX format) |

---

## 📁 Volumes

| Path | Purpose |
|---|---|
| `/config` | User-editable config — `aria2/aria2.conf`, `aria2/aria2.session`, `nginx/nginx.conf`, AriaNg client config |
| `/data` | Downloads at `/data/downloads/aria2/`; logs at `/data/logs/{aria2,nginx}/` |

Seeded on first run from the image defaults. Edit `/config/aria2/aria2.conf` to tune aria2c; restart the container to apply.

---

## 🌐 Ports

| Port | Protocol | Purpose |
|---|---|---|
| `80` | TCP | AriaNg web UI (nginx); also proxies `/jsonrpc` and `/rpc` to aria2c |
| `6800` | TCP | aria2c JSON-RPC / WebSocket (direct, bypasses nginx) |
| `6888` | TCP/UDP | BitTorrent peer connections and DHT |

---

## 🔨 Build from source

```shell
git clone "https://github.com/casjaysdevdocker/aria2" "$HOME/Projects/github/casjaysdevdocker/aria2"
cd "$HOME/Projects/github/casjaysdevdocker/aria2"

# pre-bundle AriaNg (required before buildx — GitHub SSL is blocked inside the sandbox)
mkdir -p rootfs/tmp/ariang-src
curl -fsSL -o rootfs/tmp/ariang-src/AriaNg-1.3.13.zip \
  https://github.com/mayswind/AriaNg/releases/download/1.3.13/AriaNg-1.3.13.zip

buildx
```

---

## 👤 Authors

🤖 casjay: [Github](https://github.com/casjay) 🤖
⛵ casjaysdevdocker: [Github](https://github.com/casjaysdevdocker) [Docker](https://hub.docker.com/u/casjaysdevdocker) ⛵
