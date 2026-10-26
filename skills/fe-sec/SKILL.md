---
name: fe-sec
description: >
  Audit and fix frontend security: XSS sinks (dangerouslySetInnerHTML, innerHTML, eval) with a pre-deploy static sink
  audit, CSP and security headers, secrets in the bundle (NEXT_PUBLIC_*, VITE_*), short/default/low-entropy secrets
  in env files, source-map leakage in production, frontend auth flow (sessions, token storage, refresh, route guards,
  role-based UI — UI is only affordance, the server authorizes), CSRF, CORS, open redirects, uploads, logging of
  tokens/personal data, supply chain, and desktop packaging hardening (Electron, Tauri).
  Use when: reviewing security before merge or release, handling user HTML or uploads, touching auth/session or
  role-gated UI, adding dependencies, configuring source maps, or packaging the app with Electron/Tauri.
  DO NOT USE FOR: backend authorization logic or database security (backend team);
  DO NOT USE FOR: performance or bundle size (see fe-perf); release pipeline mechanics (see fe-ship).
---

# fe-sec — Frontend Security

Find and fix risks in browser code, bundles, build output, desktop shells, and the frontend half of auth. Defensive only: this skill hardens what the frontend team ships. Follows [conventions.md](../fe-andy/references/conventions.md).

## Minimum rules (apply even without fe-andy)
- Read `project-profile.md` in the target project first (auth model, CSP owner, allowed public env vars, packaging target).
- Read-only audit first; propose; wait for approval before editing. Auth, session and payment code is protected by default.
- **Never print secret values** — report the variable name and file:line only. The scripts here follow the same rule.
- **Never treat a client-side check as authorization.** UI is only affordance (§2).
- Finish with the learning loop: append new, proven lessons to [references/learned.md](./references/learned.md) after a duplicate check ([learning-loop.md](../fe-andy/references/learning-loop.md)).

---

## 1. Audit workflow

1. **Static sink audit** — run the grep set in [checklist.md](./references/checklist.md) §1 and classify every hit with the sink decision table in §8.
2. **Secrets** — public-prefixed env names (§2), then env secret quality with [scripts/check-env-secrets.mjs](./scripts/check-env-secrets.mjs) (length < 32, low entropy, default passwords; reports names only).
3. **Build output** — after a production build, run [scripts/check-build-output.mjs](./scripts/check-build-output.mjs): no `*.map` files, no `sourceMappingURL` pointing at a served map, no secret patterns, no server-only env values in client chunks (§9).
4. **Dependencies** — `npm audit --omit=dev` (or the pnpm/yarn equivalent; read-only), lockfile committed, new/unknown packages reviewed (§6).
5. **Headers** — fetch a deployed page and list response headers (`curl -sI <url>` — ask before calling external URLs) or read the framework/server config; compare with §3 of the checklist. Confirm `*.map` requests return 404/403.
6. **Auth and affordance** — walk through [auth-frontend.md](./references/auth-frontend.md): for every role-gated element, name the server check that backs it.
7. **Desktop packaging** — if the project contains `electron`, `@electron/*`, `src-tauri/` or `@tauri-apps/*`, walk through [desktop-apps.md](./references/desktop-apps.md).
8. **Report** by severity:

| Severity | Examples |
|---|---|
| Critical | Secret or server-only env value in the client bundle; exploitable XSS; an action authorized only in the UI; Electron window with `nodeIntegration: true` or `contextIsolation: false` loading remote or user-influenced content; preload exposing `ipcRenderer`/`require`/`fs` on `window` |
| High | Production source maps publicly reachable; unsanitized user HTML; long-lived tokens in `localStorage`; open redirect on login; missing CSRF protection on cookie-auth mutations; production secret shorter than 32 chars or a default password; Tauri capability granting broad fs/shell scope |
| Medium | Missing CSP / `frame-ancestors`; permissive CORS with credentials; PII in logs; `sourceMappingURL` comments left in production JS (no map served) |
| Low | Missing `rel` on external links (modern browsers default to `noopener`; keep for older ones); minor header gaps |

```markdown
| # | Severity | Finding | Location | Evidence | Fix | Verify by |
```

## 2. Four principles (never-do rules)

