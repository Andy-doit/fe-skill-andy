---
name: fe-pwa
description: >
  Design and audit Progressive Web App behaviour: service worker lifecycle and updates (skipWaiting, clients.claim,
  updatefound), Workbox caching strategies (CacheFirst, NetworkFirst, StaleWhileRevalidate, NetworkOnly), precaching
  vs runtime caching, offline fallback pages, offline mutation queues (IndexedDB + Background Sync), web app manifest,
  icons, theme-color, installability, storage quota. Covers Serwist (Next.js), vite-plugin-pwa, and Workbox.
  Use when: adding a service worker, making an app work offline, users see stale versions after deploy, choosing a
  cache strategy, queueing writes while offline, or making the app installable.
  DO NOT USE FOR: in-app fetch/cache logic, retries and optimistic updates (see fe-data); HTTP cache headers and
  Core Web Vitals (see fe-perf); DO NOT USE FOR: release pipeline and rollback (see fe-ship).
---

# fe-pwa — Service Workers, Offline & Installability

## 1. Goal

Make the app load reliably on bad networks or no network, update safely without serving stale or mixed versions, and be installable. The service worker has to stay predictable enough to debug and remove. Follows [conventions.md](../fe-andy/references/conventions.md).

### Minimum rules (apply even without fe-andy)
- Read `project-profile.md` in the target project first (framework, host, auth model, browser matrix).
- Read-only audit first; propose; wait for approval before editing. Never install packages without consent.
- Never cache authenticated or personal responses in a shared cache key; never print secrets.
- Always ship a kill switch (§3.6) before the first service worker reaches production.
- Finish with the learning loop: append new, proven lessons to [references/learned.md](./references/learned.md) after a duplicate check ([learning-loop.md](../fe-andy/references/learning-loop.md)).

---

## 2. When to use / When NOT to use

| Use fe-pwa when | Do NOT use fe-pwa when (use instead) |
|---|---|
| The app must open or keep working offline (field work, travel, flaky mobile) | You only need faster repeat loads → HTTP caching + CDN (fe-perf) |
| Users report "old version after deploy" and a service worker exists | Data is stale inside the app because of query cache config (fe-data) |
| Writes must survive offline and sync later | CRDT/real-time conflict resolution is the core problem → design the backend first |
| Install / "Add to Home Screen" / push, or auditing next-pwa / Workbox before an upgrade | Static page with no repeat visitors → no SW. CSP `worker-src`, headers → fe-sec |

---

## 3. Core concepts and decision process

### 3.1 Strategy comparison (Workbox / Serwist names)

| Strategy | Read path | Freshness | Offline | Best for | Avoid for |
|---|---|---|---|---|---|
| **CacheFirst** | Cache → network on miss | Stale until entry expires | ✓ after first hit | Hashed static assets, fonts, versioned images | HTML, API data, unhashed URLs |
| **NetworkFirst** | Network (timeout) → cache | Fresh when online | ✓ falls back | HTML navigations, user-specific API GETs | Large static assets (slow on bad network) |
| **StaleWhileRevalidate** | Cache now + update in background | One request behind | ✓ | Avatars, catalog lists, non-critical JSON, CSS without hashes | Prices, stock, balances, auth state |
| **NetworkOnly** | Network only | Always fresh | ✗ (use with Background Sync) | POST/PUT/DELETE, payments, auth, analytics | Anything that must open offline |
| *CacheOnly* | Cache only | Precache version | ✓ | Precached app-shell assets | Runtime data |

### 3.2 Decision tree

```
Is the request a mutation (POST/PUT/PATCH/DELETE)?
├─ yes → NetworkOnly (+ BackgroundSyncPlugin or app outbox §3.4 if it must survive offline)
└─ no → Is the URL content-hashed (immutable)?
   ├─ yes → precache it (build manifest) or CacheFirst + ExpirationPlugin
   └─ no → Is it an HTML navigation?
      ├─ yes → static/SSG site? → StaleWhileRevalidate (or precache + revalidate)
      │        dynamic/authenticated? → NetworkFirst (networkTimeoutSeconds: 3) + offline fallback page
      └─ no (API / media) → Must it be correct right now (money, stock, permissions)?
         ├─ yes → NetworkFirst (short timeout) or NetworkOnly; show "offline" state, not stale truth
         └─ no → StaleWhileRevalidate with maxEntries + maxAgeSeconds
```

