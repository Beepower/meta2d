// Global runtime configuration ambient declarations
// Phase A noImplicitAny — Day 15+
//
// 这些 globalThis.* 是运行时由 host 应用 / 第三方库注入的;
// declare global 让 tsc 在 noImplicitAny 下不再 TS7017 (typeof globalThis no index sig)。
// 类型策略:
//   - 已知形态(string/boolean/number)— 给具体类型 + ?optional
//   - 第三方库实例(html2canvas/marked/pSBC)— `unknown` 或 specific signature(尽量 unknown 而非 any)
//   - Meta2d 自身实例(meta2d/mainMeta2d)— 用 unknown 占位,M4+ 收紧

export {}

declare global {
  // eslint-disable-next-line no-var
  var TokenPrefix: string | undefined
  // eslint-disable-next-line no-var
  var le5leTokenName: string | undefined
  // eslint-disable-next-line no-var
  var le5leSSOTokenName: string | undefined
  // eslint-disable-next-line no-var
  var le5leTokenType: number | undefined  // TokenType enum value
  // eslint-disable-next-line no-var
  var le5leTokenD: boolean | undefined
  // eslint-disable-next-line no-var
  var iotUrl: string | undefined
  // eslint-disable-next-line no-var
  var getMeta2dData: ((id: string) => Promise<unknown>) | undefined

  // Debug / observability flags
  // eslint-disable-next-line no-var
  var debug: boolean | undefined
  // eslint-disable-next-line no-var
  var debugRender: boolean | undefined

  // jetLinks 桥(jetLinks.ts 内 export 的同名函数 + assign to globalThis)
  // eslint-disable-next-line no-var
  var doWarning: ((meta2d: unknown, mess: unknown) => void) | undefined
  // eslint-disable-next-line no-var
  var createAudio: ((meta2d: unknown, media: string, playTimes: number) => void) | undefined

  // 第三方库 — 通过 <script> 注入,Phase A 用 unknown
  // eslint-disable-next-line no-var
  var html2canvas: unknown
  // eslint-disable-next-line no-var
  var marked: unknown
  // eslint-disable-next-line no-var
  var pSBC: unknown
}

declare global {

  // Meta2d 实例引用(host 应用层)— Phase A 用 unknown,M4+ 收紧到具体 Meta2d 类型
  // eslint-disable-next-line no-var
  var meta2d: unknown
  // eslint-disable-next-line no-var
  var mainMeta2d: unknown
}
