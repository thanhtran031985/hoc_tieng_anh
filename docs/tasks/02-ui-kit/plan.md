# Kế hoạch task 02-ui-kit — Bộ thành phần giao diện Tiểu học

## Context
Task 01 đã xong (Next.js 16 + Tailwind v4 + token trong `src/app/globals.css`, font, Prisma). Task 02 chuyển các hàm `window.Bong` trong `designs/components/bundle.js|css` thành React component dùng lại được cho mọi màn (task 04–12 sẽ dùng). Đã tạo nhánh `feat/02-ui-kit` từ `main` và copy `progress.md`, `decisions.md` từ `_template/` (chưa điền). Làm lần lượt Bước 0 → 4 trong `task.md`; sau mỗi bước: tự kiểm tra, cập nhật `progress.md`, chạy `npm run tasks:dashboard`, báo cáo, đề xuất commit `02-ui-kit: step N — …`, DỪNG chờ "continue". Cuối task: `tsc`, `lint`, `build` sạch, so `/dev/ui` với từng `preview.html` ở 1440×900 và 1366×768, đổi README task 02 thành ✅.

## Cách làm chung (ghi vào `decisions.md` khi bắt đầu Bước 0)
1. **Kiểu dáng: CSS Modules** (`Button.module.css`…) dùng biến CSS của token, chuyển gần 1:1 từ `bundle.css` (có sẵn hover/active/disabled, `@keyframes`, `prefers-reduced-motion`). Tailwind chỉ dùng cho bố cục trang `/dev/ui`. Lý do: bundle.css có nhiều trạng thái + keyframes, khó đọc nếu viết thành chuỗi class Tailwind.
2. **Không px/hex trong `.tsx` và `.module.css`.** Giá trị px của hiệu ứng 3D (gờ 4/6/8px, nhô 2px, lún 5px…) chưa có token → thêm token vào `globals.css` (nhóm "elevation/motion", vd `--lip-s`, `--lip-m`, `--lift`, `--press`), liệt kê trong báo cáo từng bước (đúng quy tắc CLAUDE.md). Cỡ nút/loa/topbar dùng token `--size-*` đã có; cỡ chữ dùng `--text-*`.
3. **Props theo `designs/components/index.d.ts`, chỉ đổi những chỗ React bắt buộc** (ghi vào `decisions.md`): `key` → `shortcut` (React giữ `key`); `attrs` (chuỗi) → spread thuộc tính HTML thật; `cls` → `className`; `label` → `children`/`label` (giữ `label`); hàm trả chuỗi HTML → component. `Dialog`/`FeedbackBar` (gọi bằng `container`, trả `{close}`) → component điều khiển bằng props `open`/`onClose`.
4. **Icon và rồng Bông là SVG tách thành component**, giữ nguyên path/nét từ `bundle.js` (`ICONS`, `dragon`, `PICS`). Icon: một map `ICON_PATHS` + `<Icon name size />` (màu `currentColor`; `star|starEmpty|coin|flame` màu cố định từ token). Không dùng emoji làm icon.
5. **Vị trí file:** `src/components/ui/<Tên>/<Tên>.tsx` + `.module.css`, `src/components/ui/index.ts` xuất gộp; hook `src/lib/use-hotkeys.ts`; bản xem tại `src/app/dev/ui/page.tsx` (production trả `notFound()`, như `/dev-tokens`). Component tương tác có `"use client"`.
6. **Truy cập:** viền focus `--focus` 4px khi Tab, `aria-label` cho nút chỉ có icon, `KeyHint` `aria-hidden` + `aria-keyshortcuts` trên điều khiển, tôn trọng `prefers-reduced-motion`. Trước khi viết code đọc `node_modules/next/dist/docs/01-app` mục Client Components nếu cần (Next 16 có thay đổi).
7. **Đối chiếu thiết kế:** dựng trang tham chiếu tĩnh trong scratchpad (token `:root` + `bundle.css` + `bundle.js` + thân `preview.html`), chụp ảnh cùng cỡ cửa sổ bằng trình duyệt headless như Bước 2, so với `/dev/ui`.

