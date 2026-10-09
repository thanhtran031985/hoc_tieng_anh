# Tiến độ — 17-speaking — Luyện nói từ và câu

Trạng thái chung: 🔄 · Cập nhật lần cuối: 10/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Ghi âm và quyền micro | ✅ | |
| 1 | Chấm dễ tính và màn Luyện nói (Screen25) | ✅ | |
| 2 | Lưu bản ghi âm | ✅ | |
| 3 | Soạn câu luyện nói (Adult18) | ✅ | |
| 4 | Bản ghi âm ở khu bố mẹ (Adult05) | ⬜ | |

## Nhật ký

**10/10/2026 — Bước 0–3.** Hàm thuần `speaking.ts` (chuẩn hóa, so từ gần đúng, 3 mức dễ tính, sao, lời khen) và `recording.ts` (10 giây, giữ 3 bản, kiểm chữ ký tệp, phân loại lỗi micro) có test. `SpeakStep` (Screen25): Sẵn sàng → Đang ghi (phím R, sóng âm tím, vạch 10 giây, tự dừng) → Đang chấm → Kết quả (1–3 sao, chữ tốt xanh / cần nói lại cam, Nghe giọng tớ · Nghe giọng mẫu · Nói lại · Tiếp tục); micro bị chặn → hướng dẫn bố mẹ + Thử lại + “Hôm nay bỏ qua phần nói”; không có micro → `ListenChooseStep` (hoặc thẻ nhẹ nếu câu không có hình). Tắt “Chấm phát âm” hoặc trình duyệt không có Web Speech → chỉ ghi âm, 2 sao hoàn thành, không gọi nhận diện. Bảng `recordings` (migration `recordings`), `server/recordings.ts` (kiểm dung lượng ≤ 1 MB, chữ ký webm/ogg/mp4, giữ 3 bản gần nhất mỗi (bé, câu) cả dòng lẫn tệp), `saveRecordingAction`, route `/recordings/[id]` (401/403/404, Range). Adult18: biểu mẫu Luyện nói (câu ≤ 12 từ, âm thanh mẫu tải lên/tạo giọng đọc Kokoro, mức dễ tính), chặn xuất bản thiếu âm thanh. Công tắc “Chấm phát âm” ở Adult07. Kiểm (Edge, DB verify, micro giả): R bắt đầu/dừng, tự dừng đúng 10 giây, 3★/2★/1★, tắt chấm không gọi nhận diện, bản thứ 4 xóa bản cũ (DB và đĩa), micro bị chặn, không có micro, 3 cỡ màn không cuộn, không lỗi console; tsc, lint, 354/354 test sạch.

## Bước tiếp theo

Bước 4 — Bản ghi âm ở khu bố mẹ (Adult05)
