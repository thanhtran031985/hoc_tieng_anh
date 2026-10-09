# 19-content-new-types-l1-l4 — Nội dung dạng bài mới cho cấp 1–4

Ngày tạo: 09/10/2026 · Giai đoạn: GĐ2 · Phụ thuộc: 15, 16, 17, 18 · Nhánh: `feat/19-content-new-types-l1-l4`

## Mục tiêu
Các bài cấp 1–4 có đủ dạng bài và trò chơi GĐ2, truyện và bài đọc phù hợp từng cấp.

## Phạm vi
- Trong: `lesson-builder` bản 2 (trộn dạng bài mới và trò chơi vào bài); câu hỏi ghép âm, sắp xếp câu, nghe gõ, điền từ, đọc hiểu ngắn, luyện nói cho các chủ đề cấp 1–4; truyện tranh; tạo mp3 cho nội dung mới.
- Ngoài: nội dung Khám phá từ và Họ vần (task 27), nội dung cấp 5 (task 28).

## Thiết kế
Không có màn mới. Dùng các dạng bài của task 15–18.

## Quyết định kiến trúc
- Claude Code soạn nội dung, tôi duyệt. Bước 0 đề xuất số lượng (vd số câu mỗi dạng mỗi chủ đề, số truyện mỗi cấp) và cách trộn bước trong một bài, rồi DỪNG chờ tôi duyệt.
- Ghép âm chỉ cho cấp 1–3 (từ CVC và âm ghép đơn giản); nghe gõ câu và đọc hiểu từ cấp 3; mưa từ vựng từ cấp 3.
- Nội dung nằm trong seed, chạy lại không nhân đôi; bài đã có tiến độ học của bé thì chỉ thêm bước, không xóa bước cũ.
- Câu và đoạn văn chỉ dùng từ trong cấp của bé và cấp dưới; Claude Code kiểm tra bằng script và ghi các từ ngoài danh sách vào báo cáo.
- Hình cho truyện vẽ SVG cùng phong cách rồng Bông như task 05; số hình cần vẽ ghi trong Bước 0.

## Các bước
### Bước 0 — Đề xuất số lượng và cách trộn bài (DỪNG chờ tôi)
Bảng số lượng theo cấp và dạng; 2 bài mẫu viết đầy đủ để tôi xem.
**Kiểm tra:** Tôi đã duyệt số lượng và bài mẫu.
### Bước 1 — lesson-builder bản 2
Hàm thuần trộn dạng bài theo cấp, có test đơn vị; bài cũ giữ nguyên tiến độ.
**Kiểm tra:** Test: bài cấp 1 không có nghe gõ câu; mỗi bài có ≥ 1 trò chơi hoặc dạng bài mới; bài đã học vẫn giữ sao.
### Bước 2 — Nội dung cấp 3–4
Câu hỏi các dạng mới, truyện, bài đọc cho cấp 3–4 (bé đang học lớp 4 nên làm trước).
**Kiểm tra:** Script kiểm tra từ ngoài cấp không báo lỗi; mọi câu có mp3; tôi học thử 3 bài.
### Bước 3 — Nội dung cấp 1–2
Như bước trước cho cấp 1–2, thiên về ghép âm, bong bóng, đập chuột.
**Kiểm tra:** Như bước trước.
### Bước 4 — Kiểm tra toàn bộ nội dung
Báo cáo số câu, số truyện theo cấp; danh sách thiếu hình hoặc âm thanh.
**Kiểm tra:** Bảng điều khiển Adult08 không còn cảnh báo thiếu âm thanh ở cấp 1–4.

## Kiểm tra cuối task
tsc, lint, build, seed trên database trống; con học thử một bài mỗi cấp.
