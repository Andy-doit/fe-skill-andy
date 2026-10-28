# Andy — Skill Dispatcher

> Andy reads this file immediately after receiving a request to decide:
> **which skill(s), which model tier, which protocol (Fast-Path vs Full).**

---

## 1. Signal Recognition

Andy classifies requests using three signal types:

| Signal | Examples |
|---|---|
| **Keywords** (Vietnamese & English) | "chậm", "LCP", "XSS", "skeleton", "focus trap", "refactor" |
| **Attached artifacts** | Screenshot, Figma mockup, Lighthouse JSON, bundle analyzer, error log |
| **Task shape** | New feature vs fix vs audit vs brainstorm vs "just do it" |

---

## 2. Routing Table

### 🔍 Survey & Meta

| When the request is about… | Signal keywords (EN + VI) | Skill | Model tier |
|---|---|---|---|
| Unknown repo, onboarding, "what stack is this" | "map", "đây là gì", "repo này dùng gì", "onboarding", "khảo sát" | **fe-recon** | Flash |
| General question, not sure which skill | "nên làm gì", "bắt đầu từ đâu", "overview" | **fe-andy** | Flash |
| Validate a pattern, library, advice, best practice | "còn dùng được không", "review", "best practice", "có gì mới hơn", "outdated" | **fe-review** | Pro / Sonnet |

### ⚡ Performance & Loading

| When the request is about… | Signal keywords (EN + VI) | Skill | Model tier |
|---|---|---|---|
| Slow page, Core Web Vitals, bundle size, re-renders | "chậm", "LCP", "INP", "CLS", "TTFB", "bundle", "code splitting", "lazy load", "re-render", "re-renders", "render không cần thiết", "vô tội vạ", "bundle analyzer" | **fe-perf** | Pro |
| Loading state, skeleton UI, flicker on data load | "loading", "skeleton", "flicker", "layout shift khi load", "loading state" | **fe-skel** | Flash |
| Animation jank, GSAP, ScrollTrigger, canvas, frame drops | "giật", "jank", "GSAP", "ScrollTrigger", "animation lag", "60fps", "canvas", "WebGL" | **fe-motion** | Pro |

### 🎨 UI & Experience

| When the request is about… | Signal keywords (EN + VI) | Skill | Model tier |
|---|---|---|---|
| Spacing, layout, flex/grid, dark mode, responsive, uneven heights | "spacing", "layout", "padding", "dark mode", "responsive", "uneven", "height không đều", "card không đều", "không đều nhau", "alignment", "container query", "subgrid" | **fe-layout** | Flash |
| Color contrast, text readability, WCAG contrast ratio | "contrast", "tương phản", "màu", "đọc khó", "AA", "AAA", "readable" | **fe-contrast** | Flash + Script |
| UX review, brainstorm layouts, form UX, microcopy, empty states | "UX", "người dùng thấy gì", "copy lỗi", "empty state", "mockup", "brainstorm layout", "brainstorm", "đề xuất layout", "cải thiện flow", screenshot/mockup attached | **fe-ux** | Vision / Pro |
| Charts, dashboards, KPI tiles, data visualization | "chart", "biểu đồ", "dashboard", "recharts", "d3", "visualization", "sparkline", "KPI" | **fe-viz** | Pro |

### 🛠️ Build & Refactor

| When the request is about… | Signal keywords (EN + VI) | Skill | Model tier |
|---|---|---|---|
| New component, hook, store, form, modal, page, route | "tạo", "viết", "scaffold", "thêm mới", "build", "implement", "dashboard mới", "trang mới", "page mới", "tạo một", "component mới", "card component", "hook mới" | **fe-code** | Pro / Sonnet |
| Refactor, tech debt, code smells, split god component | "dọn", "refactor", "quá lớn", "tech debt", "god component", "dead code", "code smell", "tách component" | **fe-clean** | Pro / Sonnet |
| Fetch, API client, retry, pagination, cancel, waterfall, realtime | "fetch", "API", "SWR", "TanStack", "waterfall", "cancel", "retry", "WebSocket", "SSE", "optimistic", "abort", "duplicate request" | **fe-data** | Pro / Sonnet |

