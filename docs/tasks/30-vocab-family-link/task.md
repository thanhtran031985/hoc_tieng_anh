# 30-vocab-family-link — Ngân hàng từ vựng: xem từ thuộc Họ vần nào và bấm để mở

Ngày tạo: 11/10/2026 · Giai đoạn: GĐ2 · Phụ thuộc: 26, 27 · Nhánh: `feat/30-vocab-family-link`

> Bản nháp do Claude viết từ yêu cầu ngày 11/10/2026: “ở trang Ngân hàng từ vựng, tôi muốn biết từ đó đã được thêm vào Họ vần nào, có thể click vào đó để biết từ đó thuộc họ vần nào”. Bạn đọc mục “Claude hiểu yêu cầu như sau” và sửa trước khi bắt đầu.

## Claude hiểu yêu cầu như sau
- **Hiện tại:** màn Quản trị › Ngân hàng từ vựng có các cột Từ, Phiên âm, Loại từ, Nghĩa, Hình · Âm, Khám phá… nhưng **không cho biết** từ đó có nằm trong Họ vần nào. Muốn biết phải sang màn Họ vần và mở từng họ.
- **Mong muốn:** mỗi hàng từ cho thấy các Họ vần mà từ đó là thành viên (ví dụ `cat` → `-at`; `house` → `-ouse` Cùng âm, `-ous` Bẫy). Bấm vào một họ thì mở họ vần đó để xem/sửa, không phải nhớ rồi tự đi tìm.
- **Một từ có thể thuộc 0, 1 hoặc nhiều họ** (bảng `word_family_members`, khóa duy nhất theo cặp họ + từ), và trong mỗi họ từ là **Cùng âm** hoặc **Bẫy: khác âm**; họ có thể **Nháp** hoặc **Xuất bản**. Cả ba thông tin này nên nhìn thấy được.
- **Chỉ xem và chuyển tới họ vần**, không thêm hay bỏ từ khỏi họ ngay ở màn từ vựng (việc đó vẫn làm ở màn Họ vần). Nếu bạn muốn cả thêm/bỏ ở màn từ vựng thì nói, tôi sẽ mở rộng.

## Mục tiêu
Ở bảng Ngân hàng từ vựng (và ngăn kéo chi tiết của từ) người soạn thấy ngay từ thuộc Họ vần nào, lọc được từ chưa thuộc họ nào, và bấm một họ để mở ngăn kéo soạn Họ vần của họ đó.

## Thiết kế
Không có màn mới, dùng thành phần Adult sẵn có: thêm một cột và một mục trong ngăn kéo của màn Ngân hàng từ vựng (cùng kiểu cột “Khám phá”), mở lại ngăn kéo `FamilyDrawer` của Adult23. Các thư mục `designs/components/*` liên quan: màn Họ vần `Adult23-WordFamilies` (đã chuyển ở task 26) và khung bảng/ngăn kéo Quản trị đã dùng ở task 12. Nếu thiết kế mới của bạn cho cột này khác, hãy báo.

## Bối cảnh & môi trường
- Màn: `src/features/admin/VocabView.tsx` (cột `explorerState`, ngăn kéo chi tiết có mục “Khám phá từ”), dữ liệu: `src/server/admin/vocab.ts` (đã gộp Khám phá theo từ bằng một truy vấn, không N+1).
- Họ vần: `src/server/admin/family.ts`, `src/features/admin/FamilyDrawer.tsx` (nhận `familyId`, `onClose`, `onSaved`), `FamiliesView.tsx` là mẫu cách mở ngăn kéo.
- Dữ liệu: bảng `word_families` (`pattern`, `sound_ipa`, `status`), `word_family_members` (`family_id`, `word_id`, `same_sound`). Không cần migration.

## Quyết định kiến trúc
- Chỉ đọc: thêm một truy vấn gộp theo từ vào `getVocabAdmin` (một lần cho cả trang, không truy vấn từng hàng); không bảng mới, không ghi.
- Gộp và sắp xếp (vần theo bảng chữ cái, họ Cùng âm trước họ Bẫy) viết thành hàm thuần ở `src/lib/rules/` kèm test, không đặt trong component.
- Bấm một họ mở `FamilyDrawer` ngay trong màn từ vựng (giống nút Khám phá), không rời trang; đóng hoặc lưu xong thì làm mới bảng để cột cập nhật.
- Quyền: giữ nguyên, màn và server action chỉ cho `admin` (`requireAdmin()` ở dòng đầu mọi action mới).
- Chữ trên giao diện tiếng Việt; chỉ dùng design token.

