---
name: fe-review
description: >
  Critically review frontend knowledge before it is treated as truth: a pattern, architecture decision, library
  choice, performance claim, security practice, accessibility advice, build-tool setup, a learned note, or any
  recommendation (including an AI agent's own). Cross-checks against official docs (React, Next.js, Vite, MDN,
  web.dev, WCAG, OWASP) and recent reputable sources, finds deprecations and better modern alternatives, and scores
  it Still Best Practice / Acceptable / Outdated / Harmful with an improved version.
  Use when: "is this still best practice", "review this advice/pattern/library", before adopting a new library or
  architecture, before promoting learned notes into a skill, or when a recommendation cites old versions.
  DO NOT USE FOR: reviewing a code diff for bugs (see fe-clean or fe-test); measuring performance (see fe-perf);
  DO NOT USE FOR: running a security audit of an app (see fe-sec); editing the skill set (see fe-learn).
---

# fe-review — Knowledge & Practice Reviewer

## 1. Goal

Act as a rigorous reviewer that validates "learned" knowledge (patterns, decisions, library choices, advice) against current official documentation and industry evidence before it is applied in production or written into a skill. Follows [conventions.md](../fe-andy/references/conventions.md).

### Minimum rules (apply even without fe-andy)
- Read `project-profile.md` in the target project first. Versions there decide what "current" means for this project.
- Read-only. The output is a verdict and an improved recommendation. Code or skill edits go to the owning skill after approval.
- Never present inferred or remembered facts as verified. Label every claim with its evidence level (§3.3).
- Finish with the learning loop: append new, proven lessons to [references/learned.md](./references/learned.md) after a duplicate check ([learning-loop.md](../fe-andy/references/learning-loop.md)).

---

## 2. When to use / When NOT to use

| Use fe-review when | Do NOT use fe-review when (use instead) |
|---|---|
| Someone proposes a pattern "because it's best practice" | You need to find bugs in a specific diff (fe-clean, fe-test) |
| Adopting a new library, framework major, or architecture (MFE, state lib, CSS approach) | You need numbers: profile and measure (fe-perf) |
| A tutorial, old ticket, or AI answer cites versions ≥ 1 major behind the project | Full app security audit (fe-sec) |
| fe-learn is about to promote notes into a skill | The question is project-specific with no general claim (just answer it) |
| Two skills or two engineers disagree on an approach | Trivial style preferences already fixed by the project's lint config |

---

## 3. Review process

### 3.1 Steps

1. **Identify the claim.** Restate it in one falsifiable sentence, with scope and versions: *"In Next.js 15 App Router, wrapping every fetch in `cache: 'no-store'` is needed to avoid stale data."* Split compound advice into separate claims.
2. **Check official documentation** for the versions in the project profile: react.dev, nextjs.org/docs (including upgrade guides), vite.dev, MDN, web.dev, W3C WCAG / WAI-ARIA APG, OWASP Cheat Sheets, TypeScript handbook and release notes, and the library's own docs and CHANGELOG.
3. **Check recent reputable sources (2024–2026):** official blogs and RFCs (React, Next.js, TC39 proposals), Chrome Status / Baseline (webstatus.dev), Can I Use, State of JS / State of CSS (for adoption, not correctness), security advisories (GitHub Advisory DB, CVE), and conference talks by maintainers.
4. **Look for pitfalls:** deprecations, changed defaults, known CVEs, maintenance status (last release, open-issue trend, maintainer announcements), and better built-in alternatives (platform APIs, framework features).
5. **Score** with §3.2, and state your confidence.
6. **Improve.** Give the corrected recommendation with version scope, a minimal code example, and a migration path if the claim is already in production.

### 3.2 Verdict scale

| Verdict | Meaning | Action |
|---|---|---|
| **Still Best Practice** | Matches current official guidance for the project's versions | Apply; cite source |
| **Acceptable** | Works and is safe, but a simpler or more modern option exists, or it fits only some contexts | Keep in existing code; prefer the alternative for new code |
| **Outdated** | Superseded by changed defaults, new APIs, or deprecation; adds cost with no benefit | Do not use for new code; plan migration via fe-clean |
| **Harmful** | Causes security, accessibility, data-loss, or severe performance problems, or relies on a vulnerable version | Block; fix with the owning skill (fe-sec, fe-a11y, fe-perf) |

### 3.3 Evidence levels (label every claim)

| Label | Meaning |
|---|---|
| `[Verified: <source + date/version>]` | Read in an official or primary source during this review |
| `[Measured]` | Confirmed by a run, profile, or test in this project |
| `[Inference]` | Reasoned from verified facts; state the reasoning |
| `[Unverified]` | From memory or a secondary source not checked during this review |

A verdict of **Outdated** or **Harmful** needs at least one `[Verified]` or `[Measured]` item. Otherwise the verdict is provisional.

