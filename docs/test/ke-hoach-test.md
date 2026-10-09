# Kế hoạch test giao diện tự động (Playwright) — task 01 đến 12

Ngày lập: 09/10/2026 · Bước 1 (khảo sát). Chưa có test nào được viết, chưa cài gì.

Tài liệu này trả lời 3 câu hỏi: màn nào cần test và test gì; dữ liệu giả nào cần dựng; chỗ nào dự án hiện tại **không cho phép test đúng như yêu cầu** để bạn quyết trước khi tôi viết.

## 1. Máy này có gì

| Thứ | Kết quả khảo sát |
|---|---|
| Trình duyệt | Chrome 155 có sẵn (`C:\Program Files\Google\Chrome`), Edge 154 cũng có. Dùng `channel: "chrome"`, không cần `playwright install`. |
| Cơ sở dữ liệu | MariaDB của XAMPP đang chạy cổng 3306. Cần database riêng `hoc_tieng_anh_test` (người dùng `root` tạo được). |
| Node | v25.2.1 (chạy trực tiếp được file TypeScript, như `prisma/seed.ts` đang làm). |
| Thư viện Excel | Dự án đã có `exceljs`, tôi dùng nó để tạo 2 tệp mẫu, **không cần hỏi cài thêm**. |
| Cần cài | Chỉ `@playwright/test` (devDependency). Hiện chưa có. Tôi chỉ cài sau khi bạn đồng ý ở Bước 2. |
| Có sẵn | `npm test` (186 test của các hàm thuần trong `src/lib/rules`). Bộ Playwright này chạy **thêm**, không thay. |

## 2. Danh sách màn, route và việc cần test

Cột "Dữ liệu" dùng mã tài khoản ở mục 4. PRD Phần B yêu cầu các màn bài học vừa 1366×768 không cuộn; màn nào thuộc nhóm đó sẽ được kiểm ở Bước 4.

### 2.1 Task 01–03: nền tảng (không phải màn nghiệp vụ)

| Task | Màn (designs/) | Route | Việc cần test | Dữ liệu |
|---|---|---|---|---|
| 01 | Bảng token | `/dev-tokens` — **chỉ chạy khi `next dev`, bản build trả 404** (xem R4) | Đọc giá trị biến CSS (`--brand`, `--level-1…10`, `--bg`…) từ trang thật và so với `docs/DESIGN_SYSTEM.md`; font Baloo 2 / Nunito được nạp (`document.fonts`); `<html data-theme="tieu-hoc">`; `data-level` đổi màu | không cần |
| 01 | (mọi trang) | tất cả route ở các bảng dưới | Không có `console.error`, không có `pageerror`, không có request lỗi 4xx/5xx ngoài dự kiến | A, admin |
| 02 | Button, KeyHint, Card, ProgressBar, Dialog, FeedbackBar, SpeakerButton, Mascot, DataStates… | `/dev/ui` — **cũng 404 trong bản build** (R4) | Không test trực tiếp trang này. Các thành phần được test **gián tiếp** qua màn thật: nút, thẻ đáp án, hộp thoại giữ focus + Esc đóng, dải phản hồi, loa có `aria-label`, rồng đứng yên khi `prefers-reduced-motion` | A |
| 03 | (không có màn) | — | Không có giao diện. "Migrate trên database trống" và "seed chạy lại không trùng" được kiểm ngay trong bước dựng test (mục 5): chạy seed 2 lần, đếm số dòng không đổi | DB test |

### 2.2 Task 04: đăng nhập, hồ sơ, PIN

