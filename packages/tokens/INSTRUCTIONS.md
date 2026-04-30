# Claude Code 实装清单 — @meta2d/tokens v1.0.0

按顺序逐项实装,每项完成后跑对应测试。**不需要做任何架构决策**;所有决策已落定在代码 + DESIGN.md。

## 已交付内容

```
@meta2d/tokens/
├── package.json                    ✅ 完整(zero deps)
├── tsconfig.json                   ✅ 完整(strict + exactOptionalPropertyTypes)
├── vitest.config.ts                ✅ 完整(jsdom env)
├── README.md                       ✅ 完整
├── CHANGELOG.md                    ✅ 完整
├── INSTRUCTIONS.md                 ← 本文件
├── src/
│   ├── index.ts                    ✅ 公开 API 全部导出
│   ├── schema/
│   │   ├── palette.ts              ✅ Palette + ColorScale + ScalarTokens + 类型路径
│   │   ├── semantic.ts             ✅ SemanticTokens + 8 个子接口 + SemanticPath
│   │   ├── theme.ts                ✅ Theme + PartialTheme + DeepPartial
│   │   └── token-paths.ts          ✅ isSemanticPath / isPalettePath
│   ├── themes/
│   │   ├── light.ts                ✅ 完整 palette + semantic(WCAG AA)
│   │   ├── dark.ts                 ✅ extends light(WCAG AA)
│   │   ├── high-contrast.ts        ✅ extends light(WCAG AAA)
│   │   └── neutral.ts              ✅ extends light(ISA-101)
│   ├── resolver/
│   │   ├── resolver.ts             ✅ resolveTheme / fullyResolveTheme / isTokenRef
│   │   ├── deep-merge.ts           ✅ deep-merge(数组替换 / 嵌套合并)
│   │   └── index.ts                ✅
│   ├── css/
│   │   ├── to-css-vars.ts          ✅ 扁平化 + kebab-case 转换
│   │   ├── apply-to-element.ts     ✅ <style> 标签注入 / 移除
│   │   └── index.ts                ✅
│   └── validate/
│       ├── contrast.ts             ✅ WCAG 公式 + hex/rgb 解析
│       ├── validate-theme.ts       ✅ $ref 完整性 + 对比度 + 必填字段
│       └── index.ts                ✅
└── tests/
    ├── integration.test.ts         ✅ 端到端测试
    ├── resolver.test.ts            ✅ resolver 单元测试
    └── contrast.test.ts            ✅ 对比度单元测试
```

## Phase 1 — 安装依赖 + 跑通编译 (30 min)

```bash
cd @meta2d/tokens
npm install

# 第一道关:TS 编译过
npm run type-check
# 预期:0 error 0 warning(strict + exactOptionalPropertyTypes 全开)

# 第二道关:测试通过
npm test
# 预期:所有 test pass(三个测试文件 30+ cases)
```

如果 type-check 有 error,**先修 error,不要绕过**。这是契约的一部分。

## Phase 2 — 验证 4 个内置主题 (1 hour)

```bash
# 写一个临时验证脚本,跑 fullyResolveTheme 和 validateTheme
cat > /tmp/verify-themes.ts << 'EOF'
import {
  lightTheme,
  darkTheme,
  highContrastTheme,
  neutralTheme,
  validateTheme,
  fullyResolveTheme,
  contrastRatio
} from './src'

for (const theme of [lightTheme, darkTheme, highContrastTheme, neutralTheme]) {
  const report = validateTheme(theme)
  console.log(`\n=== ${theme.id} (${theme.meta.wcag}) ===`)
  console.log('  valid:', report.valid)
  if (!report.valid) {
    console.log('  issues:', report.issues)
  }
  // 关键对比度
  const r = fullyResolveTheme(theme)
  const sem = r.semantic as Record<string, Record<string, string>>
  const ratio = contrastRatio(sem.text.primary, sem.background.canvas)
  console.log(`  text/bg contrast: ${ratio.toFixed(2)}:1`)
}
EOF
npx tsx /tmp/verify-themes.ts
```

**验收标准**:
- 4 个主题全部 `valid: true`
- light / dark / neutral 对比度 ≥ 4.5
- high-contrast 对比度 ≥ 7.0

## Phase 3 — Build 配置 (1 hour)

```bash
# tsup 打包
npx tsup src/index.ts \
  --format cjs,esm \
  --dts \
  --clean \
  --out-dir dist

# 单独打包子路径(给 sub-path imports 用)
npx tsup src/themes/light.ts --format cjs,esm --dts --out-dir dist/themes
npx tsup src/themes/dark.ts --format cjs,esm --dts --out-dir dist/themes
npx tsup src/themes/high-contrast.ts --format cjs,esm --dts --out-dir dist/themes
npx tsup src/themes/neutral.ts --format cjs,esm --dts --out-dir dist/themes
```

**验收标准**:
- `dist/index.js` (CJS) + `dist/index.mjs` (ESM) + `dist/index.d.ts` 全部生成
- 主 bundle gzipped < 8 KB
- 子路径主题包 gzipped < 4 KB each

## Phase 4 — Tree-shake 验证 (30 min)

