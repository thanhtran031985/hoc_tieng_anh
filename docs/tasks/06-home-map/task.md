# 06-home-map — Trang chủ và bản đồ

Ngày tạo: 02/10/2026 · Giai đoạn: GĐ1 · Phụ thuộc: 02, 04, 05 · Nhánh: `feat/06-home-map`

## Mục tiêu
Bé vào trang chủ thấy nhiệm vụ hôm nay, mở tổng quan 10 cấp và bản đồ đảo để chọn bài.

## Phạm vi
- Trong: trang chủ (nhiệm vụ hôm nay, sao, xu, chuỗi ngày, 4 nút lớn), tổng quan 10 cấp, bản đồ đảo dùng chung một bố cục cho cấp 1–5 (đổi màu cấp và vùng đất theo chủ đề của cấp; cấp chưa có bài hiện "Sắp có"), quy tắc mở khóa chặng và trùm.
- Ngoài: Bộ sưu tập, Phòng của tớ (GĐ2: nút hiện nhưng mở màn "Sắp có"), bản đồ thành phố THCS.

## Thiết kế
`designs/components/Screen04-Home`, `Screen05-Levels`, `Screen06-IslandMap`, `StatChip`, `LevelColors`.
Nút chưa làm (Bộ sưu tập, Phòng của tớ…) mở `Screen22-ComingSoon`. Biểu cảm thêm của rồng Bông (`tiec`, `xaydung`) ở `MascotMore`.

## Quyết định kiến trúc
- Quy tắc mở khóa (PRD Phần F) viết thành hàm thuần `src/lib/rules/unlock.ts`.
- Chuỗi ngày tính trong `src/lib/rules/streak.ts`, có thẻ nghỉ phép mỗi tuần.
- Trang chủ, bản đồ là Server Component; phần tương tác là Client Component.

## Các bước
### Bước 0 — Quy tắc mở khóa và chuỗi ngày
**Kiểm tra:** chạy thử các trường hợp: bài đầu luôn mở, xong bài thì mở bài sau, xong 5 chặng mới mở trùm, bỏ 1 ngày dùng thẻ nghỉ phép.
### Bước 1 — Trang chủ (Screen04)
**Kiểm tra:** đủ 4 trạng thái; Enter vào bài tiếp theo; số ôn tập lấy từ thẻ đến hạn.
### Bước 2 — Tổng quan 10 cấp (Screen05)
**Kiểm tra:** cấp đã qua, đang học, khóa hiển thị đúng; mỗi điểm có số và tên cấp.
### Bước 3 — Bản đồ đảo (Screen06)
**Kiểm tra:** chặng xong hiện số sao; chặng khóa không bấm được; trùm khóa đến khi xong vùng.

## Kiểm tra cuối task
tsc, lint, build; thử ở 1366×768 và 1920×1080.
