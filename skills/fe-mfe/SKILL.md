---
name: fe-mfe
description: >
  Decide on and design micro-frontend architectures: Module Federation (webpack, Rspack, Vite), Single-SPA, iframes,
  Web Components, Next.js Multi-Zones; micro-frontend vs monolith vs monorepo decision matrix; shared dependencies
  (singleton, version conflicts, eager), runtime vs build-time integration, independent deployment and versioning,
  remote manifests, contracts and types, error boundaries and debugging across remotes.
  Use when: several teams need independent deploys of one product, splitting a large frontend, adding a plugin
  system, a federated remote fails to load, or React is loaded twice across remotes.
  DO NOT USE FOR: folder/layer structure inside one app (see fe-code); first survey of a repo (see fe-recon);
  DO NOT USE FOR: CI/CD pipeline and rollback mechanics (see fe-ship); bundle size tuning (see fe-perf).
---

# fe-mfe — Micro-Frontends & Module Federation

## 1. Goal

Choose micro-frontends only when the organisational cost they remove is larger than the runtime and operational cost they add. When you do choose them, integrate remotes with explicit contracts, shared dependencies that cannot break each other, and failure isolation per remote. Follows [conventions.md](../fe-andy/references/conventions.md).

### Minimum rules (apply even without fe-andy)
- Read `project-profile.md` in the target project first (teams, repos, deploy pipeline, framework versions).
- Read-only audit and a written decision record first. Wait for approval before editing, and never install packages without consent.
- Every remote boundary gets an error boundary, a loading state, and a typed contract.
- Finish with the learning loop: append new, proven lessons to [references/learned.md](./references/learned.md) after a duplicate check ([learning-loop.md](../fe-andy/references/learning-loop.md)).

---

## 2. When to use / When NOT to use

| Use micro-frontends when | Stay monolith / monorepo when |
|---|---|
| 3+ autonomous teams own distinct product areas and are blocked by a shared release train | 1–2 teams, or teams that already ship daily from one repo |
| Areas have different release cadences or risk profiles (checkout vs CMS pages) | The goal is "cleaner code". Module boundaries + lint rules (fe-clean) solve that cheaply |
| A legacy app must be strangled gradually (Angular/jQuery → React) | Everything shares one design system and data model tightly |
| Third parties or other teams ship plugins into your shell at runtime | Performance budget is tight on low-end mobile (extra runtime + duplicate deps) |
| Org has platform capacity: shared CI templates, observability, contract tests | No one owns the shell, shared deps, and version policy |

---

## 3. Core concepts and decision process

### 3.1 Approach comparison

| Approach | Integration | Isolation | Shared deps | SSR | Best for | Main cost |
|---|---|---|---|---|---|---|
| **Module Federation** | Runtime JS modules | Low (same document, same JS realm) | Yes: singletons, version negotiation | Possible, complex | Same-framework teams, plugin hosts | Version coupling, debugging across builds |
| **Single-SPA** | Runtime app lifecycle (mount/unmount per route) | Low–medium | Via import maps or MF | Limited | Mixed frameworks, gradual migration | Extra orchestration layer |
| **iframe** | Separate document | High (DOM, CSS, JS, crash) | No | Each frame its own | Untrusted/3rd-party content, legacy embed | UX (scroll, focus, a11y, deep links), payload |
| **Web Components** | Custom elements | Medium (Shadow DOM for CSS) | Manual | Declarative Shadow DOM, limited | Framework-agnostic widgets, design-system leaves | Event/props bridging, React interop details |
| **Multi-Zones (Next.js)** | Separate apps per path, joined by rewrites | High per zone | No (each zone own bundle) | Full, native | Next.js App Router teams | Hard navigation between zones, duplicated shell |
| **Build-time packages** (monorepo) | npm/workspace packages | None (one bundle) | Yes, by lockfile | Full | Most "we need team boundaries" cases | Shared release train |

### 3.2 Decision tree

