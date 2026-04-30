/**
 * Light theme - 默认浅色中性主题
 *
 * 设计参考:
 * - Radix UI gray scale (1-12)
 * - WCAG AA 合规(普通文本对比度 ≥ 4.5:1)
 * - 适用于 editor / 文档查看 / 通用场景
 */

import type { Theme } from '../schema/theme'

const palette: Theme['palette'] = {
  colors: {
    gray: {
      1: '#FCFCFC',  2: '#F8F8F8',  3: '#F3F3F3',  4: '#EDEDED',
      5: '#E8E8E8',  6: '#E2E2E2',  7: '#DBDBDB',  8: '#C7C7C7',
      9: '#8F8F8F', 10: '#858585', 11: '#6F6F6F', 12: '#171717'
    },
    blue: {
      1: '#FBFDFF',  2: '#F5FAFF',  3: '#EDF6FF',  4: '#E1F0FF',
      5: '#CEE7FE',  6: '#B7D9F8',  7: '#96C7F2',  8: '#5EB0EF',
      9: '#0091FF', 10: '#0081F1', 11: '#006ADC', 12: '#00254D'
    },
    green: {
      1: '#FBFEFC',  2: '#F2FCF5',  3: '#E9F9EE',  4: '#DDF3E4',
      5: '#CCEBD7',  6: '#B4DFC4',  7: '#92CEAC',  8: '#5BB98C',
      9: '#30A46C', 10: '#299764', 11: '#18794E', 12: '#153226'
    },
    yellow: {
      1: '#FDFDF9',  2: '#FFFCE8',  3: '#FFFBD1',  4: '#FFF8BB',
      5: '#FEF2A4',  6: '#F9E68C',  7: '#EFD36C',  8: '#EBBC00',
      9: '#F5D90A', 10: '#F7CE00', 11: '#946800', 12: '#35290F'
    },
    orange: {
      1: '#FEFCFB',  2: '#FFF8F4',  3: '#FFEDD5',  4: '#FFDFB5',
      5: '#FFD19A',  6: '#FFC182',  7: '#F5AE73',  8: '#EC9455',
      9: '#F76808', 10: '#ED5F00', 11: '#BD4B00', 12: '#451E11'
    },
    red: {
      1: '#FFFCFC',  2: '#FFF8F8',  3: '#FFEFEF',  4: '#FFE5E5',
      5: '#FDD8D8',  6: '#F9C6C6',  7: '#F3AEAF',  8: '#EB9091',
      9: '#E5484D', 10: '#DC3D43', 11: '#CD2B31', 12: '#381316'
    },
    purple: {
      1: '#FEFCFE',  2: '#FDFAFF',  3: '#F9F1FE',  4: '#F3E7FC',
      5: '#EDDBF9',  6: '#E3CCF4',  7: '#D3B4ED',  8: '#BE93E4',
      9: '#8E4EC6', 10: '#8347B9', 11: '#793AAF', 12: '#2B0E44'
    }
  },
  fontFamilies: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif',
    serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    numeric: '"SF Pro Display", "Helvetica Neue", -apple-system, system-ui, sans-serif'
  },
  fontSizes: {
    xs: 11, sm: 12, md: 14, lg: 16, xl: 18, '2xl': 22, '3xl': 28, '4xl': 36
  },
  fontWeights: { regular: 400, medium: 500, semibold: 600, bold: 700 },
  lineHeights: { tight: 1.2, normal: 1.5, relaxed: 1.75 },
  spacing: {
    '0': 0, '1': 2, '2': 4, '3': 8, '4': 12, '6': 16, '8': 24, '12': 32, '16': 48
  },
  radii: { none: 0, sm: 2, md: 4, lg: 8, full: 9999 },
  strokeWidths: { hairline: 0.5, thin: 1, medium: 2, thick: 3, bold: 4 },
  opacities: { transparent: 0, subtle: 0.04, low: 0.16, medium: 0.4, high: 0.72, opaque: 1 },
  durations: { instant: 0, fast: 100, normal: 200, slow: 400, slower: 800 },
  easings: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.5, 1.4, 0.5, 1)'
  }
}

