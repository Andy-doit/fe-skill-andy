---
name: fe-perf
description: >
  Measure and optimize page load and React runtime performance: Core Web Vitals (LCP, INP, CLS, TTFB),
  bundle size, code splitting, images/fonts/third-party scripts, caching, rendering strategy (CSR/SSR/SSG/ISR,
  streaming, hydration), Next.js App Router caching, re-renders, layout thrashing, long tasks, performance budgets.
  Use when: a page is slow, a metric is over budget, the bundle is large, re-renders are measured, or the main
  thread is blocked.
  DO NOT USE FOR: GSAP/ScrollTrigger, canvas/WebGL or frame-rate stutter (see fe-motion);
  DO NOT USE FOR: fixing CLS caused by loading states (see fe-skel); request logic and caching code (see fe-data).
---

# fe-perf — Loading Performance & React Runtime

Diagnose and fix performance bottlenecks across network, bundle, rendering, and React. Follows [conventions.md](../fe-andy/references/conventions.md).

## Minimum rules (apply even without fe-andy)
- Read `project-profile.md` in the target project first (stack, versions, budgets, protected areas).
- **Measure before optimizing**; read-only audit → proposal → wait for approval → edit → re-measure.
- Never print secrets; never edit protected areas without explicit instruction.
- Finish with the learning loop: append new, proven lessons to [references/learned.md](./references/learned.md) after a duplicate check ([learning-loop.md](../fe-andy/references/learning-loop.md)).

---

## 1. Workflow

1. **Baseline** — collect numbers before touching code ([measurement.md](./references/measurement.md)):
   - Lab: Lighthouse mobile run, Chrome Performance trace, React Profiler for the slow interaction.
   - Field (if available): CrUX / RUM p75 for LCP, INP, CLS.
   - Bundle: analyzer output or `node scripts/check-bundle-size.mjs <build-dir> --budget <KB>` (from this skill folder).
2. **Locate** — map each bad metric to a cause:

   | Symptom | Look at | Reference |
   |---|---|---|
   | LCP high | LCP element, TTFB, render-blocking CSS/JS, image priority, fonts | [loading.md](./references/loading.md) |
   | INP high | Long tasks in the interaction, re-renders, heavy handlers, layout thrashing | [react-runtime.md](./references/react-runtime.md) |
   | CLS high | Media without size, late fonts, injected banners (loading-state CLS → fe-skel) | [loading.md](./references/loading.md) |
   | Big JS | Barrel imports, client-only libs in shared chunks, missing code splitting | [loading.md](./references/loading.md) |
   | Next.js specific | Server/Client boundary, fetch cache, hydration errors | [nextjs.md](./references/nextjs.md) |

3. **Propose** — use the conventions rubric:
   ```markdown
   | # | Bottleneck | Location (file:line) | Evidence (measured) | Impact | Effort | Risk | Fix | Verify by |
   |---|---|---|---|---|---|---|---|---|
   | 1 | Layout thrashing in resize handler | Chart.tsx:42 | 85 ms task in trace | High | S | Low | Batch reads before writes in rAF | Re-trace, task < 50 ms |
   ```
4. **Apply** the approved fixes one at a time.
5. **Re-measure** with the same method and report before → after.

## 2. Thresholds (defaults; the project profile overrides)

| Metric | Good | Needs improvement | Poor |
|---|---|---|---|
| LCP | ≤ 2.5 s | ≤ 4.0 s | > 4.0 s |
| INP | ≤ 200 ms | ≤ 500 ms | > 500 ms |
| CLS | ≤ 0.1 | ≤ 0.25 | > 0.25 |
| Long task | — | — | > 50 ms on main thread |

Judge Core Web Vitals at the 75th percentile of real users when field data exists.

## 3. Prohibitions

- ❌ `React.memo` / `useMemo` / `useCallback` without Profiler evidence.
- ❌ Virtualization libraries for small lists (< ~100 rows) without a measured problem.
- ❌ New dependencies or lockfile changes without consent.
- ❌ Claims of improvement without before/after numbers.

## 4. References

- [measurement.md](./references/measurement.md) — tools, commands, budgets in CI, RUM
- [loading.md](./references/loading.md) — bundle, code splitting, lazy loading, images, video, fonts, caching, compression, third-party scripts
- [react-runtime.md](./references/react-runtime.md) — event loop, rendering pipeline, re-renders, memoization, transitions, virtualization, keys
- [nextjs.md](./references/nextjs.md) — App Router, Server/Client Components, caching/revalidate, streaming, `next/image`, `next/font`, hydration errors
- [scripts/check-bundle-size.mjs](./scripts/check-bundle-size.mjs) — built-in-only bundle size check
- [learned.md](./references/learned.md) — learned notes
