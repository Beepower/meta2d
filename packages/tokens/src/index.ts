/**
 * @meta2d/tokens — Public API
 *
 * 设计原则:
 * - Schema types 优先导出(给业务方扩展用)
 * - Themes 独立子路径导出(./themes/light 等)
 * - Resolver / CSS 工具按需 import(不污染默认 bundle)
 */

// ─── Schema(类型,业务扩展用)──────────────────────────────
export type {
  Palette,
  ColorScale,
  ScalarTokens,
  PalettePath,
  PaletteColorPath,
  PaletteScalarPath
} from './schema/palette'

export type {
  SemanticTokens,
  SemanticPath,
  TokenRef,
  ColorValue,
  NumericValue,
  StringValue,
  BackgroundTokens,
  SurfaceTokens,
  BorderTokens,
  TextTokens,
  StatusTokens,
  InteractionTokens,
  EntityTokens,
  EffectTokens,
  TypographyToken,
  TypographyTokens,
  StrokeWidthTokens
} from './schema/semantic'

export type {
  Theme,
  PartialTheme,
  ThemeMeta,
  DeepPartial
} from './schema/theme'

export {
  isSemanticPath,
  isPalettePath
} from './schema/token-paths'

export type {
  AnyTokenPath
} from './schema/token-paths'

// ─── Themes(中性主题)────────────────────────────────────
export { lightTheme } from './themes/light'
export { darkTheme } from './themes/dark'
export { highContrastTheme } from './themes/high-contrast'
export { neutralTheme } from './themes/neutral'

// ─── Resolver(三层求值)──────────────────────────────────
export {
  resolveTheme,
  resolveTokenValue,
  fullyResolveTheme,
  isTokenRef,
  deepMerge
} from './resolver'

export type {
  ResolverContext,
  ResolvedTheme,
  ResolvedSemantic
} from './resolver'

// ─── CSS(运行时)────────────────────────────────────────
export {
  themeToCssVars,
  applyThemeToDom,
  removeAppliedTheme
} from './css'

export type {
  CssVarOptions,
  ApplyOptions
} from './css'

// ─── 校验(可选)────────────────────────────────────────
export {
  validateTheme,
  contrastRatio,
  meetsWcag
} from './validate'

export type {
  ValidationIssue,
  ValidationReport
} from './validate'
