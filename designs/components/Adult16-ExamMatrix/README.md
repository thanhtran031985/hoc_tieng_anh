# Adult16-ExamMatrix

Tạo đề thi theo ma trận: dạng câu × mức độ (Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao ↔ độ khó 1–5).

- Mỗi ô hiện số câu có trong kho; vượt kho → ô tô cam và báo “Kho chỉ có N”.
- Điểm/câu từng dạng, tổng điểm phải đúng thang 10 hoặc 100; tỉ lệ mức độ vẽ bằng thanh `chart-1`.
- Thời gian (10–120 phút), số mã đề, trộn thứ tự câu, trộn đáp án, hiện giải thích sau khi nộp. “Tạo đề” chỉ chạy khi ma trận hợp lệ.

Thẻ xem trước có 4 trạng thái dữ liệu (Bình thường · Đang tải · Trống · Lỗi có Thử lại) và 3 cỡ màn (1440×900 · 1366×768 · 1920×1080). Khu người lớn luôn dùng theme `thcs` sáng (ghim bằng `Bong.suite('adult')`), tiền tố lớp `a-`, vùng `.adm`.
