# LevelGate

12a. Cổng bài thi lên cấp.

- `Bong.LevelGate({ locked, left, next })` trả về một `<button data-gate>`.
- Khoá: lòng cổng tối `gate-dark`, song chắn, ổ khoá, nhãn “Còn N vùng”, `aria-disabled`, aria-label nói số vùng còn lại.
- Mở: lòng cổng sáng `gate-glow`, lấp lánh, nhãn “Bài thi lên cấp”; rê chuột nhích lên.
- Đá cổng `gate-stone`, gờ `gate-stone-shade`. Tab tới được, Enter/Space để bấm.
