---
title: 数值分析实验1
description: 数值分析实验1
pubDate: 2025-02-26
updatedDate: 2025-02-26
tags: ["numerical analysis", "lab"]
category: "课程实验"
---

尝试找出求解 $ax^2+bx+c$ 的好方法。假设你的计算机只有四位有效数字。
> 题目特别给出了一个例子：$x^2+61x+1=0$

因为对 rust 相对更熟悉一点，所以就用 rust 完成了。

## 实现对四位有效数字计算的模拟

这一点对于 rust 来说很简单，只要定义一个结构体`F4`，然后为它实现加减乘除等特性就好了。

下面的代码定义了结构体`F4`，并实现了它的加减乘除、比较和取绝对值，开平方运算。

```rust
use std::{
    fmt::Display,
    ops::{Add, Deref, Div, Mul, Neg, Sub},
};
// 方便书写的宏
macro_rules! f4 {
    ($x:expr) => {
        F4::new($x)
    };
}

#[derive(Debug, Clone, Copy, PartialEq, PartialOrd)]
struct F4(f64);
impl F4 {
    /// 取四位有效数字
    fn round(x: f64) -> f64 {
        if x == 0.0 {
            return 0.0;
        }
        // 符号
        let sign = if x < 0.0 { -1.0 } else { 1.0 };
        // 绝对值
        let absx = x.abs();
        // 指数
        let exp = absx.log10().floor();

        let factor = 10f64.powf(exp - 3.0);
        sign * (absx / factor).round() * factor
    }

    fn new(x: f64) -> F4 {
        F4(F4::round(x))
    }

    /// 使用牛顿法实现对F4的开方。如果输入为负数，直接返回None
    fn sqrt(self) -> Option<F4> {
        const MAX_ITERATIONS: usize = 50;
        if self < 0.0 {
            return None;
        }
        let mut now = self.to_owned();
        let mut next;
        let square = self * self;
        let mut i = 0;
        while now != square && i < MAX_ITERATIONS {
            next = (now * now + self) / (f4!(2.0) * now);
            if now == next {
                break;
            }
            now = next;
            i += 1;
        }
        Some(now)
    }

    fn abs(self) -> F4 {
        if self < 0.0 {
            -self
        } else {
            self
        }
    }
}

// 实现F4的四则运算，模拟了每次运算后保留到4位有效数字的效果
impl Add for F4 {
    type Output = F4;
    fn add(self, rhs: F4) -> Self::Output {
        f4!(*self + *rhs)
    }
}

impl Sub for F4 {
    type Output = F4;
    fn sub(self, rhs: Self) -> Self::Output {
        f4!(*self - *rhs)
    }
}

impl Mul for F4 {
    type Output = F4;
    fn mul(self, rhs: Self) -> Self::Output {
        f4!(*self * *rhs)
    }
}

impl Div for F4 {
    type Output = F4;
    fn div(self, rhs: Self) -> Self::Output {
        f4!(*self / *rhs)
    }
}

// 为了凸显四位有效数字，用科学计数法打印F4
impl Display for F4 {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{:.3e}", self.0)
    }
}

impl Neg for F4 {
    type Output = F4;
    fn neg(self) -> Self::Output {
        f4!(-1.0) * self
    }
}
```

处于严谨性，这里特地自己实现了`sqrt`方法，因为 Research Topic 的假设是只有四位有效数字的机器，所以`sqrt`方法的计算中应当也不例外。

```rust
/// 使用牛顿法实现对F4的开方。如果输入为负数，直接返回None
    fn sqrt(self) -> Option<F4> {
        const MAX_ITERATIONS: usize = 50;
        if self < 0.0 {
            return None;
        }
        let mut now = self.to_owned();
        let mut next;
        let square = self * self;
        let mut i = 0;
        while now != square && i < MAX_ITERATIONS {
            next = (now * now + self) / (f4!(2.0) * now);
            if now == next {
                break;
            }
            now = next;
            i += 1;
        }
        Some(now)
    }
```

在具体实现中，使用了牛顿法。我们从传入参数本身出发，构造切线取和 $x$ 轴的交点，然后以此交点为新的起点，继续构造切线，如此不断逼近零点。

>这里有一个坑：理论上，对于一个二次函数，牛顿法的解会从单侧不断向零点逼近。然而，计算机的计算数值并非完全精确，尤其是对于我们只有 4 位有效数字的情况。此时，牛顿法的解可能来到零点的另一侧，从而导致函数中的`now == next`条件始终不成立。因此，不得不又定义了一个`MAX_ITERATIONS`作为循环上限。

