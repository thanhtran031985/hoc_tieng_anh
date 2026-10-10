# Tiến độ — 25-word-explorer — Khám phá từ

Trạng thái chung: 🔄 · Cập nhật lần cuối: 09/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Bảng và seed mẫu | ✅ | Migration, Zod, quy tắc, seed bird/cat, 17 hình |
| 1 | Đọc cả đoạn và dịch (ReadAloudParagraph) | ✅ | ReadAloudParagraph, trang thử /dev/wordlab |
| 2 | Khám phá từ (Screen48) | ✅ | Dạng bài word_explorer, ExplorerMap/Player, /explore, Soạn bài |
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

### Bước 2 — Khám phá từ (Screen48) (10/10/2026)
- Dạng bài mới `word_explorer` (8.27): `ACTIVITY_TYPES` + cấu hình rỗng, `PlayStep` + `buildPlaySteps` (từ chưa có Khám phá đã xuất bản hoặc chưa đủ 4–6 nhánh thì bỏ qua bước), `StepView` → `ExplorerStep`, `NEW_ACTIVITY_TYPES`, Soạn bài học (nút “Thêm bước Khám phá từ” ở từ đã có Khám phá, Xem như học sinh, xuất bản bài bị chặn khi từ còn Nháp).
- Server `server/word-explorer.ts` (`loadExplorerContents`, `getExplorerView`; chỉ bản đã xuất bản tới bé; nghĩa ngắn tra từ ngân hàng từ vựng + đáp án một chữ); trong bài, mỗi nhánh là một mục chấm của từ nên `completeLesson` ghi nhật ký, tính sao và ôn tập như bước thường.
- Giao diện: `components/wordlab/ExplorerMap` (thẻ từ + 4–6 nhánh, đường cong SVG co giãn theo số nhánh), `features/word-explorer/ExplorerPlayer` (dùng cho bước bài học và tự khám phá), `AlongSpeak` (Nói theo: ghi âm + nhận diện, không lưu), `/explore/[wordId]` (có loading, error, 404 cho bản Nháp). Sai không phạt; sai 2 lần hoặc bấm H thì một hình sai mờ đi.
- Quyết định mới: tự khám phá và in chỉ cần hồ sơ thuộc tài khoản đang đăng nhập (nội dung học, không phải dữ liệu riêng của bé); hằng số thời gian chữ sáng (420/640 ms) để ở `READ_WORD_MS` vì `WORDLAB` phải khớp đúng `tokens.json`.
- Kiểm tra bằng Edge không đầu (`.tmp-verify/check-25-explorer.mjs`, `check-25-builder.mjs`): tự khám phá — 6 nhánh, 6 đường nối, phím 1–6, ↑ ↓, bấm chuột, mở đủ thì hiện đoạn văn, T bật dịch, Nói theo, Xem lại sơ đồ, Esc về Sổ từ, không ghi nhật ký, bản Nháp là 404, không cuộn ở 1366×768, 1440×900, 1920×1080. Trong bài — Bông hỏi, sai hiện dải cam, sai 2 lần mờ một hình, H gợi ý, Esc thôi hỏi (không mở hộp thoát), đúng hiện câu, mở đủ thì Đọc cả đoạn, Tiếp tục sang màn kết thúc, 6 mục vào nhật ký, 5/6 đúng ngay lần đầu = 2 sao. Soạn bài: nút thêm bước, lưu, chặn xuất bản bài khi từ còn Nháp. `npm test` 610 đạt, `tsc`, `eslint` sạch.
- Token thiếu đã thêm ở bước 1: `text-translation`. Icon thêm: `branch`, `compass`, `translate`, `snail`.

## Bước tiếp theo

Bước 3 — Bản in (Screen49)
