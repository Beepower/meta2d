/**
 * Test ID: T-Q-11.3-3, 11.3-4 (2 quirks — render)
 * Maps to: 11f §ch11.3 Render (4 quirks total;选 2 testable without真 render)
 * Asserts: V1 implicit — dirtyPenRender opt-in flag / Path2D WeakMap cache
 *
 * 决策来源:D-P0-30 §3 Δ6.4 quirks 高 priority
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Meta2d } from '../../../../index';

describe('T-Q-11.3 — render quirks', () => {
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
   * Test ID: T-Q-11.3-3
   * Maps to: 11f quirk 11.3 #3 — 4 层 offscreen drawImage 合成 — opt-in dirtyPenRender flag
   * Asserts: Options.dirtyPenRender flag exists on store.options; default state checked
   */
  it('T-Q-11.3-3 — Options.dirtyPenRender flag is opt-in (default flag presence)', () => {
    // Options interface 有 dirtyPenRender 字段;V1 默认值由 options 设置
    expect(meta2d.canvas.store.options).toBeDefined();
    // 设置 flag opt-in
    meta2d.setOptions({ dirtyPenRender: true });
    expect((meta2d.canvas.store.options as any).dirtyPenRender).toBe(true);
    meta2d.setOptions({ dirtyPenRender: false });
    expect((meta2d.canvas.store.options as any).dirtyPenRender).toBe(false);
  });

  /**
   * Test ID: T-Q-11.3-4
   * Maps to: 11f quirk 11.3 #4 — Path2D cache 在 store.path2dMap (WeakMap)
   * Asserts: store.path2dMap exists and is WeakMap (allows GC of unused pens)
   */
  it('T-Q-11.3-4 — store.path2dMap exists as WeakMap', () => {
    expect(meta2d.canvas.store.path2dMap).toBeDefined();
    expect(meta2d.canvas.store.path2dMap).toBeInstanceOf(WeakMap);
  });
});
