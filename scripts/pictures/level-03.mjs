// Hình minh họa cho các từ cụ thể của cấp 3. Từ trừu tượng (giờ, thứ, tháng, tính từ chỉ tính cách…) không có hình, xem decisions.md.
import { more } from "./level-03-more.mjs";
import { C, LINE, circle, ellipse, rect, path, poly, blob, dot, stroke, shine, thick, g, eye, cheek, union, uc, ue, ur, cloud, star, starPath, rays, face } from "./lib.mjs";

const bowl = (fill, y = 56) => path(`M12 ${y} H108 Q104 ${y + 46} 60 ${y + 48} Q16 ${y + 46} 12 ${y}Z`, fill);
const bottle = (body, cap) => rect(36, 44, 48, 62, body, 12) + rect(51, 18, 18, 30, body, 5) + rect(48, 8, 24, 12, cap, 4);
const rayCircle = (cx, cy, r, fill = C.yellow) => rays(cx, cy, r + 6, r + 16, 8) + circle(cx, cy, r, fill);
const tree = (x, y, s = 1) => rect(x - 5 * s, y, 10 * s, 24 * s, C.brown, 3) + union(C.leaf, uc(x, y - 6 * s, 22 * s), uc(x - 16 * s, y + 6 * s, 15 * s), uc(x + 16 * s, y + 6 * s, 15 * s));
const pine = (x, y, s = 1) => rect(x - 4 * s, y + 24 * s, 8 * s, 14 * s, C.brown, 2) + poly(`${x},${y - 20 * s} ${x + 22 * s},${y + 14 * s} ${x - 22 * s},${y + 14 * s}`, C.green) + poly(`${x},${y - 4 * s} ${x + 26 * s},${y + 30 * s} ${x - 26 * s},${y + 30 * s}`, "#3d9a35");
const wheel = (x, y, r = 11) => circle(x, y, r, C.ink) + circle(x, y, r * 0.42, C.grey);
const window4 = (x, y, w, h, fill = C.sky) => rect(x, y, w, h, fill, 3);
const heart = (cx, cy, s, fill) => path(`M${cx} ${cy + 6 * s} C${cx - 20 * s} ${cy - 8 * s} ${cx - 10 * s} ${cy - 20 * s} ${cx} ${cy - 8 * s} C${cx + 10 * s} ${cy - 20 * s} ${cx + 20 * s} ${cy - 8 * s} ${cx} ${cy + 6 * s}Z`, fill);
const hair = (d, fill) => path(d, fill);
const water = (x, y, w, h, fill = C.water) => rect(x, y, w, h, fill, 8);
const waves = (d) => stroke(d, "#fff", 4).replace("/>", ' opacity=".8"/>');

