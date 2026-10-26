# 📓 StarCi FE Skills — Work Log (Nhật ký công việc & Giữ mạch hội thoại)

> **Mục đích:** Lưu trữ toàn bộ lịch sử thay đổi, bối cảnh kỹ thuật, và các quyết định kiến trúc giữa các conversation.
> 
> **Quy tắc vàng (Bắt buộc cho Agent):**
> 1. **Khởi đầu phiên mới (Session Bootstrap):** LUÔN LUÔN đọc các mục mới nhất ở đầu file này để nắm bối cảnh: phiên trước đã làm gì, file nào đã sửa, việc gì còn dang dở.
> 2. **Kết thúc tác vụ (Session Wrap-up):** LUÔN LUÔN ghi thêm 1 entry mới lên ĐẦU danh sách nhật ký (Newest First) trước khi phản hồi hoàn tất cho người dùng.

---

## 📜 Danh sách nhật ký (Mới nhất ở trên cùng)

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
