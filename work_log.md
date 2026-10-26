# 📓 StarCi FE Skills — Work Log (Nhật ký công việc & Giữ mạch hội thoại)

> **Mục đích:** Lưu trữ toàn bộ lịch sử thay đổi, bối cảnh kỹ thuật, và các quyết định kiến trúc giữa các conversation.
> 
> **Quy tắc vàng (Bắt buộc cho Agent):**
> 1. **Khởi đầu phiên mới (Session Bootstrap):** LUÔN LUÔN đọc các mục mới nhất ở đầu file này để nắm bối cảnh: phiên trước đã làm gì, file nào đã sửa, việc gì còn dang dở.
> 2. **Kết thúc tác vụ (Session Wrap-up):** LUÔN LUÔN ghi thêm 1 entry mới lên ĐẦU danh sách nhật ký (Newest First) trước khi phản hồi hoàn tất cho người dùng.

---

## 📜 Danh sách nhật ký (Mới nhất ở trên cùng)

### [2026-10-26] v2.6.0 — new skill fe-viz (data visualization)
- **Objective:** Close the last open coverage item with a dedicated skill.
- **Files Changed:**
  - Created: [skills/fe-viz/SKILL.md](skills/fe-viz/SKILL.md) (goal, use/not-use, chart-by-question, encoding/colour, SVG/Canvas/WebGL, library table, data pipeline, a11y, responsive/theming/SSR, perf, Next.js + Vite/visx + canvas examples, 3 case studies, Done checklist, cross-links), `skills/fe-viz/references/learned.md`.
  - Modified: [fe-andy/SKILL.md](skills/fe-andy/SKILL.md) (description list, router row), [conventions.md](skills/fe-andy/references/conventions.md) (§5.2 item 3 note, §6 row), [routing.md](skills/fe-andy/evals/routing.md) R54–R56, fe-motion + fe-contrast descriptions (boundary to fe-viz), [README.md](README.md), [USAGE.md](USAGE.md), [GIOI-THIEU.md](GIOI-THIEU.md), [HUONG-DAN-SU-DUNG.md](HUONG-DAN-SU-DUNG.md) (§7.6), [audit/coverage-report.md](audit/coverage-report.md) §0, manifests 2.6.0.
- **Decisions:** Existing chart engines stay a protected zone; fe-viz designs/audits and only changes engines with explicit instruction. Library table is descriptive; the choice must pass fe-review per project.
- **Status & Next Steps:** Health check PASS. Code samples (Recharts/visx/canvas sketch) not compiled. Re-run the installer to link 21 skills; run routing evals R01–R56 in real tools.

### [2026-10-26] v2.5.0 — P2 partial-coverage closure
- **Objective:** Close the eight "partial" items from the Senior re-assessment.
- **Files Changed:**
  - Created: [fe-i18n/references/dates-time-zones.md](skills/fe-i18n/references/dates-time-zones.md), [fe-code/references/files.md](skills/fe-code/references/files.md), [fe-code/references/component-docs.md](skills/fe-code/references/component-docs.md), [fe-ship/references/monorepo-packages.md](skills/fe-ship/references/monorepo-packages.md), [fe-ship/references/incidents.md](skills/fe-ship/references/incidents.md).
  - Modified: [fe-ship/references/observability.md](skills/fe-ship/references/observability.md) §8 experimentation; [fe-code/references/component-api.md](skills/fe-code/references/component-api.md) §4 progressive enhancement, §5 Web Components; [fe-code/references/nextjs-routing.md](skills/fe-code/references/nextjs-routing.md) scroll note; descriptions + links in fe-i18n/fe-code/fe-ship SKILL.md; fe-test SKILL.md §3; [conventions.md](skills/fe-andy/references/conventions.md) §6 (6 rows); [routing.md](skills/fe-andy/evals/routing.md) R48–R53; [USAGE.md](USAGE.md); [HUONG-DAN-SU-DUNG.md](HUONG-DAN-SU-DUNG.md); [audit/coverage-report.md](audit/coverage-report.md) §0; manifests 2.5.0.
- **Decisions:** Storybook authored under fe-code (contract), executed under fe-test. Incidents and experimentation under fe-ship (operations). Temporal marked not Baseline (Safari) per secondary sources; Storybook package/import names marked "(verify)".
- **Status & Next Steps:** Health check PASS. Open: `fe-viz` candidate skill if charts are needed; run routing evals R01–R53 in real tools; confirm "(verify)" facts per project version with fe-review.

