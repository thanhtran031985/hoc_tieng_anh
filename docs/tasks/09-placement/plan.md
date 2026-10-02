# Kế hoạch — 09-placement — Bài xếp lớp

## Context
Hồ sơ mới tạo xong đi thẳng `/home` ở cấp theo lớp (task 02). Task này thêm bài xếp lớp ngắn dạng trò chơi để Bông đề xuất cấp bắt đầu (PRD C4): giới thiệu (Screen15) → 12 câu nghe và chọn hình, không báo đúng/sai (Screen16) → kết quả có cấp đề xuất, nhận xét ngắn, nút "Chọn cấp khác" (Screen17), và "Bỏ qua, bắt đầu theo lớp". Theo lệnh của bạn: tự duyệt kế hoạch, làm liên tục, commit + push từng bước, `/finish-task` ở cuối (checklist thủ công chưa tích), rồi sang task 10.

Thiết kế đã đọc: `Screen15/16/17` (README + preview, 4 trạng thái). Tái dùng: `LessonFrame/LessonFoot/LessonMain` (khung bài, `head` thay thanh tiến độ bằng 12 ngôi sao), `ChoiceCard`, `SpeakerButton`, `WordPicture`, `Mascot`, `Dialog`, `DataState`, `useHotkeys`, `playPronunciation`, token `--size-star-pip` (đã có).

## Quyết định (ghi vào decisions.md)
1. **Không đổi database**: không thêm cột "đã xếp lớp". Kết quả = cập nhật `learners.current_level_id` (khi bé bấm "Bắt đầu học") + `answer_logs` nguồn `exam` (để báo cáo bố mẹ sau này). Bài xếp lớp chỉ vào được khi bé chưa xong bài học nào (`lesson_progress` rỗng) và chưa có `answer_logs` nguồn `exam`; ngược lại về `/home`.
2. **Luật thích ứng** (`src/lib/rules/placement.ts`, hàm thuần + test): bắt đầu ở cấp = lớp, kẹp vào [1, cấp cao nhất có nội dung published] (GĐ1: cấp 4); đúng 3 câu liên tiếp thì lên 1 cấp, sai 2 câu liên tiếp thì xuống 1 cấp (không dưới 1, không quá cấp cao nhất; sau khi đổi cấp đếm lại từ 0); "Tớ chưa biết" tính là sai; đủ 12 câu thì dừng. Cấp đề xuất = cấp cao nhất có ≥ 2 câu và đúng ≥ 70%; không cấp nào đạt thì cấp thấp nhất bé đã gặp.
3. **Câu hỏi dựng ở server, chọn câu ở client**: server gửi sẵn mỗi cấp có nội dung một "kho" ~12 câu nghe-chọn-hình (từ có hình của các chủ đề đã xuất bản của cấp đó, hình nhiễu cùng cấp, xáo theo seed) để không cần gọi server giữa các câu; client chọn câu kế theo cấp hiện tại bằng hàm thuần. Server tính lại cấp đề xuất từ danh sách trả lời (không tin số client) và ghi nhật ký.
4. **THCS** (lớp ≥ 6): ngoài phạm vi (GĐ3). Màn giới thiệu hiện trạng thái trống của thiết kế ("Chưa có bài xếp lớp cho lớp này") với nút "Bắt đầu ở Cấp N" (N = cấp theo lớp, kẹp ở cấp cao nhất có nội dung). Cũng dùng trạng thái trống khi kho câu hỏi không đủ (cấp < 4 từ có hình).
5. **Bỏ qua**: hộp thoại xác nhận "Bắt đầu ở Cấp N · Tên?" (N theo lớp, kẹp như trên); Enter = Bắt đầu học, Esc = Làm bài xếp lớp. Đồng ý thì cập nhật cấp (nếu khác) và về `/home`.
6. **Dừng giữa chừng** (× → "Dừng bài xếp lớp?", rồng `tiec`): hiện màn kết quả ở trạng thái trống ("Mới được N câu thôi"): "Làm tiếp bài xếp lớp" hoặc "Bắt đầu theo lớp". Không ghi gì.
7. **Kết quả**: không hiện điểm hay số câu đúng. Nhận xét ngắn + nhãn chủ đề: chủ đề (đơn vị `units.title_vi` của từ đã hỏi) bé đúng hết = "vững" (chip xanh), còn lại = "sẽ học" (chip kem), tối đa 5. Lỗi lưu: giữ cấp đề xuất tính ngay trên máy, có nút Thử lại (bản xem trước không có nút, ta thêm như task 07).
8. **Chọn cấp khác**: chỉ các cấp Tiểu học (1–5) đã có nội dung (GĐ1: 1–4; thiết kế vẽ 5 đảo nhưng cấp 5 chưa có bài), ← → chọn, cấp đề xuất có nhãn "Bông đề xuất", chọn cao hơn có lời nhắc nhẹ.
9. **Điểm vào**: tạo hồ sơ xong chuyển tới `/placement` (sửa `CreateProfileFlow`), thay vì `/home`. Nút quay lại ở màn giới thiệu về `/profiles` (hồ sơ đã được tạo), nhãn "Về chọn hồ sơ" (khác bản xem trước "Quay lại tạo hồ sơ").
10. Không làm: mic/loa (đã có ở tạo hồ sơ), THCS 20–25 câu, trạng thái lỗi "loa chưa phát được" của Screen16 (giọng đọc là của trình duyệt, không có sự kiện lỗi để bắt), lưu tiến độ dở (bài chỉ ~5 phút).

