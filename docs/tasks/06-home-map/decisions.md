# Quyết định — 06-home-map

### 02/10/2026 — Bản đồ đảo chia 2 trang × 4 vùng
- Bối cảnh: thiết kế `Screen06-IslandMap` vẽ 4 vùng × 5 chặng + trùm; database mỗi cấp 1–4 có 8 chủ đề, mỗi chủ đề 3–6 bài thường + 1 trận trùm.
- Quyết định: giữ bố cục 4 vùng; mỗi cấp có trang "Vùng 1–4" và "Vùng 5–8" (hai chip ở đầu bản đồ), mở bản đồ thì vào trang có bài đang học. Số chặng 3–6 của mỗi vùng được rải đều dọc đường đi của vùng.
- Lý do: bạn chọn phương án này (giữ đúng thiết kế, bé không phải cuộn).
- Ảnh hưởng: thêm chip chuyển trang không có trong thiết kế.

### 02/10/2026 — Quy tắc mở khóa
- Chuỗi tuyến tính trên các bài thường của cấp (thứ tự chủ đề, thứ tự bài); bài đầu luôn mở; bài k mở khi bài k−1 đạt từ 1 sao.
- Trận trùm mở khi xong mọi bài thường của chủ đề; trùm KHÔNG chặn chủ đề kế (bé không bị kẹt, hợp nguyên tắc không phạt).
- Mở khóa tay (bố mẹ) và bài thi lên cấp thuộc task 09/11.

### 02/10/2026 — Cấp trên tổng quan và cấp chưa có nội dung
- Cấp nhỏ hơn cấp hiện tại là "đã qua", bằng là "đang học", lớn hơn là "còn khóa" (hộp thoại nhẹ nhàng khi bấm).
- Cấp chưa có chủ đề `published` (hiện là 5–10) hiện "Sắp có" thay cho bản đồ.
- Xong hết cấp thì trang chủ báo "Bài thi lên cấp sắp có"; chuyển cấp là việc task 09/11, task này không tự chuyển.

### 02/10/2026 — Chuỗi ngày
- `streak.ts` là hàm thuần: `streakForDisplay` (hiển thị) và `recordStudyDay` (tính chuỗi mới). Task 06 chỉ đọc; task 07/08 gọi `recordStudyDay` khi bé hoàn thành bài/lượt ôn.
- Thẻ nghỉ phép 1 thẻ/tuần: bỏ đúng 1 ngày thì dùng thẻ, giữ chuỗi; bỏ từ 2 ngày thì chuỗi về 1. Thẻ nạp lại về 1 khi sang tuần mới (tuần bắt đầu thứ Hai, so với `lastStudyDate`), không cần cột mới.
- Ngày tính theo múi giờ `Asia/Ho_Chi_Minh`.

### 02/10/2026 — Màn "Sắp có" cho các nút chưa làm
- Một component `ComingSoon` dùng chung; route mỏng `/collection`, `/room`, `/notebook`, `/review`, `/lesson/[lessonId]` để không có nút nào dẫn tới 404. Task 07/08 thay các route này bằng màn thật.
- Thêm biểu cảm `tiec` và `xaydung` cho `Mascot` (cùng thành phần MascotMore); `tiec` chưa dùng ở task này.

### 02/10/2026 — Nhiệm vụ hôm nay và các số trên trang chủ
- "Nhiệm vụ hôm nay X/Y": nhiệm vụ Ôn tập có khi còn thẻ đến hạn hoặc hôm nay đã ôn; xong khi hết thẻ đến hạn và hôm nay có ôn (đọc `answer_logs` nguồn `review`). Nhiệm vụ bài học có khi còn bài tiếp theo hoặc hôm nay đã xong bài (đọc `lesson_attempts.finishedAt`). Hai bảng này chỉ được ghi từ task 07/08.
- Bé mới (chưa xong bài nào, không có thẻ ôn): chỉ hiện "Bài đầu tiên!" + lời nhắn, không có dòng Ôn tập và không có bộ đếm.
- "Hôm nay: X/Y phút": X là tổng `study_sessions.minutes` từ 00:00 giờ Việt Nam; Y là `settings.dailyGoalMinutes` (mặc định 10).
- Hình mẫu trên dòng Ôn tập chỉ lấy từ đã có hình (không hiện khung trống).
- Nhãn "Sổ từ": số thẻ ôn tập của bé ("N từ đã học"); task 08 có thể đổi cách đếm.

### 02/10/2026 — Khác với thiết kế (Screen04)
- Thẻ cấp: hòn đảo dùng hình của màn tổng quan (`LevelArt`, cây theo từng cấp), vì thiết kế chỉ vẽ mầm cho cấp 1 trong khi màn tổng quan vẽ hạt giống cho cấp 1; dùng một bộ hình cho mọi cấp.
- Nút Cài đặt (bánh răng) mở hộp thoại có "Đổi bé" và "Đăng xuất" (giữ chức năng của trang giữ chỗ cũ); khu vực bố mẹ vào qua cổng PIN ở màn chọn hồ sơ, sẽ thêm lối vào ở task 11.
- Cấp đã xong hết hoặc chưa có nội dung: thẻ "Bài tiếp theo" đổi thành "Bé đã xong cấp này!" / "Cấp N sắp có" kèm nút "Xem các cấp" (Enter).
- Thêm `shortcut` cho `ButtonLink` để hiện nhãn phím Enter trên nút điều hướng.

