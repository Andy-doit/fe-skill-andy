# Update Plan — fe-skill-andy

- Source: `audit/coverage-report.md` (section refs like §2, §5, C3 point there)
- Status: **applied 2026-10-26** (all items in A, B, N1, D1–D6), plus a new learning loop (see below). Open: D7 / E2 (StarCi folders left in place), E8 (install route — both documented).
- Decisions taken: E1 → `merge` rewritten as `fe-learn`; E3 → AA required, AAA via project profile; E4 → framework-agnostic skills with a Next.js reference (`fe-perf/references/nextjs.md`); E5 → work log optional; E6 → new `fe-ship` skill; E7 → source path `E:\an\fe-skill-andy`.
- Added beyond the plan: learning loop (`fe-andy/references/learning-loop.md`), `references/learned.md` in every skill, health-check script `fe-andy/scripts/check-skills.mjs`.
- Order: non-destructive additions first, renames/merges last (group D/E).
- Effort: S ≈ <1 h · M ≈ 1–3 h · L ≈ >3 h. [Inference] estimates, not measured.

---

## A. Fix existing skills (correctness + portability)

| # | Gap or problem | Evidence | Proposed change | Files affected | Priority | Effort | Risk |
|---|---|---|---|---|---|---|---|
| A1 | Contrast script prints "EXCEEDS AAA/AA" whatever the result; exit code always 0 | `fe-contrast/scripts/verify-contrast.mjs:98,133-135` | Compute pass/fail per level from real minima; `process.exit(1)` on any fail; add `--level AA|AAA` and large-text 3:1 | `skills/fe-contrast/scripts/verify-contrast.mjs` | High | S | Low |
| A2 | Contrast script only supports one header scenario; config schema undocumented; crashes on missing keys | `verify-contrast.mjs:52-69,81-113` | Add a simple `pairs` mode (`[{fg,bg,alpha?,size}]`), validate config with clear errors, document schema in a new `references/config-schema.md` | `scripts/verify-contrast.mjs`, new `skills/fe-contrast/references/config-schema.md`, `SKILL.md` | High | M | Low |
| A3 | Script commands assume repo root | `fe-contrast/SKILL.md:50,53`; `fe-i18n/SKILL.md:43` | Rewrite as skill-relative: "from this skill folder: `node scripts/verify-contrast.mjs --config <abs-or-cwd path>`" and link `scripts/…` by relative path | `skills/fe-contrast/SKILL.md`, `skills/fe-i18n/SKILL.md` | High | S | Low |
| A4 | Slash-command syntax in hub | `fe-andy/SKILL.md:20-37` | Replace "Slash Command" column with plain skill names; add one sentence "invoke by name in your tool" | `skills/fe-andy/SKILL.md` | High | S | Low |
| A5 | `evals/routing.md` not linked | `fe-andy/SKILL.md` (no link) | Add a "Routing evals" link line | `skills/fe-andy/SKILL.md` | Med | S | Low |
| A6 | Hub has no "do NOT use for" | `fe-andy/SKILL.md:3-7` | Add "DO NOT USE FOR: any concrete task — route to the named skill" | `skills/fe-andy/SKILL.md` | Med | S | Low |
| A7 | AAA required (DoD) vs recommended (fe-contrast) | `conventions.md:125` vs `fe-contrast/SKILL.md:35` (C6) | Make DoD say "AA required; AAA if the project profile says so" (pending decision E3) | `skills/fe-andy/references/conventions.md` | Med | S | Low |
| A8 | WCAG version labels inconsistent | C7 | Use "WCAG 2.2" everywhere; note contrast criteria unchanged from 2.1 [Unverified — confirm against W3C text] | `fe-contrast/SKILL.md`, `.claude-plugin/*.json`, `.antigravity-plugin/plugin.json` | Low | S | Low |
| A9 | Touch target rule stated as 44 px | `fe-a11y/SKILL.md:39` (C8) | State AA 24×24 minimum, 44×44 as recommended/AAA [Unverified — confirm SC 2.5.8 / 2.5.5] | `skills/fe-a11y/SKILL.md` | Med | S | Low |
| A10 | fe-perf description excludes ScrollTrigger but body teaches it | C1 | Move `fe-perf/SKILL.md:23-24` content to fe-motion (already there at `:39-40`) — delete from fe-perf only after decision; meanwhile add "see fe-motion" note | `skills/fe-perf/SKILL.md` | Med | S | Low |
| A11 | Re-render ownership split (fe-clean vs fe-perf) | C2 | fe-clean description: "re-render anti-patterns found while refactoring; measured re-render problems → fe-perf" | `skills/fe-clean/SKILL.md` | Med | S | Low |
| A12 | CLS ownership split | C3 | fe-perf: measuring CLS; fe-skel: fixing CLS caused by loading states. Update both descriptions + hub triggers | `fe-perf/SKILL.md`, `fe-skel/SKILL.md`, `fe-andy/SKILL.md` | Med | S | Low |
| A13 | Forms + optimistic UI overlap | C4, C5 | fe-ux owns form UX behaviour; fe-code owns form code; fe-data owns optimistic cache logic. One line each in descriptions | `fe-ux`, `fe-code`, `fe-data` SKILL.md | Low | S | Low |
| A14 | fe-test promises component + visual regression tests with no content | C14 | Either add content (see B10) or remove those words from the description | `skills/fe-test/SKILL.md` | Med | S | Low |
| A15 | PropTypes advice | `fe-code/SKILL.md:45` | Drop "or PropTypes" [Unverified — confirm React 19 behaviour] | `skills/fe-code/SKILL.md` | Low | S | Low |
| A16 | `X-Frame-Options` only; `noopener` framing | `fe-sec/SKILL.md:27,36` | Add CSP `frame-ancestors`; reword `rel` rule as defence-in-depth [Unverified browser defaults] | `skills/fe-sec/SKILL.md` | Low | S | Low |
| A17 | Unsourced numeric claims | `fe-motion/SKILL.md:28` ("~75%"); `fe-perf/SKILL.md:26` | Remove numbers or mark "observed in one project, measure before applying" | `fe-motion/SKILL.md`, `fe-perf/SKILL.md` | Low | S | Low |
| A18 | i18n script ignores keys inside arrays; no placeholder check | `fe-i18n/scripts/check-i18n.mjs:18` | Recurse into arrays with index keys; compare `{placeholder}` sets per key; accept N locale files | `skills/fe-i18n/scripts/check-i18n.mjs`, `SKILL.md` | Med | M | Low |
| A19 | Eval set incomplete and "simulated" | `fe-andy/evals/routing.md:29-31` | Add cases for hub + merge + overlap pairs (C1–C5); replace "Simulated results" with "Expected results; run manually" | `skills/fe-andy/evals/routing.md` | Med | S | Low |

