# Case Study A–Z — E-commerce Storefront (Plan)

A phase-by-phase plan for building an online shop with this skill set. It is a hybrid project: static pages, cached catalog pages, and fully dynamic cart, checkout and account. Each phase states the owning skills, the goal, the decisions to make, the tasks, the output, and the exit gate. Implementation details live in the owning skills. Phase order and generic gates: [playbooks.md](./playbooks.md). Rules: [conventions.md](./conventions.md).

> Default stack in this plan: Next.js App Router, React 19, TypeScript strict, Tailwind v4, Zod, next-intl. Framework APIs change between majors. Before each implementation phase, check version-specific APIs against `project-profile.md` with fe-review.

---

## Example scope

| Item | Value |
|---|---|
| Catalog | ~5,000 products, ~40 categories, variants (size/colour) |
| Locales / currency | `vi` (default), `en`; VND (USD optional later) |
| Customers | Guest checkout + optional accounts |
| Payment | Hosted payment page from a provider (card data never touches our frontend) |
| Backend | Headless commerce backend with a REST API (own or third-party) |
| Team | One frontend team |
| Traffic | ~75 % mobile |

---

## Phase map

| # | Phase | Owner skills | Main output |
|---|---|---|---|
| 1 | Discovery & project profile | fe-andy (fe-recon if a repo exists) | `project-profile.md` |
| 2 | Architecture decisions | fe-code, fe-perf, fe-review, fe-mfe | ADR, route matrix, state table |
| 3 | Project structure | fe-code | Folder tree, import rules |
| 4 | Tokens & layout | fe-layout, fe-contrast | Design tokens, grid rules, contrast report |
| 5 | Money, primitives & blocks | fe-code | Money module, block inventory |
| 6 | Data layer | fe-data | Backend adapter, schemas, cache policy |
| 7 | Catalog pages | fe-code, fe-perf, fe-data | Home, category, product, search |
| 8 | Cart | fe-code, fe-data, fe-ux | Cart flow |
| 9 | Checkout & payment | fe-sec, fe-code | Payment flow + webhook |
| 10 | Account & auth | fe-sec | Protected account area |
| 11 | Loading / empty / error states | fe-skel, fe-ux | State matrix |
| 12 | UX & copy | fe-ux | Flow review, microcopy |
| 13 | Accessibility | fe-a11y, fe-contrast | Widget checklist results |
| 14 | i18n & currency | fe-i18n | Dictionaries, formatting, hreflang |
| 15 | Security | fe-sec | Hardening checklist |
| 16 | Performance | fe-perf | Budget report |
| 17 | SEO | fe-ship | Metadata, structured data, sitemap |
| 18 | Offline catalog (optional) | fe-pwa | Service-worker plan |
| 19 | Testing | fe-test | Test matrix, CI results |
| 20 | Release & observability | fe-ship | Pipeline, monitoring, rollback |
| 21 | Scale later & learn | fe-mfe, fe-review, fe-learn | Revisited ADR, promoted lessons |

Phases 4–6 can run in parallel once 1–3 are approved. Phases 11–17 are not "polish at the end": apply their checklists while building 7–10, then run a final pass.

---

## Phase 1 — Discovery & project profile

- **Owner:** fe-andy (fe-recon first if a repo already exists).
- **Goal:** one written source of truth that every later phase reads.
- **Decide:**
  - Stack and versions; package manager.
  - Locales, default locale, currency.
  - Browser/device support matrix.
  - Accessibility level (WCAG 2.2 AA by default).
- **Do:**
  1. List business requirements: catalog size, payment method, guest checkout, accounts, promotions, shipping rules.
  2. Set budgets: LCP ≤ 2.5 s (p75 mobile), INP ≤ 200 ms, CLS ≤ 0.1, JS per route ≤ ~170 KB gzip, Lighthouse mobile ≥ 90 on home, category and product pages.
  3. Mark protected zones: money calculations, checkout, payment webhooks, auth/session.
  4. Record commands (lint, type-check, test, build) and the environments (local, preview, staging, production).
- **Output:** `project-profile.md` in the target repo, from [project-profile.template.md](./project-profile.template.md).
- **Done when:** the user approves the profile, and budgets plus protected zones are written down.

