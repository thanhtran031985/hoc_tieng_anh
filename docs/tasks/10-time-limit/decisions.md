# Quyết định — 10-time-limit

### 03/10/2026 — Cách đo giờ học
- Không đổi database. `StudyClock` (client, trong `(kid)/layout.tsx`) đếm giây khi tab đang hiện và bé vừa thao tác trong 60 giây; đủ 60 giây gửi một nhịp, server ghi một dòng `study_sessions` 1 phút (nhận nhịp cách nhau ≥ 50 giây). Phần lẻ giữ trong `localStorage`.
- Bỏ ghi `study_sessions` ở cuối bài học (tránh đếm đôi); cuối phiên ôn chỉ ghi dòng đánh dấu `minutes = 0` (khóa chống ghi đôi).

### 03/10/2026 — Hết giờ
- Hết giờ = phút đã học hôm nay ≥ `dailyLimitMinutes` + phút thêm hôm nay (`settings.bonus = { date, minutes }`, thêm vào schema Zod, mặc định null). Giới hạn null = không bao giờ hết giờ.
- Chặn ở server bằng `requireActiveLearner({ allowTimeUp })`; server action và `/time-up`, `/profiles` bỏ qua để không mất kết quả bé vừa làm. Hết giờ giữa bài: làm nốt câu rồi mới chuyển `/time-up`.
- Thêm giờ: PIN/mật khẩu bố mẹ (dùng chung hàm kiểm với cổng bố mẹ, có giới hạn thử); mỗi lần +10 phút và luôn còn ít nhất 10 phút.
- Không làm: khung giờ được học trong ngày (GĐ2), màn đặt giới hạn (task 11), cảnh báo trước khi hết giờ.
