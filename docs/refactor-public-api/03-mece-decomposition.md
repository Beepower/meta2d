> 状态:v1.0

# M2 Output 1/3 — MECE 模块分解 v0.2

**版本**: v0.2(7 项 v0.1 议题已用户裁决)
**日期**: 2026-04-30
**状态**: In Progress(M2 任务 5-15 天周期)
**驱动决策**: `KD-009 §3` "MECE / 够用 / 易用 / 乐用 / AI / AVPP / 卫星友好"
**v0.1 → v0.2 变更**: §7 7 项议题全部用户裁决,转 §10(Locked Decisions)

---

## §0 目标 — Five Pillars

### §0.1 MECE(Mutually Exclusive / Collectively Exhaustive)

每个能力归属唯一模块。**反例**:`canvas.ts` 既管渲染又管鼠标又管 history 又管 drag — 这是当前 9.4k 行的根因。

### §0.2 够用(Sufficient — 不做用不到的)

✅ 做:
- canvas2d 渲染 / 几何 / pen 模型 / store / 鼠标事件 / drag / select / hover
- particle / time engine / parallel space / 3D(AVPP 必需)
- design tokens / adornments / shape registry

❌ 不做:
- 内置 widget(tooltip / dialog / message / title / popconfirm)— React 处理
- 内置 IoT / MQTT / WebSocket — V2 用 React Query + 自己的 MQTT
- combine / mind / 内置图元 — 用户自己 register
- 内置 history / undo / redo — Domain 层做

### §0.3 易用(Easy-to-use)

- 公开 API ≤ **40 个**(当前 70+,削减 ~40%)
- 命名一致:`add* / remove* / update* / find* / query*`(动词 + 对象)
- 类型严格:`Result<T, E>` 标准化错误,`dryRun` 标准化预览
- 文档化:每 API 一个 `describe()`(human-readable)+ `capabilities()`(JSON Schema)

### §0.4 乐用(Delightful)

- AI 可调用:整图 JSON 生成(Phase C)+ dryRun 预览
- 可测试:纯函数 / 注入式时间源 / 隔离式 store
- 可扩展:plugin 系统(register custom shape / animation / interaction)
- 可观察:每个 mutation emit 结构化事件;状态 frozen snapshot 可读

### §0.5 AI-friendly + AVPP-ready

- 锚 §8 Phase C:整图 JSON 生成 → 视觉宪法约束 → dryRun 预览
- 锚 §3.1.2:4 流耦合渲染管线
- 锚 §6:平行空间仿真 + 时间引擎倍率
- 锚 §4.1.2:粒子 / 涟漪 / 脉冲

---

## §1 模块树(全景)