---

## Phase 2 — Architecture decisions

- **Owner:** fe-code (state placement), fe-perf (rendering), fe-review (validation), fe-mfe (to rule micro-frontends in or out).
- **Goal:** decide rendering, state and integration once, before writing features.

### 2.1 Framework choice
- A public storefront needs SEO, fast first render on mobile, and shareable URLs. Choose server rendering with caching (Next.js App Router, or another SSR framework).
- A Vite + React SPA fits internal tools such as an admin/merchandising app (Appendix A). It does not fit the public storefront unless SEO is irrelevant.
- Run the choice through fe-review and attach the verdict.

### 2.2 Route rendering matrix

| Route | Type | Strategy | Freshness | Indexed |
|---|---|---|---|---|
| Home | Static | Pre-rendered, cached data, revalidated by time + CMS webhook | ≤ 5 min | yes |
| About, policies | Static | Pre-rendered at build | on deploy | yes |
| Category | Dynamic render, cached data | Filters/sort/page read from URL; backend data cached per category tag | ≤ 5 min | base + paginated pages yes; filter combinations no |
| Product detail | Static shell + fresh island | Top ~500 products pre-rendered, others rendered on first request then cached; price/stock streamed separately with short cache | content on webhook; price/stock ≤ 60 s | yes |
| Search | Dynamic | Per query | per request | no |
| Cart | Dynamic, per user | Cart id in HttpOnly cookie; never cached | real time | no |
| Checkout | Dynamic, per user | Server-side session creation → hosted payment | real time | no |
| Account | Dynamic, authenticated | Server-side auth check on every data access | real time | no |
| Webhooks (revalidate, payment) | Server only | Signed/secret-protected endpoints | — | — |

### 2.3 State placement (see [state.md](../../fe-code/references/state.md))

| State | Lives in | Never in |
|---|---|---|
| Products, categories, prices | Server rendering with cached fetches | A client global store |
| Filters, sort, page, search query | URL | Component state (lost on reload/share) |
| Cart | Backend cart; id in HttpOnly cookie; optimistic UI only for instant feedback | `localStorage` as source of truth |
| Mini-cart count | Rendered on the server from the cart; refreshed after cart actions | A separate client counter |
| Session / user | HttpOnly session cookie, read on the server | JS-readable storage |
| Gallery index, drawers, inputs | Local component state | Global store |

### 2.4 Decisions to record (ADR)
1. Hybrid rendering per route (2.2).
2. No global client store in v1. The cart is server state. fe-review: "Redux for everything" is outdated (fe-review case 5.1).
3. No micro-frontends. In the fe-mfe decision tree, one team with no need for independent deploys means a monolith with enforced folder boundaries.
4. Hosted payment page, which keeps card data out of the frontend.
5. Money stored as integers in minor units, formatted in exactly one module.
6. Only one adapter module talks to the commerce backend, so the backend can be replaced.

- **Output:** ADR entries in `project-profile.md` → Known decisions; the route matrix; the state table.
- **Done when:** the user approves, and fe-review verdicts are attached for framework, data/state libraries and the payment approach.

---

## Phase 3 — Project structure

- **Owner:** fe-code.
- **Goal:** a folder layout that enforces the 4-layer architecture (Tokens → Primitives → Blocks → Features).

```
src/
├─ app/                      routes only (thin): [locale]/ home, (content)/, (shop)/c, (shop)/p, search, cart, checkout, account/(protected)
│  ├─ api/                   revalidate webhook, payment webhook
│  └─ sitemap, robots, manifest, global styles (tokens)
├─ components/
│  ├─ ui/                    Layer 2 — primitives: button, input, select, dialog, sheet
│  └─ blocks/                Layer 3 — props only: product-card, price, rating, product-gallery,
│                            quantity-stepper, filter-panel, pagination, breadcrumb, empty-state, skeletons
├─ features/                 Layer 4 — data + composition, no custom styling
│  ├─ catalog/ · product/ · search/ · cart/ · checkout/ (protected) · account/
│  │    each: components/, queries, actions, public index
├─ lib/
│  ├─ env                    validated server-only environment
│  ├─ money                  protected
│  ├─ commerce/              the only backend adapter: client, schemas, errors
│  ├─ auth/                  protected: session + data-access checks
│  ├─ seo/                   structured-data builders
│  └─ analytics              one tracking wrapper
├─ i18n/                     routing, request config, messages/vi, messages/en
└─ tests/                    unit/, e2e/
```

