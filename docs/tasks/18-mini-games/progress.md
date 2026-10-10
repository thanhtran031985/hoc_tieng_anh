# Tiến độ — 18-mini-games — Mini game: mưa từ, bong bóng, đập chuột, đua xe

Trạng thái chung: ✅ · Cập nhật lần cuối: 10/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Mưa từ vựng (Screen11) | ✅ | |
| 1 | Bong bóng từ vựng (Screen30) | ✅ | |
| 2 | Đập chuột chữ cái (Screen31) | ✅ | |
| 3 | Đua xe trả lời (Screen32) và thành tích | ✅ | |
| 4 | Ghép trò chơi vào bài | ✅ | |

## Nhật ký

**10/10/2026 — Bước 0.** Khung chung: `src/lib/rules/games.ts` (+test, hàm thuần dựng 4 trò, chuột, xe ma, lời kết), 4 `activity_type` mới ở `lesson-step-config`/`admin-builder`, 4 kind ở `lesson-play` (`levelNumber`, `raceGhost`), `gameCoins` ở `lesson-score`. `GameFrame` nhận `host` (đường dẫn, công cụ, thoát bài của trình học), `head`, `skin` (biển/trời); Esc tạm dừng cả khi đang gõ; rời tab tự tạm dừng. `LessonPlayer` vẽ bước trò chơi bằng `GameFrame` (không lồng khung bài học). `RainStep` (Screen11): từ rơi bằng `requestAnimationFrame`, gõ tới đâu gạch xanh tới đó, Enter “Phá”, gõ sai ô lắc + Bông gợi ý, chạm đất “sẽ quay lại sau” (không trừ điểm), giảm chuyển động → 3 từ đứng yên. Kiểm (Edge, DB verify, bài 220): bắt đầu bằng Enter, ô gõ nhận focus, rơi, gạch xanh, sai/gần đúng, Esc khi đang gõ tạm dừng, từ đứng yên khi tạm dừng, phá từ, chạm đất không trừ điểm, tab ẩn tự dừng, phá đủ 8 từ → bảng kết thúc có sao và xu, giảm chuyển động, 1366×768 và 1920×1080 không cuộn, không lỗi console; tsc, lint, 394/394 test.

**10/10/2026 — Bước 1.** `BubblesStep` (Screen30): 5 làn bong bóng 5 màu bay lên theo `--duration-bubble-rise` và lắc ngang (transform trực tiếp, `GameLoop`), phím 1–5 hoặc bấm, Space nghe lại, H gợi ý; nhầm → bóng lắc + Bông đọc từ đó (không trừ điểm), sai 2 lần tự sáng bóng đúng; bóng bay khỏi màn → nhãn “Bóng N sẽ bay lại sau” rồi bay lại; bóng nổ thì làn đó nhận từ kế tiếp (hàm thuần `refillBubbleLane` bảo đảm từ cần tìm luôn có trên màn). Giảm chuyển động: bóng đứng yên ở độ cao cố định. Kiểm (Edge, DB verify): bắt đầu bằng Enter, Bông đọc từ có trên màn, Space, nhầm/lắc, gợi ý tự sáng, Esc tạm dừng (bóng đứng yên), đúng bằng phím và chuột, bóng bay lại, 8 từ → bảng kết thúc 8/8 có xu, giảm chuyển động, 1366×768 và 1920×1080 không cuộn, không lỗi console; tsc, lint, test sạch.

**10/10/2026 — Bước 2.** `WhackStep` (Screen31): lưới 3×3 hang với phím 7-8-9/4-5-6/1-2-3 in ở góc mỗi hang, chuột chui lên rồi thụt xuống theo `--duration-mole-up` (hàm thuần `stepMoles`, mỗi 200 ms, tối đa 4 con, luôn có con đúng), 5 lượt chuột cầm chữ rồi 3 lượt chuột cầm hình (con nào bắt đầu bằng âm đó); đập sai → chuột lè lưỡi + Bông đọc chữ (không trừ điểm), sai 2 lần tự sáng chuột đúng, Space “Nghe âm”, H gợi ý. Giảm chuyển động: 5 con đứng yên (`staticHoles`), vẫn đập được. Kiểm (Edge, DB verify): lưới và phím đúng bố trí, 6 giây liên tục luôn có con đúng, Space, đập sai lè lưỡi, gợi ý tự sáng, Esc tạm dừng (hang đứng yên), đập đúng bằng phím và chuột, hết 8 lượt (có lượt hình) → bảng kết thúc, giảm chuyển động, 1366×768 và 1920×1080 không cuộn, không lỗi console.

