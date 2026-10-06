# Adult07-Settings

Cài đặt khu bố mẹ, 4 nhóm ở cột trái (↑/↓ để chuyển).

- Thời gian học: giới hạn mỗi ngày, khung giờ (kiểm tra giờ kết thúc sau giờ bắt đầu, ≥ 30 phút), ngày được học.
- Giao diện Tiểu học / THCS / Tự động theo lớp; giọng UK/US, tốc độ thường/chậm, nghe thử; âm thanh.
- Hồ sơ của con: đổi tên, đổi lớp, đổi cấp (bảng 10 màu cấp), đặt lại tiến độ, xoá (gõ đúng tên) — đều qua hộp thoại xác nhận; hành động không hoàn tác dùng `adm-danger`.
- Đổi mật khẩu (≥ 8 ký tự, có chữ và số, nhập lại khớp) và PIN (4–6 số, không quá dễ đoán).

Thẻ xem trước có 4 trạng thái dữ liệu (Bình thường · Đang tải · Trống · Lỗi có Thử lại) và 3 cỡ màn (1440×900 · 1366×768 · 1920×1080). Khu người lớn luôn dùng theme `thcs` sáng (ghim bằng `Bong.suite('adult')`), tiền tố lớp `a-`, vùng `.adm`.
