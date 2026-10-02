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

### 03/10/2026 — Chi tiết lưu kết quả và các quyết định phát sinh khi làm
- Sao do server tính từ kết quả từng mục (`lesson-score.ts`): đúng ngay lần đầu ≥ 90% → 3 sao, ≥ 70% → 2, còn lại 1. Bài không có mục chấm (chỉ thẻ từ) được 3 sao. Mục làm lại ở cuối bài không tính sao nhưng vẫn ghi nhật ký.
- Thưởng: cấp 1–5 là 10 xu + 5 xu mỗi sao; cấp 6–10 là 20 XP + 10 XP mỗi sao. Làm lại bài vẫn nhận xu; số sao của hồ sơ chỉ cộng phần vượt kết quả tốt nhất cũ (`newStars`).
- Một lượt học chỉ ghi một lần: client gửi `startedAtMs` cố định, gửi lại (Thử lại sau khi mất mạng) thì server trả kết quả đã lưu, không cộng thêm. Kết quả nằm trong `localStorage` tới khi lưu xong; mở lại bài đã xong nhưng chưa lưu thì tự lưu tiếp.
- Thẻ ôn tập tạo ở `review-box.ts`: từ mới vào hộp 1, đến hạn ngày mai; từ đã có thẻ thì đúng lên hộp, sai về hộp 1.
- Trò chơi lật thẻ giữ thanh tiến độ của bài ở đầu màn (bản xem trước dùng thanh riêng không có tiến độ) để tiến độ đi liền mạch.
- `useHotkeys` thêm `capture` để bước nối nhận Esc (bỏ nhấc từ) trước Esc mở hộp thoại thoát.