### 🌍 i18n & Accessibility

| When the request is about… | Signal keywords (EN + VI) | Skill | Model tier |
|---|---|---|---|
| Translations, dictionary keys, locale formatting, dates/tz | "i18n", "dịch", "bản dịch", "locale", "tiền tệ", "ngày tháng", "key dịch", "thiếu key", "tiếng Nhật", "tiếng Anh", "format tiền", "format ngày", "format tiền tệ", "thiếu cho tiếng", "time zone", "DST" | **fe-i18n** | Flash |
| Keyboard, focus trap, ARIA, screen reader, WCAG semantics | "tab", "focus", "aria", "screen reader", "a11y", "keyboard", "focus trap", "modal focus", "tab vào", "đọc sai", "thứ tự đọc", "không tab được", "screen reader đọc", "tab vào form", "accessible" | **fe-a11y** | Pro |

### 🔒 Security & Operations

| When the request is about… | Signal keywords (EN + VI) | Skill | Model tier |
|---|---|---|---|
| XSS, secrets, CSP, source maps, auth flow, token storage | "XSS", "secret", "CSP", "bảo mật", "token", "session", "source map", "key lộ", "API key lộ", "key bị lộ", "lộ trong bundle", "rủi ro bảo mật", "XSS có thể", "xảy ra không", "innerHTML", "dangerouslySetInnerHTML" | **fe-sec** | Pro (Critic) |
| Deploy, CI/CD, release, env vars, SEO, sitemap | "deploy", "CI", "release", "SEO", "sitemap", "Sentry", "analytics", "hreflang", "robots.txt", "structured data", "canonical" | **fe-ship** | Flash |
| Service worker, offline, PWA, install, stale cache | "offline", "service worker", "PWA", "cache strategy", "installable", "bản cũ sau deploy", "thấy bản cũ", "stale version", "deploy xong vẫn thấy cũ", "Background Sync" | **fe-pwa** | Pro |
| Micro-frontends, Module Federation, multi-team deploys | "micro-frontend", "Module Federation", "remote", "federated", "remote module", "remote không load", "load được remote", "không load được", "shared dependency" | **fe-mfe** | Pro |

### 🧪 Test & Learn

| When the request is about… | Signal keywords (EN + VI) | Skill | Model tier |
|---|---|---|---|
| Run tests, write tests, Playwright, E2E, unit, axe | "test", "kiểm tra", "Playwright", "E2E", "unit", "coverage", "viết E2E", "E2E test", "chạy test", "axe", "flow checkout test", "visual regression" | **fe-test** | Flash |
| Update skill set, remember pattern, learn from session | "learn", "nhớ lại", "cập nhật skill", "thêm vào skill set", "nhớ pattern", "nhớ cái này", "cho lần sau", "lần sau nhớ", "nhớ pattern này", "pattern này cho", "remember this" | **fe-learn** | Pro |

---

## 3. Compositional Tasks (Multi-Skill)

Many real requests need **2+ skills working together**. When Andy detects this:

### 3.1 Decompose → Route → Compose
```
"Refactor cái form login này + fix a11y luôn"
    → Sub-task 1: fe-clean (refactor structure)
    → Sub-task 2: fe-a11y (keyboard, focus, ARIA)
    → Execute in dependency order (clean first, then a11y on clean code)
    → Single verification pass at the end
```

### 3.2 Common Compositions

