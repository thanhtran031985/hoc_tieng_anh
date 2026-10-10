# Tiến độ — 26-word-family — Họ vần, Ghép chữ đầu và liên kết qua lại

Trạng thái chung: 🔄 · Cập nhật lần cuối: 10/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Bảng và seed mẫu | ✅ | Migration word_family, Zod, quy tắc, seed -at và -ir |
| 1 | Họ vần (Screen50) | ✅ | FamilyMap, FamilyPlayer, route /family/[id], dạng bài word_family, Soạn bài học |
| 2 | Ghép chữ đầu (Screen51) | ✅ | BuildBoard, BuildPlayer, build-flow, route /family/[id]/build, dạng bài build_family |
| 3 | Liên kết qua lại (WordLinks, Screen53) | ✅ | WordLabShell, WordLinks, getWordLabEntry; /explore, /family, /family/[id]/build dùng chung khung |
| 4 | Tab Họ vần trong Sổ từ (Screen52) | ✅ | WordZoom 3 tab, familiesOfWords, getFamilyCompactAction |
| 5 | Soạn Họ vần (Adult23) | ✅ | /admin/families: bảng + ngăn kéo FamilyDrawer, saveFamily, generateFamilyAudio |

## Nhật ký

(Claude ghi sau mỗi bước: đã làm gì, kết quả kiểm tra, việc cần làm thủ công.)

### Bước 0 — Bảng và seed mẫu (10/10/2026)
- Migration `20261010115819_word_family`: `word_families` (vần, loại rime/root, IPA, cấp, `build_rime`, `decoys` JSON, `trap_note`, trạng thái) và `word_family_members` (từ, `same_sound`, thứ tự; xóa theo họ và theo từ). Chỉ dùng kiểu có ở cả MariaDB và MySQL 8. Đoạn văn vui của họ dùng `word_readings` (owner_type family) có từ task 25.
- Zod dùng chung `lib/schemas/word-family.ts` (vần a–z, IPA /…/, chữ đầu 1–3 chữ cái, chữ đầu nhiễu, lời giải thích bẫy, mục của khung liên kết). Hằng số `BUILD_MIN_REAL = 2` đặt ngoài `WORDLAB`.
- Quy tắc thuần `lib/rules/word-family.ts`: `splitOnset`, `splitRime`, `soundMatches`, `buildInfo` / `buildTiles` / `checkOnset` / `hintOnset`, `familyIssues` (lỗi lưu và lỗi xuất bản, kèm mã ô), ngăn xếp liên kết (`pushLink` trả null ở bậc thứ 5, `popLink`, `cutTo`).
- Dữ liệu mẫu `-at` (bat, cat, hat, fat, mat, flat, chat, that; bẫy eat, what) và `-ir` (bird, girl, shirt, skirt, first, third; bẫy fire; ghép “irt”) ở `lib/rules/word-family-data.ts`, seed `prisma/seed/word-family.ts` (Nháp, chỉ nạp từ đã có trong kho).
- Kiểm tra: `prisma migrate deploy` trên DB verify (MariaDB) đạt; `db seed` chạy 2 lần vẫn 2 họ, 11 thành viên (at: 5 cùng âm + 2 bẫy, ir: 4 từ), không nhân đôi; `npm test` 660/660 (37 test mới); `tsc` sạch.
- Việc thủ công: `npx prisma migrate deploy` rồi `npx prisma db seed` trên database thật.

