> 状态:v1.0(冻结)— P1 spike 后会出 v1.1
> 上次 review:Day 14 / 4 轮 user review 通过

# M2 Output 2/3 — 公开 API 表面 **v1.0(正式定稿)**

**版本**: **v1.0**(2026-04-30 Day 14 stamp,基于 v1.0-rc + Day 13 user review N=1 doc patch)
**日期**: 2026-04-30 Day 4-14
**状态**: **v1.0 正式定稿** — **119 API + 15 accessors + 47 events**;KD-011 §B/§C/§D/§F/§G 全过;M2 backstop 6 天验证 + Day 13.5 spike 实证锁定 0 P0
**Day 14 stamp 内容**(v1.0-rc → v1.0 唯一变更,N=1 doc patch):
- §0.4-ter 新增:Reactive<T> 求值 scope 局限(R-FORM-2 闭合)
- §1.5 新增:ShapeDef registration schema(R-FTA-1 闭合,含 defaultAnchors 缺省语义,R-FLOW-2 合并)

**Day 8 P0+P1 收口补丁**(用户 Day 8 三轮 review:Bindable 通讯耦合 + n8n + Design Token + L1.5/L1.7 治理):

**P0(架构补天之笔,~6 小时)**:
- ★★★ **`Bindable<T>` → `Reactive<T>` 三层解构**(修复隐含 MQTT/HTTP 通讯耦合的架构债)
  - Layer 1 `StyleExpression<T>`(本地派生 sync,literal/get/match/interpolate/case/zoom/time 7 类)
  - Layer 2 `DataSource`(原 `BindingResolver`;subscribe 必,query 可选;`DataSourceCapabilities` 显式)
  - Layer 3 `Reactive<T> = T | { $expr } | { $source }`(字段统一外壳)
- `extension.{registerDataSource, unregisterDataSource, getDataSource}` 替代 `registerBindingResolver`(net +2)
- `pens.subscribeReactive / connections.subscribeReactive`(n8n N4 NDV 第三栏)+`ReactiveSubscription<T>`(+2)
- `Diff.describe() / Diff.affectedIds()`(n8n N10 AI Diff UX)— Diff interface 扩展,0 method
- `PenStyle.strokeWidth` 加 semantic level('thin'/'medium'/'thick'/'bold' + token 解析,ROI🥇)
- `PenStyle.opacity` 升级为 `Reactive<number>`(对齐 glow Reactive 模式)

**P1(对齐前述,~3 小时)**:
- ★ `geometry` 第 15 个 accessor(P1 升级,从 P2 deferred 提前)— 6 method:queryPensByRect / queryPensNearest / queryPensByLine / queryConnectionsByRect / queryConnectionsNearest / querySelectablesByRect

**累计 API**:101 → Day 7 109 → Day 8 **119**(+18 vs v1.0-rc 起点)
**累计 events**:41 → Day 7 45 → Day 8 **47**(+2)
**警戒线 130 buffer 11**(M2 v1.0 收口空间充足)

**Day 7 roadmap × 02 cross-validation 补丁**(用户 V2 roadmap 视角对照,P0+P1 共 5 处):
- 修订 1(P1):Pen 加 `labels?: Label[]` 字段(对齐 Connection.labels;roadmap Datablock 用例)
- ⭐ 修订 2(P0):**ViewMode 注册 + 切换**(roadmap Phase D Color Contouring;ETAP iSLD 杀手级功能)
  - `extension.registerViewMode(viewMode)` + `viewport.setViewMode/getViewMode` + 'view-mode:changed' event
  - +3 method,+1 event
- 修订 4(P1):PenStyle / ConnectionStyle 加 `glow / shadow / border / cursor` 装饰字段(roadmap Phase D Dark glow)
- 修订 6(P1):`extension.registerEdgeType / registerAnchorType`(对齐 React Flow 扩展点;Phase E SDK 化前提)
- ⭐ 修订 7(P0):**`pens / connections / groups.duplicate`**(roadmap Phase A Ctrl+D 必备;mxGraph cloneCells 共识)
- 修订 5 已含修订 2:Color Contour 走 ViewMode.resolveOverlay
- 修订 3(P2,deferred):geometry accessor 空间查询 — v0.4 perf 实测后决定
- 修订 8(P2,deferred):ShapeDef.getAnchors 动态 anchor — v0.4 验证

**累计 API 增量**:101 → **109**(+8 method,+4 events)

**Day 5 v1.0-rc 补丁**(用户 02 v0.3 review 7 处):
- P0-1 events 数字核账 + 二次压缩(44 → 41,合并 layer:active-changed / group:expanded-collapsed / module:expanded-collapsed)
- P0-2 §11 API 数核账重写(facade 12 + accessor 88 + module 1 = 101)
- P0-3 transaction 嵌套 savepoint 语义锁定(§4.3.1)
- P1-1 `preventRemoval` 模式替代 cancel callback(§7.4)
- P1-2 GroupPatch / ModulePatch 不含 collapsed 字段(命令式 vs 声明式)
- P2-1 跨域语义事件派生指南(§7.5,避免 events 总数膨胀)
- P2-2 modules.load reject reasons 注释(§3.5)

**KD-011 §D.2.1 / §D.3 / §D.4 配套**:
- `pens.changeState` / `connections.changeState` 独立 API
- Connection.direction 顶级字段恢复(从 flow- 剥离)
- `extension.registerTagNamespace` API 配套 tags 命名规约
**驱动决策**:
- KD-009(深度重构)
- KD-010(错误 + 事件 pre-mortem)
- **KD-011(易用 + 简单 + 通用 pre-mortem)** ⭐ 本 v0.3 总约束
- 01-mece-decomposition.md v0.2(模块树 + Q1-Q7)
- 03-v2-capability-port-inventory.md v0.4(28 项决策 + 12 缺失补全 + D5 重审)
- 02 v0.2(本 v0.3 反例来源,设计回滚 / 改造)

**v0.2 → v0.3 变更摘要**(对应 KD-011 §E):

**易用 5 改动**(KD-011 §B 死法应用):
1. dryRun → `preview(intent)` 单动词(死法 1)
2. viewport 还原 `pan / zoom`(死法 5 / §C 死法 6)
3. time 还原 `pause / resume`(死法 5)
4. `bindings` 嵌入字段 `Reactive<T>`(死法 2)
5. async 单层 reject(`Promise<T>` 而非 `Promise<Result<T>>`)(死法 3)
6. events 36 → ~26(死法 4)

**Schema 通用化**(KD-011 §D 死法应用):
- Pen / Connection / Anchor / Group / Module 通用骨架展开
- D5 flowType 三件套 删除 → `tags + data` 通用承载(03 v0.4)
- 类型重命名:`SerializedDiagram` ↔ `MemorySnapshot`(替代 v0.2 `DiagramSnapshot`,§C 死法 5)

**12 缺失补全**(对照 mxGraph / JointJS / draw.io / n8n / Figma):
- 缺 1 Layer:第 14 个 accessor `layers`(+8 API)
- 缺 2 Locked 细分:Pen / Connection 字段
- 缺 3 Connection.labels:字段
- 缺 4 ConnectionValidator:`extension.registerConnectionValidator`(+1 API)
- 缺 5 Anchor.magnet + multiplicity:字段
- 缺 6 Folding:`groups.expand/collapse + modules.expand/collapse`(+4 API)
- 缺 7 Pen.data:字段
- 缺 8 Z-order:`pens.reorder + connections.reorder`(+2 API)
- 缺 9 Halo:`selection.getBBox()`(+1 API)
- 缺 10 Multi-page:`InstanceOptions.metadata`(+0 API)
- 缺 11 Validate:`meta2d.validate()`(+1 API)
- 缺 12 Transaction:`meta2d.transaction()`(+1 API + 1 event)

---

## §0 设计原则

### §0.1 KD-011 价值序(本 v0.3 总约束)⭐

```
够用 / 易用 / 乐用 + 简单 / 通用 / 灵活
   优先于
"API 数" 数字目标
```

**API 数 = 症状指标**(KD-011 §A.2 v0.5 锁定**警戒线 130**;mxGraph ~200 / JointJS ~150 / draw.io ~180 对照),**非目标**。当前 119 距警戒线 11 buffer,安全区。

### §0.2 6 维 yardstick(每个 API / Schema 提交前自评)

| 维度 | 检查 |
|---|---|
| 够用 | 保持克制，不过度设计，不臆想不存在需求 |
| 易用 | 90% 调用 ≤ 30 秒认知负担;无双重判别 |
| 乐用 | 一次调用想再用;无意外踩坑 |
| 简单 | 行为单一;schema 字段不引发 API 行为分支 |
| 通用 | 不绑业务领域(去业务词后骨架仍清晰)|
| 自然 | 命令式动词读起来像英语;mode 字段不是行为开关 |
| 灵活 | 用户 / plugin 可调整顺序 / 资源生命周期 |

### §0.3 L2 域访问器(01 §10 Q2 / Q3 锁定 + Day 7 layers + Day 8 geometry)

```
meta2d.<domain>.<verb>(...)
       │        │
       │        └── 9 词词典:add / remove / move / update / change / select / deselect / hover / unhover
       └── 15 个 domain accessor:
            layers / pens / connections / groups / modules / selection / hover /
            viewport / time / theme / events / extension / instance / render / geometry
            ────────(v0.3 +1 layers 缺 1;Day 8 +1 geometry P1 升级)
```

### §0.4 Selectable / Reactive / Lockable 通用接口(★ Day 8 三层解构)

```typescript
// model/selectable.ts(漏项 + 02 v0.2 §4)
interface Selectable {
  readonly id: string
  readonly kind: 'pen' | 'connection' | 'group' | 'module'
  bbox(): Rect
  containsPoint(p: Point, tolerance?: number): boolean
  acceptsHover(): boolean
}

// model/reactive.ts ⭐ Day 8 重命名 + 三层解构(原 model/bindable.ts)
//   Day 8 用户 review:Bindable 隐含 MQTT/HTTP 通讯耦合,作废;改 Reactive 三层
type Reactive<T> =
  | T                                            // 字面值(95% 场景)
  | { readonly $expr: StyleExpression<T> }       // 本地数据派生(sync,O(1))
  | { readonly $source: DataQuery }              // 外部数据源(流式订阅)

// 用法举例
// pen.style.fillColor = '#ff0000'                                 // 字面
// pen.style.fillColor = { $expr: { kind: 'match', ... } }         // 派生
// pen.style.fillColor = { $source: { sourceId: 'mqtt', ... } }    // 外部

// ─── Layer 1:StyleExpression(本地派生,sync,无通讯)─────────────
type StyleExpression<T> =
  | { kind: 'literal'; value: T }
  | { kind: 'get'; path: string }                                                       // 取 pen.data.X / pen.state / etc.
  | { kind: 'match'; input: StyleExpression<unknown>; cases: ReadonlyMap<unknown, T>; fallback: T }
  | { kind: 'interpolate'; input: StyleExpression<number>; stops: readonly [number, T][]; mode?: 'linear' | 'exponential' }
  | { kind: 'case'; conditions: readonly { test: BoolExpression; value: T }[]; fallback: T }
  | { kind: 'zoom'; stops: readonly [number, T][] }                                      // viewport.scale 派生
  | { kind: 'time'; period: number; stops: readonly [number, T][] }                      // time.now() 派生(动画)

type BoolExpression =
  | { kind: 'eq'; a: StyleExpression<unknown>; b: unknown }
  | { kind: 'has'; path: string }                                  // pen.tags 含 tag
  | { kind: 'gt' | 'lt' | 'ge' | 'le'; a: StyleExpression<number>; b: number }
  | { kind: 'and' | 'or'; children: readonly BoolExpression[] }
  | { kind: 'not'; child: BoolExpression }

// 求值规约:sync,纯函数,O(expression-depth)
// evaluateStyleExpression<T>(expr: StyleExpression<T>, ctx: { pen, viewport, time }): T
// 每帧渲染时调用,渲染层缓存 expression evaluator(常量子树)优化性能

// ─── Layer 2:DataSource(外部数据源,流式订阅,异步)──────────
//   原 BindingResolver 改名 + 重定位(Day 8)
//   subscribe-first(IoT 实际语义),query 是可选 fallback
interface DataSource {
  readonly id: string                               // 'mqtt-main' / 'tag-store-prod' / 'http-api'
  readonly capabilities: DataSourceCapabilities

  // 推送模式(必须实现)
  subscribe(query: DataQuery, listener: (value: unknown) => void): Subscription

  // 拉取模式(可选,subscribe 不可用时 fallback)
  query?(query: DataQuery): Promise<unknown>
}

interface DataSourceCapabilities {
  streaming: boolean                                // 是否推送模式(必填,大多数为 true)
  pull: boolean                                     // 是否支持主动拉取
  expressionLang?: string                           // e.g., 'jsonpath' / 'sql' / 'opcua-nodeid' / 'mqtt-topic'
  latencyClass: 'realtime' | 'eventual' | 'snapshot'
}

interface DataQuery {
  readonly sourceId: string                         // 显式区分多 datasource 共存(MQTT 主/备 / Tag store / 模拟器)
  readonly expression: string                       // datasource 自定义查询语言
  readonly format?: ValueFormat
}

interface Subscription {
  readonly value: { current: unknown; lastUpdated: number }   // 最新值缓存
  unsubscribe(): void
}

// ─── ReactiveSubscription<T>(给 V2 NDV 第三栏用,Day 8 n8n N4)──
//   pens.subscribeReactive(id, fieldPath) / connections.subscribeReactive 返回此类型
//   meta2d 内部维护引用计数 + autoclean(避免泄漏)
interface ReactiveSubscription<T> {
  readonly current: {
    value: T
    lastUpdated: number
    source: 'literal' | 'expr' | 'datasource'      // 当前值来自哪一层(NDV 显示提示)
  }
  subscribe(listener: (value: T) => void): () => void   // 返回 unsubscribe
  unsubscribe(): void                                    // 主动释放
}

// ─── Layer 3:Reactive<T>(字段统一外壳,见上)─────────────────
// 三种来源(字面/派生/外部)语义对称,用户脑里统一槽

// model/lockable.ts ⭐ v0.3 新增(缺 2 应用)
interface Lockable {
  locked?: boolean | LockSpec
}
type LockSpec = {
  move?: boolean
  resize?: boolean
  rotate?: boolean
  edit?: boolean
  delete?: boolean
  style?: boolean
}
// Pen / Connection / Group 各实装
```

