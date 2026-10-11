# Kế hoạch — Task 29 `29-ai-assist-wordlab` (nhánh `feat/29-ai-assist-wordlab`, tách từ `feat/28-content-l5`)

## Context
Soạn Khám phá từ (Adult22) và Họ vần (Adult23) hiện hoàn toàn bằng tay (task 27 phải viết 150 từ + 36 họ bằng tệp dữ liệu). Task này thêm nút “Gợi ý bằng AI” để người quản trị bấm một lần là có nháp 4–6 nhánh (hoặc cả họ vần), đọc, sửa rồi mới lưu. AI không bao giờ tự lưu hay xuất bản; điều kiện xuất bản (hình, mp3, dịch) vẫn do `explorerIssues` / `familyIssues` chặn.

Người dùng đã có **khóa Gemini miễn phí** của Google (đã thử 1 lần: `gemini-flash-latest` trả lời bình thường). Quyết định: dùng **Google Gemini REST bằng `fetch`** nên **không cần cài gói mới** (CLAUDE.md cấm cài gói khi chưa hỏi; task.md ban đầu nói “gói SDK” — ghi thay đổi vào `decisions.md`, không sửa `task.md`).

Việc đầu tiên khi được duyệt (người dùng đã đồng ý): nối `GEMINI_API_KEY=<khóa>` vào `.env` (không đọc nội dung `.env`; `.env` đã được git bỏ qua, đã kiểm `git check-ignore`) và thêm `GEMINI_API_KEY=` + `GEMINI_MODEL=gemini-flash-latest` (giá trị giữ chỗ) vào `.env.example`. Khóa đã dán trong khung chat nên nhắc người dùng tạo lại khóa khi xong.

## Nền sẵn có (tái dùng)
- `src/features/admin/ExplorerDrawer.tsx`: state `branches: EBranch[]` (`kind, questionEn/Vi, answers, distractors, sentence`), `fillQuestions()` (l.149) là mẫu cho “điền vào form, chưa lưu”, nút ở l.289; `blankBranch()`; `data.pictures` (danh sách khóa hình), `toast`, `errors`.
- `src/features/admin/word-explorer-actions.ts`: mẫu server action (`requireAdmin()` dòng đầu, try/catch, thông báo tiếng Việt, `AdminResult`); `src/server/admin/word-explorer.ts` có `listPictures()` (private, l.42) và `getExplorerEditor`.
- `src/features/admin/FamilyDrawer.tsx` + `family-actions.ts` + `src/server/admin/family.ts`: `searchBankWords` (từ trong kho chứa vần), `addMembers` (tự gắn `sameSound` bằng `soundMatches`), `payloadOf()`.
- Luật: `explorerIssues`, `QUESTION_SETS`, `fillQuestionSet`, `composeSentence` (`src/lib/rules/word-explorer.ts`); `familyIssues`, `soundMatches`, `buildInfo` (`word-family.ts`); `allowedTokensFor`, `unknownTokens` (`vocab-check.ts`); schema `wordQuestionDataSchema`, `explorerSentenceSchema`, `familyPatternSchema`, `familyIpaSchema`, `onsetSchema`, `saveFamilySchema`.
- `src/server/rate-limit.ts` (đếm trong bộ nhớ) làm mẫu; `src/server/audio/tts.ts` làm mẫu `isTtsAvailable()` + `TtsUnavailableError`.
- Vốn từ theo cấp: chỉ có trong script (`scripts/check-wordlab.mjs` l.47–55: `prisma/seed/curriculum/level-NN.json` + `allowed-extra.json` + `allowed-wordlab.json`) → viết module server tương đương.

