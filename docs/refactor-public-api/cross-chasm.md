# CRoSS CHASM：跨越复杂性鸿沟的人机协议

> **一句话**：编程的终极目标不是让 AI 代替你，而是建立一套可靠的"人机协议"。CRoSS CHASM 用三层结构——临时意图、持久宪法、执行机制——让你**跨越**鸿沟，而不是每天**重修一次桥**。

---

## 01 浪潮之下，开发者真正的焦虑

AI 编程工具像浪潮一样涌来。但很多开发者越用越累：

- AI 写的代码总是"差点意思"——风格不一致、约定不遵守、上下文丢失。
- 复杂任务一上手就开始"幻觉"。
- 项目跑了一周后，每次新对话都要重讲一遍背景。
- `/clear` 一下或换个会话，前面建立的所有默契清零。

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
CRoSS         临时战略意图（项目级 + phase 级）
   ↓ 蒸馏沉淀
Constitution  持久项目宪法（一次写，永久生效）
   ↓ 被系统自动执行
CHASM         执行机制（hook、agent、skill、MCP）
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

CRoSS 是人的意图入口，分两层：

|层级|产物|频率|数量|
|---|---|---|---|
|**CRoSS-Strategic**（项目级）|`master-plan.md`|项目启动 1 次 + 重大修订|≤ 10 个里程碑|
|**CRoSS-Tactical**（phase 级）|`phases/PN/scope.md`|每 phase 启动 1 次|每 phase ≤ 10 个 Δ|

两层用相同的五个维度（C / R / O / S / S），只是应用尺度不同。

下面用一个统一例子贯穿：**区域电网短期负荷预测系统**——24h 滚动预测，SCADA + 气象 + 节假日。

### 3.1 CRoSS-Strategic：写 master-plan

启动负荷预测项目时，第一步是写 master-plan。这一步本身就是 Strategic CRoSS：

🔹 **C**（Context）： 华东某省调度中心，每 15 分钟一次预测；老系统 SARIMA + 人工规则，MAPE 5.8%；公司有 SCADA、气象、节假日数据但没整合；2 人 6 个月预算。

🔹 **R**（Role）： 资深 ML 系统架构师，懂电力业务 + MLOps + 时序建模。

🔹 **O**（Objective）： 一份 master-plan.md，覆盖 §3.3 给出的 7 项标准。

🔹 **S**（Spec）： phased delivery 不是 big bang；早期 spike 高风险假设；红线 + 回退路径。

🔹 **S**（Steps）： 调研同类系统 → 列待验假设 → 阶段划分 → 退出门槛 → review。

Strategic 比 Tactical 更重要——它**决定**所有后续 Tactical 的边界。

### 3.2 CRoSS-Tactical：写 phase scope.md

进入某个 phase（如 P2: 特征工程）时，第一步是写 P2 的 scope.md：

🔹 **C**（Context）： 基于 P0 完成的 EDA 报告（在 `phases/P0/reports/`），P1 已选定 LightGBM，目标产出第一版生产级特征。

🔹 **R**（Role）： 精通时序特征工程的算法师，关注样本泄漏 + 因果性。

🔹 **O**（Objective）： phases/P2/scope.md，含 §3 工作切片 Δ1-ΔN + §4 产出清单 + §6 退出 checklist。

🔹 **S**（Spec）： 禁止跨样本统计；所有特征必须能在生产实时计算。

🔹 **S**（Steps）： 列待生成特征 → 切 Δ → 每 Δ 定产出与验证 → 写 checklist。

写好 scope.md 后，**phase 内每次会话都引用它**——不需要再做一次 CRoSS。

### 3.3 master-plan：模板 + 标准 + 分工 + 退化 + 红线区分

master-plan 模板与"好 master-plan 的 7 项标准"一一对应。每个区段对应一项标准，每项标准对应一份分工。

#### 3.3.1 模板：核心 3 节 + 大项目 4 节

```markdown
# Master Plan: <项目名>

## §1 为什么做（动机）  — 必有
<业务价值 + 不做的代价；如有"重构旧失败计划"，列旧计划的结构性诊断>

## §2 最终状态（done state）  — 必有
<可观测的最终态，5-7 条具体可验收条件>

## §3 里程碑（≤ 10）  — 必有
### P0: <名称>
- 目标: <一句话>
- 退出门槛: <非主观可验证，一句话>
- scope: phases/P0/scope.md       ← 详情下沉，不在 master-plan 展开

### P1-P_N: ...

---  以上 3 节是任何 master-plan 必有 ---

## §4 关键假设（spike 验证清单）  — 大项目可有
| # | 假设（待验证的事实命题） | 验证 phase | 失败 fallback |

## §5 项目级红线  — 大项目可有
<本工程特有，与 CLAUDE.md §3 互补不重复——见 §3.3.4>

## §6 反模式拦截  — 大项目可有
<已知的失败行为模式 + 拦下方式>

## §7 依赖图  — 大项目可有
<前置 / 后置关系，文字或 mermaid>
```

#### 3.3.2 7 项标准 + 一致性的分工

|§|标准|拷问|主写|AI 角色|
|---|---|---|---|---|
|§1|**动机**|为什么做？不做的代价？|**人**|帮归纳|
|§2|**最终状态**|可观测吗？怎么验收？|**人**|帮检查可观测性|
|§3|**阶段 + 退出门槛**|分阶段了吗？门槛非主观吗？|**人**|提议初版，跑"门槛主观吗"challenge|
|§4|**关键假设**|哪些假设必须 spike？|人 + AI|AI 主动 challenge："这假设有数据吗？"|
|§5|**项目级红线**|本工程特有的硬约束？|**人**|用业内常见失败模式提示|
|§6|**反模式**|旧的失败模式怎么拦？|**人**|用业内常见失败模式提示|
|§7|**依赖图**|前置 / 后置关系明确吗？|**人**|帮画 mermaid|

> **master-plan 是项目宪法的总章。AI 提建议，人立法。**

#### 3.3.3 退化场景：小项目可省 §4-§7

不是所有项目都需要完整 7 项：

|项目规模|用什么|
|---|---|
|**小项目**（≤ 1 phase；周级 / 月级）|只用 `phases/P0/scope.md`，不需要 master-plan|
|**中项目**（2-3 phase；季度级）|master-plan 极简版（§1-§3）|
|**大项目**（多 phase；半年 / 年级）|master-plan 完整 7 项|

> **小项目，phase-scope 就是它的 master-plan。不要为了套框架而写空文档。**

判断信号：

- §3 只有一个里程碑 → 退化为小项目（直接 phase-scope）
- §4 关键假设写不出 → 退化为中项目
- §6 反模式写不出 → 还没进入失败的真实领域，先做小项目积累

#### 3.3.4 §5 项目级红线 vs CLAUDE.md §3 红线：互补不重复

