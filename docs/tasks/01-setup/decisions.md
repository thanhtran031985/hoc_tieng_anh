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

### 02/10/2026 — Cách đưa token vào Tailwind v4 (`src/app/globals.css`)
- Bối cảnh: token `radius-*`, `shadow-*`, `font-*` trùng tên namespace của Tailwind; ánh xạ `--radius-sm: var(--radius-sm)` trong `@theme inline` sẽ tự tham chiếu vòng.
- Quyết định:
  - `:root` chứa màu, `space-*`, `size-*`, `border-*`, `duration-*`, `z-*` (đúng tên trong DESIGN_SYSTEM mục 13), cộng khối `[data-level="1..10"]` chép nguyên từ `bundle.css` dòng 9–18.
  - `@theme inline` ánh xạ màu → `bg-brand`, `text-ink`, `bg-lv`… và `space-N` → `p-4`, `gap-6`…; `size-*` → `h-btn-l`, `w-speaker-s`, `h-topbar`, `min-h-lesson`, `max-w-content`.
  - `radius-*`, `shadow-*`, `font-*` và 15 kiểu chữ khai báo thẳng trong `@theme static` (một nơi duy nhất, vẫn dùng được `var(--radius-md)`).
  - Bỏ bảng màu, cỡ chữ, bo góc, bóng, khoảng cách và container mặc định của Tailwind. Vì vậy `p-7`, `w-32`, `text-xl`… không tồn tại: chỉ dùng token.
  - Tailwind không có namespace cho z-index, thời lượng và độ dày viền, nên thêm `@utility`: `z-map|sticky|feedback|dialog|burst`, `duration-fast|base|slide|celebrate`, `border-thin|thick` (áp cả 4 cạnh; một cạnh dùng `border-b-(length:--border-thin)`).
  - Kiểu chữ: `text-<kiểu>` đặt cỡ + dòng + đậm; họ chữ chọn riêng: `font-display` cho `display-xl … button-l`, `font-body` cho `body-l … key`, `font-thcs` cho `thcs-*`.
- Ảnh hưởng: `globals.css` được sinh một lần từ `docs/DESIGN_SYSTEM.md` mục 13; từ nay sửa tay. Token đổi thì sửa theo `designs/tokens.json` / DESIGN_SYSTEM.md rồi cập nhật `globals.css`.

### 02/10/2026 — Font tải bằng `next/font/google`
- Quyết định: Baloo 2 (500–800), Nunito (500–900), Be Vietnam Pro (400/500/700), subsets `latin` + `vietnamese`. Biến `--font-baloo`, `--font-nunito`, `--font-be-vietnam-pro` đặt trên `<html>`, `globals.css` gom thành `--font-display|body|thcs`.
- Ảnh hưởng: lần `next build` đầu cần mạng để tải font (đã chạy thành công).

### 02/10/2026 — Trang thử token `/dev-tokens`
- Quyết định: giữ `src/app/dev-tokens/page.tsx`, chỉ chạy khi phát triển; production trả 404 (đã kiểm tra bằng `next start`).
- Lý do: đối chiếu token với thiết kế ở các task sau; task 02 có thể thay bằng trang xem thành phần.

### 02/10/2026 — Remote git
- Quyết định: kho GitHub `https://github.com/thanhtran031985/hoc_tieng_anh.git` (remote `origin` đã thêm). Mọi commit sau này đưa lên đây. Chỉ push khi anh/chị đồng ý; nhánh làm việc hiện là `feat/01-setup`, nhánh chính `main`.

### 02/10/2026 — Chuyển bảng `docs/tasks/README.md` sang định dạng dashboard đọc được
- Bối cảnh: script `tasks-dashboard.mjs` chỉ nhận bảng có cột `#`, `Task`, `Trạng thái` (tùy chọn `Phụ thuộc`, `Nhánh git`); bảng nháp dùng cột `NN`, `Thư mục`, `Tên` nên dashboard báo 13 cảnh báo.
- Quyết định: đổi bảng sang `| # | Task | Trạng thái | Phụ thuộc | Nhánh git |`, cột Task dạng `[NN-slug](NN-slug/task.md) — Tên`. Nội dung các task giữ nguyên. Ghi chú "cần thiết kế Prompt 3" của task 11, 12 chuyển thành một dòng dưới bảng (cột Phụ thuộc chỉ chứa số task). Bỏ chữ "bản nháp" và nhắc tới Covet trong phần mở đầu.
- Ảnh hưởng: khi thêm task mới giữ đúng các cột này.

### 02/10/2026 — Đổi tên Covet thành Học cùng Bông trong dashboard
- Quyết định: `scripts/tasks-dashboard.mjs` (tiêu đề, chân trang, tên file PNG/PDF `edu-tasks-dashboard`) và `docs/prompts/dashboard.md`.
- Ghi chú: `_template/`, script và prompt đã có sẵn trong dự án nên không cần chép từ Covet. Task 02–12 chưa có `progress.md`/`decisions.md`; tạo từ `_template/` khi bắt đầu từng task (dashboard hiển thị "chưa có tiến độ", không cảnh báo).
