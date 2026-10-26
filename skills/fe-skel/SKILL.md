---
name: fe-skel
description: >
  Create and refine 1:1 pixel-accurate LOADING SKELETONS (exact box heights, widths, radii, and grid gaps)
  gated by the AsyncContent multi-state switch, eliminating Cumulative Layout Shift (CLS = 0).
  Use when: authoring loading skeletons for new features, fixing flickering/shifting layouts during data fetch,
  or standardizing 4-state asynchronous UI rendering (loading/error/empty/content).
  DO NOT USE FOR: Aligning static production UI layout or spacing (see fe-layout);
  DO NOT USE FOR: API data fetching cache or SWR query logic (see fe-data).
---

# `fe-skel` — 1:1 Pixel Ghost Skeletons & AsyncContent (CLS = 0)

Specialized skill for engineering asynchronous loading states that mirror real layout geometry with 1:1 pixel precision, eliminating Cumulative Layout Shift (CLS = 0) and providing smooth perceived performance. Strictly follows [conventions.md](../fe-andy/references/conventions.md).

---

## 1. Core Law: Skeletons as 1:1 Ghost Replicas

> **A loading skeleton is not a generic placeholder blob. It must be an exact, pixel-accurate "ghost replica" of the real loaded interface.**

1. **Geometry Parity**:
   - Box heights (`h-*`), widths (`w-*`), corner radii (`rounded-*`), and container gaps (`gap-*`, `padding`) must match loaded components identically.
2. **Typography Hierarchy Matching**:
   - Title placeholders match heading box sizes (e.g., `Skeleton className="h-9 w-48 rounded-lg"`).
   - Paragraph lines mirror body font metrics (e.g., `Skeleton className="h-4 w-full rounded-md"`).
3. **Zero Layout Shift (CLS = 0)**:
   - When asynchronous data resolves and real components mount, the layout remains completely stable without shifting neighboring elements.

---

## 2. Integrated `AsyncContent` Multi-State Conventions

This skill governs the standardized 4-state asynchronous rendering switch:
- Detailed documentation: [`references/async-content.md`](./references/async-content.md).
- Enforce rendering data-backed regions through `AsyncContent` rather than ad-hoc ternaries (`isLoading ? ... : ...`) or unadorned spinners.

---

## 3. Workflow Protocol

1. **Inspect Loaded Component**: Extract DOM hierarchy, padding, typography height, and media aspect ratios from the real component.
2. **Author Ghost Skeleton**: Implement the corresponding skeleton component (typically named `[Feature]Skeleton`).
3. **Bind State Gate**: Wrap the region in `AsyncContent` passing `skeleton={<[Feature]Skeleton />}`.
4. **CLS Validation**: Verify layout stability via Chrome DevTools (Performance ➔ Web Vitals) ensuring CLS = 0.