## Quyết định thiết kế
- **Gọi Gemini**: `src/server/ai/gemini.ts` — `POST https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`, header `x-goog-api-key`, `generationConfig: { responseMimeType: "application/json", responseSchema, temperature 0.4 }`, hết thời gian chờ 40 s (model “flash” có suy nghĩ nên chậm), nhận `fetchImpl` để test không chạm mạng. `isAiAvailable()` = có khóa. `AiUnavailableError` (chưa có khóa), `AiBusyError` (HTTP 429 → “AI đang bận, thử lại sau ít phút”), lỗi khác → thông báo thân thiện. **Không bao giờ log khóa hay đưa khóa xuống client.**
- **Giới hạn**: tối đa 6 lượt/phút/admin (hàm nhỏ trong `src/server/ai/throttle.ts`, bộ nhớ) để không cạn hạn mức miễn phí; nút bị khóa khi đang chạy.
- **Quyền riêng tư**: bản miễn phí của Google có thể dùng dữ liệu gửi đi để cải thiện sản phẩm → chỉ gửi từ vựng, nghĩa, cấp và danh sách khóa hình (công khai trong repo), **không gửi dữ liệu học sinh, tên, email**. Ghi vào `decisions.md`.
- **Khám phá từ** (`suggestExplorer`): đầu vào `{ wordId, set? }`. Server nạp từ/nghĩa/cấp/chủ đề, danh sách khóa hình hiện có (≈ 870 khóa, dạng tên không đuôi), gợi ý nhóm (`QUESTION_SETS`) và vài câu mẫu của nhóm. Lời nhắc yêu cầu: 4–6 nhánh, nhánh đầu là nhận diện, mỗi nhánh 1–5 đáp án (tiếng Anh ngắn + nghĩa Việt + **khóa hình chỉ chọn trong danh sách**, đúng một đáp án `guess`), 1–2 hình nhiễu sai rõ ràng, một câu cho đoạn văn kèm dịch; câu hỏi và câu văn chỉ dùng từ trong vốn từ tới cấp của từ (đáp án và nhãn hình nhiễu được miễn).
- **Lọc sau khi nhận** (hàm thuần `src/lib/rules/ai-suggest.ts`): parse bằng Zod; khóa hình không có trong thư viện → bỏ hình, ghi “cần vẽ hình: <khóa>”; cắt cho đủ giới hạn (đáp án ≤ 5, nhiễu ≤ 2 và ≥ 1, nhánh ≤ 6); loại kind lạ; kiểm `unknownTokens` cho câu hỏi và câu văn → cảnh báo từ ngoài cấp (thử lại tự động **một lần** với danh sách từ cần tránh); chạy `explorerIssues` (trừ mp3) để báo còn thiếu gì. Trả về `{ branches, warnings[] }`.
- **Họ vần** (`suggestFamily`): đầu vào `{ pattern, levelId? }`. Server lấy `searchBankWords(pattern)` (từ có thật trong kho, kèm IPA) rồi gửi cho AI làm **danh sách ứng viên**; AI chọn từ cùng âm và từ Bẫy **chỉ trong ứng viên**, đề xuất IPA của vần, 3 chữ cái đầu nhiễu (không tạo từ thật), lời Bẫy tiếng Việt và 2 câu vui (en/vi) dùng từ trong họ. Server **tính lại `sameSound` bằng `soundMatches`** (không tin AI), kiểm chữ đầu nhiễu bằng `buildInfo`, kiểm `familyIssues` mức `save`; thông báo chỗ AI và quy tắc không đồng ý.
- **Giao diện**: nút “Gợi ý bằng AI” (icon wand) cạnh “Điền sẵn câu hỏi” (Adult22) và cạnh “Gợi ý từ trong kho” (Adult23); chỉ hiện khi `aiAvailable`, không có khóa thì nút xám kèm `title` giải thích như nút giọng đọc. Nếu form đã có nội dung → hộp xác nhận “Thay các nhánh hiện có bằng gợi ý?”. Kết quả chỉ điền vào form (đánh dấu chưa lưu); danh sách cảnh báo hiện trong khung cảnh báo có sẵn / toast; “Hủy” bỏ hết. Đáp án cũ có mp3 sẽ mất mp3 khi thay → nêu trong hộp xác nhận.
- **Nhóm từ mới**: AI có thể trả `suggestedSet` trong 5 nhóm hiện có để chọn sẵn ô “Nhóm từ”; thêm nhóm mới vào `QUESTION_SETS` vẫn là việc sửa mã tay (ngoài task).