| Principle | Rule | Never |
|---|---|---|
| **UI is only affordance** | Hiding, disabling or routing around UI by role improves UX. Authorization happens only on the server: every Server Action, route handler, API call and data read re-checks the session and the permission for that resource. | Never ship an action whose only guard is `user.role === "admin"` in a component, a client store, a decoded JWT, a feature flag, or middleware. Never assume a route is private because no link points to it. |
| **Source maps never reach the public** | Production builds emit no public `*.map`; if the error tracker needs maps, upload them privately and delete them from the output, or emit hidden maps and block `*.map` at the server/CDN. A `.map` URL is enough to rebuild the original source, comments, internal names and API shape. | Never set `productionBrowserSourceMaps: true` (Next.js), `build.sourcemap: true`/`'inline'` (Vite) or `devtool: "source-map"` (webpack/Rspack) for a public deployment. Never rely on "nobody knows the URL". |
| **Sinks are inventoried before every release** | Each XSS sink in the codebase is listed, justified, and wrapped in a sanitizer or replaced. New sinks fail the pre-deploy gate (§4). | Never merge a new `dangerouslySetInnerHTML`, `innerHTML =`, `v-html`, `document.write`, `eval` or `new Function` without a review entry. |
| **A desktop shell is a browser with OS access** | Electron/Tauri turn an XSS into code execution on the user's machine. Isolate the renderer, expose a narrow typed bridge, validate every IPC message in the privileged process. | Never enable `nodeIntegration`, disable `contextIsolation`/`sandbox`/`webSecurity`, expose raw `ipcRenderer`, `fs`, `shell` or `require` to the page, or grant Tauri capabilities wider than the feature needs. |

## 3. Key rules (summary)

- Treat everything from users, URLs, CMS, third parties, IPC and deep links as untrusted. React escapes text by default; danger starts at `dangerouslySetInnerHTML`, `innerHTML`, `href={userValue}` (`javascript:` URLs), `eval`/`new Function`, string timers, and dynamic script injection.
- Sanitize rich HTML with DOMPurify (or the project's sanitizer) right before rendering; on the server use an SSR-safe sanitizer. Prefer rendering structured data (Markdown AST, JSON) over raw HTML.
- Secrets never reach the client: only explicitly public values may use public prefixes. Desktop bundles (asar, app bundles) are plain archives: a secret in a desktop app is public too.
- Secrets are long and random: ≥ 32 characters from a CSPRNG; no defaults, no dictionary words; rotate anything that ever appeared in a repo, log or chat.
- Every external redirect target is validated against an allow-list; every external URL opened from a desktop app is `https:` and allow-listed.
- Logging: no tokens, cookies, passwords or personal data in the console, error tracker or analytics.

## 4. Pre-deploy security gate

Run before merge to the release branch and again on the release candidate build. All must pass; record exceptions with owner and date.

- [ ] Sink grep (checklist §1) returns no unreviewed hit; every remaining sink is in the sink inventory with its sanitizer
- [ ] `check-env-secrets.mjs` passes for the production env file (names only in the report)
- [ ] Production build → `check-build-output.mjs` passes: no `*.map`, no served `sourceMappingURL`, no secret patterns, no server-only env values in client chunks
- [ ] A direct request for `<any chunk>.js.map` on the deployed origin returns 404/403
- [ ] For every role-gated UI element and every Server Action/route handler: the server-side check is named in the review (auth-frontend.md §0 table)
- [ ] `npm audit` (read-only) has no unaccepted high/critical items
- [ ] Headers match checklist §3 (CSP at least report-only, `frame-ancestors`, HSTS where HTTPS is universal)
- [ ] Desktop (if packaged): desktop-apps.md checklist §1.7 (Electron) or §2.6 (Tauri) passed; devtools closed in production builds
- [ ] Release notes list any accepted risk

## 5. Verify

- Grep set returns no unreviewed hits; the two scripts exit 0 on the production build and env file.
- `npm audit` has no unaccepted high/critical items (record accepted risks).
- Response headers include the agreed CSP and the rest of the header set; CSP report-only shows no violations before enforcing.
- Manual: try `<img src=x onerror=alert(1)>` in rich-text inputs (in a safe environment) → rendered inert; try `?next=https://evil.example` on login → rejected; call a role-gated Server Action/API directly with a non-admin session → 403.
- Source maps: `curl -sI https://<host>/<path-to-chunk>.js.map` → 404/403; production JS contains no `//# sourceMappingURL=` pointing to a reachable file.
- Desktop: in a packaged build, `window.require`, `window.process` and `window.ipcRenderer` are `undefined` in the renderer console; an IPC call with a malformed payload is rejected in the main process.

Learned notes: [references/learned.md](./references/learned.md).
