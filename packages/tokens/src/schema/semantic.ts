/**
 * Tier 2: Semantic tokens — meaningful intentions, the vocabulary of design.
 *
 * 设计契约:
 * - semantic 是 V2 业务代码**唯一应该引用**的层
 * - semantic 的字段名描述"做什么用",不描述"是什么颜色"
 * - 字段值可以是 palette 引用 (`{ $ref: 'colors.gray.1' }`) 或字面值
 * - semantic schema 不轻易变更(契约稳定性)
 */

import type { PalettePath } from './palette'

/**
 * Token reference - 引用 palette 中的某个值
 *
 * 例:`{ $ref: 'colors.gray.1' }` 在 light 主题解析为浅灰,在 dark 解析为深灰
 */
export interface TokenRef {
  readonly $ref: PalettePath
}

export type ColorValue = string | TokenRef
export type NumericValue = number | TokenRef
export type StringValue = string | TokenRef

/**
 * 背景层 — 由后向前层叠
 */
export interface BackgroundTokens {
  readonly canvas: ColorValue           // 画布最底层(SLD 背景)
  readonly panel: ColorValue            // 面板/卡片背景(属性面板等)
  readonly elevated: ColorValue         // 弹出层(对话框、菜单)
  readonly overlay: ColorValue          // 遮罩层
}

/**
 * 表面 - 与 background 层叠组合
 */
export interface SurfaceTokens {
  readonly subtle: ColorValue           // 轻微强调(hover 区域)
  readonly emphasis: ColorValue         // 强调表面(选中卡片)
  readonly inverse: ColorValue          // 反色表面(toast)
}

/**
 * 边框 — strokeColor 字段语义
 */
export interface BorderTokens {
  readonly subtle: ColorValue           // 微弱边框(分组分隔)
  readonly default: ColorValue          // 普通边框(input border)
  readonly strong: ColorValue           // 强调边框(focused)
  readonly inverse: ColorValue
}

/**
 * 文字 - 4 级层次
 */
export interface TextTokens {
  readonly primary: ColorValue          // 标题文字
  readonly secondary: ColorValue        // 正文
  readonly tertiary: ColorValue         // 次要说明
  readonly disabled: ColorValue         // 禁用
  readonly inverse: ColorValue
  readonly link: ColorValue
  readonly success: ColorValue
  readonly warning: ColorValue
  readonly danger: ColorValue
}

/**
 * 状态色 — 与 status 概念对应
 */
export interface StatusTokens {
  readonly info: ColorValue
  readonly success: ColorValue
  readonly warning: ColorValue
  readonly danger: ColorValue
  readonly neutral: ColorValue
}

/**
 * 交互状态 - hover / focus / active / disabled
 */
export interface InteractionTokens {
  readonly hover: ColorValue
  readonly focus: ColorValue
  readonly focusRing: ColorValue
  readonly active: ColorValue
  readonly selected: ColorValue
  readonly disabled: ColorValue
}

/**
 * 图元(diagram entity)专用 - 与 Pen / Connection 字段对应
 *
 * ⚠️ 这是 meta2d 特有的语义层,不是通用 UI design system 概念
 */
export interface EntityTokens {
  readonly fill: ColorValue             // Pen 默认填充
  readonly stroke: ColorValue           // Pen / Connection 默认描边
  readonly anchorActive: ColorValue     // 端口可发起连接
  readonly anchorPassive: ColorValue    // 端口只接收
  readonly anchorDisabled: ColorValue
  readonly selectionRing: ColorValue    // 选中描边
  readonly hoverHighlight: ColorValue
  readonly connectionDefault: ColorValue
}

/**
 * 装饰效果 - glow / shadow
 */
export interface EffectTokens {
  readonly glowSubtle: {
    readonly color: ColorValue
    readonly blur: NumericValue
    readonly spread: NumericValue
  }
  readonly glowStrong: {
    readonly color: ColorValue
    readonly blur: NumericValue
    readonly spread: NumericValue
  }
  readonly shadowSm: {
    readonly color: ColorValue
    readonly blur: NumericValue
    readonly offsetY: NumericValue
  }
  readonly shadowMd: {
    readonly color: ColorValue
    readonly blur: NumericValue
    readonly offsetY: NumericValue
  }
  readonly shadowLg: {
    readonly color: ColorValue
    readonly blur: NumericValue
    readonly offsetY: NumericValue
  }
}

/**
 * 字号语义 - 不直接用 palette.fontSizes,而用语义角色
 */
export interface TypographyToken {
  readonly size: NumericValue
  readonly weight: NumericValue
  readonly lineHeight: NumericValue
  readonly family: StringValue
}

export interface TypographyTokens {
  readonly displayLarge: TypographyToken
  readonly displayMedium: TypographyToken
  readonly heading: TypographyToken
  readonly title: TypographyToken
  readonly body: TypographyToken
  readonly bodySmall: TypographyToken
  readonly caption: TypographyToken
  readonly numeric: TypographyToken
  readonly numericLarge: TypographyToken
}

/**
 * 描边宽度 — 比 palette 多一层语义
 */
export interface StrokeWidthTokens {
  readonly auxiliary: NumericValue       // 辅助线、网格
  readonly equipment: NumericValue       // 设备轮廓
  readonly connection: NumericValue      // 普通连线
  readonly busbar: NumericValue          // 母线(粗)
  readonly emphasis: NumericValue        // 强调(选中描边)
}

/**
 * 完整的 Semantic Token Schema
 */
export interface SemanticTokens {
  readonly background: BackgroundTokens
  readonly surface: SurfaceTokens
  readonly border: BorderTokens
  readonly text: TextTokens
  readonly status: StatusTokens
  readonly interaction: InteractionTokens
  readonly entity: EntityTokens
  readonly effect: EffectTokens
  readonly typography: TypographyTokens
  readonly strokeWidth: StrokeWidthTokens
}

/**
 * 类型化的 semantic 路径(给 V2 / AI 用,防 magic string)
 */
export type SemanticPath =
  | `background.${keyof BackgroundTokens}`
  | `surface.${keyof SurfaceTokens}`
  | `border.${keyof BorderTokens}`
  | `text.${keyof TextTokens}`
  | `status.${keyof StatusTokens}`
  | `interaction.${keyof InteractionTokens}`
  | `entity.${keyof EntityTokens}`
  | `strokeWidth.${keyof StrokeWidthTokens}`
  | `typography.${keyof TypographyTokens}`
