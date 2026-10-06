# Adult09-Tree

Cấu trúc lộ trình dạng cây Chặng → Cấp → Chủ đề → Bài học, mở / thu gọn từng nhánh.

- Kéo tay nắm 6 chấm để sắp xếp trong cùng nhóm; bàn phím: Tab tới tay nắm rồi ↑/↓ (có thông báo vị trí cho trình đọc màn hình).
- Nhãn Nháp / Đã xuất bản / **Chưa có bài** (trung tính, viền nét đứt `adm-status-none-line`). Chủ đề “Chưa có bài” có sẵn trong khung chương trình kèm số từ mục tiêu (ví dụ Cấp 5 · Cây lớn: Holidays and travel 42 từ, Feelings 35 từ).
- Bấm chủ đề “Chưa có bài”: khung phải hiện tóm tắt (từ mục tiêu, đã có sẵn, cần thêm) và mở ngăn kéo bảng từ mục tiêu (tìm, lọc Đã có / Chưa có, sắp xếp, phân trang) với nút “Xuất Excel để điền” và “Nhập Excel”.
- Chủ đề thiếu bài có cảnh báo.
- Khung sửa bên phải đổi theo loại mục; không xuất bản được bài 0 bước hoặc chủ đề trống (lỗi dưới ô Trạng thái). Thêm / xoá qua hộp thoại.

Thẻ xem trước có 4 trạng thái dữ liệu (Bình thường · Đang tải · Trống · Lỗi có Thử lại) và 3 cỡ màn (1440×900 · 1366×768 · 1920×1080). Khu người lớn luôn dùng theme `thcs` sáng (ghim bằng `Bong.suite('adult')`), tiền tố lớp `a-`, vùng `.adm`.
