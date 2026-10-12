# Tiến độ — 33-audit-family-student-preview — Audit layout modal Họ vần Xem như học sinh theo Impeccable

Trạng thái chung: ✅ · Cập nhật lần cuối: 12/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|------|-----|------------|---------|
| 0 | Kế hoạch & Báo cáo Audit Impeccable | ✅ | Đã được duyệt |
| 1 | Tái cấu trúc vị trí thanh điều khiển xem thử previewBar | ✅ | Tích hợp vào header của bài học, không che lấp nội dung |
| 2 | Tối ưu layout khung Đọc cả đoạn và Bản đồ họ vần | ✅ | Thêm scroll nội bộ mượt mà, căn chỉnh thẻ lẻ thẳng hàng |
| 3 | Kiểm tra tương tác, Responsive, A11y và đóng task | ✅ | Detector 0 lỗi, tsc/lint/test/build sạch 100% |

## Nhật ký

### Bước 0 — Kế hoạch & Báo cáo Audit Impeccable (12/10/2026)
- Đã làm: Khởi tạo task 33, phân tích chi tiết lỗi đè lấn giao diện từ ảnh chụp màn hình thực tế của người dùng. Áp dụng kỹ năng Impeccable audit 5 chiều kích (Accessibility, Performance, Theming, Responsive, Implementation Integrity). Lập phương án thiết kế và kỹ thuật chi tiết vào `plan.md`.
- File tạo/sửa: `docs/tasks/33-audit-family-student-preview/*`, `docs/tasks/README.md`.
- Kết quả kiểm tra: Người dùng duyệt kế hoạch.

### Bước 1 — Tái cấu trúc vị trí thanh điều khiển xem thử previewBar (12/10/2026)
- Đã làm: Chuyển `.previewBar` từ vị trí trôi nổi ở đáy màn hình sang tích hợp trực tiếp vào thanh đầu bài học (`LessonFrame extra`) trong `StepsPreview.tsx` và `questions.module.css`. Khi ở chế độ mini-game, sử dụng thanh nổi gọn gàng ở góc trên bên phải. Loại bỏ hoàn toàn lỗi che khuất chữ và nút loa trong bài học.
- File tạo/sửa: `src/features/admin/StepsPreview.tsx`, `src/features/admin/questions.module.css`.
- Kết quả kiểm tra: `npx tsc --noEmit` 0 lỗi.

### Bước 2 — Tối ưu layout khung Đọc cả đoạn và Bản đồ họ vần (12/10/2026)
- Đã làm:
  - Chuyển `ReadAloudParagraph` compact sang layout co giãn động Flexbox: loại bỏ `max-height` cố định, đặt `flex: 1; min-height: 0;` để tự động chiếm trọn vẹn 100% không gian còn lại sau khi Bông và Bản đồ Họ vần render. Danh sách câu `.body` tự co giãn `flex: 1; min-height: 0;`, chỉ cuộn nội bộ khi số câu nhiều (7–10 câu), còn khi ít câu (2–3 câu) thì không hiện thanh cuộn.
  - Cập nhật `lesson.module.css`: `.main` giữ `overflow: hidden` và `.foot` có `position: relative; z-index: var(--z-lift);`, loại bỏ hoàn toàn thanh cuộn dọc ngoài cùng trên màn hình bài học Tiểu học.
  - Tối ưu `family.module.css`: `.stage` cao 100% của `.main`, `gap: min(var(--space-2), 1dvh);`, thêm class `.reading { flex: 1; min-height: 0; }`.
  - Sửa lỗi typography trong `ClickableWords.module.css`: loại bỏ margin âm trên `.punct` và `.kw` để các dấu câu `.`, `!` không còn bị giật lùi đè lên các chữ cái cuối từ (`together.`, `snake!`).
  - Sửa căn lề thẻ lẻ trong `FamilyMap.module.css` sang `.side li:only-child`, giúp thẻ từ thứ 3 thẳng hàng ngay ngắn với cột 1.
- File tạo/sửa: `src/components/wordlab/ReadAloudParagraph.module.css`, `src/components/wordlab/FamilyMap.module.css`, `src/features/word-family/family.module.css`, `src/features/word-family/FamilyPlayer.tsx`, `src/features/lesson/lesson.module.css`, `src/components/lesson/ClickableWords.module.css`.
- Kết quả kiểm tra: Giao diện bài học co giãn động linh hoạt, vừa vặn tuyệt đối màn hình 1366×768 / 1440×900, không bị co kéo, không có thanh cuộn dọc ngoài màn hình, chữ và dấu câu sắc nét rõ ràng.

### Bước 3 — Kiểm tra tương tác, Responsive, A11y và đóng task (12/10/2026)
- Đã làm: Chạy detector Impeccable (`impeccable detect --json`) đạt 0 findings; kiểm tra toàn diện chất lượng kỹ thuật; xử lý cơ chế fallback model AI thông minh khi gặp lỗi bận HTTP 503.
- File tạo/sửa: Toàn bộ các file của task 33, `src/server/ai/gemini.ts`, `src/server/ai/gemini.test.ts`, `.env.example`.
- Kết quả kiểm tra: `npm test` (753 tests) 100% pass, `npx tsc --noEmit` 0 lỗi, `npm run lint` 0 lỗi, `npm run build` thành công 100%.

## Trạng thái chung
Task 33 đã hoàn thành toàn bộ các bước và vượt qua mọi tiêu chí kiểm tra. Đã giải quyết triệt để các lỗi hiển thị phát sinh và tối ưu luồng gọi AI.