### [2026-10-26] v2.4.0 — Senior coverage re-assessment + P1 gap closure
- **Objective:** Re-assess coverage against a 95-item Senior Frontend map (scan script in session scratchpad), then close the five gaps that were missing entirely.
- **Files Changed:**
  - Created: [fe-data/references/api-contracts.md](skills/fe-data/references/api-contracts.md), [fe-layout/references/modern-css.md](skills/fe-layout/references/modern-css.md), [fe-motion/references/modern-motion.md](skills/fe-motion/references/modern-motion.md), [fe-code/references/nextjs-routing.md](skills/fe-code/references/nextjs-routing.md), [fe-andy/references/engineering-workflow.md](skills/fe-andy/references/engineering-workflow.md).
  - Modified: [fe-sec/references/auth-frontend.md](skills/fe-sec/references/auth-frontend.md) (§6 OAuth/OIDC+PKCE, SSO, passkeys/MFA; checklist), descriptions + links in fe-data/fe-layout/fe-motion/fe-code SKILL.md, [fe-perf/references/nextjs.md](skills/fe-perf/references/nextjs.md) (§6 proxy.ts note, §8 pointer), [fe-andy/SKILL.md](skills/fe-andy/SKILL.md), [conventions.md](skills/fe-andy/references/conventions.md) §6 (6 rows), [routing.md](skills/fe-andy/evals/routing.md) R42–R47, [USAGE.md](USAGE.md) (coverage statement, non-goals, rows, flow), [HUONG-DAN-SU-DUNG.md](HUONG-DAN-SU-DUNG.md) (prompt nhanh ×5, §13 row), [audit/coverage-report.md](audit/coverage-report.md) §0, manifests 2.4.0.
- **Decisions:** Next.js routing conventions live in fe-code (authoring) with fe-perf linking to them (cost only). Login protocols extend fe-sec's auth reference instead of a new skill. Version-sensitive claims (React `<ViewTransition>` stability — react.dev blog vs reference page conflict; Next.js 16 `proxy.ts`; anchor-positioning Baseline) are marked "(verify)".
- **Status & Next Steps:** Health check PASS. Remaining partial items (P2) listed in coverage-report §0: time zones, file handling, Storybook, monorepo/publishing, A/B, incident runbook, progressive enhancement, Web Components; P3: `fe-viz` candidate, run routing evals in real tools.

### [2026-10-26] v2.3.0 — fe-sec defensive hardening (source maps, sink audit, Electron/Tauri, UI is only affordance)
- **Objective:** Add four defensive controls: production source-map ban, pre-deploy static XSS sink audit + env secret quality, Electron/Tauri hardening reference, "UI is only affordance" principle across fe-sec/fe-data. Defensive content only; no offensive tooling.
- **Files Changed:**
  - Rewritten: [fe-sec/SKILL.md](skills/fe-sec/SKILL.md) (§2 four principles, §4 pre-deploy gate), [checklist.md](skills/fe-sec/references/checklist.md) (§1 extended grep, §8 sink audit + secret quality, §9 source maps), [auth-frontend.md](skills/fe-sec/references/auth-frontend.md) (§0 affordance anti-patterns).
  - Created: [desktop-apps.md](skills/fe-sec/references/desktop-apps.md), [scripts/check-build-output.mjs](skills/fe-sec/scripts/check-build-output.mjs), [scripts/check-env-secrets.mjs](skills/fe-sec/scripts/check-env-secrets.mjs).
  - Modified: [fe-ship/SKILL.md](skills/fe-ship/SKILL.md) (release checklist, security gates), [ci-cd.md](skills/fe-ship/references/ci-cd.md) (pipeline step 5, §6 source-map policy), [fe-data/SKILL.md](skills/fe-data/SKILL.md) + [resilience.md](skills/fe-data/references/resilience.md) (401/403 handling, affordance), [conventions.md](skills/fe-andy/references/conventions.md) §5.2–5.4, [fe-andy](skills/fe-andy/SKILL.md) router row, [routing.md](skills/fe-andy/evals/routing.md) R38–R41, [USAGE.md](USAGE.md) §3.1 security gates, [HUONG-DAN-SU-DUNG.md](HUONG-DAN-SU-DUNG.md) §11.1 prompts, plugin manifests 2.3.0.
- **Decisions:** Electron/Tauri guidance kept as a reference under fe-sec (not a new skill): same domain, one owner. Scripts report variable names and pattern names only, never values. Version-dependent option names (Electron fuses, Tauri v2 config keys, tracker plugin flags) are marked "(verify)".
- **Status & Next Steps:** Scripts tested on a synthetic fixture (see session). Health check PASS. Not tested against a real Electron/Tauri project. Routing evals R38–R41 not run.

### [2026-10-26] GIOI-THIEU.md + e-commerce case study rewritten as plan-only
- **Objective:** User asked for a guidance plan without sample code and a full Vietnamese introduction file.
- **Files Changed:** Created [GIOI-THIEU.md](GIOI-THIEU.md); rewrote [case-study-ecommerce.md](skills/fe-andy/references/case-study-ecommerce.md) (no code: goal, decisions, tasks, output, gate per phase); updated wording in [HUONG-DAN-SU-DUNG.md](HUONG-DAN-SU-DUNG.md) (link to intro, 17 → 20 skills in checks), [fe-andy](skills/fe-andy/SKILL.md), [USAGE.md](USAGE.md), [README.md](README.md).
- **Status & Next Steps:** Health check PASS. Root-level docs links checked by hand only (the script checks skills/ only).

### [2026-10-26] Static/dynamic playbooks + A–Z e-commerce case study
- **Objective:** Fill the gap of end-to-end guidance per project type; full worked example for an online shop.
- **Files Changed:** Created [playbooks.md](skills/fe-andy/references/playbooks.md), [case-study-ecommerce.md](skills/fe-andy/references/case-study-ecommerce.md); linked from [fe-andy](skills/fe-andy/SKILL.md) and [USAGE.md](USAGE.md); [HUONG-DAN-SU-DUNG.md](HUONG-DAN-SU-DUNG.md): 20 skills, prompts §11.3–11.5 (fe-pwa, fe-mfe, fe-review), §13 new rows, new Phần F (§18–21).
- **Status & Next Steps:** Health check PASS. Case-study code not compiled. APIs marked (verify) depend on Next.js version (revalidateTag signature, next/image priority, Cache Components, generateSitemaps).

