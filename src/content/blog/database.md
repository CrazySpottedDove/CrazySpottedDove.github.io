---
title: 数据库
description: 数据库笔记
pubDate: 2025-02-17
updatedDate: 2025-02-17
tags: ["database"]
category: "课程笔记"
---
## Introduction

### 测试与评分

- 作业 10%
- 小测 10%
- 实验 30%
- 期末考 50%

期末考允许带一张 A4 纸。

### 传统数据库生态的四种角色

- DBMS 开发者：高水平计算机专家，开发标准化、产品化的数据库管理系统
- 系统集成商：普通编程人员，基于 DBMS 开发各类信息化应用系统
- 数据库管理员 DBA：运维人员，使用运维工具维护数据库管理系统
- 最终用户：业务专家，在各类业务场景中使用系统。

### 模型

- 对数据语义的抽象产生了关系数据模型
- 对业务逻辑的抽象产生了事务处理模型

数据库的三大成就是：关系模型、事务处理、查询优化。

### 什么是数据库系统

*数据库*是长期存储在计算机内的、大规模的、相互联系的、可共享的数据集合。

*数据库管理系统*(DBMS) 是数据库 + 用于管理数据库的程序。

> 有时我们会直接把数据库管理系统说成数据库。

### 学习什么

- 数据库的建模和设计——从现实中抽象
- 编程——使用数据库，学会 SQL 语言
- 实现 DBMS —— DBMS 如何工作、设计

### DBMS 的特征

- 数据管理的效率和可拓展性(scalability)
- 减小开发时间
- 数据独立性
- 数据完整性(integrity)与安全性
- 并发访问(concurrent access)和鲁棒性(robustness)

> 鲁棒性：稳健性、健壮性

### 文件系统的问题

在数据库系统出现之前，已经有了文件系统。然而，文件系统具有如下问题：

- 数据冗余(redundancy)和不一致(inconsistency)——文件格式非常多
- 访问数据困难——需要用新的程序来执行新的任务
- 数据隔离(isolation)——不同文件和不同格式，难以检索(retrieve)和分享
- 完整性约束还需要程序来完成，难以添加和修改约束
- 更新没有原子性(atomicity)
- 不容易被多个用户并发访问
- 安全问题

> 原子性：一个事务中的所有操作要么全部成功，要么全部失败回滚，不会结束在中间某个环节

这些问题可以借助数据库来解决。

### 数据的抽象等级

不同对数据库的使用方法需要不同等级的抽象。

- Physical Level: 描述一个 record 如何被存储
- Logical Level: 描述存储在数据库中的数据以及这些数据之间更高级的关系
- VIEW Level: 通过应用程序来显示某些数据的细节（可能隐藏一些细节）

#### 物理层的独立性

物理层实现的改变，不影响上层对它的使用。

> DBMS 最重要的优势之一

#### 逻辑层的独立性

数据库的逻辑结构发生变化时，应用程序无需修改。

> 这个较难实现

### DB 语言

- 数据定义语言(DDL)：指明结构
- **数据操纵语言(DML)**：增删改查。

> M: Manipulation

- 数据控制语言(DCL)：安全性相关。

SQL = DDL + DML + DCL

## 关系模型 Relational Model

### 六大基本操作

在关系代数中，有六个基本操作：

- 选择 SELECT，把表中符合某些条件的数据找出来，形成一个新的表。

> 记作 $\sigma_{p}(r)$，此处 $p$ 为筛选条件， $r$ 为表格。

- 投影 Project，它是一种纵向操作，提取一张表中的某些属性形成一个新的表，并合并其中重复的行。

> 记作 $\Pi_{array}(r)$，$array$ 是一个属性数组。

- 并 UNION，合并两张拥有相同属性名的表，并合并其中重复的行。

> 记作 $a \cup b$

- 集合差 SET Difference，在原表中去掉另一张表中已存在的行。

>记作 $a-b$

- 笛卡尔积 Cartesian product，对两个拥有不同属性的表操作，返回由各自的行的全部自由组合 collect 成的新表。

>记作 $a\times b$

- 重命名 Rename，重命名一张表里的属性名字。

>记作  $\rho_{R(A,B,\ldots)}(r)$，意为把表 $r$ 重命名为 $R$，并且把它的属性重命名为 $A,B,\ldots$

所有其它操作都可以表示成这六个基本操作的组合。

例如交操作，就可以表示成 $r∩s=r-(r-s)$，即用两次集合差实现。

### 四大常见操作

- 交 SET Intersection，提取两张表中相同的行。

> $$
> a\cap b=r-(r-s)
> $$

- 自然连接 Natural JOIN，连接两张表，保留其中公共属性相等的行。

> 例如， 对于表 $r(A,B),s(B,C)$，有
> $$
> r \JOIN s = \Pi_{A,B,C}\Bigl(\sigma_{r.B=s.B}(r \times s)\Bigr)
> $$
>
> theta 连接:先做笛卡尔积，然后做条件为 $\theta$ 的选择.

- 除 Division，首先舍弃除数表中所有被除数表不拥有的属性，然后返回一张最大的表，使得它与作为除数的表的笛卡尔积是被除的表的子集。

> 例如，对于表 $r(A,B),s(B)$，有
> $$
> r \div s = \{\, a \in \Pi_{A}(r) \mid \forall b \in s,\; (a,b) \in r \,\}
> $$

- 赋值 Assignment，把一个运算的结果赋给临时变量。

### 拓展操作

- 广义投影 Generalized Projection，允许把投影的属性数组替换成属性函数数组
- 聚合操作 Aggregate Functions AND Operations，实现取平均、最大值、最小值、求和、计数。

> 记作
> $$
> G_1,G_2,\ldots G_n\ {\Large g}_{f_1(R_1),f_2(R_2),\ldots f_n(R_n)}(r)
> $$
> 其中 $r$ 为表格，$f_1,f_2\ldots f_n$ 为聚合函数， $R_1, R_2,\ldots R_n$ 为 $r$ 的属性， $G_1,G_2,\ldots G_n$ 表示按照这些属性来聚合(可以为空)

### 数据库的修改

无非就是增删改的操作，我们用符号来表达它们。

- Deletion $A \leftarrow A-\sigma_{a=sth}(A)$
- Insertion $A \leftarrow A ∪ {(element_1,...element_n)}$
- UPDATE $A \leftarrow \Pi_{f(a_1),f(a_2),...f(a_n)}$

## SQL

### Data Definition Language

#### 建立表格

```sql
CREATE TABLE branch(
                    branch_name   char(15) NOT NULL,
                    branch_city    varchar(30),
                    assets    numeric(8, 2),
                    PRIMARY KEY (branch_name)
                );
```

支持使用 `super KEY`, `candidate KEY`, `PRIMARY KEY` 来指定键。

支持的数据类型：

- `char(n)`: 定长字符串。
- `varchar(n)`: 不定长字符串， `n` 为最大值。
- `int`: 整数，最大值视机器而定。
- `smallint`: 小整数。
- `numeric(p, d)`: 固定位数的数字，精度为 `p`，保留到 `d` 位十进制小数。
- `real, double precision`: 浮点数。
- `float(n)`: 至少 `n` 位精度的浮点数。
- `date`: 如 `2007-2-27`
- `Time`: 如 `11:18:16`
- `timestamp`: 如 `2011-3-17 11:18:16`

