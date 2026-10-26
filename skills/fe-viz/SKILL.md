---
name: fe-viz
description: >
  Design and build data visualization in web apps: chart type by the question asked, visual encoding and colour
  rules (colour-blind safe, never colour alone), SVG vs Canvas vs WebGL by data size, chart library selection
  (Recharts, visx, Nivo, ECharts, D3), responsive and themed charts, accessible charts (summary, data table,
  keyboard, patterns), chart performance (aggregation, downsampling, canvas, workers), realtime series, SSR
  placeholders, KPI tiles, sparklines, dashboards, testing and export.
  Use when: adding a chart, KPI tile, sparkline or dashboard, choosing a chart library, a chart is slow, unreadable or
  misleading, or charts fail an accessibility audit.
  DO NOT USE FOR: measured colour contrast (see fe-contrast); canvas/WebGL frame-rate stutter or GSAP (see fe-motion);
  fetching and caching the data (see fe-data); DO NOT USE FOR: dashboard spacing/grid (see fe-layout); chart loading
  skeletons (see fe-skel).
---

# fe-viz — Data Visualization

## 1. Goal

Turn data into charts that answer one question each, read correctly at a glance, work for keyboard and screen-reader users, stay fast at the real data size, and fit the project's tokens and themes. Follows [conventions.md](../fe-andy/references/conventions.md).

### Minimum rules (apply even without fe-andy)
- Read `project-profile.md` in the target project first (chart library, tokens, dark mode, data sizes, budgets).
- Existing chart / real-time visualization engines are a **protected zone** (conventions §5.2): audit and propose, but change them only with explicit instruction. New charts follow this skill.
- Read-only audit first; propose; wait for approval before editing. Never install a chart library without consent.
- Never ship a chart without a text alternative (summary + table or export).
- Finish with the learning loop: append new, proven lessons to [references/learned.md](./references/learned.md) after a duplicate check ([learning-loop.md](../fe-andy/references/learning-loop.md)).

---

## 2. When to use / When NOT to use

| Use fe-viz when | Do NOT use fe-viz when (use instead) |
|---|---|
| Adding or redesigning a chart, KPI tile, sparkline, funnel, heatmap, map | The question is answered by a number or a sentence → show the number (KPI tile text), no chart |
| Choosing between chart libraries or SVG/Canvas/WebGL | The chart's palette needs a measured contrast ratio → fe-contrast |
| A chart is slow with real data, or re-renders on every hover | A canvas animation stutters or leaks → fe-motion; the data fetch is slow → fe-data |
| Charts fail a11y (no name, colour-only, no keyboard) | General page a11y outside charts → fe-a11y |
| Dashboard design: which charts, which order, what to compare | Spacing, grid, responsive layout of the dashboard shell → fe-layout |

---

## 3. Core concepts and decision process

### 3.1 Chart by question

| Question | Chart | Notes |
|---|---|---|
| How does X compare across categories? | Bar (horizontal when labels are long); dot plot for many categories | Zero baseline on bars; sort by value unless order has meaning |
| How does X change over time? | Line (≤ 5 series), area only for cumulative/stacked totals, sparkline in tables | Equal time buckets; show gaps as gaps, not zeros |
| What is the distribution? | Histogram, box/violin, strip plot | Pick bin width deliberately; show n |
| What is part of a whole? | Stacked bar (100 %) or a single-ring donut with ≤ 5 slices | Pie/donut only for 2–5 parts with clear differences; label slices directly |
| How do two measures relate? | Scatter (+ trend line), bubble (size = third measure, state the scale) | Log scale when ranges span orders of magnitude (label it) |
| Where? | Choropleth (rates, not counts), symbol map (counts) | Normalize by population/area; include a legend with units |
| How do items flow / convert? | Funnel (ordered steps), Sankey (multi-path) | Show absolute and % at each step |
| Many small comparisons | Small multiples (same scale, same axes) | Beats one over-plotted chart |
| Change between two points | Slope chart, dumbbell | Better than two bars when the delta is the point |

Never: 3-D effects, dual y-axes with different units on one chart (use two stacked charts), truncated bar baselines, rainbow scales for ordered data, > 7 categorical colours, pie charts for time.

### 3.2 Encoding and colour

Accuracy of perception, best → worst: **position on a common scale → length → angle/slope → area → colour intensity → colour hue**. Put the most important comparison on position; use colour to group, not to measure.