```bash
# 写一个最小消费者,只 import lightTheme
cat > /tmp/tree-shake-test.ts << 'EOF'
import { lightTheme } from '@meta2d/tokens'
console.log(lightTheme.id)
EOF

# 用 esbuild 打包 + 看 bundle 内容
npx esbuild /tmp/tree-shake-test.ts \
  --bundle \
  --tree-shaking=true \
  --format=esm \
  --outfile=/tmp/output.js

# 检查 dark/high-contrast 是否被 tree-shake 掉
grep -c "darkTheme\|highContrastTheme" /tmp/output.js
# 预期:0
```

如果 tree-shake 失败:检查 package.json 的 `sideEffects: false` 设置,确认 import 链中无副作用代码。

## Phase 5 — 集成 @meta2d/core (1 hour)

```typescript
// 在 @meta2d/core 中
import { lightTheme, darkTheme, fullyResolveTheme, applyThemeToDom } from '@meta2d/tokens'

// 假设 core 提供 theme accessor
meta2d.theme.registerTheme(lightTheme)
meta2d.theme.registerTheme(darkTheme)

// theme.setTheme 内部调:
applyThemeToDom(fullyResolveTheme(theme))
```

**验收标准**:
- meta2d.theme.setTheme('dark') 后 DOM 出现 `--m2d-*` CSS 变量
- 渲染层通过 CSS 变量取色,无硬编码色值

## Phase 6 — 浏览器烟雾测试 (30 min)

写一个最小 HTML 页面验证主题切换:

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { background: var(--m2d-background-canvas); color: var(--m2d-text-primary); }
    .panel { background: var(--m2d-background-panel); padding: 20px; }
  </style>
</head>
<body>
  <div class="panel">Hello, theme!</div>
  <button id="switch">Switch theme</button>
  <script type="module">
    import { lightTheme, darkTheme, fullyResolveTheme, applyThemeToDom } from '/path/to/dist/index.mjs'

    let isDark = false
    applyThemeToDom(fullyResolveTheme(lightTheme))

    document.getElementById('switch').onclick = () => {
      isDark = !isDark
      applyThemeToDom(fullyResolveTheme(isDark ? darkTheme : lightTheme))
    }
  </script>
</body>
</html>
```

**验收标准**:
- 点击按钮主题切换流畅,无 flash
- DevTools `<style id="meta2d-theme">` 内容正确变化
- DOM `:root[data-theme]` 属性同步

## Phase 7 — 文档完整性检查 (30 min)

确认以下文档存在且与代码同步:

- [x] README.md
- [x] CHANGELOG.md
- [x] docs/DESIGN.md
- [x] docs/USAGE.md
- [x] docs/EXTENDING.md

如果代码与文档不一致,**改代码不改文档**(文档已 review 锁定)。

## 总验收清单

执行完上述 7 phases 后,以下全部为 ✅:

- [ ] tsc strict mode 0 error 0 warning
- [ ] 所有测试 pass(integration + resolver + contrast)
- [ ] 测试覆盖率 ≥ 90%
- [ ] 4 个内置主题全部 WCAG 合规
- [ ] bundle minified < 15 KB(主入口)
- [ ] tree-shake 验证通过(只 import lightTheme 不带 darkTheme)
- [ ] 0 runtime 依赖(`npm ls --prod` 应该只显示自己)
- [ ] 集成 @meta2d/core 烟雾测试通过
- [ ] 浏览器主题切换烟雾测试通过

## 不要做的事(给 Claude Code 的禁令)

❌ **不要加任何业务 token**
   - 没有 `flow-electric` / `voltage-high` / `ops-gray` 字段
   - 这些是业务方的事,不在 @meta2d/tokens

❌ **不要扩展 SemanticTokens 字段**
   - 当前 schema 已 review,新增字段需要先开 PR 讨论
   - 业务方需要新字段时用 `BeePowerTheme extends Theme` 在业务包扩展

❌ **不要引入颜色处理库**(culori / chroma-js / color)
   - parseColor 当前简化实装够用
   - 真要支持 hsl/oklch 等扩展时再讨论

❌ **不要做"主题切换动画"**
   - applyThemeToDom 只负责注入 CSS 变量
   - 切换动画是业务层 CSS transition 的事

❌ **不要做"CSS-in-JS 集成"**(styled-components / emotion adapter)
   - V2 用的是普通 CSS / Tailwind,不需要这层 adapter
   - 如果未来需要,作为独立 @meta2d/tokens-styled 卫星包

❌ **不要做"Figma plugin / token export"**
   - 这是设计协作工具,不属于 runtime token 包

## 如何处理 "我觉得应该加 X" 的冲动

1. 翻 CHANGELOG.md "Not included (intentionally)" 一节,确认是否已显式拒绝
2. 翻 docs/DESIGN.md 看是否有"Why not X"段落解释
3. 如果都没有,先开 issue 讨论,**不要直接加**

每项 "Not included" 的拒绝都有具体理由(zero-dep / scope / 业务无关 / SDK 化考虑等)。
绕过这些理由 = 破坏架构纯洁性。

## 完成后

1. `npm run build` 确认 dist/ 生成
2. `npm pack --dry-run` 确认要发布的文件清单
3. 写 release notes(可以基于 CHANGELOG.md)
4. 等业务方 review + 集成测试通过后再 `npm publish`

预估总工时:**4-5 个工作日**(含调试 + 优化 + 文档微调)。
