# Kế hoạch — 07-lesson-player — Khung bài học và 4 dạng bài cơ bản

## Context
Task 06 xong: bé thấy bản đồ, bấm chặng ra `/lesson/[id]` nhưng đó mới là màn "Sắp có". Task này dựng trình học thật: bé học trọn một bài (thẻ từ → nghe chọn hình → nối từ → chọn từ → lật thẻ), nhận sao và xu, rồi bản đồ mở chặng kế. Sau task này sao, xu, chuỗi ngày, thẻ ôn tập mới bắt đầu có dữ liệu thật (task 06 chỉ hiển thị).

Thiết kế: `Screen07/08/09/10/12/18/21`, `FeedbackBar`, `Dialog`, `MascotMore` (đã đọc README + preview + bundle).
Theo lệnh của bạn: sau khi duyệt kế hoạch, làm liên tục tới khi đóng task 07 (kèm `/finish-task`), rồi sang các task kế (08, 09…) cùng cách làm; commit + push sau mỗi bước.

## Hiện trạng đã kiểm tra
- Dữ liệu: `lesson_steps(activity_type, word_id, config)`; seed sinh 4 loại `word_card`, `listen_choose_picture`, `match_pairs`, `choose_word_for_picture` (`src/lib/rules/lesson-builder.ts`, schema `src/lib/schemas/lesson-step-config.ts`). Bài thường 6–25 bước; trùm (`unit_test`) chỉ có 2 loại nghe/chọn, tối đa 12 bước. Không có loại lật thẻ trong DB; không lưu đáp án nhiễu (player tự chọn từ từ cùng chủ đề). `Question` chưa dùng.
- Server có sẵn (`src/server/progress.ts`): `startLessonAttempt`, `finishLessonAttempt` (chỉ ghi attempt + `lesson_progress`, nhận sao/xu từ client, KHÔNG cập nhật `learners.stars/coins/xp`, chuỗi ngày, thẻ ôn), `logAnswer`, `upsertReviewCard` (không có luật hộp), `startStudySession/endStudySession`; `curriculum.getLessonWithSteps`; `requireLearner`/`requireActiveLearner`; `recordStudyDay` (task 06) chưa ai gọi.
- UI có sẵn (`src/components/ui`): Button, IconButton, KeyHint, ChoiceCard (state default/selected/correct/retry/dim + badge), ProgressBar, SpeakerButton, WordPicture, Mascot (có `tiec`), FeedbackBar (tự có Enter; phải tắt Enter của màn khi bar mở), Dialog (Enter/Esc đúng chuẩn Screen21), Bubble, Skeleton, DataState, Icon. `useHotkeys` (`src/lib/use-hotkeys.ts`: 1–4, a–d, Enter, Space, ←→, Esc; chưa có ↑↓), `playPronunciation` (`src/lib/speech.ts`).
- Thiếu: khung bài (đầu/giữa/chân), thẻ lật 3D, mũi tên + chấm, khay + ô thả + kéo thả, lưới lật thẻ, burst sao, màn kết thúc (3 sao, ô kết quả, danh sách từ), pill đếm.
- Route: `(kid)/layout.tsx` chỉ `requireUser()`, không có chrome → trang `/lesson/[lessonId]` tự dựng toàn màn, không dùng `KidTopbar`. `proxy.ts` không cần đổi (layout đã chặn).

