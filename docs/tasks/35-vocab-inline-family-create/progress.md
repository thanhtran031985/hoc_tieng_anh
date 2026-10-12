# Tiến độ — 35-vocab-inline-family-create

Trạng thái chung: ✅ · Cập nhật lần cuối: 2026-10-12

| Bước | Tên | Trạng thái | Ghi chú |
|------|-----|:----------:|---------|
| Bước 0 | Kiểm tra dự án và mã nguồn hiện tại | ✅ | Nhánh feat/35-vocab-inline-family-create, tsc exit 0 |
| Bước 1 | Nâng cấp `FamilyDrawer` hỗ trợ ngữ cảnh khởi tạo từ vựng ban đầu | ✅ | guessRimePattern, guessSoundIpa, initialWord |
| Bước 2 | Tích hợp điểm kích hoạt tạo Họ vần trên `VocabView` và `WordDrawer` | ✅ | Nút + Tạo họ trên bảng và nút trong WordDrawer |
| Bước 3 | Kiểm tra trực quan tại `/admin/vocab` | ✅ | Giao diện chuẩn xác, điền sẵn thông minh, lưu mượt mà |
| Bước 4 | Kiểm tra chất lượng và build | ✅ | tsc, lint, build đều exit 0 |

## Nhật ký

### Bước 0 — Kiểm tra dự án và mã nguồn hiện tại (2026-10-12)
- Đã làm:
  - Tạo và chuyển sang nhánh git `feat/35-vocab-inline-family-create`.
  - Khảo sát mã nguồn hiện tại của `VocabView.tsx`, `FamilyDrawer.tsx`, schema Prisma (`WordFamily`, `WordFamilyMember`) và các rules liên quan.
  - Thống nhất cơ chế: Hệ thống tự động phân tích từ vựng để gợi ý mẫu vần `pattern` và âm `soundIpa`, điền sẵn từ vào danh sách thành viên ban đầu (`sameSound: true`), người quản trị có toàn quyền xem lại và chỉnh sửa trước khi lưu.
  - Chạy `npx tsc --noEmit` xác nhận toàn bộ dự án TypeScript sạch lỗi (exit code 0).
- File tạo/sửa:
  - `docs/tasks/35-vocab-inline-family-create/task.md`
  - `docs/tasks/35-vocab-inline-family-create/plan.md`
  - `docs/tasks/35-vocab-inline-family-create/decisions.md`
  - `docs/tasks/35-vocab-inline-family-create/progress.md`
  - `docs/tasks/README.md`
- Kết quả kiểm tra: `npx tsc --noEmit` exit 0.

### Bước 1 — Nâng cấp `FamilyDrawer` hỗ trợ ngữ cảnh khởi tạo từ vựng ban đầu (2026-10-12)
- Đã làm:
  - Thêm 2 hàm tiện ích `guessRimePattern(word)` và `guessSoundIpa(ipa)` trong `src/lib/rules/word-family.ts`.
  - Mở rộng prop `initialWord` trong `FamilyDrawer.tsx`: khi `familyId === null` và có `initialWord`, tự động điền `pattern` dự đoán, `soundIpa` trích xuất từ IPA, gán `levelId` và đưa từ đó vào danh sách `members` với `sameSound: true`.
- Kết quả kiểm tra: `npx tsc --noEmit` exit 0.

### Bước 2 — Tích hợp điểm kích hoạt tạo Họ vần trên `VocabView` và `WordDrawer` (2026-10-12)
- Đã làm:
  - Cập nhật cột "Họ vần" trong `AdultTable` của `VocabView`: các từ chưa có họ vần hiển thị nút bấm nhanh `+ Tạo họ` (`styles.famCreateBtn`) với `e.stopPropagation()`.
  - Cập nhật ngăn kéo `WordDrawer`: tại mục Họ vần khi từ chưa thuộc họ nào, hiển thị nút `AdultButton label="Tạo họ vần cho từ này" icon="plus" variant="secondary" size="s"`.
  - Kết nối callback `onCreateFamily` và mở `FamilyDrawer` với ngữ cảnh từ được chọn, lưu thành công tự động kích hoạt `router.refresh()` cập nhật chip họ vần trên bảng.
  - Bổ sung styles CSS `.famCreateBtn` và `.famEmptyRow` trong `vocab.module.css`.
- Kết quả kiểm tra: `npx tsc --noEmit` exit 0.

### Bước 3 — Kiểm tra trực quan tại `/admin/vocab` (2026-10-12)
- Đã làm:
  - Kiểm tra tương tác: cả 2 điểm kích hoạt (trên bảng và trong ngăn kéo) đều mở `FamilyDrawer` với dữ liệu được điền trước chuẩn xác.
  - Quản trị viên có thể xem lại, sửa `pattern`, `soundIpa`, thêm các từ khác trong kho hoặc dùng AI trước khi lưu.
- Kết quả kiểm tra: Giao diện và luồng dữ liệu chuẩn xác, nhất quán.

### Bước 4 — Kiểm tra chất lượng và build (2026-10-12)
- Đã làm:
  - Chạy `npx tsc --noEmit`: exit 0.
  - Chạy `npm run lint`: exit 0, 0 errors.
  - Chạy `npm run build`: exit 0, production bundle biên dịch thành công 100%.
- Kết quả kiểm tra: Toàn bộ kiểm thử đều pass.

## Bước tiếp theo
- Hoàn tất task, thông báo cho người dùng vào nghiệm thu tại `http://localhost:3000/admin/vocab`.
