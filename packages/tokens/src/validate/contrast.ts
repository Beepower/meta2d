/**
 * WCAG 对比度校验
 *
 * 用于:主题注册时检查 text vs background 是否合规
 * 公式参考:WCAG 2.1 Contrast Ratio (G18)
 */

/**
 * 计算两个颜色的相对对比度(1.0 - 21.0)
 * @returns 比值,例:4.5 表示 4.5:1
 */
export function contrastRatio(color1: string, color2: string): number {
  const lum1 = relativeLuminance(color1)
  const lum2 = relativeLuminance(color2)
  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * 验证是否符合 WCAG level
 *   - AA normal text: ≥ 4.5
 *   - AA large text:  ≥ 3.0
 *   - AAA normal:     ≥ 7.0
 *   - AAA large:      ≥ 4.5
 */
export function meetsWcag(
  fg: string,
  bg: string,
  level: 'AA' | 'AAA',
  size: 'normal' | 'large' = 'normal'
): boolean {
  const ratio = contrastRatio(fg, bg)
  const thresholds = {
    AA: { normal: 4.5, large: 3.0 },
    AAA: { normal: 7.0, large: 4.5 }
  }
  return ratio >= thresholds[level][size]
}

function relativeLuminance(color: string): number {
  const { r, g, b } = parseColor(color)
  const components = [r, g, b].map(c => {
    const sRGB = c / 255
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4)
  })
  const R = components[0]!
  const G = components[1]!
  const B = components[2]!
  return 0.2126 * R + 0.7152 * G + 0.0722 * B
}

interface RGB {
  r: number
  g: number
  b: number
  a: number
}

function parseColor(color: string): RGB {
  const trimmed = color.trim()

  // hex 格式
  if (trimmed.startsWith('#')) {
    return parseHex(trimmed)
  }

  // rgb / rgba
  if (trimmed.startsWith('rgb')) {
    return parseRgb(trimmed)
  }

  throw new Error(`[meta2d/tokens] Unsupported color format: ${color}`)
}

function parseHex(color: string): RGB {
  const hex = color.replace('#', '')
  if (hex.length === 3) {
    return {
      r: parseInt(hex[0]! + hex[0]!, 16),
      g: parseInt(hex[1]! + hex[1]!, 16),
      b: parseInt(hex[2]! + hex[2]!, 16),
      a: 255
    }
  }
  if (hex.length === 6) {
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
      a: 255
    }
  }
  if (hex.length === 8) {
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
      a: parseInt(hex.slice(6, 8), 16)
    }
  }
  throw new Error(`[meta2d/tokens] Invalid hex color: ${color}`)
}

function parseRgb(color: string): RGB {
  // rgb(r, g, b) / rgba(r, g, b, a)
  const match = color.match(/rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)(?:[\s,/]+([\d.]+))?\s*\)/)
  if (!match) {
    throw new Error(`[meta2d/tokens] Invalid rgb color: ${color}`)
  }
  return {
    r: parseInt(match[1]!, 10),
    g: parseInt(match[2]!, 10),
    b: parseInt(match[3]!, 10),
    a: match[4] ? Math.round(parseFloat(match[4]) * 255) : 255
  }
}
