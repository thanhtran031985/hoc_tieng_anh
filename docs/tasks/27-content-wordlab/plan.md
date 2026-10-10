# Kế hoạch — Task 27 `27-content-wordlab` (nhánh `feat/27-content-wordlab`, tách từ `feat/26-word-family`)

## Context
Task 25–26 đã có máy Khám phá từ và Họ vần nhưng mới có 2 từ mẫu (bird, cat) và 2 họ mẫu (-at, -ir), tất cả Nháp. Task này soạn **nội dung thật**: ~120 danh từ cụ thể cấp 1–4 có Khám phá, ~30 họ vần có đoạn văn vui, kèm hình, bản dịch, mp3. Mọi mục để **Nháp**; người dùng duyệt rồi tự xuất bản. Người dùng đã ủy quyền toàn bộ (task.md chỉ có một điểm dừng thật: **Bước 0 chờ duyệt danh sách và mẫu**; các bước sau tự chạy tới hết, ghi decisions.md).

## Nền sẵn có (tái dùng)
- Kiểu và hàm trợ giúp dữ liệu: `src/lib/rules/word-explorer-data.ts` (`ExplorerSeedWord`, `ans`, `dis`, `sent`), `src/lib/rules/word-family-data.ts` (`FamilySeedEntry`); seed `prisma/seed/word-explorer.ts`, `word-family.ts` (idempotent, bỏ qua từ/họ đã có, không ghi đè phần đã sửa, bỏ từ chưa có trong kho). Test hiện tìm "bird", "cat", "-at" trong seed → giữ nguyên các mẫu này.
- Luật xuất bản: `explorerIssues` (4–6 nhánh, đáp án có hình + âm thanh, mỗi nhánh 1–2 hình nhiễu có hình, đoạn văn đủ câu/dịch/âm thanh), `familyIssues` (≥ 3 từ cùng âm, chữ đầu nhiễu…). Adult22 / Adult23 hiện cảnh báo theo đúng các luật này nên "không còn cảnh báo" = đủ hình + mp3.
- Hình: `scripts/pictures/lib.mjs` (khối vẽ 120×120) + `gen-pictures.mjs` (xóa-ghi lại, loại trừ `EXPLORER_PICTURES`), `check-pictures.mjs`. 687 hình hiện có; danh từ có hình: cấp 1 112/112, cấp 2 129/142, cấp 3 142/183, cấp 4 153/190.
- Vốn từ: `src/lib/rules/vocab-check.ts` (`allowedTokensFor`, `unknownTokens`) + `prisma/seed/content-extra/allowed-extra.json`, mẫu cho script kiểm `scripts/check-content-extra.mjs`.
- Giọng đọc: `generateExplorerAudio` (`server/admin/word-explorer.ts`, id nhánh + 0 cho đoạn văn), `generateFamilyAudio` (`server/admin/family.ts`), CLI `scripts/audio-generate.mjs` (`--content` làm mẫu), Kokoro chạy trên máy này.

## Quyết định
- **Nơi đặt dữ liệu**: `src/lib/rules/wordlab-data/explorer-level-0N.ts` (một tệp một cấp) và `families.ts`; `EXPLORER_SEED` / `FAMILY_SEED` thành mảng gộp (mẫu bird/cat/-at/-ir giữ nguyên ở tệp cũ). Kiểu `readonly` + helper `ans/dis/sent` dùng chung; giữ cách import tương đối `.ts`.
- **Từ cho họ vần ngoài kho**: kho chỉ có từ của khung chương trình nên thiếu hẳn mat, rat, sat, chat, that, first, third, dirt… Thêm `prisma/seed/wordlab/family-words.json` (từ, IPA, loại từ, nghĩa, câu ví dụ, cấp) nạp bởi `seedWordLabWords` **vào kho từ, không gắn chủ đề/bài học** (tìm theo từ + cấp, không nhân đôi, không đụng từ đã có). Nhờ vậy họ hiện từ đó là "Sắp học" cho tới khi bé gặp từ. Seed gọi trước `seedWordFamilies`.
- **Vốn từ** (cần người dùng duyệt ở Bước 0): câu hỏi tiếng Anh và từ chức năng chỉ dùng từ của cấp bé trở xuống (cùng luật `vocab-check`). Đáp án/đoạn văn thì thường có từ mới (seeds, wings, whiskers… ngay ở mẫu bird) vì đó là cái bé khám phá bằng hình: cho phép nhưng mỗi từ mới phải nằm trong `prisma/seed/wordlab/allowed-wordlab.json` (từ, cấp, lý do) và có hình + nghĩa tiếng Việt; script in danh sách để người dùng xem. Từ ngoài cấp không có trong danh sách = lỗi.
- **Hình**: đáp án/hình nhiễu dùng lại hình từ vựng đã có (danh từ, màu, động từ); hình còn thiếu vẽ SVG cùng phong cách task 05 trong `scripts/pictures/wordlab-NN.mjs` (cấp 3–4 trước, cấp 1–2 sau), `gen-pictures.mjs` nạp thêm nhóm này (không bị xóa), `check-pictures.mjs` không coi là mồ côi. Họ vần: từ mới thêm có hình nếu là vật cụ thể (mat, rat…), còn lại không bắt buộc.
- **Số hình cần vẽ** chốt ở Bước 0 bằng script (đếm khóa hình dùng mà chưa có tệp); ước tính ban đầu vài trăm hình, người dùng có thể xin giảm số nhánh/đáp án khi duyệt.
- **mp3**: thêm `--wordlab` vào `audio-generate.mjs` (+ `audio-cli.ts`, có test): với mọi `word_questions`/`word_readings` Nháp chưa có tệp, gọi `generateExplorerAudio` / `generateFamilyAudio`; chạy lại không làm lại chỗ đã có. Tôi chạy trên máy này để kiểm "không còn cảnh báo"; người dùng chạy lại trên DB thật (lệnh ghi vào progress).
- **Script kiểm** `scripts/check-wordlab.mjs` (`npm run wordlab:check`): Zod từng nhánh/đáp án; 4–6 nhánh; đoạn văn đúng 1 câu/nhánh, có dịch; mọi `image` tồn tại trên đĩa; từ ngoài cấp (theo luật Vốn từ); họ: ≥ 3 từ cùng âm, mọi từ có trong kho hoặc `family-words.json`, mỗi từ chứa vần, chữ đầu nhiễu không trùng; Ghép chữ ≥ 5 từ thật (`BUILD_MIN_REAL`/`WORDLAB.buildGoal`) hoặc in rõ họ ít hơn; thống kê số hình cần vẽ.
- **Trạng thái**: mọi mục `draft`; không tự xuất bản. Nội dung và `word_questions` đã có (do người dùng sửa) thì seed bỏ qua, không ghi đè.

