# 03-db-core — Cơ sở dữ liệu lõi và lộ trình 10 cấp

Ngày tạo: 02/10/2026 · Giai đoạn: GĐ1 · Phụ thuộc: 01 · Nhánh: `feat/03-db-core`

## Mục tiêu
Tạo các bảng dữ liệu GĐ1 và nạp khung lộ trình 10 cấp.

## Phạm vi
- Trong: bảng theo PRD Phần G cho GĐ1: users, learners, stages, levels, units, lessons, lesson_steps, words, topics, word_topic, questions, lesson_progress, lesson_attempts, answer_logs, review_cards, study_sessions, media. Seed: 4 chặng, 10 cấp (tên, màu, khung CEFR).
- Ngoài: exams, grammar_points, textbook_units, writings, recordings, rewards, school_tests (để GĐ sau).

## Thiết kế
Không có màn hình.

## Quyết định kiến trúc
- Tên model PascalCase số ít, `@@map` sang tên bảng snake_case số nhiều như PRD.
- Các cột JSON (config, options, answer, settings) có schema Zod tương ứng trong `src/lib/schemas/`.
- Mọi hàm truy cập DB đặt trong `src/server/`; hàm đọc dữ liệu học sinh nhận `userId` và kiểm tra quyền sở hữu.
- Migration chạy được trên cả MariaDB (XAMPP) và MySQL 8.

## Các bước
### Bước 0 — Schema tài khoản và hồ sơ
**Kiểm tra:** migrate thành công, tạo thử 1 user + 2 learner bằng Prisma Studio.
### Bước 1 — Schema lộ trình và nội dung
**Kiểm tra:** quan hệ stage → level → unit → lesson → lesson_step đúng; xóa lesson thì xóa step.
### Bước 2 — Schema kết quả học
**Kiểm tra:** ràng buộc duy nhất (learner, lesson) ở lesson_progress và (learner, word) ở review_cards.
### Bước 3 — Seed khung 10 cấp
**Kiểm tra:** `npx prisma db seed` chạy lại nhiều lần không tạo trùng.

## Kiểm tra cuối task
tsc, lint, build; migrate trên một database trống từ đầu.