所有的数据类型都允许 `NULL`。

在建表时，我们可以添加完整性约束 Integrity Constraints，令一些属性必须满足一定的规则，如：

```sql
-- inside CREATE TABEL

-- 不可以是 NULL
branch_name   char(15) NOT NULL
-- 指定为主键
PRIMARY KEY (id)
-- 另一种方法
int id PRIMARY KEY
-- 添加检查条件
CHECK (age >= 0)
```

#### 删除表格

```sql
DROP TABLE some_table;
```

#### 编辑表格

添加一行

```sql
ALTER TABLE some_table ADD some_attribute some_domain;
ALTER TABLE some_table ADD (attribute_n domain_n, ... attributen_n domain_n);
```

添加一列

```sql
-- 所有的已有的行的新的 attribute 会被赋为 NULL
ALTER TABLE some_table ADD some_attribute some_domain_type;
```

删除一列

```sql
-- 有些数据库是不支持删除一个 attribute 的操作的
ALTER TABLE some_table DROP some_attribute;
```

修改列的定义

```sql
-- 修改了 branch_name 的数据类型，然后让 assets 不允许 NULL
ALTER TABLE branch MODIFY (branch_name char(30), assets NOT NULL);
```

建立索引。被建立索引后的字段查询效率可以提升。

```sql
CREATE INDEX some_index ON some_table (some_attribute);

-- 建立联合索引，提升同时涉及 attribute_1 和 attribute_2 的查询效率
CREATE INDEX somes_index ON some_table (attribute_1, attribute_2);

```

建立唯一索引。唯一索引保证了不出现重复值，实际上是指定了一个 `candidate KEY` 。

```sql
CREATE UNIQUE INDEX unique_index ON some_table (some_attribute);

```

删除索引

```sql
DROP INDEX some_index;
```

### 基础 Basic Structure

#### SELECT

```sql
SELECT a_1, a_2, ... a_n FROM r_1, r_2, ... r_n WHERE some_predication;
```

这和
$$
\Pi_{a_1,a_2,\ldots,a_n}(\sigma_{\text{SOME\_predication}}(r_1\times r_2\times\ldots\times r_m))
$$
等价。

sql 对大小写不敏感，但是不允许名称中使用 `-`。

sql 允许表中出现重复的 DOMAIN。因此，我们在 `SELECT` 的时候可以决定是否查询重复的 DOMAIN：

```sql
-- 查询全部的 DOMAIN，ALL 是默认的
SELECT ALL attr FROM rel;
-- 查询全部的 DOMAIN, 但是舍弃其中的重复部分
SELECT DISTINCT attr FROM rel;
```

可以使用通配符查询全部的属性

```sql
SELECT * FROM some_table
```

允许在选择子句中使用 `+,-,*,/`，这可以让返回的值为运算后的结果。

```sql
SELECT a_1, a_2, a_3*100 FROM some_table
```

`WHERE` 子句指明了筛选的条件：

```sql
SELECT loan_number
FROM loan
WHERE branch_name = 'Perryridge' AND amount > 1200;
```

`WHERE` 子句允许使用逻辑连接词 logical connectives `AND, OR, NOT`，同时提供了比较运算符 `BETWEEN` 来方便地表示范围

```sql
SELECT loan_number
FROM loan
WHERE amount BETWEEN 90000 AND 100000;
-- 等价于 WHERE amount >= 90000 AND amount <=100000
```

当我们从多张表中选择，且其中出现了同名属性时，有必要使用前缀来区分它们

```sql
-- loan(loan-number, branch-name, amount)
-- borrower(customer-name, loan-number)
SELECT customer_name, borrower.loan_number, amount
FROM borrower, loan
WHERE borrower.loan_number = loan.loan_number AND branch_name = 'Perryridge';

```

#### 重命名

sql 允许为关系和属性重命名。重命名方法为： `old_name AS new_name`。其中， `AS` 也可以用 `=` 替代。

```sql
SELECT some_attr AS new_name FROM some_table
```

 `AS` 子句也可以用来作为一个中间变量名，用来简化 `sql` 语句的书写

 ```sql
--  此处 AS 是允许省略的
SELECT customer_name, T.loan_number, S.amount
FROM borrower AS T, loan AS S
WHERE T.loan_number = S.loan_number;
 ```

通过重命名，我们还可以实现一张表中同一属性的自比较

```sql
SELECT DISTINCT T.branch_name
FROM branch AS T, branch AS S
WHERE T.assets > S.assets AND S.branch_city = 'Brooklyn';
```

#### 字符串匹配

`sql` 允许使用字符串匹配。它提供了以下符号

- `%` 匹配所有的子字符串
- `_` 匹配所有的字符

我们于是可以实现一些模糊查询：

```sql
SELECT customer_name
FROM customer
WHERE customer_name LIKE '%鸠%';
```

当需要匹配的字符中出现了 `%,_`，需要进行转义：

```sql
-- 指定转义字符为 '\'
LIKE 'Main\%' ESCAPE '\'
```

另外，还有如下操作：

- 字符串连接 `||`

```sql
SELECT '客户名=' || customer_name
FROM customer;
-- 获得的 DOMAIN 类似于
-- 客户名=张三
-- 客户名=李四
-- 客户名=王五
```

- 大小写转换 `lower(), upper()`
- 计算字符串长度和提取子字符串，不同的数据库语法可能不同

#### 对行排序

使用 `ORDER BY` 来排序。

```sql
SELECT DISTINCT customer_name
FROM borrower A, loan B
WHERE A.loan_number = B.loan_number AND branch_name = 'Perryridge'
ORDER BY customer_name;
-- 默认按升序排序
-- 如果需要降序，在后面加上 DESC
-- ORDER BY customer_name DESC
```

#### 重复 Duplicates

实际应用中，选择、投影和笛卡尔积操作是允许重复的行的。当不希望有重复时，使用关键词 `DISTINCT`。

下面举例说明重复的行为。对于
$$
\begin{align*}
    r_1(A,B)&={(1,a),(2,a)}\\
    r_2(C)&={(2),(3),(3)}
\END{align*}
$$
有
$$
\begin{align*}
\Pi_B(r_1)&={(a),(a)}\\
\Pi_B(r_1)\times r_2&={(a,2),(a,2),(a,3),(a,3),(a,3),(a,3)}
\END{align*}
$$

### 集合运算 SET Operations

在 `sql` 中，可以使用 `UNION`(并), `INTERSECT`(交), `EXCEPT`(减)来实现集合运算。

所有这些集合运算都会自动剔除重复部分。如果需要保留重复部分，需要在后面添加关键词 `ALL`。

![alt text](<../../../assets/mdPaste/database/屏幕截图 2025-03-03 130315.png>)

这可以让我们很容易地处理多个表中的同一属性

![alt text](../../../assets/mdPaste/database/image.png)
![alt text](../../../assets/mdPaste/database/image-1.png)

对于这些命令的支持也视数据库不同而定。有些数据库，比如 `SQL Server 2000`，就不支持 `INTERSECT, EXCEPT`。

### 聚合函数 Aggregate Functions

聚合函数接受一个列，返回对应的值：

- `avg(col)`
- `min(col)`
- `max(col)`
- `sum(col)`
- `count(col)`

在使用聚合函数的时候，往往需要使用 `GROUP BY` 来指定根据什么聚合。

