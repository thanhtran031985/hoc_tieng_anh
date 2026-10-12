# Quyết định — 33-audit-family-student-preview

### 12/10/2026 — Khởi tạo task 33
- Bối cảnh: Khi mở modal "Xem như học sinh" từ ngăn kéo Soạn họ vần (`FamilyDrawer.tsx` trên `/admin/families`), giao diện gặp các lỗi va chạm thị giác nghiêm trọng: thanh `< Bước trước | Bước 1/2 | Bước sau >` (`.previewBar`) trôi nổi ở đáy màn hình và đè lên các câu tiếng Anh cùng nút loa của khung "Đọc cả đoạn", thẻ từ của `FamilyMap` bị lệch, và chân trang bị chen chúc.
- Quyết định:
  1. Audit toàn diện theo 5 chiều kích của kỹ năng Impeccable (A11y, Performance, Theming, Responsive, Implementation Integrity).
  2. Di dời thanh điều hướng xem thử `previewBar` lên góc trên an toàn (top-right của overlay, cạnh nút [x] hoặc dạng toolbar tinh tế) để tách biệt hoàn toàn công cụ quản trị khỏi nội dung học sinh.
  3. Cân chỉnh layout và padding cho `FamilyMap` cùng `ReadAloudParagraph` để màn hình vừa vặn khung chuẩn 1366×768 / 1440×900, không bị che khuất footer hay tràn viền.
- Lý do: Đảm bảo giao diện đạt chuẩn thẩm mỹ cao cấp (Impeccable craft), tôn trọng nguyên tắc thiết kế giáo dục Tiểu học và bảo đảm trải nghiệm xem trước chính xác 100% như màn hình học sinh thực tế.
- Ảnh hưởng: `StepsPreview.tsx`, `questions.module.css`, `FamilyPlayer.tsx`, `family.module.css`, `ReadAloudParagraph.module.css`, `FamilyMap.module.css`.

### 12/10/2026 — Hoàn thành các điều chỉnh kỹ thuật theo Impeccable
- Quyết định:
  1. Tích hợp thanh chuyển bước xem thử vào header của bài học thông qua prop `extra` của `LessonFrame`, tận dụng con số `1/2` có sẵn trên header và không để bất kỳ phần tử nổi nào đè lên khu vực học tập.
  2. Thêm thanh cuộn nội bộ tự nhiên cho danh sách câu trong `ReadAloudParagraph` khi ở chế độ `compact` (`max-height: min(28dvh, 220px)`), giúp khung đọc co giãn linh hoạt và luôn giữ trọn khoảng cách an toàn với chân trang bài học.
  3. Căn chỉnh lưới thẻ từ của `FamilyMap` về cấu trúc ngay ngắn 2 cột, chỉ căn giữa khi chỉ có 1 thẻ (`only-child`), đảm bảo thẻ thứ 3 đối xứng thẳng tắp với các thẻ xung quanh.
- Kết quả: Vượt qua toàn bộ kiểm tra của detector Impeccable (0 findings), tests 752/752 passed, typecheck, lint và build 100% sạch.

### 12/10/2026 — Khắc phục lỗi 3 nút footer đè lên khung đọc và lỗi ký tự cuối câu
- Bối cảnh:
  1. Người dùng phản hồi: 3 nút chân trang (`Nghe cả họ`, `Gợi ý`, `Tiếp tục`) bị đè lên phần "Đọc cả đoạn · câu vui của họ".
  2. Trong "Đọc cả đoạn · câu vui của họ", nội dung các từ cuối câu bị lỗi hiển thị đè ký tự (`together.` bị đè thành `togethec`, `snake!` bị đè thành `snakd`).
- Quyết định & Giải pháp:
  1. Khắc phục lỗi dấu câu đè ký tự cuối (`ClickableWords.module.css`):
     - Loại bỏ `margin-left: -4px` trên `.punct` và `margin: 0 -2px` trên `.kw` (vốn gây giật lùi âm kép 8px khiến dấu câu chồm lên chữ cái cuối cùng của từ).
     - Đặt `.kw { padding: 0 2px; margin: 0; }` và `.punct { margin: 0; }` theo chuẩn typography, hiển thị rõ ràng, mượt mà và sắc nét.
  2. Chuyển sang bố cục co giãn động Flexbox theo góp ý người dùng (loại bỏ scroll màn hình chính, vùng Đọc cả đoạn tự lấp đầy không gian còn lại):
     - Trong `lesson.module.css`: `.main` giữ `overflow: hidden`, bảo toàn nguyên tắc màn hình bài học Tiểu học không bao giờ bị cuộn trang ngoài.
     - Trong `family.module.css`: `.stage` cao 100% của `.main`, `FamilyMap` nhận `flex: none`, và `ReadAloudParagraph` nhận `className={styles.reading}` với `flex: 1; min-height: 0;`.
     - Trong `ReadAloudParagraph.module.css`: `.compact` chuyển sang `flex: 1; min-height: 0; display: flex; flex-direction: column;`, bỏ `max-height` cố định. Phần `.body` nhận `flex: 1; min-height: 0; overflow-y: auto;`.
     - Cơ chế: Khi Bông và Bản đồ Họ vần render chiếm bao nhiêu phần trăm, thì vùng Đọc cả đoạn sẽ tự động co giãn chiếm đúng 100% khoảng trống còn lại. Nếu số câu ít (2-3 câu), hiển thị thoáng đãng và không có bất kỳ scrollbar nào. Nếu số câu nhiều (7-10 câu), chỉ nội bộ danh sách câu trong thẻ cuộn mượt mà mà không bao giờ xô lệch layout hay đè footer.
- Kết quả: Đạt tiêu chuẩn trải nghiệm hoàn hảo không tì vết (Impeccable craft); `npx tsc --noEmit`, `npm run lint`, `npm test` (752/752 tests pass), `npm run build` hoàn thành không một lỗi nào.

### 12/10/2026 — Xử lý lỗi AI bận khi gợi ý câu Họ vần
- Bối cảnh: Khi người dùng bấm "Gợi ý câu bằng AI" trong ngăn kéo Soạn Họ vần, hệ thống liên tục báo lỗi "AI đang bận". Nguyên nhân do model alias trong `.env` (`gemini-flash-latest`) bị Google quá tải trả về HTTP 503, nhưng logic `gemini.ts` cũ ném lỗi dừng ngay lập tức mà không fallback sang model dự phòng.
- Quyết định & Giải pháp:
  1. Thêm `AiOverloadedError` xử lý mã lỗi HTTP 503 và 404, cho phép vòng lặp thử model trong `generateJson` tự động chuyển sang model tiếp theo trong danh sách thay vì dừng sớm.
  2. Cập nhật `DEFAULT_MODELS` đưa `gemini-3.5-flash` và `gemini-3.6-flash` lên đầu (thực tế kiểm tra phản hồi cực nhanh 1.3s - 3.8s, hoạt động 100%).
  3. Cập nhật regex nhận diện hạn mức ngày `/(per[_-]?day|daily|perday)/i` bao quát mọi định dạng từ Google API.
- Kết quả: Gọi AI mượt mà ngay cả khi model đầu tiên bị bận, test tự động đạt 753/753 pass.
