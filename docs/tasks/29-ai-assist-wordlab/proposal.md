# Đề xuất task 29 — AI hỗ trợ soạn Khám phá từ và Họ vần (chờ duyệt — Bước 0)

Ngày 11/10/2026. Đã chạy thử Gemini thật với lời nhắc dự kiến cho 1 từ Khám phá (`volcano`) và 1 họ vần (`-ous`).

## 1. Lựa chọn đã chốt
| Mục | Chọn | Ghi chú |
|---|---|---|
| Nhà cung cấp | **Google Gemini** (khóa miễn phí của bạn) | Khóa đã lưu ở `.env` (`GEMINI_API_KEY`), tên biến giữ chỗ ở `.env.example`. |
| Cách gọi | `fetch` tới REST `generativelanguage.googleapis.com/v1beta/models/<model>:generateContent` | **Không cài gói mới** (task.md dự kiến một gói SDK; không cần). |
| Model | `GEMINI_MODEL`, mặc định `gemini-flash-latest` | Là bí danh nên model có thể đổi theo thời gian; muốn cố định thì điền tên cụ thể ở `.env`. |
| Kết quả | JSON có cấu trúc (`responseMimeType: application/json` + `responseSchema`), kiểm lại bằng Zod | |
| Tốc độ | Tắt “suy nghĩ” (`thinkingBudget: 0`) | Thử thật: khám phá từ **6,5 giây** (có suy nghĩ: 31 giây, một lần quá 60 giây), họ vần **4 giây**. Hết thời gian chờ đặt 40 giây. |

## 2. Hạn mức, chi phí và quyền riêng tư
- Bản miễn phí giới hạn số lượt mỗi phút và mỗi ngày (con số do Google quy định và có thể đổi). Một lượt khám phá từ dùng khoảng 2.200 token vào và 1.000 token ra; họ vần khoảng 430 vào, 270 ra. Để không cạn hạn mức, app giới hạn **6 lượt/phút cho mỗi admin**, nút khóa khi đang chạy, gặp lỗi 429 thì báo “AI đang bận, thử lại sau ít phút”.
- Với bản miễn phí, Google có thể dùng dữ liệu gửi đi để cải thiện sản phẩm. Vì vậy chỉ gửi **từ vựng, nghĩa, cấp, danh sách tên hình** (đều là nội dung công khai của dự án), **không gửi gì về học sinh, tài khoản, email**.
- Khóa chỉ dùng ở server, không xuống client, không ghi log. Khóa này đã dán trong khung chat nên **nên tạo lại sau khi xong task** và điền khóa mới vào `.env`.

## 3. Lời nhắc dự kiến (rút gọn)
**Khám phá từ:** người soạn là giáo viên Việt Nam, học sinh 6–11 tuổi (Starters–Flyers); cho từ, IPA, nghĩa Việt, cấp; yêu cầu 5 nhánh, nhánh 1 là “What’s this?” với đúng một đáp án “a/an từ”; loại câu hỏi chọn trong 9 loại có sẵn; mỗi nhánh 1–5 đáp án (chữ Anh, nghĩa Việt, **khóa hình chỉ chọn trong danh sách hình có thật**), 1–2 hình nhiễu sai rõ ràng, đúng một đáp án `guess` (trừ nhánh nhận diện), một câu cho đoạn văn kèm dịch; câu hỏi/câu văn chỉ dùng từ đơn giản đúng cấp. Trả thêm `suggestedSet` (một trong 5 nhóm hiện có) để chọn sẵn ô “Nhóm từ”.
**Họ vần:** cho vần, danh sách **từ ứng viên có thật trong kho** (từ, IPA, cấp); yêu cầu IPA của vần, 3–8 từ cùng âm, 0–3 từ Bẫy (chỉ chọn trong ứng viên), lời Bẫy tiếng Việt cho Bông, 3 chữ cái đầu nhiễu không tạo từ thật, 2 câu vui ≤ 12 từ kèm dịch.

## 4. Kết quả thử thật
**`volcano` (cấp 5), 6,5 giây, 0 khóa hình lạ:** nhóm gợi ý `places`; 5 nhánh: nhận diện (nhiễu: a castle, a factory) → “What comes out of a volcano?” (fire*, smoke, rock; nhiễu water, snow) → “How does a volcano feel?” (hot*) → “Where can you find a volcano?” (on an island*, in the mountains) → “What happens when a volcano erupts?” (an earthquake*). Hình đáp án đều lấy đúng từ thư viện (gồm các hình cấp 5 mới như `smoke`, `mountain`, `earthquake`); mỗi nhánh có câu và bản dịch tiếng Việt tự nhiên.
**`-ous`, 4 giây:** IPA `/əs/`; từ cùng âm curious, dangerous, delicious, famous, furious, generous, nervous, serious (đều có thật trong kho); Bẫy house, mouse với lời Bông: “house /haʊs/ và mouse /maʊs/ chứa đuôi -ous nhưng đọc là /aʊs/…”; chữ đầu nhiễu b, pl, z; hai câu vui có dịch.

## 5. AI hay sai gì (sẽ chặn hoặc cảnh báo ở Bước 1–3)
- Dùng từ vượt cấp trong câu hỏi (vd “erupts”) → báo “từ ngoài cấp” bằng `unknownTokens`, thử lại tự động một lần.
- Có thể bịa khóa hình hoặc dùng hình chưa vẽ → bỏ hình, ghi “cần vẽ hình: …”; lần thử này không bị.
- Một số nhánh gượng (“What colour is the smoke?” ở lần có suy nghĩ) → người soạn đọc và sửa; đây là lý do **AI chỉ điền form, không lưu**.
- Phân loại cùng âm có thể sai → server **tự tính lại `sameSound` bằng `soundMatches`**, không tin AI.
- Bản dịch tiếng Việt cần người đọc lại (như mọi nội dung tôi soạn).
- Đáp án cũ đã có mp3 sẽ mất mp3 khi thay bằng gợi ý → hộp xác nhận nói rõ.

## 6. Bạn quyết (nếu muốn khác)
1. Giữ giới hạn 6 lượt/phút? (mặc định giữ)
2. Khi form đã có nhánh: hỏi xác nhận rồi **thay** toàn bộ (mặc định), hay chỉ **thêm** nhánh còn thiếu?
3. Tạo lại khóa Gemini sau khi xong task (nên làm).
Không phản hồi thì tôi làm theo mặc định khi bạn nói “continue”.
