# Quyết định — 13-gd2-ui-kit — Bộ thành phần GĐ2 và khung bài học mới

Ghi các quyết định đã chốt, thay đổi so với task.md và vấn đề phát sinh.

| Ngày | Quyết định | Lý do |
|---|---|---|
| 09/10/2026 | Token GĐ2 chỉ thêm vào `:root` của `globals.css`, không ánh xạ vào `@theme inline` (không có class Tailwind `bg-gift-box`…). | Giống cách thêm token THCS/người lớn ở GĐ1: component dùng `var(--…)` trong CSS module. Cần class Tailwind cho token nào thì thêm khi component đó cần. |
| 09/10/2026 | Số token mới là 165 (135 màu + 24 size + 6 duration), không phải 166 như `task.md`. | Đếm lại bằng cách so khối `:root` mục 15 của `DESIGN_SYSTEM.md` với `globals.css`. |
| 09/10/2026 | Hằng số `COINS`/`WORDLAB` viết dạng camelCase (`stickerLesson`, `priceFurnitureS`, `linksMaxDepth`…), bỏ tiền tố `coin-`. | Hợp văn phong TypeScript; test `constants.test.ts` ánh xạ từ tên token trong `tokens.json` nên không lệch. |

### 09/10/2026 — Test token đang đỏ trước khi làm task này
- `tests/e2e/01-nen-tang.spec.ts` ("mọi token màu dạng hex ... khớp designs/tokens.json") đang hỏng vì thiếu 108 token GĐ2 trong theme (xem `29-fix-ui-findings/decisions.md`). Thêm token vào theme ở bước đầu của task này và chạy lại `npx playwright test 01-`; test phải đạt, không nới test.
