# 11g — Behavioral Test Suite

> 用途:固化 V1(@meta2d/core canvas.ts 9828 + core.ts 7027 + render.ts 4700)god-class 当前对外行为为可执行 test。**P0 → P1 桥关键产出**;P3/P4 拆解 canvas 时此套件保持绿色 → 行为不漂移。
>
> 决策来源:V2 仓库 `docs/refactor-public-api/`(本目录是该体系的可执行部分,markdown 报告留 V2 docs)
>
> 落地决策:D-P0-30(2026-05-02 user 拍板:test 与 source 同仓 idiomatic;docs/ 下放 test 反 idiomatic + 不进 CI/CD pipeline + V2 link 路径变 import 全断;工单 §4.4 路径不指定 `docs/` prefix)

---

## 与 V2 文档体系的逻辑引用

| V2 docs 文件 | 本目录引用 |
|---|---|
| `11a-canvas-api-inventory.md`(116 entries)| `api-contract/canvas/T-A-NNN.test.ts` |
| `11b-core-api-inventory.md`(25 public + 224 forgotten)| `api-contract/core/T-A-NNN.test.ts` |
| `11c-render-api-inventory.md`(18 forgotten + 42 appendix)| `api-contract/render/T-A-NNN.test.ts` |
| `11d-satellite-call-sites.md`(12 sat sites / 6 files)| `call-site/{form-diagram,chart-diagram}/T-S-NNN.test.ts` |
| `11e-v2-call-sites.md`(195 V2 sites / 15 files)| `call-site/v2-adapter/T-S-NNN.test.ts` |
| `11f-implicit-behaviors.md`(33 quirks + 41 emits + 3 history + 5 side-effects + 4 monkey-patches)| `implicit/{quirks,emits,history,side-effects,monkey-patches}/T-X-NNN.test.ts` |
| `11g-surface-mapping-report.md`(6 类差集 ~378 enumeration)| Δ6.X(`implicit/behavior-divergence/`)— A' 行为不一致(D-P0-24 同名重叠 + emits A')|
| `11h-surface-gaps.md`(18 entries 全 user 显式裁决)| 不直接对应 test;P0 → P1 桥决策载体 |

---

## 目录结构

```
tests/behavioral/
├── README.md                        # 本文件
├── api-contract/                    # 对应 11a-c
│   ├── canvas/                      # canvas.ts public + public-ish API
│   ├── core/                        # core.ts public + public-ish API
│   └── render/                      # render.ts public exports
├── call-site/                       # 对应 11d-e
│   ├── form-diagram/                # 卫星 form-diagram 调用模式(table/table2/slider)
│   ├── chart-diagram/               # 卫星 chart-diagram 调用模式(echarts/LightningChart/highcharts)
│   └── v2-adapter/                  # V2 src/engine/adapters/meta2d 调用模式
└── implicit/                        # 对应 11f
    ├── quirks/                      # 33 quirks(in-source 5 + documented 28)
    ├── emits/                       # 41 emit timing
    ├── history/                     # 3 EditTypes
    ├── side-effects/                # 5 关键副作用顺序
    ├── monkey-patches/              # 4 V2 monkey-patches(MP-01..MP-04;D-P0-09 必测)
    └── behavior-divergence/         # Δ6.X V1 ↔ surface 行为不一致(D-P0-30 §6 加;D-P0-24 同名重叠 + emits A')
```

---

## Test ID 命名规则(工单 §4.4)

| 前缀 | 含义 | 文件 |
|---|---|---|
| `T-A-NNN` | API contract test | `api-contract/{canvas,core,render}/T-A-NNN.test.ts` |
| `T-S-NNN` | call site test | `call-site/{form-diagram,chart-diagram,v2-adapter}/T-S-NNN.test.ts` |
| `T-Q-X.Y-N` | quirk test(X.Y 是 11f §11.X 章节号)| `implicit/quirks/T-Q-X.Y-N.test.ts` |
| `T-E-NNN` | emit timing test | `implicit/emits/T-E-NNN.test.ts` |
| `T-H-NNN` | history rule test | `implicit/history/T-H-NNN.test.ts` |
| `T-MP-NNN` | monkey-patch test(D-P0-03)| `implicit/monkey-patches/T-MP-NNN.test.ts` |
| `T-SE-NNN` | side-effects test(避免与 T-S- 冲突)| `implicit/side-effects/T-SE-NNN.test.ts` |
| `T-BD-NNN` | behavior-divergence test(D-P0-30 加 — Δ6.X)| `implicit/behavior-divergence/T-BD-NNN.test.ts` |

每个 test case 顶部 docstring **必须含**:

```typescript
/**
 * Test ID: T-Q-11.2-2
 * Maps to: 11a C001 (addPen) + 11f quirk 11.2 #2
 * Asserts: addPen(pen, undefined, undefined, undefined, false) does NOT trigger active([pen])
 */
```

---

## 跑命令

```bash
# 在 ../meta2d.js 仓库根
pnpm --filter @meta2d/core test                 # 全跑 behavioral suite
pnpm --filter @meta2d/core test:watch           # watch 模式
pnpm --filter @meta2d/core test:coverage        # 覆盖率报告(P0 退出门槛 3:关键路径 ≥ 80%)

# 单文件
pnpm --filter @meta2d/core vitest run tests/behavioral/api-contract/canvas/T-A-001.test.ts
```

