# Kế hoạch — Task 01-setup (Khởi tạo dự án)

## Context
`d:\edu` đã có tài liệu (CLAUDE.md, PRD, DESIGN_SYSTEM, designs/, docs/tasks/, scripts/tasks-dashboard.mjs) nhưng chưa có mã nguồn Next.js, chưa phải git repo. Task 01 dựng khung chạy được: Next.js + Prisma/MySQL (XAMPP, đang chạy) + token/font + dashboard. Không có phụ thuộc. Môi trường: Node 25.2.1, npm 11.6.2, git có sẵn, `C:\xampp\mysql` có, `mysqld` đang chạy.

## Trạng thái kiểm tra trước khi làm
- `docs/tasks/01-setup/task.md` đầy đủ. `progress.md`, `decisions.md` chưa có → tạo từ `_template/`.
- README ghi 01 là ⬜ → đổi 🔄 khi bắt đầu.
- Chưa có git → cần `git init` rồi `git checkout -b feat/01-setup` (chờ bạn đồng ý).
- Đã có sẵn: `docs/tasks/_template/`, `scripts/tasks-dashboard.mjs`, `docs/prompts/dashboard.md` (Bước 3 chủ yếu là thêm script npm + sửa chữ "Covet").

## Việc cần bạn duyệt trước khi chạy
1. `git init` + tạo nhánh `feat/01-setup` + `.gitignore` (gồm `.env`, `storage/`, `node_modules`, `.next`, `goi-du-an.zip`).
2. Cài package (CLAUDE.md bắt buộc hỏi): `next react react-dom typescript tailwindcss @tailwindcss/postcss postcss eslint eslint-config-next @types/*`, `prisma` + `@prisma/client`, `zod`, `next-auth@beta` (v5), `bcryptjs` + `@types/bcryptjs`, `react-hot-toast`.
3. Tạo project vì thư mục đã có file: dùng `create-next-app` vào thư mục tạm rồi chép sang, hoặc `npm init` + cài tay để không đè `CLAUDE.md`, `docs/`, `designs/`.

## Bước 0 — Khởi tạo Next.js
- Tạo `package.json`, `tsconfig.json` (alias `@/*` → `src/*`), `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `src/app/layout.tsx`, `src/app/page.tsx` (trang trắng).
- Cấu trúc: `src/app`, `src/components/ui`, `src/lib`, `src/server`, `prisma/`, `storage/` (+ `.gitkeep`, nằm trong `.gitignore`).
- `.env.example` hiện còn là của Covet (`covetecom`, `admin@covet.local`) → sửa: `DATABASE_URL="mysql://root:@localhost:3306/hoc_tieng_anh"` (giá trị giữ chỗ), `AUTH_SECRET`, `AUTH_URL`, ADMIN_*. Không đọc `.env`; báo bạn tự điền `.env`.
- Kiểm tra: `npm run dev` mở `http://localhost:3000` thấy trang trắng.

## Bước 1 — Kết nối MySQL
- Bạn tạo DB `hoc_tieng_anh` (utf8mb4, `utf8mb4_unicode_ci`) trong phpMyAdmin và điền `.env`. Mình không đọc `.env`.
- `prisma/schema.prisma`: `provider = "mysql"`, một model tạm `SetupCheck` (id, createdAt) để thử migrate; ghi vào `decisions.md` là sẽ xóa ở task 03.
- Chạy `npx prisma migrate dev --name init` + `npx prisma generate`; `src/server/db.ts` (singleton PrismaClient, server-only).
- Kiểm tra: bảng xuất hiện trong phpMyAdmin (bạn xác nhận). Migration dùng kiểu chung cho MariaDB và MySQL 8.

## Bước 2 — Token và font
- `src/app/globals.css`: `@import "tailwindcss"`; khối `:root` chép nguyên từ `docs/DESIGN_SYSTEM.md` mục 13 (sinh từ `designs/tokens.json`); khối `[data-level="1..10"]` chép từ `designs/components/bundle.css` dòng 9–18; `@theme inline` ánh xạ token → class Tailwind. Đặt `--color-*: initial` để bỏ bảng màu mặc định.
- Ánh xạ `@theme inline`: màu (`--color-brand: var(--brand)`…, gồm `lv`, `lv-shade`, `lv-soft`, `lv-ink`, `on-lv`), `--font-*`, `--spacing-*`, `--radius-*`, `--shadow-*`, kích thước, duration, z-index. 14 kiểu chữ (`display-xl` … `key`, `thcs-title`, `thcs-body`) thành `--text-*` kèm line-height/weight, hoặc class tiện ích qua `@utility`.
- `src/app/layout.tsx`: `next/font/google` nạp Baloo 2, Nunito, Be Vietnam Pro với `subsets: ["latin","vietnamese"]`, biến `--font-display/body/thcs`; `<html lang="vi" data-theme="tieu-hoc">`.
- Trang thử tạm (`src/app/dev-tokens/page.tsx` hoặc `page.tsx`): 10 ô màu cấp qua `data-level` + lớp `bg-lv`, danh sách 14 kiểu chữ. Chỉ dùng class token; hex chỉ nằm trong `:root`. Xóa hoặc giữ ở route dev, ghi `decisions.md`.
- Kiểm tra: xem trang bằng mắt (cỡ chữ đúng); `grep` không có hex/px trong `src/components` và `src/app` (ngoài `globals.css`).
- Token thiếu: nếu có thì thêm vào theme và liệt kê trong báo cáo.

## Bước 3 — Quy trình task
- `package.json`: thêm `"tasks:dashboard": "node scripts/tasks-dashboard.mjs"`.
- Sửa chữ "Covet" → "Học cùng Bông" / "Edu" trong `scripts/tasks-dashboard.mjs` (title, h1, footer, tên file tải về) và `docs/prompts/dashboard.md`.
- Tạo `docs/tasks/01-setup/progress.md`, `decisions.md` từ `_template/`.
- Kiểm tra: `npm run tasks:dashboard` báo "Cảnh báo: 0". Nếu dashboard cảnh báo về README (README có dòng mô tả ngoài bảng, ký hiệu), báo lại và hỏi.

## Kiểm tra cuối task
`npx tsc --noEmit`, `npm run lint`, `npm run build`. Rồi đổi README thành ✅.

## Quy trình mỗi bước
Làm → tự kiểm tra → cập nhật `progress.md` + `npm run tasks:dashboard` → báo cáo → đề xuất commit `01-setup: step N — …` → DỪNG chờ "continue". Phiên này chỉ làm Bước 0. Sau khi duyệt, lưu bản kế hoạch này vào `docs/tasks/01-setup/plan.md`.

## File chính
Tạo: `package.json`, `src/app/{layout,page,globals.css}`, `prisma/schema.prisma`, `src/server/db.ts`, `.gitignore`, `docs/tasks/01-setup/{progress,decisions,plan}.md`.
Sửa: `.env.example`, `docs/tasks/README.md`, `scripts/tasks-dashboard.mjs`, `docs/prompts/dashboard.md`.
Không sửa: `designs/`, `task.md`, `CLAUDE.md`.
