import { Pen } from '../pen';
import { Point } from '../point';

export function triangle(pen: Pen, ctx?: CanvasRenderingContext2D): Path2D {
  const path = !ctx ? new Path2D() : ctx;
  const { x = 0, y = 0, width = 0, height = 0 } = pen.calculative!.worldRect!;
  path.moveTo(x + width / 2, y);
  path.lineTo(x + width, y + height);
  path.lineTo(x, y + height);
  path.lineTo(x + width / 2, y);

  path.closePath();
  return path as Path2D;
}

export function triangleAnchors(pen: Pen) {
  const points = [
    {
      x: 0.5,
      y: 0,
    },
    {
      x: 0.75,
      y: 0.5,
    },
    {
      x: 0.5,
      y: 1,
    },
    {
      x: 0.25,
      y: 0.5,
    },
  ] as const;
  pen.anchors = points.map(({ x, y }, index) => {
    return {
      id: `${index}`,
      penId: pen.id,
      x,
      y,
    };
  });
}
