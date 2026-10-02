# AdultShell

Khung khu người lớn: `Bong.A.shell({ area: 'parent' | 'admin', active, title, crumb, kids, actions, main })`.

- Menu trái tối `adm-side-bg` rộng `adm-sidebar` (240px); chữ `adm-side-ink` (9.9:1), mục đang mở `adm-side-active` + vạch `adm-side-accent`; focus trong menu dùng `adm-side-focus`.
- Thẻ chuyển khu Bố mẹ / Quản trị; khối người dùng + Đăng xuất ở đáy.
- Thanh trên cao `adm-topbar` (56px): đường dẫn nhỏ, tiêu đề `adm-h1`, chọn con (`kids: true`), nút phụ và nút “Về màn chọn hồ sơ” (`data-profiles`, mở hộp thoại xác nhận).
- Nội dung rộng tối đa `adm-content-max`, lưới 12 cột `.a-grid` + `.a-s3…a-s12`.

**Người dùng cung cấp**: `area`, `active`, `title`, `crumb`, `kids`, `actions`, `main`.
