# Tiến độ — 13-fix-ui-findings

Trạng thái chung: 🔄 · Cập nhật lần cuối: 09/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|------|-----|------------|---------|
| 0 | Kiểm tra dự án | ✅ | Đọc báo cáo test, xác nhận file nghi ngờ; có 19 tệp `error.tsx` (không phải 16) |
| 1 | Nút "Thử lại" tải lại dữ liệu (lỗi 1) | 🔄 | Đã đổi 19 tệp sang `retry`; chờ chạy test |
| 2 | Phím A–D (lỗi 2) | 🔄 | Đã thêm; chờ chạy test |
| 3 | Bàn phím trong hai bản xem trước (lỗi 3, 4) | 🔄 | Đã thêm Esc và focus; chờ chạy test |
| 4 | Khung xương `/map` (lỗi 5) | 🔄 | Đã thêm `loading.tsx`; chờ chạy test |
| 5 | Favicon và trang 404 tiếng Việt (lỗi 6, 7) | 🔄 | Đã thêm `icon.svg`, `not-found.tsx`; chờ chạy test |
| 6 | Kiểm tra cuối | ⬜ | `tsc`, `lint` sạch; chờ `npm run build` và `npm run test:e2e` |

## Nhật ký
### Bước 0–5 — Viết code (09/10/2026)
- Đã làm: xem bảng trên. Lỗi 1 dùng prop `retry` có sẵn của `error.tsx` trong Next 16.3.8 thay cho `router.refresh()` tự viết.
- File tạo/sửa: 19 `error.tsx`; `ListenChooseStep.tsx`, `PickWordStep.tsx`; `StepsPreview.tsx`, `questions.module.css`; `src/app/(kid)/map/loading.tsx`; `src/app/icon.svg`; `src/app/not-found.tsx`; `eslint.config.mjs` (bỏ qua `playwright-report/`, `test-results/`).
- Kết quả kiểm tra: `npx tsc --noEmit` và `npm run lint` không lỗi.
- Chưa chạy được test Playwright vì `npm run dev` của bạn đang chạy ở cổng 3000 (cùng thư mục `.next` với lần build của bộ test).

## Bước tiếp theo
Tắt `npm run dev`, chạy `npm run test:e2e`, ghi kết quả, cập nhật `docs/test/bao-cao-test.md`.
