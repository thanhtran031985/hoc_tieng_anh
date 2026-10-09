# Tiến độ — 13-gd2-ui-kit — Bộ thành phần GĐ2 và khung bài học mới

Trạng thái chung: ✅ · Cập nhật lần cuối: 09/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Token và hằng số GĐ2 | ✅ | 165 biến vào `globals.css`, `COINS`/`WORDLAB` vào `constants.ts`; test Playwright `01-` chưa chạy (chờ bố/mẹ đồng ý reset DB test) |
| 1 | Rồng Bông lớn lên (MascotGrowth) | ✅ | Mascot có prop `stage`, thêm `MascotGrowth`; 40/40 hình khớp bundle.js |
| 2 | Chữ bấm được và khung trò chơi | ✅ | `ClickableWords`, 3 hộp thoại game, `GameFoot`, `GameFrame`; trang thử `/dev/game` |
| 3 | Hộp quà nhận thưởng (RewardPopup) | ✅ | `RewardPopup`, `GiftBox`, `Sticker`, `Medal` ở `src/components/rewards/` |
| 4 | Công cụ bài học (LessonTools) và học tập trung | ✅ | `LessonTools`, `LessonCrumb`, `useFocusMode`, `SoundProvider`; đã nối vào `LessonPlayer` |
| 5 | Âm thanh hiệu ứng và nhạc nền | ✅ | `src/lib/sound.ts` (Web Audio + nhạc nền + hạ nhạc khi giọng đọc chạy), `sound-effects.ts` (hàm thuần) |

## Nhật ký

### Bước 0 — 09/10/2026
- `src/app/globals.css`: thêm 165 biến vào cuối khối `:root` (135 màu, 24 size, 6 duration), chia 13 nhóm theo Gd2/Gd3/Gd4Tokens. 22 màu dạng `{tên}` viết thành `var(--tên)`. Chỉ thêm, không dòng cũ nào đổi (`git diff` 0 dòng xóa/sửa).
- `src/lib/rules/constants.ts` (mới): `COINS` (10 giá trị) và `WORDLAB` (6 giá trị); `constants.test.ts` đối chiếu từng giá trị với `designs/tokens.json`.
- `/dev/ui`: thêm mục "Token GĐ2" (`gd2-tokens.tsx`, `gd2-token-names.ts`): màu hiện ô màu, size/thời lượng hiện giá trị đọc từ trang.
- Kiểm tra: `tsc` ✅, `lint` ✅, `npm test` 189/189 ✅ (có 3 test hằng số mới), `build` ✅. Trên dev server cổng 3100 bằng Edge không đầu: 245 token màu hex của `/login` khớp `tokens.json` (0 sai, cùng phép so như test `01-`), không token nào trống; `/dev/ui` hiện đủ 165 token ở 1366×768 và 1920×1080, không lỗi console, không cuộn ngang.
- **Chưa chạy** `npx playwright test 01-`: bộ test cần `npm run test:e2e:db` (có `prisma migrate reset --force` trên `hoc_tieng_anh_test`), bố/mẹ chọn bỏ qua. Cần bố/mẹ tự chạy `npm run test:e2e:db` rồi `npx playwright test 01-` để xác nhận test token hết đỏ.
- Việc phát sinh: `.next/dev/types/routes.d.ts` bị hỏng (tệp sinh ra, không theo dõi git) làm `tsc` báo lỗi; đã xóa thư mục `.next/dev/types`, `next dev` tự sinh lại. MySQL của XAMPP chưa chạy nên tôi đã bật (`mysqld --standalone`), đang chạy nền.

