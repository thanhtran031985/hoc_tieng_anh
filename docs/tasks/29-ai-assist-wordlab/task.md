# 29-ai-assist-wordlab — AI hỗ trợ soạn Khám phá từ và Họ vần

Ngày tạo: 11/10/2026 · Giai đoạn: GĐ2 · Phụ thuộc: 25, 26, 27 · Nhánh: `feat/29-ai-assist-wordlab`

> Bản nháp do Claude viết từ đề xuất ngày 11/10/2026 (bạn hỏi cách thêm AI hỗ trợ tạo dữ liệu); bạn đọc và sửa trước khi bắt đầu.

## Mục tiêu
Người quản trị soạn **Khám phá từ** (Adult22) và **Họ vần** (Adult23) nhanh hơn: bấm một nút để AI gợi ý các nhánh câu hỏi, đáp án, hình nhiễu, câu trong đoạn văn và bản dịch; người soạn đọc, sửa rồi mới lưu. AI chỉ gợi ý, không tự lưu, không tự xuất bản.

## Phạm vi
- Trong: nút “Gợi ý bằng AI” cạnh “Điền sẵn câu hỏi” ở ngăn kéo Khám phá từ; nút tương tự ở ngăn kéo Họ vần (từ cùng âm, chữ đầu nhiễu, Bẫy chính tả và lời giải thích, hai câu vui); server action gọi AI; kiểm kết quả bằng luật có sẵn; thêm nhóm từ vào `QUESTION_SETS` khi AI đề xuất nhóm mới (người soạn duyệt).
- Ngoài: AI cho học sinh hoặc phụ huynh; AI vẽ hình (hình chỉ chọn từ thư viện `public/media/pictures`, thiếu thì báo cần vẽ); tự xuất bản; AI tạo mp3 (đã có Kokoro); AI cho dạng bài khác (đọc hiểu, truyện…).

## Thiết kế
Không có màn mới. Chỉ thêm nút và trạng thái “đang gợi ý”, thông báo lỗi trong ngăn kéo Adult22 / Adult23 (dùng thành phần Adult sẵn có).

## Quyết định kiến trúc
- Khóa API đặt trong `.env` (thêm tên biến vào `.env.example`, nói tôi điền); chỉ dùng ở server, không bao giờ xuống client.
- Server action gọi `requireAdmin()` ở dòng đầu; đầu vào và đầu ra đều qua Zod (`wordQuestionDataSchema`, `explorerSentenceSchema`, schema họ vần dùng chung).
- Gửi cho AI: từ, nghĩa, cấp, nhóm từ, danh sách khóa hình đang có, luật vốn từ của cấp (`vocab-check`). Đáp án và hình nhiễu chỉ dùng khóa hình có thật; câu hỏi và câu đoạn văn chỉ dùng từ của cấp.
- Kết quả đi qua `explorerIssues` / `familyIssues` và `vocab-check` trước khi hiện; chỗ vi phạm được đánh dấu cho người soạn sửa. Có giới hạn số lần gọi và ghi nhật ký (không ghi khóa).
- Cần một gói SDK của nhà cung cấp AI: **hỏi tôi trước khi cài** (CLAUDE.md). Nhà cung cấp, model và chi phí chốt ở Bước 0.

## Các bước
### Bước 0 — Đề xuất và chốt lựa chọn (DỪNG chờ tôi)
Đọc `ExplorerDrawer`, `FamilyDrawer`, `word-explorer.ts`, `word-family.ts`, `vocab-check.ts`; đề xuất nhà cung cấp, model, gói SDK, biến môi trường, lời nhắc (prompt) mẫu, ước chi phí mỗi lần gợi ý; viết một gợi ý mẫu cho một từ và một họ vần bằng dữ liệu thật.
**Kiểm tra:** Tôi đã duyệt và điền khóa vào `.env`.
### Bước 1 — Hạ tầng gọi AI
Module server gọi AI (bọc SDK), đọc biến môi trường, hết thời gian chờ, giới hạn tốc độ, kiểm kết quả bằng Zod; test với bản giả lập (không gọi mạng khi chạy `npm test`).
**Kiểm tra:** `npm test`, `npx tsc --noEmit`, `npm run lint` sạch; khóa không xuất hiện ở client (tìm trong bundle).
### Bước 2 — Gợi ý Khám phá từ
Nút “Gợi ý bằng AI” ở Adult22: điền các nhánh vào form (chưa lưu), đánh dấu chỗ thiếu hình hoặc từ ngoài cấp.
**Kiểm tra:** thử 5 từ thật (mỗi nhóm một từ) bằng Edge không đầu: kết quả qua `explorerIssues`, người soạn sửa và lưu được; thất bại mạng hiện thông báo thân thiện, form không mất dữ liệu.
### Bước 3 — Gợi ý Họ vần
Nút ở Adult23: gợi ý từ cùng âm, chữ đầu nhiễu, Bẫy chính tả (kèm lời Bông), hai câu vui và bản dịch.
**Kiểm tra:** thử 3 họ vần: qua `familyIssues`; chữ đầu nhiễu không trùng từ thật.

## Kiểm tra cuối task
`npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`; thử bằng khóa thật một từ và một họ vần; xác nhận gọi AI bị chặn khi chưa đăng nhập quản trị.
