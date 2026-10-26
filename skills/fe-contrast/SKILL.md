---
name: fe-contrast
description: >
  Measure and mathematically verify WCAG 2.1 (AA/AAA) color contrast ratios across dynamic user interfaces,
  particularly frosted-glass headers (backdrop-filter) scrolling over complex, multi-colored background sections.
  Use when: auditing text readability, evaluating 3-state navigation headers (top/scrolled/menu-open),
  or validating brand color palette compliance.
  DO NOT USE FOR: Keyboard navigation, focus traps, ARIA attributes, or screen readers (see fe-a11y);
  DO NOT USE FOR: General UX layout evaluation or form validation flows (see fe-ux).
---

# `fe-contrast` — Mathematical WCAG 2.1 Contrast Audit

Specialized skill for calculating sRGB relative luminance and mathematical contrast compliance according to the WCAG 2.1 specification across dynamic viewport scroll positions. Strictly follows [conventions.md](../fe-andy/references/conventions.md).

---

## 1. Mathematical Formulas (sRGB Luminance & Contrast)

Contrast ratio is evaluated using the official WCAG 2.1 standard:
$$\text{Contrast Ratio} = \frac{L_1 + 0.05}{L_2 + 0.05}$$
Where:
- $L_1$ is the relative luminance of the lighter color.
- $L_2$ is the relative luminance of the darker color.
- Relative luminance $L = 0.2126 \times R_{\text{linear}} + 0.7152 \times G_{\text{linear}} + 0.0722 \times B_{\text{linear}}$.
- $C_{\text{linear}} = C_{\text{srgb}} / 12.92$ (if $C_{\text{srgb}} \le 0.04045$), otherwise $((C_{\text{srgb}} + 0.055) / 1.055)^{2.4}$.

For translucent frosted-glass elements (`backdrop-filter`) with alpha transparency, effective background color is derived via alpha compositing:
$$\text{RGB}_{\text{composite}} = \text{RGB}_{\text{surface}} \times \alpha + \text{RGB}_{\text{underlying}} \times (1 - \alpha)$$

---

## 2. Pass/Fail Thresholds

1. **Regular Body Text (< 18pt / < 14pt bold)**: Ratio $\ge 4.5:1$ (WCAG AA). Recommended $\ge 7.0:1$ (WCAG AAA).
2. **Large Text ($\ge 18\text{pt}$ or $\ge 14\text{pt}$ bold)**: Ratio $\ge 3.0:1$ (WCAG AA).
3. **UI Components & Graphical Elements**: Ratio $\ge 3.0:1$ against adjacent colors.
4. **3-State Header Verification**:
   - `top` state: Contrast against hero canvas/banner.
   - `scrolled` state: Contrast against translucent backdrop across all underlying page sections.
   - `menu-open` state: Contrast against solid/opaque mobile drawer background.

---

## 3. Automated Verification Script

This skill includes a standalone, pure Node.js verification script with zero external dependencies:
```bash
# Run verification with project-specific JSON configuration:
node skills/fe-contrast/scripts/verify-contrast.mjs --config <path/to/contrast-config.json>

# Run benchmark reference test (DNL Capital case study):
node skills/fe-contrast/scripts/verify-contrast.mjs --config skills/fe-contrast/references/dnl-config.json
```
Reference configuration template: [`references/dnl-config.json`](./references/dnl-config.json).
