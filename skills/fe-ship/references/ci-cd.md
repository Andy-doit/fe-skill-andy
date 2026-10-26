# CI/CD, Environments, Docker, Rollback

## 1. Pipeline stages (pull request)

1. Install with the lockfile (`npm ci`, `pnpm install --frozen-lockfile`, `yarn install --immutable`), cache the package store.
2. Lint → type-check → unit/component tests (parallel jobs where possible).
3. Build.
4. Bundle budget check (fe-perf `check-bundle-size.mjs`) and i18n parity (fe-i18n script) if relevant.
5. **Security gate on the build output** (fe-sec): `node <skills>/fe-sec/scripts/check-build-output.mjs --env .env.production` — fails on `*.map` files, served `sourceMappingURL`, secret patterns or server-only env values in client chunks; `check-env-secrets.mjs` on the production env file (§6).
6. E2E + axe on a preview deployment or a locally started build.
7. Dependency audit (report, fail on new critical).

Example (GitHub Actions, npm — adapt):
```yaml
name: ci
on: [pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npx tsc --noEmit
      - run: npm test --if-present
      - run: npm run build
```
Pin action versions per the team's policy (tags or commit SHAs).

## 2. Environment variables

| Rule | Detail |
|---|---|
| Separate per environment | dev / preview / staging / production values in the host or CI secret store, never committed |
| `.env.example` | Committed, names only, with comments; real `.env*` in `.gitignore` |
| Public vs server | Only values safe for everyone get public prefixes (`NEXT_PUBLIC_`, `VITE_`) |
| Build-time vs runtime | Public prefixed vars are inlined at build time — changing them needs a rebuild; for one image across environments, use runtime config served by the server |
| Validation | Validate required env vars at startup/build (schema) and fail fast with the variable name |

## 3. Docker for frontend (Next.js standalone example)

```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build            # next.config: output: "standalone"

FROM node:20-alpine AS run
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S app && adduser -S app -G app
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
USER app
EXPOSE 3000
CMD ["node", "server.js"]
```
Static SPA (Vite): build stage → copy `dist/` into an nginx/caddy image with SPA fallback and long cache for hashed assets. Add a `.dockerignore` (`node_modules`, `.next`, `.git`, `.env*`).

## 4. Rollback

- Keep the previous build artifact/image tag; prefer the host's instant rollback (re-point traffic) over rebuilding.
- Rollback must not depend on a reverted DB migration — keep migrations backward compatible.
- Rollback triggers agreed in advance: error rate spike, core flow failure, CWV regression beyond budget.
- After rollback: keep the error tracker release markers to compare.

## 5. Preview deployments

One preview per pull request; run E2E and Lighthouse against it; protect previews that use production data.

## 6. Source maps in production (release policy)

**Rule:** no publicly reachable `*.map` file, ever. A served map reconstructs the original source (comments, internal names, feature flags, API shape). Decide one of two modes per project and write it in `project-profile.md`:

| Mode | When | Setup |
|---|---|---|
| **A. No maps** (default) | No error tracker needs them | Keep bundler defaults (below); the CI gate confirms the artifact contains none |
| **B. Private maps** | Error tracker symbolication | Emit *hidden* maps (no `sourceMappingURL` comment), upload them to the tracker in the build step, delete them from the deploy artifact; block `*.map` at the server/CDN as a backstop |

| Bundler / framework | Safe production setting | Never |
|---|---|---|
| Next.js | `productionBrowserSourceMaps: false` (default). Mode B: the tracker's Next.js plugin uploads during `next build` and can delete maps afterwards **(verify the option name for your plugin version)** | `productionBrowserSourceMaps: true` on a public deployment |
| Vite | `build.sourcemap: false` (default). Mode B: `build.sourcemap: "hidden"` + tracker plugin upload + delete `dist/**/*.map` before deploy | `build.sourcemap: true` or `"inline"` |
| webpack / Rspack | `devtool: false`. Mode B: `devtool: "hidden-source-map"` + upload + delete | `"source-map"`, `"inline-source-map"`, any `eval*` |
| Electron / Tauri | Same as the renderer bundler; also exclude maps from the packaged archive (electron-builder `files` globs / Tauri bundle resources) | Maps inside `app.asar` or bundle resources |

**Server / CDN backstop:**
```nginx
# nginx
location ~* \.map$ { return 404; }
```
```caddyfile
# Caddy
@maps path *.map
respond @maps 404
```
Static hosts (Vercel, Netlify, Cloudflare Pages, S3+CDN): the simplest control is to never upload maps (mode A, or delete after tracker upload in mode B); add a `*.map` → 404 rule where the host supports it.

**Verification (staging and production):**
- `curl -sI https://<host>/<any-chunk>.js.map` → `404` or `403`.
- Production JS contains no `//# sourceMappingURL=` pointing at a reachable file (hidden maps leave no comment).
- CI step 5 above fails the pipeline if a map slips into the artifact.

**Release-notes rule:** switching a project from mode A to B, or changing the tracker, is a release-notes item with the fe-sec reviewer named.
