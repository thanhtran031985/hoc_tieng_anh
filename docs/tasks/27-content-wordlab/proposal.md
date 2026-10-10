# Đề xuất nội dung — 27-content-wordlab (Bước 0, chờ duyệt)

Ngày: 10/10/2026. Tệp này chỉ để duyệt; nội dung thật nằm trong mã nguồn (đường dẫn ở mục 7). Chạy `npm run wordlab:check` để kiểm lại mẫu.

## 1. Cách làm
- **120 từ Khám phá** (30 từ mỗi cấp 1–4) và **30 họ vần**. Mọi mục để **Nháp**, bạn xem rồi xuất bản.
- Mỗi từ 4–6 nhánh theo bộ câu hỏi mẫu của Adult22 (Con vật, Đồ ăn, Đồ vật, Nghề nghiệp, Nơi chốn); mỗi nhánh có đáp án (kèm hình, nghĩa Việt), 1–2 hình nhiễu, một câu trong đoạn văn kèm bản dịch.
- Hình đáp án **dùng lại hình từ vựng đã có** (danh từ, màu, động từ: hiện có 670 hình từ vựng + 17 hình thiết kế, chưa tính 5 hình mới của mẫu). Hình còn thiếu vẽ SVG cùng phong cách task 05, trong `scripts/pictures/wordlab-NN.mjs` (NN = cấp của từ cần hình).
- mp3 cho đáp án và đoạn văn: lệnh mới `npm run audio:generate -- --wordlab` (Kokoro, như `--content`); tôi chạy trên máy này để kiểm Adult22/Adult23 hết cảnh báo, bạn chạy lại trên database thật.

## 2. Quy tắc vốn từ (cần bạn duyệt)
Theo yêu cầu “câu hỏi và đáp án chỉ dùng từ trong cấp của bé và cấp dưới”, nhưng đáp án là chỗ bé **học từ mới bằng hình** (mẫu bird của thiết kế có seeds, wings, claws…). Tôi làm như sau, script kiểm tự động:
- **Câu hỏi và đoạn văn**: chỉ từ đã dạy tới cấp của từ (cùng luật `vocab-check` của task 19), cộng chính từ đó, các đáp án và nhãn hình nhiễu của từ đó.
- **Đáp án và nhãn hình nhiễu**: được có chữ mới, nhưng phải có hình và nghĩa tiếng Việt. Script đếm và in danh sách chữ mới để bạn xem (mẫu 5 từ: 29 chữ mới, vd stethoscope, librarian, fins, seats).
- Ngoại lệ ghi ở `prisma/seed/wordlab/allowed-wordlab.json`: hiện có “color” (cách viết Mỹ, thiết kế bird/cat dùng; khung của ta viết “colour”).
- Câu hỏi dùng đúng mẫu thiết kế, chỉ đổi “What’s this place?” thành “What’s this?” vì “place” là từ cấp 5.

## 3. Danh sách 120 từ Khám phá
Đã có sẵn trong mã: **bird, cat** (mẫu thiết kế, task 25) và **5 từ mẫu mới** (in đậm): **apple, dolphin, bus, doctor, library**.

| Cấp | Nhóm (bộ câu hỏi) | Từ |
|---|---|---|
| 1 (30) | Con vật (Con vật) | bird, cat, dog, fish, duck, rabbit, horse, cow, pig, frog, bee, butterfly, bear, monkey, elephant, lion, snake |
| | Trái cây (Đồ ăn) | **apple**, banana, orange, strawberry |
| | Đồ vật, đồ chơi (Đồ vật) | ball, kite, car, train, bike, book, bed, chair, teddy |
| 2 (30) | Thú hoang (Con vật) | **dolphin**, penguin, panda, zebra, owl, whale, kangaroo, wolf |
| | Cơ thể (Đồ vật) | hand, eye, nose, tooth |
| | Quần áo (Đồ vật) | shirt, hat, shoe, jacket, sock |
| | Đồ ăn (Đồ ăn) | egg, bread, milk, cake, pizza, carrot, tomato, cheese |
| | Nhà và lớp học (Đồ vật) | kitchen, garden, key, pencil, scissors |
| 3 (30) | Phương tiện, du lịch (Đồ vật) | **bus**, taxi, ship, helicopter, suitcase, tent, map |
| | Nơi chốn thiên nhiên (Nơi chốn) | beach, island, lake, forest, farm |
| | Âm nhạc, máy ảnh (Đồ vật) | guitar, piano, camera |
| | Đồ ăn (Đồ ăn) | noodle, pancake, cookie, mushroom |
| | Dụng cụ ăn (Đồ vật) | fork, spoon, knife |
| | Thể thao (Đồ vật) | football, tennis, skateboard |
| | Thiên nhiên (Đồ vật) | moon, sun, tree, flower, cloud |
| 4 (30) | Nơi trong thành phố (Nơi chốn) | **library**, museum, cinema, hospital, bank, supermarket, bakery, zoo, castle, stadium |
| | Nghề nghiệp (Nghề nghiệp) | **doctor**, nurse, farmer, firefighter, chef, astronaut, vet, postman |
| | Công nghệ, đồ dùng (Đồ vật) | laptop, mobile phone, keyboard, wallet, medicine, ambulance |
| | Truyện phiêu lưu (Đồ vật) | dragon, pirate, treasure, crown, knight, ghost |

