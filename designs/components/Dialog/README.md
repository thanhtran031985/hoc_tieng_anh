# Dialog

Hộp thoại giữa màn trên lớp phủ `scrim`: rồng Bông nhô lên trên mép, tiêu đề `title`, lời `body-l`, 1–2 nút cỡ `l`.

- Dùng cho: thoát bài giữa chừng, khoá "Bố mẹ", xác nhận xoá hồ sơ (chỉ phía bố mẹ).
- Nút an toàn/tiếp tục học đặt **trước** và là `primary`; nút rời đi là `secondary`. Không có nút "Huỷ" màu đỏ.
- Bàn phím: focus vào nút đầu tiên khi mở; Tab vòng trong hộp; `Esc` đóng và trả focus về nút đã mở.
- Bo `radius-xl`, đệm `space-8`, bóng `shadow-dialog`, rộng 540px.

**Người dùng cung cấp**: `title`, `body`, biểu cảm linh vật (`expr`), danh sách `actions` ({label, variant, key, onClick}).
