---
name: fe-recon
description: >
  Survey an unfamiliar frontend codebase in READ-ONLY mode: framework and versions, package manager, directory layout
  and layers, rendering strategy (CSR/SSR/SSG/ISR), routing, data and state flow, styling system, i18n, tests, CI,
  risk hotspots and protected zones; optionally draft the project's project-profile.md.
  Use when: onboarding to a new repo, before planning a refactor, or when no project profile exists yet.
  DO NOT USE FOR: editing source code (see fe-code or fe-clean);
  DO NOT USE FOR: deep audits of one domain (use fe-perf, fe-sec, fe-a11y, fe-contrast, etc.).
---

# fe-recon — Read-Only Reconnaissance

Map a frontend codebase quickly without changing anything. Follows [conventions.md](../fe-andy/references/conventions.md).

## Minimum rules (apply even without fe-andy)
- Strictly read-only: no installs, builds that write files, deletes, or edits (except writing a new `project-profile.md` draft if the user asks).
- Never print secret values from `.env*` files — list variable names only.
- Label every claim as observed (file:line) or inferred.
- Finish with the learning loop: append new, proven lessons to [references/learned.md](./references/learned.md) after a duplicate check ([learning-loop.md](../fe-andy/references/learning-loop.md)).

---

## 1. Steps

| Step | Read / run (read-only) | Extract |
|---|---|---|
| 1 Stack | `package.json` (deps + scripts), lockfile name, `tsconfig.json`, framework config (`next.config.*`, `vite.config.*`) | Framework + versions, package manager, TS strictness, scripts |
| 2 Layout | Directory listing 2–3 levels deep (`git ls-files` grouped by folder) | Source root, layering (features/blocks/ui), naming patterns |
| 3 Rendering & routing | `app/` or `pages/` tree, `"use client"` count, route handlers, middleware (`middleware.js` in Next.js < 16; check `proxy.js` in Next.js 16+) | Router type, client/server split, dynamic segments (`[locale]`), proxy/middleware conventions |
| 4 Data & state | Imports of SWR/TanStack/Redux/Zustand, API client files | Server-state lib, stores, fetch wrappers |
| 5 Styling | `globals.css`, Tailwind config/`@theme`, UI library imports | Tokens, dark mode, UI primitives |
| 6 i18n | messages folder, i18n config | Library, locales |
| 7 Quality | ESLint/Prettier/Biome config, test folders, Playwright config, `.github/workflows` | Lint/test/CI setup |
| 8 Risks | Largest files (`git ls-files | xargs wc -l | sort -n | tail`), `any` count, TODO/FIXME count, auth/payment/money folders | Hotspots, protected-zone candidates |
| 9 Env | `.env.example` / env names used in code | Public vs server env names (names only) |

## 2. Report template

```markdown
# Recon Report: <project>  (date)

## 1. Stack
| Item | Value | Evidence |
## 2. Structure & layers
## 3. Rendering & routing
## 4. Data & state flow
## 5. Styling & design tokens
## 6. i18n
## 7. Quality tooling (lint, types, tests, CI)
## 8. Risk hotspots & protected-zone candidates
| Area | Location | Why risky | Evidence |
## 9. Open questions (cannot determine)
## 10. Suggested next skills (by plain name) and why
```

## 3. Project profile draft

If the target repo has no `project-profile.md`, offer to fill [project-profile.template.md](../fe-andy/references/project-profile.template.md) from the findings and show it for approval before writing.

Learned notes: [references/learned.md](./references/learned.md).
