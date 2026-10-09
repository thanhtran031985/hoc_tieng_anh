# Tiến độ — 16-story-reading — Truyện tranh đọc to và đọc hiểu ngắn

Trạng thái chung: 🔄 · Cập nhật lần cuối: 09/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Bảng truyện và seed 1 truyện mẫu | ✅ | `stories`, `story_pages` (migration `stories`), seed “Tom’s Red Kite” + 6 tranh SVG |
| 1 | Truyện tranh (Screen24) | ✅ | `StoryStep`, `useStoryReader`, `lesson-story.ts`, bước `story` trong bài; câu hỏi giữa truyện chấm như dạng thường |
| 2 | Đọc hiểu ngắn (Screen29) | ⬜ | |
| 3 | Soạn truyện (Adult19) | ⬜ | |
| 4 | Soạn đọc hiểu ngắn (Adult18) | ⬜ | |

## Nhật ký

**10/10/2026 — Bước 0.** Migration `20261009222653_stories` (bảng `stories`, `story_pages`, enum `StoryPageKind`); schema Zod `src/lib/schemas/story.ts` (câu 1–2, ≤16 từ, câu hỏi giữa truyện đúng 3 lựa chọn); seed `prisma/seed/stories.ts` từ `src/lib/rules/story-data.ts` (truyện Nháp, 6 trang + 1 trang câu hỏi `story_question`, tranh `public/media/stories/toms-red-kite-N.svg` vẽ lại từ hàm vẽ của thiết kế). Kiểm: migrate dev + deploy trên DB verify (MariaDB), seed chạy 3 lần vẫn 1 truyện / 7 trang / 1 câu hỏi; `npm test` 301/301, tsc, lint sạch.
**10/10/2026 — Bước 1.** `PlayStep` `story` (`StoryPlay`: trang truyện/câu hỏi, từ mới, nghĩa ngắn tra bảng `words`), `src/server/story-play.ts` nạp truyện đã xuất bản theo `config.storyId`; `lesson-complete` nhận mục của câu hỏi xen giữa truyện (tra qua `story_pages.question_id`). `StoryStep`: Đọc cho tớ nghe / Tự đọc, chữ sáng (mp3: theo `currentTime/duration` chia theo độ dài chữ; không có tệp: 420 ms/chữ), bấm từ nghe + nghĩa, ← → trang, Space đọc lại, H hiện từ khó, trang câu hỏi (1–3, bậc thang không phạt; sai lần 3 xem đáp án rồi đi tiếp, **không** làm lại cả truyện), trang Hết truyện kèm từ mới. Kiểm (Edge 1366×768 trên DB verify): đủ luồng 6 trang + câu hỏi + Hết truyện, không cuộn ở 1440×900/1366×768/1920×1080, chữ sáng, `answer_logs` ghi câu hỏi giữa truyện, không lỗi console; tranh SVG phải là XML hợp lệ (thẻ <img> không chấp nhận thuộc tính trùng) nên đã dọn `stroke-width` trùng. Rules thuần + test (`lesson-story.test.ts`, 309/309 test đạt).
(Claude ghi sau mỗi bước: đã làm gì, kết quả kiểm tra, việc cần làm thủ công.)

## Bước tiếp theo

Bước 2 — Đọc hiểu ngắn (Screen29)
