# CRoSS CHASM：跨越复杂性鸿沟的人机协议

> **一句话**：编程的终极目标不是让 AI 代替你，而是建立一套可靠的"人机协议"。CRoSS CHASM 用三层结构——临时意图、持久宪法、执行机制——让你**跨越**鸿沟，而不是每天**重修一次桥**。

---

## 01 浪潮之下，开发者真正的焦虑

AI 编程工具像浪潮一样涌来。但很多开发者越用越累：

- AI 写的代码总是"差点意思"——风格不一致、约定不遵守、上下文丢失。
- 复杂任务一上手就开始"幻觉"。
- 项目跑了一周后，每次新对话都要重讲一遍背景。
- 在 Claude Code 里 `/clear`（清空当前会话上下文）一下，或者换个会话，前面建立的所有默契清零。

更隐蔽的焦虑是：**你怀疑自己不是在指挥 AI，而是在祈求 AI 理解你。**

问题的根源不是 AI 不够聪明，而是**协作模式错了**：

|旧模式|新范式|
|---|---|
|像聊天一样松散|像工程一样严谨|
|依赖运气和默契|依赖明确的契约|
|每次重新解释|一次声明，永久生效|
|AI 是黑箱|AI 是可控、可预测的协作者|

---

## 02 核心架构：三层飞轮

很多人把 AI 协作拆成两层——"人类意图 → AI 执行"。但这解释不了一个最常见的痛点：**为什么每次新会话都要重新讲一遍项目背景？**

> 你跨过去的不是鸿沟，是临时搭的一座浮桥。

真正能跨越鸿沟的结构需要中间一层：

```
CRoSS         临时战略意图（项目级 + 阶段级）
   ↓ 蒸馏沉淀
Constitution  持久项目宪法（一次写，永久生效）
   ↓ 被系统自动执行
CHASM         执行机制（hook、agent、技能、MCP）
```

- **CRoSS**：人的意图入口。**易失。**
- **Constitution**：把 CRoSS 中"项目永真"的部分沉淀到磁盘上。**持久。**
- **CHASM**：执行宪法的所有机制。**自动。**

### 飞轮：Constitution 既是终点也是起点

**Day-1**：CRoSS（说话）→ 蒸馏 → Constitution（写文档）→ CHASM（设置机制）

**Day-N**：

```
Constitution（自动加载）→ CRoSS（本次任务临时指令）→ CHASM（执行）
        ↑                                                ↓
        └───── 蒸馏增量（本次新决策回写宪法）────────────┘
```

> Constitution 越厚，CRoSS 越薄，CHASM 越自动。

---

## 03 CRoSS：人类的指挥台（双层）


**CRoSS**是人类智慧注入 AI 的入口。作为“架构师”，在 AI 动手前，你必须通过以下五个维度下达精确指令：

🔹**C - Context（背景）**

- **理念**：告诉 AI 我们“身在何处”。
    
- **实战**：不要只说“写个登录功能”。要说“基于现有的 Next.js 项目，使用 Supabase auth，当前目录结构是...”。
    
- **价值**：充足的 Context 是防止 AI“闭门造车”的第一道防线。
    

🔹**R - Role（角色）**

- **理念**：激活 AI 的专属专家人格。
    
- **实战**：“你是一位精通高并发架构的资深后端专家”。
    
- **价值**：瞬间拉高生成代码的专业度与词汇准确性。
    

🔹**O - Objective（目标）**

- **理念**：以终为始，明确交付物。
    
- **实战**：“我需要一份 Markdown 格式的数据库设计文档” VS “给我一个可运行的 Pull Request”。
    
- **价值**：避免 AI 生成一堆无法落地的理论代码。
    

🔹**S - Spec（规范）**

- **理念**：设定质量红线。
    
- **实战**：“所有查询必须参数化防注入”、“单函数不超过 100 行”、“必须使用 TypeScript 强类型”。
    
- **价值**：边界越清晰，AI 的产出越安全可靠。
    

🔹**S - Steps（步骤）**

- **理念**：注入思维链，分步执行。
    
- **实战**：“先分析现有代码 -> 给出 3 种方案 -> 我确认后再编写”。
    
- **价值**：驾驭大型项目开发的核心编排能力，彻底拒绝“盲写”。


在编程中，CRoSS 主要用来说清楚开发意图与计划。
它可分为两层——项目级和阶段级，两层用相同的五个维度（Context / Role / Objective / Spec / Steps），只是应用尺度不同。

|层级|产物|频率|数量|
|---|---|---|---|
|**CRoSS-Strategic**（项目级）|`master-plan.md`|项目启动一次 + 重大修订|不超过 10 个里程碑|
|**CRoSS-Tactical**（阶段级）|`phases/PN/phase-scope.md`|每个阶段启动一次|每个阶段不超过 10 个工作切片|

下面贯穿用一个统一的例子：**区域电网短期负荷预测系统**——做 24 小时滚动预测，数据来源是 SCADA 系统加气象数据加节假日表。

---

### 3.1 写 master-plan（项目级 CRoSS）

#### 3.1.1 案例与产物

启动负荷预测项目时，第一步是写 master-plan。这一步本身就是 CRoSS-Strategic：

- **Context（上下文）**：华东某省调度中心，每 15 分钟一次预测；老系统用 SARIMA 加人工规则，平均误差 5.8%；公司有 SCADA、气象、节假日数据但没整合；2 人 6 个月预算
- **Role（角色）**：资深 ML 系统架构师，懂电力业务、懂 MLOps、懂时序建模
- **Objective（目标）**：一份 master-plan.md，覆盖下面"写法分析"中的 7 项验收标准
- **Spec（规格）**：分阶段交付不是一次性大爆炸；早期用 spike（小型探索性实验）验证高风险假设；明确红线和回退路径
- **Steps（步骤）**：调研同类系统 → 列待验证假设 → 阶段划分 → 写退出门槛 → 评审

写完之后产物长这样（节选关键段落）：

```markdown
# Master Plan: 区域电网负荷预测系统

## 1. 为什么做（动机）
现有 SARIMA + 规则系统平均误差 5.8%。每降低 1 个百分点，
全省年度调峰成本节约 1.2 亿。业内 ML 系统已可达 3% 以下。

## 2. 最终状态（done state）
- 24 小时滚动预测，每 15 分钟更新一次
- 平均绝对百分比误差 ≤ 3.5%
- 推理延迟 P95 ≤ 200ms
- 节假日窗口（春节、国庆）误差 ≤ 5%
- 有可追溯的特征版本和模型版本管理
- 与现有调度系统通过 RESTful 接口对接
- 灰度上线 4 周，0 重大事故

## 3. 里程碑（不超过 10 个）

### P0: 数据 + 基线（4 周）
- 目标：完成数据接入、清洗、EDA 报告，复现 SARIMA 基线
- 退出门槛：基线模型在过去 6 个月数据上误差 5.5–6.0%，
  与生产系统输出差异在 ±0.3% 以内
- 详情：phases/P0/phase-scope.md

### P1: 模型选型 spike（3 周）
- 目标：在 LightGBM、TFT、N-BEATS 三种里选定主模型
- 退出门槛：选定模型在验证集上误差 ≤ 4.0%
- 详情：phases/P1/phase-scope.md

（P2 至 P5 略）

## 4. 关键假设（spike 验证清单）
| # | 假设 | 验证阶段 | 失败回退 |
|---|---|---|---|
| 1 | LightGBM 在时序上能跑过 SARIMA | P1 | 退回 LSTM |
| 2 | 实时特征计算延迟 ≤ 50ms | P3 | 改用预计算 |

## 5. 项目级红线
- 训练集和测试集严格按时间切分，禁止随机切分
- 所有特征必须能在生产实时计算
- 推理延迟 P95 ≤ 200ms

## 6. 反模式拦截
- 不要"顺手"把同步接口改成异步
- 不要在特征里加跨样本统计

## 7. 依赖图
P0 → P1 → P2 → P3 → P4 → P5（线性）
```

