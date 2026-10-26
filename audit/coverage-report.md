# Coverage Report — fe-skill-andy skill set

- Audit date: 2026-10-26
- Scope: every file on disk under the repo root (single commit `f4c965a`)
- Mode: read-only. No existing file was changed. No script was executed (the task says "ask first"), so script behaviour below comes from reading the source, not from running it.
- Evidence format: `path:line` or `path:start-end`, relative to the repo root.
- Labels: **[Inference]** = deduced from the files, not tested. **[Unverified]** = external fact I could not check against your installed tool versions.

---

## 1. Inventory (Step 1)

### 1.1 Active skills (`skills/`)

All 16 folders have only `name` and `description` in frontmatter. Folder name equals `name` in all 16. Description length was measured after folding the YAML `>` block (approximate, ±10 chars).

| # | Folder = `name` | Lines (SKILL.md) | Desc chars | Claims to cover (description) | Actually contains (body + files) | Split into references/scripts | Links (all resolve?) | Project-specific content |
|---|---|---|---|---|---|---|---|---|
| 1 | `fe-andy` ✅ | 75 | ~360 | Hub/router, overview, 4-layer, session continuity (`skills/fe-andy/SKILL.md:3-7`) | Routing table with slash commands (`:20-37`), 4-layer law (`:41-53`), perf hierarchy (`:57-65`), image-approval protocol (`:69-75`) | `references/conventions.md` (128 lines), `evals/routing.md` (36 lines, **not linked** from SKILL.md) | `./references/conventions.md` ✅ | `@heroui/react` (`:48`), SWR (`:52`), "luxury editorial landing pages" (`:12`) |
| 2 | `fe-perf` ✅ | 55 | ~511 | Load perf, React runtime, CWV, layout thrashing, long tasks (`:3-9`) | 3 "case study" tips (`:18-26`), audit steps (`:30-37`), report table (`:39-45`), prohibitions (`:52-55`) | none | `../fe-andy/references/conventions.md` ✅ | Windows `scroll-smooth` tip (`:25-26`) |
| 3 | `fe-motion` ✅ | 43 | ~470 | Animation, WebGL, GPU, 60–120 FPS (`:3-8`) | 5 GSAP/GPU tips (`:17-30`), 3-step protocol (`:34-43`) | none | conventions ✅ | `DOWNSAMPLE_SCALE = 0.5` from one project (`:27`) |
| 4 | `fe-layout` ✅ | 71 | ~682 | 4px grid, row balancing, ambient rhythm, 100vh (`:3-11`) | Spacing table (`:26-38`), hierarchy (`:42-45`), row balancing (`:49-54`), rhythm (`:58-62`), protocol (`:66-71`) | `references/ambient-rhythm-dnl.md` (53 lines) | conventions ✅, reference ✅ | DNL Capital case study (`references/ambient-rhythm-dnl.md:1-3`) |
| 5 | `fe-contrast` ✅ | 55 | ~547 | WCAG 2.1 contrast, frosted headers (`:3-9`) | Formulas (`:18-29`), thresholds (`:33-41`), script usage (`:45-55`) | `scripts/verify-contrast.mjs` (136 lines), `references/dnl-config.json` (35 lines) | conventions ✅, config ✅ | DNL brand colours and title (`references/dnl-config.json:2-33`); script default config = DNL (`scripts/verify-contrast.mjs:39`) |
| 6 | `fe-skel` ✅ | 45 | ~544 | 1:1 skeletons, AsyncContent 4 states (`:3-9`) | Ghost-replica rules (`:18-28`), AsyncContent pointer (`:32-36`), 4-step workflow (`:40-45`) | `references/async-content.md` (49 lines) | conventions ✅, reference ✅ | Import path `@/components/blocks/async` (`references/async-content.md:12`), `t()` next-intl (`:18`) |
| 7 | `fe-clean` ✅ | 43 | ~600 | Code smells, SOLID/DRY, re-renders, `any`, dead code (`:3-10`) | Smell list (`:19-34`), 4-step refactor protocol (`:38-43`) | none | conventions ✅ | 4-layer folder names (`:21-23`) |
| 8 | `fe-code` ✅ | 47 | ~564 | Scaffold new components, hooks, Redux/Zustand, Server Actions (`:3-9`) | Layer table (`:22-27`), Server Action fallback (`:31-38`), 4-step workflow (`:42-47`) | none | conventions ✅ | HeroUI/Radix paths (`:24-27`), toast + `t()` (`:38`) |
| 9 | `fe-ux` ✅ | 45 | ~714 | Brainstorm/apply modes, Nielsen, forms, `tabular-nums`, `text-balance` (`:3-10`) | Boundaries (`:19-25`), 2 modes (`:29-37`), 3 form rules (`:41-45`) | none | conventions ✅ | "house decision logs" with no path (`:37`) |
| 10 | `fe-sec` ✅ | 50 | ~563 | XSS, secrets, CSRF, CSP, token storage, supply chain (`:3-9`) | Secrets (`:20-22`), XSS (`:24-27`), tokens (`:29-31`), headers (`:33-39`), triage (`:43-50`) | none | conventions ✅ | `next.config.mjs` assumed (`:34`) |
| 11 | `fe-i18n` ✅ | 45 | ~538 | next-intl en/vi parity, hash retention, locale format (`:3-9`) | Parity rules (`:20-23`), switcher rules (`:25-29`), `Intl` formatting (`:31-34`), script (`:38-45`) | `scripts/check-i18n.mjs` (102 lines) | conventions ✅ | en/vi + VND hard-coded (`:4`, `:21`, `:33`) |
| 12 | `fe-test` ✅ | 35 | ~525 | Lint/build/type, Playwright, component tests, axe, visual regression (`:3-9`) | 3-tier table (`:22-26`), 4-step protocol (`:30-35`) | none | conventions ✅ | Turbopack (`:33`), `npm` only (`:24-26`) |
| 13 | `fe-recon` ✅ | 52 | ~539 | Read-only stack/architecture survey (`:3-9`) | Report template (`:20-46`), read-only rules (`:50-52`) | none | conventions ✅ | none significant |
| 14 | `fe-a11y` ✅ | 39 | ~539 | WCAG 2.2 keyboard, focus, ARIA, screen readers (`:3-9`) | Boundaries (`:18-22`), focus (`:28-31`), semantics (`:33-36`), touch target (`:38-39`) | none | conventions ✅ | none |
| 15 | `fe-data` ✅ | 36 | ~550 | SWR/TanStack, dedupe, abort, retry, pagination, waterfalls (`:3-9`) | Boundary note (`:18-20`), waterfall (`:26-28`), abort (`:30-31`), cache/dedupe/optimistic (`:33-36`) | none | conventions ✅ (plus a plain-text path at `:20`) | none |
| 16 | `merge` ✅ | 11 | ~260 | Fold rule drafts into stable conventions (`:3-6`) | One sentence (`skills/merge/SKILL.md:11`). No steps, no paths. | none | none | Depends on repo-root `cannon/drafts/` and `rules/` (see 1.3) which are outside the skill |

