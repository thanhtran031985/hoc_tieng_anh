# Kế hoạch — Task 19 `19-content-new-types-l1-l4` (nhánh `feat/19-content-new-types-l1-l4`, tách từ `feat/18-mini-games`)

## Context
Cấp 1–4 hiện có 32 chủ đề (≈ 900 từ, ≈ 130 bài thường + 32 trận trùm) nhưng mọi bài chỉ có 5 dạng GĐ1 (`lesson-builder` bản 1). Task 15–18 đã có 6 dạng câu hỏi mới (ghép âm, sắp xếp câu, nghe-gõ, điền từ, đọc hiểu ngắn, luyện nói), truyện tranh và 4 mini game, nhưng chưa có nội dung và chưa được trộn vào bài. Task này: nội dung (seed) + `lesson-builder` bản 2 + mp3 + báo cáo kiểm tra.

Bước 0 yêu cầu “DỪNG chờ tôi duyệt”; người dùng đã ủy quyền làm liền không hỏi nên **tôi tự duyệt đề xuất dưới đây, ghi rõ vào `decisions.md`** (người dùng có thể đổi số lượng sau, chỉ cần sửa bảng dữ liệu rồi chạy lại seed).

## Đề xuất số lượng (Bước 0, ghi `decisions.md` + `progress.md`)
Mỗi chủ đề (8 chủ đề/cấp, 32 chủ đề):

| Cấp | Ghép âm | Sắp xếp câu | Điền từ | Nghe-gõ | Luyện nói | Đọc hiểu | Truyện/cấp |
|---|---|---|---|---|---|---|---|
| 1 | 3 (từ CVC) | 3 | 3 | — | 3 | — | 2 |
| 2 | 2 | 3 | 3 | 3 (**từ**) | 3 | — | 2 |
| 3 | 2 | 4 | 4 | 3 (**câu**) | 3 | 1 | 2 (có sẵn Tom’s Red Kite + 1) |
| 4 | — | 4 | 4 | 3 (câu) | 3 | 1 | 2 |

≈ 460 câu hỏi + 7 truyện mới (6 trang + 1 câu hỏi giữa truyện, 42 tranh SVG ghép từ thư viện hình có sẵn + nhân vật bé/bố vẽ lại từ `gen-story-art`). Luật trộn (đúng task.md): ghép âm chỉ cấp 1–3; nghe-gõ **câu** và đọc hiểu từ cấp 3 (cấp 2 chỉ nghe-gõ từ, cấp 1 không nghe-gõ); Mưa từ vựng từ cấp 3; cấp 1–2 thiên về ghép âm, bong bóng, đập chuột. Mỗi bài thường có ≥ 1 trò chơi và 2–5 bước dạng mới; trận trùm giữ nguyên (task 20 làm).

Cách trộn một bài thường (sau 5 dạng GĐ1, trước trò chơi cuối bài): thẻ từ → nghe-chọn-hình → nối cặp → lật thẻ → chọn từ → **[ghép âm, sắp xếp câu, điền từ, nghe-gõ, luyện nói, đọc hiểu]** → **1 mini game** (xoay vòng: cấp 1–2 bong bóng / đập chuột / đua xe; cấp 3–4 thêm mưa từ vựng). Câu hỏi của chủ đề chia đều cho các bài thường theo vòng (mỗi câu dùng đúng một lần).

