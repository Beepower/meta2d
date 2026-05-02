/**
 * Test ID: T-Q-11.6-1, 11.6-2 (2 quirks — selection / active)
 * Maps to: 11f §ch11.6 Selection / Active (3 quirks total — 11.6 #3 已在 T-BD-015 测过)
 * Asserts: V1 implicit — store.active 浅引用 / inactive 路径多 不全发(in-source @quirk ch11.6 #2)
 *
 * 决策来源:D-P0-30 §3 Δ6.4 quirks 高 priority + in-source @quirk
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Meta2d } from '../../../../index';

describe('T-Q-11.6 — selection / active quirks', () => {
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
   * Test ID: T-Q-11.6-1
   * Maps to: 11f quirk 11.6 #1 — store.active 浅引用 store.data.pens 内对象
   * Asserts: active(pens) 后 store.active 与 store.data.pens 共享对象引用(不是 deep clone)
   */
  it('T-Q-11.6-1 — store.active holds shallow reference to store.data.pens objects', async () => {
    await meta2d.canvas.addPen({ id: 'q11_6_1', name: 'rectangle', x: 0, y: 0, width: 10, height: 10 });
    const targetInData = meta2d.canvas.store.data.pens.find((p) => p.id === 'q11_6_1')!;
    meta2d.canvas.active([targetInData]);
    const targetInActive = meta2d.canvas.store.active!.find((p) => p.id === 'q11_6_1')!;
    expect(targetInActive).toBe(targetInData); // 同 reference (shallow)
  });

  /**
   * Test ID: T-Q-11.6-2
   * Maps to: 11f quirk 11.6 #2 (in-source @quirk ch11.6 #2 canvas.ts:3296) — inactive(drawing?) 路径多 不全发 'inactive' event
   * Asserts: inactive(true) 静默路径(drawing=true 时不 emit 'inactive');inactive() 默认 emit
   */
  it('T-Q-11.6-2 — inactive(drawing=true) silent path; inactive() default emits', async () => {
    await meta2d.canvas.addPen({ id: 'q11_6_2', name: 'rectangle', x: 0, y: 0, width: 10, height: 10 });
    const target = meta2d.findOne('q11_6_2')!;

    // 路径 1:inactive(true) drawing flag → 静默 (不 emit)
    meta2d.canvas.active([target]);
    const handler1 = vi.fn();
    meta2d.on('inactive' as any, handler1);
    meta2d.canvas.inactive(true);
    expect(handler1).not.toHaveBeenCalled(); // drawing=true 时静默

    // 路径 2:inactive() default → emit
    meta2d.canvas.active([target]);
    const handler2 = vi.fn();
    meta2d.on('inactive' as any, handler2);
    meta2d.canvas.inactive();
    expect(handler2).toHaveBeenCalled(); // default emit
  });
});