```
@meta2d/core
│
├── kernel/                         状态 + 调度内核(无渲染)
│   ├── store/                      ─── 实例状态(model, viewport, selection, hover)
│   ├── scheduler/                  ─── render scheduling(rAF + dirty tracking)
│   ├── instance/                   ─── 多实例管理器(parallel space)★ AVPP
│   └── time/                       ─── 注入式时间源(1x/60x/360x/1440x)★ AVPP
│
├── geometry/                       纯数学,零渲染依赖
│   ├── point.ts                    ─── Point / distance / dot / cross
│   ├── rect.ts                     ─── Rect / contains / intersect / union
│   ├── transform.ts                ─── 2D matrix / rotation / scale
│   ├── projection.ts               ─── 2D-to-2.5D 透视(吸收 transform 包)★ AVPP 3D
│   └── hit-test.ts                 ─── point-in-rect / point-on-segment / 命中测试
│
├── model/                          声明式图模型(纯数据,无方法)
│   ├── pen.ts                      ─── Pen schema(frozen)+ PenType / CanvasLayer
│   ├── connection.ts               ─── Connection 端到端连线
│   ├── group.ts                    ─── Group 容器
│   ├── module.ts                   ─── Module 子图引用
│   ├── anchor.ts                   ─── Anchor 端口模型(语义化命名)
│   ├── action.ts                   ─── 状态变更 action 类型(addPen / removePen / ...)
│   └── diff.ts                     ─── 增量 diff(支持 dryRun)
│
├── render/                         可插拔渲染层
│   ├── interface.ts                ─── Renderer 抽象接口
│   ├── canvas2d/                   ─── Canvas2D 实现(默认)
│   │   ├── pipeline.ts             ─── 主渲染管线
│   │   ├── render-pen.ts           ─── 单 pen 渲染(替代 pen/render.ts 4.7k 行)
│   │   ├── render-anchors.ts       ─── 端口可视
│   │   ├── render-adornments.ts    ─── 选中/hover/rotate 装饰 ★ M6 CloudPSS
│   │   ├── canvas-stack.ts         ─── 多层 canvas 合成(template/main/image)
│   │   └── path2d-cache.ts         ─── Path2D 编译缓存
│   └── effects/                    ─── 视觉效果(可组合)★ AVPP
│       ├── particle/               ─── 粒子系统(替代空 stub)
│       ├── glow/                   ─── halo / 辉光
│       ├── flow-line/              ─── 沿线流动
│       ├── pulse/                  ─── 呼吸 / 脉冲
│       └── ripple/                 ─── 涟漪(MCC 触发)
│
├── interaction/                    输入处理
│   ├── mouse.ts                    ─── 鼠标 → 语义动作
│   ├── keyboard.ts                 ─── 键盘
│   ├── touch.ts                    ─── 触摸
│   ├── gesture/                    ─── drag / zoom / select 手势
│   │   ├── drag-pen.ts
│   │   ├── select-rect.ts
│   │   ├── zoom.ts
│   │   ├── rotate.ts               ─── ★ M6 CloudPSS 风格
│   │   └── resize.ts
│   └── coords.ts                   ─── world ↔ screen 坐标变换
│
├── tokens/                         ★ M5 设计 tokens 下沉
│   ├── palette.ts                  ─── Tier 1 raw values
│   ├── semantic.ts                 ─── Tier 2 semantic tokens(stroke/fill/state/...)
│   ├── theme/                      ─── Tier 3 variants
│   │   ├── light.ts
│   │   ├── dark.ts
│   │   ├── high-contrast.ts
│   │   ├── edit.ts                 ─── ★ AVPP edit 主题
│   │   ├── ops-gray.ts             ─── ★ AVPP ops-gray 主题(待 §11.Q1 裁决)
│   │   └── showcase.ts             ─── ★ AVPP showcase 主题(待 §11.Q2 裁决)
│   └── resolver.ts                 ─── token 深度合并 + 解析
│
├── extension/                      插件 + 自定义图元
│   ├── shape-registry.ts           ─── register custom shapes(替代 globalStore.path2dDraws)
│   ├── animation-registry.ts       ─── register 自定义动画
│   ├── plugin-host.ts              ─── plugin 生命周期(install / uninstall)
│   └── lifecycle-hooks.ts          ─── pen 级 hooks(onMount / onPaint / onDestroy)
│
└── api/                            公开 API facade
    ├── meta2d.ts                   ─── Meta2d 主类(替代 core.ts 入口)
    ├── result.ts                   ─── Result<T, E> 类型
    ├── error.ts                    ─── DiagramError 错误体系
    ├── describe.ts                 ─── describe() AI 接口
    ├── capabilities.ts             ─── capabilities-schema 暴露
    └── index.ts                    ─── 单一入口窄 export
```

**模块统计**:
- 顶层目录:**8 个**(kernel / geometry / model / render / interaction / tokens / extension / api)
- 子目录:**13 个**
- 文件:预估 **40-50 个**(单文件 < 500 行 95%)

对比当前 monolithic:
- 当前:7,584 LOC / 86 文件,但 `canvas.ts` 9.4k 行 + `pen/render.ts` 4.7k 行 = 14k 行集中在 2 文件
- 重构后:平均文件 < 500 行,无单文件 > 1000 行

---

## §2 各模块职责 + 边界

### §2.1 `kernel/` — 状态 + 调度内核

**职责**:维护实例状态;调度渲染;时间;多实例。**不**做:任何渲染;任何业务图元定义。

| 子模块 | 公开 API | 边界 |
|--------|---------|------|
| `store/` | `getState() / dispatch(action) / subscribe(listener)` | Frozen snapshot 读 + Action 写 |
| `scheduler/` | `requestRender() / requestPaint(layer)` | rAF 调度 + dirty tracking |
| `instance/` | `createInstance(id) / destroyInstance(id) / getInstance(id)` | 多实例隔离 ★ |
| `time/` | `now() / schedule(cb) / setRate(rate)` | 注入式时间源 ★ |