#### 3.1.2 写法分析


写完一份 master-plan 后，按下面 7 项检查它是否合格。每项对应模板里的一节：

|节|标准|自查方式|
|---|---|---|
|1. 为什么做|业务价值具体可量化；如果是重构旧失败计划，列出旧计划的结构性诊断|能不能用一句话说"做完省 X 钱 / 提速 X 倍 / 避免 Y 风险"？|
|2. 最终状态|5–7 条可观测的验收条件，每条二元可判断|"用户满意"不行；"误差 ≤ 3.5%、延迟 P95 ≤ 200ms"才行|
|3. 里程碑|不超过 10 个；每个有目标和退出门槛；退出门槛非主观|能不能让另一个工程师看着退出门槛判断"通过没通过"？|
|4. 关键假设|列出待 spike 验证的高风险假设，标明在哪个阶段验证、失败如何回退|假设之所以是假设，是因为现在还不能确定；不能确定的事必须有验证计划|
|5. 项目级红线|业务不变量、安全约束、契约硬性要求|违反会导致系统坏（不是变慢、不是丑），才算红线|
|6. 反模式拦截|AI 容易"顺手"做错的具体行为|不是抽象的"代码质量好"，是具体的"不要 X"|
|7. 依赖图|阶段之间的前置和后置关系|文字或图都行，但不能省略|

注意：1–3 节是任何 master-plan 必有的；4–7 节是大型项目可有，小项目可省。

节 4 和节 6 都是"对未来的预判"，写的时候容易混。
写的时候如果一条既像假设又像反模式，就问自己："我能不能设计一个实验让它给我是或否的答案？" 能就是关键假设，不能就是反模式。

不是每个项目都需要写完整 7 节。按规模决定：

|项目规模|写法|
|---|---|
|**小项目**（1–2 周）|只写节 1、2、3。一份不超过 100 行的 markdown 就够|
|**中项目**（1–3 个月）|写节 1–5。第 6、7 节如果没显著反模式或复杂依赖可省|
|**大项目**（3 个月以上）|写完整 7 节|

---

### 3.2 写 phase-scope（阶段级 CRoSS）

#### 3.2.1 案例与产物

进入某个阶段（比如 P2 特征工程）时，第一步是写 P2 的 phase-scope。这一步本身就是 CRoSS-Tactical：

- **Context**：基于 P0 完成的 EDA 报告（在 `phases/P0/reports/` 下），P1 已选定 LightGBM，目标产出第一版生产级特征
- **Role**：精通时序特征工程的算法师，关注样本泄漏和因果性
- **Objective**：phases/P2/phase-scope.md，包含工作切片 Δ1–Δ5 + 产出清单 + 退出 checklist
- **Spec**：禁止跨样本统计；所有特征必须能在生产实时计算
- **Steps**：列待生成特征 → 切工作切片 → 每个切片定产出和验证 → 写 checklist

写完之后产物长这样（节选）：

```markdown
# Phase 2: 特征工程

## 0. 重要警告（如有）
- 节假日特征必须考虑 2026 年表只到年底，跨年要降级处理

## 1. 目标 / 范围 / 退出门槛
- 目标：产出第一版生产级特征（约 30–40 维）
- 范围：仅时序滞后特征 + 节假日 + 气象，不做交叉特征
- 退出门槛：在 LightGBM 基线上比 P1 基线提升 ≥ 0.5 个百分点

## 2. 工具栈
- polars 0.20+（时序处理）
- feast 0.35（特征版本化）

## 3. 工作切片 Δ1–ΔN

### Δ1: SCADA 清洗（3 天）
- 目标：补缺失值、去异常、按 15 分钟对齐
- 产出：`features/scada_cleaned.parquet`
- 验证：缺失率 ≤ 0.1%，异常值（按 IQR 1.5 倍）≤ 0.5%

### Δ2: 气象回填（2 天）
（略）

### Δ3: 节假日导入（1 天）
（略）

### Δ4: 数据质量 7 项检查（3 天）
（略）

### Δ5: SARIMA 基线（5 天）
（略）

## 4. 产出文件清单
（略）

## 5. 关键设计决定 / 注意事项
（略）

## 6. 退出 checklist
- [ ] 所有 Δ1–Δ5 完成
- [ ] 退出门槛达成
- [ ] 关键设计决定全部记录到 ADR
- [ ] 已知债务全部登记到 debts.md

## 7. Sealed（阶段完成时追加）
（阶段完成才写）
```

#### 3.2.2 phase-scope 写好的五项标准

这五项是评判**整篇 phase-scope** 是否合格的标准：

1. **目标具体可验收**：节 1 的退出门槛不能是"完成特征工程"，必须是"提升 ≥ 0.5 个百分点"这种二元可判断的
2. **工作切片粒度合适**：每个切片 1–5 天可完成；少于 1 天合并、多于 5 天拆分
3. **每个切片有独立产出**：切片完成时有具体文件、模型、报告作为标志，不只是"做完了"
4. **每个切片有验证条件**：切片完成时可以二元判断是否通过
5. **退出 checklist 与 master-plan 退出门槛对齐**：phase-scope 节 6 的 checklist 的最后一条必须就是 master-plan 里这个阶段的退出门槛

什么时候合并、什么时候拆分？

|现象|处置|
|---|---|
|切片少于 1 天可完成|合并到相邻切片|
|切片超过 5 天|拆分为更小的切片，或显式标注为"高风险切片"留出缓冲|
|切片之间频繁互相依赖|提示切分维度有问题，重新切（按数据流切，不按文件切）|
|切片产出难以独立验证|切片定义不清晰，重新写产出|

#### 3.2.3 节 4 产出清单的设计原则

节 4 列出阶段全部产出文件。每一项产出都要单独通过下面五条：

1. **回答什么问题** —— 这份产出的存在理由是什么？说不清就砍掉
2. **谁来用** —— 下游消费者是谁？（下个阶段的某一步、人工评审、生产系统、还是只是 AI 自己）说不清就砍掉
3. **退出条件可量化** —— 怎么判断它"做完了"？给出二元判断条件
4. **形式匹配处理方** —— 给机器消费的产出用结构化格式（JSON / Parquet）；给人审阅的产出用 Markdown
5. **MECE（相互独立、完全穷尽）** —— 整个清单上下：没有遗漏、没有重复

这五条是针对**清单里每一项**的（micro 视角）；3.2.2 的五项标准是针对**整篇文档**的（macro 视角）。两套不冲突，各管各的。

---

### 3.3 master-plan 与 phase-scope 的衔接

#### 3.3.1 衔接关系

master-plan 是项目蓝图，phase-scope 是阶段执行手册。两者关系：

- master-plan 节 3（里程碑）的每一项**对应**一份 phase-scope.md
- master-plan 节 3 每个里程碑的**退出门槛**就是对应 phase-scope 节 6 checklist 的最后一项
- phase-scope 节 1（目标）必须**引用** master-plan 节 3 中本阶段的目标，不能擅自扩展

