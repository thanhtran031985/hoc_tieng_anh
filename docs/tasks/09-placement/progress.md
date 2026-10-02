# Tiến độ — 09-placement — Bài xếp lớp

Trạng thái chung: 🔄 · Cập nhật lần cuối: 03/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Hàm xếp lớp | ✅ | `src/lib/rules/placement.ts` + test (95/95) |
| 1 | Màn giới thiệu, làm bài và kết quả (Screen15–17) | ⬜ | |

## Nhật ký

### Bước 0 — Hàm xếp lớp (03/10/2026)
- Đã làm: `startLevel`, `createPlacement`, `answerPlacement` (đúng 3 liên tiếp lên, sai 2 liên tiếp xuống, kẹp biên, đếm lại khi đổi cấp), `isPlacementDone` (12 câu), `suggestLevel` (cấp cao nhất đúng ≥ 70% với ≥ 2 câu), `placementComment`.
- File tạo: `src/lib/rules/placement.ts`, `src/lib/rules/placement.test.ts`.
- Kết quả kiểm tra: `npm test` 95/95; các chuỗi mẫu (đúng hết → cấp cao nhất; sai hết → cấp 1; cấp 1 câu không được xét) ra đúng.
- Việc tôi cần làm thủ công: không.

## Bước tiếp theo

Bước 1 — Màn giới thiệu, làm bài và kết quả (Screen15–17)