剩下的一些代码则比较次要，主要是为了可以像使用其它标准数据结构一样使用`F4`:

```rust
impl Deref for F4 {
    type Target = f64;
    fn deref(&self) -> &Self::Target {
        &self.0
    }
}
impl From<f64> for F4 {
    fn from(x: f64) -> Self {
        f4!(x)
    }
}

impl From<F4> for f64 {
    fn from(x: F4) -> Self {
        x.0
    }
}

// 在和浮点数比较时，先把浮点数转化成F4
impl PartialEq<f64> for F4 {
    fn eq(&self, other: &f64) -> bool {
        self.0 == f4!(*other).0
    }
}

impl PartialOrd<f64> for F4 {
    fn ge(&self, other: &f64) -> bool {
        self.0 >= f4!(*other).0
    }
    fn gt(&self, other: &f64) -> bool {
        self.0 > f4!(*other).0
    }
    fn le(&self, other: &f64) -> bool {
        self.0 <= f4!(*other).0
    }
    fn lt(&self, other: &f64) -> bool {
        self.0 < f4!(*other).0
    }
    fn partial_cmp(&self, other: &f64) -> Option<std::cmp::Ordering> {
        self.0.partial_cmp(&f4!(*other).0)
    }
}
```

## 算法1：直接用公式计算，不做任何额外处理

这可能是最自然的想法，我们都知道求根公式 $\frac{-b\pm \sqrt{b^2-4ac}}{2a}$，那直接代入就完事了。当然，要先检测一下有没有解：

```rust
/// 较为不妥的一种方法，也是最直接的方法
/// 直接待入一元二次方程组的通解
fn solution1(a: F4, b: F4, c: F4) -> Option<(F4, F4)> {
    let squared_delta = (b * b - f4!(4.0) * a * c).sqrt()?;
    return Some((
        (-b + squared_delta) / (f4!(2.0) * a),
        (-b - squared_delta) / (f4!(2.0) * a),
    ));
}
```

## 算法2：用公式计算一个解，另一个解通过 $x_1x_2=\frac{c}{a}$ 导出

聪明的你可能已经发现了算法 1 的问题所在：当我们执行 $-b\pm\sqrt{\Delta}$ 这一步时，完全有可能发生类似于 $1.222 - 1.221 = 0.001$ 这样的事情，有效位数锐减 3 位，误差大大增加。

幸运的是，当出现这种情况时，$\pm$ 中另一个符号的运算并不会导致这样严重的有效位数丢失。此时，我们可以选择使用 $\frac{c}{a}$ 这个同样不会导致有效位数丢失的计算，来帮忙导出另一个解，这也就是算法二的思路：

```rust
/// 一种更稳定的方法
/// 先求出delta，再求出根号delta，最后根据b的符号选择稳定的计算顺序
fn solution2(a: F4, b: F4, c: F4) -> Option<(F4, F4)> {
    let delta = b * b - f4!(4.0) * a * c;
    let sqrt_delta = delta.sqrt()?;
    let denominator = f4!(2.0) * a;

    // 根据b的符号选择稳定的计算顺序，避免有效位数丢失
    let x1 = if *b >= 0.0 {
        (-b - sqrt_delta) / denominator
    } else {
        (-b + sqrt_delta) / denominator
    };
    // 利用 x1 x2 = c/a
    let x2 = c / (a * x1);
    Some((x1, x2))
}
```

## 算法3：二分法

一元二次方程的结构比较简单，我们当然可以用二分法的思路来寻找它的解。假设有一个零点为 $x_0$，可以取零点左右的点 $x_1$，$x_2$，在数学上，根据闭区间套定理，我们可以通过不断二分夹逼的办法来逼近零点 $x_0$。

> 这里函数写得比较冗长，主要是不希望用计算一遍 $f(x_{left})*f(x)$ 的方式来判断左侧逼近还是右侧逼近，这显然太费时间了。
>
> 你可能注意到这里仅仅使用了`x_left == x || x_right == x`来结束循环，这是因为夹逼的过程中，两侧边界都是单调的，加上精度限制，最终必然会出现上述情况。