||范围|时效|例子（负荷预测项目）|
|---|---|---|---|
|**CLAUDE.md §3 红线**|跨 phase 永真|项目生命周期|"禁止 random split"、"DB schema 不破坏"|
|**master-plan §5 红线**|本次工程特有|工程持续期间|"灰度期间老系统必须保持 fallback 可用"、"模型变更必须经验证集评估"|

两者**互补不重复**——CLAUDE.md 红线是日常永真的，master-plan 红线是这次大动作里特殊的。已写过 CLAUDE.md 的就引用，不再重写。

反模式同理两层：CLAUDE.md §4 是日常反模式，master-plan §6 是本次工程旧失败模式。

#### 3.3.5 §4 假设 vs §6 反模式：本质区分

写时容易混。**显式区分**：

- **假设**：待验证的**事实命题**（"X 是真的吗？"） 例：A1 "LightGBM 推理延迟可达 P95 ≤ 200ms"——这是个可以测出来 yes/no 的事实
- **反模式**：已知的**失败行为模式**（"做 X 是错的"） 例：反模式 1 "再调一调超参"——这是工程师容易陷入的行为陷阱

如果你写下来的某条既像假设又像反模式，问自己：**它能用一次 spike / 实验 yes/no 回答吗？**

- 能 → 假设
- 不能（是行为模式描述）→ 反模式

#### 3.3.6 实例：负荷预测项目 master-plan

```markdown
# Master Plan: region-load-forecast

## §1 为什么做
- 业务价值: 老系统 MAPE 5.8% → 调度备用超配 8%（年度成本 2400 万）；
  调度员对节假日不信任，30% 时段人工覆盖
- 不做的代价: 老系统技术栈（MATLAB + Excel 节假日）2027 年风险陡增
- 目标: MAPE ≤ 3%，节假日 ≤ 4%，人工覆盖 ≤ 10%

## §2 最终状态
1. 生产环境每 15 分钟自动预测，连续运行 ≥ 30 天无干预
2. 7 天滚动 MAPE ≤ 3%
3. 推理 API P95 ≤ 200ms
4. 模型可热更新
5. 节假日表自动从国务院公告爬取
6. 完整 runbook（故障切换 / 降级 / 回滚）

## §3 里程碑

### P0: 数据 + 基线（4 周）
- 目标: 三源数据整合 + SARIMA baseline 复刻老系统
- 退出: 数据缺失率 < 0.5%、7 项 DQ 检查全过、baseline MAPE ≤ 6%
- scope: phases/P0/scope.md

### P1: 模型选型 spike（3 周）
- 目标: 三候选并行 spike，选定生产模型
- 退出: 三份 spike 报告 + 选型 ADR
- scope: phases/P1/scope.md

### P2: 特征 + 训练（5 周）
### P3: 在线推理（3 周）
### P4: 灰度（4 周）
### P5: 切换 + 收尾（3 周）

## §4 关键假设
| # | 假设 | 验证 phase | 失败 fallback |
|---|---|---|---|
| A1 | LightGBM 推理延迟 P95 ≤ 200ms | P1 | 砍特征 / onnx 加速 / 退 SARIMA + 残差校正 |
| A2 | 历史 3 年数据足够支撑 LSTM | P1 | 砍 LSTM，专攻 LightGBM |
| A3 | OpenWeather 4h 预报误差 < 老系统 | P0 | 接 ECMWF（成本高）|
| A4 | 调度员能接受黑盒模型 | P4 | 加 SHAP 解释面板 |

## §5 项目级红线
- 灰度期间老系统必须保持 fallback 可用，禁止直接切换
- 任何模型变更必须经过验证集 MAPE 评估
- 节假日表来源切换必须双源对齐 1 年才上线

## §6 反模式拦截
- "再调一调超参" — MAPE 停滞 ≥ 1 周强制回到数据 / 特征层 review
- "灰度看着还行就切" — P4 退出门槛硬性 4 周连续达标
- "节假日特殊情况单独处理" — 必须作为正常特征，规则只在 ADR 批准后允许

## §7 依赖图
P0 → P1 (验证 A1/A2/A3) → P2 → P3 → P4 (验证 A4) → P5
```

### 3.4 phase scope.md：模板 + 5 项产出原则

phase scope.md 是 phase 内的 SSoT。**§6 checklist 就是状态记录**。

#### 3.4.1 模板

```markdown
# Phase N: <名称> — Scope

## §0 重要警告（如有，AI 必读）
<本 phase 特有的反模式 / 注意事项>

## §1 目标 / 范围 / 退出门槛
- 目标: <对应 master-plan §3 P_N，展开>
- 范围内 / 范围外（避免漂移）
- 退出门槛（hard gate）: <非主观可验证>

## §2 工具栈

## §3 工作切片 Δ1-ΔN
### Δ1: <名称>
- scope / 产出 / 命令 / 验证

## §4 产出文件清单
<总览所有产出，按 5 项原则设计>

## §5 关键设计决定 / 注意事项

## §6 退出 checklist
- [ ] Δ1 完成（具体产出文件就位）
- [ ] Δ2 完成
- ...
- [ ] phase 报告 sealed

## §7 Sealed（phase 完成时 append）
- Sealed at: <YYYY-MM-DD>
- Tag: P<N>-complete-<YYYY-MM-DD>
- Branch state: <which branch sealed, merge status>
- Outputs: <path 列表 + 文件数>
- Cross-phase artifacts: <ADR / rules / debts append link>
- Next phase: P<N+1> — see master-plan §3 P<N+1>
- Next scope.md: phases/P<N+1>/scope.md（status: ...）
- Handoff status: <self-contained / handoff doc link>
```

§6 全部 ✓ + §7 Sealed 写满 = phase 可关闭。§7 是 phase 完成的 self-describing snapshot——fresh session 启动时直接 derive 出"phase 已 sealed"，**不需要外部状态文件**（99-progress 类汇总文件是 summary，不是 SSoT；scope.md §7 才是 SSoT）。

##### Session 启动 derive logic

```
1. read phases/<latest>/scope.md
2. 检查 §7 Sealed 是否存在？
   - 不存在 → phase 进行中，§6 第一个 unchecked = 下一步
   - 存在 → phase 已 sealed，检查 phases/P<N+1>/scope.md
3. 检查 phases/P<N+1>/scope.md 是否存在？
   - 不存在 → 提示 user "P<N> sealed, P<N+1> 未启动，需要 /phase-scope-init P<N+1>?"
   - 存在 → 切到 P<N+1> 工作流
```

##### §0 重要警告 input source

§0 不是手写白板。生成时机：`/phase-scope-init P<N+1>` skill 自动 query：

1. 上 phase 进度记录 / valuable discoveries（过滤工程视野级别）
2. 上 phase ADR 浮现的关键 design 选择
3. 上 phase debts.md active items（impact P<N+1> 的）

§0 更新时机：phase 进行中浮现 critical 警告，**stop ping** user → §0 append。

