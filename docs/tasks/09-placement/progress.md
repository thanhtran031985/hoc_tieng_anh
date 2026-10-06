# Tiến độ — 09-placement — Bài xếp lớp

Trạng thái chung: ✅ · Cập nhật lần cuối: 03/10/2026

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

### Rà soát cuối task (03/10/2026)
| Mục | Đánh giá | Bằng chứng |
|---|---|---|
| Hàm xếp lớp: bắt đầu ở cấp = lớp (kẹp cấp có nội dung), đúng 3 liền lên, sai 2 liền xuống, đề xuất ≥ 70% | ✅ | `placement.ts:28-76`; test `placement.test.ts` (97/97). Tên file đúng task.md |
| 10–15 câu nghe chọn hình, không hiện đúng/sai | ✅ | `PlacementQuiz.tsx` (12 câu, 12 sao tiến độ); đã làm 12 câu bằng bàn phím |
| Màn kết quả: cấp đề xuất, nút đổi cấp, không điểm số | ✅ | `PlacementResult.tsx`; chọn cấp khác + ← → + Enter ghi vào hồ sơ |
| Nút "Bỏ qua, bắt đầu theo lớp" hỏi xác nhận cấp theo lớp | ✅ | `PlacementIntro.tsx:108-119` |
| 4 trạng thái mỗi màn (bình thường, tải, trống, lỗi) | ✅ | `placement/loading.tsx`, `error.tsx`, trạng thái trống (lớp ≥ 6, dừng giữa chừng), lỗi lưu có Thử lại |
| Câu hỏi lấy từ từ vựng của từng cấp | ✅ | `server/placement.ts:63-110` (từ có hình của chủ đề đã xuất bản, theo cấp) |
| Zod cho ghi DB; kiểm hồ sơ thuộc tài khoản; không Prisma/secret trong client | ✅ | `schemas/placement.ts`, `actions.ts`, `requireLearner` ở 3 hàm server; client chỉ `import type` |
| Không hex/px cố định | ✅ | đã quét; token mới `--size-placement-*`, `--size-lvbox-n*`, `--size-fact-icon*`, `--size-done-dragon` |
| 1366×768 không cuộn | ✅ | đo giới thiệu, câu hỏi, kết quả |
| Khác thiết kế | ⚠️ | nút quay lại về /profiles, thêm Thử lại ở màn lỗi, bỏ trạng thái lỗi loa; đã ghi decisions.md và so-sanh.md (25–26) |
- `npx tsc --noEmit`, `npm run lint`, `npm test` (97/97), `npm run build` đều sạch (03/10/2026).

## Bước tiếp theo

Hoàn thành. Checklist test thủ công bên dưới do bạn tự test sau khi đóng task (chưa tích).

### Checklist test thủ công (bạn test sau khi đóng task, chưa tích)
Chuẩn bị: `npm run dev`, đăng nhập. Tạo hồ sơ mới (lớp 3) để vào `/placement`; hoặc vào thẳng `/placement` với bé chưa học bài nào. Làm lại: `DELETE FROM answer_logs WHERE learner_id = <id> AND source = exam;` và `DELETE FROM lesson_progress WHERE learner_id = <id>;`.
- [ ] Tạo hồ sơ xong tự chuyển tới màn giới thiệu; Enter = Bắt đầu; không có chữ "kiểm tra", "điểm".
- [ ] 12 câu: 1–4 chọn, Space nghe lại, "Tớ chưa biết", Enter tiếp; 12 ngôi sao sáng dần; không có dải đúng/sai.
- [ ] × hoặc Esc hỏi "Dừng bài xếp lớp?"; "Dừng lại" ra màn "Mới được N câu thôi" với "Làm tiếp" và "Bắt đầu theo lớp".
- [ ] Kết quả: cấp đề xuất (màu cấp), nhận xét ngắn, chip chủ đề vững/sẽ học, không có điểm số; "Chọn cấp khác" chọn bằng ← → hoặc chuột, nhãn "Bông đề xuất"; Enter bắt đầu học và trang chủ ở đúng cấp.
- [ ] "Bỏ qua, bắt đầu theo lớp": hộp thoại ghi đúng "Cấp N · Tên" theo lớp (Enter = Bắt đầu học, Esc = Làm bài xếp lớp).
- [ ] Bé lớp 6–9: thấy "Chưa có bài xếp lớp" và nút "Bắt đầu ở Cấp 4".
- [ ] Bé đã học bài hoặc đã làm xếp lớp: gõ `/placement` thì về trang chủ.
- [ ] Tắt mạng khi vừa làm xong 12 câu: báo "Chưa lưu được kết quả"; bật mạng bấm Thử lại.
- [ ] Kiểm DB: `SELECT word_id, is_correct FROM answer_logs WHERE learner_id = <id> AND source = exam;` có 12 dòng.
