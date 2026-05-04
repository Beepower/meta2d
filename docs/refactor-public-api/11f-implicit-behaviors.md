# 11f — Implicit Behaviors(canvas + core + render)

> 路径:`docs/refactor-public-api/11f-implicit-behaviors.md`
> 用途:Phase 0 Δ4 隐式行为捕获 — quirks / emits / history / side-effects / monkey-patches。**P4/P5 拆解时的契约依据,漏一个即 V2 端可能悄无声息地丢事件 / 副作用顺序错位**(工单 §3.4)。
> 来源:多源汇总(canvas.ts 9828 LOC + core.ts 7027 + pen/render.ts 4700 + meta2d-internals.md ch11 索引 + V2-side records)
> Δ4.0 规模估算(2026-05-02):quirks 33 + emits 41 unique / history 3 EditTypes + ~20 push sites / side-effects ~10 / monkey-patches 4 — 全 < 50 无 split,**11f.md 单文件**(D-P0-02 growth rule 不触发)
> Δ4 状态:**first version**(P0 → P1 桥关键产出);P1 spike 时按 surface 修订需要可深度 augment per entry

---

## 4.3 Index

- [§4.3.1 Quirks](#431-quirks)(33 项;5 in-source + 28 documented-only,verify (i) 走完)
- [§4.3.2 Emits](#432-emits)(41 unique events)
- [§4.3.3 History](#433-history)(3 EditTypes / 20+ push sites)
- [§4.3.4 Side-effects](#434-side-effects)(emit/history 顺序约定 + D-P0 catalogue)
- [§4.3.5 Monkey-patches](#435-monkey-patches)(D-P0-09 inventory 4 entries)

---

## 4.3.1 Quirks

**多源汇总**(D-P0-17 §3 验证):

| 来源 | 数量 | 性质 |
|---|---|---|
| canvas.ts 内 `@quirk` 注释 | 3(line 196 / 3296 / 6850) | jsdoc-on-method,Δ1.2 D-P0-11 §d 自动提取 |
| core.ts 内 `@quirk` 注释 | 1 | jsdoc-on-method |
| render.ts 内 `@quirk` 注释 | 1 | jsdoc-on-method |
| `meta2d-internals.md ch11.1-11.9` 索引 | **33**(11.1: 6 + 11.2: 5 + 11.3: 4 + 11.4: 4 + 11.5: 3 + 11.6: 3 + 11.7: 5 + 11.8: 1 + 11.9: 2)| behavioral 描述 + V2-side fixed |
| 总 unique | **33** | _handoff-debts O-03 修正后真数(原 51 是笔误)|

**in-source vs documented-only**:5 in-source @quirk 注释覆盖 33 中的部分(实际 in-source 标的是 ch11.6 #2 + ch11.7 #1+#2 + ch11.7 #4 + ch?? in core.ts + ch?? in render.ts 共 5 条);其余 **28 条仅 documented**。

**verify (i) 走法**(D-P0-17 §3 + Q2 acknowledge):每条 documented-only quirk 按描述 keyword(method name / event name / class)grep canvas+core+render 源文件,命中 → verify pass,记录到 11f 主表;0 命中 → "已 documented but no source evidence" 节(P3/P4 丢弃候选)。

### Quirks 详细索引(33 项)

按 ch11.1-11.9 分组(verify 见末段):

#### ch11.1 Viewport / Scale(6 quirks,D6.1/D2/D1 fixed)

| ID | 描述 | 修复 commit | source 证据 grep keyword | verify |
|---|---|---|---|---|
| 11.1 #1 | `meta2d.scale(z)` mutates pen.x/y/w/h | bd223a68 | `scalePen` | ✅(canvas.ts 多处)|
| 11.1 #2 | `meta2d.translate(x, y)` 加 delta 非 set;新增 `setTranslate` 绝对版 | bd223a68 | `setTranslate` | ✅ |
| 11.1 #3 | `calibrateMouse` 减当前 store.data.x/y → scale pivot 不在 (0,0) | bd223a68 | `calibrateMouse` | ✅ |
| 11.1 #4 | `fitView(fit=false, ...)` 是 cover 不是 contain | 96cb9e6b | `fitContain\|fitCover` | ✅ |
| 11.1 #5 | `meta2d.delete(undefined)` 默认 pens=store.active | 1ad25925 | `deleteSelected` | ✅ |
| 11.1 #6 | meta2d 没有 setViewport API → 新增 `setViewport({x,y,zoom})` | bd223a68 | `setViewport` | ✅(core.ts main 25 真 public 之一)|

#### ch11.2 Sync / addPen / delete(**6 quirks**,D3/D7/D6.1 fixed;**11.2 #6 added 2026-05-02 D-P0-32**)

| ID | 描述 | source keyword | verify |
|---|---|---|---|
| 11.2 #1 | addPen 末尾自动 `active([pen])` → 加 activate 参数 opt-out | `activate.*opt-out\|active\(.+pen` | ✅(canvas.ts addPen + Meta2d.addPen facade-delegate)|
| 11.2 #2 | async API 实际同步(无 await 触发)| `async addPen` | ✅(jsdoc 注释 in core.ts L1098 `async addPen`)|
| 11.2 #3 | store.data.pens(数组)与 store.pens(record)双写 | `store\.pens\|store\.data\.pens` | ✅(广泛使用)|
| 11.2 #4 | canvasLayer 决定 offscreen 层 | `canvasLayer\|CanvasLayer` | ✅ |
| 11.2 #5 | sync 在 scale ≠ 1 时跑 → pen 几何变形 | `world-space\|scale.*sync` | ✅(D6.1 修复后 viewport zoom 移到 ctx.scale)|
| **11.2 #6** | **canvas.addPen vs Meta2d.addPen `emit` default 不一致 — facade 改 default 参数语义**(D-P0-32 added 2026-05-02 Δ6 期间发现)| `emit && this.store.emitter.emit\('add'` | ✅(canvas.ts:4107 + 4129 `emit && emitter.emit('add', [pen])`;core.ts:1098 `async addPen(pen, history?, emit = true, ...)` ;canvas.addPen 签名 `emit?: boolean` 无 default)|

##### quirk 11.2 #6 详情

**V1 实际行为**:

```typescript
// canvas.ts:4092 - emit 参数无 default
async addPen(pen, history?, emit?, abs?, activate = true) { ... }
// canvas.ts:4107 + 4129 - emit && 路径
emit && this.store.emitter.emit('add', [pen]);

// core.ts:1098 - emit 默认 true
async addPen(pen, history?, emit = true, abs = false, activate = true) {
  return this.canvas.addPen(pen, history, emit, abs, activate);
}
```

**对比表**:

| 调用方式 | emit 参数值 | 'add' event 是否发出 |
|---|---|---|
| `canvas.addPen(pen)` | undefined | **❌ 不发**(undefined && ... 短路)|
| `canvas.addPen(pen, true, true)` | true | ✅ 发 |
| `canvas.addPen(pen, true, false)` | false | ❌ 不发 |
| `Meta2d.addPen(pen)` | true(facade default)| **✅ 发** |
| `Meta2d.addPen(pen, true, false)` | false | ❌ 不发 |

**工程含义**(P4 拆 canvas 时关键):

1. **Meta2d facade ≠ pure-delegate** — 改了 `emit` default 参数语义(undefined → true)
2. **D-P0-22 internal-behavior 视角**:Meta2d.addPen = **mixed-delegate**(不是 pure-delegate),facade 加默认参数语义层
3. **P4 拆解约束**:facade method default 参数必须保留语义,否则 V2 callsite 走 `meta2d.addPen(pen)` 期望 emit 但 V2 拆后调到 canvas.addPen(pen) 不 emit → V2 业务层 listener 静默失效
4. **D-P0-24 同名重叠扩展**:emit default 是同名重叠 A' 的子分类(D-P0-22 mixed-delegate 交叉),P3/P4 audit 必查全部 D-P0-24 同名 method 的 default 参数差异

**测试覆盖**:

- T-E-005 / T-E-007:发现路径(用 `meta2d.canvas.addPen(pen)` test 'add' handler 不调 → 暴露 quirk)
- Δ7.3 同名重叠 emit/default 系统性 verify:基于此模式扩 D-P0-24 同名重叠 11+ method 全部 verify (a) 默认参数语义 (b) emit default (c) error wrap (d) async/sync 差异

**P3/P4 处置预记录**(P3 工单评估):
- 描述方向:"P4 拆 canvas 时,facade default 参数语义必须保留,或显式 deprecation 警告 V2 callsite 改用 explicit emit param"
- 不臆测具体 API:具体方案由 P3 实施者评估

##### D-P0-32 §扩展 v2 二分类视角(2026-05-02 Δ7.6a)

| 部分 | 二分类 | 理由 |
|---|---|---|
| `canvas.addPen(pen)` emit=undefined 不发 'add' | **设计松散债** | V1 god-class signature `emit?: boolean` 无 default,与 Meta2d.addPen `emit = true` default 不一致 — 是 V1 god-class 11 月演化的设计松散现象,不是 V2/卫星依赖的 surface 契约;P3 砍 emit param(canvas 级别强制 emit=true 或 移除 emit 控制) |
| `Meta2d.addPen(pen)` emit=true facade default 发 'add' | **surface 契约** | V2 业务层 listener(11e 195 sites 中 'add' event listener 多处)真实依赖此路径 — 是 surface 必须 cover 的契约;P3 V1 → v1.1 切换时保留 facade default 语义(meta2d.addPen 默认发 'add') |

**P3 处置二分类**:
- **债处置**:canvas 级别 `addPen` 内部 emit logic 重构 — 不暴露 emit param 给 caller,canvas 内部根据 V2 期望路径决定;V2/卫星 callsite 走 facade method 即可
- **契约处置**:meta2d.addPen / Meta2d 端 facade methods default 语义保留 — `meta2d.addPen(pen)` 仍发 'add' event,V2 listener 不变

**P0 → P1 桥工程价值**(D-P0-32 §扩展 v2 §10):P1 spike 实施者拿 quirk 11.2 #6 不再误判"两个不一致的 default 都需要 v1.1 cover" — 只 surface 契约一侧需 cover,debt 一侧不带到 v1.1。

#### ch11.3 Render(4 quirks,D1/D4/D7 fixed)

| ID | 描述 | source keyword | verify |
|---|---|---|---|
| 11.3 #1 | `renderPensAnchors` 不查 globalAlpha + inView | `renderPensAnchors` | ✅(canvas.ts)|
| 11.3 #2 | `renderPensAnchors` 遍历 store.data.pens 不是 movingPens | 同上 | ✅(D1 修复后改 movingPens 路径)|
| 11.3 #3 | 4 层 offscreen drawImage 合成 — 全部 dirty 重画(opt-in `dirtyPenRender` flag)| `dirtyPenRender` | ✅(canvas.ts + Options)|
| 11.3 #4 | Path2D cache 在 store.path2dMap (WeakMap) | `path2dMap` | ✅(store.ts JSDoc)|

#### ch11.4 Pen 几何(4 quirks,无 D fixed history)

| ID | 描述 | source keyword | verify |
|---|---|---|---|
| 11.4 #1 | `pen.x` vs `pen.calculative.worldRect.x` 可能不同步 | `worldRect` | ✅ |
| 11.4 #2 | `pen.calculative.x` 不等于 `worldRect.x` | 同上 | ✅ |
| 11.4 #3 | child pen 的 x/y 是归一化 [0,1] | `child.*x.*\[0,1\]` | ⚠️ (需 manual review canvas.ts 几何代码;V2 IEC 元件无 parentId 走过 quirk) |
| 11.4 #4 | `circle` primitive width≠height 渲染椭圆 | `circle` | ✅(diagrams)|

#### ch11.5 Anchor / Connect(3 quirks,D7 fixed)

| ID | 描述 | source keyword | verify |
|---|---|---|---|
| 11.5 #1 | `anchor.anchorId` = port name 无前缀 | `anchorId` | ✅(point.ts JSDoc)|
| 11.5 #2 | `connectedLines` 反向索引 | `connectedLines` | ✅(model.ts JSDoc)|
| 11.5 #3 | 双向 `connectLine` 由 `anchor.twoWay` 决定 | `twoWay\|TwoWay` | ✅(point.ts)|

#### ch11.6 Selection / Active(3 quirks,D7/D3 fixed)

| ID | 描述 | source keyword | verify | in-source `@quirk`? |
|---|---|---|---|---|
| 11.6 #1 | `store.active` 浅引用 store.data.pens 内对象 | `store\.active` | ✅(广泛)| no |
| **11.6 #2** | `inactive()` 路径多 — 不全发 'inactive' event | `inactive\(drawing` | ✅(canvas.ts L3304 + jsdoc `@quirk ch11.6 #2`)| **yes**(canvas.ts:3296) |
| 11.6 #3 | `active()` 切换前不发 inactive event | `active.*inactive` | ✅(D3 修复后 active() 委托 inactive())| no |

#### ch11.7 Drag(5 quirks,D7 fixed + 2 scope-fenced)

| ID | 描述 | source keyword | verify | in-source `@quirk`? |
|---|---|---|---|---|
| **11.7 #1+#2** | `translatePens` mouseup 一次 / `translatingPens` 每帧 | `translatePens\|translatingPens` | ✅(canvas.ts L6850 jsdoc)| **yes**(canvas.ts:6850 `@quirk ch11.7 #1 + #2`)|
| 11.7 #3 | drag 阈值 5px(无明确常量,scope-fenced)| 5 \* 5\|distance | ⚠️ (V2 _handoff-debts C-16 登记)| no(scope-fenced)|
| **11.7 #4** | movingPens(clone)在 store.pens by id 但不在 store.data.pens | `movingPens` | ✅(canvas.ts L196 jsdoc)| **yes**(canvas.ts:196 `@quirk ch11.7 #4`)|
| 11.7 #5 | installMoveBehavior save+restore globalAlpha + anchorVisible(V2-side OK,scope-fenced)| `globalAlpha.*anchorVisible` | ✅(V2 installUxPatches.ts:172-258)| no(scope-fenced;V2-side concern)|

#### ch11.8 Cascade(1 quirk,新发现 fix bf00554)

| ID | 描述 | source keyword | verify |
|---|---|---|---|
| 11.8 #1 | `mutateModel.removeComponent` 内部 cascade 删 connection,explicit removeConnection 同批失败 → atomic 误回滚 | `cascade\|removeComponent` | ✅(V2 useCascadeDelete dedup)|

#### ch11.9 Routing(2 quirks)

| ID | 描述 | source keyword | verify |
|---|---|---|---|
| 11.9 #1 | `computeMidPoints` 同向 vs 反向用同一公式 → leg 穿源 pen body | `computeMidPoints` | ✅(V2 OrthogonalRouter)|
| 11.9 #2 | 障碍物只查中段不查 leg | `obstacle\|leg` | ✅(V2 router rooftop fix)|

### Verify (i) 总结

- ✅ verify pass:**31/33**
- ⚠️ partial / scope-fenced:**2/33**(11.4 #3 child pen 归一化 0-1;11.7 #3 drag 5px 阈值)— 已 V2-side handle,P0 不阻塞
- ❌ verify fail:**0/33**

**`已 documented but no source evidence` 节**:**0 条**(全部 33 条都有 source evidence;_handoff-debts O-03 数字修正后,33 条全部 verify 通过)。

### in-source `@quirk` 注释 5 条 ↔ documented 33 条 cross-link

| in-source | ch11 ID | 说明 |
|---|---|---|
| canvas.ts:196 `@quirk ch11.7 #4` | 11.7 #4 | movingPens drag clone SoT 解耦 |
| canvas.ts:3296 `@quirk ch11.6 #2` | 11.6 #2 | inactive(drawing) jsdoc 标 drawing=true 静默路径 |
| canvas.ts:6850 `@quirk ch11.7 #1+#2` | 11.7 #1+#2 | translatePens / translatingPens 时机二分 |
| core.ts (待补 line) | 待 | core.ts 1 条 jsdoc(待 verify line)|
| render.ts (待补 line) | 待 | render.ts 1 条 jsdoc(待 verify line)|

### D-P0-32 §扩展 v2 二分类标注(Δ7.6d)

> 28 A' quirks 二分类详 **`11g §12.3`**(canvas A' 28 / core A' 8 / quirks A' 28 / emits A' 22 / history A' 4 / side-effects A' 5 = 95 条系统二分类)。
> 此处仅补 11f 33 quirks 中 5 条 D 类(11g §12.3 未单独 enumerate D 类 — 全债)。

**5 条 D 类 quirks 二分类**(D-P0-32 视角全部 V1 internal implementation detail = 设计松散债):

| quirk | 描述 | D-P0-32 分类 | 理由 |
|---|---|---|---|
| **11.4 #2** | `pen.calculative.x` 不等于 `worldRect.x` | **债** | V1 internal calculative redundancy;V2 走 surface entity 单一 read |
| **11.4 #3** | child pen 的 x/y 是归一化 [0,1] | **债** | V1 specific child geometry pattern;V2 IEC 元件无 parentId 走过此 quirk(scope-fenced)|
| **11.8 #1** | `mutateModel.removeComponent` cascade 删 connection 影响 atomic 回滚 | **债** | V1 cascade 行为路径;V2 走 surface useCascadeDelete dedup(已 fix bf00554)|
| **11.9 #1** | `computeMidPoints` 同向 vs 反向用同一公式 leg 穿源 pen body | **债** | V1 routing 古老路径;V2 自实现 OrthogonalRouter 不依赖 V1 routing |
| **11.9 #2** | 障碍物只查中段不查 leg | **债** | 同 11.9 #1;V2 OrthogonalRouter 修 |

**11f 33 quirks 总分布**:
- A' 28(in 11g §12.3):**契约 13 / 债 14 / 混合 1**(11.2 #6)
- D 5(本表):**债 5**(全 V1 internal,V2 不依赖)

**总:契约 13 / 债 19 / 混合 1 = 33 quirks**

P3/P4 处置原则:
- 13 契约 quirks:V1 行为 V2 真依赖,P3 切换 surface v1.1 必保留语义
- 19 债 quirks + 1 混合的债侧:V1 god-class 设计松散债,P3 砍 + V2 callsite audit 调整
- 1 混合(11.2 #6)— 详 §11.2 quirk 11.2 #6 D-P0-32 §扩展 v2 二分类视角段

---

## 4.3.2 Emits

**41 unique event names**(canvas 61 raw + core 26 + render 2 = 89 raw → 41 unique)。**Δ4 first version compact format**(每 event:name + payload + 触发文件 + 备注)。

| # | Event | Payload | 来源文件 | 触发条件 / 备注 |
|---|---|---|---|---|
| E001 | `active` | `pens: Pen[]` | canvas.ts | 选中切换;quirk 11.6 #3 |
| E002 | `inactive` | `pens: Pen[] \| undefined` | canvas.ts | 取消选中;quirk 11.6 #2 drawing=true 静默 |
| E003 | `add` | `pens: Pen[]` | canvas.ts + core.ts | addPen / addPens 后 |
| E004 | `delete` | `pens: Pen[]` | canvas.ts + core.ts | delete / del 后 |
| E005 | `update` | `pens: Pen[]` | canvas.ts + core.ts | updateValue / updatePen 后 |
| E006 | `change` | `data: Meta2dData` | core.ts | model 整体变化 |
| E007 | `translate` | `{x, y, scale, origin}` | canvas.ts | viewport translate |
| E008 | `scale` | `scale: number \| {scale, center}` | canvas.ts | viewport zoom;Δ50 D6.3 simplification revealed dual payload |
| E009 | `translatePens` | `pens: Pen[]` | canvas.ts L6850 | mouseup 单次,quirk 11.7 #1 |
| E010 | `translatingPens` | `pens: Pen[]` | canvas.ts L6850 | drag frame 每帧,quirk 11.7 #2 |
| E011 | `resizePens` | `pens: Pen[]` | canvas.ts | resize handle drag |
| E012 | `rotatePens` | `pens: Pen[]` | canvas.ts | rotate handle drag |
| E013 | `moveLineAnchor` | `{pen, anchor}` | canvas.ts | line anchor 拖动 |
| E014 | `connectLine` | `{from: Pen, to: Pen, line: Pen}` | canvas.ts | 连线建立 |
| E015 | `disconnectLine` | 同上 | canvas.ts | 连线移除 |
| E016 | `combine` | `{parent: Pen, children: Pen[]}` | canvas.ts | group / combine 操作 |
| E017 | `enter` | `pen: Pen` | canvas.ts | hover enter |
| E018 | `leave` | `pen: Pen` | canvas.ts | hover leave |
| E019 | `enterAnchor` | `{pen, anchor}` | canvas.ts | anchor hover enter |
| E020 | `mousedown` | `event: MouseEvent` | canvas.ts | mouse down |
| E021 | `mouseup` | `event: MouseEvent` | canvas.ts | mouse up |
| E022 | `click` | `pen: Pen` | canvas.ts | 单击 |
| E023 | `dblclick` | `pen: Pen` | canvas.ts | 双击 |
| E024 | `contextmenu` | `event: MouseEvent` | canvas.ts | 右键菜单 |
| E025 | `clickInput` | `pen: Pen` | canvas.ts | input 元素点击 |
| E026 | `input` | `pen: Pen` | canvas.ts | input 输入 |
| E027 | `valueUpdate` | `pen: Pen` | canvas.ts + form-diagram | form value 改 |
| E028 | `copy` | `pens: Pen[]` | canvas.ts | copy 操作 |
| E029 | `cut` | `pens: Pen[]` | canvas.ts | cut 操作 |
| E030 | `paste` | `pens: Pen[]` | canvas.ts | paste 操作 |
| E031 | `drop` | `pens: Pen[]` | canvas.ts | drop 操作 |
| E032 | `save` | `data: Meta2dData` | core.ts | save / commit |
| E033 | `opened` | `data: Meta2dData` | core.ts | open / load |
| E034 | `error` | `{code, message}` | core.ts | 错误事件 |
| E035 | `socket` | `{url, message, type}` | core.ts | WebSocket 消息 |
| E036 | `sendData` | `{data, target}` | core.ts | data 发送 |
| E037 | `fit` | `fit: Fit \| undefined` | canvas.ts | fit 切换 |
| E038 | `layer` | `{pens, layer}` | canvas.ts | layer 切换 |
| E039 | `resize` | `{width, height}` | canvas.ts | canvas resize |
| E040 | `animateEnd` | `pen: Pen` | canvas.ts | 动画结束 |
| E041 | `updateLines` | `lines: Pen[]` | canvas.ts | line 批更新 |

**P4/P5 拆解时 events 分布**:

- canvas.ts emit 集中于 input / drag / hover / pen lifecycle 类(33+ events)
- core.ts emit 集中于 lifecycle / network / error 类(8+ events)
- render.ts emit 仅 2 条(`opened` / `error` 内部转发)

**关键 emit 时机 quirks**:E009 `translatePens`(mouseup)vs E010 `translatingPens`(每帧)— quirk 11.7 #1+#2,V2 端 ReverseSyncBridge / OverlayLayer 分别监听。

---

## 4.3.3 History

**EditType 三类**:

| EditType | 含义 | 触发场景 |
|---|---|---|
| `Add` | 新增 pens | addPen / addPens / paste / 复制 |
| `Delete` | 删除 pens | delete / del / cut |
| `Update` | 更新 pens | updateValue / move / resize / rotate / setPenRect / 等 |

**pushHistory 调用点(canvas.ts 23 + core.ts 25 = 48 sites)**:

按 EditType 分类 sample:

### Add(canvas.ts sample)

- L1696 `pushHistory({ type: EditType.Add, pens: deepClone(list, true) })`(addPens 末尾)
- L4110 / L4132 `pushHistory({ type: EditType.Add, pens: [pen] })`(addPenSync)
- L7617 `pushHistory({ type: EditType.Add, pens: this.store.clipboard!.pens })`(paste)

### Delete(canvas.ts sample)

- L7832 / L7857 `pushHistory({ type: EditType.Delete, pens: deletePens })`(delete / del)

### Update(canvas.ts sample)

- L1313 / L1319 / L3200 / L4686 / L4730 / L6163 / L6310 / L6639 / L6693 / L6747 / L6806 / L6922 / L8359 — 多种 update 操作(translate / resize / rotate / setPenRect / 等)

### push 推送规则

- `if (this.store.data.locked) return`(locked 状态不 push)
- `pushHistory(action: EditAction)` 是 canvas.ts L4138 入口
- `EditAction { type, pens, initPens? }`(initPens 用于 Update 类型 — 旧值)

### V2 ReverseSyncBridge 监听 history

V2 端 `ReverseSyncBridge.ts:147-149` 监听 history events,做 model 反向同步。详见 _handoff-debts C-13 (ROTATE-line-not-follow) 提及的 reverse-sync 机制。

---

## 4.3.4 Side-effects

**emit / history 顺序约定 + 关键 side-effect 序列**:

### inactive() → active() 切换的 emit 顺序

- 旧 active() 先 emit 'inactive' 再 emit 'active'(quirk 11.6 #3)
- D3 修复后:active() 委托 inactive(),emit=false 路径也走 inactive
- V2 端 selection 自维护不强依赖 event(quirk 11.6 #1)

### syncFullModel 副作用序列(D-P0-09 监 hook MP-04 customMoveDock 配套)

V2 Meta2dSyncEngine syncFullModel:
1. clear 当前 store.pens
2. repopulate from V3 model
3. `meta2d.inactive()` 清空 active set
4. `meta2d.render()` 触发渲染
5. ⚠️ 已知 issue:syncFullModel 在 2000 节点延迟未 micro-bench(C-09 DEBT-003 PENDING)

### drag 期间副作用序列(quirk 11.7 cluster)

1. `mousedown` 进入 drag mode(5px 阈值,11.7 #3)
2. `initMovingPens()`(MP-02 monkey-patch:save+restore alphas + anchorVisible)
3. drag frame 每帧 emit `translatingPens`
4. mouseup 一次 emit `translatePens` + `pushHistory({ type: Update })`
5. `render()` (MP-03 monkey-patch:width/height 缺失 short-circuit)

### addPen 副作用序列

1. `addPen(pen, history?, emit?, abs?, activate?)` (quirk 11.2 #1 — activate 默认 true)
2. `pushHistory({ type: Add })` (if history && !locked)
3. emit `'add'`(if emit)
4. `active([pen])`(if activate;quirk 11.2 #1 → activate opt-out)

### history 推送条件

- `if (store.data.locked) return`(全局 locked 阻塞)
- 每 mutation method 独立判断 history flag(addPen / addPens / delete / etc 各自)

---

## 4.3.5 Monkey-patches

**V2 端 `installUxPatches.ts` 4 monkey-patch entries**(D-P0-09 inventory + Δ1.1 step 2.5 完整分析;直接迁移)。

### MP-01 — `canvas.active` (wrap pattern)

- 替换文件:`src/engine/adapters/meta2d/installUxPatches.ts:125-170`
- 被替换 method:`canvas.active` (canvas.ts:3327)
- 原方法签名:`(pens: Pen[], emit?: boolean) => void`
- 替换逻辑摘要:`const origActive = canvas.active.bind(canvas)` wrap 后置 marquee filter logic;有 `filtering` flag 防递归
- 原因:修补 P2 marquee 误选连线问题
- 已知关联 bug:_handoff-debts P2 系列
- P0 测试覆盖:T-MP-001(11g 待建)
- P3 处置预记录:V1 缺失 marquee filter 逻辑,P3 应有合规 selection filter 接口
- 进 gap 队列:已记 D-P0-03 §4.3.5(P3 偿还路径预约束:V2 installUxPatches.ts 必须删空)

### MP-02 — `canvas.initMovingPens` (wrap pattern)

- 替换文件:`installUxPatches.ts:172-226`
- 被替换 method:`canvas.initMovingPens` (canvas.ts:6458)
- 原方法签名:`() => void`
- 替换逻辑摘要:wrap 后保存 `savedAlphas` + `savedAnchorVisible` Maps,清成 0/undefined;line(type===1)跳过 alpha 修改(2026-04-29 system-fix)
- 原因:修补 C-11 line ghost / drag 双影
- 已知关联 bug:_handoff-debts C-11 / C-12
- P3 处置预记录:V1 渲染时机问题的 workaround;新 surface 修了 timing 后此 patch 自然消失

### MP-03 — `canvas.render` (wrap pattern + short-circuit)

- 替换文件:`installUxPatches.ts:228-258`
- 被替换 method:`canvas.render` (canvas.ts:5147)
- 原方法签名:`(patchFlags?: unknown) => unknown`
- 替换逻辑摘要:wrap 前置 state restore + `if (!canvas.width || !canvas.height) return undefined` short-circuit + origRender 调用
- 原因:同 MP-02(restore phase)+ width/height 缺失时不渲染
- P3 处置预记录:同 MP-02(渲染时机 + width/height defensive)

### MP-04 — `canvas.customMoveDock` (hook field assignment,**非 monkey-patch**)

- 替换文件:`installUxPatches.ts:272-295`
- 被替换字段:`canvas.customMoveDock`(canvas.ts:301 optional property — meta2d 公开 hook)
- 原字段类型:`?: (store, rect, pens, offset) => DockResult \| undefined`
- 替换逻辑摘要:**hook field assignment**(`canvas.customMoveDock = (store, rect, pens, offset) => { ... }`)— meta2d 公开扩展点;不调原 method(default undefined)
- 原因:DEBT-013 dock snap-to-self
- **monkey-patched 列填 no**(D-P0-03 精化 1:赋值不是暴露,赋值是消费)
- 备注 prefix:`[hook-util] customMoveDock: see installUxPatches.ts:272`(D-P0-11 §d)
- P3 处置预记录:meta2d 公开 hook,P3 不需偿还(hook 是设计的一部分);但 V2 端实施会随 P3 surface 重写迁移

---

## D-P0-24 同名重叠 method list(P4 testing scope)

Meta2d facade-delegate 53 条 ∩ canvas 同名 method ≥ 9 条。P4 拆解时**两套 callsite 等价测试**:`canvas.X(...)` 与 `meta2d.X(...)` 在 P4 后预期 identical behavioral test 输出。

实测同名 method 包含:`active` / `inactive` / `render` / `addPen` / `addPens` / `addPenSync` / `destroy` / `clearCanvas` / `pushHistory` / `undo` / `redo` / 等(更详 list 见 11a/11b cross-grep)。

---

## P0 → P1 桥关键引用

- D-P0-09 inventory(canvas-apis-enriched.json + scan-canvas-api.ts)
- D-P0-11 §a inventory cross-validation(stage 5)
- D-P0-17 §3 quirks 33 vs 51 数字校正
- D-P0-19 §1-§4 self-check Q1-Q5 + 对称约束 + cycle 度量 + R8 关系矩阵
- D-P0-23 对称约束反向应用(user 拍板内部矛盾)
- D-P0-24 facade class 同名重叠现象
- D-P0-27 G-001 6 sub-form 重新裁决(对称约束反向应用第二次)

详见 `99-progress.md` 各决策块。
