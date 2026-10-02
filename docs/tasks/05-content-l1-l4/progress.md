# Tiến độ — 05-content-l1-l4 — Khung chương trình 10 cấp và nội dung cấp 1–4

Trạng thái chung: ⬜ · Cập nhật lần cuối: 02/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Cột và trạng thái mới cho units | ✅ | 02/10/2026 |
| 1 | Khung cấp 1–5 (Tiểu học) | ✅ | 02/10/2026 |
| 2 | Khung cấp 6–10 | ✅ | 02/10/2026 |
| 3 | Hàm tạo bài tự động | ✅ | 02/10/2026 |
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

### Bước 2 — Khung cấp 6–10 (02/10/2026)
- Đã làm: bạn duyệt đề xuất ([curriculum-proposal-l6-l10.md](curriculum-proposal-l6-l10.md)); viết `level-06…10.json` (10 chủ đề mỗi cấp, 401/401/400/492/500 từ; cấp 6–9 `source` = "THCS", cấp 10 = "A2 Key / B1 Preliminary"); `check-curriculum.mjs` thêm số từ mục tiêu cấp 6–10 (suy từ số từ cộng dồn của PRD) và thêm các danh từ riêng được viết hoa (Christmas, Easter, Halloween, Thanksgiving, Tet).
- Kiểm tra: `node scripts/check-curriculum.mjs` đạt, 10 cấp, 3494 từ khác nhau (PRD cộng dồn ≈ 3.500), không trùng giữa các cấp, mỗi cấp 10 chủ đề; seed 2 lần: lần 1 tạo 50 chủ đề mới, lần 2 tạo 0 (tổng 90, cả 10 cấp có chủ đề `planned`); tsc và lint sạch.
- Việc thủ công: cấp 9 hụt 8 từ so với 500 (492, trong ngưỡng 10%). Danh sách từ cấp 6–10 là bản đầu để làm khung; khi soạn chi tiết (GĐ sau) có thể thêm/bớt.

### Bước 3 — Hàm tạo bài tự động (02/10/2026)
- Đã làm: `src/lib/rules/lesson-builder.ts` (hàm thuần `buildLessons`, `splitLessonSizes`); test `src/lib/rules/lesson-builder.test.ts`; script `npm test` (`node --test`, không cài package).
- Kiểm tra: 12 test đạt: 13 từ → 2 bài (7 + 6 từ) + 1 trận trùm; thứ tự bước thẻ từ → nghe chọn hình → nối cặp → chọn từ cho hình; từ thiếu hình chỉ có thẻ từ; chủ đề không có hình thì không có trận trùm; trận trùm ≤ 12 bước, xen hai dạng, cùng kết quả khi chạy lại. `npx tsc --noEmit`, `npm run lint`, `npm run build` sạch.
- Việc thủ công: không.

## Bước tiếp theo

Bước 4 — Từ vựng cấp 3 (≈250 từ: phiên âm, loại từ, nghĩa, câu ví dụ Anh và Việt) trong `prisma/seed/content/level-03/<slug>.json`.
