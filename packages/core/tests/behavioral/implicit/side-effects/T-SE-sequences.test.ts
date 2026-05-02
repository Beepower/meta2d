/**
 * Test ID: T-SE-001..T-SE-005 (5 cases — side-effects sequences)
 * Maps to: 11f §4.3.4 Side-effects 5 序列
 *
 * 注:T-BD-015 已 cover §4.3.4 inactive→active emit order;Δ7.2 cover 剩余 4 序列(syncFullModel / addPen / history push / 等)+ 1 verify
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Meta2d } from '../../../../index';

describe('T-SE-side-effects — V1 关键副作用顺序', () => {
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
   * Test ID: T-SE-001
   * Maps to: 11f §4.3.4 syncFullModel 副作用序列 (V2-side adapter pattern,非 V1 method)
   * Asserts: V1 base — store.data.pens 数组可被外部直接 mutation(V2 syncFullModel 走此路径);store ref 稳定
   *
   * 注:11f §4.3.4 syncFullModel 是 V2 adapter 在 canvas 之上的 sequence,不是 V1 method。
   * V1 base 行为:store.data.pens 引用稳定,可被 V2 端 mutation;test verify V1 base 假设。
   * V2 端的 syncFullModel test 在 V2 仓库做(与 D-P0-32 §3 对应 — V2 method 不在 V1 测试套件)
   */
  it('T-SE-001 — V1 base store.data.pens reference is stable + mutable (V2 syncFullModel adapter base)', async () => {
    const initialPens = meta2d.canvas.store.data.pens;
    expect(Array.isArray(initialPens)).toBe(true);

    await meta2d.addPen({ id: 'se1', name: 'rectangle', x: 0, y: 0, width: 10, height: 10 });
    // store.data.pens reference 稳定(同 array,不是新建数组)— V2 syncFullModel 依赖此假设
    expect(meta2d.canvas.store.data.pens).toBe(initialPens);
    // 但内容已 mutation
    expect(initialPens.find((p) => p.id === 'se1')).toBeDefined();
  });

  /**
   * Test ID: T-SE-002
   * Maps to: 11f §4.3.4 addPen 副作用序列 — addPen 触发 (a) push to store.data.pens (b) emit 'add' (c) auto active(activate=true)
   * Asserts: addPen 副作用 (a)(b)(c) 可观察
   */
  it('T-SE-002 — addPen side-effects sequence: push to store + emit add + auto active', async () => {
    const addHandler = vi.fn();
    meta2d.on('add' as any, addHandler);

    await meta2d.addPen({ id: 'se2', name: 'rectangle', x: 0, y: 0, width: 10, height: 10 });

    // (a) push to store.data.pens
    expect(meta2d.canvas.store.data.pens.find((p) => p.id === 'se2')).toBeDefined();
    // (b) emit 'add'
    expect(addHandler).toHaveBeenCalled();
    // (c) auto active (activate=true 默认)
    const target = meta2d.findOne('se2');
    expect(meta2d.canvas.store.active).toContain(target);
  });

  /**
   * Test ID: T-SE-003
   * Maps to: 11f §4.3.4 history push 条件 — store.data.locked === true 时不推 history
   * Asserts: lock 状态阻止 history push (与 T-H-005 互补 — 此处验证 store.data.locked detector path)
   */
  it('T-SE-003 — locked store blocks side-effect history push', async () => {
    (meta2d.canvas.store.data as any).locked = 1;
    const lenBefore = meta2d.canvas.store.histories?.length ?? 0;
    try {
      await meta2d.addPen({ id: 'se3', name: 'rectangle', x: 0, y: 0, width: 10, height: 10 }, true);
    } catch {}
    const lenAfter = meta2d.canvas.store.histories?.length ?? 0;
    expect(lenAfter).toBe(lenBefore);
    (meta2d.canvas.store.data as any).locked = 0;
  });

  /**
   * Test ID: T-SE-004
   * Maps to: 11f §4.3.4 inactive() 后 store.activeRect undefined / sizeCPs undefined / activeAnchor undefined
   * Asserts: inactive() 副作用 — 多个 ancillary 字段同时清零
   */
  it('T-SE-004 — inactive() side-effects: clears activeRect / sizeCPs / activeAnchor', async () => {
    await meta2d.addPen({ id: 'se4', name: 'rectangle', x: 0, y: 0, width: 50, height: 50 });
    const target = meta2d.findOne('se4')!;
    meta2d.canvas.active([target]);
    expect(meta2d.canvas.store.active!.length).toBe(1);

    meta2d.canvas.inactive();

    expect(meta2d.canvas.store.active!.length).toBe(0);
    expect((meta2d.canvas as any).activeRect).toBeUndefined();
    expect((meta2d.canvas as any).sizeCPs).toBeUndefined();
    expect(meta2d.canvas.store.activeAnchor).toBeUndefined();
  });

  /**
   * Test ID: T-SE-005
   * Maps to: 11f §4.3.4 active() 副作用 — 切换 active 时 patchFlags = true (dirty 触发)
   * Asserts: active 后 patchFlags 设 true (dirty 标记触发 render)
   */
  it('T-SE-005 — active() side-effect: patchFlags = true (dirty trigger)', async () => {
    await meta2d.addPen({ id: 'se5', name: 'rectangle', x: 0, y: 0, width: 50, height: 50 });
    const target = meta2d.findOne('se5')!;

    (meta2d.canvas as any).patchFlags = false; // reset
    meta2d.canvas.active([target]);
    expect((meta2d.canvas as any).patchFlags).toBe(true);
  });
});
