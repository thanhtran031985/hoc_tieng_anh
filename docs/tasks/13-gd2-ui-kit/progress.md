# Tiến độ — 13-gd2-ui-kit — Bộ thành phần GĐ2 và khung bài học mới

Trạng thái chung: 🔄 · Cập nhật lần cuối: 09/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Token và hằng số GĐ2 | ✅ | 165 biến vào `globals.css`, `COINS`/`WORDLAB` vào `constants.ts`; test Playwright `01-` chưa chạy (chờ bố/mẹ đồng ý reset DB test) |
| 1 | Rồng Bông lớn lên (MascotGrowth) | ⬜ | |
| 2 | Chữ bấm được và khung trò chơi | ⬜ | |
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

## Bước tiếp theo

Bước 1 — Rồng Bông lớn lên (MascotGrowth). Chờ "continue".
