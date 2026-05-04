# 00 — Master Plan (v2.0)

> 路径建议:`docs/refactor-public-api/00-master-plan.md`
> 替代:旧 master plan(M1–M13 模型;已 archived 至 `_archived/00-master-plan-v0.1-archived.md`)
> 状态:**骨架冻结,细节留待 Phase 0 之后填充**
> 周期估算:**47–72 周(11–17 月)**,合理上限 1 年 4 个月

---

## 0. 这份计划存在的理由

旧 master plan(M1–M13)有六个**结构性引导走偏的因素**(完整诊断见 `_archived/00-master-plan-v0.1-archived.md` 头部警告):

1. **估算驱动范围,而非范围驱动估算**——"6 月许可"作为 anchor,工作量倒推压进去
2. **物理拆分 vs 控制流反转混淆**——M3 措辞"6-10 个新文件"把 deep refactor 矮化成物理拆分
3. **没有 phase 退出门槛**——只有 milestone 名,没有"做完什么算完"的可验证条件
4. **隐含 surface 已就绪假设串起 M5–M13**——没有任何 milestone 真正负责把 surface 从设计变成实现
5. **没有"系统始终可发布"约束**——V2 用 link: 跟随 refactor 分支,但 link: 跟随的是个废墟也会跟随
6. **没有红线机制**——风险列表只描述风险,没说"风险触发了怎么办"

v2.0 master plan 的目的:**结构性堵住这六个洞**,把 surface 实施作为工程主轴重新组织。

---

## 1. 顶层判断

**1.1** 这是一项 11–17 月量级的工程,而不是 2–3 月。如果时间预算无法接受这个范围,本计划自动失效——必须降级为"surface 仅作为 V2 adapter 的设计参照"分支(分支 2),走另一份计划。本文档仅适用于"surface 是真合同"分支(分支 1)。

**1.2** 工作量主要不在"拆文件",在三处:
- 控制流反转(god-class → accessor + mutate SSoT)
- V1 不存在的新机制实装(Reactive 三层 / transaction 嵌套 savepoint / spatial index / ConnectionValidator / DataSource + ReactiveSubscription / StyleExpression evaluator / ViewMode 管线)
- 拆碎物理文件(40–50 个 < 500 LOC)

第二项是大头,因为它是新代码,不是搬移现有代码。

**1.3** 半年到一年的项目,**失败几乎从不是工作量预估失误造成的,而是控制论意义上的失控**——不知道离目标多远、不知道哪里坏了、不知道改一处会影响什么。所以这份计划首先是**可观测 + 可回退 + 可分阶段验证**的结构,其次才是阶段切分。

---

## 2. 五条结构性原则(高于阶段计划)

任何阶段执行如果与这五条冲突,优先服从原则。

### 原则 1 — 边界冻结优先于实施

重构开工前先把 canvas.ts / core.ts / render.ts **当前对外行为**做成一份契约。不是文档形式,是 **behavioral test**。卫星包对 meta2d 的所有调用点 + V2 adapter 对 canvas.ts 的所有调用点全部列出,固化成快照测试。

这份契约是后续所有阶段的**回滚依据和正确性裁判**。这件事如果不做,后面所有"我觉得没改坏"的判断都没有依据。

### 原则 2 — 关键机制 spike 先行,surface 文档允许修订

surface v1.0 锁定的几个机制在 V1 没有先例:

- Reactive&lt;T&gt; 三层 + StyleExpression evaluator
- transaction.ts 嵌套 savepoint
- spatial index(R-tree / quadtree)
- ConnectionValidator pipeline
- DataSource + ReactiveSubscription 引用计数 + autoclean

这些**必须在动 god-class 之前**每个写 200–800 LOC 的玩具 PoC,只验证设计可行。

任何 spike 暴露 surface 缺陷,**优先改 surface 文档而不是绕过去**。要预算 surface → v1.1/v1.2 的修订过程,卸掉"surface 不可改"的紧箍咒。改文档比改实现便宜十倍以上。

### 原则 3 — 双 surface 期,delegate 模式先行

**最关键的一条**。新 accessor 不要等 god-class 拆完才上线。先建立 119 个 accessor 空壳,内部全部 delegate 调用老 canvas.ts/core.ts/render.ts。一个不少。

然后切 V2 adapter 到新 accessor 上跑 2–4 周。等 V2 在新接口上稳定了,再开始拆内核——此时 V2 完全不感知。

