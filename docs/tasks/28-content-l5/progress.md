# Tiến độ — 28-content-l5 — Nội dung cấp 5 (Cây lớn, Flyers)

Trạng thái chung: ✅ · Cập nhật lần cuối: 11/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Danh sách và chủ đề mẫu (DỪNG chờ tôi) | ✅ | `proposal.md` + chủ đề mẫu Du lịch; bạn duyệt bằng “continue” |
| 1 | Từ vựng, hình, mp3 | ✅ | 400 từ, 147 hình mới (151/400 từ có hình), mp3 400 từ + câu ví dụ |
| 2 | Bài học, truyện, bài đọc, trò chơi | ✅ | 144 câu hỏi dạng mới, 2 truyện (12 tranh), 53 bài thường + 8 trận trùm, mp3 343 câu |
| 3 | Trận trùm, bài thi lên cấp, Khám phá từ, Họ vần | ✅ | 8 trùm, bài thi 5 → 6, 30 từ Khám phá, 6 họ vần |

## Nhật ký

(Claude ghi sau mỗi bước: đã làm gì, kết quả kiểm tra, việc cần làm thủ công.)

### Bước 0 — Danh sách và chủ đề mẫu (10/10/2026)
- **Đề xuất để duyệt**: `docs/tasks/28-content-l5/proposal.md` — 8 chủ đề cấp 5 (400 từ), số hình ước tính (~160, 40 % từ có hình), bảng số câu mỗi chủ đề (5 sắp xếp, 5 điền từ, 3 nghe-gõ câu, 3 luyện nói, 2 đọc hiểu = 18 câu), 2 truyện, 8 trùm, bài thi lên cấp 5 → 6, 30 từ Khám phá, ~8 họ vần, quy tắc vốn từ.
- **Chủ đề mẫu Du lịch (`travel`) viết đầy đủ**: 52 từ (`prisma/seed/content/level-05/travel.json`), 18 câu hỏi dạng mới (`content-extra/level-05/travel.json`), 26 hình mới (`scripts/pictures/level-05-travel.mjs`, nạp qua `level-05.mjs`; luggage, flight, runway, guide, guidebook, souvenir, postcard, destination, platform, carriage, cruise, harbour, port, cabin, deck, traveller, backpack, hostel, resort, view, scenery, landmark, monument, boarding pass, seat belt, passenger). 26 từ trừu tượng không có hình (liệt kê ở `proposal.md`).
- **Mã nới cho cấp 5**: `EXTRA_LEVELS` trong `lesson-builder.ts` (trừ ghép âm: cấp 1–3), `EXPECTED[5]` và mặc định cấp 1–5 của `scripts/check-content-extra.mjs`, `LEVELS` của `scripts/report-content.mjs`, test `lesson-builder-v2.test.ts`.
- **Kiểm tra**: `node scripts/check-content.mjs 5` đạt cho travel (52/52 từ; các chủ đề chưa soạn báo thiếu tệp, đúng dự kiến); `npm run content:check-extra -- 5` 0 lỗi; `node scripts/check-pictures.mjs 5` đạt (26/52 từ travel có hình); `npx tsc --noEmit`, `npm run lint` sạch; `npm test` 688/688. Seed trên database verify: chủ đề travel `published`, 7 bài thường + 1 trận trùm (bài 1 có 21 bước: 8 thẻ từ → nghe-chọn-hình → nối cặp → chọn từ → sắp xếp → điền từ → nghe-gõ → luyện nói → đọc hiểu → mưa từ vựng). Kiểm bằng Edge không đầu (bé thử ở cấp 5, 1366×768): bản đồ cấp 5 hiện vùng Du lịch, bài 1 mở thẻ từ, bước nghe-chọn-hình hiện đúng hình mới (luggage, deck, carriage), không lỗi console, không ảnh 404. Đã xem trang xem thử 26 hình bằng mắt (souvenir, deck dễ nhầm nhất).
- **Việc bạn cần làm**: đọc `proposal.md` (mục 6 liệt kê 3 điều cần xem), xem lướt 26 hình (chạy `node scripts/gen-pictures.mjs --sheet hinh.html`) rồi nói “continue”.