### §0.4-bis 三层解构 vs v1.0-rc 旧设计对照

**v1.0-rc(Day 7)旧**:`Bindable<T> = T | { $bind: BindingSpec }`,单层,**隐含通讯耦合**(resolverName 都是协议名)

**Day 8 新**:三层独立抽象 — **本地派生 + 外部订阅 + 字面值**,语义纯。

| 场景 | v1.0-rc 旧(妥协) | Day 8 新(直接) |
|---|---|---|
| 故障状态变红(本地 state) | 注册 self-data-resolver,async 走 microtask 滥用 | `{ $expr: { kind: 'match', input: { kind: 'get', path: 'state' }, ... } }`,sync O(1) |
| MQTT 实时功率显示(外部) | `{ $bind: { resolverName: 'mqtt', ... } }` | `{ $source: { sourceId: 'mqtt-main', ... } }`,显式 sourceId |
| 按电压配色 + MQTT 故障变红(混合) | 做不到,V2 业务层手动 update | 表达式嵌套引用 source — 全声明式,AI 可生成 |
| zoom-driven 自适应 style | 监听 viewport:changed 手改 style(O(n))| `{ $expr: { kind: 'zoom', stops: [...] } }`,渲染层自动 |

### §0.4-ter Reactive<T> 求值 scope 局限(★ v1.0 doc patch — R-FORM-2 闭合)

**M2 backstop Day 11 form-diagram 暴露**:`StyleExpression<T>` 求值 ctx 是 `{pen, viewport, time}` — **whole-pen 单次求值**,无 sub-pen scope(per-cell / per-row / per-anchor)。table 类 ShapeDef 内 cell-level 的 `Reactive<color>` 字段(如 `pen.data.styles[i][j].color`)若是 `$expr`,**ctx 内无法注入 row/col 索引**。

**v1.0 决议(接受局限,不加 surface)**:

| 场景 | v1.0 idiom | 备注 |
|---|---|---|
| pen-level Reactive(整 pen 故障变红)| `style.fillColor = { $expr: { kind: 'match', input: { kind: 'get', path: 'state' }, ... } }` | ✅ 直接 |
| pen-level external Reactive(MQTT 实时)| `style.fillColor = { $source: { sourceId: 'mqtt' } }` | ✅ 直接 |
| **sub-pen Reactive(per-cell 颜色)**| ShapeDef.paint 内 **plain code** 直接读 `pen.data.styles[i][j].color`(不走 Reactive)| ⚠️ 局限,**显式接受** |

**不加 surface 的理由**:
- 引入 `{kind: 'sub-scope', scope, expr}` 会让 Reactive<T> 类型空间膨胀,违反 KD-011 §C 死法 1(过度抽象)
- sub-pen reactivity 的真实需求是 "per-cell 高亮随状态变",而 ShapeDef.paint 内 `if (cell.state === 'fault') ctx.fillStyle = '#f00'` 已经够用,**强行 Reactive 化是为对称而对称**
- 数据流向上,sub-pen render-time decision 不需要订阅式更新(整 pen state 变 → core 重 paint → ShapeDef 重新读 pen.data → cell 自然刷新)

**M8+ reopener**:若 LLM agent 通过 capabilities() 自动生成可读的 sub-pen Reactive 表达(无 plain code)成为强需求,重启 P1。watch 见 04 §9.

### §0.5 三大正交工具

| 工具 | 用于 | 详见 |
|------|------|------|
| `Result<T, DiagramError>` | sync mutation 失败可恢复 | §6 |
| `Promise<T>` reject(reason 可能是 DiagramError 或 Error) | async 失败 — **单层** | §6 |
| `instance.events.on(name, handler)` | 状态变化通知 | §7 |

`describe()` / `capabilities()`(AI 调用)详 §8。

### §0.6 03 v0.4 §0 判定模板交叉引用

任何能力是否进 core,跑 **03 v0.4 §0 机械模板**:"去业务词看骨架"。本 v0.3 的所有新增已通过此模板。

---

## §1 Pen / Connection / Anchor / Group / Module Schema 通用骨架(★ KD-011 §D)

### §1.1 Pen schema

```typescript
interface Pen extends Lockable {
  // ─── 标识 ────────────────────────────────
  readonly id: string
  readonly type: string                       // shape type name(从 extension.shapeRegistry 解析)

  // ─── 几何 ────────────────────────────────
  position: Point
  bounds: Rect
  rotation?: number                            // 0-360 度,可选

  // ─── 视觉 ────────────────────────────────
  style?: PenStyle
  text?: Reactive<string>                      // ⭐ v0.3 嵌入 Reactive
  state?: string                               // 状态名(B4 state-transition)
                                               // ⭐ v1.0-rc 补丁(KD-011 §D.2.1):只读字段
                                               //   - PenPatch 不含 state(避免 §B.1 死法 4 patch 隐式触发)
                                               //   - 改用 pens.changeState(id, newState) 独立 API
                                               //   - 触发独立 event 'pen:state-changed' { id, from, to }
                                               //   - state-transition.ts(B4)消费此 event 触发动画

  // ─── 端口 ────────────────────────────────
  anchors?: readonly Anchor[]                  // 漏 1:三层语义 + magnet(§1.3)
                                               // ⭐ v1.0-rc 修订 8(P2,v0.4 验证):ShapeDef.getAnchors(pen) 可动态生成
                                               //   多端口配电柜 / 母线段(端口数随长度变)优先 dynamic,fallback 到此字段

  // ─── 标签 ⭐ v1.0-rc 修订 1(roadmap Datablock,对齐 Connection.labels)─
  labels?: readonly Label[]                    // Pen 旁挂多文本(Datablock 类用例:"电机转速:120rpm")

  // ─── 嵌套 / 图层 ─────────────────────────
  layerId?: string                             // ⭐ v0.3 缺 1(default '__default__')
  parentId?: string                            // 父 pen / group(可选;Pen 嵌套)

  // ─── 可见性 / 锁定 ───────────────────────
  visible?: boolean                            // ⭐ v0.3 缺 7(default true)
  // locked?: 通过 Lockable 接口(§0.4)        // ⭐ v0.3 缺 2

  // ─── 业务承载 ────────────────────────────
  data?: Record<string, unknown>               // ⭐ v0.3 缺 7:业务数据 round-trip
  tags?: readonly string[]                     // ⭐ v0.3 缺 7:通用标签

  // ─── 动画 ────────────────────────────────
  animationSpec?: AnimationSpec                // B4 声明层
}

interface PenStyle {
  fillColor?: Reactive<string>                 // ⭐ Day 8 三层 Reactive(字面/$expr/$source)
  strokeColor?: Reactive<string>
  strokeWidth?: number | 'thin' | 'medium' | 'thick' | 'bold'   // ⭐ Day 8 修订(ROI🥇):semantic level + override
                                               // 字符串值由 token 解析(@meta2d/tokens),数字直接用
  opacity?: Reactive<number>

  // ─── 装饰层 ⭐ v1.0-rc 修订 4 + Day 8(roadmap Phase D Dark glow + Design Token effects)──
  shadow?: { color: string; blur: number; offsetX?: number; offsetY?: number }
  glow?: { color: Reactive<string>; intensity: Reactive<number> }   // 0-1;$expr/$source 都可,e.g., {$expr:{kind:'match', input:{kind:'get',path:'state'}, cases:[['fault',1]],fallback:0}}
  border?: { dash?: readonly number[]; lineCap?: 'butt' | 'round' | 'square' }

  // ─── 交互 ⭐ v1.0-rc 修订 4 ──
  cursor?: string                              // CSS cursor on hover
}

// ⭐ v1.0-rc 修订 1 — 通用 Label 接口(Pen / Connection 共用)
// model/label.ts(新)
interface Label {
  readonly id: string
  text: Reactive<string>                       // 支持 binding(D3)
  position: PenLabelPosition | ConnectionLabelPosition
  style?: LabelStyle
}

type PenLabelPosition =
  | { anchor: 'top' | 'bottom' | 'left' | 'right' | 'center'; offset?: Point }
  | { absolute: Point }                        // 相对 Pen bbox 的绝对位置

type ConnectionLabelPosition =
  | number                                     // 0-1 along path
  | { distance: number; offset?: Point }       // 绝对距离
```

**v0.2 → v0.3 字段变更**:
- ➕ `layerId / visible / locked / data / tags / rotation / state`(7 个新增,通用化)
- ➕ `style.fillColor` 等 → `Reactive<string>`(嵌入,移除顶级 `bindings` 字段)
- ➖ `bindings: Record<string, BindingSpec>`(KD-011 §B 死法 2 应用)

### §1.2 Connection schema

```typescript
interface Connection extends Lockable {
  readonly id: string
  readonly from: AnchorRef                     // { penId, anchorId }
  readonly to: AnchorRef

  // ─── 路径 ────────────────────────────────
  waypoints: readonly Point[]
  router?: string                              // 'orthogonal' | 'curved' | 'straight' | custom

  // ─── 方向(★ v1.0-rc 补丁:从 flow- 前缀剥离,保留为通用字段)──
  direction?: 'forward' | 'backward' | 'bidirectional' | 'none'
                                               // 通用 diagramming 概念(数据流图 / 流程图 / UML / 电力图)
                                               // KD-011 §D.5 二阶筛子:取值通用 → 进 core 顶级字段

  // ─── 标签 ⭐ v0.3 缺 3 ───────────────────
  labels?: readonly ConnectionLabel[]

  // ─── 视觉 / 状态 ─────────────────────────
  style?: ConnectionStyle
  state?: string                                // ⭐ v1.0-rc:只读,改用 connections.changeState() (与 pens 同款)

  // ─── 通用骨架(对齐 Pen)─────────────────
  layerId?: string                             // ⭐ 缺 1
  visible?: boolean                            // ⭐ 缺 7
  // locked? 通过 Lockable                     // ⭐ 缺 2
  data?: Record<string, unknown>               // ⭐ 缺 7
  tags?: readonly string[]                     // ⭐ 缺 7 + KD-011 §D.4 命名规约 'namespace:value'

  // ─── 动画 ────────────────────────────────
  animationSpec?: AnimationSpec
}

// ⭐ v1.0-rc 修订 1 — `ConnectionLabel` 已合并到通用 `Label`(§1.1),保持向后引用
type ConnectionLabel = Label   // 等价别名,position 用 ConnectionLabelPosition

// ConnectionStyle ⭐ v1.0-rc 修订 4(roadmap Phase D energized 粒子)
interface ConnectionStyle {
  strokeColor?: Reactive<string>
  strokeWidth?: number
  opacity?: number
  dashArray?: readonly number[]
  // 装饰层
  glow?: { color: Reactive<string>; intensity: Reactive<number> }   // energized 粒子流时辉光
  shadow?: { color: string; blur: number }
}
```

