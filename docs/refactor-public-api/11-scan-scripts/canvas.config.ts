/**
 * canvas.config.ts — canvas.ts scan config + entry point
 *
 * 使用方式:
 *   npx tsx docs/refactor-public-api/11-scan-scripts/canvas.config.ts
 *
 * D-P0 cross-references(canvas-specific):
 *   D-P0-09  monkey-patch INVENTORY(4 entries from V2 installUxPatches.ts)
 *   D-P0-15  卫星 pen.calculative.canvas 暗线发现(11h G-001 6 sub-form)
 *   D-P0-17 §2 Meta2d facade 完整性问题(P1 必看)
 */

import * as path from 'node:path'
import { runScan, ScanConfig, InventoryEntry, ValuableDiscoveriesContext } from './scan-api'

const CWD = process.cwd()
const V2_SRC = path.resolve(CWD, 'src')
const META2D_ROOT = path.resolve(CWD, '..', 'meta2d.js')
const SCAN_SCRIPTS_DIR = path.resolve(CWD, 'docs', 'refactor-public-api', '11-scan-scripts')
const REFACTOR_PUBLIC_API_DIR = path.resolve(CWD, 'docs', 'refactor-public-api')

// D-P0-09 INVENTORY — Δ1.1 step 2.5 全量分析 V2 installUxPatches.ts 393 行
const D_P0_09_INVENTORY: Record<string, InventoryEntry> = {
  'active':         { form: 'wrap-pattern', installLineHint: 125, relatedBug: 'P2 marquee 误选' },
  'initMovingPens': { form: 'wrap-pattern', installLineHint: 192, relatedBug: 'C-11 line ghost / drag 双影' },
  'render':         { form: 'wrap-pattern', installLineHint: 228, relatedBug: 'C-11 restore phase + width/height short-circuit' },
  'customMoveDock': { form: 'hook-field',   installLineHint: 272, relatedBug: 'DEBT-013 dock snap-to-self' },
}

