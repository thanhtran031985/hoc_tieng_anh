# Quyết định — 08-review-notebook

### 03/10/2026 — Tên file luật 5 hộp
- Bối cảnh: task.md ghi `src/lib/rules/review.ts`, nhưng task 07 đã tạo và test `review-box.ts`.
- Quyết định: giữ `review-box.ts`, bổ sung vào đó; không đổi tên.

### 03/10/2026 — Lịch hộp và màu
- Thiết kế (Screen19) ghi lịch cứng "mỗi ngày / 2 ngày / 4 ngày / 1 tuần / 2 tuần", PRD Phần F và code là 1/3/7/14/30 ngày: theo PRD, nhãn sinh từ `BOX_INTERVAL_DAYS`.
- PRD C12 tả màu viền thẻ đỏ nhạt/cam/…; thiết kế và token `mastery-1..5` là tím nhạt/vàng/xanh dương/tím/xanh lá: theo thiết kế.

### 03/10/2026 — Chỉ ôn từ có hình, chỉ từ đến hạn
- 3 dạng câu hỏi ôn (8.2–8.4) đều cần hình nên từ không có hình không vào phiên ôn; số "từ cần ôn" ở trang chủ cũng chỉ đếm từ có hình để hai nơi khớp nhau.
- Server chỉ nhận kết quả của từ có thẻ đến hạn hôm nay; tối đa 15 mục (Tiểu học) / 20 (THCS; chưa có câu ngữ pháp nên chỉ là từ).

### 03/10/2026 — Thưởng ôn tập
- PRD Phần F: Ôn tập 1 xu mỗi từ (TH), 2 XP mỗi mục (THCS). Bản xem trước hiện "+12 sao, +20 xu" (số mẫu). Quyết định: mỗi từ ôn 1 sao (theo thiết kế) + 1 xu (TH) hoặc 2 XP (THCS) (theo PRD). Chỉ ghi khi hoàn thành hết phiên.

### 03/10/2026 — Phần tự suy ra
- Hộp thoại phóng to thẻ trong Sổ từ (nghe từ và câu ví dụ): thiết kế chỉ có thẻ nhỏ + loa; dựng từ `Dialog`, `SpeakerButton`, `WordPicture` theo PRD C12.
- Màn "Hẹn cậu lần sau nhé!" (Screen20 trạng thái trống) dùng khi bé dừng giữa phiên; không ghi gì lên server, tiến độ dở giữ ở `localStorage`.

### 03/10/2026 — Tổng kết: khác với task.md gốc
- Giữ `src/lib/rules/review-box.ts` (task 07) thay vì tạo `review.ts`; thêm `review-play.ts` cho phiên ôn.
- Chỉ từ có hình vào phiên ôn và vào số "từ cần ôn" ở trang chủ; tối đa 15 mục Tiểu học, 20 THCS (chưa có câu ngữ pháp).
- Thưởng: 1 sao + 1 xu (TH) hoặc 2 XP (THCS) mỗi từ; chỉ ghi khi ôn xong hết phiên; dừng giữa chừng không ghi lên server.
- Lịch hộp theo PRD (1/3/7/14/30 ngày), màu theo token thiết kế; nhãn lịch sinh từ `BOX_INTERVAL_DAYS`.
- Xem lớn thẻ trong Sổ từ tự dựng (thiết kế không có); chưa lọc theo mức, chưa in sổ.
- Sơ đồ: thêm `lifecycle-5-hop-on-tap`, vẽ lại hành trình của bé và kiến trúc; `workflow-khu-nguoi-lon` và `sequence-ket-thuc-bai` không đổi (task 08 không chạm).