## B. Add missing content to an existing skill

Conflict IDs (C1–C16) refer to coverage-report §6. Every item goes into an existing skill, usually as a `references/<topic>.md` file linked from SKILL.md, to keep SKILL.md short.

| # | Gap | Evidence (§2 rows = none/mentioned) | Proposed change | Files affected | Priority | Effort | Risk |
|---|---|---|---|---|---|---|---|
| B1 | No per-project profile; stack, protected zones, budgets hard-coded | §4; `conventions.md:71-75` | Add `references/project-profile.template.md` (stack + versions, package manager, protected areas, perf budgets, a11y level, locales, spacing scale). Conventions say "read `project-profile.md` at the target repo root if present; else ask" | new `skills/fe-andy/references/project-profile.template.md`, `conventions.md` | High | M | Low |
| B2 | No priority rubric definitions | §4; `conventions.md:28-29` | Add rubric table (Impact 1–3 × Effort S/M/L × Risk L/M/H, tie-breaks) to conventions; reuse in every report | `conventions.md` | High | S | Low |
| B3 | Measurement thresholds missing | §2 CWV, Lighthouse, RUM, budgets = none/partial | fe-perf `references/measurement.md`: CWV thresholds [Unverified — confirm current web.dev values], Lighthouse CLI command, bundle-analyzer command per bundler, budget file example, "measure → change → re-measure" table | new `skills/fe-perf/references/measurement.md` | High | M | Low |
| B4 | Loading topics missing | lazy loading, cache headers, compression, third-party, video, fonts, `srcset` = none/mentioned | fe-perf `references/loading.md` with examples and verification per item | new `skills/fe-perf/references/loading.md` | High | M | Low |
| B5 | React runtime gaps | transitions, VDOM/reconciliation, context splitting, effects = none/mentioned | fe-perf `references/react-runtime.md` (when NOT to memo, React Compiler note [Unverified version], `useTransition`, context split example, key rules) | new `skills/fe-perf/references/react-runtime.md` | Med | M | Low |
| B6 | Next.js specifics almost absent | §2 Next.js block | fe-perf `references/nextjs.md`: Server/Client boundary, fetch cache + `revalidate`, middleware cost, `next/image`, `next/font`, hydration-error checklist. State the Next.js version it was written for | new `skills/fe-perf/references/nextjs.md` | High | M | Med (version drift) |
| B7 | Frontend auth flow missing | §2 Security auth row = none | fe-sec `references/auth-frontend.md`: session vs token, refresh, route guards/middleware, role-based UI, "always enforce on the server" | new `skills/fe-sec/references/auth-frontend.md`, `fe-sec/SKILL.md` description | High | M | Low |
| B8 | Security gaps | Trusted Types, CORS, CSRF body, open redirect, upload limits, supply chain, app logging of PII = none/mentioned | fe-sec `references/checklist.md` with grep patterns (`dangerouslySetInnerHTML`, `NEXT_PUBLIC_`, `VITE_`, `innerHTML`, `window.location =`), CSP example with nonce, lockfile/SRI/upgrade policy | new `skills/fe-sec/references/checklist.md` | High | M | Low |
| B9 | Data layer gaps | retry/backoff, pagination, realtime, error boundaries, offline = none/mentioned | fe-data `references/resilience.md` (retry with backoff, pagination/infinite, WebSocket/SSE reconnect, offline UI hooks, error boundary placement) + code examples | new `skills/fe-data/references/resilience.md` | Med | M | Low |
| B10 | Testing gaps | unit, component, visual regression = none/mentioned | fe-test: add unit/component tier, Playwright + axe example commands, visual-regression option; detect package manager instead of `npm` | `skills/fe-test/SKILL.md` + new `references/test-recipes.md` | Med | M | Low |
| B11 | A11y verification missing | fe-a11y criterion 3 | fe-a11y: keyboard walkthrough checklist, axe command, screen-reader smoke test, WCAG 2.2 new criteria list, report format | `skills/fe-a11y/SKILL.md` + new `references/wcag22-checklist.md` | High | M | Low |
| B12 | UX writing + forms + navigation gaps | §2 UX rows = none | fe-ux `references/ux-writing.md` (buttons, errors, empty states) and `references/forms.md` (autocomplete attrs, upload UX, error summary); add Mode 1 output template | new files under `skills/fe-ux/references/`, `fe-ux/SKILL.md` | Med | M | Low |
| B13 | Theming / dark mode / container queries / component API | §2 UI rows = none | fe-layout `references/theming.md` (tokens, dark mode, contrast re-check) and `references/responsive.md` (mobile-first, container queries); fe-code `references/component-api.md` (variants, composition, controlled/uncontrolled) | new reference files | Med | M | Low |
| B14 | Code-quality tools missing | formatting, dead code, circular deps, naming = none/mentioned | fe-clean: name tool options (e.g. formatter, dead-code finder, cycle checker) as "if installed"; never install without approval (`conventions.md:69`) | `skills/fe-clean/SKILL.md` | Med | S | Low |
| B15 | State-management decision guide missing | §2 State row = mentioned | fe-code `references/state.md`: local vs global vs server vs URL state decision table | new `skills/fe-code/references/state.md` | Med | S | Low |
| B16 | Before/after code examples | §4 | Add 1–2 before/after snippets per reference file created above | the new reference files | Low | M | Low |
| B17 | Bundle-size check script | §4 | Built-in-only Node script that sums `.next/static` or `dist/` JS/CSS sizes against a budget from the project profile | new `skills/fe-perf/scripts/check-bundle-size.mjs` | Med | M | Low |
| B18 | Skill-local copy of core rules (rule 3) | §5 R3 | Add a 4-line "Minimum rules" block to each SKILL.md (read-only first, ask before editing, no secrets in output, respect project profile) so a skill still works if `fe-andy` is missing | all 15 SKILL.md | Med | S | Low |
| B19 | `work_log.md` required with no fallback | `conventions.md:95-115` | Make it "if the target repo has `work_log.md` (or the profile names a log), use it; otherwise report in chat" | `conventions.md` | Med | S | Low |