## Các bước
**Bước 0 — Danh sách và mẫu (DỪNG chờ người dùng duyệt).** Viết `docs/tasks/27-content-wordlab/proposal.md`: danh sách ~120 từ theo cấp (loại câu hỏi từng từ), danh sách ~30 họ (vần, IPA, từ cùng âm, bẫy, từ phải thêm vào kho), quy tắc vốn từ, số hình cần vẽ (từ script). Viết **thật đầy đủ** 5 từ mẫu (đủ nhánh, đáp án + hình, hình nhiễu, đoạn văn, dịch) và 3 họ mẫu (bẫy, chữ đầu nhiễu, câu vui) vào các tệp dữ liệu cuối cùng, cộng script `check-wordlab.mjs` chạy sạch trên mẫu. Kiểm: `npm test`, `check-wordlab` sạch. progress → dashboard → commit → **DỪNG** chờ "continue" (người dùng duyệt).
**Bước 1 — Khám phá từ cấp 3–4.** Hết dữ liệu `explorer-level-03/04.ts`, hình thiếu (`wordlab-03/04.mjs`), seed nạp, `audio-generate --wordlab`, chạy mp3. Kiểm: check-wordlab không báo từ ngoài cấp/thiếu hình/thiếu âm thanh; seed trên DB verify (sạch + chạy 2 lần không nhân đôi); Adult22 không còn cảnh báo ở các từ của cấp 3–4 (Edge không đầu).
**Bước 2 — Khám phá từ cấp 1–2.** Như bước 1.
**Bước 3 — Họ vần.** `families.ts` (~30 họ), `family-words.json`, `seedWordLabWords`, mp3 đoạn câu vui. Kiểm: mỗi họ ≥ 3 từ cùng âm; Ghép ≥ 5 từ thật (họ ít hơn ghi rõ trong decisions.md); Adult23 không cảnh báo.
**Đóng task.** `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`; seed trên DB trống (`hoc_tieng_anh_verify` đã reset) chạy 2 lần; xuất bản thử 10 từ (trên DB verify) và mở trong Sổ từ bằng Edge không đầu (Khám phá + Họ vần); spec Playwright không thêm (không có màn mới). progress, decisions, dashboard (Cảnh báo 0), README ✅, commit từng bước + push, cập nhật memory.

## Kiểm thử
- Unit: test cho `audio-cli` (`--wordlab`), test dữ liệu (mọi `EXPLORER_SEED`/`FAMILY_SEED` qua Zod và `explorerIssues`/`familyIssues` trừ âm thanh).
- Script: `npm run wordlab:check`, `node scripts/check-pictures.mjs`, `npm run content:check`.
- Edge không đầu (`.tmp-verify/cdp.mjs`, DB verify) cho Adult22/Adult23 không cảnh báo và thử một từ + một họ trong Sổ từ.

## Việc thủ công cuối task (ghi vào progress)
`npx prisma db seed` trên DB thật → `npm run audio:generate -- --wordlab` → vào Quản trị xem và xuất bản.
