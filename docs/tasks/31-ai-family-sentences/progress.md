# Tiến độ — 31-ai-family-sentences — AI gợi ý câu cho đoạn văn vui của Họ vần

Trạng thái chung: 🔄 · Cập nhật lần cuối: 11/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|------|-----|------------|---------|
| 0 | Kế hoạch | ✅ | `plan.md` (chung với task 30) |
| 1 | Luật và schema (không mạng) | ✅ | familySentencesPrompt, cleanFamilySentences, schema; 10 test mới |
| 2 | Server, action và nút | ✅ | suggestFamilySentences + action + nút ở FamilyDrawer; test schema đầu vào |
| 3 | Kiểm với Gemini thật và đóng task | ⬜ | |

## Nhật ký
<!-- Mỗi bước thêm một mục:
### Bước N — <tên> (<ngày>)
- Đã làm:
- File tạo/sửa:
- Kết quả kiểm tra:
- Việc tôi cần làm thủ công:
-->

### Bước 1 — Luật và schema (11/10/2026)
- **Đã làm**: `src/lib/schemas/ai-suggest.ts` thêm `suggestFamilySentencesInputSchema` (vần, cấp, 1–24 mã từ không trùng), `aiFamilySentencesRawSchema` (đọc dễ tính) và kiểu `SuggestedFamilySentences`; `src/lib/rules/ai-suggest.ts` thêm `familySentencesPrompt` (nêu vần, IPA, cấp, từ cùng âm kèm nghĩa, từ Bẫy chỉ dùng khi cần, đúng 3 câu ≤ 12 chữ, chữ cần tránh), `FAMILY_SENTENCES_RESPONSE_SCHEMA`, `cleanFamilySentences` (bỏ câu rỗng/trùng, giữ tối đa 3 câu; báo câu quá dài, thiếu bản dịch, không dùng từ nào của họ — nhận cả dạng thêm đuôi như số nhiều —, từ cùng âm chưa câu nào dùng, và chữ ngoài cấp với chữ của các từ trong họ được phép; trả `outOfLevel` để gọi lại một lần).
- **Kiểm tra**: 10 test mới (lời nhắc có/không có Bẫy; câu tốt; cắt 3 câu và bỏ trùng; dạng thêm đuôi; câu không dùng từ của họ, quá dài, thiếu dịch; chữ ngoài cấp; không có vốn từ; từ cùng âm chưa dùng; dữ liệu hỏng), không gọi mạng; `tsc` sạch, 32 test ở `ai-suggest.test.ts` đạt.
- **Việc thủ công**: không.

### Bước 2 — Server, action và nút (11/10/2026)
- **Đã làm**: `suggestFamilySentencesInputSchema` nhận vần, âm IPA đang nhập, cấp và các từ (mã từ + cờ Cùng âm/Bẫy; ít nhất một từ cùng âm, không trùng, tối đa 24); `suggestFamilySentences` ở `src/server/admin/ai-suggest.ts` (server tự nạp chữ, IPA, nghĩa từ database theo mã từ và cấp từ `levelId`, giới hạn 6 lượt/phút/admin dùng chung, vốn từ theo cấp, gọi Gemini có xoay model, chữ ngoài cấp thì gọi lại một lần); `suggestFamilySentencesAction` (`requireAdmin()` ở dòng đầu); nút “Gợi ý câu bằng AI” (icon wand) cạnh “Thêm câu” ở mục “Đoạn văn vui” của `FamilyDrawer`: xám kèm giải thích khi chưa có khóa hoặc chưa có từ cùng âm, đã có câu thì hỏi “Thay các câu hiện có bằng gợi ý của AI?”, kết quả chỉ điền vào ô câu (chưa lưu) và hiện khung “AI nhắc bạn xem lại các câu”.
- **Kiểm tra**: thêm 4 test cho schema đầu vào (36 test ở `ai-suggest.test.ts`), `npm test` 748 đạt (kiểm lại ở bước 3), `tsc`, `lint` sạch.
- **Việc thủ công**: không.

## Bước tiếp theo

Bước 3 — Kiểm với Gemini thật và đóng task.
