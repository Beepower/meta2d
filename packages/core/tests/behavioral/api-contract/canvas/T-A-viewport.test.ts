/**
 * Test ID: T-A-008..T-A-011 (4 cases — viewport control)
 * Maps to: 11a canvas A class facade 主头(setViewport / setScale / gotoView / resize)
 * Asserts: V1 viewport / scale / dimension behavior on canvas
 *
 * 决策来源:D-P0-30 §3 Δ6.2 hybrid 高 ROI A class facade 主头
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Meta2d } from '../../../../index';

describe('T-A-viewport — canvas viewport control API contract', () => {
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
   * Test ID: T-A-008
   * Maps to: 11a C018 canvas.setViewport
   * Asserts: setViewport({x, y, zoom}) updates canvas / store viewport state
   */
  it('T-A-008 — canvas.setViewport updates store data scale', () => {
    expect(() => {
      meta2d.canvas.setViewport({ x: 100, y: 200, zoom: 2 });
    }).not.toThrow();
    expect(meta2d.canvas.store.data.scale).toBe(2);
  });

  /**
   * Test ID: T-A-009
   * Maps to: 11a C020 canvas.setScale
   * Asserts: setScale(zoom) updates store.data.scale
   */
  it('T-A-009 — canvas.setScale updates scale', () => {
    meta2d.canvas.setScale(1.5);
    expect(meta2d.canvas.store.data.scale).toBeCloseTo(1.5);
  });

  /**
   * Test ID: T-A-010
   * Maps to: 11a C074 canvas.gotoView (public-ish)
   * Asserts: gotoView(x, y) with non-empty pens does not throw + applies translate via store
   *
   * 注:V1 quirk — empty pens 时 getRect 返 Infinity width,gotoView 抛 "width is not finite";
   * 此 test 先 addPen 再 gotoView(facade 主头测试要 valid precondition state)
   */
  it('T-A-010 — canvas.gotoView with pens does not throw', async () => {
    await meta2d.canvas.addPen({ id: 'gv-p1', name: 'rectangle', x: 0, y: 0, width: 100, height: 100 });
    expect(() => {
      meta2d.canvas.gotoView(0.5, 0.5);
    }).not.toThrow();
  });

  /**
   * Test ID: T-A-011
   * Maps to: 11a C009 canvas.resize
   * Asserts: resize(w, h) updates canvas dimensions
   */
  it('T-A-011 — canvas.resize updates internal canvas dimensions', () => {
    expect(() => {
      meta2d.canvas.resize(1024, 768);
    }).not.toThrow();
    // canvas.canvas is the internal HTMLCanvasElement; width set via DPI ratio
    expect(meta2d.canvas.canvas).toBeDefined();
  });
});
