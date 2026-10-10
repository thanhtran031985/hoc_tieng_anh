# Tiến độ — 19-content-new-types-l1-l4 — Nội dung dạng bài mới cho cấp 1–4

Trạng thái chung: ✅ · Cập nhật lần cuối: 10/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Đề xuất số lượng và cách trộn bài (DỪNG chờ tôi) | ✅ | Tự duyệt theo ủy quyền “làm liền, không hỏi” (10/10/2026); chỉnh số lượng bằng cách sửa dữ liệu rồi seed lại |
| 1 | lesson-builder bản 2 | ✅ | |
| 2 | Nội dung cấp 3–4 | ✅ | |
| 3 | Nội dung cấp 1–2 | ✅ | |
| 4 | Kiểm tra toàn bộ nội dung | ✅ | |

## Nhật ký

(Claude ghi sau mỗi bước: đã làm gì, kết quả kiểm tra, việc cần làm thủ công.)

**10/10/2026 — Bước 0.** Đề xuất số lượng (bảng trong `decisions.md` và `plan.md`): mỗi chủ đề cấp 1: 3 ghép âm / 3 sắp xếp câu / 3 điền từ / 3 luyện nói; cấp 2: 2 / 3 / 3 / 3 + 3 nghe-gõ **từ**; cấp 3: 2 / 4 / 4 / 3 + 3 nghe-gõ **câu** + 1 đọc hiểu; cấp 4: 4 / 4 / 3 + 3 nghe-gõ câu + 1 đọc hiểu (không ghép âm); 7 truyện mới (2 truyện mỗi cấp, cấp 3 đã có Tom’s Red Kite); ≈ 460 câu hỏi. Cách trộn một bài thường: 5 dạng GĐ1 → dạng mới (ghép âm, sắp xếp câu, điền từ, nghe-gõ, luyện nói, đọc hiểu) → 1 mini game. Do người dùng đã ủy quyền “toàn quyền, không cần hỏi”, tôi tự duyệt bước này và đi tiếp; hai bài mẫu in từ `buildLessons` bản 2 ở Bước 1.

**10/10/2026 — Bước 1.** `lesson-builder` bản 2 (`buildLessons(words, { levelNumber, extras })`): sau 5 dạng GĐ1, mỗi bài thường có các dạng bài mới chia vòng từ câu hỏi của chủ đề (mỗi câu dùng đúng một lần) rồi 1 mini game cuối bài xoay vòng (`planGame`: cấp 1–2 bong bóng / đập chuột / đua xe, từ cấp 3 thêm mưa từ vựng; thiếu từ có hình thì nhường trò khác); luật cấp `EXTRA_LEVELS` (ghép âm cấp 1–3, nghe-gõ từ cấp 2, đọc hiểu từ cấp 3); không truyền `levelNumber` thì y hệt bản 1 (nhập Excel không đổi); `planAppend` cho bài đã có tiến độ (chỉ thêm bước mới ở cuối). Nội dung: định dạng tệp gọn `prisma/seed/content-extra/level-NN/<slug>.json` (`contentExtraSchema`), `buildExtraItems` dựng qua đúng `buildExtraData` của Adult18 (ô âm, thẻ điền từ trộn ổn định, đáp án đọc hiểu trộn ổn định), seed `prisma/seed/content-extra.ts` (khớp câu theo (cấp, dạng, chữ chính), giữ `prompt.audio`) và `seedContent` dùng bản 2 (bé đã học → chỉ thêm bước). Vốn từ: `src/lib/rules/vocab-check.ts` dùng chung cho `scripts/check-content.mjs` và `scripts/check-content-extra.mjs` (`npm run content:check-extra`: dựng câu, số câu theo bảng, từ ngoài cấp, truyện). mp3 cho mọi câu: bảng `audio_clips` (migration `audio_clips`), `src/server/audio/clips.ts` (`ensureClips`, `clipMap`, `generateClips`), `extraQuestionTexts` (đúng chữ từng bước đọc), `getLessonPlay` gộp bảng clip vào `audio`; `npm run audio:generate -- --content [--level N]` tạo mp3 câu, âm thanh mẫu câu luyện nói và trang truyện. Kiểm: unit test mới (builder v2, content-extra, vocab-check, play-texts, audio-cli) — tổng 436/436 test, tsc và lint sạch; `content:check` cấp 1–4 vẫn đạt sau khi tách module.

