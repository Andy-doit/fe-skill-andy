---
name: fe-code
description: >
  Scaffold and AUTHOR NEW FRONTEND CODE compliant with the 4-layer architecture (Tokens -> Primitives -> Blocks -> Features):
  generate new components, reusable blocks, custom hooks, Redux slices, Zustand stores,
  resilient Server Actions with developer fallbacks, typed props, and app router pages.
  Use when: creating new UI components, scaffolding features, creating forms/modals, or authoring custom hooks.
  DO NOT USE FOR: Auditing legacy code or detecting code smells (see fe-clean);
  DO NOT USE FOR: Fine-tuning micro layout spacing on existing UI (see fe-layout).
---

# `fe-code` — 4-Layer Feature Authoring & Scaffolding

Specialized skill for creating new frontend components, state stores, and server integration logic aligned with the Universal 4-Layer Architecture Law from day one. Strictly follows [conventions.md](../fe-andy/references/conventions.md).

---

## 1. Universal 4-Layer Architecture Rules

Every newly authored code file must reside in **EXACTLY ONE LAYER** with strict separation of concerns:

| Layer | Target Location | Sole Responsibility | Strict Prohibition |
|---|---|---|---|
| **Layer 4: Features** | `src/features/**` or `components/features/**` | Coordinates SWR/Store, dispatches actions, composes Blocks | **PROHIBITED from writing custom CSS styling** (no ad-hoc borders, backgrounds, shadows) |
| **Layer 3: Blocks** | `src/components/blocks/**` | Reusable composed UI widgets, **OWNS style**, pure/props-only | **PROHIBITED from calling Store / SWR / API directly**; accepts pure props only |
| **Layer 2: UI Primitives** | `@heroui/react`, `@radix-ui`, `globals.css` | Accessible base interactive primitives (Button, Modal, Input) | Avoid overriding CSS haphazardly with `!important` |
| **Layer 1: Tokens** | `globals.css` / theme config | Semantic CSS variables: color (`--primary-*`), fonts, spacing | PROHIBITED from hardcoding raw hex values in JSX |

---

## 2. Resilient Server Actions & Developer Fallbacks

Synthesized from enterprise production form patterns:
1. **Safe Developer Simulation**:
   - In development/preview environments lacking live SMTP or external API credentials, Server Actions must simulate safe success/logging without crashing the invocation pipeline.
2. **Visual Optical Feedback**:
   - Highlight required empty inputs with optical warning borders (`fieldErrors`).
   - Deliver localized feedback via toast messages (`toast.error(t("validation.required"))` and `toast.success(t("submit.success"))`).

---

## 3. Authoring Workflow

1. **Classify Layer**: Determine if the new element is a Layer 3 (Block) or Layer 4 (Feature).
2. **Declare Types**: Define strict TypeScript interfaces or PropTypes; never use `any`.
3. **Scaffold Implementation**: Author clean, early-return logic with bounded component sizes.
4. **Verify Quality**: Run `fe-test` to validate linting and build readiness.
