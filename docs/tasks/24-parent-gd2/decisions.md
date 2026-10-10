# Quyết định — 24-parent-gd2 — Khu bố mẹ GĐ2: kỹ năng, mở khóa thủ công, khung giờ học

Ghi các quyết định đã chốt, thay đổi so với task.md và vấn đề phát sinh.

| Ngày | Quyết định | Lý do |
|---|---|---|
| 10/10/2026 | Làm liền cả task, các điểm “dừng chờ continue” tự duyệt; kế hoạch ở `plan.md` | Người dùng ủy quyền toàn bộ |
| 10/10/2026 | Kỹ năng lấy từ `questions.skill` (7 kỹ năng đúng thiết kế); nhật ký chỉ có từ tính là từ vựng; chọn khoảng 7 / 30 ngày so với kỳ liền trước | Database không có cột kỹ năng ở `answer_logs`; thiết kế so với kỳ trước bằng vạch dọc |
| 10/10/2026 | Chưa làm bảng “chủ điểm ngữ pháp mạnh/yếu” của Adult03 | Chưa có dữ liệu chủ điểm ngữ pháp (Adult15 thuộc GĐ3); `task.md` chỉ yêu cầu biểu đồ kỹ năng và từ hay sai |
| 10/10/2026 | `manual_unlocks.target_id` không có khóa ngoại (trỏ tới `levels`, `units` hoặc `lessons`) | Một cột cho ba loại đích; đích được kiểm tồn tại và đã xuất bản trong `unlockTargets` |
| 10/10/2026 | Mở thủ công cấp = vào được cấp và mọi bài trong cấp; mở chủ đề hoặc bài trong cấp còn khóa = chỉ những bài đó chơi được (`lockUnlessManual`); cấp xa mở thủ công có trạng thái `open`, không hiện cổng thi lên cấp | Bố mẹ muốn con học trước bài đã học ở trường mà không đổi cấp chính thức; chuyển cấp vẫn cần bài thi lên cấp |
| 10/10/2026 | Khung giờ lưu `{from, to, days}` trong `learners.settings`; chỉ chọn ngày thì lưu 00:00–23:59, cả tuần không đặt giờ thì null | Không cần migration; đọc được cài đặt cũ chỉ có giờ (thiếu `days` = cả tuần) |
| 10/10/2026 | Mở tạm bằng PIN lưu `settings.tempOpenUntil` (server tính giờ), 30 phút, chỉ nhận PIN (không nhận mật khẩu) | Đúng thiết kế Screen47 “nhập PIN 4–6 số”; dùng chung bộ đếm khóa 5 lần với cổng bố mẹ |
| 10/10/2026 | Khóa theo giờ đặt trong `requireActiveLearner` cùng chỗ kiểm hết giờ; `allowTimeUp: true` bỏ qua cả hai | Server action ghi kết quả học và hai màn khóa không được làm mất kết quả bé vừa làm |
