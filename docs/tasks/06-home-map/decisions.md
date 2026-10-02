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
