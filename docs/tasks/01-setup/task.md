# 01-setup — Khởi tạo dự án

Ngày tạo: 02/10/2026 · Giai đoạn: GĐ1 · Phụ thuộc: — · Nhánh: `feat/01-setup`

## Mục tiêu
Dựng khung dự án Next.js chạy được trên máy với MySQL của XAMPP, có sẵn token thiết kế, font và quy trình task.

## Phạm vi
- Trong: khởi tạo Next.js (App Router, TypeScript, Tailwind), Prisma kết nối MySQL `hoc_tieng_anh`, token và font, cấu trúc thư mục, lệnh `tasks:dashboard`.
- Ngoài: mọi màn hình, đăng nhập, bảng dữ liệu nghiệp vụ.

## Thiết kế
- `designs/tokens.json`, `designs/README.md`, `designs/components/bundle.css` (phần biến `data-level`).
- `docs/DESIGN_SYSTEM.md` mục 13 (`:root` khởi đầu).

## Quyết định kiến trúc
- Tailwind v4: token đặt ở `:root` trong `app/globals.css` và khai báo lại trong `@theme inline`; bỏ bảng màu mặc định của Tailwind giống Covet.
- Font Baloo 2, Nunito (và Be Vietnam Pro cho THCS sau này) tải bằng `next/font/google`.
- `<html data-theme="tieu-hoc">` mặc định; khối `[data-level="1..10"]` lấy từ `bundle.css`.
- Thư mục: `src/app`, `src/components/ui`, `src/lib` (quy tắc PRD Phần F), `src/server` (truy cập DB), `prisma/`, `storage/` (file tải lên, nằm ngoài `public/`, có trong `.gitignore`).

## Các bước
### Bước 0 — Khởi tạo Next.js
Tạo dự án, cài Prisma, Zod, NextAuth v5, bcryptjs, react-hot-toast (hỏi trước khi cài). Tạo `.env.example`.
**Kiểm tra:** `npm run dev` mở được trang trắng ở `http://localhost:3000`.

### Bước 1 — Kết nối MySQL
`prisma/schema.prisma` provider `mysql`, một model tạm để thử migrate.
**Kiểm tra:** `npx prisma migrate dev` chạy được trên XAMPP; bảng xuất hiện trong phpMyAdmin.

### Bước 2 — Token và font
Chuyển toàn bộ token từ `designs/tokens.json` vào `globals.css` + `@theme inline`; thêm khối `data-level`; nạp font.
**Kiểm tra:** trang thử hiển thị 10 ô màu cấp, các kiểu chữ `display-xl` … `key` đúng cỡ; không có mã hex trong component.

### Bước 3 — Quy trình task
Chép `docs/tasks/_template/`, `scripts/tasks-dashboard.mjs`, `docs/prompts/dashboard.md` từ Covet; thêm script `tasks:dashboard`.
**Kiểm tra:** `npm run tasks:dashboard` báo "Cảnh báo: 0".

## Kiểm tra cuối task
`npx tsc --noEmit`, `npm run lint`, `npm run build` không lỗi.
