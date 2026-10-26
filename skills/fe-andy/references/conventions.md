# Universal Frontend Agent Conventions (`fe-skill-andy`)

Core governance and engineering standards applied across all skills in the `fe-skill-andy` ecosystem. All skills reference this document as the Single Source of Truth (SSOT). Install the whole skill set together so this sibling file resolves.

---

## 0. Project Profile First

Before auditing or editing, look for `project-profile.md` at the root of the **target project** (the app being worked on, not this skill set).
- Found → its values (stack, versions, package manager, protected areas, budgets, a11y level, locales, spacing scale) override the defaults in every skill.
- Not found → state the assumptions you are making, or ask the user. Offer to create one from [project-profile.template.md](./project-profile.template.md).
- Project-specific facts discovered during work go into the project's `project-profile.md`, never into this skill set.

---

## 1. Mandatory 6-Step Protocol (Audit-First Workflow)

```
[1. Read-Only Audit] → [2. Proposal] → [3. User Approval] → [4. Precise Edit] → [5. Verify] → [6. Learn]
```

1. **Read-Only Audit & Inspection**: Never modify code prior to inspection. Explicitly distinguish between:
   - **"Observed in code"**: Specific file path, line numbers, and existing implementation.
   - **"Inferred / Requires measurement"**: Hypotheses regarding server latency, CDN caching, or runtime profiler bottlenecks.
2. **Breakdown & Structured Proposal**: Present findings ranked with the rubric in §2: target files and line ranges, impact, effort, risk.
3. **Await User Approval**: Pause and ask for confirmation. Only proceed to code edits upon explicit approval ("Proceed", "Approved", "Go ahead").
4. **Precision Code Modification**: Apply minimal, surgical diffs. Preserve all existing docstrings, comments, and unrelated business logic.
5. **Verification**: Run the checks the skill names (lint, types, build, scripts, measurements) and report real output. Log the session (§7).
6. **Learn**: Run the learning loop in [learning-loop.md](./learning-loop.md) — capture anything new and reusable into the skill set.

### 1.1 Fast-Path for Micro-Edits

For tiny, uncontroversial adjustments, the full proposal ceremony can be streamlined to prevent friction:
- **Eligibility (ALL must be true):**
  1. Scope: $\le 5$ lines changed within a single file.
  2. Nature: Isolated cosmetic tweak or explicit single instruction (e.g. adjust a Tailwind spacing/color class, fix a typo/label copy, update an icon, or fix a broken import).
  3. Zero Risk: Does NOT touch auth, payment, data stores, API contracts, routing, or public props of shared Primitives/Blocks.
- **Fast-Path Execution:**
  - Skip Step 2 (formal proposal table) and Step 3 (blocking pause for user approval).
  - Execute Step 4 (Precision Edit) directly with minimal surgical diff.
  - Immediately run Step 5 (Verification) and display the applied diff + verification output in that single turn.
  - Execute Step 6 (Learn) if a reusable pattern emerges.

---

## 2. Priority Rubric (use in every report)

| Field | Values | Meaning |
|---|---|---|
| **Impact** | Critical / High / Medium / Low | Critical = security hole, data loss, broken core flow. High = user-visible failure or metric outside budget. Medium = degraded quality. Low = polish. |
| **Effort** | S (< 1 h) / M (1–3 h) / L (> 3 h) | Estimated fix time including verification. |
| **Risk** | Low / Med / High | Chance the fix causes a regression; High if it touches protected areas, shared blocks, routing, or auth. |

Order findings: Impact (desc) → Risk (asc) → Effort (asc). Mark each estimate as an estimate.

Standard finding row:
```markdown
| # | Finding | Location (file:line) | Evidence (observed / measured / inferred) | Impact | Effort | Risk | Proposed fix | Verify by |
```

---

## 3. Skill Architecture & Boundary Principles

> **Core Axiom:** Separate skills when the **DOMAIN / NATURE OF WORK** is different; do NOT separate skills merely because of audit vs. apply modes.

- **`fe-clean` vs. `fe-code`**: `fe-clean` = technical debt, anti-patterns, refactoring existing code. `fe-code` = scaffolding and authoring new code on-pattern.
- All other skills support both Audit (read-only) and Apply (implementation) modes following the protocol above.
- Refer to other skills by plain name ("use the fe-perf skill"), never by tool-specific invocation syntax.

### 3.1 The 4-Layer Architecture Law

> Every decision lives in exactly ONE layer. Style flows downward; features compose — they never paint.