### Bước 1 — Họ vần (Screen50) (10/10/2026)
- `components/wordlab/FamilyMap`: vần ở giữa (`rime-hub`, bấm để nghe cả họ), thẻ cùng âm hai bên với phần vần tô `rime-ink` trên `rime-bg`, đường nối `rime-line` (nét đứt với thẻ “Sắp học”), ô Bẫy chính tả (`trap-*`, gạch lượn sóng, lời Bông), chế độ thu gọn cho Sổ từ. ← → đi giữa thẻ (không vòng quanh, `cardNav`).
- `features/word-family/FamilyPlayer` (+ `FamilyView`): Space nghe lần lượt cả họ (vần rồi từng thẻ, thẻ sáng và có dấu “đã nghe”), bấm thẻ nghe từ (thẻ “Sắp học” vẫn nghe được), bấm từ bẫy nghe từ bẫy, “Đọc cả đoạn” câu vui dùng `ReadAloudParagraph` của task 25. Trong bài: nghe đủ các từ đã học rồi Tiếp tục, H chỉ thẻ chưa nghe; không tạo mục chấm (không phạt, không ghi `answer_logs`).
- Server `server/word-family.ts`: `loadFamilies` (họ đã xuất bản, đánh dấu từ đã học = có thẻ ôn tập hoặc là từ của bài, từ có Khám phá, từ ghép được), `getFamilyView` (qua `requireLearner`; họ Nháp là 404). `glossaryFor` và `audioOfWords` của task 25 được export dùng chung.
- Route `/family/[familyId]` (+ `loading`, `error`); tham số `from=notebook&word=` đưa bé về Sổ từ khi đóng (tab Họ vần ở bước 4).
- Dạng bài `word_family` (config `{familyId}`): `ACTIVITY_TYPES`, `PlayStep`, `buildPlaySteps` (bỏ qua bước khi họ chưa xuất bản hoặc bé chưa học từ nào của họ), `getLessonPlay`, `StepView` + `FamilyStep`. Soạn bài học: tab “Họ vần” trong cột gợi ý để thêm bước, “Xem như học sinh” dựng được bước, lưu bài kiểm `familyId` có thật và (khi xuất bản bài) họ đã xuất bản.
- Thêm icon `family` và `blocks` (chép từ `bundle.js`) vào `icon-paths.ts`; không thiếu token nào. `/dev/wordlab` có thêm mục thử Họ vần -at.
- Nút “Ghép” và “Khám phá” trên thẻ chỉ hiện khi có nơi để đi (bước 2 và 3 nối vào).
- Kiểm tra bằng Edge không đầu (`.tmp-verify/check-26-family.mjs`, 37 mục đạt): họ Nháp là 404; 5 thẻ, 2 thẻ “Sắp học”, vần tô màu, bẫy eat/what gạch lượn sóng kèm lời giải thích, 5 đường nối; không cuộn ở 1366×768, 1440×900, 1920×1080; ← → không vòng quanh; Space nghe cả họ (5 thẻ có dấu nghe); Esc về Sổ từ; trong bài: Tiếp tục khóa tới khi nghe đủ 3 từ đã học, H gợi ý thẻ chưa nghe, Enter khi đủ thì sang bước kế, không ghi `answer_logs`; đoạn văn không bị chân bài che. `npm test` 662/662 (39 test họ vần), `tsc` và `lint` sạch.
- Việc thủ công: không có thêm (xuất bản họ ở bước 5).

### Bước 2 — Ghép chữ đầu (Screen51) (10/10/2026)
- Luồng thuần `lib/rules/build-flow.ts` (+ 20 test): đặt chữ, kiểm (từ thật / đã tìm / không có thật), trả ô về trống, gợi ý, gõ cụm “sh” (`typeOnset`, `flushPending`), từ cần ghép đầu tiên.
- `components/wordlab/BuildBoard`: hàng ô chữ (`letter-tile`), ô trống nét đứt + vần cố định (`rime-bg`), ô kết quả (xanh khi đúng, cam nhẹ `fake-word-bg` khi không có thật, khung “Từ cần ghép đầu tiên”), thanh “Đã tìm được” (`found-chip`).
- `features/word-family/BuildPlayer` (+ `BuildView`): bấm hoặc kéo chữ vào ô trống (kéo theo con trỏ, thả ngoài ô thì không đặt), gõ chữ (f rồi l thành “fl”), Enter kiểm tra (tự khám phá thì tự kiểm sau 0,45 giây), Backspace/Delete xóa ô, ? gợi ý, Space nghe vần. Từ không có thật chỉ nhắc nhẹ, không trừ điểm.
- Route `/family/[familyId]/build?first=<mã từ>` (+ loading, error) mở từ nút “Ghép” trên thẻ ở Họ vần; “Về họ vần” và Esc. Họ Nháp hoặc ít hơn 2 từ ghép được là 404.
- Dạng bài `build_family` (config `{familyId}`): schema, `PlayStep` (kèm hàng chữ đã xáo theo hạt giống bài), `StepView`/`BuildStep`. Tìm đủ mục tiêu thì có bảng kết thúc 3 sao (không xu: xem decisions.md). Soạn bài học: tab Họ vần có hai nút “Họ vần” và “Ghép chữ đầu” cho mỗi họ.
- Kiểm tra bằng Edge không đầu (`.tmp-verify/check-26-build.mjs`, 61 mục đạt): 7 ô chữ (5 thật + z, v); bấm, gõ, gõ cụm fl, kéo thả; từ thật vào Đã tìm được; zat ô cam nhẹ kèm lời Bông; chữ đã tìm báo lại; Backspace xóa; q nhắc nhẹ; tự khám phá không có bảng kết thúc; mở từ thẻ hat có khung “Từ cần ghép đầu tiên” và chữ h viền sáng; Về họ vần; họ Nháp 404; trong bài: Kiểm tra khóa khi ô trống, ? gợi ý, h là chữ (không phải gợi ý), f không bật học tập trung, bảng kết thúc “Cậu ghép đủ 5 từ rồi!”, không ghi `answer_logs`; không cuộn ở 1366×768, 1440×900, 1920×1080. `npm test` 682/682, `tsc` và `lint` sạch.
- Việc thủ công: không có thêm.

