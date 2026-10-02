# Tiến độ — 06-home-map — Trang chủ và bản đồ

Trạng thái chung: 🔄 · Cập nhật lần cuối: 02/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Quy tắc mở khóa và chuỗi ngày | ✅ | 02/10/2026 |
| 1 | Trang chủ (Screen04) và màn "Sắp có" | ⬜ | |
| 2 | Tổng quan 10 cấp (Screen05) | ⬜ | |
| 3 | Bản đồ đảo (Screen06) | ⬜ | |

## Nhật ký

### Bước 0 — Quy tắc mở khóa và chuỗi ngày (02/10/2026)
- Đã làm: `src/lib/rules/unlock.ts` (`computeLessonStates`, `summarizeUnits`, `findNextLesson`, `levelStatus`), `src/lib/rules/streak.ts` (`streakForDisplay`, `recordStudyDay`, `freezesAvailable`), `src/lib/rules/dates.ts` (`dateOnly` theo múi giờ Việt Nam, `diffDays`, `weekStart`); test `unlock.test.ts`, `streak.test.ts`. Quyết định ghi ở `decisions.md`; kế hoạch lưu ở `plan.md`.
- Kiểm tra: `npm test` 45/45 đạt (33 test mới): bài đầu luôn mở; xong bài (≥ 1 sao) mới mở bài sau; trùm chỉ mở khi xong mọi bài thường và không chặn chủ đề kế; xong hết cấp thì không còn bài tiếp theo; bỏ 1 ngày dùng thẻ nghỉ phép, bỏ 2 ngày hoặc hết thẻ thì chuỗi về 1; sang tuần mới nạp lại thẻ; học 2 lần trong ngày không tăng chuỗi. `npx tsc --noEmit`, `npm run lint` sạch.
- Việc thủ công: không.

## Bước tiếp theo

Bước 1: trang chủ (Screen04), `KidTopbar`, màn "Sắp có" và biểu cảm `tiec`, `xaydung` của Mascot.
