# Tiến độ — 07-lesson-player — Khung bài học và 4 dạng bài cơ bản

Trạng thái chung: 🔄 · Cập nhật lần cuối: 03/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Khung bài học và luồng câu hỏi | ✅ | 03/10/2026 |
| 1 | Thẻ từ (Screen08) | ✅ | 03/10/2026 |
| 2 | Nghe và chọn hình (Screen07) | ✅ | 03/10/2026 |
| 3 | Nối từ với hình (Screen09) | ✅ | 03/10/2026 |
| 4 | Chọn từ đúng cho hình (Screen18) | ⬜ | |
| 5 | Lật thẻ ghép cặp (Screen10) | ⬜ | |
| 6 | Kết thúc bài và lưu kết quả (Screen12) | ⬜ | |

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

## Bước tiếp theo

Bước 4 — Chọn từ đúng cho hình (Screen18)
