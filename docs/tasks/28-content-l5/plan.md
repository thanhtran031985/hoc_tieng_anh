# Kế hoạch — Task 28 `28-content-l5` (nhánh `feat/28-content-l5`, tách từ `feat/27-content-wordlab`)

## Context
Cấp 1–4 đã có đủ từ, hình, mp3, câu hỏi dạng mới, truyện, trùm, bài thi lên cấp, Khám phá từ và Họ vần (task 05, 19, 20, 27). Cấp 5 "Cây lớn" (Cambridge Flyers) mới chỉ có khung: 8 chủ đề `planned`, 400 từ mục tiêu trong `prisma/seed/curriculum/level-05.json`, chưa có `content/level-05`, `content-extra/level-05`, hình, truyện, trùm, đề thi. Task này làm cấp 5 đầy đủ để trọn bộ tiểu học. Người dùng đã ủy quyền toàn bộ (làm liền, ghi decisions.md); như task 27, **chỉ Bước 0 dừng chờ "continue"**, các bước sau tự chạy tới hết.

8 chủ đề (slug → số từ): travel 52, nature-environment 54, feelings-personality 50, science-study 48, entertainment-media 46, home-household 48, future-plans 52, community-places 50. Ngữ pháp cấp 5 (`prisma/seed.ts`): will, going to, should, must; viết đoạn 3–5 câu.

## Nền sẵn có (tái dùng, không viết lại)
- Nạp nội dung theo khung: `prisma/seed/content.ts` tìm unit theo `(levelId, slug)` (đúng hàng `planned` do `seedCurriculum` tạo, không nhân đôi), ghi từ/bài/bước bằng `buildLessons` bản 2, đổi unit sang `published`. Tên tệp phải trùng slug khung, sai là lỗi.
- Định dạng: `prisma/seed/content/level-NN/<slug>.json` (mảng từ: word, ipa, part_of_speech, meaning_vi, example_en, example_vi; phải đúng `target_words`), `prisma/seed/content-extra/level-NN/<slug>.json` (phonics, sentence_order, fill_blank, dictation, speaking, short_reading).
- Kiểm: `scripts/check-content.mjs`, `scripts/check-content-extra.mjs` (`npm run content:check-extra`), `scripts/check-pictures.mjs`, `scripts/check-wordlab.mjs`, `scripts/report-content.mjs`; vốn từ `src/lib/rules/vocab-check.ts` + `allowed-extra.json`.
- Hình: `scripts/pictures/lib.mjs` + `level-NN*.mjs` (+ `wordlab-NN.mjs`), `gen-pictures.mjs` tự nhận mẫu `(level|wordlab)-\d+.mjs`; xem trước `--sheet` + `.tmp-verify/sheet-shot.mjs`.
- mp3: `npm run audio:generate -- --level 5`, `-- --content --level 5`, `-- --wordlab --level 5` (không hard-code cấp, `--level` 1–10).
- Khám phá từ/Họ vần: `src/lib/rules/wordlab-data/helpers.ts`, các tệp `explorer-level-0N*.ts` làm mẫu, `families-more.ts`, `family-words.json`; seed không hard-code cấp.
- Thi lên cấp: `prisma/seed/exams.ts` + `hasLevelExam` (`level-gate.ts`), `src/server/exam.ts`, `ExamLevelUp`; cấp 6 chưa có chủ đề `published` nên bản đồ `/map/6` đã tự hiện `IslandEmpty` ("Sắp có").

## Quyết định
- **Số lượng** (đề xuất ở Bước 0, người dùng đổi được bằng cách sửa bảng dữ liệu): mỗi chủ đề cấp 5: 5 sắp xếp câu, 5 điền từ, 3 nghe-gõ **câu**, 3 luyện nói, 2 đọc hiểu (= 18 câu, ≈ 144 câu cả cấp); không ghép âm; 2 truyện cấp 5 (6 tranh mỗi truyện, vẽ bằng `gen-story-art`); mỗi chủ đề 1 trận trùm (8 trùm); Khám phá từ 30 danh từ cụ thể (mỗi từ 4–6 nhánh); Họ vần ≈ 8 họ.
- **Hình**: chỉ từ cụ thể có hình (như cấp 1–4); từ trừu tượng (cảm xúc, kế hoạch, cộng đồng…) không vẽ, ghi vào `thieu-hinh.md`. Ước tính ≈ 170–200 hình mới trên 400 từ; con số chốt bằng `check-pictures.mjs 5 --list` ở Bước 0.
- **Vốn từ**: câu ví dụ, câu hỏi dạng mới và truyện chỉ dùng từ cấp 1–5 + từ thông dụng (cùng luật task 19); ngoại lệ ghi vào `allowed-extra.json` kèm lý do.
- **Trùm**: 8 trùm biến thể Vua Khỉ Lém (màu lông × phụ kiện chưa dùng ở cùng cấp), không vẽ nhân vật mới (như task 20).
- **Thi lên cấp 5 → 6**: `EXAM_LAST_LEVEL = 5`; đậu thì bé lên cấp 6 (hàng `levels` đã có), `/map/6` hiện "Sắp có" (GĐ3). Cần xác nhận bằng hồ sơ thử rằng trang chủ/bản đồ cấp 6 không lỗi (giao diện THCS chưa thiết kế; `isPrimaryLevel` ≤ 5).
- **Trạng thái**: chủ đề cấp 5 được seed `published` như cấp 1–4 (truyện nạp Nháp tới khi đủ mp3; Khám phá/Họ vần để Nháp, người dùng xuất bản như task 27).

