# Card

Mặt trắng bo `radius-lg` nổi bằng `shadow-card` (gờ dưới `line` + bóng mềm) trên nền `bg`; thẻ đáp án (`b-choice`) có viền 4px đổi màu theo trạng thái.

- **Thẻ nội dung** (`b-card`): đệm `space-6`; nhóm thông tin (Nhiệm vụ hôm nay, hồ sơ bé). Bấm được thì thêm `b-card--hover`.
- **Thẻ đáp án** (`b-choice`): là `<button>`; trạng thái `is-hover`, `is-selected` (`brand`), `is-correct` (`success` + dấu ✓ + nảy), `is-retry` (`retry` cam nhẹ + lắc nhẹ + biểu tượng thử lại), `is-dim` (bị gợi ý loại bỏ).
- Đúng/chưa đúng luôn có **biểu tượng** đi kèm màu, không chỉ đổi màu.
- Không dùng viền màu một bên; không chồng thẻ trong thẻ quá 1 lớp.

**Người dùng cung cấp**: nội dung (hình `pic`, từ, nhãn phím), trạng thái.