---

## P0 退出门槛(工单 §6)

- **门槛 2**:11g 套件存在,**全部跑绿**(基于当前 V1 代码)
- **门槛 3**:关键路径覆盖率 ≥ 80%(根据 11a-c 列出的 public + public-ish API,每个至少有 1 个对应 test)

**P0-R3 红线**(工单 §7):behavioral test 跑不绿(V1 现状本身有 bug)→ 记录到 `11i-preexisting-bugs.md`(尚未创建,Δ6 期间触发时新建),不要修。修是 P4-P6 的事。

---

## Δ6 子里程碑切分(D-P0-30 §3)

| Δ6 子 | 内容 | est cases |
|---|---|---|
| **Δ6.1** | 目录骨架 + vitest.config + sample test 跑通(**严格 gate**)| 1-2 |
| Δ6.2 | api-contract/canvas/ facade 主头 | ~15 |
| Δ6.3 | api-contract/core/ Meta2d facade | ~10 |
| **Δ6.X** | implicit/behavior-divergence/ A'(D-P0-24 同名重叠 + emits A')| ~15 |
| Δ6.4 | implicit/quirks/ in-source 5 + 高 priority 10 | ~15 |
| Δ6.5 | implicit/emits/ critical timing | ~7 |
| Δ6.6 | implicit/monkey-patches/ all 4 | 4 |
| **总** | 前 30%(目标 ~67 cases) | **~67** |

Δ7 = 剩余 70%(~150-300 总目标 - 67 ≈ 83-233 待补)。

---

## 设计哲学

1. **固化当前 V1 行为**(而非 surface 期望):test 失败时不修代码,记入 `11i-preexisting-bugs.md`
2. **A' test 特殊**(D-P0-30 §4):双向断言 — V1 method 行为 + facade-delegate 行为,两者都 assert,P4 拆 canvas 时 facade-delegate 路径不漂移
3. **monkey-patch test 必加**(D-P0-09):V2 替换 canvas 内部 method 的 4 处都要 test 验证替换前后行为
4. **测试隔离**:每个 test 独立 setup canvas instance,不共享 state(jsdom + new Meta2d() per test)

---

## 当前进度(Δ6.1 完成 — 2026-05-02)

- ✅ 目录骨架 14 子目录
- ✅ vitest.config.ts(**happy-dom env + vitest-canvas-mock setup** + tests/behavioral include + v8 coverage)
- ✅ package.json deps + scripts(vitest@^1.6.1 + happy-dom@^15.0.0 + vitest-canvas-mock@^0.3.3 + @vitest/coverage-v8@^1.6.1;jsdom 留作备用)
- ✅ sample test 2 个 6 tests 全 pass:T-A-000(机制 smoke 3)+ T-A-001(Meta2d 实例化 3)
- ⏳ 严格 gate ping user review

### 测试环境(D-P0-31 schema 修订)

**测试 framework + environment**:vitest + happy-dom + vitest-canvas-mock

D-P0-30 §1 原 B1 verdict 隐含 "vitest + jsdom",Δ6.1 实施期间撞两层限制 → user **D-P0-31 追溯改 schema**:

| 尝试 | 结果 | 原因 |
|---|---|---|
| jsdom + 无 mock | ❌ Dialog `sheet.insertRule()` 撞 rrweb-cssom 限制 | jsdom CSSOM 对 empty stylesheet 加 rule 时 `parentStyleSheet` 为 undefined;V1 Canvas 构造时 `new Dialog()` 撞 |
| happy-dom + 无 mock | ❌ CanvasTemplate `getContext('2d').scale()` 撞 null context | happy-dom 也不实现 Canvas 2D API;V1 Canvas 构造时调 `bgOffscreen.getContext('2d').scale(...)` 撞 |
| **happy-dom + vitest-canvas-mock** | **✅ 全通(Δ6.1 6/6 tests pass)** | mock `CanvasRenderingContext2D` 提供完整 API stub;happy-dom 提供 DOM + CSSOM |

**为什么不走其他选项**:
- node-canvas(native compile):Windows + Linux + macOS 跨平台 install 复杂 + 风险高
- vitest browser mode + playwright:配置复杂 + 跑慢,unit test 不必要
- jsdom + 修 V1 Dialog 代码:违反"固化 V1 行为不修代码" P0-R3 红线
- happy-dom + canvas-mock:渲染层 mock,V1 行为(quirks / emits / state mutation)仍真测 — 最干净

**关键工程含义**:
- 不 mock V1 行为(quirks / emits / state mutation / history 真测);只 mock 渲染层 Canvas 2D drawing API
- V1 god-class 行为仍真实跑过 — facade-delegate / quirk / emit timing 等都准确 verify
- P3/P4 V2 切换 surface 后,behavioral test 不需重写,只调整 setup 引用 surface 实现

**完整 D-P0-31 决策**:见 V2 仓库 `docs/refactor-public-api/99-progress.md` D-P0-31 决策块。
