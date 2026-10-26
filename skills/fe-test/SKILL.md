---
name: fe-test
description: >
  Verify frontend changes and write tests: choose a verification tier by risk, run lint/type/build, unit tests,
  component tests, E2E (Playwright), automated accessibility checks (axe), and visual regression; report real results.
  Use when: verifying a finished task, preparing a pull request, adding tests for new or changed code,
  or deciding how much testing a change needs.
  DO NOT USE FOR: first survey of a repo (see fe-recon); fixing the code under test (see fe-clean or fe-code);
  DO NOT USE FOR: CI/CD pipeline and release setup (see fe-ship).
---

# fe-test — Verification & Tests

Pick the right depth of checking, run it, and report exactly what passed. Follows [conventions.md](../fe-andy/references/conventions.md).

## Minimum rules (apply even without fe-andy)
- Read `project-profile.md` in the target project first (package manager, scripts, test tools). Use the project's own scripts; detect the package manager from the lockfile (`package-lock.json` → npm, `pnpm-lock.yaml` → pnpm, `yarn.lock` → yarn, `bun.lockb`/`bun.lock` → bun).
- Never install test tools or change the lockfile without consent.
- Report real exit codes and failures; never claim "all green" without output.
- Finish with the learning loop: append new, proven lessons to [references/learned.md](./references/learned.md) after a duplicate check ([learning-loop.md](../fe-andy/references/learning-loop.md)).

---

## 1. Tiers by risk

| Tier | Change type | Required checks |
|---|---|---|
| 1 Low | Copy, i18n strings, token tweaks, small styles | Lint; i18n parity script if messages changed (fe-i18n) |
| 2 Medium | Component logic, hooks, forms, data queries, responsive layout | Tier 1 + type-check + unit/component tests for touched code + build |
| 3 High | Architecture, routing, auth, payments, protected modules, dependency upgrades | Tier 2 + E2E for affected flows + axe checks on affected pages + visual regression if set up |

## 2. Commands (adapt to the project's scripts)

```bash
<pm> run lint
npx tsc --noEmit
<pm> run test            # unit/component (Vitest or Jest)
<pm> run build
npx playwright test      # E2E, if Playwright is in devDependencies
```
`npx` may download a package if it is not installed — check `package.json` first.

## 3. Writing tests

Recipes and examples: [test-recipes.md](./references/test-recipes.md) — unit (pure logic), component (Testing Library: query by role/label, user-event), E2E (Playwright with role locators), axe in Playwright, visual snapshots, mocking network (MSW or route interception).

Storybook projects: `play` interaction tests and the a11y addon run as part of the test suite (Vitest addon) and count toward Tier 2 for Blocks; stories and their rules are authored under fe-code ([component-docs.md](../fe-code/references/component-docs.md)); visual regression can target stories instead of pages. Time-dependent tests pin `TZ` and locale (fe-i18n dates-time-zones.md §6).

What to test for a change:
- Pure logic (formatters, reducers, validators): unit tests with edge cases.
- Component behaviour: renders each state (loading/empty/error/content), handles user input, calls callbacks.
- Critical user flows (login, checkout, main create/edit): E2E.
- Do not snapshot whole component trees as the main assertion.

## 4. Report

```markdown
| Check | Command | Exit | Result / notes |
|---|---|---|---|
| Lint | pnpm run lint | 0 | 0 errors |
| Types | npx tsc --noEmit | 2 | 3 errors in src/x.ts (pre-existing? yes/no) |
Not run: <checks skipped and why>
```
Separate pre-existing failures (present on the base branch) from new ones when possible.

Learned notes: [references/learned.md](./references/learned.md).
