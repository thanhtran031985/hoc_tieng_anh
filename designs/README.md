Hệ thống giao diện cho web học tiếng Anh lớp 1–9, dùng chuột và bàn phím trên máy tính. Một **lõi chung** (token, thành phần, quy tắc) phục vụ hai bộ giao diện có cùng chức năng: **Tiểu học** (cấp 1–5, theme `tieu-hoc`) và **THCS** (cấp 6–10, theme `thcs` sáng và `thcs-toi` tối — xem mục *Bộ THCS* ở cuối). Linh vật đồng hành là **rồng Bông**: bé rồng tròn trịa ở Tiểu học, rồng tuổi teen mặc hoodie, đeo tai nghe ở THCS.

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

- Rồng Bông có 6 biểu cảm gốc: `chao`, `vui`, `dongvien`, `suynghi`, `ngu`, `chucmung` (xem thẻ Mascot), thêm `tiec` và `xaydung` cho hai tình huống riêng (xem thẻ MascotMore), và 4 màu bé chọn khi tạo hồ sơ. Không bao giờ khóc hay chê; `tiec` chỉ hơi tiếc khi bé dừng giữa bài.
- Icon tự vẽ trên lưới 24px, nét 2.4px bo tròn (`Bong.icon`). Icon luôn đi cùng chữ, trừ loa, đóng, quay lại (có `aria-label`).
- Hình từ vựng (`Bong.pic`): khối màu phẳng, viền dày, không chữ trong hình, nền trong suốt.
- Không dùng ảnh chụp, gradient tím-xanh hay emoji.

## Chuyển động

`duration-fast` 120ms (nhấn) · `duration-base` 220ms (rê chuột, đổi trạng thái) · `duration-slide` 320ms (dải phản hồi) · `duration-celebrate` 900ms (sao bay). Linh vật nhún nhẹ liên tục. Khi hệ điều hành bật giảm chuyển động, tắt mọi hoạt ảnh lặp và rút ngắn chuyển cảnh.

## Bộ THCS (cấp 6–10)

Cùng chức năng và lõi chung với Tiểu học (màu 10 cấp, màu phản hồi, thang khoảng cách, nhãn phím, dải phản hồi, 4 trạng thái dữ liệu), nhưng hiện đại, gọn và nhiều chữ hơn cho học sinh 11–15 tuổi.

### Nội dung
- Xưng hô **"bạn"**, câu ngắn, thẳng: "Còn 70 XP nữa là đạt mục tiêu hôm nay!". Không giọng trẻ con, không "bé".
- Hướng dẫn và giải thích bằng tiếng Việt; nội dung học (từ, câu, đoạn đọc) bằng tiếng Anh thật theo chương trình, ví dụ *I have lived in Hanoi since 2015.*
- **Làm sai không bị phạt**: luôn hiện **giải thích ngắn vì sao sai** (≤ 2 câu, chỉ đúng chỗ sai: "since" cần mốc, "five years" là khoảng → for) rồi cho làm lại. Không trừ XP, không mất chuỗi ngày.
- **Đồng hồ đếm ngược chỉ có trong bài thi.** Khi còn dưới 5 phút, đồng hồ chuyển sang `retry` (cam nhẹ) kèm chữ "còn dưới 5 phút" — không đỏ, không nhấp nháy.

### Chế độ sáng / tối
- Đặt `data-theme="thcs"` (sáng) hoặc `"thcs-toi"` (tối) trên `<html>`; nút mặt trăng/mặt trời trên thanh trên cùng (và thanh bài học) chuyển qua lại, `aria-pressed` cho biết đang tối.
- Hai chế độ dùng **cùng tên token** với lõi: `bg`, `surface`, `surface-soft`, `surface-sunk`, `line`, `line-strong`, `ink`, `ink-soft`, `brand`, `brand-soft`, `brand-shade`, `focus`, `success-soft/-shade`, `retry-soft/-shade`, `level-N-soft`, `level-N-ink`… chỉ khác giá trị theo theme. Giá trị Tiểu học không đổi.
- Token riêng THCS: `on-brand`, `on-retry`, `xp`, `xp-soft`, `badge-gold/silver/bronze`, `flag`, `on-flag`, `highlight`, `map-sea/land/road/park`, `chart-grid`, `sidebar-bg`, `dragon-hoodie`, `dragon-phones`.
- Tương phản đã kiểm ở **cả hai chế độ**: `ink` ≥ 15:1, `ink-soft` ≥ 6:1 trên mọi mặt; `on-brand` trên `brand` 5.97:1 (sáng) / 7.04:1 (tối); `level-N-ink` trên `level-N-soft` ≥ 4.6:1. Chữ/viền "chưa đúng" dùng `retry-shade`, vì `retry` trên nền trắng chỉ 2.3:1. Vòng focus `focus` 7:1 (sáng) / 8.7:1 (tối).
- Ở chế độ tối, nền các khối màu cấp (`level-N`) giữ nguyên để nhận diện thành phố; nền nhạt và chữ màu cấp đổi sang biến thể tối.

