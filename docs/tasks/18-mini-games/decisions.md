# Quyết định — 18-mini-games — Mini game: mưa từ, bong bóng, đập chuột, đua xe

Ghi các quyết định đã chốt, thay đổi so với task.md và vấn đề phát sinh.

| Ngày | Quyết định | Lý do |
|---|---|---|
| 10/10/2026 | 4 `activity_type` mới `word_rain`, `word_bubbles`, `whack_letters`, `race`, cấu hình rỗng; nội dung dựng từ các từ của bài (thiếu thì lấy thêm từ cùng chủ đề) | Mini game không có nội dung riêng trong database; giống `memory_game` |
| 10/10/2026 | Component từng trò đặt ở `src/features/lesson/games/` (cần `StepProps`, `GameFrame`); hình trang trí dùng chung (mây, chuột, xe) ở `src/components/lesson/games/` | task.md ghi `src/components/lesson/games/`, nhưng các trò phụ thuộc khung bài học của `features/lesson`; phần thuần trình bày vẫn ở `components` |
| 10/10/2026 | `GameFrame` nhận `host` (đường dẫn, công cụ, thoát bài) từ trình học; bước trò chơi không đặt trong `LessonFrame` mà `LessonPlayer` trả thẳng `StepView` | Tránh hai khung lồng nhau; thanh tiến độ của trò là số lượt của trò (như thiết kế), không phải tiến độ cả bài |
| 10/10/2026 | Esc của trình học tắt khi bước là trò chơi; `GameFrame` bắt Esc cả khi đang gõ; rời tab (`visibilitychange`) tự tạm dừng | Mưa từ vựng có ô gõ; task.md: trò chơi tạm dừng khi tab bị ẩn |
| 10/10/2026 | Mưa từ vựng: chỉ lấy từ một chữ (a–z), tối đa 8, ≥ 4 từ mới dựng; chỉ chơi ở bài cấp 3–5 (`PlayExtras.levelNumber`); chạm đất → xếp lại cuối hàng, không trừ điểm; gõ sai tính vào từ gần đúng (cùng chữ đầu) làm từ đó mất “đúng ngay lần đầu” | Đúng PRD C9 / task.md; thiết kế Screen11 trùng ý (“sẽ quay lại sau”), không cần khác task.md |
| 10/10/2026 | Giảm chuyển động: Mưa từ vựng hiện 3 từ đứng yên (không rơi, không chạm đất); vẫn gõ phá được | task.md: giảm chuyển động thì đứng yên, vẫn chơi được |
| 10/10/2026 | Bảng kết thúc hiện xu = 5 × sao (`gameCoins`, phần “mỗi sao” của quy tắc PRD F) kèm ghi chú “Xu được cộng khi cậu xong cả bài”; xu thật chỉ trả một lần ở cuối bài, các lượt của trò tính vào sao của bài | Quy tắc xu hiện chỉ có ở mức bài; tránh cộng trùng. Bảng kết thúc vẫn có số xu như thiết kế |
| 10/10/2026 | Hàm `useGameLoop`/`GameLoop` (requestAnimationFrame, dt ≤ 50 ms, dừng hẳn khi tạm dừng) dùng chung các trò | Chuyển động không nhảy cóc sau khi tạm dừng; 60 khung hình |
| 10/10/2026 | Bong bóng: dữ liệu bước là `{targets (8 từ cần tìm), pool}`, không dựng sẵn từng lượt; 5 bóng hiện tại là trạng thái chơi, bóng nổ thì làn đó nhận từ cần tìm kế tiếp (nếu chưa có trên màn) hoặc từ mới | Giống thiết kế (chỉ bóng nổ được thay, các bóng khác tiếp tục bay) mà vẫn bảo đảm luôn có bóng đúng; hàm thuần có test |
| 10/10/2026 | Bóng mới sau khi nổ ẩn 0,9 giây rồi hiện lại ở độ cao đã nằm trong màn; bóng bay khỏi màn thì bay lại từ đáy | Bé thấy ngay bóng của từ cần tìm; thiết kế để bóng mới đi từ đáy nên có thể ở ngoài màn quá lâu |
| 10/10/2026 | Hình trong lớp phủ bắt đầu là biểu tượng loa trang trí, không phải nút loa | `Dialog` focus nút đầu tiên; nút loa ở hình sẽ nuốt Enter nên Enter không bắt đầu chơi được |
| 10/10/2026 | Đập chuột: 8 lượt = 5 lượt chữ (chữ cái đầu của 5 từ khác chữ đầu) + 3 lượt hình (từ có hình, nhiễu là hình bắt đầu bằng chữ khác); âm Bông đọc dạng “b. ball”; sau mỗi lượt, các con đang ở trên được đổi cho hợp lượt mới (`retargetHoles`) | Đúng thiết kế Screen31 và task.md (luôn có con đúng, đập sai không trừ điểm) |
| 10/10/2026 | Chuột thụt xuống/chui lên bằng hàm thuần `stepMoles` mỗi 200 ms (không dùng timer riêng từng con); con đúng duy nhất không bao giờ thụt xuống | Dễ kiểm thử (test chạy 600 bước); giữ lời hứa “luôn có con đúng” |
| 10/10/2026 | `game_records`: `game` là chuỗi `rain|bubbles|whack|race`, `correct` = số lượt đúng ngay lần đầu, `sequence` = mảng 0/1 theo từng lượt trả lời, giữ 20 lần gần nhất mỗi (bé, trò, bài); chỉ Đua xe ghi thành tích ở bước này (các trò khác chưa cần), schema cho phép cả 4 trò | Đúng task.md và PRD G (bảng `game_records`); xe ma chỉ cần Đua xe |
| 10/10/2026 | Lời kết Đua xe so số lượt trả lời (độ dài `sequence`) lần này với lần trước: ít hơn = nhanh hơn N câu, bằng = “Bằng đúng lần trước!”, nhiều hơn = động viên; lần đầu “Về đích rồi!” | Task.md: xe ma theo số câu đúng chứ không theo thời gian; “nhanh hơn N câu” hiểu là cần ít lượt hơn N lượt |
| 10/10/2026 | Đua xe: câu “điền câu” chỉ dùng khi câu ví dụ của từ chứa đúng chính từ đó (không biến thể), không thì dùng kiểu hình; đáp án nhiễu lấy từ mọi từ của bài và chủ đề | Dữ liệu từ vựng chưa có chỗ trống sẵn; tránh tạo câu sai ngữ pháp |
| 10/10/2026 | Mini game luôn được thêm vào cuối bài ở Adult12 (theo thứ tự thêm), các bước thường chèn trước cụm trò chơi cuối bài; “Xem trước” vẽ trò chơi bằng khung của chính nó | Task 12 chỉ có lật thẻ ở cuối bài; trò chơi là bước thưởng cuối bài theo PRD (“luyện tập → mini game → thử thách”) |
| 10/10/2026 | Lỗi thiếu từ ở Adult12 tính trên từ của bài + từ gợi ý theo chủ đề; chạy thật vẫn tự bỏ bước nếu không đủ lượt (không lỗi) | Lúc soạn chưa biết chắc từ của cả chủ đề nên chỉ chặn khi chắc chắn thiếu; lúc chơi an toàn hơn là hiện bước hỏng |
| 10/10/2026 | Chưa chụp so sánh với `designs/` cho Screen11/30/31/32 trong `thiet-ke.spec.ts` | Cần bài có sẵn trò chơi cố định trong DB test; làm khi chạy Playwright tổng. Đã đối chiếu bằng mắt qua ảnh chụp Edge ở 1366×768 và 1920×1080 |

## Tổng kết khác với task.md gốc
- Component từng trò đặt ở `src/features/lesson/games/` (phần trang trí dùng chung ở `src/components/lesson/games/`), không gom hết vào `src/components/lesson/games/`.
- Bảng kết thúc hiện xu = 5 × sao (phần “mỗi sao” của thưởng bài), xu thật chỉ cộng một lần khi xong cả bài.
- Chỉ Đua xe ghi `game_records` (đủ cho xe ma); bảng và schema sẵn sàng cho các trò khác.
- Chưa làm: so sánh ảnh với thiết kế trong Playwright; ôn tập (5 hộp) từ kết quả mini game.
