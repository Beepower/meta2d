> # ⚠️⚠️⚠️ 此文档已废弃 — 仅作反例存档 ⚠️⚠️⚠️
>
> # 这是 v0.1 master plan,**已被 v2.0 完全替换**
>
> # 它在执行中走偏了。v2.0 的存在就是为了堵住它的洞。
>
> ---
>
> ## 为什么这份文档还在?
>
> 因为它是**结构性走偏的活案例**,有教育价值。删了就没人记得当时为什么会走偏。
> v2.0 master plan §0 / R8 / AI-PROMPT.md「四个反模式」全部基于对这份文档的诊断。
>
> ## 它走偏在哪里?(六个结构性引导走偏的根因)
>
> ### 根因 1 — 估算驱动范围,而非范围驱动估算
>
> §3 工期表写"总计 62-128 天 ≈ 2-4 月",下面跟一句"均 < 6 个月许可"。
> 暴露思考顺序:**先有"6 个月许可"这个 anchor,再把工作量倒推压进去**。
> M2 估 5-15 天、M3 估 7-15 天,不是因为这些工作真的这么大,
> 是因为整体预算只有 6 个月,每个 milestone 必须分到这么小才合理。
>
> **后果**:实施者拿到 M3 工单,看到"7-15 天",心里就把范围裁到 7-15 天能完成的程度。
>
> ### 根因 2 — M3 措辞致命的歧义("6-10 个新文件")
>
> M3 原文:"canvas.ts 按 M2 决定的模块边界拆分(预计 6-10 个新文件)"。
> M2 实际产出的边界是 40-50 文件 + 控制流反转 + 5 个新机制(Reactive 三层 / transaction 嵌套 / spatial index / ConnectionValidator / DataSource)。
>
> "6-10 个新文件"这一括号注解,**把 deep refactor 矮化成物理拆分**。
> 两套世界观在同一句话里冲突,实施者会自然滑向更小的那一套。
>
> **后果**:M3 启动时一看,strict TS + canvas.ts 拆分是两件事,选了能在估时内做完的(strict + 31/33 quirks)。canvas.ts 拆分**悄无声息地脱落**。
>
> ### 根因 3 — 没有 phase 退出门槛,只有 milestone 名
>
> §2 每个 milestone 给了"输出"清单,但没给"做完什么算完"的**可验证条件**。
> M3 退出门槛是什么?"strict TS 通过 + canvas.ts 拆完"还是"strict TS 通过 + 31/33 quirks 修完"?都没明说。
>
> **后果**:"strict + 部分 quirks"也能算完成,canvas.ts 拆分悄悄滑出 milestone 范围。
> 这是 v2.0 R8(默默缩范围)反模式的**直接来源**。
>
> ### 根因 4 — 隐含"surface 已就绪"的假设串起 M5–M13
>
> M6 估 1-2 天、M7 估 15-30 天、M8 估 7-14 天、M13 估 7-14 天——
> 这些数字**只在 surface 已实施完成的前提下**才合法。
> 但旧计划没有任何一个 milestone 真正负责把 surface 从"设计文档"变成"内核实现"。
>
> M2 名为"设计",M3 名为"strict 迁移",M4 名为"quirks fix"——
> 三个 milestone 都不负责 surface 实施,但 M5–M13 都假设它已就绪。
>
> **后果**:链式假设失效。任何一节断,后面全部失效。但因为是**隐含假设**,所有人都看不到这条链。
>
> ### 根因 5 — 没有"系统始终可发布"的约束
>
> §4.4 说"V2 用 link: 跟随 refactor 分支"。
> 但 link: 跟随的是个**正在拆解、半新半旧**的废墟,V2 也会跟着进废墟态。
> **没有任何机制保证 refactor 分支在中间状态可以跑**。
>
> **后果**:一旦 M3 拆到一半发现拆不动,V2 也卡死,只能回滚——
> 回滚的代价大,于是干脆就不真拆。
>
> ### 根因 6 — 没有红线机制,只有"继续"和"放弃"两个选项
>
> §5 风险列表只描述风险,**没说"风险触发了怎么办"**。
> R1 写"M2 30 天仍未稳定 → 警讯",但**警讯之后做什么**没说。
>
> **后果**:M3 启动遇到困难——既不能"放弃",又没有"中止重新评估"的合法路径,
> 只剩"硬做一部分算完"。这就是 M3 缩范围的真正机制。
>
> ---
>
> ## v2.0 怎么堵这些洞?
>
> | 根因 | v2.0 对策 |
> |------|----------|
> | 1 估算驱动范围 | v2.0 估 11-17 月,不 anchor 任何"许可" + AI-PROMPT 反模式 1 |
> | 2 物理拆分混淆 | v2.0 phase 名直接叫"控制流反转拆解" + AI-PROMPT 反模式 3 |
> | 3 无退出门槛 | v2.0 §3 每个 phase 显式退出门槛 + R8 |
> | 4 隐含假设链 | v2.0 P2 双 surface 期 + delegate 把假设变显式工作 + AI-PROMPT 反模式 4 |
> | 5 无可发布约束 | v2.0 §2 原则 4 强约束 |
> | 6 无红线机制 | v2.0 §4 八条红线 + 处置流程 |
>
> ---
>
> ## 阅读建议
>
> 看下面原文时,**对比 v2.0 主文档**:
> - 看 §3 工期估算如何被 6 月许可锁死
> - 看 M3 描述如何把 deep refactor 矮化成物理拆分
> - 看 §5 风险列表如何只描述风险不给处置
> - 看 §6 99-progress.md 怎么提了一句但没工程化
>
> 这些都是 v2.0 master plan 直接对应修补的部分。
>
> ---
>
> # ⚠️ 以下为旧文档原文,不再有效 ⚠️

