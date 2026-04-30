/**
 * Resolver 单元测试
 */

import { describe, it, expect } from 'vitest'
import {
  resolveTokenValue,
  fullyResolveTheme,
  isTokenRef,
  deepMerge
} from '../src'
import { lightTheme } from '../src/themes/light'

describe('isTokenRef', () => {
  it('detects valid TokenRef', () => {
    expect(isTokenRef({ $ref: 'colors.gray.5' })).toBe(true)
  })

  it('rejects non-objects', () => {
    expect(isTokenRef('#fff')).toBe(false)
    expect(isTokenRef(42)).toBe(false)
    expect(isTokenRef(null)).toBe(false)
    expect(isTokenRef(undefined)).toBe(false)
  })

  it('rejects objects without $ref', () => {
    expect(isTokenRef({})).toBe(false)
    expect(isTokenRef({ foo: 'bar' })).toBe(false)
  })

  it('rejects $ref with non-string value', () => {
    expect(isTokenRef({ $ref: 42 })).toBe(false)
    expect(isTokenRef({ $ref: null })).toBe(false)
  })
})

describe('resolveTokenValue', () => {
  it('resolves literal string as-is', () => {
    const result = resolveTokenValue('#FF0000', lightTheme.palette)
    expect(result).toBe('#FF0000')
  })

  it('resolves literal number as-is', () => {
    const result = resolveTokenValue(42, lightTheme.palette)
    expect(result).toBe(42)
  })

  it('resolves $ref to color value', () => {
    const result = resolveTokenValue(
      { $ref: 'colors.gray.5' as const },
      lightTheme.palette
    )
    expect(result).toBe(lightTheme.palette.colors.gray[5])
  })

  it('resolves $ref to font size', () => {
    const result = resolveTokenValue(
      { $ref: 'fontSizes.md' as const },
      lightTheme.palette
    )
    expect(result).toBe(lightTheme.palette.fontSizes.md)
  })

  it('throws on broken $ref path', () => {
    expect(() =>
      resolveTokenValue(
        { $ref: 'colors.nonexistent.5' as never },
        lightTheme.palette
      )
    ).toThrow(/resolved to undefined|broke at/)
  })

  it('recursively resolves nested objects', () => {
    const nested = {
      color: { $ref: 'colors.blue.9' as const },
      blur: 4,
      spread: 0
    }
    const result = resolveTokenValue(nested, lightTheme.palette) as typeof nested
    expect(result.color).toBe(lightTheme.palette.colors.blue[9])
    expect(result.blur).toBe(4)
  })
})

describe('fullyResolveTheme', () => {
  it('resolves all $refs in light theme', () => {
    const resolved = fullyResolveTheme(lightTheme)
    const semantic = resolved.semantic as Record<string, Record<string, string>>

    // 抽查几个关键 token
    expect(semantic.text!.primary).toBe(lightTheme.palette.colors.gray[12])
    expect(semantic.background!.canvas).toBe(lightTheme.palette.colors.gray[1])
    expect(semantic.entity!.fill).toBe(lightTheme.palette.colors.gray[2])
  })

  it('preserves literal values', () => {
    const resolved = fullyResolveTheme(lightTheme)
    const semantic = resolved.semantic as Record<string, Record<string, string>>
    expect(semantic.background!.elevated).toBe('#FFFFFF')
  })

  it('preserves theme id and name', () => {
    const resolved = fullyResolveTheme(lightTheme)
    expect(resolved.id).toBe('light')
    expect(resolved.name).toBe('Light')
  })
})

describe('deepMerge', () => {
  it('merges nested objects', () => {
    const base = { a: { b: 1, c: 2 }, d: 3 }
    const override = { a: { b: 10 }, e: 4 }
    const result = deepMerge(base, override) as typeof base & { e: number }

    expect(result.a.b).toBe(10)
    expect(result.a.c).toBe(2)  // 保留
    expect(result.d).toBe(3)
    expect(result.e).toBe(4)
  })

  it('replaces arrays(not merges)', () => {
    const base = { arr: [1, 2, 3] }
    const override = { arr: [4, 5] }
    const result = deepMerge(base, override)
    expect(result.arr).toEqual([4, 5])
  })

  it('handles undefined override(keeps base)', () => {
    const base = { a: 1, b: 2 }
    const result = deepMerge(base, undefined)
    expect(result).toEqual(base)
  })

  it('skips undefined fields in override', () => {
    const base = { a: 1, b: 2 }
    const override = { a: undefined, b: 99 }
    const result = deepMerge(base, override)
    expect(result.a).toBe(1)
    expect(result.b).toBe(99)
  })

  it('replaces primitives', () => {
    expect(deepMerge('foo', 'bar')).toBe('bar')
    expect(deepMerge(1, 2)).toBe(2)
  })

  it('null override produces null', () => {
    const result = deepMerge({ a: 1 }, null)
    expect(result).toBeNull()
  })
})
