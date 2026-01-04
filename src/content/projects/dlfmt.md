---
title: dlfmt
description: 高性能的 lua 代码格式化工具
pubDate: 2025-12-21
updatedDate: 2025-12-21
tags: ["lua","formatter","lua formatter","格式化","格式化工具","vscode 插件","高性能工具"]
---

## 简介

dlfmt 是一款高性能的 lua 代码格式化工具，同时也提供了一定程度的压缩代码功能。如果你需要管理一些十万字符级别的 lua 代码文件，那么选择使用 dlfmt 进行格式化会是更好的选择。

## 性能对比

### Brief

| 文件名            | 行数  | 字符数  | 工具        | 平均时间 (s) |
|-------------------|-------|---------|-------------|--------------|
| hero_scripts.lua  | 29118 | 765150  | lua-format  | 1.1080       |
| hero_scripts.lua  | 29118 | 765150  | stylua      | 1.5490       |
| hero_scripts.lua  | 29118 | 765150  | dlfmt       | 0.0434       |
| go_towers.lua     | 53804 | 1365652 | lua-format  | 21.2510      |
| go_towers.lua     | 53804 | 1365652 | stylua      | 2.5120       |
| go_towers.lua     | 53804 | 1365652 | dlfmt       | 0.1080       |
| lldebugger.lua    | 2548  | 60634   | lua-format  | 0.1348       |
| lldebugger.lua    | 2548  | 60634   | stylua      | 0.2504       |
| lldebugger.lua    | 2548  | 60634   | dlfmt       | 0.0045       |

### Detail

`hero_scripts.lua`: 29118 lines, 765150 chars.

```sh
hyperfine '/home/dove/.vscode-server/extensions/yinfei.luahelper-0.2.29/server/linux/lua-format ./kr1/hero_scripts.lua -i'
Benchmark 1: /home/dove/.vscode-server/extensions/yinfei.luahelper-0.2.29/server/linux/lua-format ./kr1/hero_scripts.lua -i
  Time (mean ± σ):      1.108 s ±  0.035 s    [User: 1.018 s, System: 0.090 s]
  Range (min … max):    1.062 s …  1.168 s    10 runs

hyperfine 'stylua ./kr1/hero_scripts.lua --syntax Lua52'
Benchmark 1: stylua ./kr1/hero_scripts.lua --syntax Lua52
  Time (mean ± σ):      1.549 s ±  0.033 s    [User: 1.110 s, System: 0.442 s]
  Range (min … max):    1.489 s …  1.617 s    10 runs

hyperfine '/home/dove/.vscode-server/extensions/crazyspotteddove.dlfmt-0.0.6/bin/linux/dlfmt --format-file ./kr1/hero_scripts.lua'
Benchmark 1: /home/dove/.vscode-server/extensions/crazyspotteddove.dlfmt-0.0.6/bin/linux/dlfmt --format-file ./kr1/hero_scripts.lua
  Time (mean ± σ):      43.4 ms ±   1.6 ms    [User: 28.3 ms, System: 15.0 ms]
  Range (min … max):    40.6 ms …  48.7 ms    66 runs
```

`go_towers.lua`: 53804 lines, 1365652 chars.

```sh
hyperfine '/home/dove/.vscode-server/extensions/yinfei.luahelper-0.2.29/server/linux/lua-format ./_assets/kr1-desktop/images/fullhd/go_towers.lua -i'
Benchmark 1: /home/dove/.vscode-server/extensions/yinfei.luahelper-0.2.29/server/linux/lua-format ./_assets/kr1-desktop/images/fullhd/go_towers.lua -i
  Time (mean ± σ):     21.251 s ±  0.538 s    [User: 21.066 s, System: 0.184 s]
  Range (min … max):   20.518 s … 21.850 s    10 runs

hyperfine 'stylua ./_assets/kr1-desktop/images/fullhd/go_towers.lua --syntax Lua52'
Benchmark 1: stylua ./_assets/kr1-desktop/images/fullhd/go_towers.lua --syntax Lua52
  Time (mean ± σ):      2.512 s ±  0.137 s    [User: 0.874 s, System: 1.639 s]
  Range (min … max):    2.304 s …  2.715 s    10 runs

hyperfine '/home/dove/.vscode-server/extensions/crazyspotteddove.dlfmt-0.0.6/bin/linux/dlfmt --format-file ./_assets/kr1-desktop/images/fullhd/go_towers.lua'
Benchmark 1: /home/dove/.vscode-server/extensions/crazyspotteddove.dlfmt-0.0.6/bin/linux/dlfmt --format-file ./_assets/kr1-desktop/images/fullhd/go_towers.lua
  Time (mean ± σ):     108.0 ms ±   1.8 ms    [User: 75.3 ms, System: 32.9 ms]
  Range (min … max):   105.8 ms … 111.7 ms    27 runs
```

