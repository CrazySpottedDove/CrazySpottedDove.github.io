---
title: 基本的 docker 使用方法
description: docker 容器技术解决了依赖地狱问题，使得项目的构建变得简单
pubDate: 2025-02-07
updatedDate: 2025-02-07
tags: ["docker","Dockerfile","network"]
category: "实用技术"
---
## 基本概念

* image <=> 镜像：一个模板，包含了运行某个应用程序所需的一切，比如代码、运行时环境、库和配置等。
* container <=> 容器：镜像的可执行实例，利用镜像构建运行时环境，可以启动、停止、删除和交互。
* Docker Hub <=> Docker 仓库，存储着大量可用镜像。
* Docker daemon <=> docker 守护进程/引擎，它提供 Docker API 接口并管理容器。用户使用 docker 命令，然后 docker 命令会通过 Docker API 对守护进程发起请求，以执行对容器的相关操作。如果守护进程停止或者重启，所有的容器都会停止或重启。

## Docker 基本命令

### 拉取和检查 image

`docker pull`命令可以拉取可用的 image：

```bash
docker pull busybox
# stdout
Using default tag: latest
latest: Pulling from library/busybox
9c0abc9c5bd3: Pull complete
Digest: sha256:a5d0ce49aa801d475da48f8cb163c354ab95cab073cd3c138bd458fc8257fbf1
Status: Downloaded newer image for busybox:latest
docker.io/library/busybox:latest
```

可以使用`docker images`命令来查看本地有哪些 image

```bash
docker images
# example stdout
REPOSITORY        TAG          IMAGE ID       CREATED        SIZE
init              latest       1685da567cfe   29 hours ago   266MB
<none>            <none>       71b2386e14aa   35 hours ago   77.9MB
vcpkg_installed   latest       4b5dd309337d   35 hours ago   77.9MB
koa-demo          latest       3ef13caf5890   6 days ago     677MB
hello-world       latest       74cc54e27dc4   2 weeks ago    10.1kB
ubuntu            latest       b1d9df8ab815   2 months ago   78.1MB
busybox           latest       af4709625109   4 months ago   4.27MB
php               5.6-apache   24c791995c1e   6 years ago    355MB
```

### 从 image 运行 container

`docker run`会先检查本地是否已经有指定的 image(没有则尝试拉取)，然后从这个 image 创建一个 container

```bash
docker run busybox echo "hello from busybox"
# stdout
hello from busybox
```

如上的命令从本地的 busybox image 创建了 container，并让它执行了命令`echo "hello from busybox"`。

可以使用`docker ps`命令来查看当前正在运行的 container

```bash
docekr ps
# stdout
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

可以发现什么在运行的容器都没有。这是因为之前建立的 container 在执行了`echo`命令后就光荣退役了。

我们可以再使用`docker ps -a`来查看所有的 container

```bash
docker ps -a
# example stdout
CONTAINER ID   IMAGE                    COMMAND                  CREATED              STATUS                          PORTS     NAMES
a7ce83fb76c1   busybox                  "echo 'hello from bu…"   About a minute ago   Exited (0) About a minute ago             nervous_taussig
56ca32f9766d   hello-world              "/hello"                 13 minutes ago       Exited (0) 13 minutes ago                 hungry_haibt
91236c261621   vcpkg_installed:latest   "bash"                   34 hours ago         Exited (0) 29 hours ago                   blissful_johnson
```

想要让容器不止执行一个命令？一个可能的想法是进入容器，然后在里面执行一些命令。这时，我们可以用

```bash
docekr run -it busybox
```

这时，你大概率会发现你的终端提示符不太一样了，这表明你进入了容器内部。一个通用的检查方法是：`ls`一下吧

```bash
# in the container
ls
# stdout
bin   dev   etc   home  proc  root  sys   tmp   usr   var
```

想要退出这个容器，只需要运行`exit`就可以了。

这时，如果你再一次`docker ps -a`，你会发现有了两个 busybox 容器。

```bash
docker ps -a
CONTAINER ID   IMAGE                    COMMAND                  CREATED          STATUS                      PORTS     NAMES
a12779762bd0   busybox                  "sh"                     8 minutes ago    Exited (0) 5 minutes ago              priceless_murdock
a7ce83fb76c1   busybox                  "echo 'hello from bu…"   17 minutes ago   Exited (0) 17 minutes ago             nervous_taussig
```

### 删除容器

为了在容器工作完成后立刻删除它，你可以在`docker run`时添加参数`--rm`，如`docker run busybox --rm`

你也可以通过指明待删除容器 id 的方式删除已有容器。如果删除成功，会返回被删除的容器 id。

```bash
docker rm a12779762bd0 a7ce83fb76c1
# stdout
a12779762bd0
a7ce83fb76c1
```

如果希望删除所有的不在工作的容器，可以使用`docker container prune`

```bash
docker container prune
# example stdout
WARNING! This will remove all stopped containers.
Are you sure you want to continue? [y/N] y
Deleted Containers:
56ca32f9766d03f4ed2142e535df07eee9bf5a9d5870bc7c8c3f4861501a118c
91236c261621a3d45375ad73b4f1d83633e553efc45ab9988dc06ca38a50ce7c

