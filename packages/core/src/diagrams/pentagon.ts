import { Pen } from '../pen';
import { Point } from '../point';
export function pentagon(pen: Pen, ctx?: CanvasRenderingContext2D): Path2D {
  const path = !ctx ? new Path2D() : ctx;
  const { x = 0, y = 0, width = 0, height = 0 } = pen.calculative!.worldRect!;

  path.moveTo(x + width / 2, y);
  path.lineTo(x + width, y + (height * 2) / 5);
  path.lineTo(x + (width * 4) / 5, y + height);
  path.lineTo(x + width / 5, y + height);
  path.lineTo(x, y + (height * 2) / 5);

  path.closePath();
  return path as Path2D;
}

export function pentagonAnchors(pen: Pen) {
  const points = [
    {
      x: 0.5,
      y: 0,
    },
    {
      x: 1,
      y: 0.4,
    },
    {
      x: 0.8,
      y: 1,
    },
    {
      x: 0.2,
      y: 1,
    },
    {
      x: 0,
      y: 0.4,
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
