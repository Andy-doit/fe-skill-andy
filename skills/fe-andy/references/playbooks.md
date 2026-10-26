# Project Playbooks — Static Site vs Dynamic App

End-to-end order of work for a new project, saying which skill owns each phase. A playbook decides **sequence**; each phase follows the owning skill's rules and the [conventions.md](./conventions.md) protocol. Full worked example (hybrid e-commerce): [case-study-ecommerce.md](./case-study-ecommerce.md).

---

## 0. Which playbook?

| Question | Static playbook (§1) | Dynamic playbook (§2) |
|---|---|---|
| Is content the same for every visitor? | Yes (maybe per locale) | No: per user, per session, per permission |
| How often does content change? | On publish (minutes–days) | Per request / realtime |
| Is there login, a cart, or user data? | No (or only a contact/newsletter form) | Yes |
| Does SEO matter? | Usually critical | Public pages yes, app pages no |
| Rendering | SSG / static export / ISR | SSR + streaming for public pages, CSR/RSC for app pages |

Most real products are **hybrid**: static marketing/catalog pages plus dynamic account/cart/app pages. Decide per route (§3), not per project.

---

## 1. Static site playbook (landing, marketing, docs, blog, portfolio)

### 1.1 Stack choice

| Need | Next.js (App Router) | Vite + React | Plain React |
|---|---|---|---|
| Pure static, no server | `output: "export"` → any CDN | `vite build` + a prerender step (React Router framework mode `prerender`, or a static-site plugin) | Not recommended: CSR-only hurts LCP/SEO; prerender at build or move to a framework |
| Content updates without redeploy | ISR (`revalidate`) or on-demand revalidation from a CMS webhook | Rebuild on CMS webhook | Rebuild on webhook |
| Forms (contact/newsletter) | Server Action or Route Handler (needs a server) / form service if exported | Form service or a serverless function | Same as Vite |

Content-only sites may fit a content-first framework (e.g. Astro) better. Run that choice through fe-review; this set's examples target React.

### 1.2 Phases

| # | Phase | Skill | Output | Gate |
|---|---|---|---|---|
| 1 | Profile: goals, audience, locales, budgets, browser matrix | fe-andy → `project-profile.md` | Filled profile | Budgets written (LCP ≤ 2.5 s, CLS ≤ 0.1, JS ≤ ~100 KB per page) |
| 2 | Layout concepts (Mode 1, no code) | fe-ux | 1–3 concepts per key page | User picks one |
| 3 | Tokens, spacing, typography, dark mode | fe-layout → fe-contrast | `globals.css` tokens, contrast report | All text pairs pass AA |
| 4 | Sections as Blocks (hero, features, pricing, FAQ, footer) | fe-code | Props-only Blocks | Equal-height rows, no raw hex |
| 5 | Motion (if any) | fe-motion | Animations with cleanup | No idle infinite animations; reduced motion respected |
| 6 | Accessibility pass | fe-a11y | Landmarks, headings, skip link, focus | Keyboard-only run passes |
| 7 | Performance | fe-perf | LCP image priority + `sizes`, `next/font`/self-hosted fonts, deferred third parties | Lighthouse mobile ≥ 90, budgets met |
| 8 | SEO | fe-ship (seo) | Metadata, canonical, OG images, sitemap, robots, JSON-LD (Organization, Article/FAQ) | Rich-results test passes |
| 9 | i18n (if locales > 1) | fe-i18n | Dictionaries, hreflang, locale switch keeps path | `check-i18n.mjs` passes |
| 10 | Security headers, form spam protection | fe-sec | CSP/headers on host, honeypot/turnstile, no secrets in bundle | Headers verified with `curl -I` |
| 11 | Optional offline page | fe-pwa (case A) | Precached shell + `/offline` | DevTools Offline reload OK |
| 12 | Verify + release | fe-test → fe-ship | Lint/type/build, axe, smoke list, analytics with consent | Release checklist ✓ |
| 13 | Learn | fe-learn | Notes promoted after fe-review | — |

### 1.3 Folder skeleton (Next.js)

```
src/app/(marketing)/page.tsx · about/page.tsx · blog/[slug]/page.tsx
src/app/sitemap.ts · robots.ts · opengraph-image.tsx · globals.css (tokens)
src/components/blocks/  hero/ feature-grid/ pricing-table/ faq/ cta/ footer/
src/content/            markdown/MDX or CMS adapter (lib/cms.ts)
```

### 1.4 Static "Done"
- [ ] Every page pre-rendered (build output shows static/SSG); no accidental dynamic APIs (`cookies()`, `headers()`, uncached fetch)
- [ ] LCP element identified and prioritized per page; images sized; fonts subset + `display: swap`
- [ ] Third-party scripts loaded after consent and after interaction where possible
- [ ] Sitemap, robots, canonical, OG, JSON-LD validated
- [ ] AA contrast in all themes; keyboard pass; reduced motion
- [ ] Cache headers: HTML short/revalidate, hashed assets `immutable`

---

## 2. Dynamic app playbook (SaaS dashboard, portal, admin, authenticated app)

### 2.1 Stack choice

