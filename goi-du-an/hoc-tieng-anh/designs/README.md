Hệ thống giao diện cho web học tiếng Anh lớp 1–9, dùng chuột và bàn phím trên máy tính. Một **lõi chung** (token, thành phần, quy tắc) phục vụ hai bộ giao diện có cùng chức năng: **Tiểu học** (cấp 1–5, thiết kế trong bản này) và **THCS** (cấp 6–10, dành sẵn chỗ: theme `thcs`, họ chữ `thcs`). Linh vật đồng hành của bộ Tiểu học là **rồng Bông**.

## Nguyên tắc nội dung

- **Hướng dẫn bằng tiếng Việt, nội dung học bằng tiếng Anh.** Mọi từ tiếng Anh hiển thị đều có nút loa (`SpeakerButton`) bên trái; ngoại lệ duy nhất là câu hỏi nghe-chọn, nơi chữ bị ẩn có chủ đích.
- Ít chữ, nhiều hình. Câu hướng dẫn ≤ 8 từ, đặt động từ lên đầu: "Nghe và chọn hình đúng", "Kéo từ vào đúng hình".
- Giọng Bông: xưng "Bông" hoặc "tớ", gọi bé bằng tên, cuối câu "nhé / nha": "Chào An! Hôm nay mình học về **fruits** nhé!"
- **Làm sai không bao giờ bị phạt.** Không dùng chữ "sai", "phạt", "mất", "thua". Viết "Chưa đúng rồi, thử lại nhé!", "Gần đúng rồi!". Không trừ sao, không mất mạng, không đếm ngược gây áp lực.
- Lỗi kỹ thuật nói rõ không phải lỗi của bé: "Mạng đang chập chờn. Không phải lỗi của bé đâu!" Mã lỗi chỉ hiện ở khu vực Bố mẹ.
- Viết hoa kiểu câu (chỉ chữ đầu). Từ tiếng Anh viết thường như trong từ điển (`apple`, không phải `Apple`). Không dùng emoji trong giao diện.
- Phần dành cho bố mẹ (đăng nhập, khoá, thêm giờ) được phép nhiều chữ hơn, giọng lịch sự trung tính.

## Màu

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

## Chữ

- **Baloo 2** (họ `display`): tiêu đề, từ tiếng Anh, số liệu, chữ trên nút. **Nunito** (họ `body`): lời hướng dẫn, câu ví dụ, nhãn. Cả hai hỗ trợ đầy đủ dấu tiếng Việt và được tải từ Google Fonts. THCS dành sẵn **Be Vietnam Pro** (họ `thcs`).
- Thang chữ: `display-xl` 56 (chúc mừng) · `display-l` 40 (tiêu đề màn) · `title` 28 (tiêu đề thẻ, câu hướng dẫn trong bài) · `word-xl` 72 (từ trên thẻ từ) · `word` 32 (từ trên đáp án) · `stat` 24 · `button-l` 24 · `body-l` 22 (lời thoại, hướng dẫn) · `body` 18 · `button` 20 · `label` 16 · `caption` 14 · `key` 13.
- Nội dung bé phải đọc không nhỏ hơn `body` (18px). `caption` chỉ cho phiên âm và chú thích phụ.

## Khoảng cách, bo góc, bóng

- Bước 4px: `space-1` 4 · `space-2` 8 · `space-3` 12 · `space-4` 16 · `space-5` 20 · `space-6` 24 · `space-8` 32 · `space-10` 40 · `space-12` 48 · `space-16` 64. Đệm thẻ `space-6`, hộp thoại `space-8`; lề ngang màn `space-12` (1440) và `space-10` (≤ 1400).
- Bo góc tròn trịa: `radius-sm` 10 (nhãn phím) · `radius-md` 16 (nút, ô nhập) · `radius-lg` 24 (thẻ) · `radius-xl` 32 (hộp thoại, thẻ từ lớn, dải phản hồi) · `radius-pill` · `radius-round`.
- Bóng: `shadow-card` (gờ dưới + bóng mềm) cho thẻ; `shadow-raised` khi rê chuột; `shadow-dialog` cho lớp phủ; `shadow-inset` cho rãnh; `shadow-focus` cho ô nhập khi focus. Nút "kẹo dẻo" dùng gờ đặc bằng màu `-shade` của chính nó thay cho bóng mờ.

## Bố cục và cỡ màn

- Khung thiết kế **1440×900**. Nội dung tối đa `size-content-max` (1440px) và **căn giữa** trên 1920×1080; nền (biển, đêm, kem) tràn toàn màn.
- **Mọi màn bài học vừa 1366×768, không cuộn**: đầu bài 88px (72px khi cao ≤ 800), thân co giãn, chân bài 112px (96px). Kích thước hình/thẻ trong thân tính theo chiều cao khung (`cqh` trong bản xem trước; `vh` khi làm thật), ví dụ thẻ đáp án `min(272px, 33cqh)`.
- Màn có thanh trên cùng: `size-topbar` 72px — trái: quay lại + ảnh + tên + nhãn cấp; phải: Sao · Xu · Chuỗi ngày.
- Mỗi thẻ màn hình trong hệ thống có công tắc **trạng thái** (Bình thường · Đang tải · Trống · Lỗi) và **cỡ màn** (1440×900 · 1366×768 · 1920×1080).