const config: ScanConfig = {
  targetFile: path.resolve(META2D_ROOT, 'packages', 'core', 'src', 'canvas', 'canvas.ts'),
  outputBasename: 'canvas-apis',
  outputJsonDir: SCAN_SCRIPTS_DIR,
  markdownOutputPath: path.resolve(REFACTOR_PUBLIC_API_DIR, '11a-canvas-api-inventory.md'),
  markdownTitle: '11a — canvas.ts API Inventory',
  markdownSourceLine: '`../meta2d.js/packages/core/src/canvas/canvas.ts` (9828 LOC)',

  expectedClassCount: 1,
  expectedClassErrorContext: 'canvas.ts',

  // V2 evidence: src/engine/adapters/meta2d/ 排除 overlay/(D-P0-13)
  v2EvidenceRoot: path.join(V2_SRC, 'engine', 'adapters', 'meta2d'),
  v2EvidenceExcludeSubdirs: ['overlay'],

  // 卫星 5 包
  satelliteRoots: ['flow', 'form', 'fta', 'chart', 'svg'].map((s) =>
    path.join(META2D_ROOT, 'packages', `${s}-diagram`, 'src')
  ),

  // facade(Meta2d 顶层 facade)
  facadeFiles: [
    path.join(META2D_ROOT, 'packages', 'core', 'src', 'core.ts'),
    path.join(META2D_ROOT, 'packages', 'core', 'src', 'index.ts'),
  ],

  // sibling(D-P0-10):排除 canvas.ts 自身 / canvas/ 子目录 / facade
  siblingRoot: path.join(META2D_ROOT, 'packages', 'core', 'src'),
  siblingFileFilter: (p: string) => {
    if (!p.endsWith('.ts')) return false
    const norm = p.replace(/\\/g, '/')
    if (norm.endsWith('/canvas.ts')) return false
    if (norm.includes('/canvas/')) return false
    if (norm.endsWith('/core.ts')) return false
    if (norm.endsWith('/index.ts')) return false
    return true
  },
  siblingPathRelativeTo: META2D_ROOT,

  // D-P0-09 monkey-patch inventory + V2 installUxPatches.ts source
  monkeyPatchInventory: D_P0_09_INVENTORY,
  monkeyPatchSourceFile: path.join(V2_SRC, 'engine', 'adapters', 'meta2d', 'installUxPatches.ts'),

  // canvas-specific valuable discoveries(D-P0-17 §2 Meta2d facade 完整性 / D-P0-15 暗线 / 等)
  valuableDiscoveriesGenerator: (ctx: ValuableDiscoveriesContext) => {
    let md = '## Δ1.2 数据规模 valuable discoveries\n\n'
    md += '> P1 surface 修订的关键输入材料。Δ1.3 review 后,如果 user 觉得需要 promote 到独立文档,可以从这里抽出。\n\n'

    md += '### V1 god-class 公开面规模(P1 修订基础)\n\n'
    md += `- **主表格 ${ctx.mainTotal} 条**(public ${ctx.publicCount} + public-ish ${ctx.publicIshCount}),internal filter ${ctx.internalCount} 条不进 11a\n`
    md += `- **public-ish 占主表格 ${(ctx.publicIshCount / ctx.mainTotal * 100).toFixed(0)}%** — V1 god-class 大量"无 \`public\` 关键字但被外部依赖" 的事实契约\n`
    md += `- 工程含义:V1 内核 ${ctx.publicIshCount} 条事实契约,P4 拆解时每条都要单独决定 promote 到 v1.1 surface 或当 V2 违章丢弃。这些是 P0 → P1 surface 修订的关键输入。\n\n`

    md += '### facade-delegate 暴露面(D-P0-12 选项 A 双向确认)\n\n'
    md += `- **${ctx.facadeDelegateCount} 条 method/property 通过 Meta2d 顶层 facade-delegate 暴露**(D-P0-12 选项 A 同名 + body 内 \`this.canvas?.<name>\` delegate)\n`
    md += `- 这是 surface v1.0 已隐含承诺但未显式列出的 API surface — P1 spike 时直接对照 surface v1.0 看哪些 method 漏列\n\n`

    md += '### monkey-patch 形态(D-P0-09 inventory)\n\n'
    md += `- **${ctx.monkeyPatchedCount} 条 wrap-pattern monkey-patch**(MP-01/02/03,在 11f §4.3.5 详记)\n`
    md += `- **${ctx.hookUtilCount} 条 hook-util utilization**(MP-04 customMoveDock,备注列 \`[hook-util]\` 标记;非 monkey-patch,但卫星 / V2 端利用 meta2d 公开 hook 解决问题)\n\n`

    md += '### 卫星非 facade 暗线访问路径(P4 拆解风险)\n\n'
    md += `- 详见 \`11h-surface-gaps.md\` G-001+ 系列(\`需 user 裁决\` 队列)\n`
    md += `- 卫星包通过 \`pen.calculative.canvas.<X>\` chain 绕过 Meta2d facade,P4 拆解 canvas 不能纯按 Meta2d 顶层契约重组\n\n`

    md += '### Meta2d facade 完整性问题(P1 必看 — 2026-05-02 Δ1.3.1 深层问题 2)\n\n'
    md += `**V1 god-class 的 Meta2d facade 是不完整的设计**。V2 + 卫星都通过非 facade 路径访问 canvas:\n\n`
    md += `- **facade-delegate ${ctx.facadeDelegateCount}**(明确通过 Meta2d 顶层暴露,D-P0-12 选项 A 双向确认)\n`
    md += `- **public-ish ${ctx.publicIshCount}**(无 facade 但 V2/卫星直接调,绕过 Meta2d)\n`
    md += `- **暗线 G-001 6 sub-form**(卫星通过 \`pen.calculative.canvas\` chain,95 hits across 12 files)\n`
    md += `- **总:V1 实际 surface = ${ctx.mainTotal} 主表格 + 暗线 sub-form** — 比 surface v1.0 119 API 范围大得多\n\n`
    md += `surface v1.0 119 API 是 V2 团队设计的**理想 surface**,V1 实际外部消费面已经远超 119。\n\n`
    md += `**P1 spike 必做 — surface v1.0 vs V1 实际 surface 差集分析(4 维)**:\n\n`
    md += `| 维度 | 含义 | 处置 |\n`
    md += `|---|---|---|\n`
    md += `| surface v1.0 有 / V1 没有 | 设计中但未实现 | P1+P2 新建机制(spike 工作)|\n`
    md += `| V1 有 / surface v1.0 也有 | 已 align | P3 V2 切换平滑 |\n`
    md += `| V1 有 / surface v1.0 没有 | V1 实际暴露超出设计 | P0 → P1 桥的 11h gap;每条 \`surface-补 v1.1\` / \`主动放弃\` 三选一 |\n`
    md += `| 暗线(\`pen.calculative.canvas\`)| 卫星绕过 facade 的访问路径 | 单独的 P4 兼容路径设计 — G-001 user 裁决后定方向 |\n\n`

    return md
  },
}

runScan(config)
