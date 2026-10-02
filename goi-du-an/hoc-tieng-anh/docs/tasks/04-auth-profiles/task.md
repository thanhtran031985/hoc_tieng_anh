# 04-auth-profiles — Đăng nhập gia đình và hồ sơ bé

Ngày tạo: 02/10/2026 · Giai đoạn: GĐ1 · Phụ thuộc: 02, 03 · Nhánh: `feat/04-auth-profiles`

## Mục tiêu
Bố mẹ đăng ký, đăng nhập tài khoản gia đình; chọn hoặc tạo hồ sơ bé; khóa khu vực bố mẹ bằng PIN.

## Phạm vi
- Trong: đăng ký, đăng nhập, đăng xuất; màn chọn hồ sơ; tạo hồ sơ 3 bước (tên + lớp, chọn rồng, kiểm tra loa và micro); đặt PIN bố mẹ lần đầu; cổng PIN; nhớ đăng nhập.
- Ngoài: trang tổng quan bố mẹ (task 11), bộ giao diện THCS (bé lớp 6+ vẫn tạo được hồ sơ nhưng dùng giao diện Tiểu học cho tới GĐ3).

## Thiết kế
`designs/components/Screen01-Login`, `Screen02-Profiles`, `Screen03-CreateProfile`, `Dialog`.

## Quyết định kiến trúc
- NextAuth v5 Credentials, JWT; bcrypt cho mật khẩu và PIN.
- Hồ sơ đang chọn lưu trong cookie httpOnly có ký; mọi route của bé kiểm tra hồ sơ thuộc tài khoản.
- Role `admin` gán cho tài khoản đầu tiên (hoặc qua seed).
- Nhóm route: `(auth)`, `(kid)`, `(parent)`, `(admin)`.

## Các bước
### Bước 0 — Đăng ký, đăng nhập (Screen01)
**Kiểm tra:** đăng ký, đăng nhập, sai mật khẩu báo lỗi nhẹ nhàng; đủ 4 trạng thái của màn.
### Bước 1 — Chọn hồ sơ (Screen02)
**Kiểm tra:** chỉ thấy hồ sơ của tài khoản mình; Trống khi chưa có hồ sơ.
### Bước 2 — Tạo hồ sơ 3 bước (Screen03)
**Kiểm tra:** tạo được bé lớp 1–9; kiểm tra loa phát âm thanh, thanh mức micro chạy; không có micro thì vẫn đi tiếp được.
### Bước 3 — PIN bố mẹ
**Kiểm tra:** đặt PIN lần đầu; nút "Bố mẹ" mở hộp nhập PIN; PIN sai không vào được; PIN lưu dạng hash.

## Kiểm tra cuối task
tsc, lint, build; thử truy cập hồ sơ của tài khoản khác qua URL phải bị chặn.
