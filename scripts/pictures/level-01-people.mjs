// Cấp 1: chào hỏi, số đếm, màu sắc và gia đình.
import { C, LINE, circle, ellipse, rect, path, poly, blob, dot, stroke, shine, thick, g, eye, cheek, union, uc, ue, ur, cloud, star, rays, face, heart, torso, rayCircle } from "./lib.mjs";

const hairCap = (fill) => path("M26 56 Q24 18 60 18 Q96 18 94 56 Q84 36 66 40 Q54 30 40 42 Q32 44 26 56Z", fill);
const portrait = (shirt, hair, extra = "") => torso(shirt) + face() + hair + extra;
const spot = "M60 14 C82 12 104 30 102 56 C110 70 104 98 80 102 C66 112 40 108 30 96 C10 88 12 62 22 50 C20 30 40 14 60 14Z";
const swatch = (fill, dotAt) => path(spot, fill) + circle(dotAt[0], dotAt[1], 7, fill) + stroke("M40 40 C44 34 50 32 56 32", "#fff", 5).replace("/>", ' opacity=".6"/>');
const grid = (n, r, color, x0, y0, dx, dy, cols) => Array.from({ length: n }, (_, i) => circle(x0 + (i % cols) * dx, y0 + Math.floor(i / cols) * dy, r, color)).join("");
const glasses = (y = 62) => circle(46, y, 11, "none") + circle(74, y, 11, "none") + stroke(`M57 ${y} H63`, LINE, 3);

// Số 4–10: các chấm xếp theo hàng (1–3 lấy từ thiết kế); số 11–20 không có hình vì khó phân biệt bằng số chấm.
const dotRows = { four: [2, 2], five: [2, 1, 2], six: [3, 3], seven: [3, 4], eight: [4, 4], nine: [3, 3, 3], ten: [5, 5] };
const dotColors = [C.coral, C.blue, C.green, C.purple, C.pink, C.orange, C.deepBlue];
const counting = {};
Object.entries(dotRows).forEach(([word, rows], k) => {
  const gap = Math.min(32, 104 / Math.max(...rows));
  const r = gap / 2 - 3;
  const top = 60 - ((rows.length - 1) * gap) / 2;
  counting[word] = rows.flatMap((count, row) => Array.from({ length: count }, (_, i) => circle(60 + (i - (count - 1) / 2) * gap, top + row * gap, r, dotColors[k]))).join("");
});

