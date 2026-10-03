# Quyết định — 12-admin-content

### 03/10/2026 — Chặn `/admin` bằng cổng bố mẹ (việc cần làm ở task này)
- Bối cảnh: sơ đồ tổng quan (`docs/so-do/tong-quan/so-sanh.md`, điểm 1) cho thấy `/admin` hiện chỉ gọi `requireRole("admin")` (`src/app/(admin)/admin/page.tsx:11`), không qua `requireParentGate` (`src/server/parent-gate.ts:35`). Tài khoản đăng ký đầu tiên tự là `admin` (`src/server/users.ts:8-10`), nên máy đang đăng nhập thì bé gõ `/admin` là vào được, không cần PIN.
- Việc cần làm: nhóm route `(admin)` phải yêu cầu cả cổng bố mẹ đã mở (cookie còn hạn) và role `admin`, kiểm ở layout và từng server action; thêm lối vào từ khu bố mẹ (PRD dòng 126).
- Kiểm tra: tài khoản admin chưa mở cổng gõ `/admin` bị chuyển về `/profiles`; mở cổng rồi mới vào được; tài khoản `parent` luôn thấy 404.
- Nguồn: do bạn quyết định ngày 03/10/2026 (làm đúng ở task 12, không sửa ở task 06).

### 03/10/2026 — Bảng điều khiển: 4 thẻ KPI, nút hành động theo mục menu đã sẵn sàng
- Thẻ thứ 4 của thiết kế là "Chủ điểm ngữ pháp" (GĐ3, ngoài phạm vi) nên thay bằng thẻ "Chủ đề" (xuất bản · nháp · chưa có bài).
- Thanh trên của khung chỉ có tiêu đề tĩnh vì khung nằm ở layout; dòng "Cập nhật hh:mm · ngày" của thiết kế đặt ngay trên các thẻ KPI trong trang.
- Nút "Thêm từ mới", "Xuất Excel", "Nhập từ Excel" để mờ kèm chú thích "Sắp có" tới bước 2 và 6; nút hành động trong cảnh báo ("Mở thư viện hình", "Mở cấu trúc"…) chỉ hiện khi mục menu đích `ready` — mỗi bước sau bật `ready` trong `src/components/adult/nav.ts` thì nút tự hiện.
- Lối vào khu quản trị: link "Quản trị" ở khung (chỉ hiện với admin) sau khi đã mở cổng bố mẹ; `requireAdmin()` chuyển về `/profiles` nếu cổng chưa mở.

### 03/10/2026 — Cây lộ trình: khác thiết kế vì schema và phạm vi
- Cấp không có tay nắm kéo thả: 10 cấp có số và màu cố định (không có cột thứ tự). Chặng cũng chỉ sửa tên.
- Ô sửa theo cột có thật: cấp chỉ có "Tên" (không có tên tiếng Anh); bài học chỉ có "Tên bài" + thời lượng (không có tên tiếng Anh, chủ đề của bài không đổi được); chủ đề có tên tiếng Anh, tên tiếng Việt, cấp và "Nguồn từ mục tiêu" (thay ô "Unit SGK" của thiết kế vì bảng `units` chưa có cột đó).
- Không có nút "Xuất bản thay đổi (n)": mỗi mục đổi Nháp / Đã xuất bản rồi Lưu là có hiệu lực ngay.
- Xóa là xóa hẳn (chưa có Thùng rác 30 ngày vì cần cột mới trong schema): từ chối nếu đã có học sinh học (có tiến độ hoặc lượt làm bài) và nhắc chuyển về Nháp; không xóa chủ đề khung. Xóa bài cuối của chủ đề đang xuất bản thì chủ đề về Nháp.
- Luật xuất bản ở bước này: chủ đề cần ≥ 1 bài; bài cần ≥ 1 bước. Luật đầy đủ (≥ 3 bước và ≥ 1 câu hỏi) thêm ở Bước 4 vì 154 bài đã xuất bản hiện chưa có câu hỏi nào.
- Thêm bài học vào chủ đề khung "Chưa có bài" thì chủ đề đó thành Nháp. Chuyển chủ đề sang cấp khác thì khóa (slug) đổi nếu trùng trong cấp mới, đứng cuối danh sách.
- Nút "Xuất Excel để điền" / "Nhập Excel" ở khung chủ đề khung để mờ "Sắp có" tới Bước 7. Từ mục tiêu trong DB chỉ là danh sách chữ (không có nghĩa gợi ý) nên bảng chỉ có cột #, từ, trạng thái trong ngân hàng.

