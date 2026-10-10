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
| 10/10/2026 | Bước 2 tự duyệt. Cổng mở khi mọi bài thường của mọi vùng đã ≥ 1 sao; trận trùm KHÔNG bắt buộc (khác bản xem trước của thiết kế đếm cả trùm) | Khớp `unlock.ts` (trùm không chặn vùng kế) và task.md “xong mọi chủ đề” |
| 10/10/2026 | Cấp bé đã qua và cấp không có bài thi (5+) không hiện cổng; bản đồ 8 vùng chia 2 trang nên cổng nằm ở trang cuối; thẻ cổng đặt bên phải cổng, danh sách vùng 2 cột | Thiết kế chỉ có 4 vùng; 8 vùng làm thẻ đặt phía trên bị cắt ở 1366×768 |
| 10/10/2026 | `/exam/[level]` ở Bước 2 chỉ là chỗ giữ có chặn server (`requireOpenExamGate`); Bước 3 thay bằng giao diện thật và dùng lại hàm này ở bắt đầu/nộp bài | Task có bước kiểm riêng cho việc chặn gõ thẳng URL |
| 10/10/2026 | Bước 3 tự duyệt. Câu thi lấy từ các bước câu hỏi của bài thường (nghe-chọn-hình, chọn-từ-cho-hình, điền từ, sắp xếp câu, ghép âm, nghe-gõ), lưu ở `exam_attempts.items` = [{stepId, unitId}]; bỏ đọc hiểu (nhiều mục mỗi bước), luyện nói (cần micro), trò chơi, truyện, nối cặp, lật thẻ | Mỗi câu thi chấm đúng một mục, dùng lại nguyên màn của bài học (phím tắt, gợi ý, làm lại) và không phụ thuộc micro |
| 10/10/2026 | Điểm = số câu đúng ngay lần đầu (mọi mục của câu đều firstTryCorrect + scored); client chỉ gửi kết quả từng câu, server khớp từ/câu hỏi với bước của lượt thi rồi chấm; mã bước lạ hoặc mục của câu khác bị bỏ | Giống mức tin cậy của `completeLesson`, nhưng không tin số đạt/chưa đạt từ client |
| 10/10/2026 | Lượt thi dở dùng lại khi bắt đầu lại (cùng bộ câu, hạt giống `exam:<id>`); tiến độ dở lưu ở máy cùng kho với bài học, khóa là số âm của mã lượt thi | Tải lại trang hay thoát giữa chừng không đổi đề; không cần thêm cột/bảng |
| 10/10/2026 | Thi lại: lượt gần nhất chưa đạt và chưa có `lesson_attempts.finished_at > submitted_at` của bài thường thuộc 3 chủ đề gợi ý thì `/exam/N` mở thẳng màn kết quả (Screen37) và `startExam` ném `ExamNotReadyError`. “Ôn chủ đề này” mở bài thường còn thiếu sao nhất của chủ đề | Điều kiện ở server theo task.md; bé luôn có việc làm tiếp thay vì bị chặn trống |
| 10/10/2026 | Đạt chỉ nâng `current_level_id` khi bé đang đúng ở cấp vừa thi; thưởng +50 sao/+100 xu và huy hiệu `level:N` chỉ trao một lần (cổng đóng sau khi lên cấp, nộp lại cùng lượt trả kết quả đã lưu) | Không kéo lùi hồ sơ đã ở cấp cao hơn; không thưởng đôi |
| 10/10/2026 | Chưa ghi thẻ ôn tập (review_cards) cho từ sai khi thi; chỉ ghi `answer_logs` (source exam, không gắn `attempt_id` vì khóa ngoại trỏ `lesson_attempts`) | Ngoài phạm vi task 20; từ hay sai đã hiện ở màn chưa đạt |
