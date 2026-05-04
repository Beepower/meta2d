# 11-scan-scripts/ — Phase 0 Δ1 扫描脚本

> 路径:`docs/refactor-public-api/11-scan-scripts/`
> 用途:Phase 0 Δ1.1-Δ1.4 扫描脚本 + 中间 JSON 产物。隔离 sub-package.json 不污染 V2 root。
> 当前脚本:`scan-canvas-api.ts`(扫 canvas.ts;Δ2 后续可能加 `scan-core-api.ts` / `scan-render-api.ts`)

---

## 1. Purpose

扫描 `../meta2d.js/packages/core/src/canvas/canvas.ts`(9828 LOC,单一 `class Canvas` + 1 module-level export `movingSuffix`),提取 API inventory 用于 Phase 0 行为捕获工单(参见 `../10-phase-0-scope.md` §4.1)。

工单 §3.1 推荐工具栈是 ts-morph + ripgrep。本实施改用 ts-morph + Node.js fs(Windows 默认无 system ripgrep,改 in-memory regex grep — 性能 < 10 秒 全扫 / portable)。

---

## 2. Setup(隔离子目录,不污染 V2 root)

ts-morph 装在 `11-scan-scripts/` 子目录的独立 `package.json`,通过 `pnpm install --ignore-workspace` 不让 pnpm 把它视为 workspace 子目录:

```bash
cd docs/refactor-public-api/11-scan-scripts
pnpm install --ignore-workspace
```

V2 root `package.json` / `pnpm-lock.yaml` **不动**。`11-scan-scripts/node_modules/` 是隔离的本地工具 deps(当前仅 ts-morph)。

---

## 3. Run(在 V2 root cwd 下)

```bash
# 在 V2 root (D:\Codes\web\beepower\beepowertopology-v2) 下跑
npx tsx docs/refactor-public-api/11-scan-scripts/scan-canvas-api.ts
```

**为什么在 V2 root cwd**:脚本里 `process.cwd()` 用作路径根 — `META2D_ROOT = ../meta2d.js`,`V2_SRC = ./src`,`outDir = docs/refactor-public-api/11-scan-scripts` 都基于 V2 root。

Node.js 模块解析:tsx 从 .ts 文件位置(`11-scan-scripts/`)向上 walk 找 `node_modules` → 命中 `11-scan-scripts/node_modules/ts-morph` ✅。

**实测耗时**:~6 秒 real time(stage 1 ts-morph type-checker hydration 主耗时,其他 stages < 200ms)。

---

## 4. D-P0-06 markdown 是派生品(SoT 原则)— **重要**

数据 source of truth:**`canvas-apis-enriched.json`**(stage 3 输出)。

派生品:`../11a-canvas-api-inventory.md`(stage 4 渲染)。

**修数据修 JSON 或脚本,不直接编辑 markdown**:

| 错误做法 | 正确做法 |
|---|---|
| 直接编辑 11a markdown 里的 entry 数据 | 改 scan-canvas-api.ts 逻辑 → rerun → markdown 自动更新 |
| 在 markdown 加新 section | 改 renderMarkdown 函数加 section → rerun |
| 修 entry classification | 改分类 logic(stage 3)→ rerun |

为什么:markdown 不是 SoT,只是 enriched JSON 的人类可读表示。直接编辑 markdown = source / derived 不一致,后续 rerun 会覆盖编辑。

**修脚本后必须 rerun 重新派生**(D-P0-06 落地)。

---

## 5. Pipeline(5 stage)

```
canvas.ts ─[Stage 1: ts-morph extract]─→ canvas-apis.json (raw 262 entries)
                                                │
V2 / satellite / facade / sibling
        ─[Stage 0: pre-load contents]──→ in-memory Map<path, content>
                                                │
canvas-apis.json + memory ─[Stage 2: cross-grep + Stage 3: classify]
                                                │
                                          canvas-apis-enriched.json
                                                │
                                          [Stage 4: render markdown]
                                                │
                                                ↓
                                          ../11a-canvas-api-inventory.md
                                                │
                                          [Stage 5: D-P0-11 §a inventory cross-validation assert]
```