Mọi từ trên đều có hình từ vựng sẵn. Muốn đổi từ nào thì nói, tôi thay bằng từ cùng nhóm.

## 4. Danh sách 30 họ vần
Mẫu đã viết đủ: **-at, -ake, -ight** (ba họ in đậm ở mục 7) và **-ir** (mẫu thiết kế, thêm dirt, first, third). Còn 26 họ, “Từ trong kho” là từ đã có (kèm cấp thấp nhất), “Thêm vào kho” là từ mới chỉ để làm đủ họ (không hình, không thuộc bài nào nên bé thấy là Sắp học), “Bẫy” là từ cùng chữ khác âm. Cột cuối là số từ thật của Ghép chữ đầu.

| Vần | Âm | Cấp | Từ trong kho | Thêm vào kho | Bẫy | Ghép |
|---|---|---|---|---|---|---|
| -an | /æn/ | 1 | man, van | can, fan, pan, ran | woman | 6 |
| -ad | /æd/ | 1 | dad, sad, bad | mad, pad, glad | head, bread | 6 |
| -en | /en/ | 1 | hen, ten, pen | men, den, when | open, listen | 6 |
| -et | /et/ | 3 | net, vet, get | wet, pet, jet, set | sweet | 7 |
| -ig | /ɪɡ/ | 1 | pig, big | dig, wig, fig | — | 5 |
| -in | /ɪn/ | 2 | chin, thin, win, skin | bin, pin, tin | rain, train | 7 |
| -ip | /ɪp/ | 3 | ship, trip | lip, hip, tip, zip, sip | — | 7 |
| -it | /ɪt/ | 2 | sit, fit | hit, bit, kit, pit | fruit | 6 |
| -ick | /ɪk/ | 2 | kick, sick, thick, click | pick, lick, stick | — | 7 |
| -og | /ɒɡ/ | 1 | dog, frog, fog | log, jog | — | 5 |
| -op | /ɒp/ | 2 | stop, shop | top, hop, mop, pop, drop | — | 7 |
| -ock | /ɒk/ | 1 | clock, block, sock | rock, lock, dock | — | 6 |
| -uck | /ʌk/ | 1 | duck | truck, luck, stuck, tuck | — | 5 |
| -un | /ʌn/ | 2 | run, sun, fun | bun, spun | — | 5 |
| -ate | /eɪt/ | 3 | late, date, plate, skate | gate | chocolate, pirate | 5 |
| -ame | /eɪm/ | 1 | name, game, same | came, fame, tame, frame, flame | — | 8 |
| -ice | /aɪs/ | 2 | rice, price | mice, nice, dice, slice, twice | juice, office | 7 |
| -eep | /iːp/ | 1 | sheep, sleep, deep, keep | weep, peep, creep | — | 7 |
| -oat | /əʊt/ | 1 | goat, boat, coat | float, throat, moat | — | 6 |
| -ay | /eɪ/ | 2 | play, say, pay, may | day, way, stay, tray | — | 8 |
| -ook | /ʊk/ | 1 | book, look, cook | hook, took, shook | — | 6 |
| -oon | /uːn/ | 1 | moon, spoon, balloon, afternoon, cartoon | soon, noon | — | 4 |
| -ow | /əʊ/ | 2 | snow, slow, low, grow, know, throw | blow, show, flow | cow, now | 9 |
| -all | /ɔːl/ | 1 | ball, wall, small, tall, fall | call, hall, mall | — | 8 |
| -ing | /ɪŋ/ | 2 | sing, ring, king, bring, spring | wing, thing, swing | — | 8 |
| -ar | /ɑː/ | 1 | car, star | far, jar, bar | bear, pear, ear | 5 |