### 3.3 Precaching vs runtime caching

| | Precaching | Runtime caching |
|---|---|---|
| Filled / versioned | On SW `install` from the build manifest (`self.__WB_MANIFEST` / `self.__SW_MANIFEST`); revision hash per file, old entries removed on `activate` | On first matching request; bounded by `maxEntries` / `maxAgeSeconds` / `purgeOnQuotaError` |
| Use for | App shell JS/CSS, offline page, critical icons, fonts. Keep it small (target < 2–5 MB) | API GETs, images, pages not known at build time |
| Pitfall | Precaching every route of a large SSG site makes the install huge | Unbounded caches grow until the browser evicts them for quota |

### 3.4 Offline mutation queue (outbox pattern)

Background Sync is Chromium-only. Workbox's `BackgroundSyncPlugin` falls back to replaying when the SW next starts. For a predictable cross-browser outbox, keep the queue in app code (IndexedDB) and replay it on `online`, on app start, and from Background Sync where it exists.

```ts
// lib/outbox.ts — app-level outbox (works in all browsers); uses the `idb` package
import { openDB, type DBSchema } from "idb";

type OutboxItem = { id: string /* idempotency key, sent as header */; url: string;
  method: "POST" | "PUT" | "PATCH" | "DELETE"; body: unknown; createdAt: number; attempts: number };
interface OutboxDB extends DBSchema { outbox: { key: string; value: OutboxItem } }

const db = () => openDB<OutboxDB>("app-outbox", 1, {
  upgrade: (d) => { d.createObjectStore("outbox", { keyPath: "id" }); },
});

export async function enqueue(item: Omit<OutboxItem, "id" | "createdAt" | "attempts">) {
  const entry: OutboxItem = { ...item, id: crypto.randomUUID(), createdAt: Date.now(), attempts: 0 };
  await (await db()).put("outbox", entry);
  const reg = (await navigator.serviceWorker?.ready) as (ServiceWorkerRegistration & { sync?: { register(t: string): Promise<void> } }) | undefined;
  await reg?.sync?.register("outbox-flush").catch(() => {}); // Background Sync = optional enhancement
  return entry.id;
}

export async function flush(): Promise<{ sent: number; failed: number }> {
  const store = await db();
  let sent = 0, failed = 0;
  for (const item of await store.getAll("outbox")) {
    try {
      const res = await fetch(item.url, { method: item.method, body: JSON.stringify(item.body),
        headers: { "Content-Type": "application/json", "Idempotency-Key": item.id } });
      if (res.ok || res.status === 409) { await store.delete("outbox", item.id); sent++; continue; }
      if (res.status < 500) { await store.delete("outbox", item.id); failed++; continue; } // 4xx: surface to user
      throw new Error(`HTTP ${res.status}`);
    } catch { await store.put("outbox", { ...item, attempts: item.attempts + 1 }); failed++; break; } // keep order
  }
  return { sent, failed };
}

if (typeof window !== "undefined") window.addEventListener("online", () => void flush());
```

Rules: the server must accept the `Idempotency-Key` header (replays happen). Show a visible "N changes pending" badge, and keep the optimistic UI in the query cache (fe-data). Drop 4xx items with a user-visible error and do not retry them forever.

### 3.5 Update lifecycle

```
new sw.js detected → install (precache) → WAITING (old SW still controls tabs)
   page shows "Update available" → user clicks → postMessage SKIP_WAITING
   → activate (clean old caches, clients.claim()) → controllerchange → page reloads once
```

- `skipWaiting()` on install (auto): the new SW takes over open tabs immediately. Use it only for static sites with no lazy chunks in flight.
- Prompt + `SKIP_WAITING` message (**default**): the user decides when to update, and there are no mixed-version chunk errors. Use it for SPAs/SaaS with code-split chunks or unsaved form state.
- `clients.claim()` makes the SW control uncontrolled pages on first install. Use it almost always, together with either option above.

