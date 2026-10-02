# Kế hoạch — 11-parent-area — Khu vực bố mẹ: tổng quan và cài đặt

## Context
Hiện `/parent` chỉ là trang giữ chỗ và cổng bố mẹ là một hộp thoại tạm ở màn chọn hồ sơ (task 04). Task này dựng khu người lớn thật (theme `thcs` sáng, tiền tố `a-` của thiết kế): bộ thành phần dùng chung (task 12 sẽ dùng lại), cổng vào Adult01, Tổng quan Adult02 (số liệu từ database, biểu đồ SVG) và Cài đặt Adult07 (giới hạn giờ — task 10 dùng ngay, giao diện/giọng đọc, quản lý hồ sơ, đổi mật khẩu và PIN). Theo lệnh của bạn: tự duyệt kế hoạch, làm liên tục, commit + push từng bước, `/finish-task` ở cuối (checklist thủ công chưa tích), rồi sang task 12.

Thiết kế đã đọc: `Adult01-Gate`, `Adult02-Overview`, `Adult07-Settings` (README + preview), `AdultShell/Kpi/Charts/Field/Table/Palette`, `bundle.js` (mã `Bong.A`), DESIGN_SYSTEM mục 14–15 (khối `[data-theme="thcs"]`). Không dựng Adult03–06 (Kỹ năng, Thi, Bài viết, Lịch — GĐ2–3).

## Hiện trạng
- `globals.css` đã có token khu người lớn (`--adm-*`, `--chart-*`, `--field-error*`, `--thcs-*`), nhưng CHƯA có khối `[data-theme="thcs"]`; font Be Vietnam Pro đã nạp (`--font-thcs`).
- `learner-settings.ts` đã có `dailyLimitMinutes`, `studyWindow`, `voice`, `soundOn` (task 10 đã dùng `dailyLimitMinutes`, `bonus`); `learners.ui_theme` có enum `tieu_hoc|thcs|auto`.
- Cổng: `unlockParentAction` (PIN bcrypt hoặc mật khẩu, bộ đếm sai trong bộ nhớ `rate-limit.ts`, 5 lần/10 phút), `checkParentSecret`, `requireParentGate` (cookie ký 15 phút, hiện chuyển về `/profiles`), `setParentPinAction`, `ParentGate.tsx` (hộp thoại ở `/profiles`).
- Số liệu có sẵn: `study_sessions` (phút/ngày), `learners` (chuỗi ngày, cấp), `review_cards`, `lesson_progress`, `lesson_attempts`, `answer_logs` (nguồn lesson/review/exam).
- Bộ icon `ui/Icon` thiếu nhiều icon của khu người lớn (grid, chart, key, trash, warn, sliders, users, logout, search, sort…).

