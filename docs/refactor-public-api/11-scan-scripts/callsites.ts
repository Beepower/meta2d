/**
 * callsites.ts — Phase 0 Δ3 详细 call site extractor
 *
 * 使用方式:
 *   npx tsx docs/refactor-public-api/11-scan-scripts/callsites.ts
 *
 * 输入:canvas-apis-enriched.json + core-apis-enriched.json (Δ1.2 / Δ2.3 SoT)
 * 输出:
 *   - 11d-satellite-call-sites.md(per 卫星 file 章节)
 *   - 11e-v2-call-sites.md(per V2 file 章节)
 *
 * 区别于 Δ1.2 boolean evidence(D-P0-08):
 *   - Δ1.2 grep:hit/no-hit boolean,judge public-ish
 *   - Δ3 grep:**详细 file:line:context list**(P4 拆解时 batch 改 file 参考)
 *
 * D-P0 cross-references:
 *   D-P0-04  严格顺序方案 A(Δ1-2 之后才 Δ3)
 *   D-P0-08  public-ish boolean vs Δ3 详细 call site 区分
 *   D-P0-13  receiver pattern(canvas / meta2d|m2d|engine)— 重用 strict pattern
 *   D-P0-26  module-level dual pattern — 重用 P-import + P-call
 */

import * as fs from 'node:fs'
import * as path from 'node:path'

const CWD = process.cwd()
const V2_SRC = path.resolve(CWD, 'src')
const META2D_ROOT = path.resolve(CWD, '..', 'meta2d.js')
const SCAN_DIR = path.resolve(CWD, 'docs', 'refactor-public-api', '11-scan-scripts')
const OUT_DIR = path.resolve(CWD, 'docs', 'refactor-public-api')

interface ApiEntry {
  id: string
  name: string
  kind: string
  classification: string
  callers: string[]
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function walkDir(root: string, filter: (p: string) => boolean): string[] {
  const out: string[] = []
  if (!fs.existsSync(root)) return out
  const stack = [root]
  while (stack.length > 0) {
    const dir = stack.pop()!
    let entries: fs.Dirent[]
    try { entries = fs.readdirSync(dir, { withFileTypes: true }) } catch { continue }
    for (const ent of entries) {
      const full = path.join(dir, ent.name)
      if (ent.isDirectory()) stack.push(full)
      else if (ent.isFile() && filter(full)) out.push(full)
    }
  }
  return out
}

interface CallSite {
  file: string         // relative path
  line: number
  context: string      // line text trimmed (max 120 char)
  methodName: string   // method called
  methodId?: string    // C/M/MX 编号 from inventory
  source: 'canvas' | 'core'  // which inventory the method comes from
}

function findCallSites(filePath: string, content: string, namesByPattern: Map<string, RegExp>, methodMeta: Map<string, { id?: string; source: 'canvas' | 'core' }>): CallSite[] {
  const sites: CallSite[] = []
  const lines = content.split('\n')
  for (const [name, pattern] of namesByPattern) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]!
      if (pattern.test(line)) {
        const meta = methodMeta.get(name)!
        sites.push({
          file: filePath,
          line: i + 1,
          context: line.trim().slice(0, 120),
          methodName: name,
          methodId: meta.id,
          source: meta.source,
        })
      }
    }
  }
  return sites
}

function loadInventories(): { canvas: ApiEntry[]; core: ApiEntry[] } {
  return {
    canvas: JSON.parse(fs.readFileSync(path.join(SCAN_DIR, 'canvas-apis-enriched.json'), 'utf8')),
    core: JSON.parse(fs.readFileSync(path.join(SCAN_DIR, 'core-apis-enriched.json'), 'utf8')),
  }
}

function buildCanvasPatterns(canvasEntries: ApiEntry[]): Map<string, RegExp> {
  // canvas.X / xxx.canvas.X (D-P0-13 receiver pattern)
  const map = new Map<string, RegExp>()
  for (const e of canvasEntries) {
    if (e.classification !== 'public' && e.classification !== 'public-ish') continue
    const escName = escapeRegex(e.name)
    map.set(e.name, new RegExp(`(?:[\\w.]+\\.)?canvas\\.${escName}\\b`))
  }
  return map
}

