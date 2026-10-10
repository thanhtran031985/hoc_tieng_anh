# Tiến độ — 26-word-family — Họ vần, Ghép chữ đầu và liên kết qua lại

Trạng thái chung: 🔄 · Cập nhật lần cuối: 10/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Bảng và seed mẫu | ✅ | Migration word_family, Zod, quy tắc, seed -at và -ir |
| 1 | Họ vần (Screen50) | ⬜ | |
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

## Bước tiếp theo

Bước 1 — Họ vần (Screen50)
