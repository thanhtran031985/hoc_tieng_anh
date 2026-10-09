# Tiến độ — 13-gd2-ui-kit — Bộ thành phần GĐ2 và khung bài học mới

Trạng thái chung: 🔄 · Cập nhật lần cuối: 09/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Token và hằng số GĐ2 | ✅ | 165 biến vào `globals.css`, `COINS`/`WORDLAB` vào `constants.ts`; test Playwright `01-` chưa chạy (chờ bố/mẹ đồng ý reset DB test) |
| 1 | Rồng Bông lớn lên (MascotGrowth) | ✅ | Mascot có prop `stage`, thêm `MascotGrowth`; 40/40 hình khớp bundle.js |
| 2 | Chữ bấm được và khung trò chơi | ✅ | `ClickableWords`, 3 hộp thoại game, `GameFoot`, `GameFrame`; trang thử `/dev/game` |
| 3 | Hộp quà nhận thưởng (RewardPopup) | ⬜ | |
| 4 | Công cụ bài học (LessonTools) và học tập trung | ⬜ | |
| 5 | Âm thanh hiệu ứng và nhạc nền | ⬜ | |

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

## Bước tiếp theo

Bước 3 — Hộp quà nhận thưởng (RewardPopup).