### 02/10/2026 — Tổng quan 10 cấp
- Bấm cấp đang học vào thẳng bản đồ; cấp đã qua hỏi "Ôn lại?" (Enter = Ôn lại); cấp khóa mở hộp thoại giải thích, không chặn gắt. Dùng đúng lời của thiết kế.
- Cấp THCS (6–10) vẫn hiện trên con đường; chưa có bản đồ thành phố nên bản đồ cấp 5–10 hiện "Sắp có" (Bước 3).
- Lời gợi ý của Bông chỉ hiện với bé mới ở cấp 1 chưa xong bài nào.

### 03/10/2026 — Bản đồ đảo
- Vùng = chủ đề, chặng = bài thường, trùm = bài `unit_test`; mỗi trang 4 vùng, mở bản đồ thì vào trang có chặng đang học. Số chặng 3–6 của mỗi vùng được rải đều dọc đường 5 điểm của thiết kế (`zoneNodePositions`, có test); đúng 5 chặng thì dùng nguyên tọa độ thiết kế.
- Chặng khóa vẫn bấm được để đọc lời nhắn nhẹ nhàng (đúng thiết kế) nhưng không có nút vào bài; trùm khóa tương tự.
- Thẻ nổi rộng 400px (thiết kế 340px) vì mỗi chặng có 5–8 từ, xếp 2 cột, mỗi từ có hình (nếu có), loa và chữ.
- Nhãn dưới ô trùm chỉ ghi "Trận trùm" (tên chủ đề đã có ở nhãn vùng); tên đầy đủ nằm trong `aria-label` và thẻ nổi. Hai nhãn vùng ở hàng dưới dịch ngang để không chồng lên nhãn trùm khi tên chủ đề dài.
- Cấp còn khóa với bé: `/map/N` chuyển về `/levels` (không lộ nội dung); cấp chưa có chủ đề đã xuất bản hiện "Đảo/Thành phố N này đang được xây" + nút Mở Sổ từ (đang dẫn tới màn "Sắp có").
- Chặng xong ở cấp 4 có màu cấp (xanh) gần giống màu chặng đang học (`brand`); phân biệt nhờ ô lớn hơn, vầng sáng, nhịp sáng và rồng đứng trên, đúng thiết kế.

### 03/10/2026 — Điểm bảo mật `/admin` chuyển sang task 12
- Bối cảnh: khi vẽ sơ đồ tổng quan thấy `/admin` chỉ cần role `admin`, không cần mở cổng bố mẹ (`src/app/(admin)/admin/page.tsx:11`); tài khoản đăng ký đầu tiên tự là admin (`src/server/users.ts:8-10`). PRD dòng 126 ghi quản trị nằm sau khu bố mẹ.
- Quyết định (bạn chọn): không sửa ở task 06, làm đúng ở task 12. Đã ghi vào `docs/tasks/12-admin-content/decisions.md`.
- Ảnh hưởng: hiện `/admin` chỉ là trang giữ chỗ nên chưa lộ dữ liệu; task 12 phải chặn trước khi có nội dung.

### 03/10/2026 — Sửa 3 mục sau rà soát
- Bạn chọn sửa cả 3. Mục 3: giữ tiêu đề "Đảo này đang được xây" của thiết kế Screen06 và thêm nhãn "Sắp có" để khớp task.md.
- Token mới thêm vào `globals.css`: `--lift-tile`, `--sink-tile`, `--lift-stop`.

### 03/10/2026 — Tổng kết: khác với task.md gốc
- Bản đồ chia 2 trang × 4 vùng (thiết kế chỉ vẽ 4 vùng, dữ liệu có 8 chủ đề mỗi cấp); bạn đã chọn.
- Trận trùm không chặn chủ đề kế (PRD không nói rõ); bố mẹ mở khóa tay và bài thi lên cấp thuộc task 09/11.
- Thêm màn "Sắp có" dùng chung cho 5 route giữ chỗ (`/collection`, `/room`, `/notebook`, `/review`, `/lesson/[lessonId]`) để mọi nút đều có đích; task 07/08 thay bằng màn thật.
- Chuỗi ngày: task này chỉ hiển thị; hàm ghi `recordStudyDay` chờ task 07/08 gọi.
- Cấp chưa có bài hiện tiêu đề "Đảo này đang được xây" của thiết kế, kèm nhãn "Sắp có" theo task.md.
- Điểm bảo mật `/admin` chưa qua cổng bố mẹ: chuyển sang task 12.
- Checklist test thủ công chưa chạy khi đóng task; bạn test sau.