Total reclaimed space: 75B
```

### 删除镜像

使用`docker rmi`加指定 id 的方式可以删除镜像

```bash
# example
docker rmi 71b2386e14aa
Deleted: sha256:71b2386e14aab3e2711bee1f743ed6c5106886a40820ecee5ce528a0b5e5ff93
```

## 用 docker 运行静态网站

处于学习角度，我们先拉取一个带有静态网页的镜像

```bash
docker run --rm -it prakhar1989/static-site
# stdout
Unable to find image 'prakhar1989/static-site:latest' locally
latest: Pulling from prakhar1989/static-site
d4bce7fd68df: Pull complete
a3ed95caeb02: Pull complete
573113c4751a: Pull complete
31917632be33: Pull complete
77e66f18af1c: Pull complete
df3f108f3ade: Pull complete
d7a279eb19f5: Pull complete
e798589c05c5: Pull complete
78eeaf458ae0: Pull complete
Digest: sha256:bb6907c8db9ac4c6cadb25162a979e286575cd8b27727c08c7fbaf30988534db
Status: Downloaded newer image for prakhar1989/static-site:latest
Nginx is running...
```

你可以看到服务器已经在工作了。然而，我们的网站在哪里呢？它在哪个端口运行？

### 暴露端口

我们退出容器，重新使用下面的命令

```bash
docker run -d -P --name static-site prakhar1989/static-site
# exapmle stdout
24eabde8f23d1d10441890eabee703f5cb61e4c8b8e244f5c1ac8447a1c762e3
```

这里用到了多个 flag:

* -d 启用 detached 模式，使得容器在后台运行，不占用当前的终端
* --name 为容器指定了名称，这里是 static-site
* -P 会将容器内部的端口映射到宿主机上随机分配的端口。这样，我们就可以通过宿主机的端口来访问容器内的服务了

那么，究竟映射到了哪些端口呢？可以通过`docker port`命令来检查

```bash
docker port static-site
# example stdout
80/tcp -> 0.0.0.0:56904
80/tcp -> [::]:56904
443/tcp -> 0.0.0.0:56905
443/tcp -> [::]:56905
```

> 443 端口是容器中 Nginx 默认暴露出的 HTTPS 端口，可能需要在容器中配置 HTTPS 证书才能访问。方便起见，我们以 80 端口为例。
>
这时我们就可以访问`localhost:56904`，应当看到如下页面：

![alt text](../../../assets/mdPaste/docker/image.png)

很简单不是吗？

### 停止容器

使用`docker stop`停止这个容器。

```bash
docker stop static-site
# stdout
static-site
```

### 在运行容器时指定端口

上面我们已经知道了，容器内部的端口为 80。于是，我们可以通过`-p`flag来指定内外端口映射关系

```bash
# 将容器的 80 端口映射到宿主机的 8888 端口
docker run -p 8888:80 prakhar1989/static-site
# stdout
Nginx is running...
```

现在，就可以访问`localhost:8888`，看到同样的页面了。

## 制作自己的 docker 镜像

### 镜像的种类

大多数情况下，我们都是先拉取以一个 docker 镜像作为出发点，在它的基础上制作。那么，了解镜像的种类就是必要的。

就依赖关系，镜像分为

* Base images：没有依赖的镜像，往往是系统镜像，比如一个 ubuntu 镜像
* Child images：依赖于其它镜像的镜像

就维护者，镜像分为

* Official images：由官方维护的镜像，典型的是`hello-world`镜像。
* User images：由不同的用户创建并维护的镜像。在命名上，它们比官方镜像多一个用户名前缀，即`<user>/<image-name>`。

### 搜索镜像

使用`docker search`命令可以搜索镜像

```bash
docker search ubuntu
# example stdout
NAME                             DESCRIPTION                                     STARS     OFFICIAL
ubuntu                           Ubuntu is a Debian-based Linux operating sys…   17472     [OK]
ubuntu/squid                     Squid is a caching proxy for the Web. Long-t…   105
ubuntu/nginx                     Nginx, a high-performance reverse proxy & we…   126
ubuntu/cortex                    Cortex provides storage for Prometheus. Long…   4
ubuntu/kafka                     Apache Kafka, a distributed event streaming …   53
ubuntu/apache2                   Apache, a secure & extensible open-source HT…   86
ubuntu/bind9                     BIND 9 is a very flexible, full-featured DNS…   101
ubuntu/prometheus                Prometheus is a systems and service monitori…   70
ubuntu/zookeeper                 ZooKeeper maintains configuration informatio…   13
ubuntu/mysql                     MySQL open source fast, stable, multi-thread…   67
ubuntu/postgres                  PostgreSQL is an open source object-relation…   40
ubuntu/redis                     Redis, an open source key-value store. Long-…   23
ubuntu/jre                       Distroless Java runtime based on Ubuntu. Lon…   19
ubuntu/dotnet-aspnet             Chiselled Ubuntu runtime image for ASP.NET a…   23
ubuntu/grafana                   Grafana, a feature rich metrics dashboard & …   12
ubuntu/cassandra                 Cassandra, an open source NoSQL distributed …   2
ubuntu/dotnet-deps               Chiselled Ubuntu for self-contained .NET & A…   16
ubuntu/memcached                 Memcached, in-memory keyvalue store for smal…   5
ubuntu/prometheus-alertmanager   Alertmanager handles client alerts from Prom…   9
ubuntu/dotnet-runtime            Chiselled Ubuntu runtime image for .NET apps…   20
ubuntu/python                    A chiselled Ubuntu rock with the Python runt…   20
ubuntu/mlflow                    MLFlow: for managing the machine learning li…   5
ubuntu/telegraf                  Telegraf collects, processes, aggregates & w…   4
ubuntu/loki                      Grafana Loki, a log aggregation system like …   2
ubuntu/chiselled-jre             [MOVED TO ubuntu/jre] Chiselled JRE: distrol…   3
```

### Dockerfile

在项目的构建中，为了保证环境统一，我们常常需要构建自己的 docker 镜像。我们可以把相关操作放在一个 Dockerfile 文件中，然后通过它生成镜像。

就让我们选择一个可以随机生成猫猫 gif 的 python 项目作为练习吧！

```bash
git clone https://github.com/prakhar1989/docker-curriculum.git
cd docker-curriculum/flask-app
```

在项目目录下，我们可以看见一个 Dockerfile 文件。它的内容如下：

```dockerfile
FROM python:3.8

