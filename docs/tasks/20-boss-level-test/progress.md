# Tiến độ — 20-boss-level-test — Trận trùm, bài thi lên cấp và rồng Bông lớn lên

Trạng thái chung: 🔄 · Cập nhật lần cuối: 10/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Trùm cho từng vùng (DỪNG chờ tôi) | ✅ | Tự duyệt theo ủy quyền “làm liền, không hỏi” |
| 1 | Trận trùm (Screen33) | ✅ | Tự duyệt; Edge 17/17 đạt |
| 2 | Bản đồ có cổng (Screen34) | ✅ | Tự duyệt; Edge 17/17 đạt |
| 3 | Bài thi lên cấp (Screen35–37) | ⬜ | |
| 4 | Rồng Bông theo cấp | ⬜ | |
| 5 | Điều chỉnh độ khó trong bài | ⬜ | |

## Nhật ký

(Claude ghi sau mỗi bước: đã làm gì, kết quả kiểm tra, việc cần làm thủ công.)

**10/10/2026 — Bước 0.** Đề xuất và tự duyệt 32 trùm cho 32 vùng (chủ đề) cấp 1–4: `src/lib/rules/bosses.ts` (tên “Khỉ …”, vùng Con vật là Vua Khỉ Lém đội vương miện; mỗi trùm một cặp (màu lông 1–6, phụ kiện trong 14 kiểu: vương miện, mũ đầu bếp, mũ lưỡi trai, kính, tai nghe, nơ, mũ bảo hiểm, mũ nồi, mũ chóp cao, hoa, mũ tiệc, khăn hải tặc, mũ tốt nghiệp, băng đô) không trùng nhau). Không vẽ nhân vật mới: `BossArt` vẽ lại Vua Khỉ Lém của thiết kế (3 biểu cảm: thách đấu, trúng chiêu, làm bạn) và đổi màu lông bằng token mới `boss-fur-1…6`/`boss-face-1…6` (ở `globals.css`), phụ kiện bằng SVG. Trang xem thử `/dev/boss` (chỉ chạy khi phát triển) hiện cả 32 trùm. Kiểm: test (32 trùm, tên và dáng duy nhất, đủ mọi chủ đề cấp 1–4); ảnh chụp Edge của 32 trùm đẹp, không cuộn; tsc, lint sạch.

**10/10/2026 — Bước 1.** Trận trùm (Screen33): migration `20261010042713_rewards` (bảng `rewards`, `learner_rewards`) + `prisma/seed/rewards.ts` (32 huy hiệu “Bạn của …” + 4 huy hiệu “Qua đảo …”); builder bản 2 dựng trận trùm 6 câu trộn (`BOSS_STEP_COUNT`, test), seed dựng lại trận trùm chưa có lượt đấu ở chủ đề đã học; `awardReward` (`server/rewards.ts`), `completeLesson` thưởng trùm cố định 30 xu mỗi lần thắng + huy hiệu một lần, trả `badge`; `LessonPlay.boss`; `LessonPlayer` có lớp phủ thách đấu “Trận trùm: <tên>” (Enter bắt đầu), `BossStrip` (thanh “Năng lượng của trùm” luôn kèm n/6, trùm lắc khi đúng, trêu nhẹ khi từng sai, không có màn thua); `LessonEnd` hiện trùm làm bạn cạnh Bông, “cười toe” và hàng huy hiệu. Kiểm (Edge, DB verify, `.tmp-verify/check-20-boss.mjs`, 17/17): lớp phủ, 6/6 → 5/6 sau câu sai-rồi-làm-lại có lời trêu, 4/6 có lời trúng chiêu, màn thắng + “+30 xu” + “Huy hiệu mới: Bạn của Khỉ Đồng Hồ”, database xu +30 và 1 dòng `learner_rewards`, đấu lại +30 xu không thêm huy hiệu, bản đồ ghi “đã thắng”, không cuộn ở 1920×1080, không lỗi console. tsc, lint, `npm test` (450 đạt), build sạch. Token mới không thêm (đã thêm ở Bước 0).
Việc thủ công: `npx prisma migrate deploy` rồi `npx prisma db seed` (nạp phần thưởng, dựng lại trận trùm chưa đấu).

**10/10/2026 — Bước 2.** Bản đồ có cổng (Screen34): hàm thuần `levelGateState` (`src/lib/rules/level-gate.ts`, test: còn vùng thì khóa và đếm đúng, xong hết thì mở, cấp trống khóa, `hasLevelExam` chỉ cấp 1–4); `getIslandMap` trả `gate` (trạng thái, các vùng xong/còn thiếu kèm số chặng còn, tên cấp kế, bài “Học tiếp”, đường vào bài thi; null ở cấp bé đã qua hoặc cấp không có bài thi); `requireOpenExamGate` (server) + trang `/exam/[level]` chặn ở server khi cổng khóa, cấp còn khóa hoặc cấp đã qua (trang bài thi chỉ là chỗ giữ, Bước 3 làm thật); component `LevelGate` (`src/components/ui/LevelGate`, SVG đá cổng/ổ khóa/lấp lánh theo thiết kế, `aria-disabled` + aria-label đọc được, có chữ “Còn N vùng”/“Bài thi lên cấp”); `IslandMap` vẽ cổng ở cuối đường đảo của trang cuối, thẻ cổng bên phải cổng (khóa: liệt kê 8 vùng ✓/🔒 + “còn N chặng” + Học tiếp; mở: 20 câu · Không đếm giờ · Cần đúng 80% · Thi lại được + Vào bài thi, Enter dùng được); `gatePoint` trong `island-layout.ts` (+ test); khung xương cổng ở `loading.tsx`. Kiểm (Edge, DB verify, `.tmp-verify/check-20-gate.mjs`, 17/17): aria-label cổng khóa/mở, nhãn có chữ, thẻ khóa đúng 1 vùng thiếu + Enter mở bài Học tiếp, thẻ mở + Enter vào `/exam/3`, gõ thẳng `/exam/3` khi khóa về `/map/3`, `/exam/4` (cấp còn khóa) về `/levels`, `/exam/2` (cấp đã qua) về `/map/2`, không cuộn ở 1366×768 và 1920×1080, cổng nhận focus, không lỗi console. tsc, lint, `npm test` (459 đạt), build sạch. Không thêm token (dùng `gate-*` có sẵn).

## Bước tiếp theo

Bước 3 — Bài thi lên cấp (Screen35–37)