**Import rules:**
- Features import other features only through their public index.
- Blocks never import from `features/` or `lib/commerce`.
- Only `lib/commerce` calls the backend.
- Route files stay thin: they read params, call feature queries, and compose.
- **Output:** an empty skeleton of folders + index files, with lint rules for import boundaries (fe-clean can enforce cycles/boundaries).
- **Done when:** the tree is approved, and lint fails on a forbidden import.

---

## Phase 4 — Tokens & layout

- **Owner:** fe-layout, then fe-contrast.
- **Goal:** every colour, spacing step and radius comes from tokens, and contrast is measured.
- **Decide:**
  - Brand palette with semantic token names: surface, ink, ink-muted, brand, brand-ink, sale, success, border.
  - Spacing scale (e.g. 2 · 3 · 4 · 6 · 8 · 12) and section rhythm.
  - Radius scale.
  - Whether v1 has dark mode (recommended: no, unless required).
- **Do:**
  1. Define tokens in the global stylesheet (Tailwind v4 theme variables).
  2. Product grid rules: 2 columns on mobile, 3 on tablet, 4 on desktop. Cards are equal height, with the price row pinned to the bottom.
  3. Measure every text/background pair with fe-contrast, including sale badges on images and muted text.
- **Output:** token list, grid/spacing rules in the profile, contrast report.
- **Done when:** all text pairs meet AA (≥ 4.5:1, ≥ 3:1 for large text and UI), and no raw colour values appear in components.

---

## Phase 5 — Money, primitives & blocks

- **Owner:** fe-code.
- **Goal:** a reviewed money module and the reusable visual building blocks, before any page exists.
- **Money module (protected zone):**
  - Amounts are integers in minor units (VND has 0 decimals, USD has 2). Floats are never used for money.
  - One formatting function using `Intl.NumberFormat` per locale (e.g. `250.000 ₫` for `vi-VN`).
  - Helpers for multiply-by-quantity and sum. Mixed currencies are rejected.
  - Unit-tested before use (Phase 19).
- **Block inventory:**

| Block | Responsibility | Notes |
|---|---|---|
| Price | Current + compare-at price | Sale not shown by colour alone; screen-reader text for original price; tabular numbers |
| ProductCard | Image, name, price, badge, link | One link per card; fixed aspect ratio; equal height; image priority only for the first row |
| ProductGallery | Main image + thumbnails | Thumbnails are buttons with position labels; no autoplay |
| QuantityStepper | − / input / + | Labelled buttons; min/max enforced |
| FilterPanel (view) | Filter groups | Fieldset + legend; large touch targets |
| Pagination | Page links | Real links, so pages are crawlable |
| Breadcrumb, Rating, EmptyState, Skeletons | — | Skeletons mirror the real layout 1:1 |

- **Output:** the money module + blocks, each rendered in all states (fe-code §2 step 7).
- **Done when:** blocks are props-only, typed (no `any`), and use tokens only. Money unit tests pass.

---

## Phase 6 — Data layer

- **Owner:** fe-data.
- **Goal:** one typed, validated, cache-aware path to the backend.
- **Do:**
  1. **Environment:** validate all server variables at startup (API URL, API token, payment keys, webhook secrets, revalidate secret, site URL) in a server-only module. No secret uses a public prefix.
  2. **Schemas:** define runtime schemas (Zod) for product summary, product detail, product page (list), stock/price, cart and session. Types are inferred from the schemas.
  3. **Client:** one function that adds auth headers, applies a request timeout (e.g. 8 s), validates the response with a schema, maps 404 to "not found", and raises typed errors for everything else.
  4. **Cache policy** per data type:

| Data | Cache | Invalidation |
|---|---|---|
| Category listings | ~5 min | tag per category + global catalog tag |
| Product detail | ~1 h | tag per product, via webhook on change |
| Price / stock | ≤ 60 s | tag per product |
| Top-product list (for pre-rendering) | 24 h | — |
| Cart, session, orders | never cached | — |

  5. Deduplicate identical reads within one request, e.g. product data used by both metadata and page.
- **Output:** adapter module, schemas, cache table in the profile.
- **Done when:** one backend call per resource per render; independent calls run in parallel; a backend timeout shows the error state instead of a hung page.

---

## Phase 7 — Catalog pages

- **Owner:** fe-code (build), fe-perf (rendering/LCP), fe-data (fetching).

### 7.1 Home
- Sections are Blocks fed by cached data (hero, featured categories, best sellers, promotions).
- Revalidated by time and by the CMS/commerce webhook (a secret-checked endpoint that accepts only well-formed cache tags).
- LCP element: the hero image, which gets priority and correct `sizes`. No autoplaying carousel on first view.

### 7.2 Category page (PLP)
- The URL is the state. Parse filters, sort and page from the URL with a schema that falls back to safe defaults.
- Unknown category → 404. Backend failure → route error state.
- Filter changes update the URL (replace, no scroll jump) inside a transition. Changing a filter resets the page number.
- The filter form also works as a plain GET form without JavaScript.
- Show the result count, announced politely to screen readers.
- Pagination uses real links. Paginated pages are self-canonical; filter combinations are `noindex, follow` (or canonical to the base category).

### 7.3 Product detail page (PDP)
- Pre-render the top ~500 products per locale; render others on first request, then cache.
- Product content is cached and invalidated by webhook. Price and stock are a separate, short-cached part streamed inside a Suspense boundary, so the shell is fast and the price is fresh.
- Reviews and recommendations stream after the main content and are non-critical.
- Metadata per product: title, description, canonical, language alternates, Open Graph image. Product structured data (Phase 17).
- LCP element: the main gallery image.

### 7.4 Search
- A debounced search input (~300 ms) updates the URL, and the server renders results. Requests that are out of date are discarded (fe-data cancellation rules).
- The search page is `noindex`.
- Empty results show suggestions or popular categories.

- **Output:** working home, category, product and search routes.
- **Done when:** every route's build output matches the rendering matrix; LCP elements are identified; filters survive reload and sharing; 404 and error states work.

---

## Phase 8 — Cart

- **Owner:** fe-code, fe-data (optimistic rules), fe-ux (feedback).
- **Flow:**
  1. "Add to cart" is a form posting to a server action. Inputs (variant id, quantity 1–20) are validated with a schema.
  2. The server creates the backend cart on first add and stores its id in an HttpOnly, Secure, SameSite=Lax cookie (~30 days).
  3. The backend computes line prices and totals. Client-sent prices are never used.
  4. After each action, refresh the server-rendered parts that show the cart (mini-cart count, cart page).
  5. Quantity changes and removals on the cart page use optimistic UI with rollback on failure, plus "Removed. Undo".
- **Feedback:** the button shows its pending state and blocks double submit. The result ("Added to cart") is announced as a status message with a link to the cart. Do not open a blocking modal.
- **Rules:** the cart is never in a shared cache; out-of-stock variants disable the button with a clear label; line-level errors ("Only 2 left") appear next to the line.
- **Done when:** add/update/remove work with JavaScript on and off; a reload keeps the cart; totals always match the backend.

---

## Phase 9 — Checkout & payment (protected zone)

- **Owner:** fe-sec (rules), fe-code (build). Needs explicit approval from the user before any change.
- **Flow:**
  1. The user clicks "Checkout". A server action reads the cart id from the cookie and re-reads the cart from the backend (server truth).
  2. The server recomputes totals (discounts, shipping, tax) and creates a hosted payment session, using an idempotency key per cart state.
  3. The browser is redirected to the provider's page.
  4. The provider calls the payment webhook. Verify the signature using the raw request body. Process idempotently, keyed by provider event/session id. Return 2xx quickly. Only this step marks an order as paid.
  5. The success page fetches the order/payment status from the server by session id. A URL flag such as `?paid=true` is never trusted.