Đã viết: -at (cấp 1, ghép 10, bẫy eat, what), -ir (cấp 1, ghép **3**: shirt, skirt, dirt, vì first/third không ghép được với “irt”), -ake (cấp 1, ghép 7, không bẫy), -ight (cấp 3, ghép 8, bẫy eight, weight, straight).

- **Họ có Ghép chữ đầu dưới 5 từ thật**: -ir (3) và -oon (4). Yêu cầu của task cho phép nếu ghi rõ; tôi ghi vào decisions.md và để họ vẫn chơi được (mục tiêu Ghép bằng số từ thật).
- **Thêm vào kho khoảng 100 từ** (86 từ ở bảng trên và 14 từ cho 4 họ đã viết). Danh sách là bản nháp: ở Bước 3 tôi thay các từ khó hoặc ít gặp (spun, moat, creep, weep, tame…) bằng từ thông dụng hơn nếu có.
- Cấp của họ = cấp thấp nhất của từ cùng âm trong họ (script kiểm).

## 5. Số hình cần vẽ
- Mẫu 5 từ cần **5 hình mới**: fin (vây), seat (ghế xe), stethoscope (ống nghe), librarian (thủ thư), borrow (mượn sách). Đã vẽ xong, ở `scripts/pictures/wordlab-02/03/04.mjs`.
- Ước tính cho cả 120 từ: **khoảng 100–150 hình mới** (mẫu cho tỉ lệ khoảng một hình mỗi từ; phần lớn đáp án dùng lại hình sẵn có như màu, thức ăn, động từ, bộ phận cơ thể). Số chính xác có ở mỗi bước (`npm run wordlab:check` in “N hình cần vẽ”). Cấp 3–4 làm trước (Bước 1), cấp 1–2 ở Bước 2.
- Nếu bạn thấy nhiều quá, có thể bớt số nhánh mỗi từ (4 thay vì 5–6) hoặc bỏ một số từ khỏi danh sách; nói tôi trước khi sang Bước 1.

## 6. Việc tôi làm thêm (ngoài danh sách)
- `scripts/check-wordlab.mjs` (`npm run wordlab:check`): kiểm Zod, 4–6 nhánh, hình có trên đĩa, vốn từ, họ ≥ 3 từ cùng âm, IPA, chữ đầu nhiễu, số từ ghép.
- `scripts/gen-pictures.mjs` và `scripts/check-pictures.mjs` nhận thêm nhóm hình `wordlab-NN`.
- Hạt giống nạp từ bổ sung `prisma/seed/wordlab.ts` (chạy lại không nhân đôi; từ đã có thì bỏ qua) và gọi trong `prisma/seed.ts` trước họ vần.
- Seed không bổ sung từ vào họ đã có sẵn trong database của bạn (vì không ghi đè phần đã sửa). Database thật chưa seed họ vần thì sẽ có đủ; nếu đã seed -at/-ir ở task 26 thì bạn thêm từ mới bằng Adult23.

## 7. Mẫu đã viết (xem để duyệt)
- 5 từ Khám phá: `src/lib/rules/wordlab-data/explorer-level-01.ts` (apple), `-02.ts` (dolphin), `-03.ts` (bus), `-04.ts` (doctor, library).
- 3 họ vần: `src/lib/rules/wordlab-data/families.ts` (-ake, -ight) và `src/lib/rules/word-family-data.ts` (-at mở rộng thành 10 từ cùng âm; -ir thêm dirt, first, third).
- Từ thêm vào kho: `prisma/seed/wordlab/family-words.json` (14 từ).
- Hình mới: `scripts/pictures/wordlab-0N.mjs`; ảnh xem thử: `.tmp-verify/shots/sheet5.png` (không đưa vào git).

## 8. Bạn cần quyết
1. Duyệt (hoặc sửa) danh sách 120 từ và 30 họ ở mục 3–4.
2. Quy tắc vốn từ ở mục 2 (đáp án được có chữ mới kèm hình).
3. Từ thêm vào kho cho họ vần để **không có hình** (để không lọt vào lựa chọn nhiễu của bài ôn). Đồng ý hay muốn vẽ hình cho từ cụ thể (mat, rat, bun…)?
4. Nói “continue” để sang Bước 1 (Khám phá từ cấp 3–4).
