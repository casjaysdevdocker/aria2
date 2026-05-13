## 👋 Welcome to aria2 🚀  

aria2 README  
  
  
## Install my system scripts  

```shell
 sudo bash -c "$(curl -q -LSsf "https://github.com/systemmgr/installer/raw/main/install.sh")"
 sudo systemmgr --config && sudo systemmgr install scripts  
```
  
## Automatic install/update  
  
```shell
dockermgr update aria2
```
  
## Install and run container
  
```shell
dockerHome="/var/lib/srv/$USER/docker/casjaysdevdocker/aria2/aria2/latest/rootfs"
mkdir -p "/var/lib/srv/$USER/docker/aria2/rootfs"
git clone "https://github.com/dockermgr/aria2" "$HOME/.local/share/CasjaysDev/dockermgr/aria2"
cp -Rfva "$HOME/.local/share/CasjaysDev/dockermgr/aria2/rootfs/." "$dockerHome/"
docker run -d \
--restart always \
--privileged \
--name casjaysdevdocker-aria2-latest \
--hostname aria2 \
-e TZ=${TIMEZONE:-America/New_York} \
-v "$dockerHome/data:/data:z" \
-v "$dockerHome/config:/config:z" \
-p 80:80 \
casjaysdevdocker/aria2:latest
```
  
## via docker-compose  
  
```yaml
version: "2"
services:
  ProjectName:
    image: casjaysdevdocker/aria2
    container_name: casjaysdevdocker-aria2
    environment:
      - TZ=America/New_York
      - HOSTNAME=aria2
    volumes:
      - "/var/lib/srv/$USER/docker/casjaysdevdocker/aria2/aria2/latest/rootfs/data:/data:z"
      - "/var/lib/srv/$USER/docker/casjaysdevdocker/aria2/aria2/latest/rootfs/config:/config:z"
    ports:
      - 80:80
    restart: always
```
  
## Get source files  
  
```shell
dockermgr download src casjaysdevdocker/aria2
```
  
OR
  
```shell
git clone "https://github.com/casjaysdevdocker/aria2" "$HOME/Projects/github/casjaysdevdocker/aria2"
```
  
## Build container  
  
```shell
cd "$HOME/Projects/github/casjaysdevdocker/aria2"
buildx 
```
  
## Authors  
  
🤖 casjay: [Github](https://github.com/casjay) 🤖  
⛵ casjaysdevdocker: [Github](https://github.com/casjaysdevdocker) [Docker](https://hub.docker.com/u/casjaysdevdocker) ⛵  
