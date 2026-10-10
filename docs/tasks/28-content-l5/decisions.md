# Quyết định — 28-content-l5 — Nội dung cấp 5 (Cây lớn, Flyers)

Ghi các quyết định đã chốt, thay đổi so với task.md và vấn đề phát sinh.

| Ngày | Quyết định | Lý do |
|---|---|---|
| 10/10/2026 | Nội dung mỗi chủ đề cấp 5: 5 sắp xếp câu, 5 điền từ, 3 nghe-gõ câu, 3 luyện nói, 2 đọc hiểu (18 câu; cấp 4 là 15); không ghép âm; 2 truyện cho cả cấp. Bảng này nằm ở `EXPECTED[5]` của `scripts/check-content-extra.mjs`. | Cấp 5 nên dày hơn cấp 4 một chút (ngữ pháp will/going to/must/should, đoạn 3–5 câu); đổi số lượng bằng cách sửa bảng và dữ liệu rồi seed lại. |
| 10/10/2026 | `EXTRA_LEVELS`: sắp xếp, điền từ, luyện nói, nghe-gõ, đọc hiểu dùng được tới cấp 5; ghép âm giữ cấp 1–3. | Khớp luật task 19 và bảng ở trên. |
| 10/10/2026 | Hình cấp 5 chỉ vẽ cho từ cụ thể (~160/400 từ); chủ đề Du lịch 26/52. Hình vẽ trong `scripts/pictures/level-05-<nhóm>.mjs`, gộp ở `level-05.mjs` (đúng cách của cấp 4). Từ đã có hình ở các cấp trước hoặc của Khám phá từ thì không vẽ lại (khóa trùng làm `gen-pictures` báo lỗi). | Cùng nguyên tắc task 05: hình mơ hồ làm bé nhầm; từ trừu tượng chỉ có thẻ từ, nghe và câu. |
| 10/10/2026 | Bước 0 chờ bạn duyệt rồi mới làm 7 chủ đề còn lại (đúng task.md); các bước sau tự chạy tới hết theo ủy quyền. | Như task 27. |
