# fe-skill-andy — Usage Guide for AI Agents and Engineers

Vietnamese guide with per-skill prompts: [HUONG-DAN-SU-DUNG.md](./HUONG-DAN-SU-DUNG.md). Install: [README.md](./README.md#install).

## 1. Overview

fe-skill-andy has 21 skills for frontend engineering from Senior to Principal level. It covers UX, UI, accessibility, performance, data, security, code quality, testing, shipping, offline/PWA, micro-frontends, data visualization, and a knowledge reviewer that validates everything else. Coverage: a 2026-10-26 re-assessment against a 95-item Senior Frontend competency map found ~60 % fully covered, ~25 % partly, ~15 % missing. v2.4 closed the five missing gaps (API contracts, login protocols, modern CSS, Next.js routing conventions, engineering workflow); v2.5 closed the partial ones (dates/time zones, file handling, Storybook, monorepo/packages, A/B experimentation, incident response, progressive enhancement, Web Components interop). What remains is in [audit/coverage-report.md](./audit/coverage-report.md) §0. These figures are a self-assessment by file inspection, not an external benchmark.

**Out of scope by design:** backend/API implementation and databases; React Native/Capacitor; design work inside Figma; print/email templates; offensive security or reverse engineering.

Works for:
- **Static sites**: marketing, docs, blogs, SSG/ISR, static export.
- **Dynamic web apps**: SaaS dashboards, e-commerce, authenticated apps, realtime, offline-first, multi-team platforms.
- **Frameworks**: Next.js (App Router preferred), Vite + React, plain React (custom webpack/Rspack; CRA is deprecated, so migrate), Remix / React Router framework mode (use the Vite + React guidance plus the framework's docs).

Every skill reads the target project's `project-profile.md` first and follows the audit-first protocol (read → propose → approval → edit → verify → learn) in [conventions.md](./skills/fe-andy/references/conventions.md).

## 2. All skills

| # | Skill | Domain | New in 2.2 |
|---|---|---|---|
| 1 | [fe-andy](./skills/fe-andy/SKILL.md) | Router, shared conventions, project profile, DoD, health check, playbooks, engineering workflow (git/PR/review/ADR) | updated (2.4) |
| 2 | [fe-recon](./skills/fe-recon/SKILL.md) | Read-only survey of an unfamiliar repo | |
| 3 | [fe-perf](./skills/fe-perf/SKILL.md) | Core Web Vitals, bundle, rendering strategy, Next.js caching, re-renders | |
| 4 | [fe-motion](./skills/fe-motion/SKILL.md) | Animation, View Transitions, scroll-driven animations, FLIP, Motion vs GSAP, canvas/WebGL, reduced motion | updated (2.4) |
| 5 | [fe-layout](./skills/fe-layout/SKILL.md) | Spacing, responsive, container queries, tokens, theming, dark mode, modern CSS (@layer, :has(), popover/anchor, @starting-style) | updated (2.4) |
| 6 | [fe-contrast](./skills/fe-contrast/SKILL.md) | Measured WCAG contrast | |
| 7 | [fe-a11y](./skills/fe-a11y/SKILL.md) | Keyboard, focus, ARIA, screen readers, WCAG 2.2 AA | |
| 8 | [fe-skel](./skills/fe-skel/SKILL.md) | Skeletons, loading/empty/error states | |
| 9 | [fe-data](./skills/fe-data/SKILL.md) | API contracts (OpenAPI/GraphQL/tRPC/BFF, one error shape), fetching, caching, cancellation, retry, realtime, in-tab offline | updated (2.4) |
| 10 | [fe-ux](./skills/fe-ux/SKILL.md) | UX review/brainstorm, forms, UX writing | |
| 11 | [fe-i18n](./skills/fe-i18n/SKILL.md) | Dictionaries, Intl formatting, locale routing, dates & time zones (instant/zoned/plain, DST, Temporal vs date-fns, hydration-safe) | updated (2.5) |
| 12 | [fe-sec](./skills/fe-sec/SKILL.md) | XSS sink audit, CSP, secrets + secret quality, source-map leakage, frontend auth (UI is only affordance; OAuth/OIDC + PKCE, SSO, passkeys), supply chain, Electron/Tauri hardening, pre-deploy security gate | updated (2.4) |
| 13 | [fe-clean](./skills/fe-clean/SKILL.md) | Refactoring, tech debt, TypeScript strictness | |
| 14 | [fe-code](./skills/fe-code/SKILL.md) | New code on the 4-layer architecture, state placement, Advanced TypeScript, Next.js routing conventions, files (upload/download/clipboard/DnD), Storybook stories, progressive enhancement, Web Components interop | updated (2.5) |
| 15 | [fe-test](./skills/fe-test/SKILL.md) | Verification tiers, unit/component/E2E/axe/visual, Storybook interaction tests in CI, TZ-pinned tests | updated (2.5) |
| 16 | [fe-ship](./skills/fe-ship/SKILL.md) | Release, CI/CD, observability (+ OTel, RUM, SLOs), SEO, source-map policy + security gates, monorepo & package publishing, A/B experimentation, incident response | updated (2.5) |
| 17 | [fe-pwa](./skills/fe-pwa/SKILL.md) | Service workers, Workbox strategies, offline outbox, SW updates, manifest | **new** |
| 18 | [fe-mfe](./skills/fe-mfe/SKILL.md) | Micro-frontends, Module Federation, Multi-Zones, shared deps | **new** |
| 19 | [fe-review](./skills/fe-review/SKILL.md) | Validate patterns, libraries, decisions, advice against current standards | **new** |
| 20 | [fe-learn](./skills/fe-learn/SKILL.md) | Grow the skill set: collect → check → plan → approve → apply | |
| 21 | [fe-viz](./skills/fe-viz/SKILL.md) | Chart by question, encoding/colour, SVG/Canvas/WebGL, chart libraries, accessible and fast charts, KPI tiles, sparklines, dashboards | **new (2.6)** |

## 3. Skills by project type

● = primary, ○ = when relevant, — = rarely. **R** marks the points where fe-review must run.

| Skill | Static marketing / docs | Content site (SSG/ISR, i18n) | SaaS dashboard (auth, dynamic) | E-commerce | Offline-first / field app | Multi-team platform |
|---|---|---|---|---|---|---|
| fe-recon | ○ | ○ | ● | ● | ● | ● |
| fe-perf | ● | ● | ● | ● | ○ | ● |
| fe-motion | ● | ○ | — | ○ | — | — |
| fe-layout / fe-contrast / fe-a11y | ● | ● | ● | ● | ● | ● |
| fe-skel / fe-data | — | ○ | ● | ● | ● | ● |
| fe-ux | ● | ○ | ● | ● | ● | ○ |
| fe-i18n | ○ | ● | ○ | ● | ○ | ○ |
| fe-sec | ○ | ○ | ● | ● | ● | ● |
| fe-code / fe-clean / fe-test | ○ | ○ | ● | ● | ● | ● |
| fe-ship (incl. SEO) | ● | ● | ● | ● | ● | ● |
| fe-pwa | ○ (offline page only) | ○ | ○ | ● (catalog) | ● | ○ |
| fe-mfe | — | — | ○ (plugins) | ○ | — | ● |
| fe-viz | — | ○ | ● | ● (admin, analytics) | ○ | ○ |
| **fe-review** | R: new libs | R: rendering strategy | R: state lib, auth pattern | R: caching, checkout security | R: SW tooling, sync strategy | R: MFE decision, shared-dep policy |

**When to trigger fe-review (always):**
- adopting a library, framework major, bundler, or architecture
- applying advice from a tutorial, an old codebase, a ticket, or an AI answer
- when two skills or two engineers disagree
- before fe-learn promotes notes into a skill
- when a recommendation cites versions that are behind the project profile

### 3.1 Security gates — when the agent must trigger fe-sec

Defensive only: fe-sec hardens what the frontend ships. It contains no offensive or reverse-engineering content.

| Trigger | What to run | Output expected |
|---|---|---|
| Before merge to the release branch, and on the release candidate | fe-sec §4 pre-deploy gate: sink grep + sink inventory, `check-env-secrets.mjs`, production build → `check-build-output.mjs`, dependency audit, header check | Gate table all ✓, exceptions with owner + date |
| Release (fe-ship checklist) | Same gate + `curl -sI …/<chunk>.js.map` → 404/403 on staging | Release-readiness row "source maps" = ✓ with evidence |
| Adding or upgrading a dependency | fe-sec checklist §6 (name, maintainers, install scripts, advisories); fe-review §4.6 for new libraries | Review note in the PR |
| Any `dangerouslySetInnerHTML` / `innerHTML` / `v-html` / `eval` added | fe-sec checklist §8 sink decision table; entry in the sink inventory | Sanitizer named, reviewer + date |
| Role-gated UI, Server Action, route guard, middleware touched | fe-sec auth-frontend.md §0: name the server check behind every client-side condition | "UI is only affordance" review table |
| Source-map or error-tracker config touched | fe-ship ci-cd.md §6: mode A (no maps) or B (hidden + upload + delete + CDN block) | Mode recorded in `project-profile.md` |
| Project contains `electron`, `@electron/*`, `src-tauri/` or `@tauri-apps/*` | fe-sec desktop-apps.md: Electron §1.7 or Tauri §2.6 checklist, plus the packaged-archive inspection | Checklist all ✓; renderer has no `window.require`/`process`/`ipcRenderer` |
| User HTML, uploads, deep links, `postMessage` | fe-sec checklist §5 + §8 | Allow-lists and sanitizers named |

**Four security rules every skill respects** (full text: fe-sec §2):
1. **UI is only affordance.** Client-side guards (roles in components, decoded JWTs, feature flags, middleware redirects) are UX. Every sensitive action is enforced on the server.
2. **Source maps never reach production users.** No `*.map` in the public artifact; private upload-then-delete or hidden maps + server block.
3. **Every XSS sink is inventoried before release.** New sinks fail the gate until reviewed and sanitized.
4. **A desktop shell is a browser with OS access.** `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`, a narrow typed preload bridge, every IPC message validated in the main process; Tauri capabilities scoped per window.

### 3.2 Starting a new project end to end
- Static site or dynamic app: phase order, skills per phase, folder skeletons, "Done" lists → [playbooks.md](./skills/fe-andy/references/playbooks.md)
- Full worked plan (hybrid e-commerce, phases 1–21: decisions, tasks, outputs, gates) → [case-study-ecommerce.md](./skills/fe-andy/references/case-study-ecommerce.md)

## 4. Recommended reading order for AI agents

1. [conventions.md](./skills/fe-andy/references/conventions.md): protocol, rubric, boundaries, DoD (always).
2. Target project's `project-profile.md`. If it is missing, run fe-recon to draft one.
3. [fe-andy](./skills/fe-andy/SKILL.md) router table: pick **one** owning skill.
4. The owning skill's SKILL.md, then only the references it links for the task.
5. fe-review for any new pattern or decision the task introduces.
6. fe-test for the verification tier, and fe-ship if it is going to production.
7. [learning-loop.md](./skills/fe-andy/references/learning-loop.md) at the end of the task.

Load one owning skill and the references it links. Do not load the whole set into context.

## 5. Core rule

> **Before treating any new pattern as standard, run it through fe-review.**
> A pattern is "standard" only after fe-review returns **Still Best Practice** (or **Acceptable** with the scope written down), backed by at least one `[Verified]` or `[Measured]` source. Learned notes without that are kept with `Status: needs-evidence`.

## 6. Cross-link rules

1. **One rule, one owner.** The owner is listed in the boundary table ([conventions.md §6](./skills/fe-andy/references/conventions.md)). Other skills link to it and do not copy it.
2. **Refer to skills by plain name** ("use the fe-pwa skill"). Never use tool-specific slash syntax.
3. **Relative links only**, sibling style (`../fe-pwa/SKILL.md`). No absolute paths. The health check enforces this.
4. **Bidirectional boundaries:** when a new skill takes a topic, both skills' `DO NOT USE FOR` lines name each other (e.g. fe-data ↔ fe-pwa).
5. **fe-review links to every skill.** Every skill that makes decisions (fe-andy, fe-code, fe-learn) points to fe-review.
6. **Routing evals** in [routing.md](./skills/fe-andy/evals/routing.md) get at least 2 cases per new skill, covering its nearest neighbour.

## 7. Quick decision flow

```
Request arrives
├─ Unknown repo? ───────────────────────────────→ fe-recon (then continue)
├─ "Is X still right / should we adopt X?" ─────→ fe-review
├─ Grow/update the skill set? ──────────────────→ fe-learn (runs fe-review on candidates)
├─ Slow / metrics / bundle / hydration ─────────→ fe-perf   (frame stutter → fe-motion)
├─ Data fetch, cache, race, realtime ───────────→ fe-data
│    └─ must survive reload / no network ───────→ fe-pwa
├─ Several teams, independent deploys, remotes ─→ fe-mfe   (validate decision with fe-review)
├─ Looks wrong: spacing/theme → fe-layout · contrast → fe-contrast · loading → fe-skel
├─ Can't use it: keyboard/SR → fe-a11y · flow/copy → fe-ux · locale → fe-i18n
├─ Security, auth, secrets, deps, source maps ──→ fe-sec   (Electron/Tauri packaging → fe-sec desktop-apps.md)
├─ New code / new route or modal route → fe-code · existing mess → fe-clean
├─ API client, OpenAPI/GraphQL/tRPC wiring ───────→ fe-data   (login/OIDC/PKCE → fe-sec)
├─ ADR, PR template, branching, review a PR ──────→ fe-andy (engineering-workflow.md)
├─ Wrong day/time for some users, DST ────────────→ fe-i18n (dates-time-zones.md)
├─ Upload / download / clipboard / drag-drop ─────→ fe-code (files.md; server limits → fe-sec)
├─ Stories for blocks ───────────────────────────→ fe-code (component-docs.md; run in CI → fe-test)
├─ Monorepo, publish a package, A/B test, incident → fe-ship
├─ Chart, KPI tile, sparkline, dashboard, chart lib → fe-viz   (canvas stutter → fe-motion; palette contrast → fe-contrast)
└─ Verify → fe-test · release/observe/SEO → fe-ship
```

## 8. Maintenance notes

- **Health check** after any change under `skills/`: `node skills/fe-andy/scripts/check-skills.mjs`. It must report `PASS`.
- **Size budgets:** SKILL.md ≤ 500 lines (hard warning). Domain skills should stay short and push detail into `references/`. fe-pwa, fe-mfe and fe-review are 200–350 lines on purpose, because their decision tables are the content.
- **Version drift:** facts that depend on versions go stale fastest: Serwist/Turbopack support, Module Federation plugin options, `@module-federation/nextjs-mf` status, Next.js caching and middleware/proxy naming, React Compiler status, Electron `webPreferences` defaults and Fuse names, Tauri v2 capability/config keys, error-tracker source-map plugin options, React `<ViewTransition>` stability, CSS anchor-positioning/scroll-driven-animation Baseline status, Next.js `proxy.ts` rename, OpenAPI/GraphQL codegen package names, Temporal browser support (Safari), Storybook addon/import names per major, flags-SDK package for experiments. Re-run fe-review on them at every framework major, or every 6 months.
- **Security scope:** fe-sec stays defensive. Do not add offensive tooling, exploitation steps or reverse-engineering content to the skill set; a finding describes the risk, the fix and how to verify the fix.
- **Learning loop:** each skill appends notes to its own `references/learned.md`. fe-learn promotes them only after user approval and an fe-review pass.
- **Adding a skill:** use [skill-template.md](./skills/fe-learn/references/skill-template.md). Update the router table, the boundary table, the routing evals, this file, the README table, and re-run the installer.
- **Release:** bump `version` in `.claude-plugin/plugin.json` when skills are added or boundaries change, and log the change in [work_log.md](./work_log.md).
