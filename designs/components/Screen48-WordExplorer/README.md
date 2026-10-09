# Screen48-WordExplorer

Khám phá từ — sơ đồ câu hỏi quanh một từ.

- Thẻ từ lớn bên trái (`size-word-card`): hình, “bird”, phiên âm, loa, câu “A bird can fly.” có loa.
- Từ thẻ toả ra 4–6 nhánh đường cong đánh số (`branch-line`, `size-branch-line`); sơ đồ co giãn theo số nhánh (`branch-min` 4, `branch-max` 6) — ví dụ “cat” 5 nhánh.
- Chưa mở: câu hỏi + ô “?” (`q-mark-bg`, `q-mark-ink`). Đang hỏi: Bông đọc câu hỏi, đường đậm `branch-line-active`, bé chọn 1 trong 2–3 hình (phím 1–3) rồi Kiểm tra. Sai: cam nhẹ, chọn lại; sai 2 lần một hình sai mờ đi. Esc thôi hỏi nhánh.
- Đã mở: nền `branch-node-open`, đáp án là hình + từ/cụm từ có loa (brown, yellow, blue; seeds, insects, berries; wings, feathers, a beak, claws; fly in the sky, build a nest; in the nest, on the tree).
- Mở đủ: Bông chúc mừng, khung “Đọc cả đoạn” (ReadAloudParagraph) gom các câu trả lời, “Nói theo” (micro tím `rec`, câu “A bird can fly.”), “In” (Screen49), “Xem lại sơ đồ”.
- Phím: 1–6 chọn nhánh, ↑ ↓ đi giữa các nhánh, Space nghe lại câu hỏi, H gợi ý, Enter kiểm tra.

Hai cách hiện: trong khung bài học (thanh tiến độ, × mở “Dừng bài học?”, chân bài Nghe lại · Gợi ý · Kiểm tra) và mở từ Sổ từ (tự khám phá: chỉ có nút Đóng, có dải liên kết WordLinks, không tính điểm). Dùng chung `Bong.W.app(host, ctx, { mode, stack })`.

Thẻ xem trước có 3 cỡ màn (1440×900 · 1366×768 · 1920×1080) và đủ 4 trạng thái dữ liệu (Bình thường · Đang tải · Trống · Lỗi có Thử lại). Vừa 1366×768 không cuộn. Dùng được bằng bàn phím và chuột; viền focus `focus` 4px khi dùng Tab. Làm sai không bị phạt, không đếm ngược; bấm vào từ hay câu tiếng Anh nào cũng nghe được.
