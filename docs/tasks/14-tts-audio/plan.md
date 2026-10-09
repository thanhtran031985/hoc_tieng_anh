# Kế hoạch — Task 14 `14-tts-audio` (nhánh `feat/14-tts-audio`)

## Context
Từ, câu ví dụ, câu hỏi và âm phonics cần tệp mp3 giọng chuẩn; giọng trình duyệt chỉ là dự phòng. `task.md` giả định gọi dịch vụ TTS qua API. **Bố/mẹ chốt (09/10/2026): không dùng API**, chạy giọng đọc ngay trên máy (Kokoro-82M, Apache-2.0), **một giọng mặc định Anh-Mỹ (en-US) cho cả web**. Hệ quả: bỏ khóa API và biến môi trường TTS; tạo mp3 ở máy dev rồi đưa thư mục tệp lên hosting; nút "Tạo giọng đọc" ở quản trị chỉ chạy khi máy chủ có công cụ (máy dev), còn lại báo rõ.

Khảo sát hiện trạng (Explore):
- `src/lib/speech.ts` đã có `playPronunciation(text, {audioUrl, accent, rate})`: có `audioUrl` thì phát `Audio`, lỗi/bị chặn thì rơi về giọng trình duyệt. Nhưng **không bước bài học nào truyền `audioUrl`**; `src/server/lesson-play.ts:35` (`wordSelect`) chưa lấy `audio`/`exampleAudio`.
- `Word` (`prisma/schema.prisma:217`) đã có `audio`, `exampleAudio` (VarChar 255). `Question` không có cột âm thanh (`prompt.audio` trong JSON, `src/lib/schemas/question.ts`). Chưa có model phonics. Enum `MediaType` đã có `audio`.
- Route `src/app/uploads/[name]/route.ts`: cần đăng nhập, chỉ nhận đuôi ảnh (`isStoredFileName` regex), `Cache-Control: private, max-age=3600`, **không ETag/Range**. Cần mở rộng cho mp3.
- Quản trị: `VocabView.tsx:230-236` (nút "Tạo giọng đọc tự động" disabled "Sắp có"), `MediaView.tsx` `AudioPanel` (~287-340: khối hàng loạt + nút "Tạo" disabled; chỉ liệt kê từ), `dashboard.ts:66-73` + `rules/admin-dashboard.ts:83-90` (cảnh báo thiếu âm thanh, chữ "Giai đoạn 1…"), `nav.ts` (`ADMIN_NAV`, chưa có phonics). Quyền: `requireAdmin()` / `getAdminOrNull()` (`src/server/admin-gate.ts`), kết quả `AdminResult` (`src/server/admin/result.ts`). Mẫu tiến độ có sẵn: tải lên bằng `XMLHttpRequest` + `<progress>` trong `MediaView.tsx:26-47`.
- Nội dung seed: 900 từ + 900 câu ví dụ (cấp 1: 150, 2: 200, 3: 250, 4: 300); cấp 5 chưa có nội dung (task 28); **seed không tạo `questions`** (0 dòng). ≈ 1.800 tệp, ~45.000 ký tự cho cấp 1–4.
- CLI: `scripts/*.mjs` chạy `node` thuần, import TS bằng đường dẫn tương đối có đuôi `.ts` (không alias `@/`); Prisma khởi tạo như `prisma/seed.ts`. Máy: Node 25.2.1, Python 3.13, **không có ffmpeg**, không GPU; có giọng Windows David/Zira (en-US).
- `package.json` chưa có `audio:generate`; không có `tsx`.

