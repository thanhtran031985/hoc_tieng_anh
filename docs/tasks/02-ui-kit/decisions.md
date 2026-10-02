# Quyết định — 02-ui-kit

### 02/10/2026 — Kiểu dáng bằng CSS Modules dùng biến token
- Bối cảnh: `bundle.css` có nhiều trạng thái (hover/active/disabled/focus), `@keyframes` và `prefers-reduced-motion`.
- Quyết định: mỗi component có `<Tên>.module.css` dùng `var(--token)`, chuyển gần 1:1 từ `bundle.css`. Tailwind chỉ dùng cho bố cục trang `/dev/ui`.
- Lý do: viết thành chuỗi class Tailwind khó đọc và khó đối chiếu với thiết kế.

### 02/10/2026 — Không px/hex trong `.tsx` và `.module.css`
- Quyết định: giá trị px của hiệu ứng 3D (gờ, nhô, lún…) chưa có token thì thêm token vào `globals.css` (nhóm elevation/motion) và liệt kê trong báo cáo từng bước.

### 02/10/2026 — Props đổi tên ở những chỗ React bắt buộc
- `key` → `shortcut` (React giữ tên `key`); `attrs` (chuỗi HTML) → thuộc tính HTML thật (spread); `cls` → `className`; `Dialog`/`FeedbackBar` gọi bằng `container` và trả `{close}` → component điều khiển bằng props (`open`, `onClose`).
- Các props còn lại giữ đúng `designs/components/index.d.ts`.

### 02/10/2026 — Vị trí file
- `src/components/ui/<Tên>/<Tên>.tsx` + `.module.css`, xuất gộp ở `src/components/ui/index.ts`; hook ở `src/lib/use-hotkeys.ts`; phát âm ở `src/lib/speech.ts`; trang xem `src/app/dev/ui/page.tsx` (production trả 404, như `/dev-tokens`).

### 02/10/2026 — Token thêm ở Bước 0 (chưa có trong `tokens.json`)
- `globals.css` `:root`: `--lip-flat` 1px, `--lip-s` 4px, `--lip-m` 6px, `--lip-l` 8px (gờ 3D), `--lift` 2px (nhô khi rê chuột), `--sink-s` 3px, `--sink-m` 5px (lún khi nhấn), `--focus-offset` 3px, `--size-key` 26px, `--size-key-in-btn` 24px, `--pad-key` 7px.
- Màu: `--streak-shade` (viền ngọn lửa) và `--star-empty-line` (viền sao rỗng): hai mã hex này nằm cố định trong SVG của `bundle.js`, đã đổi sang token.
- Lý do: CLAUDE.md cấm px/hex cố định trong component; hiệu ứng nút kẹo dẻo cần các số này. Nút phụ (secondary) dùng `calc(var(--lip-m) - var(--lip-flat))` cho gờ 5px.

### 02/10/2026 — Viền focus đặt toàn cục
- `globals.css` có `:focus-visible { outline: --border-thick solid --focus; outline-offset: --focus-offset }`; ô nhập (`input`, `textarea`) dùng `--shadow-focus`. Thay cho lớp `.b-root`/`.scr` của bản xem trước.

### 02/10/2026 — Props và hành vi đã chốt ở Bước 0
- `KeyHint`: nội dung truyền bằng `children`, biến thể `corner` (thay cho `cls="b-key--corner"`); luôn `aria-hidden`.
- `Button`: nhãn qua `label` hoặc `children`; `shortcut` hiển thị `KeyHint` và đặt `aria-keyshortcuts`; mọi thuộc tính `<button>` chuyển tiếp (kể cả `ref`, `data-*`). Trạng thái ép để chụp ảnh dùng `data-state="hover|active|focus"` (chỉ dùng ở `/dev/ui`).
- `IconButton` (nút icon tròn `.b-iconbtn`): bắt buộc `label` (thành `aria-label`).
- `Icon`: 29 icon chép từ `ICONS` vào `icon-paths.ts`; render bằng `dangerouslySetInnerHTML` với chuỗi hằng số (không có dữ liệu người dùng).
- `useHotkeys(map, { enabled })` ở `src/lib/use-hotkeys.ts`: tên phím `"1"`…`"4"`, `"a"`…`"d"`, `Enter`, `Space`, `ArrowLeft`, `ArrowRight`, `Escape`. Bỏ qua khi đang gõ trong `input/textarea/select/contenteditable`, khi giữ Ctrl/Alt/Meta, khi phím lặp. Enter/Space khi focus đang ở nút hoặc liên kết thì bỏ qua (nút tự kích hoạt), tránh gọi hai lần.

### 02/10/2026 — Cách đối chiếu với thiết kế
- Trang tham chiếu tĩnh và trình chụp ảnh Chrome headless (CDP) nằm trong thư mục tạm của phiên, không đưa vào repo. So sánh bằng ảnh chụp và bằng `getComputedStyle` của từng thành phần so với `preview.html`.

