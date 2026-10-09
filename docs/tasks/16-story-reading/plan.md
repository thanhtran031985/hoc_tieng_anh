# Kế hoạch — Task 16 `16-story-reading` (nhánh `feat/16-story-reading`)

## Context
Bé cần đọc truyện tranh có giọng đọc (chữ sáng theo giọng, bấm từ nghe + nghĩa) và làm bài đọc hiểu ngắn; quản trị soạn được truyện (Adult19) và bài đọc hiểu (tab Adult18). Nền đã có từ task 13–15: `ClickableWords` (`litIndex`), khung `LessonFrame/LessonFoot/FeedbackBar`, `useLadder` + `TypedFeedback` (bậc thang không phạt), `useHotkeys` (`inInputs`), TTS Kokoro + route `/audio/[name]`, `PlayStep` mở rộng từ câu hỏi (`question-extra.ts`), màn `/admin/question-types`.

Quyết định mặc định (ghi `decisions.md`):
- **Mã dạng**: truyện = `activity_type: story` (8.6, cấu hình `{storyId}`); đọc hiểu = `short_reading` (8.11) trong `questions` + `activity_type: short_reading` (gắn `questionId`), thêm vào `EXTRA_QUESTION_TYPES` nên hiện ở Adult18 như tab thứ 5.
- **Trang câu hỏi giữa truyện** lưu thành một dòng `questions` kiểu `story_question` (3 lựa chọn chữ + đáp án, dùng lại `choiceQuestionSchema`), `story_pages.question_id` trỏ tới nó. Khác thiết kế: lựa chọn là thẻ chữ (không vẽ diều màu) vì mọi dữ liệu nằm trong DB.
- **Chữ sáng theo giọng**: kokoro-js không trả mốc từng từ. Có mp3 → chia theo độ dài thật của tệp (`audio.currentTime / duration`) theo tỉ lệ số ký tự từng từ; giọng trình duyệt hoặc chưa có tệp → 420 ms/từ (`--duration-read-word`) như thiết kế.
- **Âm thanh trang truyện** luôn dùng mp3 nếu có (không phụ thuộc công tắc “Giọng mp3”), vì xuất bản bắt buộc có âm thanh.
- **Chặn xuất bản** (hàm thuần): thiếu trang, trang thiếu âm thanh, trang quá 16 từ, trang câu hỏi chưa hợp lệ → lý do tiếng Việt.
- Đọc hiểu: đoạn 3–6 câu, 2–3 câu hỏi, mỗi câu 3 lựa chọn + đáp án + “câu chứa đáp án” (cho gợi ý sáng câu); mỗi câu hỏi con là một mục chấm (`questionId` chung).

## Dữ liệu
- Migration mới: bảng `stories` (level_id, unit_id?, title, title_vi, cover, new_words JSON, status, sort_order, timestamps) và `story_pages` (story_id, sort_order, kind enum `page|question`, image, sentences JSON `[{en, vi?}]`, audio, question_id?). MariaDB/MySQL 8 an toàn (enum thường, JSON longtext như bảng khác).
- `AUDIO_KINDS` thêm `story` (tên tệp `story-<pageId>-<hash>.mp3`; regex route `/audio` tự nhận).
- `lesson-step-config`: `story: { storyId }`, `short_reading: {}`; `ACTIVITY_INFO` thêm 2 dạng (icon `book`, `notebook`), `QUESTION_ACTIVITIES` thêm `short_reading`.
- `short_reading` (Zod trong `question-extra.ts`): prompt `{title, text(3–6 câu), wordId?}`; options `{questions:[{text, choices[3], evidence}]}`; answer `{correct:number[]}`.
- Seed: truyện “Tom’s Red Kite” 6 trang + 1 trang câu hỏi, Nháp, cấp 3; 6 tệp SVG tranh vẽ lại từ hàm vẽ của thiết kế vào `public/media/stories/`; seed idempotent (upsert theo tiêu đề + cấp).

