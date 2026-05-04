# 10 — Phase 0 扫描范围与工单

> 路径建议:`docs/refactor-public-api/10-phase-0-scope.md`
> 状态:v1.1(2026-05-02 P0 Δ0a/b 修订;详 §修订日志。前版 v1.0 = Phase 0 启动前最后冻结)
> 适用:**这是 Phase 0 的工单。Claude Code(或任何执行 AI)按本文档干活。**
> 前置阅读:`00-master-plan.md` §3 Phase 0(必读)+ §2 原则 1 + §2 原则 5

---

## 修订日志

| 版本 | 日期 | 修订项 | 落地位置 | 触发会话 |
|------|------|--------|---------|---------|
| v1.0 | 2026-05-01 | 初版 | (整个文档) | master plan 起草会话 |
| v1.1 | 2026-05-02 | D-P0-01 七份产出物结构沿用工单 | (无变更;Δ0a 确认现状) | P0 Δ0a |
| v1.1 | 2026-05-02 | D-P0-02 11f growth rule + 主文件 index | §4.3 修订 1 | P0 Δ0a |
| v1.1 | 2026-05-02 | D-P0-03 monkey-patch 改良 (i) | §3.2-bis / §4.1 表格列 / §4.3 修订 2(§4.3.5)/ §4.4 修订 1+2 / §6 门槛 4 | P0 Δ0a |
| v1.1 | 2026-05-02 | D-P0-04 Δ 顺序方案 A 严格顺序 | (无变更;Δ0a 确认 §5 默认) | P0 Δ0a |
| v1.1 | 2026-05-02 | D-P0-05 11h 命名 + 实时累积 timing | §6 门槛 4-5 + 判定时机段 | P0 Δ0a |
| v1.1 | 2026-05-02 | Q-P0-01+02 §6 综合修订 | §6 完整重写(含 D-P0-02/03/05 落地) | P0 Δ0b |
| v1.1 | 2026-05-02 | Q-P0-03 §4.4 T-MP + monkey-patches subdir | §4.4 修订 1+2 | P0 Δ0b |
| v1.1 | 2026-05-02 | D-P0-10 module-level cross-module dep 附录(方案 D) | §4.1-bis | P0 Δ1.1 |
| v1.1 | 2026-05-02 | D-P0-17 §1-§4 估时 cycle 数 + facade 完整性 + quirks 33 验证 + G-001 提议性质标注;Δ1.3.2 a+b+c 扩展(_handoff-debts 追溯修正 51→33 / (A)(B)(C) 提议被 user 拒绝撤回) | (无 schema 改动;99-progress 工作纪律 #4 修订 + 11a/11h 内容更新 + _handoff-debts O-03 修正) | P0 Δ1.3.1 + Δ1.3.2 |
| v1.1 | 2026-05-02 | D-P0-18 D-P0-05 加第四类标签 `推迟到下一 phase`(必附 3 条强制附属) | §6 退出门槛 4 标签(三选一 → 四选一)+ §6 退出门槛 5 措辞(不阻塞 `推迟到下一 phase`) | P0 Δ1.3.2 |
| v1.1 | 2026-05-02 | D-P0-19 self-check 全集精化(Q1-Q5 + 对称约束 + cycle 度量 + R8 关系矩阵)+ §3 fail 处置 (c) 区分自查 vs 被发现(避免 perverse incentive 元层 calibration)| (无 schema 改动;99-progress D-P0-17 §1 精化 + 工作纪律 #4 修订完整规则)| P0 Δ1.3.3+Δ1.4 |
| v1.1 | 2026-05-02 | D-P0-20 core.ts surface 角色差异 + 6 边角处置(R1 同 pipeline + per-dimension 调整;维度 A 对外暴露 + 维度 B 内部行为枚举)| (无 schema 改动;scan-api.ts 加 ScanConfig 新字段 + detectInternalBehavior helper)| P0 Δ2.2 |
| v1.1 | 2026-05-02 | D-P0-21 dual-pattern verify 规则(D-P0-13 对偶,grep-based 判定都要 verify 不漏真命中)| (无 schema 改动;加入 cycle 度量质量阈值,不 verify = self-check 不真做 = 补做)| P0 Δ2.2 |
| v1.1 | 2026-05-02 | D-P0-22 internal-behavior 枚举维度(11b 主表格新列;pure-delegate / mixed-delegate / non-delegate)| (无 schema 改动 — 11b 表格 schema 自适应:有 entry 含 internalBehavior 时自动加列)| P0 Δ2.2 |
| v1.1 | 2026-05-02 | D-P0-23 对称约束扩展(user 拍板内部一致性责任:Claude Code 识别 user 拍板内部矛盾 → stop ping → user reconcile,不替 user 解释)| (99-progress D-P0-19 §2 对称约束扩展)| P0 Δ2.3 |
| v1.1 | 2026-05-02 | D-P0-24 facade class 同名重叠现象(Meta2d ↔ canvas 9+ 同名 method,P4 拆解风险:两套 callsite 等价测试约束)| (P4 工单未来写时硬约定;11b 加同名重叠 list)| P0 Δ2.3 |
| v1.1 | 2026-05-02 | D-P0-25 option 3 forgotten-public 子分类(11b 主表格 4 类:public / forgotten-public / public-ish / internal;facade class export + 无 private + V2/卫星 grep 0 = surface 死代码)| (scan-api.ts classifyClassMember + renderMarkdown 4 类支持)| P0 Δ2.3 |
| v1.1 | 2026-05-02 | D-P0-26 module-level grep 双 pattern 交叉验证(D-P0-13 module-level 平行规则;P-import + P-call 限定 P-import 命中文件内)| (scan-api.ts hasModuleLevelV2Evidence / hasModuleLevelSatelliteEvidence helpers)| P0 Δ2.4 |
| v1.1 | 2026-05-02 | D-P0-22 §扩展 module-level internal-behavior(detect imported function 调用 instead of `this.subModule.X`)| (scan-api.ts detectModuleFunctionBehavior helper for FunctionDeclaration)| P0 Δ2.4 |
| v1.1 | 2026-05-02 | D-P0-25 §扩展 module-level forgotten-export 子分类(平行 class-level forgotten-public;module-level export + V2/卫星 0 import → forgotten-export 进 11c 主表格,不 skip)| (scan-api.ts classifyModuleExport 加 forgotten-export 分支)| P0 Δ2.4 |
| v1.1 | 2026-05-02 | D-P0-27 G-001 6 sub-form 重新裁决(对称约束反向应用第二次:Δ3 数据让信息充分,user 修拍板 P0 收口前裁决;3 sub-A/C/D 承认契约 + 3 sub-B/E/F 主动放弃)| (11h G-001 拆 6 sub-form + 11h 队列重新计;surface v1.0 修订输入)| P0 Δ4 |
| v1.1 | 2026-05-02 | D-P0-28 Q6 self-check(R8 形态 5 首次发现:estimation 替代 enumeration;Δ5-main 重做)| (99-progress D-P0-19 §1 加 Q6 + R8 关系矩阵加形态 5)| P0 Δ5 重做 |
| v1.1 | 2026-05-02 | D-P0-29 Δ5 v2 通过 + 11h expansion 11 G-XXX 推荐(对称约束反向应用第三次:Δ5 v2 enumeration 让 C 维度信息充分,P0 收口前裁决 ~30 候选;grouping by concept 11 G-XXX 覆盖 ~30 method/event;6 推荐 surface-补 v1.1 / 4 推荐 主动放弃 / 1 推荐 需 user 裁决 单条二选一)| (11h G-003..G-013 + 队列状态段 + 99-progress D-P0-29 块)| P0 Δ5 v2 后 |
| v1.1 | 2026-05-02 | D-P0-29 user verdict 落地(11 G-XXX 最终标签:9 同意推荐 + 2 user 工程判断改 — G-006 clipboard 改主动放弃因 god-class 反模式 + 业务层组合;G-012 raw mouse 选选项 b 主动放弃因 V2 走 G-010 DOM listener 更灵活)→ 11h 队列最终分布 8 surface-补 v1.1 / 9 主动放弃 / 1 推迟 / 0 待决 → **P0 退出门槛 5 ✅ 通过** | (11h 索引表 + 11 detail 段 + 队列状态段 verdict 落地;99-progress D-P0-29 user verdict 段 + 当前位置/Δ 时间线;Δ6 启动条件 ready)| P0 Δ5 v2 verdict 落地 |
| v1.1 | 2026-05-02 | D-P0-30 11g test 位置 + 选取策略 + Δ6 7 子(B2 user challenge 改路径 ../meta2d.js/packages/core/tests/behavioral/ 反 docs idiomatic + B3 hybrid 高 ROI + A' 行为不一致 ~70 cases + B4 加 Δ6.X 测试 D-P0-24 同名重叠 + emits A')| (99-progress D-P0-30 决策块 + Δ 时间线 7 子;实际 test code 落 ../meta2d.js/packages/core/tests/behavioral/)| P0 Δ6 启动 plan |
| v1.1 | 2026-05-02 | D-P0-31 测试环境 schema 修订 + Q5 v3 扩展(D-P0-30 §1 隐含 vitest+jsdom 因 Δ6.1 撞 rrweb-cssom Dialog bug + Canvas 2D API null context → 追溯改 vitest+happy-dom+vitest-canvas-mock;Q5 v3 calibration 第三次扩展 — 动 D-P0 内容默认 schema 改动 ping;R8-2' 形态 2 变体识别 — schema 改动伪装 implementation note;path drift hygiene check 加 work flow)| (99-progress D-P0-31 决策块 + R8 关系矩阵加 R8-2' + 当前位置/Δ 时间线 Δ6.1 闭合)| P0 Δ6.1 后 |
| v1.1 | 2026-05-02 | D-P0-32 quirk 11.2 #6 emit-default 不一致登记 + Δ7 stop ping 触发更严 + 同名重叠 emit/default 系统性 verify 必做(Δ6 期间 T-E-005/007 撞 canvas.addPen vs Meta2d.addPen emit default 差异 → Meta2d facade ≠ pure-delegate;Δ5 v2 enumeration 漏 explained — 没做"同名 method 实际行为对比测试";Δ7.3 系统性 verify 基于 11.2 #6 模式扩 D-P0-24 同名重叠 11+ method;覆盖率 base = 144 真 surface 不是 217 全集)| (11f-implicit-behaviors.md ch11.2 加 quirk 11.2 #6 + 工程含义 + 测试覆盖 + P3/P4 处置预记录;11g 同名重叠 list 加 D-P0-32 注;99-progress D-P0-32 决策块 + Δ7 子里程碑 7 子)| P0 Δ6 闭合后 |
| v1.1 | 2026-05-02 | D-P0-33 覆盖率 base 定义 method-level 144 + 工单 §6 门槛 3 字面修订(Δ7.5 stop ping 后 user 拍板 (b) method-level 144 — line 80% 测 V1 god-class 实现细节工程上不合理,P0 工程价值是行为契约 capture 不是 implementation coverage;base 144 = canvas 116 main + core 25 + 11h 3;不计 D 维度 forgotten-public/forgotten-export/V1 internal helper;line coverage 26.11% 记作参考数据)| (99-progress D-P0-33 决策块 §1-§8;工单 §6 退出门槛 3 字面更新;Δ7.4 启动 method-level gap 补全)| P0 Δ7.5 stop ping 后 |
| v1.1 | 2026-05-02 | D-P0-32 §扩展 v2 V1 行为二分类原则(Δ7 闭合后 user 拒 P0 现在收口 — 5 门槛 ✅ 字面满足实质不完整;V1 行为 default 砍 + V2/sat 真依赖才保留;统一表达 D-P0-22 mixed-delegate + D-P0-24 同名重叠 + D-P0-25 forgotten-public 死代码;Δ7.6 五子里程碑实施二分类标注 + 11h verdict review 可能触发对称约束反向第四次;P1 spike A' cover 50-65 不是 95 / P3 V2 切换 audit 增 30-45 债)| (99-progress D-P0-32 §扩展 v2 §5-§14;Δ7.6a-e 子里程碑;P0 真正收口推迟 1-2 cycle)| P0 Δ7 闭合后 user 工程视野追加 |
| v1.1 | 2026-05-02 | D-P0-34 A' 三 prong 子分类(D-P0-32 §扩展 prong 化 — Δ7.6b 实测 14 混合形态超 user §14 预想 user 工程判断 14 混合是 V1 god-class 真实形态非异常;binary 二分类不足以表达,引入 prong 数 schema 维度;契约 47 / 债 34 / 混合 14;P3 处置三种:契约完整保留 + 债完整砍 + 混合 prong split;P1 spike 输入 47 + 14 混合的契约侧 ≈ 61 surface v1.1 / P3 audit 34 + 14 混合的债侧 ≈ 48)+ 11g §12.0 evidence-level disclaimer(summary-level evidence;P3 实施前必 1:1 grep verify;不替代 P3 grep)| (99-progress D-P0-34 决策块 §1-§6;11g §12 prong 化 + §12.0 disclaimer;P0 收口前最后 schema 修订)| P0 Δ7.6 收口前 user 拍板 |

**修订维护规则**:任何对工单内容的修订必须在此表追加一行(版本号、日期、修订项 ID、落地位置、触发会话)。版本号变更规则:phase 内微调 → 次版本号(v1.0 → v1.1);phase 切换或工单结构性重组 → 主版本号(v1.x → v2.0)。

---

## 0. 这份文档的性质

这**不是**实施清单本身。这是**告诉执行 AI 怎么扫描、扫到什么粒度、产出什么文件**的工单。

实际清单(API inventory / 行为清单 / 调用点清单 / behavioral test 套件)由执行 AI 在本地仓库跑工具产出,落到 `11a` 到 `11g` 七份子文档(及 `11h` `11i` 两份桥/补充文档)。

执行 AI 看到本文档后**第一件事是反问 user**:"是否同意按本工单产出 11a–11g 七份文档,还是先合并/拆分?",得到确认再开干。不要默默改工单结构(违反 R8)。

---

## 1. Phase 0 的目标(再陈述,与 master plan 一致)

把 canvas.ts(9828 LOC)/ core.ts / render.ts 这三个 god-class 当前的对外行为**全部固化为 behavioral test**。

"对外"包括:
- 卫星包(5 个 adopt)对它们的调用
- V2 adapter 对它们的调用
- meta2d 类作为顶层 API 对外用户的接口

退出门槛见 master plan §3 Phase 0,本文档不再重复。

---

## 2. 七份产出物(+ 两份桥/补充)

| 编号 | 文件名 | 性质 | 估计篇幅 |
|---|---|---|---|
| 11a | `11a-canvas-api-inventory.md` | 数据 | 80–150 项 |
| 11b | `11b-core-api-inventory.md` | 数据 | 100–200 项 |
| 11c | `11c-render-api-inventory.md` | 数据 | 30–60 项 |
| 11d | `11d-satellite-call-sites.md` | 数据 | 50–150 个调用点 |
| 11e | `11e-v2-call-sites.md` | 数据 | 30–80 个调用点 |
| 11f | `11f-implicit-behaviors.md` | 行为 | 60–120 项 |
| 11g | `11g-behavioral-test-suite/` | 代码 | ~150–300 个 test case |
| 11h | `11h-surface-gaps.md` | 桥(P0 → P1) | V1 有 surface 没覆盖的项 |
| 11i | `11i-preexisting-bugs.md` | 补充(按需) | P0 期间发现的 V1 现存 bug |

**篇幅是参考,不是上限**。如果实际扫出来更多,**不要砍**——P0 价值就在穷尽。

---

## 3. 扫描方法论

### 3.1 静态扫描工具栈

执行 AI 自由选择,推荐:

- **ts-morph** 或 **TypeScript Compiler API** — 提取 class/method/property 签名
- **grep / ripgrep** — 查找字符串/正则匹配(用于卫星包调用、quirk 注释、emit 调用)
- **AST 遍历** — 找出 `this.store.emitter.emit(...)` `pushHistory(...)` 等关键副作用调用

不推荐:
- 纯目测(9828 行不可能不漏)
- 仅依赖 IDE 的 "Find Usages"(跨包跳转、字符串 ID 引用都会漏)

执行 AI 应**先写一个一次性扫描脚本(50–200 LOC)**,而不是手工列。脚本 + 输出一起提交,user 可重跑验证。脚本放在 `11-scan-scripts/` 子目录。

### 3.2 三层 API 分类

每个方法/属性必须打标签:

- **public**:有 `public` 关键字 或 是 class 默认导出成员;或在顶层 meta2d 类暴露
- **public-ish**:技术上是 public(TypeScript 默认),但语义上是内部用,**且被外部调用过**(关键:有调用证据)
- **internal**:私有,仅 class 内部用 — **不列入清单**(P0 不关心)

**判定 public-ish 的依据**:在卫星包/V2 adapter/meta2d 顶层中能 grep 到调用。grep 命中 → 立刻打标签。

例子:`canvas.markDirty()` 没有 `public` 关键字,但 V2 adapter 直接调用 → public-ish,必须列入。

### 3.2-bis monkey-patched 正交标签(2026-05-02 D-P0-03)

V2 端 `installUxPatches.ts` 在 runtime 动态替换 canvas.ts 的内部方法实现(详 _handoff-debts C-17 quirk 11.7 #5 + C-09 至 C-15)。这些方法的特征:

- 源码无 `public` 关键字,看像 internal
- 但 V2 在 runtime monkey-patch → 有"调用证据"(只是依赖方式不优雅)

处置:**monkey-patched 是正交标签,不是 public/public-ish/internal 同维度的第 4 类**(同一 method 可同时是 internal + monkey-patched,塞进同一列会丢信息)。

具体规则:

a. 一律标 **public-ish**(契约从严,契约依据 = V2 实际依赖)
b. 11a/b/c 表格新增 `monkey-patched`(yes/no)独立列(详 §4.1 修订)
c. 11f 新增第 5 子节 `monkey-patches`(详 §4.3 修订 2)
d. 每条 monkey-patch 进 11h-surface-gaps.md 标 `需 user 裁决`
e. P3 工单(未来写时)预约束:V2 `installUxPatches.ts` 必须删空或显著瘦身

**为什么不走"改三层 → 四层"**:R8 防御。实施者改契约结构必须走 user gate;新增正交标签 + 新增列 + 新增子节是工单内增量,不动 §3.2 三层分类本身。

### 3.3 quirk 注释强制提取

canvas.ts 等三个文件里有大量 `@quirk ch11.x #N` 注释,每一条都对应历史 bug fix 或非显然行为。**全部提取**,逐条进入 `11f`。

提取格式见第 5 节。

### 3.4 emit 时机映射

执行 AI 必须 grep 出所有 `this.store.emitter.emit(` 和 `this.parent.emit(` 调用,逐一记录:

- emit 的事件名
- 触发条件(在哪个方法、什么分支)
- 携带的 payload 字段
- 是否在某个生命周期阶段(mouseup 之后?frame end?transaction commit?)

这是 P4/P5 拆解时**最关键**的契约依据。漏一个,V2 端就有可能在某次拆解后悄无声息地丢事件。

### 3.5 history 推送规则

同上,grep `this.pushHistory(`,记录:
- 在什么操作之后推
- step 字段是多少
- initPens / pens 的内容差异
- 是否被 `if (this.store.data.locked) return;` 挡住

---

## 4. 各产出物的具体格式

### 4.1 `11a` / `11b` / `11c`(API inventory 三件套)

每条 API 用以下表格行:

```markdown
| # | 名称 | 签名 | 分类 | 调用方 | 备注 |
|---|------|------|------|--------|------|
| C001 | addPen | `(pen: Pen, history?, emit?, abs?, activate?) => Promise<Pen \| undefined>` | public | meta2d.addPen / V2 adapter | async 但内部同步;quirk 11.2 #2 activate 参数 |
```

**修订(2026-05-02 D-P0-03)**:表格新增 `monkey-patched` 列(yes/no),独立于 `分类` 列。详细规则见 §3.2-bis。

修订后表格示例:

```markdown
| # | 名称 | 签名 | 分类 | monkey-patched | 调用方 | 备注 |
|---|------|------|------|---------------|--------|------|
| C001 | addPen | `(pen: Pen, history?, emit?, abs?, activate?) => Promise<Pen \| undefined>` | public | no | meta2d.addPen / V2 adapter | async 但内部同步;quirk 11.2 #2 activate 参数 |
| C0XX | renderPens | `(...) => void` | public-ish | yes | V2 installUxPatches.ts:NN 替换 | monkey-patch 替换逻辑摘要见 11f §4.3.5 |
```

字段语义:`monkey-patched: yes` 表示该 method 在 runtime 被 V2 端 patch 替换(或 wrap);`no` 表示仅常规调用(包括正常的 grep 命中、import 引用等)。

字段说明:

- **#**:稳定编号(C 系列对应 canvas.ts、M 系列对应 meta2d/core、R 系列对应 render)。**编号不可重用**——P4/P5 拆解时这是契约 ID
- **名称**:原始方法名
- **签名**:完整 TypeScript 签名,展开复杂参数
- **分类**:`public` / `public-ish`
- **monkey-patched**:`yes` 表示该 method 在 runtime 被 V2 端 patch 替换(或 wrap);`no` 表示仅常规调用。详细规则见 §3.2-bis
- **调用方**:谁在调用(grep 出来的真实调用方,逗号分隔)
- **备注**:特别记录的:async/sync 实际情况、相关 quirk、deprecated 标记

### 4.1-bis Module-level cross-module dependencies 附录(2026-05-02 D-P0-10)

**适用对象**:module-level exports(const / function / type / enum / interface 等),即不在 class body 内的顶层 export。

**判定流程**:

1. cross-grep V2 / 卫星 / meta2d 顶层 facade(`core.ts` / `index.ts`)
   - **命中** → 进 11a 主表格,标 `分类: public-ish`(走 D-P0-08 标准语义)
2. 步骤 1 未命中 → cross-grep meta2d 内部 sibling module(`packages/core/src/*` 但**不含** canvas.ts 自身)
   - **命中** → **不进主表格**,进 11a 末尾"Module-level cross-module dependencies (non-public-ish)" 附录节
3. 步骤 1 + 2 都未命中 → 完全无外部 import(纯 module-internal)→ **不进 11a**

**附录节模板**(11a 末尾,Surface 映射预判节之前):

```markdown
## Module-level cross-module dependencies (non-public-ish)

> 不构成 public-ish(无外部消费证据,D-P0-08 语义不变),但 P4 拆解时
> 是 meta2d 包内 sibling module 的依赖,要保留。

| # | 名称 | 类型 | 跨模块消费方 |
|---|------|------|-------------|
| MX001 | movingSuffix | const | packages/core/src/diagrams/form.ts |
```

**字段说明**:

- **#**:稳定编号 `MX` 系列(M = module-level,X 区分主表格 C/M/R 编号空间)。**不可重用**——P4 拆解时这是 sibling dep ID
- **名称**:原始 export 名
- **类型**:`const` / `function` / `type` / `enum` / `interface`
- **跨模块消费方**:meta2d 内部 sibling 文件路径(逗号分隔多个)

**P4 拆解时用法**:附录节作为 cross-module dep 信息使用,**不作 public-ish 契约**(可重命名 / 移动 / 删除,只要 sibling 跟随调整即可)。但 P4 拆 canvas.ts 时不能忽略 sibling 同步修改。

**为什么不进主表格**(给后续 AI 防 R8):D-P0-08 严格定义 public-ish 调用证据为"V2 / 卫星 / meta2d 顶层 grep 命中"。meta2d 内部 sibling import 不构成外部契约;塞进主表格 = 扩展 D-P0-08 语义 = R8 苗头。schema 外的附录是更干净的容器。

**重要**:11a 末尾要追加一节叫 `## Surface 映射预判`,把每个 C 编号尝试映射到:

1. **`02-public-api-surface.md` 的 15 个 accessor 之一**(如 `C001 addPen → pens accessor`)
2. **`03-mece-decomposition.md` §1 模块树中的目标文件**(如 `C001 → kernel/store/ + model/action.ts`)

**这一步只是预判,不是锁定**——P2 真做时会调整。但预判本身能暴露:
- surface 是否覆盖完整(漏掉的 → `11h-surface-gaps.md`)
- 03 MECE 拓扑是否覆盖完整(漏掉的 → 报告给 user,可能要改 03 文档)

### 4.2 `11d` / `11e`(调用点)

```markdown
## adopt-cloudpss-adornments

| # | 调用点 | 文件:行 | 调用方法(C编号) | 上下文 |
|---|-------|--------|----------------|--------|
| D001 | `meta2d.addPen(pen, true)` | `src/adornments/box.ts:42` | C001 | 添加边框图元时 |
```

每个卫星包一节。**5 个 adopt 包必须各自单独一节**,不要合并。

V2 adapter(`11e`)同结构,按文件分节。

### 4.3 `11f`(隐式行为)

四个子节(D-P0-03 后五个,新增 §4.3.5 monkey-patches):

**修订 1(2026-05-02 D-P0-02)— 11f growth rule + 主文件 index 化**

默认 11f 单文件含全部子节。**任一子节 > 50 项 或 单文件 > 800 LOC**,该子节升级为独立文件,命名:

- `11f-quirks.md`
- `11f-emits.md`
- `11f-history.md`
- `11f-sideeffects.md`
- `11f-monkey-patches.md`(由 D-P0-03 引入,见修订 2)

拆分发生时,**11f.md 主文件保留作为 index**,只列各子文件链接 + 项数,保证后续 AI 进来仍能看到 11f 全景。索引模板:

```markdown
## 11f Index

- [§4.3.1 Quirks](./11f-quirks.md) — N 项
- [§4.3.2 Emits](./11f-emits.md) — N 项
- [§4.3.3 History](./11f-history.md) — N 项
- [§4.3.4 Side-effects](./11f-sideeffects.md) — N 项
- [§4.3.5 Monkey-patches](./11f-monkey-patches.md) — N 项
```

参考来源:03-mece-decomposition.md v0.2 §10 Q4/Q7 同款 growth rule。

#### 4.3.1 Quirks(从 @quirk 注释提取)

```markdown
### quirk 11.2 #2 — addPen activate 参数 opt-out

- 文件:canvas.ts:6XXX
- 原文:[直接拷贝注释原文]
- 影响范围:addPen / addPenSync
- P0 测试覆盖:T-Q-11.2-2(对应 11g 中的 test ID)
```

#### 4.3.2 Emit 时机

```markdown
### emit 'translatePens' vs 'translatingPens'

- 文件:canvas.ts:XXXX
- 触发:mouseup 时(translatePens, 单次) vs drag frame(translatingPens, 每帧)
- payload:Pen[]
- quirk:ch11.7 #1 + #2 — Event timing 二分
- P0 测试覆盖:T-E-translate-001 / T-E-translate-002
```

#### 4.3.3 History 推送规则

```markdown
### addPens 推 history

- 触发:addPens(pens, history=true) 时
- type:EditType.Add
- pens:deepClone(list, true)
- 不推条件:store.data.locked === true
- P0 测试覆盖:T-H-add-001
```

#### 4.3.4 副作用顺序约定

```markdown
### inactive() → active() 切换的 emit 顺序

- 旧 active() 先 emit 'inactive' 再 emit 'active'
- quirk 11.6 #3 修复后保证 emit=false 路径也走 inactive
- P0 测试覆盖:T-S-active-001
```

**修订 2(2026-05-02 D-P0-03)— 第 5 子节 Monkey-patches**

#### 4.3.5 Monkey-patches

每条 monkey-patch 用以下格式:

```markdown
### V2 monkey-patch:installUxPatches.ts:NN — 替换 canvas.<method>

- 替换文件:src/engine/adapters/meta2d/installUxPatches.ts:NN-NN
- 被替换 method:canvas.<method>(详 11a C0XX)
- 原方法签名:(...) => <returnType>
- 替换逻辑摘要:[在原 method 前后增加 X / wrap 整体逻辑 / 完全替换为 Y]
- 原因:[修补 V1 哪个 quirk / 兼容 V2 哪个用例]
- 已知关联 bug:[_handoff-debts 编号 C-XX / C-YY]
- P0 测试覆盖:T-MP-NNN(对应 11g/implicit/monkey-patches/)
- P3 处置预记录(弱字段,可填"待 P3 工单评估"):[1 行 notes;allow 显然
  情况下写直觉如"明显是 V1 缺失 setter,P3 应有合规途径";不强制具体
  方案 / 不要求 API 名]
- 进 gap 队列:11h-surface-gaps.md 标 `需 user 裁决` — user 在 P0 阶段
  裁决的是「承认为契约 / 还是 V2 违章丢弃」二选一(P3 偿还方案不在
  P0 决策范围)
```

每条 monkey-patch **必须**:

1. 进 11a/b/c 对应 method 的表格行,`monkey-patched` 列填 yes
2. 进 11f §4.3.5(此处),完整记录
3. 进 11h-surface-gaps.md,标 `需 user 裁决`
4. 进 11g/implicit/monkey-patches/ 测试目录,test ID 格式 `T-MP-NNN`(注:T-MP 前缀引入需 §4.4 配套修订,见 §4.4)

**P0 阶段允许 Claude Code 在显然的情况下在"P3 处置预记录"字段写一行直觉**(让 P3 实施者受益于 P0 期间的观察),但**严禁臆测具体 API**(锚定效应风险)。多数情况下应填"待 P3 工单评估"。

**正反例**(后续 AI 写"P3 处置预记录"时按此校准,严禁宽解释):

✓ **允许**(描述方向):
- "V1 缺失 mute selection events 的途径,P3 应有合规 setter"
- "明显是 V1 渲染时机 bug 的 workaround,新 surface 修了 timing 后此 patch 自然消失"

✗ **禁止**(臆测具体 API/机制):
- "P3 应在 selection accessor 上加 setMuteEvents(bool) 方法"
- "用 Reactive<T> 三层重写 X"

**判定边界**:描述方向(允许) vs 设计具体 API / 机制(禁止)。

### 4.4 `11g`(behavioral test suite)

目录结构:

```
11g-behavioral-test-suite/
├── README.md          # 测试运行说明、覆盖率统计
├── api-contract/      # 对应 11a-c 的每个 API
│   ├── canvas/
│   ├── core/
│   └── render/
├── call-site/         # 对应 11d-e 的每个真实调用模式
│   ├── adopt-cloudpss-adornments/
│   ├── adopt-...
│   └── v2-adapter/
└── implicit/          # 对应 11f
    ├── quirks/
    ├── emits/
    ├── history/
    ├── side-effects/
    └── monkey-patches/   # 2026-05-02 D-P0-03 新增,对应 11f §4.3.5
```

每个 test case 顶部 docstring 必须含:

```typescript
/**
 * Test ID: T-Q-11.2-2
 * Maps to: 11a C001 (addPen) + 11f quirk 11.2 #2
 * Asserts: addPen(pen, undefined, undefined, undefined, false) does NOT trigger active([pen])
 */
```

**Test ID 命名规则**:
- `T-A-NNN` — API contract test(对应 11a-c)
- `T-S-NNN` — call site test(对应 11d-e)
- `T-Q-X.Y-N` — quirk test
- `T-E-NNN` — emit timing test
- `T-H-NNN` — history rule test
- `T-MP-NNN` — monkey-patch test(对应 11f §4.3.5,2026-05-02 D-P0-03 新增)

测试框架由执行 AI 选择(vitest / jest / mocha 都行),但**必须能在 CI 跑、能产出覆盖率报告**。

---

## 5. 进度报告与中间产物管理

执行 AI **不允许一次性产出全部 7 份文档再交付**——会失控。

要求按以下增量交付:

| 里程碑 | 交付物 | 用 user 视角验证什么 |
|--------|--------|---------------------|
| Δ1 | 扫描脚本 + 11a 草稿(canvas.ts only) | API 数量是否合理(80–150)、分类逻辑是否一致 |
| Δ2 | 11b + 11c 草稿 | 三个文件总 API 数 ≈ 200–400 |
| Δ3 | 11d + 11e 草稿 | 卫星包/V2 端调用点穷尽 |
| Δ4 | 11f 草稿 | quirk 总数 ≥ 30(凭 canvas.ts 已知就 ≥ 15) |
| Δ5 | 11a 末尾 surface 映射预判章节 + 03 MECE 映射 | 是否暴露了 surface 设计漏洞或 03 文档漏洞 |
| Δ6 | 11g 测试目录骨架 + 前 30% 测试 | 测试运行机制走通 |
| Δ7 | 11g 剩余 70% 测试 + 覆盖率报告 | 关键路径 ≥ 80% |

每个 Δ 完成后 user review 一次再进下一个。Δ5 出来时 user 应该会看到一些 surface 没覆盖的 API——这正是 P1 spike 要消化的输入。**同时也可能暴露 03 MECE 文档的漏洞,触发 03 修订**。

每个 Δ 完成后,执行 AI 必须更新 `99-progress.md`,记录:
- Δ 完成时间
- 实际数据(扫出多少个 API、多少 quirk 等)
- 偏离工单估计的部分
- 触发的红线(如有)

---

## 6. 退出门槛(再次明确,2026-05-02 v1.1 修订)

**全部满足才算 P0 完成**:

1. 11a–11f(含 D-P0-02 growth rule 触发后的 split 子文件)六份数据/行为文档完整,user review 通过。**11f 主文件如已 split,必须保留为 index 形态**(列子文件链接 + 项数,后续 AI 可看全景)
2. 11g behavioral test 套件存在,**全部跑绿**(基于当前 V1 代码)
3. **method-level 144 真 surface coverage ≥ 80%**(2026-05-02 D-P0-33 字面修订;原"关键路径覆盖率 ≥ 80%" 模糊化解):
   - **base 144** = canvas 116 main(53 facade-delegate + 63 public-ish)+ core 25 真 public + 11h 3 surface-补 v1.1(G-001 a/c/d)
   - **每个 method ≥ 1 test**(behavioral test 行为锚点,P3/P4 切换时 test 跑绿确保兼容)
   - **不计**:D 维度 implementation detail(forgotten-public 224 + forgotten-export 18 + V1 god-class internal helper)
   - **vitest line coverage 不作 P0 退出门槛**,记作参考数据(实测 26.11% — P3/P4 切换时关注内部覆盖,不是 P0 任务)
   - **D-P0-33 工程理由**:P0 工程价值是 V1 真 surface 行为契约,不是 V1 实现覆盖;line 80% 测一遍砍一遍工作浪费(canvas god-class 9828 LOC 内部 forgotten-public + V1 internal helper + monkey-patch 残留 P3 不带到 v1.1)
4. surface 映射预判章节(11a 末尾)出来后,**新增**了一份 `11h-surface-gaps.md`,列出 V1 有但 surface 没覆盖的项 + 每条 monkey-patch(D-P0-03),每条标记**四选一**(原三选一,2026-05-02 D-P0-18 加第四类):
   - `surface-补 v1.1`(进 P1 修订队列)
   - `主动放弃`(Phase 4-5 不重建,V2 端自管)
   - `需 user 裁决`(从原 `待 review` 改名,显式标记决策待定)
   - `推迟到下一 phase`(2026-05-02 D-P0-18 新增 — P0 阶段缺信息无法裁决但需后续 phase 处理;**必附 3 条强制附属**:① 推迟理由 / ② 触发恢复条件 / ③ 裁决最晚时间点;无附属则不算合法标签,降级为 `需 user 裁决` 待决)
5. **11h 队列零条 `需 user 裁决` 待决**(D-P0-05 新增;`推迟到下一 phase` 不阻塞此门槛 — D-P0-18 显式承认推迟合法,但每条必附 3 条强制附属)

**11h 实时累积 timing**(D-P0-05 替代原"P0 收口前一次性 meeting"隐含约定):

- Claude Code 每发现一条 gap → 立刻进 11h 标 `需 user 裁决` + ping user
- user 可在 phase 进行中陆续裁决,也可攒到收口前一并 review
- 退出门槛 5 是必须项,不是 nice-to-have

**关于退出门槛 5 的判定时机**(2026-05-02 D-P0-05 配套):

Claude Code 在 Δ7 完成时(测试覆盖率达标),如果 11h 上仍有 `需 user 裁决` 条目:

- **不报告 P0 完成**
- 主动 ping user,提供未裁决条目清单 + 简短摘要
- 等 user 裁决完成后,Claude Code 才宣告 P0 完成 + 触发 P1 启动条件
- **不允许**"假定默认裁决"
- **不允许**"按 X 处理留待 user 后续 override"

**理由**:11h 三选一对 P3 的 surface 修订有直接影响,默认裁决会污染 P3 设计空间。

11h 是 P0 → P1 的桥。P1 启动条件就是 11h 上 user 已经做完三选一的判定(零条 `需 user 裁决` 残留)。

**重要(R8 反模式防御)**:门槛**只能由 user 调整,不能由执行 AI 调整**。如果执行 AI 发现某个门槛太高(如"覆盖率 80% 做不到"),**不要默默放低**——主动报告 user,让 user 决定:要么承认 P0 估算偏低延期,要么降低门槛(并显式记录 master plan v2.x 修订)。

---

## 7. 红线(Phase 0 范围)

执行 AI 在 P0 期间触发以下任一情况,**立刻停下问 user**:

| # | 情况 | 处置 |
|---|------|------|
| P0-R1 | 扫出的 API 总数 < 150 或 > 600 | 数量异常,可能扫描脚本有 bug 或分类标准漂移,先停下 review |
| P0-R2 | 任何 quirk 注释**没找到对应代码**(注释和实现不一致) | 这是历史债,记录到 11f 但**不要**自作主张修代码 |
| P0-R3 | behavioral test 跑不绿(V1 现状本身有 bug) | 记录到独立的 `11i-preexisting-bugs.md`,不要修。修是 P4–P6 的事 |
| P0-R4 | 卫星包用了某个内核 API 但该 API 在内核里搜不到 | 可能是 dynamic 调用或字符串引用,先记录到 11d 备注栏,不要假设它"应该不存在" |
| P0-R5 | P0 工时已超 6 周仍未到 Δ4 | 走 master plan §4 R7,整体重新评估 |
| P0-R6 | 执行 AI 自己想"简化"工单(合并产出物 / 跳过 surface 映射预判 / 不写 99-progress 更新) | **R8 触发**——立刻停下问 user。工单结构由 user 锁,不由执行 AI 简化 |

---

## 8. 不做什么

P0 期间执行 AI **绝不做**以下事:

1. **绝不**修改 canvas.ts / core.ts / render.ts 任何一行(包括"看着不舒服的 typo")
2. **绝不**修改 surface 文档(那是 P1 的事)
3. **绝不**修改 03 MECE 文档(如果发现漏洞,报告 user;改不改由 user 决定)
4. **绝不**写"建议重构 X"的备注塞进产出文档(那是 P4–P6 的事;P0 只描述现状)
5. **绝不**为了减少测试工作量"合并"几个 API 的 contract test
6. **绝不**对 deprecated API(如 `beforeAddPen` / 旧 `translate()` 等)跳过——deprecated 不等于不存在,V1 现状要全捕获
7. **绝不**重新定义 P0 退出门槛(R8 反模式)

---

## 9. 立刻能做的下一步

执行 AI(Claude Code)第一次跑这份工单时:

1. 读完本文档
2. 读 `00-master-plan.md` §3 Phase 0 + §2 原则 1 + §2 原则 5
3. 读 `02-public-api-surface.md`(为后面 11a 末尾的 surface 映射预判章节)
4. 读 `03-mece-decomposition.md` §1 模块树 + §5 老→新映射(为 11a 末尾的 MECE 映射预判)
5. 看 `99-progress.md`(如果还不存在,提议 user 一起建一份初始版本)
6. 在 `docs/refactor-public-api/` 下建 `11-scan-scripts/` 子目录,放扫描脚本
7. **不要直接动手扫**,先回到对话告诉 user:"我准备产出 Δ1,扫描脚本会用 ts-morph + ripgrep,产出 11a 草稿 80–150 项。可以开始吗?"
8. user 确认后再开干

---

**End of Phase 0 Scope**
