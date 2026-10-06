# Tiến độ — 06-home-map — Trang chủ và bản đồ

Trạng thái chung: ✅ · Cập nhật lần cuối: 03/10/2026

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

Hoàn thành. Checklist test thủ công bên dưới do bạn tự test sau khi đóng task (chưa tích).

### Sửa sau rà soát (03/10/2026)
- Mục 1 (px cố định): `globals.css` thêm `--lift-tile: 3px`, `--sink-tile: 6px`, `--lift-stop: 6px`; `home.module.css`, `levels.module.css`, `island-map.module.css` dùng token (`--lip-flat` cho `±1px`).
- Mục 2 (token thừa): `Stars` dùng `--size-node-star` qua `.stars svg`.
- Mục 3 (chữ "Sắp có"): `IslandEmpty` thêm nhãn "Sắp có" phía trên thẻ trống.
- Kiểm tra: `tsc`, `lint` sạch; ảnh chụp `/map/3` (1440×900, 1366×768), `/map/6`, `/levels`, `/home`: không cuộn, ngôi sao vẫn 20px.
- Mục bổ sung (tìm thấy khi chụp trạng thái tải ở Giai đoạn C): `map/[level]/loading.tsx` truyền `width="100%"` cho khung xương nên các chấm bị kéo giãn, tràn 1962×1395 ở 1440×900. Đã đổi thành `4.6%`; đo lại không cuộn ở 1440×900 và 1366×768.

### Kiểm tra cuối task (03/10/2026, Giai đoạn C)
- `npx tsc --noEmit`, `npm run lint`, `npm test` (50/50), `npm run build` đều sạch.
- Ảnh chụp bằng trang tạm (đã xóa) cho các trạng thái trước đây chưa chụp: bản đồ đang tải, bản đồ lỗi, tổng quan 10 cấp lỗi và đang tải; ở 1440×900 và 1366×768 đều không cuộn.

### Checklist test thủ công (bạn test sau khi đóng task, chưa tích)
Chuẩn bị: database có seed (`npx prisma db seed`), `npm run dev`, đăng nhập, chọn một bé. Để thử các trạng thái cần dữ liệu, chạy SQL (thay `<learner_id>` bằng id của bé trong bảng `learners`):
```sql
-- Bé xong 3 bài đầu của cấp 1 (1–3 sao): chặng sáng lên, bài kế thành "đang học"
INSERT INTO lesson_progress (learner_id, lesson_id, best_stars, attempts, completed_at)
SELECT <learner_id>, l.id, 2, 1, NOW() FROM lessons l JOIN units u ON u.id = l.unit_id JOIN levels lv ON lv.id = u.level_id
WHERE lv.number = 1 AND l.kind = 'lesson' ORDER BY u.sort_order, l.sort_order LIMIT 3;
-- 5 thẻ ôn đến hạn hôm nay
INSERT INTO review_cards (learner_id, word_id, box, due_on)
SELECT <learner_id>, id, 1, CURDATE() FROM words LIMIT 5;
-- Dọn lại: DELETE FROM lesson_progress WHERE learner_id = <learner_id>; DELETE FROM review_cards WHERE learner_id = <learner_id>;
```
- [ ] Trang chủ: bé mới (chưa có dữ liệu) thấy bài đầu tiên và "chưa có từ cần ôn"; không cuộn trang ở 1366×768 và 1440×900.
- [ ] Sau khi chạy SQL: trang chủ hiện "5 từ cần ôn" và "Bài tiếp theo" là bài thứ 4; nhấn Enter đi tới màn "Sắp có" của bài học.
- [ ] Bốn nút Bản đồ, Sổ từ, Bộ sưu tập, Phòng của tớ đều mở được một màn (không 404); Enter ở màn "Sắp có" về trang chủ.
- [ ] Bản đồ cấp 1: 3 chặng đầu hiện sao, chặng 4 đang học (nhịp sáng, rồng đứng trên), các chặng sau khóa và không bấm được; bấm chặng mở thẻ nổi có từ, hình, loa; Esc đóng thẻ.
- [ ] Trận trùm hiện khóa cho tới khi xong mọi chặng của vùng.
- [ ] Hai chip "Vùng 1–4", "Vùng 5–8" chuyển trang bản đồ.
- [ ] Tổng quan 10 cấp (`/levels`): cấp hiện tại có "Bé đang ở đây", cấp sau khóa; bấm cấp khóa ra hộp thoại nhẹ nhàng, không báo đỏ.
- [ ] Bản đồ cấp 5 trở lên (chưa có bài) hiện nhãn "Sắp có" và "Đảo này đang được xây".
- [ ] Gõ `/map/99` ra trang 404; gõ `/map/7` khi bé ở cấp thấp thì về `/levels`.
- [ ] Đổi bé sang hồ sơ khác rồi mở `/home`: không thấy dữ liệu của bé trước.
