---
title: 操作系统
description: 操作系统笔记
pubDate: 2025-09-16
updatedDate: 2025-09-16
tags: ["operator system","note"]
category: "课程笔记"
---

> 评分
>
> - 期末 50%
> - 作业 5%
> - 课堂练习，点名 5%
> - 实验报告 20%
> - 实验验收 20%
> - lab6 4% 额外平时分

## Introduction

### What Operating System Do

操作系统是作为计算机用户和计算机硬件的中介的程序。

计算机系统 Computer System 可以分成四个部分：
- Hardware，如 CPU, memory, I/O 设备
- Operating System，控制并协调硬件的使用
- Application programs，定义系统资源被使用的方式
- Users

从计算机系统组成的观点来看，操作系统是系统软件。

从用户的角度来看，操作系统是用户与计算机硬件之间的接口。操作系统提供：
- 命令级接口，如键盘或鼠标等命令。
- 程序级接口，即操作系统服务，供用户程序和其它程序调用。

从系统角度来看，操作系统是计算机系统资源的管理者。操作系统管理了全部的资源，处理冲突的请求，并执行程序，避免错误和对计算机的不当使用。

总的来说，操作系统是一组有效控制和管理计算机各种硬件和软件资源，合理地组织计算机的工作流程，以及方便用户的程序的集合。

### Computer System Organization

### Linux 文件系统

- `home` 包含了除系统管理员外的所有用户的主目录
- `lib` 包含了系统使用的动态链接库(.so)和内核模块(modules)
- `mnt` 挂载的文件系统

