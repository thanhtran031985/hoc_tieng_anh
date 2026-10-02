# Kế hoạch — 05-content-l1-l4 — Khung chương trình 10 cấp và nội dung cấp 1–4

## Context
Task 03 đã có schema và seed khung 4 chặng/10 cấp, nhưng chưa có chủ đề, từ vựng, bài học nào. Task 06–07 cần dữ liệu thật để làm bản đồ và trình phát bài. Bé đang học lớp 4 nên cần cấp 3–4 trước. Task này nạp khung chương trình cho cả 10 cấp, thêm hàm tạo bài tự động, và soạn nội dung chi tiết cấp 1–4 (làm theo thứ tự 3 → 4 → 2 → 1).

## Hiện trạng đã kiểm tra
- `prisma/seed.ts` (một tệp) chỉ upsert stages/levels/admin; chạy qua `node prisma/seed.ts` (Node 25 chạy thẳng TypeScript, import có đuôi `.ts`).
- `Unit` hiện chỉ có `title, titleVi, image, sortOrder, status(draft|published)`; không có `slug`, `source`, `targetWords`. Chưa có thư mục `public/`, `src/lib/rules/`, `prisma/seed/`.
- `Word` đủ trường (word, ipa, partOfSpeech, meaningVi, exampleEn/Vi, image, levelId, extra); chủ đề từ qua `Topic`/`WordTopic`. `LessonStep(activityType, wordId, questionId, config)` với 4 dạng bài ở `src/lib/schemas/lesson-step-config.ts`. `LessonKind` có `unit_test` dùng cho trận trùm.
- `WordPicture` (`src/components/ui/WordPicture/`) chỉ vẽ SVG nội tuyến từ `pictures.ts` (23 hình chép từ design, dùng `var(--dragon-line)`). Chưa có đường dẫn tải hình từ `public/media/pictures/`.
- Không có test runner; không được cài package → dùng `node --test` (có sẵn) chạy thẳng tệp `.ts`. `scripts/` đã bị loại khỏi tsconfig.

## Quyết định thiết kế (sẽ ghi vào decisions.md)
1. **Khóa chủ đề:** thêm `slug` (unique theo cấp) để seed chạy lại không trùng; thêm `source` (VarChar, vd "Cambridge Starters"), `targetWords` (Json, danh sách từ mục tiêu), và giá trị `planned` cho `ContentStatus`. Quy ước `draft` giữ nguyên cho nội dung đang soạn trong quản trị (task 12).
2. **Seed tách module:** `prisma/seed.ts` giữ vai trò điều phối; thêm `prisma/seed/curriculum.ts` (đọc `curriculum/level-NN.json`) và `prisma/seed/content.ts` (đọc `content/level-NN/<slug>.json`). Seed khung KHÔNG đè chủ đề đã `published`; seed nội dung đổi `planned` → `published`.
3. **Hình minh họa:** SVG ghi tệp `public/media/pictures/<word>.svg` (theo task.md). Vì `<img>` không đọc được `var(--dragon-line)`, các tệp dùng màu viền đã giải sẵn (`#2b2440`, cùng giá trị token). `WordPicture` được mở rộng: từ có trong `pictures.ts` → vẽ nội tuyến như cũ; không có thì dùng `<img src="/media/pictures/<word>.svg">` (đúng khung 120×120); không có cả hai → khung trống như hiện tại. Tệp hình sinh bằng script `scripts/gen-pictures.mjs` từ mô tả hình khối gọn (bộ khối dùng chung: tròn, bầu dục, đường cong, màu bảng chung của Bông) để cùng phong cách và dễ sửa; script nằm trong `scripts/` (không vào bundle). Từ trừu tượng để trống hình, ghi danh sách vào decisions.md.
4. **Từ không trùng giữa các cấp:** kiểm bằng script `scripts/check-curriculum.mjs` chạy `node` (không cài thêm gì).

## Các bước

### Bước 0 — Cột và trạng thái mới
- Sửa `prisma/schema.prisma`: `ContentStatus` thêm `planned`; `Unit` thêm `slug VarChar(100)`, `source VarChar(100)?`, `targetWords Json?`, `@@unique([levelId, slug])`.
- `npx prisma migrate dev --name unit_curriculum` (SQL phải chạy được cả MariaDB và MySQL 8; Json → `JSON`/`LONGTEXT` do adapter xử lý như các cột Json hiện có), `npx prisma generate`.
- Truy vấn dùng chung cho học sinh: thêm `src/lib/content-queries.ts` với `publishedUnitsWhere` (`status: "published"`) để các task sau dùng, không lọc rải rác.
- Kiểm tra: migration chạy trên MariaDB; một script nhỏ tạo unit `planned` và xác nhận truy vấn học sinh không thấy.

