---
name: fe-contrast
description: >
  Measure and verify WCAG 2.2 colour contrast (AA/AAA) for text, UI components and focus indicators, including
  translucent/frosted surfaces over changing backgrounds, light and dark themes, and brand palettes.
  Use when: checking text readability, validating design tokens or a palette, checking a header that changes
  state while scrolling, or verifying contrast after a theme change.
  DO NOT USE FOR: keyboard navigation, focus traps, ARIA or screen readers (see fe-a11y);
  DO NOT USE FOR: general UX or form flow review (see fe-ux).
---

# fe-contrast — Measured WCAG Contrast

Calculate contrast with the WCAG relative-luminance formula and report pass/fail per pair. Follows [conventions.md](../fe-andy/references/conventions.md).

## Minimum rules (apply even without fe-andy)
- Read `project-profile.md` in the target project first (required level: AA default, AAA if the profile says so).
- Read-only audit first; propose colour/token changes and wait for approval before editing.
- Never print secrets; never edit protected areas without explicit instruction.
- Finish with the learning loop: append new, proven lessons to [references/learned.md](./references/learned.md) after a duplicate check ([learning-loop.md](../fe-andy/references/learning-loop.md)).

---

## 1. Formula

Contrast = (L1 + 0.05) / (L2 + 0.05), L1 = lighter relative luminance.
L = 0.2126·R + 0.7152·G + 0.0722·B, each channel linearized: c ≤ 0.04045 ? c/12.92 : ((c+0.055)/1.055)^2.4 (c in 0–1).
Translucent surface: composite = surface·α + underlying·(1−α), then measure text against the composite.

## 2. Thresholds

| What | AA | AAA |
|---|---|---|
| Normal text | 4.5:1 | 7:1 |
| Large text (≥ 24 px, or ≥ 18.66 px bold) | 3:1 | 4.5:1 |
| UI components, icons, focus indicators, input borders (1.4.11) | 3:1 | — |

Disabled controls and pure decoration are exempt; logos are exempt.

## 3. Workflow

1. **Collect pairs**: from tokens (text/background tokens per theme), components (button label/background, input border/page, focus ring/background, placeholder), and states (hover, active, disabled, error). For surfaces over moving content, list every section colour behind them.
2. **Run the script** (from this skill folder):
   ```bash
   # one pair
   node scripts/verify-contrast.mjs --fg "#4B5563" --bg "#FFFFFF"
   # a config file (pairs and/or scrolling header)
   node scripts/verify-contrast.mjs --config <path-to-project>/contrast.config.json --level AA
   # the bundled example
   node scripts/verify-contrast.mjs --config references/example-config.json
   ```
   Config format: [config-schema.md](./references/config-schema.md). Example: [example-config.json](./references/example-config.json). Script: [scripts/verify-contrast.mjs](./scripts/verify-contrast.mjs). Exit code 1 = at least one failure.
3. **Report**:
   ```markdown
   | Context | FG | BG | Ratio | Needs | Result | Proposed fix (token change) |
   ```
   For each failure propose the smallest token change that passes (darken/lighten text, raise surface alpha, add a scrim), and re-run.
4. **Verify** after the fix: script exit code 0 for both themes. Optionally cross-check one pair in DevTools (colour picker shows the contrast ratio).

## 4. Header that changes while scrolling

Check three states: `top` (over hero), `scrolled` (translucent over every section), `menu-open` (over the drawer). `backdrop-filter: blur()` is not modelled; test the darkest and lightest section colours as worst cases.

Learned notes: [references/learned.md](./references/learned.md).