这一步把"控制流反转"和"god-class 拆解"两件事**解耦**,失败一件不会带垮另一件。

### 原则 4 — 每个切片完成后系统必须可发布

任何子阶段不能让 V1 处于"既不是老的也不是新的、跑不起来"的废墟状态。如果一个切片没法保证这点,这个切片**必须重新切**。

整个工程期间 publish 节奏应该至少 10–15 次,每次都是稳定中间态。这一条是回退机制的根基,**也是对旧计划"V2 用 link: 跟随"反模式的直接修正**(link: 跟随必须跟随的是稳定中间态,不是废墟)。

### 原则 5 — 测试随阶段就位,而不是堆到最后

旧计划把 M11 测试单独放到末尾是经典反模式。v2.0 不再有"测试 milestone":

- Phase 0 的 behavioral test 是骨架
- 每个新机制 spike 自带单元测试
- 每个 accessor 上线带 contract test(行为等价老内核)
- 每拆一个域,full behavioral test 通过才进下一域

测试是**每个阶段的退出门槛**,不是 milestone。

---

## 3. 阶段切分(9 个 Phase)

阶段编号用 P0–P8,**不复用旧 M1–M13 编号**(避免歧义)。

每个 Phase 写明:目标 / 退出门槛 / 估时 / 不做什么。

### P0 — 边界冻结 + 行为捕获 (3–5 周)

**目标**

- 列出 canvas.ts / core.ts / render.ts 当前所有 public + public-ish API
- 列出所有隐式行为(emit 时机 / 副作用顺序 / history 推送规则 / 各 quirk)
- 列出卫星包(5 个 adopt)和 V2 adapter 对内核的所有调用点
- 把上述全部固化为 behavioral test,V1 现状全部跑绿

**退出门槛**

- 行为清单文档完整(约 200–400 项,凭直觉,真做了会更多)
- behavioral test 覆盖率 ≥ 80% 关键路径,且全部跑绿
- 任何"V1 现有但 surface 没承诺"的隐藏行为已显式记录:要么写入 surface v1.1 待修订列表,要么标记"Phase 4–5 主动放弃"

**估时**:3–5 周。如果做完发现工作量明显超过 5 周,反而是好事——意味着这份契约本来就该这么大。**不要为了赶进度缩范围**(违反 R8)。

**不做什么**:不动任何生产代码;不改 surface 文档;不做 spike。

### P1 — 关键机制 spike + surface 修订 (4–6 周)

**目标**

并行做 5 个 PoC,每个 200–800 LOC,只验证设计可行:

1. Reactive&lt;T&gt; 三层 + StyleExpression evaluator
2. transaction.ts 嵌套 savepoint
3. spatial index(R-tree / quadtree)
4. ConnectionValidator pipeline
5. DataSource + ReactiveSubscription 引用计数

每个 spike 必须暴露与 surface 文档不一致之处,产出 surface v1.1。

**退出门槛**

- 5 个 PoC 全部完成,各自带单元测试
- surface v1.1 出版,记录 v1.0 → v1.1 的全部修订点
- 每个 PoC 写一份 200–500 字的"经验报告":此机制实施的关键难点、与 V1 哪些代码会冲突、估算实施工时

**估时**:4–6 周。任何 spike 失败超过 2 次仍走不通 → 走红线流程(见第 4 节)。

**不做什么**:不动 canvas.ts / core.ts / render.ts;PoC 不进生产代码,只是研究品。

### P2 — Accessor 空壳 + delegate (5–7 周)

**目标**

- 建立 15 个 accessor 文件(空壳)
- 建立 mutate.ts(SSoT 空壳,内部 delegate 到老内核)
- 建立 47 个 typed events 定义
- 建立 transaction.ts / snapshot.ts / Reactive 等模块的**接口骨架**(实现仍是 delegate)
- 119 个 API 全部就位,每个内部 delegate 到老 canvas.ts/core.ts/render.ts

**目标拓扑参考**:`03-mece-decomposition.md` §1 模块树 + §10 v0.2 patch。**这是 P2 建空壳目录的蓝图**。

**退出门槛**

- 119 个 API 全部 callable,行为与老内核完全等价
- behavioral test 100% 跑绿(此时新接口=老行为)
- contract test 上线:验证每个 accessor 调用产生的副作用与老内核完全一致(重点是 events 序列、history 推送时机)
- 这阶段结束时**外面的人看不出区别**,但接口边界已经翻新

