# Tiến độ — 07-lesson-player — Khung bài học và 4 dạng bài cơ bản

Trạng thái chung: ✅ · Cập nhật lần cuối: 03/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Khung bài học và luồng câu hỏi | ✅ | 03/10/2026 |
| 1 | Thẻ từ (Screen08) | ✅ | 03/10/2026 |
| 2 | Nghe và chọn hình (Screen07) | ✅ | 03/10/2026 |
| 3 | Nối từ với hình (Screen09) | ✅ | 03/10/2026 |
| 4 | Chọn từ đúng cho hình (Screen18) | ✅ | 03/10/2026 |
| 5 | Lật thẻ ghép cặp (Screen10) | ✅ | 03/10/2026 |
| 6 | Kết thúc bài và lưu kết quả (Screen12) | ✅ | 03/10/2026 |

## Nhật ký

### Bước 0 — Khung bài học và luồng câu hỏi (03/10/2026)
- Đã làm: hàm thuần `src/lib/rules/lesson-play.ts` (dựng câu hỏi và đáp án nhiễu có hạt giống), `lesson-session.ts` (hàng đợi, tiến độ, câu làm lại, khôi phục), `random.ts` (tách khỏi `lesson-builder.ts`) + 12 test; `src/server/lesson-play.ts` (`getLessonPlay`: qua `requireLearner`, chỉ bài đã xuất bản và đã mở); `useHotkeys` thêm `captureNative`; route `/lesson/[lessonId]` (`page`, `loading`, `error`) thay màn "Sắp có"; `src/features/lesson/` (`LessonPlayer`, `LessonFrame`, `ExitDialog`, `LessonEmpty`, `resume.ts`, `StubStep` tạm).
- Token mới trong `globals.css`: `--size-lesson-head`, `--size-lesson-head-s`, `--size-lesson-foot`, `--size-lesson-foot-s`, `--size-lesson-stage`, `--size-count-min`.
- Kiểm tra (database tạm `hoc_tieng_anh_verify` đã seed, Edge không đầu qua CDP): bài 13 (22 bước) mở ở 1366×768 không cuộn; Enter đi bước kế, thanh và số "n/N" tăng; × và Esc mở "Dừng bài học?" (rồng `tiec`, "Học tiếp" focus sẵn), Esc/Enter ở lại, "Dừng lại" ra "Hẹn gặp lại nhé!" rồi về `/map/1` sau 2 giây; vào lại bài thì giữ đúng chỗ; bài khóa và trùm khóa → `/map`; id lạ → 404; không có lỗi console. `tsc`, `lint`, `npm test` (62/62) sạch.
- Việc thủ công: không.
- Ghi chú ngoài phạm vi: bản đồ `/map/1` của bé mới ở 1366×768 cao 784px (cuộn 16px) khi thẻ nổi của chặng đầu tự mở; xem ở Giai đoạn rà soát cuối task.

### Bước 1 — Thẻ từ (Screen08) (03/10/2026)
- Đã làm: `WordCardStep` (thẻ lật 3D bằng Space hoặc bấm, ← quay lại thẻ trước, → hoặc Enter sang thẻ kế, thẻ cuối nút "Làm bài tập", chấm vị trí, loa từ và câu ví dụ có in đậm từ), `word-card.module.css`, `StepView` (chọn màn theo dạng bài), `rewindStep` trong `lesson-session.ts` (+1 test) để xem lại thẻ trước, `StepProps` thêm `unit` và `onBack`.
- Token mới trong `globals.css`: `--size-flashcard-w`, `--size-flashcard-h`, `--size-flashcard-art`, `--size-arrow`, `--size-dot`, `--size-dot-on`, `--flip-duration`.
- Kiểm tra (Edge không đầu, database tạm): bài 13 có 7 thẻ; Space và bấm thẻ lật/úp, tiêu đề đổi "Nghĩa của từ"; → sang thẻ 2 (chấm đổi, "Thẻ trước" bật), ← về thẻ 1; loa bật `data-playing`; thẻ cuối → đứng yên, Enter sang bước kế; 1366×768, 1440×900, 1920×1080 không cuộn; không lỗi console. `tsc`, `lint`, `npm test` (63/63) sạch.
- Việc thủ công: không (nghe giọng đọc thật cần trình duyệt có giọng tiếng Anh).

