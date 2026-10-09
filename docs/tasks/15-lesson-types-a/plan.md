# Kế hoạch — Task 15 `15-lesson-types-a` (nhánh `feat/15-lesson-types-a`)

## Context
Bài học hiện có 5 dạng (thẻ từ, nghe chọn hình, chọn từ cho hình, nối cặp, lật thẻ), đều dựng từ **từ vựng**. Task 15 thêm 4 dạng mới dựa trên **nội dung riêng của câu hỏi** (bảng `questions`): ghép âm (`phonics`, Screen23), sắp xếp câu (`sentence_order`, Screen26), nghe và gõ (`dictation`, Screen27), điền từ (`fill_blank`, Screen28), kèm màn soạn Adult18 (Bước 4).

Khảo sát cho thấy phần phát bài **chưa đọc bảng `questions`** nên phải làm cả hai đầu: soạn → lưu → gắn vào bài → phát → chấm → ghi kết quả. `Question.type` và `LessonStep.activityType` là chuỗi (không enum DB) → **không cần migration**.

Quyết định mặc định (không hỏi lại, ghi `decisions.md`):
- Code component bài học ở `src/features/lesson/` (đúng cấu trúc thật, task.md ghi `components/lesson/types/`); hàm chấm thuần ở `src/lib/rules/grading/`.
- Adult18 là **màn riêng** `/admin/question-types` (mục menu “Câu hỏi dạng mới”, nhãn “Mới”), đúng thiết kế; Adult11 `/admin/questions` giữ nguyên 3 dạng cũ (tránh vỡ spec 12c). Excel chỉ hỗ trợ 3 dạng cũ (hằng `EXCEL_QUESTION_TYPES`; export lọc theo đó). Ba dạng còn lại của Adult18 (Luyện nói, Đọc hiểu, Truyện) thuộc task 16/17 → chỉ làm 4 ô “Thêm nhanh”.
- Mã dạng trong `QUESTION_TYPE_INFO`: phonics 8.5, sentence_order 8.8, dictation 8.9, fill_blank 8.10.
- Form Adult18 chỉ có Cấp + Trạng thái (kỹ năng/độ khó mặc định theo dạng: pronunciation/writing/listening/grammar-vocabulary, độ khó 1; không bắt giải thích).
- Không phạt khi sai, không đồng hồ; sai 1 → thử lại, sai 2 → tự gợi ý, sai 3 → hiện đáp án rồi làm lại cuối bài (`~r`).

## Hình dạng JSON (Zod trong `src/lib/schemas/question.ts`)
| Dạng | prompt | options | answer |
|---|---|---|---|
| phonics | `{text: word, wordId?}` (hình = hình của từ ngân hàng) | `{tiles:[{t, sound}]}` (sound = grapheme trong `phonics_sounds`) | `{order: string[]}` (= tiles theo thứ tự đúng, ghép lại = word) |
| sentence_order | `{text: câu gốc, wordId?}` | `{distractors: string[≤3]}` | `{words: string[≥3]}` (tự tách từ câu gốc, dấu câu dính từ cuối) |
| dictation | `{text: nội dung đọc, wordId?}` | `{ignoreCase, ignoreEndPunct}` | `{accepted: string[≥1]}` (phải có đáp án trùng nội dung đọc) |
| fill_blank | `{text: câu có đúng một ___, wordId?}` | `{cards: string[3–4]}` | `{correct: number}` |

`wordId` tùy chọn: nếu có thì `LessonStep.wordId` cũng là từ đó để có hình/nghĩa/âm.

