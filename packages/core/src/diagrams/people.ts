import { Pen } from '../pen';

export function people(pen: Pen, ctx?: CanvasRenderingContext2D): Path2D {
  const path = !ctx ? new Path2D() : ctx;
  const { x = 0, y = 0, width = 0, ex = 0, ey = 0 } = pen.calculative!.worldRect!;
  const r = width / 4;
  const middle = x + width / 2;
  path.arc(middle, y + r, r, 0, Math.PI * 2);

  path.moveTo(x, y + r * 3);
  path.lineTo(ex, y + r * 3);

  path.moveTo(middle, y + r * 2);
  path.lineTo(middle, y + r * 4);

  path.moveTo(middle, y + r * 4);
  path.lineTo(x, ey);

  path.moveTo(middle, y + r * 4);
  path.lineTo(ex, ey);
  path.closePath();
  return path as Path2D;
}
