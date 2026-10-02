# 05-content-l1-l2 — Nội dung mẫu cấp 1–2

Ngày tạo: 02/10/2026 · Giai đoạn: GĐ1 · Phụ thuộc: 03 · Nhánh: `feat/05-content-l1-l2`

## Mục tiêu
Có đủ nội dung để bé học thật cấp 1 (Hạt giống) và cấp 2 (Mầm non).

## Phạm vi
- Trong: danh sách chủ đề, từ vựng (từ, phiên âm, nghĩa, câu ví dụ, chủ đề), bài học và các bước bài cho cấp 1–2; hình minh họa cùng phong cách WordPictures; seed vào DB.
- Ngoài: tệp mp3 giọng đọc (GĐ1 dùng giọng trình duyệt), nội dung cấp 3 trở lên.

## Thiết kế
`designs/components/WordPictures`, `Screen06-IslandMap` (4 vùng mẫu: Con vật, Trái cây, Màu sắc, Số đếm).

## Quyết định kiến trúc
- Nội dung soạn trong `prisma/seed/content/*.json` (một tệp mỗi chủ đề), seed đọc tệp và ghi DB, chạy lại không trùng.
- Hình minh họa: SVG phẳng, viền `dragon-line` 3px, khung 120×120, đặt ở `public/media/pictures/<word>.svg`.
- Mỗi bài 5–8 từ mới; mỗi chủ đề 5 bài + 1 trận trùm.

## Các bước
### Bước 0 — Khung chủ đề cấp 1–2
Danh sách chủ đề và số bài, tôi duyệt trước khi soạn từ.
**Kiểm tra:** danh sách được duyệt, ghi vào decisions.md.
### Bước 1 — Từ vựng cấp 1
**Kiểm tra:** khoảng 150 từ, đủ trường, từ viết thường, câu ví dụ đơn giản.
### Bước 2 — Hình minh họa cấp 1
**Kiểm tra:** mỗi từ cấp 1 có hình, không chữ trong hình, cùng phong cách thiết kế.
### Bước 3 — Bài học cấp 1
**Kiểm tra:** mỗi bài có thẻ từ, nghe chọn hình, nối từ, chọn từ đúng; seed chạy được.
### Bước 4 — Từ vựng, hình, bài học cấp 2
**Kiểm tra:** như bước 1–3 cho cấp 2 (khoảng 200 từ mới).

## Kiểm tra cuối task
Seed trên database trống; đếm số từ, số bài theo cấp đúng kế hoạch.
