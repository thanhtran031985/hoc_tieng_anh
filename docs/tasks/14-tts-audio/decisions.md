# Quyết định — 14-tts-audio — Giọng đọc mp3 và âm phonics

Ghi các quyết định đã chốt, thay đổi so với task.md và vấn đề phát sinh.

| Ngày | Quyết định | Lý do |
|---|---|---|
| 09/10/2026 | **Không dùng API TTS.** Giọng đọc chạy ngay trên máy (Kokoro-82M, Apache-2.0); không có `TTS_API_KEY` hay biến môi trường TTS bắt buộc. | Bố/mẹ yêu cầu không dùng API (miễn phí, không khóa, không cần mạng). `task.md` ghi "Chỉ gọi TTS từ phía máy chủ" và "ưu tiên REST bằng fetch": thay bằng gọi mô hình cục bộ từ phía máy chủ. |
| 09/10/2026 | Một giọng mặc định **Anh-Mỹ (en-US)** cho cả web; cột `audio`/`example_audio` giữ nguyên, không đổi schema. | Bố/mẹ chọn. `voice.accent` trong Cài đặt của bố mẹ chỉ áp dụng khi rơi về giọng trình duyệt. |
| 09/10/2026 | Tệp mp3 tạo ở máy dev rồi đưa thư mục `storage/uploads/audio/` lên hosting; nút "Tạo giọng đọc" ở quản trị chỉ chạy khi máy chủ có công cụ (máy dev), nơi khác báo rõ. | Hosting dùng chung thường không chạy được mô hình. |
| 09/10/2026 | Âm phonics rời (/k/, /æ/) dùng tệp thu âm tải lên (Adult20); TTS chỉ là phương án thử. | Mô hình cục bộ đọc tên chữ cái thay vì âm, như `task.md` đã dự báo. |
| 09/10/2026 | Thêm **công tắc "Giọng mp3" toàn hệ thống ở khu quản trị, mặc định tắt**: tắt thì mọi nơi dùng giọng trình duyệt; bật thì phát mp3 khi có tệp (thiếu tệp rơi về giọng trình duyệt) và các nút "Tạo giọng đọc" sáng lên. Nguồn mp3 chỉ Kokoro trên máy, không thêm dịch vụ API trên mạng. | Bố/mẹ muốn giữ cả hai, bật khi cần. Lưu ở bảng cài đặt hệ thống mới (Bước 1). Thêm so với `task.md` (không có công tắc). |
| 09/10/2026 | `kokoro-js` và `@breezystack/lamejs` là **devDependencies**; `synthesizeMp3` nạp bằng `import()` động và báo `TtsUnavailableError` khi không có. | Tạo mp3 là việc của máy dev; hosting không cần cài mô hình, web vẫn chạy bằng giọng trình duyệt. |
| 09/10/2026 | Đọc từng câu bằng `generate()` rồi nối, không dùng `stream()` của Kokoro. | `stream()` treo ở câu cuối khi truyền chuỗi thường (đã thử). |
| 09/10/2026 | Tên tệp `<loại>-<id>-<8 ký tự băm>.mp3`; đổi chữ hoặc giọng thì ra tệp mới và xóa tệp cũ, tạo lại cùng nội dung thì ghi đè đúng tệp. Route `/audio/[name]` riêng, không mở rộng `/uploads/[name]`. | `/uploads` chỉ nhận ảnh, không có ETag/Range; tên có mã băm cho phép cache `immutable`. `task.md` ghi "tạo lại thì ghi đè đúng tệp đó": vẫn đúng khi nội dung không đổi. |
| 09/10/2026 | Giọng Anh-Anh/Anh-Mỹ của bố mẹ nay áp dụng cho giọng trình duyệt trong **bài học** (qua `SpeechConfig`); chưa áp dụng cho ôn tập, sổ từ, xếp lớp, bản đồ, và chưa áp dụng tốc độ đọc. | Phạm vi Bước 1 là bài học. Áp dụng tốc độ sẽ làm giọng mặc định nhanh hơn so với hiện tại (0,82), cần bố/mẹ quyết. Đề xuất nối `SpeechConfig` vào các màn còn lại ở bước sau hoặc task riêng. |
| 09/10/2026 | Chưa có thông báo "máy chưa có giọng tiếng Anh". | Test tự động dùng giọng giả không có giọng nào nên thông báo sẽ che giao diện trong mọi test; cần thiết kế riêng. |
| 09/10/2026 | Nạp `kokoro-js` bằng `createRequire` (Node nạp thẳng, không qua bộ đóng gói), không dùng `import()` hay `serverExternalPackages`. | Qua bộ đóng gói của Next, `kokoro-js` tìm tệp giọng ở `src/generated/voices/` nên lỗi ENOENT; nạp bằng `require` thì đúng vị trí gói. |
| 09/10/2026 | Tạo hàng loạt ở quản trị theo lượt **5 từ** (mỗi từ 2 tệp, ~30–50 giây), không phải 20 mục như ví dụ trong `task.md`; lệnh dòng lệnh (Bước 3) vẫn dùng lượt 20. | Mỗi từ mất khoảng 4–6 giây trên máy này, lượt 20 làm thanh tiến trình đứng vài phút và nút Dừng phản hồi chậm; “vd 20 mục” trong `task.md` chỉ là ví dụ. |
| 09/10/2026 | “Chưa có âm thanh” (Adult08, Adult13, Adult10) nghĩa là thiếu tệp của từ **hoặc** của câu ví dụ. | Bé nghe cả từ lẫn câu ví dụ; đếm riêng từ sẽ báo đủ khi câu ví dụ vẫn đọc bằng giọng trình duyệt. |
| 09/10/2026 | `AdultTable.toolbarRight` nhận thêm dạng hàm `(visible) => node` để nút “tạo cho các mục đang lọc” biết các hàng đang lọc. | Sửa nhỏ, không đổi cách dùng cũ (vẫn nhận node). |
| 09/10/2026 | Đổi chữ của từ/câu ví dụ ở Adult10 thì xóa tệp mp3 cũ ngay khi lưu; muốn có giọng mới thì bấm tạo lại. | Bảng tra cứu mp3 của bài học theo chữ: giữ tệp cũ sẽ làm bé nghe câu cũ khi chữ đã đổi. |