| Task | Màn | Route | Việc cần test | Dữ liệu |
|---|---|---|---|---|
| 04 | Screen01-Login | `/login` | Đăng nhập đúng → `/profiles`; sai mật khẩu → báo nhẹ nhàng, không đỏ gắt; ô trống báo lỗi; "Nhớ đăng nhập"; đã đăng nhập mà gõ `/login` → về `/profiles`; 4 trạng thái | A |
| 04 | Screen01-Login (đăng ký) | `/register` | Đăng ký email mới → vào `/profiles` trống; email trùng báo lỗi; mật khẩu yếu báo lỗi | P (tạo mới trong test) |
| 04 | Đăng xuất | nút "Đăng xuất" ở `/profiles` | Đăng xuất → `/login`; gõ lại `/profiles` bị chuyển về `/login` | A |
| 04 | Screen02-Profiles | `/profiles` | Chỉ thấy bé của mình (A: 2 thẻ, không lẫn bé của B); Trống khi chưa có hồ sơ (P) + nút "+"; bấm thẻ → `/home`; skeleton khi chậm; lỗi + Thử lại | A, B, P |
| 04 | Screen03-CreateProfile | `/profiles/new` | 3 bước (tên + lớp + năm sinh → chọn rồng + đặt tên → kiểm tra loa/micro); bỏ trống tên báo lỗi; tạo bé lớp 1 và lớp 9; loa phát (giọng giả); micro giả của Chrome (cờ `--use-fake-device-for-media-stream`) để thấy thanh mức chạy; từ chối quyền micro vẫn đi tiếp; hủy (×) về `/profiles`; xong thì sang `/placement` | P |
| 04 | Dialog + PIN bố mẹ | `/parent/unlock` (đặt PIN lần đầu) | Tài khoản chưa có PIN: đặt PIN (nhập 2 lần, khác nhau thì báo); PIN lưu **dạng hash** (đọc bảng `users` xác nhận chuỗi bắt đầu `$2`, không phải số PIN) | P |
| 04 | **Chặn truy cập chéo** | `/home`, `/lesson/…`, `/review`, `/notebook`, `/parent?kid=<id bé của B>` | (1) Gia đình A mang cookie hồ sơ trỏ tới bé của B → server từ chối, về `/profiles`. (2) `?kid=<id của B>` ở trang bố mẹ → không hiện số liệu của B. (3) Chưa đăng nhập gõ thẳng mọi route được bảo vệ → `/login`. (4) Cookie hồ sơ không ký / ký sai → từ chối (xem R6) | A, B |

### 2.3 Task 05–06: nội dung, trang chủ, bản đồ

| Task | Màn | Route | Việc cần test | Dữ liệu |
|---|---|---|---|---|
| 05 | (hiển thị ở bản đồ) | `/map`, `/map/[level]`, `/levels` | Bé chỉ thấy chủ đề `published`; chủ đề Nháp ("Test draft") và chủ đề khung `planned` **không hiện**; gõ thẳng URL bài học của chủ đề Nháp → không vào được (404 hoặc về `/home`); cấp 5–10 hiện "Sắp có" | A2, chủ đề Nháp |
| 05 | Số liệu nội dung | database | Cấp 1–4 mỗi cấp có chủ đề `published`; số từ, số bài đúng seed (đếm bằng SQL, không qua giao diện) | DB test |
| 06 | Screen04-Home | `/home` | Lời chào có tên bé; thẻ "Nhiệm vụ hôm nay": Ôn tập (số từ đến hạn đúng seed) + Bài tiếp theo (đúng tên bài); Enter vào bài tiếp theo; 4 nút lớn (Bản đồ, Sổ từ, Bộ sưu tập, Phòng của tớ); số sao, xu, chuỗi ngày đúng seed; không có từ đến hạn thì ẩn nhiệm vụ Ôn tập; 4 trạng thái | A1, A2 |
| 06 | Screen05-Levels | `/levels` | 10 điểm có số và tên cấp; cấp đã qua / đang học / khóa hiển thị đúng với A2 (đang cấp 3) và A1; bấm cấp khóa không đi được | A2 |
| 06 | Screen06-IslandMap | `/map`, `/map/[level]` | Bài xong hiện số sao; bài khóa không bấm được (kể cả gõ URL); bài đang mở bấm vào → `/lesson/…`; trùm khóa đến khi xong vùng; cấp chưa có bài hiện "Sắp có" | A2 |
| 06 | Screen22-ComingSoon | `/collection`, `/room` | Hiện "Sắp có" + nút quay lại | A |

