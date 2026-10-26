<div align="center">

# fe-skill-andy

### Agent skills for frontend engineering — Claude Code, Codex, Antigravity

[![Next.js](https://img.shields.io/badge/Next.js-App_Router-000000?logo=nextdotjs)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)](https://react.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![WCAG 2.2](https://img.shields.io/badge/WCAG-2.2_AA-22c55e)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![License: MIT](https://img.shields.io/badge/License-MIT-22c55e)](LICENSE)

</div>

---

## Overview

21 focused skills for UX, UI, performance, security, quality, shipping, offline/PWA, micro-frontends, knowledge review, and data visualization. Giới thiệu (VI): [GIOI-THIEU.md](./GIOI-THIEU.md) · Usage guide: [USAGE.md](./USAGE.md). Every skill:
- reads the target project's `project-profile.md` first,
- works audit-first (read → propose → approval → edit → verify),
- ends with a **learning loop** that adds new, proven lessons back into the skill set.

## Skills

| Skill | Domain |
|---|---|
| [fe-andy](./skills/fe-andy/) | Router + shared conventions, project profile template, learning loop, health-check script |
| [fe-recon](./skills/fe-recon/) | Read-only survey of an unfamiliar repo; drafts the project profile |
| [fe-perf](./skills/fe-perf/) | Core Web Vitals, bundle, loading, React runtime, Next.js caching/hydration, budgets |
| [fe-motion](./skills/fe-motion/) | Animation smoothness, GSAP/ScrollTrigger, canvas/WebGL, reduced motion |
| [fe-layout](./skills/fe-layout/) | Spacing, alignment, responsive, container queries, tokens, theming, dark mode |
| [fe-contrast](./skills/fe-contrast/) | Measured WCAG contrast with a zero-dependency script |
| [fe-a11y](./skills/fe-a11y/) | Keyboard, focus, ARIA, semantics, screen readers, WCAG 2.2 AA |
| [fe-skel](./skills/fe-skel/) | 1:1 skeletons, loading/empty/error states |
| [fe-data](./skills/fe-data/) | Fetching, caching, cancellation, retry, pagination, realtime, offline, error boundaries |
| [fe-ux](./skills/fe-ux/) | UX review/brainstorm, forms, UX writing, perceived performance |
| [fe-i18n](./skills/fe-i18n/) | Dictionary parity script, Intl formatting, locale routing |
| [fe-sec](./skills/fe-sec/) | XSS, CSP/headers, secrets, frontend auth flow, CSRF/CORS, supply chain |
| [fe-clean](./skills/fe-clean/) | Refactoring, tech debt, TypeScript strictness, dead code, cycles |
| [fe-code](./skills/fe-code/) | New code on the 4-layer architecture, component API, state placement |
| [fe-test](./skills/fe-test/) | Verification tiers, unit/component/E2E/axe/visual tests |
| [fe-ship](./skills/fe-ship/) | Release checklist, CI/CD, env, Docker, rollback, observability, consent, SEO |
| [fe-pwa](./skills/fe-pwa/) | Service workers, Workbox strategies, offline outbox, SW updates, manifest, installability |
| [fe-mfe](./skills/fe-mfe/) | Micro-frontends, Module Federation, Multi-Zones, shared deps, independent deploys |
| [fe-review](./skills/fe-review/) | Validate patterns, libraries, decisions and advice against current standards |
| [fe-viz](./skills/fe-viz/) | Chart choice by question, encoding/colour, SVG/Canvas/WebGL, chart libraries, accessible and fast charts, KPI tiles, sparklines, dashboards |
| [fe-learn](./skills/fe-learn/) | Capture lessons, promote learned notes into skills, health check |

## How the skill set learns

```
any fe-* skill finishes a task
  → learning loop: is there a new, proven, reusable lesson not already in the set?
      yes → append a note to <skill>/references/learned.md   (project-specific facts → project-profile.md)
      no  → report "Learned: nothing new"
fe-learn (on request, or when 5+ notes are pending)
  → triage notes → user approves → fold into SKILL.md / references → health check
```
Details: [learning-loop.md](./skills/fe-andy/references/learning-loop.md) · [HOW-IT-LEARNS.md](./HOW-IT-LEARNS.md).

## Install

📘 Hướng dẫn sử dụng chi tiết (tiếng Việt): [HUONG-DAN-SU-DUNG.md](./HUONG-DAN-SU-DUNG.md)

```powershell
# Windows: link all skills into Claude Code, Codex and Antigravity
powershell -ExecutionPolicy Bypass -File scripts\install-skills.ps1
```
```bash
# macOS / Linux
sh scripts/install-skills.sh
```
**Install the whole set together** — skills link to the shared `fe-andy/references/` files as siblings. Details and per-tool paths: [audit/install-guide.md](./audit/install-guide.md).

Claude Code plugin route:
```bash
/plugin marketplace add Andy-doit/fe-skill-andy
/plugin install fe-skill-andy@fe-skill-andy
```

## Health check

```bash
node skills/fe-andy/scripts/check-skills.mjs
```
Validates names, descriptions, links, absolute paths, tool-specific syntax, unlinked files, and lists pending learned notes.

## Repo layout

- `skills/` — the installable skill set
- `audit/` — coverage report, update plan, install guide
- `legacy/`, `rules/`, `cannon/`, `decision/`, `design/`, `design-system/`, `ui/` — StarCi project knowledge kept for reference; not part of the installable set

## License

MIT © [Andy-doit](https://github.com/Andy-doit)
