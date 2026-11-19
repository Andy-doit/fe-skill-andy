<div align="center">

```
  █████╗ ███╗   ██╗██████╗ ██╗   ██╗
 ██╔══██╗████╗  ██║██╔══██╗╚██╗ ██╔╝
 ███████║██╔██╗ ██║██║  ██║ ╚████╔╝ 
 ██╔══██║██║╚██╗██║██║  ██║  ╚██╔╝  
 ██║  ██║██║ ╚████║██████╔╝   ██║   
 ╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝    ╚═╝   
```

### ⚡ AUTONOMOUS FRONTEND ARCHITECT & QUALITY HARNESS
**Biến mọi AI Coding Agent thành Senior Frontend Engineer thực thụ.**

[Tổng quan](#-tổng-quan) • [So sánh](#-sự-khác-biệt) • [Kiến trúc 4 Tầng](#-kiến-trúc-4-tầng) • [21 Kỹ năng](#-bản-đồ-21-kỹ-năng) • [Kỷ luật Cổng](#-kỷ-luật-zero-loosening) • [Cài đặt](#-cài-đặt-nhanh)

<br/>

<!-- Badges: Core Engine -->
[![Next.js 15+](https://img.shields.io/badge/Next.js_15+-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React_19-149eca?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Tailwind v4](https://img.shields.io/badge/Tailwind_v4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict_Zero_Any-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)

<!-- Badges: Quality & Compliance -->
[![WCAG 2.2 AA](https://img.shields.io/badge/WCAG_2.2-AA_Compliant-22c55e?style=for-the-badge&logo=w3c&logoColor=white)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![Zero Loosening](https://img.shields.io/badge/Gates-Zero_Loosening-dc2626?style=for-the-badge&logo=checkmarx&logoColor=white)](#-kỷ-luật-zero-loosening)
[![Claude Code Plugin](https://img.shields.io/badge/Claude_Code-Plugin_Ready-d97757?style=for-the-badge&logo=anthropic&logoColor=white)](#-cài-đặt-nhanh)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

<br/>

> 🎯 **"AI agents write code fast and check it badly. Andy gives every agent a strict quality harness: Machine checks on clean code, zero loose suppressions, 100% production-ready."**
> 
> *— Nguyên tắc cốt lõi: Đứa viết ra code KHÔNG BAO GIỜ là đứa tự chấm điểm.*

</div>

---

## 💡 Tổng Quan

**Andy** (`fe-skill-andy`) là một **Hạ tầng Kỹ thuật & Hệ thống Kỹ năng Frontend hoàn chỉnh (21 Skills)** được thiết kế chuyên biệt cho các AI Coding Agent hàng đầu (**Claude Code, Antigravity, Gemini CLI, Codex**).

Khi không có Harness, Agent chỉ là một "thợ gõ prompt" dễ bị ảo giác (hallucination), đọc sót context, tự ý chèn `@ts-ignore` và sinh ra code rác. **Khi được trang bị Andy, Agent biến thành một Senior Frontend Architect:**

* 🗣️ **Giao tiếp ngang hàng (Peer-to-Peer):** Tiếng Việt thực chiến (*"mình - bạn"*), không vòng vo lý thuyết.
* 🛡️ **Kỷ luật máy chấm độc lập:** Bắt buộc chạy terminal và báo cáo output thực tế. Cấm tuyệt đối nói *"chắc là chạy được"*.
* 🧠 **Giữ mạch liên tục (Continuous Memory):** Tự động đọc và ghi nhật ký [work_log.md](./work_log.md), nhớ toàn bộ bối cảnh qua từng phiên làm việc.

---

## ⚖️ Sự Khác Biệt: Trước & Sau Khi Có Andy

| Tiêu chí | AI Coding Agent Thường (Không Harness) | AI Agent Được Trang Bị Andy Harness |
|---|---|---|
| **Cấu trúc Component** | Nhét chung CSS, fetch data, state vào 1 file khổng lồ | **Connected / Pure Twin Pattern**: Tách riêng Base atoms và Twin container |
| **Trạng thái Tải (Loading)** | Tự vẽ `<div className="animate-pulse" />` gây giật layout (CLS) | **DataSlot + Skeleton Parity**: Cùng 1 cây DOM, CLS = 0 tuyệt đối |
| **Khi gặp lỗi Linter / TS** | Tự động chèn `// @ts-ignore` hoặc `eslint-disable` để qua mặt | **Bị chặn đứng ngay lập tức** bởi script `check-loosening.mjs` |
| **Quy trình Sửa Code** | Tự ý đập đi xây lại, sửa lan man gây regression | **Audit-First & Proposal Protocol**: Báo cáo Impact/Risk, chờ bạn duyệt mới sửa |
| **Kích thước Nút & Nhập liệu** | Nút to nút nhỏ lộn xộn, mất thẩm mỹ hàng | **Control-Height Ramp**: Chuẩn 4 bậc (`sm`, `md`, `lg`, `control`) + Touch floor 44px |
| **Trải nghiệm Người dùng** | Bỏ qua người dùng bàn phím, tương phản kém | **5 Gating Proof Lenses**: A11Y, Focus trap, Contrast AA, Motion an toàn |

---

## 🏛️ Kiến Trúc 4 Tầng (4-Layer Law)

> *Mọi quyết định giao diện chỉ được phép nằm ở đúng một tầng duy nhất. Phong cách chảy xuống dưới, tính năng chỉ tổng hợp — không bao giờ tự vẽ.*

```
┌────────────────────────────────────────────────────────────────────────┐
│ Layer 1: TOKENS                                                        │
│ Màu sắc (CSS variables), Typography, Spacing scale (4px), Bán kính bo   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Layer 2: PRIMITIVES (Control-Height Ramp: sm · md · lg · control)       │
│ Nút bấm, Ô nhập liệu, Dialog, Badge... Tuân thủ Touch Floor 44px       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Layer 3: BLOCKS (Connected / Pure Twin Pattern)                        │
│ ├─ component.tsx (XBase): Pure UI, nhận atoms, exhaust switch trên Shape│
│ └─ index.tsx (X): SWR/Query, Translations, Handlers ──► DataSlot<T>   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Layer 4: FEATURES (Pages & Routing)                                    │
│ Điều phối luồng dữ liệu, ghép Blocks vào Layout ── Tuyệt đối ko style  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🧩 Bản Đồ 21 Kỹ Năng (Autonomous Skills Matrix)

Andy tự động điều phối các skill theo ngữ cảnh mà bạn không cần phải gõ lệnh slash command thủ công:

<br/>

### 1. 🧭 Khảo sát & Điều hướng (Recon & Hub)
* [`fe-recon`](./skills/fe-recon/) — **Khảo sát toàn diện (Read-Only):** Quét codebase lạ, đếm any, phát hiện God components, lập hồ sơ dự án.
* [`fe-andy`](./skills/fe-andy/) — **Router Hub & Quy ước:** Bộ quy ước lõi (`conventions.md`), quản lý template và điều phối chung.

### 2. 🧹 Kiến trúc & Dọn dẹp (Architecture & Clean)
* [`fe-clean`](./skills/fe-clean/) — **Phẫu thuật refactor:** Triệt tiêu code smell, gỡ rối component quá lớn, xóa dead code, dọn nợ kỹ thuật.
* [`fe-code`](./skills/fe-code/) — **Tạo mới chuẩn 4 tầng:** Scaffolding component mới, custom hooks, Server Actions, Storybook stories.

### 3. 🎨 Giao diện & Trải nghiệm (UI, UX & Motion)
* [`fe-ux`](./skills/fe-ux/) — **Canvas-First & UX:** Brainstorm layout wireframe trước khi code, UX writing, microcopy, Proof Lenses.
* [`fe-layout`](./skills/fe-layout/) — **Bố cục & Khoảng cách:** Thước đo Control-Height Ramp, Touch floor 44px, Container queries, Modern CSS.
* [`fe-skel`](./skills/fe-skel/) — **Trạng thái tải hoàn hảo:** Union `DataSlot<T>`, công thức `SlotView`, Skeleton Parity chống giật layout.
* [`fe-motion`](./skills/fe-motion/) — **Chuyển động mượt 60fps:** View Transitions, GSAP, triệt tiêu hao pin/GPU khi idle, `prefers-reduced-motion`.
* [`fe-viz`](./skills/fe-viz/) — **Trực quan hóa dữ liệu:** Biểu đồ chuẩn mực (Recharts/visx/D3), KPI tiles, sparklines, dashboard responsive & a11y.

### 4. 🌐 Dữ liệu & Đa ngôn ngữ (Data & i18n)
* [`fe-data`](./skills/fe-data/) — **Hạ tầng API & Cache:** Schema contracts (OpenAPI/GraphQL/tRPC), SWR/TanStack, retry backoff, optimistic updates.
* [`fe-i18n`](./skills/fe-i18n/) — **Quốc tế hóa chuẩn mực:** Intl format tiền tệ/ngày tháng, kiểm tra lệch key bản dịch, timezones an toàn.

### 5. ♿ Tiếp cận & Tương phản (Accessibility & Contrast)
* [`fe-a11y`](./skills/fe-a11y/) — **WCAG 2.2 AA:** Điều hướng bàn phím toàn phần, focus trap modal, screen readers, live regions.
* [`fe-contrast`](./skills/fe-contrast/) — **Đo lường tương phản:** Thuật toán APCA/WCAG đo màu chữ ($\ge 4.5:1$) và UI component ($\ge 3:1$) cho mọi theme.

### 6. 🔒 Bảo mật & Chất lượng (Security & Quality)
* [`fe-sec`](./skills/fe-sec/) — **Bảo mật Frontend:** Quét XSS sinks, chặn rò rỉ secret trong `NEXT_PUBLIC_*`, HttpOnly session, CSP hardening.
* [`fe-test`](./skills/fe-test/) — **Kiểm thử đa tầng:** Phân loại test theo rủi ro, Playwright E2E, axe core testing, component tests.
* [`fe-review`](./skills/fe-review/) — **Thẩm định tri thức:** Đánh giá các pattern, thư viện xem có còn là Best Practice hiện nay không.
* [`fe-learn`](./skills/fe-learn/) — **Bộ máy tự học:** Đúc kết bài học thực chiến vào `learned.md`, tự động cập nhật bộ kỹ năng.

### 7. 🚀 Nền tảng & Vận hành (Platform & Ship)
* [`fe-ship`](./skills/fe-ship/) — **Đóng gói phát hành:** CI/CD pipeline, Docker frontend, Sentry observability, SEO metadata, release checklist.
* [`fe-pwa`](./skills/fe-pwa/) — **Progressive Web App:** Service worker lifecycle, Workbox caching strategies, offline mutation outbox.
* [`fe-mfe`](./skills/fe-mfe/) — **Micro-Frontends:** Module Federation, Next.js Multi-Zones, kiểm soát version conflicts.

---

## 🛡️ Kỷ Luật Zero-Loosening

> [!CAUTION]
> **Tuyệt đối cấm làm suy yếu cổng chất lượng (No Gate Widening)**
> 
> Một dòng `@ts-ignore` hay `eslint-disable` hôm nay là một quả bom nổ chậm trong production ngày mai. Andy trang bị script quét tự động để chặn đứng hành vi này:

```bash
# Quét toàn bộ source code tìm các điểm lách luật
node skills/fe-andy/scripts/check-loosening.mjs
```

**9 Dấu hiệu bị cấm hoàn toàn:**
1. `eslint-disable` / `stylelint-disable` (trốn linter)
2. `@ts-ignore` / `@ts-nocheck` / `@ts-expect-error` (trốn TypeScript)
3. `// NOSONAR` (trốn sonar code smell)
4. `xit(` / `it.skip(` / `test.skip(` (bỏ qua unit test gãy)
5. `it.only(` / `test.only(` (tập trung test làm xanh giả tạo)
6. `|| true` (đoản mạch biểu thức điều kiện)

---

## ⚡ Hai Luồng Tác Vụ Thực Chiến

<details open>
<summary><b>🔧 Luồng 1: Bảo Trì & Refactor Code Có Sẵn (Boy Scout Rule)</b></summary>
<br/>

* **Bước 1 (Recon):** `fe-recon` đọc `work_log.md`, nhận diện `project-profile.md` và các Vùng bảo vệ (Protected Zones: Tiền, Auth, Payment).
* **Bước 2 (Triage):** Kích hoạt đúng skill chuyên trách (`fe-clean` dọn rác, `fe-perf` tối ưu tốc độ, `fe-a11y` sửa kẹt phím).
* **Bước 3 (Proposal):** Thay đổi $> 5$ dòng hoặc đụng logic bắt buộc xuất **Bảng Đề Xuất (Proposal Table)**. Andy dừng lại chờ bạn gõ *"chốt"* mới làm.
* **Bước 4 (Precision Edit):** Sửa đúng chỗ, không lan man, giữ nguyên comment và code xung quanh.
* **Bước 5 (Verify & Log):** Chạy `check-loosening.mjs`, linter, test thật và ghi tóm tắt vào đầu file `work_log.md`.
</details>

<details>
<summary><b>🚀 Luồng 2: Khởi Tạo Dự Án Mới (Canvas-First)</b></summary>
<br/>

* **Bước 1 (Scaffold):** Khởi tạo `project-profile.md` và Domain Concept Catalog (`docs/concepts/`).
* **Bước 2 (Canvas-First):** `fe-ux` Mode 1 vẽ Mockup/Wireframe từ API backend thật và Design System.
* **Bước 3 (Layer 1 & 2):** `fe-layout` thiết lập Tokens & Primitives theo Control-Height Ramp + Touch floor 44px.
* **Bước 4 (Layer 3):** `fe-code` dựng Connected / Pure Twin + `DataSlot<T>` + Skeleton Parity.
* **Bước 5 (Layer 4 & Sec):** Ghép Routes, kiểm tra Route guards và CSP với `fe-sec`.
* **Bước 6 (Proof Lenses & Ship):** Soi qua 5 thấu kính Gating, setup CI/CD pipeline với `fe-ship`.
</details>

---

## 📦 Cài Đặt Nhanh (1-Click Setup)

### Cách 1: Cài đặt liên kết toàn cục (Khuyên dùng)

```powershell
# Windows PowerShell (Chạy bình thường không cần quyền Admin)
powershell -ExecutionPolicy Bypass -File scripts\install-skills.ps1
```

```bash
# macOS / Linux Terminal
sh scripts/install-skills.sh
```

### Cách 2: Cài đặt cho Claude Code qua Plugin Marketplace

```bash
/plugin marketplace add Andy-doit/fe-skill-andy
/plugin install fe-skill-andy@fe-skill-andy
```

### Cách 3: Tích hợp vào Google Antigravity / Gemini CLI
Toàn bộ quy tắc của Andy đã được biên soạn sẵn tại [.antigravity-plugin/rules/AGENTS.md](./.antigravity-plugin/rules/AGENTS.md). Khi plugin được kích hoạt, Antigravity tự động tải Andy làm trợ lý kiến trúc mặc định cho mọi workspace.

---

## 🩺 Tự Kiểm Tra Hệ Thống (Health Check)

```bash
# 1. Kiểm tra tính toàn vẹn của 21 skills và các liên kết chéo
node skills/fe-andy/scripts/check-skills.mjs

# 2. Quét toàn bộ codebase để kiểm tra kỷ luật Zero-Loosening
node skills/fe-andy/scripts/check-loosening.mjs

# 3. Chạy bộ benchmark định tuyến intent thông minh của Andy
node andy-evals.mjs
```

---

<div align="center">

Phát triển với sự tỉ mỉ và tâm huyết bởi **[Andy](https://github.com/Andy-doit)**.

[![GitHub](https://img.shields.io/badge/GitHub-Andy--doit-181717?style=flat-square&logo=github)](https://github.com/Andy-doit)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

*Mọi dòng code xuất xưởng đều phải đạt chuẩn 10/10.*

</div>
