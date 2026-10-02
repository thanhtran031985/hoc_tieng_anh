# So sánh code với PRD và task.md — tổng quan (sau task 07)

Cập nhật: 03/10/2026 · Bản chốt code: `2cebd5b` · Phạm vi: các task 01–07 (đã ✅). Nguồn sự thật là code; PRD (Phần A–F) và `task.md` chỉ để đối chiếu.

Mức độ: **quan trọng** = ảnh hưởng bảo mật hoặc làm sai ý chính của PRD; **nhỏ** = lệch nhẹ, hoặc đã nằm trong kế hoạch của task sau.

| # | Mức | Điểm khác | Code (file:dòng) | PRD / task.md |
|---|---|---|---|---|
| 1 | **quan trọng** | Trang `/admin` chỉ cần role `admin`, **không cần mở cổng bố mẹ**. Tài khoản đăng ký đầu tiên tự thành `admin`, nên tài khoản gia đình thường là admin: máy đang đăng nhập thì bé gõ `/admin` là vào được, không cần PIN. Hiện trang chỉ là giữ chỗ nên chưa lộ dữ liệu, nhưng task 12 phải chặn trước khi có nội dung (bạn đã quyết định làm ở task 12; việc cần làm ghi ở `docs/tasks/12-admin-content/decisions.md`). | `src/app/(admin)/admin/page.tsx:11`, `src/server/session.ts:31-35`, `src/server/users.ts:8-10` | PRD dòng 126: Cổng bố mẹ → Khu vực bố mẹ → Quản trị nội dung |
| 2 | nhỏ | Cổng bố mẹ chỉ có ở màn chọn hồ sơ. Trang chủ chỉ có hộp Cài đặt (Đổi bé, Đăng xuất), không có nút vào khu bố mẹ. | `src/app/(kid)/profiles/page.tsx:24`, `src/features/kid/KidTopbar.tsx:39-42` | PRD dòng 126 ("Ở mọi màn"), dòng 138 |
| 3 | nhỏ (task 09) | Tạo hồ sơ xong đi thẳng `/home`, chưa có bài xếp lớp. | `src/features/profiles/create/CreateProfileFlow.tsx:36-38` | PRD dòng 114, 146–152 (C4) |
| 4 | nhỏ | Tạo hồ sơ chỉ hỏi tên, lớp, bạn rồng; chưa hỏi năm sinh và sách tiếng Anh ở trường (cột `birth_year`, `textbook` đã có trong database nhưng không có ô nhập). | `src/features/profiles/create/CreateProfileFlow.tsx:36`, `prisma/schema.prisma:54-57` | PRD dòng 142 (C3) |
| 5 | nhỏ | Không có ô "Nhớ đăng nhập trên máy này"; phiên luôn nhớ 30 ngày. | `src/auth.config.ts:7-12` | PRD dòng 132 (C1) |
| 6 | nhỏ (GĐ3) | Hồ sơ THCS chưa có PIN riêng (cột `learners.pin` có, chưa có màn đặt và hỏi PIN). | `prisma/schema.prisma:74` | PRD dòng 137 (C2) |
| 7 | nhỏ | Từ trang chủ, nút "Bản đồ" đi thẳng bản đồ cấp hiện tại; màn "Tổng quan 10 cấp" chỉ tới được từ nút quay lại của bản đồ hoặc nút "Xem các cấp". Theo đúng thiết kế `Screen04`, nhưng khác sơ đồ điều hướng PRD. | `src/features/home/NavTiles.tsx:11`, `src/features/home/MissionCard.tsx:105` | PRD dòng 117 |
| 8 | nhỏ | Lời chào của Bông cố định theo tình huống, chưa theo thời điểm trong ngày; chưa có hình mặt trời lặn cho giờ học còn lại (task 10). | `src/app/(kid)/home/page.tsx:17-35` | PRD dòng 157, 161 (C5a) |
| 9 | nhỏ | Bấm một cấp trên tổng quan là vào bản đồ hoặc hiện hộp thoại; chưa có thông tin "cấp đó học gì, bao nhiêu chủ đề, hoàn thành bao nhiêu %". | `src/features/levels/LevelsMap.tsx:33-38` | PRD dòng 178 (C6a) |
| 10 | nhỏ (nội dung) | PRD nói mỗi vùng có 4–6 chặng; trong database 12 trong 32 chủ đề cấp 1–4 chỉ có 2–3 bài (cấp 1: 7 chủ đề, cấp 2: 4, cấp 3: 1). Lý do: bài chia theo 5–8 từ (task 05). Chưa có cổng Bài thi lên cấp ở cuối đảo (GĐ2) và chưa có xem trước khi rê chuột (chỉ bấm). | `src/lib/rules/lesson-builder.ts:65`, `src/features/island-map/IslandMap.tsx` | PRD dòng 183, 185, 186 (C6b) |
| 11 | nhỏ | Hàm `finishLessonAttempt`, `logAnswer`, `upsertReviewCard` trong `progress.ts` không còn ai gọi: kết quả bài học ghi qua `completeLesson` (một transaction). Có thể dọn ở task 08. | `src/server/progress.ts:36,59,83`, `src/server/lesson-complete.ts:23` | task 07 |
| 12 | nhỏ | Sao tính theo tỷ lệ đúng (3 sao ≥ 90%, 2 sao ≥ 70%) theo thiết kế, không theo PRD Phần F (đếm lần sai); đã ghi ở README. Thưởng xu theo PRD (10 + 5 mỗi sao); hộp ôn tập 1/3/7/14/30 ngày đã có hàm thuần nhưng chưa có màn Ôn tập (task 08). | `src/lib/rules/lesson-score.ts:15`, `src/lib/rules/review-box.ts:26` | PRD dòng 376–397 |
| 13 | nhỏ | Mở khóa khớp PRD (bài đầu luôn mở; từ 1 sao mở bài sau; trùm mở khi xong mọi bài). Thêm một quyết định PRD không nói: trùm **không chặn** chủ đề kế. Chưa có bố mẹ mở khóa tay (task 11) và bài thi lên cấp (GĐ2). | `src/lib/rules/unlock.ts:1-6,40-71` | PRD dòng 402–405; `docs/tasks/06-home-map/decisions.md` |
| 14 | nhỏ | `proxy.ts` chỉ chuyển hướng `/profiles`, `/home`, `/parent`, `/admin`; các màn khác của bé (`/levels`, `/map`…) dựa vào `requireUser` ở layout. Không phải lỗ hổng (server vẫn chặn), chỉ không nhất quán. | `src/proxy.ts:9`, `src/app/(kid)/layout.tsx:5` | — |
| 15 | nhỏ (GĐ3) | Bé lớp 6 trở lên vẫn dùng giao diện Tiểu học (chưa có bộ THCS). | `src/lib/learner-rules.ts:13` | PRD dòng 417 |
| 16 | nhỏ (task 11, 12) | `/parent` và `/admin` mới là trang giữ chỗ. | `src/app/(parent)/parent/page.tsx:9`, `src/app/(admin)/admin/page.tsx:9` | `docs/tasks/README.md` |
| 17 | nhỏ | Bài học chưa có: khởi động ôn lại từ cũ, 3 câu thử thách cuối bài, âm thanh hiệu ứng và nút tắt nhạc nền, chế độ toàn màn hình. Có trò chơi lật thẻ (trong bài có từ 4 từ có hình). | `src/features/lesson/` | PRD dòng 90–99, 193–203 |
| 18 | nhỏ | Sao, xu do server tính nhưng đúng/sai từng mục do client báo (đáp án nằm ở client để phản hồi tức thì). Chấp nhận cho ứng dụng học của bé; chưa có kiểm tra chống gian lận. | `src/server/lesson-complete.ts:58-62` | — |
| 19 | nhỏ | Bài đã seed trước task 07 chưa có bước lật thẻ cho tới khi chạy lại `npx prisma db seed`. | `src/lib/rules/lesson-builder.ts:92` | — |

## Khớp với PRD (đã kiểm)

- Mọi trang và hàm đọc dữ liệu bé đều đi qua `requireLearner(userId, learnerId)`; hồ sơ không thuộc tài khoản thì về `/profiles` (`src/server/learners.ts:47`, `src/server/active-learner.ts:40`).
- Mật khẩu và PIN bố mẹ băm bằng bcrypt; cổng bố mẹ là cookie ký 15 phút (`src/features/parent/actions.ts:26-29`, `src/server/parent-gate.ts:12-21`).
- Học sinh chỉ thấy nội dung `published` (`src/server/curriculum.ts:9`, `src/server/map.ts`).
- Bản đồ đảo: chặng xong có 1–3 sao, chặng đang học nổi bật, chặng khóa không có nút bắt đầu, trùm khóa cho tới khi xong chặng của vùng (`src/features/island-map/IslandMap.tsx`).