### Bước 1 — Từ vựng, hình, mp3 (11/10/2026)
- **Từ vựng**: 7 chủ đề còn lại (nature-environment 54, feelings-personality 50, science-study 48, entertainment-media 46, home-household 48, future-plans 52, community-places 50) cộng Du lịch (52) = **400 từ**, mỗi từ có phiên âm, loại từ, nghĩa Việt, câu ví dụ Anh–Việt ≤ 12 từ chỉ dùng vốn từ cấp 1–5 (`prisma/seed/content/level-05/*.json`). `node scripts/check-content.mjs 5`: 400/400, đạt.
- **Hình**: 147 hình mới trong `scripts/pictures/level-05-{travel,nature,feelings,science,media,home,community}.mjs` (gộp ở `level-05.mjs`): Du lịch 26, Thiên nhiên 32, Cảm xúc 9 (nét mặt rõ nghĩa + laugh/cry/hug), Khoa học 13, Giải trí 13, Nhà cửa 39, Cộng đồng 14, Kế hoạch 1 (wedding). **151/400 từ có hình** (một số từ như fire, rocket đã có hình ở cấp trước); 249 từ trừu tượng chỉ có thẻ từ, nghe và câu: danh sách ở `thieu-hinh.md`. Đã xem từng nhóm bằng trang xem thử (Edge không đầu) và sửa hình yếu.
- **Từ trùng khung**: 9 từ trong `prisma/seed/wordlab/family-words.json` (fire, fan, glad, hit, rock, gate, soon, show, mall) nay thuộc từ vựng cấp 5 nên bỏ khỏi tệp đó (không còn từ trùng giữa các cấp: seed trên DB trống 0 từ trùng).
- **mp3**: `npm run audio:generate -- --level 5` trên DB verify: 400/400 từ (từ + câu ví dụ) trong 849 giây, 0 lỗi.
- **Kiểm tra**: `check-pictures` đạt; `report-content --strict`: cấp 5 có 400 từ, 0 từ thiếu âm thanh; seed chạy được (53 bài thường cấp 5).

### Bước 2 — Bài học, truyện, bài đọc, trò chơi (11/10/2026)
- **Câu hỏi dạng mới** (`prisma/seed/content-extra/level-05/*.json`): mỗi chủ đề 5 sắp xếp câu, 5 điền từ, 3 nghe-gõ câu, 3 luyện nói, 2 đọc hiểu = **144 câu** cho 8 chủ đề (đúng bảng ở `EXPECTED[5]`). `npm run content:check-extra -- --strict`: 5 cấp, 0 lỗi, không cần ngoại lệ vốn từ mới.
- **Truyện**: “The Lost Luggage” (Du lịch) và “The Clean Pond” (Thiên nhiên), mỗi truyện 6 trang + 1 câu hỏi giữa truyện, 12 tranh SVG vẽ bằng `gen-story-art` (cảnh trong `scripts/story-art/scenes.mjs`, dữ liệu `STORY_SEED`).
- **Bài học**: `buildLessons` bản 2 với `EXTRA_LEVELS` nới tới cấp 5: cấp 5 có 53 bài thường (Du lịch 7, các chủ đề khác 6–7) + 8 trận trùm; mọi bài có 1 trò chơi và ít nhất 1 câu hỏi dạng mới (kiểm trên DB trống: 53 bài, ít nhất 10 bước, 0 bài không có câu hỏi; `report-content --strict`: “thiếu dạng mới/trò chơi: 0”). Phát hiện khi kiểm: chia câu theo từng dạng khiến 3 bài cuối của chủ đề 7 bài chỉ có thẻ từ và trò chơi, nên từ cấp 5 các dạng chia nối tiếp nhau (`SPREAD_EXTRAS_FROM_LEVEL`, `distribute` có tham số `offset`, thêm test); cấp 1–4 giữ cách chia cũ để không đổi bài đã học.
- **mp3**: `npm run audio:generate -- --content --level 5`: 343 câu mới + âm thanh mẫu luyện nói + 12 trang truyện (498 giây), 0 lỗi; hai truyện tự xuất bản. Tổng 1051 câu đều có mp3.
- **Kiểm (Edge không đầu, DB verify, bé thử ở cấp 5, 1366×768)**: bản đồ cấp 5 có 8 vùng; bài 1 Du lịch mở thẻ từ rồi nghe-chọn-hình với hình mới (autoplay đi qua thẻ → nghe → nối → chọn từ rồi tới bước Sắp xếp); mỗi dạng sắp xếp, điền từ, nghe-gõ, đọc hiểu, luyện nói và truyện cấp 5 mở ra đúng màn, không lỗi console, mp3 theo câu được tải (ghép âm không dùng ở cấp 5).