**估时**:5–7 周。

**不做什么**:**绝不**实装任何新机制(不要趁机做 transaction、不要趁机做 spatial index)。本阶段只做 surface 形状,不做 surface 内核。把"做形状"和"做内核"严格分开是 P2 成败的关键。

### P3 — V2 端切换 + 真实流量验证 (3–4 周)

**目标**

- V2 adapter 重写,只依赖 surface,不再直接调 canvas.ts/core.ts/render.ts
- V2 实跑 2–4 周收集 bug

**退出门槛**

- V2 在新 surface 上稳定运行 ≥ 2 周
- 收集到的 bug 全部分类:surface 设计缺陷 / accessor 实现缺陷 / V2 自身 bug
- 设计缺陷类 → 走 surface 修订流程(可能产出 v1.2)
- 累积 bug 数 < 设定阈值(由你定,我建议第一周 ≤ 30,第二周 ≤ 10,第三周 ≤ 3)

**这是分支 1 不会失败的关键 checkpoint**。如果这里发现 surface 设计有大问题,影响半径还小——内核还没动。如果硬撑过去,后面 Phase 4–5 拆内核时再发现就血亏。

**估时**:3–4 周。

**不做什么**:不动内核;不动卫星包(它们继续走老路径)。

### P4 — canvas.ts 控制流反转拆解 (10–14 周)

**目标**

按域逐个拆 canvas.ts,把 delegate 替换为真正的反转控制流:

1. **mutation 域**(addPen/Pens/delete/updateValue/setPenRect/changePenId)→ mutate.ts SSoT
2. **connection 域**(drawline/finishDrawline/splitLine/initLineRect 等)
3. **selection 域**(active/inactive/willInactivePen/calcActiveRect)
4. **viewport 域**(setScale/setTranslate/setViewport/templateScale/gotoView)
5. **transform 域**(translatePens/rotatePens/resizePens/movePens/moveLineAnchor*)
6. **render 域**(render/renderPens/renderBorder/renderHoverPoint/renderPensAnchors/dirtyPens/batch)
7. **input 域**(onMouseDown/Move/Up + ontouch* + onkeydown/up + onwheel + onCopy/Cut/Paste + showInput + dropdown)

input 放最后(状态机最复杂,quirks 最多);render 倒数第二(性能敏感)。

**目标拓扑参考**:`03-mece-decomposition.md` §5 老→新映射表 + §6 MECE 验证。

每拆一个域:
- delegate 切换为真实实现
- behavioral test 全绿
- V2 实跑一周
- 才进下一域

**退出门槛(每个域)**

- behavioral test 100% 绿
- contract test 100% 绿
- V2 实跑一周无新增 bug
- 该域代码已碎成 < 500 LOC 的多个文件

**退出门槛(整个 P4)**

- canvas.ts 物理文件**已删除或仅剩 < 500 LOC 兼容垫片**
- 7 个域全部按 surface 拓扑组织

**估时**:10–14 周。这阶段最长,内部要再拆成 7 个 1.5–2 周的小切片。

**不做什么**:不动 core.ts / render.ts(它们继续 delegate 到自己的老实现);**绝不**在拆解过程中"顺手"加新功能。

### P5 — core.ts / render.ts 拆解 (8–12 周)

**目标**

- core.ts 主要是 store + lifecycle + 事件订阅
- render.ts 主要是 ctx 管线 + path2D + 文本/图像/锚点绘制

按相同模式(域拆 + delegate 替换 + 测试 + V2 实跑)操作。工作量稍小,因为没有 input 状态机。

**目标拓扑参考**:`03-mece-decomposition.md` §1(主要是 `kernel/store/` `render/canvas2d/` 子模块)。

**退出门槛**

- core.ts / render.ts 物理文件已删除或仅剩 < 500 LOC 兼容垫片
- V2 + 5 个卫星包(此时还是老路径)全部行为正常

**估时**:8–12 周。

**不做什么**:不实装新机制(那是 P6 的事);卫星包不动。

### P6 — 新机制深化落地 (6–10 周)

**目标**

P2–P5 把老的搬到了新接口下,P6 才**真正兑现 surface 对 V1 的净增值**:

