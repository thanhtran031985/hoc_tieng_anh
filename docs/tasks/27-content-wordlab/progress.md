# Tiến độ — 27-content-wordlab — Nội dung Khám phá từ và Họ vần

Trạng thái chung: ✅ · Cập nhật lần cuối: 10/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Danh sách và mẫu (DỪNG chờ tôi) | ✅ | Đã viết đề xuất và mẫu; chờ bạn duyệt `proposal.md` trước khi sang bước 1 |
| 1 | Khám phá từ cấp 3–4 | ✅ | 57 từ mới (cấp 3: 29, cấp 4: 28) + 3 mẫu; 16 hình mới; mp3 đã tạo trên DB verify |
| 2 | Khám phá từ cấp 1–2 | ✅ | 56 từ mới (cấp 1: 27, cấp 2: 29) + 4 mẫu; 10 hình mới; mp3 đã tạo trên DB verify |
| 3 | Họ vần | ✅ | 30 họ (4 mẫu + 26), 94 từ thêm vào kho; mp3 đoạn văn đã tạo trên DB verify |

## Nhật ký

### Bước 0 — Danh sách và mẫu (10/10/2026)
- **Đề xuất để duyệt**: `docs/tasks/27-content-wordlab/proposal.md` — 120 từ Khám phá (30 mỗi cấp 1–4), 30 họ vần, quy tắc vốn từ, số hình cần vẽ, các điểm cần bạn quyết.
- **5 từ mẫu viết đầy đủ** (5 nhánh trở lên, đáp án + hình, hình nhiễu, đoạn văn có dịch): apple (cấp 1, bộ Đồ ăn), dolphin (cấp 2, Con vật), bus (cấp 3, Đồ vật), doctor (cấp 4, Nghề nghiệp), library (cấp 4, Nơi chốn). Dữ liệu ở `src/lib/rules/wordlab-data/explorer-level-0N.ts`; `word-explorer-data.ts` gộp cùng hai mẫu bird, cat của thiết kế (kiểu và hàm `ans/dis/sent/branch` ở `wordlab-data/helpers.ts`).
- **3 họ mẫu**: -at (mở rộng 10 từ cùng âm, bẫy eat, what), -ake (7 từ, không bẫy), -ight (8 từ, bẫy eight, weight, straight); họ -ir (thiết kế) thêm dirt, first, third. Ở `wordlab-data/families.ts` và `word-family-data.ts`.
- **Từ thêm vào kho** cho họ vần: `prisma/seed/wordlab/family-words.json` (14 từ: mat, rat, sat, that, chat, bake, wake, first, third, dirt, fire, tight, might, sight) + schema `src/lib/schemas/wordlab-words.ts` + `prisma/seed/wordlab.ts` (`seedWordLabWords`, gọi trong `prisma/seed.ts` trước họ vần). Không có hình, không thuộc chủ đề nào.
- **Hình mới** (5): fin, seat, stethoscope, librarian, borrow trong `scripts/pictures/wordlab-02/03/04.mjs`; `gen-pictures.mjs` nạp thêm nhóm `wordlab-NN`, `check-pictures.mjs` kiểm cùng yêu cầu như hình từ vựng. Đã xem bằng Edge không đầu.
- **Script kiểm** `scripts/check-wordlab.mjs` (`npm run wordlab:check`) + `prisma/seed/wordlab/allowed-wordlab.json` (hiện có “color”) + test `src/lib/rules/wordlab-data.test.ts`.
- **Kiểm tra**: `npm run wordlab:check` đạt (7 từ, 4 họ; in rõ -ir ghép 3 từ thật), `node scripts/check-pictures.mjs` đạt, `npm test` 687/687, `npx tsc --noEmit` và `npm run lint` sạch; seed hai lần trên database verify không nhân đôi (lần đầu: 5 từ Khám phá, 14 từ kho, 2 họ mới).
- **Việc bạn cần làm**: đọc `proposal.md`, trả lời mục 8 (duyệt danh sách, quy tắc vốn từ, từ họ vần không hình) rồi nói “continue”.

