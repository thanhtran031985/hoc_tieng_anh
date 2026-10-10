# Quyết định — 25-word-explorer — Khám phá từ

Ghi các quyết định đã chốt, thay đổi so với task.md và vấn đề phát sinh.

| Ngày | Quyết định | Lý do |
|---|---|---|
| 10/10/2026 | Người dùng ủy quyền làm liền cả task: các điểm "DỪNG chờ continue" tự duyệt và ghi vào đây. | Yêu cầu "toàn quyền, làm xong task thì làm task khác". |
| 10/10/2026 | Đáp án bé đoán bằng hình là đáp án đánh dấu `guess` (không đánh dấu thì đáp án đầu), thay vì luôn là đáp án đầu. | Dữ liệu mẫu của thiết kế có nhánh đoán đáp án không đứng đầu (cat: "paws", "jump"; bird: "on the tree"). |
| 10/10/2026 | `word_readings.owner_id` không có khóa ngoại; xóa từ thì ứng dụng dọn đoạn văn. | Cột trỏ tới hai bảng (từ, họ vần của task 26). |
| 10/10/2026 | 17 hình đáp án thiết kế có mà kho hình chưa có được sinh bằng `scripts/gen-explorer-art.mjs` vào `public/media/pictures/`. | Không sửa `designs/`; hình lấy nguyên nét từ `Bong.pic`. |
| 10/10/2026 | Tự khám phá (`/explore/[wordId]`) và bản in chỉ cần hồ sơ thuộc tài khoản đang đăng nhập và Khám phá đã xuất bản, không đòi từ đã nằm trong Sổ từ. | Nội dung học dùng chung (bài học cũng cho mọi bé xem), không phải dữ liệu riêng của bé; trong bài học bé bấm In khi từ chưa vào Sổ từ. |
| 10/10/2026 | Thời gian chữ sáng khi đọc cả đoạn (420/640 ms) đặt ở `READ_WORD_MS`, không thêm vào `WORDLAB`. | Test `constants.test.ts` buộc `WORDLAB` khớp đúng `designs/tokens.json`. |
| 10/10/2026 | Trong bài học, thanh tiến độ của khung vẫn đếm theo bước; số nhánh đã mở hiện ở dòng lời của Bông (“n/N nhánh”). | Khung bài học dùng chung cho mọi dạng bài, tiến độ do `LessonPlayer` giữ. |
| 10/10/2026 | “Nói theo” chỉ để tập nói: ghi âm + nhận diện (nếu hồ sơ bật Chấm phát âm), không lưu bản ghi, không tính sao. | Tự khám phá không tính điểm; bản ghi của bé không bao giờ công khai nên không lưu khi không cần. |
| 10/10/2026 | Xuất bản bài học có bước “Khám phá từ” bị chặn khi từ chưa xuất bản Khám phá. | Bản Nháp không tới bé, bước sẽ bị bỏ qua lặng lẽ nên báo ngay lúc soạn. |

