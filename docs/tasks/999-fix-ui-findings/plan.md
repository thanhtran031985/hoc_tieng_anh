# Kế hoạch task 999 — Sửa lỗi giao diện sau rà soát test tự động (lỗi 1–7)

## Context
Bộ test Playwright (commit a09504e) phát hiện 9 lỗi của app, ghi ở `docs/test/bao-cao-test.md`. Người dùng chọn sửa lỗi 1–7 trước; lỗi 8 (từ chưa có hình) và 9 (câu "ôn hết" cho bé mới) chờ quyết về nội dung/logic nên NGOÀI phạm vi. Task đã tạo: `docs/tasks/29-fix-ui-findings/` (nhánh `feat/29-fix-ui-findings`, dòng 29 trong README, dashboard 0 cảnh báo). Mục tiêu: test tương ứng chuyển từ hỏng sang đạt, không nới test, không đổi tính năng khác.

## Phát hiện khi khảo sát (khác với báo cáo)
- **Lỗi 1:** Next 16.3.8 có sẵn prop `retry()` cho `error.tsx` (docs `node_modules/next/dist/docs/.../error.md`; `reset()` "chỉ vẽ lại, không lấy lại dữ liệu"). Cách sửa chuẩn: đổi prop `reset` → `retry` rồi `onRetry={retry}`, KHÔNG cần tự viết `router.refresh()` + `startTransition`. Dùng `retry` có sẵn sạch hơn kế hoạch ban đầu trong task.md → ghi vào decisions.md.
- Báo cáo nói "trang chủ và Hết giờ làm đúng", nhưng `(kid)/home/error.tsx`, `(kid)/time-up/error.tsx`, `(kid)/placement/error.tsx` cũng dùng `onClick={reset}` (RetryButton đúng chỉ là khối lỗi trong trang). Vậy **19 tệp** `error.tsx`, không phải 16: sửa cả 19.
- Danh sách: `(admin)/admin/{builder,excel,media,questions,tree,vocab}/error.tsx` + `(admin)/admin/error.tsx`; `(adult-gate)/parent/unlock`; `(kid)/{home,lesson/[lessonId],levels,map/[level],notebook,placement,profiles,review,time-up}`; `(parent)/parent/error.tsx`, `(parent)/parent/settings`.

## Các bước (đúng thứ tự trong task.md)
**Bước 0** — Xác nhận lỗi còn tái hiện, tạo nhánh (đã tạo), ghi kết quả vào progress.md.

**Bước 1 — Lỗi 1.** Trong 19 `error.tsx`: đổi chữ ký `{ reset }` → `{ retry }` (kiểu `retry: () => void`) và `onRetry={retry}` / `onClick={retry}`. Sau đó kiểm `tsc` xem kiểu props của error.tsx trong Next 16.3.8 có `retry` (đã thấy ở `error-boundary.d.ts`). Nếu `retry` không có trong bản chạy thật thì lùi về `router.refresh()` + `reset()` trong `startTransition`.

**Bước 2 — Lỗi 2.** `src/features/lesson/ListenChooseStep.tsx:15` và `PickWordStep.tsx:15`: thêm `a–d` vào bản đồ phím cùng hành động với `1–4` (`useHotkeys` đã chuẩn hóa phím về chữ thường, comment của nó ghi sẵn "1–4 (hoặc A–D)"). Giữ `keyHint` hiện số 1–4. Kiểm `KEYS` không xung đột `h` (gợi ý): a, b, c, d không trùng.

**Bước 3 — Lỗi 3, 4.** `src/features/admin/StepsPreview.tsx` (QuestionPreview chỉ bọc nó): 
- Esc: thêm `useHotkeys({ Escape: onClose })` (xem thứ tự với phím Esc của bước con ở pha capture, và đảm bảo ngăn kéo/ngăn xem trước bên dưới không đóng đôi).
- Enter: khi mở, đưa focus vào lớp phủ (`tabIndex={-1}` + `ref.focus()` trong effect, trả focus về phần tử cũ khi đóng) để Enter không rơi vào nút của ngăn kéo (vốn nằm trong `role="dialog"` nên bị `useHotkeys` bỏ qua).
- Kiểm: phím 1–4/Enter/Space/H trong xem trước vẫn chạy; Tab không thoát ra ngoài (lớp phủ `aria-modal`).