### [2026-10-26] v2.2.0 — fe-pwa, fe-mfe, fe-review + TS/observability refinements + USAGE.md
- **Objective:** Close coverage gaps (PWA/offline, micro-frontends, knowledge reviewer); add Advanced TypeScript and Advanced Observability; write USAGE.md.
- **Files Changed:**
  - Created: [skills/fe-pwa/SKILL.md](skills/fe-pwa/SKILL.md), [skills/fe-mfe/SKILL.md](skills/fe-mfe/SKILL.md), [skills/fe-review/SKILL.md](skills/fe-review/SKILL.md) (+ `references/learned.md` each), [USAGE.md](USAGE.md)
  - Modified: [fe-code](skills/fe-code/SKILL.md) (§4 Advanced TypeScript, §5 validate with fe-review), [fe-ship](skills/fe-ship/SKILL.md) + [observability.md](skills/fe-ship/references/observability.md) (§7 Advanced observability), [fe-data](skills/fe-data/SKILL.md) (offline → fe-pwa, description boundary), [fe-andy](skills/fe-andy/SKILL.md) (router rows, fe-review rule), [conventions.md](skills/fe-andy/references/conventions.md) §6, [routing.md](skills/fe-andy/evals/routing.md) R31–R37, README, plugin manifests 2.2.0
- **Decisions:** New skills follow the requested 7-section structure inside the repo's SKILL.md format (frontmatter + minimum rules). The TypeScript section went into fe-code (authoring) rather than fe-clean. Version-sensitive facts (Serwist/Turbopack, nextjs-mf EOL, MF Vite options) carry "verify current docs" notes.
- **Status & Next Steps:** Health check PASS. Code samples not compiled or run. Routing evals R31–R37 not run. HUONG-DAN-SU-DUNG.md not yet updated for the 3 new skills. Re-run the installer so the new skill folders get linked.

### [2026-10-26] Fast-Path for micro-edits & Antigravity skills.json sync in installers
- **Objective:** Add a low-friction Fast-Path protocol for micro-edits (<= 5 lines) to conventions.md, sync Antigravity global `skills.json` automatically in installer scripts, and document in the user guide.
- **Files Changed:**
  - Modified: [skills/fe-andy/references/conventions.md](skills/fe-andy/references/conventions.md) (added §1.1 Fast-Path for micro-edits <= 5 lines).
  - Modified: [scripts/install-skills.ps1](scripts/install-skills.ps1), [scripts/install-skills.sh](scripts/install-skills.sh) (auto-sync `~/.gemini/config/skills.json` on install/uninstall).
  - Modified: [HUONG-DAN-SU-DUNG.md](HUONG-DAN-SU-DUNG.md) (documented Fast-Path in §5; added path-replacement notice for different user directories and generalized all script examples).
  - Modified: [skills/fe-andy/references/learned.md](skills/fe-andy/references/learned.md) (recorded Fast-Path and Antigravity skills.json sync lessons).
- **Status & Next Steps:** Health check PASS (0 errors, 0 warnings); install-skills.ps1 tested and verified; Antigravity global skills.json verified.

### [2026-10-26] fe-learn collect → check → plan → approve flow; per-skill prompt guide
- **Objective:** Detailed usage guide with standard prompts per skill; a collect/check/plan/approve flow for adding knowledge or new skills (kept under the name fe-learn per user).
- **Files Changed:** Modified [skills/fe-learn/SKILL.md](skills/fe-learn/SKILL.md) (modes A–D, 8 steps), created [skills/fe-learn/references/skill-template.md](skills/fe-learn/references/skill-template.md); rewrote [HUONG-DAN-SU-DUNG.md](HUONG-DAN-SU-DUNG.md); router row in fe-andy; routing evals R29–R30; check-skills.mjs now skips fenced code blocks.
- **Status & Next Steps:** Health check PASS; guide links and anchors checked. Next: try on a real project.

### [2026-10-26] Install for Codex + Antigravity, installer scripts, Vietnamese usage guide
- **Objective:** Install the skill set for Codex and Antigravity; write a detailed usage guide.
- **Files Changed:**
  - Created: [scripts/install-skills.ps1](scripts/install-skills.ps1), [scripts/install-skills.sh](scripts/install-skills.sh), [HUONG-DAN-SU-DUNG.md](HUONG-DAN-SU-DUNG.md)
  - Modified: [README.md](README.md) (install section), [skills/fe-andy/evals/routing.md](skills/fe-andy/evals/routing.md) (run results), fe-data / fe-skel descriptions (routing boundaries)
- **Decisions:** Junctions created in `~/.claude/skills`, `~/.agents/skills` (Codex), `~/.gemini/config/skills` and `~/.gemini/antigravity-cli/skills` (Antigravity). Codex and Antigravity are not installed on this machine yet, so their detection is unconfirmed.
- **Status & Next Steps:** Installer tested (install, idempotent re-run, uninstall, reinstall). Health check PASS. Next: install Codex/Antigravity and confirm they list the skills; try the skills on a real project.

