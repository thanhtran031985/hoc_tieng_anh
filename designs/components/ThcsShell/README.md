# ThcsShell

Khung trang THCS: menu trái `thcs-sidebar` (248px) thu gọn còn icon `thcs-sidebar-mini` (76px), thanh trên `thcs-topbar` (64px), vùng nội dung tối đa `thcs-content-max` (1200px) căn giữa.

- Menu: Trang chủ, Lộ trình, Học theo SGK, Ngữ pháp, Luyện thi, Ôn tập (kèm số thẻ đến hạn), Sổ từ, Thành tích. Mục đang mở: nền `brand-soft`, chữ `brand-shade`, vạch `brand` bên trái, `aria-current="page"`.
- Khi thu gọn, mỗi icon có `title` và `aria-label`; nút thu gọn có `aria-expanded`.
- Đáy menu: ảnh hồ sơ, tên, lớp và cấp, nút **Đổi hồ sơ**.
- Thanh trên: tiêu đề trang (`thcs-h2`) + chip XP (`xp`, `xp-soft`), chip chuỗi ngày, nút sáng/tối (`aria-pressed`). Không có sao/xu như Tiểu học.
- Màn bài học không có menu: dùng thanh bài học (thoát `Esc`, tiến độ, XP của bài, nút sáng/tối) và chân bài.

**Người dùng cung cấp**: `active`, `title`, `crumb`, `main` (HTML nội dung), `xp`, `streak`, `topRight`.
