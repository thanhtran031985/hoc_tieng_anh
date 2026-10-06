# AdultTable

Bảng dữ liệu: `Bong.A.table(cfg)` trả về `{ html(), mount(root, onChange) }`.

- Thanh công cụ: ô tìm (`searchKeys`), các bộ lọc (`filters: [{ key, label, options, match? }]`), vùng phải (`right`).
- Tiêu đề cột có `sort: true` là nút, cập nhật `aria-sort`.
- Hàng cao `adm-row` (48px); `select: true` thêm ô chọn; `actions(row)` thêm cột thao tác; `onRow(id)` khi bấm dòng có `data-row`.
- Chân bảng: “Hiển thị a–b / tổng” (aria-live), chọn số dòng mỗi trang, phân trang.
- Không có kết quả: trạng thái trống với Bông nhỏ và nút “Xoá bộ lọc”.

**Người dùng cung cấp**: `id`, `columns`, `rows`, `searchKeys`, `filters`, `pageSize`, `sort`, `total`.
