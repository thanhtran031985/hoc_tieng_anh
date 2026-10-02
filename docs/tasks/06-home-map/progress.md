# Tiến độ — 06-home-map — Trang chủ và bản đồ

Trạng thái chung: 🔄 · Cập nhật lần cuối: 03/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Quy tắc mở khóa và chuỗi ngày | ✅ | 02/10/2026 |
| 1 | Trang chủ (Screen04) và màn "Sắp có" | ✅ | 02/10/2026 |
| 2 | Tổng quan 10 cấp (Screen05) | ✅ | 02/10/2026 |
| 3 | Bản đồ đảo (Screen06) | ✅ | 03/10/2026 |

## Nhật ký

### Bước 0 — Quy tắc mở khóa và chuỗi ngày (02/10/2026)
- Đã làm: `src/lib/rules/unlock.ts` (`computeLessonStates`, `summarizeUnits`, `findNextLesson`, `levelStatus`), `src/lib/rules/streak.ts` (`streakForDisplay`, `recordStudyDay`, `freezesAvailable`), `src/lib/rules/dates.ts` (`dateOnly` theo múi giờ Việt Nam, `diffDays`, `weekStart`); test `unlock.test.ts`, `streak.test.ts`. Quyết định ghi ở `decisions.md`; kế hoạch lưu ở `plan.md`.
- Kiểm tra: `npm test` 45/45 đạt (33 test mới): bài đầu luôn mở; xong bài (≥ 1 sao) mới mở bài sau; trùm chỉ mở khi xong mọi bài thường và không chặn chủ đề kế; xong hết cấp thì không còn bài tiếp theo; bỏ 1 ngày dùng thẻ nghỉ phép, bỏ 2 ngày hoặc hết thẻ thì chuỗi về 1; sang tuần mới nạp lại thẻ; học 2 lần trong ngày không tăng chuỗi. `npx tsc --noEmit`, `npm run lint` sạch.
- Việc thủ công: không.

### Bước 1 — Trang chủ (Screen04) và màn "Sắp có" (02/10/2026)
- Đã làm: `src/server/home.ts` (`getHomeData`: qua `requireLearner`; thẻ ôn đến hạn, bài tiếp theo, tiến độ cấp, phút học hôm nay, nhiệm vụ hôm nay); `src/app/(kid)/home/{page,loading,error}.tsx`; `src/features/home/` (`MissionCard`, `LevelCard`, `NavTiles`, `HomeHotkeys`, `HomeSkeleton`, `RetryButton`, `home.module.css`); `src/features/kid/` (`KidTopbar` dùng chung các màn của bé, có hộp thoại Cài đặt: Đổi bé, Đăng xuất; `learner-art.ts`; `kid.module.css`); `src/features/levels/` (`level-art.ts` + `LevelArt`, hình đảo/thành phố chép từ Screen05, dùng chung với Bước 2); `src/features/coming-soon/ComingSoon.tsx` và 5 route giữ chỗ `/collection`, `/room`, `/notebook`, `/review`, `/lesson/[lessonId]`; `Mascot` thêm biểu cảm `tiec`, `xaydung` (trích nguyên từ `bundle.js`, 6 biểu cảm cũ khớp từng ký tự); `ButtonLink` thêm `shortcut`; `dates.ts` thêm `dayStartInstant`.
- Token mới trong `globals.css`: `--size-home-side-l|r` (và `-s` cho màn ≤ 1400), `--size-task-icon`, `--size-task-pic`, `--size-mini-pic`, `--mini-pic-overlap`, `--size-isle-h`, `--size-nav-h`, `--size-nav-icon`, `--size-mascot-home`, `--size-mascot-state`, `--shadow-tile`, `--shadow-tile-hover`, `--shadow-tile-active`, `--size-soon-mascot`, `--size-soon-text`, `--size-soon-block`.
- Kiểm tra (database tạm `hoc_tieng_anh_verify` đã seed + 4 bé giả lập, Edge không đầu qua CDP, đã dọn): đủ 4 trạng thái (bình thường, tải, trống cho bé mới, lỗi khoanh trong thẻ nhiệm vụ); 1366×768, 1440×900, 1920×1080 đều không cuộn (scrollHeight = cao cửa sổ); Enter ở trang chủ đi vào `/lesson/<bài tiếp theo>`, Enter khi focus ở "Ôn ngay" thì mở Ôn tập; số ôn tập = thẻ đến hạn (5 thẻ đến hạn + 2 chưa đến hạn → "5 từ cần ôn"); bé chưa chọn hồ sơ hoặc cookie hồ sơ lạ → `/profiles`; mọi nút trang chủ dẫn tới màn "Sắp có" thật, Enter về trang chủ; cấp 6 hiện "Cấp 6 sắp có", bé xong cấp 4 hiện "Bé đã xong cấp này". `tsc`, `lint`, `npm test` (46/46), `build` sạch.
- Việc thủ công: không.

## Bước tiếp theo

Đã sửa 3 mục sau rà soát (Giai đoạn B). Tiếp theo: Giai đoạn C (kiểm tra cuối, checklist test thủ công). Chưa đóng task.

### Sửa sau rà soát (03/10/2026)
- Mục 1 (px cố định): `globals.css` thêm `--lift-tile: 3px`, `--sink-tile: 6px`, `--lift-stop: 6px`; `home.module.css`, `levels.module.css`, `island-map.module.css` dùng token (`--lip-flat` cho `±1px`).
- Mục 2 (token thừa): `Stars` dùng `--size-node-star` qua `.stars svg`.
- Mục 3 (chữ "Sắp có"): `IslandEmpty` thêm nhãn "Sắp có" phía trên thẻ trống.
- Kiểm tra: `tsc`, `lint` sạch; ảnh chụp `/map/3` (1440×900, 1366×768), `/map/6`, `/levels`, `/home`: không cuộn, ngôi sao vẫn 20px.