- spatial index 替代当前 O(n) hit-test
- Reactive + StyleExpression 真正接管样式系统(不再是 mutate 后全量 diff)
- transaction 嵌套全开(savepoint / rollback / batched events)
- ViewMode 完整管线(以前没有的多视图模式)
- ConnectionValidator pipeline 接入真实校验规则
- DataSource + ReactiveSubscription 引用计数全开

**退出门槛**

- 每个新机制的对应单元测试 + integration test 全绿
- 性能基线(P0 应记录的)有改善而非退步
- surface v1.0 文档承诺的功能全部可见

**估时**:6–10 周。

**不做什么**:不动 V1 形态的 API;卫星包不动。

### P7 — 卫星包重构 + 删包 (4–8 周)

**目标**

- 5 个 adopt 卫星包重写,只依赖 surface
- 删除已经不需要的旧包/旧入口

**退出门槛**

- 5 个卫星包在新 surface 上跑通
- 删包列表与原 master plan M10 对齐,该删的删了

**估时**:4–8 周。

**不做什么**:不再修改内核;surface 已锁定到 v1.x 末版。

### P8 — 测试覆盖度补齐 + 性能基线 + 文档 (4–6 周)

**目标**

- 测试覆盖度补到原 master plan M11 目标(core ≥ 50% / 卫星 ≥ 30% / V2 ≥ 40%)
- 性能基线对比 P0 的初始基线,出报告
- API 文档对齐 surface v1.x 末版,出文档

**退出门槛**

- 测试覆盖率达标
- 性能不回退
- 文档完整

**估时**:4–6 周。

---

## 4. 红线机制(高于阶段计划)

红线比阶段计划更重要。**计划是用来跑的,红线是用来保命的**。出现以下任一情况,**立刻停下不要硬撑**,走对应处置流程:

| # | 触发条件 | 处置 |
|---|---------|------|
| R1 | 任何切片完成后 behavioral test 出现回归且无法在 1 周内修复 | 回滚切片,重新设计 |
| R2 | P1 任何 spike 失败超过 2 次仍走不通 | 那个 surface 机制必须重新设计或砍掉,产出 surface 大版本修订(v1.x → v2.0 候选) |
| R3 | P3 V2 端切换后 2 周内出现重大 bug 数 > 设定阈值 | 暂停 P4,先回头看 P2 的 accessor 设计 |
| R4 | P4/P5 拆某个域超过原估时 1.5 倍仍未完成 | 暂停,重新评估这个域是否设计太激进;考虑分二次切分 |
| R5 | 任何阶段发现 surface v1.x 某条 API 实施成本远超预期(> 估算 3 倍) | 走 surface 修订流程,不要硬实施 |
| R6 | 任何阶段出现"为了赶进度,临时桥/adapter to old adapter"的诱惑 | **强制 stop**;临时桥永远不会被清理。重新切分阶段,把这个临时需求消化掉 |
| R7 | 半年后仍未走完 P3 | 整体重新评估;可能项目复杂度高于初估,要么追加 3–6 月预算,要么降级为分支 2 |
| **R8** | **任何 phase 进行中,实施者(人或 AI)开始重新定义该 phase 的退出门槛、缩减扫描范围、把"完成"的语义往容易的方向拉** | **强制 stop**——这是旧 master plan M3 失败的核心机制。门槛只能在 phase 启动前调,不能在进行中调。如果发现门槛真的不合理,先走红线,**承认 phase 失败重启**,而不是默默改门槛 |

**R8 特别说明(吸取旧计划教训)**

旧 master plan M3 的失败模式不是"放弃 canvas.ts 拆分",是**重新定义 M3 是什么**——把 M3 从"strict + canvas.ts 拆"悄悄缩成"strict + 31/33 quirks"。整个过程没人触发任何风险流程,因为"M3 完成"在没明确退出门槛的情况下,可以由实施者自由解释。

R8 的设计意图:**phase 退出门槛是契约,不是建议**。任何想改门槛的提议必须显式 review,不能由实施者单方面解释。

---

## 5. 与旧 master plan 的映射

便于回看历史决策时对照:

