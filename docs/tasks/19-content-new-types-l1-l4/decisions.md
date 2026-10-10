# Quyết định — 19-content-new-types-l1-l4 — Nội dung dạng bài mới cho cấp 1–4

Ghi các quyết định đã chốt, thay đổi so với task.md và vấn đề phát sinh.

| Ngày | Quyết định | Lý do |
|---|---|---|
| 10/10/2026 | Bước 0 tự duyệt: số lượng theo bảng ở `plan.md` (cấp 1: 3 ghép âm, 3 sắp xếp, 3 điền từ, 3 luyện nói; cấp 2: 2/3/3/3 + 3 nghe-gõ từ; cấp 3: 2/4/4/3 + 3 nghe-gõ câu + 1 đọc hiểu; cấp 4: 4/4/3 + 3 nghe-gõ câu + 1 đọc hiểu; mỗi cấp 2 truyện) | Người dùng ủy quyền làm liền không hỏi; số lượng đủ để mỗi bài thường có ≥ 1 dạng mới và 1 trò chơi mà không quá dài (≈ 12 phút) |
| 10/10/2026 | Nội dung viết thành tệp JSON `prisma/seed/content-extra/level-NN/<slug>.json` theo chủ đề, nạp bằng seed; câu hỏi khớp theo (cấp, dạng, chữ) nên chạy lại không nhân đôi | Bài đã có tiến độ học vẫn giữ nguyên; nội dung tách khỏi mã, sửa không cần sửa component |
| 10/10/2026 | mp3 cho mọi câu qua bảng `audio_clips` (chữ → tệp) gộp vào bảng âm thanh của bài, không thêm trường `audio` vào từng dạng câu hỏi | Mọi bước đã gọi `playPronunciation(text)` nên tự dùng mp3 mà không đổi component; một cơ chế cho mọi loại câu |
