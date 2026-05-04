# Outstanding Debts — 旧 refactor 路线移交清单

> 状态:旧 master plan(M1-M13)已废弃,本文件列出截止本会话已知的全部
> 未完成事项,作为移交到 v2.0 master plan(docs/refactor-public-api/)的桥。
> 本文件由 Claude Code 在 2026-05-02 输出,后续不再更新。
>
> **修订**:
> - 2026-05-02 D-P0-17 §3 修正:O-03 ch11 quirks 数字 "17+17+17=51" 是 D-P0 期间笔误,实际 33(详见 O-03 行内 [修正] 注释)。Source of truth 应当追溯修正,不止在 D-P0 产出里用正确数字。

---

## 1. Code debts(代码层未完成)

| ID | 描述 | 来源 milestone | 当前状态 | 文件/PR | 与 v2.0 关系 |
|----|------|--------------|---------|--------|-------------|
| C-01 | **`canvas.ts` 模块边界拆分**(M3 §2 计划"6-10 个新文件")— 未执行,canvas.ts 仍 9828 LOC 单文件 | M3 | 未开始 | `meta2d.js packages/core/src/canvas/canvas.ts` | (留空) |
| C-02 | **`core.ts` facade 拆分** — 仍 7027 LOC 单文件,无 15 accessor pattern(`m2d.pens.*` / `m2d.connections.*` 等) | M3(隐含)/ M2 后置 | 未开始 | `meta2d.js packages/core/src/core.ts` | (留空) |
| C-03 | **02 surface 119 API 实施** — 7 facade method + 105 accessor method + 7 accessor 内置(KD-011 §A-D 全过) | M2 后置(无明确归属 milestone) | 设计 v1.0 ✅ / 实施 0% | `02-public-api-surface.md` | (留空) |
| C-04 | **02 surface 47 typed events 实施** — 当前 meta2d 暴露 19 events,新设计 47(+'view-mode:changed' 等) | M2 后置 | 设计 ✅ / 实施 0% | `02-public-api-surface.md §7` | (留空) |
| C-05 | **01 MECE 8 顶层目录 + 13 子目录 重组** — kernel / geometry / model / render / interaction / tokens / extension / api;预估 40-50 文件 < 500 LOC 95% | M3 后置 | 设计 ✅ / 实施 0%(tokens/ 已下沉 M5) | `01-mece-decomposition.md` | (留空) |
| C-06 | **Reactive<T> 三层解构实装**(StyleExpression / DataSource / Reactive 包络;`extension.{registerDataSource,...}` API)— Day 8 P0 架构补天之笔 | M2 后置 | 设计 ✅ / 实施 0% | `02 §0.4 / §3.12` | (留空) |
| C-07 | **transaction(name, fn) facade method 实装**(B7+D4+F12 三联;支持 undo/redo;跨 accessor 事务) | M2 后置 | 设计 ✅ / 实施 0% | `02 §2.3 / §4.3` | (留空) |
| C-08 | **PreviewIntent 单动词替代 dryRun opts** — 90% 调用单层判别;10% dryRun 走 preview() | M2 后置 | 设计 ✅ / 实施 0% | `02 §2.2` | (留空) |
| C-09 | **DEBT-003 Meta2d Adapter syncFullModel O(N) clear+repopulate** — 单 upsert 在 2000 节点 latency 未 micro-bench;cluster note 疑似多 P10 bug 同根 | (V2 Phase 2 Step 3) | DEFERRED P2 / Registered 2026-04-17 | `src/engine/adapters/meta2d/Meta2dDiagramEngineAdapter.ts` | (留空) |
| C-10 | **DEBT-P10-RELOAD-blank-render** — F5 重载后画布空白,需拖选才显设备 | (V2 user-report) | DEFERRED P1 / Registered 2026-05-01 | `src/engine/adapters/meta2d/Meta2dSyncEngine.ts` syncFullModel + meta2d canvasImage / canvasTemplate init 路径 | (留空) |
| C-11 | **DEBT-P10-DRAG-line-ghost-source** — 群组拖动时源 line 残影留原位;partial fix `0eecc8a` 单 motor 拖已修,群组拖未修 | (V2 user-report) | DEFERRED P2 / Registered 2026-05-01 | `installUxPatches.ts:204` + `meta2d canvas.ts:5142+` renderPens | (留空) |
| C-12 | **DEBT-P10-DRAG-anchor-stuck-real-ui** — 群组拖动释放后 port 端口蓝色不消失;programmatic test 通过 / 实际 UI 未通过 | (V2 user-report) | DEFERRED P2 / Registered 2026-05-01 | `installUxPatches.ts:228-258` + `Meta2dDiagramEngineAdapter.syncFullModel` | (留空) |
| C-13 | **DEBT-P10-ROTATE-line-not-follow** — 设备旋转后,连线不更新到新 anchor 位置 | (V2 user-report) | DEFERRED P2 / Registered 2026-05-01 | `ReverseSyncBridge.ts:147-149` + Meta2dSyncEngine | (留空) |
| C-14 | **DEBT-P10-DRAG-duplicate-render** — 多选拖动后画布显示重复设备 | (V2 user-report) | DEFERRED P2 / Registered 2026-05-01 | `Meta2dSyncEngine.ts` clear+repopulate + meta2d delete sequence | (留空) |
| C-15 | **DEBT-P10-ROTATE-handle-cursor-loss** — 旋转 handle 拖动时鼠标光标消失 | (V2 user-report) | DEFERRED P2 / Registered 2026-05-01 | meta2d canvas.ts rotatePens + V2 OverlayLayer cursor | (留空) |
| C-16 | **ch11 quirk 11.7 #3** — drag 5px 阈值常量化;grep 不出锚定位置无 Rule 6 enum 候选 | M3 D / Phase D | M3 scope-fenced(Rule 4) | meta2d.js core canvas drag handler | (留空) |
| C-17 | **ch11 quirk 11.7 #5** — installUxPatches globalAlpha+anchorVisible save+restore;V2-side OK 但需 redesign | M3 D / Phase D | M3 scope-fenced(Rule 4)/ V2-side doc'd | `installUxPatches.ts` save+restore loop | (留空) |
| C-18 | **dirtyPenRender Stage B**(per-pen bitmap cache 或 quadtree)— Stage A 已 default-on(Day 53),Stage B 灰度数据未收 | M4 / Phase D 后续 | Parked / 未启动 | meta2d canvas.ts dirty-pen 路径 | (留空) |
| C-19 | **V1 legacy types 残留**(`src/engine/types.ts` `CanvasEngine` interface + `PenData` / `TopologyData` / `EngineOptions` / `LayoutStrategy` / `PenSet` 等)— PenData 还被 reverse-sync.test.ts 用作 V1 fixture;EngineOptions 还在 createDiagramEngine 工厂签名 | (M13 后置 / 非 originally tracked)| ACTIVE — 未列入 known-debts;BRIEF §5 Tier 2 标识 | `src/engine/types.ts` | (留空) |
| C-20 | **5 Adopt 卫星包重构**(flow-diagram / form-diagram / fta-diagram / chart-diagram / svg)— 适配新 surface + strict TS + 删 register pattern 多余 | M8 | 未开始 | meta2d.js packages/{flow,form,fta,chart,svg}-diagram | (留空) |
| C-21 | **layout 包重写**(elkjs based,复用 V2 elk-layout.worker 模式)— 当前 `packages/layout/` 空 stub | M9 | 未开始 | meta2d.js packages/layout/ | (留空) |
| C-22 | **删除 vue / 旧 particle / le5le-charts 包** — git rm + workspace 清理 | M10 | 未开始 | meta2d.js packages/{vue,particle,le5le-charts} | (留空) |
| C-23 | **AVPP particle / time / parallel / 3D 脚手架**(KD-009 §1 选 B 全实装)— 替代 `core/effects/particle/` 空 stub;新增 `core/time/` 注入式时间源(1x/60x/360x/1440x/pause/step);新增 `core/instance/` 多实例 + viewport sync;新增 `core/render/3d/` 基础 isometric / perspective | M7 | 未开始 | meta2d.js packages/core/src/{effects,time,instance,render/3d}/ | (留空) |
| C-24 | **CloudPSS adornments**(选中 bbox 蓝虚线 / 4 corner 蓝实心圆 / 旋转 handle 蓝菱形 bbox 左上角外侧浮动无连接线)— 参考 docs/1.png;Tokens 驱动(M5 已就绪) | M6 | 未开始(M5 dependency 已满足) | meta2d.js packages/core src/canvas/(adornments path) | (留空) |
| C-25 | **V2 adapter 全面 rewrite to consume 新 surface** — 119 API + 47 events + 15 accessor 消费;V2 typecheck + 1929 tests + e2e + visual regression all green | M13 | 未开始(blocks on M2-M12) | `src/engine/adapters/meta2d/*` | (留空) |