### 2.4 Task 07: bài học (phần quan trọng nhất)

| Task | Màn | Route | Việc cần test | Dữ liệu |
|---|---|---|---|---|
| 07 | Khung bài học + Screen21-ExitDialog | `/lesson/[id]` | Thanh tiến độ tăng; × hoặc **Esc** mở "Dừng bài học?" với "Học tiếp" là nút chính; Esc lần nữa đóng; "Dừng" về bản đồ; không có đồng hồ đếm ngược | A2 |
| 07 | Screen08-Flashcards (8.1) | bước thẻ từ | Space hoặc bấm để lật; ← → chuyển thẻ; loa đọc **đúng từ và câu ví dụ** (giọng giả ghi lại câu được đọc) | A2 |
| 07 | Screen07-ListenChoose (8.2) | bước nghe chọn hình | Tự đọc từ khi vào bước; phím 1–4 (và A–D) chọn; Enter kiểm tra; Space nghe lại (giọng giả ghi nhận thêm 1 lần đọc); H bỏ bớt 1 đáp án sai; đúng → dải xanh có ✓; sai → dải **cam** có ↻, không đỏ, không chữ "sai/thua/mất", cho làm lại | A2 |
| 07 | Screen09-Match (8.3) | bước nối cặp | Làm được bằng chuột (kéo thả) **và** bằng bàn phím; nối sai không phạt | A2 |
| 07 | Screen18-PickWord (8.4) | bước chọn từ đúng cho hình | Như 8.2 với 3 thẻ chữ; bấm chữ nghe đọc | A2 |
| 07 | Screen10-MemoryGame | trò lật thẻ (trận trùm) | 12 thẻ; đếm lượt, **không đồng hồ**; ghép hết thì sang bước tiếp | A2 |
| 07 | Screen12-LessonEnd | cuối bài | Sao đúng tỷ lệ (≥ 90% = 3 sao, ≥ 70% = 2 sao, còn lại 1 sao; theo bản thiết kế, khác PRD Phần F như README task đã ghi); xu theo công thức; danh sách từ vừa học bấm nghe được; kết quả lưu vào hồ sơ (tải lại `/home` thấy sao/xu tăng); lỗi lưu → nút Thử lại và **không mất kết quả**; "Bài tiếp theo" mở khi đạt ≥ 1 sao; "Làm lại" | A2 |
| 07 | Bài đang dở | `/lesson/[id]` | Rời giữa bài rồi quay lại vẫn tiếp được (`resume.ts`) | A2 |
| 07 | Phím tắt | cả bài | Làm **trọn một bài chỉ bằng bàn phím** | A2 |

Ghi chú: bài của cấp 1–4 do `lesson-builder` tạo gồm thẻ từ, nghe chọn hình, nối cặp, chọn từ đúng; trò lật thẻ nằm ở trận trùm cuối chủ đề. Nên test dùng một bài thường **và** một bài trùm.

### 2.5 Task 08–10: ôn tập, xếp lớp, giờ học