```rust
fn solution3(a: F4, b: F4, c: F4) -> Option<(F4, F4)> {
    let delta = b * b - f4!(4.0) * a * c;
    if delta < 0.0 {
        return None;
    }
    let f = |x| a * x * x + b * x + c;
    // 选择了顶点横坐标作为一个边界
    let mut x1_right = -b / (f4!(2.0) * a);
    let mut x2_left = x1_right.clone();
    let mut offset = f4!(1.0);
    if a < 0.0 {
        while f(x2_left + offset) > 0.0 {
            offset = offset * f4!(2.0);
        }
        let mut x2_right = x2_left + offset;
        let mut x1_left = x1_right - offset;
        loop {
            let x = (x2_left + x2_right) / f4!(2.0);
            let y = f(x);
            if x2_left == x || x2_right == x {
                break;
            }
            if y > 0.0 {
                x2_left = x;
            } else {
                x2_right = x;
            }
        }
        loop {
            let x = (x1_left + x1_right) / f4!(2.0);
            let y = f(x);
            if x1_left == x || x1_right == x {
                break;
            }
            if y > 0.0 {
                x1_right = x;
            } else {
                x1_left = x;
            }
        }
        let x1 = if f(x1_left).abs() > f(x1_right).abs() {
            x1_right
        } else {
            x1_left
        };
        let x2 = if f(x2_left).abs() > f(x2_right).abs() {
            x2_right
        } else {
            x2_left
        };
        return Some((x1, x2));
    } else {
        while f(x2_left + offset) < 0.0 {
            offset = offset * f4!(2.0);
        }
        let mut x2_right = x2_left + offset;
        let mut x1_left = x1_right - offset;
        loop {
            let x = (x2_left + x2_right) / f4!(2.0);
            let y = f(x);
            if x2_left == x || x2_right == x {
                break;
            }
            if y < 0.0 {
                x2_left = x;
            } else {
                x2_right = x;
            }
        }
        loop {
            let x = (x1_left + x1_right) / f4!(2.0);
            let y = f(x);
            if x1_left == x || x1_right == x {
                break;
            }
            if y < 0.0 {
                x1_right = x;
            } else {
                x1_left = x;
            }
        }
        let x1 = if f(x1_left).abs() > f(x1_right).abs() {
            x1_right
        } else {
            x1_left
        };
        let x2 = if f(x2_left).abs() > f(x2_right).abs() {
            x2_right
        } else {
            x2_left
        };
        return Some((x1, x2));
    }
}
```

## 测试函数

```rust
#[derive(PartialEq, PartialOrd)]
struct Solu(f64);

impl Display for Solu {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{:.6e}", self.0)
    }
}

/// 使用 f64 求解，作为标准答案
fn solution(a: F4, b: F4, c: F4) -> Option<(Solu, Solu)> {
    let delta = *b * *b - 4.0 * *a * *c;
    let sqrt_delta = delta.sqrt();
    if sqrt_delta.is_nan() {
        return None;
    }
    let denominator = 2.0 * *a;

    // 根据b的符号选择稳定的计算顺序
    let x1 = if *b >= 0.0 {
        (-*b - sqrt_delta) / denominator
    } else {
        (-*b + sqrt_delta) / denominator
    };
    let x2 = *c / (*a * x1);
    Some((Solu(x1), Solu(x2)))
}

/// 测试函数
/// 按顺序打印解和用时
fn test<T>(a: F4, b: F4, c: F4, func: fn(F4, F4, F4) -> Option<(T, T)>)
where
    T: Display + PartialOrd,
{
    let start = Instant::now();
    let sol = func(a, b, c);
    let duration = start.elapsed();
    match sol {
        Some((x1, x2)) => {
            if x1 > x2 {
                println!("x1 = {x2}, x2 = {x1}");
            } else {
                println!("x1 = {x1}, x2 = {x2}");
            }
        }
        None => println!("无实数解"),
    }
    println!("用时: {:?}", duration);
}
```

## 测试样例和结果分析

```rust
fn main() {
    let test_cases = vec![
        (f4!(1.0), f4!(1.0), f4!(1.0)),
        (f4!(1.0), f4!(2.0), f4!(1.0)),
        (f4!(1.0), f4!(10000.0), f4!(1.0)),
        (f4!(1.0), f4!(62.1), f4!(1.0)),
        (f4!(101.0), f4!(78.1), f4!(0.78)),
        (f4!(-1.0), f4!(3.0), f4!(-2.0)),
        (f4!(1e-6), f4!(2e-6), f4!(1e-6)),
        (f4!(1.0), f4!(1e8), f4!(1.0)),
        (f4!(1e-8), f4!(2.0), f4!(1.0)),
        (f4!(1.0), f4!(4.0), f4!(4.0)),
    ];

    for (a, b, c) in test_cases {
        println!("{a}x^2 + {b}x + {c} = 0");
        println!("解法1:");
        test(a, b, c, solution1);
        println!("解法2:");
        test(a, b, c, solution2);
        println!("解法3:");
        test(a, b, c, solution3);
        println!("解法4:");
        test(a, b, c, solution4);
        println!("f64解:");
        test(a, b, c, solution);
        println!();
    }
}
```

