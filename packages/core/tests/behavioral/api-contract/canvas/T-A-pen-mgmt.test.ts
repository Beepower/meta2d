/**
 * Test ID: T-A-002..T-A-007 (6 cases — pen management)
 * Maps to: 11a canvas A class facade 主头(addPen / addPens / find / findOne / delete / setPenRect)
 * Asserts: V1 pen 增删查改 behavior on canvas
 *
 * 决策来源:D-P0-30 §3 Δ6.2 hybrid 高 ROI A class facade 主头
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Meta2d } from '../../../../index';
import type { Pen } from '../../../../src/pen/model';

describe('T-A-pen-mgmt — canvas pen management API contract', () => {
  let container: HTMLDivElement;
  let meta2d: Meta2d;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'meta2d-test-container';
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
   * Test ID: T-A-002
   * Maps to: 11a C010 canvas.addPen
   * Asserts: addPen(pen) async resolves to pen + store.data.pens 含 pen
   */
  it('T-A-002 — canvas.addPen async resolves and adds pen to store', async () => {
    const pen: Pen = { id: 'p1', name: 'rectangle', x: 100, y: 100, width: 100, height: 50 };
    const result = await meta2d.canvas.addPen(pen);
    expect(result).toBeDefined();
    expect(result?.id).toBe('p1');
    expect(meta2d.canvas.store.data.pens.find((p) => p.id === 'p1')).toBeDefined();
  });

  /**
   * Test ID: T-A-003
   * Maps to: 11a C001 canvas.addPens
   * Asserts: addPens(pens) async adds multiple pens
   */
  it('T-A-003 — canvas.addPens adds multiple pens to store', async () => {
    const pens: Pen[] = [
      { id: 'p2', name: 'rectangle', x: 100, y: 100, width: 50, height: 50 },
      { id: 'p3', name: 'rectangle', x: 200, y: 200, width: 50, height: 50 },
    ];
    const result = await meta2d.canvas.addPens(pens);
    expect(result).toHaveLength(2);
    expect(meta2d.canvas.store.data.pens.find((p) => p.id === 'p2')).toBeDefined();
    expect(meta2d.canvas.store.data.pens.find((p) => p.id === 'p3')).toBeDefined();
  });

  /**
   * Test ID: T-A-004
   * Maps to: 11a C028 canvas.find
   * Asserts: find(idOrTag) returns array of pens matching id or tag
   */
  it('T-A-004 — canvas.find returns array matching id', async () => {
    const pen: Pen = { id: 'p4', name: 'rectangle', x: 0, y: 0, width: 10, height: 10 };
    await meta2d.canvas.addPen(pen);
    const result = meta2d.canvas.find('p4');
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]?.id).toBe('p4');
  });

  /**
   * Test ID: T-A-005
   * Maps to: 11a C029 canvas.findOne
   * Asserts: findOne(idOrTag) returns single Pen or undefined
   */
  it('T-A-005 — canvas.findOne returns single pen for matching id', async () => {
    const pen: Pen = { id: 'p5', name: 'rectangle', x: 0, y: 0, width: 10, height: 10 };
    await meta2d.canvas.addPen(pen);
    const result = meta2d.canvas.findOne('p5');
    expect(result).toBeDefined();
    expect(result?.id).toBe('p5');
  });

  /**
   * Test ID: T-A-006
   * Maps to: 11a C025 canvas.delete
   * Asserts: delete([pen]) removes pen from store.data.pens
   */
  it('T-A-006 — canvas.delete removes pen from store', async () => {
    const pen: Pen = { id: 'p6', name: 'rectangle', x: 0, y: 0, width: 10, height: 10 };
    await meta2d.canvas.addPen(pen);
    expect(meta2d.canvas.store.data.pens.find((p) => p.id === 'p6')).toBeDefined();
    const target = meta2d.canvas.findOne('p6');
    expect(target).toBeDefined();
    meta2d.canvas.delete([target!]);
    expect(meta2d.canvas.store.data.pens.find((p) => p.id === 'p6')).toBeUndefined();
  });

  /**
   * Test ID: T-A-007
   * Maps to: 11a C031 canvas.setPenRect
   * Asserts: setPenRect(pen, rect) updates pen position + dimensions
   */
  it('T-A-007 — canvas.setPenRect updates pen position', async () => {
    const pen: Pen = { id: 'p7', name: 'rectangle', x: 0, y: 0, width: 50, height: 50 };
    await meta2d.canvas.addPen(pen);
    const target = meta2d.canvas.findOne('p7')!;
    meta2d.canvas.setPenRect(target, { x: 200, y: 300, width: 100, height: 100 });
    expect(target.x).toBe(200);
    expect(target.y).toBe(300);
    expect(target.width).toBe(100);
    expect(target.height).toBe(100);
  });
});
