# 17-speaking — Luyện nói từ và câu

Ngày tạo: 09/10/2026 · Giai đoạn: GĐ2 · Phụ thuộc: 15 · Nhánh: `feat/17-speaking`

## Mục tiêu
Bé luyện nói theo câu mẫu, được chấm 1–3 sao dễ tính, nghe lại giọng mình; bố mẹ nghe được bản ghi âm.

## Phạm vi
- Trong: dạng 8.7 luyện nói; quyền micro và trạng thái không có micro; lưu bản ghi âm (`recordings`); tab Luyện nói ở Adult18; phần bản ghi âm của Adult05; cài đặt bật/tắt chấm phát âm ở Adult07.
- Ngoài: nói theo chủ đề và AI nhận xét (GĐ3–4); phần bài viết của Adult05 (GĐ3).

## Thiết kế
`designs/components/Screen25-Speak`, `Adult18-QuestionTypes2` (tab Luyện nói), `Adult05-Works` (chỉ phần ghi âm), `Adult07-Settings`.

## Quyết định kiến trúc
- Ghi âm bằng MediaRecorder (webm/opus), tối đa `duration-rec-max` 10 giây. Màu ghi âm là tím `rec`, không dùng đỏ.
- Chấm bằng nhận diện giọng nói có sẵn của Chrome/Edge (Web Speech API, cần mạng). Hàm chấm thuần trong `src/lib/rules/speaking.ts`: so từ đã nhận với câu mẫu sau khi chuẩn hóa; 3 sao khi khớp ≥ 80% số từ, 2 sao ≥ 50%, 1 sao khi bé đã nói. Mức dễ tính 3 nấc ở Adult18 đổi các ngưỡng này.
- Nhận diện giọng nói của trình duyệt gửi âm thanh tới máy chủ của Google/Microsoft. Adult07 có công tắc "Chấm phát âm" (mặc định bật, có dòng giải thích); tắt hoặc trình duyệt không hỗ trợ thì chỉ ghi âm, nghe lại, tính hoàn thành 2 sao, không chấm.
- Bản ghi âm lưu ở `storage/recordings/<learner_id>/`, trả về qua route handler kiểm tra đúng gia đình. Giữ 3 bản gần nhất cho mỗi câu của mỗi bé; bố mẹ xóa được ở Adult05.
- Không có micro: bước này đổi thành câu Nghe và chọn hình cùng từ, bài vẫn đi tiếp.

## Các bước
### Bước 0 — Ghi âm và quyền micro
Hook ghi âm, các trạng thái: Sẵn sàng → Đang ghi (sóng âm, vạch thời lượng) → Đang chấm → Kết quả; chưa cho dùng micro; máy không có micro.
**Kiểm tra:** Phím R bắt đầu/dừng; tự dừng sau 10 giây; từ chối quyền micro thì hiện hướng dẫn bố mẹ + Thử lại; không có micro thì đổi sang Nghe và chọn hình.
### Bước 1 — Chấm dễ tính và màn Luyện nói (Screen25)
Hàm chấm thuần có test đơn vị; màn kết quả 1–3 sao, lời khen, Nghe giọng tớ · Nghe giọng mẫu · Nói lại · Tiếp tục.
**Kiểm tra:** Test hàm chấm qua các câu mẫu; tắt Chấm phát âm thì không gọi nhận diện giọng nói.
### Bước 2 — Lưu bản ghi âm
Bảng `recordings` (đã có ở PRD G), upload qua server action có kiểm tra quyền, giữ 3 bản gần nhất.
**Kiểm tra:** Gia đình khác gọi thẳng URL bản ghi âm bị chặn; bản thứ 4 xóa bản cũ nhất cả trong database và trên đĩa.
### Bước 3 — Soạn câu luyện nói (Adult18)
Tab Luyện nói: câu mẫu ≤ 12 từ, âm thanh mẫu (tải lên hoặc tạo giọng đọc), mức dễ tính 3 nấc.
**Kiểm tra:** Báo lỗi khi câu quá 12 từ hoặc thiếu âm thanh mẫu.
### Bước 4 — Bản ghi âm ở khu bố mẹ (Adult05)
Danh sách bản ghi âm theo ngày, câu mẫu, số sao, nghe lại, xóa; công tắc Chấm phát âm ở Adult07.
**Kiểm tra:** Đủ 4 trạng thái; chỉ thấy bản ghi âm của con mình; phần bài viết để "Sắp có" (GĐ3).

## Kiểm tra cuối task
tsc, lint, build; con nói thử 5 câu trên Chrome hoặc Edge, bố mẹ nghe lại ở Adult05.
