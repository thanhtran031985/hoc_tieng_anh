# Tiến độ — 21-rewards-collection — Bộ sưu tập sticker và huy hiệu

Trạng thái chung: 🔄 · Cập nhật lần cuối: 10/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Bảng phần thưởng và seed | ✅ | Tự duyệt |
| 1 | Quy tắc rơi sticker và đạt huy hiệu | ✅ | Tự duyệt; 14 test quy tắc |
| 2 | Kết thúc bài có quà (Screen40) | ✅ | Tự duyệt; Edge 21/21 đạt |
| 3 | Bộ sưu tập (Screen38, Screen39) | ⬜ | |
| 4 | Danh mục phần thưởng (Adult21: Sticker, Huy hiệu) | ⬜ | |

## Nhật ký

(Claude ghi sau mỗi bước: đã làm gì, kết quả kiểm tra, việc cần làm thủ công.)

**10/10/2026 — Bước 0.** Không tạo bảng mới (task 20 đã có `rewards`/`learner_rewards`): migration `20261010062933_reward_catalog` thêm `rewards.name_en`, `album`, `status` (`draft|published`), `coins` và `learner_rewards.opened_at` (điền = `acquired_at` cho dòng cũ), `source_attempt_id`. Danh mục hằng `src/lib/rules/reward-catalog.ts` (24 sticker / 4 album, `ACHIEVEMENTS` 6 huy hiệu `ach:*`, thông tin 6 loại điều kiện, `conditionText`); `scripts/gen-sticker-art.mjs` sinh 6 hình khủng long vào `public/media/stickers/` từ `designs/components/bundle.js` (chỉ đọc, chạy bằng `vm`); `prisma/seed/rewards.ts` nạp 24 sticker + 6 huy hiệu thành tích, bổ sung `name_en`/`coins` cho huy hiệu trùm và qua đảo mà không ghi đè phần quản trị đã sửa. Kiểm: seed chạy 2 lần trên DB verify vẫn 24 sticker + 42 huy hiệu (32 trùm + 4 qua đảo + 6 thành tích); test danh mục (6 test: đủ 24 mã khác nhau, mỗi album 6, hình tồn tại, mức cần đạt trong khoảng, chữ điều kiện); tsc, lint, `npm test` (503 đạt) sạch.
Việc thủ công: `npx prisma migrate deploy` rồi `npx prisma db seed`.

**10/10/2026 — Bước 1.** Hàm thuần trong `src/lib/rules/rewards.ts`: `dropsSticker` (lần đầu hoàn thành bài thường/trận trùm; học lại và bài ôn tập không rơi), `preferredAlbum` + `pickSticker` (ưu tiên album hợp chủ đề, trùm → khủng long, không trùng sticker đã có, hết thì null, có hạt giống), `badgeProgress`/`earnedBadges` cho 6 loại điều kiện (qua đảo và trùm do nơi khác cấp nên bỏ qua), `isNewReward` (3 ngày), `WORDS_MASTERED_BOX = 4`. Zod `src/lib/schemas/reward.ts` (`badgeConditionSchema` kèm khoảng hợp lệ từng loại, `openRewardInputSchema`, kiểu `StickerGift`/`EarnedBadge`/`OpenedReward`). Server `src/server/rewards.ts`: `collectBadgeStats` (chuỗi ngày, thẻ hộp ≥ 4, trùm thắng, bài 3 sao, câu nói khác nhau ≥ 1 sao), `grantAchievements` (cấp trong giao dịch, +`coins` hoặc 50 xu, bỏ qua bản nháp), `dropSticker` (lưu `source_attempt_id`, chưa mở), `giftOfAttempt`, `pendingGifts`, `openReward` (kiểm hồ sơ, đánh dấu mở và cộng xu đúng một lần), server action `openRewardAction`. Nối vào `completeLesson` (sticker + thành tích sau khi thẻ ôn đã ghi; kết quả có `gift`, `badges`; gửi lại cùng lượt trả đúng quà chưa mở) và `completeReview` (chỉ thành tích). Kiểm: 14 test mới (từng loại huy hiệu thiếu 1/đúng mốc/không vượt mức, nhặt đủ 24 sticker không trùng rồi hết, album hợp chủ đề, cùng hạt giống cùng quà, xu 10/50/30); tsc, lint, `npm test` (517 đạt) sạch. Kiểm bằng giao diện ở Bước 2.

**10/10/2026 — Bước 2.** Kết thúc bài có quà (Screen40, biến thể của `LessonEnd`, không route mới): hộp quà `GiftBox` lắc nhẹ cạnh Bông (cả cạnh cặp trùm–Bông ở trận trùm) với nhãn “Quà bất ngờ!”, Enter hoặc bấm hộp gọi `openRewardAction` rồi mở `RewardPopup` (bỏ bước hộp), nút chính “Mở quà” → sau khi mở đổi thành “Bài tiếp theo”/“Về bản đồ”, ô xu cộng thêm xu sticker; sticker nằm lại cạnh Bông kèm tên, loa và “Đã dán vào album …”; lỗi mở quà báo nhẹ (quà vẫn giữ, mở lại được); `EarnedBadgePopups` (`features/rewards`) hiện hộp huy hiệu thành tích lần lượt trước khi bé mở quà (Enter nhận từng cái), dùng cả ở `ReviewEnd` (bài ôn tập không có hộp quà). Token mới: `--size-gift-end` (150px, cỡ hộp quà ở màn kết thúc). Kiểm (Edge, DB verify, `.tmp-verify/check-21-gift.mjs`, 21/21): lần đầu xong bài → hộp huy hiệu “7 ngày liên tiếp” +50 xu (database có `ach:streak7`) rồi hộp quà; sticker rơi nhưng `opened_at` null và gắn lượt học; Enter mở quà → “Sticker mới!” +10 xu, `opened_at` đặt, xu +10 đúng một lần; sticker ở lại cạnh Bông + album Con vật; học lại bài đã làm không rơi quà; thoát khi chưa mở thì quà còn trong database; không cuộn ở 1366×768 và 1920×1080; không lỗi console. tsc, lint, `npm test` (517 đạt), build sạch.

## Bước tiếp theo

Bước 3 — Bộ sưu tập (Screen38, Screen39)
