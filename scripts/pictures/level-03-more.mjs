// Hình bổ sung cho cấp 3: các từ cụ thể còn lại (thời tiết, người, địa điểm, đồ dùng). Được level-03.mjs gộp vào.
import { C, LINE, circle, ellipse, rect, path, poly, blob, stroke, shine, thick, g, eye, cloud, star, rays, face } from "./lib.mjs";

const rayCircle = (cx, cy, r, fill = C.yellow) => rays(cx, cy, r + 6, r + 16, 8) + circle(cx, cy, r, fill);
const window4 = (x, y, w, h, fill = C.sky) => rect(x, y, w, h, fill, 3);
const waves = (d) => stroke(d, "#fff", 4).replace("/>", ' opacity=".8"/>');
const wearing = (hat) => face() + hat;
const gi = (belt) =>
  path("M12 32 L40 18 L60 42 L80 18 L108 32 L100 72 L84 66 V108 H36 V66 L20 72Z", C.white) + stroke("M60 42 V66", LINE, 2.5) + rect(34, 78, 52, 11, belt, 3);

export const more = {
  sunny: rayCircle(60, 60, 24) + rect(36, 50, 20, 14, LINE, 6) + rect(64, 50, 20, 14, LINE, 6) + stroke("M56 56 H64", LINE, 3) + stroke("M50 72 q10 9 20 0"),
  cloudy: cloud(46, 54, 1.2, "#eef3fa") + cloud(78, 74, 1.1, "#cfd8e6"),
  rainy:
    stroke("M60 14 V88 q0 14 -14 12", LINE, 8) + stroke("M60 14 V88 q0 14 -14 12", C.grey, 3.5) +
    path("M8 62 Q10 14 60 12 Q110 14 112 62 Q98 54 86 62 Q73 54 60 62 Q47 54 34 62 Q22 54 8 62Z", C.blue) +
    [[20, 84], [96, 80], [80, 102], [30, 102]].map(([x, y]) => path(`M${x} ${y - 8} q6 8 0 12 q-6 -4 0 -12Z`, C.water)).join(""),
  snowy:
    rect(28, 58, 64, 46, "#ff9a7a", 4) + poly("20,60 60,26 100,60", C.brown) + path("M26 56 Q44 40 60 32 Q76 40 94 56 Q80 50 60 44 Q40 50 26 56Z", C.white) +
    rect(52, 76, 16, 28, C.ink, 3) + window4(34, 68, 12, 12, C.yellow) + window4(74, 68, 12, 12, C.yellow) + ellipse(60, 108, 54, 7, C.white) +
    [[12, 30], [104, 24], [96, 84], [14, 84]].map(([x, y]) => stroke(`M${x - 5} ${y} h10 M${x} ${y - 5} v10 M${x - 3.5} ${y - 3.5} l7 7 M${x - 3.5} ${y + 3.5} l7 -7`, "#7ad0ff", 2.5)).join(""),
  windy:
    thick("M32 108 V14", C.dark, 4) + path("M34 16 Q58 4 80 18 T112 18 V54 Q90 66 70 52 T34 54Z", C.coral) + stroke("M8 70 H28 M10 86 H40 M6 100 H22", "#7ad0ff", 5),
  underground:
    path("M8 108 V58 Q8 12 60 12 Q112 12 112 58 V108Z", C.ink) + rect(32, 42, 56, 58, C.coral, 10) + rect(38, 48, 44, 22, C.sky, 5) + circle(44, 86, 5, C.yellow) + circle(76, 86, 5, C.yellow) + stroke("M20 108 H100", C.grey, 3.5),
  ferry:
    path("M6 74 H114 L104 100 H16Z", C.deepBlue) + rect(18, 56, 84, 20, C.white, 4) + [28, 44, 60, 76, 90].map((x) => circle(x, 66, 4, C.sky)).join("") +
    rect(80, 32, 14, 24, C.coral, 3) + rect(30, 42, 36, 16, C.yellow, 3) + waves("M8 110 q10 -6 20 0 t20 0 t20 0 t20 0 t20 0"),
  station:
    rect(12, 40, 96, 62, "#fff6d6", 4) + poly("8,42 60,16 112,42", C.coral) + circle(60, 34, 11, C.white) + stroke("M60 34 V27 M60 34 L66 37", LINE, 2.5) +
    path("M46 102 V74 Q46 62 60 62 Q74 62 74 74 V102Z", C.ink) + window4(20, 56, 18, 18) + window4(82, 56, 18, 18) + rect(0, 102, 120, 8, C.grey, 2),
  airport:
    rect(18, 48, 18, 58, C.grey, 3) + poly("10,28 44,28 38,48 16,48", C.sky) + rect(14, 22, 34, 8, C.coral, 3) +
    g("rotate(-12 80 40)", ellipse(80, 38, 30, 9, C.white) + poly("68,38 54,12 70,12 86,36", C.coral) + poly("68,40 54,66 70,66 86,42", C.coral) + poly("104,36 112,22 116,22 112,38", C.coral)) +
    rect(0, 102, 120, 12, C.dark, 2) + stroke("M12 108 H30 M48 108 H66 M84 108 H102", C.white, 3),
  tourist:
    wearing(ellipse(60, 40, 46, 10, "#f3d27a") + path("M34 40 Q34 12 60 12 Q86 12 86 40Z", "#f3d27a") + stroke("M36 34 H84", C.red, 4)) + rect(40, 98, 40, 18, C.dark, 5) + circle(60, 107, 6, C.grey),
  driver:
    thick("M40 100 a20 20 0 1 0 40 0 a20 20 0 1 0 -40 0", C.dark, 6) + wearing(path("M24 46 Q60 6 96 46 Q60 36 24 46Z", C.deepBlue) + rect(26, 42, 40, 8, C.ink, 4)),
  pilot:
    wearing(path("M24 48 Q24 12 60 12 Q96 12 96 48Z", C.navy) + rect(22, 44, 76, 9, C.ink, 4) + star(60, 30, 9, C.yellow)) + path("M20 118 Q24 100 40 98 H80 Q96 100 100 118Z", C.red),
  captain:
    wearing(path("M24 50 Q60 -2 96 50Z", C.white) + rect(22, 46, 76, 10, C.navy, 4) + circle(60, 32, 8, C.gold)) + path("M16 118 Q24 100 40 98 H80 Q96 100 104 118Z", C.navy) + circle(60, 108, 4, C.gold),
  sailor:
    wearing(ellipse(60, 36, 36, 16, C.white) + stroke("M26 42 H94", C.navy, 4) + circle(60, 22, 5, C.red)) + path("M16 118 L42 96 L60 110 L78 96 L104 118Z", C.navy) + stroke("M30 112 L44 100 M90 112 L76 100", C.white, 3),
  street:
    rect(6, 38, 28, 68, C.coral, 3) + rect(36, 22, 30, 84, C.yellow, 3) + rect(68, 46, 26, 60, C.pink, 3) +
    [[12, 46], [12, 66], [42, 32], [42, 54], [42, 76], [74, 54], [74, 76]].map(([x, y]) => window4(x, y, 14, 12)).join("") + thick("M106 108 V44", C.dark, 4) + circle(106, 38, 9, C.yellow) + rect(0, 106, 120, 10, C.grey, 2),
  restaurant:
    rect(14, 50, 92, 58, "#fff6d6", 4) + [0, 1, 2, 3, 4, 5].map((i) => rect(14 + i * 15.3, 28, 15.3, 24, i % 2 ? C.white : C.red, 2)).join("") +
    window4(22, 62, 30, 28) + rect(68, 62, 24, 46, C.brown, 3) + circle(60, 16, 11, C.sky) + stroke("M55 11 v10 M65 11 v10", LINE, 2.5),
  band:
    rect(14, 56, 62, 44, C.coral, 6) + ellipse(45, 56, 31, 9, C.white) + stroke("M20 66 L34 100 L48 66 L62 100 L74 66", C.white, 3) + thick("M62 12 L36 54", C.tan, 5) + thick("M84 14 L54 54", C.tan, 5) +
    ellipse(96, 88, 12, 8, C.purple) + stroke("M108 88 V50 L112 46", LINE, 4),
  singer: circle(60, 34, 24, C.grey) + stroke("M42 26 H78 M38 36 H82 M42 46 H78 M50 14 V54 M70 14 V54", C.dark, 2.5) + thick("M60 58 V102", C.dark, 12) + rect(48, 100, 24, 10, C.dark, 4) + rect(52, 56, 16, 8, C.ink, 3),
  concert:
    path("M8 12 H44 Q36 56 8 100Z", C.red) + path("M112 12 H76 Q84 56 112 100Z", C.red) + blob("M60 10 L36 100 H84Z", "#fff3a8").replace("/>", ' opacity=".7"/>') + rect(8, 96, 104, 14, C.brown, 4) + star(60, 66, 14, C.yellow) + circle(60, 8, 6, C.grey),
  cartoon:
    stroke("M44 24 L28 4 M76 24 L92 4", LINE, 4) + rect(10, 26, 100, 72, C.brown, 12) + rect(20, 36, 66, 52, C.sky, 6) + circle(53, 62, 18, C.yellow) + eye(47, 58, 3.5) + eye(59, 58, 3.5) +
    stroke("M46 68 q7 7 14 0") + circle(98, 50, 6, C.grey) + circle(98, 70, 6, C.grey) + stroke("M30 98 V108 M90 98 V108", LINE, 5),
  snack:
    path("M24 16 L30 22 L36 16 L42 22 L48 16 L54 22 L60 16 L66 22 L72 16 L78 22 L84 16 L90 22 L96 16 L92 104 H28Z", C.coral) + star(60, 62, 18, C.yellow) + stroke("M34 94 H86", "#ffc2b0", 4),
  meal:
    rect(6, 78, 108, 26, C.grey, 8) + ellipse(40, 78, 28, 9, C.white) + path("M16 76 Q40 56 64 76Z", C.leaf) + circle(30, 68, 7, C.red) + rect(78, 52, 24, 28, C.sky, 4) + stroke("M96 52 L102 34", C.coral, 4) + stroke("M78 62 H102", C.water, 3),
  judo: gi(C.ink),
  karate: gi(C.red) + stroke("M24 40 L36 62 M96 40 L84 62", "#dfe6ee", 2.5),
  player:
    wearing(path("M28 48 Q60 14 92 48 Q60 38 28 48Z", C.brown)) + path("M14 118 Q18 98 42 94 H78 Q102 98 106 118Z", C.blue) + stroke("M42 100 V118 M60 100 V118 M78 100 V118", C.white, 4) +
    circle(100, 102, 13, C.white) + poly("100,96 105,100 103,106 97,106 95,100", LINE),
  coach: circle(44, 72, 28, C.grey) + rect(64, 50, 46, 24, C.grey, 8) + circle(44, 72, 9, C.ink) + stroke("M72 56 V68", LINE, 2.5) + stroke("M32 48 Q24 16 58 10", C.red, 4),
  court: rect(10, 20, 100, 80, C.deepBlue, 6) + stroke("M20 30 H100 V90 H20Z M20 44 H100 M20 76 H100 M60 44 V76", C.white, 3) + thick("M10 60 H110", C.dark, 3),
};
