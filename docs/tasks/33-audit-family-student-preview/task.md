# 33-audit-family-student-preview — Audit layout modal Họ vần Xem như học sinh theo Impeccable

Ngày tạo: 12/10/2026 · Giai đoạn: GĐ2 · Phụ thuộc: 26, 31, 32 · Nhánh: `feat/33-audit-family-student-preview`

> Yêu cầu ngày 12/10/2026: “tạo task mới, audit lại layout theo impeccable , tại modal họ vần vào button xem như học sinh. tạo plan để tôi quyết định”.

## Mục tiêu
1. Thực hiện chẩn đoán và audit kỹ thuật toàn diện (A11y, Performance, Theming, Responsive, Implementation Integrity) theo kỹ năng Impeccable cho modal "Xem như học sinh" của Họ vần (`StepsPreview` khi mở từ `/admin/families`).
2. Sửa lỗi va chạm và đè lấn giao diện nghiêm trọng:
   - Thanh điều khiển chuyển bước xem thử (`.previewBar` `< Bước trước | Bước 1/2 | Bước sau >`) bị định vị absolute ở đáy màn hình, đè trực tiếp lên danh sách câu và nút loa của khung đoạn văn vui `ReadAloudParagraph`.
   - Khung `ReadAloudParagraph` bị chật chội, cạnh tranh không gian với thanh chân trang `LessonFoot` (`[Nghe cả họ Space]`, `[Gợi ý H]`, `[Tiếp tục Enter]`).
   - Cân chỉnh bố cục các thẻ vệ tinh của bản đồ họ vần `FamilyMap` (đặc biệt khi có 7–8 thẻ, các thẻ bên phải như `wake` bị lệch).
3. Đảm bảo trải nghiệm xem trước khớp chuẩn màn hình bài học Tiểu học (1366×768 / 1440×900 không bị tràn, không bị che khuất phím tắt và nội dung).

## Thiết kế
- `designs/components/Screen50-WordFamilies` (Màn Họ vần học sinh)
- `designs/components/Screen51-BuildOnset` (Màn Ghép chữ đầu học sinh)
- `designs/components/Adult23-WordFamilies` (Soạn Họ vần trong Admin)

## Bối cảnh & môi trường
- Chạy trên App Router Next.js, component `StepsPreview.tsx` (`src/features/admin/StepsPreview.tsx`), `FamilyPlayer.tsx` (`src/features/word-family/FamilyPlayer.tsx`), `FamilyMap.tsx` (`src/components/wordlab/FamilyMap.tsx`), `ReadAloudParagraph.tsx` (`src/components/wordlab/ReadAloudParagraph.tsx`).
- Áp dụng các nguyên tắc thiết kế Impeccable (chế độ Operate/Experience cho bài học, không để UI admin can thiệp che phủ UI bài học học sinh).

## Quyết định kiến trúc
1. **Di dời và tinh chỉnh `.previewBar` của `StepsPreview`:**
   - Không đặt absolute ở góc dưới đáy màn hình (`bottom: calc(var(--size-lesson-foot)...)`).
   - Đưa `.previewBar` lên đỉnh màn hình (bên cạnh nút thoát [x] ở header hoặc thanh công cụ nổi tinh tế ở góc trên bên phải) để hoàn toàn giải phóng khu vực tương tác học tập bên dưới.
2. **Layout khung đoạn văn vui (`ReadAloudParagraph`):**
   - Đảm bảo khoảng cách an toàn (padding/margin) với `LessonFoot`.
   - Nếu số câu nhiều (lên đến 7–10 câu), hỗ trợ scroll mượt mà nội bộ trong khung bài đọc để toàn bộ màn hình bài học vẫn vừa vặn khung nhìn 1366×768 chuẩn mà không tràn layout.
3. **Cân chỉnh lưới bản đồ Họ vần (`FamilyMap`):**
   - Tối ưu hóa khoảng cách và tính đối xứng của các cột thẻ từ 2 bên trái/phải so với tâm vần trung tâm.
4. **Phím tắt và khả năng truy cập (A11y):**
   - Giữ nguyên và bảo toàn đầy đủ các phím tắt học sinh (`Space`, `Enter`, `H`, `Esc`, `P`, `T`).

## Các bước
### Bước 0 — Kế hoạch & Báo cáo Audit Impeccable
Chạy chẩn đoán Impeccable, phân tích chi tiết lỗi layout trên ảnh chụp thực tế, lập kế hoạch chi tiết trong `plan.md` để người dùng duyệt.
**Kiểm tra:** `plan.md` đầy đủ điểm đánh giá và giải pháp xử lý.

### Bước 1 — Tái cấu trúc vị trí thanh điều khiển xem thử `previewBar`
Chuyển vị trí `.previewBar` trong `StepsPreview.tsx` và `questions.module.css` lên góc trên an toàn, loại bỏ hoàn toàn việc đè lấn lên nội dung bài học.
**Kiểm tra:** Chữ trong đoạn văn và các nút loa hiển thị trọn vẹn, không bị bất kỳ phần tử nào che lấp.

### Bước 2 — Tối ưu layout khung Đọc cả đoạn và Bản đồ họ vần
Cân chỉnh CSS của `FamilyPlayer.tsx`, `family.module.css`, `ReadAloudParagraph.module.css` và `FamilyMap.module.css` để đảm bảo tỉ lệ phân bổ giữa bản đồ từ và đoạn văn cân đối, không đè lên footer bài học.
**Kiểm tra:** Giao diện bài học vừa vặn màn hình chuẩn, các thẻ từ đối xứng hài hòa.

### Bước 3 — Kiểm tra tương tác, Responsive, A11y và đóng task
Kiểm tra toàn bộ phím tắt, các chế độ xem thử (1 bước và nhiều bước), chạy bộ test tự động và build production.
**Kiểm tra:** `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build` không lỗi.

## Phạm vi
- Được tạo/sửa: `src/features/admin/StepsPreview.tsx`, `src/features/admin/questions.module.css`, `src/features/word-family/family.module.css`, `src/features/word-family/FamilyPlayer.tsx`, `src/components/wordlab/ReadAloudParagraph.module.css`, `src/components/wordlab/FamilyMap.module.css`, tài liệu task.
- KHÔNG làm trong task này: Không thay đổi logic bài học hay cơ chế tính điểm của học sinh.

## Tiêu chí hoàn thành
- Modal "Xem như học sinh" không còn tình trạng bị đè lấn hay che mất nội dung.
- Thanh chuyển bước xem thử nằm ở vị trí chuyên nghiệp, không vướng vào bài học.
- Đoạn văn và bản đồ họ vần hiển thị trọn vẹn, thẩm mỹ cao theo chuẩn Impeccable.
- `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build` đều vượt qua.
