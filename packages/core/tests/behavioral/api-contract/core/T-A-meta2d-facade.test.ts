/**
 * Test ID: T-A-017..T-A-024 (8 cases — Meta2d facade-delegate to canvas)
 * Maps to: 11b core.ts Meta2d facade methods that delegate to canvas (M2/M3/M7/M12/M13/M14/M20/M21)
 * Asserts: Meta2d facade routes correctly to canvas + state changes propagate
 *
 * 决策来源:D-P0-30 §3 Δ6.3 hybrid 高 ROI Meta2d facade
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Meta2d } from '../../../../index';
import type { Pen } from '../../../../src/pen/model';

describe('T-A-meta2d-facade — Meta2d facade-delegate API contract', () => {
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
   * Test ID: T-A-017
   * Maps to: 11b M2 Meta2d.addPen → canvas.addPen
   * Asserts: facade-delegate adds pen via canvas; observable in store.data.pens
   */
  it('T-A-017 — Meta2d.addPen facade-delegates to canvas.addPen', async () => {
    const pen: Pen = { id: 'fp1', name: 'rectangle', x: 10, y: 10, width: 50, height: 50 };
    const result = await meta2d.addPen(pen);
    expect(result).toBeDefined();
    expect(result?.id).toBe('fp1');
    expect(meta2d.canvas.store.data.pens.find((p) => p.id === 'fp1')).toBeDefined();
  });

  /**
   * Test ID: T-A-018
   * Maps to: 11b M3 Meta2d.render → canvas.render
   * Asserts: facade render does not throw (canvas-mock provides 2D context stubs)
   */
  it('T-A-018 — Meta2d.render facade-delegates without throwing', () => {
    expect(() => {
      meta2d.render();
    }).not.toThrow();
  });

  /**
   * Test ID: T-A-019
   * Maps to: 11b M7 Meta2d.findOne → canvas.findOne
   * Asserts: facade findOne returns Pen or undefined (V1 returns undefined for no match)
   */
  it('T-A-019 — Meta2d.findOne facade-delegates and returns matching pen', async () => {
    await meta2d.addPen({ id: 'fp2', name: 'rectangle', x: 0, y: 0, width: 10, height: 10 });
    const result = meta2d.findOne('fp2');
    expect(result).toBeDefined();
    expect(result?.id).toBe('fp2');
    const noMatch = meta2d.findOne('nonexistent');
    expect(noMatch).toBeUndefined();
  });

  /**
   * Test ID: T-A-020
   * Maps to: 11b M12 Meta2d.delete → canvas.delete
   * Asserts: facade delete removes pen from store
   */
  it('T-A-020 — Meta2d.delete facade-delegates to remove pen', async () => {
    await meta2d.addPen({ id: 'fp3', name: 'rectangle', x: 0, y: 0, width: 10, height: 10 });
    const target = meta2d.findOne('fp3');
    expect(target).toBeDefined();
    meta2d.delete([target!]);
    expect(meta2d.findOne('fp3')).toBeUndefined();
  });

  /**
   * Test ID: T-A-021
   * Maps to: 11b M13 Meta2d.setViewport → canvas.setViewport
   * Asserts: facade setViewport propagates to store.data.scale
   */
  it('T-A-021 — Meta2d.setViewport facade-delegates and updates scale', () => {
    meta2d.setViewport({ x: 50, y: 100, zoom: 1.5 });
    expect(meta2d.canvas.store.data.scale).toBeCloseTo(1.5);
  });

  /**
   * Test ID: T-A-022
   * Maps to: 11b M14 Meta2d.setScale → canvas.setScale
   * Asserts: facade setScale propagates
   */
  it('T-A-022 — Meta2d.setScale facade-delegates', () => {
    meta2d.setScale(2);
    expect(meta2d.canvas.store.data.scale).toBeCloseTo(2);
  });

  /**
   * Test ID: T-A-023
   * Maps to: 11b M20 Meta2d.gotoView (signature: gotoView(pen: Pen) — different from canvas.gotoView(x, y))
   * Asserts: facade gotoView(pen) navigates to pen rect; does not throw with valid pen
   */
  it('T-A-023 — Meta2d.gotoView with valid pen does not throw', async () => {
    await meta2d.addPen({ id: 'fp4', name: 'rectangle', x: 100, y: 100, width: 100, height: 100 });
    const target = meta2d.findOne('fp4')!;
    expect(() => {
      meta2d.gotoView(target);
    }).not.toThrow();
  });

  /**
   * Test ID: T-A-024
   * Maps to: 11b M21 Meta2d.destroy → canvas.destroy
   * Asserts: facade destroy cleanup completes
   */
  it('T-A-024 — Meta2d.destroy facade cleanup completes', () => {
    const localContainer = document.createElement('div');
    Object.defineProperty(localContainer, 'clientWidth', { value: 800, configurable: true });
    Object.defineProperty(localContainer, 'clientHeight', { value: 600, configurable: true });
    document.body.appendChild(localContainer);
    const localMeta2d = new Meta2d(localContainer);
    expect(() => {
      localMeta2d.destroy();
    }).not.toThrow();
  });
});