### Bước 1 — 09/10/2026
- `dragon-parts.ts` (tạo lại bằng script từ `bundle.js`): đổi từ chuỗi cả hình sang các đoạn (đuôi, cánh đuôi, hai cánh, thân, đầu, phụ kiện, vị trí búa) để dáng theo cấp đặt lại tỉ lệ từng phần. Ghép lại ở dáng gốc ra đúng từng ký tự như trước (8/8 biểu cảm).
- `dragon-stages.ts` (mới): 4 dáng 1, 2, 4, 5 (`DSTAGE` của bundle) và `dragonMarkup(expr, stage)`. Đối chiếu với `Bong.dragon(expr, 200, { stage })` chạy từ `bundle.js`: 40/40 (8 biểu cảm × 5 dáng) giống từng ký tự.
- `Mascot` thêm prop `stage` (1–5), nhãn đọc màn hình thêm ", dáng cấp N"; `MascotGrowth` (mới) là lớp mỏng `stage` + `expr` (mặc định chào). Xuất ở `@/components/ui`. Các chỗ đang dùng `<Mascot>` không đổi.
- `src/lib/rules/mascot-stage.ts` (mới, kèm test): `stageForLevel(cấp)`: cấp 1–5 → dáng 1–5, cấp 6–10 giữ dáng 5.
- `/dev/ui` có mục "Rồng Bông lớn lên": chọn 8 biểu cảm và 4 màu, hiện 5 dáng cạnh nhau.
- Kiểm tra: `tsc` ✅, `lint` ✅, `npm test` 196/196 ✅ (thêm 7 test), `build` ✅. Edge không đầu ở 1366×768 và 1920×1080: 5 dáng hiện đúng, nhãn "Rồng Bông chào, dáng cấp N", không lỗi console, không cuộn ngang; xem tay các cặp biểu cảm × màu chào/ngọc, đang xây/nắng, ngủ/tím, chúc mừng/đào đều đúng thiết kế.
- Chưa nối `stageForLevel` vào màn nào (task 20 làm "rồng Bông lớn lên" theo cấp trên trang chủ); bước này chỉ có thành phần và hàm quy tắc.
- Test Playwright vẫn chưa chạy (cần reset DB test, chờ bố/mẹ đồng ý).

### Bước 2 — 09/10/2026
- `src/components/lesson/` (mới): `ClickableWords` (mỗi chữ là một nút; bấm thì đọc đúng chữ và hiện bong bóng "loa · chữ · nghĩa" 2,6 giây; nhãn đọc màn hình có nghĩa), `GameStartDialog` / `GamePauseDialog` / `GameEndDialog`, `GameFoot` (Bông + lời nhắn, Nghe lại Space, Gợi ý H, điểm).
- `Dialog` (task 02) mở rộng, không đổi cách dùng cũ: thêm `art` (hình tuỳ ý nhô lên mép hộp), `size="game"` (rộng hơn), `closeOnBackdrop`, và `icon` cho nút.
- `src/features/lesson/GameFrame.tsx` (mới): bắt đầu → chơi → tạm dừng → kết thúc, ghép `LessonFrame` + `ExitDialog`. `LessonFrame` thêm prop `onPause` (nút ⏸ "Tạm dừng (Esc)"). `children({ running })` để trò chơi dừng chuyển động và phím tắt khi chưa bắt đầu, đang tạm dừng, đang hỏi thoát hoặc đã xong.
- `src/lib/rules/sentence-words.ts` (mới, có test): tách câu thành chữ, chữ thường và dấu câu.
- Trang thử `/dev/game` (chỉ khi phát triển) và mục "Chữ bấm được và chân bài trò chơi" ở `/dev/ui`.
- Token thêm vào `globals.css` (liệt kê theo CLAUDE.md): `--size-dialog-game: 560px`, `--dialog-art-lift: 96px` (hộp thoại game rộng hơn và hình nhô lên 96px, lấy từ `.b-dialog--game` và `.b-ov2__how` của bundle.css).
- Kiểm tra: `tsc` ✅, `lint` ✅, `npm test` 199/199 ✅, `build` ✅. Edge không đầu ở 1366×768 trên `/dev/game`, 25 điều kiện đều đạt: Enter bắt đầu; bấm "bird" thì `speechSynthesis.speak` nhận đúng "bird" và hiện "con chim"; Space, H chạy khi đang chơi; Esc mở Tạm dừng và game dừng; Esc lần nữa chơi tiếp; nút ⏸ mở Tạm dừng; Thoát mở "Dừng bài học?" (hộp tạm dừng ẩn), Esc ở đó ở lại rồi quay về Tạm dừng; ✕ mở "Dừng bài học?"; Dừng lại gọi `onExit`; đủ điểm mở bảng kết thúc, Enter = Tiếp tục; không cuộn; không lỗi console. Dùng toàn bằng bàn phím.

