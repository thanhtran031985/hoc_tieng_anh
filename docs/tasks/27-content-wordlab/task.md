# 27-content-wordlab — Nội dung Khám phá từ và Họ vần

Ngày tạo: 09/10/2026 · Giai đoạn: GĐ2 · Phụ thuộc: 26 · Nhánh: `feat/27-content-wordlab`

## Mục tiêu
Các danh từ cụ thể cấp 1–4 có Khám phá từ, và các vần hay gặp có Họ vần, đủ đoạn văn có dịch và âm thanh.

## Phạm vi
- Trong: khoảng 120 từ Khám phá (danh từ cụ thể cấp 1–4), khoảng 30 họ vần, đoạn văn tiếng Anh kèm bản dịch tiếng Việt, mp3 cho đáp án và đoạn văn, hình cho đáp án còn thiếu.
- Ngoài: nội dung cấp 5 (task 28).

## Thiết kế
Không có màn mới.

## Quyết định kiến trúc
- Claude Code soạn nội dung, tôi duyệt. Bước 0 đưa danh sách từ và vần đề xuất cùng 5 từ, 3 họ viết đầy đủ làm mẫu, rồi DỪNG chờ tôi duyệt.
- Câu hỏi và đáp án chỉ dùng từ trong cấp của bé và cấp dưới; bản dịch tiếng Việt tự nhiên, dễ hiểu với học sinh tiểu học.
- Đáp án dùng lại hình của từ đã có; hình còn thiếu vẽ SVG cùng phong cách task 05, số hình cần vẽ ghi trong Bước 0.
- Nội dung trong seed, chạy lại không nhân đôi; mọi mục để Nháp, tôi xuất bản sau khi xem.

## Các bước
### Bước 0 — Danh sách và mẫu (DỪNG chờ tôi)
Danh sách từ, vần, số hình cần vẽ; 5 từ và 3 họ mẫu.
**Kiểm tra:** Tôi đã duyệt danh sách và mẫu.
### Bước 1 — Khám phá từ cấp 3–4
Câu hỏi, đáp án, hình nhiễu, đoạn văn, dịch, mp3.
**Kiểm tra:** Script kiểm tra từ ngoài cấp và thiếu hình/âm thanh không báo lỗi; Adult22 không còn cảnh báo.
### Bước 2 — Khám phá từ cấp 1–2
Như bước trước.
**Kiểm tra:** Như bước trước.
### Bước 3 — Họ vần
Khoảng 30 họ, bẫy chính tả, chữ đầu nhiễu, câu vui có dịch, mp3.
**Kiểm tra:** Mỗi họ có ≥ 3 từ cùng âm; Ghép chữ đầu của mỗi họ có ≥ 5 từ thật hoặc ghi rõ họ nào ít hơn.

## Kiểm tra cuối task
seed trên database trống; xuất bản 10 từ, con thử ở Sổ từ.