## Chỗ phải đổi mã (cấp 1–4 hard-code)
- `src/lib/rules/level-gate.ts`: `EXAM_LAST_LEVEL` 4 → 5 (+ cập nhật `level-gate.test.ts`, chú thích).
- `src/lib/rules/lesson-builder.ts`: `EXTRA_LEVELS` max 4 → 5 (trừ `phonics` giữ [1,3]); `slots` của trùm (`level <= 3 ? phonics : dictation` đã đúng cho cấp 5). Test builder cấp 5.
- `src/lib/rules/bosses.ts`: thêm 8 trùm cấp 5 (+ test "32 trùm" → 40); `prisma/seed/rewards.ts:43` `<= 4` → `<= 5`; `src/lib/rules/reward-catalog.ts`: `LEVEL_BADGE_EN[5]`, `level_test` `max: 5`.
- `src/lib/rules/story-data.ts`: 2 truyện cấp 5 (+ `scripts/story-art/scenes.mjs`).
- `scripts/check-content-extra.mjs` (`levels`, bảng `EXPECTED[5]`), `scripts/report-content.mjs` (`LEVELS`), `scripts/check-pictures.mjs`/`check-content.mjs` nếu có danh sách cấp.
- `src/lib/rules/word-explorer-data.ts` (nối `EXPLORER_LEVEL_5`), `families-more.ts`.

## Các bước
**Bước 0 — Danh sách và chủ đề mẫu (DỪNG chờ "continue").** Viết `docs/tasks/28-content-l5/proposal.md`: 8 chủ đề, số từ, bảng số câu/truyện/trùm/Khám phá/Họ vần, ước tính số hình cần vẽ (chạy `check-pictures`), từ trừu tượng không có hình, ngoại lệ vốn từ. Viết **đầy đủ chủ đề mẫu `travel`** (52 từ): `content/level-05/travel.json`, `content-extra/level-05/travel.json` (+ nới `EXPECTED[5]`, `EXTRA_LEVELS` để checker chạy), hình `scripts/pictures/level-05.mjs` cho các từ cụ thể của travel, rồi seed trên DB verify để xem 1 bài trong Edge. Kiểm: `check-content 5`, `content:check-extra -- 5`, `check-pictures 5`, `npm test`, tsc, lint. progress → dashboard → commit → **DỪNG**.
**Bước 1 — Từ vựng, hình, mp3.** 7 chủ đề còn lại (`content/level-05/*.json`, 400 từ khớp khung), hình (các tệp `level-05-*.mjs`), `npm run audio:generate -- --level 5` trên DB verify (≈ 400 từ + câu ví dụ, ~35 phút). Kiểm: `check-content 5` đạt, `check-pictures 5` đạt, Adult08 (script đọc DB như task 27) không còn cảnh báo thiếu hình/âm thanh cho cấp 5 (từ trừu tượng không hình ghi rõ).
**Bước 2 — Bài học, truyện, bài đọc, trò chơi.** `content-extra/level-05/*.json` cho 8 chủ đề, 2 truyện + tranh, đổi `EXTRA_LEVELS`/test, `npm run content:check-extra -- --strict` 0 lỗi, seed (DB verify), `audio:generate -- --content --level 5`. Kiểm: mỗi bài ≥ 3 bước và ≥ 1 câu hỏi (script báo cáo), không từ ngoài cấp, mở thử bài ở Edge (sắp xếp, điền từ, nghe-gõ, đọc hiểu, truyện, trò chơi).
**Bước 3 — Trùm, bài thi lên cấp, Khám phá từ, Họ vần.** `bosses.ts` (8 trùm), thưởng/huy hiệu cấp 5, `EXAM_LAST_LEVEL = 5`, `exams.ts` seed đề cấp 5; `explorer-level-05*.ts` (30 từ) + hình `wordlab-05.mjs` + `families-more.ts` (≈ 8 họ, từ thêm vào `family-words.json`), `wordlab:check`, `audio:generate -- --wordlab --level 5`. Kiểm: thi thử lên cấp 6 bằng hồ sơ thử (Edge, DB verify, bé ở cấp 5, đã xong mọi bài): đạt → màn chúc mừng, `/map/6` ghi "Sắp có"; trận trùm mở được; Khám phá + Họ vần của 1 từ cấp 5 mở trong Sổ từ; Adult22/23 không cảnh báo.
**Đóng task.** `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`; `content:check`, `content:check-extra -- --strict`, `wordlab:check`, `check-pictures`; seed trên DB trống 2 lần không nhân đôi; học thử 2 bài cấp 5 bằng Edge; spec Playwright: không thêm màn mới (chỉ cập nhật spec task 20 nếu có chỗ giả định cấp 5 không có đề thi). progress, decisions, dashboard (Cảnh báo 0), README ✅, commit từng bước + push, cập nhật memory.

## Kiểm thử
- Unit: test builder cấp 5, bosses (40 trùm), level-gate (cấp 5 có cổng), reward-catalog, wordlab-data.
- Script: `check-curriculum`, `check-content 5`, `content:check-extra`, `check-pictures`, `wordlab:check`, `scripts/report-content.mjs --strict` (đổi `LEVELS` thêm 5).
- Edge không đầu (`.tmp-verify/cdp.mjs`, DB `hoc_tieng_anh_verify`, `AUTH_SECRET=verify-secret-26`): bài cấp 5, trùm, thi lên cấp 6, `/map/6`.

## Việc thủ công cuối task (ghi vào progress)
`npx prisma db seed` trên DB thật → `npm run audio:generate -- --level 5`, `-- --content --level 5`, `-- --wordlab --level 5` → vào Quản trị xuất bản Khám phá/Họ vần → học thử vài bài cấp 5; xem lướt hình và phiên âm/câu tiếng Việt (tôi soạn, chưa có người rà); Playwright chạy một lần sau khi xong mọi task (cần `prisma migrate reset` DB thử, hỏi riêng).
