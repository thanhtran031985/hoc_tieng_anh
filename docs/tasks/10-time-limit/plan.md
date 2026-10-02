# Kế hoạch — 10-time-limit — Giới hạn giờ học

## Context
Bố mẹ đặt số phút học mỗi ngày (task 11 sẽ có màn đặt; `learners.settings.dailyLimitMinutes` đã có trong schema, mặc định null = tắt). Task này: đo phút học thật, hiện thời gian còn lại ở trang chủ, và khi hết giờ thì mọi màn của bé chuyển về màn "Hết giờ học" (Screen14, rồng đi ngủ); bố mẹ nhập PIN/mật khẩu để thêm giờ. Theo lệnh của bạn: tự duyệt kế hoạch, làm liên tục, commit + push từng bước, `/finish-task` ở cuối (checklist thủ công chưa tích), rồi sang task 11.

Thiết kế đã đọc: `Screen14-TimeUp` (nền đêm `--bg-night`, rồng `ngu`, 3 chip tóm tắt, "Chúc Bông ngủ ngon", "Bố mẹ: thêm 10 phút" mở hộp thoại nhập mật khẩu; 4 trạng thái). Trang chủ: thẻ "Hôm nay: x/y phút" đã có ở `LevelCard.tsx`.

## Hiện trạng
- `study_sessions` chỉ được ghi một dòng ở cuối bài (`lesson-complete.ts:119`) và cuối phiên ôn (`review.ts:180`, còn dùng làm khóa chống ghi đôi); bài xếp lớp và lúc duyệt bản đồ không đo. Trang chủ cộng `minutes` của các dòng đó.
- `requireActiveLearner()` (`server/active-learner.ts`) dùng ở mọi trang của bé và cả server action; `(kid)/layout.tsx` chỉ `requireUser()` và không render lại khi chuyển trang trong nhóm.
- Mở khóa bố mẹ: `unlockParentAction` kiểm PIN (bcrypt) hoặc mật khẩu tài khoản, có giới hạn thử (`rate-limit.ts`) — tái dùng logic.

## Quyết định (ghi vào decisions.md)
1. **Đo bằng nhịp mỗi phút, không đổi database**: một component client `StudyClock` trong `(kid)/layout.tsx` đếm giây học khi tab đang hiện (`visibilityState`) và bé vừa thao tác trong 60 giây gần nhất (chuột, phím, chạm); đủ 60 giây thì gọi server action `recordStudyMinuteAction`, server ghi một dòng `study_sessions` (1 phút). Phần lẻ dưới 1 phút giữ trong `localStorage` (không mất khi đổi trang). Server chỉ nhận nhịp cách nhau ≥ 50 giây (chống gửi dồn) và dùng giờ server.
2. **Bỏ ghi `study_sessions` ở cuối bài** (tránh đếm đôi); cuối phiên ôn chỉ ghi dòng đánh dấu `minutes = 0` để giữ cơ chế chống ghi đôi theo `startedAt`.
3. **Hết giờ = phút đã học hôm nay ≥ giới hạn + phút thêm hôm nay** (hàm thuần `src/lib/rules/study-time.ts` + test: `studyAllowance`, `addBonus`). Giới hạn lấy từ `learners.settings.dailyLimitMinutes` (null = không giới hạn, không bao giờ hết giờ).
4. **Phút thêm** lưu trong `learners.settings.bonus = { date, minutes }` (mở rộng schema Zod, mặc định null; chỉ có hiệu lực đúng ngày đó). Mỗi lần "thêm 10 phút" đảm bảo còn ít nhất 10 phút (cả khi bé đã vượt giới hạn vì làm nốt câu).
5. **Chặn ở server**: `requireActiveLearner({ allowTimeUp })` — mặc định kiểm giờ và `redirect("/time-up")` khi hết; các server action (hoàn thành bài, ôn tập, xếp lớp) và chính `/time-up`, `/profiles` truyền `allowTimeUp: true` (không bao giờ làm mất kết quả bé vừa làm). Hết giờ giữa lúc đang dùng (chuyển trang kiểu client): `StudyClock` tự lấy trạng thái từ server khi đổi đường dẫn và khi nhận nhịp mới, rồi `router.replace("/time-up")`.
6. **Hết giờ giữa bài** (task.md): trong `/lesson`, `/review`, `/placement` không ngắt ngay; `StudyClock` chỉ đặt cờ "hết giờ" trong context, các trình chơi đọc cờ sau khi bé xong câu/bước hiện tại rồi chuyển `/time-up`. Tiến độ dở đã được giữ ở `localStorage` (bài học, ôn) nên mai học tiếp.
7. **Màn Hết giờ** `/time-up`: nền đêm, trăng sao, rồng `ngu` trên mây, tóm tắt hôm nay (phút, sao nhận được từ các lượt học hôm nay, số từ mới = từ khác nhau đã học trong ngày), "Hẹn {tên} ngày mai" (khung giờ học là GĐ2). Không có nút học tiếp. "Chúc Bông ngủ ngon" → `/profiles` (để đổi bé). "Bố mẹ: thêm 10 phút" → hộp thoại nhập PIN/mật khẩu (dùng chung hàm kiểm với cổng bố mẹ, tách ra `server/parent-secret.ts`, có giới hạn thử) → cộng 10 phút → `/home`. Trạng thái trống ("Đến giờ nghỉ rồi!" khi hôm nay chưa học bài nào), tải, lỗi tóm tắt (vẫn hiện lời chúc, có Thử lại). Nếu chưa hết giờ mà vào `/time-up` → về `/home`.
8. **Trang chủ**: thẻ "Hôm nay: x/y phút" lấy y = giới hạn nếu có (không thì mục tiêu ngày như cũ) và thêm dòng "Còn N phút" khi có giới hạn.
9. Không làm: khung giờ được học trong ngày (GĐ2), đặt giới hạn bằng giao diện (task 11; trong lúc kiểm tra đặt bằng SQL), cảnh báo trước khi hết giờ.

