# 24-parent-gd2 — Khu bố mẹ GĐ2: kỹ năng, mở khóa thủ công, khung giờ học

Ngày tạo: 09/10/2026 · Giai đoạn: GĐ2 · Phụ thuộc: 11, 17, 20 · Nhánh: `feat/24-parent-gd2`

## Mục tiêu
Bố mẹ xem kỹ năng của con, mở khóa bài thủ công, và đặt khung giờ được học trong tuần.

## Phạm vi
- Trong: Kỹ năng (Adult03); Tiến độ và mở khóa thủ công (Adult17); khung giờ được học theo ngày ở Adult07; màn Chưa đến giờ học (Screen47) có Bố mẹ mở bằng PIN trong 30 phút.
- Ngoài: đề kiểm tra (Adult04), lịch kiểm tra (Adult06) ở GĐ3.

## Thiết kế
`designs/components/Adult03-Skills`, `Adult17-Progress`, `Adult07-Settings` (phần khung giờ), `Screen47-OutsideHours`.

## Quyết định kiến trúc
- Kỹ năng tính từ `answer_logs` theo `skill` (nghe, nói, đọc, viết, từ vựng); hàm thuần trong `src/lib/stats/`.
- Bảng mới `manual_unlocks` (learner_id, target_type level/unit/lesson, target_id, unlocked_by, created_at). Hàm mở khóa của PRD Phần F đọc thêm bảng này; lịch sử mở khóa ở cột phải Adult17.
- Khung giờ lưu trong `learners.settings` (ngày được học, giờ bắt đầu, giờ kết thúc). Kiểm tra ở server khi vào mọi route học (cùng chỗ kiểm tra giới hạn giờ của task 10), không chỉ ẩn nút.
- Bố mẹ mở: nhập PIN bố mẹ, đúng thì mở 30 phút (`temp_open_until` lưu ở server). Sai PIN dùng chung bộ đếm khóa 5 lần của task 11.
- Giờ tính theo múi giờ Việt Nam (Asia/Ho_Chi_Minh) ở server.

## Các bước
### Bước 0 — Kỹ năng (Adult03)
Biểu đồ kỹ năng theo tuần, từ hay sai, chọn con ở thanh trên.
**Kiểm tra:** Số liệu khớp `answer_logs` của hồ sơ thử; đủ 4 trạng thái.
### Bước 1 — Mở khóa thủ công (Adult17)
Cây Cấp → Chủ đề → Bài với trạng thái, chọn nhiều, "Mở khóa N mục", hộp thoại xác nhận, lịch sử.
**Kiểm tra:** Mở một bài khóa thì bé vào được ngay; gia đình khác không mở được bài cho bé của mình qua server action.
### Bước 2 — Khung giờ học (Adult07)
Chọn ngày và giờ được học; lưu trong settings.
**Kiểm tra:** Đổi khung giờ, tải lại thấy giá trị mới.
### Bước 3 — Chưa đến giờ học (Screen47)
Màn khu vườn, giờ bắt đầu, các ngày được học, Bố mẹ mở bằng PIN.
**Kiểm tra:** Ngoài khung giờ gõ thẳng URL bài học bị chuyển về Screen47; PIN đúng mở 30 phút rồi tự khóa lại; ngày nghỉ hiện trạng thái Trống.

## Kiểm tra cuối task
tsc, lint, build; đặt khung giờ bắt đầu sau giờ hiện tại 5 phút, kiểm tra con không vào được, mở bằng PIN.
