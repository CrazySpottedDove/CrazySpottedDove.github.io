---
title: wsl 原生 docker 网络配置
description: wsl 不使用 Docker Desktop，并使用 mirrored 网络模式时，如何为 docker 配置网络？
pubDate: 2025-02-09
updatedDate: 2025-02-09
tags: ["docker","network","wsl","mirrored","proxy","代理","container"]
category: "实用技术"
---
## 首先说明 wsl 的网络配置和 Docker 方案

### wsl 网络情况

```yaml
# C:\Users\<User>\.wslconfig
[wsl2]
networkingMode=mirrored # 开启镜像网络
dnsTunneling=true # 开启 DNS Tunneling
firewall=true # 开启 Windows 防火墙
autoProxy=true # 开启自动同步代理

[experimental]
hostAddressLoopback=true # 允许使用回环地址
```

我的 wsl 使用 arch 发行版。为了便于使用网络代理，选择了开启镜像网络模式，并开启了自动同步代理。

我的代理服务客户端为 windows 上的 v2rayN，代理端口为 10809。

开启代理的情况下，在 wsl 终端中，如果你使用 `echo`查看当前环境变量的话，会得到：

```bash
echo $http_proxy
# stdout
http://127.0.0.1:10809

echo $https_proxy
# stdout
http://127.0.0.1:10809
```

> 顺带说一句，wsl 的 autoProxy 事实上是对于 shell 建立一刻而言的。如果你在打开 shell 时未开启代理，那么上述环境变量将为空，即使你再打开代理也一样。
>
> 另外，使用 ssh 连接这样的 wsl 时，代理默认是不会设置的。这时需要手动 `export`环境变量，即
>
> ```bash
> # example
> export http_proxy=http://127.0.0.1:10809
> export https_proxy=http://127.0.0.1:10809
> ```

这时，可以这样检查代理是否有效：

```bash
curl -I https://www.google.com
# example stdout
HTTP/1.1 200 Connection established

HTTP/2 200
content-type: text/html; charset=ISO-8859-1
content-security-policy-report-only: object-src 'none';base-uri 'self';script-src 'nonce-Zl7Fa6bqVSwADtvdQCXwxA' 'strict-dynamic' 'report-sample' 'unsafe-eval' 'unsafe-inline' https: http:;report-uri https://csp.withgoogle.com/csp/gws/other-hp
accept-ch: Sec-CH-Prefers-Color-Scheme
p3p: CP="This is not a P3P policy! See g.co/p3phelp for more info."
date: Sun, 09 Feb 2025 15:33:22 GMT
server: gws
x-xss-protection: 0
x-frame-options: SAMEORIGIN
expires: Sun, 09 Feb 2025 15:33:22 GMT
cache-control: private
set-cookie: AEC=AVcja2cW9m7fUDd2Xk5YWqyY57gw1NE9U52oU2aic3f36IjMg5H97ajesI8; expires=Fri, 08-Aug-2025 15:33:22 GMT; path=/; domain=.google.com; Secure; HttpOnly; SameSite=lax
set-cookie: NID=521=xQRMUqMDl-QfspRb96XnmC4AeeLITR6PIkA5h4FtHgjXQFB9Uyc1Zq5WLHP8UcvxWCBc_NeJxzLtWoZxg5vAe51qJ_tBseYne_1NVWnxkkhzK98-V-P7tLscMhdr972JVkV4tieJuu3HapoTi91R4127R9VdLXbJD-nsE4972q3zv_eRp6-h4YXfCrFkE5MhDkqfP2yDPQ; expires=Mon, 11-Aug-2025 15:33:22 GMT; path=/; domain=.google.com; HttpOnly
alt-svc: h3=":443"; ma=2592000,h3-29=":443"; ma=2592000
```

### Docker 方案

我没有下载 Docker Desktop，而这是直接 `sudo pacman -S docker`，原因是觉得 Docker Desktop 比较臃肿，还要启动它才能启动 Docker 服务。

## Docker 网络配置的几种情况

Docker 网络配置一直是国内使用 Docker 的一个痛点。简单来说，Docker 网络配置大致分为三种情况：

* Docker daemon 管理镜像和容器，相关典型操作为 `docker pull`
* Docker build 时的临时容器环境
* Docker container 运行时环境

## 为 Docker daemon 配置网络

不同系统上，Docker daemon 的配置文件位置可能不同。对于我的 arch，配置文件为 `/etc/docker/daemon.json`

```json
{
 "proxies":{
  "http-proxy":"http://127.0.0.1:10809",
  "https-proxy":"http://127.0.0.1:10809",
  "no-proxy":"localhost,127.0.0.1"
 }
}
```

