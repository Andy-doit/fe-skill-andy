---
name: fe-i18n
description: >
  Manage and synchronize internationalization (Next-Intl bilingual en/vi), verify dictionary key parity,
  preserve URL pathnames and anchor hashes during language toggles, and format numbers/currencies/dates per locale.
  Use when: adding multilingual content, auditing missing translation keys, fixing locale switcher redirects,
  or formatting locale-specific currencies (vi-VN / en-US).
  DO NOT USE FOR: Typographic text-balance or tabular-nums in data tables (see fe-ux);
  DO NOT USE FOR: Static visual layout or spacing fixes (see fe-layout).
---

# `fe-i18n` — Next-Intl Parity & Regional Locale Formatting

Specialized skill for maintaining 100% symmetry across bilingual/multilingual dictionaries (`messages/en.json` and `messages/vi.json`), ensuring stateful URL retention across locale toggles, and formatting regional values. Strictly follows [conventions.md](../fe-andy/references/conventions.md).

---

## 1. Core Engineering Principles

### 1.1 Dictionary Parity & Symmetry
- Every translation key created in `en.json` must possess a matching counterpart in `vi.json` and vice-versa.
- Nested JSON structures must align identically across all locales.
- No empty strings (`""`) or orphaned keys are permitted.

### 1.2 Router State & Hash Preservation
- The `LanguageSwitcher` component must:
  - Utilize `usePathname()` to capture the active subpage (e.g. `/{locale}/financial-advisory`).
  - Retain existing query parameters and anchor hashes (e.g. `#contact` or `#core-business`) during switching.
  - Never hardcode redirects to `/` which unpleasantly kicks users back to the homepage.

### 1.3 Regional Locale Formatting
All regional data formatting falls under `fe-i18n`:
- **Currencies**: Leverage `Intl.NumberFormat(locale, { style: 'currency', currency: 'VND' })` (producing `100.000 ₫` for Vietnamese, `$100,000` for US English).
- **Dates**: Leverage `Intl.DateTimeFormat(locale, { dateStyle: 'medium' })`.

---

## 2. Automated Parity Verification Script

Includes a standalone, zero-dependency Node.js script:
```bash
# Verify dictionary parity between two locale files:
node skills/fe-i18n/scripts/check-i18n.mjs messages/en.json messages/vi.json
```
The script recursively inspects key trees and reports missing keys, orphan keys, and empty translation strings.