## Điều chỉnh 09/10/2026 — công tắc "Giọng mp3" (mặc định tắt)
Bố/mẹ muốn **giữ cả hai**: giọng trình duyệt (mặc định) và giọng mp3, bật bằng công tắc trên màn hình. Đã chốt: nguồn mp3 **chỉ Kokoro chạy trên máy**; **một công tắc toàn hệ thống ở khu quản trị**.
- Công tắc lưu ở bảng cài đặt hệ thống (chưa có: thêm bảng `app_settings` khóa/giá trị bằng migration, hoặc cột tương đương, chốt ở Bước 1), Zod dùng chung, chỉ `admin` đổi được (`requireAdmin()`).
- **Tắt (mặc định):** mọi nơi dùng giọng trình duyệt như GĐ1, kể cả khi đã có tệp mp3; nút "Tạo giọng đọc" mờ kèm chú thích "Bật Giọng mp3 để dùng".
- **Bật:** bài học truyền `audioUrl` khi từ có tệp, thiếu tệp thì rơi về giọng trình duyệt; các nút "Tạo giọng đọc" sáng lên.
- Phía bé: máy chủ chỉ trả `audio`/`exampleAudio` xuống bài học khi công tắc bật.
- Bước 1 cũng làm: truyền giọng Anh-Anh/Anh-Mỹ của bố mẹ vào `playPronunciation` (hiện bài học bỏ qua cài đặt này) và báo khi máy không có giọng tiếng Anh.
- Màn đặt công tắc: thẻ ở đầu `AudioPanel` (Adult13); chốt chi tiết thiết kế khi làm Bước 2.

## So sánh phương án TTS (kết quả Bước 0)
| Phương án | Chi phí cho cấp 1–4 (~45k ký tự) / 10.000 câu (~500k) | Chất lượng | Anh-Anh/Mỹ | IPA/phonics | Ghi chú |
|---|---|---|---|---|---|
| **Kokoro-82M chạy trên máy (chọn)** | 0 đ | Tốt (tự nhiên hơn giọng Windows) | Có cả hai | Hạn chế; âm phonics rời → tải tệp ghi âm | Apache-2.0; ~90 MB tải một lần; CPU vài chục phút; cần npm `kokoro-js` + bộ mã hóa mp3 |
| Google Cloud Neural2 | ~$0,7 / ~$8 | Tốt | Có | SSML IPA | Cần khóa API, bật thanh toán |
| Azure Speech | ~$0,7 / ~$8 (miễn phí 0,5 triệu/tháng) | Tốt, có giọng trẻ em | Có | Chưa rõ tài liệu en-GB | Cần khóa API |
| Amazon Polly Neural | ~$0,7 / ~$8 | Tốt | Có | IPA tốt | Phải tự ký SigV4 |
| ElevenLabs / OpenAI | $22–99 / ~$8 | Rất tự nhiên | OpenAI không chọn chắc | IPA ~80–90% / không | Cần khóa API |
| Giọng Windows (David, Zira) | 0 đ | Máy móc | Chỉ en-US | Không | Không cần cài thêm |
| Bố/mẹ tự thu âm | 0 đ | Tốt nhất | Tùy | Tùy | Quá tốn công cho 1.800 tệp; dùng cho âm phonics |

