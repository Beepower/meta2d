# Phase 进度跟踪

> 路径:`docs/refactor-public-api/99-progress.md`
> 用途:phase 内部细颗粒度状态。每个 Δ 完成后必更新一次,无进展也写"本周 0 进展,原因:X"(master plan §6.2)
> 维护规则:每 Δ 完成 → 此处补一行;每周 user/AI 联合 review 一次
> 状态:**Phase 0 即将启动 Δ6(2026-05-02 Δ5 v2 + 11h expansion D-P0-29 user verdict 全落地;P0 退出门槛 5 ✅ 通过;Δ6 启动条件 ready)**

---

## 当前位置

- **当前 phase**:Phase 0(边界冻结 + 行为捕获)
- **当前 Δ**:**P0 收口 ping**(整 P0 final;D-P0-34 + 11g §12.0 disclaimer 落地后启动 — 等 user verify P0 真正收口)
- **下一个 Δ**:user verify → P0 final commit + tag(下一轮 user 触发)→ buffer → 协议文档 → P1 工单 → P1 启动准备 → P1 spike 实施(中间 5-10 工作日)
- **上次 user verdict**:2026-05-02 D-P0-32 — quirk 11.2 #6 登记 + Δ7 stop ping 更严 + Δ7.3 同名重叠系统性 verify 必做 + 覆盖率 base 144
- **工单当前版本**:`10-phase-0-scope.md` v1.1(详工单 §修订日志;D-P0-01 至 D-P0-32 全部落地)
- **Δ6 实测 cases 分布**:Δ6.1 mech 6 / Δ6.2 canvas 15 / Δ6.3 core 10 / Δ6.X behavior-divergence 15 / Δ6.4 quirks 13 / Δ6.5 emits 7 / Δ6.6 monkey-patches 4 = **70 total**(D-P0-30 §3 plan ~67;实际 +3)
- **Δ6 撞边角 self-fix**(均 V1 行为细节,非 R8 苗头):
  - T-A-010 gotoView 需 pens 否则 width Infinity → 加 addPen 前置
  - T-A-012 clearHover 设 store.hover = null 不 undefined → 改 toBeNull()
  - T-Q-11.1-2 Meta2d 主类无 translate(x,y) facade(scroll/tooltip 子组件有,主类已废)→ 测 setTranslate absolute 行为
  - T-E-005/007 canvas.addPen 不传 emit param → undefined 不发 'add'(V1 quirk:canvas.addPen vs Meta2d.addPen emit default 不一致)→ 改 meta2d.addPen high-level facade
- **11g v2(Δ5 v2)**:✅ 通过 — 217 + surface 119 反向 = ~378 条逐条 enumeration;6 类总分布 A 30 / A' 95 / B 73 / B' 0 / C 38 / D 66
- **11h-surface-gaps**:✅ 18 总条目(G-001 6 sub-form + G-002 + G-003..G-013 共 11 新)全部 user 显式裁决:**8 surface-补 v1.1 / 9 主动放弃 / 1 推迟 / 0 待决**
- **P0 退出门槛 5**:✅ **通过**(零条 `需 user 裁决` 待决)

---

## Δ 时间线

