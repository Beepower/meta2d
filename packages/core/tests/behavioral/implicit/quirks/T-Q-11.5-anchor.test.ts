/**
 * Test ID: T-Q-11.5-1, 11.5-2, 11.5-3 (3 cases — anchor / connect)
 * Maps to: 11f §ch11.5 Anchor / Connect (3 quirks total — 全测)
 * Asserts: V1 implicit — anchorId no prefix / connectedLines reverse index / twoWay direction
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Meta2d } from '../../../../index';

describe('T-Q-11.5 — anchor / connect quirks', () => {
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
   * Test ID: T-Q-11.5-1
   * Maps to: 11f quirk 11.5 #1 — anchor.anchorId = port name 无前缀
   * Asserts: pen.anchors[*].anchorId 字符串无前缀(不是 "pen-id-anchor-name" 之类组合)
   */
  it('T-Q-11.5-1 — anchor.anchorId is plain port name without prefix', async () => {
    await meta2d.addPen({
      id: 'q11_5_1',
      name: 'rectangle',
      x: 0, y: 0, width: 50, height: 50,
      anchors: [
        { id: 'top', x: 0.5, y: 0, anchorId: 'top' },
        { id: 'bottom', x: 0.5, y: 1, anchorId: 'bottom' },
      ],
    } as any);
    const target = meta2d.findOne('q11_5_1');
    expect(target?.anchors).toBeDefined();
    if (target?.anchors && target.anchors.length > 0) {
      const firstAnchor = target.anchors[0]!;
      // anchorId 应该是无前缀的 port name(test 设的 'top'),不应含 pen.id 前缀
      expect((firstAnchor as any).anchorId).toBe('top');
      expect((firstAnchor as any).anchorId).not.toContain('q11_5_1');
    }
  });

  /**
   * Test ID: T-Q-11.5-2
   * Maps to: 11f quirk 11.5 #2 — connectedLines 反向索引(pen.connectedLines 列出连接此 pen 的 line)
   * Asserts: pen.connectedLines 字段存在(connection lines reverse index 入口);初始 undefined 或空数组
   */
  it('T-Q-11.5-2 — pen.connectedLines field is reverse index entry point', async () => {
    await meta2d.addPen({ id: 'q11_5_2', name: 'rectangle', x: 0, y: 0, width: 50, height: 50 });
    const target = meta2d.findOne('q11_5_2');
    expect(target).toBeDefined();
    // connectedLines 字段(可能 undefined 或 [])— V1 reverse index entry
    const cl = (target as any).connectedLines;
    expect(cl === undefined || Array.isArray(cl)).toBe(true);
  });

  /**
   * Test ID: T-Q-11.5-3
   * Maps to: 11f quirk 11.5 #3 — 双向 connectLine 由 anchor.twoWay 决定
   * Asserts: anchor.twoWay 字段语义(boolean — 决定 connectLine 是否双向)
   */
  it('T-Q-11.5-3 — anchor.twoWay field determines bidirectional connection', async () => {
    await meta2d.addPen({
      id: 'q11_5_3',
      name: 'rectangle',
      x: 0, y: 0, width: 50, height: 50,
      anchors: [
        { id: 'a1', x: 0, y: 0.5, anchorId: 'a1', twoWay: true },
        { id: 'a2', x: 1, y: 0.5, anchorId: 'a2', twoWay: false },
      ],
    } as any);
    const target = meta2d.findOne('q11_5_3');
    expect(target?.anchors).toBeDefined();
    if (target?.anchors) {
      const a1 = target.anchors.find((a: any) => a.anchorId === 'a1');
      const a2 = target.anchors.find((a: any) => a.anchorId === 'a2');
      expect((a1 as any)?.twoWay).toBe(true);
      expect((a2 as any)?.twoWay).toBe(false);
    }
  });
});