### Chữ
- **Be Vietnam Pro** (họ `thcs`, thiết kế cho tiếng Việt). Thang: `thcs-display` 40 · `thcs-title` 28 · `thcs-h2` 22 · `thcs-h3` 18 · `thcs-body` 17 (giải thích tiếng Việt) · `thcs-body-s` 15 · `thcs-label` 14 · `thcs-caption` 13 (chỉ thông tin phụ) · `thcs-num` 28 · `thcs-num-xl` 64 (điểm thi) · `thcs-button` 16 · `thcs-key` 12.
- **Chữ tiếng Anh trong bài tối thiểu 20px** (`thcs-en` 20/30, `thcs-en-l` 24/34; token `thcs-en-min`).

### Hình khối và bố cục
- Bo góc gọn hơn Tiểu học: `thcs-radius-sm` 6 · `md` 10 (nút, ô nhập, ô đáp án) · `lg` 14 (thẻ) · `xl` 20 (hộp thoại, dải phản hồi). Bóng phẳng: `thcs-shadow-1` (viền mảnh + bóng rất nhẹ), `thcs-shadow-2` (rê chuột, thẻ nổi), `thcs-shadow-pop`; mỗi bóng có giá trị riêng cho chế độ tối.
- Nút chính cao tối thiểu `thcs-control` **44px**; trong bài học `thcs-control-l` 52px.
- Khung trang: menu trái `thcs-sidebar` 248px, thu gọn còn icon `thcs-sidebar-mini` 76px (Trang chủ, Lộ trình, Học theo SGK, Ngữ pháp, Luyện thi, Ôn tập, Sổ từ, Thành tích; đáy là ảnh hồ sơ và nút Đổi hồ sơ). Thanh trên `thcs-topbar` 64px: tiêu đề, chip XP, chip chuỗi ngày, nút sáng/tối. Nội dung tối đa `thcs-content-max` 1200px, căn giữa trên màn 1920.
- Màn bài học và bài thi không có menu; vừa **1366×768 không cuộn**: thanh bài học 64px, chân bài 76px (68px khi cao ≤ 800), thân co giãn. Các màn tổng quan (trang chủ, sổ từ…) cho phép cuộn bên trong vùng nội dung.

### Phần thưởng
XP (`xp`), huy hiệu 3 bậc (luôn ghi chữ Vàng/Bạc/Đồng) và danh hiệu theo cấp (Nhà thám hiểm Singapore, Thuyền trưởng Sydney, Thám tử London, Phóng viên New York, Đại sứ Toronto). Thay sao bay bằng tia XP bay vào chip XP. Không có bảng xếp hạng so sánh với bạn khác.

### Bàn phím
Giữ như Tiểu học, thêm: `A`–`D` chọn đáp án (song song `1`–`4`), `H` gợi ý, `Esc` thoát bài (hỏi lại bằng hộp thoại), `Ctrl+Enter` nộp đoạn văn, `←` `→` đổi câu trong bài thi và đổi tab trong trang Unit. Ô đáp án hiện chữ cái A–D kèm số nhỏ ở góc.

### Rồng Bông tuổi teen
`Bong.T.dragon(expr, size)` — cùng 6 biểu cảm. Chỉ xuất hiện **nhỏ** (30–104px): góc lời nhắc (`Bong.T.tip`), dải phản hồi, trạng thái trống/lỗi, màn hết giờ. Không chiếm giữa màn như ở Tiểu học.

## Khu người lớn (bố mẹ + quản trị nội dung)

Dùng chung lõi (10 màu cấp, màu phản hồi, thang khoảng cách, nút, thẻ, hộp thoại, 4 trạng thái dữ liệu) nhưng là **bảng điều khiển gọn, màu trung tính, nhiều số liệu**. Luôn dùng theme `thcs` sáng (`Bong.suite('adult')` ghim lại), chữ **Be Vietnam Pro** (họ `thcs`), khung 1440×900, tối ưu máy tính. Lớp CSS tiền tố `a-`, đặt trong vùng `.adm`.

### Nội dung
- Xưng hô lịch sự với người lớn ("bố mẹ", "con"); nhãn nút là động từ: *Lưu thay đổi*, *Tạo giọng đọc tự động*, *Xuất Excel*.
- Số liệu thật, định dạng Việt: `2.926 từ`, `8,25 / 10`, ngày `2/10/2026`, giờ `21:10`.
- **Không có linh vật**, trừ rồng Bông 64px ở trạng thái trống.

