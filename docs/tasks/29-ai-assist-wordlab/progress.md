# Tiến độ — 29-ai-assist-wordlab — AI hỗ trợ soạn Khám phá từ và Họ vần

Trạng thái chung: 🔄 · Cập nhật lần cuối: 11/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Đề xuất và chốt lựa chọn (DỪNG chờ tôi) | ✅ | Gemini + `fetch` (không gói mới); thử thật 1 từ, 1 họ; chờ bạn duyệt `proposal.md` |
| 1 | Hạ tầng gọi AI | ⬜ | |
| 2 | Gợi ý Khám phá từ | ⬜ | |
| 3 | Gợi ý Họ vần | ⬜ | |

## Nhật ký

(Claude ghi sau mỗi bước: đã làm gì, kết quả kiểm tra, việc cần làm thủ công.)

### Bước 0 — Đề xuất và chốt lựa chọn (11/10/2026)
- **Đã làm**: kế hoạch lưu ở `plan.md`; khóa Gemini lưu vào `.env` (`GEMINI_API_KEY`, `GEMINI_MODEL`; không đọc nội dung `.env`, `.env` bị git bỏ qua) và tên biến giữ chỗ vào `.env.example`; script thử `.tmp-verify/ai-sample.mjs` (không commit) gọi Gemini thật với lời nhắc dự kiến.
- **Kết quả thử**: `volcano` (khám phá từ) 5 nhánh hợp lý, 0 khóa hình lạ, 6,5 giây khi tắt “suy nghĩ” (có suy nghĩ: 31 giây); `-ous` (họ vần) 4 giây, từ cùng âm và Bẫy (house, mouse) đúng, có lời Bông và 2 câu vui có dịch. Chi tiết, hạn mức, quyền riêng tư, điều AI hay sai: `proposal.md`.
- **Quyết định**: dùng `fetch` tới REST Gemini nên không cài gói mới; AI chỉ điền form, không tự lưu; 6 lượt/phút/admin.
- **Việc bạn cần làm**: đọc `proposal.md` (mục 6 có 3 câu hỏi, mặc định đã chọn sẵn), nói “continue”. Sau khi xong task nên tạo lại khóa Gemini (khóa từng dán trong chat).

## Bước tiếp theo

Chờ bạn duyệt `proposal.md` (nói “continue”), rồi Bước 1 — Hạ tầng gọi AI.
