# Frontend Security Checklist

Adjust `src` to the project's source folders. Each hit is a review item, not automatically a bug.

## 1. Search set

```bash
# XSS sinks (React, Vue, Svelte, Angular, DOM)
grep -rnE "dangerouslySetInnerHTML|\.innerHTML\s*=|\.outerHTML\s*=|insertAdjacentHTML|document\.write|v-html|\{@html|\[innerHTML\]|bypassSecurityTrust|srcdoc=|new Function\(|\beval\(|set(Timeout|Interval)\(\s*[\"'\`]" src
# URL-based XSS / open redirect
grep -rnE "href=\{[^}\"']*\}|window\.location(\.href)?\s*=|location\.assign|location\.replace|router\.push\((searchParams|params|query)|javascript:" src
# Public env vars (review each name: is it really public?)
grep -rnoE "(NEXT_PUBLIC|VITE|PUBLIC|REACT_APP)_[A-Z0-9_]+" src | sort -u
# Token storage
grep -rnE "localStorage|sessionStorage" src | grep -iE "token|jwt|auth|session"
# External links
grep -rn 'target="_blank"' src
# Logging of sensitive data
grep -rnE "console\.(log|info|debug)\(.*(token|password|authorization|cookie|email|phone)" -i src
# Client-side "authorization" (each hit must map to a server check — see auth-frontend.md §0)
grep -rnE "\.role\s*===?|isAdmin|hasRole\(|can\(" src
# Desktop shells
grep -rnE "nodeIntegration|contextIsolation|webSecurity|allowRunningInsecureContent|exposeInMainWorld|ipcRenderer|ipcMain|shell\.openExternal|withGlobalTauri|dangerous" src src-tauri electron 2>/dev/null
```

PowerShell equivalent (Windows without grep): `Get-ChildItem src -Recurse -File | Select-String -Pattern "dangerouslySetInnerHTML"`.

## 2. Secrets in the bundle

- Names containing `SECRET`, `PRIVATE`, `KEY`, `TOKEN`, `PASSWORD` with a public prefix → Critical unless the value is designed to be public (e.g. a publishable key, analytics site id). Confirm with the user.
- After build, run [../scripts/check-build-output.mjs](../scripts/check-build-output.mjs) on the client output (Next.js `.next/static`, Vite `dist`, static export `out`). With `--env .env.production` it also searches the output for the *values* of non-public variables and reports the **name** only.
- Manual equivalent: `grep -rnoE "(sk_live|sk_test|AKIA|ghp_|xox[bp]-)[A-Za-z0-9_-]{8,}" .next/static dist 2>/dev/null` — report file and pattern, **never the value**.
- Server-only modules must not be imported from client components (Next.js: `server-only` package guard).
- Desktop apps: the same rule applies to the packaged app. `app.asar` and Tauri bundles are plain archives.

## 3. Security headers (target set)

| Header | Recommended value (adapt) |
|---|---|
| `Content-Security-Policy` | `default-src 'self'; script-src 'self' 'nonce-<random>' 'strict-dynamic'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'; upgrade-insecure-requests` |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` (only after HTTPS everywhere) |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | disable unused features, e.g. `camera=(), microphone=(), geolocation=()` |
| `X-Frame-Options` | `DENY` (legacy fallback; `frame-ancestors` in CSP is the modern control) |
| `Cross-Origin-Opener-Policy` | `same-origin` where popups/OAuth flows allow it |

CSP rollout: start with `Content-Security-Policy-Report-Only`, collect violations, then enforce. Next.js nonces require middleware/proxy and make pages dynamic — check the docs for the project's version.

Trusted Types (Chromium): `require-trusted-types-for 'script'` in CSP forces all DOM XSS sinks through policies; adopt after the sink inventory (§8) is clean.

## 4. CSRF & CORS

- **CSRF** matters when auth uses cookies. Defences: `SameSite=Lax` or `Strict` cookies, plus a CSRF token or origin check for state-changing requests; never use GET for mutations. Next.js Server Actions compare Origin and Host — confirm for your version and keep `serverActions.allowedOrigins` tight.
- **CORS** is enforced by browsers to protect *users of other sites*, not your API. It is configured on the server. Never `Access-Control-Allow-Origin: *` together with credentials; reflect only allow-listed origins. CORS is not an auth mechanism.

## 5. Links, redirects, uploads

- Open redirect: validate `next`/`returnTo` params — allow only relative paths starting with `/` and not `//`, or an explicit allow-list of origins.
- `href` from data: allow only `http:`, `https:`, `mailto:`, `tel:` schemes.
- `target="_blank"`: add `rel="noopener noreferrer"` (modern browsers imply `noopener`; `noreferrer` also hides the referrer).
- Uploads: client checks type/size for UX only; the server must validate type (magic bytes), size, and scan if needed; serve user files from a separate domain or with `Content-Disposition: attachment`; never render uploaded SVG/HTML inline from your origin.

## 6. Supply chain

