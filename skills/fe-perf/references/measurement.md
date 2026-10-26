# Measurement — measure before and after every change

Tool availability depends on the project. Never install a tool without consent; prefer what the project already has.

## 1. Lab tools

| Need | Tool | How |
|---|---|---|
| Page-level score + CWV lab values | Lighthouse (Chrome DevTools → Lighthouse, mobile) | Run 3 times, report the median. Use an incognito window to avoid extensions. |
| Lighthouse from CLI (if already available) | `npx lighthouse <url> --preset=perf --form-factor=mobile --output=json --output-path=./lh.json` | `npx` may download the package — ask first. |
| Main-thread work, long tasks, layout thrashing | Chrome DevTools → Performance → record the interaction | Look for red-cornered tasks (> 50 ms), purple "Layout" blocks inside JS, "Forced reflow" warnings. |
| Which component re-renders and why | React DevTools → Profiler, "Record why each component rendered" | Record only the slow interaction; report commit count and duration. |
| Unused JS/CSS | DevTools → Coverage | Report unused bytes for the route. |
| Network waterfall | DevTools → Network, throttled to "Fast 4G" + 4× CPU slowdown | Screenshot or list the critical chain. |
| Layout shifts | DevTools → Performance → "Layout shifts" track, or Rendering → "Layout Shift Regions" | Note the shifted element and the cause. |

## 2. Field data (real users)

- If the site is public and has traffic, CrUX data (PageSpeed Insights "Discover what your real users are experiencing") gives p75 LCP/INP/CLS.
- In code, the `web-vitals` library (if installed) reports `onLCP`, `onINP`, `onCLS` with attribution; send to the project's analytics endpoint. In Next.js, `useReportWebVitals` is available (check the project's Next.js version docs).
- Field and lab disagree often; field data wins for prioritization, lab data is for debugging.

## 3. Bundle size

| Bundler | Option (only if already installed or approved) |
|---|---|
| Next.js | `@next/bundle-analyzer` (env flag `ANALYZE=true` per its README); build output also prints per-route First Load JS |
| Vite / Rollup | `rollup-plugin-visualizer` |
| webpack | `webpack-bundle-analyzer` |
| Any (no install) | `node scripts/check-bundle-size.mjs <build-dir> --budget <KB>` from the fe-perf skill folder: sums JS/CSS (raw + gzip) and exits 1 over budget |

## 4. Budgets in CI

Write budgets in `project-profile.md` (see the template). Enforce with something the project already uses, for example:
- the fe-perf bundle script as a CI step after build (exit code fails the job);
- Lighthouse CI assertions (`categories:performance`, `largest-contentful-paint`) if the team adopts it;
- `size-limit` if already in the repo.

## 5. Reporting

```markdown
| Metric | Before | After | Method (tool, runs, device/throttle) |
|---|---|---|---|
| LCP (lab, median of 3) | 3.8 s | 2.3 s | Lighthouse mobile, 3 runs |
| Route JS (gzip) | 312 KB | 204 KB | check-bundle-size.mjs |
```
Mark any number not measured in this session as "not measured".
