---
name: fe-layout
description: >
  Align and refine visual LAYOUT and SPACING with sub-pixel precision on a strict 4px grid (0·2·3·4·6 scale),
  enforce row height balancing (equal height + footer pinning), maintain alternating background rhythms (Two-Stage Ambient Rhythm),
  and optimize 100vh viewport centered flows.
  Use when: refining layout structure, fixing awkward gaps/padding, correcting uneven card heights, aligning icons with text,
  or smoothing out harsh section transitions.
  DO NOT USE FOR: Authoring or fixing loading skeletons (see fe-skel);
  DO NOT USE FOR: Fine-tuning scroll animations or GPU frame stutter (see fe-motion);
  DO NOT USE FOR: Mathematical color contrast calculations (see fe-contrast).
---

# `fe-layout` — Pixel-Precision Layout & Spatial Hierarchy

Specialized skill for engineering clean, intentional spacing, robust grid/flex alignments, and harmonious visual rhythms across responsive viewports. Strictly follows [conventions.md](../fe-andy/references/conventions.md).

---

## 🎯 Core Law: Strict Pixel Discipline (No "Uniform Slap-On")

> **Never apply spacing arbitrarily or slap identical gap/padding values uniformly across all container levels. Every dimension and alignment must possess mathematical intent on a 4px grid.**

---

## 1. Semantic Spacing Scale (4px Grid: `0 · 2 · 3 · 4 · 6`)

| Token Class | Semantic Relationship | Exact Use Cases |
|---|---|---|
| **`gap-0`** | Tight Semantic Coupling | **Title ↔ Description** (`PageHeader`, title ↔ subtitle) — the only pair using zero gap. |
| **`gap-2`** (8px) | Closely Paired Units | Icon ↔ label, label ↔ input, avatar ↔ username, tag ↔ tag in a badge row. |
| **`gap-3`** (12px) | Same Functional Group | Items of identical type in a list, internal padding within compact cards. |
| **`gap-4`** (16px) | Roomy Container Spacing | Grouping related interactive items that need optical breathing room. |
| **`gap-6`** (24px) | Distinct Functional Boundaries | **Section ↔ section · card ↔ card · text block ↔ CTA · header ↔ main content**. |

> 🚫 **STRICTLY PROHIBITED:**
> - Non-grid fractional values: `gap-1`, `gap-1.5`, `gap-5`, `space-y-5`, `p-5`, `p-7`, `p-11`. Snap immediately to: `0 · 2 · 3 · 4 · 6`.
> - Uniform slap-on: Never apply the same `gap-4` or `p-4` universally across outer containers, cards, and inner elements.

---

## 2. Spacing Hierarchy Law

Child spacing inside a container **MUST ALWAYS BE SMALLER** than parent container spacing:
$$\text{gap-0 (title-desc)} < \text{gap-2 (icon-label)} < \text{gap-3 (card interior)} < \text{px-4 py-3 (card padding)} < \text{gap-6 (inter-card / sections)}$$

---

## 3. Row Height Balancing & Baseline Pinning

When rendering cards in a grid or flex row:
1. **Absolute Height Parity**: All cards in the same row must enforce `h-full flex flex-col`.
2. **Footer Pinning**: Card body content must take `flex-1`. Action footers (buttons, explore links, arrows) must pin firmly to the bottom via `mt-auto`.
3. **Title Baseline Locking**: Fix title heights using `min-h-[3.25rem] flex items-start` combined with `text-balance` so 1-line and 2-line titles maintain identical optical baselines.

---

## 4. Two-Stage Ambient Rhythm & Centered 100vh Viewports

- **Two-Stage Ambient Rhythm**: When a page alternates between light and dark/colored sections, apply gradient blend masks (100–140px) to transition backgrounds softly, eliminating abrupt horizontal cut lines.
- **Centered Golden Ratio Flow**: On 100vh first-screen viewports (`h-svh`), group headline and action tiles into visual center (`justify-center my-auto`), balancing top and bottom margins symmetrically.
- Reference Case Study: [`references/ambient-rhythm-dnl.md`](./references/ambient-rhythm-dnl.md).

---

## 5. Execution Protocol

1. **Inspection**:
   - For image mockups: Adhere strictly to the **Image-to-Prompt Approval Protocol**, specify exact class diffs, and await user approval before editing code.
2. **Application**: Apply grid/flex adjustments, verifying layout integrity across mobile, tablet, and desktop breakpoints.
3. **Verification**: Confirm `npm run lint` passes with 0 errors.
