# Tiến độ — 08-review-notebook — Ôn tập lặp lại và Sổ từ

Trạng thái chung: 🔄 · Cập nhật lần cuối: 03/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|------|-----|------------|---------|
| 0 | Hàm 5 hộp | ✅ | `review-box.ts` đã có từ task 07; thêm `intervalLabel`, `MASTERY_NAMES`, `masteryOf` + test chuỗi đúng/sai (79/79) |
| 1 | Ôn tập hôm nay | ✅ | Screen19/20 + câu hỏi dùng lại khung bài học; `server/review.ts`; test 85/85 |
| 2 | Sổ từ (Screen13) | ⬜ | |

## Nhật ký
### Bước 0 — Hàm 5 hộp (03/10/2026)
- Đã làm: luật đúng +1 hộp, sai về hộp 1, mốc 1/3/7/14/30 ngày, hộp 5 đã đúng = đã thuộc đã có từ task 07 (`nextReview`, `isMastered`). Bổ sung `intervalLabel(box)` (nhãn lịch sinh từ `BOX_INTERVAL_DAYS`), `MASTERY_NAMES`, `masteryOf`.
- File sửa: `src/lib/rules/review-box.ts`, `src/lib/rules/review-box.test.ts`.
- Kết quả kiểm tra: `npm test` 79/79 (chuỗi đúng liên tiếp 1→5 ra đúng ngày; sai ở hộp 4 về hộp 1 rồi đi lại).
- Việc tôi cần làm thủ công: không.

### Bước 1 — Ôn tập hôm nay (03/10/2026)
- Đã làm: hàm thuần `review-play.ts` (dựng phiên, thưởng, gộp kết quả theo từ) + test; schema `review-complete.ts`; `src/server/review.ts` (`getReviewOverview`, `getReviewPlay`, `completeReview` một transaction: thẻ chuyển hộp, `answer_logs` source review, sao/xu/XP, chuỗi ngày, `study_sessions`, gửi lại cùng giờ bắt đầu chỉ ghi một lần); action `completeReviewAction` (Zod + hồ sơ đang chọn); UI `src/features/review/` (`ReviewStart`, `MemoryBox`, `ReviewPlayer`, `ReviewEnd`, `ReviewFlow`, resume theo ngày); route `/review` có loading/error; trang chủ chỉ đếm từ có hình và ẩn dòng Ôn tập khi không có gì để ôn.
- File tạo/sửa: `src/lib/rules/review-play.ts(+test)`, `src/lib/schemas/review-complete.ts`, `src/server/review.ts`, `src/server/home.ts`, `src/features/review/*`, `src/features/home/MissionCard.tsx`, `src/app/(kid)/review/*`, tokens mới trong `globals.css` (`--size-review-dragon`, `--size-box-lid`, `--size-box-pic`, `--size-box-pic-in`, `--size-box-sk`, `--size-hop`, `--size-move-pic`).
- Kết quả kiểm tra (DB tạm, CDP, 1366×768): 9 thẻ (8 đến hạn, 1 hộp 5 chưa đến hạn) → màn bắt đầu đúng số theo hộp; chơi bằng bàn phím cả 3 dạng; hộp lên/về đúng (đúng +1 hộp, hẹn +1/+3/+7/+14/+30 ngày; sai về hộp 1 hẹn ngày mai); sao +8, xu +8, chuỗi ngày 1, 10 `answer_logs` source review, 1 `study_sessions`; từ chưa đến hạn không bị đụng; thanh trên cùng cập nhật sau khi lưu; màn trống, màn tải đúng, không cuộn.
- Việc tôi cần làm thủ công: không (checklist ở cuối task).

## Bước tiếp theo
Bước 2 — Sổ từ (Screen13).