```ts
// Page side — framework-agnostic update prompt
export function watchForUpdates(onUpdate: (apply: () => void) => void) {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register("/sw.js", { scope: "/" }).then((reg) => {
    const prompt = (w: ServiceWorker) => onUpdate(() => w.postMessage({ type: "SKIP_WAITING" }));
    if (reg.waiting && navigator.serviceWorker.controller) prompt(reg.waiting);
    reg.addEventListener("updatefound", () => {
      const w = reg.installing;
      w?.addEventListener("statechange", () => { if (w.state === "installed" && navigator.serviceWorker.controller) prompt(w); });
    });
    setInterval(() => void reg.update(), 60 * 60 * 1000); // long-lived tabs
  });
  let reloaded = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!reloaded) { reloaded = true; window.location.reload(); } });
}
// SW side: self.addEventListener("message", (e) => { if (e.data?.type === "SKIP_WAITING") self.skipWaiting(); });
```

Serve `sw.js` with `Cache-Control: no-cache` (never long-lived) so browsers detect updates.

### 3.6 Kill switch (ship before the first SW)

```js
// public/sw.js replacement that uninstalls itself — deploy if a SW goes bad
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil((async () => {
  for (const key of await caches.keys()) await caches.delete(key);
  await self.registration.unregister();
  for (const c of await self.clients.matchAll({ type: "window" })) c.navigate(c.url); })()));
```

### 3.7 Manifest, icons, theme-color, HTTPS

- HTTPS is required for service workers (except `localhost`). The SW scope is its URL path, so serve it from `/sw.js` for full-site scope.
- Manifest needs `id`, `name`, `short_name`, `start_url`, `scope`, `display: "standalone"`, `theme_color`, `background_color`, and icons at 192×192 and 512×512, plus a `purpose: "maskable"` icon with safe-zone padding.
- iOS/iPadOS also reads `<link rel="apple-touch-icon" sizes="180x180">`. Safari's install and push behaviour differs from Chromium's, so test it on a real device.
- Install criteria change between Chromium releases. Check the current criteria on web.dev and use Lighthouse/DevTools → Application → Manifest instead of relying on memory.
- Call `navigator.storage.persist()` only for offline-first apps that hold user data, and show `navigator.storage.estimate()` in a debug panel.

---

## 4. Implementations

### 4.1 Framework-agnostic principles
1. Pick a strategy per route class with §3.2. Write the matrix into `project-profile.md`.
2. Generate the precache manifest at build time. Never hand-maintain a precache file list.
3. Version caches by name (`pages-v3`) and bound them all (`ExpirationPlugin`).
4. Use the prompt-to-update flow (§3.5) for apps and auto-update only for static sites.
5. Never cache responses with `Set-Cookie`, `Cache-Control: no-store`, or per-user data under a shared key. On logout, delete user caches with `caches.delete("api-user")`.
6. Add `CacheableResponsePlugin({ statuses: [0, 200] })` only where opaque cross-origin responses are intended. Opaque entries use a lot of quota.

### 4.2 Next.js (App Router) — Serwist

next-pwa (shadowwalker) is unmaintained, so use Serwist (`@serwist/next` + `serwist`). **Verify bundler support first:** `@serwist/next` hooks into webpack, and Next.js 16 builds with Turbopack by default. Check the Serwist docs for current Turbopack support. If it is not supported, build with the webpack flag documented by your Next.js version.

```ts
// next.config.ts
import withSerwistInit from "@serwist/next";
const withSerwist = withSerwistInit({ swSrc: "app/sw.ts", swDest: "public/sw.js", disable: process.env.NODE_ENV === "development" });
export default withSerwist({ /* next config */ });
```

```ts
// app/sw.ts
import { defaultCache } from "@serwist/next/worker";
import { Serwist, NetworkFirst, NetworkOnly, BackgroundSyncPlugin, type PrecacheEntry, type SerwistGlobalConfig } from "serwist";

declare global { interface WorkerGlobalScope extends SerwistGlobalConfig { __SW_MANIFEST: (PrecacheEntry | string)[] | undefined } }
declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: false,          // prompt flow (§3.5)
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    { matcher: ({ url, request }) => url.pathname.startsWith("/api/") && request.method === "POST",
      handler: new NetworkOnly({ plugins: [new BackgroundSyncPlugin("api-writes", { maxRetentionTime: 24 * 60 })] }), method: "POST" },
    { matcher: ({ url }) => url.pathname.startsWith("/api/me"), handler: new NetworkFirst({ cacheName: "api-user", networkTimeoutSeconds: 3 }) },
    ...defaultCache,
  ],
  fallbacks: { entries: [{ url: "/~offline", matcher: ({ request }) => request.destination === "document" }] },
});
self.addEventListener("message", (e) => { if (e.data?.type === "SKIP_WAITING") void self.skipWaiting(); });
serwist.addEventListeners();
```

