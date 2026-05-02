/**
 * Test ID: T-A-014..T-A-016 (3 cases — render + batch)
 * Maps to: 11a canvas A class facade 主头(render / beginBatch / endBatch)
 * Asserts: V1 render request + batch transaction primitive on canvas
 *
 * 决策来源:D-P0-30 §3 Δ6.2 hybrid 高 ROI A class facade 主头
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Meta2d } from '../../../../index';

describe('T-A-render — canvas render + batch API contract', () => {
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
   * Test ID: T-A-014
   * Maps to: 11a C049 canvas.render (property arrow function)
   * Asserts: render() invocation does not throw (canvas-mock provides 2D context stubs)
   */
  it('T-A-014 — canvas.render request does not throw', () => {
    expect(() => {
      meta2d.canvas.render();
    }).not.toThrow();
  });

  /**
   * Test ID: T-A-015
   * Maps to: 11a C050 canvas.beginBatch (property arrow function)
   * Asserts: beginBatch() can be called repeatedly without throwing (semantic = transaction primitive)
   */
  it('T-A-015 — canvas.beginBatch entrypoint does not throw', () => {
    expect(() => {
      meta2d.canvas.beginBatch();
      meta2d.canvas.beginBatch();
    }).not.toThrow();
  });

  /**
   * Test ID: T-A-016
   * Maps to: 11a C051 canvas.endBatch (property arrow function)
   * Asserts: endBatch() pairs with beginBatch + does not throw
   */
  it('T-A-016 — canvas.endBatch transaction completion does not throw', () => {
    expect(() => {
      meta2d.canvas.beginBatch();
      meta2d.canvas.endBatch();
    }).not.toThrow();
  });
});
