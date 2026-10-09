# Tiến độ — 16-story-reading — Truyện tranh đọc to và đọc hiểu ngắn

Trạng thái chung: 🔄 · Cập nhật lần cuối: 09/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Bảng truyện và seed 1 truyện mẫu | ✅ | `stories`, `story_pages` (migration `stories`), seed “Tom’s Red Kite” + 6 tranh SVG |
| 1 | Truyện tranh (Screen24) | ⬜ | |
| 2 | Đọc hiểu ngắn (Screen29) | ⬜ | |
| 3 | Soạn truyện (Adult19) | ⬜ | |
| 4 | Soạn đọc hiểu ngắn (Adult18) | ⬜ | |

## Nhật ký

**10/10/2026 — Bước 0.** Migration `20261009222653_stories` (bảng `stories`, `story_pages`, enum `StoryPageKind`); schema Zod `src/lib/schemas/story.ts` (câu 1–2, ≤16 từ, câu hỏi giữa truyện đúng 3 lựa chọn); seed `prisma/seed/stories.ts` từ `src/lib/rules/story-data.ts` (truyện Nháp, 6 trang + 1 trang câu hỏi `story_question`, tranh `public/media/stories/toms-red-kite-N.svg` vẽ lại từ hàm vẽ của thiết kế). Kiểm: migrate dev + deploy trên DB verify (MariaDB), seed chạy 3 lần vẫn 1 truyện / 7 trang / 1 câu hỏi; `npm test` 301/301, tsc, lint sạch.
(Claude ghi sau mỗi bước: đã làm gì, kết quả kiểm tra, việc cần làm thủ công.)

## Bước tiếp theo

Bước 1 — Truyện tranh (Screen24)