输出如下：

### $x^2+x+1=0$：检测无解情况，均通过

```cpp
1.000e0x^2 + 1.000e0x + 1.000e0 = 0
解法1:
无实数解
用时: 15.47µs
解法2:
无实数解
用时: 361ns
解法3:
无实数解
用时: 281ns
f64解:
无实数解
用时: 80ns
```

对于无解情况，解法 1 的实际开销应当和解法 2 相近。这里的速度相比其它方法较慢应该是程序刚刚启动，缓存命中率不高的原因。

### $x^2+2x+1$：单解情况

可以发现，这里二分法出现异常了。至于其原因，我们在最后分析。

```cpp
1.000e0x^2 + 2.000e0x + 1.000e0 = 0
解法1:
x1 = -1.000e0, x2 = -1.000e0
用时: 511ns
解法2:
x1 = -1.000e0, x2 = -1.000e0
用时: 381ns
解法3:
x1 = -1.001e0, x2 = -1.000e0
用时: 6.652µs
f64解:
x1 = -1.000000e0, x2 = -1.000000e0
用时: 30ns
```

### $x^2+62.1x+1=0$：讨论样例

此时，可以发现，由于 $a,c$ 相对 $b$ 较小，$-b+\sqrt{b^2-4ac}$ 将会有明显的有效位数损失，这也是导致解法一出现显著误差的原因。

同时，你还发现，二分法似乎又算得更精确一些。

```cpp
1.000e0x^2 + 6.210e1x + 1.000e0 = 0
解法1:
x1 = -6.210e1, x2 = -2.500e-2
用时: 5.39µs
解法2:
x1 = -6.210e1, x2 = -1.610e-2
用时: 4.579µs
解法3:
x1 = -6.210e1, x2 = -1.611e-2
用时: 9.087µs
f64解:
x1 = -6.208389e1, x2 = -1.610724e-2
用时: 20ns
```

### $101x^2+78.1x+0.78=0$

在这里，对于 $x_1$，似乎二分法的准确性更高。

解法 1、2 的准确性不是很令人满意。

```cpp
1.010e2x^2 + 7.810e1x + 7.800e-1 = 0
解法1:
x1 = -7.634e-1, x2 = -1.005e-2
用时: 1.853µs
解法2:
x1 = -7.634e-1, x2 = -1.012e-2
用时: 1.503µs
解法3:
x1 = -7.630e-1, x2 = -1.012e-2
用时: 7.384µs
f64解:
x1 = -7.631477e-1, x2 = -1.011963e-2
用时: 20ns
```

### $x^2+10000x+1=0$

在这里，二分法的准确性又出现了问题。

```cpp
1.000e0x^2 + 1.000e4x + 1.000e0 = 0
解法1:
x1 = -1.000e4, x2 = 0.000e0
用时: 4.238µs
解法2:
x1 = -1.000e4, x2 = -1.000e-4
用时: 2.444µs
解法3:
x1 = -9.995e3, x2 = -9.995e-5
用时: 21.58µs
f64解:
x1 = -1.000000e4, x2 = -1.000000e-4
用时: 31ns
```

### $-x^2+3x-2=0$

```cpp
-1.000e0x^2 + 3.000e0x + -2.000e0 = 0
解法1:
x1 = 1.000e0, x2 = 2.000e0
用时: 732ns
解法2:
x1 = 1.000e0, x2 = 2.000e0
用时: 410ns
解法3:
x1 = 1.000e0, x2 = 2.000e0
用时: 6.312µs
f64解:
x1 = 1.000000e0, x2 = 2.000000e0
用时: 30ns
```

还有更多的测试样例，不一一分析了。

综合上面的情况，我们发现一个问题：三种解法的准确性都不是完全稳定的！接下来，我们来分析其中的原因。

