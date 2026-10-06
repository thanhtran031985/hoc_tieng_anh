# Kế hoạch — 06-home-map — Trang chủ và bản đồ

## Context
Task 05 đã nạp 10 cấp, 90 chủ đề (cấp 1–4 `published`), 900 từ, 154 bài vào database. Bé đăng nhập, chọn hồ sơ (task 04) rồi vào `/home` — hiện chỉ là trang giữ chỗ. Task này dựng trang chủ, tổng quan 10 cấp và bản đồ đảo để bé thấy nhiệm vụ hôm nay và chọn bài. Bài học thật (task 07) và Sổ từ/Ôn tập (task 08) chưa có, nên các nút đi tới đó mở màn "Sắp có".

Dựa trên bản thiết kế đã cập nhật: `Screen04-Home`, `Screen05-Levels`, `Screen06-IslandMap`, `Screen22-ComingSoon`, `MascotMore`, `StatChip`, `LevelColors` (đã đọc `README.md` + `preview.html`).

## Hiện trạng đã kiểm tra
- `src/app/(kid)/home/page.tsx` là giữ chỗ; `(kid)/layout.tsx` gọi `requireUser()`; `requireActiveLearner()` ở `src/server/active-learner.ts`.
- Đọc lộ trình: `src/server/curriculum.ts` (`listStages/listLevels/listUnits/listLessons`, mặc định chỉ `published`). Kết quả học: `src/server/progress.ts` (`listLessonProgress`, `listDueReviewCards(userId, learnerId, today)`), mọi hàm đi qua `requireLearner`.
- Bảng có sẵn: `learners` (`stars, coins, streakDays, streakFreezes, lastStudyDate, currentLevelId, settings.dailyGoalMinutes`), `lesson_progress(bestStars, completedAt)`, `review_cards(dueOn)`, `study_sessions(minutes)`. Không cần migration.
- UI có sẵn (`src/components/ui`): `Topbar`, `StatChip`, `LevelChip`, `Avatar`, `Card`, `Button/ButtonLink` (có biến thể `level`?), `ProgressBar`, `Bubble`, `Dialog`, `DataState`, `Skeleton`, `SpeakerButton`, `WordPicture`, `Mascot`; icon `map, book, gem, house, gear, replay, clock, crown, lock, star` đủ. `Mascot` chưa có biểu cảm `tiec`, `xaydung`.
- Mẫu `loading.tsx` / `error.tsx` ở `(kid)/profiles/`; CSS Modules dùng biến token; test bằng `node --test` (mẫu `lesson-builder.test.ts`).
- Một chủ đề có 3–6 bài thường + 1 trận trùm (`unit_test`); mỗi cấp 1–4 có 8 chủ đề; cấp 5–10 chưa có chủ đề `published`.

## Quyết định (sẽ ghi vào decisions.md)
1. **Bố cục đảo — 2 trang × 4 vùng** (bạn đã chọn): giữ nguyên bản vẽ 4 vùng của thiết kế. Mỗi cấp có trang "Vùng 1–4" và "Vùng 5–8" (hai chip ở đầu bản đồ); mở bản đồ thì tự vào trang chứa bài đang học. Vùng = chủ đề (unit), chặng = bài thường, trùm = bài `unit_test`. Số chặng 3–6 mỗi vùng được rải đều dọc đường đi của vùng (đường cong có sẵn trong thiết kế); cấp chỉ có một vùng thì không hiện chip.
2. **Quy tắc mở khóa (PRD Phần F):** chuỗi tuyến tính trên các bài thường của cấp theo (thứ tự chủ đề, thứ tự bài). Bài đầu luôn mở; bài k mở khi bài k−1 đạt ≥ 1 sao. Trận trùm mở khi xong mọi bài thường của chủ đề **nhưng không chặn** bài đầu của chủ đề kế (bé không bị kẹt vì trùm; phù hợp "không phạt khi sai"). Bố mẹ mở khóa tay và bài thi lên cấp thuộc task 09/11.
3. **Cấp trên tổng quan:** cấp < cấp hiện tại của bé = "đã qua"; = "đang học"; > = "còn khóa" (bấm → hộp thoại nhẹ nhàng giải thích). Cấp đã qua/đang học vào được bản đồ; cấp chưa có chủ đề `published` (5–10) hiện "Sắp có" thay cho bản đồ (đúng trạng thái trống của thiết kế: "Đảo này đang được xây"). Xong hết cấp: trang chủ báo "Bài thi lên cấp sắp có" — chuyển cấp là việc task 09/11, không tự chuyển ở đây.
4. **Chuỗi ngày:** hàm thuần `streak.ts` làm hai việc: `streakForDisplay` (chuỗi hiển thị, đứt thì về 0 nhẹ nhàng) và `recordStudyDay` (tính chuỗi mới khi bé học xong một bài/lượt ôn). Thẻ nghỉ phép 1/tuần: bỏ đúng 1 ngày thì dùng thẻ, giữ chuỗi; bỏ ≥ 2 ngày thì về 1. Thẻ tự nạp lại về 1 khi sang tuần mới (tuần bắt đầu thứ Hai, tính theo `lastStudyDate`) — không cần cột mới. Ghi vào DB (`recordStudyDay`) do task 07/08 gọi khi hoàn thành bài; task 06 chỉ **đọc** để hiển thị. Ngày tính theo múi giờ `Asia/Ho_Chi_Minh` (hàm `dateOnly`).
5. **Màn "Sắp có" dùng chung:** một component `ComingSoon` (rồng `xaydung`, nhãn "Sắp có", tiêu đề, một câu nhắn, nút Về trang chủ (Enter)) với các biến thể nội dung; route mỏng `/collection`, `/room` (hai biến thể của thiết kế) và `/notebook`, `/review`, `/lesson/[lessonId]` dùng cùng component, để mọi nút trên trang chủ/bản đồ đều có đích thay vì 404. Task 07/08 thay các route này bằng màn thật.
6. **Mascot:** thêm `tiec` và `xaydung` vào `src/components/ui/Mascot` (chép nét vẽ từ `designs/components/bundle.js`, màu theo token `dragon-hat`, `dragon-tool`… đã có ở `globals.css`). `tiec` chưa dùng ở task này (dành cho hộp thoại thoát bài, task 07) nhưng nằm trong cùng thành phần MascotMore.
7. **Không cài package mới; không động `designs/`.** Token thiếu (nếu có) thêm vào `globals.css` và liệt kê trong báo cáo.