### 03/10/2026 — Ngân hàng từ vựng: khác thiết kế vì schema và phạm vi
- Bảng `words` không có cột trạng thái (Nháp / Đã xuất bản), lớp SGK, Unit SGK nên bảng và biểu mẫu bỏ các cột/bộ lọc đó, và luật "không xuất bản khi chưa có âm thanh" không áp dụng. Từ luôn dùng được ngay khi lưu.
- Chủ đề của từ là bảng `topics` (trùng tên chủ đề trong cây lộ trình). Ô Chủ đề liệt kê chủ đề của cấp đã chọn theo cây lộ trình, tạo bản ghi `topics` khi cần; chỉ ghi lại chủ đề khi người dùng đổi ô này hoặc đổi cấp, nên sửa từ có nhiều chủ đề không làm mất chủ đề.
- Hình và âm thanh chỉ xem trong ngăn kéo; tải hình, gán hình ở Bước 5. "Tạo giọng đọc tự động" để mờ "Sắp có" (GĐ2). Không có chọn hàng nhiều dòng (không có thao tác hàng loạt ở GĐ1).
- Luật "câu ví dụ chứa từ" khớp theo phần gốc (get → gets, play → playing) và có bảng dạng bất quy tắc (teach → taught, foot → feet) vì 30 câu ví dụ trong seed dùng quá khứ bất quy tắc; từ hoặc câu trống thì chưa kiểm.
- Trùng từ tính trên toàn ngân hàng, không phân biệt hoa thường (hiện không có từ trùng nào trong 900 từ).

### 03/10/2026 — Ngân hàng câu hỏi: dạng 8.1–8.4 và khác thiết kế
- "4 dạng 8.1–8.4" của task.md gồm 8.1 Thẻ từ và 3 dạng câu hỏi 8.2–8.4. Thẻ từ không phải câu hỏi (là bước gắn với một từ, không có hàng trong bảng `questions`) nên ngân hàng câu hỏi tạo/sửa 3 dạng 8.2 (`listen_choose_picture`), 8.3 (`match_pairs`), 8.4 (`choose_word_for_picture`) — đúng bộ `QUESTION_TYPES` mà trình học của task 07 chơi được; thẻ từ thêm ở Bước 4 (Soạn bài học). Thiết kế Adult11 vẽ A/B/C/D và Điền chỗ trống (8.13, 8.10 — GĐ2–3) nên không làm.
- Câu hỏi dựng từ các từ trong ngân hàng từ vựng (nhập chữ, có gợi ý): 8.2 cần mọi lựa chọn có hình; 8.4 cần từ đúng có hình; 8.3 cần các từ có hình và khác nhau. Server tra từ, dựng JSON và kiểm lại bằng Zod có sẵn.
- Không có cột Chủ điểm ngữ pháp, Unit SGK (GĐ3 / chưa có trong schema). Bỏ chọn nhiều hàng. Độ khó lưu ở `questions.difficulty` (1–5), kỹ năng ở `questions.skill`.
- Trình học hiện dựng bước từ từ vựng của bước (`buildPlaySteps`) và chưa đọc bảng `questions`; câu hỏi ở đây dùng để soạn bài ở Bước 4 và chuẩn bị cho giai đoạn sau. "Xem như học sinh" dựng bước đúng kiểu mà `StepView` nhận.
- Giải thích tối đa 300 ký tự; bắt buộc với cấp ≥ 6 (kiểm cả client và server).

### 03/10/2026 — Soạn bài học: bước theo từ, "câu hỏi" là bước không phải thẻ từ
- Trình học dựng bước từ từ vựng (`buildPlaySteps`) và chưa đọc bảng `questions`, nên mỗi bước lưu `activityType` + `wordId` (+ `questionId` khi thêm từ ngân hàng câu hỏi). "Thêm từ" tạo thẻ từ (`word_card`) như thiết kế "Giới thiệu từ"; mỗi từ có thêm hai nút thêm bước nghe–chọn hình và chọn từ cho hình (từ cần có hình). Thêm nối cặp / lật thẻ ở đầu danh sách bước (thay "Thêm bước trống" — dạng bài không từ).
- Luật xuất bản: ≥ 3 bước và ≥ 1 "câu hỏi hoặc trò chơi" = bước không phải thẻ từ (nghe–chọn hình, chọn từ, nối cặp, lật thẻ). Không đếm theo `questionId` vì 154 bài seed chưa có bài nào gắn câu hỏi. Luật này kiểm cả ở màn soạn lẫn khi đổi trạng thái ở cây lộ trình.
- Không có bước "Trùm Khỉ Lém" (chưa có ở GĐ1): bước mới chèn cuối bài, trước trò chơi lật thẻ nếu nó đang kết thúc bài. Không có ô "Mục tiêu bài" (không có cột trong `lessons`); số thứ tự "Bài n" hiện qua vị trí trong chủ đề ở cây lộ trình.
- Thời lượng tự tính từ thời gian ước mỗi dạng bài (thẻ từ 20 giây, nghe–chọn / chọn từ 25 giây, nối cặp 60 giây, lật thẻ 90 giây; giới hạn 5–30 phút) và lưu vào `lessons.minutes` khi Lưu bài.
- Xem trước dựng bước bằng `buildPlaySteps` ở client từ danh sách bước chưa lưu, nên cần từ có hình cho các dạng chọn hình; bước không dựng được bị bỏ qua và báo nếu không còn bước nào.