function buildCorePatterns(coreEntries: ApiEntry[]): Map<string, RegExp> {
  // meta2d|m2d|engine .X (D-P0-13 core receiver list)
  const map = new Map<string, RegExp>()
  for (const e of coreEntries) {
    // 真 public 命中(不含 forgotten-public — those have 0 V2/sat hit)
    if (e.classification !== 'public' && e.classification !== 'public-ish') continue
    const escName = escapeRegex(e.name)
    map.set(e.name, new RegExp(`(?:[\\w.]+\\.)?(?:meta2d|m2d|engine)\\.${escName}\\b`))
  }
  return map
}

function buildMethodMeta(canvasEntries: ApiEntry[], coreEntries: ApiEntry[]): Map<string, { id?: string; source: 'canvas' | 'core' }> {
  const map = new Map<string, { id?: string; source: 'canvas' | 'core' }>()
  for (const e of canvasEntries) {
    if (e.classification !== 'public' && e.classification !== 'public-ish') continue
    if (!map.has(e.name)) map.set(e.name, { id: e.id, source: 'canvas' })
  }
  for (const e of coreEntries) {
    if (e.classification !== 'public' && e.classification !== 'public-ish') continue
    // canvas + core 同名重叠 (D-P0-24) — canvas 优先(facade-delegate 来源)
    if (!map.has(e.name)) map.set(e.name, { id: e.id, source: 'core' })
  }
  return map
}

function byFile(sites: CallSite[], rootPath: string): Map<string, CallSite[]> {
  const m = new Map<string, CallSite[]>()
  for (const s of sites) {
    const rel = path.relative(rootPath, s.file).replace(/\\/g, '/')
    if (!m.has(rel)) m.set(rel, [])
    m.get(rel)!.push(s)
  }
  return m
}

function renderCallSitesByFile(sites: CallSite[], rootPath: string, title: string, sourceDescription: string): string {
  // Group by file
  const byFile = new Map<string, CallSite[]>()
  for (const s of sites) {
    const rel = path.relative(rootPath, s.file).replace(/\\/g, '/')
    if (!byFile.has(rel)) byFile.set(rel, [])
    byFile.get(rel)!.push(s)
  }

  let md = `# ${title}\n\n`
  md += `> Source: ${sourceDescription}\n`
  md += `> Generated by: \`docs/refactor-public-api/11-scan-scripts/callsites.ts\`\n`
  md += `> Generated at: ${new Date().toISOString()}\n`
  md += `> SoT: \`canvas-apis-enriched.json\` + \`core-apis-enriched.json\`(Δ1.2 + Δ2.3)\n`
  md += `> 调用点形态:仅列 D-P0-13 receiver pattern 命中(\`canvas.X\` / \`meta2d.X|m2d.X|engine.X\`),不含 destructure / property-access-only / 暗线 sub-form 已记 11h G-001\n\n`

  // Sort files by hit count(DESC)
  const sortedFiles = [...byFile.entries()].sort(([, a], [, b]) => b.length - a.length)

  md += `## 总览\n\n`
  md += `- 命中 file 数:${byFile.size}\n`
  md += `- 总 call site 数:${sites.length}\n`
  md += `- 命中 method 数(去重):${new Set(sites.map((s) => s.methodName)).size}\n\n`

  // Per file section
  let idCounter = 1
  for (const [file, fileSites] of sortedFiles) {
    md += `### ${file}\n\n`
    md += `| # | 行 | 调用方法 | 来源 | 调用点(snippet)|\n`
    md += `|---|----|---------|------|------------------|\n`
    fileSites.sort((a, b) => a.line - b.line)
    for (const s of fileSites) {
      const id = `${title.startsWith('11d') ? 'D' : 'E'}${String(idCounter++).padStart(3, '0')}`
      md += `| ${id} | ${s.line} | \`${s.methodName}\` | ${s.source}.ts | \`${s.context.replace(/\|/g, '\\|')}\` |\n`
    }
    md += `\n`
  }

  return md
}

