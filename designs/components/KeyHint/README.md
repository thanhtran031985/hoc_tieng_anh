# KeyHint

Nhãn phím dạng nắp phím nhỏ (`key`, 13px, viền dưới 4px) cho người dùng chuột + bàn phím.

- Đáp án: `1`–`4` đặt ở góc trên trái thẻ (`b-key--corner`), thứ tự trái → phải, trên → dưới.
- `Enter` = Kiểm tra / Tiếp tục; `Space` = Nghe lại; `←` `→` = chuyển thẻ; `Esc` = đóng hộp thoại.
- Trong nút, nhãn phím kế thừa màu chữ của nút.
- Chỉ hiện nhãn cho phím thật sự hoạt động trên màn đó. Là chữ phụ trang trí nên `aria-hidden`; phím tắt được mô tả trong `aria-keyshortcuts` của điều khiển.
