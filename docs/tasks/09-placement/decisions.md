# Quyết định — 09-placement

### 03/10/2026 — Không đổi database
- Không thêm cột "đã xếp lớp". Kết quả = cập nhật `learners.current_level_id` khi bé bấm "Bắt đầu học" + `answer_logs` nguồn `exam` (cho báo cáo bố mẹ sau này).
- Bài xếp lớp chỉ vào được khi bé chưa xong bài học nào và chưa có nhật ký `exam`; ngược lại về `/home`.

### 03/10/2026 — Luật thích ứng (src/lib/rules/placement.ts)
- Bắt đầu ở cấp = lớp, kẹp vào [1, cấp cao nhất có nội dung published] (GĐ1: cấp 4). Đúng 3 liên tiếp lên 1 cấp, sai 2 liên tiếp xuống 1 cấp, đổi cấp thì đếm lại; "Tớ chưa biết" tính là sai; đủ 12 câu thì dừng (PRD 10–15 câu, thiết kế 12).
- Cấp đề xuất = cấp cao nhất có ≥ 2 câu và đúng ≥ 70%; không cấp nào đạt thì cấp thấp nhất đã gặp.

### 03/10/2026 — Câu hỏi và chọn câu
- Server gửi sẵn "kho" câu nghe-chọn-hình theo từng cấp có nội dung; client chọn câu kế theo cấp hiện tại (không gọi server giữa các câu). Server tính lại cấp đề xuất từ danh sách trả lời khi lưu.

### 03/10/2026 — Phạm vi và phần tự suy ra
- THCS (lớp ≥ 6) ngoài phạm vi (GĐ3): màn giới thiệu hiện trạng thái trống của thiết kế với nút "Bắt đầu ở Cấp N".
- Dừng giữa chừng → màn kết quả trạng thái trống ("Mới được N câu thôi"), không ghi gì. "Bỏ qua" có hộp thoại xác nhận.
- Chọn cấp khác: chỉ cấp Tiểu học (1–5) đã có nội dung (hiện 1–4); thiết kế vẽ 5 đảo.
- Nút quay lại ở màn giới thiệu: "Về chọn hồ sơ" → `/profiles` (hồ sơ đã được tạo), khác bản xem trước ("Quay lại tạo hồ sơ"). Tạo hồ sơ xong chuyển tới `/placement`.
- Không làm: trạng thái lỗi "Loa chưa phát được" của Screen16 (giọng đọc của trình duyệt không có sự kiện lỗi để bắt); lưu tiến độ dở.