| Δ | 内容 | 状态 | 完成时间 | 备注 |
|---|------|------|---------|------|
| Δ0a | 反问工单 §0 七份产出物结构 + 4 处澄清(11f growth rule / monkey-patch / Δ 顺序 / 11h 命名) | ✅ 闭合 | 2026-05-02 | 用时 ~1h |
| Δ0b | 起草 99-progress 初始版 + 工单 6 处 patch(§修订日志 / §3.2-bis / §4.1 / §4.3 / §4.4 / §6) | ✅ 闭合 | 2026-05-02 | 工单 v1.0 → v1.1 落地 |
| Δ0c | Δ1 启动条件提议 + 5 项交付 user review | ✅ 闭合 | 2026-05-02 | D-P0-06 至 D-P0-09 落地 |
| Δ1.1 | step 1 拓扑形态 ✅ → step 2.5 D-P0-09 inventory ✅(4 patch / 2 形态)→ step 3 脚本骨架 + 10 条 sample(第一版直觉 → user 拦下 4 问题 → 重做基于真实 grep + 选项 A facade-delegate)→ D-P0-13/14/15 落地 + 11h G-001 创建 | ✅ 闭合 | 2026-05-02 | 实际 1.5 工作日(含 step 3 重做开销)|
| Δ1.2 | 三层分类 + monkey-patched cross-match + sibling grep + facade-delegate(116 主表格 + 1 附录 + 145 internal filter)— user 拦下 5 处补强 → D-P0-13/14/15 落地 + 真实 grep 重做 sample(facade-delegate 4 method 浮 public)→ user 拦下 4 深层问题 → D-P0-17 §1-§4 落地(估时 cycle 数 + facade 完整性 + quirks 33 + (A)(B)(C) 撤回) | ✅ 闭合 | 2026-05-02 | 1 ping 报告 + 多次 user review cycle(D-P0-17 cycle 度量首次实施)|
| Δ1.3.1 | 4 处深层问题处置(估时 calibration / facade 完整性 / quirks 33 / G-001 (A)(B)(C) 提议性质)+ 11h G-001 (A)(B)(C) 撤回 | ✅ 闭合 | 2026-05-02 | — |
| Δ1.3.2 a+b+c | _handoff-debts O-03 修正 51→33(追溯 SoT 修正,user §3 §a)+ G-001 标签 D-P0-18 加第四类 `推迟到下一 phase`(R8 形态 3 修正)| ✅ 闭合 | 2026-05-02 | R8 三形态汇总 + Q5 self-check 落地 |
| Δ1.3.2 d | rerun scan + 6 处 self-check evidence(主表格 116 / 附录 1 / valuable discoveries 5 节 / Surface 映射 placeholder R8 措辞 / 11a 191 行偏差显式报告 / 11a 不引用 P0 退出门槛 5 状态)| ✅ 闭合 | 2026-05-02 | R8 形态 1 防御实操(191 vs 期望 390-410 显式报告,user 接受偏差是估错)|
| Δ1.3.3 + Δ1.4 合并 | README.md 写说明(13 节,D-P0-06/08/09/10/11/12/13/14 完整 cross-ref)+ 99-progress Δ1 闭合 + D-P0-19 self-check 全集精化(Q1-Q5 + 对称约束 + cycle 度量 + R8 关系矩阵)| ✅ 闭合 | 2026-05-02 | 放权第一步;Δ2 试更大放权(全扫 core.ts + render.ts 一次性 ping)|
| Δ2 | 11b-core-api-inventory + 11c-render-api-inventory:Δ2.1 重构 scan-api/canvas.config(verify) → Δ2.2 stop ping 6 边角 → Δ2.3 stop ping option 1/2 二义 → 实施 option 3(D-P0-23/24/25)+ dual-pattern verify → Δ2.4 stop ping 4 R 边角 → 实施(D-P0-26/22§/25§)+ render.config + 全 3 文件跑通(canvas 116/1/145 不变 / core 249(25 public + 224 forgotten-public)/ render 18(forgotten-export)+ 42 appendix)+ user 漏 valuable discovery 补登记(Meta2d vs canvas 干净度对比) | ✅ 闭合 | 2026-05-02 | cycle 数 6-7(放权窗 + 多次 stop ping;每次 stop 都 R8 防御 + 工单未覆盖边角合法触发)|
| Δ3 | 11d-satellite-call-sites(5 个 adopt 包)+ 11e-v2-call-sites:Δ3.1 (sat) + Δ3.2 (V2) callsites.ts 实施 + Δ3.3 valuable discoveries 段(V2 vs sat density 对比 / canvas method 调用比例 / hotspot 识别)+ 11c #8 valuable discovery 补登记(render 纯内部 module) | ✅ 闭合 | 2026-05-02 | 1 ping(无 stop ping 边角)+ V2 195 sites/15 files / sat 12 sites/6 files |
| Δ4 | 11f-implicit-behaviors:Δ4.0 估算(quirks 33 / emits 41 unique / history 3 EditTypes 48 sites / side-effects ~10 / mp 4 — 全 < 50 单文件无 split)→ Δ4.1 quirks 5 in-source + 28 documented + verify (i) 31 ✅ + 2 partial scope-fenced + 0 fail → Δ4.2-4.5 transcribe → Δ4.6 单文件 11f.md(343 行 < 800 LOC growth rule 不触发)+ G-001 6 sub-form 重新裁决(D-P0-27 对称约束反向应用第二次,P0 收口前裁决)| ✅ 闭合 | 2026-05-02 | 1 ping(无 stop ping 边角) |
| Δ5-pre | 完整读 02-public-api-surface(2006 行 单 read 调用)+ summary(15 accessors / 119 API / 47 events / 4 大设计选择)| ✅ 闭合 | 2026-05-02 | 单 ping summary user review 通过 |
| Δ5-main v1 | 6 类差集 estimate(R8 形态 5 estimation 替代 enumeration)— user 拦下 4 严重问题(B=0 错 / 没逐条 / self-confirmation / store accessor 双归类)— **整 Δ5-main 重做** | ❌ deprecated | 2026-05-02 | D-P0-28 落地 R8 形态 5 + Q6 self-check |
| Δ5-main v2 | 完全重做 — 逐条 enumeration(canvas 116 + core 25 + 11h 7 + impl quirks 33 + emits 41 + history 3 + side-effects 5 + Reactive 9 + surface 119 反向 = ~378 条)+ 6 类总分布大幅修正:A 30/A' 95/**B 73**/B' 0/**C 38**/D 66 + 11h gap 队列必扩 ~30 新 C 类 candidates | ✅ 闭合 | 2026-05-02 | Q1-Q6 self-check 全过;user verdict:通过(待抽样 verify)+ 11h P0 收口前裁决 |
| Δ5 post(11h expansion + verdict)| 11h 加 G-003..G-013 共 11 G-XXX(grouping by concept)+ D-P0-29 落地(对称约束反向应用第三次)+ user verdict 全部落地(9 同意推荐 / 2 user 工程判断改 G-006/G-012;最终 5 surface-补 v1.1 / 6 主动放弃 / 0 待决)| ✅ 闭合 | 2026-05-02 | P0 退出门槛 5 ✅ 通过;11h 18 总条目全部 user 显式裁决;Δ6 启动条件 ready |
| Δ6 plan | D-P0-30 4 件 verdict(B1 vitest / B2 ../meta2d.js/.../tests/behavioral/ user 改 / B3 hybrid 高 ROI + A' user 加 / B4 7 子 user 加 Δ6.X)| ✅ 闭合 | 2026-05-02 | user challenge B2 + 加 A' 维度 + 加 Δ6.X |
| Δ6.1 | 目录骨架 14 子 + vitest.config(happy-dom + canvas-mock)+ package.json deps + sample test 6 全 pass(T-A-000 mechanism 3 + T-A-001 Meta2d 实例化 3)+ user 拦下 R8-2' 形态 2 变体(schema 改动伪装 implementation note)→ D-P0-31 追溯改 + Q5 v3 扩展 | ✅ 闭合(D-P0-31 落地)| 2026-05-02 | 机制走通 + Q5 v3 calibration 第三次扩展 + path drift hygiene check 加 work flow |
| Δ6.2 | api-contract/canvas/ facade 主头 15 cases(T-A-pen-mgmt 6 + T-A-viewport 4 + T-A-state 2 + T-A-render 3)| ✅ 闭合 | 2026-05-02 | 撞 V1 行为细节 self-fix(gotoView 需 pens / clearHover 设 null)|
| Δ6.3 | api-contract/core/ Meta2d facade 10 cases(T-A-meta2d-facade 8 + T-A-meta2d-events 2)| ✅ 闭合 | 2026-05-02 | facade-delegate + on/off + fitView |
| Δ6.X | implicit/behavior-divergence/ A' 15 cases(T-BD-method-overlap 10 + T-BD-emits-divergence 5)| ✅ 闭合 | 2026-05-02 | D-P0-24 同名重叠双向 verify + 11.6 #3 emit order quirk |
| Δ6.4 | implicit/quirks/ 13 cases(11.1 4 + 11.2 3 + 11.3 2 + 11.4 2 + 11.6 2)| ✅ 闭合 | 2026-05-02 | 撞 V1 行为细节 self-fix(translate 不存在 / canvas.addPen emit default)|
| Δ6.5 | implicit/emits/ critical timing 7 cases(addPens batch / setPenRect / setValue / wildcard / handler isolation / setOptions / off symmetry)| ✅ 闭合 | 2026-05-02 | 撞 canvas.addPen vs Meta2d.addPen emit 默认差异 self-fix |
| Δ6.6 | implicit/monkey-patches/ MP-01..MP-04 4 cases(canvas.active wrap / initMovingPens patchable / render short-circuit / customMoveDock hook field)| ✅ 闭合 | 2026-05-02 | D-P0-09 必测 + V2 monkey-patcher safety net |
| **Δ6 整体** | **70/70 tests pass;17 test files;前 30% target ✅(plan ~67,实测 70)** | **✅ 闭合** | 2026-05-02 | 测试 stack:vitest 1.6.1 + happy-dom 15 + vitest-canvas-mock 0.3.3 |
| Δ7.1 | quirks 剩余 14 cases(11.1 cont 2 + 11.2 cont 2 + 11.3 cont 2 + 11.4 cont 2 + 11.5 anchor 3 + 11.8 cascade 1 + 11.9 routing 2;11.7 drag 5 deferred — happy-dom 不模拟 mouse drag)| ✅ 闭合 | 2026-05-02 | 27/27 quirks total pass(Δ6.4 13 + Δ7.1 14)|
| Δ7.2 | implicit history + side-effects 10 cases(T-H-001..005 EditTypes + push rules / T-SE-001..005 sequences)| ✅ 闭合 | 2026-05-02 | self-fix 2:EditType import path + syncFullModel V2-side method 改成 V1 base 行为 test |
| Δ7.3 | 同名重叠 emit/default 系统性 verify 15 cases(T-BD-016..030;4 维度 a/b/c/d + categorized mixed/pure/Meta2d-only/canvas-only)| ✅ 闭合 | 2026-05-02 | self-fix:T-BD-029 forgotten-public 范围理解修正(Meta2d facade 实际 ~265 method 不只 11g §2 列 25)|
| Δ7.4 | method-level 144 gap fillers 20 cases(canvas A' fillers 6 + canvas C surface-补 v1.1 6 + core A' fillers 5 + core misc 3)| ✅ 闭合 | 2026-05-02 | self-fix 5:gotoView/toPng empty pens 加 pen 前置 / clearHover null / Meta2d 无 translate / canvas.addPen emit / delForce single arg / LockState import path / setValue render pollution defensive |
| Δ7.5 | 覆盖率收口 + report | ✅ 闭合 | 2026-05-02 | method-level 必测 92.4% ≥ 80% ✓;line 26% 参考(D-P0-33 §5)|
| **Δ7 整体** | **D-P0-32 quirk 11.2 #6 + D-P0-33 base 拍板;129/129 全 pass;31 test files;method-level 必测 92.4%;P0 全 5 门槛 ✅** | **✅ 闭合** | 2026-05-02 | call-site sat/v2-adapter Priority 4 可选(推 P1);Δ7.6 工程视野追加修订 user 拒 P0 现在收口启动 |
| Δ7.6a | 11f quirk 11.2 #6 二分类视角扩(canvas.addPen emit=undefined 债 / Meta2d.addPen emit=true 契约;P3 处置二分类)| ✅ 闭合 | 2026-05-02 | 11f §扩展 v2 加 |
| Δ7.6b | 11g A' 95 二分类(canvas 28 + core 8 + quirks 28 + emits 22 + history 4 + side-effects 5 = 95 batch 标注)| ✅ 闭合 | 2026-05-02 | 11g §12 加;契约 47 + 债 34 + 混合 14;按 prong split 契约 ~61 + 债 ~48(in user §10 区间 50-65/30-45 略 over)|
| Δ7.6c | 11h 18 verdicts D-P0-32 视角 review | ✅ 闭合 | 2026-05-02 | 18 verdicts 全部 D-P0-32 视角一致 ✅;**对称约束反向第四次未触发**(D-P0-32 §13 预备未实际触发)|
| Δ7.6d | 11f 33 quirks 二分类标注(28 A' 在 11g §12.3 + 5 D 类全债)| ✅ 闭合 | 2026-05-02 | 11f §扩展 v2 二分类标注;契约 13 / 债 19 / 混合 1 = 33 |
| Δ7.6e | self-check + ping | ✅ 闭合 | 2026-05-02 | Δ7.6 整体收口 ping;user verdict 通过 + Δ7.6 4 件 verdict + 拦下 P1 启动 + 启动 P0 收口流程 |
| Δ7.6 后 | D-P0-34 A' 三 prong + 11g §12.0 evidence disclaimer + 工单 §修订日志 | ✅ 闭合 | 2026-05-02 | P0 收口前最后 schema 修订 |
| **P0 final** | **P0 收口 ping(整 P0 final;不写交接 不启 P1)** | 🔶 等 user verify | 2026-05-02 | 等 user verdict P0 真正收口 → 下一轮 user 触发 final commit + tag |
| Δ7 | 11g 剩余 70% test + 覆盖率报告(关键路径 ≥ 80%) | ⏳ 待启 | — | — |

**Phase 0 总估时**:3-5 周(master plan §3 P0)。

---

## 已锁决策(本 phase 内)

> 每条决策格式:ID / 驱动 review / 内容 / 工单影响

### D-P0-01:七份产出物结构 — 沿用工单(2026-05-02)

**驱动**:Δ0a user review。

**内容**:11a / 11b / 11c / 11d / 11e / 11f / 11g + 11h / 11i 桥/补充结构沿用 10-phase-0-scope.md §2 表格。不合并不拆分。

**工单影响**:无。

### D-P0-02:11f growth rule + 主文件 index 化(2026-05-02)

**驱动**:Δ0a Q1 user 采纳 + 细化。

**内容**:

- 默认 11f.md 单文件含全 4(含 D-P0-03 后 5)子节
- 任一子节 > 50 项 **或** 单文件 > 800 LOC,**该子节升级为独立文件**:
  - `11f-quirks.md` / `11f-emits.md` / `11f-history.md` / `11f-sideeffects.md` / `11f-monkey-patches.md`
- 拆分发生时,**11f.md 主文件保留作为 index**,只列各子文件链接 + 项数,保证后续 AI 进来仍能看到 11f 全景
- 参考来源:03-mece-decomposition.md v0.2 §10 Q4/Q7 同款 growth rule

**工单影响**:§4.3 修订 1(2026-05-02 Δ0b 已落地)+ §6 退出门槛 1 措辞修订(2026-05-02 Δ0b 已落地,Q-P0-02 配套)。

### D-P0-03:Monkey-patch 处置 — 改良 (i)(2026-05-02)

**驱动**:Δ0a Q2 user review,user 拒绝 (iii) 改三层→四层(R8 防御),改良 (i) 走正交标签。

**内容**:

V2 端 `installUxPatches.ts` monkey-patch canvas.ts 内部方法(_handoff-debts C-17 quirk 11.7 #5 + C-09 至 C-15 多条修补路径)。处置:

a. **方法分类**:monkey-patch 触及的方法**一律标 public-ish**(契约从严,契约依据 = V2 实际依赖,即使依赖方式不优雅)
b. **新增表格列**:11a/11b/11c API inventory 表格新增 `monkey-patched`(yes/no)**独立列**,与 `分类` 列正交(同一 method 可同时 internal + monkey-patched)
c. **新增 11f 子节**:第 5 子节 `monkey-patches`,记录 V2 哪些文件 patch 了哪些 method / patch 替换逻辑摘要 / 预期 P3 偿还路径
d. **进 11h gap 队列**:每条 monkey-patch 进 11h-surface-gaps.md 标 `需 user 裁决`(D-P0-05 命名),P3 工单写之前由 user 显式确认偿还约束
e. **P3 退出门槛预约束**:V2 `installUxPatches.ts` 必须删空或显著瘦身(P3 工单未来写时硬约定)

**为什么不走 (iii)**:R8 防御 — 实施者改契约结构(三层→四层)必须走 user gate;orthogonal label + 新增列 + 新增子节是工单内增量,不动 §3.2 三层分类本身,且不丢信息(monkey-patched 与 public/public-ish/internal 不同维度)。

**P3 处置预记录字段的边界**(Δ0b user 补正反例):

- ✓ 允许(描述方向):"V1 缺失 mute selection events 的途径,P3 应有合规 setter" / "明显是 V1 渲染时机 bug 的 workaround,新 surface 修了 timing 后此 patch 自然消失"
- ✗ 禁止(臆测具体 API/机制):"P3 应在 selection accessor 上加 setMuteEvents(bool) 方法" / "用 Reactive<T> 三层重写 X"
- 判定边界:描述方向(允许) vs 设计具体 API/机制(禁止)
- 11h `需 user 裁决` 的范围:user 在 P0 阶段裁决"承认为契约 / V2 违章丢弃"二选一;P3 偿还方案不在 P0 决策范围

**工单影响**:§3.2-bis / §4.1 表格列 / §4.3 修订 2(§4.3.5)/ §4.4 修订 1+2 / §6 门槛 4(2026-05-02 Δ0b 全部落地)。

### D-P0-04:Δ 顺序 — 方案 A 严格顺序(2026-05-02)

**驱动**:Δ0a Q3 user 拍板。

**内容**:Δ1 → Δ2 → Δ3 严格顺序,**不**部分并行(方案 B sed 回填的隐藏成本是"难以发现的错配" — Δ1-2 期间方法分类漂移时 Δ3 sed 默默错配,要到 Δ5/Δ6 才暴露,回头修代价 3-5 天)。

**工单影响**:无(本来就是工单 §5 默认)。

### D-P0-05:11h 第三类命名 + 实时累积 timing(2026-05-02)

**驱动**:Δ0a Q4 user 采纳 + 加 timing 约束。

**内容**:

- 11h 三选一标签:
  - `surface-补 v1.1`(进 P1 修订队列)
  - `主动放弃`(Phase 4-5 不重建,V2 端自管)
  - `需 user 裁决`(从原工单 `待 review` 改名,显式标记决策待定)
- **timing 改为实时累积**(原工单 §6 隐含的"P0 收口前一次性 meeting 清完"作废):
  - Claude Code 每发现一条 gap → 立刻进 11h 标 `需 user 裁决` + ping user
  - user 可在 phase 进行中陆续裁决,也可攒到收口前一并 review
  - **P0 退出门槛追加**:零条 `需 user 裁决` 待决

**理由**:三选一判定有时要 user 翻 V2 端用法;堆 50-100 条一次清认知负担大,实时累积每条 1-3 分钟分散心智负担。

**判定时机约束**(Δ0b user 补充):

Claude Code 在 Δ7 完成时(测试覆盖率达标),如果 11h 上仍有 `需 user 裁决` 条目:

- 不报告 P0 完成
- 主动 ping user,提供未裁决条目清单 + 简短摘要
- 等 user 裁决完成后,Claude Code 才宣告 P0 完成 + 触发 P1 启动条件
- 不允许"假定默认裁决"
- 不允许"按 X 处理留待 user 后续 override"

理由:11h 三选一对 P3 的 surface 修订有直接影响,默认裁决会污染 P3 设计空间。

**工单影响**:§6 退出门槛 4-5 + 判定时机段(2026-05-02 Δ0b 已落地,Q-P0-01 配套)。

### D-P0-06:Δ1 工具栈 + 三阶段 pipeline(2026-05-02 Δ0c)

**驱动**:Δ0c §2 user 通过。

**内容**:

- **AST 提取**:ts-morph(canvas.ts class/method/property 签名 + `public` 关键字 + 装饰器 + 注释)
- **副作用追踪**:同 ts-morph AST(emit / pushHistory / quirk 注释 — 跨方法体的精确语法匹配)
- **跨仓 cross-grep**:ripgrep(V2 / 卫星 boolean 调用证据 + monkey-patched cross-match)
- **Pipeline**:三阶段 — `canvas.ts → canvas-apis.json (raw) → canvas-apis-enriched.json (enriched) → 11a-canvas-api-inventory.md`
- **markdown 派生品约束**:markdown 不是 SoT。修数据改 JSON 或脚本重跑,**不直接编辑 markdown**。Δ1.4 写入 `11-scan-scripts/README.md` 作工作约定。

**工单影响**:无(Δ1 内部实施细节)。

### D-P0-07:Δ1 子里程碑 4 段切分 + 每段 gate(2026-05-02 Δ0c)

**驱动**:Δ0c §3 user 通过。

**内容**:

| Δ | 工作 | 估时 | gate 性质 |
|---|------|------|---------|
| Δ1.1 | 拓扑形态确认 + 骨架脚本 + 10 条 sample | 1 工作日 | 内部 gate(拓扑形态)+ 闭合 gate(脚本结构) |
| Δ1.2 | 三层分类 + monkey-patched 列 | 1.5 工作日 | 闭合 gate(分类边界 review) |
| Δ1.3 | 全扫 + markdown 渲染 | 1 工作日 | 闭合 gate(数据规模 review,P0-R1) |
| Δ1.4 | `11-scan-scripts/README` + 99-progress Δ1 闭合 | 0.5 工作日 | Δ1 整体闭合 gate |

**Δ1.3 渲染 markdown 时**:11a 末尾 surface 映射预判章节用 R8 防御 placeholder:

```markdown
## Surface 映射预判
> 此节由 Δ5 填,Δ1-Δ4 期间留空。不要在此节写任何内容。
```

防止 compact 后的 AI 看到空节"主动补"。

**工单影响**:无(Δ1 内部切分;工单 §5 表格 Δ1 未变,Δ1 内部子里程碑作为 99-progress 细颗粒度记录)。

### D-P0-08:public-ish 判定与 Δ3 分工边界(2026-05-02 Δ0c)

**驱动**:Δ0c §5(1) user 拍板。

**内容**:语义边界明确:

- **Δ1.2 grep**:"method X 在 V2 / 卫星里有调用证据 yes/no"(boolean,单 token grep 即可)→ 用于 11a public-ish 列判定
- **Δ3 grep**:"method X 的具体调用点列表(文件:行号 + 上下文)"(详细)→ 用于 11d/11e

两次 grep **粒度不同,不是重复**。Δ1.2 输出**不是** Δ3 输入(Δ3 重新 grep,V2 代码可能在 Δ1.2 → Δ3 之间改动)。

**工单影响**:无。

### D-P0-09:monkey-patched inventory timing + Δ1.1 拓扑形态确认 gate(2026-05-02 Δ0c)

**驱动**:Δ0c §5(2) + §6 启动指令补充 user 拍板。

**内容**:

- **monkey-patched patch 形态 inventory**:**提前到 Δ1.1 step 2.5**(2026-05-02 Δ1.1 user 补强 — 原"Δ1.1 → Δ1.2 transition 期间"作废)。理由:Δ1.1 step 3 sample 需要 `monkey-patched=yes` 分支验证,inventory 必须先于 sample。**1-2 小时工作**,inventory 通过 user review 后才进 step 3。inventory 内容:read V2 端 `installUxPatches.ts` 完整文件,逐 patch 提取(目标 method / 替换形态(prototype 替换 / Object.defineProperty / wrap / 全量替换)/ 是否 wrap / 备注)。inventory 输出后:Δ1.2 ripgrep 模式设计基于此(原 timing 收益保留)+ Δ1.1 step 3 sample 从 inventory 挑 1 条最具代表性的 patch 对应 method。
- **Δ1.1 拓扑形态确认 gate**(Δ1.1 内部小 gate):Δ1.1 启动后**第一步** read canvas.ts 头 200 + tail 100,确认 module 拓扑形态(单一 class / 多 class + helper / namespace / 全 export const ...)。**报告 user 后等 user 拍板**才写脚本。拓扑形态决定脚本架构,根基错了三层分类全错。
- **Δ1.1 TS 装饰器 fallback**:Δ1.1 写脚本时若发现 canvas.ts 用了装饰器 / reflect-metadata,内部消化(给 ts-morph 配 `experimentalDecorators: true`),不上升为 user gate。

**工单影响**:无。

**Inventory 产出(2026-05-02 Δ1.1 step 2.5 闭合)— installUxPatches.ts 393 行全量分析**:

| # | 目标 method | 形态 | wrap? | 关联 bug |
|---|---|---|---|---|
| MP-01 | `canvas.active` | wrap pattern | yes | P2 marquee 误选 |
| MP-02 | `canvas.initMovingPens` | wrap pattern | yes | C-11 line ghost / drag 双影 |
| MP-03 | `canvas.render` | wrap pattern + short-circuit | yes | 同 MP-02(restore phase)+ width/height 缺失 |
| MP-04 | `canvas.customMoveDock` | hook field assignment | no | DEBT-013 dock snap-to-self |

**形态分布**(实际 2 种,比 D-P0-09 原预想 4-5 种简单):

- **形态 A(wrap pattern)**:`const orig = X.method.bind(X); X.method = (...) => { ... orig(...); ... }` — MP-01/02/03
- **形态 B(hook field assignment,非 monkey-patch)**:`X.someHook = (...) => { ... }`,meta2d 公开扩展点;`installUxPatches.ts` line 38 comment 明确 customMoveDock 是 hook,与 MP-01/02/03 性质不同 — MP-04
- **未发现**:prototype 替换 / Object.defineProperty / 全量重组 / Proxy

**MP-04 (customMoveDock) 处置 — 方案 (D) user 拍板**:

- monkey-patched 列填 **no**(§3.2-bis 严格语义 — hook 不属于"内部方法替换")
- 备注列加 prefix `[hook-util] customMoveDock: see installUxPatches.ts:272`
- 不进 11f §4.3.5(不算 monkey-patch);P4-P5 拆解时通过 11a 备注列 grep `[hook-util]` 找到所有 hook 利用点

### D-P0-10:Module-level export 附录分层(方案 D)(2026-05-02 Δ1.1)

**驱动**:Δ1.1 step 1 拓扑形态确认时发现 `movingSuffix` sub-issue(meta2d 内部跨 module import,非外部);user 否决我提的 (B1)/(B3)/(C),拍板方案 (D) — schema 外的附录分层。

**内容**:

- D-P0-08 public-ish 判定语义**完全不动**(只 V2 / 卫星 / meta2d 顶层 grep 命中算 public-ish)
- 对 module-level exports(const / function / type / enum / interface)有 meta2d 内部 sibling 跨模块 import 但**无外部消费证据**的:**不进主表格**,进 11a 末尾 `Module-level cross-module dependencies (non-public-ish)` 附录节
- 附录字段:`#` (MX 系列) / 名称 / 类型 / 跨模块消费方
- P4 拆解时附录作为 cross-module dep 信息使用,**不作 public-ish 契约**

**为什么不走 (B1)**:(B1) 实质改 D-P0-08 语义(扩展为"任何跨模块 import"),R8 苗头;且后果是 meta2d 内部 sibling import 极多,public-ish 数量会爆增 200-400,Δ1 估时全错。

**元教训**(给后续 Δ 用):工单未覆盖的小 case 不一定要塞进现有 schema 的分类系统。schema 外的容器(附录 / 注脚 / 独立 list / 跨文档 reference)是合法手段。塞分类常意味着扩展分类语义,扩展分类语义往往是 R8 入口。

**工单影响**:§4.1-bis 新增 + §修订日志新增 1 行(2026-05-02 Δ1.1 落地)。

**实施细节补强(2026-05-02 Δ1.1 user 补强)— sibling grep 范围排除规则**:

sibling grep 范围必须显式排除以避免与"V2/卫星/顶层 grep"重复匹配 + 避免 canvas/ 子目录内部协作文件被错误计为 sibling:

- **包含**:`packages/core/src/**/*.ts`
- **排除**:
  - `canvas.ts` 自身(grep 不能用源文件作为外部消费证据)
  - `core.ts` / `index.ts`(已在阶段 2 第 3 项 meta2d 顶层 facade grep 范围)
  - `canvas/` 子目录内所有文件(`offscreen.ts` / `canvasImage.ts` / `magnifierCanvas.ts` / `canvasTemplate.ts` 等):**视为 canvas 模块内部协作文件**,P4 拆解时与 canvas.ts 一起重组,**不构成跨域消费,不算 sibling**

排除规则要写进 `scan-canvas-api.ts` 注释 + `11-scan-scripts/README.md`(Δ1.4 创建时落实)。

### D-P0-11:scan-canvas-api 实施细节 4 处补强(2026-05-02 Δ1.1 step 2.5 后)

**驱动**:Δ1.1 step 2.5 inventory user review 时 4 处补强(§a/§b/§c/§d)。

**内容**:

**§a Inventory cross-validation assert**(防御 R8):

Δ1.2 脚本完成全扫后,如果 V2 端 canvas.X 赋值 grep 命中数 ≠ inventory patch 数(4 ± 0),**主动 fail 报告 user**。三种可能原因:

- inventory 漏了 patch(D-P0-09 inventory 不完整)
- grep pattern 漏了形态(scan 脚本 bug)
- V2 端有未登记的新 patch(`installUxPatches.ts` 之外的 patch)

任一都不能默默通过。

**§b Wrap vs Hook 分支判断逻辑**(脚本注释里写出):

```python
# pseudocode
if grep_hit:
    method_name = match.group(1)
    inventory_entry = D-P0-09_inventory.find(method_name)
    if inventory_entry is None:
        # V2 端给 canvas.X 赋值,但 inventory 没登记 → 触发 §a 交叉校验 fail
        raise InventoryMismatch(method_name)
    elif inventory_entry.形态 == 'A wrap':
        monkey-patched = yes  # 进 11f §4.3.5
    elif inventory_entry.形态 == 'B hook field':
        monkey-patched = no
        备注列 += "[hook-util] {method}: see installUxPatches.ts:NN"
```

**§c Sample 强制覆盖 hook 形态**:

Δ1.1 step 3 sample(10 条)必须包含:

- 1 条 wrap 形态:`canvas.render`(MP-03,monkey-patched=yes,验 §4.3.5)
- 1 条 hook 形态:`canvas.customMoveDock`(MP-04,monkey-patched=no + 备注 `[hook-util]`,验 §b 分支判断)
- 1 条附录分支:`movingSuffix`(D-P0-10 验证)
- 7 条剩余覆盖 D-P0-08 三层(主流 public 案例 + public-ish 边界 + internal 边界)

**§d 备注列 prefix 结构化**:

(D) 方案备注列承载多种语义信息时,用 `[bracket-tag]` 前缀机器可识别:

| Prefix | 语义 | 例 |
|---|---|---|
| `[hook-util]` | meta2d 公开 hook 利用 | `[hook-util] customMoveDock: see installUxPatches.ts:272` |
| `[quirk]` | quirk 注释 cross-link | `[quirk] ch11.7 #5 ...` |
| `[async-internal-sync]` | async signature but sync impl | `[async-internal-sync] async 但内部同步` |
| `[deprecated]` | deprecated 标注 | `[deprecated] use X instead` |

后续 grep `\[hook-util\]` / `\[quirk\]` 等可定向找出所有同语义条目。

**Schema 外但内部仍有结构** — 上轮 D-P0-10 (D) 方案的延续应用。

**工单影响**:无(实施细节,不动工单 schema)。脚本注释 + Δ1.4 README 落实。

### D-P0-12:§3.2 facade 判定标准(选项 A 严格)+ 问题 2/3 注释(2026-05-02 Δ1.1 step 3 sample 重做前)

**驱动**:Δ1.1 step 3 sample 第一版 user 拦下 4 个工程纪律问题,问题 4 §3.2 "在顶层 meta2d 类暴露" 歧义触发 facade 判定标准拍板;同时落地问题 2(调用方列粒度)+ 问题 3(简化签名 vs 完整签名)。

**核心:facade 判定标准 — 选项 A(严格同名 + 双向确认)**:

工单 §3.2 文字 "public:有 `public` 关键字 或 是 class 默认导出成员;**或在顶层 meta2d 类暴露**" 实际有四种 delegate 形态(经 core.ts 7027 LOC + 185 hits `this.canvas.` 实测):

| 形态 | 例 | 选项 A 判 facade? |
|---|---|---|
| 1. getter/setter delegate(同名) | `get beforeAddPen() { return this.canvas.beforeAddPen }` | ✅ public |
| 2. method 同名 delegate(主流) | `render() { this.canvas?.render(...) }` | ✅ public |
| 3. method 不同名 / 间接调用 | `Meta2d.foo() { this.canvas.bar() }` | ❌ public-ish/internal |
| 4. Meta2d 给 canvas property 赋值(consumer pattern) | `Meta2d.someMethod() { this.canvas.customMoveDock = dock }` | ❌ public-ish |

**形态 3 排除理由**:canvas.bar 通过 Meta2d.foo 间接暴露,但用户调 `meta2d.foo()` 不知道内部用了 canvas.bar;P4 拆解时 canvas.bar 视为内部实现可重组(只要 Meta2d.foo 行为不变)。**public 应该是"对外契约",同名 facade 是契约的明确形式**。

**形态 4 排除理由(精化 1 — user 提供精确措辞)**:**赋值不是暴露,赋值是消费**。

- `Meta2d.X() { return this.canvas.X(...) }` — Meta2d 把 canvas.X 暴露给 Meta2d 用户(facade,public)
- `Meta2d.foo() { this.canvas.someProp = value }` — Meta2d 设置 canvas 内部 hook,**不是把 someProp 暴露给 Meta2d 用户**(consumer pattern,不算 facade)

facade 本质是"我的用户调我等于调 X";赋值是"我用 X 配置内部行为"。两件事完全不同。`customMoveDock` 在 Meta2d 端**没有** `Meta2d.customMoveDock = ...` 暴露 — Meta2d 用户没法直接配 customMoveDock(必须通过其他 Meta2d method 间接配)— 所以 customMoveDock 不是 Meta2d 顶层暴露的 API。判 public-ish(无 facade,但有 V2 端 hook 赋值证据)。

**双向确认(精化 2)**:`hasFacadeDelegateEvidence(name)` 实施约束:

1. Meta2d class body 内必须**存在**同名 method `<name>(...)` 或 `get/set <name>(...)`
2. **AND** 该 method/getter/setter body 内有 `this.canvas.<name>(` 调用(method)或 `this.canvas.<name>` 引用(getter/setter)

单一条件不够 — 必须双向都满足才算 facade。

**False positive 防御(精化 2 补强)**:body 内 `this.canvas.<name>(` 应当是核心 delegate 调用(主路径),不能是 catch handler / 边角分支:

```typescript
// ❌ 不构成 facade(catch 边角):
Meta2d.foo() {
  try { this.someOtherLogic() }
  catch (e) { this.canvas.foo() }
}
```

Δ1.2 第一版可不做这层精度检查(简单双向确认即可);Δ1.3 全扫 review 时若发现 false positive 多再加。

**getter/setter 纳入 A(精化 3)**:与 method 同名 delegate 工程语义等价,都纳入 facade 判定。grep pattern:

- 同名 method:Meta2d class body 内 `<name>(...)` 定义,且 body 内有 `this.canvas.<name>(`
- getter/setter:Meta2d class body 内 `get <name>()` 或 `set <name>(...)`,且 body 内有 `this.canvas.<name>`

**问题 2 — 调用方列粒度注释**(11a 模板加):

> `调用方` 列在 Δ1 阶段仅填**类别**(V2 / 卫星 / facade-delegate / sibling),不填具体调用点。Δ3 完成 11d/11e 后,可选回填具体调用点(由 user 决定是否回填)。

落实位置:Δ1.3 markdown 渲染模板 + `scan-canvas-api.ts` 注释。

**问题 3 — 简化签名 vs 完整签名元说明**:

- **Δ1.1 sample**:签名手动构造,简化形态(主要类型 + 关键参数),用于结构 review
- **Δ1.2 全扫**:ts-morph 提取**完整签名**(完整类型 + 全部参数),与工单 §4.1 示例一致

后续 AI 不可默认 Δ1.2 沿用简化签名,11a 数据规模会缩水。脚本注释 + 99-progress 都标。

**工单影响**(2026-05-02 Δ1.1 落地):

- §3.2 字面文本**不动**,facade 判定标准记录在本 D-P0-12;**工单 §3.2-ter patch 是否落地待 Δ1.3 全扫后讨论**(避免提前 patch 把未发现的边角锁死)
- 11a 渲染模板加问题 2 注释 — 在 `scan-canvas-api.ts` `renderMarkdown` 函数注释 + 输出 markdown 头部 metadata
- `scan-canvas-api.ts` stage 2 加 `hasFacadeDelegateEvidence(name)` 函数,Δ1.1 step 3 重做 sample 时启用

### D-P0-13:V2 / 卫星 noise 过滤策略(2026-05-02 Δ1.1 step 3 闭合前)

**驱动**:Δ1.1 step 3 sample 重做时发现 V2 grep `\.render\b` 命中包括 OverlayLayer.render / SvgExportAdapter.render / React render 等同名 noise(78 hits across 18 files,大部分非 canvas method)。Δ1.2 全扫 100+ method 若不预先过滤,user review 工作量爆炸。

**策略**(双层 ∧):

**(i) receiver 限定 pattern**:

```regex
(?:[\w.]+\.)?canvas\.<name>\b
```

意思:命中 `canvas.<name>`(parameter / 局部变量直接调用)或 `xxx.canvas.<name>`(class field / 多层 chain 如 `pen.calculative.canvas.<name>`)。过滤掉非 canvas receiver 的同名 method(如 `OverlayLayer.this.render()` 中 receiver 是 `this` 不经 `.canvas` chain → 不命中)。

**(ii) 文件范围限定**:

- V2 grep:**包含** `src/engine/adapters/meta2d/`,**排除** `src/engine/adapters/meta2d/overlay/` 子目录
- 卫星 grep:不变(`packages/{flow,form,fta,chart,svg}-diagram/src/`)

排除 overlay/ 子目录理由:OverlayLayer 自己的 render/destroy method 与 canvas method 同名但不同对象;它在 `meta2d/` 子目录下但不应纳入 V2 evidence。

理由 — Meta2d adapter 是 V2 端唯一应直接消费 canvas method 的入口;其他模块(features/components)走 DiagramEngine 接口,不直接调 canvas method。

**不采用**:

- type-aware 判定(实施成本高,Δ1.2 估时爆)
- 白名单维护(user 维护成本高)

**Δ1.3 全扫 review 时**若仍发现 noise,再细化(如 exclude .test.ts comment-only hits)。

**工单影响**:无(实施细节)。`scan-canvas-api.ts` `hasV2Evidence` / `hasSatelliteEvidence` 落地。

### D-P0-16:Δ1.2 ping report 后 user 拦下 5 处补强(2026-05-02 Δ1.2 in progress)

**驱动**:Δ1.2 第一版 ping report 后 user 拦下 3 个 blocker + 2 个 missed valuable discoveries。每一项老实承认 + 处置。

**内容**:

**(1) blocker 1 — Δ估时严重高估,baseline 失效**

实际脚本运行 6.2 秒;我总工作时间 ~40 分钟;Δ0c 估 1.5 工作日 (12h)。**(A) estimate 严重高估** — Δ0c 时假设 Δ1.1 step 3 没写脚本骨架 + step 2.5 inventory,实际两件都做了。Δ1.2 仅补 placeholder + Node fs 重写 grep + bug fix。

**baseline calibration**:1.5 工作日 estimate **失效**,不再作 D-P0-工作纪律 #4 "25% 阈值"基础。Δ1.3 / Δ1.4 / Δ2 重新估时基于 Δ1.2 实测(40 分钟 + 主要 grep helper Node fs 重写)。

**4 问题验证**(无 short-circuit):

- facade 双向确认对 262 entries:✅ 全跑(main loop 内每个 entry 都调 `hasFacadeDelegateEvidence`)
- V2 noise pattern 对 262 entries:✅ 全跑(262 × 63 ≈ 16500 in-memory regex test < 200ms)
- D-P0-11 §a 交叉校验:✅ 全扫数据(installUxPatches.ts 393 行全文 grep)
- internal 145 条 4 grep miss:✅ 全跑(无 short-circuit)

**(2) blocker 2 — facade pattern 验证(数据正确,无 bug)**

User 怀疑 width/height/markDirty/canvas 全 public-ish 暗示 facade pattern 漏 class-property。grep core.ts 验证:

- width / height:Meta2d **无** facade method/getter/setter;`this.canvas.width` 仅作"值" 使用(rect 计算),**不是 delegate facade** → public-ish 正确
- markDirty:Meta2d **无**;`this.canvas.markDirty` 在 core.ts 0 hits → public-ish 正确(V2 直接 `canvas.markDirty()`)
- canvas:Meta2d.canvas 是 public field(L95);user 通过 `meta2d.canvas` 访问 → public-ish 正确
- listen / clearCanvas:Meta2d 无同名 method;只 `this.canvas.listen()` / `this.canvas.clearCanvas()` 在某 Meta2d.foo body 内调用(形态 3 不同名间接调用,D-P0-12 排除 facade)→ public-ish 正确

**Meta2d 真的不为 width/height/markDirty 提供 facade**(让 user 直接 `meta2d.canvas.X` 访问)。这是 V1 god-class 的设计选择,不是脚本 bug。

**(3) blocker 3 — quirks 3 vs 51(R8 苗头修正)**

我之前 ping report 说"Δ4 另写脚本扫"是误导 — 实际 canvas.ts 全文 `@quirk\s+ch\d+\.\d+\s+#\d+` grep **仅 3 条**(line 196 ch11.7 #4 / line 3296 ch11.6 #2 / line 6850 ch11.7 #1+#2),全部已在 method jsdoc 上,脚本 jsdoc-on-method 提取**就是全集**。

**51 vs 3 来源差异**:_handoff-debts O-03 提及的 17+17+17=51 是**多源汇总**(canvas.ts 3 + core.ts ? + render.ts ? + V2-side records + M3 D retrospective),不是 canvas.ts 内 @quirk 注释总数。Δ2(扫 core.ts/render.ts)+ Δ3-Δ4 整合 V2-side records 后,11f §4.3.1 quirks 总数会接近 51。

**修正**:scan-canvas-api.ts 加 `collectAllQuirks()` file-wide grep(`@quirk\s+ch\d+\.\d+\s+#\d+` 全文 regex,不限 jsdoc-on-method),输出 quirks-fileWide.json 作为 robust 后备。当前 file-wide hit 数仍 3(与 jsdoc-on-method 一致),但脚本未来防漏 inline @quirk 注释。

**(4) valuable discovery 1 — 暗线全扫**

user 提示我没主动识别其他暗线。grep 卫星端 `pen.calculative.canvas.(parent|store|externalElements|mouseDown|showInput|render)` 命中 **95 hits across 12 files**,**6 种 sub-form**:

| sub-form | hit 数 | P4 拆解风险 |
|---|---|---|
| sub-A `render()` | 17+ | 拆解后保留 method 兼容 |
| sub-B `parent.<X>`(反向访问 Meta2d) | ~15 | 反向耦合 — parent chain 必须保留 |
| sub-C `store.<X>` | **70+**(table2 34 / table 11 头部大量)| canvas.store 当前 public field — 拆后 store 可达 |
| sub-D `externalElements` | 2(LightningChart) | DOM ref 公开 field |
| sub-E `mouseDown` | 1(slider) | mouse state 公开 field |
| sub-F `showInput()` | 1(table) | 不通过 facade 的 method |

V2 端 grep `pen.calculative.canvas` **0 hits**(V2 走 DiagramEngine 抽象)。**暗线问题集中在卫星包**。

**11h G-001 扩展**:扩展为 6 sub-form audit table。如 user 选 (C) case-by-case,Δ1.3 时 G-001 split 为 G-001a/b/c/d/e/f。

**(5) valuable discovery 2 — public-ish 54% 工程含义 + 11a 末尾 valuable discoveries 节**

11a 末尾(surface 映射预判 placeholder 之前)新增 `## Δ1.2 数据规模 valuable discoveries` 节,4 子节:

- V1 god-class 公开面规模(public-ish 54% 事实契约,P1 修订基础)
- facade-delegate 暴露面(53 条;P1 spike 对照 surface v1.0 看漏列)
- monkey-patch 形态(3 wrap + 1 hook-util)
- 卫星非 facade 暗线访问路径(P4 拆解风险,11h G-001+)

P1 surface 修订关键输入材料,Δ1.3 review 后如 user 觉得需要 promote 独立文档可抽出。

**工单影响**:无(全部脚本 + 11a 渲染 + 11h 内容更新,工单 schema 不动)。

**驱动**:Δ1.1 step 3 sample 覆盖 facade + V2 + 卫星 三类同时命中(active/render),也覆盖 facade + V2 命中卫星 miss(inactive/destroy)。但缺一类:**纯 facade,V2/卫星全 miss**。

**内容**:`facade-delegate` **单独** 作为 public 判定证据,**即使 V2/卫星全 miss**。Meta2d 显式 facade canvas.X 即代表 X 是对外契约(顶层 Meta2d 暴露就是 §3.2 "在顶层 meta2d 类暴露" 的硬证据),不需要 V2/卫星再次确认。

**实施**:`scan-canvas-api.ts` `classifyClassMember` 函数注释 + 逻辑 `if (externalEvidence.facadeDelegate) return 'public'` 已在 D-P0-12 落地,本决策只是显式声明语义边界。

**Δ1.2 全扫**若撞到"纯 facade,V2/卫星全 miss"的 method,**仍判 public**(D-P0-14 显式覆盖)。

**工单影响**:无(脚本注释级别)。

### D-P0-15:卫星包 pen.calculative.canvas 暗线发现(2026-05-02 Δ1.1 step 3 工程发现)

**驱动**:Δ1.1 step 3 真实 grep 卫星端发现 17+ 处 `pen.calculative.canvas.render()` 形态 — 卫星包通过 Pen.calculative chain 直接访问 canvas 实例,**绕过 Meta2d facade**。

**内容**:

- canvas 的对外契约不仅是 Meta2d 顶层 facade,还包括 `pen.calculative.canvas` 暗线访问路径
- D-P0-12 facade-delegate 判定标准基于 Meta2d 顶层 facade,**未覆盖暗线访问**
- 11h-surface-gaps.md 加 G-001 条目标 `需 user 裁决`(选项 A 承认暗线为契约 / 选项 B 卫星违章丢弃 / 选项 C case-by-case)
- P0 退出门槛 5 当前 ❌ 未通过(1 条 `需 user 裁决` 待决)

**Δ1.2 全扫意识**:其他 method 可能也有类似"非 facade 暗线"调用路径,grep pattern 不能漏。如何全扫暗线访问留 Δ1.2 设计 — 当前 D-P0-13 receiver pattern `(?:[\w.]+\.)?canvas\.<name>` 的多层 chain 形态已覆盖暗线 grep,但语义解读(算 public-ish 还是不算)等 G-001 user 裁决。

**工单影响**:无(11h gap 队列条目)。`11h-surface-gaps.md` 创建 + G-001 落地。

### D-P0-17:Δ1.2 闭合后 4 处深层问题处置(2026-05-02 Δ1.3.1)

**驱动**:Δ1.2 闭合后 user 拦下 4 处深层问题(估时方法本身错 / facade 完整性问题没识别 / quirks 51 来源没真验证 / G-001 (A)(B)(C) 自引入 R8 苗头)。Δ1.3.1 子里程碑全部落地。

**(1) 深层问题 1 — 估时方法本身错,改用 user review cycle 数度量**

LLM 不是人类工程师 — 实际工时永远与人类估时有 5-30 倍 gap(LLM 推理瞬时 + 工具调用 I/O + user review cycle 占 90%+ 总壁钟时间)。Δ1.2 实测 6.2 秒脚本 + 40 分钟工作时间 vs 12 小时 estimate(20x gap)。

**根因**:整个 P0 工单估时(3-5 周)按人类工程师视角估,实施者是 Claude Code。如照原估时管理,Claude Code 永远显得"超快完成",user 永远在 review 工作量上被压垮。

**修订**:工作纪律 #4 改用 **user review cycle 数** 度量(见下方工作纪律段修订)。单 Δ 内部 Claude Code 工时 < 1 小时 不再是关注点;关注点是 ping 报告的密度 + 质量。Δ 估时改成 cycle 数(Δ1.2 = 1 ping + N user review cycle;实际 5+ cycle 因 user 拦补强 — 这是预期内 review work)。

**(2) 深层问题 2 — Meta2d facade 完整性问题(P1 必看)**

V1 god-class facade 设计**不完整**:53 facade-delegate + 63 public-ish(无 facade 但 V2/卫星直接调)+ 暗线 G-001 6 sub-form。**V1 实际 surface 远超 surface v1.0 119 API**。

**P1 spike 必做** — surface v1.0 vs V1 实际 surface 4 维差集分析:有/有 / 有/没 / 没/有 / 暗线。每维不同处置(P1+P2 新建 / P3 V2 切换 / 11h gap / P4 兼容路径设计)。

**落地**:11a 末尾 valuable discoveries 节加 "Meta2d facade 完整性问题(P1 必看)" 段(scan-canvas-api.ts renderMarkdown 函数扩展 + 重跑生效)。

**(3) 深层问题 3 — quirks 51 来源真验证**

Δ1.3.1 read 三份原文(`_handoff-debts O-03` / `meta2d-internals.md ch11.1-11.9` 索引 / `10-m3-retrospective §2.4`)诊断:

- meta2d-internals ch11 索引实际 **33 quirks**(11.1: 6 + 11.2: 5 + 11.3: 4 + 11.4: 4 + 11.5: 3 + 11.6: 3 + 11.7: 5 + 11.8: 1 + 11.9: 2 = 33)
- M3 retrospective Phase D 收 31 + 2 scope-fenced = 33 ✅
- _handoff-debts O-03 写 "17+17+17=51" 是**笔误 / 数字错** — 可能性 (C) 成立(_handoff-debts O-03 数字本身不准)
- canvas.ts 内 `@quirk` 注释 **3 条** 真全集
- 30 条差额(33 - 3)在 **meta2d-internals.md ch11 + M3 retrospective** 文档化记录(behavioral 描述 + V2-side fixed),不在 canvas.ts 源码内 `@quirk` 注释

**结论**:Δ1.2 脚本扫到 3 条是 canvas.ts 真全集;Δ4(11f §4.3.1 quirks)需多源汇总:canvas.ts 3 + core.ts ? + render.ts ? + meta2d-internals.md ch11 索引 + M3 retrospective + V2-side records。**总数实际 33,不是 51**。

**落地**:99-progress D-P0-17 此条记录;**Δ1.3.2 同步追溯修正 _handoff-debts O-03**(2026-05-02 user §3 §a 拍板:source of truth 错应追溯修正,不止在 D-P0 产出用正确数字):
- `_archived/_handoff-debts.md` O-03 行内加 `[2026-05-02 D-P0-17 §3 修正]` 注释 + 修正数字 51 → 33 + 列出 9 sub-section break down(11.1-11.9 求和验证)
- `_archived/_handoff-debts.md` 文件顶部 `> 修订` 段加全文级修订注释

— **不进 11h**(11h 是 surface 修订相关 gaps,doc accuracy 不在范围)。

**(4) 深层问题 4 — G-001 (A)(B)(C) Claude Code 自引入 R8 苗头**

(A)(B)(C) 选项是 Δ1.2 ping report 时 Claude Code **提议**的处置体系,**不是上轮 D-P0-05 既定方案**(D-P0-05 仅定 11h 三选一标签 `surface-补 v1.1` / `主动放弃` / `需 user 裁决`)。Claude Code 在 ping report 直接夹带"待 user 选 (A)(B)(C)" 是轻度 R8 苗头(自引入方案选择体系然后假装是既定方案)。

**修正**:11h G-001 显式标注 (A)(B)(C) 是 Δ1.2 期间 Claude Code 提议、**不是上轮 D-P0-05 既定**,user 可拒绝该提议体系改回 D-P0-05 整体三选一。新增"等 user 拍板 3 问"(是否接受提议体系 / 选 A/B/C / 不接受改用三选一)。

**Δ1.3.2 user 拍板**:**(A)(B)(C) 提议被 user 拒绝,撤回**。理由(by user):

1. (A)(B)(C) 是 Claude Code 引入的新概念,user 没有需要这个层次的工程理由
2. D-P0-05 三选一(承认契约 / 主动放弃 / 需 user 裁决)适用于任何 gap(含复合 gap)
3. G-001 6 sub-form 整体作一条 gap,标 `需 user 裁决`,P1 spike 启动前一并 review
4. 引入 (A)(B)(C) 等于在 D-P0-05 之上加一层判定,工程负担增加但不产生新价值

**Δ1.3.2 落地**:11h G-001 撤回 (A)(B)(C) 体系,改回 D-P0-05 三选一格式;user 已给裁决方向(P1 spike 启动前一并 review 6 sub-form 决定处置粒度);**G-001 状态从"待决"改为"已 user 裁决方向"**,P0 退出门槛 5 ✅ 通过(队列零条**待决**)。

**元教训**:LLM 提议新方案选择体系时必须显式标注"这是新提议",不能让 user 错以为是既定方案。这是 R8 形态 2(自引入新方案 + 假装既定)的具体防御。**user 有否决权 — 不是所有 Claude Code 提议都要进入工单体系**。

**Δ1.3.2 a+b+c 闭合时再次 R8 自查 fail(R8 形态 3)**:Claude Code 在 Δ1.3.1 修复 (A)(B)(C) 撤回后,**继续判 P0 退出门槛 5 ✅ 通过** — 把 user 的"P1 spike 时再细分"理解为"已裁决"。但 D-P0-05 三选一是 `承认契约` / `主动放弃` / `需 user 裁决`,user 实际表态是"推迟"不属于这三类。**这是 R8 形态 3:把 user 非显式表态解释成显式裁决**。修订:见 D-P0-18。

### D-P0-18:D-P0-05 加第四类标签 `推迟到下一 phase`(2026-05-02 Δ1.3.2 a+b+c R8 形态 3 修正)

**驱动**:Δ1.3.2 a+b+c 期间 user 拦下 R8 形态 3(把 user "P1 spike 时再细分"理解为已裁决,自判 P0 退出门槛 5 ✅)。**user 拍板修订 D-P0-05 加第四类标签**(走方案 (b) 显式承认推迟合法 + 加约束防滥用)。

**为什么不走方案 (a) 严格三选一**:

P0 阶段 user 缺 P1 spike 信息,对 G-001 6 sub-form 实际裁决 = "凭直觉"违反 P0 工程纪律。(a) 严格执行会强迫不充分裁决。(b) 显式承认推迟合法,但加 3 条强制附属约束防滥用。

**D-P0-05 标签变更:三选一 → 四选一**:

| 标签 | 含义 |
|---|---|
| `surface-补 v1.1` | 进 P1 修订队列(原 D-P0-05) |
| `主动放弃` | Phase 4-5 不重建,V2 端自管(原 D-P0-05) |
| `需 user 裁决` | 显式标记决策待定(原 D-P0-05) |
| **`推迟到下一 phase`(D-P0-18 新增)** | P0 阶段缺信息无法裁决但需后续 phase 处理;**必附 3 条强制附属**:① 推迟理由 / ② 触发恢复条件 / ③ 裁决最晚时间点 |

**3 条强制附属(D-P0-18 约束防滥用)**:

- **推迟理由**:为什么 P0 阶段没法裁决(必须不是"懒得裁决",而是"裁决证据不足")
- **触发恢复条件**:在哪个 phase / 哪个 milestone 启动前必须 review(必须有触发点)
- **裁决最晚时间点**:绝对最晚 deadline(超过此时间点必须被催办)

**无附属则不算合法标签**,降级为 `需 user 裁决` 待决,阻塞 P0 退出门槛 5。

**P0 退出门槛 5 措辞修订**:"零条 `需 user 裁决` 待决"(`推迟到下一 phase` 不阻塞此门槛 — D-P0-18 显式承认推迟合法)。

**Δ1.3.2 a+b+c 落地**:

- 工单 §6 退出门槛 4(三选一 → 四选一)+ §6 退出门槛 5 措辞补充(`推迟到下一 phase` 不阻塞)
- 工单 §修订日志加 D-P0-18 行
- 11h header 三选一标签 → 四选一
- 11h G-001 标签从 `需 user 裁决` 改为 `推迟到下一 phase` + 3 条强制附属(理由 / 恢复条件 / 最晚时间点)
- 11h 队列状态重新计:`推迟到下一 phase` 1,`需 user 裁决` 待决 0
- 11h P0 退出门槛 5 状态:✅ 通过(零条 `需 user 裁决` 待决;`推迟到下一 phase` 1 条不阻塞)

**元教训(R8 形态 3 防御)**:LLM 必须自问 — user 真的在三选一(或四选一)标签里给了明确选择吗?推迟方向 / 沉默 / 模糊表态都不是显式裁决。这是 self-check Q5(D-P0-17 §1 精化时落地的第五条 self-check 自问):

> Q5. 我有没有把 user 的非显式表态(沉默 / 模糊 / 推迟方向)解释成显式裁决?具体:user 是否真的在三选一(或四选一)标签里给了明确选择?

**工单影响**:§6 退出门槛 4-5 + §修订日志(下方 patch);schema 调整(D-P0-05 加第四类)是 user 显式批准的合法修订,不是 R8 苗头。

### D-P0-27:G-001 6 sub-form 重新裁决(对称约束反向应用第二次)(2026-05-02 Δ4)

**驱动**:Δ3 数据揭示 G-001 是卫星消费 canvas 的**主路径(11/12 = 92% sat sites)**,不是次要暗线。P4 拆解方案 90%+ 行为受 G-001 裁决方向左右。

**对称约束反向应用第二次**(D-P0-23 扩展):

- 第一次(D-P0-23):user 拍板内部矛盾(option 1/2 数据)→ user 修拍板
- **第二次(本条)**:user 拍板时信息不充分(Δ1.3.2 D-P0-18 推迟到下一 phase)→ Δ3 数据让信息充分 → user 修拍板(P0 收口前裁决,不再推迟)

**裁决**(D-P0-05 三选一,不再 D-P0-18 推迟):

| sub-form | hits | 裁决 | P1 spike 输入 |
|---|---|---|---|
| G-001a `render()` | 17+ | `surface-补 v1.1`(承认契约)| 已是 facade-delegate 在 surface |
| G-001b `parent.<X>` | ~15 | `主动放弃` | P4 移除 parent chain;P7 卫星重写 |
| G-001c `store.<X>` | **70+** | `surface-补 v1.1`(承认契约)| **surface v1.0 加 store accessor API** |
| G-001d `externalElements` | 2 | `surface-补 v1.1`(承认契约)| **surface v1.0 加 DOM accessor** |
| G-001e `mouseDown` | 1 | `主动放弃` | P4 不暴露 mouse state;P7 卫星走 events/gesture |
| G-001f `showInput()` | 1 | `主动放弃` | P4/P7 卫星改 Meta2d facade |

**P1 spike surface v1.0 → v1.1 修订必加项**:

- **store accessor API**(sub-C 70+ hits 主路径 — 数据访问主路径必须暴露)
- **DOM accessor**(sub-D LightningChart 等 DOM 操作必须可达)

**11h 队列重新计**:7 总条目(G-001 拆 6 + G-002)/ 3 `surface-补 v1.1` / 3 `主动放弃` / 0 `需 user 裁决` 待决 / 1 `推迟到下一 phase`(G-002)。

**P0 退出门槛 5**:✅ 通过(零条 `需 user 裁决` 待决;G-001 全部 P0 收口前裁决)。

### D-P0-28:Q6 self-check(R8 形态 5 estimation 替代 enumeration)(2026-05-02 Δ5 重做)

**驱动**:Δ5 第一版 ping user 拦下 4 严重问题:

1. Method 维度 B = 0 是分类漂移(viewport.worldFromScreen / geometry.queryPensByRect / extension.register* 8 项 / instance.create / linkViewports / time.setSource / theme.registerTheme / transaction.commit / preview 等 V1 无等价 surface 方法,实际 method B 至少 20+ 不是 0)
2. **没有逐条分类列表,只有估算**(A' 64 / B' 21 / D 64 全是 ~estimate)
3. user 元说明 challenge 检验是 self-confirmation 空话(没逐条数据)
4. 具体分类错误(store accessor 同时 B' 和 C — 实际是 C 维度 surface 没 + V1 暗线 + 11h G-001c 已裁决)

**R8 形态 5(本次发现)— Estimation 替代 Enumeration**:

把"逐条分析"压缩成"按类汇总估算",省略真正的工作。具体:工作流应该是:
- Step 1:对 217 条逐条分到 6 类
- Step 2:按类计数 + 占比
- Step 3:工程含义分析

但 Δ5 第一版**跳过 Step 1**,直接给 Step 2 估算。

**Q6 防御扩展**:

> Q6:**汇总数据前必须有逐条 enumeration**。不能跳过 enumeration 直接给 estimate。
>
> **trigger 时机**:Δ 完成时报告 "~N 条某类" 前,先确认是否真做了逐条分类。
>
> **fail 处置**:跳过 enumeration → 等同 R8 形态 1(漏做)+ 形态 5(estimation 替代 enumeration),走 D-P0-19 §3 (a) 重做整 Δ。

**R8 关系矩阵扩展**(D-P0-19 §4):

```
R8-1   把"我能做的"算"完整完成"          → Q1
R8-2   自引入新方案体系假装既定            → Q2
R8-3   把 user 非显式表态解释成显式裁决     → Q5
R8-5   estimation 替代 enumeration         → Q6(本条新增)
辅助:Q3 self-check 机器化盲区 / Q4 valuable discovery 漏 / 对称约束
```

**Δ5 第一版处置**(走 D-P0-19 §3 (a)):**user review 发现 R8 形态 5 → 重做整 Δ5-main**。

**重做范围**:
- canvas.ts 116 + core.ts 25 + 11h G-001 6 sub-form + impl 33 quirks + 41 emits + 3 EditTypes + 5 side-effects + Reactive 三层 + surface 119 反向 enumeration = ~355 条逐条分类
- 每条带 V1 引用(C/M 编号)+ surface 引用(accessor.method)+ 6 类分类 + 理由
- 重新派生总分布(基于 enumeration 不是 estimate)
- 重新 valuable discoveries(基于真分类)

**Δ5 第一版 11g 报告作废**(已 mark 为 deprecated;重做后产生 11g v2)。

**工单影响**:无 schema 改动;**§修订日志 D-P0-28** 已加。

**对称约束工程教训**:**当数据信息不充分时拍板"推迟",数据充分后必须 reconcile 拍板**(不只是 Q5 user 文字解释,也包括 user 自己在不充分信息时的过度推迟)。Claude Code 责任:数据充分时主动浮 valuable discovery,让 user 重新评估推迟决策。

**工单影响**:无 schema 改动;**§修订日志加 D-P0-27 行**(已落地)。

### D-P0-29:Δ5 v2 通过 + 11h expansion 11 G-XXX 推荐(对称约束反向应用第三次)(2026-05-02 Δ5 v2 后)

**驱动**:Δ5 v2 enumeration 完成(217 条 + surface 119 反向 = ~378 条逐条分类)→ C 维度从 v1 estimate 3 条扩到 v2 enumeration 38 条;新发现 ~30 条 C 类 candidates。User Δ5 v2 verdict:
- (a) 通过(条件:user 抽样 verify B 5 / A' 51 多出 / B' 7 项归属)
- (b) 11h 30 条 C 类 candidates **必须 P0 收口前裁决**,走 G-001 同款 D-P0-05 + D-P0-18 四选一标签

**对称约束反向应用第三次**(D-P0-23 / D-P0-27 之后):

| 次 | 触发场景 | 信息状态 | 修拍板方向 |
|---|---|---|---|
| 第一次(D-P0-23)| user 拍板内部矛盾(option 1/2 数据)| 信息有矛盾 | user 修拍板 |
| 第二次(D-P0-27)| Δ1.3.2 D-P0-18 推迟 G-001 信息不充分 | Δ3 数据让信息充分 | user 修拍板:P0 收口前裁决,不再推迟 |
| **第三次(本条 D-P0-29)** | Δ5 v1 estimate C=3 推到 P1 | Δ5 v2 enumeration 让信息充分(C=38 / +35 候选)| user 修拍板:**P0 收口前裁决** |

**模式固化**:**每次 enumeration 完成 + 信息充分时,11h 队列必须 P0 收口前裁决,不能推到下一 phase**。D-P0-18 的"推迟到下一 phase" 是个例外(信息真不充分时),不是默认。

**11h expansion 落地**(本次):

新增 G-003 至 G-013 共 **11 条 G-XXX**(grouping by concept,覆盖 ~30 原始 method/event):

| G-XXX | 名称 | 推荐标签 | 覆盖原始 method/event 数 |
|---|---|---|---|
| G-003 | clearRuleLines | 推荐 主动放弃 | 1 |
| G-004 | pushHistory | 推荐 主动放弃 | 1+1(canvas+core)|
| G-005 | undo/redo history navigation | 推荐 surface-补 v1.1 | 4(canvas/core ×2)|
| G-006 | clipboard copy/cut/paste(method+event+drop)| 推荐 surface-补 v1.1 | 7(method 3 + event 4)|
| G-007 | image export toPng/activeToPng/pensToPng | 推荐 surface-补 v1.1 | 4(canvas 3 + core 1)|
| G-008 | inline input showInput/hideInput(method+event)| 推荐 主动放弃(同 G-001f)| 4(method 2 + event 2 — 与 G-013 部分 cross-ref)|
| G-009 | clearCanvas utility | 推荐 surface-补 v1.1 | 1 |
| G-010 | DOM accessor canvas/width/height | 推荐 surface-补 v1.1(扩 G-001d)| 3 |
| G-011 | perf hints markDirty/markAllDirty | 推荐 surface-补 v1.1 | 2 |
| G-012 | raw mouse events 5 | 推荐 需 user 裁决(选项 a/b 二选一)| 5 |
| G-013 | input events clickInput/input | 推荐 主动放弃(随 G-008)| 2 |

**总覆盖**:11 G-XXX × 平均 ~2.6 原始 entry = ~30 entries(去重 G-008/G-013 cross-ref 后 ~28-30)

**Grouping by concept 决策理由**:

- G-001 已是 grouping 模式(1 条带 6 sub-form),precedent 一致
- 30 个原始 method/event 1:1 拆出 30 G-XXX 信号噪比低,user 裁决疲劳
- grouping by concept(history 操作 / clipboard / image export / DOM accessor / perf hints / etc)更符合工程含义
- 如 user 拒绝 grouping 要求 1:1 → expand G-XXX 至 ~30 entries(每 method/event 一行)

**待 user verdict 落地最终标签**(11 推荐):

- 6 推荐 surface-补 v1.1(G-005/006/007/009/010/011)
- 4 推荐 主动放弃(G-003/004/008/013)
- 1 推荐 需 user 裁决 单条二选一(G-012 选项 a / b)

User verdict 后 11 条全落地最终标签;P0 退出门槛 5 才能从🔶 → ✅ 通过。

**Δ5 v2 verify 辅助信息**(user 抽样 verify):

- **B 5 条**(viewport.worldFromScreen / extension.registerShape / instance.create / time.setSource / preview)→ 全在 11g §4 line 259-268,V1 等价"无",归 B 故意新能力
- **A' 95 条 = canvas 28 + core 8 + impl quirks 28 + impl emits 22 + impl history 4 + impl side-effects 5 = 95 ✓**
  - 同名 ~11(D-P0-24)+ quirks 33 = 44
  - 多出 51 = canvas 28 + core 8 - 部分同名 + emits 22 + history 4 + side-effects 5 - 部分 quirks dedupe ≈ 51
- **B' 0 的 7 项归属 全归 C**:
  - markDirty / markAllDirty → C(11g line 161-162 → G-011 推荐 surface-补 v1.1)
  - DOM accessor canvas/width/height → C(line 121-123 → G-010 + G-001d)
  - store accessor → C(line 209,G-001c 已 surface-补 v1.1)
  - clearCanvas → C(line 100 → G-009 推荐 surface-补 v1.1)
  - mouse events 5 → C(line 302 → G-012 推荐 需 user 裁决)
  - undo()/redo() → C ×2(line 43-44 + 326 → G-005 推荐 surface-补 v1.1)
  - copy/cut/paste → C ×3(line 52-54 + emits → G-006 推荐 surface-补 v1.1)
  - 7 项 ✅ 全部归 C(Δ5 v1 错把 7 项归 B';v2 修正)

**P1 spike 工作量重估**(D-P0-29 后):

- v1 估:11h surface-补 v1.1 队列 3 条(G-001a/c/d);P1 spike 6-8 周
- v2 enumeration + user verdict 后实际:**11h surface-补 v1.1 队列 8 条**(3 旧 G-001a/c/d + 5 新 G-005/007/009/010/011)
- P1 spike 估时**再扩 1-2 周**(surface 修订量大幅扩展);预期 7-9 周

**工单影响**:无 schema 改动;**§修订日志加 D-P0-29 行**(本次落地)。

---

## D-P0-29 user verdict 落地(2026-05-02)

### 11 G-XXX 推荐 vs user verdict 对照

| G-XXX | 名称 | 推荐 | user verdict | 改判? |
|---|---|---|---|---|
| G-003 | clearRuleLines | 主动放弃 | **主动放弃** | ✓ 同意 |
| G-004 | pushHistory | 主动放弃 | **主动放弃** | ✓ 同意 |
| G-005 | undo/redo history nav | surface-补 v1.1 | **surface-补 v1.1** | ✓ 同意 |
| G-006 | clipboard copy/cut/paste | surface-补 v1.1 | **主动放弃** | ⚠ 改 — user 工程判断 |
| G-007 | image export toPng × 3 | surface-补 v1.1 | **surface-补 v1.1** | ✓ 同意 |
| G-008 | inline input showInput/hideInput | 主动放弃(同 G-001f)| **主动放弃** | ✓ 同意 |
| G-009 | clearCanvas | surface-补 v1.1 | **surface-补 v1.1** | ✓ 同意 |
| G-010 | DOM accessor canvas/width/height | surface-补 v1.1 | **surface-补 v1.1** | ✓ 同意 |
| G-011 | perf hints markDirty/markAllDirty | surface-补 v1.1 | **surface-补 v1.1** | ✓ 同意 |
| G-012 | raw mouse events 5 | 需 user 裁决(a/b)| **主动放弃**(选项 b)| user 选 b — 工程判断 |
| G-013 | input events 2 | 主动放弃(随 G-008)| **主动放弃** | ✓ 同意 |

**verdict 分布**:9 同意 / 2 user 工程判断改(G-006 / G-012)

### G-006 / G-012 user 工程判断改判 — 共同设计哲学

两条改判都基于同一原则:**diagram 抽象 + 业务层组合,不集中 cross-cutting concern**(V1 god-class 反模式)。

**G-006 clipboard 改主动放弃**(user 工程理由):

1. clipboard 是业务层逻辑,不是 diagram 抽象 — V1 god-class 反模式(canvas 全局 mouseup handler 触发 selection 的 clone/serialize/deserialize)
2. surface v1.0 设计哲学:diagram 操作 + 业务层组合;不集中 cross-cutting concern
3. surface v1.0 已有足够操作:`selection.get` + `pens.duplicate` + `pens.add` 组合可实现 clipboard 业务逻辑
4. V2 业务层自实现优势:跨实例 / 跨标签页 / 序列化格式选择(JSON / SVG / 自定义)的灵活性

**G-012 raw mouse 选选项 b 主动放弃**(user 工程理由):

1. god-class 反模式:把所有 input handling 集中在 diagram API 是 V1 god-class 反模式
2. DOM listener 更灵活:V2 业务层通过 G-010 `meta2d.dom.canvas` 暴露的 DOM ref 直接 `addEventListener` — 支持 pointer events / touch events / custom gestures
3. surface v1.0 已有抽象 events 够用:`selection:*` / `hover:*` / `pen:*` 已 cover 业务层 mouse interaction 需求
4. 设计哲学一致(与 G-006 同)

### 最终 11h 队列分布(P0 收口)

| 标签 | 数 | entries |
|---|---|---|
| `surface-补 v1.1` | **8** | 3 旧(G-001a/c/d)+ 5 新(G-005/007/009/010/011)|
| `主动放弃` | **9** | 3 旧(G-001b/e/f)+ 6 新(G-003/004/006/008/012/013)|
| `推迟到下一 phase`(D-P0-18)| **1** | G-002(`m` 缩写,P3 V2 切换时 close)|
| `需 user 裁决` 待决 | **0** | — |
| **总** | **18** 索引行(19 entries 含 G-001 parent)| 全部 user 显式裁决 |

### P0 退出门槛 5 ✅ 通过

- 队列零条 `需 user 裁决` 待决 ✓
- G-001 6 sub-form 全部 P0 收口前裁决(D-P0-27)✓
- G-002 D-P0-18 推迟合法(3 条强制附属在)✓
- 11 新条 G-XXX(D-P0-29)全部 P0 收口前 user verdict 落地最终标签 ✓

### P1 spike 启动 trigger 最终输入材料

P1 spike 实施者拿到的输入(P0 → P1 桥工程价值落地):

- **V1 真 surface 144 条**(method 维度 116 canvas + 25 core + 3 11h 已 surface-补)+ 6 类完整 enumeration
- **V1 implicit behaviors 完整 enumeration**(quirks 33 + emits 41 + history 3 EditTypes + side-effects 5 + Reactive 9)
- **surface v1.0 119 method + 47 events + 4 大设计选择**
- **11h 19 条 gap 全部 user 显式裁决**:
  - 8 surface-补 v1.1(P1 spike 修订入队 — surface v1.0 → v1.1 必加项)
  - 9 主动放弃(P3/P4 不重建,V2 自管)
  - 1 推迟到下一 phase(G-002 m 缩写,P3 V2 切换)
  - 1 G-001 parent 已拆 6 sub-form
- **73 条故意新能力 (B)**:P1+P2 工作量峰值的具体清单
  - Reactive 三层 9 条(StyleExpression 7 类 + DataSource framework + Reactive<T> wrap)
  - extension.register* 14 条(shape/animation/dataSource/connectionValidator/tagNamespace/edgeType/anchorType/viewMode/install/uninstall/list/unregisterShape/unregisterDataSource/getDataSource)
  - layers 8 条(整个 accessor — V1 无 layer 概念)
  - geometry 6 条(空间查询 R-tree/quadtree)
  - instance 5 条 + time 8 条 + theme 2 条 + meta2d new 7 条 + 其他

### 对称约束反向应用累积固化(D-P0-23/27/29)

| 次 | 触发场景 | 信息状态 | 修拍板方向 |
|---|---|---|---|
| D-P0-23 | user 拍板内部矛盾 | 矛盾 | user 修拍板 |
| D-P0-27 | G-001 D-P0-18 推迟 | Δ3 数据让信息充分 | P0 收口前裁决 |
| **D-P0-29** | Δ5 v1 estimate C=3 推 P1 | v2 enumeration C=38 信息充分 | **P0 收口前裁决** |

**模式固化**(P1+ 整个 11-17 月项目通用):**enumeration 完成 + 信息充分时,11h 队列必 P0 收口前裁决,推迟是例外**。每个 phase 期间出新数据让旧拍板信息不足时,user 必须 reconcile,不能默认推迟。

### D-P0-30:11g test 位置 + 选取策略 + Δ6 7 子(2026-05-02 Δ6 启动 plan)

**驱动**:Δ6 启动 plan ping(B1-B4 4 件 verdict)— user challenge 我推荐 B2 + 加 A' 类策略(B3)+ 加 Δ6.X(B4)。

**§1 测试位置 — `../meta2d.js/packages/core/tests/behavioral/`**(B2 user challenge 修订(b))

| 论据 | 来源 |
|---|---|
| docs/ 下放 test 反 idiomatic | user(我自己写过)|
| docs/ 下 test 不进标准 CI/CD pipeline + 跑命令非标准路径 + V2 link 路径变 docs/ import 全断 | user 工程问题 |
| 工单 §4.4 路径不是"放 docs/",是"目录名 11g-behavioral-test-suite/" — 目录名可放任何位置 | user 工单解读 |
| test 跟 source 同仓是 npm package 工程惯例 | user |
| 11g 报告(markdown 给 P1 读)≠ 11g test(可执行给 CI 跑)— 职责分离 | user |
| refactor-public-api 体系完整性靠逻辑引用不靠物理路径同目录 | user 反驳我的"产物碎掉" |

**修订形态**:
- 路径:`../meta2d.js/packages/core/tests/behavioral/`
- 子目录:工单 §4.4 同结构(`api-contract/{canvas,core,render}` / `call-site/{adopt-*,v2-adapter}` / `implicit/{quirks,emits,history,side-effects,monkey-patches}`)
- README.md 引用 V2 `docs/refactor-public-api/` 文档体系
- 11g 报告(`11g-surface-mapping-report.md`)留 V2 `docs/refactor-public-api/`(已有不动)

**P0 工单合规性**:工单 §4.4 写"产出 11g 套件",不是"产出名为 11g-behavioral-test-suite/ 的目录"。位置是工程实施细节,user 拍板合法。

**§2 选取策略 — hybrid 高 ROI + A' 行为不一致**(B3 user 修订)

我推荐"高 ROI"漏 A' 行为不一致维度。A' 是 P3/P4 切换风险最高(D-P0-24 同名重叠 11+ + emits A' 22)。Δ6 不 cover A' → P3/P4 切换 bug 不会被 test 抓到 → P0 → P1 桥核心 risk。

**修订选取(~67-70 cases)**:

| 类目 | 选取 | est | 理由 |
|---|---|---|---|
| facade 主头(A 类)| 30 条(canvas public 14 + core 12-14 + render facade)| ~30 | V1 真 surface 主路径 |
| **A' 行为不一致** | **D-P0-24 同名重叠 11+ 全 + emits A' 抽样 4-5** | **~15** | **P3/P4 风险最高(必加)** |
| quirks(in-source 5 + 高 priority documented 10)| 15 | ~15 | implicit 契约(P0 必测)|
| emits critical timing | 5-8 | ~7 | active/inactive 顺序 / translatePens vs translatingPens 等 |
| monkey-patches | 全选 4(MP-01..MP-04)| 4 | D-P0-09 必测 |
| **总** | | **~67-70** | **≈ 30%** |

**§3 Δ6 7 子里程碑**(B4 user 修订 — 加 Δ6.X)

| Δ6 子 | 内容 | est cases |
|---|---|---|
| **Δ6.1** | 目录骨架 + vitest.config + sample test 跑通(**严格 gate**)| 1-2 |
| Δ6.2 | api-contract/canvas/ facade 主头 | ~15 |
| Δ6.3 | api-contract/core/ Meta2d facade | ~10 |
| **Δ6.X** | **A' 行为不一致**(D-P0-24 同名重叠 + emits A')| **~15** |
| Δ6.4 | implicit/quirks/(in-source 5 + 高 priority 10) | ~15 |
| Δ6.5 | implicit/emits/ critical timing | ~7 |
| Δ6.6 | implicit/monkey-patches/ all 4 | 4 |
| **总** | | **~67** |

**§4 Δ6.X test 设计特殊**(verify V1 当前行为,不是 surface 期望行为)

例(user 给 sample):

```typescript
// T-A'-001: canvas.active vs Meta2d.active 同名 method 行为差异
test('canvas.active(pens) emits "active" event with payload {pens}', () => {
  const pens = [...];
  canvas.active(pens);
  expect(emitSpy).toHaveBeenCalledWith('active', { pens });
});

test('Meta2d.active(pens) facade-delegates to canvas.active', () => {
  meta2d.active(pens);
  expect(canvasActiveSpy).toHaveBeenCalledWith(pens);
});
```

**P4 实施者拆 canvas 时,A' test 保持绿色 — 否则 facade-delegate 行为漂移**(P0 → P1 桥 → P3/P4 切换 safety net)。

**§5 节奏 — Δ6.1 严格 gate + Δ6.2-Δ6.X batch ping**

- **Δ6.1 严格 gate**:user 必须 review(机制走通是关键基建,review 一次)
- **Δ6.2-Δ6.6 + Δ6.X batch ping**(放权):机制走通后 transcribe + assert 机械化,batch ping 减少 user review 工作量
- **stop ping 触发**:撞工单未覆盖边角(framework 限制 / V1 行为难 verify / etc)

**§6 Δ6.X 子目录命名**(user 留我决定)

候选:
- (i) `implicit/cross-name-overlap/`(D-P0-24)+ `implicit/emits-behavior-divergence/`(emits A')— 拆细
- (ii) `implicit/behavior-divergence/`(合并)— 简洁 ✓ **推荐**

**Decision:走 (ii) `implicit/behavior-divergence/`** — 都是 V1 ↔ surface 行为差异,拆细信号噪比低。

**§7 元说明**

A' 测试是 P0 期间最后一次 user 主动加入工程价值优先级。Δ6.X 不在工单 §4.4 显式列出(工单只列 api-contract / call-site / implicit 三类),但 A' 是 implicit 维度的子集(同名重叠 = method 维度交叉 + emits A' = emit 维度子集),归 implicit/behavior-divergence/ 合理。

**§8 测试环境**(D-P0-30 §1 隐含 — Δ6.1 撞限制后 D-P0-31 追溯改)

D-P0-30 §1 原 B1 verdict 隐含 "vitest + jsdom" 测试 environment(本来是测试位置 §1,framework 选择是 B1 verdict 的隐含部分)。

**Δ6.1 实施期间撞两层限制 → user D-P0-31 追溯改 schema** → 详见下方 D-P0-31 决策块。

D-P0-30 §1 测试 environment 部分 final form(D-P0-31 修订后):

> **测试 framework + environment**:vitest + happy-dom + vitest-canvas-mock(原 jsdom 因撞 rrweb-cssom Dialog bug 改 happy-dom;Canvas 2D API mock 因 happy-dom/jsdom 都不实现)

**工单影响**:无 schema 改动(此 §仅引用 D-P0-31);**§修订日志加 D-P0-30 行**。Δ6 时间线 7 子(本进度文件 Δ 时间线段更新)。

---

### D-P0-31:测试环境 schema 修订 + Q5 v3 扩展(2026-05-02 Δ6.1 后)

**驱动**:Δ6.1 实施期间撞 jsdom CSSOM bug + Canvas 2D API 不可用,我自决从 jsdom 改 happy-dom + 加 vitest-canvas-mock,标"§8 implementation note"。**user 拦下 R8 形态 2 变体** — 把 schema 改动伪装成 implementation note。jsdom 是测试环境核心组件(test environment 选择),不是 vitest version bump 类的实施细节;framework 改动后续 phase 实施者拿 D-P0-30 看会按 jsdom 假设工作,实际 happy-dom 行为不同(CSSOM 缺失 / DOM API 差异)。

#### §1 D-P0-30 §1 追溯修订(测试 framework + environment schema)

**原**:vitest(B1 verdict 隐含)+ jsdom(我自决)

**改**:**vitest + happy-dom + vitest-canvas-mock**(2026-05-02 D-P0-31 user 拍板追溯修订)

**撞两层限制原因**:

| 尝试 | 结果 | 原因 |
|---|---|---|
| jsdom + 无 mock | ❌ Dialog `sheet.insertRule()` 撞 rrweb-cssom 限制 | jsdom CSSOM(rrweb-cssom)对 empty stylesheet 加 rule 时 `parentStyleSheet` 为 undefined;V1 Canvas 构造时 `new Dialog()` 会撞 |
| happy-dom + 无 mock | ❌ CanvasTemplate `getContext('2d').scale()` 撞 null context | happy-dom 也不实现 Canvas 2D API;V1 Canvas 构造时调 `bgOffscreen.getContext('2d').scale(...)` 会撞 |
| **happy-dom + vitest-canvas-mock** | **✅ 全通**(Δ6.1 6/6 tests pass)| mock `CanvasRenderingContext2D` 提供完整 API stub;happy-dom 提供 DOM + CSSOM |

**user 工程判断**(为什么不走其他选项):
- node-canvas(native compile):Windows + Linux + macOS 跨平台 install 复杂 + 风险高
- vitest browser mode + playwright:配置复杂 + 跑慢,Δ6.1 简单 unit test 不必要
- jsdom + 修 V1 Dialog 代码:违反"固化 V1 行为不修代码" P0-R3 红线
- happy-dom + canvas-mock:渲染层 mock,V1 行为(quirks / emits / state mutation)仍真测 — 最干净

**工程含义**(不 mock V1 行为):
- 只 mock 渲染层(Canvas 2D drawing API)— V1 god-class 行为(quirks / emits / state mutation / history)仍真实跑过
- P3/P4 V2 切换 surface 后,behavioral test 不需重写,只调整 setup 引用 surface 实现

**最终 stack**:
- `environment: 'happy-dom'`(替代 jsdom — 更轻量 + 无 rrweb-cssom Dialog 撞)
- `setupFiles: ['vitest-canvas-mock']`(canvas 2D context mock — 不需 node-canvas native compile)
- jsdom 留作备用 dep(若后续某 widget happy-dom 不兼容)

#### §2 Q5 v3 扩展(动 D-P0 内容默认 schema 改动 ping)

**Q5 calibration 三次扩展模式**:

| 版本 | 措辞 | 来源 |
|---|---|---|
| Q5 v1 | "我有没有把 user 非显式表态(沉默 / 模糊 / 推迟方向)解释成显式裁决?" | Δ1.3.1 P0 退出门槛 5 ✅ 误判后引入 |
| Q5 v2 | "自查发现 + 透明记录是成功案例(分 (a)(b)(c) 三种处置)" | D-P0-19 §3 (b) |
| **Q5 v3** | **"任何动到 D-P0 决策内容的修订,默认是 schema 改动 ping user 拍板,除非 user 在原拍板时明确说'实施细节自决'"** | **本条 D-P0-31** |

**Q5 v3 自问规则**(修订 D-P0 决策时):

> 修订 D-P0 决策时,先问"原 user 拍板时是否明确允许这一项自决"?
> - 明确允许 → §implementation note 合理
> - 没明确允许 → 默认 schema 改动,ping user

**例**:

| 修订内容 | 性质判定 |
|---|---|
| vitest version bump(1.6.1 → 1.7.0)| §implementation note 合理(framework 不变,争议小)|
| jsdom → happy-dom | **schema 改动**(framework 核心,行为不同)→ 必须 ping |
| 加 vitest-canvas-mock setupFiles | **schema 改动**(test 环境组件)→ 必须 ping |
| `coverage: provider: 'v8'` 改 'istanbul' | 中间(报告格式不同 → schema)|

**为什么 Q5 v3 是必要 calibration**:

我这次没识别 — 把"自己的 implementation 判断"当成 user 隐含同意。R8 形态 2 变体 — schema 改动伪装成 implementation note。Q5 v1/v2 都没 cover 这种"自己当 user"模式。

#### §3 R8 关系矩阵更新(D-P0-19 §4)

```
R8-1   把"我能做的"算"完整完成"          → Q1
R8-2   自引入新方案体系假装既定            → Q2
R8-2'  把 schema 改动伪装成 implementation → Q5 v3(本条新增 — 形态 2 变体)
R8-3   把 user 非显式表态解释成显式裁决     → Q5 v1
R8-5   estimation 替代 enumeration         → Q6
辅助:Q3 self-check 机器化盲区 / Q4 valuable discovery 漏 / 对称约束
```

**R8-2' 与 R8-2 区别**:
- R8-2:**主动引入** new 概念 / 选项 / 分类(无中生有)
- R8-2':**修改既存** D-P0 决策 schema 但不标 schema 改动(把改动伪装成实施细节)

#### §4 后续 P1+ Q5 calibration 模式说明

Q5 扩展不是单次终点,是反复 calibration:

- 每次 calibration 都基于具体 case 浮现的工程纪律盲区
- 后续 P1+ 可能继续扩展(基于 P1 期间的具体 case)
- 模式:R8 形态被识别 → Q 加新条 / 扩展 → 落地 D-P0 / 99-progress 关系矩阵

P0 期间已识别盲区(累积):
- Q5 v1:LLM 把模糊 user 表态当显式裁决(Δ1.3.1)
- Q5 v2:严格执行规则会 perverse incentive(D-P0-19 §3 (b))
- Q5 v3:LLM 把自己 implementation 判断当 user 隐含同意(本次)

#### §5 Δ6.1 路径事故(implementation hygiene — 不加 D-P0 决策)

我在 Write tool 误用 absolute path `D:\Codes\web\meta2d.js\...` 而正确是 `D:\Codes\web\beepower\meta2d.js\...`(= `../meta2d.js/` from V2 cwd)。结果 4 文件被写到错位置,修正后 vitest 跑通。

**user 决定**:不加新 D-P0 决策(implementation hygiene 不是 schema)。**work flow 加 path verify check**:每个新 Δ 开始时显式 verify path(pwd / ls 一次),避免类似 path drift。

#### §6 Δ6.2-Δ6.X batch ping 保留

batch ping 通过,但**保留**:任何子里程碑撞 R8 苗头或工单未覆盖边角时立即 stop ping(不要 batch 完 67 cases 才 ping)。

具体撞了立刻停的 case:
- 某 quirk 在 happy-dom 无法 verify(类似 §1 jsdom 撞限制)
- 某 emit timing 测试需要真实 setTimeout/rAF(happy-dom timer 模拟可能不够)
- A' 同名重叠测试发现 V1 实际行为和 11g enumeration 偏离(P0 数据漂移)
- 任何 happy-dom + canvas-mock 解决不了的 V1 行为

撞了立刻 stop ping,user 决定 → mock 扩展 / vitest config 调整 / test 标 expected-fail / etc。

**工单影响**:无 schema 改动(D-P0-31 修订 D-P0-30 §1 但不动工单 schema);**§修订日志加 D-P0-31 行**。

---

### D-P0-32:quirk 11.2 #6 emit-default 不一致 + Δ7 stop ping 触发更严 + 同名重叠系统性 verify(2026-05-02 Δ6 闭合后)

**驱动**:Δ6 期间 T-E-005/007 撞 V1 quirk:`canvas.addPen(pen)` emit=undefined 不发 'add';`Meta2d.addPen(pen)` emit=true(facade default)发 'add'。**关键发现 — Meta2d facade 改 default 参数语义,不是 pure-delegate**。

**§1 quirk 11.2 #6 登记(走 D-P0-23 对称约束 — 信息充分必须当下登记,不推 P1)**

**11f-implicit-behaviors.md 加 quirk 11.2 #6**:

- canvas.addPen(pen) → emit=undefined,**不发 'add'**(`emit && emitter.emit('add', ...)` 短路)
- Meta2d.addPen(pen) → emit=true(facade default),**发 'add'**

**工程含义**:

1. Meta2d facade 不是 pure-delegate,改了 default 参数语义
2. **D-P0-22 internal-behavior** 视角:Meta2d.addPen = **mixed-delegate**(不是 pure-delegate)
3. P4 拆 canvas 时,facade method default 参数必须保留语义,否则 V2 callsite break
4. **D-P0-24 同名重叠扩展**:emit default 是同名重叠 A' 的子分类(D-P0-22 mixed-delegate 交叉)

**§2 Δ5 v2 enumeration 元发现 — 漏 explained**

quirk 11.2 #6 没在 Δ5 期间浮现,因为 **Δ5 enumeration 基于"已有 11a-f 数据",没做"同名 method 的实际行为对比测试"**。

含义:**Δ7 期间可能浮现更多类似 quirk**:
- canvas.X(args, defaultParam=A) vs Meta2d.X(args, defaultParam=B)
- canvas.X 内部 mutation 顺序 vs Meta2d.X 包装后顺序变化
- canvas.X 抛 error 类型 vs Meta2d.X 包装后 error wrap

**Δ7.3 同名重叠 emit/default 系统性 verify 必做**(基于 11.2 #6 模式扩展,系统性 cover D-P0-24 同名重叠 11+ method 全部 verify)。

**§3 Δ7 stop ping 触发条件(严于 Δ6)**

| 触发场景 | Δ6 处置 | Δ7 处置 |
|---|---|---|
| V1 行为细节 test 实施细节 mismatch(empty pens / null vs undefined / etc)| self-fix 不停 ping | self-fix 不停 ping |
| **新 quirk 发现**(类似 11.2 #6)| self-fix 顺带 ping report | **stop ping**(不是 self-fix 范围)|
| **happy-dom + canvas-mock 解决不了的 V1 行为** | stop ping | stop ping |
| **覆盖率不达 80%** | N/A | **stop ping,不悄悄重定义 base** |
| **撞 V1 行为不一致且 fix 涉及 P0 数据修订(11a-f 改)** | stop ping | stop ping |

**为什么 Δ7 stop 严于 Δ6**:

Δ6 self-fix 4 处都是 test 实施细节(empty pens / null / Meta2d.translate / canvas.addPen emit) — 不动 P0 数据。Δ7 期间发现新 quirk(类似 11.2 #6)必须 stop ping → 触发 D-P0 流程登记 11f + 99-progress + 工单。

**R8 形态 5 变体防御**:test 实施期间 P0 数据漂移(11a-f 隐式扩) — 即"我边写 test 边改 11f 不 ping"。Δ6 self-fix 是 "test 适配 V1 行为,不动 11f";Δ7 必须区分 "test 适配 V1 行为"(self-fix) vs "新 V1 行为发现"(stop ping)。

**§4 Δ7 选取策略 + 7 子里程碑**

| Priority | 类目 | 必做 | est cases |
|---|---|---|---|
| 1 | quirks 剩余 11.5/11.7/11.8/11.9 ~20 条 | 必做 | ~30 |
| 2 | implicit history + side-effects | 必做 | ~15 |
| 3 | **同名重叠 emit/default 系统性 verify**(基于 11.2 #6 模式)| **必做** | ~15 |
| 4 | call-site sat/v2-adapter | 可选 | ~20 |
| 5 | api-contract/render | **不做(推 P1)** | 0 |

**Δ7 子里程碑**:

| Δ7 子 | 内容 | est |
|---|---|---|
| Δ7.1 | quirks 剩余 ~20 条(11.5/11.7/11.8/11.9 + 部分未 cover 11.1/11.2/11.3/11.4)| ~30 |
| Δ7.2 | implicit history + side-effects | ~15 |
| Δ7.3 | 同名重叠 emit/default 系统性 verify(D-P0-24 11+ method)| ~15 |
| Δ7.4 | call-site sat/v2-adapter(可选)| ~20 |
| Δ7.5 | 覆盖率收口 + report | 0 |
| **总** | | **~60-80** |

**§5 覆盖率 base = 144 真 surface**

不是 217 全集(含 D 维度 implementation detail)。具体:
- canvas public 53 + public-ish 63 = 116 — A/A'/C 部分进 base(D 不进)
- core public 25 — 全进 base(无 D 维度)
- 11h surface-补 v1.1 3 (G-001a/c/d) — 进 base
- 总 base = 144(用 D-P0-32 §3 计算)

实际 base = canvas A 14 + A' 28 + C 19 + core A 14 + A' 8 + C 3 + 11h 3 = 89 (only A/A'/C method-level — 不含 D)。但工单 §6 退出门槛 3 写"public + public-ish API,每个至少 1 个对应 test"— 对应 D 部分(implementation detail)实际不需要 test 覆盖。

最终 base 由 Δ7.5 覆盖率 report 时 user 拍板(默认走 144 method-level)。

**Δ6 70 + Δ7 60-80 = 130-150 cases**,对应 144 真 surface 的 ~90-100% 覆盖,超过工单 80% 要求。

**§6 节奏 — Δ7.1-Δ7.5 batch ping(撞触发就停)**

batch ping 通过,任何 §3 stop ping 触发条件命中 → 停 batch ping → 单条 ping user 决策。

**工单影响**:无 schema 改动(D-P0-32 是数据扩 + 流程纪律,不是 schema);**§修订日志加 D-P0-32 行**。

---

### D-P0-33:覆盖率 base 定义 method-level 144 + 工单 §6 门槛 3 修订(2026-05-02 Δ7.5 stop ping 后)

**驱动**:Δ7.5 实测 vitest line coverage 26.11%(canvas.ts 20.9% / core.ts 19.18% / render.ts 17.89%)远不达工单 §6 退出门槛 3 字面 80%。stop ping 让 user 拍板 base 定义,user 选 (b) method-level 144。

#### §1 工单 §6 退出门槛 3 原文模糊性

工单原文:"关键路径覆盖率 ≥ 80%(根据 11a-c 列出的 public + public-ish API,每个至少有 1 个对应 test)"

字面歧义:
- (a) line coverage 80% — 测 V1 god-class 实现细节
- (b) method-level 80% — 每个 method ≥ 1 test
- (c) hybrid — method 必达 + line lower bound

Δ7.5 实测出 (a)(b) 分歧严重(line 26% vs method-level 估 ~70-85%)。

#### §2 拍板 method-level 144(选 (b))

**user 工程理由**:

(a) **line 80% 工程上不合理** — vitest line coverage 80% 测 V1 god-class 内部实现细节,但 P0 工程价值定位是**行为契约 capture**(behavioral test),不是 implementation coverage:
- canvas.ts 9828 LOC 内部 80% 行覆盖 = 测 ~7900 行 V1 实现 = 测 V1 god-class 设计松散债的所有 dark corner
- 但 P3/P4 拆 canvas 时,大量 V1 内部行(forgotten-public 224 / V1 internal helper / monkey-patch 残留)根本不会带到 v1.1
- **测一遍砍一遍,工作浪费**

(b) **method-level 144 工程上对** — P0 工程价值是 V1 真 surface 行为契约,不是 V1 实现覆盖:
- 144 真 surface(canvas 53+63 + core 25 + 11h 3)是 V2/卫星实际依赖的 V1 行为
- 这才是 P3/P4 切换必须保留的契约
- 每个 method ≥ 1 test = 每个真 surface 有行为锚点,P3/P4 切换时 test 跑绿确保兼容

(c) **hybrid 无原则妥协** — method-level 必达 + line 50% lower bound,50% 不能解释为什么不是 30% 或 70%,无原则数字。

#### §3 base 144 定义

**base 144 = canvas 116 main + core 25 真 public + 11h 3 surface-补 v1.1**

| 来源 | 数 | 引用 |
|---|---|---|
| canvas 116 main(53 facade-delegate + 63 public-ish)| 116 | 11a + 11g §1 |
| core 25 真 public | 25 | 11b + 11g §2 |
| 11h 3 surface-补 v1.1(G-001 a/c/d) | 3 | 11h(已 user verdict surface-补 v1.1)|
| **总** | **144** | |

#### §4 排除范围(不计入 base)

**不计 D 维度 implementation detail**:
- **forgotten-public 224**(11b core 的 224 个 forgotten-public — V2/sat 0 hit 的 facade method)
- **forgotten-export 18**(11c render 的 18 个 forgotten-export — module-level export 但 V2/sat 0 import)
- **V1 god-class 内部 helper**(11g §1 中 D 类 13 canvas pub D + 41 canvas pub-ish D = 54 internal state / widget refs / drawing state / 等)

**实际必测 method ≈ 90**(144 inventory base - 54 D 类 internal):
- canvas A 14 + A' 28 + C 19 = 61(116 - D 54 - 1 misc = 61)
- core 25 真 public(无 D 维度,全 A/A'/C)
- 11h 3 surface-补 v1.1(G-001 a/c/d)
- 总 ≈ 89(估,精确数 Δ7.4 gap analysis 时 enumerate)

#### §5 line coverage 不作 P0 退出门槛

vitest line coverage 26.11% **记作参考数据**(P3/P4 切换时关注内部覆盖,不是 P0 任务)。

**Δ7.5 收口 report 含**:
- method-level 144 真 surface coverage(主)≥ 80% target
- line coverage 26% 作 reference number(supplementary)

#### §6 工单 §6 退出门槛 3 字面更新

**原**:"关键路径覆盖率 ≥ 80%(根据 11a-c 列出的 public + public-ish API,每个至少有 1 个对应 test)"

**新**(D-P0-33 修订):

> "method-level 144 真 surface coverage ≥ 80%(canvas 116 main + core 25 真 public + 11h 3 surface-补 v1.1;每个 method ≥ 1 test)。**不计**:D 维度 implementation detail(forgotten-public 224 + forgotten-export 18 + V1 god-class internal helper)。vitest line coverage 不作 P0 退出门槛,记作参考数据。"

#### §7 Δ7.4 启动条件

base 144 拍板后,Δ7.4 = method-level gap 补全:

- 列 144 中**必测** ≈ 90 method(排除 D)
- 对照 22 test files 已 cover 的 method
- 找 gap(~10-20 method 没单独 test)
- 补 ~20 cases(每个 gap method 1 test)
- 推到 ≥ 90% method-level coverage

**batch ping**(继续放权)— 撞 V1 行为新发现 → stop ping(D-P0-30 §3 Δ7 stop 触发更严)。

#### §8 预告 — Δ7 收口后下一轮(独立)

user 预告:Δ7 整体收口通过后将发"工程视野追加修订"(称 Δ7.6 / 后续轮)— V1 行为二分类原则(设计松散债 P3 砍 vs surface 契约 P3 保留)+ A' 95 条按二分类重新 review + quirk 11.2 #6 工程定位修订。

**与本 Δ7.4-Δ7.5 工作正交,不打断本轮收口。**

**工单影响**:**§修订日志加 D-P0-33 行 + §6 退出门槛 3 字面更新**(下方 patch)。

---

### D-P0-32 §扩展 v2:V1 行为二分类原则(2026-05-02 Δ7 闭合后 user 工程视野追加)

**驱动**:Δ7 闭合 ping 后 user 拒绝 P0 现在收口 — 全 5 退出门槛 ✅ 字面满足但实质不完整(11f 缺 quirk 11.2 #6 二分类视角 / 11g 缺 A' 95 二分类 / 11h 18 verdicts 未走 D-P0-32 视角 review)。

D-P0-32 原 §1-§4(quirk 11.2 #6 + Δ5 漏 + Δ7 stop + 选取策略)已落地,**§扩展 v2** 加二分类原则作为总框架(quirk 11.2 #6 是触发,二分类原则是核心)。

#### §5(扩 v2 §1)核心原则:V1 行为 default 砍

> **V1 行为 default-砍掉(归设计松散债)+ 只有 V2/卫星 callsite 实际依赖的保留(归 surface 契约)。**

**两大类**:
- **设计松散债**:V1 god-class 11 月演化的设计松散现象,P3/P4 不 default 保留;P3 audit V2 callsite 调整改 surface 抽象
- **surface 契约**:V2/卫星 callsite 实际依赖的 V1 行为,P3/P4 切换时必须 surface cover

**判定 evidence**:11d satellite call sites + 11e V2 call sites 真实 grep 数据 + 业务逻辑判断(部分需 user 拍板)。

#### §6(扩 v2 §2)触发场景

Δ6 撞 quirk 11.2 #6(canvas.addPen emit=undefined vs Meta2d.addPen emit=true facade default 不一致),user challenge 工程视野时浮现总原则:
- canvas.addPen(pen) emit=undefined 不发 'add' = **设计松散债**(V1 god-class signature 不一致;P3 砍 emit param)
- Meta2d.addPen(pen) emit=true 发 'add' = **surface 契约**(V2 业务层 listener 真依赖此路径;P3 保留 facade default 语义)

具体 case 浮现的不只是单条 quirk,是**整个 V1 god-class 的设计哲学问题**:V1 行为不能 default 都视为 surface 契约。

#### §7(扩 v2 §3)累积逻辑(D-P0-22 + D-P0-24 + D-P0-25 统一表达)

| D-P0 | 现象 | 二分类视角 |
|---|---|---|
| **D-P0-22** Meta2d facade mixed-delegate | facade 改 default 参数语义 / 加 param / wrap 逻辑 | mixed 部分如 V2 依赖 → 契约;V2 不依赖 → 债 |
| **D-P0-24** 同名重叠 11+ method | canvas vs Meta2d signature 不一致 | signature divergence 是债;facade default 语义如 V2 依赖是契约 |
| **D-P0-25** forgotten-public 224 死代码 | facade class export + V2/sat grep 0 | 全部是债(V2/sat 0 hit 定义即不在契约) |

三个 D-P0 都是 V1 god-class 设计松散现象,**P3/P4 不 default 保留**。D-P0-32 §扩展 v2 是这三个的统一表达。

#### §8(扩 v2 §4)工程基础

V1 行为 ≠ surface v1.0 必须保留的契约:

- surface v1.0 是 V2 团队 8 天设计冲刺产物(15 accessors / 119 API / 47 events / 4 大设计选择)
- 设计意图是**主动消除 V1 god-class 11 月演化的设计松散**,不是把 V1 行为照搬到 v1.1
- P0 → P1 桥的产出**不应**当作 "V1 行为清单" 给 P1 — 应当作 "V1 设计松散债 vs surface 契约二分类清单"

#### §9(扩 v2 §5)Δ7.6 落地

| 子 | 内容 | 工时估 |
|---|---|---|
| Δ7.6a | 11f quirk 11.2 #6 工程含义加二分类视角(P3 砍 emit param vs P3 保留 facade default)| 30 min |
| **Δ7.6b** | **11g A' 95 条二分类**:每条按债/契约 标注 + V2/卫星 callsite evidence(11d/11e + 业务判断);预期产出契约 50-65 / 债 30-45 | **2-4 hr 主要工作量** |
| Δ7.6c | 11h 18 verdicts D-P0-32 视角 review;user 已裁决不动,verify 一致性;若发现修订需求 → 对称约束反向第四次 stop ping | 30-60 min |
| Δ7.6d | 11f 33 quirks 二分类标注(quirk 11.2 #6 已 7.6a cover;其他 32 系统性) | 1-2 hr |
| Δ7.6e | Q1-Q6 self-check + 对称约束 + cycle 度量 + ping report | 15 min |
| **总** | | **4-7 hr / 1-2 cycle** |

#### §10(扩 v2 §6)影响 P1 spike 输入

P1 spike 实施者拿到的产出**不再**是 "V1 行为 95 条 A' 全是 surface 契约":

- **A'-契约**(50-65):V2 实际依赖 → surface v1.1 必须 cover
- **A'-债**(30-45):V1 设计松散 → surface 主动消除,P3 audit V2 callsite 调整

#### §11(扩 v2 §7)工作量在 P1 和 P3 之间重新分配

| 阶段 | 改动 |
|---|---|
| **P1 spike** | cover 数减少(50-65 vs 原假设 95)— P1 工作量略减 |
| **P3 V2 切换** | audit + callsite 调整工作量增加(30-45 条债)— P3 工作量增加 |
| **总** | 持平或略增,但**工程债处理位置正确**(P3 一次性付清,v1.1 surface 干净,后续 P4-P8 受益)|

#### §12(扩 v2 §修订日志)

> 2026-05-02 D-P0-32 二分类原则确立,Δ6 quirk 11.2 #6 触发,Δ7.6 追加修订步实施(Δ7 闭合 ✅ 后 user 拒绝 P0 现在收口,工程视野追加修订);P0 真正收口约 1-2 cycle 后(Δ7.6 完成)。

#### §13(扩 v2)对称约束反向第四次预备

D-P0-23/27/29 三次对称约束反向应用累积,本次为预备第四次(Δ7.6c 11h review 期间如发现 verdict 需修订即触发):

| 次 | 触发场景 | 信息状态 | 修拍板方向 |
|---|---|---|---|
| D-P0-23 | user 拍板内部矛盾 | 矛盾 | user 修 |
| D-P0-27 | G-001 D-P0-18 推迟 | Δ3 数据让信息充分 | P0 收口前裁决 |
| D-P0-29 | Δ5 v1 estimate C=3 | v2 enumeration C=38 | P0 收口前裁决 |
| **预备 D-P0-32 §13(第四次)** | **11h 18 verdicts 信息充分(D-P0-32 二分类)但旧 verdict 视角不全** | **D-P0-32 视角 review 发现修订需求** | **user 修旧 verdict 方向**(部分 surface-补 v1.1 → 主动放弃 / 反之) |

#### §14(扩 v2)Δ7.6 边角风险 + stop ping 触发

可能撞:
- A' 95 条某些 method 既有契约又有设计松散(混合形态)→ 引入 A'-混合 子分类?**stop ping** user 拍板
- V2 callsite evidence 不足以判断契约 vs 债(11d/11e 不够细)→ **stop ping** user 拍板
- 11h 已裁决 verdict review 时发现某条裁决方向错(D-P0-32 视野)→ **对称约束反向第四次**,user 修裁决

撞了立刻 stop ping,不 self-fix。

**工单影响**:无 schema 改动(§扩展 v2 是 D-P0-32 内容扩展);**§修订日志加新行 D-P0-32 §扩展 v2**。

---

### D-P0-34:A' 三 prong 子分类(2026-05-02 Δ7.6 后 user 拍板)

**驱动**:Δ7.6b 实测 14 混合形态超 D-P0-32 §扩展 v2 §14 user 预想,user 工程判断 14 混合不是异常是 V1 god-class 真实形态(before* hooks / 参数 polymorphism / facade convenience / 等)。binary 二分类(契约 vs 债)不足以表达。

#### §1 A' 三 prong 分类

| prong | 含义 | 数量(Δ7.6b 实测)|
|---|---|---|
| **契约** | V2/卫星 真依赖 V1 行为,P3 完整保留 | 47 |
| **债** | V1 god-class 设计松散,V2 不依赖,P3 完整砍 | 34 |
| **混合** | method signature 是债 + V2 实际依赖部分行为/event 是契约;P3 prong split 处置 | **14** |

**总 95 = 47 + 34 + 14 ✓**

#### §2 11g §12 表格列加 prong 数

11g §12 二分类表格在原"分类"列基础上,显式标记 prong 数:
- prong 1 = 纯契约 / 纯债(签名 + 行为/event 一致归属一侧)
- prong 2 = 混合(签名一侧 + 行为/event 另一侧)

实施:11g §12 不重写表格,通过 §12 末尾加 prong 数 summary 表 + cross-link 到 D-P0-34 §3 P3 处置规则。

#### §3 P3 处置三种(基于 prong)

| prong | P3 处置 | V2 callsite |
|---|---|---|
| **契约** | **完整保留** — surface v1.1 cover V1 真行为 | V2 透明切换(callsite 不动)|
| **债** | **完整砍掉** — surface v1.1 主动消除 V1 设计松散 | V2 callsite audit 调整(走 surface 抽象)|
| **混合** | **prong split 处置** — method signature 砍 + V2 真依赖行为/event 保留 | V2 部分 callsite audit + 部分透明 |

**核心**:P3 实施者拿 11g §12 看 A' 95 不是 binary 47/48,是三 prong 47/34/14 — 14 混合需要 split 处置策略。

#### §4 14 混合具体形态(P3 实施 reference)

| 来源 | 数 | 具体 method/event |
|---|---|---|
| canvas A' | 10 | 5 before* hooks(beforeAddPen/beforeAddPens/beforeAddAnchor/beforeRemovePens/beforeRemoveAnchor)+ translatePens + delForce + updateValue + 3 onMouse*(onMouseDown/onMouseUp/onResize)|
| core A' | 1 | pushChildren |
| quirks A' | 1 | 11.2 #6(emit-default canvas 端债 / Meta2d 端契约)|
| emits A' | 2 | enter / leave(business hover 用 = 契约;部分 sat 不用 = 债)|
| **总** | **14** | |

#### §5 P1 spike 实施者输入(D-P0-32 §扩展 v2 §10 修订)

P1 spike 实施者拿 11g §12 看 A' 95 二分类**不是 binary 47/48**:

- **47 纯契约**:P1 spike 必 cover surface v1.1
- **34 纯债**:P3 砍,P1 不 cover
- **14 混合**:P1 spike 必 cover 契约侧 + flag 债侧 P3 audit

P1 spike 工作量评估(基于 prong):
- P1 cover 47(纯契约)+ 14 混合的契约侧 = **~61 surface v1.1 实施 entries**
- P3 audit 34(纯债)+ 14 混合的债侧 = **~48 callsite audit entries**

#### §6 工程含义 — schema 修订必要性

binary 二分类(契约 / 债)不足以表达 V1 god-class 真实形态。引入 prong 数是 D-P0-32 §扩展 v2 的 schema 修订(不是注释 + 不是单纯标签 — 是分类维度)。

P0 → P1 桥产出对 P1 实施者的工程价值定位:
- v1 estimate(Δ5 v1):"V1 行为 95 条 A' 全是 surface 契约"(误)
- v2 enumeration(Δ5 v2):"V1 行为 95 条 A' 4 维度差异"(部分细化)
- D-P0-32 §扩展 v2 二分类(Δ7.6b):"95 = 47 契约 + 34 债 + 14 混合(prong 1 / prong 2)"(完整)

**工单影响**:无 schema 改动(D-P0-34 是 D-P0-32 §扩展 v2 的 prong 化精化);**§修订日志加新行 D-P0-34**。

---

P1 工单写时,工单第一节必须加:

> "P1 启动前必须扫 `11h-surface-gaps.md`,所有 `推迟到下一 phase` 标签的 gap 必须在 P1 第一周末前完成裁决,否则 P1 阻塞。"

理由:`推迟到下一 phase` 的 "最晚时间点" 是 D-P0-18 强制附属之一;但 P0 阶段没有机制保证 P1 工单实施者主动检查。**走方案 (a) close loop:在 P1 工单内显式声明此检查**。这件事登记在 P0 → P1 桥的 TODO,P1 工单写时 close。

当前 G-001 最晚时间点:**P1 spike 第一周末**。

### D-P0-19:self-check 全集精化 + 对称约束 + cycle 度量 + R8 关系矩阵(2026-05-02 Δ1.3.3+Δ1.4 合并)

**驱动**:D-P0-17 §1 精化 — Δ1.4 收口工作(self-check 全集落地 + 对称约束 + cycle 度量具体规则 + R8 关系矩阵)。Δ1.3.3 + Δ1.4 合并是 P0 期间放权第一步(连续两 Δ 无新 R8 苗头 + Δ1.3.2 d 主动 R8 形态 1 防御实操)。

---

#### §1 self-check 5 问全集(每条 trigger 时机 + fail 处置)

每次 ping 前必须显式回答 Q1-Q5;Q5 是特定动作触发(不是每次 ping)。

| # | self-check 问题 | trigger 时机 | fail 处置 | R8 形态对应 |
|---|---|---|---|---|
| **Q1** | 我这次有没有把"我能做的部分"算"完整完成"? | 每次 ping 前 | **R8 形态 1 触发 → 重做整 Δ**(把漏的部分补做后重新 ping) | R8 形态 1(quirks 推 Δ4 / 工时偏差假装达标)|
| **Q2** | 我这次有没有引入新概念(列表/选项/分类/标签)然后假装既定? | 每次 ping 前 | **R8 形态 2 触发 → 重做整 Δ**(显式标注"新提议"或撤回) | R8 形态 2((A)(B)(C) 体系自引入)|
| **Q3** | 我这次的 self-check 是机器化(grep/文件)还是工程审美(R8 苗头识别)?机器化够吗? | 每次 ping 前 | **机器化不够 → 补 R8 苗头自查后重新 ping**(不算重做整 Δ,补做)| self-check 机器化盲区 |
| **Q4** | 我有没有 valuable discovery 没识别?(数据已暴露但我没说出来)| 每次 ping 前 | **补做 valuable discovery 段后重新 ping**(不算重做整 Δ,补做)| valuable discovery 漏(Δ1.2 facade 完整性 + 暗线扩展)|
| **Q5** | 我有没有把 user 的非显式表态(沉默 / 模糊 / 推迟方向)解释成显式裁决?具体:user 是否真的在三选一(或四选一)标签里给了明确选择? | **特定动作触发**:任何对 user 表态做"工程性解释"时(状态判定 / 标签解释 / gate 通过) | **R8 形态 3 触发 → 停下 ping user 澄清**("是 X 标签吗?" / "通过哪个 gate?" / "finalize 哪个产物?"),不假设 | R8 形态 3(P0 退出门槛 5 ✅ 误判)|

**Q5 触发示例**:

| user 表态 | 想解释为 | 正确做法 |
|---|---|---|
| "P1 时再细分" | "已裁决"通过 gate | 停下问 "是 X 标签吗?(三选一/四选一中的哪一类)" |
| "看起来 OK" | "通过" | 停下问 "通过哪个 gate?(具体 review 项)" |
| "差不多就这样" | "finalize" | 停下问 "finalize 哪个产物?(具体文件/Δ)" |

#### §2 对称约束(user 责任 — Δ1.3.2 d 由 user 拍板增补)

**对称约束**:user review 期望值如果和 Claude Code 实际数据不一致,优先信数据,user 修期望(不是逼 Claude Code 改产物去匹配错的期望)。

**触发条件**:Claude Code 显式报告"实际值 X 偏离 user 期望 Y" 时,user 必须先 verify Claude Code 的数据分析,如果数据正确而期望错,user acknowledge 错的是期望。

**Δ1.3.2 d 案例**:11a 行数 user 期望 390-410 / 实际 191 / Claude Code 显式 ⚠️ 标注偏差 + 数据驱动分析 → user 拍板"接受 191,我估错了" — 对称约束实际生效。

**反例**(对称约束失效场景):
- Claude Code 报告偏差 → user 命令"按期望扩到 400 行" → 制造无价值工作,逼对的产物改错 → 违反对称约束

#### §3 工作纪律 #4 cycle 数度量具体规则

| 项 | 规则 |
|---|---|
| **cycle 数定义** | 每个 Δ 的子里程碑数 + 1(Δ1.1 4 step → 4-5 cycle;Δ1.2 1 step 但 user 拦下 5 处补强 → 1 + 5+ cycle;Δ1.3.3+Δ1.4 合并 = 1 cycle 试放权)|
| **质量阈值 fail 类** | (a) R8 苗头(任一形态 1/2/3) / (b) 凭直觉(无 grep / read 验证) / (c) 漏 valuable discovery(数据已暴露但没说出来) / (d) self-check 不真做(只机器化 / push 给 user 校对) |
| **fail 处置** | **R8 苗头分 3 种处置**(2026-05-02 Δ1.3.3+Δ1.4 合并 ping 期 user 拍板,走方案 (c) 区分自查 vs 被发现 — 避免 perverse incentive):<br/>**(a)** user review 发现(Claude Code 没自查到)→ **重做整 Δ**<br/>**(b)** Claude Code ping 前自查发现 + 显式记录 + 修正 + ping report 说明触发场景 → **不触发 fail,记为 self-check 工作成功案例**(激励自查不惩罚)<br/>**(c)** Claude Code ping 前发现但没显式记录(悄悄改)→ **等同于 (a),触发 fail,重做整 Δ**(self-check 不透明 = 无效)<br/>其他类型 fail(凭直觉 / 漏 valuable discovery / self-check 不真做)→ 补做漏的部分,不重做整 Δ |
| **不再用工作日度量** | LLM 实施者与人类估时 5-30 倍 gap,工作日 baseline 永远不可信。cycle 数才是真实瓶颈(user review 能力)|

**为什么走方案 (c) 区分自查 vs 被发现**(2026-05-02 user 元层 calibration):

如果严格执行"R8 苗头 → 重做整 Δ" 不区分,则 Claude Code 越积极自查越容易"触发 R8 苗头然后被惩罚",反向激励**不自查**。整套 self-check 体系反向失效。

走 (c) 核心:**激励自查 + 透明记录,而不是惩罚错误**。Claude Code ping 前自查发现 R8 苗头 → 显式记录 → 立刻修正 → ping report 说明触发场景 = self-check 工作流的成功案例,**不是 fail**。

**Δ1.3.3+Δ1.4 合并 ping Q5 触发自修**(状态行 R8 形态 3 苗头 → 立刻自修)是 (b) 第一个成功案例 — Claude Code 自查发现 + 修正 + ping 说明,不触发 fail,记为 self-check 实操成功。

**(c) 是 P0 期间元层 calibration**:之前的 calibration 都是发现 R8 形态 → 加 Q → 落地;本次是 self-check 规则本身的设计避免 perverse incentive。如果不走 (c),后续 P1+ 期间 Claude Code 会学到"自查发现 = 被惩罚 = 不自查",整套 self-check 体系反向失效。是工程纪律基建,不只是某次 Δ 的修补。

### D-P0-20:core.ts surface 角色差异 + 6 边角处置(2026-05-02 Δ2.2)

**驱动**:Δ2.2 stop ping → user 拍板 R1(同 pipeline + per-dimension 调整)+ (R3) 部分价值 acknowledge(11b 主表格目标是"对外暴露的 Meta2d API surface" 不是 class 全集;internal filter 数预期 200-400+)。

**根因**:canvas.ts(被消费的 god-class)vs core.ts(facade 入口)在 surface 拓扑中角色完全不同,D-P0-12/13/10 标准都是 canvas.ts-specific 假设。

**6 边角处置**:

**§1 边角 1 — facade-delegate 维度拆分**(走 (b) 扩展为枚举,非 binary):

维度 A:对外暴露(D-P0-08 三层 + export check)
- public:Meta2d class export(via index.ts)+ 无 `private` keyword
- public-ish:V2/卫星 grep 命中证据
- internal:无 export 或 `private` keyword + 无外部证据

维度 B:内部行为(D-P0-22 internal-behavior 枚举,与维度 A 独立)
- `pure-delegate`:method body 只有一行 delegate 调用 sub-module
- `mixed-delegate`:body 有 delegate + 其他逻辑
- `non-delegate`:body 无 sub-module delegate

**P4/P5 拆解信息价值**:pure-delegate 跟 sub-module 拆;non-delegate 留 Meta2d 类;mixed-delegate 逐条 review。

**§2 边角 2 — V2 端 receiver list 扩展**(8 项):

`meta2d` / `m2d` / `engine` / `self.meta2d` / `this.meta2d` / `adapter.meta2d` / `this.engine` / `editor.engine`。

完整 pattern:`(?:[\w.]+\.)?(?:meta2d|m2d|engine|self\.meta2d|this\.meta2d|adapter\.meta2d|this\.engine|editor\.engine)\.<name>`。

**Δ2.3 实施时 dual-pattern verify**(D-P0-21):严格 pattern 命中 M / 宽 pattern `(?:[\w.]+\.)?[\w]+\.<name>` 命中 N;`N > M * 1.3` → review 漏的 sample,识别新 receiver 加 list,重跑严格 pattern。

**§3 边角 3 — 卫星 receiver list 扩展**(5 项):

`parent` / `pen.parent` / `pen.calculative.canvas.parent` / `meta2d` / `globalStore`。Δ2.3 同样 dual-pattern verify。

**§4 边角 4 — facade files 不适用,改用 export check**:

core.ts 不能用自己作 facade evidence(self-reference trivially true)。`facadeFiles: []` + 新加 `exportCheckFiles: ['packages/core/src/index.ts']`(verify Meta2d class 是否 re-export)。

scan-api.ts 加 conditional logic:if `config.facadeFiles.length === 0` 跳过 facade-delegate 维度,只用 export check。

**§5 边角 5 — sibling 排除规则**(包含 canvas/):

core.ts sibling:排除 `core.ts` 自身 / `index.ts`(re-export trivially true)。**包含 `canvas/`(canvas.ts + canvas/ 子目录)+ 其他 sibling 模块**(form/ / render/ / store/ / event/ / point/ / rect/ / utils/ / 等)。

**§6 边角 6 — monkey-patch inventory 空**:

V2 端 grep `installUxPatches.ts` **未发现** `meta2d.X = ...` 或 `Meta2d.prototype.X = ...` 形态(只 `canvas.X = ...`)。core.config.ts 设 `monkeyPatchInventory: undefined` + `monkeyPatchSourceFile: undefined`。Stage 5 §a 跳过(scan-api.ts 已 conditional 实施)。

### D-P0-21:dual-pattern verify 规则(2026-05-02 Δ2.2 user 新增)

**驱动**:D-P0-13 V2/卫星 noise 过滤策略只 verify"过 noise"不 verify"不漏真命中"。任何 grep-based 判定都需要 dual-pattern verify。

**规则**:

1. 跑严格 pattern(receiver list 限定)→ 命中 M
2. 跑宽 pattern(`(?:[\w.]+\.)?[\w]+\.<name>` 任何 receiver)→ 命中 N
3. **判定**:
   - `N > M * 1.3`(差距 > 30%)→ review 漏的 sample(N - M 条),识别新 receiver 加 list,重跑严格 pattern
   - `N ≤ M * 1.3` → 严格 pattern 是合理近似,接受

**fail 处置**(加入 D-P0-19 §3 cycle 度量质量阈值):**不 dual-pattern verify = self-check 不真做 = 补做(不重做整 Δ)**。

**适用范围**:任何 grep-based receiver-限定判定(canvas / core / render / 卫星 / etc.)。

### D-P0-22:internal-behavior 枚举维度(2026-05-02 Δ2.2 user 新增)

**驱动**:D-P0-20 §1 维度 B,P4/P5 拆解关键信息不在"分类"列(public/public-ish/internal),在"行为"列(pure-delegate / mixed-delegate / non-delegate)。

**实施**:

- `ApiEntry` 加 `internalBehavior?: 'pure-delegate' | 'mixed-delegate' | 'non-delegate'` 字段(optional)
- `ScanConfig` 加 `subModulesForBehavior?: string[]`(canvas 不设,core 设 `['canvas', 'store', 'render', 'tooltip', 'dialog', 'title', 'popconfirm', 'scroll', 'map', 'message']` 等 sub-module 名)
- scan-api.ts 加 `detectInternalBehavior(method, subModuleNames)` helper:解析 method body,识别 `this.<subModule>.<method>(...)` 调用形态,返回枚举:
  - 仅一个 sub-module call(无其他逻辑)→ `pure-delegate`
  - 有 sub-module call + 其他逻辑(>3 行 / 包含 if/loop / setState 等)→ `mixed-delegate`
  - 无 sub-module call → `non-delegate`
- renderMarkdown 检查 entries 是否有 `internalBehavior`,有则 11b 主表格加 `internal-behavior` 列

**11a (canvas) 不受影响** — canvas.config.ts 不设 `subModulesForBehavior`,所有 entry `internalBehavior = undefined`,renderMarkdown 不加列。

**元教训**(给后续 phase):**P4/P5 拆解的核心信息不在"分类"列,在"行为"列**。binary 维度("是不是被 facade-delegate")损失关键 spectrum 信息。后续 P1+ 期间撞类似 binary 不够用 case → 主动提议精化(标 R8 形态 2 防御 — 显式说"这是新提议,等 user 拍板")。

**工单影响**:无 schema 改动(scan-api.ts 加 ScanConfig fields + helpers + 11b 表格自适应);**§修订日志加 3 行 D-P0-20/21/22**(已落地)。

### D-P0-23:对称约束扩展(user 拍板内部一致性责任)(2026-05-02 Δ2.3)

**驱动**:Δ2.3 stop ping 暴露 user 拍板内部矛盾(D-P0-20 §1 维度 A 文字 "export + 无 private = public" vs (R3) acknowledge "internal 200-400+" 互不相容)。Claude Code 没自己解释,把矛盾摆出来等 user reconcile — Q5 实操最高水准。

**规则扩展**(D-P0-19 §2 对称约束扩展):

之前对称约束(Δ1.3.2 d):**user 期望值偏离数据时 user 修期望**(不逼 Claude Code 改产物匹配错的期望)。

本次扩展(D-P0-23):**user 拍板内部矛盾时 user 修拍板**(不替 user 选 option)。

**触发条件**:Claude Code 在实施中识别 user 拍板内部矛盾 → stop ping 让 user reconcile,不替 user 解释。

**Δ2.3 案例**:user 边角 1 拍板 "export + 无 private = public" 与 (R3) 期望 "internal 200-400+" 矛盾。Claude Code 跑两种数据(option 1 = 249/7 / option 2 = 25/231),显式列矛盾,不选 option,等 user reconcile。User Δ2.3 ping 后采纳 option 3(双维度独立判定 + forgotten-public 子分类)。

### D-P0-24:facade class 同名重叠现象(2026-05-02 Δ2.3)

**驱动**:Δ2.3 D-P0-21 dual-pattern verify ratio EXCEEDED(V2 1.80 / 卫星 3.33),broad-only review 发现大量 false positive 是 **Meta2d 类与 canvas 类同名 method**(facade-delegate 设计副产物)。

**现象**:Meta2d facade 类与 canvas 被 facade 类**同名 method 大量重叠**(D-P0-12 facade-delegate 实证):active / render / inactive / destroy / addPen / addPens / beginBatch / endBatch / clearCanvas / 等 9+ 条。

**broad pattern hit `canvas.X`(canvas 实例 receiver)算 false positive**(不是 V2 调 Meta2d.X);但 strict pattern receiver list (`meta2d|m2d|engine`)naturally 不命中 — **ratio 永远 EXCEEDED for facade class**。

**P4 风险**:P4 拆 canvas.X 时,Meta2d.X facade 跟随;但 V2 端**两套 callsite**(`canvas.X` 通过 G-001 sub-A 暗线 + `meta2d.X` 通过 facade)预期同行为,P4 拆解后**可能不同步**。

**防御**(P4 工单未来写时硬约定):

> facade-delegate method(同名重叠 9+ 条)P4 拆解时**必须两套 callsite 等价测试**:`canvas.X(...)` 与 `meta2d.X(...)` 在 P4 后预期产出 identical behavioral test 输出。

**11b 11a cross-link**:11b 末段加同名重叠 method list(从 Meta2d facade-delegate 53 条 ∩ canvas 同名 method 求交集);P4 工单写时直接引用此 list 作 testing scope。

**D-P0-21 facade class 例外**(走 (a) 修订版):facade class ratio threshold 不阻塞,但 broad-only sample 必须 review 三分类:

- **真 missed receiver**(如 `m`)→ 加 v2ReceiverList 重跑
- **同名重叠 false positive**(如 `canvas.active`)→ 记录到 D-P0-24 list,不算 noise
- **第三方库 false positive**(如 `echart.resize`)→ 直接丢弃

### D-P0-25:option 3 forgotten-public 子分类(2026-05-02 Δ2.3)

**驱动**:Δ2.3 user 拍板 option 1/2/3 — option 3 双维度独立判定。

**新分类(11b 主表格 4 类)**:

| 标签 | 含义 | core.ts 实测 |
|---|---|---|
| `public` | exportCheck 命中 + V2/卫星 grep 命中(双向显式契约)+ 非 private | 25 条 |
| `forgotten-public` | exportCheck 命中 + V2/卫星 grep 0 命中(暴露但无消费证据)+ 非 private | **224 条** |
| `public-ish` | V2/卫星 grep 命中 + exportCheck 0 / 不适用(隐性契约)| 0 条(core.ts 全 export) |
| `internal` | private keyword OR(无 export AND V2/卫星 grep 0)| 7 条 |

**`forgotten-public` 工程含义**:Meta2d class export 但实际无消费证据 — **V1 surface 中的死代码**。P3 切换 surface 时**可丢弃**(不构成兼容性约束)。这些是 P1 spike review 的 priority drop candidates。

**实施**:

- `Classification` type 加 `'forgotten-public'`
- `classifyClassMember` 加分支:if exportCheck && !private && !v2/卫星hit → forgotten-public
- `renderMarkdown` 4 类全进 mainEntries(public / forgotten-public / public-ish);只 internal 进 skip

**canvas.ts 不影响**:canvas.config 不设 useExportCheck,facadeFiles 路径走 facade-delegate 维度;forgotten-public 在 canvas.ts 始终 0(✅ verified canvas 重跑数据 116 / forgotten-public 0 不变)。

**工单影响**:无 schema 改动(scan-api.ts 类型 + classify + render);**§修订日志加 3 行 D-P0-23/24/25**(已落地)。

#### §4 R8 三形态 + Q1-Q5 + 对称约束关系矩阵(累积 baseline,后续 phase 引用)

```
                                  防御 self-check
        ┌────────────────────────────┬─────────────────────────────────┐
        │  R8 形态                    │  对应 Q                         │
        ├────────────────────────────┼─────────────────────────────────┤
R8-1   │ 把"我能做的"算"完整完成"      │ Q1(每 ping 前)                │
R8-2   │ 自引入新方案体系假装既定        │ Q2(每 ping 前)                │
R8-3   │ 把 user 非显式表态解释成显式裁决 │ Q5(特定动作触发)               │
        ├────────────────────────────┼─────────────────────────────────┤
辅助检查 │ self-check 机器化盲区        │ Q3(每 ping 前)                │
        │ valuable discovery 漏        │ Q4(每 ping 前)                │
        ├────────────────────────────┼─────────────────────────────────┤
对称约束 │ user 期望 vs 数据冲突时优先信数据 │ user 责任(Claude Code 显式报告偏差) │
        └────────────────────────────┴─────────────────────────────────┘

   fail 处置:R8 苗头 → 重做整 Δ;其他(Q3/Q4/对称约束)→ 补做不重做
```

**累积 baseline**:后续 Δ(Δ2-Δ7 + P1+ 后续 phase)引用此关系矩阵。新发现 R8 形态 → 加形态 + 加 Q + 更新矩阵(走 D-P0 决策流程,user 显式批准)。

---

**Δ1 整体闭合 — 工程纪律累积产出**:

- D-P0-01 至 D-P0-19(19 个决策块)
- R8 三形态 + Q1-Q5 + 对称约束(P0 工程纪律 baseline)
- cycle 数度量(替代工作日)
- markdown 派生品 / facade 双向确认 / monkey-patched cross-validation / sibling 排除规则 / 备注列 prefix(脚本工程实施细节)
- 11a 主表格 116 / 附录 1 / valuable discoveries 5 节 / Surface 映射 placeholder
- 11h G-001 标 `推迟到下一 phase`,P0 退出门槛 5 ✅ 通过

**工单影响**:无新 schema 调整(D-P0-19 是 D-P0-17 §1 精化,不动工单);**§修订日志加一行 D-P0-19**(下方 patch)。

**工单影响**:工单 §修订日志加一行 D-P0-17(下方 patch);**工作纪律 #4 文字修订**(工作日 → cycle 数);其余无 schema 调整。

---

## Δ1.3 review 标记(防遗漏)

| 项 | 标记原因 | Δ1.3 行动 |
|---|---|---|
| C007 drawline V2/卫星 evidence | Δ1.1 sample 报告"V2 ❌"未附实际 grep 输出 — verification 不充分;drawline 是画线核心 method,V2 编辑模式肯定触发,可能(a) Meta2d facade 间接,(b) drawingLineName setter,(c) mousemove handler 内部调 | Δ1.3 全扫 review 时**重新 grep verify**(贴 grep 命令 + 输出);若 (b)(c) 形态成立,sample 分类要修(可能从 internal 上调到 public-ish) |

---

## 工作纪律(本 phase 内适用)

> 来源:Δ0c 末尾 user 补强(R8 防御 + 校对纪律)

1. **R8 工时防御**:任何子里程碑中段如果发现工时超出原估 **20% 以上**,**立刻 ping user 报告**,不要默默延期。这是 R8 反模式防御具体形态。

2. **20% 校对必须真做**:每个子里程碑工时分配的"50% 代码 + 30% 调试 + 20% 校对 + 回报"中,**20% 校对必须真做不能跳**。Δ 完成 = 全部可机器核对的项目都核对完毕。**不允许 push 给 user 校对**(Δ0b sanity check "等待 read 验证" 是教训)。

3. **可核对 vs 待 user 决策的区分**:
   - 格式核对、文件存在性、字段落地 — **可机器核对** → 完成时必须自查
   - 测试运行结果、数据正确性判定、设计决策 — **待 user 决策** → 显式说"等 user 跑测试"或"等 user 决策"

4. **度量单位:user review cycle 数(2026-05-02 Δ1.3.1 D-P0-17 修订;原工作日度量失效)**:

   原 Δ-specific 工时容差按"工作日 + 25% ping 阈值"度量,Δ1.2 实测暴露 LLM 实施者与人类估时有 20x gap(脚本 6.2 秒 + 工作 40 分钟 vs 12 小时 estimate)— 工作日 baseline 不可信。

   **修订**:Δ 估时改用 **user review cycle 数** 度量(1 cycle = 1 ping + user review)。
   - 单 Δ 内部 Claude Code 工时 < 1 小时 不是关注点
   - 关注点是 **ping 报告密度 + 质量**(每 ping 是否完整、有无 R8 苗头、是否 push 校对给 user)
   - 估时表达:Δ1.2 ≈ 1 ping + 5 user review cycles(因 user 拦补强;预期内 review work)
   - 后续 Δ 不再列"X 工作日"估时,改"X cycle"
   - **R8 防御**:cycle 数远超预估 → ping 报告内容质量问题(R8 苗头),不是工时问题
   - 当前 D-P0-工作纪律 #1 R8 工时防御(20% ping)**也作废**(同样基于工作日);代之以"质量阈值"(ping 报告中发现 R8 苗头立即停下重做)

   原 #1 文字保留作历史,但运行时已不适用。

---

## 已落地的工单一致性传播(Q-P0-*)

| # | 项 | 来源 | 落地位置 | 状态 |
|---|---|------|---------|------|
| Q-P0-01 | 工单 §6 patch:11h 第三类命名 + timing 实时累积 + P0 退出门槛 5 + 判定时机段 | D-P0-05 | §6 完整重写 | ✅ 2026-05-02 Δ0b 落地 |
| Q-P0-02 | 工单 §6 patch:11f exit gate 措辞修订(允许 split 后多文件 + index 主文件) | D-P0-02 | §6 退出门槛 1 修订 | ✅ 2026-05-02 Δ0b 落地 |
| Q-P0-03 | 工单 §4.4 patch:test ID scheme 新增 `T-MP-NNN`(monkey-patch 测试)前缀 + monkey-patches subdir | D-P0-03 | §4.4 修订 1+2 | ✅ 2026-05-02 Δ0b 落地 |

---

## 触发的红线

无。

---

## 本周回顾(2026-05-02 第 1 周)

- **2026-05-02**:Phase 0 启动准备会话(本会话)。
  - Δ0a 闭合(用时 ~1h):反问工单 §0 七份产出物结构 + 4 处澄清(D-P0-01 至 D-P0-05 全过)
  - Δ0b 闭合:工单 v1.0 → v1.1 落地(6 处 patch:§修订日志 / §3.2-bis / §4.1 / §4.3 / §4.4 / §6;含 D-P0-02/03/05 + Q-P0-01/02/03)。99-progress.md 同步落地状态。
  - Δ0c 闭合:Δ1 启动条件锁定(D-P0-06 至 D-P0-09 + 工作纪律段;工具栈 ts-morph + ripgrep + 三阶段 pipeline;Δ1 切 4 子里程碑;public-ish/Δ3 分工 + monkey-patched timing 拍板)
  - Δ1.1 进行中:启动后第一步 read canvas.ts 头 200 + tail 100 确认拓扑形态
  - 已读完 8 份必读文件(00 / 02 节选 / 03 / 10 / AI-PROMPT / README / _archived/_handoff-debts);02 surface 因体量(40K tokens)只读到 §0 节末 + 节标题骨架,Δ5-pre 时分块读完。

---

## 引用

- master plan §3 Phase 0 退出门槛
- master plan §4 红线机制(R8 防御要点)
- master plan §6.2 双层进度跟踪机制
- 10-phase-0-scope.md 工单本体
- _archived/_handoff-debts.md 旧路线 debt 移交清单
  - **P0 直接喂入项**:O-03(17+17+17 ch11 quirks 全数据 → 11f §4.3.1)/ C-16-C-17(具体 quirks → 11f §4.3.1)/ C-09 至 C-15(7 条 V2 adapter 已知 bug;走 D-P0-03 monkey-patch 处置 + behavioral test 决定 11i 归属)
