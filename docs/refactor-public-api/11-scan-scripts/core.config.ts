/**
 * core.config.ts — core.ts (Meta2d facade entry) scan config
 *
 * 使用方式:
 *   npx tsx docs/refactor-public-api/11-scan-scripts/core.config.ts
 *
 * D-P0 cross-references(core-specific,Δ2.2):
 *   D-P0-20  core.ts surface 角色差异(facade 入口 vs canvas god-class)
 *   D-P0-21  dual-pattern verify(V2 / 卫星 receiver 漏判验证)
 *   D-P0-22  internal-behavior 枚举维度(pure/mixed/non-delegate)
 *
 * 6 边角处置(D-P0-20):
 *   §1 facade-delegate 维度拆分(维度 A 对外暴露 + 维度 B 内部行为)
 *   §2 V2 receiver list:meta2d / m2d / engine(等价 user 8 项)
 *   §3 卫星 receiver list:parent / meta2d / globalStore(等价 user 5 项)
 *   §4 facade files = [] + useExportCheck = true / exportCheckFiles = [index.ts]
 *   §5 sibling 包含 canvas/ + canvas.ts + 其他 sibling 模块
 *   §6 monkey-patch inventory undefined(V2 无 meta2d.X = ... patch)
 */

import * as path from 'node:path'
import { runScan, ScanConfig, ValuableDiscoveriesContext } from './scan-api'

const CWD = process.cwd()
const V2_SRC = path.resolve(CWD, 'src')
const META2D_ROOT = path.resolve(CWD, '..', 'meta2d.js')
const SCAN_SCRIPTS_DIR = path.resolve(CWD, 'docs', 'refactor-public-api', '11-scan-scripts')
const REFACTOR_PUBLIC_API_DIR = path.resolve(CWD, 'docs', 'refactor-public-api')

