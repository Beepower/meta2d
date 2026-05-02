/**
 * Test ID: T-BD-011..T-BD-015 (5 cases — emits A' 抽样)
 * Maps to: 11g §5 emits A' 22 条抽样 verify;V1 emit timing / payload — 用于 P3/P4 切换 surface 时 emit 行为 safety net
 * Asserts: V1 真 emit name + timing + payload(surface 设计 design-out 不一致点)
 *
 * 决策来源:D-P0-30 §3 Δ6.X — emits A' 抽样 4-5 条(本文件 5 条:add / delete / scale / translate / active timing)
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Meta2d } from '../../../../index';
import type { Pen } from '../../../../src/pen/model';

describe('T-BD-emits-divergence — V1 emit name/timing/payload (emits A\' 抽样)', () => {
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
   * Test ID: T-BD-011
   * Maps to: emit 'add' on addPen
   * Asserts: V1 emits 'add' event when pen added; surface design ≠ V1 (A')
   */
  it('T-BD-011 — addPen emits "add" event', async () => {
    const handler = vi.fn();
    meta2d.on('add' as any, handler);
    await meta2d.addPen({ id: 'em1', name: 'rectangle', x: 0, y: 0, width: 10, height: 10 });
    expect(handler).toHaveBeenCalled();
  });

  /**
   * Test ID: T-BD-012
   * Maps to: emit 'delete' on delete
   * Asserts: V1 emits 'delete' event when pen removed
   */
  it('T-BD-012 — delete emits "delete" event', async () => {
    await meta2d.addPen({ id: 'em2', name: 'rectangle', x: 0, y: 0, width: 10, height: 10 });
    const target = meta2d.findOne('em2')!;
    const handler = vi.fn();
    meta2d.on('delete' as any, handler);
    meta2d.delete([target]);
    expect(handler).toHaveBeenCalled();
  });

  /**
   * Test ID: T-BD-013
   * Maps to: emit 'scale' on setScale
   * Asserts: V1 emits 'scale' event when zoom changes
   */
  it('T-BD-013 — setScale emits "scale" event', () => {
    const handler = vi.fn();
    meta2d.on('scale' as any, handler);
    meta2d.setScale(1.5);
    expect(handler).toHaveBeenCalled();
  });

  /**
   * Test ID: T-BD-014
   * Maps to: emit 'translate' on setTranslate
   * Asserts: V1 emits 'translate' event when origin shifts
   */
  it('T-BD-014 — setTranslate emits "translate" event', () => {
    const handler = vi.fn();
    meta2d.on('translate' as any, handler);
    meta2d.setTranslate(50, 100);
    expect(handler).toHaveBeenCalled();
  });

  /**
   * Test ID: T-BD-015
   * Maps to: 11f quirk 11.6 #3 — active() 切换前先调 inactive() 统一发 'inactive' event
   * Asserts: 切换 active pens 时 V1 先 emit 'inactive' (clear old) 再 emit 'active' (set new)
   */
  it('T-BD-015 — active() 切换 emit order: "inactive" before "active"', async () => {
    await meta2d.addPen({ id: 'em5a', name: 'rectangle', x: 0, y: 0, width: 10, height: 10 });
    await meta2d.addPen({ id: 'em5b', name: 'rectangle', x: 50, y: 50, width: 10, height: 10 });
    const target1 = meta2d.findOne('em5a')!;
    const target2 = meta2d.findOne('em5b')!;

    meta2d.active([target1]); // first selection, no inactive emit yet

    const order: string[] = [];
    meta2d.on('inactive' as any, () => order.push('inactive'));
    meta2d.on('active' as any, () => order.push('active'));

    meta2d.active([target2]); // 切换 selection — V1 quirk 11.6 #3: 先 inactive 再 active

    expect(order).toEqual(['inactive', 'active']);
  });
});
