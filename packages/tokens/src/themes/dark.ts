/**
 * Dark theme - 深色中性主题
 * 用 extends + override 减少重复定义
 */

import type { Theme, PartialTheme } from '../schema/theme'
import { resolveTheme } from '../resolver/resolver'
import { lightTheme } from './light'

const darkPartial: PartialTheme = {
  id: 'dark',
  name: 'Dark',
  extends: 'light',
  meta: {
    version: '1.0.0',
    author: 'meta2d',
    description: 'Default dark theme — neutral, WCAG AA compliant',
    wcag: 'AA',
    recommendedUsage: ['editor', 'showcase', 'low-light']
  },
  palette: {
    colors: {
      gray: {
        1: '#161616',  2: '#1C1C1C',  3: '#232323',  4: '#282828',
        5: '#2E2E2E',  6: '#343434',  7: '#3E3E3E',  8: '#505050',
        9: '#707070', 10: '#7E7E7E', 11: '#A0A0A0', 12: '#EDEDED'
      },
      blue: {
        1: '#0F1720',  2: '#0F1B2D',  3: '#10243E',  4: '#102A4C',
        5: '#0F3058',  6: '#0D3868',  7: '#0A4481',  8: '#0954A5',
        9: '#0091FF', 10: '#369EFF', 11: '#52A9FF', 12: '#EAF6FF'
      },
      green: {
        1: '#0D1912',  2: '#0C1F17',  3: '#0F291E',  4: '#113123',
        5: '#133929',  6: '#164430',  7: '#1B543A',  8: '#236E4A',
        9: '#30A46C', 10: '#3CB179', 11: '#4CC38A', 12: '#E5FBEB'
      },
      yellow: {
        1: '#1C1500',  2: '#221A00',  3: '#2C2100',  4: '#352800',
        5: '#3E3000',  6: '#493C00',  7: '#594A05',  8: '#705E10',
        9: '#F5D90A', 10: '#FFEF5C', 11: '#F0C000', 12: '#FFFAB8'
      },
      orange: {
        1: '#1F1206',  2: '#2B1400',  3: '#391A03',  4: '#441F04',
        5: '#4F2305',  6: '#5F2A06',  7: '#763205',  8: '#943E00',
        9: '#F76808', 10: '#FF802B', 11: '#FF8B3E', 12: '#FEEADD'
      },
      red: {
        1: '#1F1315',  2: '#291415',  3: '#3C181A',  4: '#481A1D',
        5: '#541B1F',  6: '#671E22',  7: '#822025',  8: '#AA2429',
        9: '#E5484D', 10: '#F2555A', 11: '#FF6369', 12: '#FFE5E5'
      },
      purple: {
        1: '#1B141D',  2: '#221527',  3: '#301A3A',  4: '#3A1E48',
        5: '#432155',  6: '#4E2667',  7: '#5F2C82',  8: '#7A3DA3',
        9: '#8E4EC6', 10: '#9D5BD2', 11: '#BF7AF0', 12: '#F7ECFC'
      }
    }
  },
  // semantic 大部分不需要 override(token reference 自动指向新 palette)
  // 唯一 override:elevated 在 dark 不再是纯白,effect 阴影更深
  semantic: {
    background: {
      elevated: '#202020',
      overlay: 'rgba(0, 0, 0, 0.6)'
    },
    effect: {
      glowSubtle: { color: { $ref: 'colors.blue.10' }, blur: 6, spread: 1 },
      glowStrong: { color: { $ref: 'colors.blue.9' }, blur: 16, spread: 3 },
      shadowSm: { color: 'rgba(0,0,0,0.2)', blur: 2, offsetY: 1 },
      shadowMd: { color: 'rgba(0,0,0,0.3)', blur: 8, offsetY: 4 },
      shadowLg: { color: 'rgba(0,0,0,0.4)', blur: 24, offsetY: 12 }
    }
  }
}

// Eager resolve(在包加载时合并完成)
export const darkTheme: Theme = resolveTheme(darkPartial, { light: lightTheme })
