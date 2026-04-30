# Extending @meta2d/tokens

业务方(BeePower V2 / 其他客户)如何扩展。

## Scenario 1: Override a single color

最简单场景:浅色主题大体满意,只想换告警红。

```typescript
import type { PartialTheme } from '@meta2d/tokens'
import { resolveTheme, lightTheme, fullyResolveTheme, applyThemeToDom } from '@meta2d/tokens'

const myLight: PartialTheme = {
  id: 'my-light',
  name: 'My Light',
  extends: 'light',
  meta: { version: '1.0.0', wcag: 'AA' },
  semantic: {
    status: { danger: '#FF1744' }
  }
}

const resolved = resolveTheme(myLight, { light: lightTheme })
applyThemeToDom(fullyResolveTheme(resolved))
```

## Scenario 2: 完整业务主题(BeePower ops-gray)

```typescript
const opsGray: PartialTheme = {
  id: 'ops-gray',
  name: 'BeePower Operations',
  extends: 'neutral',
  meta: {
    version: '1.0.0',
    author: 'BeePower',
    wcag: 'AA',
    recommendedUsage: ['monitoring', 'sustained-operation']
  },
  palette: {
    colors: {
      gray: {
        1: '#F5F7FA',
        2: '#F0F2F5'
      }
    }
  },
  semantic: {
    status: {
      danger: '#DC2626'
    },
    entity: {
      stroke: { $ref: 'colors.gray.10' }
    }
  }
}

const resolved = resolveTheme(opsGray, {
  light: lightTheme,
  neutral: neutralTheme
})
```

## Scenario 3: 完整自定义主题(不基于内置)

如果你的设计语言完全不同(比如赛博朋克美学),直接写完整 Theme:

```typescript
import type { Theme } from '@meta2d/tokens'

const cyberpunk: Theme = {
  id: 'cyberpunk',
  name: 'Cyberpunk',
  meta: { version: '1.0.0' },
  palette: { /* 完整 palette */ },
  semantic: { /* 完整 semantic */ }
}

applyThemeToDom(fullyResolveTheme(cyberpunk))
```

## Scenario 4: 业务字段扩展

⚠️ **不要直接修改 SemanticTokens 类型**(那是 framework schema)。

业务字段通过 V2 自己的层处理:

```typescript
// V2 业务方包(@beepower/tokens-business)
import type { Theme } from '@meta2d/tokens'

export interface BeePowerTheme extends Theme {
  business: {
    flowColors: {
      electric: string
      info: string
      money: string
    }
    voltageColors: {
      ehv: string
      hv: string
      mv: string
      lv: string
    }
  }
}

const beepowerLight: BeePowerTheme = {
  ...lightTheme,
  business: {
    flowColors: { electric: '#87CEEB', info: '#00C896', money: '#FFD700' },
    voltageColors: { ehv: '#FF0066', hv: '#FF6600', mv: '#FFCC00', lv: '#888888' }
  }
}
```

V2 业务代码直接 `theme.business.flowColors.electric`,不污染 @meta2d/tokens schema。

## Scenario 5: 在 React 中切换主题

```typescript
import { useEffect, useState } from 'react'
import {
  applyThemeToDom,
  fullyResolveTheme,
  lightTheme,
  darkTheme,
  type Theme
} from '@meta2d/tokens'

const themes: Record<string, Theme> = {
  light: lightTheme,
  dark: darkTheme
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeId] = useState('light')

  useEffect(() => {
    const theme = themes[themeId]
    if (theme) {
      applyThemeToDom(fullyResolveTheme(theme))
    }
  }, [themeId])

  return <>{children}</>
}
```

## Scenario 6: 与 meta2d core 集成

```typescript
import { meta2d } from '@meta2d/core'
import { lightTheme, darkTheme } from '@meta2d/tokens'

meta2d.theme.registerTheme(lightTheme)
meta2d.theme.registerTheme(darkTheme)

meta2d.theme.setTheme('dark')
// → 自动应用到 DOM,渲染层通过 CSS 变量取色
```

## Validation

发布前一定跑校验:

```typescript
import { validateTheme } from '@meta2d/tokens'

const report = validateTheme(myTheme)
if (!report.valid) {
  console.error('Theme failed validation:')
  for (const issue of report.issues) {
    console.error(`  [${issue.severity}] ${issue.code}: ${issue.message}`)
  }
}
```

## 命名规约(给业务包)

业务包(`@beepower/tokens-business`)主题 id 应包含品牌前缀:

- ✅ `beepower-ops-gray`
- ✅ `beepower-showcase`
- ❌ `ops-gray`(可能与其他业务方冲突)
- ❌ `dark-mode-2`(无意义)

## 不要做的事

❌ **不要 publish 修改过的 @meta2d/tokens**
   用业务方独立包(`@yourcompany/tokens-business`),
   依赖 @meta2d/tokens 而不是 fork

❌ **不要在主题里加 JavaScript 函数**
   tokens 是 data,不是 code。
   如果需要计算逻辑,放业务方代码里,产物是计算后的字面值

❌ **不要 mutate 主题对象**
   所有 Theme / ResolvedTheme 都应作 immutable 用
   resolveTheme 返回新对象,不要改回头修改原对象