### Bước 2 — Nghe và chọn hình (Screen07) (03/10/2026)
- Đã làm: `ListenChooseStep` (rồng, loa lớn tự đọc từ khi hiện câu, lưới hình đáp án có nhãn phím 1–4, Nghe lại ⟦Space⟧, Gợi ý ⟦H⟧, Kiểm tra ⟦Enter⟧), `choice-flow.ts` (luồng chọn đáp án dùng chung với bước 4: sai lần 1 thử lại, lần 2 tự gợi ý, lần 3 hiện đáp án), `ChoiceFeedback` (dải đúng/chưa đúng/xem đáp án), `burst.ts` (sao bay vào thanh tiến độ, tắt khi giảm chuyển động).
- Token mới: `--size-choice-pic`, `--size-q-dragon`.
- Kiểm tra (Edge không đầu, database tạm): Enter khi chưa chọn không kiểm tra; H bỏ 1 hình ("Còn 2 hình thôi!", nút Gợi ý tắt); chọn đúng → thẻ xanh ✓ + dải "Tuyệt vời!" + từ, phiên âm, nghĩa, Enter sang câu kế; sai lần 1 → "Chưa đúng rồi, thử lại nhé!" ("Đây là xin lỗi…"); sai lần 2 → tự bật gợi ý; sai lần 3 → "Mình xem đáp án nhé!", đáp án đúng sáng xanh, tổng số bước 22 → 23 (câu làm lại ở cuối); không cuộn ở 1366×768; không lỗi console. `tsc`, `lint`, `npm test` (63/63) sạch.
- Việc thủ công: không.

### Bước 3 — Nối từ với hình (Screen09) (03/10/2026)
- Đã làm: `MatchStep` + `match.module.css`: hàng hình có ô thả, khay chip từ (mỗi chip có loa và nhãn phím), rồng + bóng thoại, "Làm lại" và bộ đếm "n/N cặp đã nối", dải "Nối đúng hết rồi!". Kéo thả bằng con trỏ (pointer events; kéo dưới 4px coi là bấm), bấm chip rồi bấm hình, bàn phím: 1–6 nhấc từ ở khay rồi 1–6 thả vào hình, Esc bỏ nhấc, Tab + Enter/Space (nhấc xong focus nhảy tới hình đầu chưa nối). Thả sai: chip về khay, thẻ lắc nhẹ, bóng thoại "Gần đúng rồi! Đây là …", không phạt. `useHotkeys` thêm `capture` để Esc của bước nối chạy trước Esc mở hộp thoại thoát.
- Token mới: `--size-match-pic`, `--size-chip-h`, `--size-slot-h`, `--size-tip-dragon`.
- Kiểm tra (Edge không đầu, database tạm, bài 13 có 6 cặp): bàn phím (nhấc, Esc bỏ nhấc không mở hộp thoại, thả sai rồi đúng, đủ 6 cặp ra dải xanh, Enter sang bước kế); chuột kéo thả (kéo sai chip về khay, kéo đúng nối được); bấm chip → nhấc, bấm lại → bỏ; Tab+Enter nhấc và thả; không cuộn và không tràn ngang ở 1366×768, 1440×900, 1920×1080 (đã sửa hàng hình tràn khi có 6 cặp và rồng che thẻ); không lỗi console. `tsc`, `lint`, `npm test` (63/63) sạch.
- Việc thủ công: không.

