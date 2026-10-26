# Modern CSS — cascade layers, `:has()`, nesting, popover, anchor positioning, entry/exit transitions

Use platform features before JavaScript and before adding a dependency, **inside the project's browser matrix**. Support status is as of writing and moves fast: check webstatus.dev (Baseline) / Can I Use against `project-profile.md` §6 before relying on any row, and let fe-review confirm anything marked (verify).

## 0. Support table (check before use)

| Feature | Status at writing | Fallback / enhancement |
|---|---|---|
| Container queries (size), `cqi` units | Baseline widely available | Media queries |
| `:has()` | Baseline widely available | JS state class |
| CSS nesting | Baseline widely available | Flat selectors (build tools can also flatten) |
| Cascade layers `@layer` | Baseline widely available | Specificity management |
| `@property` (typed custom properties) | Baseline | Non-animated custom property |
| `color-mix()`, `oklch()`, relative color syntax | Baseline (relative color newer — verify) | Precomputed hex tokens |
| `light-dark()` | Baseline | `prefers-color-scheme` blocks |
| `text-wrap: balance` | Baseline | None needed (progressive) |
| `text-wrap: pretty` | Partial (verify) | None needed |
| Subgrid | Baseline | Nested grid with matched tracks |
| `dvh` / `svh` / `lvh` | Baseline | `vh` + JS resize |
| `<dialog>`, Popover API (`popover` attribute) | Baseline | Library dialog/popover |
| `@starting-style` + `transition-behavior: allow-discrete` | Baseline (newer; verify for older Safari) | Keyframe animation on mount |
| Anchor positioning (`anchor-name`, `position-area`) | Chrome/Edge 125+, Safari 26+, Firefox 147+ (Jan 2026) — **Baseline newly available per secondary sources (verify)** | Floating UI / Popper |
| Scroll-driven animations (`animation-timeline`) | Chrome/Edge, Safari 26+; Firefox behind a flag (verify) | IntersectionObserver — see fe-motion modern-motion.md |
| View Transitions API | Same-document widely; cross-document newer (verify) | None (progressive) — fe-motion |
| `field-sizing: content` | Chromium only (verify) | JS autosize |

Rule: **Baseline widely available → use freely. Newly available → use with `@supports` or a graceful fallback. Not Baseline → progressive enhancement only, never for a required behaviour.**

## 1. Cascade layers — the fix for "my utilities get overridden"

Tailwind v4 emits native layers (`theme, base, components, utilities`). Unlayered CSS beats **every** layer, so third-party stylesheets imported without a layer silently override utilities.

```css
/* app/globals.css */
@layer theme, base, vendor, components, utilities;   /* declare order once, first */
@import "tailwindcss";
@import "some-datepicker/dist/style.css" layer(vendor);   /* vendor CSS now loses to utilities */

@layer components {
  .card { @apply rounded-card border border-border bg-surface; }  /* or plain CSS */
}
```

Rules: declare the layer order in one place at the top; put *all* project CSS in a layer; import vendor CSS into `layer(vendor)`; keep `!important` out (inside layers, `!important` reverses layer order — a debugging trap). Verify in DevTools → Styles: the winning rule shows its layer name.

## 2. `:has()` — parent/sibling state without JS

| Pattern | CSS | Replaces |
|---|---|---|
| Card highlights when something inside is focused | `.card:has(:focus-visible) { outline: 2px solid var(--color-brand); }` | `onFocus` state + class |
| Disable submit until the form is valid | `form:has(:invalid) button[type=submit] { opacity: .6; pointer-events: none; }` (still validate on the server; keep the button focusable for a11y messages — see fe-ux forms) | JS validity tracking |
| Grid switches layout by item count | `.grid:has(> :nth-child(5)) { grid-template-columns: repeat(3, 1fr); }` | Count prop |
| Label styling when its input is checked | `label:has(input:checked) { … }` | Controlled state |
| Page-level: body gets a class when a dialog is open | `html:has(dialog[open]) { overflow: hidden; }` | Effect toggling body class |

Performance: `:has()` is fast for scoped selectors; avoid `body:has(.anything)` with deep descendant chains on large DOMs — measure (DevTools → Performance, "Recalculate Style") when a list has thousands of nodes.

## 3. Nesting

