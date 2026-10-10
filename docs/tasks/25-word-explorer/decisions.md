# Quyết định — 25-word-explorer — Khám phá từ

Ghi các quyết định đã chốt, thay đổi so với task.md và vấn đề phát sinh.

| Ngày | Quyết định | Lý do |
|---|---|---|
| 10/10/2026 | Người dùng ủy quyền làm liền cả task: các điểm "DỪNG chờ continue" tự duyệt và ghi vào đây. | Yêu cầu "toàn quyền, làm xong task thì làm task khác". |
| 10/10/2026 | Đáp án bé đoán bằng hình là đáp án đánh dấu `guess` (không đánh dấu thì đáp án đầu), thay vì luôn là đáp án đầu. | Dữ liệu mẫu của thiết kế có nhánh đoán đáp án không đứng đầu (cat: "paws", "jump"; bird: "on the tree"). |
| 10/10/2026 | `word_readings.owner_id` không có khóa ngoại; xóa từ thì ứng dụng dọn đoạn văn. | Cột trỏ tới hai bảng (từ, họ vần của task 26). |
| 10/10/2026 | 17 hình đáp án thiết kế có mà kho hình chưa có được sinh bằng `scripts/gen-explorer-art.mjs` vào `public/media/pictures/`. | Không sửa `designs/`; hình lấy nguyên nét từ `Bong.pic`. |
