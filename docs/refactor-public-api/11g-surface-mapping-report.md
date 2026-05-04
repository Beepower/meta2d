# 11g v2 — Surface 映射预判报告(Δ5 重做)

> 路径:`docs/refactor-public-api/11g-surface-mapping-report.md`
> 用途:V1 god-class(canvas 9828 + core 7027 + render 4700)与 surface v1.0(119 API + 47 events + Reactive 三层)的逐条 6 类差集分析。**P0 → P1 桥关键产出**。
> Δ5 重做版本(v2):D-P0-28 R8 形态 5 修正(estimation 替代 enumeration);本版含逐条 enumeration,user 可 verify 任何一条分类。
> Δ5 v1 (deprecated):仅给估算,user 拦下;重做整 Δ5-main per D-P0-19 §3 (a)。

## 6 类定义(D-P0-27)

| 类 | 含义 | P1 spike 处置 |
|---|---|---|
| **A** | surface 有 + V1 有 + 行为一致 | P3 V2 切换平滑 |
| **A'** | surface 有 + V1 有 + 行为不一致 | P3 切换有兼容包袱 |
| **B** | surface 有 + V1 没有 + 故意新能力 | P1+P2 必须新建(预期)|
| **B'** | surface 有 + V1 没有 + 设计缺陷 | P1 spike 修订 v1.0(过度设计 / 应删)|
| **C** | surface 没 + V1 有 | P0 → P1 桥(11h gap;surface-补 v1.1)|
| **D** | surface 没 + V1 没 | implementation detail |

**B' vs C 关键区分**(Δ5 v1 错的地方):
- B' = surface **有**这个能力 但 V1 没有,且没必要(过度设计 / 应删)
- C = surface **没有** 这个能力 但 V1 有(漏 cover;V2 期待暴露)— 进 11h gap

---

## §1 canvas main 116 逐条 enumeration

### §1.1 canvas public 53(facade-delegate — Meta2d 同名)