`lldebugger.lua`: 2548 lines, 60634 chars.

```sh
hyperfine '/home/dove/.vscode-server/extensions/yinfei.luahelper-0.2.29/server/linux/lua-format ./lldebugger.lua -i'
Benchmark 1: /home/dove/.vscode-server/extensions/yinfei.luahelper-0.2.29/server/linux/lua-format ./lldebugger.lua -i
  Time (mean ± σ):     134.8 ms ±   4.0 ms    [User: 118.7 ms, System: 15.2 ms]
  Range (min … max):   129.7 ms … 142.6 ms    21 runs

hyperfine 'stylua ./lldebugger.lua --syntax Lua52'
Benchmark 1: stylua ./lldebugger.lua --syntax Lua52
  Time (mean ± σ):     250.4 ms ±  18.2 ms    [User: 148.1 ms, System: 103.6 ms]
  Range (min … max):   233.2 ms … 283.2 ms    10 runs

hyperfine '/home/dove/.vscode-server/extensions/crazyspotteddove.dlfmt-0.0.6/bin/linux/dlfmt --format-file ./lldebugger.lua'
Benchmark 1: /home/dove/.vscode-server/extensions/crazyspotteddove.dlfmt-0.0.6/bin/linux/dlfmt --format-file ./lldebugger.lua
  Time (mean ± σ):       4.5 ms ±   0.4 ms    [User: 1.8 ms, System: 2.0 ms]
  Range (min … max):     4.0 ms …   6.9 ms    366 runs
```

## 用法

### 格式化单个文件: --format-file \<file\>

```sh
./build-release/dlfmt --format-file ./tmp/hero_scripts.lua
[info dlfmt.cpp:442] Formatted file './tmp/hero_scripts.lua' in 38 ms.
```

### 格式化整个文件夹: --format-directory \<directory\>

```sh
./build-release/dlfmt --format-directory ./tmp/src-dlua
[info dlfmt.cpp:84] 1206 .lua files collected.
[info dlfmt.cpp:432] Formatted directory './tmp/src-dlua' in 357 ms.
```

### 压缩单个文件: --compress-file \<file\>

```sh
./build-release/dlfmt --compress-file ./tmp/hero_scripts.lua
[info dlfmt.cpp:462] Compressed file './tmp/hero_scripts.lua' in 36 ms.
```

### 压缩整个文件夹: --compress-directory \<directory\>

```sh
./build-release/dlfmt --compress-directory ./tmp/src-dlua
[info dlfmt.cpp:150] 1206 .lua files collected.
[info dlfmt.cpp:452] Compressed directory './tmp/src-dlua' in 357 ms.
```

### 执行格式化任务: --json-task \<json_path\>

```sh
./build-release/dlfmt --json-task ./task.json
[info dlfmt.cpp:316] 842 files to format collected.
[info dlfmt.cpp:317] 364 files to compress collected.
[info dlfmt.cpp:491] Processed json task './task.json' in 444 ms.
# Cache file .dlfmt_cache.json will be left in the same dir. So next time you launch json-task, you see:
./build-release/dlfmt --json-task ./task.json
[info dlfmt.cpp:297] 0 files to format collected.
[info dlfmt.cpp:298] 0 files to compress collected.
[info dlfmt.cpp:472] Processed json task './task.json' in 15 ms.
```

格式化任务的定义模板如下：

```json
{
  "tasks": [
    {
      "type": "format",
      "directory": ".",
      "exclude": [
        "_assets/kr1-desktop/images/fullhd",
        "kr1/data/animations",
        "kr1/data/exoskeletons",
        "kr1/data/waves",
        "kr1/data/levels"
      ]
    },
    {
      "type": "compress",
      "directory": "_assets/kr1-desktop/images/fullhd"
    },
    {
      "type": "compress",
      "directory": "kr1/data/animations"
    },
    {
      "type": "compress",
      "directory": "kr1/data/exoskeletons"
    },
    {
      "type": "compress",
      "directory": "kr1/data/waves"
    },
    {
      "type": "compress",
      "directory": "kr1/data/levels"
    }
  ]
}
```

- format: 指定一个目录，将目录下的 `.lua` 文件格式化，并排除 `exclude` 所有目录。
- compress: 指定一个目录，将目录下的 `.lua` 文件压缩，并排除 `exclude` 所有目录。

## 格式化效果

首先介绍格式化规则：

