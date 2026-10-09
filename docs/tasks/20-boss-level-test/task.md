# 20-boss-level-test — Trận trùm, bài thi lên cấp và rồng Bông lớn lên

Ngày tạo: 09/10/2026 · Giai đoạn: GĐ2 · Phụ thuộc: 18, 19 · Nhánh: `feat/20-boss-level-test`

## Mục tiêu
Mỗi vùng kết thúc bằng trận trùm vui; xong cả cấp thì thi lên cấp, đạt 80% thì rồng Bông lớn lên và mở đảo mới.

## Phạm vi
- Trong: trận trùm cuối vùng (Screen33); bản đồ đảo có cổng thi (Screen34, `LevelGate`); giới thiệu bài thi, bài thi 20 câu, đạt, chưa đạt (Screen35–37); rồng Bông theo cấp ở mọi nơi; điều chỉnh độ khó trong bài (PRD Phần F).
- Ngoài: bài thi THCS 30–40 câu (GĐ3), đề thi ở Adult04, Adult16 (GĐ3).

## Thiết kế
`designs/components/Screen33-Boss`, `Screen34-IslandMapGate`, `Screen35-LevelTestIntro`, `Screen36-LevelUp`, `Screen37-LevelTestRetry`, `LevelGate`, `MascotGrowth`.

## Quyết định kiến trúc
- Trận trùm là bài `kind = unit_test` của chủ đề, mở khi xong mọi bài trong chủ đề. 6 câu trộn dạng bài, không đếm giờ, sai thì làm lại, trùm không bao giờ thắng. Thiết kế chỉ có Vua Khỉ Lém; Bước 0 Claude Code đề xuất trùm cho từng vùng cấp 1–4 (đổi màu, phụ kiện từ hình Vua Khỉ) và hỏi tôi trước khi vẽ nhân vật mới.
- Bài thi lên cấp dùng bảng `exams` (`kind = level_test`, `pass_percent = 80`), `exam_questions`, `exam_attempts`. 20 câu lấy ngẫu nhiên từ câu đã xuất bản của 4 vùng, trộn dạng bài; tính điểm theo câu đúng ngay lần đầu; câu sai vẫn được làm lại để học.
- Cổng mở khi xong mọi chủ đề của cấp. Chưa đạt thì gợi ý 3 chủ đề sai nhiều nhất; ôn xong một chủ đề là thi lại được (lưu điều kiện này ở server).
- Đạt: lên `current_level_id`, thưởng theo thiết kế (+50 sao, +100 xu, huy hiệu "Qua đảo …"); dáng rồng = số cấp (1–5).
- Bản đồ có cổng thay cho bản đồ của task 06 (Screen06 trong designs/ vẫn để nguyên).
- Điều chỉnh độ khó là hàm thuần `src/lib/rules/adaptive.ts`: đúng liên tiếp thì bớt gợi ý, thêm đáp án nhiễu; sai nhiều thì giảm lựa chọn, phát âm chậm.

## Các bước
### Bước 0 — Trùm cho từng vùng (DỪNG chờ tôi)
Danh sách vùng cấp 1–4 và trùm đề xuất, hình mẫu 2 trùm.
**Kiểm tra:** Tôi đã duyệt danh sách trùm.
### Bước 1 — Trận trùm (Screen33)
Mở đầu, trận đấu 6 câu với thanh năng lượng có số, kết thúc trùm làm bạn, +30 xu, huy hiệu.
**Kiểm tra:** Không thể thua; sai thì trùm trêu nhẹ, làm lại; về bản đồ thì vùng hiện đã xong.
### Bước 2 — Bản đồ có cổng (Screen34)
Đường đảo kết thúc ở cổng; cổng khóa hiện vùng còn thiếu; cổng mở vào bài thi.
**Kiểm tra:** Gõ thẳng URL bài thi khi cổng khóa bị chặn ở server; cổng đọc được bằng trình đọc màn hình.
### Bước 3 — Bài thi lên cấp (Screen35–37)
Giới thiệu, 20 câu với thanh 20 chấm, đạt (rồng lớn lên, đảo mới sáng), chưa đạt (thước 20 ô, 3 chủ đề nên ôn).
**Kiểm tra:** 16/20 đạt, 15/20 chưa đạt; chưa đạt không có chữ "trượt", không màu đỏ; thi lại bị chặn cho tới khi ôn xong một chủ đề gợi ý.
### Bước 4 — Rồng Bông theo cấp
Dáng rồng theo cấp hiện tại ở trang chủ, bài học, kết thúc bài, chọn hồ sơ.
**Kiểm tra:** Bé cấp 4 thấy dáng có khăn quàng; đổi cấp ở database thì dáng đổi theo.
### Bước 5 — Điều chỉnh độ khó trong bài
Hàm thuần có test, nối vào khung bài học.
**Kiểm tra:** Test: 3 câu đúng liên tiếp thì câu sau thêm 1 đáp án nhiễu; 2 câu sai liên tiếp thì giảm lựa chọn và phát chậm.

## Kiểm tra cuối task
tsc, lint, build; dùng hồ sơ thử đi hết một cấp, đánh trùm, thi lên cấp cả 2 trường hợp đạt và chưa đạt.
