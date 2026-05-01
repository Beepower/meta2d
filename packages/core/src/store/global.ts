import pkg from '../../package.json';
import { Pen } from '../pen';
import type { Meta2dStore } from './store';

export const globalStore: {
  version: string;
  path2dDraws: {
    [key: string]: (pen: Pen, ctx?: CanvasRenderingContext2D) => Path2D;
  };
  canvasDraws: {
    [key: string]: (ctx: CanvasRenderingContext2D, pen: Pen) => void;
  };
  lineAnimateDraws: {
    [key: string]: (ctx:CanvasRenderingContext2D, pen: Pen, state: any,index:number) => void
  }
  anchors: { [key: string]: (pen: Pen) => void }; // TODO: 存储的是 副作用 函数，函数内修改 anchors
  htmlElements: { [key: string]: HTMLImageElement }; // 目前只存在图片资源，此处使用 HTMLImageElement
} = {
  version: pkg.version,
  path2dDraws: {},
  canvasDraws: {},
  anchors: {},
  lineAnimateDraws:{},
  htmlElements: {},
};

// Phase A DEBT 真修 (Phase C): meta2dStores 与 globalStore 拆分
// 此前 globalStore 被双用 (注册表 + Meta2dStore-by-id map),通过 `as unknown as Record` cast 实现
// 现在拆为两个独立 map,各司其职
export const meta2dStores: Record<string, Meta2dStore> = {};

export function register(path2dFns: {
  [key: string]: (pen: Pen, ctx?: CanvasRenderingContext2D) => Path2D;
}) {
  Object.assign(globalStore.path2dDraws, path2dFns);
}

export function registerCanvasDraw(drawFns: {
  [key: string]: (ctx: CanvasRenderingContext2D, pen: Pen) => void;
}) {
  Object.assign(globalStore.canvasDraws, drawFns);
}

export function registerAnchors(anchorsFns: {
  [key: string]: (pen: Pen) => void;
}) {
  Object.assign(globalStore.anchors, anchorsFns);
}

export function registerLineAnimateDraws(lineAnimateDraws: {
  [key: string]: (ctx:CanvasRenderingContext2D, line:Pen, pos:any, index:number)=>void
}) {
  Object.assign(globalStore.lineAnimateDraws, lineAnimateDraws);
}
