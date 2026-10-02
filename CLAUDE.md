# Edu — Hướng dẫn cho Claude

## Dự án
Edu là web học tiếng Anh cho học sinh từ lớp 1 đến lớp 9, chạy trên trình duyệt máy tính.
- Người dùng: học sinh (giao diện Tiểu học cho cấp 1–5, giao diện THCS cho cấp 6–10),
  phụ huynh, và quản trị nội dung.
- Stack: Next.js (App Router) + TypeScript + Tailwind + Prisma + MySQL (database `hoc_tieng_anh`).
  Chạy trên máy dùng MySQL của XAMPP (thực chất là MariaDB); khi hosting chuyển sang MySQL.
- Xác thực: NextAuth v5 (Credentials, JWT), bcryptjs. Validate: Zod. Thông báo: react-hot-toast.
- Tài liệu sản phẩm: `docs/PRD.md` (bản đặc tả chức năng), `docs/DESIGN_SYSTEM.md` (nếu có).
  PRD chia tính năng theo giai đoạn GĐ1–GĐ4 và ghi rõ màn nào thuộc Tiểu học (TH) hay THCS.
- Thiết kế giao diện: `designs/` — bản tải về từ hệ thống giao diện "Học cùng Bông" trên Claude Design
  (`tokens.json`, `README.md`, `components/<Tên>/README.md` + `preview.html`, `components/bundle.css|js`).
  Mỗi `task.md` tự liệt kê các thư mục `designs/components/Screen…` và thành phần nó dùng.

## Cấu trúc task
```
docs/tasks/
├── README.md            ← bảng tổng tất cả task + trạng thái
├── _template/           ← mẫu cho task mới (task.md, progress.md, decisions.md)
├── dashboard.html       ← SINH RA bởi `npm run tasks:dashboard`, KHÔNG sửa tay
└── NN-slug/             ← mỗi task một thư mục, NN = số thứ tự 2 chữ số
    ├── task.md          ← yêu cầu của task (do tôi viết, KHÔNG tự sửa)
    ├── progress.md      ← tiến độ, Claude cập nhật sau mỗi bước
    ├── plan.md          ← kế hoạch đã duyệt từ Plan mode
    ├── decisions.md     ← quyết định đã chốt, vấn đề phát sinh
    └── _archive/        ← bản cũ của task.md (nếu có)
```
Quy ước đặt tên:
- Thư mục task: `NN-slug`, slug viết thường, kebab-case, tiếng Anh, ngắn (vd `01-setup`, `02-auth-profiles`).
- Nhánh git tương ứng: `feat/NN-slug`.
- Task xong vẫn giữ nguyên thư mục, chỉ đổi trạng thái trong README. Không di chuyển, không xóa.

Ký hiệu trạng thái (dùng trong README và progress.md; dashboard tô màu theo đó):
⬜ chưa làm · 🔄 đang làm · ❓ có code chưa rà soát · ⚠️ khác task.md · ❌ thiếu · ✅ xong.
Ký hiệu khác sẽ hiện màu xám trên dashboard kèm cảnh báo.

## Khi tôi yêu cầu tạo task mới
1. Đọc `docs/tasks/README.md`, lấy số lớn nhất hiện có + 1 làm NN.
2. Đề xuất slug, hỏi tôi xác nhận nếu tên chưa rõ.
3. Copy `docs/tasks/_template/` sang `docs/tasks/NN-slug/`, điền tiêu đề và ngày.
4. Nếu tôi đưa nội dung yêu cầu thì ghi vào `task.md`; nếu chưa thì để khung trống.
5. Thêm một dòng vào bảng trong `docs/tasks/README.md` (trạng thái ⬜, phụ thuộc nếu có).
6. Nếu task có giao diện: liệt kê các thư mục `designs/components/*` liên quan trong mục
   "Thiết kế" của `task.md` (hỏi tôi nếu không chắc file nào thuộc task).
7. Chạy `npm run tasks:dashboard`.
Không bắt đầu làm task khi tôi chưa yêu cầu.

