import { Pen } from '../pen';

export function diamond(pen: Pen, ctx?: CanvasRenderingContext2D): Path2D {
  const path = !ctx ? new Path2D() : ctx;
  const { x = 0, y = 0, width = 0, height = 0 } = pen.calculative!.worldRect!;
  path.moveTo(x + width / 2, y);
  path.lineTo(x + width, y + height / 2);
  path.lineTo(x + width / 2, y + height);
  path.lineTo(x, y + height / 2);
  path.lineTo(x + width / 2, y);
  path.closePath();

  return path as Path2D;
}
