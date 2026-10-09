# Đặc tả chức năng: Web học tiếng Anh từ lớp 1 đến lớp 9

*Phiên bản 2.1, 02/10/2026. Bản này thay cho phiên bản 1.*
*Bản 2.1 đổi công nghệ sang Next.js + Prisma + MySQL, giống dự án Covet, để dùng lại CLAUDE.md và quy trình task (Phần H).*

**Những gì thay đổi so với bản 1:**
- Ưu tiên chạy trên trình duyệt máy tính (chuột, bàn phím), không còn ưu tiên máy tính bảng.
- Mở rộng từ tiểu học lên hết THCS: lộ trình **10 cấp độ** chia thành 4 chặng, có 2 bộ giao diện (Tiểu học và THCS).
- Dữ liệu lưu trong **MySQL**: dùng MySQL của XAMPP khi chạy trên máy, chuyển sang MySQL của hosting khi đưa online.
- Thêm phần **quản trị nội dung**, vì nội dung giờ nằm trong cơ sở dữ liệu và rất nhiều.

**Ký hiệu dùng trong tài liệu:**
- **[GĐ1]** đến **[GĐ4]**: giai đoạn xây dựng (xem Phần I). Nên thiết kế các màn [GĐ1] trước.
- **(TH)**: chỉ có ở giao diện Tiểu học. **(THCS)**: chỉ có ở giao diện THCS.

**Mục lục:** A. Lộ trình 10 cấp · B. Yêu cầu giao diện · C. Màn hình học sinh · D. Khu vực bố mẹ · E. Quản trị nội dung · F. Quy tắc hoạt động · G. Cơ sở dữ liệu MySQL · H. Công nghệ, XAMPP và hosting · I. Giai đoạn xây dựng · J. Đoạn mô tả cho Claude Design

---

## Phần A. Lộ trình 10 cấp độ

### A1. Bốn chặng, mười cấp

Bé học theo **năng lực**, không bắt buộc theo lớp. Bài xếp lớp quyết định bé bắt đầu ở cấp nào, và bé học tốt có thể học vượt. Cột "lớp tương ứng" chỉ để tham khảo.

Theo chương trình phổ thông 2018, học sinh cần đạt bậc 1 (A1) khi hết tiểu học và bậc 2 (A2) khi hết THCS. Lộ trình này đi xa hơn một chút, tới B1, để bé học tốt có chỗ tiến lên và để luyện thi vào lớp 10.

| Chặng | Cấp | Tên gợi ý | Lớp tương ứng | Khung tham chiếu | Trọng tâm | Từ vựng tích lũy (ước lượng) |
|---|---|---|---|---|---|---|
| Khởi đầu | 1 | Hạt giống | Lớp 1 | Pre-A1 | Chữ cái, phonics âm đơn, số 1–20, màu sắc, con vật, gia đình. *This is a…, I like…* | ~150 |
| Khởi đầu | 2 | Mầm non | Lớp 2 | Pre-A1 (Starters) | Đồ dùng học tập, đồ ăn, cơ thể, quần áo, đồ chơi. *have got, can, there is/are*, câu hỏi *What/Where/How many* | ~350 |
| Tiểu học | 3 | Lá xanh | Lớp 3 | Pre-A1 → A1 (Starters → Movers) | Giờ giấc, hoạt động hằng ngày, thời tiết, thể thao. Hiện tại đơn, hiện tại tiếp diễn. Bắt đầu chép và điền từ | ~600 |
| Tiểu học | 4 | Cành cây | Lớp 4 | A1 (Movers) | Thành phố, nghề nghiệp, sức khỏe. Quá khứ đơn, so sánh hơn. Đọc truyện ngắn | ~900 |
| Tiểu học | 5 | Cây lớn | Lớp 5 | A1 → A2 (Flyers) | Du lịch, thiên nhiên, cảm xúc. *will, going to, should, must*. Viết đoạn 3–5 câu | ~1.300 |
| THCS | 6 | Singapore | Lớp 6 | A2 nền tảng | Trường mới, nhà ở, khu phố, lễ hội, thể thao. Củng cố các thì cơ bản, so sánh nhất, câu điều kiện loại 1, đại từ sở hữu | ~1.700 |
| THCS | 7 | Sydney | Lớp 7 | A2 | Sở thích, sức khỏe, âm nhạc, ẩm thực, giao thông. Danh từ đếm được và không đếm được, mạo từ, *although/despite* | ~2.100 |
| THCS | 8 | London | Lớp 8 | A2+ (A2 Key) | Môi trường, phong tục, công nghệ, thiên tai. Quá khứ tiếp diễn, câu phức, câu tường thuật, động từ chỉ sở thích + V-ing | ~2.500 |
| THCS | 9 | New York | Lớp 9 | A2 → B1 | Cộng đồng, đời sống đô thị, du lịch, nghề nghiệp. Hiện tại hoàn thành, *used to*, câu ước, mệnh đề quan hệ, câu bị động, cụm động từ. Luyện thi vào 10 | ~3.000 |
| Nâng cao | 10 | Toronto | Học vượt | B1 (B1 Preliminary) | Đọc hiểu đoạn dài, viết bài 100–150 từ, nói theo chủ đề, ngữ pháp tổng hợp, đề vào 10 nâng cao | ~3.500 |

*Ghi chú: số từ là ước lượng. Chủ điểm ngữ pháp từng cấp THCS sẽ được đối chiếu với SGK Global Success lớp 6–9 khi soạn nội dung.*

### A2. Cấu trúc bên trong mỗi cấp

```
Chặng
 └─ Cấp
     ├─ Chủ đề (TH: 6–8 chủ đề/cấp; THCS: 10–12 chủ đề/cấp, khớp số Unit SGK)
     │   ├─ Bài học (4–6 bài/chủ đề)
     │   │   └─ Hoạt động (thẻ từ, câu hỏi, trò chơi…)
     │   └─ Bài kiểm tra chủ đề ("trận trùm")
     └─ Bài thi lên cấp
```

- Bài học Tiểu học dài 10–15 phút. Bài học THCS dài 15–25 phút, có thêm phần ngữ pháp và luyện kỹ năng.
- Mỗi từ, câu hỏi và bài học đều được gắn nhãn: **cấp, chủ đề, kỹ năng, chủ điểm ngữ pháp, độ khó**, và nếu có thì **lớp + Unit SGK**. Nhờ vậy, cùng một kho nội dung phục vụ được cả 4 cách học bên dưới.
- **Khung chương trình** có sẵn cho cả 10 cấp: mỗi cấp có danh sách chủ đề và **từ mục tiêu** của từng chủ đề. Cấp 1–5 dựa trên danh sách từ Cambridge Starters (cấp 1–2), Movers (cấp 3–4), Flyers (cấp 5). Cấp 6–9 theo các chủ đề của chương trình tiếng Anh THCS (tự đặt lời, không chép SGK). Cấp 10 theo A2 Key và B1 Preliminary. Chủ đề trong khung mà chưa soạn chi tiết thì ở trạng thái "Chưa có bài", học sinh không thấy.
- **Tạo bài tự động từ danh sách từ:** khi một chủ đề đã có từ vựng đầy đủ (nghĩa, câu ví dụ, hình), web tự chia thành các bài 5–8 từ, mỗi bài gồm các dạng 8.1–8.4, cuối chủ đề có trận trùm. Bố mẹ không cần tự soạn từng bài.

### A3. Bốn cách học

| Cách học | Mô tả | Dùng ở | GĐ |
|---|---|---|---|
| **Lộ trình cấp độ** (chính) | Đi lần lượt trên bản đồ, từ cấp đến chủ đề rồi đến bài | TH, THCS | GĐ1 |
| **Học theo SGK** | Chọn lớp → Unit, có từ vựng, ngữ pháp, luyện tập và kiểm tra của Unit đó. Dùng khi bé sắp kiểm tra ở trường | THCS (có thể mở cho lớp 3–5) | GĐ3 |
| **Thư viện ngữ pháp** | Học và luyện riêng từng chủ điểm ngữ pháp | THCS | GĐ3 |
| **Luyện thi** | Đề kiểm tra theo lớp, đề thi thử vào lớp 10, đề làm quen A2 Key và B1 Preliminary | THCS | GĐ3–4 |

### A4. Giao diện lớn lên cùng bé

Học sinh lớp 1 và học sinh lớp 9 không thích cùng một kiểu giao diện. Vì vậy web có **2 bộ giao diện** dùng chung chức năng và dữ liệu:

| | Giao diện Tiểu học (cấp 1–5) | Giao diện THCS (cấp 6–10) |
|---|---|---|
| Phong cách | Hoạt hình, tròn trịa, màu tươi | Hiện đại, gọn gàng như app học tập cho tuổi teen, có chế độ tối |
| Linh vật | Rồng con lớn, có mặt ở mọi màn, nói chuyện với bé | Vẫn chú rồng đó nhưng đã "lớn", chỉ hiện nhỏ ở góc và có thể tắt |
| Điều hướng | Nút hình lớn ở trang chủ | Thanh menu bên trái |
| Bản đồ | Các hòn đảo | Hành trình vòng quanh thế giới, mỗi cấp là một thành phố |
| Phần thưởng | Sao, xu, sticker, phòng của linh vật | Điểm kinh nghiệm (XP), huy hiệu, danh hiệu, tùy biến avatar và màu giao diện |
| Thời gian | Không bao giờ đếm ngược | Có đếm ngược trong bài thi và trò chơi thử thách |
| Chữ | Ít chữ, hướng dẫn được đọc to | Nhiều chữ hơn, giải thích ngữ pháp bằng tiếng Việt |

Giao diện tự chuyển khi bé lên cấp 6. Bố mẹ hoặc bé có thể đổi lại trong cài đặt.

---

## Phần B. Yêu cầu chung về giao diện (ưu tiên máy tính)

| Hạng mục | Yêu cầu |
|---|---|
| Thiết bị chính | Laptop hoặc PC có chuột và bàn phím, trình duyệt Chrome hoặc Edge. |
| Kích thước màn hình | Thiết kế ở khung 1440×900. Các màn bài học phải vừa màn 1366×768 mà không cần cuộn. Trên màn 1920×1080, nội dung căn giữa và không bị kéo giãn. |
| Thiết bị phụ | Máy tính bảng nằm ngang vẫn dùng được nhờ bố cục co giãn. Chưa cần tối ưu cho điện thoại. |
| Chuột | Mọi nút và thẻ có hiệu ứng khi rê chuột. Các dạng nối, sắp xếp dùng kéo thả bằng chuột. |
| Bàn phím | Phím tắt: **1–4** (hoặc **A–D**) chọn đáp án, **Enter** để kiểm tra hoặc tiếp tục, **Space** nghe lại, **H** xem gợi ý, **Esc** thoát. Trên mỗi đáp án có nhãn số phím nhỏ. Các dạng chính tả, viết câu dùng bàn phím thật. |
| Micro | Dùng micro của laptop hoặc tai nghe có micro. Có màn kiểm tra micro trước khi luyện nói. |
| Chế độ tập trung | Có nút toàn màn hình khi học, ẩn mọi thứ khác. |
| Kích thước | Nút chính cao tối thiểu 56 px (TH) hoặc 44 px (THCS). Chữ tiếng Anh trong bài tối thiểu 32 px (TH) hoặc 20 px (THCS). |
| Font | TH: font tròn như Nunito hoặc Baloo 2. THCS và khu người lớn: Be Vietnam Pro hoặc Inter. Font nào cũng phải hiển thị tốt tiếng Việt. |
| Màu phản hồi | Đúng là xanh lá. Chưa đúng là cam nhẹ, không dùng đỏ gắt. Mỗi cấp có một màu chủ đạo riêng. |
| Âm thanh | Mọi từ và câu đều bấm để nghe được. Có hiệu ứng âm thanh khi đúng, sai, nhận thưởng, và có nút tắt nhạc nền. |
| Khi làm sai | Không phạt, không có màn "thua cuộc". TH: linh vật động viên và cho làm lại. THCS: hiện giải thích ngắn vì sao sai. |
| Trạng thái màn hình | Mỗi màn có dữ liệu thiết kế đủ 4 trạng thái: bình thường, đang tải (khung xương), trống (hình, lời nhắn, nút hành động), lỗi (nút thử lại). Ở TH, màn trống và màn lỗi có linh vật. |
| Bàn phím và khả năng tiếp cận | Viền focus rõ khi di chuyển bằng phím Tab, chữ đủ tương phản, mọi nút có nhãn. |
| Nội dung trong thiết kế | Dùng từ và câu tiếng Anh thật theo đúng cấp, không dùng lorem ipsum hay "Bài 1". |
| Token | Mọi màu, cỡ chữ, bo góc, bóng đổ, khoảng cách đều đặt tên thành token, để chuyển sang code không phải viết cứng giá trị. |