# set a directory for the app
WORKDIR /usr/src/app

# copy all the files to the container
COPY . .

# install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# tell the port number the container should expose
EXPOSE 5000

# run the command
CMD ["python", "./app.py"]
```

这里面涉及一些基本的 Dockerfile 命令，让我们一一讲解。

* `FROM python:3.8`指定了我们的镜像在 python:3.8 这个 base image 的基础上构建
* `WORKDIR /usr/src/app`指定了工作目录，之后所有命令都默认在此执行
* `COPY . .`把指定文件复制到镜像临时容器的指定位置中，这里是把所有文件复制到了工作目录
* `RUN pip install --no-cache-dir -r requirements.txt`即通过`RUN`来在镜像临时容器内执行命令
* `EXPOSE 5000`指定要将容器内部的哪一个网络端口暴露出来
* `CMD ["python", "./app.py"]`指定了构建好镜像后，我们使用`docker run`从它运行容器时默认执行的命令

### docker build

使用`docker build`命令可以从 Dcokerfile 创建一个新的镜像。

```bash
# docker build 接受一个参数，用于指明包含 Dockerfile 的目录
# 这里 docker build 还使用了一个 flag -t，用于为镜像赋予一个 tag
# tag 的前缀一般建议用你的用户名
docker build -t CrazySpottedDove/catnip .
# example stdout
[+] Building 6.1s (9/9) FINISHED                                                                                                                         docker:default
=> [internal] load build definition from Dockerfile                                                                                                                0.0s
=> => transferring dockerfile: 340B                                                                                                                                0.0s
=> [internal] load metadata for docker.io/library/python:3.8                                                                                                       1.5s
=> [internal] load .dockerignore                                                                                                                                   0.0s
=> => transferring context: 2B                                                                                                                                     0.0s
=> [1/4] FROM docker.io/library/python:3.8@sha256:d411270700143fa2683cc8264d9fa5d3279fd3b6afff62ae81ea2f9d070e390c                                                 0.0s
=> [internal] load build context                                                                                                                                   0.0s
=> => transferring context: 200B                                                                                                                                   0.0s
=> CACHED [2/4] WORKDIR /usr/src/app                                                                                                                               0.0s
=> CACHED [3/4] COPY . .                                                                                                                                           0.0s
=> [4/4] RUN pip install --no-cache-dir -r requirements.txt                                                                                                        4.2s
=> exporting to image                                                                                                                                              0.2s
=> => exporting layers                                                                                                                                             0.1s
=> => writing image sha256:e38fe3a6e779f9bdda810c8b9b1b643b346e12af8c16ef56e5ae49bc2039d2f1                                                                        0.0s
=> => naming to CrazySpottedDove/catnip                                                                                                                            0.0s
```

>由于网络问题，上面的命令可能会失败。你可以尝试按照之前在 *Docker 网络配置*中提到的方法，确认宿主机代理正常，并改用命令`docker build -t CrazySpottedDove/catnip --network host .`

现在，我们可以在`docker images`中看到新建立的镜像了：

```bash
REPOSITORY                TAG          IMAGE ID       CREATED         SIZE
CrazySpottedDove/catnip   latest       e38fe3a6e779   3 minutes ago   1.01GB
```

利用*使用 docker 运行静态网页*中提到的方法，验证一下镜像的可用性吧！

```bash
docker run -p 8888:5000 CrazySpottedDove/catnip --rm

```

### 常用命令

```dockerfile
# FROM：指定基础镜像
FROM ubuntu:20.04

# WORKDIR：
WORKDIR /app

# ENV：添加环境变量
ENV VCPKG_ROOT=/app/vcpkg

# COPY：将本地文件或目录复制到镜像中
COPY . /app

# ARG：接受 docker build 时的变量
# 通过 --build-arg EXAMPLE=whatever 传递
ARG EXAMPLE

# 运行一个命令
RUN apt-get install git
```

> Reference: [https://docker-curriculum.com/](https://docker-curriculum.com/)
