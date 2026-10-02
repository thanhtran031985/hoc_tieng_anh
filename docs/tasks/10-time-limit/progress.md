# Tiến độ — 10-time-limit — Giới hạn giờ học

Trạng thái chung: ✅ · Cập nhật lần cuối: 03/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|------|-----|------------|---------|
| 0 | Ghi phiên học và tính phút | ✅ | `StudyClock` + `server/study-time.ts` + `rules/study-time.ts` (test 103/103) |
| 1 | Màn Hết giờ học (Screen14) | ✅ | `/time-up`, `requireActiveLearner({ allowTimeUp })`, thêm giờ bằng PIN |

## Nhật ký
### Bước 0 — Ghi phiên học và tính phút (03/10/2026)
- Đã làm: hàm thuần `study-time.ts` (`studyAllowance`, `grantBonus`, `bonusFor`) + test; `bonus` trong `learner-settings.ts`; `src/server/study-time.ts` (`getStudyStatusFor`, `recordStudyMinute` nhận nhịp cách nhau ≥ 50 giây); action `getStudyStatusAction`, `recordStudyMinuteAction`; `StudyClock` trong `(kid)/layout.tsx` (đếm giây khi tab hiện và có thao tác trong 60 giây, gửi nhịp mỗi phút, phần lẻ giữ ở localStorage); bỏ ghi `study_sessions` cuối bài học, dòng phiên ôn thành đánh dấu `minutes: 0`; trang chủ hiện "x/y phút · còn N phút".
- File tạo/sửa: `src/lib/rules/study-time.ts(+test)`, `src/lib/schemas/learner-settings.ts`, `src/server/study-time.ts`, `src/features/study-clock/*`, `src/app/(kid)/layout.tsx`, `src/server/lesson-complete.ts`, `src/server/review.ts`, `src/server/home.ts`, `src/features/home/LevelCard.tsx`.
- Kết quả kiểm tra (DB tạm, CDP, chạy 134 giây có thao tác): `study_sessions` có 2 dòng 1 phút, trang chủ hiện "Hôm nay: 2/10 phút"; phần lẻ 15 giây nằm ở localStorage; lùi các dòng 1 ngày thì trang chủ về "0/10 phút"; không thao tác thì đồng hồ dừng sau 60 giây; `tsc`, `lint`, `npm test` 103/103 sạch.
- Việc tôi cần làm thủ công: không.

### Bước 1 — Màn Hết giờ học (03/10/2026)
- Đã làm: `requireActiveLearner({ allowTimeUp })` chuyển `/time-up` khi hết giờ (server action và `/time-up`, `/profiles` bỏ qua); `server/parent-secret.ts` (`checkParentSecret`, tách khỏi `unlockParentAction`); `getTimeUpSummary`, `addBonusMinutes` (`grantBonus`) ở `server/study-time.ts`; `src/features/time-up/` (`TimeUpView`, hộp thoại PIN, `addBonusMinutesAction`, CSS nền đêm); route `/time-up` có loading/error; `useTimeUpRedirect` trong `LessonPlayer`, `ReviewPlayer`, `PlacementFlow` (làm nốt câu rồi mới chuyển); tokens mới `--size-timeup-dragon`, `--size-cloudbed-*`, `--size-moon`, `--size-sky-dot*`, `--size-chip-icon`. Sửa kèm: regex ngày của `bonus` bị mất dấu  (bắt được khi thử PIN đúng).
- Kết quả kiểm tra (DB tạm, CDP, 1366×768): giới hạn 5 phút, đã học 5 phút → `/home`, `/map/1`, `/lesson/…`, `/review`, `/notebook`, `/levels`, `/placement` đều về `/time-up`, `/profiles` vẫn vào được; PIN sai báo lỗi, PIN đúng ghi `bonus` và trang chủ hiện "5/15 phút · còn 10 phút"; không giới hạn thì không chuyển; chưa hết giờ mà vào `/time-up` thì về `/home`; hết giờ giữa bài (đang ở bước đầu, đủ phút sau ~60 giây) vẫn ở lại cho tới khi xong bước rồi mới sang `/time-up`; màn có tóm tắt (5 phút · 3 sao · 6 từ mới) và trạng thái trống; không cuộn; `tsc`, `lint`, `npm test` 103/103, `build` sạch.
- Việc tôi cần làm thủ công: không (checklist ở cuối task).

