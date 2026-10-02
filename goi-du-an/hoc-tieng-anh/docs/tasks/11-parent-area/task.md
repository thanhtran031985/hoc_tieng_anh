# 11-parent-area — Khu vực bố mẹ: tổng quan và cài đặt

Ngày tạo: 02/10/2026 · Giai đoạn: GĐ1 · Phụ thuộc: 04, 08, 10 · cần thiết kế Prompt 3 · Nhánh: `feat/11-parent-area`

## Mục tiêu
Bố mẹ xem tiến độ của con và chỉnh cài đặt.

## Phạm vi
- Trong: trang Tổng quan (phút học tuần, chuỗi ngày, số từ đã thuộc, cấp hiện tại và % hoàn thành, biểu đồ 7 và 30 ngày, hoạt động gần đây); Cài đặt (giới hạn giờ, giọng Anh/Mỹ, tốc độ đọc, âm thanh, quản lý hồ sơ, đổi mật khẩu và PIN).
- Ngoài: kỹ năng chi tiết, kết quả thi, ghi âm, lịch kiểm tra (GĐ2–3).

## Thiết kế
Chưa có. Cần chạy Prompt 3 trên Claude Design trước, rồi tải về `designs/` và điền danh sách màn vào đây.

## Quyết định kiến trúc
- Số liệu tính từ `study_sessions`, `answer_logs`, `review_cards`, `lesson_progress` trong `src/server/reports/`.
- Biểu đồ: hỏi trước khi cài thư viện biểu đồ.

## Các bước
(Viết sau khi có thiết kế.)
