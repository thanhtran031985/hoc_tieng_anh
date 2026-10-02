# ThcsPalette

Màu của bộ THCS lấy từ cùng tên token với lõi chung, đổi giá trị theo theme: `thcs` (sáng) và `thcs-toi` (tối). Tiểu học luôn ở theme `tieu-hoc`.

- Chuyển chế độ: nút mặt trời/mặt trăng trên thanh trên cùng đặt `data-theme="thcs"` ↔ `"thcs-toi"` trên `<html>`; mọi thành phần đọc lại biến CSS, không cần vẽ lại.
- Chữ: `ink` trên mọi mặt (≥15:1), `ink-soft` (≥6:1). Nhấn `brand` với chữ `on-brand`. Ở chế độ tối, màu cấp dùng `level-N-soft` tối và `level-N-ink` sáng (≥4.6:1); nền màu cấp `level-N` giữ nguyên.
- Phản hồi giữ quy tắc lõi: đúng xanh lá, chưa đúng cam nhẹ, không đỏ. Chữ/viền "chưa đúng" dùng `retry-shade` (cam nâu ở sáng, cam nhạt ở tối) vì `retry` trên nền trắng chỉ 2.3:1.
- Vòng focus `focus` (sáng 7:1, tối 8.7:1).
