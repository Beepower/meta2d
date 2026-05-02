/**
 * Test ID: T-A-001
 * Maps to: 11b core.ts Meta2d class constructor (M1-M25 entry point)
 * Asserts: new Meta2d(parent, opts?) constructs without throwing; canvas + store accessible after construction
 *
 * 决策来源:D-P0-30 §3 sample test for jsdom canvas API readiness verification(Δ6.1 严格 gate)
 *
 * 已知风险:jsdom 不实现 Canvas 2D context,Meta2d.init() 调 getContext('2d') 可能返回 null。
 * 此 test 是 jsdom canvas API readiness probe — 失败则 Δ6.1 ping 时上报需引入 canvas mock(canvas npm pkg / vitest mock)
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Meta2d } from '../../../../index';

describe('T-A-001 — Meta2d basic constructor (jsdom canvas API readiness probe)', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'meta2d-test-container';
    Object.defineProperty(container, 'clientWidth', { value: 800, configurable: true });
    Object.defineProperty(container, 'clientHeight', { value: 600, configurable: true });
    Object.defineProperty(container, 'offsetWidth', { value: 800, configurable: true });
    Object.defineProperty(container, 'offsetHeight', { value: 600, configurable: true });
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('new Meta2d(HTMLElement) does not throw immediately on construct', () => {
    let meta2d: Meta2d | null = null;
    let constructError: Error | null = null;
    try {
      meta2d = new Meta2d(container);
    } catch (e) {
      constructError = e as Error;
    }
    if (constructError) {
      console.warn('[T-A-001] Meta2d constructor threw:', constructError.message);
    }
    expect(constructError).toBeNull();
    expect(meta2d).not.toBeNull();
  });

  it('Meta2d instance has canvas property after construction', () => {
    const meta2d = new Meta2d(container);
    expect(meta2d.canvas).toBeDefined();
  });

  it('Meta2d instance has store property after construction', () => {
    const meta2d = new Meta2d(container);
    expect(meta2d.store).toBeDefined();
  });
});
