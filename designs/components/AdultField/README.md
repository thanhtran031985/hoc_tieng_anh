# AdultField

Biểu mẫu và nút khu người lớn.

- `Bong.A.field({ id, label, type: text | password | select | textarea | seg, value, options, required, hint, error, suffix, en })` — nhãn `adm-h3`, ô cao `adm-control` (36px), bo `adm-radius-md`.
- Lỗi luôn nằm ngay dưới ô: `<p id="…-e" role="alert">` có icon cảnh báo, chữ `field-error`, ô nền `field-error-bg`, `aria-invalid` + `aria-describedby`. Không dùng đỏ.
- `Bong.A.wireValidate(root, rules)` báo lỗi khi rời ô; `Bong.A.validate(root, rules)` khi bấm Lưu (focus ô lỗi đầu tiên); `Bong.A.setErr(root, id, msg)`.
- `Bong.A.btn({ label, variant, size: 'l' | 's', icon })`: 44 / 36 / 30px. Hành động không hoàn tác: `cls: 'a-btn--danger'` (`adm-danger` / `adm-on-danger`, 5.85:1) hoặc viền `a-btn--danger-o`, luôn qua hộp thoại.
- `Bong.A.toggle(id, label, on, sub)`: công tắc `role=switch`.
- `Bong.A.dialog(scr, { title, body, actions })`: không linh vật; `onClick(wrap)` trả về `false` để giữ hộp thoại và báo lỗi ô bên trong.
