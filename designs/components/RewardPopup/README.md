# RewardPopup

Nhận phần thưởng mới — hộp thoại dùng chung `Bong.RewardPopup` (= `Bong.R.reward`).

- Bước 1 · Quà: hộp `gift-box` / `gift-box-shade`, nơ `gift-ribbon` lắc nhẹ; bấm hộp, nút Mở quà hoặc Enter. Esc cũng mở để bé không bỏ lỡ quà.
- Bước 2 · Sticker: nắp bật, tia sáng `gift-glow`, sticker cắt bế, rồng Bông chúc mừng, tên tiếng Anh + loa (tự đọc 1 lần), nghĩa, +10 xu (`coin-sticker-lesson`).
- Bước 2 · Huy hiệu: huy hiệu vàng, tên tiếng Anh + loa, điều kiện đã đạt, +50 xu (`coin-badge`).
- Nút chính “Cho vào bộ sưu tập” (Enter). Gọi: `Bong.R.reward(scr, { kind: 'sticker'|'badge', key, en, vi, cond, coins, skipGift, onAdd })`.
- Chuyển động tắt khi người dùng chọn giảm chuyển động. Xu chỉ dùng trong trò chơi, không đổi ra tiền thật.

Thẻ xem trước có 3 bước (Quà · Sticker · Huy hiệu) và 3 cỡ màn. Viền focus `focus` 4px khi dùng Tab.
