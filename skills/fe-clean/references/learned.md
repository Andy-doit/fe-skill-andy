# Learned notes — fe-clean

Append-only. Written by the learning loop ([learning-loop.md](../../fe-andy/references/learning-loop.md)); folded into the skill by the fe-learn skill.
Only reusable, proven, non-duplicate lessons. No secrets, client names, or machine paths.

<!-- Add notes below this line, newest at the bottom. -->

### 2026-10-26 · Audit and prune leftover barrel shims after block extraction
- **Type:** pitfall
- **Rule:** When promoting feature components to shared block layers, delete temporary 1-line re-export bridge files (`export * from "@/components/blocks/..."`) in the feature folder once all callers have been migrated.
- **Why / evidence:** Leaving shim files in feature directories violates the 4-layer architecture by making blocks appear as features, obfuscates dependency graphs, and accumulates dead files that never get imported directly.
- **Example:**
  ```javascript
  // Bad: leaving src/features/landing/components/CornerArrow.js
  export * from "@/components/blocks/ui/CornerArrow";
  // Good: callers import directly from '@/components/blocks' and delete the shim.
  ```
- **Applies to:** Any Next.js / React project adopting layer-based architecture
- **Related:** none
- **Status:** promoted (2026-10-28 -> SKILL.md §1 What to flag)
