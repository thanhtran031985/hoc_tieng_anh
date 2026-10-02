# Tiến độ — 11-parent-area — Khu vực bố mẹ: tổng quan và cài đặt

Trạng thái chung: 🔄 · Cập nhật lần cuối: 03/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Bộ thành phần khu người lớn | ✅ | `src/components/adult/` + theme `thcs` + `/dev/adult-kit` |
| 1 | Cổng vào khu bố mẹ (Adult01) | ✅ | `/parent/unlock`, khóa 5 phút ở server, `AdultPinInput` |
| 2 | Tổng quan (Adult02) | ✅ | `/parent`, `server/reports/overview.ts`, `rules/report.ts` (test 112/112) |
| 3 | Cài đặt (Adult07) | ⬜ | |

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

## Bước tiếp theo

Bước 3 — Cài đặt (Adult07)
