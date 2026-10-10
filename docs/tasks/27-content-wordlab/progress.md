# Tiến độ — 27-content-wordlab — Nội dung Khám phá từ và Họ vần

Trạng thái chung: 🔄 · Cập nhật lần cuối: 10/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Danh sách và mẫu (DỪNG chờ tôi) | ✅ | Đã viết đề xuất và mẫu; chờ bạn duyệt `proposal.md` trước khi sang bước 1 |
| 1 | Khám phá từ cấp 3–4 | ✅ | 57 từ mới (cấp 3: 29, cấp 4: 28) + 3 mẫu; 16 hình mới; mp3 đã tạo trên DB verify |
| 2 | Khám phá từ cấp 1–2 | ✅ | 56 từ mới (cấp 1: 27, cấp 2: 29) + 4 mẫu; 10 hình mới; mp3 đã tạo trên DB verify |
| 3 | Họ vần | ⬜ | |

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

## Bước tiếp theo

Bước 3 — Họ vần
