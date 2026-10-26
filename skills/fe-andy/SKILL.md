---
name: fe-andy
description: >
  Master guide and central router for the Andy Frontend Agent Skills suite (fe-skill-andy).
  Use when the user types /fe-andy, asks for an overview of frontend conventions, requires
  skill routing across performance, motion, layout, clean code, security, i18n, accessibility,
  or needs guidance on the 4-layer frontend architecture and session continuity protocols.
---

# `fe-andy` — Master Hub & Router (Andy's Frontend Agent Suite)

`fe-andy` is the central command center for the **`fe-skill-andy`** ecosystem — an agent-native, production-grade frontend engineering system designed for shipping resilient, high-performance web applications, SaaS dashboards, and luxury editorial landing pages.

All skills adhere to the core standards in [conventions.md](./references/conventions.md).

---

## ⚡ Skills Directory & Routing Table

| Slash Command | Skill Name | Domain / Key Capabilities | Primary Triggers |
|---|---|---|---|
| `/fe-andy` | `fe-andy` | **Central Hub & Router**: System navigation, core laws, conventions | `overview`, `help`, `architecture` |
| `/fe-perf` | `fe-perf` | **Loading & Runtime Performance**: Bundle analysis, Web Vitals, virtualization, layout thrashing | `slow page`, `LCP`, `CLS`, `bundle size`, `render lag` |
| `/fe-motion`| `fe-motion`| **Zero-Lag Motion & GPU Hygiene**: 60–120 FPS, GSAP snappy staggers, canvas downsampling, zero-idle load | `jank`, `dropped frames`, `scroll lag`, `smooth canvas` |
| `/fe-layout`| `fe-layout`| **Pixel-Precision Layout**: 4px grid (`0·2·3·4·6`), equal height rows, ambient rhythm, 100vh balance | `fix layout`, `spacing`, `card alignment`, `viewport balance`|
| `/fe-contrast`| `fe-contrast`| **Mathematical WCAG 2.1 Audit**: sRGB luminance verification, dynamic multi-state header testing | `check contrast`, `WCAG`, `readability`, `header contrast` |
| `/fe-skel` | `fe-skel` | **1:1 Ghost Skeletons**: CLS = 0 layout mirroring, `AsyncContent` multi-state gate | `add skeleton`, `loading flicker`, `AsyncContent`, `CLS fix` |
| `/fe-clean` | `fe-clean` | **Clean Code & Refactor**: Code smell detection, SOLID/DRY, TypeScript strictness, dead code pruning | `audit code`, `code smells`, `refactor`, `clean debt` |
| `/fe-code` | `fe-code` | **4-Layer Scaffolding**: Authoring on-pattern components, resilient Server Actions, typed props | `new component`, `scaffold`, `build feature`, `write code` |
| `/fe-ux` | `fe-ux` | **UX Review & Dual-Mode Engine**: Brainstorm mockups, Nielsen heuristics, `tabular-nums`, `text-balance` | `ux review`, `brainstorm layout`, `form ux`, `mockup` |
| `/fe-sec` | `fe-sec` | **Frontend Security**: XSS DOMPurify defense, client secret leak audit, CSP, HttpOnly cookies | `security audit`, `xss check`, `secret leak`, `CSP headers` |
| `/fe-i18n` | `fe-i18n` | **Next-Intl Parity & Routing**: Bilingual sync scanner, path/hash retention, locale formatting | `sync i18n`, `missing translation`, `locale format` |
| `/fe-test` | `fe-test` | **Quality Verification**: 3-tier testing matrix (Lint ➔ Build ➔ E2E Playwright/Axe) | `verify changes`, `run tests`, `pre-commit check` |
| `/fe-recon` | `fe-recon` | **Read-Only Codebase Reconnaissance**: Architecture mapping, stack detection, risk identification | `explore codebase`, `recon`, `map project`, `new repo audit` |
| `/fe-a11y` | `fe-a11y` | **Accessibility & Screen Readers**: Keyboard navigation, focus trap, ARIA semantics, WCAG 2.2 | `a11y audit`, `focus trap`, `keyboard nav`, `screen reader` |
| `/fe-data` | `fe-data` | **Data Layer & Server State**: SWR / TanStack Query, cache keys, request coalescing, AbortController | `api cache`, `abort request`, `waterfall fix`, `optimistic ui`|
| `/merge` | `merge` | **Rule Harmonization**: Fold draft rules into stable convention files | `merge rules`, `/merge` |

---

## 🏛️ The Universal 4-Layer Architecture Law

> **Rule:** Every decision lives in exactly ONE layer. Style flows downward; features compose — they never paint.

```
[Layer 1: Design Tokens] (globals.css / theme variables: colors, fonts, spacing)
           ↓
[Layer 2: Primitives] (@heroui/react, @radix-ui, base Tailwind utilities)
           ↓
[Layer 3: Blocks] (components/blocks/**: Reusable composed widgets, OWNS style, props-only)
           ↓
[Layer 4: Features] (components/features/**: Coordinates SWR/Store, composes Blocks — ZERO custom style)
```

---

## 🚀 Performance Optimization Hierarchy

Always prioritize high-leverage bottlenecks before micro-optimizations:
1. **Payload Reduction**: Image compression (AVIF/WebP), route code-splitting, font subsetting, dependency trimming.
2. **Network & Waterfall Elimination**: Parallel fetching (`Promise.all`), SWR cache deduplication, hover prefetching.
3. **Render Strategy Optimization**: Selective SSR / SSG / ISR, Streaming SSR with Suspense.
4. **Main-Thread Offloading**: Task slicing, Web Workers, long-list virtualization.
5. **React Re-render Pruning**: State colocation, context selectors, targeted memoization (measure first!).
6. **Micro-Optimizations**: Inline functions, loop unrolling (final polish only).

---

## 📸 Image-to-Prompt Approval Protocol

Whenever a user provides a UI screenshot, mockup, or bug screenshot:
1. **NEVER EDIT CODE IMMEDIATELY.**
2. Inspect pixels: Spacing hierarchy (`0·2·3·4·6`), container caps, row heights, optical alignment.
3. Formulate a structured modification proposal with exact class diffs.
4. Solicit user approval and ONLY modify code once approved.
