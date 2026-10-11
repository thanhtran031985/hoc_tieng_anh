# Tiến độ — 29-ai-assist-wordlab — AI hỗ trợ soạn Khám phá từ và Họ vần

Trạng thái chung: 🔄 · Cập nhật lần cuối: 11/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Đề xuất và chốt lựa chọn (DỪNG chờ tôi) | ✅ | Gemini + `fetch` (không gói mới); thử thật 1 từ, 1 họ; chờ bạn duyệt `proposal.md` |
| 1 | Hạ tầng gọi AI | ✅ | `gemini.ts` (fetch, thời gian chờ 40 s, tắt “suy nghĩ”), `throttle.ts` (6 lượt/phút/admin), lọc kết quả AI (hàm thuần), 34 test mới |
| 2 | Gợi ý Khám phá từ | ⬜ | |
| 3 | Gợi ý Họ vần | ⬜ | |

## Nhật ký

(Claude ghi sau mỗi bước: đã làm gì, kết quả kiểm tra, việc cần làm thủ công.)

### Bước 0 — Đề xuất và chốt lựa chọn (11/10/2026)
- **Đã làm**: kế hoạch lưu ở `plan.md`; khóa Gemini lưu vào `.env` (`GEMINI_API_KEY`, `GEMINI_MODEL`; không đọc nội dung `.env`, `.env` bị git bỏ qua) và tên biến giữ chỗ vào `.env.example`; script thử `.tmp-verify/ai-sample.mjs` (không commit) gọi Gemini thật với lời nhắc dự kiến.
- **Kết quả thử**: `volcano` (khám phá từ) 5 nhánh hợp lý, 0 khóa hình lạ, 6,5 giây khi tắt “suy nghĩ” (có suy nghĩ: 31 giây); `-ous` (họ vần) 4 giây, từ cùng âm và Bẫy (house, mouse) đúng, có lời Bông và 2 câu vui có dịch. Chi tiết, hạn mức, quyền riêng tư, điều AI hay sai: `proposal.md`.
- **Quyết định**: dùng `fetch` tới REST Gemini nên không cài gói mới; AI chỉ điền form, không tự lưu; 6 lượt/phút/admin.
- **Việc bạn cần làm**: đọc `proposal.md` (mục 6 có 3 câu hỏi, mặc định đã chọn sẵn), nói “continue”. Sau khi xong task nên tạo lại khóa Gemini (khóa từng dán trong chat).

### Bước 1 — Hạ tầng gọi AI (11/10/2026)
- **Đã làm** (bạn giao toàn quyền nên làm tiếp liền mạch, dùng mặc định ở `proposal.md` mục 6):
  - `src/server/ai/gemini.ts`: `generateJson(prompt, {schema})` gọi REST Gemini bằng `fetch`, khóa ở tiêu đề `x-goog-api-key` (không ở địa chỉ), hết thời gian chờ 40 s, `thinkingBudget: 0`; lỗi thân thiện: `AiUnavailableError` (chưa có khóa), `AiBusyError` (429/503), `AiFailedError` (khóa sai, mạng, quá lâu, JSON hỏng); không ghi khóa vào log. `isAiAvailable()` đọc `GEMINI_API_KEY`.
  - `src/server/ai/throttle.ts`: cửa sổ trượt 6 lượt/phút cho mỗi quản trị viên (hằng `AI_CALLS_PER_MINUTE`).
  - `src/server/admin/pictures.ts` (tách `listPictures` khỏi `word-explorer.ts`, thêm `listLibraryPictures`), `src/server/admin/vocab-by-level.ts` (vốn từ theo cấp, nhớ đệm, trả null nếu không đọc được khung chương trình).
  - `src/lib/schemas/ai-suggest.ts` (đầu vào action, hình dạng thô của AI đọc rất dễ tính, kiểu kết quả), `src/lib/rules/ai-suggest.ts` (lời nhắc, `responseSchema`, `cleanExplorer`, `cleanFamily`): chỉ giữ khóa hình có trong thư viện, cắt đúng giới hạn, nhánh nhận diện cố định “a/an + từ” với hình của từ, đúng một đáp án để đoán, báo từ ngoài cấp (trả `outOfLevel` để gọi lại một lần), chạy `explorerIssues`/`familyIssues` (bỏ qua âm thanh); họ vần: tính lại Cùng âm/Bẫy bằng `soundMatches`, bỏ chữ đầu nhiễu tạo từ thật.
- **Kiểm tra**: `npm test` 724/724 (34 test mới: gemini với `fetch` giả, throttle, lọc), `npx tsc --noEmit` và `npm run lint` sạch. Chưa có mã client nào nhập `src/server/ai`, nên khóa chưa thể xuống client; kiểm bundle sau khi build ở bước đóng task.
- **Việc thủ công**: không.

## Bước tiếp theo

Bước 2 — Gợi ý Khám phá từ (`suggestExplorer`, action, nút và hộp xác nhận ở ngăn kéo Adult22).