```ts
// app/manifest.ts — typed manifest route
import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return { id: "/", name: "Acme Field App", short_name: "Acme", start_url: "/", scope: "/",
    display: "standalone", background_color: "#ffffff", theme_color: "#0f172a",
    icons: [{ src: "/icons/192.png", sizes: "192x192", type: "image/png" }, { src: "/icons/512.png", sizes: "512x512", type: "image/png" },
            { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }] };
}
// app/layout.tsx: export const viewport: Viewport = { themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#0f172a" }, { color: "#ffffff" }] };
```

Create `app/~offline/page.tsx` as a static page, and add `public/sw.js` + `public/swe-worker-*.js` to `.gitignore`. Do not cache RSC payload requests yourself; `defaultCache` already handles them. A static export (`output: "export"`) can precache all HTML if the total size is small.

### 4.3 Vite + React — vite-plugin-pwa

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: "prompt",
    includeAssets: ["favicon.svg", "apple-touch-icon.png"],
    manifest: { name: "Acme", short_name: "Acme", theme_color: "#0f172a", background_color: "#ffffff", display: "standalone",
      icons: [{ src: "pwa-192.png", sizes: "192x192", type: "image/png" }, { src: "pwa-512.png", sizes: "512x512", type: "image/png" },
              { src: "pwa-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" }] },
    workbox: {
      globPatterns: ["**/*.{js,css,html,svg,woff2}"],
      navigateFallback: "/index.html",
      navigateFallbackDenylist: [/^\/api\//],
      runtimeCaching: [
        { urlPattern: ({ url }) => url.pathname.startsWith("/api/catalog"), handler: "StaleWhileRevalidate",
          options: { cacheName: "api-catalog", expiration: { maxEntries: 200, maxAgeSeconds: 86_400 } } },
        { urlPattern: ({ request }) => request.destination === "image", handler: "CacheFirst",
          options: { cacheName: "images", expiration: { maxEntries: 300, maxAgeSeconds: 2_592_000 } } },
      ],
    },
  })],
});
```

```tsx
// src/components/UpdatePrompt.tsx  (tsconfig "types": ["vite-plugin-pwa/react"])
import { useRegisterSW } from "virtual:pwa-register/react";
export function UpdatePrompt() {
  const { needRefresh: [needRefresh, setNeedRefresh], updateServiceWorker } = useRegisterSW();
  if (!needRefresh) return null;
  return (<div role="status" className="fixed bottom-4 inset-x-4 rounded-lg border bg-white p-4 shadow">
    A new version is available. <button onClick={() => updateServiceWorker(true)}>Reload</button>
    <button onClick={() => setNeedRefresh(false)}>Later</button></div>);
}
```

Use `strategies: "injectManifest"` with `srcDir`/`filename` when you need custom SW code such as an outbox sync handler or push.

### 4.4 Plain React (custom webpack/Rspack, or migrated CRA)

CRA is deprecated, so do not start new projects on it. For existing setups, use `workbox-webpack-plugin`'s `InjectManifest({ swSrc: "./src/sw.ts", swDest: "sw.js" })` and register with `workbox-window`:

```ts
// src/sw.ts
/// <reference lib="webworker" />
import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from "workbox-precaching";
import { registerRoute, NavigationRoute } from "workbox-routing";
import { NetworkFirst, StaleWhileRevalidate } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
declare const self: ServiceWorkerGlobalScope & { __WB_MANIFEST: Array<{ url: string; revision: string | null }> };
precacheAndRoute(self.__WB_MANIFEST); cleanupOutdatedCaches();
registerRoute(new NavigationRoute(createHandlerBoundToURL("/index.html"), { denylist: [/^\/api\//] }));
registerRoute(({ url }) => url.pathname.startsWith("/api/"), new NetworkFirst({ cacheName: "api", networkTimeoutSeconds: 3,
  plugins: [new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 3600 })] }));
registerRoute(({ request }) => request.destination === "image", new StaleWhileRevalidate({ cacheName: "images" }));
self.addEventListener("message", (e) => { if (e.data?.type === "SKIP_WAITING") void self.skipWaiting(); });
```

```ts
// src/registerSW.ts
import { Workbox } from "workbox-window";
export function registerSW(onUpdate: (apply: () => void) => void) {
  if (!("serviceWorker" in navigator) || import.meta.env?.DEV) return;
  const wb = new Workbox("/sw.js");
  wb.addEventListener("waiting", () => onUpdate(() => {
    wb.addEventListener("controlling", () => window.location.reload()); wb.messageSkipWaiting(); }));
  void wb.register();
}
```

---

## 5. Case studies

**A. Marketing landing (static, SSG).** The goal is instant repeat visits and an offline "you're offline" page. No outbox and no API caching. Precache the CSS/JS/fonts plus `/offline.html`, use StaleWhileRevalidate for HTML, and CacheFirst for hashed images. `skipWaiting: true` is acceptable because there are no long sessions. Avoid precaching every blog page: that previously grew the install payload to tens of MB. Instead, cache pages at runtime with `maxEntries: 50`. Verify with Lighthouse PWA/installability checks and DevTools Offline reload.

**B. SaaS offline editing (dynamic, authenticated).** Field inspectors edit forms with no signal. Precache the app shell. Use NetworkFirst with a 3 s timeout for `/api/me` and reference data, and per-user cache names deleted on logout. Writes go through the IndexedDB outbox (§3.4) with idempotency keys, and the optimistic UI stays in the query cache (fe-data). Show "3 changes pending" next to a sync button, and use the prompt update flow so a reload never discards unsaved drafts. Before rollout, test conflicts: two devices edit the same record, and the server answers 409, which the UI then resolves.

**C. E-commerce catalog (hybrid).** Browse offline, never buy offline. Use StaleWhileRevalidate for category/product JSON (max 200 entries, 1 day) and CacheFirst for product images (300 entries, 30 days, `purgeOnQuotaError`). Price and stock come from a NetworkFirst endpoint, and the UI labels cached prices "may have changed" when offline. Checkout, cart mutations and payments are NetworkOnly with no queue; the UI blocks with an offline message instead. Analytics events are queued with Background Sync where it is available.

---

## 6. "Done" checklist

- [ ] Strategy matrix per route class written down (project profile or code comment) and matches §3.2
- [ ] Precache manifest generated at build time; precache size measured and within budget
- [ ] Every runtime cache has a name, `maxEntries` and/or `maxAgeSeconds`
- [ ] No authenticated/personal data in shared caches; user caches cleared on logout
- [ ] `sw.js` served with `Cache-Control: no-cache`; SW scope correct
- [ ] Update flow tested: deploy v2 → prompt appears → reload → v2 controls; no ChunkLoadError
- [ ] Offline tested in DevTools (Offline + reload) on: home, a deep link, a dynamic page → content or offline fallback
- [ ] Outbox (if any): queued writes survive tab close and replay once; idempotency verified server-side
- [ ] Manifest valid in DevTools → Application; 192/512 + maskable icons; theme-color for light/dark
- [ ] HTTPS in all non-local environments; kill-switch SW prepared and documented
- [ ] Tested on Chromium + Safari (iOS) + Firefox; Background Sync absence handled
- [ ] Learning loop run

---

## 7. Cross-links

- fe-data: query cache, optimistic updates, retry/backoff, and the app-level offline state ([resilience.md](../fe-data/references/resilience.md))
- fe-perf: HTTP caching, CDN, LCP impact of SW startup, and navigation preload measurement
- fe-ship: deploy order (SW last), rollback plan including the kill switch, and error tracking for SW failures
- fe-sec: SW scope, CSP `worker-src`, and not caching tokens
- fe-skel / fe-ux: offline, pending-sync and update-available UI states and their wording
- fe-review: validate new PWA libraries or strategy claims before you adopt them

Learned notes: [references/learned.md](./references/learned.md).
