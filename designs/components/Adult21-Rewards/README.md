# Adult21-Rewards

Quản trị · Danh mục phần thưởng.

- 3 thẻ: Sticker (24), Huy hiệu (8), Đồ trong phòng (19); mỗi thẻ một bảng có tìm, lọc, sắp xếp, phân trang, nút Sửa.
- Sticker: hình, tên tiếng Anh + nghĩa, album (Con vật, Xe cộ, Khủng long, Trái cây), rơi từ đâu, trạng thái; chọn nhiều.
- Huy hiệu: điều kiện chọn từ danh sách (số ngày liên tiếp, số từ đã thuộc, qua cấp, số trận trùm, số bài 3 sao, số câu luyện nói) + mức cần đạt + xu thưởng (mặc định 50, `coin-badge`).
- Đồ trong phòng: nhóm Nội thất / Quần áo / Mũ, giá xu (gợi ý theo token `price-*`), hình; quần áo và mũ xem trước trên Bông.
- Thêm / Sửa → ngăn kéo biểu mẫu có xem trước, báo lỗi dưới ô khi rời ô và khi lưu, Nháp / Xuất bản.
- Trạng thái thêm: thẻ Huy hiệu, thẻ Đồ trong phòng.

Thẻ xem trước có 4 trạng thái dữ liệu (Bình thường · Đang tải · Trống · Lỗi có Thử lại) và 3 cỡ màn (1440×900 · 1366×768 · 1920×1080). Khu người lớn dùng theme `thcs` sáng, tiền tố lớp `a-`, khung `Bong.A.shell2` (thêm mục mới, có nhãn “Mới”, không đổi menu cũ). Không có linh vật, trừ màn trống. Dùng được hoàn toàn bằng bàn phím, viền focus rõ khi Tab.
