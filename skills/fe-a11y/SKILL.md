---
name: fe-a11y
description: >
  Make web UIs accessible per WCAG 2.2 AA: keyboard operation, focus management (dialogs, focus traps, focus return,
  focus not obscured), visible focus, semantic HTML, correct ARIA, accessible names, form error announcements,
  live regions, screen-reader support, target size, and automated + manual a11y testing.
  Use when: elements cannot be reached or operated by keyboard, focus is lost, labels are missing, screen readers
  read the wrong thing, or an accessibility audit is needed.
  DO NOT USE FOR: measuring colour contrast ratios (see fe-contrast);
  DO NOT USE FOR: animation implementation of prefers-reduced-motion (see fe-motion).
---

# fe-a11y — Accessibility (WCAG 2.2 AA)

Keyboard, focus, semantics, and assistive technology support. Follows [conventions.md](../fe-andy/references/conventions.md).

## Minimum rules (apply even without fe-andy)
- Read `project-profile.md` in the target project first (target level: AA default).
- Read-only audit first; propose; wait for approval before editing.
- Never print secrets; never edit protected areas without explicit instruction.
- Finish with the learning loop: append new, proven lessons to [references/learned.md](./references/learned.md) after a duplicate check ([learning-loop.md](../fe-andy/references/learning-loop.md)).

---

## 1. Core rules

**Semantics first** — "No ARIA is better than bad ARIA":
- `<button>` for actions, `<a href>` for navigation; never `<div onClick>`.
- Landmarks: one `<main>`, `<nav>`, `<header>`, `<footer>`; headings in order (one `h1`).
- Lists as `<ul>/<ol>`, tables with `<th scope>`; form fields with `<label for>`.

**Keyboard**:
- Everything interactive reachable with Tab in visual order; no positive `tabIndex`.
- Visible focus on every control: `focus-visible:ring-2 focus-visible:ring-offset-2` (never remove outline without a replacement; focus indicator ≥ 3:1 contrast — check with fe-contrast).
- Skip link to main content on pages with long navigation.
- Composite widgets (tabs, menus, listbox) use arrow keys per the ARIA Authoring Practices pattern; prefer the UI library's accessible primitive.

**Dialogs & overlays**:
- On open: focus moves into the dialog (first field or the dialog title); Tab cycles inside; background inert (`inert` attribute or `aria-modal="true"` with the library's trap).
- Escape closes; on close focus returns to the trigger.
- Prefer native `<dialog>` with `showModal()` or the UI library's Dialog.

**Names & state**:
- Icon-only buttons: `aria-label` or visually hidden text.
- Toggles/disclosures: `aria-expanded`, `aria-controls`; current page in nav: `aria-current="page"`.
- Custom dropdown/combobox triggers (e.g. `<button popovertarget="...">` opening a listbox): apply `role="combobox"`, `aria-controls="listbox-id"`, `aria-haspopup="listbox"`, and `aria-expanded={isOpen}`. Plain `<button>` does not support `aria-invalid` or `aria-required` in ARIA specs/linters; `role="combobox"` officially supports them.
- Images: meaningful `alt`; decorative `alt=""`.

**Dynamic content**:
- Form errors: `aria-invalid`, `aria-describedby` to the error text; on submit move focus to the first error or an error summary.
- Status messages (saved, results count): `role="status"` (polite) or `role="alert"` (urgent) region that exists before the message is inserted.
- Route changes in SPAs: move focus to the new page's `h1` or announce the title.

**WCAG 2.2 additions** — see [wcag22-checklist.md](./references/wcag22-checklist.md): focus not obscured, target size minimum 24×24 px (44×44 preferred for touch), dragging alternatives, consistent help, redundant entry, accessible authentication.

## 2. Testing

| Layer | How |
|---|---|
| Automated | axe DevTools / Lighthouse Accessibility in the browser; in tests `@axe-core/playwright` if installed (fe-test). Automated tools find only part of the issues. |
| Keyboard walkthrough | Unplug the mouse: Tab through the page, open/close every overlay, submit a form with errors, note focus order and visibility. |
| Screen reader smoke test | NVDA (Windows) or VoiceOver (macOS/iOS): read the page by headings (H key / rotor), operate the main flow, listen for names/states/announcements. |
| Zoom & reflow | 200% zoom and 320 px width: no loss of content or function. |
| Reduced motion | Emulate in DevTools Rendering panel (implementation: fe-motion). |

## 3. Output

```markdown
| # | Issue | WCAG SC | Location (file:line) | Found by (axe / keyboard / SR) | Impact | Effort | Risk | Fix |
```
List what was tested and what was not (e.g. "VoiceOver not tested").

Learned notes: [references/learned.md](./references/learned.md).