## Phần phát bài (dùng chung cho 4 dạng)
1. `src/lib/rules/lesson-play.ts`: `StoredStep` thêm `question`; `PlayStep` thêm 4 `kind` (kèm dữ liệu đã xáo bằng `seededRandom/shuffled` ở `@/lib/rules/random`); `buildPlaySteps` thêm 4 case (bỏ qua bước nếu dữ liệu câu hỏi hỏng, bằng `parseQuestionData`).
2. `src/server/lesson-play.ts`: select thêm `questionId` + `question{type,prompt,options,answer}`; tải từ tham chiếu (hình, nghĩa) và, cho phonics, các `phonics_sounds` theo grapheme → bản đồ âm thanh; thêm mp3 (`audio` map đã có từ task 14) cho `prompt.text` (câu đọc) khi công tắc Giọng mp3 bật.
3. `src/lib/schemas/lesson-step-config.ts` (`ACTIVITY_TYPES` + `lessonStepConfigSchemas`), `src/lib/rules/admin-builder.ts` (`ACTIVITY_INFO` mới, `needsWord:false`), `src/server/admin/builder.ts` (bỏ lọc cứng 3 dạng L70; không loại bước mới ở L94), `BuilderView.tsx` (icon cho dạng mới).
4. **Hợp đồng kết quả**: `ItemResult.wordId: number | null` + `questionId?`; `lessonItemSchema` cho phép `wordId` null, `questionId`, `picks` ngắn (≤6×40 ký tự; dictation chỉ ghi `text` cắt 200) ; `src/server/lesson-complete.ts` (lọc `lessonWordIds` L58–60 → thêm `lessonQuestionIds`; ghi answerLog có `questionId`/`{text}`). Kiểm tra cột `answer_logs.word_id` có nullable không; nếu bắt buộc thì bỏ ghi log cho mục chỉ-có-câu-hỏi (vẫn tính sao/tiến độ) và ghi `decisions.md` — không migration nếu tránh được. Thẻ ôn tập (`ReviewCard`) cho dạng mới: bỏ qua (task sau).
5. `StepView.tsx` thêm 4 nhánh; rà `LessonPlayer`, `ReviewPlayer`, `review.ts`, `placement.ts`, `notebook.ts` theo lỗi tsc.
6. Phím tắt: `useHotkeys` bỏ qua khi đang gõ vào input và khi có Ctrl/Alt/Meta → thêm tùy chọn `allowInInputs`/`allowCtrl` cho từng phím (không đổi hành vi cũ), dùng cho Ctrl+Space (nghe lại câu khi đang gõ) và `?` (gợi ý khi gõ); Esc luôn hoạt động.
7. Luồng bậc thang sai (`choice-flow.ts` gắn với PlayWord): tách một bậc thang tổng quát nhỏ `ladder.ts` (đếm sai, `needsHint` ≥2, `reveal` ở lần 3, redo cuối bài) dùng cho 4 dạng; không đụng 3 dạng cũ.

