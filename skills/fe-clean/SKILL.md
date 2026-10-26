---
name: fe-clean
description: >
  Audit, detect technical debt, and REFACTOR existing frontend source code: identify code smells,
  SOLID/DRY violations, unnecessary React re-renders, unsafe TypeScript any casting, and dead code.
  Use when: auditing codebase quality, cleaning legacy technical debt, refactoring bloated components (God components),
  or preparing code for pull requests.
  DO NOT USE FOR: Scaffolding or writing new features from scratch (see fe-code);
  DO NOT USE FOR: Initial high-level reconnaissance of unfamiliar repositories (see fe-recon);
  DO NOT USE FOR: In-depth client security or vulnerability audits (see fe-sec).
---

# `fe-clean` — Code Cleanliness Audit & Surgical Refactoring

Specialized skill for detecting code smells, architectural layering breaches, and orchestrating safe, incremental refactoring steps to maximize maintainability. Strictly follows [conventions.md](../fe-andy/references/conventions.md).

---

## 1. Code Smells & Architectural Violations to Flag

1. **4-Layer Architecture Breaches**:
   - Feature components hardcoding CSS styling (borders, custom backgrounds, arbitrary margins).
   - Block components directly dispatching store actions or invoking API queries.
2. **React Anti-Patterns & Re-render Cascades**:
   - Creating inline function/object/array literals in JSX passed down to memoized children.
   - Misusing `useEffect` for derived state synchronization ("You might not need an effect").
   - Using array indexes as `key` attributes on lists with dynamic sorting or deletion.
3. **TypeScript Weaknesses**:
   - Using `any` or coercive assertions (`as unknown as T`).
   - Missing runtime schema validation (Zod) on external API payloads.
4. **General Clean Code Debt**:
   - Bloated functions (> 50 lines), oversized components (> 200 lines), nested conditionals deeper than 3 levels.
   - Magic numbers or strings not declared as named constants.
   - Dead imports and unused variables.

---

## 2. Refactoring Protocol (Safe & Incremental)

1. **Read-Only Audit**: Locate exact file and line ranges, classify severity (Critical / High / Medium / Low), and assess regression risk.
2. **Structured Debt Report**: Formulate targeted micro-refactoring steps rather than sweeping rewrites.
3. **Await User Confirmation**: Only apply modifications upon explicit approval.
4. **Regression Verification**: Run `npm run lint` and `fe-test` to confirm functional preservation.
