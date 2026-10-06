# 07-lesson-player — Khung bài học và 4 dạng bài cơ bản

Ngày tạo: 02/10/2026 · Giai đoạn: GĐ1 · Phụ thuộc: 02, 05, 06 · Nhánh: `feat/07-lesson-player`

## Mục tiêu
Bé học trọn một bài: thẻ từ, nghe chọn hình, nối từ với hình, chọn từ đúng, game lật thẻ, rồi nhận sao và xu.

## Phạm vi
- Trong: khung bài học (thoát, tiến độ, chân bài, dải phản hồi), 4 dạng bài 8.1–8.4, game lật thẻ ghép cặp, màn kết thúc bài, lưu kết quả, tính sao và xu.
- Ngoài: Mưa từ vựng (GĐ2, đã có thiết kế Screen11), các dạng bài khác.

## Thiết kế
`designs/components/Screen07-ListenChoose`, `Screen08-Flashcards`, `Screen09-Match`, `Screen10-MemoryGame`, `Screen12-LessonEnd`, `Screen18-PickWord` (Chọn từ đúng cho hình), `Screen21-ExitDialog` (hộp thoại "Dừng bài học?"), `FeedbackBar`, `Dialog`, `MascotMore`.

## Quyết định kiến trúc
- Mỗi dạng bài là một component nhận `step` (từ `lesson_steps`) và báo kết quả qua một interface chung.
- Tính sao theo thiết kế: 3 sao ≥ 90% đúng, 2 sao ≥ 70%, luôn có ít nhất 1 sao (ghi vào decisions.md vì khác PRD Phần F).
- Sai lần 2 tự bật gợi ý, lần 3 hiện đáp án và đưa câu xuống cuối bài.
- Ghi `answer_logs` từng câu và cập nhật thẻ ôn tập (dùng hàm của task 08 hoặc tạo trước nếu task 08 chưa làm).
- Thoát giữa bài hỏi xác nhận; tiến độ dở được giữ.

## Các bước
### Bước 0 — Khung bài học và luồng câu hỏi
**Kiểm tra:** chạy bài với dữ liệu mẫu, thanh tiến độ, phím Enter/Space hoạt động; × hoặc Esc mở hộp thoại "Dừng bài học?" (Screen21), "Học tiếp" là nút chính.
### Bước 1 — Thẻ từ (Screen08)
**Kiểm tra:** lật bằng Space hoặc bấm; ← → chuyển thẻ; loa đọc từ và câu ví dụ.
### Bước 2 — Nghe và chọn hình (Screen07)
**Kiểm tra:** 1–4 chọn, Enter kiểm tra; dải đúng/chưa đúng; gợi ý bỏ bớt 1 đáp án.
### Bước 3 — Nối từ với hình (Screen09)
**Kiểm tra:** kéo thả bằng chuột và cách dùng bàn phím đều làm được.
### Bước 4 — Chọn từ đúng cho hình (Screen18)
**Kiểm tra:** hoạt động như bước 2 với 3 thẻ chữ.
### Bước 5 — Lật thẻ ghép cặp (Screen10)
**Kiểm tra:** 12 thẻ, đếm lượt, không đếm giờ.
### Bước 6 — Kết thúc bài và lưu kết quả (Screen12)
**Kiểm tra:** sao, xu lưu vào hồ sơ; lỗi lưu cho Thử lại mà không mất kết quả; mở chặng tiếp theo.

## Kiểm tra cuối task
tsc, lint, build; học hết một chủ đề cấp 1 bằng chỉ bàn phím.
