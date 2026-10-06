// Cấp 4: địa điểm trong thành phố, biển chỉ đường.
import { C, LINE, circle, ellipse, rect, path, poly, blob, dot, stroke, shine, thick, g, eye, union, uc, ue, ur, cloud, star, rayCircle, window4, waves, wheel, pine, tree, cross } from "./lib.mjs";

const windows = (xs, ys, w = 12, h = 12) => xs.flatMap((x) => ys.map((y) => window4(x, y, w, h))).join("");
const sign = (body, arrow) => rect(14, 14, 92, 92, C.deepBlue, 14) + arrow;
const arrow = (d) => thick(d, C.white, 10);

export const places = {
  city: rect(8, 56, 22, 52, C.coral, 3) + rect(34, 28, 28, 80, C.deepBlue, 3) + rect(66, 44, 24, 64, C.yellow, 3) + rect(94, 64, 18, 44, C.pink, 3) + windows([13, 40, 72, 99], [66, 82]) + windows([40, 50], [36, 52, 68, 84], 10, 10) + stroke("M2 108 H118", LINE, 3.5) + star(98, 22, 7, C.yellow),
  building: rect(30, 14, 60, 94, C.deepBlue, 4) + windows([38, 56, 74], [24, 44, 64], 12, 14) + rect(50, 86, 20, 22, C.ink, 3) + stroke("M24 108 H96", LINE, 3.5),
  bank: poly("10,46 60,16 110,46", C.coral) + rect(14, 46, 92, 10, C.white, 2) + [24, 44, 64, 84].map((x) => rect(x, 56, 12, 42, C.white, 2)).join("") + rect(8, 98, 104, 12, C.grey, 3) + circle(60, 36, 8, C.yellow),
  library: rect(14, 38, 92, 70, C.bread, 4) + poly("8,40 60,12 112,40", C.brown) + rect(46, 74, 28, 34, C.ink, 3) + rect(22, 54, 16, 18, "#7a4b2a", 2) + rect(80, 54, 16, 18, "#7a4b2a", 2) + rect(24, 58, 5, 12, C.red, 1) + rect(31, 58, 5, 12, C.blue, 1) + rect(82, 58, 5, 12, C.green, 1) + rect(89, 58, 5, 12, C.yellow, 1),
  museum: poly("8,44 60,14 112,44", C.cream) + rect(14, 44, 92, 10, C.grey, 2) + [26, 46, 66, 86].map((x) => rect(x, 54, 10, 44, C.white, 2)).join("") + rect(8, 98, 104, 12, C.grey, 3) + circle(60, 32, 5, C.coral),
  cinema: rect(10, 40, 100, 66, C.ink, 6) + rect(10, 28, 100, 16, C.red, 4) + [0, 1, 2, 3, 4].map((i) => circle(22 + i * 19, 36, 3.5, C.yellow)).join("") + rect(42, 62, 36, 44, C.deepBlue, 3) + star(60, 80, 10, C.yellow) + circle(26, 70, 9, C.white) + circle(94, 70, 9, C.white),
  theatre: path("M8 14 H52 Q44 60 8 104Z", C.red) + path("M112 14 H68 Q76 60 112 104Z", C.red) + rect(8, 98, 104, 12, C.brown, 4) + circle(48, 62, 14, C.yellow) + circle(72, 62, 14, C.pink) + stroke("M42 62 q6 6 12 0 M66 66 q6 -6 12 0", LINE, 2.5) + dot(43, 56, 2, LINE) + dot(53, 56, 2, LINE) + dot(67, 56, 2, LINE) + dot(77, 56, 2, LINE),
  hospital: rect(14, 30, 92, 78, C.white, 6) + rect(14, 30, 92, 12, C.coral, 6) + cross(60, 62, 8, C.red) + windows([22, 84], [50, 78]) + rect(48, 84, 24, 24, C.sky, 3) + stroke("M60 84 V108", LINE, 2.5),
  "post office": rect(14, 40, 92, 68, C.coral, 4) + poly("8,42 60,14 112,42", C.dark) + rect(40, 64, 40, 44, C.ink, 3) + rect(46, 44, 28, 18, C.white, 3) + circle(24, 56, 7, C.yellow) + rect(86, 66, 12, 26, C.red, 3),
  "police station": rect(14, 36, 92, 72, C.deepBlue, 4) + rect(10, 28, 100, 12, C.navy, 3) + circle(26, 18, 8, C.red) + circle(94, 18, 8, C.blue) + path("M60 44 L72 50 V62 Q72 72 60 78 Q48 72 48 62 V50Z", C.yellow) + star(60, 61, 7, C.white) + rect(48, 84, 24, 24, C.ink, 3),
  supermarket: rect(10, 44, 100, 64, C.white, 4) + [0, 1, 2, 3, 4, 5].map((i) => rect(10 + i * 16.7, 22, 16.7, 26, i % 2 ? C.white : C.green, 2)).join("") + rect(46, 70, 28, 38, C.sky, 3) + stroke("M18 62 h6 l4 12 h12 l3 -9 h-17 M30 84 a2 2 0 1 0 0.1 0 M40 84 a2 2 0 1 0 0.1 0", LINE, 2.5),
  market: [0, 1, 2, 3, 4].map((i) => rect(10 + i * 20, 24, 20, 24, i % 2 ? C.white : C.coral, 2)).join("") + rect(14, 48, 92, 12, C.bread, 3) + rect(14, 60, 92, 44, C.tan, 4) + circle(34, 52, 9, C.red) + circle(52, 52, 9, C.orange) + circle(70, 52, 9, C.lime) + circle(88, 52, 9, C.yellow) + stroke("M26 76 H94 M26 90 H94", C.brown, 2.5),
  shop: rect(14, 48, 92, 60, "#fff6d6", 4) + [0, 1, 2, 3, 4, 5].map((i) => rect(14 + i * 15.3, 28, 15.3, 24, i % 2 ? C.white : C.blue, 2)).join("") + window4(22, 62, 34, 30) + rect(68, 62, 24, 46, C.brown, 3) + circle(86, 86, 2.5, C.yellow),
  bakery: rect(14, 48, 92, 60, C.cream, 4) + [0, 1, 2, 3, 4, 5].map((i) => rect(14 + i * 15.3, 28, 15.3, 24, i % 2 ? C.white : C.coral, 2)).join("") + window4(22, 62, 34, 30, C.sky) + g("rotate(-20 38 78)", ellipse(38, 78, 12, 7, C.bread)) + rect(68, 62, 24, 46, C.brown, 3) + ellipse(60, 18, 12, 7, C.bread),
  pharmacy: rect(14, 34, 92, 74, C.white, 6) + rect(14, 34, 92, 10, C.green, 6) + cross(60, 66, 9, C.green) + windows([22, 84], [52, 80]) + rect(48, 86, 24, 22, C.sky, 3),
  church: rect(34, 46, 52, 62, C.cream, 3) + poly("30,48 60,20 90,48", C.brown) + rect(52, 8, 16, 14, C.cream, 2) + stroke("M60 -2 V16 M54 6 H66", LINE, 3.5) + path("M50 108 V82 Q50 70 60 70 Q70 70 70 82 V108Z", C.ink) + windows([38, 74], [56], 8, 12),
  temple: poly("8,50 60,26 112,50", C.red) + rect(10, 48, 100, 8, C.gold, 2) + poly("22,32 60,12 98,32", C.red) + rect(24, 56, 72, 48, C.cream, 3) + rect(50, 70, 20, 34, C.ink, 3) + rect(14, 104, 92, 8, C.grey, 3),
  park: pine(24, 52, 0.8) + tree(94, 52, 0.9) + rect(6, 98, 108, 12, C.leaf, 4) + rect(36, 80, 48, 6, C.brown, 2) + stroke("M42 86 V98 M78 86 V98", LINE, 4) + stroke("M36 70 H84", LINE, 4),
  zoo: rect(10, 50, 12, 58, C.brown, 3) + rect(98, 50, 12, 58, C.brown, 3) + path("M10 54 Q60 8 110 54 V66 Q60 24 10 66Z", C.green) + stroke("M30 80 V108 M42 80 V108 M54 80 V108 M66 80 V108 M78 80 V108 M90 80 V108", LINE, 3) + circle(60, 40, 12, C.yellow) + eye(55, 38, 2.5) + eye(65, 38, 2.5),
  playground: stroke("M10 108 H110", LINE, 3.5) + thick("M22 18 V104 M64 18 V104 M22 18 H64", C.deepBlue, 6) + stroke("M34 18 V70 M52 18 V70", LINE, 2.5) + rect(28, 70, 30, 8, C.yellow, 3) + path("M76 28 H90 L112 104 H80Z", C.coral) + thick("M76 28 V104", C.dark, 5),
  stadium: ellipse(60, 60, 50, 40, C.grey) + ellipse(60, 60, 34, 24, C.leaf) + stroke("M60 36 V84 M26 60 H94", C.white, 2.5) + ellipse(60, 60, 12, 8, "none"),
  square: ellipse(60, 92, 52, 14, C.bread) + ellipse(60, 80, 24, 10, C.grey) + rect(54, 40, 12, 40, C.grey, 3) + path("M42 48 Q60 12 78 48 Q60 40 42 48Z", C.water) + stroke("M48 40 q-6 14 -2 30 M72 40 q6 14 2 30", C.sky, 3) + stroke("M16 100 H104", LINE, 3),
  traffic: rect(8, 74, 50, 24, C.coral, 8) + path("M16 74 L24 54 H44 L52 74Z", C.sky) + wheel(24, 100, 8) + wheel(46, 100, 8) + rect(64, 80, 48, 20, C.deepBlue, 8) + path("M72 80 L78 64 H98 L106 80Z", C.sky) + wheel(78, 102, 8) + wheel(100, 102, 8) + stroke("M2 110 H118", LINE, 3.5),
  crossing: rect(4, 12, 112, 96, C.dark, 6) + [0, 1, 2, 3, 4].map((i) => rect(18 + i * 18, 14, 10, 92, C.white, 2)).join(""),
  corner: rect(6, 40, 50, 68, C.coral, 3) + windows([14, 36], [50, 70]) + path("M56 108 V78 Q56 66 70 66 H116 V108Z", C.dark) + stroke("M66 88 H104", C.white, 3) + thick("M92 66 V24", C.dark, 4) + circle(92, 20, 8, C.yellow),
  entrance: rect(26, 14, 68, 94, C.cream, 4) + rect(38, 28, 44, 80, C.ink, 3) + arrow("M6 62 H34 M24 50 L36 62 L24 74").replace(/stroke="#ffffff"/g, `stroke="${C.green}"`),
  exit: rect(26, 14, 68, 94, C.cream, 4) + rect(38, 28, 44, 80, C.ink, 3) + stroke("M62 62 H90 M80 50 L92 62 L80 74", LINE, 9) + stroke("M62 62 H90 M80 50 L92 62 L80 74", C.coral, 5),
  factory: rect(10, 54, 70, 54, C.coral, 3) + poly("10,54 28,36 28,54", C.coral) + poly("28,54 46,36 46,54", C.coral) + poly("46,54 64,36 64,54", C.coral) + rect(84, 22, 20, 86, C.grey, 3) + union(C.white, uc(94, 14, 10), uc(106, 8, 8), uc(84, 8, 8)) + windows([18, 38, 58], [68, 88], 14, 12),
  office: rect(22, 12, 76, 96, C.deepBlue, 4) + windows([30, 52, 74], [22, 42, 62], 14, 12) + rect(48, 84, 24, 24, C.sky, 3) + stroke("M16 108 H104", LINE, 3.5),
  apartment: rect(20, 12, 80, 96, C.pink, 4) + [0, 1, 2, 3].map((i) => rect(28, 22 + i * 22, 24, 14, C.sky, 2) + rect(68, 22 + i * 22, 24, 14, C.sky, 2) + stroke(`M26 ${40 + i * 22} H54 M66 ${40 + i * 22} H94`, LINE, 3)).join("") + rect(50, 92, 20, 16, C.ink, 3),
  tower: poly("46,108 52,40 68,40 74,108", C.grey) + rect(40, 24, 40, 20, C.coral, 4) + poly("44,24 60,6 76,24", C.red) + window4(54, 28, 12, 10) + stroke("M50 70 H70 M48 90 H72", LINE, 3) + stroke("M32 108 H88", LINE, 3.5),
  castle: rect(20, 48, 80, 60, C.grey, 3) + [20, 40, 60, 80].map((x) => rect(x, 38, 12, 14, C.grey, 2)).join("") + rect(6, 30, 26, 78, "#b5bcc8", 3) + poly("2,32 19,10 36,32", C.red) + rect(88, 30, 26, 78, "#b5bcc8", 3) + poly("84,32 101,10 118,32", C.red) + path("M48 108 V80 Q48 66 60 66 Q72 66 72 80 V108Z", C.ink) + window4(14, 48, 10, 14) + window4(96, 48, 10, 14) + stroke("M19 10 V0 M101 10 V0", LINE, 3),
  "fire station": rect(10, 36, 100, 72, C.red, 4) + rect(10, 28, 100, 12, "#c0392b", 3) + path("M20 108 V70 Q20 58 34 58 H50 Q60 58 60 70 V108Z", C.white) + path("M64 108 V70 Q64 58 78 58 H94 Q104 58 104 70 V108Z", C.white) + stroke("M26 76 H54 M26 90 H54 M70 76 H98 M70 90 H98", C.grey, 3) + circle(60, 18, 8, C.coral),
  "shopping centre": rect(10, 30, 100, 78, C.pink, 6) + rect(10, 22, 100, 14, C.purple, 4) + path("M44 74 h32 l-4 28 h-24Z", C.coral) + stroke("M52 74 q0 -12 8 -12 q8 0 8 12", LINE, 3.5) + windows([18, 84], [48, 74], 16, 14) + star(60, 14, 7, C.yellow),
  turn: sign(0, thick("M42 96 V60 Q42 40 62 40 H86 M74 28 L88 40 L74 52", C.white, 10)),
  "straight on": sign(0, thick("M60 96 V32 M44 46 L60 30 L76 46", C.white, 10)),
  left: sign(0, thick("M92 60 H32 M48 44 L30 60 L48 76", C.white, 10)),
  right: sign(0, thick("M28 60 H88 M72 44 L90 60 L72 76", C.white, 10)),
};
