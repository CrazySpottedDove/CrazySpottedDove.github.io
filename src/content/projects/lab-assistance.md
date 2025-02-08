---
title: Lab-Assistance
description: 一个桌面应用，可以在考虑有效数字的同时进行数据处理，计算不确定度，并支持导出 LaTeX 图表代码
pubDate: 2025-02-07
updatedDate: 2025-02-08
tags: ["Lab-Assistance","vue","javascript","TeX","LaTeX"]
---


## 欢迎使用 [Lab-Assistance](https://github.com/CrazySpottedDove/Lab-Assistance)

* 还在因为搞不清楚有效数字而烦恼吗？
* 还在疲于计算各种统计量吗？
* 还在为了图表设计而头疼吗？

如果你是一名 LaTeX 用户，那么 Lab-Assistance 将会是一个很好的选择！

## 功能预览

Lab-Assistance 中的所有数据都遵循着有效数字的运算规则。

作为不使用 LaTeX 的用户，您关注的可能是这些功能：

### 有效数字、不确定度、各项统计量的参考文档

![alt text](../../../assets/mdPaste/lab-assistance/image.png)
![alt text](../../../assets/mdPaste/lab-assistance/image-1.png)
![alt text](../../../assets/mdPaste/lab-assistance/image-2.png)

### 自动计算统计量

![alt text](../../../assets/mdPaste/lab-assistance/image-3.png)

### 间接数据的批量计算

![alt text](../../../assets/mdPaste/lab-assistance/image-4.png)

### 不确定度的自动推断

![alt text](../../../assets/mdPaste/lab-assistance/image-5.png)

而对于 LaTeX 用户，Lab-Assistance 还提供如下的实用功能：

### 生成表格代码

![alt text](../../../assets/mdPaste/lab-assistance/image-6.png)

编译结果：

![alt text](../../../assets/mdPaste/lab-assistance/image-8.png)

### 生成绘图代码

![alt text](../../../assets/mdPaste/lab-assistance/image-7.png)

编译结果：
![alt text](../../../assets/mdPaste/lab-assistance/image-9.png)

Lab-Assistance 内部提供了详细的功能说明。更多的功能，就请各位自己探索了。

## 宏包

Lab-Assistance 提供的 LaTeX 命令需要对应的宏包才能使用。当然，你也可以选择在软件内复制依赖。

### 添加宏包

这里以 windows用户、 texlive 为例。

* 找到你的 texlive 安装目录，然后，将宏包文件 [lab-assistance.sty](https://github.com/CrazySpottedDove/Lab-Assistance/releases/download/webpage-download/lab-assistance.sty "Lab-Assistance的宏包文件") 复制到 /texlive/texmf-local/tex/latex/local/packages 目录下。如果没有其中一些目录，自行创建。
* 刷新文件数据库
  * 方法1：打开 tl-tray-menu.exe (通常在 texlive/<年份>下可以找到)，操作 => Regenerate filename database
  * 方法2：编辑 /textlive/texmf-local/ls-R， 确保其中拥有如下内容：

```txt
./tex/latex:
local

./tex/latex/local:
packages

./tex/latex/local/packages:
lab-assistance.sty
```

事实上，手动更新其它宏包也是同理。你可以在 local 文件夹中建立不同的文件夹来管理 cls, sty, 甚至一些依赖图片等。

* 在你的 .tex 文件的导言区使用

```latex
\usepackage{lab-assistance}
```

即可愉快地使用 Lab-Assistance 的命令了。

> 浙江大学-普物实验采用了电子实验报告的形式，作者提供了一个 [LaTeX 模板](https://github.com/CrazySpottedDove/PhysicsLabReportTemplate_LaTeX "LaTeX 模板仓库")，内部也使用了 lab-assistance.sty。

## 安装与更新

Lab-Assistance 支持 windows-64 版本和 macOS-arm64 版本。

作者较为繁忙，暂时没有对下载方式做比较好的优化，请用户耐心 follow 教程：

### 安装

* windows-64：提供两种安装方式： [setup.exe](https://github.com/CrazySpottedDove/Lab-Assistance/releases/download/webpage-download/Lab-Assistance_setup_v1.3.7.exe "win64-安装程序") 为安装程序。[win64.zip](https://objects.githubusercontent.com/github-production-release-asset-2e65be/842860378/9f6aece6-f23d-4e05-95c6-c6c5dad7f347?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=releaseassetproduction%2F20241201%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241201T025050Z&X-Amz-Expires=300&X-Amz-Signature=de6f08bd026038ef18a726fb886c32f5bc157301070cda2de7392554683c9fa5&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%3DLab-Assistance-win64.zip&response-content-type=application%2Foctet-stream "win64-便携版zip") 为便携版，解压即用。
* macOS-arm64：[macOS.zip](https://github.com/CrazySpottedDove/Lab-Assistance/releases/download/webpage-download/Lab-Assistance-macOS.zip "macOS-便携版zip") 为便携版，解压即用。如果提示 Lab-Assistance 已损坏，在终端上运行命令

```bash
xattr -cr /path/to/Lab-Assistance.app
```

### 更新

理论上，安装完成就可以使用 Lab-Assistance 了。但是，无法排除现有版本存在的一些 bug。并且，由于作者繁忙，并不会持续更新这个网站上的资源。作为解决方案，作者在 Lab-Assistance 中内置了更新功能。**在确保网络能够稳定连接 GitHub的情况下**，自动更新功能将正常运作，保证用户时刻体验最新发行版本。

另外，我们也提供了手动更新方式：

* windows :
  * 在一些较老旧的版本中，提供了 updater.exe， 在原来目录下运行即可完成更新。
  * 较新版本使用下载 package.nw 包，并替换 Lab-Assistance 目录下的 package.nw 包的方式更新。
* macOS:
  * 下载 app.nw 包，并替换 /Lab-Assistance.app/Contents/Resources 目录下的 app.nw 包。

**不推荐任何用户使用老旧版本！一些老版本存在数据计算错误的原则问题，且一般而言，老版本 bug 更多！**

任何使用过程中遇见的问题与建议，欢迎在 [issues](https://github.com/CrazySpottedDove/Lab-Assistance/issues "issues") 处指出！