到此为止一切正常。

## 为 Docker build 配置网络

一个方便的方法是直接让宿主机的网络走代理，然后直接让 `docker build`时使用宿主机网络。这只需要在使用该命令时指定 `network`变量即可：

```bash
# 一个 docker build 示例
docker build -t example --network host .
```

这样，`docker build`时建立的临时容器就会接受宿主机网络了。

## 为 Docker container 配置网络

### 一些错误的尝试

Docker container 的配置文件位置在 `~/.docker/config.json`。

你可能认为配置文件可以这么写：

```json
{
    "proxies": {
        "default": {
            "httpProxy": "http://127.0.1:10809",
            "httpsProxy": "http://127.0.1:10809",
            "no-proxy": "localhost,127.0.0.1"
        }
    }
}
```

然而，不对！你需要注意，这个配置文件等价于在容器内部使用了：

```bash
export http_proxy=http://127.0.0.1:10809
export https_proxy=http://127.0.0.1:10809
```

`docker run`默认使用的网络模式为 `bridge`模式，而对于这种网络模式下的容器而言，`127.0.0.1`作为回环地址还是指向它本身！

有的同学可能也会尝试在 `docker run`时通过 flag `-e http_proxy -e https_proxy`来传递环境变量，但因为 `wsl`中，代理直接通过回环地址从 windows 传递，这么做的效果和上面完全相同！

再同时，因为 v2rayN 在 windows 中运行，即使尝试获取 docker 宿主机在 bridge 网络中的 IP

```bash
ip addr show | grep docker0
# example stdout
7: docker0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state DOWN group default
    inet 172.17.0.1/16 brd 172.17.255.255 scope global docker0
```

然后尝试对 `172.17.0.1`配置代理，依旧会因为 v2rayN 没有对它监听而以失败为告终！

### 我的 work around 方案

我们可以直接获得 windows 主机的局域网 IP(WLAN 适配器的 IPv4 地址)。在 cmd 中使用 `ipconfig`

```cmd
ipconfig
<!-- 筛选后的 stdout -->
无线局域网适配器 WLAN:

   连接特定的 DNS 后缀 . . . . . . . :
   本地链接 IPv6 地址. . . . . . . . : ...
   IPv4 地址 . . . . . . . . . . . . : 192.168.3.49
   子网掩码  . . . . . . . . . . . . : ...
   默认网关. . . . . . . . . . . . . : ...
```

事实上，如果你在 `wsl`中再使用命令 `ip addr show`，你会发现有这么一项是和它对应的：

```bash
ip addr show
# example stdout
# filtered
6: eth3: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP group default qlen 1000
    link/ether 74:97:79:75:cf:19 brd ff:ff:ff:ff:ff:ff
    altname enx74977975cf19
    inet 192.168.3.49/24 brd 192.168.3.255 scope global noprefixroute eth3
       valid_lft forever preferred_lft forever
    inet6 fe80::545:e7b5:95f0:662d/64 scope link nodad noprefixroute
       valid_lft forever preferred_lft forever
```

它作为 default 项，说明 `mirrored`网络模式下的 wsl 以这个 windows 局域网 IP 作为它在 eth3 上的实际 IP。

我们可以这样测试通过它走代理是否有效：

```bash
curl -x http://192.168.3.49:10809 -I https://www.google.com
# example stdout
HTTP/1.1 200 Connection established

HTTP/2 200
content-type: text/html; charset=ISO-8859-1
content-security-policy-report-only: object-src 'none';base-uri 'self';script-src 'nonce-Yc0DCwTnJjKaHYM1AmY89Q' 'strict-dynamic' 'report-sample' 'unsafe-eval' 'unsafe-inline' https: http:;report-uri https://csp.withgoogle.com/csp/gws/other-hp
accept-ch: Sec-CH-Prefers-Color-Scheme
p3p: CP="This is not a P3P policy! See g.co/p3phelp for more info."
date: Sun, 09 Feb 2025 16:19:23 GMT
server: gws
x-xss-protection: 0
x-frame-options: SAMEORIGIN
expires: Sun, 09 Feb 2025 16:19:23 GMT
cache-control: private
set-cookie: AEC=AVcja2eS_-N9hAwapPTi0VK8lFEvLq420lJKEi6GAGzYLgb18gI3tiputEk; expires=Fri, 08-Aug-2025 16:19:23 GMT; path=/; domain=.google.com; Secure; HttpOnly; SameSite=lax
set-cookie: NID=521=Q6rL41dRxH8BfuiC53__X1a6eoZPAPxR1SQ0C21A7R2rv9YDtQ92bQDXHvmABMRhAajbi1dgxLlTTuXYmyL6TocdzDbhKvD6Ni1ohjxO6YGv5zSALFzIV2bSHkpkA6YRLW-L5qt-G_MWrz9uHzGewOdkqCAYmCS7BlozMJCL53pxm7MGNsopQrGwHYsBKuwynFZko1Tr6w; expires=Mon, 11-Aug-2025 16:19:23 GMT; path=/; domain=.google.com; HttpOnly
alt-svc: h3=":443"; ma=2592000,h3-29=":443"; ma=2592000
```