**10/10/2026 — Bước 3.** Bảng `game_records` (migration `game_records`; model `GameRecord`), `src/server/game-records.ts` (`saveGameRecord` qua `requireLearner` + Zod dùng chung `saveGameRecordSchema`, giữ 20 lần gần nhất mỗi (bé, trò, bài); `lastRaceSequence`), `saveGameRecordAction`, `getLessonPlay` nạp xe ma cho bước `race`. `RaceStep` (Screen32): câu hỏi 3–4 đáp án chữ có phím 1–4 và loa (kiểu hình / nghe / điền câu), đường đua 8 đoạn, xe của bé có Bông lái và xe ma mờ viền nét đứt đi theo số câu đúng của lần trước sau cùng số lượt trả lời (hàm thuần `ghostAt`), chưa đúng thì xe đứng chờ và làm lại câu đó (sai 2 lần mờ một đáp án), lời kết 3 trường hợp (`raceOutcome`), lần đầu chơi không có xe ma. Kiểm (Edge, DB verify): lần 1 không xe ma (chọn nhầm → đáp án cam, xe đứng yên, điểm không đổi), thành tích lưu đúng (16 lượt, 8 đúng); lần 2 có xe ma, nhãn “Lần trước · N câu” khớp công thức ở từng lượt trả lời; ba lời kết (nhanh hơn 2 câu / bằng đúng / động viên) bằng cách đổi lần trước trong database; 1366×768 và 1920×1080 không cuộn; không lỗi console.

**10/10/2026 — Bước 4.** Soạn bài học (Adult12): hàng “Mini game:” với 4 nút “Thêm Mưa từ vựng / Bong bóng từ vựng / Đập chuột chữ cái / Đua xe trả lời” (Mưa từ vựng khóa kèm lời giải thích ở bài ngoài cấp 3–5); trò chơi luôn được thêm vào cuối bài theo thứ tự thêm (`insertIndex(steps, adding)`); hàm thuần `gameStepProblem`/`rainLevelProblem` báo lỗi dưới danh sách bước khi thiếu từ có hình (Bong bóng ≥ 5, Đập chuột và Đua xe ≥ 4, Mưa từ vựng ≥ 4 từ một chữ) và server chặn Mưa từ vựng ở cấp ngoài 3–5. “Xem trước” dựng được cả 4 trò (`StepsPreview` vẽ trò chơi bằng khung riêng, Esc tạm dừng trò chứ không đóng bản xem thử, × mở “Dừng bài học?”). Kiểm (Edge, DB verify): thêm 4 trò, danh sách bước hiện đủ, xem trước chạy Mưa từ vựng (bắt đầu, Esc tạm dừng) rồi sang Bong bóng và Đua xe, “Dừng lại” đóng bản xem thử, lưu → 4 bước trong database đúng thứ tự và mở lại còn nguyên, bài cấp 2 khóa nút Mưa từ vựng. Cả task: tsc, lint, test, build sạch; spec `tests/e2e/18-mini-games.spec.ts` đã viết, chưa chạy (chờ xong hết task); cập nhật `helpers/lesson.ts`.

## Việc cần làm thủ công
- [ ] Chạy `npx prisma migrate deploy` để có bảng `game_records` (migration `game_records`).
- [ ] Ở Soạn bài học (`/admin/builder/<id>`), thêm 4 trò vào một bài cấp 3–5, xuất bản và chơi thử bằng bàn phím ở 1366×768 và 1920×1080.
- [ ] Chơi Đua xe 2 lượt cùng một bài để thấy xe ma “Lần trước”; thử chọn nhầm vài câu ở lượt đầu để lượt sau nhanh hơn / bằng / chậm hơn.
- [ ] Thử bật “giảm chuyển động” của hệ điều hành: bóng, chuột, mưa từ đứng yên nhưng vẫn chơi được.
- [ ] Chạy Playwright sau khi xong hết task: `npm run test:e2e:db` rồi `npx playwright test 18- 13- 12d`.

## Bước tiếp theo

Hoàn thành
