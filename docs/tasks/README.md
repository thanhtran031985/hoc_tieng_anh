# Danh sách task GĐ1

Bảng tổng các task của giai đoạn 1. Mỗi thư mục có một `task.md` (Mục tiêu, Phạm vi, Thiết kế, Quyết định kiến trúc, Các bước có Kiểm tra). Bảng này là nguồn của `npm run tasks:dashboard`: giữ đúng các cột `#`, `Task`, `Trạng thái`, `Phụ thuộc`, `Nhánh git`.

| # | Task | Trạng thái | Phụ thuộc | Nhánh git |
|---|---|---|---|---|
| 01 | [01-setup](01-setup/task.md) — Khởi tạo dự án | ✅ | — | `feat/01-setup` |
| 02 | [02-ui-kit](02-ui-kit/task.md) — Bộ thành phần giao diện Tiểu học | ⬜ | 01 | `feat/02-ui-kit` |
| 03 | [03-db-core](03-db-core/task.md) — Cơ sở dữ liệu lõi và lộ trình 10 cấp | ⬜ | 01 | `feat/03-db-core` |
| 04 | [04-auth-profiles](04-auth-profiles/task.md) — Đăng nhập gia đình và hồ sơ bé | ⬜ | 02, 03 | `feat/04-auth-profiles` |
| 05 | [05-content-l1-l2](05-content-l1-l2/task.md) — Nội dung mẫu cấp 1–2 | ⬜ | 03 | `feat/05-content-l1-l2` |
| 06 | [06-home-map](06-home-map/task.md) — Trang chủ và bản đồ | ⬜ | 02, 04, 05 | `feat/06-home-map` |
| 07 | [07-lesson-player](07-lesson-player/task.md) — Khung bài học và 4 dạng bài cơ bản | ⬜ | 02, 05, 06 | `feat/07-lesson-player` |
| 08 | [08-review-notebook](08-review-notebook/task.md) — Ôn tập lặp lại và Sổ từ | ⬜ | 07 | `feat/08-review-notebook` |
| 09 | [09-placement](09-placement/task.md) — Bài xếp lớp | ⬜ | 07 | `feat/09-placement` |
| 10 | [10-time-limit](10-time-limit/task.md) — Giới hạn giờ học | ⬜ | 04, 07 | `feat/10-time-limit` |
| 11 | [11-parent-area](11-parent-area/task.md) — Khu vực bố mẹ: tổng quan và cài đặt | ⬜ | 04, 08, 10 | `feat/11-parent-area` |
| 12 | [12-admin-content](12-admin-content/task.md) — Quản trị nội dung cơ bản | ⬜ | 03, 05 | `feat/12-admin-content` |

Task 11 và 12 cần thiết kế Prompt 3 trước khi làm giao diện.

## Thứ tự làm đề xuất
1. **01 → 02 → 03** dựng nền: dự án, bộ thành phần, cơ sở dữ liệu.
2. **04 → 05** đăng nhập, hồ sơ và nội dung cấp 1–2 (05 có thể soạn song song với 04).
3. **06 → 07 → 08** phần bé học hằng ngày. Xong 08 là bé đã dùng được.
4. **09, 10** xếp lớp và giới hạn giờ.
5. **11, 12** khu bố mẹ và quản trị, chờ thiết kế Prompt 3.

## Điểm cần bố/mẹ quyết định
- **Hình minh họa từ vựng:** đã chốt (02/10/2026) vẽ SVG cùng phong cách rồng Bông cho mọi từ cấp 1–2 (task 05).
- **Giọng đọc:** GĐ1 dùng giọng có sẵn của trình duyệt. Tệp mp3 chất lượng cao để sang GĐ2.
- **Cách tính sao:** bản thiết kế dùng tỷ lệ đúng (3 sao ≥ 90%, 2 sao ≥ 70%), khác PRD Phần F (đếm số lần sai). Task 07 đang theo bản thiết kế.
