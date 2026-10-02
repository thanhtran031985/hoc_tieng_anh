# AdultKpi

Thẻ số liệu, nhãn trạng thái và 4 trạng thái dữ liệu của khu người lớn.

- `Bong.A.kpi({ label, value, unit, icon, delta, sub, extra })` — số `adm-kpi` (28px), nhãn `adm-label`; tăng hiện `success-shade`.
- `Bong.A.status(kind, label)` — `live` / `ok` (xanh), `warn` (`field-error` trên `field-error-bg`), `draft` / `off` (xám), `info` (`brand-soft`); luôn icon + chữ.
- `Bong.A.toast(scr, text)` — thông báo nhỏ đáy màn, `role=status`.
- Trạng thái: `Bong.A.skel(h)` khung xương; `Bong.A.empty({ title, text, action })` — rồng Bông 64px (nơi duy nhất có linh vật); `Bong.A.error({ title, text, code })` — nút Thử lại `data-retry` + mã lỗi.