const semantic: Theme['semantic'] = {
  background: {
    canvas: { $ref: 'colors.gray.1' },
    panel: { $ref: 'colors.gray.2' },
    elevated: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.4)'
  },
  surface: {
    subtle: { $ref: 'colors.gray.3' },
    emphasis: { $ref: 'colors.blue.4' },
    inverse: { $ref: 'colors.gray.12' }
  },
  border: {
    subtle: { $ref: 'colors.gray.5' },
    default: { $ref: 'colors.gray.7' },
    strong: { $ref: 'colors.gray.9' },
    inverse: { $ref: 'colors.gray.1' }
  },
  text: {
    primary: { $ref: 'colors.gray.12' },
    secondary: { $ref: 'colors.gray.11' },
    tertiary: { $ref: 'colors.gray.10' },
    disabled: { $ref: 'colors.gray.8' },
    inverse: { $ref: 'colors.gray.1' },
    link: { $ref: 'colors.blue.11' },
    success: { $ref: 'colors.green.11' },
    warning: { $ref: 'colors.orange.11' },
    danger: { $ref: 'colors.red.11' }
  },
  status: {
    info: { $ref: 'colors.blue.9' },
    success: { $ref: 'colors.green.9' },
    warning: { $ref: 'colors.yellow.9' },
    danger: { $ref: 'colors.red.9' },
    neutral: { $ref: 'colors.gray.9' }
  },
  interaction: {
    hover: { $ref: 'colors.gray.4' },
    focus: { $ref: 'colors.blue.9' },
    focusRing: { $ref: 'colors.blue.7' },
    active: { $ref: 'colors.gray.6' },
    selected: { $ref: 'colors.blue.4' },
    disabled: { $ref: 'colors.gray.4' }
  },
  entity: {
    fill: { $ref: 'colors.gray.2' },
    stroke: { $ref: 'colors.gray.11' },
    anchorActive: { $ref: 'colors.blue.9' },
    anchorPassive: { $ref: 'colors.gray.8' },
    anchorDisabled: { $ref: 'colors.gray.6' },
    selectionRing: { $ref: 'colors.blue.9' },
    hoverHighlight: { $ref: 'colors.blue.5' },
    connectionDefault: { $ref: 'colors.gray.10' }
  },
  effect: {
    glowSubtle: {
      color: { $ref: 'colors.blue.7' },
      blur: 4,
      spread: 0
    },
    glowStrong: {
      color: { $ref: 'colors.blue.9' },
      blur: 12,
      spread: 2
    },
    shadowSm: { color: 'rgba(0,0,0,0.04)', blur: 2, offsetY: 1 },
    shadowMd: { color: 'rgba(0,0,0,0.08)', blur: 8, offsetY: 4 },
    shadowLg: { color: 'rgba(0,0,0,0.12)', blur: 24, offsetY: 12 }
  },
  typography: {
    displayLarge: {
      size: { $ref: 'fontSizes.4xl' },
      weight: { $ref: 'fontWeights.bold' },
      lineHeight: { $ref: 'lineHeights.tight' },
      family: { $ref: 'fontFamilies.sans' }
    },
    displayMedium: {
      size: { $ref: 'fontSizes.3xl' },
      weight: { $ref: 'fontWeights.semibold' },
      lineHeight: { $ref: 'lineHeights.tight' },
      family: { $ref: 'fontFamilies.sans' }
    },
    heading: {
      size: { $ref: 'fontSizes.2xl' },
      weight: { $ref: 'fontWeights.semibold' },
      lineHeight: { $ref: 'lineHeights.tight' },
      family: { $ref: 'fontFamilies.sans' }
    },
    title: {
      size: { $ref: 'fontSizes.lg' },
      weight: { $ref: 'fontWeights.medium' },
      lineHeight: { $ref: 'lineHeights.normal' },
      family: { $ref: 'fontFamilies.sans' }
    },
    body: {
      size: { $ref: 'fontSizes.md' },
      weight: { $ref: 'fontWeights.regular' },
      lineHeight: { $ref: 'lineHeights.normal' },
      family: { $ref: 'fontFamilies.sans' }
    },
    bodySmall: {
      size: { $ref: 'fontSizes.sm' },
      weight: { $ref: 'fontWeights.regular' },
      lineHeight: { $ref: 'lineHeights.normal' },
      family: { $ref: 'fontFamilies.sans' }
    },
    caption: {
      size: { $ref: 'fontSizes.xs' },
      weight: { $ref: 'fontWeights.regular' },
      lineHeight: { $ref: 'lineHeights.normal' },
      family: { $ref: 'fontFamilies.sans' }
    },
    numeric: {
      size: { $ref: 'fontSizes.md' },
      weight: { $ref: 'fontWeights.medium' },
      lineHeight: { $ref: 'lineHeights.normal' },
      family: { $ref: 'fontFamilies.numeric' }
    },
    numericLarge: {
      size: { $ref: 'fontSizes.2xl' },
      weight: { $ref: 'fontWeights.semibold' },
      lineHeight: { $ref: 'lineHeights.tight' },
      family: { $ref: 'fontFamilies.numeric' }
    }
  },
  strokeWidth: {
    auxiliary: { $ref: 'strokeWidths.hairline' },
    equipment: { $ref: 'strokeWidths.medium' },
    connection: { $ref: 'strokeWidths.thin' },
    busbar: { $ref: 'strokeWidths.thick' },
    emphasis: { $ref: 'strokeWidths.medium' }
  }
}

export const lightTheme: Theme = {
  id: 'light',
  name: 'Light',
  meta: {
    version: '1.0.0',
    author: 'meta2d',
    description: 'Default light theme — neutral, WCAG AA compliant',
    wcag: 'AA',
    recommendedUsage: ['editor', 'monitoring', 'general']
  },
  palette,
  semantic
}
