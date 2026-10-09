# WordLinks

Liên kết qua lại — dải nút liên kết ở đầu Khám phá từ, Họ vần, Ghép chữ đầu; chỉ hiện ở chế độ tự khám phá, ẩn trong khung bài học. `Bong.WordLinks(stack, buttons)` (= `Bong.W.links`).

- Quay lại (Backspace) về màn trước; ở bậc đầu thì mờ. Ở Ghép chữ, Backspace xoá chữ trong ô trước.
- Đường dẫn: bậc đã qua là nút (`crumb-ink`), bậc đang ở đậm (`crumb-now`), tối đa 4 bậc (`links-max-depth`).
- Khám phá từ: “Họ vần của bird: -ir” (chỉ khi từ thuộc một họ). Họ vần: nút Ghép · Khám phá trên từng thẻ. Ghép chữ đầu: bấm từ trong “Đã tìm được” để khám phá, nút “Về họ vần”.
- Dải nền `links-bg`, viền `links-line`, cao `size-links-strip`; nút liên kết viền `brand`, chữ `brand-shade`. Xem cả lượt đi ở Screen53-WordJourney.

Thẻ xem trước có 3 cỡ màn (1440×900 · 1366×768 · 1920×1080) và đủ 4 trạng thái dữ liệu (Bình thường · Đang tải · Trống · Lỗi có Thử lại). Vừa 1366×768 không cuộn. Dùng được bằng bàn phím và chuột; viền focus `focus` 4px khi dùng Tab. Làm sai không bị phạt, không đếm ngược; bấm vào từ hay câu tiếng Anh nào cũng nghe được.
