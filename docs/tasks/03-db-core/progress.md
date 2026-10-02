# Tiến độ — 03-db-core — Cơ sở dữ liệu lõi và lộ trình 10 cấp

Trạng thái chung: 🔄 · Cập nhật lần cuối: 02/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Schema tài khoản và hồ sơ | ✅ | Migration `accounts` |
| 1 | Schema lộ trình và nội dung | ✅ | Migration `curriculum` |
| 2 | Schema kết quả học | ⬜ | |
| 3 | Seed khung 10 cấp | ⬜ | |

## Nhật ký

### Bước 0 — Schema tài khoản và hồ sơ (02/10/2026)
- Xóa model tạm `SetupCheck`; thêm `User`, `Learner` và enum `Role`, `UiTheme` vào `prisma/schema.prisma`; migration `20261002074809_accounts` (bảng `users`, `learners`, `DROP TABLE setupcheck`), `utf8mb4_unicode_ci`. Generator đặt `importFileExtension = "ts"`, `tsconfig.json` thêm `allowImportingTsExtensions`.
- Tạo `src/lib/schemas/{learner,learner-settings,index}.ts` (Zod) và `src/server/learners.ts` (`listLearners`, `getLearner`, `requireLearner`, `createLearner`, `updateLearnerSettings`).
- Kiểm tra (script chạy bằng Node trên database thật, đã dọn dữ liệu thử): migrate thành công; tạo 1 user + 2 learner; tên tiếng Việt và emoji lưu đúng; cột `ui_theme` lưu `tieu-hoc`; `settings` JSON ghi và đọc lại đúng qua adapter MariaDB; settings/tên không hợp lệ bị Zod từ chối; `getLearner`, `requireLearner`, `updateLearnerSettings` với `userId` khác bị từ chối; email trùng bị chặn (P2002); xóa user thì xóa learner. `tsc`, `lint` không lỗi.
- Việc cần làm thủ công: chạy `npx prisma studio`, tạo 1 user (mật khẩu điền chuỗi bất kỳ vì Studio không băm) và 2 learner gắn `user_id` đó, kiểm tra thấy đủ cột; xóa dữ liệu thử sau khi xem.


### Bước 1 — Schema lộ trình và nội dung (02/10/2026)
- Thêm 10 model vào `prisma/schema.prisma` (`Stage`, `Level`, `Unit`, `Lesson`, `LessonStep`, `Word`, `Topic`, `WordTopic`, `Question`, `Media`) và enum `ContentStatus`, `LessonKind`, `MediaType`; `learners.current_level_id` có khóa ngoại tới `levels`. Migration `20261002075224_curriculum`.
- Tạo `src/lib/schemas/{lesson-step-config,question,word-extra}.ts` và `src/server/curriculum.ts`.
- Kiểm tra (script chạy bằng Node trên database thật, đã dọn): chuỗi stage → level → unit → lesson → lesson_step đúng; bước xếp theo `sort_order`; bài nháp không hiện cho học sinh, xuất bản rồi thì hiện; xóa lesson xóa step (từ và câu hỏi còn nguyên); xóa unit xóa lesson và step; xóa từ đang dùng trong bài, xóa level đang có unit, xóa stage đang có level đều bị chặn (P2003); một từ thuộc nhiều chủ đề, trùng (word, topic) và tên topic trùng bị chặn (P2002); xóa từ xóa `word_topic`; xóa level thì `current_level_id` về null; `media.path` trùng bị chặn; Zod nhận câu hỏi hợp lệ và từ chối đáp án ngoài lựa chọn, 1 lựa chọn, dạng lạ, cấu hình sai. `tsc`, `lint` không lỗi.
- Việc cần làm thủ công: không có (xem Prisma Studio nếu muốn kiểm tra các bảng mới).

## Bước tiếp theo

Bước 2 — Schema kết quả học (kế hoạch ở `plan.md`).
