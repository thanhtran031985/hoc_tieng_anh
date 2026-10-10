# Quyết định — 26-word-family — Họ vần, Ghép chữ đầu và liên kết qua lại

Ghi các quyết định đã chốt, thay đổi so với task.md và vấn đề phát sinh.

| Ngày | Quyết định | Lý do |
|---|---|---|
| 10/10/2026 | Kế hoạch (plan.md) được duyệt; người dùng ủy quyền toàn bộ, các điểm “DỪNG chờ continue” tự duyệt và ghi ở đây. | Chỉ dẫn “toàn quyền” của người dùng. |
| 10/10/2026 | Thêm 3 cột ngoài mô tả task vào `word_families`: `build_rime` (vần để ghép, mặc định = vần), `decoys` (JSON chữ đầu nhiễu), `trap_note` (lời Bông giải thích ô Bẫy chính tả). | Họ “-ir” hiển thị vần “ir” nhưng ghép bằng “irt” (shirt, skirt); chữ đầu nhiễu và lời giải thích bẫy cần chỗ lưu; thiết kế (`bundle.js`) có đủ ba thứ này. |
| 10/10/2026 | Từ thật của Ghép chữ đầu tính từ thành viên Cùng âm của họ: từ nào viết đúng “chữ đầu (1–3 chữ cái) + vần để ghép”. Cần ít nhất 2 từ thật (`BUILD_MIN_REAL`, đặt ngoài `WORDLAB`) thì họ mới có Ghép; mục tiêu = nhỏ hơn của 5 (`buildGoal`) và số từ thật. | Kho từ mới chỉ có shirt, skirt cho “-ir” (dirt do task 27 thêm); dùng 3 thì “-ir” chưa ghép được. `WORDLAB` bị `constants.test.ts` buộc khớp tokens.json nên hằng số mới để riêng. |
| 10/10/2026 | Bậc thứ 5 không mở: khi ngăn xếp đã 4 bậc, các nút đi tiếp bị khóa kèm dòng giải thích, bé bấm Quay lại. Bản xem trước của thiết kế đẩy bậc cũ nhất ra; ta theo `task.md` (“bậc thứ 5 không mở thêm”). | Đúng yêu cầu kiểm tra của Bước 3. |
| 10/10/2026 | Backspace ở Ghép chữ đầu: có chữ trong ô thì xóa chữ, ô trống thì Quay lại. | Thiết kế dùng Backspace cho cả hai việc; tách theo ngữ cảnh để không xung đột. |
| 10/10/2026 | Bước `word_family` và `build_family` không tạo `ItemResult` có `wordId` (không chấm, không phạt); cấu hình `{ familyId }` như `story`. | Từ trong họ có thể là từ bé chưa học nên không được ghi vào thẻ ôn tập; thiết kế nói sai không bị phạt. |
| 10/10/2026 | Bảng kết thúc Ghép chữ đầu trong bài hiện 3 sao nhưng KHÔNG hiện xu (thiết kế ghi “+20 xu”). | Bước này không tạo mục chấm nên không đổi sao hay xu thật của bài; mini game khác hiện xu vì lượt chơi của chúng được tính vào sao của bài. Không hiện số xu không có thật. |
| 10/10/2026 | Ở Ghép chữ đầu, các chữ cái a–z được bắt ở pha capture (kể cả f, h) và “?” là Gợi ý. | Khung bài học dùng phím F bật học tập trung; chữ f phải gõ được. Bước 2 đã kiểm: gõ f không bật học tập trung. |
| 10/10/2026 | “Họ vần” và “Ghép chữ đầu” trong bài: Enter trên một thẻ đang có focus là nghe thẻ đó (như thiết kế); muốn Tiếp tục thì bỏ focus khỏi thẻ hoặc bấm nút Tiếp tục. | Thiết kế (`mountFam`) để nút có focus tự kích hoạt bằng Enter. |
