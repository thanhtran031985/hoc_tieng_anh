# Tiến độ — 10-time-limit — Giới hạn giờ học

Trạng thái chung: 🔄 · Cập nhật lần cuối: 03/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|------|-----|------------|---------|
| 0 | Ghi phiên học và tính phút | ✅ | `StudyClock` + `server/study-time.ts` + `rules/study-time.ts` (test 103/103) |
| 1 | Màn Hết giờ học (Screen14) | ⬜ | |

## Nhật ký
### Bước 0 — Ghi phiên học và tính phút (03/10/2026)
- Đã làm: hàm thuần `study-time.ts` (`studyAllowance`, `grantBonus`, `bonusFor`) + test; `bonus` trong `learner-settings.ts`; `src/server/study-time.ts` (`getStudyStatusFor`, `recordStudyMinute` nhận nhịp cách nhau ≥ 50 giây); action `getStudyStatusAction`, `recordStudyMinuteAction`; `StudyClock` trong `(kid)/layout.tsx` (đếm giây khi tab hiện và có thao tác trong 60 giây, gửi nhịp mỗi phút, phần lẻ giữ ở localStorage); bỏ ghi `study_sessions` cuối bài học, dòng phiên ôn thành đánh dấu `minutes: 0`; trang chủ hiện "x/y phút · còn N phút".
- File tạo/sửa: `src/lib/rules/study-time.ts(+test)`, `src/lib/schemas/learner-settings.ts`, `src/server/study-time.ts`, `src/features/study-clock/*`, `src/app/(kid)/layout.tsx`, `src/server/lesson-complete.ts`, `src/server/review.ts`, `src/server/home.ts`, `src/features/home/LevelCard.tsx`.
- Kết quả kiểm tra (DB tạm, CDP, chạy 134 giây có thao tác): `study_sessions` có 2 dòng 1 phút, trang chủ hiện "Hôm nay: 2/10 phút"; phần lẻ 15 giây nằm ở localStorage; lùi các dòng 1 ngày thì trang chủ về "0/10 phút"; không thao tác thì đồng hồ dừng sau 60 giây; `tsc`, `lint`, `npm test` 103/103 sạch.
- Việc tôi cần làm thủ công: không.

## Bước tiếp theo

Bước 1 — Màn Hết giờ học (Screen14)
