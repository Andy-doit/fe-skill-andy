---
name: fe-ship
description: >
  Ship and operate frontend apps: release checklist, CI/CD pipeline steps, environment variables per environment,
  monorepo layout and internal package publishing, A/B experimentation mechanics, frontend incident response and
  postmortems,
  Docker for frontend, rollback, error tracking and logging, analytics events, consent and privacy, browser/device
  support matrix, and SEO (metadata, canonical, sitemap, robots, structured data, hreflang).
  Use when: preparing a release, setting up or reviewing CI/deploy, adding error tracking or analytics, handling
  cookie consent, or fixing SEO metadata.
  Owns the release gate that keeps source maps and secrets out of production artifacts.
  DO NOT USE FOR: performance tuning (see fe-perf); security audits, headers and sink reviews (see fe-sec);
  DO NOT USE FOR: running the test suite for a change (see fe-test).
---

# fe-ship — Release, Operations & SEO

Get changes to users safely and see what happens after. Follows [conventions.md](../fe-andy/references/conventions.md).

## Minimum rules (apply even without fe-andy)
- Read `project-profile.md` in the target project first (host, CI, environments, analytics/consent tools).
- Read-only review first; propose; wait for approval. Deploys, releases, and production config changes are user-owned — never trigger them without explicit instruction.
- Never print secrets; never send personal data to analytics or error tracking.
- Finish with the learning loop: append new, proven lessons to [references/learned.md](./references/learned.md) after a duplicate check ([learning-loop.md](../fe-andy/references/learning-loop.md)).

---

## 1. Release checklist

- [ ] fe-test tier for the change passed (output attached)
- [ ] Build from a clean install with the lockfile (`npm ci` / frozen lockfile)
- [ ] Env vars set for the target environment; no secret uses a public prefix; production secrets pass fe-sec `check-env-secrets.mjs` (≥ 32 chars, no defaults)
- [ ] DB/API changes deployed first or backward compatible
- [ ] Feature flags default safe; risky features behind a flag
- [ ] **No source maps in the public build output** — fe-sec `check-build-output.mjs` passes on the production build; a request for `<chunk>.js.map` on staging returns 404/403 ([ci-cd.md §6](./references/ci-cd.md))
- [ ] Error tracking release/version tagged; source maps uploaded privately to the tracker and deleted from the artifact (or `hidden` maps + `*.map` blocked at the server/CDN)
- [ ] fe-sec pre-deploy gate passed: sink audit, role-gated actions mapped to server checks, dependency audit; desktop checklist if packaged with Electron/Tauri
- [ ] Performance budget check passed (fe-perf)
- [ ] Rollback path known: previous build/artifact id or host "instant rollback"
- [ ] Changelog / release notes written
- [ ] Post-deploy smoke test list ready (login, main flow, payments if any)

## 2. CI/CD and environments

Details and examples: [ci-cd.md](./references/ci-cd.md) — pipeline stages, caching, preview deploys, env handling, Docker multi-stage build, rollback, and **source-map policy for production** (§6: per-bundler settings, tracker upload-then-delete, server/CDN block, CI gate).

**Monorepo and internal packages:** [monorepo-packages.md](./references/monorepo-packages.md) — pnpm workspaces + Turborepo layout, compiled vs just-in-time package shape (`exports`, ESM-only, peer React), changesets + `publint`/`attw` publish gates, affected-only CI.

**Security gates in the pipeline** (owned by fe-sec, run by the pipeline): after the production build, run `check-build-output.mjs` (no `*.map`, no secrets or server-only env values in client chunks) and `check-env-secrets.mjs` on the production env; fail the release on any error. Desktop builds (Electron/Tauri) add an archive inspection step: no `.map`, `.env*` or devtools flags inside the packaged app.

## 3. Observability, analytics, consent

Details: [observability.md](./references/observability.md) — error boundaries + tracker setup, scrubbing PII, web-vitals reporting, analytics event naming, consent gating, browser support matrix.

**Experimentation (A/B)** (same file, §8): server/edge assignment with no flicker, sticky bucketing, exposure events, guardrail metrics, parity, cleanup.

**Incidents:** [incidents.md](./references/incidents.md) — severity table, first-15-minutes checklist, mitigation decision tree (rollback → flag → third-party → SW kill switch → CDN → backend), frontend failure catalogue, status-update and blameless-postmortem templates, preparedness checklist. Rollbacks and production changes stay human-owned.

**Advanced observability** (same file, §7): OpenTelemetry browser tracing with trace context propagated to the backend, RUM with INP attribution, release-health and regression gates, SLOs and error budgets for frontend, source-map hygiene, structured client logs, alert design, and tagging per micro-frontend remote (fe-mfe) and service-worker version (fe-pwa).

## 4. SEO

Details: [seo.md](./references/seo.md) — titles/descriptions, canonical, Open Graph, robots, sitemap, structured data, hreflang, rendering for crawlers.

## 5. Output

```markdown
## Release readiness — <version/date>
| Item | Status (✓/✗/n.a.) | Evidence |
Blockers: <list>
Rollback: <how>
Post-deploy checks: <list>
```

Learned notes: [references/learned.md](./references/learned.md).
