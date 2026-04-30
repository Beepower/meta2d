# @meta2d/tokens

> Three-tier design token system for meta2d.
> Type-safe, framework-agnostic, zero dependencies.

## Why

Design tokens encode design decisions as data. Three tiers separate concerns:

- **Tier 1 (Palette)** — *raw values*. Color scales, font sizes, spacing units.
- **Tier 2 (Semantic)** — *meaningful intentions*. `text.primary`, `entity.stroke`.
- **Tier 3 (Theme)** — *concrete instantiation*. light, dark, high-contrast, neutral.

Business code uses **only Tier 2** (semantic). Tier 1 changes never break Tier 2 contracts.

## Install

```bash
npm install @meta2d/tokens
```

## Quick start

```typescript
import { lightTheme, applyThemeToDom, fullyResolveTheme } from '@meta2d/tokens'

// 1. Apply built-in theme to DOM
applyThemeToDom(fullyResolveTheme(lightTheme))

// 2. Use CSS variables in your styles
//    <div style="color: var(--m2d-text-primary);">
```

## Built-in themes

| ID              | Use case                               | WCAG |
|-----------------|----------------------------------------|------|
| `light`         | Default editor / general use           | AA   |
| `dark`          | Low-light / showcase                   | AA   |
| `high-contrast` | Accessibility / outdoor                | AAA  |
| `neutral`       | Industrial HMI (ISA-101 inspired)      | AA   |

## Extending — register a business theme

```typescript
import type { PartialTheme } from '@meta2d/tokens'
import { resolveTheme, lightTheme, fullyResolveTheme, applyThemeToDom } from '@meta2d/tokens'

const myTheme: PartialTheme = {
  id: 'my-brand',
  name: 'My Brand',
  extends: 'light',
  meta: { version: '1.0.0', wcag: 'AA' },
  semantic: {
    interaction: {
      focus: '#FF6B6B'
    }
  }
}

const resolved = resolveTheme(myTheme, { light: lightTheme })
applyThemeToDom(fullyResolveTheme(resolved))
```

## Type-safe paths

```typescript
import type { SemanticPath } from '@meta2d/tokens'

const path: SemanticPath = 'text.primary'   // ✅
const bad: SemanticPath = 'text.foo'        // ❌ Compile error
```

## CSS variable naming

All semantic tokens become CSS variables:

```
text.primary      → --m2d-text-primary
entity.stroke     → --m2d-entity-stroke
typography.body   → --m2d-typography-body-{size,weight,...}
```

## Contrast validation

```typescript
import { validateTheme, contrastRatio } from '@meta2d/tokens'

const report = validateTheme(myTheme)
if (!report.valid) {
  console.error(report.issues)
}

// Or check single pair
const ratio = contrastRatio('#000', '#FFF')  // → 21.0
```

## Architecture

```
@meta2d/tokens
├── schema/      Types (Palette / Semantic / Theme)
├── themes/      Default themes (light, dark, hc, neutral)
├── resolver/    $ref resolution + deep merge
├── css/         CSS variable output
└── validate/    WCAG + completeness check
```

## Documents

- [DESIGN.md](docs/DESIGN.md) — Design rationale (why three tiers, why $ref, etc.)
- [USAGE.md](docs/USAGE.md) — Detailed usage guide
- [EXTENDING.md](docs/EXTENDING.md) — Business extension scenarios
- [INSTRUCTIONS.md](INSTRUCTIONS.md) — Implementation checklist for Claude Code

## License

MIT
