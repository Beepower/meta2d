/**
 * 集成测试 - 验证 schema + resolver + themes + css 协同工作
 */

import { describe, it, expect, beforeEach } from 'vitest'
import {
  lightTheme,
  darkTheme,
  highContrastTheme,
  neutralTheme,
  resolveTheme,
  fullyResolveTheme,
  themeToCssVars,
  applyThemeToDom,
  removeAppliedTheme,
  validateTheme,
  contrastRatio,
  type PartialTheme,
  type Theme
} from '../src'

describe('Built-in themes', () => {
  it.each([
    ['light', lightTheme],
    ['dark', darkTheme],
    ['high-contrast', highContrastTheme],
    ['neutral', neutralTheme]
  ])('%s theme passes validation', (_, theme) => {
    const report = validateTheme(theme)
    expect(report.valid).toBe(true)
    expect(report.issues.filter(i => i.severity === 'error')).toEqual([])
  })

  it.each([
    ['light', lightTheme, 'AA' as const],
    ['high-contrast', highContrastTheme, 'AAA' as const]
  ])('%s theme meets %s contrast', (_, theme, level) => {
    const resolved = fullyResolveTheme(theme)
    const semantic = resolved.semantic as Record<string, Record<string, string>>
    const ratio = contrastRatio(semantic.text!.primary!, semantic.background!.canvas!)
    const required = level === 'AAA' ? 7.0 : 4.5
    expect(ratio).toBeGreaterThanOrEqual(required)
  })
})

describe('Theme extension', () => {
  it('partial theme extends light correctly', () => {
    const myTheme: PartialTheme = {
      id: 'my-brand',
      name: 'My Brand',
      extends: 'light',
      meta: { version: '1.0.0' },
      semantic: {
        interaction: { focus: '#FF6B6B' }
      }
    }

    const resolved = resolveTheme(myTheme, { light: lightTheme })

    // override 生效
    expect(resolved.semantic.interaction.focus).toBe('#FF6B6B')
    // 未 override 的字段保留 base
    expect(resolved.semantic.interaction.hover).toEqual(lightTheme.semantic.interaction.hover)
    // palette 完全继承
    expect(resolved.palette).toEqual(lightTheme.palette)
  })

  it('throws on missing base theme', () => {
    const partial: PartialTheme = {
      id: 'orphan',
      name: 'Orphan',
      extends: 'nonexistent',
      meta: { version: '1.0.0' }
    }
    expect(() => resolveTheme(partial, {})).toThrow(/base theme 'nonexistent' not found/)
  })
})

describe('Token reference resolution', () => {
  it('resolves $ref in semantic to palette value', () => {
    const resolved = fullyResolveTheme(lightTheme)
    const semantic = resolved.semantic as Record<string, Record<string, string>>
    expect(semantic.text!.primary).toBe(lightTheme.palette.colors.gray[12])
  })

  it('resolves nested $ref in effect tokens', () => {
    const resolved = fullyResolveTheme(lightTheme)
    const effect = resolved.semantic as { effect: { glowSubtle: { color: string } } }
    expect(effect.effect.glowSubtle.color).toBe(lightTheme.palette.colors.blue[7])
  })
})

describe('CSS output', () => {
  it('generates valid CSS variables', () => {
    const resolved = fullyResolveTheme(lightTheme)
    const css = themeToCssVars(resolved)

    expect(css).toContain(':root[data-theme="light"]')
    expect(css).toMatch(/--m2d-text-primary:\s*#171717;/)
    expect(css).toMatch(/--m2d-background-canvas:\s*#FCFCFC;/)
  })

  it('uses kebab-case for camelCase paths', () => {
    const resolved = fullyResolveTheme(lightTheme)
    const css = themeToCssVars(resolved)
    expect(css).toMatch(/--m2d-stroke-width-equipment:/)
    expect(css).toMatch(/--m2d-typography-body-small-/)
  })

  it('respects custom prefix', () => {
    const resolved = fullyResolveTheme(lightTheme)
    const css = themeToCssVars(resolved, { prefix: 'mycompany' })
    expect(css).toContain('--mycompany-text-primary:')
    expect(css).not.toContain('--m2d-')
  })
})

describe('DOM application', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme')
    document.getElementById('meta2d-theme')?.remove()
  })

  it('injects style and sets data-theme', () => {
    applyThemeToDom(fullyResolveTheme(lightTheme))
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    const styleEl = document.getElementById('meta2d-theme')
    expect(styleEl).not.toBeNull()
    expect(styleEl!.textContent).toContain('--m2d-text-primary:')
  })

  it('replaces style on theme switch', () => {
    applyThemeToDom(fullyResolveTheme(lightTheme))
    const initialContent = document.getElementById('meta2d-theme')!.textContent

    applyThemeToDom(fullyResolveTheme(darkTheme))
    const newContent = document.getElementById('meta2d-theme')!.textContent

    expect(newContent).not.toBe(initialContent)
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    expect(document.querySelectorAll('#meta2d-theme').length).toBe(1)
  })

  it('removeAppliedTheme cleans up', () => {
    applyThemeToDom(fullyResolveTheme(lightTheme))
    removeAppliedTheme()
    expect(document.getElementById('meta2d-theme')).toBeNull()
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false)
  })
})

describe('End-to-end: business workflow', () => {
  it('business theme registered + applied + CSS available', () => {
    const opsTheme: PartialTheme = {
      id: 'ops-gray',
      name: 'Operations (gray)',
      extends: 'neutral',
      meta: {
        version: '1.0.0',
        wcag: 'AA',
        recommendedUsage: ['monitoring']
      },
      semantic: {
        status: {
          danger: '#DC2626'
        }
      }
    }

    const resolved = resolveTheme(opsTheme, {
      light: lightTheme,
      neutral: neutralTheme
    })

    const fullyResolved = fullyResolveTheme(resolved)
    applyThemeToDom(fullyResolved)

    expect(document.documentElement.getAttribute('data-theme')).toBe('ops-gray')
    const css = document.getElementById('meta2d-theme')!.textContent!
    expect(css).toContain('--m2d-status-danger: #DC2626')

    const report = validateTheme(resolved)
    expect(report.valid).toBe(true)

    removeAppliedTheme()
  })
})
