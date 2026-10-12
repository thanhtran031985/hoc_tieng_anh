# Quyết định — 34-adult-table-filters

### 2026-10-12 — Khởi tạo task 34 sau kết quả Audit Impeccable
- Bối cảnh: Kiểm tra trang `/admin/families` phát hiện combobox bộ lọc (Cấp, Trạng thái) bị cắt cụt chữ và thanh tìm kiếm thiếu tiện ích xóa nhanh/đặt lại, flexbox bị giật cục do bọc thẻ `<span>` trần.
- Quyết định: Chuẩn hoá token `--adm-filter-max` lên 240px, thay `<span>` bằng `.filterWrap`, tích hợp custom dropdown chevron và thêm các tiện ích Clear Search, Reset Filters trên `AdultTable`.
- Lý do: Đảm bảo nhãn tiếng Việt hiển thị trọn vẹn, thống nhất giao diện khu quản trị theo chế độ Operate và nâng cao hiệu suất thao tác cho người dùng.
- Ảnh hưởng: Áp dụng trực tiếp cho `AdultTable.tsx`, cải thiện hiển thị ở `/admin/families` và tất cả các bảng dữ liệu khác trong khu Admin.
