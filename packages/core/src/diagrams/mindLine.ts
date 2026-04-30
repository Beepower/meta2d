import { Pen } from '../pen';

export function mindLine(pen: Pen, ctx?: CanvasRenderingContext2D): Path2D {
  const path = !ctx ? new Path2D() : ctx;
  const { x = 0, y = 0, width = 0, height = 0 } = pen.calculative!.worldRect!;
  path.moveTo(x, y + height);
  path.lineTo(x + width, y + height);
  path.closePath();
  return path as Path2D;
}

export function mindLineAnchors(pen: Pen) {
  const points = [
    {
      x: 0,
      y: 1,
    },
    {
      x: 1,
      y: 1,
    },
  ] as const;
  pen.anchors = points.map(({ x, y }, index) => {
    return {
      id: index + '',
      x,
      y,
      penId: pen.id,
    };
  });
}