### Bước 4 — Chọn từ đúng cho hình (Screen18) (03/10/2026)
- Đã làm: `PickWordStep` + `pick-word.module.css` (hình lớn có rồng, 3 thẻ chữ có nhãn phím và loa; chọn thẻ nào Bông đọc từ đó; Gợi ý ⟦H⟧ làm mờ 1 từ; Kiểm tra ⟦Enter⟧), dùng lại `useChoiceFlow` và `ChoiceFeedback` của bước 2 (lời nhắn gợi ý đổi thành "Nhìn hình thật kỹ nha" cho dạng chọn chữ). Sửa độ ưu tiên CSS (`.words > .word`, `.opts > .opt`, `.pics > .pic`) vì CSS của `ChoiceCard` đè lên.
- Token mới: `--size-pick-pic`, `--size-pick-opts`, `--size-pick-card-h`, `--size-snd`.
- Kiểm tra (Edge không đầu, database tạm): 6 câu chọn từ: H làm mờ 1 từ ("Còn 2 từ thôi!"); đúng → "Tuyệt vời!" + từ, phiên âm, nghĩa; sai lần 1 → "yes là vâng, có. Bé nhìn hình thật kỹ nha…"; sai lần 2 tự gợi ý; sai lần 3 → xem đáp án, tổng bước 22 → 26 sau 4 lần xem đáp án; không cuộn ở 1366×768, 1440×900, 1920×1080; không lỗi console. `tsc`, `lint`, `npm test` (63/63) sạch.
- Việc thủ công: không.

### Bước 5 — Lật thẻ ghép cặp (Screen10) (03/10/2026)
- Đã làm: loại bài `memory_game` (`ACTIVITY_TYPES` + schema `pairCount` 3–6 trong `lesson-step-config.ts`; `lesson-builder.ts` thêm bước sau nối cặp cho bài có từ 4 từ có hình; `lesson-play.ts` dựng cặp từ của bài rồi lấy thêm từ có hình của chủ đề cho đủ cặp); `MemoryStep` + `memory.module.css` (12 thẻ = 6 hình + 6 chữ, thẻ úp màu cấp có sao, lật 3D, đếm "n/6 cặp" và "n lượt", không đếm giờ, thẻ không khớp viền cam rồi úp lại sau 1,1 giây, khớp thì ở lại và đọc từ, mũi tên di chuyển focus ←→ ±1 ↑↓ ±1 hàng, Enter/Space lật, Chơi lại, dải "Ghép xong 6 cặp!"). Giữ thanh tiến độ của bài ở đầu màn thay vì thanh riêng của trò chơi (khác bản xem trước, để tiến độ bài đi liền mạch).
- Token mới: `--size-memory-card`, `--size-tip-dragon-s`.
- Test thêm: 3 test builder/play (65/65): bài có từ 4 từ có hình mới có lật thẻ, pairCount tối đa 6, lấy thêm từ chủ đề cho đủ cặp, bỏ khi dưới 3 cặp.
- Kiểm tra (Edge không đầu, database tạm đã seed lại): 12 thẻ; lật 2 thẻ không khớp → viền cam, lượt tăng, lời "Chưa khớp rồi…"; ghép đủ 6 cặp → dải "Ghép xong 6 cặp!", Enter sang bước kế; mũi tên di chuyển focus đúng, Enter lật; không có đồng hồ; không cuộn ở 1366×768, 1440×900, 1920×1080; không lỗi console. `tsc`, `lint` sạch.
- Việc thủ công: chạy `npx prisma db seed` trên database thật để có bước lật thẻ (seed bỏ qua chủ đề đã có tiến độ học; player vẫn chạy bình thường khi bài chưa có bước này).

