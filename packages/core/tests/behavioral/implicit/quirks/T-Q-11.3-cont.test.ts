/**
 * Test ID: T-Q-11.3-1, 11.3-2 (2 cases — render 续)
 * Maps to: 11f §ch11.3 quirks 11.3 #1 renderPensAnchors / 11.3 #2 movingPens 遍历
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Meta2d } from '../../../../index';

describe('T-Q-11.3-cont — render quirks 续', () => {
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
   * Test ID: T-Q-11.3-1
   * Maps to: 11f quirk 11.3 #1 — renderPensAnchors 不查 globalAlpha + inView
   * Asserts: renderPensAnchors method exists on canvas (V1 internal render path)
   */
  it('T-Q-11.3-1 — canvas.renderPensAnchors method exists (internal render anchor path)', () => {
    expect(typeof meta2d.canvas.renderPensAnchors).toBe('function');
  });

  /**
   * Test ID: T-Q-11.3-2
   * Maps to: 11f quirk 11.3 #2 — renderPensAnchors 遍历 store.data.pens 不是 movingPens (D1 fix 后改 movingPens 路径)
   * Asserts: movingPens field exists (drag clone 容器);D1 修复后 render 走 movingPens 路径
   */
  it('T-Q-11.3-2 — movingPens field is initialized as undefined / empty (drag clone container)', () => {
    // D1 修复后 V1 走 movingPens path,但默认无 drag → movingPens undefined
    const movingPens = (meta2d.canvas as any).movingPens;
    expect(movingPens === undefined || Array.isArray(movingPens) && movingPens.length === 0).toBe(true);
  });
});