---

## Phần C. Màn hình học sinh

### Sơ đồ điều hướng

```
Đăng nhập (tài khoản gia đình)
 └─► Chọn hồ sơ ─┬─► Tạo hồ sơ ─► Kiểm tra loa, micro ─► Bài xếp lớp ─► Trang chủ
                 └─► Trang chủ

Trang chủ ─┬─► Tổng quan 10 cấp ─► Bản đồ một cấp ─► Bài học ─► Kết thúc bài
           ├─► Ôn tập hôm nay
           ├─► Sổ từ
           ├─► Học theo SGK (THCS)
           ├─► Thư viện ngữ pháp (THCS)
           ├─► Luyện thi (THCS) ─► Làm bài thi ─► Kết quả
           ├─► Bộ sưu tập (TH) / Thành tích (THCS)
           └─► Phòng của tớ (TH) / Hồ sơ cá nhân (THCS)

Ở mọi màn ─► Cổng bố mẹ ─► Khu vực bố mẹ ─► Quản trị nội dung (chỉ tài khoản quản trị)
```

### C1. Đăng nhập [GĐ1]

- Tài khoản gia đình do bố mẹ đăng ký bằng email và mật khẩu.
- Có tùy chọn "Nhớ đăng nhập trên máy này" để bé mở web là vào thẳng màn chọn hồ sơ.

### C2. Chọn hồ sơ [GĐ1]

- Mỗi bé có một thẻ hồ sơ gồm ảnh đại diện, tên và cấp hiện tại. Một gia đình có thể có nhiều bé.
- Hồ sơ THCS có thể đặt mã PIN riêng để giữ riêng tư.
- Có nút "+" để thêm hồ sơ, và nút "Bố mẹ" có biểu tượng ổ khóa ở góc.

### C3. Tạo hồ sơ [GĐ1]

1. Nhập tên, năm sinh, **lớp đang học (1–9)** và sách tiếng Anh ở trường (mặc định Global Success).
2. TH: chọn linh vật và đặt tên cho nó. THCS: chọn avatar và màu giao diện.
3. Kiểm tra loa và micro (xem C20).

### C4. Bài xếp lớp [GĐ1]

- Bắt đầu ở mức ứng với lớp đã khai báo, rồi tự tăng hoặc giảm độ khó theo câu trả lời của bé.
- TH: 10–15 câu nghe và chọn hình, không hiện đúng hay sai để bé không áp lực.
- THCS: 20–25 câu gồm từ vựng, ngữ pháp, nghe và đọc ngắn, khoảng 15 phút.
- Kết quả là cấp đề xuất kèm một nhận xét ngắn, ví dụ "Từ vựng tốt, ngữ pháp cần củng cố, bắt đầu ở cấp 6". Bé hoặc bố mẹ vẫn có thể chọn cấp khác.
- Có nút "Bỏ qua, bắt đầu theo lớp".

### C5. Trang chủ

**C5a. Trang chủ Tiểu học [GĐ1]**
- Linh vật ở giữa, chào bé theo thời điểm trong ngày.
- Thẻ **Nhiệm vụ hôm nay**: Ôn tập (số từ cần ôn) và Bài tiếp theo (tên bài, hình chủ đề). Thẻ được đánh dấu khi bé làm xong.
- Thanh trên cùng: ảnh và tên, số sao, số xu, chuỗi ngày học.
- 4 nút lớn: Bản đồ, Sổ từ, Bộ sưu tập, Phòng của tớ.
- Nếu bố mẹ có đặt giới hạn, thời gian học còn lại hiện bằng hình mặt trời đang lặn dần.

**C5b. Trang chủ THCS [GĐ3]**
- Menu trái: Trang chủ, Lộ trình, Học theo SGK, Ngữ pháp, Luyện thi, Ôn tập, Sổ từ, Thành tích.
- Vùng chính:
  - Mục tiêu hôm nay, dạng vòng tiến độ XP.
  - Nút **Học tiếp** để vào bài đang dở.
  - Ôn tập đến hạn.
  - **Điểm yếu cần ôn**: 2–3 chủ điểm ngữ pháp hoặc nhóm từ hay sai.
  - **Lịch kiểm tra sắp tới** ở trường (bố mẹ nhập, xem D6).
  - Chuỗi ngày và XP trong tuần.

### C6. Bản đồ lộ trình

**C6a. Tổng quan 10 cấp [GĐ1]**
- Một màn nhìn toàn bộ 10 cấp như một con đường lớn: 5 đảo của tiểu học, rồi 5 thành phố của THCS.
- Đánh dấu vị trí hiện tại của bé, các cấp đã qua và các cấp còn khóa.
- Bấm vào một cấp để xem cấp đó học gì, có bao nhiêu chủ đề và đã hoàn thành bao nhiêu phần trăm.
- Đây là màn thể hiện rõ nhất việc chia lộ trình theo cấp độ.

**C6b. Bản đồ một cấp Tiểu học, dạng hòn đảo [GĐ1]**
- Mỗi đảo có 6–8 vùng đất theo chủ đề, ví dụ "Vườn thú", "Nhà của tớ", "Bếp nhỏ".
- Mỗi vùng là một con đường gồm 4–6 chặng bài và một trận trùm ở cuối.
- Mỗi chặng có 3 trạng thái: khóa (xám, có ổ khóa), đang học (nhấp nháy, linh vật đứng đó), hoàn thành (1–3 sao).
- Rê chuột hoặc bấm vào chặng để xem tên bài, các từ sẽ học và nút "Bắt đầu".
- Cuối đảo là cổng Bài thi lên cấp.

**C6c. Bản đồ một cấp THCS, dạng thành phố [GĐ3]**
- Các chủ đề là địa danh trên bản đồ thành phố. Ví dụ ở London, mỗi chủ đề gắn với một địa danh như Big Ben hay Tower Bridge.
- Mỗi chủ đề hiện phần trăm hoàn thành, danh sách bài và bài kiểm tra chủ đề.
- Góc "Bạn có biết?" giới thiệu văn hóa của nước đó.

### C7. Khung màn hình bài học [GĐ1]

- **Trên cùng**: nút thoát (hỏi lại "Dừng bài học?"), thanh tiến độ. Ở THCS có thêm đồng hồ khi là bài thử thách.
- **Giữa**: vùng hoạt động rộng tối đa khoảng 960 px, căn giữa màn hình.
- **Dưới cùng**: nút Nghe lại (Space), Gợi ý (H), Kiểm tra hoặc Tiếp tục (Enter), có ghi phím tắt bên cạnh.
- **Góc**: linh vật (TH).
- Sau mỗi câu, một dải phản hồi trượt lên báo đúng hay chưa đúng. Ở THCS có thêm giải thích ngắn và nút "Xem quy tắc".

**Một bài Tiểu học (khoảng 12 phút):** khởi động ôn 5 từ cũ → học 5–8 từ mới → luyện tập 2–3 dạng bài → mini game → thử thách 3 câu → kết thúc.

**Một bài THCS (khoảng 20 phút):** khởi động ôn tập → học 8–12 từ mới → ngữ pháp (bài giảng ngắn và kiểm tra nhanh) → luyện kỹ năng (nghe hoặc đọc, viết hoặc nói) → thử thách 5 câu → kết thúc.

### C8. Các dạng bài

Mỗi dạng bài là một mẫu giao diện riêng, đặt trong khung C7.

**Nhóm cơ bản**

