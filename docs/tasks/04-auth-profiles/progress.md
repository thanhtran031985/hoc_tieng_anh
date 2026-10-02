# Tiến độ — 04-auth-profiles — Đăng nhập gia đình và hồ sơ bé

Trạng thái chung: 🔄 · Cập nhật lần cuối: 02/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Đăng ký, đăng nhập (Screen01) | ✅ | |
| 1 | Chọn hồ sơ (Screen02) | ⬜ | |
| 2 | Tạo hồ sơ 3 bước (Screen03) | ⬜ | |
| 3 | PIN bố mẹ | ⬜ | |

## Nhật ký

### Bước 0 — Đăng ký, đăng nhập (02/10/2026)
- Tạo `src/auth.config.ts`, `src/auth.ts`, `src/proxy.ts`, `src/types/next-auth.d.ts`, `src/app/api/auth/[...nextauth]/route.ts`, `src/server/{users,session,rate-limit,signed-cookie,cookies}.ts`, `src/lib/schemas/auth.ts`, `src/features/auth/*` (khung chia đôi, biểu mẫu đăng nhập/đăng ký, actions, nút đăng xuất), nhóm route `(auth)` và `(kid)` (`profiles` giữ chỗ), `src/components/ui/{TextField,Bubble}`; `/` chuyển hướng; `prisma/seed.ts` tạo admin từ `.env`.
- Kiểm tra (Chrome headless điều khiển giao diện thật, tài khoản thử đã xóa): trạng thái Trống (nút vô hiệu + gợi ý), Bình thường, sai mật khẩu báo nhẹ nhàng "Email hoặc mật khẩu chưa đúng…", sau 5 lần sai bị khóa tạm với lời nhắn nhẹ nhàng; đăng ký: hai mật khẩu khác nhau và mật khẩu quá ngắn bị từ chối, đăng ký đúng thì tự đăng nhập và vào `/profiles`; cookie phiên httpOnly sống ~30 ngày; đã đăng nhập vào `/login` thì chuyển về `/profiles`; đăng xuất về `/login` và `/profiles` bị chặn; trạng thái Đang tải (ô khóa, nút có vòng quay, làm chậm mạng 2,5 giây); mất mạng hiện hộp "Chưa kết nối được" + Thử lại, giữ thông tin, bấm Thử lại khi có mạng lại thì vào được; mật khẩu trong database là bcrypt (`$2…`, 60 ký tự), không lộ chữ thuần; role `parent` vì đã có admin. `tsc`, `lint` không lỗi.
- Việc cần làm thủ công: mở `http://localhost:3000/login`, thử đăng ký và đăng nhập; đăng nhập bằng tài khoản admin theo `ADMIN_EMAIL`/`ADMIN_PASSWORD` trong `.env` (đã tạo bằng seed).

## Bước tiếp theo

Bước 1 — Chọn hồ sơ (Screen02) (kế hoạch ở `plan.md`).
