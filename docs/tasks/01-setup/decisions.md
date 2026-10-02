# Quyết định — 01-setup

### 02/10/2026 — Giữ nguyên các package đã cài sẵn
- Bối cảnh: `package.json` và `node_modules` đã có từ trước khi Bước 0 bắt đầu.
- Quyết định: Bước 0 dùng nguyên các package đó, không cài thêm.
- Lý do: CLAUDE.md cấm cài package khi chưa hỏi; Bước 0 chỉ cần Next, React, Tailwind, ESLint, TypeScript.
- Ảnh hưởng: không có.

### 02/10/2026 — Đưa Prisma về 7.x ổn định
- Bối cảnh: `prisma` là `^8.0.0-rc.19` (bản rc) còn `@prisma/client` là `^7.10.0`. Hai gói khác major.
- Quyết định: hạ `prisma` xuống `^7.10.0` (đã được duyệt).
- Lý do: tránh bản rc, hai gói cùng major.
- Ảnh hưởng: `prisma` và `@prisma/client` cùng 7.10.0.

### 02/10/2026 — Cách dùng Prisma 7 trong dự án
- Quyết định:
  - Thêm `@prisma/adapter-mariadb@^7.10.0` (đã được duyệt). Prisma 7 bắt buộc driver adapter khi chạy; adapter này dùng được cho cả MariaDB (XAMPP) lẫn MySQL 8 (hosting).
  - Generator `prisma-client`, output `src/generated/prisma` (đã thêm vào `.gitignore`).
  - URL database đặt trong `prisma.config.ts`, không còn trong `schema.prisma`. File này nạp `.env` bằng `process.loadEnvFile` của Node, không cần `dotenv`.
  - `src/server/db.ts` tạo một PrismaClient dùng chung (singleton theo `globalThis`).
- Ảnh hưởng:
  - Sau khi clone hoặc đổi schema phải chạy `npx prisma generate` (thư mục `src/generated` không commit).
  - Chưa có `import "server-only"` trong `db.ts` vì chưa cài gói `server-only` (cần hỏi nếu muốn thêm).

### 02/10/2026 — Model tạm `SetupCheck`
- Quyết định: model tạm (id, createdAt) chỉ để thử migrate ở task 01. Xóa ở task 03 (db-core) bằng migration mới.

### 02/10/2026 — Tên bảng trên Windows bị đổi thành chữ thường
- Bối cảnh: MariaDB của XAMPP trên Windows dùng `lower_case_table_names`, bảng `SetupCheck` hiện là `setupcheck`. Hosting Linux phân biệt hoa thường.
- Quyết định (đề xuất cho task 03): mọi model dùng `@@map("snake_case")` để tên bảng giống nhau ở cả hai môi trường.
- Ghi chú: collation mặc định của database là `utf8mb4_general_ci`, nhưng Prisma tạo bảng với `utf8mb4_unicode_ci` như CLAUDE.md yêu cầu, nên không ảnh hưởng.

### 02/10/2026 — Sửa `.env.example` từ bản Covet sang Edu
- Quyết định: đổi `covetecom` → `hoc_tieng_anh`, `admin@covet.local` → `admin@edu.local`, chú thích sang tiếng Việt. Giá trị giữ chỗ, không có secret.
- Ảnh hưởng: anh/chị tự điền `.env` (Claude không đọc `.env`).

### 02/10/2026 — `designs/` và `scripts/` bị loại khỏi tsconfig và ESLint
- Quyết định: `exclude`/`globalIgnores` hai thư mục này.
- Lý do: `designs/` là bản tải về từ Claude Design (không sửa); `scripts/` là file `.mjs` công cụ.
