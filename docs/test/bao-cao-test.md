# Báo cáo test giao diện tự động — task 01 đến 12

> **Cập nhật sau task 999 (09/10/2026):** lỗi 1–7 đã sửa; chạy lại `npm run test:e2e` được 410 đạt, 1 hỏng (token GĐ2, chờ task 13), 44 bỏ qua. Lỗi 8, 9 chưa sửa (chờ quyết). Nội dung bên dưới là kết quả lần chạy đầu (trước khi sửa).

Chạy ngày 09/10/2026 bằng `npm run test:e2e` (Chrome 155, database `hoc_tieng_anh_test`, bản build production, 33,8 phút). Cách chạy lại: xem `docs/test/README.md`.

## 1. Tổng quan

**Kết luận ngắn:** các chức năng chính của task 01–12 chạy đúng task.md. Có **1 lỗi quan trọng** (nút "Thử lại" ở các màn báo lỗi không tải lại được dữ liệu) và 8 lỗi nhỏ. Không có lỗi bảo mật nào: kiểm quyền giữa các gia đình, quyền admin, khóa PIN, tải tệp lên đều đạt.

| Kích thước màn | Số test | Đạt | Hỏng | Bỏ qua |
|---|---|---|---|---|
| 1366×768 (gồm mọi test chức năng) | 281 | 267 | 14 | 0 |
| 1440×900 (chỉ test kiểm tra chung) | 80 | 47 | 11 | 22 |
| 1920×1080 (chỉ test kiểm tra chung) | 80 | 46 | 12 | 22 |

- "Bỏ qua" là 22 test chụp ảnh so với thiết kế: chỉ chụp ở 1366×768.
- Test chức năng chỉ chạy ở 1366×768 vì chúng ghi dữ liệu vào cùng một database. Chạy cả 3 kích thước bằng biến `E2E_ALL_SIZES=1`.
- Hỏng ở 1440×900 và 1920×1080 là **cùng các lỗi** ở 1366×768 (không có lỗi riêng theo kích thước). Riêng 1920×1080 có thêm 1 lần màn Ôn tập không kịp hiện khung xương (xem lỗi số 5, chập chờn).

### Theo từng task (1366×768)

| Task | Nội dung | Đạt | Hỏng |
|---|---|---|---|
| 01–03 | Token, font, không lỗi console ở 10 màn, dữ liệu lõi, seed không trùng | 22 | 0 |
| 04 | Đăng nhập, đăng ký, hồ sơ, PIN, chặn truy cập chéo | 25 | 0 |
| 05 | Chỉ thấy nội dung đã xuất bản, số liệu nội dung | 10 | 0 |
| 06 | Trang chủ, tổng quan 10 cấp, bản đồ | 20 | 0 |
| 07 | Khung bài học, 4 dạng bài, lật thẻ, kết thúc, lưu kết quả | 18 | 1 |
| 08 | Ôn tập 5 hộp, Sổ từ | 9 | 0 |
| 09 | Bài xếp lớp | 6 | 0 |
| 10 | Giới hạn giờ, màn Hết giờ | 10 | 0 |
| 11 | Khu bố mẹ: cổng PIN, tổng quan, cài đặt | 24 | 0 |
| 12 (12a–12f) | Quản trị: quyền, bảng điều khiển, cây lộ trình, từ vựng, câu hỏi, soạn bài, hình, Excel, xuất bản cho bé | 53 | 2 |
| Chung | Không cuộn, bàn phím, trợ năng, 4 trạng thái | 47 | 11 |
| Ảnh thiết kế | 31 màn thật so với thiết kế | 22 (chụp) | 0 |

(Một test mẫu `00-mau` đạt ở cả 3 kích thước.)

## 2. Bảng lỗi

Mức: **quan trọng** là người dùng bị kẹt hoặc mất khả năng làm việc; **nhỏ** là khác yêu cầu hoặc thẩm mỹ, vẫn dùng được.

