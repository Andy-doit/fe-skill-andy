# Dates & Time Zones — storing, computing, displaying

Most date bugs are category errors: treating a wall-clock time as an instant, or an instant as a calendar date. Decide the category first, then the API. Browser support below is as of writing — confirm with fe-review.

## 0. Three kinds of time (decide before writing code)

| Kind | Example | Store / transmit | Temporal type | Never |
|---|---|---|---|---|
| **Instant** — a moment on the global timeline | order placed, message sent, token expiry | ISO-8601 in UTC with offset: `2026-10-26T02:00:00Z` | `Instant` / `ZonedDateTime` for display | Store as local string without offset |
| **Zoned wall-clock** — a local time that must stay local | flight departure, store opening hours, calendar event, "every Monday 09:00" | Local date-time **plus IANA zone**: `2026-10-26T09:00` + `Asia/Ho_Chi_Minh` | `ZonedDateTime` (zone kept) | Convert to UTC and drop the zone (breaks across DST/zone rule changes) |
| **Plain date / time** — no zone at all | birthday, invoice date, due date, "09:00" | `2026-10-26` / `09:00` as strings | `PlainDate` / `PlainTime` / `PlainDateTime` | `new Date("2026-10-26")` (parses as UTC midnight → previous day in negative offsets) |

Rules: the API contract names the kind per field (fe-data api-contracts.md); the display zone is the **user's** zone (profile setting, else the browser's `Intl.DateTimeFormat().resolvedOptions().timeZone`), shown explicitly when ambiguous ("09:00 GMT+7"); the server and client must agree on zone and locale for anything rendered on the server (§5).

## 1. Which API

| API / library | Use for | Status / notes |
|---|---|---|
| `Intl.DateTimeFormat` (+ `timeZone`, `dateStyle`/`timeStyle`), `Intl.RelativeTimeFormat`, `Intl.PluralRules` | All **formatting** | Baseline; no library needed for display |
| `Intl.DurationFormat` | "2 h 15 min" formatting | Newer (verify Baseline) |
| **Temporal** (`Temporal.Instant`, `ZonedDateTime`, `PlainDate`, `Duration`) | Arithmetic, zone conversion, comparisons — the correct model | Shipped in Firefox 139+ and Chrome/Edge 144+ (Jan 2026) per secondary sources; **Safari not shipped at writing → not Baseline (verify)**. Use with `temporal-polyfill` (small) or `@js-temporal/polyfill` until the matrix allows native |
| `date-fns` v4 + `@date-fns/tz` (`TZDate`) | Tree-shakeable functions when Temporal is not adopted yet | Immutable `Date` in/out; zone-aware via `TZDate` |
| `dayjs` + `utc`/`timezone` plugins | Very small bundle, chain API | Plugin setup easy to forget per entry point |
| `Luxon` | Zones built-in, rich API | Larger bundle |
| `moment` | — | Legacy; do not add |

Default for new code: `Intl` for display + Temporal (polyfilled) for logic. If the project already uses date-fns, stay on date-fns v4 with `TZDate` and avoid mixing libraries.

## 2. Formatting (display)

```ts
const fmt = new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short", timeZone });
fmt.format(new Date(isoInstant));                       // "26 thg 10, 2026 09:00" (vi-VN, Asia/Ho_Chi_Minh)
fmt.formatRange(start, end);                            // "9:00 – 10:30 AM" — ranges without manual joining

// Relative time with sensible thresholds (never "in 86,400 seconds")
export function relative(target: Date, now = new Date(), locale = "en") {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const s = Math.round((target.getTime() - now.getTime()) / 1000);
  const units: [Intl.RelativeTimeFormatUnit, number][] = [["year", 31536000], ["month", 2592000], ["week", 604800], ["day", 86400], ["hour", 3600], ["minute", 60]];
  for (const [unit, size] of units) if (Math.abs(s) >= size) return rtf.format(Math.round(s / size), unit);
  return rtf.format(s, "second");
}
```
Always render `<time dateTime={iso}>` with the machine-readable value; relative times get a `title`/tooltip with the absolute time and refresh on an interval only while visible.

