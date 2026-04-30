/**
 * Token → CSS 变量字符串
 *
 * 命名规约:
 *   --m2d-{section}-{path}
 *   例:--m2d-text-primary / --m2d-entity-stroke
 *
 * 设计选择:
 * - 用前缀 m2d 防止与 V2 全局 CSS 变量冲突
 * - section / path 全部 kebab-case(camelCase 转换)
 * - 数字、颜色、字符串都输出为 string
 */

import type { ResolvedTheme } from '../resolver/resolver'

export interface CssVarOptions {
  /** 前缀,默认 'm2d' */
  prefix?: string
  /** 是否包含 :root 选择器,默认 true */
  withRootSelector?: boolean
  /** 包含哪些 section(默认全部 semantic) */
  sections?: readonly string[]
}

/**
 * 输出:
 *   :root[data-theme="light"] {
 *     --m2d-background-canvas: #FCFCFC;
 *     --m2d-text-primary: #171717;
 *     ...
 *   }
 */
export function themeToCssVars(
  theme: ResolvedTheme,
  options: CssVarOptions = {}
): string {
  const prefix = options.prefix ?? 'm2d'
  const withRoot = options.withRootSelector ?? true
  const sections = options.sections

  const lines: string[] = []
  flattenObject(theme.semantic, '').forEach(([path, value]) => {
    // section 过滤
    if (sections) {
      const root = path.split('.')[0]
      if (root === undefined || !sections.includes(root)) return
    }
    const cssName = `--${prefix}-${pathToCssName(path)}`
    const cssValue = valueToCssString(value)
    lines.push(`  ${cssName}: ${cssValue};`)
  })

  if (withRoot) {
    return `:root[data-theme="${theme.id}"] {\n${lines.join('\n')}\n}`
  }
  return lines.join('\n')
}

/**
 * 把对象扁平化为 [path, value] 数组
 *   { text: { primary: '#000' } } → [['text.primary', '#000']]
 */
function flattenObject(obj: unknown, prefix: string): Array<[string, unknown]> {
  const result: Array<[string, unknown]> = []
  if (typeof obj !== 'object' || obj === null) {
    if (prefix !== '') result.push([prefix, obj])
    return result
  }
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix === '' ? k : `${prefix}.${k}`
    if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
      result.push(...flattenObject(v, path))
    } else {
      result.push([path, v])
    }
  }
  return result
}

/**
 * camelCase + dot path → kebab-case
 *   'text.fontFamily' → 'text-font-family'
 *   'effect.glowStrong.blur' → 'effect-glow-strong-blur'
 */
function pathToCssName(path: string): string {
  return path
    .replace(/\./g, '-')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
}

function valueToCssString(value: unknown): string {
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  if (typeof value === 'boolean') return String(value)
  if (Array.isArray(value)) return value.map(valueToCssString).join(', ')
  return String(value)
}
