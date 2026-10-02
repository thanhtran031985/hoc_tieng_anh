# Button

Nút "kẹo dẻo" 3D: mặt màu + gờ dưới đậm hơn; rê chuột thì nhô lên 2px, nhấn thì lún xuống sát gờ, vô hiệu thì xám phẳng.

**Kiểu (`variant`)**
- `primary` — `brand` / chữ `ink-on-dark`. Một nút chính mỗi màn: *Kiểm tra*, *Tiếp tục*, *Đăng nhập*.
- `secondary` — `surface` + viền `line-strong`. Hành động phụ: *Nghe lại*, *Gợi ý*, *Quay lại*.
- `level` — màu của cấp đang học (`--lv`), chữ `on-level-N`. Dùng trên bản đồ, trang chủ: *Học tiếp*.
- `success` — chỉ trong dải phản hồi đúng.
- `retry` — chỉ trong dải phản hồi chưa đúng; nền cam nhẹ `retry`, chữ `ink`.
- `ghost` — liên kết dạng nút (*Quên mật khẩu?*).

**Cỡ** `l` 64px (bài học), `m` 52px (mặc định), `s` 40px (thanh trên cùng, hàng phụ).

**Phím tắt**: truyền `key: 'Enter'` để gắn nhãn phím ngay trong nút. Nút có nhãn phím phải thật sự phản hồi phím đó.

**Người dùng cung cấp**: `label` (tiếng Việt, động từ đứng đầu, ≤ 2 từ cho bé), `variant`, `size`, `icon` tùy chọn, `disabled`.

Không: đặt hai nút `primary` cạnh nhau; dùng màu đỏ; viết hoa toàn bộ.