### §2.2 `geometry/` — 纯数学

**职责**:点 / 矩形 / 矩阵 / 投影 / 命中测试 — **全部纯函数**。**不**做:状态;副作用。

可单元测试 100%。无外部依赖。

### §2.3 `model/` — 声明式数据

**职责**:Pen / Connection / Group / Module / Anchor 的 schema + 不可变变换。**不**做:渲染;事件;state mutation。

`action.ts` 定义所有变更类型(addPen / removePen / movePen / ...),`diff.ts` 实现 dryRun + 增量。

### §2.4 `render/` — 可插拔渲染

**职责**:把 model → 像素。**不**做:state mutation(渲染只读 state)。

`canvas2d/` 是默认实现;未来可加 `webgl/` / `svg/`。

`effects/` 是可组合视觉效果,与 pen 渲染分层(8 层架构第 6 层 animation)。

### §2.5 `interaction/` — 输入

**职责**:DOM 事件 → 语义 action。**不**做:渲染;直接 mutate state(走 dispatch)。

### §2.6 `tokens/` — 设计 tokens(★ M5 下沉)

从 V2 `src/design-tokens/` 移入。三层结构(palette / semantic / theme)保留。

V2 后续 import 路径:`from '@meta2d/tokens'`(新 package)或 `from '@meta2d/core/tokens'`(集成入 core)。**待决:独立包还是 core 子模块?**(详 §7 Q1)

### §2.7 `extension/` — 扩展点

**职责**:注册中心 + 生命周期 hook。

替代当前的 `globalStore.path2dDraws` / `canvasDraws` 等全局注册表 — 改为 instance-scoped + 命名空间。

### §2.8 `api/` — 公开 facade

**职责**:对外暴露的窗口。所有 BeePower V2 / 卫星包通过此层访问内核。

`index.ts` 做窄 export — 只导出标记为 public 的内容。

---

## §3 跨切关注点(Cross-Cutting Concerns)

### §3.1 错误体系(`api/error.ts`)

```typescript
export type Result<T, E = DiagramError> =
  | { ok: true; value: T }
  | { ok: false; error: E }

export interface DiagramError {
  kind: 'invariant' | 'not-found' | 'duplicate' | 'invalid-input' | 'render-failed'
  code: string  // e.g., 'PEN_ID_DUPLICATE', 'ANCHOR_NOT_FOUND'
  message: string
  context?: Record<string, unknown>
}
```

所有 mutation API 返回 `Result<T>`。读 API 返回 `T | undefined`(传统)。

### §3.2 时间源(`kernel/time/`)

```typescript
export interface TimeSource {
  now(): number  // monotonic ms
  schedule(callback: (deltaMs: number) => void): () => void  // returns cancel
  setRate(rate: number): void  // 1 = wall clock; 60 = 60x; 0 = paused
  getRate(): number
}

export class WallClockTime implements TimeSource { /* uses requestAnimationFrame + Date.now */ }
export class TestTime implements TimeSource { /* manually advance */ }
export class ScaledTime implements TimeSource { /* wraps WallClockTime with rate multiplier */ ★ AVPP }
```

### §3.3 事件 / 通知

不再用 mitt 全局(当前的 `store.emitter`)。改为 instance-scoped + typed:

```typescript
interface DiagramEvents {
  'pen:added': { pen: Pen }
  'pen:removed': { id: string }
  'pen:moved': { id: string; from: Point; to: Point }
  'selection:changed': { ids: string[] }
  'viewport:changed': { x: number; y: number; scale: number }
  // ...30 个 typed events
}

instance.events.on('pen:added', ({ pen }) => { /* ... */ })
```

### §3.4 状态(`kernel/store/`)

```typescript
interface DiagramState {
  readonly model: DiagramModel  // frozen
  readonly viewport: Viewport
  readonly selection: ReadonlySet<string>
  readonly hover: string | null
}

class Store {
  getState(): DiagramState  // returns frozen snapshot
  dispatch(action: DiagramAction): Result<DiagramState>
  subscribe(listener: (state: DiagramState) => void): () => void
}
```

