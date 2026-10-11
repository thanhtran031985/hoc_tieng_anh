# Tiến độ — 29-ai-assist-wordlab — AI hỗ trợ soạn Khám phá từ và Họ vần

Trạng thái chung: 🔄 · Cập nhật lần cuối: 11/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Đề xuất và chốt lựa chọn (DỪNG chờ tôi) | ✅ | Gemini + `fetch` (không gói mới); thử thật 1 từ, 1 họ; chờ bạn duyệt `proposal.md` |
| 1 | Hạ tầng gọi AI | ✅ | `gemini.ts` (fetch, thời gian chờ 40 s, tắt “suy nghĩ”), `throttle.ts` (6 lượt/phút/admin), lọc kết quả AI (hàm thuần), 34 test mới |
| 2 | Gợi ý Khám phá từ | ✅ | Nút “Gợi ý bằng AI” ở Adult22; thử Edge với Gemini thật 5 từ (3 từ mới + 2 từ đã có nhánh); khóa sai báo thân thiện, form không mất |
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

### Bước 2 — Gợi ý Khám phá từ (11/10/2026)
- **Đã làm**: `src/server/admin/ai-suggest.ts` (`suggestExplorer`: nạp từ, hình thư viện, vốn từ cấp → lời nhắc → Gemini → `cleanExplorer`; có chữ ngoài cấp thì gọi lại đúng một lần kèm danh sách chữ cần tránh và giữ bản ít chữ ngoài cấp hơn; giới hạn 6 lượt/phút/admin), `src/features/admin/ai-suggest-actions.ts` (`suggestExplorerAction`, `requireAdmin()` dòng đầu), `aiAvailable` trong dữ liệu soạn, nút “Gợi ý bằng AI” cạnh “Điền sẵn câu hỏi” ở `ExplorerDrawer` (chưa có khóa thì nút xám kèm giải thích; form đã có nội dung thì hỏi xác nhận trước khi thay; kết quả chỉ điền vào form, nhóm từ được chọn sẵn theo gợi ý; hộp “AI nhắc bạn xem lại” bỏ các việc đã có trong khung “Còn … việc”).
- **Kiểm tra** (Edge không đầu, DB verify, Gemini thật, `.tmp-verify/check-29-explorer.mjs`): 5 từ — tiger/teacher/school (chưa có nhánh) và pizza/chair (đã có nhánh, hiện hộp xác nhận): mỗi từ AI điền 5 nhánh trong 7–13 giây, nhóm từ gợi ý đúng (Con vật/Nghề nghiệp/Nơi chốn/Đồ ăn/Đồ vật), mọi khóa hình có trong thư viện, 0 cảnh báo từ ngoài cấp, chưa ghi database trước khi bấm Lưu; Lưu Nháp thành công (đủ nhánh và câu đoạn văn) rồi trả dữ liệu thử về như cũ. Khóa sai (`.tmp-verify/check-29-fail.mjs`): thông báo “AI từ chối yêu cầu…”, không lộ khóa, form giữ nguyên 5 nhánh, nút bật lại. `tsc`, `lint` sạch, `npm test` đạt.
- **Nhận xét chất lượng** (để bạn đọc lại như mọi nội dung AI): nhánh “What is next to a chair?” và “What is a pizza like?” hơi gượng; bản dịch tiếng Việt cần đọc lại. Việc “chưa có âm thanh” còn lại là bình thường (mp3 tạo sau khi lưu).
- **Việc thủ công**: máy chủ `npm run dev` đang chạy ở cổng 3000 cần khởi động lại một lần để đọc khóa mới trong `.env` (tôi đã tắt và bật lại giúp bạn khi xong task).

## Bước tiếp theo

Bước 3 — Gợi ý Họ vần (`suggestFamily`, nút ở ngăn kéo Adult23).
