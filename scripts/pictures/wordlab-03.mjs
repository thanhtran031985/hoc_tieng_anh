// Hình đáp án của Khám phá từ cho các từ cấp 3 (task 27): những thứ không phải từ vựng riêng nên không nằm ở level-03-*.mjs.
import { C, LINE, circle, dot, ellipse, g, path, rect, stroke, thick, union, uc } from "./lib.mjs";

export const pictures = {
  seat: rect(34, 12, 52, 58, C.deepBlue, 14) + rect(40, 20, 40, 18, "#5f9cf5", 8) + rect(24, 64, 72, 26, C.blue, 9) + thick("M40 92 V108 M80 92 V108", C.grey, 5),
  propeller: g("rotate(-20 60 60)", rect(6, 53, 108, 14, C.grey, 7)) + g("rotate(70 60 60)", rect(6, 53, 108, 14, C.grey, 7)) + circle(60, 60, 11, C.red) + dot(60, 60, 4, C.white),
  handle: rect(18, 52, 84, 58, C.red, 10) + stroke("M18 80 H102", "#c0392b", 3) + thick("M40 52 V36 Q40 26 50 26 H70 Q80 26 80 36 V52", C.dark, 5) + rect(54, 74, 12, 10, C.yellow, 3),
  strings: rect(30, 6, 60, 108, C.brown, 10) + stroke("M30 36 H90 M30 62 H90 M30 88 H90", LINE, 3) + stroke("M42 12 V108 M51 12 V108 M60 12 V108 M69 12 V108 M78 12 V108", "#ffffff", 2.5),
  keys:
    rect(8, 34, 98, 60, C.white, 6) + stroke("M22 62 V94 M36 62 V94 M50 34 V94 M64 62 V94 M78 62 V94 M92 62 V94", LINE, 2.5) +
    [22, 36, 64, 78, 92].map((x) => rect(x - 5, 34, 10, 34, C.ink, 2)).join(""),
  lens: circle(60, 60, 48, C.ink) + circle(60, 60, 36, C.dark) + circle(60, 60, 24, C.deepBlue) + circle(60, 60, 11, C.sky) + stroke("M36 40 q8 -10 20 -10", "#ffffff", 4).replace("/>", ' opacity=".7"/>'),
  stem: thick("M60 114 V22", C.green, 9) + path("M60 84 Q30 78 26 52 Q54 54 60 84Z", C.leaf) + path("M60 62 Q90 58 96 34 Q66 34 60 62Z", C.leaf) + path("M20 114 Q60 100 100 114Z", C.tan),
  "mushroom-stem": path("M40 116 Q50 76 46 22 H74 Q70 76 80 116Z", C.cream) + stroke("M56 40 V100 M66 40 V96", "#e8c9a0", 3) + path("M22 116 Q60 104 98 116Z", C.leaf),
  petals: union(C.pink, uc(60, 26, 20), uc(94, 44, 20), uc(94, 78, 20), uc(60, 96, 20), uc(26, 78, 20), uc(26, 44, 20)) + circle(60, 60, 17, C.yellow),
  helmet: path("M14 78 Q14 22 60 22 Q106 22 106 78Z", C.yellow) + rect(8, 74, 104, 16, "#e0a800", 7) + stroke("M60 24 V72", "#e0a800", 4) + ellipse(40, 44, 10, 6, "#ffe58a").replace('stroke-width="3"', 'stroke-width="0"'),
};
