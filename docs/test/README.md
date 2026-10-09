# Bộ test giao diện tự động (Playwright)

Bộ test này mở trình duyệt Chrome thật, làm lần lượt những việc bé, bố mẹ và quản trị viên làm trên web, rồi báo chỗ nào chạy khác với `task.md`, PRD và bản thiết kế. Sau khi sửa code, chạy lại một lệnh là biết có hỏng gì không.

## Trước khi chạy lần đầu

1. Chép `.env.test.example` thành `.env.test` và điền giá trị. Tên database **phải có chữ `_test`** (mẫu: `hoc_tieng_anh_test`). Nếu tên không có `_test` thì bộ test từ chối chạy, nên không bao giờ chạm vào database thật `hoc_tieng_anh`.
2. Bật MySQL của XAMPP.
3. **Tắt `npm run dev`** trước khi chạy: bộ test tự `npm run build` rồi `npm run start` ở cổng 3100.
4. Máy cần có Chrome (dùng `channel: "chrome"`). Không cần chạy `npx playwright install`.

> Khi **Claude Code** chạy lệnh, Prisma chặn `prisma migrate reset` và đòi bạn đồng ý riêng (biến `PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION`). Bạn tự chạy trong terminal của mình thì không bị chặn.

## Các lệnh

| Việc cần làm | Lệnh |
|---|---|
| Chạy hết (dựng lại database test, build, chạy 3 kích thước màn, dọn dữ liệu) | `npm run test:e2e` |
| Mở giao diện xem từng test | `npm run test:e2e:ui` |
| Mở báo cáo HTML của lần chạy gần nhất | `npm run test:e2e:baocao` |
| Chỉ dựng lại database test (reset + seed) | `npm run test:e2e:db` |
| Chạy một task (ví dụ task 07) | `npx playwright test 07-` |
| Chạy một tệp quản trị (ví dụ nhập Excel) | `npx playwright test 12e-` |
| Chạy một kích thước màn | `npx playwright test --project=1366x768` (hoặc `1440x900`, `1920x1080`) |
| Chạy test chức năng ở **cả 3** kích thước | đặt biến `E2E_ALL_SIZES=1` rồi `npm run test:e2e` |
| Chạy một test theo tên | `npx playwright test -g "tên một phần của test"` |

Biến môi trường tiện dùng khi đang viết hoặc gỡ lỗi test (đặt trước lệnh):

- `E2E_REUSE=1`: dùng lại server đang chạy ở cổng 3100, bỏ bước build (khởi động server bằng `npm run start -- -p 3100` với biến của `.env.test`).
- `E2E_KEEP=1`: không xóa database và tệp đăng nhập sau khi chạy.

Ví dụ trên PowerShell: `$env:E2E_REUSE="1"; $env:E2E_KEEP="1"; npx playwright test 07-`

## Tệp trong `tests/e2e/`

| Tệp | Nội dung |
|---|---|
| `01-nen-tang` … `12f-xuat-ban-cho-be` | Test chức năng theo từng task (tên test bằng tiếng Việt, ghi dòng "Kiểm tra" của `task.md` đang kiểm). Task 12 chia thành `12a`–`12f`. |
| `chung.spec.ts` | Kiểm tra chung ở cả 3 kích thước: màn bài học không cuộn, nút không tràn, Tab + viền focus, trợ năng, 4 trạng thái (thường, đang tải, trống, lỗi). |
| `thiet-ke.spec.ts` | Chụp màn thật và màn thiết kế tương ứng (1366×768) vào `docs/test/anh-chup/` và `docs/test/thiet-ke/`. |
| `setup/` | Dựng database test, tài khoản mẫu, đăng nhập sẵn. `seed-test.ts` là dữ liệu mẫu (xem bảng dưới). |
| `helpers/` | Hàm dùng chung: đăng nhập, bot chơi hết một bài học, giọng đọc giả, kiểm tra cuộn / focus / trợ năng. |
| `fixtures/` | Tệp Excel mẫu (`tao-tep-mau.mjs` tạo ra các tệp `.xlsx`). |