阶段完成时，phase-scope 节 7（Sealed）回写一段简短的 done-state 记录，作为 master-plan 该里程碑的事实凭据。下个阶段启动时，新 phase-scope 的 Context 节引用前一个阶段 Sealed 节的内容。

#### 3.3.2 一致性如何保证

衔接的一致性靠两个机制：

**机制一：phase-scope 启动时引用 master-plan**

写新 phase-scope 时，先打开 master-plan 节 3 找到对应里程碑，把它的目标和退出门槛**抄过来**作为 phase-scope 节 1 的开头。不要重述、不要改写——抄。改写会引入漂移。

**机制二：阶段完成时回写 master-plan**

阶段完成时（phase-scope 节 6 全部勾选 + 节 7 Sealed 写完），如果发现实际退出状态与 master-plan 当初设的退出门槛不一致（比如实际误差 4.2%、当初设 4.0%），先判断属于哪种情况，再决定处置。

判断的两个问题：

1. **新增工作量是否合理**——把误差从 4.2% 拉到 4.0% 还要多少人天？新增 ≤ 2 人天就能达标，是工作没做透，应该继续做；要超过 1 周才能挤出 0.2 个百分点，多半是边际收益递减——门槛定得过严。
2. **业务是否真的需要 4.0%**——回到 master-plan 节 1 看为什么定的 4.0%。如果是从业务价值倒推的硬目标（比如"低于 4.0% 就追不平老系统"），不能松；如果是当初拍脑袋定的"看起来合理"的数，可以松。

两个问题都指向"该松"，才修订 master-plan：

- 经评审后修订 master-plan
- 在 git history 中显式标注修订理由

任何一个问题指向"该继续做"，就继续做切片直到达标。

修订 master-plan 是合规的，但必须**显式修订**——不是悄悄放过。

---

### 3.4 用技能助力 CRoSS 写作

CRoSS 写作有重复的结构（按五维度展开、产出按七节模板），适合做成 Claude Code 的技能（skill）。常用的几个：

|技能|触发时机|一句话作用|
|---|---|---|
|`/master-plan-init`|项目启动时|引导按七节结构写 master-plan|
|`/phase-scope-init`|进入新阶段时|起草 phase-scope，自动从 master-plan 抄过来目标和退出门槛|
|`/scope-review`|起草完成后|对照标准逐节挑战，输出问题清单|
|`/scope-distill`|阶段末段|核对节 6 checklist 与实际进度，建议勾选或取消勾选|
|`/commit`|完成切片时|按规范写 commit 消息，跑三档判断|
|`/rollback`|切片失败时|给出受控回滚步骤|
|`/phase-complete`|阶段完成时|写 Sealed 节，打 git tag，初始化下个阶段|

每个技能的具体内容（用法、步骤、判断逻辑）见**附录 A**。

---

## 04 Constitution：被遗漏的中间层

第 3 章已经讲过 master-plan 和 phase-scope——它们也是 Constitution 的一部分，但本章不重复讲。本章讲剩下的部分：哪些产物（4.1）、它们在仓库里怎么放（4.2）、AI 启动时怎么加载（4.3）、入口文件 CLAUDE.md（4.4）、详细规则与决策档案（4.5）、git 协议（4.6），最后是跨章节的人与 AI 分工总览（4.7）。

### 4.1 Constitution 包含哪些产物

Constitution 是把 CRoSS 中"项目永真"的部分沉淀到磁盘上的产物。除了 master-plan 和 phase-scope，还有五类持久产物：

|产物|回答的问题|加载方式|
|---|---|---|
|`CLAUDE.md`|启动时 AI 必须知道的最高优先级摘要 + 路由|每次启动**自动加载**|
|`docs/rules/*.md`|详细规则（项目永真）|AI 触及对应领域文件时**主动加载**|
|`docs/decisions/ADR-*.md`|单次架构决策的存档|AI 重新评估某决策时主动加载|
|`docs/debts.md`|主动接受的不完整状态清单|AI 接触某债务时主动加载|
|`git history`|隐式的会话间状态传递|每次启动 git log **自动加载**|

加载方式分三种：

- **自动加载**：会话启动时无需 AI 主动操作（CLAUDE.md、git log）
- **主动加载**：AI 按 CLAUDE.md 节 8 的触发性指针，遇到对应任务类型时去读
- **触及时加载**：AI 编辑某领域文件时同步读取该领域的规则

### 4.2 docs/ 目录的物理结构

下面是项目里 docs/ 目录的标准布局：

```
docs/
├── master-plan.md                  # 项目蓝图（第 3 章已讲）
├── public-api-surface.md           # master-plan 附属契约（如有）
├── mece-decomposition.md           # master-plan 附属契约（如有）
├── rules/                          # 详细规则（必须是目录）
│   ├── engineering-discipline.md
│   ├── feature-engineering.md
│   ├── anti-patterns.md
│   └── git-protocol.md
├── decisions/                      # 决策档案（必须是目录）
│   ├── ADR-001.md
│   └── ADR-003.md
├── debts.md                        # 单文件（默认）；超过 50 条才拆
└── phases/                         # 阶段工作目录
    ├── P0/
    │   ├── phase-scope.md          # 第 3 章已讲
    │   ├── scripts/                # AI 写的脚本
    │   ├── outputs/                # AI 跑出来的产物
    │   └── reports/                # AI 写的分析报告
    └── P1/
```

判定原则：

- **rules / decisions 必须是目录**——每条独立读、独立版本化
- **debts 默认单文件**——超过 50 条或 1500 行才拆为 `debts/{active.md, resolved/YYYY.md}`
- **不加包装层**——路径越短越好，不要 `evolving/` `current/` 这种嵌套

### 4.3 加载机制：渐进式披露

整个项目的 AI 加载机制按下面分层：

```
第一层：CLAUDE.md                        启动必读，控制在 200–500 行
       ↓ 触发性指针
第二层：master-plan.md                   AI 需要跨阶段上下文时读
       phase-scope.md（当前阶段）        当前阶段工作时必读
       rules/ / decisions/ / debts.md   按需触发读

第三层：git history                       自动加载（log + diff）
```

判断标准：

- **第一层**：高频读、最高严重度、每次启动都需要的，进 CLAUDE.md
- **第二层**：详细、低频读、按需触发的，进 docs/

CLAUDE.md 装得下就装；装不下就指针外置。

---

### 4.4 CLAUDE.md：项目入口

CLAUDE.md 是 Constitution 的入口。八个区块按"严重度递降 + 历史 + 现状 + 路由"排序——这个顺序本身就是 AI 阅读时的优先级提示。

#### 4.4.1 模板与实例

##### 模板

```markdown
# <项目名> · Agent Notes

> 本文件是项目宪法。修改需团队共识，并登记到 docs/decisions/。

## 1. 项目身份
- 项目名 + 一句话定位 + 技术栈 + 仓库结构核心

## 2. 协作模型
- 人主导 / 结对（pair）/ AI 主导，分别是哪些目录、为什么

## 3. 红线（违反 = 系统坏）
- 业务不变量、契约、安全约束

## 4. 反模式（违反 = 隐性 bug）
- AI 容易写出但本项目不要的东西

## 5. 偏好（违反 = 不一致但能跑）
- 多种合法选择中我们选哪种

## 6. 决策速记
- 一句话清单（详情见 docs/decisions/ADR-*.md）

## 7. 已知债务
- 前 3 到 5 条（详情见 docs/debts.md）

## 8. 触发性指针
- 项目蓝图 → docs/master-plan.md
- 当前阶段 → phases/<current>/phase-scope.md
- 改特征 → docs/rules/feature-engineering.md
- git 协议 → docs/rules/git-protocol.md
```