### 03/10/2026 — Thư viện hình và âm thanh: phạm vi và bảo mật
- Chỉ tải hình lên (PNG, JPEG, WebP, SVG; tối đa 2 MB). Âm thanh: bảng theo dõi từ chưa có tệp; tải tệp âm thanh và "Tạo giọng đọc tự động / hàng loạt" để mờ "Sắp có" (GĐ2) theo task.md. Không có thanh phân trang kiểu số trang của thiết kế mà dùng Trang trước / Trang sau; không hiển thị dung lượng của hình mẫu đi kèm (chỉ hình tải lên có cột `size`).
- Hình tải lên lưu ở `storage/uploads/<tên>-<8 ký tự băm>.<đuôi>` và `words.image` trỏ tới `/uploads/<tên>`, phục vụ qua route handler cần đăng nhập (hình minh họa từ không phải dữ liệu riêng của học sinh nên mọi tài khoản đăng nhập xem được, bé học qua tài khoản gia đình). Nhận dạng ảnh theo nội dung chứ không tin đuôi hay kiểu báo; SVG có script, sự kiện, foreignObject hoặc tham chiếu ngoài bị từ chối; phản hồi có `Content-Security-Policy: sandbox`.
- Tải lên đi qua route handler (không phải server action) vì cần tiến độ và vượt giới hạn 1 MB của server action; route tự kiểm quyền bằng `getAdminOrNull()` (trả 403 thay vì chuyển trang).
- Tên tệp trùng tên từ **chưa có hình** thì tự gắn; từ đã có hình thì không ghi đè (báo dùng "Thay hình"). Không có xóa hình khỏi thư viện (chưa có nhu cầu và tránh làm mất hình đang dùng).

### 03/10/2026 — Nhập và xuất Excel (từ vựng, câu hỏi): thư viện và khác thiết kế
- Thư viện: `exceljs` ^4.4.0 (đọc và ghi .xlsx, chạy ở server; không có lỗ hổng đã biết lúc cài). `task.md` yêu cầu hỏi trước khi cài; `exceljs` đã được cài vào `package.json` ở phiên trước và bạn cho toàn quyền trong phiên này nên giữ lại, ghi lại ở đây để bạn biết.
- Cột tệp mẫu theo schema có thật: từ vựng `word, ipa, pos, meaning_vi, example_en, example_vi, level, topic` (bỏ `grade`, `unit` của thiết kế vì bảng `words` không có lớp SGK, Unit SGK); câu hỏi `type, option_1…option_6, answer, level, skill, difficulty, explanation, status` (bỏ `question`, `option_a…d`, `grammar` vì 3 dạng 8.2–8.4 dựng từ các từ trong ngân hàng, xem quyết định Ngân hàng câu hỏi). Dạng câu hỏi nhận cả mã (`listen_choose_picture`) lẫn số mục (`8.2`); loại từ nhận cả tiếng Anh lẫn tiếng Việt.
- Trang dữ liệu của tệp mẫu chỉ có dòng tiêu đề (không có dòng mẫu) để khỏi nhập nhầm; ví dụ ở trang "Hướng dẫn". Tệp chỉ có một trang thì đọc trang đó dù tên khác. Tối đa 5.000 dòng và 10 MB; nhận ra .xlsx bằng 2 byte "PK".
- Từ vựng không có trạng thái Nháp (xem quyết định Ngân hàng từ vựng): "Lưu vào ngân hàng" thêm từ dùng được ngay; nhãn "Nháp" chỉ áp dụng cho câu hỏi (cột `status`, mặc định draft). Từ trùng trong ngân hàng (không phân biệt hoa thường) hoặc trùng giữa hai dòng trong tệp là lỗi chặn lưu. Chủ đề (cột `topic`) phải có ở cấp đó, bỏ trống thì không gắn chủ đề.
- Kết quả kiểm ở trình duyệt chỉ để báo lỗi tức thì; khi Lưu server kiểm lại tất cả dòng bằng dữ liệu hiện có trong database và còn một dòng lỗi thì không lưu gì (giao dịch).
- Xuất: .csv thêm BOM UTF-8 để Excel mở đúng chữ có dấu; "Lần xuất gần đây" của thiết kế chỉ liệt kê các lần xuất trong phiên làm việc hiện tại (không có bảng lưu lịch sử xuất ở schema).
