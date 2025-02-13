---
title: 使用 ahk 脚本实现多显示屏焦点切换
description: 使用 ahk 脚本可以很好地满足多显示屏切换鼠标焦点的需求
pubDate: 2025-02-13
updatedDate: 2025-02-13
tags: ["autohotkey","autohotkey2","change screen","切换显示器","切换鼠标焦点"]
category: "ahk 脚本"
---
日常使用电脑过程中经常需要使用多个显示屏，随之而来的就有在多个显示屏之间快速切换鼠标焦点的需求。一个很常见的情形就是一个屏幕开着代码编辑器，然后切另一个屏幕开浏览器去了，这时想要切回代码编辑器焦点，可能就需要`alt + tab`很多遍，不是很舒服。

为此，可以编写一个 ahk 脚本，然后设置为开机自启。

## 获取显示屏信息

`MonitorGetCount`可以获取显示屏数量，然后用`MonitorGetWorkArea`来获取显示屏像素范围，存储到`monitors`中。

```go
MonitorCount := MonitorGetCount()

monitors := []

loop MonitorCount {
    MonitorGetWorkArea A_Index, &WL, &WT, &WR, &WB
    monitorInfo := {
        left: WL,
        right: WR,
        top: WT,
        bottom: WB,
    }
    monitors.Push(monitorInfo)
}
```

## 计算应用窗口中心位置

不可以直接用`WinGetPos`获得的应用位置来判断在哪个显示屏范围内，因为它往往会取处于两个显示屏中间间隔的一个像素，导致不在任何一个显示屏中。同时，我们也希望鼠标移动到应用窗口中心位置。

```go
CalcCenterPosition(x, y, width, height) {
    return {
        x: x + width / 2,
        y: y + height / 2,
    }
}
```

## 判断所属屏幕

屏幕数量不多，遍历即可。

```go
DecideMonitorIndex(x, y) {
    for index, monitor in monitors {
        if (x >= monitor.left && x <= monitor.right && y >= monitor.top && y <= monitor.bottom) {
            return index
        }
    }
    return -1
}
```

## 最终结果

以下为全部代码。在快捷键绑定这里，选择的是`alt + number`方式，和 windows 原本快捷启动应用的快捷键冲突，可以自行选择绑定。另外，我没有找到 ahk 动态绑定快捷键的方式，所以写死了最多 4 个显示屏，如果有知道怎么做的小伙伴，欢迎评论区留言呀~

```go
#Requires AutoHotkey v2.0
CoordMode("Mouse", "Screen")
MonitorCount := MonitorGetCount()

monitors := []

loop MonitorCount {
    MonitorGetWorkArea A_Index, &WL, &WT, &WR, &WB
    monitorInfo := {
        left: WL,
        right: WR,
        top: WT,
        bottom: WB,
    }
    monitors.Push(monitorInfo)
}

DecideMonitorIndex(x, y) {
    for index, monitor in monitors {
        if (x >= monitor.left && x <= monitor.right && y >= monitor.top && y <= monitor.bottom) {
            return index
        }
    }
    return -1
}

CalcCenterPosition(x, y, width, height) {
    return {
        x: x + width / 2,
        y: y + height / 2,
    }
}

SwitchFocus(i) {
    windows := WinGetList()
    for window in windows {
        title := WinGetTitle(window)
        if (WinGetMinMax(window) == -1) {
            continue
        }
        if (title != "" && title != "abgox-InputTip-Symbol-Window") {
            WinGetPos(&X, &Y, &Width, &Height, window)
            Pos := CalcCenterPosition(X, Y, Width, Height)
            if (DecideMonitorIndex(Pos.x, Pos.y) == i) {
                WinActivate(window)
                MouseMove(Pos.x, Pos.y, 0)
                return
            }
        }

    }
}

loop MonitorCount {
    if A_Index == 1 {
        !1:: {
            SwitchFocus(1)
        }
    }
    if A_index == 2 {
        !2:: {
            SwitchFocus(2)
        }
    }
    if A_index == 3 {
        !3:: {
            SwitchFocus(3)
        }
    }
    if A_index == 4 {
        !4:: {
            SwitchFocus(4)
        }
    }
}

```

最后将脚本的快捷方式添加到启动目录即可~