比如说，对于表格 `account(account_number, branch_name, balance)`，我想要找到每一个 `branch_name` 对应的平均 `balance`，就需要这么做：

```sql
-- 聚合函数后面的部分指定了新的属性名
SELECT branch_name, avg(balance) avg_bal
FROM account
GROUP BY branch_name;
```

可能的结果如：

![alt text](../../../assets/mdPaste/database/image-2.png)

借助 `HAVING` 子句，我们可以对有关聚合函数的结果进行二次筛选。

```sql
SELECT A.branch_name, avg(balance)
FROM account A, branch B
WHERE A.branch_name = B.branch_name AND branch_city ='Brooklyn'
GROUP BY A.branch_name
HAVING avg(balance) > 1200;
```

需要注意的是， `HAVING` 的筛选条件判断是在 `WHERE` 之后的，且聚合函数不可以直接在 `WHERE` 中使用。

至此，可以总结 `SELECT` 的结构了：

```sql
SELECT <[DISTINCT] c1, c2, …>
FROM <r1, …>
[WHERE <condition>]
[GROUP BY <c1, c2, …> [HAVING <cond2>]]
[ORDER BY <c1 [DESC] [, c2 [DESC|ASC], ...]>];

```

其执行顺序为

1. `FROM`
2. `WHERE`
3. `GROUP BY`
4. `HAVING`
5. `SELECT`
6. `DISTINCT`
7. `ORDER BY`

### NULL VALUES

 `NULL` 意味着一个未知或不存在的值。

- 任何 `NULL` 相关的算术运算都会返回 `NULL`。
- 任何 `NULL` 相关的比较运算都会返回 `unknown`。

下面是 `unknown` 参与逻辑运算的行为：

![alt text](../../../assets/mdPaste/database/image-3.png)

这可以简单地总结为 `true OR anything = true`, `false AND anything = false`。

当 `WHERE` 子句的计算结果为 `unknown` 时，它会被作为 `false` 处理。

我们使用 `IS NULL, IS NOT NULL` 来处理 `NULL`，而非使用 `=, !=`。

类似地，我们使用 `IS unknown` 来处理某个条件的结果为 `unknown` 的情况。

对于大多数聚合函数，它会忽略掉所有为 `NULL` 的值。如果所有的值都为 `NULL`，聚合函数也会返回 `NULL`。
> 需要注意的是，对于 `count()` 函数，它会对为 `NULL` 的行计数。
>
### 嵌套查询 Nested Subqueries

直接从实例出发吧。

#### IN

```sql
-- 使用嵌套
SELECT DISTINCT customer_name
FROM borrower
-- 反之为 NOT IN
WHERE customer_name IN (
    SELECT customer_name
    FROM depositor
);

-- 不使用嵌套
SELECT DISTINCT B.customer_name
FROM borrower B, depositor D
WHERE B.customer_name = D.customer_name
```

就结果而言，这两个操作是等价的，都是找到了既借钱又存钱的用户。然而，就过程而言，两者并不等价：

- 不使用嵌套时， `FROM borrower B, depositor D` 引入了一次昂贵的笛卡尔积操作。
- 使用嵌套时，先获得 `depositor` 中全部的 `customer_name`，然后再用它们过滤 `borrower` 表格。

>在同一 SQL 语句内，除非外层查询的元组变量引入内层查询，否则层查询只进行一次。

#### 比较

我们也可以通过嵌套来进行比较

```sql
SELECT account_number AN, balance
FROM account A
WHERE balance >=(
    SELECT max(balance)
    FROM account B
    WHERE A.branch_name = B.branch_name
);
```

这里可能比较令人费解。我们具体分析它如何工作：

1. 外部 `FROM`，定位 `account` 并重命名为 `A`
2. 外部 `WHERE`，对 `A` 遍历并判断其中的 `balance` 是否满足条件
3. 条件涉及了嵌套，于是进入内部。首先是内部 `SELECT`，再次定位 `account` 并重命名为 `B`
4. 内部 `WHERE`，对 `B` 遍历并判断其中的 `B.branch_name` 是否与外部待比较的 `balance` 所在行对应的 `A.branch_name` 相同
5. 内部 `SELECT`，收集内部 `WHERE` 中符合条件的行，并做 `max()` 聚合操作，结果与外部的 `balance` 作比较
6. 外部 `SELECT`，收集符合外部条件的行，提取其中的 `account_number` 作为 `AN` 列， `balance` 作为 `balance` 列。

实质上，就是取了 `account` 中每一个 `branch_name` 对应的 `max(balance)`，然后和对应的 `account_number` 合成一个新的表。这里较为复杂的原因是， `max()` 可以知道一组数据中最大的值是什么，但它却不会指出这个最大的值所在的行。因此，我们要先找出这些行，然后再做一次筛选。

#### SOME 和 ALL

 `SOME` 指将一个元素和一个集合中的每个元素进行比较，只要有一个为 `true`，那就为 `true`，否则为 `false`。

![alt text](../../../assets/mdPaste/database/image-4.png)

 `ALL` 指将一个元素和一个集合中的每个元素进行比较，只要有一个为 `false`，那就为 `false`，否则为 `true`。

 ![alt text](../../../assets/mdPaste/database/image-5.png)

```sql
SELECT branch_name
FROM branch
WHERE assets > ALL(
    SELECT assets
    FROM branch
    WHERE branch_city = 'Brooklyn'
);

-- 这也等价于
SELECT branch_name
FROM branch
WHERE assets >(
    SELECT max(assets)
    FROM branch
    WHERE branch_city = 'Brooklyn'
);
```

#### EXISTS

顾名思义， `EXISTS` 用于判断嵌套的 `SELECT` 结果是否不为空。它相反的操作即为 `NOT EXISTS`。

下面有一个较为复杂的例子，我们来分析一下：

假设已有表

![alt text](../../../assets/mdPaste/database/image-6.png)

我们尝试用 `sql` 语句实现数学表达式
$$
\begin{align*}
    &\Pi_{\text{customer\_name, branch\_name}}(\text{depositor}\bowtie\text{account})\\
    \div&\Pi_{\text{branch\_name}}(\sigma_{\text{branch\_city}='\text{Brooklyn}'}(\text{branch}))
\end{align*}
$$

首先，我们可以分别写出
$$
\Pi_{\text{customer\_name, branch\_name}}(\text{depositor}\bowtie\text{account})
$$
与
$$
\Pi_{\text{branch\_name}}(\sigma_{\text{branch\_city}='\text{Brooklyn}'}(\text{branch}))
$$
对应的 `sql` 表达式。

前者为

```sql
SELECT customer_name, branch_name
FROM depositor T, account R
WHERE T.account_number = R.account_number;
```

后者为

```sql
SELECT branch_name
FROM branch
WHERE branch_city = 'Brooklyn';
```

问题在于，这个除法怎么实现？

事实上，我们需要做的事情可以这样表达：

1. 对前者所有 `customer_name` 的可能值，检验包含它的所有行中的 `branch_name` 构成的集合 $A$，是否包含了后者(集合 $B$ )。
2. 收集第一步中所有成功通过检验的 `customer_name`。

