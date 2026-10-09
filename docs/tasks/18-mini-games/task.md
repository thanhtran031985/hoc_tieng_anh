# 18-mini-games — Mini game: mưa từ, bong bóng, đập chuột, đua xe

Ngày tạo: 09/10/2026 · Giai đoạn: GĐ2 · Phụ thuộc: 13, 14 · Nhánh: `feat/18-mini-games`

## Mục tiêu
Bài học có thêm 4 trò chơi làm một bước trong bài, đúng nguyên tắc không phạt và không đếm ngược với giao diện Tiểu học.

## Phạm vi
- Trong: Mưa từ vựng (Screen11, cấp 3–5), Bong bóng từ vựng (Screen30), Đập chuột chữ cái (Screen31), Đua xe trả lời với xe ma (Screen32); bảng `game_records` lưu thành tích; trò chơi là một `activity_type` trong `lesson_steps`.
- Ngoài: trận trùm cuối vùng (task 20), đấu trí 60 giây và các trò THCS (GĐ3).

## Thiết kế
`designs/components/Screen11-WordRain`, `Screen30-Bubbles`, `Screen31-WhackLetters`, `Screen32-Race`; khung game `Bong.L.gameStart`, `gamePause`, `gameEnd`, `gfoot` (đã làm ở task 13).

## Quyết định kiến trúc
- Mỗi trò một component trong `src/components/lesson/games/`, dùng khung trò chơi của task 13. Trò chơi tạm dừng khi tab bị ẩn.
- Sao của trò chơi tính theo số câu đúng ngay lần đầu, cùng hàm tính sao của task 07.
- Bảng mới `game_records` (learner_id, game, lesson_id, correct, total, sequence JSON: đúng/sai theo từng lượt, played_at). Xe ma của Đua xe đi theo `sequence` của lần chơi trước cùng bài, không chạy theo thời gian.
- Mưa từ vựng có tốc độ rơi nhưng không có đồng hồ đếm ngược; từ chạm đất thì rơi lại sau, không mất mạng. Claude Code ghi cách làm cụ thể vào decisions.md nếu thiết kế Screen11 khác điều này.
- Chuyển động dùng `requestAnimationFrame` hoặc CSS transform, giữ 60 khung hình ở 1366×768; giảm chuyển động thì bóng và chuột đứng yên, vẫn chơi được.

## Các bước
### Bước 0 — Mưa từ vựng (Screen11)
Từ hoặc hình rơi xuống, bé gõ đúng chính tả trước khi chạm đất; chỉ hiện ở bài cấp 3–5.
**Kiểm tra:** Gõ đúng thì từ nổ; chạm đất không trừ điểm; tạm dừng bằng Esc.
### Bước 1 — Bong bóng từ vựng (Screen30)
Bông đọc từ, 5 bong bóng có hình bay lên, phím 1–5; bóng bay khỏi màn thì bay lại.
**Kiểm tra:** Space nghe lại; nhầm thì bóng lắc và Bông nói từ đó; 8 từ một lượt.
### Bước 2 — Đập chuột chữ cái (Screen31)
Lưới 3×3 theo bàn phím số 7-8-9/4-5-6/1-2-3, chuột cầm chữ hoặc hình theo âm được đọc.
**Kiểm tra:** Luôn có con đúng; đập sai không trừ điểm; gợi ý làm con đúng phát sáng.
### Bước 3 — Đua xe trả lời (Screen32) và thành tích
Đường đua 8 đoạn, xe ma theo lần trước; bảng `game_records`.
**Kiểm tra:** Lần đầu không có xe ma; lần sau xe ma đi theo số câu đúng của lần trước; lời kết đúng 3 trường hợp nhanh hơn / bằng / động viên.
### Bước 4 — Ghép trò chơi vào bài
`activity_type` mới cho 4 trò, soạn được trong Adult12 (task 12) như một bước.
**Kiểm tra:** Thêm trò chơi vào bài Nháp ở Adult12, xem trước chạy được; bảng kết thúc cộng xu đúng quy tắc.

## Kiểm tra cuối task
tsc, lint, build; chơi thử cả 4 trò bằng bàn phím ở 1366×768 và 1920×1080, mỗi trò 2 lượt để thấy xe ma.
