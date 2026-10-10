# Tiến độ — 28-content-l5 — Nội dung cấp 5 (Cây lớn, Flyers)

Trạng thái chung: 🔄 · Cập nhật lần cuối: 10/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Danh sách và chủ đề mẫu (DỪNG chờ tôi) | ✅ | Đề xuất `proposal.md`; chủ đề mẫu Du lịch viết đầy đủ (52 từ, 26 hình, 18 câu); chờ bạn duyệt |
| 1 | Từ vựng, hình, mp3 | ⬜ | |
| 2 | Bài học, truyện, bài đọc, trò chơi | ⬜ | |
| 3 | Trận trùm, bài thi lên cấp, Khám phá từ, Họ vần | ⬜ | |

## Nhật ký

(Claude ghi sau mỗi bước: đã làm gì, kết quả kiểm tra, việc cần làm thủ công.)

### Bước 0 — Danh sách và chủ đề mẫu (10/10/2026)
- **Đề xuất để duyệt**: `docs/tasks/28-content-l5/proposal.md` — 8 chủ đề cấp 5 (400 từ), số hình ước tính (~160, 40 % từ có hình), bảng số câu mỗi chủ đề (5 sắp xếp, 5 điền từ, 3 nghe-gõ câu, 3 luyện nói, 2 đọc hiểu = 18 câu), 2 truyện, 8 trùm, bài thi lên cấp 5 → 6, 30 từ Khám phá, ~8 họ vần, quy tắc vốn từ.
- **Chủ đề mẫu Du lịch (`travel`) viết đầy đủ**: 52 từ (`prisma/seed/content/level-05/travel.json`), 18 câu hỏi dạng mới (`content-extra/level-05/travel.json`), 26 hình mới (`scripts/pictures/level-05-travel.mjs`, nạp qua `level-05.mjs`; luggage, flight, runway, guide, guidebook, souvenir, postcard, destination, platform, carriage, cruise, harbour, port, cabin, deck, traveller, backpack, hostel, resort, view, scenery, landmark, monument, boarding pass, seat belt, passenger). 26 từ trừu tượng không có hình (liệt kê ở `proposal.md`).
- **Mã nới cho cấp 5**: `EXTRA_LEVELS` trong `lesson-builder.ts` (trừ ghép âm: cấp 1–3), `EXPECTED[5]` và mặc định cấp 1–5 của `scripts/check-content-extra.mjs`, `LEVELS` của `scripts/report-content.mjs`, test `lesson-builder-v2.test.ts`.
- **Kiểm tra**: `node scripts/check-content.mjs 5` đạt cho travel (52/52 từ; các chủ đề chưa soạn báo thiếu tệp, đúng dự kiến); `npm run content:check-extra -- 5` 0 lỗi; `node scripts/check-pictures.mjs 5` đạt (26/52 từ travel có hình); `npx tsc --noEmit`, `npm run lint` sạch; `npm test` 688/688. Seed trên database verify: chủ đề travel `published`, 7 bài thường + 1 trận trùm (bài 1 có 21 bước: 8 thẻ từ → nghe-chọn-hình → nối cặp → chọn từ → sắp xếp → điền từ → nghe-gõ → luyện nói → đọc hiểu → mưa từ vựng). Kiểm bằng Edge không đầu (bé thử ở cấp 5, 1366×768): bản đồ cấp 5 hiện vùng Du lịch, bài 1 mở thẻ từ, bước nghe-chọn-hình hiện đúng hình mới (luggage, deck, carriage), không lỗi console, không ảnh 404. Đã xem trang xem thử 26 hình bằng mắt (souvenir, deck dễ nhầm nhất).
- **Việc bạn cần làm**: đọc `proposal.md` (mục 6 liệt kê 3 điều cần xem), xem lướt 26 hình (chạy `node scripts/gen-pictures.mjs --sheet hinh.html`) rồi nói “continue”.

## Bước tiếp theo

Chờ bạn duyệt `proposal.md` và chủ đề mẫu Du lịch (nói “continue”), rồi Bước 1 — Từ vựng, hình, mp3 của 7 chủ đề còn lại.
