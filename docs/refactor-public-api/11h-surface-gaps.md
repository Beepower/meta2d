# 11h — Surface Gaps (P0 → P1 桥)

> 路径:`docs/refactor-public-api/11h-surface-gaps.md`
> 用途:P0 期间发现的"V1 有但 surface(02-public-api-surface.md)没覆盖" + monkey-patch + 暗线 dep 等 surface 修订候选
> 维护规则:实时累积(D-P0-05)— Claude Code 每发现一条 gap 立刻进此文件标 `需 user 裁决` + ping user
> 退出门槛:P0 完成时此队列**零条 `需 user 裁决` 待决**(工单 §6 退出门槛 5,D-P0-05 新增)
> 四选一标签(2026-05-02 D-P0-18 加第四类):`surface-补 v1.1` / `主动放弃` / `需 user 裁决` / `推迟到下一 phase`(必附 3 条强制附属:推迟理由 / 触发恢复条件 / 裁决最晚时间点)

---

## 索引

| # | 类型 | 名称 | 标签 | 来源 Δ |
|---|------|------|------|--------|
| G-001a | 暗线 dep | 卫星 `pen.calculative.canvas.render()` (17+ hits) | **`surface-补 v1.1`**(2026-05-02 Δ4 user 裁决:承认契约;P4 必须保留兼容路径) | Δ1.1 step 3 + Δ1.2 + Δ4 D-P0-27 |
| G-001b | 暗线 dep | 卫星 `pen.calculative.canvas.parent.<X>` (~15 hits;反向访问 Meta2d) | **`主动放弃`**(2026-05-02 Δ4 user 裁决:parent chain 反向耦合,P4/P7 卫星重写移除) | Δ1.1 + Δ4 D-P0-27 |
| G-001c | 暗线 dep | 卫星 `pen.calculative.canvas.store.<X>` (70+ hits;数据访问主路径) | **`surface-补 v1.1`**(2026-05-02 Δ4 user 裁决:store 拆解保留;surface v1.0 加 store accessor API)| Δ1.2 + Δ4 D-P0-27 |
| G-001d | 暗线 dep | 卫星 `pen.calculative.canvas.externalElements` (2 hits;DOM ref) | **`surface-补 v1.1`**(2026-05-02 Δ4 user 裁决:DOM ref 必须可达;surface v1.0 加 DOM accessor)| Δ1.2 + Δ4 D-P0-27 |
| G-001e | 暗线 dep | 卫星 `pen.calculative.canvas.mouseDown` (1 hit;mouse state) | **`主动放弃`**(2026-05-02 Δ4 user 裁决:mouse state 内部细节,P4 不暴露) | Δ1.2 + Δ4 D-P0-27 |
| G-001f | 暗线 dep | 卫星 `pen.calculative.canvas.showInput()` (1 hit;不通过 facade) | **`主动放弃`**(2026-05-02 Δ4 user 裁决:不通过 facade,P4/P7 卫星重写改 facade) | Δ1.2 + Δ4 D-P0-27 |
| G-002 | 命名规范 | V2 端使用 `m` 单字符缩写代表 Meta2d 实例(2 hits)| **`推迟到下一 phase`**(2026-05-02 Δ2.3 D-P0-21 dual-pattern verify 发现) | Δ2.3 dual-pattern verify broad-only review |
| G-003 | V1 method gap | `clearRuleLines` (canvas pub #2) | **`主动放弃`**(2026-05-02 D-P0-29 user verdict:V1 内部 ruler utility,V2/卫星 0 hits) | Δ5 v2 D-P0-29 |
| G-004 | V1 method gap | `pushHistory` (canvas pub #12 + core M*) | **`主动放弃`**(2026-05-02 D-P0-29 user verdict:transaction cover) | Δ5 v2 D-P0-29 |
| G-005 | V1 method gap | `undo` / `redo` history navigation (canvas pub #13/14 + core + history C ×2) | **`surface-补 v1.1`**(2026-05-02 D-P0-29 user verdict:V2 业务层 toolbar/shortcut 直接调用) | Δ5 v2 D-P0-29 |
| G-006 | V1 method + event gap | clipboard `copy`/`cut`/`paste` (canvas pub #22-24 + emits 3 + drop event) | **`主动放弃`**(2026-05-02 D-P0-29 user verdict 改推荐:clipboard 是业务层逻辑 ≠ diagram 抽象;V1 god-class 反模式;V2 用 selection.get + pens.duplicate + pens.add 组合自管)| Δ5 v2 D-P0-29 |
| G-007 | V1 method gap | image export `toPng`/`activeToPng`/`pensToPng` (canvas pub #33-35 + core M18) | **`surface-补 v1.1`**(2026-05-02 D-P0-29 user verdict:V2 业务层导出图片功能) | Δ5 v2 D-P0-29 |
| G-008 | V1 method + event gap | inline input `showInput`/`hideInput` (canvas pub #52-53 + emits clickInput/input) | **`主动放弃`**(2026-05-02 D-P0-29 user verdict:同 G-001f facade-bypass;P7 卫星重写) | Δ5 v2 D-P0-29 |
| G-009 | V1 method gap | `clearCanvas` utility (canvas pub-ish #55) | **`surface-补 v1.1`**(2026-05-02 D-P0-29 user verdict:V2 业务层新建/重置功能直接清空) | Δ5 v2 D-P0-29 |
| G-010 | V1 property gap | DOM accessor `canvas`/`width`/`height` (canvas pub-ish #76-78) | **`surface-补 v1.1`**(2026-05-02 D-P0-29 user verdict:与 G-001d 协同扩;V2 截图/外部 lib 集成需 DOM ref + 尺寸) | Δ5 v2 D-P0-29 |
| G-011 | V1 method gap | perf hints `markDirty`/`markAllDirty` (canvas pub-ish #115-116) | **`surface-补 v1.1`**(2026-05-02 D-P0-29 user verdict:Day 53 dirty-pen flip ✅ 后 V2 perf 路径关键) | Δ5 v2 D-P0-29 |
| G-012 | V1 event gap | raw mouse events `mousedown`/`mouseup`/`click`/`dblclick`/`contextmenu` (emits 5) | **`主动放弃`**(2026-05-02 D-P0-29 user verdict 选选项 b:V2 走 DOM container raw events via G-010;surface 不集中 input handling — god-class 反模式)| Δ5 v2 D-P0-29 |
| G-013 | V1 event gap | input events `clickInput`/`input` (emits 2) | **`主动放弃`**(2026-05-02 D-P0-29 user verdict:随 G-008 inline editing 一并放弃;P7 卫星自有 form handling) | Δ5 v2 D-P0-29 |

---

## G-001 — 卫星包 pen.calculative.canvas 暗线访问 canvas 实例

**类型**:cross-cutting concern(工程发现,非 V1 method 漏覆盖)

**标签**:**`推迟到下一 phase`**(2026-05-02 Δ1.3.2 D-P0-18 标签从 `需 user 裁决` 变更)

**3 条强制附属**(D-P0-18 要求):

- **推迟理由**:P0 阶段 user 无 P1 spike 信息,对 6 sub-form 处置粒度无充分判断证据;现在裁决 = "凭直觉"违反 P0 工程纪律
- **触发恢复条件**:P1 spike 启动前 user 一并 review 6 sub-form
- **裁决最晚时间点**:P1 spike 第一周末

**来源**:Δ1.1 step 3 真实 ripgrep grep 卫星包 `\.render\s*[(=]` 命中 17+ 处,全部形态为 `pen.calculative.canvas.render()`(form-diagram 多文件)。

**事实**:卫星包(form-diagram / chart-diagram / class-diagram)通过 `pen.calculative.canvas.<X>` chain 直接访问 canvas 实例,**绕过 Meta2d facade**。Δ1.2 全扫(grep 卫星端 `pen.calculative.canvas.(parent|store|externalElements|mouseDown|showInput|render)`)发现 **95 hits across 12 files**,**6 种 sub-form**:

| sub-form | pattern | hit 数(across files) | 例 | P4 拆解风险 |
|---|---|---|---|---|
| sub-A `render()` | `pen.calculative.canvas.render()` | 17+(form-diagram 大头) | `table.ts:304` | canvas.render 拆解后必须保留 method 兼容 |
| sub-B `parent.<X>` | 反向访问 Meta2d 实例 | ~15(radio/time/table) | `radio.ts:15` `parent.active([pen])` | 反向耦合 — canvas 拆后 parent chain 必须保留 |
| sub-C `store.<X>` | 直接访问 canvas.store | **70+**(table2 34 / table 11 头部大量) | `slider.ts:23` `canvas.store.options` | canvas.store 当前是 public field — 拆解时必须保 store 可达 |
| sub-D `externalElements` | 直接 DOM access | 2(LightningChart) | `LightningChart.ts:55` | DOM ref 公开 field |
| sub-E `mouseDown` | 直接读 mouse state field | 1(slider) | `slider.ts:170` | mouse state 公开 field |
| sub-F `showInput()` | call canvas method 不通过 facade | 1(table) | `table.ts:289` | method 不通过 Meta2d facade |

V2 端 grep `pen\.calculative\.canvas` **0 hits** — V2 走 DiagramEngine 抽象,无暗线。**暗线问题集中在卫星包**。

`pen.calculative.canvas` chain 是 Pen 的 calculative property 持有 Canvas 实例引用,卫星包通过此 chain 直接读写 canvas 内部状态。

**工程含义**:

1. **canvas 的对外契约不仅是 Meta2d 顶层 facade** — 还包括 Pen.calculative.canvas 这条暗线访问路径
2. P4/P5 拆解 canvas 时,Meta2d 顶层契约改变可能不影响卫星(因为它们走暗线),但如果 canvas 内部结构改变,卫星可能立刻断
3. D-P0-12 facade-delegate 判定标准基于 Meta2d 顶层 facade,**未覆盖暗线访问路径**
4. Δ1.2 全扫如果只走 facade-delegate 标准,会漏判 canvas method 实际通过暗线被卫星消费的事实

**D-P0-05/18 标签裁决历史**:

| 时间 | 标签 | 备注 |
|---|---|---|
| Δ1.1 创建 | `需 user 裁决` | (A)(B)(C) 体系尚未提出 |
| Δ1.2 ping report | (Claude Code 提议 (A)(B)(C) 处置体系) | R8 形态 2 自引入新方案体系假装既定 |
| Δ1.3.1 user 拒绝 | 撤回 (A)(B)(C),改回 `需 user 裁决` | (A)(B)(C) 体系不进入工单 |
| Δ1.3.1 Claude Code 误判 | (Claude Code 把 user 的"P1 spike 细分"理解为"已裁决",自判 ✅ 通过) | R8 形态 3 把 user 非显式表态解释成显式裁决 |
| **Δ1.3.2 user 拍板**(本轮) | **`推迟到下一 phase`**(D-P0-18 加第四类标签) | 显式承认推迟合法 + 加 3 条强制附属约束 |

**user 拒绝 (A)(B)(C) 4 条理由**(2026-05-02 Δ1.3.1):

1. (A)(B)(C) 是 Claude Code 引入的新概念,user 没有需要这个层次的工程理由
2. D-P0-05 三选一(承认契约 / 主动放弃 / 需 user 裁决)适用于任何 gap(含复合 gap)
3. G-001 6 sub-form 整体作一条 gap;P1 spike 启动前一并 review 决定细分
4. 引入 (A)(B)(C) 等于在 D-P0-05 之上加一层判定,工程负担增加但不产生新价值

**为什么走 D-P0-18 加第四类标签 (b) 而不是严格三选一 (a)**:

- 现实:P0 阶段 user 无 P1 spike 信息,对 G-001 6 sub-form 实际裁决 = "凭直觉"违反 P0 工程纪律
- (a) 严格三选一会强迫不充分裁决
- (b) 显式承认推迟合法,但加 3 条强制附属(推迟理由 / 触发恢复条件 / 裁决最晚时间点)防滥用
- 工单 schema 修订(D-P0-05 加第四类)是合法的 — user 显式批准,不是 R8 苗头

**P0 退出门槛 5(D-P0-05/18)状态**:✅ 通过(零条 `需 user 裁决` **待决**)。

---

## G-001 6 sub-form 重新裁决(2026-05-02 Δ4 D-P0-27 — 对称约束反向应用第二次)

**驱动**:Δ3 数据揭示 G-001 是卫星消费 canvas 的**主路径(92%,11/12 sat sites)**,不是次要暗线。P4 拆解方案的 90%+ 行为受 G-001 裁决方向左右。**对称约束反向应用第二次**:user Δ1.3.2 时拍板 `推迟到下一 phase` 时信息不充分(Δ1.2 boolean evidence 无法 quantify P4 影响),Δ3 数据让信息充分,user 修拍板 — **G-001 必须 P0 收口前裁决,不能推到 P1**。

**6 sub-form 各自裁决**(D-P0-05 三选一标签,不再用 D-P0-18 推迟):

| sub-form | hit | 裁决 | 标签 | 理由 |
|---|---|---|---|---|
| G-001a `render()` | 17+ | **承认契约** | `surface-补 v1.1` | P4 必须保留兼容路径(canvas.render 是 facade-delegate 已在 surface 内)|
| G-001b `parent.<X>` | ~15 | **主动放弃** | `主动放弃` | parent chain 反向耦合,P4/P7 卫星重写移除 |
| G-001c `store.<X>` | **70+** | **承认契约** | `surface-补 v1.1` | store 70+ hits 是数据访问主路径,P4 store 拆解保留;**surface v1.0 加 store accessor API** |
| G-001d `externalElements` | 2 | **承认契约** | `surface-补 v1.1` | DOM ref 必须可达;**surface v1.0 加 DOM accessor** |
| G-001e `mouseDown` | 1 | **主动放弃** | `主动放弃` | mouse state 内部细节,P4 不暴露 |
| G-001f `showInput()` | 1 | **主动放弃** | `主动放弃` | 不通过 facade,P4/P7 卫星重写改 facade |

**裁决统计**:3 承认契约(sub-A/C/D)+ 3 主动放弃(sub-B/E/F)。

**P1 spike surface v1.0 修订具体输入**(从 G-001 裁决浮现):

- **sub-A `render()`** → 已是 facade-delegate(canvas.render 在 surface)
- **sub-C `store.X`(70+ hits)** → surface v1.0 **加 store accessor API**(读 store.options / store.data.scale / store.emitter 等)
- **sub-D `externalElements`** → surface v1.0 **加 DOM accessor**(LightningChart 需 `parentElement.appendChild(div)` 等 DOM 操作)

**P4/P7 处置(主动放弃 3 条)**:

- **sub-B `parent.X`**:radio.ts:15 `parent.active([pen])` / table.ts:203 `parent.pushChildren` / 等 ~15 hits → P4 拆 canvas 移除 parent chain;P7 卫星重写改 Meta2d facade 直接调
- **sub-E `mouseDown`**:slider.ts:170 `if (pen.calculative.canvas.mouseDown)` 1 hit → P4 不暴露 mouse state;P7 卫星走 events/gesture 接口
- **sub-F `showInput()`**:table.ts:289 `pen.calculative.canvas.showInput(pen, rect, '#ffffff')` 1 hit → P4 不暴露;P7 卫星改 Meta2d facade

**11h 队列重新计**(下方"队列状态"段更新)。

---

## G-002 — V2 端 `m` 单字符缩写命名规范

**类型**:命名规范(P3 V2 切换准备)

**标签**:**`推迟到下一 phase`**(D-P0-18 第四类)

**3 条强制附属**:

- **推迟理由**:Δ2.3 D-P0-21 dual-pattern verify 发现 V2 端 2 处 `m.<X>` 形态(Meta2d 实例缩写),broad pattern 命中但 strict receiver list (`meta2d|m2d|engine`) 未命中。`m` 单字符 receiver false positive 风险高(任何 `m.X` 模式),不加 v2ReceiverList。但记录免得 P3 V2 切换时遗忘命名规范统一。
- **触发恢复条件**:P3 V2 切换准备阶段,review 卫星 / V2 端 命名规范统一(避免 `m` 单字符 → 改 `meta2d` / `m2d`)。
- **裁决最晚时间点**:P3 V2 切换准备完成前。

**P0 阶段不解决,P3 时 close loop**。

---

## G-003 — V1 ruler clear utility

**类型**:V1 method gap

**最终标签**(2026-05-02 D-P0-29 user verdict):**`主动放弃`**

**推荐理由**:V1 内部 grid ruler 清理 utility,V2/卫星 0 hits;P4 拆解后 surface 不需暴露此 utility。

**V1 形态**:`canvas.clearRuleLines`

**11g 引用**:line 32(canvas pub #2,C 类)

**P1 spike 处置**(主动放弃):surface 不加 — V2 也不依赖;P4 拆解后此 utility 内部使用即可

**user verdict 状态**(2026-05-02 D-P0-29):✅ 同意推荐(主动放弃)/ ☐ 改 surface-补 v1.1 / ☐ 改其他

---

## G-004 — V1 history transaction begin/end markers (pushHistory)

**类型**:V1 method gap

**最终标签**(2026-05-02 D-P0-29 user verdict):**`主动放弃`**

**推荐理由**:V1 显式 `pushHistory(action)` 让 caller 控制 history unit 边界(命令式);surface v1.0 走 `transaction(name, fn)` 自动 begin/end(声明式),语义等价但形态不同。如 V2 业务层无"细粒度 history unit 拼装"需求,transaction 已 cover。

**V1 形态**:`canvas.pushHistory` / `core.pushHistory`

**surface v1.0 等价**:`transaction(name, fn)` — 自动 begin/end

**11g 引用**:line 42(canvas pub #12,C 类)

**P1 spike 处置**(主动放弃):surface 不加显式 begin/end markers — `transaction(name, fn)` 已 cover

**user 裁决问题**:V2 业务层是否需"细粒度 history unit 手动拼装"(transaction 之外)?

**user verdict 状态**(2026-05-02 D-P0-29):✅ 同意推荐(主动放弃)/ ☐ 改 surface-补 v1.1(补 begin/end markers)/ ☐ 改其他

---

## G-005 — V1 history navigation undo/redo

**类型**:V1 method gap

**最终标签**(2026-05-02 D-P0-29 user verdict):**`surface-补 v1.1`**

**推荐理由**:V1 method `undo()` / `redo()` 是 V2 业务层(toolbar / shortcut)直接调用的 history 控制 API。Surface v1.0 没显式 undo/redo accessor — 只有 `transaction:rolled-back` event 不够。V2 期望 surface 暴露 `meta2d.history.undo()` / `.redo()` 等直接调用形态。

**V1 形态**:`canvas.undo` / `canvas.redo` / `core.undo` / `core.redo` + 11f §History EditTypes

**P1 spike 处置**(surface-补 v1.1):surface 加 history accessor —
- `meta2d.history.undo()` / `.redo()`
- `meta2d.history.canUndo()` / `.canRedo()`(状态查询)
- `meta2d.history.clear()`(清空 history)
- `meta2d.history.size`(可选)

**11g 引用**:line 43-44(canvas pub #13/14,C ×2)+ line 326(history undo/redo C ×2)

**user verdict 状态**(2026-05-02 D-P0-29):✅ 同意推荐(surface-补 v1.1)/ ☐ 改主动放弃(V2 走 transaction:rolled-back event)/ ☐ 改其他

---

## G-006 — V1 clipboard operations copy/cut/paste(method + events + drop)

**类型**:V1 method + event gap

**最终标签**(2026-05-02 D-P0-29 user verdict — **改推荐**):**`主动放弃`**

**推荐曾标 `surface-补 v1.1`(D-P0-29 推荐),user verdict 改 `主动放弃`** — user 工程判断 :

1. **clipboard 是业务层逻辑,不是 diagram 抽象** — V1 god-class 反模式(把 clipboard 内置到 canvas 全局 mouseup handler 触发,通过 selection 的 clone/serialize/deserialize 实现)
2. **surface v1.0 设计哲学**:diagram 操作 + 业务层组合;不集中 cross-cutting concern
3. **surface v1.0 已有足够操作**:`selection.get` + `pens.duplicate` + `pens.add` 组合可实现 clipboard 业务逻辑
4. **V2 业务层自实现优势**:跨实例 / 跨标签页 / 序列化格式选择(JSON / SVG / 自定义)的灵活性

**V1 形态**(留作 P3/P4 audit 引用,V2/卫星不消费):
- methods:`canvas.copy` / `canvas.cut` / `canvas.paste`(3 — V1 god-class 内置)
- events:E028 copy / E029 cut / E030 paste / E031 drop(4 — V1 全局 mouseup handler 触发)

**P1 spike 处置**(主动放弃):surface 不加 clipboard accessor / events;V2 业务层用现有 surface API 组合实现 clipboard 自管(参见上述 #3)

**11g 引用**:line 52-54(canvas pub #22-24,C ×3)+ line 302(emits 11 含 copy/cut/paste/drop)

**P3/P4 处置**:V2 切换时 V2 业务层自管 clipboard;V1 内置 copy/cut/paste 机制不重建

---

## G-007 — V1 image export(toPng / activeToPng / pensToPng)

**类型**:V1 method gap

**最终标签**(2026-05-02 D-P0-29 user verdict):**`surface-补 v1.1`**

**推荐理由**:V1 method `toPng()` / `activeToPng()` / `pensToPng(pens)` 是 V2 业务层(导出图片功能 / 缩略图生成 / 截图)直接调用。Surface v1.0 没 export API。V2 业务层期望 surface 暴露图片导出。

**V1 形态**:
- `canvas.toPng` / `canvas.activeToPng` / `canvas.pensToPng`(3)
- `core.toPng`(1 — facade-delegate)

**P1 spike 处置**(surface-补 v1.1):surface 加 export accessor —
- `meta2d.export.toPng(options?: { bounds?, dpi?, scale? })` — 全图
- `meta2d.export.toPng({ pens })` — 指定 subset
- `meta2d.export.toPng({ active: true })` — 当前选中 subset
- 可选扩展:`meta2d.export.toSvg / toPdf / toJson`(P1 spike 决定)

**11g 引用**:line 63-65(canvas pub #33-35,C ×3)+ line 205(core M18,C)

**user verdict 状态**(2026-05-02 D-P0-29):✅ 同意推荐(surface-补 v1.1)/ ☐ 改主动放弃(V2 自实现导出)/ ☐ 改其他

---

## G-008 — V1 inline input editor showInput/hideInput(method + events)

**类型**:V1 method + event gap(facade-bypass — 同 G-001f)

**最终标签**(2026-05-02 D-P0-29 user verdict):**`主动放弃`**

**推荐理由**:V1 method `showInput` / `hideInput` 是 form-diagram / table 卫星包内部 inline edit 实现,通过 `pen.calculative.canvas.showInput()` 直接调用 — **G-001f 已主动放弃 facade-bypass**。Surface v1.0 不暴露;P7 卫星重写时实现自有 inline edit 机制。同时 events `clickInput` / `input` 是 inline editor 内部状态,V2 业务层有自己的 form / input handling,不期望直接监听。

**V1 形态**:
- methods:`canvas.showInput` / `canvas.hideInput`(2 — facade-bypass via G-001f)
- events:E025 clickInput / E026 input(2)

**P1 spike 处置**(主动放弃):surface 不暴露;P7 卫星重写时实现自有 inline edit 机制(form-diagram / table)

**11g 引用**:line 82-83(canvas pub #52-53,C ×2 已与 G-001f facade-bypass 关联)+ line 302 emits clickInput/input

**Cross-ref**:G-001f(showInput facade-bypass 主动放弃)+ G-013(input events 主动放弃)

**user verdict 状态**(2026-05-02 D-P0-29):✅ 同意推荐(主动放弃)/ ☐ 改 surface-补 v1.1(暴露 inline input API)/ ☐ 改其他

---

## G-009 — V1 utility canvas clear-all

**类型**:V1 method gap

**最终标签**(2026-05-02 D-P0-29 user verdict):**`surface-补 v1.1`**

**推荐理由**:V1 method `clearCanvas()` 让 V2 一次性清空当前画布所有 pen / 历史 / 状态。Surface v1.0 没显式 clear-all API(`meta2d.loadModel(emptyModel)` 等价但语义不直接,且不 reset history)。V2 业务层(新建文档 / 重置)期望直接 clear。

**V1 形态**:`canvas.clearCanvas`

**P1 spike 处置**(surface-补 v1.1):surface 加 `meta2d.clear()` 或 `meta2d.reset()` 显式 API —
- 清空 pens / connections / groups
- reset history(可选 option)
- 保留 viewport / theme / extensions(可选 option)

**11g 引用**:line 100(canvas pub-ish #55,C 类)

**user verdict 状态**(2026-05-02 D-P0-29):✅ 同意推荐(surface-补 v1.1)/ ☐ 改主动放弃(V2 走 loadModel emptyModel)/ ☐ 改其他

---

## G-010 — V1 DOM accessor canvas/width/height(扩 G-001d)

**类型**:V1 property gap

**最终标签**(2026-05-02 D-P0-29 user verdict):**`surface-补 v1.1`**

**推荐理由**:V1 直接 access `canvas.canvas`(HTMLCanvasElement)/ `canvas.width` / `canvas.height` 让 V2 业务层(自定义渲染叠加 / 截图 / 与外部 lib 集成 ChartJS / etc)直接拿 DOM ref + 尺寸。**G-001d 已识别 externalElements 加 DOM accessor**,但 canvas + dimensions 部分需扩展。

**V1 形态**:
- `canvas.canvas`(HTMLCanvasElement ref)
- `canvas.width` / `canvas.height`(数值 dimensions)

**P1 spike 处置**(surface-补 v1.1,与 G-001d 协同扩展):surface 加 DOM accessor —
- `meta2d.dom.canvas`(HTMLCanvasElement;G-001d 已加 externalElements;此条扩 main canvas)
- `meta2d.dom.width` / `meta2d.dom.height`(viewport dimensions)
- `meta2d.dom.parentElement`(container ref;部分卫星需要)

**11g 引用**:line 121-123(canvas pub-ish #76-78,C ×3)+ G-001d externalElements

**Cross-ref**:G-001d(DOM accessor 已 surface-补 v1.1;此条扩展)

**user verdict 状态**(2026-05-02 D-P0-29):✅ 同意推荐(surface-补 v1.1 扩展 G-001d)/ ☐ 改主动放弃(V2 走 mount 时 own DOM)/ ☐ 改其他

---

## G-011 — V1 perf hints markDirty/markAllDirty

**类型**:V1 method gap(perf 关键)

**最终标签**(2026-05-02 D-P0-29 user verdict):**`surface-补 v1.1`**

**推荐理由**:V1 method `markDirty(pen)` / `markAllDirty()` 是 V2 性能优化关键 hint 路径。Day 53 `dirtyPenRender` flip ✅ 后,V2 显式控制 dirty range 避免全量 render(性能基线 +10-20× 关键)。Surface v1.0 走"render.request 自动 dirty tracking" — 但 V2 期望显式 hint API(明确告知 surface 哪些 pen 需要 redraw,跳过全量 dirty pass)。

**V1 形态**:`canvas.markDirty(pen | rect)` / `canvas.markAllDirty()`

**P1 spike 处置**(surface-补 v1.1):surface 加 perf hint accessor —
- `meta2d.perf.markDirty(pen | rect | bounds)`
- `meta2d.perf.markAllDirty()`
- `meta2d.perf.scheduleRender(opts?: { priority? })`(可选)
- 设计要点:hint 是 advisory,实际 render strategy(immediate / batched / coalesced)留给 surface 实现

**11g 引用**:line 161-162(canvas pub-ish #115-116,C ×2)

**Day 53 perf 路径关联**:dirtyPenRender flip ✅ 是 V2 perf 基线,此 surface API 是 P3 V2 切换后保留 perf 优势的必要条件

**user verdict 状态**(2026-05-02 D-P0-29):✅ 同意推荐(surface-补 v1.1)/ ☐ 改主动放弃(V2 接受全量 render 性能损失)/ ☐ 改其他

---

## G-012 — V1 raw mouse events(mousedown/mouseup/click/dblclick/contextmenu)

**类型**:V1 event gap

**最终标签**(2026-05-02 D-P0-29 user verdict — 选选项 b):**`主动放弃`**

**推荐曾标 `需 user 裁决`(单条二选一 a/b),user verdict 选选项 b `主动放弃`** — user 工程判断:

1. **god-class 反模式**:把所有 input handling 集中在 diagram API 是 V1 god-class 反模式(canvas 9828 LOC 大头之一)
2. **DOM listener 更灵活**:V2 业务层通过 G-010 `meta2d.dom.canvas` 暴露的 DOM ref 直接 `addEventListener` — 支持 pointer events / touch events / custom gestures(surface 抽象 events 反而限制)
3. **surface v1.0 已有抽象 events 够用**:`selection:*` / `hover:*` / `pen:*` 已 cover 业务层 mouse interaction 需求(右键菜单 / 双击编辑 等)— raw mouse 是 fallback 路径,走 DOM
4. **设计哲学一致**:与 G-006 clipboard 主动放弃同一原则(diagram 抽象 + 业务层组合,不集中 cross-cutting concern)

**V1 形态**(留作 P3/P4 audit 引用):
- E020 `mousedown` / E021 `mouseup` / E022 `click` / E023 `dblclick` / E024 `contextmenu`(5)

**P1 spike 处置**(主动放弃 — 选项 b):surface 不加 raw mouse events;V2 通过 G-010 `meta2d.dom.canvas` 直接 `addEventListener('mousedown', ...)` 等

**11g 引用**:line 302(emits 11 中的 5 mouse events,C ×5)

**P3/P4 处置**:V2 切换时 V2 业务层 listen DOM container raw events;surface 不集中 mouse handling

---

## G-013 — V1 input events clickInput/input(随 G-008 主动放弃)

**类型**:V1 event gap

**最终标签**(2026-05-02 D-P0-29 user verdict):**`主动放弃`**

**推荐理由**:V1 emits `clickInput` / `input` 是 inline edit 内部状态变更 events,V2 业务层不期望直接监听(V2 业务层有自己的 form / input handling 走 React form 抽象)。**随 G-008(showInput/hideInput 主动放弃)一并放弃**。

**V1 形态**:E025 `clickInput` / E026 `input`(2)

**P1 spike 处置**(主动放弃):surface 不暴露;P7 卫星重写后 input editing 走业务层自有机制(React form / shadcn input / etc)

**11g 引用**:line 302(emits 中的 input events,C ×2)

**Cross-ref**:G-008(showInput/hideInput 主动放弃)+ G-001f(showInput facade-bypass 主动放弃)

**user verdict 状态**(2026-05-02 D-P0-29):✅ 同意推荐(主动放弃随 G-008)/ ☐ 改 surface-补 v1.1 / ☐ 改其他

---

## 队列状态(2026-05-02 D-P0-29 user verdict 落地)

- 总条目:**18**(G-001 6 sub-form + G-002 + G-003..G-013 共 11 新条)

**全部 user 显式裁决,P0 收口前最终标签全落地**:

- **`surface-补 v1.1`**:**8**(P1 spike 修订队列 — surface v1.0 → v1.1 必加项)
  - 3 旧(G-001a render / G-001c store / G-001d externalElements)
  - 5 新(G-005 history undo/redo / G-007 image export / G-009 clearCanvas / G-010 DOM accessor 扩 G-001d / G-011 perf hints)
- **`主动放弃`**:**9**(P4/P7 不重建,V2 业务层自管或 P7 卫星重写)
  - 3 旧(G-001b parent / G-001e mouseDown / G-001f showInput)
  - 6 新(G-003 clearRuleLines / G-004 pushHistory / G-006 clipboard / G-008 inline input / G-012 raw mouse / G-013 input events)
- **`推迟到下一 phase`**(D-P0-18):**1**(G-002 `m` 缩写;P3 V2 切换准备时 close)
- **`需 user 裁决`(类目)— 待决**:**0**

**P0 退出门槛 5 状态**:✅ **通过**(队列零条 `需 user 裁决` 待决;11 新条 G-XXX 全部 P0 收口前 user verdict 落地最终标签)

**G-006 / G-012 推荐 vs verdict 对照**(user 工程判断):

| G-XXX | 推荐 | verdict | user 工程判断 |
|---|---|---|---|
| G-006 clipboard | surface-补 v1.1 | **主动放弃** | clipboard 是业务层逻辑 ≠ diagram 抽象;V1 god-class 反模式;V2 用 selection.get + pens.duplicate + pens.add 组合 |
| G-012 raw mouse | 需 user 裁决(a/b)| **主动放弃**(选项 b)| god-class 反模式;V2 走 G-010 DOM listener 更灵活;surface 抽象 events 已 cover |

**两条共同设计哲学**:**diagram 抽象 + 业务层组合,不集中 cross-cutting concern**(clipboard / mouse handling / input event 等都是业务层 concern)。

**对称约束反向应用第三次**(D-P0-29 — user verdict 落地后固化):

- v1 estimate:C 维度 3 条(G-001 已识别)
- v2 enumeration:C 维度 38 条(canvas 19 + core 3 + 11h 3 + impl 13)
- 信息充分时**必 P0 收口前裁决**,推迟是例外(D-P0-18)
- **模式固化**:每次 enumeration 完成 + 信息充分时,11h 队列必 P0 收口前裁决,推迟是例外。P1+ 整个 11-17 月项目都用此模式 — 每个 phase 期间出新数据让旧拍板信息不足时,user 必须 reconcile,不能默认推迟。

**P1 spike 启动 trigger**(D-P0-29 verdict 落地后):

- 11h `surface-补 v1.1` 队列 **8 条**(3 旧 + 5 新)— surface v1.0 → v1.1 必加项
- P1 spike 估时(原 6-8 周)实际可能为 7-9 周(8 条 surface 修订 + Reactive 三层 + extension register* + layers + instance + time + geometry 等 73 B 条)
- 11h `主动放弃` 队列 **9 条** — P4 拆解 / P7 卫星重写时 V2 业务层自管(clipboard / mouse handling / input editing / parent chain / mouseDown state / showInput method / clearRuleLines / pushHistory / showInput method 等)

**P0 → P1 桥工程价值最终落地**:11h 19 条 user 显式裁决(含 G-001 parent + 6 sub-form 共 7 + G-002 1 + 11 new = 19)是 P1 spike 实施者的明确输入材料。
