# Screen32-Race

10. Đua xe trả lời.

- Đường đua ngang (`race-*`, `size-race-lane`), 8 đoạn, vạch đích ô cờ. Xe của bé có Bông lái; “xe ma” mờ (`race-ghost`, viền nét đứt) là chính bé lần trước.
- Câu hỏi ở trên, 3–4 đáp án có phím 1–4 và loa; chọn là trả lời ngay. Đúng: xe chạy thêm 1 đoạn. Chưa đúng: xe đứng chờ, làm lại câu đó.
- Xe ma đi theo số câu đúng của lần trước sau cùng số lượt trả lời, không chạy theo thời gian.
- Về đích: “Cậu nhanh hơn lần trước 2 câu!”, “Bằng đúng lần trước!” hoặc lời động viên. Tab “Lần đầu chơi”: không có xe ma.

Mini game là một bước trong bài học: lớp phủ bắt đầu (1 dòng cách chơi có hình, Bắt đầu · Enter), tạm dừng bằng Esc hoặc nút ⏸ (Chơi tiếp · Thoát → hộp thoại Dừng bài học?), bảng kết thúc (số đúng, sao, xu, Tiếp tục). Chân bài game (`Bong.L.gfoot`): Bông + lời nhắn (aria-live), Nghe lại (Space), Gợi ý (H), điểm. Không đếm ngược, không mất mạng.

Thẻ xem trước có 3 cỡ màn (1440×900 · 1366×768 · 1920×1080) và đủ 4 trạng thái dữ liệu (Bình thường · Đang tải · Trống · Lỗi có Thử lại). Vừa 1366×768 không cuộn. Viền focus `focus` 4px khi dùng Tab.
