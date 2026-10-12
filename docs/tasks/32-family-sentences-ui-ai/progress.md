# Tiến độ — 32-family-sentences-ui-ai

Trạng thái chung: ✅ · Cập nhật lần cuối: 12/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|------|-----|------------|---------|
| 0 | Kế hoạch chi tiết | ✅ | Đã được duyệt |
| 1 | Sửa layout hàng câu của Đoạn văn vui | ✅ | Grid 4 cột thẳng hàng, nút [x] không bị rớt dòng |
| 2 | Mở rộng schema, prompt và logic gợi ý số câu AI | ✅ | 1–10 câu, 1–10 từ/câu, prompt chuẩn cấp học & rõ nghĩa |
| 3 | Tích hợp UI ô nhập số câu và kiểm tra toàn diện | ✅ | Input số câu (1–10), sync mặc định số từ cùng họ |

## Nhật ký

### Bước 0 — Kế hoạch chi tiết (12/10/2026)
- Đã làm: Khởi tạo task 32, phân tích nguyên nhân lỗi layout grid 3 cột, lập giải pháp mở rộng input số câu gợi ý AI (1–10 câu, 1–10 từ/câu, chất lượng câu rõ nghĩa, đúng cấp học) và ghi vào `plan.md`. Người dùng đã duyệt kế hoạch.
- File tạo/sửa: `docs/tasks/32-family-sentences-ui-ai/*`, `docs/tasks/README.md`.
- Kết quả kiểm tra: Dashboard chuẩn, kế hoạch hoàn chỉnh.

### Bước 1 — Sửa layout hàng câu của Đoạn văn vui (12/10/2026)
- Đã làm: Thêm quy tắc CSS grid 4 cột `.sents li:has(button)` và `.sentsFamily li` (`var(--space-6) 1fr 1fr var(--adm-control)`) trong `explorer-editor.module.css`. Cập nhật `FamilyDrawer.tsx` áp dụng `editor.sentsFamily`.
- File tạo/sửa: `src/features/admin/explorer-editor.module.css`, `src/features/admin/FamilyDrawer.tsx`.
- Kết quả kiểm tra: Hàng câu chuyển sang 4 cột thẳng hàng, nút xóa `[x]` nằm bên phải ô tiếng Việt, không bị rơi xuống dòng dưới. `npx tsc --noEmit` và `eslint` 0 lỗi.

### Bước 2 — Mở rộng schema, prompt và logic gợi ý số câu AI (12/10/2026)
- Đã làm: Nâng `FAMILY_SENTENCES_MAX = 10` trong `src/lib/schemas/word-family.ts`. Chỉnh `AI_SENTENCE_WORDS_MAX = 10` trong `src/lib/rules/ai-suggest.ts`. Cập nhật `suggestFamilySentencesInputSchema` hỗ trợ `count` (1–10, mặc định 3). Nâng cấp `familySentencesPrompt` để viết chính xác `${targetCount}` câu ngắn (1–10 từ/câu), yêu cầu câu rõ nghĩa, ngữ cảnh thực tế logic, cấu trúc ngữ pháp đúng trình độ học sinh lớp 1–5 (`level`), bản dịch tiếng Việt tự nhiên chuẩn xác. Cập nhật `cleanFamilySentences` cắt theo `count`. Bổ sung unit test trong `src/lib/rules/ai-suggest.test.ts`.
- File tạo/sửa: `src/lib/schemas/word-family.ts`, `src/lib/schemas/ai-suggest.ts`, `src/lib/rules/ai-suggest.ts`, `src/lib/rules/ai-suggest.test.ts`, `src/server/admin/ai-suggest.ts`.
- Kết quả kiểm tra: `npm test` 751/751 passed, `npx tsc --noEmit` 0 lỗi, `eslint` 0 lỗi.

### Bước 3 — Tích hợp UI ô nhập số câu và kiểm tra toàn diện (12/10/2026)
- Đã làm: Thêm style `.aiCountLabel` và `.aiCountInput` vào `families.module.css`. Tích hợp ô input số câu (1–10) đặt trước nút "Gợi ý câu bằng AI" trong `FamilyDrawer.tsx`, tự động mặc định theo số từ cùng họ `same.length` (nếu người dùng chưa chỉnh tay). Truyền `count: aiCount` vào server action.
- Sửa lỗi phát hiện khi người dùng test thực tế:
  + Khi AI gợi ý > 6 câu (ví dụ 7 câu), lưu thành công nhưng nạp lại biến mất do `getFamilyEditor` và `word-family.ts` gọi nhầm `parseExplorerSentences` (schema Khám phá từ chỉ cho tối đa 6 câu). Đã bổ sung `parseFamilySentences` (hỗ trợ tối đa 10 câu) vào `src/lib/schemas/word-family.ts` và thay thế toàn bộ ở server họ vần.
  + Thêm `white-space: nowrap;` và `flex-shrink: 0;` cho `.aiCountLabel` để nhãn `Số câu:` không bao giờ bị rớt dòng thành 2 hàng.
  + Bổ sung unit test cho `parseFamilySentences` (hỗ trợ 1–10 câu) trong `src/lib/rules/word-family.test.ts`.
- File tạo/sửa: `src/features/admin/families.module.css`, `src/features/admin/FamilyDrawer.tsx`, `src/lib/schemas/word-family.ts`, `src/server/admin/family.ts`, `src/server/word-family.ts`, `src/lib/rules/word-family.test.ts`.
- Kết quả kiểm tra: `npx tsc --noEmit` 0 lỗi, `npm run lint` 0 lỗi, `npm test` (752 tests) 100% pass, `npm run build` thành công.

## Trạng thái chung
Task 32 đã hoàn thành toàn bộ các bước và vượt qua mọi bài kiểm tra.