#### 3.4.2 §4 产出物的 5 项设计原则

|#|原则|拷问|
|---|---|---|
|1|回答一个明确问题|"这份文档回答什么问题？"|
|2|有明确消费者|"谁会读它？下一 phase 哪一步用？"|
|3|退出门槛可量化|"怎么算完成？非主观条件是什么？"|
|4|形式匹配处理者|"机器读 → JSON；人审 → MD"|
|5|MECE 覆盖|"总产出列表是否漏一类 / 重复？"|

> **如果一个产出说不清"回答什么 + 给谁用"，砍掉它。**

#### 3.4.3 实例：负荷预测项目 P0 scope（节选）

```markdown
# Phase 0: 数据 + 基线 — Scope

## §0 重要警告
- 不要在 P0 做模型选型——那是 P1 的事；P0 只复刻老系统作为 baseline
- 不要"先做特征工程再说"——P0 不做特征
- 节假日表先用旧系统手工版（DEBT-04），自动化推迟到 P5

## §1 目标 / 范围 / 退出门槛
- 目标: 三源数据整合为干净训练集 + SARIMA baseline
- 范围内: SCADA / 气象 / 节假日清洗 + EDA + SARIMA
- 范围外: 任何特征工程 → P2；任何 LightGBM/Prophet/LSTM → P1
- 退出门槛:
  1. 三源数据缺失率 < 0.5%、时间无 gap
  2. 7 项 DQ 检查全过
  3. SARIMA 验证集 MAPE ≤ 6%（与老系统持平）

## §3 工作切片
### Δ1: SCADA 清洗（3 天）
- 产出: scripts/clean-scada.py / outputs/scada-clean.parquet / reports/scada-quality.md
- 验证: 行数 ≈ 105 万 ± 1%；时间无 gap > 1h

### Δ2: 气象回填（2 天）
### Δ3: 节假日导入（1 天）
### Δ4: 数据质量 7 项检查（3 天）
### Δ5: SARIMA baseline（5 天）

## §4 产出清单
| 产物 | 回答什么 | 消费者 | 形式 |
|---|---|---|---|
| outputs/scada-clean.parquet | 清洗后 SCADA | P1/P2 训练 | Parquet |
| outputs/weather-history.parquet | 对齐气象历史 | P1/P2 训练 | Parquet |
| outputs/holidays.parquet | 节假日标签 | P1/P2 训练 | Parquet |
| reports/data-quality.md | 7 项检查报告 | 退出门槛实证 | MD |
| reports/baseline-mape.md | SARIMA 复刻结果 | 退出门槛实证 | MD |

## §6 退出 checklist
- [ ] Δ1: outputs/scada-clean.parquet + reports/scada-quality.md sealed
- [ ] Δ2: outputs/weather-history.parquet + reports/weather-coverage.md sealed
- [ ] Δ3: outputs/holidays.parquet 就位
- [ ] Δ4: reports/data-quality.md 7 项全过
- [ ] Δ5: reports/baseline-mape.md 显示 MAPE ≤ 6%
- [ ] 数据集 dvc 版本化、baseline 模型 mlflow 注册
- [ ] phase 报告 sealed
```

#### 3.4.4 Δ vs 子 Δ 区分

实际工作中，phase 切片粒度和 micro-progress 粒度需要区分：

- **Δ**（phase 级里程碑）：≤ 10，scope.md §3 列 Δ1, Δ2, ..., Δ_N
- **子 Δ**（Δ 内部 micro-progress）：**任意细分**，不算 phase 切分粒度

子 Δ 的常见 trigger：

- stop ping 中断 + 后续修订 → Δ7.5 → Δ7.5a 修订 → Δ7.5b 重新 ping
- 工程纪律 calibration 子段 → Δ7.6a / Δ7.6b / Δ7.6c
- 防御 / 设计重做 → Δ5 v1（failed）→ Δ5 v2（redo）

判定：

- 子 Δ **不进 scope.md §6 checklist**（checklist 仅 Δ 级）。子 Δ 在 phase 进度记录或 commit message 中累积。
- 子 Δ **不打 tag**（tag 仅 phase 级）。

### 3.5 master-plan 与 phase-scope 的衔接

两个模板有刻意的**层次同构性**：

```
master-plan §3 里程碑 P_N            (一句话级)
   ├─ 目标:        ↔  phase-scope §1 目标（展开）
   ├─ 退出门槛:    ↔  phase-scope §1 退出门槛（量化具体）
   └─ scope link:  ↔  phases/P_N/scope.md（完整展开）
```

每个 P_N 在 master-plan 是**一句话定位**（≤ 3 行），在 phase-scope 是**完整展开**。这种"概览—展开"的结构让两份文档的角色一目了然。

> **master-plan 不重抄 phase-scope 的内容；phase-scope 不重抄 master-plan 的目标。**

### 3.6 Skill 助力 CRoSS 写作

写 master-plan / phase-scope 不应让人从空白页开始。下面 4 个 skill 让 AI 主动引导（详见附录 A）：

|Skill|触发|作用|
|---|---|---|
|`/master-plan-init`|项目启动|引导用户答 7 项标准，AI 起草 master-plan v0|
|`/phase-scope-init`|进入新 phase|基于 master-plan §3 P_N 起草 phase-scope v0|
|`/scope-review`|写完 scope|跑 7 / 5 项标准逐条 challenge|
|`/scope-distill`|会话末|检查 scope §6 是否反映真实进度，自动勾选已完成 Δ|

> **写 CRoSS 不是孤独地填空白模板，是和 AI 对答跑标准 challenge。**

---

## 04 Constitution：被遗漏的中间层

### 4.1 Constitution 的载体与加载时机

|载体|回答的问题|加载时机|
|---|---|---|
|`CLAUDE.md`|启动时 AI 必须知道的最高优先级摘要 + 路由|session 启动**自动加载**|
|`phases/PN/scope.md`|当前 phase 工单 + 状态（§6 checklist）|当前 phase 工作时 **AI 主动 read**（CLAUDE.md §8 指针引导）|
|`docs/master-plan.md`|项目蓝图（里程碑）|AI 需要跨 phase 上下文时 read|
|`docs/{master-plan 附属契约}.md`|项目级伴随契约（如 surface 设计）|AI 涉及对应领域时 read|
|`docs/rules/*.md`|详细规则（含 git-protocol、anti-patterns）|AI **触及对应领域文件时**同步 read|
|`docs/decisions/ADR-*.md`|决策档案|AI 重新评估某决策时 read|
|`docs/debts.md`|债务清单|AI 接触某债时 read|
|`git history`|隐式 HANDOFF：what + why + tried|session 启动时 git log **自动加载**|

加载时机分三类：

- **自动**：session 启动 / git log 自动跑
- **AI 主动 read**：基于 CLAUDE.md §8 触发性指针
- **AI 触及时 read**：编辑某领域文件时同步 read 对应 rules

