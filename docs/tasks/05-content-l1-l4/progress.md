# Tiến độ — 05-content-l1-l4 — Khung chương trình 10 cấp và nội dung cấp 1–4

Trạng thái chung: ⬜ · Cập nhật lần cuối: 02/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Cột và trạng thái mới cho units | ✅ | 02/10/2026 |
| 1 | Khung cấp 1–5 (Tiểu học) | ✅ | 02/10/2026 |
| 2 | Khung cấp 6–10 | ✅ | 02/10/2026 |
| 3 | Hàm tạo bài tự động | ✅ | 02/10/2026 |
| 4 | Từ vựng cấp 3 | ✅ | 02/10/2026 |
| 5 | Hình minh họa cấp 3 | ✅ | 02/10/2026 |
| 6 | Bài học cấp 3 và seed | ✅ | 02/10/2026 |
| 7 | Từ vựng, hình, bài học cấp 4 | ✅ | 02/10/2026 |
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

### Bước 4 — Từ vựng cấp 3 (02/10/2026)
- Đã làm: soạn 250 từ cấp 3 trong `prisma/seed/content/level-03/<slug>.json` (8 tệp, mỗi từ có phiên âm, loại từ, nghĩa tiếng Việt, câu ví dụ Anh và Việt); schema Zod dùng chung `src/lib/schemas/content.ts`; script `scripts/check-content.mjs`.
- Kiểm tra: `node scripts/check-content.mjs 3` đạt: đúng 250 từ, mỗi chủ đề khớp từng từ với `target_words`; đủ trường; phiên âm trong `/…/`; câu ví dụ ≤ 12 từ, chứa từ đó và chỉ dùng từ cấp 1–3 hoặc từ thông dụng (danh sách trong script); `tsc`, `lint` sạch.
- Việc thủ công: nên đọc lướt phiên âm và câu tiếng Việt vài chủ đề (tôi soạn, chưa có người rà).

### Bước 5 — Hình minh họa cấp 3 (02/10/2026)
- Đã làm: bộ khối vẽ `scripts/pictures/lib.mjs` (viền dragon-line 3px, khối màu phẳng, khung 120×120); hình cấp 3 trong `scripts/pictures/level-03.mjs` (+ `level-03-more.mjs`); `scripts/gen-pictures.mjs` sinh 160 tệp SVG vào `public/media/pictures/<từ>.svg`; `src/lib/picture-path.ts` (tên tệp và URL theo từ); `WordPicture` nhận thêm `src` (đường dẫn tệp), từ không có hình vẫn hiện khung trống; script `scripts/check-pictures.mjs`.
- Kiểm tra: `node scripts/check-pictures.mjs 3` đạt: 160/250 từ có hình; mọi tệp là SVG 120×120, không có `<text>`, `<script>`, `<image>`, đúng màu viền dragon-line, không hình mồ côi. Đã xem các hình trên trang xem thử (Edge không đầu) và vẽ lại hình yếu (strong, bridge, road, lake, ship, summer). tsc, lint sạch.
- Việc thủ công: nên xem lướt các hình (chạy `node scripts/gen-pictures.mjs --sheet duong-dan.html` rồi mở tệp HTML). 90 từ trừu tượng không có hình (xem decisions.md).

### Bước 6 — Bài học cấp 3 và seed (02/10/2026)
- Đã làm: `prisma/seed/content.ts` (đọc `content/level-NN/*.json`, kiểm bằng Zod, ghi từ, chủ đề từ, liên kết từ–chủ đề, bài học và bước bằng `buildLessons` trong một giao dịch mỗi chủ đề, đổi chủ đề sang `published`; đặt `words.image` theo tệp hình có thật); gọi từ `prisma/seed.ts` sau khung chương trình.
- Kiểm tra: `npx prisma db seed` chạy 2 lần cho cùng kết quả (8 chủ đề cấp 3 `published`, 250 từ, 8 chủ đề từ, 250 liên kết, 41 bài, 679 bước, không trùng); mỗi chủ đề có 3–5 bài thường và 1 trận trùm (`unit_test`, ≤ 12 bước); 160 từ có `image`; `match_pairs` không có `wordId`, `pairCount` đúng; tsc và lint sạch.
- Số bài theo chủ đề (bài thường + trận trùm): daily-routines 4+1, days-months-seasons 4+1, weather-nature 3+1, sports 4+1, hobbies-music 4+1, meals-food 5+1, describing-people 4+1, holidays-transport 5+1 (tổng 33 bài thường + 8 trận trùm = 41); chủ đề ít hình (ngày tháng) có bài chỉ gồm thẻ từ.
- Việc thủ công: không.

### Bước 7 — Từ vựng, hình, bài học cấp 4 (02/10/2026)
- Đã làm: 300 từ cấp 4 trong `prisma/seed/content/level-04/` (8 chủ đề; phiên âm, loại từ, nghĩa, câu ví dụ Anh và Việt; câu ví dụ dùng quá khứ đơn và so sánh); `check-content.mjs` biết thêm dạng bất quy tắc (bought, went…), so sánh hơn/nhất, sở hữu cách, và cho phép chính từ đang dạy trong câu ví dụ của nó; 200 hình SVG mới cho cấp 4 (`scripts/pictures/level-04*.mjs`: địa điểm, biển chỉ đường, nghề nghiệp, sức khỏe, mua sắm, truyện, trường học và công nghệ, động từ vẽ được); seed cấp 4.
- Kiểm tra: `check-content.mjs 3 4` đạt (550 từ); `check-pictures.mjs 3 4` đạt (cấp 4: 200/300 từ có hình); `npx prisma db seed` 2 lần cho cùng kết quả: 16 chủ đề `published`, 550 từ, 89 bài; cấp 4 có 8 chủ đề, 4–6 bài thường mỗi chủ đề và 1 trận trùm (đủ cả 8); tsc, lint sạch. Đã xem các hình trên trang xem thử và sửa hình yếu (dragon, dentist, secretary).
- Ngoài phạm vi nhưng cần để lint sạch: thêm `cap-nhat-*/**` vào bỏ qua của `eslint.config.mjs` (thư mục `cap-nhat-thiet-ke/` bạn tải về chứa tệp `.js`/`.d.ts` làm lint lỗi).
- Việc thủ công: xem lướt hình và đọc vài chủ đề.

## Bước tiếp theo

Bước 8 — Từ vựng, hình, bài học cấp 2 (≈200 từ).
