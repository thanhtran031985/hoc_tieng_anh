# 12-admin-content — Quản trị nội dung cơ bản

Ngày tạo: 02/10/2026 · Giai đoạn: GĐ1 · Phụ thuộc: 03, 05 · cần thiết kế Prompt 3 và Prompt 4 phần B · Nhánh: `feat/12-admin-content`

## Mục tiêu
Tài khoản quản trị thêm, sửa nội dung học mà không cần sửa code.

## Phạm vi
- Trong: bảng điều khiển (số từ, bài, câu hỏi theo cấp; cảnh báo thiếu hình/âm thanh), cây lộ trình (chặng → cấp → chủ đề → bài, kéo thả, Nháp/Xuất bản), ngân hàng từ vựng, ngân hàng câu hỏi dạng 8.1–8.4, soạn bài học, nhập/xuất Excel, thư viện hình và âm thanh; **nhập chủ đề mới bằng Excel** (tệp mẫu 2 trang Chủ đề + Từ vựng, tùy chọn tự tạo bài bằng hàm `lesson-builder` của task 05, lưu dạng Nháp); chủ đề khung "Chưa có bài" trong cây lộ trình, xuất Excel từ mục tiêu của chủ đề đó để điền tiếp.
- Ngoài: chủ điểm ngữ pháp, tạo đề thi, sao lưu, trợ lý AI (GĐ3–4).

## Thiết kế
Chưa có. Cần chạy Prompt 3 và Prompt 4 (phần B) trên Claude Design trước.

## Quyết định kiến trúc
- Chỉ role `admin` vào được nhóm route `(admin)`; kiểm tra ở cả layout và từng server action.
- File tải lên lưu ở `storage/uploads/`, phục vụ qua route handler.
- Nhập Excel: hỏi trước khi cài thư viện đọc Excel; xem trước và báo lỗi từng dòng trước khi lưu.

## Các bước
(Viết sau khi có thiết kế.)