### Bước 6 — Kết thúc bài và lưu kết quả (Screen12) (03/10/2026)
- Đã làm: hàm thuần `lesson-score.ts` (sao, thưởng, sao cộng thêm), `review-box.ts` (5 hộp 1/3/7/14/30 ngày) + 12 test (77/77); schema dùng chung `lesson-complete.ts`; `src/server/level-nodes.ts` (trạng thái chặng của một cấp, dùng chung với `lesson-play.ts`); `src/server/lesson-complete.ts` (`completeLesson`: kiểm hồ sơ, bài đã mở, chỉ nhận từ thuộc bài; trong một transaction ghi lượt học, nhật ký câu trả lời, `lesson_progress`, cộng sao/xu/XP, chuỗi ngày bằng `recordStudyDay`, thẻ ôn tập, phiên học); server action `completeLessonAction` (Zod, `requireUser` + `requireActiveLearner`); `LessonEnd` (rồng, 3 sao hiện lần lượt, xu/XP, câu đúng, thời gian, "Từ vừa học" nghe được, Về bản đồ, Bài tiếp theo, Làm lại để được 3 sao, trạng thái đang lưu và lỗi lưu) + `lesson-end.module.css`; `LessonPlayer` ghi kết quả, giữ kết quả trên máy tới khi lưu xong, Thử lại bằng Enter.
- Token mới: `--size-end-card`, `--size-end-card-s`, `--size-end-dragon`, `--size-bigstar`, `--size-bigstar-mid`, `--size-tile-h`.
- Kiểm tra (Edge không đầu, database tạm): học trọn bài 1 (23 bước) chỉ bằng bàn phím: ra màn kết thúc, 1 sao (40% đúng), +15 xu; hồ sơ: sao 1, xu 15, chuỗi 1 ngày; `lesson_progress` best 1; 29 nhật ký câu trả lời; 7 thẻ ôn hộp 1 đến hạn ngày mai; 1 phiên học 2 phút; `localStorage` đã dọn. Mất mạng khi lưu (chặn POST): màn kết thúc báo "Chưa lưu được kết quả" giữ sao và xu, DB chưa ghi, kết quả còn trên máy; bỏ chặn rồi Enter = Thử lại: ghi đúng 1 lượt học (2 lượt tổng), 3 sao, xu 15 → 40, sao hồ sơ 3 (chỉ cộng 2 vì đã có 1 sao); mở lại bài thì học từ đầu, không ghi lần nữa; bản đồ: chặng 1 có 3 sao, chặng 2 thành "đang học"; trang chủ hiện 3 sao, 40 xu, chuỗi 1. Không cuộn ở 1366×768; không lỗi console. `tsc`, `lint`, `npm test` sạch.
- Việc thủ công: không.

### Rà soát cuối task (03/10/2026)
| Mục | Đánh giá | Bằng chứng |
|---|---|---|
| Mỗi dạng bài là một component nhận `step` và báo kết quả qua giao diện chung | ✅ | `types.ts` (`StepProps`), `StepView.tsx`; 5 dạng `WordCardStep`, `ListenChooseStep`, `MatchStep`, `PickWordStep`, `MemoryStep` |
| Tính sao theo thiết kế (≥ 90% → 3, ≥ 70% → 2, luôn ≥ 1) | ✅ | `lesson-score.ts:15`; test `lesson-score.test.ts`; khác PRD Phần F, đã ghi decisions.md |
| Sai lần 2 tự gợi ý, lần 3 hiện đáp án và đưa câu xuống cuối | ✅ | `choice-flow.ts`, `lesson-session.ts:59`; đã thử: tổng bước 22 → 23 |
| Ghi `answer_logs` từng câu và cập nhật thẻ ôn tập | ✅ | `lesson-complete.ts:75-120`, `review-box.ts:26`; 29 nhật ký, 7 thẻ hộp 1 |
| Thoát giữa bài hỏi xác nhận, tiến độ dở được giữ | ✅ | `ExitDialog.tsx`, `resume.ts`; vào lại đúng chỗ |
| Sao, xu lưu vào hồ sơ; lỗi lưu cho Thử lại không mất kết quả; mở chặng kế | ✅ | `LessonPlayer.tsx:84-108`, `LessonEnd.tsx`; đã thử chặn mạng, Thử lại bằng Enter ghi đúng 1 lượt |
| Zod cho mọi ghi DB | ✅ | `lesson-complete.ts` (schema), `actions.ts:19` |
| Mọi truy cập dữ liệu bé kiểm hồ sơ thuộc tài khoản; chỉ bài đã xuất bản và đã mở | ✅ | `requireLearner` ở `lesson-play.ts`, `lesson-complete.ts`; bài khóa → `/map`, id lạ → 404 |
| Không Prisma hay secret trong client component | ✅ | client chỉ `import type` từ `@/server/*` |
| Không mã hex, không px cố định | ✅ | đã quét; đổi perspective và thời lượng thành token (--perspective-*, --star-stagger, --confetti-fall) |
| Phím tắt 1–4, Enter, Space, H, Esc; học hết chủ đề chỉ bằng bàn phím | ✅ | đã học trọn 3 bài + trận trùm bằng bàn phím |
| 1366×768, 1440×900, 1920×1080 không cuộn | ✅ | đo cả 5 dạng bài, màn kết thúc và 3 trạng thái tải/trống/lỗi |
| Trò chơi lật thẻ giữ thanh tiến độ của bài | ⚠️ | bản xem trước dùng thanh riêng không có tiến độ; ghi decisions.md |
| Giọng đọc | ⚠️ | dùng giọng trình duyệt (GĐ1); trình duyệt có thể chặn tự đọc trước lần chạm đầu |
| Ngoài phạm vi, sửa kèm | ⚠️ | bản đồ ở 1366×768 bị cuộn 16px và nút "Bắt đầu" bị cắt khi bài có 7 từ: đã thu gọn thẻ nổi ở màn thấp (`island-map.module.css`) |
- `npx tsc --noEmit`, `npm run lint`, `npm test` (77/77), `npm run build` đều sạch (03/10/2026).

