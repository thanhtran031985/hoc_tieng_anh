# Tiến độ — 16-story-reading — Truyện tranh đọc to và đọc hiểu ngắn

Trạng thái chung: 🔄 · Cập nhật lần cuối: 09/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Bảng truyện và seed 1 truyện mẫu | ✅ | `stories`, `story_pages` (migration `stories`), seed “Tom’s Red Kite” + 6 tranh SVG |
| 1 | Truyện tranh (Screen24) | ✅ | `StoryStep`, `useStoryReader`, `lesson-story.ts`, bước `story` trong bài; câu hỏi giữa truyện chấm như dạng thường |
| 2 |Đọc hiểu ngắn (Screen29)| ✅ | `ReadingStep`, `grading/reading.ts`, schema `short_reading` (8.11); chấm theo từng câu hỏi con |
| 3 |Soạn truyện (Adult19)| ✅ | Adult19: `/admin/stories` + `/admin/stories/[storyId]`, upload âm thanh/tranh, tạo giọng đọc, chặn xuất bản, tab Truyện ở Soạn bài học |
| 4 | Soạn đọc hiểu ngắn (Adult18) | ⬜ | |

## Nhật ký

**10/10/2026 — Bước 0.** Migration `20261009222653_stories` (bảng `stories`, `story_pages`, enum `StoryPageKind`); schema Zod `src/lib/schemas/story.ts` (câu 1–2, ≤16 từ, câu hỏi giữa truyện đúng 3 lựa chọn); seed `prisma/seed/stories.ts` từ `src/lib/rules/story-data.ts` (truyện Nháp, 6 trang + 1 trang câu hỏi `story_question`, tranh `public/media/stories/toms-red-kite-N.svg` vẽ lại từ hàm vẽ của thiết kế). Kiểm: migrate dev + deploy trên DB verify (MariaDB), seed chạy 3 lần vẫn 1 truyện / 7 trang / 1 câu hỏi; `npm test` 301/301, tsc, lint sạch.
**10/10/2026 — Bước 1.** `PlayStep` `story` (`StoryPlay`: trang truyện/câu hỏi, từ mới, nghĩa ngắn tra bảng `words`), `src/server/story-play.ts` nạp truyện đã xuất bản theo `config.storyId`; `lesson-complete` nhận mục của câu hỏi xen giữa truyện (tra qua `story_pages.question_id`). `StoryStep`: Đọc cho tớ nghe / Tự đọc, chữ sáng (mp3: theo `currentTime/duration` chia theo độ dài chữ; không có tệp: 420 ms/chữ), bấm từ nghe + nghĩa, ← → trang, Space đọc lại, H hiện từ khó, trang câu hỏi (1–3, bậc thang không phạt; sai lần 3 xem đáp án rồi đi tiếp, **không** làm lại cả truyện), trang Hết truyện kèm từ mới. Kiểm (Edge 1366×768 trên DB verify): đủ luồng 6 trang + câu hỏi + Hết truyện, không cuộn ở 1440×900/1366×768/1920×1080, chữ sáng, `answer_logs` ghi câu hỏi giữa truyện, không lỗi console; tranh SVG phải là XML hợp lệ (thẻ <img> không chấp nhận thuộc tính trùng) nên đã dọn `stroke-width` trùng. Rules thuần + test (`lesson-story.test.ts`, 309/309 test đạt).
**10/10/2026 — Bước 2.** Schema `short_reading` trong `question-extra.ts` (đoạn 3–6 câu, 2–3 câu hỏi × 3 đáp án, câu chứa đáp án); `PlayStep` `short_reading` (nghĩa ngắn tra từ `words`); `ReadingStep`: Nghe cả đoạn (chữ sáng), bấm từ nghe + nghĩa, phím 1–3, ↑ ↓, Enter, nhãn “Đã trả lời”, sai 2 lần tự sáng câu chứa đáp án + làm mờ một đáp án, sai 3 lần xem đáp án (làm lại cuối bài); mỗi câu hỏi con là một mục `answer_logs`. Luật soạn đọc hiểu (`admin-question-types.ts`) làm sẵn cho bước 4. Kiểm (Edge, DB verify): đủ luồng, không cuộn ở 3 cỡ màn, không lỗi console; 319/319 test.
**10/10/2026 — Bước 3.** Màn `/admin/stories` (bảng + Thêm truyện) và `/admin/stories/[storyId]` 3 cột: danh sách trang (kéo thả, Alt+↑/↓, xóa qua hộp thoại, chèn trang câu hỏi), sửa trang (tranh từ thư viện hoặc tải lên, 1–2 câu ≤ 16 từ, âm thanh tải lên hoặc “Tạo giọng đọc tự động” bằng Kokoro có thanh tiến trình), thông tin truyện (cấp, chủ đề, từ mới Enter/×, Nháp/Xuất bản chặn kèm lý do), xem trước bằng `StepView`. Server `src/server/admin/stories.ts` (lưu cả truyện trong một giao dịch, trang đổi chữ thì mất tệp âm thanh cũ), route `/admin/stories/upload`, `AUDIO_KINDS` thêm `story`, `storeImageUpload` tách từ `saveUpload`. Soạn bài học: tab Truyện (chỉ truyện đã xuất bản của cấp) → bước `story` `{storyId}`; Xem như học sinh của Soạn bài học nay dựng cả truyện và 4 dạng bài mới/đọc hiểu. Kiểm (Edge, DB verify): tạo truyện, lỗi dưới ô, tải .txt bị từ chối, tải .wav, tạo mp3 thật bằng Kokoro, chặn xuất bản thiếu âm thanh rồi xuất bản, xem trước, xóa trang, thêm vào bài và lưu; không lỗi console; 329/329 test.
(Claude ghi sau mỗi bước: đã làm gì, kết quả kiểm tra, việc cần làm thủ công.)

## Bước tiếp theo

Bước 4 — Soạn đọc hiểu ngắn (Adult18)
