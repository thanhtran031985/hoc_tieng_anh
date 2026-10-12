# Kế hoạch triển khai — 34-adult-table-filters

> Được duyệt ngày 2026-10-12 từ Plan mode.

## Mục tiêu kỹ thuật
1. Hiển thị hoàn chỉnh 100% nhãn tiếng Việt trong Combobox của `AdultTable`: các nhãn Cấp (`Cấp 1 · Hạt giống`, ...) và Trạng thái (`Trạng thái: tất cả`, `Đã xuất bản`...) không bị cắt cụt chữ, không đè lên icon.
2. Thay thế thẻ `<span>` trần bằng `.filterWrap` flex item có `position: relative`, kiểm soát `min-width` và `max-width`, loại bỏ hiện tượng giật cục layout (Layout Shift) khi đổi option.
3. Đồng bộ Custom Dropdown Chevron mũi tên SVG thanh thoát với theme `--ink-soft` thay cho native OS select arrow thô kệch.
4. Bổ sung tiện ích thao tác: nút xóa nhanh (`x`) cho ô search và nút "Đặt lại" (`Reset filters`) khi có bộ lọc hoạt động.
5. Gom cụm toolbar thành `.leftBar` và `.rightBar` để chống đứt gãy bố cục khi màn hình hẹp (< 1100px).

## Các bước thực hiện

### Bước 0 — Kiểm tra dự án và đo lường kích thước hiện tại (không sửa code)
- Tạo nhánh git `feat/34-adult-table-filters`.
- Khảo sát các điểm sử dụng `AdultTable` trong toàn hệ thống.
- Chạy `npx tsc --noEmit` xác nhận dự án ban đầu sạch lỗi.

### Bước 1 — Chuẩn hoá token và styles cho Select / Dropdown
- Cập nhật `globals.css`: nâng `--adm-filter-max: 240px;` và thêm `--adm-filter-min: 160px;`.
- Cập nhật `adult.module.css`: kiểu dáng custom chevron tinh tế cho `select.input`, `appearance: none;`, padding và text-overflow ellipsis.
- Cập nhật `adult-table.module.css`: định nghĩa `.filterWrap` và tinh chỉnh `.filter`.
- Kiểm tra: `npx tsc --noEmit`.

### Bước 2 — Nâng cấp cấu trúc Toolbar trong `AdultTable.tsx`
- Tách Toolbar thành `.leftBar` (search, filters, reset) và `.rightBar`.
- Bọc từng filter vào `<div className={table.filterWrap}>`.
- Thêm nút Clear search (`x`) khi có từ khóa.
- Thêm nút "Đặt lại" (Reset filters) khi có ít nhất một bộ lọc khác `"all"` hoặc ô search có ký tự.
- Thêm `title` cho thẻ select.
- Kiểm tra: `npx tsc --noEmit`.

### Bước 3 — Kiểm tra trực quan trang `/admin/families` và tính tương thích toàn hệ thống
- Kiểm tra hiển thị trang Họ vần: combobox Cấp và Trạng thái hiển thị trọn vẹn, không giật layout, nút reset và xóa tìm kiếm hoạt động chuẩn xác.
- Kiểm tra các màn Admin khác (`LessonListView`, `VocabView`, `RewardsView`...).
- Kiểm tra hiển thị ở kích thước 1440px và co nhỏ dưới 1100px.

### Bước 4 — Kiểm tra chất lượng và build
- Chạy `npx tsc --noEmit`, `npm run lint`, `npm run build`.
- Cập nhật `progress.md` và chạy `npm run tasks:dashboard`.