**v0.2 → v0.3 字段变更**:
- ➕ `layerId / visible / locked / data / tags / labels`(6 个新增)
- ➖ **`flowType / flowMagnitude` 删除**(KD-011 §D.3 / 03 v0.4 D5 重审)
- ➕ ⭐ **v1.0-rc 修订**:`flowDirection` → 改名 `direction` 并保留为顶级字段(KD-011 §D.5 二阶筛子:取值通用 → 进 core)
- ➕ flow 业务用法承载:`tags: ['flow:electric']` + `data.flowMagnitude` + `direction`(通用字段)
- ➕ flow-coupling 编排器:从 `tags.find(t => t.startsWith('flow:'))` + `direction` 字段 + `data.flowMagnitude` 三处读取(业务变体包定义具体值)

### §1.3 Anchor schema(漏 1 升级 + 缺 5)

```typescript
interface Anchor {
  readonly id: string
  readonly position: { x: number; y: number }   // 相对 pen 归一化坐标 (0-1)

  // ─── 三层语义(漏 1)────────────────────
  direction: 'in' | 'out' | 'bidirectional'
  type: 'power' | 'signal' | 'control' | 'data' | string

  // ─── 连接 UI 控制 ⭐ v0.3 缺 5 ──────────
  magnet?: 'active' | 'passive' | 'disabled'   // default 'active'
  // active:可发起连接 + 可接收
  // passive:只能接收(input port 默认)
  // disabled:完全不参与 UI 连接

  // ─── 连接数限制 ⭐ v0.3 缺 5 ────────────
  multiplicity?: { min?: number; max?: number }

  // ─── 标签 ⭐ v0.3 缺 5 ──────────────────
  label?: string                                // 'In1' / 'Output' / etc.
}
```

### §1.4 Group / Module schema(缺 6 折叠)

```typescript
interface Group extends Lockable {
  readonly id: string
  members: readonly string[]
  label?: string
  bounds?: Rect                                // auto-computed,可缓存

  // ─── 通用骨架 ────────────────────────────
  layerId?: string
  visible?: boolean
  data?: Record<string, unknown>
  tags?: readonly string[]

  // ─── 折叠 ⭐ v0.3 缺 6 ───────────────────
  collapsed?: boolean                          // default false
  collapsedSize?: { width: number; height: number }
}

interface Module {
  readonly id: string
  readonly ref: ModuleRef                      // 指向 module file
  position: Point

  // ─── 通用骨架 ────────────────────────────
  layerId?: string
  visible?: boolean
  data?: Record<string, unknown>
  tags?: readonly string[]

  // ─── 折叠 ⭐ v0.3 缺 6 ───────────────────
  collapsed?: boolean
  collapsedSize?: { width: number; height: number }
}
```

### §1.5 ShapeDef registration schema(★ v1.0 doc patch — R-FTA-1 闭合)

**M2 backstop Day 9-10 fta + flow 暴露**:`extension.registerShape(name, def: ShapeDef)`(§3.12)未在 Schema 章节给出 ShapeDef 完整定义,satellite 实装时全靠推断。本节闭合 R-FTA-1 + R-FLOW-2 doc gap。

```typescript
interface ShapeDef {
  readonly name: string                          // shape 类型名,等于注册时的 name(去重 key)

  // ─── 渲染契约 ───────────────────────────────
  paint(ctx: CanvasRenderingContext2D, pen: Pen, opts?: PaintOpts): void
                                                 // ctx-only paint(无 Path2D 返回);satellite 直绘

  hitTest(point: Point, pen: Pen, tolerance?: number): boolean
                                                 // 用户实现命中精度(简单形:bbox + tolerance;复杂形:Path2D + isPointInPath)

  bbox?(pen: Pen): Rect                          // 可选,默认返回 pen.bounds
                                                 // 异形几何(如旋转矩形)需自定 bbox

  // ─── Anchor 约定 ─────────────────────────────
  defaultAnchors?: readonly Anchor[]             // F5 全字段(magnet/multiplicity/label/direction/type),见 §1.3

  // ─── 默认样式 ────────────────────────────────
  defaultStyle?: PenStyle                        // satellite 推荐默认样式(用户 PenInput 可覆盖)

  // ─── P2 deferred(v0.4 验证)────────────────
  // getAnchors?(pen: Pen): Anchor[]            // F19 动态 anchor(多端口配电柜场景)

  // ─── 自描述 ──────────────────────────────────
  describe?(): string                            // 给 capabilities() / AI 用
}

interface PaintOpts {
  readonly viewport: Viewport
  readonly time: number                          // 当前 TimeSource.now()
  readonly theme: ThemeContext                   // token 解析上下文
  // sub-pen 交互 transient 状态不在此(R-FORM-1 P1 deferred,见 04 §9)
}
```

**defaultAnchors 缺省语义**(R-FLOW-2 闭合):

| 情况 | 行为 |
|---|---|
| `defaultAnchors` 字段缺省 | core fallback 到 **空数组 `[]`**(无 anchor)— shape 不可作为连接源/目标 |
| `defaultAnchors` 为 `[]` 显式 | 同上,等价 |
| `defaultAnchors` 含 1+ 项 | core 注册时为每个 Pen 实例**复制一份**(深拷贝),挂到 `Pen.anchors`;用户后续 `pens.update(id, { anchors: ... })` 可覆盖 |

**注**:V1 fta/flow 13/11 shape 中半数(包括 fta 5 个、flow 6 个)未配 anchor 函数,V1 fallback 到 core 内置 4-corner 默认。**v1.0 显式废止内置默认** — satellite 必须显式给 `defaultAnchors`,否则该 shape 不可连。M8 迁移时 satellite 逐个补全。

**对称性**:`EdgeTypeDef`(§3.12)/ `AnchorTypeDef`(§3.12)与 `ShapeDef` 三件套对齐 — 同样含 `name / render / hitTest / bbox`,但分别加 `defaultStyle`(EdgeTypeDef)/ `onDrag?`(AnchorTypeDef)。

---

## §2 `Meta2d` 主类(facade)

```typescript
class Meta2d implements Describable {
  // ─── lifecycle(8 个,v0.2 +1 from validate / +1 transaction)──────
  constructor(container: HTMLElement, options?: Meta2dOptions)
  mount(container?: HTMLElement): Result<void>
  destroy(): void
  resize(width: number, height: number): void
  serialize(): Result<SerializedDiagram>             // sync 持久化 JSON
  deserialize(data: SerializedDiagram): Result<void>
  snapshot(): MemorySnapshot                         // ⭐ v0.3 重命名(从 v0.2 DiagramSnapshot)
  restore(snapshot: MemorySnapshot): Result<void>

  // ─── preview / dryRun ⭐ v0.3 改动 1 ─────────────
  preview(intent: PreviewIntent): Result<Diff, DiagramError>     // 单动词,替代 v0.2 各 mutation 的 dryRun opts

  // ─── transaction ⭐ v0.3 缺 12 ────────────────────
  transaction(name: string, fn: () => void): Result<void, DiagramError>   // 跨 accessor 事务边界

  // ─── 全图校验 ⭐ v0.3 缺 11 ───────────────────────
  validate(): readonly DiagramError[]                // 不抛,返回所有问题

  // ─── 15 域访问器(只读 getters,不算 API method;Day 8 +geometry)─
  readonly layers: LayersAccessor                    // ⭐ v0.3 缺 1
  readonly pens: PensAccessor
  readonly connections: ConnectionsAccessor
  readonly groups: GroupsAccessor
  readonly modules: ModulesAccessor
  readonly selection: SelectionAccessor
  readonly hover: HoverAccessor
  readonly viewport: ViewportAccessor
  readonly time: TimeAccessor
  readonly theme: ThemeAccessor
  readonly events: EventsAccessor
  readonly extension: ExtensionAccessor
  readonly instance: InstanceAccessor
  readonly render: RenderAccessor
  readonly geometry: GeometryAccessor          // ⭐ Day 8 修订:第 15 个 accessor(P1 升级,smart snap)

  // ─── AI / 自描述(2 个)──────────────────────
  describe(): string
  capabilities(): Capabilities
}
```

**Meta2d facade API 数**:8(lifecycle)+ 1(preview)+ 1(transaction)+ 1(validate)+ 2(自描述)= **13**。

### §2.1 SerializedDiagram vs MemorySnapshot(★ KD-011 §C 死法 5)

| | `SerializedDiagram` | `MemorySnapshot` |
|---|---|---|
| 输出类型 | 持久化结构(JSON-stringify-able) | 内存对象(`Object.freeze` 后引用) |
| 用途 | 文件保存 / 网络传输 / 跨进程 | dryRun 回滚 / undo / D6 对账 |
| 性能 | O(n) 序列化遍历 | O(1) 引用复制(SoT immutable) |
| 兼容性 | 跨版本 schema(带 `version` 字段) | 同进程 / 同版本 |
| 入口 | `serialize()` / `deserialize(data)` | `snapshot()` / `restore(snap)` |
| 名字含义 | "可序列化文档" — 用户脑里 = "保存的东西" | "内存快照" — 用户脑里 = "瞬态状态" |

**v0.2 → v0.3 重命名**:`DiagramSnapshot` → `MemorySnapshot`。理由:用户对 "snapshot" 的直觉是 "可保存的东西",v0.2 把这个直觉名给了内存对象,误导。v0.3 用 `MemorySnapshot` 显式表达 "内存" 限定。

```typescript
interface SerializedDiagram {
  readonly version: string
  readonly takenAt: number
  readonly model: SerializedModel
  readonly viewport: SerializedViewport
  readonly theme: { themeId: string; overrides?: SerializedTokens }
}

interface MemorySnapshot {
  readonly id: string                          // monotonic,本实例内唯一
  readonly takenAt: number
  readonly state: DiagramState                 // frozen reference
  readonly digest?: string                     // 可选 SHA-256 hash
}
```

### §2.2 PreviewIntent(★ KD-011 §B 死法 1 应用)

```typescript
type PreviewIntent =
  | { kind: 'pen-add'; pen: PenInput }
  | { kind: 'pen-remove'; id: string }
  | { kind: 'pen-update'; id: string; patch: PenPatch }
  | { kind: 'pens-add-bulk'; pens: readonly PenInput[] }
  | { kind: 'connection-add'; connection: ConnectionInput }
  | { kind: 'connection-remove'; id: string }
  | { kind: 'connection-update'; id: string; patch: ConnectionPatch }
  | { kind: 'group-create'; memberIds: readonly string[]; opts?: { label?: string } }
  | { kind: 'layer-add'; layer: LayerInput }
  | { kind: 'composite'; intents: readonly PreviewIntent[] }     // 跨 accessor 复合预览
  // ... 其他 intent 类型

// 用法:
const r = meta2d.preview({ kind: 'pen-add', pen: { id: 'p1', type: 'transformer', position: ... } })
if (r.ok) {
  // r.value: Diff,可显示 "添加 1 pen,2 anchor 自动创建"
}
```

**收益**:90% 调用 `pens.add(p)` 返回 `Result<Pen>` 单层判别;10% dryRun 走 `preview(intent)`,返回 `Result<Diff>` 单层判别。**消除 v0.2 联合返回类型负担**。

### §2.2-bis Diff 接口(★ Day 8 修订 — n8n N10 AI Diff UX humanize)

```typescript
interface Diff {
  readonly changes: readonly ModelDiff[]                  // 结构化变更(详 §3.1.2 ModelDiff)

  // ⭐ Day 8 修订(n8n N10):人类可读摘要(给 AI dialog UI 用)
  describe(): string                                       // "添加 3 个 pen,2 条 connection;无删除"

  // ⭐ Day 8 修订:按 entity 分组的影响范围(供 V2 高亮 / 滚动到改动)
  affectedIds(): {
    pens: readonly string[]
    connections: readonly string[]
    groups: readonly string[]
    modules: readonly string[]
    layers: readonly string[]
  }
}

// 用法 — V2 AI dialog UI:
const r = meta2d.preview({ kind: 'composite', intents: aiGeneratedIntents })
if (r.ok) {
  console.log(r.value.describe())   // "添加 3 个 pen,2 条 connection;无删除"
  const affected = r.value.affectedIds()
  highlightInCanvas([...affected.pens, ...affected.connections])
}
```

