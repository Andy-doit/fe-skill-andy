# Asynchronous State & AsyncContent Multi-Branch Conventions

> Reference pattern. The import path, prop names, and `t()` translation helper below come from one project. Use the target project's own component and paths from its `project-profile.md`; if it has none, propose this shape first.

Architectural reference for handling asynchronous server state (SWR / TanStack Query) across 4 standardized states: Loading, Error, Empty, and Content. Managed by `fe-skel`.

---

## 1. Core Law: 4 Branches Handled by a Single Block

Every asynchronous data-backed interface must render through the `AsyncContent` switch component — never through fragmented inline ternaries (`isLoading ? <Spinner /> : ...`) or unadorned spinners:

```tsx
import { AsyncContent } from "@/components/blocks/async"

<AsyncContent
  isLoading={isLoading && items.length === 0}
  skeleton={<SkeletonStack />}                // MUST mirror real layout 1:1
  isEmpty={items.length === 0}
  emptyContent={{ title: t("empty.title"), onRetry: () => mutate(), retryLabel: t("action.retry") }}
  error={error}
  errorContent={{ title: t("error.title"), onRetry: () => mutate(), retryLabel: t("action.retry") }}
>
  {items.map((it) => <ListRow key={it.id} data={it} />)}
</AsyncContent>
```

Branch evaluation priority: **Error ➔ Loading ➔ Empty ➔ Content**.

---

## 2. Block Component Hierarchy (`components/blocks/async/`)

1. **`AsyncContent`**: The central state switch. Note: `emptyContent` and `errorContent` accept **props objects** (not raw React Nodes); the component internally renders standardized, accessible presentation.
2. **`EmptyContent`**: Renders status icon + title + description + retry button. Pure presentational component.
3. **`ErrorContent`**: Renders warning alert icon + error title + retry action.

---

## 3. Mandatory Requirements (MUST) & Prohibitions (AVOID)

### Mandatory (MUST)
- Wrap all data-backed feeds, tables, and card lists in `AsyncContent`.
- The `skeleton` prop must mirror the real loaded layout (identical dimensions, padding, and row count) — no bare spinners.
- All feedback copy must be localized via `t(...)`.
- The retry handler delegates directly to the query mutation hook (`() => mutate()`).

### Prohibitions (AVOID)
- ❌ Nested inline ternaries `isLoading ? <Spinner /> : isError ? ...`.
- ❌ Ad-hoc empty/error `<div>` or `<span>` blocks hand-coded inside feature layers.
- ❌ Hardcoding raw text strings directly in JSX.