| Rule | How |
|---|---|
| Lockfile committed and used | CI installs with `npm ci` / `pnpm install --frozen-lockfile` / `yarn install --immutable` |
| Known vulnerabilities | `npm audit` (read-only) in CI; triage high/critical; record accepted risks with a date |
| New dependency review | Check exact name (typosquatting), weekly downloads, maintainers, last publish, install scripts, size; prefer well-known packages; ask before adding |
| Upgrades | Renovate/Dependabot or a monthly upgrade window; read changelogs for majors; run fe-test tiers after upgrades |
| Third-party scripts from CDNs | Pin versions; add `integrity` (SRI) + `crossorigin="anonymous"`; prefer self-hosting |
| Install scripts | Be wary of packages with `postinstall`; consider `--ignore-scripts` policies where the team agrees |

## 7. Logging & privacy

- Never log tokens, cookies, passwords, full request bodies, or personal data (emails, phones, addresses) in the browser console or error trackers.
- Scrub error tracker events (`beforeSend`) and disable session replay on sensitive fields (fe-ship).
- Strip `console.*` debug logs from production builds if the project's tooling supports it.

## 8. Pre-deploy static sink audit

Run the §1 sink grep before every merge to the release branch. Classify each hit:

| Sink | Allowed when | Required wrapper | Never |
|---|---|---|---|
| `dangerouslySetInnerHTML` / `v-html` / `{@html}` / `[innerHTML]` | Rendering trusted-by-construction HTML (your own static content) or sanitized rich text | `DOMPurify.sanitize(html, { USE_PROFILES: { html: true } })` (or the project sanitizer) called immediately before render; SSR-safe sanitizer on the server | User, CMS, query-string or third-party HTML without sanitizing; sanitizing once "at save time" only |
| `innerHTML =` / `outerHTML =` / `insertAdjacentHTML` | Template literals built from constants only | Replace with `textContent`, DOM APIs, or the framework's rendering | Any interpolated data |
| `document.write` | — | Replace (async script loaders use `createElement`) | Always |
| `eval` / `new Function` / string `setTimeout`/`setInterval` | — | Replace with data-driven logic; JSON via `JSON.parse` | Always (also breaks CSP without `unsafe-eval`) |
| `srcdoc=` / `javascript:` URLs | `srcdoc` with sandboxed iframe + sanitized content | `sandbox` attribute; URL scheme allow-list | `javascript:` ever |
| `bypassSecurityTrust*` (Angular) | Known-safe constant | Code comment with justification | Data from outside |

Keep a **sink inventory** (e.g. `docs/security/sinks.md` or a code comment convention `// sink-reviewed: <date> <sanitizer>`): file:line, why the sink exists, sanitizer, reviewer, date. The pre-deploy gate fails on any sink not in the inventory.

### 8.1 Framework notes
- **Next.js:** JSON-LD and inline scripts go through `JSON.stringify(data).replace(/</g, "\\u003c")`; MDX content is trusted only if authored in the repo; `next/script` with `dangerouslySetInnerHTML` needs a nonce under CSP.
- **Vite + React / plain React:** the same sinks; also check `index.html` for inline scripts that would need CSP hashes.
- **Desktop (Electron/Tauri):** every sink is more severe (see desktop-apps.md §0); run the audit against the renderer and preload code.

### 8.2 Secret quality in env files
Run [../scripts/check-env-secrets.mjs](../scripts/check-env-secrets.mjs) on `.env.production` (or the exported production env). It flags, **by name only**:
- secret-looking variables with a value shorter than 32 characters;
- low-entropy or letters-only values (dictionary words);
- default/common values (`password`, `changeme`, `admin`, `secret`, `123456`, …);
- secret-looking names with a public prefix (`NEXT_PUBLIC_*`, `VITE_*`), excluding `*PUBLISHABLE*`/`*PUBLIC_KEY*`.

The check is a heuristic: a flagged name is a review item (a numeric `*_KEY` id is not a weak secret). Rules: generate with a CSPRNG (`openssl rand -base64 48`, `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`); one value per environment; rotate on any suspected exposure; store in the host's secret manager, never in the repo.

## 9. Source maps in production

**Why it matters:** a public `*.map` file lets anyone reconstruct the original TypeScript/JSX, comments, internal names, feature flags and API shapes from one URL. Treat a served map as a source-code disclosure.

| Build tool | Safe setting | Notes |
|---|---|---|
| Next.js | `productionBrowserSourceMaps: false` (default) — keep it | Error-tracker plugins (e.g. `@sentry/nextjs`) can upload maps during build and delete them from the output; enable that option instead of public maps **(verify the option name for your plugin version)** |
| Vite | `build.sourcemap: false` (default) or `'hidden'` when uploading to a tracker | `'hidden'` emits maps without the `sourceMappingURL` comment — still exclude `*.map` from the deploy artifact |
| webpack / Rspack | `devtool: false` or `"hidden-source-map"` | Never `"source-map"`, `"eval*"` or `"inline-source-map"` in production |
| Electron / Tauri | Same as the bundler used for the renderer | Also keep maps out of the packaged app (asar / bundle resources) |

**Server/CDN block (defense in depth):**
```nginx
location ~* \.map$ { return 404; }
```
```caddyfile
@maps path *.map
respond @maps 404
```
Static hosts: add a header/redirect rule for `*.map` → 404, or make sure the deploy step never uploads them. Release pipeline wiring: fe-ship `ci-cd.md` §6.

**Checks:** `check-build-output.mjs` in CI after the build; `curl -sI https://<host>/<chunk>.js.map` → 404/403 on staging and production; grep production JS for `//# sourceMappingURL=`.