| Need | Next.js (App Router) | Vite + React (SPA) | Plain React |
|---|---|---|---|
| Public SEO pages + app | One app: public routes SSR/ISR, app routes behind auth | Split: marketing on a static/SSR framework, app as SPA | Same as Vite |
| Auth | HttpOnly session cookie; verify in a Data Access Layer (DAL) | BFF or same-site API with cookie sessions + CSRF; route guards are UX only | Same as Vite |
| Server state | Server Components fetch; client widgets use TanStack Query/SWR | TanStack Query/SWR everywhere | Same |
| Mutations | Server Actions + `useActionState` / `useOptimistic` | Query mutations + optimistic updates | Same |
| Realtime | SSE/WebSocket in a client component (fe-data) | Same | Same |

### 2.2 Phases

| # | Phase | Skill | Output | Gate |
|---|---|---|---|---|
| 1 | Profile + protected zones (auth, money, permissions) | fe-andy / fe-recon | `project-profile.md` | Protected zones listed |
| 2 | Architecture: route rendering matrix, state placement, libraries | fe-code (state.md) + **fe-review** | ADR + matrix (§3) | fe-review verdicts attached |
| 3 | Flows + layouts (Mode 1) | fe-ux | Flow diagrams, concepts | Approved |
| 4 | Tokens, app shell layout, dark mode | fe-layout → fe-contrast | Shell, tokens | AA in both themes |
| 5 | Auth flow, session, route protection, role UI | fe-sec (auth-frontend) | DAL, login/logout, session expiry UX | Authorization enforced on the server for every data access |
| 6 | Data layer: API client, schemas, query keys, errors | fe-data | Typed client + Zod at boundary | No `any`; cancellation; no waterfalls |
| 7 | Features: Blocks → Features, forms, tables | fe-code (+ fe-ux forms) | Feature modules | Each data region has 4 states |
| 8 | Loading/empty/error states | fe-skel | Skeletons 1:1, error + retry | No CLS on load |
| 9 | Realtime / offline (if needed) | fe-data → fe-pwa | Reconnect, outbox | Offline + reconnect tested |
| 10 | a11y for complex widgets (tables, dialogs, menus, comboboxes) | fe-a11y | APG-conformant widgets | Keyboard + screen reader pass |
| 11 | Performance: bundle per route, INP, virtualization | fe-perf | Budgets met, profiler evidence | p75 INP ≤ 200 ms on key flows |
| 12 | i18n + locale formatting | fe-i18n | Dictionaries, Intl | Parity script passes |
| 13 | Tests: unit/component/E2E/axe | fe-test | Tier per risk | Critical flows E2E green |
| 14 | CI/CD, env, observability, release | fe-ship | Pipeline, Sentry/RUM, SLOs, rollback | Release checklist ✓ |
| 15 | Multi-team scale (only if needed) | fe-mfe + fe-review | ADR | Decision-tree answers backed by data |
| 16 | Learn | fe-learn | — | — |

### 2.3 Folder skeleton (feature-first, any framework)

```
src/app/ (Next.js routes)  |  src/routes/ (Vite/React Router)
src/components/ui/         primitives (from UI library)
src/components/blocks/     data-table/ stat-card/ empty-state/ async-content/
src/features/<feature>/    components/ hooks/ api.ts schemas.ts index.ts (public API)
src/lib/                   api-client.ts  auth/ (dal.ts)  env.ts  money.ts  logger.ts
src/tests/e2e/
```
Rule: features import other features only through their `index.ts`; Blocks never import from `features/` (fe-clean flags cycles).

### 2.4 Dynamic "Done"
- [ ] Every data access re-checks authorization on the server; UI guards are UX only
- [ ] Server state lives in one cache (RSC or query library), not copied into stores
- [ ] URL holds filters/sort/page/tab; reload and share restore the view
- [ ] Each async region: loading / empty / error (+ retry) / content
- [ ] Mutations: pending state, double-submit blocked, error keeps input, optimistic only if reversible
- [ ] Errors tracked with release tag; key flows have SLOs and alerts
- [ ] No secrets with public prefixes; dependency audit clean

---

## 3. Route rendering matrix (fill per project)

| Route | Content | Rendering | Cache | Index? | Owner skill for details |
|---|---|---|---|---|---|
| `/` | Same for all | SSG/ISR | revalidate N s / on-demand tag | yes | fe-perf |
| `/blog/[slug]` | Same for all | SSG + `generateStaticParams` | on publish webhook | yes | fe-ship (seo) |
| `/products/[slug]` | Mostly same; price/stock fresh | ISR shell + fresh dynamic part (Suspense) | tag per product | yes | fe-perf, fe-data |
| `/search?q=` | Per query | Dynamic | short | no (`noindex`) | fe-data |
| `/cart`, `/checkout` | Per user | Dynamic | never shared-cached | no | fe-sec |
| `/dashboard/**` | Per user/role | Dynamic (RSC) or CSR | private | no | fe-sec, fe-data |

Dynamic APIs (`cookies()`, `headers()`, `searchParams`, uncached fetch) make a Next.js route dynamic: keep them out of static routes, or isolate them in a Suspense boundary. Defaults differ between Next.js majors (see [nextjs.md](../../fe-perf/references/nextjs.md)); verify with the build output.