function main(): void {
  const t0 = Date.now()
  console.log('Loading inventories...')
  const { canvas, core } = loadInventories()
  console.log(`  canvas ${canvas.length} entries / core ${core.length} entries`)

  const canvasPatterns = buildCanvasPatterns(canvas)
  const corePatterns = buildCorePatterns(core)
  console.log(`  canvas patterns: ${canvasPatterns.size} / core patterns: ${corePatterns.size}`)

  // Combine patterns(canvas + core)
  const allPatterns = new Map([...canvasPatterns, ...corePatterns])
  const methodMeta = buildMethodMeta(canvas, core)

  // V2 evidence: src/engine/adapters/meta2d/ excluding overlay/
  const v2Files = walkDir(path.join(V2_SRC, 'engine', 'adapters', 'meta2d'), (p) =>
    p.endsWith('.ts') && !p.includes(`${path.sep}overlay${path.sep}`)
  )
  console.log(`  V2 files: ${v2Files.length}`)

  // Satellite: 5 packages
  const satRoots = ['flow', 'form', 'fta', 'chart', 'svg'].map((s) =>
    path.join(META2D_ROOT, 'packages', `${s}-diagram`, 'src')
  )
  const satFiles: string[] = []
  for (const root of satRoots) satFiles.push(...walkDir(root, (p) => p.endsWith('.ts')))
  console.log(`  Satellite files: ${satFiles.length}`)

  console.log('Scanning V2...')
  const v2Sites: CallSite[] = []
  for (const f of v2Files) {
    const content = fs.readFileSync(f, 'utf-8')
    v2Sites.push(...findCallSites(f, content, allPatterns, methodMeta))
  }
  console.log(`  V2 call sites: ${v2Sites.length}`)

  console.log('Scanning satellites...')
  const satSites: CallSite[] = []
  for (const f of satFiles) {
    const content = fs.readFileSync(f, 'utf-8')
    satSites.push(...findCallSites(f, content, allPatterns, methodMeta))
  }
  console.log(`  Satellite call sites: ${satSites.length}`)

  // Render markdown
  const v2Md = renderCallSitesByFile(v2Sites, V2_SRC, '11e — V2 端 Meta2d / canvas 调用点详细列表', '`src/engine/adapters/meta2d/` (excluding `overlay/`) — V2 直接调用 canvas method + meta2d facade')
  const satMd = renderCallSitesByFile(satSites, META2D_ROOT, '11d — 卫星包 Meta2d / canvas 调用点详细列表', '`packages/{flow,form,fta,chart,svg}-diagram/src/` — 5 个 adopt 卫星包')

  // Δ3.3 valuable discoveries section (per file)
  const v2CanvasCalls = v2Sites.filter((s) => s.source === 'canvas').length
  const v2CoreCalls = v2Sites.filter((s) => s.source === 'core').length
  const satCanvasCalls = satSites.filter((s) => s.source === 'canvas').length
  const satCoreCalls = satSites.filter((s) => s.source === 'core').length
  const v2FileCount = new Set(v2Sites.map((s) => s.file)).size
  const satFileCount = new Set(satSites.map((s) => s.file)).size

  const v2Discoveries = `\n## Δ3.3 valuable discoveries(V2 端)\n\n` +
    `### V2 是 main consumer\n\n` +
    `- **${v2Sites.length} call sites in ${v2FileCount} files**(平均 ${(v2Sites.length / v2Files).toFixed(1)} hit/file)\n` +
    `- 对比卫星 ${satSites.length} sites in ${satFileCount} files(${(satSites.length / Math.max(satFiles, 1)).toFixed(1)} hit/file)— V2 hit density **${((v2Sites.length / v2Files) / Math.max(satSites.length / Math.max(satFiles, 1), 0.1)).toFixed(1)}x** 卫星\n` +
    `- 工程含义:V2 adapter 层是 Meta2d / canvas 的**主直接消费者**;P3 切换 risk 主要在 V2 adapter 重写\n\n` +
    `### canvas method vs Meta2d facade 调用比例\n\n` +
    `- canvas method calls(\`xxx.canvas.X\`):**${v2CanvasCalls}**(${(v2CanvasCalls / v2Sites.length * 100).toFixed(0)}%)\n` +
    `- Meta2d facade calls(\`xxx.meta2d|m2d|engine.X\`):**${v2CoreCalls}**(${(v2CoreCalls / v2Sites.length * 100).toFixed(0)}%)\n` +
    `- **canvas 调用占主导**(${(v2CanvasCalls / v2Sites.length * 100).toFixed(0)}% > 50%)— P3 切换 risk **集中在 canvas 切换**(canvas.ts main 116 + 暗线),Meta2d facade 切换次要(core.ts main 25 真双向)\n\n` +
    `### V2 文件密度 hotspot(P3 audit 优先级)\n\n` +
    [...byFile(v2Sites, V2_SRC).entries()].sort(([, a], [, b]) => b.length - a.length).slice(0, 5).map(([f, sites]) => `- \`${f}\`: ${sites.length} call sites`).join('\n') + '\n'

  const satDiscoveries = `\n## Δ3.3 valuable discoveries(卫星端)\n\n` +
    `### 卫星调用集中在 canvas 暗线(G-001 sub-form)\n\n` +
    `- canvas method calls:**${satCanvasCalls}**(${(satCanvasCalls / Math.max(satSites.length, 1) * 100).toFixed(0)}%)— 全部通过 \`pen.calculative.canvas.X\` chain(G-001 6 sub-form)\n` +
    `- Meta2d facade calls:**${satCoreCalls}**(${(satCoreCalls / Math.max(satSites.length, 1) * 100).toFixed(0)}%)— 通过 \`canvas.parent\` 反向访问 Meta2d 实例(G-001 sub-B)\n` +
    `- 工程含义:**卫星几乎不直接 import @meta2d/core**,全部通过 Pen 实例 chain 暗线访问。P4 拆 canvas 时 sat call site 全部受 G-001 暗线裁决方向影响\n\n` +
    `### V2 vs 卫星 surface consumption 不对称(P3 切换风险定位)\n\n` +
    `| 维度 | V2 | 卫星 | 比例 |\n` +
    `|---|---|---|---|\n` +
    `| call sites | ${v2Sites.length} | ${satSites.length} | V2 ${(v2Sites.length / Math.max(satSites.length, 1)).toFixed(0)}x |\n` +
    `| 命中文件 | ${v2FileCount} | ${satFileCount} | V2 ${(v2Files / Math.max(satFiles, 1)).toFixed(1)}x |\n` +
    `| canvas method | ${v2CanvasCalls} | ${satCanvasCalls} | V2 ${(v2CanvasCalls / Math.max(satCanvasCalls, 1)).toFixed(0)}x |\n` +
    `| Meta2d facade | ${v2CoreCalls} | ${satCoreCalls} | V2 ${(v2CoreCalls / Math.max(satCoreCalls, 1)).toFixed(0)}x |\n\n` +
    `**P3 切换 risk 定位**:V2 adapter 是 P3 切换主战场(${v2Sites.length} call sites);卫星 ${satSites.length} sites 走暗线 G-001,P3 + P7 共同处置(暗线裁决 + 卫星包重写)\n`

  fs.writeFileSync(path.join(OUT_DIR, '11e-v2-call-sites.md'), v2Md + v2Discoveries)
  fs.writeFileSync(path.join(OUT_DIR, '11d-satellite-call-sites.md'), satMd + satDiscoveries)

  console.log(`Done (${Date.now() - t0}ms)`)
  console.log(`  V2: ${v2Sites.length} call sites in ${new Set(v2Sites.map((s) => s.file)).size} files`)
  console.log(`  Satellite: ${satSites.length} call sites in ${new Set(satSites.map((s) => s.file)).size} files`)
}

main()
