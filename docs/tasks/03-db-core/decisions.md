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

### 02/10/2026 — Kết quả học (Bước 2)
- Bảng: `lesson_progress` (duy nhất `(learner_id, lesson_id)`), `lesson_attempts`, `answer_logs` (khóa chính `BigInt`), `review_cards` (duy nhất `(learner_id, word_id)` và `(learner_id, question_id)`), `study_sessions`; enum `AnswerSource` (lesson, review, exam). Migration `20261002075704_results`.
- Khóa ngoại: mọi bảng kết quả theo `learner` và `lesson` là `CASCADE` (xóa hồ sơ hoặc bài thì xóa kết quả); `answer_logs` → `question`/`word`/`attempt` là `SET NULL` (giữ lịch sử trả lời để thống kê); `review_cards` → `word`/`question` là `CASCADE` (từ bị xóa thì không còn gì để ôn).
- Thẻ ôn tập "gắn với từ hoặc câu hỏi" (đúng một trong hai) kiểm bằng Zod (`reviewCardInputSchema`), không dùng `CHECK` của database vì MariaDB và MySQL 8 xử lý khác nhau. Hai ràng buộc duy nhất không chặn nhiều thẻ có `NULL` ở cột còn lại, nên chỉ ghi qua `upsertReviewCard`.
- `src/server/progress.ts`: `getLessonProgress`, `listLessonProgress`, `startLessonAttempt` (chỉ bài đã xuất bản), `finishLessonAttempt` (giao dịch: ghi lượt học, giữ sao cao nhất, tăng số lần), `logAnswer`, `upsertReviewCard`, `listDueReviewCards`, `startStudySession`, `endStudySession`. Mọi hàm gọi `requireLearner(userId, learnerId)` trước; lượt học/phiên học còn được kiểm là của đúng bé (`AttemptAccessError`).
- Số sao, xu, XP và lịch ôn (PRD Phần F) KHÔNG tính ở đây: `finishLessonAttempt` nhận kết quả đã tính (Zod giới hạn sao 1–3) và các hàm thuần để tính nằm ở `src/lib/` do task 07 và 08 viết.

### 02/10/2026 — Seed khung 10 cấp (Bước 3)
- `prisma/seed.ts` (đăng ký ở `prisma.config.ts` → `migrations.seed`): 4 chặng (Khởi đầu, Tiểu học, THCS, Nâng cao) và 10 cấp theo bảng PRD A1; `upsert` theo `stages.name` và `levels.number`, phần `update` ghi đè về bản gốc nên chạy lại nhiều lần không tạo trùng và sửa tay một dòng rồi seed lại thì về đúng bản gốc.
- `levels`: `description` là cột "Trọng tâm" của PRD; `cefr` là khung tham chiếu rút gọn kèm tên bài thi Cambridge (≤ 30 ký tự, vd "A1 → A2 (Flyers)"); `color` = `level-N`; `theme` = `tieu-hoc` (cấp 1–5) hoặc `thcs` (cấp 6–10). Cấp 1–2 thuộc Khởi đầu, 3–5 Tiểu học, 6–9 THCS, 10 Nâng cao. Cột "lớp tương ứng" và "từ vựng tích lũy" của PRD chưa có cột riêng (bảng `levels` theo PRD G); nằm trong tài liệu, không seed.
- Tài khoản quản trị (`ADMIN_EMAIL`/`ADMIN_PASSWORD`) KHÔNG seed ở task này: cần băm bcrypt và thuộc phần đăng nhập, để task 04.
- Seed tự nạp `.env` khi chạy trực tiếp (`node prisma/seed.ts`); qua `prisma db seed` thì biến môi trường đã có sẵn.
- Chưa kiểm tra trên MySQL 8 (máy chỉ có MariaDB 10.4 của XAMPP). Migration chỉ dùng kiểu và cú pháp chung (ENUM, JSON, DATETIME(3), TINYINT, BIGINT, khóa ngoại), nên cần chạy `prisma migrate deploy` một lần trên MySQL 8 của hosting trước khi dùng thật.

### 02/10/2026 — Tổng kết task 03 (khác với `task.md` gốc)
- Thêm `src/server/learners.ts`, `curriculum.ts`, `progress.ts` (hàm truy cập có kiểm tra quyền sở hữu hồ sơ) và các schema Zod ở `src/lib/schemas/` cho mọi cột JSON, ngoài phần schema + seed đã nêu trong `task.md`.
- Hai việc để task sau: hàm thuần cho sao/XP/xu và lịch ôn 5 hộp (PRD Phần F) ở `src/lib/` (task 07, 08); tài khoản quản trị mẫu (task 04). Tập `activity_type`/`questions.type` mới thêm khi có dạng bài mới, không cần migration.
- Việc cần theo dõi trước khi lên hosting: lỗi `npm audit` (xem mục đầu file) và chạy `migrate deploy` trên MySQL 8.
