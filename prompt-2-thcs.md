# Prompt 2: Bộ giao diện THCS

Dán toàn bộ đoạn dưới vào cùng dự án Claude Design "Học cùng Bông".

```text
Tiếp tục hệ thống giao diện "Học cùng Bông" đã có trong dự án này. Lần này hãy thiết kế bộ giao diện THCS (cấp 6–10, học sinh 11–15 tuổi) trên theme `thcs` đã dành sẵn. Giữ nguyên lõi chung và thêm vào cùng thư viện, cùng cách xem trước như các màn Tiểu học. Không sửa hay làm hỏng các màn Tiểu học đã có. Lõi chung gồm: màu 10 cấp (level-6 Singapore, level-7 Sydney, level-8 London, level-9 New York, level-10 Toronto), màu phản hồi (đúng là xanh lá, chưa đúng là cam nhẹ, không dùng đỏ gắt), thang khoảng cách, nhãn phím tắt, dải phản hồi và 4 trạng thái dữ liệu.

Phong cách: hiện đại, gọn gàng như app học tập cho tuổi teen, nhiều chữ hơn Tiểu học nhưng vẫn thân thiện. Font Be Vietnam Pro (họ chữ `thcs`). Nút chính cao tối thiểu 44 px, chữ tiếng Anh trong bài tối thiểu 20 px. Có chế độ sáng và tối: thêm bộ token màu cho chế độ tối, chuyển bằng nút trên thanh trên cùng. Rồng Bông giờ đã lớn hơn, dáng tuổi teen, chỉ xuất hiện nhỏ ở góc hoặc trong lời nhắc. Khung thiết kế 1440×900. Các màn bài học vừa màn 1366×768 mà không cần cuộn. Phím tắt giữ như Tiểu học: 1–4 hoặc A–D chọn đáp án, Enter kiểm tra, Space nghe lại, H gợi ý, Esc thoát.

Điều hướng: thanh menu bên trái thu gọn được (chỉ còn icon), gồm Trang chủ, Lộ trình, Học theo SGK, Ngữ pháp, Luyện thi, Ôn tập, Sổ từ, Thành tích; dưới cùng là ảnh hồ sơ và nút đổi hồ sơ. Thanh trên cùng có XP, chuỗi ngày và nút sáng/tối. Phần thưởng là điểm kinh nghiệm (XP), huy hiệu và danh hiệu, thay cho sao và xu của Tiểu học. Làm sai không bị phạt: hiện giải thích ngắn vì sao sai và cho làm lại. Đồng hồ đếm ngược chỉ có trong bài thi.

Các màn hình:
1. Trang chủ: mục tiêu hôm nay dạng vòng tiến độ XP, nút Học tiếp, số thẻ ôn tập đến hạn, mục "Điểm yếu cần ôn", lịch kiểm tra sắp tới ở trường, chuỗi ngày, biểu đồ XP trong tuần.
2. Lộ trình: bản đồ thế giới nối 5 thành phố (cấp 6–10), đánh dấu thành phố hiện tại, đã qua và còn khóa; một dải nhỏ tóm tắt 5 đảo Tiểu học đã hoàn thành.
3. Bản đồ cấp 8 London: các chủ đề là địa danh trên bản đồ thành phố, mỗi chủ đề hiện % hoàn thành và bài kiểm tra chủ đề; góc "Bạn có biết?" về văn hóa Anh.
4. Bài giảng ngữ pháp (ví dụ: thì hiện tại hoàn thành): khung công thức, giải thích bằng tiếng Việt, ví dụ có nút nghe, mẹo nhớ, lỗi hay gặp, 3 câu kiểm tra nhanh.
5. Câu trắc nghiệm A/B/C/D có nhãn phím; sau khi trả lời thì hiện giải thích.
6. Bài phát âm và trọng âm: 4 từ có phần gạch chân hoặc được chia âm tiết, bấm để nghe từng từ.
7. Viết lại câu không đổi nghĩa: câu gốc, phần đầu của câu mới, ô để gõ.
8. Đọc hiểu 2 cột: đoạn văn bên trái, câu hỏi bên phải, bấm vào từ để tra nghĩa.
9. Viết đoạn văn: đề bài, gợi ý ý, ô viết có đếm từ (80–120 từ), khu vực nhận xét.
10. Kết thúc bài: % câu đúng, XP nhận được, huy hiệu mới nếu có, danh sách từ và điểm ngữ pháp vừa học, các câu sai để xem lại, nút Bài tiếp theo và Về lộ trình.
11. Ôn tập hôm nay: số thẻ đến hạn chia theo 5 hộp ghi nhớ, ôn cả từ vựng và ngữ pháp, nút Bắt đầu ôn.
12. Sổ từ: bảng từ có tìm kiếm, phiên âm, nghĩa, nút nghe, mức thuộc 1–5, bộ lọc theo cấp, chủ đề và mức thuộc.
13. Học theo SGK: chọn lớp, lưới Unit có % hoàn thành, trang Unit có 4 tab Từ vựng, Ngữ pháp, Luyện tập, Kiểm tra.
14. Làm bài thi: đồng hồ đếm ngược, bảng số câu (đã làm, chưa làm, đánh dấu xem lại), nút nộp bài.
15. Kết quả thi: điểm thang 10, phân tích theo dạng bài, đúng/sai từng câu kèm giải thích, nút "Ôn lại câu sai".
16. Thành tích: huy hiệu, danh hiệu theo cấp, biểu đồ XP theo tuần, kỷ lục cá nhân.
17. Hết giờ học: lời nhắn ngắn gọn kèm số phút đã học hôm nay và hẹn ngày mai.

Yêu cầu thêm: mọi màn có dữ liệu thiết kế đủ 4 trạng thái (bình thường, đang tải dạng khung xương, trống, lỗi có nút thử lại) và xem được ở cả chế độ sáng và tối. Có viền focus rõ khi dùng phím Tab, chữ đủ tương phản ở cả hai chế độ. Dùng nội dung thật theo chương trình THCS (từ, câu, đoạn đọc tiếng Anh thật như "I have lived in Hanoi since 2015"), không dùng lorem ipsum. Mọi màu, cỡ chữ, bo góc, bóng đổ, khoảng cách mới đều đặt tên thành token, và cập nhật trang tổng hợp hệ thống giao diện để liệt kê thêm token của THCS và chế độ tối.
```