---

## 2. Test debts(测试层未完成)

| ID | 描述 | 来源 milestone | 当前状态 | 文件/PR | 与 v2.0 关系 |
|----|------|--------------|---------|--------|-------------|
| T-01 | **DEBT-P10-PERF-BUDGETS-FULLSUITE-TIMEOUT** — perf-budgets stress (2000) 在 full-suite vitest 模式 5s timeout(solo 17/17 pass / full-suite ~10s);Day 53 OPSGRAY 修后暴露的 pre-existing flake;与 default-on flip 无关已验证 | (V2 测试基础设施) | DEFERRED P2 / Registered 2026-05-01 / 4 path-forward options 未选 | `src/engine/adapters/perf-budgets.test.ts` metric #4 stress (2000) | (留空) |
| T-02 | **dirtyPenRender Stage A 灰度数据收集**(default-on flip 后 1-2 周 user-reported single-pen-update ROI 数据)— 决定 Stage B 是否启动 | M4 / Phase D 后续 | Triggered 2026-05-01 / 数据未收 | (运行时观察,无具体文件) | (留空) |
| T-03 | **02 surface 每个公开 API smoke test** — M11 §11 计划 ≥50% core 覆盖率 + 每个公开 API smoke;新 surface 不存在,smoke 也不可能 | M11 | 未开始(blocks on C-03)| meta2d.js packages/core/test/(待建)| (留空) |
| T-04 | **5 Adopt 卫星 ≥30% 测试覆盖** | M11 | 未开始(blocks on C-20)| meta2d.js packages/{...}-diagram/test/ | (留空) |
| T-05 | **AVPP 脚手架 ≥40% 测试覆盖** | M11 | 未开始(blocks on C-23)| meta2d.js packages/core/test/(particle / time / parallel)| (留空) |
| T-06 | **DEBT-P7-archive-size-ratio**(metric #4 ratio ~0.19 vs 修订 target ≤0.20 thin margin)— 已 RESOLVED via Q1=A 裁决(target 修订),但 ratio 自身未优化;Phase 8 Sprint 5 prep 同盘 review 未启 | (V2 Phase 7 Sprint E)| RESOLVED-via-revision / 实际优化未做 | `src/engine/adapters/perf-budgets.test.ts` metric #4 | (留空) |
| T-07 | **`installUxPatches` real-mouse Playwright spec**(C-12 RC 待补:用 Playwright 真鼠拖动复现非 programmatic translatePens,看真实事件顺序)| (V2 调试基础设施) | 触发条件已具备 / 未实施 | (待建 e2e spec) | (留空) |
| T-08 | **Visual regression baseline rebuild**(M6 adornments 落地后)— 当前 baseline 是 Phase 6 港口 visual,M6 后需重生成 | M11 / M6 副产物 | 未开始(blocks on C-24)| `e2e/visual-*.spec.ts` snapshots | (留空) |

---

## 3. Doc debts(文档层未完成)

| ID | 描述 | 来源 milestone | 当前状态 | 文件/PR | 与 v2.0 关系 |
|----|------|--------------|---------|--------|-------------|
| D-01 | **Skill `meta2d-usage`**(API quick reference / 自定义 shape 教程 / AVPP 集成范式 / AI-friendly 范式) | M12 | 未开始 | (待建,参考 antv-g2-chart 风格) | (留空) |
| D-02 | **meta2d.js README + docs/ 重写** — API reference / migration guide(老 → 新)/ tutorial cookbook | M12 | 未开始 | meta2d.js README.md / docs/ | (留空) |
| D-03 | **M3 retrospective canvas.ts split deferral 未明确 record** — 99-progress / handoff / master plan §2 M3 都没"split 推迟到 X" 决策记录;事实上 split 没做但 master plan 没相应改写 | (M3 收口副产物) | Gap 存在 | `00-master-plan.md §2 M3` / `99-progress.md` / `10-m3-retrospective.md` | (留空) |
| D-04 | **02 surface implementation milestone 缺失** — M3 §2 列了"6-10 新文件"但 retrospective 只记 strict+quirks;M4-M13 都不显式覆盖 surface 实施;M8/M13 隐含假设 surface 已就绪但无负责实施的 milestone | (M-plan 设计副产物) | Plan-level gap | `00-master-plan.md §2-§3` | (留空) |
| D-05 | **Phase 8 Sprint 5 prep**(同盘:DEBT-P7-archive-size-ratio benchmark 重校 + DEBT-P10-PERF-BUDGETS-FULLSUITE-TIMEOUT)— 文档已点名,prep 未启动 | (V2 Phase 8 后置) | Trigger 未启 / 已点名 | `known-debts.md DEBT-P7-archive-size-ratio §"清理计划"` | (留空) |
| D-06 | **AVPP scaffolds 设计文档**(particle 物理 / time 倍率注入式 API / parallel A/B 对照 UX / 3D isometric vs perspective decision)| M7 | 设计未启动(只有 KD-009 §1 选 B 决策)| meta2d.js docs/(待建)| (留空) |

---

## 4. Decision debts(待决策项)

| ID | 描述 | 来源 milestone | 当前状态 | 文件/PR | 与 v2.0 关系 |
|----|------|--------------|---------|--------|-------------|
| K-01 | **02 surface full-implement vs reference** — 本会话末段刚提出的 3-option 分析(A 补 M3.5 / B 分散嵌入 M6-M13 / C 认知对齐降级)未做最终判断,user 即停止;02 v1.0-Final 4 轮 review 投入 vs "reference 不是合同" 之间未结论 | (M2-M13 桥)| user 已要求停止本路径分析 | `02-public-api-surface.md`(整文件)/ `00-master-plan.md §2 M3 / M8 / M13` | (留空) |
| K-02 | **DEBT-P10-PERF-BUDGETS-FULLSUITE-TIMEOUT 4 path-forward options A/B/C/D 未选** — A 单 test bump 30s timeout / B file-level 串行 + 调高 timeout / C 独立 vitest.perf.config / D 同盘 Phase 8 Sprint 5 prep | (V2 测试) | 列出 / 未选 | `known-debts-new.md DEBT-P10-PERF-BUDGETS-FULLSUITE-TIMEOUT` | (留空) |
| K-03 | **DEBT-P10-DRAG-anchor-stuck-real-ui RC 待补** — programmatic 通过但实际 UI 未通过;需 Playwright 真鼠 + console.log 实测真实事件顺序;修复方向 2 路径(删 installUxPatches anchorVisible save+restore vs syncFullModel 后 explicit 调 selectionState) | (V2 user-report) | RC 数据未收 / 修复方向未选 | `installUxPatches.ts` + `Meta2dDiagramEngineAdapter.syncFullModel` | (留空) |
| K-04 | **DEBT-P10-DRAG-line-ghost-source 修复路径** — (a) line clone 存在时 hide 源 line,删 type===1 skip,但需保留单选 line 拖动时不双影 vs (b) source line 短暂 globalAlpha=0,clone 接管渲染;V1 历史 fix"防 line 中途消失"真实场景需重 RC | (V2 user-report) | 双路径并列 / 未选 | `installUxPatches.ts:204` | (留空) |
| K-05 | **dirtyPenRender Stage B 算法选择** — per-pen bitmap cache vs quadtree;触发条件:Stage A 灰度数据显示 clip-rect 不够细粒度 | (M4 后续) | Parked / 未触发 / 未选 | meta2d canvas.ts | (留空) |
| K-06 | **V1 legacy types `src/engine/types.ts` 处置** — 选 (a) 全删除 + 把 EngineOptions 重 home 到 adapter-internal vs (b) 保留 deprecated namespace | M13 后续 | BRIEF §5 标识 / 未决议 | `src/engine/types.ts` | (留空) |
| K-07 | **DEBT-018 V1 ccu 节点 Phase 6 IoT 绑定层处置** — design `ComponentInstance.dataBindings` vs 新 `IotDevice` metadata 字段;decide 是否可视化 CCU(overlay 装饰)vs 仅数据绑定 | (V2 Phase 6) | Deferred / 未决议 | `scripts/migrate-v1-to-v3.ts` | (留空) |
| K-08 | **DEBT-019 V1 装饰 shape 处置** — Phase 6 末尾评估真实 V1 存档使用频率;若 >5% 是装饰 shape,decide 新增 V2 `decorative-shape` type | (V2 Phase 6) | Deferred / 未评估 | `scripts/migrate-v1-to-v3.ts` skipShapeNode() | (留空) |
| K-09 | **DEBT-020 V1 样本数 ≥20 vs 7 是否追求** — Phase 6 完成后批量回迁真实存档 vs 7 样本 freeze;3 再激活信号未触发 | (V2 Phase 6 后续) | Deferred user 2026-04-18 | `test-data/v1-samples/` | (留空) |
| K-10 | **DEBT-009 interfaceParams runtime 传播** — Phase 6 Day 0 KD source convention(推荐 `$param:name` 字符串前缀)+ InMemory + Meta2d + SvgExport 同步实装 + S16-bridge 测试 | (V2 Phase 6) | Deferred / 触发条件未到 | InMemory + Meta2d adapter | (留空) |
| K-11 | **DEBT-P7-reactor-variants** — air-core / iron-core props.coreType 实施触发条件未到 | (V2 Phase 7) | Deferred / 业务触发 | `src/themes/standard-iec-2d/symbols/current-limiting-reactor.ts` | (留空) |
| K-12 | **DEBT-P7-dc-breaker-multiterm** — 3/4-term 渲染分支触发条件未到 | (V2 Phase 7) | Deferred / 业务触发 | `src/themes/standard-iec-2d/symbols/dc-breaker.ts` | (留空) |
| K-13 | **DEBT-P7-dc-dc-variants** — topology + bidirectional 渲染分支触发条件未到 | (V2 Phase 7) | Deferred / 业务触发 | `src/themes/standard-iec-2d/symbols/dc-dc-converter.ts` | (留空) |
| K-14 | **R-4 residual: anchorSnap UI toggle**(toolbar / settings panel)— 产品决定;`setSettings({ interaction: { anchorSnap } })` API 已是接入通道但 UI 未做 | (V2 R-4 closure) | trigger-driven / 产品未决 | (toolbar / settings panel,待建) | (留空) |
| K-15 | **R-4 residual: anchor-snap O(M × N) perf 优化** — Trigger 用户报告 2000+ 节点 multi-select drag 卡顿 / 多选 50+ × 目标 1000+ × 5 anchors ≈ 250k 比较/drag frame | (V2 R-4 closure) | trigger-driven | anchor-snap 算法路径 | (留空) |
| K-16 | **R-4 residual: `dx === 0` 精确重合 case 单测** — V1 兼容 first-match-wins on ties;trigger 用户报告"完全重合时 snap 失效" | (V2 R-4 closure) | trigger-driven | (待建单测) | (留空) |
| K-17 | **R-4 residual: `anchorId` / `dockAnchorId` parity gap** — meta2d 默认 calcMoveDock 写,override 没补;trigger 任何 meta2d feature 读 `dock.xDock.anchorId` | (V2 R-4 closure) | trigger-driven | meta2d canvas.ts dock 路径 | (留空) |
| K-18 | **R-4 residual: `prev` 坐标 half-pixel 对齐** — meta2d `Math.round(x) + 0.5` vs override 写 raw;trigger 用户报告 dock 引导线视觉模糊 | (V2 R-4 closure) | trigger-driven | meta2d canvas.ts dock 路径 | (留空) |
| K-19 | **DEBT-P9-backend-substation-pens-reads + DEBT-P9-mongo-cleanup-v1-deferred 状态**:BRIEF §6 列为 P9 active(2 entries),known-debts-new "Recent closures" 列为 RESOLVED(2026-04-26 Sprint 9 Day 3 B-revised + dev mongo no-op);两文档不一致,实际产品状态需 user 确认 | (V2 Sprint 9) | 文档不一致 | `docs/REFACTOR-BRIEF.md §6` vs `docs/known-debts-new.md "Recent closures 2026-04-26"` | (留空) |

---

## 5. Other debts

| ID | 描述 | 来源 milestone | 当前状态 | 文件/PR | 与 v2.0 关系 |
|----|------|--------------|---------|--------|-------------|
| O-01 | **meta2d.js satellite packages build 失败**(2 study + 10 drop 卫星)— KD-008 历史 / 不动 satellites | (M-plan satellite-shelf §0.E) | 历史 KD / 已决"不动" | meta2d.js packages/* drop list | (留空) |
| O-02 | **V2 perf-budgets stress (2000) ratio > 0.30 jsdom 偶现 fail** — pre-existing,M5 后端验证标识(M3 retrospective §3.2);与 T-01 timeout 不同(那是 5s timeout,这是 ratio cap)| (V2 测试) | pre-existing / M5 后端验证 | `src/engine/adapters/perf-budgets.test.ts` | (留空) |
| O-03 | **33 ch11 quirks 全数据**(11.1: 6 + 11.2: 5 + 11.3: 4 + 11.4: 4 + 11.5: 3 + 11.6: 3 + 11.7: 5 + 11.8: 1 + 11.9: 2 = 33;M3 D 收 31/33,2 scope-fenced)记录已存在但 reorganize/cross-link 未做。**[2026-05-02 D-P0-17 §3 修正]** 原数字 "17+17+17=51" 是 D-P0 期间笔误,真实数字 33(crossvalidation:meta2d-internals.md §11.1-11.9 + 10-m3-retrospective §2.4 表格 "33 quirks D1-D7 子阶段")。| (M3 D 收口副产物)| 已存档 / 未交叉链接 | `meta2d-internals ch11 + 10-m3-retrospective.md §2.4` | (留空) |
| O-04 | **AVPP "12-25 天" 估算 vs M3 实际 37 天偏差**(KD-009 §3 估算偏低)— estimate 校准未沉淀;M7 估时 15-30d 沿用旧偏低 estimator | (M-plan §3 估算副产物)| 偏差未校准 | `00-master-plan.md §3` | (留空) |
| O-05 | **02 v1.0 / 03 v0.4 cross-validation log**(KD-011 §G 设计参照系 4 frame 的 own/industry×2/roadmap/policy 对照表)记录但产出物去向未跟踪 | (M2 review 副产物)| 已对照 / 产物 missing | `99-progress.md Day 7` | (留空) |

---

## 输出统计与不确定性回报

**Debt 总数**:5 类合计 **63 项**(C×25 / T×8 / D×6 / K×19 / O×5)。

**最不确定的 3 项**(标注理由):

1. **D-04 / C-03(02 surface implementation milestone 缺失)**:这是会话末段刚提出尚未与 user 完成讨论的"plan-level gap"判断。当前判断基于"M3 §2 文本 vs M3 retrospective 实际产出"对比,但**可能存在我未读到的 mid-stream 决策记录**(比如 99-progress 某天记录"split 推迟到 M8"被我 skim 错过),导致虚假报警。已用 grep `实施|implement|carve|split|落地|实装` 全扫 master plan + retrospective,未见 split-deferral 记录,但 grep 不是穷尽证据。

2. **K-19(P9 backend DEBTs 文档不一致)**:BRIEF §6 与 known-debts-new "Recent closures" 对同 2 项给出相反状态(active vs RESOLVED)。我倾向 known-debts-new 更新(更接近产品代码),但**未读 backend 仓 git log 验证 commit `6a20dd5` 是否真的删 V1 calc-model-regen chain**。如果两个文档真不一致,意味着 BRIEF §6 stale,这影响"已 closed phase 评估"的可靠性。

3. **C-19(V1 legacy types `src/engine/types.ts`)**:BRIEF §5 标识为"low priority — no behavior impact",但**我未独立验证 PenData / TopologyData / EngineOptions / LayoutStrategy / PenSet 的具体消费者**。如果某 production code path(非 test)还隐式依赖,删除会破。需 grep 实测。已 BRIEF 引述未自查。

**"重要的 debt 但我说不清楚"的感觉**:**有**。两处:

- **A**:M3 retrospective §3.2 ACTIVE 区列了 "11.7 #3 / #5 / V2 perf-budgets ratio jsdom fail / meta2d.js satellite build 失败" 4 项 scope-fenced,但**没汇总成 "Phase D 真闭合所需的最小 unblock 集"**。本 handoff 把它们各自录在 C-16/C-17/O-01/O-02,但若 v2.0 用"phase-must-close-set"打包思路,可能要重组。我没把握 v2.0 是不是这样组织。

- **B**:`02 §0.4 三层解构 + §3.12 extension.{registerDataSource}` 是 Day 8 P0 "架构补天之笔",修的是隐含 MQTT/HTTP 通讯耦合的架构债。但这 6 个 method(C-06)在 V2 当前 adapter 没消费方;**它们是设计正确性 debt(防止隐性耦合再生)还是实施 debt(必须落地)**,我说不清。如果是前者,v2.0 不必实施;如果是后者,M2 反向 validation N=1 doc patch 是 commit。建议 v2.0 启动会话 user 重读 02 §0.4 / §3.12 自决。

**已恪守约束**:
- 与 v2.0 关系列全留空 ✅
- 无"建议下一步"章节 ✅
- 仅产出 `_handoff-debts.md` 单文件,未改其他 ✅
- 未访问 `docs/refactor-public-api/` ✅
- 旧目录仅作为信息源读取,无写入 ✅