这里有一个逻辑转换：检验集合 $A\supset B$ 似乎难以表达，但是它有一个等价的式子： $B-A=\emptyset$。而减法这个操作，恰恰可以用 `EXCEPT` 来表示。至于 $=\emptyset$ 的检验，则可以使用 `NOT EXISTS` 来完成。

我们首先表达这里的集合 $A$：

```sql
FROM depositor S
WHERE (
    SELECT DISTINCT R.branch_name
    FROM depositor T, account R
    WHERE T.account_number = R.account_number AND S.customer_name = T.customer_name
);
-- 这里 WHERE() 里面的 SELECT 语句的结果也就是关于 S.customer_name 的集合 A 了
```

然后就可以尝试表达减法：

```sql
FROM depositor S
WHERE(
    (
        SELECT branch_name
        FROM branch
        WHERE branch_city = 'Brooklyn'
    )
    EXCEPT
    (
        SELECT DISTINCT R.branch_name
        FROM depositor T, account R
        WHERE T.account_number = R.account_number AND S.customer_name = T.customer_name
    )
);
-- 这里 WHERE() 里面的结果也就是关于 S.customer_name 的 B - A 了
```

那么我们只要判断它是否为空，然后把为空的部分对应的 `customer_name` 收集起来就好了：

```sql
-- 收集 customer_name
SELECT DISTINCT S.customer_name
FROM depositor S
-- 判断是否为空
WHERE NOT EXISTS(
    (
        SELECT branch_name
        FROM branch
        WHERE branch_city = 'Brooklyn'
    )
    EXCEPT
    (
        SELECT DISTINCT R.branch_name
        FROM depositor T, account R
        WHERE T.account_number = R.account_number AND S.customer_name = T.customer_name
    )
);
```

#### UNIQUE

`UNIQUE` 关键词用于检验子查询中的行是否没有重复值。反之，则为 `NOT UNIQUE`。

比如说，我想要找到所有的在 Perryridge 这个 branch 中只有至多一个账号的顾客：

```sql
SELECT customer_name
FROM depositor T
WHERE UNIQUE(
    SELECT R.customer_name
    FROM account A, depositor R
    WHERE T.customer_name = R.customer_name AND R.account_number = A.account_number AND A.branch_name = 'Perryridge'
);
```

有些数据库不支持 `UNIQUE/NOT UNIQUE`，如 Oracle 8/SQL Server 7。

### 视图 Views

`VIEW` 提供了一种结构来隐藏一些数据，用于特定用户的查看。使用视图有利于保护数据的安全性，也更方便于用户的使用。

#### 建立视图

```sql
CREATE VIEW some_view AS(
    SELECT attr_1, attr_2, ... attr_n
    FROM some_table
);
-- 也可以重命名属性
CREATE VIEW some_view (new_attr_1, new_attr_2, ... new_attr_n) AS(
    SELECT attr_1, attr_2, ... attr_n
    FROM some_table
);
```

当然，这个括号里面也可以塞嵌套查询。

#### 删除视图

```sql
DROP VIEW some_view;
```

### 派生关系 Derived Relations

至此，我们没有在 `FROM` 中使用很复杂的结构。而事实上，它是可以接受一个表达式的：

```sql
SELECT TT.sno, sname, c_num
FROM (
    SELECT sno, count(cno) AS c_num
    FROM enroll
    GROUP BY sno
) AS TT, student S
WHERE TT.sno = S.sno AND c_num > 10;
```

> 不管是否被引用， `FROM` 中用表达式得到的导出表 derived TABLE 必须给出别名。

使用 `WITH` 关键字，我们可以把这个表达式单独移出去，以使结构更加清晰。

```sql
WITH TT(sno, c_num) AS
    SELECT sno, count(cno) AS c_num
    FROM enroll
    GROUP BY sno
SELECT TT.sno, sname, c_num
FROM TT, student S
WHERE TT.sno = S.sno AND c_num > 10;
```

需要注意的是， `WITH` 生成的 `VIEW` 是单独为了对应的 query 服务的，它并不能被全局使用。

### 修改数据库 Modification OF the Database

#### 删除行

```sql
DELETE FROM some_table_or_view
WHERE some_condition;
```

#### 插入行

直接插入

```sql
-- 如果少写几个属性，将会插入 NULL
INSERT INTO some_table_or_view(attr_1, attr_2, ..., attr_n)
VALUES(domain_1, domain_2, ..., domain_n);
```

使用 `SELECT` 语句的结果插入

```sql
INSERT INTO account
SELECT loan_number, branch_name, 200
FROM loan
WHERE branch_name = 'Perryridge';

```

> 在 `INSERT` 之前， `SELECT` 的结果就已经计算完毕。所以，诸如在同一个表中 `SELECT` 并插入它本身的代码是可以执行的。
>
#### 更新行

```sql
UPDATE some_table_or_view
SET attr_1 = domain_1, attr_2 = domain_2, ..., attr_n = domain_n
WHERE some_condition;
```

`CASE` 语句可以辅助 `SET` 赋值

```sql
UPDATE account
SET balance =(
    CASE
        WHEN balance <= 10000 THEN balance * 1.05
        ELSE   balance * 1.06
    END
);
```

> 值得注意的是， `VIEW` 是虚表，任何对 `VIEW` 的操作都将转化为对基表的操作。
>
> 因此， `VIEW` 的更新是受到严格限制的。只有**行列视图**，即建立在单个基本表上，且列能够对应的视图，才能够更新数据。
>
### Joined Relations

`JOIN` 接受两个表格，然后返回一个新的表格。

我们举例说明：

![alt text](../../../assets/mdPaste/database/image-11.png)

**JOIN condition** 定义了两个表格中的哪些行可以匹配。

- `NATURAL` 自然连接。比较所有同名属性，且在返回的表格中消去重名属性(见 **JOIN type** 配图)。
- `ON some_condition` 非自然连接。它容许不同名属性的比较，且返回的表格中不消去重名属性。

```sql
SELECT * FROM loan INNER JOIN borrower ON loan.loan_number = borrower.loan_number;
```

![alt text](../../../assets/mdPaste/database/image-12.png)

- `USING (common_attr_1, common_attr_2, ..., common_attr_n)` 类似于自然连接，只是仅以它列出的公共属性作为连接条件。

```sql
SELECT * FROM loan INNER JOIN borrower USING(loan_number);
```

![alt text](../../../assets/mdPaste/database/image-13.png)
**JOIN type** 定义了参与 `JOIN` 的表格中不与其它表格的任何行匹配的行会如何被处理。

- `INNER JOIN` 只输出匹配成功的行

```sql
SELECT * FROM loan NATURAL INNER JOIN borrower;
```

![alt text](../../../assets/mdPaste/database/image-7.png)

- `LEFT OUTER JOIN`

```sql
SELECT * FROM loan NATURAL LEFT OUTER JOIN borrower;
```

![alt text](../../../assets/mdPaste/database/image-8.png)

- `RIGHT OUTER JOIN`

```sql
SELECT * FROM loan NATURAL RIGHT OUTER JOIN borrower;
```

![alt text](../../../assets/mdPaste/database/image-9.png)

- `FULL OUTER JOIN`

```sql
SELECT * FROM loan NATURAL FULL OUTER JOIN borrower;
```

![alt text](../../../assets/mdPaste/database/image-10.png)

## SQL 进阶

### SQL Data Types AND Schemas

sql 允许自定义类型：