### [2026-10-26] Audit + apply update plan + learning loop
- **Objective:** Audit skill coverage (UX/UI/perf/security/ops) and portability; apply the update plan; make every skill use add new lessons back into the skill set.
- **Files Changed:**
  - Created: [audit/coverage-report.md](audit/coverage-report.md), [audit/update-plan.md](audit/update-plan.md), [audit/install-guide.md](audit/install-guide.md)
  - Created: [skills/fe-andy/references/learning-loop.md](skills/fe-andy/references/learning-loop.md), [skills/fe-andy/references/project-profile.template.md](skills/fe-andy/references/project-profile.template.md), [skills/fe-andy/scripts/check-skills.mjs](skills/fe-andy/scripts/check-skills.mjs), `references/learned.md` in all 17 skills
  - Created: [skills/fe-ship/](skills/fe-ship/) (new skill) and reference files in fe-perf, fe-layout, fe-contrast, fe-data, fe-code, fe-ux, fe-a11y, fe-sec, fe-test; [skills/fe-perf/scripts/check-bundle-size.mjs](skills/fe-perf/scripts/check-bundle-size.mjs)
  - Renamed: `skills/merge` → [skills/fe-learn/](skills/fe-learn/); `ambient-rhythm-dnl.md` → `example-section-rhythm.md`; `dnl-config.json` → `example-config.json`
  - Modified: all SKILL.md files, conventions.md, routing evals, both scripts (contrast pass/fail + exit code; i18n arrays, placeholders, N locales), README, AGENTS.md, GEMINI.md, HOW-IT-LEARNS.md, plugin manifests (v2.1.0)
- **Decisions:** see audit/update-plan.md header (E1, E3–E7). Project-specific facts go to the target repo's `project-profile.md`, not the skill set.
- **Status & Next Steps:** Health check PASS (0 errors, 0 warnings); contrast and i18n scripts tested with sample inputs; bundle script not run against a real build. Open: decide StarCi folders (E2), run routing evals R01–R28 in each tool, create junctions per install guide.

