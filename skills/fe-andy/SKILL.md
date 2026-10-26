---
name: fe-andy
description: >
  Router and shared conventions for the fe-skill-andy frontend skill set.
  Use when: the user asks for an overview, does not know which frontend skill fits, asks about the shared
  workflow (audit → proposal → approval → edit → verify → learn), the project profile, the priority rubric,
  or the Definition of Done.
  DO NOT USE FOR: any concrete frontend task — route it to the owning skill listed in this hub
  (fe-perf, fe-motion, fe-layout, fe-contrast, fe-skel, fe-clean, fe-code, fe-ux, fe-sec, fe-i18n,
  fe-test, fe-recon, fe-a11y, fe-data, fe-ship, fe-pwa, fe-mfe, fe-viz, fe-review, fe-learn).
---

# fe-andy — Router

Pick one skill, then follow it. Every skill uses the shared rules in [conventions.md](./references/conventions.md): project profile first, 6-step protocol, priority rubric, boundaries, Definition of Done, and the [learning loop](./references/learning-loop.md).

## Routing table

| Skill | Use for | Typical requests |
|---|---|---|
| fe-recon | Read-only survey of an unfamiliar repo | "map this project", "what stack is this" |
| fe-perf | Load + runtime performance, Core Web Vitals, Next.js rendering/caching | "slow page", "LCP 3.8 s", "bundle too big", "re-renders" |
| fe-motion | Animation, GSAP/ScrollTrigger, canvas/WebGL, frame rate | "scroll jank", "animation stutters" |
| fe-layout | Spacing, grid/flex alignment, responsive, theming, dark mode | "cards uneven", "fix spacing", "dark mode" |
| fe-contrast | Measured colour contrast | "is this text readable", "check WCAG contrast" |
| fe-a11y | Keyboard, focus, ARIA, semantics, screen readers, WCAG 2.2 | "can't tab into modal", "a11y audit" |
| fe-skel | Skeletons and loading/empty/error states | "loading flicker", "add skeleton" |
| fe-data | Fetching, caching, cancellation, retry, pagination, realtime | "abort stale request", "waterfall", "websocket reconnect" |
| fe-ux | UX review/brainstorm, forms, UX writing, perceived performance | "propose layouts", "improve form UX", "error message copy" |
| fe-i18n | Dictionaries, locale formatting, locale routing | "missing translation", "format currency" |
| fe-sec | XSS sink audit, secrets + secret quality, source-map leakage, headers/CSP, frontend auth (UI is only affordance), supply chain, Electron/Tauri hardening, pre-deploy security gate | "security audit", "token storage", "are source maps public?", "harden our Electron app", "is this admin check enough?" |
| fe-clean | Refactor existing code, tech debt, code smells | "clean up this component" |
| fe-code | Author new components/features on-pattern | "create a new card block" |
| fe-test | Run and choose verification tiers, write tests | "verify before PR", "add tests" |
| fe-ship | Release, CI/CD, env, observability, SEO | "release checklist", "add Sentry", "sitemap" |
| fe-pwa | Service worker, offline caching, outbox/Background Sync, SW updates, manifest, installability | "work offline", "stale version after deploy", "make it installable" |
| fe-mfe | Micro-frontends, Module Federation, Multi-Zones, shared deps, independent deploys | "split the frontend per team", "remote fails to load", "React loaded twice" |
| fe-viz | Charts, KPI tiles, sparklines, dashboards: chart choice by question, encoding/colour, SVG/Canvas/WebGL, chart library, chart a11y and performance | "add a revenue chart", "which chart library", "chart is slow / unreadable", "chart fails axe" |
| fe-review | Validate a pattern, library, architecture decision, or advice against current standards; verdict + improved version | "is this still best practice?", "review this recommendation", "should we adopt X?" |
| fe-learn | Collect new knowledge from a project/session → check duplicates → plan → user approves → update skills or add a new skill | "learn", "remember this", "update the skills from this project", "create a skill for X" |

Invoke a skill by name in whatever way your agent supports. Routing test cases: [evals/routing.md](./evals/routing.md).

**Process requests** ("write an ADR", "PR template", "how should we branch", "review this PR as a reviewer") are handled here with [engineering-workflow.md](./references/engineering-workflow.md); pattern disputes inside a review go to fe-review.

**Validate major decisions:** before treating a new pattern, library, or architecture choice as standard (a state library, micro-frontends, an offline strategy, a framework major upgrade, advice from a tutorial or an AI answer), run it through fe-review. fe-learn also runs fe-review before promoting learned notes into a skill.

## Shared files

- [conventions.md](./references/conventions.md) — rules every skill follows
- [learning-loop.md](./references/learning-loop.md) — how each use of a skill adds new knowledge
- [project-profile.template.md](./references/project-profile.template.md) — per-project settings to copy into the target repo
- [playbooks.md](./references/playbooks.md) — end-to-end phase order for a static site vs a dynamic app, with route rendering matrix
- [case-study-ecommerce.md](./references/case-study-ecommerce.md) — A–Z plan: e-commerce storefront (structure, decisions, every skill in order, gates)
- [engineering-workflow.md](./references/engineering-workflow.md) — branching, conventional commits, rebase/bisect/worktree, PR template, code-review order and comment labels, ADR template, RFC-lite, planning
- [learned.md](./references/learned.md) — learned notes about routing and shared conventions
- [scripts/check-skills.mjs](./scripts/check-skills.mjs) — skill-set health check (`node scripts/check-skills.mjs` from this folder, or pass the skills root path)