| Scale | Palette rule | Source |
|---|---|---|
| Categorical (≤ 7 groups) | Distinct hues, similar lightness; colour-blind safe (e.g. the Okabe–Ito set as a reference); one semantic colour for "this" vs grey for context | Project tokens: define `--chart-1…7` once (fe-layout theming) |
| Sequential (low → high) | Single hue, lightness ramp in `oklch` (5–7 steps) | `color-mix()` from a brand token |
| Diverging (−/0/+) | Two hues through a neutral midpoint; midpoint = meaningful zero | Never red/green only |
| Semantic | Positive/negative/warning from tokens, consistent across every chart | Same as UI status tokens |

Colour never carries meaning alone: pair it with labels, direct annotations, shapes/dash patterns (lines) or pattern fills (bars). Verify every text/mark on background with fe-contrast (≥ 3:1 for marks, 4.5:1 for text).

### 3.3 Rendering technology

| Elements on screen | Technology | Why |
|---|---|---|
| ≤ ~2,000 (bars, ≤ 5 lines × 500 points, pies) | **SVG** | DOM = free a11y hooks, CSS theming, crisp text, easy tooltips |
| 2,000 – ~200,000 (scatter, long series, heatmaps) | **Canvas 2D** (one `<canvas>`, DPR-aware, offscreen for prep) | One draw call set; no DOM cost; hit-testing by quadtree/nearest point |
| > 200,000 or 3-D | **WebGL/WebGPU** (regl, deck.gl, three.js) | GPU batching; expect a bundle and complexity cost |
| Any size, print/export quality | SVG for export; canvas `toBlob` for PNG | — |

Rule: aggregate on the server first (§3.5); most "we need canvas" cases disappear after bucketing.

### 3.4 Library choice (React)

| Library | Pick when | Watch |
|---|---|---|
| **Recharts** | Standard dashboard charts fast; SVG; declarative | Limited custom encodings; performance drops past a few thousand points; SSR needs sizing |
| **visx** (Airbnb) | Custom, on-brand charts with full control; composable SVG primitives + D3 scales | You own axes, tooltips, a11y; more code |
| **Nivo** | Rich defaults incl. canvas variants, theming, patterns | Larger bundle; opinionated |
| **Apache ECharts** (`echarts-for-react`) | Big data, canvas/SVG switch, many chart types, built-in a11y description | Imperative option objects; large bundle (tree-shake modules) |
| **Observable Plot** | Exploratory/analytics views, grammar-of-graphics, little code | Less React-idiomatic; theming via CSS |
| **Chart.js** | Simple canvas charts, small apps | Weak a11y out of the box |
| **D3** (scales/shapes only) | Scales, shapes, layouts under your own SVG/canvas | Do not use D3 for DOM updates inside React — React owns the DOM |

Default for a product dashboard: **Recharts or visx on SVG**, D3 scales where needed, ECharts/canvas only where the data size demands it. Run the choice through fe-review (bundle, maintenance, SSR support) and record it in `project-profile.md`.

### 3.5 Data pipeline

1. **Aggregate on the server** (SQL/warehouse): time buckets (`date_trunc`), top-N + "other", percentiles. The browser receives ≤ a few thousand rows per chart.
2. **Downsample** long series for display (LTTB or min/max per pixel bucket) — never plot 50k points into a 600 px wide line.
3. **Shape for the chart once**: a memoized transform (`useMemo` keyed by data + size) builds scales and series; render functions stay pure.
4. **Fetch rules** (fe-data): query keys include range/granularity; prefetch the next range; keep previous data while loading (no blank charts).
5. **Realtime**: append to a bounded window, batch updates with `requestAnimationFrame`, pause when the tab is hidden, render deltas (canvas) instead of full redraws.

### 3.6 Accessibility (charts are the most common a11y failure in dashboards)