### 3.4 How the agent must behave
- **Search first** when a web search or docs tool is available, especially for versions, defaults, deprecations, maintenance status, and CVEs. Prefer official docs over blogs, and recent sources over old ones.
- **Without search access:** say so, reason from the project's installed versions (`package.json`, lockfile, `node_modules/<pkg>/package.json`, CHANGELOG files in `node_modules`), and label conclusions `[Unverified]` with a note that they are based on training data up to a cutoff.
- **Treat your own earlier answers as claims.** Review them with the same rigor, and correct them openly when wrong.
- **Never** upgrade a verdict because the claim is popular. Adoption surveys measure usage, not correctness.
- **Keep scope.** Review the claim; do not rewrite the app. Hand fixes to the owning skill.

---

## 4. Review categories and checklists

Framework-agnostic questions come first. The framework notes show where defaults differ for Next.js (App Router), Vite + React, and plain React.

### 4.1 Architecture & state management
- [ ] Is server state (remote data) separated from client state? Is server state held in a query cache or server components, not in a global store?
- [ ] Is the state as local as possible (component → URL → context → store)? See [state.md](../fe-code/references/state.md).
- [ ] Is a global store justified by cross-tree, frequently-updated client state?
- [ ] Is the library maintained, and is it the officially recommended variant? (e.g. Redux Toolkit, not hand-written Redux.)
- [ ] Is a micro-frontend or monorepo claim backed by team/deploy data? (fe-mfe §3.2)
- Next.js: can it be a Server Component or a server-side fetch instead of client state? Vite/plain React: is it a query library instead of `useEffect` fetching?

### 4.2 Performance claims
- [ ] Is there a measurement, or only an assumption? (conventions §4)
- [ ] Does the framework or compiler already do it? (React Compiler auto-memoization; Next.js defaults per version)
- [ ] Does it target the real bottleneck (LCP element, INP long tasks) or a micro-optimisation?
- [ ] Is it still true for the current browser baseline? (e.g. lazy-loading and `content-visibility` are native; check Baseline status)
- Next.js: caching defaults changed in 15 (fetch and GET Route Handlers are no longer cached by default), so check the upgrade guide for the project's major. Vite: dev-server behaviour ≠ production build, so measure `vite build && vite preview`.

### 4.3 Security practices
- [ ] Does it follow the current OWASP cheat sheet for the topic?
- [ ] Are tokens kept out of JS-readable storage where a cookie-based session is possible?
- [ ] Is authorization enforced on the server, at the data access point, not only in UI, routing, or middleware?
- [ ] Is the framework version free of known advisories? (check the GitHub Advisory DB for the exact version)
- [ ] Is CSP nonce/hash-based (`'strict-dynamic'`), not `'unsafe-inline'`?
- Next.js: middleware (named proxy in newer majors, so check your version) is not an auth boundary on its own. Vite/plain React SPA: anything in `VITE_*`/`REACT_APP_*` is public.

### 4.4 Accessibility
- [ ] Does native HTML do it (`<button>`, `<dialog>`, `<details>`, `popover`) before ARIA?
- [ ] Does it match the WAI-ARIA APG pattern for the widget, including keyboard support?
- [ ] Is it WCAG 2.2 (not 2.0/2.1-only) aware: focus not obscured, target size, dragging alternatives?
- [ ] Does it avoid overlays and widgets that claim automatic compliance?