> 你可能发现这里的代理并不是有效的，这时你可以检查你的 v2rayN（或其它代理工具），确保它允许来自局域网的连接。只有这样，才能让代理监听除了 127.0.0.1 之外的地址。

如果你把 `http_proxy`,`https_proxy`全部重新设置成它，然后再用传递变量的方法使用 `docker run`，你会发现，哦豁，容器内可以使用代理了。

然而，不幸的是，这个 IP 地址会随 wifi 改变发生改变，这将对我们的使用产生很大的不便。同时，因为用的不是 Docker Desktop，我们无法使用 `host.docker.internal`来动态表示 ip 。因此，我们可以用一个自动化脚本来帮助我们修改 `~/.docker/config.json`文件。

```bash
#!/bin/bash
# docker-ipconfig.sh
ip=$(ip addr show eth3 | awk '/inet / {print $2}' | cut -d/ -f1)

jq --arg ip "$ip" '
  .proxies.default.httpProxy = "http://\($ip):10809" |
  .proxies.default.httpsProxy = "http://\($ip):10809"
' ~/.docker/config.json > /tmp/config.json && mv /tmp/config.json ~/.docker/config.json
```

然后，我们为它赋予可执行权限，然后扔到环境变量吧~

```bash
chmod +x /path/to/docker-ipconfig.sh
sudo ln -s /path/to/docker-ipconfig.sh /usr/local/bin/docker-ipconfig
```

如此，在需要为 docker 容器配置网络的时候，只要运行一下 `docker-ipconfig`，就可以保证容器接受正确的网络代理服务啦 ٩(๑˃̵ᴗ˂̵๑)۶

## 在 build 时使用 ssh 私钥

> Reference:[https://www.lixueduan.com/posts/docker/11-use-ssh-private-key-in-docker-build/#3--ssh-mount-type](https://www.lixueduan.com/posts/docker/11-use-ssh-private-key-in-docker-build/#3--ssh-mount-type)

在 build 阶段使用 ssh 私钥的需求可以很好地通过 BuildKit 的 SSH mount type 解决。

由于使用 arch 系统，在启用 buildx 方面较为方便，我们只要运行

```bash
sudo pacman -S docker-buildx
```

之后，`docker build`命令会默认使用 `buildx`。

### 通过 mount 传入 ssh key

常见的 ssh key 位置为 `~/.ssh/id_rsa`，下面以此为例。如果想要把这个 ssh 传入 `docker build`过程，可以使用

```bash
docker build --ssh default=~/.ssh/id_rsa .
```

如果你需要传入多个私钥，比如说，`~/.ssh/github_ssh_id_rsa`和 `~/.ssh/gitlab_ssh_id_rsa`，就可以使用

```bash
docker build --ssh github_ssh_key=~/.ssh/github_ssh_id_rsa --ssh gitlab_ssh_key=~/.ssh/gitlab_ssh_id_rsa .
```

### 处理 ssh key

我们在 `Dockerfile`中需要添加一些命令来处理传入的 ssh key。主要是信任 hosts。

```dockerfile
# 传入单个 github.com 的 ssh key，依照需求，你可以修改其中的 github.com
RUN --mount=type=ssh mkdir -p -m 0700 ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts

# 传入多个 ssh key
RUN --mount=type=ssh mkdir -p -m 0700 ~/.ssh && \
    ssh-keyscan github.com >> ~/.ssh/known_hosts && \
    ssh-keyscan gitlab.com >> ~/.ssh/known_hosts

```

### 使用 ssh key

在任何需要使用 ssh key 的命令中，都需要加上 `--mount=type=ssh`，否则命令运行时将没有权限访问对应的 ssh key。

```dockerfile
# 传入单个 github.com 的 ssh key 时
RUN --mount=type=ssh git clone git@github.com:CrazySpottedDove/zac.git

# 传入多个 ssh key 时
# --ssh 后的参数即为 id=/path/to/id_rsa
RUN --mount=type=ssh,id=github_ssh_key git clone git@github.com:CrazySpottedDove/zac.git
RUN --mount=type=ssh,id=gitlab_ssh_key git clone git@gitlab.com:CrazySpottedDove/zac.git
```

的
