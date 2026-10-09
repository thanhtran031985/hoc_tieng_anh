# 21-rewards-collection — Bộ sưu tập sticker và huy hiệu

Ngày tạo: 09/10/2026 · Giai đoạn: GĐ2 · Phụ thuộc: 13, 20 · Nhánh: `feat/21-rewards-collection`

## Mục tiêu
Bé nhận sticker và huy hiệu khi học, xem trong Bộ sưu tập; quản trị sửa được danh mục phần thưởng.

## Phạm vi
- Trong: bảng `rewards`, `learner_rewards`; seed 24 sticker, 8 huy hiệu; quy tắc rơi sticker và đạt huy hiệu; Bộ sưu tập (Screen38 Sticker, Screen39 Huy hiệu); kết thúc bài có quà (Screen40); danh mục phần thưởng ở Adult21 (thẻ Sticker, Huy hiệu); nút Bộ sưu tập thay cho màn "Sắp có" (Screen22).
- Ngoài: đồ trong phòng và cửa hàng (task 22), thành tích THCS (GĐ3).

## Thiết kế
`designs/components/Screen38-Stickers`, `Screen39-Badges`, `Screen40-LessonEndSticker`, `RewardPopup`, `Adult21-Rewards`.

## Quyết định kiến trúc
- Quy tắc là hàm thuần trong `src/lib/rules/rewards.ts`: lần đầu hoàn thành một bài (không phải bài ôn) thì rơi 1 sticker bé chưa có, ưu tiên album hợp chủ đề; hết sticker thì không rơi. Sticker +10 xu, huy hiệu +50 xu (hằng số `coins`).
- 8 huy hiệu theo thiết kế: 7 ngày liên tiếp, 30 ngày liên tiếp, 100 từ đầu tiên, Qua đảo Hạt giống, Qua đảo Mầm non, Thắng 5 trận trùm, 3 sao 10 bài, Nói 20 câu. Điều kiện lưu trong `rewards.condition` (loại + mức), tính lại sau mỗi bài và lượt ôn.
- Quà chưa mở khi bé thoát vẫn được giữ, lần sau vào Bộ sưu tập thì mở.
- Kết thúc bài có quà là biến thể của màn kết thúc bài của task 07, không tạo route mới.

## Các bước
### Bước 0 — Bảng phần thưởng và seed
Migration `rewards`, `learner_rewards`; seed 24 sticker (4 album), 8 huy hiệu.
**Kiểm tra:** Seed chạy lại không nhân đôi.
### Bước 1 — Quy tắc rơi sticker và đạt huy hiệu
Hàm thuần có test; nối vào cuối bài, cuối lượt ôn, trận trùm, bài thi lên cấp, luyện nói.
**Kiểm tra:** Test từng huy hiệu; không rơi 2 sticker trùng; xu cộng đúng.
### Bước 2 — Kết thúc bài có quà (Screen40)
Hộp quà cạnh rồng Bông, mở bằng Enter, sticker nằm lại, xu cộng thêm.
**Kiểm tra:** Bài ôn tập không rơi quà; lỗi mạng thì quà được giữ và mở sau Thử lại.
### Bước 3 — Bộ sưu tập (Screen38, Screen39)
Album theo chủ đề, 6 ô mỗi trang, ô chưa có hiện bóng mờ và cách nhận; lưới huy hiệu, thẻ chi tiết.
**Kiểm tra:** Đếm đã có / tổng đúng; huy hiệu chưa đạt có thanh tiến độ kèm số; nút Bộ sưu tập ở trang chủ mở màn thật thay Screen22.
### Bước 4 — Danh mục phần thưởng (Adult21: Sticker, Huy hiệu)
Bảng tìm, lọc, sắp xếp, phân trang; ngăn kéo sửa có xem trước; Nháp/Xuất bản.
**Kiểm tra:** Chỉ `admin` vào được; huy hiệu chọn điều kiện từ danh sách, báo lỗi khi mức cần đạt không hợp lệ.

## Kiểm tra cuối task
tsc, lint, build; học thử 3 bài bằng hồ sơ của con, mở quà, xem album.
