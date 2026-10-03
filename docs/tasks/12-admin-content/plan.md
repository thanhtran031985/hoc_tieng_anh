# Task 12 · Bước 0 — Khung quản trị và Bảng điều khiển (Adult08)

## Context
Task 12 (quản trị nội dung) vừa bắt đầu; README đã đổi 🔄. Bước 0 dựng khung `(admin)` chỉ cho role `admin` + cổng bố mẹ đang mở, và màn Bảng điều khiển theo `designs/components/Adult08-Dashboard` (4 trạng thái). Trong thư mục làm việc đã có sẵn bản nháp chưa commit (từ phiên trước), được rà soát và dùng lại:
- `src/lib/rules/admin-dashboard.ts` + `.test.ts` — hàm thuần: `percent`, `isLowCoverage` (<90%), `sumByLevel`, `peakLevel`, `pickWarnings`.
- `src/server/admin-gate.ts` — `requireAdmin()`: đăng nhập → role admin (khác thì 404) → cổng bố mẹ mở (chưa thì `/profiles`). Đúng quyết định 03/10 trong `decisions.md`.
- `src/server/admin/dashboard.ts` — `getDashboard()` đọc số liệu bằng Prisma (groupBy theo cấp, chủ đề `planned`, cảnh báo).

Chưa có: layout `(admin)`, giao diện, loading/error, test cho `getDashboard`, lối vào từ khu bố mẹ.

## Việc làm
1. **Rà soát bản nháp** (đọc kỹ, sửa nếu sai): chạy `npm test` cho `admin-dashboard.test.ts`; kiểm `getDashboard` — "Chủ đề" chỉ đếm `status != planned`; cảnh báo "chưa đủ 4 bài" bỏ qua chủ đề khung; số bài theo cấp tính cả bài nháp.
2. **Layout `src/app/(admin)/layout.tsx`** (server): `requireAdmin()` rồi bọc `AdultArea` + `ToastProvider` + khung `AdminFrame` — theo mẫu `src/app/(parent)/layout.tsx`. `src/features/admin/AdminFrame.tsx` (client) bọc `AdultShell area="admin"`, suy ra mục menu đang mở từ `usePathname()` (`ADMIN_NAV` trong `src/components/adult/nav.ts`; Bước 0 chỉ `dash` đã `ready`), `onLock` = `lockParentAreaAction` có sẵn ở `@/features/parent/actions`. Tiêu đề "Bảng điều khiển nội dung", crumb "Cập nhật <updatedAt>" lấy từ trang (qua `AdminFrame` chỉ tiêu đề cố định; crumb đặt trong trang nếu shell không cho — nếu cần, thêm slot).
3. **Trang `src/app/(admin)/admin/page.tsx`** (thay bản giữ chỗ): `await requireAdmin()` rồi `getDashboard()` → `<DashboardView data>`. Trống (`isEmpty`) → `AdultEmpty` "Kho nội dung đang trống". Bỏ `requireRole` cũ.
4. **`src/features/admin/DashboardView.tsx`** (client, `dashboard.module.css` dùng token, không hex/px):
   - 4 `Kpi`: Từ vựng (kèm "x có hình"), Bài học (xuất bản · nháp), Câu hỏi (+tuần này), Chủ đề (xuất bản · nháp · chưa có bài). Thẻ "Chủ điểm ngữ pháp" của thiết kế là GĐ3 nên thay bằng "Chủ đề" → ghi `decisions.md`.
   - Biểu đồ theo cấp: `AdultSegmented` Từ vựng/Bài học/Câu hỏi + `VBars` với `level: i+1` (màu `level-N`).
   - Thẻ "Cần bổ sung" từ `warnings` (icon + ví dụ dạng pill). Nút hành động trong cảnh báo chỉ là link khi mục menu đích `ready`; các bước sau bật dần.
   - Thẻ "Chủ đề chưa có bài": `VBars` (`plannedByLevel`, `max: 3`) + danh sách `planned` có `data-level`, nhãn `<Status kind="none" label="Chưa có bài">`, số từ mục tiêu.
   - Bảng độ phủ theo cấp bằng `AdultTable` (tìm, lọc chặng, sắp xếp, phân trang 5): cột Cấp (chấm màu `--lv`), Chặng, Chủ đề, Từ vựng, Có hình %, Có âm thanh % (dưới 90% tô `field-error` bằng `isLowCoverage`), Bài học, Câu hỏi. Nút "Xuất Excel" và "Thêm từ mới" để mờ "Sắp có" tới Bước 2/6.
