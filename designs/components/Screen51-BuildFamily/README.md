# Screen51-BuildFamily

Ghép chữ đầu — ghép chữ đầu với vần để thành từ.

- Vần “at” cố định bên phải (`rime-bg`, `rime-ink`), hàng ô chữ đầu b, c, h, f, m, s, r, z bên trái (`letter-tile`, `size-letter-tile`).
- Kéo một chữ vào ô trống trước vần (`build-slot-bg`, viền nét đứt `brand`), bấm chữ, hoặc gõ chữ trên bàn phím (cụm 2 chữ như “sh”: gõ s rồi h). Enter = Kiểm tra; Backspace / Delete xoá ô.
- Thành từ thật: ô xanh, hình hiện ra, Bông đọc, từ bay vào “Đã tìm được” (`found-chip`). Không phải từ thật (zat): ô cam nhẹ (`fake-word-bg`), Bông nói “Từ này không có trong tiếng Anh, thử chữ khác nhé”. Không trừ điểm.
- Tìm đủ 5 từ (`build-goal`) là xong: trong bài có bảng kết thúc 3 sao + xu; tự khám phá thì không tính sao, không xu.
- Mở từ thẻ ở Họ vần: từ đó là “Từ cần ghép đầu tiên” (khung nét đứt, chữ đầu có viền sáng); chữ đầu chưa có trong hàng được thêm vào.
- Tự khám phá: bấm một từ trong “Đã tìm được” để mở Khám phá từ của từ đó (nếu có), nút “Về họ vần”.
- Space nghe vần; ? = Gợi ý (H là một chữ cái nên không dùng làm phím gợi ý).

Hai cách hiện: trong khung bài học (thanh tiến độ, × mở “Dừng bài học?”, chân bài Nghe lại · Gợi ý · Kiểm tra) và mở từ Sổ từ (tự khám phá: chỉ có nút Đóng, có dải liên kết WordLinks, không tính điểm). Dùng chung `Bong.W.app(host, ctx, { mode, stack })`.

Thẻ xem trước có 3 cỡ màn (1440×900 · 1366×768 · 1920×1080) và đủ 4 trạng thái dữ liệu (Bình thường · Đang tải · Trống · Lỗi có Thử lại). Vừa 1366×768 không cuộn. Dùng được bằng bàn phím và chuột; viền focus `focus` 4px khi dùng Tab. Làm sai không bị phạt, không đếm ngược; bấm vào từ hay câu tiếng Anh nào cũng nghe được.
