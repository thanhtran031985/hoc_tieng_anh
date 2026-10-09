# Screen23-Phonics

1. Ghép âm phonics.

- Hình lớn (cấp 1), các ô chữ rời xáo trộn (`size-phon-tile`) và ô trống theo số âm (`phon-slot`, viền nét đứt).
- Bấm ô chữ: nghe âm (/k/, /æ/, /t/). Kéo ô vào ô trống theo thứ tự, hoặc gõ phím chữ cái; Backspace bỏ ô cuối; bấm ô đã điền để trả về.
- Ghép xong: Bông đọc âm nối dần rồi đọc cả từ, từng ô sáng `read-highlight` (2 × `duration-read-word` mỗi âm).
- Ví dụ: cat, dog, sun, fish — “sh” là một ô ghép.
- Gợi ý: hiện chữ mờ trong ô trống.

Khung bài học dùng chung (`Bong.L`): nút × mở hộp thoại “Dừng bài học?” (Bông biểu cảm `tiec`), thanh tiến độ, chân bài Nghe lại (Space) · Gợi ý (H) · Kiểm tra/Tiếp tục (Enter). Đúng: viền xanh, sao bay vào thanh tiến độ. Chưa đúng: cam nhẹ, Bông động viên, làm lại; sai 2 lần tự bật gợi ý. Không có màn thua, không trừ điểm, không đếm ngược.

Thẻ xem trước có 3 cỡ màn (1440×900 · 1366×768 · 1920×1080) và đủ 4 trạng thái dữ liệu (Bình thường · Đang tải · Trống · Lỗi có Thử lại). Vừa 1366×768 không cuộn. Viền focus `focus` 4px khi dùng Tab.
