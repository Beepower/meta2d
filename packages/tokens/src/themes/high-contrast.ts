/**
 * High Contrast theme - WCAG AAA 合规(普通文本对比度 ≥ 7:1)
 * 设计目标:辅助功能 / 视觉障碍用户 / 强阳光环境
 */

import type { Theme, PartialTheme } from '../schema/theme'
import { resolveTheme } from '../resolver/resolver'
import { lightTheme } from './light'

const hcPartial: PartialTheme = {
  id: 'high-contrast',
  name: 'High Contrast',
  extends: 'light',
  meta: {
    version: '1.0.0',
    author: 'meta2d',
    description: 'WCAG AAA compliant high contrast theme',
    wcag: 'AAA',
    recommendedUsage: ['accessibility', 'outdoor', 'monitoring-critical']
  },
  palette: {
    colors: {
      gray: {
        1: '#FFFFFF',  2: '#F5F5F5',  3: '#EBEBEB',  4: '#E0E0E0',
        5: '#D0D0D0',  6: '#B8B8B8',  7: '#969696',  8: '#707070',
        9: '#505050', 10: '#383838', 11: '#202020', 12: '#000000'
      }
    }
  },
  semantic: {
    text: {
      primary: '#000000',
      secondary: { $ref: 'colors.gray.12' },
      tertiary: { $ref: 'colors.gray.11' }
    },
    border: {
      subtle: { $ref: 'colors.gray.7' },
      default: { $ref: 'colors.gray.9' },
      strong: '#000000'
    }
  }
}

export const highContrastTheme: Theme = resolveTheme(hcPartial, { light: lightTheme })
