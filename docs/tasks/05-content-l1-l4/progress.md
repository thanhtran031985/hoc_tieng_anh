# Tiến độ — 05-content-l1-l4 — Khung chương trình 10 cấp và nội dung cấp 1–4

Trạng thái chung: ⬜ · Cập nhật lần cuối: 02/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Cột và trạng thái mới cho units | ✅ | 02/10/2026 |
| 1 | Khung cấp 1–5 (Tiểu học) | ⬜ | |
| 2 | Khung cấp 6–10 | ⬜ | |
| 3 | Hàm tạo bài tự động | ⬜ | |
| 4 | Từ vựng cấp 3 | ⬜ | |
| 5 | Hình minh họa cấp 3 | ⬜ | |
| 6 | Bài học cấp 3 và seed | ⬜ | |
| 7 | Từ vựng, hình, bài học cấp 4 | ⬜ | |
| 8 | Từ vựng, hình, bài học cấp 2 | ⬜ | |
| 9 | Từ vựng, hình, bài học cấp 1 | ⬜ | |

## Nhật ký

### Bước 0 — Cột và trạng thái mới cho units (02/10/2026)
- Đã làm: kế hoạch lưu ở `plan.md`; `ContentStatus` thêm `planned`; `units` thêm `slug`, `source`, `target_words` (JSON), khóa duy nhất `(level_id, slug)`. Migration `20261002100000_unit_curriculum` (sinh bằng `migrate diff` vì `migrate dev` không chạy được ở môi trường không tương tác, áp dụng bằng `migrate deploy`), đã `prisma generate`.
- Kiểm tra: migration áp dụng trên MariaDB (`migrate status` sạch); chủ đề `planned` không có trong truy vấn `status: published` của học sinh; trùng slug trong cùng cấp bị chặn; `targetWords` ghi/đọc đúng; `npx tsc --noEmit` sạch.
- Việc thủ công: không. Migration cần chạy `migrate deploy` trên MySQL 8 khi lên hosting (như task 03).

## Bước tiếp theo

Bước 1 — Khung cấp 1–5 (Tiểu học). Task.md yêu cầu liệt kê chủ đề và số từ mỗi chủ đề để duyệt trước khi viết danh sách từ.
