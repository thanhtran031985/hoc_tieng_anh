# ProgressBar

Rãnh `surface-sunk` lõm (`shadow-inset`), phần đã làm tô `--lv` (màu cấp) với vệt sáng; chiều rộng tăng có nảy nhẹ.

- Cao 20px trong bài học (giữa nút thoát và bộ đếm "3/10"); 12px (`b-progress--s`) trên thẻ, bản đồ.
- Đặt `data-level` trên vùng chứa để lấy màu cấp; không có thì dùng `brand`.
- Luôn kèm số dạng chữ ("3/10") cạnh thanh. `role="progressbar"` + `aria-valuenow`.
- Làm sai không lùi thanh — tiến độ chỉ đi tới.
