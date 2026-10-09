# Học cùng Bông — Design System

Nguồn duy nhất cho mọi màu, chữ, khoảng cách, bo góc, bóng của web học tiếng Anh lớp 1–9. **Không viết cứng mã hex, cỡ chữ px hay bo góc lẻ trong component** — luôn dùng token (biến CSS hoặc khóa theme Tailwind). Thiếu token thì thêm vào đây trước, rồi mới dùng.

Nguồn: bản thiết kế Claude Design "Học cùng Bông" (https://claude.ai/artifact/JGCVaSgHCW5ZZn889noG5m), bản tải về nằm trong `designs/` (`tokens.json`, `README.md`, `components/*`). Khi thiết kế được cập nhật, sinh lại tệp này từ `designs/tokens.json`.

Phạm vi: **lõi chung + bộ Tiểu học** (theme `tieu-hoc`), **bộ THCS** (theme `thcs` sáng, `thcs-toi` tối) và **khu người lớn** (bố mẹ + quản trị, luôn dùng `thcs` sáng). Bản 09/10/2026 thêm token giai đoạn 2 (thẻ `Gd2Tokens`, `Gd3Tokens`, `Gd4Tokens`): dạng bài mới, trò chơi, trùm, phần thưởng, phòng của Bông, bản in, Khám phá từ, Họ vần. Giá trị các token đã có không đổi.

Token có nhiều giá trị được ghi dạng `TH … · THCS … · Tối …` (TH = `tieu-hoc`, THCS = `thcs`, Tối = `thcs-toi`). Theme chưa ghi riêng thì dùng giá trị của theme đứng trước.

---

## 1. Nguyên tắc (từ bản thiết kế)

Hệ thống giao diện cho web học tiếng Anh lớp 1–9, dùng chuột và bàn phím trên máy tính. Một **lõi chung** (token, thành phần, quy tắc) phục vụ hai bộ giao diện có cùng chức năng: **Tiểu học** (cấp 1–5, theme `tieu-hoc`) và **THCS** (cấp 6–10, theme `thcs` sáng và `thcs-toi` tối — xem mục *Bộ THCS* ở cuối). Linh vật đồng hành là **rồng Bông**: bé rồng tròn trịa ở Tiểu học, rồng tuổi teen mặc hoodie, đeo tai nghe ở THCS.

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

- Rồng Bông có 6 biểu cảm gốc: `chao`, `vui`, `dongvien`, `suynghi`, `ngu`, `chucmung` (xem thẻ Mascot), thêm `tiec` và `xaydung` cho hai tình huống riêng (xem thẻ MascotMore), và 4 màu bé chọn khi tạo hồ sơ. Không bao giờ khóc hay chê; `tiec` chỉ hơi tiếc khi bé dừng giữa bài.
- Icon tự vẽ trên lưới 24px, nét 2.4px bo tròn (`Bong.icon`). Icon luôn đi cùng chữ, trừ loa, đóng, quay lại (có `aria-label`).
- Hình từ vựng (`Bong.pic`): khối màu phẳng, viền dày, không chữ trong hình, nền trong suốt.
- Không dùng ảnh chụp, gradient tím-xanh hay emoji.

### Chuyển động

`duration-fast` 120ms (nhấn) · `duration-base` 220ms (rê chuột, đổi trạng thái) · `duration-slide` 320ms (dải phản hồi) · `duration-celebrate` 900ms (sao bay). Linh vật nhún nhẹ liên tục. Khi hệ điều hành bật giảm chuyển động, tắt mọi hoạt ảnh lặp và rút ngắn chuyển cảnh.

### Bộ THCS (cấp 6–10)

Cùng chức năng và lõi chung với Tiểu học (màu 10 cấp, màu phản hồi, thang khoảng cách, nhãn phím, dải phản hồi, 4 trạng thái dữ liệu), nhưng hiện đại, gọn và nhiều chữ hơn cho học sinh 11–15 tuổi.

#### Nội dung
- Xưng hô **"bạn"**, câu ngắn, thẳng: "Còn 70 XP nữa là đạt mục tiêu hôm nay!". Không giọng trẻ con, không "bé".
- Hướng dẫn và giải thích bằng tiếng Việt; nội dung học (từ, câu, đoạn đọc) bằng tiếng Anh thật theo chương trình, ví dụ *I have lived in Hanoi since 2015.*
- **Làm sai không bị phạt**: luôn hiện **giải thích ngắn vì sao sai** (≤ 2 câu, chỉ đúng chỗ sai: "since" cần mốc, "five years" là khoảng → for) rồi cho làm lại. Không trừ XP, không mất chuỗi ngày.
- **Đồng hồ đếm ngược chỉ có trong bài thi.** Khi còn dưới 5 phút, đồng hồ chuyển sang `retry` (cam nhẹ) kèm chữ "còn dưới 5 phút" — không đỏ, không nhấp nháy.

#### Chế độ sáng / tối
- Đặt `data-theme="thcs"` (sáng) hoặc `"thcs-toi"` (tối) trên `<html>`; nút mặt trăng/mặt trời trên thanh trên cùng (và thanh bài học) chuyển qua lại, `aria-pressed` cho biết đang tối.
- Hai chế độ dùng **cùng tên token** với lõi: `bg`, `surface`, `surface-soft`, `surface-sunk`, `line`, `line-strong`, `ink`, `ink-soft`, `brand`, `brand-soft`, `brand-shade`, `focus`, `success-soft/-shade`, `retry-soft/-shade`, `level-N-soft`, `level-N-ink`… chỉ khác giá trị theo theme. Giá trị Tiểu học không đổi.
- Token riêng THCS: `on-brand`, `on-retry`, `xp`, `xp-soft`, `badge-gold/silver/bronze`, `flag`, `on-flag`, `highlight`, `map-sea/land/road/park`, `chart-grid`, `sidebar-bg`, `dragon-hoodie`, `dragon-phones`.
- Tương phản đã kiểm ở **cả hai chế độ**: `ink` ≥ 15:1, `ink-soft` ≥ 6:1 trên mọi mặt; `on-brand` trên `brand` 5.97:1 (sáng) / 7.04:1 (tối); `level-N-ink` trên `level-N-soft` ≥ 4.6:1. Chữ/viền "chưa đúng" dùng `retry-shade`, vì `retry` trên nền trắng chỉ 2.3:1. Vòng focus `focus` 7:1 (sáng) / 8.7:1 (tối).
- Ở chế độ tối, nền các khối màu cấp (`level-N`) giữ nguyên để nhận diện thành phố; nền nhạt và chữ màu cấp đổi sang biến thể tối.

#### Chữ
- **Be Vietnam Pro** (họ `thcs`, thiết kế cho tiếng Việt). Thang: `thcs-display` 40 · `thcs-title` 28 · `thcs-h2` 22 · `thcs-h3` 18 · `thcs-body` 17 (giải thích tiếng Việt) · `thcs-body-s` 15 · `thcs-label` 14 · `thcs-caption` 13 (chỉ thông tin phụ) · `thcs-num` 28 · `thcs-num-xl` 64 (điểm thi) · `thcs-button` 16 · `thcs-key` 12.
- **Chữ tiếng Anh trong bài tối thiểu 20px** (`thcs-en` 20/30, `thcs-en-l` 24/34; token `thcs-en-min`).

#### Hình khối và bố cục
- Bo góc gọn hơn Tiểu học: `thcs-radius-sm` 6 · `md` 10 (nút, ô nhập, ô đáp án) · `lg` 14 (thẻ) · `xl` 20 (hộp thoại, dải phản hồi). Bóng phẳng: `thcs-shadow-1` (viền mảnh + bóng rất nhẹ), `thcs-shadow-2` (rê chuột, thẻ nổi), `thcs-shadow-pop`; mỗi bóng có giá trị riêng cho chế độ tối.
- Nút chính cao tối thiểu `thcs-control` **44px**; trong bài học `thcs-control-l` 52px.
- Khung trang: menu trái `thcs-sidebar` 248px, thu gọn còn icon `thcs-sidebar-mini` 76px (Trang chủ, Lộ trình, Học theo SGK, Ngữ pháp, Luyện thi, Ôn tập, Sổ từ, Thành tích; đáy là ảnh hồ sơ và nút Đổi hồ sơ). Thanh trên `thcs-topbar` 64px: tiêu đề, chip XP, chip chuỗi ngày, nút sáng/tối. Nội dung tối đa `thcs-content-max` 1200px, căn giữa trên màn 1920.
- Màn bài học và bài thi không có menu; vừa **1366×768 không cuộn**: thanh bài học 64px, chân bài 76px (68px khi cao ≤ 800), thân co giãn. Các màn tổng quan (trang chủ, sổ từ…) cho phép cuộn bên trong vùng nội dung.

#### Phần thưởng
XP (`xp`), huy hiệu 3 bậc (luôn ghi chữ Vàng/Bạc/Đồng) và danh hiệu theo cấp (Nhà thám hiểm Singapore, Thuyền trưởng Sydney, Thám tử London, Phóng viên New York, Đại sứ Toronto). Thay sao bay bằng tia XP bay vào chip XP. Không có bảng xếp hạng so sánh với bạn khác.

#### Bàn phím
Giữ như Tiểu học, thêm: `A`–`D` chọn đáp án (song song `1`–`4`), `H` gợi ý, `Esc` thoát bài (hỏi lại bằng hộp thoại), `Ctrl+Enter` nộp đoạn văn, `←` `→` đổi câu trong bài thi và đổi tab trong trang Unit. Ô đáp án hiện chữ cái A–D kèm số nhỏ ở góc.

#### Rồng Bông tuổi teen
`Bong.T.dragon(expr, size)` — cùng 6 biểu cảm. Chỉ xuất hiện **nhỏ** (30–104px): góc lời nhắc (`Bong.T.tip`), dải phản hồi, trạng thái trống/lỗi, màn hết giờ. Không chiếm giữa màn như ở Tiểu học.

### Khu người lớn (bố mẹ + quản trị nội dung)

Dùng chung lõi (10 màu cấp, màu phản hồi, thang khoảng cách, nút, thẻ, hộp thoại, 4 trạng thái dữ liệu) nhưng là **bảng điều khiển gọn, màu trung tính, nhiều số liệu**. Luôn dùng theme `thcs` sáng (`Bong.suite('adult')` ghim lại), chữ **Be Vietnam Pro** (họ `thcs`), khung 1440×900, tối ưu máy tính. Lớp CSS tiền tố `a-`, đặt trong vùng `.adm`.

#### Nội dung
- Xưng hô lịch sự với người lớn ("bố mẹ", "con"); nhãn nút là động từ: *Lưu thay đổi*, *Tạo giọng đọc tự động*, *Xuất Excel*.
- Số liệu thật, định dạng Việt: `2.926 từ`, `8,25 / 10`, ngày `2/10/2026`, giờ `21:10`.
- **Không có linh vật**, trừ rồng Bông 64px ở trạng thái trống.

#### Khung
- Menu trái tối `adm-side-bg` rộng `adm-sidebar` 240px, chuyển giữa Bố mẹ / Quản trị; chữ `adm-side-ink` (9.9:1), mục đang mở `adm-side-active` (6.85:1) + vạch `adm-side-accent`; focus trong menu `adm-side-focus` (7.5:1).
- Thanh trên `adm-topbar` 56px: tiêu đề, chọn con (khu bố mẹ), nút **"Về màn chọn hồ sơ"** ở góc phải (khu người lớn khoá lại sau khi rời).
- Nội dung tối đa `adm-content-max` 1280px, lưới 12 cột, khoảng cách theo thang `space-*` có sẵn.

#### Chữ, hình khối
- Thang `adm-h1` 24 · `adm-h2` 17 · `adm-h3` 15 · `adm-body` 14 · `adm-small` 13 · `adm-label` 12 · `adm-kpi` 28 · `adm-button` 14 · `adm-en` 15 (chữ tiếng Anh trong bảng quản trị — người lớn đọc nên không cần 20px).
- Bo góc `adm-radius-sm` 4 · `md` 6 (nút, ô nhập) · `lg` 10 (thẻ, bảng) · `xl` 14 (hộp thoại). Bóng `adm-shadow-card` (phẳng, viền mảnh), `adm-shadow-pop` (ngăn kéo, hộp thoại), `adm-shadow-drag` (mục đang kéo).
- Kích thước: `adm-control` 36px (nút, ô nhập), `adm-control-l` 44px (cổng vào, nút lưu lớn), `adm-row` 48px (hàng bảng), `adm-drawer` 480px, `adm-drawer-wide` 720px (biểu mẫu câu hỏi).

#### Biểu đồ
- Số liệu **chia theo cấp** dùng đúng `level-1`…`level-10`. Các trường hợp khác: `chart-1` (chuỗi chính, 4.4:1), `chart-1-soft` (vùng dưới đường), `chart-2`, `chart-3` (chuỗi phụ, luôn kèm chú giải), `chart-ref` (đường tham chiếu nét đứt: giới hạn 30 phút/ngày, mục tiêu 8,0, vạch kỳ trước), `chart-grid`.
- Một chuỗi thì một màu; nhãn số chỉ ở giá trị cao nhất hoặc điểm cuối; mọi cột/điểm có tooltip khi rê chuột hoặc Tab. Không dùng biểu đồ hai trục.

#### Bảng dữ liệu
Mọi bảng có **tìm kiếm, bộ lọc, sắp xếp** (`aria-sort`) và **phân trang** (chọn số dòng mỗi trang). Không có kết quả → trạng thái trống có nút "Xoá bộ lọc". Dòng bấm được mở ngăn kéo biểu mẫu bên phải.

#### Biểu mẫu và hành động
- Lỗi hiện **ngay dưới từng ô** khi rời ô và khi bấm Lưu: icon cảnh báo + câu nói rõ cách sửa, chữ `field-error`, ô nền `field-error-bg` (cam nâu 5:1 — **không dùng đỏ**), kèm `aria-invalid` và `aria-describedby`; Lưu đưa focus về ô lỗi đầu tiên.
- Hành động không hoàn tác (xoá hồ sơ, đặt lại tiến độ, xoá mục) dùng `adm-danger` / `adm-on-danger` (5.85:1) và **luôn có hộp thoại xác nhận**; xoá hồ sơ phải gõ đúng tên con.
- Nút "Lưu" bị khoá khi dữ liệu chưa hợp lệ (nhập Excel còn dòng lỗi, ma trận đề chưa đủ điểm) và ghi rõ lý do bên cạnh.
- "Xem như học sinh" luôn dựng bằng thành phần thật của bé (Tiểu học cho cấp 1–5, THCS cho cấp 6–10) trong khung `data-theme` riêng.

#### Bàn phím
Tab qua mọi điều khiển với viền `focus` 3px; menu tối dùng `adm-side-focus`. Kéo thả (cây lộ trình, bước bài học) luôn có cách bàn phím: Tab tới tay nắm rồi ↑/↓, có thông báo vị trí cho trình đọc màn hình. `Esc` đóng ngăn kéo và hộp thoại. Ghi âm: ←/→ tua 5 giây.

#### 16 màn
Khu bố mẹ: Cổng vào (PIN 4–6 số / mật khẩu) · Tổng quan · Kỹ năng · Kết quả thi · Bài viết & ghi âm · Lịch kiểm tra · Cài đặt. Quản trị: Bảng điều khiển · Cấu trúc lộ trình · Ngân hàng từ vựng · Ngân hàng câu hỏi · Soạn bài học · Hình ảnh & âm thanh · Nhập & xuất Excel · Chủ điểm ngữ pháp · Tạo đề thi theo ma trận. Mỗi màn có 4 trạng thái dữ liệu và 3 cỡ màn.

### Bổ sung giai đoạn 1

#### Tiểu học (màn 13–17)
- **Bài xếp lớp** (3 màn): giới thiệu → 12 câu nghe và chọn hình → kết quả. Trong lúc làm **không báo đúng/sai**, không sao bay; tiến độ là 12 ngôi sao nhỏ (`size-star-pip`, câu hiện tại viền `brand`). Có nút “Tớ chưa biết”. Kết quả là một cấp đề xuất (khối màu cấp) + một nhận xét ngắn, không hiện điểm. Luôn có đường lui: “Bỏ qua, bắt đầu theo lớp” và “Chọn cấp khác”.
- **Chọn từ đúng cho hình**: 1 hình lớn, 3 thẻ chữ có nhãn phím 1–3; chọn thẻ là Bông đọc từ đó. Kiểm tra, dải phản hồi, gợi ý giống “Nghe và chọn hình”.
- **Ôn tập hôm nay**: 5 hộp ghi nhớ theo màu mức thuộc — viền/dải `mastery-N`, nền `mastery-N-soft`, luôn kèm số hộp + tên mức + nhãn chữ. Đúng thì lên hộp kế tiếp; chưa nhớ thì về hộp 1 “để ôn sớm hơn” (không trừ gì). Hộp 2 là “hộp vàng”.
- **Hộp thoại “Dừng bài học?”**: rồng biểu cảm mới `tiec` (hơi tiếc — không khóc, không trách); “Học tiếp” là nút chính và có sẵn focus.
- **Màn “Sắp có”** cho nút chưa làm: rồng biểu cảm mới `xaydung` (mũ `dragon-hat`, búa `dragon-tool`), không hứa ngày.
- Linh vật nay có **8 biểu cảm**: 6 biểu cảm gốc + `tiec` + `xaydung` (chỉ dùng đúng hai chỗ trên).

#### Khu quản trị (người quản trị là phụ huynh)
- **Nhập chủ đề mới bằng Excel** (thẻ mới trong Nhập & xuất Excel): tệp mẫu 2 trang *Chủ đề* (cấp, tên Anh, tên Việt) và *Từ vựng* (từ, phiên âm, loại từ, nghĩa, ví dụ Anh – Việt). Lỗi chặn nhập (thiếu ô, trùng dòng, câu ví dụ không chứa từ) khác **cảnh báo** không chặn (“Từ đã có” nền `brand-soft`, “Chưa có hình” nền xám). “Tự tạo bài học” chia 5–8 từ mỗi bài và liệt kê trước các bài sẽ tạo. Mọi thứ nhập vào ở trạng thái **Nháp**.
- **Khung chương trình** trong cây lộ trình: chủ đề có trong khung mà chưa có bài mang nhãn **“Chưa có bài”** — trung tính, viền nét đứt (`adm-status-none-ink`, `adm-status-none-line`), khác Nháp (nền xám) và Đã xuất bản (xanh) — kèm số từ mục tiêu. Bấm vào mở bảng từ mục tiêu với “Xuất Excel để điền” và “Nhập Excel”.
- Bảng điều khiển có thẻ **Chủ đề chưa có bài** theo từng cấp (cột màu cấp + danh sách).

### Bổ sung giai đoạn 2 · Tiểu học (cấp 1–5)

#### Khung chung (`Bong.L`)
Mọi dạng bài và trò chơi mới nằm trong khung của “Nghe và chọn hình”: × mở hộp thoại “Dừng bài học?”, thanh tiến độ, chân bài Nghe lại (Space) · Gợi ý (H) · Kiểm tra/Tiếp tục (Enter). Đúng: xanh + sao bay vào thanh tiến độ. Chưa đúng: cam nhẹ, Bông động viên, làm lại; **sai 2 lần tự bật gợi ý**. Không có màn thua, không trừ điểm, không đếm ngược. Mọi từ và câu tiếng Anh có loa; chữ trong đoạn đọc là nút `.b-kw` bấm để nghe + nghĩa.

#### 7 dạng bài mới
Ghép âm (`Screen23-Phonics`) · Truyện tranh có đọc to (`Screen24-Story`) · Luyện nói (`Screen25-Speak`, ghi âm màu tím `rec`, có trạng thái chưa cho micro / không có micro) · Sắp xếp từ thành câu (`Screen26-SentenceOrder`) · Nghe và gõ (`Screen27-Dictation`, gợi ý bằng phím ? vì H phải gõ được) · Điền từ vào câu (`Screen28-FillBlank`) · Đọc hiểu ngắn (`Screen29-ShortReading`).

#### 3 mini game
Mỗi game là một bước trong bài: lớp phủ bắt đầu (1 dòng cách chơi có hình, Bắt đầu · Enter), tạm dừng Esc/⏸ (Chơi tiếp · Thoát), bảng kết thúc (số đúng, sao, xu, Tiếp tục). Chân bài game `Bong.L.gfoot`: Bông + lời nhắn, Nghe lại, Gợi ý, điểm. Thời lượng chuyển động (`duration-bubble-rise`, `duration-mole-up`) là **tốc độ**, không phải đồng hồ.
- Bong bóng từ vựng (`Screen30-Bubbles`): phím 1–5 in trên bóng; bóng bay mất sẽ bay lại.
- Đập chuột chữ cái (`Screen31-WhackLetters`): phím 1–9 theo bàn phím số; đập sai chuột lè lưỡi.
- Đua xe trả lời (`Screen32-Race`): xe ma = chính bé lần trước, đi theo **số câu**, không theo giờ; lần đầu không có xe ma.

#### Trùm và bài thi lên cấp
- Trận trùm (`Screen33-Boss`): trùm dễ thương theo vùng (Vua Khỉ Lém – Con vật). Thanh **năng lượng của trùm** (`boss-energy`, vàng cam, luôn kèm số) giảm khi bé đúng; trùm không bao giờ thắng; cuối trận trùm làm bạn.
- Cổng lên cấp (`LevelGate`) ở cuối đường đảo (`Screen34-IslandMapGate`, màn mới): khoá hiện “Còn N vùng”, mở thì sáng `gate-glow`.
- Giới thiệu bài thi (`Screen35-LevelTestIntro`): 20 câu, trộn dạng bài, không đếm giờ, cần 80%; thanh tiến độ **20 chấm** (`size-test-dot`).
- Đạt (`Screen36-LevelUp`): Bông lớn lên trước/sau, đảo mới mở, sao + xu + huy hiệu. Chưa đạt (`Screen37-LevelTestRetry`): không dùng chữ “trượt”; 2–3 chủ đề nên ôn, “Ôn chủ đề này”, “Thi lại sau”.

#### Rồng Bông lớn lên (`MascotGrowth`)
5 dáng theo cấp: Hạt giống (trong vỏ trứng) → Mầm non (mầm lá) → Lá xanh (dáng gốc) → Cành cây (khăn quàng) → Cây lớn (gần tuổi teen, sừng dài). Cùng nét vẽ, cùng 4 màu bé chọn, cả 8 biểu cảm dùng được cho mọi dáng: `Bong.dragon(expr, size, { stage })`.

#### Token mới
Xem thẻ “Token bổ sung giai đoạn 2”: `read-highlight`, `phon-slot`, `rec*`, `bubble-1…5`, `bubble-shine`, `game-sky*`, `mole-*`, `race-*`, `boss-*`, `gate-*`, `dragon-egg*`, `dragon-leaf`, `dragon-scarf-4/5`, `size-phon-tile`, `size-mic`, `size-bubble`, `size-mole-hole`, `size-race-lane`, `size-test-dot`, `size-boss`, `duration-read-word`, `duration-rec-max`, `duration-bubble-rise`, `duration-mole-up`. Không có màu đỏ: ghi âm dùng tím, năng lượng trùm dùng vàng cam.

### Bổ sung đợt 5B · Phần thưởng, phòng của tớ, người lớn giai đoạn 2

#### Phần thưởng (Tiểu học)
- Bộ sưu tập · Sticker (`Screen38-Stickers`): album theo chủ đề (Con vật, Xe cộ, Khủng long, Trái cây) như cuốn sổ dán; sticker đã có viền trắng cắt bế, nghiêng nhẹ, tên tiếng Anh + loa; ô chưa có là bóng mờ nét đứt. ← → đổi trang.
- Bộ sưu tập · Huy hiệu (`Screen39-Badges`): huy hiệu tròn vành vàng + ruy băng; chưa đạt thì xám kem + điều kiện + thanh tiến độ luôn kèm số (63/100 từ).
- Nhận phần thưởng (`RewardPopup`): hộp quà lắc nhẹ → mở → sticker/huy hiệu, Bông chúc mừng, tên tiếng Anh tự đọc 1 lần, xu thưởng, “Cho vào bộ sưu tập”. Kết thúc bài có sticker bất ngờ: `Screen40-LessonEndSticker` (màn cũ giữ nguyên).
- Xu thưởng là token họ `coins`: bài học 20, sticker 10, huy hiệu 50, trận trùm 30.

#### Phòng của tớ
- Phòng (`Screen41-MyRoom`): Xem (bấm đồ nghe tên tiếng Anh) và Trang trí (kéo thả; bàn phím Tab chọn, mũi tên di chuyển, R xoay, Delete cất kho); Tủ đồ mặc mũ, áo cho Bông.
- Cửa hàng (`Screen42-Shop`): Nội thất · Quần áo · Mũ; giá theo token (`price-furniture-s/m/l` 40/80/150, `price-special` 400, `price-clothes` 60, `price-hat` 50). Không đủ xu: nút mờ, Bông nói còn thiếu bao nhiêu và gợi ý học thêm một bài. **Xu chỉ dùng trong trò chơi: không có tiền thật, không quảng cáo.**
- Bông mặc đồ: `Bong.dragon(expr, size, { top: 'tee'|'stripe'|'raincoat', hat: 'cap'|'beanie'|'sunhat', stage })`; không truyền thì rồng y như cũ. Trang chủ có Bông mặc đồ + thẻ nổi Chuỗi ngày (thẻ nghỉ phép còn / đã dùng): `Screen43-HomeDressed`.

#### Chi tiết Tiểu học
- Sổ từ bổ sung (`Screen44-NotebookPlus`): đã gặp / đã thuộc, lọc cấp + chủ đề, thẻ phóng to, “In danh sách từ”.
- Bản in (`Screen45-WordListPrint`): A4 dọc, chỉ `print-*` trắng đen, ô 3 dòng kẻ tập viết; bố cục theo em nên bản xem trên màn và bản in giống nhau.
- Học tập trung (`LessonTools` + `Screen46-LessonFocus`): nút Toàn màn hình (F, Esc thoát trước khi hỏi dừng bài) và Âm thanh (Nhạc nền, Hiệu ứng, Âm lượng; giọng đọc luôn bật).
- Chưa đến giờ học (`Screen47-OutsideHours`): ban ngày, Bông chơi ngoài vườn, giờ bắt đầu, các ngày được học, “Bố mẹ mở” bằng PIN.

#### Khu người lớn · giai đoạn 2
Khung `Bong.A.shell2` thêm mục mới vào menu (nhãn “Mới”), menu cũ giữ nguyên: Bố mẹ · “Tiến độ & mở khoá” (`Adult17-Progress`); Quản trị · “Truyện tranh” (`Adult19-StoryEditor`), “Âm phonics” (`Adult20-PhonicsSounds`), “Phần thưởng” (`Adult21-Rewards`). Câu hỏi dạng mới (`Adult18-QuestionTypes2`) mở trong Ngân hàng câu hỏi. Mở khoá thủ công màu tím `adm-unlocked-manual`; thiếu âm thanh màu cam `adm-audio-missing`.

#### Token mới
Xem thẻ “Token bổ sung đợt 5B” (`Gd3Tokens`): `album-*`, `sticker-*`, `badge-*`, `gift-*`, `room-*`, `price-chip*`, `owned-chip`, `outfit-*`, `streak-day*`, `freeze-card*`, `print-*`, `focus-scrim`, `volume-*`, `garden-*`, `day-allowed`, `adm-lock`, `adm-unlocked-manual`, `adm-audio-missing`, `size-sticker*`, `size-badge`, `size-shop-card`, `size-room-item`, `size-print-*`, cùng họ mới `coins`. Vẫn không có màu đỏ.

### Bổ sung đợt 6 · Khám phá từ, Họ vần, Ghép chữ đầu

#### Ba chức năng học từ (Tiểu học)
- Khám phá từ (`Screen48-WordExplorer`): thẻ từ lớn bên trái toả ra 4–6 nhánh đường cong đánh số, mỗi nhánh một câu hỏi (What’s this? · What color is a bird? · What does a bird like to eat? · What does a bird have? · What can a bird do? · Where does a bird live?). Nhánh chưa mở có ô “?”, đang hỏi thì bé đoán bằng 2–3 hình (phím 1–3), đã mở hiện hình + từ có loa. Mở đủ: Bông chúc mừng, “Đọc cả đoạn”, Nói theo, In (`Screen49-WordExplorerPrint`, A4 trắng đen, tuỳ chọn kèm bản dịch).
- Họ vần (`Screen50-WordFamily`): vần ở giữa (bấm nghe cả họ), các từ cùng vần quanh đó, **phần vần tô cùng một màu** `rime-ink` ở mọi từ; từ chưa học mờ với nhãn “Sắp học”; ô “Bẫy chính tả” cho từ cùng chữ khác âm (eat, what) có lời Bông. Họ theo âm: “-ir” /ɜː/.
- Ghép chữ đầu (`Screen51-BuildFamily`): kéo, bấm hoặc gõ chữ đầu vào trước vần; từ thật thì hình hiện ra và bay vào “Đã tìm được”, từ không có thật (zat) thì Bông nói nhẹ; đủ 5 từ là xong.
- Mỗi màn có 2 cách hiện: **trong khung bài học** (thanh tiến độ, “Dừng bài học?”, chân bài Nghe lại · Gợi ý · Kiểm tra) và **tự khám phá từ Sổ từ** (chỉ có nút Đóng, không tính điểm). Làm sai không bị phạt, không đếm ngược; bấm vào từ hay câu tiếng Anh nào cũng nghe được.

#### Đọc cả đoạn và dịch nghĩa (`ReadAloudParagraph`)
Khung đoạn văn dùng chung trong Khám phá từ và Họ vần: P đọc cả đoạn (câu đang đọc `read-highlight`, chữ đang đọc `read-word-bg`), Tạm dừng, Đọc chậm; bấm câu để nghe riêng, bấm từ để nghe + nghĩa trong bong bóng. T bật “Dịch nghĩa”: **mặc định ẩn** để bé tự nghe hiểu trước; bản dịch hiện dưới từng câu, chữ `translation` nhỏ hơn, màu `trans-ink` nhạt hơn; có thể dịch riêng một câu.

#### Liên kết qua lại (`WordLinks`)
Chỉ ở chế độ tự khám phá: Quay lại (Backspace), đường dẫn tối đa 4 bậc (bird › họ -ir › Ghép chữ), nút “Họ vần của bird: -ir”, nút Ghép · Khám phá trên thẻ họ vần, bấm từ đã tìm được để khám phá. Trong khung bài học thì ẩn. Một lượt đi đầy đủ: `Screen53-WordJourney`. Thẻ từ trong Sổ từ có thêm tab Thẻ từ · Khám phá · Họ vần (`Screen52-NotebookWordTabs`, tab chưa có dữ liệu thì ẩn).

#### Khu quản trị
Soạn Khám phá từ (`Adult22-WordExplorerEditor`, tab “Khám phá” trong ngăn kéo của Ngân hàng từ vựng) và Họ vần (`Adult23-WordFamilies`, mục menu mới “Họ vần” qua `Bong.A.shell3`): bộ câu hỏi mẫu theo nhóm, nhánh kéo thả, đáp án từ kho, hình nhiễu, đoạn văn ghép từ câu trả lời + dịch + giọng đọc tự động; từ thành viên “Cùng âm / Bẫy: khác âm”, gợi ý từ trong kho, chữ đầu không thành từ. Báo lỗi dưới ô, “Xem như học sinh”, Nháp/Xuất bản.

#### Token mới
Xem thẻ “Token bổ sung đợt 6” (`Gd4Tokens`): `rime-*`, `branch-*`, `q-mark-*`, `trap-*`, `trans-ink`, `trans-rule`, `read-word-*`, `links-*`, `crumb-*`, `soon-*`, `letter-tile`, `build-slot-bg`, `found-chip`, `fake-word-bg`, `size-word-card`, `size-branch-node`, `size-branch-line`, `size-family-card`, `size-rime-hub`, `size-letter-tile`, `size-links-strip`, `size-print-answer-line`, `duration-branch-open`, `duration-read-word-slow`, kiểu chữ `translation`, họ mới `wordlab`. Vẫn không có màu đỏ.

### Dùng trong mã

Tải `tokens.css`, `components/bundle.css` rồi `components/bundle.js` (không cần React). `window.Bong` cung cấp `icon`, `pic`, `dragon`, `avatar`, `btn`, `speak`, `key`, `stars`, `stat`, `topbar`, `bubble`, `stateBlock`, `feedback`, `dialog`, `burst`, `say` cùng dữ liệu mẫu `words`, `levels`, `kids`. Lớp CSS có tiền tố `b-`. Bộ THCS: gọi `Bong.suite('thcs')` rồi dùng `Bong.T` (`shell`, `btn`, `opt`, `chip`, `ring`, `bars`, `badge`, `dragon`, `tip`, `state`, `feedback`, `dialog`, `lessonHead`, `lessonFoot`); `Bong.setMode('thcs' | 'thcs-toi')` đổi sáng/tối. Lớp CSS THCS có tiền tố `t-`, đặt trong vùng `.thcs`. Kiểu chi tiết ở `components/index.d.ts`. Khu người lớn: gọi `Bong.suite('adult')` rồi dùng `Bong.A` (`shell`, `btn`, `kpi`, `status`, `field`, `validate`, `wireValidate`, `setErr`, `toggle`, `table`, `drawer`, `dialog`, `toast`, `sortable`, `vbars`, `hbars`, `line`, `empty`, `error`, `skel`) cùng dữ liệu mẫu `Bong.A.data`; lớp CSS tiền tố `a-` trong vùng `.adm`. Giai đoạn 2 Tiểu học: `Bong.L` (`head`, `foot`, `dots`, `wire`, `ok`, `retry`, `say`, `words`, `overlay`, `gameStart`, `gamePause`, `gameEnd`, `gfoot`, `gmsg`, `grow`, `monkey`, `gate`), `Bong.LevelGate`, `Bong.MascotGrowth`. Đợt 5B: `Bong.R` (`sticker`, `medal`, `gift`, `reward`, `tools`, `wireTools`, `soundPanel`, `sound`, `roomWords`, `stickerWords`), `Bong.RewardPopup` (= `Bong.R.reward`), `Bong.LessonTools` (= `Bong.R.tools`; gắn phím F, Esc và bảng âm thanh bằng `Bong.R.wireTools`), `Bong.A.shell2`, và tuỳ chọn `top` / `hat` của `Bong.dragon`. Đợt 6: `Bong.W` (`explorer`, `lines`, `family`, `famLines`, `builder`, `paragraph`, `wireParagraph`, `links`, `linkBtn`, `frame`, `app`, dữ liệu mẫu `wx`, `fam`, `build`), `Bong.ReadAloudParagraph` (= `Bong.W.paragraph`), `Bong.WordLinks` (= `Bong.W.links`), `Bong.A.shell3`.


---

## 2. Token màu

| Token | Giá trị | Dùng cho |
|---|---|---|
| `bg` | TH `#fff8ec` · THCS `#f6f7fb` · Tối `#0e1120` | Nền trang Tiểu học (kem ấm). Chữ `ink`, `ink-soft` đọc tốt trên nền này. THCS: nền vùng nội dung (sáng xám-xanh / tối). |
| `bg-sea` | `#bfe9f7` | Nền biển trên bản đồ đảo và tổng quan 10 cấp. |
| `bg-sea-deep` | `#8fd6ee` | Sóng, bóng nước quanh đảo trên bản đồ. |
| `bg-night` | `#23264f` | Nền đêm của màn Hết giờ học. Chữ `ink-on-dark` trên nền này. |
| `surface` | TH `#ffffff` · THCS `#ffffff` · Tối `#171b2d` | Mặt thẻ, hộp thoại, ô nhập. THCS: thẻ, bảng, ô nhập. |
| `surface-soft` | TH `#fff1d9` · THCS `#eff1f7` · Tối `#1f2438` | Mặt phụ: khối gợi ý, hàng danh sách xen kẽ, nền nhóm nút. THCS: khối phụ, hàng bảng rê chuột, khung công thức. |
| `surface-sunk` | TH `#f4ead8` · THCS `#e3e7f0` · Tối `#2a3049` | Rãnh thanh tiến độ, ô trống chờ thả hình, khung xương khi tải. THCS: rãnh tiến độ, khung xương. |
| `line` | TH `#ecdfc8` · THCS `#dfe3ed` · Tối `#2c3250` | Viền trang trí của thẻ và vạch chia (không mang nghĩa). THCS: vạch chia, viền thẻ. |
| `line-strong` | TH `#9d8a6c` · THCS `#858ca3` · Tối `#737b9a` | Viền ô nhập và điều khiển; đạt 3:1 trên `surface` và `bg`. THCS: viền ô nhập, nút phụ, ô đáp án (≥3:1 cả hai chế độ). |
| `ink` | TH `#2b2440` · THCS `#151a2d` · Tối `#eef0f8` | Chữ chính trên `bg`, `surface`, `surface-soft` và mọi màu `-soft`. THCS: chữ chính trên bg, surface, surface-soft, surface-sunk và các màu -soft. |
| `ink-soft` | TH `#5e5670` · THCS `#4a5170` · Tối `#aeb5cf` | Chữ phụ, chú thích, phiên âm trên `bg` và `surface`. THCS: chữ phụ, nhãn, phiên âm (≥6:1 trên mọi mặt). |
| `ink-disabled` | TH `#a39cb0` · THCS `#9aa0b4` · Tối `#5f6684` | Chữ của nút vô hiệu (không yêu cầu tương phản). |
| `ink-on-dark` | `#ffffff` | Chữ trên `brand`, `bg-night`, các màu cấp 5–10 và `success`. |
| `ink-on-dark-soft` | `#c9cbf2` | Chữ phụ trên `bg-night`. |
| `brand` | TH `#1c6fd1` · THCS `#3355e0` · Tối `#7d98ff` | Nút chính (Kiểm tra, Tiếp tục, Đăng nhập). Chữ `ink-on-dark`. THCS: nút chính, mục đang chọn, liên kết. Chữ trên nền: `on-brand`. |
| `brand-shade` | TH `#14539f` · THCS `#2140b8` · Tối `#a9bbff` | Gờ dưới 3D của nút `brand`, chữ liên kết khi rê chuột. THCS: chữ liên kết/nhấn trên `brand-soft` (sáng 7.2:1, tối 6.4:1). |
| `brand-hover` | TH `#2a7fe3` · THCS `#2a49cc` · Tối `#97adff` | Mặt nút `brand` khi rê chuột. |
| `brand-soft` | TH `#e2eeff` · THCS `#e8edfd` · Tối `#232c55` | Nền nút phụ được chọn, thẻ đáp án đang chọn. Chữ `brand-shade`/`ink`. THCS: nền mục điều hướng đang chọn, đáp án đang chọn. |
| `brand-soft-shade` | TH `#c3d8f5` · THCS `#cdd7fb` · Tối `#33407a` | Gờ dưới của nút loa nhỏ và viền thẻ đáp án khi rê chuột. |
| `scrim` | TH `rgba(43, 36, 64, 0.45)` · THCS `rgba(14, 17, 32, 0.5)` · Tối `rgba(0, 0, 0, 0.62)` | Lớp phủ tối sau hộp thoại. |
| `focus` | TH `#5b2ee8` · THCS `#5b2ee8` · Tối `#b9a3ff` | Vòng focus khi dùng phím Tab: viền 3px `surface` + 3px `focus`, đạt 3:1 trên mọi nền sáng lẫn màu cấp. THCS tối: tím nhạt 8.7:1 trên nền tối. |
| `star` | `#ffc531` | Sao thưởng (đã đạt), hiệu ứng sao bay. |
| `star-shade` | `#e39a00` | Viền và gờ của sao, xu. |
| `star-empty` | `#e6dccb` | Sao chưa đạt. |
| `coin` | `#ffb300` | Mặt đồng xu. |
| `streak` | `#ff7a3d` | Ngọn lửa chuỗi ngày học (chỉ là biểu tượng, không dùng làm màu chữ). |
| `success` | `#22873f` | Phản hồi đúng: icon, viền thẻ đúng, nền nút Tiếp tục ở dải đúng. Chữ `ink-on-dark` (4.6:1). |
| `success-shade` | TH `#176a31` · THCS `#176a31` · Tối `#7fdc9c` | Gờ 3D của nút trong dải đúng; chữ tiêu đề 'Chính xác!' trên `success-soft`. THCS tối: chữ/icon "đúng" trên `success-soft` và `surface`. |
| `success-soft` | TH `#dcf5e2` · THCS `#dcf5e2` · Tối `#14301f` | Nền dải phản hồi đúng, nền thẻ đáp án đúng. THCS tối: nền dải đúng. |
| `retry` | `#f39646` | Phản hồi chưa đúng (cam nhẹ, không dùng đỏ): icon, viền thẻ chọn sai. Không dùng làm màu chữ. |
| `retry-shade` | TH `#a04e0f` · THCS `#a04e0f` · Tối `#ffb27a` | Chữ tiêu đề 'Chưa đúng rồi' trên `retry-soft`; gờ 3D nút Thử lại. THCS tối: chữ/icon "chưa đúng" trên `retry-soft` và `surface`. |
| `retry-soft` | TH `#ffead6` · THCS `#ffead6` · Tối `#3a2614` | Nền dải phản hồi chưa đúng, nền thẻ chọn sai. THCS tối: nền dải chưa đúng. |
| `info-soft` | TH `#e9e4ff` · THCS `#ece9ff` · Tối `#262046` | Nền bong bóng lời thoại của rồng Bông và hộp gợi ý. THCS: khung mẹo nhớ, lời nhắc của Bông. |
| `mastery-1` | `#cfc6dc` | Mức 1 · Mới gặp: viền thẻ từ trong Sổ từ, kèm số chấm 1–5 (màu không đứng một mình). |
| `mastery-2` | `#ffc94d` | Mức 2 · Đang nhớ: viền thẻ từ trong Sổ từ, kèm số chấm 1–5 (màu không đứng một mình). |
| `mastery-3` | `#3fb0ee` | Mức 3 · Khá nhớ: viền thẻ từ trong Sổ từ, kèm số chấm 1–5 (màu không đứng một mình). |
| `mastery-4` | TH `#7a4fe6` · THCS `#7a4fe6` · Tối `#a083ff` | Mức 4 · Nhớ tốt: viền thẻ từ trong Sổ từ, kèm số chấm 1–5 (màu không đứng một mình). THCS tối: sáng hơn để viền nổi trên nền tối. |
| `mastery-5` | TH `#1f9a52` · THCS `#1f9a52` · Tối `#3fbf74` | Mức 5 · Thuộc lòng: viền thẻ từ trong Sổ từ, kèm số chấm 1–5 (màu không đứng một mình). |
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
| `level-1-soft` | TH `#fdf1db` · THCS `#fdf1db` · Tối `#483929` | Nền nhạt của cấp 1: nền vùng bản đồ, nhãn cấp. Chữ `level-1-ink`. |
| `level-1-ink` | TH `#906225` · THCS `#906225` · Tối `#f4a51c` | Chữ màu cấp 1 trên `surface` và `level-1-soft` (≥4.5:1). |
| `on-level-1` | `#2b2440` | Chữ/icon đặt trên nền `level-1`. |
| `level-2` | `#7dbe31` | Màu chủ đạo cấp 2 · Mầm non (Tiểu học): nền nút cấp, thanh tiến độ, đảo/thành phố trên bản đồ. Chữ trên nền này: `on-level-2`. |
| `level-2-shade` | `#618e31` | Gờ 3D, đường viền đậm của các mảng màu cấp 2. |
| `level-2-soft` | TH `#eaf5de` · THCS `#eaf5de` · Tối `#2d3f2e` | Nền nhạt của cấp 2: nền vùng bản đồ, nhãn cấp. Chữ `level-2-ink`. |
| `level-2-ink` | TH `#537731` · THCS `#537731` · Tối `#7dbe31` | Chữ màu cấp 2 trên `surface` và `level-2-soft` (≥4.5:1). |
| `on-level-2` | `#2b2440` | Chữ/icon đặt trên nền `level-2`. |
| `level-3` | `#14a88f` | Màu chủ đạo cấp 3 · Lá xanh (Tiểu học): nền nút cấp, thanh tiến độ, đảo/thành phố trên bản đồ. Chữ trên nền này: `on-level-3`. |
| `level-3-shade` | `#167f74` | Gờ 3D, đường viền đậm của các mảng màu cấp 3. |
| `level-3-soft` | TH `#d9f1ed` · THCS `#d9f1ed` · Tối `#163a43` | Nền nhạt của cấp 3: nền vùng bản đồ, nhãn cấp. Chữ `level-3-ink`. |
| `level-3-ink` | TH `#16766f` · THCS `#16766f` · Tối `#30b29c` | Chữ màu cấp 3 trên `surface` và `level-3-soft` (≥4.5:1). |
| `on-level-3` | `#2b2440` | Chữ/icon đặt trên nền `level-3`. |
| `level-4` | `#2f9bea` | Màu chủ đạo cấp 4 · Cành cây (Tiểu học): nền nút cấp, thanh tiến độ, đảo/thành phố trên bản đồ. Chữ trên nền này: `on-level-4`. |
| `level-4-shade` | `#2975b6` | Gờ 3D, đường viền đậm của các mảng màu cấp 4. |
| `level-4-soft` | TH `#deeffc` · THCS `#deeffc` · Tối `#1c3757` | Nền nhạt của cấp 4: nền vùng bản đồ, nhãn cấp. Chữ `level-4-ink`. |
| `level-4-ink` | TH `#286dab` · THCS `#286dab` · Tối `#48a7ed` | Chữ màu cấp 4 trên `surface` và `level-4-soft` (≥4.5:1). |
| `on-level-4` | `#2b2440` | Chữ/icon đặt trên nền `level-4`. |
| `level-5` | `#7a4fe6` | Màu chủ đạo cấp 5 · Cây lớn (Tiểu học): nền nút cấp, thanh tiến độ, đảo/thành phố trên bản đồ. Chữ trên nền này: `on-level-5`. |
| `level-5-shade` | `#5f3eb3` | Gờ 3D, đường viền đậm của các mảng màu cấp 5. |
| `level-5-soft` | TH `#eae3fb` · THCS `#eae3fb` · Tối `#2d2656` | Nền nhạt của cấp 5: nền vùng bản đồ, nhãn cấp. Chữ `level-5-ink`. |
| `level-5-ink` | TH `#7049d4` · THCS `#7049d4` · Tối `#a284ee` | Chữ màu cấp 5 trên `surface` và `level-5-soft` (≥4.5:1). |
| `on-level-5` | `#ffffff` | Chữ/icon đặt trên nền `level-5`. |
| `level-6` | `#c93686` | Màu chủ đạo cấp 6 · Singapore (THCS): nền nút cấp, thanh tiến độ, đảo/thành phố trên bản đồ. Chữ trên nền này: `on-level-6`. |
| `level-6-shade` | `#982c6e` | Gờ 3D, đường viền đậm của các mảng màu cấp 6. |
| `level-6-soft` | TH `#f6dfec` · THCS `#f6dfec` · Tối `#3e2141` | Nền nhạt của cấp 6: nền vùng bản đồ, nhãn cấp. Chữ `level-6-ink`. |
| `level-6-ink` | TH `#b0317a` · THCS `#b0317a` · Tối `#d972aa` | Chữ màu cấp 6 trên `surface` và `level-6-soft` (≥4.5:1). |
| `on-level-6` | `#ffffff` | Chữ/icon đặt trên nền `level-6`. |
| `level-7` | `#0b7fab` | Màu chủ đạo cấp 7 · Sydney (THCS): nền nút cấp, thanh tiến độ, đảo/thành phố trên bản đồ. Chữ trên nền này: `on-level-7`. |
| `level-7-shade` | `#0f6189` | Gờ 3D, đường viền đậm của các mảng màu cấp 7. |
| `level-7-soft` | TH `#d8ebf2` · THCS `#d8ebf2` · Tối `#143149` | Nền nhạt của cấp 7: nền vùng bản đồ, nhãn cấp. Chữ `level-7-ink`. |
| `level-7-ink` | TH `#0d6e97` · THCS `#0d6e97` · Tối `#4fa3c3` | Chữ màu cấp 7 trên `surface` và `level-7-soft` (≥4.5:1). |
| `on-level-7` | `#ffffff` | Chữ/icon đặt trên nền `level-7`. |
| `level-8` | `#c8463c` | Màu chủ đạo cấp 8 · London (THCS): nền nút cấp, thanh tiến độ, đảo/thành phố trên bản đồ. Chữ trên nền này: `on-level-8`. |
| `level-8-shade` | `#973839` | Gờ 3D, đường viền đậm của các mảng màu cấp 8. |
| `level-8-soft` | TH `#f6e1e0` · THCS `#f6e1e0` · Tối `#3e2430` | Nền nhạt của cấp 8: nền vùng bản đồ, nhãn cấp. Chữ `level-8-ink`. |
| `level-8-ink` | TH `#b03f3a` · THCS `#b03f3a` · Tối `#d77a73` | Chữ màu cấp 8 trên `surface` và `level-8-soft` (≥4.5:1). |
| `on-level-8` | `#ffffff` | Chữ/icon đặt trên nền `level-8`. |
| `level-9` | `#4b4fc4` | Màu chủ đạo cấp 9 · New York (THCS): nền nút cấp, thanh tiến độ, đảo/thành phố trên bản đồ. Chữ trên nền này: `on-level-9`. |
| `level-9-shade` | `#3d3e9b` | Gờ 3D, đường viền đậm của các mảng màu cấp 9. |
| `level-9-soft` | TH `#e2e3f6` · THCS `#e2e3f6` · Tối `#22264e` | Nền nhạt của cấp 9: nền vùng bản đồ, nhãn cấp. Chữ `level-9-ink`. |
| `level-9-ink` | TH `#4b4fc4` · THCS `#4b4fc4` · Tối `#888bd8` | Chữ màu cấp 9 trên `surface` và `level-9-soft` (≥4.5:1). |
| `on-level-9` | `#ffffff` | Chữ/icon đặt trên nền `level-9`. |
| `level-10` | `#2e7d5b` | Màu chủ đạo cấp 10 · Toronto (THCS): nền nút cấp, thanh tiến độ, đảo/thành phố trên bản đồ. Chữ trên nền này: `on-level-10`. |
| `level-10-shade` | `#28604f` | Gờ 3D, đường viền đậm của các mảng màu cấp 10. |
| `level-10-soft` | TH `#deeae5` · THCS `#deeae5` · Tối `#1c3137` | Nền nhạt của cấp 10: nền vùng bản đồ, nhãn cấp. Chữ `level-10-ink`. |
| `level-10-ink` | TH `#2c7257` · THCS `#2c7257` · Tối `#6da48c` | Chữ màu cấp 10 trên `surface` và `level-10-soft` (≥4.5:1). |
| `on-level-10` | `#ffffff` | Chữ/icon đặt trên nền `level-10`. |
| `on-brand` | TH `#ffffff` · THCS `#ffffff` · Tối `#0b1020` | Chữ/icon trên nền `brand` (sáng 5.97:1, tối 7.04:1). |
| `on-retry` | TH `#2b2440` · THCS `#2b2440` · Tối `#2b2440` | Chữ trên nền `retry` (6.5:1) ở mọi theme. |
| `xp` | TH `#5b3fd6` · THCS `#5b3fd6` · Tối `#b0a1ff` | THCS: điểm kinh nghiệm — icon tia sét, vòng mục tiêu, cột biểu đồ XP; dùng được làm chữ số (≥6.7:1). |
| `xp-soft` | TH `#ece8ff` · THCS `#ece8ff` · Tối `#2a2452` | THCS: nền chip XP, rãnh vòng mục tiêu. |
| `badge-gold` | TH `#e2a300` · THCS `#e2a300` · Tối `#ffcc4d` | THCS: huy hiệu bậc Vàng (kèm chữ "Vàng"). |
| `badge-silver` | TH `#94a0b8` · THCS `#94a0b8` · Tối `#b9c3d8` | THCS: huy hiệu bậc Bạc (kèm chữ). |
| `badge-bronze` | TH `#c27a45` · THCS `#c27a45` · Tối `#e09a68` | THCS: huy hiệu bậc Đồng (kèm chữ). |
| `flag` | TH `#e8a400` · THCS `#e8a400` · Tối `#ffcc4d` | THCS bài thi: câu đánh dấu xem lại (ô số + icon cờ). Chữ trên nền: `on-flag`. |
| `on-flag` | TH `#151a2d` · THCS `#151a2d` · Tối `#151a2d` | Chữ trên nền `flag`. |
| `highlight` | TH `#fff0b3` · THCS `#fff0b3` · Tối `#4d4214` | THCS đọc hiểu: nền từ đang tra nghĩa. Chữ `ink`. |
| `map-sea` | TH `#dde8fb` · THCS `#dde8fb` · Tối `#111a33` | THCS: biển trên bản đồ thế giới / sông trên bản đồ thành phố. |
| `map-land` | TH `#ffffff` · THCS `#ffffff` · Tối `#20273f` | THCS: đất liền trên bản đồ thế giới, khối phố. |
| `map-road` | TH `#e6e9f2` · THCS `#e6e9f2` · Tối `#2b3150` | THCS: đường phố trên bản đồ London. |
| `map-park` | TH `#d8eedb` · THCS `#d8eedb` · Tối `#173326` | THCS: công viên trên bản đồ London. |
| `chart-grid` | TH `#e3e7f0` · THCS `#e3e7f0` · Tối `#2a3049` | THCS: vạch lưới biểu đồ (lặn, mảnh 1px). |
| `sidebar-bg` | TH `#ffffff` · THCS `#ffffff` · Tối `#131729` | THCS: nền thanh menu bên trái. |
| `dragon-hoodie` | TH `#4b4fc4` · THCS `#4b4fc4` · Tối `#5b5fd6` | Rồng Bông tuổi teen: áo hoodie. |
| `dragon-phones` | TH `#2b2440` · THCS `#2b2440` · Tối `#5a6182` | Rồng Bông tuổi teen: tai nghe. |
| `adm-side-bg` | `#1b2030` | Người lớn: nền thanh menu trái (xám xanh đậm) — tách biệt khu người lớn với khu của bé. |
| `adm-side-hover` | `#262c40` | Người lớn: mục menu khi rê chuột. |
| `adm-side-active` | `#323a56` | Người lớn: nền mục menu đang mở. |
| `adm-side-ink` | `#c5cadb` | Người lớn: chữ/icon menu trên `adm-side-bg` (9.9:1) và `adm-side-active` (6.9:1). |
| `adm-side-ink-active` | `#ffffff` | Người lớn: chữ mục menu đang mở. |
| `adm-side-accent` | `#8ea6ff` | Người lớn: vạch chỉ mục đang mở, tiêu đề nhóm menu (≥4.8:1 trên nền menu). |
| `adm-side-focus` | `#b9a3ff` | Người lớn: vòng focus trong thanh menu tối (7.5:1). |
| `chart-1` | `#2a78d6` | Biểu đồ: chuỗi chính (phút học, điểm thi, kỹ năng) khi số liệu không chia theo cấp. Chia theo cấp thì dùng `level-N`. |
| `chart-1-soft` | `#e3edfa` | Biểu đồ: nền vùng dưới đường điểm, cột nền so sánh. |
| `chart-2` | `#138a69` | Biểu đồ: chuỗi thứ hai (ví dụ: bài học trong biểu đồ nhóm). Luôn kèm chú giải và nhãn. |
| `chart-3` | `#4a3aa7` | Biểu đồ: chuỗi thứ ba (ví dụ: câu hỏi). |
| `chart-ref` | `#6b7189` | Biểu đồ: đường tham chiếu nét đứt (giới hạn 30 phút/ngày, mục tiêu điểm 8), mốc so sánh 4 tuần trước. |
| `field-error` | `{retry-shade}` | Biểu mẫu: chữ và viền ô lỗi (cam nâu, không đỏ) — luôn kèm icon và câu nói rõ cách sửa. |
| `adm-danger` | `{retry-shade}` | Người lớn: nút hành động không hoàn tác được (xoá hồ sơ, đặt lại tiến độ). Cam nâu, không đỏ; chữ `adm-on-danger` (5.85:1). Luôn có hộp thoại xác nhận. |
| `adm-on-danger` | `#ffffff` | Người lớn: chữ trên nút `adm-danger`. |
| `field-error-bg` | `{retry-soft}` | Biểu mẫu: nền nhạt của ô đang lỗi, dòng lỗi trong bảng nhập Excel. |
| `mastery-1-soft` | TH `#f3f0f8` · THCS `#f3f0f8` · Tối `#29263a` | Nền hộp ghi nhớ 1 · Mới gặp (màn Ôn tập hôm nay). Chữ `ink`; viền/dải trên dùng `mastery-1`. |
| `mastery-2-soft` | TH `#fff4d3` · THCS `#fff4d3` · Tối `#3a3018` | Nền hộp ghi nhớ 2 · Đang nhớ — “hộp vàng”. |
| `mastery-3-soft` | TH `#def1fc` · THCS `#def1fc` · Tối `#16314a` | Nền hộp ghi nhớ 3 · Khá nhớ. |
| `mastery-4-soft` | TH `#ece5fc` · THCS `#ece5fc` · Tối `#2c2350` | Nền hộp ghi nhớ 4 · Nhớ tốt. |
| `mastery-5-soft` | TH `#dcf2e5` · THCS `#dcf2e5` · Tối `#163826` | Nền hộp ghi nhớ 5 · Thuộc lòng. |
| `dragon-hat` | `#ffb81c` | Mũ bảo hộ của rồng Bông ở biểu cảm `xaydung` (màn Sắp có). |
| `dragon-hat-shade` | `#d98a00` | Vành và sọc mũ bảo hộ. |
| `dragon-tool` | `#9a6a46` | Cán búa gỗ của rồng Bông khi đang xây. |
| `dragon-tool-head` | `#7d8597` | Đầu búa. |
| `adm-status-none-ink` | `{ink-soft}` | Người lớn: chữ + icon nhãn “Chưa có bài” — chủ đề có trong khung chương trình nhưng chưa có bài. Trung tính, khác Nháp (nền xám) và Xuất bản (xanh). |
| `adm-status-none-line` | `{line-strong}` | Người lớn: viền nét đứt của nhãn “Chưa có bài” và hàng chủ đề trống trong cây lộ trình. |
| `read-highlight` | `#ffe48c` | Tiểu học: nền chữ đang được đọc (truyện đọc to, đoạn đọc hiểu) và ô chữ đang phát âm khi ghép âm. Chữ trên nền vẫn là `ink` (≥ 12:1). |
| `phon-slot` | `#fffaf0` | Ghép âm: nền ô trống chờ ô chữ; viền nét đứt `line-strong`. |
| `rec` | `#6a3fd6` | Luyện nói: nút micro khi đang ghi âm, sóng âm, vạch thời lượng. Tím (không dùng đỏ cho ghi âm). Chữ trên nền: `ink-on-dark`. |
| `rec-soft` | `#efe8ff` | Luyện nói: vòng lan quanh micro khi đang ghi, nền thẻ kết quả nghe lại. |
| `rec-track` | `#e6dccb` | Luyện nói: rãnh vạch thời lượng (tối đa `duration-rec-max`), cột sóng âm khi im lặng. |
| `bubble-1` | `#bfe6ff` | Bong bóng từ vựng: màu bong bóng 1 (xanh trời). 5 màu xoay vòng, luôn kèm số phím in trên bong bóng. |
| `bubble-2` | `#ffd3e8` | Bong bóng từ vựng: màu 2 (hồng). |
| `bubble-3` | `#d3f5c2` | Bong bóng từ vựng: màu 3 (xanh lá). |
| `bubble-4` | `#ffe7a8` | Bong bóng từ vựng: màu 4 (vàng). |
| `bubble-5` | `#e3d9ff` | Bong bóng từ vựng: màu 5 (tím). |
| `bubble-shine` | `#ffffff` | Bong bóng: vệt bóng sáng và viền trong. |
| `game-sky` | `#d8f1ff` | Mini game: nền trời trên (bong bóng, đua xe). |
| `game-sky-2` | `#f4fbff` | Mini game: nền trời dưới (dải chuyển). |
| `mole-ground` | `#a4da7c` | Đập chuột: nền cỏ của sân. |
| `mole-ground-shade` | `#7fbf57` | Đập chuột: gờ cỏ, viền sân. |
| `mole-hole` | `#4a2f22` | Đập chuột: lòng hang. |
| `mole-hole-rim` | `#9a6a46` | Đập chuột: miệng hang (đất). |
| `mole-fur` | `#b98a66` | Đập chuột: lông chuột chũi. |
| `mole-belly` | `#f3d8bb` | Đập chuột: mặt, bụng chuột; nền thẻ chữ trên tay chuột là `surface`. |
| `mole-tongue` | `#ff8fa8` | Đập chuột: lưỡi lè vui khi bé đập chưa đúng. |
| `race-grass` | `#a8df82` | Đua xe: cỏ hai bên đường. |
| `race-track` | `#6f7889` | Đua xe: mặt đường. Chữ trên đường dùng `ink-on-dark`. |
| `race-track-edge` | `#ffffff` | Đua xe: vạch mép đường, vạch chia làn. |
| `race-ghost` | `rgba(239, 232, 255, 0.5)` | Đua xe: thân “xe ma” mờ, trong suốt một nửa trên mặt đường (thành tích lần trước của chính bé). |
| `race-ghost-line` | `#d9ccff` | Đua xe: viền nét đứt của xe ma trên mặt đường `race-track`. Nhãn “Lần trước” dùng chữ `rec` trên `surface`. |
| `race-finish-a` | `#2b2440` | Đua xe: ô cờ đích tối. |
| `race-finish-b` | `#ffffff` | Đua xe: ô cờ đích sáng. |
| `boss-energy` | `#ffb703` | Trận trùm: thanh “năng lượng của trùm” (vàng cam, không đỏ). Luôn kèm số “4/6” bằng chữ. |
| `boss-energy-shade` | `#e08e00` | Trận trùm: gờ dưới thanh năng lượng. |
| `boss-energy-track` | `#efe3cd` | Trận trùm: rãnh thanh năng lượng. |
| `boss-fur` | `#b07a4f` | Trùm Vua Khỉ Lém: lông. |
| `boss-face` | `#ffd9b0` | Trùm Vua Khỉ Lém: mặt, tai trong, bụng. |
| `gate-stone` | `#d2c1a4` | Cổng thi lên cấp: đá cổng. |
| `gate-stone-shade` | `#a38f72` | Cổng thi lên cấp: gờ đá, khe gạch. |
| `gate-glow` | `#fff1a8` | Cổng thi lên cấp: ánh sáng trong cổng khi đã mở. |
| `gate-dark` | `#4a3f5c` | Cổng thi lên cấp: lòng cổng tối và song chắn khi còn khoá. |
| `dragon-egg` | `#fff6e3` | Rồng Bông dáng cấp 1 (Hạt giống): vỏ trứng. |
| `dragon-egg-spot` | `#ffd59e` | Rồng Bông dáng cấp 1: chấm trên vỏ trứng. |
| `dragon-leaf` | `{level-2}` | Rồng Bông dáng cấp 2 (Mầm non): mầm lá trên đầu. |
| `dragon-scarf-4` | `{level-4}` | Rồng Bông dáng cấp 4 (Cành cây): khăn quàng. |
| `dragon-scarf-5` | `{level-5}` | Rồng Bông dáng cấp 5 (Cây lớn): khăn quàng có đuôi. |
| `album-page` | `#fffdf7` | Bộ sưu tập: nền trang album (giấy kem). Ô sticker đặt trên nền này. |
| `album-spine` | `#c98b5a` | Bộ sưu tập: gáy album và mép bìa. |
| `album-ring` | `#b0a491` | Bộ sưu tập: khoen gáy album. |
| `album-animals` | `#ffe6c7` | Album Con vật: dải đầu trang và nền thẻ chủ đề (chữ `ink`). |
| `album-vehicles` | `#d9eaff` | Album Xe cộ: dải đầu trang và nền thẻ chủ đề. |
| `album-dino` | `#dff2cf` | Album Khủng long: dải đầu trang và nền thẻ chủ đề. |
| `album-fruits` | `#ffe0ea` | Album Trái cây: dải đầu trang và nền thẻ chủ đề. |
| `sticker-frame` | `#ffffff` | Sticker: viền trắng cắt bế quanh hình (độ dày `size-sticker-frame`). |
| `sticker-shadow` | `rgba(91, 66, 30, 0.18)` | Sticker: bóng đổ dưới sticker đã dán. |
| `sticker-slot` | `#f3ece0` | Sticker: nền ô chưa có (hình hiện bóng mờ). |
| `sticker-slot-line` | `#d8c9b0` | Sticker: viền nét đứt của ô chưa có. |
| `sticker-ghost` | `rgba(43, 36, 64, 0.14)` | Sticker: bóng mờ của sticker chưa có (đổ một màu lên hình). |
| `sticker-new` | `#ff9f1c` | Sticker / huy hiệu: nhãn “Mới”. Chữ trên nền: `ink`. |
| `badge-ring` | `{star}` | Huy hiệu: vành vàng của huy hiệu đã đạt. |
| `badge-ring-shade` | `{star-shade}` | Huy hiệu: gờ vành, tia. |
| `badge-ribbon-a` | `#3f8cff` | Huy hiệu: dải ruy băng trái. |
| `badge-ribbon-b` | `#2bb38a` | Huy hiệu: dải ruy băng phải. |
| `badge-locked` | `#e6dccb` | Huy hiệu chưa đạt: vành và lõi xám kem (luôn kèm điều kiện + thanh tiến độ bằng chữ). |
| `badge-locked-ink` | `#8f8370` | Huy hiệu chưa đạt: biểu tượng mờ trong lõi (đồ hoạ, không phải chữ). |
| `gift-box` | `#9b5de5` | Hộp quà (phần thưởng mới, sticker bất ngờ): thân hộp. |
| `gift-box-shade` | `#7a3fc4` | Hộp quà: mặt bên, gờ nắp. |
| `gift-ribbon` | `#ffc531` | Hộp quà: ruy băng và nơ. |
| `gift-glow` | `#fff1a8` | Hộp quà: tia sáng khi nắp bật ra. |
| `room-wall` | `#fde9c9` | Phòng của tớ: tường. |
| `room-wall-pattern` | `#f9dcae` | Phòng của tớ: hoạ tiết chấm trên tường. |
| `room-trim` | `#e9c08f` | Phòng của tớ: chân tường, viền cửa sổ. |
| `room-floor` | `#dcae7a` | Phòng của tớ: sàn gỗ. |
| `room-floor-line` | `#c48f5a` | Phòng của tớ: khe ván sàn. |
| `room-window-sky` | `#bfe9f7` | Phòng của tớ: trời ngoài cửa sổ. |
| `room-item-select` | `{brand}` | Phòng của tớ: vòng chọn đồ vật ở chế độ Trang trí (kèm tay nắm xoay). |
| `room-drop` | `rgba(63, 140, 255, 0.14)` | Phòng của tớ: vùng đặt được khi đang kéo đồ. |
| `room-shadow` | `rgba(91, 66, 30, 0.16)` | Phòng của tớ: bóng đổ dưới đồ đạc trên sàn. |
| `price-chip` | `#fff3cc` | Cửa hàng: nền nhãn giá xu. |
| `price-chip-ink` | `#7a5200` | Cửa hàng: chữ giá xu trên `price-chip` (≥ 7:1). |
| `owned-chip` | `{success-soft}` | Cửa hàng: nền nhãn “Đã có”; chữ `success-shade`. |
| `outfit-tee` | `#3f8cff` | Bông mặc đồ: áo phông. |
| `outfit-stripe-a` | `#ffffff` | Bông mặc đồ: áo sọc, sọc sáng. |
| `outfit-stripe-b` | `#2bb38a` | Bông mặc đồ: áo sọc, sọc xanh lá. |
| `outfit-raincoat` | `#ffd23f` | Bông mặc đồ: áo mưa vàng. |
| `outfit-cap` | `#3f8cff` | Bông mặc đồ: mũ lưỡi trai. |
| `outfit-cap-brim` | `#2a6fd6` | Bông mặc đồ: vành mũ lưỡi trai. |
| `outfit-beanie` | `#9b5de5` | Bông mặc đồ: mũ len. |
| `outfit-pompom` | `#ffffff` | Bông mặc đồ: quả bông trên mũ len. |
| `outfit-sunhat` | `#f2cf8a` | Bông mặc đồ: mũ rơm. |
| `outfit-ribbon` | `#2bb38a` | Bông mặc đồ: dải ruy băng mũ rơm. |
| `streak-day` | `{streak}` | Thẻ Chuỗi ngày: ngày đã học (nền lửa cam + dấu tick, kèm chữ thứ). |
| `streak-day-soft` | `#ffe9d6` | Thẻ Chuỗi ngày: ngày hôm nay chưa học xong. |
| `freeze-card` | `#bfe6ff` | Thẻ nghỉ phép của tuần (băng xanh): còn dùng được. |
| `freeze-card-ink` | `#1d5f8c` | Thẻ nghỉ phép: chữ và biểu tượng trên `freeze-card` (≥ 4.5:1). |
| `print-paper` | `#ffffff` | Bản in danh sách từ: giấy A4. |
| `print-ink` | `#000000` | Bản in: chữ và kẻ bảng — chỉ trắng đen, in máy đen trắng không mất thông tin. |
| `print-muted` | `#4d4d4d` | Bản in: chữ phụ (nghĩa, câu ví dụ). |
| `print-rule` | `#9a9a9a` | Bản in: đường kẻ dòng trong ô tập viết. |
| `focus-scrim` | `rgba(43, 36, 64, 0.04)` | Chế độ học tập trung: nền rất nhạt quanh khung bài để mắt tập trung giữa màn. |
| `volume-track` | `{line}` | Bảng âm thanh: rãnh thanh kéo âm lượng. |
| `volume-fill` | `{brand}` | Bảng âm thanh: phần đã kéo và núm kéo. |
| `garden-sky` | `#cfeeff` | Chưa đến giờ học: trời ban ngày (cùng họ màn Hết giờ học ban đêm `bg-night`). |
| `garden-grass` | `#9fd67a` | Chưa đến giờ học: bãi cỏ trong vườn. |
| `garden-grass-shade` | `#7fbf57` | Chưa đến giờ học: gờ cỏ, bụi cây. |
| `garden-flower` | `#ffb3c7` | Chưa đến giờ học: hoa trong vườn. |
| `day-allowed` | `{success-soft}` | Chưa đến giờ học: ngày được học trong tuần (kèm dấu tick + chữ). |
| `adm-lock` | `{ink-soft}` | Người lớn · Tiến độ của con: biểu tượng khoá của bài/chủ đề chưa mở. |
| `adm-unlocked-manual` | `#6a3fd6` | Người lớn · Tiến độ của con: nhãn “Mở thủ công” (bố mẹ tự mở), tím `rec` để phân biệt với mở theo tiến độ. |
| `adm-audio-missing` | `{field-error}` | Người lớn · Âm phonics: chấm “Thiếu âm thanh” (luôn kèm chữ). |
| `rime-ink` | `#0a6e61` | Họ vần / Ghép chữ đầu: chữ của phần vần, tô cùng một màu ở mọi từ trong họ (≥ 4.5:1 trên `rime-bg` và `surface`). |
| `rime-bg` | `#d4f3eb` | Họ vần: nền nhẹ sau phần vần trong từ, ô vần cố định ở Ghép chữ đầu. |
| `rime-hub` | `#0b7a6b` | Họ vần: nút vần ở giữa (bấm để nghe cả họ). Chữ trên nền: `rime-hub-ink`. |
| `rime-hub-ink` | `#ffffff` | Họ vần: chữ vần và phiên âm trên `rime-hub`. |
| `rime-line` | `#8fd9c6` | Họ vần: đường nối từ vần ở giữa tới các thẻ từ. |
| `branch-line` | `#cbc2df` | Khám phá từ: đường cong của nhánh chưa mở. |
| `branch-line-open` | `#6cc48b` | Khám phá từ: đường cong của nhánh đã mở. |
| `branch-line-active` | `{brand}` | Khám phá từ: đường cong của nhánh đang hỏi (nét đậm hơn). |
| `branch-node` | `{surface}` | Khám phá từ: nền ô nhánh chưa mở / đang hỏi. |
| `branch-node-open` | `{success-soft}` | Khám phá từ: nền ô nhánh đã mở. |
| `branch-num` | `{brand-soft}` | Khám phá từ: nền số nhánh 1–6 (chữ `brand`). Đang hỏi: nền `brand`, chữ `on-brand`; đã mở: nền `success`. |
| `q-mark-bg` | `#fff1c2` | Khám phá từ: ô “?” ở chỗ đáp án của nhánh chưa mở. |
| `q-mark-ink` | `#7a5200` | Khám phá từ: dấu “?” trên `q-mark-bg` (≥ 4.5:1). |
| `trap-bg` | `#fff4df` | Họ vần: nền ô “Bẫy chính tả” (từ cùng chữ, khác âm). |
| `trap-line` | `#e5a23c` | Họ vần: viền nét đứt ô “Bẫy chính tả”. |
| `trap-ink` | `#8a4600` | Họ vần: chữ cùng mặt chữ nhưng khác âm trong từ bẫy (gạch dưới lượn sóng, ≥ 4.5:1 trên `trap-bg`). |
| `trans-ink` | `#655d7a` | Đọc cả đoạn: chữ bản dịch tiếng Việt dưới câu tiếng Anh — nhạt hơn `ink`, vẫn ≥ 4.5:1 trên `surface`. |
| `trans-rule` | `#e4dcf3` | Đọc cả đoạn: vạch dọc nhỏ bên trái dòng dịch. |
| `read-word-bg` | `#ffcd45` | Đọc cả đoạn: nền chữ đang được đọc (đậm hơn `read-highlight` của cả câu). |
| `read-word-ink` | `{ink}` | Đọc cả đoạn: chữ đang được đọc. |
| `links-bg` | `#e9f2ff` | Liên kết qua lại: nền dải nút liên kết + đường dẫn (chỉ ở chế độ tự khám phá). |
| `links-line` | `#c3d9fb` | Liên kết qua lại: viền dải liên kết, mũi tên giữa các bậc đường dẫn. |
| `crumb-ink` | `{ink-soft}` | Liên kết qua lại: bậc đã qua trong đường dẫn (bấm được). |
| `crumb-now` | `{ink}` | Liên kết qua lại: bậc đang ở (đậm, không bấm). |
| `soon-bg` | `#eeeaf5` | Họ vần: nhãn “Sắp học” trên thẻ từ bé chưa học (thẻ mờ). |
| `soon-ink` | `#5a536d` | Họ vần: chữ nhãn “Sắp học”. |
| `build-slot-bg` | `#f3f8ff` | Ghép chữ đầu: ô trống trước vần để thả chữ (viền nét đứt `brand`). |
| `letter-tile` | `#fff9ee` | Ghép chữ đầu: nền ô chữ đầu kéo được. |
| `found-chip` | `{success-soft}` | Ghép chữ đầu: thẻ từ trong danh sách “Đã tìm được”. |
| `fake-word-bg` | `{retry-soft}` | Ghép chữ đầu: ô ghép khi ra từ không có thật (cam nhẹ, không phạt). |

## 3. Chữ

Họ chữ (Google Fonts, tải bằng `next/font/google`):

- `display`: `"Baloo 2", "Nunito", system-ui, sans-serif`
- `body`: `"Nunito", "Baloo 2", system-ui, sans-serif`
- `thcs`: `"Be Vietnam Pro", system-ui, sans-serif`

**Tiểu học · Hiển thị (Baloo 2)** (họ `display`)

| Kiểu | Cỡ / dòng / đậm | Dùng cho |
|---|---|---|
| `display-xl` | 56px / 62px / 800 | Tiêu đề màn chúc mừng, kết thúc bài, hết giờ học. |
| `display-l` | 40px / 48px / 800 | Tiêu đề màn (chọn hồ sơ, sổ từ, bản đồ). |
| `title` | 28px / 36px / 700 | Tiêu đề thẻ, hộp thoại, câu hướng dẫn trong bài. |
| `word-xl` | 72px / 80px / 800 | Từ tiếng Anh trên thẻ từ lớn. |
| `word` | 32px / 40px / 700 | Từ tiếng Anh trên thẻ đáp án, thẻ nối, mưa từ. |
| `stat` | 24px / 28px / 800 | Số sao, xu, chuỗi ngày trên thanh trên cùng. |
| `button-l` | 24px / 28px / 800 | Chữ nút lớn (64px) trong bài học. |

**Tiểu học · Nội dung (Nunito)** (họ `body`)

| Kiểu | Cỡ / dòng / đậm | Dùng cho |
|---|---|---|
| `body-l` | 22px / 30px / 700 | Lời hướng dẫn tiếng Việt, lời thoại của rồng Bông. |
| `body` | 18px / 26px / 600 | Câu ví dụ, mô tả ngắn. Cỡ nhỏ nhất cho nội dung bé đọc. |
| `button` | 20px / 24px / 800 | Chữ nút vừa (52px). |
| `label` | 16px / 20px / 800 | Nhãn, chip lọc, tên trên thẻ hồ sơ; phần dành cho bố mẹ. |
| `caption` | 14px / 18px / 700 | Phiên âm, chú thích phụ. Không dùng cho lời hướng dẫn bé. |
| `key` | 13px / 16px / 800 | Nhãn phím tắt (1–4, Enter, Space). |
| `translation` | 18px / 26px / 600 | Bản dịch tiếng Việt dưới câu tiếng Anh (màu `trans-ink`), nhỏ hơn câu tiếng Anh. |

**THCS · Be Vietnam Pro** (họ `thcs`)

| Kiểu | Cỡ / dòng / đậm | Dùng cho |
|---|---|---|
| `thcs-display` | 40px / 48px / 700 | Lời chào trang chủ, tiêu đề màn kết thúc / hết giờ. |
| `thcs-title` | 28px / 36px / 700 | Tiêu đề trang, tiêu đề bài giảng. |
| `thcs-h2` | 22px / 30px / 700 | Tiêu đề thẻ, tiêu đề mục. |
| `thcs-h3` | 18px / 26px / 600 | Tiêu đề nhỏ trong thẻ, tên chủ đề. |
| `thcs-body` | 17px / 26px / 500 | Giải thích tiếng Việt, mô tả. |
| `thcs-body-s` | 15px / 22px / 500 | Thông tin phụ trong thẻ, ô bảng. |
| `thcs-en` | 20px / 30px / 500 | Nội dung tiếng Anh trong bài — cỡ tối thiểu 20px. |
| `thcs-en-l` | 24px / 34px / 600 | Câu hỏi, câu gốc, câu ví dụ chính. |
| `thcs-label` | 14px / 20px / 600 | Nhãn menu, nhãn trường, chip lọc, tiêu đề cột. |
| `thcs-caption` | 13px / 18px / 500 | Chú thích phụ, mốc thời gian (không dùng cho nội dung học). |
| `thcs-num` | 28px / 32px / 700 | Số liệu thẻ thống kê, XP. |
| `thcs-num-xl` | 64px / 68px / 800 | Điểm bài thi, % câu đúng ở màn kết quả. |
| `thcs-button` | 16px / 24px / 600 | Chữ nút (cao 44–52px). |
| `thcs-key` | 12px / 16px / 700 | Nhãn phím tắt THCS. |

**Người lớn · Be Vietnam Pro** (họ `thcs`)

| Kiểu | Cỡ / dòng / đậm | Dùng cho |
|---|---|---|
| `adm-h1` | 24px / 32px / 700 | Tiêu đề trang khu người lớn. |
| `adm-h2` | 17px / 24px / 600 | Tiêu đề thẻ, tiêu đề biểu đồ. |
| `adm-h3` | 15px / 22px / 600 | Tiêu đề nhóm trong thẻ, tên trường biểu mẫu. |
| `adm-body` | 14px / 22px / 400 | Chữ thường của bảng điều khiển, ô bảng. |
| `adm-small` | 13px / 18px / 400 | Chú thích, mốc thời gian, chữ phụ dưới số liệu. |
| `adm-label` | 12px / 16px / 600 | Tiêu đề cột bảng, nhãn trục biểu đồ, nhãn nhóm menu. |
| `adm-kpi` | 28px / 34px / 700 | Số liệu chính trên thẻ số liệu. |
| `adm-button` | 14px / 20px / 600 | Chữ nút khu người lớn. |
| `adm-en` | 15px / 22px / 500 | Nội dung tiếng Anh trong bảng và biểu mẫu quản trị (người lớn đọc, không cần 20px). |

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
| `thcs-radius-sm` | `6px` | THCS: nhãn phím, chip nhỏ, ô số bài thi. |
| `thcs-radius-md` | `10px` | THCS: nút, ô nhập, ô đáp án. |
| `thcs-radius-lg` | `14px` | THCS: thẻ, bảng. |
| `thcs-radius-xl` | `20px` | THCS: hộp thoại, dải phản hồi, khung bài học. |
| `adm-radius-sm` | `4px` | Người lớn: nhãn trạng thái, ô số lịch. |
| `adm-radius-md` | `6px` | Người lớn: nút, ô nhập, ô chọn. |
| `adm-radius-lg` | `10px` | Người lớn: thẻ, bảng, ngăn kéo biểu mẫu. |
| `adm-radius-xl` | `14px` | Người lớn: hộp thoại. |

## 6. Bóng

| Token | Giá trị | Dùng cho |
|---|---|---|
| `shadow-card` | `0 4px 0 0 #ecdfc8, 0 10px 24px rgba(91, 66, 30, 0.08)` | Thẻ nổi trên `bg`: gờ dưới màu `line` + bóng mềm. |
| `shadow-raised` | `0 6px 0 0 #e3d3b6, 0 16px 32px rgba(91, 66, 30, 0.12)` | Thẻ khi rê chuột / đang chọn. |
| `shadow-dialog` | `0 24px 64px rgba(43, 36, 64, 0.28)` | Hộp thoại, dải phản hồi. |
| `shadow-lip` | `0 6px 0 0 rgba(20, 20, 60, 0.22)` | Gờ 3D chung cho nút màu khi không có màu `-shade` riêng. |
| `shadow-inset` | `inset 0 3px 0 rgba(91, 66, 30, 0.10)` | Rãnh thanh tiến độ, ô thả hình. |
| `shadow-focus` | `0 0 0 3px #ffffff, 0 0 0 6px #5b2ee8` | Vòng focus bàn phím (Tab). |
| `thcs-shadow-1` | TH `0 1px 2px rgba(21, 26, 45, 0.06), 0 0 0 1px #dfe3ed` · THCS `0 1px 2px rgba(21, 26, 45, 0.06), 0 0 0 1px #dfe3ed` · Tối `0 1px 2px rgba(0, 0, 0, 0.4), 0 0 0 1px #2c3250` | THCS: thẻ, bảng (viền mảnh + bóng rất nhẹ). |
| `thcs-shadow-2` | TH `0 6px 18px rgba(21, 26, 45, 0.10), 0 0 0 1px #dfe3ed` · THCS `0 6px 18px rgba(21, 26, 45, 0.10), 0 0 0 1px #dfe3ed` · Tối `0 8px 24px rgba(0, 0, 0, 0.5), 0 0 0 1px #3a4166` | THCS: thẻ khi rê chuột, menu nổi, thẻ tra từ. |
| `thcs-shadow-pop` | TH `0 24px 64px rgba(21, 26, 45, 0.22)` · THCS `0 24px 64px rgba(21, 26, 45, 0.22)` · Tối `0 24px 64px rgba(0, 0, 0, 0.6)` | THCS: hộp thoại, dải phản hồi. |
| `thcs-focus-ring` | TH `0 0 0 2px #ffffff, 0 0 0 4px #5b2ee8` · THCS `0 0 0 2px #ffffff, 0 0 0 4px #5b2ee8` · Tối `0 0 0 2px #0e1120, 0 0 0 4px #b9a3ff` | THCS: vòng focus bàn phím của ô nhập và ô đáp án (outline 3px `focus` cho phần còn lại). |
| `adm-shadow-card` | `0 1px 2px rgba(16, 24, 40, 0.05), 0 0 0 1px #e1e5ee` | Người lớn: thẻ số liệu, bảng (phẳng, viền mảnh). |
| `adm-shadow-pop` | `0 16px 40px rgba(16, 24, 40, 0.18)` | Người lớn: ngăn kéo biểu mẫu, hộp thoại, menu nổi. |
| `adm-shadow-drag` | `0 10px 24px rgba(16, 24, 40, 0.22), 0 0 0 2px #3355e0` | Người lớn: mục đang được kéo trong cây lộ trình và danh sách bước bài học. |

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
| `thcs-sidebar` | `248px` | THCS: rộng thanh menu bên trái khi mở. |
| `thcs-sidebar-mini` | `76px` | THCS: rộng thanh menu khi thu gọn (chỉ icon). |
| `thcs-topbar` | `64px` | THCS: cao thanh trên cùng. |
| `thcs-control` | `44px` | THCS: chiều cao tối thiểu nút chính, ô nhập, mục menu. |
| `thcs-control-l` | `52px` | THCS: nút chính trong bài học, ô đáp án một dòng. |
| `thcs-content-max` | `1200px` | THCS: bề rộng nội dung tối đa bên phải menu; căn giữa trên màn 1920. |
| `thcs-en-min` | `20px` | THCS: cỡ chữ tiếng Anh tối thiểu trong bài. |
| `adm-sidebar` | `240px` | Người lớn: rộng menu trái. |
| `adm-topbar` | `56px` | Người lớn: cao thanh trên cùng. |
| `adm-control` | `36px` | Người lớn: cao nút, ô nhập, ô chọn mặc định. |
| `adm-control-l` | `44px` | Người lớn: nút chính ở cổng vào, nút lưu trong biểu mẫu lớn. |
| `adm-row` | `48px` | Người lớn: cao hàng bảng dữ liệu. |
| `adm-drawer` | `480px` | Người lớn: rộng ngăn kéo biểu mẫu bên phải. |
| `adm-drawer-wide` | `720px` | Người lớn: ngăn kéo rộng cho biểu mẫu câu hỏi (đổi theo dạng câu hỏi). |
| `adm-content-max` | `1280px` | Người lớn: bề rộng nội dung tối đa, căn giữa trên màn 1920. |
| `size-star-pip` | `28px` | Tiểu học: ngôi sao nhỏ trong thanh tiến độ 12 sao của bài xếp lớp. |
| `size-memory-box` | `184px` | Tiểu học: rộng một hộp ghi nhớ trên màn Ôn tập hôm nay (5 hộp vừa 1366×768). |
| `size-phon-tile` | `104px` | Ghép âm: cạnh ô chữ và ô trống (co theo chiều cao màn: min(104px, 12.5cqh)). |
| `size-mic` | `132px` | Luyện nói: nút micro lớn (phím R). |
| `size-bubble` | `150px` | Bong bóng từ vựng: đường kính bong bóng. |
| `size-mole-hole` | `150px` | Đập chuột: rộng một hang (lưới 3×3). |
| `size-race-lane` | `76px` | Đua xe: cao một làn đường. |
| `size-test-dot` | `14px` | Bài thi lên cấp: chấm tiến độ (20 chấm). |
| `size-boss` | `260px` | Trận trùm: cỡ nhân vật trùm ở màn mở đầu. |
| `size-sticker` | `112px` | Sticker trong lưới album (cạnh ô). |
| `size-sticker-frame` | `6px` | Độ dày viền trắng cắt bế của sticker. |
| `size-badge` | `120px` | Huy hiệu trong lưới (đường kính). |
| `size-shop-card` | `220px` | Rộng tối thiểu thẻ món đồ trong Cửa hàng. |
| `size-room-item` | `120px` | Cỡ chuẩn một đồ vật trong Phòng của tớ (đồ lớn ×1.5). |
| `size-print-page-w` | `210mm` | Bản in danh sách từ: rộng khổ A4 dọc. |
| `size-print-page-h` | `297mm` | Bản in danh sách từ: cao khổ A4 dọc. |
| `size-print-margin` | `14mm` | Bản in: lề trang. |
| `size-print-pic` | `16mm` | Bản in: hình nhỏ cạnh từ. |
| `size-print-write` | `48mm` | Bản in: rộng ô tập viết lại từ. |
| `size-word-card` | `300px` | Khám phá từ: rộng thẻ từ lớn bên trái. |
| `size-branch-node` | `72px` | Khám phá từ: cao tối thiểu ô nhánh (6 nhánh vừa 1366×768). |
| `size-branch-line` | `4px` | Khám phá từ: độ dày đường cong nhánh (đang hỏi: ×1.5). |
| `size-family-card` | `176px` | Họ vần: rộng thẻ từ quanh vần. |
| `size-rime-hub` | `148px` | Họ vần: đường kính nút vần ở giữa. |
| `size-letter-tile` | `76px` | Ghép chữ đầu: cạnh ô chữ đầu và ô thả chữ. |
| `size-links-strip` | `56px` | Liên kết qua lại: cao dải liên kết ở đầu màn. |
| `size-print-answer-line` | `9mm` | Bản in Khám phá từ: khoảng cách dòng trống để bé tự viết câu trả lời. |

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
| `duration-rec-max` | `10000ms` | Luyện nói: ghi âm tối đa 10 giây, vạch thời lượng đầy dần. |
| `duration-read-word` | `420ms` | Đọc to: thời gian sáng mỗi chữ khi giọng đọc chạy (ghép âm dùng 2 lần giá trị này mỗi âm). |
| `duration-bubble-rise` | `11000ms` | Bong bóng: thời gian một bong bóng bay từ đáy lên đỉnh (chậm, bay lại sau khi mất). |
| `duration-mole-up` | `3200ms` | Đập chuột: thời gian một con chuột ở trên hang trước khi thụt xuống rồi chui lên lại (không phải đếm ngược). |
| `duration-branch-open` | `360ms` | Khám phá từ: nhánh mở ra (đáp án hiện dần); tắt khi giảm chuyển động. |
| `duration-read-word-slow` | `640ms` | Đọc cả đoạn: thời gian sáng mỗi chữ khi bật “Đọc chậm” (thường: `duration-read-word`). |

## 10. Lớp (z-index)

| Token | Giá trị | Dùng cho |
|---|---|---|
| `z-map` | `1` | Lớp bản đồ. |
| `z-sticky` | `10` | Thanh trên cùng. |
| `z-feedback` | `40` | Dải phản hồi. |
| `z-dialog` | `50` | Hộp thoại và lớp phủ. |
| `z-burst` | `60` | Hiệu ứng sao bay. |

## 10b. Hằng số trò chơi (không phải biến CSS)

Hai họ token dưới đây là **số**, không phải giá trị giao diện. Đặt thành hằng số trong `src/lib/rules/` (vd `src/lib/rules/constants.ts`) để quy tắc xu, giá và Khám phá từ / Họ vần đọc từ một chỗ; không đưa vào `globals.css`.

**Xu và giá (họ `coins`)** · Xu là phần thưởng trong trò chơi, không đổi được ra tiền thật; không có mua bằng tiền, không có quảng cáo. Giá luôn hiện kèm biểu tượng xu.

| Token | Giá trị | Dùng cho |
|---|---|---|
| `coin-sticker-lesson` | `10` | Xu thưởng khi bài học rơi sticker bất ngờ. |
| `coin-badge` | `50` | Xu thưởng khi nhận một huy hiệu mới. |
| `coin-boss` | `30` | Xu thưởng khi thắng trận trùm cuối vùng. |
| `coin-lesson` | `20` | Xu thưởng cơ bản cho một bài học (+10 nếu 3 sao). |
| `price-furniture-s` | `40` | Giá đồ nội thất nhỏ (đồng hồ, cây cảnh, tranh). |
| `price-furniture-m` | `80` | Giá đồ nội thất vừa (đèn, ghế, thảm). |
| `price-furniture-l` | `150` | Giá đồ nội thất lớn (giá sách, giường, sô-pha). |
| `price-special` | `400` | Giá đồ đặc biệt (bể cá): để bé có mục tiêu tiết kiệm xu. |
| `price-clothes` | `60` | Giá một bộ áo cho Bông. |
| `price-hat` | `50` | Giá một chiếc mũ cho Bông. |

**Khám phá từ, Họ vần, Ghép chữ đầu (họ `wordlab`)** · Số cố định của Khám phá từ, Họ vần, Ghép chữ đầu, Đọc cả đoạn và Liên kết qua lại. Không có đồng hồ đếm ngược, làm sai không bị trừ điểm.

| Token | Giá trị | Dùng cho |
|---|---|---|
| `branch-min` | `4` | Khám phá từ: ít nhất 4 nhánh (câu hỏi) mỗi từ. |
| `branch-max` | `6` | Khám phá từ: nhiều nhất 6 nhánh; sơ đồ co giãn theo số nhánh. |
| `links-max-depth` | `4` | Liên kết qua lại: đường dẫn giữ tối đa 4 bậc; Quay lại (Backspace) về bậc trước. |
| `build-goal` | `5` | Ghép chữ đầu: tìm đủ 5 từ thật là xong bài (có sao). |
| `read-rate` | `0.82` | Đọc cả đoạn: tốc độ giọng đọc thường. |
| `read-rate-slow` | `0.6` | Đọc cả đoạn: tốc độ khi bật “Đọc chậm”. |

---

Mỗi mục có `designs/components/<Tên>/README.md` (hướng dẫn) và `preview.html` (bản xem, đủ 4 trạng thái dữ liệu và 3 cỡ màn với các màn). Chuyển sang React component theo mục "Chuyển thiết kế Claude Design sang Next.js" trong CLAUDE.md.

## 11. Thành phần dùng chung (lõi + Tiểu học)

| Thư mục | Tóm tắt |
|---|---|
| `Button` | Nút "kẹo dẻo" 3D: mặt màu + gờ dưới đậm hơn; rê chuột thì nhô lên 2px, nhấn thì lún xuống sát gờ, vô hiệu thì xám phẳng. |
| `Card` | Mặt trắng bo `radius-lg` nổi bằng `shadow-card` (gờ dưới `line` + bóng mềm) trên nền `bg`; thẻ đáp án (`b-choice`) có viền 4px đổi màu theo trạng thái. |
| `DataStates` | Bộ ba trạng thái cho mọi màn có dữ liệu, cùng với trạng thái bình thường. |
| `Dialog` | Hộp thoại giữa màn trên lớp phủ `scrim`: rồng Bông nhô lên trên mép, tiêu đề `title`, lời `body-l`, 1–2 nút cỡ `l`. |
| `FeedbackBar` | Dải bo góc trên `radius-xl` trượt lên từ đáy màn trong `duration-slide` sau khi bé bấm Kiểm tra; rồng Bông thò đầu lên mép trái. |
| `Gd1Tokens` | Token mới của đợt bổ sung giai đoạn 1 (có trong `tokens.json` và trang token của hệ thống): |
| `Gd2Tokens` | Token bổ sung giai đoạn 2. |
| `Gd3Tokens` | Token bổ sung đợt 5B (phần thưởng, phòng của tớ, chi tiết Tiểu học, khu người lớn giai đoạn 2). |
| `Gd4Tokens` | Token bổ sung đợt 6 (Khám phá từ, Họ vần, Ghép chữ đầu, Đọc cả đoạn + dịch, Liên kết qua lại). |
| `Icons` | Icon tự vẽ trên lưới 24px, nét 2.4px bo tròn, màu theo `currentColor`; riêng `star`, `starEmpty`, `coin`, `flame` có màu cố định từ token. |
| `KeyHint` | Nhãn phím dạng nắp phím nhỏ (`key`, 13px, viền dưới 4px) cho người dùng chuột + bàn phím. |
| `LessonTools` | 2 nút tròn trên đầu khung bài học — `Bong.LessonTools` (= `Bong.R.tools` + `Bong.R.wireTools`). |
| `LevelColors` | Bảng màu 10 cấp: mỗi cấp có 5 token — `level-N` (nền), `level-N-shade` (gờ 3D), `level-N-soft` (nền nhạt), `level-N-ink` (chữ ≥ 4.5:1), `on-level-N` (chữ trên nền) — cùng màu phản hồi và 5 mức độ thuộc. |
| `LevelGate` | 12a. Cổng bài thi lên cấp. |
| `Mascot` | Rồng Bông — linh vật đồng hành của bộ Tiểu học, vẽ bằng SVG với nét viền `dragon-line`, 6 biểu cảm, 4 màu cho bé chọn. |
| `MascotGrowth` | 16. Rồng Bông lớn lên. |
| `MascotMore` | Hai biểu cảm bổ sung cho rồng Bông (thêm vào `Bong.dragon`, 6 biểu cảm gốc giữ nguyên): |
| `ProgressBar` | Rãnh `surface-sunk` lõm (`shadow-inset`), phần đã làm tô `--lv` (màu cấp) với vệt sáng; chiều rộng tăng có nảy nhẹ. |
| `ReadAloudParagraph` | Đọc cả đoạn và dịch nghĩa — khung đoạn văn dùng chung, đặt trong Khám phá từ và Họ vần. `Bong.ReadAloudParagraph(o)` (= `Bong.W.paragraph`), gắn hành vi bằng `Bong.W.wireParagraph(el)`. |
| `RewardPopup` | Nhận phần thưởng mới — hộp thoại dùng chung `Bong.RewardPopup` (= `Bong.R.reward`). |
| `SpeakerButton` | Nút loa tròn phát âm từ tiếng Anh; khi đang phát có vòng sóng lan ra (`is-playing`). |
| `StatChip` | Chip bo tròn trên `surface`: biểu tượng màu (sao `star`, xu `coin`, lửa `streak`) + số kiểu `stat`. |
| `WordLinks` | Liên kết qua lại — dải nút liên kết ở đầu Khám phá từ, Họ vần, Ghép chữ đầu; chỉ hiện ở chế độ tự khám phá, ẩn trong khung bài học. `Bong.WordLinks(stack, buttons)` (= `Bong.W.links`). |
| `WordPictures` | Hình minh hoạ cho từ vựng tiếng Anh: viền `dragon-line` 3px, khối màu phẳng, khung 120×120, không chữ trong hình. |

## 12. Các màn Tiểu học

| Thư mục | Tóm tắt |
|---|---|
| `Screen01-Login` | Màn đăng nhập tài khoản gia đình — chia đôi: minh hoạ rồng chào bên trái, biểu mẫu cho bố mẹ bên phải. |
| `Screen02-Profiles` | Màn chọn hồ sơ "Ai đang học hôm nay?" — thẻ từng bé (ảnh, tên, lớp, nhãn cấp), thẻ Thêm hồ sơ viền đứt, nút Bố mẹ có ổ khoá ở góc phải trên. |
| `Screen03-CreateProfile` | Luồng tạo hồ sơ 3 bước với thanh bước ở đầu: (1) tên và lớp, (2) chọn bạn rồng, (3) kiểm tra loa và micro. |
| `Screen04-Home` | Trang chủ bé: thanh trên cùng (ảnh, tên, sao, xu, chuỗi ngày), rồng Bông ở giữa có lời chào, thẻ Nhiệm vụ hôm nay bên trái, thẻ tiến độ đảo bên phải, 4 nút lớn ở đáy. |
| `Screen05-Levels` | Tổng quan 10 cấp: con đường lớn trên biển đi qua 5 hòn đảo Tiểu học (hàng dưới, trái → phải) rồi 5 thành phố THCS (hàng trên, phải → trái). |
| `Screen06-IslandMap` | Bản đồ đảo Hạt giống: 4 vùng chủ đề (Con vật, Trái cây, Màu sắc, Số đếm), mỗi vùng là đường 5 chặng + 1 trận trùm cuối vùng. |
| `Screen07-ListenChoose` | Bài "Nghe và chọn hình": đầu bài (thoát, tiến độ, đếm câu), loa lớn, 4 thẻ hình có nhãn phím 1–4, chân bài Nghe lại · Gợi ý · Kiểm tra, và dải phản hồi. |
| `Screen08-Flashcards` | Bài "Thẻ từ": thẻ lớn lật 3D — mặt trước hình lớn, từ tiếng Anh (`word-xl`), phiên âm, câu ví dụ; mặt sau nghĩa tiếng Việt. |
| `Screen09-Match` | Bài "Nối từ với hình": 4 thẻ hình có ô thả, khay 4 chip từ (có loa) bên dưới, kéo thả bằng chuột. |
| `Screen10-MemoryGame` | Mini game "Lật thẻ ghép cặp": 12 thẻ (6 hình + 6 chữ) lưới 6×2, mặt úp màu cấp có ngôi sao. |
| `Screen11-WordRain` | Mini game "Mưa từ vựng": từ (kèm hình) rơi chậm từ trời; bé gõ đúng chính tả rồi Enter để phá. |
| `Screen12-LessonEnd` | Màn kết thúc bài: rồng chúc mừng + 3 sao bật lần lượt + lời khen bên trái; thẻ kết quả (xu, câu đúng, thời gian), danh sách từ vừa học có loa, nút Về bản đồ / Bài tiếp theo bên phải. |
| `Screen13-Notebook` | Sổ từ: lưới thẻ từ, mỗi thẻ viền 4px màu `mastery-1..5` + 5 chấm + tên mức; bộ lọc chủ đề dạng chip radio. |
| `Screen14-TimeUp` | Màn hết giờ học: nền đêm `bg-night`, trăng sao, rồng Bông ngủ trên mây, lời hẹn ngày mai và tóm tắt hôm nay. |
| `Screen15-PlacementIntro` | Bài xếp lớp · màn giới thiệu: rồng Bông chào và rủ bé “Mình cùng chơi vài câu để biết cậu bắt đầu từ đâu nhé!”, thẻ thông tin (12 câu nghe và chọn hình, khoảng 5 phút, không có đúng/sai, có nút “Tớ chưa biết”). |
| `Screen16-PlacementQuiz` | Bài xếp lớp · màn câu hỏi: dạng Nghe và chọn hình, khung bài học như màn 6, nhưng **không báo đúng hay sai** sau mỗi câu. |
| `Screen17-PlacementResult` | Bài xếp lớp · màn kết quả: rồng chúc mừng, khối cấp đề xuất theo màu cấp (“Cấp 2 · Mầm non”), một nhận xét ngắn và nhãn chủ đề bé đã vững / sẽ học. |
| `Screen18-PickWord` | Bài “Chọn từ đúng cho hình”: một hình lớn và 3 thẻ chữ có nhãn phím 1–3, cùng khung bài học và dải phản hồi như màn Nghe và chọn hình. |
| `Screen19-ReviewStart` | Ôn tập hôm nay · màn bắt đầu: số từ đến hạn ôn (12) và 5 hộp ghi nhớ theo màu mức thuộc (`mastery-N` + nền `mastery-N-soft`). |
| `Screen20-ReviewDone` | Ôn tập hôm nay · màn tổng kết: “Hôm nay cậu đã ôn 12 từ, 3 từ được chuyển lên hộp vàng!”. |
| `Screen21-ExitDialog` | Hộp thoại “Dừng bài học?” khi bé bấm × giữa bài: rồng Bông biểu cảm `tiec` (hơi tiếc, không khóc), câu nhắc còn bao nhiêu câu và hẹn học tiếp. |
| `Screen22-ComingSoon` | Màn “Sắp có” dùng chung cho các nút chưa làm (Bộ sưu tập, Phòng của tớ): rồng Bông `xaydung` đội mũ bảo hộ, cầm búa, khối chữ màu cấp đang xếp. |
| `Screen23-Phonics` | 1. Ghép âm phonics. |
| `Screen24-Story` | 2. Truyện tranh có đọc to. |
| `Screen25-Speak` | 3. Luyện nói từ và câu. |
| `Screen26-SentenceOrder` | 4. Sắp xếp từ thành câu. |
| `Screen27-Dictation` | 5. Nghe và gõ. |
| `Screen28-FillBlank` | 6. Điền từ vào câu. |
| `Screen29-ShortReading` | 7. Đọc hiểu ngắn. |
| `Screen30-Bubbles` | 8. Bong bóng từ vựng. |
| `Screen31-WhackLetters` | 9. Đập chuột chữ cái. |
| `Screen32-Race` | 10. Đua xe trả lời. |
| `Screen33-Boss` | 11. Trận trùm cuối vùng. |
| `Screen34-IslandMapGate` | 12. Bản đồ đảo có cổng thi lên cấp. |
| `Screen35-LevelTestIntro` | 13. Giới thiệu bài thi lên cấp. |
| `Screen36-LevelUp` | 14. Đạt bài thi lên cấp. |
| `Screen37-LevelTestRetry` | 15. Chưa đạt bài thi lên cấp. |
| `Screen38-Stickers` | Bộ sưu tập · tab Sticker. |
| `Screen39-Badges` | Bộ sưu tập · tab Huy hiệu. |
| `Screen40-LessonEndSticker` | Kết thúc bài có sticker bất ngờ — biến thể mới, màn Kết thúc bài cũ giữ nguyên. |
| `Screen41-MyRoom` | Phòng của tớ — phòng của rồng Bông nhìn chính diện. |
| `Screen42-Shop` | Cửa hàng — chỉ dùng xu trong trò chơi, không có tiền thật, không quảng cáo. |
| `Screen43-HomeDressed` | Trang chủ có Bông mặc đồ — biến thể mới, trang chủ cũ giữ nguyên. |
| `Screen44-NotebookPlus` | Sổ từ bổ sung — biến thể mới, Sổ từ cũ giữ nguyên. |
| `Screen45-WordListPrint` | Bản in danh sách từ — trang A4 dọc, chỉ trắng đen. |
| `Screen46-LessonFocus` | Bài học ở chế độ học tập trung — biến thể mới, khung bài học cũ giữ nguyên. |
| `Screen47-OutsideHours` | Chưa đến giờ học — mở web ngoài khung giờ bố mẹ cho phép (ban ngày; cùng họ với màn Hết giờ học ban đêm). |
| `Screen48-WordExplorer` | Khám phá từ — sơ đồ câu hỏi quanh một từ. |
| `Screen49-WordExplorerPrint` | Bản in Khám phá từ — trang A4 dọc, chỉ trắng đen. |
| `Screen50-WordFamily` | Họ vần — mạng các từ cùng vần. |
| `Screen51-BuildFamily` | Ghép chữ đầu — ghép chữ đầu với vần để thành từ. |
| `Screen52-NotebookWordTabs` | Thẻ từ trong Sổ từ có thêm tab — biến thể mới, màn Sổ từ cũ giữ nguyên. |
| `Screen53-WordJourney` | Một lượt đi qua các liên kết: bird → họ -ir → Ghép chữ đầu → shirt → Khám phá shirt. |

## 13. Bộ THCS: thành phần và màn

| Thư mục | Tóm tắt |
|---|---|
| `Thcs01-Home` | Trang chủ THCS: lời chào + lời nhắc nhỏ của Bông, vòng mục tiêu XP hôm nay, thẻ Học tiếp (nút chính, Enter), Ôn tập đến hạn, Điểm yếu cần ôn, Lịch kiểm tra ở trường, XP trong tuần, Chuỗi ngày học. |
| `Thcs02-Route` | Lộ trình 10 cấp: bản đồ thế giới cách điệu nối 5 thành phố THCS theo thứ tự Singapore → Sydney → London → New York → Toronto; bảng bên phải cho chi tiết thành phố đang chọn; dải tóm tắt 5 đảo Tiểu học đã xong. |
| `Thcs03-London` | Bản đồ cấp 8 London: mỗi chủ đề là một địa danh (Hyde Park, Camden Market, King's Cross…) hiện % hoàn thành và điểm bài kiểm tra chủ đề; bảng bên phải liệt kê bài trong chủ đề và nút Bài kiểm tra chủ đề; góc "Bạn có biết?" về văn hoá Anh. |
| `Thcs04-Grammar` | Bài giảng ngữ pháp (thì hiện tại hoàn thành): khung công thức 3 dạng (+, −, ?), cách dùng tiếng Việt, ví dụ có nút nghe, mẹo nhớ since/for, lỗi hay gặp (✗/✓), 3 câu kiểm tra nhanh trả lời ngay tại chỗ. |
| `Thcs05-Quiz` | Câu trắc nghiệm A/B/C/D: câu hỏi `thcs-en-l`, 4 ô đáp án có chữ cái + số; sau khi Kiểm tra hiện khung giải thích ngay dưới đáp án và dải phản hồi. |
| `Thcs06-Pronunciation` | Bài phát âm và trọng âm: 4 thẻ từ, mỗi thẻ có nút loa riêng; dạng gạch chân (đuôi -ed) và dạng chia âm tiết (trọng âm). |
| `Thcs07-Rewrite` | Viết lại câu không đổi nghĩa: câu gốc (có loa), phần đầu câu mới cố định, ô gõ phần còn lại. |
| `Thcs08-Reading` | Đọc hiểu 2 cột: đoạn văn bên trái (20px, đánh số đoạn), câu hỏi bên phải, mỗi lần một câu với thanh chuyển câu 1–4. |
| `Thcs09-Writing` | Viết đoạn văn: đề bài (Anh + Việt), gợi ý ý, cụm từ bấm để chèn, ô viết 20px có đếm từ trực tiếp và vạch khoảng 80–120 từ, khu vực nhận xét. |
| `Thcs10-LessonEnd` | Kết thúc bài THCS: % câu đúng, XP nhận được, huy hiệu mới (nếu có), từ vựng vừa học (có loa), điểm ngữ pháp, câu cần xem lại kèm lý do; nút Về lộ trình và Bài tiếp theo (Enter). |
| `Thcs11-Review` | Ôn tập hôm nay: 5 hộp ghi nhớ (lặp lại ngắt quãng) — mỗi cột cao theo tổng số thẻ, phần màu `xp` là số thẻ đến hạn; tách từ vựng và ngữ pháp; chọn phạm vi, số thẻ và nút Bắt đầu ôn. |
| `Thcs12-Notebook` | Sổ từ dạng bảng: tìm theo từ hoặc nghĩa, lọc theo cấp, chủ đề, mức thuộc; cột từ (có loa), phiên âm, loại từ, nghĩa, cấp · chủ đề, mức thuộc (5 chấm + tên mức). |
| `Thcs13-Textbook` | Học theo SGK: chọn lớp 6–9 và bộ sách, lưới 12 Unit có % hoàn thành; trang Unit có 4 tab Từ vựng · Ngữ pháp · Luyện tập · Kiểm tra. |
| `Thcs14-Exam` | Làm bài thi: đồng hồ đếm ngược trên thanh bài (chỉ màn này có), câu hỏi bên trái, bảng số câu 40 ô chia 4 phần bên phải, nút Nộp bài. |
| `Thcs15-ExamResult` | Kết quả thi: điểm thang 10 (`thcs-num-xl`), số câu đúng, thời gian, XP; phân tích theo dạng bài (thanh một màu + nhãn "cần ôn" khi dưới 80%); danh sách từng câu mở rộng để xem đáp án và giải thích; nút "Ôn lại câu sai". |
| `Thcs16-Achievements` | Thành tích: kỷ lục cá nhân, huy hiệu (lọc Tất cả / Đã đạt / Chưa đạt), danh hiệu theo cấp, biểu đồ XP 8 tuần. |
| `Thcs17-TimeUp` | Hết giờ học: thẻ giữa màn với rồng ngủ nhỏ, số phút đã học hôm nay, tóm tắt XP / bài / thẻ ôn / chuỗi ngày, lời hẹn ngày mai. |
| `ThcsAnswer` | Ô đáp án một dòng cho câu trắc nghiệm: ô chữ cái A–D (kèm số 1–4 nhỏ ở góc) + nội dung tiếng Anh `thcs-en` (20px) + biểu tượng kết quả. |
| `ThcsButton` | Nút phẳng, gọn của bộ THCS: bo `thcs-radius-md`, chữ `thcs-button`, cao tối thiểu `thcs-control` (44px) và `thcs-control-l` (52px) trong bài học. |
| `ThcsCore` | Các phần của lõi chung được dùng nguyên trong THCS, chỉ đổi kiểu chữ và độ bo theo theme: `FeedbackBar`, `KeyHint`, `DataStates`, `ProgressBar`, `SpeakerButton`, `Dialog`. |
| `ThcsMascot` | Rồng Bông tuổi teen: dáng cao hơn, đầu nhỏ hơn, tóc mái lệch, mặc hoodie (`dragon-hoodie`) và đeo tai nghe quanh cổ (`dragon-phones`); cùng 6 biểu cảm `chao`, `vui`, `dongvien`, `suynghi`, `ngu`, `chucmung` như bản Tiểu học. |
| `ThcsPalette` | Màu của bộ THCS lấy từ cùng tên token với lõi chung, đổi giá trị theo theme: `thcs` (sáng) và `thcs-toi` (tối). Tiểu học luôn ở theme `tieu-hoc`. |
| `ThcsRewards` | Hệ thưởng của THCS: **XP** (điểm kinh nghiệm), **huy hiệu** 3 bậc và **danh hiệu** theo cấp — thay cho sao và xu của Tiểu học. |
| `ThcsShell` | Khung trang THCS: menu trái `thcs-sidebar` (248px) thu gọn còn icon `thcs-sidebar-mini` (76px), thanh trên `thcs-topbar` (64px), vùng nội dung tối đa `thcs-content-max` (1200px) căn giữa. |

## 14. Khu người lớn: thành phần và màn

| Thư mục | Tóm tắt |
|---|---|
| `Adult01-Gate` | Cổng vào khu bố mẹ: hai thẻ Mã PIN / Mật khẩu tài khoản. PIN 4–6 số nhập vào 6 ô (2 ô cuối nét đứt = không bắt buộc), mật khẩu có nút hiện/ẩn. |
| `Adult02-Overview` | Tổng quan theo từng con, chọn con ở thanh trên (Minh lớp 3 · cấp 2 Mầm non / Khánh Linh lớp 8 · cấp 8 London). |
| `Adult03-Skills` | Kỹ năng của con: 7 thanh ngang (Nghe, Nói, Đọc, Viết, Từ vựng, Ngữ pháp, Phát âm) so với tháng trước bằng vạch dọc `chart-ref`. |
| `Adult04-Exams` | Kết quả thi: đường điểm theo thời gian (trục 5–10, mục tiêu nét đứt), danh sách bài thi, và phần xem lại từng câu con đã làm. |
| `Adult05-Works` | Bài viết và ghi âm của con: đọc bài viết (Bông tô cam chỗ cần xem lại), nghe ghi âm có sóng âm tua được bằng chuột hoặc ←/→, tốc độ 1× / 0,75×. |
| `Adult06-Calendar` | Lịch kiểm tra ở trường: lịch tháng 10/2026, ngày kiểm tra (`chart-1-soft`), ngày Bông xếp bài ôn (chấm `chart-2`). |
| `Adult07-Settings` | Cài đặt khu bố mẹ, 4 nhóm ở cột trái (↑/↓ để chuyển). |
| `Adult08-Dashboard` | Bảng điều khiển nội dung: 4 thẻ số liệu, biểu đồ số từ / bài học / câu hỏi theo 10 cấp (mỗi cột đúng màu `level-N`). |
| `Adult09-Tree` | Cấu trúc lộ trình dạng cây Chặng → Cấp → Chủ đề → Bài học, mở / thu gọn từng nhánh. |
| `Adult10-Vocab` | Ngân hàng từ vựng: bảng có tìm (từ, nghĩa, IPA), lọc theo cấp, chủ đề, lớp, Unit SGK và “thiếu hình / âm”, sắp xếp, chọn dòng, phân trang. |
| `Adult11-Questions` | Ngân hàng câu hỏi: lọc theo dạng bài, cấp, kỹ năng, chủ điểm ngữ pháp, độ khó 1–5, có/thiếu giải thích. |
| `Adult12-LessonBuilder` | Soạn bài học 3 cột: gợi ý từ và câu hỏi theo chủ đề, các bước của bài (kéo thả hoặc ↑/↓), thông tin bài. |
| `Adult13-Media` | Thư viện hình và âm thanh (2 thẻ). |
| `Adult14-Excel` | Nhập & xuất Excel theo 4 bước: tải file mẫu (từ vựng / câu hỏi) → chọn file → xem trước & sửa lỗi → lưu. |
| `Adult15-Grammar` | Chủ điểm ngữ pháp: danh sách có tìm và lọc theo cấp; trình soạn bài giảng. |
| `Adult16-ExamMatrix` | Tạo đề thi theo ma trận: dạng câu × mức độ (Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao ↔ độ khó 1–5). |
| `Adult17-Progress` | Bố mẹ · Tiến độ của con và mở khoá thủ công. |
| `Adult18-QuestionTypes2` | Quản trị · Câu hỏi dạng mới trong Ngân hàng câu hỏi. |
| `Adult19-StoryEditor` | Quản trị · Soạn truyện tranh. |
| `Adult20-PhonicsSounds` | Quản trị · Âm phonics. |
| `Adult21-Rewards` | Quản trị · Danh mục phần thưởng. |
| `Adult22-WordExplorerEditor` | Quản trị · Soạn Khám phá từ — tab “Khám phá” trong ngăn kéo biểu mẫu của Ngân hàng từ vựng. |
| `Adult23-WordFamilies` | Quản trị · Họ vần. |
| `AdultCharts` | Biểu đồ khu người lớn (SVG/HTML, không thư viện ngoài). |
| `AdultField` | Biểu mẫu và nút khu người lớn. |
| `AdultKpi` | Thẻ số liệu, nhãn trạng thái và 4 trạng thái dữ liệu của khu người lớn. |
| `AdultPalette` | Tổng hợp token mới của khu người lớn (bố mẹ + quản trị). Mọi giá trị đều là token trong `tokens.json`; khu người lớn dùng theme `thcs` sáng nên các token lõi (`bg`, `surface`, `ink`, `brand`, `success-*`, `retry-*`, `focus`, `level-N`…) lấy giá trị THCS sáng. |
| `AdultShell` | Khung khu người lớn: `Bong.A.shell({ area: 'parent' \| 'admin', active, title, crumb, kids, actions, main })`. |
| `AdultTable` | Bảng dữ liệu: `Bong.A.table(cfg)` trả về `{ html(), mount(root, onChange) }`. |

---

## 15. `:root` khởi đầu (globals.css)

Sinh tự động từ `designs/tokens.json`. `:root` mang giá trị Tiểu học (mặc định); `[data-theme="thcs"]` và `[data-theme="thcs-toi"]` chỉ ghi các token đổi giá trị. Khu người lớn đặt `data-theme="thcs"` trên vùng chứa. Biến `--lv`, `--lv-shade`, `--lv-soft`, `--lv-ink`, `--on-lv` theo `data-level` lấy từ `designs/components/bundle.css`. Đưa khối này vào `app/globals.css`, rồi khai báo lại trong `@theme inline` (Tailwind v4) để dùng dạng class.

```css
:root{
  --font-display:"Baloo 2", "Nunito", system-ui, sans-serif;
  --font-body:"Nunito", "Baloo 2", system-ui, sans-serif;
  --font-thcs:"Be Vietnam Pro", system-ui, sans-serif;
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
  --on-brand:#ffffff;
  --on-retry:#2b2440;
  --xp:#5b3fd6;
  --xp-soft:#ece8ff;
  --badge-gold:#e2a300;
  --badge-silver:#94a0b8;
  --badge-bronze:#c27a45;
  --flag:#e8a400;
  --on-flag:#151a2d;
  --highlight:#fff0b3;
  --map-sea:#dde8fb;
  --map-land:#ffffff;
  --map-road:#e6e9f2;
  --map-park:#d8eedb;
  --chart-grid:#e3e7f0;
  --sidebar-bg:#ffffff;
  --dragon-hoodie:#4b4fc4;
  --dragon-phones:#2b2440;
  --adm-side-bg:#1b2030;
  --adm-side-hover:#262c40;
  --adm-side-active:#323a56;
  --adm-side-ink:#c5cadb;
  --adm-side-ink-active:#ffffff;
  --adm-side-accent:#8ea6ff;
  --adm-side-focus:#b9a3ff;
  --chart-1:#2a78d6;
  --chart-1-soft:#e3edfa;
  --chart-2:#138a69;
  --chart-3:#4a3aa7;
  --chart-ref:#6b7189;
  --field-error:{retry-shade};
  --adm-danger:{retry-shade};
  --adm-on-danger:#ffffff;
  --field-error-bg:{retry-soft};
  --mastery-1-soft:#f3f0f8;
  --mastery-2-soft:#fff4d3;
  --mastery-3-soft:#def1fc;
  --mastery-4-soft:#ece5fc;
  --mastery-5-soft:#dcf2e5;
  --dragon-hat:#ffb81c;
  --dragon-hat-shade:#d98a00;
  --dragon-tool:#9a6a46;
  --dragon-tool-head:#7d8597;
  --adm-status-none-ink:{ink-soft};
  --adm-status-none-line:{line-strong};
  --read-highlight:#ffe48c;
  --phon-slot:#fffaf0;
  --rec:#6a3fd6;
  --rec-soft:#efe8ff;
  --rec-track:#e6dccb;
  --bubble-1:#bfe6ff;
  --bubble-2:#ffd3e8;
  --bubble-3:#d3f5c2;
  --bubble-4:#ffe7a8;
  --bubble-5:#e3d9ff;
  --bubble-shine:#ffffff;
  --game-sky:#d8f1ff;
  --game-sky-2:#f4fbff;
  --mole-ground:#a4da7c;
  --mole-ground-shade:#7fbf57;
  --mole-hole:#4a2f22;
  --mole-hole-rim:#9a6a46;
  --mole-fur:#b98a66;
  --mole-belly:#f3d8bb;
  --mole-tongue:#ff8fa8;
  --race-grass:#a8df82;
  --race-track:#6f7889;
  --race-track-edge:#ffffff;
  --race-ghost:rgba(239, 232, 255, 0.5);
  --race-ghost-line:#d9ccff;
  --race-finish-a:#2b2440;
  --race-finish-b:#ffffff;
  --boss-energy:#ffb703;
  --boss-energy-shade:#e08e00;
  --boss-energy-track:#efe3cd;
  --boss-fur:#b07a4f;
  --boss-face:#ffd9b0;
  --gate-stone:#d2c1a4;
  --gate-stone-shade:#a38f72;
  --gate-glow:#fff1a8;
  --gate-dark:#4a3f5c;
  --dragon-egg:#fff6e3;
  --dragon-egg-spot:#ffd59e;
  --dragon-leaf:{level-2};
  --dragon-scarf-4:{level-4};
  --dragon-scarf-5:{level-5};
  --album-page:#fffdf7;
  --album-spine:#c98b5a;
  --album-ring:#b0a491;
  --album-animals:#ffe6c7;
  --album-vehicles:#d9eaff;
  --album-dino:#dff2cf;
  --album-fruits:#ffe0ea;
  --sticker-frame:#ffffff;
  --sticker-shadow:rgba(91, 66, 30, 0.18);
  --sticker-slot:#f3ece0;
  --sticker-slot-line:#d8c9b0;
  --sticker-ghost:rgba(43, 36, 64, 0.14);
  --sticker-new:#ff9f1c;
  --badge-ring:{star};
  --badge-ring-shade:{star-shade};
  --badge-ribbon-a:#3f8cff;
  --badge-ribbon-b:#2bb38a;
  --badge-locked:#e6dccb;
  --badge-locked-ink:#8f8370;
  --gift-box:#9b5de5;
  --gift-box-shade:#7a3fc4;
  --gift-ribbon:#ffc531;
  --gift-glow:#fff1a8;
  --room-wall:#fde9c9;
  --room-wall-pattern:#f9dcae;
  --room-trim:#e9c08f;
  --room-floor:#dcae7a;
  --room-floor-line:#c48f5a;
  --room-window-sky:#bfe9f7;
  --room-item-select:{brand};
  --room-drop:rgba(63, 140, 255, 0.14);
  --room-shadow:rgba(91, 66, 30, 0.16);
  --price-chip:#fff3cc;
  --price-chip-ink:#7a5200;
  --owned-chip:{success-soft};
  --outfit-tee:#3f8cff;
  --outfit-stripe-a:#ffffff;
  --outfit-stripe-b:#2bb38a;
  --outfit-raincoat:#ffd23f;
  --outfit-cap:#3f8cff;
  --outfit-cap-brim:#2a6fd6;
  --outfit-beanie:#9b5de5;
  --outfit-pompom:#ffffff;
  --outfit-sunhat:#f2cf8a;
  --outfit-ribbon:#2bb38a;
  --streak-day:{streak};
  --streak-day-soft:#ffe9d6;
  --freeze-card:#bfe6ff;
  --freeze-card-ink:#1d5f8c;
  --print-paper:#ffffff;
  --print-ink:#000000;
  --print-muted:#4d4d4d;
  --print-rule:#9a9a9a;
  --focus-scrim:rgba(43, 36, 64, 0.04);
  --volume-track:{line};
  --volume-fill:{brand};
  --garden-sky:#cfeeff;
  --garden-grass:#9fd67a;
  --garden-grass-shade:#7fbf57;
  --garden-flower:#ffb3c7;
  --day-allowed:{success-soft};
  --adm-lock:{ink-soft};
  --adm-unlocked-manual:#6a3fd6;
  --adm-audio-missing:{field-error};
  --rime-ink:#0a6e61;
  --rime-bg:#d4f3eb;
  --rime-hub:#0b7a6b;
  --rime-hub-ink:#ffffff;
  --rime-line:#8fd9c6;
  --branch-line:#cbc2df;
  --branch-line-open:#6cc48b;
  --branch-line-active:{brand};
  --branch-node:{surface};
  --branch-node-open:{success-soft};
  --branch-num:{brand-soft};
  --q-mark-bg:#fff1c2;
  --q-mark-ink:#7a5200;
  --trap-bg:#fff4df;
  --trap-line:#e5a23c;
  --trap-ink:#8a4600;
  --trans-ink:#655d7a;
  --trans-rule:#e4dcf3;
  --read-word-bg:#ffcd45;
  --read-word-ink:{ink};
  --links-bg:#e9f2ff;
  --links-line:#c3d9fb;
  --crumb-ink:{ink-soft};
  --crumb-now:{ink};
  --soon-bg:#eeeaf5;
  --soon-ink:#5a536d;
  --build-slot-bg:#f3f8ff;
  --letter-tile:#fff9ee;
  --found-chip:{success-soft};
  --fake-word-bg:{retry-soft};
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
  --thcs-radius-sm:6px;
  --thcs-radius-md:10px;
  --thcs-radius-lg:14px;
  --thcs-radius-xl:20px;
  --adm-radius-sm:4px;
  --adm-radius-md:6px;
  --adm-radius-lg:10px;
  --adm-radius-xl:14px;
  --shadow-card:0 4px 0 0 #ecdfc8, 0 10px 24px rgba(91, 66, 30, 0.08);
  --shadow-raised:0 6px 0 0 #e3d3b6, 0 16px 32px rgba(91, 66, 30, 0.12);
  --shadow-dialog:0 24px 64px rgba(43, 36, 64, 0.28);
  --shadow-lip:0 6px 0 0 rgba(20, 20, 60, 0.22);
  --shadow-inset:inset 0 3px 0 rgba(91, 66, 30, 0.10);
  --shadow-focus:0 0 0 3px #ffffff, 0 0 0 6px #5b2ee8;
  --thcs-shadow-1:0 1px 2px rgba(21, 26, 45, 0.06), 0 0 0 1px #dfe3ed;
  --thcs-shadow-2:0 6px 18px rgba(21, 26, 45, 0.10), 0 0 0 1px #dfe3ed;
  --thcs-shadow-pop:0 24px 64px rgba(21, 26, 45, 0.22);
  --thcs-focus-ring:0 0 0 2px #ffffff, 0 0 0 4px #5b2ee8;
  --adm-shadow-card:0 1px 2px rgba(16, 24, 40, 0.05), 0 0 0 1px #e1e5ee;
  --adm-shadow-pop:0 16px 40px rgba(16, 24, 40, 0.18);
  --adm-shadow-drag:0 10px 24px rgba(16, 24, 40, 0.22), 0 0 0 2px #3355e0;
  --size-btn-l:64px;
  --size-btn-m:52px;
  --size-btn-s:40px;
  --size-speaker-l:112px;
  --size-speaker-s:40px;
  --size-topbar:72px;
  --size-content-max:1440px;
  --size-lesson-min-h:768px;
  --thcs-sidebar:248px;
  --thcs-sidebar-mini:76px;
  --thcs-topbar:64px;
  --thcs-control:44px;
  --thcs-control-l:52px;
  --thcs-content-max:1200px;
  --thcs-en-min:20px;
  --adm-sidebar:240px;
  --adm-topbar:56px;
  --adm-control:36px;
  --adm-control-l:44px;
  --adm-row:48px;
  --adm-drawer:480px;
  --adm-drawer-wide:720px;
  --adm-content-max:1280px;
  --size-star-pip:28px;
  --size-memory-box:184px;
  --size-phon-tile:104px;
  --size-mic:132px;
  --size-bubble:150px;
  --size-mole-hole:150px;
  --size-race-lane:76px;
  --size-test-dot:14px;
  --size-boss:260px;
  --size-sticker:112px;
  --size-sticker-frame:6px;
  --size-badge:120px;
  --size-shop-card:220px;
  --size-room-item:120px;
  --size-print-page-w:210mm;
  --size-print-page-h:297mm;
  --size-print-margin:14mm;
  --size-print-pic:16mm;
  --size-print-write:48mm;
  --size-word-card:300px;
  --size-branch-node:72px;
  --size-branch-line:4px;
  --size-family-card:176px;
  --size-rime-hub:148px;
  --size-letter-tile:76px;
  --size-links-strip:56px;
  --size-print-answer-line:9mm;
  --border-thin:2px;
  --border-thick:4px;
  --duration-fast:120ms;
  --duration-base:220ms;
  --duration-slide:320ms;
  --duration-celebrate:900ms;
  --duration-rec-max:10000ms;
  --duration-read-word:420ms;
  --duration-bubble-rise:11000ms;
  --duration-mole-up:3200ms;
  --duration-branch-open:360ms;
  --duration-read-word-slow:640ms;
  --z-map:1;
  --z-sticky:10;
  --z-feedback:40;
  --z-dialog:50;
  --z-burst:60;
}
[data-theme="thcs"]{
  --bg:#f6f7fb;
  --surface-soft:#eff1f7;
  --surface-sunk:#e3e7f0;
  --line:#dfe3ed;
  --line-strong:#858ca3;
  --ink:#151a2d;
  --ink-soft:#4a5170;
  --ink-disabled:#9aa0b4;
  --brand:#3355e0;
  --brand-shade:#2140b8;
  --brand-hover:#2a49cc;
  --brand-soft:#e8edfd;
  --brand-soft-shade:#cdd7fb;
  --scrim:rgba(14, 17, 32, 0.5);
  --info-soft:#ece9ff;
}
[data-theme="thcs-toi"]{
  --bg:#0e1120;
  --surface:#171b2d;
  --surface-soft:#1f2438;
  --surface-sunk:#2a3049;
  --line:#2c3250;
  --line-strong:#737b9a;
  --ink:#eef0f8;
  --ink-soft:#aeb5cf;
  --ink-disabled:#5f6684;
  --brand:#7d98ff;
  --brand-shade:#a9bbff;
  --brand-hover:#97adff;
  --brand-soft:#232c55;
  --brand-soft-shade:#33407a;
  --scrim:rgba(0, 0, 0, 0.62);
  --focus:#b9a3ff;
  --success-shade:#7fdc9c;
  --success-soft:#14301f;
  --retry-shade:#ffb27a;
  --retry-soft:#3a2614;
  --info-soft:#262046;
  --mastery-4:#a083ff;
  --mastery-5:#3fbf74;
  --level-1-soft:#483929;
  --level-1-ink:#f4a51c;
  --level-2-soft:#2d3f2e;
  --level-2-ink:#7dbe31;
  --level-3-soft:#163a43;
  --level-3-ink:#30b29c;
  --level-4-soft:#1c3757;
  --level-4-ink:#48a7ed;
  --level-5-soft:#2d2656;
  --level-5-ink:#a284ee;
  --level-6-soft:#3e2141;
  --level-6-ink:#d972aa;
  --level-7-soft:#143149;
  --level-7-ink:#4fa3c3;
  --level-8-soft:#3e2430;
  --level-8-ink:#d77a73;
  --level-9-soft:#22264e;
  --level-9-ink:#888bd8;
  --level-10-soft:#1c3137;
  --level-10-ink:#6da48c;
  --on-brand:#0b1020;
  --xp:#b0a1ff;
  --xp-soft:#2a2452;
  --badge-gold:#ffcc4d;
  --badge-silver:#b9c3d8;
  --badge-bronze:#e09a68;
  --flag:#ffcc4d;
  --highlight:#4d4214;
  --map-sea:#111a33;
  --map-land:#20273f;
  --map-road:#2b3150;
  --map-park:#173326;
  --chart-grid:#2a3049;
  --sidebar-bg:#131729;
  --dragon-hoodie:#5b5fd6;
  --dragon-phones:#5a6182;
  --mastery-1-soft:#29263a;
  --mastery-2-soft:#3a3018;
  --mastery-3-soft:#16314a;
  --mastery-4-soft:#2c2350;
  --mastery-5-soft:#163826;
  --thcs-shadow-1:0 1px 2px rgba(0, 0, 0, 0.4), 0 0 0 1px #2c3250;
  --thcs-shadow-2:0 8px 24px rgba(0, 0, 0, 0.5), 0 0 0 1px #3a4166;
  --thcs-shadow-pop:0 24px 64px rgba(0, 0, 0, 0.6);
  --thcs-focus-ring:0 0 0 2px #0e1120, 0 0 0 4px #b9a3ff;
}
```