| 旧 milestone | v2.0 归属 | 备注 |
|---|---|---|
| M1 (plan) | v2.0 本文 | 完全替换 |
| M2 (surface 设计) | P1 修订后产出 surface v1.1+ | v1.0 不算最终版,P1 后才是 |
| M2 (MECE 分解) | `03-mece-decomposition.md` 保留为目标拓扑参考 | P2/P4/P5 实施时对照 |
| M3 (canvas.ts 拆) | **失败的旧规划**;v2.0 用 P0–P5 替代 | M3 措辞"6–10 个文件"是 gap 起点,**R8 反模式案例** |
| M4 (M3 内消化) | 已并入 M3,v2.0 不需要 | |
| M5 (Tokens) | 假定已完成,不影响 v2.0 | |
| M6 (CloudPSS adornments) | 推迟到 P7 | 否则反复返工 |
| M7 (AVPP 脚手架) | 推迟到 P3 之后,具体在 P5 末尾或 P7 初 | |
| M8 (5 Adopt 卫星包重构) | P7 | |
| M9 (layout) | 并入 P6 或 P7,看具体内容 | |
| M10 (删包) | P7 | |
| M11 (Tests) | **不再单独存在**;分散到每个 Phase 退出门槛 + P8 收口 | |
| M12 (docs) | P8 | |
| M13 (V2 集成) | P3 + P4 增量切换 | 不再是单独 milestone |

---

## 6. 文档版本与维护

### 6.1 文档版本规则

- 本文件:v2.0,Phase 0 启动前最后冻结
- 后续修订只增不删:每个 Phase 完成出 v2.x(增加经验记录、调整后续阶段估时)
- 任何想改本文件结构(原则、阶段切分、红线)的提议必须显式 review,不能隐式漂移

### 6.2 进度跟踪机制(双层)

吸取旧计划"99-progress.md 在 M3 缩范围时未被更新"的教训,进度跟踪分两层:

**第一层 — phase 级状态(粗粒度)**:维护在 `README.md` 的「当前进度」节。每次 phase 切换必更新。任何 AI 接手会话第一件事看这一节。

**第二层 — phase 内部细颗粒度状态(细粒度)**:维护在 `99-progress.md`(P0 启动时建)。

`99-progress.md` 必须包含:

- 当前 phase 内部 milestone 进展(如 P4 的 7 个域,每个的状态)
- 当前 phase 已发现的 surface 修订点(进 surface vN.M+1 队列)
- 当前 phase 已触发的红线及处置记录
- **每周强制更新一次**,即使没有进展也要写"本周 0 进展,原因:X"

**AI 协作约定**:任何对话开始时,user 应贴 README + 99-progress 当前状态;AI 应主动问"99-progress 上次更新是什么时候?如果超过一周,我们先一起更新它再继续"。

### 6.3 旧文档归档

- 旧 master plan(M1–M13 模型)已 archived 至 `_archived/00-master-plan-v0.1-archived.md`
- 头部加版本警告大字标注,**保留原文不删**——它作为 R8 反模式的活案例,有教育价值

---

## 7. 立刻能做的下一步

**不要直接开 P0**。先做一件元工作:

把这份 v2.0 master plan 落地为 `docs/refactor-public-api/00-master-plan.md`,然后据此补齐:

1. `docs/refactor-public-api/02-public-api-surface.md` — 把原 02 surface 拷贝过来,头部加版本号 v1.0,标注"P1 后会出 v1.1"
2. `docs/refactor-public-api/03-mece-decomposition.md` — 把原 01 MECE 文档拷贝过来,作为 P2/P4/P5 实施时的目标拓扑参考
3. `docs/refactor-public-api/10-phase-0-scope.md` — P0 工单
4. `docs/refactor-public-api/AI-PROMPT.md` — 后续 AI 协作的指令文件
5. `docs/refactor-public-api/README.md` — 索引 + 当前进度
6. `docs/refactor-public-api/_archived/00-master-plan-v0.1-archived.md` — 旧 master plan 归档

P0 启动条件:1–6 全部就位,你本人 review 过一次,然后开干。

---

## 8. 编号约定

避免文档编号冲突,采用编号区段分配:

- **00–09**:主文档/契约(只增不删,跨 phase 长期稳定)
  - 00 master plan / 02 surface / 03 mece-decomposition / 04+ 预留
- **10–19**:Phase 0 工单 + 产出物
  - 10 phase-0-scope / 11a–11g 扫描产出
- **20–29**:Phase 1 工单 + 产出物
- **30–39**:Phase 2 工单 + 产出物
- ...以此类推
- **README.md / AI-PROMPT.md**:无编号,作为元文档独立存在
- **\_archived/**:历史归档目录

---

**End of Master Plan v2.0**
