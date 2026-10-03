# Quyết định — 12-admin-content

### 03/10/2026 — Chặn `/admin` bằng cổng bố mẹ (việc cần làm ở task này)
- Bối cảnh: sơ đồ tổng quan (`docs/so-do/tong-quan/so-sanh.md`, điểm 1) cho thấy `/admin` hiện chỉ gọi `requireRole("admin")` (`src/app/(admin)/admin/page.tsx:11`), không qua `requireParentGate` (`src/server/parent-gate.ts:35`). Tài khoản đăng ký đầu tiên tự là `admin` (`src/server/users.ts:8-10`), nên máy đang đăng nhập thì bé gõ `/admin` là vào được, không cần PIN.
- Việc cần làm: nhóm route `(admin)` phải yêu cầu cả cổng bố mẹ đã mở (cookie còn hạn) và role `admin`, kiểm ở layout và từng server action; thêm lối vào từ khu bố mẹ (PRD dòng 126).
- Kiểm tra: tài khoản admin chưa mở cổng gõ `/admin` bị chuyển về `/profiles`; mở cổng rồi mới vào được; tài khoản `parent` luôn thấy 404.
- Nguồn: do bạn quyết định ngày 03/10/2026 (làm đúng ở task 12, không sửa ở task 06).

### 03/10/2026 — Bảng điều khiển: 4 thẻ KPI, nút hành động theo mục menu đã sẵn sàng
- Thẻ thứ 4 của thiết kế là "Chủ điểm ngữ pháp" (GĐ3, ngoài phạm vi) nên thay bằng thẻ "Chủ đề" (xuất bản · nháp · chưa có bài).
- Thanh trên của khung chỉ có tiêu đề tĩnh vì khung nằm ở layout; dòng "Cập nhật hh:mm · ngày" của thiết kế đặt ngay trên các thẻ KPI trong trang.
- Nút "Thêm từ mới", "Xuất Excel", "Nhập từ Excel" để mờ kèm chú thích "Sắp có" tới bước 2 và 6; nút hành động trong cảnh báo ("Mở thư viện hình", "Mở cấu trúc"…) chỉ hiện khi mục menu đích `ready` — mỗi bước sau bật `ready` trong `src/components/adult/nav.ts` thì nút tự hiện.
- Lối vào khu quản trị: link "Quản trị" ở khung (chỉ hiện với admin) sau khi đã mở cổng bố mẹ; `requireAdmin()` chuyển về `/profiles` nếu cổng chưa mở.
