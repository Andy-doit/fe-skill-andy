---
name: fe-i18n
description: >
  Internationalization: dictionary parity across locale files (missing, orphan, empty keys, placeholder mismatch),
  locale-aware formatting (numbers, currency, dates, relative time, plurals) with Intl, dates and time zones (instant
  vs wall-clock vs plain date, UTC storage, DST-safe arithmetic, Temporal/date-fns choice, hydration-safe rendering,
  time-zone testing), locale routing that keeps path, query and #hash on language switch, long-translation and RTL
  layout safety. Works with next-intl and similar libraries.
  Use when: adding translated content, auditing missing translations, fixing the language switcher, formatting
  values per locale, or dates show the wrong day/time for some users.
  DO NOT USE FOR: tabular-nums or text-balance typography (see fe-ux); static layout and spacing (see fe-layout).
---

# fe-i18n — Dictionaries, Locale Formatting & Routing

Keep every locale complete and every value formatted for its reader. Follows [conventions.md](../fe-andy/references/conventions.md).

## Minimum rules (apply even without fe-andy)
- Read `project-profile.md` in the target project first (i18n library, locales, default locale, message file paths).
- Read-only audit first; propose; wait for approval before editing.
- Never invent translations for languages you are not confident in — mark them for review.
- Finish with the learning loop: append new, proven lessons to [references/learned.md](./references/learned.md) after a duplicate check ([learning-loop.md](../fe-andy/references/learning-loop.md)).

---

## 1. Dictionary parity

- Every key in the source locale exists in every other locale with a non-empty value; same nesting.
- Placeholders match across locales (`{name}`, `{count}`), including ICU plural/select branches.
- No hard-coded user-facing strings in JSX (search for text nodes in components during audits).

Check with the bundled script (from this skill folder; no dependencies):
```bash
node scripts/check-i18n.mjs <path>/messages/en.json <path>/messages/vi.json [<path>/messages/ja.json ...]
```
The first file is the source. Reports missing keys, orphan keys, empty values, and placeholder mismatches per target; exit code 1 on any problem. Script: [scripts/check-i18n.mjs](./scripts/check-i18n.mjs).

## 2. Formatting (use `Intl`, or the i18n library's formatter built on it)

| Value | API | Example |
|---|---|---|
| Number | `new Intl.NumberFormat(locale).format(n)` | `1.234,5` (vi) / `1,234.5` (en) |
| Currency | `Intl.NumberFormat(locale, { style: "currency", currency })` | `250.000 ₫` (vi-VN, VND) |
| Date | `Intl.DateTimeFormat(locale, { dateStyle: "medium" })` | set `timeZone` explicitly when server and client differ |
| Relative time | `Intl.RelativeTimeFormat(locale, { numeric: "auto" })` | "yesterday" |
| Plurals | ICU messages (`{count, plural, one {# item} other {# items}}`) or `Intl.PluralRules` | never `count + " items"` |
| Lists | `Intl.ListFormat(locale)` | "A, B and C" |

Formatting dates/numbers differently on server and client causes hydration errors — format on the server or pass a fixed `timeZone`/locale.

**Dates and time zones in depth:** [dates-time-zones.md](./references/dates-time-zones.md) — the three kinds of time (instant / zoned wall-clock / plain date) and what to store for each, choosing `Intl` + Temporal (polyfilled) vs date-fns v4, DST-safe arithmetic, inputs without zones, SSR/hydration strategies, and pinning `TZ` in tests. Rule: date-only values never pass through `new Date()`.

## 3. Locale routing

Language switcher must keep the current page, query string, and `#hash`:
- Use the library's locale-aware router/`usePathname()` to swap only the locale segment.
- Read `window.location.hash` on the client and re-append it after navigation; keep `searchParams`.
- Never redirect to `/` on switch.
- Set `<html lang>` (and `dir="rtl"` for RTL locales); add `hreflang` alternates (SEO: fe-ship).

## 4. Layout safety

- Leave room for +30–40% longer text (German/Vietnamese often longer than English); avoid fixed-width buttons.
- Use logical CSS properties (`ms-*`/`me-*`, `padding-inline-start`) if RTL is in scope.
- Test with the longest locale and with pseudo-localization if available.

## 5. Verify

- Script exit code 0 for all locale files.
- Switch language on a deep page with `?q=x#section` → same page, query and hash kept.
- Spot-check formatted values per locale on screen.
- Dates: a user in a negative-offset zone sees the same calendar date for date-only values; no hydration warnings on pages with dates; unit tests run with `TZ` pinned (dates-time-zones.md §6–7).

Learned notes: [references/learned.md](./references/learned.md).
