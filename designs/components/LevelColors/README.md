# LevelColors

Bảng màu 10 cấp: mỗi cấp có 5 token — `level-N` (nền), `level-N-shade` (gờ 3D), `level-N-soft` (nền nhạt), `level-N-ink` (chữ ≥ 4.5:1), `on-level-N` (chữ trên nền) — cùng màu phản hồi và 5 mức độ thuộc.

- Đặt `data-level="N"` lên vùng chứa; thành phần bên trong đọc `--lv`, `--lv-shade`, `--lv-soft`, `--lv-ink`, `--on-lv`.
- Cấp 1–4 sáng nên chữ trên nền là `ink`; cấp 5–10 đậm nên chữ là trắng.
- Màu cấp luôn đi kèm **số cấp và tên** — không để bé phân biệt cấp chỉ bằng màu.
- Không dùng màu cấp cho phản hồi đúng/sai.
