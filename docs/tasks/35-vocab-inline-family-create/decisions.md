# Quyết định — 35-vocab-inline-family-create

### 2026-10-12 — Khởi tạo task 35 theo yêu cầu người dùng
- Bối cảnh: Tại `/admin/vocab`, khi từ chưa có họ vần, người quản trị phải chuyển sang `/admin/families` để tạo họ rồi tìm lại từ để thêm vào, gây ngắt quãng trải nghiệm.
- Quyết định: Cho phép tạo luôn Họ vần ngay tại `/admin/vocab` với từ hiện tại được điền sẵn vào thành viên ban đầu của họ mới.
- Lý do: Tối ưu hoá luồng làm việc theo chế độ Operate (liền mạch, nhanh chóng, tiện dụng).
- Ảnh hưởng: Mở rộng `FamilyDrawer` với prop `initialWord` và thêm điểm kích hoạt trên `VocabView`.
