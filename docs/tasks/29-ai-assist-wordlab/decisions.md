# Quyết định — 29-ai-assist-wordlab — AI hỗ trợ soạn Khám phá từ và Họ vần

Ghi các quyết định đã chốt, thay đổi so với task.md và vấn đề phát sinh.

| Ngày | Quyết định | Lý do |
|---|---|---|
| 11/10/2026 | Task cũ `29-fix-ui-findings` đổi số thành `999-fix-ui-findings` (thư mục, README); nhánh git giữ tên `feat/29-fix-ui-findings` vì đã có trên remote. | Người dùng muốn số 29 cho task AI; task sửa lỗi giao diện để cuối danh sách. |
| 11/10/2026 | Dùng Google Gemini (khóa miễn phí của người dùng) qua `fetch`, không cài gói SDK; model đặt ở `GEMINI_MODEL`, mặc định `gemini-flash-latest`. | Không cần gói mới (CLAUDE.md cấm cài khi chưa hỏi); REST đơn giản, có sẵn JSON có cấu trúc. |
| 11/10/2026 | Tắt “suy nghĩ” của Gemini (`thinkingBudget: 0`) khi gọi. | Thử thật: 6,5 giây so với 31 giây (một lần quá 60 giây). |
| 11/10/2026 | Chỉ gửi từ vựng, nghĩa, cấp, tên hình; không gửi dữ liệu học sinh/tài khoản; AI chỉ điền form, không lưu hay xuất bản; giới hạn 6 lượt/phút/admin. | Bản miễn phí của Google có thể dùng dữ liệu để cải thiện sản phẩm; tiết kiệm hạn mức. |
| 11/10/2026 | Khóa API lưu ở `.env` bằng cách nối thêm dòng (không đọc `.env`); người dùng nên tạo lại khóa khi xong vì khóa từng dán trong chat. | CLAUDE.md: không đọc `.env`; người dùng yêu cầu lưu giúp. |
