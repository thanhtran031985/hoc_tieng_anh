# Kế hoạch — Task 17 `17-speaking` (nhánh `feat/17-speaking`)

## Context
Bé cần luyện nói theo câu mẫu (Screen25): ghi âm bằng micro, được chấm dễ tính 1–3 sao bằng nhận diện giọng nói của trình duyệt, nghe lại giọng mình; bản ghi lưu cho bố mẹ nghe lại (Adult05, phần ghi âm); quản trị soạn câu luyện nói (tab Adult18); bố mẹ bật/tắt “Chấm phát âm” (Adult07). Nền sẵn có: `PlayStep` lấy nội dung từ `questions` (task 15), `useLadder`, `useHotkeys`, TTS mp3 + route `/audio` (task 14), bảng `/admin/question-types` (task 15), khu bố mẹ `/parent/*` với `requireParentGate`.

Quyết định mặc định (ghi `decisions.md`):
- Dạng `speaking` (8.7) là loại thứ 6 của `EXTRA_QUESTION_TYPES`: prompt `{text (câu mẫu ≤ 12 từ), audio?, wordId?}`, options `{leniency: "easy"|"normal"|"strict"}`, answer `{expected}`.
- Ngưỡng 3★/2★ theo mức: easy ≥60%/≥35%, normal ≥80%/≥50% (đúng task.md), strict ≥90%/≥70%; luôn ≥1★ khi bé đã nói. Từ khớp khi giống hệt hoặc gần (sai 1 ký tự với từ ≥ 4 chữ, apple/apples) vì nhận diện giọng nói hay lệch nhẹ.
- `firstTryCorrect = stars ≥ 2` (không phạt); không có “sai lần 3” → không làm lại cuối bài.
- Chấm tắt (Adult07) hoặc trình duyệt không hỗ trợ/nhận diện lỗi → chỉ ghi âm, 2★ “hoàn thành”, không gọi nhận diện.
- Không có micro: `SpeakStep` hiển thị ngay `ListenChooseStep` (hình chọn từ cùng từ; dựng sẵn ở server khi câu có hình); câu không có hình thì chỉ báo nhẹ + Tiếp tục (2★).
- Âm thanh mẫu: `prompt.audio` (mp3 qua TTS Kokoro hoặc tải lên) — thiếu thì xem thử/chơi bằng giọng trình duyệt, nhưng **Xuất bản** bị chặn; Adult18 tạo/tải âm thanh sau khi tự lưu nháp (như Adult19).
- Bản ghi: bảng `recordings` (learner_id, question_id?, sentence, file, duration_ms, stars, transcript, scored, created_at); tệp `storage/recordings/<learnerId>/rec-<id>-<hash>.webm`; giữ 3 bản gần nhất mỗi (bé, câu) — xóa cả dòng và tệp; route `/recordings/[id]` (session + đúng gia đình + cổng bố mẹ mở, hỗ trợ Range); lưu bằng server action (`requireActiveLearner`, kiểm dung lượng ≤ 1 MB, loại webm/ogg/mp4 theo chữ ký). Bé nghe lại bản của mình ngay trên máy bằng blob, không qua route.
- `learnerSettings.speechScoring` (mặc định bật) lưu cùng `learners.settings`, công tắc ở tab “Giao diện & âm thanh” (Adult07) kèm dòng giải thích gửi âm thanh tới Google/Microsoft.
- Adult05 chỉ phần ghi âm: `/parent/works` (mục menu “Bài viết & ghi âm” bật), danh sách theo ngày + chi tiết có trình phát (sóng âm tua bằng chuột/←→, 1× / 0,75×), xóa qua hộp thoại; phần bài viết/chấm điểm của bố mẹ để “Sắp có” (GĐ3).

## Các bước
**Bước 0 — Ghi âm và quyền micro.** `src/features/lesson/use-recorder.ts` (MediaRecorder webm/opus, tối đa `REC_MAX_MS` 10 s ở `constants.ts`, trạng thái idle → recording → stopped; `denied`, `nomic`, `error`), hàm thuần chọn trạng thái từ lỗi `getUserMedia` (`recorder-state.ts` + test); `PlayStep` `speak`; `SpeakStep` khung (Sẵn sàng/Đang ghi/Đang chấm/Chưa cho micro/Không có micro) với phím R, tự dừng 10 s, Thử lại, “Hôm nay bỏ qua phần nói”.
**Bước 1 — Chấm dễ tính + màn Screen25.** `src/lib/rules/speaking.ts` (+test): chuẩn hóa, so từ, tỉ lệ, sao theo mức, nhận xét/lời khen, đánh dấu từng từ; `use-speech-recognition.ts` (Web Speech API, `en-US/en-GB` theo hồ sơ, hỏng thì bỏ qua); màn kết quả (sao, lời khen của Bông, chữ tốt xanh/cần nói lại cam nhẹ, Nghe giọng tớ · Nghe giọng mẫu · Nói lại · Tiếp tục), `ItemResult`, `getLessonPlay` dựng `speak` + cờ chấm của hồ sơ + fallback hình.
**Bước 2 — Lưu bản ghi âm.** Migration `recordings`; `src/server/recordings.ts` (lưu, giữ 3 bản, xóa, đọc), server action lưu từ `SpeakStep` (sau khi ghi xong, không chặn bài nếu lỗi), route `/recordings/[id]` kiểm quyền; test hàm thuần giữ-3-bản và kiểm chữ ký tệp.
**Bước 3 — Soạn câu luyện nói (Adult18).** Mở rộng `ExtraForm` (`audio`, `leniency`), `buildExtraData`/`readExtraForm`/`buildExtraPreviewStep`, form tab “Luyện nói” (câu mẫu ≤ 12 từ, âm thanh mẫu tải lên/tạo giọng đọc, mức dễ tính 3 nấc), lỗi tiếng Việt, chặn xuất bản thiếu âm thanh; route upload + action tạo giọng đọc cho câu hỏi (`question-<id>` mp3).
**Bước 4 — Bản ghi âm ở khu bố mẹ.** `/parent/works` (page/loading/error, 4 trạng thái), `WorksView` (danh sách theo ngày, chi tiết, trình phát, xóa); `ParentFrame` active `works`; Adult07 công tắc “Chấm phát âm” + `speechScoring` trong schema/server.

## Kiểm thử và tài liệu
- Unit: `speaking.test.ts`, `recorder-state.test.ts`, giữ-3-bản/kiểm tệp ghi âm, luật soạn luyện nói, `buildPlaySteps` cho `speak`.
- Edge không đầu (`--use-fake-device-for-media-stream --use-fake-ui-for-media-stream`, nhận diện giọng nói giả bằng script chèn trước khi tải trang): ghi âm, tự dừng, chấm 1–3★, tắt chấm, từ chối micro/không micro, lưu và giữ 3 bản, gia đình khác bị chặn, soạn câu ở Adult18, nghe/xóa ở `/parent/works`, công tắc Adult07; kiểm 1366×768 không cuộn.
- e2e viết, không chạy: `tests/e2e/17-luyen-noi.spec.ts` + cập nhật `chung`, `thiet-ke`, `12a`/`11` (menu bố mẹ), `helpers/lesson.ts`.
- Cuối: `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`; `progress/decisions/README`, dashboard (Cảnh báo: 0); commit từng bước + push.
- Việc thủ công để báo: `npx prisma migrate deploy`; nói thử 5 câu trên Chrome/Edge thật (nhận diện cần mạng), bố mẹ nghe lại ở “Bài viết & ghi âm”; Playwright sau khi xong hết task.