| # | Dạng bài | Dùng ở | GĐ | Bố cục và tương tác |
|---|---|---|---|---|
| 8.1 | Thẻ từ | TH, THCS | 1 | Hình lớn, từ, câu ví dụ. THCS thêm phiên âm IPA và loại từ. Bấm để nghe, lật thẻ xem nghĩa, phím ← → để chuyển thẻ. |
| 8.2 | Nghe và chọn hình | TH | 1 | Loa lớn tự phát âm, bên dưới 2–4 hình. Gợi ý: phát chậm lại, bỏ bớt 1 đáp án sai. |
| 8.3 | Nối cặp | TH, THCS | 1 | TH nối từ với hình, THCS nối từ với nghĩa hoặc nửa câu với nửa câu. Kéo thả hoặc bấm lần lượt hai bên. |
| 8.4 | Chọn từ đúng cho hình | TH | 1 | Một hình lớn và 3 lựa chọn chữ. Bấm vào chữ để nghe đọc. |
| 8.5 | Ghép âm phonics | TH | 2 | Hình (ví dụ con mèo) và các ô chữ c, a, t rời nhau. Bấm từng ô để nghe âm, kéo vào ô trống theo thứ tự, ghép xong thì đọc cả từ. |
| 8.6 | Truyện tranh có đọc to | TH | 2 | Mỗi trang một tranh và 1–2 câu. Giọng đọc chạy, chữ sáng lên theo. Bấm từ bất kỳ để nghe riêng. Có câu hỏi xen giữa truyện. |
| 8.7 | Luyện nói từ và câu | TH, THCS | 2 | Hình và từ hoặc câu mẫu. Bấm nút micro (hoặc phím R) để ghi âm. Chấm 1–3 sao theo kiểu dễ tính. Nghe lại giọng mình và giọng mẫu. |
| 8.8 | Sắp xếp từ thành câu | TH, THCS | 2 | Các thẻ từ bị xáo trộn, kéo vào hàng cho thành câu. THCS có thể gõ thay vì kéo. |
| 8.9 | Nghe và gõ (chính tả) | TH, THCS | 2 | Nghe từ hoặc câu, gõ bằng bàn phím thật. Gợi ý: hiện chữ cái đầu. |
| 8.10 | Điền từ vào câu | TH, THCS | 2 | Câu có ô trống, kéo thẻ từ vào hoặc gõ. |
| 8.11 | Đọc hiểu ngắn | TH | 2 | Đoạn 3–6 câu có hình minh họa và 2–3 câu hỏi chọn đáp án. |
| 8.27 | Khám phá từ | TH | 2 | Từ ở giữa, 4–6 nhánh câu hỏi WH (What's this? What color? What does it eat/have? What can it do? Where does it live?). Bé đoán từng nhánh bằng chọn hình, nhánh mở ra đáp án có loa; xong thì nói theo một câu và in được. Có ở bài học, Sổ từ và ôn tập. Chỉ cho danh từ cụ thể. Có đoạn văn đọc to (chữ sáng theo giọng) và nút Dịch nghĩa hiện bản tiếng Việt dưới từng câu; ở chế độ tự khám phá có liên kết sang Họ vần. |
| 8.28 | Họ vần và Ghép chữ đầu | TH | 2 | Vần ở giữa (-at), các từ cùng vần cùng âm xung quanh, phần vần tô màu; ô "Bẫy chính tả" cho từ cùng chữ khác âm (eat). Trò Ghép chữ đầu: b + at = bat. Có câu vui đọc to kèm dịch; mỗi thẻ từ có nút sang Ghép chữ đầu và Khám phá từ. Họ từ gốc (art → artist) để GĐ3 cùng 8.17. |

**Nhóm THCS**

| # | Dạng bài | GĐ | Bố cục và tương tác |
|---|---|---|---|
| 8.12 | Bài giảng ngữ pháp | 3 | Khung công thức nổi bật, giải thích bằng tiếng Việt, 3–5 ví dụ có nút nghe, mẹo nhớ, lỗi hay gặp. Cuối bài có 3 câu kiểm tra nhanh. |
| 8.13 | Trắc nghiệm A/B/C/D | 3 | Câu hỏi và 4 đáp án có nhãn phím. Sau khi trả lời thì hiện giải thích. |
| 8.14 | Chia động từ | 3 | Câu có động từ trong ngoặc và ô để gõ. Chấp nhận cả dạng viết tắt (*isn't* và *is not*). |
| 8.15 | Phát âm | 3 | 4 từ có phần gạch chân, chọn từ có phần gạch chân phát âm khác. Bấm từng từ để nghe. |
| 8.16 | Trọng âm | 3 | 4 từ được chia âm tiết, chọn từ có trọng âm khác. Bấm từng từ để nghe. |
| 8.17 | Cấu tạo từ | 3 | Câu có ô trống và từ gốc in hoa bên cạnh, ví dụ SUCCESS → *successful*. |
| 8.18 | Tìm lỗi sai | 3 | Câu có 4 phần gạch chân, bấm vào phần sai rồi gõ phần sửa (tùy chọn). |
| 8.19 | Viết lại câu không đổi nghĩa | 3 | Câu gốc và phần đầu của câu mới, bé gõ phần còn lại. Một câu có thể có nhiều đáp án đúng. |
| 8.20 | Đọc điền từ (cloze) | 3 | Đoạn văn có các ô trống đánh số, chọn từ trong danh sách thả xuống hoặc A/B/C/D. |
| 8.21 | Đọc hiểu đoạn dài | 3 | Bố cục 2 cột: đoạn văn bên trái (cuộn riêng), câu hỏi bên phải (đúng/sai, trắc nghiệm, trả lời ngắn). Bấm vào từ trong đoạn để tra nghĩa nhanh. |
| 8.22 | Nghe hiểu | 3 | Nghe hội thoại hoặc thông báo rồi điền thông tin hoặc chọn đáp án. Khi thi chỉ được nghe 2 lần, khi luyện tập thì không giới hạn. Nộp bài xong mới xem được lời thoại. |
| 8.23 | Sắp xếp hội thoại hoặc đoạn văn | 3 | Kéo thả các câu theo đúng thứ tự. |
| 8.24 | Viết đoạn văn hoặc email | 3 (AI ở GĐ4) | Đề bài, gợi ý ý, ô viết có đếm từ (80–120 từ) và danh sách từ nên dùng. GĐ3: chấm tự động theo từ khóa và bố mẹ chấm thêm. GĐ4: AI nhận xét theo tiêu chí nội dung, từ vựng, ngữ pháp, mạch lạc và gợi ý cách sửa. |
| 8.25 | Nói theo chủ đề | 3 (AI ở GĐ4) | Câu hỏi gợi ý, 30 giây chuẩn bị, ghi âm tối đa 1 phút rồi nghe lại. GĐ4: AI chuyển lời nói thành chữ và nhận xét. |
| 8.26 | Trò chuyện với linh vật AI | 4 | Giao diện như khung chat. Bé nói hoặc gõ, AI chỉ dùng từ vựng trong cấp của bé. Dùng cho cả TH và THCS. |

### C9. Mini game

| Game | Dùng ở | GĐ | Mô tả |
|---|---|---|---|
| Lật thẻ ghép cặp | TH | 1 | 6–12 thẻ úp, lật 2 thẻ để ghép hình với chữ. Đếm số lượt, không đếm giờ. |
| Mưa từ vựng | TH (cấp 3–5), THCS | 2 | Từ hoặc hình rơi xuống, bé gõ đúng chính tả trước khi chạm đất. Rất hợp với bàn phím máy tính. |
| Bong bóng từ vựng | TH | 2 | Nghe một từ, bấm vào bong bóng chứa hình đúng đang bay lên. |
| Đập chuột chữ cái | TH | 2 | Chuột chui lên mang chữ cái hoặc hình, đập đúng con theo âm được đọc. |
| Đua xe trả lời | TH | 2 | Mỗi câu đúng giúp xe chạy thêm một đoạn, đua với "xe ma" là thành tích lần trước của chính bé. |
| Đấu trí 60 giây | THCS | 3 | Trả lời đúng càng nhiều câu càng tốt trong 60 giây, phá kỷ lục cá nhân. |
| Ô chữ | THCS | 3 | Ô chữ theo chủ đề, gợi ý bằng định nghĩa tiếng Anh hoặc hình. |
| Ghép cụm từ | THCS | 3 | Ghép *make, do, take, have…* với từ đi kèm đúng. |

### C10. Kết thúc bài [GĐ1]

- **TH**: linh vật chúc mừng, số sao (1–3) hiện lần lượt kèm hiệu ứng, số xu nhận được, danh sách từ vừa học (bấm để nghe), sticker bất ngờ nếu có [GĐ2].
- **THCS**: XP nhận được, độ chính xác (%), phần làm tốt và phần cần ôn, danh sách từ mới.
- Nút: Bài tiếp theo, Về bản đồ, Làm lại để được 3 sao.

### C11. Ôn tập hôm nay [GĐ1]

- Mở từ thẻ Ôn tập ở trang chủ.
- Trộn nhiều dạng bài với các từ đến hạn ôn. THCS có thêm các câu ngữ pháp bé từng làm sai.
- Tối đa 15 mục (TH) hoặc 20 mục (THCS), khoảng 3–5 phút.
- Kết thúc bằng tổng kết, ví dụ: "Hôm nay cậu đã ôn 12 từ, 3 từ được chuyển lên hộp vàng!", kèm phần thưởng.

### C12. Sổ từ [GĐ1]

- Lưới thẻ từ (hình và chữ), lọc được theo chủ đề và cấp. THCS lọc thêm theo lớp và Unit SGK.
- Viền thẻ có màu theo 5 mức thuộc: đỏ nhạt, cam, vàng, xanh lá, vàng kim ("đã thuộc").
- Bấm vào thẻ để phóng to, nghe từ và câu ví dụ. THCS có thêm phiên âm, loại từ, họ từ (*happy, happiness, unhappy*) và các cụm từ hay đi kèm.
- Trên cùng hiện tổng số từ đã gặp và số từ đã thuộc. Có nút in danh sách từ.

### C13. Bộ sưu tập (TH) [GĐ2] và Thành tích (THCS) [GĐ3]

- **TH**: album sticker theo chủ đề (con vật, xe cộ, khủng long…), ô chưa có hiện bóng mờ. Tab huy hiệu như "7 ngày liên tiếp", "100 từ đầu tiên", "Qua đảo Hạt giống", huy hiệu chưa đạt hiện mờ kèm điều kiện.
- **THCS**: huy hiệu, danh hiệu theo cấp (ví dụ "Công dân London"), biểu đồ XP theo tuần, kỷ lục cá nhân ở các trò chơi.

### C14. Phòng của tớ (TH) [GĐ2] và Hồ sơ cá nhân (THCS) [GĐ3]

- **TH**: căn phòng nơi linh vật sống, bé kéo thả đồ đạc để trang trí. Cửa hàng bán đồ nội thất, quần áo, mũ cho linh vật bằng xu (không có tiền thật). Mỗi đồ vật có tên tiếng Anh, bấm vào để nghe.
- **THCS**: tùy biến avatar, khung avatar, màu giao diện, chế độ tối. Một số lựa chọn được mở khóa bằng XP hoặc huy hiệu.

### C15. Học theo SGK [GĐ3]

- Chọn lớp (3–9), rồi chọn trong lưới Unit (số Unit, tên, hình, % hoàn thành).
- Trang của mỗi Unit có 4 tab: **Từ vựng** (danh sách và thẻ từ), **Ngữ pháp** (các chủ điểm của Unit), **Luyện tập** (bài theo kỹ năng), **Kiểm tra Unit** (15 phút, chấm thang 10).

### C16. Thư viện ngữ pháp [GĐ3]

- Danh sách chủ điểm ngữ pháp nhóm theo cấp, có ô tìm kiếm.
- Mỗi chủ điểm có trạng thái: chưa học, đang học, thành thạo (tính theo tỷ lệ làm đúng).
- Trang chủ điểm gồm bài giảng (dạng 8.12), bài tập theo 3 mức độ khó và một bài kiểm tra nhanh.

### C17. Luyện thi [GĐ3–GĐ4]

**Danh sách đề**, chia theo nhóm:
- Kiểm tra 15 phút, giữa kỳ, cuối kỳ theo từng lớp [GĐ3].
- Thi thử vào lớp 10 [GĐ4].
- Làm quen đề A2 Key và B1 Preliminary [GĐ4].

**Màn làm bài thi:**
- Đồng hồ đếm ngược.
- Bảng số câu ở bên cạnh, phân biệt câu đã làm, chưa làm và câu đánh dấu xem lại. Bé chuyển câu tự do.
- Nút nộp bài, cảnh báo nếu còn câu bỏ trống. Hết giờ thì tự nộp.
- Bài làm dở được lưu lại nếu lỡ tắt trình duyệt.

**Màn kết quả:**
- Điểm thang 10 và thời gian làm bài.
- Đúng hay sai từng câu, kèm giải thích.
- Phân tích theo dạng bài, ví dụ "Trọng âm 2/4, Viết lại câu 3/5".
- Nút "Ôn lại các câu sai" để đưa các câu sai vào phần ôn tập.

### C18. Bài thi lên cấp [GĐ2]

- TH: 20 câu trộn các dạng bài của cấp. THCS: 30–40 câu và một bài viết ngắn.
- Đạt từ 80% trở lên: màn chúc mừng lớn, linh vật lớn lên (TH) hoặc nhận danh hiệu (THCS), mở cấp mới.
- Chưa đạt: linh vật động viên, gợi ý 2–3 chủ đề nên ôn lại và có nút đi tới đó.

### C19. Hết giờ học [GĐ1]

- Khi hết thời gian bố mẹ đặt: TH thì linh vật ngáp rồi đi ngủ ("Hẹn gặp lại cậu ngày mai nhé!"), THCS thì hiện một thông báo nhẹ nhàng.
- Bé được làm nốt câu đang dở rồi mới bị khóa. Chỉ bố mẹ mở thêm giờ được.

### C20. Kiểm tra loa và micro [GĐ1]

- Phát âm thanh thử, có thanh hiển thị mức âm của micro, và cho bé nói thử "Hello".
- Nếu không có micro, các bài luyện nói được thay bằng bài nghe.

---

## Phần D. Khu vực bố mẹ

Giao diện dành cho người lớn: dạng bảng điều khiển gọn gàng, nhiều số liệu, màu trung tính, không có linh vật.

| # | Màn | GĐ | Nội dung |
|---|---|---|---|
| D1 | Cổng bố mẹ | 1 | Nhập mật khẩu tài khoản hoặc mã PIN 4–6 số. |
| D2 | Tổng quan | 1 | Chọn con. Thẻ số liệu: phút học trong tuần, chuỗi ngày, số từ đã thuộc, cấp hiện tại và % hoàn thành, trình độ ước lượng (A1/A2/B1). Biểu đồ phút học 7 ngày và 30 ngày. Danh sách hoạt động gần đây. |
| D3 | Kỹ năng và kiến thức | 2 | Biểu đồ Nghe, Nói, Đọc, Viết, Từ vựng, Ngữ pháp, Phát âm. Danh sách từ hay sai. (THCS) Bảng chủ điểm ngữ pháp mạnh và yếu. |
| D4 | Kết quả thi | 3 | Lịch sử các bài kiểm tra và đề thi, biểu đồ điểm theo thời gian, xem lại bài làm của con. |
| D5 | Bài viết và ghi âm | 2–3 | Nghe bản ghi âm, đọc bài viết của con, chấm điểm và để lại nhận xét để con xem. |
| D6 | Lịch kiểm tra ở trường | 3 | Bố mẹ nhập ngày kiểm tra và các Unit cần ôn. Trong 5 ngày trước đó, web tự thêm bài ôn các Unit này vào nhiệm vụ hằng ngày của con. |
| D7 | Cài đặt | 1 | Giới hạn thời gian mỗi ngày và khung giờ được học. Giao diện Tiểu học, THCS hoặc tự động. Giọng đọc Anh hoặc Mỹ, tốc độ thường hoặc chậm. Âm thanh. Quản lý hồ sơ: đổi tên, đổi lớp, đổi cấp thủ công, đặt lại tiến độ, xóa. Đổi mật khẩu và PIN. |

---

## Phần E. Quản trị nội dung

Phần này dành cho tài khoản quản trị (bố hoặc mẹ). Vì nội dung nằm trong MySQL và 10 cấp sẽ có hàng nghìn từ và câu hỏi, đây là công cụ để thêm và sửa nội dung mà không cần đụng vào code.

| # | Màn | GĐ | Nội dung |
|---|---|---|---|
| E1 | Bảng điều khiển | 1 | Số từ, bài học, câu hỏi theo từng cấp. Cảnh báo nội dung còn thiếu, ví dụ từ chưa có hình hoặc âm thanh, chủ đề chưa đủ bài. |
| E2 | Cấu trúc lộ trình | 1 | Cây Chặng → Cấp → Chủ đề → Bài học. Thêm, sửa, kéo thả để sắp xếp. Mỗi mục có trạng thái Nháp hoặc Xuất bản, học sinh chỉ thấy nội dung đã xuất bản. |
| E3 | Ngân hàng từ vựng | 1 | Bảng có tìm kiếm và lọc theo cấp, chủ đề, lớp và Unit SGK. Biểu mẫu từ gồm: từ, phiên âm IPA, loại từ, nghĩa tiếng Việt, câu ví dụ (Anh và Việt), hình, âm thanh (có nút "Tạo giọng đọc tự động"), họ từ, cấp, chủ đề, Unit SGK. |
| E4 | Ngân hàng câu hỏi | 1 (dạng cơ bản), 3 (dạng THCS) | Lọc theo dạng bài, cấp, kỹ năng, chủ điểm ngữ pháp, độ khó (1–5). Biểu mẫu thay đổi theo dạng bài, có ô giải thích đáp án và nút xem trước như học sinh. |
| E5 | Soạn bài học | 1 | Chọn từ và câu hỏi cho bài (web tự gợi ý theo chủ đề), sắp thứ tự các bước, xem trước. |
| E6 | Chủ điểm ngữ pháp | 3 | Trình soạn thảo bài giảng có định dạng chữ, bảng và khung công thức. Ví dụ có âm thanh. Gắn cấp và Unit SGK. |
| E7 | Tạo đề thi | 3 | Chọn câu bằng tay, hoặc tạo tự động theo ma trận (ví dụ 2 câu phát âm, 2 trọng âm, 10 ngữ pháp, 5 đọc điền, 5 đọc hiểu, 5 viết lại câu, độ khó trung bình 3). Đặt thời gian, thang điểm, tùy chọn trộn câu và đáp án. |
| E8 | Nhập và xuất Excel | 1 | Tải tệp Excel mẫu cho từ vựng và câu hỏi, nhập hàng loạt. Web báo lỗi từng dòng trước khi lưu. Xuất được ra Excel. |
| E9 | Thư viện hình và âm thanh | 1 | Tải lên, tìm kiếm, xem hình, nghe thử. Tạo âm thanh hàng loạt cho những từ còn thiếu. |
| E10 | Sao lưu | 3 | Tải bản sao cơ sở dữ liệu cùng hình và âm thanh về máy. |
| E11 | Trợ lý AI soạn nội dung | 4 | Chọn cấp, chủ đề và danh sách từ, AI đề xuất câu ví dụ, câu hỏi, đoạn đọc. Quản trị duyệt trước khi lưu. |

---

## Phần F. Quy tắc hoạt động

*Phần này dùng khi dựng code, không cần thiết kế.*

**Sao (bài học):** 3 sao nếu sai 0–1 lần, 2 sao nếu sai 2–4 lần, 1 sao nếu hoàn thành.

**Phần thưởng:**

| Hoạt động | Tiểu học | THCS |
|---|---|---|
| Hoàn thành bài học | 10 xu + 5 xu mỗi sao | 20 XP + 10 XP mỗi sao |
| Ôn tập | 1 xu mỗi từ | 2 XP mỗi mục |
| Bài kiểm tra, bài thi | Không áp dụng | Điểm × 10 XP |
| Đạt huy hiệu | 50 xu | 100 XP |

**Ôn tập lặp lại (5 hộp):** áp dụng cho từ vựng, và ở THCS thêm các câu ngữ pháp từng làm sai.

| Hộp | Ôn lại sau |
|---|---|
| 1 | 1 ngày |
| 2 | 3 ngày |
| 3 | 7 ngày |
| 4 | 14 ngày |
| 5 | 30 ngày, sau đó tính là "đã thuộc" |

Trả lời đúng thì lên một hộp, sai thì về hộp 1.

**Chuỗi ngày:** học ít nhất 1 bài hoặc 1 lượt ôn trong ngày thì được tính. Mỗi tuần có 1 "thẻ nghỉ phép" tự dùng khi bé bỏ một ngày. THCS được chọn mục tiêu ngày (10, 20 hoặc 30 phút).

**Mở khóa:**
- Bài tiếp theo mở khi bài trước đạt từ 1 sao.
- Bài kiểm tra chủ đề mở khi xong mọi bài trong chủ đề.
- Bài thi lên cấp mở khi xong mọi chủ đề, và đạt từ 80% thì lên cấp.
- Bố mẹ có thể mở khóa thủ công.

**Bài xếp lớp thích ứng:**
- Bắt đầu ở cấp bằng lớp đã khai báo.
- Đúng 3 câu liên tiếp thì lên một mức, sai 2 câu liên tiếp thì xuống một mức.
- Dừng khi kết quả ổn định hoặc hết câu.
- Cấp đề xuất là mức cao nhất bé làm đúng từ 70% trở lên.

**Điều chỉnh độ khó trong bài:** đúng liên tiếp thì bớt gợi ý và thêm đáp án nhiễu. Sai nhiều thì giảm số lựa chọn và phát âm chậm lại.

**Điểm thi:** thang 10, làm tròn đến 0,25.

**Giao diện:** cấp 1–5 dùng giao diện Tiểu học, cấp 6–10 dùng giao diện THCS. Có thể đổi tay.

---

## Phần G. Cơ sở dữ liệu MySQL

**Lưu ý chung:**
- XAMPP thực ra dùng MariaDB, một bản tương thích với MySQL. Ứng dụng này chạy được trên cả hai mà không phải sửa code.
- Mọi bảng dùng bảng mã **utf8mb4_unicode_ci**, để lưu được tiếng Việt và emoji và để xuất/nhập giữa MariaDB và MySQL không bị lỗi.
- Bảng được tạo bằng Prisma Migrate (xem Phần H), nên trên máy và trên hosting có cấu trúc giống hệt nhau.
- Tên bảng và cột dưới đây viết kiểu snake_case cho dễ đọc. Khi viết schema Prisma, tên model và field theo quy ước của dự án.

**Tài khoản**

| Bảng | Dùng để | Cột chính |
|---|---|---|
| users | Tài khoản gia đình và quản trị | name, email, password, role (admin, parent), parent_pin |
| learners | Hồ sơ học sinh | user_id, name, birth_year, school_grade, textbook, avatar, mascot, mascot_name, ui_theme, current_level_id, stars, coins, xp, streak_days, streak_freezes, last_study_date, pin, settings (JSON: giới hạn giờ, khung giờ được học theo ngày, giờ mở tạm của bố mẹ, giọng đọc, nhạc nền, hiệu ứng, âm lượng, chấm phát âm, mục tiêu ngày) |

**Lộ trình**

| Bảng | Dùng để | Cột chính |
|---|---|---|
| stages | 4 chặng | name, sort_order |
| levels | 10 cấp | stage_id, number, name, cefr, description, color, theme |
| units | Chủ đề trong cấp | level_id, title, title_vi, image, sort_order, status |
| lessons | Bài học | unit_id, title, kind (lesson, unit_test, level_test, review), sort_order, minutes, status |
| lesson_steps | Các bước trong bài | lesson_id, sort_order, activity_type, question_id hoặc word_id hoặc grammar_point_id, config (JSON) |

**Nội dung**

| Bảng | Dùng để | Cột chính |
|---|---|---|
| word_questions | Nhánh câu hỏi Khám phá từ (8.27) | word_id, sort_order, kind, question_en, question_vi, answers (JSON), distractors (JSON), status |
| word_readings | Đoạn văn đọc to có dịch của Khám phá từ và Họ vần | owner_type (word, family), owner_id, sentences (JSON: en, vi), audio, status |
| word_families, word_family_members | Họ vần (8.28), họ từ gốc ở GĐ3 | pattern, kind (rhyme, root), sound_ipa, level_id, status / family_id, word_id, same_sound, sort_order |
| stories, story_pages | Truyện tranh đọc to (8.6) | level_id, unit_id, title, title_vi, cover, new_words (JSON), status, sort_order / story_id, sort_order, kind (page, question), image, sentences (JSON: en, vi), audio, question_id |
| phonics_sounds | Âm phonics (8.5) | grapheme, kind (single, consonant_digraph, vowel_digraph), ipa, examples (JSON), audio, sort_order, status |
| words | Từ vựng | word, ipa, part_of_speech, meaning_vi, example_en, example_vi, image, audio, example_audio, level_id, extra (JSON: họ từ, cụm từ đi kèm) |
| topics, word_topic | Chủ đề từ vựng (một từ có thể thuộc nhiều chủ đề) | name, name_vi / word_id, topic_id |
| grammar_points | Chủ điểm ngữ pháp | level_id, title, title_vi, content, formula, examples (JSON), sort_order |
| questions | Ngân hàng câu hỏi | type, prompt (JSON: chữ, hình, âm thanh), options (JSON), answer (JSON, cho phép nhiều đáp án đúng), explanation, level_id, skill, grammar_point_id, difficulty, status |
| textbook_units | Unit trong SGK | textbook, grade, unit_number, title |
| textbook_unit_links | Gắn từ, câu hỏi, ngữ pháp, bài học vào Unit SGK | textbook_unit_id, linkable_type, linkable_id |
| exams | Đề thi | title, kind (placement, unit_test, level_test, school_test, grade10_mock, cambridge), level_id, grade, duration_minutes, pass_percent, matrix (JSON) |
| exam_questions | Câu hỏi trong đề | exam_id, question_id, sort_order, points |
| media | Thư viện hình và âm thanh | path, type, size, alt |

**Kết quả học**

| Bảng | Dùng để | Cột chính |
|---|---|---|
| lesson_progress | Kết quả tốt nhất của mỗi bài | learner_id, lesson_id, best_stars, attempts, completed_at |
| lesson_attempts | Từng lần học một bài | learner_id, lesson_id, started_at, finished_at, correct, wrong, stars, xp, coins |
| answer_logs | Từng câu trả lời, dùng để thống kê kỹ năng và tìm từ hay sai | learner_id, question_id hoặc word_id, source (lesson, review, exam), attempt_id, is_correct, answer (JSON), time_ms |
| review_cards | Thẻ ôn tập lặp lại | learner_id, word_id hoặc question_id, box (1–5), due_on, correct_count, wrong_count, last_reviewed_at |
| exam_attempts | Bài thi đã làm hoặc đang làm dở | learner_id, exam_id, started_at, submitted_at, status, score, answers (JSON) |
| writings | Bài viết | learner_id, question_id, text, word_count, auto_score, parent_score, parent_comment, ai_feedback (JSON) |
| recordings | Bản ghi âm | learner_id, question_id hoặc word_id, file_path, score, transcript |
| game_records | Thành tích mini game, dùng cho "xe ma" của Đua xe | learner_id, game, lesson_id, correct, total, sequence (JSON: đúng/sai từng lượt), played_at |
| manual_unlocks | Bố mẹ mở khóa thủ công | learner_id, target_type (level, unit, lesson), target_id, unlocked_by, created_at |
| study_sessions | Phiên học, để tính phút học và giới hạn giờ | learner_id, started_at, ended_at, minutes |
| school_tests | Lịch kiểm tra ở trường | learner_id, test_date, textbook_unit_ids (JSON), note |

**Phần thưởng**

| Bảng | Dùng để | Cột chính |
|---|---|---|
| rewards | Danh mục phần thưởng | type (sticker, badge, room_item, avatar_frame, theme, title), name, image, price, condition (JSON), for_stage |
| learner_rewards | Phần thưởng bé đã có | learner_id, reward_id, acquired_at, equipped, position (JSON, vị trí đồ trong phòng) |

---

## Phần H. Công nghệ, chạy trên máy với XAMPP, đưa lên hosting

### H1. Công nghệ

Dự án dùng cùng bộ công nghệ với dự án Covet, để tận dụng kinh nghiệm, quy trình task và CLAUDE.md đã có (bản đã chỉnh cho dự án này: `thiet-lap/CLAUDE.md`).

| Phần | Lựa chọn | Ghi chú |
|---|---|---|
| Khung web | Next.js (App Router) + TypeScript | Giao diện và máy chủ nằm trong cùng một dự án. |
| Giao diện | Tailwind CSS, design token theo 2 bộ giao diện | Chuyển từ bản tải về của Claude Design theo quy tắc trong CLAUDE.md. |
| Cơ sở dữ liệu | MySQL qua Prisma | Trên máy dùng MySQL (MariaDB) của XAMPP. Prisma Migrate tạo bảng giống nhau trên máy và trên hosting. |
| Đăng nhập | NextAuth v5 (Credentials, JWT) + bcryptjs | Tài khoản gia đình, PIN bố mẹ, PIN hồ sơ. |
| Kiểm tra dữ liệu | Zod | Dùng chung giữa máy chủ và trình duyệt. |
| Hình và âm thanh | Nội dung mẫu để trong `public/media/`. File tải lên từ khu quản trị và bản ghi âm lưu ngoài `public/`, trả về qua API có kiểm tra quyền | Next.js chỉ phục vụ những file có trong `public/` lúc build. |
| Giọng đọc | Tạo sẵn tệp mp3 bằng dịch vụ đọc văn bản (TTS) lúc soạn nội dung. Giọng có sẵn của trình duyệt làm dự phòng | Giọng ổn định, tải nhanh. |
| Nhận diện giọng nói | Có sẵn trong Chrome và Edge | Miễn phí, cần có mạng. |
| Nhập Excel | Một thư viện đọc tệp Excel | Hỏi bố/mẹ trước khi cài, theo quy tắc trong CLAUDE.md. |
| AI [GĐ4] | Gọi Claude API từ phía máy chủ | Khóa API không lộ ra trình duyệt. |

### H2. Chạy trên máy với XAMPP

Các bước giống dự án Covet, chỉ khác tên cơ sở dữ liệu.

1. Mở XAMPP Control Panel, bật **MySQL** (bật thêm **Apache** nếu muốn dùng phpMyAdmin).
2. Mở `http://localhost/phpmyadmin`, tạo cơ sở dữ liệu `hoc_tieng_anh` với bảng mã `utf8mb4_unicode_ci`.
3. Trong thư mục dự án, chạy `npm install`. Sao chép `.env.example` thành `.env` rồi điền:
   ```
   DATABASE_URL="mysql://root@localhost:3306/hoc_tieng_anh"
   AUTH_SECRET="<chuỗi ngẫu nhiên, tạo bằng lệnh npx auth secret>"
   ```
   XAMPP mặc định dùng tài khoản `root` không có mật khẩu.
4. Chạy `npx prisma migrate dev` để tạo bảng, rồi `npx prisma db seed` để nạp nội dung mẫu.
5. Chạy `npm run dev` rồi mở `http://localhost:3000`.

### H3. Đưa lên hosting

Next.js cần máy chủ chạy được **Node.js**. Gói hosting chỉ có PHP + MySQL thì không chạy được, nên khi chọn hosting cần hỏi rõ điểm này.

| Cách | Hợp khi | Lưu ý |
|---|---|---|
| **VPS** (khuyên dùng) | Muốn chủ động, chi phí vừa phải | Cài Node.js và MySQL, chạy web bằng PM2, dùng Nginx làm cổng vào và bật HTTPS. |
| **Hosting cPanel có "Setup Node.js App"** | Đã quen cPanel | Hỏi nhà cung cấp gói đó có chạy được Node.js không. |
| **Vercel + MySQL ở nơi khác** | Muốn đưa lên nhanh | MySQL phải cho kết nối từ xa. File tải lên và bản ghi âm cần thêm dịch vụ lưu file riêng. |

**Các bước (VPS hoặc cPanel):**
1. Tạo cơ sở dữ liệu MySQL trên hosting với bảng mã `utf8mb4_unicode_ci`.
2. Đưa mã nguồn lên và tạo tệp `.env` trên hosting: `DATABASE_URL` mới, `AUTH_SECRET` mới, và `AUTH_TRUST_HOST=true` nếu web chạy sau Nginx.
3. Đưa dữ liệu lên, chọn một trong hai cách:
   - Chỉ cần bảng và nội dung mẫu: chạy `npx prisma migrate deploy` rồi `npx prisma db seed`.
   - Muốn mang theo cả tiến độ học của bé: xuất toàn bộ cơ sở dữ liệu từ phpMyAdmin trên máy (Export) rồi nhập vào hosting (Import). Bản xuất đã có lịch sử migration nên không cần chạy lại.
4. Sao chép thư mục file tải lên (hình, âm thanh, bản ghi âm).
5. Chạy `npm run build` rồi `npm start` (trên VPS thì chạy qua PM2), và bật HTTPS. Bản ghi âm và bài viết của bé chỉ tài khoản gia đình xem được.

Prisma dùng một schema chung cho MariaDB và MySQL, nên chuyển từ XAMPP sang hosting không phải sửa code.

### H4. Quy trình làm việc

1. Dán **Prompt 1** (Phần J) vào Claude Design để có hệ thống giao diện và các màn Tiểu học. Sau đó dùng **Prompt 2** (THCS) và **Prompt 3** (bố mẹ và quản trị).
2. Chép các tệp thiết kế đã tải về (`designs-claude/project/`) vào thư mục `designs/` của dự án, và `thiet-lap/DESIGN_SYSTEM.md` vào `docs/`.
3. Tạo dự án mới:
   - Đặt `thiet-lap/CLAUDE.md` vào thư mục gốc của dự án.
   - Chép tệp đặc tả này vào `docs/PRD.md`.
   - Chép từ Covet: `docs/tasks/_template/`, `docs/tasks/README.md` (xóa các dòng task cũ), script tạo dashboard và dòng `tasks:dashboard` trong `package.json`.
4. Tạo các task GĐ1 rồi làm lần lượt theo quy trình trong CLAUDE.md. Mình có thể làm trực tiếp trong thư mục dự án trên máy của bố/mẹ (bố/mẹ sẽ được hỏi cho phép) hoặc qua GitHub. Nội dung cấp 1–2 sẽ được soạn sẵn để nạp vào seed hoặc nhập bằng Excel.
5. Cho bé dùng thử, góp ý, rồi làm tiếp các giai đoạn sau.

---

## Phần I. Giai đoạn xây dựng

| GĐ | Nội dung | Kết quả |
|---|---|---|
| **1. Nền tảng** | Đăng nhập, hồ sơ, bài xếp lớp, khung đủ 10 cấp (nội dung cấp 1–2), 4 dạng bài cơ bản và game lật thẻ, ôn tập lặp lại, sổ từ, khu bố mẹ (tổng quan, cài đặt), quản trị nội dung cơ bản với nhập Excel | Bé dùng được hằng ngày, bố/mẹ tự thêm được nội dung |
| **2. Hấp dẫn, trọn tiểu học** | Bộ sưu tập, phòng của linh vật, các mini game, phonics, truyện, luyện nói, chính tả, nội dung cấp 3–5, bài thi lên cấp | Trọn bộ tiểu học |
| **3. THCS** | Giao diện THCS, nội dung cấp 6–8, các dạng bài THCS, thư viện ngữ pháp, học theo SGK, đề kiểm tra, tạo đề trong quản trị, lịch kiểm tra, báo cáo chi tiết | Dùng được suốt lớp 6–8 |
| **4. Nâng cao** | Nội dung cấp 9–10, thi thử vào 10, đề làm quen A2 Key và B1 Preliminary, AI chấm viết, nói và trò chuyện, trợ lý AI soạn nội dung | Luyện thi, luyện viết và nói |

- GĐ2 chia thành task 13–28 (09/10/2026): 13 bộ thành phần GĐ2, 14 giọng đọc mp3 và âm phonics, 15 dạng bài ghép âm, sắp xếp câu, nghe gõ, điền từ, 16 truyện và đọc hiểu ngắn, 17 luyện nói, 18 mini game, 19 nội dung dạng bài mới cấp 1–4, 20 trận trùm và bài thi lên cấp, 21 bộ sưu tập, 22 phòng của tớ và cửa hàng, 23 sổ từ bổ sung và in, 24 khu bố mẹ GĐ2, 25 Khám phá từ, 26 Họ vần và Ghép chữ đầu, 27 nội dung Khám phá từ và Họ vần, 28 nội dung cấp 5.

- Có thể đưa lên hosting bất kỳ lúc nào sau GĐ1.
- Nếu bé đang học lớp cao hơn, mình sẽ đưa nội dung cấp của bé lên làm trước.

---

## Phần J. Đoạn mô tả cho Claude Design

Nên dùng lần lượt từng prompt trong cùng một dự án Claude Design. Prompt 1 tạo hệ thống giao diện chung, hai prompt sau dùng lại hệ thống đó.

### Prompt 1: Hệ thống giao diện và bộ Tiểu học

```text
Thiết kế giao diện web học tiếng Anh cho học sinh từ lớp 1 đến lớp 9, chạy chủ yếu trên trình duyệt máy tính (laptop, PC, dùng chuột và bàn phím). Khung thiết kế 1440×900. Các màn bài học phải vừa màn 1366×768 mà không cần cuộn. Trên màn 1920×1080, nội dung căn giữa. Web có 2 bộ giao diện dùng chung chức năng: Tiểu học (cấp 1–5) và THCS (cấp 6–10). Lần này hãy thiết kế hệ thống giao diện chung và bộ Tiểu học.

Hệ thống giao diện chung: bảng màu, trong đó mỗi cấp trong 10 cấp có một màu chủ đạo; màu phản hồi (đúng là xanh lá, chưa đúng là cam nhẹ, không dùng đỏ gắt); kiểu chữ hiển thị tốt tiếng Việt; nút ở các trạng thái thường, rê chuột, nhấn, vô hiệu; thẻ; thanh tiến độ; hộp thoại; dải phản hồi đúng/sai trượt lên từ dưới; nhãn phím tắt nhỏ trên đáp án (1–4, Enter, Space).

Bộ Tiểu học: phong cách hoạt hình vui tươi, tròn trịa, màu sáng, ít chữ, nhiều hình, font tròn (Nunito hoặc Baloo 2). Linh vật đồng hành là một chú rồng con với các biểu cảm: chào, vui mừng, động viên, suy nghĩ, ngủ, chúc mừng. Hướng dẫn bằng tiếng Việt, nội dung học bằng tiếng Anh, mọi từ tiếng Anh đều có nút loa để nghe.

Các màn hình:
1. Đăng nhập tài khoản gia đình, và màn chọn hồ sơ: thẻ từng bé (ảnh, tên, cấp), nút thêm hồ sơ, nút "Bố mẹ" có ổ khóa ở góc.
2. Tạo hồ sơ 3 bước: nhập tên và lớp đang học; chọn linh vật; kiểm tra loa và micro.
3. Trang chủ: linh vật ở giữa; thẻ "Nhiệm vụ hôm nay" gồm Ôn tập và Bài tiếp theo; thanh trên cùng có sao, xu, chuỗi ngày học; 4 nút lớn: Bản đồ, Sổ từ, Bộ sưu tập, Phòng của tớ.
4. Tổng quan 10 cấp: một con đường lớn đi qua 10 cấp. 5 cấp tiểu học là các hòn đảo (Hạt giống, Mầm non, Lá xanh, Cành cây, Cây lớn), 5 cấp THCS là các thành phố (Singapore, Sydney, London, New York, Toronto). Đánh dấu vị trí hiện tại, cấp đã qua và cấp còn khóa.
5. Bản đồ đảo Hạt giống: các vùng đất theo chủ đề, mỗi vùng là một con đường gồm các chặng bài (khóa, đang học, đã xong 1–3 sao) và một trận trùm ở cuối vùng.
6. Bài học "Nghe và chọn hình": thanh tiến độ, nút thoát, loa lớn, 4 hình đáp án có nhãn phím 1–4, các nút Nghe lại, Gợi ý, Kiểm tra, và dải phản hồi.
7. Bài học "Thẻ từ": hình lớn, từ tiếng Anh, câu ví dụ, nút nghe, lật thẻ xem nghĩa, mũi tên chuyển thẻ.
8. Bài học "Nối từ với hình", kéo thả bằng chuột.
9. Mini game "Lật thẻ ghép cặp" và "Mưa từ vựng" (từ rơi xuống, bé gõ đúng chính tả để phá).
10. Kết thúc bài: linh vật chúc mừng, 3 ngôi sao, số xu nhận được, danh sách từ vừa học, nút Bài tiếp theo và Về bản đồ.
11. Sổ từ: lưới thẻ từ có viền màu theo 5 mức độ thuộc, bộ lọc theo chủ đề.
12. Hết giờ học: linh vật đi ngủ và hẹn bé ngày mai.

Làm sai không bao giờ bị phạt: linh vật động viên và cho làm lại. Làm đúng thì có hiệu ứng sao bay.

Yêu cầu thêm: mọi màn có dữ liệu thiết kế đủ 4 trạng thái (bình thường, đang tải dạng khung xương, trống, lỗi có nút thử lại). Có viền focus rõ khi dùng phím Tab. Dùng nội dung thật (từ tiếng Anh thật như cat, dog, apple), không dùng lorem ipsum. Mọi màu, cỡ chữ, bo góc, bóng đổ, khoảng cách đặt tên thành token, và có một trang tổng hợp hệ thống giao diện liệt kê các token đó.
```

### Prompt 2: Bộ giao diện THCS

```text
Tiếp tục dự án web học tiếng Anh này. Hãy thiết kế bộ giao diện THCS (cấp 6–10, học sinh 11–15 tuổi), dùng chung hệ thống giao diện đã có. Phong cách hiện đại, gọn gàng như app học tập cho tuổi teen, có chế độ sáng và tối, font Be Vietnam Pro hoặc Inter. Chú rồng linh vật giờ đã lớn hơn và chỉ xuất hiện nhỏ ở góc. Điều hướng bằng thanh menu bên trái: Trang chủ, Lộ trình, Học theo SGK, Ngữ pháp, Luyện thi, Ôn tập, Sổ từ, Thành tích. Phần thưởng là điểm kinh nghiệm (XP), huy hiệu và danh hiệu.

Các màn hình:
1. Trang chủ: mục tiêu hôm nay dạng vòng tiến độ XP, nút Học tiếp, ôn tập đến hạn, mục "Điểm yếu cần ôn", lịch kiểm tra sắp tới ở trường, chuỗi ngày, XP trong tuần.
2. Bản đồ cấp 8 London: các chủ đề là địa danh trên bản đồ thành phố, mỗi chủ đề hiện % hoàn thành và bài kiểm tra chủ đề; góc "Bạn có biết?" về văn hóa Anh.
3. Bài giảng ngữ pháp: khung công thức, giải thích bằng tiếng Việt, ví dụ có nút nghe, mẹo nhớ, lỗi hay gặp, 3 câu kiểm tra nhanh.
4. Câu trắc nghiệm A/B/C/D có nhãn phím, sau khi trả lời thì hiện giải thích.
5. Bài phát âm và trọng âm: 4 từ có phần gạch chân hoặc được chia âm tiết, bấm để nghe từng từ.
6. Viết lại câu không đổi nghĩa: câu gốc, phần đầu của câu mới, ô để gõ.
7. Đọc hiểu 2 cột: đoạn văn bên trái, câu hỏi bên phải, bấm vào từ để tra nghĩa.
8. Viết đoạn văn: đề bài, gợi ý ý, ô viết có đếm từ (80–120 từ), khu vực nhận xét.
9. Học theo SGK: chọn lớp, lưới Unit có % hoàn thành, trang Unit có 4 tab Từ vựng, Ngữ pháp, Luyện tập, Kiểm tra.
10. Làm bài thi: đồng hồ đếm ngược, bảng số câu (đã làm, chưa làm, đánh dấu xem lại), nút nộp bài.
11. Kết quả thi: điểm thang 10, phân tích theo dạng bài, đúng/sai từng câu kèm giải thích, nút "Ôn lại câu sai".
12. Thành tích: huy hiệu, danh hiệu theo cấp, biểu đồ XP theo tuần, kỷ lục cá nhân.
```

### Prompt 3: Khu vực bố mẹ và quản trị nội dung

```text
Tiếp tục dự án web học tiếng Anh này. Hãy thiết kế khu vực dành cho người lớn, gồm khu bố mẹ và khu quản trị nội dung. Phong cách bảng điều khiển gọn gàng, màu trung tính, nhiều số liệu, dùng chung hệ thống giao diện, font Be Vietnam Pro hoặc Inter, tối ưu cho màn hình máy tính.

Khu bố mẹ:
1. Cổng vào bằng mật khẩu hoặc mã PIN.
2. Tổng quan theo từng con: phút học trong tuần, chuỗi ngày, số từ đã thuộc, cấp hiện tại và % hoàn thành, trình độ ước lượng (A1/A2/B1), biểu đồ phút học 7 ngày và 30 ngày, hoạt động gần đây.
3. Kỹ năng: biểu đồ Nghe, Nói, Đọc, Viết, Từ vựng, Ngữ pháp; danh sách từ hay sai; bảng chủ điểm ngữ pháp mạnh và yếu.
4. Kết quả thi: biểu đồ điểm theo thời gian, xem lại bài làm.
5. Bài viết và ghi âm của con: nghe, đọc, chấm điểm, để lại nhận xét.
6. Lịch kiểm tra ở trường: thêm ngày kiểm tra và các Unit cần ôn.
7. Cài đặt: giới hạn thời gian và khung giờ học, giao diện Tiểu học/THCS/tự động, giọng đọc Anh hoặc Mỹ và tốc độ, quản lý hồ sơ, mật khẩu và PIN.

Khu quản trị nội dung:
8. Bảng điều khiển: số từ, bài học, câu hỏi theo từng cấp; cảnh báo nội dung còn thiếu.
9. Cấu trúc lộ trình dạng cây Chặng → Cấp → Chủ đề → Bài học, kéo thả để sắp xếp, trạng thái Nháp/Xuất bản.
10. Ngân hàng từ vựng: bảng có tìm kiếm và bộ lọc; biểu mẫu từ gồm từ, phiên âm, loại từ, nghĩa, câu ví dụ, hình, âm thanh và nút tạo giọng đọc.
11. Ngân hàng câu hỏi: bộ lọc theo dạng bài, cấp, kỹ năng, độ khó; biểu mẫu thay đổi theo dạng bài; nút xem trước như học sinh.
12. Tạo đề thi theo ma trận: số câu mỗi dạng, độ khó, thời gian.
13. Nhập Excel: tải tệp mẫu, xem trước và báo lỗi từng dòng trước khi lưu.
```

### Prompt 4: Bổ sung GĐ1 (màn Tiểu học còn thiếu, nhập chủ đề bằng Excel)

Dùng sau Prompt 3, trong cùng dự án. Bổ sung những màn GĐ1 mà Prompt 1 chưa có, và phần nhập chủ đề mới, khung chương trình trong khu quản trị.

```text
Tiếp tục hệ thống giao diện "Học cùng Bông" đã có trong dự án này. Hãy bổ sung các màn còn thiếu cho giai đoạn đầu, gồm phần A cho bộ Tiểu học và phần B cho khu quản trị nội dung. Mỗi phần dùng đúng phong cách và thành phần đã có của khu đó. Thêm vào cùng thư viện, cùng cách xem trước như các màn đã có, không sửa các màn đã có.

A. Bộ Tiểu học (phong cách vui tươi, có rồng Bông):
1. Bài xếp lớp, gồm 3 màn. Màn giới thiệu: rồng Bông chào và rủ bé "Mình cùng chơi vài câu để biết cậu bắt đầu từ đâu nhé!", nút Bắt đầu và nút "Bỏ qua, bắt đầu theo lớp". Màn câu hỏi: dạng nghe và chọn hình, không hiện đúng hay sai sau mỗi câu, thanh tiến độ dạng 12 ngôi sao nhỏ. Màn kết quả: cấp đề xuất (ví dụ "Cấp 2 · Mầm non"), một nhận xét ngắn, nút "Bắt đầu học" và nút "Chọn cấp khác".
2. Bài học "Chọn từ đúng cho hình": một hình lớn, 3 thẻ chữ có nhãn phím 1–3, bấm vào chữ để nghe đọc, cùng khung bài học và dải phản hồi như màn "Nghe và chọn hình".
3. Ôn tập hôm nay, gồm 2 màn. Màn bắt đầu: số từ đến hạn ôn, 5 hộp ghi nhớ hiện bằng màu theo mức thuộc, nút Bắt đầu ôn. Màn tổng kết: "Hôm nay cậu đã ôn 12 từ, 3 từ được chuyển lên hộp vàng!", phần thưởng sao và xu, nút Về trang chủ.
4. Hộp thoại "Dừng bài học?" khi bấm thoát giữa bài: rồng Bông hơi buồn, nút "Học tiếp" (nút chính) và "Dừng lại".
5. Màn "Sắp có" cho các nút chưa làm như Bộ sưu tập, Phòng của tớ: rồng Bông đang xây dựng, lời nhắn ngắn và nút Về trang chủ.

B. Khu quản trị nội dung (người quản trị là phụ huynh, không phải giáo viên):
6. Nhập chủ đề mới bằng Excel (thêm vào màn Nhập và xuất Excel đã có): nút tải tệp mẫu "Chủ đề mới" gồm 2 trang (Chủ đề: cấp, tên tiếng Anh, tên tiếng Việt; Từ vựng: từ, phiên âm, loại từ, nghĩa, câu ví dụ tiếng Anh, câu ví dụ tiếng Việt). Sau khi chọn tệp: bảng xem trước báo lỗi từng dòng, nhãn cảnh báo "Từ đã có" và "Chưa có hình"; tùy chọn "Tự tạo bài học" (số từ mỗi bài 5–8) kèm danh sách các bài sẽ được tạo; nút "Nhập" (lưu dạng Nháp), chỉ bật khi hết lỗi.
7. Khung chương trình trong cây lộ trình đã có: chủ đề có sẵn trong khung mà chưa có bài hiện nhãn "Chưa có bài" (màu trung tính, khác Nháp và Xuất bản) kèm số từ mục tiêu; bấm vào thì mở bảng danh sách từ mục tiêu, có nút "Xuất Excel để điền" và "Nhập Excel". Ví dụ cấp 5 · Cây lớn: "Holidays and travel" (42 từ mục tiêu), "Feelings" (35 từ).
Ngoài ra, trên Bảng điều khiển quản trị đã có, thêm thẻ "Chủ đề chưa có bài" theo từng cấp.

Yêu cầu thêm: mọi màn có dữ liệu thiết kế đủ 4 trạng thái (bình thường, đang tải dạng khung xương, trống, lỗi có nút thử lại). Có viền focus rõ khi dùng phím Tab. Dùng nội dung thật (cat, dog, apple…), không dùng lorem ipsum. Mọi giá trị mới đều đặt tên thành token và có trong trang tổng hợp hệ thống giao diện.
```

### Prompt 5A: GĐ2 Tiểu học, dạng bài mới, trò chơi, trận trùm, bài thi lên cấp

Dùng sau Prompt 4, trong cùng dự án. Chạy 5A xong rồi mới chạy 5B. Bảng đối chiếu từng mục GĐ2: `y-tuong/doi-chieu-prompt-dac-ta.md`.

```text
Tiếp tục hệ thống giao diện "Học cùng Bông" đã có trong dự án này. Lần này hãy thiết kế giai đoạn 2 cho bộ Tiểu học (cấp 1–5): 7 dạng bài mới, 3 mini game, trận trùm cuối vùng và bài thi lên cấp. Dùng đúng phong cách, token và thành phần đã có của bộ Tiểu học (lớp `b-`, rồng Bông, khung bài học của màn "Nghe và chọn hình", dải phản hồi, nhãn phím, nút loa). Thêm vào cùng thư viện, cùng cách xem trước. KHÔNG sửa các màn đã có; khi cần một biến thể của màn cũ thì tạo màn mới.

Đặt đúng tên thành phần như trong ngoặc ở mỗi mục để đối chiếu với code.

Quy tắc chung cho mọi dạng bài và trò chơi bên dưới:
- Đặt trong khung bài học đã có: nút thoát (mở hộp thoại "Dừng bài học?" đã có), thanh tiến độ, chân bài có Nghe lại (Space), Gợi ý (H), Kiểm tra hoặc Tiếp tục (Enter).
- Đúng: hiệu ứng xanh, sao bay vào thanh tiến độ. Chưa đúng: cam nhẹ, rồng Bông động viên, cho làm lại; sai 2 lần tự bật gợi ý. Không bao giờ có màn thua, không trừ điểm, không đếm ngược.
- Mọi từ và câu tiếng Anh có nút loa. Làm được hoàn toàn bằng bàn phím và bằng chuột.
- Vừa màn 1366×768 không cuộn; xem được ở 1440×900 và 1920×1080.
- Đủ 4 trạng thái dữ liệu: bình thường, đang tải (khung xương), trống, lỗi có nút Thử lại.

A. Dạng bài mới
1. Ghép âm phonics (Screen23-Phonics): hình lớn (ví dụ con mèo), các ô chữ rời c, a, t xáo trộn và các ô trống theo số chữ cái. Bấm ô chữ để nghe âm của chữ đó (/k/, /æ/, /t/). Kéo ô chữ vào ô trống theo thứ tự, hoặc dùng phím chữ cái để điền. Ghép xong thì Bông đọc âm nối dần rồi đọc cả từ, các ô sáng lên theo. Ví dụ thêm: dog, sun, fish (ô "sh" là một ô ghép).
2. Truyện tranh có đọc to (Screen24-Story): mỗi trang một tranh lớn và 1–2 câu. Giọng đọc chạy, từng chữ sáng lên theo giọng đọc. Bấm từ bất kỳ để nghe riêng từ đó kèm nghĩa ngắn. Nút trang trước, trang sau (← →), Đọc lại trang, Tự đọc / Đọc cho tớ nghe. Có trang câu hỏi xen giữa truyện (chọn hình hoặc chọn câu đúng). Trang cuối: "Hết truyện", danh sách từ mới trong truyện có loa. Truyện mẫu: "Tom's Red Kite" 6 trang, cấp 3.
3. Luyện nói từ và câu (Screen25-Speak): hình, từ hoặc câu mẫu ("I like apples."), nút nghe mẫu, nút micro lớn (phím R). Thiết kế đủ các bước: sẵn sàng; đang ghi âm (sóng âm, vạch thời lượng đầy dần tối đa 10 giây, bấm lại hoặc R để dừng); đang chấm; kết quả 1–3 sao chấm dễ tính, câu khen của Bông, nút Nghe giọng tớ và Nghe giọng mẫu, Nói lại, Tiếp tục. Thêm 2 trạng thái riêng: trình duyệt chưa cho dùng micro (hướng dẫn bố mẹ bấm Cho phép + Thử lại) và máy không có micro (thông báo nhẹ, bài được thay bằng câu nghe và chọn, nút Tiếp tục).
4. Sắp xếp từ thành câu (Screen26-SentenceOrder): hình gợi ý, các thẻ từ xáo trộn, hàng ô để kéo vào cho thành câu ("She / is / reading / a / book"). Bấm thẻ để chuyển xuống hàng, bấm lại để trả lên; phím 1–9 chọn thẻ, Backspace bỏ thẻ cuối. Đúng thì đọc cả câu.
5. Nghe và gõ (Screen27-Dictation): loa lớn đọc từ hoặc câu ngắn, ô gõ chữ to bằng bàn phím thật, mỗi chữ cái một ô cho từ ngắn, một dòng cho câu. Gợi ý: hiện chữ cái đầu, rồi phát chậm. Chưa đúng: tô cam chữ cái sai, giữ phần đúng.
6. Điền từ vào câu (Screen28-FillBlank): câu có 1 ô trống kèm hình ("The cat is ___ the box."), 3–4 thẻ từ có nhãn phím để kéo vào ô hoặc gõ thẳng vào ô.
7. Đọc hiểu ngắn (Screen29-ShortReading): đoạn 3–6 câu có hình minh họa, nút nghe cả đoạn, bấm từ để nghe; bên cạnh là 2–3 câu hỏi chọn đáp án có nhãn phím; câu hỏi đã trả lời hiện dấu tick.

B. Mini game (đều là một bước trong bài học)
Mỗi game có: lớp phủ bắt đầu (1 dòng cách chơi có hình, nút Bắt đầu, Enter), tạm dừng bằng Esc hoặc nút ⏸ (Chơi tiếp, Thoát), bảng kết thúc (số từ đúng, sao, nút Tiếp tục). Không đếm ngược, không mất mạng.
8. Bong bóng từ vựng (Screen30-Bubbles): nghe một từ, các bong bóng chứa hình bay lên chậm; bấm đúng bong bóng (hoặc phím số in trên bong bóng) để nổ. Bong bóng bay mất thì sẽ bay lại sau.
9. Đập chuột chữ cái (Screen31-WhackLetters): lưới 3×3 hang, chuột chui lên mang chữ cái hoặc hình; Bông đọc một âm, bé đập đúng con bằng chuột hoặc phím 1–9 (bố trí như bàn phím số). Đập sai thì chuột lè lưỡi vui, không trừ điểm.
10. Đua xe trả lời (Screen32-Race): đường đua ngang, xe của bé và "xe ma" mờ (thành tích lần trước của chính bé). Câu hỏi ở trên với 3–4 đáp án có nhãn phím; mỗi câu đúng xe chạy thêm một đoạn. Xe ma đi theo số câu đúng của lần trước sau cùng số câu, không chạy theo thời gian. Về đích: "Cậu nhanh hơn lần trước 2 câu!" hoặc lời động viên. Lần đầu chơi thì không có xe ma.

C. Trận trùm và bài thi lên cấp
11. Trận trùm cuối vùng (Screen33-Boss): màn mở đầu có "trùm" là một nhân vật dễ thương theo chủ đề vùng (ví dụ Vua Khỉ của vùng Con vật), lời thách thức vui và nút Bắt đầu. Trong trận: 5–8 câu trộn các dạng đã học, thanh "năng lượng của trùm" giảm khi bé trả lời đúng; trả lời sai chỉ cho làm lại, trùm không bao giờ thắng. Kết thúc: trùm làm bạn với bé, sao và xu, nút Về bản đồ.
12. Cổng bài thi lên cấp (LevelGate, và màn Screen34-IslandMapGate là bản đồ đảo có cổng ở cuối đảo): cổng khóa khi chưa xong mọi vùng (hiện số vùng còn lại), mở khi đã xong, bấm vào thì vào bài thi. Tạo màn mới, không sửa bản đồ đảo đã có.
13. Giới thiệu bài thi lên cấp (Screen35-LevelTestIntro): Bông nói "Thử thách lên đảo Cành cây!", thẻ thông tin (20 câu, trộn các dạng bài của cấp, không đếm giờ, cần đúng 80%), nút Bắt đầu và Để sau. Các câu hỏi dùng khung bài học, thanh tiến độ 20 chấm.
14. Đạt bài thi lên cấp (Screen36-LevelUp): màn chúc mừng lớn, rồng Bông lớn lên (trước và sau), mở đảo mới trên bản đồ, phần thưởng sao, xu, huy hiệu, nút "Đến đảo mới".
15. Chưa đạt bài thi lên cấp (Screen37-LevelTestRetry): Bông động viên, số câu đúng, 2–3 chủ đề nên ôn lại mỗi chủ đề có nút "Ôn chủ đề này", nút Thi lại sau.
16. Rồng Bông lớn lên (MascotGrowth): 5 dáng của Bông theo cấp 1–5 (Hạt giống bé xíu đến Cây lớn gần tuổi teen), cùng nét vẽ, cùng 4 màu cho bé chọn; mọi biểu cảm đã có và 2 biểu cảm bổ sung đều dùng được cho từng dáng.

Yêu cầu thêm: nội dung thật theo đúng cấp (cat, dog, apple, "She is reading a book."), không dùng lorem ipsum. Mọi giá trị mới (màu bong bóng, đường đua, hang chuột, năng lượng trùm, sóng âm ghi âm…) đều đặt tên thành token và có trong trang tổng hợp hệ thống giao diện. Viền focus rõ khi dùng Tab. Cuối cùng, liệt kê lại tên 16 thành phần vừa thêm theo đúng số thứ tự ở trên để tôi đối chiếu.
```

### Prompt 5B: GĐ2 phần thưởng, phòng của Bông, chi tiết còn thiếu, khu người lớn

Dùng sau Prompt 5A, trong cùng dự án.

```text
Tiếp tục hệ thống giao diện "Học cùng Bông" đã có trong dự án này, sau phần dạng bài và trò chơi giai đoạn 2 vừa làm. Lần này gồm 3 phần: A là phần thưởng và phòng của Bông cho bộ Tiểu học; B là các chi tiết Tiểu học còn thiếu; C là các màn người lớn cho giai đoạn 2. Mỗi phần dùng đúng phong cách và thành phần đã có của khu đó (Tiểu học: lớp `b-`, rồng Bông; người lớn: `Bong.A`, lớp `a-`, theme `thcs` sáng, không linh vật trừ màn trống). Thêm vào cùng thư viện, cùng cách xem trước. KHÔNG sửa các màn đã có; khi cần một biến thể của màn cũ thì tạo màn mới.

Đặt đúng tên thành phần như trong ngoặc ở mỗi mục để đối chiếu với code. Mọi màn có dữ liệu đủ 4 trạng thái (bình thường, đang tải dạng khung xương, trống, lỗi có nút Thử lại), xem được ở 1366×768, 1440×900 và 1920×1080, dùng được hoàn toàn bằng bàn phím.

A. Phần thưởng và Phòng của tớ (Tiểu học)
1. Bộ sưu tập, tab Sticker (Screen38-Stickers): album chia theo chủ đề (Con vật, Xe cộ, Khủng long, Trái cây…), mỗi trang một lưới ô; sticker đã có hiện màu kèm tên tiếng Anh và loa, ô chưa có hiện bóng mờ. Trên cùng: số sticker đã có trên tổng số, chuyển trang album bằng ← →.
2. Bộ sưu tập, tab Huy hiệu (Screen39-Badges): lưới huy hiệu như "7 ngày liên tiếp", "100 từ đầu tiên", "Qua đảo Hạt giống", "Thắng 5 trận trùm"; huy hiệu chưa đạt hiện mờ kèm điều kiện và thanh tiến độ (ví dụ 63/100 từ). Bấm vào huy hiệu mở thẻ chi tiết.
3. Nhận phần thưởng mới (RewardPopup): hộp thoại mở quà khi bé nhận sticker hoặc huy hiệu mới, rồng Bông chúc mừng, tên tiếng Anh có loa, số xu thưởng (huy hiệu +50 xu), nút "Cho vào bộ sưu tập".
4. Kết thúc bài có sticker bất ngờ (Screen40-LessonEndSticker): biến thể mới của màn Kết thúc bài, thêm hộp quà mở ra sticker bất ngờ. Không sửa màn Kết thúc bài cũ.
5. Phòng của tớ (Screen41-MyRoom): căn phòng nơi rồng Bông sống, nhìn chính diện. Chế độ xem và chế độ Trang trí: kéo thả đồ đạc để đặt chỗ, xoay, cất vào kho; có cách làm bằng bàn phím (Tab chọn đồ, phím mũi tên di chuyển, Delete cất đi). Bấm vào đồ vật để nghe tên tiếng Anh ("lamp", "bookshelf"). Ngăn Tủ đồ để mặc mũ, áo cho Bông. Thanh trên hiện số xu, nút Cửa hàng.
6. Cửa hàng (Screen42-Shop): 3 nhóm Nội thất, Quần áo, Mũ; thẻ món đồ có hình, tên tiếng Anh có loa, giá bằng xu, trạng thái Đã có. Hộp thoại xác nhận mua; không đủ xu thì nút mờ và Bông nói còn thiếu bao nhiêu xu, gợi ý học thêm một bài. Không có tiền thật, không có quảng cáo.
7. Trang chủ có Bông mặc đồ (Screen43-HomeDressed): biến thể của trang chủ, Bông mặc mũ áo bé đã chọn, 4 nút lớn đều dẫn tới màn thật. Kèm thẻ nổi Chuỗi ngày khi bấm vào số chuỗi ngày: 7 ngày trong tuần đánh dấu ngày đã học, "thẻ nghỉ phép" của tuần (còn hoặc đã dùng) và lời giải thích ngắn.

B. Chi tiết Tiểu học còn thiếu
8. Sổ từ bổ sung (Screen44-NotebookPlus): màn Sổ từ mới có thêm: trên cùng số từ đã gặp và số từ đã thuộc; lọc theo cấp ngoài lọc theo chủ đề; bấm thẻ thì mở thẻ phóng to (hình lớn, từ, nghĩa, câu ví dụ, nút nghe từ và nghe câu, mức thuộc); nút "In danh sách từ".
9. Bản in danh sách từ (Screen45-WordListPrint): trang khổ A4 dọc in được trắng đen: tên bé, cấp, chủ đề, bảng gồm hình nhỏ, từ, nghĩa, câu ví dụ, ô trống để bé tự viết lại từ.
10. Nút học tập trung và âm thanh (LessonTools, và màn Screen46-LessonFocus): nút toàn màn hình trên đầu khung bài học (ẩn mọi thứ ngoài bài, Esc để thoát chế độ này), nút âm thanh mở bảng nhỏ bật tắt nhạc nền và hiệu ứng âm thanh, kéo âm lượng. Screen46 là một màn bài học ở chế độ toàn màn hình có 2 nút này.
11. Chưa đến giờ học (Screen47-OutsideHours): khi bé mở web ngoài khung giờ bố mẹ cho phép: rồng Bông đang chơi ngoài vườn, lời nhắn "Giờ học của cậu bắt đầu lúc 17:00 nhé!", các ngày được học trong tuần, nút "Bố mẹ mở" (nhập PIN). Cùng họ với màn Hết giờ học nhưng ban ngày.

C. Khu người lớn
12. Tiến độ của con và mở khóa thủ công (Adult17-Progress): khu bố mẹ, chọn con ở thanh trên; cây Cấp → Chủ đề → Bài với trạng thái khóa, đang học, đã xong (số sao); bố mẹ chọn bài hoặc chủ đề để mở khóa thủ công qua hộp thoại xác nhận; có lọc và tìm.
13. Câu hỏi dạng mới (Adult18-QuestionTypes2): ngăn kéo biểu mẫu trong Ngân hàng câu hỏi cho 7 dạng: Ghép âm phonics (từ, tách thành các ô âm, chọn âm thanh cho từng ô), Luyện nói (câu mẫu, âm thanh mẫu, mức dễ tính), Sắp xếp câu (câu gốc tự tách thẻ, thêm từ nhiễu), Nghe và gõ (âm thanh, các đáp án chấp nhận), Điền từ (câu có ô trống, các thẻ từ), Đọc hiểu ngắn (đoạn văn, hình, 2–3 câu hỏi), Truyện (chọn truyện có sẵn). Mỗi dạng có báo lỗi dưới ô và nút "Xem như học sinh".
14. Soạn truyện tranh (Adult19-StoryEditor): danh sách trang bên trái (kéo thả sắp xếp, thêm, xóa qua hộp thoại); khung giữa sửa trang (tranh, 1–2 câu, âm thanh đọc, nút "Tạo giọng đọc tự động"); chèn trang câu hỏi giữa truyện; thông tin truyện (tên, cấp, chủ đề, từ mới) và Nháp/Xuất bản; nút xem trước bằng giao diện Tiểu học.
15. Âm phonics (Adult20-PhonicsSounds): bảng các âm (chữ đơn a–z, âm ghép sh, ch, th, ee, oo…) có ví dụ từ, nút nghe, tải lên hoặc tạo âm thanh, lọc âm còn thiếu âm thanh.
16. Danh mục phần thưởng (Adult21-Rewards): 3 thẻ Sticker (theo album), Huy hiệu (điều kiện chọn từ danh sách như số ngày liên tiếp, số từ đã thuộc, qua cấp, số trận trùm; kèm xu thưởng), Đồ trong phòng (nhóm, giá xu, hình). Bảng có tìm, lọc, sắp xếp, phân trang; ngăn kéo biểu mẫu; Nháp/Xuất bản.

Yêu cầu thêm: nội dung thật (cat, dog, apple, lamp, bookshelf, tên bé như "Minh, lớp 4, cấp 3 Lá xanh"), không dùng lorem ipsum. Mọi giá trị mới (màu album, khung sticker, sàn và tường phòng, giá xu, bản in…) đều đặt tên thành token và có trong trang tổng hợp hệ thống giao diện. Viền focus rõ khi dùng Tab. Cuối cùng, liệt kê lại tên 16 thành phần vừa thêm theo đúng số thứ tự ở trên để tôi đối chiếu.
```

### Prompt 5C: Khám phá từ và Họ vần (bổ sung GĐ2)

Dùng sau Prompt 5B, trong cùng dự án. Đề xuất: `y-tuong/de-xuat-kham-pha-tu-ho-van.md`.

```text
Tiếp tục hệ thống giao diện "Học cùng Bông" đã có trong dự án này, sau các màn giai đoạn 2 vừa làm. Lần này thêm 2 chức năng học từ vựng cho bộ Tiểu học: "Khám phá từ" (sơ đồ câu hỏi quanh một từ) và "Họ vần" (mạng các từ cùng vần), kèm trò "Ghép chữ đầu", phần đọc to đoạn văn có dịch nghĩa, liên kết qua lại giữa các màn này, và 2 màn quản trị để soạn nội dung. Dùng đúng phong cách, token và thành phần đã có (Tiểu học: lớp `b-`, rồng Bông, khung bài học, dải phản hồi, nhãn phím, nút loa, hình minh họa từ vựng; người lớn: `Bong.A`, lớp `a-`, theme `thcs` sáng). Thêm vào cùng thư viện, cùng cách xem trước. KHÔNG sửa các màn đã có; khi cần một biến thể của màn cũ thì tạo màn mới.

Đặt đúng tên thành phần như trong ngoặc ở mỗi mục để đối chiếu với code. Mọi màn có dữ liệu đủ 4 trạng thái (bình thường, đang tải dạng khung xương, trống, lỗi có nút Thử lại), vừa màn 1366×768 không cuộn, xem được ở 1440×900 và 1920×1080, dùng được hoàn toàn bằng bàn phím và bằng chuột. Làm sai không bị phạt, không đếm ngược. Bấm vào bất kỳ từ hay câu tiếng Anh nào cũng nghe được.

Mỗi màn học của bé (mục 1, 3, 4) có 2 cách hiện: trong khung bài học (thanh tiến độ, nút thoát mở hộp thoại "Dừng bài học?", chân bài Nghe lại · Gợi ý · Kiểm tra) và mở từ Sổ từ (chế độ tự khám phá, chỉ có nút Đóng, không tính điểm).

A. Bộ Tiểu học
1. Khám phá từ (Screen48-WordExplorer): thẻ từ lớn ở bên trái (hình, từ "bird", phiên âm, loa, câu "A bird can fly."), từ thẻ tỏa ra 6 nhánh đường cong đánh số 1–6, mỗi nhánh một câu hỏi: What's this? · What color is a bird? · What does a bird like to eat? · What does a bird have? · What can a bird do? · Where does a bird live? Thiết kế đủ các trạng thái của nhánh:
   - Chưa mở: câu hỏi và dấu "?" ở chỗ đáp án.
   - Đang hỏi: Bông đọc câu hỏi, bé đoán bằng cách chọn 1 trong 2–3 hình (phím 1–3).
   - Đã mở: đáp án là hình kèm từ hoặc cụm từ, mỗi cái có loa (brown / yellow / blue; seeds, insects, berries; wings, feathers, beak, claws; fly in the sky, build a nest; in the nest, on the tree).
   - Hoàn thành cả 6 nhánh: Bông chúc mừng, hiện khung "Đọc cả đoạn" (mục 6) gom các câu trả lời thành đoạn văn, nút "Nói theo" để nói lại 1 câu ("A bird can fly."), nút In.
   Phím 1–6 chọn nhánh, Space nghe lại câu hỏi. Ví dụ thêm: "cat" (5 nhánh) để thấy sơ đồ co giãn theo số nhánh 4–6.
2. Bản in Khám phá từ (Screen49-WordExplorerPrint): trang A4 dọc in được trắng đen, bố cục như sơ đồ: thẻ từ, 6 câu hỏi, hình và đáp án, đoạn văn tiếng Anh, thêm dòng trống để bé tự viết câu trả lời; tùy chọn in kèm bản dịch tiếng Việt.
3. Họ vần (Screen50-WordFamily): vần ở giữa ("-at" /æt/), xung quanh là các từ cùng vần: bat, cat, hat, fat, mat, flat, chat, that. Mỗi thẻ từ có hình, từ (phần vần tô cùng một màu nổi bật ở mọi từ), phiên âm, loại từ, nghĩa tiếng Việt. Bấm vào thẻ thì nghe từ. Từ bé chưa học hiện mờ với nhãn "Sắp học". Có ô riêng "Bẫy chính tả" cho từ cùng chữ nhưng khác âm (eat /iːt/, what /wɒt/), có lời giải thích ngắn của Bông. Bấm vần ở giữa để nghe lần lượt cả họ. Bên dưới có khung "Đọc cả đoạn" (mục 6) với một câu vui dùng các từ trong họ: "The fat cat sat on a mat. It has a hat." Ví dụ thứ hai: họ "-ir" /ɜː/ (bird, girl, shirt, skirt, first, third) để thấy họ theo âm.
4. Ghép chữ đầu (Screen51-BuildFamily): vần "at" cố định bên phải, hàng ô chữ đầu b, c, h, f, m, s, r, z bên trái. Kéo một chữ vào trước vần, hoặc gõ chữ đó trên bàn phím. Thành từ thật thì hình hiện ra, Bông đọc, từ bay vào danh sách "Đã tìm được". Không phải từ thật (zat) thì Bông nói nhẹ "Từ này không có trong tiếng Anh, thử chữ khác nhé". Tìm đủ 5 từ là xong, có sao. Khi mở từ một thẻ từ ở màn Họ vần, từ đó được tô sẵn là từ cần ghép đầu tiên.
5. Thẻ từ trong Sổ từ có thêm tab (Screen52-NotebookWordTabs): thẻ phóng to của Sổ từ có 3 tab Thẻ từ · Khám phá · Họ vần; tab nào chưa có dữ liệu thì ẩn. Đây là biến thể mới, không sửa màn Sổ từ đã có.
6. Đọc cả đoạn và dịch nghĩa (ReadAloudParagraph): khung đoạn văn dùng chung, đặt trong màn 1 và 3. Ví dụ với bird: "This is a bird. It is brown, yellow or blue. It likes to eat seeds, insects and berries. It has wings, feathers, a beak and claws. It can fly in the sky and build a nest. It lives in a nest on a tree."
   - Nút "Đọc cả đoạn" (phím P): giọng đọc chạy, từng chữ sáng lên theo; nút tạm dừng, đọc chậm.
   - Bấm một câu để nghe riêng câu đó. Bấm một từ để nghe từ đó và hiện nghĩa ngắn trong bong bóng nhỏ.
   - Nút "Dịch nghĩa" (phím T): mặc định ẩn bản dịch để bé tự nghe hiểu trước. Bấm thì bản dịch tiếng Việt hiện ngay dưới từng câu, chữ nhỏ hơn và màu nhạt hơn câu tiếng Anh; bấm lại để ẩn. Có thể bấm biểu tượng dịch ở đầu một câu để chỉ dịch câu đó.
   - Thiết kế 3 trạng thái: chưa dịch, đang đọc (chữ sáng theo giọng), đã dịch.
7. Liên kết qua lại (WordLinks, và màn Screen53-WordJourney cho thấy một lượt đi): dải nút liên kết ở đầu mỗi màn 1, 3, 4, chỉ hiện ở chế độ tự khám phá:
   - Ở Khám phá từ: nút "Họ vần của bird: -ir" mở màn Họ vần của từ đó, với "bird" được tô sáng trong họ. Từ không thuộc họ nào thì không hiện nút.
   - Ở Họ vần: mỗi thẻ từ có 2 nút nhỏ "Ghép" (mở Ghép chữ đầu với vần này, từ đó là từ cần ghép đầu tiên) và "Khám phá" (mở Khám phá từ, chỉ hiện khi từ có dữ liệu). Bấm vào thẻ vẫn là nghe từ.
   - Ở Ghép chữ đầu: mỗi từ trong danh sách "Đã tìm được" bấm vào thì mở Khám phá từ của từ đó (nếu có), nút "Về họ vần" quay lại.
   - Một đường dẫn nhỏ (bird › họ -ir › Ghép chữ) cho bé biết mình đang ở đâu, nút Quay lại (Backspace) về màn trước, tối đa 4 bậc. Trong khung bài học thì ẩn các liên kết để bé không rời bài giữa chừng.
   Screen53 trình bày cả lượt đi bird → họ -ir → Ghép chữ đầu → shirt → Khám phá shirt dạng các khung nối nhau.

B. Khu quản trị nội dung
8. Soạn Khám phá từ (Adult22-WordExplorerEditor): tab "Khám phá" trong ngăn kéo biểu mẫu của Ngân hàng từ vựng. Chọn bộ câu hỏi mẫu theo nhóm (Con vật, Đồ ăn, Đồ vật, Nghề nghiệp, Nơi chốn) để điền sẵn câu hỏi. Danh sách 4–6 nhánh kéo thả để sắp xếp; mỗi nhánh có câu hỏi Anh và Việt, các đáp án (chọn từ có sẵn trong kho hoặc gõ mới kèm hình), các hình nhiễu cho lúc bé đoán. Phần "Đoạn văn": nút "Ghép đoạn từ các câu trả lời", từng câu tiếng Anh kèm ô dịch tiếng Việt, âm thanh có nút "Tạo giọng đọc tự động". Cảnh báo đáp án chưa có hình hoặc âm thanh, câu chưa có bản dịch; báo lỗi dưới ô, nút "Xem như học sinh", Nháp/Xuất bản.
9. Họ vần (Adult23-WordFamilies): bảng các họ vần (vần, âm IPA, cấp, số từ, trạng thái) có tìm, lọc theo cấp, sắp xếp, phân trang. Ngăn kéo sửa một họ: vần, âm, cấp; danh sách từ thành viên lấy từ kho; nút "Gợi ý từ trong kho" liệt kê các từ có chứa vần để tick chọn; mỗi từ đánh dấu "Cùng âm" hoặc "Bẫy: khác âm"; danh sách chữ đầu không thành từ cho màn Ghép chữ đầu; đoạn văn vui của họ (từng câu Anh kèm dịch Việt, âm thanh); nút "Xem như học sinh", Nháp/Xuất bản.

Yêu cầu thêm: nội dung thật theo đúng cấp (bird, cat, bat, hat, shirt, seeds, wings…), bản dịch tiếng Việt tự nhiên cho trẻ lớp 4, không dùng lorem ipsum. Mọi giá trị mới (màu vần, đường nhánh, khung bẫy chính tả, chữ bản dịch, chữ đang đọc, dải liên kết…) đều đặt tên thành token và có trong trang tổng hợp hệ thống giao diện. Viền focus rõ khi dùng Tab. Cuối cùng, liệt kê lại tên 9 thành phần vừa thêm theo đúng số thứ tự ở trên để tôi đối chiếu.
```