---

# meta2d 深度重构 — Master Plan

**项目**: `refactor/strict-deep-2026-04`(../meta2d.js 分支)
**周期**: 2026-04-30 启动,目标 6 月内 V2 跑在新 core 上
**驱动决策**: `docs/decision-log/KD-009-deep-refactor-decision.md`
**Tracker**: TaskList M1-M13

---

## §0 一句话目标

把 ../meta2d.js 从"老 le5le 通用图形库"重构为"BeePower 长期底座":AI 易用、开发者易用、AVPP 全适配、严格类型、零 quirk、有测试、有文档。

## §1 13 个 milestone 总览

```
M1  ★ 计划 + 分支(本文档,本会话末完成)
       │
       ▼
M2  ★ MECE 模块分解 + 新 API 设计 ★ 最重要 ★
       │      ↓ blocks 所有后续
       ▼
M3  Strict TS 迁移(canvas.ts 9.4k 拆分)
M5  设计 tokens 下沉
       │
       ▼
M6  CloudPSS adornments(diamond + 蓝色 corner)
M4  30 quirks 全修
M7  AVPP 脚手架(particle / time / parallel / 3D)
       │
       ▼
M9  layout 替换 elkjs
M10 删除 vue / particle(旧)/ le5le-charts
M8  5 Adopt 卫星包重构(适配新 core API)
       │
       ▼
M11 测试(smoke + 30-50% unit)
M12 Skill + 文档
       │
       ▼
M13 V2 集成 + 验证
```

## §2 各 milestone 概要

### M1 — Plan + branch ✅(本文档)

- ✅ KD-009 决策落档
- ✅ Branch `refactor/strict-deep-2026-04` 在 ../meta2d.js 建好
- ✅ 13 milestone 创建到 TaskList
- ⏳ 本计划文档撰写中(本会话末 close)

### M2 — MECE 模块分解 + 新 API 设计 ★

**最重要 milestone**。

输入:
- 锚 §3 / §4 / §6(AVPP 47 能力)
- meta2d-internals ch11(30 quirks)/ ch12(V2 用 vs 不用 / Renderer 草稿)
- AVPP scaffolds 需求(particle / time / parallel / 3D)
- 5 Adopt 卫星包的 import 路径

输出:
- `01-mece-decomposition.md`(模块树 + 每模块职责 + 依赖关系)
- `02-public-api-surface.md`(公开 API 全清单 + 每个的签名 / 副作用 / Result 类型)
- `03-internals-mapping.md`(老 canvas.ts 9.4k 行 → 新模块映射)