| # | Mức | Task | Màn | Mô tả lỗi bằng lời thường | Cách tái hiện | Ảnh chụp | File:dòng nghi ngờ |
|---|---|---|---|---|---|---|---|
| 1 | **Quan trọng** | 06, 08, 12 (và các màn dùng chung mẫu) | Tổng quan 10 cấp, Bản đồ, Sổ từ, Ôn tập, và 6 màn quản trị (Bảng điều khiển, Cấu trúc, Từ vựng, Câu hỏi, Soạn bài, Hình ảnh) | Khi máy chủ gặp lỗi, màn báo lỗi hiện đúng và nhẹ nhàng, nhưng **bấm "Thử lại" không làm gì**: dữ liệu đã trở lại bình thường mà màn vẫn kẹt ở thông báo lỗi, bé hoặc bố mẹ phải tải lại cả trang. | Làm database lỗi, mở `/levels` (thấy "Bông chưa vẽ được bản đồ"), cho database chạy lại, bấm Thử lại: vẫn ở màn lỗi. Chỉ tải lại trang (F5) mới hết. Test: `chung.spec.ts` mục "Trạng thái lỗi" (10 màn của bé và quản trị hỏng ở cả 3 kích thước). | `anh-loi/L05-thu-lai-khong-hoat-dong-man-cap.png`, `anh-loi/L06-thu-lai-khong-hoat-dong-quan-tri.png` | 16 tệp `error.tsx` cùng một mẫu `onRetry={reset}`, ví dụ `src/app/(kid)/levels/error.tsx:15`, `src/app/(admin)/admin/vocab/error.tsx`. Hàm `reset()` của Next chỉ vẽ lại phần giao diện, không lấy lại dữ liệu từ máy chủ; cần thêm `router.refresh()`. Trang chủ (`RetryButton`) và màn Hết giờ đã làm đúng nên không lỗi. |
| 2 | Nhỏ | 07 (và cả khu Bố mẹ tuân theo PRD Phần B) | Nghe và chọn hình, Chọn từ đúng cho hình | Phím A, B, C, D không chọn được đáp án. PRD Phần B và CLAUDE.md ghi "1–4 (hoặc A–D)"; hiện chỉ có 1–4. | Vào một bài, tới câu nghe chọn hình, bấm phím B: không có thẻ nào được chọn. Test: `07-bai-hoc.spec.ts` "phím A–D chọn đáp án giống phím 1–4". | `anh-loi/L01-phim-A-D.png` | `src/features/lesson/ListenChooseStep.tsx:15`, `src/features/lesson/PickWordStep.tsx:15` (khai báo `KEYS = ["1","2","3","4"]`). |
| 3 | Nhỏ | 12 (bước 3) | Ngân hàng câu hỏi › Xem như học sinh | Trong bản xem trước, phím số chọn được đáp án nhưng phím **Enter không "Kiểm tra"** nếu chưa bấm chuột vào bản xem trước (Enter bị nút nằm dưới ăn mất). Bấm chuột rồi thì bình thường. | Thêm câu hỏi 8.2, bấm "Xem như học sinh", bấm phím 1, bấm Enter: không có dải phản hồi. Test: `12c-tu-vung-cau-hoi.spec.ts` (test cuối). | `anh-loi/L02-xem-nhu-hoc-sinh-enter.png` | `src/features/admin/QuestionPreview.tsx` (lớp phủ xem trước nằm trên ngăn kéo, focus vẫn ở nút của ngăn kéo). |
| 4 | Nhỏ | 12 (bước 4) | Soạn bài học › Xem trước | Bấm Esc trong bản xem trước **không có tác dụng** (ở khu của bé, Esc mở "Dừng bài học?"). Chỉ thoát được bằng nút × "Thoát bài học". | Soạn bài ›  Xem trước › bấm Esc: không có gì xảy ra. Test: `12d-soan-bai.spec.ts` (test cuối). | `anh-loi/L03-xem-truoc-esc.png` | `src/features/admin/StepsPreview.tsx` |
| 5 | Nhỏ | 06 | Trang chủ › nút Bản đồ | Bấm "Bản đồ" ở trang chủ khi mạng chậm **không hiện khung xương**, màn đứng yên tới khi tải xong (các màn khác đều có). Màn Ôn tập cũng có 1 lần không kịp hiện khung xương ở 1920×1080 (chập chờn, có thể do trình duyệt đã tải trước trang). | Chặn các yêu cầu RSC, bấm "Bản đồ" ở `/home`. Test: `chung.spec.ts` "Bản đồ hiện khung xương khi tải chậm" (3 kích thước). | `anh-loi/L04-ban-do-khong-khung-xuong.png` | Thiếu `loading.tsx` ở `src/app/(kid)/map/` (chỉ có `map/[level]/loading.tsx`, mà `/map` chỉ chuyển hướng sang `/map/<cấp>`). |
| 6 | Nhỏ | 01 | Mọi trang | Thiếu biểu tượng tab (favicon): trình duyệt báo 404 ở console ở mọi trang. | Mở bất kỳ trang nào, xem Console. | — | Không có `src/app/favicon.ico` hoặc `icon.*`. |
| 7 | Nhỏ | 05, 12 | Trang "không tìm thấy" | Trang 404 là bản tiếng Anh mặc định "This page could not be found." trong khi toàn bộ giao diện là tiếng Việt. Hiện khi gõ URL bài Nháp, cấp không tồn tại, hoặc tài khoản thường vào `/admin`. | Gõ `/map/99`. | — | Chưa có `src/app/not-found.tsx`. |
| 8 | Nhỏ | 06, 07 | Thẻ từ, "Bài tiếp theo" ở trang chủ, danh sách từ cuối bài | Từ chưa có hình (230/900 từ, phần lớn là từ trừu tượng) hiện **khối màu trống** ở chỗ hình: bên trái thẻ từ, ô hình của "Bài tiếp theo", hàng từ ở cuối bài lệch với từ có hình. Không vỡ giao diện nhưng khác thiết kế (luôn có hình). | Mở bài đầu của cấp 3 (từ "wake up"). | `anh-chup/08-the-tu.png`, `anh-chup/04-trang-chu.png` | `src/features/lesson/WordCardStep.tsx`, `src/features/home/MissionCard.tsx:69` |
| 9 | Nhỏ | 08 | Ôn tập hôm nay (bé mới) | Bé chưa học từ nào thấy "Mai đã ôn hết từ đến hạn". Câu này nghe lạ vì bé chưa từng ôn. | Mở `/review` bằng bé mới tạo. | — | `src/features/review/ReviewStart.tsx:36` |