```
Do teams need to deploy independently of each other, multiple times per week?
├─ no → Monorepo with workspace packages + enforced boundaries (Nx/Turborepo + lint rules). STOP.
└─ yes → Is the content untrusted or from a 3rd party?
   ├─ yes → iframe (sandbox + postMessage contract) or Web Component with strict API
   └─ no → Can the split be by URL path (whole pages per team)?
      ├─ yes → Multi-Zones / route-level composition (simplest; full SSR; hard nav at zone edges)
      └─ no (widgets of several teams on one page) → Same framework + major version everywhere?
         ├─ yes → Module Federation (runtime, manifest-driven)
         └─ no  → Single-SPA (lifecycle) + MF or import maps for loading
```

### 3.3 Runtime vs build-time integration

| | Build-time (packages) | Runtime (federation, manifest) |
|---|---|---|
| Deploy | Host rebuild needed for every change | Remote deploys alone; host picks it up |
| Type safety | Full, compile-time | Generated types (MF 2.0 `dts`) + contract tests |
| Failure mode | Fails in CI | Fails in production at load time → needs boundaries |
| Rollback | Host rollback | Point manifest back to previous remote version |

### 3.4 Shared dependencies

| Setting | Meaning | Use for |
|---|---|---|
| `singleton: true` | One instance across host + remotes | `react`, `react-dom`, router, state libs with module-level stores, design-system theme context |
| `requiredVersion: "^19.0.0"` | Accepted range; warns when unmet | Every shared dep: be explicit, never `*` |
| `strictVersion: true` | Throw instead of warn on mismatch | Deps where two versions corrupt state; pair with a fallback UI |
| `eager: true` | Bundled into the entry chunk, no async negotiation | Host-only, rarely; it inflates the initial bundle |
| not shared | Each remote bundles its own | Utility libs (date-fns, zod), small or stateless code |

Version policy: the platform team owns a `shared-deps.json`, or one package that exports the `shared` config. Majors of singletons are upgraded in lockstep across all remotes: the host first in compatibility mode, then the remotes, then the old range is dropped. CI fails if a remote declares a different singleton major.

### 3.5 Independent deployment and versioning
- Remotes publish to immutable, versioned URLs (`/catalog/1.14.2/remoteEntry.js` or `mf-manifest.json`) with long cache. Only the pointer (manifest/registry JSON) is short-cached.
- The host resolves remotes at runtime from a registry (`/mfe-registry.json` per environment). Rollback means changing one pointer, not rebuilding the host.
- Contracts: each exposed module has a typed props interface, semver for breaking changes, and a consumer contract test in the remote's CI that mounts the module with the host's props.
- Cross-remote communication: props down, callbacks/CustomEvents up, URL for shared state. Avoid a shared global store across teams.

### 3.6 Error boundaries and debugging

```tsx
// RemoteBoundary.tsx — framework-agnostic React wrapper for any lazy remote
import { Component, Suspense, lazy, type ComponentType, type ReactNode } from "react";

class Boundary extends Component<{ name: string; fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: unknown) {
    // tag the remote so tracker dashboards split errors per team (fe-ship)
    window.dispatchEvent(new CustomEvent("mfe:error", { detail: { remote: this.props.name, error } }));
  }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

export function remote<P extends object>(name: string, load: () => Promise<{ default: ComponentType<P> }>) {
  const Lazy = lazy(load);
  return function Remote(props: P & { fallback?: ReactNode }) {
    const { fallback = <p role="status">This section is unavailable right now.</p>, ...rest } = props;
    return (
      <Boundary name={name} fallback={fallback}>
        <Suspense fallback={<div aria-busy="true" className="min-h-40" />}>
          <Lazy {...(rest as P)} />
        </Suspense>
      </Boundary>
    );
  };
}
```

Debugging checklist: (1) Network: is `remoteEntry.js`/`mf-manifest.json` 200, with the right CORS and content type? (2) Console `__FEDERATION__` / MF devtools extension: which version of each shared dep was chosen? (3) "Invalid hook call" or two Reacts means a singleton is not shared, or `requiredVersion` is unmet. (4) CSS leaking means scope it (CSS Modules, prefixing, or Shadow DOM). (5) Tag every tracker event with `remote` + `remoteVersion`.

