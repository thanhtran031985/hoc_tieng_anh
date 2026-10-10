# Quyết định — 28-content-l5 — Nội dung cấp 5 (Cây lớn, Flyers)

Ghi các quyết định đã chốt, thay đổi so với task.md và vấn đề phát sinh.

| Ngày | Quyết định | Lý do |
|---|---|---|
| 10/10/2026 | Nội dung mỗi chủ đề cấp 5: 5 sắp xếp câu, 5 điền từ, 3 nghe-gõ câu, 3 luyện nói, 2 đọc hiểu (18 câu; cấp 4 là 15); không ghép âm; 2 truyện cho cả cấp. Bảng này nằm ở `EXPECTED[5]` của `scripts/check-content-extra.mjs`. | Cấp 5 nên dày hơn cấp 4 một chút (ngữ pháp will/going to/must/should, đoạn 3–5 câu); đổi số lượng bằng cách sửa bảng và dữ liệu rồi seed lại. |
| 10/10/2026 | `EXTRA_LEVELS`: sắp xếp, điền từ, luyện nói, nghe-gõ, đọc hiểu dùng được tới cấp 5; ghép âm giữ cấp 1–3. | Khớp luật task 19 và bảng ở trên. |
| 10/10/2026 | Hình cấp 5 chỉ vẽ cho từ cụ thể (~160/400 từ); chủ đề Du lịch 26/52. Hình vẽ trong `scripts/pictures/level-05-<nhóm>.mjs`, gộp ở `level-05.mjs` (đúng cách của cấp 4). Từ đã có hình ở các cấp trước hoặc của Khám phá từ thì không vẽ lại (khóa trùng làm `gen-pictures` báo lỗi). | Cùng nguyên tắc task 05: hình mơ hồ làm bé nhầm; từ trừu tượng chỉ có thẻ từ, nghe và câu. |
| 10/10/2026 | Bước 0 chờ bạn duyệt rồi mới làm 7 chủ đề còn lại (đúng task.md); các bước sau tự chạy tới hết theo ủy quyền. | Như task 27. |
| 11/10/2026 | 9 từ của `family-words.json` (fire, fan, glad, hit, rock, gate, soon, show, mall) là từ vựng cấp 5 nên bỏ khỏi tệp đó; họ vần dùng bản cấp 5. | Mỗi từ chỉ ở một cấp (task 05); seed trên DB trống 0 từ trùng. |
| 11/10/2026 | Cấp 5: 147 hình mới + 6 hình đáp án Khám phá; 151/400 từ có hình (38 %), 249 từ trừu tượng không hình (`thieu-hinh.md`). | Hình mơ hồ làm bé nhầm; cấp 5 nhiều từ trừu tượng hơn cấp 1–4 (64–93 %). |
| 11/10/2026 | Trùm cấp 5 là biến thể Vua Khỉ Lém (màu lông × phụ kiện chưa dùng); không vẽ nhân vật mới. | Như task 20. |
| 11/10/2026 | `EXAM_LAST_LEVEL` = 5: bài thi 5 → 6 giống cấp 1–4 (20 câu, 80 %); đậu thì bé sang cấp 6, `/map/6` ghi “Sắp có” cho tới GĐ3. Huy hiệu `level:5` “Qua đảo Cây lớn” (Big Tree Island). | Task.md Bước 3. |
| 11/10/2026 | Họ vần cấp 5: 6 họ cuối từ (-ous, -tion, -ment, -ful, -ture) và -ack. Ghép chữ đầu chỉ chơi được ở -ack (5 từ thật); -ous, -tion, -ment, -ful (0) và -ture (3) không ghép được vì chữ đầu dài hơn 3 chữ cái. | Từ cấp 5 phần lớn dài; chữ đầu 1–3 chữ cái của Ghép chữ đầu không áp dụng. Màn Họ vần vẫn đầy đủ (từ cùng âm, Bẫy, đoạn văn). -ful mức 3 và -ack mức 1 vì có từ cấp thấp hơn. |
| 11/10/2026 | Khám phá từ cấp 5: 30 danh từ cụ thể, 4–5 nhánh mỗi từ (4 nhánh khi một nhánh phụ không có hình đáp án rõ). | Cùng luật task 27; đáp án có hình và nghĩa Việt. |
| 11/10/2026 | Ghép âm không dùng ở cấp 5; mỗi chủ đề 18 câu (5/5/3/3/2). | Theo bảng ở Bước 0 (`EXPECTED[5]`). |
| 11/10/2026 | `buildLessons` bản 2 từ cấp 5 chia câu hỏi nối tiếp qua các dạng (`SPREAD_EXTRAS_FROM_LEVEL = 5`, `distribute(..., offset)`); cấp 1–4 giữ cách chia cũ. | Chủ đề 7 bài mà mỗi dạng chỉ 2–5 câu thì chia từng dạng riêng làm 3 bài cuối không có câu hỏi nào (task.md: mỗi bài ≥ 1 câu hỏi). Đổi cách chia cấp 1–4 sẽ dời câu giữa các bài của bé đã học. |
| 11/10/2026 | Spec Playwright không thêm; luồng thi cấp 5 → 6 kiểm bằng Edge. | Không có màn mới. |
