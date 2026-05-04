/**
 * scan-api.ts — generic Phase 0 Δ1+ scan core(refactored from scan-canvas-api.ts)
 *
 * Exports:
 *   runScan(config: ScanConfig) — main entry; called by per-file config wrappers
 *     (canvas.config.ts / core.config.ts / render.config.ts)
 *
 * Per-file specifics(target file / monkey-patch inventory / valuable
 * discoveries 文本 / 等)由 config 提供;本文件保持 generic。
 *
 * D-P0 cross-references(generic to all per-file scans):
 *   D-P0-06  三阶段 pipeline + JSON SoT + markdown 派生品
 *   D-P0-08  public-ish 判定标准(boolean evidence)
 *   D-P0-09  monkey-patched inventory(per-file)
 *   D-P0-10  Module-level export 三向分类 + sibling 排除
 *   D-P0-11  §a inventory cross-validation + §b wrap/hook + §d 备注 prefix
 *   D-P0-12  facade-delegate 双向确认(选项 A 严格)
 *   D-P0-13  V2/卫星 noise 过滤策略
 *   D-P0-14  facade-only 判定单独可作 public 证据
 *   D-P0-19  self-check Q1-Q5 + 对称约束 + cycle 度量 + R8 关系矩阵
 *
 * Refactor history:
 *   - 2026-05-02 Δ2.1:从 scan-canvas-api.ts 重构,抽 ScanConfig
 */

import { Project, ClassDeclaration, MethodDeclaration, PropertyDeclaration, FunctionDeclaration, SyntaxKind } from 'ts-morph'
import * as fs from 'node:fs'
import * as path from 'node:path'

// =============================================================
// File utilities
// =============================================================

export function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function walkDir(root: string, filter: (p: string) => boolean): string[] {
  const out: string[] = []
  if (!fs.existsSync(root)) return out
  const stack = [root]
  while (stack.length > 0) {
    const dir = stack.pop()!
    let entries: fs.Dirent[]
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true })
    } catch {
      continue
    }
    for (const ent of entries) {
      const full = path.join(dir, ent.name)
      if (ent.isDirectory()) stack.push(full)
      else if (ent.isFile() && filter(full)) out.push(full)
    }
  }
  return out
}

export function loadFiles(paths: string[]): Map<string, string> {
  const map = new Map<string, string>()
  for (const p of paths) {
    try {
      map.set(p, fs.readFileSync(p, 'utf-8'))
    } catch { /* skip */ }
  }
  return map
}

export function matchAny(regex: RegExp, contents: Map<string, string>): boolean {
  for (const c of contents.values()) {
    if (regex.test(c)) return true
  }
  return false
}

export function findHitFiles(regex: RegExp, contents: Map<string, string>): string[] {
  const hits: string[] = []
  for (const [p, c] of contents) {
    if (regex.test(c)) hits.push(p)
  }
  return hits
}

// =============================================================
// Types
// =============================================================

export type PatchForm = 'wrap-pattern' | 'hook-field'

export interface InventoryEntry {
  form: PatchForm
  installLineHint: number
  relatedBug: string
}

/** D-P0-25 forgotten-public 子分类:export + 无 private + V2/卫星 grep 0 → surface 中死代码,P3 切换可丢弃。*/
export type Classification = 'public' | 'forgotten-public' | 'public-ish' | 'internal'
export type EntryKind = 'class-method' | 'class-property' | 'module-const' | 'module-fn' | 'module-type' | 'module-enum' | 'module-interface'

export type InternalBehavior = 'pure-delegate' | 'mixed-delegate' | 'non-delegate'

export interface ApiEntry {
  id: string
  name: string
  signature: string
  kind: EntryKind
  classification: Classification | 'appendix' | 'skip'
  monkeyPatched: boolean
  callers: string[]
  siblingPaths?: string[]
  notes: string[]
  monkeyPatchHookUtil?: string
  isPublicKeyword: boolean
  isPrivateKeyword: boolean
  /** D-P0-22 internal-behavior 枚举(per-config opt-in;canvas.config 不设此 field 留 undefined)*/
  internalBehavior?: InternalBehavior
}

export interface QuirkHit {
  line: number
  rawText: string
  fullLine: string
  attachedToMethod?: string
}

export interface ValuableDiscoveriesContext {
  entries: ApiEntry[]
  mainTotal: number
  publicCount: number
  publicIshCount: number
  facadeDelegateCount: number
  monkeyPatchedCount: number
  hookUtilCount: number
  internalCount: number
  appendixCount: number
}

export interface ScanConfig {
  /** Absolute path to target file to scan(e.g., canvas.ts / core.ts / render.ts).*/
  targetFile: string
  /** Output JSON basename(e.g., 'canvas-apis' / 'core-apis').*/
  outputBasename: string
  /** Output dir for JSON files(e.g., docs/refactor-public-api/11-scan-scripts).*/
  outputJsonDir: string
  /** Absolute path to markdown output(e.g., 11a-canvas-api-inventory.md).*/
  markdownOutputPath: string
  /** Markdown H1 title.*/
  markdownTitle: string
  /** Markdown source description line(e.g., '../meta2d.js/.../canvas.ts (9828 LOC)').*/
  markdownSourceLine: string

  /** ts-morph extraction: expected number of classes in file.*/
  expectedClassCount: number
  /** Error context for class count assertion(e.g., 'canvas.ts').*/
  expectedClassErrorContext: string

