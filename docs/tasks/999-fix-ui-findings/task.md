# 999 — Sửa lỗi giao diện sau rà soát test tự động (lỗi 1–7)

> Quy trình làm việc và quy tắc code: xem `CLAUDE.md`.
> Nguồn: `docs/test/bao-cao-test.md` (bộ test Playwright chạy 09/10/2026). Task này sửa **lỗi 1–7**.
> Lỗi 8 (từ chưa có hình để trống khối màu) và lỗi 9 (bé mới thấy "đã ôn hết từ đến hạn") chờ bạn quyết về nội dung / logic, KHÔNG làm ở đây.

## Mục tiêu
Sửa 7 lỗi do bộ test giao diện tự động phát hiện, mà không đổi tính năng nào khác:
1. Nút "Thử lại" ở 16 màn báo lỗi (`error.tsx`) không tải lại dữ liệu.
2. Phím A–D không chọn được đáp án ở "Nghe và chọn hình" và "Chọn từ đúng cho hình".
3. Ở "Xem như học sinh" (Ngân hàng câu hỏi), Enter không "Kiểm tra" nếu chưa bấm chuột.
4. Ở Soạn bài › "Xem trước", Esc không có tác dụng.
5. `/map` không có `loading.tsx` (không hiện khung xương khi tải chậm).
6. Thiếu favicon (mọi trang báo 404 ở console).
7. Trang 404 là bản tiếng Anh mặc định, cần `not-found.tsx` tiếng Việt.

## Thiết kế
- Lỗi 7 (trang không tìm thấy): không có màn riêng trong `designs/`; dùng `DataState` / `Mascot` và kiểu của `designs/components/Screen22-ComingSoon` cho gần phong cách, lời nhẹ nhàng, có nút về trang chủ.
- Lỗi 6 (favicon): dùng hình rồng Bông có sẵn trong `designs/components/Mascot` (SVG), không vẽ mới.
- Các lỗi còn lại: không đổi giao diện.

## Bối cảnh & môi trường
- Báo cáo lỗi, file nghi ngờ và cách tái hiện từng lỗi: `docs/test/bao-cao-test.md` mục 2.
- Bộ test: `docs/test/README.md`. Test của từng lỗi đã có sẵn (đang hỏng) trong `tests/e2e/`; sau khi sửa phải chuyển sang đạt, KHÔNG nới test.
- Tắt `npm run dev` khi chạy test (cổng 3100, database `hoc_tieng_anh_test`). Lệnh `prisma migrate reset` của test cần bạn đồng ý riêng.

## Quyết định kiến trúc
- Lỗi 1: sửa chung bằng một cách cho cả 16 `error.tsx`: gọi `router.refresh()` rồi `reset()` bên trong `startTransition`, như `RetryButton` của trang chủ đã làm. Nếu lặp lại ở 16 nơi thì gom vào một hook / thành phần dùng chung.
- Lỗi 2: dùng chung một bảng phím cho 1–4 và A–D; không đổi nhãn hiển thị (vẫn hiện số 1–4).
- Lỗi 3, 4: đưa focus vào lớp phủ xem trước khi mở (hoặc nghe phím ở mức document trong lúc mở) rồi trả focus khi đóng.
- Chữ trên giao diện bằng tiếng Việt, chỉ dùng design token, không thêm package mới.

## Các bước
### Bước 0 — Kiểm tra dự án (không sửa code)
Đọc `docs/test/bao-cao-test.md`, xác nhận từng lỗi còn tái hiện và file nghi ngờ còn đúng. Tạo nhánh `feat/29-fix-ui-findings`.
- Kiểm tra: `git status` sạch phần code; liệt kê file sẽ sửa cho từng lỗi.

### Bước 1 — Nút "Thử lại" tải lại dữ liệu (lỗi 1)
Sửa 16 tệp `error.tsx` (khu bé và khu quản trị).
- Kiểm tra: `chung.spec.ts` mục "Trạng thái lỗi" đạt ở 10 màn × 3 kích thước; làm lỗi database rồi bấm Thử lại thì dữ liệu trở lại, không cần F5.

### Bước 2 — Phím A–D (lỗi 2)
`ListenChooseStep.tsx`, `PickWordStep.tsx`.
- Kiểm tra: `07-bai-hoc.spec.ts` "phím A–D chọn đáp án giống phím 1–4" đạt; phím 1–4, Enter, Space, H, Esc vẫn chạy như cũ.

### Bước 3 — Bàn phím trong hai bản xem trước của quản trị (lỗi 3, 4)
`QuestionPreview.tsx` (Enter), `StepsPreview.tsx` (Esc).
- Kiểm tra: test cuối của `12c-tu-vung-cau-hoi.spec.ts` và `12d-soan-bai.spec.ts` đạt.

### Bước 4 — Khung xương `/map` (lỗi 5)
Thêm `src/app/(kid)/map/loading.tsx` giống kiểu `map/[level]/loading.tsx`.
- Kiểm tra: `chung.spec.ts` "Bản đồ hiện khung xương khi tải chậm" đạt ở 3 kích thước.

### Bước 5 — Favicon và trang 404 tiếng Việt (lỗi 6, 7)
Thêm `src/app/icon.*` (hoặc `favicon.ico`) và `src/app/not-found.tsx`.
- Kiểm tra: không còn lỗi 404 của favicon trong console ở các màn (test "không lỗi console" của task 01 đạt); gõ `/map/99` thấy trang tiếng Việt có nút về trang chủ.

### Bước 6 — Kiểm tra cuối
`npx tsc --noEmit`, `npm run lint`, `npm run build`; chạy `npm run test:e2e` (3 kích thước), cập nhật `docs/test/bao-cao-test.md` (đánh dấu lỗi 1–7 đã sửa, ghi lại kết quả mới) và `docs/test/nhan-xet-thiet-ke.json` nếu có màn đổi.
- Kiểm tra: số test hỏng giảm đúng phần lỗi 1–7; phần còn lại chỉ là lỗi 8, 9.

## Phạm vi
- Được tạo/sửa: 16 `error.tsx` (và thành phần/hook dùng chung nếu cần), `ListenChooseStep.tsx`, `PickWordStep.tsx`, `QuestionPreview.tsx`, `StepsPreview.tsx`, `src/app/(kid)/map/loading.tsx`, `src/app/icon.*`, `src/app/not-found.tsx`, `docs/test/*`.
- KHÔNG làm trong task này: lỗi 8 (hình cho từ chưa có hình), lỗi 9 (câu "ôn hết từ đến hạn" cho bé mới), các khác biệt nhỏ so với thiết kế (mục 4 của báo cáo), thay đổi `designs/`, `docs/tasks/README.md` ngoài dòng của task này.

## Tiêu chí hoàn thành
- Lỗi 1–7 không còn tái hiện; test Playwright tương ứng đạt.
- `npx tsc --noEmit`, `npm run lint`, `npm run build` không lỗi.
- `npm run test:e2e`: không còn test hỏng nào ngoài lỗi 8, 9.
