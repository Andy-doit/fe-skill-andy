---
name: fe-ux
description: >
  Design and refine USER EXPERIENCE (UX Review & Brainstorm):
  operates in 2 distinct modes (Mode 1: Brainstorm 1–3 layouts & render widget mockups; Mode 2: Apply chosen layout & record design decisions).
  Governs Nielsen's 10 heuristics, perceived performance, form UX flows, keyboard shortcuts, tabular-nums (number jitter prevention), and text-balance.
  Use when: brainstorming new page layouts, rendering visual mockups, evaluating usability flows, or implementing approved UX patterns.
  DO NOT USE FOR: Mathematical color contrast calculations (see fe-contrast);
  DO NOT USE FOR: Deep keyboard focus trap or ARIA semantics (see fe-a11y);
  DO NOT USE FOR: Regional locale number or currency formatting (see fe-i18n).
---

# `fe-ux` — User Experience Review & Dual-Mode Engine

Specialized skill for evaluating, brainstorming, and implementing exceptional user experience flows grounded in cognitive psychology principles (Gestalt, Fitts's Law, Nielsen's 10 Heuristics) and perceived performance. Strictly follows [conventions.md](../fe-andy/references/conventions.md).

---

## 1. Domain Boundaries

- **`fe-i18n` Governs**: Regional locale currency (`100.000 ₫` vs `$100`), date formatting, and bilingual dictionary parity.
- **`fe-ux` Governs**:
  - `tabular-nums`: Fixed-width font metrics in financial tables and real-time dashboards so numbers do not jump laterally when changing.
  - `text-balance`: Balanced optical line-wrapping on headlines to eliminate orphaned single words.
  - Perceived performance: Immediate visual feedback, optimistic updates, and ghost skeletons over raw spinners.

---

## 2. Dual-Mode Operation

### 🟢 Mode 1: Brainstorm & Widget Mockup
- **Objective**: Synthesize house design memory with contemporary web UX patterns; propose 1–3 layout concepts accompanied by visual widget mockups.
- **Constraint**: **NEVER write production code in Mode 1**. Present comparative analysis and await user selection.

### 🔵 Mode 2: Implement Approved Layout & Journaling
- **Objective**: Translate user's chosen layout into on-pattern frontend components.
- **Decision Journaling**: Record technical rationale into house decision logs and `work_log.md` at task wrap-up.

---

## 3. Form UX & Usability Standards

1. **Inline Validation**: Provide contextual error feedback immediately upon blur or submit; never discard user input on validation failure.
2. **Button State Transitions**: Transition smoothly: Ready ➔ Processing (with subtle spinner) ➔ Success (with checkmark).
3. **Undo over Confirm**: Favor non-blocking undo toasts for destructive actions over repetitive confirmation modals.
