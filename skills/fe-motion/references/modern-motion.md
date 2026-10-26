# Modern Motion — View Transitions, scroll-driven animations, FLIP, choosing a library

Platform first, library second, canvas last. Everything here respects the rules in SKILL.md (transform/opacity only, cleanup, reduced motion). Browser support changes quickly: confirm each "(verify)" row against the project's browser matrix with fe-review.

## 0. Choose the tool

| Need | Use | Not |
|---|---|---|
| Hover/focus/press feedback, simple enter/exit | CSS transitions + `@starting-style` ([modern-css.md](../../fe-layout/references/modern-css.md) §6) | A JS library |
| Element moves/morphs between two UI states or pages | **View Transitions API** (§1) | Manual FLIP in JS |
| Reveal/progress tied to scroll position | **Scroll-driven animations** in CSS (§2), fallback IntersectionObserver | Scroll listeners, GSAP scrub for simple cases |
| React layout animations, shared layout, gestures, spring physics | **Motion** (`motion/react`) (§4) | GSAP for React component state |
| Complex timelines, pinning, scrubbed storytelling, SVG morphing | **GSAP** + ScrollTrigger (SKILL.md §2) | Motion |
| Thousands of particles, shaders, 3D | Canvas/WebGL (SKILL.md §2) | DOM animation |

Add a library only after the platform option is ruled out for the matrix or the effect; record the decision in `project-profile.md`.

## 1. View Transitions API

Same-document transition: snapshot the old state, update the DOM, animate between snapshots on the compositor.

```ts
// Framework-agnostic: wrap the DOM update
function navigateTo(render: () => void) {
  if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) return render();
  document.startViewTransition(render);
}
```
```css
.product-image { view-transition-name: product-hero; }           /* name must be unique per page at a time */
::view-transition-old(product-hero), ::view-transition-new(product-hero) { animation-duration: 240ms; }
::view-transition-old(root) { animation: 160ms ease-in fade-out; }
::view-transition-new(root) { animation: 200ms ease-out fade-in; }
@media (prefers-reduced-motion: reduce) { ::view-transition-group(*) { animation: none !important; } }
```

| Context | How | Status at writing |
|---|---|---|
| Vanilla / Vite SPA | `document.startViewTransition(cb)`; routers with a `viewTransition` option (React Router `<Link viewTransition>`, TanStack Router) call it for you | Same-document: Chromium + Safari; Firefox newer (verify) |
| Cross-document (MPA, static sites) | `@view-transition { navigation: auto; }` in both pages; names on the shared elements | Newer; verify matrix |
| React component | `<ViewTransition>` around the element whose enter/exit/move should animate, with state updates inside `startTransition`/`useTransition` | react.dev's React 19.3 announcement says stable; the reference page said Canary at writing — **(verify your React version)** |
| Next.js App Router | `experimental.viewTransition` flag (marked experimental in Next.js 16 docs) | Not for production without fe-review sign-off |

Rules:
- Name only elements that move or morph; everything else animates as part of `root`. Duplicate names in one snapshot throw.
- Keep ≤ 300 ms; large list reflows and images without fixed aspect ratio produce visible jumps (fix the layout first with fe-skel/fe-layout).
- Feature-detect and skip under reduced motion (above). The update must work without the transition.
- Debug: DevTools → Animations panel pauses the pseudo-element tree; `view-transition-name` collisions appear in the console.

## 2. Scroll-driven animations (CSS)

Runs off the main thread; no listener, no library.

```css
/* Reading progress bar */
.progress { transform-origin: 0 50%; animation: grow linear both; animation-timeline: scroll(root block); }
@keyframes grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }

/* Reveal as the element enters the viewport */
.reveal { animation: fade-up linear both; animation-timeline: view(); animation-range: entry 0% entry 60%; }
@keyframes fade-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }

@supports not (animation-timeline: scroll()) { .reveal { opacity: 1; transform: none; } }   /* or IntersectionObserver fallback */
@media (prefers-reduced-motion: reduce) { .reveal, .progress { animation: none; } }
```
Support: Chromium and Safari 26+; Firefox behind a flag at writing (verify). Use for enhancements only (progress, reveals, parallax ≤ 10 % travel). Keep GSAP ScrollTrigger for pinning, scrubbed sequences and anything that needs JS callbacks.

## 3. FLIP (First, Last, Invert, Play) for layout changes

When an element changes size/position because the layout changed (reorder, expand, filter), animate with transforms instead of layout properties:

1. **First**: `getBoundingClientRect()` before the change.
2. **Last**: apply the change, measure again.
3. **Invert**: set `transform: translate(dx, dy) scale(sx, sy)` so it *looks* unchanged.
4. **Play**: next frame, transition `transform` to `none`.

Batch all reads before all writes (one layout pass), add `will-change: transform` only during the animation. In React use Motion's `layout` prop (§4) or GSAP's Flip plugin instead of hand-rolling; View Transitions (§1) replace FLIP for most same-page morphs where supported.

## 4. Motion vs GSAP in React

| | Motion (`motion/react`) | GSAP (+ `@gsap/react`) |
|---|---|---|
| Strength | Declarative props, `layout` animations, `AnimatePresence` exit, gestures, springs, reduced-motion hook | Timelines, ScrollTrigger pin/scrub, SVG/morph plugins, precise sequencing |
| Lifecycle | Component-scoped; unmount cleans up | `useGSAP()`/`gsap.context()` + revert on unmount (SKILL.md §2) |
| SSR | Works; initial styles render server-side | Runs client-side only; set final state in CSS to avoid flash |
| Bundle | Pay for what you import; `LazyMotion` for the minimal runtime | Core + plugins; tree-shake plugins |
| Reduced motion | `useReducedMotion()` / `reducedMotion: "user"` config | `gsap.matchMedia()` |

Rule of thumb: UI state animation → Motion; scroll storytelling and complex sequences → GSAP; never both for the same element.

```tsx
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
export function Toast({ open, children }: { open: boolean; children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence>
      {open && (
        <motion.div role="status" initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: 8 }} transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

## 5. Micro-interaction defaults (when the design system has none)

| Motion | Duration | Easing |
|---|---|---|
| Enter (fade/slide ≤ 16 px) | 150–250 ms | ease-out `cubic-bezier(0.2, 0, 0, 1)` |
| Exit | 100–200 ms (shorter than enter) | ease-in `cubic-bezier(0.4, 0, 1, 1)` |
| Large move / morph / page | 250–400 ms | standard `cubic-bezier(0.2, 0, 0, 1)` |
| Stagger between list items | ≤ 50 ms per item, cap total ≈ 400 ms | — |
| Hover/press feedback | 80–120 ms | ease-out |

No bounce/overshoot on essential UI (forms, navigation); springs only for playful, non-blocking elements. Infinite animation only while something is actually happening (loading) — never on resting UI (SKILL.md §2).

## 6. Verify

- Performance recording during the transition: no Layout/Paint inside animation frames; frames at display rate (SKILL.md §4).
- View Transitions: works with the API disabled (DevTools → Rendering → emulate; or `delete document.startViewTransition` in console) — content still updates.
- Scroll-driven: `@supports` fallback renders the final state; progress bar correct at top/bottom.
- Reduced motion emulation: transitions skip or become instant; nothing stays invisible.
- Bundle: adding Motion/GSAP stays inside the route budget (fe-perf `check-bundle-size.mjs`).