```
[Layer 1: Tokens]      theme variables: colors, fonts, spacing, radius
        ↓
[Layer 2: Primitives]  UI library / base components (from the project profile)
        ↓
[Layer 3: Blocks]      reusable composed widgets — OWN style, props-only, no data fetching
        ↓
[Layer 4: Features]    coordinate data/state, compose Blocks — no custom styling
```

### 3.2 Image-to-Proposal Rule

When the user provides a screenshot, mockup, or bug image and asks for UI changes: inspect it, map regions to source files, propose exact class/code diffs, and wait for approval before editing.

---

## 4. Measure First, Optimize Later

- Never sprinkle `React.memo`, `useMemo`, or `useCallback` speculatively.
- Every performance intervention must be backed by data: React DevTools Profiler, Chrome Performance panel (long tasks > 50 ms), Lighthouse, bundle analyzer output, or field data (RUM).
- Report before/after numbers for every performance change.
- **Optimization Hierarchy (High Leverage First):**
  1. Payload reduction: images, code-splitting, fonts, dependency pruning.
  2. Request latency & waterfall elimination: parallel fetching, cache deduplication, prefetching.
  3. Rendering strategy: SSR / SSG / ISR / streaming.
  4. Main-thread offloading: task slicing, Web Workers, virtualization.
  5. React re-render optimization: state colocation, context splitting, targeted memoization.
  6. Micro-optimizations: final pass only.

---

## 5. Security & Protected Zones

### 5.1 Secrets
- Never print API tokens, connection strings, private keys, passwords, or personal data in output, reports, logs, or learned notes.
- Flag any sensitive environment variable exposed with a public client prefix (`NEXT_PUBLIC_*`, `VITE_*`, `PUBLIC_*`, `REACT_APP_*`).
- Never install packages or change the lockfile without user consent.

### 5.2 Protected Zones
Protected areas come from the project profile. If none is defined, treat these as protected by default and **never modify them without explicit user instruction**:
1. Money, pricing, currency/decimal calculations.
2. Authentication, session, payment, and other sensitive transaction flows.
3. Chart / real-time visualization engines and their configuration.

---

## 6. Domain Boundary Delineation

| Topic | Owner | Not owner |
|---|---|---|
| Measuring CLS / LCP / INP | fe-perf | — |
| Fixing CLS caused by loading states | fe-skel | fe-perf |
| Measured re-render problems | fe-perf | fe-clean (only flags anti-patterns while refactoring) |
| GSAP / ScrollTrigger / canvas / frame rate | fe-motion | fe-perf |
| Form behaviour and copy | fe-ux | fe-code (writes the form code) |
| Optimistic cache logic | fe-data | fe-ux (decides when to be optimistic) |
| Locale formatting, dictionaries, locale routing | fe-i18n | fe-ux |
| `tabular-nums`, `text-balance`, perceived performance | fe-ux | fe-i18n |
| `AsyncContent` 4-state UI | fe-skel | fe-data |
| Theming, dark mode, responsive, container queries | fe-layout | fe-code |
| Release, CI, deploy, observability, SEO | fe-ship | fe-test (runs checks only) |
| Updating this skill set | fe-learn | any other skill (they only capture notes) |

---

## 7. Session Log (optional)

- If the target project has `work_log.md` (or the profile names a log file): read its newest 50–80 lines at session start, and prepend an entry at the end of each task:
  ```markdown
  ### [YYYY-MM-DD HH:mm] <Task Name>
  - **Objective:** <summary of request>
  - **Files Changed:** <relative links>
  - **Decisions:** <rationale>
  - **Status & Next Steps:** <verification state, open items>
  ```
- If there is no log file: report the same fields in the final message. Do not create a log file unless the user asks.

---

## 8. Universal Definition of Done (DoD)

A task is complete only when all applicable criteria are satisfied (profile values override defaults):
- [ ] **Lint & Types**: the project's lint and type-check commands pass with no new errors; no new `any`.
- [ ] **Layout**: spacing follows the profile's scale; rows in a grid align (`h-full` + `mt-auto` pattern when relevant).
- [ ] **Motion**: no idle infinite animations; animation cleanup in place; `prefers-reduced-motion` respected.
- [ ] **Accessibility & Contrast**: WCAG 2.2 AA (text ≥ 4.5:1, large text and UI ≥ 3:1); AAA only if the profile requires it; visible keyboard focus.
- [ ] **Layout Shift**: no new CLS; skeletons mirror real layouts; media has explicit size or aspect ratio.
- [ ] **Cleanliness**: no leftover `console.log`, dead imports, or temporary scripts.
- [ ] **Evidence**: verification output reported; anything not verified is labelled as such.
- [ ] **Learn**: learning loop run (§1 step 6).