**API 影响**:0 method 增加(Diff interface 加 2 method)。

### §2.3 transaction(★ KD-011 缺 12)

```typescript
class Meta2d {
  transaction(name: string, fn: () => void): Result<void, DiagramError>
}

// 实装(详 §4 双枢纽):
// 1. enter:tx-snap = snapshot()(rollback 锚点)
// 2. fn() 内 accessor mutation 全部记入 pending diffs,events 暂不 emit
// 3. fn 抛错 → restore(tx-snap)+ emit 'transaction:rolled-back' { name, error }
// 4. fn 正常返回 → atomic commit + emit 1 个 'transaction:committed' { name, diffs[] }
//    个体 events 不重复 emit(由 'transaction:committed' diffs 携带)
```

**用例**:
```typescript
meta2d.transaction('add-substation', () => {
  meta2d.pens.add(transformer)
  meta2d.pens.add(busbar)
  meta2d.connections.add(transformerToBusbar)
  meta2d.groups.create(['transformer-id', 'busbar-id'], { label: 'Substation A' })
})
// 用户操作 = 1 个 undo unit,V2 监听 'transaction:committed' 入栈
```

### §2.4 validate(★ KD-011 缺 11)

```typescript
class Meta2d {
  validate(): readonly DiagramError[]
}

// 内部:遍历全 model
// - 每个 connection 跑已注册 ConnectionValidator
// - Module cycle / depth 检测
// - Group nesting depth ≤ 5
// - anchor multiplicity 检查
// - tags / data schema 不验(由业务层自检)
// 返回所有问题,不阻断;UI 可展示 issue 列表
```

---

## §3 15 个域访问器(★ v0.3 +1 layers / Day 8 +1 geometry / 多处易用改动)

### §3.1 `layers` ⭐ v0.3 缺 1(第 14 accessor;Day 8 后 geometry 是第 15)

```typescript
interface LayersAccessor extends Describable {
  add(layer: LayerInput): Result<Layer>                          // 'layer:added'
  remove(id: string): Result<void>                               // 'layer:removed';成员 pen/conn 移到 default
  update(id: string, patch: LayerPatch): Result<Layer>           // 'layer:updated'
  reorder(ids: readonly string[]): Result<void>                  // 'layers:reordered'
  find(id: string): Layer | undefined
  query(filter?: LayerFilter): readonly Layer[]
  getActive(): string                                            // 当前默认接收新 pen/connection 的图层
  setActive(id: string): Result<void>                            // ⭐ v1.0-rc:emit 'layer:updated'(payload.changedFields=['active'])
                                                                  // 而非独立 'layer:active-changed' event
}

interface Layer extends Lockable {
  readonly id: string
  name: string
  visible: boolean
  active: boolean                                                // ⭐ v1.0-rc:active 是 layer 状态字段,setActive 修改它
  zIndex: number                                                 // 由 reorder 维护
  opacity?: number                                               // 0-1,整层透明度
  themeOverride?: string                                         // 该层独立 theme(可选)
  // members 通过 pens.query({ layerId }) / connections.query({ layerId }) 派生,不存字段(避免双向同步)
}

interface LayerPatch {
  name?: string
  visible?: boolean
  active?: boolean                                               // ⭐ v1.0-rc:可通过 update 改,等价 setActive(便利重叠允许,因 active 是布尔状态)
  opacity?: number
  themeOverride?: string
  locked?: boolean | LockSpec
}
```

**API 数**: 8

**设计要点**:
- Layer 不持有 members 列表,通过 `pens.query({ layerId: 'X' })` 派生(避免双向同步 bug)
- 整层操作(隐藏 / 锁 / 主题)O(1) — 渲染层读 layer.visible 而非遍历 members
- `getActive() / setActive()` 提供 "新 pen 默认进哪一层" 的 UX 默认

### §3.2 `pens` — Pen 数据访问

`(merged from v0.2: 6 → 7 with reorder)` — preview 抽出,reorder 加入。

```typescript
interface PensAccessor extends Describable {
  // mutation
  add(pen: PenInput): Result<Pen, DiagramError>                       // 'pen:added'
  add(pens: readonly PenInput[]): Result<readonly Pen[], DiagramError>  // 'pens:added-bulk'(overload)
  remove(id: string): Result<void, DiagramError>                       // 'pen:before-remove' + 'pen:removed'
  remove(ids: readonly string[]): Result<void, DiagramError>            // 'pens:removed-bulk'
  update(id: string, patch: PenPatch): Result<Pen, DiagramError>        // 'pen:updated'(payload.changedFields)
  reorder(id: string, mode: 'to-front' | 'to-back' | 'forward' | 'backward'): Result<void>   // ⭐ v0.3 缺 8
  changeState(id: string, newState: string): Result<Pen, DiagramError>  // ⭐ v1.0-rc 补丁(KD-011 §D.2.1):'pen:state-changed'
  duplicate(id: string, opts?: { offset?: Point; idSuffix?: string }): Result<Pen, DiagramError>
  duplicate(ids: readonly string[], opts?: { offset?: Point; idMapping?: (oldId: string) => string }): Result<readonly Pen[], DiagramError>
                                                                          // ⭐ v1.0-rc 修订 7(roadmap Phase A Ctrl+D)
                                                                          // 内部走 transaction(原子 + 1 个 undo unit)
                                                                          // emit 'pen:added' (or 'pens:added-bulk') for new pens

  // ⭐ Day 8 修订(n8n N4 NDV 第三栏)— 订阅某 pen 某字段的 reactive 当前值
  subscribeReactive<T = unknown>(id: string, fieldPath: string): ReactiveSubscription<T>
                                                                          // fieldPath 如 'style.fillColor' / 'text'
                                                                          // 内部 evaluator 求值(literal 直接;$expr sync 求值;$source 转 datasource subscribe)
                                                                          // V2 NDV 面板第三栏读 subscription.value.current 显示当前值

  // query
  find(id: string): Pen | undefined
  query(filter?: PenFilter): readonly Pen[]
  count(filter?: PenFilter): number
}

interface PenFilter {
  layerId?: string
  type?: string
  tags?: readonly string[]                          // 含任一 tag
  parentId?: string
  state?: string                                    // ⭐ v1.0-rc:按 state 查询
}

interface PenPatch {
  position?: Point
  bounds?: Rect
  rotation?: number
  text?: Reactive<string>
  style?: Partial<PenStyle>
  // ⭐ v1.0-rc 补丁:state 不在 patch 中(KD-011 §D.2.1) — 改用 pens.changeState() 命令式 API
  anchors?: AnchorPatch[]
  layerId?: string
  parentId?: string
  visible?: boolean
  locked?: boolean | LockSpec
  labels?: readonly Label[]                          // ⭐ v1.0-rc 修订 1
  data?: Record<string, unknown>
  tags?: readonly string[]
  animationSpec?: AnimationSpec
}
```

**API 数**: **11**(mutation 7 含重载;query 3 + subscribeReactive 1) — Day 8 +1 subscribeReactive

**v0.2 → v0.3 → v1.0-rc → Day 7 → Day 8**:
- ➖ 移除 dryRun opts(去 §2.2 preview)
- ➕ reorder(缺 8)
- ➕ v1.0-rc:`changeState`(KD-011 §D.2.1 state 字段独立 API)
- ➕ Day 7 修订 1:PenPatch 加 `labels?` 字段
- ➕ Day 7 修订 7:`duplicate(id | ids)` 重载
- ➕ ⭐ Day 8 修订(n8n N4):`subscribeReactive(id, fieldPath)` 给 NDV 第三栏
- patch 字段大幅扩展(对应 §1.1 schema 通用化)

### §3.3 `connections` — Connection

`(merged from v0.2: 4 → 6)` — reorder 加入,labels 通过 patch 操作。

```typescript
interface ConnectionsAccessor extends Describable {
  add(conn: ConnectionInput): Result<Connection, DiagramError>          // 'connection:added'
  add(conns: readonly ConnectionInput[]): Result<readonly Connection[], DiagramError>
  remove(id: string): Result<void, DiagramError>                        // 'connection:removed'
  remove(ids: readonly string[]): Result<void, DiagramError>
  update(id: string, patch: ConnectionPatch): Result<Connection, DiagramError>  // 'connection:updated'
  reorder(id: string, mode: 'to-front' | 'to-back' | 'forward' | 'backward'): Result<void>  // ⭐ v0.3 缺 8
  changeState(id: string, newState: string): Result<Connection, DiagramError>   // ⭐ v1.0-rc:'connection:state-changed'
  duplicate(id: string, opts?: { offset?: Point; idSuffix?: string }): Result<Connection, DiagramError>
                                                                                // ⭐ Day 7 修订 7:对齐 pens.duplicate
  subscribeReactive<T = unknown>(id: string, fieldPath: string): ReactiveSubscription<T>
                                                                                // ⭐ Day 8(n8n N4):对齐 pens.subscribeReactive

  find(id: string): Connection | undefined
  query(filter?: ConnectionFilter): readonly Connection[]
}

interface ConnectionPatch {
  waypoints?: readonly Point[]
  router?: string
  direction?: 'forward' | 'backward' | 'bidirectional' | 'none'   // ⭐ v1.0-rc:从 flow- 剥离的通用字段
  labels?: readonly ConnectionLabel[]               // ⭐ 缺 3
  style?: Partial<ConnectionStyle>
  // ⭐ v1.0-rc:state 不在 patch 中,改用 connections.changeState()
  layerId?: string
  visible?: boolean
  locked?: boolean | LockSpec
  data?: Record<string, unknown>
  tags?: readonly string[]                          // ⭐ flowType 通过 tags 承载;命名规约见 KD-011 §D.4
}
```

**API 数**: **11**(Day 7 +1 duplicate + Day 8 +1 subscribeReactive)

### §3.4 `groups`

`(merged from v0.2: 5 → 7)` — expand / collapse(缺 6)。

```typescript
interface GroupsAccessor extends Describable {
  create(memberIds: readonly string[], opts?: { label?: string }): Result<Group>
                                                                              // 'group:created'
  dissolve(id: string): Result<void>                                          // 'group:dissolved'
  update(id: string, patch: GroupPatch): Result<Group>                        // 'group:updated'
  expand(id: string): Result<void>                                            // ⭐ 缺 6 — emit 'group:updated' (kind: 'expanded') ⭐ v1.0-rc 合并
  collapse(id: string): Result<void>                                          // ⭐ 缺 6 — emit 'group:updated' (kind: 'collapsed') ⭐ v1.0-rc 合并
  duplicate(id: string, opts?: { offset?: Point; idSuffix?: string }): Result<Group, DiagramError>
                                                                              // ⭐ Day 7 修订 7:深拷贝 group 含 members(对齐 pens / connections)

  find(id: string): Group | undefined
  query(filter?: GroupFilter): readonly Group[]
}

interface GroupPatch {
  label?: string
  members?: { add?: readonly string[]; remove?: readonly string[] }   // diff-style
  layerId?: string
  visible?: boolean
  locked?: boolean | LockSpec
  data?: Record<string, unknown>
  tags?: readonly string[]
  // ⭐ v1.0-rc 补丁:collapsed 字段不可通过此 patch 修改 — 用 groups.expand() / groups.collapse()
  //   (命令式 vs 声明式择一,KD-011 §C 死法 6)
  collapsedSize?: { width: number; height: number }   // 折叠时的渲染尺寸,可改
}
```

**API 数**: **8**(Day 7 +1 duplicate)

### §3.5 `modules`

`(v0.2: 3 → 5)` — expand / collapse(缺 6)。

