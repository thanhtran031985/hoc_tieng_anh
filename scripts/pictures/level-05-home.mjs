// Cấp 5: Nhà cửa (home-household). Từ trừu tượng hoặc khó vẽ rõ (household, furniture, ceiling, basement…) không có hình, xem decisions.md.
import { C, LINE, circle, ellipse, rect, path, poly, dot, stroke, shine, thick, cloud } from "./lib.mjs";

const knob = (x, y) => circle(x, y, 3, C.gold);
const steam = (x, y) => stroke(`M${x} ${y} q-5 -6 0 -12 q5 -6 0 -12`, C.grey, 3.5);

export const home = {
  wardrobe:
    rect(24, 8, 72, 94, C.brown, 6) + rect(30, 14, 28, 80, "#a3703f", 3) + rect(62, 14, 28, 80, "#a3703f", 3) + knob(53, 56) + knob(67, 56) + rect(28, 102, 10, 8, C.dark, 2) + rect(82, 102, 10, 8, C.dark, 2),
  drawer:
    rect(14, 24, 92, 80, C.brown, 6) + [0, 1, 2].map((i) => rect(22, 30 + i * 24, 76, 18, "#a3703f", 3) + knob(60, 39 + i * 24)).join("") + rect(20, 104, 10, 8, C.dark, 2) + rect(90, 104, 10, 8, C.dark, 2),
  bookcase:
    rect(18, 8, 84, 104, C.brown, 5) + rect(24, 14, 72, 92, C.cream, 2) + [34, 62, 90].map((y) => rect(22, y, 76, 5, C.brown, 1)).join("") +
    [[26, 18, C.red], [36, 20, C.blue], [46, 16, C.green], [58, 18, C.yellow], [68, 20, C.purple], [80, 16, C.coral]].map(([x, y, c]) => rect(x, y, 9, 34 - (y - 14), c, 1)).join("") +
    [[26, 46, C.blue], [38, 44, C.orange], [50, 48, C.green], [62, 44, C.red], [74, 46, C.yellow]].map(([x, y, c]) => rect(x, y, 10, 16, c, 1)).join("") + rect(28, 72, 28, 16, C.sky, 2) + rect(62, 74, 26, 14, C.pink, 2),
  armchair:
    rect(24, 18, 72, 52, C.coral, 16) + rect(8, 52, 26, 40, "#e5603f", 10) + rect(86, 52, 26, 40, "#e5603f", 10) + rect(28, 56, 64, 30, C.pink, 8) + rect(22, 92, 8, 16, C.brown, 2) + rect(90, 92, 8, 16, C.brown, 2),
  stool:
    ellipse(60, 40, 38, 14, C.bread) + rect(22, 40, 76, 14, C.tan, 6) + stroke("M34 54 L26 108 M60 54 V108 M86 54 L94 108", LINE, 6) + stroke("M34 54 L26 108 M60 54 V108 M86 54 L94 108", C.brown, 3),
  "bunk bed":
    stroke("M14 14 V110 M106 14 V110", LINE, 7) + rect(12, 36, 96, 12, C.blue, 3) + rect(12, 82, 96, 12, C.blue, 3) + rect(16, 24, 22, 12, C.white, 4) + rect(16, 70, 22, 12, C.white, 4) + stroke("M96 48 V82 M96 56 H108 M96 66 H108 M96 76 H108", LINE, 3.5),
  duvet:
    rect(10, 56, 100, 48, C.deepBlue, 12) + stroke("M10 72 H110 M10 88 H110", C.sky, 3) + rect(14, 30, 44, 26, C.white, 10) + rect(8, 100, 104, 8, C.brown, 3),
  cushion:
    path("M18 24 Q60 12 102 24 Q108 60 102 96 Q60 108 18 96 Q12 60 18 24Z", C.pink) + circle(60, 60, 5, C.red) + stroke("M60 60 L30 36 M60 60 L90 36 M60 60 L30 84 M60 60 L90 84", C.coral, 2.5) + dot(18, 24, 5, C.gold) + dot(102, 24, 5, C.gold) + dot(18, 96, 5, C.gold) + dot(102, 96, 5, C.gold),
  rug:
    ellipse(60, 64, 52, 32, C.red) + ellipse(60, 64, 40, 22, C.cream) + ellipse(60, 64, 28, 13, C.blue) + ellipse(60, 64, 12, 6, C.yellow) + stroke("M6 60 H0 M6 68 H0 M114 60 H120 M114 68 H120", LINE, 3),
  balcony:
    rect(4, 8, 112, 60, C.sky, 8) + cloud(86, 28, 0.5) + rect(4, 66, 112, 8, C.grey, 3) + rect(4, 74, 112, 8, C.dark, 3) + [14, 32, 50, 68, 86, 104].map((x) => rect(x, 74, 4, 34, C.dark, 1)).join("") + rect(4, 106, 112, 6, C.grey, 3) + rect(22, 50, 16, 16, C.coral, 3) + circle(26, 42, 6, C.leaf) + circle(34, 40, 6, C.pink),
  fence:
    rect(4, 8, 112, 104, C.sky, 8) + rect(4, 88, 112, 22, C.leaf, 4) + [8, 28, 48, 68, 88, 108].map((x) => poly(`${x},34 ${x + 8},24 ${x + 16},34 ${x + 16},100 ${x},100`, C.cream)).join("") + rect(4, 48, 112, 8, C.tan, 2) + rect(4, 76, 112, 8, C.tan, 2),
  gate:
    rect(8, 14, 14, 96, C.brown, 3) + rect(98, 14, 14, 96, C.brown, 3) + rect(24, 30, 72, 70, "none", 2) + [30, 42, 54, 66, 78, 90].map((x) => stroke(`M${x} 32 V100`, C.dark, 5)).join("") + stroke("M24 40 H96 M24 90 H96", C.dark, 6) + circle(90, 66, 4, C.gold),
  lawn:
    rect(4, 60, 112, 50, C.leaf, 6) + stroke("M4 80 H116 M4 96 H116", C.green, 3) + rect(24, 42, 52, 28, C.red, 6) + stroke("M76 52 L104 30", LINE, 5) + circle(34, 76, 9, C.ink) + circle(66, 76, 9, C.ink) + circle(34, 76, 4, C.grey) + dot(98, 92, 4, C.pink) + dot(14, 98, 4, C.yellow),
  chimney:
    poly("4,108 60,48 116,108", C.coral) + rect(70, 18, 20, 44, C.red, 2) + rect(66, 14, 28, 8, C.dark, 2) + stroke("M80 12 q-6 -6 0 -10", C.grey, 3.5) + cloud(30, 24, 0.5, C.grey) + stroke("M72 32 H88 M72 44 H88", LINE, 2.5),
  fireplace:
    rect(10, 18, 100, 92, C.coral, 4) + rect(4, 18, 112, 10, C.brown, 3) + path("M30 110 V54 Q30 40 60 40 Q90 40 90 54 V110Z", C.ink) + path("M48 108 Q40 84 56 64 Q56 80 66 74 Q80 92 74 108Z", C.orange) + path("M56 108 Q54 94 62 86 Q70 96 66 108Z", C.yellow) + stroke("M14 44 H26 M14 62 H26 M94 44 H106 M94 62 H106", LINE, 2.5),
  heater:
    rect(14, 24, 92, 66, C.white, 8) + [24, 40, 56, 72, 88].map((x) => rect(x, 30, 10, 54, C.grey, 4)).join("") + stroke("M20 100 q8 -10 0 -18 M56 106 q8 -8 0 -16 M92 100 q8 -10 0 -18", C.orange, 4) + rect(22, 90, 8, 12, C.dark, 2) + rect(90, 90, 8, 12, C.dark, 2),
  "air conditioner":
    rect(8, 14, 104, 44, C.white, 10) + rect(14, 40, 92, 8, C.grey, 3) + stroke("M20 48 H100", LINE, 2) + circle(98, 26, 4, C.green) + stroke("M26 70 q8 12 -2 24 M54 70 q8 12 -2 24 M82 70 q8 12 -2 24", C.water, 4) + star6(104, 96),
  "washing machine":
    rect(16, 8, 88, 104, C.white, 8) + rect(22, 14, 76, 16, C.grey, 4) + circle(36, 22, 4, C.red) + circle(50, 22, 4, C.blue) + circle(60, 70, 28, C.grey) + circle(60, 70, 21, C.water) + stroke("M46 70 q7 -8 14 0 t14 0", C.white, 3.5),
  dishwasher:
    rect(16, 8, 88, 104, C.grey, 8) + rect(22, 14, 76, 12, C.dark, 3) + circle(88, 20, 3, C.green) + rect(24, 34, 72, 70, C.white, 5) + [0, 1, 2, 3].map((i) => rect(32 + i * 14, 54, 6, 40, C.sky, 2)).join("") + stroke("M30 46 H90", LINE, 3),
  microwave:
    rect(6, 28, 108, 66, C.dark, 8) + rect(14, 36, 70, 50, C.sky, 5) + rect(90, 36, 18, 50, C.grey, 4) + circle(99, 46, 4, C.red) + rect(93, 56, 12, 6, C.yellow, 2) + rect(93, 66, 12, 6, C.yellow, 2) + rect(14, 94, 8, 8, C.dark, 2) + rect(98, 94, 8, 8, C.dark, 2) + ellipse(48, 74, 18, 6, C.cream),
  oven:
    rect(12, 10, 96, 100, C.grey, 8) + rect(18, 16, 84, 14, C.dark, 3) + [30, 52, 74].map((x) => circle(x, 23, 4, C.red)).join("") + rect(20, 38, 80, 62, C.dark, 5) + rect(26, 46, 68, 40, C.orange, 3) + ellipse(60, 74, 20, 8, C.bread) + stroke("M26 94 H94", C.grey, 5),
  kettle:
    path("M26 100 Q22 56 46 44 H74 Q98 56 94 100Z", C.red) + rect(48, 34, 24, 10, C.dark, 4) + circle(60, 30, 5, C.dark) + path("M26 78 Q8 74 10 58 Q14 54 22 60", "none") + stroke("M94 60 Q112 58 108 82 Q104 90 94 88", LINE, 6) + path("M26 70 Q8 60 8 48 L24 56Z", C.red) + steam(36, 34) + rect(24, 100, 72, 8, C.dark, 3),
  toaster:
    rect(10, 56, 100, 50, C.grey, 12) + rect(24, 52, 30, 8, C.dark, 3) + rect(66, 52, 30, 8, C.dark, 3) + path("M26 54 V30 Q26 22 40 22 Q54 22 52 30 V54Z", C.bread) + path("M68 54 V34 Q68 26 82 26 Q96 26 94 34 V54Z", C.bread) + circle(30, 82, 5, C.dark) + rect(76, 78, 24, 8, C.red, 3),
  iron:
    path("M10 96 L22 52 Q30 38 60 40 H88 Q106 42 108 66 V96Z", C.blue) + rect(10, 90, 98, 14, C.grey, 5) + stroke("M42 40 Q60 22 82 40", LINE, 7) + circle(86, 70, 6, C.white) + stroke("M26 98 H100", LINE, 2) + steam(30, 36),
  "vacuum cleaner":
    ellipse(40, 80, 34, 24, C.red) + circle(26, 100, 10, C.dark) + circle(60, 100, 10, C.dark) + thick("M62 70 Q96 64 90 36 L100 18", C.grey, 7) + rect(88, 8, 26, 10, C.dark, 3) + path("M60 106 H112 L108 112 H60Z", C.dark) + circle(34, 74, 6, C.white),
  broom:
    thick("M66 6 L44 68", C.brown, 7) + path("M26 66 L58 62 L72 112 H18Z", C.yellow) + stroke("M32 72 L26 108 M42 70 L40 110 M52 68 L54 110 M62 66 L66 108", C.gold, 3) + rect(22, 62, 38, 8, C.red, 3),
  bucket:
    path("M22 36 H98 L88 106 H32Z", C.blue) + ellipse(60, 36, 38, 8, C.deepBlue) + stroke("M24 34 Q60 -10 96 34", LINE, 4.5) + stroke("M34 54 H86", C.white, 3).replace("/>", ' opacity=".6"/>') + shine("M32 46 L38 90"),
  dustbin:
    rect(26, 38, 68, 70, C.grey, 6) + rect(20, 28, 80, 14, C.dark, 5) + rect(48, 18, 24, 10, C.dark, 4) + [40, 56, 72].map((x) => stroke(`M${x} 50 V96`, LINE, 3)).join("") + shine("M32 52 V90"),
  hammer:
    thick("M30 108 L70 40", C.brown, 9) + rect(40, 12, 62, 24, C.grey, 4) + rect(86, 6, 14, 36, C.dark, 3) + rect(44, 16, 14, 16, "#aab0bb", 2),
  nail:
    poly("28,12 92,12 92,22 66,22 66,98 60,112 54,98 54,22 28,22", C.grey) + stroke("M60 30 V90", C.white, 2.5).replace("/>", ' opacity=".7"/>'),
  screw:
    ellipse(60, 22, 34, 12, C.grey) + stroke("M44 22 H76", LINE, 4) + rect(46, 30, 28, 70, C.grey, 4) + stroke("M44 44 L76 52 M44 58 L76 66 M44 72 L76 80 M44 86 L76 94", LINE, 3.5) + poly("46,100 74,100 60,114", C.grey),
  ladder:
    stroke("M34 8 L22 112 M86 8 L98 112", LINE, 11) + stroke("M34 8 L22 112 M86 8 L98 112", C.tan, 6) + [24, 44, 64, 84, 102].map((y, i) => rect(28 - i * 1.2, y - 4, 64 + i * 2.4, 8, C.brown, 2)).join(""),
  rope:
    ellipse(60, 66, 46, 30, C.bread) + ellipse(60, 66, 32, 19, C.cream) + ellipse(60, 66, 17, 8, C.bread) + stroke("M20 54 L32 72 M44 38 L50 56 M76 38 L72 56 M100 54 L88 72 M30 88 L40 78 M90 88 L80 78", C.brown, 2.5) + thick("M104 70 Q116 90 100 104", C.bread, 6),
  torch:
    path("M36 18 H78 L84 40 H30Z", C.yellow) + rect(34, 38, 44, 70, C.deepBlue, 8) + rect(44, 56, 24, 12, C.red, 4) + poly("30,14 84,14 112,4 112,50", C.yellow).replace('fill="#ffd23f"', 'fill="#fff3b0"') + rect(30, 12, 54, 8, C.dark, 3),
  candle:
    rect(36, 52, 48, 54, C.cream, 6) + rect(30, 100, 60, 10, C.gold, 4) + stroke("M60 52 V40", LINE, 3) + path("M60 8 Q44 28 54 38 Q60 44 66 38 Q76 28 60 8Z", C.orange) + path("M60 20 Q54 30 58 36 Q62 38 64 32Z", C.yellow) + stroke("M44 66 q6 12 -2 22", C.white, 3).replace("/>", ' opacity=".7"/>'),
  plug:
    rect(32, 14, 56, 56, C.dark, 12) + rect(42, 66, 10, 30, C.grey, 2) + rect(68, 66, 10, 30, C.grey, 2) + stroke("M60 14 V6", LINE, 4) + thick("M60 10 Q60 -4 80 4", C.dark, 6).replace("M80 4", "M80 4") + circle(60, 40, 8, C.grey),
  socket:
    rect(16, 16, 88, 88, C.white, 12) + circle(60, 60, 34, C.cream) + rect(40, 46, 8, 28, C.dark, 3) + rect(72, 46, 8, 28, C.dark, 3) + circle(60, 82, 3.5, C.dark) + dot(26, 26, 3, C.grey) + dot(94, 94, 3, C.grey),
  switch:
    rect(28, 12, 64, 96, C.white, 10) + rect(40, 28, 40, 64, C.cream, 8) + rect(46, 36, 28, 28, C.grey, 5) + rect(46, 36, 28, 14, C.dark, 4) + dot(34, 20, 2.5, C.grey) + dot(86, 100, 2.5, C.grey),
  tool:
    stroke("M42 40 V28 Q42 20 50 20 H70 Q78 20 78 28 V40", LINE, 5) + rect(10, 38, 100, 66, C.red, 8) + rect(10, 62, 100, 8, "#c0392b", 2) + rect(50, 58, 20, 16, C.gold, 3) + shine("M18 46 H60"),
};

function star6(x, y) {
  return stroke(`M${x - 8} ${y} H${x + 8} M${x} ${y - 8} V${y + 8} M${x - 6} ${y - 6} L${x + 6} ${y + 6} M${x + 6} ${y - 6} L${x - 6} ${y + 6}`, C.water, 3);
}
