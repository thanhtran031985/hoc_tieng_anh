# 09-placement — Bài xếp lớp

Ngày tạo: 02/10/2026 · Giai đoạn: GĐ1 · Phụ thuộc: 05, 07 · Nhánh: `feat/09-placement`

## Mục tiêu
Bé mới làm một bài ngắn dạng trò chơi để web đề xuất cấp bắt đầu.

## Phạm vi
- Trong: bài xếp lớp thích ứng 10–15 câu nghe chọn hình, không hiện đúng/sai; màn kết quả với cấp đề xuất và nút đổi cấp; nút "Bỏ qua, bắt đầu theo lớp".
- Ngoài: bài xếp lớp THCS (20–25 câu, GĐ3).

## Thiết kế
`designs/components/Screen15-PlacementIntro` (giới thiệu, nút Bỏ qua), `Screen16-PlacementQuiz` (12 câu nghe và chọn hình, không báo đúng/sai, tiến độ 12 ngôi sao), `Screen17-PlacementResult` (cấp đề xuất, nút Chọn cấp khác).

## Quyết định kiến trúc
- `src/lib/rules/placement.ts`: bắt đầu ở cấp = lớp, nhưng không vượt cấp cao nhất đã có nội dung `published` (GĐ1: cấp 4), đúng 3 câu liên tiếp lên 1 mức, sai 2 câu liên tiếp xuống 1 mức; cấp đề xuất là mức cao nhất đúng ≥ 70%.
- Câu hỏi lấy ngẫu nhiên từ từ vựng của từng cấp.

## Các bước
### Bước 0 — Hàm xếp lớp
**Kiểm tra:** chạy thử các chuỗi trả lời, ra cấp đề xuất đúng.
### Bước 1 — Màn giới thiệu, làm bài và kết quả (Screen15–17)
**Kiểm tra:** chạy sau khi tạo hồ sơ; đủ 4 trạng thái; chọn cấp khác được; bỏ qua được (hỏi xác nhận cấp theo lớp).

## Kiểm tra cuối task
tsc, lint, build.