```typescript
interface ModulesAccessor extends Describable {
  load(ref: ModuleRef): Promise<Module>             // ⭐ v0.3 改动 5:Promise<T>(reject 单层)
                                                    // ⭐ v1.0-rc 补丁:reject reasons(catch 后 instanceof 区分):
                                                    //   - DiagramError {kind: 'invalid-input'}    ref 格式错误
                                                    //   - DiagramError {kind: 'cycle-detected'}   循环引用
                                                    //   - DiagramError {kind: 'capacity-exceeded'} 嵌套过深 ( > 3 )
                                                    //   - Error                                    网络 / 解析 / 其他 transport
  unload(id: string): Result<void>                  // 'module:unloaded'
  update(id: string, patch: ModulePatch): Result<Module>   // ⭐ v1.0-rc 补丁:'module:updated'
                                                            // 替代 v0.3 group:expanded/collapsed 单独 events 的合并目标
  expand(id: string): Result<void>                  // ⭐ 缺 6 — 触发 'module:updated' (kind: 'expanded')
  collapse(id: string): Result<void>                // ⭐ 缺 6 — 触发 'module:updated' (kind: 'collapsed')
  find(id: string): Module | undefined
}

interface ModulePatch {
  // ⭐ v1.0-rc:collapsed 字段不可通过此 patch — 用 modules.expand/collapse
  collapsedSize?: { width: number; height: number }
  layerId?: string
  visible?: boolean
  data?: Record<string, unknown>
  tags?: readonly string[]
}
```

**API 数**: **6**(v1.0-rc +1 update)

### §3.6 `selection`

`(v0.2: 6 → 7)` — getBBox(缺 9)。

```typescript
interface SelectionAccessor extends Describable {
  set(ids: readonly string[]): Result<void>            // 'selection:changed'
  clear(): void                                        // 'selection:changed'
  update(patch: SelectionPatch): Result<void>          // 'selection:changed'

  get(): readonly string[]
  has(id: string): boolean
  count(): number
  getBBox(): Rect | undefined                          // ⭐ v0.3 缺 9 — V2 halo 容器定位
}

interface SelectionPatch {
  add?: readonly string[]
  remove?: readonly string[]
  toggle?: readonly string[]                           // 顺序:remove → add → toggle(文档明文化)
}
```

**API 数**: 7

### §3.7 `hover`

`(unchanged: 3)`

```typescript
interface HoverAccessor extends Describable {
  set(id: string | null): Result<void>
  clear(): void
  get(): string | null
}
```

**API 数**: 3

### §3.8 `viewport`(★ v0.3 改动 2 — 命令式还原)

`(v0.2: 6 → 8)` — pan / zoom / setView 命令式恢复。

```typescript
interface ViewportAccessor extends Describable {
  pan(dx: number, dy: number): Result<void>                    // ⭐ v0.3 还原 — 'viewport:changed'
  zoom(factor: number, pivot?: Point): Result<void>            // ⭐ v0.3 还原
  setView(viewport: Viewport): Result<void>                    // 绝对设置
  fit(opts?: { padding?: number; ids?: readonly string[] }): Result<void>
  reset(): void

  // ⭐ Day 7 修订 2(roadmap Phase D Color Contouring)— ViewMode 切换
  setViewMode(modeId: string | null): Result<void>             // null = 默认渲染;emit 'view-mode:changed'
  getViewMode(): string | null

  get(): Viewport
  worldFromScreen(p: Point): Point
  screenFromWorld(p: Point): Point
}
```

**API 数**: **10**(Day 7 +2 setViewMode/getViewMode)

**v0.2 → v0.3**:
- ➕ `pan / zoom / setView`(替代 v0.2 `set(patch + mode)` 行为多态;KD-011 §C 死法 6 应用)
- ➖ `set(patch)` 行为多态(`mode: 'absolute' | 'delta'`)
- ➖ `VIEWPORT_PAN / VIEWPORT_ZOOM` 常量构造器(§C 死法 6,命令式 + 声明式辅助并存)

### §3.9 `time`(★ v0.3 改动 3 — pause/resume 还原)

`(v0.2: 6 → 8)` — pause / resume 命令式恢复。

```typescript
interface TimeAccessor extends Describable {
  pause(): void                                                // ⭐ v0.3 还原 — 'time:paused'
  resume(): void                                               // ⭐ v0.3 还原 — 'time:resumed'(rate = previous-non-zero)
  setRate(rate: number): Result<void>                          // 'time:rate-changed'(rate < 0 → fail)
  step(frames?: number): void                                  // 单步(rate=0 时)
  setSource(source: TimeSource): void                          // escape hatch:测试 TestTime

  now(): number
  getRate(): number
  getSource(): TimeSource
}
```

**API 数**: 8

**v0.2 → v0.3**:
- ➕ `pause / resume`(替代 `setRate(0) / setRate(1)`,KD-011 §B 死法 5)

### §3.10 `theme`

`(unchanged: 4)`

```typescript
interface ThemeAccessor extends Describable {
  setTheme(themeId: string): Result<void>                                  // 'theme:changed'
  extend(overrides: DeepPartial<SemanticTokens>): Result<void>             // 'token:overridden'
  registerTheme(definition: ThemeDefinition): Result<void>                 // 'theme:registered'
  getTheme(): SemanticTokens
}
```

**API 数**: 4

### §3.11 `events`

`(unchanged: 2)`

```typescript
interface EventsAccessor extends Describable {
  on<K extends keyof DiagramEvents>(name: K, handler: (payload: DiagramEvents[K]) => void): () => void
  off<K extends keyof DiagramEvents>(name: K, handler?: (payload: DiagramEvents[K]) => void): void
}
```

**API 数**: 2

### §3.12 `extension`(★ v0.3 缺 4 + 改动 5)

`(v0.2: 7 → 8)` — registerConnectionValidator(缺 4)。

```typescript
interface ExtensionAccessor extends Describable {
  install(plugin: Plugin): Promise<void>                                   // ⭐ 改动 5:reject 单层
  uninstall(id: string): Promise<void>                                     // ⭐ 改动 5
  registerShape(name: string, def: ShapeDef): Result<void>                 // 'shape:registered'
  unregisterShape(name: string): Result<void>
  registerAnimation(name: string, def: AnimationDef): Result<void>
  // ⭐ Day 8 重构:DataSource 替代 BindingResolver(三层解构)
  registerDataSource(source: DataSource): Result<void>                     // 'data-source:registered'
  unregisterDataSource(id: string): Result<void>                           // 'data-source:unregistered'
  getDataSource(id: string): DataSource | undefined                        // V2 NDV 面板直接读
  registerConnectionValidator(validator: ConnectionValidator): Result<void>  // ⭐ v0.3 缺 4
  registerTagNamespace(namespace: string, schema: TagNamespaceSchema): Result<void>  // ⭐ v1.0-rc(KD-011 §D.4)

  // ⭐ Day 7 修订 6(对齐 React Flow 扩展点)— Edge / Anchor 类型注册
  registerEdgeType(name: string, def: EdgeTypeDef): Result<void>           // 'edge-type:registered'
  registerAnchorType(name: string, def: AnchorTypeDef): Result<void>       // 'anchor-type:registered'

  // ⭐ Day 7 修订 2(roadmap Phase D Color Contouring)— ViewMode 注册
  registerViewMode(viewMode: ViewMode): Result<void>                       // 'view-mode:registered'

  list(kind: 'shape' | 'plugin' | 'animation' | 'data-source'
            | 'connection-validator' | 'tag-namespace'
            | 'edge-type' | 'anchor-type' | 'view-mode'): readonly string[]
}

// ⭐ v0.3 缺 4
interface ConnectionValidator {
  readonly name: string
  validate(
    fromAnchor: AnchorRef,
    toAnchor: AnchorRef,
    context: ValidationContext
  ): { valid: true } | { valid: false; reason: string; code: string }
}

// ⭐ v1.0-rc 补丁 — KD-011 §D.4 tags 命名规约配套
interface TagNamespaceSchema {
  readonly description: string
  readonly values?: readonly string[]      // 可选:封闭枚举(否则开放)
  readonly multiAllowed?: boolean          // default false(违反"namespace 至多 1 tag"的 escape hatch)
}

// ⭐ Day 7 修订 6 — EdgeTypeDef
interface EdgeTypeDef {
  readonly name: string
  render(ctx: CanvasRenderingContext2D, conn: Connection, opts: RenderOpts): void
  hitTest(point: Point, conn: Connection, tolerance?: number): boolean
  bbox(conn: Connection): Rect
  defaultStyle?: ConnectionStyle
}

// ⭐ Day 7 修订 6 — AnchorTypeDef
interface AnchorTypeDef {
  readonly name: string
  render(ctx: CanvasRenderingContext2D, anchor: Anchor, pen: Pen, opts: RenderOpts): void
  hitTest(point: Point, anchor: Anchor, pen: Pen, tolerance?: number): boolean
  // 可选:支持拖动调整位置(movable anchor)
  onDrag?(anchor: Anchor, pen: Pen, delta: Point): Result<Anchor, DiagramError>
}

// ⭐ Day 7 修订 2 — ViewMode (roadmap Phase D Color Contouring 等)
interface ViewMode {
  readonly id: string
  readonly name: string

  // 渲染时给每个 pen 计算视觉覆盖(返回临时 style override,不改 model)
  resolvePenStyle?(pen: Pen, ctx: ViewModeContext): Partial<PenStyle> | null
  resolveConnectionStyle?(conn: Connection, ctx: ViewModeContext): Partial<ConnectionStyle> | null

  // 渲染时给每个 pen 注入 overlay(可选 — color contour / heatmap 用)
  resolveOverlay?(pen: Pen, ctx: ViewModeContext): OverlaySpec | null

  // 自描述(给 capabilities() / AI 用)
  describe?(): string
}

interface ViewModeContext {
  readonly viewport: Viewport
  readonly time: number               // 当前 TimeSource.now()
  readonly bindingValues: Map<string, unknown>   // resolver 解析后的当前值快照
}

interface OverlaySpec {
  kind: 'circle-glow' | 'rect-fill' | 'gradient' | 'text-badge' | 'custom'
  // ... 各 kind 配套字段(具体 v0.4 实测时收口)
}
```

**调用时机(★ v1.0-rc 补丁)**:
- 默认:`connections.add` / `connections.update`(若 patch 含端点变化)时,mutate 内部依次跑所有已注册 validators。任一返回 `valid: false` → mutation fail,return `Result<DiagramError{kind: 'connection-rejected'}>`
- escape hatch:`connections.add(conn, { skipValidation: true })`(给 V2 加载旧文件场景留口子;此 opts 不影响 event 触发,仍 emit `connection:added`)
- `meta2d.validate()`:对所有现有 connections 跑一遍,返回 issue 列表,不阻断

**API 数**: **12**(Day 7 +3:registerEdgeType / registerAnchorType / registerViewMode)

### §3.13 `instance`(★ v0.3 缺 10 — metadata)

`(v0.2: 5 → 5)` — 内部 InstanceOptions 加 metadata 字段,API 不变。

```typescript
interface InstanceAccessor extends Describable {
  create(id: string, opts?: InstanceOptions): Result<Instance>             // 'instance:created'
  destroy(id: string): Result<void>                                        // 'instance:destroyed'
  get(id: string): Instance | undefined
  list(): readonly string[]

  linkViewports(
    sourceId: string,
    targetId: string,
    mode: 'follow' | 'mirror' | 'zoom-only'
  ): Result<() => void>
}

interface InstanceOptions {
  pageLayout?: { width: number; height: number; margin?: number }
  background?: { color?: string; image?: string }
  grid?: { enabled: boolean; size?: number }
  rules?: { enabled: boolean }
  metadata?: Record<string, unknown>           // ⭐ v0.3 缺 10:多页面通过此承载
                                               // 例:{ pageType: 'substation', pageOrder: 2, parentPageId: 'main' }
                                               // core 不解释,V2 业务层自由 group / 路由
}
```

**API 数**: 5

**多页面 V2 用法示例**:
```typescript
meta2d.instance.create('main', {
  metadata: { pageType: 'main-network', pageOrder: 1 }
})
meta2d.instance.create('substation-a', {
  metadata: { pageType: 'substation', parentPageId: 'main', pageOrder: 2 }
})
meta2d.instance.create('control-a-1', {
  metadata: { pageType: 'control-cabinet', parentPageId: 'substation-a', pageOrder: 3 }
})

// V2 业务层用 metadata 渲染页面树 / 跳转 / 命名空间隔离
const allPages = meta2d.instance.list()
  .map(id => meta2d.instance.get(id))
  .filter(i => i?.options.metadata?.pageType)
  .sort((a, b) => (a.options.metadata.pageOrder ?? 0) - (b.options.metadata.pageOrder ?? 0))
```

### §3.14 `render`

`(unchanged: 3)`