### Bước 1 — Khám phá từ cấp 3–4 (10/10/2026)
- **Nội dung**: 30 từ cấp 3 (bus mẫu + 29 từ: taxi, ship, helicopter, suitcase, tent, map, beach, island, lake, forest, farm, guitar, piano, camera, noodle, pancake, cookie, mushroom, fork, spoon, knife, football, tennis, skateboard, moon, sun, tree, flower, cloud) và 30 từ cấp 4 (doctor, library mẫu + 28 từ: museum, cinema, hospital, bank, supermarket, bakery, zoo, castle, stadium, nurse, farmer, firefighter, chef, astronaut, vet, postman, laptop, mobile phone, keyboard, wallet, medicine, ambulance, dragon, pirate, treasure, crown, knight, ghost). Mỗi từ 5 nhánh theo bộ câu hỏi mẫu (đáp án có hình và nghĩa Việt, 1–2 hình nhiễu, một câu trong đoạn văn kèm dịch). Dữ liệu ở `src/lib/rules/wordlab-data/explorer-level-03*.ts`, `explorer-level-04*.ts`.
- **Hình mới (16)**: propeller, handle, strings, keys, lens, stem, mushroom-stem, petals, helmet (cấp 3); dinosaur, popcorn, tractor, fire, hose, rocket, letter (cấp 4) trong `scripts/pictures/wordlab-03.mjs`, `wordlab-04.mjs`. Đã xem bằng Edge không đầu. Đáp án còn lại dùng lại hình từ vựng sẵn có.
- **Giọng đọc**: thêm `--wordlab` vào `npm run audio:generate` (`src/lib/rules/audio-cli.ts` + test, `scripts/audio-generate.mjs`): với từng từ có Khám phá tạo mp3 cho đáp án chưa có tệp và đoạn văn, rồi đoạn văn vui của họ vần; dùng đúng `generateExplorerAudio` / `generateFamilyAudio` của màn soạn. `--level N`, `--limit`, `--dry-run`, `--force` như các chế độ khác. Chạy trên DB verify: cấp 3 (181 tệp, 576 giây) và cấp 4 (180 tệp, 523 giây), 0 lỗi.
- **Kiểm tra**: `npm run wordlab:check` đạt (không từ ngoài cấp, không thiếu hình); script đọc dữ liệu từ DB verify cho thấy 30/30 từ cấp 3 và 30/30 từ cấp 4 không còn lý do chưa xuất bản (cùng hàm `explorerIssues` với cảnh báo đầu ngăn kéo Adult22); `node scripts/check-pictures.mjs` đạt; `npm test` 688/688; `tsc`, `lint` sạch; seed hai lần không nhân đôi.
- **Việc bạn cần làm sau cả task**: `npx prisma db seed` rồi `npm run audio:generate -- --wordlab` trên database thật (khoảng 10 phút mỗi cấp), vào Quản trị › Từ vựng mở từng từ, xem rồi xuất bản.

### Bước 2 — Khám phá từ cấp 1–2 (10/10/2026)
- **Nội dung**: 30 từ cấp 1 (bird, cat của thiết kế, apple mẫu + 27 từ: dog, fish, duck, rabbit, horse, cow, pig, frog, bee, butterfly, bear, monkey, elephant, lion, snake, banana, orange, strawberry, ball, kite, car, train, bike, book, bed, chair, teddy) và 30 từ cấp 2 (dolphin mẫu + 29 từ: penguin, panda, zebra, owl, whale, kangaroo, wolf, hand, eye, nose, tooth, shirt, hat, shoe, jacket, sock, egg, bread, milk, cake, pizza, carrot, tomato, cheese, kitchen, garden, key, pencil, scissors). Dữ liệu ở `src/lib/rules/wordlab-data/explorer-level-01*.ts`, `explorer-level-02*.ts`. Câu hỏi chỉ dùng từ của cấp 1–2 (“put on” thay “wear”, “What is … like?” thay “What shape…”).
- **Hình mới (10)**: mane, horns, trunk, peel, pages (cấp 1); bamboo, smell, button, candles, smile (cấp 2) trong `scripts/pictures/wordlab-01.mjs`, `wordlab-02.mjs`. Đã xem bằng Edge không đầu (trunk vẽ lại thành mặt voi vì bản đầu khó nhận ra).
- **Giọng đọc**: `npm run audio:generate -- --level 1 --wordlab` và `--level 2 --wordlab` trên DB verify: 184 và 190 tệp, 0 lỗi (mỗi lần ~8 phút).
- **Kiểm tra**: `npm run wordlab:check` đạt cho cả 120 từ; script đọc DB verify cho thấy 30/30 từ cấp 1 và 30/30 từ cấp 2 không còn lý do chưa xuất bản (cùng hàm `explorerIssues` với Adult22); `node scripts/check-pictures.mjs` đạt; `npm test` 688/688; seed chạy lại không nhân đôi.