### Bước 3 — Liên kết qua lại (WordLinks, Screen53) (10/10/2026)
- `components/wordlab/WordLinks` (+ `WordLinkButton`, `WordLinksTip`): dải liên kết (`links-bg`), nút Quay lại (⌫), đường dẫn bấm được tối đa 4 bậc (`crumb-*`), nút đi tiếp theo ngữ cảnh.
- `features/word-family/WordLabShell`: giữ đường dẫn ở trình duyệt (`pushLink` / `popLink` / `cutTo` của bước 0). Mọi bậc vẫn nằm trong trang (bậc không ở đỉnh bị `hidden`) nên Quay lại về đúng bậc trước với nguyên trạng thái (nhánh đã mở, thẻ đã nghe, từ đã ghép). Đi tới đúng mục đã có thì cắt về mục đó (không chồng). Bậc mới nạp bằng server action `getWordLabEntryAction` → `server/word-lab.getWordLabEntry` (qua `requireLearner`, chỉ nội dung đã xuất bản, Zod `wordLabEntryInputSchema`). Backspace = Quay lại (ở Ghép chữ: xóa chữ trong ô, ô trống thì Quay lại), Esc / Đóng thoát cả lượt về Sổ từ.
- Nút đi tiếp: Khám phá từ → “Họ vần của bird: -ir” (`familyOfWord`); Họ vần → nút “Ghép” và “Khám phá” trên thẻ; Ghép chữ → “Về họ vần -ir” và bấm từ trong “Đã tìm được” để mở Khám phá của từ. Hết 4 bậc: các nút dẫn tới mục mới bị khóa kèm dòng “Đã đủ 4 bậc. Bấm Quay lại để đi tiếp.”; nút dẫn tới mục đã ở trong đường dẫn vẫn dùng được (cắt về).
- Ba route (`/explore/[wordId]`, `/family/[familyId]`, `/family/[familyId]/build`) đều dựng `WordLabShell` với bậc đầu; `ExploreView` được thay bằng khung này. `ExplorerPlayer` có thêm `embedded`; `FamilyPlayer` / `BuildPlayer` / `BuildBoard` có `isLocked` / `isFoundLocked`.
- Kiểm tra bằng Edge không đầu (`.tmp-verify/check-26-journey.mjs`, 43 mục đạt): đi đúng lượt bird → họ -ir → Ghép chữ → shirt → Khám phá shirt (đường dẫn dài dần tới 4 bậc), Quay lại từng bậc bằng Backspace với trạng thái còn nguyên (nhánh 2 của bird vẫn mở, thẻ bird vẫn đã nghe, Đã tìm được vẫn 1/2), bấm đường dẫn về thẳng bậc 1, Khám phá bird khi bird đã ở bậc 1 thì cắt về, Esc về Sổ từ; bậc thứ 5 (Họ vần của bird: -at, bird tạm thêm vào họ -at) bị khóa kèm lời giải thích, bấm không đổi đường dẫn, Quay lại một bậc thì hết khóa; không cuộn ở 1366×768. Kiểm lại hồi quy: `check-26-family`, `check-26-build` (cập nhật cho khung mới), `check-25-explorer`, `check-25-notebook` đều đạt. `npm test` 682/682, `tsc` và `lint` sạch.
- Việc thủ công: không có thêm.

