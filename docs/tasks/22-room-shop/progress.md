# Tiến độ — 22-room-shop — Phòng của tớ, cửa hàng và thẻ nghỉ phép

Trạng thái chung: 🔄 · Cập nhật lần cuối: 10/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Seed đồ và cửa hàng (Screen42) | ✅ | Tự duyệt; Edge 22/22 đạt |
| 1 | Phòng của tớ (Screen41) | ✅ | Tự duyệt; Edge 34/34 đạt |
| 2 | Trang chủ có Bông mặc đồ (Screen43) | ⬜ | |
| 3 | Thẻ nghỉ phép | ⬜ | |
| 4 | Đồ trong phòng ở Adult21 | ⬜ | |

## Nhật ký

(Claude ghi sau mỗi bước: đã làm gì, kết quả kiểm tra, việc cần làm thủ công.)

**10/10/2026 — Bước 0.** Không cần migration (`rewards` và `learner_rewards` đã đủ cột từ task 20–21). `src/lib/rules/room.ts` (19 món: 13 nội thất, 3 áo, 3 mũ; giá lấy từ `COINS`; `shortBy`, kẹp vị trí theo % phòng, `zIndexFor`, `parsePosition`, giá gợi ý và khoảng giá cho Adult21) + 11 test; `scripts/gen-room-art.mjs` sinh 13 SVG nội thất vào `public/media/room/` từ `designs/components/bundle.js` (chỉ đọc, chạy bằng `vm`); `prisma/seed/room.ts` nạp 19 món vào `rewards` (`type=room_item`, `code=room:<khóa>`, `album`=nhóm), chạy lại không ghi đè phần quản trị đã sửa; `Mascot` nhận `outfit={{ top, hat }}` (`Mascot/outfits.ts`, token `outfit-*`); `server/shop.ts` (`getShop`, `buyItem`: một transaction trừ xu bằng `updateMany where coins >= giá` rồi thêm `learner_rewards`, ràng buộc unique chặn mua hai lần, bản Nháp không mua được, kiểm quyền hồ sơ bằng `requireLearner`); Zod `schemas/room.ts`; server action `buyItemAction`; trang `/room/shop` + `loading.tsx` + `error.tsx` + `ShopView` (3 tab ← →, thẻ món có hình/Bông mặc thử, tên Anh + loa, nghĩa, giá hoặc “Đã có”, hộp xác nhận xu trước → sau, không đủ xu: nút `aria-disabled` + “Còn thiếu N xu” + Bông gợi ý “Học một bài”; ref chặn bấm đúp). Sửa trong lúc kiểm: màn cao đúng cửa sổ (`.screen { height: 100dvh }`) và `.grid { position: relative }` để chữ `sr-only` không kéo dài trang. Kiểm (Edge, DB verify, `.tmp-verify/check-22-shop.mjs`, 22/22): 3 tab 13/3/3, thiếu xu bị chặn (không mở hộp mua), mua lamp 100 → 20 xu đúng một lần và đúng 1 dòng sở hữu, tải lại vẫn “Đã có”, server chặn khi xu giảm sau khi trang đã nạp, Enter xác nhận mua mũ, món Nháp ẩn, không cuộn ở 1366×768 và 1920×1080, không lỗi console. tsc, lint, `npm test` sạch.
Việc thủ công: `npx prisma db seed` (nạp 19 món).

**10/10/2026 — Bước 1.** Trang `/room` thay màn “Sắp có” (+ `loading.tsx` khung xương, `error.tsx`). `server/room.ts`: `getRoom` (nội thất đang đặt `{x, y, flip}`, kho đồ, tủ đồ mọi mũ/áo đang bán kèm đã có/đang mặc, xu), `placeItem` (kẹp vào phòng, thảm sát sàn), `stowItem` (`position` = null), `wearItem` (một transaction: bỏ món cũ cùng nhóm rồi mặc món mới; `code` null là bỏ đồ), cả ba đi qua `requireLearner` và kiểm bé sở hữu đúng món, đúng nhóm; server action `placeItemAction`/`stowItemAction`/`wearItemAction` (Zod ở server). `features/room/RoomView.tsx` + `room.module.css`: phòng (tường, hoa văn, sàn, cửa sổ, bóng đồ bằng token `room-*`), 3 chế độ (nhóm radio ← →): Xem (bấm đồ nghe tên + nghĩa, bấm Bông chào theo tên bé), Trang trí (kéo thả bằng pointer, Tab chọn, mũi tên di chuyển 2%, Shift 6%, R xoay, Delete cất, thanh Xoay / Cất vào kho cũng nhận R/Del, kho đồ bên phải, bấm hoặc Enter để đặt vào (40, 20); lưu sau 0,5 giây khi dùng mũi tên và ngay khi thả/xoay/cất), Tủ đồ (tab Mũ/Áo, Không đội/Không mặc, món chưa có mờ + giá + lời Bông “Cần N xu”, mặc ngay có hoàn tác khi lỗi). `KidTopbar` thêm `extra` và `coinsOnly` (thanh trên chỉ có xu + nút Cửa hàng). Phòng trống: Bông nói “Phòng còn trống trơn!”. Kiểm (Edge, DB verify, `.tmp-verify/check-22-room.mjs`, 34/34): đặt, dời, kẹp biên, kéo thả lưu đúng vị trí, xoay, cất bằng Delete và nút, đặt từ kho, mặc/bỏ mũ áo, món chưa có không vào database, tải lại giữ nguyên vị trí và đồ Bông mặc, đổi 1366×768 → 1920×1080 giữ tỷ lệ, không cuộn ở cả ba chế độ, không lỗi console. tsc, lint sạch.
Việc thủ công: không có.

## Bước tiếp theo

Bước 2 — Trang chủ có Bông mặc đồ (Screen43)