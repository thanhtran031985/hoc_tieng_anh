# Quyết định — 29-fix-ui-findings

### 09/10/2026 — Lỗi 1 dùng `retry` của Next thay vì `router.refresh()`
- Bối cảnh: báo cáo test đề xuất thêm `router.refresh()`. Next 16.3.8 có sẵn prop `retry()` cho `error.tsx` (tài liệu trong `node_modules/next/dist/docs/.../error.md`): lấy lại dữ liệu rồi vẽ lại; `reset()` chỉ vẽ lại.
- Quyết định: đổi `reset` thành `retry` ở mọi `error.tsx`.
- Lý do: đúng API chính thức, không phải tự viết `startTransition`.
- Ảnh hưởng: sửa 19 tệp (báo cáo ghi 16: còn thiếu `home`, `placement`, `time-up` cũng dùng `reset`).

### 09/10/2026 — Favicon là tệp SVG tĩnh có mã màu
- Bối cảnh: `src/app/icon.svg` không đọc được token CSS của trang.
- Quyết định: chép đầu rồng Bông (biểu cảm `chao`, nét vẽ từ `dragon-parts.ts`) vào tệp SVG với màu của rồng ngọc (token `--dragon-*`) ghi trực tiếp.
- Lý do: tệp biểu tượng độc lập với CSS; đây là ngoại lệ duy nhất của quy tắc "không mã màu hex".

### 09/10/2026 — Bỏ qua thư mục báo cáo test khi lint
- Bối cảnh: `npm run lint` quét cả `playwright-report/` (JS đã đóng gói) và báo hàng nghìn lỗi.
- Quyết định: thêm `playwright-report/**`, `test-results/**` vào `globalIgnores` của `eslint.config.mjs`.

### 09/10/2026 — Cho phép mở bản dev từ địa chỉ mạng nhà (`allowedDevOrigins`)
- Bối cảnh: mở `http://192.168.1.221:3000/login` thì nút Đăng nhập và Tạo tài khoản không bao giờ sáng, dù ô đã có chữ. Mở bằng `localhost` thì bình thường. Thử bằng Chrome: bản dev chặn kết nối HMR từ địa chỉ lạ (`WebSocket ... failed`), trang không chạy được mã phía trình duyệt.
- Quyết định: thêm `allowedDevOrigins: ["192.168.*.*"]` vào `next.config.ts` (chỉ có tác dụng khi chạy `npm run dev`, cần chạy lại dev server).
- Lý do: dùng `*` cho 2 nhãn cuối để khỏi phải sửa khi router đổi địa chỉ máy; chỉ mạng nhà `192.168.x.x`.
- Ảnh hưởng: bản build/hosting không đổi.

### 09/10/2026 — Đổi mật khẩu: nhập tự do, không ràng buộc (theo yêu cầu của bạn)
- Bối cảnh: bạn muốn ô "Mật khẩu mới" ở Khu bố mẹ › Mật khẩu & mã PIN nhập tự do.
- Quyết định: `validateNewPassword` (`src/lib/rules/parent-settings.ts`, dùng chung cho client và server) chỉ báo lỗi khi để trống; bỏ yêu cầu ≥ 8 ký tự và có cả chữ lẫn số. Giữ độ dài tối đa của schema (bcrypt chỉ dùng 72 byte đầu) và việc hai lần nhập phải khớp. Cập nhật gợi ý dưới ô, test hàm thuần và tên test `11`.
- Không đổi: form Đăng ký vẫn yêu cầu ≥ 8 ký tự (`src/lib/schemas/auth.ts`); mật khẩu vẫn băm bcrypt.
- Ảnh hưởng: ngược quy tắc "mật khẩu mạnh" của task 04; chấp nhận để tiện khi dev, nên siết lại trước khi đưa lên hosting.

### 09/10/2026 — Áp dụng gói thiết kế GĐ2: test token đỏ 108 token cho tới task 13
- Bối cảnh: `designs/tokens.json` mới có thêm 108 token màu hex (đọc to, ghép âm, bong bóng, đập chuột…). Theme của app (`globals.css`) chưa có, vì chúng thuộc GĐ2.
- Kết quả: `01-nen-tang` "mọi token màu dạng hex của bộ Tiểu học khớp designs/tokens.json" hỏng: 108 token "trang có rỗng", 0 token đổi giá trị (221 token GĐ1 vẫn khớp). Các test khác của task 01 đạt (32/33); `npm run build`, `tsc`, `lint` sạch.
- Quyết định: KHÔNG nới test. Test này tự hết đỏ khi task `13-gd2-ui-kit` thêm token GĐ2 vào theme.

### 09/10/2026 — Thêm lỗi 10 và 11 vào task (theo yêu cầu của bạn)
- Lỗi 10 (`ERR_TOO_MANY_REDIRECTS`): cookie đăng nhập còn hạn nhưng tài khoản đã mất khỏi database → `requireUser` về `/login`, proxy thấy cookie và đẩy ngược về `/profiles`, lặp mãi. Sửa: `requireUser` chuyển tới route `src/app/session-expired/route.ts`, chỉ khi cookie hợp lệ mà người dùng không còn thì route xóa cookie phiên (Set-Cookie hết hạn) rồi về `/login`.
- Phát hiện khi gỡ lỗi: `signOut()` của Auth.js trong route handler không xóa cookie phiên (chỉ gửi `callback-url`), nên xóa cookie bằng tay. `/session-expired` bị loại khỏi `matcher` của `proxy.ts` để proxy không làm mới cookie cùng lúc.
- Lưu ý: các yêu cầu tải trước (prefetch) đang chạy dở với cookie cũ có thể làm cookie sống lại vài giây; lần vào trang bảo vệ kế tiếp tự xóa lại, không lặp. Test kiểm cả hai điều này.
- Lỗi 11: `use-mic-test.ts` thêm trạng thái `insecure` (`!window.isSecureContext`), `StepAudio.tsx` hiện "Mở web bằng localhost hoặc https" thay vì "bấm Cho phép".

### 09/10/2026 — Tổng kết task 29
- Khác với task.md gốc: (1) 19 tệp `error.tsx` thay vì 16, dùng `retry` có sẵn của Next thay vì `router.refresh()`; (2) thêm lỗi 10 và 11 theo yêu cầu; (3) thêm `allowedDevOrigins` cho `next.config.ts`, nới luật mật khẩu mới ở Khu bố mẹ, `eslint.config.mjs` bỏ qua thư mục báo cáo test; (4) áp dụng gói thiết kế GĐ2 và tài liệu task 13–28 trong cùng nhánh (commit riêng).
- Còn lại: lỗi 8 (từ chưa có hình) và 9 (câu "ôn hết từ đến hạn" cho bé mới) chưa sửa, chờ bạn quyết; test token màu của `01-nen-tang` đỏ 108 token GĐ2 cho tới task 13.
