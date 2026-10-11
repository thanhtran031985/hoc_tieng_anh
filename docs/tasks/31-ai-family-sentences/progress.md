# Tiến độ — 31-ai-family-sentences — AI gợi ý câu cho đoạn văn vui của Họ vần

Trạng thái chung: 🔄 · Cập nhật lần cuối: 11/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|------|-----|------------|---------|
| 0 | Kế hoạch | ✅ | `plan.md` (chung với task 30) |
| 1 | Luật và schema (không mạng) | ✅ | familySentencesPrompt, cleanFamilySentences, schema; 10 test mới |
| 2 | Server, action và nút | ⬜ | |
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

## Bước tiếp theo

Bước 2 — Server, action và nút.