* 二分法：主要的问题是最后的区间夹逼可能发生有效位数的损失。我们的有效位数被固定到 4 位，这导致一个尴尬的问题：最后一次夹逼，其实很有可能是不精确的！

    我们举这样的一个例子：夹逼区间为 $[-10010,-9995]$，再次尝试二分时，过程为：

    $ -10010 - 9995 = -20015 \Rightarrow -20020,\quad -20020/2=-10010$

    明明两个边界之间差了 15，但是由于每次计算的舍入，二分愣是停止了！事实上，这就是二分法求解 $x^2+10000x+1=0$ 时发生的事情。

    有的同学可能会考虑把先加后除替换成先除后加。然而，当“后加”的过程引入一次进位时，同样会发生一次舍入，这也会导致夹逼的不准确性。

    至于有时发现二分法结果更为精确，这是因为在函数的最后，多了一个`let x1 = if f(x1_left).abs() > f(x1_right).abs() x1_right else x1_left;`的过程，它通过取更靠近零点的那个边界，减小了这个误差，有时效果较好。

* 解法2：问题在于`sqrt()`方法的实现。由于有效位数有限，牛顿法有可能在最后陷入在零点左右不断振荡的死循环中。此时，函数通过我们定死的循环上限结束。事实上，我们是在这个振荡循环中抽了一次奖，自然无法保证抽到的总是准确的结果。

最后，就性能而言，这里实现的二分法性能明显低于其它方法，这是因为二分法的过程中涉及了大量关于把 x 代入原函数的操作，这一操作引入了较大的计算开销。而不动点法在许多情况下拥有比较好的性能，这是因为在有效位数限制下，它常常可以满足`g(x1)=x1`这个跳出条件，从而实现较快结束计算。

## 补充算法：不动点法

相信大家在高中的时候都接触过数列的不动点问题，其实它也可以用来求解一元二次方程。

```rust
fn solution4(a: F4, b: F4, c: F4) -> Option<(F4, F4)> {
    if b == 0.0 {
        let t = -c / a;
        let sqrt_t = t.sqrt()?;
        return Some((sqrt_t, -sqrt_t));
    }
    let delta = b * b - f4!(4.0) * a * c;
    if delta < 0.0 {
        return None;
    }
    let center = -b / (f4!(2.0) * a);
    let g = |x| (a * x * x + c) / (-b);
    let mut x1 = center;
    // 不动点迭代
    for _ in 0..MAX_ITERATIONS {
        let x2 = g(x1);
        if x1 == x2 {
            break;
        }
        x1 = x2;
    }
    let x2 = c / (a * x1);
    Some((x1, x2))
}
```

如上的算法看起来很美好，但实际上存在两个问题：

1. `g(x)`函数的多数值解问题。$b\ne0$ 时，$x=-\frac{ax^2+c}{b}$ 的数值解完全有可能不止两个！以解方程 $-x^2+3x-2=0$ 为例，不动点法的跳出结果为`x1=1.001`。我们不妨手动计算这个结果：

    左式为 $1.001$，右式为 $\frac{2.002+2.000}{3.000}=1.001$，两者相等。那么，在迭代的过程中，程序就不会在我们希望的 $1.000$ 时跳出，而是在迭代到 $1.001$ 时就跳出了。
2. 迭代函数不一定收敛！比如，会遇见如下问题：

    ```cpp
    -1.000e0x^2 + 4.000e-3x + 3.000e0 = 0
    解法4：
    x1 = NaN, x2 = NaN
    用时: 386.06µs
    ```

    这是因为在发散的迭代过程中，$x$ 的值不断增大，直至超出了上限。

为此，我们需要改良这个解法:

>迭代函数收敛的一个充分条件是它的不动点解邻域内的导数绝对值应当小于 1。

因此，我们尝试动态地构造迭代式：$x = x + \frac{ax^2+bx+c}{\lambda}$。根据上面的充分条件，我们可以推导得出，在 $\lambda>0$ 时，应有 $\lambda > \frac{\sqrt{\Delta}}{2}$。

这个式子事实上可以以另外一种角度理解：$\lambda$ 作为一个系数，确定了我们可以忍受的误差范围。$\lambda$ 越小，$\frac{ax^2+bx+c}{\lambda}$ 的变化就越灵敏，迭代结果就更准确。然而，当它过小时，会发生发散迭代的现象出现，导致求解失败。考虑到限于四位有效数字的计算本身就带有不稳定性，我们取 $\lambda=\sqrt{\Delta}$：