## Các bước
### Bước 0 — Kiểm tra hiện trạng (không sửa code)
Đọc `VocabView.tsx`, `vocab.ts`, `FamilyDrawer.tsx`, `FamiliesView.tsx`; đếm trên database thử số từ thuộc 0, 1, 2+ họ; xem cột “Khám phá” để làm cột mới cùng kiểu; nêu 2–3 cách trình bày (chip `-at` / “2 họ” / danh sách) và đề xuất một cách trước khi làm.
**Kiểm tra:** báo cáo hiện trạng và đề xuất; DỪNG chờ tôi duyệt.
### Bước 1 — Dữ liệu và hàm thuần
`getVocabAdmin` trả thêm `families` cho mỗi từ: danh sách `{ familyId, pattern, soundIpa, sameSound, status }`; hàm thuần gộp/sắp xếp có test (từ không họ nào, một họ, nhiều họ, vừa Cùng âm vừa Bẫy ở hai họ khác).
**Kiểm tra:** `npm test`, `npx tsc --noEmit`, `npm run lint` sạch; truy vấn chạy một lần cho cả trang.
### Bước 2 — Cột “Họ vần”, bộ lọc và mục trong ngăn kéo
Cột mới hiện các họ dưới dạng chip (`-at`, từ Bẫy có dấu hiệu riêng, họ Nháp mờ hơn như cột Khám phá; nhiều họ thì hiện tối đa vài chip rồi “+n”), từ chưa thuộc họ nào ghi “Chưa có”; bộ lọc “Họ vần” (Có / Chưa có) và sắp xếp theo số họ; ngăn kéo chi tiết của từ có mục “Họ vần” liệt kê đầy đủ các họ.
**Kiểm tra:** Edge không đầu trên database thử: từ thuộc 0, 1, nhiều họ hiện đúng; lọc và sắp xếp đúng; không cuộn ngang ở 1366×768, 1440×900.
### Bước 3 — Bấm chip mở Họ vần
Bấm chip hoặc dòng trong ngăn kéo mở `FamilyDrawer` của họ đó; sửa và lưu họ xong thì bảng từ vựng cập nhật; dùng được bằng bàn phím (Tab, Enter) và có nhãn `aria-label` rõ (“Mở họ vần -at của từ cat”).
**Kiểm tra:** Edge không đầu: bấm chip mở đúng họ (cả họ Nháp và Xuất bản), đóng thì về đúng chỗ trong bảng; xóa từ khỏi họ ở màn Họ vần rồi quay lại thì chip biến mất.
### Bước 4 — Kiểm tra cuối
`tests/e2e/30-*.spec.ts` (tên test tiếng Việt, ghi dòng “Kiểm tra” đang kiểm); chạy cần bạn đồng ý riêng vì `npm run test:e2e:db` làm `prisma migrate reset` trên database thử. `npx tsc --noEmit`, `npm run lint`, `npm run build` sạch.

## Phạm vi
- Được tạo/sửa: `src/server/admin/vocab.ts`, `src/features/admin/VocabView.tsx` (+ CSS module), hàm thuần và test ở `src/lib/rules/`, `tests/e2e/30-*.spec.ts`, tài liệu của task.
- KHÔNG làm trong task này: thêm hoặc bỏ từ khỏi họ ngay ở màn từ vựng; sửa nội dung họ vần; đổi màn Họ vần; AI; chiều ngược lại ở màn Họ vần (đã có danh sách từ của họ).

## Tiêu chí hoàn thành
- Mỗi từ trong bảng Ngân hàng từ vựng cho thấy các Họ vần của nó (kèm Cùng âm/Bẫy và Nháp/Xuất bản) hoặc “Chưa có”.
- Bấm một họ mở đúng họ vần đó; lọc “Họ vần” và ngăn kéo chi tiết hoạt động.
- Không truy vấn thừa theo hàng; `tsc`, `lint`, `build` sạch.

## Câu hỏi cần bạn trả lời (mặc định ghi sẵn; không trả lời thì Claude làm theo mặc định)
1. Cách hiện trong bảng: chip theo từng họ (`-at`), tối đa 2–3 chip rồi “+n” (mặc định).
2. Từ Bẫy ở một họ có hiện không? Có, kèm dấu hiệu “Bẫy” (mặc định).
3. Bấm chip mở ngăn kéo Họ vần tại chỗ (mặc định), hay chuyển sang trang Họ vần?
4. Có cần thêm/bỏ từ khỏi họ ngay ở màn từ vựng không? Mặc định: không.