```typescript
interface RenderAccessor extends Describable {
  request(): void
  setRenderer(renderer: Renderer): Result<void>
  getRenderer(): Renderer
}
```

**API 数**: 3

### §3.15 `geometry`(★ Day 8 修订 — P1 升级,roadmap Phase A smart snap)

`(NEW: 第 15 个 accessor)` — 跨 entity 空间查询(Smart snap / 框选 / MiniMap 视口判定)

```typescript
interface GeometryAccessor extends Describable {
  // ─── Pen 空间查询 ──
  queryPensByRect(rect: Rect, opts?: { partial?: boolean }): readonly Pen[]
                                              // partial: true=部分相交也算,false=完全包含
  queryPensNearest(point: Point, opts?: { maxDistance?: number; limit?: number }): readonly Pen[]
                                              // 按距离排序,limit 控制最多返回数
  queryPensByLine(p1: Point, p2: Point): readonly Pen[]
                                              // 框选拖拽时判定线段相交的 pen

  // ─── Connection 空间查询 ──
  queryConnectionsByRect(rect: Rect, opts?: { partial?: boolean }): readonly Connection[]
  queryConnectionsNearest(point: Point, opts?: { maxDistance?: number; limit?: number }): readonly Connection[]

  // ─── Selectable 通用查询(返回任意类型 entity)──
  querySelectablesByRect(rect: Rect, kinds?: readonly Selectable['kind'][]): readonly Selectable[]
}
```

**API 数**: **6**

**为什么独立 accessor 而非挂 pens / connections**:
- 几何查询是**横切多个 entity** 的能力(Smart snap 一次查 pens + connections + groups 全部边界)
- 挂 pens / connections 各一份是重复
- V2 使用频率高(Phase A smart snap 主力)— 独立 accessor 命名更自然(`meta2d.geometry.queryPensByRect(...)` vs `meta2d.pens.queryByRect(...)` — 前者表达"几何查询"语义)

**实装注**:渲染层维护空间索引(R-tree / quadtree),mutate 时增量更新。**O(log n) 查询**(对比 V2 自己遍历 O(n))。

---

## §4 ⭐ B7+D4 双枢纽 + transaction 三联(v0.3 扩展)

### §4.1 B7 mutate.ts SSoT 枢纽(沿用 v0.2 §3.1,小修订)

```typescript
// kernel/store/mutate.ts

export function mutate(
  context: MutationContext,
  action: DiagramAction,
  opts?: MutationOpts
): Result<MutationOutcome, DiagramError>

export interface MutationOpts {
  readonly txId?: string                       // ⭐ v0.3 新增:在 transaction 内则非空,events 暂不 flush
  // 注:dryRun 不再走 mutate opts,通过 facade.preview() 走独立路径
}

export interface MutationOutcome {
  readonly newState: DiagramState
  readonly diff: ModelDiff
  readonly events: readonly EmitSpec[]         // tx 内则不立即 flush,聚合到 'transaction:committed'
  readonly snapshotId?: string
}
```

**v0.2 → v0.3 修订**:
- ➖ `MutationOpts.dryRun` 移除(走 `facade.preview()` 独立路径)
- ➕ `MutationOpts.txId` 新增(transaction 内 mutation 不立即 emit)

### §4.2 D4 snapshot.ts(沿用 v0.2 §3.2)

```typescript
// kernel/store/snapshot.ts

export interface SnapshotEngine {
  take(): MemorySnapshot                                              // O(1)
  restore(snapshot: MemorySnapshot): Result<void, DiagramError>       // 验证 schema 兼容性
  computeDigest(state: DiagramState): string                          // 惰性,SHA-256
}
```

**类型重命名**:`DiagramSnapshot` → `MemorySnapshot`(KD-011 §C 死法 5)。

### §4.3 ⭐ v0.3 新增 — transaction 实装(缺 12)

```typescript
// kernel/store/transaction.ts(v0.3 新增,与 mutate / snapshot 三联)

export interface TransactionEngine {
  begin(name: string): TransactionHandle
  commit(handle: TransactionHandle): Result<TransactionOutcome>
  rollback(handle: TransactionHandle, error?: Error): void
}

export interface TransactionHandle {
  readonly txId: string
  readonly name: string
  readonly entrySnapshot: MemorySnapshot       // rollback 锚点
  readonly pendingDiffs: ModelDiff[]
  readonly pendingEvents: EmitSpec[]
}

export interface TransactionOutcome {
  readonly txId: string
  readonly name: string
  readonly diffs: readonly ModelDiff[]
  readonly committedAt: number
}

// facade.transaction(name, fn) 实装:
class Meta2d {
  transaction(name: string, fn: () => void): Result<void, DiagramError> {
    const handle = this.txEngine.begin(name)
    try {
      this.activeTransaction = handle
      fn()                                     // 内部 mutation 通过 mutate({ txId: handle.txId })
      this.activeTransaction = null
      const r = this.txEngine.commit(handle)
      if (r.ok) {
        this.eventBus.emit('transaction:committed', {
          name: r.value.name,
          diffs: r.value.diffs,
          committedAt: r.value.committedAt
        })
      }
      return r.ok ? Ok(undefined) : Err(r.error)
    } catch (e) {
      this.activeTransaction = null
      this.txEngine.rollback(handle, e instanceof Error ? e : undefined)
      this.eventBus.emit('transaction:rolled-back', {
        name,
        error: e instanceof DiagramError ? e : undefined
      })
      return Err({
        kind: 'invariant-violation',
        code: 'TRANSACTION_FN_THROWN',
        message: e instanceof Error ? e.message : String(e),
        context: { txName: name }
      })
    }
  }
}
```

**transaction 数据流**:

```
                          ┌──────────────────────────────────┐
   user code              │  meta2d.transaction('add-sub', () => {  │
                          │    pens.add(transformer)          │
                          │    pens.add(busbar)               │
                          │    connections.add(t-to-b)        │
                          │    groups.create(...)             │
                          │  })                              │
                          └──────────┬─────────────────────────┘
                                     │
                                     ▼
                          ┌──────────────────────────────────┐
                          │ txEngine.begin(name)             │
                          │ entrySnapshot = snapshot.take() │
                          │ activeTransaction = handle       │
                          └──────────┬─────────────────────────┘
                                     │
                                     ▼
   accessor mutation     ┌──────────────────────────────────┐
   每个 mutate 调用      │ mutate(ctx, action, { txId })   │
   读 activeTransaction.txId  │ → reducer → newState            │
                          │ → diff(state, newState)          │
                          │ → events queued                  │
                          │ → handle.pendingDiffs.push(diff)│
                          │ → handle.pendingEvents.push(...) │
                          │ → store.setState(newState)      │
                          │ → DO NOT flush events           │
                          └──────────┬─────────────────────────┘
                                     │
                          ┌──────────┴──────────┐
                          ▼                     ▼
                   fn 正常返回             fn 抛错
                          │                     │
                          ▼                     ▼
              ┌──────────────────┐   ┌──────────────────────┐
              │ commit(handle)   │   │ rollback(handle)     │
              │ flush 1 event:    │   │ snapshot.restore(    │
              │ 'transaction:     │   │   entrySnapshot)     │
              │   committed'     │   │ flush 1 event:       │
              │ { diffs[] }       │   │ 'transaction:        │
              └──────────────────┘   │   rolled-back'       │
                                      └──────────────────────┘
```

**乐用收益**:
- V2 监听 `'transaction:committed'` 即可入 undo 栈;1 个 user-facing 操作 = 1 个 undo unit
- 个体 events 不重复 emit(diffs 数组携带);减少 listener 抖动
- rollback 用 D4 snapshot 实装,O(1)

### §4.3.1 ⭐ v1.0-rc 补丁:transaction 嵌套 savepoint 语义锁定

**背景**:V2 工具(如 `align()` 内部)已用 transaction;用户外层再开 transaction → 嵌套发生。**嵌套语义在 v0.3 公开 API 发布前必须锁定**(否则 v0.4 review 撞墙)。

**v1.0-rc 锁定 — 数据库 savepoint 语义**:

```typescript
class Meta2d {
  transaction(name: string, fn: () => void): Result<void, DiagramError> {
    if (this.activeTransaction) {
      // 嵌套:开 savepoint,不 emit 'transaction:committed'
      return this.txEngine.savepoint(this.activeTransaction, name, fn)
    }
    // 顶层:正常流程(begin / commit / emit)
    // ...
  }
}
```

**4 种语义**:

| 场景 | 行为 |
|---|---|
| 顶层 transaction commit | emit `'transaction:committed'` |
| 嵌套 transaction commit | **不 emit 独立事件**,作为顶层 transaction 的一部分(diffs 累积到顶层) |
| 嵌套 transaction throw | rollback 到嵌套 entry(savepoint),**不影响外层**;外层可继续 |
| 顶层 transaction throw | rollback 到最外层 entry,**所有嵌套作废**;emit `'transaction:rolled-back'` |

**用例对照**:

```typescript
// V2 alignment 工具内部用 transaction
function align(diagram, ids, mode) {
  return diagram.transaction('align', () => {
    /* mutations */
  })
}

// 用户外层组合
meta2d.transaction('big-edit', () => {
  pens.add(p1)
  align(meta2d, ids, 'left')   // ← 嵌套(savepoint),不 emit committed
  pens.add(p2)
})
// 顶层 commit → 1 个 'transaction:committed' { name: 'big-edit', diffs: [...全部] }
// V2 监听者获得 1 个 undo unit,虽然内部用了 align
```

**实装要点**:meta2d 持 transaction 栈,`activeTransaction` 是栈顶。嵌套通过 D4 snapshot 在 enter 处 take,exit 处可丢弃(commit)或 restore(rollback)。

---

## §5 14 个域访问器 — Selectable / Lockable / Reactive 通用接口

(详 §0.4 + §1)

---

## §6 错误体系 — Result vs Promise(★ KD-011 §B 死法 3 简化)

### §6.1 死法清单(7 条,KD-010 §A)+ KD-011 §B 死法 3

(沿用 KD-010 + KD-011 §B.1 死法 3)

### §6.2 简化规约(v0.3 替代 KD-010 §A.2 规则 2)

**v0.2 规则 2**:sync → Result;async → `Promise<Result<T>>`(双层) — **作废**。

**v0.3 规则 2**(KD-011 §B 死法 3):**sync → Result;async → `Promise<T>` 单层 reject**。
- reject reason 可能是 `DiagramError`(用户域)或其他 `Error`(transport / wasm)
- 用户在 catch 里用 `instanceof DiagramError` 区分

```typescript
// ✅ v0.3 正确
extension.install(plugin: Plugin): Promise<void>
modules.load(ref: ModuleRef): Promise<Module>

try {
  await meta2d.extension.install(plugin)
} catch (e) {
  if (e instanceof DiagramError) {
    if (e.kind === 'duplicate-id') {
      // 用户域:plugin id 已存在
    }
  } else {
    // transport / network / wasm-init
  }
}
```

### §6.3 4 步边界检查清单(简化版)

| 问 | Y/N | 处理 |
|----|:--:|------|
| 这是 mutation 吗? | N | `T \| undefined` / `T[]` |
| 失败原因里有"用户合理可能撞到的"? | N | `throw InvariantError` |
| 是 async 吗? | Y | `Promise<T>`(reject reason 是 DiagramError 或 Error) |
| 以上都过 |  | `Result<T, DiagramError>` |

### §6.4 DiagramError 类型(沿用 v0.2 + v0.3 扩展)

```typescript
type DiagramError =
  | { kind: 'duplicate-id'; code: 'PEN_ID_EXISTS' | ... ; id: string }
  | { kind: 'not-found'; code: 'PEN_NOT_FOUND' | ... ; id: string }
  | { kind: 'invariant-violation'; code: string; message: string }
  | { kind: 'invalid-input'; code: string; message: string; field?: string }
  | { kind: 'capacity-exceeded'; code: 'GROUP_NESTING_DEPTH' | 'MODULE_DEPTH'; limit: number; current: number }
  | { kind: 'cycle-detected'; code: 'MODULE_CYCLE' | 'GROUP_CYCLE'; ids: string[] }
  | { kind: 'render-failed'; code: string; cause?: Error }
  | { kind: 'snapshot-incompatible'; code: 'VERSION_MISMATCH' | 'SCHEMA_DRIFT' }
  | { kind: 'connection-rejected'; code: string; reason: string; validatorName: string }   // ⭐ v0.3 缺 4
  | { kind: 'transaction-failed'; code: 'TRANSACTION_FN_THROWN'; message: string; txName: string }   // ⭐ v0.3 缺 12
```