### Bước 3 — 09/10/2026
- `src/components/rewards/` (mới): `RewardPopup` (2 bước trên một `Dialog`), `GiftBox` (đóng/mở nắp kèm tia sáng), `Sticker` (hình từ vựng trong khung cắt bế; là nút khi có `onClick`), `Medal` (huy hiệu: vòng vàng, lõi màu cấp, ruy-băng). Nét vẽ chép từ `rgift`/`rmedal`/`rsticker` trong `bundle.js`; màu theo token `gift-*`, `badge-*`, `sticker-*`.
- `RewardPopup` nhận `kind` ("sticker" kèm `word`/`src`, hoặc "badge" kèm `icon`/`level`/`cond`), `en`, `vi`, `coins` (mặc định `COINS.stickerLesson` = 10 hoặc `COINS.badge` = 50), `skipGift`, `onAdd`. Tên tiếng Anh và nghĩa do nơi gọi truyền vào (lấy từ database), không viết cứng trong component.
- `Dialog` thêm `size="reward"`. Icon thêm 15 hình GĐ2 vào `icon-paths.ts` (gift, expand, shrink, volume, mute, flag, medal, island, bag, rotate, box, shirt, print, snow, sunrise): chép từ `bundle.js`, các bước sau dùng tiếp.
- Token thêm vào `globals.css`: `--size-dialog-reward: 600px`, `--size-sticker-reward: 140px`, `--size-reward-glow: 260px` (lấy từ `.b-rw .b-dialog--game`, `.b-rw__stk .b-stk`, `.b-rw__glow` của bundle.css).
- `/dev/ui` có mục "Hộp quà nhận thưởng (RewardPopup)": nút mở thử sticker và huy hiệu, kèm hộp quà đóng/mở, sticker (có, mới, trống), huy hiệu (đã nhận, chưa nhận).
- Kiểm tra: `tsc` ✅, `lint` ✅, `npm test` 199/199 ✅, `build` ✅. Edge không đầu ở 1366×768, 15 điều kiện đạt: Enter, bấm hộp, nút "Mở quà" và Esc đều mở quà; tên "cat" tự đọc đúng 1 lần (`speechSynthesis.speak`); hiện nghĩa, "+10 xu" (huy hiệu "+50 xu" kèm điều kiện đã đạt); Enter, Esc hoặc bấm nút "Cho vào bộ sưu tập" đều gọi `onAdd` đúng một lần; bật giảm chuyển động thì `animation-name` của hộp quà là `none` (bình thường có lắc); không lỗi console.
- Không có sao bay (`Bong.burst`) khi mở quà: chỉ còn tia sáng và hộp lắc, vì hiệu ứng sao bay hiện có (`burstStars`) bay về thanh tiến độ, không áp dụng cho hộp quà.