### §3.5 描述 / capabilities(AI 接口)

每个公开类实现:

```typescript
interface Describable {
  describe(): string  // e.g., "Meta2d instance with 142 pens, 23 connections, scale 1.2"
  capabilities(): Capabilities  // JSON Schema 描述能力
}
```

`Capabilities` 是稳定 JSON 结构,AI agent 可读取以了解可调用什么。

---

## §4 公开 API 总数预估

按模块:

| 模块 | API 数 |
|------|:----:|
| `Meta2d` 主类 | 12 |
| `kernel/store` | 3 |
| `kernel/scheduler` | 2 |
| `kernel/instance` | 4 |
| `kernel/time` | 5 |
| `geometry/*` | 8(均纯函数)|
| `model/*` | 6(数据构造工厂)|
| `render` | 4(replace renderer / get current renderer)|
| `interaction` | 0(全 internal,通过 events 暴露)|
| `tokens` | 3(get tokens / set theme / register theme)|
| `extension` | 5(register shape / unregister / install plugin / ...)|
| `api/error / result / describe` | 3 |
| **合计** | **~55** |

⚠️ 略超 §0.3 "≤ 40" 目标。M2 v0.2 时收紧:合并 `Meta2d` 主类的子方法到子模块访问器(如 `meta2d.store.getState()` 不算 Meta2d 自己的 API)。

---

## §5 老 → 新映射(粗)

| 老位置 | 新位置 | 备注 |
|--------|--------|------|
| `canvas/canvas.ts` 9,391 行 | `kernel/store/` + `kernel/scheduler/` + `render/canvas2d/pipeline.ts` + `interaction/*` + `render/canvas2d/render-adornments.ts` | 拆 6+ 文件 |
| `pen/render.ts` 4,676 行 | `render/canvas2d/render-pen.ts` + `geometry/transform.ts` + `geometry/hit-test.ts` | 拆 3 文件 |
| `pen/model.ts` | `model/pen.ts` + `model/anchor.ts` | 拆 2 |
| `pen/math.ts` | `geometry/{point,rect,hit-test}.ts` | 重组 |
| `pen/arrow.ts` | `model/connection.ts` + `geometry/transform.ts` | 重组 |
| `pen/text.ts` | `render/canvas2d/render-text.ts`(新) | 重命名 |
| `pen/plugin.ts` | `extension/lifecycle-hooks.ts` | 重命名 |
| `store/store.ts` | `kernel/store/index.ts` + `kernel/store/actions.ts` | 拆 |
| `store/global.ts` | `extension/shape-registry.ts` + `extension/animation-registry.ts` | 拆 + 改 instance-scoped |
| `point/` `rect/` | `geometry/{point,rect}.ts` | 平移 |
| `event/event.ts` 3,592 行 | **DROP**(我们不要 meta2d 的 trigger/condition/action 业务事件)| ✂️ |
| `diagrams/{combine,mind,activity,line/*}` | **保留 `line/*` 移入 `render/canvas2d/render-line.ts`;其他 DROP**(用户 register custom)| ✂️ |
| `diagrams/svg/parse.ts` | 移入 `packages/svg/`(不在 core)| 包归属调整 |
| `theme/defaultTheme.ts` | `tokens/theme/light.ts`(M5 下沉)| 替换 |
| `options.ts` | `api/meta2d.ts` constructor params | 内嵌 |
| `core.ts` 入口 | `api/meta2d.ts` 重写 | 重写 |
| `tooltip/` `dialog/` `message/` `title/` `popconfirm/` `scroll/` `map/` | **DROP** | ✂️ |

---

## §6 MECE 验证

### §6.1 互斥性(Mutually Exclusive)

每个能力归属唯一模块:

- ✅ pen 数据模型 → `model/pen.ts`
- ✅ pen 渲染 → `render/canvas2d/render-pen.ts`(分离!)
- ✅ pen 命中测试 → `geometry/hit-test.ts`(分离!)
- ✅ pen 几何变换 → `geometry/transform.ts`(分离!)
- ✅ pen 相关交互 → `interaction/gesture/drag-pen.ts`(分离!)
- ✅ pen 状态变更 → `model/action.ts` + `kernel/store/`(分离!)