---

## 4. Implementations

### 4.1 Framework-agnostic principles
1. Write an ADR first. Record the team count, deploy frequency, and the decision-tree path (§3.2).
2. Split by business capability (catalog, checkout, account), never by technical layer.
3. The shell owns layout, routing, auth session, design-system version, and the registry. Remotes own their pages and widgets.
4. Treat every remote as a network call that can fail. Wrap it in a boundary, a timeout, and a fallback.
5. Keep one design-token source (fe-layout), shared as CSS variables, so remotes never ship their own theme.
6. Set a performance budget per remote (fe-perf), and keep duplicate deps out of the shared list on purpose.

### 4.2 Vite + React — `@module-federation/vite`

```ts
// catalog/vite.config.ts (remote)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [react(), federation({
    name: "catalog",
    filename: "remoteEntry.js",
    exposes: { "./ProductGrid": "./src/ProductGrid.tsx" },
    shared: { react: { singleton: true, requiredVersion: "^19.0.0" }, "react-dom": { singleton: true, requiredVersion: "^19.0.0" } },
  })],
  build: { target: "esnext" },
});
```

```ts
// shell/vite.config.ts (host) — ESM remotes need an explicit `type: "module"` object
federation({
  name: "shell",
  remotes: { catalog: { type: "module", name: "catalog", entry: "https://cdn.example.com/catalog/1.14.2/remoteEntry.js" } },
  shared: { react: { singleton: true, requiredVersion: "^19.0.0" }, "react-dom": { singleton: true, requiredVersion: "^19.0.0" } },
});
// usage: const ProductGrid = remote<ProductGridProps>("catalog", () => import("catalog/ProductGrid"));
```

Option names change between plugin versions, so check the plugin README for the version you install. Keep host and remote on the same plugin major.

### 4.3 Rspack / webpack — Module Federation 2.0 runtime

```ts
// rspack.config.ts (remote) — webpack: import from "@module-federation/enhanced/webpack"
import { ModuleFederationPlugin } from "@module-federation/enhanced/rspack";
export default {
  output: { uniqueName: "checkout", publicPath: "auto" },
  plugins: [new ModuleFederationPlugin({
    name: "checkout",
    exposes: { "./CartDrawer": "./src/CartDrawer.tsx" },
    manifest: true,            // emits mf-manifest.json
    dts: true,                 // generates types for consumers
    shared: { react: { singleton: true, requiredVersion: "^19.0.0" }, "react-dom": { singleton: true, requiredVersion: "^19.0.0" } },
  })],
};
```

```ts
// shell: resolve remotes at runtime from a per-environment registry (rollback = change JSON)
import { registerRemotes, loadRemote } from "@module-federation/enhanced/runtime";
import type { ComponentType } from "react";

type Registry = Record<string, { entry: string; version: string }>;
export async function bootRemotes() {
  const registry: Registry = await fetch("/mfe-registry.json", { cache: "no-store" }).then((r) => r.json());
  registerRemotes(Object.entries(registry).map(([name, r]) => ({ name, entry: r.entry })));
}
export const CartDrawer = remote<{ userId: string }>("checkout", async () => {
  const mod = await loadRemote<{ default: ComponentType<{ userId: string }> }>("checkout/CartDrawer");
  if (!mod) throw new Error("checkout/CartDrawer failed to load");
  return mod;
});
```

Plain React apps (custom webpack, or CRA migrated off `react-scripts`) use the same webpack plugin. CRA itself is deprecated, so migrate to Rspack or Vite before federating.

### 4.4 Next.js considerations
- **App Router:** `@module-federation/nextjs-mf` supports the Pages Router only, and its maintainers have announced end-of-life. Do not start new App Router federation on it, and check its current status before relying on it.
- **Preferred for Next.js:** Multi-Zones. Each team runs a Next.js app per path prefix, joined by rewrites in the main zone and a unique `assetPrefix` per zone. Cross-zone links use `<a>` (hard navigation), not `<Link>`.

