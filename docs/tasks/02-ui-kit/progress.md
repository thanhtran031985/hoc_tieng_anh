# Tiến độ — 02-ui-kit — Bộ thành phần giao diện Tiểu học

Trạng thái chung: 🔄 · Cập nhật lần cuối: 02/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Button, KeyHint, Icons | ✅ | Trang xem: /dev/ui |
| 1 | Mascot và WordPicture | ✅ | Trang xem: /dev/ui |
| 2 | SpeakerButton | ⬜ | |
| 3 | Card, thẻ đáp án, ProgressBar, StatChip, Topbar | ⬜ | |
| 4 | Dialog, FeedbackBar, DataStates, khung xương | ⬜ | |

## Nhật ký

### Bước 0 — Button, KeyHint, Icons (02/10/2026)
- Tạo `src/components/ui/{Icon,KeyHint,Button,IconButton}` (mỗi cái `.tsx` + `.module.css`), `index.ts`, `src/lib/cn.ts`, `src/lib/use-hotkeys.ts`, trang `src/app/dev/ui/page.tsx` + `hotkeys-demo.tsx`. Thêm token và quy tắc focus toàn cục vào `globals.css` (chi tiết ở `decisions.md`).
- Kiểm tra:
  - `/dev/ui` hiện 6 kiểu nút × 5 trạng thái (thường, rê chuột, nhấn, vô hiệu, focus), 3 cỡ, nút có icon, nút icon tròn, nhãn phím, 29 icon. Ảnh chụp 1440×900 giống bản xem trước.
  - So `getComputedStyle` của 25 nút (5 kiểu × 5 trạng thái) với `Button/preview.html`: 0 khác biệt (cao, rộng, đệm, cỡ chữ, bóng, màu nền, màu chữ, bo góc, khoảng cách).
  - Bấm Tab: nút nhận viền focus 4px màu `--focus`, cách 3px.
  - Phím tắt: 1, B, ←/→, Esc, Space, Enter chạy khi không focus ô nhập; Enter khi focus ở nút chỉ tính 1 lần; gõ trong ô nhập không kích hoạt.
  - Không có hex/px nào trong `src/components`, `src/lib`, `src/app/dev` (chỉ còn trong chú thích và chữ mô tả). `tsc`, `lint` không lỗi.
- Token thêm: xem `decisions.md` (gờ, nhô, lún, nhãn phím, hai màu viền icon).
- Việc cần làm thủ công: mở `http://localhost:3000/dev/ui`, rê chuột/nhấn thử nút và bấm Tab.

### Bước 1 — Mascot và WordPicture (02/10/2026)
- Tạo `src/components/ui/Mascot` (`Mascot.tsx`, `.module.css`, `dragon-parts.ts`) và `src/components/ui/WordPicture` (`WordPicture.tsx`, `.module.css`, `pictures.ts`); thêm mục Rồng Bông và Hình từ vựng vào `/dev/ui`; thêm token `--dragon-bob|hop|breathe|float` và `[data-dragon]` vào `globals.css`.
- Kiểm tra:
  - 6 biểu cảm × 4 màu hiển thị đúng, so ảnh chụp với `Mascot/preview.html` (cùng nét vẽ, cùng màu); 22 hình từ vựng đúng như `WordPictures/preview.html`.
  - Giả lập `prefers-reduced-motion: reduce`: `animation-name` của rồng và tay vẫy là `none`; tắt giả lập thì chạy lại (`bob`, `wave`).
  - Không hex/px ngoài hai file nét vẽ (màu vẽ của hình). `tsc`, `lint` không lỗi.
- Token thêm: `--dragon-bob` 6px, `--dragon-hop` 16px, `--dragon-breathe` 2px, `--dragon-float` 6px.
- Việc cần làm thủ công: mở `/dev/ui`, xem rồng nhún/vẫy tay và thử bật "giảm chuyển động" của hệ điều hành.

## Bước tiếp theo

Bước 2 — SpeakerButton (kế hoạch ở `plan.md`).
