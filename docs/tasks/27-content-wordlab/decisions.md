# Quyết định — 27-content-wordlab — Nội dung Khám phá từ và Họ vần

Ghi các quyết định đã chốt, thay đổi so với task.md và vấn đề phát sinh.

| Ngày | Quyết định | Lý do |
|---|---|---|
| 10/10/2026 | Kế hoạch (plan.md) được duyệt; chỉ Bước 0 là điểm dừng thật chờ người dùng duyệt danh sách và mẫu, các bước sau tự chạy và ghi vào đây. | Chỉ dẫn “toàn quyền” và task.md. |
| 10/10/2026 | Dữ liệu nội dung đặt ở `src/lib/rules/wordlab-data/` (một tệp mỗi cấp, `families.ts`), gộp ở `word-explorer-data.ts` / `word-family-data.ts`; hai mẫu của thiết kế (bird, cat, -at, -ir) giữ nguyên chỗ. | Test và trang `/dev/wordlab` đang import từ hai tệp đó; cùng kiểu nạp seed của task 25–26. |
| 10/10/2026 | Câu hỏi và đoạn văn chỉ dùng từ trong cấp; đáp án và nhãn hình nhiễu được có chữ mới nếu có hình và nghĩa Việt. “color” ghi ở `prisma/seed/wordlab/allowed-wordlab.json`. | Yêu cầu “chỉ dùng từ trong cấp” không thực hiện được với đáp án (đáp án chính là từ mới bé học bằng hình, mẫu bird của thiết kế đã có seeds, wings…). Chờ người dùng duyệt ở Bước 0. |
| 10/10/2026 | Từ thêm cho họ vần nằm ở `prisma/seed/wordlab/family-words.json`, nạp vào kho từ **không gắn chủ đề, không có hình**. | Họ vần cần từ như mat, rat, dirt không có trong khung chương trình; không hình để không lọt vào lựa chọn nhiễu của bài ôn (`review.ts` lấy từ cùng cấp có hình). |
| 10/10/2026 | Cấp của họ vần = cấp thấp nhất của từ **Cùng âm** (Bẫy không tính); đổi họ -ir của task 26 từ cấp 2 sang cấp 1 (bird, girl). | Nhất quán cho script kiểm; cấp họ chỉ dùng để sắp xếp ở Adult23 và để kiểm vốn từ của đoạn văn. |
| 10/10/2026 | Họ -ir chỉ ghép được 3 từ thật (shirt, skirt, dirt) vì first, third không kết thúc bằng “irt”; họ -oon dự kiến 4. Họ vẫn chơi được (mục tiêu Ghép = số từ thật). | Task cho phép nếu ghi rõ họ nào ít hơn 5; script kiểm in danh sách này. |
| 10/10/2026 | Seed không bổ sung từ vào họ vần đã có trong database. | Giữ nguyên nguyên tắc “không ghi đè phần đã sửa” của task 26; thêm từ cho họ đã có làm ở Adult23. |
| 10/10/2026 | Người dùng duyệt đề xuất Bước 0 bằng “continue” (không sửa danh sách, quy tắc vốn từ hay từ họ vần không hình). | Phản hồi của người dùng sau khi đọc proposal.md. |
| 10/10/2026 | Câu hỏi dùng “put on / goes on” thay vì “wear”, “grows/can see” thay vì “grow”, “What is … like?” thay vì “What shape…?”, “Who/What lives…” thay vì “animals” khi từ đó ngoài vốn từ của cấp. | Script kiểm bắt các từ này là từ ngoài cấp (wear cấp 4, shape cấp 5…); đổi cách hỏi chứ không thêm vào danh sách ngoại lệ. |
| 10/10/2026 | Thêm chế độ `--wordlab` vào `npm run audio:generate` (tạo mp3 đáp án, đoạn văn Khám phá và đoạn văn vui của họ vần). | Cần tạo ~900 tệp cho 120 từ; màn soạn chỉ làm từng từ. Dùng đúng hàm của màn soạn nên cảnh báo Adult22/23 biến mất như khi bấm “Tạo giọng đọc”. |
