// Bố cục bản đồ đảo (khung vẽ 1440×760), chép từ designs/components/Screen06-IslandMap/preview.html.
// Mỗi trang có 4 vùng (chủ đề). Thiết kế vẽ 5 chặng mỗi vùng, dữ liệu có 3–6 bài thường nên các chặng được rải đều theo độ dài
// dọc đường đi của vùng; ô trùm nằm cuối vùng.

export const MAP_WIDTH = 1440;
export const MAP_HEIGHT = 760;

/** Số vùng mỗi trang của bản đồ. */
export const ZONES_PER_PAGE = 4;

type Point = readonly [number, number];

export type ZoneSlot = {
  /** Màu nền nhạt của vùng đất (token). */
  tint: string;
  /** 5 điểm mẫu của đường chặng. */
  points: readonly Point[];
  boss: Point;
  label: Point;
  /** Mảng vùng đất bo tròn sau các chặng: x, y (rộng 620, cao 270). */
  patch: Point;
};

export const ZONE_SLOTS: readonly ZoneSlot[] = [
  { tint: "var(--level-2-soft)", points: [[150, 250], [250, 170], [370, 215], [480, 150], [590, 205]], boss: [650, 305], label: [370, 92], patch: [80, 110] },
  { tint: "var(--level-6-soft)", points: [[800, 300], [890, 205], [1005, 250], [1110, 175], [1215, 225]], boss: [1300, 320], label: [1050, 92], patch: [740, 110] },
  { tint: "var(--level-4-soft)", points: [[1290, 470], [1200, 560], [1090, 500], [985, 590], [880, 525]], boss: [790, 620], label: [1120, 690], patch: [740, 410] },
  { tint: "var(--level-5-soft)", points: [[640, 500], [545, 585], [440, 515], [335, 600], [235, 525]], boss: [140, 620], label: [470, 690], patch: [80, 410] },
];

export const PATCH_WIDTH = 620;
export const PATCH_HEIGHT = 270;
export const PATCH_RADIUS = 80;

const dist = (a: Point, b: Point) => Math.hypot(b[0] - a[0], b[1] - a[1]);

/** Vị trí `count` chặng của một vùng: đúng 5 điểm của thiết kế khi `count` = 5, ngược lại rải đều theo độ dài đường đi. */
export function zoneNodePositions(slot: ZoneSlot, count: number): Point[] {
  const pts = slot.points;
  if (count <= 0) return [];
  if (count === pts.length) return pts.map((p) => [p[0], p[1]] as Point);
  if (count === 1) return [pts[0]];

  const lengths = pts.slice(1).map((p, i) => dist(pts[i], p));
  const total = lengths.reduce((a, b) => a + b, 0);
  return Array.from({ length: count }, (_, k) => {
    let target = (total * k) / (count - 1);
    for (let i = 0; i < lengths.length; i++) {
      if (target <= lengths[i] || i === lengths.length - 1) {
        const t = lengths[i] === 0 ? 0 : Math.min(1, target / lengths[i]);
        return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t] as Point;
      }
      target -= lengths[i];
    }
    return pts[pts.length - 1];
  });
}

/** Đường đi qua mọi chặng và trùm của trang theo thứ tự vùng. */
export function islandRoad(points: readonly Point[]): string {
  return points.length === 0 ? "" : "M" + points.map((p) => `${p[0]} ${p[1]}`).join(" L");
}

/** Vị trí phần trăm trong khung bản đồ. */
export const toPercent = (p: Point) => ({ left: `${(p[0] / MAP_WIDTH) * 100}%`, top: `${(p[1] / MAP_HEIGHT) * 100}%` });
