# Quyết định — 13-gd2-ui-kit — Bộ thành phần GĐ2 và khung bài học mới

Ghi các quyết định đã chốt, thay đổi so với task.md và vấn đề phát sinh.

| Ngày | Quyết định | Lý do |
|---|---|---|
| 09/10/2026 | Token GĐ2 chỉ thêm vào `:root` của `globals.css`, không ánh xạ vào `@theme inline` (không có class Tailwind `bg-gift-box`…). | Giống cách thêm token THCS/người lớn ở GĐ1: component dùng `var(--…)` trong CSS module. Cần class Tailwind cho token nào thì thêm khi component đó cần. |
| 09/10/2026 | Số token mới là 165 (135 màu + 24 size + 6 duration), không phải 166 như `task.md`. | Đếm lại bằng cách so khối `:root` mục 15 của `DESIGN_SYSTEM.md` với `globals.css`. |
| 09/10/2026 | Hằng số `COINS`/`WORDLAB` viết dạng camelCase (`stickerLesson`, `priceFurnitureS`, `linksMaxDepth`…), bỏ tiền tố `coin-`. | Hợp văn phong TypeScript; test `constants.test.ts` ánh xạ từ tên token trong `tokens.json` nên không lệch. |
| 09/10/2026 | Nhãn đọc màn hình "dáng cấp N" thêm cho mọi dáng được truyền `stage`, kể cả dáng 3. | `bundle.js` bỏ nhãn ở dáng 3; README MascotGrowth và Kiểm tra Bước 1 đều yêu cầu nhãn có "dáng cấp N", nên làm đồng nhất. Không truyền `stage` thì nhãn như cũ. |
| 09/10/2026 | `dragon-parts.ts` chia thành đoạn thay vì một chuỗi mỗi biểu cảm. | Dáng theo cấp đặt biến đổi riêng cho đuôi, cánh, thân và đầu (như `bundle.js`); ghép lại dáng gốc vẫn ra đúng hình cũ. |
| 09/10/2026 | `GameFrame` đặt ở `src/features/lesson/`, còn `ClickableWords`, các hộp thoại game và `GameFoot` ở `src/components/lesson/`. | `GameFrame` ghép `LessonFrame` và `ExitDialog` của feature bài học (đang dùng chung `lesson.module.css` với 5 màn khác), chuyển sang `components/` sẽ phải tách css đang chia sẻ. Các phần không phụ thuộc feature thì ở `components/lesson/` đúng như task.md. |
| 09/10/2026 | Hộp thoại game không đóng khi bấm ra ngoài (`closeOnBackdrop={false}`). | Bản thiết kế chỉ đóng bằng nút hoặc Esc; bé đang chơi không lỡ bấm ra ngoài mà bỏ qua bảng kết thúc. |
| 09/10/2026 | Esc ở lớp phủ bắt đầu = Bắt đầu; Esc ở bảng kết thúc = Tiếp tục; Esc ở Tạm dừng = Chơi tiếp. | Đúng `onEsc` của `loverlay` trong bundle.js. |
| 09/10/2026 | `RewardPopup` bỏ hiệu ứng sao bay khi mở quà (còn hộp lắc, tia sáng, rồng chúc mừng). | `burstStars` bay về thanh tiến độ của bài học, hộp quà có thể mở ở màn không có thanh đó; sao bay chỉ là trang trí. Thêm sau nếu bố/mẹ muốn. |
| 09/10/2026 | Tên tiếng Anh, nghĩa và hình của phần thưởng truyền qua props; không có bảng `STICKER_WORDS` cứng như bundle.js. | CLAUDE.md: nội dung học nằm trong database, không viết cứng vào component. |

### 09/10/2026 — Test token đang đỏ trước khi làm task này
- `tests/e2e/01-nen-tang.spec.ts` ("mọi token màu dạng hex ... khớp designs/tokens.json") đang hỏng vì thiếu 108 token GĐ2 trong theme (xem `29-fix-ui-findings/decisions.md`). Thêm token vào theme ở bước đầu của task này và chạy lại `npx playwright test 01-`; test phải đạt, không nới test.
