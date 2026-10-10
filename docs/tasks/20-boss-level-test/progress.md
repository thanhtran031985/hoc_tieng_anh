# Tiến độ — 20-boss-level-test — Trận trùm, bài thi lên cấp và rồng Bông lớn lên

Trạng thái chung: 🔄 · Cập nhật lần cuối: 10/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Trùm cho từng vùng (DỪNG chờ tôi) | ✅ | Tự duyệt theo ủy quyền “làm liền, không hỏi” |
| 1 | Trận trùm (Screen33) | ⬜ | |
| 2 | Bản đồ có cổng (Screen34) | ⬜ | |
| 3 | Bài thi lên cấp (Screen35–37) | ⬜ | |
| 4 | Rồng Bông theo cấp | ⬜ | |
| 5 | Điều chỉnh độ khó trong bài | ⬜ | |

## Nhật ký

(Claude ghi sau mỗi bước: đã làm gì, kết quả kiểm tra, việc cần làm thủ công.)

**10/10/2026 — Bước 0.** Đề xuất và tự duyệt 32 trùm cho 32 vùng (chủ đề) cấp 1–4: `src/lib/rules/bosses.ts` (tên “Khỉ …”, vùng Con vật là Vua Khỉ Lém đội vương miện; mỗi trùm một cặp (màu lông 1–6, phụ kiện trong 14 kiểu: vương miện, mũ đầu bếp, mũ lưỡi trai, kính, tai nghe, nơ, mũ bảo hiểm, mũ nồi, mũ chóp cao, hoa, mũ tiệc, khăn hải tặc, mũ tốt nghiệp, băng đô) không trùng nhau). Không vẽ nhân vật mới: `BossArt` vẽ lại Vua Khỉ Lém của thiết kế (3 biểu cảm: thách đấu, trúng chiêu, làm bạn) và đổi màu lông bằng token mới `boss-fur-1…6`/`boss-face-1…6` (ở `globals.css`), phụ kiện bằng SVG. Trang xem thử `/dev/boss` (chỉ chạy khi phát triển) hiện cả 32 trùm. Kiểm: test (32 trùm, tên và dáng duy nhất, đủ mọi chủ đề cấp 1–4); ảnh chụp Edge của 32 trùm đẹp, không cuộn; tsc, lint sạch.

## Bước tiếp theo

Bước 1 — Trận trùm (Screen33)