| Task | Màn | Route | Việc cần test | Dữ liệu |
|---|---|---|---|---|
| 08 | Screen19-ReviewStart | `/review` | Số từ đến hạn đúng seed; 5 hộp hiển thị đúng số từ mỗi hộp; không có từ đến hạn → màn trống; 4 trạng thái | A2 |
| 08 | Khung ôn tập | `/review` | Chỉ lấy từ **đến hạn** (từ chưa đến hạn không xuất hiện); tối đa 15 mục; trộn dạng 8.2–8.4; trả lời đúng → từ lên 1 hộp (kiểm bằng SQL), sai → về hộp 1 | A2 |
| 08 | Screen20-ReviewDone | cuối `/review` | Tổng kết: số từ ôn, số từ lên hộp, xu, sao | A2 |
| 08 | Screen13-Notebook | `/notebook` | Lưới thẻ từ; tìm; lọc theo chủ đề; mức thấp xếp trước; viền 5 mức đi kèm chấm + tên mức; bấm thẻ phóng to, nghe từ và câu ví dụ; tổng số từ đã gặp / đã thuộc; 4 trạng thái | A2 |
| 09 | Screen15/16/17 | `/placement` | Bé mới (A1): giới thiệu → 12 câu nghe chọn hình, **không hiện đúng/sai**, tiến độ 12 ngôi sao → kết quả có cấp đề xuất → về `/home`; "Chọn cấp khác" đổi được; "Bỏ qua" hỏi xác nhận cấp theo lớp; bé đã xếp lớp (A2) gõ `/placement` → về `/home` | A1, A2 |
| 10 | Screen04 thẻ "Hôm nay: x/y phút" | `/home` | Bé giới hạn 30 phút đã học 29 phút hiện đúng "29/30" | T1 |
| 10 | Screen14-TimeUp | `/time-up` | Hết giờ: mọi route của bé (`/home`, `/map`, `/lesson/…`, `/review`, `/notebook`) chuyển về `/time-up`; gõ thẳng URL bài học cũng bị chặn; chưa hết giờ gõ `/time-up` → `/home`; rồng đi ngủ + tóm tắt hôm nay; nhập PIN **đúng** → cộng giờ, vào học lại được; PIN sai báo lỗi | T1, T2 |
| 10 | Hết giờ giữa bài | `/lesson/[id]` | Còn 1 phút: đồng hồ trình duyệt tua 60 giây → server ghi 1 phút → bé làm nốt câu đang dở rồi mới chuyển màn (xem R5) | T1 |

### 2.6 Task 11: khu bố mẹ

| Task | Màn | Route | Việc cần test | Dữ liệu |
|---|---|---|---|---|
| 11 | (bộ thành phần) | `/dev/adult-kit` — **404 trong bản build** (R4) | Không test trực tiếp; test gián tiếp qua các màn thật | — |
| 11 | Adult01-Gate | `/parent/unlock` | PIN đúng vào `/parent`; PIN sai báo lỗi dưới ô + "Còn n lần"; **sai 5 lần → khóa**, tải lại trang vẫn khóa, PIN đúng cũng không vào được lúc khóa (phần "mở lại sau 5 phút": xem R1); tài khoản chưa có PIN chỉ có ô mật khẩu; đăng nhập bằng mật khẩu được; chưa mở cổng gõ `/parent` → `/parent/unlock` | K (riêng cho test khóa), A |
| 11 | Adult02-Overview | `/parent` | KPI (phút học tuần so với tuần trước, chuỗi ngày, số từ đã thuộc, cấp hiện tại + %) **khớp số liệu seed của A2**; biểu đồ 7 và 30 ngày là SVG, có đường giới hạn nét đứt, giá trị khớp seed; đổi bé ở thanh trên → số đổi theo (`?kid=`); A1 chưa học → trạng thái trống; hoạt động gần đây; 4 trạng thái | A1, A2 |
| 11 | Adult07-Settings | `/parent/settings` | 4 nhóm chuyển bằng ↑/↓; đặt giới hạn giờ → tải lại thấy giá trị mới → **bé bị áp dụng đúng**; khung giờ kết thúc trước bắt đầu báo lỗi; giọng Anh/Mỹ + tốc độ + "Nghe thử" (giọng giả nhận đúng câu mẫu); đổi tên/lớp/cấp qua hộp thoại xác nhận; đặt lại tiến độ + xóa hồ sơ phải gõ đúng tên; đổi mật khẩu, đổi PIN đúng luật | S (R8) |
| 11 | Dùng bằng bàn phím | cả khu bố mẹ | Tab đi hết, có viền focus, thao tác được không cần chuột | A |

### 2.7 Task 12: quản trị nội dung

