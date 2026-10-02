# 02-ui-kit — Bộ thành phần giao diện Tiểu học

Ngày tạo: 02/10/2026 · Giai đoạn: GĐ1 · Phụ thuộc: 01 · Nhánh: `feat/02-ui-kit`

## Mục tiêu
Chuyển các thành phần dùng chung của "Học cùng Bông" thành React component dùng lại được cho mọi màn.

## Phạm vi
- Trong: Button, SpeakerButton (phát âm), KeyHint, Card + thẻ đáp án, ProgressBar, Dialog, FeedbackBar, Mascot (rồng Bông 6 biểu cảm, 4 màu), StatChip + Topbar, DataStates + khung xương, Icons, WordPicture; hook phím tắt; trang `/dev/ui` để xem.
- Ngoài: màn hình nghiệp vụ, dữ liệu thật.

## Thiết kế
`designs/components/` các thư mục: Button, SpeakerButton, KeyHint, Card, ProgressBar, Dialog, FeedbackBar, Mascot, StatChip, DataStates, Icons, WordPictures, LevelColors; `index.d.ts`; `bundle.css`; `bundle.js`.

## Quyết định kiến trúc
- Props theo `designs/components/index.d.ts`.
- Rồng Bông và icon tách thành component SVG, giữ nguyên nét vẽ trong `bundle.js`.
- Phát âm GĐ1: dùng tệp mp3 nếu từ có `audio`, nếu không thì dùng giọng đọc của trình duyệt (speechSynthesis, giọng en-US/en-GB theo cài đặt).
- Hook `useHotkeys` dùng chung: 1–4, Enter, Space, ←/→, Esc; không chạy khi đang gõ trong ô nhập.
- Tôn trọng `prefers-reduced-motion`.

## Các bước
### Bước 0 — Button, KeyHint, Icons
**Kiểm tra:** `/dev/ui` hiện đủ 6 kiểu nút × 4 trạng thái và viền focus khi Tab, giống `Button/preview.html`.
### Bước 1 — Mascot và WordPicture
**Kiểm tra:** 6 biểu cảm × 4 màu hiển thị đúng; có `prefers-reduced-motion` thì rồng đứng yên.
### Bước 2 — SpeakerButton
**Kiểm tra:** bấm loa đọc đúng từ; có vòng sóng khi đang phát; có `aria-label`.
### Bước 3 — Card, thẻ đáp án, ProgressBar, StatChip, Topbar
**Kiểm tra:** thẻ đáp án đủ trạng thái thường, rê chuột, đang chọn, đúng (✓), chưa đúng (↻), mờ.
### Bước 4 — Dialog, FeedbackBar, DataStates, khung xương
**Kiểm tra:** Dialog giữ focus trong hộp, Esc đóng và trả focus; FeedbackBar trượt lên, Enter bấm nút; DataStates đủ Trống và Lỗi.

## Kiểm tra cuối task
tsc, lint, build không lỗi; so sánh `/dev/ui` với từng `preview.html` ở 1440×900 và 1366×768.
