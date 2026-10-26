---
name: fe-skel
description: >
  Build loading, empty, and error states: 1:1 ghost skeletons that mirror the real layout (no layout shift),
  a single 4-state switch (loading / error / empty / content), route-level loading UI, and retry affordances.
  Use when: adding skeletons, fixing flicker or layout shift while data loads, standardizing async UI states,
  or designing what users see when an API is down.
  DO NOT USE FOR: static layout or spacing (see fe-layout); fetch, cache or retry logic (see fe-data); wording of error/empty messages (see fe-ux);
  DO NOT USE FOR: measuring Core Web Vitals in general (see fe-perf).
---

# fe-skel — Ghost Skeletons & Async States

Loading states that mirror real geometry so nothing shifts when data arrives. Follows [conventions.md](../fe-andy/references/conventions.md).

## Minimum rules (apply even without fe-andy)
- Read `project-profile.md` in the target project first (does it have an async-state component? where?).
- Read-only audit first; propose; wait for approval before editing.
- Never print secrets; never edit protected areas without explicit instruction.
- Finish with the learning loop: append new, proven lessons to [references/learned.md](./references/learned.md) after a duplicate check ([learning-loop.md](../fe-andy/references/learning-loop.md)).

---

## 1. Ghost-replica law

A skeleton is an exact replica of the loaded UI, not a generic blob:
1. **Geometry parity**: same heights, widths, radii, gaps, padding, and row count as the real component.
2. **Typography parity**: title bars match heading line-height; text lines match body line-height.
3. **Media parity**: same aspect ratio box as the real image/video.
4. **No shift**: when content mounts, neighbours do not move.
5. **Accessible**: container has `aria-busy="true"` while loading; skeleton shapes are `aria-hidden="true"`; one visually hidden "Loading…" status for screen readers; shimmer respects `prefers-reduced-motion`.

## 2. One 4-state switch

Render data-backed regions through one switch component: **Error → Loading → Empty → Content**.
- If the project has one (e.g. `AsyncContent`), use it: [async-content.md](./references/async-content.md).
- If not, propose a small one with the same 4 branches before scattering ternaries; get approval.
- Show skeleton only on first load (`isLoading && !data`); on refetch keep stale content and show a subtle indicator.
- Error state: plain-language message + retry; empty state: why it is empty + the next action (copy rules: fe-ux skill).
- Route-level: in Next.js App Router, `loading.tsx` per segment for instant navigation feedback.

## 3. Workflow

1. **Inspect** the loaded component: DOM structure, padding, line-heights, media ratios, list length.
2. **Author** `<Feature>Skeleton` next to the component.
3. **Bind** it to the 4-state switch.
4. **Verify**:
   - DevTools → Network throttling "Slow 4G" + Rendering → "Layout Shift Regions": no highlighted shift when content replaces the skeleton.
   - Performance trace: layout-shift entries for the region = 0.
   - Overlay check: screenshot skeleton and loaded state at the same width; outer boxes align.
   - Error and empty branches: force them (block the request in DevTools / mock empty response) and check each renders.

Learned notes: [references/learned.md](./references/learned.md).
