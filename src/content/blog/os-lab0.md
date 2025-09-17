---
title: 操作系统实验 0
description: Linux 内核调试
pubDate: 2025-09-16
updatedDate: 2025-09-16
tags: ["operatorSystem", "lab"]
category: "课程实验"
---

## 使用 Docker 容器
实验提供了 Makefile 封装相关 Docker 命令。

```makefile
CONTAINER_NAME := zju-os-code                  # 定义 Docker 容器名称
MAKEFLAGS := \                                # 定义 make 命令的参数
    ARCH=riscv \                              # 指定目标架构为 riscv
    CROSS_COMPILE=riscv64-linux-gnu-          # 指定交叉编译前缀

# File Locations
ROOTFS_PATH := ../rootfs.ext2                  # 根文件系统镜像路径
INITRD_PATH := ../initrd.gz                    # initrd 镜像路径
FAT32_PATH := ../fat32.img                     # FAT32 文件系统镜像路径
KERNEL_PATH := $(wildcard ../linux-*)          # 查找上级目录下以 linux- 开头的目录作为内核源码路径
#KERNEL_PATH := kernel                         # （注释掉）可手动指定内核源码路径为 kernel
IMAGE_PATH := $(KERNEL_PATH)/arch/riscv/boot/Image   # 内核镜像文件路径
VMLINUX_PATH := $(KERNEL_PATH)/vmlinux         # vmlinux 文件路径（未压缩内核）
OPENSBI_FW_JUMP_PATH := /usr/lib/riscv64-linux-gnu/opensbi/generic/fw_jump.elf      # OpenSBI 固件路径（fw_jump）
OPENSBI_FW_DYNAMIC_PATH := /usr/lib/riscv64-linux-gnu/opensbi/generic/fw_dynamic.elf # OpenSBI 固件路径（fw_dynamic）

# Alternative Targets
GDB_INIT_SCRIPT := gdbinit                     # GDB 初始化脚本
#GDB_INIT_SCRIPT := gdbinit.py                 # （注释掉）可选的 GDB 初始化脚本
GDB_TARGET := $(VMLINUX_PATH)                  # GDB 调试目标文件
#GDB_TARGET := $(FW_DYNAMIC_PATH)              # （注释掉）可选的 GDB 调试目标

SIMULATOR := qemu-system-riscv64               # 指定模拟器为 qemu-system-riscv64
ifeq ($(SIMULATOR),qemu-system-riscv64)        # 如果模拟器为 qemu-system-riscv64
    SIMULATOR_OPTS := \                        # QEMU 启动参数
        -nographic \                          # 不使用图形界面，全部输出到终端
        -machine virt \                       # 使用 virt 机器类型
        -kernel $(IMAGE_PATH) \               # 指定内核镜像
        -drive file=$(ROOTFS_PATH),format=raw,id=hd0,if=none \ # 挂载根文件系统
        -device virtio-blk-device,drive=hd0 \ # 使用 virtio 块设备
        -netdev user,id=net0 \                # 用户网络模式
        -device virtio-net-device,netdev=net0 \ # 使用 virtio 网络设备
        -append "root=/dev/vda ro console=ttyS0" # 内核启动参数，指定根设备和控制台
    SIMULATOR_DEBUG_OPTS := -s -S              # QEMU 调试参数，-s 开启 gdbserver，-S 启动后暂停
else ifeq ($(SIMULATOR),spike)                 # 如果模拟器为 spike
    SIMULATOR_OPTS := \                        # spike 启动参数
        --kernel=$(IMAGE_PATH) \               # 指定内核镜像
        --initrd=$(INITRD_PATH) \              # 指定 initrd 镜像
        --real-time-clint \                    # 启用实时 CLINT
        $(OPENSBI_FW_JUMP_PATH)                # 指定 OpenSBI 固件
    SIMULATOR_DEBUG_OPTS := --halted --rbb-port=9824 # spike 调试参数
else
    $(error Unsupported simulator: $(SIMULATOR)) # 不支持的模拟器报错
endif

.PHONY: build all clean qemu qemu-debug gdb    # 声明伪目标

ifeq ($(shell which docker),)                  # 如果 docker 不存在（即在容器内）
# inside docker
all:                                          # all 目标：编译内核
    make $(MAKEFLAGS) -C $(KERNEL_PATH) defconfig # 生成默认配置
    bear -- make $(MAKEFLAGS) -C $(KERNEL_PATH) -j$(shell nproc) # 用 bear 生成编译数据库并并行编译
clean:                                        # clean 目标：清理内核编译产物
    make -C $(KERNEL_PATH) clean
%:                                            # 通配符目标，转发所有命令到内核源码目录
    make $(MAKEFLAGS) -C $(KERNEL_PATH) $@
else                                          # 如果 docker 存在（即在宿主机）
# outside docker
all:                                          # all 目标：启动并进入 docker 容器
    docker compose create --no-recreate
    docker compose start
    docker compose exec -it $(CONTAINER_NAME) /usr/bin/fish
    docker compose stop
clean:                                        # clean 目标：销毁 docker 容器和卷
    docker compose down -v --remove-orphans
update: clean                                 # update 目标：先 clean 再拉取镜像
    docker compose pull
endif

run:                                          # run 目标：启动模拟器运行内核
    $(SIMULATOR) $(SIMULATOR_OPTS)

debug:                                        # debug 目标：启动模拟器并开启调试端口
    $(SIMULATOR) $(SIMULATOR_DEBUG_OPTS) $(SIMULATOR_OPTS)

gdb:                                          # gdb 目标：用 gdb-multiarch 连接调试
    gdb-multiarch -x $(GDB_INIT_SCRIPT) $(VMLINUX_PATH)

ocd:                                          # ocd 目标：启动 openocd 进行硬件调试
    openocd -f openocd.cfg
```

