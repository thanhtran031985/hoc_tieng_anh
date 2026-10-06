# AdultPalette

Tổng hợp token mới của khu người lớn (bố mẹ + quản trị). Mọi giá trị đều là token trong `tokens.json`; khu người lớn dùng theme `thcs` sáng nên các token lõi (`bg`, `surface`, `ink`, `brand`, `success-*`, `retry-*`, `focus`, `level-N`…) lấy giá trị THCS sáng.

- **Màu menu**: `adm-side-bg`, `adm-side-hover`, `adm-side-active`, `adm-side-ink` (9.9:1), `adm-side-ink-active`, `adm-side-accent` (7:1), `adm-side-focus` (7.5:1).
- **Biểu đồ**: `chart-1` (4.4:1), `chart-1-soft`, `chart-2`, `chart-3`, `chart-ref`, `chart-grid`. Chia theo cấp → `level-N`.
- **Biểu mẫu**: `field-error` = `retry-shade`, `field-error-bg` = `retry-soft` (5:1). **Không hoàn tác**: `adm-danger`, `adm-on-danger` (5.85:1).
- **Chưa có bài**: `adm-status-none-ink` (= `ink-soft`), `adm-status-none-line` (= `line-strong`) — nhãn trung tính viền nét đứt cho chủ đề có trong khung chương trình nhưng chưa có bài.
- **Chữ**: nhóm "Người lớn · Be Vietnam Pro" — `adm-h1` 24, `adm-h2` 17, `adm-h3` 15, `adm-body` 14, `adm-small` 13, `adm-label` 12, `adm-kpi` 28, `adm-button` 14, `adm-en` 15.
- **Bo góc**: `adm-radius-sm` 4 · `md` 6 · `lg` 10 · `xl` 14. **Bóng**: `adm-shadow-card`, `adm-shadow-pop`, `adm-shadow-drag`.
- **Kích thước**: `adm-sidebar` 240, `adm-topbar` 56, `adm-control` 36, `adm-control-l` 44, `adm-row` 48, `adm-drawer` 480, `adm-drawer-wide` 720, `adm-content-max` 1280.
- Khoảng cách dùng lại thang `space-*` của lõi, không thêm giá trị mới.
