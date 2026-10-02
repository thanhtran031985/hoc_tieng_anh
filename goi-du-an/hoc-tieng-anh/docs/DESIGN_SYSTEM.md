# Học cùng Bông — Design System

Nguồn duy nhất cho mọi màu, chữ, khoảng cách, bo góc, bóng của web học tiếng Anh lớp 1–9. **Không viết cứng mã hex, cỡ chữ px hay bo góc lẻ trong component** — luôn dùng token (biến CSS hoặc khóa theme Tailwind). Thiếu token thì thêm vào đây trước, rồi mới dùng.

Nguồn: bản thiết kế Claude Design "Học cùng Bông" (https://claude.ai/artifact/JGCVaSgHCW5ZZn889noG5m), bản tải về nằm trong `designs/` (`tokens.json`, `README.md`, `components/*`). Khi thiết kế được cập nhật, sinh lại tệp này từ `designs/tokens.json`.

Phạm vi hiện tại: **lõi chung + bộ Tiểu học** (theme `tieu-hoc`). Bộ THCS (theme `thcs`, font Be Vietnam Pro) chưa thiết kế; khi có sẽ bổ sung.

---

## 1. Nguyên tắc (từ bản thiết kế)

Hệ thống giao diện cho web học tiếng Anh lớp 1–9, dùng chuột và bàn phím trên máy tính. Một **lõi chung** (token, thành phần, quy tắc) phục vụ hai bộ giao diện có cùng chức năng: **Tiểu học** (cấp 1–5, thiết kế trong bản này) và **THCS** (cấp 6–10, dành sẵn chỗ: theme `thcs`, họ chữ `thcs`). Linh vật đồng hành của bộ Tiểu học là **rồng Bông**.

### Nguyên tắc nội dung

- **Hướng dẫn bằng tiếng Việt, nội dung học bằng tiếng Anh.** Mọi từ tiếng Anh hiển thị đều có nút loa (`SpeakerButton`) bên trái; ngoại lệ duy nhất là câu hỏi nghe-chọn, nơi chữ bị ẩn có chủ đích.
- Ít chữ, nhiều hình. Câu hướng dẫn ≤ 8 từ, đặt động từ lên đầu: "Nghe và chọn hình đúng", "Kéo từ vào đúng hình".
- Giọng Bông: xưng "Bông" hoặc "tớ", gọi bé bằng tên, cuối câu "nhé / nha": "Chào An! Hôm nay mình học về **fruits** nhé!"
- **Làm sai không bao giờ bị phạt.** Không dùng chữ "sai", "phạt", "mất", "thua". Viết "Chưa đúng rồi, thử lại nhé!", "Gần đúng rồi!". Không trừ sao, không mất mạng, không đếm ngược gây áp lực.
- Lỗi kỹ thuật nói rõ không phải lỗi của bé: "Mạng đang chập chờn. Không phải lỗi của bé đâu!" Mã lỗi chỉ hiện ở khu vực Bố mẹ.
- Viết hoa kiểu câu (chỉ chữ đầu). Từ tiếng Anh viết thường như trong từ điển (`apple`, không phải `Apple`). Không dùng emoji trong giao diện.
- Phần dành cho bố mẹ (đăng nhập, khoá, thêm giờ) được phép nhiều chữ hơn, giọng lịch sự trung tính.

### Màu

- Nền trang `bg` (kem ấm); thẻ, hộp thoại, ô nhập `surface`; khối phụ `surface-soft`; rãnh và khung xương `surface-sunk`. Bản đồ dùng `bg-sea` / `bg-sea-deep`; màn hết giờ dùng `bg-night`.
- Chữ chính `ink`, chữ phụ `ink-soft` — đọc được trên `bg`, `surface`, `surface-soft` và mọi màu `-soft`. Trên `brand`, `success`, cấp 5–10 và `bg-night`: `ink-on-dark`.
- **Mỗi cấp một màu chủ đạo** (`level-1` … `level-10`), kèm `-shade` (gờ 3D), `-soft` (nền nhạt), `-ink` (chữ ≥ 4.5:1) và `on-level-N` (chữ trên nền). Cấp 1–4 sáng nên chữ trên nền là `ink`; cấp 5–10 dùng chữ trắng. Đặt `data-level="N"` lên vùng chứa để thành phần tự đọc `--lv`, `--lv-shade`, `--lv-soft`, `--lv-ink`, `--on-lv`.
  - Tiểu học — đảo: 1 Hạt giống (hổ phách), 2 Mầm non (mạ non), 3 Lá xanh (ngọc lục), 4 Cành cây (trời), 5 Cây lớn (tím).
  - THCS — thành phố: 6 Singapore (lan), 7 Sydney (biển), 8 London (gạch), 9 New York (chàm), 10 Toronto (thông).
- Nút chính `brand` (chữ trắng 4.95:1), gờ `brand-shade`. Nút theo cấp dùng `--lv`.
- **Phản hồi:** đúng là xanh lá — `success` (nền nút/ icon), `success-soft` (nền dải), `success-shade` (chữ tiêu đề). Chưa đúng là cam nhẹ — `retry` (icon, viền), `retry-soft` (nền dải), `retry-shade` (chữ tiêu đề). **Không có màu đỏ trong hệ thống.** Đúng/chưa đúng luôn kèm biểu tượng (✓ / ↻), không chỉ đổi màu.
- Thưởng: `star`, `coin`, `streak` chỉ dùng cho sao, xu, ngọn lửa chuỗi ngày — không dùng làm màu chữ.
- 5 mức độ thuộc trong Sổ từ: `mastery-1` Mới gặp → `mastery-5` Thuộc lòng; viền thẻ luôn đi cùng 5 chấm và tên mức (mức 1–2 có viền nhạt, dưới 3:1, nên không bao giờ đứng một mình).
- Vòng focus `focus` (tím đậm, 7:1 trên `surface`). Trên nền đêm đổi sang `star`.
- Hình minh hoạ từ vựng dùng màu vẽ riêng (không phải token giao diện) nhưng cùng nét viền `dragon-line`.

### Chữ

- **Baloo 2** (họ `display`): tiêu đề, từ tiếng Anh, số liệu, chữ trên nút. **Nunito** (họ `body`): lời hướng dẫn, câu ví dụ, nhãn. Cả hai hỗ trợ đầy đủ dấu tiếng Việt và được tải từ Google Fonts. THCS dành sẵn **Be Vietnam Pro** (họ `thcs`).
- Thang chữ: `display-xl` 56 (chúc mừng) · `display-l` 40 (tiêu đề màn) · `title` 28 (tiêu đề thẻ, câu hướng dẫn trong bài) · `word-xl` 72 (từ trên thẻ từ) · `word` 32 (từ trên đáp án) · `stat` 24 · `button-l` 24 · `body-l` 22 (lời thoại, hướng dẫn) · `body` 18 · `button` 20 · `label` 16 · `caption` 14 · `key` 13.
- Nội dung bé phải đọc không nhỏ hơn `body` (18px). `caption` chỉ cho phiên âm và chú thích phụ.

### Khoảng cách, bo góc, bóng

- Bước 4px: `space-1` 4 · `space-2` 8 · `space-3` 12 · `space-4` 16 · `space-5` 20 · `space-6` 24 · `space-8` 32 · `space-10` 40 · `space-12` 48 · `space-16` 64. Đệm thẻ `space-6`, hộp thoại `space-8`; lề ngang màn `space-12` (1440) và `space-10` (≤ 1400).
- Bo góc tròn trịa: `radius-sm` 10 (nhãn phím) · `radius-md` 16 (nút, ô nhập) · `radius-lg` 24 (thẻ) · `radius-xl` 32 (hộp thoại, thẻ từ lớn, dải phản hồi) · `radius-pill` · `radius-round`.
- Bóng: `shadow-card` (gờ dưới + bóng mềm) cho thẻ; `shadow-raised` khi rê chuột; `shadow-dialog` cho lớp phủ; `shadow-inset` cho rãnh; `shadow-focus` cho ô nhập khi focus. Nút "kẹo dẻo" dùng gờ đặc bằng màu `-shade` của chính nó thay cho bóng mờ.

### Bố cục và cỡ màn

- Khung thiết kế **1440×900**. Nội dung tối đa `size-content-max` (1440px) và **căn giữa** trên 1920×1080; nền (biển, đêm, kem) tràn toàn màn.
- **Mọi màn bài học vừa 1366×768, không cuộn**: đầu bài 88px (72px khi cao ≤ 800), thân co giãn, chân bài 112px (96px). Kích thước hình/thẻ trong thân tính theo chiều cao khung (`cqh` trong bản xem trước; `vh` khi làm thật), ví dụ thẻ đáp án `min(272px, 33cqh)`.
- Màn có thanh trên cùng: `size-topbar` 72px — trái: quay lại + ảnh + tên + nhãn cấp; phải: Sao · Xu · Chuỗi ngày.
- Mỗi thẻ màn hình trong hệ thống có công tắc **trạng thái** (Bình thường · Đang tải · Trống · Lỗi) và **cỡ màn** (1440×900 · 1366×768 · 1920×1080).

### Trạng thái điều khiển

- Nút: thường (mặt + gờ 6px) → rê chuột (sáng hơn, nhô 2px, gờ 8px) → nhấn (lún 5px, gờ 1px, `duration-fast`) → vô hiệu (`surface-sunk`, chữ `ink-disabled`, không gờ màu).
- Thẻ đáp án: thường → rê chuột (nhô 4px, viền `brand-soft-shade`) → đang chọn (`brand`) → đúng (`success`, ✓, nảy) → chưa đúng (`retry`, ↻, lắc nhẹ) → mờ (bị gợi ý loại).
- **Focus bàn phím** (`:focus-visible`): viền ngoài 4px `focus`, cách 3px; ô nhập dùng `shadow-focus`. Không bao giờ tắt viền focus.

### Phản hồi và phần thưởng

- Sau khi bấm Kiểm tra, **dải phản hồi trượt lên từ dưới** (`duration-slide`), rồng Bông thò đầu ở mép trái, nút hành động bên phải nhận phím Enter.
- Đúng: sao bay từ đáp án vào thanh tiến độ hoặc chip sao (`duration-celebrate`), thanh tiến độ nảy lên.
- Chưa đúng: rồng *động viên*, nói nghĩa của hình bé đã chọn, cho làm lại. Lần 2 tự bật gợi ý; lần 3 cho xem đáp án và đưa câu đó xuống cuối bài.
- Kết thúc bài luôn có ít nhất 1 sao: 3 sao ≥ 90% đúng, 2 sao ≥ 70%.

### Bốn trạng thái dữ liệu

Mọi màn có dữ liệu đều thiết kế đủ: **Bình thường**; **Đang tải** — khung xương `b-sk` đúng bố cục thật (không dùng vòng xoay toàn màn); **Trống** — rồng *suy nghĩ* + một câu + một nút hành động; **Lỗi** — rồng *động viên* + câu nhẹ nhàng + nút **Thử lại**. Thanh trên cùng và nút thoát luôn còn để bé không bị kẹt; lỗi khoanh trong vùng bị lỗi khi phần còn lại vẫn dùng được.

### Bàn phím

| Phím | Tác dụng |
| --- | --- |
| `1`–`4` | Chọn đáp án (nhãn phím ở góc trên trái thẻ) |
| `Enter` | Kiểm tra · Tiếp tục · nút chính trên màn |
| `Space` | Nghe lại (bài nghe) · Lật thẻ (thẻ từ) |
| `←` `→` | Chuyển thẻ từ · di chuyển trong lưới trò chơi |
| `Esc` | Đóng hộp thoại · tạm dừng trò chơi |
| `Tab` | Đi qua mọi điều khiển theo thứ tự đọc |

Nhãn phím (`KeyHint`) chỉ hiện cho phím thật sự hoạt động trên màn đó. Kéo thả luôn có cách làm bằng bàn phím.

### Linh vật và hình ảnh

- Rồng Bông có 6 biểu cảm: `chao`, `vui`, `dongvien`, `suynghi`, `ngu`, `chucmung` (xem thẻ Mascot) và 4 màu bé chọn khi tạo hồ sơ. Không bao giờ buồn, khóc hay chê.
- Icon tự vẽ trên lưới 24px, nét 2.4px bo tròn (`Bong.icon`). Icon luôn đi cùng chữ, trừ loa, đóng, quay lại (có `aria-label`).
- Hình từ vựng (`Bong.pic`): khối màu phẳng, viền dày, không chữ trong hình, nền trong suốt.
- Không dùng ảnh chụp, gradient tím-xanh hay emoji.

### Chuyển động

`duration-fast` 120ms (nhấn) · `duration-base` 220ms (rê chuột, đổi trạng thái) · `duration-slide` 320ms (dải phản hồi) · `duration-celebrate` 900ms (sao bay). Linh vật nhún nhẹ liên tục. Khi hệ điều hành bật giảm chuyển động, tắt mọi hoạt ảnh lặp và rút ngắn chuyển cảnh.

### Dùng trong mã

Tải `tokens.css`, `components/bundle.css` rồi `components/bundle.js` (không cần React). `window.Bong` cung cấp `icon`, `pic`, `dragon`, `avatar`, `btn`, `speak`, `key`, `stars`, `stat`, `topbar`, `bubble`, `stateBlock`, `feedback`, `dialog`, `burst`, `say` cùng dữ liệu mẫu `words`, `levels`, `kids`. Lớp CSS có tiền tố `b-`. Kiểu chi tiết ở `components/index.d.ts`.


---

## 2. Token màu

Theme: `tieu-hoc` (Tiểu học).

| Token | Giá trị | Dùng cho |
|---|---|---|
| `bg` | `#fff8ec` | Nền trang Tiểu học (kem ấm). Chữ `ink`, `ink-soft` đọc tốt trên nền này. |
| `bg-sea` | `#bfe9f7` | Nền biển trên bản đồ đảo và tổng quan 10 cấp. |
| `bg-sea-deep` | `#8fd6ee` | Sóng, bóng nước quanh đảo trên bản đồ. |
| `bg-night` | `#23264f` | Nền đêm của màn Hết giờ học. Chữ `ink-on-dark` trên nền này. |
| `surface` | `#ffffff` | Mặt thẻ, hộp thoại, ô nhập. |
| `surface-soft` | `#fff1d9` | Mặt phụ: khối gợi ý, hàng danh sách xen kẽ, nền nhóm nút. |
| `surface-sunk` | `#f4ead8` | Rãnh thanh tiến độ, ô trống chờ thả hình, khung xương khi tải. |
| `line` | `#ecdfc8` | Viền trang trí của thẻ và vạch chia (không mang nghĩa). |
| `line-strong` | `#9d8a6c` | Viền ô nhập và điều khiển; đạt 3:1 trên `surface` và `bg`. |
| `ink` | `#2b2440` | Chữ chính trên `bg`, `surface`, `surface-soft` và mọi màu `-soft`. |
| `ink-soft` | `#5e5670` | Chữ phụ, chú thích, phiên âm trên `bg` và `surface`. |
| `ink-disabled` | `#a39cb0` | Chữ của nút vô hiệu (không yêu cầu tương phản). |
| `ink-on-dark` | `#ffffff` | Chữ trên `brand`, `bg-night`, các màu cấp 5–10 và `success`. |
| `ink-on-dark-soft` | `#c9cbf2` | Chữ phụ trên `bg-night`. |
| `brand` | `#1c6fd1` | Nút chính (Kiểm tra, Tiếp tục, Đăng nhập). Chữ `ink-on-dark`. |
| `brand-shade` | `#14539f` | Gờ dưới 3D của nút `brand`, chữ liên kết khi rê chuột. |
| `brand-hover` | `#2a7fe3` | Mặt nút `brand` khi rê chuột. |
| `brand-soft` | `#e2eeff` | Nền nút phụ được chọn, thẻ đáp án đang chọn. Chữ `brand-shade`/`ink`. |
| `brand-soft-shade` | `#c3d8f5` | Gờ dưới của nút loa nhỏ và viền thẻ đáp án khi rê chuột. |
| `scrim` | `rgba(43, 36, 64, 0.45)` | Lớp phủ tối sau hộp thoại. |
| `focus` | `#5b2ee8` | Vòng focus khi dùng phím Tab: viền 3px `surface` + 3px `focus`, đạt 3:1 trên mọi nền sáng lẫn màu cấp. |
| `star` | `#ffc531` | Sao thưởng (đã đạt), hiệu ứng sao bay. |
| `star-shade` | `#e39a00` | Viền và gờ của sao, xu. |
| `star-empty` | `#e6dccb` | Sao chưa đạt. |
| `coin` | `#ffb300` | Mặt đồng xu. |
| `streak` | `#ff7a3d` | Ngọn lửa chuỗi ngày học (chỉ là biểu tượng, không dùng làm màu chữ). |
| `success` | `#22873f` | Phản hồi đúng: icon, viền thẻ đúng, nền nút Tiếp tục ở dải đúng. Chữ `ink-on-dark` (4.6:1). |
| `success-shade` | `#176a31` | Gờ 3D của nút trong dải đúng; chữ tiêu đề 'Chính xác!' trên `success-soft`. |
| `success-soft` | `#dcf5e2` | Nền dải phản hồi đúng, nền thẻ đáp án đúng. |
| `retry` | `#f39646` | Phản hồi chưa đúng (cam nhẹ, không dùng đỏ): icon, viền thẻ chọn sai. Không dùng làm màu chữ. |
| `retry-shade` | `#a04e0f` | Chữ tiêu đề 'Chưa đúng rồi' trên `retry-soft`; gờ 3D nút Thử lại. |
| `retry-soft` | `#ffead6` | Nền dải phản hồi chưa đúng, nền thẻ chọn sai. |
| `info-soft` | `#e9e4ff` | Nền bong bóng lời thoại của rồng Bông và hộp gợi ý. |
| `mastery-1` | `#cfc6dc` | Mức 1 · Mới gặp: viền thẻ từ trong Sổ từ, kèm số chấm 1–5 (màu không đứng một mình). |
| `mastery-2` | `#ffc94d` | Mức 2 · Đang nhớ: viền thẻ từ trong Sổ từ, kèm số chấm 1–5 (màu không đứng một mình). |
| `mastery-3` | `#3fb0ee` | Mức 3 · Khá nhớ: viền thẻ từ trong Sổ từ, kèm số chấm 1–5 (màu không đứng một mình). |
| `mastery-4` | `#7a4fe6` | Mức 4 · Nhớ tốt: viền thẻ từ trong Sổ từ, kèm số chấm 1–5 (màu không đứng một mình). |
| `mastery-5` | `#1f9a52` | Mức 5 · Thuộc lòng: viền thẻ từ trong Sổ từ, kèm số chấm 1–5 (màu không đứng một mình). |
| `dragon-body` | `#3cc2a8` | Thân rồng Bông (mặc định). Biến thể màu ghi đè biến này. |
| `dragon-belly` | `#ffe6a3` | Bụng và mõm rồng Bông. |
| `dragon-wing` | `#ff9f6b` | Cánh, sừng nhỏ và gai lưng rồng Bông. |
| `dragon-cheek` | `#ff8fa8` | Má hồng rồng Bông. |
| `dragon-line` | `#2b2440` | Nét viền rồng Bông và hình minh hoạ. |
| `dragon-dao-body` | `#ff9fbf` | Biến thể Rồng Đào: thân. |
| `dragon-dao-wing` | `#9b7bf2` | Biến thể Rồng Đào: cánh, sừng. |
| `dragon-nang-body` | `#ffcf4a` | Biến thể Rồng Nắng: thân. |
| `dragon-nang-wing` | `#3fa9f5` | Biến thể Rồng Nắng: cánh, sừng. |
| `dragon-tim-body` | `#a88bf5` | Biến thể Rồng Tím: thân. |
| `dragon-tim-wing` | `#ffcf4a` | Biến thể Rồng Tím: cánh, sừng. |
| `level-1` | `#f4a51c` | Màu chủ đạo cấp 1 · Hạt giống (Tiểu học): nền nút cấp, thanh tiến độ, đảo/thành phố trên bản đồ. Chữ trên nền này: `on-level-1`. |
| `level-1-shade` | `#b77c22` | Gờ 3D, đường viền đậm của các mảng màu cấp 1. |
| `level-1-soft` | `#fdf1db` | Nền nhạt của cấp 1: nền vùng bản đồ, nhãn cấp. Chữ `level-1-ink`. |
| `level-1-ink` | `#906225` | Chữ màu cấp 1 trên `surface` và `level-1-soft` (≥4.5:1). |
| `on-level-1` | `#2b2440` | Chữ/icon đặt trên nền `level-1`. |
| `level-2` | `#7dbe31` | Màu chủ đạo cấp 2 · Mầm non (Tiểu học): nền nút cấp, thanh tiến độ, đảo/thành phố trên bản đồ. Chữ trên nền này: `on-level-2`. |
| `level-2-shade` | `#618e31` | Gờ 3D, đường viền đậm của các mảng màu cấp 2. |
| `level-2-soft` | `#eaf5de` | Nền nhạt của cấp 2: nền vùng bản đồ, nhãn cấp. Chữ `level-2-ink`. |
| `level-2-ink` | `#537731` | Chữ màu cấp 2 trên `surface` và `level-2-soft` (≥4.5:1). |
| `on-level-2` | `#2b2440` | Chữ/icon đặt trên nền `level-2`. |
| `level-3` | `#14a88f` | Màu chủ đạo cấp 3 · Lá xanh (Tiểu học): nền nút cấp, thanh tiến độ, đảo/thành phố trên bản đồ. Chữ trên nền này: `on-level-3`. |
| `level-3-shade` | `#167f74` | Gờ 3D, đường viền đậm của các mảng màu cấp 3. |
| `level-3-soft` | `#d9f1ed` | Nền nhạt của cấp 3: nền vùng bản đồ, nhãn cấp. Chữ `level-3-ink`. |
| `level-3-ink` | `#16766f` | Chữ màu cấp 3 trên `surface` và `level-3-soft` (≥4.5:1). |
| `on-level-3` | `#2b2440` | Chữ/icon đặt trên nền `level-3`. |
| `level-4` | `#2f9bea` | Màu chủ đạo cấp 4 · Cành cây (Tiểu học): nền nút cấp, thanh tiến độ, đảo/thành phố trên bản đồ. Chữ trên nền này: `on-level-4`. |
| `level-4-shade` | `#2975b6` | Gờ 3D, đường viền đậm của các mảng màu cấp 4. |
| `level-4-soft` | `#deeffc` | Nền nhạt của cấp 4: nền vùng bản đồ, nhãn cấp. Chữ `level-4-ink`. |
| `level-4-ink` | `#286dab` | Chữ màu cấp 4 trên `surface` và `level-4-soft` (≥4.5:1). |
| `on-level-4` | `#2b2440` | Chữ/icon đặt trên nền `level-4`. |
| `level-5` | `#7a4fe6` | Màu chủ đạo cấp 5 · Cây lớn (Tiểu học): nền nút cấp, thanh tiến độ, đảo/thành phố trên bản đồ. Chữ trên nền này: `on-level-5`. |
| `level-5-shade` | `#5f3eb3` | Gờ 3D, đường viền đậm của các mảng màu cấp 5. |
| `level-5-soft` | `#eae3fb` | Nền nhạt của cấp 5: nền vùng bản đồ, nhãn cấp. Chữ `level-5-ink`. |
| `level-5-ink` | `#7049d4` | Chữ màu cấp 5 trên `surface` và `level-5-soft` (≥4.5:1). |
| `on-level-5` | `#ffffff` | Chữ/icon đặt trên nền `level-5`. |
| `level-6` | `#c93686` | Màu chủ đạo cấp 6 · Singapore (THCS): nền nút cấp, thanh tiến độ, đảo/thành phố trên bản đồ. Chữ trên nền này: `on-level-6`. |
| `level-6-shade` | `#982c6e` | Gờ 3D, đường viền đậm của các mảng màu cấp 6. |
| `level-6-soft` | `#f6dfec` | Nền nhạt của cấp 6: nền vùng bản đồ, nhãn cấp. Chữ `level-6-ink`. |
| `level-6-ink` | `#b0317a` | Chữ màu cấp 6 trên `surface` và `level-6-soft` (≥4.5:1). |
| `on-level-6` | `#ffffff` | Chữ/icon đặt trên nền `level-6`. |
| `level-7` | `#0b7fab` | Màu chủ đạo cấp 7 · Sydney (THCS): nền nút cấp, thanh tiến độ, đảo/thành phố trên bản đồ. Chữ trên nền này: `on-level-7`. |
| `level-7-shade` | `#0f6189` | Gờ 3D, đường viền đậm của các mảng màu cấp 7. |
| `level-7-soft` | `#d8ebf2` | Nền nhạt của cấp 7: nền vùng bản đồ, nhãn cấp. Chữ `level-7-ink`. |
| `level-7-ink` | `#0d6e97` | Chữ màu cấp 7 trên `surface` và `level-7-soft` (≥4.5:1). |
| `on-level-7` | `#ffffff` | Chữ/icon đặt trên nền `level-7`. |
| `level-8` | `#c8463c` | Màu chủ đạo cấp 8 · London (THCS): nền nút cấp, thanh tiến độ, đảo/thành phố trên bản đồ. Chữ trên nền này: `on-level-8`. |
| `level-8-shade` | `#973839` | Gờ 3D, đường viền đậm của các mảng màu cấp 8. |
| `level-8-soft` | `#f6e1e0` | Nền nhạt của cấp 8: nền vùng bản đồ, nhãn cấp. Chữ `level-8-ink`. |
| `level-8-ink` | `#b03f3a` | Chữ màu cấp 8 trên `surface` và `level-8-soft` (≥4.5:1). |
| `on-level-8` | `#ffffff` | Chữ/icon đặt trên nền `level-8`. |
| `level-9` | `#4b4fc4` | Màu chủ đạo cấp 9 · New York (THCS): nền nút cấp, thanh tiến độ, đảo/thành phố trên bản đồ. Chữ trên nền này: `on-level-9`. |
| `level-9-shade` | `#3d3e9b` | Gờ 3D, đường viền đậm của các mảng màu cấp 9. |
| `level-9-soft` | `#e2e3f6` | Nền nhạt của cấp 9: nền vùng bản đồ, nhãn cấp. Chữ `level-9-ink`. |
| `level-9-ink` | `#4b4fc4` | Chữ màu cấp 9 trên `surface` và `level-9-soft` (≥4.5:1). |
| `on-level-9` | `#ffffff` | Chữ/icon đặt trên nền `level-9`. |
| `level-10` | `#2e7d5b` | Màu chủ đạo cấp 10 · Toronto (THCS): nền nút cấp, thanh tiến độ, đảo/thành phố trên bản đồ. Chữ trên nền này: `on-level-10`. |
| `level-10-shade` | `#28604f` | Gờ 3D, đường viền đậm của các mảng màu cấp 10. |
| `level-10-soft` | `#deeae5` | Nền nhạt của cấp 10: nền vùng bản đồ, nhãn cấp. Chữ `level-10-ink`. |
| `level-10-ink` | `#2c7257` | Chữ màu cấp 10 trên `surface` và `level-10-soft` (≥4.5:1). |
| `on-level-10` | `#ffffff` | Chữ/icon đặt trên nền `level-10`. |

## 3. Chữ

Họ chữ (Google Fonts, tải bằng `next/font/google`):

- `display`: `"Baloo 2", "Nunito", system-ui, sans-serif`
- `body`: `"Nunito", "Baloo 2", system-ui, sans-serif`
- `thcs`: `"Be Vietnam Pro", system-ui, sans-serif`

| Kiểu | Họ | Cỡ / dòng / đậm | Dùng cho |
|---|---|---|---|
| `display-xl` | display | 56px / 62px / 800 | Tiêu đề màn chúc mừng, kết thúc bài, hết giờ học. |
| `display-l` | display | 40px / 48px / 800 | Tiêu đề màn (chọn hồ sơ, sổ từ, bản đồ). |
| `title` | display | 28px / 36px / 700 | Tiêu đề thẻ, hộp thoại, câu hướng dẫn trong bài. |
| `word-xl` | display | 72px / 80px / 800 | Từ tiếng Anh trên thẻ từ lớn. |
| `word` | display | 32px / 40px / 700 | Từ tiếng Anh trên thẻ đáp án, thẻ nối, mưa từ. |
| `stat` | display | 24px / 28px / 800 | Số sao, xu, chuỗi ngày trên thanh trên cùng. |
| `button-l` | display | 24px / 28px / 800 | Chữ nút lớn (64px) trong bài học. |
| `body-l` | body | 22px / 30px / 700 | Lời hướng dẫn tiếng Việt, lời thoại của rồng Bông. |
| `body` | body | 18px / 26px / 600 | Câu ví dụ, mô tả ngắn. Cỡ nhỏ nhất cho nội dung bé đọc. |
| `button` | body | 20px / 24px / 800 | Chữ nút vừa (52px). |
| `label` | body | 16px / 20px / 800 | Nhãn, chip lọc, tên trên thẻ hồ sơ; phần dành cho bố mẹ. |
| `caption` | body | 14px / 18px / 700 | Phiên âm, chú thích phụ. Không dùng cho lời hướng dẫn bé. |
| `key` | body | 13px / 16px / 800 | Nhãn phím tắt (1–4, Enter, Space). |
| `thcs-title` | thcs | 28px / 36px / 700 | Dành cho bộ THCS (thiết kế ở đợt sau). |
| `thcs-body` | thcs | 17px / 26px / 500 | Dành cho bộ THCS. |

## 4. Khoảng cách

| Token | Giá trị | Dùng cho |
|---|---|---|
| `space-0` | `0px` | Không cách. |
| `space-1` | `4px` | Khe giữa icon và chữ nhỏ. |
| `space-2` | `8px` | Khe trong chip, nhãn phím. |
| `space-3` | `12px` | Khe giữa các phần tử trong thẻ. |
| `space-4` | `16px` | Đệm thẻ nhỏ, khe lưới thẻ từ. |
| `space-5` | `20px` | Khe giữa thẻ đáp án. |
| `space-6` | `24px` | Đệm thẻ chuẩn, khe giữa nhóm nút. |
| `space-8` | `32px` | Đệm hộp thoại, khe giữa các khối lớn. |
| `space-10` | `40px` | Lề ngang màn hình ở 1366px. |
| `space-12` | `48px` | Lề ngang màn hình ở 1440px. |
| `space-16` | `64px` | Khoảng thở quanh linh vật, tiêu đề màn. |

## 5. Bo góc

| Token | Giá trị | Dùng cho |
|---|---|---|
| `radius-sm` | `10px` | Nhãn phím, chip nhỏ. |
| `radius-md` | `16px` | Nút, ô nhập. |
| `radius-lg` | `24px` | Thẻ, thẻ đáp án. |
| `radius-xl` | `32px` | Hộp thoại, thẻ từ lớn, dải phản hồi (góc trên). |
| `radius-pill` | `999px` | Chip thống kê, thanh tiến độ, chip lọc. |
| `radius-round` | `50%` | Ảnh hồ sơ, nút loa tròn, chặng bài trên bản đồ. |

## 6. Bóng

| Token | Giá trị | Dùng cho |
|---|---|---|
| `shadow-card` | `0 4px 0 0 #ecdfc8, 0 10px 24px rgba(91, 66, 30, 0.08)` | Thẻ nổi trên `bg`: gờ dưới màu `line` + bóng mềm. |
| `shadow-raised` | `0 6px 0 0 #e3d3b6, 0 16px 32px rgba(91, 66, 30, 0.12)` | Thẻ khi rê chuột / đang chọn. |
| `shadow-dialog` | `0 24px 64px rgba(43, 36, 64, 0.28)` | Hộp thoại, dải phản hồi. |
| `shadow-lip` | `0 6px 0 0 rgba(20, 20, 60, 0.22)` | Gờ 3D chung cho nút màu khi không có màu `-shade` riêng. |
| `shadow-inset` | `inset 0 3px 0 rgba(91, 66, 30, 0.10)` | Rãnh thanh tiến độ, ô thả hình. |
| `shadow-focus` | `0 0 0 3px #ffffff, 0 0 0 6px #5b2ee8` | Vòng focus bàn phím (Tab). |

## 7. Kích thước

| Token | Giá trị | Dùng cho |
|---|---|---|
| `size-btn-l` | `64px` | Chiều cao nút lớn trong bài (Kiểm tra, Tiếp tục). |
| `size-btn-m` | `52px` | Chiều cao nút vừa. |
| `size-btn-s` | `40px` | Nút nhỏ, nút icon trên thanh trên cùng. |
| `size-speaker-l` | `112px` | Nút loa lớn của câu hỏi nghe. |
| `size-speaker-s` | `40px` | Nút loa cạnh từ tiếng Anh. |
| `size-topbar` | `72px` | Chiều cao thanh trên cùng. |
| `size-content-max` | `1440px` | Bề rộng nội dung tối đa; màn 1920 căn giữa. |
| `size-lesson-min-h` | `768px` | Màn bài học phải vừa chiều cao này, không cuộn. |

## 8. Viền

| Token | Giá trị | Dùng cho |
|---|---|---|
| `border-thin` | `2px` | Viền thẻ, ô nhập. |
| `border-thick` | `4px` | Viền thẻ đang chọn / đúng / chưa đúng, viền mức thuộc trong Sổ từ. |

## 9. Chuyển động

| Token | Giá trị | Dùng cho |
|---|---|---|
| `duration-fast` | `120ms` | Nhấn nút (lún xuống). |
| `duration-base` | `220ms` | Rê chuột, đổi trạng thái thẻ. |
| `duration-slide` | `320ms` | Dải phản hồi trượt lên. |
| `duration-celebrate` | `900ms` | Sao bay, rồng nhảy mừng. |

## 10. Lớp (z-index)

| Token | Giá trị | Dùng cho |
|---|---|---|
| `z-map` | `1` | Lớp bản đồ. |
| `z-sticky` | `10` | Thanh trên cùng. |
| `z-feedback` | `40` | Dải phản hồi. |
| `z-dialog` | `50` | Hộp thoại và lớp phủ. |
| `z-burst` | `60` | Hiệu ứng sao bay. |

---

## 11. Thành phần dùng chung

Mỗi thành phần có `designs/components/<Tên>/README.md` (hướng dẫn) và `preview.html` (bản xem). Chuyển sang React component trong `src/components/ui/`.

| Thành phần | Tóm tắt |
|---|---|
| Button | Nút "kẹo dẻo" 3D: mặt màu + gờ dưới đậm hơn; rê chuột thì nhô lên 2px, nhấn thì lún xuống sát gờ, vô hiệu thì xám phẳng. |
| Card | Mặt trắng bo `radius-lg` nổi bằng `shadow-card` (gờ dưới `line` + bóng mềm) trên nền `bg`; thẻ đáp án (`b-choice`) có viền 4px đổi màu theo trạng thái. |
| DataStates | Bộ ba trạng thái cho mọi màn có dữ liệu, cùng với trạng thái bình thường. |
| Dialog | Hộp thoại giữa màn trên lớp phủ `scrim`: rồng Bông nhô lên trên mép, tiêu đề `title`, lời `body-l`, 1–2 nút cỡ `l`. |
| FeedbackBar | Dải bo góc trên `radius-xl` trượt lên từ đáy màn trong `duration-slide` sau khi bé bấm Kiểm tra; rồng Bông thò đầu lên mép trái. |
| Icons | Icon tự vẽ trên lưới 24px, nét 2.4px bo tròn, màu theo `currentColor`; riêng `star`, `starEmpty`, `coin`, `flame` có màu cố định từ token. |
| KeyHint | Nhãn phím dạng nắp phím nhỏ (`key`, 13px, viền dưới 4px) cho người dùng chuột + bàn phím. |
| LevelColors | Bảng màu 10 cấp: mỗi cấp có 5 token — `level-N` (nền), `level-N-shade` (gờ 3D), `level-N-soft` (nền nhạt), `level-N-ink` (chữ ≥ 4.5:1), `on-level-N` (chữ trên nền) — cùng màu phản hồi và 5 mức độ thuộc. |
| Mascot | Rồng Bông — linh vật đồng hành của bộ Tiểu học, vẽ bằng SVG với nét viền `dragon-line`, 6 biểu cảm, 4 màu cho bé chọn. |
| ProgressBar | Rãnh `surface-sunk` lõm (`shadow-inset`), phần đã làm tô `--lv` (màu cấp) với vệt sáng; chiều rộng tăng có nảy nhẹ. |
| SpeakerButton | Nút loa tròn phát âm từ tiếng Anh; khi đang phát có vòng sóng lan ra (`is-playing`). |
| StatChip | Chip bo tròn trên `surface`: biểu tượng màu (sao `star`, xu `coin`, lửa `streak`) + số kiểu `stat`. |
| WordPictures | Hình minh hoạ cho từ vựng tiếng Anh: viền `dragon-line` 3px, khối màu phẳng, khung 120×120, không chữ trong hình. |

## 12. Các màn đã thiết kế (Tiểu học, GĐ1)

Mỗi màn có đủ 4 trạng thái (Bình thường · Đang tải · Trống · Lỗi) và 3 cỡ màn trong `preview.html`.

| Màn | Tóm tắt |
|---|---|
| Screen01-Login | Màn đăng nhập tài khoản gia đình — chia đôi: minh hoạ rồng chào bên trái, biểu mẫu cho bố mẹ bên phải. |
| Screen02-Profiles | Màn chọn hồ sơ "Ai đang học hôm nay?" — thẻ từng bé (ảnh, tên, lớp, nhãn cấp), thẻ Thêm hồ sơ viền đứt, nút Bố mẹ có ổ khoá ở góc phải trên. |
| Screen03-CreateProfile | Luồng tạo hồ sơ 3 bước với thanh bước ở đầu: (1) tên và lớp, (2) chọn bạn rồng, (3) kiểm tra loa và micro. |
| Screen04-Home | Trang chủ bé: thanh trên cùng (ảnh, tên, sao, xu, chuỗi ngày), rồng Bông ở giữa có lời chào, thẻ Nhiệm vụ hôm nay bên trái, thẻ tiến độ đảo bên phải, 4 nút lớn ở đáy. |
| Screen05-Levels | Tổng quan 10 cấp: con đường lớn trên biển đi qua 5 hòn đảo Tiểu học (hàng dưới, trái → phải) rồi 5 thành phố THCS (hàng trên, phải → trái). |
| Screen06-IslandMap | Bản đồ đảo Hạt giống: 4 vùng chủ đề (Con vật, Trái cây, Màu sắc, Số đếm), mỗi vùng là đường 5 chặng + 1 trận trùm cuối vùng. |
| Screen07-ListenChoose | Bài "Nghe và chọn hình": đầu bài (thoát, tiến độ, đếm câu), loa lớn, 4 thẻ hình có nhãn phím 1–4, chân bài Nghe lại · Gợi ý · Kiểm tra, và dải phản hồi. |
| Screen08-Flashcards | Bài "Thẻ từ": thẻ lớn lật 3D — mặt trước hình lớn, từ tiếng Anh (`word-xl`), phiên âm, câu ví dụ; mặt sau nghĩa tiếng Việt. |
| Screen09-Match | Bài "Nối từ với hình": 4 thẻ hình có ô thả, khay 4 chip từ (có loa) bên dưới, kéo thả bằng chuột. |
| Screen10-MemoryGame | Mini game "Lật thẻ ghép cặp": 12 thẻ (6 hình + 6 chữ) lưới 6×2, mặt úp màu cấp có ngôi sao. |
| Screen11-WordRain | Mini game "Mưa từ vựng": từ (kèm hình) rơi chậm từ trời; bé gõ đúng chính tả rồi Enter để phá. |
| Screen12-LessonEnd | Màn kết thúc bài: rồng chúc mừng + 3 sao bật lần lượt + lời khen bên trái; thẻ kết quả (xu, câu đúng, thời gian), danh sách từ vừa học có loa, nút Về bản đồ / Bài tiếp theo bên phải. |
| Screen13-Notebook | Sổ từ: lưới thẻ từ, mỗi thẻ viền 4px màu `mastery-1..5` + 5 chấm + tên mức; bộ lọc chủ đề dạng chip radio. |
| Screen14-TimeUp | Màn hết giờ học: nền đêm `bg-night`, trăng sao, rồng Bông ngủ trên mây, lời hẹn ngày mai và tóm tắt hôm nay. |

---

## 13. `:root` khởi đầu (globals.css)

Sinh tự động từ `designs/tokens.json`. Đưa vào `app/globals.css`, rồi khai báo lại trong `@theme inline` (Tailwind v4) để dùng được dạng class. Biến `--lv`, `--lv-shade`, `--lv-soft`, `--lv-ink`, `--on-lv` theo `data-level` lấy từ `designs/components/bundle.css`.

```css
:root{
  --bg:#fff8ec;
  --bg-sea:#bfe9f7;
  --bg-sea-deep:#8fd6ee;
  --bg-night:#23264f;
  --surface:#ffffff;
  --surface-soft:#fff1d9;
  --surface-sunk:#f4ead8;
  --line:#ecdfc8;
  --line-strong:#9d8a6c;
  --ink:#2b2440;
  --ink-soft:#5e5670;
  --ink-disabled:#a39cb0;
  --ink-on-dark:#ffffff;
  --ink-on-dark-soft:#c9cbf2;
  --brand:#1c6fd1;
  --brand-shade:#14539f;
  --brand-hover:#2a7fe3;
  --brand-soft:#e2eeff;
  --brand-soft-shade:#c3d8f5;
  --scrim:rgba(43, 36, 64, 0.45);
  --focus:#5b2ee8;
  --star:#ffc531;
  --star-shade:#e39a00;
  --star-empty:#e6dccb;
  --coin:#ffb300;
  --streak:#ff7a3d;
  --success:#22873f;
  --success-shade:#176a31;
  --success-soft:#dcf5e2;
  --retry:#f39646;
  --retry-shade:#a04e0f;
  --retry-soft:#ffead6;
  --info-soft:#e9e4ff;
  --mastery-1:#cfc6dc;
  --mastery-2:#ffc94d;
  --mastery-3:#3fb0ee;
  --mastery-4:#7a4fe6;
  --mastery-5:#1f9a52;
  --dragon-body:#3cc2a8;
  --dragon-belly:#ffe6a3;
  --dragon-wing:#ff9f6b;
  --dragon-cheek:#ff8fa8;
  --dragon-line:#2b2440;
  --dragon-dao-body:#ff9fbf;
  --dragon-dao-wing:#9b7bf2;
  --dragon-nang-body:#ffcf4a;
  --dragon-nang-wing:#3fa9f5;
  --dragon-tim-body:#a88bf5;
  --dragon-tim-wing:#ffcf4a;
  --level-1:#f4a51c;
  --level-1-shade:#b77c22;
  --level-1-soft:#fdf1db;
  --level-1-ink:#906225;
  --on-level-1:#2b2440;
  --level-2:#7dbe31;
  --level-2-shade:#618e31;
  --level-2-soft:#eaf5de;
  --level-2-ink:#537731;
  --on-level-2:#2b2440;
  --level-3:#14a88f;
  --level-3-shade:#167f74;
  --level-3-soft:#d9f1ed;
  --level-3-ink:#16766f;
  --on-level-3:#2b2440;
  --level-4:#2f9bea;
  --level-4-shade:#2975b6;
  --level-4-soft:#deeffc;
  --level-4-ink:#286dab;
  --on-level-4:#2b2440;
  --level-5:#7a4fe6;
  --level-5-shade:#5f3eb3;
  --level-5-soft:#eae3fb;
  --level-5-ink:#7049d4;
  --on-level-5:#ffffff;
  --level-6:#c93686;
  --level-6-shade:#982c6e;
  --level-6-soft:#f6dfec;
  --level-6-ink:#b0317a;
  --on-level-6:#ffffff;
  --level-7:#0b7fab;
  --level-7-shade:#0f6189;
  --level-7-soft:#d8ebf2;
  --level-7-ink:#0d6e97;
  --on-level-7:#ffffff;
  --level-8:#c8463c;
  --level-8-shade:#973839;
  --level-8-soft:#f6e1e0;
  --level-8-ink:#b03f3a;
  --on-level-8:#ffffff;
  --level-9:#4b4fc4;
  --level-9-shade:#3d3e9b;
  --level-9-soft:#e2e3f6;
  --level-9-ink:#4b4fc4;
  --on-level-9:#ffffff;
  --level-10:#2e7d5b;
  --level-10-shade:#28604f;
  --level-10-soft:#deeae5;
  --level-10-ink:#2c7257;
  --on-level-10:#ffffff;
  --font-display:"Baloo 2", "Nunito", system-ui, sans-serif;
  --font-body:"Nunito", "Baloo 2", system-ui, sans-serif;
  --font-thcs:"Be Vietnam Pro", system-ui, sans-serif;
  --space-0:0px;
  --space-1:4px;
  --space-2:8px;
  --space-3:12px;
  --space-4:16px;
  --space-5:20px;
  --space-6:24px;
  --space-8:32px;
  --space-10:40px;
  --space-12:48px;
  --space-16:64px;
  --radius-sm:10px;
  --radius-md:16px;
  --radius-lg:24px;
  --radius-xl:32px;
  --radius-pill:999px;
  --radius-round:50%;
  --shadow-card:0 4px 0 0 #ecdfc8, 0 10px 24px rgba(91, 66, 30, 0.08);
  --shadow-raised:0 6px 0 0 #e3d3b6, 0 16px 32px rgba(91, 66, 30, 0.12);
  --shadow-dialog:0 24px 64px rgba(43, 36, 64, 0.28);
  --shadow-lip:0 6px 0 0 rgba(20, 20, 60, 0.22);
  --shadow-inset:inset 0 3px 0 rgba(91, 66, 30, 0.10);
  --shadow-focus:0 0 0 3px #ffffff, 0 0 0 6px #5b2ee8;
  --size-btn-l:64px;
  --size-btn-m:52px;
  --size-btn-s:40px;
  --size-speaker-l:112px;
  --size-speaker-s:40px;
  --size-topbar:72px;
  --size-content-max:1440px;
  --size-lesson-min-h:768px;
  --border-thin:2px;
  --border-thick:4px;
  --duration-fast:120ms;
  --duration-base:220ms;
  --duration-slide:320ms;
  --duration-celebrate:900ms;
  --z-map:1;
  --z-sticky:10;
  --z-feedback:40;
  --z-dialog:50;
  --z-burst:60;
}
```