##### 实例（负荷预测项目）

```markdown
# region-load-forecast · Agent Notes

## 1. 项目身份
- 项目：华东某省电网短期负荷预测系统（24 小时滚动）
- 技术栈：Python 3.11 / LightGBM / FastAPI / PostgreSQL
- 仓库结构：src/{data,features,models,api}/、docs/、phases/

## 2. 协作模型
- 人主导：src/models/production/（错了影响电网调度）
- 结对：src/features/（错误会导致样本泄漏，难发现）
- AI 主导：scripts/、tests/、docs/

## 3. 红线
- 训练集 / 测试集严格按时间切分，**禁止随机切分**
- 所有特征必须能在生产实时计算
- 推理延迟 P95 ≤ 200ms

## 4. 反模式（详见 docs/rules/anti-patterns.md）
- 不要"顺手"把同步接口改成异步
- 不要在特征里加跨样本统计

## 5. 偏好
- 时序处理优先 polars，不用 pandas
- 错误用 Result 类型，不用 throw 当控制流

## 6. 决策速记（详见 docs/decisions/）
- ADR-003: LightGBM 作为主模型，否掉 LSTM
- ADR-007: 用 PostgreSQL TSDB 扩展
- ADR-012: 特征版本化用 feast

## 7. 已知债务（详见 docs/debts.md）
- DEBT-04: 节假日表只到 2026 年底
- DEBT-09: 气象 API 无备份源

## 8. 触发性指针
- 项目蓝图 → docs/master-plan.md
- 当前阶段 → phases/<current>/phase-scope.md
- 改特征 → docs/rules/feature-engineering.md
- git 协议 → docs/rules/git-protocol.md
```

#### 4.4.2 节 3 / 节 4 / 节 5 为什么按严重度递降

节 3、节 4、节 5 都是"约束"——但严重等级不同，必须分开：

- **节 3 红线**：违反 = 系统坏（数据脏 / 安全漏 / 契约破 / 不可逆损失）
- **节 4 反模式**：违反 = 隐性 bug（看起来 OK，时间一长爆雷；测试可能跑不出来）
- **节 5 偏好**：违反 = 不一致但能跑（风格不齐 / 选型不一；不影响正确性）

把它们混在一起会导致 AI 把"风格建议"和"安全红线"当成同一严重程度——结果要么过严（什么小事都拦），要么过松（红线被当建议绕过）。

按严重度从高到低排，AI 内化的优先级就对了：**它知道前面的不能违反，后面的可以根据上下文权衡。**

#### 4.4.3 节 6 / 节 7 必须是速记 + 指针

每条**一行**，详情在 docs/。AI 启动时只需要"知道这些决定已经做了"，需要详情时通过节 8 指针延伸。

如果节 6 写成一段段的论述，CLAUDE.md 会迅速膨胀到 2000 行——AI 加载时把 90% 的注意力花在历史决策上，留给当前任务的反而不够。

#### 4.4.4 简单 vs 复杂的退化处理

|情况|处理|
|---|---|
|红线不超过 10 条|直接写在 CLAUDE.md 节 3|
|红线超过 10 条|CLAUDE.md 节 3 写摘要，详细放 `docs/rules/redlines.md`|
|反模式不超过 5 条|直接写在 CLAUDE.md 节 4|
|反模式超过 5 条|节 4 只写指针 → `docs/rules/anti-patterns.md`|
|偏好不超过 10 条|直接写在节 5|
|偏好超过 10 条|外置到 `docs/rules/preferences.md`|

原则：CLAUDE.md 装得下就装；装不下就指针外置。

---

### 4.5 rules / decisions / debts：详细规则与决策档案

#### 4.5.1 rules：项目永真规则

##### 规则的两层来源

rules 不只来自一个地方。它有两层：

|层|来源|位置|CLAUDE.md 怎么处理|
|---|---|---|---|
|**L1**|跨项目通用规则（团队、公司、业内沉淀）|上级共享规则库（如 `~/team-rules/`）|引用："详见 ~/team-rules/test-driven.md"|
|**L2**|项目特定规则（这个仓永真）|`docs/rules/*.md`|"详见 docs/rules/feature-engineering.md"|

阶段内浮现的内容**不需要单独一层**——按形态分流到 ADR、rules、debts、phase-scope 四个去处。下面这张表说清楚分流逻辑。

##### 浮现内容的分流决策树

阶段执行过程中浮现一个新内容（一个判断、一个约束、一个决定），它该写到哪儿？

