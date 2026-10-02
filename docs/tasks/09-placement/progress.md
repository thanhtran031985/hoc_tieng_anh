# Tiến độ — 09-placement — Bài xếp lớp

Trạng thái chung: 🔄 · Cập nhật lần cuối: 03/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Hàm xếp lớp | ✅ | `src/lib/rules/placement.ts` + test (95/95) |
| 1 | Màn giới thiệu, làm bài và kết quả (Screen15–17) | ✅ | `server/placement.ts`, `src/features/placement/`, `/placement`; test 97/97 |

## Nhật ký

### Bước 0 — Hàm xếp lớp (03/10/2026)
- Đã làm: `startLevel`, `createPlacement`, `answerPlacement` (đúng 3 liên tiếp lên, sai 2 liên tiếp xuống, kẹp biên, đếm lại khi đổi cấp), `isPlacementDone` (12 câu), `suggestLevel` (cấp cao nhất đúng ≥ 70% với ≥ 2 câu), `placementComment`.
- File tạo: `src/lib/rules/placement.ts`, `src/lib/rules/placement.test.ts`.
- Kết quả kiểm tra: `npm test` 95/95; các chuỗi mẫu (đúng hết → cấp cao nhất; sai hết → cấp 1; cấp 1 câu không được xét) ra đúng.
- Việc tôi cần làm thủ công: không.

### Bước 1 — Màn giới thiệu, làm bài và kết quả (03/10/2026)
- Đã làm: schema Zod `placement.ts`; `src/server/placement.ts` (`getPlacementSetup` dựng kho câu hỏi theo cấp và kiểm điều kiện vào bài, `completePlacement` tính lại cấp đề xuất + nhãn chủ đề + ghi `answer_logs` nguồn `exam`, `applyStartLevel`); `pickQuestion` trong luật; UI `PlacementFlow`, `PlacementIntro`, `PlacementQuiz` (12 sao tiến độ, không báo đúng/sai), `PlacementResult` (cấp đề xuất, chip chủ đề, chọn cấp khác), hộp thoại bỏ qua/dừng; route `/placement` có loading/error; tạo hồ sơ xong chuyển `/placement`.
- File tạo/sửa: `src/lib/schemas/placement.ts`, `src/server/placement.ts`, `src/features/placement/*`, `src/app/(kid)/placement/*`, `src/lib/rules/placement.ts(+test)`, `CreateProfileFlow.tsx`, token mới `--size-placement-*`, `--size-lvbox-n*`, `--size-fact-icon*`, `--size-done-dragon`.
- Kết quả kiểm tra (DB tạm, CDP, 1366×768): bé lớp 3 làm đủ 12 câu bằng bàn phím (kể cả "Tớ chưa biết"), 12 `answer_logs` `exam`; kết quả có cấp đề xuất + nhận xét + chip chủ đề, không hiện điểm; "Chọn cấp khác" + ← → + Enter đặt cấp vào hồ sơ; "Bỏ qua" hỏi xác nhận rồi về `/home`; dừng giữa chừng ra màn trống; lớp 7 ra màn trống "Chưa có bài xếp lớp"; bé đã học và bé đã xếp lớp bị chuyển `/home`; không cuộn trang, không lỗi console; `tsc`, `lint`, `npm test` 97/97, `build` sạch.
- Việc tôi cần làm thủ công: không (checklist ở cuối task).

## Bước tiếp theo

Rà soát cuối task (/finish-task).