- 块级语句前后加空行。
- 不同组的行级语句之间加空行。
- 注释全都换为短注释，依附在语句前，采用相同对齐。
- 算符前后加空格等。

以下为`lua-minify`的一个代码片段格式化后的效果：

```lua
local function MinifyVariables_2(globalScope, rootScope)
	-- Variable names and other names that are fixed, that we cannot use
	-- Either these are Lua keywords, or globals that are not assigned to,
	-- that is environmental globals that are assigned elsewhere beyond our
	-- control.
	local globalUsedNames = {}

	for kw, _ in pairs(Keywords) do
		globalUsedNames[kw] = true
	end

	-- Gather a list of all of the variables that we will rename
	local allVariables = {}
	local allLocalVariables = {}

	do
		-- Add applicable globals
		for _, var in pairs(globalScope) do
			if var.AssignedTo then
				-- We can try to rename this global since it was assigned to
				-- (and thus presumably initialized) in the script we are
				-- minifying.
				table.insert(allVariables, var)
			else
				-- We can't rename this global, mark it as an unusable name
				-- and don't add it to the nename list
				globalUsedNames[var.Name] = true
			end
		end

		-- Recursively add locals, we can rename all of those
		local function addFrom(scope)
			for _, var in pairs(scope.VariableList) do
				table.insert(allVariables, var)
				table.insert(allLocalVariables, var)
			end

			for _, childScope in pairs(scope.ChildScopeList) do
				addFrom(childScope)
			end
		end

		addFrom(rootScope)
	end

	-- Add used name arrays to variables
	for _, var in pairs(allVariables) do
		var.UsedNameArray = {}
	end

	-- Sort the least used variables first
	table.sort(allVariables, function(a, b)
		return #a.RenameList < #b.RenameList
	end)

	-- Lazy generator for valid names to rename to
	local nextValidNameIndex = 0
	local varNamesLazy = {}

	local function varIndexToValidVarName(i)
		local name = varNamesLazy[i]

		if not name then
			repeat
				name = indexToVarName(nextValidNameIndex)
				nextValidNameIndex = nextValidNameIndex + 1
			until not globalUsedNames[name]

			varNamesLazy[i] = name
		end

		return name
	end

	-- For each variable, go to rename it
	for _, var in pairs(allVariables) do
		-- Lazy... todo: Make theis pair a proper for-each-pair-like set of loops
		-- rather than using a renamed flag.
		var.Renamed = true

		-- Find the first unused name
		local i = 1

		while var.UsedNameArray[i] do
			i = i + 1
		end

		-- Rename the variable to that name
		var:Rename(varIndexToValidVarName(i))

		if var.Scope then
			-- Now we need to mark the name as unusable by any variables:
			--  1) At the same depth that overlap lifetime with this one
			--  2) At a deeper level, which have a reference to this variable in their lifetimes
			--  3) At a shallower level, which are referenced during this variable's lifetime
			for _, otherVar in pairs(allVariables) do
				if not otherVar.Renamed then
					if not otherVar.Scope or otherVar.Scope.Depth < var.Scope.Depth then
						-- Check Global variable (Which is always at a shallower level)
						--  or
						-- Check case 3
						-- The other var is at a shallower depth, is there a reference to it
						-- durring this variable's lifetime?
						for _, refAt in pairs(otherVar.ReferenceLocationList) do
							if refAt >= var.BeginLocation and refAt <= var.ScopeEndLocation then
								-- Collide
								otherVar.UsedNameArray[i] = true

								break
							end
						end
					elseif otherVar.Scope.Depth > var.Scope.Depth then
						-- Check Case 2
						-- The other var is at a greater depth, see if any of the references
						-- to this variable are in the other var's lifetime.
						for _, refAt in pairs(var.ReferenceLocationList) do
							if refAt >= otherVar.BeginLocation and refAt <= otherVar.ScopeEndLocation then
								-- Collide
								otherVar.UsedNameArray[i] = true

								break
							end
						end
					else --otherVar.Scope.Depth must be equal to var.Scope.Depth
						-- Check case 1
						-- The two locals are in the same scope
						-- Just check if the usage lifetimes overlap within that scope. That is, we
						-- can shadow a local variable within the same scope as long as the usages
						-- of the two locals do not overlap.
						if var.BeginLocation < otherVar.EndLocation and var.EndLocation > otherVar.BeginLocation then
							otherVar.UsedNameArray[i] = true
						end
					end
				end
			end
		else
			-- This is a global var, all other globals can't collide with it, and
			-- any local variable with a reference to this global in it's lifetime
			-- can't collide with it.
			for _, otherVar in pairs(allVariables) do
				if not otherVar.Renamed then
					if otherVar.Type == 'Global' then
						otherVar.UsedNameArray[i] = true
					elseif otherVar.Type == 'Local' then
						-- Other var is a local, see if there is a reference to this global within
						-- that local's lifetime.
						for _, refAt in pairs(var.ReferenceLocationList) do
							if refAt >= otherVar.BeginLocation and refAt <= otherVar.ScopeEndLocation then
								-- Collide
								otherVar.UsedNameArray[i] = true

								break
							end
						end
					else
						assert(false, "unreachable")
					end
				end
			end
		end
	end
-- --
-- print("Total Variables: "..#allVariables)
-- print("Total Range: "..rootScope.BeginLocation.."-"..rootScope.EndLocation)
-- print("")
-- for _, var in pairs(allVariables) do
-- 	io.write("`"..var.Name.."':\n\t#symbols: "..#var.RenameList..
-- 		"\n\tassigned to: "..tostring(var.AssignedTo))
-- 	if var.Type == 'Local' then
-- 		io.write("\n\trange: "..var.BeginLocation.."-"..var.EndLocation)
-- 		io.write("\n\tlocal type: "..var.Info.Type)
-- 	end
-- 	io.write("\n\n")
-- end
-- -- First we want to rename all of the variables to unique temoraries, so that we can
-- -- easily use the scope::GetVar function to check whether renames are valid.
-- local temporaryIndex = 0
-- for _, var in pairs(allVariables) do
-- 	var:Rename('_TMP_'..temporaryIndex..'_')
-- 	temporaryIndex = temporaryIndex + 1
-- end
-- For each variable, we need to build a list of names that collide with it
--
--error()
end
```

## 压缩效果

dlfmt 压缩只是单纯压缩缩进，不会做修改变量名的额外操作。为了 debug 方便，一些换行会被保留。注释则会全部删去。

以下为`lua-minify`的一个代码片段压缩后的效果：

```lua
local function MinifyVariables_2(globalScope,rootScope)
local globalUsedNames={}
for kw,_ in pairs(Keywords) do
globalUsedNames[kw]=true
end
local allVariables={}
local allLocalVariables={}
do
for _,var in pairs(globalScope) do
if var.AssignedTo then
table.insert(allVariables,var)
else
globalUsedNames[var.Name]=true
end
end
local function addFrom(scope)
for _,var in pairs(scope.VariableList) do
table.insert(allVariables,var)
table.insert(allLocalVariables,var)
end
for _,childScope in pairs(scope.ChildScopeList) do
addFrom(childScope)
end
end
addFrom(rootScope)
end
for _,var in pairs(allVariables) do
var.UsedNameArray={}
end
table.sort(allVariables,function(a,b)
return #a.RenameList<#b.RenameList
end)
local nextValidNameIndex=0
local varNamesLazy={}
local function varIndexToValidVarName(i)
local name=varNamesLazy[i]
if not name then
repeat
name=indexToVarName(nextValidNameIndex)
nextValidNameIndex=nextValidNameIndex+1
until not globalUsedNames[name]
varNamesLazy[i]=name
end
return name
end
for _,var in pairs(allVariables) do
var.Renamed=true
local i=1
while var.UsedNameArray[i] do
i=i+1
end
var:Rename(varIndexToValidVarName(i))
if var.Scope then
for _,otherVar in pairs(allVariables) do
if not otherVar.Renamed then
if not otherVar.Scope or otherVar.Scope.Depth<var.Scope.Depth then
for _,refAt in pairs(otherVar.ReferenceLocationList) do
if refAt>=var.BeginLocation and refAt<=var.ScopeEndLocation then
otherVar.UsedNameArray[i]=true
break
end
end
elseif otherVar.Scope.Depth>var.Scope.Depth then
for _,refAt in pairs(var.ReferenceLocationList) do
if refAt>=otherVar.BeginLocation and refAt<=otherVar.ScopeEndLocation then
otherVar.UsedNameArray[i]=true
break
end
end
else
if var.BeginLocation<otherVar.EndLocation and var.EndLocation>otherVar.BeginLocation then
otherVar.UsedNameArray[i]=true
end
end
end
end
else
for _,otherVar in pairs(allVariables) do
if not otherVar.Renamed then
if otherVar.Type=='Global' then
otherVar.UsedNameArray[i]=true
elseif otherVar.Type=='Local' then
for _,refAt in pairs(var.ReferenceLocationList) do
if refAt>=otherVar.BeginLocation and refAt<=otherVar.ScopeEndLocation then
otherVar.UsedNameArray[i]=true
break
end
end
else
assert(false,"unreachable")
end
end
end
end
end
end
```

## 插件支持

在 vscode 中搜索插件：`dlfmt`。

