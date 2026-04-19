---
title: 微分几何
description: 自学微分几何的笔记
pubDate: 2026-03-21
updatedDate: 2026-03-21
tags: ["differential geometry"]
category: "自学笔记"
---

这个笔记完全是自学所记，主要记录一些关键知识和自己的理解。

## 曲率和 Frenet 标架

### 曲率的定义

设曲线 $\mathbf{r}=\mathbf{r}(s)$ ($s$ 为弧长参数) 存在二阶导数，则称 $\left|\mathbf{r}''(s)\right|$ 为曲线在 $P(s)$ 处的曲率，记作 $\kappa (s)$。

$\mathbf{r}'(s)$ 的长度永远为 1，所以它实际上就是曲线在 $\mathbf{r}$ 在 $P(s)$ 处的单位切向量，那么曲率也就体现了曲线的切向的变化率。在几何直观上，它描述了曲线的弯曲程度。

- 曲线为直线当且仅当其曲率永远为 0。
- 圆的曲率恒为一个非零常数。

通过把圆放到一个合适的坐标系里，使得圆的方程为

$$
\mathbf{r}(s)=\left(R\cos\left(\frac{s}{R}\right),
R\sin\left(\frac{s}{R}\right), 0\right)
$$

那么就有

$$
\left\{
  \begin{align*}
    \mathbf{r}'(s)&=\left( -\sin\left(\frac{s}{R}\right),
    \cos\left(\frac{s}{R}\right), 0 \right)\\
    \mathbf{r}''(s)&= \frac{1}{R}\left(
    -\cos\left(\frac{s}{R}\right), -\sin\left(\frac{s}{R}\right),0 \right)
  \end{align*}
  \right.
$$

于是圆的曲率恒为 $\frac{1}{R}$。

### Frenet 标架

设曲线 $\mathbf{r}(s)$ 在每一点的曲率都不等于 0，则称

