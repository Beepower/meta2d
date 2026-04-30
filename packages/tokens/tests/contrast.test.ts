/**
 * 对比度计算单元测试
 */

import { describe, it, expect } from 'vitest'
import { contrastRatio, meetsWcag } from '../src'

describe('contrastRatio', () => {
  it('black on white = 21', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 0)
  })

  it('white on white = 1', () => {
    expect(contrastRatio('#FFFFFF', '#FFFFFF')).toBe(1)
  })

  it('order does not matter', () => {
    expect(contrastRatio('#000000', '#FFFFFF'))
      .toBeCloseTo(contrastRatio('#FFFFFF', '#000000'), 5)
  })

  it('parses 3-char hex', () => {
    expect(contrastRatio('#000', '#FFF')).toBeCloseTo(21, 0)
  })

  it('parses rgb()', () => {
    expect(contrastRatio('rgb(0, 0, 0)', 'rgb(255, 255, 255)')).toBeCloseTo(21, 0)
  })

  it('parses rgba()', () => {
    // alpha 在 contrast 计算中不直接用,但 parse 不应抛错
    expect(() => contrastRatio('rgba(0, 0, 0, 0.5)', '#FFFFFF')).not.toThrow()
  })

  it('throws on invalid format', () => {
    expect(() => contrastRatio('not a color', '#FFFFFF')).toThrow()
  })
})

describe('meetsWcag', () => {
  it('AA normal: black on white passes', () => {
    expect(meetsWcag('#000000', '#FFFFFF', 'AA', 'normal')).toBe(true)
  })

  it('AAA normal: gray 8 on white fails', () => {
    expect(meetsWcag('#969696', '#FFFFFF', 'AAA', 'normal')).toBe(false)
  })

  it('AA large: lower threshold (3.0)', () => {
    // #888888 vs #FFFFFF ≈ 3.5 — 通过 AA large 但不通过 AA normal
    expect(meetsWcag('#888888', '#FFFFFF', 'AA', 'large')).toBe(true)
    expect(meetsWcag('#888888', '#FFFFFF', 'AA', 'normal')).toBe(false)
  })
})