- **If address/contact is collected here:** correct `autocomplete` tokens, keep input on error, focus the first invalid field, and no surprise fees at the last step (fe-ux forms).
- **Provider notes:** the same shape (server creates session → redirect → signed callback → idempotent confirmation) applies to card processors and local wallets or gateways. Follow each provider's signature-verification docs.
- **Done when:** a staging test order completes end to end; replaying the webhook creates no duplicate order; tampering with client data cannot change the amount charged.

---

## Phase 10 — Account & auth

- **Owner:** fe-sec.
- **Do:**
  1. Login, logout and password reset are handled by the backend, which sets and clears an HttpOnly session cookie.
  2. A server-only data-access layer reads the session once per request and exposes "get user" and "require user". "Require user" redirects to login with a safe return path.
  3. Every account page and account action calls it. Order detail checks ownership on the backend.
  4. Route-level redirects (middleware/proxy) are UX only, not the security boundary (fe-review case 5.3).
- **Done when:** direct requests to account data without a session fail on the server; one user cannot read another user's order by changing an id.

---

## Phase 11 — Loading, empty and error states

- **Owner:** fe-skel (UI), fe-ux (copy).

| Region | Loading | Empty | Error |
|---|---|---|---|
| Category grid | Card skeletons with the same grid and aspect ratio | "No products match these filters" + Clear filters | "We couldn't load products." + Try again |
| PDP price/stock | Skeleton of the same height as price + button | Out of stock: disabled button + "Notify me" | "Price unavailable" + retry; hide Buy |
| Search | Previous results stay, dimmed and marked busy | "No results for '…'" + suggestions | Same as category |
| Cart | Server-rendered (no skeleton) | "Your cart is empty" + Continue shopping | Line-level messages |
| Reviews | Skeleton list | "No reviews yet" | Hide the section (non-critical) |

- **Done when:** with the backend blocked, each region shows its error state; on recovery the content appears without layout shift.

---

## Phase 12 — UX & copy

- **Owner:** fe-ux.
- **Do:**
  1. **Mode 1 before building:** 2–3 PDP layouts (gallery left + info right; sticky buy box; mobile bottom buy bar) and 2 category layouts. The user picks one.
  2. **Category:** on mobile, filters sit in a sheet with a live count on Apply ("Show 124 products"); active filters appear as removable chips; scroll position is restored on back.
  3. **Product page:** the variant must be chosen before adding (the button says "Choose a size"). Show the delivery estimate and returns policy near the buy button, and prices including VAT.
  4. **Cart:** undo on remove; a free-shipping progress message.
  5. **Checkout:** guest by default; account creation offered after payment.
  6. **Copy:** every error says what happened and what to do next. No raw codes like "Error 500".
- **Done when:** the flow review covers home → category → product → cart → payment → success, and all microcopy is in the dictionaries.

---

## Phase 13 — Accessibility

- **Owner:** fe-a11y, fe-contrast.
- **Checklist:**
  - [ ] Skip link to main content; landmarks; one `h1` per page
  - [ ] Product images have meaningful alt text; one link per card
  - [ ] Gallery thumbnails: buttons with "Image 2 of 5" labels and a current marker
  - [ ] Filters grouped with fieldset/legend; result count announced
  - [ ] Mini-cart drawer and mobile filter sheet: dialog semantics, focus moves in and is trapped, Escape closes, focus returns to the trigger
  - [ ] Quantity stepper buttons labelled; input labelled; limits announced
  - [ ] Add-to-cart result announced as a status
  - [ ] Targets ≥ 24 px (AA), primary actions ≥ 44 px; focus visible and not hidden by a sticky header
  - [ ] Sale price not conveyed by colour alone
  - [ ] Automated axe checks on home, category, product, cart (Phase 19) + one manual keyboard and screen-reader pass
- **Done when:** the checklist and axe are clean, and the keyboard-only purchase run succeeds.

---

## Phase 14 — i18n & currency

- **Owner:** fe-i18n.
- **Do:**
  1. Locale-prefixed routes (`/vi/…`, `/en/…`). The language switcher keeps path, query and hash.
  2. All copy in per-locale dictionaries. Run the parity script to find missing keys, orphan keys and placeholder mismatches.
  3. Money only through the money module; dates via `Intl.DateTimeFormat`; plurals via ICU messages.
  4. Language alternates (hreflang + x-default) on every indexable page.
  5. Long-translation safety: buttons wrap instead of overflowing; product names clamp to two lines.