## Các bước

### Bước 0 — Quy tắc mở khóa và chuỗi ngày (hàm thuần + test)
- `src/lib/rules/unlock.ts`: `computeLessonStates(lessons, bestStarsByLessonId)` → trạng thái từng bài (`done | current | locked`, kèm số sao) và từng trùm (`locked | open | beaten`); `summarizeUnits(...)` → số bài xong, tổng sao (tối đa 3 × số bài) mỗi chủ đề, vùng khóa nếu bài đầu khóa; `findNextLesson(states)` → bài tiếp theo (bài thường đang học, hết thì trùm đang mở chưa thắng, hết nữa thì `null`); `levelStatus(levelNumber, currentLevelNumber)` → `past | current | locked`.
- `src/lib/rules/streak.ts` + `src/lib/rules/dates.ts`: `dateOnly(date, tz)`, `isoWeekStart`, `streakForDisplay`, `recordStudyDay`.
- Test `unlock.test.ts`, `streak.test.ts` (`node --test`, `npm test`).
- Kiểm tra: bài đầu luôn mở; xong bài thì mở bài sau (≥ 1 sao; 0 sao thì không); xong mọi bài thường mới mở trùm; trùm không chặn chủ đề kế; xong hết cấp → `findNextLesson` null; bỏ 1 ngày dùng thẻ nghỉ phép (giữ chuỗi, thẻ về 0), bỏ 2 ngày về 1, sang tuần mới nạp lại thẻ, học 2 lần trong ngày không tăng chuỗi, chuỗi hiển thị 0 khi đã đứt.

### Bước 1 — Trang chủ (Screen04)
- Server: `src/server/home.ts` `getHomeData(userId, learner)` (qua `requireLearner`): số thẻ ôn đến hạn + 3 từ mẫu (ảnh), bài tiếp theo (chủ đề, số chặng đã xong/tổng), tiến độ cấp (chặng đã qua/tổng), phút học hôm nay (từ `study_sessions`) so với mục tiêu ngày nếu có. Truy vấn gom lại, không N+1.
- `src/app/(kid)/home/page.tsx` (Server Component) + `loading.tsx` + `error.tsx`; `src/features/home/*`: `MissionCard` (Ôn tập, Bài tiếp theo), `LevelCard` (hòn đảo + tiến độ + mục tiêu ngày), `NavTiles` (4 nút lớn: Bản đồ, Sổ từ, Bộ sưu tập, Phòng của tớ → `/map`, `/notebook`, `/collection`, `/room`), lời chào trong `Bubble`; `KidTopbar` (client, dùng chung ở các màn bé: ảnh, tên, nhãn cấp, sao, xu, chuỗi hiển thị, nút cài đặt/quay lại).
- Hotkey Enter = Học tiếp (`useHotkeys`, bỏ qua khi focus đang ở nút). Lỗi chỉ khoanh trong thẻ nhiệm vụ (thanh trên, rồng, 4 nút vẫn dùng được); trạng thái trống cho bé mới (bài đầu + "chưa có từ cần ôn").
- Kiểm tra: đủ 4 trạng thái (bình thường, đang tải, trống, lỗi); Enter đi vào bài tiếp theo; số ôn tập đúng số `review_cards` đến hạn (thử 0, 5, thẻ chưa đến hạn không tính); bé chưa chọn hồ sơ bị đưa về `/profiles`.