  /** Pre-load: V2 evidence root + exclude sub-directory names.*/
  v2EvidenceRoot: string
  v2EvidenceExcludeSubdirs?: string[]
  /** Pre-load: satellite *-diagram/src roots.*/
  satelliteRoots: string[]
  /** Pre-load: facade files(core.ts + index.ts typically).*/
  facadeFiles: string[]
  /** Pre-load: sibling root + filter function for exclusions.*/
  siblingRoot: string
  siblingFileFilter: (filePath: string) => boolean
  /** Sibling path display: relative to this root(default META2D_ROOT).*/
  siblingPathRelativeTo: string

  /** Optional D-P0-09 monkey-patch inventory(canvas-only currently).*/
  monkeyPatchInventory?: Record<string, InventoryEntry>
  /** Optional V2-side monkey-patch source file(installUxPatches.ts).*/
  monkeyPatchSourceFile?: string

  /** Optional valuable discoveries section generator.*/
  valuableDiscoveriesGenerator?: (ctx: ValuableDiscoveriesContext) => string

  // ============================================================
  // D-P0-20 §2 — V2/卫星 receiver list(D-P0-13 noise 过滤 file-specific)
  // ============================================================
  /** V2 receiver list (default ['canvas']). 卫星端调 X method 的 receiver chain 末段。
   *  Pattern build: (?:[\w.]+\.)?(?:<list>)\.<name>\b — prefix 自动覆盖 'this.X' / 'adapter.X' 等 chain。
   *  canvas: ['canvas'];core: ['meta2d', 'm2d', 'engine'](等价 user list 8 项 — `this.meta2d` / `adapter.meta2d` 等 prefix 自动覆盖)*/
  v2ReceiverList?: string[]
  /** 卫星 receiver list (default ['canvas']).
   *  canvas: ['canvas'];core: ['parent', 'meta2d', 'globalStore'](等价 user list 5 项)*/
  satelliteReceiverList?: string[]

  // ============================================================
  // D-P0-22 §3 — internal-behavior 枚举维度
  // ============================================================
  /** Sub-module names for D-P0-22 internal-behavior detection. 当 method body 调
   *  `this.<subModule>.<X>(...)` 时,该 method 算 delegate 形态。
   *  canvas.config: undefined(不开启此维度);core.config: ['canvas', 'store', 'render', ...] */
  subModulesForBehavior?: string[]

  // ============================================================
  // D-P0-20 §4 — export check (替代 facade-delegate 用于 core.ts)
  // ============================================================
  /** 启用 export check(替代 facade-delegate;facadeFiles=[] 时启用)*/
  useExportCheck?: boolean
  /** Files to check for class export(typically [index.ts]).*/
  exportCheckFiles?: string[]

  // ============================================================
  // D-P0-26 — module-level grep 双 pattern 交叉验证
  // ============================================================
  /** Module-level import path(typical '@meta2d/core' for V2/卫星 import).
   *  Used to detect P-import filter for module-level functions.
   *  render.config: '@meta2d/core' (V2/卫星 import sub-module functions through this).*/
  moduleLevelImportPath?: string
  /** Enable module-level internal-behavior detection(D-P0-22 §扩展).
   *  当 true,extractTopLevelExports 对 module-fn entries 调 detectModuleFunctionBehavior。*/
  moduleLevelInternalBehavior?: boolean
}

// =============================================================
// Global content maps(populated by runScan, used by has*Evidence)
// =============================================================

let V2_CONTENTS: Map<string, string> = new Map()
let SATELLITE_CONTENTS: Map<string, string> = new Map()
let FACADE_CONTENTS: Map<string, string> = new Map()
let SIBLING_CONTENTS: Map<string, string> = new Map()
let INSTALL_UX_PATCHES_CONTENT = ''
let CURRENT_CONFIG: ScanConfig | null = null

// =============================================================
// Stage 1 — ts-morph extract
// =============================================================

function hasModifier(node: MethodDeclaration | PropertyDeclaration, kind: SyntaxKind): boolean {
  try {
    return node.getModifiers().some((m) => m.getKind() === kind)
  } catch { return false }
}

function getMethodSignature(m: MethodDeclaration): string {
  const params = m.getParameters().map((p) => `${p.getName()}${p.hasQuestionToken() ? '?' : ''}: ${p.getType().getText() || 'unknown'}`).join(', ')
  return `(${params}) => ${m.getReturnType().getText()}`
}

function getPropertySignature(p: PropertyDeclaration): string {
  return `${p.hasQuestionToken() ? '?' : ''}: ${p.getType().getText()}`
}

function getFunctionSignature(fn: FunctionDeclaration): string {
  const params = fn.getParameters().map((p) => `${p.getName()}: ${p.getType().getText() || 'unknown'}`).join(', ')
  return `(${params}) => ${fn.getReturnType().getText()}`
}

function collectClassMemberNotes(member: MethodDeclaration | PropertyDeclaration): string[] {
  const notes: string[] = []
  if (member.getJsDocs().some((d) => d.getTags().some((t) => t.getTagName() === 'deprecated'))) {
    notes.push('[deprecated] use alternative')
  }
  if ('isAsync' in member && (member as MethodDeclaration).isAsync()) {
    const body = (member as MethodDeclaration).getBodyText() ?? ''
    if (!body.includes('await') && !body.includes('Promise.')) {
      notes.push('[async-internal-sync] async signature but sync impl')
    }
  }
  return notes
}

