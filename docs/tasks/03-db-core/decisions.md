# Quyết định — 03-db-core

### 02/10/2026 — Để nguyên lỗi `npm audit` đến khi lên hosting
- Bối cảnh: sau task 01, `npm audit` báo 6 lỗi (5 high, 1 moderate), đều nằm trong bộ Prisma 7.10.0:
  - `mariadb` 3.4.5 (qua `@prisma/adapter-mariadb`, chạy lúc web hoạt động): lộ mật khẩu cho kẻ chặn giữa đường dù bật SSL; có thể SQL injection với client charset big5/gbk/sjis/cp932/gb18030. Adapter ghim đúng 3.4.5; `mariadb` 3.4.7 và 3.5.4 đã có bản vá.
  - `mysql2` 3.15.3 và `deepmerge-ts` 7.1.5 (qua CLI `prisma`, chỉ chạy lúc dev): lộ mật khẩu khi hạ cấp auth plugin, DoS khi giải nén zlib, cạn stack khi gộp object đệ quy.
- Quyết định: để nguyên, chưa xử lý. Không chạy `npm audit fix --force` (lệnh này hạ `prisma` về 6.19.3, phá cấu hình Prisma 7).
- Lý do: hiện chỉ kết nối `localhost` bằng utf8mb4 trên máy phát triển nên rủi ro thấp; chưa có dữ liệu thật.
- Việc cần làm trước khi lên hosting (nhất là khi DB nằm ở máy khác):
  1. Thêm `overrides` trong `package.json` ép `mariadb` lên `^3.4.7` (cùng nhánh 3.4), cài lại, chạy `npm audit`, `npx tsc --noEmit`, `npm run lint`, `npm run build` và thử kết nối DB. Cần hỏi anh/chị trước khi đổi `package.json`.
  2. Kiểm tra bản Prisma mới hơn (`prisma`, `@prisma/adapter-mariadb`) để vá `mysql2` và `deepmerge-ts`; chạy lại `npm audit`.
  3. Dùng kết nối DB có TLS và giữ client charset là utf8mb4.
- Ảnh hưởng: không có thay đổi mã trong task 03.
