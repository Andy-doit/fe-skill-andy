# Responsive Layout — mobile-first, fluid, container queries

## 1. Mobile-first

- Write base styles for the smallest screen; add `sm:`/`md:`/`lg:` (or `min-width` media queries) to enhance.
- Content decides breakpoints: add one where the layout breaks, not per device.
- Avoid fixed widths on containers; use `max-w-*` + `w-full` + horizontal padding.
- Use `min-h-svh`/`min-h-dvh` for full-height sections on mobile (the `vh` unit ignores browser UI changes).

## 2. Fluid sizing

```css
/* Fluid heading: 28px at narrow screens → 48px at wide screens */
h1 { font-size: clamp(1.75rem, 1.2rem + 2.5vw, 3rem); }
```
Keep a `rem` part in `clamp()` so text still scales with user zoom.

## 3. Grids that adapt without breakpoints

```css
.cards { display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fill, minmax(min(18rem, 100%), 1fr)); }
```
`min(18rem, 100%)` prevents overflow on very narrow screens.

## 4. Container queries (component responds to its container, not the viewport)

```css
.card-wrap { container-type: inline-size; }
@container (min-width: 28rem) { .card { display: grid; grid-template-columns: 8rem 1fr; } }
```
Tailwind v4 has built-in `@container` and `@md:`-style variants; Tailwind v3 needs the official plugin — check the profile's Tailwind version.

Use container queries for reusable blocks placed in different column widths (sidebar vs main). Keep page-level layout on media queries.

## 5. Touch and input

- Interactive targets at least 24×24 px (WCAG 2.2 AA), 44×44 px preferred on touch screens.
- Do not rely on hover for essential information; provide focus and tap equivalents.
- `@media (hover: hover)` to scope hover-only effects.

## 6. Verify

- Widths: 320/360, 768, 1024, 1440 px; landscape phone.
- No horizontal scroll: `document.documentElement.scrollWidth > innerWidth` is `false`.
- 200% browser zoom and 400% reflow (WCAG 1.4.10): content in one column, no loss of function.
- Long content: very long words/URLs (`break-words` / `overflow-wrap: anywhere`), long translations (see fe-i18n).
