import { Pen } from '../pen';

// circle:渲染圆。强制 width=height,如不等则取 min 保证圆形。
// (Phase D1 fix quirk 11.4 #4: 原行为是 width≠height 时 silently 渲染椭圆 — 命名不诚实。
//  现在 width≠height 时 fallback 到 min,如需椭圆请用 ellipse pen。)
export function circle(pen: Pen, ctx?: CanvasRenderingContext2D): Path2D {
  const path = !ctx ? new Path2D() : ctx;
  const { x = 0, y = 0, width = 0, height = 0 } = pen.calculative!.worldRect!;
  const r = Math.min(width, height) / 2;
  path.ellipse(
    x + width / 2,
    y + height / 2,
    r,
    r,
    0,
    0,
    Math.PI * 2
  );

  return path as Path2D;
}
