# FeedbackBar

Dải bo góc trên `radius-xl` trượt lên từ đáy màn trong `duration-slide` sau khi bé bấm Kiểm tra; rồng Bông thò đầu lên mép trái.

- **Đúng** (`b-fb--ok`): nền `success-soft`, tiêu đề `success-shade` + dấu ✓, rồng *vui mừng*, nút `success` "Tiếp tục" `Enter`. Đồng thời sao bay từ đáp án vào chip sao.
- **Chưa đúng** (`b-fb--retry`): nền `retry-soft`, tiêu đề `retry-shade` + biểu tượng thử lại, rồng *động viên*, nút `retry` "Thử lại" `Enter`. **Không trừ điểm, không mất mạng, không âm thanh gắt.** Lần sai thứ 2 tự bật gợi ý; lần 3 cho xem đáp án rồi học lại câu đó cuối bài.
- Lời: tiêu đề ≤ 5 từ; dòng phụ đưa từ đúng kèm nút loa + phiên âm + nghĩa.
- Dải che phần chân bài học (cao 132px; 112px ở màn 768), không che đáp án.