## Các bước (khớp task.md; sau mỗi bước: kiểm tra, progress.md, dashboard "Cảnh báo: 0", commit `10-time-limit: step N — …`, push)

### Bước 0 — Ghi phiên học và tính phút
- `src/lib/rules/study-time.ts` + `study-time.test.ts`; mở rộng `learner-settings.ts` (`bonus`); `src/server/study-time.ts` (`getStudyStatus(learner)`, `recordStudyMinute(userId, learnerId)`, `addBonusMinutes`); action `src/features/study-clock/actions.ts` (`recordStudyMinuteAction`, `getStudyStatusAction`); `StudyClock.tsx` (+ context `useStudyClock`) gắn vào `(kid)/layout.tsx`; bỏ `studySession.create` ở `lesson-complete.ts`, đổi dòng ở `review.ts` thành đánh dấu `minutes: 0`; `home.ts` + `LevelCard.tsx` hiển thị "x/y phút" và "Còn N phút".
- Kiểm tra: học 2 phút (CDP, đồng hồ thật hoặc tăng tốc bằng cách đặt thời gian nhịp qua hằng số kiểm tra) thì `study_sessions` có 2 phút và trang chủ tăng đúng; tab ẩn/không thao tác không tính; sang ngày mới thì về 0 (đổi `started_at` trong DB).

### Bước 1 — Màn Hết giờ học (Screen14)
- `requireActiveLearner({ allowTimeUp })`; `src/server/parent-secret.ts` (tách khỏi `unlockParentAction`, dùng lại); `src/features/time-up/` (`TimeUpView`, `AddTimeDialog`, `actions.ts` `addBonusMinutesAction`), route `(kid)/time-up/{page,loading,error}.tsx`; `StudyClock` chuyển hướng + cờ hết giờ cho trình chơi (`LessonPlayer`, `ReviewPlayer`, `PlacementFlow` đọc cờ sau mỗi bước); token mới nếu thiếu.
- Kiểm tra: đặt `dailyLimitMinutes = 5` rồi học tới hết: mọi route (`/home`, `/map`, `/lesson/…`, `/review`, `/notebook`) chuyển `/time-up`; hết giờ giữa bài thì làm nốt câu rồi mới chuyển, kết quả bài vẫn lưu; nhập PIN sai báo lỗi, đúng thì cộng 10 phút và vào lại học được; không giới hạn thì không bao giờ chuyển; 4 trạng thái; 1366×768 không cuộn.

## Kiểm tra cuối task
`npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`; rồi `/finish-task` (rà soát, checklist thủ công chưa tích, đóng, `/ve-so-do 10-time-limit` — sơ đồ sequence nhịp đo giờ/lifecycle trạng thái giờ học, vẽ lại tổng quan, so-sanh.md, mô tả PR; không merge).

## Rủi ro
- Đo giờ phụ thuộc trình duyệt (tab mở + thao tác): bé có thể mở tab khác đồng hồ không chạy — đúng ý task.md. Nhịp bị gửi dồn bị server bỏ qua; mất mạng thì phút đó không ghi (chấp nhận).
- Nhiều tab cùng lúc có thể tính đôi giây: server giới hạn mỗi 50 giây một nhịp cho mỗi hồ sơ nên không đếm quá.
