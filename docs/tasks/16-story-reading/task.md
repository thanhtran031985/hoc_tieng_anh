# 16-story-reading — Truyện tranh đọc to và đọc hiểu ngắn

Ngày tạo: 09/10/2026 · Giai đoạn: GĐ2 · Phụ thuộc: 15 · Nhánh: `feat/16-story-reading`

## Mục tiêu
Bé đọc được truyện tranh có giọng đọc chữ sáng theo, làm bài đọc hiểu ngắn; quản trị soạn được truyện và bài đọc.

## Phạm vi
- Trong: dạng 8.6 truyện tranh và 8.11 đọc hiểu ngắn; bảng `stories`, `story_pages`; soạn truyện (Adult19); tab Đọc hiểu ngắn ở Adult18; âm thanh từng trang dùng hàm TTS của task 14.
- Ngoài: nội dung truyện thật cho cấp 1–4 (task 19).

## Thiết kế
`designs/components/Screen24-Story`, `Screen29-ShortReading`, `Adult19-StoryEditor`, `Adult18-QuestionTypes2` (tab Đọc hiểu ngắn).

## Quyết định kiến trúc
- Bảng mới: `stories` (level_id, unit_id, title, title_vi, cover, new_words JSON, status, sort_order) và `story_pages` (story_id, sort_order, kind page/question, image, sentences JSON en/vi, audio, question_id). Truyện là một bước trong bài (`activity_type = story`).
- Chữ sáng theo giọng: dùng mốc thời gian từng từ nếu dịch vụ TTS trả về (word timing); nếu không thì chia đều theo `duration-read-word`. Claude Code ghi cách đã dùng vào decisions.md.
- Đọc hiểu ngắn lưu trong `questions` (`type = short_reading`): đoạn 3–6 câu, hình, 2–3 câu hỏi con trong `options`.
- Xuất bản truyện bị chặn khi trang thiếu âm thanh hoặc câu quá 16 từ, kèm lý do.

## Các bước
### Bước 0 — Bảng truyện và seed 1 truyện mẫu
Migration `stories`, `story_pages`; seed truyện "Tom's Red Kite" 6 trang như thiết kế (Nháp).
**Kiểm tra:** Migration chạy trên MariaDB; seed chạy lại không nhân đôi.
### Bước 1 — Truyện tranh (Screen24)
Đọc cho tớ nghe / Tự đọc, chữ sáng theo giọng, bấm từ nghe riêng + nghĩa, ← → đổi trang, Space đọc lại trang, trang câu hỏi xen giữa, trang "Hết truyện" có từ mới.
**Kiểm tra:** Khớp thiết kế ở 3 cỡ màn, không cuộn; câu hỏi giữa truyện chấm như dạng bài thường.
### Bước 2 — Đọc hiểu ngắn (Screen29)
Đoạn văn có Nghe cả đoạn, bên cạnh 3 câu hỏi; phím 1–3, ↑ ↓ đổi câu, Enter kiểm tra.
**Kiểm tra:** Câu đã trả lời có nhãn "Đã trả lời"; gợi ý sáng câu chứa đáp án và làm mờ một đáp án.
### Bước 3 — Soạn truyện (Adult19)
Danh sách trang kéo thả (Alt+↑/↓), sửa trang, tạo giọng đọc tự động, thông tin truyện, Nháp/Xuất bản, xem trước.
**Kiểm tra:** Chặn xuất bản khi thiếu âm thanh, kèm lý do; xóa trang qua hộp thoại; xem trước chạy bằng component Screen24.
### Bước 4 — Soạn đọc hiểu ngắn (Adult18)
Tab Đọc hiểu ngắn: đoạn 3–6 câu, hình, 2–3 câu hỏi.
**Kiểm tra:** Báo lỗi khi đoạn ngoài 3–6 câu hoặc câu hỏi thiếu đáp án đúng; xem như học sinh chạy được.

## Kiểm tra cuối task
tsc, lint, build; soạn một truyện 4 trang ở Adult19, xuất bản, gắn vào bài và đọc thử bằng hồ sơ của con.