## Các bước
**Bước 0 — Bảng truyện và seed.** Prisma model + migration; `prisma/seed/stories.ts` (gọi từ seed chính); SVG tranh; test hàm thuần seed (`story-data.ts`). Kiểm: migrate trên MariaDB, seed chạy hai lần không nhân đôi.
**Bước 1 — Truyện tranh (Screen24).** Rules thuần `lesson-story.ts`: mốc từng từ, chặn xuất bản, đếm từ. `PlayStep` `story` (trang, từ điển nghĩa tra từ bảng `words`, từ mới) + `getLessonPlay` nạp truyện theo `config.storyId` + mp3 + câu hỏi giữa truyện; `StoryStep.tsx` + css: chế độ Đọc cho tớ nghe / Tự đọc, ← → trang, Space đọc lại trang, H hiện nghĩa từ khó, trang câu hỏi (phím 1–3, bậc thang `useLadder`), trang Hết truyện (từ mới + loa); `lesson-complete` nhận `questionId` của câu hỏi trong truyện (tra qua `story_pages`). Kiểm: Edge 1366×768 không cuộn, chữ sáng, câu hỏi chấm như dạng thường.
**Bước 2 — Đọc hiểu ngắn (Screen29).** `grading/reading.ts` (chấm, câu chứa đáp án, làm mờ một đáp án); `ReadingStep.tsx` (đoạn + Nghe cả đoạn chữ sáng, 3 câu hỏi, 1–3, ↑↓, Enter, nhãn “Đã trả lời”, gợi ý sáng câu đáp án); mục chấm theo câu hỏi con. Kiểm: Edge + unit.
**Bước 3 — Soạn truyện (Adult19).** `/admin/stories` (danh sách + thêm truyện) và `/admin/stories/[storyId]` 3 cột: danh sách trang (kéo thả + Alt+↑/↓), sửa trang (tranh từ thư viện/tải lên, 1–2 câu ≤16 từ, âm thanh: tải lên hoặc “Tạo giọng đọc tự động” có thanh tiến trình, theo mẫu `useAudioBatch`), thông tin truyện (cấp, chủ đề, từ mới Enter/×, Nháp/Xuất bản chặn kèm lý do), xóa trang qua hộp thoại, xem trước bằng `StepView` (`StepsPreview`); nav “Truyện tranh” + Mới; Soạn bài học thêm nút “Thêm truyện” (chọn truyện đã xuất bản của cấp) và hiện nhãn; route upload âm thanh/tranh kiểm quyền admin. Kiểm: Edge soạn truyện 4 trang, chặn xuất bản, xuất bản, gắn bài, chơi bằng hồ sơ bé.
**Bước 4 — Soạn đọc hiểu ngắn (Adult18).** Mở rộng `ExtraForm`/`buildExtraData`/`readExtraForm`/`buildExtraPreviewStep` và form tab thứ 5 (đoạn, hình, 2–3 câu hỏi, đáp án đúng, câu chứa đáp án); lỗi tiếng Việt. Kiểm: unit + Edge (đoạn ngoài 3–6 câu, thiếu đáp án đúng, xem như học sinh).

## Kiểm thử và tài liệu
- Unit (`npm test`): rules truyện (mốc từ, chặn xuất bản, đếm từ), `grading/reading`, schema `short_reading`, `buildPlaySteps` cho `story`/`short_reading`, luật soạn đọc hiểu.
- e2e viết (không chạy): `tests/e2e/16-truyen-doc-hieu.spec.ts`; cập nhật `chung`, `thiet-ke` (Adult19, Screen24/29 nếu có thể), `12a` (`ADMIN_PAGES`), `helpers/lesson.ts`.
- Cuối: `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`; `progress.md`/`decisions.md`/README, `npm run tasks:dashboard` (Cảnh báo: 0); commit từng bước `16-story-reading: step N — …`, push nhánh.
- Việc thủ công để báo: chạy `npx prisma migrate deploy` + `npx prisma db seed`; tạo mp3 cho truyện mẫu bằng nút “Tạo giọng đọc tự động” ở Adult19; nghe thử; Playwright sau khi xong hết task.