## Quyết định (ghi vào decisions.md)
1. **Bộ thành phần** ở `src/components/adult/`, mỗi hàm `Bong.A` thành một component React + CSS module dùng token (không chép hex/px): `AdultArea` (đặt `data-theme="thcs"`, font), `AdultShell` (menu tối, thanh trên, `KidSwitcher`), `Kpi`, `Status`, `AdultButton`, `AdultField/Select/Segmented/Toggle`, `AdultDialog` (khóa Tab, Esc, `onConfirm` trả lỗi để giữ hộp), `AdultDrawer`, `ToastProvider/useToast`, `AdultSkeleton/Empty/Error`, `AdultTable` (tìm, lọc, sắp xếp, phân trang), biểu đồ `charts/{VBars,HBars,LineChart}` (SVG/HTML tự dựng, tooltip khi rê chuột/Tab, đường tham chiếu nét đứt). Thêm các icon thiếu vào `ui/Icon/icon-paths.ts` (lấy nét vẽ từ `bundle.js`). Thêm khối `[data-theme="thcs"]` vào `globals.css` (chỉ token đổi giá trị, theo DESIGN_SYSTEM mục 15) — Tiểu học không đổi vì khối chỉ áp lên vùng `AdultArea`.
2. **Chọn con** ở thanh trên bằng `?kid=<id>` trong URL (đọc được ở server, đi bằng bàn phím, nhớ khi tải lại); id lạ hoặc của tài khoản khác → bỏ qua, dùng hồ sơ đầu của tài khoản (mọi truy cập qua `requireLearner`).
3. **Cổng** (Adult01) ở route mới `/parent/unlock` (nhóm route riêng, không qua `requireParentGate`); `requireParentGate` và mọi trang bố mẹ chuyển về đó; nút "Bố mẹ" ở `/profiles` thành liên kết tới đó (bỏ `ParentGate.tsx`). PIN nhập 6 ô (4–6 số, 2 ô cuối nét đứt), thẻ Mã PIN / Mật khẩu, tài khoản chưa có PIN chỉ có mật khẩu + gợi ý tạo PIN ở Cài đặt. `unlockParentAction` trả thêm số lần còn lại; **sai 5 lần khóa 5 phút**, đếm ở server (đổi `PIN_LIMIT.windowMs` thành 5 phút; thêm `remainingAttempts`); tải lại trang vẫn bị khóa. "Quên mật khẩu?" không làm (chưa có luồng đặt lại mật khẩu) — ghi so-sanh.
4. **Số liệu Tổng quan** (`src/server/reports/overview.ts` + hàm thuần `src/lib/rules/report.ts` có test): phút học tuần này so với tuần trước (tuần bắt đầu thứ Hai), chuỗi ngày (kỷ lục chưa lưu nên chỉ ghi "Chuỗi hiện tại"), từ đã thuộc / từ đã học (hộp 5 đã đúng / tất cả thẻ), cấp hiện tại và % hoàn thành cấp (bài đã xong / tổng bài của cấp), trình độ CEFR ước lượng theo cấp (PRD A1: cấp 1–2 Pre-A1→A1…, bảng trong `report.ts`), biểu đồ phút 7 và 30 ngày với đường giới hạn nét đứt (`dailyLimitMinutes`), hoạt động gần đây (lượt học xong, phiên ôn, bài xếp lớp; tối đa 8). Con chưa học ngày nào → trạng thái trống.
5. **Cài đặt** chia 4 nhóm (↑/↓ chuyển nhóm, `role=tablist`): *Thời gian học* — giới hạn (15/20/30/45/60/không) lưu `settings.dailyLimitMinutes` (task 10 dùng ngay), khung giờ từ–đến (lưu `settings.studyWindow`, báo lỗi nếu giờ kết thúc ≤ giờ bắt đầu hoặc < 30 phút; **chưa áp dụng khóa theo khung giờ** — GĐ2, ghi chú trong giao diện); *Giao diện & âm thanh* — Tiểu học/THCS/Tự động (`learners.ui_theme`; GĐ1 chỉ lưu), giọng UK/US, tốc độ thường/chậm (`settings.voice`), nút Nghe thử bằng giọng trình duyệt, âm thanh (`settings.soundOn`); *Hồ sơ của con* — đổi tên, đổi lớp, đổi cấp (bảng 10 cấp), đặt lại tiến độ, xóa hồ sơ (gõ đúng tên), thêm hồ sơ; *Mật khẩu & mã PIN*. Bỏ khỏi bản này các mục không có dữ liệu/chức năng: ngày được học trong tuần, nhắc còn 5 phút, thêm 10 phút khi thi, nhạc nền, đọc hướng dẫn tiếng Việt, "giữ bài viết/ghi âm khi đặt lại" (ghi so-sanh).
6. **Thao tác nguy hiểm** qua hộp thoại xác nhận, ghi trong transaction, dùng `adm-danger`: đặt lại tiến độ xóa `lesson_progress`, `lesson_attempts`, `answer_logs`, `review_cards`, `study_sessions` và đưa sao/xu/XP/chuỗi ngày về 0 (giữ cấp); xóa hồ sơ phải gõ đúng tên (xóa vĩnh viễn, không có khôi phục 30 ngày như bản xem trước); đổi cấp chỉ cập nhật `current_level_id`.
7. **Bảo mật tài khoản**: đổi mật khẩu (kiểm mật khẩu hiện tại; ≥ 8 ký tự có cả chữ và số; nhập lại khớp; bcrypt), đổi PIN (kiểm PIN hiện tại bằng bcrypt, 4–6 số, từ chối PIN quá dễ đoán: lặp số hoặc số liền nhau; chưa có PIN thì dùng mật khẩu tài khoản để đặt), cùng bộ đếm thử sai với cổng. Mọi action: `requireUser` + `requireParentGate` + Zod; việc của hồ sơ đi qua `requireLearner`.
8. **Khung**: menu trái có Tổng quan, Cài đặt (làm) và Kỹ năng / Kết quả thi / Bài viết & ghi âm / Lịch kiểm tra (hiện mờ, nhãn "Sắp có"); thẻ chuyển khu Bố mẹ / Quản trị (Quản trị chỉ bấm được với role admin, tới `/admin` của task 12); "Về màn chọn hồ sơ" mở hộp thoại rồi khóa cổng và về `/profiles`; Đăng xuất ở đáy menu.

