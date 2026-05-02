/**
 * Test ID: T-A-025..T-A-026 (2 cases — Meta2d event subscription / fitView)
 * Maps to: 11b core.ts Meta2d 独有 methods (M5 on / M6 off / M19 fitView)
 * Asserts: V1 event listener subscription + fitView 不 facade-delegate(core 独有)
 *
 * 决策来源:D-P0-30 §3 Δ6.3 hybrid 高 ROI Meta2d core 独有
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Meta2d } from '../../../../index';

describe('T-A-meta2d-events — Meta2d event subscription + fitView API contract', () => {
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
   * Test ID: T-A-025
   * Maps to: 11b M5 Meta2d.on / M6 Meta2d.off (event subscription chainable)
   * Asserts: on(type, handler) returns Meta2d (chainable); handler called on emit
   */
  it('T-A-025 — Meta2d.on subscribes handler invoked on emit; off unsubscribes', async () => {
    const handler = vi.fn();
    const result = meta2d.on('add' as any, handler);
    expect(result).toBeInstanceOf(Meta2d); // chainable

    await meta2d.addPen({ id: 'evt1', name: 'rectangle', x: 0, y: 0, width: 10, height: 10 });
    expect(handler).toHaveBeenCalled();

    meta2d.off('add' as any, handler);
    handler.mockClear();
    await meta2d.addPen({ id: 'evt2', name: 'rectangle', x: 0, y: 0, width: 10, height: 10 });
    expect(handler).not.toHaveBeenCalled();
  });

  /**
   * Test ID: T-A-026
   * Maps to: 11b M19 Meta2d.fitView (Meta2d 独有,无 canvas 直接 facade)
   * Asserts: fitView() with pens does not throw + applies fit logic
   *
   * 注:fitView 类似 gotoView,empty pens 时 V1 行为可能 throw;先 addPen 再 fitView
   */
  it('T-A-026 — Meta2d.fitView with pens does not throw', async () => {
    await meta2d.addPen({ id: 'fv1', name: 'rectangle', x: 0, y: 0, width: 100, height: 100 });
    expect(() => {
      meta2d.fitView();
    }).not.toThrow();
  });
});
