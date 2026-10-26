# Evaluation Suite: Skill Routing & Boundary Precision (`fe-skill-andy`)

Test cases for verifying that an AI agent accurately selects the appropriate skill based solely on frontmatter `description` boundaries without ambiguity.

---

## Evaluation Test Cases

| Test ID | User Request Prompt | Expected Skill | Boundary Rationale |
|---|---|---|---|
| **EVAL-01** | "The webpage scroll feels laggy and GSAP animations stutter when scrolling on mobile." | `fe-motion` | Motion and frame rate optimization; specifically GSAP and animation smoothness. |
| **EVAL-02** | "The page takes 4.5 seconds to load and LCP is 3.8s on 4G networks." | `fe-perf` | Loading performance and Core Web Vitals (LCP); not animation frame rates. |
| **EVAL-03** | "Check if our frosted-glass header text is readable when scrolling over white cards." | `fe-contrast` | Mathematical color contrast and luminance verification over dynamic backgrounds. |
| **EVAL-04** | "Ensure blind users can navigate our modal dialog using Tab and screen readers." | `fe-a11y` | Keyboard focus trap, ARIA, and assistive navigation; not color contrast. |
| **EVAL-05** | "Cards in the pricing grid have different heights because plan 2 has more bullet points." | `fe-layout` | Row height balancing (`h-full` + `mt-auto`) and spatial alignment of visible UI. |
| **EVAL-06** | "The pricing section flickers and shifts the page downward while data is loading." | `fe-skel` | Ghost skeleton matching layout 1:1 and preventing Cumulative Layout Shift (CLS). |
| **EVAL-07** | "We have a 400-line God component with mixed state and inline styles that needs cleanup." | `fe-clean` | Technical debt audit, code smells, and incremental refactoring of existing legacy code. |
| **EVAL-08** | "Create a new OrderSummaryCard block and connect it to a new Checkout feature." | `fe-code` | Scaffolding new code compliant with the 4-layer architecture; not auditing legacy code. |
| **EVAL-09** | "Propose 3 different layouts for our product comparison table and show visual mockups." | `fe-ux` | UX brainstorming Mode 1: generating layout alternatives and mockups without writing production code. |
| **EVAL-10** | "Ensure numbers in the live cryptocurrency dashboard don't jump laterally every second." | `fe-ux` | Numerical typography styling (`tabular-nums`) to prevent horizontal character jitter. |
| **EVAL-11** | "Format Vietnamese currency to 250.000 ₫ and check if vi.json has all keys from en.json." | `fe-i18n` | Locale number/currency formatting (`Intl.NumberFormat`) and bilingual dictionary parity. |
| **EVAL-12** | "Verify that our client forms do not leak private API keys or allow script injection." | `fe-sec` | Client secret leak detection (`NEXT_PUBLIC_*`) and XSS prevention (DOMPurify). |
| **EVAL-13** | "Abort in-flight search requests when the user types a new character in the search box." | `fe-data` | Data layer request cancellation (`AbortController`) and race condition prevention. |
| **EVAL-14** | "Survey this new client repository and give me an architectural breakdown of their stack." | `fe-recon` | Read-only reconnaissance report; no code mutation. |
| **EVAL-15** | "Run our lint, TypeScript check, and Playwright tests before opening a pull request." | `fe-test` | Verification matrix execution across quality tiers. |

---

## Simulated Evaluation Results

All 15 evaluation cases map unambiguously to their designated skill. The explicit "DO NOT USE FOR" guardrails in each skill's YAML description successfully eliminate cross-domain collisions between:
- `fe-perf` vs `fe-motion` (Bundle/React runtime vs GPU/Animation frame rates).
- `fe-layout` vs `fe-skel` (Static visible alignment vs Dynamic loading ghost skeletons).
- `fe-contrast` vs `fe-a11y` (Mathematical color luminance vs Keyboard focus & ARIA).
- `fe-ux` vs `fe-i18n` (`tabular-nums`/`text-balance` vs Locale currency/dictionary parity).
- `fe-clean` vs `fe-code` (Refactoring legacy debt vs Scaffolding new features).