设计原则(KD-009 §3):
- MECE / 够用 / 易用 / 乐用 / AI-friendly / AVPP-ready

### M3 — Strict TS 迁移

- @meta2d/core 全文件 strict + noUncheckedIndexedAccess + noUnusedLocals/Params
- canvas.ts 按 M2 决定的模块边界拆分(预计 6-10 个新文件)
- `pnpm typecheck` 在 ../meta2d.js 各包都过

### M4 — 30 quirks 全修

每个 quirk 一个 commit + 一个回归测试。完整列表见 `04-quirks-fixes.md`(M4 启动时填)。

### M5 — 设计 tokens 下沉

- 新建 `packages/tokens/`
- 移动 V2 `src/design-tokens/tokens.ts` → `packages/tokens/src/`
- V2 改 import 路径
- 三层结构(palette / semantic / theme)保留

### M6 — CloudPSS adornments

参考 docs/1.png:
- 选中 bbox 蓝色虚线
- 4 corner 蓝色实心圆(replace 老的白底蓝边方块)
- 旋转 handle 蓝色菱形,bbox 左上角外侧浮动,**无连接线**
- Tokens 驱动(M5 dependency)

### M7 — AVPP 脚手架

按 KD-009 §1 选 B 全实装:

| 子项 | 描述 |
|------|------|
| Particle | core/effects/particle/(替代空 stub);粒子发射器 / 系统 / 物理(WebGPU 备选) |
| Time engine | core/time/;1x/60x/360x/1440x/pause/step;注入式;`requestAnimationFrame` 包装层 |
| Parallel space | core/instance/;多实例并行 + viewport sync + A/B 对照 |
| 3D | core/render/3d/;基础 isometric / perspective(transform 包内容下沉) |

### M8 — 5 Adopt 卫星包重构

flow-diagram / form-diagram / fta-diagram / chart-diagram / svg 全部:
- 适配新 @meta2d/core API(M2 后的 surface)
- Strict TS
- 删除老的 register pattern 中不必要的部分

### M9 — Replace layout

`packages/layout/` 当前空 stub。重写为基于 elkjs 的层次/正交/力导向布局。复用 V2 `src/workers/elk-layout.worker.ts` 模式。

### M10 — 删除 vue / particle(旧)/ le5le-charts

git rm + workspace 清理。

### M11 — 测试

vitest 框架。覆盖率目标:
- core 内核(kernel / store / scheduler / render / event / geometry):**≥ 50%**
- 5 Adopt 卫星:**≥ 30%**
- AVPP 脚手架(particle / time / parallel):**≥ 40%**
- 每个公开 API smoke test

### M12 — Skill `meta2d-usage` + 文档

参考 antv-g2-chart 风格。SKILL.md frontmatter 格式。内容:
- API quick reference(开发者用)
- 自定义 shape 教程
- AVPP 集成范式(particle 怎么开 / time 倍率怎么调 / parallel A/B 怎么做)
- AI 友好范式(Result / dryRun / describe)

文档(meta2d.js README / docs/):
- API reference
- Migration guide(老 → 新)
- Tutorial cookbook

### M13 — V2 集成

- V2 `src/engine/adapters/meta2d/` 全部 rewrite to consume new API
- V2 typecheck + 1929 tests + e2e + visual regression all green
- ../meta2d.js fork 锁定为 BeePower foundation v1.0

## §3 工期估算

| Milestone | 估时 | 累计 |
|-----------|------|------|
| M1 | 0.5 天 | 0.5 天 |
| **M2** | **5-15 天**(最重要,深度斟酌)| 5.5-15.5 天 |
| M3 | 7-15 天 | 12.5-30.5 天 |
| M4 | 5-10 天(quirks 与 M3 并行)| -- |
| M5 | 1-2 天 | 13.5-32.5 天 |
| M6 | 1-2 天 | 14.5-34.5 天 |
| M7 | 15-30 天(AVPP 全脚手架)| 29.5-64.5 天 |
| M8 | 7-14 天 | 36.5-78.5 天 |
| M9 | 3-5 天 | 39.5-83.5 天 |
| M10 | 0.5 天 | 40-84 天 |
| M11 | 10-20 天 | 50-104 天 |
| M12 | 5-10 天 | 55-114 天 |
| M13 | 7-14 天 | 62-128 天 |

