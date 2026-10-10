# Tiến độ — 17-speaking — Luyện nói từ và câu

Trạng thái chung: ✅ · Cập nhật lần cuối: 10/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Ghi âm và quyền micro | ✅ | |
| 1 | Chấm dễ tính và màn Luyện nói (Screen25) | ✅ | |
| 2 | Lưu bản ghi âm | ✅ | |
| 3 | Soạn câu luyện nói (Adult18) | ✅ | |
| 4 | Bản ghi âm ở khu bố mẹ (Adult05) | ✅ | |

## Nhật ký

**10/10/2026 — Bước 0–3.** Hàm thuần `speaking.ts` (chuẩn hóa, so từ gần đúng, 3 mức dễ tính, sao, lời khen) và `recording.ts` (10 giây, giữ 3 bản, kiểm chữ ký tệp, phân loại lỗi micro) có test. `SpeakStep` (Screen25): Sẵn sàng → Đang ghi (phím R, sóng âm tím, vạch 10 giây, tự dừng) → Đang chấm → Kết quả (1–3 sao, chữ tốt xanh / cần nói lại cam, Nghe giọng tớ · Nghe giọng mẫu · Nói lại · Tiếp tục); micro bị chặn → hướng dẫn bố mẹ + Thử lại + “Hôm nay bỏ qua phần nói”; không có micro → `ListenChooseStep` (hoặc thẻ nhẹ nếu câu không có hình). Tắt “Chấm phát âm” hoặc trình duyệt không có Web Speech → chỉ ghi âm, 2 sao hoàn thành, không gọi nhận diện. Bảng `recordings` (migration `recordings`), `server/recordings.ts` (kiểm dung lượng ≤ 1 MB, chữ ký webm/ogg/mp4, giữ 3 bản gần nhất mỗi (bé, câu) cả dòng lẫn tệp), `saveRecordingAction`, route `/recordings/[id]` (401/403/404, Range). Adult18: biểu mẫu Luyện nói (câu ≤ 12 từ, âm thanh mẫu tải lên/tạo giọng đọc Kokoro, mức dễ tính), chặn xuất bản thiếu âm thanh. Công tắc “Chấm phát âm” ở Adult07. Kiểm (Edge, DB verify, micro giả): R bắt đầu/dừng, tự dừng đúng 10 giây, 3★/2★/1★, tắt chấm không gọi nhận diện, bản thứ 4 xóa bản cũ (DB và đĩa), micro bị chặn, không có micro, 3 cỡ màn không cuộn, không lỗi console; tsc, lint, 354/354 test sạch.

**10/10/2026 — Bước 4.** Trang `/parent/works` (page/loading/error + trạng thái trống, trống sau lọc): danh sách theo ngày (Hôm nay / Hôm qua / T4 7/10) kèm câu mẫu, giờ, thời lượng, sao; lọc “Cần luyện thêm” (1 sao); chi tiết có trình phát (nút phát/tạm dừng, sóng âm bấm để tua, ←/→ tua 2 giây, tốc độ 1× / 0,75×), dòng “Bông nghe được”, xóa qua hộp thoại (mất cả dòng và tệp), thẻ “Bài viết của con — Sắp có”. Menu bố mẹ “Bài viết & ghi âm” bật, `ParentFrame` đánh dấu mục đang chọn. Hàm thuần `groupRecordingsByDay`/`clockOfDay` có test. Kiểm (Edge, DB verify): 403 khi chưa mở khóa bố mẹ, 401 khi chưa đăng nhập, 404 với bản của gia đình khác, 206 khi có Range, phát thật, tua chuột và phím, tốc độ 0,75×, lọc, Giữ lại / Xóa, bé chưa có bản → trạng thái trống, `?kid=` lạ lùi về bé đầu; không lỗi console. Cả task: tsc, lint, 358/358 test, build sạch; spec `tests/e2e/17-luyen-noi.spec.ts` đã viết, chưa chạy (chờ xong hết task); cập nhật `11-khu-bo-me`, `chung`, `helpers/lesson.ts`.

## Việc cần làm thủ công
- [ ] Chạy `npx prisma migrate deploy` để có bảng `recordings` (migration `recordings`).
- [ ] Soạn một câu Luyện nói ở `/admin/question-types` (ô “Luyện nói”), bấm “Tạo giọng đọc tự động” (hoặc tải .mp3), Xuất bản rồi thêm vào một bài ở Soạn bài học.
- [ ] Nói thử 5 câu trên Chrome hoặc Edge thật (nhận diện giọng nói cần mạng và cho phép micro), rồi vào `/parent/works` nghe lại và xóa thử một bản.
- [ ] Bật/tắt “Chấm phát âm” ở Cài đặt → Giao diện & âm thanh, kiểm tra tắt thì bài chỉ ghi âm (2 sao hoàn thành).
- [ ] Chạy Playwright sau khi xong hết task: `npm run test:e2e:db` rồi `npx playwright test 17- 11- chung`.

## Bước tiếp theo

Hoàn thành