对比当前:这 6 个职责全在 `canvas.ts`(渲染 + 交互 + 状态变更交织)+ `pen/render.ts`(渲染 + 几何 + 命中交织)。

### §6.2 完备性(Collectively Exhaustive)

AVPP 47 项能力 vs 模块覆盖:

| AVPP 类 | 主负责模块 |
|--------|-----------|
| A. SLD 编辑 | `kernel/store` + `model/*` + `interaction/*` + `extension/*` |
| B. 实时可视化 | `render/effects/*` + `tokens/*` + `model/*` |
| C. Tag 数据绑定 | (V2 上层做,core 提供 hooks)|
| D. 物理沙盘指令 | (V2 上层做,core 不涉及)|
| E. 时间引擎对接 | `kernel/time/` ⭐ |
| F. 故事引擎接收 | (V2 上层做)|
| G. 4 模式 × 3 主题 | `tokens/theme/*` |
| H. 参数化 | (V2 上层做)|
| I. 美学治理 | `tokens/*`(constitution → tokens 实装)|
| J. AI 建图 | `api/describe.ts` + `api/capabilities.ts` ⭐ |
| K. 性能 | `kernel/scheduler/` + `render/canvas2d/path2d-cache.ts` |
| L. 测试 | `geometry/*`(纯函数)+ `kernel/time/TestTime` |
| M. 横向接口 | (V2 上层做)|

**11 类全覆盖**(C/D/F/H/M 在 V2 层做合理,因为是业务集成而非图形能力)。

---

## §7(deprecated)— see §10 for locked decisions

(原 §7 7 项议题已用户裁决,见 §10。本节保留位号占位。)

---

## §8 v0.1 → v0.2 → v1.0 迭代计划

| 阶段 | 工作 | 状态 |
|------|------|:---:|
| v0.1(Day 1)| 模块树 + 职责划分 + 老→新映射 | ✅ |
| **v0.2(Day 1-2)** | 7 项议题用户裁决(§10)+ 02-public-api-surface.md API 签名细节 | 🔵 |
| v0.3(Day 3-5) | 内部数据流(state mutation / event flow / render pipeline)| ⏳ |
| v0.4(Day 6-7) | 卫星包 5 Adopt 适配方案对照 | ⏳ |
| v0.5(Day 8-10)| AVPP 4-flow 耦合 + particle / time 接口具体化 | ⏳ |
| v0.6(Day 10-12)| V2 Renderer interface(ch12.4)对齐 | ⏳ |
| v1.0(Day 12-15)| 内部 review + 定稿 | ⏳ |

每个版本一次 commit。v1.0 定稿后才进 M3。

---

## §9 引用

- `KD-009` 决策依据
- `meta2d-internals.md` ch11 / ch12(quirks + V2 用 API)
- `avpp-capability-gap.md`(47 能力)
- `meta2d-satellite-shelf.md`(卫星包采纳)
- `architecture/topology-role-in-avpp.md.pdf`(锚 §3 / §4 / §6)

---

## §10 已锁决策(2026-04-30 用户裁决)

### Q1 — tokens 独立 `@meta2d/tokens` ✅

**深层理由**:tokens 跨 canvas + V2 React UI + CSS 变量 + 未来导出渲染管线。放进 `core/tokens/` 会被迫拖上 kernel/scheduler/render 依赖。tokens 性质是**展示常量**,不是图形能力,语义独立。

**依赖方向(单向)**:
```
@meta2d/core  ──peer-dep──►  @meta2d/tokens
                              ▲
@v2 React UI  ────dep────────┘
@v2 CSS vars  ────dep────────┘
```

`@meta2d/tokens` **不许**反向依赖 core(也不需要 — 它只是常量)。

### Q2 — L2 域访问器 ⚠️(细化 v0.1 倾向)

三层 API 风格:

| 层 | 风格 | 示例 | 评估 |
|----|------|------|------|
| L1 平铺 | `meta2d.addPen(p)` | god-class,API 数 70+ | ❌ |
| **L2 域访问器** | `meta2d.pens.add(p)` / `meta2d.viewport.zoom(1.2)` | **AI / 人均友好** | ✅ |
| L3 裸 store | `meta2d.store.dispatch({ type: 'addPen', payload })` | 用户要懂 reducer 协议 | ❌(escape hatch only)|

