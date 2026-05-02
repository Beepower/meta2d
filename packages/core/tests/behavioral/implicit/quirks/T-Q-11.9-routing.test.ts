/**
 * Test ID: T-Q-11.9-1, 11.9-2 (2 cases — routing)
 * Maps to: 11f §ch11.9 quirks 11.9 #1 computeMidPoints 同向反向公式 / 11.9 #2 routing leg 穿源 pen body
 *
 * 注:11.9 routing quirks 是 V1 古老 routing path 行为(V2 自实现 OrthogonalRouter 不依赖)。
 * V1 端只能 verify routing helper 函数存在 + connection pen 能 add(routing 实际计算路径不直接测渲染)
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Meta2d } from '../../../../index';

describe('T-Q-11.9 — routing quirks', () => {
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
   * Test ID: T-Q-11.9-1
   * Maps to: 11f quirk 11.9 #1 — computeMidPoints 同向 vs 反向用同一公式 → leg 穿源 pen body
   * Asserts: line type pen 可创建 + anchors 字段存在(routing 路径 V2 自实现,V1 base routing helper available)
   */
  it('T-Q-11.9-1 — line pen creation with anchors (V1 routing base)', async () => {
    await meta2d.addPen({
      id: 'q11_9_1',
      name: 'line',
      type: 1, // line type
      x: 0, y: 0, width: 100, height: 0,
      anchors: [
        { id: 'start', x: 0, y: 0 },
        { id: 'end', x: 1, y: 0 },
      ],
    } as any);
    const target = meta2d.findOne('q11_9_1');
    expect(target).toBeDefined();
    expect((target as any)?.anchors).toBeDefined();
  });

  /**
   * Test ID: T-Q-11.9-2
   * Maps to: 11f quirk 11.9 #2 — V1 routing leg 穿源 pen body(V2 OrthogonalRouter 修)
   * Asserts: V1 base — line type pen + lineName field 存在(routing 类型支持)
   */
  it('T-Q-11.9-2 — line pen lineName field controls routing type', async () => {
    await meta2d.addPen({
      id: 'q11_9_2',
      name: 'line',
      type: 1,
      lineName: 'polyline',
      x: 0, y: 0, width: 100, height: 100,
      anchors: [
        { id: 'a', x: 0, y: 0 },
        { id: 'b', x: 1, y: 1 },
      ],
    } as any);
    const target = meta2d.findOne('q11_9_2');
    expect(target?.lineName).toBe('polyline');
  });
});