### Bước 4 — 09/10/2026
- `src/components/lesson/`: `LessonTools` (nút Học tập trung F và nút Âm thanh; bảng âm thanh dưới nút loa có công tắc Nhạc nền, Hiệu ứng, thanh kéo Âm lượng ← → mỗi 10%, chú thích "Giọng đọc tiếng Anh luôn bật"), `FocusBadge`, `LessonCrumb` (thanh đường dẫn Đảo › Chủ đề › Bài kèm ảnh bé và số phút học hôm nay), hook `useFocusMode` (Fullscreen API).
- Cài đặt âm thanh: `learnerSettingsSchema` thêm `musicOn` (mặc định bật) và `volume` 0–100 (mặc định 70); `soundOn` có sẵn của bố mẹ chính là công tắc Hiệu ứng. `soundSettingsSchema` (Zod dùng chung) kiểm dữ liệu gửi lên. `src/features/sound/`: `saveSoundSettingsAction` (kiểm đăng nhập và hồ sơ đang chọn thuộc tài khoản, chỉ ghi 3 trường, giữ phần còn lại của `learners.settings`) và `SoundProvider`/`useSound` (áp dụng ngay, lưu sau 400 ms, lưu nốt khi rời màn).
- Nối vào bài học: `LessonFrame` thêm `crumb`, `extra`, `focus`; `LessonPlayer` dùng F bật/tắt, Esc thoát học tập trung trước rồi Esc lần nữa mới hỏi "Dừng bài học?"; trang bài học bọc `SoundProvider` với cài đặt của hồ sơ. `getLessonPlay` trả thêm `levelName`; `StudyClock` đưa `usedMinutes`/`limitMinutes` ra `useStudyClock()`.
- Token thêm: `--size-lesson-crumb`, `--size-sound-panel`, `--size-switch-w/-h/-knob`, `--size-range-track/-thumb` (lấy từ `.crumb`, `.b-snd`, `.b-switch`, `.b-range` của thiết kế).
- `/dev/ui` có mục "Công cụ bài học (LessonTools) và thanh đường dẫn" (kể cả công tắc Nhạc nền mờ khi chưa có tệp nhạc).
- Kiểm tra: `tsc` ✅, `lint` ✅, `npm test` 202/202 ✅ (thêm 3 test cài đặt âm thanh), `build` ✅. Edge không đầu, hồ sơ "Mai Linh" ở `/lesson/220` (cấp 3): 1366×768 và 1920×1080 không cuộn; F vào học tập trung (toàn màn hình thật, ẩn đường dẫn, nhãn "Đang học tập trung · Esc để thoát", nút đổi thành "Thoát học tập trung (Esc)"); Esc 1 thoát học tập trung mà chưa mở hộp thoại, Esc 2 mở "Dừng bài học?"; bảng âm thanh đóng bằng Esc (focus về nút loa, không mở "Dừng bài học?") hoặc Tab ra ngoài; ← ← đổi 70 → 50 mà không chạy phím tắt bài học; sau 1 giây `learners.settings` có `volume: 50, soundOn: false` và vẫn giữ giới hạn giờ; tải lại trang bảng hiện đúng 50% và Hiệu ứng tắt; không lỗi console. Đã khôi phục `settings` của hồ sơ thử.
- Chưa chạy Playwright (cần reset DB test): các test bài học `07-` có thể cần cập nhật nếu chúng giả định khung bài không có thanh đường dẫn.

