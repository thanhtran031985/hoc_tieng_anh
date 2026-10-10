# Tiến độ — 26-word-family — Họ vần, Ghép chữ đầu và liên kết qua lại

Trạng thái chung: 🔄 · Cập nhật lần cuối: 10/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Bảng và seed mẫu | ✅ | Migration word_family, Zod, quy tắc, seed -at và -ir |
| 1 | Họ vần (Screen50) | ✅ | FamilyMap, FamilyPlayer, route /family/[id], dạng bài word_family, Soạn bài học |
| 2 | Ghép chữ đầu (Screen51) | ⬜ | |
| 3 | Liên kết qua lại (WordLinks, Screen53) | ⬜ | |
| 4 | Tab Họ vần trong Sổ từ (Screen52) | ⬜ | |
| 5 | Soạn Họ vần (Adult23) | ⬜ | |

## Nhật ký

(Claude ghi sau mỗi bước: đã làm gì, kết quả kiểm tra, việc cần làm thủ công.)

### Bước 0 — Bảng và seed mẫu (10/10/2026)
- Migration `20261010115819_word_family`: `word_families` (vần, loại rime/root, IPA, cấp, `build_rime`, `decoys` JSON, `trap_note`, trạng thái) và `word_family_members` (từ, `same_sound`, thứ tự; xóa theo họ và theo từ). Chỉ dùng kiểu có ở cả MariaDB và MySQL 8. Đoạn văn vui của họ dùng `word_readings` (owner_type family) có từ task 25.
- Zod dùng chung `lib/schemas/word-family.ts` (vần a–z, IPA /…/, chữ đầu 1–3 chữ cái, chữ đầu nhiễu, lời giải thích bẫy, mục của khung liên kết). Hằng số `BUILD_MIN_REAL = 2` đặt ngoài `WORDLAB`.
- Quy tắc thuần `lib/rules/word-family.ts`: `splitOnset`, `splitRime`, `soundMatches`, `buildInfo` / `buildTiles` / `checkOnset` / `hintOnset`, `familyIssues` (lỗi lưu và lỗi xuất bản, kèm mã ô), ngăn xếp liên kết (`pushLink` trả null ở bậc thứ 5, `popLink`, `cutTo`).
- Dữ liệu mẫu `-at` (bat, cat, hat, fat, mat, flat, chat, that; bẫy eat, what) và `-ir` (bird, girl, shirt, skirt, first, third; bẫy fire; ghép “irt”) ở `lib/rules/word-family-data.ts`, seed `prisma/seed/word-family.ts` (Nháp, chỉ nạp từ đã có trong kho).
- Kiểm tra: `prisma migrate deploy` trên DB verify (MariaDB) đạt; `db seed` chạy 2 lần vẫn 2 họ, 11 thành viên (at: 5 cùng âm + 2 bẫy, ir: 4 từ), không nhân đôi; `npm test` 660/660 (37 test mới); `tsc` sạch.
- Việc thủ công: `npx prisma migrate deploy` rồi `npx prisma db seed` trên database thật.

### Bước 1 — Họ vần (Screen50) (10/10/2026)
- `components/wordlab/FamilyMap`: vần ở giữa (`rime-hub`, bấm để nghe cả họ), thẻ cùng âm hai bên với phần vần tô `rime-ink` trên `rime-bg`, đường nối `rime-line` (nét đứt với thẻ “Sắp học”), ô Bẫy chính tả (`trap-*`, gạch lượn sóng, lời Bông), chế độ thu gọn cho Sổ từ. ← → đi giữa thẻ (không vòng quanh, `cardNav`).
- `features/word-family/FamilyPlayer` (+ `FamilyView`): Space nghe lần lượt cả họ (vần rồi từng thẻ, thẻ sáng và có dấu “đã nghe”), bấm thẻ nghe từ (thẻ “Sắp học” vẫn nghe được), bấm từ bẫy nghe từ bẫy, “Đọc cả đoạn” câu vui dùng `ReadAloudParagraph` của task 25. Trong bài: nghe đủ các từ đã học rồi Tiếp tục, H chỉ thẻ chưa nghe; không tạo mục chấm (không phạt, không ghi `answer_logs`).
- Server `server/word-family.ts`: `loadFamilies` (họ đã xuất bản, đánh dấu từ đã học = có thẻ ôn tập hoặc là từ của bài, từ có Khám phá, từ ghép được), `getFamilyView` (qua `requireLearner`; họ Nháp là 404). `glossaryFor` và `audioOfWords` của task 25 được export dùng chung.
- Route `/family/[familyId]` (+ `loading`, `error`); tham số `from=notebook&word=` đưa bé về Sổ từ khi đóng (tab Họ vần ở bước 4).
- Dạng bài `word_family` (config `{familyId}`): `ACTIVITY_TYPES`, `PlayStep`, `buildPlaySteps` (bỏ qua bước khi họ chưa xuất bản hoặc bé chưa học từ nào của họ), `getLessonPlay`, `StepView` + `FamilyStep`. Soạn bài học: tab “Họ vần” trong cột gợi ý để thêm bước, “Xem như học sinh” dựng được bước, lưu bài kiểm `familyId` có thật và (khi xuất bản bài) họ đã xuất bản.
- Thêm icon `family` và `blocks` (chép từ `bundle.js`) vào `icon-paths.ts`; không thiếu token nào. `/dev/wordlab` có thêm mục thử Họ vần -at.
- Nút “Ghép” và “Khám phá” trên thẻ chỉ hiện khi có nơi để đi (bước 2 và 3 nối vào).
- Kiểm tra bằng Edge không đầu (`.tmp-verify/check-26-family.mjs`, 37 mục đạt): họ Nháp là 404; 5 thẻ, 2 thẻ “Sắp học”, vần tô màu, bẫy eat/what gạch lượn sóng kèm lời giải thích, 5 đường nối; không cuộn ở 1366×768, 1440×900, 1920×1080; ← → không vòng quanh; Space nghe cả họ (5 thẻ có dấu nghe); Esc về Sổ từ; trong bài: Tiếp tục khóa tới khi nghe đủ 3 từ đã học, H gợi ý thẻ chưa nghe, Enter khi đủ thì sang bước kế, không ghi `answer_logs`; đoạn văn không bị chân bài che. `npm test` 662/662 (39 test họ vần), `tsc` và `lint` sạch.
- Việc thủ công: không có thêm (xuất bản họ ở bước 5).

## Bước tiếp theo

Bước 2 — Ghép chữ đầu (Screen51)
