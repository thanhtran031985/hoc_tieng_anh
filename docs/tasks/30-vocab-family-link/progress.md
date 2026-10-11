# Tiến độ — 30-vocab-family-link — Ngân hàng từ vựng: xem từ thuộc Họ vần nào và bấm để mở

Trạng thái chung: 🔄 · Cập nhật lần cuối: 11/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|------|-----|------------|---------|
| 0 | Kiểm tra hiện trạng (không sửa code) | ✅ | DB verify: 1142 từ không thuộc họ nào, 252 từ thuộc 1 họ, 0 từ thuộc 2+ họ |
| 1 | Dữ liệu và hàm thuần | ✅ | Hàm gộp/sắp xếp + 1 truy vấn cho cả bảng; 9 test mới |
| 2 | Cột “Họ vần”, bộ lọc và mục trong ngăn kéo | ⬜ | |
| 3 | Bấm chip mở Họ vần | ⬜ | |
| 4 | Kiểm tra cuối | ⬜ | |

## Nhật ký
<!-- Mỗi bước thêm một mục:
### Bước N — <tên> (<ngày>)
- Đã làm:
- File tạo/sửa:
- Kết quả kiểm tra:
- Việc tôi cần làm thủ công:
-->

### Bước 0 — Kiểm tra hiện trạng (11/10/2026)
- **Đã làm** (bạn giao toàn quyền nên làm theo mặc định ở 4 câu hỏi cuối `task.md`; kế hoạch đã lưu ở `plan.md`, gồm cả task 31): đọc `vocab.ts` (đã gộp Khám phá theo từ bằng `groupBy`, mẫu để thêm họ vần), `VocabView.tsx` (cột `explorerState`, `filters`, `exploring` + `ExplorerDrawer`, mục “Khám phá từ” trong `WordDrawer`), `FamilyDrawer.tsx` (props `familyId`, `onClose`, `onSaved`) và `FamiliesView.tsx`. Đếm trên database thử: 1142 từ chưa thuộc họ nào, 252 từ thuộc 1 họ, chưa có từ nào thuộc 2 họ trở lên (kiểm nhiều họ phải thêm dữ liệu thử rồi dọn).
- **Quyết định trình bày**: cột “Họ vần” hiện chip theo từng họ (`-at`), tối đa 2 chip rồi “+n”; từ Bẫy có dấu “Bẫy”; họ Nháp mờ như cột Khám phá; bấm chip mở `FamilyDrawer` ngay trong màn từ vựng.
- **Việc thủ công**: không.

### Bước 1 — Dữ liệu và hàm thuần (11/10/2026)
- **Đã làm**: `src/lib/rules/admin-vocab.ts` thêm `WordFamilyRef`, `groupFamiliesByWord` (gộp các dòng thành viên theo từ, Cùng âm trước Bẫy rồi vần a–z), `sortFamilyRefs`, `splitFamilyChips` (tối đa 2 chip rồi “+n”), `familyFilterState`, `familyRefLabel`; `src/server/admin/vocab.ts`: `getVocab()` thêm đúng một truy vấn `wordFamilyMember.findMany` cho cả bảng và trả `families` ở mỗi `VocabRow`.
- **Kiểm tra**: 9 test mới ở `admin-vocab.test.ts` (0 họ, 1 họ, nhiều họ, vừa Cùng âm vừa Bẫy, trạng thái lạ → Nháp, không đổi mảng gốc), `npx tsc --noEmit` và `npm run lint` sạch.
- **Việc thủ công**: không.

## Bước tiếp theo

Bước 2 — Cột “Họ vần”, bộ lọc và mục trong ngăn kéo.
