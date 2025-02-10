---
title: 个人 archWsl2 使用经验
description: archWsl2 是非官方的 wsl2 方案，因此少不了折腾……
pubDate: 2025-02-10
updatedDate: 2025-02-10
tags: ["archlinux","arch","wsl2"]
category: "瞎折腾"
---
## informant

informant 是一个用于查看arch资讯的命令

```bash
informant list
# 列出新闻
informant check
# 检查未读新闻并显示
informant read <编号>
# 查看新闻内容
```

`informant`会自动添加到`sudo pacman -Syu`的钩子中，以避免我在更新系统时错过官方对于可能破坏系统的更新的公告。

## 添加定制脚本到环境变量

编写了一些定制化脚本。使用：

```bash
sudo ln -s ~/path/to/myScript.sh /usr/local/bin/scriptShortName
```

来建立符号链接。`/usr/local/bin`一般用于存放用户个人的一些内容，这可避免与`/usr/bin`中的系统依赖产生冲突。

## 解决wslg与arch兼容问题

No X11 display socket

使用`xeyes`时报错`Error: Can't open display: :0`

使用如下方法解决。

```bash
ls -la /tmp/.X11-unix
# output
total 0
drwxrwxrwt 2 root root  40 Jan 10 15:34 .
drwxrwxrwt 8 root root 160 Jan 10 15:34 ..

sudo rm -r /tmp/.X11-unix
rm: remove directory '/tmp/.X11-unix'? y

ln -s /mnt/wslg/.X11-unix /tmp/.X11-unix
```

<!-- ## 解决中文问题

打开 "/etc/locale.gen"，确认

```text
en_US.UTF-8 UTF-8
zh_CN.UTF-8 UTF-8
```

在终端执行

```bash
sudo locale-gen
```

尝试激活区域支持，遭遇报错

```bash
Generating locales...
  en_US.UTF-8... done
  zh_CN.UTF-8...[error] cannot open locale definition file `zh_CN': No such file or directory
```

结果是直接从网上下载了zh_CN

```bash
sudo wget -O /usr/share/i18n/locales/zh_CN https://sourceware.org/git/\?p\=glibc.git\;a\=blob_plain\;f\=localedata/locales/zh_CN\;hb\=HEAD
```

等待解决。 -->

## 查看空间占用

```bash
 du -h --max-depth=1
