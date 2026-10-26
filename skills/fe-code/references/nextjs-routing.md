# Next.js App Router — Routing Conventions (authoring)

How to lay out routes so they are thin, composable and cache-friendly. Rendering/caching cost of a route is fe-perf's domain ([nextjs.md](../../fe-perf/references/nextjs.md)); this file is about *structure*. Written against Next.js 15–16; file names and the `params`/`searchParams` shape changed across majors — verify with the docs for the version in `project-profile.md`.

## 1. File conventions in a segment

| File | Role | Notes |
|---|---|---|
| `layout.tsx` | Shared UI that **persists** across navigations; wraps children | Does not re-render on sibling navigation; root layout owns `<html>`/`<body>` |
| `template.tsx` | Like layout but **remounts** on every navigation | Per-navigation effects, enter animations, reset state |
| `page.tsx` | The route's UI; makes the segment publicly reachable | Receives `params` and `searchParams` (Promises in 15+ — `await` them) |
| `loading.tsx` | Instant Suspense fallback for the segment | Design with fe-skel; mirrors the page layout |
| `error.tsx` | Error boundary for the segment (`"use client"`) | Gets `error` + `reset()`; does not catch errors in the same segment's `layout` |
| `global-error.tsx` | Boundary for the root layout | Must render its own `<html>`/`<body>` |
| `not-found.tsx` | UI for `notFound()` and unmatched routes (root) | Pair with `redirect()`/`permanentRedirect()` for moved content |
| `route.ts` | Route handler (`GET`, `POST`, …) | Cannot share a segment with `page.tsx` |
| `default.tsx` | Fallback for a **parallel slot** on hard navigation | Missing → 404 on reload (common bug) |
| `_folder` | Private folder: excluded from routing | Colocate components/tests next to the route |
| `(group)` | Route group: organises files and layouts, **no URL segment** | Several root layouts: one per group |

Keep `page.tsx` thin: read params, call feature queries, compose Blocks/Features (fe-code SKILL.md §1). No data access logic inside route files.

## 2. Dynamic segments and static generation

| Pattern | Matches | Use |
|---|---|---|
| `[slug]` | one segment | product, post |
| `[...slug]` | one or more | docs trees, CMS paths |
| `[[...slug]]` | zero or more | optional sub-paths (`/docs`, `/docs/a/b`) |

```ts
// app/[locale]/p/[slug]/page.tsx
export async function generateStaticParams() {            // pre-render the hot set; others render on demand then cache
  return (await getTopProductSlugs(500)).map((slug) => ({ slug }));
}
export const dynamicParams = true;                         // false → unknown slugs 404 instead of rendering on demand
export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  …
}
```
Reading `searchParams`, `cookies()`, `headers()` or using uncached data makes the segment dynamic — decide per route with the matrix in [playbooks.md](../../fe-andy/references/playbooks.md) §3.

## 3. Route groups: layouts without URL changes

```
app/
├─ (marketing)/layout.tsx   # light header, footer
│  ├─ page.tsx              # /
│  └─ pricing/page.tsx      # /pricing
└─ (app)/layout.tsx         # sidebar shell, auth check via DAL
   └─ dashboard/page.tsx    # /dashboard
```
Two groups may both define a root layout (each with `<html>`); navigating between them is a full page load. Group names never appear in URLs — two groups must not resolve to the same path.

## 4. Parallel routes: independent slots in one layout

```
app/(app)/dashboard/
├─ layout.tsx          # receives { children, analytics, team } as props
├─ page.tsx
├─ @analytics/page.tsx · @analytics/loading.tsx · @analytics/error.tsx · @analytics/default.tsx
└─ @team/page.tsx · @team/default.tsx
```
```tsx
export default function DashboardLayout({ children, analytics, team }: { children: React.ReactNode; analytics: React.ReactNode; team: React.ReactNode }) {
  return (<section className="grid gap-6 lg:grid-cols-[2fr_1fr]"><div>{children}{analytics}</div><aside>{team}</aside></section>);
}
```
Use for: dashboards whose panels load, fail and stream independently (each slot gets its own `loading`/`error`); tabbed areas with their own sub-routes; role-conditional panels — **but the condition is a UX choice; authorization stays on the server** (fe-sec auth-frontend.md §0). Always add `default.tsx` to every slot, or hard reloads 404. `useSelectedLayoutSegment("analytics")` reads a slot's active segment for tab styling.

