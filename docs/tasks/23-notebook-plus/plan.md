# Kế hoạch — Task 23 `23-notebook-plus` (nhánh `feat/23-notebook-plus`, tách từ `feat/22-room-shop`)

## Context
Sổ từ (task 08, `/notebook`) hiện chỉ có chip lọc chủ đề, lưới cuộn, thẻ phóng to đơn giản. Task 23 nâng lên Screen44 (số từ đã gặp / đã thuộc, lọc Cấp có chấm màu + Chủ đề đổi theo cấp, lưới 12 thẻ/trang có phân trang, thẻ phóng to có ← → và nghe từ/câu) và thêm trang in danh sách từ khổ A4 trắng đen (Screen45). Không có migration. Người dùng đã ủy quyền làm liền: các điểm "dừng chờ continue" tự duyệt, ghi `decisions.md`.

## Nền sẵn có (tái dùng)
`server/notebook.ts` (`getNotebook`: thẻ ôn tập → từ + mức thuộc 1–5 + chủ đề qua bước bài học), `NotebookView` / `MasteryPips` / `notebook.module.css`, `MASTERY_NAMES` + `masteryOf` (`lib/rules/review-box.ts`), `Dialog`, `SpeakerButton`, `WordPicture`, `DataState`, `KidTopbar`, token `mastery-*`, `print-paper/ink/muted/rule`, `size-print-page-w/h`, `size-print-margin`, `size-print-pic`, `size-print-write`, token màu cấp `data-level`.

## Quyết định
- **Số liệu**: "đã gặp" = số từ có thẻ ôn; "đã thuộc" = mức ≥ 4 (Nhớ tốt trở lên). Hàm thuần `lib/rules/notebook.ts`: `isMastered`, `countMastered`, `filterWords(level, topic)`, `topicsForLevel`, `paginate(words, page, 12)`, `chunkForPrint(words, 8)` + test.
- **Cấp của từ** = cấp thấp nhất trong các chủ đề có từ đó; `NotebookWord` thêm `levelNumber`; `Notebook` thêm `levels: {number, name, count}[]`, `learnerGrade`, `levelName`; `NotebookTopic` thêm `levelNumber`/`levelNumbers`.
- **Sắp xếp** giữ như task 08: mức thấp lên trước, rồi cấp cao trước, rồi chữ (đúng preview).
- **Lọc**: Cấp (radiogroup, chấm màu `data-level`) → Chủ đề (đổi theo cấp, đếm theo bộ lọc cấp); đổi cấp reset chủ đề + trang; lọc/phân trang là state client, lọc theo query để in.
- **Phân trang** 12 thẻ (lưới 6×2), nút Trang trước/sau + "N từ · trang a/b · xếp từ mức thấp lên"; 1366×768 không cuộn.
- **Thẻ phóng to** thay `Dialog` đơn giản bằng bố cục 2 cột (hình 220, từ + loa, phiên âm · cấp · chủ đề, nghĩa, câu ví dụ + loa, thanh mức thuộc); ← → đi theo danh sách ĐÃ LỌC (qua cả trang), Esc đóng, nút Từ trước/Từ sau/Đóng.
- **Trang in** là route riêng `/notebook/print?level=N&topic=ID` (server component, `requireLearner`; tham số được Zod kiểm; không tham số = tất cả). Header mỗi trang: "Danh sách từ của {tên}", Lớp · Cấp · Chủ đề, ngày in, "Bố mẹ ký". Bảng: hình xám, từ + phiên âm, nghĩa, câu ví dụ (+ nghĩa), ô tập viết 3 dòng kẻ. Chia trang cố định 8 từ/trang bằng nhiều `<article class=page>` có `break-after: page`, `tr { break-inside: avoid }`; footer "Trang x/y". Kích thước theo em (1/80 chiều cao trang): màn hình thu nhỏ theo `100dvh`, in đúng 210×297mm, `@page { size: A4 portrait; margin: 0 }`. Thanh công cụ (Quay lại Sổ từ, In Ctrl+P) ẩn khi in. Bốn trạng thái: loading/error/trống (không có từ để in).
- **Phím**: Ctrl+P ở trang in gọi `window.print()` (mặc định trình duyệt đã in; chỉ bảo đảm toolbar ẩn); nút In có nhãn phím.

## Các bước
**Bước 0 — Sổ từ bổ sung (Screen44).** Rules + test; mở rộng `getNotebook`; viết lại `NotebookView` (KPI, lọc Cấp/Chủ đề, lưới 12 + phân trang, thẻ phóng to ← →), nút "In danh sách từ" dẫn tới `/notebook/print` kèm bộ lọc; `loading.tsx` khung xương khớp; giữ trạng thái trống/lỗi. Kiểm Edge (DB verify, nạp thẻ ôn nhiều cấp/chủ đề): số đã thuộc khớp mức ≥ 4, lọc Cấp/Chủ đề, 12 thẻ + phân trang, ← → trong thẻ phóng to qua các trang, Esc, không cuộn 1366×768/1920×1080.
**Bước 1 — In danh sách từ (Screen45).** Route + `PrintView` + `print.module.css` (token `print-*`, em theo trang); Edge: 30 từ → 4 trang, không dòng nào cắt ngang, đầu trang đúng tên/lớp/cấp/chủ đề/ngày; in PDF bằng CDP `Page.printToPDF` (khổ A4, không tràn lề) và kiểm số trang PDF; toolbar không hiện trong PDF.
**Đóng task.** `tsc`, `lint`, `npm test`, `npm run build` sạch; spec Playwright `tests/e2e/23-so-tu-in.spec.ts` (không chạy) + `chung.spec.ts` thêm `/notebook/print`; progress, decisions, dashboard (Cảnh báo 0), README ✅; commit từng bước + push.

## Kiểm thử
Unit `lib/rules/notebook.test.ts` (đếm đã thuộc ≥ 4, lọc cấp/chủ đề, chủ đề đổi theo cấp, phân trang 12 từ biên 0/12/13, chia trang in 8 từ biên 30 từ → 4 trang, cấp thấp nhất của từ). Edge: `.tmp-verify/check-23-notebook.mjs`, `check-23-print.mjs` (dọn dữ liệu thử trong `finally`).
Việc thủ công báo cuối: in thử một chủ đề cấp 3 ra PDF (Ctrl+P), thử Sổ từ với bộ lọc cấp/chủ đề.
