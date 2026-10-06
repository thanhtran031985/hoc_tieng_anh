# 12-admin-content — Quản trị nội dung cơ bản

Ngày tạo: 02/10/2026 · Giai đoạn: GĐ1 · Phụ thuộc: 03, 05 · Nhánh: `feat/12-admin-content`

## Mục tiêu
Tài khoản quản trị thêm, sửa nội dung học mà không cần sửa code.

## Phạm vi
- Trong: bảng điều khiển (số từ, bài, câu hỏi theo cấp; cảnh báo thiếu hình/âm thanh), cây lộ trình (chặng → cấp → chủ đề → bài, kéo thả, Nháp/Xuất bản), ngân hàng từ vựng, ngân hàng câu hỏi dạng 8.1–8.4, soạn bài học, nhập/xuất Excel, thư viện hình và âm thanh; **nhập chủ đề mới bằng Excel** (tệp mẫu 2 trang Chủ đề + Từ vựng, tùy chọn tự tạo bài bằng hàm `lesson-builder` của task 05, lưu dạng Nháp); chủ đề khung "Chưa có bài" trong cây lộ trình, xuất Excel từ mục tiêu của chủ đề đó để điền tiếp.
- Ngoài: chủ điểm ngữ pháp, tạo đề thi, sao lưu, trợ lý AI (GĐ3–4); nút "Tạo giọng đọc tự động" và "Tạo giọng đọc hàng loạt" ra tệp mp3 (GĐ2, GĐ1 dùng giọng trình duyệt: ẩn hoặc để mờ kèm chú thích "Sắp có").

## Thiết kế
Màn GĐ1: `designs/components/Adult08-Dashboard`, `Adult09-Tree`, `Adult10-Vocab`, `Adult11-Questions` (chỉ dạng 8.1–8.4), `Adult12-LessonBuilder`, `Adult13-Media`, `Adult14-Excel` (có thẻ "Nhập chủ đề mới").
Dùng lại bộ thành phần khu người lớn của task 11 (`src/components/adult/`); thiết kế gốc ở `AdultShell`, `AdultKpi`, `AdultCharts`, `AdultField`, `AdultTable`. Nhãn "Chưa có bài" là `Bong.A.status('none')`.
Màn để giai đoạn sau, KHÔNG làm trong task này: `Adult15-Grammar`, `Adult16-ExamMatrix` (GĐ3).

## Quyết định kiến trúc
- Chỉ role `admin` vào được nhóm route `(admin)`; kiểm tra ở cả layout và từng server action.
- File tải lên lưu ở `storage/uploads/`, phục vụ qua route handler.
- Nhập Excel: hỏi trước khi cài thư viện đọc/ghi Excel; xem trước và báo lỗi từng dòng trước khi lưu; đọc tệp ở server, không tin dữ liệu từ trình duyệt.
- Nhập chủ đề mới: chủ đề khớp tên với chủ đề khung (`units.status = planned`) thì gắn vào đó, không tạo trùng; tự tạo bài bằng `src/lib/rules/lesson-builder.ts` (task 05); mọi thứ nhập vào lưu dạng Nháp.
- Xuất bản: không cho xuất bản bài 0 bước hoặc chủ đề trống; bài cần ≥ 3 bước và ≥ 1 câu hỏi; học sinh chỉ thấy nội dung `published`.
- "Xem như học sinh" dùng chính component bài học của task 07, không vẽ lại.

## Các bước
### Bước 0 — Khung quản trị và Bảng điều khiển (Adult08)
Route `(admin)` chỉ cho role `admin`.
**Kiểm tra:** tài khoản thường vào bị chặn (cả gọi thẳng server action); đủ 4 trạng thái; biểu đồ theo 10 cấp đúng màu cấp; cảnh báo thiếu hình, âm thanh; thẻ "Chủ đề chưa có bài" đếm đúng theo cấp.
### Bước 1 — Cây lộ trình (Adult09)
**Kiểm tra:** mở/thu nhánh; kéo thả và ↑/↓ đổi thứ tự trong cùng nhóm, lưu được; chủ đề khung hiện "Chưa có bài" kèm số từ mục tiêu; bấm vào mở ngăn kéo từ mục tiêu (lọc Đã có / Chưa có); không xuất bản được bài 0 bước.
### Bước 2 — Ngân hàng từ vựng (Adult10)
**Kiểm tra:** tìm, lọc, sắp xếp, phân trang; sửa trong ngăn kéo; báo từ trùng, IPA sai dạng, câu ví dụ không chứa từ.
### Bước 3 — Ngân hàng câu hỏi (Adult11)
**Kiểm tra:** tạo và sửa 4 dạng 8.1–8.4; "Xem như học sinh" chạy được câu hỏi bằng component của task 07.
### Bước 4 — Soạn bài học (Adult12)
**Kiểm tra:** thêm từ, câu hỏi, kéo thả bước; thời lượng tự tính; chặn xuất bản khi < 3 bước hoặc chưa có câu hỏi; xem trước chạy từng bước.
### Bước 5 — Thư viện hình và âm thanh (Adult13)
**Kiểm tra:** tải hình lên (chỉ nhận ảnh, giới hạn dung lượng), lưu ở `storage/uploads/`; lọc "Từ chưa có hình"; gán hình cho từ; nút tạo giọng đọc mp3 để mờ "Sắp có".
### Bước 6 — Nhập và xuất Excel từ vựng, câu hỏi (Adult14)
Hỏi trước khi cài thư viện Excel.
**Kiểm tra:** tải tệp mẫu; xem trước báo lỗi từng dòng, sửa trong ô; nút Lưu chỉ bật khi hết lỗi; xuất theo cấp, trạng thái, cột đã chọn.
### Bước 7 — Nhập chủ đề mới và xuất từ mục tiêu (Adult14, Adult09)
**Kiểm tra:** tệp mẫu 2 trang Chủ đề + Từ vựng; thiếu trang Từ vựng thì báo lỗi; nhãn "Từ đã có", "Chưa có hình" không chặn nhập; "Tự tạo bài học" (5–8 từ mỗi bài) hiện danh sách bài sẽ tạo; Nhập lưu Nháp; chủ đề khung "Chưa có bài" xuất Excel từ mục tiêu, điền rồi nhập lại thành bài.

## Kiểm tra cuối task
tsc, lint, build; nhập thử một chủ đề cấp 5 từ Excel, xuất bản, rồi học thử bằng hồ sơ của con.
