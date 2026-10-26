---
name: fe-data
description: >
  Manage client data fetching and server state architecture: SWR / TanStack Query, cache key normalization,
  deduplication, request cancellation (AbortController), retry logic, pagination/infinite scroll, and request waterfall elimination.
  Use when: managing client-side data fetching, optimizing API traffic, aborting stale requests on search/filter changes,
  or configuring optimistic mutations.
  DO NOT USE FOR: Asynchronous UI 4-state component conventions (see fe-skel);
  DO NOT USE FOR: Overall Core Web Vitals or bundle size profiling (see fe-perf).
---

# `fe-data` — Client Data Fetching & Server State Architecture

Specialized skill for engineering client-server data synchronization pipelines, caching strategies, and high-efficiency network request lifecycles. Strictly follows [conventions.md](../fe-andy/references/conventions.md).

---

## 1. Important Domain Boundary

> **NOTE:** `fe-data` manages **fetch logic, caching policies, and request lifecycles**. Visual rendering of multi-state UI (`AsyncContent`, `EmptyContent`, `ErrorContent`, `Skeleton`) belongs to **`fe-skel`** (see `fe-skel/references/async-content.md`).

---

## 2. Core Engineering Principles

### 2.1 Waterfall Elimination (Parallel Execution)
- Never invoke non-dependent requests sequentially (`await fetchA(); await fetchB();`).
- Aggregate concurrent calls using `Promise.all([fetchA(), fetchB()])` or isolate them within independent React Suspense boundaries.

### 2.2 Request Cancellation on State Change (`AbortController`)
- When users type into search inputs or rapidly switch filter tabs, cancel inflight requests via `signal: controller.signal` to prevent stale response race conditions.

### 2.3 Server State Caching (SWR / TanStack Query)
- **Consistent Cache Keys**: Formulate normalized array keys (e.g. `['/api/items', { page, filter }]`).
- **Deduplication**: Leverage SWR `dedupingInterval` or TanStack Query `staleTime` to avoid duplicate network calls within short intervals.
- **Optimistic Mutations**: Instantly reflect user actions (bookmarks, likes, status toggles) in local cache prior to server confirmation, with automated rollback on network failure.