可以看到，Makefile 通过定义不同的目标，支持了如下的命令调用方式：
- `make`
    - 在容器内，编译内核
    - 在宿主机，自动进入 docker 容器 shell
- `make clean`
    - 在容器内：清理内核编译产物
    - 在宿主机：销毁 docker 容器和卷
- `make update`
    - 在宿主机：拉取最新 docker 镜像
- `make run` 启动 QEMU 或 spike，运行内核和 rootfs
- `make debug` 启动 `gdb-multiarch`，加载 vmlinux 和 gdbinit 脚本，连接到调试端口
- `make ocd` 启动 `openocd`，进行硬件调试
- `make <kernel_target>` 例如 make menuconfig、make bzImage 等，转发到内核源码目录

而 `compose.yml` 则定义了 docker 的行为：

```yml
# https://docs.docker.com/reference/compose-file/
services:
  zju-os-code:
    image: git.zju.edu.cn:5050/os/tool:latest # 拉取的镜像
    container_name: zju-os-code # 容器名称
    hostname: zju-os-code #容器内主机名称
    volumes:
      - ./:/zju-os/code # 当前目录挂载到容器的 /zju-os/code
      # SSH and Git Configuration pass-through
      - ~/.gitconfig:/root/.gitconfig:ro # 挂载 .gitconfig
      - ~/.ssh:/mnt/host_ssh:ro # 挂载 .ssh
    post_start:
      - command: ["cp", "-r", "/mnt/host_ssh/.", "/root/.ssh/"]
    working_dir: /zju-os/code
    init: true
    entrypoint: ["sleep", "infinity"]
```

## 使用交叉编译工具链

```bash
riscv64-linux-gnu-gcc hello.c -o hello # 编译生成 riscv64 架构下的可执行文件
riscv64-linux-gnu-gcc -S hello.c -o hello.s # 编译生成汇编代码
riscv64-linux-gnu-objdump -d hello > hello.disasm # 反汇编
```

## 编译内核

```bash
make defconfig # 用当前架构自带的默认配置文件，生成 .config 配置文件
make -j$(nproc) # -j 参数表明并行，$(nproc) 是 shell 命令，返回当前机器的 CPU 核心数。这么做会让 make 使用所有 CPU 并行编译。如果想要显示详细的编译命令，可以追加参数 V=1
make distclean # 清除所有编译生成的文件、配置文件、符号链接等
```

### Image 和 vmlinux 的区别

- **Image**
  Image 是经过压缩或处理后的内核镜像文件，通常用于实际启动（boot）系统。它包含了内核的机器码，格式适合被引导加载程序（如 U-Boot、QEMU 等）直接加载到内存中运行。对于不同架构和平台，Image 可能有不同的封装格式（如 zImage、bzImage、uImage 等）。

- **vmlinux**
  vmlinux 是未压缩的、带有符号信息的内核可执行文件，通常是 ELF 格式。它包含了完整的调试信息，主要用于内核开发和调试（如 gdb 调试内核时加载 vmlinux）。vmlinux 不能直接被引导程序加载启动。

**异同点总结：**
- 相同点：都包含了 Linux 内核的机器码。
- 不同点：
  - Image 适合实际启动系统，通常体积更小，不带调试信息。
  - vmlinux 适合调试和分析，体积较大，包含符号和调试信息，不能直接启动。
