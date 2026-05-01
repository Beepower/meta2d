import { Pen } from '../pen';

// ellipse:渲染椭圆。width / height 可不等。
// (Phase D1: 从 circle 拆出。原 circle 当 width≠height 时实际渲染椭圆是不诚实的命名 — quirk 11.4 #4。)
export function ellipse(pen: Pen, ctx?: CanvasRenderingContext2D): Path2D {
  const path = !ctx ? new Path2D() : ctx;
  const { x = 0, y = 0, width = 0, height = 0 } = pen.calculative!.worldRect!;
  path.ellipse(
    x + width / 2,
    y + height / 2,
    width / 2,
    height / 2,
    0,
    0,
    Math.PI * 2
  );

  return path as Path2D;
}
