# So sánh code với task.md và PRD — task 12 (quản trị nội dung)

Cập nhật: 03/10/2026 · Bản chốt code: `19da596`. Danh sách đầy đủ nằm ở [../tong-quan/so-sanh.md](../tong-quan/so-sanh.md) (các dòng 1, 16 và 33–39). Tóm tắt riêng task 12:

| # | Mức | Điểm khác | Code (file:dòng) |
|---|---|---|---|
| 1 | **quan trọng (bạn quyết)** | Câu hỏi ở Ngân hàng câu hỏi chưa vào bài bé học: trình học dựng bước từ từ vựng, chưa đọc bảng `questions`. | `src/lib/rules/lesson-play.ts:51` |
| 2 | nhỏ | Từ vựng không có Nháp/Xuất bản, lớp SGK, Unit SGK (schema không có). | `src/server/admin/vocab.ts:76` |
| 3 | nhỏ | Câu hỏi chỉ 8.2–8.4; thẻ từ 8.1 thêm ở Soạn bài học. | `src/lib/rules/admin-questions.ts:9` |
| 4 | nhỏ | Xóa là xóa hẳn, chưa có Thùng rác 30 ngày. | `src/server/admin/tree.ts:216` |
| 5 | nhỏ (GĐ2) | Tạo giọng đọc mp3 để mờ "Sắp có"; chưa tải tệp âm thanh. | `src/features/admin/MediaView.tsx:312-314` |
| 6 | nhỏ | Hình tải lên mọi tài khoản đăng nhập xem được (hình minh họa từ, không phải dữ liệu riêng). | `src/app/uploads/[name]/route.ts:7` |
| 7 | nhỏ | Bài tự tạo từ Excel với từ chưa có hình chưa xuất bản được; chủ đề trùng chủ đề đã có bài bị chặn. | `src/lib/rules/admin-tree.ts:40-46` |

Đã khớp task.md: chỉ role `admin` + cổng bố mẹ vào được `(admin)` (layout, server action, route handler); tệp tải lên ở `storage/uploads/`; nhập Excel xem trước báo lỗi từng dòng, chỉ lưu khi hết lỗi, đọc tệp ở server và kiểm lại khi lưu; chủ đề khớp chủ đề khung thì gắn vào đó; mọi thứ nhập vào lưu dạng Nháp; không xuất bản bài dưới 3 bước hoặc chưa có hoạt động, hoặc chủ đề trống; "Xem như học sinh" dùng chính component bài học của task 07.