### 4.2 CLAUDE.md：模板 + 实例

CLAUDE.md 是 Constitution 的入口。八个区块**按"严重度递降 + 历史 + 现状 + 路由"排序**——这个顺序本身就是 AI 阅读时的优先级提示。

#### 4.2.1 模板

```markdown
# <项目名> · Agent Notes

> 本文件是项目宪法。修改需团队共识，并登记到 docs/decisions/。

## §1 项目身份
- 项目名 + 一句话定位 + Stack + 仓库结构核心

## §2 协作模型
- 人主导 / Pair / AI 主导，分别是哪些目录、为什么

## §3 红线（违反 = 系统坏）
- 业务不变量、契约、安全约束

## §4 反模式（违反 = 隐性 bug）
- AI 容易写出但本项目不要的东西

## §5 偏好（违反 = 不一致但能跑）
- 多种合法选择中我们选哪种

## §6 决策速记（速记 + 指针！）
- 一句话清单（详情 docs/decisions/ADR-*.md）

## §7 已知债务（速查 + 指针！）
- top 3-5（详情 docs/debts.md）

## §8 触发性指针
- 项目蓝图 → docs/master-plan.md
- 当前 phase → phases/`<current>`/scope.md
- 改特征 → docs/rules/feature-engineering.md
- git 协议 → docs/rules/git-protocol.md
```

#### 4.2.2 §3 / §4 / §5 为什么必须按严重度递降

这三个区块都是"约束"——但严重等级不同，必须分开：

- **§3 红线**：违反 = 系统坏（数据脏 / 安全漏 / 契约破 / 不可逆损失）
- **§4 反模式**：违反 = 隐性 bug（看起来 ok，时间一长爆雷；测试可能跑不出来）
- **§5 偏好**：违反 = 不一致但能跑（风格不齐 / 选型不一；不影响正确性）

把它们混在一起会导致 AI 把"风格建议"和"安全红线"当成同一严重程度——结果要么过严（什么小事都拦），要么过松（红线被当建议绕过）。

按严重度从高到低排，AI 内化的优先级就对了：**它知道前面的不能违反，后面的可以根据上下文权衡。**

#### 4.2.3 §6 / §7 必须是速记 + 指针，不是详情

每条**一行**，详情在 docs/。AI 启动时只需要"知道这些决定已经做了"，需要详情时通过 §8 指针延伸。

#### 4.2.4 实例（负荷预测项目）

```markdown
# region-load-forecast · Agent Notes

## §1 项目身份
- 项目: 华东某省电网短期负荷预测系统（24h 滚动）
- Stack: Python 3.11 / LightGBM / FastAPI / PostgreSQL
- 仓库结构: src/{data,features,models,api}/, docs/, phases/

## §2 协作模型
- 人主导: src/models/production/（错了影响电网调度）
- Pair: src/features/（错误会导致样本泄漏，难发现）
- AI 主导: scripts/, tests/, docs/

## §3 红线
- 训练 / 测试集严格按时间切分，**禁止 random split**
- 所有特征必须能在生产实时计算
- 推理延迟 P95 ≤ 200ms

## §4 反模式（详见 docs/rules/anti-patterns.md）
- 不要"顺手"把同步 API 改成异步
- 不要在特征里加跨样本统计

## §5 偏好
- 时序处理优先 polars 而非 pandas
- 错误用 Result type，不用 throw 当控制流

## §6 决策速记（详见 docs/decisions/）
- ADR-003: LightGBM 作主模型，否掉 LSTM
- ADR-007: 用 PostgreSQL TSDB 扩展
- ADR-012: 特征版本化用 feast

## §7 已知债务（详见 docs/debts.md）
- DEBT-04: holiday 表只到 2026 年底
- DEBT-09: 气象 API 无备份源

## §8 触发性指针
- 项目蓝图 → docs/master-plan.md
- 当前 phase → phases/`<current>`/scope.md
- 改特征 → docs/rules/feature-engineering.md
- git 协议 → docs/rules/git-protocol.md
```

#### 4.2.5 §3 / §4 / §5 简单 vs 复杂的处理

|情况|处理|
|---|---|
|红线 ≤ 10 条|直接写 CLAUDE.md §3|
|红线 > 10 条|CLAUDE.md §3 写摘要，详细 docs/rules/redlines.md|
|反模式 ≤ 5 条|直接写 CLAUDE.md §4|
|反模式 > 5 条|§4 写指针 → docs/rules/anti-patterns.md|
|偏好 ≤ 10 条|直接写 §5|
|偏好 > 10 条|docs/rules/preferences.md|

> **CLAUDE.md 装得下就装；装不下就指针外置。**

### 4.3 docs/ 物理结构 + rules 两层来源

#### 4.3.1 docs/ 物理结构

```
docs/
├── master-plan.md                # 里程碑（≤10）
├── public-api-surface.md         # master-plan 附属契约（如有）
├── mece-decomposition.md         # master-plan 附属契约（如有）
├── rules/                        # 详细规则（必须目录）
│   ├── engineering-discipline.md
│   ├── feature-engineering.md
│   ├── anti-patterns.md
│   ├── standing-judgments.md
│   └── git-protocol.md
├── decisions/                    # 决策档案（必须目录）
│   ├── ADR-001.md
│   └── ADR-003.md
├── debts.md                      # 单文件（默认）；超 50 条才拆
└── phases/                       # phase 工作目录
    ├── P0/
    └── P1/
```

判定：

- **rules / decisions 必须是目录**——每条独立读、版本化
- **debts 默认单文件**——超 50 条 / 1500 行才拆为 `debts/{active.md, resolved/YYYY.md}`
- **不加 evolving/ 包装层**——路径越短越好

##### ADR 命名 convention

|项目类型|命名|
|---|---|
|**Single-phase**（小 / 中项目）|sequential global：`ADR-001.md` / `ADR-002.md` / ...|
|**Multi-phase**（大项目，推荐）|phase scoped：`D-P0-XX.md` / `D-P1-XX.md` / ...|

multi-phase 项目用 phase scoped 命名的好处：

- counter 每 phase reset，编号不会爆
- ADR 编号 reflect phase 边界，看名字就知道是哪 phase 浮现
- `decisions/README.md` 维护 phase scoped index

#### 4.3.2 rules 的两层来源

rules 不只来自一个地方。它有两层来源：

|层|来源|位置|CLAUDE.md 处理|
|---|---|---|---|
|**L1**|**跨项目通用 rules**（团队 / 公司 / 业内沉淀）|上级 / 共享 rules 库（如 `~/team-rules/`）|引用："详见 ~/team-rules/test-driven.md"|
|**L2**|**项目特定 rules**（这个 repo 永真）|`docs/rules/*.md`|"详见 docs/rules/feature-engineering.md"|

