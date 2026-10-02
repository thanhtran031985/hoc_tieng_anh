# Tiến độ — 01-setup — Khởi tạo dự án

Trạng thái chung: ✅ · Cập nhật lần cuối: 02/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Khởi tạo Next.js | ✅ | |
| 1 | Kết nối MySQL | ✅ | Prisma 7.10 + adapter-mariadb |
| 2 | Token và font | ✅ | Trang thử: /dev-tokens |
| 3 | Quy trình task | ✅ | Dashboard báo Cảnh báo: 0 |

## Nhật ký

### Bước 0 — Khởi tạo Next.js (02/10/2026)
- Package đã cài sẵn từ trước (Next 16.3.8, React 19.3, Tailwind 4.3, TS 6.0.3, Prisma, Zod, NextAuth v5 beta, bcryptjs, react-hot-toast); không cài thêm.
- Tạo: `tsconfig.json` (alias `@/*` → `src/*`), `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `src/app/{layout,page,globals}`, thư mục `src/components/ui`, `src/lib`, `src/server`, `storage/` (đều có `.gitkeep`).
- Sửa `.env.example` từ Covet sang Edu.
- Kiểm tra: `npm run dev` chạy, `GET /` trả 200, `<html lang="vi" data-theme="tieu-hoc">`; `npx tsc --noEmit` và `npm run lint` không lỗi. Chưa chạy `npm run build` (để cuối task).
- Việc cần làm thủ công: mở `http://localhost:3000` xem trang trắng; kiểm tra `.env` đã có `DATABASE_URL`, `AUTH_SECRET` (tôi không đọc `.env`).
- Lưu ý: Next.js dev in "Generated CLAUDE.md for AI agents"; đã kiểm tra, `CLAUDE.md` của dự án không bị đổi và không có `AGENTS.md`.

### Bước 1 — Kết nối MySQL (02/10/2026)
- Hạ `prisma` về 7.10.0 (cùng `@prisma/client`); cài thêm `@prisma/adapter-mariadb@^7.10.0`. Cả hai đã được duyệt.
- Tạo `prisma/schema.prisma` (provider `mysql`, model tạm `SetupCheck`), `prisma.config.ts`, `src/server/db.ts`; thêm `src/generated/` vào `.gitignore`.
- Chạy `npx prisma migrate dev --name init` (migration `20261002063844_init`) và `npx prisma generate`.
- Kiểm tra:
  - Bảng `setupcheck` và `_prisma_migrations` có trong database `hoc_tieng_anh` (MariaDB 10.4.32), collation `utf8mb4_unicode_ci`.
  - Thử tạo, đếm và xóa một dòng qua `db` bằng route tạm: trả 200. Route đã xóa, bảng sạch (0 dòng).
  - `npx tsc --noEmit` và `npm run lint` không lỗi.
- Việc cần làm thủ công: mở phpMyAdmin xác nhận bảng.
- Lưu ý: `npm audit` báo 4 lỗi mức high ở các gói đã cài. Chưa xử lý (không chạy `audit fix --force` khi chưa hỏi).

### Bước 2 — Token và font (02/10/2026)
- Sinh `src/app/globals.css` từ `docs/DESIGN_SYSTEM.md` mục 13 (144 token) và `designs/components/bundle.css` dòng 9–18 (khối `data-level`), không chép tay. Cách ánh xạ sang Tailwind v4 ghi ở `decisions.md`.
- `src/app/layout.tsx` nạp Baloo 2, Nunito, Be Vietnam Pro bằng `next/font/google`.
- Tạo trang thử `src/app/dev-tokens/page.tsx`: 10 ô màu cấp (qua `data-level` + `bg-lv`) và 15 kiểu chữ.
- Kiểm tra:
  - Xem trang bằng ảnh chụp 1440 px: 10 màu cấp đúng, 15 kiểu chữ đúng họ chữ, có dấu tiếng Việt.
  - CSS sinh ra có cỡ/dòng/đậm khớp bảng chữ (vd `display-xl` 56/62/800, `word-xl` 72/80/800, `key` 13/16/800, `thcs-body` 17/26/500).
  - `grep` không có hex/px nào trong `src/` ngoài `globals.css`.
  - `npx tsc --noEmit`, `npm run lint`, `npm run build` đều không lỗi. Bản production (`next start`): `/` trả 200, `/dev-tokens` trả 404.
- Token thiếu: không có. Token chữ (14 kiểu) không nằm trong `:root` của DESIGN_SYSTEM nên khai báo trực tiếp trong `@theme static` theo bảng mục 3.
- Việc cần làm thủ công: chạy `npm run dev`, mở `http://localhost:3000/dev-tokens` xem bằng mắt.
- Lưu ý: `@utility border-thin|thick` áp viền cả 4 cạnh; một cạnh dùng `border-b-(length:--border-thin)`.

### Bước 3 — Quy trình task (02/10/2026)
- `_template/`, `scripts/tasks-dashboard.mjs`, `docs/prompts/dashboard.md` và script `tasks:dashboard` đã có sẵn nên không chép lại. Đổi chữ Covet → Học cùng Bông ở script (tiêu đề, chân trang, tên file PNG/PDF) và prompt.
- Dashboard báo 13 cảnh báo vì bảng trong `docs/tasks/README.md` thiếu cột `#`/`Task`. Đã chuyển bảng sang định dạng dashboard đọc được (nội dung giữ nguyên), chi tiết ở `decisions.md`.
- Kiểm tra: `npm run tasks:dashboard` báo "Cảnh báo: 0", đọc được 12 task, task 01 hiện 3/4 bước ✅ trước khi cập nhật bước này.
- Việc cần làm thủ công: mở `docs/tasks/dashboard.html` trong trình duyệt xem sơ đồ phụ thuộc.

### Kiểm tra cuối task (02/10/2026)
- `npx tsc --noEmit`, `npm run lint`, `npm run build` đều không lỗi (build ra `/`, `/_not-found`, `/dev-tokens`). Đã đổi task 01 thành ✅ trong `docs/tasks/README.md`.
- Lưu ý còn lại: `npm audit` báo 4 lỗi mức high ở gói đã cài, chưa xử lý; chưa push lên GitHub.

## Bước tiếp theo

Task 01 đã xong. Task kế tiếp: 02-ui-kit hoặc 03-db-core (cùng phụ thuộc 01).
