# Tiến độ — 10-time-limit — Giới hạn giờ học

Trạng thái chung: 🔄 · Cập nhật lần cuối: 03/10/2026

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

## Bước tiếp theo

Rà soát cuối task (/finish-task).
