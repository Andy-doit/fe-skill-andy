---
name: fe-motion
description: >
  Optimize motion and animation smoothness: CSS/JS animation, View Transitions API (same-document, cross-document,
  React ViewTransition), CSS scroll-driven animations, FLIP, choosing Motion vs GSAP, GSAP and ScrollTrigger
  lifecycle, scroll-linked effects, canvas/WebGL shaders, GPU compositing, idle GPU/CPU load, micro-interaction
  timing, and prefers-reduced-motion.
  Use when: scrolling or animations drop frames, ScrollTrigger lags or leaks, infinite animations burn CPU/GPU at idle,
  canvas effects are expensive, or a page/state change needs an animated transition.
  DO NOT USE FOR: bundle size, React re-renders, Core Web Vitals or request waterfalls (see fe-perf);
  DO NOT USE FOR: static layout or spacing (see fe-layout); chart type, encoding or chart-library choice (see fe-viz).
---

# fe-motion — Smooth Motion & GPU Hygiene

Fluid, compositor-friendly animation with zero idle load. Follows [conventions.md](../fe-andy/references/conventions.md).

## Minimum rules (apply even without fe-andy)
- Read `project-profile.md` in the target project first (animation library + version).
- Measure first (frame rate, trace) → propose → wait for approval → edit → re-measure.
- Never print secrets; never edit protected areas (e.g. chart engines) without explicit instruction.
- Finish with the learning loop: append new, proven lessons to [references/learned.md](./references/learned.md) after a duplicate check ([learning-loop.md](../fe-andy/references/learning-loop.md)).

---

## 1. Audit

1. **Measure**: DevTools → Performance, record the scroll/animation with 4× CPU slowdown. Note dropped frames (Frames track), long tasks, and Layout/Paint inside animation frames. Rendering panel → "Frame Rendering Stats" and "Paint flashing".
2. **Scan code** for:
   - Animated layout properties (`width`, `height`, `top`, `left`, `margin`) → should be `transform`/`opacity`.
   - Infinite animations on resting UI (`animate-spin`, `repeat: -1`) without a pause/visibility condition.
   - ScrollTrigger instances without cleanup on unmount; heavy `scrub` values; many triggers on one element.
   - Large `backdrop-filter`/`filter: blur()` radii on big or scrolling areas.
   - Canvas loops running when off-screen or tab hidden.
   - Missing `prefers-reduced-motion` handling.
3. **Report** with the conventions rubric (finding, file:line, evidence, impact, effort, risk, fix, verify by).

## 2. Fix patterns

| Problem | Pattern |
|---|---|
| Layout-property animation | Animate `transform`/`opacity` only; use `scale` instead of width/height. |
| Promote a heavy moving layer | `will-change: transform` on the element **only while animating** (remove after); `translateZ(0)` is an older equivalent. Too many layers cost memory — verify in Layers panel. |
| Scroll-scrub lag | Prefer triggered animations (`toggleActions: "play none none reverse"`, ~0.5–0.65 s, `power3.out`) over heavy continuous `scrub`; if scrub is required, keep `scrub` small (e.g. `true` or ≤ 1). |
| ScrollTrigger cleanup | In React use `gsap.context()` / `useGSAP()` (if `@gsap/react` is installed) and revert on unmount. One-shot entrances: `once: true` + `clearProps: "transform,opacity"` after completion. |
| Idle GPU load | No infinite loops on resting UI; use hover/focus-bound motion; pause marquees on hover and when off-screen (`IntersectionObserver`) or tab hidden (`document.visibilityState`). |
| Canvas/WebGL cost | Render at reduced resolution (e.g. 0.5 device scale) for soft effects; cap DPR; stop the loop off-screen; measure per-frame time. |
| Blur cost | Smaller blur radius, smaller blurred area, or a pre-rendered gradient instead of live blur. Measure paint time before/after. |
| Native smooth scrolling feels laggy on some wheel devices | Avoid global `scroll-behavior: smooth` on `<html>`; apply smooth scrolling only to programmatic anchor jumps. Observed on Windows wheel input in one project — verify on target devices. |

## 2.1 Platform-first motion

Before adding or extending a library: [modern-motion.md](./references/modern-motion.md) — tool choice table, View Transitions API (same-document, cross-document, React `<ViewTransition>` status, Next.js flag), CSS scroll-driven animations with `@supports` fallback, FLIP, Motion vs GSAP in React, and default durations/easings for micro-interactions.

## 3. Reduced motion (required)

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
```
```js
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduce) { /* start GSAP timelines / canvas loop */ } else { /* render final static state */ }
```
For GSAP, `gsap.matchMedia()` can scope animations to `(prefers-reduced-motion: no-preference)`.

## 4. Verify

- Same recording as the audit: frames hit the display rate without long frames during the animation; no Layout/Paint inside animation frames for transform/opacity animations.
- Idle check: Performance monitor (DevTools) CPU near 0% and no repaint flashing when nothing moves.
- Reduced motion: enable "Emulate CSS prefers-reduced-motion: reduce" in Rendering panel; animations stop or become instant.

Learned notes: [references/learned.md](./references/learned.md).
