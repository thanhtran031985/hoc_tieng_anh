# Adult08-Dashboard

Bảng điều khiển nội dung: 4 thẻ số liệu, biểu đồ số từ / bài học / câu hỏi theo 10 cấp (mỗi cột đúng màu `level-N`).

- Cảnh báo nội dung còn thiếu: từ chưa có hình, chưa có âm thanh, chủ đề chưa đủ 4 bài, câu hỏi thiếu giải thích, bài nháp lâu ngày.
- Thẻ **Chủ đề chưa có bài**: cột số chủ đề theo màu cấp (`level-N`) và danh sách chủ đề trong khung chương trình chưa có bài (Cấp 5 · Holidays and travel 42 từ, Feelings 35 từ…), nhãn `none` nét đứt trung tính.
- Bảng độ phủ theo cấp: tỉ lệ có hình / âm thanh, dưới 90% tô `field-error`.

Thẻ xem trước có 4 trạng thái dữ liệu (Bình thường · Đang tải · Trống · Lỗi có Thử lại) và 3 cỡ màn (1440×900 · 1366×768 · 1920×1080). Khu người lớn luôn dùng theme `thcs` sáng (ghim bằng `Bong.suite('adult')`), tiền tố lớp `a-`, vùng `.adm`.
