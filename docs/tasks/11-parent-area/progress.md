# Tiến độ — 11-parent-area — Khu vực bố mẹ: tổng quan và cài đặt

Trạng thái chung: ✅ · Cập nhật lần cuối: 03/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Bộ thành phần khu người lớn | ✅ | `src/components/adult/` + theme `thcs` + `/dev/adult-kit` |
| 1 | Cổng vào khu bố mẹ (Adult01) | ✅ | `/parent/unlock`, khóa 5 phút ở server, `AdultPinInput` |
| 2 | Tổng quan (Adult02) | ✅ | `/parent`, `server/reports/overview.ts`, `rules/report.ts` (test 112/112) |
| 3 | Cài đặt (Adult07) | ✅ | `/parent/settings` 4 nhóm, `server/parent-settings.ts`, test 118/118 |

## Nhật ký

### Bước 0 — Bộ thành phần khu người lớn (03/10/2026)
- Đã làm: khối `[data-theme="thcs"]` trong `globals.css` (chỉ áp trong vùng `AdultArea`), thang chữ `--text-adm-*` và token kích thước `--adm-*`; 34 icon khu người lớn trong `ui/Icon/icon-paths.ts`; `src/components/adult/`: `AdultArea`, `AdultShell` (menu tối, chuyển Bố mẹ/Quản trị, bộ chọn con `?kid=`, hộp thoại "Về màn chọn hồ sơ"), `Kpi`, `Status`, `AdultButton/Link/IconButton`, `AdultInput/Select/Textarea`, `AdultSegmented`, `AdultToggle`, `AdultDialog`, `AdultDrawer`, `ToastProvider/useToast`, `AdultSkeleton/Empty/Error`, `AdultTable`, biểu đồ `VBars`, `HBars`, `LineChart` (tooltip khi rê chuột/Tab); trang thử `/dev/adult-kit`.
- Kết quả kiểm tra (CDP, 1366×768): trang thử hiện đủ thành phần; hộp thoại khóa Tab, Esc đóng và trả focus; ngăn kéo focus vào ô đầu, Esc đóng; toast hiện; bảng tìm/lọc/sắp xếp/phân trang; viền focus thấy được; màn Tiểu học không đổi (theme chỉ áp trong `AdultArea`); `tsc`, `lint`, `npm test` 103/103, `build` sạch.
- Việc tôi cần làm thủ công: không.

### Bước 1 — Cổng vào khu bố mẹ (03/10/2026)
- Đã làm: route `/parent/unlock` (nhóm `(adult-gate)`, chỉ cần đăng nhập) với `GateForm` (thẻ Mã PIN / Mật khẩu, PIN 6 ô `AdultPinInput`, nút hiện/ẩn mật khẩu, lỗi dưới ô kèm số lần còn lại, trống = chưa có PIN chỉ có mật khẩu + hướng dẫn tạo PIN, lỗi mạng giữ nguyên dữ liệu + Thử lại), `loading.tsx`, `error.tsx`; `checkParentSecret(userId, secret, method)` trả `remaining`, `PIN_LIMIT` = 5 lần / 5 phút, `attemptsLeft`, `secondsLeft` ở `rate-limit.ts`; `unlockParentAction(secret, method)` và `lockParentAreaAction`; `requireParentGate` chuyển về `/parent/unlock`; nút "Bố mẹ" ở `/profiles` thành liên kết (bỏ `ParentGate.tsx`).
- File tạo/sửa: `src/app/(adult-gate)/*`, `src/features/parent/{GateForm.tsx,gate.module.css,actions.ts}`, `src/components/adult/AdultPinInput.tsx`, `src/server/{parent-secret,rate-limit,parent-gate}.ts`, `src/app/(kid)/profiles/page.tsx`.
- Kết quả kiểm tra (DB tạm, CDP): `/parent` chưa mở khóa → `/parent/unlock`; PIN 2 số báo "cần ít nhất 4 số"; PIN sai báo "Còn 4 lần…"; PIN đúng vào `/parent`; mật khẩu sai/đúng; chưa có PIN chỉ có ô mật khẩu + hướng dẫn; mất mạng báo lỗi, bật mạng Thử lại vào được; sai 5 lần báo khóa 5 phút, tải lại trang nhập PIN đúng vẫn bị khóa; ô nhập lấy lại focus sau lần sai; `tsc`, `lint`, `npm test` 103/103, `build` sạch.
- Việc tôi cần làm thủ công: không.

