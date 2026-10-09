# Tiến độ — 29-fix-ui-findings

Trạng thái chung: 🔄 · Cập nhật lần cuối: 09/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|------|-----|------------|---------|
| 0 | Kiểm tra dự án | ✅ | Đọc báo cáo test, xác nhận file nghi ngờ; có 19 tệp `error.tsx` (không phải 16) |
| 1 | Nút "Thử lại" tải lại dữ liệu (lỗi 1) | ✅ | 19 tệp `error.tsx` dùng `retry`; "Trạng thái lỗi" đạt ở 3 kích thước |
| 2 | Phím A–D (lỗi 2) | ✅ | Test đạt (sửa một dòng kiểm sai của test: `aria-pressed` không có khi chưa chọn) |
| 3 | Bàn phím trong hai bản xem trước (lỗi 3, 4) | ✅ | Enter và Esc dùng được ngay khi mở; test 12c, 12d đạt |
| 4 | Khung xương `/map` (lỗi 5) | ✅ | Test khung xương đạt ở 3 kích thước |
| 5 | Favicon và trang 404 tiếng Việt (lỗi 6, 7) | ✅ | Không còn lỗi console của favicon; 5 test tìm tiêu đề "404" đổi sang tiêu đề trang mới |
| 6 | Kiểm tra cuối | ✅ | `tsc`, `lint`, build sạch; `npm run test:e2e`: 410 đạt, 1 hỏng (token GĐ2, chờ task 13), 44 bỏ qua |
| 7 | Lỗi 10: vòng lặp chuyển hướng khi tài khoản trong cookie không còn | ✅ | Thêm theo yêu cầu của bạn (ngoài task.md gốc): `/session-expired` xóa cookie; test `04-` đạt |
| 8 | Lỗi 11: lời báo micro khi trang không an toàn (http) | ✅ | Thêm theo yêu cầu của bạn; test `04-` đạt |

## Nhật ký
### Bước 0–5 — Viết code (09/10/2026)
- Đã làm: xem bảng trên. Lỗi 1 dùng prop `retry` có sẵn của `error.tsx` trong Next 16.3.8 thay cho `router.refresh()` tự viết.
- File tạo/sửa: 19 `error.tsx`; `ListenChooseStep.tsx`, `PickWordStep.tsx`; `StepsPreview.tsx`, `questions.module.css`; `src/app/(kid)/map/loading.tsx`; `src/app/icon.svg`; `src/app/not-found.tsx`; `eslint.config.mjs` (bỏ qua `playwright-report/`, `test-results/`).
- Kết quả kiểm tra: `npx tsc --noEmit` và `npm run lint` không lỗi.

### Bước 6 — Kết quả test Playwright (09/10/2026)
- `npm run test:e2e` (3 kích thước): 404 đạt, 4 hỏng, 44 bỏ qua (22 test chụp ảnh thiết kế × 2 kích thước phụ). 4 test hỏng đều tìm tiêu đề "404" của trang mặc định; lỗi 7 đã thay bằng trang tiếng Việt nên đổi test sang tiêu đề mới ("Bông tìm mãi mà không thấy trang này") ở `05-noi-dung` (4 chỗ) và `12a` (1 chỗ), chạy lại 32 test đạt. Tổng: **408 đạt, 0 hỏng, 44 bỏ qua**.
- Một dòng kiểm của test A–D sai (`aria-pressed="false"` trong khi app bỏ thuộc tính khi chưa chọn): đổi thành "không phải true", ý kiểm giữ nguyên.
- Lỗi 8, 9 chưa sửa (ngoài phạm vi, chờ bạn quyết).
- Sau khi thêm lỗi 10, 11 và áp dụng gói thiết kế GĐ2, chạy lại toàn bộ: **410 đạt, 1 hỏng, 44 bỏ qua**. Test hỏng duy nhất là token màu của `01-nen-tang` (thiếu 108 token GĐ2 trong theme, chờ task 13; xem decisions.md).

## Bước tiếp theo
Bạn tự test tay trên Chrome (checklist ở mục dưới), báo "test ok" thì đóng task.

## Checklist test thủ công
- [ ] Lỗi 2: vào một bài, câu "Nghe và chọn hình" và "Chọn từ đúng cho hình": phím A, B, C, D chọn đúng thẻ như phím 1–4.
- [ ] Lỗi 3: Quản trị › Ngân hàng câu hỏi › mở một câu › "Xem như học sinh": bấm phím 1 rồi Enter ngay (chưa bấm chuột) thì có dải phản hồi.
- [ ] Lỗi 4: Quản trị › Soạn bài › Xem trước: bấm Esc thì đóng.
- [ ] Lỗi 5: trang chủ › nút Bản đồ khi mạng chậm (F12 › Network › Slow 3G) thì có khung xương.
- [ ] Lỗi 6: tab trình duyệt có biểu tượng rồng, Console không báo 404 favicon.
- [ ] Lỗi 7: gõ `/map/99` thì thấy trang tiếng Việt có nút "Về trang chủ".
- [ ] Lỗi 10: mở `localhost:3000/login` khi cookie cũ của tài khoản đã mất: về trang đăng nhập, không còn "redirected you too many times".
- [ ] Lỗi 11: mở tạo hồ sơ bằng `http://192.168.x.x:3000`, bước micro hiện "Mở web bằng localhost hoặc https".
- [ ] Lỗi 1 (khó làm tay): có thể bỏ qua, test tự động đã kiểm.
