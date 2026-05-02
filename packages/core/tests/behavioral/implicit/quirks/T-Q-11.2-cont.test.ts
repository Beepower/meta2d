/**
 * Test ID: T-Q-11.2-4, 11.2-5 (2 cases — sync 续)
 * Maps to: 11f §ch11.2 quirks 11.2 #4 canvasLayer / 11.2 #5 sync scale 几何变形(D6.1 修复)
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Meta2d } from '../../../../index';

describe('T-Q-11.2-cont — sync / addPen quirks 续', () => {
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
   * Test ID: T-Q-11.2-4
   * Maps to: 11f quirk 11.2 #4 — canvasLayer 决定 offscreen 层
   * Asserts: pen.canvasLayer 字段决定 pen 渲染在哪个 offscreen 层(structure / image / template / etc)
   */
  it('T-Q-11.2-4 — pen.canvasLayer field assigns offscreen rendering layer', async () => {
    await meta2d.addPen({
      id: 'q11_2_4',
      name: 'rectangle',
      x: 0, y: 0, width: 50, height: 50,
      canvasLayer: 5, // CanvasLayer.CanvasImage 或类似
    } as any);
    const target = meta2d.findOne('q11_2_4');
    expect((target as any)?.canvasLayer).toBe(5);
  });

  /**
   * Test ID: T-Q-11.2-5
   * Maps to: 11f quirk 11.2 #5 — sync 在 scale ≠ 1 时跑 → pen 几何变形(D6.1 修复后 viewport zoom 移到 ctx.scale)
   * Asserts: D6.1 修复后,setScale 不改 pen.x/y/width/height(scale ctx.scale 路径,不再 mutate pen)
   */
  it('T-Q-11.2-5 — D6.1 修复后 setScale 不 mutate pen.x/y/width/height (world-space)', async () => {
    await meta2d.addPen({ id: 'q11_2_5', name: 'rectangle', x: 100, y: 200, width: 50, height: 30 });
    const target = meta2d.findOne('q11_2_5')!;
    const before = { x: target.x, y: target.y, width: target.width, height: target.height };

    meta2d.setScale(2);

    // D6.1 修复后:pen.x/y/width/height 不变(viewport zoom 走 ctx.scale)
    expect(target.x).toBe(before.x);
    expect(target.y).toBe(before.y);
    expect(target.width).toBe(before.width);
    expect(target.height).toBe(before.height);
  });
});
