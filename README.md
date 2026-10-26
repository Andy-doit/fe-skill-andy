<div align="center">

# fe-skill-andy

### Universal, Agent-Native Frontend Engineering Suite

[![Next.js](https://img.shields.io/badge/Next.js-App_Router-000000?logo=nextdotjs)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)](https://react.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![WCAG 2.2](https://img.shields.io/badge/WCAG-2.2_AA%2FAAA-22c55e)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![License: MIT](https://img.shields.io/badge/License-MIT-22c55e)](LICENSE)

*A battle-tested suite of 15+ specialized AI Agent skills designed for production-grade web applications, editorial landing pages, financial portals, and interactive dashboards.*

</div>

---

## ⚡ Overview

`fe-skill-andy` provides autonomous AI coding agents (Claude Code, Antigravity, Codex) with explicit, non-overlapping skills. Every skill enforces the **Measure-First Principle**, strict 4-layer architecture, and zero-regression verification.

### 🎯 Quick Reference Directory

| Slash Command | Skill Name | Domain / Key Capabilities |
|---|---|---|
| `/fe-andy` | [`fe-andy`](./skills/fe-andy/) | **Central Hub & Router**: System navigation, core laws, conventions |
| `/fe-perf` | [`fe-perf`](./skills/fe-perf/) | **Loading & Runtime Performance**: Bundle analysis, Web Vitals, virtualization, layout thrashing |
| `/fe-motion` | [`fe-motion`](./skills/fe-motion/) | **Zero-Lag Motion & GPU Hygiene**: 60–120 FPS, GSAP snappy staggers, canvas downsampling, zero-idle load |
| `/fe-layout` | [`fe-layout`](./skills/fe-layout/) | **Pixel-Precision Layout**: 4px grid (`0·2·3·4·6`), equal height rows, ambient rhythm, 100vh balance |
| `/fe-contrast`| [`fe-contrast`](./skills/fe-contrast/)| **Mathematical WCAG 2.1 Audit**: sRGB luminance verification, dynamic multi-state header testing |
| `/fe-skel` | [`fe-skel`](./skills/fe-skel/) | **1:1 Ghost Skeletons**: CLS = 0 layout mirroring, `AsyncContent` multi-state gate |
| `/fe-clean` | [`fe-clean`](./skills/fe-clean/) | **Clean Code & Refactor**: Code smell detection, SOLID/DRY, TypeScript strictness, dead code pruning |
| `/fe-code` | [`fe-code`](./skills/fe-code/) | **4-Layer Scaffolding**: Authoring on-pattern components, resilient Server Actions, typed props |
| `/fe-ux` | [`fe-ux`](./skills/fe-ux/) | **UX Review & Dual-Mode Engine**: Brainstorm mockups, Nielsen heuristics, `tabular-nums`, `text-balance` |
| `/fe-sec` | [`fe-sec`](./skills/fe-sec/) | **Frontend Security**: XSS DOMPurify defense, client secret leak audit, CSP, HttpOnly cookies |
| `/fe-i18n` | [`fe-i18n`](./skills/fe-i18n/) | **Next-Intl Parity & Routing**: Bilingual sync scanner, path/hash retention, locale formatting |
| `/fe-test` | [`fe-test`](./skills/fe-test/) | **Quality Verification**: 3-tier testing matrix (Lint ➔ Build ➔ E2E Playwright/Axe) |
| `/fe-recon` | [`fe-recon`](./skills/fe-recon/) | **Read-Only Codebase Reconnaissance**: Architecture mapping, stack detection, risk identification |
| `/fe-a11y` | [`fe-a11y`](./skills/fe-a11y/) | **Accessibility & Screen Readers**: Keyboard navigation, focus trap, ARIA semantics, WCAG 2.2 |
| `/fe-data` | [`fe-data`](./skills/fe-data/) | **Data Layer & Server State**: SWR / TanStack Query, cache keys, request coalescing, AbortController |
| `/merge` | [`merge`](./skills/merge/) | **Rule Harmonization**: Fold draft rules into stable convention files |

---

## 🏛️ The Universal 4-Layer Architecture Law

> **Every decision lives in exactly ONE layer. Style flows downward; features compose — they never paint.**

```
[Layer 1: Tokens] (globals.css / theme variables: colors, fonts, spacing)
        ↓
[Layer 2: Primitives] (@heroui/react, @radix-ui, base Tailwind utilities)
        ↓
[Layer 3: Blocks] (components/blocks/**: Reusable composed widgets, OWNS style, props-only)
        ↓
[Layer 4: Features] (components/features/**: Coordinates SWR/Store, composes Blocks — ZERO custom style)
```

---

## 🔄 The 5-Step Protocol (Audit-First Workflow)

Every code modification and enhancement task strictly adheres to this sequence:
1. **Read-Only Audit & Inspection**: Distinguish between observed code evidence and runtime hypotheses.
2. **Breakdown & Structured Proposal**: Present file/line locations, impact levels, fix costs, and regression risks.
3. **Await User Approval**: Pause and solicit confirmation. Never edit code without user approval.
4. **Precision Code Modification**: Apply minimal, surgical diffs. Preserve unrelated docstrings and logic.
5. **Verification & Work Log**: Run build, lint, and type-checks; log session entries in `work_log.md`.

---

## 🚀 Installation & Usage

### As an Antigravity / Claude Code Plugin:

```bash
# Add marketplace repository
/plugin marketplace add Andy-doit/fe-skill-andy

# Install plugin
/plugin install fe-skill-andy@fe-skill-andy
/reload-plugins
```

---

## 📄 License

MIT © [Andy-doit](https://github.com/Andy-doit)