### Rà soát cuối task (03/10/2026)
| Mục | Đánh giá | Bằng chứng |
|---|---|---|
| Ghi phiên học (`study_sessions`) và tính phút trong ngày | ✅ | `StudyClock.tsx`, `server/study-time.ts:56`; 134 giây có thao tác → 2 dòng 1 phút; sang ngày mới về 0 |
| Chỉ tính khi tab mở và có thao tác | ✅ | `StudyClock.tsx` (visibilityState + 60 giây không thao tác thì dừng) |
| Giới hạn lưu trong `learners.settings`; mặc định tắt | ✅ | `learner-settings.ts` (`dailyLimitMinutes` null, `bonus`) |
| Hiện thời gian còn lại trên trang chủ | ✅ | `LevelCard.tsx:43` ("5/15 phút · còn 10 phút") |
| Hết giờ thì mọi route của bé về màn Hết giờ học | ✅ | `active-learner.ts:44`; đã thử /home, /map, /lesson, /review, /notebook, /levels, /placement; /profiles vẫn vào được |
| Hết giờ giữa bài: làm nốt câu rồi mới chuyển | ✅ | `useTimeUpRedirect` ở 3 trình chơi; thử bài học: ở lại tới khi xong bước |
| Thêm giờ bằng PIN bố mẹ | ✅ | `parent-secret.ts`, `addBonusMinutes`; PIN sai báo lỗi, đúng +10 phút |
| 4 trạng thái màn Hết giờ học | ✅ | `TimeUpView.tsx` (bình thường, trống, lỗi tóm tắt), `time-up/loading.tsx`, `error.tsx` |
| Zod; kiểm hồ sơ thuộc tài khoản; không Prisma/secret trong client | ✅ | `study-time.ts` qua `requireLearner`; client chỉ `import type` |
| Không hex/px cố định | ✅ | đã quét; token mới `--size-timeup-dragon`, `--size-cloudbed-*`, `--size-moon`, `--size-sky-dot*`, `--size-chip-icon` |
| Khác task.md | ⚠️ | đo bằng nhịp mỗi phút, không đổi database; bỏ ghi `study_sessions` cuối bài; đã ghi decisions.md và so-sanh.md (27–28) |
- `npx tsc --noEmit`, `npm run lint`, `npm test` (103/103), `npm run build` đều sạch (03/10/2026).

## Bước tiếp theo

Hoàn thành. Checklist test thủ công bên dưới do bạn tự test sau khi đóng task (chưa tích).

### Checklist test thủ công (bạn test sau khi đóng task, chưa tích)
Chuẩn bị: `npm run dev`, đăng nhập, chọn bé. Task 11 chưa có màn đặt giới hạn nên đặt bằng SQL: `UPDATE learners SET settings = JSON_SET(COALESCE(settings, {}), $.dailyLimitMinutes, 5) WHERE id = <id>;` (tắt: đặt lại `null`). Bố mẹ cần có PIN (đặt ở màn chọn hồ sơ, nút Bố mẹ) hoặc dùng mật khẩu tài khoản.
- [ ] Học bình thường vài phút: trang chủ "Hôm nay: x/5 phút · còn N phút" tăng đúng (mỗi phút có thao tác); để tab ở nền hoặc không đụng chuột/phím thì không tăng.
- [ ] Đang học bài khi hết giờ: không bị ngắt giữa câu; xong câu thì chuyển màn "Hết giờ học rồi!" (rồng ngủ, nền đêm, trăng sao, tóm tắt phút/sao/từ mới); mai vào lại học tiếp bài dở.
- [ ] Hết giờ: gõ tay `/home`, `/map/1`, `/lesson/<id>`, `/review`, `/notebook` đều về `/time-up`; `/profiles` vẫn vào được (đổi sang bé khác học được).
- [ ] "Bố mẹ: thêm 10 phút": PIN sai báo "PIN hoặc mật khẩu chưa đúng"; đúng thì về trang chủ, còn 10 phút; sai nhiều lần thì bị khóa tạm.
- [ ] "Chúc Bông ngủ ngon" (Enter) về màn chọn hồ sơ.
- [ ] Không đặt giới hạn (null): không bao giờ chuyển `/time-up`; vào `/time-up` khi chưa hết giờ thì về trang chủ.
- [ ] Sang ngày mới: số phút về 0, phút thêm hết hiệu lực.