```sql
-- 创建类型
CREATE TYPE person_name AS varchar (20)
-- 删除类型
DROP type person_name
```

sql 也允许自定义域(可添加约束)

```sql
CREATE DOMAIN Dollars AS numeric(12, 2) NOT NULL;
```

另外，我们再介绍两种类型：Large-object types

- blob: binary large object
- clob: character large object

查询时，返回它们的指针而非它们本身。

```sql
CREATE TABLE students(
    sid char(10) PRIMARY KEY,
    name varchar(10),
    gender char(1),
    photo blob(20MB),
    cv clob(10KB)
);
```

### 完整性约束 Integrity Constraints

#### 域约束 DOMAIN Constraints

- `NOT NULL`
- `PRIMARY KEY`
- `UNIQUE`
- `CHECK(SOME condition)`

#### 参照完整性 Referential Integrity

~~一般来说~~，假设有表 $a,b$， $a$ 中的一个属性 $p$ 是 $b$ 中的主键，那么我们说 $p$ 是 $a$ 中的一个外键 FOREIGN KEY。此时， $a$ 被称为参照关系 REFERENCING relation， $b$ 被称为被参照关系 referenced relation。

参照关系中外键的值若不为 `NULL`，则必须在被参照关系中实际存在。

在建表时，我们这样说明参照

```sql
-- account_number 是关联 account 中 account_number 的外键
FOREIGN KEY (account_number) REFERENCES account
-- account_number1 是关联 account 中 account_number2 的外键
FOREIGN KEY (account_number_1) REFERENCES account (account_number_2)
```

参照关系会引入增删改查上的一些限制，所谓参照完整性。

继续以 $a,b$ 为例:

- 当我想要在 $a$ 中插入时，我一定要在 $b$ 中检查，确保插入的 $p$ 在 $b$ 中能够找到。
- 当我想要在 $b$ 中删除时，我一定要在 $a$ 中删除所有的包含被删除的 $p$ 的行。
- 当我想要更新 $a$ 时，我一定要检查新的 $p$ 的值在 $b$ 中能够找到。
- 当我想要更新 $b$ 时，如果修改了 $p$，要么拒绝这个更新，要么所有 $a$ 中包含原 $p$ 的行都要被更新。

为了保证上述完整性，我们可以使用 `SQL` 的级联操作 `Cascading actions`：

- `ON DELETE CASCADE`：被参照关系中的行被删除时，删除参照关系中所有引用改行的记录
- `ON UPDATE CASCADE`：被参照关系中的主键更新时，同步更新参照关系中引用该键的外键值
- `ON DELETE SET NULL`：被参照关系中的行被删除时，参照关系中对应外键变为 `NULL`
- `ON UPDATE SET NULL`：被参照关系中的主键更新时，参照关系中对应外键变为 `NULL`

> 一般来说，不建议使用 `NULL`，这容易导致参照完整性的语义更为复杂。

```sql
CREATE TABLE parent (
    id INT PRIMARY KEY
);

CREATE TABLE child (
    id INT PRIMARY KEY,
    parent_id INT,
    FOREIGN KEY (parent_id)
        REFERENCES parent(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
```

如果多个表之间存在级联外键依赖，且都设置了 `ON DELETE CASCADE`/`ON UPDATE CASCADE`，那么在链的一端执行删除或更新操作会自动传播到整个依赖链上。但如果这种级联操作中某一处导致了无法通过进一步级联解决的约束冲突，系统便会中止整个事务，所有因该事务及其级联操作所做的更改都会被回滚。

值得注意的是，参照完整性只在事务 transaction 的最后进行检查。这意味着，一些可能在中间破坏约束，但是在最后恢复约束的操作是被允许的。

#### 断言 ASSERTION

断言包含一个必须始终被满足的条件。

```sql
CREATE ASSERTION some_assertion_name
    CHECK some_condition;
```

在建立一个断言后，每一次可能与断言条件冲突的更新都会被检测。如果断言条件不符合，就会汇报错误。
> 这些检测有可能引入很高的开销，因此应慎用

比如说，我们希望约束每一个银行分行的总 loan 要小于它的总 balance，那么就可以有：

```sql
CREATE ASSERTION sum_constraint CHECK(
    NOT EXISTS(
        SELECT *
        FROM branch B
        WHERE(
            SELECT sum(amount)
            FROM loan
            WHERE loan.branch_name = B.branch_name
        ) > (
            SELECT sum(balance)
            FROM account
            WHERE account.branch_name = B.branch_name
        )
    )
);
```

这里使用了逻辑
$$
\forall xP(x)=(\lnot\exist x)(\lnot P(x))
$$

#### 触发器 TRIGGER

触发器是一段会在对数据库进行一定修改时自动触发的指令。我们需要明确触发器的触发条件和行为。

我们从一个实例出发：假设我们不允许一个负存款用户，而是希望把存款归零，然后把负数部分变成贷款。此时，触发器的触发条件就是某次更新使得存款变成负数。

```sql
-- loan(loan_number, branch_name, amount)
-- borrower(customer_name, loan_number)
-- account(account_number, branch_name, balance)
-- depositor(customer_name, account_numeber)

-- 创建一个叫做 overdraft_trigger 的触发器
CREATE TRIGGER overdraft_trigger
    -- 在对 account 更新后触发
    AFTER UPDATE ON account
    -- 命名被更新的行为 nrow
    REFERENCING NEW ROW AS nrow
    -- 指定每更新一行就触发一次
    FOR EACH ROW
    -- 指定只有更新的行的 balance < 0 才触发后续行为
    WHEN nrow.balance < 0
-- 标志触发器行为开始，atomic 表明触发器内部所有操作视为一个原子操作
BEGIN ATOMIC
    -- 将负余额的账户对应存款人信息插入到 borrower 表中
    INSERT INTO borrower (
        SELECT customer_name, account_number
        FROM depositor
        WHERE nrow.account_number = depositor.account_number
    );

    -- 将负余额变成贷款信息插入到 loan 表中，贷款金额为负余额的绝对值
    INSERT INTO loan
    VALUES (
        nrow.account_number,
        nrow.branch_name,
        -nrow.balance
    );

    -- 更新 account 表，将余额置零
    UPDATE account
    SET balance = 0
    WHERE account.account_number = nrow.account_number;
END;
```

在上面的代码中，引起触发器的事件为 `AFTER UPDATE ON account`。共有三种可用的触发事件:

- `INSERT`
- `DELETE`
- `UPDATE`

其中， `ON UPDATE` 这个触发事件可以被限制到特定属性的更新上，如上面就可以改成 `AFTER UPDATE OF balance ON account`。

对于行级别的触发器，参照有如下选择：

- 对于删除或更新，可使用 `REFERENCING OLD row AS some_name`
- 对于插入或更新，可使用 `REFERENCING NEW row AS some_name`

对于指令级别的触发器(`FOR EACH statement`)，参照则有如下选择：

- 对于删除或更新，可使用 `REFERENCING OLD TABLE AS some_name`
- 对于插入或更新，可使用 `REFERENCING NEW TABLE AS some_name`

上面的 `TABLE` 都只包含被改变的行。对于需要改变大量的行的操作，指令级别的触发器更有效率。

我们有时可能希望在一些操作发生时，可以调用数据库外部的一些命令。遗憾的是，触发器只对数据库内部生效，无法直接调用外部命令。

