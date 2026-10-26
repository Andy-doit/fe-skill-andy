# Data Resilience — retry, pagination, prefetch, realtime, offline, error boundaries

## 1. Retry with backoff

- Retry only idempotent requests (GET) and only on network errors / 5xx / 429. Never auto-retry 4xx (except 408/429). 401 goes to the single-flight refresh/login flow and 403 to an access-denied state: both are server decisions, not transient failures.
- Exponential backoff with jitter, capped:

```ts
const delay = (attempt: number) => Math.min(30_000, 1000 * 2 ** attempt) * (0.5 + Math.random() / 2);
```
- Respect `Retry-After` on 429/503.
- Libraries: TanStack Query `retry` / `retryDelay`; SWR `onErrorRetry`. Keep the default count low (2–3) and show the error after that.

## 2. Pagination & infinite scroll

| Type | Use | Notes |
|---|---|---|
| Page numbers | Tables, admin lists, SEO pages | Put `page` in the URL (`?page=2`) so it survives reload/share |
| Cursor | Feeds, large/changing data | Stable under inserts; API returns `nextCursor` |
| Infinite scroll | Feeds | `useInfiniteQuery` / `useSWRInfinite`; trigger with `IntersectionObserver` on a sentinel; also offer a "Load more" button for keyboard users; restore scroll position on back |

Keep previous page visible while the next loads (no full skeleton flash).

## 3. Prefetch

- Prefetch likely next data on hover/focus of a link or when an item scrolls into view (`queryClient.prefetchQuery`, SWR `preload`).
- Do not prefetch on slow/metered connections or for expensive endpoints.

## 4. Realtime (WebSocket / SSE)

| Concern | Rule |
|---|---|
| Choice | SSE for server→client streams over HTTP; WebSocket for bidirectional; polling (`refetchInterval`) when updates are rare |
| Lifecycle | Open in an effect, close in cleanup; one shared connection per app (context/store), not per component |
| Reconnect | Backoff with jitter; resubscribe after reconnect; show a "Reconnecting…" state |
| Consistency | On reconnect, refetch the snapshot (missed events); dedupe events by id; apply in order (sequence/timestamp) |
| Cache integration | Write incoming events into the query cache (`setQueryData` / `mutate`) instead of separate state |
| Load | Throttle UI updates for high-frequency streams (batch per animation frame); pause when tab hidden if allowed |
| Security | Authenticate the connection; never put tokens in URLs that get logged (prefer cookies or a short-lived ticket) |

## 5. Offline & API-down

- Detect: `navigator.onLine` + `online`/`offline` events (hint only; a real request failing is the truth).
- Show a non-blocking banner when offline; keep showing cached data marked as possibly stale.
- Queue user writes only if the product needs it (and design conflict handling); otherwise disable submit with a clear message.
- TanStack Query `networkMode` controls behaviour offline; check the project's version docs.

## 6. Error boundaries

- Place boundaries around independent regions (widget, panel, route segment), not only at the root, so one failure does not blank the page.
- React: class `ErrorBoundary` or `react-error-boundary` (if installed); Next.js App Router: `error.tsx` per segment (client component with `reset()`), `global-error.tsx` for the root.
- Boundaries do not catch errors in event handlers or async code — handle those and surface them to state.
- Report caught errors to the error tracker (fe-ship) without personal data.

## 7. Verify

- DevTools "Offline" checkbox: banner appears, cached data visible, no crash.
- Force 500 / 429 with a mock or request override: retries capped, then error UI with retry.
- Throw inside one widget: only that region shows the fallback.
- Realtime: kill the connection (DevTools → WS/EventStream, or stop the server): reconnect indicator, then data catches up.
