# Next.js (App Router) Performance Notes

Written against Next.js 14–15 App Router behaviour. Caching defaults changed between major versions — **always check the docs for the version in `package.json` / the project profile before applying.** If a note here disagrees with the official docs for that version, the docs win; record the difference with the learning loop.

## 1. Server vs Client Components

- Components are Server Components by default; `"use client"` marks a boundary and everything imported below it ships to the browser.
- Keep `"use client"` at the leaves (the interactive button, not the whole page).
- Pass Server Components as `children` into Client Components to keep them server-rendered.
- Do not import server-only modules (DB clients, secrets) into client files; use the `server-only` package if the project has it.
- Verify: build output "First Load JS" per route; search for `"use client"` at layout/page level.

## 2. Data fetching and caching

| Layer | What it caches | Control |
|---|---|---|
| Request memoization | Same `fetch` URL+options within one render pass | Automatic for `fetch` in Server Components |
| Data cache | `fetch` results across requests | `fetch(url, { cache: "force-cache" | "no-store" })`, `next: { revalidate: <s>, tags: [...] }` — default differs by version |
| Full route cache | Rendered HTML/RSC payload of static routes | Route segment config (`export const revalidate`, `dynamic`), use of dynamic APIs (`cookies()`, `headers()`, `searchParams`) makes a route dynamic |
| Router cache (client) | Visited/prefetched segments in the browser | `router.refresh()`, `revalidatePath`, `revalidateTag` after mutations |

Rules:
- Fetch in parallel in Server Components (`Promise.all`) or split into separate `Suspense` boundaries; avoid sequential awaits for independent data.
- After a Server Action mutation, call `revalidatePath`/`revalidateTag` for the affected data.
- ISR: set `revalidate` on the segment or fetch; on-demand with `revalidateTag`.
- Personalised data must not land in a shared static cache.

## 3. Streaming

- `loading.tsx` creates an instant loading state per segment (design it with fe-skel).
- Wrap slow parts in `<Suspense fallback={...}>` so the shell streams first.
- Verify: TTFB and first contentful paint drop; slow block appears later without blocking.

## 4. `next/image`

- Always give `width`/`height` or `fill` + sized parent (prevents CLS).
- LCP image: `priority` (name may differ by version; check docs) and an accurate `sizes`.
- Configure `images.remotePatterns` for external hosts; do not disable optimization globally.

## 5. `next/font`

- Load fonts with `next/font/google` or `next/font/local` in the root layout; specify `subsets` and only the needed `weight`s.
- Expose as a CSS variable and map it in the token layer; make sure the variable name matches what CSS uses.

## 6. Middleware

- Runs before every matched request; keep it small and fast (no heavy imports, no slow network calls).
- Limit with `matcher` so static assets and images skip it.
- Auth checks in middleware are a UX optimization; authorization must still be enforced on the server (see fe-sec).

## 7. Hydration errors

| Cause | Fix |
|---|---|
| Rendering `Date.now()`, `Math.random()`, locale-dependent formatting differently on server and client | Compute on server and pass down, or render after mount (`useEffect`) for client-only values |
| Accessing `window`/`localStorage` during render | Move to `useEffect`, or `dynamic(() => import(...), { ssr: false })` for browser-only components |
| Invalid HTML nesting (`<div>` in `<p>`, `<button>` inside `<button>`, `<a>` in `<a>`) | Fix the markup |
| Browser extensions mutating DOM | Reproduce in incognito before chasing |
| Theme class mismatch (dark mode) | Use the theme library's recommended script/`suppressHydrationWarning` on `<html>` only |

Verify: browser console free of hydration warnings in dev; no layout jump on load.