### Khung
- Menu trái tối `adm-side-bg` rộng `adm-sidebar` 240px, chuyển giữa Bố mẹ / Quản trị; chữ `adm-side-ink` (9.9:1), mục đang mở `adm-side-active` (6.85:1) + vạch `adm-side-accent`; focus trong menu `adm-side-focus` (7.5:1).
- Thanh trên `adm-topbar` 56px: tiêu đề, chọn con (khu bố mẹ), nút **"Về màn chọn hồ sơ"** ở góc phải (khu người lớn khoá lại sau khi rời).
- Nội dung tối đa `adm-content-max` 1280px, lưới 12 cột, khoảng cách theo thang `space-*` có sẵn.

### Chữ, hình khối
- Thang `adm-h1` 24 · `adm-h2` 17 · `adm-h3` 15 · `adm-body` 14 · `adm-small` 13 · `adm-label` 12 · `adm-kpi` 28 · `adm-button` 14 · `adm-en` 15 (chữ tiếng Anh trong bảng quản trị — người lớn đọc nên không cần 20px).
- Bo góc `adm-radius-sm` 4 · `md` 6 (nút, ô nhập) · `lg` 10 (thẻ, bảng) · `xl` 14 (hộp thoại). Bóng `adm-shadow-card` (phẳng, viền mảnh), `adm-shadow-pop` (ngăn kéo, hộp thoại), `adm-shadow-drag` (mục đang kéo).
- Kích thước: `adm-control` 36px (nút, ô nhập), `adm-control-l` 44px (cổng vào, nút lưu lớn), `adm-row` 48px (hàng bảng), `adm-drawer` 480px, `adm-drawer-wide` 720px (biểu mẫu câu hỏi).

### Biểu đồ
- Số liệu **chia theo cấp** dùng đúng `level-1`…`level-10`. Các trường hợp khác: `chart-1` (chuỗi chính, 4.4:1), `chart-1-soft` (vùng dưới đường), `chart-2`, `chart-3` (chuỗi phụ, luôn kèm chú giải), `chart-ref` (đường tham chiếu nét đứt: giới hạn 30 phút/ngày, mục tiêu 8,0, vạch kỳ trước), `chart-grid`.
- Một chuỗi thì một màu; nhãn số chỉ ở giá trị cao nhất hoặc điểm cuối; mọi cột/điểm có tooltip khi rê chuột hoặc Tab. Không dùng biểu đồ hai trục.

### Bảng dữ liệu
Mọi bảng có **tìm kiếm, bộ lọc, sắp xếp** (`aria-sort`) và **phân trang** (chọn số dòng mỗi trang). Không có kết quả → trạng thái trống có nút "Xoá bộ lọc". Dòng bấm được mở ngăn kéo biểu mẫu bên phải.

### Biểu mẫu và hành động
- Lỗi hiện **ngay dưới từng ô** khi rời ô và khi bấm Lưu: icon cảnh báo + câu nói rõ cách sửa, chữ `field-error`, ô nền `field-error-bg` (cam nâu 5:1 — **không dùng đỏ**), kèm `aria-invalid` và `aria-describedby`; Lưu đưa focus về ô lỗi đầu tiên.
- Hành động không hoàn tác (xoá hồ sơ, đặt lại tiến độ, xoá mục) dùng `adm-danger` / `adm-on-danger` (5.85:1) và **luôn có hộp thoại xác nhận**; xoá hồ sơ phải gõ đúng tên con.
- Nút "Lưu" bị khoá khi dữ liệu chưa hợp lệ (nhập Excel còn dòng lỗi, ma trận đề chưa đủ điểm) và ghi rõ lý do bên cạnh.
- "Xem như học sinh" luôn dựng bằng thành phần thật của bé (Tiểu học cho cấp 1–5, THCS cho cấp 6–10) trong khung `data-theme` riêng.

### Bàn phím
Tab qua mọi điều khiển với viền `focus` 3px; menu tối dùng `adm-side-focus`. Kéo thả (cây lộ trình, bước bài học) luôn có cách bàn phím: Tab tới tay nắm rồi ↑/↓, có thông báo vị trí cho trình đọc màn hình. `Esc` đóng ngăn kéo và hộp thoại. Ghi âm: ←/→ tua 5 giây.

### 16 màn
Khu bố mẹ: Cổng vào (PIN 4–6 số / mật khẩu) · Tổng quan · Kỹ năng · Kết quả thi · Bài viết & ghi âm · Lịch kiểm tra · Cài đặt. Quản trị: Bảng điều khiển · Cấu trúc lộ trình · Ngân hàng từ vựng · Ngân hàng câu hỏi · Soạn bài học · Hình ảnh & âm thanh · Nhập & xuất Excel · Chủ điểm ngữ pháp · Tạo đề thi theo ma trận. Mỗi màn có 4 trạng thái dữ liệu và 3 cỡ màn.