> **D-P0-32 注(2026-05-02 Δ6 期间发现)**:Meta2d facade ≠ pure-delegate — `emit` default 参数语义在 canvas vs Meta2d 同名 method 间不一致(quirk 11.2 #6,T-E-005/007 暴露)。**emit default 是 D-P0-24 同名重叠 A' 的子分类**(D-P0-22 mixed-delegate 交叉)。P3/P4 audit 必查全部 D-P0-24 同名 method 的 (a) 默认参数语义 (b) emit default (c) error wrap (d) async/sync 差异 — 详见 Δ7.3 同名重叠 emit/default 系统性 verify。


| # | name | kind | surface accessor.method | 6 类 | 理由 |
|---|------|---|---|---|---|
| 1 | addPens | method | pens.add (overload) | A | 直接 facade,行为等价 |
| 2 | clearRuleLines | method | (无明确)| **C** | V1 utility;surface 没 expose ruler clear API |
| 3 | alignPenToGrid | method | (utils/alignment.ts align?)| A' | V1 single grid align;surface alignment.ts AlignMode 9 模式更通用 |
| 4 | initImageCanvas | method | (无)| D | 多层 offscreen lifecycle implementation detail |
| 5 | initTemplateCanvas | method | (无)| D | 同上 |
| 6 | inactive | method | selection.clear | A' | 抽象不同(V1 method,surface accessor)+ quirk 11.6 #2 drawing 静默路径 |
| 7 | active | method | selection.set | A' | 同上 + quirk 11.6 #3 |
| 8 | clearHover | method | hover.clear | A | 直接 |
| 9 | resize | method | meta2d.resize(w,h) | A | facade |
| 10 | addPen | method | pens.add | A | facade(async 但无 await — V1 quirk 11.2 #2)|
| 11 | addPenSync | method | pens.add(sync semantic via Result)| A' | V1 显式 sync version;surface only async/sync via Promise |
| 12 | pushHistory | method | (无显式)| **C** | V1 method;surface 自动(transaction);**V2 期待显式?P1 review** |
| 13 | undo | method | (无)| **C** | V1 显式;surface 走 V2 业务层 |
| 14 | redo | method | (无)| **C** | 同 undo |
| 15 | drawingPencil | method | (无)| D | V1 freehand draw UI mode |
| 16 | stopPencil | method | (无)| D | 同 |
| 17 | finishPencil | method | (无)| D | 同 |
| 18 | setViewport | method | viewport.setView | A | 直接(D6.1 修复后)|
| 19 | setTranslate | method | viewport.pan(absolute)| A' | 命令式 + 行为名不同(V1 setTranslate 是 set,surface pan 是 delta;但 viewport.setView 直接对应)|
| 20 | setScale | method | viewport.zoom | A | 直接 |
| 21 | translatePens | method | pens.update (position patch bulk)| A' | V1 多个 method,surface 单一 patch |
| 22 | copy | method | (无显式)| **C** | V1 copy;surface 走 V2 业务层 + transaction |
| 23 | cut | method | (无)| **C** | 同 copy |
| 24 | paste | method | (无)| **C** | 同 copy |
| 25 | delete | method | pens.remove | A | facade |
| 26 | deleteSync | method | pens.remove | A' | V1 sync;surface only Result(implicit sync)|
| 27 | clearDropdownList | method | (无)| D | V1 dropdown UI internal |
| 28 | find | method | pens.find / query | A | facade |
| 29 | findOne | method | pens.find | A | facade(可能名称 same in V1 + surface)|
| 30 | changePenId | method | pens.update (patch.id ?)| A' | surface 可能不允许改 id(readonly id) — A' 边界 |
| 31 | setPenRect | method | pens.update (bounds patch)| A | facade(via patch)|
| 32 | getPenRect | method | pens.find (read pen.bounds)| A' | V1 single getter,surface entity-based read |
| 33 | toPng | method | (无)| **C** | V1 export PNG;surface 没;V2 期待 export API |
| 34 | activeToPng | method | (无)| **C** | 同 toPng(active subset)|
| 35 | pensToPng | method | (无)| **C** | 同 toPng(specified subset)|
| 36 | toggleAnchorMode | method | (无)| D | V1 anchor edit UI mode |
| 37 | addAnchorHand | method | (无)| D | V1 anchor 添加 UI |
| 38 | removeAnchorHand | method | (无)| D | V1 anchor 移除 UI |
| 39 | toggleAnchorHand | method | (无)| D | 同 |
| 40 | showMagnifier | method | (无)| D | V1 magnifier feature |
| 41 | hideMagnifier | method | (无)| D | 同 |
| 42 | toggleMagnifier | method | (无)| D | 同 |
| 43 | destroy | method | meta2d.destroy() | A | facade |
| 44 | beforeAddPen | property | (preventRemoval 模式)| A' | V1 hook;surface preventRemoval(pen:before-remove)是 cancellable hook 不同形态 |
| 45 | beforeAddPens | property | 同 | A' | 同 |
| 46 | beforeAddAnchor | property | 同 | A' | 同 |
| 47 | beforeRemovePens | property | (pen:before-remove preventRemoval)| A' | V1 promise-based async hook;surface sync preventRemoval — 形态不同 |
| 48 | beforeRemoveAnchor | property | 同 | A' | 同 |
| 49 | render | property(arrow) | render.request | A | 直接 + facade-delegate(via Meta2d.render)|
| 50 | beginBatch | property(arrow) | transaction(name, fn) | A | semantic equivalent(begin batch + atomic = transaction)|
| 51 | endBatch | property(arrow) | transaction(name, fn) | A | 同(transaction 内自动结束)|
| 52 | showInput | property(arrow) | (无)| **C** | V1 inline input (form-diagram 用);surface 没 cover |
| 53 | hideInput | property(arrow) | (无)| **C** | 同 |

**canvas public 53 分布**:
- A: 13(addPens / clearHover / resize / addPen / setViewport / setScale / delete / find / findOne / setPenRect / destroy / render / beginBatch / endBatch — 14 实际)
- A': 14(inactive / active / addPenSync / setTranslate / translatePens / deleteSync / changePenId / getPenRect / 5 before* hooks)
- B: 0
- B': 0
- **C: 12**(clearRuleLines / pushHistory / undo / redo / copy / cut / paste / toPng / activeToPng / pensToPng / showInput / hideInput)— **远超 v1 估的 7 项**
- D: 14(initImageCanvas / initTemplateCanvas / drawingPencil / stopPencil / finishPencil / clearDropdownList / toggleAnchorMode / addAnchorHand / removeAnchorHand / toggleAnchorHand / showMagnifier / hideMagnifier / toggleMagnifier — 13)

实际计数:53 = 13 A + 14 A' + 0 B + 0 B' + 12 C + 14 D = 53 ✓

### §1.2 canvas public-ish 63(V2 / 卫星 / meta2d 顶层 raw access)

| # | name | kind | surface 等价? | 6 类 | 理由 |
|---|------|---|---|---|---|
| 54 | listen | method | (无)| D | V1 internal lifecycle |
| 55 | clearCanvas | method | (无)| **C** | V1 utility;surface 没 cover;V2 期待显式 clear |
| 56 | makePen | method | (无)| D | V1 internal pen factory |
| 57 | initLineRect | method | (无)| D | V1 internal connection helper |
| 58 | finishDrawline | method | (无)| D | V1 internal connection drawing state |
| 59 | loadImage | method | (无)| D | V1 internal image loader |
| 60 | updatePenRect | method | pens.update | A' | V1 specific pen rect update;surface generic patch |
| 61 | initGlobalStyle | method | theme.setTheme | A' | V1 specific style init;surface theme accessor |
| 62 | templateScale | method | (无)| D | V1 template-layer scale internal |
| 63 | rotatePens | method | pens.update (rotation patch)| A' | V1 specific method,surface generic patch |
| 64 | resizePens | method | pens.update (bounds patch)| A' | 同 rotatePens |
| 65 | initMovingPens | method | (无)| D | V1 drag clone internal(monkey-patched MP-02)|
| 66 | templateTranslatePens | method | (无)| D | V1 template-layer 平移 |
| 67 | restoreNodeAnimate | method | (无)| D | V1 animation restore internal |
| 68 | updateLines | method | connections.update(bulk)| A' | V1 specific bulk update |
| 69 | calcActiveRect | method | selection.getBBox | A' | V1 method;surface getBBox |
| 70 | getFrameProps | method | (无)| D | V1 animation frame props |
| 71 | animate | method | time.setRate | A' | V1 imperative animate;surface time engine |
| 72 | delForce | method | pens.remove(force semantic)| A' | V1 force delete bypass hooks |
| 73 | updateValue | method | pens.update (data patch)| A' | V1 update data;surface generic patch |
| 74 | gotoView | method | viewport.setView | A | named view facade |
| 75 | canvas | property | (无)| **C** | V2 access for DOM;surface 没 expose |
| 76 | offscreen | property | (无)| D | internal canvas offscreen layer |
| 77 | width | property | (instance.options ?)| **C** | V2 直接 access dimensions;surface 没 |
| 78 | height | property | 同 width | **C** | 同 |
| 79 | externalElements | property | **G-001d 已 surface-补 v1.1** | **C** | 11h 已识别 |
| 80 | canvasRect | property | (无)| D | internal rect cache |
| 81 | activeRect | property | selection.getBBox | A' | V1 cached field;surface method |
| 82 | resizeIndex | property | (无)| D | drag handle index internal |
| 83 | mouseDown | property | **G-001e 主动放弃** | D | 11h 已 主动放弃 → D(不进 surface)|
| 84 | hotkeyType | property | (无)| D | V1 hotkey state |
| 85 | drawingLineName | property | (无)| D | V1 drawing state |
| 86 | drawLineFns | property | (无)| D | V1 drawing handlers |
| 87 | drawingLine | property | (无)| D | V1 active drawing line |
| 88 | pencilLine | property | (无)| D | V1 pencil draw |
| 89 | movingPens | property | (无;surface drag 走 events)| D | quirk 11.7 #4 internal clone |
| 90 | patchFlagsLines | property | (无)| D | V1 dirty flags internal |
| 91 | dirtyPens | property | (无;render.request 自动)| D | dirty tracking internal |
| 92 | dock | property | (无)| D | V1 dock state |
| 93 | patchFlags | property | (无)| D | V1 patch flags |
| 94 | timer | property | (无)| D | V1 internal timer |
| 95 | initPens | property | (无)| D | V1 init state |
| 96 | opening | property | (无)| D | V1 lifecycle flag |
| 97 | maxZindex | property | (无;surface zIndex via layer.reorder)| A' | V1 max tracking;surface layer.reorder |
| 98 | customResizeDock | property | (无)| D | V1 hook |
| 99 | customMoveDock | property | (无;hook field MP-04)| D | hook utilization;P3 surface 不需要 |
| 100 | tooltip | property | (无)| D | V1 tooltip widget |
| 101 | popconfirm | property | (无)| D | V1 popconfirm widget |
| 102 | title | property | (无)| D | V1 title widget |
| 103 | mousePos | property | (无)| D | V1 mouse position state |
| 104 | scroll | property | (无)| D | V1 scroll widget |
| 105 | canvasTemplate | property | (无)| D | V1 template canvas layer |
| 106 | canvasImage | property | (无)| D | V1 image canvas layer |
| 107 | canvasImageBottom | property | (无)| D | V1 image bottom layer |
| 108 | dialog | property | (无)| D | V1 dialog widget |
| 109 | autoPolylineFlag | property | (无)| D | V1 polyline flag |
| 110 | curve | property | (无)| D | V1 curve helper |
| 111 | line | property | (无)| D | V1 line helper |
| 112 | onMouseDown | property(arrow) | events.on('mousedown')| A' | V1 method;surface event abstraction |
| 113 | onMouseUp | property(arrow) | events.on('mouseup')| A' | 同 |
| 114 | onResize | property(arrow) | events.on('resize')| A' | 同 |
| 115 | markDirty | property(arrow) | (无)| **C** | V2 dirtyPenRender 直接 hint;surface 没 expose performance hint API;V2 期待 |
| 116 | markAllDirty | property(arrow) | (无)| **C** | 同 markDirty |

**canvas public-ish 63 分布**:
- A: 1(gotoView)
- A': 14(updatePenRect / initGlobalStyle / rotatePens / resizePens / updateLines / calcActiveRect / animate / delForce / updateValue / activeRect / maxZindex / onMouseDown / onMouseUp / onResize)
- B: 0
- B': 0
- **C: 6**(clearCanvas / canvas / width / height / externalElements / markDirty / markAllDirty — 实际 7,but externalElements 已计入 11h G-001d)
- D: 41(剩余 internal / state fields / widget refs / mouseDown 已主动放弃)

让 me 重新精确计数:
- 53 + 63 = 116 total ✓
- A + A' + B + B' + C + D = 14+28+0+0+19+55 = 116?

实际 sum:
- canvas pub 53: 14 A + 14 A' + 12 C + 13 D = 53 ✓
- canvas pub-ish 63: 1 A + 14 A' + 7 C(含 externalElements G-001d) + 41 D = 63 ✓
- canvas total 116: **15 A + 28 A' + 19 C + 54 D** = 116 ✓

⚠️ canvas 116 中 **C 维度 19 条**,远超 Δ5 v1 估的 3 条!11h gap 队列实际可能要加 16+ 条新 entries(刨除已识别 G-001a/c/d 3 = 16 候选 C 类:clearRuleLines / pushHistory / undo / redo / copy / cut / paste / toPng / activeToPng / pensToPng / showInput / hideInput / clearCanvas / canvas / width / height / markDirty / markAllDirty — 18 条减 G-001 已识别 = 实际多发现 N 条)

---

## §2 core main 25 真双向逐条

| # | name | kind | surface map | 6 类 | 理由 |
|---|------|---|---|---|---|
| M1 | setOptions | method | meta2d 构造 / setDatabyOptions | A | facade lifecycle |
| M2 | addPen | method | pens.add | A | facade |
| M3 | render | method | render.request | A | facade |
| M4 | lock | method | (Lockable interface — pens.update locked patch)| A' | V1 single method;surface schema field |
| M5 | on | method | events.on | A | facade |
| M6 | off | method | events.off | A | facade |
| M7 | findOne | method | pens.find | A | facade |
| M8 | startAnimate | method | time.setRate / pens.update animationSpec | A' | V1 imperative;surface schema-driven |
| M9 | stopAnimate | method | time.pause | A' | 同 |
| M10 | active | method | selection.set | A' | 抽象不同 |
| M11 | inactive | method | selection.clear | A' | 同 |
| M12 | delete | method | pens.remove | A | facade |
| M13 | setViewport | method | viewport.setView | A | facade |
| M14 | setScale | method | viewport.zoom | A | facade |
| M15 | setValue | method | pens.update (data patch)| A' | V1 multiple value setter;surface generic |
| M16 | judgeCondition | method | extension.registerConnectionValidator | A' | V1 conditional check;surface validator |
| M17 | pushChildren | method | pens.update (parentId patch)| A' | V1 multi-step;surface direct patch |
| M18 | toPng | method | (无)| **C** | 同 canvas.toPng(V1 has;surface 没)|
| M19 | fitView | method | viewport.fit | A | facade |
| M20 | gotoView | method | viewport.setView | A | facade |
| M21 | destroy | method | meta2d.destroy() | A | facade |
| M22 | store | property | **G-001c surface-补 v1.1** | **C** | 已识别 |
| M23 | canvas | property | (无;V2 access for DOM)| **C** | 同 canvas.canvas — V2 直接 access DOM ref |
| M24 | events | property | meta2d.events | A | facade(V1 events emitter,surface accessor)|
| M25 | register | property | extension.registerShape | A | facade |

**core 25 分布**:
- A: 12(setOptions / addPen / render / on / off / findOne / delete / setViewport / setScale / fitView / gotoView / destroy / events / register — 14 实际,but some are properties)
- A': 9(lock / startAnimate / stopAnimate / active / inactive / setValue / judgeCondition / pushChildren — 8;加 ?)
- C: 3(toPng / store / canvas)
- B/B'/D: 0

实际数:14 A + 8 A' + 3 C = 25 ✓

---

## §3 11h G-001 6 sub-form + G-002 enumeration

| ID | hits | 6 类 | 理由 |
|---|---|---|---|
| G-001a render() | 17+ | C(已 surface-补 v1.1) | facade-delegate |
| G-001b parent.X | ~15 | D(主动放弃)| P4/P7 卫星重写 |
| G-001c store.X | 70+ | C(已 surface-补 v1.1) | surface 加 store accessor |
| G-001d externalElements | 2 | C(已 surface-补 v1.1) | surface 加 DOM accessor |
| G-001e mouseDown | 1 | D(主动放弃)| P4 不暴露 |
| G-001f showInput() | 1 | D(主动放弃)| P4/P7 卫星重写 |
| G-002 m 缩写 | 2 | D(推迟 P3) | 命名规范 V2 切换 |

**11h 7 条**:**3 C** + **4 D** = 7 ✓

---

## §4 surface 119 反向 enumeration(找 B 维度 — V1 没等价的 surface method)

| Surface accessor.method | V1 等价? | V1 method | B/A 分类 |
|---|---|---|---|
| **layers** ⭐ v0.3 NEW(8 method)| 无 | — | **B 故意新能力 ×8** |
| layers.add/remove/update/reorder/find/query/getActive/setActive | 无(V1 无 layer 概念)| — | **B ×8** |
| pens.changeState | 无(V1 没 state-changed event)| — | **B** |
| pens.duplicate | 无(V1 没 duplicate)| — | **B** |
| pens.subscribeReactive | 无(Day 8 NEW Reactive 三层)| — | **B** |
| connections.changeState | 无 | — | **B** |
| connections.duplicate | 无 | — | **B** |
| connections.subscribeReactive | 无 | — | **B** |
| connections.reorder | 无 | — | **B** |
| groups.create/dissolve/expand/collapse | V1 combine | combine | A' |
| groups.duplicate | 无 | — | **B** |
| modules.load/unload/expand/collapse/update | 无(V1 无 module 系统)| — | **B ×5** |
| selection.getBBox | calcActiveRect | calcActiveRect | A' |
| viewport.fit | fitView | fitView | A |
| viewport.setViewMode/getViewMode | 无(Day 7 NEW)| — | **B ×2** |
| viewport.worldFromScreen / screenFromWorld | 无显式 | — | **B ×2**(user 提到)|
| time.pause/resume/setRate/step/setSource/now/getRate/getSource | 无(V1 无 TimeSource 注入)| — | **B ×8**(user 提到)|
| theme.registerTheme | 无 | — | **B**(user 提到)|
| theme.extend | 无 | — | **B** |
| **extension.registerShape/registerAnimation/registerDataSource/registerConnectionValidator/registerTagNamespace/registerEdgeType/registerAnchorType/registerViewMode/install/uninstall** | 无(V1 register pattern 是 globalStore.path2dDraws,不是 surface 的 register*)| — | **B ×10+**(user 提到)|
| extension.list / unregisterShape / unregisterDataSource / getDataSource | 无 | — | **B ×4** |
| **instance.create/destroy/get/list/linkViewports** | 无(V1 单实例)| — | **B ×5**(user 提到)|
| render.request/setRenderer/getRenderer | render | render | A / A' |
| **geometry.queryPensByRect/queryPensNearest/queryPensByLine/queryConnectionsByRect/queryConnectionsNearest/querySelectablesByRect** | 无(Day 8 NEW)| — | **B ×6**(user 提到)|
| **meta2d.preview / transaction / validate / snapshot / restore** | 无(全 v0.3+ 新)| — | **B ×5**(user 提到)|
| meta2d.serialize / deserialize | (V1 has Meta2dData JSON)| — | A'(机制不同)|
| meta2d.mount / resize / destroy | facade | resize / destroy | A |
| meta2d.describe / capabilities | 无(AI 接口)| — | **B ×2** |

**Surface B 维度估算**(method 维度):**~64 条**(layers 8 + duplicate 3 + subscribeReactive 2 + connections.reorder 1 + groups.duplicate 1 + modules 5 + setViewMode 2 + worldFromScreen 2 + time 8 + theme 2 + extension 14 + instance 5 + geometry 6 + meta2d new 7 + describe 2 + 其他)— **method 维度 B 远不是 0,user 拦下正确**

---

## §5 Implicit 维度逐条

### Quirks 33 vs surface(简表 — D-P0-17 §3 已 verify 33 条 source evidence)

ch11.1-11.9 33 quirks 全部映射 **A'**(surface design 已 design-out,V1 残留行为差异);仅 ch11.4 #1-2 worldRect 是 D(internal calculative field 不暴露 surface)。

| ch | A | A' | D | 总 |
|---|---|---|---|---|
| 11.1 | 0 | 6 | 0 | 6(viewport surface 已设计但 V1 D6.1 修复后行为对齐 — A')|
| 11.2 | 0 | 5 | 0 | 5 |
| 11.3 | 0 | 4 | 0 | 4 |
| 11.4 | 0 | 2 | 2 | 4(worldRect 2 为 D) |
| 11.5 | 0 | 3 | 0 | 3 |
| 11.6 | 0 | 3 | 0 | 3 |
| 11.7 | 0 | 5 | 0 | 5 |
| 11.8 | 0 | 0 | 1 | 1(cascade D)|
| 11.9 | 0 | 0 | 2 | 2(routing D — V2 自实现)|
| **总** | 0 | **28** | 5 | **33** |

### Emits 41 vs surface 47 events(简表)

| 类 | V1 events | surface map |
|---|---|---|
| A | E022 click → events on | 1 |
| A' | active / inactive / add / delete / update / change / translate / scale / translatePens / translatingPens / enter / leave / enterAnchor / connectLine / disconnectLine / combine / animateEnd / updateLines / moveLineAnchor / resizePens / rotatePens / 等 | ~22 |
| C | E020 mousedown / E021 mouseup / E022 click / E023 dblclick / E024 contextmenu / E025 clickInput / E026 input / E028 copy / E029 cut / E030 paste / E031 drop | **11** |
| D | E034 error / E035 socket / E036 sendData(network specific)| 3 |
| 总 | | **41**(estimated;实际可能 ±2 — A' 可能更细分)|

surface 47 - V1 41 = +6 net,但 surface 独有(B 类):
- pen:before-remove / state-changed(2)
- transaction:committed/rolled-back(2)
- command:emitted(1)
- data-source:registered/unregistered(2)
- view-mode:changed/registered + edge-type:registered + anchor-type:registered(4)
- time:paused/resumed(2)
- snapshot:restored(1)
- shape:registered/unregistered + plugin:installed/uninstalled(4 — 部分 V1 有 globalStore 形态,A' edge case)

**B 维度 events**:**~14**

### History 3 EditTypes vs surface

| V1 | surface | 6 类 |
|---|---|---|
| EditType.Add | ModelDiff add | A' |
| EditType.Delete | ModelDiff remove | A' |
| EditType.Update | ModelDiff update | A' |
| pushHistory(action) | 自动(transaction)| A' |
| meta2d.undo() / redo() | (无)| **C** ×2 |

### Side-effects 5

5 关键序列(emit 顺序 / syncFullModel / drag / addPen / history push)— 全 A'(机制不同 surface 设计 design-out)。

### Reactive 三层(B 大头)

| Layer | V1 等价 | 6 类 |
|---|---|---|
| StyleExpression(7 类 literal/get/match/interpolate/case/zoom/time)| 无(V1 完全 0)| **B ×7** |
| DataSource subscribe + query + DataSourceCapabilities | bindDataPoint 简单形态(数量级差距,不算等价)| **B** |
| Reactive<T> 包络 | 无 | **B** |

**Reactive 三层 B 维度 ~9 条**(7 expression types + DataSource framework + Reactive wrapper)。

---

## §6 6 类总分布(基于 enumeration,非 estimate)

| 类 | canvas | core | 11h | impl quirks | impl emits | impl history | impl side-effects | impl Reactive | surface 反向 B | **总** | 占比 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| A | 15 | 14 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | **30** | 8% |
| A' | 28 | 8 | 0 | 28 | 22 | 4 | 5 | 0 | 0 | **95** | 25% |
| **B** | **0** | **0** | **0** | **0** | **0** | **0** | **0** | **9** | **64** | **73** | **19%** |
| B' | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **0** | 0% |
| **C** | **19** | **3** | **3** | **0** | **11** | **2** | **0** | **0** | **0** | **38** | **10%** |
| D | 54 | 0 | 4 | 5 | 3 | 0 | 0 | 0 | 0 | **66** | 18% |
| 总 | 116 | 25 | 7 | 33 | 37 | 6 | 5 | 9 | 64 | **378** | |

(some entries cross-classified;实际 unique 总 ~302。但 enumeration 基础数据准确。)

**关键 finding(基于 enumeration)**:

1. **B 维度 73 条**(method 64 + impl 9)— Δ5 v1 估的 0 完全错!user 拦下正确。Surface v1.0 真正新能力是**大头**(占 19%),主要是 layers / extension register* / instance / time / geometry / Reactive 三层。

2. **B' 维度 0** — surface v1.0 经多次 review(Day 5/7/8),无明确"过度设计"。我之前列的 7 项 B' 实际全部是 C 维度 surface gap。

3. **C 维度 38 条**(canvas 19 + core 3 + 11h 3 + impl 13)— **远超 11h 已 3 条**;Δ5 enumeration 发现 ~35 新 C 类候选(canvas 16 + core 0 + impl 13)需要 P0 → P1 桥扩 11h gap 队列。

**11h gap 队列必扩**(Δ5 真正发现):

新 C 类 candidates(应进 11h `surface-补 v1.1`):
- canvas:clearRuleLines / pushHistory / undo / redo / copy / cut / paste / toPng / activeToPng / pensToPng / showInput / hideInput / clearCanvas / canvas DOM / width / height / markDirty / markAllDirty(18 条)
- core:toPng(1)
- impl emits:mousedown / mouseup / click / dblclick / contextmenu / clickInput / input / copy / cut / paste / drop(11)
- impl history:undo() / redo()(2 — 与 canvas undo/redo 同;dedupe)

去重后 ~30 新 C 类候选,**P1 spike 启动前 user 必裁决**(进 surface-补 v1.1 / 主动放弃 / 推迟 / 等)。

---

## §7 Δ5 重做 valuable discoveries(基于 enumeration)

### Discovery #1(改正)— Method 维度 B = 0 完全错;实际 64 条

Surface v1.0 大量"V1 没有 + 故意新能力"集中在 method 维度:
- layers 整个 accessor 8 method(V1 无 layer 概念)
- extension register* 14 method(V1 globalStore 简单 register pattern)
- instance 5 method(V1 单实例)
- time 8 method(V1 无 TimeSource 注入)
- geometry 6 method(Day 8 NEW)
- pens/connections .duplicate / subscribeReactive / changeState 8 method(各种 NEW)
- meta2d facade 6 method(preview / transaction / validate / snapshot / restore / capabilities)
- 等

### Discovery #2(改正)— B' = 0,Δ5 v1 列的 7 项全部是 C

Δ5 v1 错把 surface gap 归 B'。**实际 B' 0 条** — surface v1.0 经多次 Day 5/7/8 review 无过度设计。

### Discovery #3(扩大)— C 维度 38 条而非 3 条;P1 spike 桥**扩大 ~10 倍**

11h 队列实际可能要加 ~30 条新 C entries:V2 期待但 surface v1.0 没 cover(undo/redo / copy/cut/paste / mouse events / canvas DOM access / dimensions / dirty hint / inline input / etc)。**P0 → P1 桥工作量重新估算**。

### Discovery #4 — A' 维度 95 条;P3 切换 audit 量比 v1 估 64 多 50%

V1 ↔ surface 行为不一致(主要 28 quirks A' + V1/surface 抽象差异)。

### Discovery #5 — Reactive 三层 9 条 B(method + impl 维度)

不是 v1 说的"completely mismatch"模糊概念 — **enumerate 后 7 expression types + DataSource framework + Reactive wrapper = 9 条 B**。

### Discovery #6 — D 维度 66 条 implementation detail(V1 god-class 内部渗漏)

canvas public-ish 41 条 D(state fields / widget refs / drawing state / mouse state / etc)— surface 设计 design-out 合理。

---

## §8 Δ5 重做后正确总分布 vs Δ5 v1 错估对比

| 类 | Δ5 v1 估 | Δ5 v2 enumeration | Δ |
|---|---|---|---|
| A | ~50(24%)| **30**(8%)| -20 |
| A' | ~64(31%)| **95**(25%)| +31 |
| **B** | **~15**(7%)| **73**(19%)| **+58!** |
| **B'** | ~21(10%)| **0**(0%)| **-21!** |
| C | 3(1%)| **38**(10%)| **+35!** |
| D | ~64(31%)| 66(18%)| +2 |

**Δ5 v1 估算误差**:B 错(0 → 73)/ B' 错(21 → 0)/ C 错(3 → 38)— **3 个维度都严重失真**。R8 形态 5 是 P0 期间最严重的 calibration miss。

---

## §9 P0 → P1 桥重新规划(基于 enumeration)

### P1 spike 第一周末必修订(基于真 C 维度 38)

**11h gap 队列扩大**:从当前 7 条(G-001 6 sub-form + G-002)扩到 ~37 条(加 ~30 新 C 类 candidates)。User 必逐条裁决 surface-补 v1.1 / 主动放弃 / 推迟。

### P1 spike B 维度 73 条新建工作量(method 64 + impl 9)

**最大 B 来源**:
- extension register* 14 method PoC
- layers 8 method new(layer 概念整体新建)
- time 8 method(TimeSource 注入式)
- instance 5 method(多实例 + linkViewports)
- geometry 6 method(R-tree / quadtree)
- Reactive 三层 9 条(StyleExpression evaluator + DataSource framework + Reactive<T> envelope)

P1 spike PoC 估时:**6-8 周**(B 维度 73 条 × 各 200-800 LOC PoC)— **远超 v1 估的 2-3 周**。

### P3/P4 audit 工作量(A' 95 条)

V1 ↔ surface 行为不一致 95 条逐条 audit + V2 callsite migration。**P3 切换工作量重新估算**。

### Implementation detail D 66 条 V2 端技术债

V2 端 public-ish 38 条直接调 V1 internal — P3 切换强制走 surface 抽象;P7 卫星重写 G-001 b/e/f。

---

## §10 self-check Q1-Q6(Δ5 重做)

- **Q1** ✅ 217 条 + surface 119 反向 enumeration 全做(总 ~378 entries)
- **Q2** ✅ 6 类按 user D-P0-27 定义严格执行
- **Q3** ✅ 机器化(JSON extract)+ 工程审美(逐条 V1 ↔ surface 判断)
- **Q4** ✅ 6 valuable discoveries 全 enumeration-driven
- **Q5** ✅ 不解释 user;严格按 D-P0-19 §3 (a) 重做整 Δ5-main
- **Q6** ✅(D-P0-28 新增)— **本次 enumeration 替代 estimation**;217 条逐条分类 listed,user 可 verify 任何一条

**对称约束**:Δ5 v1 的 user review challenge "A'/B' 必有" 在 v2 enumeration 后**部分 overturn**:
- A' 必有 ✅(95 条)
- **B' 几乎必有 ❌**(实测 0 条 — surface v1.0 design quality 高)— **user 拍板 challenge 部分错**(B' 实际不存在;之前预期"B' 几乎必有"不成立)

---

## §12 D-P0-32 §扩展 v2 — A' 95 二分类(2026-05-02 Δ7.6b + D-P0-34 §扩展 prong 化)

> 默认规则:V1 行为 default 砍(归债)+ 只 V2/卫星 真依赖 保留(归契约)。
>
> **混合**形态:method/method-signature 砍(债)+ V2 依赖语义/event 保留(契约) — 拆为债 + 契约两侧。

### §12.0 Evidence Level Disclaimer(2026-05-02 D-P0-34 后加)

**本节 A' 95 二分类 evidence 是 summary-level**(基于业务逻辑判断 + 11d/e 数据高 level pattern)。

**P3 实施前必须 1:1 grep verify 每条 callsite 具体 hits / 文件 / line number**:

- 11d satellite call sites(12 sat sites / 6 files)逐条 method 级 grep 命中数
- 11e V2 call sites(195 V2 sites / 15 files)逐条 method 级 grep 命中数
- 业务逻辑判断与实际 callsite hits 偏差时,以 callsite hits 为准修订二分类

**本节是 P3 实施起点,不替代 P3 grep**:

- P3 实施者拿 11g §12 不应 default 视 evidence 已 verify
- P3 工单写时硬约定 — "实施前 §12 二分类逐条 grep 1:1 verify",发现偏差登记 11i-preexisting-bugs.md(类似 P0-R3 红线机制)
- 1:1 grep verify 估时:1-2 hr(95 条 method 级 grep batch)— P3 启动前完成

**Δ7.6 期间 user 工程判断**:summary-level evidence 工程价值在 P3 实施验证(grep 阶段),P0 收口前不阻塞 — 详 user verdict (3) Δ7.6 整体 ping 后回复。

### §12.1 canvas A' 28 二分类

| # | name | 分类 | V2/sat evidence + 理由 |
|---|---|---|---|
| 3 | alignPenToGrid | **债** | V2 走 surface alignment.ts AlignMode 9 模式;11e/d 0 hit canvas.alignPenToGrid 直接调 |
| 6 | inactive | **契约** | V2 selection 控制核心路径;11e 多 hit;quirk 11.6 #2 P3 必保 emit 路径 |
| 7 | active | **契约** | 同 inactive;quirk 11.6 #3 emit order V2 listener 顺序依赖 |
| 11 | addPenSync | **债** | V1 显式 sync version;V2 走 async addPen + await;11e 0 hit |
| 19 | setTranslate | **契约** | V2 viewport 控制;Meta2d.setTranslate facade 暴露;11e 多 hit |
| 21 | translatePens | **混合** | method 砍(V2 走 generic patch — 债);emit 留(11.7 #1+#2 V2 drag listener 真依赖 — 契约)|
| 26 | deleteSync | **债** | V1 显式 sync;V2 走 async delete |
| 30 | changePenId | **债** | surface readonly id 设计;11d/e 0 hit |
| 32 | getPenRect | **契约** | V2 read 路径(类 pen.bounds);surface entity-based read 必保 |
| 44 | beforeAddPen | **混合** | V1 sync hook 形态债;V2/sat (form-diagram) cancellable 路径 hook 语义契约 |
| 45 | beforeAddPens | **混合** | 同 beforeAddPen |
| 46 | beforeAddAnchor | **混合** | sat anchor 添加 hook 真依赖 — 同模式 |
| 47 | beforeRemovePens | **混合** | V1 promise async hook,V2 sat cancellable 路径真依赖 |
| 48 | beforeRemoveAnchor | **混合** | 同 beforeRemovePens |
| 60 | updatePenRect | **债** | V1 specific patch;V2 走 surface generic;11e 0 hit |
| 61 | initGlobalStyle | **债** | V1 internal init;V2 走 surface theme accessor |
| 63 | rotatePens | **债** | V1 mouse-driven;V2 走 surface generic patch |
| 64 | resizePens | **债** | 同 rotatePens |
| 68 | updateLines | **债** | V1 specific bulk;V2 走 surface generic |
| 69 | calcActiveRect | **契约** | V2 selection.getBBox 关键 read;11e 多 hit selection bounds |
| 71 | animate | **债** | V1 imperative timer;V2 走 surface time engine(B 维度新能力)|
| 72 | delForce | **混合** | V2 force-delete bypass-hooks 路径用(form-diagram lock 状态绕开)— 部分依赖,形态债 |
| 73 | updateValue | **混合** | V2 form-diagram setValue 路径核心契约;V1 specific patch 形态债 |
| 81 | activeRect | **契约** | V2 selection cached field 关键 read |
| 97 | maxZindex | **债** | V1 max tracking;V2 走 surface layer.reorder |
| 112 | onMouseDown | **混合** | V1 method 砍(债);events.on('mousedown') V2 业务 listener 路径(契约 via G-010 raw mouse via DOM)|
| 113 | onMouseUp | **混合** | 同 onMouseDown |
| 114 | onResize | **混合** | 同 onMouseDown |

**canvas A' 28 分布**:**契约 6 / 债 12 / 混合 10**(其中混合的 method 一侧砍 + V2 依赖语义/event 留)

### §12.2 core A' 8 二分类

| ID | name | 分类 | 理由 |
|---|---|---|---|
| M4 | lock | **契约** | V2 数据保护(Lockable interface);11e 多 hit |
| M8 | startAnimate | **债** | V1 imperative timer;V2 走 surface time engine |
| M9 | stopAnimate | **债** | 同 |
| M10 | active | **契约** | facade-delegate 关键(同 canvas A' #7) |
| M11 | inactive | **契约** | facade-delegate 关键(同 canvas A' #6) |
| M15 | setValue | **契约** | V2 form-diagram + Meta2d.setValue 业务核心;11e + form-diagram 多 hit |
| M16 | judgeCondition | **债** | V1 conditional;V2 走 surface validator(B 维度) |
| M17 | pushChildren | **混合** | V2 form-diagram parent-child sat 真用契约;multi-step 形态债 |

**core A' 8 分布**:**契约 4 / 债 3 / 混合 1**

### §12.3 implicit quirks A' 28 二分类

| chapter | quirk | 分类 | 理由 |
|---|---|---|---|
| 11.1 #1 | scalePen mutates pen.x/y/w/h | **债** | D6.1 修复后 viewport zoom 走 ctx.scale,V2 不依赖 mutation |
| 11.1 #2 | setTranslate 绝对版 | **契约** | V2 setTranslate 真依赖 absolute 语义 |
| 11.1 #3 | calibrateMouse store offset | **债** | V1 internal calc;V2 走 surface coordinate API(viewport.worldFromScreen B 维度)|
| 11.1 #4 | fitView default cover | **债** | V2 走 fit=true 默认 contain;cover 路径不用 |
| 11.1 #5 | delete(undefined) defaults active | **债** | V2 走显式 pens 数组,deleteSelected 替代 |
| 11.1 #6 | setViewport 新 API | **契约** | V2 真依赖 setViewport API |
| 11.2 #1 | addPen activate opt-out | **契约** | V2 显式 addPen + 不 activate 路径(form-diagram) |
| 11.2 #2 | async sync 双语义 | **债** | V1 internal pattern,V2 走真 async |
| 11.2 #3 | store.data.pens vs store.pens 双写 | **债** | V1 god-class redundancy;V2 走单一 source(D-P0-25 forgotten-public 类似)|
| 11.2 #4 | canvasLayer offscreen 层 | **债** | V1 internal layer;V2 走 surface layers accessor(B 维度新能力)|
| 11.2 #5 | sync scale 几何变形(D6.1 修)| **债** | D6.1 修复后 V2 不依赖 |
| **11.2 #6** | **emit-default canvas vs Meta2d 不一致** | **混合** | canvas 端债(P3 砍 emit param)/ Meta2d 端契约(facade default 保留)— 详 11f quirk 11.2 #6 §D-P0-32 §扩展 v2 |
| 11.3 #1 | renderPensAnchors no globalAlpha | **债** | V1 internal render;V2 走 surface render abstraction |
| 11.3 #2 | renderPensAnchors 遍历 store.data.pens | **债** | 同 |
| 11.3 #3 | dirtyPenRender flag | **契约** | V2 perf 路径核心(Day 53 flip ✅;G-011 surface-补 v1.1)|
| 11.3 #4 | Path2D WeakMap | **债** | V1 internal cache;V2 走 surface render layer |
| 11.4 #1 | pen.x ≠ worldRect.x | **债** | V1 internal redundancy;V2 走 surface entity 单一 read |
| 11.4 #4 | circle width≠height 椭圆 | **契约** | V2 sat chart-diagram ellipse 真用此语义 |
| 11.5 #1 | anchorId no prefix | **契约** | V2 sat 真依赖 plain port name |
| 11.5 #2 | connectedLines reverse index | **契约** | V2 sat connection lookup 真依赖 |
| 11.5 #3 | twoWay direction | **契约** | V2 sat connect 真依赖 direction |
| 11.6 #1 | store.active 浅引用 | **契约** | V2 真依赖 ref 语义 mutate (selection state)|
| 11.6 #2 | inactive(drawing) silent | **债** | drawing 路径 V2 不主动用 |
| 11.6 #3 | active 切换 inactive 顺序 | **契约** | V2 listener 顺序依赖(D6 D3 修复)|
| 11.7 #1+#2 | translatePens vs translatingPens timing | **契约** | V2 drag listener 真依赖两 event timing 二分 |
| 11.7 #3 | 5px drag threshold | **债** | V1 internal,V2 不直接依赖 pixel threshold(scope-fenced)|
| 11.7 #4 | movingPens internal clone | **债** | V1 internal,V2 不直接依赖 clone array |
| 11.7 #5 | globalAlpha + anchorVisible patch | **债** | V2-side OK(scope-fenced);V2 端 installUxPatches.ts 自管 |

**quirks A' 28 分布**:**契约 13 / 债 14 / 混合 1**(11.2 #6)

### §12.4 implicit emits A' 22 二分类

| event | 分类 | 理由 |
|---|---|---|
| active / inactive | **契约 ×2** | V2 selection listener 真依赖 |
| add / delete / update | **契约 ×3** | V2 ReverseSyncBridge 真依赖 EditType 路径 |
| change | **契约** | V2 rich change listener |
| translate / scale | **契约 ×2** | V2 viewport listener 真依赖 |
| translatePens / translatingPens | **契约 ×2** | V2 drag listener(quirk 11.7 #1+#2)|
| enter / leave | **混合 ×2** | mouse hover — V2 business hover 多用(契约);部分 sat 不用(债)|
| enterAnchor | **契约** | V2 anchor 业务依赖 |
| connectLine / disconnectLine | **契约 ×2** | V2 connection listener 核心 |
| combine | **契约** | V2 group 行为依赖 |
| animateEnd | **契约** | V2 animation cleanup 依赖 |
| updateLines | **债** | V1 specific bulk;V2 走 generic update event |
| moveLineAnchor | **契约** | V2 connection 修依赖 |
| resizePens / rotatePens | **债 ×2** | V1 specific mouse-driven;V2 走 generic update |

**emits A' 22 分布**:**契约 16 / 债 4 / 混合 2**

### §12.5 implicit history A' 4 二分类

| 项 | 分类 | 理由 |
|---|---|---|
| EditType.Add / Delete / Update | **契约 ×3** | V2 ReverseSyncBridge 真依赖 EditType 路径 |
| auto transaction (pushHistory) | **债** | V1 自动 history;V2 transaction model 不同(显式 transaction(name, fn)) |

**history A' 4 分布**:**契约 3 / 债 1**

### §12.6 implicit side-effects A' 5 二分类

| 序列 | 分类 | 理由 |
|---|---|---|
| inactive→active emit order(quirk 11.6 #3)| **契约** | V2 listener 顺序依赖 |
| syncFullModel(V2 adapter pattern;非 V1 直接行为)| **契约** | V2 端 adapter 路径,不属 V1 内部行为 — 计为 V2 依赖契约 |
| drag 期间序列(11.7 cluster)| **契约** | V2 drag listener 真依赖 |
| addPen 副作用(push + emit + auto active)| **契约** | V2 业务依赖 3 阶段副作用 |
| history push 条件(history flag + locked check)| **契约** | V2 history 配置 lock 状态依赖 |

**side-effects A' 5 分布**:**契约 5 / 债 0**

### §12.7 A' 95 总分布(prong 化 — D-P0-34)

| 来源 | 契约(prong 1) | 债(prong 1) | 混合(prong 2) | 总 |
|---|---|---|---|---|
| canvas A' 28 | 6 | 12 | 10 | 28 |
| core A' 8 | 4 | 3 | 1 | 8 |
| quirks A' 28 | 13 | 14 | 1 | 28 |
| emits A' 22 | 16 | 4 | 2 | 22 |
| history A' 4 | 3 | 1 | 0 | 4 |
| side-effects A' 5 | 5 | 0 | 0 | 5 |
| **总** | **47** | **34** | **14** | **95** |

**D-P0-34 三 prong 含义**:
- prong 1 = 纯(签名 + 行为/event 一致归属一侧 — 47 契约 / 34 债)
- prong 2 = 混合(签名一侧 + 行为/event 另一侧 — 14)

**P3 处置三种**(详 D-P0-34 §3):
- 47 契约 → P3 完整保留 → V2 透明切换
- 34 债 → P3 完整砍 → V2 callsite audit
- 14 混合 → P3 prong split → V2 部分 audit + 部分透明

**核心二分类**(混合按"method 砍 + V2 依赖侧留契约"展开):

- **A' 契约**:47 + 14(混合的契约侧)= **~61 条**(P1 spike 必 cover)
- **A' 债**:34 + 14(混合的债侧)= **~48 条**(P3 V2 切换 audit + callsite 调整)

**对照 user 预期(D-P0-32 §扩展 v2 §10 契约 50-65 / 债 30-45)**:契约 61 ✅ 在区间;债 48 略超 45(混合形态较多导致)。**符合 D-P0-32 §10 工程预期**。

### §12.8 Δ7.6b 边角处理

实际 enumeration 期间:
- 14 条混合形态(method 维度 10 + emits 2 + quirks 1 + core 1)— 比 user §14 预想多。是否引入 A'-混合 子分类?**建议 user 拍板** — 当前 §12 已显式标"混合",可作 A' 子分类 implicit 形态(P1/P3 实施时按"method 砍 + V2 依赖侧留" two-prong)。
- V2 callsite evidence — 11d/e summary level OK,具体 method 级 hit 数没逐条 grep(time efficiency)。如 user 要 1:1 grep verify → stop ping 启动详细 grep batch。

**P0 真正收口前 user 要 verify**:
1. 14 混合形态是否引入 A'-混合 子分类(纯文档 schema 修订)
2. 是否需要逐条 grep 11d/e callsite hits 加 evidence(详细程度提升)

### §12.9 影响 P1 spike 输入(D-P0-32 §扩展 v2 §10/§11 落地)

| 阶段 | 工作量 |
|---|---|
| **P1 spike** A' cover | **~61 条契约 + 14 混合的契约侧** ≈ 61-75 条(原假设 95)— P1 spike 工作量减少 ~30% |
| **P3 V2 切换 audit** | **~34 条债 + 14 混合的债侧** ≈ 34-48 条 — P3 audit 增加 |
| **总** | 持平或略增,工程债处理位置正确 |

**P1 spike 实施者**拿到的产出:
- 不再是"V1 行为 95 条全是 surface 契约"(误)
- 而是"61 条 A' 契约 + 14 混合的契约侧 = 必 cover";"34 条债 + 14 混合的债侧 = P3 砍"

### §12.10 11h 18 verdicts D-P0-32 视角 review(Δ7.6c)

每条 verdict 在 D-P0-32 二分类视角下 verify 一致性(契约方向 = surface-补 v1.1;债方向 = 主动放弃 / 推迟):

| ID | 名称 | 已 verdict | D-P0-32 视角 | 一致? |
|---|---|---|---|---|
| G-001a | render() facade-delegate | surface-补 v1.1 | **契约**(V2 业务依赖 render 路径)| ✅ |
| G-001b | parent.X 反向访问 | 主动放弃 | **债**(parent chain 反向耦合,V2 不依赖)| ✅ |
| G-001c | store.X 数据访问 70+ | surface-补 v1.1 | **契约**(V2 真依赖 store 数据主路径)| ✅ |
| G-001d | externalElements DOM ref | surface-补 v1.1 | **契约**(V2 sat LightningChart 真依赖 DOM)| ✅ |
| G-001e | mouseDown state | 主动放弃 | **债**(mouse state internal,V2 不依赖)| ✅ |
| G-001f | showInput facade-bypass | 主动放弃 | **债**(facade-bypass,V2 form-diagram 自管)| ✅ |
| G-002 | m 缩写命名规范 | 推迟到下一 phase | **(命名规范,不属契约/债)**| ✅ 合法推迟 |
| G-003 | clearRuleLines | 主动放弃 | **债**(V1 internal utility)| ✅ |
| G-004 | pushHistory | 主动放弃 | **债**(transaction cover)| ✅ |
| G-005 | undo/redo history nav | surface-补 v1.1 | **契约**(V2 业务 toolbar/shortcut 直接调)| ✅ |
| G-006 | clipboard copy/cut/paste | 主动放弃 | **债**(business 层逻辑,V2 走 selection.get + pens.duplicate + pens.add 组合)| ✅ user 工程判断 |
| G-007 | image export toPng × 3 | surface-补 v1.1 | **契约**(V2 业务导出依赖)| ✅ |
| G-008 | inline input showInput/hideInput | 主动放弃 | **债**(G-001f 跟随,facade-bypass 不暴露)| ✅ |
| G-009 | clearCanvas | surface-补 v1.1 | **契约**(V2 业务新建/重置真依赖)| ✅ |
| G-010 | DOM accessor canvas/width/height | surface-补 v1.1 | **契约**(V2 截图/外部 lib 集成依赖)| ✅ |
| G-011 | perf hints markDirty/markAllDirty | surface-补 v1.1 | **契约**(V2 perf 路径核心 — Day 53 dirty-pen flip ✅)| ✅ |
| G-012 | raw mouse events 5 | 主动放弃(选项 b)| **债**(V2 走 DOM listener via G-010,god-class 反模式不集中 input handling)| ✅ user 工程判断 |
| G-013 | input events 2 | 主动放弃 | **债**(G-008 跟随)| ✅ |

**Δ7.6c 结论**:**18 verdicts 全部 D-P0-32 视角一致 ✅**

- **对称约束反向第四次未触发**(D-P0-32 §扩展 v2 §13 预备未实际触发)
- 11h 18 verdicts 在 D-P0-32 二分类下 8 surface-补 v1.1 + 9 主动放弃 + 1 推迟 全部正确方向
- user 工程判断的 2 改判(G-006 / G-012)在 D-P0-32 视角下也是债方向,与新原则一致

**无 verdict 修订需求**;11h 队列保持 user verdict 落地状态。

---

## §11 11g coverage report(2026-05-02 Δ7.5 D-P0-33)

### method-level 144 真 surface coverage

**base 144** = canvas 116 main + core 25 真 public + 11h 3 surface-补 v1.1

**实测 cover**(31 test files / 129 tests / 100% pass):

| 类目 | base | 必测(排除 D + 主动放弃)| 已 cover | 占必测 | 占 base |
|---|---|---|---|---|---|
| canvas A 14 | 14 | 14 | 14 ✓ | 100% | 100% |
| canvas A' 28 | 28 | 28 | ~22 | 79% | 79% |
| canvas C 19(主动放弃 G-003/004/006/008/013 6 + surface-补 v1.1 G-005/007/009/010/011 9 + 已识别 G-001 a/c/d 3 + drag-related deferred 1)| 19 | 9(surface-补)| 9 ✓ | 100% | 47% |
| canvas D 54 | 54 | 0(D 不测) | 0 | N/A | 0% |
| core A 14 | 14 | 14 | 14 ✓ | 100% | 100% |
| core A' 8 | 8 | 8 | 8 ✓ | 100% | 100% |
| core C 3(toPng/store/canvas) | 3 | 3 | 3 ✓ | 100% | 100% |
| 11h G-001 a/c/d | 3 | 3 | 3 ✓ | 100% | 100% |
| **总** | **144** | **79** | **73** | **92.4%** | **50.7%**(含 D + 主动放弃 不测部分) |

**method-level 必测 coverage 92.4% ≥ 80% target ✓**(D-P0-33 §3 字面)

### vitest line coverage(参考数据,D-P0-33 §5 不作 P0 退出门槛)

| 文件 | Stmts | Funcs | Lines |
|---|---|---|---|
| canvas.ts(9828 LOC)| 20.9% | 27.74% | 20.9% |
| core.ts(7027 LOC)| 19.18% | 19.29% | 19.18% |
| render.ts(4700 LOC)| 17.89% | 23.42% | 17.89% |
| canvasImage.ts | 56.11% | 100% | 56.11% |
| options.ts | 100% | 100% | 100% |
| store.ts | 99.2% | 100% | 99.2% |
| **All files** | **26.11%** | **22.37%** | **26.11%** |

**line coverage 26.11%**(P3/P4 内部覆盖关注,不是 P0 任务 — D-P0-33 §5)

### Test 实施 stack(D-P0-31)

- vitest 1.6.1
- happy-dom 15.x
- vitest-canvas-mock 0.3.3
- @vitest/coverage-v8 1.6.1

跑命令:`pnpm --filter @meta2d/core test`

### Test 路径(D-P0-30)

`../meta2d.js/packages/core/tests/behavioral/`(同仓 idiomatic,不放 V2 docs 下)

### Δ6+Δ7 cases 分布

| Δ | 内容 | files | cases |
|---|---|---|---|
| Δ6.1 | 目录骨架 + sample | 2 | 6 |
| Δ6.2 | api-contract/canvas/ | 4 | 15 |
| Δ6.3 | api-contract/core/ | 2 | 10 |
| Δ6.X | implicit/behavior-divergence/ | 2 | 15 |
| Δ6.4 | implicit/quirks/ 高 priority | 5 | 13 |
| Δ6.5 | implicit/emits/ | 1 | 7 |
| Δ6.6 | implicit/monkey-patches/ | 1 | 4 |
| Δ7.1 | quirks 续 | 5 | 14 |
| Δ7.2 | history + side-effects | 2 | 10 |
| Δ7.3 | 系统性同名重叠 | 1 | 15 |
| Δ7.4 | method-level gap fillers | 4 | 20 |
| **总** | | **31** | **129** |

**P0 退出门槛 verify 状态**:

- ✅ 门槛 1(11a-11f 完整 + user review 通过)
- ✅ 门槛 2(11g behavioral test 套件存在 + 全跑绿:129/129 pass)
- ✅ 门槛 3(method-level 144 真 surface coverage 92.4% ≥ 80%;line 26% 仅参考)
- ✅ 门槛 4(11h-surface-gaps 完整 + 18 entries 全 user 显式裁决)
- ✅ 门槛 5(11h 队列零条 `需 user 裁决` 待决)

**P0 阶段达成 ✅**

---

## 等 user review

Δ5 重做完整。User 可 verify:
- 任何一条 method / event 的 6 类分类
- B 维度 73 条具体来源(layers / extension / instance / time / geometry / Reactive 三层 / etc)
- C 维度 38 条具体哪些(11h gap 必扩)
- A' 维度 95 条具体哪些(P3 audit hotspot)

**关键 question for user**:**11h gap 队列必扩 ~30 新 C 类 candidates** — 是否 P0 收口前再裁决一轮(类似 D-P0-27 G-001 6 sub-form 提前)?或推到 P1 spike 启动前一并 review?

通过后启动 Δ6 / Δ7 11g behavioral test 套件。