### Bước 4 — Tab Họ vần trong Sổ từ (Screen52) (10/10/2026)
- `NotebookWord.familyId` (họ đã xuất bản mà từ thuộc về, `familiesOfWords` tra một lần cho cả sổ). `WordZoom` có 3 tab Thẻ từ · Khám phá · Họ vần (`role=tablist`, ← → đổi tab và vòng quanh); tab chưa có dữ liệu thì ẩn kèm một dòng giải thích gộp (“chưa có Khám phá”, “chưa có Họ vần” hoặc “chưa có Khám phá và Họ vần nên chỉ có Thẻ từ”). `?word=ID&tab=family` mở sẵn tab Họ vần.
- Tab Họ vần nạp họ thu gọn bằng `getFamilyCompactAction` (qua `getFamilyView`, Zod `familyIdInputSchema`; các từ cùng họ dùng chung một lần nạp): `FamilyPlayer compact` (thẻ nhỏ, từ đang xem tô sáng, ô Bẫy, không có Đọc cả đoạn), nút “Ghép” mở `/family/[id]/build?first=…&from=notebook&word=…`, “Khám phá” mở `/explore/[wordId]?from=notebook`, “Mở Họ vần đầy đủ” mở `/family/[id]?from=notebook&word=…`; Đóng / Esc ở các màn đó về đúng thẻ ở tab Họ vần.
- Kiểm tra bằng Edge không đầu (`.tmp-verify/check-26-notebook.mjs`, 35 mục đạt): bird đủ 3 tab, họ -ir 4 thẻ, bird được tô sáng, hộp thoại nằm gọn ở 1366×768 và trang không cuộn; ← → vòng quanh 3 tab; Tab 30 lần không ra khỏi hộp thoại; Ghép → màn Ghép chữ đầy đủ với “Từ cần ghép đầu tiên”, Esc về đúng thẻ bird ở tab Họ vần; Mở Họ vần đầy đủ → Esc về thẻ; cat chỉ có Thẻ từ + Họ vần kèm dòng giải thích, ← → ngoài dải tab sang từ khác và về tab Thẻ từ; “time” chỉ có Thẻ từ; họ -ir Nháp thì bird mất tab Họ vần. `npm test` 682/682, `tsc` và `lint` sạch.
- Việc thủ công: không có thêm.

### Bước 5 — Soạn Họ vần (Adult23) (10/10/2026)
- Menu quản trị có mục “Họ vần” (nhãn “Mới”) ngay sau “Ngân hàng từ vựng”; trang `/admin/families` (+ loading, error) dùng `requireAdmin()`. Bảng `FamiliesView`: vần tô `rime`, âm IPA, cấp, số từ (cùng âm · bẫy), trạng thái; tìm, lọc Cấp / Trạng thái, sắp xếp, chia trang; “Thêm họ vần”.
- `FamilyDrawer` (ngăn kéo rộng, họ mới hoặc đã có): vần, âm IPA, cấp, vần để ghép; danh sách từ của họ (chọn “Cùng âm” hoặc “Bẫy: khác âm”, từ Bẫy viền nét đứt `trap-line` và chữ vần gạch lượn sóng); “Gợi ý từ trong kho” (từ có chứa vần, lọc theo chữ, tick để thêm, từ khác âm gắn “khác âm?” và tự thành Bẫy); Ghép chữ đầu (chữ đầu của từ thật tự tính, chữ đầu nhiễu thêm/bỏ, trùng từ thật thì báo lỗi); lời Bông cho ô Bẫy; đoạn văn vui (tối đa 4 câu Anh + Việt, “Tạo giọng đọc tự động”); Nháp / Xuất bản; “Xem như học sinh” (Họ vần và Ghép chữ đầu bằng giao diện bé). Cảnh báo bấm được, nhảy tới đúng ô; lỗi dưới ô khi rời ô và khi bấm Lưu; lỗi của lần Lưu tự mất khi sửa.
- Server `server/admin/family.ts`: `getFamilyList`, `getFamilyEditor`, `searchBankWords`, `saveFamily` (Zod `saveFamilySchema`; lỗi dữ liệu chặn cả Nháp, `familyIssues` chặn xuất bản; trùng vần + âm báo lỗi; đổi chữ đoạn văn thì bỏ giọng đọc cũ), `generateFamilyAudio` (dùng lại `synthesizeMp3`, tệp loại “explorer” theo mã đoạn văn). Server action `family-actions.ts` gọi `requireAdmin()` ở dòng đầu.
- Kiểm tra bằng Edge không đầu: `check-26-editor.mjs` (50 mục đạt: bảng, tìm, 7 từ/2 Bẫy, báo lỗi vần có ký tự lạ, IPA thiếu /…/, chữ đầu nhiễu trùng từ thật và 4 chữ cái, chặn xuất bản kèm lý do, bấm cảnh báo nhảy tới ô, còn 2 từ cùng âm báo thiếu, gợi ý từ kèm “khác âm?” tự thành Bẫy, tạo họ mới -ake, lưu Nháp, tạo giọng đọc thật ra mp3, Xem như học sinh, xuất bản, bé mở được họ đã xuất bản và Nháp thì 404, họ mẫu -at không bị đổi); `check-26-builder.mjs` (11 mục đạt: tab Họ vần chỉ có họ đã xuất bản, thêm hai bước, lưu đúng `config.familyId`, xem trước, xuất bản bài bị chặn khi họ còn Nháp). `npm test` 682/682, `tsc` và `lint` sạch.
- Việc thủ công: vào Quản trị › Họ vần xuất bản “-at” và “-ir” (bổ sung từ còn thiếu như mat, chat, that ở task 27 và bấm Tạo giọng đọc).

## Bước tiếp theo

Đóng task: spec Playwright, tsc/lint/test/build, README ✅.
