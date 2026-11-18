# `DataSlot<T>` + `SlotView` + Skeleton Parity

The canonical recipe for loading, error, empty and content states in a data-driven region.

## `DataSlot<T>` — the union type

```ts
type DataSlot<T> =
  | { isLoading: true }
  | { isError: true }
  | { isForbidden: true }          // 403 — has its own drawing in SlotView
  | { isEmpty: true; isValidating?: boolean }
  | { items: T; isValidating?: boolean }
```

**Rules:**
- One `DataSlot<T>` per API read the block owns (one per region).
- `isValidating` sits beside `isEmpty` or `items` — it NEVER re-shows the skeleton; it keeps the old data visible.
- `isForbidden` is NOT the same as `isError` — it renders a 403-specific UI in `SlotView`.
- Loading and error together cannot coexist (union discriminant ensures this).

## State Priority

Loading → Error/Forbidden → Empty → Content (always in this order).

## `SlotView` — the rendering formula

```tsx
<SlotView
  slot={props.props.order}
  placeholder={ORDER_PLACEHOLDER}
  labels={props.props.labels.orderSlot}
  onRetry={props.on.retryOrder}
  render={(order, isLoading) => (
    <>
      <OrderSummary customer={order.customer} isLoading={isLoading} />
      {isLoading ? null : <OrderDisclosure lines={order.lines} />}
    </>
  )}
/>
```

- `SlotView` calls `render(placeholder, true)` when loading — the **same DOM tree** draws in skeleton mode.
- `SlotView` calls `render(items, false)` when ready.
- The `render` callback NEVER receives the slot directly — always resolved data or the placeholder.
- `SlotView` owns error, forbidden, and empty states — the app never draws these by hand beside `SlotView`.

## Skeleton Parity Rule

The skeleton IS the ready tree drawn with `isLoading=true`. NOT a separate component, NOT a hand-drawn bubble skeleton.

**Correct approach:**
- Pass a `placeholder` of the same shape as real data (known text real, fake IDs, no fake list items for a list that may be empty).
- Grammar components (`Section`, `SurfaceCard`, `DataTable`, etc.) receive `isLoading` and derive their skeleton from the structure they already have.
- `isLoading` propagates through the region context — a `Section` or `PaneSection` tells every child. The app never passes `isLoading` to each leaf individually.

**Wrong approaches (never do these):**
- A second loading component (a `HandoffBlockLoading.tsx` alongside `HandoffBlock.tsx`).
- `loadingRows`, `loadingContent`, `isSkeleton` props.
- Hand-drawn `<Skeleton />` components inside the app.
- An empty placeholder (`[]` for a list) — the shape drifts from the real data.

## `aria-busy` ownership

`aria-busy` has ONE owner: the region container (`Section`, `PaneSection`, `SurfaceCard`, `Form`, `Dialog`/`Drawer` body). Nothing inside adds another. Components read `useRegionOwnsBusy()` to avoid duplicate `aria-busy`.

A component that loads on its own (outside any region, with an explicit `isLoading` prop) is its own region and carries `aria-busy` itself.

## `isValidating` — silent refresh

When a region has data and the read revalidates:
- Keep showing the existing content (do NOT flash the skeleton).
- Show at most a quiet pending cue on the control that triggered the refresh.
- Never pass `isValidating` as `isLoading` — this is a common mistake. Rule: `no-validating-as-loading`.

## Multi-slot regions

When a block owns multiple reads, build the slot with `slotOfReads(read1, read2, ...)`:
- Loading = any read is loading with no data yet.
- After first full load: keep all data; latched.
- Error = that region's error slot with retry; every other region unaffected.
- Count of an unsettled read = hidden, never `0`.

## Mapping to fe-skill-andy layers

| Layer | Responsibility |
|---|---|
| `fe-skel` | Owns the 4-state switch (loading/error/empty/content), skeleton parity, `SlotView` recipe |
| `fe-data` | Owns `DataSlot<T>` construction from SWR/query hooks (`slotOfSwr`, `slotOfReads`) |
| `fe-code` | Owns `XBase` props shape including `DataSlot<T>` fields |
| `fe-a11y` | Owns `aria-busy` placement rules |
