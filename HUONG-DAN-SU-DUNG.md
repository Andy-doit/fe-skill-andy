# Hướng dẫn sử dụng fe-skill-andy

> Mới dùng lần đầu? Đọc [GIOI-THIEU.md](GIOI-THIEU.md) trước.

Bộ 21 skill cho frontend (UX, UI, hiệu năng, bảo mật, chất lượng code, phát hành, PWA/offline, micro-frontend, thẩm định kiến thức, biểu đồ), dùng chung cho **Claude Code, Codex và Antigravity**. Mỗi lần dùng, skill ghi lại bài học mới; định kỳ bạn dùng `fe-learn` để thu thập, kiểm tra, chốt kế hoạch rồi mới bổ sung vào bộ skill.

> Mục có đánh dấu **(cần xác nhận)** dựa trên tài liệu của tool tại 10/2026, chưa thử trên máy này (Codex và Antigravity chưa được cài khi viết).

## Mục lục

**Phần A — Cài đặt**
1. [Cài đặt](#1-cài-đặt) · 2. [Kiểm tra đã cài](#2-kiểm-tra-đã-cài) · 3. [Cách gọi skill trong từng tool](#3-cách-gọi-skill-trong-từng-tool)

**Phần B — Viết prompt chuẩn**
4. [Công thức prompt](#4-công-thức-prompt) · 5. [Cách duyệt, từ chối, sửa đề xuất](#5-cách-duyệt-từ-chối-sửa-đề-xuất)

**Phần C — Từng skill: prompt mẫu**
6. [Bắt đầu dự án: fe-recon](#61-fe-recon--khảo-sát-repo-chỉ-đọc) · [fe-andy](#62-fe-andy--không-biết-dùng-skill-nào)
7. [Giao diện: fe-layout](#71-fe-layout--khoảng-cách-căn-lề-responsive-dark-mode) · [fe-contrast](#72-fe-contrast--độ-tương-phản-màu) · [fe-a11y](#73-fe-a11y--bàn-phím-focus-trình-đọc-màn-hình) · [fe-motion](#74-fe-motion--animation-mượt) · [fe-skel](#75-fe-skel--skeleton-và-trạng-thái-loadingemptyerror) · [fe-viz](#76-fe-viz--biểu-đồ-kpi-dashboard)
8. [Trải nghiệm: fe-ux](#81-fe-ux--đề-xuất-layout-review-luồng-form-câu-chữ) · [fe-i18n](#82-fe-i18n--bản-dịch-định-dạng-đổi-ngôn-ngữ)
9. [Hiệu năng & dữ liệu: fe-perf](#91-fe-perf--trang-chậm-bundle-re-render-nextjs) · [fe-data](#92-fe-data--fetch-cache-hủy-request-realtime)
10. [Code: fe-code](#101-fe-code--viết-code-mới) · [fe-clean](#102-fe-clean--refactor-code-cũ) · [fe-test](#103-fe-test--kiểm-tra-và-viết-test)
11. [Bảo mật, phát hành & kiến trúc: fe-sec](#111-fe-sec--bảo-mật-frontend) · [fe-ship](#112-fe-ship--release-cicd-giám-sát-seo) · [fe-pwa](#113-fe-pwa--offline-service-worker-cài-đặt-như-app) · [fe-mfe](#114-fe-mfe--micro-frontend) · [fe-review](#115-fe-review--thẩm-định-kiến-thức-trước-khi-áp-dụng)

**Phần D — Bổ sung kiến thức vào bộ skill**
12. [fe-learn: thu thập → kiểm tra → kế hoạch → chốt → bổ sung](#12-fe-learn--thu-thập--kiểm-tra--kế-hoạch--chốt--bổ-sung)

**Phần E — Tham khảo**
13. [Kịch bản kết hợp](#13-kịch-bản-kết-hợp) · 14. [Script kiểm tra](#14-script-kiểm-tra) · 15. [Cập nhật, gỡ cài đặt](#15-cập-nhật-gỡ-cài-đặt) · 16. [Xử lý sự cố](#16-xử-lý-sự-cố) · 17. [Câu hỏi thường gặp](#17-câu-hỏi-thường-gặp)

**Phần F — Làm dự án từ A–Z**
18. [Trang tĩnh hay trang động?](#18-trang-tĩnh-hay-trang-động) · 19. [Playbook trang tĩnh](#19-playbook-trang-tĩnh) · 20. [Playbook trang động](#20-playbook-trang-động) · 21. [Case study A–Z: web bán hàng](#21-case-study-az-web-bán-hàng)

---

# Phần A — Cài đặt

## 1. Cài đặt

Yêu cầu: Windows PowerShell 5.1+ (hoặc macOS/Linux), Node.js 18+ cho các script kiểm tra. Để repo ở một thư mục cố định; **không di chuyển thư mục repo sau khi cài** vì các liên kết (junction/symlink) trỏ trực tiếp vào vị trí này.

> [!IMPORTANT]
> **Lưu ý quan trọng về đường dẫn thư mục:**
> Mỗi máy tính sẽ lưu repository `fe-skill-andy` ở các ổ đĩa và thư mục khác nhau (ví dụ: `D:\Work\AI\fe-skill-andy`, `C:\Projects\fe-skill-andy`, hoặc `/Users/username/fe-skill-andy`).
> - **Cách 1 (Khuyến nghị, tiện nhất):** Mở PowerShell/Terminal, dùng lệnh `cd` chuyển thẳng vào thư mục `fe-skill-andy` của bạn, sau đó chỉ cần chạy `scripts\install-skills.ps1` — **không cần phải gõ đường dẫn dài dòng**.
> - **Cách 2:** Nếu đứng từ thư mục khác chạy lệnh, hãy **thay thế `<duong-dan-repo>`** trong các ví dụ bên dưới bằng đường dẫn thực tế trên máy của bạn.

```powershell
# Cách 1 (Khuyến nghị): Mở PowerShell, cd vào repo rồi chạy
# cd <duong-dan-repo>\fe-skill-andy
# powershell -ExecutionPolicy Bypass -File scripts\install-skills.ps1

# Cách 2: Chạy từ bất kỳ đâu (nhớ đổi <duong-dan-repo> thành đường dẫn thực tế trên máy bạn)
powershell -ExecutionPolicy Bypass -File <duong-dan-repo>\fe-skill-andy\scripts\install-skills.ps1

# Chỉ một số tool
powershell -ExecutionPolicy Bypass -File <duong-dan-repo>\fe-skill-andy\scripts\install-skills.ps1 -Tools codex,antigravity

# Thêm thư mục cũ cho bản tool đời trước
powershell -ExecutionPolicy Bypass -File <duong-dan-repo>\fe-skill-andy\scripts\install-skills.ps1 -IncludeLegacy
```
```bash
# macOS / Linux
# macOS / Linux (cd vào repo rồi chạy, hoặc thay /path/to bằng đường dẫn thực tế):
cd /path/to/fe-skill-andy && sh scripts/install-skills.sh
```

Script tạo **liên kết** (junction/symlink) cho từng skill — không copy — nên sửa repo là mọi tool thấy ngay, và ghi chú học được đổ về một chỗ. Không ghi đè thư mục trùng tên của bộ khác. Cuối cùng chạy health check.

| Tool | Thư mục cài | Thư mục cũ (`-IncludeLegacy`) | Trạng thái |
|---|---|---|---|
| Claude Code | `%USERPROFILE%\.claude\skills\` | — | Đã kiểm chứng với bản 17 skill; bản 21 skill: chạy lại installer |
| Codex | `%USERPROFILE%\.agents\skills\` | `%USERPROFILE%\.codex\skills\` | Đã tạo liên kết (cần xác nhận) |
| Antigravity app/IDE | `%USERPROFILE%\.gemini\config\skills\` | `%USERPROFILE%\.gemini\antigravity\skills\` | Đã tạo liên kết (cần xác nhận) |
| Antigravity CLI | `%USERPROFILE%\.gemini\antigravity-cli\skills\` | — | Đã tạo liên kết (cần xác nhận) |

Cài theo dự án cho cả team: copy `skills/*` vào `<repo-ứng-dụng>/.agents/skills/` (Codex, Antigravity — cần xác nhận) và tạo liên kết `<repo-ứng-dụng>/.claude/skills/<tên>` cho Claude Code. Junction/symlink không lưu trong git — mỗi người tự tạo.

## 2. Kiểm tra đã cài

| Kiểm tra | Cách làm | Mong đợi |
|---|---|---|
| Liên kết | `Get-ChildItem $env:USERPROFILE\.claude\skills \| Select Name, LinkType, Target` | 21 dòng `Junction` trỏ về repo |
| Bộ skill hợp lệ | `node skills/fe-andy/scripts/check-skills.mjs` *(chạy từ thư mục repo)* | `→ PASS` |
| Claude Code | Phiên mới → gõ `/` → tìm `fe-` | Thấy 21 skill |
| Codex | Phiên mới → "list the skills you can use" | Thấy các skill `fe-*` (cần xác nhận) |
| Antigravity | Chat mới → gõ `/` | Thấy `fe-*` (cần xác nhận) |
| Chọn đúng skill | "Trang chậm, LCP 3.8 s — nên dùng skill nào?" | Agent chọn `fe-perf` |

## 3. Cách gọi skill trong từng tool

| Tool | Gọi trực tiếp | Gọi bằng lời |
|---|---|---|
| Claude Code | `/fe-layout …` | "Dùng skill fe-layout để …" |
| Antigravity | `/fe-layout …` (cần xác nhận) | như trên |
| Codex | "use the fe-layout skill to …" (một số bản hỗ trợ `$fe-layout`, cần xác nhận) | như trên |

Mọi ví dụ bên dưới viết dạng `/fe-…`. Với Codex, thay `/fe-layout` bằng "use the fe-layout skill:".

Không gọi tên skill cũng được — mô tả rõ vấn đề là agent tự chọn (thử 28 câu: 28/28 đúng, mô phỏng). Gọi thẳng tên khi muốn chắc chắn.

---

# Phần B — Viết prompt chuẩn

## 4. Công thức prompt

```
/<skill> <việc cần làm, một câu>
Phạm vi: <route / trang / file / component / thư mục>
Hiện trạng: <triệu chứng, số liệu, cách tái hiện, ảnh chụp nếu có>
Mục tiêu: <kết quả đo được hoặc kiểm tra được>
Ràng buộc: <không thêm thư viện, không đổi API, không đụng vùng X, giữ design hiện tại…>
Chế độ: <chỉ audit> | <audit + đề xuất, chờ tôi duyệt rồi mới sửa>
Đầu ra: <bảng finding, kế hoạch, diff, checklist…>
```

Không cần đủ 7 dòng. **Ba dòng quan trọng nhất: Phạm vi, Hiện trạng, Mục tiêu.**

| Dòng | Vì sao quan trọng | Ví dụ tốt |
|---|---|---|
| Phạm vi | Agent chỉ đọc đúng chỗ, nhanh và chính xác hơn | `src/components/features/pricing/` |
| Hiện trạng | Agent tìm nguyên nhân thay vì đoán | "Card thứ 2 cao hơn 40px vì có 5 bullet" |
| Mục tiêu | Có tiêu chí "xong" để kiểm tra | "Footer các card nằm cùng một hàng ở ≥ 768px" |
| Ràng buộc | Tránh sửa lan ra ngoài ý muốn | "Không đổi màu, không thêm thư viện" |
| Chế độ | Kiểm soát việc sửa code | "Chỉ audit, chưa sửa" |
| Đầu ra | Nhận kết quả dễ đọc, dễ duyệt | "Bảng: vị trí, class hiện tại, class đề xuất" |

Mẹo:
- Có số liệu thì đưa số liệu (LCP 3.8 s, 120 ms commit, 0.31 CLS).
- Có ảnh chụp → đính kèm; agent sẽ phân tích ảnh rồi đề xuất diff, **chưa sửa** cho tới khi bạn duyệt.
- Một prompt — một vấn đề. Nhiều vấn đề → nhiều prompt, hoặc nhờ `fe-andy` chia việc.
- Viết tiếng Việt thoải mái; giữ nguyên thuật ngữ kỹ thuật (LCP, hydration, focus trap…).

## 5. Cách duyệt, từ chối, sửa đề xuất

Mọi skill đi theo: **đọc → đề xuất → chờ duyệt → sửa → kiểm tra → học**. Sau khi agent đưa đề xuất, bạn trả lời:

| Bạn muốn | Gõ |
|---|---|
| Duyệt hết | `OK, làm hết` / `Proceed` / `chốt` |
| Duyệt một phần | `Làm mục 1 và 3, bỏ mục 2` |
| Sửa đề xuất | `Mục 2 dùng gap-4 thay vì gap-6, rồi làm` |
| Chưa sửa, cần thêm thông tin | `Đo lại trên mobile throttle Slow 4G trước` |
| Dừng | `Dừng, chưa sửa gì` |

Sau khi sửa, agent báo kết quả kiểm tra thật (lệnh + exit code) và dòng `Learned: …` (đã ghi bài học gì, hoặc "nothing new").

### Ngoại lệ: Cơ chế Fast-Path cho chỉnh sửa vi mô (không cần chờ duyệt)
Với các chỉnh sửa siêu nhỏ, an toàn tuyệt đối:
- **Điều kiện (thỏa mãn cả 3):**
  1. Thay đổi $\le 5$ dòng trong đúng 1 file.
  2. Tính chất: Tinh chỉnh giao diện/copy đơn lẻ hoặc lệnh chỉ định rõ ràng (ví dụ: đổi `gap-4` thành `gap-6`, sửa chính tả text, đổi icon, sửa import).
  3. Không rủi ro: Tuyệt đối không chạm vào auth, thanh toán, data store, router, hoặc interface props dùng chung.
- **Cách Agent thực hiện:** Agent sửa trực tiếp với diff tối thiểu, chạy kiểm tra (lint/types) và báo kết quả ngay trong 1 lượt (bỏ qua bước lập bảng chờ duyệt để tránh mất thời gian của bạn).

---

# Phần C — Từng skill: prompt mẫu

Mỗi skill có: **Dùng khi** · **Prompt chuẩn** · **Prompt nhanh** · **Prompt chưa tốt** · **Agent sẽ làm** · **Câu tiếp theo**.

## 6. Bắt đầu dự án

### 6.1 fe-recon — khảo sát repo (chỉ đọc)

**Dùng khi:** mới nhận repo, chưa có `project-profile.md`, trước khi lên kế hoạch lớn.

**Prompt chuẩn**
```
/fe-recon Khảo sát repo này.
Phạm vi: toàn bộ repo, tập trung src/ và cấu hình build.
Mục tiêu: hiểu stack, cấu trúc layer, luồng data/state, rủi ro.
Ràng buộc: chỉ đọc, không chạy install/build.
Đầu ra: báo cáo recon theo template + bản nháp project-profile.md (chưa ghi file, cho tôi xem trước).
```
**Prompt nhanh:** `/fe-recon khảo sát repo này và đề xuất project-profile.md`

**Prompt chưa tốt:** `/fe-recon xem code giúp tôi` → không rõ cần gì; agent sẽ phải đoán phạm vi và đầu ra.

**Agent sẽ làm:** đọc `package.json`, lockfile, tsconfig, config framework, cây thư mục, router, thư viện data/state, styling, i18n, test, CI; liệt kê file lớn, vùng rủi ro; báo cáo 10 mục + câu hỏi chưa xác định được.

**Câu tiếp theo**
- `Ghi project-profile.md vào gốc repo, vùng bảo vệ thêm src/features/payment/**`
- `Từ báo cáo này, nên ưu tiên skill nào trước?`

### 6.2 fe-andy — không biết dùng skill nào

**Prompt chuẩn**
```
/fe-andy Tôi muốn trang /pricing nhanh hơn, đẹp hơn và dễ dùng trên mobile.
Chia việc thành từng bước, mỗi bước chỉ rõ skill nào xử lý và prompt tôi nên gõ.
```
**Agent sẽ làm:** chia việc theo bảng phân vai, trả danh sách bước + skill + prompt gợi ý. fe-andy không tự làm việc chuyên môn.

## 7. Giao diện

### 7.1 fe-layout — khoảng cách, căn lề, responsive, dark mode

**Dùng khi:** gap/padding lộn xộn, card cao thấp khác nhau, icon lệch chữ, vỡ layout trên mobile, cần theme/dark mode.

**Prompt chuẩn (sửa layout)**
```
/fe-layout Các card trong bảng giá có chiều cao khác nhau.
Phạm vi: src/components/features/pricing/PricingGrid.tsx và block PlanCard.
Hiện trạng: card "Pro" có 5 bullet nên cao hơn; nút "Chọn gói" không thẳng hàng giữa các card (ảnh đính kèm).
Mục tiêu: các card cùng chiều cao, nút nằm cùng một hàng ở ≥ 768px; mobile xếp 1 cột.
Ràng buộc: giữ màu và font hiện tại; dùng thang spacing trong project-profile.
Chế độ: đề xuất trước, chờ tôi duyệt.
Đầu ra: bảng | phần tử | file:line | class hiện tại | class đề xuất | lý do |.
```

**Prompt chuẩn (từ ảnh mockup)**
```
/fe-layout So ảnh mockup đính kèm với trang /about hiện tại.
Liệt kê chênh lệch về khoảng cách, căn lề, kích thước chữ; đề xuất class thay đổi cụ thể.
Chưa sửa code.
```

**Prompt chuẩn (dark mode)**
```
/fe-layout Thêm dark mode có 3 lựa chọn: sáng, tối, theo hệ thống.
Phạm vi: token trong src/app/globals.css, layout gốc, nút chuyển theme ở header.
Ràng buộc: không nháy sai theme khi tải trang; component chỉ dùng token semantic.
Đầu ra: kế hoạch file cần sửa + danh sách màu hard-code cần thay; sau khi sửa chạy fe-contrast cho cả 2 theme.
```

**Prompt nhanh:** `/fe-layout card giá cao thấp khác nhau, nút không thẳng hàng — PricingGrid.tsx` · `/fe-layout CSS của thư viện datepicker ghi đè utility Tailwind v4, sắp xếp lại @layer` · `/fe-layout làm tooltip/menu bằng popover + anchor positioning, có fallback`

**Prompt chưa tốt:** `/fe-layout làm cho đẹp hơn` → không có phạm vi, không có tiêu chí "đẹp"; nên chỉ rõ chỗ nào và sai thế nào (hoặc dùng fe-ux để brainstorm).

**Agent sẽ làm:** map vùng giao diện → file:line, đề xuất class theo thang spacing, chờ duyệt, sửa, kiểm tra ở 360/768/1024/1440px, không có cuộn ngang, cả hai theme.

**Câu tiếp theo:** `Kiểm tra lại ở 360px và chụp lại các chỗ đã sửa` · `Áp dụng cùng pattern cho trang /services`

### 7.2 fe-contrast — độ tương phản màu

**Dùng khi:** chữ khó đọc, kiểm tra bảng màu/token, header trong suốt đè lên nhiều nền, sau khi đổi theme.

**Prompt chuẩn**
```
/fe-contrast Kiểm tra độ tương phản các token màu chữ/nền.
Phạm vi: token trong src/app/globals.css, cả light và dark.
Mục tiêu: WCAG 2.2 AA (chữ thường 4.5:1, chữ lớn và UI 3:1).
Đầu ra: tạo contrast.config.json ở gốc dự án, chạy script, bảng cặp màu FAIL + đề xuất màu thay thế nhỏ nhất để PASS.
```
**Prompt chuẩn (header trong suốt)**
```
/fe-contrast Header nền trắng 86% + blur đè lên các section khi cuộn.
Kiểm tra 3 trạng thái: top, scrolled, menu-open, trên tất cả màu nền section của trang chủ.
```
**Prompt nhanh:** `/fe-contrast #6B7280 trên #FFFFFF có đạt AA không?`

**Prompt chưa tốt:** `/fe-contrast màu có ổn không` → không nói màu nào, nền nào, mức AA hay AAA.

**Agent sẽ làm:** gom cặp màu → chạy `verify-contrast.mjs` → bảng tỉ lệ, PASS/FAIL → đề xuất đổi token → chạy lại tới khi exit code 0.

### 7.3 fe-a11y — bàn phím, focus, trình đọc màn hình

**Dùng khi:** không Tab được vào menu/modal, mất focus, thiếu label, audit WCAG.

**Prompt chuẩn**
```
/fe-a11y Audit accessibility cho luồng đăng ký.
Phạm vi: /signup (form 3 bước) và modal xác nhận email.
Hiện trạng: Tab không vào được modal; lỗi validate không được đọc lên.
Mục tiêu: WCAG 2.2 AA; dùng được hoàn toàn bằng bàn phím.
Đầu ra: bảng | vấn đề | tiêu chí WCAG | file:line | phát hiện bằng (axe/bàn phím) | cách sửa |; ghi rõ phần chưa test được.
```
**Prompt nhanh:** `/fe-a11y modal Checkout không bẫy focus và Esc không đóng được`

**Prompt chưa tốt:** `/fe-a11y check a11y toàn site` → quá rộng; nên chọn 1–2 luồng quan trọng.

**Agent sẽ làm:** kiểm semantic, focus, ARIA, thông báo lỗi, kích thước target, các tiêu chí mới của WCAG 2.2; đề xuất sửa; sau khi sửa: axe + đi bộ bằng bàn phím.

### 7.4 fe-motion — animation mượt

**Dùng khi:** cuộn giật, GSAP/ScrollTrigger lag, animation chạy mãi tốn CPU, canvas/WebGL nặng.

**Prompt chuẩn**
```
/fe-motion Section hero giật khi cuộn trên laptop yếu.
Phạm vi: src/components/features/home/Hero*.tsx (GSAP ScrollTrigger + canvas sóng).
Hiện trạng: rớt khung khi cuộn qua hero; CPU cao kể cả khi đứng yên.
Mục tiêu: mượt ở CPU throttle 4×; CPU gần 0% khi không có tương tác; hỗ trợ prefers-reduced-motion.
Chế độ: đo trước (Performance trace), đề xuất, chờ duyệt.
```
**Prompt nhanh:** `/fe-motion marquee logo chạy mãi gây nóng máy, cần dừng khi khuất màn hình` · `/fe-motion chuyển từ lưới sản phẩm sang trang chi tiết bằng View Transitions, có reduced motion` · `/fe-motion thanh tiến độ đọc bài bằng scroll-driven animation, fallback cho Firefox`

**Prompt chưa tốt:** `/fe-motion thêm animation cho đẹp` → đây là yêu cầu thiết kế; dùng fe-ux để đề xuất, fe-motion để làm mượt.

### 7.5 fe-skel — skeleton và trạng thái loading/empty/error

**Dùng khi:** trang nhảy khi tải dữ liệu, cần skeleton, chuẩn hóa 4 trạng thái, API lỗi hiển thị xấu.

**Prompt chuẩn**
```
/fe-skel Danh sách hóa đơn bị nhảy layout khi tải.
Phạm vi: src/components/features/invoices/InvoiceList.tsx.
Hiện trạng: lúc tải hiện spinner nhỏ, xong thì bảng xuất hiện đẩy footer xuống; lỗi API chỉ hiện trang trắng.
Mục tiêu: skeleton khớp 1:1 với bảng (10 dòng), không layout shift; có trạng thái trống và lỗi có nút thử lại.
Ràng buộc: dùng component trạng thái chung của dự án (xem project-profile).
```
**Prompt nhanh:** `/fe-skel thêm skeleton khớp layout cho ProfileCard`

**Prompt chưa tốt:** `/fe-skel thêm loading` → không nói vùng nào; skeleton phải bám đúng layout thật.

**Lưu ý phân vai:** câu chữ thông báo lỗi/trống → fe-ux; logic retry/cache → fe-data.

### 7.6 fe-viz — biểu đồ, KPI, dashboard

**Prompt chuẩn**
```
/fe-viz Thiết kế các biểu đồ cho dashboard doanh thu.
Bối cảnh: Next.js App Router, Tailwind v4 có token màu, dark mode; dữ liệu 90 ngày, API trả về theo ngày.
Câu hỏi cần trả lời: doanh thu theo ngày có tăng không; top 5 danh mục; tỷ lệ chuyển đổi theo bước.
Đầu ra: bảng chọn loại biểu đồ theo câu hỏi, đề xuất thư viện (có verdict fe-review), quy tắc màu từ token, a11y (tóm tắt + bảng dữ liệu + bàn phím), skeleton cùng tỷ lệ.
Ràng buộc: không sửa engine biểu đồ đang có; không cài thư viện khi chưa duyệt.
```
**Prompt nhanh:** `/fe-viz scatter 50.000 điểm bị giật khi hover, có nên chuyển sang canvas?` · `/fe-viz biểu đồ này fail axe: không có tên, chỉ phân biệt bằng màu` · `/fe-viz thêm sparkline vào bảng 5.000 dòng mà không chậm`

## 8. Trải nghiệm

### 8.1 fe-ux — đề xuất layout, review luồng, form, câu chữ

**Chế độ 1 — Brainstorm (không viết code)**
```
/fe-ux Đề xuất 3 layout cho trang so sánh gói dịch vụ.
Người dùng: chủ shop nhỏ, chủ yếu xem trên điện thoại.
Mục tiêu: chọn được gói trong < 30 giây; hành động chính là "Bắt đầu dùng thử".
Ràng buộc: dùng block có sẵn nếu được.
Đầu ra: mỗi phương án có sơ đồ khung, hành động chính, lý do, chi phí, rủi ro; đề xuất 1 phương án.
```
→ Bạn chọn: `Chọn phương án B, bỏ phần FAQ` → **Chế độ 2:** agent dựng theo phương án đã chọn.

**Review form**
```
/fe-ux Review UX form thanh toán.
Phạm vi: /checkout bước 2 (địa chỉ + thẻ).
Hiện trạng: tỉ lệ bỏ giữa chừng cao; người dùng hay nhập sai số điện thoại.
Đầu ra: bảng | vấn đề | vị trí | heuristic | mức ảnh hưởng | đề xuất |.
```

**Câu chữ giao diện**
```
/fe-ux Viết lại câu chữ cho trang hóa đơn: nút, thông báo lỗi, trạng thái trống (lần đầu / không có kết quả).
Giọng: thân thiện, ngắn gọn. Có cả tiếng Việt và tiếng Anh.
Đầu ra: bảng | vị trí | hiện tại | đề xuất vi | đề xuất en |.
```

**Prompt chưa tốt:** `/fe-ux trang này UX thế nào` → nên nêu người dùng, mục tiêu, luồng cần review.

### 8.2 fe-i18n — bản dịch, định dạng, đổi ngôn ngữ

**Prompt chuẩn**
```
/fe-i18n Kiểm tra bản dịch và định dạng.
Phạm vi: messages/en.json, messages/vi.json; component định dạng tiền và ngày trong src/lib/format.ts.
Mục tiêu: không thiếu key, không placeholder lệch; tiền VND hiển thị 250.000 ₫ cho vi, $ cho en;
đổi ngôn ngữ giữ nguyên trang, query và #hash.
Đầu ra: kết quả script check-i18n + danh sách chỗ định dạng sai + kế hoạch sửa.
```
**Prompt nhanh:** `/fe-i18n vi.json thiếu key nào so với en.json?` · `/fe-i18n hạn chót hiển thị sớm 1 ngày với người dùng ở New York, rà cách lưu và hiển thị ngày` · `/fe-i18n chọn Temporal hay date-fns cho dự án này, có DST`

**Prompt chưa tốt:** `/fe-i18n dịch hết sang tiếng Việt` → dịch nội dung không phải trọng tâm skill; nếu cần, nói rõ để agent đánh dấu "cần review" cho câu chưa chắc.

## 9. Hiệu năng & dữ liệu

### 9.1 fe-perf — trang chậm, bundle, re-render, Next.js

**Prompt chuẩn (trang chậm)**
```
/fe-perf Trang /news chậm trên mobile.
Phạm vi: route /news (Next.js App Router).
Hiện trạng: PageSpeed mobile LCP 3.8 s, INP 280 ms, CLS 0.05.
Mục tiêu: LCP ≤ 2.5 s, INP ≤ 200 ms.
Ràng buộc: không thêm thư viện; không đụng module thanh toán.
Chế độ: đo baseline trước, bảng nguyên nhân theo ưu tiên, chờ duyệt, sửa từng mục, đo lại báo trước/sau.
```
**Prompt chuẩn (re-render)**
```
/fe-perf Danh sách sản phẩm re-render mỗi lần gõ vào ô tìm kiếm.
Phạm vi: src/components/features/catalog/.
Hiện trạng: Profiler thấy commit 120 ms mỗi phím.
Mục tiêu: < 16 ms mỗi phím. Không memo bừa — chỉ sửa chỗ có bằng chứng.
```
**Prompt chuẩn (bundle)**
```
/fe-perf Bundle trang chủ quá lớn.
Chạy build rồi check-bundle-size với ngân sách 400 KB gzip; liệt kê 10 file lớn nhất và nguyên nhân (import cả thư viện, client component quá cao…).
```
**Prompt nhanh:** `/fe-perf lỗi hydration "text content does not match" ở trang /profile`

**Prompt chưa tốt:** `/fe-perf tối ưu toàn bộ app` → không có baseline, không có mục tiêu; agent không biết dừng ở đâu.

### 9.2 fe-data — fetch, cache, hủy request, realtime

**Prompt chuẩn**
```
/fe-data Kết quả tìm kiếm đôi khi hiển thị sai từ khóa.
Phạm vi: src/hooks/swr/useSearchProducts.ts và ô tìm kiếm ở header.
Hiện trạng: gõ nhanh "ao", "ao khoac" → đôi khi hiện kết quả của "ao".
Mục tiêu: luôn hiện kết quả của từ khóa cuối; request cũ bị hủy.
Đầu ra: nguyên nhân + diff đề xuất + cách kiểm tra (Network tab, Slow 3G).
```
**Prompt chuẩn (realtime)**
```
/fe-data Bảng giá realtime qua WebSocket bị đứng sau khi mất mạng.
Mục tiêu: tự kết nối lại (backoff), báo "Đang kết nối lại…", lấy lại dữ liệu bị lỡ.
```
**Prompt nhanh:** `/fe-data trang dashboard gọi 3 API tuần tự, chuyển sang song song` · `/fe-data sinh client TypeScript từ file OpenAPI, nối vào TanStack Query, thêm bước CI chặn drift` · `/fe-data nên dùng GraphQL (urql/Apollo) hay REST cho dự án này?`

**Prompt chưa tốt:** `/fe-data gọi API cho nhanh` → nói rõ API nào, chậm vì sao (tuần tự? trùng lặp? không cache?).

## 10. Code

### 10.1 fe-code — viết code mới

**Prompt chuẩn**
```
/fe-code Tạo block OrderSummaryCard và dùng ở trang Checkout.
Yêu cầu: hiển thị danh sách món, tạm tính, phí ship, tổng; có nút "Thanh toán".
Phạm vi: block ở src/components/blocks/, feature ở src/components/features/checkout/.
Ràng buộc: block chỉ nhận props, không gọi API; có đủ 4 trạng thái; mọi chữ qua i18n.
Chế độ: đưa danh sách file + API props trước, chờ duyệt rồi mới viết.
```
**Prompt nhanh:** `/fe-code tạo hook useDebouncedValue có test` · `/fe-code mở chi tiết sản phẩm dạng modal từ lưới nhưng URL chia sẻ được và F5 vẫn chạy (intercepting route)` · `/fe-code dashboard có 2 panel tải độc lập bằng parallel routes`

**Prompt chưa tốt:** `/fe-code làm trang checkout` → quá lớn; chia thành block, feature, form; nếu chưa rõ UX thì dùng fe-ux trước.

### 10.2 fe-clean — refactor code cũ

**Prompt chuẩn**
```
/fe-clean Dọn component BillingPage.tsx (400 dòng, trộn fetch + state + style).
Mục tiêu: tách thành feature + block đúng layer; bỏ any; không đổi hành vi.
Ràng buộc: từng bước nhỏ, sau mỗi bước chạy lint + tsc.
Đầu ra: báo cáo nợ kỹ thuật + kế hoạch refactor theo thứ tự, chờ duyệt.
```
**Prompt nhanh:** `/fe-clean tìm any và as unknown as trong src/features/billing`

**Prompt chưa tốt:** `/fe-clean viết lại cho sạch` → dễ thành viết lại toàn bộ; nên yêu cầu "từng bước nhỏ, không đổi hành vi".

### 10.3 fe-test — kiểm tra và viết test

**Prompt chuẩn (trước khi mở PR)**
```
/fe-test Kiểm tra thay đổi trên nhánh này trước khi mở PR.
Thay đổi: sửa form đăng ký + hook validate (mức rủi ro trung bình).
Đầu ra: bảng | kiểm tra | lệnh | exit code | ghi chú |; tách lỗi có sẵn và lỗi mới.
```
**Prompt chuẩn (viết test)**
```
/fe-test Viết test cho form đăng ký.
Phạm vi: src/components/features/signup/.
Cần: unit cho validator; component test cho 4 trạng thái và lỗi email; 1 E2E đăng ký thành công; axe cho trang /signup.
Ràng buộc: dùng công cụ test đã có trong package.json; không cài thêm.
```
**Prompt nhanh:** `/fe-test chạy lint, tsc, test và build` · `/fe-test đưa interaction test của Storybook vào CI, fail khi có lỗi a11y`

## 11. Bảo mật, phát hành & kiến trúc

### 11.1 fe-sec — bảo mật frontend

**Prompt chuẩn (trước release)**
```
/fe-sec Rà soát bảo mật frontend trước release.
Phạm vi: toàn bộ src/, next.config, file .env.example.
Trọng tâm: XSS (dangerouslySetInnerHTML, nội dung CMS), lộ secret qua NEXT_PUBLIC_*, header/CSP, open redirect ở login, lưu token.
Ràng buộc: không in giá trị secret — chỉ tên biến và file:line.
Đầu ra: bảng theo mức Critical/High/Medium/Low + cách sửa + cách kiểm tra.
```
**Prompt chuẩn (cổng kiểm tra trước deploy)**
```
/fe-sec Chạy cổng kiểm tra bảo mật trước khi merge vào nhánh release.
Phạm vi: src/, .env.production (chỉ báo tên biến), build production.
Việc cần làm: quét sink XSS và lập sink inventory; check-env-secrets.mjs; build rồi chạy check-build-output.mjs (không có *.map, không secret trong bundle); với mỗi nút/route ẩn theo role, ghi rõ server check tương ứng.
Đầu ra: bảng cổng kiểm tra (✓/✗ + bằng chứng), ngoại lệ có người chịu trách nhiệm + ngày.
```
**Prompt chuẩn (app desktop)**
```
/fe-sec Rà soát bảo mật bản đóng gói Electron (hoặc Tauri) của app.
Phạm vi: electron/main.ts, electron/preload.ts, cấu hình BrowserWindow (hoặc src-tauri/capabilities, tauri.conf.json, các #[tauri::command]).
Trọng tâm: contextIsolation/nodeIntegration/sandbox, preload chỉ expose API hẹp có kiểu, mọi IPC được validate ở main, CSP, fuses/ký số/updater; không in secret.
Đầu ra: checklist desktop-apps.md §1.7 hoặc §2.6 + bảng finding theo mức.
```
**Prompt chuẩn (auth)**
```
/fe-sec Người dùng thỉnh thoảng bị đăng xuất ngẫu nhiên.
Phạm vi: src/lib/api-client.ts (refresh token), middleware.ts.
Nghi ngờ: nhiều request cùng refresh một lúc.
```
**Prompt nhanh:** `/fe-sec có biến NEXT_PUBLIC_ nào chứa secret không?` · `/fe-sec site đang public file .js.map không?` · `/fe-sec ẩn nút Xoá với non-admin là đủ chưa?` · `/fe-sec thiết kế đăng nhập OIDC của công ty bằng Authorization Code + PKCE qua BFF` · `/fe-sec thêm passkey làm cách đăng nhập, giữ OTP làm dự phòng`

> Bốn quy tắc fe-sec luôn áp dụng: (1) **UI chỉ là affordance**: ẩn nút theo role không phải bảo mật, server mới là nơi kiểm tra quyền; (2) **không bao giờ để source map ra production**; (3) **mọi sink XSS phải nằm trong sink inventory** trước khi release; (4) **app desktop = trình duyệt có quyền truy cập OS**: cô lập renderer, bridge hẹp, validate mọi IPC. Chi tiết: [fe-sec §2](skills/fe-sec/SKILL.md), [desktop-apps.md](skills/fe-sec/references/desktop-apps.md).

### 11.2 fe-ship — release, CI/CD, giám sát, SEO

**Prompt chuẩn**
```
/fe-ship Chuẩn bị release v2.3.
Bối cảnh: deploy lên Vercel; Sentry chưa cấu hình; chưa có sitemap.
Đầu ra: checklist release (✓/✗ + bằng chứng), kế hoạch cấu hình Sentry (lọc dữ liệu cá nhân), sitemap + canonical + hreflang cho en/vi.
Ràng buộc: không tự deploy.
```
**Prompt nhanh:** `/fe-ship viết GitHub Actions chạy lint, tsc, test, build cho PR` · `/fe-ship checkout lỗi từ lần deploy 20 phút trước, chạy quy trình sự cố: làm gì trước?` · `/fe-ship tách repo thành apps/ và packages/, publish gói ui nội bộ bằng changesets` · `/fe-ship chạy A/B test nút mua hàng không bị nháy giao diện`

Thêm cho fe-code: `/fe-code upload video 2 GB có thanh tiến độ, hủy được, nối lại khi rớt mạng` · `/fe-code viết story Storybook + interaction test cho Button và Card`

### 11.3 fe-pwa — offline, service worker, cài đặt như app

**Prompt chuẩn**
```
/fe-pwa Cho app chạy được khi mất mạng.
Bối cảnh: Next.js App Router; nhân viên hiện trường nhập form ở nơi sóng yếu.
Đầu ra: bảng chiến lược cache theo loại route, cách xếp hàng thao tác ghi khi offline (IndexedDB), luồng cập nhật phiên bản mới, manifest + icon.
Ràng buộc: không cache dữ liệu cá nhân dùng chung; có kill switch trước khi lên production.
```
**Prompt nhanh:** `/fe-pwa deploy xong người dùng vẫn thấy bản cũ, kiểm tra service worker`

### 11.4 fe-mfe — micro-frontend

**Prompt chuẩn**
```
/fe-mfe Có nên tách frontend thành micro-frontend không?
Bối cảnh: 4 team (catalog, checkout, account, CMS), mỗi team muốn deploy riêng; hiện 1 repo Next.js, pipeline 60 phút.
Đầu ra: đi qua cây quyết định, so sánh Multi-Zones / Module Federation / monorepo, đề xuất + ADR.
Ràng buộc: chưa sửa code.
```
**Prompt nhanh:** `/fe-mfe load remote checkout bị lỗi "Invalid hook call"`

### 11.5 fe-review — thẩm định kiến thức trước khi áp dụng

**Prompt chuẩn**
```
/fe-review Thẩm định khuyến nghị này trước khi áp dụng: "<dán đoạn khuyến nghị / link bài viết / đề xuất thư viện>".
Phiên bản dự án: lấy từ project-profile.md.
Đầu ra: từng claim → nguồn đã kiểm tra → mức bằng chứng → kết luận (Still Best Practice / Acceptable / Outdated / Harmful) → phiên bản cải tiến.
```
**Prompt nhanh:** `/fe-review React 19 có còn cần bọc useCallback mọi nơi không?`

> Quy tắc: trước khi coi một pattern mới là "chuẩn" (thư viện mới, kiến trúc mới, lời khuyên từ blog hay AI), luôn chạy qua `fe-review`.

---

# Phần D — Bổ sung kiến thức vào bộ skill

## 12. fe-learn — thu thập → kiểm tra → kế hoạch → chốt → bổ sung

### 12.1 Hai cách kiến thức đi vào bộ skill

| Cách | Khi nào | Cần duyệt? |
|---|---|---|
| **Tự động ghi chú** | Cuối mỗi tác vụ với bất kỳ skill nào; agent ghi bài học mới vào `references/learned.md` của skill đó | Không (chỉ ghi thêm ghi chú) |
| **fe-learn** | Bạn muốn đưa kiến thức mới vào nội dung chính, hoặc tạo skill mới | **Có** — agent đưa kế hoạch, bạn chốt rồi mới sửa |

Thông tin riêng của dự án (tên, đường dẫn, màu thương hiệu, quyết định thiết kế) luôn đi vào `project-profile.md` của dự án, không vào bộ skill.

### 12.2 Quy trình fe-learn

```
1. Thu thập   — ghi chú đang chờ, việc làm trong phiên, code/tài liệu bạn chỉ ra, phiên bản thư viện mới
2. Phân loại  — chung (vào bộ skill) / riêng dự án (vào project-profile) / chưa đủ bằng chứng / skill mới
3. Kiểm tra   — tìm trong toàn bộ skill: Mới / Mở rộng / Sửa luật cũ / Trùng / Xung đột
4. Kế hoạch   — bảng đánh số, rồi DỪNG chờ bạn
5. Bạn chốt   — "chốt", "chốt 1,2", hoặc yêu cầu sửa kế hoạch
6. Bổ sung    — chỉ làm các mục đã chốt
7. Kiểm tra   — health check PASS; nếu có skill mới → chạy lại script cài
8. Báo cáo    — mục đã làm, file đã sửa, ghi chú còn chờ
```

### 12.3 Prompt mẫu

**Thu thập từ dự án đang làm**
```
/fe-learn Thu thập kiến thức mới từ dự án này và phiên làm việc hôm nay.
Nguồn: ghi chú learned.md đang chờ; các sửa lỗi hiệu năng ảnh hero và hydration hôm nay; thư mục src/lib/format/.
Kiểm tra trùng/xung đột với toàn bộ bộ skill.
Đưa kế hoạch dạng bảng, phần riêng dự án tách sang project-profile. Chưa sửa gì cho tới khi tôi chốt.
```

**Ghi nhanh một bài học**
```
/fe-learn ghi nhớ: next/image cho ảnh hero phải có sizes đúng, nếu không trình duyệt tải ảnh 1.2 MB thay vì 180 KB (đã đo bằng Lighthouse).
```

**Đề xuất skill mới**
```
/fe-learn Dự án hay làm biểu đồ (Recharts, ECharts). Kiểm tra bộ skill đã phủ chưa;
nếu chưa đủ thì đề xuất skill mới fe-chart (mô tả, phạm vi, ranh giới với fe-perf và fe-motion), chưa tạo file.
```

**Chỉ kiểm tra sức khỏe**
```
/fe-learn kiểm tra sức khỏe bộ skill và liệt kê ghi chú đang chờ
```

### 12.4 Ví dụ một lượt đầy đủ

**Bạn:**
```
/fe-learn Thu thập kiến thức mới từ dự án shop-web và phiên hôm nay, đưa kế hoạch, chưa sửa.
```

**Agent (rút gọn):**
```
## Skill-set update plan — 2026-11-02 (source: shop-web + session)

| # | Item | Source | Decision | Target | Change summary | Evidence | Risk |
|---|---|---|---|---|---|---|---|
| 1 | Hero next/image cần sizes | session | Extend | fe-perf → references/nextjs.md §4 | thêm luật + ví dụ | Lighthouse 1.2 MB → 180 KB | Low |
| 2 | Hydration do format ngày theo timezone | learned.md (fe-i18n) | Duplicate | — | đã có ở fe-i18n §2 | — | — |
| 3 | Dự án dùng nuqs cho URL state | project | Profile | shop-web/project-profile.md §1 | thêm vào bảng stack | package.json | Low |
| 4 | Recharts tooltip làm INP cao | session | New | fe-perf → references/react-runtime.md | throttle tooltip, ví dụ | trace 260 → 90 ms | Low |
| 5 | "Nên dùng skeleton màu xám nhạt" | session | Reject | — | ý thích, không có bằng chứng | — | — |

Project-profile updates: #3
New skills proposed: none
Reply "chốt" / "chốt 1,4" / ask for changes.
```

**Bạn:** `chốt 1,3,4`

**Agent:** sửa `nextjs.md`, `react-runtime.md`, ghi `project-profile.md` của shop-web, đánh dấu ghi chú `promoted`, chạy health check:
```
## Skill-set update — done
| # | Decision | File changed | Status |
| 1 | Extend | fe-perf/references/nextjs.md | done |
| 3 | Profile | shop-web/project-profile.md | done |
| 4 | New | fe-perf/references/react-runtime.md | done |
Health check: PASS (0 errors, 0 warnings)
Re-run installer: no
Pending notes left: none
```

### 12.5 Khi có skill mới

fe-learn chỉ đề xuất skill mới khi: chưa skill nào phủ lĩnh vực đó, có ít nhất 3 luật đã kiểm chứng, và từ khóa kích hoạt không trùng skill khác. Nếu bạn chốt, agent tạo skill từ [skill-template.md](skills/fe-learn/references/skill-template.md), thêm vào bảng điều hướng và bảng phân vai, thêm câu thử routing. Sau đó **bạn chạy lại script cài** để mọi tool có liên kết tới skill mới:
```powershell
powershell -ExecutionPolicy Bypass -File <duong-dan-repo>\fe-skill-andy\scripts\install-skills.ps1
```

### 12.6 Nhịp khuyến nghị

- Sau mỗi tác vụ: xem dòng `Learned: …` ở cuối câu trả lời. Không thấy → nhắc "chạy learning loop".
- Cuối mỗi tuần hoặc cuối dự án: `/fe-learn thu thập và đưa kế hoạch`.
- Sau khi chốt: commit repo fe-skill-andy để lưu lại.

---

# Phần E — Tham khảo

## 13. Kịch bản kết hợp

| Mục tiêu | Chuỗi lệnh |
|---|---|
| Nhận dự án mới | `fe-recon` → ghi `project-profile.md` → `fe-andy` chia việc |
| Trang chậm | `fe-perf` (đo, sửa) → `fe-skel` nếu CLS do loading → `fe-test` |
| Tính năng mới | `fe-ux` (chọn layout) → `fe-code` → `fe-skel` → `fe-i18n` → `fe-test` |
| Chuẩn a11y | `fe-a11y` → `fe-contrast` (cả 2 theme) → `fe-test` (axe) |
| Dọn nợ kỹ thuật | `fe-clean` (từng bước) → `fe-test` |
| Release | `fe-sec` → `fe-test` mức cao → `fe-ship` |
| Cuối dự án | `fe-learn` thu thập → chốt → bổ sung |
| Thêm offline / PWA | `fe-review` (chọn công cụ) → `fe-pwa` → `fe-data` (trạng thái trong app) → `fe-test` → `fe-ship` |
| Nhiều team, muốn deploy độc lập | `fe-recon` → `fe-mfe` (cây quyết định) → `fe-review` → `fe-ship` |
| Áp dụng thư viện / pattern mới | `fe-review` → skill sở hữu (fe-code, fe-data…) → `fe-test` |
| Dự án mới từ đầu | Xem [Phần F](#18-trang-tĩnh-hay-trang-động) |
| Review PR, viết ADR, quy ước git/commit/PR | `fe-andy` với [engineering-workflow.md](skills/fe-andy/references/engineering-workflow.md): "/fe-andy viết ADR cho việc chuyển Redux sang TanStack Query" · "/fe-andy review PR #123 theo thứ tự đúng → bảo mật → a11y → hiệu năng" |

## 14. Script kiểm tra

Chỉ dùng Node.js, không cài gì, chạy được từ mọi thư mục. Exit code `1` = có lỗi (dùng được trong CI). Đường dẫn `skills/...` tính từ gốc repo fe-skill-andy.

| Script | Lệnh | Kiểm tra |
|---|---|---|
| Health check bộ skill | `node skills/fe-andy/scripts/check-skills.mjs` | name, description, link hỏng, đường dẫn tuyệt đối, file chưa link, ghi chú đang chờ |
| Contrast một cặp | `node skills/fe-contrast/scripts/verify-contrast.mjs --fg "#4B5563" --bg "#FFFFFF"` | tỉ lệ, PASS/FAIL AA |
| Contrast theo cấu hình | `node skills/fe-contrast/scripts/verify-contrast.mjs --config <dự-án>/contrast.config.json --level AA` | nhiều cặp, header trong suốt ([định dạng](skills/fe-contrast/references/config-schema.md)) |
| Đồng bộ bản dịch | `node skills/fe-i18n/scripts/check-i18n.mjs <dự-án>/messages/en.json <dự-án>/messages/vi.json` | thiếu, thừa, rỗng, placeholder lệch |
| Kích thước bundle | `node skills/fe-perf/scripts/check-bundle-size.mjs <dự-án>/.next/static --budget 400` | tổng JS/CSS, 10 file lớn nhất, so ngân sách |

## 15. Cập nhật, gỡ cài đặt

| Việc | Cách làm |
|---|---|
| Cập nhật skill | `git pull` trong repo; mở phiên mới để tool nạp lại |
| Có skill mới | Chạy lại `install-skills.ps1` (chỉ tạo liên kết còn thiếu) |
| Gỡ khỏi một tool | `powershell -ExecutionPolicy Bypass -File scripts\install-skills.ps1 -Tools codex -Uninstall` |
| Gỡ khỏi tất cả | `powershell -ExecutionPolicy Bypass -File scripts\install-skills.ps1 -Uninstall` |
| Di chuyển repo | Gỡ → di chuyển → cài lại |

Gỡ cài đặt chỉ xóa liên kết trỏ về repo này; không xóa nội dung repo, không đụng skill khác.

## 16. Xử lý sự cố

| Hiện tượng | Nguyên nhân thường gặp | Cách xử lý |
|---|---|---|
| Tool không thấy skill | Sai thư mục cho phiên bản tool | Cài lại với `-IncludeLegacy`; mở phiên mới |
| Thấy skill nhưng thiếu luật chung | Không cài `fe-andy` | Cài cả bộ |
| Skill xuất hiện hai lần | Cài cả liên kết lẫn plugin, hoặc cả thư mục mới và cũ | Giữ một cách cài |
| Còn skill `merge` cũ | Liên kết tạo trước khi đổi tên | Xóa liên kết `merge`, cài lại |
| `skip (exists, not ours)` | Đã có thư mục cùng tên của bộ khác | Kiểm tra, đổi tên/xóa rồi cài lại |
| Agent chọn sai skill | Hai mô tả chồng nhau | Gọi thẳng tên skill; báo lại bằng `/fe-learn` để sửa mô tả |
| Agent sửa code khi chưa duyệt | Prompt không nói chế độ | Thêm "Chế độ: đề xuất trước, chờ tôi duyệt" |
| Không thấy dòng `Learned:` | Agent bỏ qua bước học | Nhắc "chạy learning loop" |
| Script báo không tìm thấy file | Sai thư mục hiện tại | Dùng đường dẫn đầy đủ |
| PowerShell chặn script | Execution policy | `powershell -ExecutionPolicy Bypass -File …` |

## 17. Câu hỏi thường gặp

**Agent có tự sửa code không?** Không, trừ khi bạn duyệt. `fe-recon` không bao giờ sửa code.

**Có gửi dữ liệu ra ngoài không?** Các script không gọi mạng. Bước nào cần tải gói (`npx …`) hoặc gọi URL thì agent phải hỏi trước.

**Không dùng Next.js thì sao?** Skill viết chung cho React/Vite/Next; phần riêng Next.js ở [fe-perf/references/nextjs.md](skills/fe-perf/references/nextjs.md). Ghi stack vào `project-profile.md`.

**Có bắt buộc `project-profile.md`?** Không, nhưng nên có. Thiếu thì agent nói rõ giả định hoặc hỏi bạn.

**Ghi chú học được ở đâu?** `skills/<skill>/references/learned.md` trong repo này. Commit định kỳ.

**Tài liệu liên quan:** [README.md](README.md) · [HOW-IT-LEARNS.md](HOW-IT-LEARNS.md) · [audit/install-guide.md](audit/install-guide.md) · [conventions.md](skills/fe-andy/references/conventions.md) · [learning-loop.md](skills/fe-andy/references/learning-loop.md)

---

# Phần F — Làm dự án từ A–Z

Bản đầy đủ (tiếng Anh, dành cho agent, dạng plan): [playbooks.md](skills/fe-andy/references/playbooks.md) và [case-study-ecommerce.md](skills/fe-andy/references/case-study-ecommerce.md). Phần này tóm tắt bằng tiếng Việt kèm prompt mẫu cho từng bước.

## 18. Trang tĩnh hay trang động?

| Câu hỏi | Tĩnh | Động |
|---|---|---|
| Mọi người xem cùng một nội dung? | Có (có thể khác theo ngôn ngữ) | Không: theo user, phiên, quyền |
| Nội dung đổi khi nào? | Khi xuất bản | Mỗi request / realtime |
| Có đăng nhập, giỏ hàng, dữ liệu cá nhân? | Không (tối đa form liên hệ) | Có |
| Cách render | SSG / static export / ISR | SSR + streaming (trang công khai), RSC/CSR (trang app) |

Hầu hết sản phẩm thật là **lai**: quyết định **theo từng route**, không theo cả dự án. Ví dụ web bán hàng: trang chủ, danh mục và chi tiết sản phẩm là tĩnh hoặc cache; giỏ hàng, thanh toán và tài khoản là động.

## 19. Playbook trang tĩnh

(landing, marketing, docs, blog, portfolio)

| # | Bước | Skill | Prompt mẫu |
|---|---|---|---|
| 1 | Tạo project profile, ngân sách hiệu năng | fe-andy | `/fe-andy tạo project-profile.md cho landing page Next.js, 2 ngôn ngữ vi/en, LCP ≤ 2.5s` |
| 2 | Đề xuất 2–3 layout (chưa code) | fe-ux | `/fe-ux Mode 1: đề xuất 3 layout cho trang chủ, có mockup` |
| 3 | Token màu, spacing, chữ, dark mode | fe-layout → fe-contrast | `/fe-layout dựng token trong globals.css theo spacing 2·3·4·6·8` rồi `/fe-contrast kiểm tra toàn bộ cặp màu` |
| 4 | Dựng section thành Block | fe-code | `/fe-code tạo các block hero, feature-grid, pricing, faq — chỉ nhận props` |
| 5 | Animation (nếu có) | fe-motion | `/fe-motion thêm scroll reveal nhẹ, tôn trọng reduced motion` |
| 6 | Accessibility | fe-a11y | `/fe-a11y audit landmark, heading, skip link, focus` |
| 7 | Hiệu năng | fe-perf | `/fe-perf tối ưu LCP ảnh hero, font, script bên thứ ba` |
| 8 | SEO | fe-ship | `/fe-ship metadata, canonical, OG, sitemap, robots, JSON-LD Organization` |
| 9 | Đa ngôn ngữ | fe-i18n | `/fe-i18n kiểm tra vi.json đủ key so với en.json, hreflang` |
| 10 | Header bảo mật, chống spam form | fe-sec | `/fe-sec header bảo mật + chống spam form liên hệ` |
| 11 | (Tuỳ chọn) trang offline | fe-pwa | `/fe-pwa thêm trang offline đơn giản (case A)` |
| 12 | Kiểm tra + release | fe-test → fe-ship | `/fe-test chạy lint, tsc, build, axe` rồi `/fe-ship checklist release` |

**Xong khi:** mọi trang được pre-render; LCP đạt ngân sách; SEO được validate; contrast AA; dùng được bằng bàn phím; script bên thứ ba chỉ tải sau khi người dùng đồng ý.

## 20. Playbook trang động

(SaaS dashboard, portal, admin, app cần đăng nhập)

| # | Bước | Skill | Prompt mẫu |
|---|---|---|---|
| 1 | Profile + vùng bảo vệ (auth, tiền, quyền) | fe-andy / fe-recon | `/fe-recon khảo sát repo và soạn project-profile.md` |
| 2 | Kiến trúc: ma trận render theo route, nơi đặt state, chọn thư viện | fe-code + fe-review | `/fe-review thẩm định: dùng Zustand cho state toàn cục, TanStack Query cho server state` |
| 3 | Luồng + layout | fe-ux | `/fe-ux review luồng tạo hoá đơn, đề xuất 2 layout` |
| 4 | Token, app shell, dark mode | fe-layout → fe-contrast | `/fe-layout dựng app shell sidebar + header, dark mode` |
| 5 | Đăng nhập, phiên, bảo vệ route | fe-sec | `/fe-sec thiết kế auth bằng cookie HttpOnly, kiểm tra quyền ở tầng dữ liệu` |
| 6 | Tầng dữ liệu: API client, schema, query key | fe-data | `/fe-data dựng api client có Zod, hủy request, retry` |
| 7 | Tính năng: Block → Feature, form, bảng | fe-code | `/fe-code tạo feature invoices: bảng, filter trên URL, form tạo mới` |
| 8 | Loading / empty / error | fe-skel | `/fe-skel skeleton 1:1 cho bảng invoices + trạng thái lỗi có nút thử lại` |
| 9 | Realtime / offline (nếu cần) | fe-data → fe-pwa | `/fe-data SSE cập nhật trạng thái đơn, tự kết nối lại` |
| 10 | a11y cho widget phức tạp | fe-a11y | `/fe-a11y kiểm tra dialog, combobox, bảng theo APG` |
| 11 | Hiệu năng: bundle, INP, virtualization | fe-perf | `/fe-perf đo INP khi lọc bảng 5.000 dòng` |
| 12 | Test | fe-test | `/fe-test E2E luồng đăng nhập → tạo hoá đơn → xuất PDF` |
| 13 | CI/CD, giám sát, release | fe-ship | `/fe-ship pipeline + Sentry + RUM + SLO + rollback` |
| 14 | Nhiều team (chỉ khi cần) | fe-mfe + fe-review | `/fe-mfe có cần micro-frontend không?` |

**Xong khi:** mọi lần truy cập dữ liệu đều kiểm tra quyền phía server; server state chỉ nằm ở một cache; filter, sort và page lưu trên URL; mỗi vùng dữ liệu có đủ 4 trạng thái; lỗi được theo dõi kèm phiên bản release.

## 21. Case study A–Z: web bán hàng

Ví dụ: shop ~5.000 sản phẩm, tiếng Việt + tiếng Anh, tiền VND, khách vãng lai mua được, thanh toán qua cổng thanh toán (trang thanh toán của nhà cung cấp), backend thương mại có REST API, 1 team frontend. Stack: Next.js App Router, React 19, TypeScript strict, Tailwind v4, Zod, next-intl. Plan chi tiết từng bước: [case-study-ecommerce.md](skills/fe-andy/references/case-study-ecommerce.md).

### 21.1 Trang nào tĩnh, trang nào động

| Route | Loại | Cách làm |
|---|---|---|
| Trang chủ, giới thiệu, chính sách | Tĩnh | SSG/ISR, làm mới khi CMS gọi webhook |
| Danh mục `/c/[category]` | Render động, dữ liệu cache | Filter/sort/page lưu trên URL; dữ liệu cache 5 phút theo tag; tổ hợp filter để `noindex` |
| Chi tiết sản phẩm `/p/[slug]` | Khung tĩnh + phần giá/tồn kho tươi | `generateStaticParams` top 500 sản phẩm; giá/tồn kho stream trong `Suspense`, cache ≤ 60 s |
| Tìm kiếm | Động | `noindex`, debounce 300 ms, cập nhật URL |
| Giỏ hàng, thanh toán, tài khoản | Động theo user | Cookie HttpOnly, `no-store`, không index |

### 21.2 Cấu trúc thư mục (rút gọn)

```
src/app/[locale]/  page.tsx · (shop)/c/[category] · (shop)/p/[slug] · search · cart · checkout · account/(protected)
src/app/api/       revalidate/route.ts (webhook CMS) · webhooks/payment/route.ts (cổng thanh toán)
src/components/ui/      primitive (button, input, dialog)
src/components/blocks/  product-card · price · gallery · filter-panel · pagination · empty-state · skeletons
src/features/           catalog · product · search · cart (actions.ts) · checkout (actions.ts) · account
src/lib/                env.ts · money.ts · commerce/ (client duy nhất gọi backend) · auth/dal.ts · seo/jsonld.tsx
src/i18n/messages/      vi.json · en.json
```

Luật: Block chỉ nhận props, không gọi API. Feature ghép Block và không tự viết style. Chỉ `lib/commerce` được gọi backend.

### 21.3 Từng bước + prompt mẫu

| # | Bước | Skill | Prompt mẫu | Xong khi |
|---|---|---|---|---|
| 1 | Profile | fe-andy | `/fe-andy tạo project-profile.md cho web bán hàng Next.js: vi/en, VND, vùng bảo vệ: money.ts, checkout, webhooks, auth` | Có ngân sách + vùng bảo vệ |
| 2 | Kiến trúc | fe-code + fe-review + fe-mfe | `/fe-review thẩm định: Next.js hybrid cho storefront, không dùng Redux cho giỏ hàng, không micro-frontend` | ADR + ma trận route được duyệt |
| 3 | Cấu trúc thư mục | fe-code | `/fe-code dựng khung thư mục theo case-study-ecommerce Phase 3, chưa viết logic` | Cây thư mục + luật import |
| 4 | Token + layout | fe-layout → fe-contrast | `/fe-layout token màu thương hiệu, lưới sản phẩm 2/3/4 cột, card cao bằng nhau` | Contrast AA |
| 5 | Tiền + Block | fe-code | `/fe-code tạo money.ts (số nguyên, Intl), Price, ProductCard` | Unit test money pass |
| 6 | Tầng dữ liệu | fe-data | `/fe-data commerce client có Zod, timeout 8s, cache tag theo sản phẩm/danh mục` | Không gọi trùng, có timeout |
| 7 | Trang catalog | fe-code + fe-perf | `/fe-code trang danh mục: filter trên URL, phân trang bằng link, empty state` | LCP ảnh đầu đạt ngân sách |
| 8 | Giỏ hàng | fe-code + fe-data | `/fe-code Server Action thêm vào giỏ, cookie HttpOnly, thông báo aria-live` | Giá lấy từ server |
| 9 | Thanh toán | fe-sec | `/fe-sec luồng checkout: tính lại tổng ở server, chuyển hướng sang cổng thanh toán, webhook xác thực chữ ký, idempotent` | Đơn chỉ được xác nhận qua webhook |
| 10 | Tài khoản | fe-sec | `/fe-sec DAL requireUser cho /account, kiểm tra quyền sở hữu đơn hàng` | Không dựa riêng vào middleware |
| 11 | Trạng thái | fe-skel + fe-ux | `/fe-skel skeleton danh mục + sản phẩm, lỗi có thử lại, hết hàng` | Không CLS |
| 12 | UX + câu chữ | fe-ux | `/fe-ux review luồng danh mục → sản phẩm → giỏ → thanh toán, viết thông báo lỗi` | Không có "Error 500" |
| 13 | a11y | fe-a11y | `/fe-a11y gallery, filter, drawer giỏ hàng, nút tăng giảm số lượng` | axe sạch, test bàn phím |
| 14 | Đa ngôn ngữ + tiền tệ | fe-i18n | `/fe-i18n parity vi/en, định dạng VND, hreflang, đổi ngôn ngữ giữ query` | Script i18n pass |
| 15 | Bảo mật | fe-sec | `/fe-sec header, CSP, rate limit, secret, cookie, audit dependency` | Checklist Phase 15 ✓ |
| 16 | Hiệu năng | fe-perf | `/fe-perf đo Lighthouse mobile trang chủ, danh mục, sản phẩm; bundle mỗi route` | Đạt ngân sách |
| 17 | SEO | fe-ship | `/fe-ship JSON-LD Product + Breadcrumb, sitemap, robots chặn cart/checkout/account/search` | Rich Results Test pass |
| 18 | (Tuỳ chọn) Offline | fe-pwa | `/fe-pwa cho xem catalog offline theo case C, không mua khi offline` | Kill switch sẵn sàng |
| 19 | Test | fe-test | `/fe-test unit money, component Price, E2E mua hàng (mock thanh toán), axe` | CI xanh |
| 20 | Release + giám sát | fe-ship | `/fe-ship pipeline, đơn test ở staging, Sentry, RUM, SLO checkout, rollback` | Checklist release ✓ |
| 21 | Mở rộng + học | fe-mfe / fe-review / fe-learn | `/fe-learn thu thập bài học dự án shop, lập kế hoạch, chờ chốt` | Ghi chú đã được thẩm định |

### 21.4 Năm quy tắc "sống còn" của web bán hàng
1. **Tiền là số nguyên** (đơn vị nhỏ nhất) và chỉ format qua `money.ts`.
2. **Server là sự thật**: giá, giảm giá, phí ship tính lại ở server; bỏ qua mọi giá gửi từ client.
3. **Đơn chỉ thành "đã thanh toán" qua webhook có xác thực chữ ký**, không tin `?paid=true` trên URL.
4. **Giỏ hàng, thanh toán, tài khoản không bao giờ vào cache dùng chung**.
5. **Filter, sort, trang lưu trên URL**: chia sẻ link hoặc reload vẫn giữ nguyên.
