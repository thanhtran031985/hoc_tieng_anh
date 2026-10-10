# Tiến độ — 23-notebook-plus — Sổ từ bổ sung và in danh sách từ

Trạng thái chung: 🔄 · Cập nhật lần cuối: 09/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Sổ từ bổ sung (Screen44) | ✅ | Tự duyệt; Edge 32/32 đạt, 11 test quy tắc |
| 1 | In danh sách từ (Screen45) | ⬜ | |

## Nhật ký

(Claude ghi sau mỗi bước: đã làm gì, kết quả kiểm tra, việc cần làm thủ công.)

**10/10/2026 — Bước 0.** Không cần migration. Quy tắc thuần `src/lib/rules/notebook.ts` (+ 11 test): `isMastered`/`countMastered` (đã thuộc = mức ≥ 4, Nhớ tốt trở lên), `filterWords` (cấp + chủ đề), `sortWords` (mức thấp lên trước, cấp cao trước, rồi chữ), `topicsForLevel` (chủ đề đổi theo cấp, kèm số từ), `paginate`/`pageCount` (12 thẻ mỗi trang, kẹp trang), `chunkForPrint` (8 từ mỗi trang A4), `neighbour` (← →). `server/notebook.ts` mở rộng: mỗi từ có `levelNumber` (cấp thấp nhất) và `levelNumbers`, chủ đề có `levelNumber`, thêm `levels`, `schoolGrade`, `levelName` (vẫn qua `requireLearner`). `NotebookView` viết lại theo Screen44: tiêu đề + hai ô số liệu “từ đã gặp / từ đã thuộc” + nút “In danh sách từ” (giữ bộ lọc trong đường dẫn `/notebook/print?level=&topic=`, ẩn khi sổ trống); lọc Cấp (chip radio có chấm màu cấp, ← → ↑ ↓ chuyển chip) rồi Chủ đề (đổi theo cấp, đổi cấp thì về “Tất cả”); lưới 6×2 = 12 thẻ có nhãn mức, cấp, loa; phân trang “N từ · trang a/b · xếp từ mức thấp lên” + nút Trang trước/sau; `WordZoom` (thẻ phóng to 2 cột: hình lớn, từ + loa, phiên âm · cấp · chủ đề, nghĩa, câu ví dụ + loa, thanh mức thuộc; ← → đi theo danh sách đã lọc kể cả qua trang, Esc đóng, Tab xoay vòng trong thẻ, đóng xong tiêu điểm về thẻ). `loading.tsx` khớp bố cục mới; trạng thái trống giữ nguyên. Kiểm (Edge, DB verify, `.tmp-verify/check-23-notebook.mjs`, 32/32): 45 từ đã gặp và 18 từ đã thuộc khớp database (hộp ≥ 4), 12 thẻ/trang, xếp từ mức thấp lên, Trang trước/sau, lọc Cấp 3 = 20 từ, chip Chủ đề đổi theo cấp, lọc chủ đề đúng số từ, đổi cấp reset chủ đề, ← → trên nhóm chip, thẻ phóng to mở/đóng, → qua 12 từ sang trang 2 của lưới, Esc, Tab không lọt ra ngoài, nút In giữ bộ lọc, trạng thái trống, không cuộn ở 1366×768 và 1920×1080, không lỗi console.
Việc thủ công: không có.

## Bước tiếp theo

Bước 1 — In danh sách từ (Screen45)
