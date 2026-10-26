# Observability, Analytics, Consent, Compatibility

## 1. Error tracking

- Capture: unhandled errors and promise rejections, React error boundary catches, failed critical requests (with status, not bodies).
- Tag every event with release version and environment; upload source maps to the tracker privately.
- Scrub before sending (`beforeSend` or equivalent): remove tokens, cookies, emails, phone numbers, query params with personal data.
- Session replay (if used): mask all inputs and text by default; get consent where required.
- Alert on new error types and error-rate spikes after a release.

## 2. Logging in the browser

- No `console.log` in production for normal flow; keep `console.error` for real errors (or route through a logger that ships to the tracker).
- Never log secrets or personal data (fe-sec checklist §7).

## 3. Performance in the field

Report Core Web Vitals from real users (`web-vitals` `onLCP/onINP/onCLS` with attribution, or the framework hook) to analytics or a RUM tool; segment by route and device. Thresholds: fe-perf.

## 4. Analytics events

| Rule | Example |
|---|---|
| Naming: `object_action`, past tense, snake_case | `signup_completed`, `plan_selected` |
| Small, documented property set | `{ plan: "pro", billing: "yearly" }` |
| No personal data in properties | ❌ email, name, free-text input |
| One tracking plan file in the repo | `docs/tracking-plan.md`: event, trigger, properties, owner |
| Fire from one helper | `track("plan_selected", props)` wrapping the vendor SDK |

## 5. Consent and privacy

- Classify scripts and cookies: strictly necessary / preferences / analytics / marketing.
- Load non-essential scripts only after consent; store the choice; let users change it later (footer link).
- Respect Global Privacy Control / Do Not Track signals if the policy requires it.
- Default region-appropriate (e.g. opt-in in the EU); confirm the legal requirement with the product/legal owner — not an engineering decision.
- Privacy-friendly defaults: IP anonymization, short retention, no cross-site identifiers unless consented.

## 6. Browser and device support

- Write the support matrix in `project-profile.md` and match `browserslist` to it.
- Test on: latest Chrome, Safari (macOS + iOS), Firefox, Edge; one low-end Android device or CPU-throttled emulation; slow network throttling.
- Feature-detect (`CSS.supports`, `"IntersectionObserver" in window`) instead of user-agent sniffing; provide fallbacks for features outside the matrix.

## 7. Advanced observability (Senior+)

### 7.1 What to instrument

| Signal | Tooling (examples) | Key dimensions |
|---|---|---|
| Errors | Sentry / Datadog RUM / tracker in use | `release`, `environment`, `route`, `remote` + `remoteVersion` (fe-mfe), `swVersion` (fe-pwa) |
| Field performance | `web-vitals/attribution` → RUM endpoint | route template (not raw URL), device class, connection, INP target selector + phase |
| Traces | OpenTelemetry Web SDK (`@opentelemetry/sdk-trace-web`, fetch instrumentation) | `traceparent` propagated to own APIs only |
| Business health | analytics events (§4) | funnel step, plan, experiment variant |
| Client logs | structured logger → tracker breadcrumbs | `level`, `event`, ids, no free text with personal data |

### 7.2 RUM with attribution (framework-agnostic)

```ts
// lib/rum.ts — send once per metric, batched with sendBeacon
import { onCLS, onINP, onLCP, onTTFB, type MetricWithAttribution } from "web-vitals/attribution";

const queue: Record<string, unknown>[] = [];
const flush = () => { if (queue.length) navigator.sendBeacon("/rum", JSON.stringify(queue.splice(0))); };

function report(m: MetricWithAttribution) {
  queue.push({
    name: m.name, value: Math.round(m.name === "CLS" ? m.value * 1000 : m.value), rating: m.rating, id: m.id,
    route: document.documentElement.dataset.route ?? location.pathname.replace(/\/\d+/g, "/:id"),
    release: __APP_RELEASE__, // build-time constant: Vite `define`, Next.js `env`/`NEXT_PUBLIC_RELEASE` (declare in a .d.ts)
    target: m.name === "INP" ? m.attribution.interactionTarget : m.name === "LCP" ? m.attribution.target : undefined,
  });
}
[onCLS, onINP, onLCP, onTTFB].forEach((fn) => fn(report));
addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") flush(); });
```

