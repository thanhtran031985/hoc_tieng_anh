# ThcsCore

Các phần của lõi chung được dùng nguyên trong THCS, chỉ đổi kiểu chữ và độ bo theo theme: `FeedbackBar`, `KeyHint`, `DataStates`, `ProgressBar`, `SpeakerButton`, `Dialog`.

- Dải phản hồi THCS: `Bong.T.feedback(scr, { type, title, detail })` — rồng tuổi teen 64px, tiêu đề `thcs-h2`, dòng phụ `thcs-body`. Với câu **chưa đúng**, dòng phụ luôn giải thích ngắn **vì sao** (≤ 2 câu) rồi nút **Làm lại** (`Enter`).
- Phím tắt giữ như Tiểu học: `1`–`4` hoặc `A`–`D` chọn, `Enter` kiểm tra, `Space` nghe lại, `H` gợi ý, `Esc` thoát.
- Bốn trạng thái dữ liệu: `Bong.T.state({ kind: 'empty' | 'error', title, text, action })`; khung xương `Bong.sk()` tự đổi màu theo chế độ.
