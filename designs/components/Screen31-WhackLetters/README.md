# Screen31-WhackLetters

9. Đập chuột chữ cái.

- Lưới 3×3 hang (`size-mole-hole`, `mole-*`). Phím theo bàn phím số: 7 8 9 hàng trên, 4 5 6 giữa, 1 2 3 dưới; nhãn phím in ở góc mỗi hang.
- Chuột chui lên cầm biển chữ (5 lượt) hoặc hình (3 lượt: con nào bắt đầu bằng âm này). Mỗi con ở trên `duration-mole-up` rồi thụt xuống, chui lại — luôn có con đúng.
- Đập sai: chuột lè lưỡi (`mole-tongue`), Bông đọc chữ đó, không trừ điểm. Gợi ý: con đúng phát sáng.

Mini game là một bước trong bài học: lớp phủ bắt đầu (1 dòng cách chơi có hình, Bắt đầu · Enter), tạm dừng bằng Esc hoặc nút ⏸ (Chơi tiếp · Thoát → hộp thoại Dừng bài học?), bảng kết thúc (số đúng, sao, xu, Tiếp tục). Chân bài game (`Bong.L.gfoot`): Bông + lời nhắn (aria-live), Nghe lại (Space), Gợi ý (H), điểm. Không đếm ngược, không mất mạng.

Thẻ xem trước có 3 cỡ màn (1440×900 · 1366×768 · 1920×1080) và đủ 4 trạng thái dữ liệu (Bình thường · Đang tải · Trống · Lỗi có Thử lại). Vừa 1366×768 không cuộn. Viền focus `focus` 4px khi dùng Tab.
