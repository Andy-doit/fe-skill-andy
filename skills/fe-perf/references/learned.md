# Learned notes — fe-perf

Append-only. Written by the learning loop ([learning-loop.md](../../fe-andy/references/learning-loop.md)); folded into the skill by the fe-learn skill.
Only reusable, proven, non-duplicate lessons. No secrets, client names, or machine paths.

<!-- Add notes below this line, newest at the bottom. -->

### 2026-10-26 · Check SVGs for embedded oversized base64 raster images
- **Type:** pitfall
- **Rule:** Inspect static SVGs in public/ to verify they are true vector paths; replace or downsample embedded base64 PNGs/JPEGs.
- **Why / evidence:** Vector design tools sometimes export SVGs that wrap huge (e.g. 3000x3000px) base64 PNGs within viewBox clip masks. Because frameworks like Next.js `next/image` bypass image resizing/compression for `.svg` files, visitors download the full uncompressed raster payload (often 500KB+ per logo) even for tiny 90px navbar icons with `priority`.
- **Example:**
  ```bash
  # Check if SVG has vector paths or embedded raster:
  node -e "const s = fs.readFileSync('public/logo.svg', 'utf8'); console.log('Has path:', s.includes('<path'), 'Has image:', s.includes('<image'));"
  ```
- **Applies to:** Any framework serving static SVGs (`next/image`, Vite, Astro)
- **Related:** loading.md:16
- **Status:** promoted (2026-10-28 -> references/loading.md §2 Images)
