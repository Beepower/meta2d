/**
 * Test ID: T-Q-11.4-1, 11.4-4 (2 quirks — pen 几何)
 * Maps to: 11f §ch11.4 Pen 几何 (4 quirks total)
 * Asserts: V1 implicit — pen.x ≠ worldRect.x / circle width≠height 渲染椭圆
 *
 * 决策来源:D-P0-30 §3 Δ6.4 quirks
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Meta2d } from '../../../../index';

describe('T-Q-11.4 — pen 几何 quirks', () => {
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
   * Test ID: T-Q-11.4-1
   * Maps to: 11f quirk 11.4 #1 — pen.x vs pen.calculative.worldRect.x 可能不同步
   * Asserts: 加 pen 后 pen.calculative 存在;worldRect 是单独 field(不是 pen.x 的 alias)
   */
  it('T-Q-11.4-1 — pen.calculative.worldRect is separate field from pen.x (may diverge)', async () => {
    await meta2d.canvas.addPen({ id: 'q11_4_1', name: 'rectangle', x: 100, y: 200, width: 50, height: 30 });
    const target = meta2d.findOne('q11_4_1');
    expect(target).toBeDefined();
    expect(target!.calculative).toBeDefined();
    expect(target!.calculative!.worldRect).toBeDefined();
    // pen.x and pen.calculative.worldRect 是分离字段(同步可能滞后);test 只 verify 字段独立存在
    expect(target!.x).toBe(100);
    expect(typeof target!.calculative!.worldRect!.x).toBe('number');
  });

  /**
   * Test ID: T-Q-11.4-4
   * Maps to: 11f quirk 11.4 #4 — circle primitive width≠height 渲染椭圆
   * Asserts: circle pen 接受 width ≠ height(不强制 round);几何字段存储原值
   */
  it('T-Q-11.4-4 — circle pen accepts width ≠ height (renders ellipse)', async () => {
    await meta2d.canvas.addPen({ id: 'q11_4_4', name: 'circle', x: 0, y: 0, width: 100, height: 50 });
    const target = meta2d.findOne('q11_4_4');
    expect(target).toBeDefined();
    expect(target!.width).toBe(100);
    expect(target!.height).toBe(50); // 椭圆 — V1 不强制 round
  });
});
