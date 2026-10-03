# Quyết định — 12-admin-content

### 03/10/2026 — Chặn `/admin` bằng cổng bố mẹ (việc cần làm ở task này)
- Bối cảnh: sơ đồ tổng quan (`docs/so-do/tong-quan/so-sanh.md`, điểm 1) cho thấy `/admin` hiện chỉ gọi `requireRole("admin")` (`src/app/(admin)/admin/page.tsx:11`), không qua `requireParentGate` (`src/server/parent-gate.ts:35`). Tài khoản đăng ký đầu tiên tự là `admin` (`src/server/users.ts:8-10`), nên máy đang đăng nhập thì bé gõ `/admin` là vào được, không cần PIN.
- Việc cần làm: nhóm route `(admin)` phải yêu cầu cả cổng bố mẹ đã mở (cookie còn hạn) và role `admin`, kiểm ở layout và từng server action; thêm lối vào từ khu bố mẹ (PRD dòng 126).
- Kiểm tra: tài khoản admin chưa mở cổng gõ `/admin` bị chuyển về `/profiles`; mở cổng rồi mới vào được; tài khoản `parent` luôn thấy 404.
- Nguồn: do bạn quyết định ngày 03/10/2026 (làm đúng ở task 12, không sửa ở task 06).

### 03/10/2026 — Bảng điều khiển: 4 thẻ KPI, nút hành động theo mục menu đã sẵn sàng
- Thẻ thứ 4 của thiết kế là "Chủ điểm ngữ pháp" (GĐ3, ngoài phạm vi) nên thay bằng thẻ "Chủ đề" (xuất bản · nháp · chưa có bài).
- Thanh trên của khung chỉ có tiêu đề tĩnh vì khung nằm ở layout; dòng "Cập nhật hh:mm · ngày" của thiết kế đặt ngay trên các thẻ KPI trong trang.
- Nút "Thêm từ mới", "Xuất Excel", "Nhập từ Excel" để mờ kèm chú thích "Sắp có" tới bước 2 và 6; nút hành động trong cảnh báo ("Mở thư viện hình", "Mở cấu trúc"…) chỉ hiện khi mục menu đích `ready` — mỗi bước sau bật `ready` trong `src/components/adult/nav.ts` thì nút tự hiện.
- Lối vào khu quản trị: link "Quản trị" ở khung (chỉ hiện với admin) sau khi đã mở cổng bố mẹ; `requireAdmin()` chuyển về `/profiles` nếu cổng chưa mở.

### 03/10/2026 — Cây lộ trình: khác thiết kế vì schema và phạm vi
- Cấp không có tay nắm kéo thả: 10 cấp có số và màu cố định (không có cột thứ tự). Chặng cũng chỉ sửa tên.
- Ô sửa theo cột có thật: cấp chỉ có "Tên" (không có tên tiếng Anh); bài học chỉ có "Tên bài" + thời lượng (không có tên tiếng Anh, chủ đề của bài không đổi được); chủ đề có tên tiếng Anh, tên tiếng Việt, cấp và "Nguồn từ mục tiêu" (thay ô "Unit SGK" của thiết kế vì bảng `units` chưa có cột đó).
- Không có nút "Xuất bản thay đổi (n)": mỗi mục đổi Nháp / Đã xuất bản rồi Lưu là có hiệu lực ngay.
- Xóa là xóa hẳn (chưa có Thùng rác 30 ngày vì cần cột mới trong schema): từ chối nếu đã có học sinh học (có tiến độ hoặc lượt làm bài) và nhắc chuyển về Nháp; không xóa chủ đề khung. Xóa bài cuối của chủ đề đang xuất bản thì chủ đề về Nháp.
- Luật xuất bản ở bước này: chủ đề cần ≥ 1 bài; bài cần ≥ 1 bước. Luật đầy đủ (≥ 3 bước và ≥ 1 câu hỏi) thêm ở Bước 4 vì 154 bài đã xuất bản hiện chưa có câu hỏi nào.
- Thêm bài học vào chủ đề khung "Chưa có bài" thì chủ đề đó thành Nháp. Chuyển chủ đề sang cấp khác thì khóa (slug) đổi nếu trùng trong cấp mới, đứng cuối danh sách.
- Nút "Xuất Excel để điền" / "Nhập Excel" ở khung chủ đề khung để mờ "Sắp có" tới Bước 7. Từ mục tiêu trong DB chỉ là danh sách chữ (không có nghĩa gợi ý) nên bảng chỉ có cột #, từ, trạng thái trong ngân hàng.
