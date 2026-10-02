# Quyết định — 05-content-l1-l4 — Khung chương trình 10 cấp và nội dung cấp 1–4

Ghi các quyết định đã chốt, thay đổi so với task.md và vấn đề phát sinh.

| Ngày | Quyết định | Lý do |
|---|---|---|
| 02/10/2026 | Mở rộng từ cấp 1–2 lên cấp 1–4, làm cấp 3–4 trước (task cũ tên `05-content-l1-l2`) | Bé đang học lớp 4 |
| 02/10/2026 | Khung chương trình soạn sẵn cho 10 cấp; bài học tạo tự động từ danh sách từ | Bố/mẹ không phải giáo viên, không tự soạn bài |
| 02/10/2026 | Gộp phần khung chương trình vào task 05 thay vì tách task 13 | Làm task theo đúng thứ tự số |
| 02/10/2026 | Hình minh họa vẽ SVG cùng phong cách rồng Bông | Bố/mẹ chọn trên thẻ quyết định |
| 02/10/2026 | Không tạo `src/lib/content-queries.ts` như plan; dùng lại `src/server/curriculum.ts` (`listUnits` mặc định `publishedOnly`) | Đã có sẵn lớp truy vấn lộ trình lọc theo `published`, thêm tệp nữa là trùng |
| 02/10/2026 | `planned` thêm vào enum `ContentStatus` dùng chung nên `lessons.status` và `questions.status` cũng nhận giá trị này, nhưng chỉ `units` dùng | Một enum chung, tách riêng sẽ phải thêm enum mới không cần thiết |
| 02/10/2026 | Migration sinh bằng `prisma migrate diff --from-config-datasource` rồi `migrate deploy` | `migrate dev` từ chối chạy ở môi trường không tương tác |
| 02/10/2026 | Thứ, tháng, `English`, `Vietnamese` viết hoa trong khung; script kiểm tra cho phép các từ này | Danh từ riêng; viết thường sẽ sai chính tả |
| 02/10/2026 | Từ nhiều chữ (`ice cream`, `wake up`, `next to`…) và `o'clock` được giữ trong danh sách từ mục tiêu | Là đơn vị từ vựng của Starters/Movers |
| 02/10/2026 | Số từ mục tiêu cấp 6–10: 400, 400, 400, 500, 500 (suy từ số từ cộng dồn PRD A1: 1.700, 2.100, 2.500, 3.000, 3.500) | PRD chỉ ghi số cộng dồn cho THCS |
| 02/10/2026 | Mỗi cấp THCS 10 chủ đề (task.md cho 10–12) | Đủ phủ các chủ điểm trong mô tả cấp ở PRD |
| 02/10/2026 | `match_pairs` không có `wordId`: nối các từ có hình của chính bài đó, số cặp ở `config.pairCount` (3–6); task 07 chọn từ từ các thẻ từ của bài | Schema bước chỉ có một `wordId`; không đổi schema của task 03 |
| 02/10/2026 | Chia bài: tối đa 8 từ, chia đều (13 → 7 + 6); trường hợp lẻ như 9 từ chia 5 + 4 | Không có cách chia 9 từ thành các bài 5–8 từ |
| 02/10/2026 | Trận trùm là bài `kind = unit_test`, tối đa 12 bước, xen nghe-chọn-hình và chọn-từ-cho-hình, trộn có hạt giống (cùng kết quả khi seed lại); chủ đề không có từ nào có hình thì không có trận trùm | Trận trùm cần hình; chạy seed lại không đổi nội dung |
| 02/10/2026 | Số lựa chọn mỗi câu = min(3, số từ có hình) cho nghe-chọn-hình, min(3, số từ) cho chọn-từ-cho-hình; dưới 2 thì bỏ dạng đó | Cần đủ đáp án nhiễu |
| 02/10/2026 | Thêm `npm test` = `node --test "src/**/*.test.ts"` | Chưa có test runner; Node có sẵn, không cài package |
