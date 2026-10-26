# Learned notes — fe-ship

Append-only. Written by the learning loop ([learning-loop.md](../../fe-andy/references/learning-loop.md)); folded into the skill by the fe-learn skill.
Only reusable, proven, non-duplicate lessons. No secrets, client names, or machine paths.

<!-- Add notes below this line, newest at the bottom. -->

### 2026-10-26: Next.js sitemap.js with multilingual alternates outputs standard xhtml:link hreflang tags
- Context: A bilingual Next.js App Router application needed a production sitemap with locale alternate tags (`en`, `vi`, and `x-default`) without external dependencies or build scripts.
- Pattern / Rule: In `src/app/sitemap.js`, define each URL item with an `alternates: { languages: { en: '...', vi: '...', 'x-default': '...' } }` field. Next.js natively transforms this structure into standards-compliant `<xhtml:link rel="alternate" hreflang="..." href="..." />` tags inside the output `/sitemap.xml`, providing full international search engine coverage out of the box.
- Status: new
