# 11-parent-area — Khu vực bố mẹ: tổng quan và cài đặt

Ngày tạo: 02/10/2026 · Giai đoạn: GĐ1 · Phụ thuộc: 04, 08, 10 · Nhánh: `feat/11-parent-area`

## Mục tiêu
Bố mẹ xem tiến độ của con và chỉnh cài đặt.

## Phạm vi
- Trong: trang Tổng quan (phút học tuần, chuỗi ngày, số từ đã thuộc, cấp hiện tại và % hoàn thành, biểu đồ 7 và 30 ngày, hoạt động gần đây); Cài đặt (giới hạn giờ, giọng Anh/Mỹ, tốc độ đọc, âm thanh, quản lý hồ sơ, đổi mật khẩu và PIN).
- Ngoài: kỹ năng chi tiết, kết quả thi, ghi âm, lịch kiểm tra (GĐ2–3).

## Thiết kế
Màn GĐ1: `designs/components/Adult01-Gate` (cổng PIN / mật khẩu), `Adult02-Overview` (tổng quan), `Adult07-Settings` (cài đặt).
Thành phần dùng chung khu người lớn: `AdultShell`, `AdultKpi`, `AdultCharts`, `AdultField`, `AdultTable`, `AdultPalette`; hộp thoại xác nhận dùng `Bong.A.dialog`.
Khu người lớn luôn dùng theme `thcs` sáng, tiền tố lớp `a-`, vùng `.adm`; token lấy ở `docs/DESIGN_SYSTEM.md` mục 15 (khối `[data-theme="thcs"]`).
Bản xem trước khu người lớn gọi `Bong.A` (sau `Bong.suite('adult')`): `shell`, `btn`, `kpi`, `status`, `field`, `validate`, `table`, `drawer`, `dialog`, `toast`, `vbars`, `hbars`, `line`, `empty`, `error`, `skel`. Mỗi hàm thành một React component trong `src/components/adult/`, cùng cách chuyển như bộ `b-` của Tiểu học (CLAUDE.md), lớp `a-` dùng token.
Màn để giai đoạn sau, KHÔNG làm trong task này: `Adult03-Skills`, `Adult04-Exams`, `Adult05-Works`, `Adult06-Calendar` (GĐ2–3).

## Quyết định kiến trúc
- Số liệu tính từ `study_sessions`, `answer_logs`, `review_cards`, `lesson_progress` trong `src/server/reports/`.
- Biểu đồ: KHÔNG cài thư viện. Dựng lại biểu đồ SVG theo `AdultCharts` (`vbars`, `hbars`, `line`) thành component React trong `src/components/adult/charts/`.
- Thành phần khu người lớn đặt ở `src/components/adult/`, tách khỏi bộ Tiểu học của task 02. Task 12 dùng lại.
- Cổng vào: thay cổng PIN tạm của task 04 (nếu có) bằng Adult01-Gate; sai 5 lần khóa 5 phút, đếm ở server.
- Xóa hồ sơ, đặt lại tiến độ: hộp thoại xác nhận, xóa phải gõ đúng tên con; làm trong transaction.
- Giao diện "Tự động theo lớp": lớp 1–5 dùng Tiểu học, lớp 6–9 dùng THCS (lưu trong `learners.settings`). GĐ1 chỉ có giao diện Tiểu học nên chỉ lưu lựa chọn.
- Giọng UK/US và tốc độ đọc dùng giọng đọc có sẵn của trình duyệt (như task 07), nút "Nghe thử" đọc một câu mẫu.

## Các bước
### Bước 0 — Bộ thành phần khu người lớn
Thêm token theme `thcs` (khối `[data-theme="thcs"]` trong DESIGN_SYSTEM mục 15) vào `globals.css` mà không đổi token Tiểu học. Dựng `AdultShell` (menu trái, thanh trên, chọn con), `Kpi`, `Status`, `Field`, `Button`, `Table`, `Dialog`, `Drawer`, `Toast`, trạng thái khung xương / trống / lỗi, và 3 biểu đồ SVG.
**Kiểm tra:** trang thử `/dev/adult-kit` hiện đủ thành phần; màn Tiểu học đã làm không đổi màu; Tab thấy viền focus.
### Bước 1 — Cổng vào khu bố mẹ (Adult01)
**Kiểm tra:** PIN đúng vào được; sai báo lỗi dưới ô và số lần còn lại; sai 5 lần khóa 5 phút (thử cả khi tải lại trang); tài khoản chưa có PIN chỉ hiện ô mật khẩu; đăng nhập bằng mật khẩu được.
### Bước 2 — Tổng quan (Adult02)
Hàm tính số liệu trong `src/server/reports/`.
**Kiểm tra:** đủ 4 trạng thái; đổi con ở thanh trên thì số liệu đổi theo; phút học tuần so với tuần trước; biểu đồ 7 và 30 ngày có đường giới hạn nét đứt; con chưa học ngày nào thì hiện trạng thái trống; chỉ xem được con thuộc tài khoản mình.
### Bước 3 — Cài đặt (Adult07)
**Kiểm tra:** 4 nhóm chuyển bằng ↑/↓; giới hạn giờ lưu vào `learners.settings` và task 10 dùng được ngay; khung giờ báo lỗi nếu giờ kết thúc trước giờ bắt đầu; đổi tên, lớp, cấp, đặt lại tiến độ, xóa hồ sơ đều qua hộp thoại xác nhận; đổi mật khẩu và PIN kiểm tra đúng luật.

## Kiểm tra cuối task
tsc, lint, build; dùng toàn bộ khu bố mẹ chỉ bằng bàn phím; thử ở 1366×768 và 1920×1080.
