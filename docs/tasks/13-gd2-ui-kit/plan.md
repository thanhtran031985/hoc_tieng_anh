# Kế hoạch — Task 13 `13-gd2-ui-kit` (nhánh `feat/13-gd2-ui-kit`)

## Context
GĐ2 cần token, hằng số và các thành phần dùng chung (rồng lớn lên, hộp quà, công cụ bài học, khung game, âm thanh) trước khi làm các task 14–28. Task 13 làm phần nền đó theo 6 bước (0–5). Theo CLAUDE.md, sau mỗi bước tôi tự kiểm, cập nhật `progress.md`, đề xuất commit rồi DỪNG chờ "continue". Kế hoạch này chi tiết **Bước 0**; Bước 1–5 chỉ nêu hướng, sẽ chi tiết hóa khi tới bước đó.

Khảo sát hiện trạng:
- `src/app/globals.css`: `:root` có 305 biến; thiếu **165 biến** so với khối `:root` mục 15 của `docs/DESIGN_SYSTEM.md` (135 màu + 24 size + 6 duration, đúng bằng `designs/tokens.json`). 22 màu trong số đó là tham chiếu dạng `{level-2}`, `{brand}`… → viết `var(--level-2)`, `var(--brand)`.
- Các token bổ sung ở GĐ1 (THCS, người lớn) chỉ nằm trong `:root`, không ánh xạ vào `@theme inline`; component dùng `var(--…)` trong CSS module. Làm theo đúng cách đó.
- `src/lib/rules/constants.ts` chưa có. `designs/tokens.json` có họ `coins` (10) và `wordlab` (6).
- Test `tests/e2e/01-nen-tang.spec.ts` ("mọi token màu dạng hex … khớp designs/tokens.json") đang đỏ vì thiếu token GĐ2 (ghi ở `decisions.md`); không nới test.
- Trang xem: `src/app/dev/ui/page.tsx` (dùng `Section`), `src/app/dev-tokens/page.tsx`.
- `src/components/lesson/` và `src/components/rewards/` chưa tồn tại; `src/components/ui/` có Mascot, Button, Dialog… (tái dùng).

## Bước 0 — Token và hằng số GĐ2
1. **`src/app/globals.css`**: thêm vào cuối khối `:root` (sau `--dragon-float`) một đoạn "Token GĐ2 (Gd2/Gd3/Gd4Tokens)", chia nhóm bằng comment theo họ (đọc-ghi âm, bong bóng, đập chuột, đua xe, trùm/cổng, rồng lớn lên, sticker/huy hiệu/quà, phòng/cửa hàng/trang phục, in, Khám phá từ/Họ vần…). Giá trị lấy nguyên từ `designs/tokens.json` (sinh bằng script tạm ở scratchpad, không commit). Chỉ thêm, không sửa dòng cũ. Không thêm `@theme inline` (như các token GĐ1 bổ sung).
2. **`src/lib/rules/constants.ts`** (mới): `COINS` (`stickerLesson 10`, `badge 50`, `boss 30`, `lesson 20`, giá nội thất S/M/L, `special 400`, `clothes 60`, `hat 50`) và `WORDLAB` (`branchMin 4`, `branchMax 6`, `linksMaxDepth 4`, `buildGoal 5`, `readRate 0.82`, `readRateSlow 0.6`), `as const`, chú thích tiếng Việt ghi tác dụng. Thêm `constants.test.ts` (chạy bằng `npm test`) đối chiếu từng giá trị với `designs/tokens.json` để không lệch.
3. **`/dev/ui`**: thêm mục "Token GĐ2" bằng client component nhỏ `src/app/dev/ui/gd2-tokens.tsx`: danh sách nhóm; màu hiện ô màu (`background: var(--tên)`), size/duration hiện giá trị đọc từ `getComputedStyle`. Không dùng hex/px cứng.
4. Bước này chưa đụng `[data-theme="thcs"]` (thiết kế THCS chưa có giá trị riêng cho các token này).

**Kiểm tra Bước 0**
- Script tạm: mọi 470 biến trong khối `:root` mục 15 đều có trong `globals.css` với đúng giá trị; `git diff -U0 src/app/globals.css` không có dòng bị xóa/sửa (221 token GĐ1 cũ giữ nguyên).
- `npx tsc --noEmit`, `npm run lint`, `npm test` (gồm test hằng số), `npm run build`.
- `npx playwright test 01-` phải đạt (hiện đỏ).
- Mở `/dev/ui` bằng Edge không đầu (cách trong memory `reference_browser-verify-setup`) ở 1366×768 và 1920×1080: mục token GĐ2 hiện đủ nhóm, màu đúng.

**Việc đi kèm sau bước**: cập nhật `progress.md` (bước 0 ✅ + nhật ký), `decisions.md` (token không ánh xạ `@theme`; 165 biến chứ không phải 166 trong task.md), lưu kế hoạch này vào `docs/tasks/13-gd2-ui-kit/plan.md`, chạy `npm run tasks:dashboard`, đề xuất commit `13-gd2-ui-kit: step 0 — token và hằng số GĐ2`, rồi dừng chờ "continue".

## Hướng cho các bước sau (chi tiết hóa khi tới)
- **B1 MascotGrowth**: thêm prop `stage` 1–5 vào `src/components/ui/Mascot`; nguồn nét vẽ ở `designs/components/MascotGrowth` + `bundle.js`; dáng 3 = hình cũ; nhãn đọc màn hình "dáng cấp N"; xem đủ 5×4×8 ở `/dev/ui`.
- **B2 Chữ bấm được + khung game** (`src/components/lesson/`): `Bong.L.words/overlay/gameStart/gamePause/gameEnd/gfoot`; dùng `useHotkeys`, `Dialog`, `src/lib/speech.ts`.
- **B3 RewardPopup** (`src/components/rewards/`): 2 bước, nhận callback "Cho vào bộ sưu tập", tôn trọng reduced-motion.
- **B4 LessonTools**: 2 nút F/Âm thanh trên khung bài task 07; Fullscreen API; cài đặt lưu `learners.settings` (cần kiểm schema Zod + quyền hồ sơ bé thuộc tài khoản); khớp Screen46; vừa 1366×768.
- **B5 Âm thanh**: Web Audio API cho hiệu ứng; nhạc nền từ `public/media/music/`, thiếu tệp thì công tắc mờ; hạ nhạc khi giọng đọc chạy.
- Chưa cần cài package mới ở bất kỳ bước nào; nếu phát sinh sẽ hỏi.
