# React Runtime & Browser Internals

## 1. Browser pipeline (why things are slow)

- **Event loop**: one main thread runs JS tasks, then microtasks (promises), then may render. A task > 50 ms is a *long task*; while it runs the page cannot respond, which raises INP.
- **Rendering pipeline**: Style → Layout (reflow) → Paint → Composite. Changing geometry (width, top, margin) triggers layout; changing colour triggers paint; changing `transform`/`opacity` on a composited layer only composites (cheapest).
- **Layout thrashing**: reading a layout property (`offsetHeight`, `getBoundingClientRect()`, `scrollTop`, `getComputedStyle`) after a style write forces synchronous layout. In a loop this repeats layout per item.

```js
// Before: read/write interleaved → layout per item
items.forEach((el) => { el.style.height = el.offsetWidth / 2 + "px"; });

// After: batch reads, then writes
const widths = items.map((el) => el.offsetWidth);
requestAnimationFrame(() => items.forEach((el, i) => { el.style.height = widths[i] / 2 + "px"; }));
```
Verify: Performance trace — "Forced reflow" warnings gone, task duration down.

- **Breaking up long tasks**: split work into chunks and yield between them (`await scheduler.yield()` where supported, else `await new Promise((r) => setTimeout(r, 0))`); move pure computation to a Web Worker.

## 2. Virtual DOM, reconciliation, keys

- React renders a component tree to elements, diffs it against the previous tree (reconciliation), and applies minimal DOM changes. Rendering is not the same as DOM updates: a component can re-render with no DOM change, but the render work still costs CPU.
- Element type change at a position → subtree unmounted and remounted (state lost).
- **`key`** identifies list items across renders. Use stable IDs. Index keys are only safe for static lists never reordered/filtered/inserted. Changing a `key` deliberately resets a component's state.

## 3. Re-renders

A component re-renders when its state changes, its parent re-renders, or a context it reads changes.

| Cause (measured in Profiler) | Fix |
|---|---|
| State lives too high | Colocate state in the smallest subtree that needs it |
| Parent re-renders a heavy static child | Pass the child as `children`/prop from above (composition) so it is not re-created |
| One big context value changes often | Split contexts (state vs dispatch, or by domain); or use a store with selectors (Zustand, Redux `useSelector`) |
| New object/array/function props break a memoized child | Only then: `useMemo`/`useCallback` for those props + `memo` on the child |
| Derived state stored in state + synced by `useEffect` | Compute during render (or `useMemo` if measured expensive) |

**When NOT to memoize**: cheap components, props that change every render anyway, components that rarely re-render, or before measuring. Memoization has its own cost and makes code harder to read. If the project uses the React Compiler, manual memoization is often unnecessary — check the profile.

## 4. Effects

- Effects are for synchronizing with external systems (subscriptions, DOM APIs, network), not for transforming data for render.
- Always return cleanup for subscriptions, timers, observers, and in-flight requests (`AbortController`).
- Event-specific logic belongs in the event handler, not in an effect reacting to state.

## 5. Concurrent features (React 18+)

| Need | Tool |
|---|---|
| Keep typing responsive while filtering a large list | `useDeferredValue(query)` and render the list from the deferred value |
| Mark a state update as non-urgent (tab switch, filter) | `startTransition(() => setX(...))` / `useTransition` for an `isPending` flag |
| Show fallback while lazy code or data loads | `Suspense` boundaries close to the content |

Verify: INP / interaction duration in Performance trace before/after.

## 6. Virtualization

- Use when a measured long list (hundreds+ of rows, or complex rows) causes slow render or scroll.
- Libraries: TanStack Virtual, react-window (pick what the project has; ask before adding).
- Keep row height stable or measured; preserve keyboard navigation and screen-reader semantics (`role="row"`, `aria-rowcount` where applicable).
- Alternative without a library: pagination or `content-visibility: auto`.

## 7. Memory leaks

Signs: heap grows across navigations. Check DevTools → Memory → heap snapshots before/after repeating an action. Usual causes: listeners/intervals without cleanup, detached DOM held in closures, unbounded caches.
