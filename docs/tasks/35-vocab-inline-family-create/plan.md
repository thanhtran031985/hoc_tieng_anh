# Kế hoạch triển khai — 35-vocab-inline-family-create

> Được duyệt ngày 2026-10-12 từ Plan mode.

## Mục tiêu kỹ thuật
1. Tại trang Ngân hàng từ vựng (`http://localhost:3000/admin/vocab`), khi một từ chưa thuộc họ vần nào (`r.families.length === 0`), cung cấp 2 điểm kích hoạt tiện lợi:
   - Trên bảng `AdultTable`: nút bấm nhanh `+ Tạo họ` tại cột Họ vần.
   - Trong ngăn kéo `WordDrawer`: nút hành động `Tạo họ vần cho từ này`.
2. Hệ thống tự động phân tích từ vựng để gợi ý và điền trước (Pre-fill context) vào `FamilyDrawer`:
   - Trích xuất mẫu vần `pattern` (dựa trên nguyên âm và đuôi từ, ví dụ `bake` -> `ake`, `rain` -> `ain`).
   - Trích xuất âm vần `soundIpa` từ phiên âm IPA của từ (ví dụ `/beɪk/` -> `/eɪk/`).
   - Đưa sẵn từ vào danh sách thành viên `members` với `sameSound: true`.
   - Chọn sẵn `levelId` khớp với cấp của từ.
3. Người dùng (Quản trị viên) làm chủ 100%: có toàn quyền xem lại, chỉnh sửa mẫu vần, âm IPA, cấp, thêm/bớt từ, đổi sang bẫy chính tả, tạo câu AI... trước khi bấm Lưu.
4. Tự động đồng bộ (Seamless sync): Khi lưu họ vần thành công, gọi `router.refresh()` để chip họ vần mới tạo xuất hiện ngay lập tức trên dòng của từ đó trong ngân hàng từ vựng.

## Các bước thực hiện

### Bước 0 — Khảo sát hiện trạng & chuẩn bị nhánh (không sửa code)
- Tạo và chuyển sang nhánh git `feat/35-vocab-inline-family-create`.
- Khảo sát mã nguồn hiện tại của `VocabView.tsx` và `FamilyDrawer.tsx`.
- Kiểm tra trạng thái TypeScript ban đầu (`npx tsc --noEmit`).

### Bước 1 — Nâng cấp `FamilyDrawer` hỗ trợ ngữ cảnh khởi tạo từ vựng ban đầu
- Viết hàm tiện ích trích xuất vần và âm `guessRimePattern(word, ipa)` trong `src/lib/rules/word-family.ts`.
- Mở rộng prop `initialWord` trong `FamilyDrawer.tsx`.
- Khi `familyId === null` và có `initialWord`: tự động điền `pattern`, `soundIpa`, đưa từ vào `members`, đặt `levelId`.
- Kiểm tra: `npx tsc --noEmit`.

### Bước 2 — Tích hợp điểm kích hoạt tạo Họ vần trên `VocabView` và `WordDrawer`
- Tại `WordDrawer`: Thêm nút `Tạo họ vần cho từ này` (`AdultButton variant="secondary" size="s"`).
- Tại `VocabView`: Trong cột "Họ vần", thay text mờ `Chưa có` bằng nút bấm gọn `+ Tạo họ` (`styles.famCreateBtn`).
- Quản lý state mở `FamilyDrawer` với `initialWord`.
- Xử lý sự kiện `onSaved` gọi `router.refresh()`.
- Kiểm tra: `npx tsc --noEmit`.

### Bước 3 — Kiểm tra trực quan tại `/admin/vocab`
- Kiểm tra luồng tạo họ vần từ cả 2 vị trí (trên bảng và trong WordDrawer).
- Xác nhận ngăn kéo Họ vần mở lên với từ được gán sẵn, lưu thành công và cập nhật lại bảng từ vựng.
- Kiểm tra: Kiểm tra hiển thị.

### Bước 4 — Kiểm tra chất lượng và build
- Chạy `npx tsc --noEmit`.
- Chạy `npm run lint`.
- Chạy `npm run build`.
- Cập nhật `progress.md`, `README.md` và chạy `npm run tasks:dashboard`.
