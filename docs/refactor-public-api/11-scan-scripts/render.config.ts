/**
 * render.config.ts — pen/render.ts (rendering helper) scan config
 *
 * 使用方式:
 *   npx tsx docs/refactor-public-api/11-scan-scripts/render.config.ts
 *
 * D-P0 cross-references(render-specific,Δ2.4):
 *   D-P0-26       module-level grep 双 pattern 交叉验证(P-import + P-call)
 *   D-P0-22 §扩展 module-level internal-behavior(detect imported function call)
 *   D-P0-25 §扩展 module-level forgotten-export(平行 class-level forgotten-public)
 *
 * 4 Q-R 拍板(Δ2.4):
 *   R1 expectedClassCount: 0(render.ts 0 class + 30+ module-level export functions)
 *   R2 grep pattern: D-P0-26 双 pattern 交叉验证(import filter + call detection)
 *   R3 internal-behavior: D-P0-22 §扩展 — module-level form
 *   R4 forgotten-export: D-P0-25 §扩展 — 平行 forgotten-public 子分类
 */

import * as path from 'node:path'
import { runScan, ScanConfig, ValuableDiscoveriesContext } from './scan-api'

const CWD = process.cwd()
const V2_SRC = path.resolve(CWD, 'src')
const META2D_ROOT = path.resolve(CWD, '..', 'meta2d.js')
const SCAN_SCRIPTS_DIR = path.resolve(CWD, 'docs', 'refactor-public-api', '11-scan-scripts')
const REFACTOR_PUBLIC_API_DIR = path.resolve(CWD, 'docs', 'refactor-public-api')

