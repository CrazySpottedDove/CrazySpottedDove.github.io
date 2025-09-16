---
title: 计算机图形学
description: 计算机图形学笔记
pubDate: 2025-09-16
updatedDate: 2025-09-16
tags: ["computer graphics","note"]
category: "课程笔记"
---

## 概论
### 评分
- Lab: 30%
- Project: 40%
- 小测，作业，课堂问答 30%
### 定义
- 用像素来表示真实世界的科学技术?
- 在计算机中建模，处理和显示物体的科学技术。
### 基本任务
- 为世界建模
- 仿真现实世界中物体的行为
- 显示世界
图形与物理学是实现这些任务的传统工具。
### 为世界建模
对世界的数字表达有很多：
- Digital Images 数字图像
- 3D Geometric Objects 3D 几何图形
- Symbolic Descriptions 符号表达

> Digital Images 数字图像
> - 优点：直观，容易获取(如拍照)，适合表现复杂细节
> - 缺点：数据量大，不易编辑，分辨率受限，视角固定
>
> 3D Geometric Objects 3D 几何图形
> - 优点：数据量小，易于编辑和变换，可从任意视角观察
> - 缺点：难以表现复杂纹理和细节，建模复杂
>
> Symbolic Descriptions 符号表达
> - 优点：数据量最小，完全参数化，精确控制
> - 缺点：表达能力有限，不直观，仅适用于特定场景

我们注重 Graphics Representation。

```c
Point3D{
    double x;
    double y;
    double z;
};
Line{
    Point3D a;
    Point3D b;
};
Cuboid{
    LCS3D local; //局部坐标系，其实就是一个点
    double x;
    double y;
    double z;
};
```

对于复杂的物体，我们往往使用很多的面片来表示它。

Three very important and rather complex attributes:
- complex shape
- visual look or appearance due to lighting effects
- dynamic behaviour due to interaction with other elements of the world -- movement, sound, elastic effects...

### 仿真现实世界中物体的行为

略

### 显示世界

将三维对象转换成图像（Display,rendering）。

### 应用

- CAD（Computer-Aided Design，计算机辅助设计）：利用计算机进行产品、建筑、机械等的设计、绘图和建模，提高设计效率和精度，常用于工程、建筑、制造等领域。
- GIS（Geographic Information System，地理信息系统）：用于采集、存储、管理、分析和展示地理空间数据的系统，广泛应用于地图制作、城市规划、资源管理、环境监测等领域。
- 影视
- 游戏
- 科学可视化
- 虚拟现实
- UI