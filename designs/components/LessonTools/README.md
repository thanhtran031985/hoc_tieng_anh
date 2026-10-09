# LessonTools

2 nút tròn trên đầu khung bài học — `Bong.LessonTools` (= `Bong.R.tools` + `Bong.R.wireTools`).

- Toàn màn hình (F): bật thì nền tối `focus-scrim`, ẩn mọi thứ ngoài bài (lớp `.b-nofocus`); Esc thoát chế độ này trước khi hỏi “Dừng bài học?”.
- Âm thanh: mở bảng với công tắc Nhạc nền, Hiệu ứng (role=switch) và thanh kéo Âm lượng (← → 10%, `volume-track`, `volume-fill`). Giọng đọc tiếng Anh luôn bật. Esc hoặc Tab ra ngoài để đóng.
- Gọi: `Bong.R.tools({ focus })` lấy HTML; `Bong.R.wireTools(scr, ctx, { realFullscreen, onFocus })` → `{ setFocus, isFocus, openPanel, closePanel }`.
- Thẻ thành phần, không có dữ liệu nên không có 4 trạng thái.

Viền focus `focus` 4px khi dùng Tab; dùng được hoàn toàn bằng bàn phím.
