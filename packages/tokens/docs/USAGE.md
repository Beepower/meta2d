# Usage Guide

## Basic flow

```
1. Choose / define theme
   ↓
2. resolveTheme(partial, knownThemes) [if extending]
   ↓
3. fullyResolveTheme(theme)         ← all $refs resolved
   ↓
4. applyThemeToDom(resolved)        ← injects <style> tag
   ↓
5. CSS variables available globally
```

## Built-in themes

```typescript
import { lightTheme, darkTheme, highContrastTheme, neutralTheme } from '@meta2d/tokens'
```

Each is a complete `Theme` object — pass directly to `fullyResolveTheme`.

## Theme switching at runtime

```typescript
import { applyThemeToDom, fullyResolveTheme, lightTheme, darkTheme } from '@meta2d/tokens'

function setTheme(themeId: 'light' | 'dark') {
  const theme = themeId === 'light' ? lightTheme : darkTheme
  applyThemeToDom(fullyResolveTheme(theme))
}
```

切换主题时 `<style>` 标签内容被替换,不触发 element 重排。

## Using CSS variables in styles

```css
/* In your stylesheet */
.my-button {
  background: var(--m2d-interaction-focus);
  color: var(--m2d-text-inverse);
  border: var(--m2d-stroke-width-thin) solid var(--m2d-border-default);
  border-radius: var(--m2d-radii-md);
  padding: var(--m2d-spacing-2) var(--m2d-spacing-4);
}

.my-button:hover {
  background: var(--m2d-interaction-hover);
}
```

## In React with inline styles

```tsx
function PenLabel({ text }: { text: string }) {
  return (
    <span style={{
      color: 'var(--m2d-text-primary)',
      fontFamily: 'var(--m2d-typography-body-family)',
      fontSize: 'var(--m2d-typography-body-size)px'   // 注意:数字 token 需要加单位
    }}>
      {text}
    </span>
  )
}
```

## SSR / non-DOM environments

`applyThemeToDom` 需要 DOM。SSR 可以输出 CSS string:

```typescript
import { themeToCssVars, fullyResolveTheme, lightTheme } from '@meta2d/tokens'

const cssString = themeToCssVars(fullyResolveTheme(lightTheme))
// 写入 SSR HTML 的 <style> 标签
```

## Validation in CI

```typescript
import { validateTheme } from '@meta2d/tokens'
import myTheme from './my-theme'

const report = validateTheme(myTheme)
if (!report.valid) {
  console.error('Theme validation failed:')
  for (const issue of report.issues) {
    console.error(`  [${issue.severity}] ${issue.code}: ${issue.message}`)
  }
  process.exit(1)
}
```

## Type-safe path utilities

```typescript
import { isSemanticPath, isPalettePath } from '@meta2d/tokens'

const userInput = 'text.primary'
if (isSemanticPath(userInput)) {
  // userInput now narrowed to SemanticPath
}
```

## Common pitfalls

### Don't mutate themes

```typescript
// ❌ BAD
lightTheme.semantic.text.primary = '#FF0000'

// ✅ GOOD
const myTheme = resolveTheme({
  id: 'my-light',
  name: 'My Light',
  extends: 'light',
  meta: { version: '1.0.0' },
  semantic: { text: { primary: '#FF0000' } }
}, { light: lightTheme })
```

### Don't forget fullyResolveTheme before applyThemeToDom

```typescript
// ❌ BAD - $refs 未解析
applyThemeToDom(lightTheme as never)

// ✅ GOOD
applyThemeToDom(fullyResolveTheme(lightTheme))
```

### Number tokens are unitless

CSS 输出的数字没有单位:

```css
--m2d-spacing-4: 12;   /* not "12px" */
```

业务代码加单位:

```css
padding: calc(var(--m2d-spacing-4) * 1px);
/* or */
padding: var(--m2d-spacing-4-px);   /* if you preprocess */
```

理由:同一个数字 token 可能用在 px / ms / 倍数等不同上下文。