### 02/10/2026 — Mascot và WordPicture (Bước 1)
- Nét vẽ rồng (6 biểu cảm) và 22 hình từ vựng được sinh bằng cách chạy `bundle.js` trong Node rồi chép phần ruột `<svg>` vào `src/components/ui/Mascot/dragon-parts.ts` và `src/components/ui/WordPicture/pictures.ts`; giữ nguyên từng nét, không vẽ lại. Render bằng `dangerouslySetInnerHTML` với chuỗi hằng số.
- Hex trong hai file này là màu vẽ của hình (theo `WordPictures/README.md`: "màu bên trong hình minh hoạ là màu vẽ, không phải token giao diện"). Hai file được loại khỏi kiểm tra hex/px. Task 05 (nội dung mẫu cấp 1–2) thêm hình mới bằng cách thêm khóa vào `WORD_PICTURES`.
- Dữ liệu mẫu `Bong.words` (nghĩa, phiên âm, câu ví dụ) và `Bong.topics` không đưa vào component: sẽ lấy từ database.
- Màu rồng: `Mascot` nhận prop `color` (`ngoc|dao|nang|tim`) đặt `data-dragon` trên chính SVG; `globals.css` có `[data-dragon="dao|nang|tim"]` nên đặt một lần trên `<html>` hoặc vùng chứa cũng được (thay cho lớp `dragon-dao`…).
- Hoạt ảnh trong `Mascot.module.css` (`:global(.dg-wave)` v.v. vì ruột SVG là chuỗi HTML). Gốc xoay đổi từ px sang phần trăm khung nhìn 200×210 (69% 62,857143% và 50% 61,904762%), cho kết quả giống hệt. Biên độ nhún/nhảy/thở/lơ lửng là token mới `--dragon-bob|hop|breathe|float`. `prefers-reduced-motion` tắt mọi hoạt ảnh (đã kiểm tra bằng giả lập).
- `WordPicture` với từ chưa có hình hiện khung SVG trống (như bản gốc) để giữ bố cục.

### 02/10/2026 — SpeakerButton và phát âm (Bước 2)
- `src/lib/speech.ts`: `playPronunciation(text, { audioUrl, accent, rate, onEnd })` trả về hàm dừng; `stopPronunciation()`. Có `audioUrl` thì phát tệp, lỗi tải hoặc bị chặn phát thì dùng `speechSynthesis`; không có thì dùng thẳng giọng trình duyệt. Chọn giọng đúng vùng (`en-US` hoặc `en-GB`), không có thì giọng tiếng Anh bất kỳ; tốc độ mặc định 0,82 như bản thiết kế. Mỗi lần phát dừng lần trước. Chọn giọng ở mỗi lần bấm (bản gốc lưu giọng ngay lần đầu, có thể bị rỗng vì danh sách giọng nạp chậm).
- Hiệu ứng vòng sóng chạy theo trạng thái thật (`data-playing` từ lúc bấm tới `onend`/`onerror`/hết tệp), không còn chạy cố định 2 vòng. Trình duyệt không báo lúc đọc xong thì tắt sau `max(1300 ms, 150 ms × số ký tự)`. Giảm chuyển động: vòng đứng yên (độ mờ 0,6) để vẫn biết nút đang phát.
- Giọng Mỹ/Anh và tốc độ là props `accent`, `rate`; màn dùng truyền theo cài đặt hồ sơ (task 11 làm cài đặt). Phím Space = nghe lại là việc của màn bài học (`useHotkeys` rồi bấm nút qua `ref`).
- Token thêm: `--size-speaker-m` 56px. Rời màn thì nút ngừng đọc.

### 02/10/2026 — Card, ChoiceCard, ProgressBar, StatChip, LevelChip, Avatar, Topbar (Bước 3)
- Thêm hai thành phần phụ mà `Topbar` cần: `LevelChip` ("Cấp N · tên cấp", tên cấp truyền từ database) và `Avatar` (ảnh hồ sơ bé; nét vẽ chép từ `HAIR`/`avatar` của `bundle.js` vào `Avatar/avatar-art.ts`, đã kiểm tra tái tạo khớp từng ký tự với bản gốc cho 4 kiểu tóc × cấp 1, 5, 10; màu da/tóc là màu vẽ; nền và áo theo `--level-N`).
- `Topbar` nhận `learner` ({ name, level, levelName, hair }), `onBack`, `title`, `stars/coins/streak` (chip nào không có số thì không hiện), `right`. Bỏ số mẫu 128/340/5 của bản gốc. Container query của bản xem trước (`max-width: 1400px`) đổi thành media query.
- `Card` (`variant` default|soft, `interactive`); `ChoiceCard` là `<button>` với `state` default|selected|correct|retry|dim, `keyHint` (nhãn phím góc trên trái + `aria-keyshortcuts`), dấu ✓ hoặc ↻ tự thêm kèm chữ ẩn "Đúng"/"Chưa đúng, thử lại" cho trình đọc màn hình; `dim` tự `disabled`; `selected` có `aria-pressed`. Kích thước thẻ do màn dùng đặt (bản xem trước đặt 140×150).
- `ProgressBar` giới hạn `value` trong 0..max, có `role="progressbar"` + `aria-label` (mặc định "Tiến độ"). Vệt sáng, đầu bo tính theo chiều cao thanh (`calc`), không chép px.
- `StatChip`: `bump` bật hoạt ảnh nảy; số dùng kiểu chữ `stat`; tên đầy đủ ở `title` và chữ ẩn.
- Giảm chuyển động tắt hoạt ảnh nảy/lắc của thẻ đáp án và chip (bản gốc chỉ rút ngắn chuyển tiếp).
- Token thêm: `--lift-choice` 4px, `--lip-choice-hover` 10px, `--badge-size` 40px, `--badge-offset` 14px, `--shake` 8px, `--size-chip` 48px, `--avatar-ring` 3px, `--size-progress` 20px, `--size-progress-s` 12px, `--progress-shine` và `--skeleton-shine` (trắng trong suốt).
- Lớp tiện ích `sr-only` của Tailwind dùng cho chữ ẩn. Trang `/dev/ui`: Topbar demo tách thành thành phần client (`topbar-demo.tsx`) vì trang server không truyền được hàm `onBack`.

