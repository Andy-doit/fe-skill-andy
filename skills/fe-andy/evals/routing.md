# Routing Evals — fe-skill-andy

Sample requests and the skill that should handle them. Run manually: give each request to a fresh agent session with the skill set installed and record which skill it picks. Results below are **expected**, not measured.

| ID | Request | Expected skill | Boundary being tested |
|---|---|---|---|
| R01 | "Scroll feels laggy and GSAP animations stutter on mobile." | fe-motion | motion vs perf |
| R02 | "The page takes 4.5 s to load and LCP is 3.8 s on 4G." | fe-perf | load perf |
| R03 | "Is our frosted header text readable over the white cards when scrolling?" | fe-contrast | contrast vs a11y |
| R04 | "Blind users can't use our modal with Tab and a screen reader." | fe-a11y | a11y vs contrast |
| R05 | "Pricing cards have different heights because plan 2 has more bullets." | fe-layout | layout vs skel |
| R06 | "The pricing section shifts the page down while data loads." | fe-skel | loading CLS vs perf CLS |
| R07 | "Our CLS in Search Console is 0.31 on mobile; find the causes." | fe-perf | perf CLS vs skel |
| R08 | "Clean up this 400-line component with mixed state and inline styles." | fe-clean | refactor vs author |
| R09 | "Create a new OrderSummaryCard block and use it in Checkout." | fe-code | author vs refactor |
| R10 | "Propose 3 layouts for our comparison table with mockups." | fe-ux | brainstorm mode |
| R11 | "Numbers in the live dashboard jump sideways every second." | fe-ux | tabular-nums vs i18n |
| R12 | "Format VND as 250.000 ₫ and check vi.json has all en.json keys." | fe-i18n | i18n vs ux |
| R13 | "Make sure our forms don't leak API keys or allow script injection." | fe-sec | security |
| R14 | "Cancel the old search request when the user types again." | fe-data | data vs perf |
| R15 | "Survey this new repo and tell me the stack." | fe-recon | recon vs clean |
| R16 | "Run lint, types and Playwright before I open the PR." | fe-test | test vs ship |
| R17 | "Which skill should I use to make the site faster and prettier?" | fe-andy | router |
| R18 | "Remember this fix for next time: next/image needs sizes for the hero." | fe-learn | capture lesson |
| R19 | "Promote the learned notes into the skills." | fe-learn | promotion |
| R29 | "Collect what we learned in this project and update the skill set — show me the plan first." | fe-learn | collect & check |
| R30 | "We keep building charts; create a new skill for data visualization." | fe-learn | new skill |
| R20 | "Set up a release checklist and Sentry for the app." | fe-ship | ship vs test |
| R21 | "Add a sitemap and canonical tags." | fe-ship | SEO owner |
| R22 | "Our refresh token logic logs users out randomly." | fe-sec | frontend auth flow |
| R23 | "Add dark mode with a system option." | fe-layout | theming owner |
| R24 | "Write the error and empty-state text for the invoices page." | fe-ux | UX writing |
| R25 | "The memoized list still re-renders on every keystroke — profiler shows 120 ms commits." | fe-perf | measured re-renders vs fe-clean |
| R26 | "WebSocket disconnects and the ticker freezes." | fe-data | realtime |
| R27 | "Add unit and component tests for the signup form." | fe-test | writing tests vs fe-code |
| R28 | "Hydration error: text content does not match server." | fe-perf | Next.js hydration |
| R31 | "Users still see the old version after we deploy; we have a service worker." | fe-pwa | SW update vs fe-ship |
| R32 | "Inspectors need to fill forms offline and sync when back online." | fe-pwa | durable offline vs fe-data |
| R33 | "The search results come back out of order when offline then online." | fe-data | in-tab races vs fe-pwa |
| R34 | "Four teams want to deploy their parts of the storefront independently." | fe-mfe | MFE vs fe-code |
| R35 | "After loading the checkout remote we get 'Invalid hook call'." | fe-mfe | shared singletons vs fe-perf |
| R36 | "A blog says to wrap every callback in useCallback in React 19 — is that still right?" | fe-review | knowledge review vs fe-perf |
| R37 | "Before we adopt this state library, check it against current best practice." | fe-review | adoption review vs fe-code |
| R38 | "Someone found our original TypeScript by opening a .js.map URL on the live site." | fe-sec | source-map leakage (fe-ship owns the pipeline fix) |
| R39 | "We package the dashboard with Electron; the preload exposes ipcRenderer on window — is that OK?" | fe-sec | desktop hardening vs fe-code |
| R40 | "We hide the Delete button for non-admins, so the API doesn't need a check, right?" | fe-sec | UI is only affordance vs fe-data |
| R41 | "Add a CI step that fails the build if a source map ends up in dist/." | fe-ship | pipeline gate vs fe-sec |
| R42 | "Generate a typed client from our OpenAPI spec and wire it into TanStack Query." | fe-data | API contracts vs fe-code |
| R43 | "Set up login with the company's OIDC provider using PKCE." | fe-sec | login protocol vs fe-data |
| R44 | "A third-party stylesheet keeps overriding our Tailwind utilities." | fe-layout | cascade layers vs fe-clean |
| R45 | "Animate the move from the product grid to the product page." | fe-motion | View Transitions vs fe-perf |
| R46 | "Open a product in a modal from the grid, but the URL must be shareable and survive refresh." | fe-code | intercepting routes vs fe-ux |
| R47 | "Write an ADR for moving from Redux to TanStack Query and give the team a PR template." | fe-andy | engineering workflow vs fe-review |
| R48 | "Deadlines show one day early for users in New York." | fe-i18n | time zones vs fe-data |
| R49 | "Let users upload 2 GB videos with progress and resume after a dropped connection." | fe-code | file handling vs fe-data |
| R50 | "Add Storybook stories and interaction tests for the Button and Card blocks." | fe-code | component docs vs fe-test |
| R51 | "Split the repo into apps/ and packages/ and publish the ui package internally." | fe-ship | monorepo vs fe-clean |
| R52 | "Run an A/B test on the new checkout button without any layout flicker." | fe-ship | experimentation vs fe-ux |
| R53 | "Checkout has been failing since the deploy 20 minutes ago — what do we do first?" | fe-ship | incident response vs fe-sec |
| R54 | "Add a revenue-per-day chart to the dashboard with dark mode support." | fe-viz | chart vs fe-code |
| R55 | "Our scatter plot with 50,000 points freezes on hover." | fe-viz | chart rendering tech vs fe-motion |
| R56 | "The pie chart legend is colour-only and axe flags it." | fe-viz | chart a11y vs fe-a11y / fe-contrast |

## How to record a run

| ID | Tool + version | Picked skill | Pass? | Note |
|---|---|---|---|---|

### Run 2026-10-26 — blind description-only simulation (one fresh agent, not a real tool run)

Result: **28/28 pass**. Medium confidence (correct pick, runner-up shown):
| ID | Picked | Runner-up | Action taken |
|---|---|---|---|
| R07 | fe-perf | fe-skel | none — intended split (measure in fe-perf, fix loading CLS in fe-skel) |
| R22 | fe-sec | fe-data | fe-data description now excludes auth token refresh/session (→ fe-sec) |
| R24 | fe-ux | fe-skel | fe-skel description now excludes wording of error/empty messages (→ fe-ux) |
| R28 | fe-perf | fe-code | none — hydration listed in fe-perf; watch in real runs |

Still to do: run R01–R28 in Claude Code, Codex and Antigravity and record per tool.

A failing case is a learning-loop note for fe-andy (`references/learned.md`): fix the descriptions of the two skills involved, then re-run.
