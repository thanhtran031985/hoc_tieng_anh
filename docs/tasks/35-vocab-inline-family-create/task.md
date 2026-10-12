# 35 — Tạo nhanh Họ vần ngay trong Ngân hàng từ vựng

> Quy trình làm việc và quy tắc code: xem `AGENTS.md`.

## Mục tiêu
Bổ sung tính năng tạo nhanh Họ vần trực tiếp từ trang Ngân hàng từ vựng (`http://localhost:3000/admin/vocab`) khi một từ chưa thuộc họ vần nào. Cho phép người quản trị tạo họ vần mới với từ đó được điền sẵn vào danh sách thành viên mà không cần rời trang hoặc thao tác lặp lại nhiều lần.

## Thiết kế (nếu có)
- Hệ thống giao diện khu người lớn (Adult zone, `AdultDrawer`, `AdultButton`, `FamilyChip`).
- Chế độ Operate: thao tác liền mạch (seamless workflow), giảm thiểu chuyển trang, tự động điền ngữ cảnh có sẵn.

## Bối cảnh & môi trường
- Next.js App Router, TypeScript, React Server Actions.
- Các file liên quan:
  - `src/features/admin/VocabView.tsx`: Bảng danh sách từ vựng và ngăn kéo sửa từ `WordDrawer`.
  - `src/features/admin/FamilyDrawer.tsx`: Ngăn kéo soạn/tạo Họ vần.
  - `src/features/admin/vocab.module.css`: Kiểu dáng nút/chip họ vần trên bảng từ vựng.
  - `src/lib/rules/word-family.ts`: Hàm hỗ trợ tách vần và âm.

## Quyết định kiến trúc
1. **Hai điểm kích hoạt (Entry Points) trong `/admin/vocab`**:
   - **Tại cột "Họ vần" trong bảng dữ liệu (`AdultTable`)**: Với các từ chưa thuộc họ vần nào, thay vì chỉ hiển thị dòng chữ mờ `Chưa có`, cung cấp nút hoặc nhãn bấm được `+ Tạo họ` để mở ngay ngăn kéo tạo họ vần cho từ này.
   - **Tại ngăn kéo sửa từ (`WordDrawer`)**: Tại phần "Họ vần", khi từ chưa có họ vần (`row.families.length === 0`), thay thông báo thụ động bằng nút `Tạo họ vần cho từ này` (`AdultButton` với icon `plus`).
2. **Khởi tạo ngữ cảnh tự động cho `FamilyDrawer`**:
   - Bổ sung prop tùy chọn `initialWord?: FamilyEditorWord & { levelId?: number }` vào `FamilyDrawer`.
   - Khi `familyId === null` và có `initialWord`:
     - Tự động gợi ý mẫu vần `pattern` dựa trên âm vần của từ (ví dụ: tìm nguyên âm đầu tiên của từ như "cat" -> "at", "rain" -> "ain").
     - Tự động đưa từ đó vào danh sách `members` ban đầu với `sameSound: true`.
     - Tự động gán `levelId` theo cấp của từ.
3. **Đồng bộ dữ liệu tức thì sau khi lưu**:
   - Khi họ vần mới được lưu thành công trong `FamilyDrawer`, gọi `router.refresh()` để bảng từ vựng cập nhật ngay lập tức chip họ vần mới tạo cho từ.

## Các bước

### Bước 0 — Kiểm tra dự án và mã nguồn hiện tại (không sửa code)
- Khảo sát các luồng tương tác giữa `VocabView` và `FamilyDrawer`.
- Kiểm tra tính toàn vẹn TypeScript ban đầu (`npx tsc --noEmit`).

### Bước 1 — Nâng cấp `FamilyDrawer` hỗ trợ ngữ cảnh khởi tạo từ vựng ban đầu
- Bổ sung prop `initialWord` vào `FamilyDrawer`.
- Cập nhật hàm khởi tạo state khi `familyId === null` để tự động điền `pattern` gợi ý, `members` ban đầu và `levelId`.
- Kiểm tra: `npx tsc --noEmit`.

### Bước 2 — Tích hợp điểm kích hoạt tạo Họ vần trên `VocabView` và `WordDrawer`
- Cập nhật `WordDrawer`: thêm nút "Tạo họ vần cho từ này" khi `row.families.length === 0`.
- Cập nhật cột "Họ vần" trong `VocabView`: cung cấp nút bấm nhanh `+ Tạo họ` khi từ chưa có họ vần.
- Quản lý state mở `FamilyDrawer` với `initialWord` tương ứng.
- Kiểm tra: `npx tsc --noEmit`.

### Bước 3 — Kiểm tra trực quan tại `/admin/vocab`
- Kiểm tra thao tác bấm tạo họ vần từ cả 2 vị trí (trên bảng và trong WordDrawer).
- Xác nhận ngăn kéo Họ vần mở lên với từ được gán sẵn, lưu thành công và cập nhật lại bảng từ vựng.
- Kiểm tra: Kiểm tra hiển thị.

### Bước 4 — Kiểm tra chất lượng và build
- Chạy `npx tsc --noEmit`, `npm run lint`, `npm run build`.
- Đảm bảo toàn bộ dự án hoạt động trơn tru không lỗi.

## Phạm vi
- Được tạo/sửa:
  - `src/features/admin/FamilyDrawer.tsx`
  - `src/features/admin/VocabView.tsx`
  - `src/features/admin/vocab.module.css`
  - `src/lib/rules/word-family.ts` (nếu cần thêm hàm đoán vần `guessRimePattern`)
- KHÔNG làm trong task này:
  - Không sửa database schema (các model `Word`, `WordFamily`, `WordFamilyMember` đã có đầy đủ).
  - Không thay đổi logic chấm điểm hay bài học học sinh.

## Tiêu chí hoàn thành
- Tại trang `/admin/vocab`, người dùng có thể bấm tạo họ vần cho từ chưa có họ vần ngay tại cột bảng hoặc trong ngăn kéo sửa từ.
- Ngăn kéo Họ vần mở lên với từ đó đã nằm sẵn trong danh sách thành viên của họ vần mới.
- Lưu xong, họ vần mới xuất hiện ngay trên dòng của từ đó trong ngân hàng từ vựng.
- `npx tsc --noEmit`, `npm run lint`, `npm run build` đều pass không lỗi.