## Bổ sung giai đoạn 1

### Tiểu học (màn 13–17)
- **Bài xếp lớp** (3 màn): giới thiệu → 12 câu nghe và chọn hình → kết quả. Trong lúc làm **không báo đúng/sai**, không sao bay; tiến độ là 12 ngôi sao nhỏ (`size-star-pip`, câu hiện tại viền `brand`). Có nút “Tớ chưa biết”. Kết quả là một cấp đề xuất (khối màu cấp) + một nhận xét ngắn, không hiện điểm. Luôn có đường lui: “Bỏ qua, bắt đầu theo lớp” và “Chọn cấp khác”.
- **Chọn từ đúng cho hình**: 1 hình lớn, 3 thẻ chữ có nhãn phím 1–3; chọn thẻ là Bông đọc từ đó. Kiểm tra, dải phản hồi, gợi ý giống “Nghe và chọn hình”.
- **Ôn tập hôm nay**: 5 hộp ghi nhớ theo màu mức thuộc — viền/dải `mastery-N`, nền `mastery-N-soft`, luôn kèm số hộp + tên mức + nhãn chữ. Đúng thì lên hộp kế tiếp; chưa nhớ thì về hộp 1 “để ôn sớm hơn” (không trừ gì). Hộp 2 là “hộp vàng”.
- **Hộp thoại “Dừng bài học?”**: rồng biểu cảm mới `tiec` (hơi tiếc — không khóc, không trách); “Học tiếp” là nút chính và có sẵn focus.
- **Màn “Sắp có”** cho nút chưa làm: rồng biểu cảm mới `xaydung` (mũ `dragon-hat`, búa `dragon-tool`), không hứa ngày.
- Linh vật nay có **8 biểu cảm**: 6 biểu cảm gốc + `tiec` + `xaydung` (chỉ dùng đúng hai chỗ trên).

### Khu quản trị (người quản trị là phụ huynh)
- **Nhập chủ đề mới bằng Excel** (thẻ mới trong Nhập & xuất Excel): tệp mẫu 2 trang *Chủ đề* (cấp, tên Anh, tên Việt) và *Từ vựng* (từ, phiên âm, loại từ, nghĩa, ví dụ Anh – Việt). Lỗi chặn nhập (thiếu ô, trùng dòng, câu ví dụ không chứa từ) khác **cảnh báo** không chặn (“Từ đã có” nền `brand-soft`, “Chưa có hình” nền xám). “Tự tạo bài học” chia 5–8 từ mỗi bài và liệt kê trước các bài sẽ tạo. Mọi thứ nhập vào ở trạng thái **Nháp**.
- **Khung chương trình** trong cây lộ trình: chủ đề có trong khung mà chưa có bài mang nhãn **“Chưa có bài”** — trung tính, viền nét đứt (`adm-status-none-ink`, `adm-status-none-line`), khác Nháp (nền xám) và Đã xuất bản (xanh) — kèm số từ mục tiêu. Bấm vào mở bảng từ mục tiêu với “Xuất Excel để điền” và “Nhập Excel”.
- Bảng điều khiển có thẻ **Chủ đề chưa có bài** theo từng cấp (cột màu cấp + danh sách).

## Dùng trong mã

Tải `tokens.css`, `components/bundle.css` rồi `components/bundle.js` (không cần React). `window.Bong` cung cấp `icon`, `pic`, `dragon`, `avatar`, `btn`, `speak`, `key`, `stars`, `stat`, `topbar`, `bubble`, `stateBlock`, `feedback`, `dialog`, `burst`, `say` cùng dữ liệu mẫu `words`, `levels`, `kids`. Lớp CSS có tiền tố `b-`. Bộ THCS: gọi `Bong.suite('thcs')` rồi dùng `Bong.T` (`shell`, `btn`, `opt`, `chip`, `ring`, `bars`, `badge`, `dragon`, `tip`, `state`, `feedback`, `dialog`, `lessonHead`, `lessonFoot`); `Bong.setMode('thcs' | 'thcs-toi')` đổi sáng/tối. Lớp CSS THCS có tiền tố `t-`, đặt trong vùng `.thcs`. Kiểu chi tiết ở `components/index.d.ts`. Khu người lớn: gọi `Bong.suite('adult')` rồi dùng `Bong.A` (`shell`, `btn`, `kpi`, `status`, `field`, `validate`, `wireValidate`, `setErr`, `toggle`, `table`, `drawer`, `dialog`, `toast`, `sortable`, `vbars`, `hbars`, `line`, `empty`, `error`, `skel`) cùng dữ liệu mẫu `Bong.A.data`; lớp CSS tiền tố `a-` trong vùng `.adm`.
