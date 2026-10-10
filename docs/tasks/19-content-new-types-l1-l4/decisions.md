# Quyết định — 19-content-new-types-l1-l4 — Nội dung dạng bài mới cho cấp 1–4

Ghi các quyết định đã chốt, thay đổi so với task.md và vấn đề phát sinh.

| Ngày | Quyết định | Lý do |
|---|---|---|
| 10/10/2026 | Bước 0 tự duyệt: số lượng theo bảng ở `plan.md` (cấp 1: 3 ghép âm, 3 sắp xếp, 3 điền từ, 3 luyện nói; cấp 2: 2/3/3/3 + 3 nghe-gõ từ; cấp 3: 2/4/4/3 + 3 nghe-gõ câu + 1 đọc hiểu; cấp 4: 4/4/3 + 3 nghe-gõ câu + 1 đọc hiểu; mỗi cấp 2 truyện) | Người dùng ủy quyền làm liền không hỏi; số lượng đủ để mỗi bài thường có ≥ 1 dạng mới và 1 trò chơi mà không quá dài (≈ 12 phút) |
| 10/10/2026 | Nội dung viết thành tệp JSON `prisma/seed/content-extra/level-NN/<slug>.json` theo chủ đề, nạp bằng seed; câu hỏi khớp theo (cấp, dạng, chữ) nên chạy lại không nhân đôi | Bài đã có tiến độ học vẫn giữ nguyên; nội dung tách khỏi mã, sửa không cần sửa component |
| 10/10/2026 | mp3 cho mọi câu qua bảng `audio_clips` (chữ → tệp) gộp vào bảng âm thanh của bài, không thêm trường `audio` vào từng dạng câu hỏi | Mọi bước đã gọi `playPronunciation(text)` nên tự dùng mp3 mà không đổi component; một cơ chế cho mọi loại câu |
| 10/10/2026 | Truyện của chủ đề thành bước `story` ở cuối các bài thường (trước trò chơi); truyện nạp trước nội dung chủ đề; `audio:generate -- --content` tự xuất bản truyện khi mọi trang đã có mp3 | task.md yêu cầu truyện có trong bài; truyện nạp ở trạng thái Nháp cho tới khi đủ âm thanh (luật Adult19) |
| 10/10/2026 | Bài mẫu cấp 3 (daily-routines, bài 1) sau builder bản 2: 8 thẻ từ → 5 nghe-chọn-hình → nối cặp → lật thẻ → 5 chọn từ → ghép âm → sắp xếp câu → điền từ → nghe-gõ câu → luyện nói → đọc hiểu → mưa từ vựng; bài cấp 4 (city-places, bài 1) tương tự không có ghép âm | Dài hơn bản 1 khoảng 6 bước dạng mới + 1 trò chơi; bé học dở vẫn tiếp tục được (bước mới ở cuối) |
| 10/10/2026 | Từ ngoài khung được phép ghi ở `prisma/seed/content-extra/allowed-extra.json` (kèm cấp và lý do), checker in danh sách trong báo cáo; hiện chỉ có “season” | task.md: từ ngoài danh sách phải ghi vào báo cáo |
| 10/10/2026 | Giọng mp3 theo câu chỉ dùng khi công tắc “Giọng mp3” (Adult13) đang bật, như từ và câu ví dụ; lúc tắt dùng giọng trình duyệt | Giữ nguyên hành vi của task 14: bản không có mp3 (hosting) vẫn chạy |

## Tổng kết khác với task.md gốc
- Bước 0 tự duyệt theo ủy quyền của người dùng (không dừng chờ).
- Thêm bảng `audio_clips` và `npm run audio:generate -- --content` để mọi câu có mp3 (task.md chỉ nói “mọi câu có mp3”); thêm bước `story` vào bài (task.md chưa nói rõ).
- Danh sách thiếu hình: 230 từ (chủ yếu từ trừu tượng), ghi ở `thieu-hinh.md`; chưa vẽ thêm hình.
- Bài dài hơn bản 1 (+ 4–6 bước dạng mới và 1 trò chơi); nếu bé thấy dài, giảm số câu mỗi chủ đề trong `content-extra`.

