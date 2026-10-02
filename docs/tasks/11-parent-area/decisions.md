# Quyết định — 11-parent-area

### 03/10/2026 — Bộ thành phần khu người lớn
- Mỗi hàm `Bong.A` thành một component React + CSS module dùng token ở `src/components/adult/` (task 12 dùng lại). Theme `thcs` áp bằng `data-theme="thcs"` trên `AdultArea`, không đổi màn Tiểu học. Thêm token chữ `--text-adm-*` và kích thước `--adm-*` vào `globals.css`; thêm icon thiếu vào `ui/Icon`.
- Chọn con ở thanh trên bằng `?kid=<id>` (server đọc được, đi bằng bàn phím); id lạ hoặc của tài khoản khác bị bỏ qua.
- Menu: Tổng quan, Cài đặt làm trong task này; Kỹ năng, Kết quả thi, Bài viết & ghi âm, Lịch kiểm tra hiện mờ "Sắp có" (GĐ2–3); tab Quản trị chỉ bấm được với role admin (task 12).

### 03/10/2026 — Phạm vi các màn (kế hoạch đã duyệt)
- Cổng ở `/parent/unlock`, sai 5 lần khóa 5 phút đếm ở server (bộ nhớ tiến trình); không làm "Quên mật khẩu?".
- Tổng quan: số liệu từ `study_sessions`, `review_cards`, `lesson_progress`, `lesson_attempts`, `answer_logs`; CEFR ước lượng theo cấp (PRD A1); chuỗi ngày chỉ có "hiện tại" (chưa lưu kỷ lục).
- Cài đặt: giới hạn giờ lưu `settings.dailyLimitMinutes` (task 10 dùng ngay), khung giờ chỉ lưu (chưa áp dụng, GĐ2); bỏ ngày được học, nhắc còn 5 phút, thêm giờ khi thi, nhạc nền, đọc hướng dẫn tiếng Việt vì chưa có dữ liệu/chức năng. Xóa hồ sơ là vĩnh viễn (không có khôi phục 30 ngày như bản xem trước); đặt lại tiến độ không có tùy chọn giữ bài viết/ghi âm.
