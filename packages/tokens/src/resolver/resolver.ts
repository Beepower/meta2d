/**
 * Token Resolver - 三层 token 求值引擎
 *
 * 职责:
 * 1. 处理 theme.extends 继承(深度合并 partial → full theme)
 * 2. 解析 { $ref: 'palette.path' } 引用(查 palette 取值)
 * 3. 输出 fully-resolved 主题(无 $ref,可直接渲染)
 */

import type { Theme, PartialTheme } from '../schema/theme'
import type { Palette } from '../schema/palette'
import type { SemanticTokens, TokenRef } from '../schema/semantic'
import { deepMerge } from './deep-merge'

export interface ResolverContext {
  /** 已知的 base themes(用于 extends 解析) */
  readonly knownThemes: Record<string, Theme>
}

/**
 * 解析 partial theme,合并 base + override,返回完整 theme
 */
export function resolveTheme(
  partial: PartialTheme,
  knownThemes: Record<string, Theme>
): Theme {
  const base = knownThemes[partial.extends]
  if (!base) {
    throw new Error(
      `[meta2d/tokens] resolveTheme: base theme '${partial.extends}' not found. ` +
      `Available: ${Object.keys(knownThemes).join(', ')}`
    )
  }

  return {
    id: partial.id,
    name: partial.name,
    meta: { ...base.meta, ...partial.meta },
    palette: deepMerge(base.palette, partial.palette ?? {}) as Palette,
    semantic: deepMerge(base.semantic, partial.semantic ?? {}) as SemanticTokens,
    extends: partial.extends
  }
}

/**
 * 类型守卫:判断值是否为 TokenRef
 */
export function isTokenRef(v: unknown): v is TokenRef {
  return typeof v === 'object'
    && v !== null
    && '$ref' in v
    && typeof (v as { $ref: unknown }).$ref === 'string'
}

/**
 * 求值一个 token 值(literal 或 $ref)
 */
export function resolveTokenValue<T>(
  value: T | TokenRef,
  palette: Palette
): T {
  if (isTokenRef(value)) {
    return resolveByPath(palette, value.$ref) as T
  }
  // 嵌套对象(如 effect 结构)— 递归解析子字段
  if (typeof value === 'object' && value !== null) {
    if (Array.isArray(value)) {
      return value.map(v => resolveTokenValue(v, palette)) as T
    }
    const resolved: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value)) {
      resolved[k] = resolveTokenValue(v, palette)
    }
    return resolved as T
  }
  return value
}

/**
 * 按路径取值('colors.gray.5' → palette.colors.gray[5])
 *
 * 注意:数字 key 也要支持('colors.gray.5' 中的 5 是数字索引)
 */
function resolveByPath(palette: Palette, path: string): unknown {
  const parts = path.split('.')
  let current: unknown = palette
  for (const part of parts) {
    if (current === null || current === undefined) {
      throw new Error(`[meta2d/tokens] $ref path '${path}' broke at '${part}'`)
    }
    if (typeof current === 'object') {
      current = (current as Record<string, unknown>)[part]
    } else {
      throw new Error(`[meta2d/tokens] $ref path '${path}' hit non-object at '${part}'`)
    }
  }
  if (current === undefined) {
    throw new Error(`[meta2d/tokens] $ref path '${path}' resolved to undefined`)
  }
  return current
}

/**
 * Resolved theme - 所有 $ref 已展开为字面值
 */
export interface ResolvedTheme {
  readonly id: string
  readonly name: string
  readonly palette: Palette
  readonly semantic: ResolvedSemantic
}

/**
 * 解析后的 semantic 层 — 与 SemanticTokens 同形状但所有 $ref 展开
 */
export type ResolvedSemantic = {
  readonly [K: string]: unknown
}

/**
 * 把整个 theme 的 semantic 层全部解析(去除所有 $ref)
 * 输出 ResolvedTheme,所有字段都是字面值,可直接给渲染层
 */
export function fullyResolveTheme(theme: Theme): ResolvedTheme {
  return {
    id: theme.id,
    name: theme.name,
    palette: theme.palette,
    semantic: resolveTokenValue(theme.semantic, theme.palette) as unknown as ResolvedSemantic
  }
}