const config: ScanConfig = {
  targetFile: path.resolve(META2D_ROOT, 'packages', 'core', 'src', 'core.ts'),
  outputBasename: 'core-apis',
  outputJsonDir: SCAN_SCRIPTS_DIR,
  markdownOutputPath: path.resolve(REFACTOR_PUBLIC_API_DIR, '11b-core-api-inventory.md'),
  markdownTitle: '11b — core.ts API Inventory',
  markdownSourceLine: '`../meta2d.js/packages/core/src/core.ts` (7027 LOC, Meta2d facade entry class)',

  expectedClassCount: 1,  // Meta2d class
  expectedClassErrorContext: 'core.ts',

  // V2 evidence: 同 canvas 的 V2 source root + receiver list 不同 (D-P0-20 §2)
  v2EvidenceRoot: path.join(V2_SRC, 'engine', 'adapters', 'meta2d'),
  v2EvidenceExcludeSubdirs: ['overlay'],
  v2ReceiverList: ['meta2d', 'm2d', 'engine'],

  // 卫星 (D-P0-20 §3)
  satelliteRoots: ['flow', 'form', 'fta', 'chart', 'svg'].map((s) =>
    path.join(META2D_ROOT, 'packages', `${s}-diagram`, 'src')
  ),
  satelliteReceiverList: ['parent', 'meta2d', 'globalStore'],

  // facade files = [](D-P0-20 §4 — core.ts 是 Meta2d 本身,facade-delegate 不适用)
  facadeFiles: [],
  // export check 替代:Meta2d 在 packages/core/index.ts(top-level main entry,见 package.json `"main": "index.ts"`)re-export
  // ⚠️ 不是 packages/core/src/index.ts(`src/` 下无 index.ts — Δ2.3 实施时发现的边角)
  useExportCheck: true,
  exportCheckFiles: [path.join(META2D_ROOT, 'packages', 'core', 'index.ts')],

  // sibling (D-P0-20 §5):排除 core.ts 自身 + index.ts;包含 canvas/ + canvas.ts + 其他
  siblingRoot: path.join(META2D_ROOT, 'packages', 'core', 'src'),
  siblingFileFilter: (p: string) => {
    if (!p.endsWith('.ts')) return false
    const norm = p.replace(/\\/g, '/')
    if (norm.endsWith('/core.ts')) return false
    if (norm.endsWith('/index.ts')) return false
    return true  // 包含 canvas/ + canvas.ts + 其他 sibling 模块
  },
  siblingPathRelativeTo: META2D_ROOT,

  // monkey-patch (D-P0-20 §6 — V2 无 meta2d.X = ... patch)
  monkeyPatchInventory: undefined,
  monkeyPatchSourceFile: undefined,

  // D-P0-22 internal-behavior — Meta2d 类持有的 sub-module fields
  subModulesForBehavior: [
    'canvas', 'store', 'tooltip', 'scroll', 'dialog', 'title', 'popconfirm', 'map',
    'magnifierCanvas', 'canvasImage', 'canvasTemplate',
  ],

  // valuable discoveries(core 视角)
  valuableDiscoveriesGenerator: (ctx: ValuableDiscoveriesContext) => {
    let md = '## Δ2.3 数据规模 valuable discoveries(core.ts)\n\n'
    md += '> P1 surface 修订关键输入材料(core 视角:Meta2d facade 入口的 surface 边界)。\n\n'

    md += '### Meta2d facade surface 规模\n\n'
    md += `- **主表格 ${ctx.mainTotal} 条**(public ${ctx.publicCount} + public-ish ${ctx.publicIshCount}),internal filter ${ctx.internalCount} 条不进 11b\n`
    md += `- **public 占 ${(ctx.publicCount / ctx.mainTotal * 100).toFixed(0)}%** — Meta2d 类 export(via index.ts)+ 无 \`private\` keyword 默认 public\n`
    md += `- 工程含义(D-P0-20 (R3) acknowledge):11b 目标是 Meta2d 对外 API surface,internal 数量大是预期(Meta2d 内部 helper / impl)\n\n`

    md += '### internal-behavior 维度分布(D-P0-22)\n\n'
    const pure = ctx.entries.filter((e) => e.internalBehavior === 'pure-delegate').length
    const mixed = ctx.entries.filter((e) => e.internalBehavior === 'mixed-delegate').length
    const nonDel = ctx.entries.filter((e) => e.internalBehavior === 'non-delegate').length
    md += `- **pure-delegate ${pure} 条** — Meta2d.X body 单一 delegate 调用(P4 拆解时跟 sub-module 拆)\n`
    md += `- **mixed-delegate ${mixed} 条** — body 含 delegate + 其他逻辑(P4 拆解风险点,逐条 review)\n`
    md += `- **non-delegate ${nonDel} 条** — body 无 sub-module delegate(留 Meta2d 类自身 logic)\n`
    md += `- 比例:**${pure}/${mixed}/${nonDel}** = ${(pure / (pure + mixed + nonDel) * 100).toFixed(0)}% / ${(mixed / (pure + mixed + nonDel) * 100).toFixed(0)}% / ${(nonDel / (pure + mixed + nonDel) * 100).toFixed(0)}%\n\n`

    md += '### V2 调用 Meta2d API surface\n\n'
    md += `- V2 / 卫星 grep 命中(public-ish):**${ctx.publicIshCount} 条**\n`
    md += `- 这些是 V2/卫星实际依赖的 Meta2d API,P3 切换时必须保留\n\n`

    md += '### Meta2d facade 完整性问题(P1 必看)\n\n'
    md += `- canvas.ts 视角(11a):Meta2d facade-delegate 53 条;V2/卫星绕 facade 直接访问 canvas 暗线(G-001 6 sub-form)\n`
    md += `- core.ts 视角(本表):Meta2d 类 ${ctx.mainTotal} 条对外 surface(public ${ctx.publicCount} + public-ish ${ctx.publicIshCount})\n`
    md += `- **P1 spike 4 维差集分析**(详见 11a Meta2d facade 完整性段)+ **新加 5 维**:Meta2d.X 是 pure-delegate / mixed-delegate / non-delegate 决定 P4/P5 拆解策略\n\n`

    md += '### Meta2d 类对外 surface 干净度对比 canvas 类(P3 切换风险)\n\n'
    md += `**V1 god-class 设计的双重性**(2026-05-02 Δ2.3 D-P0-23 user 拍板时漏的 valuable discovery,Δ2.4 补登记):\n\n`
    md += `| 维度 | core.ts(本表)| canvas.ts(11a)|\n`
    md += `|---|---|---|\n`
    md += `| public-ish | **${ctx.publicIshCount}** | 63 |\n`
    md += `| public(双向 / facade-delegate)| ${ctx.publicCount} | 53 |\n`
    md += `| forgotten-public(死代码)| ${ctx.entries.filter((e) => e.classification === 'forgotten-public').length} | 0 |\n`
    md += `| 暗线访问路径 | **0**(无暗线)| G-001 6 sub-form 95 hits |\n\n`
    md += `**核心 finding**:**core.ts public-ish = 0**(V2/卫星消费 Meta2d 全通过 export 暴露,无暗线);**canvas.ts public-ish = 63 + 暗线 6 sub-form**(V2/卫星大量绕 facade 直接调 canvas)。\n\n`
    md += `**意义**:Meta2d 是**干净的对外 facade**,canvas 是**脏的内部 god-class**。\n\n`
    md += `**P3 切换工程含义**:\n\n`
    md += `- **core.ts 切换干净** — 所有对外消费通过 export 暴露,P3 只需 V2 切新 Meta2d facade 即可\n`
    md += `- **canvas.ts 切换风险大** — public-ish 63 隐性契约 + G-001 暗线 6 sub-form,P3 必须**逐个 audit**\n\n`

    return md
  },
}

runScan(config)
