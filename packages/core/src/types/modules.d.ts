// Phase A: 第三方包 ambient module declarations(无 .d.ts 的包)
// 此文件不能含 export 语句,否则 declare module 不被识别为 ambient

declare module 'mqtt/dist/mqtt.min.js';
