# Screen30-Bubbles

8. Bong bóng từ vựng.

- Bông đọc một từ (Space nghe lại). 5 bong bóng 5 màu (`bubble-1…5`, `size-bubble`) chứa hình, bay lên chậm trong `duration-bubble-rise`, hơi lắc ngang.
- Bấm bong bóng hoặc phím số 1–5 in trên bóng. Đúng: bóng nổ, sao bay vào thanh tiến độ. Nhầm: bóng lắc, Bông nói đó là từ gì.
- Bóng bay khỏi màn: nhãn “Bóng 3 sẽ bay lại sau”, rồi bay lại từ dưới.
- 8 từ; sao cuối tính theo số lần đúng ngay lần đầu.

Mini game là một bước trong bài học: lớp phủ bắt đầu (1 dòng cách chơi có hình, Bắt đầu · Enter), tạm dừng bằng Esc hoặc nút ⏸ (Chơi tiếp · Thoát → hộp thoại Dừng bài học?), bảng kết thúc (số đúng, sao, xu, Tiếp tục). Chân bài game (`Bong.L.gfoot`): Bông + lời nhắn (aria-live), Nghe lại (Space), Gợi ý (H), điểm. Không đếm ngược, không mất mạng.

Thẻ xem trước có 3 cỡ màn (1440×900 · 1366×768 · 1920×1080) và đủ 4 trạng thái dữ liệu (Bình thường · Đang tải · Trống · Lỗi có Thử lại). Vừa 1366×768 không cuộn. Viền focus `focus` 4px khi dùng Tab.