|形态|落点|例子|
|---|---|---|
|一次性架构 / 选型决定（选 A 不选 B，**之后不再讨论**）|ADR（decisions/）|"选 PostgreSQL 而非 MongoDB" / "vitest 1.6.1 锁定"|
|工作中浮现的**通用规则**（跨阶段应用，不只一次性）|rules/|"禁止跨样本统计" / "Q1–Q6 自查清单"|
|**决策 + 规则混合形态**（决定本身也是后续规则）|decisions/ + rules/ 交叉引用|"时序数据二分类原则"（决策 ADR + 规则 rules）|
|主动接受的不完整状态（走捷径或推迟）+ 还款条件|debts.md|"节假日表只到 2026 年底" / "调用点测试推迟到下个阶段"|
|阶段内一次性流程决策（setup / 切片顺序等）|**不进 docs/decisions/**，留在 phase-scope.md|"Δ1 子里程碑切分 / 工具栈选择"|

判定流程：

```
浮现一个内容：
1. 是不是"主动接受不解决"？
   是 → debts.md（带还款条件）
   否 → 2

2. 是不是"阶段内 setup / 一次性顺序"？
   是 → 留在 phase-scope.md
   否 → 3

3. 是不是"跨阶段应用的规则 / 模式"？
   是 → rules/（ADR 交叉引用，标明从哪个 ADR 上升而来）
   否 → 4

4. 是不是"一次性架构 / 选型决定"？
   是 → ADR（decisions/）
   否 → 重新审视——可能其实是 valuable discovery（有价值的发现），
        不是 decision
```

ADR 是规则的**诞生通道**——任何项目级规则都先经过一次 ADR 评审，确认之后再沉淀到 rules/。

具体例子参见**附录 B：rules / ADR / debts 实例（负荷预测项目）**。

#### 4.5.2 decisions：单次架构决定

##### ADR 命名规范

|项目类型|命名|
|---|---|
|**单阶段**（小或中项目）|全局顺序号：`ADR-001.md` / `ADR-002.md` / ……|
|**多阶段**（大项目，推荐）|阶段范围号：`D-P0-XX.md` / `D-P1-XX.md` / ……|

多阶段项目用阶段范围号的好处：

- 计数器每个阶段重置，编号不会爆
- ADR 编号反映阶段边界，看名字就知道是哪个阶段浮现
- `decisions/README.md` 维护按阶段分组的索引

##### 跨项目流动

规则有时候从单个项目沉淀为跨项目通用：

```
L2 项目永真     →     跨项目验证     →     L1 团队通用
docs/rules/                                ~/team-rules/
```

例子：负荷预测项目的"禁止跨样本统计"规则，跨多个 ML 项目都成立 → 沉淀到团队共享规则（L1）。

沉淀的判断标准：

- 在不少于 3 个项目里独立浮现过
- 没有项目特定的前提条件
- 团队评审通过

不满足这三条的规则就留在 L2，不要勉强上升。L1 太厚会让新项目启动时被淹没。

#### 4.5.3 debts：主动接受的不完整状态

debts.md 记录的不是"待办事项"，是**带还款条件的临时妥协**。每条债务必须有：

- 现状描述（具体哪里不完整）
- 接受理由（为什么现在不解决）
- 触发条件（什么时候必须还）
- 临时缓解（在还清之前怎么避免出事）

##### 单文件 vs 拆分判定

默认单文件 `debts.md`。下面情况才拆：

|现象|处置|
|---|---|
|总条数 ≤ 50|单文件|
|总条数 > 50，或文件 > 1500 行|拆为 `debts/active.md`（待还）+ `debts/resolved/YYYY.md`（已还，按年归档）|

不要预先拆——预先拆增加维护成本但不增加可读性。等真的多到读不动再拆。

具体例子参见附录 B。

---

### 4.6 git 协议

git 是 Constitution 的基础设施。它承担两件事——会话之间的状态传递（让 AI 启动时自动恢复上下文）、改动的可追溯（让回滚和审计可行）。

#### 4.6.1 commit / tag / rollback 协议

##### commit 规范

每次 commit 包含：

- **类型前缀**：feat / fix / refactor / docs / chore / test
- **作用域**：影响的模块或文件夹
- **简述**：一句话说"做了什么"，不超过 60 字符
- **正文（如有）**：为什么这么做、考虑过的方案、待跟进事项

例子：

```
feat(features): 加 SCADA 缺失值线性插值
基于 Δ1.2 EDA 报告，缺失率峰值时段达 0.8%。
线性插值在长缺失段（> 6 个采样点）会有偏差，
长缺失段单独打 nan 标志由模型处理。
```

##### tag 规范

阶段完成时打 git tag，名称就是阶段标识符：

```
git tag P0-complete-2026-05-02
```

tag 是阶段封存的事实凭据。已 tag 的提交是**只读的**——之后任何修改通过新 commit 处理，不要 amend、不要 force push、不要 rebase。

##### rollback 协议

阶段中段发现某个切片的产出有问题，需要回滚。三种情况：

|情况|处置|
|---|---|
|**切片内部回滚**（未 commit、测试失败）|直接 `git checkout` 工作树即可|
|**跨切片回滚**（要撤销已 commit 的某个切片）|`git revert` 该 commit，不要 `git reset`——保留历史|
|**跨阶段回滚**（要撤销已 tag 的整个阶段）|**必须人工裁决**——tag 是封存契约，撤销影响下游所有阶段|

禁止：

- 在已 tag 的提交上 amend
- 在 main 分支 force push
- `git reset --hard` 已 push 的 commit

#### 4.6.2 git history 即隐式 HANDOFF

> **HANDOFF**：会话间交接文档。传统做法是每次会话结束写一份"上次做到哪里、遇到什么问题、下一步打算"，下次会话启动时读它。

但其实**不需要**写这个文档。git history 已经承担了这个职能：

- **what**：commit 改了什么文件、改了哪些行——`git show <commit>` 就能看
- **why**：commit 消息里的简述和正文——`git log` 就能看
- **tried**：之前的失败尝试——`git log --all` 看分支和已删除分支即可

显式的 HANDOFF.md 反而引入两个问题：

第一，**双源不一致**。HANDOFF 和 git history 都记"上次做到哪儿"，更新不同步就漂移。 第二，**手工维护成本**。每次切片完成都要更新 HANDOFF——但 commit 消息已经写过一次，重复劳动。

只要 commit 消息写得规范（按上面 4.6.1 的格式），git history 本身就是隐式 HANDOFF——AI 启动时 `git log --since=<上次会话> --stat` 自动加载，比读 HANDOFF.md 更准确。

#### 4.6.3 多仓 / 多工作目录协作

> **cwd**：current working directory，当前工作目录。多个 cwd 协作的常见场景：主仓 + 数个卫星仓 + 团队规则仓，每个仓有独立的 git history。

##### 设计原则

1. **每仓有自己的 CLAUDE.md** —— 不跨仓引用别人仓的 CLAUDE.md（跨仓引用脆弱：路径变了、子模块没拉、权限不到位都会断）
2. **跨仓引用通过 commit ref** —— 在 commit 消息里写 `Refs: <other-repo>@<sha>` 段，而不是直接 link 文件路径
3. **被重构对象的接口契约** 放在被重构对象自己的仓 —— 消费者通过 git submodule、npm 依赖或手动同步获取
4. **多 cwd 同时开 Claude Code 会话是常态** —— 用户人工协调，不需要"主会话"统辖

##### CLAUDE.md 节 1 显式列出仓拓扑

```markdown
## 1. 项目身份
- 主仓：region-load-forecast/（本仓）
- 卫星：region-load-data/（数据接入）
- 卫星：region-load-monitoring/（监控大盘）
- 团队规则：~/team-rules/（跨项目通用规则）
```

##### 反模式

- ❌ 在消费者仓里建被消费仓的设计文档（应放回被消费仓自己）
- ❌ Claude Code 试图跨 cwd 切目录工作（"从 A 仓 cwd 启动，去改 B 仓代码"——cwd 一变上下文就乱）
- ❌ 假设两个仓的 git history 是统一的（每仓独立历史，跨仓只通过 commit ref 关联）

##### 跨阶段跨仓的特殊情形

某些阶段的影响跨仓（比如：库的某个阶段同时是消费者端的切换）：

- 库仓 `phases/PN/phase-scope.md` 显式标注"跨仓阶段"
- 消费者仓单独有"切换工单"——不一定对应消费者仓自己的某个阶段（消费者仓有独立的阶段序列）
- 跨仓协调：用户协调 + commit ref + phase-scope 互相 link

##### 启动纪律

每次新阶段启动时，第一步是 `pwd` + `ls`，确认 AI 在正确的仓和目录。这是基线纪律（参见 `engineering-discipline.md` 「路径漂移核对」节）。

---

### 4.7 人与 AI 在持久产物上的分工

> 人定方向，AI 写执行；人审约束，AI 起草细节。 人是立法者 + 审稿人，AI 是写手 + 速记员。

本节覆盖第 3、4 两章涉及的全部持久产物——从 master-plan、phase-scope，到 CLAUDE.md、ADR、debts、rules，最后到 phase 工作目录里的脚本和报告。

|文档|主写|谁审|
|---|---|---|
|`CLAUDE.md`|**人**|人|
|`master-plan.md`|**人**（CRoSS-Strategic）|人；AI 跑 7 项标准评审（见 3.1.2）|
|master-plan 附属契约|**人**|人|
|`phases/PN/phase-scope.md`|**人**（CRoSS-Tactical）|人；AI 起草初版|
|`rules/*.md`|人列出条目 + AI 起草内容|人|
|`decisions/ADR-*.md`|**AI 起草**|人|
|`debts.md`|**AI 主写**|人偶尔回顾|
|`phases/PN/{scripts, outputs, reports}/`|AI 主写|人验收|
|`README.md`|**人**|人|

反模式：

- AI 写红线、master-plan、附属契约（越权——这些是人的判断领地）
- 人写 ADR 全文（费时——AI 起草、人审更高效）
- AI 改 master-plan 而不打 git tag（破坏唯一事实源——重大修订必须有显式标记）

---

## 05 CHASM：AI 执行引擎的工具箱

|字母|名称|解决的核心问题|
|---|---|---|
|**C**|Constitution（宪法加载）|什么规则永远成立？|
|**H**|Hook（自动化钩子）|什么动作必须强制发生？|
|**A**|Agent（自主智能体）|任务怎么拆？|
|**S**|Skill（按需能力包）|什么能力按需可用？|
|**M**|MCP（模型上下文协议）|怎么够到外部世界？|

### 5.1 C — Constitution（宪法加载）

会话启动时 Claude Code 自动扫描当前工作目录找 CLAUDE.md。`/memory`（查看当前已加载的记忆与上下文）命令查看加载状态。

> CLAUDE.md 越小、越精，加载成本越低。

### 5.2 H — Hook

事件点（PreToolUse / PostToolUse / PreCommit）强制触发 shell 命令。

> 红线靠提示，hook 靠绞索。

举例：本项目"禁止随机切分"是红线，PreToolUse hook 在编辑 `train.py` 时检查 `shuffle=True` 命中就拦。

### 5.3 A — Agent

主 Agent 派子 Agent，各自有独立的上下文窗口，并行处理。模型对比时派三个子 Agent 同时跑 LightGBM / Prophet / LSTM。**核心价值是上下文隔离**。

### 5.4 S — Skill（技能）

技能的元数据常驻上下文（很轻），正文（body）仅在被触发时加载。`/master-plan-init`、`/phase-scope-init`、`/commit`、`/rollback`、`/phase-complete`、`/review-features` 都是技能。

### 5.5 M — MCP：澄清"MCP 已死"的争论

社区从 2026 年初出现"MCP 已死"的声音，主要论点是：

> 大模型本来就会用 CLI，多套一层 MCP 协议是脱裤子放屁。CLI 错了在终端能立刻重跑同样命令；MCP 错了日志难看；CLI 还有 `grep | jq | awk` 这种成熟管道。

这论点对了一半。Anthropic 在 2025 年 11 月发文 _Code execution with MCP_[^mcp] 给出回应，核心一句话：

[^mcp]: Anthropic Engineering, _Code execution with MCP: Building more efficient agents_, Nov 4, 2025.

> **MCP 不是来替代 CLI 的。是来覆盖 CLI 到不了的地方的。**

#### 三条路径，各管各的

|路径|适用场景|局限|
|---|---|---|
|**直接 API**|一两个简单集成|M×N 爆炸：每加一个 model × 每加一个工具 = 一份新代码|
|**CLI**|本地终端|云端 / 浏览器 / 移动 Agent **没有 shell**|
|**MCP**|标准化协议、跨环境|协议本身有上下文成本（已优化）|

简单决策：

- 本地 Claude Code 操作本地文件 / git / npm → **CLI**
- 接 SaaS（Jira / Gmail / 企业 DB）→ **MCP**
- 云端 Agent（Cowork / Chrome 插件）→ **MCP**（没 shell）

#### 两个关键改进

社区批 MCP 最猛的两个痛点，Anthropic 都改了：

**1. 工具按需加载**——以前所有工具的 schema 全塞进上下文，工具一多 token 就爆。改成"先注册搜索入口，工具按需读"。同一任务的 token 用量从 15 万降到 2 千。这正是你 `/context`（查看当前上下文使用情况）输出里看到的 "MCP tools: loaded on-demand"。

**2. 沙箱里先处理再返回**——以前调完工具，原始 JSON 全量塞回上下文（取一份 1 万行电子表格全进上下文）。改成**让 Agent 写代码调工具，沙箱里过滤完只返回决策需要的几行**：

```python
# 老方式：1 万行全进上下文
TOOL CALL: gdrive.getSheet(...) → 10,000 行进上下文

# 新方式：沙箱过滤，只返回 5 行
rows = await gdrive.getSheet({...})
pending = rows.filter(r => r.Status === 'pending')
console.log(pending.slice(0, 5))   # 模型只看 5 行
```

> 模型不再是数据搬运工，只看决策需要的东西。

#### 技能 + MCP 互补

- **技能教 Agent "怎么做"** —— 流程知识（如何排查、如何审查）
- **MCP 给 Agent "用什么做"** —— 工具接入（kubectl、Jira、SCADA 数据库）

举例：电网运维插件 = 技能写排查流程 + MCP 提供 `kubectl` 和数据库工具。打包分发，Agent 装上就能干活。

---

## 06 完整工作流（负荷预测）

### 项目启动日：CRoSS-Strategic

```
/master-plan-init   ← 技能引导写 master-plan
```

**人写**：

- master-plan.md（基于技能引导，跑 7 项标准）
- CLAUDE.md（八区块）
- docs/rules/{git-protocol, anti-patterns, ...}.md 骨架

**AI 起草，人审**：

- docs/rules/ 详细规则
- README.md
- 安装附录 A 的技能

### 阶段启动日：CRoSS-Tactical

```
/phase-scope-init P0   ← 技能基于 master-plan 第 3 节 P0 起草 phase-scope
```

**人写 / 人审**：

- phases/P0/phase-scope.md（第 1 至第 6 节完整）

### 阶段执行中：跑工作切片

新会话启动时按下面五步：

```
1. 自动加载 CLAUDE.md
2. 读 phases/<current>/phase-scope.md
3. 看第 6 节 checklist，找第一个未勾选的工作切片（Δ）
4. 跑 git log -10 看上次进展
5. 开干
```

阶段内 CHASM 自动跑：

- Hook 拦截：写 `shuffle=True` 时被拦
- Agent 派发：模型对比派三个子 Agent
- 技能：`/review-features` 自动检查泄漏；`/commit` 自动跑三档判断
- MCP：通过企业 DB MCP server 拉 SCADA

### 阶段完成日：封档

```
/phase-complete   ← 技能验证第 6 节全 ✓，写第 7 节 Sealed，打 tag，初始化下一个阶段
```

### 跨会话交接

```
/clear
"接手当前项目"
```

新会话自动加载 CLAUDE.md → 读 `phases/<current>/phase-scope.md` → `git log -10` → 接续。**不需要 HANDOFF。**

---

## 07 重塑编程生产力

软件开发的演进史，就是不断制造高级工具来"跨越复杂性鸿沟"的历史。AI 编程是这个序列里最新的一跳，但有一个根本不同：**AI 是有状态的、易失的、需要被"教育"的协作者**——不是无状态工具。

光有"工具箱"（CHASM）不够，光有"指挥术"（CRoSS）也不够。你必须把**指挥**沉淀成**章程**，让章程**自动驱动**工具箱。**Constitution 这一中间层，是协议的核心。**

未来开发者的核心竞争力按三层映射：

### CRoSS 层（人的意图）

1. **战略意图力**——写出好的 master-plan
2. **战术规划力**——写出好的 phase-scope.md

### Constitution 层（沉淀章程）

3. **协议设计力**——蒸馏出强健的 Constitution

### CHASM 层（执行机制）

4. **基础设施力**——组装合用的 CHASM

### 元能力（让飞轮转起来）

5. **协议演进力**——持续蒸馏，让飞轮越转越快
6. **分工判断力**——知道哪些自己写、哪些 AI 写、哪些一起写

---

> **用 CRoSS 临时指挥（Strategic 写蓝图，Tactical 写工单），让 Constitution 持久生效，靠 CHASM 自动执行。**
> 
> **master-plan 列里程碑（≤ 10），phase-scope 列工作切片（≤ 10）。两层都不超过 10——人脑工作记忆上限。**
> 
> **三层一旦运转成飞轮，鸿沟就只跨一次，从此都在桥上。**

这，就是 AI 时代真正能跨越复杂性鸿沟的人机协议。

---

## 附录 A：CRoSS / git 协议作为技能

下面 7 个技能让 AI 自动执行写作和 git 协议——**人不需要记规则，AI 跑技能即可**。

### 技能部署位置

|类型|位置|例子|
|---|---|---|
|**跨项目通用技能**（宪法级，任何项目都用）|`~/.claude/skills/`（user 全局）|`/master-plan-init` / `/phase-scope-init` / `/scope-review` / `/scope-distill` / `/commit` / `/rollback` / `/phase-complete`|
|**项目特定技能**（只在本仓有意义）|`<project-root>/.claude/skills/`（项目本地）|`/scan-callsites` / `/review-features` / `/orchestrator-review`|

**技能加载优先级**：项目本地 > user 全局（同名时项目本地覆盖）。

下面 7 个技能都属于第一类（跨项目通用），推荐放 `~/.claude/skills/`。

### A.1 `/master-plan-init` — 引导写 master-plan

文件：`.claude/skills/master-plan-init/SKILL.md`

```markdown
---
name: master-plan-init
description: Guide user through writing a master-plan based on 7 standards
---

**用途**：项目启动时触发。引导用户按七节结构写 master-plan，完成后自动运行 /scope-review 评审。

## Step 1: 项目规模判断

问用户："预计几个阶段？工期多长？"
- 1 个阶段、几周 → 建议跳过 master-plan，直接写 phases/P0/phase-scope.md
- 2–3 个阶段、以季度计 → 建议写精简版（第 1 至第 3 节）
- 多阶段、以月计或更长 → 写完整版（第 1 至第 7 节）

## Step 2: 逐节引导七个标准

逐条提问，每次只问一条：
1. **为什么做** — 业务价值 + 不做的代价
2. **最终状态** — 可观测的完成状态
3. **阶段与退出门槛** — 阶段划分 + 非主观的门槛
4. **关键假设** — 哪些需要 spike 验证。
   只接受**事实命题**（一次实验或观察能给出是/否答案），
   行为模式（"工程师容易陷入 X"）属于第 6 节反模式
5. **项目级红线** — 区别于 CLAUDE.md 第 3 节的红线
6. **反模式** — 历史失败行为 + 拦截方式（行为模式落这里）
7. **依赖关系** — 前置和后置要求

每条回答后追问：
- "这能量化吗？"
- "这个假设失败了怎么办？"
- "这条红线之前被破过吗？"
- 第 4 节专项追问："这条能不能用一次实验给出是/否答案？"
  不能 → 移到第 6 节

## Step 3: 起草 v0

生成包含全部章节的 master-plan.md，展示给用户。

## Step 4: 触发 /scope-review

对起草的 master-plan 运行 /scope-review。
```

### A.2 `/phase-scope-init` — 起草 phase-scope

文件：`.claude/skills/phase-scope-init/SKILL.md`

```markdown
---
name: phase-scope-init
description: Draft phases/P_N/phase-scope.md based on master-plan §3 P_N
---

**用途**：进入新阶段时触发。基于 master-plan 第 3 节对应阶段的目标和退出门槛，起草该阶段的 phase-scope.md。

用法：`/phase-scope-init P0`

## Step 1: 读取上游文档

- 读 master-plan.md 第 3 节 P_N（里程碑描述）
- 读上一个阶段的 phase-scope.md 和 reports/（如有）
- 读 CLAUDE.md 第 3 至第 5 节，了解项目上下文

## Step 2: 起草 phase-scope.md 各节

生成 phases/P_N/phase-scope.md 骨架（格式参照 3.2.1 节）。
把 master-plan 第 3 节 P_N 的目标和退出门槛，展开写成完整的 phase-scope 第 1 节。
不要照抄 master-plan 的措辞，要展开说明。

## Step 3: 触发 /scope-review 评审起草稿
```

### A.3 `/scope-review` — 评审 master-plan 或 phase-scope

文件：`.claude/skills/scope-review/SKILL.md`

```markdown
---
name: scope-review
description: Critically review a master-plan or phase-scope against standards
---

**用途**：master-plan 或 phase-scope 起草完后触发。对照标准逐节评审，输出问题清单和修改建议。

用法：`/scope-review docs/master-plan.md` 或 `/scope-review phases/P2/phase-scope.md`

## 针对 master-plan：七项标准挑战

逐一检查第 1 至第 7 节：
- 第 1 节（为什么做）："不做的代价写具体了吗？"
- 第 2 节（最终状态）："一个陌生人看了能判断是否完成吗？"
- 第 3 节（里程碑）："每个退出门槛都是非主观的吗？"
- 第 4 节（关键假设）："每条都是事实命题（一次实验能给出是/否答案）？还是混入了行为模式？混入的要移到第 6 节。"
- 第 5 节（项目级红线）："和 CLAUDE.md 第 3 节的红线区分清楚了吗？"
- 第 6 节（反模式拦截）："每条都有'如何拦截'的说明吗？"
- 第 7 节（依赖图）："有没有隐式链条？（比如 M5 依赖 X，但没有任何阶段会产出 X）"

输出：问题清单，注明严重等级（block / warn / nit），附修改建议。

## 针对 phase-scope：两套标准并行挑战

### 整篇文档：phase-scope 写好的五项标准（参照 3.2.2）

- 节 1 退出门槛是否二元可验收？
- 工作切片粒度是否合适（1–5 天）？
- 每个切片是否有独立产出？
- 每个切片是否有验证条件？
- 节 6 退出 checklist 最后一条是否就是 master-plan 该阶段的退出门槛？

### 节 4 产出清单的五项设计原则挑战（参照 3.2.3）

逐一检查清单里**每一项产出**：
- "这个产出回答什么问题？"
- "使用者是谁？"
- "退出条件可以量化吗？"
- "形式匹配处理方？（机器消费 → JSON / Parquet，人工消费 → Markdown）"
- "MECE：清单整体上没有遗漏、没有重复吗？"

输出：问题清单 + 修改建议。
```

### A.4 `/scope-distill` — 会话末勾选已完成切片

文件：`.claude/skills/scope-distill/SKILL.md`

```markdown
---
name: scope-distill
description: Reconcile phase-scope §6 checklist with actual progress
---

**用途**：会话结束前或阶段末段触发。核对 phase-scope 第 6 节 checklist 与实际进度，建议勾选或取消勾选。

## Step 1: 读取证据

- 读 phases/<current>/phase-scope.md 第 6 节
- 读自上一个阶段 tag 以来的 git log
- 列出 outputs/ 和 reports/ 下的文件

## Step 2: 对每个未勾选的工作切片，核查：

- 产出文件是否存在？
- git log 是否有完成该切片的 commit？
- 测试是否已运行并通过？

全部满足 → 建议标记为 ✓。

## Step 3: 对每个已勾选的工作切片，核验：

- 产出文件是否仍然存在？
- 近期 commit 是否有回滚？

如有回滚 → 建议取消勾选，并标记不一致。

## Step 4: 输出

汇总建议修改项。**等用户确认后**再编辑 phase-scope.md。
```

### A.5 `/commit` — 三档判断

文件：`.claude/skills/commit/SKILL.md`

````markdown
---
name: commit
description: Create a commit per git-protocol three-tier judgment
---

**用途**：完成一个工作切片时触发。按三档判断分类——自动提交、等待人工确认、或禁止提交。

## Step 1: 测试门禁

运行项目测试命令。有任何失败 → 停止，建议运行 /rollback。

## Step 2: 分类判断

**AI-Auto（自动提交）**：
- 新代码且测试通过
- 重构且全部测试仍为绿色
- 更新 docs/debts.md 或 phases/PN/issues.md
- 更新 phases/PN/phase-scope.md 第 6 节（标记 ✓）

**Human-Review（停止，提交前等人工确认）**：
- 新 ADR 草稿（docs/decisions/ADR-*.md）
- 修改 docs/rules/*.md
- 修改 CLAUDE.md 或 docs/master-plan.md
- 数据库 schema / 迁移变更
- 删除 ≥ 50 行

**Forbidden（禁止）**：
- 测试失败 → 必须运行 /rollback

## Step 3: 提交消息格式

```
<type>(<phase>/<Δ>): <one-liner what>
<why>                  ← 非微小改动时必填
<tried-and-failed>     ← 可选
<next-step>            ← 离开会话前必填
Refs: phases/<PN>/phase-scope.md / [ADR-XXX] / [DEBT-XX]
```

## Step 4: 提交

- AI-Auto：`git add` + `git commit -m "<message>"`
- Human-Review：展示 diff 和消息草稿，等待人工确认

## Step 5: 更新第 6 节（如适用）

如果此次提交完成了某个工作切片：
1. 编辑 phase-scope.md 第 6 节，标记 ✓
2. 单独提交：`chore(<phase>/<Δ>): mark Δ<N> complete`
````

### A.6 `/rollback` — 安全回退

文件：`.claude/skills/rollback/SKILL.md`

````markdown
---
name: rollback
description: Safely roll back per git-protocol
---

**用途**：切片失败或测试不通过时触发。按三种场景（切片内、跨切片、跨阶段）给出受控回滚步骤。

## 切片内回滚（未提交，测试失败）

```
git reset --hard <last-green-commit>
```

不要修改 phase-scope.md。

## 跨切片回滚（撤销已勾选的切片）

1. `git revert <commit>`（保留历史）或 `git reset`（重写历史）
2. 编辑 phases/<current>/phase-scope.md 第 6 节：取消勾选该切片
3. 提交：`revert(<phase>/<Δ>): uncheck Δ<N>, reason: <reason>`

## 跨阶段回滚（撤销已打 tag 的阶段）——**必须人工确认**

1. 停止。向用户列出影响范围：tag、需要修改的 master-plan 内容、需要取消的勾选
2. 等待用户明确确认
3. `git tag -d <tag>`
4. 如有必要，修改 master-plan.md
5. `git revert` 或 `git reset`
6. 提交：`revert(<phase>): cross-phase rollback, reason: <reason>`

## 禁止操作

- 禁止对已推送的 commit 执行 `git commit --amend`
- 禁止在共享分支上 `git push --force`
- 禁止在测试红灯时提交未完成工作（WIP commit）
````

### A.7 `/phase-complete` — 阶段封档

文件：`.claude/skills/phase-complete/SKILL.md`

````markdown
---
name: phase-complete
description: Seal a phase when phase-scope §6 is all ✓
---

**用途**：阶段完成时触发，即 phase-scope 第 6 节全部勾选后。写入第 7 节 Sealed，打 tag，初始化下一个阶段。

## Step 1: 核查完成状态

- phases/<current>/phase-scope.md 第 6 节所有条目已勾选 ✓
- 第 4 节所有产出文件存在
- 测试通过
- `git status` 干净

有任何不满足 → 停止，列出未通过项。

## Step 2: 写入第 7 节 Sealed

在 phase-scope.md 末尾追加第 7 节 Sealed 段落（字段包括：封存时间 / Tag / 分支状态 / 产出列表 / 跨阶段产物 / 下一阶段 / 下一份 phase-scope.md / 交接状态）。
提交：`chore(P<N>): seal P<N>`。

## Step 3: 打 tag

```
git tag -a P<N>-complete-<YYYY-MM-DD> -m "
Phase <N> sealed.
Exit: <one-line summary>
Outputs: phases/P<N>/{scripts,outputs,reports}
Refs: phases/P<N>/phase-scope.md 第7节, master-plan.md 第3节 P<N>
"
```

## Step 4: 初始化下一个阶段

运行 /phase-scope-init P<N+1>。

## Step 5: 输出确认

输出：
```
✅ Phase <N> complete.
Tag: P<N>-complete-<YYYY-MM-DD>
Next: phases/P<N+1>/phase-scope.md initialized.
```
````

---

## 附录 B：rules / ADR / debts 实例（负荷预测项目）

### B.1 docs/rules/feature-engineering.md（L2 项目级规则）

```markdown
# Feature Engineering Rules

## 时间因果性
- 所有特征必须能在生产实时计算
- 禁止用未来信息（next_day_load, future_temp）
- 禁止跨样本统计（df.groupby(date).mean() 之类）

## 滞后窗口
- 短期特征：lag-24h
- 周期特征：lag-168h
- 节假日跨越时用 group-by-weekday lag（见 ADR-013）

## 缺失值
- 数值: forward fill 最多 4 小时；超过 4 小时标 NaN，下游过滤
- 类别: 用 "UNKNOWN" 占位，**不要**用 mode 填充（污染分布）

## 标准化
- 训练 / 测试集严格按时间切分后再 fit scaler
- scaler 状态保存在 features/scaler.pkl，生产用同一份
```

### B.2 docs/decisions/ADR-013.md

```markdown
# ADR-013: Use group-by-weekday lag for holiday cross-over

## Status
Accepted (2026-05-03)

## Context
24h/168h fixed lag fails when holidays cross the lag window:
节假日 168h 前是工作日，但节假日实际负荷应参考"上一个节假日"
而非"上一个 168h 前的工作日"。

P2/Δ4 spike 发现这导致节假日 MAPE 劣化 2.3%。

## Decision
Use group-by-weekday lag:
- 工作日: lag = 168h ago same weekday
- 节假日: lag = previous holiday's same hour

## Alternatives considered

### A. Drop holiday samples
- Pro: simple
- Con: 节假日是高价值预测对象，丢失 2-3% 数据

### B. Holiday-specific model
- Pro: 灵活
- Con: 数据量不足训练独立模型；维护成本高

### C. Group-by-weekday lag (chosen)
- Pro: 单模型；逻辑简单；MAPE 改善 2.3%
- Con: 历史第一个节假日没有 lag 参考，前 N 个样本 NaN

## Consequences
- features/lag.py 新增 group_by_weekday_lag()
- 历史第一个节假日的样本前 N 个标 NaN，下游过滤
- DEBT-15: 国庆 7 天连假场景未充分测试，P3 验证

## Refs
- phases/P2/phase-scope.md §3 Δ4
- phases/P2/reports/lag-feature-comparison.md
```

### B.3 docs/debts.md

```markdown
# Active Debts

## DEBT-04: holiday 表只到 2026 年底
- **Severity**: P1
- **Discovered**: 2026-04-15 / phase P0
- **Why deferred**: 数据源每年初手工更新；自动化超出本期范围
- **Repayment trigger**: 2027-01-01 之前必须有自动化
- **Estimated cost**: 1-2 人天

## DEBT-09: 气象 API 无备份源
- **Severity**: P2
- **Discovered**: 2026-04-20 / phase P1
- **Why deferred**: OpenWeather SLA 99.9% 可接受
- **Repayment trigger**: OpenWeather 一次 outage 持续 ≥ 30min
- **Estimated cost**: 3-5 人天（接 NOAA 或 ECMWF 备份）

## DEBT-15: 国庆 7 天连假未充分测试
- **Severity**: P2
- **Discovered**: 2026-05-03 / phase P2 / ADR-013
- **Why deferred**: P2 scope 不含国庆专项验证
- **Repayment trigger**: P3 启动前
- **Estimated cost**: 2-3 人天
```

---

**End**