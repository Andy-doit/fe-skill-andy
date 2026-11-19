<div align="center">

# ⚡ fe-skill-andy

### The Autonomous Frontend Engineering Harness for AI Coding Agents
**Claude Code · Antigravity · Gemini · Codex**

[![Next.js 15+](https://img.shields.io/badge/Next.js-App_Router-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19-149eca?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict_Zero_Any-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![WCAG 2.2 AA](https://img.shields.io/badge/WCAG-2.2_AA_Compliant-22c55e?style=for-the-badge&logo=w3c&logoColor=white)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![Zero Loosening](https://img.shields.io/badge/Gates-Zero_Loosening-dc2626?style=for-the-badge&logo=checkmarx&logoColor=white)](#-kỷ-luật-zero-loosening-chặn-đứng-lách-luật)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

<br/>

> **"AI agents write code fast and check it badly. Andy gives every agent a strict quality harness: Machine checks on clean code, zero loose suppressions, 100% production-ready."**
> 
> *— The agent that does the work NEVER judges it.*

</div>

---

## 🧭 Giới thiệu: Andy là ai?

**Andy** là nhân cách AI Agent cấp cao (**Senior Frontend Architect & Autonomous Pair Programmer**), được đóng gói thành một hệ thống **Harness & Kỹ năng Frontend hoàn chỉnh (21 skills)**.

Andy không phải là một con bot gõ prompt dạo hay tạo code vu vơ. Andy hoạt động như một Technical Lead ngồi cạnh bạn:
- 💬 **Giao tiếp tự nhiên, thực chiến:** Tiếng Việt mặc định (xưng *"mình"*, gọi *"bạn"*), phong cách đồng nghiệp thân thiện nhưng cực kỳ khắt khe về chất lượng code.
- 📐 **Kiến trúc phân tầng rành mạch:** 4-Layer Architecture (`Tokens → Primitives → Blocks → Features`), mô hình `Connected/Pure Twin` và chuẩn `DataSlot<T>` triệt tiêu 100% hiện tượng giật giao diện (CLS).
- 🔬 **Dựa trên bằng chứng máy đo (Evidence-Based):** Tuyệt đối không bao giờ nói *"chắc là được"*, *"should work"*, hay *"có thể"*. Mọi tác vụ hoàn thành đều phải chứng minh bằng output thật từ terminal (test, lint, type-check, build).
- 🧠 **Trí nhớ liên tục (Continuous Memory):** Tự động đọc và ghi nhật ký phiên làm việc ([work_log.md](./work_log.md)), nắm bắt bối cảnh dự án ([project-profile.md](./skills/fe-andy/references/project-profile.template.md)) và tự nâng cấp bộ kỹ năng của chính mình thông qua learning loop.

---

## 🏛️ Triết lý Kiến trúc Cốt lõi

```
[Layer 1: Tokens]      Màu sắc, Typography, Spacing scale, Bán kính bo góc
        ↓
[Layer 2: Primitives]  Component cơ sở (Button, Input, Dialog...) theo Control-Height Ramp
        ↓
[Layer 3: Blocks]      Widget tái sử dụng: Pure Base ({ shape?, props, on? }) + Connected Twin
        ↓
[Layer 4: Features]    Điều phối dữ liệu, ghép Blocks vào Route — Tuyệt đối không tự style
```

1. **Connected / Pure Twin Pattern:** Tách đôi rõ ràng:
   - `component.tsx` (`XBase`): Nhận atoms thuần túy, render fixture trong Storybook độc lập, exhaust `switch` theo `XShape` nghiệp vụ.
   - `index.tsx` (`X`): Kết nối SWR/React Query, translations, event handlers và truyền props xuống.
2. **DataSlot<T> + Skeleton Parity:** 4 trạng thái tải dữ liệu chuẩn chỉ: `Loading → Error/Forbidden → Empty → Content`. Skeleton và dữ liệu thật dùng chung một cây component với prop `isLoading=true`, chống giật layout 100%.
3. **Control-Height Ramp & Touch Floor:** Chuẩn 4 bậc chiều cao (`sm`, `md`, `lg`, `control`). Touch floor $\ge 44$px bằng invisible extension (`:after`), không làm phình nút.
4. **Canvas-First Order:** Thứ tự phát triển: **Canvas/Mockup → Code → Verification**. Thiết kế dựa trên 2 nguồn thực tế: Backend operations thực trong code + Design System tokens.
5. **Proof Lenses:** Bộ thấu kính kiểm thử giao diện phân tách rõ: **5 Gating Lenses** (A11Y, Contrast, Focus, Motion, Render Truth - 100% binary pass) và **2 Scored Lenses** (Taste, UX).

---

## 🛡️ Kỷ luật Zero-Loosening (Chặn đứng lách luật)

Các coding agent thông thường khi gặp lỗi TypeScript hoặc Linter thường có thói quen xấu: tự tiện chèn comment để "bịt miệng" compiler. **Andy cấm tuyệt đối hành vi này!**

Bộ kiểm tra tự động [check-loosening.mjs](./skills/fe-andy/scripts/check-loosening.mjs) quét sạch 9 loại lách luật:
- ❌ `eslint-disable`, `stylelint-disable` (trốn linter)
- ❌ `@ts-ignore`, `@ts-nocheck`, `@ts-expect-error` (trốn TypeScript)
- ❌ `// NOSONAR` (trốn phân tích tĩnh)
- ❌ `xit`, `xdescribe`, `it.skip`, `test.skip` (giấu test lỗi)
- ❌ `it.only`, `describe.only`, `test.only` (làm gãy CI suite)
- ❌ `|| true` (đoản mạch logic điều kiện)

```bash
# Quét toàn bộ codebase tìm vi phạm nới lỏng cổng chất lượng
node skills/fe-andy/scripts/check-loosening.mjs
```

---

## 🧩 Bản đồ 21 Kỹ năng (Autonomous Skills)

Andy tự động nhận diện intent của bạn để điều hướng vào đúng skill chuyên trách mà không cần bạn phải gõ lệnh slash command:

| Nhóm | Kỹ năng | Vai trò & Chuyên môn |
|---|---|---|
| **🧭 Khảo sát & Điều hướng** | [`fe-recon`](./skills/fe-recon/) | Khảo sát tổng quan codebase lạ ở chế độ Read-Only; lập bản đồ rủi ro & domain concepts |
| | [`fe-andy`](./skills/fe-andy/) | Hub điều hướng trung tâm, quy ước chung (`conventions.md`), quản lý template hồ sơ |
| **🧹 Kiến trúc & Dọn dẹp** | [`fe-clean`](./skills/fe-clean/) | Phẫu thuật refactor code cũ, xử lý God components, diệt code smell, xóa dead code |
| | [`fe-code`](./skills/fe-code/) | Dựng code mới chuẩn 4 tầng, scaffolding components, custom hooks, Server Actions |
| **🎨 Trải nghiệm & Giao diện** | [`fe-ux`](./skills/fe-ux/) | Brainstorm layout Canvas-First, UX copy, heuristics, thẩm định Proof Lenses |
| | [`fe-layout`](./skills/fe-layout/) | Spacing scale, Control-Height Ramp, Touch floor 44px, Container queries, Modern CSS |
| | [`fe-skel`](./skills/fe-skel/) | 4 trạng thái async, công thức `SlotView`, Skeleton Parity chống giật CLS |
| | [`fe-motion`](./skills/fe-motion/) | Tối ưu animation 60fps mượt mà, View Transitions, GSAP, triệt tiêu hao pin khi idle |
| | [`fe-viz`](./skills/fe-viz/) | Thiết kế biểu đồ (Recharts/visx/D3), KPI tiles, sparklines, dashboard responsive & a11y |
| **🌐 Dữ liệu & Đa ngôn ngữ** | [`fe-data`](./skills/fe-data/) | API contracts (OpenAPI/GraphQL/tRPC), SWR/TanStack, retry, optimistic updates, offline |
| | [`fe-i18n`](./skills/fe-i18n/) | Quốc tế hóa chuẩn xác: Intl format, kiểm tra lệch dictionary, timezone an toàn |
| **♿ Tiếp cận & Tương phản** | [`fe-a11y`](./skills/fe-a11y/) | Chuẩn WCAG 2.2 AA, điều hướng bàn phím, focus trap modal, screen reader |
| | [`fe-contrast`](./skills/fe-contrast/) | Đo đạc tương phản màu độc lập (APCA / WCAG 4.5:1 chữ, 3:1 UI) cho mọi theme |
| **🔒 Bảo mật & Chất lượng** | [`fe-sec`](./skills/fe-sec/) | Quét XSS sinks, chặn lộ API Key (`NEXT_PUBLIC_*`), HttpOnly auth, CSP headers |
| | [`fe-test`](./skills/fe-test/) | Chiến lược kiểm thử theo tầng rủi ro: Unit, Component, Playwright E2E, axe scans |
| | [`fe-review`](./skills/fe-review/) | Thẩm định các mẫu code, thư viện và lời khuyên xem có còn là Best Practice hiện nay không |
| | [`fe-learn`](./skills/fe-learn/) | Bộ máy tự học: đúc kết bài học thực chiến vào `learned.md`, chạy health check |
| **🚀 Nền tảng & Vận hành** | [`fe-ship`](./skills/fe-ship/) | CI/CD pipeline, Docker frontend, Sentry observability, SEO metadata, release gates |
| | [`fe-pwa`](./skills/fe-pwa/) | Progressive Web App: Service worker lifecycle, Workbox caching, offline outbox sync |
| | [`fe-mfe`](./skills/fe-mfe/) | Micro-Frontends: Module Federation, Multi-Zones, quản lý shared dependencies |

---

## ⚡ Hai Luồng Tác Vụ Thực Chiến

### 1. Khi Bảo Trì / Refactor Code Có Sẵn (Maintain & Fix Bug)
Tuân thủ nguyên tắc **Boy Scout Rule** và quy trình **Audit-First**:
1. **Khảo sát:** `fe-recon` đọc `work_log.md`, `project-profile.md` và quét các vùng rủi ro.
2. **Bóc tách lỗi:** Kích hoạt skill chuyên biệt (`fe-clean` cho nợ kỹ thuật, `fe-perf` cho trang chậm, `fe-a11y` cho kẹt phím).
3. **Bảng Proposal:** Nếu sửa $> 5$ dòng hoặc đụng logic, Andy dừng lại xuất bảng đề xuất (Impact/Effort/Risk) và chờ bạn gõ *"chốt"* mới làm. *(Ngoại lệ: Fast-Path cho chỉnh sửa cosmetic $\le 5$ dòng)*.
4. **Sửa phẫu thuật:** Áp dụng diff tối thiểu, cấm tiệt nới lỏng linter.
5. **Xác minh thực tế:** Chạy `check-loosening.mjs`, linter, type-check, test và báo cáo kết quả thật.

### 2. Khi Khởi Tạo Dự Án Mới (Greenfield Project)
1. **Thiết lập:** Dựng `project-profile.md` + Domain Concept Catalog (`docs/concepts/`).
2. **Canvas-First (`fe-ux`):** Thiết kế giao diện từ API thật và Design System trước khi gõ code.
3. **Dựng tầng 1 & 2 (`fe-layout`):** Khởi tạo Tokens & Primitives theo Control-Height Ramp + Touch floor 44px.
4. **Dựng tầng 3 (`fe-code` + `fe-skel` + `fe-data`):** Chuẩn hóa Connected/Pure Twin + `DataSlot<T>` + Skeleton Parity.
5. **Dựng tầng 4 (`fe-code` + `fe-sec`):** Ghép route, kiểm tra route guard và CSP.
6. **Thẩm định & Phát hành:** Chạy 5 Gating Proof Lenses, setup CI/CD release với `fe-ship`.

---

## 📦 Cài Đặt & Sử Dụng (1-Click Setup)

### Cài đặt liên kết toàn cục (Symlink / Junction)

```powershell
# Windows (PowerShell với quyền thông thường)
powershell -ExecutionPolicy Bypass -File scripts\install-skills.ps1
```

```bash
# macOS / Linux
sh scripts/install-skills.sh
```

### Sử dụng qua Claude Code Plugin
```bash
/plugin marketplace add Andy-doit/fe-skill-andy
/plugin install fe-skill-andy@fe-skill-andy
```

### Sử dụng trên Antigravity / Gemini CLI
Bộ luật của Andy đã được biên dịch sẵn tại [.antigravity-plugin/rules/AGENTS.md](./.antigravity-plugin/rules/AGENTS.md). Khi plugin được kích hoạt, Antigravity tự động nhận diện Andy ở mọi workspace.

---

## 🩺 Kiểm Tra Sức Khỏe Bộ Kỹ Năng (Health Check)

```bash
# Chạy script kiểm tra tính toàn vẹn của 21 skills và các liên kết chéo
node skills/fe-andy/scripts/check-skills.mjs

# Chạy bộ đánh giá định tuyến tự động (Routing Evals)
node andy-evals.mjs
```

---

## 📜 Giấy phép & Tác giả

Phát triển và duy trì bởi **[Andy](https://github.com/Andy-doit)**.

Phát hành dưới giấy phép [MIT License](./LICENSE) — Tự do sử dụng, mở rộng và tùy biến cho mọi dự án thương mại và cá nhân.
