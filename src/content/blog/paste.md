---
title: 如何在 wsl2 终端中与 windows 剪贴板实现文件复制/黏贴交互
description: 在 wsl2 中，如何将 windows 上复制的文件在终端上黏贴到指定路径，以及如何用命令行复制一个文件到剪贴板？
pubDate: 2025-03-01
updatedDate: 2025-03-01
tags: ["copyboard","wsl2","剪贴板","terminal","cli"]
category: "瞎折腾"
---
因为一次手残点到了 win-11 的一次坑爹更新，我的资源管理器中，原本固定在快速访问的 wsl 路径全都失效了。每当需要在 windows 和 wsl 中移动文件时，要么在资源管理器中输入 wsl 路径，要么在终端中输入一长串，非常不爽，因此决定实现这个脚本。

## 在终端黏贴剪贴板上的文件

首先，通过 `powershell`，可以查看当前剪贴板上已有的文件路径：

```powershell
Get-Clipboard -Format FileDropList | ForEach-Object { $_.FullName }
# sample output
D:\Downloads\plum-windows-bootstrap-master
D:\Downloads\arch-chan !!!.jpg
D:\Downloads\Linux_shell_scripting_v2.pdf
\\wsl.localhost\Arch\home\dove\ADS\ADS结论小结.pdf
```

而 wsl2 提供了直接调用 powershell 的方法，因此一个自然的想法是，合理转换这里的路径，然后使用 `cp` 命令。

作为 shell 练习，这里就不使用 `wslpath` 这个方法了。

```bash
#!/bin/bash
# v.sh
target_path="${1:-.}"
[[ "$target_path" =~ /$ ]] || target_path="$target_path/"
raw_clipboard=$(powershell.exe -NoProfile -Command '$OutputEncoding = [Console]::OutputEncoding = New-Object System.Text.UTF8Encoding; Get-Clipboard -Format FileDropList | ForEach-Object { $_.FullName }')

while IFS= read -r line; do
    line=$(tr -d '\r' <<<"$line")
    wsl_path=$(sed 's/^\([a-zA-Z]\):/\/mnt\/\L\1/' <<<"$line")
    wsl_path=${wsl_path/\\\\wsl.localhost\\$WSL_DISTRO_NAME/}
    wsl_path=${wsl_path//\\/\/}
    [[ -z "$wsl_path" ]] && exit 0
    mkdir -p "$target_path"
    cp -r "$wsl_path" "$target_path"
done <<<"$raw_clipboard"
```

接下来细讲，不感兴趣的可以跳过了。

### 保证目标路径不为空

首先，`target_path="${1:-.}"` 让脚本允许接收路径参数。`:-` 表示如果没有参数输入或参数为空的情况下使用什么默认值，这里为 `.`。

然后，我们要确保这是一个路径而非一个文件：

```bash
[[ "$target_path" =~ /$ ]] || target_path="$target_path/"
```

这里使用了 `=~` 来进行正则表达式匹配，`/$` 表示检测是否以 `/` 作为末尾。如果没有，就执行后面的语句，也就是添加 `/` 末尾。

最后，在将要 `cp` 前，先用 `mkdir -p "$target_path"` 保证路径已经存在。

### 解决编码问题

powershell 的默认编码并不是 `UTF-8`，因此，我们需要指定它的输出编码为 `UTF-8`，以免无法处理中文字符。

另外，这里要注意使用 `'` 而非 `"` 来包裹，否则会错误地尝试解析 `$_`，导致出错。

```bash
raw_clipboard=$(powershell.exe -NoProfile -Command '$OutputEncoding = [Console]::OutputEncoding = New-Object System.Text.UTF8Encoding; Get-Clipboard -Format FileDropList | ForEach-Object { $_.FullName }')

```

### 遍历读取

powershell 处的输出是逐行的，自然的想法是我们也逐行读取。这就用到了结构

```bash
while IFS= read -r line; do
# some code
done <<< "$raw_clipboard"

```

* `IFS= read -r line` 在标准输入中读取一行，并将其赋值给变量 `line`。`-r` 选项的作用是防止反斜杠转义字符。也就是说，`read` 命令在读取输入时不会将反斜杠视为转义字符，而是将其作为普通字符处理。
* `done <<< "$raw_clipboard"` 则指出，以 `raw_clipboard` 的值作为标准输入。

另外，这里出现了 `<<<`，因此总结一下 shell 中箭头的常见作用。

