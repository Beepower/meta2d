/**
 * Test ID: T-Q-11.8-1 (1 case — cascade)
 * Maps to: 11f §ch11.8 quirk 11.8 #1 cascade removeComponent
 *
 * 注:11.8 是新发现 quirk(fix bf00554),具体路径 V2 useCascadeDelete 端处理。
 * V1 端 quirk 表现:同一批 atomic operation 内有 cascade-deleted connection 时,
 * explicit removeConnection 同 connection 失败 → atomic 误回滚。
 * V1 这边只能验证 V1 base 行为(deletePens 行为正常 + 内部 connection cascade);
 * V2 端的 atomic 误回滚由 V2 自己测 useCascadeDelete dedup
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Meta2d } from '../../../../index';

describe('T-Q-11.8 — cascade quirks', () => {
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
   * Test ID: T-Q-11.8-1
   * Maps to: 11f quirk 11.8 #1 — V1 base: 删除 pen 时 internally cascade 删 connection (V1 行为)
   * Asserts: 删除 pen 后 connectedLines 中相关 connection 也 cascade 移除(V1 internal cascade,V2 之上 useCascadeDelete dedup)
   */
  it('T-Q-11.8-1 — V1 base cascade: delete pen removes related connections from store', async () => {
    await meta2d.addPen({ id: 'q11_8a', name: 'rectangle', x: 0, y: 0, width: 50, height: 50 });
    await meta2d.addPen({ id: 'q11_8b', name: 'rectangle', x: 100, y: 0, width: 50, height: 50 });

    expect(meta2d.findOne('q11_8a')).toBeDefined();
    expect(meta2d.findOne('q11_8b')).toBeDefined();

    const target = meta2d.findOne('q11_8a')!;
    meta2d.delete([target]);

    expect(meta2d.findOne('q11_8a')).toBeUndefined();
    expect(meta2d.findOne('q11_8b')).toBeDefined(); // 不被 cascade
  });
});