### Bước 2 — Tổng quan (03/10/2026)
- Đã làm: hàm thuần `src/lib/rules/report.ts` + test (`lastDays`, `minutesPerDay`, `compareWeeks` cùng khoảng T2→cùng thứ, `formatDelta`, `cefrForLevel` theo PRD A1, `percentDone`, `activityWhen`); `src/server/reports/overview.ts` (`getOverview` qua `requireLearner`: phút tuần, chuỗi ngày, từ đã thuộc, cấp + % hoàn thành, CEFR, chuỗi 7/30 ngày, hoạt động gần đây từ bài đã xong, phiên ôn, bài xếp lớp); khung `ParentFrame` ở `(parent)/layout.tsx` (menu, chọn con `?kid=`, giữ nguyên khi tải); `/parent` với `OverviewView` (5 thẻ số liệu, biểu đồ 7/30 ngày có đường giới hạn nét đứt, hoạt động gần đây), `loading.tsx`, `error.tsx`, trạng thái trống (con chưa học; chưa có hồ sơ con); `LogoutIconButton`.
- File tạo/sửa: `src/lib/rules/report.ts(+test)`, `src/server/reports/overview.ts`, `src/features/parent/{ParentFrame,OverviewView,kid-select,overview.module.css}`, `src/app/(parent)/{layout.tsx,parent/*}`, `src/features/auth/LogoutIconButton.tsx`, `src/components/adult/charts/VBars.tsx`.
- Kết quả kiểm tra (DB tạm, CDP): Mai (30 ngày dữ liệu): 108 phút, −3% so với tuần trước, chuỗi 9 ngày, 2/12 từ đã thuộc, Cấp 1 · 3%, CEFR Pre-A1; biểu đồ 7 và 30 ngày có đường "Giới hạn 30 phút" nét đứt, trung bình 20 phút/ngày; hoạt động gần đây có bài đã xong và phiên ôn; chọn con bằng ← → đổi số liệu (Minh chưa học: trạng thái trống); `?kid=99` (hồ sơ tài khoản khác) bị bỏ qua; 1366×768 và 1920×1080 không cuộn trang; `tsc`, `lint`, `npm test` 112/112, `build` sạch.
- Việc tôi cần làm thủ công: không.

### Bước 3 — Cài đặt (03/10/2026)
- Đã làm: luật kiểm biểu mẫu `src/lib/rules/parent-settings.ts` + test (khung giờ, tên, mật khẩu, PIN dễ đoán); schema Zod `src/lib/schemas/parent-settings.ts`; `src/server/parent-settings.ts` (`saveStudyTime`, `saveAppearance`, `renameLearner`, `changeGrade`, `changeLevel`, `resetProgress` trong transaction, `deleteLearner` gõ đúng tên, `changePassword`, `changeParentPin`; đều qua `requireLearner`/`checkParentSecret`); `settings-actions.ts` (`requireParentGate` + `revalidatePath`); `SettingsView` 4 nhóm (↑/↓ chuyển) với `TimePanel`, `AppearancePanel`, `ProfilesPanel` (hộp thoại xác nhận), `SecurityPanel`; `/parent/settings` có loading/error/trạng thái trống; sửa kèm token khoảng cách không tồn tại (`--space-9/20/24`).
- File tạo/sửa: `src/lib/rules/parent-settings.ts(+test)`, `src/lib/schemas/parent-settings.ts`, `src/server/parent-settings.ts`, `src/features/parent/{Settings*,TimePanel,AppearancePanel,ProfilesPanel,SecurityPanel,settings-*.ts,use-save.ts,settings.module.css}`, `src/app/(parent)/parent/settings/*`.
- Kết quả kiểm tra (DB tạm, CDP): ↑/↓ chuyển đủ 4 nhóm; giới hạn 15 phút + khung giờ 17:00–20:30 lưu vào `learners.settings` (task 10 đọc `dailyLimitMinutes`); giờ kết thúc trước bắt đầu báo lỗi dưới ô; giao diện THCS, giọng UK, tốc độ chậm lưu đúng; đổi tên (tên có số bị từ chối), đổi lớp, đổi cấp, đặt lại tiến độ (thẻ ôn, phiên, sao, xu về 0), xóa hồ sơ (gõ sai tên bị từ chối, gõ đúng thì xóa) đều đúng trong DB; mật khẩu (sai luật, mật khẩu hiện tại sai, đổi đúng) và PIN (dễ đoán bị từ chối, PIN hiện tại sai, đổi đúng) đúng luật; 1366×768 không cuộn; `tsc`, `lint`, `npm test` 118/118, `build` sạch.
- Việc tôi cần làm thủ công: không.

