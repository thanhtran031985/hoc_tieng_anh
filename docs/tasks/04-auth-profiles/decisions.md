# Quyết định — NN-slug

<!-- Mỗi quyết định thêm một mục:
### <ngày> — <tiêu đề>
- Bối cảnh:
- Quyết định:
- Lý do:
- Ảnh hưởng:
-->

### 02/10/2026 — Xác thực bằng NextAuth v5 (Bước 0)
- NextAuth `5.0.0-beta.32` (hỗ trợ Next 16), Credentials + JWT, bcryptjs cost 12. `src/auth.config.ts` không đụng database (dùng chung cho `proxy.ts`), `src/auth.ts` có `authorize`: kiểm Zod, tìm user, `bcrypt.compare` (có băm giả khi email không tồn tại để thời gian trả lời giống nhau). Phiên JWT 30 ngày chính là "nhớ đăng nhập" (cookie `authjs.session-token` httpOnly); thiết kế không có ô chọn nên không thêm.
- Next 16 đổi `middleware` thành `proxy`. Vì app dùng thư mục `src/`, tệp phải ở `src/proxy.ts` (đặt ở thư mục gốc thì bị bỏ qua, đã gặp). Proxy chỉ chuyển hướng cho tiện; phân quyền thật ở `requireUser`/`requireRole` (`src/server/session.ts`), hàm này đọc lại user từ database nên tài khoản bị xóa hoặc đổi vai trò có hiệu lực ngay.
- Đăng nhập bằng email (bảng `users` chỉ có `email`): ô "Email hoặc số điện thoại" của thiết kế thành "Email"; mật khẩu tối thiểu 8 ký tự (thiết kế ghi 6; chọn 8 cho an toàn) và tối đa 72 byte (giới hạn của bcrypt). "Quên mật khẩu?" là nút giữ chỗ (khôi phục mật khẩu ngoài phạm vi task).
- Đăng ký: nếu chưa có tài khoản admin nào thì người đăng ký đầu tiên là admin, còn lại là `parent` (`roleForNewUser`); `prisma/seed.ts` tạo admin từ `ADMIN_EMAIL`/`ADMIN_PASSWORD` (tạo nếu chưa có, không đổi mật khẩu tài khoản có sẵn). Đăng ký xong tự đăng nhập. Email đã có tài khoản thì báo "Email này đã có tài khoản" (chấp nhận lộ việc email tồn tại ở màn đăng ký để người dùng không bị kẹt).
- Giới hạn thử sai (`src/server/rate-limit.ts`): đăng nhập 5 lần sai trong 15 phút theo email thì khóa tạm (kiểm trong `authorize`, nên cả đường gọi trực tiếp tới `/api/auth` cũng bị chặn); lời nhắn nhẹ nhàng. Bộ đếm nằm trong bộ nhớ tiến trình: hosting chạy nhiều tiến trình cần chuyển sang database.
- Bốn trạng thái của màn: Trống (nút vô hiệu + gợi ý), Bình thường, Đang tải (`useActionState` → ô khóa, nút có vòng quay), Lỗi (sai mật khẩu báo ngay dưới ô; mất mạng hiện hộp "Chưa kết nối được" + nút Thử lại nhờ `guarded()` bọc server action, giữ nguyên thông tin đã nhập). Nút "Đăng nhập" có nhãn Enter nên Enter được nối với `requestSubmit` qua `useHotkeys` kể cả khi focus không ở ô nhập.
- Thành phần mới ở UI kit: `TextField` (nhãn, gợi ý, lỗi nhẹ nhàng bằng nền cam, nút phụ trong ô) và `Bubble`; token mới: `--size-input`, `--size-iconbtn-inline`, `--iconbtn-inset`, `--size-bubble-max`, `--bubble-tail*`, `--size-auth-card`, `--size-mascot-hero`, `--hill-rim`, `--size-spinner`.
- Nhóm route: `(auth)` login, register; `(kid)` profiles (và sau này home); `/` chỉ chuyển hướng. Đã chạy `npx prisma db seed` trên database `hoc_tieng_anh`: tài khoản quản trị từ `.env` đã được tạo.

