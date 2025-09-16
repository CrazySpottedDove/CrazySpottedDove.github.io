---
title: 记录 cargo 的一些使用方法
description: cargo 是 rust 的包管理工具，拥有较为现代化的包管理体验。
pubDate: 2025-02-10
updatedDate: 2025-02-10
tags: ["cargo","rust","package manager"]
category: "实用技术"
---
## 创建项目

```md
cargo new <name>
```

## 运行项目

```md
cargo run
# cargo run 相当于 cargo build + ./target/...
# cargo run 的默认模式为 debug，如果要求二进制文件优化，则使用
cargo run --release
# 当然也有
cargo build -- release
```

## 检查项目

```md
cargo check
# 用于检查代码是否能编译通过，速度较快
```

## Cargo.toml, Cargo.lock

* `Cargo.toml` 是 cargo 的项目数据描述文件，存储了项目的所有元配置信息
* `Cargo.lock` 是 cargo 工具根据 toml 文件生成的项目依赖清单(所有依赖的准确版本信息)，一般不需要修改。

cargo 项目分为 `bin` 和 `lib` 两种，前者是默认项，为可运行项目，后者则是依赖库项目。如果是依赖库项目，要将 `Cargo.lock` 加入 `.gitignore` 文件里。

### Cargo.toml Details

`package` 块中记录项目的描述信息

```toml
[package]
name = "zac"
version = "0.8.0"
edition = "2021"
# edition 定义了使用的 Rust 大版本
```

`dependencies` 块中记录项目的依赖项

```toml
[dependencies]
# 基于 crates.io，通过版本说明来描述
rand = "0.3"
# 基于项目源代码的 git 仓库地址，通过 url 描述
color = {git = "https://github.com/bjz/color-rs"}
# 基于本地项目的绝对路径或相对路径
geometry = {path = "crates/geometry"}
```

### Cargo 镜像配置

cargo 的配置文件为 `$HOME/.cargo/config.toml``` toml
[registries]
# 在此项下添加镜像地址
ustc = {index = "https://mirrors.ustc.edu.cn/crates.io-index/"}
# 这样做不会覆盖原来的设置，当你在项目中希望用这里的镜像来下载包时，需要做特殊指定，如
# Cargo.toml/[dependencites]
rand = {version = "0.3", registry = "ustc"}

# 覆盖镜像方法
[source.cates-io]
replace-with = 'ustc'

[source.ustc]
registry = "git://mirrors.ustc.edu.cn/crates.io-index"
# 这里创建了新的镜像源并将默认的 crates-io 替换成了 ustc

```
## 命令行修改依赖

```

md
# 添加 regex 依赖
cargo add regex
# 移除 regex 依赖
cargo remove regex

```
## 项目目录结构

```

txt
.
├── Cargo.lock
├── Cargo.toml
├── src/
│   ├── lib.rs
│   ├── main.rs
│   └── bin/
│       ├── named-executable.rs
│       ├── another-executable.rs
│       └── multi-file-executable/
│           ├── main.rs
│           └── some_module.rs
├── benches/
│   ├── large-input.rs
│   └── multi-file-bench/
│       ├── main.rs
│       └── bench_module.rs
├── examples/
│   ├── simple.rs
│   └── multi-file-example/
│       ├── main.rs
│       └── ex_module.rs
└── tests/
    ├── some-integration-tests.rs
    └── multi-file-test/
        ├── main.rs
        └── test_module.rs

```
* `src`: 源代码
* `lib.rs`: 存放 `lib` 包的根
* `main.rs`: 默认二进制包根
* `/src/bin/`: 其它二进制包根
* `benches`: 基准测试
* `examples`: 实例代码
* `tests`: 集成测试代码

## 测试

```

md
# 该命令会使 cargo 在 src/ 下的文件寻找单元测试，也会在 tests/ 目录下寻找集成测试
cargo test

```
## 缓存

`CARGO_HOME` 默认为 `$HOME/.cargo/`

* `config.toml` 是 Cargo 的全局配置文件
* `credentials.toml` 为 cargo login 提供私有化登录证书，用于登录 `package` 注册中心，如 `crates.io`
* `.crates.toml`, `.crates2.json` 包含通过 `cargo install` 安装的包的 `package` 信息，不要修改
* `bin/` 包含通过 `cargo install` 或 `rustup` 下载的包编译出的可执行文件
* `git/` 中存储了 `Git` 的资源文件
* `registry/` 包含了注册中心的元数据和 `packages`

## 交叉编译

为了实现跨平台，需要进行交叉编译。

rustup 是 rust 官方开发的工具链管理器。为了方便地添加 windows 平台的工具，我们下载 rustup

```

bash
sudo pacman -S rustup
rustup update stable

```
然后，我们再在 linux 里下载交叉编译所需要的 mingw 工具：

```

bash
sudo pacman -S mingw-w64-gcc
# 可以用 x86_64-w64-mingw32-gcc --version 检查是否成功

```
这样就有了足够的工具条件了。接下来，在项目根目录中创建 .cargo 目录，并在里面建立 config.toml:

```

toml
# config.toml
[target.x86_64-pc-windows-gnu]
linker = "x86_64-w64-mingw32-gcc"

```
这样就指明了这个 target 时使用的链接器。在编译时，使用

```

bash
cargo build --target x86_64-pc-windows-gnu --release

```

```

