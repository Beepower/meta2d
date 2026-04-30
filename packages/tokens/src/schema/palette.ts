/**
 * Tier 1: Palette — raw values, the alphabet of design.
 *
 * 设计契约:
 * - palette 是"原始素材",不直接被 V2 业务代码使用
 * - palette 的色阶遵循 1-12 数值规约(Radix UI scale 风格)
 * - 业务方可以扩展 palette,但不该修改默认 palette 的语义
 */

/**
 * 色阶定义 - 12 step 灰阶
 * 设计参考:Radix UI scale
 *   1-2:  app background / subtle background
 *   3-5:  ui element background (idle / hover / active)
 *   6-8:  borders (subtle / element / hovered)
 *   9-10: solid (主色 / hover)
 *   11-12: text (low contrast / high contrast)
 */
export interface ColorScale {
  readonly 1: string
  readonly 2: string
  readonly 3: string
  readonly 4: string
  readonly 5: string
  readonly 6: string
  readonly 7: string
  readonly 8: string
  readonly 9: string
  readonly 10: string
  readonly 11: string
  readonly 12: string
}

/**
 * 单值 token — 数字、字符串、其他原子值
 */
export interface ScalarTokens {
  readonly fontFamilies: {
    readonly sans: string
    readonly serif: string
    readonly mono: string
    readonly numeric: string  // 等宽数字字体(用于数据显示)
  }
  readonly fontSizes: {
    readonly xs: number
    readonly sm: number
    readonly md: number
    readonly lg: number
    readonly xl: number
    readonly '2xl': number
    readonly '3xl': number
    readonly '4xl': number
  }
  readonly fontWeights: {
    readonly regular: number
    readonly medium: number
    readonly semibold: number
    readonly bold: number
  }
  readonly lineHeights: {
    readonly tight: number
    readonly normal: number
    readonly relaxed: number
  }
  readonly spacing: {
    readonly '0': number
    readonly '1': number
    readonly '2': number
    readonly '3': number
    readonly '4': number
    readonly '6': number
    readonly '8': number
    readonly '12': number
    readonly '16': number
  }
  readonly radii: {
    readonly none: number
    readonly sm: number
    readonly md: number
    readonly lg: number
    readonly full: number
  }
  readonly strokeWidths: {
    readonly hairline: number  // 0.5
    readonly thin: number      // 1
    readonly medium: number    // 2
    readonly thick: number     // 3
    readonly bold: number      // 4
  }
  readonly opacities: {
    readonly transparent: number  // 0
    readonly subtle: number       // 0.04
    readonly low: number          // 0.16
    readonly medium: number       // 0.4
    readonly high: number         // 0.72
    readonly opaque: number       // 1
  }
  readonly durations: {
    readonly instant: number   // 0
    readonly fast: number      // 100
    readonly normal: number    // 200
    readonly slow: number      // 400
    readonly slower: number    // 800
  }
  readonly easings: {
    readonly linear: string
    readonly easeIn: string
    readonly easeOut: string
    readonly easeInOut: string
    readonly spring: string    // cubic-bezier 弹性
  }
}

export interface Palette extends ScalarTokens {
  readonly colors: {
    readonly gray: ColorScale
    readonly blue: ColorScale
    readonly green: ColorScale
    readonly yellow: ColorScale
    readonly orange: ColorScale
    readonly red: ColorScale
    readonly purple: ColorScale
  }
}

/**
 * 类型安全:严格的 palette 字段路径
 * 业务代码引用 token 时编译时校验
 */
export type PaletteColorPath =
  | `colors.gray.${keyof ColorScale & (number | `${number}`)}`
  | `colors.blue.${keyof ColorScale & (number | `${number}`)}`
  | `colors.green.${keyof ColorScale & (number | `${number}`)}`
  | `colors.yellow.${keyof ColorScale & (number | `${number}`)}`
  | `colors.orange.${keyof ColorScale & (number | `${number}`)}`
  | `colors.red.${keyof ColorScale & (number | `${number}`)}`
  | `colors.purple.${keyof ColorScale & (number | `${number}`)}`

export type PaletteScalarPath =
  | `fontFamilies.${keyof ScalarTokens['fontFamilies']}`
  | `fontSizes.${keyof ScalarTokens['fontSizes']}`
  | `fontWeights.${keyof ScalarTokens['fontWeights']}`
  | `lineHeights.${keyof ScalarTokens['lineHeights']}`
  | `spacing.${keyof ScalarTokens['spacing']}`
  | `radii.${keyof ScalarTokens['radii']}`
  | `strokeWidths.${keyof ScalarTokens['strokeWidths']}`
  | `opacities.${keyof ScalarTokens['opacities']}`
  | `durations.${keyof ScalarTokens['durations']}`
  | `easings.${keyof ScalarTokens['easings']}`

export type PalettePath = PaletteColorPath | PaletteScalarPath
