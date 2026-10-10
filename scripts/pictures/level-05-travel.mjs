// Cấp 5: chủ đề Du lịch (travel). Từ trừu tượng (arrive, delay, visa, fare, tourism…) không có hình, xem decisions.md.
import { C, LINE, circle, rect, path, poly, dot, stroke, shine, thick, g, cloud, star, rayCircle, window4, waves, wheel, torso, face, tree } from "./lib.mjs";

const planeBody = path("M8 60 L70 48 L112 56 L70 68Z", C.white) + path("M60 50 L48 14 H66 L84 52Z", C.blue) + path("M60 66 L48 104 H66 L84 66Z", C.blue) + path("M104 56 L114 40 H118 L112 58Z", C.blue) + [30, 46, 62].map((x) => circle(x, 58, 3.5, C.sky)).join("");
const plane = (x, y, s) => g(`translate(${x} ${y}) scale(${s})`, planeBody);
const hair = path("M28 56 Q28 20 60 20 Q92 20 92 56 Q80 40 60 40 Q40 40 28 56Z", C.dark);
const sunHat = path("M24 46 Q60 6 96 46Z", C.yellow) + rect(10, 42, 100, 10, C.gold, 5);
const barcode = (x, y, h) => [0, 5, 9, 15, 19, 25, 29].map((dx) => stroke(`M${x + dx} ${y} V${y + h}`, LINE, dx % 2 ? 2 : 3.5)).join("");

