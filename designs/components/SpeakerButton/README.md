# SpeakerButton

Nút loa tròn phát âm từ tiếng Anh; khi đang phát có vòng sóng lan ra (`is-playing`).

- Đặt **bên trái** từ tiếng Anh, cách `space-3`. Không có từ tiếng Anh nào trên màn mà thiếu nút loa (trừ câu hỏi nghe-chọn, nơi chữ bị ẩn có chủ đích).
- `l` (112px, nền `brand`) chỉ dùng một lần mỗi màn cho câu hỏi chính; phím **Space** = nghe lại.
- `m` 56px trên thẻ từ; `s` 40px trong danh sách, sổ từ, dải phản hồi.
- `aria-label` = "Nghe: <từ>". Âm thanh thật lấy từ tệp ghi âm của bài học; bản xem trước dùng giọng đọc của trình duyệt.

**Người dùng cung cấp**: `word` (chuỗi cần đọc), `size`, nhãn trợ năng tùy chọn.