- **Done when:** the parity script passes, VND renders as `250.000 ₫` in `vi`, and switching language on a filtered category keeps the filters.

---

## Phase 15 — Security

- **Owner:** fe-sec.
- **Checklist:**
  - [ ] Security headers: HSTS, nosniff, referrer policy, permissions policy, frame-ancestors; CSP (nonce-based for scripts, with only the payment/analytics domains actually used)
  - [ ] Secrets only in server env; public-prefixed variables contain no keys except publishable ones
  - [ ] Every server action validates input and re-checks auth/ownership; prices recomputed on the server
  - [ ] Rate limits on add-to-cart, login, checkout and the revalidate webhook (edge or backend)
  - [ ] Cookies HttpOnly, Secure, SameSite=Lax; custom mutating endpoints check Origin
  - [ ] Structured-data output escaped; CMS HTML sanitized before rendering
  - [ ] Dependency advisories clean for the exact framework versions; lockfile committed
  - [ ] No personal data in analytics; error tracking scrubs PII
- **Done when:** headers verified on staging, checklist all ✓, findings fixed or recorded with owner and date.

---

## Phase 16 — Performance

- **Owner:** fe-perf.

| Route | LCP element | Plan |
|---|---|---|
| Home | Hero image | Priority + correct `sizes`; modern formats; no autoplay carousel |
| Category | First product images | Priority on the first row only; fixed aspect ratios; server-rendered grid |
| Product | Main gallery image | Priority; thumbnails lazy; reviews streamed later |

- **Also:**
  - One self-hosted/optimized variable font.
  - Third parties (chat, analytics, tag manager) load after consent and interaction, and none run on checkout unless required.
  - Keep client components to the interactive parts: filters, search box, add-to-cart, gallery.
  - Run the bundle-size check against the build output.
  - Profile filter interactions on a throttled CPU for INP.
- **Done when:** lab budgets are met on home, category and product (mobile). Field data is collected after launch (Phase 20).

---

## Phase 17 — SEO

- **Owner:** fe-ship (see `seo.md`).
- **Do:**
  1. Unique titles and descriptions per page; canonical rules from Phase 7.2; Open Graph image per product.
  2. Structured data: Product with Offer (price, currency, availability) on product pages, BreadcrumbList on category and product pages, Organization on home.
  3. Sitemap: home, categories and all products per locale with last-modified dates. Split above 50,000 URLs.
  4. Robots: allow the site; disallow cart, checkout, account, search and API paths; point to the sitemap.
  5. After launch: Rich Results Test, Search Console coverage and Core Web Vitals reports.
- **Done when:** structured data validates, the sitemap lists only indexable URLs, and noindex rules match the route matrix.

---

## Phase 18 — Offline catalog (optional)

- **Owner:** fe-pwa (case C).
- **Plan:**
  - Category and product data: stale-while-revalidate. Product images: cache-first with limits.
  - Price and stock: network-first, labelled "may have changed" when offline.
  - Cart, checkout and payment are network-only, with no offline queue.
  - Ship the kill-switch service worker first.
- **When:** only after core metrics are stable, because a service worker adds an update lifecycle to every deploy.
- **Done when:** the fe-pwa "Done" checklist passes.

---

## Phase 19 — Testing

- **Owner:** fe-test.

| Tier | Scope |
|---|---|
| Unit | Money module (formatting per locale, integer guard, sums, mixed-currency rejection); filter parsing defaults; structured-data builder |
| Component | Price (sale / no sale, screen-reader text); ProductCard; add-to-cart states (idle, pending, added, failed, out of stock) |
| E2E | Browse → filter → product → add to cart → cart → redirect to payment (mock provider in CI); empty cart; out-of-stock; language switch keeps filters |
| Accessibility | axe (WCAG 2.2 AA tags) on home, category, product, cart |
| Visual | Category and product pages at 375 / 768 / 1280 px |
| Security/flow | Webhook replay creates one order; tampered price ignored |

