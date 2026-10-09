# 28-content-l5 — Nội dung cấp 5 (Cây lớn, Flyers)

Ngày tạo: 09/10/2026 · Giai đoạn: GĐ2 · Phụ thuộc: 19, 20, 27 · Nhánh: `feat/28-content-l5`

## Mục tiêu
Cấp 5 có đủ nội dung như cấp 1–4 để trọn bộ tiểu học.

## Phạm vi
- Trong: từ, hình, mp3, câu hỏi mọi dạng GĐ1–GĐ2, truyện, bài đọc, trò chơi, trận trùm, bài thi lên cấp, Khám phá từ và Họ vần cho các chủ đề cấp 5 trong khung chương trình (task 05).
- Ngoài: cấp 6 trở đi và giao diện THCS (GĐ3).

## Thiết kế
Không có màn mới. Rồng Bông dáng 5 (`dragon-scarf-5`) đã làm ở task 13.

## Quyết định kiến trúc
- Claude Code soạn nội dung, tôi duyệt. Bước 0 đưa danh sách chủ đề và từ theo khung chương trình cấp 5 (Cambridge Flyers) cùng 1 chủ đề viết đầy đủ làm mẫu, rồi DỪNG chờ tôi duyệt.
- Dùng `lesson-builder` bản 2 (task 19) và các quy tắc nội dung của task 19, 27.
- Chủ đề khung `planned` của cấp 5 gắn nội dung vào đúng chủ đề đó, không tạo trùng.

## Các bước
### Bước 0 — Danh sách và chủ đề mẫu (DỪNG chờ tôi)
Danh sách chủ đề, số từ, số hình cần vẽ; 1 chủ đề đầy đủ.
**Kiểm tra:** Tôi đã duyệt.
### Bước 1 — Từ vựng, hình, mp3
Từ của mọi chủ đề cấp 5.
**Kiểm tra:** Adult08 không còn cảnh báo thiếu hình, âm thanh ở cấp 5.
### Bước 2 — Bài học, truyện, bài đọc, trò chơi
Câu hỏi các dạng, bài học bằng lesson-builder bản 2, truyện, bài đọc.
**Kiểm tra:** Script kiểm tra từ ngoài cấp không báo lỗi; mỗi bài ≥ 3 bước và ≥ 1 câu hỏi.
### Bước 3 — Trận trùm, bài thi lên cấp, Khám phá từ, Họ vần
Trùm cho từng vùng, đề thi lên cấp, nội dung Khám phá và Họ vần cấp 5.
**Kiểm tra:** Thi thử lên cấp 6 bằng hồ sơ thử: đạt thì hiện màn chúc mừng, cấp 6 ghi "Sắp có" vì GĐ3 chưa làm.

## Kiểm tra cuối task
seed trên database trống; con học thử 2 bài cấp 5.
