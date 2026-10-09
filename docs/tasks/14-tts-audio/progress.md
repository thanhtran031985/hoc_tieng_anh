# Tiến độ — 14-tts-audio — Giọng đọc mp3 và âm phonics

Trạng thái chung: 🔄 · Cập nhật lần cuối: 09/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Chọn dịch vụ TTS (DỪNG chờ tôi) | ✅ | Đã chốt Kokoro chạy trên máy, giọng en-US, không dùng API; chờ bố/mẹ nghe 10 tệp mẫu và chọn giọng |
| 1 | Hàm tạo và phát mp3 | ✅ | `synthesizeMp3` (Kokoro) + mp3, route `/audio/[name]`, bảng `app_settings`, `SpeechConfig`; kiểm bằng Edge không đầu |
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

### Bước 1 — 09/10/2026
- Bố/mẹ trả lời "continue" nên tôi coi là đồng ý cài gói và dùng giọng mặc định `af_heart` (đổi được bằng biến tùy chọn `TTS_VOICE`, đã thêm vào `.env.example` dạng chú thích; không cần khóa API). Cài `kokoro-js` và `@breezystack/lamejs` làm **devDependencies**.
- Cơ sở dữ liệu: bảng `app_settings` (khóa → JSON) bằng migration `20261009135704_app_settings` (chạy được trên MariaDB và MySQL 8); model `AppSetting`. Công tắc "Giọng mp3" lưu ở khóa `voice_mp3`, mặc định tắt; schema Zod `voiceMp3SettingSchema` ở `src/lib/schemas/app-settings.ts`, đọc/ghi ở `src/server/app-settings.ts` (ghi chỉ qua server action quản trị, làm ở Bước 2).
- `src/lib/rules/tts.ts` (hàm thuần, 13 test mới): tên tệp `word-12-ab12cd34.mp3`, chặn tên lạ, tách câu, chia lô 20, dải byte, bảng "chữ → mp3".
- `src/server/audio/`: `tts.ts` (`synthesizeMp3`, nạp Kokoro fp16 một lần, đọc từng câu rồi nối, báo `TtsUnavailableError` khi máy không có `kokoro-js`), `mp3.ts` (mã hóa), `files.ts` (ghi/đọc/xóa trong `storage/uploads/audio/`, tên chứa mã băm của chữ và giọng). Thử thật: 2 câu → mp3 40 KB trong 6 giây; chữ rỗng hoặc dài hơn 500 ký tự bị từ chối.
- Route `/audio/[name]` (`src/app/audio/[name]/route.ts`): cần đăng nhập (401), chỉ nhận đúng dạng tên (mọi `../`, thư mục con, đuôi lạ đều 404), `ETag` + 304, `Range` + 206 (Safari cần), cache dài (`immutable`, vì tên chứa mã băm).
- Phát: `speech.ts` thêm `configureSpeech`/`resetSpeech` (giọng Anh/Mỹ của hồ sơ và bảng "chữ → mp3"); `SpeechConfig` đặt ở trang bài học; `getLessonPlay` trả `audio` (chỉ khi công tắc bật). Các bước học không phải sửa. Sửa lỗi có sẵn: tệp mp3 lỗi từng làm giọng trình duyệt đọc hai lần.
- `next.config.ts`: `serverExternalPackages` cho `kokoro-js`, `onnxruntime-node`, `@huggingface/transformers`. `scripts/alias-loader.mjs`: bộ nạp để script `node` hiểu `@/` và nhập `.ts` không ghi đuôi (Bước 3 dùng lại).
- Kiểm tra: `tsc` ✅, `lint` ✅, `npm test` 222/222 ✅, `build` ✅. Edge không đầu ở `/lesson/220` (hồ sơ Mai Linh, giọng en-GB): công tắc bật và từ có mp3 thì tải `/audio/word-351-….mp3`, phát không lỗi và không đọc bằng giọng trình duyệt; route trả 200 `audio/mpeg`, 304, 206, chưa đăng nhập 401; 5 đường dẫn lạ đều 404; đường dẫn mp3 không có tệp thì đọc đúng một lần bằng giọng trình duyệt en-GB, không hiện lỗi; công tắc tắt thì không tải mp3 và đường dẫn không lộ trong trang; không lỗi console. Đã dọn dữ liệu thử.
- Chưa làm (ghi `decisions.md`): thông báo khi máy không có giọng tiếng Anh; áp dụng tốc độ đọc của bố mẹ; nối `SpeechConfig` vào ôn tập, sổ từ, xếp lớp, bản đồ.

## Bước tiếp theo

Bước 2 — Nút tạo giọng đọc trong quản trị (Adult10, Adult13), kèm công tắc "Giọng mp3".