## Các bước (khớp task.md; sau mỗi bước: kiểm tra, progress.md, dashboard "Cảnh báo: 0", commit `09-placement: step N — …`, push)

### Bước 0 — Hàm xếp lớp
- `src/lib/rules/placement.ts`: `PLACEMENT_QUESTIONS=12`, `startLevel(grade, maxLevel)`, `createPlacement`, `answerPlacement(state, correct, maxLevel)`, `isPlacementDone`, `suggestLevel(answers, fallback)`, `placementComment(...)`; test `placement.test.ts` (đúng 3 liên tiếp lên, sai 2 liên tiếp xuống, kẹp biên, tính "chưa biết" là sai, cấp đề xuất ≥ 70%, không cấp nào đạt).
- Kiểm tra: `npm test` xanh; chạy các chuỗi trả lời mẫu ra cấp đề xuất đúng.

### Bước 1 — Màn giới thiệu, làm bài và kết quả (Screen15–17)
- `src/lib/schemas/placement.ts` (Zod: `completePlacementInputSchema`, `applyStartLevelInputSchema`, kiểu `PlacementResult`), export ở `schemas/index.ts`.
- `src/server/placement.ts` (đều qua `requireLearner`): `getPlacementSetup` (cấp có nội dung, tên cấp, kho câu hỏi, kiểm điều kiện vào bài), `completePlacement` (tính lại cấp đề xuất, nhãn chủ đề, ghi `answer_logs` `exam`), `applyStartLevel` (kiểm cấp có nội dung ≤ 5, cập nhật `current_level_id`).
- `src/features/placement/`: `actions.ts` (`completePlacementAction`, `applyStartLevelAction`), `PlacementFlow` (giữ pha intro/quiz/result), `PlacementIntro`, `PlacementQuiz` (12 sao tiến độ qua `LessonFrame head`, 1–4 chọn, Space nghe, Enter tiếp, "Tớ chưa biết"), `PlacementResult` (lvbox màu cấp, nhận xét, chip chủ đề, picker cấp), CSS module + token mới (nếu thiếu), `Dialog` xác nhận bỏ qua / dừng.
- Route `(kid)/placement/{page,loading,error}.tsx`; sửa `CreateProfileFlow` → `/placement`.
- Kiểm tra (CDP, DB tạm: thêm bé lớp 3 và bé lớp 7 chưa học): giới thiệu → 12 câu bằng bàn phím → kết quả; cấp đề xuất ghi vào hồ sơ; "Chọn cấp khác" đổi được; "Bỏ qua" có hộp thoại xác nhận; dừng giữa chừng ra màn trống; lớp 7 ra trạng thái trống; tải/lỗi; bé đã học bị chuyển `/home`; 1366×768 không cuộn.

## Kiểm tra cuối task
`npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`; rồi `/finish-task` (rà soát, kiểm tra, checklist thủ công chưa tích, đóng, `/ve-so-do 09-placement` — thêm sơ đồ workflow/lifecycle bài xếp lớp, vẽ lại tổng quan, so-sanh.md, mô tả PR; không merge).

## Rủi ro
- Cấp 3–4 có ít từ có hình: kho có thể < 12 câu/cấp; chấp nhận (client dùng hết kho rồi lặp lại câu cũ không quá 1 lần, nếu vẫn thiếu thì kết thúc sớm và dùng các câu đã làm).
- Đúng/sai tính ở client (như bài học); cấp đề xuất chỉ là gợi ý, bé hoặc bố mẹ đổi được.