- **Next.js (App Router):** call `useReportWebVitals` from a small `"use client"` component in the root layout, or load `lib/rum.ts` there. Use `instrumentation-client.ts` for early client setup where your Next.js version supports it, and `instrumentation.ts` with `@vercel/otel` or the OTel Node SDK for server traces.
- **Vite + React / plain React:** import `lib/rum.ts` once in `main.tsx` before `createRoot`. Inject the release with `define: { __APP_RELEASE__: JSON.stringify(process.env.GIT_SHA) }` (webpack: `DefinePlugin`).

### 7.3 Distributed tracing
- Propagate `traceparent` only to your own origins (`propagateTraceHeaderCorsUrls: [/^https:\/\/api\.example\.com/]`). Never send it to third parties, and allow the header in the API's CORS config.
- Sample: 100 % of errors, 5–20 % of traces, and always sample checkout/payment flows when privacy policy allows.
- Name spans after route templates and actions (`checkout.submit`), not raw URLs with ids.

### 7.4 Release health and gates
- Compare the new release against the previous one: crash-free sessions, error rate per route, p75 LCP/INP. Roll back automatically, or page on-call, when error rate rises > 2× baseline or crash-free sessions fall under target within 30 min. Thresholds go in the project profile.
- Upload source maps per release, delete them from the public output (or never emit them publicly), and verify that a test error shows a symbolicated stack.
- Use feature flags and progressive rollout (1 % → 10 % → 100 %), with dashboards split by flag variant.

### 7.5 Frontend SLOs and alerts

| SLO (example) | SLI | Alert |
|---|---|---|
| 99.5 % of page views without an unhandled error | error page views / all page views | burn rate > 2 over 1 h |
| p75 INP ≤ 200 ms on key routes | RUM INP per route | 3 consecutive days over budget → ticket, not page |
| 99 % successful checkout submits | submit success / attempts | > 1 % drop in 15 min → page |

Alert on symptoms users feel (error spikes, failed critical actions), not on every new error type. Route alerts by ownership tag (team, remote).

### 7.6 Privacy in observability
Session replay with masking by default, PII scrubbing in `beforeSend`, consent gating for RUM and replay where required (§5), and retention aligned with policy. Validate new observability vendors or SDK patterns with fe-review before adoption.

## 8. Experimentation (A/B tests) — frontend rules

What to test and the success metric are product decisions (fe-ux); this section covers the mechanics the frontend owns.

| Rule | Why / how |
|---|---|
| **Assign server-side or at the edge; never flash** | Client-side assignment after hydration shows variant A then B (CLS + bias). Next.js: evaluate flags in Server Components / route handlers (a flags SDK with precomputed variants per route — verify the current package); Vite/plain React: the BFF returns the assignment with the session, or the app hides the slot ≤ 100 ms with a fixed-size placeholder (no CLS) |
| **Sticky bucketing** | Assignment keyed by a stable id (user id, else an anonymous cookie) so a user keeps the variant across sessions and devices where possible |
| **One wrapper** | `getVariant("checkout_button_v2")` wraps the vendor SDK; components never import the SDK |
| **Exposure event only when the variant renders** | `experiment_exposed { experiment, variant }` fired from the rendered component, once per session; assignments without exposure dilute results |
| **Guardrail metrics** | Error rate, CWV per variant, and the primary business metric; a variant that regresses a guardrail is stopped regardless of the primary metric |
| **Decide the plan before starting** | Hypothesis, primary metric, minimum detectable effect, sample size and duration (data/product owner); no peeking-based early stops; check sample-ratio mismatch daily |
| **Parity** | Both variants pass a11y (fe-a11y) and the perf budget (fe-perf); i18n complete for every variant |
| **Privacy** | No PII in exposure events; respect consent for analytics; experiments do not change data retention |
| **Cleanup** | Winner shipped as default, flag and losing code removed within an agreed window (≤ 30 days); tracking plan updated |

Flicker handling, best to worst: SSR/edge assignment → edge rewrite to a variant route → client assignment with a reserved-size placeholder and a strict time budget. Never "render A, then swap".
