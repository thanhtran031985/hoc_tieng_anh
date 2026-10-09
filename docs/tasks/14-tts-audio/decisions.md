# Quyết định — 14-tts-audio — Giọng đọc mp3 và âm phonics

Ghi các quyết định đã chốt, thay đổi so với task.md và vấn đề phát sinh.

| Ngày | Quyết định | Lý do |
|---|---|---|
| 09/10/2026 | **Không dùng API TTS.** Giọng đọc chạy ngay trên máy (Kokoro-82M, Apache-2.0); không có `TTS_API_KEY` hay biến môi trường TTS bắt buộc. | Bố/mẹ yêu cầu không dùng API (miễn phí, không khóa, không cần mạng). `task.md` ghi "Chỉ gọi TTS từ phía máy chủ" và "ưu tiên REST bằng fetch": thay bằng gọi mô hình cục bộ từ phía máy chủ. |
| 09/10/2026 | Một giọng mặc định **Anh-Mỹ (en-US)** cho cả web; cột `audio`/`example_audio` giữ nguyên, không đổi schema. | Bố/mẹ chọn. `voice.accent` trong Cài đặt của bố mẹ chỉ áp dụng khi rơi về giọng trình duyệt. |
| 09/10/2026 | Tệp mp3 tạo ở máy dev rồi đưa thư mục `storage/uploads/audio/` lên hosting; nút "Tạo giọng đọc" ở quản trị chỉ chạy khi máy chủ có công cụ (máy dev), nơi khác báo rõ. | Hosting dùng chung thường không chạy được mô hình. |
| 09/10/2026 | Âm phonics rời (/k/, /æ/) dùng tệp thu âm tải lên (Adult20); TTS chỉ là phương án thử. | Mô hình cục bộ đọc tên chữ cái thay vì âm, như `task.md` đã dự báo. |
| 09/10/2026 | Thêm **công tắc "Giọng mp3" toàn hệ thống ở khu quản trị, mặc định tắt**: tắt thì mọi nơi dùng giọng trình duyệt; bật thì phát mp3 khi có tệp (thiếu tệp rơi về giọng trình duyệt) và các nút "Tạo giọng đọc" sáng lên. Nguồn mp3 chỉ Kokoro trên máy, không thêm dịch vụ API trên mạng. | Bố/mẹ muốn giữ cả hai, bật khi cần. Lưu ở bảng cài đặt hệ thống mới (Bước 1). Thêm so với `task.md` (không có công tắc). |
