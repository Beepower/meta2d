/**
 * Test ID: T-A-012..T-A-013 (2 cases — state lifecycle)
 * Maps to: 11a canvas A class facade 主头(clearHover / destroy)
 * Asserts: V1 state / lifecycle behavior on canvas
 *
 * 决策来源:D-P0-30 §3 Δ6.2 hybrid 高 ROI A class facade 主头
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Meta2d } from '../../../../index';

describe('T-A-state — canvas state / lifecycle API contract', () => {
  let container: HTMLDivElement;
  let meta2d: Meta2d;

  beforeEach(() => {
    container = document.createElement('div');
    Object.defineProperty(container, 'clientWidth', { value: 800, configurable: true });
    Object.defineProperty(container, 'clientHeight', { value: 600, configurable: true });
    Object.defineProperty(container, 'offsetWidth', { value: 800, configurable: true });
    Object.defineProperty(container, 'offsetHeight', { value: 600, configurable: true });
    document.body.appendChild(container);
    meta2d = new Meta2d(container);
  });

  afterEach(() => {
    try { meta2d.destroy(); } catch {}
    document.body.innerHTML = '';
  });

  /**
   * Test ID: T-A-012
   * Maps to: 11a C008 canvas.clearHover
   * Asserts: clearHover() resets store.hover state without throwing
   */
  it('T-A-012 — canvas.clearHover resets hover state', () => {
    expect(() => {
      meta2d.canvas.clearHover();
    }).not.toThrow();
    // V1 实际 sets store.hover = null(canvas.ts:3454 `this.store.hover = null as any`)
    expect(meta2d.canvas.store.hover).toBeNull();
  });

  /**
   * Test ID: T-A-013
   * Maps to: 11a C043 canvas.destroy
   * Asserts: destroy() cleanup does not throw
   */
  it('T-A-013 — canvas.destroy cleanup completes without throwing', () => {
    const localContainer = document.createElement('div');
    Object.defineProperty(localContainer, 'clientWidth', { value: 800, configurable: true });
    Object.defineProperty(localContainer, 'clientHeight', { value: 600, configurable: true });
    document.body.appendChild(localContainer);
    const localMeta2d = new Meta2d(localContainer);
    expect(() => {
      localMeta2d.canvas.destroy();
    }).not.toThrow();
  });
});