## Các bước
**Bước 0 — Button, KeyHint, Icons** (đọc `Button`, `KeyHint`, `Icons` README + preview)
- `Icons`: `Icon` component + 28 icon từ `ICONS` trong bundle.js.
- `KeyHint`: `<kbd>` (`b-key`, biến thể `corner` đặt góc trên trái thẻ).
- `Button`: 6 kiểu (`primary|secondary|level|success|retry|ghost`) × 3 cỡ (`l` 64, `m` 52, `s` 40) × trạng thái thường/rê chuột/nhấn/vô hiệu/focus; `icon`, `shortcut`, `block`, `disabled`. Cũng port `.b-iconbtn` (nút icon tròn, Topbar cần ở Bước 3).
- `useHotkeys`: 1–4, Enter, Space, ←/→, Esc; không chạy khi đang gõ trong `input/textarea/select/contenteditable`; demo trên `/dev/ui`.
- `/dev/ui`: bảng 6 kiểu × 4 trạng thái (ép trạng thái bằng thuộc tính `data-state` để chụp được rê chuột/nhấn), hàng cỡ, nút có icon, nhãn phím, bảng icon.
- Kiểm tra: đủ 6 kiểu × 4 trạng thái, viền focus khi Tab, giống `Button/preview.html` (ảnh so sánh).

**Bước 1 — Mascot và WordPicture:** `Mascot` (6 biểu cảm `chao|vui|dongvien|suynghi|ngu|chucmung`, 4 màu `ngoc|dao|nang|tim` qua lớp/thuộc tính vùng chứa, animation theo biểu cảm), `WordPicture` (`PICS` + `WORDS`, bỏ dữ liệu mẫu `Bong.words` khỏi component — chỉ giữ các path SVG). Kiểm tra: 6×4 hiển thị đúng; `prefers-reduced-motion` thì đứng yên.

**Bước 2 — SpeakerButton:** 3 cỡ `l|m|s`; phát mp3 nếu có `audio`, ngược lại `speechSynthesis` (en-US/en-GB theo cài đặt, `rate` 0.82 như bundle); vòng sóng `is-playing`; `aria-label` mặc định "Nghe: <word>". Hàm đọc đặt ở `src/lib/speech.ts`. Kiểm tra: bấm đọc đúng từ, có vòng sóng, có `aria-label`.

**Bước 3 — Card, thẻ đáp án, ProgressBar, StatChip, Topbar:** `Card` (`default|soft|hover`), `ChoiceCard` (trạng thái thường, rê chuột, đang chọn, đúng ✓, chưa đúng ↻, mờ; `KeyHint` góc), `ProgressBar` (màu cấp `--lv`, cỡ `s`), `StatChip` (`stars|coins|streak`), `Topbar` (+ `LevelChip`, `Avatar` nếu thiết kế cần). Kiểm tra: thẻ đáp án đủ trạng thái.

**Bước 4 — Dialog, FeedbackBar, DataStates, khung xương:** `Dialog` (giữ focus trong hộp, Esc đóng và trả focus, nút Enter), `FeedbackBar` (trượt lên, Enter bấm nút, `role="status"`), `DataStates` (Trống/Lỗi, rồng tương ứng, `Skeleton`). Kiểm tra: focus trap, Esc, Enter, đủ Trống và Lỗi.

## File chính sẽ tạo/sửa
- Tạo: `src/components/ui/{Icon,KeyHint,Button,Mascot,WordPicture,SpeakerButton,Card,ProgressBar,StatChip,Topbar,Dialog,FeedbackBar,DataStates}/…`, `src/components/ui/index.ts`, `src/lib/use-hotkeys.ts`, `src/lib/speech.ts`, `src/app/dev/ui/page.tsx`.
- Sửa: `src/app/globals.css` (thêm token elevation/motion nếu thiếu), `docs/tasks/02-ui-kit/{progress,decisions,plan}.md`, `docs/tasks/README.md` (cuối task).
- KHÔNG sửa `designs/`. Không cài package mới (không cần; nếu cần sẽ hỏi trước).

## Tái dùng
`designs/components/bundle.js` (`ICONS`, `icon`, `dragon`, `PICS`, `say`, `btn`, `key`), `bundle.css` (nút, thẻ, chip, dragon, dialog…), `index.d.ts` (props), token trong `globals.css` (`--size-*`, `--lv*`, `--dragon-*`, `--shadow-*`, `--duration-*`, `--z-*`).

## Kiểm tra
Mỗi bước: mở `/dev/ui` (`npm run dev`), chụp ảnh headless 1440×900 và 1366×768, so với bản tham chiếu `preview.html`; `grep` không có hex/px trong `src/components/ui`; `npx tsc --noEmit` + `npm run lint`. Cuối task thêm `npm run build` (và `/dev/ui` trả 404 ở production).