## 5. Intercepting routes: modal with a shareable URL

Open a detail view in a modal when navigating *from* the list, but render the full page on direct load or refresh.

```
app/(shop)/
├─ layout.tsx                      # renders {children}{modal}
├─ @modal/default.tsx              # returns null
├─ @modal/(.)p/[slug]/page.tsx     # intercepts /p/[slug] when navigated from within (shop)
├─ c/[category]/page.tsx           # product grid with <Link href={`/p/${slug}`}>
└─ p/[slug]/page.tsx               # full product page (direct load, refresh, SEO)
```
Matchers: `(.)` same level · `(..)` one level up · `(..)(..)` two up · `(...)` from root — levels count **route segments**, not folders (groups and slots are ignored). The modal page fetches the same data as the full page (reuse the feature query; `cache()` dedupes). Close with `router.back()`; a11y rules for dialogs apply (fe-a11y); the full page remains the canonical URL for SEO (fe-ship seo).

Pitfalls: interception only applies to client-side navigation (by design); forgetting `@modal/default.tsx`; intercepting a route that lives in a different root layout (not possible).

## 6. Route handlers and the request pipeline

- `route.ts` exports `GET`/`POST`/…; `GET` without dynamic APIs may be cached depending on version (verify); mutating handlers check `Origin` and auth (fe-sec).
- `middleware.ts` runs before matched requests; **Next.js 16 renames it to `proxy.ts` (exported `proxy` function, Node.js runtime by default; `middleware.ts` still works but is deprecated — per Vercel's upgrade guide, verify against the official docs)**. Either way it only redirects/rewrites; it is not the authorization layer.
- Navigation helpers: `redirect()` (307/303), `permanentRedirect()` (308), `notFound()`; `useRouter`/`usePathname`/`useSearchParams` in client components only (`useSearchParams` needs a Suspense boundary above it in static routes).
- `<Link prefetch>`: default prefetches static routes in the viewport; set `prefetch={false}` on huge lists, `prefetch={true}` for likely next steps (fe-perf measures the effect).
- Scroll: back/forward restores position by default and a push scrolls to top; use `<Link scroll={false}>` / `router.replace(url, { scroll: false })` for filter and pagination changes so the list stays in place; hash links (`#reviews`) scroll to the `id`. Restore list scroll after returning from a modal route (§5) by not unmounting the list.

## 7. Decision table

| Need | Use |
|---|---|
| Different shells for marketing vs app, same domain | Route groups with separate layouts |
| Panels that load/fail independently on one page | Parallel routes with per-slot `loading`/`error` |
| Detail in a modal from a list, deep-linkable | Parallel `@modal` + intercepting `(.)` route + full page |
| Per-navigation animation or state reset | `template.tsx` (or View Transitions — fe-motion) |
| JSON/webhook endpoint | `route.ts` (never next to a `page.tsx`) |
| Hide a page from users without a role | Server check in the page/layout via DAL; UI hides the link (affordance only) |
| CMS-driven arbitrary paths | `[[...slug]]` + `generateStaticParams` for the known set |

## 8. Verify

- `next build` output: each route shows the intended marker (static `○`, SSG `●`, dynamic `ƒ`); unexpected `ƒ` → a dynamic API crept into a static route.
- Hard reload every parallel/intercepted URL: no 404 (`default.tsx` present), full page renders for intercepted routes.
- Modal route: Escape/close returns to the list with scroll position; focus returns to the trigger; direct load shows the full page with correct metadata.
- `error.tsx` recovers with `reset()`; `loading.tsx` skeleton mirrors the page (no CLS).
- Route files contain no data-access code (grep for `fetch(`/`commerce(` outside `features/` and `lib/`).
