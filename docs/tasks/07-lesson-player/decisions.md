# Quyết định — 07-lesson-player

### 03/10/2026 — Kế hoạch được duyệt (xem plan.md)
- Bạn duyệt kế hoạch và cho làm liên tục tới khi đóng task 07, rồi sang các task kế bằng cùng quy trình, commit và push sau mỗi bước.
- Các quyết định chính (chi tiết trong plan.md): tính sao theo tỷ lệ đúng của thiết kế (khác PRD Phần F); sao, xu do server tính; sai không phạt (lần 2 gợi ý, lần 3 hiện đáp án và đưa câu xuống cuối); thẻ ôn tập có hàm thuần riêng; thêm loại bài `memory_game`; đáp án nhiễu dựng ở server; giữ tiến độ dở bằng `localStorage`; chỉ vào được bài đã mở.

### 03/10/2026 — Phím tắt trên nút trong màn học
- Bối cảnh: `useHotkeys` bỏ qua Enter và Space khi focus đang ở trên một nút (vì nút tự kích hoạt). Trong bài học, sau khi bé bấm một thẻ đáp án, focus nằm trên thẻ đó nên Space ("Nghe lại") và Enter ("Kiểm tra") không chạy.
- Quyết định: thêm tùy chọn `captureNative` cho `useHotkeys`: khi bật, Enter và Space vẫn chạy ngay cả khi focus ở trên nút (và chặn hành vi mặc định của nút); vùng có `data-hotkey-skip` (nút thoát) và hộp thoại không bị ảnh hưởng.
- Ảnh hưởng: chỉ màn học bật tùy chọn này; các màn khác giữ hành vi cũ.

### 03/10/2026 — Hộp thoại "Dừng bài học?": Esc ở lại bài
- Bối cảnh: bản xem trước Screen21 ghi "Dừng lại" nhận Esc ở một chỗ và "Esc hoặc bấm ra ngoài = Học tiếp" ở chỗ khác.
- Quyết định: "Học tiếp" là nút chính (Enter); Esc và bấm ra ngoài đều là ở lại bài; "Dừng lại" chỉ bấm chuột hoặc Tab + Enter.
- Lý do: Esc mở hộp thoại, nếu Esc lần hai lại thoát bài thì bé dễ lỡ tay (nguyên tắc không phạt).
