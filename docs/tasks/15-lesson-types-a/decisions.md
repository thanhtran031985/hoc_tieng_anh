# Quyết định — 15-lesson-types-a — Dạng bài mới: ghép âm, sắp xếp câu, nghe gõ, điền từ

Ghi các quyết định đã chốt, thay đổi so với task.md và vấn đề phát sinh.

| Ngày | Quyết định | Lý do |
|---|---|---|
| 09/10/2026 | Component dạng bài đặt ở `src/features/lesson/` (không phải `src/components/lesson/types/` như task.md) | Cấu trúc thật của dự án: các dạng bài của task 07 đã nằm ở đây; `components/lesson` chỉ chứa khung dùng chung của GĐ2 |
| 09/10/2026 | Không cần migration: `questions.type` và `lesson_steps.activity_type` là chuỗi, kiểm bằng Zod | Đã thiết kế từ task 03 để thêm dạng bài không phải ALTER bảng |
| 09/10/2026 | 4 dạng mới là kiểu riêng (`question-extra.ts`), không thêm vào `QUESTION_TYPES` của task 12 | Ngân hàng câu hỏi (Adult11), nhập/xuất Excel và 12c chỉ biết 3 dạng dựng từ từ vựng; gộp chung sẽ làm vỡ các màn đó |
| 09/10/2026 | Adult18 là màn riêng `/admin/question-types` (menu “Câu hỏi dạng mới”, nhãn Mới), không phải tab trong `/admin/questions` | Đúng thiết kế (“thêm mục mới, có nhãn Mới, không đổi menu cũ”); “tab” trong bản xem trước chỉ là các trạng thái minh họa |
| 09/10/2026 | Chỉ làm 4 ô “Thêm nhanh” và 4 dạng trong bộ lọc; Luyện nói, Đọc hiểu, Truyện của Adult18 để task 16/17 | Ngoài phạm vi task 15 (README) |
| 09/10/2026 | Form Adult18 chỉ có Cấp + Trạng thái; kỹ năng theo dạng (pronunciation/writing/listening/grammar), độ khó 1, không giải thích | Đúng thiết kế Adult18 (không có Kỹ năng/Độ khó/Giải thích); DB bắt buộc `skill`/`difficulty` nên gán mặc định theo dạng |
| 09/10/2026 | `ItemResult.wordId` nhận null và thêm `questionId`; bài ôn tập giữ schema riêng theo từ | Dạng mới chấm theo câu hỏi, không phải theo từ; `answer_logs` đã có cột `question_id` nên không cần đổi DB |
| 09/10/2026 | Thẻ ôn tập (5 hộp) chưa tạo cho câu hỏi dạng mới | Ôn tập hiện chỉ theo từ; nội dung thật và ôn theo câu hỏi thuộc task sau (19) |
| 09/10/2026 | Ghép âm: phát âm bằng tệp của `phonics_sounds` (task 14), chưa có tệp thì giọng trình duyệt đọc “kuh/buh…” (`phonicsSay`) | Đọc tên chữ cái (“see”) sai âm; tệp thật là đường chính |
| 09/10/2026 | Nghe và gõ: từ ngắn = một từ ≤ 8 chữ cái (gõ mỗi chữ một ô), còn lại gõ một dòng; so khớp theo hai cờ `ignoreCase`, `ignoreEndPunct` trong `options` | Task nói “từ ngắn / câu” nhưng không nêu ngưỡng; cờ lấy từ thiết kế Adult18 |
| 09/10/2026 | Sắp xếp câu: thêm `answer.alternatives` (các cách sắp xếp khác cũng đúng) và ô nhập ở Adult18 | Kiểm tra bước 1 của task.md: “khác thứ tự đáp án phụ vẫn tính đúng” |
| 09/10/2026 | Điền từ: không tự focus ô trống khi vào bước | Phím 1–4 và H phải dùng được ngay; nếu ô trống có focus thì các phím này thành chữ gõ vào ô. Bé bấm vào ô để gõ |
| 09/10/2026 | Bảng điều khiển: số câu “thiếu giải thích” không tính 4 dạng mới | Form mới không có ô giải thích, tính vào sẽ luôn báo cảnh báo giả |
| 09/10/2026 | Esc đóng “Xem như học sinh” và mở “Dừng bài học?” cả khi đang gõ trong ô nhập (`inInputs: ["Escape"]`) | Yêu cầu giữ Esc hoạt động ở các bài gõ chữ |
| 09/10/2026 | Chưa chụp so sánh với `designs/` cho Screen23/26/27/28 trong `thiet-ke.spec.ts` (chỉ thêm Adult18) | Bộ so sánh bài học cần chạy được cả lượt chơi để tới từng dạng; để khi chạy Playwright tổng. Đã đối chiếu bằng mắt qua ảnh chụp Edge |

## Tổng kết khác với task.md gốc
- Thư mục component: `src/features/lesson/` thay vì `src/components/lesson/types/`.
- Thêm: cách sắp xếp khác cho Sắp xếp câu; bậc thang chung `ladder.ts`; `useHotkeys.inInputs`.
- Không làm: thẻ ôn tập cho câu hỏi dạng mới; chụp so sánh Screen23/26/27/28.
