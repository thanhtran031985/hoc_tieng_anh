# 08-review-notebook — Ôn tập lặp lại và Sổ từ

Ngày tạo: 02/10/2026 · Giai đoạn: GĐ1 · Phụ thuộc: 07 · Nhánh: `feat/08-review-notebook`

## Mục tiêu
Từ đã học tự quay lại đúng lúc theo 5 hộp; bé xem các từ đã học trong Sổ từ.

## Phạm vi
- Trong: hàm 5 hộp (Leitner), màn Ôn tập hôm nay (trộn dạng bài 8.2–8.4, tối đa 15 mục), Sổ từ (lưới, lọc chủ đề, 5 mức thuộc, phóng to thẻ để nghe).
- Ngoài: ôn ngữ pháp (THCS), in danh sách từ.

## Thiết kế
`designs/components/Screen13-Notebook`; Ôn tập dùng lại khung bài học của task 07 và Screen12 cho màn kết thúc.

## Quyết định kiến trúc
- `src/lib/rules/review.ts`: đúng lên 1 hộp, sai về hộp 1; khoảng cách 1, 3, 7, 14, 30 ngày; hộp 5 quá 30 ngày là "đã thuộc".
- Mức thuộc trong Sổ từ (`mastery-1..5`) = số hộp.
- Ngày tính theo giờ Việt Nam (Asia/Ho_Chi_Minh).

## Các bước
### Bước 0 — Hàm 5 hộp
**Kiểm tra:** chạy thử chuỗi đúng/sai, ngày ôn tiếp theo đúng bảng.
### Bước 1 — Ôn tập hôm nay
**Kiểm tra:** chỉ lấy từ đến hạn; không có từ đến hạn thì trang chủ ẩn nhiệm vụ Ôn tập; kết thúc có tổng kết và xu.
### Bước 2 — Sổ từ (Screen13)
**Kiểm tra:** đủ 4 trạng thái; lọc theo chủ đề; mức thấp xếp trước.

## Kiểm tra cuối task
tsc, lint, build.
