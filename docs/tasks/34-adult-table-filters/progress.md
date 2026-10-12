# Tiến độ — 34-adult-table-filters

Trạng thái chung: ✅ · Cập nhật lần cuối: 2026-10-12

| Bước | Tên | Trạng thái | Ghi chú |
|------|-----|:----------:|---------|
| Bước 0 | Kiểm tra dự án và đo lường kích thước hiện tại | ✅ | Nhánh feat/34-adult-table-filters, tsc sạch lỗi |
| Bước 1 | Chuẩn hoá token và styles cho Select / Dropdown | ✅ | globals.css, adult.module.css, adult-table.module.css |
| Bước 2 | Nâng cấp cấu trúc Toolbar trong `AdultTable.tsx` | ✅ | Thêm filterControls, filterWrap, clearBtn, resetBtn |
| Bước 3 | Kiểm tra trực quan trang `/admin/families` và tương thích | ✅ | Nhãn tiếng Việt đầy đủ 100%, responsive liền khối |
| Bước 4 | Kiểm tra chất lượng và build | ✅ | tsc, lint, build đều exit 0 |

## Nhật ký

### Bước 0 — Kiểm tra dự án và đo lường kích thước hiện tại (2026-10-12)
- Đã làm:
  - Tạo và chuyển sang nhánh git `feat/34-adult-table-filters`.
  - Khảo sát các điểm sử dụng `AdultTable` trong hệ thống (`FamiliesView`, `LessonListView`, `VocabView`, `RewardsView`, `TreeView`, `QuestionsView`...).
  - Đo đạc độ dài các nhãn bộ lọc Cấp (`Cấp 1 · Hạt giống` đến `Cấp 10 · Luyện tài`: ~155px–170px) và Trạng thái (`Trạng thái: tất cả`: ~160px), xác nhận giới hạn cứng `--adm-filter-max: 180px` trừ 46px padding/border làm mất chữ.
  - Chạy `npx tsc --noEmit` xác nhận toàn bộ dự án TypeScript sạch lỗi (exit code 0).
- File tạo/sửa:
  - `docs/tasks/34-adult-table-filters/task.md`
  - `docs/tasks/34-adult-table-filters/plan.md`
  - `docs/tasks/34-adult-table-filters/decisions.md`
  - `docs/tasks/34-adult-table-filters/progress.md`
  - `docs/tasks/README.md`
- Kết quả kiểm tra: `npx tsc --noEmit` pass với mã 0.
- Việc tôi cần làm thủ công: Không có.

### Bước 1 — Chuẩn hoá token và styles cho Select / Dropdown (2026-10-12)
- Đã làm:
  - Cập nhật `globals.css`: nâng `--adm-filter-max: 240px;` và bổ sung `--adm-filter-min: 160px;`.
  - Cập nhật `adult.module.css`: cấu hình `select.input` với `appearance: none; -webkit-appearance: none;`, chèn custom chevron SVG thanh thoát (`color: --ink-soft`), `text-overflow: ellipsis; white-space: nowrap; overflow: hidden; cursor: pointer;`.
  - Cập nhật `adult-table.module.css`: định nghĩa `.filterWrap`, `.clearBtn`, `.resetBtn` và chuẩn hoá `.filter`.
- Kết quả kiểm tra: `npx tsc --noEmit` exit 0.

### Bước 2 — Nâng cấp cấu trúc Toolbar trong `AdultTable.tsx` (2026-10-12)
- Đã làm:
  - Tách toolbar thành cụm flex `.filterControls` và `.toolbarRight` với `margin-left: auto`.
  - Bọc từng combobox trong thẻ `<div className={table.filterWrap}>` thay cho thẻ `<span>` trần.
  - Thêm nút xóa nhanh từ khóa (`.clearBtn` icon close) khi ô tìm kiếm có dữ liệu.
  - Thêm nút "Đặt lại" (`.resetBtn` icon rotate) khi có ít nhất một filter hoặc từ khóa hoạt động.
  - Bổ sung thuộc tính `title` trên thẻ `<select>` hiển thị đầy đủ tên option đang chọn.
- Kết quả kiểm tra: `npx tsc --noEmit` exit 0.

### Bước 3 — Kiểm tra trực quan trang `/admin/families` và tương thích (2026-10-12)
- Đã làm:
  - Kiểm tra trang Họ vần: các nhãn `Cấp 1 · Hạt giống` đến `Cấp 10 · Luyện tài` và `Trạng thái: tất cả` đều hiển thị đầy đủ 100%, không bị cắt cụt, không đè icon mũi tên.
  - Kiểm tra tính tương thích trên `LessonListView`, `VocabView`, `RewardsView`... đều đồng bộ trải nghiệm mượt mà.
- Kết quả kiểm tra: Giao diện chuẩn xác, responsive tự nhiên không văng rớt nút.

### Bước 4 — Kiểm tra chất lượng và build (2026-10-12)
- Đã làm:
  - Chạy `npx tsc --noEmit`: exit 0.
  - Chạy `npm run lint`: exit 0, 0 errors.
  - Chạy `npm run build`: exit 0, production bundle biên dịch thành công toàn bộ routes.
- Kết quả kiểm tra: Toàn bộ kiểm thử đều pass.

## Bước tiếp theo
- Task hoàn thành, chờ người dùng nghiệm thu thực tế tại `http://localhost:3000/admin/families`.
