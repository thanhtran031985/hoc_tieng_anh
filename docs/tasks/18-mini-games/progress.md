# Tiến độ — 18-mini-games — Mini game: mưa từ, bong bóng, đập chuột, đua xe

Trạng thái chung: 🔄 · Cập nhật lần cuối: 10/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Mưa từ vựng (Screen11) | ✅ | |
| 1 | Bong bóng từ vựng (Screen30) | ✅ | |
| 2 | Đập chuột chữ cái (Screen31) | ⬜ | |
| 3 | Đua xe trả lời (Screen32) và thành tích | ⬜ | |
| 4 | Ghép trò chơi vào bài | ⬜ | |

## Nhật ký

**10/10/2026 — Bước 0.** Khung chung: `src/lib/rules/games.ts` (+test, hàm thuần dựng 4 trò, chuột, xe ma, lời kết), 4 `activity_type` mới ở `lesson-step-config`/`admin-builder`, 4 kind ở `lesson-play` (`levelNumber`, `raceGhost`), `gameCoins` ở `lesson-score`. `GameFrame` nhận `host` (đường dẫn, công cụ, thoát bài của trình học), `head`, `skin` (biển/trời); Esc tạm dừng cả khi đang gõ; rời tab tự tạm dừng. `LessonPlayer` vẽ bước trò chơi bằng `GameFrame` (không lồng khung bài học). `RainStep` (Screen11): từ rơi bằng `requestAnimationFrame`, gõ tới đâu gạch xanh tới đó, Enter “Phá”, gõ sai ô lắc + Bông gợi ý, chạm đất “sẽ quay lại sau” (không trừ điểm), giảm chuyển động → 3 từ đứng yên. Kiểm (Edge, DB verify, bài 220): bắt đầu bằng Enter, ô gõ nhận focus, rơi, gạch xanh, sai/gần đúng, Esc khi đang gõ tạm dừng, từ đứng yên khi tạm dừng, phá từ, chạm đất không trừ điểm, tab ẩn tự dừng, phá đủ 8 từ → bảng kết thúc có sao và xu, giảm chuyển động, 1366×768 và 1920×1080 không cuộn, không lỗi console; tsc, lint, 394/394 test.

**10/10/2026 — Bước 1.** `BubblesStep` (Screen30): 5 làn bong bóng 5 màu bay lên theo `--duration-bubble-rise` và lắc ngang (transform trực tiếp, `GameLoop`), phím 1–5 hoặc bấm, Space nghe lại, H gợi ý; nhầm → bóng lắc + Bông đọc từ đó (không trừ điểm), sai 2 lần tự sáng bóng đúng; bóng bay khỏi màn → nhãn “Bóng N sẽ bay lại sau” rồi bay lại; bóng nổ thì làn đó nhận từ kế tiếp (hàm thuần `refillBubbleLane` bảo đảm từ cần tìm luôn có trên màn). Giảm chuyển động: bóng đứng yên ở độ cao cố định. Kiểm (Edge, DB verify): bắt đầu bằng Enter, Bông đọc từ có trên màn, Space, nhầm/lắc, gợi ý tự sáng, Esc tạm dừng (bóng đứng yên), đúng bằng phím và chuột, bóng bay lại, 8 từ → bảng kết thúc 8/8 có xu, giảm chuyển động, 1366×768 và 1920×1080 không cuộn, không lỗi console; tsc, lint, test sạch.

## Bước tiếp theo

Bước 2 — Đập chuột chữ cái (Screen31)