| Request pattern | Skill sequence | Why this order |
|---|---|---|
| "Build new feature + make it accessible" | fe-code → fe-a11y | Build structure first, then layer accessibility. |
| "Refactor + fix performance" | fe-clean → fe-perf | Clean code is easier to profile and optimize. |
| "New chart + make it responsive + accessible" | fe-viz → fe-layout → fe-a11y | Data encoding first, then layout, then screen reader. |
| "Security audit + fix + deploy" | fe-sec → fe-code → fe-ship | Find holes, patch, then release. |
| "Survey repo + plan refactor" | fe-recon → fe-clean (audit only) | Understand before proposing changes. |
| "Fix i18n + check contrast in both themes" | fe-i18n → fe-contrast | Content first, then visual verification. |

### 3.3 Rules for Compositions
- Present the decomposition to the user before starting. Example:
  > "Task này mình sẽ chia thành 2 bước: (1) fe-clean dọn cấu trúc component, (2) fe-a11y fix keyboard + ARIA. Được không?"
- Each sub-task follows its own skill's protocol (audit → proposal → execute → verify).
- Single combined verification at the end covers all sub-tasks.
- If unsure about ordering → ask the user which part to prioritize.

---

## 4. Artifact-Based Routing

| Attached artifact type | Primary skill | Andy's first action |
|---|---|---|
| **Figma screenshot / mockup** | fe-ux | Map regions to source files. Brainstorm or implement based on user intent. |
| **Bug screenshot / broken UI** | fe-layout or fe-a11y or fe-skel | Identify the symptom (spacing? missing state? focus?) → route accordingly. |
| **Lighthouse report** | fe-perf | Read scores → find largest bottleneck → propose fix in priority order. |
| **Bundle analyzer treemap** | fe-perf | Identify heaviest chunks → propose code-split or dependency swap. |
| **Error log / stack trace** | Depends on error | Read error → find source file → diagnose → propose fix. |
| **PDF spec / requirements** | Route by content | Summarize technical requirements → map to skill(s) → propose plan. |

---

## 5. Model Routing Strategy

### 5.1 Default Assignment
| Model tier | Characteristics | Use for |
|---|---|---|
| **Flash** | Fast, cheap, follows instructions well | Read-only tasks, small edits, running scripts, i18n, layout tweaks, test execution |
| **Pro / Sonnet** | Deep reasoning, large context | Architecture, security audit, complex refactor, performance analysis, new feature design |
| **Vision** | Image understanding | Mockup-to-code, UI comparison, screenshot-based debugging |
| **Critic (different provider)** | Cross-validation, reduces self-bias | Security review, architecture decisions, validating patterns (fe-review, fe-sec) |
| **Local (Ollama)** | Free, offline, private | File reading, code formatting, running local scripts, no reasoning needed |

### 5.2 Cascade Principle (for standalone agent builds)
When building Andy as a standalone agent with API access:
```
Try Flash first (fast + cheap)
    → If verification fails or output quality is insufficient
    → Escalate to Pro / Sonnet (retry the same sub-task)
    → If security-critical → also run through Critic model
```
> **Note:** When running inside an IDE (Antigravity/Cursor), model selection is controlled by the platform. This cascade applies to self-hosted agent builds.

---

## 6. Skill Loadout Principle

To keep context efficient as the skill library grows:

1. **Always in context:** This dispatcher (metadata + routing table only).
2. **Load on demand:** Full skill content (`SKILL.md` + references) only after routing decision is made.
3. **Never bulk-load:** Do not inject all 21 skill files at once.
4. **Scaling guideline:** Pure LLM keyword routing works well up to ~50 skills. Beyond that, add a retrieval layer (embedding search over skill descriptions).

---

## 7. Ambiguous Request Handling

When no skill matches clearly:
1. Summarize what Andy understood from the request.
2. Propose 2–3 candidate skills with a one-line reason each.
3. Ask the user to pick — do not guess.

Example:
> "Mình hiểu bạn muốn cải thiện cái form này. Có 2 hướng:
> - **fe-ux**: review luồng UX, copy lỗi, trải nghiệm người dùng.
> - **fe-code**: viết lại code form (validation, state, submit logic).
> Bạn muốn đi hướng nào trước?"
