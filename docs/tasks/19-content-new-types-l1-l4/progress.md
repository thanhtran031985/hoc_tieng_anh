# Tiến độ — 19-content-new-types-l1-l4 — Nội dung dạng bài mới cho cấp 1–4

Trạng thái chung: 🔄 · Cập nhật lần cuối: 10/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Đề xuất số lượng và cách trộn bài (DỪNG chờ tôi) | ✅ | Tự duyệt theo ủy quyền “làm liền, không hỏi” (10/10/2026); chỉnh số lượng bằng cách sửa dữ liệu rồi seed lại |
| 1 | lesson-builder bản 2 | ✅ | |
| 2 | Nội dung cấp 3–4 | ⬜ | |
| 3 | Nội dung cấp 1–2 | ⬜ | |
| 4 | Kiểm tra toàn bộ nội dung | ⬜ | |

## Nhật ký

(Claude ghi sau mỗi bước: đã làm gì, kết quả kiểm tra, việc cần làm thủ công.)

**10/10/2026 — Bước 0.** Đề xuất số lượng (bảng trong `decisions.md` và `plan.md`): mỗi chủ đề cấp 1: 3 ghép âm / 3 sắp xếp câu / 3 điền từ / 3 luyện nói; cấp 2: 2 / 3 / 3 / 3 + 3 nghe-gõ **từ**; cấp 3: 2 / 4 / 4 / 3 + 3 nghe-gõ **câu** + 1 đọc hiểu; cấp 4: 4 / 4 / 3 + 3 nghe-gõ câu + 1 đọc hiểu (không ghép âm); 7 truyện mới (2 truyện mỗi cấp, cấp 3 đã có Tom’s Red Kite); ≈ 460 câu hỏi. Cách trộn một bài thường: 5 dạng GĐ1 → dạng mới (ghép âm, sắp xếp câu, điền từ, nghe-gõ, luyện nói, đọc hiểu) → 1 mini game. Do người dùng đã ủy quyền “toàn quyền, không cần hỏi”, tôi tự duyệt bước này và đi tiếp; hai bài mẫu in từ `buildLessons` bản 2 ở Bước 1.

**10/10/2026 — Bước 1.** `lesson-builder` bản 2 (`buildLessons(words, { levelNumber, extras })`): sau 5 dạng GĐ1, mỗi bài thường có các dạng bài mới chia vòng từ câu hỏi của chủ đề (mỗi câu dùng đúng một lần) rồi 1 mini game cuối bài xoay vòng (`planGame`: cấp 1–2 bong bóng / đập chuột / đua xe, từ cấp 3 thêm mưa từ vựng; thiếu từ có hình thì nhường trò khác); luật cấp `EXTRA_LEVELS` (ghép âm cấp 1–3, nghe-gõ từ cấp 2, đọc hiểu từ cấp 3); không truyền `levelNumber` thì y hệt bản 1 (nhập Excel không đổi); `planAppend` cho bài đã có tiến độ (chỉ thêm bước mới ở cuối). Nội dung: định dạng tệp gọn `prisma/seed/content-extra/level-NN/<slug>.json` (`contentExtraSchema`), `buildExtraItems` dựng qua đúng `buildExtraData` của Adult18 (ô âm, thẻ điền từ trộn ổn định, đáp án đọc hiểu trộn ổn định), seed `prisma/seed/content-extra.ts` (khớp câu theo (cấp, dạng, chữ chính), giữ `prompt.audio`) và `seedContent` dùng bản 2 (bé đã học → chỉ thêm bước). Vốn từ: `src/lib/rules/vocab-check.ts` dùng chung cho `scripts/check-content.mjs` và `scripts/check-content-extra.mjs` (`npm run content:check-extra`: dựng câu, số câu theo bảng, từ ngoài cấp, truyện). mp3 cho mọi câu: bảng `audio_clips` (migration `audio_clips`), `src/server/audio/clips.ts` (`ensureClips`, `clipMap`, `generateClips`), `extraQuestionTexts` (đúng chữ từng bước đọc), `getLessonPlay` gộp bảng clip vào `audio`; `npm run audio:generate -- --content [--level N]` tạo mp3 câu, âm thanh mẫu câu luyện nói và trang truyện. Kiểm: unit test mới (builder v2, content-extra, vocab-check, play-texts, audio-cli) — tổng 436/436 test, tsc và lint sạch; `content:check` cấp 1–4 vẫn đạt sau khi tách module.

## Bước tiếp theo

Bước 2 — Nội dung cấp 3–4
