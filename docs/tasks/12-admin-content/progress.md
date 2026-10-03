# Tiến độ — 12-admin-content — Quản trị nội dung cơ bản

Trạng thái chung: 🔄 · Cập nhật lần cuối: 03/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Khung quản trị và Bảng điều khiển (Adult08) | ✅ | Chờ bạn xem thủ công trên trình duyệt |
| 1 | Cây lộ trình (Adult09) | ⬜ | |
| 2 | Ngân hàng từ vựng (Adult10) | ⬜ | |
| 3 | Ngân hàng câu hỏi (Adult11) | ⬜ | |
| 4 | Soạn bài học (Adult12) | ⬜ | |
| 5 | Thư viện hình và âm thanh (Adult13) | ⬜ | |
| 6 | Nhập và xuất Excel từ vựng, câu hỏi (Adult14) | ⬜ | |
| 7 | Nhập chủ đề mới và xuất từ mục tiêu (Adult14, Adult09) | ⬜ | |

## Nhật ký

### Bước 0 — Khung quản trị và Bảng điều khiển (03/10/2026)
- Đã làm: rà soát bản nháp có sẵn (`admin-dashboard.ts` + test, `admin-gate.ts`, `server/admin/dashboard.ts`) và giữ lại; thêm layout `(admin)` (`requireAdmin()` → `AdultArea` + `ToastProvider` + `AdminFrame`), trang `/admin`, `DashboardView` (4 thẻ KPI, biểu đồ 10 cấp theo màu cấp, "Cần bổ sung", "Chủ đề chưa có bài", bảng độ phủ), `loading.tsx`, `error.tsx`, `dashboard.module.css`.
- Kiểm tra: `npm test` (admin-dashboard) 7/7 đạt; `npx tsc --noEmit`, `npm run lint`, `npm run build` không lỗi; `getDashboard()` chạy trên DB thật: 900 từ (670 có hình), 154 bài xuất bản, 32 chủ đề xuất bản, 58 chủ đề khung chưa có bài (cấp 5: 8, cấp 6–10: 10 mỗi cấp, 2.594 từ mục tiêu), 3 cảnh báo; gõ `/admin` khi chưa đăng nhập bị chuyển về `/login`.
- Chưa tự kiểm được (cần đăng nhập): tài khoản `parent` → 404; admin chưa mở cổng → `/profiles`; giao diện thật ở 1440×900 và 1366×768; trạng thái lỗi bằng nút Thử lại.
- Việc bạn cần làm thủ công: đăng nhập tài khoản admin, mở khu bố mẹ nhập PIN, bấm "Quản trị" và xem Bảng điều khiển; thử tài khoản `parent`.
- Quy ước cho các bước sau: mọi server action / route handler của nhóm `(admin)` gọi `requireAdmin()` ở dòng đầu.

## Bước tiếp theo

Bước 1 — Cây lộ trình (Adult09)
