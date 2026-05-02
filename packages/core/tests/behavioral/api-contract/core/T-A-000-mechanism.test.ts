/**
 * Test ID: T-A-000
 * Maps to: 11g mechanism smoke test (Δ6.1 — D-P0-30 §3 严格 gate)
 * Asserts: vitest + jsdom + @meta2d/core import 链路通(机制走通验证 — 不测 V1 行为本身)
 *
 * 决策来源:D-P0-30 §3(2026-05-02 Δ6.1 启动)
 */
import { describe, it, expect } from 'vitest';
import { Meta2d } from '../../../../index';

describe('T-A-000 — 11g behavioral suite mechanism smoke test', () => {
  it('vitest + jsdom environment is set up', () => {
    expect(typeof document).toBe('object');
    expect(typeof window).toBe('object');
    expect(document.body).toBeDefined();
  });

  it('@meta2d/core Meta2d class is importable', () => {
    expect(Meta2d).toBeDefined();
    expect(typeof Meta2d).toBe('function');
    expect(Meta2d.prototype).toBeDefined();
  });

  it('document.createElement creates HTMLElement (jsdom basic API)', () => {
    const div = document.createElement('div');
    expect(div).toBeInstanceOf(HTMLElement);
    expect(div.tagName).toBe('DIV');
  });
});
