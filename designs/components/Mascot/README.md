# Mascot

Rồng Bông — linh vật đồng hành của bộ Tiểu học, vẽ bằng SVG với nét viền `dragon-line`, 6 biểu cảm, 4 màu cho bé chọn.

| Biểu cảm (`expr`) | Khi nào dùng |
| --- | --- |
| `chao` | Đăng nhập, trang chủ, mở đầu bài, giới thiệu |
| `vui` | Trả lời đúng, nối đúng, ghép cặp đúng |
| `dongvien` | Chưa đúng, lỗi tải, hỏi trước khi thoát — luôn đi với lời nhẹ nhàng và nút thử lại |
| `suynghi` | Đang tải, trạng thái trống, gợi ý, khoá |
| `ngu` | Hết giờ học |
| `chucmung` | Kết thúc bài, qua cấp, thắng trùm |

- Gọi `Bong.dragon(expr, size)`. Màu lấy từ `dragon-body`, `dragon-belly`, `dragon-wing`, `dragon-cheek`; đổi màu bằng lớp `dragon-dao`, `dragon-nang`, `dragon-tim` trên vùng chứa.
- Cỡ: 280–340px ở màn chào/chúc mừng, 120–220px ở trạng thái trống/lỗi, 76–112px trong dải phản hồi và chân bài.
- Lời thoại đặt trong `bubble` (`body-l`), ≤ 2 dòng, xưng "Bông", gọi bé bằng tên.
- Rồng **không bao giờ** buồn bã, khóc hay chê. Biểu cảm khi sai luôn là `dongvien`.
- Chuyển động nhẹ (nhún, vẫy tay, thở); tắt khi người dùng bật giảm chuyển động.