### Bước 2 — Tổng quan 10 cấp (Screen05)
- `src/server/map.ts` `getLevelsOverview(userId, learner)`: 10 cấp (số, tên, trạng thái, có nội dung chưa).
- `src/app/(kid)/levels/page.tsx` + `loading.tsx` + `error.tsx`; `src/features/levels/*`: nền biển, con đường qua 5 đảo Tiểu học (hàng dưới) và 5 thành phố THCS (hàng trên), điểm dừng (đã qua ✓, đang học có vầng sáng + ảnh bé + "Bé đang ở đây", khóa xám + ổ khóa), nhãn "số cấp · tên" luôn hiện, chú giải; bấm cấp khóa → `Dialog` nhẹ nhàng; bấm cấp mở → `/map/[n]`.
- Kiểm tra: bé ở cấp 3 → cấp 1–2 ✓, cấp 3 đang học, 4–10 khóa; mỗi điểm có số và tên; bấm cấp khóa không chặn gắt; 4 trạng thái.

### Bước 3 — Bản đồ đảo (Screen06)
- Server: `getIslandMap(userId, learner, levelNumber)`: chủ đề `published` của cấp, bài (thường + trùm), kết quả học, từ của mỗi bài (từ các bước `word_card`) cho thẻ nổi.
- `src/app/(kid)/map/page.tsx` (chuyển tới cấp hiện tại), `src/app/(kid)/map/[level]/page.tsx` (+ `loading`, `error`; `params` là Promise theo bản Next này — đọc `node_modules/next/dist/docs` trước khi viết); `src/features/island-map/*`: nền đảo SVG, 4 vùng/trang với màu vùng, đường đi, chặng (xong: màu cấp + 1–3 sao bên dưới; đang học: `brand`, nhịp sáng, rồng đứng trên; khóa: xám + ổ khóa), trùm (ô bo 32%, vương miện; khóa/mở/đã thắng), nhãn vùng (số, tên Việt, tên Anh, sao x/y hoặc ổ khóa), chip chuyển trang, thẻ nổi của chặng (từ + hình + loa, nút Bắt đầu/Học lại → `/lesson/[id]`; chặng khóa: lời nhắn nhẹ; trùm khóa: "Xong các chặng của vùng … là mở trận trùm nhé!").
- Bàn phím: Esc đóng thẻ nổi, Enter bắt đầu, Tab đi qua các chặng; chặng khóa là `aria-disabled` và không bấm vào bài. Tự mở thẻ của chặng đang học như bản xem trước.
- Trống: cấp chưa có bài → "Đảo này đang được xây" + nút mở Sổ từ.
- Kiểm tra: chặng xong hiện đúng số sao; chặng khóa không bấm được; trùm khóa đến khi xong mọi chặng của vùng; trang 2 mở khi bé học đến chủ đề 5+; cấp 5–10 hiện "Sắp có"; 4 trạng thái; không có từ nào hiện ở chặng khóa ngoài lời nhắn.

### Màn "Sắp có" + Mascot (làm kèm Bước 1, vì nút trang chủ cần đích)
- `src/features/coming-soon/ComingSoon.tsx`, 5 route mỏng ở mục quyết định 5; thêm `tiec`, `xaydung` vào `Mascot`.
- Kiểm tra: mỗi nút trên trang chủ/bản đồ dẫn tới một màn thật, không 404; Enter về trang chủ.

## Quy ước sau mỗi bước
Theo workflow đã chốt: tự chạy phần Kiểm tra, cập nhật `progress.md` + `npm run tasks:dashboard`, commit `06-home-map: step N — …`, push `origin feat/06-home-map`, rồi chuyển bước kế. Không dừng giữa các bước trừ khi gặp quyết định mơ hồ. Cuối task: `npx tsc --noEmit`, `npm run lint`, `npm run build`, `npm test`, rồi `/finish-task`.

## Việc khởi đầu sau khi duyệt kế hoạch
- Tạo nhánh `feat/06-home-map` (từ `feat/05-content-l1-l4`, bạn đã đồng ý), README dòng 06 → 🔄.
- Copy `docs/tasks/_template/` → `progress.md`, `decisions.md` của task; lưu kế hoạch này vào `plan.md`; `npm run tasks:dashboard`.

## Rủi ro, ghi chú
- Thiết kế vẽ cố định 5 chặng/vùng, dữ liệu có 3–6: dùng đường cong của vùng, rải điểm đều theo độ dài; kiểm bằng ảnh chụp với vùng 3 và 6 chặng.
- Học xong cả cấp chưa chuyển được cấp (chờ bài thi lên cấp, task 09/11); trang chủ nói rõ thay vì để bé thấy trống.
- Chuỗi ngày chưa được ghi tới khi task 07 gọi `recordStudyDay`; hiện chỉ hiển thị.
- Dữ liệu thử trên giao diện cần database có seed; kiểm bằng database tạm (như task 05) với bé và `lesson_progress` giả lập, xóa sau khi xong. Không động tới database `hoc_tieng_anh` của bạn.

## Kiểm tra cuối task
`npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build` sạch; xem 4 trạng thái của 3 màn ở 1366×768, 1440×900 và 1920×1080 (Edge không đầu, database tạm); `/home`, `/levels`, `/map/[n]` không có dữ liệu của hồ sơ khác tài khoản (thử hồ sơ không thuộc tài khoản → về `/profiles`).