| Requirement | Implementation |
|---|---|
| Name and summary | Wrapper with `role="img"` (static) or `role="group"` (interactive) + `aria-label`/`aria-labelledby` naming the chart and `aria-describedby` a one-sentence insight ("Revenue up 12 % vs last month, peak on 14 Oct") |
| Non-visual access to the data | A real `<table>` (visually hidden or in a "View data" toggle) with the same numbers, or a CSV download (fe-code files.md) |
| Keyboard | Interactive charts: focusable points/bars (`tabIndex=0`, arrow keys move between data points), tooltip content announced via a live region; legend items are buttons that toggle series |
| Colour independence | Direct labels, shapes/dash patterns, pattern fills; 3:1 contrast for marks against background and adjacent marks |
| Motion | Entry animations respect `prefers-reduced-motion`; no infinite animation on resting charts (fe-motion) |
| Text | Axis labels ≥ 12 px, tabular numbers, units in labels; no rotated-45° label walls (switch to horizontal bars) |
| Zoom | Chart reflows at 200 % zoom and at 320 px width (simplify: fewer ticks, hide legend into a list) |

### 3.7 Responsiveness, theming, SSR

- Size from the container (`ResizeObserver` or the library's responsive wrapper) with a fixed aspect ratio; reserve the space so loading causes no CLS (fe-skel ghost = same aspect ratio).
- Mobile: fewer ticks, horizontal bars, legend below, tooltips on tap with a dismiss; sparklines instead of full charts in lists.
- Theme: chart colours, grid lines and text read tokens (`var(--chart-1)`, `var(--color-ink-muted)`); dark mode flips through the token layer, not chart props.
- SSR (Next.js): charts need measurements → render a sized placeholder on the server and load the chart client-side (`dynamic(() => import(...), { ssr: false })` or a `"use client"` component inside Suspense); the summary text and the data table can be server-rendered, so content exists before JS.

### 3.8 Performance checklist (measure with fe-perf tools)

- No whole-chart re-render on hover: tooltip state lives in a small child; series data and scales are memoized.
- Chart bundle lazy-loaded per route; tree-shake the library (ECharts modules, visx packages).
- Canvas: draw at `devicePixelRatio`, cap DPR at 2, redraw only on data/size change, hit-test with a quadtree or sorted-x binary search.
- Heavy transforms (aggregation, regression) in a Web Worker when > 50 ms on a mid-range phone.
- Lists of sparklines: virtualize rows (fe-perf), share one scale computation.

---

## 4. Implementations

### 4.1 Framework-agnostic principles
1. One question per chart, stated in the title ("Orders per day, last 30 days"), insight in the subtitle.
2. Data shaped on the server; the component receives `Array<{ x, y, series? }>` and a unit.
3. Chart component = Block (props only; no fetching); the Feature fetches and passes data.
4. Every chart ships with: name, summary, table/CSV alternative, reduced-motion handling, token colours, skeleton with the same aspect ratio.
5. Test the transform and the a11y surface, not SVG path strings.

### 4.2 Downsampling (server or worker)

```ts
// lib/viz/downsample.ts — min/max per pixel bucket keeps peaks that LTTB can smooth away; use for monitoring-style series
export type Point = { x: number; y: number };
export function minMaxBuckets(points: Point[], targetWidthPx: number): Point[] {
  if (points.length <= targetWidthPx * 2) return points;
  const bucketSize = points.length / targetWidthPx;
  const out: Point[] = [];
  for (let b = 0; b < targetWidthPx; b++) {
    const start = Math.floor(b * bucketSize), end = Math.min(points.length, Math.floor((b + 1) * bucketSize));
    let min = points[start], max = points[start];
    for (let i = start + 1; i < end; i++) { const p = points[i]; if (p.y < min.y) min = p; if (p.y > max.y) max = p; }
    out.push(...(min.x <= max.x ? [min, max] : [max, min]));
  }
  return out;
}
```

### 4.3 Next.js (App Router) — server summary + client chart with a11y surface

```tsx
// features/analytics/components/revenue-chart.tsx (Server Component): data + summary + table are server-rendered
import { Suspense } from "react";
import { RevenueLineClient } from "./revenue-line-client";
import { getRevenueSeries } from "../queries";
import { formatMoney } from "@/lib/money";

export async function RevenueChart({ days, locale }: { days: number; locale: string }) {
  const { points, total, deltaPct } = await getRevenueSeries(days);   // aggregated per day on the server
  const summary = `Revenue ${formatMoney(total, locale)} over ${days} days, ${deltaPct >= 0 ? "up" : "down"} ${Math.abs(deltaPct)} % vs the previous period.`;
  return (
    <figure aria-labelledby="rev-title" aria-describedby="rev-summary" className="rounded-card border border-border p-4">
      <figcaption><h3 id="rev-title">Revenue per day</h3><p id="rev-summary" className="text-ink-muted">{summary}</p></figcaption>
      <Suspense fallback={<div className="aspect-[16/7]" aria-hidden />}>
        <RevenueLineClient points={points} locale={locale} />
      </Suspense>
      <details className="mt-2"><summary>View data</summary>
        <table><caption className="sr-only">Revenue per day</caption>
          <thead><tr><th scope="col">Day</th><th scope="col">Revenue</th></tr></thead>
          <tbody>{points.map((p) => <tr key={p.day}><td>{p.day}</td><td className="tabular-nums">{formatMoney(p.revenue, locale)}</td></tr>)}</tbody>
        </table>
      </details>
    </figure>
  );
}
```

```tsx
// features/analytics/components/revenue-line-client.tsx — Recharts, client-only, token colours, reduced motion
"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { formatMoney, type Money } from "@/lib/money";

type P = { day: string; revenue: Money };
export function RevenueLineClient({ points, locale }: { points: P[]; locale: string }) {
  const reduce = useReducedMotion();
  const data = points.map((p) => ({ day: p.day, value: p.revenue.amount, money: p.revenue }));
  return (
    <div className="aspect-[16/7]" role="img" aria-label="Line chart of revenue per day">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
          <CartesianGrid stroke="var(--color-border)" vertical={false} />
          <XAxis dataKey="day" tick={{ fill: "var(--color-ink-muted)", fontSize: 12 }} minTickGap={24} />
          <YAxis tickFormatter={(v: number) => formatMoney({ amount: v, currency: points[0]?.revenue.currency ?? "USD" }, locale)} width={72} tick={{ fill: "var(--color-ink-muted)", fontSize: 12 }} />
          <Tooltip formatter={(_v, _n, item) => formatMoney((item.payload as { money: Money }).money, locale)} />
          <Line type="monotone" dataKey="value" stroke="var(--chart-1)" strokeWidth={2} dot={false} isAnimationActive={!reduce} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

### 4.4 Vite + React / plain React — custom SVG with visx scales (full control, keyboard-accessible bars)

```tsx
import { scaleBand, scaleLinear } from "@visx/scale";
import { useMemo, useState } from "react";

type Datum = { label: string; value: number };
export function BarChart({ data, width, height, unit }: { data: Datum[]; width: number; height: number; unit: string }) {
  const m = { top: 8, right: 8, bottom: 28, left: 48 };
  const x = useMemo(() => scaleBand<string>({ domain: data.map((d) => d.label), range: [m.left, width - m.right], padding: 0.25 }), [data, width]);
  const y = useMemo(() => scaleLinear<number>({ domain: [0, Math.max(...data.map((d) => d.value))], range: [height - m.bottom, m.top], nice: true }), [data, height]);
  const [active, setActive] = useState<number | null>(null);
  return (
    <svg width={width} height={height} role="group" aria-label={`Bar chart, ${unit} by category`}>
      {data.map((d, i) => (
        <g key={d.label} tabIndex={0} role="img" aria-label={`${d.label}: ${d.value} ${unit}`}
           onFocus={() => setActive(i)} onBlur={() => setActive(null)} onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)}
           onKeyDown={(e) => { if (e.key === "ArrowRight") (e.currentTarget.nextElementSibling as HTMLElement | null)?.focus(); if (e.key === "ArrowLeft") (e.currentTarget.previousElementSibling as HTMLElement | null)?.focus(); }}>
          <rect x={x(d.label)} y={y(d.value)} width={x.bandwidth()} height={y(0) - y(d.value)} fill={active === i ? "var(--chart-1-strong)" : "var(--chart-1)"} />
          <text x={(x(d.label) ?? 0) + x.bandwidth() / 2} y={height - 8} textAnchor="middle" fontSize={12} fill="var(--color-ink-muted)">{d.label}</text>
        </g>
      ))}
      <text x={m.left - 6} y={m.top + 4} textAnchor="end" fontSize={12} fill="var(--color-ink-muted)">{y.domain()[1]}</text>
      <text x={m.left - 6} y={height - m.bottom} textAnchor="end" fontSize={12} fill="var(--color-ink-muted)">0</text>
      <p role="status" className="sr-only">{active !== null ? `${data[active].label}: ${data[active].value} ${unit}` : ""}</p>
    </svg>
  );
}
```
Measure `width/height` with a `ResizeObserver` hook on the parent; plain React (webpack/Rspack) uses the same component. Replace the inline `<p>` with an HTML live region outside the SVG in real code.

### 4.5 Canvas sketch for large series (any framework)

Draw in an effect keyed by `[data, width, height, theme]`: set `canvas.width = width * dpr` (dpr capped at 2), `ctx.scale(dpr, dpr)`, draw grid → series (one `beginPath` per series) → annotations; keep a sorted x-array for `binarySearch` hit-testing on `pointermove`, and render the tooltip and the focused point as DOM elements over the canvas so they stay accessible. Keep the a11y surface (summary + table) in the DOM; the canvas gets `role="img"` + `aria-label`.

---

## 5. Case studies

**A. SaaS analytics dashboard (dynamic, dark mode, 90-day ranges).** Six KPI tiles with sparklines + one revenue line + one "top products" bar. Data aggregated per day in the warehouse; the API returns ≤ 90 points per series and top-10 + other. Recharts on SVG; chart colours from `--chart-1..5` tokens, dark mode via tokens only. Each chart: server-rendered title + insight sentence + collapsible table; the chart itself client-only in Suspense with a same-aspect skeleton. Range switches keep previous data (fe-data `keepPreviousData`). Result to measure: INP on range change ≤ 200 ms, no CLS, axe clean, keyboard reaches every tile and legend.

**B. E-commerce admin: 5,000-row order table with sparklines + sales-by-category.** Sparklines inside a virtualized table (fe-perf): one shared y-scale per column computed once, each sparkline a 60×20 SVG path with no axes and a `title` + `aria-label` ("7-day trend: up 8 %"). Category sales as horizontal bars sorted by value, "other" bucket, direct value labels, pattern fill on the highlighted category. Funnel shown as ordered horizontal bars with absolute + % — not a trapezoid funnel. Export: CSV link per chart (fe-code files.md).

**C. Failure case: marketing "live stats" section.** A 3-D animated donut with 12 slices, colour-only legend, D3 + a 3-D lib adding 310 KB to the landing page, infinite rotation, no labels, unreadable in dark mode. Fixes: replace with a single horizontal bar (top 5 + other) with direct labels; static SVG, 0 KB of chart library; tokens for colour; one entry animation under `prefers-reduced-motion`; a one-sentence summary as real text (also what crawlers read). Lesson: the question was "which category is biggest" — a bar answers it; the donut answered nothing and cost LCP.

---

## 6. "Done" checklist

- [ ] Each chart states its question in the title and its insight in text; chart type matches the question (§3.1)
- [ ] Encoding puts the key comparison on position; colour palette from tokens, ≤ 7 categories, colour-blind safe, never colour alone
- [ ] Technology matches data size (SVG / canvas / WebGL); data aggregated server-side; long series downsampled
- [ ] Library choice recorded in `project-profile.md` with an fe-review verdict; chart bundle lazy-loaded; tree-shaken
- [ ] a11y surface: name + summary, table or CSV alternative, keyboard access for interactive charts, 3:1 mark contrast (fe-contrast run), reduced motion
- [ ] Responsive: reserved aspect ratio (no CLS), mobile simplification, 200 % zoom readable
- [ ] Theming through tokens; dark mode verified
- [ ] Performance: no full re-render on hover; INP ≤ 200 ms on interactions; measured with the fe-perf tools
- [ ] Tests: transform/downsample unit tests, a11y (axe) on the page, visual regression for key charts
- [ ] Existing chart engines untouched unless explicitly approved (protected zone)
- [ ] Learning loop run

---

## 7. Cross-links

- fe-data: query keys per range/granularity, keeping previous data, realtime streams feeding charts
- fe-perf: measuring INP/bundle for chart routes, virtualization of sparkline lists, workers for heavy transforms
- fe-motion: canvas/WebGL frame rate, animation cleanup, reduced motion mechanics
- fe-contrast: measuring mark/text contrast for the chart palette; fe-layout: `--chart-*` tokens and theming
- fe-a11y: general WCAG rules the chart surface must meet; fe-skel: same-aspect chart skeletons
- fe-code: chart Blocks (props only), CSV export (files.md), Storybook stories per chart state
- fe-ux: which charts a dashboard needs and in what order; copy for insights and empty states
- fe-review: validate the chart-library choice and any "we need WebGL" claim

Learned notes: [references/learned.md](./references/learned.md).
