# Proof Lenses — Audit Framework

Proof exists only after render. It observes what actually rendered (computed a11y tree, focus element, measured rectangles, composed colours, motion timing) — never what source intended.

## Lens Types

| Type | How it passes | Use when |
|---|---|---|
| **Gating** | 100% binary — ALL criteria must pass at every state, theme, viewport. No mean, no tolerance. | A11Y, Contrast, Focus, Motion, Render Truth |
| **Scored** | 1–5 per criterion; needs gate set pass + mean ≥ `shipMean`. Score 3 = met without conviction = `fix-first`. | Taste (TASTE-1..12), UX (UX-1..11) |

A criterion with no observation = `blocked`, never pass and never fail.
Below-volume data cannot complete a density or count criterion.

## Gating Lenses

### A11Y (gating — A11Y-1..4)
Must pass on computed accessibility tree and measured render:
- A11Y-1: Semantic HTML, correct ARIA roles and attributes.
- A11Y-2: Every interactive element has an accessible name.
- A11Y-3: Keyboard navigation reaches and operates every control.
- A11Y-4: Touch target ≥ 44 px on coarse pointer; every interactive target, including chips, calendar days, stepper glyphs.

### Contrast (gating — COLOR-3, COLOR-5)
Measured on composed pixels, every theme and state:
- COLOR-3: Text contrast ≥ 4.5:1 (AA), large text ≥ 3:1.
- COLOR-5: UI component and focus indicator contrast ≥ 3:1.

### Focus (gating — FOCUS-1..5)
Measured by active element trace:
- FOCUS-1: Every interactive element is keyboard-reachable in logical order.
- FOCUS-2: Focus indicator is visible (not hidden by clip, overflow, or transform).
- FOCUS-3: Modal/dialog traps focus; closing returns focus to trigger.
- FOCUS-4: Focus is never lost (no orphan focus after DOM mutation).
- FOCUS-5: Focus is not obscured by sticky headers or overlays.

### Motion (gating — MOTION-1..4)
Measured by normal + reduced-motion capture pair:
- MOTION-1: `prefers-reduced-motion: reduce` stops or slows all animations.
- MOTION-2: No infinite animation runs at idle (CPU/GPU cost).
- MOTION-3: No animation starts without user intent (no auto-play motion).
- MOTION-4: Motion does not trigger vestibular discomfort (no large rapid movement).

### Render Truth (gating — TRUTH-1..4)
Claims traced to authority:
- TRUTH-1: Every icon/illustration encodes one exact product claim (no decorative ambiguity for functional symbols).
- TRUTH-2: Anatomy from reference renders, not from memory or old screenshots.
- TRUTH-3: Every drawn control is wired or explicitly marked as a pending route.
- TRUTH-4: Direction assets record the reference renders and brand revision that produced them.

## Scored Lenses

### Taste (scored — TASTE-1..12)
Scored 1–5 by auditor. Needs `shipMean` (typically ≥ 3.5). Key criteria:
- TASTE-1: Hierarchy — one clear primary action per view; emphasis by intent, not by size.
- TASTE-5: Colour — no raw brand values; no colour as the only encoding; accessible palette.
- TASTE-9: Density fits the surface class (console, catalog, form, landing), achieved by spacing — NEVER by shrinking controls.
- TASTE-10: **Designed states**: loading keeps anatomy; empty carries title + action; error fails in place; nothing jumps when content arrives. (Skeleton parity.)
- TASTE-11: **Touch + feedback**: targets per A11Y-4; hover/focus/rest visually distinct; pending visible on initiator.

### UX (scored — UX-1..11)
Measured in a UAT run. Key criteria:
- UX-1: Task completes unaided to terminal assertion within time budget.
- UX-3: Wrong input corrected at its field within allowed steps; every entered value kept; message names field and accepted form.
- UX-6: No dead ends — every state offers a next action or way back.
- UX-9: Commit action in thumb reach at narrowest viewport (lower half or pinned bar); destructive and commit separated by a target width.
- UX-11: Nouns for things, verbs for controls, units on figures, no stub copy, one name per concept.

## The 4 Audit Laws (AUDIT-1..4)

Apply before scoring any lens:

| Law | Rule |
|---|---|
| AUDIT-1 | A symbol is a product claim — an icon or illustration encodes one exact meaning; no ambiguity allowed for functional symbols. |
| AUDIT-2 | System source wins over direction pixels — reference renders of the installed grammar beat a designer's memory of what a component looks like. |
| AUDIT-3 | Intentional departure = drift until the owner decides — a surface that breaks a rule intentionally is a finding, not a free pass, until the owner explicitly overrules the rule. |
| AUDIT-4 | Raster asset vs code-native are separate modes — a screenshot of a component and the component's code are not interchangeable evidence. |

## Mapping to fe-skill-andy

| Lens | Primary skill | Supporting |
|---|---|---|
| A11Y | `fe-a11y` | `fe-contrast` (COLOR-3/5), `fe-motion` (MOTION-1..4) |
| Contrast | `fe-contrast` | — |
| Focus | `fe-a11y` | — |
| Motion | `fe-motion` | — |
| Taste | `fe-ux` | `fe-layout` (TASTE-9), `fe-skel` (TASTE-10) |
| UX | `fe-ux` | `fe-a11y` (UX-9 targets) |
