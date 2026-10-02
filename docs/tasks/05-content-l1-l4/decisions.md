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
| 02/10/2026 | Câu ví dụ được kiểm "đúng cấp" bằng script: chỉ dùng từ mục tiêu cấp 1…N (tách theo chữ), tên riêng (Tom, Anna…) và danh sách từ thông dụng trong `scripts/check-content.mjs` (đại từ, trợ động từ, giới từ và động từ cơ bản như like, want, go, see, make, watch, start) | Từ cấp 4 như have, do, go, get là cấu trúc cơ bản nên không thể cấm ở cấp 3 |
| 02/10/2026 | Loại từ lưu bằng tiếng Anh (noun, verb, adjective…), giao diện tự đổi sang nhãn tiếng Việt khi hiển thị | Cột `part_of_speech` là dữ liệu, không phải chữ giao diện |
| 02/10/2026 | Hình lưu thành tệp `public/media/pictures/<từ>.svg` (đúng task.md) và dùng màu viền đã giải sẵn `#2b2440` (giá trị token dragon-line) vì `<img>` không đọc được biến CSS; `WordPicture` nhận `src` (từ cột `words.image`), hình mẫu của thiết kế (`pictures.ts`) vẫn vẽ nội tuyến | Phục vụ trực tiếp từ public/, không phình bundle |
| 02/10/2026 | Hình cấp 3 sinh bằng script từ bộ khối dùng chung (`scripts/pictures/`), không vẽ tay từng tệp | Cùng phong cách, dễ sửa hàng loạt; nguồn sự thật là script, tệp SVG là sản phẩm sinh ra |
| 02/10/2026 | Cấp 3: 160/250 từ có hình. Bỏ hình cho 90 từ trừu tượng hoặc không vẽ rõ được: thứ, tháng, tuần/tháng/năm/cuối tuần/ngày; giờ và trạng từ thời gian (wake up, get up, afternoon, half, quarter, hour, minute, early, late, always, usually, often, sometimes, never, every, today, tomorrow, yesterday, now, after, before, tidy); tính từ miêu tả (young, thin, fat, slim, weak, handsome, pretty, beautiful, kind, friendly, funny, clever, lazy, shy, polite, naughty, brave, quiet, noisy); sở thích trừu tượng (hobby, song, collect, cook, poem, fun, interesting, boring, favourite, love, enjoy); holiday, trip, journey; hungry, thirsty, delicious; sport, team, match, win, lose, race, score; thunder. Danh sách đầy đủ: `node scripts/check-pictures.mjs 3 --list` | Hình chỉ cho từ cụ thể; hình mơ hồ làm bé nhầm khi chọn hình |
| 02/10/2026 | Seed nội dung chỉ xóa-tạo lại bài học của chủ đề khi chưa bé nào học bài nào của chủ đề đó (không có `lesson_attempts`, `lesson_progress`); nếu đã có thì giữ nguyên bài học, vẫn cập nhật từ | Xóa bài học sẽ xóa theo kết quả học của bé (khóa ngoại cascade) |
| 02/10/2026 | Bài chỉ gồm thẻ từ (từ trừu tượng không có hình, ví dụ ngày/tháng) vẫn được tạo | 4 dạng bài của GĐ1 đều cần hình; câu hỏi chữ cho từ trừu tượng để GĐ sau (ngân hàng câu hỏi) |
| 02/10/2026 | Cấp 4 vẽ thêm một số động từ rõ nghĩa (buy, cut, drive, ride, see, hear, say, send…) để chủ đề "Chuyện đã qua" có câu nghe-chọn-hình và trận trùm; các động từ khó vẽ (do, get, have, come, leave, make, take, know…), tính từ, trạng từ không có hình | Không có hình thì chủ đề chỉ gồm thẻ từ, không có trận trùm |
| 02/10/2026 | Cấp 4: 200/300 từ có hình. Không có hình: danh sách đầy đủ bằng `node scripts/check-pictures.mjs 4 --list` | Như cấp 3 |
| 02/10/2026 | Thêm `cap-nhat-*/**` vào bỏ qua của ESLint | Thư mục tải về `cap-nhat-thiet-ke/` có mã không thuộc dự án, làm `npm run lint` lỗi |