一个 workaround 是，我们在需要调用外部命令时，就在一张特定的表格中添加一行，代表一些操作。然后，作为通讯方式，让一个独立的外部进程轮询这个表格。一旦发现有待执行的操作，就执行它。执行完对应操作后，再把记录删除。

### 授权 Authorization

数据库安全性主要是防止恶意攻击者窃取或更改数据。它有以下层面：

- 数据库系统级别: **认证 (Authentication)** 和 **授权 (Authorization)**

  数据库通过验证用户身份（认证）和限制用户的权限（授权），确保只有被允许的用户才能访问或修改特定数据。

- 操作系统级别: 数据库依赖操作系统提供的安全机制

  只有拥有操作系统超级用户权限的用户才能对数据库数据进行任意操作，因此必须保证操作系统安全，防止超级用户滥用权限。

- 网络级别: 防止数据窃听和身份冒充

  使用加密技术保护网络传输的数据，防止未授权用户窃取信息（窃听）或冒充授权用户（伪装）。

- 物理级别: 保护数据库服务器的物理安全

  防止未经授权的物理访问，比如通过锁门、监控、防火措施以及防灾方案（如防水、防火、灾备恢复等）保护数据。

- 人员级别: 用户管理和安全意识培训

  严格筛选有权限访问数据库的用户，并对他们进行密码选择和保密方面的培训，防止内部用户失误或成为攻击目标。

**授权**是保护数据库安全的重要方式。以下列举了授权的一些形式：

#### 针对数据库部分内容的授权

- **读取授权 (Read authorization)**
  允许用户读取数据库中的数据，但不允许对数据进行修改。

- **插入授权 (Insert authorization)**
  允许用户向数据库中插入新数据，但不允许修改已经存在的数据。

- **更新授权 (Update authorization)**
  允许用户修改已有数据，但不允许删除数据。

- **删除授权 (Delete authorization)**
  允许用户删除数据库中的数据。

#### 针对数据库模式修改的授权

- **索引授权 (Index authorization)**
  允许用户创建和删除数据库中的索引，提高查询效率。

- **资源授权 (Resources authorization)**
  允许用户创建新的关系（表格），扩展数据库资源。

- **更改授权 (Alteration authorization)**
  允许用户添加或修改现有关系中的属性（字段）。

- **删除关系授权 (Drop authorization)**
  允许用户删除整个关系（表格），从而修改数据库的结构。

可以只赋予用户视图权限，而不对构成视图定义的底层关系进行授权。也就是说，视图可以充当一个安全层，屏蔽底层表中的敏感数据。

视图通过隐藏没必要展示给用户的数据，既简化了系统的使用，也增强了安全性。

举个例子，银行职员只需要知道银行的用户名，不需要知道银行具体的存款信息，那么就可以建立一个只包含 `customer_name` 的视图 `cust_loan`。

在查询视图时，查询处理器 query processor 首先检查查询者对视图的访问权限。然后，视图根据其定义被展开成对原表的查询操作。

- 视图不创建实际数据，因此创建视图不需要资源授权。
- 视图的创建者只继承他对构成视图的基础表上已有的权限。

#### 权限图

为了直观地展示权限情况，我们可以使用权限图 authorization graph:

![alt text](mdPaste/database/image.png)

这张图中，DBA 即 database administrator，每一条单向边 $a\to b$ 代表着 $a$ 为 $b$ 赋予了权限。

对于权限图，有如下约束条件：

- 所有路径都应该以 DBA 为起点。因此，不允许出现循环授权，因为这样会出现回避了 DBA 的循环路径。
- 当一个用户失去了权限，它赋予给其它用户的权限也随之失效。

#### `grant` 语句

在 `SQL` 中，可以选择的权限如下：

- `select`：允许对表进行读有关操作
- `insert`：允许插入行
- `update`：允许使用 `update` 语句来更新
- `delete`：允许删除行
- `references`：允许在创建表时声明外键
- `all privileges`：提供全部权限

`GRANT` 指令格式如下：

```sql
GRANT some_privileges on some_table_or_view to some_users;
-- some_users 也可以被设置成 public，这样会把权限赋给所有用户
```

使用 `grant` 命令的用户必须已经拥有对应表格或视图的权限。如果希望被赋予权限的用户也拥有把权限传递给别的用户的权限，可以在命令的最后面加上 `with grant option`

```sql
grant SELECT on branch to user1 with grant option;
```

#### `role`

我们可能希望规定一些权限的范式，比如说高级员工，外包员工，分别拥有对应的权限。使用 `role` 可以实现创建一类用户拥有特定权限的用户，以便权限管理。

就像用户一样，我们可以用 `grant` 为 `role` 赋予权限。通过将 `role` 赋值给用户的方式，就可以让用户的权限和 `role` 的一致。

```sql
create role student;
create role teacher;
grant all privileges on grade to teacher;
grant SELECT on grade to student;
grant student to student_a;
-- 如果你想的话，可以把一个 role grant 给另一个 role。
-- grant student to teacher;
```

#### `revoke` 语句

`revoke` 语句可以用来撤回权限。

```sql
revoke some_privileges on some_table_or_view
from some_users [restrict | cascade]
-- for example
revoke select on grade from student_a cascade;
```

其中，撤回一个用户的权限时，有可能引起其下游的权限也被撤回，`cascade` 关键词就用于触发这些撤回。如果不希望撤回下游权限，想把操作范围限制起来，就使用 `restrict`。如果级联的撤回是被要求的，那么使用 `restrict` 时会失败。

当 `revoke` 中的 `some_users` 被设置成 `public` 时，所有先前因此默认获得了对应权限的用户会失去这些权限，而通过 `grant` 语句明确被赋予权限的用户不会失去这些权限。

如果一个用户同时被多个用户授权，那么其中一个用户对他撤回权限，在效果上可能并不能让他失去对某些表格或视图的权限。

#### 局限

`sql` 不支持对某行的授权。比如说，无法限制用户只能查询成绩表中自己的成绩。这种限制往往通过应用程序代码来实现。

#### 审计日志 Audit Trails

审计日志是对“谁干了什么”的记录日志。

- 针对用户审计

  ![alt text](mdPaste/database/image-1.png)
- 针对对象审计

  ![alt text](mdPaste/database/image-2.png)

审计结果只对管理员可见。

### Embedded SQL

SQL 本身在计算、资源管理等方面存在一些局限，不适合单独完成所有编程任务。为了弥补这些不足，SQL 标准定义了将 SQL 嵌入到多种编程语言中的机制。

我们可以在诸如 Pascal、PL/I、Fortran、C、Cobol 等宿主语言中嵌入 SQL 查询或语句。通过这种方式，可以利用宿主语言进行更复杂的计算和资源管理。其中，SQL 负责数据操作，而宿主语言则处理逻辑控制、流程和复杂计算。

嵌入式 SQL 语句通常由特殊的标识符告诉预处理器，这部分代码需要交由数据库处理。例如，在大多数语言中使用的格式如下：

```sql
-- 依具体语言而定
EXEC SQL <embedded SQL statement> END_EXEC
```

## 实体-关系模型 Entity-Relationship Model

### 实体集 Entity Sets

一个**实体集**（Entity Set）指的是具有相同性质、共享相同属性的一类实体的集合。

