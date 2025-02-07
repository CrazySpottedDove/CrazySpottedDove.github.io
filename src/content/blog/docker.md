---
title: 基本的 docker 使用方法
description: docker 容器技术解决了依赖地狱问题。
pubDate: 2025-02-07
updatedDate: 2025-02-07
tags: ["docker","Dockerfile"]
---

## Docker 网络配置

Docker 网络配置一直是国内使用 Docker 的一个痛点。简单来说，Docker 网络配置大致分为三种情况：

* Docker daemon 管理镜像和容器，相关典型操作为`docker pull`
* Docker build 时的临时容器环境
* Docker container 运行时环境

### 为 Docker daemon 配置网络

不同系统上，Docker daemon 的配置文件位置不同。我的系统为 archWsl2，配置文件为`/etc/docker/daemon.json`

```json
{
 "proxies":{
  "http-proxy":"http://127.0.0.1:10809",
  "https-proxy":"http://127.0.0.1:10809",
  "no-proxy":"localhost,127.0.0.1"
 }
}
```

这里填写的代理地址需要你自行确认。linux 下可以通过`echo $http_proxy`检查。

### 为 Docker build 配置网络

一个方便的方法是直接让`docker build`时使用宿主机网络。这只需要在使用该命令时指定`network`变量即可：

```bash
# 一个 docker build 示例
docker build -t example --network host .
```

### 为 Docker container 配置网络

在我的系统中，Docker container 的配置文件位置在`~/.docker/config.json`。

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

## Dockerfile

在项目的构建中，为了保证环境统一，我们常常需要构建自己的 docker 镜像。我们可以把相关操作放在一个 Dockerfile 文件中，然后通过它生成镜像。

### 常用命令

```Dockerfile
# FROM：指定基础镜像
FROM ubuntu:20.04

# WORKDIR：指定工作目录，即之后所有命令的默认执行目录
WORKDIR /app

# ENV：添加环境变量
ENV VCPKG_ROOT=/app/vcpkg

# COPY：将本地文件或目录复制到镜像中
COPY
```
