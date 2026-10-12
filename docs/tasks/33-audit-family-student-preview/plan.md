# Kế hoạch & Báo cáo Audit Impeccable — 33-audit-family-student-preview

> **Mục tiêu:** Audit kỹ thuật và trải nghiệm giao diện (UX/UI) theo kỹ năng Impeccable cho modal "Xem như học sinh" của Họ vần (`StepsPreview` khi mở từ `/admin/families`), phân tích ảnh chụp thực tế và đề xuất phương án tối ưu toàn diện.

---

## 1. Báo cáo chẩn đoán theo tiêu chuẩn Impeccable (Audit Report)

### Bảng điểm sức khỏe giao diện (Audit Health Score)

| # | Chiều kích (Dimension) | Điểm (0–4) | Phát hiện chính |
|---|------------------------|------------|-----------------|
| 1 | **Accessibility (A11y)** | 2/4 | `.previewBar` che khuất nội dung chữ và nút loa (`Button` phát âm) của `ReadAloudParagraph`. Không thể focus bằng phím hoặc click chuột vào các phần tử bị đè lấn. |
| 2 | **Performance** | 3.5/4 | CSS chuyển động nhẹ, không thrashing layout. SVG Mascot tối ưu. |
| 3 | **Theming** | 3.5/4 | Sử dụng token `tieu-hoc` và các token nền `--bg`, `--surface`, `--ink`. Cần tinh chỉnh độ tương phản của thanh xem thử Admin trên nền bài học. |
| 4 | **Responsive Design** | 2/4 | Layout bị co thắt và va chạm trên màn hình chuẩn 1366×768 / 1440×900: thanh điều khiển preview định vị `bottom: calc(var(--size-lesson-foot)...)` đè trực tiếp lên danh sách câu. |
| 5 | **Implementation Integrity** | 2/4 | Vi phạm nguyên tắc phân tách tầng (Layer Separation): Công cụ quản trị của Admin (`previewBar`) bị thả trôi vào không gian bài học của học sinh thay vì nằm ở tầng khung quản trị bên trên. |
| **Tổng điểm** | | **13/20** | **Acceptable (Cần tinh chỉnh ngay để đạt chất lượng sản phẩm xuất sắc)** |

---

## 2. Chi tiết các phát hiện theo mức độ nghiêm trọng (P0 – P3)

