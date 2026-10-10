# Tiến độ — 25-word-explorer — Khám phá từ

Trạng thái chung: 🔄 · Cập nhật lần cuối: 09/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Bảng và seed mẫu | ✅ | Migration, Zod, quy tắc, seed bird/cat, 17 hình |
| 1 | Đọc cả đoạn và dịch (ReadAloudParagraph) | ✅ | ReadAloudParagraph, trang thử /dev/wordlab |
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

### Bước 1 — Đọc cả đoạn và dịch (10/10/2026)
- `src/components/wordlab/ReadAloudParagraph.tsx` (+ CSS module, hook `use-paragraph-reader.ts`): P đọc / tạm dừng / đọc tiếp, Đọc chậm (420 → 640 ms mỗi chữ, giọng 0,82 → 0,6), bấm câu hoặc loa cuối câu nghe riêng câu, bấm chữ nghe chữ đó kèm nghĩa (tái dùng `ClickableWords`), T bật/tắt dịch cả đoạn, nút dịch đầu câu chỉ dịch riêng câu đó. Dịch mặc định ẩn; `aria-pressed` ở Đọc chậm, Dịch nghĩa và từng nút dịch riêng. Có tệp mp3 thì chữ sáng theo thời gian của tệp (đọc chậm đổi `playbackRate`), không có thì giọng trình duyệt.
- Thêm vào mã giao diện (theo thiết kế): icon `translate`, `snail`, `branch` (chép từ `bundle.js`), token chữ `text-translation` (18/26/600 theo `designs/tokens.json`), `data-lit` trên chữ sáng của `ClickableWords`. Trang thử `/dev/wordlab`.
- Kiểm tra bằng Edge không đầu (`.tmp-verify/check-25-paragraph.mjs`, 1366×768): dịch ẩn mặc định; `aria-pressed` đúng; T bật/tắt; dịch riêng câu 3; P đọc → tạm dừng (chữ sáng đứng yên) → đọc tiếp từ chữ đang dở; đo 420 ms và 640 ms mỗi chữ; đọc riêng câu rồi tự dừng; bấm chữ `bird` ra “con chim”; Tab chạm nút dịch riêng, nút nghe từng câu và từng chữ, viền focus 4px; không lỗi console. `tsc` và `eslint` sạch.
- Token thiếu đã thêm: `--text-translation` (+ line-height, font-weight).

## Bước tiếp theo

Bước 2 — Khám phá từ (Screen48)
