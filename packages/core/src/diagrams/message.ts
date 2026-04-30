import { Pen } from '../pen';

export function message(pen: Pen, ctx?: CanvasRenderingContext2D): Path2D {
  const path = !ctx ? new Path2D() : ctx;
  const { x = 0, y = 0, width = 0, height = 0, ey = 0 } = pen.calculative!.worldRect!;

  path.moveTo(x, y);
  path.lineTo(x + width, y);
  path.lineTo(x + width, y + (height * 3) / 4);
  path.lineTo(x + (width * 8) / 16, y + (height * 3) / 4);
  path.lineTo(x + width / 4, ey);
  path.lineTo(x + (width * 5) / 16, y + (height * 3) / 4);
  path.lineTo(x, y + (height * 3) / 4);

  path.closePath();
  return path as Path2D;
}
