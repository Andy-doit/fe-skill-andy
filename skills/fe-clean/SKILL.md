---
name: fe-clean
description: >
  Audit and REFACTOR existing frontend code: code smells, SOLID/DRY violations, layer breaches, unsafe TypeScript
  (any, casts), effect misuse, naming and folder structure, dead code, circular dependencies, lint/format debt,
  and tech-debt prioritization with safe incremental steps.
  Use when: cleaning legacy code, splitting God components, preparing code for review, or planning tech-debt work.
  DO NOT USE FOR: writing new features (see fe-code); first survey of an unfamiliar repo (see fe-recon);
  DO NOT USE FOR: measured performance or re-render problems (see fe-perf); security audits (see fe-sec).
---

# fe-clean — Code Quality Audit & Safe Refactoring

Find code smells and refactor in small, verified steps. Follows [conventions.md](../fe-andy/references/conventions.md).

## Minimum rules (apply even without fe-andy)
- Read `project-profile.md` in the target project first (commands, layers, protected areas).
- Read-only audit → debt report → wait for approval → refactor in small steps → verify after each step.
- No behaviour changes inside a refactor step; never install tools without consent.
- Finish with the learning loop: append new, proven lessons to [references/learned.md](./references/learned.md) after a duplicate check ([learning-loop.md](../fe-andy/references/learning-loop.md)).

---

## 1. What to flag

| Area | Smell | Typical fix |
|---|---|---|
| Layers | Feature components with custom styling; Blocks calling stores/APIs | Move style into a Block; lift data to the Feature |
| Size | Function > 50 lines, component > 200 lines, nesting > 3 levels | Extract components/hooks; early returns |
| React | Derived state in `useEffect`; inline objects into memoized children; index keys on dynamic lists | Compute in render; stable keys (see fe-perf for measured re-renders) |
| TypeScript | `any`, `as unknown as T`, non-null `!` chains, untyped API payloads | Proper types; runtime validation (e.g. Zod) at API boundaries |
| Naming | Vague names (`data2`, `handle`, `temp`), inconsistent casing, folder ≠ component name | Intent-revealing names; follow the project's naming matrix |
| Duplication | Same logic in 3+ places | Extract only when the copies are truly the same concept |
| Constants | Magic numbers/strings | Named constants or tokens |
| Dead code | Unused exports, files, deps, feature flags | Remove after confirming no dynamic use |
| Dependencies | Circular imports, deep cross-feature imports | Restructure modules; public `index` per feature |

## 2. Tooling (use what the project has; ask before adding)

| Check | Command (examples) |
|---|---|
| Lint | project lint script, e.g. `npm run lint` |
| Types | `npx tsc --noEmit` (recommend `strict: true`; `noUncheckedIndexedAccess` where feasible) |
| Format | project formatter check, e.g. `npx prettier --check .` or `npx biome check .` |
| Dead code / unused deps | `knip` if installed |
| Circular dependencies | `madge --circular --extensions ts,tsx src` if installed; or ESLint `import/no-cycle` |
| Search smells | `grep -rn ": any\|as unknown as" src` ; `grep -rn "useEffect" src` then review derived-state effects |

`npx` may download a package — ask first if it is not in `package.json`.

## 3. Refactoring workflow

1. **Audit**: list findings with the conventions rubric (file:line, impact, effort, risk).
2. **Plan**: order as small reversible steps; each step = one smell, one commit-sized diff; note what proves behaviour is unchanged (existing tests, types, a manual check).
3. **Approve**: wait for the user.
4. **Refactor step by step**: after each step run lint + types (+ tests if present). Stop and report if anything fails.
5. **Debt register**: items not fixed now go into a table the user can keep (e.g. `docs/tech-debt.md` if the project wants one): `| Item | Location | Impact | Effort | Risk | Owner | Date |`.

## 4. Output

```markdown
## Debt report — <scope>
| # | Smell | Location | Evidence | Impact | Effort | Risk | Step | Verify by |
Refactor plan: <ordered steps>
Not in scope / deferred: <items>
```

Learned notes: [references/learned.md](./references/learned.md).