```

<!-- ## 解决wslg字体太小问题

```bash
#.zshrc
# 使用 X11 而非 Wayland
export QT_QPA_PLATFORM="xcb"
```

一是避免了okular的wayland问题，二是调整了字体大小和整体缩放 -->

<!-- ## 设置字体

在~/.config/fontconfig/font.conf里 -->

## 配置环境变量

在`~/.zsh_profile`中添加

```bash
export PATH="${PATH}:/home/username/<...>"
```

## 卸载okular后发现wps无法打开

wps 打开需要依赖 phonon-qt6-vlc 。由于卸载 okular 时选择的 -Rs 将它当作其它软件不需要的依赖，将它删去了，就会导致 wps 无法启动。运行：

```bash
sudo pacman -S phonon-qt6-vlc
```

即可让 wps 正常使用。

## xdg-open 的默认浏览器打开方式发生改变

仍未解决。目前发现，`.zshrc`中的`BROWSER`被设置为`wslview`，但是在`/usr/share/applications`中找不到`wslview.desktop`，而尝试使用

```bash
xdg-settings set default-web-browser
```

时会报错：`BROWSER`已经设置，无法改变`xdg-settings`。

目前的解决方案：

```bash
#在/usr/share/applications中
#推测某次滚动更新导致了chromium.desktop被安装到这里
sudo rm chromium.desktop
#接下来该步需谨慎，之前是检测了系统没有wslview这个命令，于是下载测试，发现有明显卡顿，选择删除
pacman -R wslu
#修改.zshrc，保证 BROWSER 变量有正确的值，xdg-open 能够正确打开浏览器。
export BROWSER=edge
# 此处edge这样获得：
sudo ln -s /mnt/c/Program\ Files\ \(x86\)/Microsoft/Edge/Application/msedge.exe /usr/local/bin/edge
```

我的另一个想法是，在其它脚本中减少对`xdg-open`的调用，直接选择对应应用，可能更为清晰，也更不容易出问题。

然而，这样做后，涉及`xdg-open`调用的内容都变成使用`edge`了，于是删除

```bash
# 修改.zshrc
# export BROWSER=edge
```

取消这一点后，可以 customize `xdg-open`命令。修改`~/.config/mimeapps.list`

```yaml
[Default Applications]
inode/directory=code.desktop
x-scheme-handler/http=edge.desktop
x-scheme-handler/https=edge.desktop
text/html=edge.desktop
x-scheme-handler/about=edge.desktop
x-scheme-handler/unknown=edge.desktop
```

这是告诉它网页用`edge`打开。

然后，我们在`~/.local/share/applications`创建`edge.desktop`文件

```yaml
[Desktop Entry]
Name=Edge
Exec=edge %u
Type=Application
MimeType=x-scheme-handler/unknown;x-scheme-handler/about;text/html;x-scheme-handler/http;x-scheme-handler/https;
```

最后，在命令行更新桌面程序数据库和`xdg-open`的默认浏览器：

```bash
update-desktop-database ~/.local/share/applications
xdg-settings set default-web-browser edge.desktop
```

这样就大功告成了。xdg-open将会默认使用edge.desktop打开网页。经测试，速度正常。

<!-- ## 未解决：mpv音频输出错误

```log
music mpv DJ\ SLY\ -\ いのちの名前\ \~ジブリ・メドレー\~.mp3 --no-video
○ Image  --vid=1  (png 640x640)
● Audio  --aid=1  (mp3 2ch 44100 Hz 320 kbps)
File tags:
 Artist: DJ SLY
 Album: The Best of Jazzin’for Ghibli
 Comment: 163 key(Don't modify):L64FU3W4YxX3ZFTmbZ+8/ZvfvfYK+qJjsyhNnwPqtIe/tPk+jK9WgF+d5tp5y8jrm7LwRJLbBXIykvizYFs2hs4rJSBdXyAjzXKLciAI5UZlviM8x34/GQpdPeeJUBh9q0Uw7Y1+qL3e7c894yVqLznJTQ19GabYHvJbLQwJOEp+WBT+iEp/uiI4qxnOH2g4PA1jcDgRfyEvC7VNjQel5pVfZO4kO9kofY5ldpCeWL4aKiddgxK7OqUS+1SiyU0VwMWIRUHDMR33aYZVo8s3BwhM16/N8GlTCt4m6QF5KEZQL+2EbGGtlVDyf6a3kWlhcerLDMA6qyrci8syBnwpyiZaAoZTy8j3CHVlksd8BZ2paoq49tPy+5nvYagYEFcccTAl1NgcXX9zDWyaigNOiq+8t5CZND331JOgf66VHzRDQ3kLUd6N+FchszIs11ijiy0pp/9ak6oZoIFfK9b+x6oFWYhLmAASuYrEEHwiEVZgVX/21DHehvBiHGgK1O/o7yxOOXjIJXEOCqdGBZQ6bOzMMNIlmyaRa12mHQ3DdyhQDpeJb2I0bcGN2IgmwcGwY9/bj2Ale0/z/fMmJGZAofpQORWzYuNWw2CZdgsDg+QaOnpQshTKorx6Sp+6aA2iDznpjAWH/F6PnGQScyIzaQ==
 Title: いのちの名前 ~ジブリ・メドレー~
 Track: 7
ALSA lib confmisc.c:855:(parse_card) cannot find card '0'
ALSA lib conf.c:5205:(_snd_config_evaluate) function snd_func_card_inum returned error: No such file or directory
ALSA lib confmisc.c:422:(snd_func_concat) error evaluating strings
ALSA lib conf.c:5205:(_snd_config_evaluate) function snd_func_concat returned error: No such file or directory
ALSA lib confmisc.c:1342:(snd_func_refer) error evaluating name
ALSA lib conf.c:5205:(_snd_config_evaluate) function snd_func_refer returned error: No such file or directory
ALSA lib conf.c:5728:(snd_config_expand) Evaluate error: No such file or directory
ALSA lib pcm.c:2722:(snd_pcm_open_noupdate) Unknown PCM default
[ao/alsa] Playback open error: No such file or directory
Cannot connect to server socket err = No such file or directory
Cannot connect to server request channel
jack server is not running or cannot be started
JackShmReadWritePtr::~JackShmReadWritePtr - Init not done for -1, skipping unlock
JackShmReadWritePtr::~JackShmReadWritePtr - Init not done for -1, skipping unlock
[ao/jack] cannot open server
ALSA lib confmisc.c:855:(parse_card) cannot find card '0'
ALSA lib conf.c:5205:(_snd_config_evaluate) function snd_func_card_inum returned error: No such file or directory
ALSA lib confmisc.c:422:(snd_func_concat) error evaluating strings
ALSA lib conf.c:5205:(_snd_config_evaluate) function snd_func_concat returned error: No such file or directory
ALSA lib confmisc.c:1342:(snd_func_refer) error evaluating name
ALSA lib conf.c:5205:(_snd_config_evaluate) function snd_func_refer returned error: No such file or directory
ALSA lib conf.c:5728:(snd_config_expand) Evaluate error: No such file or directory
ALSA lib pcm.c:2722:(snd_pcm_open_noupdate) Unknown PCM default
[ao/openal] could not open device
[ao] Failed to initialize audio driver 'openal'
Could not open/initialize audio device -> no sound.
Audio: no audio
: 00:00:00 / 00:04:26 (0%)
Exiting... (Errors when loading file)
```

## 解决mpv相关的图形问题

使用mpv时，如果不指定--no-video，会出现图形相关报错：

```log
 music mpv DJ\ SLY\ -\ いのちの名前\ \~ジブリ・メドレー\~.mp3
● Image  --vid=1  (png 640x640)
● Audio  --aid=1  (mp3 2ch 44100 Hz 320 kbps)
File tags:
 Artist: DJ SLY
 Album: The Best of Jazzin’for Ghibli
 Comment: 163 key(Don't modify):L64FU3W4YxX3ZFTmbZ+8/ZvfvfYK+qJjsyhNnwPqtIe/tPk+jK9WgF+d5tp5y8jrm7LwRJLbBXIykvizYFs2hs4rJSBdXyAjzXKLciAI5UZlviM8x34/GQpdPeeJUBh9q0Uw7Y1+qL3e7c894yVqLznJTQ19GabYHvJbLQwJOEp+WBT+iEp/uiI4qxnOH2g4PA1jcDgRfyEvC7VNjQel5pVfZO4kO9kofY5ldpCeWL4aKiddgxK7OqUS+1SiyU0VwMWIRUHDMR33aYZVo8s3BwhM16/N8GlTCt4m6QF5KEZQL+2EbGGtlVDyf6a3kWlhcerLDMA6qyrci8syBnwpyiZaAoZTy8j3CHVlksd8BZ2paoq49tPy+5nvYagYEFcccTAl1NgcXX9zDWyaigNOiq+8t5CZND331JOgf66VHzRDQ3kLUd6N+FchszIs11ijiy0pp/9ak6oZoIFfK9b+x6oFWYhLmAASuYrEEHwiEVZgVX/21DHehvBiHGgK1O/o7yxOOXjIJXEOCqdGBZQ6bOzMMNIlmyaRa12mHQ3DdyhQDpeJb2I0bcGN2IgmwcGwY9/bj2Ale0/z/fMmJGZAofpQORWzYuNWw2CZdgsDg+QaOnpQshTKorx6Sp+6aA2iDznpjAWH/F6PnGQScyIzaQ==
 Title: いのちの名前 ~ジブリ・メドレー~
 Track: 7
[vo/gpu/opengl] Suspected software renderer or indirect context.
[vo/gpu/opengl] Suspected software renderer or indirect context.
[vo/gpu/drm] VT_GETMODE failed: Inappropriate ioctl for device
[vo/gpu/drm] Failed to set up VT switcher. Terminal switching will be unavailable.
[vo/gpu/drm] No primary DRM device could be picked!
[vo/gpu/drm] Failed to find a usable DRM primary node!
[vo/gpu-next/opengl] Suspected software renderer or indirect context.
[vo/gpu-next/opengl] Suspected software renderer or indirect context.
[vo/gpu-next/drm] Can't handle VT release - signal already used
[vo/gpu-next/drm] Failed to set up VT switcher. Terminal switching will be unavailable.
[vo/gpu-next/drm] No primary DRM device could be picked!
[vo/gpu-next/drm] Failed to find a usable DRM primary node!
Failed to open VDPAU backend libvdpau_nvidia.so: cannot open shared object file: No such file or directory
[vo/vdpau] Error when calling vdp_device_create_x11: 1
[vo/xv] No Xvideo support found.
[vaapi] libva: vaGetDriverNames() failed with unknown libva error
[vaapi] Failed to initialize VAAPI: unknown libva error
[vo/x11] Warning: this legacy VO has bad performance. Consider fixing your graphics drivers, or not forcing the x11 VO.
Displaying cover art. Use --no-audio-display to prevent this.
VO: [x11] 640x640 rgba
AO: [pulse] 44100Hz stereo 2ch float
```

安装glxinfo用于检查opengl的配置信息：

```bash
 sudo pacman -S mesa-utils
```

检查：

```log
➜  music glxinfo | grep OpenGL
OpenGL vendor string: Mesa
OpenGL renderer string: llvmpipe (LLVM 18.1.8, 256 bits)
OpenGL core profile version string: 4.5 (Core Profile) Mesa 24.3.2-arch1.1
OpenGL core profile shading language version string: 4.50
OpenGL core profile context flags: (none)
OpenGL core profile profile mask: core profile
OpenGL core profile extensions:
OpenGL version string: 4.5 (Compatibility Profile) Mesa 24.3.2-arch1.1
OpenGL shading language version string: 4.50
OpenGL context flags: (none)
OpenGL profile mask: compatibility profile
OpenGL extensions:
OpenGL ES profile version string: OpenGL ES 3.2 Mesa 24.3.2-arch1.1
OpenGL ES profile shading language version string: OpenGL ES GLSL ES 3.20
OpenGL ES profile extensions:
```

这说明当前OpenGL使用的是llvmpipe渲染，系统通过CPU进行软件渲染，而非GPU进行硬件加速。

暂时解决不掉。fuck nvidia。

第二天：拼尽全力无法战胜，不管怎么修改，opengl始终使用llvmpipe渲染，非常难受。 -->

## 中文输入法问题

在 arch 中，可以通过

```bash
sudo pacman -S fcitx fcitx-libpinyin
```

来获取经典的输入法 fctix 以及它的中文拼音拓展。在`.zshrc`中，需要加入：

```bash
 # 配置输入法
 140   │ export GTK_IM_MODULE=fcitx
 141   │ export QT_IM_MODULE=fcitx
 142   │ export XMODIFIERS=@im=fcitx
```

来实现输入法的环境变量配置。

此外，输入法的默认字体可能非常抽象，我们修改`/home/dove/.config/fcitx/conf/fcitx-classic-ui.config`：

```c
Font = Microsoft YaHei
MenuFont = Microsoft YaHei
```

最后，设置一个启动项：

```bash
#fcitx-init.sh
#还没搞清楚自启动钩子，先这么凑合
#!/bin/bash
if [ ! -f /tmp/fcitx-init ]; then
    touch /tmp/fcitx-init
    fcitx 2>/dev/null &
fi

# in terminal
chmod +x ~/myScripts/fcitx-init.sh
sudo ln -s ~/myScripts/fcitx-init.sh /usr/local/bin/fcitx-init
```

最后在`.zshrc`加上

```bash
fcitx-init
```

## 让yazi预览图片

第一种方案是，暂时选择使用 chafa 来预览像素化的图片，这对于 pdf 文件惨不忍睹。

新的解决方案是，选择使用 wezterm 终端代替 windows terminal 终端，并使用 ssh 的方式连接 wsl， 而非直接打开 wsl，这样可以避免 ConPTY 带来的问题。

在 wsl 内：

```bash
sudo systemctl start sshd

# 检查
sudo systemctl status sshd
# output
● sshd.service - OpenSSH Daemon
     Loaded: loaded (/usr/lib/systemd/system/sshd.service; disabled; preset: disabled)
     Active: active (running) since Tue 2025-01-07 18:06:56 CST; 9s ago
 Invocation: c7837ffeb6c64f64a595369e682200bc
   Main PID: 27047 (sshd)
      Tasks: 1 (limit: 38317)
     Memory: 1.7M
        CPU: 5ms
     CGroup: /system.slice/sshd.service
             └─27047 "sshd: /usr/bin/sshd -D [listener] 0 of 10-100 startups"

Jan 07 18:06:56 HH systemd[1]: Starting OpenSSH Daemon...
Jan 07 18:06:56 HH sshd[27047]: Server listening on 0.0.0.0 port 22.
Jan 07 18:06:56 HH sshd[27047]: Server listening on :: port 22.
Jan 07 18:06:56 HH systemd[1]: Started OpenSSH Daemon.
```

然后在 cmd 中：

```cmd
wezterm ssh dove@127.0.0.1
```

即可完成登录。

然而，ssh 与 直接 wsl 打开在一些方面有所不同。一是对 DISPLAY 变量并没有直接设置，二是不再包含 windows 中的环境变量。不过，由于`quickcode.sh`脚本，之前的远程登录服务器被保留，因此 vscode 中依旧可以使用 windows 中的环境变量。目前发现需要做的就是添加对 DISPLAY 变量(gui应用)的配置和 PULSE_SERVER 变量(mpv)的配置：

```bash
# ~/.zprofile
export DISPLAY=:0
export PULSE_SERVER=unix:/mnt/wslg/PulseServer
```

## wezterm 的配置

通过 winget 直接下载了 wezterm，它的配置在用户目录下，为`.wezterm.lua`.

```lua
local wezterm = require 'wezterm'
local config = {}

config.background = {
    {
        source = {
            File = 'D:/Pictures/Life/arch-chan-opacity-judged.jpg'
        },
        opacity = 1,
        height = 'Cover',
        horizontal_align = 'Center',
        vertical_align = 'Middle',
        repeat_x = 'NoRepeat',
        repeat_y = 'NoRepeat',
    }
}

config.colors = {
    foreground = "#DCDCDC",
    background = "#282C34",
    cursor_bg = "#DCDCDC",
    cursor_border = "#DCDCDC",
    cursor_fg = "#282C34",
    selection_bg = "#264F78",
    scrollbar_thumb = "#797979",
    ansi = {
        "#282C34", "#E06C75", -- 柔和红
        "#98C379", "#E5C07B",
        "#61AFEF", "#C678DD", "#56B6C2", "#DCDCDC",
    },
    brights = {
        "#5A6374", "#EC8A88", -- 亮红
        "#4EC9B0", "#D7BA7D",
        "#569CD6", "#C586C0", "#9CDCFE", "#FFFFFF",
    },
}
-- 滚动条尺寸为 15 ，其他方向不需要 pad
config.window_padding = { left = 0, right = 15, top = 0, bottom = 0 }
-- 启用滚动条
config.enable_scroll_bar = true

-- 取消 Windows 原生标题栏
config.window_decorations = "INTEGRATED_BUTTONS|RESIZE"

-- 设置字体
config.font = wezterm.font_with_fallback({
  { family = "Fira Code", weight = "Regular" }, -- 正常字体
  { family = "Fira Code", weight = "ExtraBold" },    -- 加粗字体
  "Symbols Nerd Font",                          -- 备用字体
})

-- 启用文本加粗
config.bold_brightens_ansi_colors = true
config.font_size = 12.0 -- 调整字体大小

-- 取消关闭时的提醒
config.window_close_confirmation = 'NeverPrompt'

wezterm.on('gui-startup', function(cmd)
  local tab, pane, window = wezterm.mux.spawn_window(cmd or {})
  window:gui_window():maximize() -- 最大化窗口
end)

config.keys = {
    {
        key = 'd',
        mods = 'SHIFT|ALT',
        action = wezterm.action.SplitHorizontal { domain = 'CurrentPaneDomain'},
    },
    {
        key = 's',
        mods = 'SHIFT|ALT',
        action = wezterm.action.SplitVertical { domain = 'CurrentPaneDomain'},
    },
    {
        key = 'j',
        mods = 'ALT',
        action = wezterm.action.ActivatePaneDirection('Left'),
    },
    {
        key = 'l',
        mods = 'ALT',
        action = wezterm.action.ActivatePaneDirection('Right'),
    },
    {
        key = 'i',
        mods = 'ALT',
        action = wezterm.action.ActivatePaneDirection('Up'),
    },
    {
        key = 'k',
        mods = 'ALT',
        action = wezterm.action.ActivatePaneDirection('Down'),
    },
    {
        key = 'w',
        mods = 'ALT',
        action = wezterm.action.CloseCurrentPane { confirm = false },
    }
}

config.mouse_bindings = {
    {
        event = { Down = { streak = 1, button = 'Right' } },
        mods = 'NONE',
        action = wezterm.action_callback(function(window, pane)
            local selection = window:get_selection_text_for_pane(pane)
            if selection and #selection > 0 then
                -- 如果有选中内容，则复制到剪贴板
                window:perform_action(wezterm.action.CopyTo 'Clipboard', pane)
                window:perform_action(wezterm.action.ClearSelection, pane)
            else
                -- 如果没有选中内容，则粘贴剪贴板内容
                window:perform_action(wezterm.action.PasteFrom 'Clipboard', pane)
            end
        end),
    },
}
return config
```

## 直接安装 docker

archwsl 支持不使用 DockerDesktop 来使用 docker.

```bash
sudo pacman -S docker
#systemd enabled
sudo systemctl start docker.service
sudo systemctl enable docker.service
# 将用户添加到 docker 组中
sudo usermod -aG docker $USER
# 重新登录
# 检查 docker 能否使用
docker ps -a
# expected output
# CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

同时，安装`docker-buildx`使用新版构建器。

```bash
sudo pacman -S docker-buildx
```

## 配置 pacman 源

```bash
sudo rankmirrors -n 5 /etc/pacman.d/mirrorlist
# 将结果写入 /etc/pacman.d/mirrorlist
```

为了让`sudo`(`sudo pacman -Syu`)可以享受网络代理，在`/etc/sudoers`中添加

```bash
# 规定可以传递到 sudo 的环境变量
Defaults env_keep += "http_proxy https_proxy no_proxy"
```

## 网络与 docker 网络

见 [wsl 原生 docker 网络配置](https://crazyspotteddove.github.io/blog/dockernetwork/)
