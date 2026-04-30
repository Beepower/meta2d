/**
 * 类型化路径工具 — 防 KD-011 §B 死法 2(magic string)
 *
 * 用法:
 *   const path: SemanticPath = 'text.primary'  // ✅ 编译时校验
 *   const path: SemanticPath = 'text.foo'      // ❌ 编译错误
 *
 * resolver.resolve(theme, path) 类型安全
 */

import type { SemanticPath } from './semantic'
import type { PalettePath } from './palette'

export type AnyTokenPath = SemanticPath | PalettePath

const SEMANTIC_ROOTS = [
  'background', 'surface', 'border', 'text', 'status',
  'interaction', 'entity', 'strokeWidth', 'typography', 'effect'
] as const

const PALETTE_ROOTS = [
  'colors', 'fontFamilies', 'fontSizes', 'fontWeights',
  'spacing', 'radii', 'strokeWidths', 'opacities',
  'durations', 'easings', 'lineHeights'
] as const

/**
 * 类型守卫:判断是否为 semantic 路径
 */
export function isSemanticPath(path: string): path is SemanticPath {
  const root = path.split('.')[0]
  return root !== undefined && (SEMANTIC_ROOTS as readonly string[]).includes(root)
}

/**
 * 类型守卫:判断是否为 palette 路径
 */
export function isPalettePath(path: string): path is PalettePath {
  const root = path.split('.')[0]
  return root !== undefined && (PALETTE_ROOTS as readonly string[]).includes(root)
}
