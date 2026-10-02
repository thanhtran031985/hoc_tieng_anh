# Tiến độ — 04-auth-profiles — Đăng nhập gia đình và hồ sơ bé

Trạng thái chung: ✅ · Cập nhật lần cuối: 02/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Đăng ký, đăng nhập (Screen01) | ✅ | |
| 1 | Chọn hồ sơ (Screen02) | ✅ | |
| 2 | Tạo hồ sơ 3 bước (Screen03) | ✅ | |
| 3 | PIN bố mẹ | ✅ | |

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

### Bước 3 — PIN bố mẹ (02/10/2026)
- Tạo `src/server/parent-gate.ts`, `src/features/parent/{actions,ParentGate}`, `(parent)/layout.tsx` + `parent/page.tsx`, `(admin)/admin/page.tsx` (giữ chỗ); `Dialog` thêm `keepOpen`, `disabled` và vòng Tab bỏ qua phần tử ẩn.
- Kiểm tra (Chrome headless, giao diện thật, tài khoản thử đã xóa): chưa có PIN → hộp "Đặt PIN cho bố mẹ" (3 ô, focus vào ô đầu); sai mật khẩu tài khoản, hai PIN khác nhau, PIN quá ngắn đều báo nhẹ nhàng và hộp vẫn mở; ô PIN chỉ nhận số; Esc đóng hộp và trả focus về nút Bố mẹ; Enter gửi biểu mẫu; đặt PIN xong vào `/parent`; cookie cổng httpOnly sống ~15 phút; đã có PIN → hộp một ô; PIN sai không vào được và không có cookie; PIN đúng vào được; mật khẩu tài khoản cũng mở được; thiếu cookie, cookie chữ ký giả, cookie của tài khoản khác, cookie hết hạn đều bị chặn về `/profiles`; parent thường vào `/admin` thấy 404, chưa đăng nhập về `/login`, admin (từ `.env`) vào được; sai PIN 5 lần thì khóa tạm kể cả nhập đúng ngay sau đó; PIN trong database là bcrypt (`$2…`, 60 ký tự), không lộ chữ thuần. `tsc`, `lint` không lỗi.
- Việc cần làm thủ công: bấm "Bố mẹ" ở màn chọn hồ sơ, đặt PIN, thử PIN sai và đúng.

### Kiểm tra cuối task và rà soát (02/10/2026)
- `npx tsc --noEmit`, `npm run lint`, `npm run build` đều không lỗi. Bản production (`next start`): `/login`, `/register` 200; `/profiles`, `/profiles/new`, `/home`, `/parent`, `/admin` chuyển về `/login` khi chưa đăng nhập; `/dev/ui`, `/dev-tokens` 404; đăng nhập trên bản production thành công (cookie phiên httpOnly).
- Truy cập hồ sơ của tài khoản khác bị chặn ở mọi đường: sửa giá trị gửi lên khi chọn hồ sơ, cookie giả, cookie ký đúng của tài khoản khác, cookie ký đúng nhưng hồ sơ của người khác (đã thử ở Bước 1).
- Rà soát quy tắc code: mọi thao tác ghi qua Zod (đăng ký, đăng nhập, hồ sơ, PIN); mật khẩu và PIN chỉ lưu bcrypt, không log, không trả về; không có secret hay Prisma trong client component (các component client chỉ gọi server action); route nhóm `(auth)`, `(kid)`, `(parent)`, `(admin)`; không hex/px cố định trong `.tsx`/`.module.css` (trừ mốc media query).
- Đã sửa trong lúc kiểm tra: email nội bộ (`admin@localhost`) bị Zod từ chối nên admin không đăng nhập được; `UntrustedHost` làm `/api/auth` lỗi ở production.

### Checklist thử tay (cần người dùng)
Chạy `npm run dev`, mở `http://localhost:3000`:
- [ ] Đăng ký một tài khoản mới (email và mật khẩu ≥ 8 ký tự), thấy màn chọn hồ sơ Trống với nút "Tạo hồ sơ đầu tiên".
- [ ] Tạo hồ sơ 3 bước bằng micro và loa thật (bấm Cho phép micro trên trình duyệt), thấy thanh mức chạy khi nói "Hello".
- [ ] Chọn hồ sơ, thấy trang chào; đăng xuất rồi đăng nhập lại.
- [ ] Bấm "Bố mẹ": đặt PIN lần đầu (cần mật khẩu tài khoản), rồi thử PIN sai và PIN đúng.
- [ ] Đăng nhập bằng tài khoản admin theo `ADMIN_EMAIL`/`ADMIN_PASSWORD` trong `.env`, vào `/admin`.
- Đã tự kiểm tra bằng trình duyệt headless các mục trên (trừ micro/loa thật và cảm giác thao tác).

## Bước tiếp theo

Hoàn thành (chờ anh/chị thử tay checklist ở trên). Task kế tiếp theo thứ tự: 05-content-l1-l2.