$$
\left\{
  \begin{align*}
    \mathbf{\alpha }(s)&=\mathbf{r}'(s)\\
    \mathbf{\beta }(s)&=\frac{\mathbf{r}''(s)}{\left|\mathbf{r}''(s)\right|}\\
    \mathbf{\gamma }(s)&=\frac{\mathbf{r}'(s)\times
    \mathbf{r}''(s)}{\left|\mathbf{r}'(s)\times \mathbf{r}''(s)\right|}
  \end{align*}
  \right.
$$

分别为曲线在 $P(s)$ 处的单位切向量、主法向量和副法向量。这三个向量都是单位向量。

当一个向量函数在每一点的值模长始终为 1 时，它的导函数在每一点和它都垂直。所以，我们就得出 $\mathbf{\beta }(s)$ 和 $\mathbf{\alpha }(s)$ 垂直。因此，上面的三个向量就两两垂直。

于是，我们称

$$
\left\{ P(s);\mathbf{\alpha }(s),\mathbf{\beta }(s),\mathbf{\gamma }(s) \right\}
$$

为曲线 $\mathbf{r}(s)$ 在点 $P(s)$ 处的 Frenet 标架，三个向量统称为基本向量。

### 基本向量和曲率的一般参数表示

$$
\left\{
  \begin{align*}
    \mathbf{\alpha}&=\frac{\mathbf{r}'(t)}{\left|\mathbf{r}'(t)\right|}\\
    \mathbf{\gamma }&=\frac{\mathbf{r}'(t)\times
    \mathbf{r}''(t)}{\left|\mathbf{r}'(t)\times \mathbf{r}''(t)\right|}\\
    \mathbf{\beta }&=\mathbf{\gamma }\times \mathbf{\alpha }
  \end{align*}
  \right.
$$

证明略。主要思路即通过复合函数求导法则推导。注意几何含义：$\frac{\mathrm{d}s}{\mathrm{d}t}=|\mathbf{r}'(t)|$。

在推导过程中，我们会得到

$$
\mathbf{r}'(t)\times \mathbf{r}''(t) = \left|\mathbf{r}'(t)\right|^3
\left( \mathbf{r}'(s) \times \mathbf{r}''(s) \right)
$$

于是就有

$$
\kappa =
\frac{\left|\mathbf{r}'(t)\times\mathbf{r}''(t)\right|}{\left|\mathbf{r}(t)'\right|^3}
$$

### 基本三棱形

- 过 $P$ 点，平行于 $\mathbf{\alpha }, \mathbf{\beta }, \mathbf{\gamma }$ 的直线分别称为曲线在点 $P$ 的切线、主法线和副法线。
- 过 $P$ 点，垂直于 $\mathbf{\alpha }, \mathbf{\beta }, \mathbf{\gamma }$ 的平面分别称为曲线在点 $P$ 的法平面，从切平面和密切平面。
- 由 $P$ 点和 $P$ 点的三个基本向量，切线，主法线和副法线，法平面，从切平面和密切平面构成的图形称为曲线在 $P$ 点的基本三棱形。

![alt text](mdPaste/differential_geometry/image.png)

它们的方程分别为：

$$
\left\{
  \begin{align*}
    \mathbf{\rho }-\mathbf{r}&=\lambda \mathbf{\alpha }\\
    \mathbf{\rho }-\mathbf{r}&=\lambda \mathbf{\beta }\\
    \mathbf{\rho }-\mathbf{r}&=\lambda \mathbf{\gamma }\\
    \left( \mathbf{\rho }-\mathbf{r} \right) \cdot \mathbf{\alpha }&=0\\
    \left( \mathbf{\rho }-\mathbf{r} \right) \cdot \mathbf{\beta  }&=0\\
    \left( \mathbf{\rho }-\mathbf{r} \right) \cdot \mathbf{\gamma  }&=0
  \end{align*}
  \right.
$$

空间曲线一点处的密切平面就是和曲线在该点最为贴近的一个平面。

## 挠率和 Frenet 公式

### 挠率

$\mathbf{\gamma }'(s) \parallel \mathbf{\beta }(s)$：
由

$$
\mathbf{\alpha }'(s)=\kappa (s)\mathbf{\beta }(s)
$$

和

$$
\mathbf{\gamma }'(s)=\mathbf{\alpha }'(s)\times \mathbf{\beta
}(s)+\mathbf{\alpha }(s)\times \mathbf{\beta }'(s)
$$

可得

$$
\mathbf{\gamma }'(s)=\mathbf{\alpha }(s)\times \mathbf{\beta }'(s)
$$

所以，$\mathbf{\gamma }'(s)$ 与 $\mathbf{\alpha }(s)$ 垂直，而 $\mathbf{\gamma} (s)$ 为单位长，于是可得 $\mathbf{\gamma }'(s)$ 垂直于 $\mathbf{\gamma }(s)$，因此 $\mathbf{\gamma }'(s) \parallel \mathbf{\beta }(s)$。

我们不妨设

$$
\mathbf{\gamma }'(s)=-\tau (s)\mathbf{\beta }(s)
$$

于是(这里用到了 $\mathbf{\beta }(s)$ 是单位向量的性质)

$$
\tau (s)=-\mathbf{\gamma }'(s)\cdot \mathbf{\beta }(s)
$$

我们称 $\tau (s)$ 为曲线的挠率。

### 挠率的表达式

$$
\begin{align*}
  \tau (s)&=\frac{\left( \mathbf{r}'(s), \mathbf{r}''(s),
  \mathbf{r}'''(s) \right)}{\kappa ^2(s)}\\
  \tau (t)&=\frac{\left( \mathbf{r}'(t), \mathbf{r}''(t),
  \mathbf{r}'''(t) \right)}{\left|\mathbf{r}'(t)\times \mathbf{r}''(t)\right|^2}
\end{align*}
$$

### Frenet 公式

$$
\left\{
  \begin{align*}
    \mathbf{\alpha }'(s)&=\kappa (s)\mathbf{\beta }(s)\\
    \mathbf{\beta }'(s)&=-\kappa (s)\mathbf{\alpha }(s)+\tau (s)\gamma (s)\\
    \mathbf{\gamma }'(s)&=-\tau (s)\beta (s)
  \end{align*}
  \right.
$$

此为曲线在点 $P(s)$ 处的 Frenet 公式。这意味着，三个基本向量的导数可以直接由曲率、挠率和三个基本向量的线性组合表示。

### 几何含义

> 曲率处处不为零的空间曲线为平面曲线，当且仅当其挠率为 0。

单向证明：

如果 $\mathbf{r}(s)$ 是一条平面曲线，那么设它所在的平面的法向量为 $\mathbf{n}$。于是单位切向量

$$
\mathbf{\alpha }\cdot \mathbf{n} = 0
$$

上式两端同时对 $s$ 求导即有

$$
\left\{
  \begin{align*}
    \mathbf{r}''(s)\cdot \mathbf{n}&=0\\
    \mathbf{r}'''(s)\cdot \mathbf{n}&=0
  \end{align*}
  \right.
$$

于是就可以知道，这三个导数共面，根据挠率的表达式就得到挠率的值为 $0$。

这说明，挠率刻画了空间曲线在垂直于切平面方向上的弯曲程度。

> 所有密切平面过定点的正则曲线是平面曲线。

这和所有切线过定点的正则曲线是直线很类似！

## 空间曲线一点邻近的结构

对于向量函数，我们依然有泰勒展开式。因此，如果 $\mathbf{r}(s)$ 是一条曲率处处不为 0 的空间曲线，那么就有它在 $P(0)$ 的邻近有

$$
\mathbf{r}(s)-\mathbf{r}(0)=\mathbf{\alpha }(0)s + \frac{1}{2} \kappa
(0)\mathbf{\beta }(0)s^2 + \frac{1}{6} \kappa '(0) \beta (0) s^3 +
\frac{1}{6}\kappa (0)(-\kappa (0)\mathbf{\alpha }(0)+ \tau
(0)\mathbf{\gamma }(0))s^3 + o(s^3)
$$

整理即有

$$
\mathbf{r}(s)-\mathbf{r}(0)=\left( s - \frac{1}{6}\kappa ^2(0)s^3
\right)\mathbf{\alpha }(0)+ \left( \frac{1}{2}\kappa (0)s^2 +
\frac{1}{6} \kappa '(0)s^3 \right)\beta (0) + \left(\frac{1}{6}\kappa
(0)\tau (0)s^3\right) \mathbf{\gamma }(0) + o(s^3)
$$

这实质上是转化成了坐标系 $\left\{ \mathbf{r}(0), \mathbf{\alpha }(0), \mathbf{\beta }(0), \mathbf{\gamma }(0) \right\}$ 下的坐标。

$$
\left\{
  \begin{align*}
    x(s)&=s - \frac{1}{6}\kappa ^2(0)s^3 + o(s^3)\\
    y(s)&=\frac{1}{2}\kappa (0)s^2 + \frac{1}{6} \kappa '(0)s^3 + o(s^3)\\
    z(s)&=\frac{1}{6}\kappa (0)\tau (0)s^3 + o(s^3)
  \end{align*}
  \right.
$$

如果我们再做一次近似，那就变成了

$$
\left\{
  \begin{align*}
    \bar{x}(s)&=s\\
    \bar{y}(s)&=\frac{1}{2}\kappa (0)s^2\\
    \bar{z}(s)&=\frac{1}{6}\kappa (0)\tau (0)s^3
  \end{align*}
  \right.
$$

这就得到了一个新的曲线 $\bar{\mathbf{r}}(s)=\left\{ \bar{x}(s),\bar{y}(s),\bar{z}(s) \right\}$。我们把这个曲线称作 $\mathbf{r}(s)$ 在点 $s_0=0$ 邻近的近似曲线。

那么，一种自然的想法，就是通过近似曲线的形状来近似地构建原曲线的形状。

一个比较好的性质是，近似曲线和原曲线在 $s_0=0$ 处的曲率和挠率是一致的。

可以看到，近似曲线在密切平面上的投影是一个抛物线。近似曲线穿过法平面，但不穿过从切平面。

近似曲线在法平面上的投影是一个半立方抛物线。近似曲线穿过密切平面，但不穿过从切平面。

综上：

1. 近似曲线必然穿过密切平面和法平面，但不穿过从切平面。

2. 主法向量总是指向曲线凹入的方向。

近似曲线的形状取决于曲率和挠率，因此，曲率和挠率决定了几何曲线的形状。

## 曲线论中的几何不变量

### 参数变换

设 $t=t(\bar{t})$ 是曲线 $\mathbf{r}(t)$ 的参数 $t$ 关于变量 $\bar{t}$ 的 $C_1$ 类函数，如果

$$
\frac{\mathrm{d}t}{\mathrm{d}\bar{t}}\ne 0
$$

则称 $t=t(\bar{t})$ 是曲线 $\mathbf{r}(t)$ 的一个参数变换。如果

$$
\frac{\mathrm{d}t}{\mathrm{d}\bar{t}} > 0
$$

则称 $t=t(\bar{t})$ 是曲线 $\mathbf{r}(t)$ 的一个保持定向的参数变换。

由于作为参数变换时，已经保证了 $t(\bar{t})$ 的导数不为零，同时又因为它的导函数连续，所以就有

$$
\frac{\mathrm{d}t}{\mathrm{d}\bar{t}}
$$

的符号是确定的，要么为正，要么为负。

对一条曲线应用参数变换时，曲线的形状并不会发生改变，改变的只是曲线的参数范围以及曲线的方向。

进一步地，有：

**空间曲线的正则性、弧长的绝对值，曲率和挠率都与参数变换的选择无关**。

这些结论通过复合求导法则很好证明，此略。

### 运动

把空间中的映射

$$
\mathbf{a}\rightarrow A \mathbf{a} + \mathbf{b}
$$

称为运动。其中， $A$ 是一个行列式为 1 的正交矩阵，被称为运动的系数矩阵。

显然，考虑向量 $\mathbf{p}$，它的两个顶点做了运动后，可以得到

$$
\mathbf{p}'=A \mathbf{p}
$$

更进一步，有如下结论：

1. 运动不改变两个向量的点积。
2. 运动不改变向量的长度。
3. 运动不改变两个向量的夹角。
4. 运动不改变两个向量的叉积。
5. 运动不改变三个向量的混合积。

然后，就会有很自然的结论；
- 运动将一个空间右手直角标架映射成一个新的空间右手直角标架。

我们还可以证明出，对于任意两个右手直角标架，都存在一个运动，将其中一个变换成另一个。这可以联想到图形学中，世界坐标系->局部坐标系的映射。

利用运动关于坐标系映射的性质，下面的结论也变得自然：

空间曲线的正则性，弧长，曲率和挠率都是运动不变量。

综上，我们得出，空间曲线的正则性，曲率和挠率都是空间不变量。

## 曲线论的基本定理

设 $\kappa (s)>0$ 和 $\tau (s)$ 是两个连续函数，那么在空间中存在唯一形状的一条曲线，满足它以 $s$ 为弧长， $\kappa (s)$ 为曲率， $\tau (s)$ 为挠率。

时间原因，这里不给出证明。

## 曲面的基本概念

称二元向量函数 $\mathbf{r}(u,v)=\left\{ x(u,v),y(u,v),z(u,v) \right\}, (u, v)\in D$ 为 $R^3$ 中的一个参数曲面（曲面）。此处， $D$ 指 $u,v$ 平面上的一个开区域，往往为开矩形 $(a,b)\times (c,d)$。

我们用 $\mathbf{r}_u=\left\{ x_u,y_u,z_u \right\}$ 表示 $\mathbf{r}(u,v)$ 对 $u$ 的偏导数，用 $\mathbf{r}_{uu}, \mathbf{r}_{uv}, \mathbf{r}_{vv}$ 表示 $\mathbf{r}(u,v)$ 的二阶偏导数。一般而言，我们希望曲面至少是 $C^3$ 类的，即它至少有三阶的连续偏导数。

### 曲面的正则性

如果点 $(u_0,v_0)$ 满足

$$
\left( \mathbf{r}_u \times \mathbf{r}_v \right)|_{(u_0,v_0)}\ne \mathbf{0}
$$

则称 $(u_0,v_0)$ 是曲面上的正则点。如果曲面上的所有点都是正则点，则称这个曲面是一个正则曲面。

这保证了， $\mathbf{r}_u(u_0,v_0)$ 与 $\mathbf{r}_v(u_0,v_0)$ 是不共线的，且它们都不为 $\mathbf{0}$。

二维实函数的图像就是一个正则曲面。

给定一个正则点 $P=(u_0,v_0)$，存在一个 $P$ 的邻域 $U$ 到曲面 $\mathbf{r}(u,v)|_U$ 的一一映射。

进一步地，对于一个正则曲面，可以实现 $(u,v)$ 平面上的点到 $\mathbf{r}(u,v)$ 上的一一映射。

正因此，我们可以称 $\left( u_0,v_0 \right)$ 为曲面的位置向量 $\mathbf{r}(u_0,v_0)$ 的终点的曲纹坐标，称 $u,v$ 平面中的直线 $v=v_0,u=u_0$ 在 $\mathbf{r}$ 下的像为曲面的 $u-$ 曲线和 $v-$ 曲线。$u-$ 曲线和 $v-$ 曲线统称为坐标曲线；曲面上的两族坐标曲线构成的图形，称为曲纹坐标网，简称坐标网。

## 切平面与法线

### 切向量

前面我们已经说明了对于正则曲面， $(u,v)$ 和 $\mathbf{r}(u,v)$ 存在双射。因此，我们很容易想到，将曲面上的曲线，利用 $(u,v)$ 平面上的曲线来表示。

$(u,v)$ 平面上的曲线很容易表示为 $(u(t),v(t))$，那么对应到曲面上，也就是 $\mathbf{r}(t)=\mathbf{r}(u(t),v(t))$。

如果一条连续可微的曲面上的曲线过了点 $(u_0,v_0)$，那么该曲线在 $(u_0,v_0)$ 的切向量，称为曲面在该点的一个切向量。

### 切平面

令我们欣喜的是，对于一个正则曲面，一点 $(u_0,v_0)$ 上的所有切向量恰好在同一平面上。

>考虑任意一条曲线 $(u(t),v(t))$，设它在 $(u_0=u(t_0),v_0=v(t_0))$ 的切向量为 $\mathbf{a}$，有：
>
> $$
> \mathbf{a}=\frac{\mathrm{d}\mathbf{r}(u(t),v(t))}{\mathrm{d}t}|_{t=t_0}=\mathbf{r}_u \frac{\mathrm{d}u}{\mathrm{d}t}|_{t=t_0}+\mathbf{r}_v \frac{\mathrm{d}v}{\mathrm{d}t}|_{t=t_0}
> $$
>
> 这就意味着， $\mathbf{a}$ 是在 $\mathbf{r}_u,\mathbf{r}_v$ 张成的一个平面上！

于是，我们就可以定义这个平面为曲面在该点的切平面。

### 切方向

切平面上非零切向量所指的方向，称为切方向。切方向的方向可以通过切向量在基底 $\mathbf{r}_u,\mathbf{r}_v$ 下的坐标 $\left( \frac{\mathrm{d}u(t)}{\mathrm{d}t},\frac{\mathrm{d}v(t)}{\mathrm{d}t} \right)$ 来表示。

切方向的方向通过比值 $\frac{\mathrm{d}u(t)}{\mathrm{d}t}:\frac{\mathrm{d}v(t)}{\mathrm{d}t}$ 写成了 $\mathrm{d}u:\mathrm{d}v$。考虑二元向量函数的全微分表达式
$$
\mathrm{d}\mathbf{r}=\mathbf{r}_u \mathrm{d}u+\mathbf{r}_v \mathrm{d}v
$$

可以发现 $\mathrm{d}\mathbf{r}$ 在 $\mathbf{r}_u,\mathbf{r}_v$ 下的坐标为 $(\mathrm{d}u, \mathrm{d}v)$。那么，我们把 $\mathrm{d}\mathbf{r}$ 称为切向量也就是合理的。

### 法向量

把切平面的法向量称为空间曲面在该点的法向量。过该点，且平行于法向量的直线，被称为曲面在该点的法线。向量 $\mathbf{r}_u\times \mathbf{r}_v$ 被规定为正法向量。

## 曲面的基本形式

### 曲面的第一基本形式



