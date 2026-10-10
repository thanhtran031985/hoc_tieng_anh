// Hình đáp án của Khám phá từ cho các từ cấp 2 (task 27): những thứ không phải từ vựng riêng nên không nằm ở level-02-*.mjs.
import { C, circle, ellipse, rect, path, poly, stroke, thick, dot, waves, face } from "./lib.mjs";

export const pictures = {
  fin: rect(4, 78, 112, 38, C.water, 10) + waves("M10 92 q10 -6 20 0 t20 0 t20 0 t20 0 t20 0") + path("M30 80 Q40 36 80 18 Q76 48 94 80Z", "#2f8fd8") + stroke("M50 74 Q56 52 70 38", "#9fd4ff", 3),
  bamboo: [30, 60, 90].map((x, i) => rect(x - 7, 8 + i * 4, 14, 104 - i * 4, C.leaf, 4) + stroke(`M${x - 7} ${40 + i * 6} H${x + 7} M${x - 7} ${78 + i * 4} H${x + 7}`, "#2b2440", 3)).join("") + path("M37 36 Q58 30 66 16 Q50 14 37 36Z", C.green) + path("M83 62 Q62 56 54 42 Q70 40 83 62Z", C.green),
  smell: path("M60 14 C74 40 90 64 90 82 C90 104 74 112 60 112 C46 112 30 104 30 82 C30 64 46 40 60 14Z", C.skin) + ellipse(48, 92, 7, 5, "#d79b62") + ellipse(72, 92, 7, 5, "#d79b62") + stroke("M100 40 q10 -8 8 -20 M104 62 q12 -4 12 -16", C.leaf, 4) + stroke("M16 40 q-10 -8 -8 -20 M12 62 q-12 -4 -12 -16", C.leaf, 4),
  button: circle(60, 60, 46, C.white) + circle(60, 60, 34, "#eef3f8") + circle(48, 48, 6, C.ink) + circle(72, 48, 6, C.ink) + circle(48, 72, 6, C.ink) + circle(72, 72, 6, C.ink) + stroke("M48 48 L72 72 M72 48 L48 72", C.coral, 3),
  smile: circle(60, 60, 46, C.yellow) + circle(44, 48, 5, "#2b2440") + circle(76, 48, 5, "#2b2440") + path("M32 68 Q60 104 88 68Z", C.white) + stroke("M44 76 H76", "#c9ced6", 2.5),
  candles: rect(18, 70, 84, 42, C.pink, 8) + rect(18, 70, 84, 14, C.white, 6) + [34, 60, 86].map((x) => rect(x - 4, 36, 8, 34, C.sky, 2) + path(`M${x} 14 Q${x + 9} 26 ${x} 34 Q${x - 9} 26 ${x} 14Z`, C.orange)).join(""),
};
