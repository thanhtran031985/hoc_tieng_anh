# 13-gd2-ui-kit — Bộ thành phần GĐ2 và khung bài học mới

Ngày tạo: 09/10/2026 · Giai đoạn: GĐ2 · Phụ thuộc: 02, 07 · Nhánh: `feat/13-gd2-ui-kit`

## Mục tiêu
Có đủ token và các thành phần dùng chung của GĐ2 để các task sau chỉ việc ghép màn.

## Phạm vi
- Trong: token GĐ2 (`Gd2Tokens`, `Gd3Tokens`, `Gd4Tokens`) vào `globals.css`; hằng số `coins`, `wordlab` vào `src/lib/rules/constants.ts`; rồng Bông lớn lên 5 dáng (`MascotGrowth`); hộp quà nhận thưởng (`RewardPopup`); 2 nút công cụ bài học (`LessonTools`: học tập trung F, bảng âm thanh); chữ bấm được để nghe và xem nghĩa (`Bong.L.words`); khung trò chơi (bắt đầu, tạm dừng, kết thúc, chân bài game); âm thanh hiệu ứng và nhạc nền.
- Ngoài: các dạng bài và trò chơi cụ thể (task 15–18), cổng thi lên cấp `LevelGate` (task 20), đọc cả đoạn `ReadAloudParagraph` và liên kết `WordLinks` (task 25–26).

## Thiết kế
`designs/components/Gd2Tokens`, `Gd3Tokens`, `Gd4Tokens`, `MascotGrowth`, `RewardPopup`, `LessonTools`, `Screen46-LessonFocus`; khung bài học và khung game ở `Bong.L` (head, foot, gfoot, words, overlay, gameStart, gamePause, gameEnd, grow) và `Bong.R` (tools, wireTools, soundPanel, sound, reward). Mục 10b của `docs/DESIGN_SYSTEM.md` là hằng số trò chơi, không phải biến CSS.

## Quyết định kiến trúc
- Thành phần GĐ2 đặt ở `src/components/lesson/` (khung bài, game), `src/components/rewards/` (quà, sticker, huy hiệu); dùng lại `src/components/ui/` của task 02, không vẽ lại.
- Chỉ thêm token mới; không đổi giá trị token GĐ1 (bản sinh lại DESIGN_SYSTEM.md đã kiểm tra: 221 biến cũ giữ nguyên, thêm 166 biến).
- Âm thanh hiệu ứng tạo bằng Web Audio API (tiếng ting, pop…), không cần tệp. Nhạc nền đọc tệp trong `public/media/music/`; chưa có tệp thì công tắc Nhạc nền để mờ kèm chú thích. Giọng đọc tiếng Anh luôn bật, không tắt được.
- Cài đặt âm thanh (nhạc nền, hiệu ứng, âm lượng) lưu trong `learners.settings`, áp dụng mọi máy bé dùng.
- Học tập trung dùng Fullscreen API của trình duyệt; Esc thoát chế độ này trước, bấm Esc lần nữa mới hỏi "Dừng bài học?".
- Tôn trọng `prefers-reduced-motion`: tắt tia sáng, sao bay, lắc.

## Các bước
### Bước 0 — Token và hằng số GĐ2
Bổ sung vào `globals.css` các biến mới trong khối `:root` ở mục 15 của `docs/DESIGN_SYSTEM.md` (đối chiếu với `designs/tokens.json`), hằng số mục 10b vào `constants.ts`.
**Kiểm tra:** `tsc`, build chạy; trang `/dev/ui` có thêm mục token GĐ2 hiện đúng màu; không token GĐ1 nào đổi giá trị.
### Bước 1 — Rồng Bông lớn lên (MascotGrowth)
Thêm tham số `stage` 1–5 cho component rồng Bông; dáng theo cấp hiện tại của bé.
**Kiểm tra:** 5 dáng × 4 màu × 8 biểu cảm hiện đúng như thiết kế; dáng 3 trùng hình rồng cũ; nhãn đọc màn hình có "dáng cấp N".
### Bước 2 — Chữ bấm được và khung trò chơi
Component chữ bấm được (nghe từ + nghĩa ngắn), lớp phủ bắt đầu, tạm dừng (Esc, nút ⏸), bảng kết thúc, chân bài game.
**Kiểm tra:** Bấm từ trong câu thì nghe đúng từ và hiện nghĩa; Esc trong game mở tạm dừng, Thoát thì mở "Dừng bài học?"; dùng được hoàn toàn bằng bàn phím.
### Bước 3 — Hộp quà nhận thưởng (RewardPopup)
Hộp quà 2 bước: hộp lắc → sticker hoặc huy hiệu, tên tiếng Anh + loa (tự đọc 1 lần), nghĩa, số xu.
**Kiểm tra:** Enter, bấm hộp hoặc Esc đều mở quà; nút "Cho vào bộ sưu tập" gọi hàm truyền vào; tắt chuyển động khi giảm chuyển động.
### Bước 4 — Công cụ bài học (LessonTools) và học tập trung
2 nút tròn trên khung bài học của task 07: Học tập trung (F) và Âm thanh (bảng công tắc + âm lượng).
**Kiểm tra:** Khớp Screen46: F vào toàn màn hình, ẩn đường dẫn, nhãn "Đang học tập trung · Esc để thoát"; bảng âm thanh đóng bằng Esc hoặc Tab ra ngoài; cài đặt lưu lại sau khi tải lại trang; màn bài học vẫn vừa 1366×768 không cuộn.
### Bước 5 — Âm thanh hiệu ứng và nhạc nền
Hàm phát hiệu ứng (đúng, chưa đúng, nhận xu, mở quà) theo cài đặt; nhạc nền lặp, nhỏ, tự giảm khi giọng đọc chạy.
**Kiểm tra:** Tắt hiệu ứng thì không còn tiếng; không có tệp nhạc thì công tắc mờ; giọng đọc vẫn chạy khi tắt hết.

## Kiểm tra cuối task
tsc, lint, build; mở `/dev/ui` xem đủ thành phần mới ở 1366×768 và 1920×1080; đi một bài GĐ1 bất kỳ có bật học tập trung.