### 1.2 Scripts

| Script | Dependencies | Runs without project setup? | Findings |
|---|---|---|---|
| `skills/fe-contrast/scripts/verify-contrast.mjs` | `node:fs`, `node:path`, `node:process`, `node:url` only (`:7-10`) | [Inference] Yes with no args (falls back to bundled DNL config, `:39`). With `--config`, path resolves from CWD (`:42`). | (a) Summary lines print "EXCEEDS AAA" / "EXCEEDS AA" as fixed text whatever the measured values (`:133-135`). (b) Always exits 0; failures do not set an exit code (no `process.exit` after `:136`). (c) Pass threshold is fixed at 4.5 for every text (`:98`), no large-text 3:1 or AAA option. (d) Only models one scenario: a translucent header over scroll-ranged sections (`:81-113`); cannot check an arbitrary fg/bg pair list. (e) Crashes with TypeError if `meta`, `alphas` or `textColors` are missing (`:52-69`); config schema is not documented. (f) If no scrolled rows exist, `Math.min()` returns `Infinity` (`:129-131`). |
| `skills/fe-i18n/scripts/check-i18n.mjs` | `node:fs`, `node:path`, `node:process` (`:10-12`) | [Inference] Yes; paths resolve from CWD (`:31-32`), defaults `messages/en.json` / `messages/vi.json` (`:28-29`). | Exit code 1 on failure (`:102`) ✅. Arrays are treated as leaf values (`:18`), so keys inside arrays are not compared. Only two files per run; no multi-locale or ICU placeholder check (`{name}` mismatch). |

Documented commands assume the repo root as CWD: `node skills/fe-contrast/scripts/...` (`skills/fe-contrast/SKILL.md:50,53`), `node skills/fe-i18n/scripts/...` (`skills/fe-i18n/SKILL.md:43`). After install into `~/.claude/skills/<name>/` there is no `skills/` segment, so these commands break as written.

### 1.3 Non-skill content in the repo