### Rà soát cuối task (03/10/2026)
| Mục | Đánh giá | Bằng chứng |
|---|---|---|
| Bộ thành phần khu người lớn dùng token, tách khỏi bộ Tiểu học, theme `thcs` không đổi màu Tiểu học | ✅ | `src/components/adult/`, khối `[data-theme="thcs"]`, `/dev/adult-kit` |
| Biểu đồ SVG tự dựng, không thư viện | ✅ | `charts/{VBars,HBars,LineChart}.tsx`; không thêm package |
| Cổng Adult01: PIN 6 ô, tab mật khẩu, lỗi dưới ô, sai 5 lần khóa 5 phút ở server, chưa có PIN chỉ mật khẩu | ✅ | `GateForm.tsx`, `parent-secret.ts`, `rate-limit.ts:48`; đã thử cả tải lại khi đang khóa |
| Tổng quan Adult02: phút tuần so tuần trước, chuỗi ngày, từ đã thuộc, cấp + %, biểu đồ 7/30 ngày có đường giới hạn nét đứt, hoạt động gần đây, 4 trạng thái, chỉ xem được con của mình | ✅ | `overview.ts`, `OverviewView.tsx`, `?kid=` lạ bị bỏ qua |
| Cài đặt Adult07: 4 nhóm ↑/↓, giới hạn giờ lưu `learners.settings` (task 10 dùng), khung giờ báo lỗi, đổi tên/lớp/cấp, đặt lại tiến độ, xóa (gõ tên), đổi mật khẩu và PIN | ✅ | `SettingsView.tsx`, `server/parent-settings.ts`; đã thử từng thao tác và đối chiếu DB |
| Hành động nguy hiểm qua hộp thoại, trong transaction | ✅ | `ProfilesPanel.tsx`, `resetProgress` dùng `$transaction` |
| Zod cho mọi ghi DB; mọi action kiểm đăng nhập + cổng + hồ sơ thuộc tài khoản | ✅ | `schemas/parent-settings.ts`, `settings-actions.ts` (`requireParentGate`), `requireLearner` |
| Mật khẩu/PIN băm bcrypt, không lộ ra client | ✅ | `parent-settings.ts` (bcrypt cost 12) |
| Không hex/px cố định; token thiếu thêm vào `globals.css` | ✅ | đã quét; `--text-adm-*`, `--adm-*` mới |
| 1366×768 và 1920×1080 không cuộn trang; dùng được bằng bàn phím | ✅ | đo Tổng quan, Cài đặt, cổng; ↑/↓ nhóm cài đặt, ← → chọn con, Tab thấy viền focus |
| Khác task.md/thiết kế | ⚠️ | bỏ vài mục Adult07 chưa có dữ liệu, xóa vĩnh viễn, không "Quên mật khẩu?" — đã ghi decisions.md và so-sanh.md (29–32) |
- `npx tsc --noEmit`, `npm run lint`, `npm test` (118/118), `npm run build` đều sạch (03/10/2026).

## Bước tiếp theo

Hoàn thành. Checklist test thủ công bên dưới do bạn tự test sau khi đóng task (chưa tích).

### Checklist test thủ công (bạn test sau khi đóng task, chưa tích)
Chuẩn bị: `npm run dev`, đăng nhập tài khoản gia đình có vài hồ sơ con đã học. Muốn thấy số liệu thật hãy học vài bài trước (hoặc chèn `study_sessions`).
- [ ] Ở màn chọn hồ sơ bấm "Bố mẹ" mở cổng riêng; gõ PIN sai báo "Còn N lần thử" dưới ô; sai 5 lần báo khóa 5 phút, tải lại trang vẫn bị khóa; chưa có PIN chỉ có ô mật khẩu và gợi ý tạo PIN.
- [ ] PIN/mật khẩu đúng vào Tổng quan; Enter mở khóa; "Về màn chọn hồ sơ" hỏi xác nhận rồi khóa lại (vào `/parent` lại thì phải nhập PIN).
- [ ] Tổng quan: đổi con ở thanh trên (← →) thì số liệu đổi; phút tuần so tuần trước; biểu đồ 7/30 ngày có đường giới hạn nét đứt khi đã đặt giới hạn; rê chuột hoặc Tab vào cột xem số phút; con chưa học thì trạng thái trống; hoạt động gần đây có bài đã xong và phiên ôn.
- [ ] Cài đặt › Thời gian học: chọn 15 phút rồi Lưu; vào app của bé thấy "Hôm nay: x/15 phút · còn N phút"; học hết 15 phút thì ra màn Hết giờ học; khung giờ đặt giờ kết thúc trước giờ bắt đầu thì báo lỗi dưới ô.
- [ ] Giao diện & âm thanh: Nghe thử đọc câu mẫu theo giọng và tốc độ đã chọn; lưu xong tải lại vẫn giữ.
- [ ] Hồ sơ của con: đổi tên (tên có số bị từ chối), đổi lớp, đổi cấp (bản đồ của bé đổi theo), đặt lại tiến độ (sao, xu, từ ôn về 0), xóa hồ sơ phải gõ đúng tên có dấu; thử với hồ sơ phụ trước.
- [ ] Mật khẩu & mã PIN: mật khẩu mới cần ≥ 8 ký tự có chữ và số, nhập lại phải khớp; PIN 1234 hoặc 1111 bị từ chối; PIN hiện tại sai báo lỗi; đổi xong dùng PIN mới ở cổng.
- [ ] Dùng toàn bộ khu bố mẹ chỉ bằng bàn phím (Tab, ↑/↓ trong nhóm cài đặt, Esc đóng hộp thoại) ở 1366×768 và 1920×1080.
