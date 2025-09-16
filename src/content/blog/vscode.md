---
title: 如何提升 wsl2 中 vscode 的启动速度
description: 在 wsl2 中，vscode 的冷启动速度较慢。我们可以通过后台启动一个 vscode 实例的方式，实现 always 热启动，以提高启动速度，优化体验
pubDate: 2025-02-07
updatedDate: 2025-02-07
tags: ["vscode","autohotkey"]
category: "瞎折腾"
---

## wsl2 里 vscode 启动咋这么慢？

将日常编程工作迁移到 wsl2 中后发现，启动 vscode 的耗时明显要高于直接在 windows 主机启动耗时。照理来说，vscode 也算比较轻量级的编辑器了，慢启动速度是我无法容忍的。

另外，我还注意到一点，那就是在 vscode 集成终端中再使用 code 命令启动一个 vscode 实例时，明显速度要比直接启动快很多。

在 wsl 终端中运行 `code --verbose`，有如下输出：

```bash
[main 2025-02-07T10:32:45.623Z] PolicyConfiguration#initialize
[main 2025-02-07T10:32:45.624Z] PolicyConfiguration#updatePolicyDefinitions [
    'update.mode',
    'update.channel',
    'update.enableWindowsBackgroundUpdates',
    'update.showReleaseNotes',
    'http.proxy',
    'http.proxyStrictSSL',
    'http.proxyKerberosServicePrincipal',
    'http.noProxy',
    'http.proxyAuthorization',
    'http.proxySupport',
    'http.systemCertificates',
    'http.experimental.systemCertificatesV2',
    'http.electronFetch',
    'http.fetchAdditionalSupport',
    'telemetry.telemetryLevel',
    'telemetry.enableTelemetry'
]
[main 2025-02-07T10:32:45.625Z] NativePolicyService#_updatePolicyDefinitions - Found 1 policy definitions
[main 2025-02-07T10:32:45.630Z] [File Watcher (node.js)] Request to start watching: c:\Users\CC\AppData\Roaming\Code\User (excludes: <none>, includes: <all>, filter: <none>, correlationId: <none>),c:\Users\CC\AppData\Roaming\Code\User\settings.json (excludes: <none>, includes: <all>, filter: <none>, correlationId: <none>)
[main 2025-02-07T10:32:45.638Z] NativePolicyService#_onDidPolicyChange - Updated policy values: {}
[main 2025-02-07T10:32:45.638Z] PolicyConfiguration#update [ 'update.mode' ]
[main 2025-02-07T10:32:45.645Z] [File Watcher (node.js)] Started watching: 'c:\Users\CC\AppData\Roaming\Code\User'
[main 2025-02-07T10:32:45.646Z] [File Watcher (node.js)] Started watching: 'c:\Users\CC\AppData\Roaming\Code\User\settings.json'
[main 2025-02-07T10:32:45.681Z] Sending some foreground love to the running instance: 8668
[main 2025-02-07T10:32:45.685Z] Sending env to running instance...
[main 2025-02-07T10:32:45.781Z] Sent env to running instance. Terminating...
[main 2025-02-07T10:32:45.782Z] Lifecycle#kill()
[main 2025-02-07T10:32:45.782Z] Lifecycle#onWillShutdown.fire()
```

然而，在 vscode 集成终端中使用同样的命令，返回的信息就简短得多：

```json
{
  "type": "open",
  "fileURIs": [],
  "folderURIs": [
    "file:///home/dove/example"
  ],
  "diffMode": false,
  "mergeMode": false,
  "addMode": false,
  "gotoLineMode": false,
  "forceReuseWindow": false,
  "forceNewWindow": false
}
```

> 以上内容只是在我的已经经过配置的机器上的复现，可能实际情况有所不同。

我们可以看到，直接启动 vscode 会经过一个与 windows 通信的过程，这个过程大大拖慢了 vscode 的启动。

## 两个终端中 code 命令不一样？

分别在 wsl 终端和 vscode 集成终端使用命令 `which code`，可以惊奇地发现，这俩返回的内容还不一样！

* wsl 终端返回：就是你 windows 中的 vscode 路径
* vscode 集成终端返回：`~/.vscode-server/bin/cd4ee3b1c348a13bafd8f9ad8060705f6d4b9cba/bin/remote-cli/code`