## C. Add a new skill (only where no existing skill fits)

| # | Gap | Evidence | Proposed change | Files affected | Priority | Effort | Risk |
|---|---|---|---|---|---|---|---|
| N1 | Release/ops topics have no home: CI/CD, Docker, env handling, release checklist, rollback, observability, consent/privacy, SEO | §2 Resilience/ops rows = none | One new skill `fe-ship` ("use when preparing a release, CI, deploy, SEO metadata, error tracking/analytics; do NOT use for perf tuning (fe-perf) or security audit (fe-sec)"). [Inference] none of the 16 descriptions can absorb these without becoming vague. Alternative: split SEO into fe-perf — see decision E6 | new `skills/fe-ship/SKILL.md` + `references/` | Med | L | Low |

No other new skill is proposed.

## D. Renames, merges, removals (do last, after approval)

| # | Problem | Evidence | Proposed change | Files affected | Priority | Effort | Risk |
|---|---|---|---|---|---|---|---|
| D1 | Hub repeats content from conventions/README | `fe-andy/SKILL.md:41-75` (C9–C12) | Cut hub to router table + links; keep 4-layer law, perf hierarchy and image protocol only in `conventions.md` | `skills/fe-andy/SKILL.md` | Med | S | Low |
| D2 | Repo-root agent files duplicate conventions with absolute `D:/` links | `AGENTS.md:12,20`; `GEMINI.md:8-9` (C9, C11) | Replace bodies with "see `skills/fe-andy/references/conventions.md`" and relative links | `AGENTS.md`, `GEMINI.md` | Med | S | Low |
| D3 | `merge` is empty and depends on repo-root folders | §3 merge = Poor | Decision E1: rewrite as `fe-merge` with explicit steps + paths from the project profile, **or** move out of `skills/` into `legacy/` | `skills/merge/` | Med | S–M | Med (rename breaks existing `/merge` habit) |
| D4 | Project case studies inside general skills | `fe-layout/references/ambient-rhythm-dnl.md`; `fe-contrast/references/dnl-config.json` | Rename to neutral `example-*.md` / `example-config.json`, strip brand name, keep as worked examples | those files + links in SKILL.md + script default (`verify-contrast.mjs:39`) | Low | S | Low |
| D5 | Universal 4px scale bans common classes | `fe-layout/SKILL.md:37` | Move the scale to the project profile; skill says "use the profile's scale; default suggestion = …" | `fe-layout/SKILL.md`, profile template | Med | S | Med (changes existing behaviour) |
| D6 | fe-skel bound to one `AsyncContent` component | `fe-skel/references/async-content.md:12` | Present `AsyncContent` as the reference pattern; add "if the project has no such block, propose one or use the existing state component" | `fe-skel/SKILL.md`, `references/async-content.md` | Med | S | Low |
| D7 | `legacy/` and StarCi knowledge folders mixed with a general set | §1.3 | Decision E2: move to a separate `starci-profile` repo or folder, or delete | `legacy/`, `rules/`, `cannon/`, `decision/`, `design/`, `design-system/`, `ui/`, `HOW-IT-LEARNS.md` | Low | M | Med (fe-ux journaling + merge refer to them) |