5. **`src/app/(admin)/admin/loading.tsx`** (khung xương 4 KPI + biểu đồ + cảnh báo + bảng) và **`error.tsx`** (`AdultError` mã `CMS-503`, nút Thử lại).
6. **Lối vào từ khu bố mẹ**: `AdultShell` đã có link "Quản trị" cho admin → `/admin`; xác nhận hoạt động (mở cổng ở `/parent/unlock` → `/parent` → "Quản trị"). Không đổi `src/proxy.ts` (đã bảo vệ `/admin`).
7. **Server action**: Bước 0 chưa có hành động ghi; mọi action sau này gọi `requireAdmin()` ở dòng đầu (ghi vào `progress.md`). Kiểm "gọi thẳng server action" bằng test cho `requireAdmin` không thể chạy ngoài Next, nên kiểm bằng thủ công + review.
8. **Tài liệu**: `progress.md` (Bước 0 ✅ + nhật ký), `decisions.md` (4 thẻ KPI thay thẻ ngữ pháp; nút hành động mờ theo `ready`), chạy `npm run tasks:dashboard`.

## File chính
Mới: `src/app/(admin)/layout.tsx`, `src/app/(admin)/admin/{loading,error}.tsx`, `src/features/admin/{AdminFrame,DashboardView}.tsx`, `src/features/admin/dashboard.module.css`.
Sửa: `src/app/(admin)/admin/page.tsx`, `src/components/adult/nav.ts` (không đổi ở Bước 0 nếu không cần).
Dùng lại (không viết lại): `AdultShell/AdultCard/AdultGrid/Kpi/VBars/AdultTable/AdultSegmented/Status/AdultEmpty/AdultError/AdultSkeleton` (`src/components/adult`), `lockParentAreaAction`, `toHair` không cần.

## Kiểm tra (theo task.md)
- `npm test` (admin-dashboard) · `npx tsc --noEmit` · `npm run lint` · `npm run build`.
- Tài khoản `parent` vào `/admin` → 404; admin chưa mở cổng → về `/profiles`; mở cổng rồi mới vào được.
- 4 trạng thái: bình thường, đang tải (loading.tsx), trống (DB không có nội dung — kiểm bằng dữ liệu giả/đọc `isEmpty`), lỗi (nút Thử lại).
- Biểu đồ 10 cột đúng màu cấp; cảnh báo thiếu hình/âm thanh hiện đúng số; thẻ "Chủ đề chưa có bài" đếm đúng theo cấp so với DB seed.
- Mở trang bằng trình duyệt ở 1440×900 và 1366×768, so với preview Adult08.


---
## Bước 1 — Cây lộ trình (Adult09)
Kế hoạch thực hiện: luật thuần + Zod (`admin-tree`), `server/admin/tree.ts` (đọc cây, sửa, thêm, xóa, sắp xếp), server action gọi `requireAdmin()`, hook kéo thả `useSortable`/`AdultSortable` dùng chung, `TreeView` (cây, khung sửa, khung chủ đề khung, ngăn kéo từ mục tiêu, hộp thoại thêm/xóa), trang `/admin/tree` + loading + error, bật mục menu. Chi tiết và chỗ khác thiết kế ở `decisions.md`.
