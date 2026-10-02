# Tiến độ — 04-auth-profiles — Đăng nhập gia đình và hồ sơ bé

Trạng thái chung: 🔄 · Cập nhật lần cuối: 02/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Đăng ký, đăng nhập (Screen01) | ✅ | |
| 1 | Chọn hồ sơ (Screen02) | ✅ | |
| 2 | Tạo hồ sơ 3 bước (Screen03) | ✅ | |
| 3 | PIN bố mẹ | ⬜ | |

## Nhật ký

### Bước 0 — Đăng ký, đăng nhập (02/10/2026)
- Tạo `src/auth.config.ts`, `src/auth.ts`, `src/proxy.ts`, `src/types/next-auth.d.ts`, `src/app/api/auth/[...nextauth]/route.ts`, `src/server/{users,session,rate-limit,signed-cookie,cookies}.ts`, `src/lib/schemas/auth.ts`, `src/features/auth/*` (khung chia đôi, biểu mẫu đăng nhập/đăng ký, actions, nút đăng xuất), nhóm route `(auth)` và `(kid)` (`profiles` giữ chỗ), `src/components/ui/{TextField,Bubble}`; `/` chuyển hướng; `prisma/seed.ts` tạo admin từ `.env`.
- Kiểm tra (Chrome headless điều khiển giao diện thật, tài khoản thử đã xóa): trạng thái Trống (nút vô hiệu + gợi ý), Bình thường, sai mật khẩu báo nhẹ nhàng "Email hoặc mật khẩu chưa đúng…", sau 5 lần sai bị khóa tạm với lời nhắn nhẹ nhàng; đăng ký: hai mật khẩu khác nhau và mật khẩu quá ngắn bị từ chối, đăng ký đúng thì tự đăng nhập và vào `/profiles`; cookie phiên httpOnly sống ~30 ngày; đã đăng nhập vào `/login` thì chuyển về `/profiles`; đăng xuất về `/login` và `/profiles` bị chặn; trạng thái Đang tải (ô khóa, nút có vòng quay, làm chậm mạng 2,5 giây); mất mạng hiện hộp "Chưa kết nối được" + Thử lại, giữ thông tin, bấm Thử lại khi có mạng lại thì vào được; mật khẩu trong database là bcrypt (`$2…`, 60 ký tự), không lộ chữ thuần; role `parent` vì đã có admin. `tsc`, `lint` không lỗi.
- Việc cần làm thủ công: mở `http://localhost:3000/login`, thử đăng ký và đăng nhập; đăng nhập bằng tài khoản admin theo `ADMIN_EMAIL`/`ADMIN_PASSWORD` trong `.env` (đã tạo bằng seed).

### Bước 1 — Chọn hồ sơ (02/10/2026)
- Tạo `src/app/(kid)/profiles/{page,loading,error}.tsx`, `(kid)/home/page.tsx` (giữ chỗ), `src/features/profiles/*` (thẻ hồ sơ, thanh trên, action chọn hồ sơ, CSS), `src/server/active-learner.ts`, `src/lib/learner-rules.ts`, `src/components/ui/Button/ButtonLink.tsx`; `src/server/learners.ts` kèm `currentLevel`, giới hạn 6 hồ sơ và cấp bắt đầu theo lớp.
- Kiểm tra (Chrome headless, giao diện thật, 3 tài khoản thử đã xóa): tài khoản chưa có hồ sơ thấy trạng thái Trống; tài khoản A chỉ thấy 2 hồ sơ của mình (không thấy hồ sơ của B), bé lớp 7 có nhãn THCS, nhãn cấp đúng (lớp 2 → "Cấp 2 · Mầm non", lớp 7 → "Cấp 7 · Sydney"), có thẻ "Thêm hồ sơ — Tối đa 6 bé"; chưa chọn hồ sơ thì `/home` về `/profiles`; chọn hồ sơ → `/home` chào đúng bé, cookie `edu_learner` httpOnly có chữ ký; sửa giá trị gửi lên thành hồ sơ của tài khoản khác hoặc giá trị rác thì bị từ chối (không đặt cookie, ở lại `/profiles`); cookie chữ ký giả, cookie ký đúng của tài khoản khác, cookie ký đúng nhưng hồ sơ của người khác đều bị bỏ qua, cookie hợp lệ của chính mình được nhận; trạng thái Đang tải và Lỗi kiểm bằng trang thử tạm (đã xóa) và có ảnh chụp 1440×900 và 1366×768. `tsc`, `lint` không lỗi.
- Việc cần làm thủ công: đăng nhập, xem màn chọn hồ sơ (chưa có hồ sơ nào thì thấy Trống; Bước 2 tạo được hồ sơ).

### Bước 2 — Tạo hồ sơ 3 bước (02/10/2026)
- Tạo `src/app/(kid)/profiles/new/page.tsx`, `src/features/profiles/create/*` (`CreateProfileFlow`, `StepIndicator`, `StepName`, `StepPet`, `StepAudio`, `use-mic-test`, `actions`, CSS), `createLearnerFormSchema`, `listLevels()`, token mới.
- Kiểm tra (Chrome headless, giao diện thật; micro giả bằng cờ `--use-fake-device-for-media-stream`; tài khoản thử đã xóa): bước 1 Tiếp tục vô hiệu khi chưa đủ tên và lớp, bóng thoại chào đúng tên, chọn lớp 7 hiện "Cấp 7 · Sydney", mũi tên trái đổi lớp; Enter chuyển bước; bước 2 chọn Rồng Tím và đặt tên rồng, tên rỗng thì vô hiệu; bước 3 bấm loa đọc đúng "Hello! I am Bong." rồi hỏi "Bé có nghe thấy không?", xác nhận → "Tuyệt vời!"; micro: thanh mức chạy theo âm thanh và báo "Tớ nghe thấy rồi!"; lưu hiện "Bông đang chuẩn bị phòng học cho Minh…" rồi vào `/home` chào đúng bé; không có micro (không cờ giả): hiện hướng dẫn "Cho phép" + Thử lại, vẫn Bắt đầu học và Bỏ qua được (ảnh chụp 1366×768); database: hồ sơ đúng lớp, rồng, tên rồng, cấp bắt đầu, kiểu ảnh xoay vòng; tạo được lớp 1–9 (cấp 1–9), hồ sơ thứ 7 bị từ chối; dữ liệu sai bị Zod từ chối. `tsc`, `lint` không lỗi.
- Việc cần làm thủ công: tạo thử một hồ sơ bằng micro thật (cần bấm Cho phép trên trình duyệt) và nghe loa thật.

## Bước tiếp theo

Bước 3 — PIN bố mẹ (kế hoạch ở `plan.md`).
