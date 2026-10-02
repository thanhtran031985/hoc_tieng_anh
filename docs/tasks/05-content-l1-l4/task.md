# 05-content-l1-l4 — Khung chương trình 10 cấp và nội dung cấp 1–4

Ngày tạo: 02/10/2026 · Giai đoạn: GĐ1 · Phụ thuộc: 03 · Nhánh: `feat/05-content-l1-l4`

## Mục tiêu
Web có sẵn danh sách chủ đề và từ mục tiêu cho cả 10 cấp, tự tạo được bài học từ danh sách từ, và có đủ nội dung để bé (đang học lớp 4) học thật ở cấp 1–4. Bố/mẹ không phải tự soạn.

## Phạm vi
- Trong:
  - Cột `target_words`, `source` và trạng thái `planned` cho bảng `units`.
  - Seed khung chương trình 10 cấp (chủ đề + từ mục tiêu).
  - Hàm tạo bài tự động từ danh sách từ.
  - Soạn chi tiết từ mục tiêu cấp 1–4 (phiên âm, loại từ, nghĩa, câu ví dụ Anh và Việt, hình minh họa), tạo bài học, seed ở trạng thái `published`. Làm cấp 3–4 trước.
- Ngoài: màn quản trị và nhập Excel (task 12); tệp mp3 giọng đọc (GĐ1 dùng giọng trình duyệt); nội dung chi tiết cấp 5 trở lên.

## Thiết kế
`designs/components/WordPictures`, `Screen06-IslandMap`.

## Quyết định kiến trúc
Khung chương trình:
- Khung nằm trong `prisma/seed/curriculum/level-01.json` … `level-10.json`, mỗi tệp là danh sách chủ đề `{ slug, title, title_vi, source, target_words: [...] }`. Seed tạo `units` ở trạng thái `planned`; chạy lại không trùng và không đè chủ đề đã soạn.
- Nguồn từ mục tiêu: cấp 1–2 Cambridge Starters, cấp 3–4 Movers, cấp 5 Flyers (chia theo chủ đề, mỗi từ chỉ ở một cấp, không lặp từ đã có ở cấp thấp hơn); cấp 6–9 chủ đề của chương trình tiếng Anh THCS, tự đặt tên và chọn từ, không chép nguyên văn SGK; cấp 10 A2 Key và B1 Preliminary.
- Số chủ đề: Tiểu học 6–8 chủ đề mỗi cấp, THCS 10–12. Số từ mới mỗi cấp theo PRD Phần A1 (khoảng 150, 200, 250, 300, 400 cho cấp 1–5).
- Học sinh chỉ thấy `units` ở trạng thái `published`.

Tạo bài tự động:
- Hàm thuần `src/lib/rules/lesson-builder.ts`: nhận danh sách từ của một chủ đề, chia thành bài 5–8 từ; mỗi bài gồm thẻ từ cho từng từ → nghe và chọn hình → nối từ với hình → chọn từ đúng cho hình; cuối chủ đề thêm trận trùm trộn từ cả chủ đề. Từ chưa có hình thì bỏ các dạng cần hình cho từ đó. Task 12 dùng lại hàm này.

Nội dung cấp 1–4:
- Soạn trong `prisma/seed/content/level-NN/<slug-chủ-đề>.json`; seed đọc tệp, ghi DB, đổi chủ đề từ `planned` sang `published`; chạy lại không trùng.
- Hình minh họa: SVG phẳng, viền `dragon-line` 3px, khung 120×120, không có chữ, đặt ở `public/media/pictures/<word>.svg`. Từ khó vẽ (từ trừu tượng) để trống hình và ghi vào decisions.md.
- Câu ví dụ ngắn, chỉ dùng từ cùng cấp hoặc cấp thấp hơn và ngữ pháp của cấp đó (PRD Phần A1).
- Bài học tạo bằng `lesson-builder`, không soạn tay từng bài.

## Các bước
### Bước 0 — Cột và trạng thái mới cho units
Migration mới, thêm vào schema của task 03.
**Kiểm tra:** migration chạy trên MariaDB; chủ đề `planned` không có trong truy vấn của học sinh.
### Bước 1 — Khung cấp 1–5 (Tiểu học)
Liệt kê chủ đề và số từ mỗi chủ đề để tôi duyệt trước, rồi mới viết danh sách từ.
**Kiểm tra:** mỗi cấp 6–8 chủ đề; số từ mới mỗi cấp gần với PRD A1; không có từ trùng giữa các cấp; từ viết thường, đúng chính tả.
### Bước 2 — Khung cấp 6–10
Liệt kê chủ đề để tôi duyệt trước.
**Kiểm tra:** mỗi cấp 10–12 chủ đề; không chép nguyên văn tên Unit SGK; seed tạo đủ 10 cấp có chủ đề.
### Bước 3 — Hàm tạo bài tự động
**Kiểm tra:** test với 13 từ ra 2 bài (7 + 6 từ) và 1 trận trùm; từ thiếu hình không có câu nghe chọn hình; thứ tự bước đúng.
### Bước 4 — Từ vựng cấp 3
**Kiểm tra:** khoảng 250 từ, đủ trường, từ viết thường, câu ví dụ đúng cấp.
### Bước 5 — Hình minh họa cấp 3
**Kiểm tra:** từ cụ thể nào cũng có hình, không chữ trong hình, cùng phong cách thiết kế.
### Bước 6 — Bài học cấp 3 và seed
**Kiểm tra:** seed chạy được; mỗi chủ đề có bài và trận trùm; đếm số bài theo chủ đề.
### Bước 7 — Từ vựng, hình, bài học cấp 4
**Kiểm tra:** như bước 4–6 cho cấp 4 (khoảng 300 từ).
### Bước 8 — Từ vựng, hình, bài học cấp 2
**Kiểm tra:** như bước 4–6 cho cấp 2 (khoảng 200 từ).
### Bước 9 — Từ vựng, hình, bài học cấp 1
**Kiểm tra:** như bước 4–6 cho cấp 1 (khoảng 150 từ).

## Kiểm tra cuối task
Seed trên database trống: đủ 10 cấp có chủ đề; cấp 1–4 có chủ đề `published` với số từ và số bài đúng kế hoạch; chạy lại không trùng; tsc, lint, build.