## Bước 0 — Chốt dịch vụ và nghe thử (làm ngay sau khi duyệt kế hoạch này)
Quyết định đã có (hỏi trực tiếp ở Plan mode): Kokoro chạy trên máy, giọng mặc định en-US. Việc còn lại:
1. Ghi vào `decisions.md`: bỏ API (không `TTS_API_KEY`); mp3 tạo ở máy dev; một giọng en-US; `voice.accent` của bố mẹ chỉ áp dụng khi rơi về giọng trình duyệt; lý do chọn Kokoro (bảng trên). Lưu kế hoạch vào `plan.md`.
2. **Hỏi lại xin phép cài package** (CLAUDE.md cấm tự cài): thử nghiệm ở thư mục tạm ngoài dự án (scratchpad): `npm i kokoro-js` + `lamejs` (hoặc cách mã hóa mp3 khác nếu `lamejs` không chạy). Kiểm tra thực tế: tải được mô hình, danh sách giọng `en-US` (chọn 1 giọng nam và 1 giọng nữ để bạn chọn), tốc độ tạo, kích thước mp3.
3. Tạo 5 câu mẫu (từ đơn, câu ví dụ ngắn, câu hỏi dài, hai từ khó đọc) bằng 2 giọng, đặt vào `public/media/` tạm hoặc đường dẫn bạn mở được để **bạn nghe thử và chọn giọng**. Không đổi mã nguồn dự án ở bước này (trừ tài liệu).
4. `.env.example`: không thêm biến TTS. Nếu cần đường dẫn mô hình/thư mục tạm thì thêm biến tùy chọn (vd `TTS_VOICE=af_heart`) và nhắc bạn điền, không đọc `.env`.
5. Cập nhật `progress.md`, chạy `npm run tasks:dashboard`, báo cáo, đề xuất commit `14-tts-audio: step 0 — chọn giọng đọc chạy trên máy`, **DỪNG chờ "continue"** và chờ bạn chọn giọng sau khi nghe.
Kiểm tra: bạn đã nghe 5 mẫu và chọn giọng; kết luận (cài được hay không, tốc độ, kích thước) ghi vào `progress.md`. Nếu Kokoro không chạy ổn trên Windows này: quay lại hỏi giữa giọng Windows hoặc dịch vụ API.

## Hướng cho các bước sau (chi tiết hóa khi tới bước đó)
- **B1 Hàm tạo và phát mp3:** hàm thuần trong `src/lib/rules/` (đặt tên tệp `audio/<slug>-<sha1 8 ký tự>.mp3` theo nội dung văn bản + giọng, chia lô 20, chọn mục còn thiếu) có test; `src/lib/audio/tts.ts` (chỉ chạy máy chủ: gọi Kokoro, mã hóa mp3, ghi `storage/uploads/audio/`; thiếu công cụ thì trả lỗi rõ). Mở rộng `/uploads/...` (hoặc route `/audio/[name]`) cho mp3: chỉ regex tên an toàn, đăng nhập, ETag + `If-None-Match` + Range, `Cache-Control` dài. Truyền `audio`/`exampleAudio` từ `lesson-play.ts` (và ôn tập, xếp lớp, sổ từ) xuống `SpeakerButton audioUrl`; hook phát giữ cách rơi về giọng trình duyệt, không báo lỗi với bé.
- **B2 Quản trị (Adult10, Adult13):** bỏ "Sắp có", server action tạo cho một từ/câu ví dụ; hàng loạt chạy theo lô 20 do client lặp gọi, có thanh tiến trình, nút Dừng, liệt kê mục lỗi; mở rộng `AudioPanel` liệt kê cả câu ví dụ; sửa cảnh báo Adult08 (đếm cả `exampleAudio`, bỏ chữ "Giai đoạn 1") và test `admin-dashboard.test.ts`.
- **B3 `npm run audio:generate -- --level 3 --missing`:** script `.mjs` dùng cùng hàm của B1, bỏ qua mục đã có tệp.
- **B4 Âm phonics (Adult20):** migration bảng `phonics_sounds` (36 âm, IPA, 2 từ ví dụ, đường dẫn âm thanh), seed, màn `/admin/phonics` đủ 4 trạng thái, Tải lên (chỉ nhận âm thanh, giới hạn dung lượng, lỗi dưới ô), "Tạo âm thanh" (cố gắng bằng TTS, thiếu thì nhắc tải ghi âm), nghe thử, thêm mục vào `ADMIN_NAV`.
- Package mới (`kokoro-js`, `lamejs` hoặc tương đương) chỉ cài sau khi bạn đồng ý ở Bước 0.

## Kiểm tra cuối task
`npx tsc --noEmit`, `npm run lint`, `npm run build`, `npm test`; bài học cấp 3 phát mp3; xóa tệp thì vẫn nghe bằng giọng trình duyệt; đường dẫn `../` bị chặn; tắt mạng vẫn nghe được. Test Playwright theo quy ước (hoãn chạy theo quyết định của bố/mẹ).
