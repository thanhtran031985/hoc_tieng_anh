# Tiến độ — 22-room-shop — Phòng của tớ, cửa hàng và thẻ nghỉ phép

Trạng thái chung: 🔄 · Cập nhật lần cuối: 10/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Seed đồ và cửa hàng (Screen42) | ✅ | Tự duyệt; Edge 22/22 đạt |
| 1 | Phòng của tớ (Screen41) | ⬜ | |
| 2 | Trang chủ có Bông mặc đồ (Screen43) | ⬜ | |
| 3 | Thẻ nghỉ phép | ⬜ | |
| 4 | Đồ trong phòng ở Adult21 | ⬜ | |

## Nhật ký

(Claude ghi sau mỗi bước: đã làm gì, kết quả kiểm tra, việc cần làm thủ công.)

**10/10/2026 — Bước 0.** Không cần migration (`rewards` và `learner_rewards` đã đủ cột từ task 20–21). `src/lib/rules/room.ts` (19 món: 13 nội thất, 3 áo, 3 mũ; giá lấy từ `COINS`; `shortBy`, kẹp vị trí theo % phòng, `zIndexFor`, `parsePosition`, giá gợi ý và khoảng giá cho Adult21) + 11 test; `scripts/gen-room-art.mjs` sinh 13 SVG nội thất vào `public/media/room/` từ `designs/components/bundle.js` (chỉ đọc, chạy bằng `vm`); `prisma/seed/room.ts` nạp 19 món vào `rewards` (`type=room_item`, `code=room:<khóa>`, `album`=nhóm), chạy lại không ghi đè phần quản trị đã sửa; `Mascot` nhận `outfit={{ top, hat }}` (`Mascot/outfits.ts`, token `outfit-*`); `server/shop.ts` (`getShop`, `buyItem`: một transaction trừ xu bằng `updateMany where coins >= giá` rồi thêm `learner_rewards`, ràng buộc unique chặn mua hai lần, bản Nháp không mua được, kiểm quyền hồ sơ bằng `requireLearner`); Zod `schemas/room.ts`; server action `buyItemAction`; trang `/room/shop` + `loading.tsx` + `error.tsx` + `ShopView` (3 tab ← →, thẻ món có hình/Bông mặc thử, tên Anh + loa, nghĩa, giá hoặc “Đã có”, hộp xác nhận xu trước → sau, không đủ xu: nút `aria-disabled` + “Còn thiếu N xu” + Bông gợi ý “Học một bài”; ref chặn bấm đúp). Sửa trong lúc kiểm: màn cao đúng cửa sổ (`.screen { height: 100dvh }`) và `.grid { position: relative }` để chữ `sr-only` không kéo dài trang. Kiểm (Edge, DB verify, `.tmp-verify/check-22-shop.mjs`, 22/22): 3 tab 13/3/3, thiếu xu bị chặn (không mở hộp mua), mua lamp 100 → 20 xu đúng một lần và đúng 1 dòng sở hữu, tải lại vẫn “Đã có”, server chặn khi xu giảm sau khi trang đã nạp, Enter xác nhận mua mũ, món Nháp ẩn, không cuộn ở 1366×768 và 1920×1080, không lỗi console. tsc, lint, `npm test` sạch.
Việc thủ công: `npx prisma db seed` (nạp 19 món).

## Bước tiếp theo

Bước 1 — Phòng của tớ (Screen41)
