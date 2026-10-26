---
name: fe-ship
description: >
  Ship and operate frontend apps: release checklist, CI/CD pipeline steps, environment variables per environment,
  Docker for frontend, rollback, error tracking and logging, analytics events, consent and privacy, browser/device
  support matrix, and SEO (metadata, canonical, sitemap, robots, structured data, hreflang).
  Use when: preparing a release, setting up or reviewing CI/deploy, adding error tracking or analytics, handling
  cookie consent, or fixing SEO metadata.
  DO NOT USE FOR: performance tuning (see fe-perf); security audits and headers (see fe-sec);
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
- [ ] Env vars set for the target environment; no secret uses a public prefix (fe-sec)
- [ ] DB/API changes deployed first or backward compatible
- [ ] Feature flags default safe; risky features behind a flag
- [ ] Error tracking release/version tagged; source maps uploaded privately (not served publicly unless intended)
- [ ] Performance budget check passed (fe-perf)
- [ ] Rollback path known: previous build/artifact id or host "instant rollback"
- [ ] Changelog / release notes written
- [ ] Post-deploy smoke test list ready (login, main flow, payments if any)

## 2. CI/CD and environments

Details and examples: [ci-cd.md](./references/ci-cd.md) — pipeline stages, caching, preview deploys, env handling, Docker multi-stage build, rollback.

## 3. Observability, analytics, consent

Details: [observability.md](./references/observability.md) — error boundaries + tracker setup, scrubbing PII, web-vitals reporting, analytics event naming, consent gating, browser support matrix.

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