## E. Decisions I need from you

| # | Decision | Options | Affects |
|---|---|---|---|
| E1 | Keep `merge`? | (a) rewrite as `fe-merge` · (b) move to `legacy/` · (c) delete | D3 |
| E2 | Where does StarCi project knowledge live? | (a) separate repo/profile · (b) stay here, outside `skills/` · (c) delete | D7, fe-ux journaling (`fe-ux/SKILL.md:37`) |
| E3 | Contrast level for DoD | AA required (AAA optional via profile) · AAA required for body text | A7 |
| E4 | Framework scope | Next.js-first (keep B6) · framework-agnostic with Next.js as one reference | B6, descriptions |
| E5 | Work log | Keep `work_log.md` protocol (optional per B19) · drop from general skills | B19, `conventions.md:95-115` |
| E6 | Release/ops topics | New `fe-ship` skill (N1) · spread across fe-perf/fe-sec/fe-test | N1 |
| E7 | Source-of-truth path | `E:\an\fe-skill-andy` (audited) · `D:\Work\AI\starci-fe-skills` (brief + `AGENTS.md:12`) | install guide, D2 |
| E8 | Install style | Per-skill junctions (whole set) · plugin manifests · both | install guide, manifests |

## Suggested execution order

1. A1–A6, A19, B1, B2, B18, B19 (correctness, portability, shared scaffolding)
2. B3, B4, B6, B7, B8, B11 (High-priority content)
3. Remaining A and B items
4. N1 (after E6)
5. D1–D7 (after E1, E2, E5)
