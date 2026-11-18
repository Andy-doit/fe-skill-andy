# Control-Height Ramp

One size model for every interactive component: a row of mixed controls reads as one object.

## The Ramp

| Step | When to use | Lint |
|---|---|---|
| `sm` | Inside a collection item (list row, table row, card action) OR a dense toolbar where every control is `sm` | Only by placement |
| `md` | Default — every other control: buttons, selects, segmented controls, switches, tabs | Omit `size` prop |
| `lg` | The one conversion CTA of a landing hero — at most ONE per view | Once per view only |
| `control` | Bar context (navbar, top bar, site bar) — set by the bar composition, not the control | Never set manually |

**Rule: One step per row.** Controls sharing a row share a step. Emphasis NEVER comes from size — use intent (primary/secondary/ghost) instead.

**Rule: Default is `md`.** Omit the `size` prop. A larger step is not a way to add emphasis.

**Rule: Fields have one step (`md` only).** A row containing a field is always an `md` row — a smaller field costs legibility and prevents mobile focus-zoom.

## Touch Floor — Hit Area vs Drawn Box

The drawn box follows the ramp. The **hit area** (what a pointer or finger can actually press) is a separate requirement:

- **Coarse pointer** (touch, narrow viewport): 44–48 px minimum hit area.
- **Fine pointer** (mouse): minimum per design system.
- **Method:** Extend the pressable area with an invisible extension (`:after` pseudo-element or `padding`). **Never make the drawn button taller** to meet the touch floor — that breaks row alignment.
- **Applies to ALL interactive targets:** chips, list options, segments, calendar days, stepper glyphs, clear buttons on fields.
- **Proof:** A11Y-4, TASTE-11, UX-9 (thumb reach at narrowest viewport).

## Density Rule

Density is the share of a surface doing work. Achieve it by:
- Reducing **spacing** between regions, sections, and rows.
- **Never** by shrinking controls below their ramp step.
- **Never** by shrinking hit areas below the touch floor.

| Surface | Controls | Density |
|---|---|---|
| Console / admin | `md`; `sm` inside items and dense toolbars | Tight spacing |
| Catalog / list | `md`; `sm` filter chips | Medium spacing |
| Form | `md` only | Form spacing |
| Landing | `md`; one `lg` hero CTA | Generous spacing |

## What Travels with a Step

| Step | Glyph scale | Label rank | Corner style |
|---|---|---|---|
| `sm` | Small | Supporting (14 px) | Compact or pill |
| `md` | Standard | Supporting (14–16 px) | Control corner or pill |
| `lg` | Standard | Ordinary (16–18 px) | Pill |
