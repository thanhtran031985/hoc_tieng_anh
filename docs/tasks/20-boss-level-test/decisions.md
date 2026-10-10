# Quyết định — 20-boss-level-test — Trận trùm, bài thi lên cấp và rồng Bông lớn lên

Ghi các quyết định đã chốt, thay đổi so với task.md và vấn đề phát sinh.

| Ngày | Quyết định | Lý do |
|---|---|---|
| 10/10/2026 | Bước 0 tự duyệt: 32 trùm là biến thể của Vua Khỉ Lém (6 màu lông × 14 phụ kiện), không vẽ nhân vật mới | Người dùng ủy quyền làm liền; tiết kiệm công vẽ mà vẫn mỗi vùng một trùm khác nhau |
| 10/10/2026 | Token mới: `boss-fur-1…6`, `boss-face-1…6` (bảng màu lông 6 nhóm trùm; số 1 là màu gốc) | Thiết kế chỉ có một màu lông; CLAUDE.md: thiếu token thì thêm vào theme và liệt kê trong báo cáo |
| 10/10/2026 | Phần thưởng lưu ở bảng `rewards`/`learner_rewards` (PRD G) nạp sẵn huy hiệu trùm và “Qua đảo …”; task 21 làm giao diện sưu tập trên cùng bảng | Tránh làm lại khi sang task 21 |
| 10/10/2026 | Bài thi lên cấp chỉ cấp 1–4 (cấp 5 → THCS là GĐ3); mỗi lượt thi tự dựng 20 mục có hạt giống từ mọi chủ đề của cấp và lưu ở `exam_attempts.items`; `exam_questions` có bảng nhưng chưa dùng (đề cố định ở GĐ3) | Câu hỏi từ vựng không nằm sẵn trong bảng `questions`; lượt thi cần lưu đúng bộ câu để nộp bài kiểm được |
| 10/10/2026 | Bước 1 tự duyệt. Trận trùm = bài `unit_test` 6 câu trộn; thưởng cố định 30 xu mỗi lần thắng (không theo sao) + huy hiệu “Bạn của …” cấp một lần (`boss:<cấp>:<slug>`) | Trùm không thể thua nên không tính sao thưởng; huy hiệu lưu ở `learner_rewards` (unique learnerId+rewardId) |
| 10/10/2026 | Seed chỉ dựng lại trận trùm của chủ đề đã học khi chưa có `lesson_attempts`/`lesson_progress` của bài đó | Không làm mất lịch sử bé đã đấu |
| 10/10/2026 | Script kiểm Edge cần xóa `study_sessions` hôm nay của hồ sơ thử và khởi động lại dev server sau `prisma generate` (client cũ làm `awardReward` lỗi, màn kết thúc hiện “Chưa lưu được kết quả”) | Phát sinh khi kiểm; không phải lỗi mã |