### Bước 3 — Họ vần (10/10/2026)
- **Nội dung**: 30 họ vần, mỗi họ có chữ đầu nhiễu, đoạn văn vui 2 câu kèm dịch và (nếu có) lời Bông giải thích ô Bẫy chính tả: -at, -ir (thiết kế, mở rộng ở task 26–27), -ake, -ight (mẫu Bước 0) và 26 họ mới: -an, -ad, -en, -et, -ig, -in, -ip, -it, -ick, -og, -op, -ock, -uck, -ate, -ame, -ice, -eep, -oat, -ay, -ook, -oon, -ow, -all, -ing, -ar, -ee. Dữ liệu ở `src/lib/rules/wordlab-data/families.ts` và `families-more.ts`. Họ có Bẫy: -at, -ir, -ight, -an, -ad, -en, -et, -in, -it, -ate, -ice, -ow, -ar, -ee (ví dụ rain/train cho -in, cow/now cho -ow, bear/pear/ear cho -ar).
- **Từ thêm vào kho**: `prisma/seed/wordlab/family-words.json` có 94 từ (không hình, không thuộc bài), nạp bởi `seedWordLabWords` trước `seedWordFamilies`.
- **Ghép chữ đầu**: 28/30 họ có ≥ 5 từ thật; **ít hơn 5: -ir (3: shirt, skirt, dirt) và -oon (4: moon, spoon, soon, noon)**; hai họ này vẫn chơi được (mục tiêu = số từ thật). Họ nhiều nhất: -at (10), -ow (9).
- **Sửa nhỏ ở quy tắc**: `soundMatches` (gợi ý cùng âm khi soạn Adult23) không coi /ɪn/ trong nguyên âm đôi /eɪn/ là cùng âm (rain, train, coin là Bẫy chứ không phải từ cùng âm); thêm 3 phép thử.
- **Giọng đọc**: `npm run audio:generate -- --wordlab` tạo 30 đoạn văn vui (trên DB verify, 0 lỗi).
- **Kiểm tra**: `npm run wordlab:check` đạt (mọi họ ≥ 3 từ cùng âm, mọi từ có trong kho, IPA khớp, chữ đầu nhiễu không trùng); script đọc DB verify cho thấy 30/30 họ không còn lý do chưa xuất bản (cùng hàm `familyIssues` với Adult23); `npm test` 688/688.

### Kiểm tra cuối task (10/10/2026)
- **Seed trên database trống** (`hoc_tieng_anh_verify27`: `prisma migrate deploy` rồi `prisma db seed`, 24 giây): 994 từ, 120 từ có Khám phá (603 nhánh), 150 đoạn văn, 30 họ (223 từ trong họ), không mục nào xuất bản. Chạy seed lần hai: số lượng không đổi.
- **Xuất bản 10 từ và 2 họ trên DB verify rồi bé thử ở Sổ từ** (Edge không đầu, 1366×768): dog, apple, penguin, hat, pizza, bus, camera, doctor, library, dragon đều mở tab Khám phá với 5–6 nhánh và đủ nút nghe; snake và night mở tab Họ vần (-ake 7 thẻ, -ight 8 thẻ); màn Họ vần -ight có ô Bẫy chính tả (eight); Ghép chữ đầu của -ake mở được. Dữ liệu đã trả về Nháp sau khi thử.
- `npx tsc --noEmit`, `npm run lint`, `npm test` (688/688), `npm run content:check`, `npm run wordlab:check`, `node scripts/check-pictures.mjs` và `npm run build` đều sạch.
- Spec Playwright: không thêm (task không có màn mới).

### Việc bạn cần làm thủ công
1. `npx prisma db seed` trên database thật (sẽ thêm 94 từ vào kho, 120 từ Khám phá và các họ còn thiếu; **họ -at và -ir đã có sẵn trong database của bạn thì không được cập nhật**, thêm từ mới cho hai họ này bằng Adult23 hoặc xóa hai họ Nháp rồi seed lại).
2. `npm run audio:generate -- --wordlab` (khoảng 10 phút mỗi cấp; chạy lại được, chỉ tạo chỗ còn thiếu).
3. Vào Quản trị › Từ vựng (cột Khám phá) và Quản trị › Họ vần: xem rồi xuất bản từng mục. Chạy lệnh trên xong thì không còn cảnh báo thiếu âm thanh.

## Bước tiếp theo

Task đã xong. Việc tiếp theo là task 28 (`28-content-l5`), bắt đầu bằng Plan mode.