| Task | Màn | Route | Việc cần test | Dữ liệu |
|---|---|---|---|---|
| 12 | Chặn quyền | `/admin/*` | Tài khoản `parent` đã mở cổng gõ `/admin`, `/admin/tree`, `/admin/excel`… → **404**; 4 route handler (`/admin/excel/{template,parse,export}`, `/admin/media/upload`) trả **403**; admin chưa mở cổng bố mẹ → `/profiles`; chưa đăng nhập → `/login` | A (parent), admin |
| 12 | Adult08-Dashboard | `/admin` | 4 thẻ KPI khớp SQL; biểu đồ 10 cấp đúng màu cấp; cảnh báo thiếu hình/âm thanh; "Chủ đề chưa có bài" đếm theo cấp; 4 trạng thái | admin |
| 12 | Adult09-Tree | `/admin/tree` | Mở/thu nhánh, "Mở hết/Thu gọn"; ↑/↓ đổi thứ tự bài và chủ đề, tải lại còn giữ; thêm/sửa/xóa chủ đề và bài; Nháp ↔ Xuất bản; **không xuất bản được** bài 0 bước, chủ đề trống; chủ đề khung "Chưa có bài" + số từ mục tiêu; ngăn kéo từ mục tiêu (lọc Đã có / Chưa có, tìm, phân trang) | admin |
| 12 | Adult10-Vocab | `/admin/vocab` | Tìm, lọc cấp/chủ đề/thiếu hình, sắp xếp, phân trang; thêm từ; sửa trong ngăn kéo; báo từ trùng, IPA sai dạng, câu ví dụ không chứa từ | admin |
| 12 | Adult11-Questions | `/admin/questions` | Bảng + lọc; tạo/sửa dạng 8.2, 8.3, 8.4 (8.1 thẻ từ thêm ở Soạn bài, xem mục 3); cấp 6+ bắt buộc giải thích; "Xem như học sinh" chạy câu hỏi bằng khung bài học thật, chọn đúng/sai | admin |
| 12 | Adult12-LessonBuilder | `/admin/builder`, `/admin/builder/[id]` | Danh sách bài (tìm, lọc); thêm từ, thêm câu hỏi, ↑/↓ bước, bỏ bước; thời lượng tự tính; chặn xuất bản khi < 3 bước hoặc chưa có hoạt động; Lưu; Xem trước từng bước | admin |
| 12 | Adult13-Media | `/admin/media` | Tải hình hợp lệ (SVG/PNG nhỏ) vào `storage/uploads/`, xem lại qua `/uploads/<tên>` (chưa đăng nhập → 401); tệp `.txt` đổi đuôi `.png` bị từ chối; ảnh > 2 MB bị từ chối; SVG có `onload` bị từ chối; lọc "Từ chưa có hình"; gán hình cho từ; nút tạo giọng đọc mờ "Sắp có" | admin |
| 12 | Adult14-Excel (từ vựng, câu hỏi) | `/admin/excel` | Tải tệp mẫu; chọn tệp đúng → xem trước hợp lệ → Lưu; tệp lỗi → báo từng dòng, sửa trong ô, nút Lưu chỉ bật khi hết lỗi; **tệp sai không ghi gì vào database** (đếm dòng trước/sau); xuất .xlsx và .csv theo cấp/cột | admin |
| 12 | Adult14-Excel (nhập chủ đề mới) | `/admin/excel?tab=topic` | Tệp 2 trang đúng → "Nhập" → chủ đề Nháp + bài Nháp; tệp thiếu trang "Từ vựng" → báo lỗi nói rõ trang nào; tệp sai cột/thiếu dữ liệu → lỗi từng dòng, **không ghi gì**; "Từ đã có", "Chưa có hình" là cảnh báo không chặn; "Tự tạo bài học" 5–8 từ/bài hiện danh sách bài; nhập lại cùng tệp bị chặn ("Chủ đề đã có bài") | admin |
| 12 | Cuối task | admin → bé | Nhập chủ đề cấp 5 từ Excel → xuất bản → bé gia đình A học thử bài đó | admin, A2 |

## 3. Có trong task.md nhưng chưa có / khác trong code

