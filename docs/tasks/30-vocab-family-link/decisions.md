# Quyết định — 30-vocab-family-link — Ngân hàng từ vựng: xem từ thuộc Họ vần nào và bấm để mở

<!-- Mỗi quyết định thêm một mục:
### <ngày> — <tiêu đề>
- Bối cảnh:
- Quyết định:
- Lý do:
- Ảnh hưởng:
-->

| Ngày | Quyết định | Lý do |
|---|---|---|
| 11/10/2026 | Làm theo 4 mặc định ở `task.md`: chip theo từng họ (tối đa 2 chip rồi “+n”), từ Bẫy có dấu “Bẫy”, bấm chip mở ngăn kéo Họ vần tại chỗ, không thêm/bỏ từ khỏi họ ở màn từ vựng. | Người dùng giao toàn quyền (“làm theo ý bạn”). |
| 11/10/2026 | Chip cho xuống dòng trong ô (không `nowrap`). | Thử `nowrap`: cột “Họ vần” đẩy cột nút sửa ra ngoài màn 1366 px. |
| 11/10/2026 | Viết spec Playwright `30-tu-vung-ho-van.spec.ts` nhưng chưa chạy. | `npm run test:e2e:db` làm `prisma migrate reset` trên database thử: cần người dùng đồng ý riêng; gom chạy ở task 900 bước 4. |
