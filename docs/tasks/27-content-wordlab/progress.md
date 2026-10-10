# Tiến độ — 27-content-wordlab — Nội dung Khám phá từ và Họ vần

Trạng thái chung: 🔄 · Cập nhật lần cuối: 10/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Danh sách và mẫu (DỪNG chờ tôi) | ✅ | Đã viết đề xuất và mẫu; chờ bạn duyệt `proposal.md` trước khi sang bước 1 |
| 1 | Khám phá từ cấp 3–4 | ⬜ | |
| 2 | Khám phá từ cấp 1–2 | ⬜ | |
| 3 | Họ vần | ⬜ | |

## Nhật ký

### Bước 0 — Danh sách và mẫu (10/10/2026)
- **Đề xuất để duyệt**: `docs/tasks/27-content-wordlab/proposal.md` — 120 từ Khám phá (30 mỗi cấp 1–4), 30 họ vần, quy tắc vốn từ, số hình cần vẽ, các điểm cần bạn quyết.
- **5 từ mẫu viết đầy đủ** (5 nhánh trở lên, đáp án + hình, hình nhiễu, đoạn văn có dịch): apple (cấp 1, bộ Đồ ăn), dolphin (cấp 2, Con vật), bus (cấp 3, Đồ vật), doctor (cấp 4, Nghề nghiệp), library (cấp 4, Nơi chốn). Dữ liệu ở `src/lib/rules/wordlab-data/explorer-level-0N.ts`; `word-explorer-data.ts` gộp cùng hai mẫu bird, cat của thiết kế (kiểu và hàm `ans/dis/sent/branch` ở `wordlab-data/helpers.ts`).
- **3 họ mẫu**: -at (mở rộng 10 từ cùng âm, bẫy eat, what), -ake (7 từ, không bẫy), -ight (8 từ, bẫy eight, weight, straight); họ -ir (thiết kế) thêm dirt, first, third. Ở `wordlab-data/families.ts` và `word-family-data.ts`.
- **Từ thêm vào kho** cho họ vần: `prisma/seed/wordlab/family-words.json` (14 từ: mat, rat, sat, that, chat, bake, wake, first, third, dirt, fire, tight, might, sight) + schema `src/lib/schemas/wordlab-words.ts` + `prisma/seed/wordlab.ts` (`seedWordLabWords`, gọi trong `prisma/seed.ts` trước họ vần). Không có hình, không thuộc chủ đề nào.
- **Hình mới** (5): fin, seat, stethoscope, librarian, borrow trong `scripts/pictures/wordlab-02/03/04.mjs`; `gen-pictures.mjs` nạp thêm nhóm `wordlab-NN`, `check-pictures.mjs` kiểm cùng yêu cầu như hình từ vựng. Đã xem bằng Edge không đầu.
- **Script kiểm** `scripts/check-wordlab.mjs` (`npm run wordlab:check`) + `prisma/seed/wordlab/allowed-wordlab.json` (hiện có “color”) + test `src/lib/rules/wordlab-data.test.ts`.
- **Kiểm tra**: `npm run wordlab:check` đạt (7 từ, 4 họ; in rõ -ir ghép 3 từ thật), `node scripts/check-pictures.mjs` đạt, `npm test` 687/687, `npx tsc --noEmit` và `npm run lint` sạch; seed hai lần trên database verify không nhân đôi (lần đầu: 5 từ Khám phá, 14 từ kho, 2 họ mới).
- **Việc bạn cần làm**: đọc `proposal.md`, trả lời mục 8 (duyệt danh sách, quy tắc vốn từ, từ họ vần không hình) rồi nói “continue”.

## Bước tiếp theo

Bước 1 — Khám phá từ cấp 3–4 (sau khi bạn duyệt đề xuất)