| Hạng mục | Tình trạng | Cách xử lý trong bộ test |
|---|---|---|
| `/dev/ui`, `/dev-tokens`, `/dev/adult-kit` | Có code, nhưng `notFound()` khi `NODE_ENV=production`. Bản `next start` trả 404. | Xem R4, cần bạn quyết. |
| Screen11-WordRain (Mưa từ vựng) | Có trong thiết kế, PRD ghi GĐ2, không thuộc task 07. Không có trong code. | Bỏ qua, ghi vào báo cáo "chưa phải GĐ1". |
| Screen22-ComingSoon | Có (`/collection`, `/room`). | Test như bình thường. |
| Thcs01–17 (bộ THCS) | Chưa làm, GĐ3. Bé lớp 6+ vẫn dùng giao diện Tiểu học. | Bỏ qua. Chỉ test rằng tạo bé lớp 9 không lỗi. |
| Adult03–06, Adult15–16 | Hiện mờ "Sắp có" trong menu (GĐ2–3). | Chỉ test nhãn "Sắp có". |
| Dạng 8.1 trong Ngân hàng câu hỏi (task 12 bước 3 ghi "4 dạng 8.1–8.4") | Code chỉ có 8.2–8.4; thẻ từ 8.1 thêm ở Soạn bài học (đã ghi ở decisions.md của task 12). | Test theo code; ghi "khác task.md" trong báo cáo. |
| Âm thanh mp3, "Tạo giọng đọc" | Cố ý để mờ "Sắp có" (GĐ2). | Chỉ test trạng thái mờ. |
| Task 03 (bảng, seed) | Không có màn. | Kiểm bằng SQL ở bước dựng database. |
| PIN hồ sơ THCS (PRD C2) | Không thấy màn nhập PIN hồ sơ trong code GĐ1; không nằm trong task.md. | Không test, ghi vào báo cáo. |
| Nút toàn màn hình khi học, nút in Sổ từ, bố mẹ mở khóa thủ công (PRD) | Không có trong task.md GĐ1. | Không test. |

## 4. Tài khoản và dữ liệu seed riêng cho test

Mật khẩu và PIN lấy từ `.env.test` (bạn tạo theo `.env.test.example`), không viết cứng trong code test. Tên dưới đây chỉ là gợi ý.

| Mã | Tài khoản | Hồ sơ bé | Mục đích |
|---|---|---|---|
| admin | Quản trị nội dung (`role=admin`), đã đặt PIN | — | Mọi test ở `/admin` |
| A | Phụ huynh A, có PIN | **A1 "Mai"**: lớp 4, mới tạo, chưa xếp lớp, chưa học gì. **A2 "Bảo"**: lớp 4, đang cấp 3, xong khoảng 6 bài (1–3 sao khác nhau), có thẻ ôn ở đủ 5 hộp (một số đến hạn, một số chưa), có sổ từ, có phiên học 7 ngày gần nhất (số phút cố định để so với biểu đồ), chuỗi ngày 3 | Hầu hết test của bé |
| B | Phụ huynh B, PIN khác | **B1 "Lan"** | Thử truy cập chéo; không dùng cho test khác |
| P | Phụ huynh P, **chưa có hồ sơ, chưa có PIN** | — | Đăng ký, Trống ở `/profiles`, tạo hồ sơ, đặt PIN lần đầu |
| K | Phụ huynh K, có PIN | 1 bé | **Chỉ** dùng cho test sai PIN 5 lần (bộ đếm khóa nằm trong bộ nhớ server, khóa luôn tài khoản này) |
| T | Phụ huynh T, có PIN | **T1 "Tí"**: giới hạn 30 phút, đã học 29 phút hôm nay. **T2 "Tèo"**: giới hạn 20 phút, đã học 20 phút (hết giờ) | Task 10; cộng giờ làm đổi dữ liệu nên tách riêng |
| S | Phụ huynh S, có PIN | 2 bé | Test cài đặt làm đổi dữ liệu: đổi tên/lớp, đặt lại tiến độ, xóa hồ sơ, đổi mật khẩu/PIN (R8) |
| Dữ liệu chung | — | — | Một chủ đề **Nháp** ("Test draft", cấp 3) có 1 bài Nháp; hai tệp Excel trong `tests/e2e/fixtures/` (chủ đề đúng và chủ đề sai) |