## 3. Arithmetic (the DST traps)

| Wrong | Why | Right |
|---|---|---|
| `new Date(d.getTime() + 24 * 3600 * 1000)` for "tomorrow" | DST days have 23 or 25 hours | Calendar add in the zone: `zdt.add({ days: 1 })` (Temporal) / `addDays(new TZDate(d, zone), 1)` |
| "End of day" = `23:59:59` in UTC | Wrong day for most users | Compute in the user's zone, then convert to an instant for the query |
| `Jan 31 + 1 month = Mar 3` | Overflow | Temporal clamps (`Jan 31 + 1 month = Feb 28/29`); date-fns `addMonths` clamps too; document the rule |
| Recurring event stored as UTC instants | Breaks when DST shifts or zone rules change | Store local time + zone + recurrence rule; expand to instants at query time |
| Comparing `PlainDate` to an instant | Different kinds | Convert the instant to `PlainDate` **in a zone** first |

```ts
import { Temporal } from "temporal-polyfill";   // drop the import when the matrix allows native Temporal
const zdt = Temporal.Instant.from(isoInstant).toZonedDateTimeISO(userZone);
const dueEndOfDay = zdt.toPlainDate().toZonedDateTime({ timeZone: userZone, plainTime: "23:59:59.999" });
const isLate = Temporal.Now.instant().epochMilliseconds > dueEndOfDay.epochMilliseconds;
const nextWeek = zdt.add({ weeks: 1 });                 // calendar-aware, DST-safe
```

## 4. Inputs

- `<input type="datetime-local">` and date pickers yield **plain** values (no zone). Pair them with an explicit zone (user profile or a visible zone selector) before converting to an instant.
- Date-only inputs stay plain strings end-to-end (`2026-10-26`); never round-trip through `Date`.
- Show the zone when the reader may differ from the author (meeting invites, support tickets). Localized first day of week and week numbering come from `Intl.Locale(...).getWeekInfo()` where available (verify) or the picker's locale config.
- Validation messages use the same formatter as display (fe-ux forms).

## 5. SSR and hydration

| Approach | When |
|---|---|
| Format on the server with the user's zone (cookie/profile) and locale | Default for Next.js; deterministic HTML, no mismatch |
| Render the ISO `<time>` on the server, format after mount on the client (`useSyncExternalStore` or an effect) with `suppressHydrationWarning` on that element only | When the zone is unknown until the client runs (first visit, no cookie) |
| Pass a fixed `timeZone` into every formatter | Any time server and client could differ; never rely on the host's default zone |

Store the detected browser zone in a cookie on first load so later server renders match it.

## 6. Testing

- Pin the process zone and locale in unit tests (`process.env.TZ = "UTC"` in the Vitest setup file; set it before any `Date` is created) and run one job with a negative-offset zone (`TZ=America/New_York`) to catch date-only bugs.
- Playwright: `test.use({ timezoneId: "Asia/Ho_Chi_Minh", locale: "vi-VN" })`; add a case per DST boundary that matters (e.g. `Europe/Berlin` last Sunday of March/October) when the product has scheduling.
- Freeze time (`vi.setSystemTime`) for relative-time and expiry tests.

## 7. Verify

- Every API field with a date names its kind (instant / zoned / plain) in the contract; no `Date` parsing of date-only strings in the codebase (grep `new Date("` on `YYYY-MM-DD`).
- A user in a negative-offset zone sees the same calendar date as the author for date-only values.
- Adding a day across a DST change yields the same wall-clock time.
- No hydration warnings on pages with dates; server and client render identical strings.
- Relative times refresh and carry an absolute `title`; `<time dateTime>` present.
- Bundle: one date library at most; Temporal polyfill removed when the matrix allows native.
