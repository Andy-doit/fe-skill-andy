# Design Tokens, Theming & Dark Mode

## 1. Token layers

| Layer | Example | Rule |
|---|---|---|
| Primitive tokens | `--blue-600: oklch(0.55 0.2 260)` | Raw palette; never used directly in components |
| Semantic tokens | `--color-bg`, `--color-fg`, `--color-muted`, `--color-accent`, `--color-border`, `--color-danger` | Components use only these |
| Component tokens (optional) | `--button-bg` | Only when a component needs per-theme overrides |

- Define semantic tokens once per theme; components never hard-code hex/rgb values.
- Spacing, radius, shadow, and font tokens follow the same rule.
- Tailwind v4: tokens in `@theme { ... }` in CSS; Tailwind v3: `theme.extend` in config mapped to CSS variables. Check the profile's version.

## 2. Dark mode

```css
:root { --color-bg: #ffffff; --color-fg: #111827; --color-muted: #4b5563; }
:root[data-theme="dark"], .dark { --color-bg: #0b0f17; --color-fg: #e5e7eb; --color-muted: #9ca3af; }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { /* same dark values, if "system" is the default */ } }
```

Rules:
- Support three choices where the product allows: light, dark, system.
- Avoid a flash of the wrong theme: set the theme attribute before first paint (inline script in `<head>` or the theme library's recommended setup, e.g. `next-themes`).
- Set `color-scheme: light dark` (or per theme) so native controls and scrollbars match.
- Do not just invert colours: dark surfaces use lighter elevation, desaturated accents, and borders with enough contrast.
- Images/illustrations: provide dark variants or reduce brightness where needed; logos may need a dark version.
- Every token pair used for text must pass contrast in **both** themes (fe-contrast).

## 3. Verify

- Toggle each theme and reload: no flash, no hydration warning.
- DevTools Rendering → "Emulate CSS prefers-color-scheme" for the system setting.
- Search for hard-coded colours in components: `grep -rnE "#[0-9a-fA-F]{3,8}\b|rgb\(" src/components` (adjust path); each hit is either a token definition or a finding.
- Run fe-contrast on text/background token pairs for both themes.
