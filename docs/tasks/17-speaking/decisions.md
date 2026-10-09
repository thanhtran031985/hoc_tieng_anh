# Quyết định — 17-speaking — Luyện nói từ và câu

Ghi các quyết định đã chốt, thay đổi so với task.md và vấn đề phát sinh.

| Ngày | Quyết định | Lý do |
|---|---|---|
| 10/10/2026 | Dạng `speaking` (8.7) là loại thứ 6 của `EXTRA_QUESTION_TYPES`: prompt `{text ≤ 12 từ, audio?, wordId?}`, options `{leniency}`, answer `{expected}` | Dùng chung hạ tầng `questions` của task 15; không cần bảng mới cho nội dung |
| 10/10/2026 | Ngưỡng sao theo mức: dễ 60%/35%, vừa 80%/50% (đúng task.md), chặt 90%/70%; luôn ≥ 1 sao khi bé đã nói | Task.md chỉ nêu mức vừa; hai mức còn lại đúng tinh thần “dễ tính”, không phạt |
| 10/10/2026 | Từ khớp khi giống hệt hoặc gần (sai 1 ký tự với từ ≥ 4 chữ, vd apple/apples) | Nhận diện giọng nói hay lệch nhẹ đuôi từ |
| 10/10/2026 | `firstTryCorrect = stars ≥ 2`; không có “sai lần 3” nên không làm lại cuối bài | Không phạt; bé nói là được ghi nhận |
| 10/10/2026 | Chấm tắt / trình duyệt không hỗ trợ / nhận diện lỗi → chỉ ghi âm, 2 sao hoàn thành, không gọi nhận diện | Đúng task.md; âm thanh chỉ gửi đi khi bố mẹ cho phép |
| 10/10/2026 | Không có micro (liệt kê thiết bị không có đầu vào, hoặc `getUserMedia` báo NotFound) → `ListenChooseStep` dựng sẵn từ hình của từ; câu không có hình thì thẻ nhẹ + Tiếp tục (2 sao) | Bài vẫn đi tiếp được |
| 10/10/2026 | Xuất bản câu luyện nói bị chặn khi thiếu âm thanh mẫu; xem thử/chơi thử vẫn dùng giọng trình duyệt | Giống Adult19: soạn nháp trước rồi tạo/tải âm thanh sau khi tự lưu |
| 10/10/2026 | Bản ghi: `storage/recordings/<learnerId>/rec-<id>-<hash>.<ext>` ngoài `public/`, route `/recordings/[id]` kiểm đăng nhập + đúng gia đình + hỗ trợ Range; bé nghe lại ngay trên máy bằng blob | Quy tắc dự án: bản ghi âm không công khai |
| 10/10/2026 | Giữ 3 bản gần nhất mỗi (bé, câu) — xóa cả dòng và tệp khi lưu bản thứ 4 | Đúng task.md |
| 10/10/2026 | `learnerSettings.speechScoring` mặc định bật, công tắc ở tab “Giao diện & âm thanh” của Adult07 kèm giải thích gửi âm thanh tới Google/Microsoft | Đúng task.md |
| 10/10/2026 | Edge mới có cả `SpeechRecognition` không tiền tố; `speechRecognitionCtor` ưu tiên bản không tiền tố rồi mới `webkit` | Tránh bỏ sót trình duyệt đã bỏ tiền tố |
