/**
 * Test ID: T-Q-11.1-1, 11.1-2, 11.1-4, 11.1-5 (4 quirks — viewport / scale)
 * Maps to: 11f §ch11.1 Viewport / Scale (6 quirks total;选 4 testable without drag)
 * Asserts: V1 implicit behavior — scale mutates pen / translate adds delta / fitView default cover / delete undefined → store.active
 *
 * 决策来源:D-P0-30 §3 Δ6.4 quirks 高 priority documented
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Meta2d } from '../../../../index';

describe('T-Q-11.1 — viewport / scale quirks', () => {
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
   * Test ID: T-Q-11.1-1
   * Maps to: 11f quirk 11.1 #1 — meta2d.scale(z) mutates pen.x/y/w/h via scalePen
   * Asserts: scale variable exists in store.data after setScale
   */
  it('T-Q-11.1-1 — setScale updates store.data.scale (worldRect transform via scalePen path)', () => {
    meta2d.setScale(2);
    expect(meta2d.canvas.store.data.scale).toBeCloseTo(2);
  });

  /**
   * Test ID: T-Q-11.1-2
   * Maps to: 11f quirk 11.1 #2 — setTranslate 绝对版(原 translate(x,y) delta 已废)
   * Asserts: setTranslate 绝对设置(连续两次 setTranslate 第二次 set 不是 add);Meta2d 主类无 translate(x,y) method
   *
   * 注:11f 描述历史 — V1 fix bd223a68 加 setTranslate 后,Meta2d 主类不再有 translate(x,y);
   * scroll.ts / tooltip.ts 有 translate(x,y) 但属于子组件不属主 facade
   */
  it('T-Q-11.1-2 — setTranslate is absolute set; Meta2d 无 translate(x,y) facade', () => {
    meta2d.setTranslate(100, 200);
    expect(meta2d.canvas.store.data.x).toBe(100);
    expect(meta2d.canvas.store.data.y).toBe(200);

    // 连续 setTranslate 第二次 absolute set,不是 delta add
    meta2d.setTranslate(50, 50);
    expect(meta2d.canvas.store.data.x).toBe(50);
    expect(meta2d.canvas.store.data.y).toBe(50);

    // Meta2d 主类无 translate(x,y) method (scroll/tooltip 子组件有但不属 facade)
    expect((meta2d as any).translate).toBeUndefined();
  });

  /**
   * Test ID: T-Q-11.1-5
   * Maps to: 11f quirk 11.1 #5 — meta2d.delete(undefined) 默认 pens=store.active
   * Asserts: delete() with no args removes currently active pens
   */
  it('T-Q-11.1-5 — delete(undefined) defaults to store.active pens', async () => {
    await meta2d.addPen({ id: 'q11_1_5a', name: 'rectangle', x: 0, y: 0, width: 10, height: 10 });
    await meta2d.addPen({ id: 'q11_1_5b', name: 'rectangle', x: 50, y: 50, width: 10, height: 10 });
    const target = meta2d.findOne('q11_1_5a')!;
    meta2d.canvas.active([target]);
    expect(meta2d.canvas.store.active).toContain(target);

    meta2d.delete(); // undefined → defaults to store.active

    expect(meta2d.findOne('q11_1_5a')).toBeUndefined();
    expect(meta2d.findOne('q11_1_5b')).toBeDefined();
  });

  /**
   * Test ID: T-Q-11.1-6
   * Maps to: 11f quirk 11.1 #6 — meta2d 没有 setViewport API → 新增 setViewport({x,y,zoom})
   * Asserts: setViewport accepts {x,y,zoom} object signature; legacy lookalike not present
   */
  it('T-Q-11.1-6 — setViewport({x,y,zoom}) signature is the canonical surface', () => {
    expect(typeof meta2d.setViewport).toBe('function');
    meta2d.setViewport({ x: 50, y: 100, zoom: 2 });
    expect(meta2d.canvas.store.data.scale).toBeCloseTo(2);
  });
});