export const people = {
  ...counting,

  // ---- Chào hỏi
  hello: portrait(C.coral, hairCap(C.brown), thick("M96 112 L100 74", C.skin, 9) + circle(100, 66, 10, C.skin) + stroke("M110 52 q6 8 0 16 M116 44 q10 14 0 32", C.yellow, 3.5)),
  hi: path("M30 108 V66 Q26 52 36 48 Q44 46 48 56 V26 Q48 12 60 14 Q68 16 68 28 V22 Q70 10 80 12 Q88 14 86 26 V34 Q94 26 100 34 Q104 42 98 54 L94 76 Q94 108 66 108Z", C.skin) + stroke("M12 40 q-4 12 0 24 M4 32 q-8 20 0 40 M108 26 l8 -8 M112 42 l10 -2", C.yellow, 4),
  goodbye: path("M34 108 V70 Q30 56 40 52 Q48 50 52 60 V30 Q52 16 64 18 Q72 20 72 32 V26 Q74 14 84 16 Q92 18 90 30 V38 Q98 30 104 38 Q108 46 102 58 L98 80 Q98 108 70 108Z", C.skin) + stroke("M14 56 q-8 12 0 30 M6 44 q-14 28 0 56", C.coral, 4) + heart(20, 24, 1.1, C.pink),
  name: rect(12, 28, 96, 66, C.white, 10) + rect(12, 28, 96, 18, C.red, 10) + circle(36, 66, 11, C.skin) + path("M20 90 Q22 76 36 76 Q50 76 52 90Z", C.deepBlue) + stroke("M62 62 H98 M62 74 H92", C.grey, 4) + circle(60, 22, 6, C.grey),
  boy: portrait(C.deepBlue, hairCap(C.brown)),
  girl: portrait(C.pink, path("M24 66 Q22 16 60 16 Q98 16 96 66 V70 Q86 36 60 36 Q34 36 24 70Z", C.ink) + circle(34, 36, 8, C.pink) + circle(86, 36, 8, C.pink) + circle(34, 36, 3, C.red) + circle(86, 36, 3, C.red)),
  friend: [[34, C.coral, C.brown], [86, C.green, C.ink]].map(([x, c, h]) => circle(x, 54, 22, C.skin) + path(`M${x - 22} 52 Q${x - 22} 24 ${x} 24 Q${x + 22} 24 ${x + 22} 52 Q${x} 38 ${x - 22} 52Z`, h) + eye(x - 8, 56, 3.5) + eye(x + 8, 56, 3.5) + stroke(`M${x - 6} 66 q6 5 12 0`) + path(`M${x - 24} 108 Q${x - 24} 82 ${x} 80 Q${x + 24} 82 ${x + 24} 108Z`, c)).join("") + thick("M52 96 H68", C.skin, 8) + heart(60, 20, 0.8, C.red),
  teacher: portrait(C.deepBlue, path("M22 62 Q18 14 60 14 Q102 14 98 62 Q92 34 60 34 Q28 34 22 62Z", C.brown), thick("M104 118 L108 60", C.brown, 4) + circle(108, 54, 7, C.red)) + circle(46, 62, 11, "none") + circle(74, 62, 11, "none") + stroke("M57 62 H63", LINE, 3),
  student: torso(C.coral) + face() + hairCap(C.ink) + rect(8, 92, 22, 24, C.deepBlue, 5) + rect(92, 94, 22, 20, C.cream, 3) + stroke("M96 100 H110 M96 106 H108", LINE, 2.5) + stroke("M34 96 L26 92 M86 96 L94 94", C.coral, 5),
  yes: circle(60, 60, 46, C.green) + stroke("M34 62 L52 80 L88 40", C.white, 12),
  no: circle(60, 60, 46, C.red) + stroke("M38 38 L82 82 M82 38 L38 82", C.white, 12),
  please: path("M60 108 Q34 98 32 66 Q34 40 54 18 Q60 10 66 18 Q86 40 88 66 Q86 98 60 108Z", C.skin) + stroke("M60 22 V100", "#d7a273", 3) + stroke("M26 26 l8 8 M94 26 l-8 8 M60 4 V12", C.yellow, 4),
  thanks: heart(60, 54, 3.8, C.red) + path("M8 98 Q30 82 58 90 Q40 108 10 108Z", C.skin) + path("M112 98 Q90 82 62 90 Q80 108 110 108Z", "#f5d3a8") + shine("M42 40 q6 -12 16 -14"),
  sorry: face({ mouth: "none" }) + stroke("M50 82 Q60 74 70 82", LINE, 3.5) + stroke("M38 54 L54 48 M82 54 L66 48", LINE, 3.5) + path("M24 106 Q26 86 44 80 L54 96 Q40 112 24 106Z", C.skin) + path("M96 106 Q94 86 76 80 L66 96 Q80 112 96 106Z", "#f5d3a8"),

  // ---- Màu sắc (xanh, đỏ, vàng, xanh lá lấy từ thiết kế)
  pink: swatch(C.pink, [100, 22]),
  purple: swatch(C.purple, [20, 100]),
  brown: swatch(C.brown, [104, 98]),
  black: swatch(C.ink, [16, 22]),
  white: path(spot, C.white) + circle(20, 100, 7, C.white) + stroke("M40 40 C44 34 50 32 56 32", "#c9ced6", 5),
  grey: swatch(C.grey, [100, 100]),
  colour: [C.red, C.yellow, C.blue].map((c, i) => thick(`M${20 + i * 40} 112 V${44 - (i % 2) * 8}`, c, 20)).join("") + [C.red, C.yellow, C.blue].map((c, i) => poly(`${10 + i * 40},${44 - (i % 2) * 8} ${30 + i * 40},${44 - (i % 2) * 8} ${20 + i * 40},${20 - (i % 2) * 8}`, C.cream)).join("") + [C.red, C.yellow, C.blue].map((c, i) => poly(`${15 + i * 40},${30 - (i % 2) * 8} ${25 + i * 40},${30 - (i % 2) * 8} ${20 + i * 40},${20 - (i % 2) * 8}`, c)).join(""),
  rainbow: [[50, C.red], [42, C.orange], [34, C.yellow], [26, C.green], [18, C.blue]].map(([r, c]) => stroke(`M${60 - r} 92 A${r} ${r} 0 0 1 ${60 + r} 92`, LINE, 12) + "").join("") + [[50, C.red], [42, C.orange], [34, C.yellow], [26, C.green], [18, C.blue]].map(([r, c]) => stroke(`M${60 - r} 92 A${r} ${r} 0 0 1 ${60 + r} 92`, c, 7)).join("") + cloud(24, 96, 0.6) + cloud(96, 96, 0.6),

  // ---- Gia đình
  family: [[24, 54, C.coral], [60, 60, C.deepBlue], [96, 54, C.pink]].map(([x, y, c], i) => circle(x, y, i === 1 ? 14 : 18, C.skin) + eye(x - 5, y - 1, 2.5) + eye(x + 5, y - 1, 2.5) + stroke(`M${x - 4} ${y + 7} q4 3 8 0`, LINE, 2.5) + path(`M${x - 22} 108 Q${x - 22} ${y + 26} ${x} ${y + 24} Q${x + 22} ${y + 26} ${x + 22} 108Z`, c)).join("") + heart(60, 20, 1.2, C.red),
  mum: portrait(C.pink, path("M24 66 Q20 14 60 14 Q100 14 96 66 V88 Q88 98 86 70 Q84 40 60 38 Q36 40 34 70 Q32 98 24 88Z", C.brown) + circle(88, 30, 7, C.red)),
  dad: portrait(C.deepBlue, hairCap(C.ink), poly("56,98 64,98 66,112 60,118 54,112", C.red)),
  brother: portrait(C.leaf, hairCap(C.brown)),
  sister: portrait(C.yellow, path("M24 66 Q22 16 60 16 Q98 16 96 66 V70 Q86 36 60 36 Q34 36 24 70Z", C.brown) + circle(34, 36, 8, C.purple) + circle(86, 36, 8, C.purple)),
  grandma: portrait(C.purple, union("#e6eaf2", uc(60, 22, 20), uc(34, 40, 12), uc(86, 40, 12)) + path("M30 48 Q60 20 90 48 Q60 36 30 48Z", "#e6eaf2")) + circle(46, 62, 11, "none") + circle(74, 62, 11, "none") + stroke("M57 62 H63", LINE, 3),
  grandpa: portrait(C.brown, path("M26 56 Q24 20 60 20 Q96 20 94 56 Q92 38 60 36 Q28 38 26 56Z", "#e6eaf2") + path("M38 78 Q60 62 82 78 Q60 90 38 78Z", "#e6eaf2")),
  baby: torso(C.sky) + circle(60, 64, 34, C.skin) + path("M28 52 Q28 22 60 22 Q92 22 92 52 Q60 38 28 52Z", C.pink) + circle(60, 20, 6, C.pink) + eye(48, 64, 5) + eye(72, 64, 5) + cheek(40, 76) + cheek(80, 76) + circle(60, 80, 7, C.coral),
  man: portrait(C.green, path("M26 56 Q24 20 60 20 Q96 20 94 56 Q92 38 60 36 Q28 38 26 56Z", C.brown) + path("M34 74 Q60 100 86 74 Q80 92 60 94 Q40 92 34 74Z", "#6b4a2a")),
  woman: portrait(C.coral, path("M24 66 Q20 14 60 14 Q100 14 96 66 Q90 38 60 36 Q30 38 24 66Z", C.ink)),
  aunt: portrait(C.purple, path("M24 66 Q20 14 60 14 Q100 14 96 66 Q90 38 60 36 Q30 38 24 66Z", C.brown) + circle(26, 80, 4, C.gold) + circle(94, 80, 4, C.gold)) + circle(46, 62, 11, "none") + circle(74, 62, 11, "none") + stroke("M57 62 H63", LINE, 3),
  uncle: portrait(C.deepBlue, path("M26 52 Q24 14 60 14 Q96 14 94 52Z", C.coral) + rect(22, 46, 76, 8, "#c0392b", 4) + path("M38 78 Q48 68 60 76 Q72 68 82 78 Q72 88 60 82 Q48 88 38 78Z", C.ink)),
};
