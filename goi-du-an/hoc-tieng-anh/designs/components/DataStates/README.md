# DataStates

Bộ ba trạng thái cho mọi màn có dữ liệu, cùng với trạng thái bình thường.

- **Đang tải**: khung xương (`b-sk`) cùng bố cục với nội dung thật — hình tròn cho ảnh, thanh bo `radius-pill` cho chữ — trên `surface-sunk`, có vệt sáng chạy. Không dùng vòng xoay toàn màn. Quá 8 giây thì chuyển sang Lỗi.
- **Trống**: rồng *suy nghĩ* + tiêu đề `title` + một câu `body-l` nói bé làm gì tiếp + **một** nút hành động.
- **Lỗi**: rồng *động viên* + câu nhẹ nhàng ("Không phải lỗi của bé đâu") + nút **Thử lại** (`primary`, icon `replay`). Không hiện mã lỗi cho bé; mã lỗi chỉ ở khu vực Bố mẹ.
- Thanh trên cùng và nút thoát vẫn hiện trong cả 3 trạng thái để bé không bị kẹt.

**Người dùng cung cấp**: `kind` (`empty` | `error`), `title`, `text`, `action` (HTML nút), `expr` tùy chọn.