### [P0 - Blocking] Thanh chuyển bước xem thử (`.previewBar`) che đè nội dung bài học
- **Vị trí:** [src/features/admin/questions.module.css](file:///d:/edu/src/features/admin/questions.module.css#L153-L165) & [src/features/admin/StepsPreview.tsx](file:///d:/edu/src/features/admin/StepsPreview.tsx#L65-L73)
- **Hiện tượng thực tế (nhìn thấy rõ trên ảnh người dùng gửi):**
  - Cụm `< Bước trước | Bước 1 / 2 | Bước sau >` nằm nổi ở góc dưới bên phải, ngay phía trên thanh chân trang bài học.
  - Vị trí này trùng khớp với vùng nội dung của khung **“Đọc cả đoạn · câu vui của họ -ake”**.
  - Kết quả: Các câu tiếng Anh bị đè lấn (chữ `together` bị nút `< Bước trước` cắt ngang thành `togethec`, chữ `snake!` bị đè thành `snakd`), và nút loa phát âm của câu 2 bị che khuất hoàn toàn, không thể click hay nhìn thấy.
- **Giải pháp:**
  - Di chuyển `.previewBar` lên **góc trên bên phải màn hình** (ngang hàng với nút thoát `[x]` của bài học, hoặc gắn trực tiếp vào thanh đầu bài học).
  - Tách bạch hoàn toàn: Thanh công cụ xem thử của Admin nằm ở header; khu vực tương tác bài học của học sinh được giải phóng 100% không gian.

---

### [P1 - Major] Không gian dọc của Khung “Đọc cả đoạn” và Thanh chân trang (`LessonFoot`)
- **Vị trí:** [src/features/word-family/family.module.css](file:///d:/edu/src/features/word-family/family.module.css) & [src/components/wordlab/ReadAloudParagraph.module.css](file:///d:/edu/src/components/wordlab/ReadAloudParagraph.module.css)
- **Hiện tượng:**
  - Khi họ vần có nhiều từ và nhiều câu (như đoạn văn 7–10 câu vừa nâng cấp ở task 32), khung `ReadAloudParagraph` mở rộng xuống phía dưới chạm sát vào footer `LessonFoot` (`Nghe cả họ Space`, `Gợi ý H`, `Tiếp tục Enter`).
  - Thiếu khoảng đệm an toàn (`margin-bottom` / `padding-bottom`) khiến giao diện có cảm giác bị nén ép, chật chội.
- **Giải pháp:**
  - Thiết lập vùng cuộn nội bộ mượt mà (scroll container) cho danh sách câu trong `ReadAloudParagraph` khi số câu vượt quá 4–5 câu, giữ chiều cao tổng thể của khung bài đọc gọn gàng.
  - Đảm bảo khoảng cách an toàn tối thiểu `var(--space-4)` giữa khung đọc và `LessonFoot`.

---

### [P2 - Minor] Bố cục bất đối xứng của các thẻ từ trong Bản đồ họ vần (`FamilyMap`)
- **Vị trí:** [src/components/wordlab/FamilyMap.tsx](file:///d:/edu/src/components/wordlab/FamilyMap.tsx) & `family-map.module.css`
- **Hiện tượng:**
  - Khi có 7 từ cùng âm (ví dụ 4 từ bên trái: `snake`, `cake`, `lake`, `make`; 3 từ bên phải: `take`, `bake`, `wake`), thẻ `wake` bị thụt xuống dưới cùng tạo khoảng trống bất đối xứng ở hàng giữa bên phải.
- **Giải pháp:**
  - Tinh chỉnh cơ chế căn giữa và phân bổ lưới của các thẻ vệ tinh để 3 thẻ bên phải được phân bố đều theo chiều cao hoặc căn lề đối xứng hài hòa với 4 thẻ bên trái.

---

### [P3 - Polish] Phân cấp thị giác và viền bo của thanh xem thử
- **Vị trí:** [src/features/admin/questions.module.css](file:///d:/edu/src/features/admin/questions.module.css#L153)
- **Giải pháp:**
  - Khi đặt ở thanh đầu, thiết kế `.previewBar` theo phong cách capsule/pill hiện đại với bóng đổ nhẹ (`var(--shadow-sm)`), nền kính mờ (`backdrop-filter: blur(8px)`) hoặc thẻ bo tròn sang trọng, hài hòa với giao diện Tiểu học mà vẫn giữ nhận diện của công cụ Admin.

---

## 3. Kế hoạch thực hiện từng bước (Action Plan)

### Bước 0 — Kế hoạch & Báo cáo Audit Impeccable (Hiện tại)
- Lập bản chẩn đoán, đánh giá 5 chiều kích và giải pháp kiến trúc vào `plan.md`.
- Trình người dùng duyệt trước khi viết code.

### Bước 1 — Tái cấu trúc và dời vị trí thanh điều khiển xem thử `previewBar`
1. Sửa [src/features/admin/questions.module.css](file:///d:/edu/src/features/admin/questions.module.css):
   - Thay đổi vị trí `.previewBar` từ `bottom: calc(...)` sang góc trên bên phải:
     `top: var(--space-3); right: calc(var(--space-16) + var(--space-4));` (ngay cạnh nút đóng `[x]` của `LessonFrame`).
   - Tạo kiểu dáng pill/capsule tinh gọn, z-index hợp lý, không che nút đóng bài học và không xâm phạm không gian học tập.
2. Kiểm tra lại [src/features/admin/StepsPreview.tsx](file:///d:/edu/src/features/admin/StepsPreview.tsx): Đảm bảo các nút bấm `Bước trước` / `Bước sau` hoạt động trơn tru và nhận phím tắt rõ ràng.

### Bước 2 — Tối ưu layout khung Đọc cả đoạn và Bản đồ họ vần
1. Cân chỉnh [src/components/wordlab/ReadAloudParagraph.module.css](file:///d:/edu/src/components/wordlab/ReadAloudParagraph.module.css):
   - Đảm bảo danh sách câu có `max-height` linh hoạt và `overflow-y: auto` khi có 6–10 câu, thanh cuộn mảnh tinh tế (`scrollbar-width: thin`).
   - Đảm bảo các nút công cụ của đoạn văn (`Đọc cả đoạn P`, `Đọc chậm`, `Dịch nghĩa T`) và nút loa của từng câu có khoảng cách thoáng đãng, không bị cắt mép chữ.
2. Cân chỉnh [src/features/word-family/family.module.css](file:///d:/edu/src/features/word-family/family.module.css):
   - Bổ sung `padding-bottom` cho `.stage` để luôn cách biệt an toàn với `LessonFoot`.
3. Kiểm tra tính cân đối của `FamilyMap` khi số thẻ từ lẻ hoặc nhiều từ.

### Bước 3 — Kiểm tra tương tác toàn diện, A11y, Responsive & Đóng task
1. Kiểm tra trên trình duyệt:
   - Mở ngăn kéo Soạn họ vần -> Bấm "Xem như học sinh".
   - Kiểm tra bước 1 (Họ vần `word_family`) và bước 2 (Ghép chữ đầu `build_family`).
   - Kiểm tra các câu tiếng Anh và nút loa: không bị che khuất, phát âm chuẩn.
   - Thử nghiệm trên các kích thước màn hình: 1366×768, 1440×900, 1920×1080.
2. Chạy bộ kiểm tra kỹ thuật tự động:
   - `npx tsc --noEmit`
   - `npm run lint`
   - `npm test`
   - `npm run build`
3. Cập nhật `progress.md`, `decisions.md` và chạy `npm run tasks:dashboard`.
