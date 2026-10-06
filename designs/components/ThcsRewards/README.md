# ThcsRewards

Hệ thưởng của THCS: **XP** (điểm kinh nghiệm), **huy hiệu** 3 bậc và **danh hiệu** theo cấp — thay cho sao và xu của Tiểu học.

- XP dùng màu `xp` (chữ số và icon tia sét, ≥6.7:1) trên `xp-soft`. Vòng mục tiêu ngày: `Bong.T.ring(180, 250, size)`; số ở giữa dùng `thcs-num`.
- Biểu đồ XP: `Bong.T.bars(data)` — một chuỗi nên chỉ một màu `xp`, không chú giải; cột mảnh bo 4px ở đầu, lưới `chart-grid` mảnh; chỉ ghi số trực tiếp cho cột cao nhất; rê chuột/Tab vào cột để xem số.
- Huy hiệu: `Bong.T.badge({ name, tier: 'gold' | 'silver' | 'bronze', icon, earned, progress })`. Bậc luôn được ghi bằng chữ ("Bậc Vàng"), không chỉ dựa vào màu `badge-gold/silver/bronze`. Huy hiệu chưa mở hiện ổ khoá + tiến độ.
- Danh hiệu: mỗi thành phố một danh hiệu, đánh dấu bằng màu cấp + số cấp.
- Không có bảng xếp hạng so sánh với bạn khác; không trừ XP khi làm sai.
