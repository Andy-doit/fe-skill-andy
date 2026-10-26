# WCAG 2.2 — checklist of criteria added in 2.2 (plus common misses)

Confirm wording and exceptions in the official W3C "Understanding WCAG 2.2" pages when a case is borderline.

## Added in 2.2

| SC | Level | What to check | Typical fix |
|---|---|---|---|
| 2.4.11 Focus Not Obscured (Minimum) | AA | Focused element not fully hidden by sticky headers, cookie banners, chat widgets | `scroll-padding-top` equal to sticky header height; banners not covering focus |
| 2.4.12 Focus Not Obscured (Enhanced) | AAA | No part of the focused element hidden | Same, stricter |
| 2.4.13 Focus Appearance | AAA | Focus indicator size and contrast | Thick ring (≥ 2 px) with ≥ 3:1 change |
| 2.5.7 Dragging Movements | AA | Every drag action (sortable list, slider, map pan) has a single-pointer alternative | Up/down buttons, click-to-move, input field |
| 2.5.8 Target Size (Minimum) | AA | Pointer targets ≥ 24×24 CSS px, or enough spacing | Bigger hit area via padding; 44×44 px preferred on touch |
| 3.2.6 Consistent Help | A | Help links/contact appear in the same relative place on every page | Shared layout slot |
| 3.3.7 Redundant Entry | A | Users not asked to re-enter info already given in the same process | Prefill, "same as billing" option |
| 3.3.8 Accessible Authentication (Minimum) | AA | Login does not require a cognitive test (remembering, transcribing) without an alternative | Allow paste and password managers, passkeys, email links; no blocking puzzles |
| 3.3.9 Accessible Authentication (Enhanced) | AAA | No object/content recognition tests | — |

(4.1.1 Parsing was removed in 2.2.)

## Common misses from earlier versions

| SC | Check |
|---|---|
| 1.1.1 Non-text content | Meaningful `alt`; decorative `alt=""` |
| 1.3.1 Info and relationships | Labels tied to inputs; headings/lists/tables marked up |
| 1.4.3 / 1.4.11 Contrast | Text 4.5:1, UI 3:1 (fe-contrast) |
| 1.4.10 Reflow | Works at 320 px width without 2-D scrolling |
| 1.4.13 Content on hover/focus | Tooltips dismissible (Escape), hoverable, persistent |
| 2.1.1 Keyboard | Everything operable by keyboard |
| 2.1.2 No keyboard trap | Can Tab out of every widget (except modal by design, with Escape) |
| 2.4.3 Focus order | Logical order |
| 2.4.7 Focus visible | Always visible |
| 3.3.1 / 3.3.3 Error identification & suggestion | Error text says what and how to fix |
| 4.1.2 Name, role, value | Custom widgets expose correct role/state |
| 4.1.3 Status messages | Announced without moving focus |
