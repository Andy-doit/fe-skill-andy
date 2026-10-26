---
name: fe-sec
description: >
  Audit and fix frontend security: XSS (dangerouslySetInnerHTML, innerHTML, sanitization, Trusted Types), CSP and
  security headers, clickjacking, secrets leaking into the bundle (NEXT_PUBLIC_*, VITE_*), frontend auth flow
  (sessions, token storage, refresh, route guards, middleware, role-based UI, server-side enforcement), CSRF, CORS,
  open redirects, link targets, upload restrictions, logging of tokens/personal data, and supply chain (audit,
  lockfile, SRI, typosquatting, upgrade policy).
  Use when: reviewing security before release, handling user HTML or uploads, touching auth/session code, or adding dependencies.
  DO NOT USE FOR: backend authorization logic or database security (backend team);
  DO NOT USE FOR: performance or bundle size (see fe-perf); release pipeline setup (see fe-ship).
---

# fe-sec — Frontend Security

Find and fix risks in browser code, bundles, and the frontend half of auth. Follows [conventions.md](../fe-andy/references/conventions.md).

## Minimum rules (apply even without fe-andy)
- Read `project-profile.md` in the target project first (auth model, CSP owner, allowed public env vars).
- Read-only audit first; propose; wait for approval before editing. Auth and session code is protected by default.
- **Never print secret values** — report the variable name and file:line only.
- Finish with the learning loop: append new, proven lessons to [references/learned.md](./references/learned.md) after a duplicate check ([learning-loop.md](../fe-andy/references/learning-loop.md)).

---

## 1. Audit workflow

1. **Automated searches** — run the grep set in [checklist.md](./references/checklist.md) §1 (XSS sinks, public env vars, redirects, `target="_blank"`, token storage, logging).
2. **Dependencies** — `npm audit --omit=dev` (or pnpm/yarn equivalent; read-only), check lockfile is committed, review new/unknown packages ([checklist.md](./references/checklist.md) §6).
3. **Headers** — fetch a deployed page and list response headers (`curl -sI <url>` — ask before calling external URLs) or read `next.config`/server config; compare with §3 of the checklist.
4. **Build output** — after a build, search client output for secret-looking strings and private env names ([checklist.md](./references/checklist.md) §2).
5. **Auth flow** — walk through [auth-frontend.md](./references/auth-frontend.md).
6. **Report** by severity:

| Severity | Examples |
|---|---|
| Critical | Secret in client bundle; exploitable XSS; auth enforced only in the UI |
| High | Unsanitized user HTML; long-lived tokens in `localStorage`; open redirect on login; missing CSRF protection on cookie-auth mutations |
| Medium | Missing CSP / `frame-ancestors`; permissive CORS with credentials; PII in logs |
| Low | Missing `rel` on external links (modern browsers default to `noopener`, keep for older ones); minor header gaps |

```markdown
| # | Severity | Finding | Location | Evidence | Fix | Verify by |
```

## 2. Key rules (summary)

- Treat everything from users, URLs, CMS, and third parties as untrusted. React escapes text by default; danger starts at `dangerouslySetInnerHTML`, `innerHTML`, `href={userValue}` (`javascript:` URLs), `eval`/`new Function`, and dynamic script injection.
- Sanitize rich HTML with DOMPurify (or the project's sanitizer) right before rendering; on the server use an SSR-safe sanitizer.
- Secrets never reach the client: only explicitly public values may use public prefixes.
- The frontend can hide UI by role; **only the server can authorize**.
- Every external redirect target is validated against an allow-list.

## 3. Verify

- Grep set returns no unreviewed hits.
- `npm audit` has no unaccepted high/critical items (record accepted risks).
- Response headers include the agreed CSP and the rest of the header set; CSP report-only shows no violations before enforcing.
- Manual: try `<img src=x onerror=alert(1)>` in rich-text inputs (in a safe environment) → rendered inert; try `?next=https://evil.example` on login → rejected.

Learned notes: [references/learned.md](./references/learned.md).
