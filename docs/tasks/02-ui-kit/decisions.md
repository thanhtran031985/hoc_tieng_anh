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
