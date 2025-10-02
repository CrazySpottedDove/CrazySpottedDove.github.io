---
title: 操作系统实验 1
description: 内核启动与时钟中断
pubDate: 2025-10-01
updatedDate: 2025-10-01
tags: ["operatorSystem", "lab"]
category: "课程实验"
---

## 启动工作

### RISC-V 汇编与调用约定

#### 1. 每个函数的开头都操作了 `sp`，这是在干什么？

`sp` 是栈指针（stack pointer），用于指向当前栈顶。每个函数开始时，都会调整 `sp`，为该函数的局部变量和保存现场（如返回地址、保存的寄存器）分配空间。这样做可以保证每个函数有独立的栈帧，防止数据混乱。

#### 2. 为什么 `sp` 的差值总是 16 的倍数？

RISC-V ABI（应用二进制接口）规定，`sp` 必须保持 16 字节对齐。这是为了提高内存访问效率，并满足某些指令或硬件对齐要求。每次分配栈空间时，都会以 16 的倍数调整，确保对齐。

#### 3. 调用函数前后做了什么？

- **调用前**：保存当前函数需要保护的寄存器（如返回地址 `ra`、部分临时寄存器等），并分配栈空间。
- **调用后**：恢复被保存的寄存器，释放栈空间，返回到调用者。
- 这样做的目的是保证函数调用的现场不会被破坏，数据能正确传递和返回。

#### 下列伪指令对应什么真实指令

```riscv
la nop li mv j ret call tail
```

- 伪指令是编译器/汇编器提供的简化写法，实际会被翻译成一条或多条真实指令。
- 真实指令是 RISC-V 指令集架构中定义的标准指令，直接被 CPU 执行。

| 伪指令 | 全称/含义           | 对应真实指令         | 真实指令全称/含义                   | 调用实例（示例代码）                       |
|--------|---------------------|----------------------|--------------------------------------|-------------------------------------------|
| la     | load address        | auipc + addi         | auipc: 加载当前 PC，addi: 加偏移     | `la a0, var` 加载变量 var 的地址到 a0     |
| nop    | no operation        | addi x0, x0, 0       | addi: 0 加到 0，结果存到 x0，无效果  | `nop` 占位，无实际操作                    |
| li     | load immediate      | addi/lui/addiw       | 加载立即数到寄存器                   | `li t0, 100` 把 100 赋值给 t0             |
| mv     | move                | addi rd, rs, 0       | 把 rs 的值加 0 赋给 rd，相当于赋值    | `mv t1, t0` 把 t0 的值赋给 t1             |
| j      | jump                | jal x0, label        | 无条件跳转到 label                   | `j loop` 跳转到 loop 标签                 |
| ret    | return              | jalr x0, 0(ra)       | 跳转到 ra 寄存器指向的地址           | `ret` 从函数返回                          |
| call   | function call       | auipc + jalr         | 跳转到函数地址并保存返回地址         | `call foo` 调用 foo 函数                  |
| tail   | tail call           | auipc + jalr         | 跳转到函数地址，不保存返回地址       | `tail bar` 尾调用 bar 函数                |

`call` 伪指令起到了普适的调用函数作用，它跳转到函数地址，且保存了返回地址。而 `tail` 专门用于优化尾递归的函数，因为此时，尾部的调用已经把控制权交给下一个函数，当前函数的返回地址已经不需要保存了，这可以节省栈空间。

### 链接器脚本与内核内存布局

#### 编译器的基本流程

```sh
# 预处理 Preprocessing: 展开 #include 头文件，处理 #define 宏替换，删除注释，处理条件编译 #ifdef/#if/#endif
riscv64-linux-gnu-cpp main.c -o main.i
# 编译 Compilation: 将 C 语言翻译成 riscv 汇编代码
riscv64-linux-gnu-gcc -S main.i -o main.S
# 汇编 Assembling: 将汇编指令翻译成机器码，生成符号表、重定位信息。(ELF 格式，二进制)
riscv64-linux-gnu-as main.S -o main.o
riscv64-linux-gnu-cpp func.c -o func.i
riscv64-linux-gnu-gcc -S func.i -o func.S
riscv64-linux-gnu-as func.S -o func.o
# 链接 Linking: 将多个目标文件合并，解析和连接符号，进行重定位
riscv64-linux-gnu-ld main.o func.o -o main
```