Các khác biệt nhỏ so với thiết kế (không phải lỗi chức năng) nằm ở mục 4.

## 3. Những gì đã kiểm và đạt

- **Chặn truy cập chéo:** cookie hồ sơ của gia đình khác (kể cả ký đúng chữ ký), cookie giả, `?kid=` của bé khác đều bị từ chối ở server; chưa đăng nhập thì mọi trang bảo vệ về `/login`.
- **Quyền quản trị:** tài khoản thường gõ `/admin/*` thấy 404, 4 route handler (`excel/template`, `excel/export`, `excel/parse`, `media/upload`) trả 403; admin chưa mở cổng bố mẹ về `/profiles`.
- **Bài học:** đi trọn bài chỉ bằng bàn phím (1–4, Enter, Space, H, ←/→, Esc), giọng đọc đúng từ và câu ví dụ, sai thì phản hồi cam nhẹ không đỏ gắt, sao theo tỷ lệ đúng (≥ 90% 3 sao, ≥ 70% 2 sao), xu theo công thức, lỗi lưu có Thử lại và không mất kết quả, không có đồng hồ đếm ngược.
- **Ôn tập 5 hộp:** chỉ hỏi từ đến hạn, đúng lên một hộp, sai về hộp 1, lịch ôn theo bảng 1/3/7/14/30 ngày.
- **Giờ học:** giờ trong ngày tăng đúng khi tua đồng hồ trình duyệt, hết giờ giữa bài thì làm nốt câu rồi mới chuyển, thêm giờ bằng PIN.
- **Khu bố mẹ:** khóa PIN sau 5 lần sai (tải lại vẫn khóa), số liệu tổng quan khớp dữ liệu seed, cài đặt lưu và bé bị áp dụng đúng.
- **Quản trị:** thêm, sửa, xóa, tìm, lọc, phân trang, Nháp / Xuất bản, không xuất bản được bài 0 bước, tải hình (từ chối tệp không phải ảnh, ảnh quá 2 MB, SVG có mã chạy được), nhập Excel báo lỗi từng dòng và không ghi gì khi tệp sai, nhập chủ đề mới tạo chủ đề và bài ở trạng thái Nháp, xuất bản thì bé mới thấy.
- **Không cuộn (3 kích thước):** khung bài học (mọi dạng bài), kết thúc bài, ôn tập, xếp lớp, màn Hết giờ đều vừa màn hình và không nút nào tràn ra ngoài.
- **Bàn phím và trợ năng:** Tab đi hết 31 màn, mọi phần tử có viền focus và không bị kẹt; mọi nút, liên kết, ô nhập có tên đọc được; ảnh có thuộc tính alt.
- **Token và font:** 100+ token màu của bộ Tiểu học khớp `designs/tokens.json`, font Baloo 2 và Nunito được nạp.

## 4. So với bản thiết kế

