# Frontend Security Checklist

Adjust `src` to the project's source folders. Each hit is a review item, not automatically a bug.

## 1. Search set

```bash
# XSS sinks
grep -rnE "dangerouslySetInnerHTML|\.innerHTML\s*=|outerHTML|insertAdjacentHTML|document\.write|new Function\(|eval\(" src
# URL-based XSS / open redirect
grep -rnE "href=\{[^}\"']*\}|window\.location(\.href)?\s*=|location\.assign|location\.replace|router\.push\((searchParams|params|query)" src
# Public env vars (review each name: is it really public?)
grep -rnoE "(NEXT_PUBLIC|VITE|PUBLIC|REACT_APP)_[A-Z0-9_]+" src | sort -u
# Token storage
grep -rnE "localStorage|sessionStorage" src | grep -iE "token|jwt|auth|session"
# External links
grep -rn 'target="_blank"' src
# Logging of sensitive data
grep -rnE "console\.(log|info|debug)\(.*(token|password|authorization|cookie|email|phone)" -i src
```

PowerShell equivalent (Windows without grep): `Get-ChildItem src -Recurse -File | Select-String -Pattern "dangerouslySetInnerHTML"`.

## 2. Secrets in the bundle

- Names containing `SECRET`, `PRIVATE`, `KEY`, `TOKEN`, `PASSWORD` with a public prefix → Critical unless the value is designed to be public (e.g. a publishable key, analytics site id). Confirm with the user.
- After build, scan client output (Next.js `.next/static`, Vite `dist/assets`) for private env names and key patterns:
  `grep -rnoE "(sk_live|sk_test|AKIA|ghp_|xox[bp]-)[A-Za-z0-9_-]{8,}" .next/static dist 2>/dev/null` — report file and pattern, **never the value**.
- Server-only modules must not be imported from client components (Next.js: `server-only` package guard if available).

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

CSP rollout: start with `Content-Security-Policy-Report-Only`, collect violations, then enforce. Next.js nonces require middleware and make pages dynamic — check the docs for the project's version.

Trusted Types (Chromium): `require-trusted-types-for 'script'` in CSP forces all DOM XSS sinks through policies; adopt after the sink inventory is clean.

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