### Bước 1 — Khung cấp 1–5
- Soạn `prisma/seed/curriculum/level-01.json … level-05.json`. TRƯỚC khi viết danh sách từ: liệt kê chủ đề và số từ mỗi chủ đề (6–8 chủ đề/cấp, tổng 150/200/250/300/400 từ) → trình bạn duyệt. Task này cần bạn duyệt nên tôi sẽ dừng ở đây đúng như task.md, trừ khi bạn dặn tự duyệt.
- Mở rộng seed: tạo `units` `planned`, upsert theo `(level, slug)`.
- Kiểm tra bằng `scripts/check-curriculum.mjs`: số chủ đề/cấp, tổng từ gần PRD A1, không trùng từ giữa các cấp, từ viết thường.

### Bước 2 — Khung cấp 6–10
- `level-06.json … level-10.json`, 10–12 chủ đề/cấp, tự đặt tên (không chép tên Unit SGK), từ mục tiêu theo nhóm chủ đề. Trình danh sách chủ đề để duyệt trước.
- Kiểm tra: seed trên database trống → đủ 10 cấp có chủ đề `planned`; chạy lại không trùng.

### Bước 3 — Hàm tạo bài tự động
- `src/lib/rules/lesson-builder.ts` (hàm thuần, không import Prisma): `buildLessons(words, options)` → danh sách bài `{ title, kind, steps[] }`. Chia 5–8 từ/bài (13 từ → 7 + 6); mỗi bài: `word_card` từng từ → `listen_choose_picture` → `match_pairs` → `choose_word_for_picture`; cuối chủ đề thêm bài `unit_test` (trận trùm) trộn từ cả chủ đề. Từ không có hình bỏ các bước cần hình cho từ đó. Cấu hình bước đi qua `parseLessonStepConfig`.
- Test: `src/lib/rules/lesson-builder.test.ts` chạy bằng `node --test`; thêm script `npm run test` nếu bạn đồng ý (đây là sửa `package.json`, không phải cài package).
- Kiểm tra: 13 từ → 2 bài (7 + 6) + 1 trận trùm; từ thiếu hình không có câu nghe chọn hình; thứ tự bước đúng.

### Bước 4–6 — Cấp 3 (khoảng 250 từ)
- Bước 4: `prisma/seed/content/level-03/<slug>.json` gồm word, ipa, partOfSpeech, meaningVi, exampleEn, exampleVi, hasPicture. Câu ví dụ ngắn, chỉ dùng từ cùng cấp hoặc thấp hơn, ngữ pháp của cấp đó. Script kiểm tra: đủ trường, thường, câu ví dụ chỉ chứa từ ≤ cấp.
- Bước 5: sinh hình cho từ cụ thể bằng `scripts/gen-pictures.mjs` → `public/media/pictures/*.svg`; mở rộng `WordPicture` (xem quyết định 3); xem thử vài hình qua trang xem thử tạm (xóa sau).
- Bước 6: `prisma/seed/content.ts` ghi Word + Topic/WordTopic + Lesson/LessonStep bằng `lesson-builder`, đổi chủ đề sang `published`; chạy lại không trùng (khóa `words` theo (word, levelId), lesson xóa-tạo lại theo unit chưa có tiến độ).
- Kiểm tra: seed chạy được; mỗi chủ đề có bài và trận trùm; đếm số bài theo chủ đề.

### Bước 7, 8, 9 — Cấp 4 (≈300), cấp 2 (≈200), cấp 1 (≈150)
Lặp lại 4–6 cho từng cấp. Cấp 1–2 ưu tiên từ cụ thể (con vật, đồ vật, màu, số) nên nhiều hình hơn.

## Quy ước sau mỗi bước
Theo workflow đã chốt: tự chạy phần Kiểm tra, cập nhật `progress.md` và `npm run tasks:dashboard`, commit `05-content-l1-l4: step N — …`, push `origin feat/05-content-l1-l4`. Ngoại lệ DỪNG chờ bạn: duyệt danh sách chủ đề ở Bước 1 và 2 (task.md yêu cầu). Cuối task: `npx tsc --noEmit`, `npm run lint`, `npm run build`, rồi `/finish-task`.

## Rủi ro, ghi chú
- Khối lượng lớn: khoảng 900 từ và hình; cấp 3–4 làm trước, mỗi cấp một đợt commit riêng.
- Số từ nội dung cấp 5 (400) chỉ nằm trong khung; chi tiết cấp 5 trở lên ngoài phạm vi.
- Cần bạn kiểm tay: danh sách chủ đề/từ mục tiêu, vài hình minh họa, chất lượng câu ví dụ tiếng Việt.
- Không cài package mới; không động tới `designs/`, `.env`.

## Kiểm tra cuối task
Seed trên database trống: đủ 10 cấp có chủ đề; cấp 1–4 `published` đúng số từ và số bài; chạy seed lần hai không trùng; `npx tsc --noEmit`, `npm run lint`, `npm run build` sạch.
