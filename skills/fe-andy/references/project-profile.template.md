# Project Profile — <project name>

Copy this file to the **root of the target project** as `project-profile.md` and fill it in. Every fe-* skill reads it first; its values override skill defaults. Keep secrets out of this file.

Last reviewed: YYYY-MM-DD

## 1. Stack & versions
| Item | Value |
|---|---|
| Framework | e.g. Next.js 15 App Router / Vite 6 + React |
| React | e.g. 19.x |
| Language | TypeScript (strict: yes/no) |
| Styling | e.g. Tailwind v4 / CSS Modules |
| UI primitives | e.g. HeroUI / Radix / shadcn / none |
| Server state | e.g. SWR / TanStack Query v5 / RTK Query |
| Client state | e.g. Zustand / Redux Toolkit / none |
| Forms | e.g. React Hook Form + Zod |
| i18n | e.g. next-intl; locales: en, vi; default: en |
| Animation | e.g. GSAP 3 / Motion / CSS only |
| Package manager | npm / pnpm / yarn / bun |

## 2. Commands
| Purpose | Command |
|---|---|
| Lint | `npm run lint` |
| Type-check | `npx tsc --noEmit` |
| Unit/component tests | |
| E2E | |
| Build | `npm run build` |
| Dev server URL | |

## 3. Folder layout & layers
- Tokens: e.g. `src/app/globals.css`
- Blocks (style owners): e.g. `src/components/blocks/`
- Features (compose only): e.g. `src/components/features/`
- Async state component: e.g. `AsyncContent` at `@/components/blocks/async` (or "none")

## 4. Protected areas (never edit without explicit instruction)
- e.g. `src/features/payment/**`
- e.g. `src/lib/money.ts`

## 5. Budgets & targets
| Metric | Budget |
|---|---|
| LCP (p75, mobile) | ≤ 2.5 s |
| INP (p75) | ≤ 200 ms |
| CLS (p75) | ≤ 0.1 |
| JS per route (gzip) | e.g. ≤ 170 KB |
| Lighthouse Performance (mobile) | e.g. ≥ 90 |

## 6. Design rules
- Spacing scale: e.g. `0 · 2 · 3 · 4 · 6` (Tailwind units) or "Tailwind default"
- Radius scale:
- Dark mode: yes/no, mechanism (e.g. `next-themes`, `class` strategy)
- Accessibility level: WCAG 2.2 AA (default) / AAA for body text
- Touch target minimum: 24 px (AA) / 44 px (preferred)

## 7. Security notes
- Auth model: e.g. HttpOnly session cookie set by backend
- Allowed public env prefixes:
- CSP owner: e.g. `next.config.ts` headers / reverse proxy

## 8. Known decisions & exceptions
- YYYY-MM-DD — <decision> — <reason>
