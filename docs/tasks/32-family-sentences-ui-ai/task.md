# 32-family-sentences-ui-ai — Sửa layout đoạn văn Họ vần và tùy chọn số câu gợi ý AI

Ngày tạo: 12/10/2026 · Giai đoạn: GĐ2 · Phụ thuộc: 26, 31 · Nhánh: `feat/32-family-sentences-ui-ai`

> Yêu cầu ngày 12/10/2026: “chỉnh sửa page http://localhost:3000/admin/families chỉ sửa layout của phần đoạn văn. ngoài ra chỗ code gợi ý câu bằng AI tôi muốn thêm cho user muốn AI gợi ý bao nhiêu câu ( textbox để user có thể thay đổi và mặt định số câu hỏi là số từ cùng họ), hãy gi vào plan để tôi duyệt trước khi bắt đầu”.

## Mục tiêu
1. Sửa lỗi layout của hàng câu trong mục Đoạn văn vui “Đọc cả đoạn” ở ngăn kéo Soạn họ vần (`FamilyDrawer.tsx` trên `/admin/families`): Nút bỏ câu `[x]` không bị rớt dòng xuống dưới số thứ tự, các cột căn thẳng hàng, cân đối.
2. Nâng giới hạn tối đa số câu của đoạn văn lên 10 câu (`FAMILY_SENTENCES_MAX = 10`). Thêm ô nhập (textbox/number input) cho phép người soạn tùy chỉnh số lượng câu muốn AI gợi ý (từ 1–10 câu), giá trị mặc định là số lượng từ cùng họ (`same.length`).
3. Cập nhật prompt và bộ lọc AI: yêu cầu AI tạo đúng số lượng câu (1–10 câu, mỗi câu 1–10 từ), câu rõ nghĩa, logic, phù hợp tuyệt đối với trình độ của cấp học (không dùng từ hay cấu trúc quá khó).

## Thiết kế
- `designs/components/Adult23-WordFamilies` (Adult23: Soạn Họ vần)

## Quyết định kiến trúc
- **Layout đoạn văn:** Trong `explorer-editor.module.css`, quy tắc `.sents li` hiện chỉ có 3 cột (`var(--space-6) 1fr 1fr`) khiến phần tử thứ 4 (nút xóa `AdultIconButton`) bị đẩy xuống hàng thứ hai. Cần đổi sang 4 cột: `var(--space-6) 1fr 1fr var(--adm-control)` với `align-items: center` để hàng câu luôn thẳng tắp.
- **Tùy chọn số câu gợi ý & Nâng giới hạn:**
  - Nâng `FAMILY_SENTENCES_MAX = 10` trong `src/lib/schemas/word-family.ts`.
  - UI: Thêm ô input số nguyên nhỏ gọn (ví dụ label `Số câu:`, min 1, max 10) đặt cạnh nút “Gợi ý câu bằng AI”.
  - Mặc định: Lấy theo số từ cùng họ hiện có `same.length` (kẹp trong khoảng 1–10, fallback là 3 nếu chưa có từ). Khi người dùng thay đổi danh sách từ, nếu chưa sửa tay ô số câu thì có thể cập nhật tương ứng.
  - Schema & Server: `suggestFamilySentencesInputSchema` thêm `count: z.number().int().min(1).max(FAMILY_SENTENCES_MAX).default(3)`.
  - Prompt: `familySentencesPrompt` nhận `count`, chỉ thị viết đúng số câu yêu cầu (mỗi câu 1–10 từ), phù hợp với cấp độ học sinh lớp 1–5 (`level`), câu rõ nghĩa, logic và tự nhiên; bản dịch tiếng Việt rõ ràng.
  - Filter: `cleanFamilySentences` cắt tối đa theo `count`.

## Các bước
### Bước 0 — Kế hoạch
Ghi `plan.md`, người dùng duyệt trước khi bắt đầu thực hiện.
**Kiểm tra:** `plan.md` có đầy đủ các bước và giải pháp chi tiết.

### Bước 1 — Sửa layout hàng câu của Đoạn văn vui
Sửa CSS grid cho danh sách câu trong `explorer-editor.module.css`, đảm bảo 4 cột thẳng hàng (số thứ tự, câu tiếng Anh, dịch tiếng Việt, nút xóa), không bị vỡ layout ở mọi độ rộng màn hình.
**Kiểm tra:** Nút [x] nằm ngang hàng bên phải ô tiếng Việt, không bị rớt dòng.

### Bước 2 — Mở rộng schema, prompt và logic gợi ý số câu AI
Cập nhật `suggestFamilySentencesInputSchema`, `familySentencesPrompt`, `cleanFamilySentences`, và hàm server `suggestFamilySentences` để nhận và xử lý tham số `count`. Viết/cập nhật unit test.
**Kiểm tra:** `npm test`, `npx tsc --noEmit`, `npm run lint` sạch.

### Bước 3 — Tích hợp ô nhập số câu vào UI và kiểm tra toàn diện
Thêm ô input số câu vào `FamilyDrawer.tsx` với giá trị mặc định là số từ cùng họ; truyền `count` vào `suggestFamilySentencesAction`; kiểm tra hành vi thực tế trên trình duyệt.
**Kiểm tra:** Nhập số câu khác nhau (1, 2, 3, 4) và bấm gợi ý, AI trả về đúng số câu mong muốn; `tsc`, `lint`, `test`, `build` không lỗi.

## Phạm vi
- Được tạo/sửa: `src/features/admin/explorer-editor.module.css`, `src/features/admin/FamilyDrawer.tsx`, `src/lib/schemas/ai-suggest.ts`, `src/lib/rules/ai-suggest.ts`, `src/server/admin/ai-suggest.ts`, unit test liên quan, tài liệu task.
- KHÔNG làm trong task này: Không sửa layout các phần khác ngoài đoạn văn; không đổi logic lưu họ vần hay tạo âm thanh.

## Tiêu chí hoàn thành
- Giao diện hàng câu hiển thị chuẩn 4 cột, nút xóa nằm ngay ngắn bên phải, không bị rớt dòng.
- Có ô nhập số câu AI gợi ý, mặc định bằng số từ cùng họ.
- Bấm “Gợi ý câu bằng AI” tạo đúng số câu người dùng đã chọn.
- `npx tsc --noEmit`, `npm run lint`, `npm test` đều không lỗi.