## Quy trình khi làm một task
- Khi bắt đầu, khi mở phiên mới, hoặc sau khi compact: ĐỌC theo thứ tự
  `docs/tasks/README.md` → `task.md` → `progress.md` → `decisions.md` của task đó,
  rồi tiếp tục từ bước đang dở. Không làm lại bước đã ✅.
- Làm lần lượt từng bước theo đúng thứ tự trong `task.md`.
- Sau MỖI bước:
  1. Tự chạy phần "Kiểm tra" của bước đó.
  2. Cập nhật `progress.md` (bảng trạng thái + nhật ký của bước), rồi chạy
     `npm run tasks:dashboard`.
  3. Báo cáo ngắn: đã làm gì, kết quả kiểm tra, việc tôi cần làm thủ công.
  4. Đề xuất commit message dạng `NN-slug: step N — <mô tả>`. Chỉ commit khi tôi đồng ý.
  5. DỪNG và chờ tôi trả lời "continue".
- Khi tôi duyệt một kế hoạch ở Plan mode: lưu kế hoạch đó vào `plan.md` của task.
- Khi có quyết định mới hoặc thay đổi so với `task.md`: ghi vào `decisions.md`.
- Khi task hoàn thành: đổi trạng thái trong `docs/tasks/README.md` thành ✅.
- Quyết định mơ hồ → DỪNG và hỏi. Thiếu `PRD.md`/`DESIGN_SYSTEM.md` → tự suy ra từ
  thiết kế và báo cho tôi đã suy ra gì (không cần dừng).
- KHÔNG cài package mới khi chưa hỏi tôi.

## Quy tắc code (áp dụng cho mọi task)
- Mọi thao tác ghi DB đều validate bằng Zod. Schema Zod dùng chung giữa server và client.
- Mật khẩu luôn hash bằng bcrypt; không bao giờ lưu, log hay trả về dạng văn bản thuần.
  Mã PIN phụ huynh và PIN hồ sơ học sinh cũng hash bằng bcrypt như mật khẩu.
- Không có secret hay import Prisma trong client component.
- Chỉ dùng design token — không dùng mã màu hex/px cố định. Nếu thiếu token, thêm vào
  theme (Tailwind v3: `tailwind.config`, v4: `@theme`) và liệt kê trong báo cáo.
- Chỉ sửa trong phạm vi của task đang làm. Không tự thêm tính năng ngoài `task.md`.
- Trước khi báo hoàn thành một task: `npx tsc --noEmit`, `npm run lint`, `npm run build`
  đều phải chạy không lỗi.

## Quy tắc riêng của dự án này
Dữ liệu và quyền:
- Mọi server action và route handler đọc hoặc ghi dữ liệu học sinh phải kiểm tra hồ sơ
  học sinh đó thuộc tài khoản đang đăng nhập. Khu quản trị nội dung chỉ cho role `admin`.
- Bản ghi âm, bài viết và kết quả học của học sinh không bao giờ công khai.
- File tải lên (hình, âm thanh, bản ghi âm) lưu ngoài `public/` và trả về qua route handler
  có kiểm tra quyền, vì Next.js chỉ phục vụ những file có trong `public/` lúc build.
  Hình và âm thanh của nội dung mẫu đi kèm mã nguồn thì để trong `public/media/`.

Nội dung học:
- Từ vựng, câu hỏi, bài học, ngữ pháp, đề thi nằm trong database. Không viết cứng nội dung
  học vào component. Dữ liệu mẫu nằm trong seed, nạp bằng `npx prisma db seed`.
- Các quy tắc ở PRD Phần F (sao, xu, XP, ôn tập 5 hộp, chuỗi ngày, mở khóa, xếp lớp)
  viết thành hàm thuần trong `src/lib/`, không đặt trong component.

Database:
- Migration phải chạy được trên cả MariaDB (XAMPP) và MySQL 8 (hosting); không dùng
  tính năng chỉ có ở một bên. Database dùng utf8mb4, collation `utf8mb4_unicode_ci`.

