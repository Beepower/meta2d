// pSBC - Shade Blend Convert - Version 4.0 - 02/18/2019
// https://github.com/PimpTrizkit/PJs/edit/master/pSBC.js

interface ColorParts {
  r: number;
  g: number;
  b: number;
  a: number;
}

// 拆分原 d:any 变量重用反模式 (Phase A DEBT 真修):
// - input: 原始字符串 (rgb(...) / #hex)
// - parts: 字符串拆分后的分量数组
// - hex: 转 number 后的 hex 整数
export function pSBCr(input: string): ColorParts | null {
  const i = parseInt;
  const m = Math.round;
  let n = input.length;
  const x: ColorParts = { r: 0, g: 0, b: 0, a: -1 };
  if (n > 9) {
    const parts = input.split(',');
    const [r, g, b, a] = parts;
    n = parts.length;
    if (n < 3 || n > 4) return null;
    x.r = i(r![3] == 'a' ? r!.slice(5) : r!.slice(4));
    x.g = i(g!);
    x.b = i(b!);
    x.a = a ? parseFloat(a) : -1;
  } else {
    if (n == 8 || n == 6 || n < 4) return null;
    let expanded = input;
    if (n < 6)
      expanded =
        '#' +
        input[1] +
        input[1] +
        input[2] +
        input[2] +
        input[3] +
        input[3] +
        (n > 4 ? input[4]! + input[4]! : '');
    const hex = i(expanded.slice(1), 16);
    if (n == 9 || n == 5) {
      x.r = (hex >> 24) & 255;
      x.g = (hex >> 16) & 255;
      x.b = (hex >> 8) & 255;
      x.a = m((hex & 255) / 0.255) / 1000;
    } else {
      x.r = hex >> 16;
      x.g = (hex >> 8) & 255;
      x.b = hex & 255;
      x.a = -1;
    }
  }
  return x;
}

/*
example：
pSBC ( 0.42, color1 ); // rgb(20,60,200) + [42% Lighter] => rgb(166,171,225)
pSBC ( -0.4, color5 ); // #F3A + [40% Darker] => #c62884

pSBC ( -0.5, color2, color8, true ); // rgba(20,60,200,0.67423) + rgba(200,60,20,0.98631) + [50% Blend] => rgba(110,60,110,0.83)
pSBC ( 0.7, color2, color7, true ); // rgba(20,60,200,0.67423) + rgb(200,60,20) + [70% Blend] => rgba(146,60,74,0.67423)

more:
https://github-wiki-see.page/m/PimpTrizkit/PJs/wiki/12.-Shade%2C-Blend-and-Convert-a-Web-Color-%28pSBC.js%29
*/

export function pSBC(p: number, c0: string, c1?: string, l?: boolean) {
  let r,
    g,
    b,
    P,
    f,
    t,
    h,
    m = Math.round,
    a: any = typeof c1 == 'string';
  if (
    typeof p != 'number' ||
    p < -1 ||
    p > 1 ||
    typeof c0 != 'string' ||
    (c0[0] != 'r' && c0[0] != '#') ||
    (c1 && !a)
  )
    return null;
  (h = c0.length > 9),
    (h = a ? ((c1?.length ?? 0) > 9 ? true : c1 == 'c' ? !h : false) : h),
    (f = pSBCr(c0)),
    (P = p < 0),
    (t =
      c1 && c1 != 'c'
        ? pSBCr(c1)
        : P
        ? { r: 0, g: 0, b: 0, a: -1 }
        : { r: 255, g: 255, b: 255, a: -1 }),
    (p = P ? p * -1 : p),
    (P = 1 - p);
  if (!f || !t) return null;
  if (l)
    (r = m(P * f.r + p * t.r)),
      (g = m(P * f.g + p * t.g)),
      (b = m(P * f.b + p * t.b));
  else
    (r = m((P * f.r ** 2 + p * t.r ** 2) ** 0.5)),
      (g = m((P * f.g ** 2 + p * t.g ** 2) ** 0.5)),
      (b = m((P * f.b ** 2 + p * t.b ** 2) ** 0.5));
  (a = f.a),
    (t = t.a),
    (f = a >= 0 || t >= 0),
    (a = f ? (a < 0 ? t : t < 0 ? a : a * P + t * p) : 0);
  if (h)
    return (
      'rgb' +
      (f ? 'a(' : '(') +
      r +
      ',' +
      g +
      ',' +
      b +
      (f ? ',' + m(a * 1000) / 1000 : '') +
      ')'
    );
  else
    return (
      '#' +
      (4294967296 + r * 16777216 + g * 65536 + b * 256 + (f ? m(a * 255) : 0))
        .toString(16)
        .slice(1, f ? undefined : -2)
    );
}

globalThis.pSBC = pSBC;

export function rgba(c: string, p: number) {
  const f: ColorParts = pSBCr(c) || { r: 0, g: 0, b: 0, a: -1 };
  if (f.a < 0) {
    return `rgba(${f.r},${f.g},${f.b},${p})`;
  }

  return `rgba(${f.r},${f.g},${f.b},${p + f.a})`;
}
