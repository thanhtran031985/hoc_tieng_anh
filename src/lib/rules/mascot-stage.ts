// Rồng Bông lớn lên (designs/components/MascotGrowth): dáng theo cấp hiện tại của bé.
// 1 Hạt giống · 2 Mầm non · 3 Lá xanh (dáng gốc) · 4 Cành cây · 5 Cây lớn. Cấp 6–10 (THCS) vẫn giữ dáng 5, rồng tuổi teen là thành phần riêng.

export type MascotStage = 1 | 2 | 3 | 4 | 5;

/** Dáng của rồng Bông ứng với số cấp (1–10). Ngoài khoảng thì lấy dáng gần nhất. */
export function stageForLevel(levelNumber: number): MascotStage {
  const n = Math.trunc(levelNumber);
  if (!Number.isFinite(n) || n <= 1) return 1;
  if (n >= 5) return 5;
  return n as MascotStage;
}
