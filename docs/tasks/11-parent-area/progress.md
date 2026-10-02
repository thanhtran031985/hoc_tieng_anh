# Tiến độ — 11-parent-area — Khu vực bố mẹ: tổng quan và cài đặt

Trạng thái chung: 🔄 · Cập nhật lần cuối: 03/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Bộ thành phần khu người lớn | ✅ | `src/components/adult/` + theme `thcs` + `/dev/adult-kit` |
| 1 | Cổng vào khu bố mẹ (Adult01) | ⬜ | |
| 2 | Tổng quan (Adult02) | ⬜ | |
| 3 | Cài đặt (Adult07) | ⬜ | |

## Nhật ký

### Bước 0 — Bộ thành phần khu người lớn (03/10/2026)
- Đã làm: khối `[data-theme="thcs"]` trong `globals.css` (chỉ áp trong vùng `AdultArea`), thang chữ `--text-adm-*` và token kích thước `--adm-*`; 34 icon khu người lớn trong `ui/Icon/icon-paths.ts`; `src/components/adult/`: `AdultArea`, `AdultShell` (menu tối, chuyển Bố mẹ/Quản trị, bộ chọn con `?kid=`, hộp thoại "Về màn chọn hồ sơ"), `Kpi`, `Status`, `AdultButton/Link/IconButton`, `AdultInput/Select/Textarea`, `AdultSegmented`, `AdultToggle`, `AdultDialog`, `AdultDrawer`, `ToastProvider/useToast`, `AdultSkeleton/Empty/Error`, `AdultTable`, biểu đồ `VBars`, `HBars`, `LineChart` (tooltip khi rê chuột/Tab); trang thử `/dev/adult-kit`.
- Kết quả kiểm tra (CDP, 1366×768): trang thử hiện đủ thành phần; hộp thoại khóa Tab, Esc đóng và trả focus; ngăn kéo focus vào ô đầu, Esc đóng; toast hiện; bảng tìm/lọc/sắp xếp/phân trang; viền focus thấy được; màn Tiểu học không đổi (theme chỉ áp trong `AdultArea`); `tsc`, `lint`, `npm test` 103/103, `build` sạch.
- Việc tôi cần làm thủ công: không.

## Bước tiếp theo

Bước 1 — Cổng vào khu bố mẹ (Adult01)