### [2026-10-26 11:00] Milestone 4.4: Complete English Standardization & Rebranding to `fe-skill-andy`
- **Objective / Requirements:** Transition entire skill suite to English standard format, generalize across all frontend projects, complete short folder renames (`fe-*`), isolate legacy skills into `legacy/`, update plugin manifests, and prepare Git re-initialization for `https://github.com/Andy-doit/fe-skill-andy.git`.
- **Files Changed:**
  - Standardized English SSOT: [`skills/fe-andy/references/conventions.md`](file:///D:/Work/AI/starci-fe-skills/skills/fe-andy/references/conventions.md).
  - Renamed and translated Hub: [`skills/fe-andy/SKILL.md`](file:///D:/Work/AI/starci-fe-skills/skills/fe-andy/SKILL.md).
  - Translated all 15 skills to English: `fe-perf`, `fe-motion`, `fe-contrast`, `fe-layout`, `fe-skel`, `fe-clean`, `fe-code`, `fe-ux`, `fe-sec`, `fe-i18n`, `fe-test`, `fe-recon`, `fe-a11y`, `fe-data`, `merge`.
  - Created routing evaluation test suite: [`skills/fe-andy/evals/routing.md`](file:///D:/Work/AI/starci-fe-skills/skills/fe-andy/evals/routing.md) (15/15 unambiguous routing cases).
  - Isolated legacy skills to `legacy/`: `fe`, `skill-code-example-fe`, `starci-async`, `starci-fe-ux-brainstorm`.
  - Rebranded Root & Manifests: [`README.md`](file:///D:/Work/AI/starci-fe-skills/README.md) (`# fe-skill-andy`), [`AGENTS.md`](file:///D:/Work/AI/starci-fe-skills/AGENTS.md), [`GEMINI.md`](file:///D:/Work/AI/starci-fe-skills/GEMINI.md), [`.antigravity-plugin/plugin.json`](file:///D:/Work/AI/starci-fe-skills/.antigravity-plugin/plugin.json), [`.claude-plugin/plugin.json`](file:///D:/Work/AI/starci-fe-skills/.claude-plugin/plugin.json), [`.claude-plugin/marketplace.json`](file:///D:/Work/AI/starci-fe-skills/.claude-plugin/marketplace.json).
- **Architectural & Design Decisions:**
  - 100% English formatting ensures universal compatibility with AI code agents worldwide.
  - Complete decoupling from project-specific constraints: general-purpose engineering suite applicable to Next.js, React, Vite, SaaS dashboards, and editorial showcases.
- **Status & Next Steps:**
  - Ready for Git re-initialization and remote push to `https://github.com/Andy-doit/fe-skill-andy.git`.


### [2026-10-26 10:35] Mốc 4.3: Viết lại Description ranh giới rõ ràng, gộp AsyncContent & Tách Case Study DNL
- **Mục tiêu / Yêu cầu:** Sửa đổi mô tả frontmatter của toàn bộ skill hiện có, bổ sung "DÙNG KHI" và "KHÔNG DÙNG CHO" để triệt tiêu chồng chéo, gộp quy ước AsyncContent vào `fe-skel/references/`, tách case study DNL sang references và loại bỏ các đường dẫn cứng.
- **File thay đổi:**
  - Tạo mới: [`skills/starci-fe-skeleton-apply/references/async-content.md`](file:///D:/Work/AI/starci-fe-skills/skills/starci-fe-skeleton-apply/references/async-content.md) — Gộp toàn bộ quy ước AsyncContent 4 trạng thái từ `starci-async` cũ vào `fe-skel`.
  - Tạo mới: [`skills/starci-fe-layout-apply/references/ambient-rhythm-dnl.md`](file:///D:/Work/AI/starci-fe-skills/skills/starci-fe-layout-apply/references/ambient-rhythm-dnl.md) — Bóc tách case study Nhịp nền So le Two-Stage Ambient Rhythm & Centered Viewport 100vh từ dự án DNL Capital thành tài liệu tham chiếu trung lập.
  - Sửa đổi: [`skills/starci-fe-layout-apply/SKILL.md`](file:///D:/Work/AI/starci-fe-skills/skills/starci-fe-layout-apply/SKILL.md) — Viết lại description có ranh giới rõ ràng, loại bỏ đường dẫn cứng `D:/Repositories/starci-academy`.
  - Sửa đổi: [`skills/starci-fe-skeleton-apply/SKILL.md`](file:///D:/Work/AI/starci-fe-skills/skills/starci-fe-skeleton-apply/SKILL.md) — Viết lại description ranh giới CLS = 0, trỏ về `references/async-content.md`.
  - Sửa đổi: [`skills/starci-fe-cannon-audit/SKILL.md`](file:///D:/Work/AI/starci-fe-skills/skills/starci-fe-cannon-audit/SKILL.md) — Viết lại description chuyên biệt cho audit nợ kỹ thuật & refactor.
  - Sửa đổi: [`skills/starci-fe-cannon-apply/SKILL.md`](file:///D:/Work/AI/starci-fe-skills/skills/starci-fe-cannon-apply/SKILL.md) — Viết lại description chuyên biệt cho scaffolding tính năng mới.
  - Sửa đổi: [`skills/starci-fe-ux-apply/SKILL.md`](file:///D:/Work/AI/starci-fe-skills/skills/starci-fe-ux-apply/SKILL.md) — Hợp nhất 2 chế độ (Chế độ 1: Brainstorm & Mockup; Chế độ 2: Apply & Journaling), phân định rõ `tabular-nums`/`text-balance` thuộc UX, định dạng tiền tệ thuộc i18n.
- **Quyết định kiến trúc / UX:**
  - Ranh giới giữa các skill được thiết lập chuẩn xác 100%, triệt tiêu hoàn toàn khả năng agent gọi nhầm lệnh.
  - Toàn bộ nội dung đặc thù của DNL Capital đã được đưa về `references/`, thân các file SKILL.md giữ tính tổng quát dùng chung cho mọi dự án Next.js.
- **Trạng thái & Việc tiếp theo:**
  - Hoàn tất Mốc 4.3. Chuyển sang Mốc 4.4: Thực hiện commit git an toàn và dùng `git mv` đổi tên thư mục thành hệ thống `fe-*`, chuyển `fe/` và `skill-code-example-fe/` sang `legacy/` ngoài `skills/`.


### [2026-10-26 10:20] Mốc 4.2: Bổ sung toàn bộ Skill mới (fe-perf, fe-motion, fe-contrast, fe-sec, fe-i18n & Nhóm A)
- **Mục tiêu / Yêu cầu:** Tạo mới các kỹ năng chuyên biệt để mở rộng năng lực toàn diện cho hệ thống theo danh mục đã được phê duyệt.
- **File thay đổi:**
  - Tạo mới: [`skills/fe-perf/SKILL.md`](file:///D:/Work/AI/starci-fe-skills/skills/fe-perf/SKILL.md) — Tối ưu tải trang, Runtime, Web Vitals, Layout Thrashing (dẫn nguồn thực tế từ DNL: `content-visibility: auto`, `clearProps`, bỏ `scroll-smooth` Windows).
  - Tạo mới: [`skills/fe-motion/SKILL.md`](file:///D:/Work/AI/starci-fe-skills/skills/fe-motion/SKILL.md) — Khử lag GPU/CPU 60-120fps, Canvas Sullivan downsampling 0.5, loại bỏ scrub lag, cấm idle spin (dẫn nguồn chi tiết từ DNL).
  - Tạo mới: [`skills/fe-contrast/SKILL.md`](file:///D:/Work/AI/starci-fe-skills/skills/fe-contrast/SKILL.md), [`skills/fe-contrast/scripts/verify-contrast.mjs`](file:///D:/Work/AI/starci-fe-skills/skills/fe-contrast/scripts/verify-contrast.mjs) & [`skills/fe-contrast/references/dnl-config.json`](file:///D:/Work/AI/starci-fe-skills/skills/fe-contrast/references/dnl-config.json) — Kiểm định tương phản toán học WCAG 2.1 (đã chạy xác minh khớp 100% output với script gốc ở DNL).
  - Tạo mới: [`skills/fe-sec/SKILL.md`](file:///D:/Work/AI/starci-fe-skills/skills/fe-sec/SKILL.md) — Bảo mật frontend, XSS DOMPurify, secret leak, CSP, HttpOnly cookies.
  - Tạo mới: [`skills/fe-i18n/SKILL.md`](file:///D:/Work/AI/starci-fe-skills/skills/fe-i18n/SKILL.md) & [`skills/fe-i18n/scripts/check-i18n.mjs`](file:///D:/Work/AI/starci-fe-skills/skills/fe-i18n/scripts/check-i18n.mjs) — Đồng bộ song ngữ next-intl, kiểm tra parity tự động bằng Node built-in, định dạng số/tiền tệ theo locale.
  - Tạo mới 4 skill Nhóm A:
    - [`skills/fe-test/SKILL.md`](file:///D:/Work/AI/starci-fe-skills/skills/fe-test/SKILL.md) — Phân cấp 3 mức kiểm thử (Lint -> Build -> E2E/Axe).
    - [`skills/fe-recon/SKILL.md`](file:///D:/Work/AI/starci-fe-skills/skills/fe-recon/SKILL.md) — Khảo sát dự án lạ ở chế độ chỉ đọc với Recon template chuẩn.
    - [`skills/fe-a11y/SKILL.md`](file:///D:/Work/AI/starci-fe-skills/skills/fe-a11y/SKILL.md) — Bàn phím, focus trap, ARIA, screen reader (phối hợp fe-contrast, không trùng lặp).
    - [`skills/fe-data/SKILL.md`](file:///D:/Work/AI/starci-fe-skills/skills/fe-data/SKILL.md) — Quản lý server state cache, AbortController, chống request waterfall.
- **Quyết định kiến trúc / UX:**
  - `fe-perf` và `fe-motion` trích dẫn trực tiếp từ các file source code thực tế của DNL Capital.
  - Script tương phản được tổng quát hóa qua JSON config, đã test pass 108/108 checks khớp tuyệt đối bản gốc.
  - Script i18n dùng 100% Node.js built-in không phụ thuộc thư viện ngoài.
- **Trạng thái & Việc tiếp theo:**
  - Hoàn tất Mốc 4.2. Chuyển sang Mốc 4.3: Tách case study DNL sang references, gộp `starci-async` vào `fe-skel/references/`, sửa đường dẫn cứng `C:\Repositories\starci-academy` và viết lại description ranh giới rõ ràng cho các skill hiện có.


### [2026-10-26 10:10] Mốc 4.1: Thiết lập Quy ước chung toàn hệ thống (`conventions.md`)
- **Mục tiêu / Yêu cầu:** Thiết lập tài liệu quy ước cốt lõi dùng chung cho toàn bộ kỹ năng `fe-andy-skill`, làm rõ ranh giới audit/apply, nguyên tắc đo trước khi tối ưu, bảo vệ vùng nhạy cảm và quy chuẩn work log.
- **File thay đổi:**
  - Tạo mới: [`skills/starci-fe-skills/references/conventions.md`](file:///D:/Work/AI/starci-fe-skills/skills/starci-fe-skills/references/conventions.md) — SSOT quy ước chung của hệ sinh thái kỹ năng.
- **Quyết định kiến trúc / UX:**
  - Xác lập nguyên tắc: Tách skill khi CÔNG VIỆC khác nhau, không tách chỉ vì chế độ audit/apply khác nhau (`fe-clean` refactor code smell tách riêng với `fe-code` scaffolding tính năng mới).
  - Chuẩn hóa quy trình 5 bước bắt buộc (Audit chỉ đọc ➔ Báo cáo & Bóc tách ➔ Chờ duyệt ➔ Sửa ➔ Xác minh).
  - Phân định ranh giới: Định dạng số/tiền tệ theo locale thuộc `fe-i18n`; `tabular-nums` và `text-balance` thuộc `fe-ux`; `AsyncContent` thuộc `fe-skel`.
  - Thiết lập danh sách Vùng bảo vệ (Protected Zones: trang tài chính, chart, luồng auth/giao dịch).
- **Trạng thái & Việc tiếp theo:**
  - Hoàn tất Mốc 4.1. Tiến hành Mốc 4.2: Tạo các skill mới (`fe-perf`, `fe-motion`, `fe-contrast`, `fe-sec`, `fe-i18n` và 4 skill Nhóm A `fe-test`, `fe-recon`, `fe-a11y`, `fe-data`).


### [2026-10-23 13:35] Thiết lập Quy trình khi nhận hình ảnh (Image-to-Prompt Approval Protocol)
- **Mục tiêu / Yêu cầu:** Khi người dùng gửi hình ảnh (screenshot/mockup) và yêu cầu sửa giao diện theo ảnh, agent tuyệt đối không được sửa code ngay, mà phải bóc tách thành bản đề xuất / prompt chi tiết gửi người dùng duyệt trước, chỉ sửa code khi được duyệt.
- **File thay đổi:**
  - Cập nhật: [`AGENTS.md`](file:///d:/Work/AI/starci-fe-skills/AGENTS.md) & [`GEMINI.md`](file:///d:/Work/AI/starci-fe-skills/GEMINI.md) — Bổ sung phần "QUY TRÌNH KHI NHẬN HÌNH ẢNH (IMAGE-TO-PROMPT APPROVAL PROTOCOL)" vào tập luật bắt buộc.
  - Cập nhật: [`skills/starci-fe-skills/SKILL.md`](file:///d:/Work/AI/starci-fe-skills/skills/starci-fe-skills/SKILL.md) — Thêm quy trình xử lý ảnh vào Master Hub.
  - Cập nhật: [`skills/fe/SKILL.md`](file:///d:/Work/AI/starci-fe-skills/skills/fe/SKILL.md) — Đồng bộ điều kiện kiểm tra ảnh ở Bước 1 trong workflow.
  - Cập nhật: [`skills/starci-fe-layout-apply/SKILL.md`](file:///d:/Work/AI/starci-fe-skills/skills/starci-fe-layout-apply/SKILL.md) — Thêm bước soi ảnh và xuất prompt đề xuất duyệt trước khi sửa code.
- **Quyết định kiến trúc / UX:**
  - Ngăn chặn hành vi tự ý sửa code bừa bãi khi nhận diện ảnh. Đảm bảo 100% sự đồng thuận giữa người dùng và AI trước khi đụng vào source code.
  - Bản đề xuất phải bao gồm: Soi pixel từ ảnh (lưới 4px, container cap, equal height, font-size box), đối chiếu hiện trạng, class thay thế cụ thể, và câu hỏi làm rõ.
- **Trạng thái & Việc tiếp theo:**
  - Hoàn tất. Kể từ bây giờ, bất cứ khi nào người dùng upload hoặc gửi ảnh yêu cầu sửa UI, agent sẽ tự động dừng lại, bóc tách và viết prompt duyệt trước.

---

### [2026-10-23 13:33] Thiết lập Luật Giao diện: Căn chỉnh từng pixel & Soi kỹ (CẤM làm "đều đều")
- **Mục tiêu / Yêu cầu:** Bổ sung quy chuẩn thiết kế khắt khe: mọi skill làm giao diện phải căn đều đặn, đúng từng pixel trên lưới 4px, soi kỹ các đường gióng, cấm làm kiểu áng chừng hoặc phết "đều đều" cẩu thả.
- **File thay đổi:**
  - Cập nhật: [`AGENTS.md`](file:///d:/Work/AI/starci-fe-skills/AGENTS.md) & [`GEMINI.md`](file:///d:/Work/AI/starci-fe-skills/GEMINI.md) — Bổ sung mục "LUẬT GIAO DIỆN: CĂN CHỈNH TỪNG PIXEL & SOI KỸ (CẤM LÀM ĐỀU ĐỀU)".
  - Cập nhật: [`skills/starci-fe-layout-apply/SKILL.md`](file:///d:/Work/AI/starci-fe-skills/skills/starci-fe-layout-apply/SKILL.md) — Nâng cấp toàn diện bộ quy tắc căn chỉnh layout: thứ bậc khoảng cách con < cha, cân bằng chiều cao hàng thẻ (equal height + footer pinning), căn trục quang học icon-text, bán kính đồng tâm, container cap sharing.
  - Cập nhật: [`skills/starci-fe-skeleton-apply/SKILL.md`](file:///d:/Work/AI/starci-fe-skills/skills/starci-fe-skeleton-apply/SKILL.md) — Quy chuẩn skeleton khớp 1:1 pixel với UI thật, font-size box matching, triệt tiêu giật khung hình (CLS = 0).
  - Cập nhật: [`skills/fe/SKILL.md`](file:///d:/Work/AI/starci-fe-skills/skills/fe/SKILL.md) — Đưa luật căn chỉnh pixel và cấm làm đều đều vào danh mục MUST.
  - Cập nhật: [`skills/starci-fe-ux-apply/SKILL.md`](file:///d:/Work/AI/starci-fe-skills/skills/starci-fe-ux-apply/SKILL.md) & [`skills/starci-fe-cannon-apply/SKILL.md`](file:///d:/Work/AI/starci-fe-skills/skills/starci-fe-cannon-apply/SKILL.md) — Đồng bộ yêu cầu pixel-precision vào quá trình dựng code.
  - Cập nhật: [`skills/starci-fe-skills/SKILL.md`](file:///d:/Work/AI/starci-fe-skills/skills/starci-fe-skills/SKILL.md) — Bổ sung mục luật căn chỉnh từng pixel vào Master Hub.
- **Quyết định kiến trúc / UX:**
  - Xác lập công thức thứ bậc khoảng cách bắt buộc: `gap-0 (title-desc) < gap-2 (icon-label) < gap-3 (trong card) < px-4 py-3 (card padding) < gap-6 (giữa các card/section)`.
  - Cấm hoàn toàn việc phết cùng một giá trị `gap-4`/`p-4` bừa bãi cho mọi cấp; cấm các giá trị lẻ lệch lưới 4px (`gap-1.5/5`, `p-5/8`).
  - Ép buộc thẻ trong grid/row phải có `h-full flex flex-col` và footer neo dính đáy thẳng hàng (`flex-1`, `mt-auto`).
- **Trạng thái & Việc tiếp theo:**
  - Hoàn tất. Toàn bộ các skill liên quan đến UI đã được trang bị bộ lọc soi pixel nghiêm ngặt.

---

### [2026-10-23 13:25] Thiết lập hệ thống Work Log & Session Continuity tự động
- **Mục tiêu / Yêu cầu:** Thiết lập cơ chế tự động ghi `work_log.md` sau mỗi tác vụ và tự động đọc lại ở đầu mỗi conversation mới để duy trì mạch làm việc, tối ưu hóa bộ skill thành tài sản cá nhân.
- **File thay đổi:**
  - Tạo mới: [`work_log.md`](file:///d:/Work/AI/starci-fe-skills/work_log.md) — SSOT nhật ký phiên làm việc.
  - Tạo mới: [`AGENTS.md`](file:///d:/Work/AI/starci-fe-skills/AGENTS.md) — Rule tự động kích hoạt ở mọi conversation: bắt buộc đọc `work_log.md` khi bắt đầu và ghi `work_log.md` khi kết thúc.
  - Tạo mới: [`GEMINI.md`](file:///d:/Work/AI/starci-fe-skills/GEMINI.md) — Đồng bộ rule cho Antigravity/Gemini.
  - Cập nhật: [`skills/starci-fe-skills/SKILL.md`](file:///d:/Work/AI/starci-fe-skills/skills/starci-fe-skills/SKILL.md) — Bổ sung Work Log Protocol vào master hub.
  - Cập nhật: [`skills/fe/SKILL.md`](file:///d:/Work/AI/starci-fe-skills/skills/fe/SKILL.md) — Bổ sung đọc/ghi work_log vào quy trình chuẩn.
  - Cập nhật: [`skills/starci-fe-ux-apply/SKILL.md`](file:///d:/Work/AI/starci-fe-skills/skills/starci-fe-ux-apply/SKILL.md) — Ghi work_log ở bước close out.
  - Cập nhật: [`skills/starci-fe-cannon-apply/SKILL.md`](file:///d:/Work/AI/starci-fe-skills/skills/starci-fe-cannon-apply/SKILL.md) — Thêm checklist ghi work_log trước khi hoàn thành.
  - Cập nhật: [`skills/merge/SKILL.md`](file:///d:/Work/AI/starci-fe-skills/skills/merge/SKILL.md) — Thêm ghi work_log sau khi merge.
  - Cập nhật: [`HOW-IT-LEARNS.md`](file:///d:/Work/AI/starci-fe-skills/HOW-IT-LEARNS.md) & [`README.md`](file:///d:/Work/AI/starci-fe-skills/README.md).
- **Quyết định kiến trúc:**
  - Áp dụng cấu trúc **Newest First** để agent chỉ cần đọc 40–60 dòng đầu là nắm trọn bối cảnh phiên gần nhất, tiết kiệm token context.
  - Kết hợp tầng Rule luôn bật (`AGENTS.md`) với tầng Skill gọi qua `/` để đảm bảo tính tự động tuyệt đối: conversation mới tự động đọc, kết thúc tác vụ tự động ghi.
- **Trạng thái & Việc tiếp theo:**
  - Hệ thống ghi chép và hồi tưởng phiên đã sẵn sàng.
  - Người dùng có thể bắt đầu sử dụng các lệnh `/fe`, `/starci-fe-ux-brainstorm`, `/starci-fe-ux-apply`... và agent sẽ duy trì nhật ký liên tục.

---

### [2026-10-23 13:20] Custom hóa bộ StarCi FE Skills cho Antigravity (Slash Command `/`)
- **Mục tiêu / Yêu cầu:** Tích hợp bộ skill của repo vào Antigravity để có thể gõ `/` là hiện danh sách skill (`/fe`, `/starci-fe-ux-brainstorm`, `/starci-fe-layout-apply`, ...).
- **File thay đổi:**
  - Tạo mới: [`.agents/skills.json`](file:///d:/Work/AI/starci-fe-skills/.agents/skills.json) — Đăng ký thư mục `skills/` trong workspace.
  - Tạo mới: [`.antigravity-plugin/plugin.json`](file:///d:/Work/AI/starci-fe-skills/.antigravity-plugin/plugin.json) — Khai báo manifest Antigravity plugin.
  - Tạo mới: [`C:/Users/Endy/.gemini/config/skills.json`](file:///C:/Users/Endy/.gemini/config/skills.json) — Đăng ký toàn cục để gõ `/` ở bất kỳ repo nào cũng nhận skill.
  - Tạo mới: [`skills/starci-fe-skills/SKILL.md`](file:///d:/Work/AI/starci-fe-skills/skills/starci-fe-skills/SKILL.md) — Master skill đóng vai trò hub điều hướng cho toàn bộ hệ thống.
  - Cập nhật: [`README.md`](file:///d:/Work/AI/starci-fe-skills/README.md) — Bổ sung hướng dẫn sử dụng trên Antigravity.
- **Quyết định kiến trúc:**
  - Dùng `skills.json` thay vì di chuyển thư mục `skills/` để giữ trọn vẹn khả năng tương thích ngược với Claude Code plugin (`.claude-plugin/`) và bảo toàn các đường dẫn tương đối (`../../decision`, `../../cannon`).
- **Trạng thái & Việc tiếp theo:**
  - Hoàn thành. Slash commands đã được nạp vào Antigravity.
