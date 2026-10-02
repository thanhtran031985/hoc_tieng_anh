# StatChip

Chip bo tròn trên `surface`: biểu tượng màu (sao `star`, xu `coin`, lửa `streak`) + số kiểu `stat`.

- Luôn theo thứ tự **Sao · Xu · Chuỗi ngày** ở bên phải thanh trên cùng (`size-topbar` 72px).
- Khi nhận thưởng, sao bay vào chip và chip nảy (`is-bump`).
- Chuỗi ngày bị đứt thì về 0 nhẹ nhàng, không cảnh báo, không mất sao/xu.
- Bên trái thanh: nút quay lại (nếu có), ảnh + tên bé + nhãn cấp.
