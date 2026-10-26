---
name: fe-motion
description: >
  Optimize motion, animation, WebGL Canvas shaders, and GPU/CPU rendering pipelines to sustain 60–120 FPS.
  Use when: scrolling drops frames, GSAP/ScrollTrigger suffers from input lag or scrub delay, infinite animations drain GPU during idle,
  or Canvas shaders consume excessive compute resources.
  DO NOT USE FOR: JavaScript bundle size, React re-renders, or network request waterfalls (see fe-perf);
  DO NOT USE FOR: Static visual layout or spacing fixes (see fe-layout).
---

# `fe-motion` — Zero-Lag Motion & GPU Pipeline Hygiene

Specialized skill for engineering fluid, hardware-accelerated animations, isolating GPU compositing layers, and eliminating idle rendering load (Zero-Idle Load). Strictly follows [conventions.md](../fe-andy/references/conventions.md).

---

## 1. Proven Technical Benchmarks (Case Study Insights)

Synthesized from high-performance landing page and interactive showcase architectures:
1. **Scrub Lag Elimination**:
   - Eliminate heavy continuous scrubs (e.g. `scrub: 2`) that introduce latency between user wheel movement and visual response. Transition to Triggered Snappy Staggers (`toggleActions: "play none none reverse"` with duration 0.5–0.65s and `power3.out` easing).
2. **Zero-Idle GPU Law**:
   - Strictly prohibit infinite rotation loops (`animate-spin`) on resting UI elements. Transition to bounded interaction states (e.g., rotating 180° on hover via `group-hover:rotate-180`), returning idle GPU consumption to 0%.
3. **GPU Layer Compositing Isolation**:
   - Apply `transform: translate3d(0, 0, 0)` and `backface-visibility: hidden` to heavy background gradients and high-frequency marquee tickers to instruct browser engines to cache textures in VRAM, eliminating continuous repaint cycles.
4. **Shader Downsampling & Blur Hygiene**:
   - Configure downsampling (e.g., `DOWNSAMPLE_SCALE = 0.5`) on interactive WebGL wave canvases to maintain per-frame draw times under 0.5ms; replace expensive software `mask-image` overlays with native GPU gradient blends.
   - Restrict blur filters to moderate radii (`backdrop-blur-md` ≤ 12px instead of `backdrop-blur-xl` 24px) to reduce shader calculation cost by ~75%.
5. **Accessibility Fallbacks**:
   - Provide comprehensive `@media (prefers-reduced-motion: reduce)` fallbacks disabling rotational transforms and setting canvas shaders to static states for vestibular-sensitive users.

---

## 2. Motion Audit & Remediation Protocol

1. **Reflow Attribute Scan**:
   - Flag any CSS or GSAP animation targeting layout properties (`width`, `height`, `top`, `left`, `margin`).
   - Restrict all animations exclusively to composite-only properties: `transform` and `opacity`.
2. **Lifecycle Cleanup**:
   - Ensure all ScrollTrigger instances release inline styles upon completion via `clearProps: "transform,opacity"`.
   - Ensure continuous marquee tracks support `hover:pause`.
3. **Hardware FPS Verification**:
   - Validate smoothness via Chrome DevTools (Rendering ➔ Paint Flashing & Frame Rendering Stats) to confirm 60–120 FPS consistency.