### Bước 3 — Trận trùm, bài thi lên cấp, Khám phá từ, Họ vần (11/10/2026)
- **Trận trùm**: 8 trùm cấp 5 trong `src/lib/rules/bosses.ts` (Khỉ Du Hành, Khỉ Kiểm Lâm, Khỉ Tâm Lý, Khỉ Thí Nghiệm, Khỉ Sân Khấu, Khỉ Thợ Mộc, Khỉ Hoạch Định, Khỉ Phố Xóm; biến thể Vua Khỉ Lém, tên và dáng không trùng), test cập nhật 40 trùm; huy hiệu “Bạn của …” nạp bởi seed. Màn trùm Du lịch mở được (“Năng lượng của trùm 6/6”, không lỗi console).
- **Bài thi lên cấp 5 → 6**: `EXAM_LAST_LEVEL = 5` (`level-gate.ts`), seed `exams.ts` thêm đề cấp 5, huy hiệu “Qua đảo Cây lớn” (`LEVEL_BADGE_EN[5] = Big Tree Island`, `rewards.ts`, `reward-catalog.ts`). Kiểm bằng Edge (hồ sơ thử ở cấp 5): cổng khóa chặn gõ thẳng `/exam/5`; mọi bài xong thì giới thiệu “Cấp 5 · Cây lớn → Cấp 6, 20 câu, 8 vùng, 80%”; đề 20 câu từ 8 chủ đề (sắp xếp, chọn từ cho hình, nghe-chọn-hình, điền từ, nghe-gõ); đúng 16/20 → màn “Lên cấp rồi, Mai Linh ơi!” + 50 sao + 100 xu + huy hiệu `level:5`; `current_level_id` sang cấp 6; `/map/6` ghi “Sắp có” (“Thành phố 6 này đang được xây”, nút Mở Sổ từ); trang chủ cấp 6 không lỗi; `/exam/5` không vào lại được.
- **Khám phá từ cấp 5**: 30 danh từ cụ thể (`src/lib/rules/wordlab-data/explorer-level-05-{a,b,c}.ts`): backpack, luggage, runway, cabin, harbour, volcano, desert, jungle, planet, ocean, glacier, mosquito, pond, microscope, telescope, magnet, satellite, microphone, headphones, stage, newspaper, wardrobe, oven, ladder, fireplace, washing machine, kettle, fountain, statue, bench (146 nhánh, 4–5 nhánh mỗi từ); thêm 6 hình đáp án (`scripts/pictures/wordlab-05.mjs`: smoke, mountain, cactus, scorpion, wood, steam). `wordlab:check`: 150 từ, 0 lỗi vốn từ.
- **Họ vần cấp 5**: 6 họ (`families-l5.ts`): -ous (7 từ, bẫy house, mouse), -tion (8 từ, bẫy question), -ment (6), -ful (5, mức 3), -ture (4), -ack (5, mức 1). Ghép chữ đầu chỉ chơi được ở -ack (5 từ thật); -ous, -tion, -ment, -ful có chữ đầu dài nên không ghép được, ghi ở decisions.md.
- **mp3**: `--wordlab --level 5` 30 từ + họ vần: 180 tệp (441 giây); hai họ -ful, -ack ở mức thấp hơn tạo bằng `--wordlab`. Script đọc DB: 30/30 từ Khám phá cấp 5 và 36/36 họ vần không còn cảnh báo xuất bản (cùng hàm với Adult22/Adult23).
- **Kiểm (Edge)**: 10 từ cấp 5 đã xuất bản thử mở ở Sổ từ có 4–5 nhánh và nút nghe; họ -ous (7 thẻ, ô Bẫy chính tả có house) và -ack (5 thẻ) mở trong Sổ từ; Ghép chữ đầu -ack mở được. Dữ liệu thử đã trả về Nháp.

### Kiểm tra cuối task (11/10/2026)
- **Seed trên database trống** (`hoc_tieng_anh_verify28`: `migrate deploy` rồi `db seed`, 30 giây), chạy hai lần cho cùng số lượng: 1385 từ (400 cấp 5), 40 chủ đề đã xuất bản, 215 bài, 4222 bước, 610 câu hỏi, 10 truyện, 5 đề thi, 94 phần thưởng, 150 từ có Khám phá (749 nhánh), 36 họ (261 từ), 0 họ xuất bản, 0 từ trùng.
- `npx tsc --noEmit`, `npm run lint`, `npm test` (688/688), `npm run build`, `npm run content:check` (5 cấp, 1300 từ), `content:check-extra -- --strict`, `wordlab:check`, `check-pictures`, `check-curriculum` đều sạch.
- Spec Playwright: không thêm (không có màn mới; luồng thi dùng lại màn của task 20).

### Việc bạn cần làm thủ công
1. `npx prisma db seed` trên database thật (thêm 400 từ cấp 5, 144 câu hỏi, 2 truyện, 8 trùm, đề thi cấp 5, 30 từ Khám phá và 6 họ vần; các họ -at, -ir không đổi). Nếu database thật đã seed task 27 thì 9 từ (fire, fan, glad, hit, rock, gate, soon, show, mall) có thể còn một dòng thừa ở cấp thấp: vô hại, không cần xử lý.
2. Chạy giọng đọc (khoảng 30 phút, chạy lại được): `npm run audio:generate -- --level 5`, `npm run audio:generate -- --content --level 5`, `npm run audio:generate -- --wordlab`. Bật “Giọng mp3” ở Adult13.
3. Vào Quản trị › Từ vựng (cột Khám phá) và Quản trị › Họ vần: xem rồi xuất bản từng mục.
4. Học thử 2 bài cấp 5 và thử bài thi lên cấp (hồ sơ ở cấp 5, đã xong các bài thường); xem lướt hình, phiên âm và câu tiếng Việt (tôi soạn, chưa có người rà).
5. Chạy Playwright một lần sau khi xong mọi task (cần `npm run test:e2e:db`, tôi sẽ hỏi riêng).

## Bước tiếp theo

Task đã xong. Việc tiếp theo: kiểm tra toàn bộ nội dung cấp 1–5 trên database thật rồi chạy Playwright một lần cho các task 22–26 (cần đồng ý).