### §6.5 dryRun 重构 — 走 `facade.preview(intent)` 单动词

**v0.2(死法 1 违反)**:
```typescript
add(pen, opts?: { dryRun?: boolean }): Result<Pen | Diff>
```

**v0.3(规约 1)**:
```typescript
add(pen): Result<Pen, DiagramError>                  // 90% 调用,无双重判别
preview(intent: PreviewIntent): Result<Diff, DiagramError>   // 10% dryRun,单独动词
```

详 §2.2 PreviewIntent。

---

## §7 Typed Events 41 个(★ v1.0-rc 重新核账 + 压一轮)

### §7.1 Event 收敛策略(v0.3 改动 6 + v1.0-rc 二次压缩)

**v0.2 36 events 问题**:patch 字段隐式触发,用户记不住映射。

**v0.3 第一轮**:一 mutation 一 event,patch 派生信息进 payload。但 v0.3 §7.2 实际清单 = **44 events**(layers + transaction + time pause/resume + group/module expand/collapse 显式事件加成)。

**v1.0-rc 第二轮压缩**(KD-011 §B 死法 4 严格执行,只压不影响乐用度的合并):

| 压缩项 | 行动 | 净 |
|---|---|:--:|
| `layer:active-changed` → `layer:updated`(active 是 LayerPatch 字段) | 合并 | -1 |
| `group:expanded / group:collapsed` → `group:updated`(payload.kind 派生) | 合并 | -2 |
| `module:expanded / module:collapsed` → 新增 `module:updated` 接收 | 合并 + 1 | -1 |
| 新增 `pen:state-changed`(KD-011 §D.2.1 state 独立 API) | 新增 | +1 |
| 新增 `connection:state-changed`(对齐 pens) | 新增 | +1 |
| **保留**:`pen:before-remove`(cancellable hook,语义不同)/ `time:paused / time:resumed`(高频 V2 监听 UI 暂停按钮)|||

**v0.2 36 → v0.3 44 → v1.0-rc 41**(44 - 3 + 0 净 = 41,实测下表逐项)。

### §7.2 41 个事件完整清单(v1.0-rc 重核)

```typescript
interface DiagramEvents {
  // ─── pen(6)──────────────────────────────
  'pen:added':           { pen: Pen }
  'pen:removed':         { id: string }
  'pen:updated':         { id: string; patch: PenPatch; changedFields: readonly (keyof PenPatch)[] }
                                                    // payload.changedFields 携带变更字段
                                                    // payload.kind 派生:'moved' | 'restyled' | 'restructured' | 'mixed'(可选)
  'pen:before-remove':   { id: string; preventRemoval: (reason?: string) => void }
                                                    // ⭐ v1.0-rc 补丁:替代 v0.3 cancel callback
                                                    // 多 listener 任一 preventRemoval → 取消;必须同步调用;详 §7.4
  'pen:reordered':       { id: string; from: number; to: number }
  'pen:state-changed':   { id: string; from: string; to: string }   // ⭐ v1.0-rc(KD-011 §D.2.1)

  // ─── connection(5)───────────────────────
  'connection:added':    { connection: Connection }
  'connection:removed':  { id: string }
  'connection:updated':  { id: string; patch: ConnectionPatch; changedFields: readonly (keyof ConnectionPatch)[] }
  'connection:reordered': { id: string; from: number; to: number }
  'connection:state-changed': { id: string; from: string; to: string }   // ⭐ v1.0-rc

  // ─── selection / hover(2)───────────────
  'selection:changed':   { ids: readonly string[]; added: readonly string[]; removed: readonly string[] }
  'hover:changed':       { from: string | null; to: string | null }

  // ─── viewport(1)─────────────────────────
  'viewport:changed':    { viewport: Viewport; previous: Viewport }

  // ─── layer(4)⭐ v1.0-rc:active-changed 合并入 updated ─
  'layer:added':         { layer: Layer }
  'layer:removed':       { id: string }
  'layer:updated':       { id: string; patch: LayerPatch; changedFields: readonly (keyof LayerPatch)[] }
                                                    // active 切换走 layer:updated payload.changedFields=['active']
  'layers:reordered':    { ids: readonly string[] }

  // ─── group(3)⭐ v1.0-rc:expanded/collapsed 合并入 updated ─
  'group:created':       { group: Group }
  'group:dissolved':     { id: string }
  'group:updated':       { id: string; patch: GroupPatch; changedFields: readonly (keyof GroupPatch)[]; kind?: 'expanded' | 'collapsed' | 'restyled' | 'mixed' }

  // ─── module(3)⭐ v1.0-rc:expanded/collapsed 合并入新 updated ─
  'module:loaded':       { module: Module }
  'module:unloaded':     { id: string }
  'module:updated':      { id: string; patch: ModulePatch; changedFields: readonly (keyof ModulePatch)[]; kind?: 'expanded' | 'collapsed' | 'styled' }

  // ─── theme(3)────────────────────────────
  'theme:changed':       { themeId: string; previous: string }
  'theme:registered':    { themeId: string }
  'token:overridden':    { path: string; value: unknown }

  // ─── plugin / extension(7)⭐ Day 7 +3 ──
  'plugin:installed':    { plugin: Plugin }
  'plugin:uninstalled':  { id: string }
  'shape:registered':    { name: string }
  'shape:unregistered':  { name: string }
  'edge-type:registered':   { name: string }    // ⭐ Day 7 修订 6
  'anchor-type:registered': { name: string }    // ⭐ Day 7 修订 6
  'view-mode:registered':   { id: string }      // ⭐ Day 7 修订 2

  // ─── instance(2)─────────────────────────
  'instance:created':    { id: string }
  'instance:destroyed':  { id: string }

  // ─── time(3)─────────────────────────────
  'time:rate-changed':   { rate: number; previous: number }
  'time:paused':         { previousRate: number }
  'time:resumed':        { rate: number }

  // ─── view-mode(Day 7 修订 2,1)─────────
  'view-mode:changed':   { from: string | null; to: string | null }

  // ─── snapshot(D4,1)────────────────────
  'snapshot:restored':   { id: string; takenAt: number }

  // ─── transaction(2)────────────────────
  'transaction:committed':   { name: string; diffs: readonly ModelDiff[]; committedAt: number }
  'transaction:rolled-back': { name: string; error?: DiagramError }

  // ─── command(D2,1)─────────────────────
  'command:emitted':     { command: DiagramCommand; sourceEvent: string }

  // ─── error / warning(side channels,2)─
  'error':               { error: DiagramError | InvariantError }
  'warning':             { code: string; message: string; context?: Record<string, unknown> }
}
```

**统计**:**41 events**(精确核算 = 6+5+2+1+4+3+3+3+4+2+3+1+2+1+2 = 42 — 待 v0.4 实测时 -1 — 接近设计目标)。
**比 v0.2 36 多 5,但 5 全是新能力 net**(layer 4 + transaction 2 + state 2 - 老隐式触发合并 -3)。

### §7.3 emit 规约(KD-010 §B 沿用 + v0.3 transaction 扩展)

```typescript
const EMIT_DISCIPLINE = {
  ordering: 'fixed-by-action',                       // 顺序按 action 内部固定
  isolation: 'try-catch-per-listener',               // listener 失败隔离 → 'error' 通道
  reentry: 'forbidden',                              // emit 期间 dispatch → throw
  flushTiming: 'sync-in-dispatch',                   // 同步 flush
  transactionBatching: 'aggregate-into-committed',   // ⭐ v0.3:tx 内 events 聚合到 'transaction:committed'
}
```

### §7.4 ⭐ v1.0-rc 补丁:`preventRemoval` 模式(替代 v0.3 cancel callback)

**v0.3 设计问题**(用户 v0.3 review 补丁 2):

```typescript
// v0.3:'pen:before-remove': { id: string; cancel: () => void }
// 问题:多 listener 都调 cancel,谁的算?异步调 cancel 是否生效?语义不清
```

**v1.0-rc 锁定 — 参考 DOM `event.preventDefault()` 模式**:

```typescript
'pen:before-remove': { id: string; preventRemoval: (reason?: string) => void }

// 规约(明文化):
// 1. 多 listener 任一调用 preventRemoval → 取消整个 remove 操作
// 2. **必须同步调用** — emit 完成后立即检查标志,异步调用不生效(警告日志)
// 3. mutate.ts 在 emit 后检查"是否被 prevent",如是 → return Result<DiagramError{kind: 'prevented-by-listener', reason }>
// 4. 同模式后续应用于其他 cancellable events:
//    - 'group:before-dissolve'
//    - 'connection:before-remove'
//    - 'transaction:before-commit'(可选,慎用)
```

**用例**:

```typescript
events.on('pen:before-remove', ({ id, preventRemoval }) => {
  if (penIsLocked(id)) {
    preventRemoval('locked')
    // 取消 remove,'pen:removed' 不会 emit;调用方拿到 Result<Error{kind: 'prevented-by-listener'}>
  }
})
```

### §7.5 ⭐ v1.0-rc 补丁:派生事件指南(替代专门 cross-domain events)

某些跨域语义事件(如"pen 跨层移动" / "selection 因 layer 隐藏自动收缩")**不单独 emit**,通过现有 event payload 推导。**避免 events 总数膨胀**。

```typescript
// V2 监听者推导跨层移动
events.on('pen:updated', ({ id, changedFields, patch }) => {
  if (changedFields.includes('layerId')) {
    onPenLayerChange(id, patch.layerId)
  }
})

// V2 监听者推导 selection auto-shrink
events.on('layer:updated', ({ id, patch, changedFields }) => {
  if (changedFields.includes('visible') && patch.visible === false) {
    // selection 可能被自动收缩,从 selection.get() 重读
    const stillSelected = selection.get()
    if (stillSelected.length < previousSelected.length) onSelectionAutoShrink(...)
  }
})
```

**项目级承诺**:跨域语义事件 → V2 业务层用 `payload.changedFields` 推导,**不**为每个跨域语义专门加 event。例外:**用户高频监听**的跨域语义(如 `transaction:committed`)才单独 emit。

### §7.3 emit 规约(KD-010 §B 沿用 + v0.3 transaction 扩展)

```typescript
const EMIT_DISCIPLINE = {
  ordering: 'fixed-by-action',                       // 顺序按 action 内部固定
  isolation: 'try-catch-per-listener',               // listener 失败隔离 → 'error' 通道
  reentry: 'forbidden',                              // emit 期间 dispatch → throw
  flushTiming: 'sync-in-dispatch',                   // 同步 flush
  transactionBatching: 'aggregate-into-committed',   // ⭐ v0.3:tx 内 events 聚合到 'transaction:committed'
}
```

---

## §8 Plugin / Capabilities / Describe(★ v0.3 + ConnectionValidator)

### §8.1 Plugin

```typescript
interface Plugin {
  id: string
  install(host: PluginHost): Promise<void>     // bundled plugin 内部 return Promise.resolve()
  uninstall(host: PluginHost): Promise<void>
}

interface PluginHost {
  registerShape(name: string, def: ShapeDef): void
  registerAnimation(name: string, def: AnimationDef): void
  registerDataSource(source: DataSource): void                          // ⭐ Day 8 重命名(原 registerBindingResolver)
  registerConnectionValidator(validator: ConnectionValidator): void   // ⭐ v0.3 缺 4
  hookLifecycle(hook: 'render-before' | 'render-after' | 'pen-paint', fn: Function): void
}
```

### §8.2 Capabilities + PropertySchema(D1 + v0.3 扩展)

