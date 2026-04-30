/**
 * Theme 完整性 + 合规性校验
 */

import type { Theme } from '../schema/theme'
import { fullyResolveTheme, type ResolvedTheme } from '../resolver/resolver'
import { contrastRatio } from './contrast'

export interface ValidationIssue {
  severity: 'error' | 'warning'
  code: string
  message: string
  path?: string
}

export interface ValidationReport {
  valid: boolean
  issues: readonly ValidationIssue[]
}

/**
 * 全面校验一个 theme
 */
export function validateTheme(theme: Theme): ValidationReport {
  const issues: ValidationIssue[] = []

  // 1. 检查 $ref 是否能解析
  let resolved: ResolvedTheme
  try {
    resolved = fullyResolveTheme(theme)
  } catch (e) {
    issues.push({
      severity: 'error',
      code: 'REF_BROKEN',
      message: `Theme has broken $ref: ${(e as Error).message}`
    })
    return { valid: false, issues }
  }

  // 2. 关键对比度 (text.primary vs background.canvas)
  const semantic = resolved.semantic as Record<string, Record<string, unknown>>
  const textPrimary = semantic.text?.['primary']
  const bgCanvas = semantic.background?.['canvas']
  if (typeof textPrimary === 'string' && typeof bgCanvas === 'string') {
    try {
      const ratio = contrastRatio(textPrimary, bgCanvas)
      const required = theme.meta.wcag === 'AAA' ? 7.0 : theme.meta.wcag === 'AA' ? 4.5 : 0
      if (required > 0 && ratio < required) {
        issues.push({
          severity: 'error',
          code: 'CONTRAST_INSUFFICIENT',
          message: `text.primary vs background.canvas: ratio ${ratio.toFixed(2)} < required ${required} (declared ${theme.meta.wcag})`,
          path: 'text.primary / background.canvas'
        })
      }
    } catch (e) {
      issues.push({
        severity: 'warning',
        code: 'CONTRAST_UNCHECKABLE',
        message: `Could not compute contrast: ${(e as Error).message}`
      })
    }
  }

  // 3. 检查必填 semantic 字段是否齐全
  const requiredPaths = [
    'background.canvas', 'background.panel',
    'text.primary', 'text.secondary',
    'border.default',
    'entity.fill', 'entity.stroke'
  ]
  for (const path of requiredPaths) {
    const value = getByPath(semantic, path)
    if (value === undefined || value === null || value === '') {
      issues.push({
        severity: 'error',
        code: 'REQUIRED_TOKEN_MISSING',
        message: `Required semantic token missing: ${path}`,
        path
      })
    }
  }

  return {
    valid: issues.filter(i => i.severity === 'error').length === 0,
    issues
  }
}

function getByPath(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>(
    (acc, p) => (acc as Record<string, unknown> | null | undefined)?.[p],
    obj
  )
}
