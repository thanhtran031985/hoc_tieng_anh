# Screen50-WordFamily

Họ vần — mạng các từ cùng vần.

- Vần ở giữa (“-at” /æt/, `rime-hub`, `size-rime-hub`): bấm hoặc Space để nghe lần lượt cả họ, từng thẻ sáng lên. Đường nối `rime-line`.
- 8 thẻ quanh vần (`size-family-card`): bat, cat, hat, fat, mat, flat, chat, that — hình, từ (phần vần tô `rime-ink` trên `rime-bg` ở mọi từ), phiên âm, loại từ, nghĩa tiếng Việt. Bấm thẻ (Enter) để nghe; ← → đi giữa các thẻ.
- Từ bé chưa học (flat, chat, that): thẻ mờ, nét đứt, nhãn “Sắp học” (`soon-bg`, `soon-ink`).
- Ô “Bẫy chính tả” (`trap-bg`, viền `trap-line`): eat /iːt/, what /wɒt/ — chữ “at” gạch lượn sóng `trap-ink`, Bông giải thích ngắn.
- Bên dưới: “Đọc cả đoạn” với câu vui “The fat cat sat on a mat. It has a hat.”
- Ví dụ thứ hai: họ theo âm “-ir” /ɜː/ (bird, girl, shirt, skirt, first, third; bẫy fire).
- Tự khám phá: mỗi thẻ có nút “Ghép” (mở Ghép chữ đầu, từ đó là từ cần ghép đầu tiên; chỉ ở từ ghép được với vần) và “Khám phá” (chỉ khi từ có dữ liệu). Trong bài: nghe đủ các từ đã học rồi Tiếp tục, Gợi ý (H) chỉ thẻ chưa nghe.

Hai cách hiện: trong khung bài học (thanh tiến độ, × mở “Dừng bài học?”, chân bài Nghe lại · Gợi ý · Kiểm tra) và mở từ Sổ từ (tự khám phá: chỉ có nút Đóng, có dải liên kết WordLinks, không tính điểm). Dùng chung `Bong.W.app(host, ctx, { mode, stack })`.

Thẻ xem trước có 3 cỡ màn (1440×900 · 1366×768 · 1920×1080) và đủ 4 trạng thái dữ liệu (Bình thường · Đang tải · Trống · Lỗi có Thử lại). Vừa 1366×768 không cuộn. Dùng được bằng bàn phím và chuột; viền focus `focus` 4px khi dùng Tab. Làm sai không bị phạt, không đếm ngược; bấm vào từ hay câu tiếng Anh nào cũng nghe được.