### Tài khoản và dữ liệu mẫu

Mật khẩu chung và mã PIN lấy từ `.env.test`.

| Mã | Tài khoản | Bé |
|---|---|---|
| admin | `admin-test@edu.local` | — (quản trị; PIN riêng để vào khu quản trị) |
| A | `me-a@edu.local` | Mai (lớp 4, bé mới) và Bảo (đã xong 6 bài cấp 3, thẻ ôn ở 5 hộp, phiên học 14 ngày) |
| B | `me-b@edu.local` | Lan (để thử truy cập chéo) |
| P | `me-p@edu.local` | chưa có hồ sơ, chưa có PIN |
| K | `me-k@edu.local` | Kiki (chỉ dùng thử khóa PIN 5 phút) |
| T | `me-t@edu.local` | Tí (giới hạn 30 phút, đã học 29) và Tèo (giới hạn 20 phút, đã hết giờ) |
| S | `me-s@edu.local` | Sún, Bắp (thử cài đặt: đổi tên, xóa, đổi PIN…) |

Ngoài ra có chủ đề Nháp "Test draft" (cấp 3, 1 bài Nháp 20 bước) để kiểm tra bé không thấy nội dung chưa xuất bản.

## Ảnh so sánh với thiết kế

- `docs/test/so-sanh-thiet-ke.html`: mở bằng trình duyệt, mỗi màn một hàng (trái thiết kế, phải màn thật) kèm nhận xét ở `docs/test/nhan-xet-thiet-ke.json`.
- Sinh lại trang so sánh sau khi chạy `thiet-ke.spec.ts`: `node tests/e2e/setup/tao-trang-so-sanh.mjs`.
- **Ảnh chuẩn** (để lần sau phát hiện giao diện bị đổi ngoài ý muốn): chưa tạo, chờ bạn xem và duyệt `so-sanh-thiet-ke.html`. Khi đồng ý, cập nhật ảnh chuẩn bằng `npx playwright test thiet-ke --project=1366x768 --update-snapshots`. Từ đó `thiet-ke.spec.ts` so từng màn với ảnh chuẩn (sai khác dưới 3% điểm ảnh thì vẫn đạt). Ảnh chuẩn chỉ cập nhật khi bạn đồng ý.

## Những điều cần biết

- **Không sửa code ứng dụng.** Test nào hỏng vì lỗi của app thì được giữ nguyên là test hỏng và ghi vào `docs/test/bao-cao-test.md` để bạn quyết, không nới test cho qua.
- **Khóa PIN 5 phút và đếm sai mật khẩu** nằm trong bộ nhớ của server (giờ thật), nên test giao diện chỉ kiểm đến lúc bị khóa; phần "mở lại sau 5 phút" kiểm bằng hàm thuần với giờ giả (`11-khu-bo-me.spec.ts`). Chạy lại bộ test khi server cũ còn sống thì test khóa PIN của tài khoản K có thể lệch: dùng `npm run test:e2e` (khởi động server mới) thay vì `E2E_REUSE=1`.
- **Các trang `/dev/ui`, `/dev-tokens`, `/dev/adult-kit`** chỉ có khi chạy `next dev`, bản build trả 404 nên không test trực tiếp; token màu và font được kiểm trên trang thật.
- **Giọng đọc** của trình duyệt không nghe được trong test; `window.speechSynthesis` được thay bằng bản giả ghi lại câu được đọc để kiểm đúng từ được đọc.
- Tệp tải lên khi test (hình ở `storage/uploads/`) được dọn sau mỗi lần chạy; tệp có sẵn trước đó được giữ nguyên.
- Test `thiet-ke.spec.ts` cần mạng để tải font Google cho bản xem trước thiết kế.
