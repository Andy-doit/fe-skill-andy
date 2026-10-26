# Loading Performance — checklist with fixes and verification

Each row: what to check → how to fix → how to verify. Measure first ([measurement.md](./measurement.md)).

## 1. JavaScript

| Check | Fix | Verify |
|---|---|---|
| Barrel imports pulling whole libraries (`import { x } from "lib"` where lib is not tree-shakeable) | Import the specific module or use the ESM build (e.g. `lodash-es`, per-icon imports) | Bundle size before/after |
| Heavy component not needed for first paint (editor, chart, map, modal content) | Code-split: `React.lazy` + `Suspense`, or `next/dynamic` (with `ssr: false` only for browser-only libs) | Route JS shrinks; component loads on demand in Network tab |
| Route-level splitting missing (SPA) | Lazy-load routes in the router | One chunk per route in build output |
| Client-only code in a shared/root bundle | Move it below the route that uses it; in Next.js keep `"use client"` at leaves | First Load JS per route |
| Polyfills/legacy transpilation for old browsers you don't support | Align `browserslist` with the profile's support matrix | Bundle size |
| Tree shaking blocked | Avoid side-effectful module tops; check `"sideEffects"` in library package.json; avoid `export *` re-export chains in app code where analyzer shows whole modules | Analyzer shows only used exports |

## 2. Images

| Check | Fix | Verify |
|---|---|---|
| LCP image discovered late or lazy-loaded | Put it in initial HTML, `fetchpriority="high"`, never `loading="lazy"` on the LCP image; in Next.js use `priority` on `next/image` (check API name for your version) | LCP element timing in trace |
| Oversized images | Serve responsive sizes: `srcset` + `sizes`; modern formats (AVIF/WebP) with fallback | Network: transferred bytes vs rendered size |
| Below-the-fold images | `loading="lazy"` + `decoding="async"` | Not requested until scrolled near |
| Missing dimensions | `width`/`height` attributes or CSS `aspect-ratio` | CLS shift regions |

## 3. Video

- Do not autoplay large videos above the fold on mobile; use `poster` + `preload="none"` (or `metadata`).
- Provide compressed renditions (H.264/MP4 baseline + WebM/AV1 if the pipeline supports it).
- Lazy-load iframes (YouTube, maps) with `loading="lazy"` or a click-to-load facade.

## 4. Fonts

| Check | Fix |
|---|---|
| Invisible text while fonts load | `font-display: swap` (or `optional` for non-critical fonts) |
| Layout shift on font swap | Fallback metric overrides (`size-adjust`, `ascent-override`) — `next/font` generates these automatically |
| Too many weights/families | Limit to the weights used; variable font if several weights |
| Large font files | Subset to needed scripts (e.g. `latin`, `vietnamese`); WOFF2 only |
| Late discovery | Self-host + `<link rel="preload" as="font" type="font/woff2" crossorigin>` for the 1–2 critical files only |

## 5. Network, caching, delivery

| Topic | Rule |
|---|---|
| Cache headers | Hashed static assets: `Cache-Control: public, max-age=31536000, immutable`. HTML: short or `no-cache` with revalidation. API: decide per endpoint; never cache personalised responses publicly. |
| Compression | Text assets served with Brotli (`br`) or gzip; check `content-encoding` in Network tab. |
| CDN | Static assets and cacheable pages from a CDN close to users; check TTFB from target regions. |
| Preconnect | `<link rel="preconnect">` to 1–3 critical third-party origins only. |
| Preload | Only for late-discovered critical resources (LCP image, critical font). Every preload competes for bandwidth. |
| Prefetch | Next-route prefetch on hover/viewport for likely navigation (framework link prefetch, or `rel="prefetch"`). Avoid on metered/slow connections if the framework allows. |
| HTTP/2/3 | Confirm on the host; avoid domain sharding. |

## 6. Third-party scripts

1. Inventory: list every third-party script with owner, purpose, size, and whether it blocks rendering.
2. Remove unused; defer the rest (`async`/`defer`, or Next.js `<Script strategy="lazyOnload">` / `afterInteractive`).
3. Load consent-dependent scripts only after consent (see fe-ship for consent).
4. Facades for heavy embeds (chat widgets, video players) — load on interaction.
5. Verify: Performance trace "Third-party" grouping / Lighthouse "Reduce the impact of third-party code".

## 7. CSS and rendering

- Inline only small critical CSS; avoid large render-blocking stylesheets.
- `content-visibility: auto` + `contain-intrinsic-size` on long below-the-fold sections skips their rendering work until near the viewport. Measure: rendering time in trace before/after.
- Avoid `@import` chains in CSS.

## 8. Low-end devices and slow networks

- Test with CPU 4× slowdown + "Fast 4G" / "Slow 4G" throttling.
- Respect `navigator.connection.saveData` (where supported) to skip non-essential media.
- Budget JS harder for mobile: main-thread parse/compile cost scales with bytes.