## Việc cần làm
**Bước 0 — Đề xuất (tự duyệt).** Ghi bảng trên và 2 bài mẫu (cấp 1 `animals` bài 1, cấp 3 `daily-routines` bài 1, in từ `buildLessons` ở Bước 1) vào `decisions.md`/`progress.md`.
**Bước 1 — `lesson-builder` bản 2 + hạ tầng nội dung.**
- `src/lib/rules/lesson-builder.ts`: `buildLessons(words, {levelNumber, extras, …})`; `BuiltStep.questionKey`; `extras` là khóa câu hỏi của chủ đề theo dạng; hàm thuần `planGames(level, unit)`, `distribute(items, lessons)`, `planAppend(existingSteps, built)` (bài đã học chỉ thêm bước mới ở cuối, không xóa). Không truyền `levelNumber` thì y hệt bản 1 (nhập Excel không đổi). Test: cấp 1 không nghe-gõ; mỗi bài ≥ 1 trò chơi/dạng mới; mưa từ vựng chỉ cấp 3–4; mỗi câu dùng đúng một lần; bài đã học không mất bước nào.
- `src/lib/rules/content-extra.ts` + `src/lib/schemas/content-extra.ts`: định dạng tệp nội dung `prisma/seed/content-extra/level-NN/<slug>.json` (`phonics`, `sentence_order`, `fill_blank`, `dictation`, `speaking`, `short_reading`) và hàm thuần đổi sang dòng `questions` (tách ô âm bằng `splitIntoTiles`, trộn thẻ điền từ theo hạt giống, qua `validateExtraQuestion`).
- `src/lib/rules/vocab-check.ts`: chuyển phần từ chức năng/gốc từ của `scripts/check-content.mjs` thành module dùng chung; `scripts/check-content-extra.mjs` kiểm câu/đoạn chỉ dùng từ của cấp đó và các cấp dưới (+ từ chức năng), in danh sách từ ngoài cấp.
- `prisma/seed/content-extra.ts` (nạp câu hỏi, khớp theo (cấp, dạng, chữ) nên chạy lại không nhân đôi; sửa `seedContent` dùng bản 2 và nhánh “đã học → chỉ thêm bước”).
- mp3 cho mọi câu: bảng mới `audio_clips` (text_key duy nhất, file) + migration; `src/server/audio/clips.ts` (`ensureClips`, `generateClips`, `clipMap(texts)`); `getLessonPlay` gộp bảng clip theo các chữ trong bước vào `audio` (nên mọi bước đã dùng `playPronunciation(text)` tự có mp3, không đổi component); `npm run audio:generate -- --content` tạo clip còn thiếu và điền `prompt.audio` của câu luyện nói + `audio` của trang truyện.
**Bước 2 — Nội dung cấp 3–4.** 16 tệp `content-extra/level-03|04/*.json` + 3 truyện (cấp 3: “A Rainy Day”; cấp 4: 2 truyện) + `scripts/gen-story-art.mjs` (cảnh = nền + hình từ `public/media/pictures` + nhân vật) + dữ liệu `STORY_SEED` + chạy `check-content-extra` (0 lỗi) + seed trên DB verify + tạo mp3 + chơi thử 3 bài bằng Edge.
**Bước 3 — Nội dung cấp 1–2.** Như Bước 2 cho 16 chủ đề, 4 truyện (cấp 1, 2), thiên về ghép âm / bong bóng / đập chuột.
**Bước 4 — Kiểm tra toàn bộ.** `scripts/report-content.mjs` (số câu theo cấp/dạng, số truyện, bài thiếu dạng mới, từ thiếu hình/âm thanh); `npm run audio:generate -- --level 1..4` (+ `--content`) trên DB verify đến hết cảnh báo ở Adult08; seed trên DB trống (`hoc_tieng_anh_seedtest`) chạy 2 lần không nhân đôi; spec e2e `tests/e2e/19-noi-dung-moi.spec.ts` (viết, chưa chạy).

## Tái dùng
`splitIntoTiles` (`src/lib/rules/admin-question-types.ts`), `validateExtraQuestion` (`src/lib/schemas/question-extra.ts`), `STORY_SEED`/`seedStories`, `buildLessons` hiện có, `scripts/check-content.mjs` (logic từ vựng), `scripts/audio-generate.mjs`, `generateForWords`/`synthesizeMp3`/`saveAudioFile` (`src/server/audio`), `seededRandom/shuffled`, `isGameActivity`.

## Kiểm thử
Unit test mới (builder v2, content-extra, vocab-check, planAppend); tsc, lint, `npm test`, build; `check-content-extra` 0 lỗi; seed 2 lần trên DB trống; Edge (DB verify): mở 1 bài mỗi cấp 1–4, thấy các bước mới và trò chơi, chơi thử bước ghép âm, nghe-gõ, đọc hiểu, truyện; Adult08 hết cảnh báo thiếu âm thanh cấp 1–4.
Việc thủ công để báo: `npx prisma migrate deploy` + `npx prisma db seed` + `npm run audio:generate -- --content` + `npm run audio:generate -- --level N`; học thử 3 bài cấp 3–4 và 1 bài cấp 1–2; duyệt/chỉnh nội dung; Playwright sau khi xong hết task.
