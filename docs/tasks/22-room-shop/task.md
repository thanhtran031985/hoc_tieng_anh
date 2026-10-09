# 22-room-shop — Phòng của tớ, cửa hàng và thẻ nghỉ phép

Ngày tạo: 09/10/2026 · Giai đoạn: GĐ2 · Phụ thuộc: 21 · Nhánh: `feat/22-room-shop`

## Mục tiêu
Bé tiêu xu mua đồ trang trí phòng của rồng Bông và quần áo, mũ cho Bông; chuỗi ngày có thẻ nghỉ phép.

## Phạm vi
- Trong: seed 19 đồ trong phòng (nội thất, quần áo, mũ); Phòng của tớ (Screen41: xem, trang trí, tủ đồ); Cửa hàng (Screen42); trang chủ có Bông mặc đồ và thẻ chuỗi ngày (Screen43); thẻ nghỉ phép mỗi tuần (PRD Phần F); thẻ Đồ trong phòng ở Adult21; nút Phòng của tớ thay Screen22.
- Ngoài: hồ sơ và tùy biến THCS (GĐ3).

## Thiết kế
`designs/components/Screen41-MyRoom`, `Screen42-Shop`, `Screen43-HomeDressed`, `Adult21-Rewards` (thẻ Đồ trong phòng).

## Quyết định kiến trúc
- Giá lấy từ hằng số `coins` (nội thất 40/80/150, đồ đặc biệt 400, quần áo 60, mũ 50). Mua là một transaction ở server: kiểm tra đủ xu, trừ xu, thêm `learner_rewards`; bấm 2 lần không mua 2 lần.
- Vị trí đồ trong phòng lưu ở `learner_rewards.position` (x, y, xoay), tọa độ theo tỷ lệ phòng để đúng ở mọi cỡ màn.
- Đồ đang mặc lưu bằng `learner_rewards.equipped`; mỗi nhóm (mũ, áo) mặc 1 món.
- Thẻ nghỉ phép: mỗi tuần 1 thẻ (`learners.streak_freezes`), tự dùng khi bé bỏ một ngày; hàm thuần trong `src/lib/rules/streak.ts` có test.
- Trang chủ có Bông mặc đồ là cập nhật trang chủ của task 06, không tạo route mới.

## Các bước
### Bước 0 — Seed đồ và cửa hàng (Screen42)
Seed 19 món; 3 tab, thẻ món có tên tiếng Anh + loa, giá hoặc "Đã có", hộp thoại xác nhận xu trước → sau.
**Kiểm tra:** Không đủ xu: nút mờ, "Còn thiếu N xu", Bông gợi ý học một bài; mua 2 lần nhanh không trừ xu 2 lần.
### Bước 1 — Phòng của tớ (Screen41)
Xem (bấm đồ nghe tên), Trang trí (kéo thả, Tab chọn, mũi tên di chuyển, R xoay, Delete cất kho), Tủ đồ (mũ, áo).
**Kiểm tra:** Vị trí đồ giữ sau khi tải lại và ở cỡ màn khác; làm được hoàn toàn bằng bàn phím.
### Bước 2 — Trang chủ có Bông mặc đồ (Screen43)
Bông mặc đồ đã chọn; 4 nút lớn tới màn thật; thẻ chuỗi ngày 7 ngày.
**Kiểm tra:** Nút Phòng của tớ, Bộ sưu tập mở màn thật; thẻ chuỗi ngày đóng bằng Esc.
### Bước 3 — Thẻ nghỉ phép
Hàm thuần tính chuỗi có thẻ nghỉ; hiện ô bông tuyết ngày đã dùng.
**Kiểm tra:** Test: bỏ 1 ngày có thẻ thì chuỗi giữ; bỏ 2 ngày trong tuần thì chuỗi về 0; sang tuần mới có lại thẻ.
### Bước 4 — Đồ trong phòng ở Adult21
Thẻ Đồ trong phòng: nhóm, giá gợi ý theo token, hình, xem trước quần áo và mũ trên Bông.
**Kiểm tra:** Báo lỗi khi giá âm hoặc thiếu hình; Nháp không hiện ở cửa hàng.

## Kiểm tra cuối task
tsc, lint, build; dùng hồ sơ thử có 500 xu mua 3 món, trang trí phòng, tải lại trang kiểm tra.
