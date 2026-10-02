# Adult14-Excel

Nhập & xuất Excel theo 4 bước: tải file mẫu (từ vựng / câu hỏi) → chọn file → xem trước & sửa lỗi → lưu.

- Bảng xem trước báo lỗi từng dòng (thiếu IPA, cấp ngoài 1–10, từ đã có, câu ví dụ không chứa từ); ô lỗi nền `field-error-bg`, sửa ngay trong ô, trạng thái dòng cập nhật tức thì.
- Nút Lưu chỉ bật khi hết lỗi; có lọc “Chỉ dòng lỗi”, tìm, xoá dòng.
- Thẻ **Nhập chủ đề mới** (người quản trị là phụ huynh): tải tệp mẫu “Chủ đề mới” 2 trang (Chủ đề: cấp, tên tiếng Anh, tên tiếng Việt; Từ vựng: từ, phiên âm, loại từ, nghĩa, câu ví dụ Anh – Việt) → chọn tệp → thẻ chủ đề (khớp khung chương trình) + bảng xem trước báo lỗi từng dòng, sửa ngay trong ô; nhãn cảnh báo “Từ đã có” và “Chưa có hình” không chặn nhập → “Tự tạo bài học” (5–8 từ mỗi bài) kèm danh sách bài sẽ tạo → nút **Nhập** (lưu Nháp) chỉ bật khi hết lỗi. Đủ 4 trạng thái (Lỗi = tệp thiếu trang Từ vựng).
- Thẻ Xuất: chọn dữ liệu, cấp, trạng thái, định dạng, cột (phải chọn ≥ 1 cột).

Thẻ xem trước có 4 trạng thái dữ liệu (Bình thường · Đang tải · Trống · Lỗi có Thử lại) và 3 cỡ màn (1440×900 · 1366×768 · 1920×1080). Khu người lớn luôn dùng theme `thcs` sáng (ghim bằng `Bong.suite('adult')`), tiền tố lớp `a-`, vùng `.adm`.
