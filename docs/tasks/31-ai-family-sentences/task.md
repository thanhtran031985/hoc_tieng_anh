# 31-ai-family-sentences — AI gợi ý câu cho đoạn văn vui của Họ vần

Ngày tạo: 11/10/2026 · Giai đoạn: GĐ2 · Phụ thuộc: 26, 29 · Nhánh: `feat/31-ai-family-sentences`

> Bản nháp do Claude viết từ yêu cầu ngày 11/10/2026: “ở page Họ vần, chỗ thêm câu tôi muốn thêm gợi ý AI chỉ riêng phần tạo câu đối với các từ của họ, vì tôi nhập câu có thể sai”.

## Claude hiểu yêu cầu như sau
- Ở ngăn kéo soạn Họ vần, mục “Đoạn văn vui” có nút “Thêm câu”; người soạn tự gõ câu tiếng Anh và bản dịch nên dễ sai chính tả, ngữ pháp, hoặc câu không dùng các từ của họ.
- Cần **một nút “Gợi ý câu bằng AI” riêng cho phần câu** (khác nút “Gợi ý bằng AI” của task 29 vốn điền cả họ): AI nhìn **các từ đang có trong họ** (nhất là từ Cùng âm) rồi viết 2–3 câu ngắn, vui, đúng ngữ pháp, dùng càng nhiều từ của họ càng tốt, kèm bản dịch tiếng Việt.
- **Chỉ điền vào ô câu** (chưa lưu); từ của họ, âm IPA, chữ đầu nhiễu, lời Bông giữ nguyên. Người soạn đọc, sửa rồi mới bấm Lưu thay đổi.
- Câu chỉ nên dùng từ **đúng cấp của họ** (từ vựng đã dạy tới cấp đó), giống bộ lọc của task 29.

## Mục tiêu
Người soạn Họ vần bấm một nút là có 2–3 câu vui chuẩn, dùng các từ của họ, có bản dịch; câu có chỗ chưa ổn (từ ngoài cấp, không chứa từ của họ) thì được báo để sửa.

## Thiết kế
Không có màn mới: thêm nút (icon wand) cạnh “Thêm câu” trong mục câu của `FamilyDrawer` (Adult23), hộp xác nhận khi đã có câu, khung “AI nhắc bạn xem lại” dùng lại của task 29.

## Quyết định kiến trúc
- Tái dùng hạ tầng task 29: `src/server/ai/gemini.ts` (`generateJsonWithRetry`, xoay model khi hết hạn mức ngày), `throttle.ts` (6 lượt/phút/admin), `vocab-by-level.ts` (vốn từ theo cấp), bộ lọc ở `src/lib/rules/ai-suggest.ts`.
- Server action gọi `requireAdmin()` ở dòng đầu; đầu vào qua Zod; **server tự nạp từ, IPA, nghĩa từ database theo mã từ**, không tin chữ do client gửi. Chỉ gửi AI từ vựng, nghĩa, cấp (không gửi dữ liệu học sinh).
- AI chỉ điền form, không lưu; đổi chữ câu thì giọng đọc cũ mất (logic có sẵn).

## Các bước
### Bước 0 — Kế hoạch
Ghi `plan.md` (đã có), chốt lời nhắc và cách lọc.
**Kiểm tra:** `plan.md` có kế hoạch.
### Bước 1 — Luật và schema (không mạng)
`familySentencesPrompt`, `FAMILY_SENTENCES_RESPONSE_SCHEMA`, `cleanFamilySentences`, schema đầu vào/kết quả; test.
**Kiểm tra:** `npm test`, `npx tsc --noEmit`, `npm run lint` sạch.
### Bước 2 — Server, action và nút
`suggestFamilySentences` + `suggestFamilySentencesAction`; nút ở `FamilyDrawer`.
**Kiểm tra:** `tsc`, `lint` sạch; action chặn khi chưa đăng nhập quản trị.
### Bước 3 — Kiểm với Gemini thật và đóng task
Thử 3 họ (-ous, -ack, -ound) bằng Edge không đầu: câu có từ của họ, từ ngoài cấp được báo, chưa lưu đến khi bấm Lưu, chưa có khóa thì nút xám, khóa sai thì thông báo thân thiện; `tsc`, `lint`, `npm test`, `npm run build`.
**Kiểm tra:** theo mô tả trên.

## Phạm vi
- Được tạo/sửa: `src/lib/rules/ai-suggest.ts`, `src/lib/schemas/ai-suggest.ts`, `src/server/admin/ai-suggest.ts`, `src/features/admin/ai-suggest-actions.ts`, `FamilyDrawer.tsx`, test, tài liệu của task.
- KHÔNG làm: AI gợi ý cho phần khác của Họ vần (đã có ở task 29); kiểm lại câu do người soạn tự gõ; gợi ý câu cho Khám phá từ; AI cho học sinh.

## Tiêu chí hoàn thành
- Nút “Gợi ý câu bằng AI” điền 2–3 câu có bản dịch vào đoạn văn của họ, dùng từ của họ, cảnh báo từ ngoài cấp.
- Chưa lưu gì cho đến khi bấm Lưu; chưa có khóa thì nút xám; lỗi AI báo thân thiện; `tsc`, `lint`, `test`, `build` sạch.
