# Monorepo & Internal Packages — workspaces, package shape, publishing

For teams with ≥ 2 apps sharing UI, tokens, config or an API client. Import boundaries **inside** one app are fe-clean's domain; this file covers the repo layout, package shape, build/publish and CI. Tool versions change — confirm with fe-review.

## 0. Decide

| Signal | Monorepo (pnpm workspaces + Turborepo by default) | Separate repos + published packages |
|---|---|---|
| Teams/apps | Same org, ≥ 2 apps or app + design system, shared release cadence acceptable | Independent orgs/vendors, strict ownership boundaries |
| Change pattern | Cross-cutting changes (token + Block + app) land together | Packages change rarely and are versioned for many consumers |
| Tooling | One lockfile, one CI, cached tasks | Each repo owns its CI; version negotiation via semver |

Nx is the alternative when task orchestration, generators and constraints are wanted; Bun/Yarn workspaces work the same way as pnpm for layout.

## 1. Layout

```
apps/
  web/            Next.js storefront
  admin/          Vite + React
packages/
  ui/             Blocks + primitives (React, peer react)
  tokens/         CSS variables / Tailwind theme
  api-client/     generated client (fe-data api-contracts.md)
  config-ts/      base tsconfig
  config-eslint/  shared lint config
turbo.json · pnpm-workspace.yaml · package.json (root: scripts only)
```
- Internal deps use `"@acme/ui": "workspace:*"`; one lockfile at the root; `pnpm` strict node_modules catches phantom dependencies.
- `turbo.json` tasks: `build` with `dependsOn: ["^build"]` and `outputs`; `test`, `lint`, `typecheck` cached; remote cache for CI. Run only what changed: `turbo run test --filter=...[origin/main]`.

## 2. Package shape

| Choice | Compiled package | Just-in-time (source) package |
|---|---|---|
| `exports` | `"."`: `{ "types": "./dist/index.d.ts", "import": "./dist/index.js" }` (add `"require"` only if a CJS consumer exists) | `"."`: `"./src/index.ts"` — the consuming app's bundler compiles it |
| Build | `tsup` (`dts: true`, `format: ["esm"]`) or Vite lib mode | None |
| Use when | Published outside the monorepo, or consumed by tools that cannot compile TS | Internal only; fastest DX |
| Next.js | Works as a normal dependency | Add the package to `transpilePackages` |
| Vite | Works | Works (Vite compiles TS from `node_modules` symlinks) |

Shared rules: `"type": "module"` and ESM-only for new internal packages; `"sideEffects": false` (list CSS files as side-effectful: `["*.css"]`); `files` whitelist; `react`/`react-dom` as **peerDependencies** in UI packages so only one React instance exists; no default exports from package roots; CSS/tokens exported as a stylesheet (`"./styles.css": "./dist/styles.css"`). Tailwind v4 in the app: add `@source "../../packages/ui/src"` so utilities used inside packages are generated.

## 3. Versioning and publishing

- **Changesets**: each PR that changes a package adds a changeset (`pnpm changeset`); CI opens a "Version packages" PR that bumps versions and writes CHANGELOGs from conventional commits; merging it publishes.
- Publish to the org's registry (GitHub Packages, Verdaccio, npm private) with `npm publish --provenance` where supported; `publishConfig.access` set explicitly.
- Pre-publish gates in CI: `publint` (package.json/exports correctness), `@arethetypeswrong/cli` (types resolve under every module setting), `npm pack --dry-run` reviewed once per major change, and the fe-sec dependency rules (lockfile, audit).
- Internal consumers pin `workspace:*`; external consumers pin a range; breaking changes ship with a migration note in the CHANGELOG.

## 4. React and design-system specifics

- One React: `pnpm why react` shows a single version; UI packages never list `react` in `dependencies`.
- Tokens as CSS variables consumed by every app (fe-layout theming); the `ui` package ships no theme values of its own.
- Storybook lives in `packages/ui` (fe-code component-docs.md) and deploys per PR.
- Server/client split: packages that contain `"use client"` components mark them at the component file; a package may expose both server-safe and client entries (`"./server"`, `"./client"`).

## 5. CI shape

1. Install from the lockfile; Turborepo remote cache.
2. `turbo run lint typecheck test build --filter=...[origin/main]` (affected only) on PRs; full run on `main`.
3. Package gates (§3) for changed packages; app gates (fe-ship ci-cd.md §1 incl. security step) for changed apps.
4. Deploy only affected apps; previews per app.

## 6. Pitfalls

| Pitfall | Fix |
|---|---|
| Two React copies ("Invalid hook call") | peerDependencies + `pnpm dedupe`; check with `pnpm why react` |
| Circular package dependencies | `pnpm ls --depth=-1` + a lint rule (`import/no-cycle`) or Nx constraints; split the package |
| Phantom dependencies work locally, fail in CI | pnpm strict mode (default); add the dependency explicitly |
| Types fail for consumers but pass locally | `attw` in CI; `"types"` condition first in `exports` |
| Path aliases instead of packages | Aliases hide boundaries; make it a workspace package with a public index |
| Slow CI | Task caching + affected filtering; split long E2E by app |

## 7. Verify

- `pnpm install --frozen-lockfile` succeeds from a clean clone; `turbo run build` builds every app and package.
- `publint` and `attw` pass for every publishable package; `npm pack --dry-run` lists only intended files.
- One React instance in each app's production bundle; tokens come from `packages/tokens` only.
- Affected-only CI run on a PR touching one package runs that package's consumers and nothing else.
