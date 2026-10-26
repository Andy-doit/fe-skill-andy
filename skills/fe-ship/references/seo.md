# SEO for Frontend

## 1. Rendering for crawlers

- Indexable content must be in server-rendered or static HTML (SSR/SSG/ISR); do not rely on client-only rendering for primary content.
- Real links (`<a href>`) for navigation; no click-handler-only links.
- Correct status codes: 404 page returns 404, removed content 410, moved content 301.

## 2. Per-page metadata

| Item | Rule |
|---|---|
| `<title>` | Unique, ~50–60 chars, primary topic first, brand last |
| Meta description | Unique, ~150–160 chars, describes the page |
| Canonical | `<link rel="canonical">` absolute URL; one per page; strips tracking params |
| Open Graph / Twitter | `og:title`, `og:description`, `og:image` (1200×630), `og:url`, `twitter:card` |
| Robots | `noindex` for search results, user pages, previews/staging |
| `lang` | `<html lang>` set per locale |

Next.js App Router: `export const metadata` or `generateMetadata()` per route, `metadataBase` in the root layout; `app/sitemap.ts`, `app/robots.ts` (check docs for the project's version).

## 3. Sitemap and robots

- `sitemap.xml` with canonical URLs only, `lastmod` when reliable; split above 50,000 URLs.
- `robots.txt`: allow crawling of public pages, reference the sitemap, block staging entirely (also with auth).

## 4. Multilingual

- One URL per language (`/en/...`, `/vi/...`); `hreflang` alternates for every language + `x-default`; canonical points to the same-language URL.

## 5. Structured data

- JSON-LD in a `<script type="application/ld+json">`: `Organization`, `BreadcrumbList`, `Article`, `Product`, `FAQPage`, etc., matching visible content only.
- Escape `<` in the JSON when injecting (`JSON.stringify(data).replace(/</g, "\\u003c")`) to avoid script injection.

## 6. Verify

- View source (not DevTools DOM) shows title, description, canonical, main content.
- Rich Results Test / Schema validator for structured data; Search Console coverage after release.
- Lighthouse SEO category for basics; crawl a staging copy with a crawler if available.
