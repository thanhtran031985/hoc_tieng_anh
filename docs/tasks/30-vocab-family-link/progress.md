# Tiến độ — 30-vocab-family-link — Ngân hàng từ vựng: xem từ thuộc Họ vần nào và bấm để mở

Trạng thái chung: ✅ · Cập nhật lần cuối: 11/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|------|-----|------------|---------|
| 0 | Kiểm tra hiện trạng (không sửa code) | ✅ | DB verify: 1142 từ không thuộc họ nào, 252 từ thuộc 1 họ, 0 từ thuộc 2+ họ |
| 1 | Dữ liệu và hàm thuần | ✅ | Hàm gộp/sắp xếp + 1 truy vấn cho cả bảng; 9 test mới |
| 2 | Cột “Họ vần”, bộ lọc và mục trong ngăn kéo | ✅ | Cột Họ vần, bộ lọc, mục trong ngăn kéo từ; 2 chip + “+n” |
| 3 | Bấm chip mở Họ vần | ✅ | Mở FamilyDrawer tại chỗ; Tab/Enter; làm mới bảng sau khi lưu |
| 4 | Kiểm tra cuối | ✅ | test 734, tsc, lint, build sạch; spec Playwright viết, chưa chạy (cần đồng ý riêng) |

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

### Bước 2 và 3 — Cột “Họ vần”, bộ lọc, ngăn kéo từ, bấm chip mở họ (11/10/2026)
- **Đã làm**: `VocabView.tsx` thêm cột “Họ vần” (sắp xếp theo số họ): tối đa 2 chip `-at` rồi “+n”; chip Cùng âm xanh, Bẫy có chữ “Bẫy”, họ Nháp nét đứt và mờ (như cột Khám phá); từ chưa thuộc họ nào ghi “Chưa có”. Bộ lọc “Họ vần” (Đã thuộc họ vần / Chưa có). Ngăn kéo sửa từ có mục “Họ vần” liệt kê đủ các họ (IPA, cùng âm / bẫy, nháp / xuất bản). Bấm chip hoặc dòng ở ngăn kéo mở `FamilyDrawer` ngay trong màn từ vựng (ngăn kéo từ đóng lại); lưu họ xong thì `router.refresh()` và mở lại ngăn kéo họ với dữ liệu mới (như màn Họ vần). Chip là `<button>` có nhãn “Mở họ vần -at, cùng âm, nháp của từ cat”, dùng được bằng Tab và Enter. CSS dùng token sẵn (`vocab.module.css`: `.fams`, `.fam`, `.famSame`, `.famTrap`, `.famDraft`, `.famMore`, `.famList`); không thêm token mới.
- **Kiểm tra** (Edge không đầu, DB verify, `.tmp-verify/check-30-vocab.mjs`; thêm 2 họ thử cho `cat` để có 3 họ rồi dọn): 20/20 mục đạt — cat hiện 2 chip + “+1”, Cùng âm đứng trước Bẫy, từ chưa thuộc họ nào hiện “Chưa có” và không có chip; lọc “Đã thuộc họ vần” 252 từ và “Chưa có” 1142 từ khớp database; sắp xếp giảm dần đưa cat (3 họ) lên đầu; bấm chip `-at` mở đúng họ `-at`, “Hủy” về bảng còn nguyên tìm kiếm; ngăn kéo từ liệt kê đủ 3 họ (Bẫy, Nháp, Xuất bản) và bấm họ Bẫy mở đúng họ; Tab + Enter mở họ; không cuộn ngang ở 1366×768 và 1440×900; gỡ `cat` khỏi `-at` rồi tải lại thì chip `-at` biến mất. Thử để chip không xuống dòng thì đẩy cột nút ra ngoài màn 1366, nên giữ xuống dòng.
- **Việc thủ công**: không.

### Bước 4 — Kiểm tra cuối (11/10/2026)
- `npm test` 734/734, `npx tsc --noEmit`, `npm run lint`, `npm run build` sạch.
- Viết `tests/e2e/30-tu-vung-ho-van.spec.ts` (6 test, tên tiếng Việt: chip và +1, thứ tự và nhãn, bộ lọc, bấm chip mở họ, mở từ ngăn kéo từ, không cuộn ngang; tự tạo dữ liệu “zq…” và dọn). **Chưa chạy**: `npm run test:e2e:db` làm `prisma migrate reset` trên database thử nên cần bạn đồng ý riêng (task 900 bước 4 gom việc chạy Playwright). Spec đã qua `tsc` và `eslint`.

## Checklist test thủ công
- [ ] Mở Quản trị › Ngân hàng từ vựng, tìm một từ đã thuộc họ (vd `cat`): thấy chip `-at`; từ chưa thuộc họ nào ghi “Chưa có”.
- [ ] Bấm chip: mở ngăn kéo Họ vần của họ đó; sửa và Lưu xong thì chip trong bảng cập nhật.
- [ ] Mở một từ (nút bút): mục “Họ vần” liệt kê đủ các họ, bấm một họ để mở.
- [ ] Lọc “Họ vần: Chưa có” để thấy các từ chưa vào họ nào.

## Bước tiếp theo

Hoàn thành.
