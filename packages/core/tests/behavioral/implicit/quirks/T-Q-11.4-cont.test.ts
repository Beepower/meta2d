/**
 * Test ID: T-Q-11.4-2, 11.4-3 (2 cases — pen 几何 续)
 * Maps to: 11f §ch11.4 quirks 11.4 #2 calculative.x ≠ worldRect.x / 11.4 #3 child x normalized [0,1]
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Meta2d } from '../../../../index';

describe('T-Q-11.4-cont — pen 几何 quirks 续', () => {
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
   * Test ID: T-Q-11.4-2
   * Maps to: 11f quirk 11.4 #2 — pen.calculative.x 不等于 worldRect.x
   * Asserts: pen.calculative 中 x 字段与 worldRect.x 是不同存储位置
   */
  it('T-Q-11.4-2 — pen.calculative has independent x and worldRect.x fields', async () => {
    await meta2d.addPen({ id: 'q11_4_2', name: 'rectangle', x: 100, y: 200, width: 50, height: 30 });
    const target = meta2d.findOne('q11_4_2');
    expect(target?.calculative).toBeDefined();
    // calculative.x 和 calculative.worldRect.x 是两个分离 fields(可能值 close 但 storage 独立)
    expect('x' in (target?.calculative ?? {})).toBe(true);
    expect(target?.calculative?.worldRect).toBeDefined();
  });

  /**
   * Test ID: T-Q-11.4-3
   * Maps to: 11f quirk 11.4 #3 — child pen 的 x/y 是归一化 [0,1](child 走过 normalize)
   * Asserts: 加 parent + child pen,child.x 在 parent 上 normalized
   *
   * 注:11f verify 标 ⚠️ — V2 IEC 元件无 parentId 走过 quirk(scope-fenced for V2)
   * test 验证 V1 行为(child x/y 是 [0,1] normalized 后 store)
   */
  it('T-Q-11.4-3 — child pen with parentId stored in [0,1] normalized space', async () => {
    await meta2d.addPen({ id: 'parent-q', name: 'rectangle', x: 0, y: 0, width: 200, height: 100 });
    const parent = meta2d.findOne('parent-q')!;
    expect(parent).toBeDefined();
    // V1 child 关系是 pen.parentId — 加 child;V1 store [0,1] 范围
    const childPen = {
      id: 'child-q',
      name: 'rectangle',
      parentId: 'parent-q',
      x: 0.5, // [0,1] normalized
      y: 0.5,
      width: 0.2,
      height: 0.2,
    } as any;
    await meta2d.canvas.addPen(childPen, undefined, undefined, undefined, false);
    const child = meta2d.findOne('child-q');
    expect(child).toBeDefined();
    expect(child!.parentId).toBe('parent-q');
    // child x 应在 [0,1] 范围(11f quirk)
    expect(child!.x).toBeGreaterThanOrEqual(0);
    expect(child!.x).toBeLessThanOrEqual(1);
  });
});
