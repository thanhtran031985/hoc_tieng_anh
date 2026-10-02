# Tiến độ — 08-review-notebook — Ôn tập lặp lại và Sổ từ

Trạng thái chung: ✅ · Cập nhật lần cuối: 03/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|------|-----|------------|---------|
| 0 | Hàm 5 hộp | ✅ | `review-box.ts` đã có từ task 07; thêm `intervalLabel`, `MASTERY_NAMES`, `masteryOf` + test chuỗi đúng/sai (79/79) |
| 1 | Ôn tập hôm nay | ✅ | Screen19/20 + câu hỏi dùng lại khung bài học; `server/review.ts`; test 85/85 |
| 2 | Sổ từ (Screen13) | ✅ | `server/notebook.ts`, `src/features/notebook/`, trang `/notebook`; lưới cuộn bên trong |

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

### Bước 2 — Sổ từ (03/10/2026)
- Đã làm: `getNotebook` (từ có thẻ ôn + mức thuộc = số hộp + chủ đề qua bài học, sắp mức thấp lên trước); `NotebookView` (tiêu đề + chú giải 5 mức, chip lọc chủ đề dạng radiogroup có ← →, lưới thẻ `MasteryPips` viền + chấm + chữ, hộp thoại xem lớn có loa cho từ và câu ví dụ), `/notebook` có loading/error và trạng thái trống.
- File tạo/sửa: `src/server/notebook.ts`, `src/features/notebook/*`, `src/app/(kid)/notebook/*`, tokens mới `--size-pip`, `--size-swatch`, `--size-chip-filter`, `--size-notebook-card`, `--size-notebook-sk`.
- Kết quả kiểm tra (DB tạm, CDP): 46 thẻ → "46 từ", chip Tất cả 46 / 14 / 20 / 12 khớp; thứ tự mức 1→5 tăng dần; lọc bằng → đổi lưới (20 thẻ); mở xem lớn có loa, câu ví dụ; trống/tải đẹp; 1366×768 và 1440×900 trang không cuộn (lưới cuộn bên trong); `npx tsc`, `npm run lint`, `npm run build` sạch.
- Việc tôi cần làm thủ công: không (checklist ở cuối task).

### Rà soát cuối task (03/10/2026)
| Mục | Đánh giá | Bằng chứng |
|---|---|---|
| Hàm 5 hộp: đúng +1 hộp, sai về hộp 1, mốc 1/3/7/14/30 ngày, hộp 5 đã đúng = đã thuộc | ✅ | `review-box.ts:6,36,42`; test `review-box.test.ts` (chuỗi 1→5, sai ở hộp 4); tên file khác task.md (`review.ts`), đã ghi decisions.md |
| Ôn tập hôm nay trộn 3 dạng bài, tối đa 15 mục, chỉ từ đến hạn | ✅ | `review-play.ts:25`, `server/review.ts:81`; đã chơi bằng bàn phím cả nghe, chọn từ, nối |
| Screen19 (4 trạng thái) và Screen20 (bình thường, lưu lỗi, chưa ôn xong, đang lưu) | ✅ | `ReviewStart.tsx`, `ReviewEnd.tsx`, `ReviewPlayer.tsx` (màn dừng), `review/loading.tsx`, `review/error.tsx` |
| Không có từ đến hạn: trang chủ ẩn dòng Ôn tập | ✅ | `MissionCard.tsx:27` (hiện khi có từ đến hạn hoặc hôm nay đã ôn) |
| Tổng kết ghi từ lên hộp, sao và xu | ✅ | `server/review.ts:112-170`; DB: hộp, `due_on`, sao, xu, chuỗi ngày, `answer_logs` source review, `study_sessions` đúng |
| Sổ từ: lưới, lọc chủ đề, 5 mức thuộc, thẻ phóng to có loa, sắp xếp mức thấp trước, 4 trạng thái | ✅ | `NotebookView.tsx`, `server/notebook.ts:30`, `notebook/loading.tsx`, `notebook/error.tsx` |
| Zod cho ghi DB; kiểm hồ sơ thuộc tài khoản; không Prisma/secret trong client | ✅ | `review-complete.ts`, `actions.ts:15-28`, `requireLearner` ở mọi hàm `server/review.ts`, `server/notebook.ts`; client chỉ `import type` |
| Không mã hex, không px cố định; token thiếu thêm vào `globals.css` | ✅ | đã quét; 12 token mới (`--size-review-dragon`, `--size-box-*`, `--size-hop`, `--size-move-pic`, `--size-pip`, `--size-swatch`, `--size-chip-filter`, `--size-notebook-*`) |
| 1366×768, 1440×900 không cuộn trang | ✅ | đo màn bắt đầu, tổng kết, trống, tải; Sổ từ cuộn lưới bên trong |
| Thiết kế vs PRD | ⚠️ | lịch hộp, màu, thưởng, phóng to thẻ: đã ghi decisions.md và so-sanh.md (mục 20–24) |
- `npx tsc --noEmit`, `npm run lint`, `npm test` (85/85), `npm run build` đều sạch (03/10/2026).

## Bước tiếp theo

Hoàn thành. Checklist test thủ công bên dưới do bạn tự test sau khi đóng task (chưa tích).

### Checklist test thủ công (bạn test sau khi đóng task, chưa tích)
Chuẩn bị: `npm run dev`, đăng nhập, chọn bé cấp 1 đã học vài bài. Để có từ đến hạn ôn ngay: `UPDATE review_cards SET due_on = CURDATE() WHERE learner_id = <id>;` (hoặc thêm `- INTERVAL 1 DAY`). Làm lại từ đầu: xóa `localStorage` (khóa bắt đầu bằng `edu:review:`).
- [ ] Trang chủ: "Ôn tập" hiện "N từ cần ôn" + nút "Ôn ngay"; bấm mở `/review`.
- [ ] Màn bắt đầu: số từ đến hạn khớp trang chủ; 5 hộp đúng màu, hộp có từ đến hạn nhô lên có nhãn "N từ đến hạn"; Enter = Bắt đầu ôn.
- [ ] Ôn: nghe và chọn hình, chọn từ cho hình, nối từ (xen kẽ, nối cặp ở giữa); × hoặc Esc hỏi "Dừng ôn tập?", "Dừng lại" cho màn "Hẹn cậu lần sau nhé!", "Ôn tiếp" học tiếp đúng câu.
- [ ] Tổng kết: số từ ôn, sao và xu cộng đúng; từ lên hộp có nút nghe và mũi tên hộp cũ → mới; "từ về hộp 1" đúng; thanh trên cùng cập nhật; Enter về trang chủ.
- [ ] Kiểm hộp trong DB: `SELECT word_id, box, due_on FROM review_cards WHERE learner_id = <id>;` — đúng lên 1 hộp (hẹn 3/7/14/30 ngày), sai về hộp 1 (hẹn ngày mai).
- [ ] Tắt mạng khi vừa ôn xong: báo "Chưa lưu được kết quả"; bật mạng bấm Thử lại (Enter): lưu đúng một lần.
- [ ] Ôn xong hết: `/review` báo "Hôm nay xong rồi", trang chủ hiện "Hôm nay ôn xong rồi"; ngày hôm sau (hoặc sửa `due_on`) lại có từ.
- [ ] Sổ từ (`/notebook`): đếm "N từ" khớp, chú giải 5 mức, từ hộp thấp nằm đầu; chip chủ đề lọc đúng (dùng ← →); bấm thẻ mở xem lớn, nghe từ và câu ví dụ; bé chưa học gì thì thấy "Sổ từ còn trống".
