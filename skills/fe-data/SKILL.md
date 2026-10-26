---
name: fe-data
description: >
  Design client data fetching and server state: API contracts and typed clients (OpenAPI codegen, GraphQL, tRPC,
  BFF, one error shape, contract versioning), SWR / TanStack Query / framework fetch, cache keys, deduplication,
  request cancellation (AbortController), retry with backoff, pagination and infinite scroll, prefetching,
  optimistic mutations with rollback, waterfall elimination, realtime (WebSocket/SSE), offline and API-down behaviour,
  error boundaries.
  Use when: choosing or wiring an API client (REST/GraphQL/tRPC), writing or fixing data hooks, stale or racing
  responses, duplicate requests, slow sequential calls, live updates, or resilience when the network/API fails.
  DO NOT USE FOR: the visual loading/empty/error UI (see fe-skel); auth token refresh or session logic (see fe-sec);
  DO NOT USE FOR: measuring Core Web Vitals or bundle size (see fe-perf); service workers, offline caching and
  queued writes across reloads (see fe-pwa).
---

# fe-data — Data Fetching, Server State & Resilience

Fetch logic, caching policy, and request lifecycles. Follows [conventions.md](../fe-andy/references/conventions.md).

## Minimum rules (apply even without fe-andy)
- Read `project-profile.md` in the target project first (data library + version).
- Read-only audit first; propose; wait for approval before editing.
- Never log tokens or personal data from responses; never edit protected areas without explicit instruction.
- Finish with the learning loop: append new, proven lessons to [references/learned.md](./references/learned.md) after a duplicate check ([learning-loop.md](../fe-andy/references/learning-loop.md)).

---

## 1. Audit checklist

| Check | Smell | Fix |
|---|---|---|
| Waterfalls | `await a(); await b();` for independent data | `Promise.all([a(), b()])` or separate Suspense boundaries |
| Races | Search/filter results arrive out of order | Abort previous request (`AbortController`), or key the query by input |
| Duplicates | Same endpoint fetched by several components | Shared hook with a stable cache key |
| Cache keys | Keys built from unstable objects or missing params | Array keys with all inputs: `["items", { page, filter }]` |
| Stale data | Data never refreshes after mutation | Invalidate/revalidate the affected keys |
| Effects fetching | `useEffect` + `fetch` with no cleanup | Library hook, or add abort cleanup |
| Errors | Errors swallowed or only `console.log` | Surface to the 4-state UI (fe-skel) + error tracking (fe-ship) |
| Authorization | 401/403 retried, hidden, or "fixed" by a client-side role check; data fetched because the UI showed a button | Treat 401 → refresh/login flow (fe-sec), 403 → access-denied state, no retry; the server decides, the UI only reflects |

## 2. Core patterns

```ts
// Cancellation in a plain effect
useEffect(() => {
  const controller = new AbortController();
  fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: controller.signal })
    .then((r) => r.json()).then(setResults)
    .catch((e) => { if (e.name !== "AbortError") setError(e); });
  return () => controller.abort();
}, [q]);
```

- **TanStack Query**: the `queryFn` receives `{ signal }` — pass it to `fetch` for automatic cancellation. Tune `staleTime` to stop refetch storms.
- **SWR**: `dedupingInterval` for dedupe; `keepPreviousData` to avoid flashing empty lists while the key changes.
- **Optimistic mutation**: snapshot cache → apply optimistic change → send → on error restore snapshot and show an error → finally revalidate. Use only for actions that usually succeed and are reversible.
- **UI is only affordance**: data hooks and mutations never assume a request is allowed because the UI rendered the control. Every call can come back 401/403 regardless of client state; handle both explicitly, never retry them, and never gate a fetch on a client-side role check as if that were security. Server-side enforcement rules: fe-sec [auth-frontend.md](../fe-sec/references/auth-frontend.md) §0.

More: [resilience.md](./references/resilience.md) — retry/backoff, pagination, prefetch, realtime, offline, error boundaries.

**API contracts and typed clients:** [api-contracts.md](./references/api-contracts.md) — choosing REST+OpenAPI vs GraphQL vs tRPC vs BFF, codegen (`openapi-typescript`/`orval`, GraphQL `client` preset), one `ApiError` union, contract-drift gate in CI, versioning. Rule: payload types are generated from the spec/schema, never hand-written; all calls go through one client module per backend.

**Offline beyond the tab:** this skill owns in-memory and query-cache behaviour while the app is open (offline detection, paused mutations, retry). For anything that must survive a reload or work with no network (service worker caching, offline fallback pages, the IndexedDB outbox, Background Sync, update prompts), use the [fe-pwa](../fe-pwa/SKILL.md) skill. Keep the optimistic state here and the durable queue there.

## 3. Verify

- Network tab: no duplicate calls for the same key on one screen; independent requests start in parallel (waterfall view).
- Type fast in search with "Slow 3G": earlier requests show "(canceled)"; final results match the final input.
- Block the API (DevTools request blocking) → error UI + retry works; recover → data loads.
- After a mutation, affected views update without manual reload.

Learned notes: [references/learned.md](./references/learned.md).