* `>` 用于将命令的标准输出重定向到文件。如果不存在这个文件，就创建它。如：`echo "hello world" > hello.txt`
* `>>` 类似 `>`，只不过它是追加到文件末尾，不会覆盖文件
* `<<<` 将字符串内容传递给命令的标准输入，如 `grep "Hello" <<< "Hello World"`。当然，字符串变量中含换行是不被考虑的。
* `<<` 将多行字符串传递给命令的标准输入，如

```bash
cat <<EOF
Hello, World!
This is a Here Document.
EOF

```

### 路径转换和复制

首先，使用 `tr` 来删除 powershell 可能引入的回车符 `\r`，其中 `-d` 表示删除。

```bash
line=$(tr -d '\r' <<<"$line")
```

然后，我们解决 windows 路径中的盘符转换问题：

```bash
wsl_path=$(sed 's/^\([a-zA-Z]\):/\/mnt\/\L\1/' <<<"$line")

```

这里使用了 `sed` 命令来进行文本替换，语法如下：

* 基础结构：`sed s/search/replace/`，其中 `s` 表示替换。
* search 部分：`^\([a-zA-Z]\):` 用 `^` 表示在开头匹配，`\(\)` 定义一个捕获组，里面的 `[]` 定义一个字符类，`a-zA-Z` 表示匹配任何字母。
* replace 部分：`\/mnt\/\L\1` 中的 `\/` 用来表示转义 `/`，实际为 `/mnt/\L\1`。`\L` 表示转小写，`\1` 则表示第一个捕获组得到的结果。

如果需要的话，`sed` 命令后面的参数可以用 `;` 分隔，进行多次匹配替换
我们还要解决复制的是 wsl 中的文件的情况：

```bash
wsl_path=${wsl_path//"\\\\wsl.localhost\\$WSL_DISTRO_NAME"/}
```

这里用到了字符串替换语法 `${variable/search/replace}`(替换单个)。本例中，`search` 为 `"\\\\wsl.localhost\\$WSL_DISTRO_NAME`，`replace` 为空，实际上就是删除。

最后用同样的方法替换斜杠：

```bash
# 这里用了${variable//search/replace}来替换全部
wsl_path=${wsl_path//\\/\/}
```

然后用 `cp -r` 实现复制。`-r` 表示递归复制，允许把整个文件夹都复制过来。

## 在终端复制文件到剪贴板

同样地，powershell 也提供了把文件复制到剪贴板的功能，这里也使用类似的思路。

```bash
#!/bin/bash
# c.sh
declare -a win_paths=()

for wsl_path in "$@"; do
    wsl_path=$(realpath -e "$wsl_path")
    if [[ $wsl_path == /mnt/* ]]; then
        win_path=$(sed 's/\/mnt\/\([a-zA-Z]\)\//\1:\\/' <<<"$wsl_path")
    else
        win_path="\\\\wsl.localhost\\$WSL_DISTRO_NAME$wsl_path"
    fi
    win_path=${win_path//\//\\}
    win_paths+=("$win_path")
done

printf "%s\n" "${win_paths[@]}" |
    powershell.exe -NoProfile -Command '
            # 设置控制台编码为UTF-8
            [Console]::InputEncoding = [System.Text.Encoding]::UTF8
            [Console]::OutputEncoding = [System.Text.Encoding]::UTF8

            # 读取输入路径
            $paths = @()
            while ($line = [Console]::In.ReadLine()) {
                $paths += $line
            }

            # 设置剪贴板
            Add-Type -AssemblyName System.Windows.Forms
            $col = New-Object System.Collections.Specialized.StringCollection
            foreach ($path in $paths) {
                $col.Add($path)
            }
            [System.Windows.Forms.Clipboard]::SetFileDropList($col)
        ' >1/dev/null
```

这里就不再解释处理编码的问题了。我们也不关心 powershell 的语法。这里用到的语法基本与前面相同，就提几个讲讲：

### 用 `$@` 实现对输入参数的遍历

```bash
for wsl_path in "$@"; do
# some code
done
```

### 用 `realpath` 转化实际路径并解析链接

```bash
wsl_path=$(realpath -e "$wsl_path")
```

### 用通配符匹配

```bash
[[ $wsl_path == /mnt/* ]]
```

### 数组追加元素

```bash
win_paths+=("$win_path")

```

这里需要注意用 `()` 包裹变量。

### 数组展开语法

```bash
printf "%s\n" "${win_paths[@]}"
```

这里相当于把 `win_paths` 中的每一个元素作为一个参数传给 `printf` 命令。

### 重定向标准输出到 null

```bash
somecommand 1>/dev/null
```

