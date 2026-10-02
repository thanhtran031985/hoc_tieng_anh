# Quyết định — 03-db-core

### 02/10/2026 — Để nguyên lỗi `npm audit` đến khi lên hosting
- Bối cảnh: sau task 01, `npm audit` báo 6 lỗi (5 high, 1 moderate), đều nằm trong bộ Prisma 7.10.0:
  - `mariadb` 3.4.5 (qua `@prisma/adapter-mariadb`, chạy lúc web hoạt động): lộ mật khẩu cho kẻ chặn giữa đường dù bật SSL; có thể SQL injection với client charset big5/gbk/sjis/cp932/gb18030. Adapter ghim đúng 3.4.5; `mariadb` 3.4.7 và 3.5.4 đã có bản vá.
  - `mysql2` 3.15.3 và `deepmerge-ts` 7.1.5 (qua CLI `prisma`, chỉ chạy lúc dev): lộ mật khẩu khi hạ cấp auth plugin, DoS khi giải nén zlib, cạn stack khi gộp object đệ quy.
- Quyết định: để nguyên, chưa xử lý. Không chạy `npm audit fix --force` (lệnh này hạ `prisma` về 6.19.3, phá cấu hình Prisma 7).
- Lý do: hiện chỉ kết nối `localhost` bằng utf8mb4 trên máy phát triển nên rủi ro thấp; chưa có dữ liệu thật.
- Việc cần làm trước khi lên hosting (nhất là khi DB nằm ở máy khác):
  1. Thêm `overrides` trong `package.json` ép `mariadb` lên `^3.4.7` (cùng nhánh 3.4), cài lại, chạy `npm audit`, `npx tsc --noEmit`, `npm run lint`, `npm run build` và thử kết nối DB. Cần hỏi anh/chị trước khi đổi `package.json`.
  2. Kiểm tra bản Prisma mới hơn (`prisma`, `@prisma/adapter-mariadb`) để vá `mysql2` và `deepmerge-ts`; chạy lại `npm audit`.
  3. Dùng kết nối DB có TLS và giữ client charset là utf8mb4.
- Ảnh hưởng: không có thay đổi mã trong task 03.

### 02/10/2026 — Quy ước schema (Bước 0)
- Model PascalCase số ít, `@@map` sang bảng snake_case số nhiều, field camelCase có `@map` sang cột snake_case (đúng tên cột ở PRD Phần G). Khóa chính `Int` tự tăng; riêng `answer_logs` sẽ dùng `BigInt`.
- Enum Prisma (thành ENUM của MySQL/MariaDB) chỉ cho tập giá trị nhỏ và ổn định: `Role` (admin, parent), `UiTheme` (`tieu_hoc` lưu là `tieu-hoc`, `thcs`, `auto`), và ở các bước sau `ContentStatus`, `LessonKind`, `AnswerSource`, `MediaType`. Tập giá trị mở rộng theo giai đoạn (`activity_type`, `questions.type`, `skill`) lưu chuỗi và kiểm bằng Zod để không phải ALTER bảng.
- `learners.settings` là `Json?` (không đặt `DEFAULT` ở database vì MariaDB 10.4 và MySQL 8 xử lý default của JSON khác nhau); mặc định áp dụng ở ứng dụng bằng Zod (`parseLearnerSettings`). Đã kiểm tra: ghi và đọc lại qua adapter MariaDB trả về object đúng kiểu.
- `learners.current_level_id` tạo ở Bước 0 dạng số nguyên; khóa ngoại tới `levels` thêm ở Bước 1 khi có bảng `levels`.
- `pin` và `parent_pin` là cột băm bcrypt (`VarChar(100)`); các hàm đọc hồ sơ không trả PIN, chỉ trả `hasPin`.

### 02/10/2026 — Chạy TypeScript trực tiếp bằng Node (seed và script kiểm tra)
- Generator Prisma đặt `importFileExtension = "ts"`: client sinh ra import có đuôi `.ts`; `tsconfig.json` thêm `allowImportingTsExtensions` (đã có `noEmit`). `tsc` không lỗi.
- `prisma db seed` sẽ chạy `node prisma/seed.ts` (Node 25 chạy TypeScript trực tiếp, không cài `tsx`). Cần Node ≥ 22.18 trên máy khác.
- Gói chưa có `"type": "module"` nên Node in cảnh báo `MODULE_TYPELESS_PACKAGE_JSON` khi chạy file `.ts`; tắt bằng `--disable-warning` trong lệnh seed, không đổi `package.json`.

### 02/10/2026 — Hàm truy cập hồ sơ (`src/server/learners.ts`)
- `listLearners(userId)`, `getLearner(userId, learnerId)` (null nếu không có hoặc không thuộc tài khoản, không phân biệt hai trường hợp để tránh dò số hồ sơ), `requireLearner` (ném `LearnerAccessError`), `createLearner`, `updateLearnerSettings`. Mọi thao tác ghi qua Zod (`src/lib/schemas/learner.ts`, `learner-settings.ts`).
- Cùng quy ước với bản `goi-du-an/` ở task 02: nhánh này cũng thêm `goi-du-an/` vào `.gitignore`, ESLint và `tsc` (giống hệt nhánh `feat/02-ui-kit`, không gây xung đột khi gộp).

### 02/10/2026 — Lộ trình và nội dung (Bước 1)
- Bảng: `stages`, `levels`, `units`, `lessons`, `lesson_steps`, `words`, `topics`, `word_topic` (khóa chính ghép), `questions`, `media`; thêm khóa ngoại `learners.current_level_id → levels` (`SET NULL`). Migration `20261002075224_curriculum` (10 bảng, 11 khóa ngoại).
- Khóa ngoại: stage→level, level→unit/word/question `RESTRICT` (cấp là dữ liệu cố định do seed nạp); unit→lesson, lesson→step `CASCADE`; step→word/question `RESTRICT` (không xóa từ hoặc câu hỏi đang dùng trong bài); word_topic theo cả từ và chủ đề `CASCADE`.
- Chuỗi: `levels.color` lưu tên token (`level-1`…`level-10`), `levels.theme` lưu `tieu-hoc` hoặc `thcs`, `levels.number` duy nhất (TinyInt). `activity_type`, `questions.type`, `skill` là chuỗi, kiểm bằng Zod (`ACTIVITY_TYPES`, `QUESTION_TYPES`, `SKILLS`); GĐ1 có 4 dạng bài: `word_card`, `listen_choose_picture`, `match_pairs`, `choose_word_for_picture`.
- Zod: `lesson-step-config.ts` (cấu hình mặc định theo dạng bài, `parseLessonStepConfig` trả null nếu sai), `question.ts` (đề bài chữ/hình/âm thanh/từ; lựa chọn 2–4 có mã duy nhất; đáp án đúng phải nằm trong lựa chọn; nối cặp 3–6 cặp; `validateQuestionData` ném lỗi khi ghi, `parseQuestionData` trả null khi đọc), `word-extra.ts`.
- `src/server/curriculum.ts`: `listStages`, `getLevelByNumber`, `listUnits`, `listLessons`, `getLessonWithSteps`; học sinh chỉ thấy nội dung `published` (mặc định `publishedOnly`), bước trả kèm config và câu hỏi đã kiểm.
- Chưa thêm duy nhất cho `words.word`: cùng một từ có thể có nhiều nghĩa/loại từ; task 05 quyết định nếu cần khóa duy nhất (word, loại từ, cấp).