Nội dung cấp 1–4 lấy từ seed thật của task 05 (khoảng 900 từ, 154 bài, 58 chủ đề khung) để test chạy trên đúng dữ liệu của sản phẩm.

## 5. Quy trình dựng và dọn database test

1. Tên database trong `DATABASE_URL` của `.env.test` **phải chứa `_test`**, nếu không bộ test dừng ngay, không chạm database.
2. Trước mỗi lần chạy: `prisma migrate reset --force --skip-seed` → `prisma db seed` (nội dung 10 cấp + cấp 1–4 + tài khoản quản trị) → script seed thêm admin, A, B, P, K, T, S, chủ đề Nháp.
3. Sau mỗi lần chạy: xóa sạch dữ liệu test (migrate reset để database trống).
4. `prisma.config.ts` và `prisma/seed.ts` đọc `.env` bằng `process.loadEnvFile`, nhưng biến đã đặt từ ngoài thì không bị ghi đè, nên chạy với biến của `.env.test` là đủ. Tôi **không đọc** `.env`.
5. Cổng 3100, `AUTH_SECRET` riêng cho test, `AUTH_URL=http://localhost:3100`, `AUTH_TRUST_HOST=true`.

## 6. Điểm cần bạn quyết trước khi dựng khung (rủi ro và hạn chế kỹ thuật)

Có 10 chỗ yêu cầu không thực hiện được y như viết, hoặc cần chọn hướng. Đề xuất của tôi kèm theo.

| # | Vấn đề | Đề xuất của tôi |
|---|---|---|
| **R1** | **Khóa PIN 5 phút đếm ở bộ nhớ server bằng `Date.now()`** (`src/server/rate-limit.ts`). `page.clock` chỉ đổi giờ trình duyệt; database test không có gì để sửa; server không đọc giờ giả. Nên **không thể tua 5 phút** để kiểm tra mở khóa lại nếu không sửa code ứng dụng. | Test giao diện: sai 5 lần → thấy khóa, tải lại vẫn khóa, PIN đúng cũng không vào được lúc khóa. Phần "mở lại sau 5 phút": kiểm bằng test hàm thuần (`isLimited` và `recordFailure` có tham số `now`) chạy bằng `node:test`. Nếu muốn test thật bằng trình duyệt thì chỉ còn chờ thật 5 phút (một test đánh dấu chậm, chạy riêng). **Chọn: (a) hàm thuần [khuyên], (b) chờ thật 5 phút, (c) bỏ.** |
| **R2** | Bộ đếm sai mật khẩu đăng nhập (5 lần/15 phút, theo email) cũng ở bộ nhớ server. Test "đăng nhập sai" nhiều lần có thể tự khóa tài khoản dùng chung. | Mỗi test đăng nhập sai dùng email riêng hoặc tài khoản P; A/B/T/S/admin chỉ đăng nhập đúng. |
| **R3** | Cookie cổng bố mẹ sống 15 phút theo giờ server. `storageState` lưu cookie có thể hết hạn khi chạy lâu. | Test nào cần cổng mở thì mở lại cổng ở `beforeEach` (một lần nhập PIN). `storageState` chỉ lưu phiên đăng nhập và hồ sơ đang chọn. |
| **R4** | `/dev/ui`, `/dev-tokens`, `/dev/adult-kit` trả 404 trong bản build (đúng ý thiết kế). Task 01, 02, 11 bước 0 lại kiểm trên các trang đó. | Test token/font trên **trang thật** (`/login`, `/home`, `/parent`): đọc biến CSS và font đã nạp bằng `getComputedStyle`. Test thành phần qua màn thật. Không thêm route nào vào app. Có thể thêm project phụ chạy `next dev` chỉ cho 3 trang này nhưng chậm hơn; **khuyên không làm**. |
| **R5** | Giờ học: client gửi nhịp mỗi 60 giây, server chỉ nhận nếu cách nhịp trước ≥ 50 giây **giờ thật**. `page.clock` tua trình duyệt nhưng server vẫn tính giờ thật. | Seed phiên học có `endedAt` cách đây vài phút để nhịp tua 60 giây được chấp nhận. Tôi sẽ thử và báo nếu vẫn không đủ. |
| **R6** | "Đổi id hồ sơ trong request": id nằm trong **cookie ký** và trong tham số server action (id hành động do Next mã hóa, khó gọi tay). | (1) Dựng cookie hồ sơ giả bằng `AUTH_SECRET` của test (chữ ký hợp lệ nhưng hồ sơ của gia đình khác) → server phải từ chối. (2) Cookie không ký / ký sai → từ chối. (3) `?kid=` ở trang bố mẹ. Gọi thẳng server action chéo gia đình không làm bằng Playwright; tôi ghi vào báo cáo mục "chưa test được". |
| **R7** | Trạng thái **lỗi** (`error.tsx`): khi điều hướng trong ứng dụng, Next lấy dữ liệu qua yêu cầu RSC; chặn bằng `page.route` trả 500 có thể làm Next tải lại cả trang thay vì hiện `error.tsx`. | Thử nghiệm ở Bước 4 trên 2–3 màn trước. Nếu không dựng được lỗi bằng `page.route`, màn đó ghi "không tự động hóa được" thay vì ép cho qua. Các nút "Thử lại" có sẵn (`RetryButton`, lưu bài học) test bằng cách chặn đúng yêu cầu của server action. |
| **R8** | Test cài đặt (xóa hồ sơ, đặt lại tiến độ, đổi PIN/mật khẩu) làm đổi tài khoản dùng chung. | Dùng gia đình **S** riêng (đã ghi ở mục 4). |
| **R9** | `npm run build` ghi vào thư mục `.next`, trùng với `npm run dev` của bạn. Đang chạy dev thì build lỗi hoặc làm hỏng. | Tắt `npm run dev` trước khi chạy test (ghi vào `docs/test/README.md`). Không đổi `next.config.ts` (cấm sửa code ứng dụng). |
| **R10** | `.gitignore` đang có `.env.*` và chỉ cho phép `.env.example`, nên `.env.test.example` sẽ bị bỏ qua khi commit. | Thêm `!.env.test.example` vào `.gitignore` cùng các dòng bạn yêu cầu. Đây là cấu hình kho, không phải code ứng dụng. |

