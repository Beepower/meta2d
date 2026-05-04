# Refactor Public API — 文档索引

> 路径建议:`docs/refactor-public-api/README.md`
> 作用:**让任何刚加入的人(或刚 compact 完的 AI)第一眼能定位**

---

## 这是什么

beepowertopology 内核重构目录,目标:把 V1 god-class(canvas.ts ≈ 9828 LOC + core.ts + render.ts)重构为 `02-public-api-surface.md` 描述的 119 API + 15 accessor 拓扑。

预计 11–17 月。

---

## 当前进度(粗粒度)

> **每次 phase 切换时,user 或 AI 必须更新这一节**
> **phase 内部细颗粒度状态在 [`99-progress.md`](./99-progress.md)(每周更新)**

- **当前 phase**:Phase 0 启动前(预备期)
- **本周在做**:把所有文档落地到 `docs/refactor-public-api/`,准备启动 P0
- **下一里程碑**:Δ1(P0 扫描脚本 + 11a canvas.ts API 草稿)
- **99-progress.md 状态**:尚未创建(P0 启动时建立)

---

## 编号约定

文档编号采用区段分配,避免冲突:

| 区段 | 用途 | 例子 |
|------|------|------|
| **00–09** | 主文档/契约(只增不删,跨 phase 长期稳定) | 00 master plan / 02 surface / 03 mece |
| **10–19** | Phase 0 工单 + 产出物 | 10 phase-0-scope / 11a–11g 扫描产出 |
| **20–29** | Phase 1 工单 + 产出物 | 20 phase-1-spikes / 21a–21e PoC 报告 |
| **30–39** | Phase 2 工单 + 产出物 | 30 phase-2-accessor-skeleton / ... |
| **40+** | Phase 3+ 同模式 | |
| **99** | 进度跟踪文件 | 99-progress.md |
| 无编号 | 元文档 | README.md / AI-PROMPT.md |
| `_archived/` | 历史归档目录 | _archived/00-master-plan-v0.1-archived.md |

---

## 文档导航

### 主文档(00–09 区段,长期稳定)

| 文件 | 性质 | 必读优先级 |
|------|------|-----------|
| [00-master-plan.md](./00-master-plan.md) | 工程主轴(v2.0 骨架) | ★★★ 所有人必读 |
| [02-public-api-surface.md](./02-public-api-surface.md) | 设计契约(v1.0,P1 后会出 v1.1) | ★★★ 设计/实施前必读 |
| [03-mece-decomposition.md](./03-mece-decomposition.md) | 物理拓扑 + 老→新映射 | ★★★ P2/P4/P5 实施时必读 |

### 元文档(无编号)

| 文件 | 性质 | 必读优先级 |
|------|------|-----------|
| [AI-PROMPT.md](./AI-PROMPT.md) | 协作 AI 的系统指令 | ★★★ 任何 AI 接手前必读 |
| [99-progress.md](./99-progress.md) | phase 内部细颗粒度状态(每周更新) | ★★ 任何对话开始前必看 |

### Phase 0 工作目录(10–19 区段)

| 文件 | 性质 | 何时产出 |
|------|------|---------|
| [10-phase-0-scope.md](./10-phase-0-scope.md) | P0 工单(给 Claude Code) | 已就位 |
| 11a-canvas-api-inventory.md | canvas.ts API 清单 | Δ1 |
| 11b-core-api-inventory.md | core.ts API 清单 | Δ2 |
| 11c-render-api-inventory.md | render.ts API 清单 | Δ2 |
| 11d-satellite-call-sites.md | 5 个卫星包调用点 | Δ3 |
| 11e-v2-call-sites.md | V2 adapter 调用点 | Δ3 |
| 11f-implicit-behaviors.md | quirks/emits/history 等 | Δ4 |
| 11g-behavioral-test-suite/ | behavioral 测试代码 | Δ6–Δ7 |
| 11h-surface-gaps.md | V1 有但 surface 没覆盖的项 | P0 → P1 桥 |
| 11i-preexisting-bugs.md | P0 期间发现的 V1 现存 bug | 按需 |
| 11-scan-scripts/ | 一次性扫描脚本(可重跑) | Δ1 起 |

### 后续 Phase(占位,启动前再写)

- 20-phase-1-spikes.md — P1 spike 工单(P1 启动前写)
- 30-phase-2-accessor-skeleton.md — P2 工单
- 40-phase-3-v2-switch.md — P3 工单
- ...

### 历史归档

| 文件 | 性质 | 用途 |
|------|------|------|
| [_archived/00-master-plan-v0.1-archived.md](./_archived/00-master-plan-v0.1-archived.md) | 旧 master plan(M1–M13 模型) | **不删原文**——作为 R8 反模式案例,有教育价值。诊断写在头部警告 |

---

## 怎么用这个目录

### user 自己

每次开新对话/新 session:
1. 看本 README 「当前进度」节 + `99-progress.md`
2. 把 `00-master-plan.md` + `02-public-api-surface.md` + `03-mece-decomposition.md` + `AI-PROMPT.md` 拷给 AI
3. 告诉 AI 当前 phase 和最近一个待办

### 协作 AI(对话式 Claude / GPT)

读这五份后再说话,顺序:
1. AI-PROMPT.md(知道行为约束)
2. 00-master-plan.md(知道结构)
3. 02-public-api-surface.md(知道契约)
4. 03-mece-decomposition.md(知道目标拓扑)
5. 99-progress.md(知道当前细颗粒度状态)

具体任务前先回到本 README 看「当前进度」节。

### 执行 AI(Claude Code 等)

接手时多读一份:对应 phase 的工单文件(如 P0 期间读 `10-phase-0-scope.md`)。

---

## 修订日志

| 日期 | 事件 | 影响文件 |
|------|------|---------|
| 2026-05-01 | v2.0 master plan 起草、Phase 0 工单就位、旧计划归档 | 00 / 03 / 10 / 99 / AI-PROMPT / README / _archived |

---

**End of README**