const config: ScanConfig = {
  targetFile: path.resolve(META2D_ROOT, 'packages', 'core', 'src', 'pen', 'render.ts'),
  outputBasename: 'render-apis',
  outputJsonDir: SCAN_SCRIPTS_DIR,
  markdownOutputPath: path.resolve(REFACTOR_PUBLIC_API_DIR, '11c-render-api-inventory.md'),
  markdownTitle: '11c — render.ts API Inventory',
  markdownSourceLine: '`../meta2d.js/packages/core/src/pen/render.ts` (4700 LOC, rendering helper module)',

  // Q-R1:0 class + 30+ module-level export functions
  expectedClassCount: 0,
  expectedClassErrorContext: 'render.ts',

  // V2 evidence root + 排除 overlay/(同 canvas/core);receiver list 不重要(module-fn 用 D-P0-26)
  v2EvidenceRoot: path.join(V2_SRC, 'engine', 'adapters', 'meta2d'),
  v2EvidenceExcludeSubdirs: ['overlay'],
  v2ReceiverList: ['canvas'],  // not used for module-fn (D-P0-26 双 pattern overrides)

  satelliteRoots: ['flow', 'form', 'fta', 'chart', 'svg'].map((s) =>
    path.join(META2D_ROOT, 'packages', `${s}-diagram`, 'src')
  ),
  satelliteReceiverList: ['canvas'],  // 同上

  // Q-R1:无 class → facade-delegate 不适用;exportCheck 不适用
  facadeFiles: [],
  useExportCheck: false,

  // sibling 排除 render.ts 自身 + core.ts(facade) + index.ts(re-export)
  // 包含 canvas.ts + canvas/ subdir + 其他 sibling 模块
  // ⚠️ Q5 self-check fix(D-P0-19 §3 (b)):初版错排除 canvas.ts;canvas.ts 是 render.ts
  //    的主要 consumer(Canvas class methods 内部调 renderPen / drawImage / etc),
  //    必须包含为 sibling。
  siblingRoot: path.join(META2D_ROOT, 'packages', 'core', 'src'),
  siblingFileFilter: (p: string) => {
    if (!p.endsWith('.ts')) return false
    const norm = p.replace(/\\/g, '/')
    if (norm.endsWith('/pen/render.ts')) return false  // self
    if (norm.endsWith('/core.ts')) return false        // facade
    if (norm.endsWith('/index.ts')) return false       // re-export
    return true  // 包含 canvas.ts + canvas/ subdir + 其他 sibling
  },
  siblingPathRelativeTo: META2D_ROOT,

  // Q-R3:D-P0-22 §扩展 module-level internal-behavior(自动从 imports 提取 names)
  moduleLevelInternalBehavior: true,

  // Q-R2:D-P0-26 双 pattern — V2/卫星 端通过 '@meta2d/core' import sub-module functions
  moduleLevelImportPath: '@meta2d/core',

  // Q-R4:D-P0-25 §扩展 forgotten-export 自动应用(scan-api.ts classifyModuleExport 已实施)

  // 无 monkey-patch
  monkeyPatchInventory: undefined,
  monkeyPatchSourceFile: undefined,

  // valuable discoveries (render 视角)
  valuableDiscoveriesGenerator: (ctx: ValuableDiscoveriesContext) => {
    const forgottenExportCount = ctx.entries.filter((e) => e.kind.startsWith('module-') && e.classification === 'forgotten-public').length
    const publicIshCount = ctx.entries.filter((e) => e.kind.startsWith('module-') && e.classification === 'public-ish').length
    const appendixCount = ctx.appendixCount

    let md = '## Δ2.5 数据规模 valuable discoveries(render.ts)\n\n'
    md += '> render.ts = pen/render.ts(4700 LOC,0 class + module-level rendering helper functions)\n'
    md += '> P4 拆解时是"被 import 的渲染 helper",拆解策略 = 跟 sub-module 拆 / 留 pen/ 内 / 移到 render/ 新模块\n\n'

    md += '### render.ts module-level surface 规模\n\n'
    md += `- **总 ${ctx.entries.length} entries**(全 module-level export functions / consts / types,无 class member)\n`
    md += `- **public-ish ${publicIshCount}**(D-P0-26 双 pattern:V2/卫星 import @meta2d/core + 调 function)\n`
    md += `- **forgotten-export ${forgottenExportCount}**(D-P0-25 §扩展;export 但 V2/卫星/sibling 全 0 import = surface 死代码 / 未来 surface 候选)\n`
    md += `- **appendix(sibling-only)${appendixCount}**(meta2d 包内 sibling import 但无外部消费 → P4 拆 render.ts 时 sibling 同步)\n\n`

    md += '### internal-behavior 维度(D-P0-22 §扩展 — module-level form)\n\n'
    const pure = ctx.entries.filter((e) => e.internalBehavior === 'pure-delegate').length
    const mixed = ctx.entries.filter((e) => e.internalBehavior === 'mixed-delegate').length
    const nonDel = ctx.entries.filter((e) => e.internalBehavior === 'non-delegate').length
    const totalBehavior = pure + mixed + nonDel
    if (totalBehavior > 0) {
      md += `- **pure-delegate ${pure} 条** — function body 单一 imported function call(P4 拆解直接搬到 sub-module)\n`
      md += `- **mixed-delegate ${mixed} 条** — body 含 imported call + 其他逻辑(P4 风险点逐条 review)\n`
      md += `- **non-delegate ${nonDel} 条** — body 无 sub-module call(render.ts 真正自身 logic 核心)\n`
      md += `- 比例:${(pure / totalBehavior * 100).toFixed(0)}% / ${(mixed / totalBehavior * 100).toFixed(0)}% / ${(nonDel / totalBehavior * 100).toFixed(0)}%\n\n`
    }

    md += '### render.ts 的 surface 定位:纯内部 module(P3 不进 surface v1.0)\n\n'
    md += `**深层 valuable discovery #8**(2026-05-02 Δ2 收口 user 提示后补登记;Δ2.5 实施时漏识别)\n\n`
    md += `**数据基础**:\n\n`
    md += `- **0 真 public**(V2/卫星 D-P0-26 双 pattern 0 命中:无文件同时 P-import + P-call)\n`
    md += `- **${forgottenExportCount} forgotten-export**(D-P0-25 §扩展;module-level export 但 V2/卫星 0 import = 死代码 / 未来 surface 候选)\n`
    md += `- **${appendixCount} 附录**(纯 meta2d 包内 sibling 消费,主要是 canvas.ts + canvas/ subdir + diagrams/ + tooltip/ 等)\n\n`
    md += `**工程含义**:\n\n`
    md += `- render.ts **不是对外 API surface**,是 canvas.ts 的实现 helper\n`
    md += `- V2/卫星不直接消费 render(全部通过 canvas 间接 — 卫星端 \`pen.calculative.canvas.render()\` 是 G-001 sub-A 暗线,不算 render 直接消费)\n`
    md += `- ${forgottenExportCount} forgotten-export 是 V1 残留,P3 切换可全部丢弃\n\n`
    md += `**对比三文件 surface 定位**:\n\n`
    md += `| 文件 | 真对外消费 | 死代码 / forgotten | 主要消费者 | surface 定位 |\n`
    md += `|---|---|---|---|---|\n`
    md += `| canvas.ts(11a) | 116(public 53 + public-ish 63)| 0 | V2/卫星直接(大量)+ 暗线 | 对外 surface(脏 god-class)|\n`
    md += `| core.ts(11b) | 25 真双向契约 | 224 forgotten-public | V2(通过 \`meta2d.X\` facade)| 对外 facade(干净)|\n`
    md += `| **render.ts(11c)** | **0** | **${forgottenExportCount} forgotten-export** | meta2d 包内 sibling(canvas/ + 其他)| **纯内部 module** |\n\n`
    md += `**P3 切换 + P4 拆解工程含义**:\n\n`
    md += `- render.ts **不进入 surface v1.0**(P1 spike 评估 surface 时,render.ts 不列入 119 API surface 候选)\n`
    md += `- P4 拆 canvas/render 时,render.ts 作为 canvas.ts 的 sibling helper **同步重组**,不需要独立 surface 设计\n`
    md += `- ${forgottenExportCount} forgotten-export 函数:P3 切换可丢弃;${appendixCount} 附录函数:P4 拆 canvas 时按 sibling 同步\n\n`

    return md
  },
}

runScan(config)
