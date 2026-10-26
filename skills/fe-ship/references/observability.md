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