### 02/10/2026 — Dialog, FeedbackBar, DataState, Skeleton (Bước 4)
- Cách điều khiển: `Dialog` và `FeedbackBar` nhận `open` (cha giữ trạng thái) thay cho hàm `Bong.dialog(container, …)`/`Bong.feedback(container, …)` trả về `{close}`. Hai thành phần luôn nằm trong cây DOM và ẩn bằng CSS (`opacity`/`transform` + `visibility`, kèm `inert` khi đóng) để có chuyển cảnh mượt cả lúc mở và đóng mà không cần hẹn giờ gỡ phần tử.
- Vị trí: `position: fixed` (phủ cửa sổ, hoặc phủ khung có `contain: layout` như khung giả lập trên `/dev/ui`) thay cho `position: absolute` trong `.scr` của bản xem trước.
- `Dialog`: đóng bằng nút, Esc hoặc bấm ra ngoài hộp; mở thì focus vào nút đầu tiên, Tab/Shift+Tab vòng trong hộp, đóng thì trả focus về phần tử đã mở. Nút có `shortcut: "Esc"` được chạy khi bấm Esc (bản gốc chỉ đóng hộp); nút `shortcut: "Enter"` được chạy khi bấm Enter lúc focus chưa ở trong hộp. Enter/Esc không lọt ra phím tắt của màn phía sau. `aria-modal`, `aria-labelledby`, `aria-describedby`.
- `FeedbackBar`: `type` ok|retry, `detail` là nội dung React (thường nút loa + từ + phiên âm + nghĩa), mở ra thì focus nút chính, Enter bấm nút (qua `useHotkeys`, nút đang focus tự kích hoạt nên không bị gọi hai lần), `role="status"` + `aria-live="polite"`. Hiệu ứng sao bay từ đáp án vào chip sao (`Bong.burst`) không nằm trong task 02: để task 07 (màn bài học) làm.
- `DataState` (thay `Bong.stateBlock`): `kind` empty|error, rồng mặc định `suynghi` (trống) hoặc `dongvien` (lỗi), nút Thử lại mặc định cho lỗi (`onRetry`, thuộc tính `data-retry`), `role="alert"` (lỗi) hoặc `role="status"` (trống). `Skeleton` (thay `Bong.sk`): `width`, `height` là độ dài CSS (dùng token hoặc %), `radius` theo token, vệt sáng chạy; tắt khi giảm chuyển động. Quá 8 giây chuyển sang Lỗi là việc của màn dùng.
- Media query dùng mốc 1400px (rộng) và 800px (cao) giống bản xem trước đổi từ container query: biến CSS không dùng được trong media query nên đây là chỗ duy nhất còn px trong `.module.css`.
- Token thêm: `--size-dialog` 540px, `--size-state-text` 560px, `--dialog-mascot-lift` 110px, `--size-feedback-min-h` 132px, `--size-feedback-mascot` 112px, `--feedback-mascot-lift` 64px.
- `/dev/ui`: mục thử phím tắt chỉ bật khi bấm nút "Bật thử phím tắt", để không tranh Enter/Esc với hộp thoại và dải phản hồi.

### 02/10/2026 — Bản giải nén `goi-du-an/` không đưa vào kho
- Bối cảnh: trong lúc làm Bước 4, thư mục `goi-du-an/` (bản giải nén của `goi-du-an.zip`) và hai tệp `prompt-1-tieuhoc.md`, `prompt-2-thcs.md` xuất hiện ở thư mục gốc; lệnh `git add -A` của commit Bước 4 đã đưa chúng vào kho và đẩy lên GitHub (commit `fe2c142`).
- Quyết định: gỡ cả ba khỏi kho (`git rm --cached`, tệp trên đĩa còn nguyên), thêm `goi-du-an/` vào `.gitignore` (như `goi-du-an.zip`), loại khỏi ESLint và `tsc` (bản sao `bundle.js` gây 5 cảnh báo lint). Hai tệp `prompt-*.md` chỉ gỡ khỏi kho, chưa ignore: anh/chị quyết định có giữ trong kho hay không. Từ nay commit bằng danh sách tệp cụ thể, không dùng `git add -A`.
