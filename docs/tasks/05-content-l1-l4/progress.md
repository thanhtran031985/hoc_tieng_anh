# Tiến độ — 05-content-l1-l4 — Khung chương trình 10 cấp và nội dung cấp 1–4

Trạng thái chung: ⬜ · Cập nhật lần cuối: 02/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Cột và trạng thái mới cho units | ✅ | 02/10/2026 |
| 1 | Khung cấp 1–5 (Tiểu học) | ✅ | 02/10/2026 |
| 2 | Khung cấp 6–10 | ⬜ | |
| 3 | Hàm tạo bài tự động | ⬜ | |
| 4 | Từ vựng cấp 3 | ⬜ | |
| 5 | Hình minh họa cấp 3 | ⬜ | |
| 6 | Bài học cấp 3 và seed | ⬜ | |
| 7 | Từ vựng, hình, bài học cấp 4 | ⬜ | |
| 8 | Từ vựng, hình, bài học cấp 2 | ⬜ | |
| 9 | Từ vựng, hình, bài học cấp 1 | ⬜ | |

## Nhật ký

### Bước 0 — Cột và trạng thái mới cho units (02/10/2026)
- Đã làm: kế hoạch lưu ở `plan.md`; `ContentStatus` thêm `planned`; `units` thêm `slug`, `source`, `target_words` (JSON), khóa duy nhất `(level_id, slug)`. Migration `20261002100000_unit_curriculum` (sinh bằng `migrate diff` vì `migrate dev` không chạy được ở môi trường không tương tác, áp dụng bằng `migrate deploy`), đã `prisma generate`.
- Kiểm tra: migration áp dụng trên MariaDB (`migrate status` sạch); chủ đề `planned` không có trong truy vấn `status: published` của học sinh; trùng slug trong cùng cấp bị chặn; `targetWords` ghi/đọc đúng; `npx tsc --noEmit` sạch.
- Việc thủ công: không. Migration cần chạy `migrate deploy` trên MySQL 8 khi lên hosting (như task 03).

### Bước 1 — Khung cấp 1–5 (02/10/2026)
- Đã làm: bạn duyệt đề xuất chủ đề ([curriculum-proposal-l1-l5.md](curriculum-proposal-l1-l5.md)); viết `prisma/seed/curriculum/level-01…05.json` (8 chủ đề mỗi cấp; 150/200/250/300/400 từ, đúng PRD A1); schema Zod dùng chung `src/lib/schemas/curriculum.ts`; `prisma/seed/curriculum.ts` (upsert theo `(level, slug)`, không đè chủ đề đã soạn) và gọi từ `prisma/seed.ts`; script `scripts/check-curriculum.mjs`.
- Kiểm tra: `node scripts/check-curriculum.mjs` đạt (1300 từ khác nhau, không trùng giữa các cấp, từ viết thường trừ thứ/tháng/English/Vietnamese); `npx prisma db seed` chạy 2 lần: lần 1 tạo 40 chủ đề `planned`, lần 2 vẫn 40 (không trùng); tsc và lint sạch.
- Việc thủ công: không. Khi duyệt có sửa 2 từ trùng (`break` ở cấp 4 đổi thành `grow`; `coach` ở cấp 5 đổi thành `carriage`).
- Đã xóa thư mục `05-content-l1-l2/` (task bản cũ) theo yêu cầu.

## Bước tiếp theo

Bước 2 — Khung cấp 6–10. Cần bạn duyệt danh sách chủ đề (10–12 mỗi cấp) trước khi viết danh sách từ.
