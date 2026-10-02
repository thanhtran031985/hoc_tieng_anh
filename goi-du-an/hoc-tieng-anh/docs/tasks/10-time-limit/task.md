# 10-time-limit — Giới hạn giờ học

Ngày tạo: 02/10/2026 · Giai đoạn: GĐ1 · Phụ thuộc: 04, 07 · Nhánh: `feat/10-time-limit`

## Mục tiêu
Bố mẹ đặt số phút học mỗi ngày; hết giờ thì bé thấy màn rồng đi ngủ.

## Phạm vi
- Trong: ghi phiên học (`study_sessions`), tính phút đã học trong ngày, hiện thời gian còn lại trên trang chủ, màn Hết giờ học, mở thêm giờ bằng PIN bố mẹ.
- Ngoài: khung giờ được học trong ngày (để GĐ2).

## Thiết kế
`designs/components/Screen14-TimeUp`, `Screen04-Home` (thẻ "Hôm nay: x/y phút").

## Quyết định kiến trúc
- Giới hạn lưu trong `learners.settings`; đặt tạm qua task 11, trước đó dùng giá trị mặc định (tắt).
- Hết giờ giữa bài: làm nốt câu đang dở rồi mới chuyển màn.
- Chỉ tính thời gian khi tab đang mở và có thao tác.

## Các bước
### Bước 0 — Ghi phiên học và tính phút
**Kiểm tra:** học 2 phút, số phút trong ngày tăng đúng; sang ngày mới thì về 0.
### Bước 1 — Màn Hết giờ học (Screen14)
**Kiểm tra:** hết giờ thì mọi route của bé chuyển về màn này; nhập PIN đúng thì cộng thêm giờ.

## Kiểm tra cuối task
tsc, lint, build.