```css
.product-card {
  display: grid;
  &:hover { box-shadow: var(--shadow-md); }
  & .price { font-variant-numeric: tabular-nums; }
  @container (min-width: 24rem) { grid-template-columns: 1fr 2fr; }
}
```
Rules: nest ≤ 3 levels; use `&` explicitly (required for element selectors in older implementations); keep component scope — nesting is not a licence for deep selectors (fe-clean flags > 3 levels). With Tailwind, nesting lives in `@layer components` only.

## 4. Typed custom properties, color functions, light/dark

```css
@property --angle { syntax: "<angle>"; inherits: false; initial-value: 0deg; }   /* now animatable */
:root {
  --color-brand: oklch(52% 0.19 255);
  --color-brand-hover: color-mix(in oklch, var(--color-brand), black 12%);
  --color-ink: light-dark(oklch(22% 0.02 260), oklch(95% 0.01 260));            /* needs color-scheme: light dark */
}
html { color-scheme: light dark; }
```
Use `oklch` for perceptually even scales and `color-mix` for hover/active variants instead of hand-picked hexes; run fe-contrast after generating variants. `light-dark()` + `color-scheme` replaces duplicated token blocks when the project does not need a manual theme switch (see [theming.md](./theming.md) for the class-based approach).

## 5. Popover + anchor positioning (tooltip, menu, combobox surface)

```html
<button popovertarget="menu" aria-expanded="false">Account</button>
<div id="menu" popover role="menu" class="anchored">…</div>
```
```css
button[popovertarget="menu"] { anchor-name: --account; }
.anchored {
  position: fixed;                       /* popovers are in the top layer */
  position-anchor: --account;
  position-area: block-end span-inline-end;   /* below, aligned to the start edge */
  position-try-fallbacks: flip-block, flip-inline;
  margin: 0; inset: auto;
}
@supports not (anchor-name: --x) { /* fall back to Floating UI positioning in JS */ }
```
What the platform gives you: top layer (no z-index wars), light dismiss, `Escape`, focus restore for `popover="auto"`. What it does **not** give you: roles, arrow-key navigation, typeahead — apply the ARIA APG pattern (fe-a11y). Keep Floating UI where the matrix lacks anchor positioning, and remove it when the matrix moves.

## 6. Entry/exit transitions for `display: none`, dialogs and popovers

```css
dialog, [popover] {
  opacity: 0; translate: 0 8px;
  transition: opacity .18s ease-out, translate .18s ease-out, display .18s allow-discrete, overlay .18s allow-discrete;
}
dialog:open, [popover]:popover-open { opacity: 1; translate: 0 0; }
@starting-style { dialog:open, [popover]:popover-open { opacity: 0; translate: 0 8px; } }
@media (prefers-reduced-motion: reduce) { dialog, [popover] { transition: none; } }
```
`@starting-style` defines the "from" state on first render; `transition-behavior: allow-discrete` (here via the `display`/`overlay` transitions) keeps the element rendered during the exit. Durations and easings: fe-motion modern-motion.md §6. `:open` vs `[open]` naming differs by browser age — verify.

## 7. Typography and layout helpers

- `h1, h2, h3 { text-wrap: balance; }` for headings ≤ 4 lines; `p { text-wrap: pretty; }` where supported (no orphans).
- Fluid type/space with `clamp()`: `font-size: clamp(1rem, 0.9rem + 0.5vw, 1.25rem)`; keep a minimum that passes zoom 200 % (fe-a11y).
- Logical properties (`margin-inline`, `padding-block`, `inset-inline-start`) by default so RTL locales work without overrides (fe-i18n).
- Subgrid for card internals that must align across a row: `.card { display: grid; grid-template-rows: subgrid; grid-row: span 3; }` — complements the `h-full` + `mt-auto` pattern in SKILL.md §2.
- `scrollbar-gutter: stable` on scroll containers to stop layout shift when scrollbars appear.

## 8. Verify

- DevTools → Styles shows the expected layer on winning rules; no `!important` added to beat vendor CSS.
- Each non-Baseline feature is wrapped in `@supports` or degrades to a working state (test with the feature disabled: DevTools → Rendering or an older browser from the matrix).
- `:has()`-driven states behave with keyboard focus (`:focus-visible`), not only mouse hover.
- Popover/anchor surfaces: Escape closes, focus returns, no clipping at viewport edges (fallbacks flip), screen reader announces role/state (fe-a11y).
- Reduced motion disables entry/exit transitions (fe-motion §3).
- Contrast re-checked after `color-mix`/`light-dark` changes (fe-contrast).
