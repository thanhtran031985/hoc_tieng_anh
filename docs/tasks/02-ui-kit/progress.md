# Tiến độ — 02-ui-kit — Bộ thành phần giao diện Tiểu học

Trạng thái chung: 🔄 · Cập nhật lần cuối: 02/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Button, KeyHint, Icons | ✅ | Trang xem: /dev/ui |
| 1 | Mascot và WordPicture | ✅ | Trang xem: /dev/ui |
| 2 | SpeakerButton | ✅ | Trang xem: /dev/ui |
| 3 | Card, thẻ đáp án, ProgressBar, StatChip, Topbar | ✅ | Thêm LevelChip, Avatar |
| 4 | Dialog, FeedbackBar, DataStates, khung xương | ✅ | Thêm Skeleton |

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

### Bước 2 — SpeakerButton (02/10/2026)
- Tạo `src/components/ui/SpeakerButton` (`.tsx`, `.module.css`), `src/lib/speech.ts`; thêm mục Nút loa vào `/dev/ui` (3 cỡ, câu ví dụ, giọng Anh, tệp âm thanh, trạng thái đang phát) và token `--size-speaker-m`.
- Kiểm tra (chạy trong Chrome headless, `speechSynthesis.speak` được thay bằng bản ghi để đo):
  - Bấm nút "dog" gọi đọc đúng chữ `dog`, `lang=en-US`, `rate=0.82`; bấm câu ví dụ đọc đúng `I eat an apple.`; nút giọng Anh đọc `en-GB`.
  - Có `audioUrl` thì phát tệp (không gọi giọng đọc).
  - Đang phát: `data-playing`, vòng sóng (`::after` có hoạt ảnh `ring`, độ mờ đổi); đọc xong thì vòng tắt. Giảm chuyển động: vòng đứng yên, độ mờ 0,6.
  - `aria-label`: "Nghe: <từ>" mặc định, hoặc nhãn riêng ("Nghe câu hỏi", "Nghe câu ví dụ").
  - Không hex/px trong code mới; `tsc`, `lint` không lỗi.
- Việc cần làm thủ công: mở `/dev/ui`, bấm các nút loa và nghe giọng thật (Chrome/Edge); nghe giọng trên máy học sinh vì danh sách giọng phụ thuộc hệ điều hành.

### Bước 3 — Card, thẻ đáp án, ProgressBar, StatChip, Topbar (02/10/2026)
- Tạo `src/components/ui/{Card,ChoiceCard,ProgressBar,StatChip,LevelChip,Avatar,Topbar}` (mỗi cái `.tsx` + `.module.css`; `Avatar` có thêm `avatar-art.ts`), mục mới trên `/dev/ui` (thẻ, thẻ đáp án 6 trạng thái, thanh tiến độ, chip thống kê, 3 thanh trên cùng, ảnh hồ sơ), `topbar-demo.tsx`, token mới trong `globals.css` (xem `decisions.md`).
- Kiểm tra:
  - Thẻ đáp án đủ trạng thái: thường, rê chuột, đang chọn, đúng (✓ + nảy), chưa đúng (↻ + lắc), mờ; ảnh chụp 1440×900 khớp `Card/preview.html`.
  - So `getComputedStyle` với bản xem trước: thẻ đáp án 5 trạng thái, thẻ nội dung, 3 chip, thanh tiến độ — màu viền, màu nền, bóng, bo góc, đệm, khoảng cách, cỡ chữ, độ mờ, `transform` đều khớp (chỉ khác kích thước do bố cục của trang xem và hoạt ảnh bật lên, bản xem trước tắt hoạt ảnh).
  - Nét vẽ avatar tái tạo khớp từng ký tự với `Bong.avatar` (4 kiểu tóc × 3 cấp).
  - Không hex/px/rgba trong code mới (ngoài nét vẽ và chữ mô tả); `tsc`, `lint` không lỗi.
- Việc cần làm thủ công: mở `/dev/ui`, rê chuột/nhấn thẻ đáp án, bấm Tab qua thẻ.

### Bước 4 — Dialog, FeedbackBar, DataStates, khung xương (02/10/2026)
- Tạo `src/components/ui/{Dialog,FeedbackBar,DataStates,Skeleton}` (`DataStates/DataState.tsx`), mục mới trên `/dev/ui` (`overlays-demo.tsx`, khung giả lập màn hình), token mới (xem `decisions.md`), sửa `hotkeys-demo.tsx` thành bật/tắt.
- Kiểm tra (Chrome headless):
  - Dialog: mở thì focus vào "Học tiếp"; Tab 4 lần xoay vòng Nghỉ đã → Học tiếp → Nghỉ đã → Học tiếp (không ra ngoài hộp); Shift+Tab đi ngược; Esc đóng, chạy nút "Esc" (log "Nghỉ đã") và trả focus về nút "Mở hộp thoại"; Enter trên nút "Học tiếp" chạy và đóng; đóng xong hộp có `inert`.
  - FeedbackBar: mở thì trượt lên (`translateY(0)`) và focus vào nút "Tiếp tục"; Enter đóng (trượt xuống 115%, `inert`, ẩn); dải Chưa đúng cũng vậy; Enter khi focus ở body vẫn bấm được nút chính.
  - DataStates: Trống có rồng suy nghĩ, tiêu đề, một câu, một nút (`role="status"`); Lỗi có rồng động viên và nút Thử lại (`role="alert"`, bấm chạy `onRetry`); khung xương đang tải có vệt sáng chạy.
  - Ảnh chụp 1440×900 của hộp thoại và dải Đúng khớp `Dialog/preview.html`, `FeedbackBar/preview.html`.
  - Không hex/px/rgba trong code mới (trừ hai mốc media query); `tsc`, `lint` không lỗi.
- Việc cần làm thủ công: mở `/dev/ui`, thử hộp thoại bằng bàn phím (Tab, Esc, Enter) và dải phản hồi.

## Bước tiếp theo

Kiểm tra cuối task: `tsc`, `lint`, `build`, so `/dev/ui` với từng `preview.html` ở 1440×900 và 1366×768, rồi chạy quy trình `finish-task`.