## Trạng thái điều khiển

- Nút: thường (mặt + gờ 6px) → rê chuột (sáng hơn, nhô 2px, gờ 8px) → nhấn (lún 5px, gờ 1px, `duration-fast`) → vô hiệu (`surface-sunk`, chữ `ink-disabled`, không gờ màu).
- Thẻ đáp án: thường → rê chuột (nhô 4px, viền `brand-soft-shade`) → đang chọn (`brand`) → đúng (`success`, ✓, nảy) → chưa đúng (`retry`, ↻, lắc nhẹ) → mờ (bị gợi ý loại).
- **Focus bàn phím** (`:focus-visible`): viền ngoài 4px `focus`, cách 3px; ô nhập dùng `shadow-focus`. Không bao giờ tắt viền focus.

## Phản hồi và phần thưởng

- Sau khi bấm Kiểm tra, **dải phản hồi trượt lên từ dưới** (`duration-slide`), rồng Bông thò đầu ở mép trái, nút hành động bên phải nhận phím Enter.
- Đúng: sao bay từ đáp án vào thanh tiến độ hoặc chip sao (`duration-celebrate`), thanh tiến độ nảy lên.
- Chưa đúng: rồng *động viên*, nói nghĩa của hình bé đã chọn, cho làm lại. Lần 2 tự bật gợi ý; lần 3 cho xem đáp án và đưa câu đó xuống cuối bài.
- Kết thúc bài luôn có ít nhất 1 sao: 3 sao ≥ 90% đúng, 2 sao ≥ 70%.

## Bốn trạng thái dữ liệu

Mọi màn có dữ liệu đều thiết kế đủ: **Bình thường**; **Đang tải** — khung xương `b-sk` đúng bố cục thật (không dùng vòng xoay toàn màn); **Trống** — rồng *suy nghĩ* + một câu + một nút hành động; **Lỗi** — rồng *động viên* + câu nhẹ nhàng + nút **Thử lại**. Thanh trên cùng và nút thoát luôn còn để bé không bị kẹt; lỗi khoanh trong vùng bị lỗi khi phần còn lại vẫn dùng được.

## Bàn phím

| Phím | Tác dụng |
| --- | --- |
| `1`–`4` | Chọn đáp án (nhãn phím ở góc trên trái thẻ) |
| `Enter` | Kiểm tra · Tiếp tục · nút chính trên màn |
| `Space` | Nghe lại (bài nghe) · Lật thẻ (thẻ từ) |
| `←` `→` | Chuyển thẻ từ · di chuyển trong lưới trò chơi |
| `Esc` | Đóng hộp thoại · tạm dừng trò chơi |
| `Tab` | Đi qua mọi điều khiển theo thứ tự đọc |

Nhãn phím (`KeyHint`) chỉ hiện cho phím thật sự hoạt động trên màn đó. Kéo thả luôn có cách làm bằng bàn phím.

## Linh vật và hình ảnh

- Rồng Bông có 6 biểu cảm: `chao`, `vui`, `dongvien`, `suynghi`, `ngu`, `chucmung` (xem thẻ Mascot) và 4 màu bé chọn khi tạo hồ sơ. Không bao giờ buồn, khóc hay chê.
- Icon tự vẽ trên lưới 24px, nét 2.4px bo tròn (`Bong.icon`). Icon luôn đi cùng chữ, trừ loa, đóng, quay lại (có `aria-label`).
- Hình từ vựng (`Bong.pic`): khối màu phẳng, viền dày, không chữ trong hình, nền trong suốt.
- Không dùng ảnh chụp, gradient tím-xanh hay emoji.

## Chuyển động

`duration-fast` 120ms (nhấn) · `duration-base` 220ms (rê chuột, đổi trạng thái) · `duration-slide` 320ms (dải phản hồi) · `duration-celebrate` 900ms (sao bay). Linh vật nhún nhẹ liên tục. Khi hệ điều hành bật giảm chuyển động, tắt mọi hoạt ảnh lặp và rút ngắn chuyển cảnh.

## Dùng trong mã

Tải `tokens.css`, `components/bundle.css` rồi `components/bundle.js` (không cần React). `window.Bong` cung cấp `icon`, `pic`, `dragon`, `avatar`, `btn`, `speak`, `key`, `stars`, `stat`, `topbar`, `bubble`, `stateBlock`, `feedback`, `dialog`, `burst`, `say` cùng dữ liệu mẫu `words`, `levels`, `kids`. Lớp CSS có tiền tố `b-`. Kiểu chi tiết ở `components/index.d.ts`.