### 02/10/2026 — Chọn hồ sơ và hồ sơ đang chọn (Bước 1)
- Màn `/profiles` ("Ai đang học hôm nay?") là server component: `listLearners(user.id)` chỉ trả hồ sơ của tài khoản đang đăng nhập; thẻ bé hiển thị ảnh, tên, lớp, nhãn cấp (`currentLevel` do `learners.ts` nay kèm sẵn) và nhãn THCS khi lớp ≥ 6; thẻ "Thêm hồ sơ" viền đứt biến mất khi đủ 6 bé (`MAX_LEARNERS`). Thẻ bé là nút trong biểu mẫu gửi `selectLearnerAction`; server kiểm `getLearner(userId, learnerId)` rồi mới đặt cookie, sai thì về `/profiles` mà không nói rõ lý do.
- Cookie hồ sơ `edu_learner`: httpOnly, `SameSite=Lax`, `Secure` ở production, sống 30 ngày, nội dung `userId.learnerId` + chữ ký HMAC-SHA256 bằng `AUTH_SECRET` (`src/server/signed-cookie.ts`, so sánh bằng `timingSafeEqual`). `getActiveLearner()` kiểm chữ ký, kiểm `userId` khớp phiên và gọi `getLearner`; `requireActiveLearner()` đưa về `/profiles` nếu không hợp lệ. Đã thử: cookie chữ ký giả, cookie ký đúng của tài khoản khác, cookie ký đúng nhưng hồ sơ của người khác đều bị bỏ qua.
- Bốn trạng thái: Bình thường; Đang tải (`loading.tsx`, khung xương đúng vị trí thẻ); Trống (`DataState` rồng chào + nút "Tạo hồ sơ đầu tiên"); Lỗi (`error.tsx`, "Không phải lỗi của bé đâu", nút Thử lại). Đã kiểm tra Đang tải và Lỗi bằng trang thử tạm (đã xóa) vì khó gây lỗi thật.
- `createLearner` (task 03) nay kiểm tối đa 6 hồ sơ (`LearnerLimitError`) và gán `currentLevelId` theo lớp (`levelForGrade`: lớp N → cấp N, tối đa 10); chưa khai báo lớp thì để trống. Kiểm số lượng không nằm trong giao dịch nên hai yêu cầu tạo đồng thời có thể vượt 6; chấp nhận vì thao tác do bố mẹ làm bằng tay.
- Thêm `ButtonLink` (liên kết trông như nút) vào UI kit; `.btn` thêm `text-decoration: none`. `/home` là trang giữ chỗ (task 06 dựng thật): yêu cầu đã chọn hồ sơ, có nút "Đổi bé" và đăng xuất.
- Nút "Bố mẹ" (ổ khóa) của thiết kế thêm ở Bước 3 cùng hộp thoại PIN.

### 02/10/2026 — Tạo hồ sơ 3 bước (Bước 2)
- Luồng `/profiles/new` là một component client (`CreateProfileFlow`) giữ toàn bộ trạng thái; mỗi bước là một thành phần riêng (`StepName`, `StepPet`, `StepAudio`) cùng `StepIndicator`. Thanh bước chỉ cho bấm các bước đã tới; chân màn có Quay lại và Tiếp tục (nhãn Enter, nối với `useHotkeys`, ô nhập tự gọi `onEnter`). Lưu hồ sơ bằng server action `createLearnerAction` (Zod `createLearnerFormSchema`: tên ≤ 16 chữ, lớp 1–9, tên rồng ≤ 12 chữ, màu rồng 4 loại; server giới hạn 6 hồ sơ và chọn luôn hồ sơ vừa tạo), rồi `router.push("/home")`. Đang lưu hiện "Bông đang chuẩn bị phòng học cho <tên>…"; lỗi lưu hiện `DataState` lỗi với nút Thử lại (kể cả mất mạng).
- Lớp chọn bằng nhóm radio (mũi tên trái/phải đổi lớp, chỉ lớp đang chọn nằm trong thứ tự Tab), chip lớp được chọn tô màu cấp (`data-level` + `--lv`); hiện "Bé sẽ bắt đầu ở Cấp N · tên cấp" với tên cấp lấy từ database (`listLevels`). Lớp N bắt đầu ở cấp N (`levelForGrade`). Kiểu ảnh hồ sơ xoay vòng theo số hồ sơ có sẵn (`avatarForIndex`); `ui_theme` giữ `auto` (bé lớp 6+ vẫn dùng giao diện Tiểu học tới GĐ3).
- Chọn rồng bằng 4 nút radio (`Mascot color`, dấu ✓ khi chọn); màu rồng được chọn áp lên ô micro qua `data-dragon`.
- Kiểm tra micro (`use-mic-test.ts`): `getUserMedia` + `AnalyserNode`, chỉ đo mức âm lượng để vẽ 7 thanh rồi tắt micro, không ghi âm và không gửi âm thanh đi. Báo "Tớ nghe thấy rồi!" khi có ít nhất 8 khung hình có tiếng trong 2,5 giây (không cần liên tục, vì tiếng nói ngắt quãng). Ban đầu thử "6 khung liên tiếp" và "điểm có suy giảm" nhưng thiết bị micro giả của Chrome phát xung ngắn nên không đạt; cửa sổ trượt là cách đơn giản nhất chạy được với cả hai. Từ chối quyền, không có micro hoặc trình duyệt không hỗ trợ đều vào trạng thái "unavailable": hướng dẫn bố mẹ bấm Cho phép + nút Thử lại; nút Bắt đầu học và "Bỏ qua, kiểm tra sau" luôn dùng được.
- Kiểm tra loa: bấm `SpeakerButton` cỡ l đọc "Hello! I am Bong.", sau đó hỏi "Bé có nghe thấy không?" (Có, nghe rõ / Chưa nghe rõ); kết quả chỉ để bé tự xác nhận, không lưu.
- Token mới cho màn này (`--size-create-*`, `--size-step-*`, `--size-name-input`, `--size-grade-chip`, `--size-pet-mascot`, `--size-mic`, `--meter-*`, `--size-check-badge`, `--check-offset`, `--size-panel-min-h*`, `--size-create-head-s`, `--size-create-foot-s`), `listLevels()` ở `src/server/curriculum.ts`.

