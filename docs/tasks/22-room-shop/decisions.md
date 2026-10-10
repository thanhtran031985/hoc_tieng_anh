# Quyết định — 22-room-shop — Phòng của tớ, cửa hàng và thẻ nghỉ phép

Ghi các quyết định đã chốt, thay đổi so với task.md và vấn đề phát sinh.

| Ngày | Quyết định | Lý do |
|---|---|---|
| 10/10/2026 | Làm liền cả task, các điểm “dừng chờ continue” tự duyệt; kế hoạch ở `plan.md` | Người dùng ủy quyền toàn bộ (xem memory quy trình tự chủ) |
| 10/10/2026 | 19 món lưu trong `rewards` (`type=room_item`), nhóm ở cột `album`; không thêm bảng hay migration | Bảng đã đủ cột từ task 20–21 |
| 10/10/2026 | Bé mới không có đồ nào; mỗi món sở hữu một lần | PRD: phòng trống ban đầu, `unique(learner, reward)` |
| 10/10/2026 | Vị trí đồ lưu `{x, y, flip}` theo % phòng; `position` null = đang ở kho | Đúng ở mọi cỡ màn |
| 10/10/2026 | `weekCells` và `freezeDayOfWeek` suy ngày dùng thẻ nghỉ phép từ trạng thái chuỗi (thẻ đã hết trong tuần + ngày bỏ nằm giữa hai ngày học + chuỗi còn phủ tới ngày trước đó), không thêm cột lưu ngày dùng thẻ | Tránh migration; `recordStudyDay` chỉ dùng thẻ khi bỏ đúng một ngày và vẫn giữ chuỗi nên suy ra được |
| 10/10/2026 | Ngày có học của thẻ chuỗi lấy từ `lesson_attempts.finished_at`, lượt ôn trong `answer_logs` và `learners.last_study_date` | Khớp với điều kiện tính chuỗi (1 bài hoặc 1 lượt ôn) |
| 10/10/2026 | Thêm vào `KidTopbar`/`Topbar` các prop `extra`, `coinsOnly`, `streakSlot` | Thiết kế Screen41 chỉ có xu + nút Cửa hàng; Screen43 biến số chuỗi ngày thành nút |
| 10/10/2026 | Màn Cửa hàng và Phòng của tớ cao đúng cửa sổ (`height: 100dvh`), chỉ lưới thẻ / khay cuộn bên trong | Yêu cầu 1366×768 không cuộn trang |
| 10/10/2026 | Adult21 thêm món mới chỉ cho nội thất; áo, mũ mới cần thêm hình vẽ trên Bông | Áo và mũ vẽ bằng mã trong `Mascot`, không có hình rời |
