# Screen42-Shop

Cửa hàng — chỉ dùng xu trong trò chơi, không có tiền thật, không quảng cáo.

- 3 tab: Nội thất, Quần áo, Mũ (← → đổi tab).
- Thẻ món đồ (`size-shop-card`): hình (quần áo, mũ: Bông mặc thử), tên tiếng Anh + loa, nghĩa, giá `price-chip` / `price-chip-ink` hoặc “Đã có” `owned-chip`.
- Giá theo token `coins`: nội thất 40 / 80 / 150 (`price-furniture-s/m/l`), đồ đặc biệt 400 (`price-special`, bể cá), quần áo 60 (`price-clothes`), mũ 50 (`price-hat`).
- Mua → hộp thoại xác nhận, hiện xu trước → sau.
- Không đủ xu: nút mờ (aria-disabled) + “Còn thiếu 60 xu”; bấm vào, Bông nói còn thiếu bao nhiêu và gợi ý “Học một bài”.

Thẻ xem trước có 3 cỡ màn (1440×900 · 1366×768 · 1920×1080) và đủ 4 trạng thái dữ liệu (Bình thường · Đang tải · Trống · Lỗi có Thử lại). Vừa 1366×768 không cuộn. Viền focus `focus` 4px khi dùng Tab.
