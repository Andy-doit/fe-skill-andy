# Giới thiệu fe-skill-andy

> Tài liệu nhập môn: đọc file này trước. Prompt mẫu chi tiết cho từng skill nằm ở [HUONG-DAN-SU-DUNG.md](HUONG-DAN-SU-DUNG.md). Bản tiếng Anh dành cho agent: [USAGE.md](USAGE.md).

## Mục lục
1. [fe-skill-andy là gì?](#1-fe-skill-andy-là-gì)
2. [Vì sao cần bộ skill?](#2-vì-sao-cần-bộ-skill)
3. [21 skill theo nhóm](#3-21-skill-theo-nhóm)
4. [Nguyên tắc hoạt động](#4-nguyên-tắc-hoạt-động)
5. [Bắt đầu trong 10 phút](#5-bắt-đầu-trong-10-phút)
6. [Cách gọi skill và viết prompt](#6-cách-gọi-skill-và-viết-prompt)
7. [Chọn skill theo tình huống](#7-chọn-skill-theo-tình-huống)
8. [Chọn skill theo loại dự án](#8-chọn-skill-theo-loại-dự-án)
9. [Ba lộ trình làm việc](#9-ba-lộ-trình-làm-việc)
10. [Case study: web bán hàng từ A–Z (dạng plan)](#10-case-study-web-bán-hàng-từ-az-dạng-plan)
11. [Kết quả mỗi skill trả về](#11-kết-quả-mỗi-skill-trả-về)
12. [Bộ skill tự học và tự thẩm định](#12-bộ-skill-tự-học-và-tự-thẩm-định)
13. [Giới hạn: những gì skill không làm](#13-giới-hạn-những-gì-skill-không-làm)
14. [Cấu trúc repo và tài liệu liên quan](#14-cấu-trúc-repo-và-tài-liệu-liên-quan)
15. [Câu hỏi thường gặp](#15-câu-hỏi-thường-gặp)

---

## 1. fe-skill-andy là gì?

fe-skill-andy là **bộ 21 "skill" cho AI coding agent** (Claude Code, Codex, Antigravity), giúp agent làm frontend theo cách của một kỹ sư Senior → Principal. Mỗi skill là một bộ hướng dẫn tập trung vào một mảng: hiệu năng, layout, accessibility, bảo mật, dữ liệu, test, phát hành, PWA, micro-frontend, biểu đồ… Agent nạp đúng skill cho việc đang làm và làm theo quy trình chung: **đọc trước, đề xuất, chờ bạn duyệt, rồi mới sửa**.

| | |
|---|---|
| **Dành cho** | Dev frontend dùng AI agent hằng ngày; tech lead muốn agent làm theo chuẩn chung của team |
| **Áp dụng cho** | Trang tĩnh (landing, docs, blog), web app động (SaaS, dashboard, e-commerce), dự án lai |
| **Framework** | Next.js App Router (ưu tiên), Vite + React, React thuần, Remix / React Router |
| **Tool** | Claude Code (đã kiểm chứng), Codex và Antigravity (đã tạo liên kết, cần xác nhận) |
| **Phạm vi bao phủ** | Mục tiêu ~95–98 % năng lực frontend Senior → Principal (tự đánh giá, không phải số đo độc lập) |

## 2. Vì sao cần bộ skill?

| Agent không có skill | Agent có fe-skill-andy |
|---|---|
| Sửa code ngay khi chưa đọc kỹ | Đọc và audit trước; chỉ sửa sau khi bạn duyệt |
| Tối ưu theo cảm tính (`useMemo` khắp nơi) | Đo trước (Lighthouse, Profiler), báo số trước/sau |
| Mỗi lần trả lời một kiểu | Báo cáo theo một rubric chung: Impact, Effort, Risk, cách kiểm tra |
| Lời khuyên lỗi thời từ dữ liệu cũ | `fe-review` thẩm định với tài liệu chính thức trước khi áp dụng |
| Đụng vào thanh toán, auth, tính tiền | Vùng bảo vệ: không sửa khi chưa có chỉ định rõ |
| Quên bài học cũ | Learning loop ghi bài học; `fe-learn` gom và bổ sung vào skill sau khi bạn chốt |

## 3. 21 skill theo nhóm

### Điều phối & khởi động
| Skill | Làm gì | Gọi khi |
|---|---|---|
| **fe-andy** | Bộ định tuyến, quy ước chung, project profile, Definition of Done, playbook và case study | Không biết dùng skill nào; bắt đầu dự án mới |
| **fe-recon** | Khảo sát repo lạ (chỉ đọc): stack, cấu trúc, rủi ro; soạn project profile | Nhận dự án mới, trước khi refactor |

### Giao diện
| Skill | Làm gì | Gọi khi |
|---|---|---|
| **fe-layout** | Spacing, grid/flex, responsive, container query, token, theme, dark mode | Lệch, hở, card cao thấp khác nhau, thêm dark mode |
| **fe-contrast** | Đo độ tương phản WCAG bằng script | Chữ khó đọc, kiểm tra bảng màu |
| **fe-a11y** | Bàn phím, focus, ARIA, trình đọc màn hình, WCAG 2.2 | Không Tab được, audit accessibility |
| **fe-motion** | Animation, GSAP/ScrollTrigger, canvas/WebGL, reduced motion | Cuộn giật, animation tốn CPU |
| **fe-skel** | Skeleton, trạng thái loading / empty / error | Nhấp nháy khi tải, layout nhảy |

### Trải nghiệm
| Skill | Làm gì | Gọi khi |
|---|---|---|
| **fe-ux** | Đề xuất layout (có mockup), review luồng, form UX, câu chữ | Thiết kế trang mới, cải thiện form, viết thông báo lỗi |
| **fe-i18n** | Từ điển đa ngôn ngữ, định dạng số/tiền/ngày, đổi ngôn ngữ | Thiếu bản dịch, format VND, chuyển ngôn ngữ mất query |

### Hiệu năng & dữ liệu
| Skill | Làm gì | Gọi khi |
|---|---|---|
| **fe-perf** | Core Web Vitals, bundle, render strategy, cache Next.js, re-render | Trang chậm, LCP/INP/CLS vượt ngân sách |
| **fe-data** | Fetch, cache, hủy request, retry, phân trang, realtime | Request trùng, kết quả sai thứ tự, websocket rớt |
| **fe-pwa** | Service worker, cache offline, hàng đợi ghi offline, cập nhật phiên bản, manifest | Cần chạy offline, deploy xong vẫn thấy bản cũ, cài như app |
| **fe-viz** | Chọn loại biểu đồ theo câu hỏi, mã hoá và màu, SVG/Canvas/WebGL, thư viện chart, a11y và hiệu năng của biểu đồ, KPI, sparkline, dashboard | Thêm biểu đồ hoặc dashboard, chọn thư viện chart, biểu đồ chậm, khó đọc hoặc fail a11y |

### Code
| Skill | Làm gì | Gọi khi |
|---|---|---|
| **fe-code** | Viết code mới theo kiến trúc 4 tầng, nơi đặt state, TypeScript nâng cao | Tạo component, feature, form, hook |
| **fe-clean** | Refactor, nợ kỹ thuật, code smell, TypeScript không an toàn | Dọn code cũ, tách component quá lớn |
| **fe-test** | Chọn mức kiểm tra, viết unit/component/E2E/axe/visual test | Trước khi mở PR, thêm test |

### Bảo mật, phát hành & kiến trúc
| Skill | Làm gì | Gọi khi |
|---|---|---|
| **fe-sec** | XSS, CSP, secret, auth frontend, CSRF/CORS, dependency | Audit bảo mật, xử lý đăng nhập, thêm thư viện |
| **fe-ship** | Release checklist, CI/CD, env, giám sát (Sentry, RUM, SLO), analytics, SEO | Chuẩn bị release, cấu hình giám sát, sitemap |
| **fe-mfe** | Micro-frontend, Module Federation, Multi-Zones, dependency dùng chung | Nhiều team muốn deploy độc lập |

### Kiến thức
| Skill | Làm gì | Gọi khi |
|---|---|---|
| **fe-review** | Thẩm định pattern, thư viện, kiến trúc, lời khuyên theo chuẩn hiện hành; chấm 4 mức | "Cách này còn đúng không?", trước khi áp dụng cái mới |
| **fe-learn** | Gom bài học → kiểm tra trùng → lập kế hoạch → bạn chốt → cập nhật skill | Cuối dự án, khi muốn bổ sung kiến thức |

## 4. Nguyên tắc hoạt động

### 4.1 Project profile trước tiên
Mỗi dự án ứng dụng có một file `project-profile.md` ở thư mục gốc. File này ghi stack, phiên bản, lệnh chạy, cấu trúc thư mục, **vùng bảo vệ**, ngân sách hiệu năng, mức accessibility, ngôn ngữ và các quyết định đã chốt. Mọi skill đọc file này đầu tiên, và giá trị trong đó ghi đè mặc định của skill. Chưa có file thì dùng `fe-recon` để soạn, hoặc copy [template](skills/fe-andy/references/project-profile.template.md).

### 4.2 Quy trình 6 bước

```
[1. Đọc / audit] → [2. Đề xuất] → [3. Bạn duyệt] → [4. Sửa tối thiểu] → [5. Kiểm tra] → [6. Học]
```
- Agent phân biệt rõ "**thấy trong code**" (file:dòng) với "**suy luận / cần đo**".
- **Fast-Path:** sửa ≤ 5 dòng trong 1 file, chỉ chỉnh giao diện/copy, không chạm auth, thanh toán hay router. Trường hợp này agent sửa luôn và báo kết quả kiểm tra trong cùng lượt.

### 4.3 Rubric chung cho mọi báo cáo
| Trường | Giá trị |
|---|---|
| Impact | Critical / High / Medium / Low |
| Effort | S (< 1 h) / M (1–3 h) / L (> 3 h) |
| Risk | Low / Med / High |

Thứ tự ưu tiên: Impact cao trước → Risk thấp trước → Effort nhỏ trước.

### 4.4 Kiến trúc 4 tầng
```
Tokens (biến theme) → Primitives (UI library) → Blocks (widget tái dùng, tự lo style, chỉ nhận props) → Features (lấy dữ liệu, ghép Block, không tự viết style)
```
Mỗi quyết định chỉ nằm ở một tầng. Feature ghép Block, không tự vẽ giao diện.

### 4.5 Vùng bảo vệ
Mặc định là: tính tiền, auth / phiên / thanh toán, và engine biểu đồ realtime. Agent **không sửa** các vùng này khi chưa có chỉ định rõ. Project profile có thể thêm vùng khác.

### 4.6 Đo trước, tối ưu sau
Không thêm `memo`/`useMemo` theo cảm tính. Mọi thay đổi hiệu năng phải có số đo trước và sau. Thứ tự đòn bẩy: giảm payload → bỏ waterfall → chiến lược render → giảm tải main thread → re-render → tối ưu vi mô.

### 4.7 Thẩm định trước khi coi là "chuẩn"
> **Trước khi coi một pattern mới là chuẩn, luôn chạy qua `fe-review`.**

fe-review chấm theo 4 mức: **Still Best Practice / Acceptable / Outdated / Harmful**. Mỗi nhận định được gắn nhãn bằng chứng: `[Verified]`, `[Measured]`, `[Inference]` hoặc `[Unverified]`.

### 4.8 Definition of Done
Lint và type pass, không thêm `any`; spacing đúng thang; animation có cleanup và tôn trọng reduced motion; contrast AA; focus thấy rõ; không gây CLS mới; không để lại `console.log`; có bằng chứng kiểm tra; đã chạy learning loop.

## 5. Bắt đầu trong 10 phút

1. **Cài:** mở PowerShell, `cd` vào thư mục repo, chạy:
   ```powershell
   powershell -ExecutionPolicy Bypass -File scripts\install-skills.ps1
   ```
   Trên macOS/Linux chạy `sh scripts/install-skills.sh`. Chi tiết theo từng tool: [HUONG-DAN-SU-DUNG.md §1](HUONG-DAN-SU-DUNG.md#1-cài-đặt).
2. **Kiểm tra:** `node skills/fe-andy/scripts/check-skills.mjs` → phải ra `PASS`. Mở phiên Claude Code mới, gõ `/fe-` và thấy đủ 21 skill.
3. **Tạo profile cho dự án ứng dụng:**
   ```
   /fe-recon Khảo sát repo này và soạn project-profile.md. Chỉ đọc, chưa sửa.
   ```
4. **Thử một việc nhỏ:**
   ```
   /fe-layout Card trong mục Pricing cao thấp khác nhau.
   Phạm vi: src/components/features/pricing/
   Mục tiêu: footer các card cùng một hàng ở ≥ 768px.
   Chế độ: đề xuất trước, chờ tôi duyệt.
   ```
5. **Duyệt:** trả lời `OK, làm hết`, `Làm mục 1 và 3` hoặc `Dừng`. Agent sửa, chạy kiểm tra, rồi báo dòng `Learned: …`.

## 6. Cách gọi skill và viết prompt

| Tool | Gọi trực tiếp | Gọi bằng lời |
|---|---|---|
| Claude Code | `/fe-perf …` | "Dùng skill fe-perf để …" |
| Antigravity | `/fe-perf …` (cần xác nhận) | như trên |
| Codex | "use the fe-perf skill to …" | như trên |

Không gọi tên skill cũng được: mô tả rõ vấn đề thì agent tự chọn. Khi muốn chắc chắn, gọi thẳng tên.

**Công thức prompt** (ba dòng quan trọng nhất là Phạm vi, Hiện trạng, Mục tiêu):
```
/<skill> <việc cần làm, một câu>
Phạm vi: <route / file / thư mục>
Hiện trạng: <triệu chứng, số liệu, cách tái hiện>
Mục tiêu: <kết quả đo được / kiểm tra được>
Ràng buộc: <không thêm thư viện, không đụng vùng X…>
Chế độ: chỉ audit | đề xuất, chờ duyệt
Đầu ra: <bảng finding, kế hoạch, checklist…>
```
Mỗi prompt chỉ nêu một vấn đề. Có số liệu thì đưa số liệu. Viết tiếng Việt thoải mái, giữ nguyên thuật ngữ kỹ thuật. Prompt mẫu cho từng skill: [HUONG-DAN-SU-DUNG.md Phần C](HUONG-DAN-SU-DUNG.md#6-bắt-đầu-dự-án).

## 7. Chọn skill theo tình huống

```
Bạn gặp gì?
├─ Repo lạ, chưa hiểu gì ─────────────────────→ fe-recon
├─ "Cách này còn đúng không? Có nên dùng X?" ──→ fe-review
├─ Chậm / LCP, INP, CLS / bundle / hydration ──→ fe-perf   (cuộn, animation giật → fe-motion)
├─ Fetch, cache, request trùng, realtime ──────→ fe-data
│    └─ phải chạy khi mất mạng / qua reload ──→ fe-pwa
├─ Nhiều team, muốn deploy độc lập ───────────→ fe-mfe (+ fe-review)
├─ Nhìn sai: spacing/theme → fe-layout · màu khó đọc → fe-contrast · nhảy khi tải → fe-skel
├─ Dùng khó: bàn phím/screen reader → fe-a11y · luồng, form, câu chữ → fe-ux · ngôn ngữ, tiền tệ → fe-i18n
├─ Bảo mật, đăng nhập, secret, thư viện ──────→ fe-sec
├─ Viết mới → fe-code · dọn code cũ → fe-clean
├─ Kiểm tra trước PR → fe-test · release, giám sát, SEO → fe-ship
└─ Bổ sung kiến thức vào bộ skill ────────────→ fe-learn
```
Không chắc thì hỏi `fe-andy`: "Việc này nên dùng skill nào?"

## 8. Chọn skill theo loại dự án

### 8.1 Trang tĩnh hay trang động?
| Câu hỏi | Tĩnh | Động |
|---|---|---|
| Mọi người xem cùng nội dung? | Có (có thể khác theo ngôn ngữ) | Không: theo user, phiên, quyền |
| Nội dung đổi khi nào? | Khi xuất bản | Mỗi request / realtime |
| Có đăng nhập, giỏ hàng, dữ liệu cá nhân? | Không | Có |
| Cách render | SSG / static export / ISR | SSR + streaming, RSC/CSR |

Sản phẩm thật thường là **lai**, nên quyết định **theo từng route**, không theo cả dự án.

### 8.2 Ma trận skill
● = chính, ○ = khi cần, — = hiếm khi dùng

| Skill | Landing / docs | Blog, nội dung đa ngôn ngữ | SaaS / dashboard | E-commerce | App offline | Nhiều team |
|---|---|---|---|---|---|---|
| fe-recon | ○ | ○ | ● | ● | ● | ● |
| fe-perf | ● | ● | ● | ● | ○ | ● |
| fe-motion | ● | ○ | — | ○ | — | — |
| fe-layout / fe-contrast / fe-a11y | ● | ● | ● | ● | ● | ● |
| fe-skel / fe-data | — | ○ | ● | ● | ● | ● |
| fe-ux | ● | ○ | ● | ● | ● | ○ |
| fe-i18n | ○ | ● | ○ | ● | ○ | ○ |
| fe-sec | ○ | ○ | ● | ● | ● | ● |
| fe-code / fe-clean / fe-test | ○ | ○ | ● | ● | ● | ● |
| fe-ship | ● | ● | ● | ● | ● | ● |
| fe-pwa | ○ | ○ | ○ | ● | ● | ○ |
| fe-mfe | — | — | ○ | ○ | — | ● |
| **fe-review** | thư viện mới | chiến lược render | thư viện state, auth | cache, bảo mật checkout | công cụ SW | quyết định MFE |

### 8.3 Playbook rút gọn
- **Trang tĩnh** (12 bước):
  1. Profile và ngân sách hiệu năng.
  2. `fe-ux` đề xuất layout.
  3. `fe-layout` dựng token, sau đó `fe-contrast` đo màu.
  4. `fe-code` dựng các section thành Block.
  5. `fe-motion` nếu có animation.
  6. `fe-a11y`.
  7. `fe-perf` (ảnh LCP, font, script bên thứ ba).
  8. SEO với `fe-ship`.
  9. `fe-i18n` nếu có nhiều ngôn ngữ.
  10. `fe-sec` (header bảo mật, chống spam form).
  11. `fe-pwa` nếu cần trang offline.
  12. `fe-test` rồi `fe-ship` release.
- **Trang động** (14 bước):
  1. Profile và vùng bảo vệ.
  2. Kiến trúc, có thẩm định bằng `fe-review`.
  3. Luồng người dùng với `fe-ux`.
  4. App shell với `fe-layout`.
  5. Auth với `fe-sec`.
  6. Tầng dữ liệu với `fe-data`.
  7. Feature với `fe-code`.
  8. Các trạng thái loading/empty/error với `fe-skel`.
  9. Realtime/offline với `fe-data` và `fe-pwa`.
  10. Widget phức tạp với `fe-a11y`.
  11. Hiệu năng (INP, bundle) với `fe-perf`.
  12. Test với `fe-test`.
  13. CI/CD và giám sát với `fe-ship`.
  14. `fe-mfe`, chỉ khi có nhiều team.

Chi tiết từng bước, đầu ra và tiêu chí xong: [playbooks.md](skills/fe-andy/references/playbooks.md) (tiếng Anh) và [HUONG-DAN-SU-DUNG.md Phần F](HUONG-DAN-SU-DUNG.md#18-trang-tĩnh-hay-trang-động) (có prompt mẫu).

## 9. Ba lộ trình làm việc

| Lộ trình | Khi nào | Các bước |
|---|---|---|
| **A. Dự án mới** | Bắt đầu từ con số 0 | `fe-andy`: tạo profile → chọn playbook tĩnh/động/lai → ghi quyết định kiến trúc (thẩm định bằng `fe-review`) → làm lần lượt theo playbook → `fe-test` → `fe-ship` → `fe-learn` |
| **B. Nhận dự án có sẵn** | Repo đã chạy, bạn mới vào | `fe-recon` (chỉ đọc) → duyệt `project-profile.md` → audit từng mảng theo ưu tiên (`fe-sec`, `fe-perf`, `fe-a11y`, `fe-clean`) → gom finding theo rubric → sửa từng nhóm nhỏ |
| **C. Sửa một vấn đề** | Có bug hoặc yêu cầu cụ thể | Mô tả vấn đề (hoặc gọi thẳng skill) → agent audit, đề xuất → bạn duyệt → sửa, kiểm tra → dòng `Learned:` |

## 10. Case study: web bán hàng từ A–Z (dạng plan)

**Bối cảnh mẫu:**
- Khoảng 5.000 sản phẩm, tiếng Việt và tiếng Anh, tiền VND.
- Khách vãng lai mua được; thanh toán qua trang của cổng thanh toán.
- Backend thương mại cung cấp REST API; một team frontend.
- Stack mặc định: Next.js App Router, React 19, TypeScript strict, Tailwind v4.

Plan đầy đủ (mục tiêu, quyết định, việc cần làm, đầu ra, tiêu chí xong cho từng bước): [case-study-ecommerce.md](skills/fe-andy/references/case-study-ecommerce.md). Bảng bước kèm prompt mẫu tiếng Việt: [HUONG-DAN-SU-DUNG.md §21](HUONG-DAN-SU-DUNG.md#21-case-study-az-web-bán-hàng).

### 10.1 Trang nào tĩnh, trang nào động
| Route | Loại | Cách làm |
|---|---|---|
| Trang chủ, giới thiệu, chính sách | Tĩnh | Pre-render; làm mới theo thời gian hoặc khi CMS gọi webhook |
| Danh mục | Render động, dữ liệu cache | Filter, sort, page lưu trên URL; cache ~5 phút theo tag |
| Chi tiết sản phẩm | Khung tĩnh + phần giá/tồn kho luôn mới | Pre-render ~500 sản phẩm bán chạy; giá và tồn kho tải riêng, cache ≤ 60 s |
| Tìm kiếm | Động | Không index |
| Giỏ hàng, thanh toán, tài khoản | Động theo user | Cookie HttpOnly, không cache, không index |

### 10.2 Cấu trúc thư mục
```
app/          route mỏng: home · content · shop (danh mục, sản phẩm) · search · cart · checkout · account (bảo vệ) · api (webhook)
components/
  ui/         primitive: button, input, dialog, sheet
  blocks/     product-card, price, gallery, quantity-stepper, filter-panel, pagination, empty-state, skeletons
features/     catalog · product · search · cart · checkout (bảo vệ) · account   — mỗi feature có index công khai
lib/          env (chỉ server) · money (bảo vệ) · commerce (adapter duy nhất gọi backend) · auth (bảo vệ) · seo · analytics
i18n/         messages vi / en
tests/        unit · e2e
```

### 10.3 21 bước
| # | Bước | Skill | Đầu ra | Xong khi |
|---|---|---|---|---|
| 1 | Khảo sát & profile | fe-andy | `project-profile.md` | Có ngân sách và vùng bảo vệ |
| 2 | Quyết định kiến trúc | fe-code, fe-perf, fe-review, fe-mfe | ADR, ma trận route, bảng state | fe-review đã chấm framework, state, thanh toán |
| 3 | Cấu trúc thư mục | fe-code | Khung thư mục, luật import | Lint chặn import sai tầng |
| 4 | Token & layout | fe-layout, fe-contrast | Token, lưới 2/3/4 cột | Contrast AA, không có màu cứng |
| 5 | Module tiền & Block | fe-code | money, danh sách Block | Unit test tiền pass |
| 6 | Tầng dữ liệu | fe-data | Adapter, schema, chính sách cache | Không gọi trùng, có timeout |
| 7 | Trang catalog | fe-code, fe-perf, fe-data | Home, danh mục, sản phẩm, tìm kiếm | Đúng ma trận render, filter giữ khi reload |
| 8 | Giỏ hàng | fe-code, fe-data, fe-ux | Luồng giỏ hàng | Tổng tiền luôn khớp backend |
| 9 | Thanh toán | fe-sec, fe-code | Session thanh toán + webhook | Đơn test chạy trọn ở staging, webhook gửi lại không tạo đơn trùng |
| 10 | Tài khoản | fe-sec | Khu vực tài khoản có bảo vệ | Không xem được đơn của người khác |
| 11 | Loading/empty/error | fe-skel, fe-ux | Ma trận trạng thái | Chặn API vẫn hiện lỗi đúng, không CLS |
| 12 | UX & câu chữ | fe-ux | Review luồng, microcopy | Không còn "Error 500" |
| 13 | Accessibility | fe-a11y, fe-contrast | Checklist widget | Mua hàng được chỉ bằng bàn phím, axe sạch |
| 14 | Đa ngôn ngữ & tiền tệ | fe-i18n | Từ điển, định dạng, hreflang | Script parity pass, đổi ngôn ngữ giữ filter |
| 15 | Bảo mật | fe-sec | Checklist hardening | Header đã kiểm trên staging |
| 16 | Hiệu năng | fe-perf | Báo cáo ngân sách | Đạt ngân sách trên mobile |
| 17 | SEO | fe-ship | Metadata, dữ liệu có cấu trúc, sitemap | Rich Results Test pass |
| 18 | Offline catalog (tuỳ chọn) | fe-pwa | Plan service worker | Checklist fe-pwa pass |
| 19 | Test | fe-test | Ma trận test | CI xanh |
| 20 | Release & giám sát | fe-ship | Pipeline, dashboard, rollback | Checklist release ✓, có người trực alert |
| 21 | Mở rộng & học | fe-mfe, fe-review, fe-learn | ADR cập nhật, bài học | Bài học đã thẩm định và được chốt |

### 10.4 Năm quy tắc sống còn
1. **Tiền là số nguyên** (đơn vị nhỏ nhất) và chỉ được format ở một module.
2. **Server là sự thật:** giá, giảm giá, phí ship đều tính lại ở server; bỏ qua mọi giá gửi từ client.
3. **Đơn chỉ thành "đã thanh toán" qua webhook có xác thực chữ ký.** Không tin `?paid=true` trên URL.
4. **Giỏ hàng, thanh toán, tài khoản không bao giờ vào cache dùng chung.**
5. **Filter, sort, trang lưu trên URL**, để reload hay chia sẻ link vẫn giữ nguyên.

## 11. Kết quả mỗi skill trả về

- **Báo cáo audit:** mỗi finding gồm vị trí (file:dòng), bằng chứng (thấy trong code / đo được / suy luận), Impact, Effort, Risk, cách sửa và cách kiểm tra.
- **Kế hoạch sửa** chia thành bước nhỏ, mỗi bước kiểm tra được; agent chờ bạn duyệt.
- **Kết quả kiểm tra thật:** lệnh đã chạy và exit code. Phần chưa kiểm tra được ghi rõ là chưa kiểm tra.
- **Dòng `Learned:`**: bài học mới đã ghi, hoặc "nothing new".
- **Riêng fe-review:** bảng claim → nguồn đã kiểm tra → mức bằng chứng → kết luận 4 mức → phiên bản cải tiến.

## 12. Bộ skill tự học và tự thẩm định

```
Skill làm xong việc
  → có bài học mới, đã chứng minh, dùng lại được? → ghi vào <skill>/references/learned.md
  → thông tin riêng của dự án → ghi vào project-profile.md của dự án đó
fe-learn (khi bạn yêu cầu, hoặc khi có ≥ 5 ghi chú mới)
  → gom → fe-review thẩm định → kiểm tra trùng/xung đột → lập kế hoạch → bạn "chốt" → cập nhật skill → health check
```
Bài học chưa đủ bằng chứng được giữ ở trạng thái `needs-evidence`, chưa trở thành "chuẩn". Chi tiết: [HOW-IT-LEARNS.md](HOW-IT-LEARNS.md), [HUONG-DAN-SU-DUNG.md Phần D](HUONG-DAN-SU-DUNG.md#12-fe-learn--thu-thập--kiểm-tra--kế-hoạch--chốt--bổ-sung).

## 13. Giới hạn: những gì skill không làm

- **Không thay backend:** API, database, phân quyền phía server, tồn kho là việc của team backend. Skill chỉ đưa ra yêu cầu phía frontend cần.
- **Không tự deploy, release hay đổi cấu hình production:** việc này do người làm.
- **Không tự cài thư viện, không đổi lockfile** khi bạn chưa đồng ý.
- **Không tích hợp sâu với từng nhà cung cấp** (cổng thanh toán, CMS, search vendor). Skill đưa ra quy trình chung; chi tiết phải theo tài liệu của nhà cung cấp.
- **Không bảo đảm tuyệt đối** về tính đúng của API theo phiên bản: framework thay đổi nhanh. Dùng `fe-review` với đúng phiên bản trong profile trước khi áp dụng.
- **Chưa có:** case study A–Z riêng cho SaaS dashboard (mới có playbook), và quy trình từ Figma sang design system đầy đủ. Biểu đồ đã có `fe-viz`.

## 14. Cấu trúc repo và tài liệu liên quan

```
fe-skill-andy/
├─ skills/                  bộ skill cài được (21 thư mục fe-*)
│  └─ fe-andy/references/   conventions, learning-loop, project-profile template, playbooks, case-study-ecommerce
├─ scripts/                 install-skills.ps1 / .sh
├─ audit/                   báo cáo coverage, kế hoạch cập nhật, hướng dẫn cài
├─ GIOI-THIEU.md            (file này) giới thiệu tổng quan
├─ HUONG-DAN-SU-DUNG.md     hướng dẫn chi tiết + prompt mẫu từng skill
├─ USAGE.md                 bản tiếng Anh cho agent
├─ HOW-IT-LEARNS.md         cơ chế học
└─ work_log.md              nhật ký thay đổi
```

| Muốn biết | Đọc |
|---|---|
| Quy tắc chung mọi skill tuân theo | [conventions.md](skills/fe-andy/references/conventions.md) |
| Bảng định tuyến skill | [fe-andy/SKILL.md](skills/fe-andy/SKILL.md) |
| Prompt mẫu từng skill | [HUONG-DAN-SU-DUNG.md](HUONG-DAN-SU-DUNG.md) |
| Playbook tĩnh/động | [playbooks.md](skills/fe-andy/references/playbooks.md) |
| Plan web bán hàng | [case-study-ecommerce.md](skills/fe-andy/references/case-study-ecommerce.md) |
| Cài đặt theo từng tool | [audit/install-guide.md](audit/install-guide.md) |

## 15. Câu hỏi thường gặp

**Agent có tự sửa code không?**
Không, trừ khi bạn duyệt. Ngoại lệ là Fast-Path (≤ 5 dòng, không rủi ro). `fe-recon` và `fe-review` không bao giờ sửa code.

**Có bắt buộc `project-profile.md` không?**
Không, nhưng rất nên có. Thiếu file này, agent sẽ nói rõ nó đang giả định gì, hoặc hỏi bạn.

**Không dùng Next.js thì sao?**
Mọi skill viết theo nguyên tắc chung trước, rồi mới có ví dụ cho Next.js, Vite + React và React thuần. Ghi stack của bạn vào profile.

**Dùng nhiều skill cùng lúc được không?**
Nên dùng một skill sở hữu cho mỗi việc. Việc lớn thì làm theo playbook: lần lượt từng skill, mỗi bước có tiêu chí xong.

**Khi nào gọi fe-review?**
Khi định dùng thư viện, framework, kiến trúc mới; khi áp dụng lời khuyên từ blog, code cũ hay câu trả lời của AI; khi hai người (hoặc hai skill) bất đồng; và trước khi `fe-learn` đưa bài học vào skill.

**Bài học được lưu ở đâu? Có lộ thông tin dự án không?**
Bài học chung nằm ở `skills/<skill>/references/learned.md`. Thông tin riêng của dự án nằm trong `project-profile.md` của chính dự án đó. Không ghi secret, tên khách hàng hay đường dẫn máy vào bộ skill.

**Cập nhật bộ skill thế nào?**
Pull repo mới. Vì cài bằng liên kết nên mọi tool thấy thay đổi ngay. Khi có skill mới, chạy lại installer, rồi chạy health check.
