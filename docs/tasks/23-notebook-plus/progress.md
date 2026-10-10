# Tiến độ — 23-notebook-plus — Sổ từ bổ sung và in danh sách từ

Trạng thái chung: ✅ · Cập nhật lần cuối: 09/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Sổ từ bổ sung (Screen44) | ✅ | Tự duyệt; Edge 32/32 đạt, 11 test quy tắc |
| 1 | In danh sách từ (Screen45) | ✅ | Tự duyệt; Edge 24/24 đạt, PDF A4 4 trang |

## Nhật ký

(Claude ghi sau mỗi bước: đã làm gì, kết quả kiểm tra, việc cần làm thủ công.)

**10/10/2026 — Bước 0.** Không cần migration. Quy tắc thuần `src/lib/rules/notebook.ts` (+ 11 test): `isMastered`/`countMastered` (đã thuộc = mức ≥ 4, Nhớ tốt trở lên), `filterWords` (cấp + chủ đề), `sortWords` (mức thấp lên trước, cấp cao trước, rồi chữ), `topicsForLevel` (chủ đề đổi theo cấp, kèm số từ), `paginate`/`pageCount` (12 thẻ mỗi trang, kẹp trang), `chunkForPrint` (8 từ mỗi trang A4), `neighbour` (← →). `server/notebook.ts` mở rộng: mỗi từ có `levelNumber` (cấp thấp nhất) và `levelNumbers`, chủ đề có `levelNumber`, thêm `levels`, `schoolGrade`, `levelName` (vẫn qua `requireLearner`). `NotebookView` viết lại theo Screen44: tiêu đề + hai ô số liệu “từ đã gặp / từ đã thuộc” + nút “In danh sách từ” (giữ bộ lọc trong đường dẫn `/notebook/print?level=&topic=`, ẩn khi sổ trống); lọc Cấp (chip radio có chấm màu cấp, ← → ↑ ↓ chuyển chip) rồi Chủ đề (đổi theo cấp, đổi cấp thì về “Tất cả”); lưới 6×2 = 12 thẻ có nhãn mức, cấp, loa; phân trang “N từ · trang a/b · xếp từ mức thấp lên” + nút Trang trước/sau; `WordZoom` (thẻ phóng to 2 cột: hình lớn, từ + loa, phiên âm · cấp · chủ đề, nghĩa, câu ví dụ + loa, thanh mức thuộc; ← → đi theo danh sách đã lọc kể cả qua trang, Esc đóng, Tab xoay vòng trong thẻ, đóng xong tiêu điểm về thẻ). `loading.tsx` khớp bố cục mới; trạng thái trống giữ nguyên. Kiểm (Edge, DB verify, `.tmp-verify/check-23-notebook.mjs`, 32/32): 45 từ đã gặp và 18 từ đã thuộc khớp database (hộp ≥ 4), 12 thẻ/trang, xếp từ mức thấp lên, Trang trước/sau, lọc Cấp 3 = 20 từ, chip Chủ đề đổi theo cấp, lọc chủ đề đúng số từ, đổi cấp reset chủ đề, ← → trên nhóm chip, thẻ phóng to mở/đóng, → qua 12 từ sang trang 2 của lưới, Esc, Tab không lọt ra ngoài, nút In giữ bộ lọc, trạng thái trống, không cuộn ở 1366×768 và 1920×1080, không lỗi console.
Việc thủ công: không có.

**10/10/2026 — Bước 1.** Route `/notebook/print?level=&topic=` (server component, `requireUser` + `requireActiveLearner`, dữ liệu qua `getNotebook` → `requireLearner`; tham số kiểm bằng Zod `printQuerySchema`, tham số sai bị bỏ qua như không lọc) + `loading.tsx` (khung trang A4) + `error.tsx`. `PrintSheet`: mỗi trang A4 có đầu trang (“Danh sách từ của {tên}”, Lớp · Cấp · Chủ đề, ngày in dd/MM/yyyy, chỗ “Bố mẹ ký”), dòng hướng dẫn, bảng Hình · Từ (kèm phiên âm) · Nghĩa · Câu ví dụ (kèm nghĩa) · Tự viết lại (khung 3 dòng kẻ làm bằng đường viền thật nên in ra không cần bật “in hình nền”), chân trang “Trang x/y”; chia mỗi trang 8 từ (`chunkForPrint`), dòng có `break-inside: avoid`, hình chuyển xám bằng `filter: grayscale`. `print.module.css`: mọi kích thước theo em (1em = 1/80 chiều cao trang), xem trước thu nhỏ theo `100dvh`, khi in đúng `size-print-page-w` × `size-print-page-h` (210×297mm), lề `size-print-margin`, ô hình `size-print-pic`, cột viết `size-print-write`, `@page { size: A4 portrait; margin: 0 }`, chỉ dùng màu `print-ink/muted/rule/paper`, mỗi trang `break-after: page` (trang cuối không). `PrintToolbar` (Quay lại Sổ từ, nút In + Ctrl+P mở hộp thoại in, ẩn khi in; nút In khóa khi không có từ). Kiểm (Edge, DB verify, `.tmp-verify/check-23-print.mjs`, 24/24): 30 từ chia 4 trang (8, 8, 8, 6), đầu trang đúng (Lớp 4 · Cấp 3 · Lá xanh), xem trước đúng tỷ lệ 210:297 và vừa 1366×768, ở chế độ in mỗi trang đúng 210,0×297,0 mm, không dòng nào tràn lề hay cắt ngang trang, thanh công cụ ẩn, chỉ có màu đen/xám/trắng, PDF (`Page.printToPDF`) đúng 4 trang khổ 595×842pt, lọc theo chủ đề, tham số sai bị bỏ qua, nút Quay lại, trạng thái trống, không lỗi console. Sửa trong lúc kiểm: cỡ chữ cột Từ giảm còn 1,5em để “breakfast” không xuống dòng.
Việc thủ công: in thử một chủ đề cấp 3 ra PDF (Ctrl+P) trên trình duyệt của bố/mẹ.

## Kiểm tra cuối task

`npx tsc --noEmit`, `npm run lint`, `npm test` (556 đạt), `npm run build` đều sạch. Kịch bản Edge của task 23 (DB verify, hồ sơ 1): Sổ từ 32/32, bản in 24/24 (1366×768; Sổ từ thêm 1920×1080), không lỗi console. Spec Playwright `tests/e2e/23-so-tu-in.spec.ts` đã viết, màn `/notebook/print` đã thêm vào danh sách của `chung.spec.ts`; CHƯA chạy Playwright (đợi chạy một lượt sau khi xong mọi task).

### Việc thủ công (checklist)
- [ ] Học vài bài ở cấp 3 để có từ trong Sổ từ (hoặc nạp thẻ ôn thử): vào Sổ từ, thử lọc Cấp và Chủ đề, lật trang, bấm thẻ rồi dùng ← → và Esc.
- [ ] Bấm “In danh sách từ” sau khi lọc một chủ đề cấp 3; nhấn Ctrl+P, chọn “Lưu dưới dạng PDF”, khổ A4, lề “Không có”: kiểm tra không tràn lề, mỗi trang tối đa 8 dòng, không dòng nào bị cắt.
- [ ] Chạy Playwright một lượt sau khi xong mọi task (cần `prisma migrate reset`, bạn đồng ý riêng).

## Bước tiếp theo

Hoàn thành
