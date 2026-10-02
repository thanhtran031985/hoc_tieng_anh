# Tiến độ — 01-setup — Khởi tạo dự án

Trạng thái chung: 🔄 · Cập nhật lần cuối: 02/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Khởi tạo Next.js | ✅ | |
| 1 | Kết nối MySQL | ✅ | Prisma 7.10 + adapter-mariadb |
| 2 | Token và font | ⬜ | |
| 3 | Quy trình task | ⬜ | Script `tasks:dashboard` đã có trong package.json |

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

## Bước tiếp theo

Bước 2 — Token và font: chuyển token từ `designs/tokens.json` vào `globals.css` + `@theme inline`, thêm khối `data-level`, nạp font Baloo 2 / Nunito / Be Vietnam Pro.
