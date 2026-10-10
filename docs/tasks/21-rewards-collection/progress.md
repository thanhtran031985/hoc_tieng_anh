# Tiến độ — 21-rewards-collection — Bộ sưu tập sticker và huy hiệu

Trạng thái chung: 🔄 · Cập nhật lần cuối: 10/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Bảng phần thưởng và seed | ✅ | Tự duyệt |
| 1 | Quy tắc rơi sticker và đạt huy hiệu | ⬜ | |
| 2 | Kết thúc bài có quà (Screen40) | ⬜ | |
| 3 | Bộ sưu tập (Screen38, Screen39) | ⬜ | |
| 4 | Danh mục phần thưởng (Adult21: Sticker, Huy hiệu) | ⬜ | |

## Nhật ký

(Claude ghi sau mỗi bước: đã làm gì, kết quả kiểm tra, việc cần làm thủ công.)

**10/10/2026 — Bước 0.** Không tạo bảng mới (task 20 đã có `rewards`/`learner_rewards`): migration `20261010062933_reward_catalog` thêm `rewards.name_en`, `album`, `status` (`draft|published`), `coins` và `learner_rewards.opened_at` (điền = `acquired_at` cho dòng cũ), `source_attempt_id`. Danh mục hằng `src/lib/rules/reward-catalog.ts` (24 sticker / 4 album, `ACHIEVEMENTS` 6 huy hiệu `ach:*`, thông tin 6 loại điều kiện, `conditionText`); `scripts/gen-sticker-art.mjs` sinh 6 hình khủng long vào `public/media/stickers/` từ `designs/components/bundle.js` (chỉ đọc, chạy bằng `vm`); `prisma/seed/rewards.ts` nạp 24 sticker + 6 huy hiệu thành tích, bổ sung `name_en`/`coins` cho huy hiệu trùm và qua đảo mà không ghi đè phần quản trị đã sửa. Kiểm: seed chạy 2 lần trên DB verify vẫn 24 sticker + 42 huy hiệu (32 trùm + 4 qua đảo + 6 thành tích); test danh mục (6 test: đủ 24 mã khác nhau, mỗi album 6, hình tồn tại, mức cần đạt trong khoảng, chữ điều kiện); tsc, lint, `npm test` (503 đạt) sạch.
Việc thủ công: `npx prisma migrate deploy` rồi `npx prisma db seed`.

## Bước tiếp theo

Bước 1 — Quy tắc rơi sticker và đạt huy hiệu
