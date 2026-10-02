# Kế hoạch — 08-review-notebook — Ôn tập lặp lại và Sổ từ

## Context
Task 07 xong: bé học bài, mỗi từ có thẻ ôn (`review_cards`, hộp 1, đến hạn ngày mai). Nhưng `/review` và `/notebook` vẫn là màn "Sắp có", nên thẻ chưa bao giờ quay lại. Task này dựng: (0) luật 5 hộp đầy đủ, (1) màn Ôn tập hôm nay (Screen19 bắt đầu, câu hỏi, Screen20 tổng kết), (2) Sổ từ (Screen13). Theo lệnh của bạn: tự duyệt kế hoạch, làm liên tục, commit + push từng bước, `/finish-task` ở cuối (checklist thủ công để chưa tích), rồi sang task 09.

Thiết kế đã đọc: `Screen13-Notebook`, `Screen19-ReviewStart`, `Screen20-ReviewDone` (4 trạng thái mỗi màn). `bundle.js` không có thành phần riêng cho mức thuộc/hộp: phải dựng `MasteryPips`, `WordCard` (sổ), `MemoryBox` (hộp), `FilterChip` — token `mastery-1..5` (+ `-soft`) đã có trong `globals.css`.

## Quyết định (ghi vào decisions.md)
1. **Tên file luật**: task.md ghi `src/lib/rules/review.ts`, code đã có `review-box.ts` (task 07, đã được test). Giữ `review-box.ts`, bổ sung vào đó (không đổi tên); ghi lệch tên.
2. **Lịch hộp theo PRD/code (1/3/7/14/30 ngày)**, không theo chữ cứng của bản xem trước (2/4/7/14). Nhãn "Ôn sau 3 ngày / 1 tuần / 2 tuần / 1 tháng" sinh từ `BOX_INTERVAL_DAYS` (hàm `intervalLabel`).
3. **Màu**: theo thiết kế/token (tím nhạt, vàng, xanh dương, tím, xanh lá), không theo PRD C12 (đỏ nhạt, cam…). Mức thuộc = số hộp (`mastery-N`). "Đã thuộc" = hộp 5 và đã đúng (`isMastered` có sẵn).
4. **Chỉ từ đến hạn** vào phiên ôn: thẻ có `dueOn ≤ hôm nay` (múi giờ VN, `dates.ts`), tối đa 15 (TH) / 20 (THCS, không có câu ngữ pháp vì chưa có), ưu tiên hộp thấp rồi hạn cũ. Server kiểm lại khi lưu: từ không có thẻ đến hạn thì bỏ qua (chống bump hộp bằng cách ôn thừa).
5. **Chỉ từ có hình** vào phiên ôn (3 dạng 8.2–8.4 đều cần hình). Để màn trang chủ và màn ôn khớp số, `dueCount` ở `server/home.ts` cũng chỉ đếm từ có hình (tính ở một hàm dùng chung `dueWhere`).
6. **Dựng phiên** (hàm thuần `src/lib/rules/review-play.ts` + test): n từ; n ≥ 6 → 4 từ cuối ghép thành một bước nối cặp (`match_pairs`, mỗi cặp 1 mục), các từ còn lại xen kẽ nghe-chọn-hình / chọn-từ-cho-hình, mỗi từ đúng một lần; đáp án nhiễu lấy từ các từ có hình khác cùng cấp (server đưa `pool`), xáo theo seed. Id bước `r1…` (không đụng id số của bài học). Từ "nhớ" = tất cả mục của từ đúng ngay lần đầu.
7. **Thưởng** (PRD Phần F và bản xem trước mâu thuẫn): mỗi từ ôn 1 sao (theo thiết kế, cộng thẳng `learners.stars`); TH +1 xu mỗi từ (PRD), THCS +2 XP mỗi từ. Số "+20 xu" trong mẫu chỉ là dữ liệu mẫu. Ôn chỉ tính khi hoàn thành hết phiên; dừng giữa chừng → màn "Hẹn cậu lần sau nhé!" không ghi gì (tiến độ dở giữ ở `localStorage` khóa `edu:review:<learnerId>:<ngày>`, vào lại học tiếp).
8. **Server** `completeReview(userId, learnerId, input)`: Zod `completeReviewInputSchema {startedAtMs, durationMs, items[]≤60}`, kiểm hồ sơ thuộc tài khoản, một transaction: cập nhật thẻ bằng `nextReview`, `answerLog` `source "review"` (`attemptId null`, để mission "Ôn tập" tính xong), cộng sao/xu/XP, chuỗi ngày `recordStudyDay`, `studySession` (loại "review"; chống ghi đôi bằng `startedAt`); trả `{stars, coins, xp, total, moved:[{word, from, to}], up, back}`.
9. **Sổ từ**: từ đã học = từ có thẻ ôn của bé. Chủ đề lấy qua `LessonStep.wordId → Lesson.unitId → Unit` (chính xác hơn `WordTopic` khớp tên); từ ở nhiều chủ đề thì hiện ở từng chủ đề. Sắp xếp hộp thấp lên trước, rồi theo chữ. Bấm thẻ mở hộp thoại phóng to (nghe từ + câu ví dụ) — thiết kế không có màn này, dựng từ `Dialog` + `SpeakerButton` + `WordPicture`, ghi là phần tự suy ra.
10. **Trang chủ**: ẩn dòng nhiệm vụ Ôn tập khi không có từ đến hạn và hôm nay chưa ôn (sửa `MissionCard`, bỏ nhánh "Hôm nay chưa có từ cần ôn" cho bé cũ).
11. Dùng lại khung task 07 (`LessonFrame/Main/Foot`, `StepView`, `ListenChooseStep`, `PickWordStep`, `MatchStep`, `lesson-session.ts`, `ExitDialog`) — tách `ReviewPlayer` riêng ở `src/features/review/` (chép khung điều khiển ngắn của `LessonPlayer`, không refactor player đang chạy ổn); `ReviewEnd` riêng vì nội dung tổng kết khác. Không cài package, không động `designs/`. Token thiếu thì thêm vào `globals.css`, liệt kê khi báo cáo.