export const travel = {
  luggage:
    rect(58, 34, 52, 70, C.deepBlue, 8) + stroke("M72 34 V26 Q72 20 78 20 H90 Q96 20 96 26 V34", LINE, 4) + rect(58, 52, 52, 6, "#7ab0ff", 2) + circle(70, 108, 5, C.ink) + circle(98, 108, 5, C.ink) +
    stroke("M28 56 V48 Q28 42 34 42 H46 Q52 42 52 48 V56", LINE, 4) + rect(8, 56, 64, 48, C.coral, 8) + rect(8, 72, 64, 6, "#ffb199", 2) + rect(34, 82, 12, 10, C.yellow, 3) + circle(20, 108, 5, C.ink) + circle(60, 108, 5, C.ink),
  flight:
    rect(4, 10, 112, 100, C.sky, 10) + cloud(30, 34, 0.6) + cloud(92, 96, 0.55) + [[14, 100], [26, 92], [38, 84], [50, 76]].map(([x, y]) => dot(x, y, 3, C.white)).join("") + plane(40, 14, 0.68),
  runway:
    rect(4, 8, 112, 104, C.leaf, 8) + poly("38,10 82,10 110,108 10,108", C.dark) + [[58, 16, 8], [57, 34, 10], [55, 56, 14], [53, 84, 18]].map(([x, y, h]) => rect(x, y, 10 + (y - 16) / 12, h, C.white, 1)).join("") + [[34, 20], [24, 56], [14, 92], [86, 20], [96, 56], [106, 92]].map(([x, y]) => dot(x, y, 3.5, C.yellow)).join("") + plane(30, 52, 0.55),
  guide:
    torso(C.yellow) + face() + hair + path("M26 48 Q26 14 60 14 Q94 14 94 48Z", C.green) + rect(22, 44, 76, 8, C.ink, 4) + thick("M106 108 V20", C.brown, 4) + poly("106,18 118,26 106,36", C.red),
  guidebook:
    rect(20, 12, 80, 98, C.green, 6) + rect(20, 12, 12, 98, "#2f7a2a", 4) + path("M62 28 Q46 28 46 46 Q46 58 62 76 Q78 58 78 46 Q78 28 62 28Z", C.red) + circle(62, 46, 7, C.white) + rect(42, 88, 44, 8, C.yellow, 3),
  souvenir:
    rect(30, 82, 60, 24, C.brown, 8) + circle(60, 50, 36, C.sky) + poly("60,18 68,70 52,70", C.red) + stroke("M54 44 H66 M52 56 H68", C.white, 3) + [[40, 40], [78, 36], [44, 62], [76, 60], [60, 78]].map(([x, y]) => dot(x, y, 2.5, C.white)).join("") + shine("M38 38 q4 -10 14 -12"),
  postcard:
    rect(10, 26, 100, 70, C.cream, 6) + rect(16, 34, 50, 28, C.sky, 3) + poly("20,60 36,42 52,60", C.green) + circle(54, 42, 5, C.yellow) + rect(84, 32, 20, 24, C.coral, 2) + star(94, 44, 6, C.yellow) + stroke("M18 72 H66 M18 84 H52 M76 72 H100 M76 84 H100", LINE, 2.5),
  destination:
    rect(8, 50, 104, 58, C.cream, 6) + stroke("M43 50 V108 M77 50 V108", LINE, 2) + [[22, 92], [34, 84], [46, 80], [58, 74], [66, 62]].map(([x, y]) => dot(x, y, 3, C.blue)).join("") + circle(18, 98, 5, C.blue) +
    path("M82 10 Q64 10 64 30 Q64 44 82 64 Q100 44 100 30 Q100 10 82 10Z", C.red) + circle(82, 30, 8, C.white),
  platform:
    rect(8, 28, 104, 56, C.deepBlue, 6) + rect(8, 28, 104, 10, C.navy, 4) + [16, 40, 64].map((x) => window4(x, 44, 20, 22)).join("") + rect(88, 44, 18, 40, C.sky, 3) + rect(4, 84, 112, 26, C.grey, 4) + rect(4, 84, 112, 6, C.yellow, 2) + wheel(30, 90, 6) + wheel(80, 90, 6),
  carriage:
    rect(8, 26, 104, 60, C.red, 8) + rect(8, 26, 104, 10, "#c0392b", 4) + [14, 38, 62].map((x) => window4(x, 42, 20, 22)).join("") + rect(88, 42, 18, 44, C.white, 3) + stroke("M97 42 V86", LINE, 2.5) + stroke("M8 74 H112", LINE, 3) + wheel(30, 94, 9) + wheel(90, 94, 9) + stroke("M2 86 H8 M112 86 H118", LINE, 4),
  cruise:
    rayCircle(100, 20, 8) + rect(52, 12, 16, 22, C.coral, 3) + rect(34, 32, 52, 18, C.white, 4) + rect(22, 48, 76, 22, C.white, 4) + [0, 1, 2, 3, 4, 5].map((i) => circle(32 + i * 11, 59, 3.5, C.sky)).join("") + [42, 56, 70].map((x) => circle(x, 41, 3, C.sky)).join("") + path("M6 70 H114 L98 94 H22Z", C.deepBlue) + rect(14, 74, 92, 5, C.red, 2) + waves("M6 104 q10 -6 20 0 t20 0 t20 0 t20 0 t20 0 t10 0"),
  harbour:
    rect(4, 62, 112, 48, C.water, 8) + poly("36,14 36,56 12,56", C.white) + poly("42,22 42,56 64,56", C.coral) + stroke("M39 10 V60", LINE, 3) + path("M8 58 H70 L60 76 H18Z", C.brown) + rect(84, 52, 32, 10, C.tan, 2) + stroke("M90 62 V84 M110 62 V84", LINE, 5) + path("M86 52 V40 Q86 34 92 34 H106 Q112 34 112 40 V52", C.cream) + waves("M10 90 q10 -6 20 0 t20 0 t20 0 t20 0"),
  port:
    rect(4, 90, 112, 20, C.grey, 4) + rect(8, 74, 30, 16, C.red, 2) + rect(38, 74, 30, 16, C.blue, 2) + rect(18, 58, 30, 16, C.yellow, 2) + thick("M102 90 V22 H66", C.orange, 7) + stroke("M72 24 V44", LINE, 3) + rect(60, 44, 26, 12, C.green, 2) + stroke("M72 56 V60", LINE, 3) + waves("M70 100 q8 -5 16 0 t16 0"),
  cabin:
    rect(8, 10, 104, 100, C.cream, 8) + circle(82, 38, 17, C.grey) + circle(82, 38, 11, C.sky) + waves("M74 40 q4 -4 8 0 t8 0") + stroke("M16 50 V102 M70 50 V102", LINE, 4) + rect(16, 54, 54, 10, C.blue, 3) + rect(16, 82, 54, 10, C.blue, 3) + rect(18, 48, 14, 8, C.white, 3) + rect(18, 76, 14, 8, C.white, 3) + rect(78, 80, 28, 22, C.brown, 4),
  deck:
    rect(4, 8, 112, 54, C.sky, 8) + rect(4, 54, 112, 18, C.water, 4) + waves("M10 62 q10 -6 20 0 t20 0 t20 0 t20 0") + rect(4, 76, 112, 34, C.tan, 4) + stroke("M4 92 H116", LINE, 2.5) + stroke("M6 70 H114", LINE, 4) + [14, 38, 62, 86, 108].map((x) => stroke(`M${x} 70 V76`, LINE, 4)).join("") + circle(30, 90, 13, C.red) + circle(30, 90, 6, C.cream) + path("M64 78 L92 78 L100 104 L72 104Z", C.deepBlue),
  traveller:
    rect(2, 68, 28, 46, C.orange, 8) + torso(C.green) + stroke("M36 96 V118 M84 96 V118", C.orange, 5) + face() + hair + sunHat,
  backpack:
    stroke("M48 22 V14 Q48 8 54 8 H66 Q72 8 72 14 V22", LINE, 4) + rect(24, 20, 72, 90, C.coral, 20) + rect(36, 66, 48, 34, "#ff9f80", 8) + stroke("M42 76 H78", LINE, 3) + rect(54, 80, 12, 8, C.yellow, 2) + path("M30 36 Q60 52 90 36", "none") + rect(24, 20, 72, 14, "#e5603f", 8),
  hostel:
    rect(14, 44, 92, 64, C.tan, 4) + poly("8,46 60,22 112,46", C.brown) + rect(46, 6, 28, 20, C.deepBlue, 4) + rect(52, 14, 16, 5, C.white, 2) + stroke("M52 12 V22 M68 12 V22", C.white, 2.5) + [24, 46, 80].map((x) => window4(x, 58, 14, 14)).join("") + rect(50, 78, 20, 30, C.ink, 3),
  resort:
    rayCircle(24, 24, 9) + rect(4, 78, 112, 32, C.water, 8) + waves("M12 92 q10 -6 20 0 t20 0 t20 0 t20 0") + thick("M92 90 Q86 56 96 28", C.brown, 6) + path("M96 28 Q76 14 56 30 Q78 24 96 28Z", C.green) + path("M96 28 Q112 12 118 32 Q108 24 96 28Z", C.green) + path("M96 28 Q80 36 74 52 Q86 40 96 28Z", C.green) + stroke("M32 76 V100", LINE, 4) + path("M12 76 Q32 46 52 76Z", C.red) + stroke("M32 54 V76 M22 62 V76 M42 62 V76", LINE, 2),
  view:
    rect(8, 8, 104, 104, C.brown, 8) + rect(16, 16, 88, 88, C.sky, 4) + circle(34, 38, 9, C.yellow) + poly("16,104 44,58 72,104", C.green) + poly("50,104 82,50 104,100 104,104", "#3d9a35") + cloud(78, 32, 0.5) + stroke("M60 16 V104 M16 60 H104", C.brown, 5),
  scenery:
    rect(6, 10, 108, 100, C.sky, 10) + circle(92, 30, 10, C.yellow) + poly("6,84 38,36 70,84", C.grey) + poly("28,52 38,36 48,52 42,48 38,52 34,48", C.white) + poly("50,84 84,46 114,84", C.dark) + path("M6 84 Q40 74 70 86 Q96 76 114 86 V104 Q114 110 108 110 H12 Q6 110 6 104Z", C.leaf) + path("M30 100 Q60 90 90 100 Q60 108 30 100Z", C.water) + tree(20, 74, 0.5) + tree(100, 74, 0.5),
  landmark:
    rect(40, 34, 40, 70, C.bread, 3) + poly("36,36 60,10 84,36", C.brown) + circle(60, 56, 13, C.white) + stroke("M60 48 V57 L67 61", LINE, 3) + rect(30, 100, 60, 10, C.grey, 3) + stroke("M60 10 V2", LINE, 3) + star(98, 26, 7, C.yellow) + star(22, 40, 5, C.yellow),
  monument:
    poly("52,14 68,14 74,96 46,96", C.grey) + poly("52,14 60,2 68,14", C.gold) + rect(32, 96, 56, 10, C.dark, 3) + rect(24, 106, 72, 8, C.grey, 3) + stroke("M56 34 V84", C.white, 3) + star(60, 60, 7, C.yellow),
  "boarding pass":
    rect(10, 26, 100, 68, C.white, 8) + path("M10 34 Q10 26 18 26 H102 Q110 26 110 34 V46 H10Z", C.deepBlue) + plane(18, 28, 0.2) + stroke("M72 46 V94", LINE, 2) + barcode(18, 58, 28) + stroke("M80 60 H102 M80 72 H102 M80 84 H96", LINE, 2.5),
  "seat belt":
    rect(4, 50, 44, 22, C.navy, 4) + rect(72, 50, 44, 22, C.navy, 4) + stroke("M12 61 H40 M80 61 H108", C.grey, 2.5) + rect(44, 40, 36, 42, C.grey, 8) + rect(54, 50, 16, 8, C.dark, 3) + circle(62, 70, 6, C.red),
  passenger:
    rect(66, 6, 40, 52, C.white, 16) + rect(72, 12, 28, 40, C.sky, 12) + cloud(86, 36, 0.35) + torso(C.coral) + stroke("M42 96 L78 118 M78 96 L42 118", C.navy, 5) + face() + hair,
};