| Path | What it is | Used by an active skill? |
|---|---|---|
| `AGENTS.md`, `GEMINI.md` | Agent rules: work log, image protocol, pixel rules | No direct link. Contain absolute `file:///D:/Work/AI/starci-fe-skills/...` links (`AGENTS.md:12,20`, `GEMINI.md:8-9`) |
| `README.md` | Overview + plugin install | — |
| `HOW-IT-LEARNS.md` | Learning loop that writes into `decision/`, `design/`, `cannon/` (`:9-15`, `:22-32`) | Only indirectly: `fe-ux` "house decision logs" (`skills/fe-ux/SKILL.md:37`) |
| `work_log.md` (145 lines) | Session log; many absolute `D:/` links (e.g. `:16-21`, `:139` contains a user-profile path) | Required by `conventions.md:95-115` |
| `rules/` (11 files), `cannon/` (2), `decision/` (17), `design/` (8), `design-system/` (8), `ui/` (4) | StarCi Academy project knowledge, mostly Vietnamese; `rules/main.md:6` targets `C:\Repositories\starci-academy` | Not linked from any active skill. `merge` implies them. |
| `legacy/` (4 SKILL.md: `fe`, `skill-code-example-fe`, `starci-async`, `starci-fe-ux-brainstorm`) | Older StarCi skills with absolute `C:\`/`D:/` paths (`legacy/fe/SKILL.md:5,15,18,22,24`; `legacy/starci-async/SKILL.md:5,21-23`; `legacy/starci-fe-ux-brainstorm/SKILL.md:17,43`) and tool names "WebSearch/WebFetch", "Opus" (`legacy/starci-fe-ux-brainstorm/SKILL.md:7,10`) | Not under `skills/`, so not part of the installed set [Inference] |
| `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json` | Claude Code plugin manifest, source `.` | — |
| `.antigravity-plugin/plugin.json` | Manifest with `suggestedPrompts` (15 slash commands, `merge` absent) | — |
| `.agents/skills.json` | `{"entries":[{"path":"skills"}]}` | Format not documented in the reference table you gave; see "Cannot determine" |

---

## 2. Coverage matrix (Step 2)

Depth: `none` · `mentioned` (named, no how-to) · `partial` (some how-to, missing cases) · `full` (actionable + verification). Only active skills count. Non-skill folders are noted where they hold content an installed skill cannot reach.

### Performance

| Topic | Skill / file | Depth | Evidence |
|---|---|---|---|
| Event loop | — | none | — |
| Reflow / repaint / composite | fe-motion, fe-perf | partial | `fe-motion/SKILL.md:36-38` (animate only transform/opacity); `fe-perf/SKILL.md:22` (`content-visibility`) |
| Layout thrashing (`offsetHeight`, `getBoundingClientRect`) | fe-perf | partial | `fe-perf/SKILL.md:7`, `:37`, `:44` (batch reads via rAF). No code example, no DevTools steps |
| Long tasks | fe-perf, conventions | partial | `fe-perf/SKILL.md:7,35`; `conventions.md:52,58` ("task slicing, Web Workers" named, no how-to) |
| Bundle size | fe-perf, conventions | partial | `fe-perf/SKILL.md:36` (barrel imports); `conventions.md:53` ("Bundle Analyzer stats"). No tool command or budget |
| Code splitting | conventions, fe-andy | mentioned | `conventions.md:55`; `fe-andy/SKILL.md:60` |
| Tree shaking | fe-perf | mentioned | `fe-perf/SKILL.md:36` |
| Lazy loading (components, images, iframes) | — | none | — |
| CDN | conventions | mentioned | `conventions.md:25` (as a hypothesis category only) |
| Cache headers | — | none | — |
| HTTP compression (gzip/brotli) | — | none | (`fe-andy/SKILL.md:60` "compression" refers to images) |
| Preload / prefetch | fe-andy, conventions | mentioned | `fe-andy/SKILL.md:61`; `conventions.md:56` ("hover prefetching") |
| Third-party scripts | — | none | — |
| Images (formats, responsive, priority) | fe-perf, conventions | partial | `fe-perf/SKILL.md:35` (`fetchpriority`, explicit size); `conventions.md:55` (WebP/AVIF). No `srcset`/`sizes` |
| Video | — | none | — |
| Fonts (`font-display`, subsetting) | fe-andy, conventions | mentioned | `fe-andy/SKILL.md:60`; `conventions.md:55` ("font subsetting") |
| CLS prevention | fe-perf, fe-skel, conventions | partial | `fe-perf/SKILL.md:35`; `fe-skel/SKILL.md:27-28,45`; `conventions.md:126` |
| React re-renders | fe-perf, fe-clean | partial | `fe-perf/SKILL.md:37`; `fe-clean/SKILL.md:24-27` |
| `memo`/`useMemo`/`useCallback` and when NOT to use | fe-perf, conventions | partial | `fe-perf/SKILL.md:53`; `conventions.md:49`. No React Compiler note |
| Context splitting | conventions, fe-andy | mentioned | `conventions.md:59`; `fe-andy/SKILL.md:64` ("context selectors") |
| Virtualization | fe-perf, conventions | partial | `fe-perf/SKILL.md:54` (<100 items threshold); `conventions.md:58` |
| Transitions (`useTransition`, `useDeferredValue`) | — | none | — |
| Effects | fe-clean | mentioned | `fe-clean/SKILL.md:26` |
| Virtual DOM vs real DOM, reconciliation | — | none | — |
| `key` | fe-clean | partial | `fe-clean/SKILL.md:27` (index keys); `fe-skel/references/async-content.md:22` example |
| Request waterfalls | fe-data | partial | `fe-data/SKILL.md:26-28` |
| Dedupe | fe-data | partial | `fe-data/SKILL.md:35` |
| Caching (client) | fe-data | partial | `fe-data/SKILL.md:33-35` |
| Cancellation | fe-data | partial | `fe-data/SKILL.md:30-31` (no code) |
| Retry | fe-data | mentioned | `fe-data/SKILL.md:5` (description only) |
| Pagination / infinite scroll | fe-data | mentioned | `fe-data/SKILL.md:5` (description only) |
| Data prefetch | fe-andy | mentioned | `fe-andy/SKILL.md:61` |
| Optimistic updates | fe-data, fe-ux | partial | `fe-data/SKILL.md:36`; `fe-ux/SKILL.md:25` |
| Realtime (WebSocket / SSE) | — | none | (`conventions.md:74` lists streaming tickers only as a protected zone) |
| CSR / SSR / SSG / ISR | conventions, fe-andy, fe-recon | mentioned | `conventions.md:57`; `fe-andy/SKILL.md:62`; `fe-recon/SKILL.md:5,39` |
| Streaming | fe-andy, conventions | mentioned | `fe-andy/SKILL.md:62`; `conventions.md:57` |
| Hydration | — | none | (non-skill: `rules/starci-dropdown.md:28`) |
| Core Web Vitals (LCP, INP, CLS) | fe-perf | partial | `fe-perf/SKILL.md:4,35`. No thresholds (good/needs-improvement values) |
| Lighthouse | — | none | (non-skill: `GEMINI.md:20`) |
| React Profiler | conventions, fe-perf | mentioned | `conventions.md:51`; `fe-perf/SKILL.md:53` |
| RUM | — | none | — |
| Performance budgets in CI | — | none | — |
| Animation / GPU / canvas | fe-motion | partial | `fe-motion/SKILL.md:20-28,36-43` (manual DevTools check only) |
| `prefers-reduced-motion` | fe-motion, conventions | partial | `fe-motion/SKILL.md:29-30`; `conventions.md:124`. No code example |

### Next.js specifics (README targets Next.js App Router: `README.md:7`)

| Topic | Skill / file | Depth | Evidence |
|---|---|---|---|
| App Router | fe-code, fe-recon | mentioned | `fe-code/SKILL.md:6`; `fe-recon/SKILL.md:26` |
| Server vs Client Components | fe-recon | mentioned | `fe-recon/SKILL.md:39` (`"use client"` as a report field) |
| Cache layers (`fetch` cache, `revalidate`, ISR) | — | none | — |
| Middleware | — | none | — |
| Streaming / Suspense | fe-andy, fe-data | mentioned | `fe-andy/SKILL.md:62`; `fe-data/SKILL.md:28` |
| `next/image` | — | none | — |
| `next/font` | — | none | (non-skill: `design-system/05-typography.md:9`) |
| Hydration errors | — | none | — |
| Server Actions | fe-code, fe-sec | partial | `fe-code/SKILL.md:31-38`; `fe-sec/SKILL.md:50` |

### UI

| Topic | Skill / file | Depth | Evidence |
|---|---|---|---|
| Design system / design tokens | fe-code, fe-andy | partial | `fe-code/SKILL.md:27`; `fe-andy/SKILL.md:46` |
| Theming / dark mode | — | none | (non-skill: `design-system/README.md`) |
| Layout and spacing | fe-layout | partial | `fe-layout/SKILL.md:26-54` (opinionated Tailwind scale) |
| Responsive / mobile-first | fe-layout | mentioned | `fe-layout/SKILL.md:70` |
| Container queries | — | none | — |
| Component conventions | fe-code | partial | `fe-code/SKILL.md:20-27` |
| Component API design (variants, composition, controlled/uncontrolled) | — | none | — |
| Skeletons, loading / empty / error states | fe-skel | partial | `fe-skel/SKILL.md:18-45`; `fe-skel/references/async-content.md:7-49`. Bound to one project's `AsyncContent` |
| Color contrast with verification | fe-contrast | partial | `fe-contrast/SKILL.md:18-55` + script. Script handles one header scenario only and its summary is hard-coded (see 1.2) |

### UX

| Topic | Skill / file | Depth | Evidence |
|---|---|---|---|
| Heuristics | fe-ux | mentioned | `fe-ux/SKILL.md:6,15` (named, not listed or applied) |
| User flows | fe-ux | mentioned | `fe-ux/SKILL.md:7` |
| Perceived performance | fe-ux, fe-skel | partial | `fe-ux/SKILL.md:25`; `fe-skel/SKILL.md:14` |
| Forms: validation, inline errors | fe-ux, fe-code | partial | `fe-ux/SKILL.md:43-44`; `fe-code/SKILL.md:37-38` |
| Forms: autocomplete | — | none | — |
| Forms: file upload | — | none | (non-skill: `rules/starci-form.md:49`) |
| Navigation | — | none | — |
| Feedback | fe-ux | partial | `fe-ux/SKILL.md:44` |
| Undo | fe-ux | partial | `fe-ux/SKILL.md:45` |
| Onboarding (end-user) | — | none | — |
| UX writing (labels, errors, empty states) | — | none | (`fe-skel/references/async-content.md:43` only says copy must use `t()`) |
| Keyboard | fe-a11y | partial | `fe-a11y/SKILL.md:28-31` |
| Focus management | fe-a11y | partial | `fe-a11y/SKILL.md:29-31` |
| ARIA | fe-a11y | partial | `fe-a11y/SKILL.md:33-36` |
| Semantic HTML | fe-a11y | partial | `fe-a11y/SKILL.md:34` |
| Screen readers | fe-a11y | mentioned | `fe-a11y/SKILL.md:4,14` (no test procedure) |
| WCAG 2.2 | fe-a11y | mentioned | `fe-a11y/SKILL.md:3`. None of the 2.2-new criteria (focus not obscured, target size minimum, dragging movements, redundant entry, accessible authentication) appear |
| i18n bilingual dictionaries | fe-i18n | full | `fe-i18n/SKILL.md:20-23,38-45` + `scripts/check-i18n.mjs` (exit code 1 on mismatch, `:102`) |
| Locale formatting | fe-i18n | partial | `fe-i18n/SKILL.md:31-34` (currency, date; no plural/relative time) |
| Locale routing and hash preservation | fe-i18n | partial | `fe-i18n/SKILL.md:25-29` (rules, no code) |

### Security

| Topic | Skill / file | Depth | Evidence |
|---|---|---|---|
| XSS / `dangerouslySetInnerHTML` / sanitization | fe-sec | partial | `fe-sec/SKILL.md:24-26` |
| CSP | fe-sec | mentioned | `fe-sec/SKILL.md:35` (no policy example, nonce, report-only) |
| Trusted Types | — | none | — |
| Auth: token storage | fe-sec | partial | `fe-sec/SKILL.md:29-31` |
| Auth: session, refresh, route guards, middleware, role-based UI, "enforce on server" | — | none | (`fe-sec/SKILL.md:8` excludes backend auth; nothing covers the frontend half) |
| CSRF | fe-sec | mentioned | `fe-sec/SKILL.md:5` (description only) |
| CORS | — | none | — |
| Security headers | fe-sec | partial | `fe-sec/SKILL.md:33-39` (names only, no values, no verify command) |
| Clickjacking | fe-sec | partial | `fe-sec/SKILL.md:36` |
| Secrets in bundle (`NEXT_PUBLIC_*`, `VITE_*`) | fe-sec, conventions | partial | `fe-sec/SKILL.md:20-22`; `conventions.md:68`. No search command / build-output scan |
| Supply chain: `npm audit` | fe-sec | mentioned | `fe-sec/SKILL.md:45` |
| Supply chain: lockfile, SRI, typosquatting, upgrade policy | conventions | mentioned | `conventions.md:69` (consent before new packages only) |
| Open redirect | — | none | — |
| `target="_blank"` + `rel` | fe-sec | partial | `fe-sec/SKILL.md:27` |
| Upload restrictions | — | none | — |
| Logging tokens / personal data (in the app) | conventions | mentioned | `conventions.md:67` (covers agent output, not app logging) |

### Code quality

| Topic | Skill / file | Depth | Evidence |
|---|---|---|---|
| Clean code principles | fe-clean | partial | `fe-clean/SKILL.md:19-34` |
| Folder structure | fe-code | partial | `fe-code/SKILL.md:22-27` |
| Naming | — | none | (non-skill: `cannon/CONTENT.md:51-59`) |
| TypeScript strictness | fe-clean, fe-code, conventions | partial | `fe-clean/SKILL.md:28-30`; `fe-code/SKILL.md:45`; `conventions.md:122` |
| State management (local / global / server / URL) | fe-code, fe-recon | mentioned | `fe-code/SKILL.md:5`; `fe-recon/SKILL.md:28`. No decision guide; URL state none |
| Linting | fe-test, fe-layout, conventions | partial | `fe-test/SKILL.md:24,32`; `conventions.md:122` |
| Formatting | — | none | — |
| Dead-code detection | fe-clean | mentioned | `fe-clean/SKILL.md:34` (no tool) |
| Circular dependencies | — | none | — |
| Refactoring workflow | fe-clean | partial | `fe-clean/SKILL.md:38-43` |
| Tech-debt handling | fe-clean | partial | `fe-clean/SKILL.md:40-41` |

### Resilience and operations

| Topic | Skill / file | Depth | Evidence |
|---|---|---|---|
| Error boundaries | — | none | — |
| Offline behaviour | — | none | — |
| Retry / backoff | fe-data | mentioned | `fe-data/SKILL.md:5` |
| API-down UI | fe-skel | partial | `fe-skel/references/async-content.md:19-20,26,35` |
| Unit tests | — | none | — |
| Component tests | fe-test | mentioned | `fe-test/SKILL.md:5` (description only) |
| E2E | fe-test | partial | `fe-test/SKILL.md:26` (no command or example) |
| a11y checks | fe-test | mentioned | `fe-test/SKILL.md:34` |
| Visual regression | fe-test | mentioned | `fe-test/SKILL.md:5` (description only) |
| CI/CD | — | none | — |
| Docker for frontend | — | none | — |
| Env handling | fe-sec | partial | `fe-sec/SKILL.md:20-22` |
| Release checklist | conventions | partial | `conventions.md:119-128` (DoD acts as one) |
| Rollback | — | none | — |
| Observability: error tracking, logging, analytics | — | none | — |
| Consent and privacy | — | none | — |
| Browser / device compatibility, low-end, slow network | fe-perf | mentioned | `fe-perf/SKILL.md:25-26` (Windows scroll only) |
| SEO (metadata, canonical, sitemap, structured data) | — | none | (non-skill: `cannon/CONTENT.md:80` `generateMetadata`) |
| CMS / rich text rendering | fe-sec | partial | `fe-sec/SKILL.md:26` |
| Realtime data | — | none | — |

**Totals (counted from the tables above):** 129 topic rows → full 1 · partial 51 · mentioned 33 · none 44.

---

## 3. Quality scores (Step 3)

Criteria: 1 description · 2 actionable · 3 measurable · 4 defined output · 5 safety · 6 duplication · 7 freshness · 8 portability · 9 hub.

| Skill | Overall | Evidence (criterion: finding) |
|---|---|---|
| fe-andy | **Needs work** | 1: "Use when" yes, no "do NOT use for" (`SKILL.md:3-7`). 3: no verification. 6: repeats 4-layer law (`:41-53` = `README.md:47-59`, `fe-code/SKILL.md:18-27`), perf hierarchy (`:57-65` = `conventions.md:54-60`), image protocol (`:69-75` = `AGENTS.md:33-50`). 9: hub is a router **plus** repeated content; `evals/routing.md` not linked. 8: slash-command syntax in routing table (`:20-37`). |
| fe-perf | **Needs work** | 1: Good (`:6-9`). 2: partial; tips without code. 3: Profiler/50 ms named (`:35,53`) but no CWV thresholds, no commands (Lighthouse, bundle analyzer). 4: Good — table format (`:41-45`). 6: ScrollTrigger cleanup duplicated with fe-motion (`:23-24` vs `fe-motion/SKILL.md:39-40`) while own description excludes ScrollTrigger (`:8`). 7: no versions; Windows scroll claim unsourced (`:26`). |
| fe-motion | **Needs work** | 1: Good (`:5-8`). 3: manual DevTools only (`:42-43`). 4: no output format. 7: "~75%" saving unsourced (`:28`); `translate3d` hack (`:25`) — [Inference] `will-change` is the usual modern hint; GSAP version not stated. 8: project constant (`:27`). |
| fe-layout | **Needs work** | 1: Good (`:7-11`). 2: Good tables. 3: verification is only `npm run lint` (`:71`), which cannot check layout. 4: class-diff proposal (`:69`) only. 8: one project's Tailwind scale stated as universal law, bans `gap-1`/`gap-5`/`p-5` (`:37`); DNL case study (`references/ambient-rhythm-dnl.md:1-3`). |
| fe-contrast | **Needs work** | 1: Good (`:6-9`). 2–3: formulas + thresholds + script (`:18-55`). Script defects: fixed "EXCEEDS AAA" text (`scripts/verify-contrast.mjs:133-135`), exit code always 0, single scenario. 7: labelled WCAG 2.1 (`:3,12`) while README badge says 2.2 (`README.md:11`). 8: commands use repo-root paths (`:50,53`); DNL config as default (`scripts/verify-contrast.mjs:39`). |
| fe-skel | **Needs work** | 1: Good (`:6-9`). 2: Good example (`references/async-content.md:11-24`). 3: CLS check is manual (`:45`). 4: not defined. 8: requires a specific `AsyncContent` block at `@/components/blocks/async` (`references/async-content.md:12`) that most projects do not have; no fallback for other stacks. |
| fe-clean | **Needs work** | 1: Good (`:6-10`), but "unnecessary React re-renders" (`:5`) collides with fe-perf (`fe-perf/SKILL.md:6`). 2: smell list with thresholds (`:32`). 3: only `npm run lint` + "fe-test" (`:43`); no `tsc`, dead-code or cycle tools. 4: "Structured Debt Report" not specified (`:41`). |
| fe-code | **Needs work** | 1: Good (`:7-9`). 2: no code example. 3: delegates to fe-test (`:47`). 4: none. 7: "PropTypes" (`:45`) — React 19 removed `propTypes` checks [Unverified against your React version]. 8: HeroUI/Radix paths (`:24-27`). |
| fe-ux | **Needs work** | 1: long (~714 chars) but Good boundaries (`:8-10`). 2: modes defined, few how-tos (`:41-45`). 3: none. 4: Mode 1 output ("1–3 concepts + mockups") not templated (`:32`). 5: Mode 1 forbids code (`:33`) ✅. 8: journals into "house decision logs" with no path (`:37`); the stores live outside the skill (`HOW-IT-LEARNS.md:9-15`). |
| fe-sec | **Needs work** | 1: Good, but "Backend auth" exclusion has no pointer (`:8`). 2: partial. 3: `npm audit` only (`:45`); no grep patterns for secrets/`dangerouslySetInnerHTML`. 4: severity tiers (`:46-49`) ✅. 7: `X-Frame-Options` without CSP `frame-ancestors` (`:36`); `rel="noopener"` rule (`:27`) — [Unverified] current browsers already apply noopener by default to `target="_blank"`. |
| fe-i18n | **Needs work** | 1: Good (`:6-9`). 2–3: Good — script with exit code (`:38-45`). 7: next-intl version not stated. 8: en/vi and VND fixed (`:4,21,33`); script defaults to `messages/en.json` / `vi.json`. |
| fe-test | **Needs work** | 1: Good (`:6-9`). 2: tier table (`:22-26`). 3: commands given ✅, but Tier 3 has no Playwright/axe commands. Description promises component + visual regression tests (`:5`) with no body content. 8: `npm` only; writes to `work_log.md` (`:35`). |
| fe-recon | **Good** | 1: Good (`:6-9`). 4: full report template (`:20-46`). 5: strict read-only (`:50-52`). Gap: no detection commands (e.g. read `package.json`, lockfile type). |
| fe-a11y | **Needs work** | 1: Good (`:6-9`). 3: no verification (no axe, keyboard walkthrough or screen-reader steps). 4: none. 7: 44×44 px stated as the rule (`:39`); [Unverified] WCAG 2.2 AA (2.5.8) minimum is 24×24, 44×44 is the AAA criterion. |
| fe-data | **Needs work** | 1: Good (`:7-9`). 2: rules without code. 3: none. 4: none. Retry and pagination promised (`:5`) but absent from body. No realtime. |
| merge | **Poor** | 1: no "use when"/"do not use" pair (`:3-6`). 2: body is one sentence (`:11`). 3–4: none. 8: depends on repo-root drafts folders (`cannon/drafts/README.md`, `rules/main.md:9-14`) that are not shipped with the skill. Name `merge` is generic. |

**Cross-skill safety (criterion 5):** shared via `conventions.md:7-32` (audit → proposal → approval → edit → verify) and `:64-75` (no secrets in output, protected zones). Applies to every skill that links it (15 of 16; `merge` does not). Protected zones are one portfolio's domains (financial, M&A, charts — `conventions.md:73-75`).

---

## 4. Cross-cutting gaps (Step 4)

| Item | Present? | Where / note |
|---|---|---|
| Shared conventions file (workflow, work log format, DoD) | **Yes** | `skills/fe-andy/references/conventions.md:7-32` (workflow), `:106-115` (log format), `:119-128` (DoD). DoD hard-codes `npm run lint` and the 4px scale (`:122-123`). |
| Per-project profile (stack, versions, protected areas, budgets) | **No** | Stack and protected zones are hard-coded in `conventions.md:71-75` and `fe-andy/SKILL.md:46-52`. |
| Priority rubric (impact, effort, risk) | **Partial** | Labels named in `conventions.md:28-29` and columns in `fe-perf/SKILL.md:42`; no definitions or scoring. |
| Before/after examples, anti-patterns | **Partial** | Anti-pattern lists: `fe-perf/SKILL.md:52-55`, `fe-layout/SKILL.md:36-38`, `fe-skel/references/async-content.md:46-49`. Before/after only as prose (`fe-layout/references/ambient-rhythm-dnl.md:9-53`). No code before/after. |
| Working check scripts | **Partial** | Contrast ✅ (defects in 1.2), i18n key diff ✅. Bundle size ❌. |
| Routing eval set | **Partial** | `fe-andy/evals/routing.md:9-25` (15 cases). Missing `fe-andy` and `merge`; results section is "Simulated" (`:29-31`), not a real run; claims every skill has "DO NOT USE FOR" (`:31`), which `fe-andy` and `merge` lack. |

---

## 5. Portability findings (Step 5)

### 5.1 Rule-by-rule, set-wide

| Rule | Result | Evidence |
|---|---|---|
| 1 Frontmatter | **Pass** for all 16 | Only `name` + `description`; names lowercase-hyphen, ≤64, equal folder; descriptions ≈260–714 chars (< 1,024). |
| 2 Folder layout / every extra file linked | **Fail** for fe-andy, fe-contrast, fe-i18n | `fe-andy/evals/routing.md` never linked. Scripts referenced only inside repo-root commands (`fe-contrast/SKILL.md:50,53`; `fe-i18n/SKILL.md:43`), not as skill-relative paths. |
| 3 Paths | **Fail** for 15 skills (all except merge) | Each links `../fe-andy/references/conventions.md` (e.g. `fe-perf/SKILL.md:14`). Sibling form is allowed only if the install guide says "install the whole set"; the current README (`README.md:74-85`) does not say so. Core rules (approval gate, no secrets) live only in that file. `fe-data/SKILL.md:20` cites `fe-skel/references/async-content.md` as plain text. No absolute paths inside `skills/` ✅. |
| 4 Referencing other skills | **Fail** for fe-andy | Slash commands in routing table (`fe-andy/SKILL.md:20-37`). Other skills use plain names ✅ (e.g. `fe-perf/SKILL.md:8`). |
| 5 Tool-neutral wording | **Pass** for all 16 | No tool or UI names found in `skills/` (searched AskUserQuestion, WebSearch, WebFetch, Plan mode, /compact). Violations exist only in `legacy/starci-fe-ux-brainstorm/SKILL.md:7,10`, which is not installed. |
| 6 Scripts | **Partial fail** for fe-contrast, fe-i18n | Built-ins only ✅, no installs ✅, no absolute paths ✅. Documented example commands only work from the repo root (`fe-contrast/SKILL.md:50,53`; `fe-i18n/SKILL.md:43`). |
| 7 No hard dependency on CLAUDE.md / AGENTS.md / GEMINI.md | **Pass** in skills; **risk** at repo level | Skills do not name these files. But `conventions.md:95-115` requires `work_log.md` with no fallback, and the same rules are copied into `AGENTS.md`/`GEMINI.md` with absolute `D:/` links (`AGENTS.md:12,20`; `GEMINI.md:8-9`). No `project-profile.md` exists. |

### 5.2 Per skill, per tool

Codex and Antigravity read `.agents/skills/`; this repo keeps skills in `skills/` (repo-root) and adds `.agents/skills.json` (format unconfirmed). So **project-level** discovery in Codex/Antigravity fails for every skill unless you install via junction/copy (see install guide). The table below grades the skill content itself, assuming it is installed in the correct folder.

| Skill | Claude Code | Codex | Antigravity | Failing rules (evidence) |
|---|---|---|---|---|
| fe-andy | Fail | Fail | Fail | R2 (`evals/routing.md` unlinked), R4 (`SKILL.md:20-37` slash commands) |
| fe-perf | Fail* | Fail* | Fail* | R3 (`:14`) |
| fe-motion | Fail* | Fail* | Fail* | R3 (`:13`) |
| fe-layout | Fail* | Fail* | Fail* | R3 (`:16`) |
| fe-contrast | Fail | Fail | Fail | R2/R6 (`:50,53`), R3 (`:14`) |
| fe-skel | Fail* | Fail* | Fail* | R3 (`:14`) |
| fe-clean | Fail* | Fail* | Fail* | R3 (`:15`) |
| fe-code | Fail* | Fail* | Fail* | R3 (`:14`) |
| fe-ux | Fail* | Fail* | Fail* | R3 (`:15`); undefined journal location (`:37`) |
| fe-sec | Fail* | Fail* | Fail* | R3 (`:14`) |
| fe-i18n | Fail | Fail | Fail | R2/R6 (`:43`), R3 (`:14`) |
| fe-test | Fail* | Fail* | Fail* | R3 (`:14`) |
| fe-recon | Fail* | Fail* | Fail* | R3 (`:14`) |
| fe-a11y | Fail* | Fail* | Fail* | R3 (`:14`) |
| fe-data | Fail* | Fail* | Fail* | R3 (`:14`) |
| merge | Pass (format) | Pass (format) | Pass (format) | Rules pass, but the skill has no usable content and depends on repo-root folders (see §3) |

\* "Fail*" = fails only rule 3. It becomes **Pass** once the install guide states "install the whole set together" and every skill is installed as a sibling (the junction commands in `install-guide.md` do this). [Inference] relative `../fe-andy/...` links resolve through per-skill junctions because each junction sits beside the `fe-andy` junction.

**Claude Code plugin route:** `.claude-plugin/plugin.json` points at `.`; [Unverified] whether plugin skills are invoked as `/fe-perf` (as `README.md:28-43` claims) or with a plugin namespace prefix.

---

## 6. Conflicts and overlaps

| # | Conflict / overlap | Evidence |
|---|---|---|
| C1 | fe-perf description excludes ScrollTrigger, body teaches ScrollTrigger cleanup, same rule in fe-motion | `fe-perf/SKILL.md:8` vs `:23-24`; `fe-motion/SKILL.md:39-40` |
| C2 | Re-renders claimed by two skills | `fe-clean/SKILL.md:5,24-27`; `fe-perf/SKILL.md:6,37` |
| C3 | CLS owned by both | `fe-perf/SKILL.md:4,35`; `fe-skel/SKILL.md:5`; routing table puts "CLS" under fe-perf and "CLS fix" under fe-skel (`fe-andy/SKILL.md:23,27`) |
| C4 | Optimistic updates in both | `fe-ux/SKILL.md:25`; `fe-data/SKILL.md:36` |
| C5 | Forms in both | `fe-code/SKILL.md:7` ("creating forms/modals"); `fe-ux/SKILL.md:6,41-45` |
| C6 | AAA required vs recommended | `conventions.md:125` (DoD requires ≥7:1 primary text) vs `fe-contrast/SKILL.md:35` ("Recommended") |
| C7 | WCAG version mismatch | `fe-contrast/SKILL.md:3` + plugin manifests (`.claude-plugin/plugin.json:4`) say 2.1; `README.md:11` and `fe-a11y/SKILL.md:3` say 2.2 |
| C8 | Touch target 44 px vs WCAG 2.2 AA 24 px | `fe-a11y/SKILL.md:39` [Unverified against your target level] |
| C9 | Image-approval protocol copied 4× | `AGENTS.md:33-50`, `GEMINI.md:13-14`, `fe-andy/SKILL.md:69-75`, `fe-layout/SKILL.md:69` |
| C10 | 4-layer law copied 4× | `README.md:47-59`, `fe-andy/SKILL.md:41-53`, `fe-code/SKILL.md:18-27`, `GEMINI.md:19` |
| C11 | Work-log protocol copied 3× | `AGENTS.md:7-29`, `GEMINI.md:7-9`, `conventions.md:95-115` |
| C12 | Perf hierarchy copied 2× | `fe-andy/SKILL.md:57-65`, `conventions.md:54-60` |
| C13 | README says skills are "non-overlapping" | `README.md:22` vs C1–C5 |
| C14 | fe-test promises component and visual-regression tests, body has none | `fe-test/SKILL.md:5` vs `:18-35` |
| C15 | Antigravity `suggestedPrompts` omits `merge` while README lists `/merge` | `.antigravity-plugin/plugin.json:6-22` vs `README.md:43` |
| C16 | Legacy `starci-async` duplicates fe-skel async conventions | `legacy/starci-async/SKILL.md:3-11` vs `fe-skel/references/async-content.md` |

---

## 7. Cannot determine

1. Whether either script runs cleanly on your Node version — not executed (task says ask first). Static reading only.
2. Whether Codex reads `.agents/skills.json` (`{"entries":[{"path":"skills"}]}`) — not in the reference facts you supplied.
3. Whether Antigravity reads `.antigravity-plugin/plugin.json`.
4. Whether Claude Code plugin skills keep the bare `/fe-perf` name or get a plugin prefix.
5. Which folder is your source of truth: the brief and `AGENTS.md:12` use `D:\Work\AI\starci-fe-skills`; the repo audited is at `E:\an\fe-skill-andy`.
6. Freshness of next-intl, GSAP, SWR, TanStack Query, HeroUI and Next.js guidance — no skill states a version or date, so there is nothing to compare against.
7. Whether the name `merge` collides with another skill or command in your installed tools.
8. Exact description character counts (YAML folding approximated).
9. Whether `legacy/` and the StarCi knowledge folders are still wanted; nothing in the repo says.
