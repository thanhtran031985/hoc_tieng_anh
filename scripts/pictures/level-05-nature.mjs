// Cấp 5: Thiên nhiên, môi trường (nature-environment). Từ trừu tượng (pollution, climate, protect…) không có hình, xem decisions.md.
import { C, LINE, circle, ellipse, rect, path, poly, dot, stroke, shine, thick, g, eye, union, uc, ue, cloud, star, rayCircle, waves, tree, window4 } from "./lib.mjs";

const grass = (y = 84) => rect(4, y, 112, 120 - y - 8, C.leaf, 6);
const arrowArc = (rot) =>
  g(`rotate(${rot} 60 62)`, thick("M60 24 A38 38 0 0 1 92.9 81", C.green, 9) + poly("101.6,86 84.2,76 86,95", C.green));

export const nature = {
  plastic:
    rect(14, 40, 32, 62, "#cfeaff", 8) + rect(21, 24, 18, 16, C.red, 3) + rect(14, 62, 32, 16, C.white, 2) + stroke("M20 50 V56", C.white, 3) +
    path("M64 44 H106 L110 104 H60Z", C.white) + stroke("M72 44 Q72 26 85 26 Q98 26 98 44", LINE, 3.5) + stroke("M70 70 H100", C.grey, 3) + shine("M66 56 V90"),
  recycle: arrowArc(0) + arrowArc(120) + arrowArc(240),
  rubbish:
    path("M26 60 Q24 104 58 108 Q96 106 94 60 Q78 46 60 52 Q42 46 26 60Z", C.dark) + stroke("M52 50 Q58 34 70 44", LINE, 4) + shine("M38 70 Q36 86 44 96") +
    ellipse(100, 94, 9, 6, C.cream) + stroke("M96 90 q4 -4 8 0", LINE, 2.5) + circle(18, 100, 6, C.red),
  litter:
    grass(78) + rect(12, 58, 22, 36, C.grey, 4) + rect(12, 70, 22, 8, C.red, 1) + ellipse(23, 58, 11, 4, C.white) +
    circle(66, 90, 12, C.white) + stroke("M58 86 L66 92 L72 84 M62 96 L70 98", LINE, 2.5) +
    g("rotate(-70 98 92)", rect(82, 84, 36, 16, "#cfeaff", 6) + rect(110, 88, 8, 8, C.red, 2)),
  solar:
    rayCircle(28, 26, 10) + poly("22,98 98,98 112,56 36,56", C.deepBlue) + stroke("M29 77 H105 M36 98 L50 56 M60 98 L72 56 M82 98 L92 56", C.white, 2.5) + stroke("M60 98 V110 M44 110 H76", LINE, 4),
  electricity:
    circle(60, 48, 30, C.yellow) + rect(46, 74, 28, 20, C.grey, 4) + stroke("M46 82 H74 M48 90 H72", LINE, 2.5) + poly("66,26 48,56 60,56 52,76 76,44 62,44", C.orange) +
    stroke("M12 30 L22 36 M108 30 L98 36 M60 4 V12", C.gold, 4),
  jungle:
    rect(4, 90, 112, 22, C.green, 8) + tree(26, 50, 1.2) + tree(94, 48, 1.2) + tree(60, 62, 1.5) + stroke("M20 28 Q26 52 20 66 M100 26 Q94 50 100 64", "#2f7a2a", 3.5),
  desert:
    rect(4, 8, 112, 104, C.sky, 10) + rayCircle(92, 28, 9) + path("M4 80 Q30 54 60 76 Q88 94 116 66 V104 Q116 112 108 112 H12 Q4 112 4 104Z", C.bread) +
    rect(24, 56, 12, 40, C.green, 6) + rect(14, 62, 8, 18, C.green, 4) + rect(38, 52, 8, 22, C.green, 4) + stroke("M18 80 H26 M46 74 H34", LINE, 2.5),
  volcano:
    cloud(32, 22, 0.7, C.grey) + cloud(88, 14, 0.6, C.grey) + poly("8,106 44,44 76,44 112,106", C.brown) + poly("44,44 76,44 70,34 50,34", C.red) + path("M56 36 Q50 60 40 70 M66 38 Q70 62 78 72", "none").replace('fill="none"', 'fill="none"') + stroke("M58 44 Q54 64 46 78 M64 44 Q66 66 72 80", C.orange, 5) + dot(40, 24, 3, C.orange) + dot(82, 28, 3, C.orange),
  earthquake:
    rect(4, 82, 112, 30, C.tan, 6) + g("rotate(-9 50 70)", rect(22, 44, 56, 42, C.cream, 4) + poly("16,46 50,22 84,46", C.coral) + window4(32, 56, 14, 14) + rect(58, 60, 14, 26, C.brown, 2)) +
    stroke("M40 84 L52 96 L44 104 L60 112 M92 84 L84 96 L92 106", LINE, 4) + stroke("M8 44 L2 52 M112 44 L118 52 M6 66 H0 M114 66 H120", LINE, 3.5),
  flood:
    rect(26, 26, 52, 42, C.cream, 4) + poly("20,28 52,6 84,28", C.coral) + rect(42, 46, 20, 22, C.sky, 3) + rect(4, 58, 112, 52, C.water, 8) + waves("M10 70 q10 -6 20 0 t20 0 t20 0 t20 0 t20 0") + waves("M10 92 q10 -6 20 0 t20 0 t20 0 t20 0 t20 0") + circle(98, 60, 8, C.sky),
  drought:
    rayCircle(92, 26, 12) + rect(4, 56, 112, 54, C.tan, 6) + stroke("M12 70 L30 78 L24 92 L46 100 M60 58 L56 76 L74 86 L68 104 M96 62 L88 80 L106 92", LINE, 3) + stroke("M24 56 Q22 40 30 30 M30 44 L40 40", C.brown, 4),
  tornado:
    cloud(60, 20, 1.3, C.grey) + ellipse(60, 44, 40, 9, C.grey) + ellipse(60, 58, 30, 8, "#aab0bb") + ellipse(60, 72, 22, 7, C.grey) + ellipse(60, 86, 14, 6, "#aab0bb") + ellipse(60, 98, 7, 5, C.grey) + stroke("M16 70 q-6 -4 -2 -10 M104 80 q6 -4 2 -10", LINE, 3),
  hurricane:
    rect(4, 8, 112, 104, "#8fd0ff", 10) + circle(60, 60, 44, C.white) + stroke("M60 60 m-6 0 a6 6 0 1 1 12 0 a14 14 0 1 1 -28 0 a22 22 0 1 1 44 0 a30 30 0 1 1 -60 0", C.grey, 5) + circle(60, 60, 4, C.sky),
  planet:
    stroke("M14 80 Q60 106 106 40", LINE, 12) + circle(60, 60, 30, C.orange) + stroke("M34 50 Q60 60 86 46 M32 70 Q60 80 88 66", "#e87d12", 4) + stroke("M14 80 Q60 106 106 40", C.yellow, 6) + star(20, 24, 6, C.yellow) + star(102, 98, 5, C.yellow),
  earth:
    circle(60, 60, 44, C.water) + blobLand() + shine("M32 36 Q40 24 54 22"),
  ocean:
    rect(4, 8, 112, 56, C.sky, 10) + circle(88, 44, 10, C.yellow) + rect(4, 50, 112, 60, C.water, 8) + waves("M8 64 q10 -6 20 0 t20 0 t20 0 t20 0 t20 0") + waves("M8 80 q10 -6 20 0 t20 0 t20 0 t20 0 t20 0") + waves("M8 96 q10 -6 20 0 t20 0 t20 0 t20 0 t20 0"),
  wave:
    rect(4, 8, 112, 104, C.sky, 10) + path("M6 104 Q10 52 52 40 Q82 34 92 54 Q76 50 68 62 Q60 78 80 90 Q96 98 110 96 V104 Q110 110 104 110 H12 Q6 110 6 104Z", C.water) + path("M52 40 Q70 36 82 44 Q70 46 64 56Z", C.white) + waves("M20 98 q8 -4 16 0 t16 0"),
  coast:
    rect(4, 8, 112, 104, C.sky, 10) + rect(4, 64, 112, 46, C.water, 8) + poly("4,40 52,34 62,110 4,110", C.tan) + path("M4 40 Q20 30 52 34 L56 52 Q30 56 4 52Z", C.green) + waves("M62 84 q8 -4 16 0 t16 0 t16 0") + cloud(90, 26, 0.5),
  valley:
    rect(4, 8, 112, 104, C.sky, 10) + circle(88, 28, 8, C.yellow) + poly("4,100 4,36 44,98", C.green) + poly("116,100 116,40 76,98", "#3d9a35") + poly("4,104 48,70 74,70 116,104", C.leaf) + stroke("M56 76 Q50 90 60 110", C.water, 8) + stroke("M56 76 Q50 90 60 110", "#fff", 2).replace("/>", ' opacity=".7"/>'),
  cliff:
    rect(4, 8, 112, 104, C.sky, 10) + rect(4, 84, 112, 26, C.water, 8) + waves("M8 98 q10 -6 20 0 t20 0 t20 0 t20 0") + path("M4 30 H70 Q80 50 70 72 L76 88 H4Z", C.grey) + rect(4, 24, 66, 10, C.green, 4) + stroke("M30 44 L40 56 L34 70", LINE, 2.5) + path("M92 30 q6 -6 12 0 q6 -6 12 0", "none"),
  rock:
    path("M12 100 Q8 70 28 50 Q44 30 70 36 Q94 40 106 66 Q114 90 104 102Z", C.grey) + path("M34 62 Q50 48 70 52", "none") + stroke("M40 66 Q54 54 72 58 M62 80 L74 94", LINE, 2.5) + shine("M30 72 Q34 60 44 54") + rect(4, 100, 112, 10, C.leaf, 4),
  stone:
    ellipse(60, 104, 52, 8, C.bread) + ellipse(40, 80, 24, 16, C.grey) + ellipse(78, 74, 20, 14, "#aab0bb") + ellipse(62, 96, 14, 9, C.dark) + shine("M28 74 Q32 68 40 66"),
  soil:
    path("M8 106 Q12 78 60 70 Q108 78 112 106Z", C.brown) + stroke("M28 94 H42 M62 88 H78 M80 100 H98", "#5e3b1f", 3) + stroke("M60 70 V44", LINE, 4) + stroke("M60 70 V44", C.green, 2) + path("M60 52 Q40 52 36 34 Q56 32 60 52Z", C.leaf) + path("M60 46 Q80 46 86 28 Q64 26 60 46Z", C.lime),
  mosquito:
    ellipse(66, 62, 22, 9, C.dark) + ellipse(78, 66, 10, 7, C.red) + circle(40, 58, 8, C.dark) + stroke("M32 58 L12 66", LINE, 3) + ellipse(64, 38, 14, 22, "#e8f4ff") + ellipse(84, 40, 12, 20, "#e8f4ff") + stroke("M54 70 L44 96 M64 72 L62 100 M74 72 L84 98", LINE, 3) + eye(40, 56, 2.5),
  wasp:
    ellipse(60, 66, 30, 15, C.yellow) + rect(48, 52, 8, 28, C.ink, 1) + rect(66, 52, 8, 28, C.ink, 1) + circle(32, 62, 11, C.yellow) + eye(28, 60, 3) + ellipse(52, 36, 14, 22, "#e8f4ff") + ellipse(76, 38, 14, 20, "#e8f4ff") + poly("90,66 106,70 90,74", C.ink) + stroke("M26 52 L18 40 M36 51 L40 40", LINE, 2.5),
  worm:
    path("M8 104 H112 V112 H8Z", C.brown) + thick("M14 90 Q30 56 48 82 T82 70 Q98 62 104 74", C.pink, 12) + circle(104, 74, 8, C.pink) + eye(106, 72, 2.5) + stroke("M44 66 Q48 74 44 84 M70 64 Q74 72 70 78", C.coral, 2.5),
  pond:
    ellipse(60, 70, 50, 28, C.leaf) + ellipse(60, 70, 42, 22, C.water) + ellipse(44, 70, 10, 5, C.green) + ellipse(76, 78, 9, 5, C.green) + waves("M40 62 q8 -4 16 0") + stroke("M100 54 V30 M106 56 V36", C.green, 3) + ellipse(100, 30, 3, 6, C.brown) + ellipse(106, 36, 3, 6, C.brown),
  stream:
    rect(4, 8, 112, 104, C.leaf, 10) + path("M40 8 Q70 40 50 64 Q30 86 66 112 H86 Q54 84 76 62 Q96 40 62 8Z", C.water) + waves("M58 30 q6 -4 10 2 M56 76 q6 -4 12 2") + ellipse(44, 98, 8, 5, C.grey) + ellipse(96, 84, 9, 6, C.grey),
  glacier:
    rect(4, 8, 112, 104, C.sky, 10) + poly("4,86 30,34 54,64 80,26 116,86", "#8a95a8") + path("M18 110 L40 48 L72 40 L112 100 V110Z", "#dff3ff") + stroke("M50 56 L60 80 L54 104 M76 52 L84 78", C.water, 2.5) + poly("38,36 30,34 26,46", C.white),
  iceberg:
    rect(4, 8, 112, 104, C.sky, 10) + rect(4, 70, 112, 40, C.water, 8) + poly("34,72 52,24 70,40 90,72", C.white) + poly("34,72 90,72 80,98 44,96", "#bfe3ff") + waves("M10 78 q10 -5 20 0 M80 78 q10 -5 24 0"),
  bush:
    union(C.green, uc(34, 70, 22), uc(60, 58, 26), uc(88, 70, 22), ue(60, 82, 38, 18)) + [[40, 66], [62, 52], [82, 70], [58, 80]].map(([x, y]) => dot(x, y, 4, C.red)).join("") + rect(4, 100, 112, 10, C.leaf, 4),
};

function blobLand() {
  return path("M34 40 Q44 28 58 36 Q50 48 54 58 Q42 66 38 54Z", C.green) + path("M66 62 Q82 56 92 66 Q94 82 78 92 Q70 80 66 62Z", C.green) + path("M28 74 Q38 70 42 80 Q36 90 28 84Z", C.green);
}