**Bước 4 — Lỗi 5.** Thêm `src/app/(kid)/map/loading.tsx` dùng lại `TopbarSkeleton` / kiểu của `map/[level]/loading.tsx` (có thể export lại bằng `export { default } from "./[level]/loading"` nếu import được, nếu không thì chép bố cục gọn).

**Bước 5 — Lỗi 6, 7.**
- Favicon: `src/app/icon.svg` vẽ từ đầu rồng Bông (`chao`) lấy nét vẽ từ `src/components/ui/Mascot/dragon-parts.ts`, màu lấy từ token `--dragon-*` của rồng ngọc (`designs/tokens.json`); tệp SVG tĩnh nên phải ghi giá trị màu trực tiếp trong tệp (ngoại lệ duy nhất của quy tắc "không hex", ghi vào decisions.md). Next tự thêm `<link rel=icon>`.
- `src/app/not-found.tsx` (server component, tiếng Việt): `DataState`/`Mascot` `suynghi`, tiêu đề kiểu "Bông tìm hoài mà không thấy trang này", một câu nhắn, `ButtonLink` "Về trang chủ" → `/home`. Dùng class từ `kid.module.css`/token, không hex/px. Kiểm không bị bắt bởi layout nhóm nào cần session (not-found nằm ở gốc `app/`, nên không dùng `requireActiveLearner`).

**Bước 6 — Kiểm tra cuối.** `npx tsc --noEmit`, `npm run lint`, `npm run build`. Tắt `npm run dev`, chạy `npm run test:e2e` (cần `PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION` cho `migrate reset` trên `hoc_tieng_anh_test`; người dùng đã đồng ý reset database test ở phiên trước — nếu bị chặn lại thì hỏi). Cập nhật `docs/test/bao-cao-test.md` (lỗi 1–7 → đã sửa, số liệu mới) và test nếu cần chuyển kỳ vọng (không nới). Thêm màn `/not-found` vào `chung.spec.ts` (trợ năng, không cuộn) và kiểm "không lỗi console" không còn 404 favicon.

## Quy trình / hồ sơ
- Sau kế hoạch được duyệt: lưu bản này vào `docs/tasks/999-fix-ui-findings/plan.md`.
- Sau mỗi bước: tsc + test liên quan, cập nhật `progress.md` (bảng bước: dòng đầu tiên có cột "Bước" và "Trạng thái"), `npm run tasks:dashboard` (Cảnh báo: 0), commit `29-fix-ui-findings: step N — …` và push (đã được phép tự commit/push theo quy trình tự chủ).
- Cuối task: chạy `.claude/commands/finish-task.md` giai đoạn C (Playwright đã nằm trong đó), README → ✅ khi người dùng báo test ok, soạn mô tả PR.
- Không cài package mới, không sửa `designs/`, không đọc `.env`.

## Kiểm chứng
- Lỗi 1: `npx playwright test chung -g "Trạng thái lỗi"` (10 màn × 3 kích thước) đạt; tay: làm lỗi DB, mở `/levels`, khôi phục, bấm Thử lại thì hết lỗi không cần F5.
- Lỗi 2: `npx playwright test 07-` ("phím A–D chọn đáp án giống phím 1–4").
- Lỗi 3, 4: `npx playwright test 12c- 12d-`.
- Lỗi 5: `npx playwright test chung -g "khung xương"`.
- Lỗi 6, 7: test "không lỗi console" ở `01-nen-tang`, gõ `/map/99` thấy trang tiếng Việt.
- Toàn bộ: `npm run test:e2e`; kỳ vọng chỉ còn test của lỗi 8, 9 (nếu có) hỏng.
