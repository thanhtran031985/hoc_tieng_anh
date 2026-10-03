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

### 03/10/2026 — Ngân hàng từ vựng: khác thiết kế vì schema và phạm vi
- Bảng `words` không có cột trạng thái (Nháp / Đã xuất bản), lớp SGK, Unit SGK nên bảng và biểu mẫu bỏ các cột/bộ lọc đó, và luật "không xuất bản khi chưa có âm thanh" không áp dụng. Từ luôn dùng được ngay khi lưu.
- Chủ đề của từ là bảng `topics` (trùng tên chủ đề trong cây lộ trình). Ô Chủ đề liệt kê chủ đề của cấp đã chọn theo cây lộ trình, tạo bản ghi `topics` khi cần; chỉ ghi lại chủ đề khi người dùng đổi ô này hoặc đổi cấp, nên sửa từ có nhiều chủ đề không làm mất chủ đề.
- Hình và âm thanh chỉ xem trong ngăn kéo; tải hình, gán hình ở Bước 5. "Tạo giọng đọc tự động" để mờ "Sắp có" (GĐ2). Không có chọn hàng nhiều dòng (không có thao tác hàng loạt ở GĐ1).
- Luật "câu ví dụ chứa từ" khớp theo phần gốc (get → gets, play → playing) và có bảng dạng bất quy tắc (teach → taught, foot → feet) vì 30 câu ví dụ trong seed dùng quá khứ bất quy tắc; từ hoặc câu trống thì chưa kiểm.
- Trùng từ tính trên toàn ngân hàng, không phân biệt hoa thường (hiện không có từ trùng nào trong 900 từ).

### 03/10/2026 — Ngân hàng câu hỏi: dạng 8.1–8.4 và khác thiết kế
- "4 dạng 8.1–8.4" của task.md gồm 8.1 Thẻ từ và 3 dạng câu hỏi 8.2–8.4. Thẻ từ không phải câu hỏi (là bước gắn với một từ, không có hàng trong bảng `questions`) nên ngân hàng câu hỏi tạo/sửa 3 dạng 8.2 (`listen_choose_picture`), 8.3 (`match_pairs`), 8.4 (`choose_word_for_picture`) — đúng bộ `QUESTION_TYPES` mà trình học của task 07 chơi được; thẻ từ thêm ở Bước 4 (Soạn bài học). Thiết kế Adult11 vẽ A/B/C/D và Điền chỗ trống (8.13, 8.10 — GĐ2–3) nên không làm.
- Câu hỏi dựng từ các từ trong ngân hàng từ vựng (nhập chữ, có gợi ý): 8.2 cần mọi lựa chọn có hình; 8.4 cần từ đúng có hình; 8.3 cần các từ có hình và khác nhau. Server tra từ, dựng JSON và kiểm lại bằng Zod có sẵn.
- Không có cột Chủ điểm ngữ pháp, Unit SGK (GĐ3 / chưa có trong schema). Bỏ chọn nhiều hàng. Độ khó lưu ở `questions.difficulty` (1–5), kỹ năng ở `questions.skill`.
- Trình học hiện dựng bước từ từ vựng của bước (`buildPlaySteps`) và chưa đọc bảng `questions`; câu hỏi ở đây dùng để soạn bài ở Bước 4 và chuẩn bị cho giai đoạn sau. "Xem như học sinh" dựng bước đúng kiểu mà `StepView` nhận.
- Giải thích tối đa 300 ký tự; bắt buộc với cấp ≥ 6 (kiểm cả client và server).