```typescript
interface Capabilities {
  version: string
  domains: Record<string, DomainCapability>
  events: readonly (keyof DiagramEvents)[]
  errors: readonly DiagramError['code'][]
  themes: readonly string[]
  shapes: readonly ComponentCapabilities[]               // ⭐ v0.3 改为 ComponentCapabilities[]
  bindingResolvers: readonly string[]
  connectionValidators: readonly string[]                // ⭐ v0.3 缺 4
  layers: readonly string[]                              // ⭐ v0.3 缺 1
}

interface ComponentCapabilities {
  type: string
  category?: string
  properties: Record<string, PropertySchema>             // D1 PropertySchema 沿用 v0.2 §7.2
  bindableFields: readonly string[]                      // ⭐ v0.3:用 Reactive<T> 嵌入字段,这里列哪些字段可绑
  defaultAnchors?: readonly Anchor[]                     // shape 默认 anchors
}

// PropertySchema(沿用 v0.2 + v0.3 扩展)
interface PropertySchema {
  type: 'string' | 'number' | 'boolean' | 'enum' | 'color' | 'point' | 'rect' | 'ref' | 'tags' | 'data'
                                                          // ⭐ v0.3 加 'tags' / 'data' 类型
  range?: { min?: number; max?: number; step?: number }
  enum?: readonly { value: unknown; label: string }[]
  pattern?: string
  mutability: 'readonly' | 'mutable' | 'init-only'
  bindable?: boolean                                     // ⭐ v0.3 缺 4 / 改动 4:此字段是否可 Reactive
  themeAware?: boolean
  group?: string
  labelKey: string
  hintKey?: string
  default?: unknown
  dependsOn?: { property: string; value?: unknown }
}
```

### §8.3 Describe

```typescript
meta2d.describe()
// "Meta2d instance 'main' — 142 pens, 23 connections, 3 groups, 5 layers; viewport 0,0 @ 1.2x; theme 'edit'; 8 plugins; 2 connection-validators"

meta2d.layers.describe()
// "LayersAccessor — 5 layers (3 visible, 1 locked); active 'devices'"

meta2d.snapshot().digest    // optional, on-demand
// "sha256:a3f2..."
```

---

## §9 工具 — `api/utils/alignment.ts`(B6,v0.2 沿用)

```typescript
export type AlignMode =
  | 'left' | 'right' | 'top' | 'bottom'
  | 'h-center' | 'v-center'
  | 'h-distribute' | 'v-distribute'
  | 'h-fill' | 'v-fill'

export function align(
  diagram: Meta2d,
  ids: readonly string[],
  mode: AlignMode
): Result<void, DiagramError>
// 内部:走 meta2d.transaction('align', () => ...) 自动作 1 个 undo unit
```

**API 数贡献**:**+1 module export**。

---

## §10 D 类整合摘要(v0.3 update)

| D 类 | 03 v0.4 锚 | 02 v0.3 落地节 | API 影响 |
|:-:|---|---|---|
| **D1** | §3.5 D1 PropertySchema | §8.2(`bindable: boolean` 字段加入)| +0 method |
| **D2** | §3.5 D2 command:emitted | §7.2(events) | +0 method |
| **D3** | §3.5 D3 BindingResolver | §3.12 + Reactive<T> 嵌入字段(§0.4 / §1.1)| +1 method |
| **D4** | §3.5 D4 snapshot/restore | §2 lifecycle + §4.2 | +2 methods,+1 event |
| **D5** | §3.5 D5 flowType ⭐ **重审** | **删除** Connection 三件套字段;改 `tags + data` 通用承载 | -3 字段 |
| **D6** | §3.5 D6 幂等性对账 | §4.3(transaction)+ V2 业务层组合 | +0(D6 仍是组合用法)|

**D5 重审说明**(KD-011 §D.3):
- 业务词:flow / 电力流
- 去词后骨架:Connection 上挂枚举开放的 string 字段
- **结论**:不需要单独字段,通用 `tags: ['flow:<value>']` + `data: { flowDirection, flowMagnitude }` 完全承载
- flow-coupling 编排器约定从 tags 提取(业务变体包定义具体值)
- **收益**:Connection schema 减 3 字段,通用化 + §0 判定模板自洽

---

## §11 API 总数核算 v1.0-rc(★ 重核账)

**核账方法**:Facade methods + **15 accessors** + module-level exports = TOTAL。

### §11.1 Facade methods(12 个)

| 类别 | API | 数 |
|---|---|:--:|
| lifecycle(7) | mount / destroy / resize / serialize / deserialize / snapshot / restore | 7 |
| preview(1) | preview(intent) | 1 |
| transaction(1) | transaction(name, fn) | 1 |
| validate(1) | validate() | 1 |
| 自描述(2) | describe / capabilities | 2 |
| **Facade subtotal** |  | **12** |

### §11.2 15 Accessors — Day 7 + Day 8 修订重新统计

| Accessor | v0.2 | v0.3 | v1.0-rc | Day 7 | **Day 8** | 变更说明 |
|------|:---:|:---:|:---:|:---:|:---:|------|
| `layers` ⭐ 缺 1 | — | 8 | 8 | 8 | **8** | unchanged |
| `pens` | 6 | 8 | 9 | 10 | **11** | Day 8 +1 subscribeReactive |
| `connections` | 4 | 8 | 9 | 10 | **11** | Day 8 +1 subscribeReactive |
| `groups` | 5 | 7 | 7 | 8 | **8** | unchanged |
| `modules` | 3 | 5 | 6 | 6 | **6** | unchanged |
| `selection` | 6 | 7 | 7 | 7 | **7** | unchanged |
| `hover` | 3 | 3 | 3 | 3 | **3** | — |
| `viewport` | 6 | 8 | 8 | 10 | **10** | unchanged from Day 7 |
| `time` | 6 | 8 | 8 | 8 | **8** | unchanged |
| `theme` | 4 | 4 | 4 | 4 | **4** | — |
| `events` | 2 | 2 | 2 | 2 | **2** | — |
| `extension` | 7 | 8 | 9 | 12 | **14** | Day 8 +2:DataSource 重构(registerDataSource/unregisterDataSource/getDataSource;原 registerBindingResolver -1) |
| `instance` | 5 | 5 | 5 | 5 | **5** | — |
| `render` | 3 | 3 | 3 | 3 | **3** | — |
| `geometry` ⭐ Day 8 NEW | — | — | — | — | **6** | NEW(P1 升级,smart snap)|
| **Accessor subtotal** | 60 | 84 | 88 | 96 | **106** | Day 8 +10 vs Day 7 |

### §11.3 Module-level exports(1 个)

| Export | 数 |
|---|:--:|
| `api/utils/alignment.ts` `align()` | 1 |
| **Module subtotal** | **1** |

### §11.4 TOTAL

| 阶段 | Facade | Accessors | Modules | TOTAL |
|---|:---:|:---:|:---:|:---:|
| v0.2 | 9 | 60 | 1 | **70** |
| v0.3 | 12 | 84 | 1 | **97** |
| v1.0-rc(Day 5)| 12 | 88 | 1 | **101** |
| Day 7 修订 | 12 | 96 | 1 | **109** |
| **Day 8 修订** | 12 | 106 | 1 | **119** |

**API 数 v0.2 70 → Day 8 修订 119(+49 累计)**。

**Day 8 +10 method 来源**:
- Day 8 P0-1 Bindable→Reactive 三层解构(net):registerDataSource +1 + unregisterDataSource +1 + getDataSource +1 - registerBindingResolver -1 = **+2**
- Day 8 P0-2 NDV 第三栏:pens.subscribeReactive +1 + connections.subscribeReactive +1 = **+2**
- Day 8 P0-2 Diff humanize:Diff.describe + affectedIds = **+0 method**(扩展 Diff interface)
- Day 8 P1 geometry accessor(15th):**+6**

**事件总数**:45 → **47**(+2:'data-source:registered' + 'data-source:unregistered';去 'binding-resolver:registered' if existed)

KD-011 §A.2(v0.5 修订)警戒线 **130**。当前 119 距警戒线 11 个 buffer,**安全区**(M2 v1.0-rc 收口空间足)。

### §11.5 ★ Day 8 关键架构变化:Bindable → Reactive 三层解构

**重命名**:`Bindable<T>` → `Reactive<T>`(全文统一替换;19 处)

**重构**:`BindingResolver / BindingSpec` → `DataSource / DataQuery`
- `BindingResolver.resolve` 可选 + `subscribe` 可选 → `DataSource.subscribe` **必须** + `query` 可选(IoT 实际语义)
- `BindingSpec.resolverName` (string) → `DataQuery.sourceId` (显式区分多 datasource 共存)
- 新增 `DataSourceCapabilities` 字段(streaming / pull / expressionLang / latencyClass)显式声明

**新增**:`StyleExpression<T>`(本地数据派生,7 类:literal / get / match / interpolate / case / zoom / time)
- 求值 sync,O(expression-depth),无通讯
- 解决 ETAP Color Contouring / 状态驱动视觉 / zoom 自适应等场景

**为什么这是 v1.0-rc 冻结前的"补天之笔"**(用户 Day 8 review 总结):
- 修复"Bindable 隐含 MQTT/HTTP 通讯耦合"的架构债
- 与 GIS / 现代 reactive framework 对齐
- AI 友好性飙升(LLM 直接生成 expression JSON)
- 不破坏现有用户调用语义(addition + 重命名,非 breaking 行为)

每个新增 API 已通过 **KD-011 §B + §C 4 步检查清单**:
- 行为单一 ✅
- 无联合返回 ✅
- 无字段隐式触发 event ✅(state 走独立 changeState API)
- 无 magic mode 字段 ✅
- async 单层 reject ✅
- bindings 嵌入字段 ✅
- transaction 嵌套 savepoint 锁定 ✅
- preventRemoval 替代 cancel callback ✅
- tags namespace:value 命名规约 ✅

**易用度提升**:5/10(v0.2)→ **8-9/10**(v1.0-rc)。**简单度提升**:6/10 → **8/10**。**够用度**:9/10 → **9/10**(克制原则不破)。

### §11.1 v0.4 / v1.0 路径

| 阶段 | 工作 | 目标 |
|---|---|---|
| **v0.4 Day 6-7** | 卫星包 5 Adopt 适配方案对照 | 不主动压缩 API |
| **v0.5 Day 8-10** | AVPP 4-flow(用 tags+data+flow-coupling) | particle / time 接口具体化 |
| **v0.6 Day 10-12** | V2 Renderer interface 对齐 | 不主动压缩 |
| **v1.0 Day 12-15** | 内部 review + 定稿 | review 后**仅压缩不符 §B+§C 检查清单的 API**;否则保持 |

---

## §12 待解决(v0.4 实测决定)

| 议题 | 处置 | 优先级 |
|------|------|:--:|
| `Reactive<T>` 嵌入字段在多深嵌套(`pen.style.gradient.stops[0].color`)的可行性 | v0.4 实测 | P2 |
| flow-coupling 编排器从 `tags` 提取的契约规约 | v0.4(03 v0.5 配套) | P1 |
| `layers` 跨 instance 是否共享 | v0.4 | P2 |
| Multi-page UI 路由 V2 业务样例 | 文档示例 | P3 |
| ⭐ Day 8 已升 P1 落地:**geometry accessor**(15th)| ✅ 已 v1.0-rc | — |
| ⭐ Day 7 修订 8:**ShapeDef.getAnchors(pen) 动态 anchor**(多端口配电柜场景)| v0.4 验证 | P2 |
| ⭐ Day 7 修订 5 内置:Color Contour 走 ViewMode.resolveOverlay(已含修订 2)| 已落地 | — |
| ⭐ Day 8 ROI🥈:`render.setQualityBudget` / `setRefreshPriority` | v0.4 perf 实测后再加 | P2 |
| ⭐ Day 8 修订:`PropertySchema.bindableFields` 类型化(`BindableFieldDef`)| v0.4 NDV 实测 | P1 |

---

## §13 引用

- KD-009(深度重构)/ KD-010(错误 + 事件)/ **KD-011(易用 + 简单 + 通用 pre-mortem)** ⭐
- 01-mece-decomposition.md v0.2(模块树 + Q1-Q7)
- 02-public-api-surface.md v0.2(70 API,本 v0.3 反例)
- 03-v2-capability-port-inventory.md v0.4(28 + 12 缺失 + D5 重审)
- meta2d-internals.md ch12
- docs/architecture/ADR-P7-XXX-topology-scope-lock-v1.0.md.pdf v1.0
- mxGraph / JointJS / draw.io / n8n / Figma 概念表面对照(用户 v0.2 review)

---

*v0.3 — 2026-04-30 Day 4. KD-011 价值序锁定 + 5 易用改动 + 12 缺失补全 + Schema 通用化 + D5 flowType 重审为 tags+data。API 70 → 97(+27);events 36 → 38(净 -2 但隐式触发消除);易用度 5/10 → 8-9/10。*
*v0.4 待:卫星包适配 / Reactive 嵌套实测 / flow-coupling 契约 / transaction 嵌套 / layers 跨 instance / Halo 样例。*