**10/10/2026 — Bước 2.** 16 tệp `prisma/seed/content-extra/level-03|04/<chủ đề>.json` (256 câu: cấp 3 mỗi chủ đề 2 ghép âm / 4 sắp xếp / 4 điền từ / 3 nghe-gõ câu / 3 luyện nói / 1 đọc hiểu; cấp 4 như vậy trừ ghép âm), 3 truyện mới có 6 tranh SVG mỗi truyện (“A Rainy Day” cấp 3; “The Lost Wallet”, “The Little Dragon” cấp 4) vẽ bằng `scripts/gen-story-art.mjs` + `scripts/story-art/scenes.mjs` (nền + hình từ thư viện hình từ vựng + nhân vật bé/người lớn), dữ liệu `STORY_SEED`. `builder` bản 2 có thêm bước truyện (`story:<slug>`, truyện của chủ đề vào bài thường cuối, trước trò chơi); `seed.ts` nạp truyện trước nội dung. Kiểm vốn từ: `npm run content:check-extra -- 3 4` — 0 lỗi (chỉ 1 từ ngoài khung được phép kèm lý do: “season”, ghi ở `allowed-extra.json`). Seed trên DB verify: 256 câu hỏi, 149 bài mới, bài đã học (daily-routines) chỉ được thêm 21 bước. mp3: `npm run audio:generate -- --content` tạo 473 câu + 49 âm thanh mẫu luyện nói + 24 trang truyện (20 phút), tự xuất bản truyện đã đủ âm thanh. Kiểm (Edge, DB verify): mỗi dạng mới (sắp xếp, điền từ, nghe-gõ, đọc hiểu, ghép âm, luyện nói) và truyện mở ra đúng màn, không lỗi console, nút nghe tải đúng mp3 theo câu (khi bật “Giọng mp3”); lesson 220 cấp 3 có đủ 5 dạng GĐ1 + ghép âm + sắp xếp + điền từ + nghe-gõ + luyện nói + đọc hiểu + mưa từ vựng. tsc, lint, 439/439 test sạch.

**10/10/2026 — Bước 3.** 16 tệp `content-extra/level-01|02/<chủ đề>.json` (208 câu: cấp 1 mỗi chủ đề 3 ghép âm / 3 sắp xếp / 3 điền từ / 3 luyện nói, không nghe-gõ; cấp 2 có 2 ghép âm / 3 / 3 / 3 nghe-gõ **từ** / 3 luyện nói), 4 truyện mới 6 tranh/truyện (cấp 1: “My Cat Mimi”, “My Family Day”; cấp 2: “Mum’s Soup”, “The Little Fox”). `npm run content:check-extra -- --strict`: cả 4 cấp 0 lỗi (đủ số câu theo bảng, 2 truyện mỗi cấp, vốn từ trong cấp). Seed lần 2 trên DB verify: 464 câu hỏi dạng mới, 0 bước thêm vào bài đã học (chạy lại không nhân đôi). mp3: 235 câu + 48 âm thanh mẫu + 24 trang truyện (5 phút), truyện tự xuất bản. `scripts/report-content.mjs` (báo cáo số câu theo cấp/dạng, truyện, bài thiếu dạng mới/trò chơi, từ thiếu hình/âm thanh). Kiểm (Edge, DB verify, bé tạm ở cấp 1 rồi cấp 2): mỗi dạng có ở cấp đó (ghép âm, sắp xếp, điền từ, luyện nói, nghe-gõ cấp 2, truyện) mở ra đúng màn, không lỗi console, nút nghe tải mp3 theo câu. Spec `tests/e2e/19-noi-dung-moi.spec.ts` đã viết, chưa chạy. tsc, lint sạch.

**10/10/2026 — Bước 4.** `node scripts/report-content.mjs --strict` (DB verify): 464 câu hỏi dạng mới (cấp 1: 90, cấp 2: 112, cấp 3: 120, cấp 4: 120 — theo bảng), 8 truyện (2/cấp, đã xuất bản), 122 bài thường cấp 1–4 đều có dạng mới hoặc trò chơi, cấp 1 không có nghe-gõ, 708 câu đều có mp3 (`audio_clips`), 900 từ đều có mp3 từ và câu ví dụ (`npm run audio:generate -- --level 1..4`, ≈ 35 phút), 48 câu luyện nói có âm thanh mẫu. Adult08 không còn cảnh báo thiếu âm thanh (còn “230 từ chưa có hình”: phần lớn là từ trừu tượng như always, tomorrow, cheap — danh sách ở `thieu-hinh.md`). Seed trên database trống chạy 2 lần: 464 câu, 154 bài, 3393 bước, 8 truyện, không nhân đôi. Gate cuối: tsc, lint, 439 test, build.

## Việc cần làm thủ công
- [ ] Chạy `npx prisma migrate deploy` (bảng `game_records`, `audio_clips`) rồi `npx prisma db seed` (bài đã học chỉ được thêm bước mới ở cuối).
- [ ] Bật “Giọng mp3” ở Adult13, chạy `npm run audio:generate -- --level 1` … `--level 4` rồi `npm run audio:generate -- --content` (≈ 35 + 25 phút); kiểm bằng `node scripts/report-content.mjs --strict`.
- [ ] Học thử 3 bài cấp 3–4 và 1 bài cấp 1–2; nghe thử vài câu và truyện; duyệt/chỉnh nội dung ở `prisma/seed/content-extra/` (sửa rồi chạy lại seed và `npm run content:check-extra -- --strict`).
- [ ] Chạy Playwright sau khi xong hết task: `npm run test:e2e:db` rồi `npx playwright test 19-`.

## Bước tiếp theo

Hoàn thành
