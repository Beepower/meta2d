# Design Rationale

## Why three tiers?

设计决策应该按"稳定性"分层。三层从下到上:

```
Tier 1 Palette   ← 不稳定(色卡可能因品牌升级整体换)
Tier 2 Semantic  ← 稳定(text.primary 这个名字 5 年不变)
Tier 3 Theme     ← 实例(有限种,light/dark 等)
```

业务代码引用 Tier 2,Tier 1 / Tier 3 都可以变更不破坏业务。

如果只用 Tier 1(直接 `color: #C7C7C7`)— 改色卡时全代码搜索替换。
如果只用 Tier 3(直接 `theme.lightGrayMid`)— 跨主题切换困难。

三层是经过 Material Design / Adobe Spectrum / Salesforce Lightning
等大型 design system 验证过的模式。

## Why $ref instead of inline values?

考虑 dark theme 怎么定义 `text.primary`:

**方案 A:每个主题字面值**
```ts
// light
text: { primary: '#171717' }
// dark
text: { primary: '#EDEDED' }
```

**方案 B:semantic 引用 palette**
```ts
// 共享 semantic
text: { primary: { $ref: 'colors.gray.12' } }
// 各主题只 override palette
light.palette.colors.gray[12] = '#171717'
dark.palette.colors.gray[12]  = '#EDEDED'
```

方案 B 的好处:
- semantic 层是"语义共识",所有主题共享
- 主题切换 = 只改 palette,语义自动跟随
- 业务代码读 semantic,不需要知道当前是 light 还是 dark

代价:多一层间接(resolve 时)。但 resolve 是 build-time 或主题切换时一次,
不影响渲染热路径。

## Why neutral theme?

工业 HMI(SCADA)行业有个反直觉的设计哲学:**ISA-101 高性能 HMI**。

- 平时全部灰阶,操作员视野无干扰
- 颜色完全保留给 alarm,看到颜色 = 出事了
- 优于"五光十色仪表盘"——后者长时间值守容易麻木

`neutral` theme 是这个哲学的内置版本。BeePower 的 ops-gray 业务主题就基于此扩展。

## Why 4 themes (not 2)?

Light + Dark 是行业标准最少。但实际:
- `high-contrast` 是 a11y 法律要求(政府/医疗合规)
- `neutral` 是工业 HMI 必需

4 个是覆盖主要场景的最小集合。再多就是业务变体(应该业务方自己包提供)。

## Why type-safe paths?

如果允许 `theme['text']['primary']` 字符串访问 — typo 难发现。
Semantic / Palette path 类型联合让 IDE 自动补全 + 编译时校验:

```ts
const ok: SemanticPath = 'text.primary'   // ✅
const bad: SemanticPath = 'text.foo'      // ❌ 编译错
```

NDV / AI 调用 token 时类型是关键。

## Why kebab-case CSS variables?

CSS 标准:CSS variable 名约定 kebab-case。
camelCase 在 CSS 里合法但社区惯例是 kebab。

`--m2d-text-primary` 比 `--m2d-textPrimary` 更"原生 CSS"。

## Why m2d prefix?

避免与业务方全局 CSS 变量冲突。如:
- BeePower 可能有 `--primary-color`(他们的全局色)
- meta2d 用 `--m2d-text-primary` 不冲突

允许覆盖前缀(`themeToCssVars(theme, { prefix: 'mycompany' })`)
是为 SDK 用户考虑(其他公司可能想用自己的 prefix)。

## Why deep-merge for theme extension?

继承的最常见 pattern:
- 业务方 90% 跟 light theme 一样
- 只 override 几个字段(focus 色 / status 色)

如果浅合并 → 业务方必须复制整个 semantic 层
深合并 → 业务方只写自己想改的字段

代价:deep-merge 实装稍复杂(对象 vs 数组 vs 原始值的判断),
但属于一次性写好的工具,不是热路径。

## Why no color manipulation utilities?

`lighten('#FF0000', 0.2)` 这种功能很诱人。但:
- 真做对需要 OKLab / OKLCH 色彩空间(culori 库 ~30KB)
- 三层 token 的设计本身就避免了"运行时计算颜色"的需要
   (palette 已经提供 1-12 阶,业务用第 5 阶就好)
- 加进去会让 zero-dep 承诺破产

如果业务方真需要,自己装 culori 写工具函数,不污染 tokens 包。

## Why not include theme switcher UI?

主题切换器(下拉菜单等)是 UI 组件,不是 token 包责任。
业务方用任何 React/Vue 组件库实装 + 调 applyThemeToDom 即可。

## Why no Figma plugin?

设计协作工具属于 design-ops 链路,与 runtime token 是不同时代:
- design-time:Figma → tokens.json(设计师)
- build-time:tokens.json → @meta2d/tokens 代码(工程师手工或脚本)
- runtime:本包(运行时)

把这三时代放一个包是 anti-pattern。Figma export 应该是单独工具。
