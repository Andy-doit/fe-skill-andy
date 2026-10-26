---
name: fe-ux
description: >
  Review and design USER EXPERIENCE in two modes (Mode 1: brainstorm 1–3 layout concepts with mockups, no production
  code; Mode 2: apply the chosen concept): usability heuristics, user flows, navigation, feedback, undo, onboarding,
  perceived performance, form UX (validation, errors, autocomplete, upload), UX writing (labels, errors, empty states),
  tabular-nums and text-balance.
  Use when: proposing layouts, reviewing a flow or form, improving microcopy, or making the UI feel faster.
  DO NOT USE FOR: measured colour contrast (see fe-contrast); focus traps, ARIA, screen readers (see fe-a11y);
  DO NOT USE FOR: locale number/currency formatting (see fe-i18n); writing form code (see fe-code).
---

# fe-ux — UX Review, Brainstorm & Apply

Evidence-based UX: heuristics, flows, forms, and words. Follows [conventions.md](../fe-andy/references/conventions.md).

## Minimum rules (apply even without fe-andy)
- Read `project-profile.md` in the target project first (audience, locales, design rules, known decisions).
- Mode 1 never writes production code; Mode 2 edits only after the user picks a concept.
- Never print secrets or real user data in mockups; never edit protected areas without explicit instruction.
- Finish with the learning loop: append new, proven lessons to [references/learned.md](./references/learned.md) after a duplicate check ([learning-loop.md](../fe-andy/references/learning-loop.md)). Project-specific design decisions go to the project's `project-profile.md` ("Known decisions").

---

## 1. Mode 1 — Brainstorm

1. Read the current page/flow and the project's known decisions.
2. State the user goal and the primary action of the screen (one per screen).
3. Propose 1–3 concepts. For each:
   ```markdown
   ### Concept A — <name>
   - Layout sketch: <ASCII wireframe or component list top→bottom>
   - Primary action: <...>   Secondary: <...>
   - Why it helps: <heuristic / flow argument>
   - Cost: <S/M/L>   Risk: <Low/Med/High>   New components: <list>
   ```
4. Recommend one; wait for the user's choice.

## 2. Mode 2 — Apply

Build the chosen concept with the fe-code skill rules; record the decision (date, choice, reason) in the project's `project-profile.md` "Known decisions" if the project keeps one.

## 3. Review checklist (heuristics → concrete checks)

| Heuristic | Check in the UI |
|---|---|
| Visibility of status | Every action gives feedback < 100 ms (pressed state), progress for > 1 s, result message |
| Match the real world | Labels use the user's words, not internal codes |
| User control | Undo for destructive actions; Escape closes overlays; back button works |
| Consistency | Same action = same label, icon, position across pages |
| Error prevention | Constraints, defaults, confirmation only for irreversible actions |
| Recognition over recall | Visible options, recent items, filled defaults |
| Efficiency | Keyboard shortcuts for frequent actions; bulk actions in lists |
| Minimal design | One primary action per view; remove decoration that competes with content |
| Error recovery | Error says what happened + how to fix, near the problem |
| Help | Inline hints at the point of need, not long manuals |

Navigation: current location visible (active nav, breadcrumbs for deep pages), predictable back behaviour, URLs reflect state (fe-code state.md).
Onboarding: empty states that teach the first action; progressive disclosure; no forced tours.
Perceived performance: optimistic UI for safe actions (logic: fe-data), skeletons over spinners (fe-skel), instant pressed states, `tabular-nums` for changing numbers, `text-balance` on headings.

## 4. Details

- Forms: [forms.md](./references/forms.md)
- UX writing: [ux-writing.md](./references/ux-writing.md)

## 5. Output (review)

```markdown
| # | Issue | Where (file:line / screen) | Heuristic | Impact | Effort | Risk | Proposal |
```
Verify UX changes by walking the flow end-to-end (happy path, error path, empty state, keyboard only, narrow screen) and listing what was checked.

Learned notes: [references/learned.md](./references/learned.md).