## 7. `data-testid`

Chưa cần thêm `data-testid` nào. Tôi tìm phần tử theo vai trò và chữ hiển thị (giao diện đều tiếng Việt, nhãn rõ). Nếu khi viết gặp chỗ không bám chắc (ví dụ ô trong lưới thẻ lật, vùng thả của nối cặp, các điểm trên biểu đồ SVG), tôi sẽ **liệt kê và hỏi bạn trước**, không tự thêm.

## 8. Kế hoạch các bước sau (tóm tắt)

| Bước | Việc | Ước lượng |
|---|---|---|
| 2 | Cài `@playwright/test`, config 3 kích thước, dựng database test, seed, `storageState`, helpers, 1 test mẫu | 1 test × 3 kích thước |
| 3 | 12 tệp `NN-ten.spec.ts` theo mục 2 | khoảng 110–140 test |
| 4 | `chung.spec.ts`: 4 trạng thái, không cuộn, Tab/focus, trợ năng | lặp qua khoảng 30 màn |
| 5 | Ảnh chụp màn thật ↔ ảnh từ `designs/`, so cạnh nhau, ảnh chuẩn | khoảng 25 màn |
| 6 | Báo cáo + `docs/test/README.md` | — |

Thời gian chạy dự kiến: dựng database 1–2 phút, build 1–2 phút, phần test chính vài phút mỗi kích thước (một worker). Chạy đủ 3 kích thước có thể mất 15–25 phút.

---
**DỪNG ở Bước 1.** Cần bạn trả lời để sang Bước 2: (1) đồng ý cài `@playwright/test` (devDependency, không chạy `playwright install`); (2) chọn hướng cho R1 và R4; (3) đồng ý các tài khoản ở mục 4 (kể cả gia đình S).
