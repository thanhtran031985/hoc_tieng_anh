# 14-tts-audio — Giọng đọc mp3 và âm phonics

Ngày tạo: 09/10/2026 · Giai đoạn: GĐ2 · Phụ thuộc: 12, 13 · Nhánh: `feat/14-tts-audio`

## Mục tiêu
Từ, câu ví dụ, câu hỏi và âm phonics có tệp mp3 giọng chuẩn; giọng trình duyệt chỉ còn là dự phòng.

## Phạm vi
- Trong: chọn dịch vụ đọc văn bản (TTS); tạo mp3 cho từ, câu ví dụ, câu hỏi; bật nút "Tạo giọng đọc tự động" và "Tạo giọng đọc hàng loạt" ở Adult10, Adult13 (GĐ1 đang để "Sắp có"); lệnh tạo mp3 hàng loạt cho nội dung seed; bảng `phonics_sounds` và màn Adult20; phát mp3 trong bài học, rơi về giọng trình duyệt khi thiếu tệp.
- Ngoài: âm thanh của truyện, đoạn văn Khám phá từ, Họ vần (làm trong task của từng phần, dùng chung hàm của task này).

## Thiết kế
`designs/components/Adult10-Vocab`, `Adult13-Media` (nút tạo giọng đọc), `Adult20-PhonicsSounds`.

## Quyết định kiến trúc
- **Bước 0 là quyết định của bố/mẹ:** Claude Code so sánh 3–4 dịch vụ TTS (chất lượng giọng trẻ em/giáo viên, giọng Anh-Anh và Anh-Mỹ, hỗ trợ SSML đọc theo IPA, chi phí cho khoảng 10.000 câu, mức miễn phí) rồi DỪNG chờ tôi chọn. Không cài SDK khi chưa hỏi; ưu tiên gọi REST bằng `fetch`.
- Khóa API để trong `.env` (tôi điền); Claude Code chỉ thêm tên biến vào `.env.example`, không đọc `.env`. Chỉ gọi TTS từ phía máy chủ.
- Tệp mp3 lưu ở `storage/uploads/audio/`, trả về qua route handler (cache dài, có ETag). Đường dẫn ghi vào cột `audio`, `example_audio` của bảng tương ứng. Tạo lại thì ghi đè đúng tệp đó.
- Tạo hàng loạt chạy theo từng nhóm nhỏ (vd 20 mục một lượt) có thanh tiến trình, dừng được giữa chừng, chạy lại thì bỏ qua mục đã có. Lệnh `npm run audio:generate -- --level 3 --missing` làm việc tương tự cho seed.
- Giọng Anh-Anh hay Anh-Mỹ: Claude Code đề xuất cách làm (một giọng mặc định cho cả web, hay lưu 2 bộ tệp theo cài đặt giọng đọc của bé) ở Bước 0 cùng lúc với dịch vụ.
- Âm phonics đứng riêng (/k/, /æ/): TTS thường đọc tên chữ cái ("see") thay vì âm. Nếu dịch vụ không đọc đúng âm qua SSML IPA thì Adult20 cho tải tệp ghi âm lên; khi thiếu, ô chữ phát từ ví dụ thay cho âm.

## Các bước
### Bước 0 — Chọn dịch vụ TTS (DỪNG chờ tôi)
Bảng so sánh dịch vụ, chi phí ước tính cho nội dung cấp 1–5, đề xuất giọng Anh-Anh/Anh-Mỹ, nghe thử 5 câu mẫu nếu được.
**Kiểm tra:** Tôi đã chọn dịch vụ và giọng; biến môi trường đã thêm vào `.env.example`; tôi đã điền `.env`.
### Bước 1 — Hàm tạo và phát mp3
`src/lib/audio/tts.ts` (gọi dịch vụ, lưu tệp), route handler phục vụ tệp, hook phát âm thanh dùng mp3 rồi rơi về giọng trình duyệt.
**Kiểm tra:** Một từ có mp3 thì phát mp3; xóa tệp thì vẫn nghe bằng giọng trình duyệt, không báo lỗi với bé; gọi route với đường dẫn lạ (`../`) bị chặn.
### Bước 2 — Nút tạo giọng đọc trong quản trị (Adult10, Adult13)
Bỏ nhãn "Sắp có": tạo cho một từ trong ngăn kéo, tạo hàng loạt cho các mục đang lọc.
**Kiểm tra:** Thanh tiến trình chạy, dừng được; lỗi một mục không làm hỏng cả lượt và được liệt kê; cảnh báo "thiếu âm thanh" ở Adult08 giảm đúng.
### Bước 3 — Lệnh tạo mp3 cho nội dung seed
`npm run audio:generate` có tùy chọn cấp và `--missing`.
**Kiểm tra:** Chạy cho cấp 3 thì mọi từ và câu ví dụ cấp 3 có mp3; chạy lại không gọi dịch vụ cho mục đã có.
### Bước 4 — Âm phonics (Adult20)
Bảng `phonics_sounds` (36 âm: chữ đơn, âm ghép phụ âm, âm ghép nguyên âm), seed IPA và 2 từ ví dụ, màn Adult20 (tìm, lọc âm còn thiếu, Tải lên, Tạo âm thanh).
**Kiểm tra:** Đủ 4 trạng thái; tải lên chỉ nhận tệp âm thanh, giới hạn dung lượng, báo lỗi dưới ô; nghe thử từng âm.

## Kiểm tra cuối task
tsc, lint, build; nghe thử bài học cấp 3 bằng mp3; tắt mạng thì vẫn nghe bằng giọng trình duyệt.
