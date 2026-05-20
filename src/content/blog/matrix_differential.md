---
title: 矩阵微积分
description: 自学矩阵微积分的笔记
pubDate: 2026-04-19
updatedDate: 2026-04-19
tags: ["matrix differential"]
category: "自学笔记"
---

记号约定：标量用普通斜体（如 $x$），向量用粗体（如 $\mathbf{x}$），矩阵用大写字母（如 $A, J, H, X$）。

---

## 1. 微分运算律

1. 乘积微分
$$
\mathrm{d}(UV)=\mathrm{d}U\,V+U\,\mathrm{d}V
$$
2. 转置微分
$$
\mathrm{d}(U^\top)=(\mathrm{d}U)^\top
$$
3. 标量转置不变（非常常用）
$$
s=s^\top
$$
4. 迹的循环不变（维度匹配时）
$$
\mathrm{tr}(UVW)=\mathrm{tr}(WUV)=\mathrm{tr}(VWU)
$$
5. 用微分读梯度（列向量约定）
$$
\mathrm{d}f=(\nabla_{\mathbf{x}} f)^\top \mathrm{d}\mathbf{x}
$$

---

## 2. 二次型我到底是怎么推出来的

目标：
$$
f(\mathbf{x})=\mathbf{x}^\top A\mathbf{x}
$$

第一步，直接对乘积微分：
$$
\mathrm{d}f=\mathrm{d}(\mathbf{x}^\top A\mathbf{x})
=\mathrm{d}\mathbf{x}^\top A\mathbf{x}+\mathbf{x}^\top A\,\mathrm{d}\mathbf{x}
$$

用“标量转置不变”处理它：
$$
\mathrm{d}\mathbf{x}^\top A\mathbf{x}
=\left(\mathrm{d}\mathbf{x}^\top A\mathbf{x}\right)^\top
=\mathbf{x}^\top A^\top \mathrm{d}\mathbf{x}
$$

代回去：
$$
\mathrm{d}f=\mathbf{x}^\top A^\top \mathrm{d}\mathbf{x}+\mathbf{x}^\top A\mathrm{d}\mathbf{x}
=\mathbf{x}^\top (A^\top+A)\mathrm{d}\mathbf{x}
$$

再改成“梯度点乘”格式：
$$
\mathrm{d}f=\left((A+A^\top)\mathbf{x}\right)^\top \mathrm{d}\mathbf{x}
$$

所以：
$$
\nabla_{\mathbf{x}} f=(A+A^\top)\mathbf{x}
$$

若 $A$ 对称（$A=A^\top$）：
$$
\nabla_{\mathbf{x}} f=2A\mathbf{x}
$$

---

## 3. 最小二乘

$$
f(\mathbf{x})=\frac12\|A\mathbf{x}-\mathbf{b}\|_2^2
=\frac12(A\mathbf{x}-\mathbf{b})^\top(A\mathbf{x}-\mathbf{b})
$$

设残差 $\mathbf{r}=A\mathbf{x}-\mathbf{b}$，则
$$
f=\frac12\mathbf{r}^\top\mathbf{r}
$$

先对 $\mathbf{r}$ 微分：
$$
\mathrm{d}\mathbf{r}=A\,\mathrm{d}\mathbf{x}
$$

再微分 $f$：
$$
\mathrm{d}f=\frac12\left(\mathrm{d}\mathbf{r}^\top\mathbf{r}+\mathbf{r}^\top\mathrm{d}\mathbf{r}\right)
=\mathbf{r}^\top\mathrm{d}\mathbf{r}
=\mathbf{r}^\top A\,\mathrm{d}\mathbf{x}
$$

整理成读梯度格式：
$$
\mathrm{d}f=(A^\top\mathbf{r})^\top\mathrm{d}\mathbf{x}
$$

所以：
$$
\nabla_{\mathbf{x}} f=A^\top(A\mathbf{x}-\mathbf{b})
$$

---

## 4. 我常用的两个矩阵微分公式（附来路）

### 4.1 逆矩阵微分

从恒等式 $XX^{-1}=I$ 出发：
$$
\mathrm{d}(XX^{-1})=0
$$
$$
\mathrm{d}X\,X^{-1}+X\,\mathrm{d}(X^{-1})=0
$$
左乘 $X^{-1}$：
$$
\mathrm{d}(X^{-1})=-X^{-1}(\mathrm{d}X)X^{-1}
$$

### 4.2 $\log\det X$ 的微分

$$
\mathrm{d}\log\det X=\mathrm{tr}(X^{-1}\mathrm{d}X)
$$

于是可读出：
$$
\frac{\partial}{\partial X}\log\det X=(X^{-1})^\top
$$
