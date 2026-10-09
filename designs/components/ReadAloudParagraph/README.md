# ReadAloudParagraph

Đọc cả đoạn và dịch nghĩa — khung đoạn văn dùng chung, đặt trong Khám phá từ và Họ vần. `Bong.ReadAloudParagraph(o)` (= `Bong.W.paragraph`), gắn hành vi bằng `Bong.W.wireParagraph(el)`.

- “Đọc cả đoạn” (P): giọng đọc chạy, câu đang đọc nền `read-highlight`, chữ đang đọc nền `read-word-bg` (`duration-read-word` 420ms mỗi chữ, giọng `read-rate` 0.82). Tạm dừng (P) rồi “Đọc tiếp”. Đọc chậm: `duration-read-word-slow` 640ms, `read-rate-slow` 0.6.
- Bấm một câu (hoặc nút loa cuối câu) để nghe riêng câu đó. Bấm một từ để nghe từ đó và hiện nghĩa ngắn trong bong bóng nhỏ.
- “Dịch nghĩa” (T): mặc định ẩn để bé tự nghe hiểu trước; bật thì bản dịch tiếng Việt hiện ngay dưới từng câu — kiểu chữ `translation`, màu `trans-ink`, vạch trái `trans-rule`; bấm lại để ẩn. Biểu tượng dịch ở đầu câu chỉ dịch riêng câu đó.
- Ví dụ bird: “This is a bird. It is brown, yellow or blue. It likes to eat seeds, insects and berries. It has wings, feathers, a beak and claws. It can fly in the sky and build a nest. It lives in a nest on a tree.”
- Thẻ có 3 trạng thái: Chưa dịch · Đang đọc · Đã dịch (thêm Dịch riêng 1 câu). Nút bật/tắt dùng aria-pressed; viền focus rõ khi Tab.

Thành phần dùng chung (không có dữ liệu riêng, nên không có 4 trạng thái dữ liệu — các màn chứa nó có đủ 4 trạng thái). Xem được ở 1366×768, 1440×900, 1920×1080; dùng được bằng bàn phím (P, T, Tab tới từng câu/từ, Enter) và chuột; viền focus `focus` 4px khi Tab.
