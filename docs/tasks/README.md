# Danh sách task GĐ1

Bảng tổng các task của giai đoạn 1. Mỗi thư mục có một `task.md` (Mục tiêu, Phạm vi, Thiết kế, Quyết định kiến trúc, Các bước có Kiểm tra). Bảng này là nguồn của `npm run tasks:dashboard`: giữ đúng các cột `#`, `Task`, `Trạng thái`, `Phụ thuộc`, `Nhánh git`.

| # | Task | Trạng thái | Phụ thuộc | Nhánh git |
|---|---|---|---|---|
| 01 | [01-setup](01-setup/task.md) — Khởi tạo dự án | ✅ | — | `feat/01-setup` |
| 02 | [02-ui-kit](02-ui-kit/task.md) — Bộ thành phần giao diện Tiểu học | ✅ | 01 | `feat/02-ui-kit` |
| 03 | [03-db-core](03-db-core/task.md) — Cơ sở dữ liệu lõi và lộ trình 10 cấp | ✅ | 01 | `feat/03-db-core` |
| 04 | [04-auth-profiles](04-auth-profiles/task.md) — Đăng nhập gia đình và hồ sơ bé | ✅ | 02, 03 | `feat/04-auth-profiles` |
| 05 | [05-content-l1-l4](05-content-l1-l4/task.md) — Khung chương trình 10 cấp và nội dung cấp 1–4 | ✅ | 03 | `feat/05-content-l1-l4` |
| 06 | [06-home-map](06-home-map/task.md) — Trang chủ và bản đồ | ✅ | 02, 04, 05 | `feat/06-home-map` |
| 07 | [07-lesson-player](07-lesson-player/task.md) — Khung bài học và 4 dạng bài cơ bản | ✅ | 02, 05, 06 | `feat/07-lesson-player` |
| 08 | [08-review-notebook](08-review-notebook/task.md) — Ôn tập lặp lại và Sổ từ | ✅ | 07 | `feat/08-review-notebook` |
| 09 | [09-placement](09-placement/task.md) — Bài xếp lớp | ✅ | 05, 07 | `feat/09-placement` |
| 10 | [10-time-limit](10-time-limit/task.md) — Giới hạn giờ học | ✅ | 04, 07 | `feat/10-time-limit` |
| 11 | [11-parent-area](11-parent-area/task.md) — Khu vực bố mẹ: tổng quan và cài đặt | ✅ | 04, 08, 10 | `feat/11-parent-area` |
| 12 | [12-admin-content](12-admin-content/task.md) — Quản trị nội dung, nhập chủ đề bằng Excel | ✅ | 03, 05 | `feat/12-admin-content` |
| 13 | [13-gd2-ui-kit](13-gd2-ui-kit/task.md) — Bộ thành phần GĐ2 và khung bài học mới | ✅ | 02, 07 | `feat/13-gd2-ui-kit` |
| 14 | [14-tts-audio](14-tts-audio/task.md) — Giọng đọc mp3 và âm phonics | ✅ | 12, 13 | `feat/14-tts-audio` |
| 15 | [15-lesson-types-a](15-lesson-types-a/task.md) — Dạng bài mới: ghép âm, sắp xếp câu, nghe gõ, điền từ | ✅ | 13, 14 | `feat/15-lesson-types-a` |
| 16 | [16-story-reading](16-story-reading/task.md) — Truyện tranh đọc to và đọc hiểu ngắn | ✅ | 15 | `feat/16-story-reading` |
| 17 | [17-speaking](17-speaking/task.md) — Luyện nói từ và câu | ✅ | 15 | `feat/17-speaking` |
| 18 | [18-mini-games](18-mini-games/task.md) — Mini game: mưa từ, bong bóng, đập chuột, đua xe | ✅ | 13, 14 | `feat/18-mini-games` |
| 19 | [19-content-new-types-l1-l4](19-content-new-types-l1-l4/task.md) — Nội dung dạng bài mới cho cấp 1–4 | ✅ | 15, 16, 17, 18 | `feat/19-content-new-types-l1-l4` |
| 20 | [20-boss-level-test](20-boss-level-test/task.md) — Trận trùm, bài thi lên cấp và rồng Bông lớn lên | ✅ | 18, 19 | `feat/20-boss-level-test` |
| 21 | [21-rewards-collection](21-rewards-collection/task.md) — Bộ sưu tập sticker và huy hiệu | ✅ | 13, 20 | `feat/21-rewards-collection` |
| 22 | [22-room-shop](22-room-shop/task.md) — Phòng của tớ, cửa hàng và thẻ nghỉ phép | ✅ | 21 | `feat/22-room-shop` |
| 23 | [23-notebook-plus](23-notebook-plus/task.md) — Sổ từ bổ sung và in danh sách từ | ✅ | 08, 13 | `feat/23-notebook-plus` |
| 24 | [24-parent-gd2](24-parent-gd2/task.md) — Khu bố mẹ GĐ2: kỹ năng, mở khóa thủ công, khung giờ học | 🔄 | 11, 17, 20 | `feat/24-parent-gd2` |
| 25 | [25-word-explorer](25-word-explorer/task.md) — Khám phá từ | ⬜ | 14, 15, 23 | `feat/25-word-explorer` |
| 26 | [26-word-family](26-word-family/task.md) — Họ vần, Ghép chữ đầu và liên kết qua lại | ⬜ | 25 | `feat/26-word-family` |
| 27 | [27-content-wordlab](27-content-wordlab/task.md) — Nội dung Khám phá từ và Họ vần | ⬜ | 26 | `feat/27-content-wordlab` |
| 28 | [28-content-l5](28-content-l5/task.md) — Nội dung cấp 5 (Cây lớn, Flyers) | ⬜ | 19, 20, 27 | `feat/28-content-l5` |
| 29 | [29-fix-ui-findings](29-fix-ui-findings/task.md) — Sửa lỗi giao diện sau rà soát test tự động (lỗi 1–7, 10, 11) | ✅ | 12 | `feat/29-fix-ui-findings` |