## Các bước (khớp task.md; sau mỗi bước: kiểm tra, progress.md, dashboard "Cảnh báo: 0", commit `11-parent-area: step N — …`, push)

### Bước 0 — Bộ thành phần khu người lớn
- Khối `[data-theme="thcs"]` trong `globals.css`; icon mới; toàn bộ thành phần mục 1; trang thử `/dev/adult-kit` (không cần đăng nhập như `/dev/ui`).
- Kiểm tra: trang thử hiện đủ thành phần (kể cả 3 biểu đồ có tooltip, bảng, hộp thoại, ngăn kéo, toast, khung xương/trống/lỗi); màn Tiểu học (`/home`, `/dev/ui`) không đổi màu; Tab thấy viền focus; ảnh chụp 1366×768.

### Bước 1 — Cổng vào khu bố mẹ (Adult01)
- Route `/parent/unlock`, `PinInput` 6 ô, tab PIN/Mật khẩu (hiện/ẩn mật khẩu), lỗi dưới ô + số lần còn lại, khóa 5 phút, 4 trạng thái (loading.tsx, trống = chưa có PIN, lỗi mạng giữ nguyên dữ liệu nhập), liên kết từ `/profiles`; bỏ hộp thoại cũ; `requireParentGate` chuyển hướng.
- Kiểm tra (CDP): PIN đúng vào `/parent`; PIN sai báo lỗi dưới ô và "Còn N lần"; sai 5 lần khóa và tải lại vẫn khóa; tài khoản chưa có PIN chỉ có ô mật khẩu; mật khẩu đúng vào được; phím tắt Enter.

### Bước 2 — Tổng quan (Adult02)
- `src/lib/rules/report.ts` + test; `src/server/reports/overview.ts`; `/parent` (5 Kpi, biểu đồ 7/30 ngày, hoạt động gần đây), `loading.tsx`, `error.tsx`, trạng thái trống; `?kid=`.
- Kiểm tra: đủ 4 trạng thái; đổi con (↑ qua thanh chọn con) thì số liệu đổi; phút tuần so với tuần trước đúng với dữ liệu chèn; biểu đồ có đường giới hạn nét đứt khi có giới hạn; con chưa học → trống; `?kid=` của người khác → bỏ qua; 1366×768 và 1920×1080.

### Bước 3 — Cài đặt (Adult07)
- `/parent/settings` (4 nhóm), schema Zod `src/lib/schemas/parent-settings.ts`, `src/server/parent-settings.ts` + `src/features/parent/settings-actions.ts`, hộp thoại xác nhận, kiểm tra biểu mẫu theo luật thiết kế.
- Kiểm tra: ↑/↓ chuyển 4 nhóm; giới hạn giờ lưu và `/home` + task 10 dùng ngay (hết giờ khi đặt 1 phút); khung giờ báo lỗi nếu kết thúc trước bắt đầu; đổi tên, lớp, cấp, đặt lại tiến độ, xóa hồ sơ (gõ tên) đúng dữ liệu trong DB; đổi mật khẩu và PIN kiểm tra đúng luật, PIN quá dễ bị từ chối.

## Kiểm tra cuối task
`npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`; dùng toàn bộ khu bố mẹ chỉ bằng bàn phím; 1366×768 và 1920×1080; rồi `/finish-task` (rà soát, checklist thủ công chưa tích, đóng, `/ve-so-do 11-parent-area` — workflow vào khu bố mẹ + sequence mở khóa, cập nhật `workflow-khu-nguoi-lon`, tổng quan, so-sanh.md — mục 1 về `/admin` vẫn để task 12; mô tả PR; không merge).

## Rủi ro
- Khối lượng lớn (thành phần + 3 màn): làm theo đúng thứ tự bước, mỗi bước có commit riêng.
- Bộ đếm sai nằm trong bộ nhớ tiến trình (đủ cho chạy một máy; ghi chú đã có ở `rate-limit.ts`).
- Xóa hồ sơ là vĩnh viễn (khác bản xem trước có khôi phục 30 ngày): ghi so-sanh để bạn quyết.