## Quyết định (ghi vào decisions.md)
1. **Tính sao theo thiết kế** (đã chốt ở task.md): độ chính xác = số mục đúng ngay lần đầu / tổng mục chấm; ≥ 90% → 3 sao, ≥ 70% → 2, còn lại 1 (luôn ≥ 1). Mục chấm: nghe-chọn, chọn từ (mỗi bước 1 mục), nối từ (mỗi cặp 1 mục). Thẻ từ và lật thẻ không chấm. Khác PRD Phần F (đếm lần sai).
2. **Sao/xu do server tính**, không tin số từ client: client chỉ gửi danh sách kết quả từng mục (từ, đúng/sai lần đầu, có xem đáp án không) + thời gian; server tính sao (hàm thuần `lesson-score.ts`), thưởng, cập nhật `learners` (cộng sao mới đạt thêm so với `best_stars` cũ, cộng xu; cấp 1–5 = xu, cấp 6+ = XP), `lesson_progress`, `answer_logs`, thẻ ôn, chuỗi ngày (`recordStudyDay`), `study_sessions`. Thưởng PRD Phần F: 10 xu + 5 xu mỗi sao (3 sao = 25 xu; số "+30" trong bản xem trước chỉ là mẫu). Làm lại bài vẫn nhận xu (không chống cày; ghi lại).
3. **Sai không phạt**: lần 1 chỉ báo "chưa đúng" + thử lại; lần 2 tự bật gợi ý (bỏ 1 đáp án nhiễu); lần 3 hiện đáp án đúng và đẩy câu xuống cuối hàng đợi (làm lại sau, câu đó tính sai). Hàm thuần `lesson-session.ts` (reducer hàng đợi + tally) có test.
4. **Thẻ ôn tập**: tạo hàm thuần `review-box.ts` (hộp 1–5, mốc 1/3/7/14/30 ngày; đúng +1 hộp, sai về hộp 1; từ mới học bắt đầu hộp 1 đến hạn ngày mai) có test; task 08 dùng lại.
5. **Loại bài lật thẻ**: thêm `memory_game` vào `ACTIVITY_TYPES`, builder (bài có ≥ 4 từ có hình, đặt sau nối từ, `pairCount` = 6 nếu chủ đề đủ hình, thiếu thì lấy từ có hình khác của chủ đề, tối thiểu 3) và seed. Bài đã seed trước đó không có bước này cho tới khi bạn chạy lại `npx prisma db seed` (seed bỏ qua chủ đề đã có tiến độ học); player chạy bình thường khi thiếu.
6. **Đáp án nhiễu chọn ở server** (hàm thuần `lesson-play.ts`, xáo có seed theo lượt học): nghe-chọn lấy hình từ từ có hình của chủ đề; chọn-từ lấy chữ từ cả chủ đề; nối từ = các từ có hình của chính bài. Server trả về cho client bộ câu hỏi đã dựng (đáp án nằm ở client để phản hồi tức thì; đây là trò chơi cho bé, chấp nhận).
7. **Giữ tiến độ dở**: lưu vị trí + kết quả vào `localStorage` theo (hồ sơ, bài); vào lại thì hỏi tiếp tục từ chỗ cũ (hộp thoại Screen21 đã hứa "học tiếp từ câu này"). Không thêm cột database. Dọn khi xong bài.
8. **Chỉ vào được bài đã mở**: trang `/lesson/[id]` kiểm bài `published`, cấp của bài không khóa với bé, và chặng đã mở theo `computeLessonStates`; ngược lại về `/map`. Bài lạ → 404.
9. **Hộp thoại thoát**: dùng bản mới "Dừng bài học?" + rồng `tiec`, "Học tiếp" là nút chính (Enter), "Dừng lại" (Esc); sau khi dừng hiện "Hẹn gặp lại nhé!" rồi về bản đồ.
10. Lỗi lưu cuối bài: giữ kết quả trên máy, hiện nút Thử lại (Screen12 trạng thái lỗi). Không cài package mới; không động `designs/`. Token thiếu thêm vào `globals.css` và liệt kê.

## Các bước (khớp task.md; sau mỗi bước: kiểm tra, progress.md, dashboard, commit `07-lesson-player: step N — …`, push)

### Bước 0 — Khung bài học và luồng câu hỏi
- Hàm thuần + test: `src/lib/rules/lesson-session.ts` (hàng đợi, bước tiếp, tally, đưa câu xuống cuối, mục chấm), `lesson-play.ts` (dựng câu hỏi + đáp án nhiễu có seed).
- Server: `src/server/lesson-play.ts` `getLessonPlay(userId, learnerId, lessonId)` (qua `requireLearner`, kiểm quyền mở chặng — dùng `computeLessonStates`/`levelStatus`, thêm từ cùng chủ đề cho đáp án nhiễu).
- Route `src/app/(kid)/lesson/[lessonId]/{page,loading,error}.tsx` (thay màn "Sắp có"; `params` là Promise; bỏ `feature="lesson"` khỏi ComingSoon).
- `src/features/lesson/`: `LessonPlayer` (client, giữ trạng thái), `LessonFrame` (đầu: × + `ProgressBar` + "n/N"; giữa; chân), `ExitDialog` + màn "Hẹn gặp lại nhé!", giao diện chung `StepProps`/`StepResult`, hook `useStepHotkeys`, burst sao, giữ tiến độ `localStorage`, trạng thái trống/lỗi/tải; bước tạm hiển thị tên loại bài (bỏ ở bước 5).
- Thêm ↑↓ vào `useHotkeys` nếu cần cho bước 5.
- Kiểm tra: chạy bài với dữ liệu seed, thanh tiến độ tăng; Enter/Space; × và Esc mở "Dừng bài học?", "Học tiếp" là nút chính; bài khóa/không có → về bản đồ.

### Bước 1 — Thẻ từ (Screen08)
- `WordCardStep`: thẻ lật 3D (Space hoặc bấm), ← → chuyển thẻ, chấm vị trí, loa từ + câu ví dụ; thẻ cuối nút "Làm bài tập". Mỗi thẻ là một bước của bài nên "n/N" tính theo bước.
- Kiểm tra: lật bằng Space/bấm; ← → ; loa đọc từ và câu ví dụ; không cuộn ở 1366×768.