function extractTopLevelExports(config: ScanConfig): ApiEntry[] {
  const targetFile = config.targetFile
  const expectedClassCount = config.expectedClassCount
  const errorContext = config.expectedClassErrorContext
  const subModulesForBehavior = config.subModulesForBehavior

  // D-P0-22 §扩展 — extract imported function names for module-level behavior detection
  const importedNames = config.moduleLevelInternalBehavior ? extractImportedNames(targetFile) : []

  const project = new Project({
    compilerOptions: { experimentalDecorators: true },
    skipAddingFilesFromTsConfig: true,
  })
  const sourceFile = project.addSourceFileAtPath(targetFile)
  const entries: ApiEntry[] = []

  // 1a. class members
  const classes = sourceFile.getClasses()
  if (classes.length !== expectedClassCount) {
    throw new Error(`Expected ${expectedClassCount} class in ${errorContext}, found ${classes.length}. Topology assumption broken (D-P0-09 gate failure).`)
  }
  for (const cls of classes) {
    for (const method of cls.getMethods()) {
      const entry: ApiEntry = {
        id: '', name: method.getName(), signature: getMethodSignature(method),
        kind: 'class-method', classification: 'internal', monkeyPatched: false,
        callers: [], notes: collectClassMemberNotes(method),
        isPublicKeyword: hasModifier(method, SyntaxKind.PublicKeyword),
        isPrivateKeyword: hasModifier(method, SyntaxKind.PrivateKeyword),
      }
      // D-P0-22 internal-behavior detection (config opt-in)
      if (subModulesForBehavior && subModulesForBehavior.length > 0) {
        const behavior = detectInternalBehavior(method, subModulesForBehavior)
        if (behavior) entry.internalBehavior = behavior
      }
      entries.push(entry)
    }
    for (const prop of cls.getProperties()) {
      entries.push({
        id: '', name: prop.getName(), signature: getPropertySignature(prop),
        kind: 'class-property', classification: 'internal', monkeyPatched: false,
        callers: [], notes: collectClassMemberNotes(prop),
        isPublicKeyword: hasModifier(prop, SyntaxKind.PublicKeyword),
        isPrivateKeyword: hasModifier(prop, SyntaxKind.PrivateKeyword),
      })
    }
  }

  // 1b. module-level exports
  for (const stmt of sourceFile.getVariableStatements()) {
    if (!stmt.isExported()) continue
    for (const decl of stmt.getDeclarations()) {
      entries.push({
        id: '', name: decl.getName(), signature: decl.getText().slice(0, 200),
        kind: 'module-const', classification: 'internal', monkeyPatched: false,
        callers: [], notes: [], isPublicKeyword: false, isPrivateKeyword: false,
      })
    }
  }
  for (const fn of sourceFile.getFunctions()) {
    if (!fn.isExported() || !fn.getName()) continue
    const entry: ApiEntry = {
      id: '', name: fn.getName()!, signature: getFunctionSignature(fn),
      kind: 'module-fn', classification: 'internal', monkeyPatched: false,
      callers: [], notes: [], isPublicKeyword: false, isPrivateKeyword: false,
    }
    // D-P0-22 §扩展 — module-level internal-behavior detection
    if (config.moduleLevelInternalBehavior && importedNames.length > 0) {
      const behavior = detectModuleFunctionBehavior(fn, importedNames)
      if (behavior) entry.internalBehavior = behavior
    }
    entries.push(entry)
  }
  for (const t of sourceFile.getTypeAliases()) {
    if (!t.isExported()) continue
    entries.push({ id: '', name: t.getName(), signature: t.getText().slice(0, 200), kind: 'module-type', classification: 'internal', monkeyPatched: false, callers: [], notes: [], isPublicKeyword: false, isPrivateKeyword: false })
  }
  for (const e of sourceFile.getEnums()) {
    if (!e.isExported()) continue
    entries.push({ id: '', name: e.getName(), signature: e.getText().slice(0, 200), kind: 'module-enum', classification: 'internal', monkeyPatched: false, callers: [], notes: [], isPublicKeyword: false, isPrivateKeyword: false })
  }
  for (const i of sourceFile.getInterfaces()) {
    if (!i.isExported()) continue
    entries.push({ id: '', name: i.getName(), signature: i.getText().slice(0, 200), kind: 'module-interface', classification: 'internal', monkeyPatched: false, callers: [], notes: [], isPublicKeyword: false, isPrivateKeyword: false })
  }

  return entries
}