Task 11 cần thiết kế Prompt 3, task 12 cần thiết kế Prompt 3 và Prompt 4 trước khi làm giao diện.

## Thứ tự làm đề xuất
1. **01 → 02 → 03** dựng nền: dự án, bộ thành phần, cơ sở dữ liệu.
2. **04 → 05** đăng nhập và hồ sơ, rồi khung chương trình 10 cấp và nội dung cấp 1–4 (cấp 3–4 trước).
3. **06 → 07 → 08** phần bé học hằng ngày. Xong 08 là bé đã dùng được.
4. **09, 10** xếp lớp và giới hạn giờ.
5. **11, 12** khu bố mẹ và quản trị, chờ thiết kế Prompt 3 và 4.

## Thứ tự làm đề xuất GĐ2
1. **13 → 14** bộ thành phần GĐ2 và giọng đọc mp3 (task 14 dừng ở Bước 0 để bố/mẹ chọn dịch vụ đọc).
2. **15 → 18** các dạng bài mới, truyện, luyện nói, mini game.
3. **19 → 20** nội dung dạng bài mới cấp 1–4, trận trùm và bài thi lên cấp.
4. **21 → 24** bộ sưu tập, phòng của tớ, sổ từ bổ sung, khu bố mẹ GĐ2.
5. **25 → 27** Khám phá từ, Họ vần và nội dung của hai phần này.
6. **28** nội dung cấp 5, trọn bộ tiểu học.

## Điểm cần bố/mẹ quyết định
- **Hình minh họa từ vựng:** đã chốt (02/10/2026) vẽ SVG cùng phong cách rồng Bông cho các từ cấp 1–4 (task 05).
- **Nội dung GĐ1:** đã chốt (02/10/2026) bé học lớp 4, nên soạn nội dung chi tiết cấp 1–4, làm cấp 3–4 trước. Khung chương trình (chủ đề và từ mục tiêu) soạn sẵn cho cả 10 cấp (task 05); chủ đề thêm sau nhập bằng Excel (task 12).
- **Giọng đọc:** GĐ1 dùng giọng có sẵn của trình duyệt. Tệp mp3 chất lượng cao để sang GĐ2.
- **Cách tính sao:** bản thiết kế dùng tỷ lệ đúng (3 sao ≥ 90%, 2 sao ≥ 70%), khác PRD Phần F (đếm số lần sai). Task 07 đang theo bản thiết kế.
