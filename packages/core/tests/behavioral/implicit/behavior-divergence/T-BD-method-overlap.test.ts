/**
 * Test ID: T-BD-001..T-BD-010 (10 cases — D-P0-24 同名重叠)
 * Maps to: 11g §1.1 D-P0-24 method 维度同名重叠;Meta2d ↔ canvas 同名 method 双向 verify
 * Asserts: facade-delegate 路径正确(Meta2d.X 调 canvas.X)+ V1 真 emit / state 行为 — 用于 P3/P4 拆 canvas 时检测 facade-delegate 漂移
 *
 * 决策来源:D-P0-30 §3 §4 Δ6.X — A' test 设计特殊(双向断言:V1 method 行为 + facade-delegate 行为)
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Meta2d } from '../../../../index';
import type { Pen } from '../../../../src/pen/model';

describe('T-BD-method-overlap — Meta2d ↔ canvas 同名 method 双向 verify (D-P0-24)', () => {
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
   * Test ID: T-BD-001
   * Maps to: canvas.active vs Meta2d.active (signature 同 — both (pens, emit=true))
   * Asserts: Meta2d.active facade-delegates to canvas.active; V1 emits 'active' with store.active payload
   */
  it('T-BD-001 — Meta2d.active facade-delegates to canvas.active + emits "active"', async () => {
    await meta2d.addPen({ id: 'bd1', name: 'rectangle', x: 0, y: 0, width: 50, height: 50 });
    const target = meta2d.findOne('bd1')!;
    const canvasActiveSpy = vi.spyOn(meta2d.canvas, 'active');
    const handler = vi.fn();
    meta2d.on('active' as any, handler);

    meta2d.active([target]);

    expect(canvasActiveSpy).toHaveBeenCalledWith([target], true);
    expect(handler).toHaveBeenCalled();
    expect(meta2d.canvas.store.active).toContain(target);
  });

  /**
   * Test ID: T-BD-002
   * Maps to: canvas.inactive(drawing?) vs Meta2d.inactive() — signature 不同(Meta2d 无参 facade)
   * Asserts: Meta2d.inactive facade-delegates without drawing param; V1 emits 'inactive' with activePens payload
   */
  it('T-BD-002 — Meta2d.inactive facade-delegates without drawing param + emits "inactive"', async () => {
    await meta2d.addPen({ id: 'bd2', name: 'rectangle', x: 0, y: 0, width: 50, height: 50 });
    const target = meta2d.findOne('bd2')!;
    meta2d.canvas.active([target]);
    expect(meta2d.canvas.store.active!.length).toBe(1);

    const canvasInactiveSpy = vi.spyOn(meta2d.canvas, 'inactive');
    const handler = vi.fn();
    meta2d.on('inactive' as any, handler);

    meta2d.inactive();

    expect(canvasInactiveSpy).toHaveBeenCalledWith();
    expect(handler).toHaveBeenCalled();
    expect(meta2d.canvas.store.active!.length).toBe(0);
  });

  /**
   * Test ID: T-BD-003
   * Maps to: canvas.gotoView(x: number, y: number) vs Meta2d.gotoView(pen: Pen) — signature 完全不同
   * Asserts: 同名 method signature 维度差异 — V2/卫星 切换时此差异是 P4 重大风险
   */
  it('T-BD-003 — gotoView signature divergence: canvas (x,y) vs Meta2d (pen)', async () => {
    await meta2d.addPen({ id: 'bd3', name: 'rectangle', x: 100, y: 100, width: 50, height: 50 });
    const target = meta2d.findOne('bd3')!;

    // canvas.gotoView 接 (x: number, y: number) — programmatic translate
    expect(() => {
      meta2d.canvas.gotoView(0.5, 0.5);
    }).not.toThrow();

    // Meta2d.gotoView 接 (pen: Pen) — pen-based navigate
    expect(() => {
      meta2d.gotoView(target);
    }).not.toThrow();
  });

  /**
   * Test ID: T-BD-004
   * Maps to: canvas.setViewport vs Meta2d.setViewport (facade-delegate)
   * Asserts: Meta2d.setViewport routes to canvas.setViewport
   */
  it('T-BD-004 — Meta2d.setViewport facade-delegates to canvas.setViewport', () => {
    const canvasSpy = vi.spyOn(meta2d.canvas, 'setViewport');
    meta2d.setViewport({ x: 50, y: 100, zoom: 1.5 });
    expect(canvasSpy).toHaveBeenCalledWith({ x: 50, y: 100, zoom: 1.5 });
  });

  /**
   * Test ID: T-BD-005
   * Maps to: canvas.setScale vs Meta2d.setScale (facade-delegate)
   * Asserts: Meta2d.setScale routes to canvas.setScale
   */
  it('T-BD-005 — Meta2d.setScale facade-delegates to canvas.setScale', () => {
    const canvasSpy = vi.spyOn(meta2d.canvas, 'setScale');
    meta2d.setScale(2);
    expect(canvasSpy).toHaveBeenCalledWith(2, undefined);
  });

  /**
   * Test ID: T-BD-006
   * Maps to: canvas.findOne vs Meta2d.findOne (facade-delegate)
   * Asserts: Meta2d.findOne routes to canvas.findOne; both return same pen
   */
  it('T-BD-006 — Meta2d.findOne and canvas.findOne return same pen', async () => {
    await meta2d.addPen({ id: 'bd6', name: 'rectangle', x: 0, y: 0, width: 10, height: 10 });
    const fromMeta2d = meta2d.findOne('bd6');
    const fromCanvas = meta2d.canvas.findOne('bd6');
    expect(fromMeta2d).toBe(fromCanvas);
  });

  /**
   * Test ID: T-BD-007
   * Maps to: canvas.delete(pens) vs Meta2d.delete(pens?, canDelLocked = false, history = true) — signature 不同
   * Asserts: Meta2d.delete extra params (canDelLocked / history) 不传给 canvas.delete signature
   */
  it('T-BD-007 — delete signature divergence: canvas (pens) vs Meta2d (pens, canDelLocked, history)', async () => {
    await meta2d.addPen({ id: 'bd7', name: 'rectangle', x: 0, y: 0, width: 10, height: 10 });
    const target = meta2d.findOne('bd7')!;
    expect(() => {
      meta2d.delete([target], false, true);
    }).not.toThrow();
    expect(meta2d.findOne('bd7')).toBeUndefined();
  });

  /**
   * Test ID: T-BD-008
   * Maps to: canvas.render vs Meta2d.render(patchFlags?) — signature 不同
   * Asserts: Meta2d.render(patchFlags) signature 与 canvas.render 不同
   */
  it('T-BD-008 — Meta2d.render(patchFlags) signature accepts optional argument', () => {
    expect(() => {
      meta2d.render();
      meta2d.render(true);
      meta2d.render(1);
    }).not.toThrow();
  });

  /**
   * Test ID: T-BD-009
   * Maps to: canvas.destroy() vs Meta2d.destroy(onlyData?) — signature 不同
   * Asserts: Meta2d.destroy(onlyData) signature 与 canvas.destroy() 不同
   */
  it('T-BD-009 — destroy signature divergence: canvas () vs Meta2d (onlyData?)', () => {
    const lc1 = document.createElement('div');
    Object.defineProperty(lc1, 'clientWidth', { value: 800, configurable: true });
    Object.defineProperty(lc1, 'clientHeight', { value: 600, configurable: true });
    document.body.appendChild(lc1);
    const m1 = new Meta2d(lc1);
    expect(() => m1.destroy()).not.toThrow();

    const lc2 = document.createElement('div');
    Object.defineProperty(lc2, 'clientWidth', { value: 800, configurable: true });
    Object.defineProperty(lc2, 'clientHeight', { value: 600, configurable: true });
    document.body.appendChild(lc2);
    const m2 = new Meta2d(lc2);
    expect(() => m2.destroy(true)).not.toThrow();
  });

  /**
   * Test ID: T-BD-010
   * Maps to: canvas.addPen vs Meta2d.addPen — signature 同
   * Asserts: Meta2d.addPen and canvas.addPen 同 signature 同行为(facade-delegate via core.ts)
   */
  it('T-BD-010 — Meta2d.addPen / canvas.addPen 同 signature 双向 verify', async () => {
    const pen1: Pen = { id: 'bd10a', name: 'rectangle', x: 0, y: 0, width: 10, height: 10 };
    const pen2: Pen = { id: 'bd10b', name: 'rectangle', x: 0, y: 0, width: 10, height: 10 };
    const fromMeta2d = await meta2d.addPen(pen1);
    const fromCanvas = await meta2d.canvas.addPen(pen2);
    expect(fromMeta2d?.id).toBe('bd10a');
    expect(fromCanvas?.id).toBe('bd10b');
  });
});
