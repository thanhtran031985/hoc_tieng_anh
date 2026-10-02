# Quyết định — 12-admin-content

### 03/10/2026 — Chặn `/admin` bằng cổng bố mẹ (việc cần làm ở task này)
- Bối cảnh: sơ đồ tổng quan (`docs/so-do/tong-quan/so-sanh.md`, điểm 1) cho thấy `/admin` hiện chỉ gọi `requireRole("admin")` (`src/app/(admin)/admin/page.tsx:11`), không qua `requireParentGate` (`src/server/parent-gate.ts:35`). Tài khoản đăng ký đầu tiên tự là `admin` (`src/server/users.ts:8-10`), nên máy đang đăng nhập thì bé gõ `/admin` là vào được, không cần PIN.
- Việc cần làm: nhóm route `(admin)` phải yêu cầu cả cổng bố mẹ đã mở (cookie còn hạn) và role `admin`, kiểm ở layout và từng server action; thêm lối vào từ khu bố mẹ (PRD dòng 126).
- Kiểm tra: tài khoản admin chưa mở cổng gõ `/admin` bị chuyển về `/profiles`; mở cổng rồi mới vào được; tài khoản `parent` luôn thấy 404.
- Nguồn: do bạn quyết định ngày 03/10/2026 (làm đúng ở task 12, không sửa ở task 06).
