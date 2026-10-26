# Universal Frontend Agent Conventions (`fe-skill-andy`)

Core governance and engineering standards applied across all skills in the `fe-skill-andy` ecosystem. All skills reference this document as the Single Source of Truth (SSOT).

---

## 1. Mandatory 5-Step Protocol (Audit-First Workflow)

Every code modification and enhancement task must strictly adhere to this 5-step sequence:

```
[1. Read-Only Audit & Inspection]
               ↓
[2. Breakdown & Structured Proposal]
               ↓
[3. Await User Review & Approval]
               ↓
[4. Precision Code Modification (Apply)]
               ↓
[5. Verification & work_log.md Update]
```

1. **Read-Only Audit & Inspection**: Never modify code prior to inspection. Explicitly distinguish between:
   - **"Observed in code"**: Specific file path, line numbers, and existing implementation.
   - **"Inferred / Requires measurement"**: Hypotheses regarding server latency, CDN caching, or runtime profiler bottlenecks.
2. **Breakdown & Structured Proposal**: Present findings clearly:
   - Target files and exact line ranges.
   - Impact level: **Critical / High / Medium / Low**.
   - Remediation cost and associated regression risks.
3. **Await User Approval**: Pause and solicit confirmation. Only proceed to code edits upon explicit approval ("Proceed", "Approved", "Go ahead").
4. **Precision Code Modification**: Apply minimal, surgical diffs. Preserve all existing docstrings, comments, and unrelated business logic.
5. **Verification & Work Log**: Run build, lint, and type-checks; log session entries in `work_log.md` immediately upon completion.

---

## 2. Skill Architecture & Boundary Principles

> **Core Axiom:** Separate skills when the **DOMAIN / NATURE OF WORK** is different; do NOT separate skills merely because of audit vs. apply modes.

- **`fe-clean` vs. `fe-code`**: Maintained as distinct skills because their objectives are fundamentally different:
  - `fe-clean`: Dedicated to **Technical Debt, Anti-Patterns & Refactoring** (identifying code smells, pruning dead code, enforcing TypeScript strictness, breaking down God components).
  - `fe-code`: Dedicated to **Scaffolding & Authoring New Features** (generating new components, hooks, resilient Server Actions, Redux/Zustand slices on-pattern from day one).
- All other skills (`fe-layout`, `fe-skel`, `fe-perf`, `fe-motion`, `fe-sec`, `fe-i18n`) natively support both Audit (read-only inspection) and Apply (implementation) modes following the 5-step protocol.

---

## 3. Measure First, Optimize Later (Measurement-Driven Performance)

- Never sprinkle `React.memo`, `useMemo`, or `useCallback` speculatively.
- Every performance intervention must be backed by quantifiable diagnostic data:
  - React DevTools Profiler (Render frequency, commit phase duration).
  - Chrome DevTools Performance / Coverage (Long Tasks > 50ms, Layout Thrashing).
  - Bundle Analyzer stats (Net KB bundle delta).
- **Optimization Hierarchy (High Leverage First):**
  1. Payload Reduction: Modern image compression (WebP/AVIF), bundle code-splitting, font subsetting, dependency pruning.
  2. Request Latency & Waterfall Elimination: Parallel data fetching (`Promise.all`), SWR/TanStack cache deduplication, hover prefetching.
  3. Rendering Strategy: Optimal selection between SSR, SSG, ISR, and Streaming SSR.
  4. Main-Thread Offloading: Task slicing, Web Workers, long-list virtualization (`TanStack Virtual`).
  5. React Re-render Optimization: State colocation, context selectors, targeted memoization.
  6. Micro-optimizations: Final pass only.

---

## 4. Security & Protected Zones

### 4.1 Client-Side Data & Secret Protection
- Never print API tokens, database connection strings, private keys, or passwords in output logs.
- Immediately flag any sensitive environment variables improperly prefixed with public client tags (`NEXT_PUBLIC_*` or `VITE_*`).
- Never introduce heavyweight external npm packages without user consent.

### 4.2 Protected Zones
> **WARNING:** The following functional areas are designated as strictly protected. Agents **MUST NEVER MODIFY** these areas without explicit, written user instruction:
1. **Financial & Valuation Modules**: Financial data tables, M&A transaction pipelines, currency/decimal calculations.
2. **Chart & Real-Time Visualization Engines**: WebGL/SVG canvas chart configurations, real-time streaming tickers.
3. **Authentication & Sensitive Transaction Flows**: Session management, cookie validation, SMTP mailers, payment flows.

---

## 5. Domain Boundary Delineation

- **`fe-i18n` Owns:**
  - Regional locale formatting for currency, dates, and numbers (e.g. `vi-VN` via `Intl.NumberFormat`).
  - Bilingual/multilingual dictionary parity (`en.json` vs `vi.json`).
  - Router pathname, search params, and anchor `#hash` preservation during locale toggles.
- **`fe-ux` Owns:**
  - Numerical tabular styling: `tabular-nums` ensuring fixed-width digits in dashboards/tables to avoid jitter.
  - Typographic visual balancing: `text-balance` preventing orphaned words in headings.
  - Perceived performance, Nielsen heuristics, keyboard shortcuts, inline form validation ergonomics.
- **`fe-skel` Owns:**
  - `AsyncContent` multi-state conventions (loading / error / empty / content).
  - 1:1 pixel-accurate ghost skeleton layouts (CLS = 0).

---

## 6. Session Continuity & `work_log.md` Protocol

`work_log.md` at the repository root serves as the immutable Single Source of Truth for ongoing development:

### 6.1 Session Bootstrap (Start of Session)
- Read the first **50–80 lines** of `work_log.md` to establish context:
  - What was accomplished in the preceding session?
  - Which files were recently modified?
  - Which architectural decisions were locked in?
  - What pending items or blockers require continuation?

### 6.2 Task Wrap-Up (End of Task)
- Prepend a new entry at the **TOP** of the list (Newest First) using this standard format:
  ```markdown
  ### [YYYY-MM-DD HH:mm] <Task Name / Brief Title>
  - **Objective / Requirements:** <Summary of user request>
  - **Files Changed:**
    - Created / Modified: <clickable markdown file links>
  - **Architectural & Design Decisions:** <Technical rationale and rules applied>
  - **Status & Next Steps:** <Current verification state and upcoming roadmap>
  ```

---

## 7. Universal Definition of Done (DoD)

A task is officially complete only when all criteria are satisfied:
- [x] **Lint & Types**: `npm run lint` passes with 0 errors/warnings; TypeScript strict compliance without `any`.
- [x] **Pixel-Precision**: Adherence to 4px spacing scale (`0·2·3·4·6`), equal row heights (`h-full` + `mt-auto`).
- [x] **Motion & GPU Hygiene**: Zero idle spinning, ScrollTrigger cleanup (`clearProps`, `once: true`), `prefers-reduced-motion` enabled.
- [x] **Accessibility & Contrast**: WCAG AA (≥ 4.5:1) and AAA (≥ 7.0:1 for primary text); visible keyboard focus rings.
- [x] **Zero Layout Shift**: CLS = 0; skeletons mirror real layouts 1:1; media elements have explicit aspect ratios.
- [x] **Cleanliness**: No leftover `console.log`, dead imports, or orphaned temporary scripts.
- [x] **Work Log**: Comprehensive entry recorded in `work_log.md`.