### Bước 2 — Nghe và chọn hình (Screen07)
- `ListenChooseStep` + `ChoiceCard` hình, loa lớn, Nghe lại (Space), Gợi ý (H) bỏ 1 đáp án sai, 1–4 chọn, Enter kiểm tra, dải đúng/chưa đúng (`FeedbackBar`), theo quyết định 3.
- Kiểm tra: 1–4, Enter, dải đúng/chưa đúng, gợi ý bỏ bớt 1 đáp án; lần 2 tự gợi ý; lần 3 hiện đáp án và câu xuống cuối.

### Bước 3 — Nối từ với hình (Screen09)
- `MatchStep`: lưới hình có ô thả, khay chip từ; kéo thả bằng con trỏ (pointer events), bàn phím (1–4 nhấc từ, rồi 1–4 thả vào hình; Tab + Enter/Space; Esc bỏ), "Làm lại", rồng + bóng thoại; đủ cặp thì dải "Nối đúng hết rồi!".
- Kiểm tra: kéo thả bằng chuột và bằng bàn phím đều làm được; thả sai chip về khay, không phạt.

### Bước 4 — Chọn từ đúng cho hình (Screen18)
- `PickWordStep`: hình lớn + 3 thẻ chữ có loa, chọn thì đọc từ; hoạt động như bước 2.
- Kiểm tra: như bước 2 với 3 thẻ chữ.

### Bước 5 — Lật thẻ ghép cặp (Screen10)
- Loại bài `memory_game` (quyết định 5, thêm test builder), `MemoryStep`: 12 thẻ (6 hình + 6 chữ), đếm lượt, không đếm giờ, mũi tên di chuyển focus (±1/±6), Enter/Space lật; thẻ khớp ở lại, không khớp úp lại sau ~1 giây; dải "Ghép xong 6 cặp!". Gỡ bước tạm.
- Kiểm tra: 12 thẻ, đếm lượt, không có đồng hồ; thiếu hình thì ít thẻ hơn nhưng vẫn chạy.

### Bước 6 — Kết thúc bài và lưu kết quả (Screen12)
- Hàm thuần + test: `lesson-score.ts` (sao theo quyết định 1, xu/XP), `review-box.ts`.
- Server action `finishLessonAction` (Zod, `requireUser` + `requireActiveLearner`, kiểm attempt thuộc hồ sơ): ghi như quyết định 2, trả `{stars, coins, correct, total, minutes, nextLessonId}`; hàm trong `src/server/progress.ts` bọc trong transaction.
- `LessonEnd`: rồng chúc mừng, 3 sao hiện lần lượt, ô xu / câu đúng / thời gian, "Từ vừa học" (nghe được), "Về bản đồ", "Bài tiếp theo", "Làm lại để được 3 sao"; trạng thái lỗi lưu giữ kết quả + Thử lại; confetti tôn trọng reduce-motion.
- Kiểm tra: sao và xu cộng đúng vào hồ sơ (trang chủ), `lesson_progress` đúng, chặng kế mở trên bản đồ, thẻ ôn được tạo (số "từ cần ôn" ngày mai), chuỗi ngày tăng; mất mạng khi lưu → Thử lại không mất kết quả.

## Kiểm tra cuối task
`npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`; học hết một chủ đề cấp 1 chỉ bằng bàn phím (database tạm `hoc_tieng_anh_verify` đã seed + bé giả lập, Edge không đầu qua CDP — dựng lại bộ công cụ ở `.tmp-verify/`, xóa khi đóng task); 4 trạng thái (bình thường, tải, trống, lỗi) của màn học và màn kết thúc ở 1366×768, 1440×900, 1920×1080 không cuộn. Rồi `/finish-task` (rà soát, sửa, kiểm tra, đóng, sơ đồ `/ve-so-do 07-lesson-player`, mô tả PR).

## Rủi ro, ghi chú
- Seed lại cần bạn chạy `npx prisma db seed` trên database thật để có bước lật thẻ; không chạy thay bạn.
- Loa dùng giọng trình duyệt (không có mp3); trình duyệt có thể chặn tự phát âm trước lần chạm đầu — loa vẫn bấm được.
- Kiểm tra kéo thả và bàn phím bằng CDP cần mô phỏng pointer; nếu không ổn định sẽ kiểm bằng ảnh chụp + thao tác phím.
- Chủ đề cấp 3–4 có ít hình (30–100 từ không có hình) nên một số bài chỉ có thẻ từ và chọn chữ; player phải chạy tốt khi thiếu loại bài.
