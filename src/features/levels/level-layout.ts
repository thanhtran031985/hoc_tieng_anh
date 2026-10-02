// Bố cục con đường qua 10 cấp (khung vẽ 1440×740, chép từ designs/components/Screen05-Levels/preview.html).
// Hàng dưới từ trái sang phải là 5 đảo Tiểu học; hàng trên từ phải sang trái là 5 thành phố THCS.

export const LEVELS_MAP_WIDTH = 1440;
export const LEVELS_MAP_HEIGHT = 740;

/** Tâm điểm dừng của cấp 1–10 (theo thứ tự cấp). */
export const LEVEL_POINTS: readonly (readonly [number, number])[] = [
  [150, 560],
  [420, 610],
  [690, 548],
  [960, 606],
  [1240, 540],
  [1250, 226],
  [985, 176],
  [720, 226],
  [455, 176],
  [190, 226],
];

/** Đường cong mượt (Catmull-Rom → Bézier) đi qua các điểm dừng, vào từ góc dưới trái và ra ở góc trên trái. */
export function roadPath(): string {
  const a: (readonly [number, number])[] = [[20, 650], ...LEVEL_POINTS.slice(0, 5), [1390, 390], ...LEVEL_POINTS.slice(5), [30, 150]];
  let d = `M${a[0][0]} ${a[0][1]}`;
  for (let i = 0; i < a.length - 1; i++) {
    const p0 = a[i - 1] ?? a[i];
    const p1 = a[i];
    const p2 = a[i + 1];
    const p3 = a[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x} ${c1y} ${c2x} ${c2y} ${p2[0]} ${p2[1]}`;
  }
  return d;
}

/** Vị trí phần trăm của điểm dừng trong khung bản đồ. */
export function stopPosition(level: number): { left: string; top: string } {
  const [x, y] = LEVEL_POINTS[Math.min(10, Math.max(1, level)) - 1];
  return { left: `${(x / LEVELS_MAP_WIDTH) * 100}%`, top: `${(y / LEVELS_MAP_HEIGHT) * 100}%` };
}