export const pictures = {
  // ---- Việc hằng ngày
  breakfast: ellipse(60, 76, 48, 28, C.sky) + ellipse(60, 76, 34, 18, "#eaf8ff").replace(/stroke-width="3"/, 'stroke-width="2"') +
    path("M52 58 C38 54 28 70 38 80 C48 90 76 88 84 76 C90 64 72 54 52 58Z", C.white) + circle(58, 72, 9, C.yellow) + shine("M52 69 q2 -4 6 -4") +
    rect(78, 38, 26, 24, C.bread, 7) + stroke("M84 46 h14", "#c0842f"),
  lunch: stroke("M44 40 V30 Q44 22 52 22 H68 Q76 22 76 30 V40", LINE, 9) + stroke("M44 40 V30 Q44 22 52 22 H68 Q76 22 76 30 V40", C.grey, 4) +
    rect(14, 38, 92, 64, C.coral, 12) + rect(14, 38, 92, 24, "#ff9a7a", 12) + rect(50, 54, 20, 16, C.yellow, 4) + circle(60, 62, 3, LINE) + stroke("M26 82 h68", "#ffb8a3", 4),
  dinner: circle(60, 62, 42, C.white) + circle(60, 62, 28, C.sky) + path("M42 62 C42 48 70 46 78 56 C84 68 66 80 52 76 C44 74 42 68 42 62Z", "#c0392b") + dot(52, 56, 3, "#e57368") +
    circle(74, 78, 5, C.leaf) + circle(66, 84, 5, C.leaf) + circle(80, 70, 5, C.leaf) +
    stroke("M8 20 v22 M15 20 v22 M22 20 v22 M8 42 q0 9 7 9 q7 0 7 -9 M15 51 v52", LINE, 3.5) + path("M104 20 q10 8 6 40 h-6 Z", C.grey) + stroke("M104 60 v43", LINE, 3.5),
  morning: rays(60, 66, 36, 52, 9) + circle(60, 66, 28, C.yellow) + path("M4 104 Q60 56 116 104 Z", C.leaf) + stroke("M26 94 q14 -14 30 -8 M70 88 q16 -8 30 6", "#4fae3a", 3) + cloud(26, 28, 0.55) + cloud(96, 24, 0.5),
  evening: circle(60, 62, 30, C.coral) + path("M2 74 H118 V112 H2 Z", C.deepBlue) + waves("M14 84 q8 -6 16 0 t16 0 t16 0 t16 0 M26 98 q8 -6 16 0 t16 0 t16 0") + stroke("M44 78 h32 M50 86 h20", "#ffb59f", 4) + cloud(26, 22, 0.5, "#ffc2b0") + cloud(98, 30, 0.45, "#ffc2b0"),
  night: circle(60, 60, 50, C.navy) + path("M70 22 A32 32 0 1 0 96 76 A26 26 0 1 1 70 22Z", C.yellow) + star(34, 36, 8, "#fff") + star(96, 34, 6, "#fff") + star(78, 96, 6, "#fff") + star(30, 84, 5, "#fff"),
  "o'clock": circle(60, 60, 46, C.white) + circle(60, 60, 36, "#f6fbff").replace(/stroke="[^"]*" stroke-width="3"/, 'stroke="#c9ced6" stroke-width="2"') +
    stroke("M60 26 v8 M94 60 h-8 M60 94 v-8 M26 60 h8 M77 31 l-4 7 M89 43 l-7 4 M89 77 l-7 -4 M77 89 l-4 -7 M43 89 l4 -7 M31 77 l7 -4 M31 43 l7 4 M43 31 l4 7", LINE, 3) +
    stroke("M60 60 V34", LINE, 4.5) + stroke("M60 60 H82", C.coral, 5.5) + circle(60, 60, 5, LINE),
  time: circle(36, 24, 12, C.yellow) + circle(84, 24, 12, C.yellow) + circle(60, 68, 38, C.coral) + circle(60, 68, 29, C.white) +
    stroke("M60 68 V50 M60 68 L74 76", LINE, 4.5) + circle(60, 68, 4, LINE) + stroke("M36 104 l-6 8 M84 104 l6 8", LINE, 5) + stroke("M60 30 V24", LINE, 4),
  brush: g("rotate(-35 60 60)", rect(8, 52, 74, 16, C.blue, 8) + rect(78, 46, 30, 28, C.white, 6) + rect(82, 34, 6, 14, "#7ad0ff", 2) + rect(92, 34, 6, 14, "#7ad0ff", 2) + rect(102, 36, 6, 12, "#7ad0ff", 2) + blob("M84 56 q8 -6 16 0 q-8 8 -16 0Z", "#6cc04a") + stroke("M20 60 h40", "#bfe6ff", 4)),
  bedtime: rect(8, 46, 14, 62, C.brown, 4) + rect(8, 72, 104, 26, C.blue, 6) + rect(22, 62, 36, 18, C.white, 8) + path("M58 72 H112 V90 H58 Z", C.deepBlue) + rect(104, 70, 8, 38, C.brown, 4) +
    path("M84 12 A18 18 0 1 0 100 40 A14 14 0 1 1 84 12Z", C.yellow) + star(52, 30, 7, "#ffe58a"),

  // ---- Mùa
  spring: stroke("M10 100 Q40 80 70 60 T112 18", C.brown, 6) + [[34, 80, 11], [58, 62, 12], [84, 40, 11], [100, 26, 9]].map(([x, y, r]) => union(C.pink, uc(x - r * 0.7, y, r * 0.7), uc(x + r * 0.7, y, r * 0.7), uc(x, y - r * 0.7, r * 0.7), uc(x, y + r * 0.7, r * 0.7)) + dot(x, y, r * 0.38, C.yellow)).join("") +
    path("M20 92 q-14 -6 -12 -20 q14 0 18 14Z", C.leaf) + path("M70 46 q-4 -18 10 -22 q6 14 -10 22Z", C.leaf),
  summer: stroke("M60 16 V104", LINE, 5) + path("M8 78 Q8 20 60 16 Q112 20 112 78 Q98 68 86 78 Q73 68 60 78 Q47 68 34 78 Q22 68 8 78Z", C.coral) + stroke("M60 16 L34 78 M60 16 L86 78", C.white, 4) + ellipse(60, 106, 46, 7, C.bread) + rayCircle(100, 16, 7),
  autumn: path("M60 12 L70 36 L92 28 L84 52 L108 58 L88 74 L98 96 L68 88 L62 104 H58 L52 88 L22 96 L32 74 L12 58 L36 52 L28 28 L50 36 Z", C.orange) + stroke("M60 104 V108 M60 100 V42 M60 70 L40 54 M60 70 L80 54 M60 88 L42 78 M60 88 L78 78", "#c0651f", 3),
  winter: circle(60, 92, 24, C.white) + circle(60, 60, 18, C.white) + circle(60, 34, 14, C.white) + path("M44 24 H76 L72 12 H48Z", C.ink) + rect(40, 22, 40, 6, C.ink, 3) +
    path("M46 46 H74 V54 H46Z", C.red) + path("M70 54 v16 h-8 v-16Z", C.red) + path("M62 34 L80 38 L62 42Z", C.orange) + dot(54, 30, 2.5, LINE) + dot(66, 28, 2.5, LINE) + dot(60, 66, 3, LINE) + dot(60, 78, 3, LINE) + dot(60, 90, 3, LINE) +
    stroke("M36 62 L18 50 M84 62 L102 50", C.brown, 4),

  // ---- Thời tiết, thiên nhiên
  weather: rayCircle(48, 44, 20) + cloud(66, 78, 1.1),
  sun: rayCircle(60, 60, 26) + eye(51, 56, 4) + eye(69, 56, 4) + stroke("M50 68 q10 9 20 0") + cheek(44, 66) + cheek(76, 66),
  cloud: cloud(60, 62, 1.4) + eye(48, 66, 4) + eye(72, 66, 4) + stroke("M54 76 q6 6 12 0"),
  rain: cloud(60, 42, 1.3, "#e6eef9") + [[34, 72], [54, 84], [74, 72], [94, 84], [44, 98], [84, 100]].map(([x, y]) => path(`M${x} ${y - 10} q8 10 0 16 q-8 -6 0 -16Z`, C.water)).join(""),
  snow: [0, 60, 120].map((a) => g(`rotate(${a} 60 60)`, thick("M60 14 V106", "#bfe6ff", 6))).join("") + [0, 60, 120].map((a) => g(`rotate(${a} 60 60)`, thick("M50 24 L60 34 L70 24 M50 96 L60 86 L70 96", "#bfe6ff", 4))).join("") + circle(60, 60, 7, C.white),
  wind: stroke("M8 40 H70 Q92 40 92 26 Q92 14 80 16", LINE, 9) + stroke("M8 40 H70 Q92 40 92 26 Q92 14 80 16", C.sky, 4) +
    stroke("M14 62 H88 Q112 62 112 78 Q112 92 98 90", LINE, 9) + stroke("M14 62 H88 Q112 62 112 78 Q112 92 98 90", C.sky, 4) +
    stroke("M24 86 H56 Q70 86 70 98", LINE, 9) + stroke("M24 86 H56 Q70 86 70 98", C.sky, 4) + path("M96 44 q8 -10 18 -8 q-2 12 -18 8Z", C.leaf),
  storm: cloud(60, 40, 1.3, "#aab4c6") + path("M66 58 L46 88 H60 L52 112 L82 76 H66 L74 58Z", C.yellow) + [[28, 76], [96, 84], [34, 100]].map(([x, y]) => path(`M${x} ${y - 8} q6 8 0 12 q-6 -4 0 -12Z`, C.water)).join(""),
  lightning: path("M70 8 L28 66 H54 L42 112 L94 48 H66 L80 8Z", C.yellow) + shine("M62 22 L42 54"),
  fog: [[16, 30, 88], [8, 52, 104], [20, 74, 80], [12, 96, 96]].map(([x, y, w], i) => rect(x, y, w, 12, i % 2 ? "#dfe6ee" : "#eef2f7", 6)).join(""),
  ice: g("rotate(-12 60 60)", rect(22, 26, 62, 62, C.sky, 10)) + g("rotate(10 60 60)", rect(36, 40, 60, 60, "#bfe6ff", 10) + shine("M46 52 v22 M46 52 h14")) + star(98, 22, 9, C.white),
  temperature: rect(46, 10, 28, 76, C.white, 14) + circle(60, 92, 20, C.red) + rect(54, 40, 12, 50, C.red, 6).replace(/stroke="[^"]*" stroke-width="3"/, 'stroke="none"') + stroke("M80 24 h12 M80 40 h12 M80 56 h12 M80 72 h12", LINE, 3) + shine("M52 22 v22"),
  sky: rect(10, 12, 100, 96, C.water, 16) + rayCircle(34, 38, 10) + cloud(76, 60, 0.9) + cloud(40, 88, 0.7) + path("M80 28 q4 -6 8 0 q4 -6 8 0", "none"),
  moon: path("M74 10 A46 46 0 1 0 108 82 A38 38 0 1 1 74 10Z", C.yellow) + dot(40, 66, 5, "#e6b400") + dot(54, 90, 4, "#e6b400") + dot(34, 46, 3, "#e6b400"),
  star: poly(starPath(60, 62, 48, 22), C.yellow) + eye(50, 60, 4) + eye(70, 60, 4) + stroke("M52 72 q8 7 16 0") + shine("M40 40 L54 30"),
  tree: rect(52, 70, 16, 40, C.brown, 4) + union(C.leaf, uc(60, 36, 28), uc(34, 58, 22), uc(86, 58, 22), uc(60, 62, 24)) + shine("M42 34 q6 -10 16 -12"),
  flower: stroke("M60 62 V108", C.green, 6) + path("M60 96 q-24 -4 -26 -26 q22 0 26 26Z", C.leaf) + union(C.pink, uc(60, 24, 14), uc(60, 60, 14), uc(38, 42, 14), uc(82, 42, 14)) + circle(60, 42, 13, C.yellow),
  grass: [[20, 100, 14], [34, 100, -6], [48, 100, 10], [60, 100, -14], [72, 100, 6], [86, 100, -10], [98, 100, 12]].map(([x, y, d], i) => path(`M${x - 8} ${y} Q${x + d / 2} ${y - 40 - (i % 3) * 10} ${x + d} ${y - 58 - (i % 3) * 10} Q${x + 8} ${y - 36} ${x + 8} ${y}Z`, i % 2 ? C.leaf : C.green)).join(""),
  leaf: path("M16 100 C10 40 46 12 104 14 C108 70 76 104 16 100Z", C.leaf) + stroke("M16 100 L90 30 M50 66 L50 40 M64 52 L88 54 M40 80 L64 82", "#3d9a35", 3) + shine("M32 50 q8 -14 24 -18"),

  // ---- Thể thao
  football: circle(60, 60, 44, C.white) + poly("60,38 80,52 72,76 48,76 40,52", LINE) + stroke("M60 38 V17 M80 52 L101 44 M72 76 L85 95 M48 76 L35 95 M40 52 L19 44", LINE, 3) + shine("M30 36 q10 -14 26 -16"),
  basketball: circle(60, 60, 44, C.orange) + stroke("M60 16 V104 M16 60 H104 M32 24 Q52 60 32 96 M88 24 Q68 60 88 96", LINE, 3) + shine("M30 44 q6 -14 18 -20"),
  tennis: circle(60, 60, 42, "#d4e157") + stroke("M22 34 Q54 60 22 86 M98 34 Q66 60 98 86", C.white, 4.5) + shine("M36 34 q8 -10 20 -12"),
  volleyball: circle(60, 60, 44, C.white) + stroke("M18 46 Q60 28 102 46 M60 16 Q36 52 50 104 M104 76 Q70 66 38 98", LINE, 3) + shine("M30 36 q10 -14 26 -16"),
  badminton: path("M44 86 L28 26 Q60 14 92 26 L76 86Z", C.white) + stroke("M44 78 L38 28 M60 82 V22 M76 78 L82 28", C.grey, 2.5) + path("M28 26 Q60 14 92 26", "none") + circle(60, 96, 14, C.skin) + stroke("M50 90 h20", "#c0842f", 3),
  baseball: thick("M12 106 L62 46", C.tan, 15) + circle(76, 50, 30, C.white) + stroke("M62 30 q10 14 0 36 M90 34 q-8 14 2 32", C.red, 3) + stroke("M62 36 l-6 -2 M66 46 l-6 -1 M66 58 l-6 1 M90 38 l6 -2 M88 48 l6 0 M90 60 l6 2", C.red, 2.5),
  golf: path("M2 108 Q60 62 118 108 Z", C.leaf) + stroke("M86 22 V82", LINE, 4) + poly("86,22 108,32 86,42", C.red) + circle(34, 76, 11, C.white) + dot(30, 72, 1.8, C.grey) + dot(37, 78, 1.8, C.grey) + dot(35, 70, 1.8, C.grey) + path("M30 86 L34 96 L38 86", C.red),
  hockey: thick("M30 12 L50 78 Q54 92 70 92 L96 92", C.tan, 11) + thick("M30 12 L36 32", C.blue, 11) + ellipse(88, 106, 15, 6, C.ink),
  rugby: g("rotate(-35 60 60)", ellipse(60, 60, 48, 30, "#c98b55") + stroke("M40 60 H80 M48 52 v16 M56 52 v16 M64 52 v16 M72 52 v16", C.white, 3) + stroke("M26 46 q-6 14 0 28 M94 46 q6 14 0 28", C.white, 3.5)),
  skateboard: path("M8 54 Q8 46 18 46 H102 Q112 46 112 54 Q112 62 102 62 H18 Q8 62 8 54Z", C.coral) + stroke("M26 54 H94", "#ffc2b0", 4) + stroke("M34 62 V72 M86 62 V72", LINE, 4) + wheel(34, 82, 11) + wheel(86, 82, 11),
  ski: thick("M30 102 L58 14", C.blue, 10) + thick("M56 106 L86 18", C.coral, 10) + rect(46, 54, 10, 16, C.ink, 3) + rect(72, 58, 10, 16, C.ink, 3) + thick("M104 20 L94 100", C.dark, 4) + circle(94, 100, 6, C.grey),
  skate: path("M30 14 H56 V54 Q56 66 78 66 Q100 66 100 84 V92 H30 Z", C.white) + path("M30 14 H56 V30 H30Z", C.blue) + stroke("M36 40 H50 M36 50 H50 M60 66 L70 76", LINE, 3) + rect(22, 96, 86, 7, C.grey, 3) + stroke("M42 92 V96 M92 92 V96", LINE, 4),
  goal: stroke("M14 104 V30 H106 V104", LINE, 13) + stroke("M14 104 V30 H106 V104", C.white, 7) + stroke("M26 36 V100 M40 36 V100 M54 36 V100 M68 36 V100 M82 36 V100 M96 36 V100 M18 52 H102 M18 68 H102 M18 84 H102", C.grey, 1.8) + circle(84, 92, 13, C.white) + poly("84,86 90,90 88,97 80,97 78,90", LINE),
  racket: ellipse(60, 40, 30, 36, "#d9f2ff") + stroke("M60 6 V74 M44 10 V70 M76 10 V70 M30 24 H90 M28 40 H92 M32 56 H88", C.blue, 2) + ellipse(60, 40, 30, 36, "none") + thick("M60 76 V108", C.coral, 10),
  net: rect(12, 34, 96, 46, C.white, 4) + stroke("M12 46 H108 M12 58 H108 M12 70 H108 M28 34 V80 M44 34 V80 M60 34 V80 M76 34 V80 M92 34 V80", C.grey, 2) + rect(10, 28, 100, 10, C.white, 4) + thick("M12 28 V108 M108 28 V108", C.dark, 5),
  gym: thick("M28 60 H92", C.grey, 8) + rect(12, 40, 14, 40, C.blue, 5) + rect(26, 30, 12, 60, C.deepBlue, 5) + rect(82, 30, 12, 60, C.deepBlue, 5) + rect(94, 40, 14, 40, C.blue, 5),
  pool: rect(8, 44, 104, 62, C.white, 12) + rect(16, 52, 88, 46, C.water, 8) + waves("M26 66 q8 -6 16 0 t16 0 t16 0 M40 82 q8 -6 16 0 t16 0") + stroke("M30 14 V54 M44 14 V54 M30 24 H44 M30 36 H44", C.grey, 5) + stroke("M30 14 V54 M44 14 V54", LINE, 2),
  field: rect(8, 24, 104, 72, C.leaf, 8) + stroke("M60 24 V96 M8 60 H18 M102 60 H112", C.white, 3.5) + circle(60, 60, 16, "none").replace(/stroke="[^"]*" stroke-width="3"/, `stroke="#fff" stroke-width="3.5"`) + stroke("M8 40 H26 V80 H8 M112 40 H94 V80 H112", C.white, 3.5) + rect(8, 24, 104, 72, "none", 8),
  champion: path("M32 18 H88 V44 Q88 72 60 78 Q32 72 32 44Z", C.gold) + path("M32 26 H16 Q14 52 36 56 M88 26 H104 Q106 52 84 56", "none") + rect(54, 78, 12, 14, C.gold, 3) + rect(36, 92, 48, 14, C.brown, 4) + star(60, 46, 14, C.white) + shine("M42 28 v20"),
  medal: path("M34 6 L58 50 H42 L20 10Z", C.red) + path("M86 6 L62 50 H78 L100 10Z", C.deepBlue) + circle(60, 78, 28, C.gold) + circle(60, 78, 19, "#ffe58a") + star(60, 78, 13, C.gold),

  // ---- Sở thích và âm nhạc
  guitar: thick("M62 56 L100 16", C.brown, 9) + thick("M100 16 L108 8", C.ink, 11) + union("#e5a15a", uc(44, 82, 25), uc(60, 60, 18)) + circle(48, 76, 8, C.ink) + stroke("M42 96 L62 76", LINE, 3) + stroke("M60 66 L96 22", "#fff", 1.6),
  piano: rect(10, 22, 100, 20, C.dark, 6) + rect(10, 38, 100, 60, C.white, 8) + stroke("M30 62 V98 M50 62 V98 M70 62 V98 M90 62 V98", LINE, 2.5) + [22, 42, 74, 94].map((x) => rect(x - 6, 38, 12, 34, C.ink, 3)).join(""),
  violin: union("#d2691e", uc(60, 90, 20), uc(60, 62, 15), ue(60, 76, 11, 8)) + thick("M60 54 V10", C.brown, 8) + circle(60, 8, 6, C.ink) + stroke("M54 82 q-6 8 0 14 M66 82 q6 8 0 14", LINE, 3) + stroke("M60 62 V100", "#fff", 1.6) + thick("M20 108 L104 40", C.tan, 4),
  photo: rect(12, 14, 96, 92, C.white, 8) + rect(22, 24, 76, 56, C.sky, 4) + rayCircle(40, 40, 7) + path("M22 80 L50 50 L68 68 L80 56 L98 80 Z", C.leaf) + stroke("M30 92 H90", C.grey, 4),
  camera: rect(40, 26, 32, 16, C.dark, 5) + rect(12, 38, 96, 62, C.dark, 12) + circle(60, 70, 24, C.grey) + circle(60, 70, 15, C.blue) + shine("M52 62 q4 -6 10 -6") + rect(82, 44, 16, 9, C.yellow, 3) + circle(24, 52, 3, C.coral),
  stamp: rect(14, 8, 92, 104, C.white, 4) + rect(26, 20, 68, 80, "#ffe9d2", 2) + rayCircle(46, 42, 7) + path("M26 100 L54 62 L72 84 L84 70 L94 100 Z", C.leaf) + stroke("M14 8 H106 M14 112 H106", C.grey, 2).replace("/>", ' stroke-dasharray="1 7"/>'),
  chess: ellipse(60, 100, 30, 9, C.brown) + path("M40 98 Q44 70 52 56 H68 Q76 70 80 98Z", C.brown) + ellipse(60, 56, 18, 6, C.tan) + circle(60, 34, 16, C.brown) + shine("M50 28 q4 -6 10 -6"),
  cards: g("rotate(-14 60 64)", rect(22, 22, 52, 78, C.white, 7) + heart(48, 56, 1.5, C.red)) + g("rotate(14 60 64)", rect(46, 20, 52, 78, C.white, 7) + path("M72 36 C56 52 52 62 62 66 C66 68 70 66 72 62 C72 72 70 78 66 84 H78 C74 78 72 72 72 62 C74 66 78 68 82 66 C92 62 88 52 72 36Z", C.ink)),
  film: rect(12, 52, 96, 54, C.ink, 6) + g("rotate(-14 20 52)", rect(12, 30, 96, 20, C.white, 4) + poly("22,30 36,30 28,50 14,50", LINE) + poly("48,30 62,30 54,50 40,50", LINE) + poly("74,30 88,30 80,50 66,50", LINE)) + stroke("M12 66 H108", C.white, 2.5) + circle(60, 86, 10, C.coral).replace(/fill="[^"]*"/, 'fill="#ffd23f"'),
  magazine: rect(24, 8, 72, 104, C.coral, 6) + rect(34, 18, 52, 40, C.yellow, 4) + star(60, 38, 14, C.white) + stroke("M34 72 H86 M34 84 H86 M34 96 H66", C.white, 4),
  comic: rect(12, 18, 96, 84, C.white, 6) + rect(18, 24, 40, 30, C.yellow, 3) + rect(62, 24, 40, 30, C.blue, 3) + rect(18, 58, 84, 38, C.lime, 3) + ellipse(78, 74, 22, 14, C.white) + path("M62 84 L54 94 L70 86", C.white) + dot(70, 74, 2.5, LINE) + dot(78, 74, 2.5, LINE) + dot(86, 74, 2.5, LINE),
  story: path("M60 34 Q36 22 10 30 V92 Q36 84 60 98Z", C.white) + path("M60 34 Q84 22 110 30 V92 Q84 84 60 98Z", "#f4f7fb") + stroke("M60 34 V98 M22 46 Q34 44 48 50 M22 58 Q34 56 48 62 M72 50 Q86 44 98 46 M72 62 Q86 56 98 58", LINE, 2.5) + path("M6 94 Q34 84 60 102 Q86 84 114 94", "none"),
  party: poly("60,10 90,100 30,100", C.purple) + stroke("M44 60 L76 60 M38 80 L82 80", C.yellow, 5) + circle(60, 10, 8, C.yellow) + circle(22, 30, 5, C.coral) + circle(100, 36, 5, C.blue) + rect(90, 70, 12, 6, C.green, 2) + rect(14, 64, 12, 6, C.pink, 2) + circle(106, 96, 5, C.yellow) + circle(14, 100, 5, C.green),
  present: rect(18, 52, 84, 54, C.coral, 6) + rect(12, 38, 96, 20, "#ff9a7a", 5) + rect(52, 38, 16, 68, C.yellow, 3) + union(C.yellow, ue(44, 28, 14, 9), ue(76, 28, 14, 9)) + circle(60, 32, 7, C.gold),
  music: path("M44 90 V26 L92 14 V76", "none").replace(/fill="none"/, 'fill="none"') + poly("44,26 92,14 92,32 44,44", C.purple) + stroke("M44 44 V90 M92 32 V76", LINE, 4) + ellipse(36, 92, 14, 10, C.purple) + ellipse(84, 78, 14, 10, C.purple),

  // ---- Bữa ăn
  noodle: g("rotate(-24 60 60)", thick("M6 28 L60 70", C.tan, 4)) + stroke("M22 56 q8 -26 16 0 t16 0 t16 0 t16 0", LINE, 9) + stroke("M22 56 q8 -26 16 0 t16 0 t16 0 t16 0", C.yellow, 5) + bowl(C.coral) + stroke("M16 74 H104", "#ff9a7a", 5) + thick("M70 14 L92 54", C.tan, 4) + thick("M80 10 L102 50", C.tan, 4),
  spaghetti: ellipse(60, 78, 50, 26, C.white) + ellipse(60, 66, 32, 22, "#ffd96b") + stroke("M36 62 q24 -12 48 0 M40 72 q20 8 44 -2 M46 56 q14 -4 28 0", "#e6b400", 3) + circle(60, 56, 11, "#e04b3a") + path("M64 48 q8 -8 16 -4 q-4 10 -16 4Z", C.leaf),
  pasta: thick("M24 96 L50 34", C.bread, 17) + stroke("M32 76 L46 82 M38 62 L52 68 M44 48 L58 54", "#c0842f", 3) + thick("M56 104 L86 46", C.bread, 17) + stroke("M64 86 L78 92 M72 72 L86 78 M80 58 L94 64", "#c0842f", 3) + thick("M86 98 L100 70", C.bread, 14),
  cereal: bowl(C.pink) + [[30, 46], [48, 38], [66, 44], [84, 38], [38, 56], [58, 54], [78, 54], [96, 48]].map(([x, y]) => circle(x, y, 8, "#f5a742") + dot(x, y, 2.5, C.cream)).join("") + stroke("M16 76 H104", "#ffc2d1", 5),
  toast: path("M26 104 V56 Q8 54 10 34 Q12 14 60 14 Q108 14 110 34 Q112 54 94 56 V104 Z", C.bread) + path("M36 98 V50 Q22 48 24 36 Q26 24 60 24 Q94 24 96 36 Q98 48 84 50 V98 Z", "#f7dca8").replace(/stroke="[^"]*" stroke-width="3"/, 'stroke="none"') + rect(46, 44, 28, 20, C.yellow, 4),
  yoghurt: rect(24, 24, 72, 14, C.blue, 4) + path("M30 38 H90 L82 106 H38Z", C.white) + path("M32 56 H88", "none") + circle(60, 72, 13, C.pink) + path("M60 62 q8 -8 12 -2", "none") + stroke("M56 66 q4 4 8 0", C.white, 3) + thick("M96 58 L108 20", C.grey, 5),
  honey: rect(28, 36, 64, 68, C.gold, 14) + rect(32, 24, 56, 16, C.brown, 5) + rect(40, 54, 40, 32, "#fff6d6", 6) + path("M60 60 q8 10 0 16 q-8 -6 0 -16Z", C.gold) + path("M32 40 q4 16 10 4 q4 12 10 0", C.gold),
  sugar: rect(14, 62, 36, 36, C.white, 5) + rect(66, 66, 36, 36, C.white, 5) + rect(36, 26, 36, 36, C.white, 5) + stroke("M20 70 v14 M72 74 v14 M42 34 v14", "#bfe6ff", 4) + star(94, 34, 7, C.yellow) + star(24, 40, 5, C.yellow),
  salt: path("M36 42 H84 L90 106 H30 Z", C.white) + path("M36 42 Q60 4 84 42Z", C.grey) + dot(52, 28, 2.4, LINE) + dot(60, 22, 2.4, LINE) + dot(68, 28, 2.4, LINE) + stroke("M44 62 V92 M76 62 V92", "#bfe6ff", 4),
  pepper: path("M36 42 H84 L90 106 H30 Z", C.ink) + path("M36 42 Q60 4 84 42Z", C.brown) + dot(52, 28, 2.4, C.cream) + dot(60, 22, 2.4, C.cream) + dot(68, 28, 2.4, C.cream) + stroke("M44 62 V92", "#7a7192", 4) + dot(30, 108, 3, LINE) + dot(100, 106, 3, LINE),
  oil: bottle(C.yellow, C.brown) + ellipse(60, 78, 16, 18, C.white) + path("M60 68 q8 10 0 16 q-8 -6 0 -16Z", C.gold),
  flour: path("M26 28 H94 L100 108 H20 Z", "#f6ead2") + rect(24, 18, 72, 16, "#eadcb8", 4) + stroke("M60 94 V60 M60 76 L48 66 M60 76 L72 66 M60 64 L50 54 M60 64 L70 54", C.gold, 3.5) + ellipse(60, 52, 4, 6, C.gold),
  vegetable: rect(12, 64, 96, 42, C.tan, 8) + stroke("M20 78 H100 M20 92 H100 M36 66 V104 M60 66 V104 M84 66 V104", C.brown, 2.5) + path("M30 64 L50 20 L66 62Z", C.orange) + path("M46 24 q-8 -14 -2 -18 q6 6 4 18 M50 22 q10 -12 16 -8 q-2 8 -12 10", C.leaf) + circle(84, 52, 18, C.red) + path("M84 36 q-4 -8 -12 -6 q4 6 12 6 q4 -8 12 -6", C.green),
  mushroom: path("M44 64 V96 Q44 108 60 108 Q76 108 76 96 V64Z", C.cream) + path("M12 66 Q12 14 60 14 Q108 14 108 66Z", C.red) + circle(36, 42, 8, C.white) + circle(68, 34, 7, C.white) + circle(86, 52, 6, C.white) + circle(52, 54, 5, C.white),
  cabbage: circle(60, 62, 42, C.lime) + stroke("M60 20 Q30 40 40 82 M60 20 Q90 40 80 82 M60 22 V104 M22 54 Q50 66 60 96 M98 54 Q70 66 60 96", C.leaf, 3) + shine("M30 40 q8 -14 22 -16"),
  cucumber: thick("M22 96 L96 26", C.green, 24) + thick("M26 86 L90 26", C.lime, 6) + dot(40, 80, 2, C.cream) + dot(56, 62, 2, C.cream) + dot(74, 46, 2, C.cream) + circle(96, 92, 16, C.lime) + circle(96, 92, 10, "#e6f5b8") + stroke("M96 84 v16 M88 92 h16", C.lime, 2),
  corn: path("M30 100 Q8 70 22 40 Q36 60 52 100Z", C.leaf) + path("M90 100 Q112 70 98 40 Q84 60 68 100Z", C.leaf) + g("rotate(-12 60 56)", ellipse(60, 56, 24, 46, C.yellow) + stroke("M44 28 V86 M60 14 V98 M76 28 V86 M38 44 H82 M36 60 H84 M38 76 H82", "#e6b400", 2.2)) + path("M44 96 Q60 112 76 96 Q60 100 44 96Z", C.leaf),
  lettuce: union("#8fd14f", uc(40, 66, 24), uc(80, 66, 24), uc(60, 42, 26), uc(60, 78, 28)) + stroke("M60 100 V50 M60 84 L38 66 M60 84 L82 66 M60 62 L46 46 M60 62 L74 46", "#5aa83a", 3),
  beef: path("M16 62 Q10 30 50 26 Q94 20 106 54 Q112 92 70 100 Q24 106 16 62Z", "#c0392b") + path("M34 62 Q40 40 62 40 Q84 40 90 58 Q88 80 64 84 Q40 86 34 62Z", "#e0584a").replace(/stroke="[^"]*" stroke-width="3"/, 'stroke="none"') + stroke("M46 58 q10 -8 24 -2 M52 70 q12 6 22 -2", "#f5b5a8", 3) + stroke("M26 40 l10 12 M40 30 l10 12", "#7a1f16", 3),
  pork: ellipse(60, 62, 48, 36, "#ffe0e0") + ellipse(60, 62, 38, 27, "#ff9aa2") + stroke("M38 60 q10 -10 22 -4 M52 74 q14 4 26 -6", "#ffc2c6", 3) + circle(60, 62, 8, "#ffb3b8").replace(/stroke="[^"]*" stroke-width="3"/, 'stroke="#e87880" stroke-width="2"'),
  fork: stroke("M38 12 v34 M60 12 v34 M82 12 v34", LINE, 12) + stroke("M38 12 v34 M60 12 v34 M82 12 v34", C.grey, 6) + path("M32 44 Q32 62 60 62 Q88 62 88 44Z", C.grey) + thick("M60 62 V108", C.grey, 10),
  spoon: ellipse(60, 34, 22, 28, C.grey) + shine("M48 22 q4 -6 10 -6") + thick("M60 62 V108", C.grey, 10),
  knife: path("M52 8 Q92 12 86 66 H52Z", C.grey) + stroke("M60 20 Q76 24 76 54", "#fff", 3).replace("/>", ' opacity=".8"/>') + rect(48, 66, 24, 42, C.brown, 8) + dot(60, 80, 2, C.cream) + dot(60, 94, 2, C.cream),
  pancake: rect(16, 74, 88, 20, C.bread, 10) + rect(18, 56, 84, 20, "#f0c17a", 10) + rect(20, 38, 80, 20, C.bread, 10) + rect(48, 22, 24, 16, C.yellow, 4) + path("M22 42 Q36 62 46 42 Q56 70 70 42 Q82 60 98 42", "none").replace("/>", "/>") + path("M24 44 q4 22 12 6 q4 16 12 -2 q6 18 14 -2 q8 14 14 -2 q8 8 10 -4", "#c0651f").replace(/stroke="[^"]*" stroke-width="3"/, 'stroke="none"'),
  cookie: circle(60, 62, 42, C.bread) + [[42, 46], [72, 42], [58, 66], [84, 70], [38, 78], [66, 90]].map(([x, y]) => ellipse(x, y, 7, 6, "#5a3a22")).join("") + shine("M30 52 q4 -14 18 -20"),
  picnic: rect(8, 90, 104, 20, C.red, 4) + stroke("M28 90 V110 M52 90 V110 M76 90 V110 M100 90 V110", "#fff", 5).replace("/>", ' opacity=".8"/>') + stroke("M34 54 Q60 8 86 54", LINE, 9) + stroke("M34 54 Q60 8 86 54", C.brown, 4) + path("M24 54 H96 L88 92 H32Z", C.tan) + rect(22, 46, 76, 14, "#e8b56a", 5) + stroke("M36 66 H84 M38 78 H82", C.brown, 2.5),
  menu: rect(24, 10, 72, 100, C.white, 6) + circle(60, 40, 16, C.sky) + stroke("M36 34 v12 M33 34 v6 M39 34 v6 M84 34 v12", LINE, 2.5) + stroke("M36 70 H84 M36 82 H84 M36 94 H66", C.grey, 4) + rect(24, 10, 14, 100, C.coral, 6),
  plate: circle(60, 60, 46, C.white) + circle(60, 60, 30, C.sky) + shine("M32 40 q8 -14 24 -18"),

  // ---- Miêu tả người
  beard: face({ mouth: "none" }) + hair("M28 52 Q28 24 60 24 Q92 24 92 52 Q80 36 60 36 Q40 36 28 52Z", C.brown) + path("M26 68 Q26 112 60 114 Q94 112 94 68 Q86 88 60 88 Q34 88 26 68Z", C.brown) + stroke("M52 80 q8 6 16 0", C.cream, 3) + eye(46, 60) + eye(74, 60),
  moustache: face({ mouth: "none" }) + hair("M28 52 Q28 24 60 24 Q92 24 92 52 Q80 36 60 36 Q40 36 28 52Z", C.ink) + path("M38 78 Q48 66 60 76 Q72 66 82 78 Q72 90 60 82 Q48 90 38 78Z", C.ink),
  curly: face() + union(C.brown, uc(32, 46, 12), uc(46, 32, 13), uc(62, 28, 13), uc(78, 32, 13), uc(90, 46, 12), uc(26, 62, 8), uc(94, 62, 8)),
  straight: path("M24 66 Q22 18 60 18 Q98 18 96 66 V104 H80 V64 Q60 62 40 64 V104 H24Z", C.ink) + circle(60, 66, 31, C.skin) + path("M30 56 Q50 34 90 56 Q70 42 30 56Z", C.ink) + eye(46, 66) + eye(74, 66) + cheek(38, 78) + cheek(82, 78) + stroke("M50 80 q10 9 20 0"),
  blond: face() + hair("M26 56 Q24 20 60 20 Q96 20 94 56 Q84 36 66 40 Q56 30 40 42 Q32 44 26 56Z", C.yellow),
  bald: face() + shine("M44 40 q10 -10 24 -8"),
  angry: face({ skin: "#ff9a86", mouth: "none" }) + stroke("M36 50 L56 58 M84 50 L64 58", LINE, 4.5) + stroke("M48 84 q12 -10 24 0", LINE, 3.5) + stroke("M96 34 q8 -10 4 -20 M108 40 q8 -6 8 -16", C.grey, 3.5),
  tired: face({ mouth: "none", eyes: false }) + stroke("M38 64 q8 7 16 0 M66 64 q8 7 16 0", LINE, 3.5) + stroke("M40 72 q6 3 12 0 M68 72 q6 3 12 0", "#9b8fb5", 2.5) + ellipse(60, 84, 9, 7, LINE) + ellipse(60, 86, 6, 3, C.coral),
  worried: face({ mouth: "none" }) + stroke("M38 48 L54 42 M82 48 L66 42", LINE, 4) + stroke("M48 86 q4 -6 8 0 t8 0 t8 0", LINE, 3.5) + path("M96 40 q8 12 0 18 q-8 -6 0 -18Z", C.water),
  excited: face({ mouth: "none", eyes: false }) + circle(46, 60, 9, C.white) + circle(74, 60, 9, C.white) + dot(46, 60, 4.5, LINE) + dot(74, 60, 4.5, LINE) + path("M44 76 Q60 100 76 76Z", LINE) + path("M50 84 Q60 94 70 84Z", C.coral) + star(16, 24, 7, C.yellow) + star(104, 20, 6, C.yellow),
  strong: union(C.skin, ...[[10, 98], [22, 96], [34, 94], [46, 92], [58, 90]].map(([x, y]) => uc(x, y, 11)), ...[[64, 78], [68, 64], [72, 50], [76, 40]].map(([x, y]) => uc(x, y, 10)), ue(42, 70, 26, 19), uc(80, 26, 16)) + stroke("M72 22 h16 M72 30 h14", LINE, 2.5) + stroke("M28 66 q14 -12 28 -2", "#d7a273", 3),
  // ---- Kỳ nghỉ, phương tiện
  beach: path("M2 108 Q40 78 118 100 V112 H2Z", C.bread) + path("M2 84 H118 V100 Q80 90 40 100 Q20 104 2 96Z", C.water) + waves("M12 92 q8 -5 16 0 t16 0 M70 96 q8 -5 16 0 t16 0") + thick("M40 98 Q44 56 54 30", C.brown, 7) +
    path("M54 30 Q30 18 14 30 Q36 24 54 30Z", C.green) + path("M54 30 Q74 12 96 22 Q72 20 54 30Z", C.green) + path("M54 30 Q46 8 28 6 Q46 12 54 30Z", C.leaf) + path("M54 30 Q70 6 92 4 Q72 14 54 30Z", C.leaf) + rayCircle(98, 40, 9),
  island: path("M4 90 Q60 74 116 90 Q116 108 60 110 Q4 108 4 90Z", C.water) + waves("M14 98 q8 -5 16 0 t16 0 M70 102 q8 -5 16 0 t16 0") + path("M26 90 Q60 50 96 90Z", C.bread) + thick("M58 76 Q60 46 66 24", C.brown, 7) + path("M66 24 Q46 12 30 24 Q50 18 66 24Z", C.green) + path("M66 24 Q86 8 106 20 Q84 16 66 24Z", C.green) + path("M66 24 Q60 6 44 4 Q60 10 66 24Z", C.leaf),
  sea: rect(8, 24, 104, 82, C.water, 14) + path("M8 56 q13 -14 26 0 t26 0 t26 0 t26 0 V106 H8Z", C.deepBlue) + waves("M20 74 q10 -8 20 0 t20 0 t20 0 M34 92 q10 -8 20 0 t20 0") + rayCircle(88, 40, 9) + path("M36 52 L48 30 L58 52Z", C.white),
  lake: path("M4 64 Q30 18 58 50 Q84 24 116 64Z", C.leaf) + path("M4 70 Q4 54 60 54 Q116 54 116 70 Q116 98 60 100 Q4 98 4 70Z", C.water) + waves("M26 74 q8 -5 16 0 t16 0 M58 86 q8 -5 16 0") + stroke("M14 94 V72 M19 96 V78 M102 94 V70", C.green, 3.5) + ellipse(80, 72, 7, 4, C.white),
  sand: path("M4 106 Q60 40 116 106Z", C.bread) + rect(66, 50, 28, 32, C.coral, 5) + path("M64 52 H96", "none") + stroke("M70 50 Q80 36 90 50", LINE, 3) + thick("M26 56 L40 96", C.blue, 5) + path("M18 52 L40 66 L30 76Z", C.blue) + star(24, 28, 7, C.yellow),
  hotel: rect(18, 22, 84, 86, C.coral, 6) + [34, 54, 74].map((y) => window4(30, y, 16, 14) + window4(52, y, 16, 14) + window4(74, y, 16, 14)).join("") + rect(48, 88, 24, 20, C.ink, 4) + star(60, 12, 9, C.yellow) + rect(18, 22, 84, 8, "#c0392b", 3),
  tent: path("M8 104 L60 18 L112 104Z", C.coral) + path("M60 18 L40 104 H80Z", C.ink) + path("M60 18 L60 104", "none") + stroke("M60 18 V6", LINE, 3.5) + poly("60,6 74,12 60,18", C.yellow) + stroke("M8 104 H112", LINE, 3.5),
  camping: path("M10 104 L52 32 L94 104Z", C.coral) + path("M52 32 L38 104 H66Z", C.ink) + path("M80 106 L98 106", "none") + path("M96 104 q-10 -16 0 -30 q4 10 12 8 q4 14 -4 22Z", C.orange) + path("M99 104 q-5 -8 0 -16 q6 6 4 16Z", C.yellow) + thick("M86 108 L112 100", C.brown, 4) + thick("M112 108 L86 100", C.brown, 4),
  suitcase: stroke("M44 34 V26 Q44 18 52 18 H68 Q76 18 76 26 V34", LINE, 9) + stroke("M44 34 V26 Q44 18 52 18 H68 Q76 18 76 26 V34", C.grey, 4) + rect(14, 32, 92, 68, C.deepBlue, 10) + rect(14, 50, 92, 8, "#7ab0ff", 2) + rect(30, 62, 14, 12, C.yellow, 3) + rect(76, 62, 14, 12, C.yellow, 3) + circle(34, 108, 6, C.ink) + circle(86, 108, 6, C.ink),
  ticket: path("M10 34 H110 V52 A9 9 0 0 0 110 70 V88 H10 V70 A9 9 0 0 0 10 52Z", C.yellow) + stroke("M78 36 V86", LINE, 2.5).replace("/>", ' stroke-dasharray="3 6"/>') + star(40, 61, 14, C.white) + stroke("M88 50 H102 M88 62 H102 M88 74 H102", LINE, 3),
  passport: rect(24, 10, 72, 100, C.deepBlue, 8) + circle(60, 50, 20, "none").replace(/stroke="[^"]*" stroke-width="3"/, `stroke="${C.yellow}" stroke-width="3.5"`) + stroke("M40 50 H80 M60 30 V70 M46 38 Q60 50 46 62 M74 38 Q60 50 74 62", C.yellow, 2.5) + rect(40, 84, 40, 8, C.yellow, 3),
  map: poly("10,28 40,18 80,30 110,20 110,92 80,102 40,90 10,100", "#f6ead2") + stroke("M40 18 V90 M80 30 V102", C.grey, 2.5) + stroke("M20 78 Q40 56 56 70 T92 44", C.red, 3).replace("/>", ' stroke-dasharray="1 7"/>') + path("M92 34 a10 10 0 1 1 0.1 0 l-0.1 0 L92 54Z", C.coral).replace("a10 10", "a0 0") + circle(92, 38, 8, C.red) + circle(92, 38, 3, C.white),
  bus: rect(6, 30, 108, 56, C.yellow, 10) + [14, 34, 54, 74].map((x) => window4(x, 38, 16, 20)).join("") + window4(94, 38, 14, 20) + rect(6, 62, 108, 6, "#ffb300", 2) + wheel(30, 90, 12) + wheel(88, 90, 12) + rect(4, 70, 6, 8, C.red, 2),
  taxi: path("M8 72 Q8 58 24 56 L36 34 H84 L96 56 Q112 58 112 72 V86 H8Z", C.yellow) + path("M42 40 H78 L88 56 H32Z", C.sky) + stroke("M60 40 V56", LINE, 2.5) + rect(46, 22, 28, 12, C.white, 3) + path("M14 70 H106", "none") + stroke("M14 72 H106", "#fff", 3) + wheel(32, 88, 12) + wheel(88, 88, 12) + rect(100, 66, 10, 8, C.coral, 2),
  lorry: rect(6, 24, 70, 56, C.blue, 6) + path("M76 40 H98 L112 58 V80 H76Z", C.coral) + path("M82 46 H96 L106 58 H82Z", C.sky) + wheel(28, 86, 12) + wheel(62, 86, 12) + wheel(96, 86, 12) + stroke("M16 40 H64 M16 54 H64", "#7ab8f5", 4),
  van: path("M8 40 Q8 28 20 28 H78 Q90 28 100 52 L112 60 V86 H8Z", C.white) + path("M82 36 H92 L104 56 H82Z", C.sky) + stroke("M10 62 H110", C.coral, 5) + wheel(32, 88, 12) + wheel(88, 88, 12) + rect(104, 66, 8, 8, C.yellow, 2),
  ship: path("M6 62 H114 L100 92 Q60 102 20 92Z", C.coral) + rect(36, 38, 48, 24, C.white, 4) + rect(52, 18, 16, 20, C.blue, 3) + circle(46, 50, 5, C.sky) + circle(60, 50, 5, C.sky) + circle(74, 50, 5, C.sky) + waves("M8 108 q10 -6 20 0 t20 0 t20 0 t20 0 t20 0"),
  helicopter: ellipse(54, 66, 34, 24, C.coral) + path("M80 62 L112 52 V64 L82 76Z", C.coral) + path("M36 50 H64 L74 66 H34Z", C.sky) + stroke("M54 42 V32 M14 30 H94", LINE, 3.5) + stroke("M30 94 H78 M42 88 V94 M66 88 V94", LINE, 3.5) + circle(110, 58, 6, C.yellow),
  motorbike: circle(26, 84, 20, C.ink) + circle(26, 84, 8, C.grey) + circle(96, 84, 20, C.ink) + circle(96, 84, 8, C.grey) + path("M26 84 L48 54 H72 L96 84 M48 54 L40 36 H28", "none") + thick("M26 84 L48 56 H70 L96 84", C.coral, 6) + rect(46, 40, 28, 14, C.ink, 6) + thick("M82 40 L96 84", C.grey, 5) + thick("M78 38 H96", C.grey, 5),
  tram: rect(14, 30, 92, 54, C.green, 10) + [22, 44, 66, 88].map((x) => window4(x, 38, 14, 18)).join("") + rect(14, 62, 92, 6, C.white, 2) + stroke("M60 30 V14 M44 14 H76", LINE, 3.5) + stroke("M6 96 H114", LINE, 4) + wheel(36, 90, 8) + wheel(84, 90, 8),
  road: path("M0 12 H44 L8 108 H0Z", C.leaf) + path("M120 12 H76 L112 108 H120Z", C.leaf) + path("M44 12 H76 L112 108 H8Z", C.dark) + stroke("M60 18 V30 M60 42 V58 M60 70 V92", C.white, 5) + stroke("M0 12 H120", LINE, 3),
  bridge: rect(8, 92, 104, 16, C.water, 4) + path("M6 30 H114 V92 H98 Q60 30 22 92 H6 Z", C.bread) + rect(4, 22, 112, 14, C.tan, 4) + stroke("M24 36 V50 M48 36 V46 M72 36 V46 M96 36 V50", LINE, 3) + waves("M14 100 q8 -5 16 0 t16 0 t16 0 t16 0 t16 0"),
  cave: path("M6 108 Q10 28 60 20 Q110 28 114 108Z", C.grey) + path("M32 108 Q32 58 60 54 Q88 58 88 108Z", C.ink) + path("M46 78 q6 -8 14 -2 q8 -6 14 2 q-8 4 -14 -2 q-6 6 -14 2Z", "#7a7192") + star(24, 38, 5, C.white),
  hill: path("M0 106 Q20 36 62 32 Q106 36 120 106Z", C.leaf) + path("M30 106 Q50 70 80 72 Q104 76 118 106Z", C.green).replace(/stroke="[^"]*" stroke-width="3"/, 'stroke="none"').replace("/>", ' opacity=".35"/>') + circle(50, 54, 5, C.pink) + circle(76, 66, 5, C.yellow) + circle(36, 78, 5, C.white) + stroke("M0 106 H120", LINE, 3),
  forest: pine(30, 44, 1) + pine(60, 36, 1.2) + pine(92, 46, 1) + stroke("M4 108 H116", LINE, 3.5),
  village: path("M2 108 H118", "none") + [[8, 60], [44, 52], [80, 62]].map(([x, y], i) => rect(x, y + 12, 30, 40, [C.coral, C.yellow, C.pink][i], 3) + poly(`${x - 4},${y + 14} ${x + 15},${y - 6} ${x + 34},${y + 14}`, [C.brown, C.red, C.deepBlue][i]) + window4(x + 9, y + 24, 12, 12)).join("") + stroke("M2 108 H118", LINE, 3.5),
  farm: rect(22, 44, 62, 56, C.red, 4) + poly("16,46 53,14 90,46", C.brown) + rect(44, 66, 18, 34, C.white, 2) + stroke("M44 66 L62 100 M62 66 L44 100", C.red, 2.5) + rect(88, 30, 22, 70, C.grey, 8) + path("M88 34 Q99 14 110 34Z", C.coral) + stroke("M4 108 H116 M6 90 V108 M20 90 V108", LINE, 3.5),
};
Object.assign(pictures, more);
