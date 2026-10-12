# Quyết định — 32-family-sentences-ui-ai

### 12/10/2026 — Khởi tạo task 32
- Bối cảnh: Người dùng phản hồi layout hàng câu ở Đoạn văn vui trên `/admin/families` bị lỗi nút xóa `[x]` rớt xuống hàng thứ hai. Đồng thời người dùng muốn có ô nhập để chỉ định số câu muốn AI gợi ý (mặc định bằng số từ cùng họ), nâng giới hạn từ 4 lên 10 câu, mỗi câu 1–10 từ, yêu cầu câu AI đề xuất phải rõ nghĩa, logic và đúng trình độ cấp học.
- Quyết định: 
  1. Đổi CSS grid của `.sents li` sang 4 cột `var(--space-6) 1fr 1fr var(--adm-control)` trong `explorer-editor.module.css`.
  2. Nâng `FAMILY_SENTENCES_MAX = 10` trong `src/lib/schemas/word-family.ts`.
  3. Đặt `AI_SENTENCE_WORDS_MAX = 10` trong `src/lib/rules/ai-suggest.ts`. Thêm trường `count` (1–10, mặc định 3) vào `suggestFamilySentencesInputSchema`.
  4. Cải tiến prompt Gemini: chỉ thị viết đúng `${targetCount}` câu ngắn (1–10 từ), ngữ pháp phù hợp cấp học lớp 1–5 (`level`), câu có ngữ cảnh thực tế rõ nghĩa (không nhồi vần vô nghĩa), bản dịch tiếng Việt tự nhiên chuẩn xác.
  5. Thêm ô input số câu (1–10) vào `FamilyDrawer.tsx`, tự động mặc định theo số từ cùng họ `same.length` (nếu người dùng chưa chỉnh tay).
- Lý do: Khắc phục triệt để lỗi hiển thị rớt dòng mà không phá vỡ cấu trúc chung; tăng tính linh hoạt và chủ động cho người soạn nội dung khi tạo câu với AI.
- Ảnh hưởng: `FamilyDrawer.tsx`, `explorer-editor.module.css`, `families.module.css`, các hàm schema/prompt/action liên quan đến gợi ý câu.

### 12/10/2026 — Sửa lỗi không hiển thị câu sau khi lưu và nhãn Số câu bị ngắt dòng
- Bối cảnh: Khi người dùng gợi ý câu bằng AI với số câu > 6 (ví dụ 7 câu như trong ảnh), dữ liệu hiển thị trên page nhưng sau khi bấm “Lưu thay đổi”, ngăn kéo nạp lại thì đoạn văn hiển thị `0/10 câu` và các câu biến mất. Đồng thời nhãn `Số câu:` bị ngắt thành 2 hàng `Số` và `câu:`.
- Nguyên nhân:
  1. Khi nạp lại dữ liệu trong `getFamilyEditor`, hệ thống dùng hàm `parseExplorerSentences` (vốn dùng schema Khám phá từ có giới hạn `EXPLORER_SENTENCES_MAX = 6`). Khi số câu là 7–10, `parseExplorerSentences` safeParse bị fail và trả về `null` -> fallback thành mảng rỗng `[]`. Tương tự ở `src/server/word-family.ts` và `generateFamilyAudio`.
  2. CSS `.aiCountLabel` thiếu `white-space: nowrap;` và `flex-shrink: 0;` khiến chữ bị ngắt dòng trong flex header.
- Quyết định:
  1. Thêm `parseFamilySentences` vào `src/lib/schemas/word-family.ts` dùng `familySentencesSchema` (hỗ trợ tối đa 10 câu).
  2. Thay `parseExplorerSentences` bằng `parseFamilySentences` trong `src/server/admin/family.ts` và `src/server/word-family.ts`.
  3. Thêm `white-space: nowrap;` và `flex-shrink: 0;` cho `.aiCountLabel` trong `src/features/admin/families.module.css`.
  4. Bổ sung unit test cho `parseFamilySentences` (hỗ trợ 1–10 câu) trong `src/lib/rules/word-family.test.ts`.
- Kết quả: Dữ liệu câu lưu bền vững và hiển thị chính xác sau khi lưu; nhãn hiển thị thẳng đẹp trên một dòng.
