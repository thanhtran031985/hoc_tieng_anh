# Đề xuất nội dung cấp 5 "Cây lớn" (Cambridge Flyers) — chờ duyệt Bước 0

Ngày 10/10/2026. Cấp 5 có 8 chủ đề, 400 từ mục tiêu (khung `prisma/seed/curriculum/level-05.json`, đã duyệt ở task 05). Chủ đề mẫu **Du lịch (`travel`)** đã viết đầy đủ để bạn xem trước khi tôi làm 7 chủ đề còn lại.

## 1. Chủ đề, số từ và số hình ước tính
Hình chỉ vẽ cho từ cụ thể (như cấp 1–4); từ trừu tượng (cảm xúc, kế hoạch, động từ, tính từ…) chỉ có thẻ từ, nghe và câu. Số hình chốt bằng `node scripts/check-pictures.mjs 5 --list` sau Bước 1.

| Chủ đề | Slug | Số từ | Hình (ước tính) | Ghi chú |
|---|---|---|---|---|
| Du lịch | `travel` | 52 | **26 (đã vẽ)** | mẫu |
| Thiên nhiên, môi trường | `nature-environment` | 54 | ~32 | núi lửa, sa mạc, rừng rậm, hành tinh, băng trôi… |
| Cảm xúc, tính cách | `feelings-personality` | 50 | ~9 | chỉ vẽ nét mặt rõ nghĩa (scared, surprised, bored…) và laugh, cry, hug |
| Khoa học, học tập | `science-study` | 48 | ~17 | kính hiển vi, kính thiên văn, nam châm, máy tính bỏ túi… |
| Giải trí | `entertainment-media` | 46 | ~16 | micro, tai nghe, sân khấu, báo, điều khiển từ xa… |
| Nhà cửa | `home-household` | 48 | ~40 | tủ áo, lò nướng, thang, bếp lò, ấm đun, máy giặt… |
| Kế hoạch tương lai | `future-plans` | 52 | ~4 | gần như toàn từ trừu tượng |
| Cộng đồng | `community-places` | 50 | ~18 | đài phun nước, tượng, ghế dài, hòm thư, bãi cắm trại… |
| **Cộng** | | **400** | **~160** (40 %) | cấp 1–4 có 93 %, 85 %, 64 %, 67 % số từ có hình; cấp 5 thấp hơn vì từ trừu tượng nhiều |

Bước 1 vẽ ~135 hình còn lại (cùng bộ khối `scripts/pictures/lib.mjs`, xem bằng trang xem thử trước khi seed). Danh sách từ không hình sẽ ghi ở `thieu-hinh.md`.

## 2. Nội dung mỗi chủ đề (bảng số lượng đề xuất, sửa dữ liệu rồi seed lại là đổi được)
| Mục | Số lượng | Ghi chú |
|---|---|---|
| Từ vựng | theo khung | phiên âm, loại từ, nghĩa, 1 câu ví dụ (≤ 12 từ) Anh + Việt |
| Sắp xếp câu | 5 | câu 5–8 từ, dùng will / going to / must / should |
| Điền từ | 5 | 1 đáp án + 2 thẻ nhiễu |
| Nghe-gõ **câu** | 3 | |
| Luyện nói | 3 | |
| Đọc hiểu ngắn | 2 | đoạn 4 câu, 2 câu hỏi mỗi đoạn |
| Ghép âm | 0 | như cấp 4 (ghép âm chỉ cấp 1–3) |
| **Cộng** | **18 câu** | 144 câu cả cấp (cấp 4: 15 câu/chủ đề) |
| Truyện | 2 cho cả cấp | "The Lost Luggage" (Du lịch), "The Clean River" (Thiên nhiên); 6 trang + 1 câu hỏi giữa truyện, tranh SVG ghép từ thư viện hình |
| Trận trùm | 1 mỗi chủ đề (8) | biến thể Vua Khỉ Lém, tên "Khỉ …" (Du Hành, Xanh, Cảm Xúc, Thí Nghiệm, Sân Khấu, Thợ Mộc, Hoạch Định, Phố Xóm) |
| Bài thường | tự chia ≤ 8 từ/bài | Du lịch ra 7 bài + trùm (21 bước ở bài 1); mỗi bài có dạng mới, 1 trò chơi (Mưa từ vựng có ở cấp 3–5) |