**注意**：phase 内浮现的内容**不需要单独一层**——它按形态分流到 ADR / rules / debts / phase scope 四个去处。很多浮现是**混合形态**，简单二分类不够，按下表分流：

| 形态 | 落点 | 例子 |
|---|---|---|
| 一次性架构 / 选型决定（选 A 不选 B，**之后不再讨论**）| ADR（decisions/）| "选 PostgreSQL 而非 MongoDB" / "vitest 1.6.1 锁定" |
| 工作中浮现的**通用规则**（跨 phase 应用，不只一次性）| rules/ | "禁止跨样本统计" / "Q1-Q6 self-check 全集" |
| **决策 + 规则 混合形态**（决定本身也是后续规则）| **decisions/ + rules/ cross-link** | "时序数据二分类原则"（决策 ADR + 规则 rules）|
| 主动接受的 incomplete state（走捷径 / 推迟）+ 还款条件 | debts.md | "节假日表只到 2026 年底" / "call-site test deferred to next phase" |
| Phase 内部一次性流程决策（setup / Δ 顺序 / 等）| **不进 docs/decisions/**，留在 phase scope.md | "Δ1 子里程碑切分 / 工具栈选择" |

##### 决策树

```
浮现一个内容：
1. 是不是"主动接受不解决"？ Yes → debts.md（有还款条件）
   No → 2
2. 是不是"phase 内部 setup / 一次性顺序"？ Yes → 留 scope.md
   No → 3
3. 是不是"跨 phase 应用的规则 / 模式"？ Yes → rules/（ADR cross-link 推到通用规则的过程）
   No → 4
4. 是不是"一次性架构 / 选型决定"？ Yes → ADR（decisions/）
   No → 重新审视——可能其实是 valuable discovery 不是 decision
```

ADR 是规则的**诞生通道**——任何项目级规则都先经过一次 ADR 评审，确认后再沉淀到 rules/。

#### 4.3.3 跨项目流动

```
L2 (项目永真) → 跨项目验证 → L1 (团队通用)
docs/rules/                  ~/team-rules/
```

例子：负荷预测项目的"禁止跨样本统计"规则，跨多个 ML 项目都成立 → 沉淀到团队共享 rules（L1）。

#### 4.3.4 rules / ADR / debts 的具体例子

参见**附录 B：rules / ADR / debts 实例**。

### 4.4 渐进式披露

```
L1  CLAUDE.md            启动必读，200-500 行
       ↓ 触发性指针
L2  docs/{master-plan, master-plan 附属契约, rules/, decisions/, debts.md}   按需读

+   phases/`<current>`/scope.md     当前 phase 工作时必读
+   git history                   自动加载（log + diff）
```

判断标准：

- **L1**：高频读、最高严重度、每次启动都需要的
- **L2**：详细、低频读、按需触发

### 4.5 人 vs AI 分工

> **人定方向，AI 写执行；人审约束，AI 起草细节。**
> 
> 人是立法者 + 审稿人，AI 是写手 + 速记员。

|文档|主写|谁审|
|---|---|---|
|`CLAUDE.md`|**人**|人|
|`master-plan.md`|**人**（Strategic CRoSS）|人；AI 跑 7 标准评审（见 §3.3.2）|
|`master-plan 附属契约`|**人**|人|
|`phases/PN/scope.md`|**人**（Tactical CRoSS）|人；AI 起草初版|
|`rules/*.md`|人列 + AI 起草|人|
|`decisions/ADR-*.md`|**AI 起草**|人|
|`debts.md`|**AI 主写**|人偶尔回顾|
|`phases/PN/{scripts,outputs,reports}/`|AI 主写|人验收|
|`README.md`|**人**|人|

反模式：

- ❌ AI 写红线 / master-plan / 附属契约（越权）
- ❌ 人写 ADR 全文（费时；AI 起草 → 人审更高效）
- ❌ AI 改 master-plan 而不打 git tag（破坏 SSoT）

### 4.6 phases/ 目录与命名规范

phase 是 Tactical CRoSS 的执行场所：

```
phases/PN/
├── scope.md            # ★ phase 主文档
├── scripts/            # 可重跑脚本
│   ├── scan-api.ts
│   └── callsites.ts
├── outputs/            # 脚本产物（机器可读，退出门槛实证）
│   ├── scada-clean.parquet
│   └── weather-history.parquet
├── reports/            # 阶段性报告（人审）
│   ├── scada-quality.md
│   ├── weather-coverage.md
│   ├── data-quality.md
│   └── baseline-mape.md
└── issues.md           # 错误日志（按需）
```

#### 命名规范

|子目录|规则|例子|
|---|---|---|
|`scripts/`|按功能命名|`clean-scada.py` / `fetch-weather.py`|
|`outputs/`|按数据类型命名|`scada-clean.parquet` / `holidays.parquet`|
|`reports/`|**按主题命名**（自解释）|`scada-quality.md` / `baseline-mape.md`|

> **反对纯数字编号**（如 `11a` / `11b`）——脱离上下文不可读。 **用主题命名让文件名自解释**——AI 看名字就知道内容。

#### 产物分类与 git 处理

|类型|进 git?|位置|
|---|---|---|
|脚本本体（可重跑）|✅|scripts/|
|配置（驱动脚本）|✅|scripts/|
|一次性产物（小，<50MB）|✅|outputs/|
|大型数据产物（>50MB）|❌（用 dvc 等）|outputs/（dvc 跟踪）|
|衍生产物（可 derive）|⚠️ 可选|outputs/|
|阶段性报告|✅|reports/|
|临时调试|❌|git stash 或 .gitignore|
|node_modules / .cache|❌|.gitignore|
|错误日志|✅|issues.md|

### 4.7 HANDOFF 可消亡

跨会话 AI 失忆，需要恢复记忆。但**多数记忆都已经在磁盘上**：

- 项目身份 / 红线 / 蓝图 / 规则 / 决策 / 债务 → CLAUDE.md / docs/
- 当前 phase 状态 → phases/`<current>`/scope.md §6 checklist + §7 Sealed
- 已完成的工作 → git log + reports/
- 中间脚本与产物 → scripts/ + outputs/

> **HANDOFF 不是必需品。它是良好习惯缺位时的拐杖。**

#### 3 条核心习惯（必须）

1. **双层 SSoT** — master-plan 列里程碑（粗粒度）+ phases/PN/scope.md §6 列 Δ checklist（细粒度）；§6 实时维护（完成一项立刻 ✓）
2. **想法当时落地** — 新决策即时 → ADR；新规则即时 → rules/；新债务即时 → debts.md；**不囤积到 phase 收口**
3. **产物归位** — 机器可读 → outputs/；人审 → reports/；可重跑 → scripts/

**3 条核心到位 = 不需要 HANDOFF。**

#### 2 条可选习惯（看场景）

4. **commit 含 next-step** — 适合 multi-developer / 多 session / 长 phase。不适合 single-developer + scope.md §6 实时维护到位的 case。
5. **错误入文件**（issues.md）— 适合后续会查的 post-mortem（失败 attempt 触发新决策 / 新规则）。不适合一次性失败 attempt（过程性 noise，不留）。

可选不做不影响 baseline。

#### 反例：为什么 handoff doc 不需要

如果 3 核心习惯到位，fresh AI session 启动只需：

1. 自动加载 CLAUDE.md（routing）
2. read phases/`<current>`/scope.md（§6 进度 + §7 Sealed status）
3. read git log -10
4. 看 git 工作目录尚未提交的修改

→ 完整 context recover，不需要 handoff doc 拐杖。

如果 3 核心习惯**没到位**（scope.md §6 stale / 决策没落 ADR / 产物乱放），fresh session 困惑 → 才需要 handoff doc 当拐杖。**handoff doc 是症状 fix，3 核心习惯是根因 fix。**

### 4.8 git 协议

git 协议是 Constitution 的一部分，正式声明在 `docs/rules/git-protocol.md`。**详细规则不需要人记**——通过附录 A 的三个 skill（`/commit`、`/rollback`、`/phase-complete`）让 AI 自动执行。

本节只讲核心理念。

#### commit message = 隐式 HANDOFF

写得好的 commit message 让 git log 直接成为下任 AI 的 HANDOFF：

```
<type>(<phase>/<Δ>): <一句话 what>

<why>                        ← 必填（非 trivial 变更）
<tried-and-failed>           ← 选填（避免下任重踩）
<next-step / leftover>       ← 选填（离开前最后一个 commit 必填）

Refs: phases/PN/scope.md / [ADR-XXX] / [DEBT-XX]
```

实例：

```
feat(P0/Δ1): clean SCADA historical data, drop sensor faults

Why: per scope.md P0 Δ1, raw CSV has ~0.3% sensor fault rows
(value=0 with status=BAD); these break SARIMA fitting.
Tried median imputation first, but creates spurious flat lines;
reverted to drop+forward-fill.

Refs: phases/P0/scope.md §3 Δ1
```

#### 三档判断（详见附录 A `/commit` skill）

- **AI 自动**：写新代码 + 测试通过 / 重构 + test 全绿 / 改 debts.md / 改 scope.md §6
- **人审**：ADR 草稿 / 改 rules / 改 CLAUDE.md / 改 master-plan / 改 schema / 删 ≥ 50 行
- **禁止**：测试失败时强行 commit → 必须 rollback

#### git tag 规则

只在 phase 完成时打 tag（如 `P0-complete-2026-05-02`），不在每个 Δ 都打。

#### phase = branch 模式（推荐）

phase 收口 = merge to main + tag。具体：

- `main` 累积 stable / 可发布的 phase 收口
- `refactor/PN` 是 current phase working branch
- phase 收口流程：
  1. scope.md §6 全 ✓ + §7 Sealed 写满 verify（见 §3.4.1）
  2. `git checkout main && git merge --ff-only refactor/PN`（或 `--no-ff` 保留 branch history）
  3. `git tag -a P<N>-complete-<YYYY-MM-DD>`
  4. `git checkout -b refactor/P<N+1>` 启动下 phase

工程语义——phase isolation 在 git layer 实现：

- `main` = 已收口 phases 累积（stable / 可发布）
- `refactor/PN` = 当前 phase 工作 branch（可能含 mid-flight 状态）
- `git log main` 跨 phase 历史（每条 = phase 收口 merge commit）
- `git log refactor/PN` 当前 phase 内部 cycle

**替代 pattern**：single branch + tags（适合 small / single-developer 项目）。phase = branch 适合 multi-phase / multi-developer / 需要 phase isolation 的场景。

**跨上游 fork sync**：`git fetch upstream` + `git merge upstream/main` 到 main（不动 refactor/PN branch）。

#### rollback 协议（详见附录 A `/rollback` skill）

- 测试 fail → 立刻 `git reset`，**不在红色基础上修**
- 跨 Δ rollback → 取消 scope.md §6 勾选
- 跨 phase rollback → **必须人审** + 删 git tag + 改 master-plan

### 4.9 多仓 / 多 cwd 协作

某些项目天然多仓：被重构库 + 消费者应用 / monorepo + satellite packages / 库 + SDK / 等。原则：**每仓有自己的 CLAUDE.md + docs/**，**Claude Code session per cwd 独立**。

#### 设计原则

1. **每仓 self-contained CLAUDE.md** — 不跨仓 reference（跨仓 reference fragile）
2. **跨仓引用通过 commit message** — `Refs: <other-repo>@<sha>` 段
3. **被重构对象的 surface 契约** 放被重构对象的仓（消费者通过 git submodule / npm dep / 手工 sync 获取）
4. **多 cwd Claude Code session 是常态** — 用户协调，不需要 "master session"

#### 反模式

- ❌ 在消费者仓建被消费者的设计文档（应放回被消费者的仓）
- ❌ Claude Code 试图跨 cwd 切目录工作（"从 A 仓 cwd 启动改 B 仓代码"）
- ❌ 假设两仓 git history 是 unified（每仓独立 history，跨仓只通过 commit ref）

#### Phase 边界跨仓 case

某些 phase 跨仓影响（库的某个 phase = 消费者端切换）：

- 库仓 `phases/PN/scope.md §X` 显式标注 "cross-repo phase"
- 消费者仓单独有"切换工单"（可能不是消费者仓 phase 的 PN，消费者仓有自己的 phase 序列）
- 跨仓协调：用户协调 + commit ref + scope.md cross-link

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

session 启动时 Claude Code 自动扫描 cwd 找 CLAUDE.md。`/memory` 命令查看加载状态。

> CLAUDE.md 越小、越精，加载成本越低。

### 5.2 H — Hook

事件点（PreToolUse / PostToolUse / PreCommit）强制触发 shell 命令。

> 红线靠提示，hook 靠绞索。

举例：本项目"禁止 random split"是红线，PreToolUse hook 在 Edit `train.py` 时检查 `shuffle=True` 命中就拦。

### 5.3 A — Agent

主 Agent 派子 Agent，独立 context window，并行处理。模型对比派三个子 Agent 同时跑 LightGBM / Prophet / LSTM。**核心价值是上下文隔离**。

### 5.4 S — Skill

元数据常驻 context（很轻），body 仅在被触发时加载。`/master-plan-init`、`/phase-scope-init`、`/commit`、`/rollback`、`/phase-complete`、`/review-features` 都是 skill。

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
|**MCP**|标准化协议、跨环境|协议本身有 token 成本（已优化）|

简单决策：

- 本地 Claude Code 操作本地文件 / git / npm → **CLI**
- 接 SaaS（Jira / Gmail / 企业 DB）→ **MCP**
- 云端 Agent（Cowork / Chrome 插件）→ **MCP**（没 shell）

#### 两个关键改进

社区批 MCP 最猛的两个痛点，Anthropic 都改了：

**1. 工具按需加载**——以前所有工具 schema 全塞 context，工具一多 token 就爆。改成"先注册搜索入口，工具按需读"。同一任务 token 用量从 15 万降到 2 千。这正是你 `/context` 输出里看到的 "MCP tools: loaded on-demand"。

**2. 沙箱里先处理再返回**——以前调完工具，原始 JSON 全量塞回 context（取一份 1 万行 spreadsheet 全进 context）。改成**让 Agent 写代码调工具，沙箱里 filter 完只返回决策需要的几行**：

```python
# 老方式：1 万行全进 context
TOOL CALL: gdrive.getSheet(...) → 10,000 行进 context

# 新方式：沙箱 filter，只返回 5 行
rows = await gdrive.getSheet({...})
pending = rows.filter(r => r.Status === 'pending')
console.log(pending.slice(0, 5))   # model 只看 5 行
```

> Model 不再是数据搬运工，只看决策需要的东西。

#### Skills + MCP 互补

- **Skills 教 Agent "怎么做"** —— 流程知识（如何排查、如何审查）
- **MCP 给 Agent "用什么做"** —— 工具接入（kubectl、Jira、SCADA 数据库）

举例：电网运维 plugin = Skills 写排查流程 + MCP 提供 `kubectl` 和数据库工具。打包分发，Agent 装上就能干活。

---

## 06 完整工作流（负荷预测）

### Day-1：项目初始化（CRoSS-Strategic）

```
/master-plan-init   ← skill 引导写 master-plan
```

**人写**：

- master-plan.md（基于 skill 引导，跑 7 标准）
- CLAUDE.md（八区块）
- docs/rules/{git-protocol, anti-patterns, ...}.md 骨架

**AI 起草，人审**：

- docs/rules/ 详细规则
- README.md
- 安装附录 A 的 skill

### Day-N（进入新 phase）：CRoSS-Tactical

```
/phase-scope-init P0   ← skill 基于 master-plan §3 P0 起草 phase-scope
```

**人写 / 人审**：

- phases/P0/scope.md（§1-§6 完整）

### Day-M（phase 内每次会话）：执行 Δ

新会话启动：

```
1. 自动加载 CLAUDE.md
2. 读 phases/`<current>`/scope.md
3. 看 §6 checklist 找第一个 unchecked Δ
4. 跑 git log -10 看上次进展
5. 开干
```

phase 内 CHASM 自动跑：

- Hook 拦截：写 `shuffle=True` 时被拦
- Agent 派发：模型对比派三子 Agent
- Skill：`/review-features` 自动检查泄漏；`/commit` 自动跑三档判断
- MCP：通过企业 DB MCP server 拉 SCADA

### Day-K：phase 完成

```
/phase-complete   ← skill 验证 §6 全 ✓ + 写 §7 Sealed + 打 tag + 初始化下一 phase
```

### 交接

```
/clear
"接手当前项目"
```

新会话自动加载 CLAUDE.md → 读 phases/`<current>`/scope.md → `git log -10` → 接续。**不需要 HANDOFF。**

---

## 07 重塑编程生产力

软件开发的演进史，就是不断制造高级工具来"跨越复杂性鸿沟"的历史。AI 编程是这个序列里最新的一跳，但有一个根本不同：**AI 是有状态的、易失的、需要被"教育"的协作者**——不是无状态工具。

光有"工具箱"（CHASM）不够，光有"指挥术"（CRoSS）也不够。你必须把**指挥**沉淀成**章程**，让章程**自动驱动**工具箱。**Constitution 这一中间层，是协议的核心。**

未来开发者的核心竞争力按三层映射：

**CRoSS 层（人的意图）**：

1. **战略意图力**——写出好的 master-plan
2. **战术规划力**——写出好的 phase scope.md

**Constitution 层（沉淀章程）**： 3. **协议设计力**——蒸馏出强健的 Constitution

**CHASM 层（执行机制）**： 4. **基础设施力**——组装合用的 CHASM

**元能力（让飞轮转起来）**： 5. **协议演进力**——持续蒸馏，让飞轮越转越快 6. **分工判断力**——知道哪些自己写、哪些 AI 写、哪些一起写

> **用 CRoSS 临时指挥（Strategic 写蓝图，Tactical 写工单），让 Constitution 持久生效，靠 CHASM 自动执行。**
> 
> **master-plan 列里程碑（≤10），phase scope 列工作切片（≤10）。两层都不超过 10——人脑 working memory 上限。**
> 
> **三层一旦运转成飞轮，鸿沟就只跨一次，从此都在桥上。**

这，就是 AI 时代真正能跨越复杂性鸿沟的人机协议。

---

## 附录 A：CRoSS / git 协议作为 Skill

下面 7 个 skill 让 AI 自动执行写作和 git 协议——**人不需要记规则，AI 跑 skill 即可**。

### Skill 部署位置

|类型|位置|例子|
|---|---|---|
|**跨项目通用 skill**（Constitution-level，任何项目都用）|`~/.claude/skills/`（user 全局）|`/master-plan-init` / `/phase-scope-init` / `/scope-review` / `/scope-distill` / `/commit` / `/rollback` / `/phase-complete`|
|**项目特定 skill**（只在本 repo 有意义）|`<project-root>/.claude/skills/`（项目本地）|`/scan-callsites` / `/review-features` / `/orchestrator-review`|

**Skill load priority**：项目本地 > user 全局（同名时项目本地覆盖）。

下面 7 个 skill 都属于第一类（跨项目通用），推荐放 `~/.claude/skills/`。

### A.1 `/master-plan-init` — 引导写 master-plan

文件：`.claude/skills/master-plan-init/SKILL.md`

```markdown
---
name: master-plan-init
description: Guide user through writing a master-plan based on 7 standards
---

Walk user through 7 questions, draft master-plan v0, then run /scope-review.

## Step 1: Project size check

Ask: "How many phases / how long do you estimate?"
- 1 phase / weeks → suggest "skip master-plan, write phases/P0/scope.md only"
- 2-3 phases / quarters → suggest minimal master-plan (§1-§3)
- multi-phase / months+ → full master-plan (§1-§7)

## Step 2: Walk through 7 standards

Ask one at a time:
1. **Why** — business value + cost of not doing
2. **Done state** — observable final state
3. **Phases & exit gates** — phase split + non-subjective gates
4. **Key assumptions** — which need spike validation (fact propositions, not behaviors)
5. **Project-specific redlines** — distinct from CLAUDE.md §3 redlines
6. **Anti-patterns** — historical failure behaviors + interception
7. **Dependencies** — pre/post requirements

After each answer, challenge:
- "Is this measurable?"
- "What if this assumption fails?"
- "Has this redline been broken before?"

## Step 3: Draft v0

Generate master-plan.md with all sections. Show user.

## Step 4: Trigger /scope-review

Run /scope-review on the draft.
```

### A.2 `/phase-scope-init` — 起草 phase-scope

文件：`.claude/skills/phase-scope-init/SKILL.md`

```markdown
---
name: phase-scope-init
description: Draft phases/P_N/scope.md based on master-plan §3 P_N
---

Usage: `/phase-scope-init P0`

## Step 1: Read upstream

- Read master-plan.md §3 P_N (the milestone description)
- Read previous phase's scope.md and reports/ (if applicable)
- Read CLAUDE.md §3-§5 for project context

## Step 2: Draft scope.md sections

Generate phases/P_N/scope.md skeleton (template per §3.4.1).
Expand master-plan §3 P_N goal/exit into full scope §1.
Don't duplicate text from master-plan; expand instead.

## Step 3: Trigger /scope-review on the draft
```

### A.3 `/scope-review` — 评审 master-plan 或 phase-scope

文件：`.claude/skills/scope-review/SKILL.md`

```markdown
---
name: scope-review
description: Critically review a master-plan or phase-scope against standards
---

Usage: `/scope-review docs/master-plan.md` or `/scope-review phases/P2/scope.md`

## For master-plan: run 7-standard challenge

For each of §1-§7:
- §1 Motivation: "Is the cost of NOT doing this concrete?"
- §2 Done state: "Can a stranger tell if it's done?"
- §3 Phases: "Is each gate non-subjective?"
- §4 Assumptions: "Is each a fact-proposition (yes/no testable)? Or did you mix in a behavior pattern?"
- §5 Redlines: "Are these distinct from CLAUDE.md §3?"
- §6 Anti-patterns: "Each has 'how to intercept' clause?"
- §7 Dependencies: "Any implicit chains? (M5 assumes X but no phase produces X)"

Output a list of issues, severity (block/warn/nit), suggested fix.

## For phase-scope: run 5-principle challenge on §4

For each deliverable:
- "What question does it answer?"
- "Who's the consumer?"
- "Is the exit measurable?"
- "Form fits processor (machine→JSON, human→MD)?"
- "MECE: nothing missed, nothing duplicated?"

Output issues + fixes.
```

### A.4 `/scope-distill` — 会话末勾选已完成 Δ

文件：`.claude/skills/scope-distill/SKILL.md`

```markdown
---
name: scope-distill
description: Reconcile scope.md §6 checklist with actual progress
---

## Step 1: Read evidence

- Read phases/`<current>`/scope.md §6
- Read git log since last phase tag
- List files in outputs/ and reports/

## Step 2: For each unchecked Δ in §6, check:

- Is the deliverable file present?
- Does git log show a commit completing this Δ?
- Were tests run and passed?

If all yes → suggest marking ✓.

## Step 3: For each ✓ Δ, sanity-check:

- Does the deliverable still exist?
- Was it possibly reverted in a recent commit?

If reverted → suggest unchecking + flag inconsistency.

## Step 4: Output

Summary of suggested changes. Wait for user approval before editing scope.md.
```

### A.5 `/commit` — 三档判断

文件：`.claude/skills/commit/SKILL.md`

````markdown
---
name: commit
description: Create a commit per git-protocol three-tier judgment
---

## Step 1: Test gate

Run project's test command. If any fail → STOP. Suggest /rollback.

## Step 2: Classify

**AI-Auto**:
- New code with passing tests
- Refactor with all tests still green
- Updates to docs/debts.md / phases/PN/issues.md
- Updates to phases/PN/scope.md §6 (mark ✓)

**Human-Review** (STOP, ask before commit):
- New ADR draft (docs/decisions/ADR-*.md)
- Changes to docs/rules/*.md
- Changes to CLAUDE.md or docs/master-plan.md
- DB schema / migration changes
- Deletion ≥ 50 lines

**Forbidden**:
- Test failing → MUST /rollback

## Step 3: Message

```
<type>(<phase>/<Δ>): <one-liner what>
<why>                  ← required for non-trivial
<tried-and-failed>     ← optional
<next-step>            ← required if leaving session
Refs: phases/<PN>/scope.md / [ADR-XXX] / [DEBT-XX]
```

## Step 4: Commit

- AI-Auto: `git add` + `git commit -m "<message>"`
- Human-Review: show diff + draft message, wait for approval

## Step 5: Update §6 (if applicable)

If commit completes a Δ:
1. Edit scope.md §6, mark ✓
2. Separate commit: `chore(<phase>/<Δ>): mark Δ<N> complete`
````

### A.6 `/rollback` — 安全回退

文件：`.claude/skills/rollback/SKILL.md`

````markdown
---
name: rollback
description: Safely roll back per git-protocol
---

## Within Δ (uncommitted, test failure)

```
git reset --hard <last-green-commit>
```

Don't touch scope.md.

## Cross-Δ (revert a checked Δ)

1. `git revert <commit>` (preserve history) OR `git reset` (rewrite)
2. Edit phases/`<current>`/scope.md §6: uncheck the Δ
3. Commit: `revert(<phase>/<Δ>): uncheck Δ<N>, reason: <reason>`

## Cross-phase (revert a tagged phase) — REQUIRES HUMAN APPROVAL

1. STOP. Show user impact: tag, master-plan changes, scope checks to undo
2. Wait for explicit approval
3. `git tag -d <tag>`
4. Edit master-plan.md if necessary
5. `git revert` or `git reset`
6. Commit: `revert(<phase>): cross-phase rollback, reason: <reason>`

## Forbidden

- Never `git commit --amend` on pushed commits
- Never `git push --force` on shared branches
- Never WIP-commit on red test
````

### A.7 `/phase-complete` — phase 收口

文件：`.claude/skills/phase-complete/SKILL.md`

````markdown
---
name: phase-complete
description: Seal a phase when scope.md §6 is all ✓
---

## Step 1: Verify

- All §6 items in phases/`<current>`/scope.md are ✓
- All §4 deliverables exist
- Tests pass
- `git status` clean

If any fails: STOP and list failures.

## Step 2: Write §7 Sealed in scope.md

Append §7 Sealed block per §3.4.1 template (Sealed at / Tag / Branch state /
Outputs / Cross-phase artifacts / Next phase / Next scope.md / Handoff status).
Commit: `chore(P<N>): seal §7`.

## Step 3: Tag

```
git tag -a P<N>-complete-<YYYY-MM-DD> -m "
Phase <N> sealed.
Exit: <one-line summary>
Outputs: phases/P<N>/{scripts,outputs,reports}
Refs: phases/P<N>/scope.md §7, master-plan.md §3 P<N>
"
```

## Step 4: Initialize next phase

Run /phase-scope-init for P<N+1>.

## Step 5: Confirm

Output:
```
✅ Phase <N> complete.
Tag: P<N>-complete-<YYYY-MM-DD>
Next: phases/P<N+1>/scope.md initialized.
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
- phases/P2/scope.md §3 Δ4
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