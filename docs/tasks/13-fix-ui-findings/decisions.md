# Quyết định — 13-fix-ui-findings

### 09/10/2026 — Lỗi 1 dùng `retry` của Next thay vì `router.refresh()`
- Bối cảnh: báo cáo test đề xuất thêm `router.refresh()`. Next 16.3.8 có sẵn prop `retry()` cho `error.tsx` (tài liệu trong `node_modules/next/dist/docs/.../error.md`): lấy lại dữ liệu rồi vẽ lại; `reset()` chỉ vẽ lại.
- Quyết định: đổi `reset` thành `retry` ở mọi `error.tsx`.
- Lý do: đúng API chính thức, không phải tự viết `startTransition`.
- Ảnh hưởng: sửa 19 tệp (báo cáo ghi 16: còn thiếu `home`, `placement`, `time-up` cũng dùng `reset`).

### 09/10/2026 — Favicon là tệp SVG tĩnh có mã màu
- Bối cảnh: `src/app/icon.svg` không đọc được token CSS của trang.
- Quyết định: chép đầu rồng Bông (biểu cảm `chao`, nét vẽ từ `dragon-parts.ts`) vào tệp SVG với màu của rồng ngọc (token `--dragon-*`) ghi trực tiếp.
- Lý do: tệp biểu tượng độc lập với CSS; đây là ngoại lệ duy nhất của quy tắc "không mã màu hex".

### 09/10/2026 — Bỏ qua thư mục báo cáo test khi lint
- Bối cảnh: `npm run lint` quét cả `playwright-report/` (JS đã đóng gói) và báo hàng nghìn lỗi.
- Quyết định: thêm `playwright-report/**`, `test-results/**` vào `globalIgnores` của `eslint.config.mjs`.
