# 900-real-db-finalize — Hoàn tất dữ liệu trên database thật (giọng đọc, xuất bản, Playwright)

Ngày tạo: 11/10/2026 · Giai đoạn: GĐ2 · Phụ thuộc: 28 · Nhánh: `feat/900-real-db-finalize`

> Task cuối cùng. Bản nháp do Claude viết ngày 11/10/2026 theo yêu cầu “giọng đọc trên database làm sau, tạo task 900 là cuối cùng”; bạn đọc và sửa trước khi bắt đầu.

## Mục tiêu
Database thật `hoc_tieng_anh` có đủ nội dung cấp 1–5 **dùng được ngay**: mọi từ, câu và truyện có giọng đọc, “Giọng mp3” đã bật, Khám phá từ và Họ vần đã xuất bản, và bộ Playwright của task 22–28 đã chạy một lần.

## Hiện trạng đầu task (đã làm sẵn ngày 11/10/2026, sau task 28)
- Đã sao lưu `backups/hoc_tieng_anh-truoc-seed-28.sql` (thư mục ngoài git), đã `prisma migrate deploy` (migration `word_family`) và `prisma db seed`: 1385 từ (400 từ cấp 5), 40 chủ đề `published`, 215 bài, 10 truyện, 5 đề thi lên cấp, 150 từ Khám phá (749 nhánh), 36 họ vần.
- Giọng đọc đã tạo xong: **từ + câu ví dụ của cả 1385 từ**, **1046 câu hỏi dạng mới và 120 câu luyện nói**, **60 trang truyện** (10 truyện đã tự xuất bản).
- **Còn thiếu giọng đọc:** 21 từ Khám phá (123 tệp) và đoạn văn của 34/36 họ vần (lệnh bị dừng giữa chừng, chạy lại được).
- **Chưa bật** “Giọng mp3” (bảng `app_settings` trống) nên bé vẫn nghe giọng của trình duyệt.
- **Chưa xuất bản:** 35/36 họ vần và 733 nhánh Khám phá còn Nháp (1 họ và 16 nhánh bạn đã xuất bản tay, giữ nguyên).
- **Chưa chạy** Playwright cho task 22–28 (cần `prisma migrate reset` database thử, phải được bạn đồng ý rõ ràng).
- Hồ sơ thật: Minh Anh (cấp 3), Vũ Anh (cấp 1).

## Phạm vi
- Trong: tạo giọng đọc còn thiếu, bật công tắc “Giọng mp3”, xuất bản Khám phá từ và Họ vần đủ điều kiện, kiểm lại bằng script và (nếu có) Edge, chạy Playwright một lần, ghi kết quả.
- Ngoài: soạn thêm nội dung mới; sửa nội dung bạn đã chỉnh tay; AI hỗ trợ soạn (task 29); xóa hay ghi đè dữ liệu học của bé.

## Quyết định kiến trúc
- Sao lưu database trước mỗi thay đổi hàng loạt (`mysqldump`, thư mục `backups/` đã loại khỏi git).
- Chỉ xuất bản mục mà `explorerIssues` / `familyIssues` báo 0 lý do; mục bạn đã sửa tay hoặc đã xuất bản thì giữ nguyên. Ghi danh sách đã xuất bản vào `decisions.md`.
- Giọng đọc chạy nền bằng `npm run audio:generate` (chạy lại được, chỉ tạo phần thiếu); không chạy khi bạn đang cần máy (Kokoro tốn CPU, khoảng 45 phút cho 150 từ Khám phá và họ vần).
- Chạy Playwright chỉ khi bạn trả lời đồng ý ở hộp hỏi (AskUserQuestion) vì `npm run test:e2e:db` làm `prisma migrate reset` trên database thử.

## Các bước
### Bước 0 — Kiểm tra hiện trạng (không sửa dữ liệu)
Chạy `node scripts/report-content.mjs --strict` và `npm run audio:generate -- --wordlab --dry-run` trên database thật, sao lưu mới nếu đã có thay đổi từ lần trước.
**Kiểm tra:** Danh sách còn thiếu khớp mục “Hiện trạng đầu task”.
### Bước 1 — Giọng đọc còn thiếu
`npm run audio:generate -- --wordlab` (và `--level N`, `--content` nếu `report-content` còn báo thiếu).
**Kiểm tra:** `report-content --strict` báo “Đủ: không còn việc thiếu”; dry-run `--wordlab` báo 0 từ, 0 họ thiếu.
### Bước 2 — Bật “Giọng mp3”
Ghi công tắc ở `app_settings` (cùng cách màn Quản trị › Âm thanh), kiểm bé nghe mp3 ở một bài và ở Sổ từ.
**Kiểm tra:** `getVoiceMp3Enabled()` trả `true`; mở một bài bằng hồ sơ thử, tệp `/audio/…mp3` được tải.
### Bước 3 — Xuất bản Khám phá từ và Họ vần
Xuất bản các từ/họ không còn cảnh báo (cùng điều kiện Adult22/Adult23), trừ mục đã xuất bản hoặc chỉnh tay.
**Kiểm tra:** script đọc database: 0 mục xuất bản mà còn lý do chặn; mở thử vài từ trong Sổ từ.
### Bước 4 — Playwright
Hỏi bạn đồng ý, rồi `npm run test:e2e:db` và chạy các spec của task 22–28 một lần; ghi kết quả và lỗi phát hiện (không sửa lỗi ngoài phạm vi, chỉ báo).
**Kiểm tra:** Số liệu đạt/hỏng ghi ở `progress.md`.

## Kiểm tra cuối task
`report-content --strict` sạch; bé thử một bài cấp 5 và một từ Khám phá nghe được mp3; README ✅.
