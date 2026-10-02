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