| Stage | 工作 | 输入 | 输出 |
|---|---|---|---|
| 0 | pre-load file contents(避免 system rg 依赖)| V2_SRC/engine/adapters/meta2d / 卫星 5 包 / facade core.ts+index.ts / sibling packages/core/src/ | `Map<filepath, content>` × 4 区域 |
| 1 | ts-morph extract(class members + module-level exports) | canvas.ts | `canvas-apis.json`(262 entries)|
| 2 | cross-grep boolean evidence | entries name × pre-loaded contents | `externalEvidence` per entry(v2 / satellite / facadeRaw / facadeDelegate)|
| 3 | classify(D-P0-08 三层 + D-P0-12 facade-delegate + D-P0-10 三向 + D-P0-09 monkey-patched cross-match)| entries + externalEvidence + INVENTORY | `canvas-apis-enriched.json`(116 main + 1 appendix + 145 internal filter)|
| 4 | render markdown(主表格 + 附录 + valuable discoveries 5 节 + Surface 映射 placeholder)| enriched JSON | `../11a-canvas-api-inventory.md`(191 行 / 19 KB)|
| 5 | D-P0-11 §a inventory cross-validation assert | grep V2 `canvas.X = (...)` count vs INVENTORY count | throw if mismatch |

---

## 6. D-P0-13 V2 / 卫星 noise 过滤策略

**(i) receiver 限定 pattern**:

```regex
(?:[\w.]+\.)?canvas\.<name>\b
```

意思:命中 `canvas.<name>`(parameter / 局部变量直接调用)或 `xxx.canvas.<name>`(class field / 多层 chain 如 `pen.calculative.canvas.<name>`)。过滤 `OverlayLayer.this.render()`(receiver 是 `this` 不经 `.canvas` chain → 不命中)。

**(ii) 文件范围限定**:

- V2 grep:**包含** `src/engine/adapters/meta2d/`,**排除** `src/engine/adapters/meta2d/overlay/` 子目录(OverlayLayer 自己的 render/destroy 同名 method 不算 canvas method)
- 卫星 grep:`packages/{flow,form,fta,chart,svg}-diagram/src/`(无 exclusion)

理由:Meta2d adapter 是 V2 端唯一应直接消费 canvas method 的入口。其他模块走 DiagramEngine 抽象,不直接调 canvas method。

**实施位置**:`hasV2Evidence(name)` / `hasSatelliteEvidence(name)`。

---

## 7. D-P0-14 facade-only 判定标准

`facade-delegate` **单独**作为 public 判定证据,**即使 V2/卫星全 miss**。

理由:Meta2d 显式 facade canvas.X 即代表 X 是对外契约(顶层 Meta2d 暴露 = 工单 §3.2 "在顶层 meta2d 类暴露" 的硬证据),不需要 V2/卫星再次确认。

**实施位置**:`classifyClassMember()` 第一个 branch。

---

## 8. D-P0-12 facade-delegate 双向确认(选项 A 严格)

facade-delegate 判定要求 BOTH:

- (a) Meta2d class body 内**存在**同名 method `<name>(...)` 或 `get/set <name>(...)`(支持 `async` / `public` / `private` / `protected` / `static` 修饰)
- (b) 该 body 内有 `this.canvas.<name>(` 或 `this.canvas?.<name>`(支持 optional chaining)

**形态排除(D-P0-12 精化 1+3)**:

- 形态 3 不同名间接调用(`Meta2d.foo() { this.canvas.bar() }`)→ false(`canvas.bar` 不通过 `Meta2d.bar` 暴露)
- 形态 4 consumer 赋值(`this.canvas.X = value`)→ false(赋值不是暴露,赋值是消费)

**实施位置**:`hasFacadeDelegateEvidence(name)` 双向 regex test。

---

## 9. D-P0-09 monkey-patched cross-match(D-P0-11 §a 交叉校验)

**INVENTORY**(`scan-canvas-api.ts` 顶部 `D_P0_09_INVENTORY` const):

| name | form | installLineHint |
|---|---|---|
| active | wrap-pattern | 125 |
| initMovingPens | wrap-pattern | 192 |
| render | wrap-pattern | 228 |
| customMoveDock | hook-field | 272 |

源:Δ1.1 step 2.5 全量分析 V2 端 `installUxPatches.ts` 393 行。

**§a 交叉校验**(stage 5):

- `findV2MonkeyPatchAssignments()` regex `canvas\.(\w+)\s*=\s*(?:async\s+)?(?:function\s*)?\(` 全扫 installUxPatches.ts → 函数赋值的 canvas.X names
- `validateInventoryCrossCheck(grepNames)` 比对 grep names == INVENTORY names(4 ± 0)
- mismatch → **throw + halt + ping user**(三种可能原因:inventory incomplete / grep pattern 漏 / V2 新加未登记 patch)
- 不能默默通过

**§b wrap vs hook 分支判断**(stage 3):

```typescript
if (v2PatchedNames.has(entry.name)) {
  if (inventory.form === 'wrap-pattern') entry.monkeyPatched = true   // 进 11f §4.3.5
  else if (inventory.form === 'hook-field') {
    entry.monkeyPatched = false
    entry.notes.push(`[hook-util] ${name}: see installUxPatches.ts:${installLineHint}`)
  }
}
```

