# Tiến độ — 12-admin-content — Quản trị nội dung cơ bản

Trạng thái chung: 🔄 · Cập nhật lần cuối: 03/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Khung quản trị và Bảng điều khiển (Adult08) | ✅ | Chờ bạn xem thủ công trên trình duyệt |
| 1 | Cây lộ trình (Adult09) | ✅ | Chờ bạn xem thủ công trên trình duyệt |
| 2 | Ngân hàng từ vựng (Adult10) | ✅ | |
| 3 | Ngân hàng câu hỏi (Adult11) | ✅ | Chờ bạn xem thủ công trên trình duyệt |
| 4 | Soạn bài học (Adult12) | ⬜ | |
| 5 | Thư viện hình và âm thanh (Adult13) | ⬜ | |
| 6 | Nhập và xuất Excel từ vựng, câu hỏi (Adult14) | ⬜ | |
| 7 | Nhập chủ đề mới và xuất từ mục tiêu (Adult14, Adult09) | ⬜ | |

## Nhật ký

### Bước 0 — Khung quản trị và Bảng điều khiển (03/10/2026)
- Đã làm: rà soát bản nháp có sẵn (`admin-dashboard.ts` + test, `admin-gate.ts`, `server/admin/dashboard.ts`) và giữ lại; thêm layout `(admin)` (`requireAdmin()` → `AdultArea` + `ToastProvider` + `AdminFrame`), trang `/admin`, `DashboardView` (4 thẻ KPI, biểu đồ 10 cấp theo màu cấp, "Cần bổ sung", "Chủ đề chưa có bài", bảng độ phủ), `loading.tsx`, `error.tsx`, `dashboard.module.css`.
- Kiểm tra: `npm test` (admin-dashboard) 7/7 đạt; `npx tsc --noEmit`, `npm run lint`, `npm run build` không lỗi; `getDashboard()` chạy trên DB thật: 900 từ (670 có hình), 154 bài xuất bản, 32 chủ đề xuất bản, 58 chủ đề khung chưa có bài (cấp 5: 8, cấp 6–10: 10 mỗi cấp, 2.594 từ mục tiêu), 3 cảnh báo; gõ `/admin` khi chưa đăng nhập bị chuyển về `/login`.
- Chưa tự kiểm được (cần đăng nhập): tài khoản `parent` → 404; admin chưa mở cổng → `/profiles`; giao diện thật ở 1440×900 và 1366×768; trạng thái lỗi bằng nút Thử lại.
- Việc bạn cần làm thủ công: đăng nhập tài khoản admin, mở khu bố mẹ nhập PIN, bấm "Quản trị" và xem Bảng điều khiển; thử tài khoản `parent`.
- Quy ước cho các bước sau: mọi server action / route handler của nhóm `(admin)` gọi `requireAdmin()` ở dòng đầu.

### Bước 1 — Cây lộ trình (03/10/2026)
- Đã làm: trang `/admin/tree` (`TreeView`, loading, error); cây Chặng → Cấp → Chủ đề → Bài học mở/thu nhánh và "Mở hết / Thu gọn"; kéo thả bằng tay nắm 6 chấm và ↑/↓ trên tay nắm (có thông báo vị trí cho trình đọc màn hình, hook `useSortable` / `AdultSortable` dùng được cho các màn sau); khung sửa chặng, cấp, chủ đề, bài (Nháp / Đã xuất bản); hộp thoại thêm chủ đề / bài và xóa; chủ đề khung "Chưa có bài" hiện tóm tắt (từ mục tiêu · đã có sẵn · cần thêm) và ngăn kéo bảng từ mục tiêu (tìm, lọc Đã có / Chưa có, sắp xếp, phân trang). Luật thuần ở `src/lib/rules/admin-tree.ts`, Zod ở `src/lib/schemas/admin-tree.ts`, ghi DB ở `src/server/admin/tree.ts`, server action ở `src/features/admin/tree-actions.ts` (mỗi action gọi `requireAdmin()` ở dòng đầu). Mục menu "Cấu trúc lộ trình" đã bật.
- Kiểm tra: `npm test` 133/133 đạt (thêm 8 test cho luật cây); `npx tsc --noEmit`, `npm run lint`, `npm run build` không lỗi. Chạy các hàm ghi trên DB thật rồi dọn sạch: thêm chủ đề/bài, chặn tên trùng, chặn xuất bản chủ đề trống và bài 0 bước, chặn thời lượng 99 phút, đổi thứ tự bài và chủ đề (lưu đúng `sort_order`), từ chối danh sách thứ tự sai, chuyển chủ đề sang cấp khác, xóa bài cuối thì chủ đề đang xuất bản về Nháp, từ chối xóa/sửa chủ đề khung; từ mục tiêu "Holidays and travel"… hiện 52 từ, 0 từ đã có trong ngân hàng.
- Chưa tự kiểm được (cần đăng nhập, kéo thả thật bằng chuột): giao diện cây ở 1440×900 / 1366×768, kéo thả bằng chuột và ↑/↓ bằng bàn phím, bấm chủ đề khung mở ngăn kéo.
- Việc bạn cần làm thủ công: vào Quản trị › Cấu trúc lộ trình; kéo thử một bài trong chủ đề và một chủ đề trong cấp rồi tải lại trang xem thứ tự còn giữ; thử xuất bản bài chưa có bước (phải báo lỗi dưới ô Trạng thái); bấm một chủ đề "Chưa có bài" ở Cấp 5.

