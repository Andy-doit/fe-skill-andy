# Frontend Incident Response — detect, mitigate, communicate, learn

A frontend incident is any user-facing failure in a critical flow or a metric breach that needs action now. Mitigate first (rollback/flag), diagnose second. Deploys, rollbacks and production config changes are **human-owned**: the agent prepares the decision and the commands, a person executes.

## 0. Severity

| Level | Definition | Response | Examples |
|---|---|---|---|
| **SEV1** | Critical flow broken for most users (checkout, login, app load), or data/security exposure | Page on-call now; incident channel; status page; updates every 30 min | Blank page after deploy; payment redirect fails; source maps + secrets exposed |
| **SEV2** | Major feature broken or degraded for a segment; error rate/CWV far beyond budget | Respond within 1 h in business hours; channel; updates every 2 h | Search broken on Safari; INP p75 doubled; SW serving stale version to returning users |
| **SEV3** | Minor feature or cosmetic issue, workaround exists | Ticket, next release | Misaligned footer; one locale missing strings |

Severity can change as scope becomes clearer; record the change.

## 1. Detection sources

Alerts from the SLOs in [observability.md](./observability.md) §7.5 (error rate, failed critical actions, CWV regressions, release-health comparison), synthetic checks on critical flows (login, add-to-cart, checkout start) every few minutes, support/user reports, and the error tracker's "new issue in release X" signals. Every alert names the on-call owner and links this runbook.

## 2. First 15 minutes

- [ ] Acknowledge the alert; declare severity; open the incident channel/doc with a timestamped timeline.
- [ ] Assign roles: **incident commander** (decisions), **comms** (status page, stakeholders), **operator** (executes rollback/flags). One person can hold several roles in a small team, but the roles are named.
- [ ] Confirm scope from data, not guesses: which routes, browsers/devices, regions, locales, release version, logged-in vs guest. Reproduce once in an incognito window.
- [ ] Ask "what changed?" in this order: deploy (release tag, time) → feature flag/experiment change → third-party script or tag-manager change → CDN/cache/config change → service-worker release → backend/API change → browser/OS release.
- [ ] **Mitigate** with the decision tree (§3). Do not debug root cause while users are down.
- [ ] First status update within 15 min: what users see, what is being done, next update time.

## 3. Mitigation decision tree

```
Correlates with a release?
├─ yes → host instant rollback to the previous deployment (ci-cd.md §4). Verify RUM/error rate recovers in 5–10 min.
│        Rollback blocked by a DB/API change? → forward-fix behind a flag; coordinate backend.
└─ no → Correlates with a flag/experiment? → kill the flag / stop the experiment (observability.md §8).
   └─ no → Third-party script? → remove the tag / block its origin (CSP or tag manager); confirm consent gating.
      └─ no → Service worker issue (stale version, broken offline)? → deploy the kill-switch SW (fe-pwa §3.6).
         └─ no → CDN/cache? → purge affected paths; check cache headers for personalised data (fe-perf/fe-sec).
            └─ no → Backend/API? → degrade gracefully (error states, cached data, read-only mode — fe-data/fe-skel) and hand off to the backend on-call.
```
Every mitigation is logged with time and author in the timeline.

## 4. Frontend failure catalogue

| Symptom | Likely cause | Check | Fix |
|---|---|---|---|
| Blank page / `ChunkLoadError` after deploy | Old HTML referencing removed hashed chunks; CDN serving mixed versions | Network tab 404 on `/_next/static` or `/assets`; release markers | Keep previous assets available for a window; prompt-to-update SW flow; rollback |
| Users stuck on old version | SW `skipWaiting` misconfigured or `sw.js` cached long | `Cache-Control` on `sw.js`; Application → Service Workers | Fix headers; kill-switch SW |
| Spike of errors in one browser | Browser release or an unsupported API | Error tracker grouped by browser; Baseline check | Feature-detect + polyfill/fallback; update support matrix |
| Checkout/login fails for a segment | Auth/cookie change, CSP blocking the provider, third-party cookie rules | Console CSP violations; cookie attributes; provider status | Rollback; adjust CSP/cookies; fe-sec review |
| Hydration errors flood | Locale/time-zone/date rendering mismatch, extension noise | Error payload text; reproduce in incognito | fe-perf nextjs.md §7; fe-i18n dates-time-zones.md §5 |
| CWV regression (LCP/INP) without errors | New third-party script, image without priority, heavy client component | RUM by route + release; Lighthouse diff | Remove/defer script; rollback; fe-perf budget gate |
| Personal data in a shared cache | Dynamic route cached statically / SW caching user responses | Response headers; cache keys | Purge; mark route dynamic; fe-pwa per-user cache rules; security incident process |
| Source maps / secrets exposed | Build config or pipeline drift | `curl -sI …/chunk.js.map`; `check-build-output.mjs` | Block at CDN, redeploy, rotate exposed secrets (fe-sec) |

## 5. After mitigation

1. Verify recovery with data: error rate and failed-action rate back to baseline, CWV within budget, synthetic checks green for 30 min.
2. Final status update; close the incident; keep the timeline.
3. Root-cause work happens in a ticket, not in the incident channel; the fix ships with tests that would have caught it (fe-test) and, where relevant, a new alert or gate.
4. **Blameless postmortem** within 5 business days for SEV1/SEV2 (template §6). Action items have owners and dates; "be more careful" is not an action item.
5. Feed the learning loop: generalizable lessons → `learned.md` of the owning skill → fe-learn.

## 6. Templates

**Status update (every 30 min for SEV1):**
```
[SEV1] Checkout unavailable — update 3 (14:30 UTC)
Impact: ~40 % of checkouts fail at payment redirect (since 13:52 UTC, release 2026.10.26-3).
Action: rollback to 2026.10.26-2 started 14:21, error rate dropping. Next update 15:00 UTC.
```

**Postmortem skeleton (`docs/incidents/YYYY-MM-DD-<slug>.md`):**
```markdown
# <Title> — SEV<n>, <date>
## Impact  <users affected, duration, business effect, metrics>
## Timeline (UTC)  <detection → mitigation → resolution, with who did what>
## Root cause  <technical, in one paragraph>
## Contributing factors  <process, tooling, missing tests/alerts>
## What went well  <detection, rollback speed>
## Action items  | Item | Owner | Due | Type (prevent / detect / mitigate) |
## Lessons promoted to the skill set  <fe-learn notes>
```

## 7. Preparedness checklist

- [ ] Runbook per critical flow: how to verify it, how to roll back, which flags exist, who owns the backend side
- [ ] Rollback rehearsed on staging at least once per quarter; previous deployment ids visible to on-call
- [ ] Risky features behind flags with a documented kill path; experiments stoppable in one click
- [ ] Synthetic checks for login, add-to-cart, checkout start; alerts route to the owning team
- [ ] Kill-switch service worker ready (if a SW exists); CDN purge permission for on-call
- [ ] Status page or customer-comms channel agreed with support/product
- [ ] On-call handbook: severity table, escalation contacts, this file; a yearly game day

## 8. Verify

- A simulated bad release on staging is detected by alerts and rolled back within the agreed time (measure it).
- Each SEV1/SEV2 in the last quarter has a postmortem with closed action items.
- Error tracker, RUM and release markers let you answer "what changed?" within 5 minutes.
