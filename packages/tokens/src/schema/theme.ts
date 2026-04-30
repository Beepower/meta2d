/**
 * Tier 3: Theme — concrete instantiation, the rendering of design.
 *
 * 设计契约:
 * - theme 是 palette + semantic 的具体实例
 * - 每个 theme 有 id (kebab-case) + name (人类可读) + meta (作者、版本)
 * - theme 之间可以继承(extends),减少重复
 */

import type { Palette } from './palette'
import type { SemanticTokens } from './semantic'

/**
 * Theme metadata
 */
export interface ThemeMeta {
  readonly version: string                   // semver
  readonly author?: string
  readonly description?: string
  readonly wcag?: 'AA' | 'AAA' | 'none'      // 对比度合规等级
  readonly recommendedUsage?: readonly string[]  // 'editor' / 'monitoring' / 'showcase'
}

/**
 * 完整 Theme 定义
 */
export interface Theme {
  readonly id: string                        // 'light' / 'dark' / 'beepower-ops-gray'
  readonly name: string                      // 'Light' / '深色' / 'BeePower Operations'
  readonly meta: ThemeMeta
  readonly palette: Palette
  readonly semantic: SemanticTokens
  /**
   * 继承的 theme id,允许 partial override
   * resolver 会先解析父 theme,再 deep-merge override
   */
  readonly extends?: string
}

/**
 * Deep partial type - 允许嵌套对象的部分 override
 */
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object
    ? T[K] extends readonly unknown[]
      ? T[K]
      : DeepPartial<T[K]>
    : T[K]
}

/**
 * Partial theme - 用于业务方扩展
 *
 * V2 注册业务变体时只需提供 partial,resolver 会与基础主题合并
 */
export interface PartialTheme {
  readonly id: string
  readonly name: string
  readonly meta: ThemeMeta
  readonly extends: string                   // 必须指定 base
  readonly palette?: DeepPartial<Palette>
  readonly semantic?: DeepPartial<SemanticTokens>
}