## Các bước (khớp task.md; sau mỗi bước: kiểm tra, progress.md, dashboard "Cảnh báo: 0", commit `08-review-notebook: step N — …`, push)

### Bước 0 — Hàm 5 hộp
- `review-box.ts` thêm: `intervalLabel(box)`, `MASTERY_NAMES` (Mới gặp / Đang nhớ / Khá nhớ / Nhớ tốt / Thuộc lòng), `masteryOf(card)` (= số hộp kẹp 1–5); test `review-box.test.ts` thêm chuỗi đúng/sai nhiều lần với ngày đến hạn đúng bảng (đúng liên tiếp 1→5 = +1/+3/+7/+14/+30 ngày; sai ở hộp 4 về hộp 1).
- Kiểm tra: `npm test` xanh; chuỗi mẫu in đúng ngày.

### Bước 1 — Ôn tập hôm nay (Screen19, câu hỏi, Screen20)
- Hàm thuần `review-play.ts` + test (quyết định 4, 6, 7: `buildReviewSteps`, `rewardForReview`).
- Server: `src/server/review.ts` (`getReviewOverview` — số từ theo hộp, đến hạn theo hộp, 4 hình mẫu/hộp, ngày ôn kế; `getReviewPlay`; `completeReview`), schema `src/lib/schemas/review-complete.ts` (export ở `schemas/index.ts`), action `src/features/review/actions.ts`.
- UI `src/features/review/`: `ReviewStart` (Screen19: rồng, số đến hạn, 5 `MemoryBox`, "Bắt đầu ôn" Enter; trống "Học bài mới"/"Về trang chủ"), `ReviewPlayer` (khung lesson, × / Esc hỏi dừng), `ReviewEnd` (Screen20: 2 ô sao/xu, danh sách từ lên hộp có `BoxHop`, dòng "N từ khác lên hộp tiếp theo / N từ về hộp 1", lỗi lưu giữ Thử lại, confetti tôn trọng reduce-motion), module CSS + token; route `(kid)/review/{page,loading,error}.tsx` thay `ComingSoon`.
- Sửa `home.ts` (`dueWhere` chỉ từ có hình) + `MissionCard` (quyết định 10).
- Kiểm tra (CDP, DB tạm): bé Mai có 6 thẻ đến hạn ở các hộp → vào `/review`, ôn bằng bàn phím, kết quả đúng: hộp tăng/về 1, `dueOn` đúng, sao/xu cộng, `answer_logs` `source review`, mission hoàn thành trên trang chủ; 0 từ đến hạn → màn trống và trang chủ ẩn dòng; tải/lỗi; 1366×768 / 1440×900 không cuộn.

### Bước 2 — Sổ từ (Screen13)
- `src/server/notebook.ts` `getNotebook(learnerId)` (thẻ + từ + chủ đề, đếm theo chủ đề); trang `(kid)/notebook/{page,loading,error}.tsx`; `NotebookView` client (chip lọc `radiogroup` có mũi tên ←→, lưới cuộn trong, `WordCard` + `MasteryPips`, viền + chấm + chữ báo mức), hộp thoại phóng to, 4 trạng thái (trống: "Sổ từ còn trống" + "Học bài đầu tiên").
- Kiểm tra: số từ khớp số thẻ; lọc chủ đề đổi lưới và đếm; từ hộp thấp lên đầu; mở thẻ nghe được; 4 trạng thái; không cuộn trang ở 1366×768 (lưới cuộn bên trong).

## Kiểm tra cuối task
`npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`; chạy lại bộ CDP (`.tmp-verify/`, DB `hoc_tieng_anh_verify`) cho cả hai màn; sau đó `/finish-task` (rà soát, kiểm tra, checklist thủ công chưa tích, đóng, `/ve-so-do 08-review-notebook` — thêm sơ đồ lifecycle 5 hộp, cập nhật tổng quan, mô tả PR; không merge).

## Rủi ro
- Từ không có hình không được ôn (nguồn: dữ liệu mẫu cấp 3–4 thiếu hình); hệ quả nhỏ, ghi decisions.
- Đúng/sai do client báo (như task 07), chấp nhận.
- Seed lại không cần cho task này.
