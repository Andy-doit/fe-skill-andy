# Learned notes — fe-a11y

Append-only. Written by the learning loop ([learning-loop.md](../../fe-andy/references/learning-loop.md)); folded into the skill by the fe-learn skill.
Only reusable, proven, non-duplicate lessons. No secrets, client names, or machine paths.

<!-- Add notes below this line, newest at the bottom. -->

### 2026-10-26: Custom popover select trigger requires role="combobox" for aria-invalid & aria-required
- Context: A custom dropdown trigger implemented via `<button popoverTarget="...">` needed to announce validation errors (`aria-invalid="true"`) and requirement state (`aria-required="true"`). The linter rule `jsx-a11y/role-supports-aria-props` warned that `button` does not support `aria-invalid` or `aria-required`.
- Pattern / Rule: When a `<button>` acts as a trigger opening a popover listbox, explicitly apply `role="combobox"`, `aria-controls="listbox-id"`, `aria-haspopup="listbox"`, and `aria-expanded={isOpen}`. Under the W3C ARIA 1.2 Combobox pattern, `role="combobox"` officially supports `aria-invalid`, `aria-required`, and `aria-controls`, resolving linter warnings and providing standard assistive tech behavior.
- Status: promoted (2026-10-28 -> SKILL.md §1 Names & state)