### 02/10/2026 — PIN bố mẹ và cổng bố mẹ (Bước 3)
- Nút "Bố mẹ" (ổ khóa) ở màn chọn hồ sơ mở `Dialog` (thành phần của task 02). Chưa có PIN: hộp "Đặt PIN cho bố mẹ" gồm mật khẩu tài khoản và PIN mới (4–6 số) nhập hai lần. Đặt mật khẩu tài khoản làm điều kiện để bé không tự đặt PIN khi máy đang đăng nhập (task.md chỉ nói "đặt PIN lần đầu"; đây là chọn thêm cho an toàn). Đã có PIN: hộp một ô nhận PIN hoặc mật khẩu tài khoản (PRD D1). PIN lưu bằng bcrypt cost 12 ở `users.parent_pin`; đổi PIN để phần cài đặt của bố mẹ (task 11).
- `unlockParentAction` và `setParentPinAction` (`src/features/parent/actions.ts`) kiểm bằng Zod, giới hạn thử sai 5 lần/10 phút theo tài khoản (`pin:<userId>`, dùng chung cho đặt PIN và mở khóa); sai thì báo nhẹ nhàng, quá giới hạn thì báo "nghỉ vài phút" kể cả khi nhập đúng ngay sau đó. Đúng thì server đặt cookie `edu_parent_gate` (httpOnly, `SameSite=Lax`, `Secure` ở production, nội dung `userId.hếtHạn` + chữ ký HMAC, sống 15 phút). `(parent)/layout.tsx` gọi `requireParentGate()` ở server: thiếu cookie, chữ ký giả, của tài khoản khác hoặc hết hạn đều đưa về `/profiles`. Đăng xuất xóa cả hai cookie (hồ sơ và cổng bố mẹ).
- `/parent` và `/admin` là trang giữ chỗ (task 11, 12). `/admin` chỉ cho role admin (`requireRole("admin")`, người khác thấy 404); chưa đăng nhập thì `proxy.ts` đưa về `/login`.
- Thay đổi ở UI kit (task 02): `DialogAction` thêm `keepOpen` (giữ hộp mở để báo lỗi trong hộp) và `disabled`; vòng Tab của `Dialog` bỏ qua phần tử đang ẩn (nút gửi biểu mẫu `hidden`).

### 02/10/2026 — Hai lỗi phát hiện khi kiểm tra cuối và đã sửa
- Email: `z.email()` của Zod từ chối địa chỉ nội bộ không có đuôi miền (vd `admin@localhost` dùng làm `ADMIN_EMAIL`), nên quản trị viên không đăng nhập được. Đổi sang kiểm tra đơn giản `^[^\s@]+@[^\s@]+$` (không khoảng trắng, đúng một `@`).
- Production: `next start` làm `/api/auth/*` trả 500 `UntrustedHost` vì thiếu `AUTH_URL`/`AUTH_TRUST_HOST` (dev tự tin cậy nên không thấy). Đặt `trustHost: true` ở `auth.config.ts` vì chỉ dùng Credentials (không OAuth, không email) nên không phụ thuộc tiêu đề Host; khi deploy vẫn nên đặt `AUTH_URL` đúng origin (đã ghi ở `.env.example`). Đã kiểm tra đăng nhập trên bản `next start`.

### 02/10/2026 — Tổng kết task 04 (khác với `task.md` gốc)
- Đăng nhập bằng email (không có số điện thoại); mật khẩu tối thiểu 8 ký tự; đăng ký xong tự đăng nhập; "Quên mật khẩu?" chỉ là nút giữ chỗ.
- Thêm ngoài `task.md`: giới hạn thử sai (đăng nhập, PIN), tối đa 6 hồ sơ mỗi tài khoản (theo thiết kế "Tối đa 6 bé"), seed tài khoản admin từ `.env`, `ButtonLink`/`TextField`/`Bubble` ở UI kit, `proxy.ts` chuyển hướng.
- Việc để task sau: trang tổng quan bố mẹ và đổi PIN (task 11), trang chủ của bé (task 06), quản trị nội dung (task 12), khôi phục mật khẩu (chưa có task); bộ đếm thử sai nằm trong bộ nhớ nên cần chuyển sang database nếu hosting chạy nhiều tiến trình.