### Bước 5 — 09/10/2026
- `src/lib/rules/sound-effects.ts` (hàm thuần, có test): nốt của 4 hiệu ứng (`correct`, `retry`, `coin`, `gift`), đường cong âm lượng, độ to hiệu ứng và nhạc nền (nhạc nhỏ hơn, còn 30% khi giọng đọc chạy), chọn tệp nhạc. Tiếng "chưa đúng" nhỏ và mềm hơn tiếng "đúng" (không phạt).
- `src/lib/sound.ts` (chỉ chạy trên trình duyệt): `playSfx` tạo tiếng bằng Web Audio (không cần tệp); nhạc nền là `HTMLAudioElement` lặp, chờ thao tác đầu tiên của bé nếu trình duyệt chưa cho phát, hạ/nâng từ từ (250 ms) theo giọng đọc. Mặc định tắt cho tới khi `SoundProvider` nạp cài đặt, nên màn nào chưa có cài đặt (ôn tập, xếp lớp) vẫn im lặng như trước.
- `src/lib/speech.ts` thêm `onSpeaking`/`isSpeaking` để biết giọng đọc đang chạy; giọng đọc không phụ thuộc cài đặt âm thanh.
- `src/server/music.ts`: `getMusicSrc()` lấy tệp âm thanh đầu tiên trong `public/media/music/` (đã tạo thư mục với `.gitkeep`); trang bài học truyền xuống `SoundProvider`. Chưa có tệp thì `musicAvailable` false: công tắc Nhạc nền mờ kèm "Chưa có nhạc nền".
- Nối hiệu ứng: tiếng đúng cùng chỗ sao bay (`burstStars`); tiếng chưa đúng ở `ChoiceFeedback` (sai, xem đáp án), ghép cặp và lật thẻ; `RewardPopup` phát tiếng mở quà rồi tiếng xu. `/dev/ui` mục hộp quà bọc `SoundProvider` để nghe thử.
- Kiểm tra: `tsc` ✅, `lint` ✅, `npm test` 209/209 ✅ (thêm 7 test), `build` ✅. Edge không đầu ở `/lesson/220` (hồ sơ Mai Linh): chưa có tệp nhạc thì công tắc Nhạc nền mờ kèm chú thích, không phát nhạc; trả lời đúng thì tạo đúng 2 nốt (mỗi tiếng sai thêm 2 nốt); tắt Hiệu ứng thì không tạo nốt nào mà `speechSynthesis.speak` vẫn chạy khi bấm nút loa; thêm tệp WAV thử vào `public/media/music` thì nhạc phát lặp, âm lượng 0,098 (70%), giọng đọc chạy thì hạ còn 0,029 rồi nâng lại 0,098 khi xong, công tắc tắt thì nhạc dừng, bật lại thì phát tiếp; ở `/dev/ui` mở quà tạo 6 nốt (gift 4 + xu 2); không lỗi console. Đã xóa tệp WAV thử và khôi phục `settings` hồ sơ thử.
- Nhạc nền: xem mục "Nhạc nền đi kèm" bên dưới. Muốn đổi bài khác thì bỏ tệp mp3/ogg/wav/m4a vào `public/media/music/` (lấy tệp đầu tiên theo tên).

## Rà soát khi /finish-task — 09/10/2026

| Mục | Đánh giá | Bằng chứng |
|---|---|---|
| Quyết định kiến trúc (vị trí component, token chỉ thêm, âm thanh Web Audio, cài đặt trong `learners.settings`, Esc học tập trung trước) | ✅ | Xem bảng bước và `decisions.md` (ghi các khác biệt nhỏ: 165 thay vì 166 token, `GameFrame` ở `src/features/lesson/`) |
| Bước 0–5 theo `task.md` | ✅ | 209/209 test đơn vị, kiểm bằng Edge không đầu từng bước |
| Zod dùng chung cho ghi DB | ✅ | `soundSettingsSchema` ở `src/lib/schemas/learner-settings.ts`, dùng trong `src/features/sound/actions.ts` |
| Kiểm quyền hồ sơ bé | ✅ | `saveSoundSettingsAction`: `requireUser` + `requireActiveLearner`, chỉ ghi 3 trường |
| Không Prisma/secret trong client component | ✅ | `grep` ở `components/lesson`, `components/rewards`, `features/sound`: 0 kết quả |
| Không hex/px cứng | ✅ | `grep` hex: 0. Còn `px` trong `@media (max-width/height)` (điểm ngắt, như phần còn lại của dự án) và `transform-origin` theo toạ độ SVG |
| Nội dung học không viết cứng | ✅ | Tên, nghĩa, hình phần thưởng và nghĩa chữ bấm được truyền qua props |
| `tsc`, `lint`, `build` | ✅ | cả ba chạy không lỗi |
| Test Playwright | ❓ (hoãn) | Thêm `tests/e2e/13-gd2-ui-kit.spec.ts` (5 test, đã `--list` và `tsc`/`eslint` sạch); **chưa chạy** vì cần reset `hoc_tieng_anh_test` |

Giai đoạn A không có mục nào cần sửa. Màn thật dùng lại các test bài học ở `07-`/`chung` (các test này không dựa vào thứ đã đổi: thanh đường dẫn không có chữ dạng `mm:ss`, nút "Thoát bài học" và Esc vẫn như cũ).