---

## 10. D-P0-10 sibling 排除规则

**Module-level export 三向分类**(`classifyModuleExport`):

1. V2 / 卫星 / facade hit → `public-ish`(进主表格)
2. sibling hit(无外部消费证据)→ `appendix`(MX 系列,11a 末尾附录)
3. 全 miss → `skip`(不进 11a)

**Sibling grep 范围(`hasSiblingEvidence`)**:

- **包含**:`../meta2d.js/packages/core/src/**/*.ts`
- **排除**:
  - `canvas.ts` 自身(grep 不能用源文件作为外部消费证据)
  - `core.ts` / `index.ts`(已在 facade grep 范围)
  - `canvas/` 子目录所有文件(`offscreen.ts` / `canvasImage.ts` / `magnifierCanvas.ts` / `canvasTemplate.ts`)— **视为 canvas 模块内部协作文件**,P4 拆解时与 canvas.ts 一起重组,**不构成跨域消费,不算 sibling**

**实施位置**:`Stage 0` pre-load 时 walkDir filter 排除上述路径。

---

## 11. D-P0-11 §d 备注列 prefix 结构化

备注列承载多种语义信息时,用 `[bracket-tag]` 前缀机器可识别:

| Prefix | 语义 | 例 |
|---|---|---|
| `[hook-util]` | meta2d 公开 hook 利用(MP-04 customMoveDock) | `[hook-util] customMoveDock: see installUxPatches.ts:272` |
| `[quirk]` | quirk 注释 cross-link | `[quirk] ch11.6 #2` |
| `[async-internal-sync]` | async signature but sync impl | `[async-internal-sync] async signature but sync impl` |
| `[deprecated]` | deprecated 标注 | `[deprecated] use alternative` |

后续 grep `\[hook-util\]` / `\[quirk\]` 等可定向找出所有同语义条目。

**实施位置**:`collectClassMemberNotes()` + `applyMonkeyPatchAndHookNotes()`。

---

## 12. Output 文件

| 文件 | 大小 | 性质 |
|---|---|---|
| `canvas-apis.json` | ~87 KB | Stage 1 raw extraction(262 entries)|
| `canvas-apis-enriched.json` | ~90 KB | **Stage 3 SoT**(D-P0-06)|
| `quirks-fileWide.json` | small | Stage 1 后 file-wide @quirk extraction(D-P0-17 §3 robust)|
| `../11a-canvas-api-inventory.md` | ~19 KB(191 行)| Stage 4 派生品(D-P0-06 不直接编辑) |

---

## 13. Re-run 指南

**何时 rerun**:
- 修脚本逻辑后(D-P0-06 派生品原则)
- canvas.ts 上游变更后
- 修 D-P0-09 INVENTORY const 后(新 monkey-patch 加入)

**rerun 命令**:

```bash
# V2 root cwd
npx tsx docs/refactor-public-api/11-scan-scripts/scan-canvas-api.ts
```

**rerun 前 checklist**:

- ts-morph 仍可用(`docs/refactor-public-api/11-scan-scripts/node_modules/ts-morph` 存在)
- V2 root cwd(脚本依赖 process.cwd())
- 上游 canvas.ts / V2 / 卫星无 git lock(rerun 期间不要并发 git checkout)

**rerun 后 verify**:

- console output:`Main table: <N> entries / Appendix: <M> entries / Skipped: <K> entries`(总计 = 262 ± canvas.ts 实际变化)
- D-P0-11 §a `cross-validation passed.`(否则 throw,看错误信息)
- diff-friendly check:`git diff canvas-apis-enriched.json`(中间 JSON 是 diff target)

---

## 14. 引用(D-P0 编号)

- D-P0-06:三阶段 pipeline + JSON SoT + markdown 派生品
- D-P0-08:public-ish 判定标准(boolean evidence)
- D-P0-09:monkey-patched inventory + Δ1.1 step 2.5 提前
- D-P0-10:Module-level export 三向分类 + sibling 排除
- D-P0-11:§a inventory cross-validation + §b wrap/hook 分支 + §d 备注 prefix
- D-P0-12:§3.2 facade 判定标准(选项 A 严格双向确认)
- D-P0-13:V2/卫星 noise 过滤策略
- D-P0-14:facade-only 判定标准明确化
- D-P0-17:估时 cycle 数度量 + facade 完整性 + quirks 33 验证
- D-P0-18:D-P0-05 加第四类标签 `推迟到下一 phase`

详见 `../99-progress.md` 各决策块。
