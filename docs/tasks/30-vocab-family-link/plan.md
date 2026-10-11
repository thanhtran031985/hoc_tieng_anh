# Kế hoạch — Task 30 `30-vocab-family-link` rồi Task 31 `31-ai-family-sentences`

Người dùng giao toàn quyền ("làm theo ý bạn"), đi vắng; khi xong thì gửi thông báo đẩy (PushNotification). Một kế hoạch cho cả hai task nhỏ liên tiếp; mỗi task có nhánh `feat/NN-slug` tách từ nhánh đang đứng, `plan.md` ghi bản này, commit từng bước, push.

## Task 30 — Ngân hàng từ vựng hiện từ thuộc Họ vần nào, bấm để mở

### Context
Bảng Quản trị › Ngân hàng từ vựng (`VocabView`) chưa cho biết một từ nằm trong Họ vần nào. Người soạn muốn thấy các họ của từ (Cùng âm / Bẫy, Nháp / Xuất bản) và bấm một họ để mở họ đó. Chỉ đọc + chuyển tới, không thêm/bỏ từ khỏi họ ở màn này (mặc định đã ghi ở `task.md`). Không cần migration.

### Nền sẵn có (tái dùng)
- `src/server/admin/vocab.ts` `getVocab()`: đã gộp Khám phá theo từ bằng `groupBy` (mẫu); type `VocabRow` có `explorer`.
- `src/features/admin/VocabView.tsx`: cột `explorerState` (chip `.exp/.expOn/.expDraft` trong `vocab.module.css`), bộ lọc `filters`, `rows` map thêm `explorerState`, `exploring` + `ExplorerDrawer` (mẫu mở ngăn kéo), `WordDrawer` có mục "Khám phá từ".
- `src/features/admin/FamilyDrawer.tsx` (props `familyId`, `onClose`, `onSaved(id)`) — dùng nguyên; `FamiliesView.tsx` là mẫu `router.refresh()` khi lưu.
- Bảng `word_family_members` (`familyId`, `wordId`, `sameSound`), `word_families` (`pattern`, `soundIpa`, `status`); Prisma model `wordFamilyMember` (quan hệ `family`).
- Test thuần: `node --test "src/**/*.test.ts"` (import tương đối `.ts`).

### Thiết kế
- Dữ liệu: một truy vấn `db.wordFamilyMember.findMany({ select: { wordId, sameSound, family: { select: { id, pattern, soundIpa, status } } } })` trong `getVocab()`; `VocabRow.families: WordFamilyRef[]` (`{ familyId, pattern, soundIpa, sameSound, status }`).
- Hàm thuần `groupFamiliesByWord()` + `sortFamilyRefs()` ở `src/lib/rules/admin-vocab.ts` (vần theo bảng chữ cái, họ Cùng âm trước họ Bẫy) kèm test: 0 họ, 1 họ, nhiều họ, vừa Cùng âm vừa Bẫy.
- Cột "Họ vần" (key `familyCount`, sort theo số họ): tối đa 2 chip `-at` (Bẫy có dấu "Bẫy" hoặc viền riêng, họ Nháp mờ như `.expDraft`), thừa thì chip "+n"; không có thì "Chưa có". Mỗi chip là `<button>` có `aria-label="Mở họ vần -at của từ cat"`, `stopPropagation` để không mở ngăn kéo sửa từ. Bộ lọc "Họ vần": Có / Chưa có / Bẫy ở họ khác (chỉ Có / Chưa có).
- Ngăn kéo `WordDrawer`: mục "Họ vần" liệt kê đủ các họ (vần, IPA, Cùng âm/Bẫy, Nháp/Xuất bản) mỗi dòng có nút "Mở họ vần".
- Mở: state `familyOpen: number | null` trong `VocabView`, render `<FamilyDrawer familyId onClose onSaved={() => router.refresh()} />`. Đóng ngăn kéo từ khi mở họ.
- Token: dùng token sẵn (`--success-soft`, `--surface-sunk`, `--ink-soft`, `--warn…` nếu cần); không hex/px.

### Bước
0. Kiểm hiện trạng: đếm từ thuộc 0/1/2+ họ trên DB verify; chốt cách hiện (chip; mặc định ở task.md); ghi `plan.md`, `progress.md`.
1. Dữ liệu + hàm thuần + test (`npm test`, `tsc`, `lint`).
2. Cột, chip, lọc, sắp xếp, mục trong ngăn kéo (Edge không đầu, DB verify, `.tmp-verify/check-30-*.mjs`: từ 0/1/nhiều họ; không cuộn ngang 1366×768 và 1440×900).
3. Bấm chip mở `FamilyDrawer` (chip Nháp và Xuất bản; bàn phím Tab/Enter; xóa từ khỏi họ rồi quay lại thì chip mất).
4. Spec `tests/e2e/30-tu-vung-ho-van.spec.ts` (viết, KHÔNG chạy: `npm run test:e2e:db` làm `migrate reset`, cần người dùng đồng ý riêng — ghi vào `progress.md`), `tsc`, `lint`, `build`, đóng task (README ✅, dashboard, decisions).