## Kiểm tra thủ công (checklist)
- [ ] (Hoãn, xem decisions.md) `npm run test:e2e:db` rồi `npx playwright test 13- 01- 07- chung` (tắt `npm run dev` trước): `01-` hết đỏ, `13-` đạt, `07-`/`chung` không hỏng vì thanh đường dẫn mới. Hỏng thì báo tôi sửa.
- [x] Mở một bài học (bé đang đăng nhập): có thanh "Đảo › Chủ đề › Bài", hai nút tròn ở góc phải (Học tập trung, Âm thanh).
- [x] Bấm F: vào toàn màn hình, mất thanh đường dẫn, có nhãn "Đang học tập trung · Esc để thoát". Esc thoát; Esc lần nữa mới hỏi "Dừng bài học?".
- [x] Nút loa: bật/tắt Nhạc nền và Hiệu ứng, kéo Âm lượng bằng ← →; tải lại trang vẫn giữ. Nghe thử nhạc nền (45 giây, lặp) và tiếng đúng/chưa đúng/xu/mở quà: có vừa tai, không quá to không.
- [x] Giọng đọc tiếng Anh vẫn đọc khi tắt hết âm thanh.
- [x] (Chỉ khi chạy `npm run dev`) `/dev/ui` và `/dev/game`: xem rồng 5 dáng, hộp quà, chữ bấm được, khung trò chơi.

## Bước tiếp theo

Hoàn thành. Bố/mẹ báo "test ok" (09/10/2026); chạy Playwright hoãn tới khi xong hết các task.

## Kiểm tra cuối task — 09/10/2026
- `npx tsc --noEmit`, `npm run lint`, `npm run build` chạy không lỗi; `npm test` 209/209 (task này thêm 20 test: hằng số, tách câu, dáng rồng, dáng theo cấp, cài đặt âm thanh, hiệu ứng).
- `/dev/ui` ở 1366×768 và 1920×1080: đủ 5 mục mới (rồng lớn lên, chữ bấm được + chân bài game, công cụ bài học, hộp quà, token GĐ2), không cuộn ngang, không lỗi console. `/dev/game` thử đủ luồng khung trò chơi.
- Bài GĐ1 thật (`/lesson/220`, hồ sơ Mai Linh) bật học tập trung bằng F ở 1366×768 và 1920×1080: vừa màn hình không cuộn, ẩn thanh đường dẫn, nhãn "Đang học tập trung · Esc để thoát".
- Việc cần bố/mẹ làm tay: (1) chạy `npm run test:e2e:db` rồi `npx playwright test` (cần đồng ý reset `hoc_tieng_anh_test`): test `01-` (token) phải hết đỏ, và các test bài học `07-` có thể cần chỉnh vì khung bài học nay có thêm thanh đường dẫn và 2 nút công cụ; (2) nghe thử nhạc nền và tiếng hiệu ứng trên loa thật (nhạc nền đã có sẵn, xem bên dưới).

## Nhạc nền đi kèm — 09/10/2026
- `public/media/music/nhac-nen-nhe.wav` (45,7 giây, mono 22,05 kHz, 1,9 MB): giai điệu hộp nhạc trên nền 4 hợp âm Am – F – C – G, 84 nhịp/phút, do tôi soạn bằng code nên không vướng bản quyền. Nốt ghi vòng quanh bộ đệm nên phần đuôi nối liền phần đầu, lặp lại không bị ngắt. Sinh lại bằng `node scripts/make-background-music.mjs <đường dẫn .wav>`.
- Kiểm tra: công tắc Nhạc nền hết mờ và bật; nhạc phát lặp ở `/lesson/220`, giải mã được (không lỗi), âm lượng 0,098 ở mức 70%. Tôi chỉ kiểm bằng số liệu và trình duyệt, chưa nghe bằng tai: bố/mẹ nghe thử, nếu chưa vừa ý (nhanh, to, giai điệu) thì bảo tôi chỉnh hoặc thay tệp khác.
