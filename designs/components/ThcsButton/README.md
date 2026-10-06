# ThcsButton

Nút phẳng, gọn của bộ THCS: bo `thcs-radius-md`, chữ `thcs-button`, cao tối thiểu `thcs-control` (44px) và `thcs-control-l` (52px) trong bài học.

- `primary` — `brand` / `on-brand` (sáng 5.97:1, tối 7.04:1). Một nút chính mỗi vùng: *Học tiếp*, *Kiểm tra*, *Nộp bài*.
- `secondary` — `surface` + viền `line-strong`: *Gợi ý*, *Nghe lại*, *Về lộ trình*.
- `ghost` — liên kết dạng nút: *Bỏ qua*, *Xem tất cả*.
- `level` — màu cấp (`--lv`): nút vào thành phố/chủ đề.
- `success` / `retry` — chỉ trong dải phản hồi.
- Trạng thái: rê chuột đổi nền (`brand-hover`, `surface-soft`), nhấn lún 1px, vô hiệu `surface-sunk` + `ink-disabled`, focus viền 3px `focus` cách 2px.
- Gắn phím bằng `key: 'Enter'` — nhãn phím nằm trong nút và nút có `aria-keyshortcuts`.

**Người dùng cung cấp**: `label`, `variant`, `size` (`l` | mặc định | `s`), `icon`, `key`, `disabled`, `attrs`.
