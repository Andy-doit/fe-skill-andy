---
name: fe-layout
description: >
  Align and refine visual LAYOUT: spacing scale and hierarchy, grid/flex alignment, equal-height rows with pinned footers,
  icon-text alignment, section rhythm, viewport-height balance, responsive/mobile-first layout, container queries,
  design tokens, theming and dark mode.
  Use when: fixing gaps/padding, uneven card heights, misaligned icons, harsh section transitions, breakpoints,
  or adding/repairing theme tokens and dark mode.
  DO NOT USE FOR: loading skeletons (see fe-skel); scroll animation or frame stutter (see fe-motion);
  DO NOT USE FOR: measured colour contrast (see fe-contrast).
---

# fe-layout — Layout, Spacing, Responsive & Theming

Intentional spacing, solid alignment, and consistent theming across viewports. Follows [conventions.md](../fe-andy/references/conventions.md).

## Minimum rules (apply even without fe-andy)
- Read `project-profile.md` in the target project first: **its spacing scale, radius scale, breakpoints and dark-mode setup override the defaults below.**
- For screenshots/mockups: inspect → propose exact class diffs → wait for approval → edit.
- Never print secrets; never edit protected areas without explicit instruction.
- Finish with the learning loop: append new, proven lessons to [references/learned.md](./references/learned.md) after a duplicate check ([learning-loop.md](../fe-andy/references/learning-loop.md)).

---

## 1. Spacing law: no "uniform slap-on"

Every value has intent. Do not apply the same gap/padding at every container level.

**Default scale** (Tailwind units, 4 px grid) — used only when the profile does not define one:

| Class | Relationship | Use |
|---|---|---|
| `gap-0` | Tight coupling | Title ↔ description |
| `gap-2` (8 px) | Paired units | Icon ↔ label, label ↔ input, avatar ↔ name |
| `gap-3` (12 px) | Same group | Items in a list, compact card interior |
| `gap-4` (16 px) | Roomy group | Related controls needing breathing room |
| `gap-6` (24 px) | Boundaries | Section ↔ section, card ↔ card, text ↔ CTA |

With the default scale, snap off-scale values (`gap-1`, `gap-5`, `p-5`, `p-7`) to the nearest step unless the profile allows them.

**Hierarchy**: child spacing < parent spacing — e.g. `gap-0` (title-desc) < `gap-2` (icon-label) < `gap-3` (card interior) < card padding < `gap-6` (between cards/sections).

## 2. Alignment patterns

| Problem | Pattern |
|---|---|
| Cards in a row have different heights | Card: `h-full flex flex-col`; body `flex-1`; footer `mt-auto` |
| 1-line vs 2-line titles break baselines | Title box `min-h-[<2 lines>] flex items-start` + `text-balance` |
| Icon and text misaligned | `inline-flex items-center gap-2`; icon fixed size (`size-4`/`size-5`, `shrink-0`); text `min-w-0 truncate` |
| Abrupt colour change between sections | 100–140 px gradient blend between alternating sections (example: [example-section-rhythm.md](./references/example-section-rhythm.md)) |
| Empty hole in a 100vh hero | `flex flex-col justify-center` instead of `justify-between`; use `min-h-svh`/`min-h-dvh` rather than `h-screen` on mobile |

## 3. Responsive, theming, tokens

- Mobile-first breakpoints, fluid type, container queries: [responsive.md](./references/responsive.md).
- Design tokens, theming, dark mode: [theming.md](./references/theming.md).

## 4. Workflow

1. **Inspect**: map the visual region to file:line; list current classes.
2. **Propose**: table `| Element | file:line | Current | Proposed | Reason |`; wait for approval.
3. **Apply** the diff.
4. **Verify**:
   - Check at 360, 768, 1024, 1440 px widths (DevTools device toolbar) and in both themes if dark mode exists.
   - No horizontal scroll at 360 px: in console, `document.documentElement.scrollWidth > innerWidth` → must be `false`.
   - Zoom 200% / text-only zoom: content still readable, nothing clipped.
   - Lint passes (project lint command).
   - After colour/theme changes, re-run contrast with the fe-contrast skill.

Learned notes: [references/learned.md](./references/learned.md).
