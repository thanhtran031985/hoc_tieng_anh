# Adult01-Gate

Cổng vào khu bố mẹ: hai thẻ Mã PIN / Mật khẩu tài khoản. PIN 4–6 số nhập vào 6 ô (2 ô cuối nét đứt = không bắt buộc), mật khẩu có nút hiện/ẩn.

- Sai PIN báo lỗi ngay dưới ô (`field-error`, có icon), đếm số lần thử còn lại, sai 5 lần khoá 5 phút.
- “Về màn chọn hồ sơ” ở góc trên trái.
- Trống = tài khoản chưa đặt PIN → chỉ có ô mật khẩu và hướng dẫn tạo PIN.

Thẻ xem trước có 4 trạng thái dữ liệu (Bình thường · Đang tải · Trống · Lỗi có Thử lại) và 3 cỡ màn (1440×900 · 1366×768 · 1920×1080). Khu người lớn luôn dùng theme `thcs` sáng (ghim bằng `Bong.suite('adult')`), tiền tố lớp `a-`, vùng `.adm`.
