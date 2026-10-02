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
