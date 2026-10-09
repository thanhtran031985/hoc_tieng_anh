# Quyết định — 13-gd2-ui-kit — Bộ thành phần GĐ2 và khung bài học mới

Ghi các quyết định đã chốt, thay đổi so với task.md và vấn đề phát sinh.

| Ngày | Quyết định | Lý do |
|---|---|---|

### 09/10/2026 — Test token đang đỏ trước khi làm task này
- `tests/e2e/01-nen-tang.spec.ts` ("mọi token màu dạng hex ... khớp designs/tokens.json") đang hỏng vì thiếu 108 token GĐ2 trong theme (xem `29-fix-ui-findings/decisions.md`). Thêm token vào theme ở bước đầu của task này và chạy lại `npx playwright test 01-`; test phải đạt, không nới test.
