# 15-lesson-types-a — Dạng bài mới: ghép âm, sắp xếp câu, nghe gõ, điền từ

Ngày tạo: 09/10/2026 · Giai đoạn: GĐ2 · Phụ thuộc: 13, 14 · Nhánh: `feat/15-lesson-types-a`

## Mục tiêu
Bé học được 4 dạng bài mới 8.5, 8.8, 8.9, 8.10 trong khung bài học, và quản trị soạn được câu hỏi các dạng này.

## Phạm vi
- Trong: 4 dạng bài trong khung bài học của task 07, chấm điểm và gợi ý; biểu mẫu soạn 4 dạng này ở Adult18 (ngân hàng câu hỏi dạng mới); "Xem như học sinh".
- Ngoài: truyện và đọc hiểu (task 16), luyện nói (task 17), nội dung thật cho các dạng mới (task 19).

## Thiết kế
`designs/components/Screen23-Phonics`, `Screen26-SentenceOrder`, `Screen27-Dictation`, `Screen28-FillBlank`, `Adult18-QuestionTypes2` (các tab Ghép âm, Sắp xếp câu, Nghe và gõ, Điền từ).

## Quyết định kiến trúc
- Mỗi dạng bài là một component trong `src/components/lesson/types/`, nhận câu hỏi từ bảng `questions` (`type` mới: `phonics`, `sentence_order`, `dictation`, `fill_blank`) và trả kết quả qua cùng giao diện chấm của task 07.
- Hàm chấm là hàm thuần trong `src/lib/rules/grading/`: so khớp không phân biệt hoa thường, bỏ dấu câu cuối và khoảng trắng thừa; nghe gõ chấp nhận nhiều đáp án (`answer` là mảng).
- Phím tắt theo thiết kế: ở dạng gõ chữ thì Gợi ý là phím ? và Nghe lại là Ctrl+Space, vì H và Space phải gõ được.
- Sai 2 lần tự bật gợi ý; không có màn thua, không đồng hồ đếm ngược.

## Các bước
### Bước 0 — Ghép âm phonics (Screen23)
Ô chữ rời (âm ghép như "sh" là một ô), kéo vào ô trống hoặc gõ phím chữ, Backspace bỏ ô cuối; ghép xong đọc nối âm rồi đọc cả từ.
**Kiểm tra:** Bấm ô chữ nghe âm (từ task 14); làm được hoàn toàn bằng bàn phím; ghép đúng thì các ô sáng lần lượt.
### Bước 1 — Sắp xếp từ thành câu (Screen26)
Thẻ từ xáo trộn, bấm hoặc kéo xuống hàng, phím 1–9, Backspace; đúng thì đọc cả câu.
**Kiểm tra:** Gợi ý đặt sẵn thẻ tiếp theo; từ nhiễu (nếu có) không bắt buộc dùng; câu đúng mà khác thứ tự đáp án phụ vẫn tính đúng.
### Bước 2 — Nghe và gõ (Screen27)
Từ ngắn mỗi chữ một ô, câu một dòng; gõ bàn phím thật; chưa đúng tô cam chữ sai, giữ phần đúng.
**Kiểm tra:** Gợi ý (?) hiện chữ đầu rồi phát chậm; Ctrl+Space nghe lại khi đang gõ; nhiều đáp án chấp nhận đều tính đúng.
### Bước 3 — Điền từ vào câu (Screen28)
Câu có một ô trống, 3–4 thẻ phím 1–4, bấm, kéo hoặc gõ thẳng.
**Kiểm tra:** Chưa đúng: ô cam nhẹ, Bông nói nghĩa từ đã chọn; gợi ý làm mờ một thẻ sai.
### Bước 4 — Soạn 4 dạng ở Adult18
Bảng câu hỏi dạng mới (tìm, lọc Dạng/Cấp, phân trang), ô "Thêm nhanh", ngăn kéo biểu mẫu cho 4 dạng.
**Kiểm tra:** Ghép âm: tách từ thành ô âm, Gộp ô, báo thiếu âm; Sắp xếp: tự tách thẻ, thêm từ nhiễu; Nghe gõ: nhiều đáp án; Điền từ: câu phải có đúng một ___; báo lỗi dưới ô; "Xem như học sinh" chạy bằng component thật.

## Kiểm tra cuối task
tsc, lint, build; soạn mỗi dạng 2 câu ở Adult18, ghép vào một bài Nháp, học thử bằng bàn phím ở 1366×768.
