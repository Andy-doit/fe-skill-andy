---
name: fe-data
description: >
  Design client data fetching and server state: SWR / TanStack Query / framework fetch, cache keys, deduplication,
  request cancellation (AbortController), retry with backoff, pagination and infinite scroll, prefetching,
  optimistic mutations with rollback, waterfall elimination, realtime (WebSocket/SSE), offline and API-down behaviour,
  error boundaries.
  Use when: writing or fixing data hooks, stale or racing responses, duplicate requests, slow sequential calls,
  live updates, or resilience when the network/API fails.
  DO NOT USE FOR: the visual loading/empty/error UI (see fe-skel); auth token refresh or session logic (see fe-sec);
  DO NOT USE FOR: measuring Core Web Vitals or bundle size (see fe-perf).
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

More: [resilience.md](./references/resilience.md) — retry/backoff, pagination, prefetch, realtime, offline, error boundaries.

## 3. Verify

- Network tab: no duplicate calls for the same key on one screen; independent requests start in parallel (waterfall view).
- Type fast in search with "Slow 3G": earlier requests show "(canceled)"; final results match the final input.
- Block the API (DevTools request blocking) → error UI + retry works; recover → data loads.
- After a mutation, affected views update without manual reload.

Learned notes: [references/learned.md](./references/learned.md).