#### Linux 内核链接脚本

```lds
OUTPUT_ARCH("riscv")

ENTRY(_start)

PHY_START    = 0x80000000;
PHY_SIZE     = (128 * 1024 * 1024);
PHY_END      = (PHY_START + PHY_SIZE);
PGSIZE       = 0x1000;
OPENSBI_SIZE = (0x200000);

MEMORY {
    ram  (wxa!ri): ORIGIN = PHY_START + OPENSBI_SIZE, LENGTH = PHY_SIZE - OPENSBI_SIZE
}

BASE_ADDR = PHY_START + OPENSBI_SIZE;

SECTIONS
{
    . = BASE_ADDR;

    _skernel = .;

    .text : ALIGN(0x1000) {
        _stext = .;

        *(.text.init)
        *(.text.entry)
        *(.text .text.*)

        _etext = .;
    } AT>ram

    .rodata : ALIGN(0x1000) {
        _srodata = .;

        *(.rodata .rodata.*)

        _erodata = .;
    } AT>ram

    .data : ALIGN(0x1000) {
        _sdata = .;

        *(.data .data.*)
        *(.got .got.*)

        _edata = .;

        . = ALIGN(0x1000);
    } AT>ram

    .bss : ALIGN(0x1000) {
        *(.bss.stack)
        . = ALIGN(0x1000);
        _sbss = .;

        *(.sbss .sbss.*)
        *(.bss .bss.*)

        _ebss = .;
    } AT>ram

    . = ALIGN(0x1000);
    _ekernel = .;
}
```

##### 1. 这个链接脚本描述的就是整个内核的内存布局。它从哪里开始，有多大？

- **内核起始地址**：`BASE_ADDR = PHY_START + OPENSBI_SIZE`，即物理地址 `0x80000000 + 0x200000 = 0x80200000`。
- **内核大小**：`PHY_SIZE = 128MB`，去掉 OPENSBI 占用的 `2MB`，实际可用内存为 `126MB`。
- **内存区域**：`MEMORY { ram ... }` 定义了内核可用的物理内存范围。

##### 2. 各个段（.text、.rodata、.data、.bss）分别存放什么数据？

- `.text`(Text Segment)：存放代码（指令），包括内核的所有函数和入口代码。
- `.rodata`(Read-Only Data Segment)：存放只读数据，比如常量字符串、只读数组等。
- `.data`(Data Segment)：存放已初始化的全局变量和静态变量。
- `.bss`(Block Started by Symbol Segment)：存放未初始化的全局变量和静态变量（启动时会被清零）。

> **为什么未初始化的全局变量放在 .bss？**
>
> - 在 C 语言和许多系统编程语言中，未初始化的全局变量和静态变量在程序启动时会被自动清零。
> - 链接器在生成可执行文件时，不会为 .bss 段分配实际的存储空间（文件体积不会变大），只是在可执行文件的头部描述 .bss 的大小，运行时由操作系统分配并清零。
> - 这样可以节省磁盘空间，并且初始化效率高。    

##### 3. _skernel 这些符号是什么？你要如何在汇编和 C 代码中使用它们？

- `_skernel`、`_stext`、`_etext` 等是链接脚本定义的符号，表示各段的起始或结束地址。
- **在汇编中使用**：可以直接用这些符号作为地址，比如 `la t0, _skernel`。
- **在 C 代码中使用**：需要用 `extern` 声明为变量（通常是 `char*` 或 `uint8_t*`），如：

```c
extern char _skernel[];
extern char _etext[];
```

然后可以用它们获取内核各段的地址，实现内存管理、初始化等功能。