# Tiến độ — 14-tts-audio — Giọng đọc mp3 và âm phonics

Trạng thái chung: 🔄 · Cập nhật lần cuối: 09/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Chọn dịch vụ TTS (DỪNG chờ tôi) | 🔄 | Đã chốt Kokoro chạy trên máy, giọng en-US, không dùng API; chờ bố/mẹ nghe 10 tệp mẫu và chọn giọng |
| 1 | Hàm tạo và phát mp3 | ⬜ | |
| 2 | Nút tạo giọng đọc trong quản trị (Adult10, Adult13) | ⬜ | |
| 3 | Lệnh tạo mp3 cho nội dung seed | ⬜ | |
| 4 | Âm phonics (Adult20) | ⬜ | |

## Nhật ký

### Bước 0 — 09/10/2026
- Quyết định của bố/mẹ (hỏi ở Plan mode): **không dùng API**, chạy giọng đọc ngay trên máy; chọn **Kokoro-82M** (Apache-2.0); **một giọng Anh-Mỹ (en-US) cho cả web**, không đổi schema. Ghi vào `decisions.md`, kế hoạch lưu ở `plan.md` (có bảng so sánh Google, Azure, Polly, ElevenLabs/OpenAI, giọng Windows, tự thu âm).
- Thử ở thư mục tạm **ngoài dự án** (chưa cài gì vào dự án): `npm i kokoro-js @breezystack/lamejs` (45 gói; `npm audit` báo 7 lỗ hổng ở gói con, chỉ dùng ở máy dev để tạo tệp, không chạy trên web). Mô hình tải được, nạp 2 giây. Chạy bằng CPU i5-1335U, không GPU, Node 25.
- Tốc độ (câu "The cat is sleeping on the sofa.", ~2,6 giây âm thanh): q8 ≈ 13 giây, **fp16 ≈ 5 giây**, q4 ≈ 5 giây. Chọn fp16: khoảng 4–6 giây mỗi tệp, nên cấp 1–4 (900 từ + 900 câu ≈ 1.800 tệp) mất khoảng 2–3 giờ chạy một lần, có thể ngắt và chạy tiếp (`--missing`). Tạo một từ ở quản trị ≈ 4 giây; lô 20 mục ≈ 1,5–2 phút.
- mp3 mono 24 kHz 64 kbps do `lamejs` mã hóa: từ đơn ≈ 13 KB, câu ví dụ ≈ 21–24 KB, câu hỏi dài ≈ 40 KB; 1.800 tệp ≈ 35–40 MB.
- Giọng en-US: `af_heart` (nữ, chất lượng cao nhất của Kokoro) và `am_michael` (nam). 10 tệp mẫu (từ đơn "elephant", câu ví dụ, câu hỏi dài, "Thursday", "Would you like some water, please?") ở `.tmp-verify/mau-giong/` (không đưa lên git), đặt tên `<số>-<loại>-<giọng>.mp3`.
- **Việc bố/mẹ cần làm:** nghe 10 tệp, chọn giọng (hoặc bảo tôi thử giọng Mỹ khác, vd `af_bella`, `af_nicole`, `am_fenrir`); đồng ý cho cài `kokoro-js` và `@breezystack/lamejs` vào dự án ở Bước 1 (CLAUDE.md cấm tự cài); lưu ý máy cần nối mạng lần đầu để tải mô hình (~160 MB cho fp16) từ Hugging Face, sau đó chạy offline.
- Điều chỉnh sau khi nghe góp ý: bố/mẹ muốn giữ cả giọng trình duyệt (mặc định) và giọng mp3, bật bằng công tắc toàn hệ thống ở khu quản trị; nguồn mp3 chỉ Kokoro trên máy. Đã ghi `decisions.md` và `plan.md`.
- Chưa đổi mã nguồn dự án ở bước này.

## Bước tiếp theo

Chờ bố/mẹ chọn giọng và cho phép cài `kokoro-js`, `@breezystack/lamejs` rồi làm Bước 1 — Hàm tạo và phát mp3.