## Các bước
**Bước 0 — Ghép âm (Screen23).** Rules `grading/phonics.ts` (so thứ tự ô, tiền tố đúng, gợi ý ô kế); `PhonicsStep.tsx` + css module (ô trống, ô chữ xáo, ô ghép rộng ×1.45, trạng thái is-used/is-ok/is-bad/ghost/is-lit); bấm hoặc kéo (HTML5 drag) hoặc gõ chữ; Space nghe cả từ, H gợi ý, Backspace gỡ, Enter kiểm tra; đúng → phát từng âm (`phonics_sounds.audio` hoặc giọng trình duyệt cho chuỗi dự phòng) tô sáng 840 ms/ô rồi cả từ; sai → giữ ô đúng, thông báo “Nghe lại từng âm rồi xếp theo thứ tự nhé.” Dùng token GĐ2 `--size-phon-tile`, `--phon-slot`, `--read-highlight`, `--duration-read-word`; `cqh/cqw` → `vh/vw`.
**Bước 1 — Sắp xếp câu (Screen26).** `grading/sentence-order.ts` (so theo chuỗi từ, không theo chỉ số vì có từ trùng; chuẩn hóa chữ hoa/dấu cuối); `SentenceOrderStep.tsx`: thẻ có số 1–9 cố định theo thứ tự xáo, khu “Câu của cậu” + khu “Thẻ từ”, kéo sắp xếp lại, Backspace, Space đọc câu, H gợi ý (giữ tiền tố đúng, đặt thẻ kế), Enter kiểm tra; sai → từng vị trí is-ok/is-bad, giữ tiền tố đúng; sai 2 → tự đặt thẻ kế.
**Bước 2 — Nghe và gõ (Screen27).** `grading/dictation.ts` (chuẩn hóa chữ thường, bỏ `.,!?`, gộp khoảng trắng, theo `ignoreCase/ignoreEndPunct`; diff từng ký tự cho gợi ý màu cam); `DictationStep.tsx`: từ ngắn → mỗi chữ một ô (tự nhảy, Backspace lùi, mũi tên), câu → một ô + vùng diff `aria-live`; tự đọc sau 200 ms, Space/loa nghe lại, **Ctrl+Space** (câu), gợi ý bằng **`?`**: lần 1 hiện chữ đầu, lần 2 đọc chậm 0,45; sai 2 → tự gợi ý.
**Bước 3 — Điền từ (Screen28).** `grading/fill-blank.ts`; `FillBlankStep.tsx`: câu `a [ô] b`, 3–4 thẻ (phím 1–4, kéo vào ô hoặc gõ thẳng), H làm mờ một thẻ sai + đọc chậm, Enter kiểm tra; sai → “{từ} là “{nghĩa}”. Nhìn lại hình nhé.” (nghĩa lấy từ ngân hàng từ, không viết cứng).
**Bước 4 — Soạn 4 dạng (Adult18).** Route `/admin/question-types` (`page/loading/error`, mã lỗi `QBK-502`), `QuestionTypesView.tsx` (bảng tìm/lọc Dạng–Cấp/phân trang 8, 4 ô “Thêm nhanh”, ngăn kéo theo dạng, lỗi dưới ô khi rời ô và khi lưu, focus ô lỗi đầu, “Xem như học sinh” qua `StepsPreview` + component thật); `src/lib/rules/admin-question-types.ts` (tách ô âm tự động theo `phonics-data`, tách thẻ câu, đếm `___`, thông điệp lỗi đúng theo thiết kế) + test; `saveQuestionTypeSchema` (discriminated union theo `type`); `src/server/admin/question-types.ts` (`getQuestionTypes`, `saveQuestionType` — `requireAdmin`, Zod, kiểm hình/âm tồn tại); `question-type-actions.ts`; nav `ADMIN_NAV` + nhãn “Mới” (`AdultNavItem.badge`); mở danh sách câu hỏi trong Builder (L70) cho 4 dạng; `explanation` không bắt buộc.

## Kiểm thử và tài liệu
- Unit (`npm test`): `grading/*.test.ts` (4 dạng, chuẩn hóa, diff, tiền tố đúng, từ trùng), `admin-question-types.test.ts`, mở rộng `lesson-play.test.ts`, `admin-builder.test.ts`, `question.test` (schema), `use-hotkeys` nếu có test.
- e2e (viết, **không chạy** theo thỏa thuận): `tests/e2e/15-dang-bai-moi.spec.ts` (soạn 2 câu/dạng, gắn bài nháp, chơi bằng phím ở 1366×768, không cuộn); cập nhật `tests/e2e/helpers/lesson.ts` (`StepKind` + `playLesson`), `setup/seed-test.ts`, `chung.spec.ts`, `thiet-ke.spec.ts` (Adult18 + Screen23/26/27/28), `12a` (`ADMIN_PAGES`).
- Kiểm bằng Edge không đầu (server 3100 + DB verify): soạn 2 câu mỗi dạng ở Adult18, gắn vào bài nháp cấp 3, chơi `/lesson/<id>` bằng phím ở 1366×768, kiểm xem-như-học-sinh, kiểm sai 1/2/3 → làm lại cuối bài, ghi kết quả vào answer_logs.
- Cuối task: `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`; cập nhật `progress.md` (từng bước), `decisions.md`, README mục task 15 ✅, `npm run tasks:dashboard` (Cảnh báo: 0); commit từng bước `15-lesson-types-a: step N — …` + push; lưu bản này vào `docs/tasks/15-lesson-types-a/plan.md`.
- Việc thủ công để báo bố/mẹ: nghe thử âm ghép âm; chạy `npm run audio:generate` nếu cần mp3 cho câu mới; chạy Playwright sau khi xong hết task.