*例如：所有学生、所有公司、所有树木、所有节假日、所有客户、所有账户和所有贷款。*

> 一个实体集包含多个同类的实体。
>
#### 实体 Entity

现实世界可以建模为实体的集合。

实体（Entity）：存在且可与其他对象区分开的对象。实体可以是具体的，也可以是抽象的。

*例如：具体的学生、公司、事件、工厂等。*

#### 属性 Attribute

一个实体由一组属性来表示，即所有同一实体集的成员所具有的描述性特征。

- **域 (Domain)**

  也称为值集，指的是每个属性允许的取值集合。

- **属性类型**：
  - **简单属性与复合属性(Simple & Composite Attributes)**

    简单属性指不能再分解的属性，如 `sex`、`name`；

    复合属性由多个简单属性组成。
  - **单值属性与多值属性(Single-valued & Multi-valued Attributes)**

    单值属性每个实体仅有唯一一个值；

    而多值属性可能包含多个值，例如：多值属性 `phone-numbers`（多个电话号码）。
  - **派生属性(Derived Attributes)**

    可由其他属性计算得出，例如根据出生日期计算得到的 `age`（年龄）。

### 关系集 Relationship Sets

#### 关系 Relationship

关系是两个不同类实体之间的关联。

关系集是多个同类关系的集合。关系集表示了两个或多个实体集之间的关联。

从形式上来说，一个关系集是一个数学关系，它涉及 n (n ≥ 2) 个实体，每个实体均取自相应的实体集。具体地，设有 n 个实体集 E₁, E₂, …, Eₙ，则一个关系集 R 是笛卡尔积
$$
E₁ \times E₂ \times \cdots \times Eₙ
$$
的一个子集，即
$$
R \subseteq E₁ \times E₂ \times \cdots \times Eₙ.
$$
其中，每个元组 $(e₁, e₂, …, eₙ) \in R$ 表示实体 $e₁, e₂, …, eₙ$ 之间存在某种特定的联系。

> 关系集中的实体集不必都是唯一的，比如说，可以只出现两个 $E_1$，这种情况叫做 Recursive relationship set 自环关系集。

关系集也可以拥有属性。

![alt text](mdPaste/database/image-3.png)

#### 度 Degree

关系集的度指参与关系的实体集的个数。如果一个关系集的度为 $2$，那么说这个关系集是 binary 的。大多数关系集都是 binary 的。

#### 映射基数 Mapping Cardinalities

映射基数表达了在一个联系集中，一个实体可以和另一类实体关联的个数。

映射基数在描述二元关系集时尤为有用。对于一个二元关系集，其映射基数必然属于以下类型之一：

- **一对一 (1 : 1)**
    每个实体最多只与另一实体集中的唯一一个实体相关联。

    *例如：就任总统（总统与国家），每个国家只对应一位总统，每位总统对应唯一的国家。*

- **一对多 (1 : n)**
    一个实体可以关联多个另一个实体，而另一个实体通常只关联唯一的一个。

    *例如：分班情况（班级与学生），一个班级中可以有多个学生，但每个学生只属于一个班级。*

- **多对一 (n : 1)**
    与“一对多”相反，多个实体可以关联同一个实体。

    *例如：就医（病人与医生），多个病人可以由同一位医生诊治，但每个病人通常只有一个主治医生。*

- **多对多 (n : m)**
    两个实体集合中的实体可以相互存在多个关联。
    *例如：选课（学生与课程），一个学生可以选修多门课程，而一门课程也可以被多个学生选修。*

### 键 Keys

#### 实体集的键 (Keys for Entity Sets)

- **超键 (Super Key)**

  一个实体集的超键是一个或多个属性的集合，它们的值能够唯一地确定实体集中的每个实体。

- **候选键 (Candidate Key)**

  候选键是最小的超键。其大小不一定为 $1$.

- **主键 (Primary Key)**

  主键在候选键中特定选取。

---

#### 关系集的键 (Keys for Relationship Sets)

- **关系集的超键**

  参与关系集的各个实体集的主键组合构成该关系集的超键。

- **注意**

  在确定候选键时，必须结合关系集的映射基数（如 1:1、1:n、m:n）进行考虑。

  同时在存在多个候选键的情况下，应根据关系集的语义来选择合适的主键，通常要求用作键的属性不能为空且其值不应经常变化。

### E-R Diagram

E-R 图通过符号表示信息。

![alt text](mdPaste/database/image-6.png)

#### 符号

- **实体集 (Entity Sets)**
  用矩形表示。

- **关系集 (Relationship Sets)**
  用菱形表示。

- **属性 (Attributes)**
  用椭圆表示，同时：
  - **双椭圆** 表示多值属性。
  - **虚线椭圆** 表示派生属性。

- **连接**
  线条用于连接实体集与其属性，以及实体集与关系集。

- **主键属性**
  用下划线标记

E-R 图的种类多样。

![alt text](mdPaste/database/image-5.png)

#### 角色 (Roles)

- **定义**
  角色指的是实体在某个关系中所扮演的功能。例如，在“works-for”（服务于）关系中，员工可能扮演“经理”（manager）或“工人”（worker）的角色。

- **作用**
  角色标签用于明确描述实体在关系中的交互方式，从而澄清关系的语义。这些标签是可选的，但在存在歧义时能有效使模型更加清晰。

![alt text](mdPaste/database/image-4.png)

#### 基数表示

我们用连线是否拥有箭头来标志基数为 $1$ 还是 $n$。

![alt text](mdPaste/database/image-7.png)

上图是一个 one-to-many relationship，提示一个 instructor 可与多个 student 关联在一起。

#### 实体集在关系集中的参与

![alt text](mdPaste/database/image-8.png)

- **全参与 (Total Participation)** （用双线表示）
  表示实体集中的每个实体至少参与了该关系集中的一条关系。

  *例如：在 borrower 关系集中，loan 的参与是全参与，即每笔贷款都必须通过 borrower 关联到一个客户。*

- **部分参与 (Partial Participation)**
  表示某些实体可能在该关系集中完全没有任何关联。

  *例如：在 borrower 关系集中，customer 的参与是部分参与，即并非每个客户都有贷款记录。*

> 映射基数限定了一个实体在参与关联时，与另一端实体可能关联的最大数目；而全参与、部分参与则反映了参与关联的下限（0 次或至少 1 次）。

在 E-R 图中，映射基数还可以通过在关系线上标注数字来表示。一个比较好的理解方式是，上面标注的数字代表了一个实体可以参与关系的数量范围。

![alt text](mdPaste/database/image-13.png)

以上图为例， `1..1` 表示每个 `loan` 实体最少且最多参与 1 个 `borrower` 关系， `0..*` 则表示每个 `customer` 实体可参与任意个 `borrower` 关系。综合一下，就是 1 个 `customer` 可以拥有多个 `loan`。

#### 非二元关系的二元化表示

一些看似非二元的关系可能更适合用二元关系来表示。例如：

- **三元关系拆分**
  对于三元关系 `parents(he, she, child)`，它将一个孩子分别与其父亲和母亲关联，最佳做法是将其拆分为两个二元关系：
  - `father(he, child)`
  - `mother(she, child)`
  这种拆分方式允许部分信息的存在，例如只知道母亲的情况时，仍能表达有效的关联。

