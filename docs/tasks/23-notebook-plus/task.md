# 23-notebook-plus — Sổ từ bổ sung và in danh sách từ

Ngày tạo: 09/10/2026 · Giai đoạn: GĐ2 · Phụ thuộc: 08, 13 · Nhánh: `feat/23-notebook-plus`

## Mục tiêu
Sổ từ lọc được theo cấp và chủ đề, có phân trang, và in được danh sách từ cho bé tập viết.

## Phạm vi
- Trong: Sổ từ bổ sung (Screen44: số từ đã gặp/đã thuộc, lọc Cấp và Chủ đề, phân trang 12 thẻ, thẻ phóng to có ← →); in danh sách từ (Screen45, A4 trắng đen).
- Ngoài: tab Khám phá và Họ vần trong thẻ từ (task 25–26).

## Thiết kế
`designs/components/Screen44-NotebookPlus`, `Screen45-WordListPrint`.

## Quyết định kiến trúc
- Sổ từ bổ sung là cập nhật Sổ từ của task 08, giữ tìm và lọc cũ.
- Trang in là route riêng dùng CSS `@media print`, khổ A4 dọc, lề theo token `size-print-*`; chỉ dùng màu `print-*`, hình chuyển xám khi in.
- In theo bộ lọc đang chọn (cấp, chủ đề); quá nhiều từ thì chia nhiều trang, không cắt ngang một dòng.

## Các bước
### Bước 0 — Sổ từ bổ sung (Screen44)
Thống kê đầu trang, lọc Cấp (chấm màu cấp) và Chủ đề đổi theo cấp, lưới 12 thẻ, phân trang, thẻ phóng to.
**Kiểm tra:** Số từ đã thuộc khớp mức Nhớ tốt trở lên; ← → trong thẻ phóng to, Esc đóng.
### Bước 1 — In danh sách từ (Screen45)
Trang in có đầu trang tên bé, lớp, cấp, chủ đề, ngày in; bảng hình, từ, nghĩa, câu ví dụ, 3 dòng kẻ.
**Kiểm tra:** Ctrl+P ra đúng A4, không tràn lề; 30 từ chia trang không cắt dòng; xem trước trên màn cùng bố cục.

## Kiểm tra cuối task
tsc, lint, build; in thử ra PDF một chủ đề cấp 3.
