# AdultCharts

Biểu đồ khu người lớn (SVG/HTML, không thư viện ngoài).

- `Bong.A.vbars(data, { h, unit, ref, max, every })` — cột dọc một chuỗi `chart-1`; dữ liệu có `level` thì mỗi cột dùng `level-N` (số liệu chia theo cấp).
- `Bong.A.hbars(rows, { max, unit, legend })` — thanh ngang, vạch dọc `chart-ref` = kỳ trước.
- `Bong.A.line(points, { min, max, h, ref, fmt })` — đường `chart-1` 2px, vùng `chart-1-soft`, điểm là nút bấm được.
- Đường tham chiếu nét đứt `chart-ref` (giới hạn phút, mục tiêu điểm); lưới `chart-grid`.
- Nhãn số chỉ ở giá trị cao nhất / điểm cuối; mọi cột, điểm có tooltip khi rê chuột hoặc Tab (`Bong.A.wireTips`).
- `chart-2`, `chart-3` dành cho chuỗi thứ 2–3, luôn kèm chú giải. Bảng màu đã kiểm tra ≥ 3:1 trên nền trắng.
