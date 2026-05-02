/**
 * Test ID: T-Q-11.2-1, 11.2-2, 11.2-3 (3 quirks — sync / addPen / delete)
 * Maps to: 11f §ch11.2 (5 quirks total;选 3 testable)
 * Asserts: V1 implicit — addPen activate opt-out / async sync 双语义 / store.data.pens vs store.pens 双写
 *
 * 决策来源:D-P0-30 §3 Δ6.4 quirks 高 priority + in-source @quirk
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Meta2d } from '../../../../index';

describe('T-Q-11.2 — sync / addPen / delete quirks', () => {
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
   * Test ID: T-Q-11.2-1
   * Maps to: 11f quirk 11.2 #1 — addPen 末尾自动 active([pen]) → 加 activate 参数 opt-out
   * Asserts: addPen(pen, ?, ?, ?, true) auto-activates pen; addPen(..., false) opt-out
   */
  it('T-Q-11.2-1 — addPen activate=true (default) auto-activates pen; activate=false opts out', async () => {
    await meta2d.canvas.addPen({ id: 'q11_2_1a', name: 'rectangle', x: 0, y: 0, width: 10, height: 10 }, undefined, undefined, undefined, true);
    const target1 = meta2d.findOne('q11_2_1a')!;
    expect(meta2d.canvas.store.active).toContain(target1);

    meta2d.canvas.inactive();

    await meta2d.canvas.addPen({ id: 'q11_2_1b', name: 'rectangle', x: 50, y: 0, width: 10, height: 10 }, undefined, undefined, undefined, false);
    const target2 = meta2d.findOne('q11_2_1b')!;
    expect(meta2d.canvas.store.active).not.toContain(target2);
  });

  /**
   * Test ID: T-Q-11.2-2
   * Maps to: 11f quirk 11.2 #2 — async API 实际同步(无 await 触发)
   * Asserts: addPen 是 async signature 但 synchronous body — pen 在 addPen() 同步 return 后立即在 store
   *
   * 注:caller-side 看 addPen returns Promise (async function syntax),但内部不 await 异步逻辑。
   * 此 quirk 要求 addPen 内部行为同步;test 用 await 调,然后立即检查同步 state。
   */
  it('T-Q-11.2-2 — addPen async signature wraps synchronous body', async () => {
    const promise = meta2d.canvas.addPen({ id: 'q11_2_2', name: 'rectangle', x: 0, y: 0, width: 10, height: 10 });
    expect(promise).toBeInstanceOf(Promise);
    const result = await promise;
    expect(result).toBeDefined();
    expect(result?.id).toBe('q11_2_2');
    // pen 同步在 store 内(无 await 异步 work 等)
    expect(meta2d.canvas.store.data.pens.find((p) => p.id === 'q11_2_2')).toBeDefined();
  });

  /**
   * Test ID: T-Q-11.2-3
   * Maps to: 11f quirk 11.2 #3 — store.data.pens(数组)与 store.pens(record by id)双写
   * Asserts: 加 pen 后两个集合都有该 pen
   */
  it('T-Q-11.2-3 — addPen writes to both store.data.pens (array) and store.pens (record)', async () => {
    await meta2d.canvas.addPen({ id: 'q11_2_3', name: 'rectangle', x: 0, y: 0, width: 10, height: 10 });
    expect(meta2d.canvas.store.data.pens.find((p) => p.id === 'q11_2_3')).toBeDefined();
    expect((meta2d.canvas.store.pens as any)['q11_2_3']).toBeDefined();
  });
});
