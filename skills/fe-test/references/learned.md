# Learned notes — fe-test

Append-only. Written by the learning loop ([learning-loop.md](../../fe-andy/references/learning-loop.md)); folded into the skill by the fe-learn skill.
Only reusable, proven, non-duplicate lessons. No secrets, client names, or machine paths.

<!-- Add notes below this line, newest at the bottom. -->

### 2026-10-26 · Zero-dependency verification tests using Node.js built-in test runner
- **Type:** pattern
- **Rule:** For projects without an installed test framework (Jest/Vitest), use Node.js built-in `node:test` and `node:assert/strict` with `node --test` to write instant unit, schema, and i18n parity tests without modifying dependencies or lockfiles.
- **Why / evidence:** Node >= 18 includes a full TAP/spec test runner and assertion library out of the box. It runs in <100ms, avoids pulling hundreds of test dependencies or TypeScript build pipeline configs into minimal landing pages, and satisfies Tier 1 & Tier 2 verification requirements.
- **Example:**
  ```javascript
  import test from "node:test";
  import assert from "node:assert/strict";
  test("i18n keys parity", () => { assert.deepEqual(missingKeys, []); });
  ```
- **Applies to:** Node.js >= 18.0.0, any JS/TS frontend project
- **Related:** test-recipes.md:1
- **Status:** promoted (2026-10-28 -> references/test-recipes.md §1.1)