**采纳 L2**。store/action 是 internal 机制,**不**作 public API 暴露。L3 仅作 plugin 内部 escape hatch 留口(`extension/plugin-host` 内可访问)。

**域访问器映射(13 个 domain accessor + 1 facade)**:

```
meta2d.pens          ─── add / remove / update / find / query / move
meta2d.connections   ─── add / remove / update / find / query
meta2d.groups        ─── create / add / remove / update / nest
meta2d.modules       ─── load / unload / get
meta2d.selection     ─── set / add / remove / clear / get
meta2d.hover         ─── get / set / clear
meta2d.viewport      ─── pan / zoom / fit / reset / get
meta2d.time          ─── setRate / pause / resume / now
meta2d.theme         ─── setTheme / getTheme / extend
meta2d.events        ─── on / off / emit (typed events)
meta2d.extension     ─── install / uninstall / register-shape / register-animation
meta2d.instance      ─── create / destroy / get(parallel space)
meta2d.render        ─── request / setRenderer (escape hatch)
```

**API 总数收紧**:13 个 accessor × 平均 3-4 method ≈ **40-50** + Meta2d facade 约 5-8 个生命周期 method = **总 45-58**。略超 §0.3 "≤ 40" 但接近达标 — v0.3 时再压(合并相似 API,如 `add/move/update` 合并为 `update(id, patch)`)。

### Q3 — Connection 独立 model + Selectable 接口 ✅(强烈)

**Pen vs Connection 是异质数据**:
- Pen 字段:`children / text / anchors / image / video / dom / ...`
- Connection 字段:`endpoints / waypoints / arrowheads / curve-mode / ...`

合并为 `type=line` 联合类型 → 所有字段 optional + 大量 `if (pen.type === 'line')` 分支 → **当前 canvas.ts 9.4k 行的主要病因之一**。

**新设计 — model 层 MECE,能力层多态**:

```typescript
// model/ — MECE 数据
interface Pen { id: string; bounds: Rect; ... /* pen-specific */ }
interface Connection { id: string; from: AnchorRef; to: AnchorRef; waypoints: Point[]; ... }
interface Group { id: string; bounds: Rect; childIds: string[]; ... }
interface Module { id: string; ref: ModuleRef; ... }

// model/selectable.ts — 能力层多态接口
interface Selectable {
  readonly id: string
  bbox(): Rect
  containsPoint(p: Point): boolean
  acceptsHover(): boolean
}

// Pen / Connection / Group 各自实现 Selectable
class PenSelectable implements Selectable { /* uses pen.bounds */ }
class ConnectionSelectable implements Selectable { /* uses pen-on-segment */ }
class GroupSelectable implements Selectable { /* uses bounding union */ }
```

`selection / hit-test / drag / focus` 等通用能力以 `Selectable[]` 工作 — 干净,无 type 分支。

**含义对模块树**:`model/` 加 `selectable.ts`(接口 + 默认 impl)。

### Q4 — viewport-sync 单文件,不提升子目录 ⚠️

**v0.1 错误**:把 viewport-sync 列为 `kernel/instance/` 的子目录。

**修正**:`kernel/instance/viewport-sync.ts` **单文件**,公开 1 函数:

```typescript
export function linkViewports(
  source: Instance,
  target: Instance,
  mode: 'follow' | 'mirror' | 'zoom-only'
): () => void  // returns unlink fn
```

**理由**:
- AVPP showcase opt-in 特性,90% 用户不需要
- 单文件方便 tree-shake
- v1.0 实装 1-2 个 mode 够用,**不预先架构**

**通用成长规则**(同时适用 viewport-sync / flow-coupling 等):
- 单文件 ≤ 500 LOC 且 ≤ 2 个内聚 unit → 保持文件
- > 500 LOC 或 ≥ 3 个内聚 unit → 提升为子目录

### Q5 — 老 trigger / event.ts 全删 ✅

3,592 行的声明式 trigger/condition/action 系统是 meta2d 试图当**业务规则引擎**留下的债。AVPP 里 V2 已有 state mgmt + story engine + tag binding,留着就是两套并发。

**关键论点(v0.1 §3.3 已奠基)**:typed instance events(`pen:added` / `selection:changed` 等)是**正确的 hook 形态** — kernel emit,用户监听,reaction 写在 V2 store / effect 里。

