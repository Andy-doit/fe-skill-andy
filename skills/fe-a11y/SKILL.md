---
name: fe-a11y
description: >
  Enhance web ACCESSIBILITY (a11y) per the WCAG 2.2 standard: keyboard navigation,
  focus management (focus traps, tabIndex, focus-visible indicators), semantic HTML, proper ARIA attributes, and Screen Reader support.
  Use when: fixing inability to tab into menus/modals, resolving lost focus states, adding missing aria-labels,
  or conducting accessibility audits.
  DO NOT USE FOR: Measuring mathematical color contrast ratios or sRGB luminance (see fe-contrast);
  DO NOT USE FOR: Handling prefers-reduced-motion animation logic (see fe-motion).
---

# `fe-a11y` — Web Accessibility & Assistive Navigation (WCAG 2.2)

Specialized skill for ensuring frontend applications are fully operable via keyboard navigation and optimized for users relying on assistive screen readers according to the WCAG 2.2 standard. Strictly follows [conventions.md](../fe-andy/references/conventions.md).

---

## 1. Domain Separation

- **`fe-contrast`**: Exclusively governs mathematical sRGB luminance calculations and color contrast ratios (AA/AAA).
- **`fe-motion`**: Exclusively governs motion reduction queries (`@media (prefers-reduced-motion)`).
- **`fe-a11y`**: Governs HTML semantics, keyboard focus lifecycles, and screen reader integration.

---

## 2. Core Accessibility Axioms

### 2.1 Keyboard Focus & Navigation
- **Unambiguous Focus Indicators**: Every interactive control (button, link, input) must render an unmistakable focus ring on keyboard interaction (`focus-visible:ring-2 focus-visible:outline-none`). Never remove focus outlines without providing a visible replacement.
- **Modal Focus Traps**: When a dialog/modal mounts, tab navigation must cycle strictly within the modal; pressing Escape must dismiss the dialog and restore focus back to the triggering element.
- **Smooth Scroll Focus Shift**: Anchor jumps must assign `tabIndex={-1}` and invoke `element.focus()` on the target element to move screen reader attention.

### 2.2 Semantic HTML ("No ARIA is Better than Bad ARIA")
- Always prefer standard HTML elements (`<button>` over `<div onClick>`, `<nav>`, `<main>`, `<header>`).
- Icon-only buttons must declare an `aria-label` or embed a `.sr-only` descriptive label.
- Dynamic collapsibles (accordions, disclosure menus) must reflect `aria-expanded` and `aria-controls`.

### 2.3 Touch Target Sizing
- On mobile devices, interactive touch targets must measure at least $44 \times 44\text{px}$ to prevent mis-clicks.