### Bước 2 — Ngân hàng từ vựng (03/10/2026)
- Đã làm: `/admin/vocab` (`VocabView`, loading, error): bảng 900 từ có tìm (từ, nghĩa, phiên âm), lọc cấp / chủ đề / thiếu hình–âm thanh, sắp xếp, phân trang; bấm dòng hoặc nút bút mở ngăn kéo sửa; nút "Thêm từ" mở ngăn kéo thêm mới. Luật thuần ở `src/lib/rules/admin-vocab.ts` (dạng từ, IPA trong /…/, trùng từ, câu ví dụ chứa từ — nhận cả dạng chia và bất quy tắc), Zod ở `src/lib/schemas/admin-vocab.ts`, ghi DB ở `src/server/admin/vocab.ts`, server action `vocab-actions.ts` (gọi `requireAdmin()` đầu tiên). Tách `src/server/admin/result.ts` (kết quả chung) dùng cho cả cây lộ trình.
- Kiểm tra: `npm test` 142/142; `npx tsc --noEmit`, `npm run lint`, `npm run build` không lỗi. Chạy trên DB thật rồi dọn: IPA thiếu dấu / → báo; câu ví dụ không chứa từ → báo; từ có dấu → báo; thiếu nghĩa → báo; trùng từ (không phân biệt hoa thường) → báo; thêm mới gắn đúng chủ đề; sửa không đụng tới chủ đề nếu không đổi; chủ đề lạ → báo; bỏ chủ đề; sửa lại một từ có sẵn thành công. Cả 900 từ hiện có đều qua luật dạng từ, IPA và câu ví dụ (không từ nào bị báo sai).
- Chưa tự kiểm được (cần đăng nhập): giao diện bảng và ngăn kéo.
- Việc bạn cần làm thủ công: mở Quản trị › Ngân hàng từ vựng, tìm/lọc/sắp xếp thử, sửa một từ rồi xóa phiên âm / đổi câu ví dụ để thấy lỗi dưới ô, thêm một từ trùng.

### Bước 3 — Ngân hàng câu hỏi (03/10/2026)
- Đã làm: `/admin/questions` (`QuestionsView`, loading, error): bảng có tìm, lọc theo dạng / cấp / kỹ năng / độ khó / giải thích / trạng thái, sắp xếp, phân trang; ngăn kéo rộng thêm và sửa 3 dạng câu hỏi của trình học: 8.2 Nghe và chọn hình, 8.3 Nối từ với hình, 8.4 Chọn từ đúng cho hình (chọn từ trong ngân hàng từ vựng qua ô gợi ý, đánh dấu đáp án đúng, xem hình ngay); giải thích bắt buộc từ cấp 6; "Xem như học sinh" mở lớp phủ toàn màn hình dùng chính `LessonFrame` + `StepView` của task 07 (giao diện Tiểu học cho cấp 1–5, THCS cho cấp 6–10; làm xong một lượt thì bắt đầu lại, không lưu). Luật thuần ở `src/lib/rules/admin-questions.ts` (dựng/đọc `prompt`, `options`, `answer`, bước xem trước), Zod ở `src/lib/schemas/admin-questions.ts`, ghi DB ở `src/server/admin/questions.ts` (kiểm lại bằng `questionDataSchemas` có sẵn), server action `question-actions.ts` (gọi `requireAdmin()` đầu tiên).
- Kiểm tra: `npm test` 151/151; `npx tsc --noEmit`, `npm run lint`, `npm run build` không lỗi. Chạy trên DB thật rồi dọn (bảng `questions` về lại 0 dòng như trước): tạo 8.2, 8.3, 8.4; sửa; từ chưa có hình → báo; cấp 8 thiếu giải thích → báo; id không tồn tại → báo.
- Chưa tự kiểm được (cần đăng nhập): giao diện bảng, ngăn kéo, và lớp phủ "Xem như học sinh" (nhất là ở màn nhỏ 1366×768).
- Việc bạn cần làm thủ công: Quản trị › Ngân hàng câu hỏi › Thêm câu hỏi: tạo mỗi dạng một câu, bấm "Xem như học sinh" và chọn thử đáp án đúng/sai; thử cấp 6+ không giải thích.

## Bước tiếp theo

Bước 4 — Soạn bài học (Adult12)
