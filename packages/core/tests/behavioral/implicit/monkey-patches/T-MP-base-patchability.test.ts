/**
 * Test ID: T-MP-001..T-MP-004 (4 cases — monkey-patch base patchability)
 * Maps to: 11f §4.3.5 V2 monkey-patches MP-01..MP-04
 * Asserts: V1 method 是 patchable(V2 端 installUxPatches.ts 替换前后行为可控)
 *
 * 决策来源:D-P0-30 §3 Δ6.6 + D-P0-09 monkey-patch 必测
 *
 * 注:本套件在 ../meta2d.js V1 仓库,不 import V2 patcher;只测 V1 base 行为 + patchability。
 * V2 patcher 行为 test 在 V2 仓库(V2 自己的 vitest)做,引用本套件的 base assertion 作为 safety net。
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Meta2d } from '../../../../index';
import type { Pen } from '../../../../src/pen/model';

describe('T-MP-base — V1 method patchability for V2 monkey-patches', () => {
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
   * Test ID: T-MP-001
   * Maps to: 11f §4.3.5 MP-01 — canvas.active wrap pattern
   * Asserts: canvas.active 可被 V2 wrap(orig.apply 仍能调用 base 行为)
   */
  it('T-MP-001 — canvas.active wrap pattern preserves base behavior', async () => {
    await meta2d.addPen({ id: 'mp1', name: 'rectangle', x: 0, y: 0, width: 10, height: 10 });
    const target = meta2d.findOne('mp1')!;

    // V2 wrap pattern: bind orig, replace with wrap
    const orig = meta2d.canvas.active.bind(meta2d.canvas);
    let wrapPreCalled = false;
    let wrapPostCalled = false;
    (meta2d.canvas as any).active = function (pens: Pen[], emit = true) {
      wrapPreCalled = true;
      orig(pens, emit);
      wrapPostCalled = true;
    };

    meta2d.canvas.active([target]);

    expect(wrapPreCalled).toBe(true);
    expect(wrapPostCalled).toBe(true);
    expect(meta2d.canvas.store.active).toContain(target); // base 行为保留
  });

  /**
   * Test ID: T-MP-002
   * Maps to: 11f §4.3.5 MP-02 — canvas.initMovingPens wrap pattern
   * Asserts: canvas.initMovingPens 是 method (assignable) + 可 wrap
   */
  it('T-MP-002 — canvas.initMovingPens is assignable for V2 wrap', () => {
    expect(typeof meta2d.canvas.initMovingPens).toBe('function');

    // V2 wrap pattern (initMovingPens 接 mouse Point 参数,test 不真调用,只测 patchable)
    const orig = meta2d.canvas.initMovingPens;
    let wrapped = false;
    (meta2d.canvas as any).initMovingPens = function (...args: any[]) {
      wrapped = true;
      return orig.apply(meta2d.canvas, args);
    };
    expect((meta2d.canvas as any).initMovingPens).not.toBe(orig);

    // 可恢复
    (meta2d.canvas as any).initMovingPens = orig;
    expect(meta2d.canvas.initMovingPens).toBe(orig);
    expect(wrapped).toBe(false); // 不调用,只 verify assignable
  });

  /**
   * Test ID: T-MP-003
   * Maps to: 11f §4.3.5 MP-03 — canvas.render wrap + short-circuit pattern
   * Asserts: canvas.render 可被 wrap + short-circuit pattern(wrap 决定是否调 orig)
   */
  it('T-MP-003 — canvas.render wrap + short-circuit pattern', () => {
    const orig = meta2d.canvas.render;
    let origCalled = false;
    let shortCircuit = false;

    (meta2d.canvas as any).render = function (this: any, ...args: any[]) {
      if (shortCircuit) {
        return; // short-circuit 不调 orig
      }
      origCalled = true;
      return orig.apply(this, args);
    };

    // 路径 1:wrap + 调 orig
    meta2d.canvas.render();
    expect(origCalled).toBe(true);

    // 路径 2:wrap + short-circuit
    origCalled = false;
    shortCircuit = true;
    meta2d.canvas.render();
    expect(origCalled).toBe(false); // short-circuited
  });

  /**
   * Test ID: T-MP-004
   * Maps to: 11f §4.3.5 MP-04 — canvas.customMoveDock 是 hook field assignment(D-P0-09 注:**非 monkey-patch**)
   * Asserts: canvas.customMoveDock 是 settable field(初始 undefined,可 assign function)
   */
  it('T-MP-004 — canvas.customMoveDock is hook field assignment (not monkey-patch)', () => {
    // 初始 undefined(无 default hook)
    expect(meta2d.canvas.customMoveDock).toBeUndefined();

    // V2 端 assign hook function
    const hookFn = (rect: any, pens: Pen[]) => {
      void rect;
      void pens;
    };
    meta2d.canvas.customMoveDock = hookFn;
    expect(meta2d.canvas.customMoveDock).toBe(hookFn);

    // 可 unassign
    (meta2d.canvas as any).customMoveDock = undefined;
    expect(meta2d.canvas.customMoveDock).toBeUndefined();
  });
});