```rust
fn solution5(a: F4, b: F4, c: F4) -> Option<(F4, F4)> {
    let delta_sqrt = (b * b - f4!(4.0) * a * c).sqrt()?;

    let center = -b / (f4!(2.0) * a);
    if delta_sqrt == 0.0 {
        return Some((center, center));
    }
    let g = |x| x + (a * x * x + b * x + c) / (delta_sqrt);
    let mut x1 = center;
    for _ in 0..MAX_ITERATIONS {
        let x2 = g(x1);
        if x1 == x2 {
            break;
        }
        x1 = x2;
    }
    let x2 = c / (a * x1);
    Some((x1, x2))
}
```

我们可以看一下它的效果：

```cpp
1.000e0x^2 + 2.000e0x + 1.000e0 = 0
解法4:
x1 = -1.000e0, x2 = -1.000e0
用时: 551ns
解法5:
x1 = -1.000e0, x2 = -1.000e0
用时: 301ns
f64解:
x1 = -1.000000e0, x2 = -1.000000e0
用时: 30ns

1.000e0x^2 + 1.000e4x + 1.000e0 = 0
解法4:
x1 = -1.000e4, x2 = -1.000e-4
用时: 2.284µs
解法5:
x1 = -1.000e4, x2 = -1.000e-4
用时: 5.24µs
f64解:
x1 = -1.000000e4, x2 = -1.000000e-4
用时: 20ns

1.000e0x^2 + 6.210e1x + 1.000e0 = 0
解法4:
x1 = -6.211e1, x2 = -1.610e-2
用时: 1.783µs
解法5:
x1 = -6.209e1, x2 = -1.611e-2
用时: 10.219µs
f64解:
x1 = -6.208389e1, x2 = -1.610724e-2
用时: 20ns

1.010e2x^2 + 7.810e1x + 7.800e-1 = 0
解法4:
x1 = -7.632e-1, x2 = -1.012e-2
用时: 1.393µs
解法5:
x1 = -7.632e-1, x2 = -1.012e-2
用时: 3.296µs
f64解:
x1 = -7.631477e-1, x2 = -1.011963e-2
用时: 20ns

-1.000e0x^2 + 3.000e0x + -2.000e0 = 0
解法4:
x1 = 1.001e0, x2 = 1.998e0
用时: 2.986µs
解法5:
x1 = 1.000e0, x2 = 2.000e0
用时: 1.824µs
f64解:
x1 = 1.000000e0, x2 = 2.000000e0
用时: 20ns

1.000e-6x^2 + 2.000e-6x + 1.000e-6 = 0
解法4:
x1 = -1.000e0, x2 = -1.000e0
用时: 461ns
解法5:
x1 = -1.000e0, x2 = -1.000e0
用时: 330ns
f64解:
x1 = -1.000000e0, x2 = -1.000000e0
用时: 20ns

1.000e0x^2 + 1.000e8x + 1.000e0 = 0
解法4:
x1 = -1.000e8, x2 = -1.000e-8
用时: 1.583µs
解法5:
x1 = -1.000e8, x2 = -1.000e-8
用时: 5.049µs
f64解:
x1 = -1.000000e8, x2 = -1.000000e-8
用时: 20ns

1.000e-8x^2 + 2.000e0x + 1.000e0 = 0
解法4:
x1 = -2.000e8, x2 = -5.000e-1
用时: 1.493µs
解法5:
x1 = -2.000e8, x2 = -5.000e-1
用时: 2.424µs
f64解:
x1 = -2.000000e8, x2 = -5.000000e-1
用时: 10ns

1.000e0x^2 + 4.000e0x + 4.000e0 = 0
解法4:
x1 = -2.000e0, x2 = -2.000e0
用时: 511ns
解法5:
x1 = -2.000e0, x2 = -2.000e0
用时: 210ns
f64解:
x1 = -2.000000e0, x2 = -2.000000e0
用时: 20ns

-1.000e0x^2 + 4.000e-3x + 3.000e0 = 0
解法4:
x1 = NaN, x2 = NaN
用时: 5.08µs
解法5:
x1 = -1.730e0, x2 = 1.734e0
用时: 2.355µs
f64解:
x1 = -1.730052e0, x2 = 1.734052e0
用时: 20ns
```

可以看到，虽然耗时相比算法 4 有所增加，但是它的准确度相对更好，且不会像算法 4 一样出现 NaN 的情况。
