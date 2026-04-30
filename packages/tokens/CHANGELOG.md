# Changelog

All notable changes to `@meta2d/tokens` will be documented in this file.
The format follows [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.0.0] — 2026-XX-XX

### Added

- **Three-tier token system**: Palette (raw) / Semantic (intentions) / Theme (instances)
- **4 built-in themes**: `light`, `dark`, `high-contrast` (WCAG AAA), `neutral` (ISA-101 style)
- **Type-safe paths**: `PalettePath` / `SemanticPath` 编译时校验,防 magic string
- **Token references**: `{ $ref: 'colors.gray.5' }` 跨 tier 引用
- **Theme extension**: `extends` + deep-merge,业务方 partial override
- **CSS variable output**: `themeToCssVars()` + `applyThemeToDom()`
- **WCAG validation**: `validateTheme()` 校验对比度合规
- **Zero dependencies**, side-effect-free, tree-shake friendly
- Sub-path exports: `@meta2d/tokens/themes/light` 等

### Design decisions locked

- 12-step color scale (Radix UI inspired) — 索引 1-12
- CSS variable prefix `--m2d-` (可通过选项覆盖)
- 数字 token 输出为 unitless 字符串,业务方按需加 `px` / `ms`
- 只支持 `#RGB` / `#RRGGBB` / `#RRGGBBAA` / `rgb(...)` / `rgba(...)` 颜色格式

### Not included (intentionally)

- ❌ 业务 token(flow / voltage / 业务状态)— 业务方包负责
- ❌ Color manipulation(lighten/darken)— 用户自带 culori 等库
- ❌ Theme transition animation — V2 用 CSS transition
- ❌ Figma plugin / token export — 设计协作工具
- ❌ CSS-in-JS adapter — 独立卫星包(未来)
