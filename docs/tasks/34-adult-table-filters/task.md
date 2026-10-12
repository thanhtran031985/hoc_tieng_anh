# 34 — Sửa layout tìm kiếm, combobox bộ lọc và nâng cấp trải nghiệm AdultTable

> Quy trình làm việc và quy tắc code: xem `AGENTS.md`.

## Mục tiêu
Khắc phục triệt để lỗi layout thanh công cụ tìm kiếm, hiện tượng cắt cụt chữ trong combobox bộ lọc (Cấp, Trạng thái) tại trang quản trị Họ vần (`http://localhost:3000/admin/families`) và chuẩn hoá component dùng chung `AdultTable` cho toàn bộ khu vực quản trị người lớn theo tiêu chuẩn Impeccable (chế độ Operate).

## Thiết kế (nếu có)
- Hệ thống giao diện khu người lớn (Adult zone, tiền tố `adm-`).
- Chế độ Operate: ưu tiên khả năng đọc quét nhanh (scanability), thao tác chính xác, nhãn hiển thị đầy đủ, phản hồi trực quan.

## Bối cảnh & môi trường
- Next.js App Router, TypeScript, CSS Modules kết hợp Design Tokens.
- Các file liên quan:
  - `src/components/adult/AdultTable.tsx`: component bảng dữ liệu dùng chung toàn khu Admin.
  - `src/components/adult/adult-table.module.css`: CSS thanh công cụ, bảng, chân bảng phân trang.
  - `src/components/adult/adult.module.css`: CSS kiểu dáng input/select khu người lớn.
  - `src/app/globals.css`: token `--adm-filter-max`, `--adm-search-w`.
  - `src/features/admin/FamiliesView.tsx`: trang Họ vần sử dụng AdultTable.

## Quyết định kiến trúc
1. **Linh hoạt hoá độ rộng combobox & mở rộng token:**
   - Nâng token `--adm-filter-max` từ 180px lên 240px (hoặc linh hoạt `min-width: 160px; max-width: 240px;`) để các nhãn tiếng Việt dài như `"Cấp 1 · Hạt giống"`, `"Cấp 10 · Luyện tài"` hay `"Trạng thái: tất cả"` hiển thị đầy đủ, không bị cắt cụt hay đè lên icon.
2. **Loại bỏ thẻ `<span>` trần, thay bằng `.filterWrap` chuyên biệt:**
   - Thay thẻ `<span>` vô danh bọc `<select>` bằng `<div className={table.filterWrap}>` có `position: relative`, `display: inline-flex`, `align-items: center` để flexbox không bị co giãn giật cục khi người dùng đổi option.
3. **Tuỳ biến Dropdown Chevron tinh tế (Custom Select Arrow):**
   - Áp dụng `appearance: none; -webkit-appearance: none;` kèm icon SVG chevron màu `--ink-soft` đồng bộ ngôn ngữ thiết kế Edu, thay thế mũi tên mặc định thô kệch của hệ điều hành.
4. **Bổ sung Clear Search & Nút Đặt lại bộ lọc (Reset filters):**
   - Thêm nút `x` xóa nhanh từ khóa tìm kiếm khi ô search có chữ.
   - Thêm nút "Đặt lại" (`AdultButton variant="ghost" size="sm"`) xuất hiện khi có ít nhất một bộ lọc khác `"all"` hoặc ô search có từ khóa, giúp người quản trị reset nhanh chỉ với 1 click.
5. **Tổ chức nhóm Toolbar chống đứt gãy Responsive:**
   - Nhóm các điều khiển lọc bên trái vào một cụm và các hành động bên phải vào một cụm, tránh việc `.spacer` đẩy các nút rớt dòng lẻ loi khi màn hình hẹp (< 1100px).

## Các bước

### Bước 0 — Kiểm tra dự án và đo lường kích thước hiện tại (không sửa code)
- Kiểm tra các màn hình admin đang dùng `AdultTable`.
- Đo đạc độ dài văn bản của các bộ lọc trên `/admin/families`.
- Kiểm tra trạng thái TypeScript và build hiện tại.

### Bước 1 — Chuẩn hoá token và styles cho Select / Dropdown
- Cập nhật token `--adm-filter-max` trong `globals.css` và CSS rules trong `adult.module.css`, `adult-table.module.css`.
- Áp dụng custom chevron arrow, chuẩn hoá padding dọc/ngang để khớp hoàn hảo chiều cao với ô search (`--adm-control: 36px`).
- Kiểm tra: `npx tsc --noEmit`.

### Bước 2 — Nâng cấp cấu trúc Toolbar trong `AdultTable.tsx`
- Thay thế thẻ `<span>` trần bằng `.filterWrap`.
- Thêm nút Clear icon cho ô Search.
- Thêm cơ chế và nút "Đặt lại bộ lọc" (Reset filters) khi có filter/search đang hoạt động.
- Tinh chỉnh layout cụm toolbar để hiển thị cân đối và responsive mượt mà.
- Kiểm tra: `npx tsc --noEmit`.

### Bước 3 — Kiểm tra trực quan trang `/admin/families` và tính tương thích toàn hệ thống
- Mở và kiểm tra giao diện trang Họ vần: combobox Cấp và Trạng thái hiển thị trọn vẹn nhãn chữ, tìm kiếm hoạt động tốt, nút reset hoạt động chính xác.
- Kiểm tra tính tương thích trên các màn Admin khác (`LessonListView`, `VocabView`, `RewardsView`...).
- Kiểm tra: Chạy kiểm tra hiển thị.

### Bước 4 — Kiểm tra chất lượng và build
- Chạy `npx tsc --noEmit`, `npm run lint`, `npm run build`.
- Đảm bảo không có lỗi type hoặc linting phát sinh.

## Phạm vi
- Được tạo/sửa:
  - `src/components/adult/AdultTable.tsx`
  - `src/components/adult/adult-table.module.css`
  - `src/components/adult/adult.module.css`
  - `src/app/globals.css`
  - `src/features/admin/FamiliesView.tsx` (nếu cần tối ưu thêm nhãn/placeholder)
- KHÔNG làm trong task này:
  - Không sửa database, server actions hoặc backend schema.
  - Không thay đổi nghiệp vụ logic lọc dữ liệu hiện có.

## Tiêu chí hoàn thành
- Nhãn trong combobox Cấp (`Cấp 1 · Hạt giống`, ...) và Trạng thái (`Trạng thái: tất cả`, ...) hiển thị trọn vẹn 100%, không bị cắt cụt hay đè lên mũi tên.
- Mũi tên dropdown có kiểu dáng đồng bộ, thanh thoát theo design token.
- Có nút Clear ô tìm kiếm và nút Đặt lại toàn bộ bộ lọc.
- Khi co màn hình, toolbar chuyển dòng gọn gàng, không bị bung layout.
- `npx tsc --noEmit`, `npm run lint`, `npm run build` đều pass không lỗi.
