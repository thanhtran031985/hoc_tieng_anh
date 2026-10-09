# 25-word-explorer — Khám phá từ

Ngày tạo: 09/10/2026 · Giai đoạn: GĐ2 · Phụ thuộc: 14, 15, 23 · Nhánh: `feat/25-word-explorer`

## Mục tiêu
Bé khám phá một danh từ qua 4–6 câu hỏi WH, đọc cả đoạn có dịch, nói theo và in ra; có ở bài học, Sổ từ và ôn tập.

## Phạm vi
- Trong: dạng 8.27 Khám phá từ (Screen48); bản in (Screen49); khung Đọc cả đoạn và dịch (`ReadAloudParagraph`); bảng `word_questions`, `word_readings`; tab Khám phá trong thẻ từ của Sổ từ (Screen52, phần Khám phá); câu hỏi Khám phá trong ôn tập; soạn ở Adult22.
- Ngoài: Họ vần, Ghép chữ đầu và liên kết qua lại (task 26); nội dung thật (task 27).

## Thiết kế
`designs/components/Screen48-WordExplorer`, `Screen49-WordExplorerPrint`, `ReadAloudParagraph`, `Screen52-NotebookWordTabs`, `Adult22-WordExplorerEditor`; `Bong.W.explorer`, `lines`, `paragraph`, `wireParagraph`.

## Quyết định kiến trúc
- Bảng theo PRD Phần G: `word_questions` (word_id, sort_order, kind, question_en, question_vi, answers JSON, distractors JSON, status), `word_readings` (owner_type word/family, owner_id, sentences JSON en/vi, audio, status).
- Chỉ cho danh từ cụ thể; số nhánh 4–6 (hằng số `wordlab`). Sơ đồ nhánh vẽ bằng SVG, co giãn theo số nhánh.
- `ReadAloudParagraph` là component dùng chung trong `src/components/wordlab/`; chữ sáng theo giọng dùng cùng cách của task 16.
- Ở chế độ tự khám phá (mở từ Sổ từ) không tính sao, không xu; trong bài học tính sao như dạng bài thường.
- Ôn tập: từ có Khám phá thì lượt ôn có thể hỏi một nhánh đã mở; kết quả đi vào 5 hộp như câu ôn thường.

## Các bước
### Bước 0 — Bảng và seed mẫu
Migration 2 bảng; seed "bird" và "cat" như thiết kế (Nháp).
**Kiểm tra:** Migration chạy trên MariaDB; seed chạy lại không nhân đôi.
### Bước 1 — Đọc cả đoạn và dịch (ReadAloudParagraph)
Phím P đọc/tạm dừng, đọc chậm, bấm câu nghe riêng, bấm từ nghe + nghĩa, T bật/tắt dịch, dịch riêng 1 câu.
**Kiểm tra:** Dịch mặc định ẩn; aria-pressed đúng; Tab tới từng câu.
### Bước 2 — Khám phá từ (Screen48)
Thẻ từ, 4–6 nhánh, hỏi từng nhánh chọn 1 trong 2–3 hình, mở đủ thì đọc cả đoạn, nói theo (task 17), In, xem lại.
**Kiểm tra:** Phím 1–6, ↑ ↓, Space, H, Enter, Esc đúng thiết kế; sai 2 lần thì mờ một hình sai; vừa 1366×768.
### Bước 3 — Bản in (Screen49)
A4 dọc trắng đen, sơ đồ thu về trang in, đoạn văn, dòng tập viết, công tắc in kèm bản dịch.
**Kiểm tra:** Ctrl+P ra đúng 1 trang A4; bật dịch thì thêm câu tiếng Việt chữ nhạt.
### Bước 4 — Trong Sổ từ và ôn tập
Tab Khám phá trong thẻ từ phóng to (sơ đồ thu gọn, "Mở Khám phá đầy đủ"); câu hỏi nhánh trong ôn tập.
**Kiểm tra:** Từ không có Khám phá thì tab ẩn kèm dòng giải thích; ôn đúng thì từ lên hộp.
### Bước 5 — Soạn Khám phá từ (Adult22)
Cột Khám phá trong bảng từ, ngăn kéo rộng: bộ câu hỏi mẫu theo nhóm, 4–6 nhánh kéo thả, đáp án và hình nhiễu, ghép đoạn văn, dịch, tạo giọng đọc, xem như học sinh.
**Kiểm tra:** Chặn xuất bản khi thiếu hình, âm thanh hoặc bản dịch, kèm lý do; cảnh báo đầu ngăn kéo nhảy tới đúng chỗ.

## Kiểm tra cuối task
tsc, lint, build; khám phá "bird" bằng bàn phím, in thử ra PDF.