### 4.5 Build tools & bundling
- [ ] Is the tool maintained and recommended by the framework? (CRA is deprecated; Next.js defaults to Turbopack in recent majors; Vite's bundler internals change across majors, so check the release notes)
- [ ] Are plugins compatible with the bundler actually in use? (webpack-only plugins under Turbopack, Rollup plugins under Rolldown)
- [ ] Are `browserslist`/targets matched to the support matrix (fe-ship), with no unnecessary polyfills?
- [ ] Is the config minimal, without copied flags whose purpose no one knows?

### 4.6 New library / pattern adoption
- [ ] Problem statement: what fails today without it? Measured?
- [ ] Platform or framework alternative already available?
- [ ] Health: releases in the last 6 months, maintainers > 1, issue response, license, bundle size (bundlephobia/pkg-size), types included, ESM.
- [ ] Compatibility: React 19 / framework major / SSR / bundler support confirmed in docs or tests
- [ ] Exit cost: how hard is it to remove? Is it wrapped behind one module?
- [ ] Security: typosquatting check, install scripts, advisory history (fe-sec supply chain)

---

## 5. Case studies

### 5.1 "Use Redux for everything"
**Claim:** "Put all app data, including API responses, form state and modal flags, in one Redux store."
**Check:** The Redux docs recommend Redux Toolkit as the standard way to write Redux, and mark the legacy `createStore` as deprecated. The React and TanStack docs separate server state (caching, dedupe, refetch) from client state. Forms and modal flags are local state.
**Verdict: Outdated** (as a blanket rule). Redux Toolkit itself is **Still Best Practice** for complex, shared, frequently-changing client state.
**Improved:**
```ts
// server state → query cache (Vite/plain React) or Server Components (Next.js)
const { data: orders } = useQuery({ queryKey: ["orders", { page }], queryFn: ({ signal }) => getOrders(page, signal) });
// URL state → filters/pagination shareable via search params
// local state → form inputs, open/closed flags
const [open, setOpen] = useState(false);
// RTK slice only for genuinely global client state (e.g. multi-step editor document)
```
**Migration:** move one API slice at a time to the query cache (fe-data). Delete thunks and loading flags as each slice moves.

### 5.2 Optimisation no longer needed (React 19 / Next.js 15+)
**Claim:** "Wrap every handler in `useCallback`, every child in `React.memo`, use `forwardRef` for every input, and add `cache: 'no-store'` to every fetch so Next.js doesn't serve stale data."
**Check:** In React 19, function components accept `ref` as a regular prop, so `forwardRef` is no longer needed for new code. React Compiler (stable since late 2025; confirm the version in your project) memoizes automatically where it is enabled. Next.js 15 changed fetch to be uncached by default, so blanket `no-store` repeats the default.
**Verdict: Outdated** (memo/forwardRef/no-store as blanket rules). Manual memoization stays **Acceptable** where the profiler shows a hot path and the compiler is not enabled.
**Improved:**
```tsx
// React 19: ref as a prop
export function TextField({ ref, ...props }: React.ComponentProps<"input">) {
  return <input ref={ref} {...props} />;
}
// Next.js 15+: opt INTO caching explicitly where data is shared and slow-changing
const res = await fetch(`${API}/catalog`, { next: { revalidate: 300, tags: ["catalog"] } });
```
Verify with the React Profiler before and after removing memo wrappers (fe-perf). Enable React Compiler gradually, with its lint rule.

### 5.3 Security pattern with a better alternative
**Claim:** "Store the JWT in `localStorage`, attach it in an Axios interceptor, and protect pages with a Next.js middleware redirect."
**Check:** OWASP guidance notes that `localStorage` is readable by any script on the origin, so one XSS exfiltrates the token. CVE-2025-29927 showed that Next.js middleware could be bypassed with a crafted header in affected versions; it was patched in 15.2.3 and 14.2.25. Next.js docs recommend verifying auth close to data (a Data Access Layer), not only in middleware.
**Verdict: Harmful** (token in JS-readable storage + middleware as the only check).
**Improved:** an HttpOnly, `Secure`, `SameSite=Lax` session cookie set by the server or a backend-for-frontend, with authorization checked in every Server Action, Route Handler, and data function. Middleware/proxy is kept only for redirects. Add a nonce-based CSP. For Vite and plain React SPAs, use a BFF or same-site API with cookie sessions and CSRF protection (fe-sec).
```ts
// lib/dal.ts (Next.js) — every data access re-verifies the session
import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
export const requireUser = cache(async () => {
  const session = await verifySession((await cookies()).get("session")?.value);
  if (!session) throw new Error("UNAUTHENTICATED");
  return session.user;
});
```

---

## 6. Output template

```markdown
## Knowledge review — <topic> (<date>, project versions: <react/next/vite …>)
| # | Claim (scoped) | Sources checked | Evidence level | Verdict | Confidence |
### Improved recommendation
<code / text, version-scoped>
### Migration (if already in use)
<steps, owning skill>
### Open questions / not verified
<list>
```

## 7. "Done" checklist (review session)

- [ ] Every claim restated as one scoped, falsifiable sentence, with versions
- [ ] Official docs checked for the project's versions; links + dates recorded
- [ ] Recent sources (2024–2026) and advisories checked, or their absence stated
- [ ] Deprecations, changed defaults, maintenance status checked
- [ ] Verdict given per claim with an evidence label; Outdated/Harmful backed by Verified/Measured evidence
- [ ] Improved recommendation is version-scoped and copy-paste ready
- [ ] Fixes handed to the owning skill; no unapproved edits
- [ ] Unverified items listed openly
- [ ] Learning loop run; proven corrections proposed to fe-learn

---

## 8. Cross-links

fe-review validates every other skill:
- fe-andy (router; conventions §4 "measure first" and §8 DoD) and fe-learn (run fe-review before promoting notes)
- fe-code and fe-clean (architecture, state, TypeScript patterns), fe-data (fetching/caching libraries)
- fe-perf (performance claims → measure), fe-motion (animation libraries), fe-sec (security patterns), fe-a11y and fe-contrast (accessibility advice)
- fe-layout (CSS approaches), fe-ux and fe-i18n (UX and locale advice), fe-skel (loading patterns)
- fe-test (testing tools), fe-ship (build/deploy/observability tooling), fe-recon (version facts for the project)
- fe-pwa (service worker tooling), fe-mfe (micro-frontend decisions)

Learned notes: [references/learned.md](./references/learned.md).