## Tệp tạo / sửa
Tạo: `src/server/ai/gemini.ts`, `src/server/ai/throttle.ts`, `src/server/admin/ai-suggest.ts` (nạp dữ liệu + gọi + lọc), `src/server/admin/vocab-by-level.ts` (vốn từ theo cấp, đọc JSON khung + 2 tệp ngoại lệ, nhớ đệm), `src/server/admin/pictures.ts` (tách `listPictures` dùng chung), `src/lib/rules/ai-suggest.ts` (lời nhắc, schema trả về, lọc), `src/lib/schemas/ai-suggest.ts` (+ các `*.test.ts`).
Sửa: `word-explorer-actions.ts`, `family-actions.ts` (thêm 2 action, `requireAdmin()` dòng đầu, Zod), `ExplorerDrawer.tsx`, `FamilyDrawer.tsx`, `src/server/admin/word-explorer.ts` và `family.ts` (thêm `aiAvailable`), `.env.example`, `docs/tasks/29-*`.

## Các bước (theo task.md; chỉ Bước 0 dừng chờ)
**Bước 0 — Chốt lựa chọn (DỪNG chờ “continue”).** Lưu khóa vào `.env`/`.env.example`; script thử `.tmp-verify` (không commit) gọi Gemini thật cho 1 từ (vd `volcano`) và 1 họ (vd `-ous`) bằng lời nhắc dự kiến, in kết quả thô và kết quả sau lọc; `proposal.md` ghi: Gemini + fetch (không gói), model, biến môi trường, lời nhắc mẫu, hạn mức miễn phí và cách tránh cạn (6 lượt/phút), quyền riêng tư, gợi ý mẫu thật, điều AI hay sai. progress → dashboard → commit → DỪNG.
**Bước 1 — Hạ tầng.** `gemini.ts`, `throttle.ts`, `vocab-by-level.ts`, `pictures.ts`, schema + hàm lọc thuần, test (bản giả `fetchImpl`, không mạng). Kiểm: `npm test`, `tsc`, `lint`; tìm khóa trong `.next` build/bundle client → không có.
**Bước 2 — Khám phá từ.** `suggestExplorer` + action + nút + hộp xác nhận. Kiểm (Edge không đầu, DB verify, `GEMINI_API_KEY` truyền qua biến môi trường lệnh): thử 5 từ thật (mỗi nhóm một từ), kết quả qua `explorerIssues`; sửa và lưu được; mất mạng/khóa sai → thông báo thân thiện, form không mất; admin chưa mở khóa phụ huynh bị chặn.
**Bước 3 — Họ vần.** `suggestFamily` + action + nút. Kiểm 3 họ (vd `-ous`, `-ack`, `-ound`): qua `familyIssues`, chữ đầu nhiễu không trùng từ thật, `sameSound` do `soundMatches`.
**Đóng task.** `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`; thử khóa thật 1 từ + 1 họ; spec Playwright: không thêm (gọi mạng, khó ổn định) — ghi vào decisions; commit từng bước, push, cập nhật memory; nhắc người dùng đổi khóa.

## Kiểm thử
- Unit (không mạng): lọc đầu ra (khóa hình lạ, quá giới hạn, kind lạ, từ ngoài cấp, nhiều `guess`), thử lại một lần, schema đầu vào, `gemini.ts` với `fetchImpl` giả (200, 429, hết thời gian, JSON hỏng), throttle, `vocab-by-level`.
- Edge (`.tmp-verify/cdp.mjs`, DB `hoc_tieng_anh_verify`, server cổng 3100): bấm nút ở Adult22 và Adult23, đọc kết quả điền vào form.
- Kiểm bảo mật: action không gọi được khi chưa đăng nhập quản trị; khóa không có trong bundle client và không xuất hiện trong log.

## Việc thủ công cho người dùng
Tạo lại khóa Gemini sau khi xong (khóa từng dán trong chat); điền khóa mới vào `.env`; kiểm tra hạn mức miễn phí trên Google AI Studio nếu dùng nhiều.
