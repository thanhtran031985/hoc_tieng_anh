# Quyết định — 16-story-reading — Truyện tranh đọc to và đọc hiểu ngắn

Ghi các quyết định đã chốt, thay đổi so với task.md và vấn đề phát sinh.

| Ngày | Quyết định | Lý do |
|---|---|---|
| 10/10/2026 | Mã dạng: truyện = `activity_type: story` (8.6, `config.storyId`); đọc hiểu = `short_reading` (8.11) lấy nội dung từ `questions` gắn bằng `questionId` | Truyện nhiều trang có bảng riêng; đọc hiểu đúng như task.md (`questions.type = short_reading`). Dùng chung hạ tầng của task 15 (`question-extra.ts`, `PlayStep`) |
| 10/10/2026 | Trang câu hỏi giữa truyện lưu thành một dòng `questions` (`type = story_question`, 3 lựa chọn chữ), `story_pages.question_id` trỏ tới | Task.md có cột `question_id`; chấm và `answer_logs` dùng lại đường của câu hỏi thường. Khác bản thiết kế: lựa chọn là thẻ chữ, không vẽ diều màu (mọi dữ liệu nằm trong DB) |
| 10/10/2026 | `new_words` lưu danh sách chữ; nghĩa tra từ bảng `words` khi hiện (từ chưa có trong ngân hàng chỉ nghe, không có nghĩa) | Admin chỉ nhập chữ (Enter thêm, × bỏ) như thiết kế; tránh lưu nghĩa hai nơi |
| 10/10/2026 | Chữ sáng theo giọng: có mp3 → chia theo `currentTime/duration` của tệp, tỉ lệ theo độ dài chữ; không có tệp → 420 ms/chữ (`--duration-read-word`) | kokoro-js không trả mốc thời gian từng từ (đã thử ở task 14); cách chia này sát giọng đọc thật hơn chia đều |
| 10/10/2026 | Âm thanh trang truyện luôn dùng mp3 nếu có, không phụ thuộc công tắc “Giọng mp3”; nút “Tạo giọng đọc tự động” của Adult19 cũng không đòi công tắc | Xuất bản truyện bắt buộc có âm thanh nên phải tạo được; công tắc chỉ quyết định giọng cho từ và câu ví dụ |
| 10/10/2026 | Xuất bản bị chặn khi: không có trang truyện, trang rỗng, trang quá 2 câu / 16 từ, trang thiếu âm thanh, trang câu hỏi chưa đủ 3 lựa chọn hoặc chưa chọn đáp án đúng; lý do nêu số trang (trang câu hỏi không có số) | Đúng task.md và Adult19; hàm thuần `storyPublishBlock` dùng chung client/server |
| 10/10/2026 | Sửa chữ của một trang làm mất tệp âm thanh của trang đó (xóa tệp cũ) | Tệp không còn khớp chữ; giống `saveWord` ở task 14 |
| 10/10/2026 | Sai lần 3 ở câu hỏi giữa truyện: cho xem đáp án rồi đi tiếp, KHÔNG đưa cả truyện xuống cuối bài làm lại | Làm lại nghĩa là đọc lại cả truyện (nặng), không hợp với “không phạt”; mục vẫn ghi `firstTryCorrect=false`, `wrong=3` |
| 10/10/2026 | Đọc hiểu ngắn: mỗi câu hỏi con là một mục chấm (cùng `questionId`); sai lần 3 → `revealed`, cả bước làm lại ở cuối bài | Bài đọc ngắn (2–3 câu hỏi) nên làm lại cả bước được; đúng cách `lesson-session` hiện có |
| 10/10/2026 | Đọc hiểu: thêm “câu chứa đáp án” (`evidence`) cho từng câu hỏi trong dữ liệu và biểu mẫu | Thiết kế yêu cầu gợi ý sáng câu chứa đáp án; không suy ra tự động được |
| 10/10/2026 | Adult19 là màn riêng `/admin/stories` (danh sách) và `/admin/stories/[storyId]` (3 cột), mục menu “Truyện tranh” kèm nhãn Mới; lưu cả truyện một lần trong một giao dịch | Giống thiết kế (“thêm mục mới, không đổi menu cũ”); trang mới chưa có `id` nên tải âm thanh/tạo giọng đọc tự lưu truyện trước |
| 10/10/2026 | Soạn bài học: tab “Truyện” chỉ liệt kê truyện đã xuất bản của cấp; Xem như học sinh của Soạn bài học nay nạp được truyện và các dạng bài lấy nội dung từ câu hỏi (task 15 chưa có) | Cần cho chơi thử trọn bài; truyện Nháp chưa đủ âm thanh |
| 10/10/2026 | `storeImageUpload` tách khỏi `saveUpload` (hình tải lên chưa gắn từ nào) để Adult19 dùng tải tranh | Tránh nhân đôi mã kiểm hình; hình vẫn lưu ngoài `public/`, phục vụ qua `/uploads/…` có kiểm đăng nhập |
| 10/10/2026 | Tranh seed của “Tom’s Red Kite” là SVG vẽ lại từ hàm vẽ của thiết kế, `public/media/stories/`; phải là XML hợp lệ (bỏ `stroke-width` trùng) | Thẻ `<img>` đọc SVG theo XML nghiêm ngặt, khác trình phân tích HTML của bản xem trước |
| 10/10/2026 | Chưa chụp so sánh với `designs/` cho Screen24/Screen29/Adult19 trong `thiet-ke.spec.ts` | Cần một truyện/bài đọc đã xuất bản cố định trong DB test; làm khi chạy Playwright tổng. Đã đối chiếu bằng mắt qua ảnh chụp Edge ở 3 cỡ màn |

## Tổng kết khác với task.md gốc
- Thêm `short_reading` vào các dạng soạn ở màn `/admin/question-types` (Adult18) như ô “Thêm nhanh” thứ 5 thay vì tab riêng.
- Câu hỏi giữa truyện dùng thẻ chữ thay vì tranh diều màu.
- Chưa làm: ôn tập (5 hộp) cho từ trong truyện; so sánh ảnh với thiết kế trong Playwright.