## Task 31 — AI gợi ý câu cho Họ vần (chỉ phần câu vui)

### Context
Ở ngăn kéo Họ vần, ô "Đoạn văn vui" người soạn tự gõ câu nên dễ sai. Thêm nút "Gợi ý câu bằng AI" **chỉ cho phần câu**, dựa trên các từ đang có trong họ. Task 29 đã có nút AI cho cả họ (thay toàn bộ); task này là nút riêng, nhẹ, giữ nguyên từ/chữ đầu nhiễu/lời Bông.

### Thiết kế
- `src/lib/schemas/ai-suggest.ts`: `suggestFamilySentencesInputSchema = { pattern, levelId, wordIds: number[1..24] }` + type kết quả `SuggestedFamilySentences { sentences: ExplorerSentence[]; warnings: string[] }`; raw schema `aiFamilySentencesRawSchema`.
- `src/lib/rules/ai-suggest.ts`: `familySentencesPrompt({ pattern, soundIpa, level, members: [{word, ipa, meaningVi, sameSound}] })` (2–3 câu ≤ 12 từ, dùng càng nhiều từ Cùng âm càng tốt, tránh từ Bẫy trừ khi cần, từ đơn giản đúng cấp, kèm bản dịch tự nhiên) + `FAMILY_SENTENCES_RESPONSE_SCHEMA` + `cleanFamilySentences(raw, ctx)`: bỏ câu rỗng/quá dài, cắt `FAMILY_SENTENCES_MAX`, báo câu không chứa từ nào của họ, từ Cùng âm không được dùng, chữ ngoài cấp (`unknownTokens`, `own` = từ của họ), thiếu bản dịch. Test không mạng.
- `src/server/admin/ai-suggest.ts`: `suggestFamilySentences(input, adminId)`: Zod → `isAiAvailable` → `aiThrottle` chung (6 lượt/phút) → server tự nạp từ/IPA/nghĩa từ DB theo `wordIds` (không tin chữ từ client) và `level.number` theo `levelId` → `allowedTokensUpToLevel` → `generateJsonWithRetry` (đã xoay model khi hết hạn mức ngày) → có chữ ngoài cấp thì gọi lại một lần kèm chữ cần tránh (mẫu `suggestExplorer`). Action `suggestFamilySentencesAction` (`requireAdmin()` dòng đầu) ở `ai-suggest-actions.ts`.
- UI `FamilyDrawer.tsx`: nút "Gợi ý câu bằng AI" (icon wand) cạnh "Thêm câu"; cần ít nhất 1 từ Cùng âm (không thì `title` giải thích); đã có câu thì hỏi xác nhận "Thay các câu hiện có?" (`AdultDialog`); điền vào `sentences`, hiện cảnh báo trong khung "AI nhắc bạn xem lại" (tái dùng `aiWarnings`); chưa lưu gì; giọng đọc cũ mất vì chữ đổi (logic `readingValid` sẵn có). Chưa có khóa thì nút xám như nút AI cũ (`data.aiAvailable`).
- Hạn mức Gemini free: mỗi bấm = 1 lượt (retry ngoài cấp thỉnh thoảng 2); đã có xoay model.

### Bước
0. Plan/`plan.md`/proposal ngắn trong `decisions.md`.
1. Rules + schema + test (không mạng).
2. Server + action + nút UI.
3. Kiểm Edge với Gemini thật trên 3 họ (-ous, -ack, -ound): câu chứa từ của họ, chữ ngoài cấp được báo, chưa lưu đến khi bấm Lưu; kiểm chưa-có-khóa và khóa sai; `tsc`, `lint`, `npm test`, `build`; đóng task.

## Kiểm thử chung
`npm test`, `npx tsc --noEmit`, `npm run lint`, `npm run build`; Edge không đầu (server cổng 3100, DB `hoc_tieng_anh_verify`, `AUTH_SECRET=verify-secret-30`, tắt server cổng 3000 trước và BẬT LẠI sau); script kiểm trong `.tmp-verify/` (không commit); dọn dữ liệu thử. Không chạy Playwright (cần đồng ý riêng). Khóa Gemini chỉ ở server.

## Cuối việc
Cập nhật README/progress/decisions + dashboard (0 cảnh báo), commit từng bước, push, `PushNotification` báo xong (một tin sau task 30, một tin sau task 31), cập nhật memory. Nhắc người dùng: tạo lại khóa Gemini; hạn mức miễn phí theo model/ngày.