- **一般转换方法**

  ![alt text](mdPaste/database/image-9.png)

  通常，任何非二元关系都可以通过引入一个人工实体集来转换为二元关系的形式。具体步骤如下：
  1. 用一个新的实体集 E 替换原来位于实体集 A、B 和 C 之间的非二元关系 R。
  2. 为实体集 E 创建一个特殊的标识属性。
  3. 将 R 中原有的所有属性都添加到实体集 E 中。
  4. 对于 R 中的每个关系元组 (aᵢ, bᵢ, cᵢ)，分别创建三个新的关系集（例如 RA、RB、RC），将 aᵢ、bᵢ 和 cᵢ 与 E 相关联。

### 弱实体集 (Weak Entity Sets)

没有主键的实体集称为弱实体集。

弱实体集的存在依赖于一个标识实体集（Identifying Entity Set）的存在。

- 弱实体集必须与标识实体集通过一个**全参与、一对多**的关系集相连接，连接方向从标识实体集指向弱实体集。
- 这种标识关系在 E-R 图中通常用**双菱形**表示。

为了区分同一弱实体集中的不同实体，我们定义弱实体集中的一组属性作为判别器 discriminator/partial key。

在功能上，弱实体集的主键由两部分组成：

1. 其标识实体集的主键；
2. 弱实体集的判别器。

听起来有点抽象，看个例子。

![alt text](mdPaste/database/image-10.png)

- 弱实体集的判别器用**虚线下划线**表示。
- 标识弱实体集的标识关系使用**双菱形**来表示。
- 对于 section 这个弱实体集，其主键由标识其所属的课程和开课信息组成：
  - 主键 = (course_id, sec_id, semester, year)

> - 强实体集的主键并不会显式存储在弱实体集中，因为这一信息已经通过标识关系隐含表示了。
> - 如果将 course_id 显式存储在 section 实体集中，那么 section 就可以被看作一个强实体。但这会导致 course 与 section 之间原本通过两个实体的共有属性 course_id 隐含定义的关系被重复表达。

![alt text](mdPaste/database/image-11.png)

在这个例子中， `loan_number` 再加上对应的 `payment_number` 已经能够唯一确定一个 payment 了，因此 `payment` 的判别器就是 `payment_number`。

### Extended E-R Features

#### 实体集的层次结构(Stratum)

**特殊化 (Specialization)**是一种自顶向下的设计过程，在一个实体集中划分出与其它实体区别显著的子群。对偶地，**泛化(Generalization)**是是一种自底向上的设计过程，即将多个具有相同特征的实体集合合并为一个更高层次的实体集。

下层实体集可能拥有对上层实体集不适用的额外属性或参与特定的关系，并继承了与之关联的上层实体集中的所有属性及其关系参与。

> 上层实体集与下层实体集的关系类似于父类和子类的关系

我们可以通过定义一些条件来刻画对下层实体集的约束。我们也可以直接让用户指定哪些实体集是下层实体集。

关于一个实体是否可以同时属于一个上层实体集的多种下层实体集，有以下两种约束：

- **不相交 (Disjoint)**
  限定一个实体只能属于一个下层实体集。

  在 E-R 图中，一般在 ISA 三角形旁注明 "disjoint"。

- **可重叠 (Overlapping)**
  允许一个实体同时属于多个下层实体集。

#### 完全性约束 (Completeness Constraint)

完全性约束规定了一个高层实体集中的实体是否必须至少属于某个下层实体集：

- **完全泛化 (Total Generalization)**
  表示每个高层实体至少必须属于一个下层实体集。

- **部分泛化 (Partial Generalization)**
  表示高层实体中的实体不必一定属于任何下层实体集。

> ![alt text](mdPaste/database/image-12.png)
>
> 如这里，一个账户要么存款要么借款，而一个人可以是 customer，可以是 employee，也可以两者都不是。

#### 聚合 Aggregation

举个例子，某个员工在某个分行做某个工作，这个工作可能有个领导，也可能没有。目前，我们有一个三元关系 `work_on`，记录了员工在某个分行从事某项工作的情况。

如果我们再为了记录领导负责工作的情况，再建立一个三元关系，就会造成冗余。这时，我们引入**聚合**。

我们把 `work_on` 这个关系看成一个抽象的实体，然后再让领导实体 `manager` 和它建立新的关系。

这样，在没有冗余的前提下，可以用下面的模式来表示：

- 员工在特定分行从事特定工作的事实（由 `works-on` 关系表示）；
- 该员工、分行、工作组合可能具有一个关联的领导（利用聚合后的抽象实体与 `manages` 关系实现）。

### Design of an E-R Database Schema

怎么设计一个数据库？

1. 我们从现实世界中抽象出一个概念模型(如 E-R 图)
2. 把概念模型转换成逻辑模型(如表结构)
3. 把逻辑模型转化成物理模型

接下来，我们先讨论如何抽象概念模型。

#### 对象的处理

- 若一个对象只对其名字及单值感兴趣，则可作为属性
- 若一个对象除名字外，本身还有其他属性需描述，则该对象应定义为实体集。

> 一个对象不能同时作为实体和属性

#### 实体集与关系集的取舍

一般来说，把一个“动词”作为关系集，一个“名词”作为实体集。

除此之外，还有很多设计上的考量，如使用几元关系，使用强还是弱实体集，是否适合模块化……

### Reduction of an E-R Schema to Tables

符合 E-R 图设计的数据库都可以用表的集合表示出来。

对于一个强实体集，我们可以直接把它转化成具有对应属性的表。不过，一些特殊的属性需要注意。

- **复合属性**被展平成多个简单属性。
- **多值属性**独立建表，包含原实体集的主键和该属性，原来的多个值被分成多个行。如： `(key, [value1, value2])` 变成 `(key, value1)` 和 `(key, value2)`。

对于一个弱实体集，在转化成表的过程中，还需要将它对应的标识实体集的主键也加进来(这顺便把联系它和标识实体集的关系集也表示了)。

对于一个关系集，转换的方法依它的映射基数关系而定。

- (1:n)/(n:1)

  把关系集的属性合并到 `n` 的表中，并添加一个外键，引用 `1` 的主键。
- (1:1)
  - 可以将两个实体集合成一张表，或者在其中一张表中添加外键引用另一个实体集。
  - 若关系集有属性，也可独立成表，把两个实体集的主键放进来。
- (n:m)

  创建新的表，包含各个实体集的主键作为外键组合(通常这构成了复合主键)，也包含关系集的属性。

> 对于 Partial Participation 的关系集，转换成表后有可能产生 `null`，因为 `n` 中的一行可能没有对应到 `1` 中。

处理 Specialization/Generalization 时，有两种思路。

- 以高等级 $\to$ 低等级的顺序转化表。对于低等级的实体集，要把高等级实体集的主键加进来，然后再是自己的特殊属性。

  这样做的坏处是，当我需要获取某个实体的全部信息时，需要同时访问高等级表和低等级表。
- 直接转化所有的低等级实体集，并把高等级实体集的属性也加进来，使用高等级实体集的主键。如果 Specialization 是完全的，那么就没有必要在高等级表中存储数据。此时，它作为一个视图来工作。

  这样做的坏处是，可能带来大量的数据冗余。

### E-R 图符号汇总

![alt text](mdPaste/database/image-14.png)

![alt text](mdPaste/database/image-15.png)

## Relational Database Design
