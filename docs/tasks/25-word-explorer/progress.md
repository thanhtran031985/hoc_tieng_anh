# Tiến độ — 25-word-explorer — Khám phá từ

Trạng thái chung: 🔄 · Cập nhật lần cuối: 09/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Bảng và seed mẫu | ✅ | Migration, Zod, quy tắc, seed bird/cat, 17 hình |
| 1 | Đọc cả đoạn và dịch (ReadAloudParagraph) | ⬜ | |
| 2 | Khám phá từ (Screen48) | ⬜ | |
| 3 | Bản in (Screen49) | ⬜ | |
| 4 | Trong Sổ từ và ôn tập | ⬜ | |
| 5 | Soạn Khám phá từ (Adult22) | ⬜ | |

## Nhật ký

(Claude ghi sau mỗi bước: đã làm gì, kết quả kiểm tra, việc cần làm thủ công.)

### Bước 0 — Bảng và seed mẫu (10/10/2026)
- Migration `20261010101858_word_explorer`: `word_questions` (khóa ngoại tới `words`, xóa theo từ) và `word_readings` (`owner_type` word/family, không khóa ngoại vì trỏ tới hai bảng). Chỉ dùng kiểu có ở cả MariaDB và MySQL 8 (JSON, ENUM, utf8mb4_unicode_ci).
- Zod dùng chung `lib/schemas/word-explorer.ts` (đáp án, hình nhiễu, câu của đoạn văn; bản Nháp được lưu dang dở, điều kiện xuất bản kiểm riêng). Hằng số `WORDLAB.readWordMs` (420), `readWordSlowMs` (640).
- Quy tắc thuần `lib/rules/word-explorer.ts`: `buildChoices`, `dimWrongChoice`, `nextClosedBranch`, `allBranchesOpen`, `explorerIssues` / `canPublish` (kèm mã ô để cảnh báo nhảy tới), `printSides`, `QUESTION_SETS` (5 nhóm) và `fillQuestionSet`. 24 test.
- Dữ liệu mẫu bird (6 nhánh) và cat (5 nhánh) trong `lib/rules/word-explorer-data.ts`, seed `prisma/seed/word-explorer.ts` (Nháp, bỏ qua từ đã có nhánh).
- 17 hình đáp án còn thiếu sinh bằng `scripts/gen-explorer-art.mjs` (từ `Bong.pic`, không sửa `designs/`); `gen-pictures.mjs` giữ lại và `check-pictures.mjs` không coi là hình mồ côi (danh sách ở `scripts/explorer-art-keys.mjs`).
- Kiểm tra: `prisma migrate deploy` trên DB verify (MariaDB) đạt; `db seed` chạy 2 lần vẫn đúng 6 + 5 nhánh và 2 đoạn văn, không nhân đôi; `node --test` 24/24; `tsc` sạch; `check-pictures` đạt.
- Việc thủ công: `npx prisma migrate deploy` rồi `npx prisma db seed` trên database thật.

## Bước tiếp theo

Bước 1 — Đọc cả đoạn và dịch (ReadAloudParagraph)
