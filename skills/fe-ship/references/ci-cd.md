# CI/CD, Environments, Docker, Rollback

## 1. Pipeline stages (pull request)

1. Install with the lockfile (`npm ci`, `pnpm install --frozen-lockfile`, `yarn install --immutable`), cache the package store.
2. Lint → type-check → unit/component tests (parallel jobs where possible).
3. Build.
4. Bundle budget check (fe-perf `check-bundle-size.mjs`) and i18n parity (fe-i18n script) if relevant.
5. E2E + axe on a preview deployment or a locally started build.
6. Dependency audit (report, fail on new critical).

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
