/**
 * Neutral theme - 极简灰阶,无色彩干扰
 * 设计参考:ISA-101 工业 HMI 高性能 HMI 哲学
 *   - 平时一切都是灰阶,只有 alarm 才用色
 *   - 让运营人员注意力放在异常上
 */

import type { Theme, PartialTheme } from '../schema/theme'
import { resolveTheme } from '../resolver/resolver'
import { lightTheme } from './light'

const neutralPartial: PartialTheme = {
  id: 'neutral',
  name: 'Neutral (ISA-101 inspired)',
  extends: 'light',
  meta: {
    version: '1.0.0',
    author: 'meta2d',
    description: 'Minimal grayscale theme — colors reserved for alerts only',
    wcag: 'AA',
    recommendedUsage: ['monitoring', 'industrial-hmi', 'sustained-operation']
  },
  semantic: {
    entity: {
      fill: { $ref: 'colors.gray.2' },
      stroke: { $ref: 'colors.gray.10' },
      // 平时所有 anchor 都是灰
      anchorActive: { $ref: 'colors.gray.9' },
      anchorPassive: { $ref: 'colors.gray.7' },
      anchorDisabled: { $ref: 'colors.gray.5' },
      selectionRing: { $ref: 'colors.gray.12' },
      hoverHighlight: { $ref: 'colors.gray.4' },
      connectionDefault: { $ref: 'colors.gray.9' }
    },
    interaction: {
      hover: { $ref: 'colors.gray.4' },
      focus: { $ref: 'colors.gray.12' },  // 焦点用极深灰,不用蓝
      focusRing: { $ref: 'colors.gray.10' },
      active: { $ref: 'colors.gray.6' },
      selected: { $ref: 'colors.gray.5' },
      disabled: { $ref: 'colors.gray.4' }
    }
    // status 颜色保留(alarm 才显眼)
  }
}

export const neutralTheme: Theme = resolveTheme(neutralPartial, { light: lightTheme })