## 3. Việc khác của task
- **Bài thi lên cấp 5 → 6** (Bước 3): đề 20 câu tự dựng, đạt 80%; đạt thì bé lên cấp 6 và thấy màn chúc mừng; đảo cấp 6 ghi "Sắp có" (giao diện THCS là GĐ3). Cần đổi `EXAM_LAST_LEVEL` 4 → 5, thêm huy hiệu "Qua đảo Cây lớn" (`LEVEL_BADGE_EN[5]`).
- **Khám phá từ cấp 5**: 30 danh từ cụ thể (4–6 nhánh mỗi từ, như task 27): backpack, luggage, runway, cabin, harbour; volcano, desert, jungle, planet, ocean, glacier, mosquito, pond; microscope, telescope, magnet, machine, satellite; microphone, headphones, stage, newspaper; wardrobe, oven, ladder, fireplace, washing machine, kettle; fountain, statue, bench.
- **Họ vần cấp 5**: khoảng 8 họ (ví dụ -ound, -ore, -ear, -ail, -eel, -ide, -ine, -ool) có đoạn văn vui và bẫy chính tả; từ chưa có trong kho thêm vào `family-words.json` ở cấp 5. Danh sách chốt ở Bước 3.
- **mp3**: `npm run audio:generate -- --level 5` (từ + câu ví dụ), `-- --content --level 5` (câu hỏi, truyện), `-- --wordlab --level 5`; tổng ≈ 45 phút trên máy này.

## 4. Quy tắc vốn từ (như task 19, 27)
- Câu ví dụ, câu hỏi dạng mới và truyện chỉ dùng từ của cấp 1–5 (mọi chủ đề cấp 5 được dùng chung) + từ thông dụng (`vocab-check.ts`).
- Ngoại lệ phải ghi vào `allowed-extra.json` kèm lý do. Hiện chưa cần ngoại lệ nào cho cấp 5 (chủ đề mẫu đạt không cần).
- Đã sửa 4 câu của mẫu cho đúng vốn từ (ví dụ "mountains", "nice", "ready" không có trong khung → đổi sang "lake", "great", "now").

## 5. Chủ đề mẫu Du lịch đã có gì
- 52 từ trong `prisma/seed/content/level-05/travel.json` (đúng `target_words`, `check-content.mjs 5` đạt cho travel).
- 18 câu hỏi trong `prisma/seed/content-extra/level-05/travel.json` (`content:check-extra -- 5` đạt, 0 lỗi).
- 26 hình trong `scripts/pictures/level-05-travel.mjs` → `public/media/pictures/` (luggage, flight, runway, guide, guidebook, souvenir, postcard, destination, platform, carriage, cruise, harbour, port, cabin, deck, traveller, backpack, hostel, resort, view, scenery, landmark, monument, boarding pass, seat belt, passenger). Ảnh xem thử: `.tmp-verify/shots/sheet5.png` (không đưa vào git).
- 26 từ không hình: abroad, arrive, depart, departure, arrival, customs, border, visa, currency, sightseeing, reservation, booking, single, return, delay, cancel, fare, tour, luxury, local, foreign, culture, tourism, pack, unpack, check in.
- Seed trên database kiểm thử: chủ đề `published`, 7 bài thường (6 bài 8 từ + 1 bài 4 từ; 12–24 bước mỗi bài) + 1 trận trùm; bé thử ở cấp 5 mở bài 1 thấy thẻ từ, nghe-chọn-hình với hình mới (luggage, deck, carriage), bản đồ cấp 5 có vùng "Du lịch". Không lỗi console, không ảnh 404.
- Mã đã nới cho cấp 5: `EXTRA_LEVELS` (trừ ghép âm), `EXPECTED[5]` và mặc định cấp của `content:check-extra`, `LEVELS` của `report-content.mjs`; test cập nhật.

## 6. Bạn xem giúp
1. Mức độ câu ví dụ/câu hỏi của Du lịch có hợp với bé lớp 4–5 không (ngữ pháp will/going to/must đã có).
2. Hình mẫu (đã chụp ở `sheet5.png`): có hình nào khó hiểu không (souvenir, deck dễ nhầm nhất).
3. Số câu mỗi chủ đề (18) và 7 bài/chủ đề Du lịch có dài quá không (muốn giảm thì bảo tôi).
Không phản hồi thì tôi giữ nguyên bảng trên khi bạn nói "continue".