本着试一试的心态，我在现有 vscode 实例保持开启的情况下直接在 wsl 终端终端中运行了 `~/.vscode-server/bin/cd4ee3b1c348a13bafd8f9ad8060705f6d4b9cba/bin/remote-cli/code`，结果返回不是很乐观：

```txt
Command is only available in WSL or inside a Visual Studio Code terminal.
```

??? 你凭什么觉得我不是 WSL???

## 检查环境变量

是什么导致在集成终端中的 code 与 wsl 终端中的 code 不同？怀着这个疑问，结合 gpt 的建议，我尝试着用命令 `env | grep -i vscode` 检查了 vscode 集成终端和 wsl 终端中的环境变量，结果发现只有集成终端中有返回值：

```bash
WSLENV=VSCODE_WSL_EXT_LOCATION/up
PATH=巴拉巴拉:/home/dove/.vscode-server/bin/cd4ee3b1c348a13bafd8f9ad8060705f6d4b9cba/bin/remote-cli:/home/dove/.vscode-server/data/User/globalStorage/github.copilot-chat/debugCommand
TERM_PROGRAM=vscode
GIT_ASKPASS=/home/dove/.vscode-server/bin/cd4ee3b1c348a13bafd8f9ad8060705f6d4b9cba/extensions/git/dist/askpass.sh
VSCODE_GIT_ASKPASS_NODE=/home/dove/.vscode-server/bin/cd4ee3b1c348a13bafd8f9ad8060705f6d4b9cba/node
VSCODE_GIT_ASKPASS_EXTRA_ARGS=
VSCODE_GIT_ASKPASS_MAIN=/home/dove/.vscode-server/bin/cd4ee3b1c348a13bafd8f9ad8060705f6d4b9cba/extensions/git/dist/askpass-main.js
VSCODE_GIT_IPC_HANDLE=/run/user/1000/vscode-git-15e985ba72.sock
VSCODE_IPC_HOOK_CLI=/run/user/1000/vscode-ipc-fa32c8b2-a7cb-4341-b816-5d615face785.sock
VSCODE_INJECTION=1
```

或许就是这些环境变量中的某一个缺失导致了 wsl 终端中无法直接使用 `~/.vscode-server/bin/cd4ee3b1c348a13bafd8f9ad8060705f6d4b9cba/bin/remote-cli/code`！

经过尝试，我发现，关键在于环境变量 `VSCODE_IPC_HOOK_CLI`。只要它是正确的，就能正常使用 `~/.vscode-server/bin/cd4ee3b1c348a13bafd8f9ad8060705f6d4b9cba/bin/remote-cli/code`。

然后，我把现有的 vscode 实例关闭，再次尝试在 wsl 终端中使用同样的命令。步豪！它又跑不动了。

## 选择正确的 VSCODE_IPC_HOOK_CLI

注意到

```bash
VSCODE_IPC_HOOK_CLI=/run/user/1000/vscode-ipc-fa32c8b2-a7cb-4341-b816-5d615face785.sock
```

不妨检查一下 `/run/user/1000` 目录。结果发现，里面茫茫多的 `vscode-*.sock`。监测一下这个目录，你会发现，每在 wsl 终端中 `code` 一下，这里的 `vscode-*.sock` 就会多出来一个。看来，这个变量是和 vscode 实例密切相关的。结合之前关闭 vscode 实例，命令失效的情况，我们有这样的结论：

每当打开一个远程连接到 wsl 的 vscode 实例，就会在 `/run/user/1000` 目录生成一个 `vscode-*.sock` 文件。只要保持这个 vscode 实例，并且使环境变量 `VSCODE_IPC_HOOK_CLI` 与它一致，就可以使用 `~/.vscode-server/bin/*/bin/remote-cli/code` 实现快速启动 vscode 实例。

问题是，这个命令中间的那一坨应该是什么？

进入 `~/.vscode-server/bin/`，你会发现，这里有很多的 `一堆数字和字母组合` 目录（当然也可能只有一个）。我不知道它们按照什么规则生成，但我在里面发现了有关 extensions 的文件夹。那么显然，不至于每建立一个 vscode 实例就开一个目录吧……那有效的目录自然就是最新的那个了！

结合上述思路，我们可以写一个 shell 脚本帮助我们选择正确的 `VSCODE_IPC_HOOK_CLI` 和命令:

