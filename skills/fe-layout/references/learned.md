# Learned notes — fe-layout

Append-only. Written by the learning loop ([learning-loop.md](../../fe-andy/references/learning-loop.md)); folded into the skill by the fe-learn skill.
Only reusable, proven, non-duplicate lessons. No secrets, client names, or machine paths.

<!-- Add notes below this line, newest at the bottom. -->

### 2026-10-26: High-density visual polish via compact radius remap
- Context: Transforming soft, bubbly default card appearance in dense analytical/fintech dashboards.
- Pattern / Rule: Reduce root `--radius` from `0.625rem` (10px) to `0.25rem` (4px), pin `--radius-sm` to `2px` and `--radius-lg` to `6px`. Pair with subtle 1px flat borders (`rgba(0,0,0,0.06)` light / `rgba(255,255,255,0.06)` dark) and `box-shadow: none` on cards.
- Status: rejected: specific to dense analytical/fintech dashboards; excluded from core layout tokens per user decision.

### 2026-10-26: Minimalist navigation hierarchy (flat sub-nav & borderless headers)
- Context: Competing visual container boxes in multi-card analytical trading views.
- Pattern / Rule: Strip active tab background (`data-[state=active]:bg-transparent`) relying on text accent color and font semibold, remove header border (`border-b-0`), and strip sidebar shadow (`shadow-none`) so visual focus stays on the data cards.
- Status: rejected: specific to dense dashboard interfaces; excluded from core layout tokens per user decision.
