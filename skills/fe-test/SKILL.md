---
name: fe-test
description: >
  Verify frontend source code integrity and prevent regressions through structured testing: build/lint/type-check verification,
  Playwright E2E suites, component testing, axe accessibility audits, and visual regression checks.
  Use when: validating pull requests, performing pre-commit verification, verifying completed tasks,
  or selecting testing tiers based on change risk.
  DO NOT USE FOR: Initial high-level codebase reconnaissance (see fe-recon);
  DO NOT USE FOR: Automatic code generation or fixing (see fe-clean or fe-code).
---

# `fe-test` — Frontend Quality Verification & Regression Defense

Specialized skill for defining and executing tiered verification checks across the codebase, guaranteeing zero functional regression and enforcing the Definition of Done. Strictly follows [conventions.md](../fe-andy/references/conventions.md).

---

## 1. 3-Tier Verification Matrix

Select the appropriate testing tier based on the scope and risk of changes:

| Verification Tier | Scope of Changes | Mandatory Commands | Success Criteria |
|---|---|---|---|
| **Tier 1: Low Risk** | Copy updates, i18n strings, CSS token adjustments, minor styling tweaks | `npm run lint` | Zero errors, zero warnings |
| **Tier 2: Medium Risk**| Component logic edits, form validations, custom hooks, SWR queries, responsive layouts | `npm run lint` + `npm run build` | TypeScript strict check passes, SSR pre-render succeeds |
| **Tier 3: High Risk** | Core architecture refactor, route changes, auth flows, payments, protected modules | Build + Playwright E2E + Axe a11y audit | User flows pass end-to-end, zero accessibility violations |

---

## 2. Verification Protocol

1. **Static Analysis**: Run `npm run lint` and `npx tsc --noEmit` to ensure type soundness.
2. **Build Verification**: Execute `npm run build` (Turbopack) to validate server-side rendering and module resolution.
3. **Accessibility Audit**: Run axe-core checks on critical views to ensure ARIA and label compliance.
4. **Structured Reporting**: Document verification results and exit codes in `work_log.md`.
