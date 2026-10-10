# Quyết định — 21-rewards-collection — Bộ sưu tập sticker và huy hiệu

Ghi các quyết định đã chốt, thay đổi so với task.md và vấn đề phát sinh.

| Ngày | Quyết định | Lý do |
|---|---|---|
| 10/10/2026 | Bước 0 tự duyệt. Mở rộng `rewards`/`learner_rewards` của task 20 thay vì tạo bảng mới (thêm `name_en`, `album`, `status`, `coins`, `opened_at`, `source_attempt_id`); tên tiếng Việt vẫn ở `name`, tiếng Anh ở `name_en` | Tránh hai nơi lưu cùng một thứ; Adult21 cần Nháp/Xuất bản, xu riêng và tên Anh |
| 10/10/2026 | 10 huy hiệu hiển thị: 6 thành tích mới `ach:*` + 4 huy hiệu qua đảo `level:1…4` của task 20 (thiết kế chỉ vẽ 2 qua đảo); 32 huy hiệu “Bạn của …” của trùm không liệt kê, chỉ góp tiến độ “Thắng 5 trận trùm” | Huy hiệu qua đảo đã được cấp từ task 20 nên phải xem được; huy hiệu từng trùm quá nhiều cho lưới |
| 10/10/2026 | Điều kiện huy hiệu lưu `{kind, goal}` (qua đảo: `goal` = số cấp); xu: thành tích +50, qua đảo/trùm 0 vì xu đã nằm trong gói bài thi (+100) / trận trùm (+30) | Khớp thiết kế Screen36/33 và `COINS` |
| 10/10/2026 | Seed chỉ bổ sung cột còn trống của dòng đã có, không ghi đè tên/mức/trạng thái quản trị đã sửa | Tránh seed lại làm mất chỉnh sửa ở Adult21 |
| 10/10/2026 | 6 hình khủng long sinh bằng script từ `designs/components/bundle.js` (đọc, không sửa) vào `public/media/stickers/`, đổi `var(--dragon-line)` thành `#2b2440` | Hình mẫu của thiết kế dùng biến CSS, tệp SVG tĩnh không đọc được biến |
| 10/10/2026 | Bước 2 tự duyệt. Hộp quà chỉ hiện sau khi lưu xong (không biết trước bài có rơi quà hay không), thay cho trạng thái “hộp quà chờ” khi đang lưu; huy hiệu thành tích hiện trước, quà sticker mở bằng tay | Chỉ lần đầu hoàn thành bài mới rơi quà nên màn đang lưu không có hộp để chờ |
| 10/10/2026 | Bước 3 tự duyệt. Tab Huy hiệu là lưới 5×2 (10 ô) thay cho 4×2; sticker chưa mở chưa tính vào “đã có” (hiện ở banner quà chờ); chip xu của thẻ chi tiết chỉ hiện khi xu > 0; hiển thị theo `rewards.status = published` | 10 huy hiệu (4 qua đảo + 6 thành tích); bản nháp ở Adult21 phải ẩn khỏi bé |