## Bước tiếp theo

Hoàn thành. Checklist test thủ công bên dưới do bạn tự test sau khi đóng task (chưa tích).

### Checklist test thủ công (bạn test sau khi đóng task, chưa tích)
Chuẩn bị: `npx prisma db seed` (để các bài có bước lật thẻ; seed bỏ qua chủ đề đã có tiến độ học), `npm run dev`, đăng nhập, chọn một bé có cấp 1. Làm lại từ đầu: `DELETE FROM lesson_progress WHERE learner_id = <id>;` và xóa `localStorage` (khóa bắt đầu bằng `edu:lesson:`).
- [ ] Từ bản đồ bấm chặng 1, "Bắt đầu" mở bài; thanh tiến độ và "n/N" tăng sau mỗi bước; × hoặc Esc mở "Dừng bài học?" (rồng tiếc, "Học tiếp" là nút chính).
- [ ] Thẻ từ: Space hoặc bấm thẻ để lật, ← → chuyển thẻ, loa đọc từ và câu ví dụ (nghe thử bằng loa thật).
- [ ] Nghe và chọn hình: 1–4 chọn, Space nghe lại, H gợi ý bỏ 1 hình, Enter kiểm tra; sai không bị phạt; sai lần 2 tự gợi ý; sai lần 3 hiện đáp án.
- [ ] Nối từ với hình: kéo từ bằng chuột vào ô dưới hình; thử cả bàn phím (1–6 nhấc từ rồi 1–6 thả vào hình, Esc bỏ nhấc).
- [ ] Lật thẻ ghép cặp: 12 thẻ, đếm lượt, không có đồng hồ; mũi tên di chuyển, Enter lật.
- [ ] Chọn từ đúng cho hình: chọn thẻ thì nghe đọc từ.
- [ ] Màn kết thúc: sao hiện lần lượt, xu, số câu đúng, thời gian, "Từ vừa học" nghe được; "Bài tiếp theo" (Enter) mở chặng kế; sang trang chủ thấy sao, xu, chuỗi ngày tăng và "từ cần ôn" ngày mai.
- [ ] Thoát giữa bài rồi vào lại: học tiếp đúng câu đang làm.
- [ ] Tắt mạng (DevTools → Offline) khi bài vừa xong: báo "Chưa lưu được kết quả"; bật mạng bấm Thử lại (hoặc Enter): lưu đúng một lần.
- [ ] Gõ `/lesson/<số bài còn khóa>` thì về bản đồ; số lạ thì 404.