总计:**62-128 天 ≈ 9-18 周 ≈ 2-4 月**(乐观-悲观区间,均 < 6 个月许可)。

## §4 工作流

### §4.1 分支模型

- 主战场:../meta2d.js `refactor/strict-deep-2026-04` 分支
- V2 主分支保持稳定(用 KD-008 的 link: 依赖跟随 refactor 分支)
- 各 milestone 在 refactor 分支上推进,**不开子分支**(单人开发,简化)
- M13 完成 → merge 回 main → V2 切换 link 到 main

### §4.2 commit 粒度

- 每 quirk fix 一个 commit
- 每模块拆分一个 commit
- 每新功能(particle 系统等)一个或多个 commit
- commit message 中文 / 英文混合,聚焦 why
- Co-Authored-By: Claude

### §4.3 验证节奏

每 milestone 收口:
1. ../meta2d.js `pnpm typecheck` 在所有包通过
2. ../meta2d.js `pnpm test` 通过
3. V2 `pnpm typecheck` + `pnpm test` 通过(用 link: 锁定到当前 refactor branch)
4. 更新本 master plan 的状态

### §4.4 不阻塞 V2 主线

V2 主线(Phase 1 ADR §18 amendment / Phase 2-5 实装)在重构期间继续:
- V2 用 link: 跟随 refactor 分支
- M2 完成后,V2 Phase 1 ADR §18 起草可对齐新 API 设计
- M13 V2 集成时,V2 主线和重构汇合

但 V2 自己的重构(`refactor-plan-v1.md` 路线)需重新评估 — 重构 meta2d 期间,V2 上层动作减少。

## §5 风险

### §5.1 R1 — M2 设计耗时超标

**MECE 设计是 hard 工作**。可能 5 天不够,15 天不够。如果 30 天仍未稳定 → 警讯。

**缓解**:M2 分阶段产出:
- Day 1-3:模块树 v0.1(粗)
- Day 4-7:逐模块 API 草稿
- Day 8-10:对照 V2 / 5 Adopt 卫星 / AVPP 用例验证
- Day 10+:迭代修正

### §5.2 R2 — Strict 化触发隐藏 bug

../meta2d.js 老代码强 strict 后,可能会显式暴露老代码中"silently working" 的 bug。

**缓解**:M3 与 M4 并行,M11 单元测试覆盖关键路径。

### §5.3 R3 — particle / time / parallel 复杂度

AVPP 脚手架是新功能,实装风险高。

**缓解**:M7 各子项独立 timeline;若任一撞墙,可独立延期(其他子项不阻塞)。

### §5.4 R4 — V2 主线脱节

../meta2d.js 重构 6 月期间,V2 主线如果继续推进 Phase 1-5 也需对齐。

**缓解**:V2 主线 Phase 1 ADR §18 amendment 在 M2 完成后起草(对齐新 API);Phase 2-5 实装可与 M3-M12 并行(用 link: 跟随)。

### §5.5 R5 — 用户 review 节点漂移

6 月项目需用户阶段性 review。

**缓解**:每 milestone 收口提交 review 报告 + V2 集成 smoke 验证。重大设计选择(M2 输出)优先 review。

## §6 后续会话恢复点

新会话执行 §1 启动协议(读 BRIEF + handoff)后,200 字回答还需补一句:

> "重构 meta2d.js refactor/strict-deep-2026-04 分支进行中,当前 milestone Mx,见 docs/refactor-strict-deep-2026/99-progress.md"

进度跟踪在 `99-progress.md`(M1 收口时建)。

---

*Master plan v0.1 — 2026-04-30. 随项目推进持续更新。*

*[已废弃 — 替换为 v2.0,见 docs/refactor-public-api/00-master-plan.md。本文件保留作为反例存档。]*