**迁移路径**(写入 M12 文档):

```typescript
// 老
meta2d.on('addPen', { trigger, conditions, actions })

// 新
instance.events.on('pen:added', ({ pen }) => {
  // V2 effect / dispatch 在这里写
})
```

老系统**完全删除**,不留兼容 shim。

### Q6 — 异步 install 单 API ✅

**单 install API,不做 install + installAsync 两套**:

```typescript
async install(plugin: Plugin): Promise<Result<void>>
```

Bundled plugins 内部 `return Promise.resolve()`。调用方一律 await。

**异步真实价值(v0.1 没明说)**:
1. **远程 shape pack**(Phase B 后,从 backend 拉取自定义图元集)
2. **Plugin 自带 wasm/worker init**(particle 系统 WebGPU acceleration 等)

API 表面定下,**v1.0 后不改**。

### Q7 — flow-coupling.ts 单文件 + 成长规则 ✅

`render/effects/flow-coupling.ts` 单文件(适用 Q4 同款规则)。

**职责**:给定一根连线 + 4 流(电力/信息/资金/价值)语义,决定哪些 effects(particle/glow/flow-line/pulse/ripple)启用、参数怎么映射、blending 怎么排。**编排器,薄逻辑**。

**成长触发**:超过 500 LOC 或 ≥ 3 个内聚 unit → 提升为 `render/effects/flow-coupling/`。

### §10.x v0.1 → v0.2 模块树 patch

```diff
@meta2d/core
├── kernel/
│   ├── store/
│   ├── scheduler/
│   ├── instance/
+   │   ├── index.ts           ─── createInstance / destroyInstance / getInstance
+   │   └── viewport-sync.ts   ─── linkViewports() 单文件(Q4)
│   └── time/
├── geometry/
├── model/
│   ├── pen.ts
│   ├── connection.ts
│   ├── group.ts
│   ├── module.ts
│   ├── anchor.ts
│   ├── action.ts              ─── (internal,不通过 API 暴露;Q2)
+   ├── selectable.ts          ─── ★ Selectable 接口 + impl(Q3)
│   └── diff.ts
├── render/
│   ├── canvas2d/
│   └── effects/
│       ├── particle/
│       ├── glow/
│       ├── flow-line/
│       ├── pulse/
│       ├── ripple/
+       └── flow-coupling.ts   ─── 4 流编排器单文件(Q7)
├── interaction/
├── tokens/                    (★ Q1 改为独立包 @meta2d/tokens,**不在 core 内**)
├── extension/
└── api/
    └── meta2d.ts              ─── 13 域访问器,L2 风格(Q2)

(独立包)
@meta2d/tokens/
├── palette.ts
├── semantic.ts
├── theme/
└── resolver.ts

(删除)
✂ packages/core/src/event/event.ts(老 trigger,Q5)
```

---

## §11 v0.2 待 v0.3 解决的 hard 议题(用户提示)

用户在 Q1-Q7 裁决后明确提示 2 项 hard 议题:

### §11.1 §3.1 错误体系边界 — 哪些 mutation 返回 Result<T>,哪些直接抛?

`02-public-api-surface.md` v0.1 重点解决。详 02 §4。

**初步原则**:
- ✅ Result<T>:`add / remove / update / load / save`(可恢复失败:id 重复/不存在/约束违反)
- ❌ throw:Getters / 内部 invariant assertion / 构造器(programming error / framework bug)

### §11.2 §3.3 ~30 typed events 的命名规约

`02-public-api-surface.md` v0.1 重点解决。详 02 §5。

**初步规约**:
- 格式 `<domain>:<verb-past>`
- domain 单数(noun)/ 复数(collection)
- 单 event 携带 diff 而非多 event(`pen:updated` 而非 `pen:moved` + `pen:resized`)
- 总数压到 ≤ 25

**这两条是 API 总数能否压到 35-40 的关键。v0.3 收口前必须解决。**

---

*v0.2 — 2026-04-30. 7 项议题用户全裁决,模块树 patch + Selectable 接口 + 成长规则就位。*
*v0.3 待:hard 议题 §11.1 错误边界 + §11.2 事件命名 → 02-public-api-surface.md。*