```ts
// main-zone next.config.ts
import type { NextConfig } from "next";
const config: NextConfig = {
  async rewrites() {
    return [
      { source: "/blog", destination: `${process.env.BLOG_ZONE_URL}/blog` },
      { source: "/blog/:path+", destination: `${process.env.BLOG_ZONE_URL}/blog/:path+` },
      { source: "/blog-static/:path+", destination: `${process.env.BLOG_ZONE_URL}/blog-static/:path+` },
    ];
  },
};
export default config;
// blog zone: assetPrefix: "/blog-static", basePath: "/blog"
```

- For client-only widgets inside a Next.js host, load a federated or Web Component remote in a `"use client"` component through the runtime API (§4.3). Accept that it renders client-side only.

---

## 5. Case studies

**A. Large e-commerce, 6 teams.** Problem: one Next.js repo with a 90-minute pipeline, where checkout fixes waited behind CMS changes. Decision: Multi-Zones by path (`/`, `/c/*` catalog, `/checkout/*`, `/account/*`), plus one shared design-system package versioned with semver. There is no runtime federation for pages. Only the header mini-cart is a federated widget owned by checkout, wrapped in `RemoteBoundary` with a static "Cart" link fallback. Result to measure: deploy lead time per team and cross-zone navigation INP/LCP. The shell team owns rewrites and the token package.

**B. SaaS plugin system.** Customers install partner widgets into a dashboard. Untrusted code goes into sandboxed iframes (`sandbox="allow-scripts"`, no `allow-same-origin`), with a typed `postMessage` protocol (`{ type, version, payload }`), origin checks, and a size handshake. First-party plugins use Module Federation with `registerRemotes` from a per-tenant registry, a `PluginProps` contract package, `strictVersion` on React, and a 5 s load timeout that falls back to "Plugin unavailable". Each plugin is tagged in error tracking.

**C. Failure case: federated too early.** Two teams split a mid-size React app into 5 federated remotes "for scalability". Within months: React 18 in the host and React 19 in one remote caused "Invalid hook call" in production; three remotes bundled their own copies of the router; and the LCP route loaded 4 remoteEntry files serially (+900 ms). Debugging needed four repos. Fix: merge back into a monorepo with workspace packages and enforced import boundaries, keeping one remote for the separately released admin area. Lesson: the decision tree's first question (independent deploys, 3+ teams) was never answered with data.

---

## 6. "Done" checklist

- [ ] ADR written: team count, deploy frequency, chosen approach and the rejected alternatives
- [ ] Split by business capability; shell responsibilities documented
- [ ] Shared deps: singletons listed with explicit `requiredVersion`; one source of truth for the shared config
- [ ] CI fails on singleton major mismatch; no duplicate React in the production bundle (verify in the network tab)
- [ ] Remotes published to immutable versioned URLs; registry/manifest per environment, short cache
- [ ] Rollback tested by switching one registry pointer
- [ ] Every remote wrapped in error boundary + Suspense fallback + load timeout
- [ ] Typed contracts (generated `dts` or contract package) + consumer contract test in remote CI
- [ ] Errors and web-vitals tagged with `remote` + `remoteVersion`
- [ ] Performance budget per remote; no serial remoteEntry waterfall on the LCP route
- [ ] Styles scoped; tokens shared from one source; a11y focus order works across remote boundaries
- [ ] Learning loop run

---

## 7. Cross-links

- fe-code: layers inside each remote, component API for exposed modules
- fe-recon: survey the existing repo and team structure before proposing a split
- fe-ship: per-remote pipelines, registry promotion, rollback, and tagging errors per remote
- fe-andy: routing and shared conventions. Record the ADR outcome in `project-profile.md`
- fe-perf: bundle duplication, remote waterfalls, and budgets
- fe-sec: iframe sandboxing, postMessage origin checks, CSP for remote origins
- fe-review: challenge the "we need micro-frontends" claim before committing

Learned notes: [references/learned.md](./references/learned.md).