function collectAllQuirks(targetFile: string): QuirkHit[] {
  const content = fs.readFileSync(targetFile, 'utf-8')
  const lines = content.split('\n')
  const hits: QuirkHit[] = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!
    const match = line.match(/@quirk\s+(ch\d+\.\d+\s+#\d+(?:\s*\+\s*#\d+)?)/)
    if (match) {
      hits.push({ line: i + 1, rawText: match[1]!, fullLine: line.trim().replace(/^\*\s*/, '') })
    }
  }
  return hits
}

// =============================================================
// Stage 2 — cross-grep
// =============================================================

function hasV2Evidence(name: string): boolean {
  // D-P0-13 (i) receiver 限定(file-specific list,D-P0-20 §2)+ (ii) 文件范围限定
  const recvList = CURRENT_CONFIG?.v2ReceiverList ?? ['canvas']
  const recv = recvList.map((r) => escapeRegex(r)).join('|')
  const pattern = new RegExp(`(?:[\\w.]+\\.)?(?:${recv})\\.${escapeRegex(name)}\\b`)
  return matchAny(pattern, V2_CONTENTS)
}

function hasSatelliteEvidence(name: string): boolean {
  // D-P0-20 §3 卫星 receiver list(file-specific)
  const recvList = CURRENT_CONFIG?.satelliteReceiverList ?? ['canvas']
  const recv = recvList.map((r) => escapeRegex(r)).join('|')
  const pattern = new RegExp(`(?:[\\w.]+\\.)?(?:${recv})\\.${escapeRegex(name)}\\b`)
  return matchAny(pattern, SATELLITE_CONTENTS)
}

/**
 * D-P0-21 dual-pattern verify helper — 跑 broad pattern 看 receiver list 是否漏真命中。
 * 返回 broad hit count;调用方比较 strict count(即 hasV2Evidence 输出)。
 * if `broadCount > strictCount * 1.3` → user review 漏的 sample。
 */
function countBroadEvidenceHits(name: string, contents: Map<string, string>): number {
  // 宽 pattern:任何 `xxx.<name>` 形态(receiver 不限定)
  const pattern = new RegExp(`(?:[\\w.]+\\.)?[\\w]+\\.${escapeRegex(name)}\\b`)
  let count = 0
  for (const c of contents.values()) {
    const matches = c.match(new RegExp(pattern.source, 'g'))
    if (matches) count += matches.length
  }
  return count
}

function countStrictEvidenceHits(name: string, contents: Map<string, string>, recvList: string[]): number {
  const recv = recvList.map((r) => escapeRegex(r)).join('|')
  const pattern = new RegExp(`(?:[\\w.]+\\.)?(?:${recv})\\.${escapeRegex(name)}\\b`, 'g')
  let count = 0
  for (const c of contents.values()) {
    const matches = c.match(pattern)
    if (matches) count += matches.length
  }
  return count
}

/**
 * D-P0-20 §4 — hasExportEvidence(name)
 *
 * For core.ts: Meta2d class 是否在 index.ts 显式 export(如 `export { Meta2d } from './core'`)。
 * 不是检测 method 单独 re-export(method-level re-export 在 ES module 中罕见);
 * 实际是看"包含 Meta2d 的 file 是否在 index.ts re-export"作为 surface evidence。
 *
 * 简化:if exportCheckFiles 任一 file 内 grep `export.*<className>` → true。
 * 用于 core.ts:if Meta2d 在 index.ts 被 re-export → 全部 Meta2d class member 默认 public(除 private keyword)。
 */
let EXPORT_CHECK_CONTENTS: Map<string, string> = new Map()

function hasExportEvidence(className: string): boolean {
  if (!CURRENT_CONFIG?.useExportCheck) return false
  const pattern = new RegExp(`export\\s*(?:\\{[^}]*\\b${escapeRegex(className)}\\b[^}]*\\}|\\*\\s+from)`)
  return matchAny(pattern, EXPORT_CHECK_CONTENTS)
}

function hasCoreFacadeEvidence(name: string): boolean {
  const pattern = new RegExp(`\\b${escapeRegex(name)}\\b`)
  return matchAny(pattern, FACADE_CONTENTS)
}

function hasFacadeDelegateEvidence(name: string): boolean {
  // D-P0-12 双向确认:Meta2d 同名 method/getter/setter + this.canvas[?].name
  const escName = escapeRegex(name)
  const methodPattern = new RegExp(`^\\s*(?:public\\s+|private\\s+|protected\\s+|static\\s+|async\\s+|get\\s+|set\\s+)*${escName}\\s*[(=]`, 'm')
  const refPattern = new RegExp(`this\\.canvas\\??\\.${escName}\\b`)
  for (const c of FACADE_CONTENTS.values()) {
    if (methodPattern.test(c) && refPattern.test(c)) return true
  }
  return false
}

function hasSiblingEvidence(name: string, relativeTo: string): { hit: boolean; siblingPaths: string[] } {
  const pattern = new RegExp(`\\b${escapeRegex(name)}\\b`)
  const hits = findHitFiles(pattern, SIBLING_CONTENTS)
  const relPaths = hits.map((p) => path.relative(relativeTo, p).replace(/\\/g, '/'))
  return { hit: hits.length > 0, siblingPaths: relPaths }
}

/**
 * D-P0-26 — hasModuleLevelV2Evidence(name)
 *
 * Module-level function call detection 双 pattern 交叉验证:
 *   - P-import: 文件 import 自 importPath('@meta2d/core')
 *   - P-call: \b<name>\s*\( 限定仅在 P-import 命中的文件内
 *
 * Strict = P-import + P-call 双重命中(交叉)
 * Broad = P-call 全文件 grep(忽略 P-import filter)
 *
 * 关键:P-call 不全文件 grep,只在 P-import-positive 文件内 grep。
 *   - false positive 大幅降低(其他文件同名 function 不命中)
 *   - namespace import 覆盖(P-import 包含 import * as)
 */
function hasModuleLevelEvidence(name: string, contents: Map<string, string>, importPath: string): boolean {
  const importPattern = new RegExp(`import\\s*[{*][^}]*from\\s*['"]${escapeRegex(importPath)}`)
  const callPattern = new RegExp(`\\b${escapeRegex(name)}\\s*\\(`)
  for (const c of contents.values()) {
    if (importPattern.test(c) && callPattern.test(c)) return true
  }
  return false
}

function hasModuleLevelV2Evidence(name: string, importPath: string): boolean {
  return hasModuleLevelEvidence(name, V2_CONTENTS, importPath)
}

function hasModuleLevelSatelliteEvidence(name: string, importPath: string): boolean {
  return hasModuleLevelEvidence(name, SATELLITE_CONTENTS, importPath)
}

/**
 * D-P0-22 §扩展 — detectModuleFunctionBehavior
 *
 * Module-level function 的 internal-behavior detection。
 * Module-level function call sub-module function 的形态:
 *   `return otherImportedFn(...)` (pure-delegate)
 *   `... otherImportedFn(...) ... 其他逻辑 ...` (mixed-delegate)
 *   无 sub-module call (non-delegate)
 *
 * 简化:接受 imported function names list(从 file 顶部 imports 自动提取),
 * 检测 body 是否调用任意 imported name。
 */
function detectModuleFunctionBehavior(fn: FunctionDeclaration, importedNames: string[]): InternalBehavior | undefined {
  if (importedNames.length === 0) return undefined
  const body = fn.getBodyText()
  if (!body) return undefined

  // Build regex 检测 body 中调用任何 importedName 形态
  const namesPart = importedNames.map((n) => escapeRegex(n)).join('|')
  const callPattern = new RegExp(`\\b(?:${namesPart})\\s*\\(`, 'g')

  const matches = body.match(callPattern)
  if (!matches || matches.length === 0) return 'non-delegate'

  // Heuristic: body 短(< 80 chars trimmed)+ 单一 delegate call → pure-delegate
  const trimmed = body.trim()
  const lineCount = trimmed.split('\n').filter((l) => l.trim().length > 0).length
  if (lineCount <= 2 && matches.length === 1) {
    return 'pure-delegate'
  }
  return 'mixed-delegate'
}

function extractImportedNames(targetFile: string): string[] {
  const project = new Project({ skipAddingFilesFromTsConfig: true })
  const sourceFile = project.addSourceFileAtPath(targetFile)
  const names: string[] = []
  for (const imp of sourceFile.getImportDeclarations()) {
    for (const ni of imp.getNamedImports()) {
      names.push(ni.getName())
    }
  }
  return names
}

function findV2MonkeyPatchAssignments(): string[] {
  const pattern = /canvas\.(\w+)\s*=\s*(?:async\s+)?(?:function\s*)?\(/g
  const names = new Set<string>()
  let m: RegExpExecArray | null
  while ((m = pattern.exec(INSTALL_UX_PATCHES_CONTENT)) !== null) {
    names.add(m[1]!)
  }
  return Array.from(names)
}

// =============================================================
// Stage 3 — classify
// =============================================================

function classifyClassMember(
  externalEvidence: { v2: boolean; satellite: boolean; facadeRaw: boolean; facadeDelegate: boolean; exportCheck: boolean },
  isPublicKeyword: boolean,
  isPrivateKeyword: boolean,
): Classification {
  if (isPrivateKeyword) return 'internal'
  if (isPublicKeyword) return 'public'
  // D-P0-14 facade-only 单独可作 public 证据(canvas)
  if (externalEvidence.facadeDelegate) return 'public'
  // D-P0-25 option 3 双维度独立判定:
  //   - exportCheck + V2/卫星 命中 → public(双向显式契约)
  //   - exportCheck + V2/卫星 0 命中 → forgotten-public(暴露但无消费 = 死代码)
  //   - !exportCheck + V2/卫星 命中 → public-ish(隐性契约)
  const hasExternalUse = externalEvidence.v2 || externalEvidence.satellite || externalEvidence.facadeRaw
  if (externalEvidence.exportCheck) {
    return hasExternalUse ? 'public' : 'forgotten-public'
  }
  if (hasExternalUse) return 'public-ish'
  return 'internal'
}

function classifyModuleExport(
  externalEvidence: { v2: boolean; satellite: boolean; facadeRaw: boolean; facadeDelegate: boolean; exportCheck: boolean },
  sibling: { hit: boolean; siblingPaths: string[] },
): { cls: 'public-ish' | 'appendix' | 'forgotten-public' | 'skip'; siblingPaths?: string[] } {
  // D-P0-25 §扩展 module-level forgotten-export 平行 class-level forgotten-public
  if (externalEvidence.facadeDelegate || externalEvidence.exportCheck) return { cls: 'public-ish' }
  if (externalEvidence.v2 || externalEvidence.satellite || externalEvidence.facadeRaw) return { cls: 'public-ish' }
  if (sibling.hit) return { cls: 'appendix', siblingPaths: sibling.siblingPaths }
  // module-level export + V2/卫星/facade/sibling 全 0 → forgotten-export(进 11c 主表格,不 skip)
  // 用 'forgotten-public' classification 复用(语义平行;markdown render 共表格)
  return { cls: 'forgotten-public' }
}

/**
 * D-P0-22 detectInternalBehavior — 解析 method body,识别 sub-module delegate 调用形态。
 *
 *   pure-delegate:body trimmed 单一 statement,形如 `return this.<sub>.<method>(...)`
 *                  或 `this.<sub>.<method>(...)` (no `;` 之外的 token)
 *   mixed-delegate:body 包含 `this.<sub>.<X>` 但还有其他逻辑(>3 统计 lines / if / loop / set state)
 *   non-delegate:body 完全无 `this.<sub>.<X>`(对任意 sub in subModulesForBehavior)
 */
function detectInternalBehavior(method: MethodDeclaration, subModules: string[]): InternalBehavior | undefined {
  if (subModules.length === 0) return undefined
  const body = method.getBodyText()
  if (!body) return undefined

  // Build regex 检测 this.<subModule>.<method>(...)
  const subRecv = subModules.map((s) => escapeRegex(s)).join('|')
  const delegatePattern = new RegExp(`this\\.(?:${subRecv})(?:\\??\\.\\w+)+\\s*\\(`, 'g')

  const matches = body.match(delegatePattern)
  if (!matches || matches.length === 0) return 'non-delegate'

  // Heuristic: method body 短(< 80 chars trimmed)+ 单一 delegate call → pure-delegate
  const trimmed = body.trim()
  const lineCount = trimmed.split('\n').filter((l) => l.trim().length > 0).length
  if (lineCount <= 2 && matches.length === 1) {
    return 'pure-delegate'
  }
  return 'mixed-delegate'
}

function applyMonkeyPatchAndHookNotes(entry: ApiEntry, v2PatchedNames: Set<string>, inventory: Record<string, InventoryEntry>): void {
  if (!v2PatchedNames.has(entry.name)) return
  const inv = inventory[entry.name]
  if (!inv) {
    throw new Error(
      `[D-P0-11 §a] InventoryMismatch: V2 monkey-patches canvas.${entry.name} but inventory has no entry. ` +
      `Halt and ping user.`
    )
  }
  if (inv.form === 'wrap-pattern') {
    entry.monkeyPatched = true
  } else if (inv.form === 'hook-field') {
    entry.monkeyPatched = false
    entry.notes.push(`[hook-util] ${entry.name}: see installUxPatches.ts:${inv.installLineHint}`)
  }
}

// =============================================================
// Stage 5 — D-P0-11 §a inventory cross-validation
// =============================================================

function validateInventoryCrossCheck(v2PatchedNames: string[], inventory: Record<string, InventoryEntry>): void {
  const inventoryNames = new Set(Object.keys(inventory))
  const grepNames = new Set(v2PatchedNames)
  const missingFromInventory = [...grepNames].filter((n) => !inventoryNames.has(n))
  const missingFromGrep = [...inventoryNames].filter((n) => !grepNames.has(n))
  if (missingFromInventory.length > 0 || missingFromGrep.length > 0) {
    const msg = [
      '[D-P0-11 §a] Inventory cross-validation FAILED',
      `  Inventory entries: ${inventoryNames.size}, V2 grep hits: ${grepNames.size}`,
      missingFromInventory.length > 0 ? `  In V2 grep but not in inventory: ${missingFromInventory.join(', ')}` : '',
      missingFromGrep.length > 0 ? `  In inventory but not in V2 grep: ${missingFromGrep.join(', ')}` : '',
      'Halt + ping user.',
    ].filter(Boolean).join('\n')
    throw new Error(msg)
  }
}

// =============================================================
// Stage 4 — render markdown
// =============================================================

function renderMarkdown(entries: ApiEntry[], config: ScanConfig): string {
  // D-P0-25 4 类都进主表格(public / forgotten-public / public-ish);只 internal 进 skip
  const mainEntries = entries.filter((e) => e.classification === 'public' || e.classification === 'public-ish' || e.classification === 'forgotten-public')
  const appendixEntries = entries.filter((e) => e.classification === 'appendix')

  let cId = 1, mxId = 1
  for (const e of mainEntries) e.id = `C${String(cId++).padStart(3, '0')}`
  for (const e of appendixEntries) e.id = `MX${String(mxId++).padStart(3, '0')}`

  let md = `# ${config.markdownTitle}\n\n`
  md += `> Source: ${config.markdownSourceLine}\n`
  md += `> Generated by: \`docs/refactor-public-api/11-scan-scripts/scan-api.ts\`(via \`${config.outputBasename.replace('-apis', '')}.config.ts\`)\n`
  md += `> Generated at: ${new Date().toISOString()}\n`
  md += `> SoT: \`${config.outputBasename}-enriched.json\`. **Markdown is derived; edit JSON or rerun script** (D-P0-06).\n\n`
  md += `> **调用方列粒度** (D-P0-12):Δ1 阶段仅填类别(V2 / 卫星 / facade-delegate / sibling),不填具体调用点。Δ3 完成 11d/11e 后,可选回填具体调用点(由 user 决定)。\n\n`
  md += `> **签名列(D-P0-12)**:全扫由 ts-morph 提取完整签名(完整类型 + 全部参数),与工单 §4.1 示例一致。\n\n`

  // D-P0-22 — 11b 主表格自适应:if any entry has internalBehavior 加列
  const hasInternalBehavior = mainEntries.some((e) => e.internalBehavior !== undefined)

  md += '## 主表格(class members + module-level exports with external evidence)\n\n'
  if (hasInternalBehavior) {
    md += '| # | 名称 | 签名 | 分类 | internal-behavior | monkey-patched | 调用方 | 备注 |\n'
    md += '|---|------|------|------|------------------|---------------|--------|------|\n'
    for (const e of mainEntries) {
      md += `| ${e.id} | ${e.name} | \`${e.signature}\` | ${e.classification} | ${e.internalBehavior ?? '-'} | ${e.monkeyPatched ? 'yes' : 'no'} | ${e.callers.join(' / ')} | ${e.notes.join('; ')} |\n`
    }
  } else {
    md += '| # | 名称 | 签名 | 分类 | monkey-patched | 调用方 | 备注 |\n'
    md += '|---|------|------|------|---------------|--------|------|\n'
    for (const e of mainEntries) {
      md += `| ${e.id} | ${e.name} | \`${e.signature}\` | ${e.classification} | ${e.monkeyPatched ? 'yes' : 'no'} | ${e.callers.join(' / ')} | ${e.notes.join('; ')} |\n`
    }
  }

  md += '\n## Module-level cross-module dependencies (non-public-ish)\n\n'
  md += '> 不构成 public-ish(无外部消费证据,D-P0-08 语义不变),但 P4 拆解时\n'
  md += '> 是 meta2d 包内 sibling module 的依赖,要保留。\n\n'
  md += '| # | 名称 | 类型 | 跨模块消费方 |\n'
  md += '|---|------|------|-------------|\n'
  for (const e of appendixEntries) {
    md += `| ${e.id} | ${e.name} | ${e.kind.replace('module-', '')} | ${(e.siblingPaths ?? []).join(', ')} |\n`
  }

  // valuable discoveries(per-config generator)
  if (config.valuableDiscoveriesGenerator) {
    const ctx: ValuableDiscoveriesContext = {
      entries,
      mainTotal: mainEntries.length,
      publicCount: mainEntries.filter((e) => e.classification === 'public').length,
      publicIshCount: mainEntries.filter((e) => e.classification === 'public-ish').length,
      facadeDelegateCount: mainEntries.filter((e) => e.callers.includes('facade-delegate')).length,
      monkeyPatchedCount: mainEntries.filter((e) => e.monkeyPatched).length,
      hookUtilCount: mainEntries.filter((e) => e.notes.some((n) => n.startsWith('[hook-util]'))).length,
      internalCount: entries.filter((e) => e.classification === 'internal').length,
      appendixCount: appendixEntries.length,
    }
    md += '\n' + config.valuableDiscoveriesGenerator(ctx)
  }

  md += '\n## Surface 映射预判(Δ5 已填,2026-05-02)\n'
  md += '> 详细 6 类差集分析(method + implicit 维度,A / A\' / B / B\' / C / D 类目)见 [11g-surface-mapping-report.md](./11g-surface-mapping-report.md)\n\n'
  md += '> 6 类总分布(method 144 + implicit ~73 = ~217 总):A ~50(24%)/ A\' ~64(31%)/ B ~15(7%)/ B\' ~21(10%)/ C 3(1%)/ D ~64(31%)\n\n'
  md += '> **P1 spike 启动条件 ready**:第一周末必修订 7 项 B\'(markDirty / DOM accessor / store accessor / clearCanvas / mouse events / undo-redo accessor / copy-cut-paste events)+ B 大头 Reactive 三层 PoC(2-3 周)\n'

  return md
}

// =============================================================
// Main entry — runScan
// =============================================================

export function runScan(config: ScanConfig): void {
  CURRENT_CONFIG = config
  const t0 = Date.now()

  // Stage 0 — pre-load
  console.log('Stage 0: pre-loading file contents...')
  const v2Files = walkDir(config.v2EvidenceRoot, (p) => {
    if (!p.endsWith('.ts')) return false
    if (config.v2EvidenceExcludeSubdirs?.some((sub) => p.includes(`${path.sep}${sub}${path.sep}`))) return false
    return true
  })
  V2_CONTENTS = loadFiles(v2Files)
  console.log(`  V2 evidence: ${V2_CONTENTS.size} files`)

  const satFiles: string[] = []
  for (const root of config.satelliteRoots) {
    satFiles.push(...walkDir(root, (p) => p.endsWith('.ts')))
  }
  SATELLITE_CONTENTS = loadFiles(satFiles)
  console.log(`  Satellites: ${SATELLITE_CONTENTS.size} files`)

  FACADE_CONTENTS = loadFiles(config.facadeFiles.filter((p) => fs.existsSync(p)))
  console.log(`  Facade: ${FACADE_CONTENTS.size} files`)

  const sibFiles = walkDir(config.siblingRoot, config.siblingFileFilter)
  SIBLING_CONTENTS = loadFiles(sibFiles)
  console.log(`  Sibling: ${SIBLING_CONTENTS.size} files`)

  if (config.monkeyPatchSourceFile && fs.existsSync(config.monkeyPatchSourceFile)) {
    INSTALL_UX_PATCHES_CONTENT = fs.readFileSync(config.monkeyPatchSourceFile, 'utf-8')
  } else {
    INSTALL_UX_PATCHES_CONTENT = ''
  }
  console.log(`  pre-load complete (${Date.now() - t0}ms)`)

  // export check files pre-load (D-P0-20 §4)
  if (config.useExportCheck && config.exportCheckFiles?.length) {
    EXPORT_CHECK_CONTENTS = loadFiles(config.exportCheckFiles.filter((p) => fs.existsSync(p)))
    console.log(`  Export check: ${EXPORT_CHECK_CONTENTS.size} files`)
  } else {
    EXPORT_CHECK_CONTENTS = new Map()
  }

  // Stage 1 — extract
  console.log('Stage 1: ts-morph extract...')
  const entries = extractTopLevelExports(config)
  console.log(`  ${entries.length} entries extracted`)
  if (config.subModulesForBehavior?.length) {
    const pure = entries.filter((e) => e.internalBehavior === 'pure-delegate').length
    const mixed = entries.filter((e) => e.internalBehavior === 'mixed-delegate').length
    const nonDel = entries.filter((e) => e.internalBehavior === 'non-delegate').length
    console.log(`  D-P0-22 internal-behavior: pure ${pure} / mixed ${mixed} / non ${nonDel}`)
  }

  // file-wide quirks
  const fileWideQuirks = collectAllQuirks(config.targetFile)
  console.log(`  file-wide @quirk hits: ${fileWideQuirks.length}`)
  for (const q of fileWideQuirks) {
    let attachedName: string | undefined
    const fileLines = fs.readFileSync(config.targetFile, 'utf-8').split('\n')
    for (let probeLine = q.line; probeLine < Math.min(q.line + 50, fileLines.length); probeLine++) {
      const probe = fileLines[probeLine]
      if (!probe) continue
      const methodMatch = probe.match(/^\s*(?:public\s+|private\s+|protected\s+|static\s+|async\s+|get\s+|set\s+)*(\w+)\s*[(=]/)
      if (methodMatch) { attachedName = methodMatch[1]!; break }
    }
    q.attachedToMethod = attachedName
    if (attachedName) {
      const entry = entries.find((e) => e.name === attachedName)
      if (entry && !entry.notes.some((n) => n.includes(q.rawText))) {
        entry.notes.push(`[quirk] ${q.rawText}`)
      }
    }
  }

  fs.writeFileSync(path.join(config.outputJsonDir, `${config.outputBasename}.json`), JSON.stringify(entries, null, 2))
  fs.writeFileSync(path.join(config.outputJsonDir, `${config.outputBasename.replace('-apis', '')}-quirks-fileWide.json`), JSON.stringify(fileWideQuirks, null, 2))

  // Stage 2 + 3
  console.log('Stage 2 + 3: cross-grep + classify...')
  const inventory = config.monkeyPatchInventory ?? {}
  const v2PatchedNames = (config.monkeyPatchSourceFile && Object.keys(inventory).length > 0) ? findV2MonkeyPatchAssignments() : []
  const v2PatchedSet = new Set(v2PatchedNames)

  // D-P0-20 §4 — exportCheck className resolution (only if useExportCheck)
  let exportCheckHit = false
  if (config.useExportCheck && config.exportCheckFiles?.length) {
    // For class export, check className from class entries (typically only 1 in core.ts: Meta2d)
    // Simplification: any class hit triggers exportCheck=true for ALL class members
    // (refines per-method later if needed)
    for (const e of entries) {
      if (e.kind === 'class-method' || e.kind === 'class-property') {
        // We need the className, which is the parent class. In ts-morph extract loop above,
        // we have only entry.name (the method/prop name). Class export check should use class name.
        // Simplification: use config.expectedClassErrorContext as className proxy(or pass explicitly)
        // For now: check if Meta2d (or any expected class) is exported in exportCheckFiles
        break
      }
    }
    // Generic check: any class name from the target file appears in exportCheckFiles
    // Simplification: assume class export = true if EXPORT_CHECK_CONTENTS has any export statement
    // (more precise: extract class name from target file via ts-morph and check)
    // For Δ2.2 minimal: if exportCheckFiles non-empty, set exportCheckHit globally based on first class export pattern hit
    exportCheckHit = matchAny(/export\s*(?:\{|\*\s+from)/, EXPORT_CHECK_CONTENTS)
  }

  for (const e of entries) {
    // D-P0-26 — module-level entries 用 module-level evidence helpers(if config 启用)
    const useModuleLevel = e.kind.startsWith('module-') && !!config.moduleLevelImportPath
    const externalEvidence = {
      v2: useModuleLevel
        ? hasModuleLevelV2Evidence(e.name, config.moduleLevelImportPath!)
        : hasV2Evidence(e.name),
      satellite: useModuleLevel
        ? hasModuleLevelSatelliteEvidence(e.name, config.moduleLevelImportPath!)
        : hasSatelliteEvidence(e.name),
      facadeRaw: hasCoreFacadeEvidence(e.name),
      facadeDelegate: hasFacadeDelegateEvidence(e.name),
      // D-P0-20 §4 — exportCheck only applies to class members (whole class re-exported)
      exportCheck: (e.kind === 'class-method' || e.kind === 'class-property') && exportCheckHit,
    }
    if (externalEvidence.v2) e.callers.push('V2')
    if (externalEvidence.satellite) e.callers.push('卫星')
    if (externalEvidence.facadeDelegate) e.callers.push('facade-delegate')
    else if (externalEvidence.facadeRaw) e.callers.push('meta2d 顶层(非 delegate)')
    if (externalEvidence.exportCheck) e.callers.push('export-check')

    if (e.kind.startsWith('class-')) {
      e.classification = classifyClassMember(externalEvidence, e.isPublicKeyword, e.isPrivateKeyword)
    } else {
      const sibling = hasSiblingEvidence(e.name, config.siblingPathRelativeTo)
      const cls = classifyModuleExport(externalEvidence, sibling)
      e.classification = cls.cls
      if (cls.siblingPaths) e.siblingPaths = cls.siblingPaths
      if (sibling.hit) e.callers.push(`sibling: ${sibling.siblingPaths.length}`)
    }

    if (Object.keys(inventory).length > 0) {
      applyMonkeyPatchAndHookNotes(e, v2PatchedSet, inventory)
    }
  }

  // Stage 5 — cross-validation
  if (Object.keys(inventory).length > 0) {
    console.log('Stage 5: D-P0-11 §a inventory cross-validation...')
    validateInventoryCrossCheck(v2PatchedNames, inventory)
    console.log('  cross-validation passed.')
  } else {
    console.log('Stage 5: skipped (no monkey-patch inventory in config)')
  }

  fs.writeFileSync(path.join(config.outputJsonDir, `${config.outputBasename}-enriched.json`), JSON.stringify(entries, null, 2))

  // Stage 4 — render
  console.log('Stage 4: render markdown...')
  const md = renderMarkdown(entries, config)
  fs.writeFileSync(config.markdownOutputPath, md)

  console.log('Done.')
  const mainTotal = entries.filter((e) => e.classification === 'public' || e.classification === 'forgotten-public' || e.classification === 'public-ish').length
  const pubCount = entries.filter((e) => e.classification === 'public').length
  const forgottenCount = entries.filter((e) => e.classification === 'forgotten-public').length
  const pubIshCount = entries.filter((e) => e.classification === 'public-ish').length
  console.log(`  Main table: ${mainTotal} entries(public ${pubCount} / forgotten-public ${forgottenCount} / public-ish ${pubIshCount})`)
  console.log(`  Appendix:   ${entries.filter((e) => e.classification === 'appendix').length} entries`)
  console.log(`  Skipped:    ${entries.filter((e) => e.classification === 'internal' || e.classification === 'skip').length} entries`)
}
