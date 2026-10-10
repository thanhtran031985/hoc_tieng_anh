// Cấp 5: Khoa học, học tập (science-study). Từ trừu tượng (theory, research, skill, pass…) không có hình, xem decisions.md.
import { C, LINE, circle, ellipse, rect, path, poly, dot, stroke, thick, g, star } from "./lib.mjs";

const gear = (cx, cy, r, n, color) =>
  Array.from({ length: n }, (_, i) => g(`rotate(${(i * 360) / n} ${cx} ${cy})`, rect(cx - 5, cy - r - 8, 10, 16, color, 2))).join("") + circle(cx, cy, r, color) + circle(cx, cy, r * 0.38, C.cream);
const flask = (x, y, s, liquid) =>
  g(`translate(${x} ${y}) scale(${s})`, poly("-8,-30 8,-30 8,-12 28,22 28,28 -28,28 -28,22 -8,-12", "#e8f6ff") + poly("-20,6 20,6 28,22 28,28 -28,28 -28,22", liquid) + rect(-11, -34, 22, 7, C.grey, 3));
const tube = (x, y, liquid) => rect(x, y, 14, 52, "#e8f6ff", 7) + rect(x + 1, y + 24, 12, 27, liquid, 6);

export const science = {
  microscope:
    rect(26, 96, 68, 12, C.dark, 5) + thick("M82 94 Q104 70 84 40", C.grey, 9) + g("rotate(-22 58 42)", rect(48, 12, 20, 50, C.deepBlue, 5) + rect(50, 8, 16, 8, C.navy, 3) + rect(52, 60, 12, 12, C.grey, 3)) + rect(38, 82, 36, 8, C.grey, 3),
  telescope:
    stroke("M52 62 L28 110 M58 62 L60 110 M66 62 L92 110", LINE, 5) + g("rotate(-28 58 50)", rect(18, 38, 80, 24, C.deepBlue, 6) + rect(10, 40, 14, 20, C.gold, 3) + rect(88, 36, 16, 28, C.navy, 3)) + star(98, 20, 7, C.yellow) + star(18, 28, 5, C.yellow),
  satellite:
    rect(6, 52, 34, 18, C.deepBlue, 2) + stroke("M17 52 V70 M28 52 V70", C.white, 2) + rect(80, 52, 34, 18, C.deepBlue, 2) + stroke("M91 52 V70 M102 52 V70", C.white, 2) +
    rect(40, 56, 40, 10, C.dark, 2) + rect(44, 40, 32, 42, C.gold, 5) + circle(60, 61, 8, C.sky) + stroke("M60 40 V24", LINE, 3.5) + path("M48 24 Q60 10 72 24Z", C.grey) + star(104, 24, 6, C.yellow) + star(14, 96, 5, C.yellow),
  magnet:
    thick("M32 26 V68 Q32 98 60 98 Q88 98 88 68 V26", C.red, 20) + rect(22, 14, 20, 20, C.grey, 2) + rect(78, 14, 20, 20, C.grey, 2) + stroke("M16 8 L22 14 M104 8 L98 14 M60 6 V14", C.gold, 3.5) + [[44, 40], [56, 46], [70, 38]].map(([x, y]) => dot(x, y, 2.5, C.dark)).join(""),
  machine:
    rect(8, 88, 104, 22, C.dark, 6) + gear(40, 56, 18, 8, C.orange) + gear(84, 44, 12, 6, C.deepBlue) + gear(78, 76, 9, 6, C.green),
  engine:
    rect(18, 54, 84, 44, C.dark, 6) + [28, 48, 68, 88].map((x, i) => rect(x - 6, 30, 12, 26, i % 2 ? C.grey : C.coral, 3) + circle(x, 26, 4, C.gold)).join("") + circle(22, 76, 12, C.grey) + circle(22, 76, 5, C.dark) + stroke("M34 76 H96 M34 88 H96", C.grey, 3.5) + thick("M102 70 Q118 70 114 96", C.grey, 6),
  calculator:
    rect(26, 8, 68, 104, C.dark, 10) + rect(34, 16, 52, 22, "#cfe9d4", 4) + stroke("M70 26 H80", LINE, 3) +
    [0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => rect(34 + c * 18, 46 + r * 16, 14, 11, C.sky, 3))).join("") + rect(34, 94, 32, 11, C.white, 3) + rect(70, 94, 14, 11, C.red, 3),
  laboratory:
    rect(8, 88, 104, 22, C.tan, 4) + rect(16, 84, 88, 8, C.brown, 3) + flask(36, 62, 0.9, C.green) + tube(66, 34, C.coral) + tube(82, 40, C.water) + rect(62, 74, 36, 12, C.brown, 3) + stroke("M12 22 H36 M12 34 H30", C.grey, 4),
  experiment:
    flask(60, 76, 1.5, C.lime) + [[46, 24, 6], [62, 14, 5], [74, 26, 7], [56, 36, 4]].map(([x, y, r]) => circle(x, y, r, "#e8f6ff")).join("") + star(100, 22, 7, C.yellow) + star(18, 30, 5, C.yellow),
  space:
    rect(4, 8, 112, 104, C.navy, 10) + circle(32, 76, 18, C.orange) + stroke("M16 70 Q32 78 48 66", "#e87d12", 3) + circle(88, 34, 12, C.cream) + circle(84, 30, 3, C.grey) + circle(94, 40, 2.5, C.grey) + [[16, 24], [52, 18], [70, 62], [100, 88], [58, 98], [108, 58]].map(([x, y]) => star(x, y, 5, C.yellow)).join(""),
  university:
    poly("14,52 60,22 106,52", C.coral) + rect(14, 50, 92, 8, C.cream, 2) + [24, 44, 64, 84].map((x) => rect(x, 58, 12, 38, C.white, 2)).join("") + rect(10, 94, 100, 8, C.grey, 2) + rect(4, 102, 112, 8, C.dark, 2) + circle(60, 40, 6, C.yellow),
  certificate:
    rect(12, 22, 96, 70, C.cream, 4) + rect(18, 28, 84, 58, "none", 2).replace('fill="none"', 'fill="none"') + stroke("M34 44 H86 M40 56 H80 M34 68 H62", LINE, 2.5) + poly("78,86 70,108 82,102 94,108 90,86", C.red) + circle(84, 80, 12, C.gold) + star(84, 80, 6, C.white),
  diploma:
    rect(12, 40, 96, 38, C.cream, 18) + ellipse(108, 59, 6, 19, "#f0d9b0") + ellipse(12, 59, 6, 19, "#f0d9b0") + stroke("M30 52 H88 M30 66 H78", LINE, 2.5) + rect(52, 38, 14, 42, C.red, 2) + poly("52,80 46,100 58,92", C.red) + poly("66,80 72,100 60,92", C.red),
};
