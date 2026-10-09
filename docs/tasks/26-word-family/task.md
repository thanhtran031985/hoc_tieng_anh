# 26-word-family — Họ vần, Ghép chữ đầu và liên kết qua lại

Ngày tạo: 09/10/2026 · Giai đoạn: GĐ2 · Phụ thuộc: 25 · Nhánh: `feat/26-word-family`

## Mục tiêu
Bé thấy các từ cùng vần, tránh bẫy chính tả, tự ghép chữ đầu thành từ, và đi qua lại giữa Họ vần, Ghép chữ và Khám phá từ.

## Phạm vi
- Trong: dạng 8.28 Họ vần (Screen50) và Ghép chữ đầu (Screen51); bảng `word_families`, `word_family_members`; tab Họ vần trong thẻ từ của Sổ từ (Screen52); liên kết qua lại tối đa 4 bậc (`WordLinks`, nghiệm thu theo Screen53); soạn ở Adult23.
- Ngoài: họ từ gốc (art → artist) ở GĐ3 cùng dạng 8.17; nội dung thật (task 27).

## Thiết kế
`designs/components/Screen50-WordFamily`, `Screen51-BuildFamily`, `Screen52-NotebookWordTabs`, `Screen53-WordJourney`, `Adult23-WordFamilies`; `Bong.W.family`, `famLines`, `builder`, `links`, `frame`.

## Quyết định kiến trúc
- Bảng theo PRD Phần G: `word_families` (pattern, kind rhyme/root, sound_ipa, level_id, status), `word_family_members` (family_id, word_id, same_sound, sort_order). Cần ít nhất 3 từ cùng âm; từ khác âm là "Bẫy chính tả".
- Ghép chữ đầu: danh sách từ thật tính từ thành viên của họ; chữ đầu không thành từ (z, v, j…) lưu thêm để làm nhiễu, không được trùng từ thật. Tìm đủ `build-goal` 5 từ là xong.
- Liên kết qua lại dùng một ngăn xếp điều hướng phía trình duyệt (tối đa `links-max-depth` 4 bậc) và dải đường dẫn; Quay lại về đúng bậc trước, không mất trạng thái đã làm.
- Phím ở Ghép chữ đầu: "?" là gợi ý vì H phải gõ được (đã chốt ở 5C).
- Từ bé chưa học hiện mờ, nhãn "Sắp học"; vẫn nghe được.

## Các bước
### Bước 0 — Bảng và seed mẫu
Migration 2 bảng; seed họ "-at" và "-ir" như thiết kế (Nháp).
**Kiểm tra:** Seed chạy lại không nhân đôi.
### Bước 1 — Họ vần (Screen50)
Vần ở giữa (Space nghe cả họ), thẻ quanh vần có phần vần tô màu, ô Bẫy chính tả, đọc cả đoạn câu vui.
**Kiểm tra:** ← → đi giữa thẻ; từ chưa học có nhãn "Sắp học"; bẫy có gạch lượn sóng và lời giải thích.
### Bước 2 — Ghép chữ đầu (Screen51)
Kéo, bấm hoặc gõ chữ đầu (gõ s rồi h cho "sh"), Enter kiểm tra, Backspace xóa; từ thật bay vào "Đã tìm được".
**Kiểm tra:** Từ không có thật: ô cam nhẹ, không trừ điểm; trong bài có bảng kết thúc, tự khám phá thì không sao không xu.
### Bước 3 — Liên kết qua lại (WordLinks, Screen53)
Thẻ từ có nút sang Ghép và Khám phá; dải đường dẫn; tối đa 4 bậc.
**Kiểm tra:** Đi đúng lượt bird → họ -ir → Ghép chữ → shirt → Khám phá shirt rồi Quay lại từng bậc; bậc thứ 5 không mở thêm.
### Bước 4 — Tab Họ vần trong Sổ từ (Screen52)
Thẻ từ phóng to có 3 tab, tab chưa có dữ liệu thì ẩn.
**Kiểm tra:** ← → đổi tab; Tab không ra khỏi hộp thoại; Esc đóng.
### Bước 5 — Soạn Họ vần (Adult23)
Bảng họ vần, ngăn kéo: vần, IPA, cấp, thành viên Cùng âm / Bẫy, gợi ý từ trong kho, chữ đầu nhiễu, đoạn văn vui, xem như học sinh.
**Kiểm tra:** Báo lỗi vần có ký tự lạ, IPA thiếu /…/, ít hơn 3 từ cùng âm, chữ đầu nhiễu trùng từ thật.

## Kiểm tra cuối task
tsc, lint, build; đi lượt Screen53 bằng bàn phím ở 1366×768.