Giao diện:
- Hai bộ giao diện chọn bằng thuộc tính `data-theme` trên thẻ `<html>`: `tieu-hoc` (Tiểu học, đã
  thiết kế) và `thcs` (THCS, chưa thiết kế). Màu của 10 cấp là token `level-N`, `level-N-shade`,
  `level-N-soft`, `level-N-ink`, `on-level-N`; vùng chứa đặt `data-level="N"` để dùng `--lv…`.
- Hai bộ dùng chung component; chỗ khác nhau giải quyết bằng token. Chỉ tách component
  riêng khi thiết kế hai bộ khác nhau về bố cục.
- Ưu tiên máy tính: bố cục chuẩn 1440×900; màn bài học vừa 1366×768 không cần cuộn.
- Phím tắt trong bài học theo PRD Phần B (1–4 hoặc A–D, Enter, Space, H, Esc).
- Chữ trên giao diện bằng tiếng Việt, nội dung học bằng tiếng Anh. Tên biến, hàm, model,
  bảng và route bằng tiếng Anh.
- Giữ các nguyên tắc sản phẩm ở PRD Phần B: không phạt khi sai, không dùng đỏ gắt cho câu
  sai, giao diện Tiểu học không có đồng hồ đếm ngược, từ và câu tiếng Anh đều nghe được.

## Chuyển thiết kế Claude Design sang Next.js
Quy tắc cho thư mục `designs/`:
- KHÔNG di chuyển, đổi tên hay sửa file trong `designs/`. Đây là bản tải về từ Claude Design
  và có thể bị tải đè khi thiết kế cập nhật.
- `docs/DESIGN_SYSTEM.md` là bản tóm tắt token và quy tắc, sinh từ `designs/tokens.json` và
  `designs/README.md`. Token thay đổi thì sửa theo `designs/tokens.json`.
- Chỉ ĐỌC các `designs/components/<Tên>/README.md` và `preview.html` mà task cần.

Các `preview.html` KHÔNG phải React: chúng gọi `window.Bong` trong `components/bundle.js`
(hàm trả về chuỗi HTML, lớp CSS tiền tố `b-`, dữ liệu mẫu `Bong.words/levels/kids`) và
`B.screen({ states: { normal, loading, empty, error } })` để hiện 4 trạng thái. Khi chuyển:
- Mỗi hàm của `Bong` (btn, speak, key, dragon, pic, topbar, feedback, dialog, stateBlock…)
  thành một React component trong `src/components/ui/`, giữ đúng props ở
  `designs/components/index.d.ts` và kiểu dáng ở `bundle.css`.
- CSS của `bundle.css` chuyển thành class Tailwind dùng token, hoặc CSS module dùng biến CSS;
  không chép giá trị hex/px. `cqh` trong bản xem trước đổi thành `vh` như README ghi.
- Hình rồng Bông, icon và hình từ vựng là SVG vẽ trong `bundle.js`: tách thành file SVG hoặc
  component, giữ nguyên nét vẽ.
- Mỗi trạng thái trong `states` thành `loading.tsx` / trạng thái trống / `error.tsx` thật.
- Bỏ dữ liệu mẫu (`Bong.kids`, `Bong.words`…); thay bằng dữ liệu và điều hướng thật.
- Khớp thiết kế CHÍNH XÁC: bố cục, khoảng cách, thành phần, phím tắt.

## Bảo mật môi trường
- KHÔNG đọc file `.env`. Danh sách biến môi trường nằm trong `.env.example`
  (giá trị giữ chỗ, không có secret thật). Khi cần biến mới: thêm vào `.env.example`
  và nói tôi điền vào `.env`.

## Lệnh thường dùng
- `npx prisma migrate dev --name <tên>` · `npx prisma generate` · `npx prisma db seed`
- `npx tsc --noEmit` · `npm run lint` · `npm run build` · `npm run dev`

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
