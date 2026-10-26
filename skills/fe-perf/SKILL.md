---
name: fe-perf
description: >
  Optimize page load performance, React runtime execution, Core Web Vitals (LCP, INP, CLS, TTFB),
  and network request flows.
  Use when: page is slow, bundle size is excessive, widespread re-renders occur, memory leaks are suspected,
  layout thrashing occurs (offsetHeight, getBoundingClientRect), or main thread tasks exceed 50ms (Long Tasks).
  DO NOT USE FOR: Animating keyframes, Canvas WebGL shaders, or ScrollTrigger stutter (see fe-motion);
  DO NOT USE FOR: Static visual layout or spacing fixes (see fe-layout).
---

# `fe-perf` — Loading Performance & React Runtime Optimization

Specialized skill for diagnosing and remediating frontend performance bottlenecks across network, bundle assets, DOM rendering, and React component lifecycles. Strictly follows [conventions.md](../fe-andy/references/conventions.md).

---

## 1. Proven Technical Benchmarks (Case Study Insights)

This skill synthesizes battle-tested solutions across production projects:
1. **Layout Thrashing & CPU Repaint Mitigation**:
   - Utilize CSS `content-visibility: auto` paired with `contain-intrinsic-size` on large below-the-fold content blocks to instruct the browser engine to bypass layout calculation until scrolled into view.
2. **ScrollTrigger Lifecycle & Resource Reclamation**:
   - Configure `once: true` on ScrollTrigger entry animations and enforce `clearProps: "transform,opacity"` upon completion to detach event listeners and revert elements to passive hardware rendering (0% idle CPU overhead).
3. **Hardware-Responsive Input Alignment**:
   - Avoid blanket `scroll-smooth` on the root `<html>` element on Windows platforms to eliminate mouse wheel inertia drift and restore instantaneous 1:1 scroll responsiveness.

---

## 2. Measurement-First Diagnostic Protocol

Every performance proposal must follow the **Measure First, Optimize Later** hierarchy:

### Step 1: Read-Only Audit & Profiling
- **Core Web Vitals**: Audit LCP elements (ensure `fetchpriority="high"` on hero images), CLS (explicit width/height or aspect ratios on media/cards), and INP (identify long tasks blocking the main thread > 50ms).
- **Bundle & Network**: Identify un-treeshaken barrel imports (e.g., importing entire `lodash` instead of `lodash-es`), request waterfalls (sequential API calls that can be parallelized).
- **DOM & Runtime**: Pinpoint layout thrashing (interleaved DOM reads like `element.offsetHeight` followed by style writes) and context re-render cascades.

### Step 2: Diagnostic Proposal Matrix
Present findings using the standard reporting format:
```markdown
| Bottleneck | Location (File:Line) | Impact Level | Fix Cost | Regress Risk | Proposed Remediation |
|---|---|---|---|---|---|
| Layout Thrashing | Component.tsx:42 | High (85ms Main Block) | Low (15 mins) | Low | Batch DOM reads via requestAnimationFrame |
```

### Step 3: Implement & Validate Metrics
Verify post-optimization benchmarks (reduction in render duration, bundle KB delta, or INP improvements).

---

## 3. Strict Prohibitions
- ❌ DO NOT wrap components in `React.memo`, `useMemo`, or `useCallback` speculatively without Profiler evidence.
- ❌ DO NOT introduce heavy virtualization libraries (`react-window`, `TanStack Virtual`) for small lists (< 100 items).
- ❌ DO NOT alter protected modules (financial computation, charting engines) without explicit instruction.