```shell
#!/bin/bash
# quickcode.sh
# 先读取之前记录的 VSCODE_IPC_HOOK_CLI
if [ -f /home/dove/.config/bgcode/vscode_ipc_hook_cli.txt ]; then
    export VSCODE_IPC_HOOK_CLI=$(cat /home/dove/.config/bgcode/vscode_ipc_hook_cli.txt)
fi

CODE_CMD=$(ls -t /home/dove/.vscode-server/bin/*/bin/remote-cli/code 2>/dev/null | head -n 1)
if [ -z "$CODE_CMD" ]; then
    echo "No code code remote-cli found."
    exit 1
fi

if [ $# -eq 0 ]; then
    if ! "$CODE_CMD" 2>/dev/null; then
        VSCODE_IPC_HOOK_CLIS=$(ls -t /run/user/1000/vscode-ipc-* 2>/dev/null)
        for cli in $VSCODE_IPC_HOOK_CLIS; do
            export VSCODE_IPC_HOOK_CLI=$cli
            if "$CODE_CMD" 2>/dev/null; then
                echo "$cli" > /home/dove/.config/bgcode/vscode_ipc_hook_cli.txt
                break
            else
                echo invalid cli: "$cli"
            fi
        done
    fi
fi

for folder in "$@"; do
    if ! "$CODE_CMD" "$folder" 2>/dev/null; then
        # 获取所有按时间排序的 VSCODE_IPC_HOOK_CLI
        VSCODE_IPC_HOOK_CLIS=$(ls -t /run/user/1000/vscode-ipc-* 2>/dev/null)
        for cli in $VSCODE_IPC_HOOK_CLIS; do
            export VSCODE_IPC_HOOK_CLI=$cli
            if "$CODE_CMD" "$folder" 2>/dev/null; then
                echo "$cli" > /home/dove/.config/bgcode/vscode_ipc_hook_cli.txt
                break
            else
                echo invalid cli: "$cli"
            fi
        done
    fi
done

exit 0
```

这个 shell 脚本主要做了这样的事：

1. 从缓存（这里是 `/home/dove/.config/bgcode/vscode_ipc_hook_cli.txt`，请结合情况自己修改）读取已有的 `VSCODE_IPC_HOOK_CLI` 记录，然后再寻找 `~/.vscode-server/bin` 中最新的那个文件夹中的 `code`，作为快速的 `code` 命令。

2. 根据输入的变量尝试使用新的 `code` 命令来启动 vscode 实例。如果失败了，就在 `/run/user/1000/` 中从最新的 `socket` 开始逐一尝试。如果成功，更新缓存。

我们使用

```bash
chmod +x /path/to/quickcode.sh
```

来为它赋予可执行能力。然后，可以使用

```bash
sudo ln -s /path/to/quickcode.sh /usr/local/bin/code
```

来改变 `code` 命令的行为：现在，它将改为执行这个脚本！

## 保证有可用的 vscode 实例

老实说，上面的 shell 脚本并没有处理没有可用的 vscode 实例的情况。这就要求我们保证后台总有一个 vscode 实例提供快速启动的入口。而这一任务，可以用 `.ahk` 脚本完成。

>`autohotkey` 是仅在 windows 平台有效的强大脚本工具，在自动化工作流程中很有效。你可以在官网安装 `autohotkey` 的 v2 版本。

```python
;background_vscode.ahk
RUN "D:\Microsoft VS Code\code.exe --remote=wsl+Arch"
WinWait("ahk_exe Code.exe")
WinHide("ahk_exe " "Code.exe")
```

这个脚本可以启动一个 vscode 实例并将它隐藏里（没有后台工作模式强行模拟一个）。你只要修改其中的路径，并修改你的 wsl 发行版就可以使用。然后，记得将它设置为开机自启。

## 我有时还是想要以不连接 wsl 的方式在 wsl 终端中打开文件(?)

好吧，那你可以使用这个脚本，记得改一下路径：

```bash
#!/bin/bash
# wincode.sh
resolved_args=()
for arg in "$@"; do
    if [ -L "$arg" ]; then
        resolved_path=$(readlink -f "$arg")
    else
        resolved_path="$arg"
    fi
    windows_path=$(wslpath -w "$resolved_path")
    resolved_args+=("$windows_path")
done

/mnt/d/Microsoft\ VS\ Code/Code.exe "${resolved_args[@]}"
```

然后也把它添加进环境变量：

```bash
chmod +x /path/to/wincode.sh
sudo ln -s /path/to/wincode.sh /usr/local/bin/wincode
```

之后就可以用 `wincode` 命令了。
