# Tiến độ — 15-lesson-types-a — Dạng bài mới: ghép âm, sắp xếp câu, nghe gõ, điền từ

Trạng thái chung: ✅ · Cập nhật lần cuối: 09/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Ghép âm phonics (Screen23) | ✅ | `PhonicsStep` + `grading/phonics.ts`; phím chữ, Backspace, H, Space; âm từ task 14 |
| 1 | Sắp xếp từ thành câu (Screen26) | ✅ | `SentenceOrderStep` + `grading/sentence-order.ts`; phím 1–9, từ nhiễu, cách sắp xếp khác |
| 2 | Nghe và gõ (Screen27) | ✅ | `DictationStep` + `grading/dictation.ts`; ? gợi ý, Ctrl+Space nghe lại, nhiều đáp án |
| 3 | Điền từ vào câu (Screen28) | ✅ | `FillBlankStep` + `grading/fill-blank.ts`; phím 1–4, kéo thẻ, gõ thẳng |
| 4 | Soạn 4 dạng ở Adult18 | ✅ | `/admin/question-types`, thêm nhanh, ngăn kéo 4 dạng, Xem như học sinh, gắn vào bài ở Soạn bài học |

## Nhật ký

**09/10/2026 — Bước 0–4 (làm liền một mạch vì chung phần phát bài và hợp đồng kết quả).**
- Nền chung: 4 `type` mới (`phonics`, `sentence_order`, `dictation`, `fill_blank`) lưu trong bảng `questions` (không migration — `type` là chuỗi); schema Zod ở `src/lib/schemas/question-extra.ts`; `PlayStep` thêm 4 kiểu, `buildPlaySteps` dựng từ câu hỏi gắn vào bước; `getLessonPlay` đọc `questionId` + câu hỏi + từ hình + nghĩa thẻ + âm phonics.
- Kết quả bài: `ItemResult.wordId` có thể null, thêm `questionId`; `lessonItemSchema` nhận mục theo câu hỏi, chữ bé gõ/xếp tới 200 ký tự; `completeLesson` lọc theo từ **hoặc** câu hỏi thuộc bài và ghi `answer_logs.question_id` + `{text}`. Bài ôn tập vẫn chỉ theo từ (`reviewItemSchema`).
- Phím tắt: `useHotkeys` thêm `inInputs` (phím vẫn chạy khi đang gõ) và nhận `Ctrl+Space`; Esc vẫn mở “Dừng bài học?” khi đang gõ; hành vi cũ không đổi.
- Bậc thang không phạt (`ladder.ts`): sai 1 thử lại, sai 2 tự gợi ý, sai 3 hiện đáp án và làm lại cuối bài.
- Soạn bài: `ACTIVITY_TYPES`/`ACTIVITY_INFO` thêm 4 dạng; Soạn bài học liệt kê và gắn được câu hỏi dạng mới, kiểm đúng dạng khi lưu; Excel chỉ còn 3 dạng cũ; cảnh báo “thiếu giải thích” ở Bảng điều khiển bỏ qua 4 dạng mới.
- Kiểm tra: `npx tsc --noEmit`, `npm run lint`, `npm test` (296/296, thêm hàm chấm + schema + dựng bước + luật soạn), Edge không đầu ở 1366×768 trên DB verify: soạn 4 dạng ở Adult18 (lỗi dưới ô, tách ô âm, Xem như học sinh), gắn vào bài ở Soạn bài học, chơi cả 4 dạng bằng bàn phím (sai → thử lại → gợi ý → đúng), không cuộn, `answer_logs` ghi 4 mục theo câu hỏi, không lỗi console.
- Playwright: spec `tests/e2e/15-dang-bai-moi.spec.ts` đã viết, cập nhật `chung`, `thiet-ke` (Adult18), `12a`, `helpers/lesson.ts`; **chưa chạy** (theo thỏa thuận: chạy sau khi xong hết task, cần đồng ý `prisma migrate reset`).

## Việc cần làm thủ công
- [ ] Chạy `npx prisma db seed` (hoặc nút “Nhập bộ âm mẫu” ở `/admin/phonics`) để có bộ 36 âm khi soạn Ghép âm.
- [ ] Vào `/admin/question-types`, soạn thử mỗi dạng vài câu, “Xem như học sinh”, rồi gắn vào một bài Nháp ở `/admin/builder`.
- [ ] Nghe thử âm Ghép âm bằng tai (giọng trình duyệt cho âm chưa có tệp đọc kiểu “kuh”, “buh”; có tệp từ `npm run audio:generate` thì dùng tệp).
- [ ] Chạy Playwright sau khi xong hết task: `npm run test:e2e:db` rồi `npx playwright test 15- chung thiet-ke`.

## Bước tiếp theo

Hoàn thành
