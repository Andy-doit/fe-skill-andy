# Example: Alternating Section Rhythm & Viewport-Centered Flow

Worked example from a corporate landing page, illustrating principles used by `fe-layout`. Class names are examples; use the project's own tokens and scale.

---

## 1. Two-Stage Ambient Rhythm Law

### The Real-World Challenge
When an editorial landing page contains numerous content sections, alternating between dark and light backgrounds repeatedly like zebra stripes causes eye fatigue, while placing two identical blue blocks adjacently collapses visual hierarchy. Cutting sections with hard horizontal borderlines makes the page feel like disjointed PowerPoint slides.

### Architectural Solution
1. **Two-Stage Ambient Rhythm**:
   ```
   [Hero Canvas WebGL] (Autonomous canvas gradient fading downward)
           ↓
   [Section 1: Core Services] (Clean, pristine off-white canvas)
           ↓
   [AMBIENT STAGE 1: Network & Blueprint] (Deep corporate blue, soft radiant glow)
           ↓
   [Section 2: Healthcare & Ecosystem] (Clean off-white canvas)
           ↓
   [AMBIENT STAGE 2: Confidential Contact] (Deep corporate blue, elevated glass card)
           ↓
   [Footer] (Clean off-white canvas)
   ```
2. **Seamless Gradient Blend Masks**:
   - Apply `.landing-section-blend` with multi-stop gradient masks spanning 100px – 140px.
   - Colored ambient stages dissolve softly into the base off-white canvas, eliminating hard horizontal dividing cuts entirely.

---

## 2. 100vh Centered Golden Ratio Flow

### The Real-World Challenge
On desktop viewports configured with 100vh (`h-svh`), using `justify-between` pushes the heading to the ceiling and clamps navigation cards against the floor, creating an awkward empty hole (~350px) in the center of the viewport.

### Architectural Solution
- Transition container layout from `justify-between` to centered vertical alignment: `flex flex-col justify-center my-auto`.
- Cluster Headline, Eyebrow, and Card grids into the optical focal point of the user's field of view.
- Balance top breathing room (below navbar) and bottom padding symmetrically (50/50 golden ratio).

---

## 3. Equal Height Row Balancing & Title Baseline Locking

### The Real-World Challenge
When one card in a row has a 2-line title ("Investor Outreach & Fundraising") while neighbors have 1-line titles, the 2-line card balloons downward, staggering the bottom baseline and leaving action arrows floating at inconsistent heights.

### Architectural Solution
1. **Enforce Absolute Height**: Apply `h-full` to both container reveals and child anchor elements.
2. **Lock Title Baselines**: Standardize title containers to `min-h-[3.25rem] sm:min-h-[3.5rem] flex items-start` combined with `text-balance`. Regardless of line count, optical baselines remain aligned.
3. **Pin Action Footers**: Separate bottom interaction controls (arrows, explore buttons) via `mt-auto pt-4 flex justify-end`, ensuring all action buttons in a grid row align on an identical horizontal line.