- **Done when:** all tiers are green in CI, and test names and accessible names come from the dictionaries, so missing translations fail tests.

---

## Phase 20 — Release & observability

- **Owner:** fe-ship.
- **Pipeline:**
  1. Install from the lockfile, then lint, then type-check, then unit/component tests.
  2. Build, then the bundle budget check.
  3. Deploy a preview and run E2E + axe against it (mock payment).
  4. Deploy to staging and run a smoke test.
  5. A human promotes to production.
- **Environments:** per-environment site URL, backend and payment keys; test-mode payment keys everywhere except production; secrets only in the host's secret store.
- **Commerce release checklist:**
  - [ ] Payment webhook registered for the environment; secret matches
  - [ ] Test order end to end in staging
  - [ ] Revalidate webhook wired from backend/CMS
  - [ ] Rollback: previous deployment id noted; instant rollback tested once
- **Observability** (fe-ship observability §7):
  - Error tracking tagged with release, route template and locale; PII scrubbed.
  - Real-user Core Web Vitals per route template.
  - Tracking plan: `product_viewed`, `product_list_filtered`, `cart_item_added`, `cart_viewed`, `checkout_started`, `order_completed`. The last is fired from the webhook-confirmed status, not the success page.
  - SLOs: e.g. 99 % successful checkout-to-payment redirects; p75 LCP ≤ 2.5 s on product pages. Alert when checkout errors exceed 1 % for 15 minutes.
- **Done when:** the release checklist is all ✓, dashboards show live data, and the on-call/alert owner is named.

---

## Phase 21 — Scale later & learn

| Trigger | Action | Skill |
|---|---|---|
| 3+ teams blocked by one release train | Re-run the decision tree; likely split by URL path (fe-mfe case A) | fe-mfe + fe-review |
| Internal admin/merchandising tool needed | Separate Vite + React SPA (Appendix A) | fe-code |
| Search quality complaints | Evaluate a search vendor with the adoption checklist | fe-review §4.6 |
| Framework major upgrade | Re-check caching, image, routing/middleware APIs | fe-review |
| End of each milestone | Collect lessons → plan → approve → update skills | fe-learn |

---

## Appendix A — Same shop as a Vite + React SPA (or plain React)

Use this for an admin/merchandising app, or a members-only shop where SEO does not matter.

| Concern | Next.js plan (above) | Vite + React / plain React |
|---|---|---|
| Routing | File-based routes | React Router (data routers) or TanStack Router |
| Catalog data | Server rendering + cached fetches | Query library with keys including category + filters, request cancellation, a sensible stale time |
| Filters | URL | URL (same rule, via the router's search params) |
| Cart | Server actions + cookie | Mutations with optimistic update + rollback, then refetch the cart; cart cookie set by the API |
| Auth | Server data-access checks | Backend-for-frontend or same-site API with cookie sessions + CSRF; route guards are UX only |
| SEO | Built in | Weak. Prerender or SSR public pages, or keep the storefront on an SSR framework |
| Images | Framework image component | Responsive `srcset`/`sizes`, explicit dimensions, lazy below the fold, high fetch priority on the LCP image, an image CDN |
| Env | Server-only variables | Everything with the client prefix is public; secrets stay in the API |
| Offline | Serwist | vite-plugin-pwa (fe-pwa §4.3) |

---

## Launch "Done" checklist

- [ ] Profile, ADR and route matrix approved and current
- [ ] Layer and import rules enforced by lint
- [ ] Money: integers only, one formatter, unit tests pass
- [ ] Every data region has loading / empty / error / content; backend-down tested
- [ ] Cart and checkout use server truth for prices; webhook-only order confirmation; idempotency proven
- [ ] Auth checked at every data access; no tokens in JS-readable storage
- [ ] Accessibility checklist + axe clean; contrast AA
- [ ] Performance budgets met (lab); real-user monitoring live (field)
- [ ] SEO validated: metadata, canonical, hreflang, structured data, sitemap, robots
- [ ] i18n parity passes; currency/date formatting per locale
- [ ] Security headers verified; dependency advisories clean
- [ ] CI green; staging test order passed; rollback path known
- [ ] Learning loop run (fe-learn)