Xem `docs/test/so-sanh-thiet-ke.html` (31 màn, trái thiết kế, phải màn thật) và nhận xét từng màn ở `docs/test/nhan-xet-thiet-ke.json`.

- 16 màn khớp thiết kế. 15 màn khớp nhưng có khác biệt nhỏ.
- Khác biệt đáng chú ý (đều không có trong `task.md` hoặc đã ghi ở `decisions.md`): Cài đặt bố mẹ thiếu chọn "Ngày được học" và hai công tắc nhắc giờ; Cổng bố mẹ thiếu liên kết "Quên mật khẩu?"; Bảng điều khiển thiếu nút "+ Thêm từ mới"; màn Hết giờ khác chữ tiêu đề và ẩn 3 ô tóm tắt khi bé chưa học; nút "Dừng lại" không ghi phím Esc.
- Chưa có ảnh chuẩn để so tự động (cần bạn xem và duyệt, xem `docs/test/README.md`).

## 5. Những mục trong task.md chưa test được

| Mục | Lý do |
|---|---|
| `/dev/ui`, `/dev-tokens`, `/dev/adult-kit` (task 01, 02, 11 bước 0) | Chỉ có khi chạy `next dev`, bản build trả 404. Token và font được kiểm trên trang thật; các thành phần dùng chung được kiểm gián tiếp qua các màn thật. |
| Giọng đọc thật, micro thật | Không nghe được trong test: dùng giọng đọc giả ghi lại câu được đọc và micro giả của Chrome. |
| Kéo thả tệp lên bằng chuột thật, tệp tạo bằng Excel / Google Sheets | Test chọn tệp qua ô chọn tệp; tệp mẫu sinh bằng thư viện `exceljs`. Cần bạn thử tay một lần. |
| "Nhập chủ đề cấp 5 từ Excel, xuất bản, học thử bằng hồ sơ của con" liền một mạch | Chỉ kiểm từng đoạn: nhập đúng và nhập sai; xuất bản bài và chủ đề `Test draft` rồi bé thấy. Từ mới nhập từ Excel chưa có hình nên bài tạo ra chưa đủ điều kiện xuất bản (đúng luật). |
| Gọi thẳng server action với id hồ sơ của gia đình khác | Id hành động do Next mã hóa. Đã kiểm bằng cookie giả và `?kid=`; kiểm quyền trong hàm `requireLearner` chưa test trực tiếp. |
| Khóa PIN mở lại sau 5 phút trên trình duyệt | Bộ đếm nằm trong bộ nhớ máy chủ theo giờ thật. Kiểm bằng hàm thuần với giờ giả (đạt). Không tua được bằng đồng hồ trình duyệt. |
| Ở THCS: PIN hồ sơ, giao diện THCS, bài xếp lớp THCS | Chưa làm (GĐ3). |
| Nút toàn màn hình, in Sổ từ, bố mẹ mở khóa thủ công (PRD) | Không có trong `task.md` GĐ1. |
| Trình duyệt Edge, Firefox, Safari | Chỉ chạy Chrome. |
| Các lỗi của lần sửa sau | Bộ test chưa có test chụp ảnh chuẩn (chờ bạn duyệt). |

## 6. Nên sửa lỗi nào trước

Sửa **lỗi số 1** (nút "Thử lại" không tải lại dữ liệu) trước vì nó ảnh hưởng 16 màn và là lúc bé hoặc bố mẹ đang gặp sự cố; cách sửa chung cho cả 16 tệp `error.tsx`. Các lỗi còn lại đều nhỏ, có thể gộp vào một lần dọn.

Đề xuất (bạn quyết, tôi không tự sửa `docs/tasks/README.md`): tạo **task 999 — sửa lỗi giao diện sau rà soát test tự động** ở cuối danh sách, gồm lỗi 1 (quan trọng), rồi 2–9. task 29 nên chạy lại `npm run test:e2e` làm phần kiểm tra cuối.

## 7. Thay đổi ngoài code test (cấu hình kho)

- `.gitignore`: thêm `playwright-report/`, `test-results/`, `tests/e2e/.auth/`, `.env.test` (và cho phép `.env.test.example`).
- `package.json`: thêm devDependency `@playwright/test` và 4 script `test:e2e`, `test:e2e:ui`, `test:e2e:baocao`, `test:e2e:db`.
- Không sửa dòng nào trong code ứng dụng (`src/`), `prisma/`, `designs/`, `docs/tasks/README.md`.
