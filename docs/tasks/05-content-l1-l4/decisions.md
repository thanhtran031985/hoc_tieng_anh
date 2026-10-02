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
