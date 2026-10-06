// Cấp 4: động từ vẽ được bằng một hình rõ nghĩa (chủ đề "Chuyện đã qua"). Động từ khó vẽ (do, get, have, come, leave, make, take…) không có hình.
import { C, LINE, circle, ellipse, rect, path, poly, blob, dot, stroke, shine, thick, g, eye, cheek, union, uc, ue, ur, cloud, star, rays, face, heart, wheel } from "./lib.mjs";

const talk = (d) => stroke(d, C.deepBlue, 4);

export const verbs = {
  buy: path("M22 44 H78 L72 108 H28Z", C.coral) + stroke("M34 44 q0 -18 16 -18 q16 0 16 18", LINE, 3.5) + circle(88, 38, 18, C.gold) + circle(88, 38, 11, "#ffe58a") + star(88, 38, 7, C.gold),
  bring: path("M22 52 L60 40 L98 52 V100 L60 112 L22 100Z", C.tan) + path("M22 52 L60 64 L98 52 L60 40Z", "#e8b56a") + stroke("M60 64 V112", LINE, 3) + stroke("M4 70 H16 M2 84 H14 M6 98 H18", "#7ad0ff", 4),
  build: rect(10, 76, 100, 30, C.coral, 3) + stroke("M10 91 H110 M36 76 V91 M70 76 V91 M24 91 V106 M56 91 V106 M92 91 V106", LINE, 2.5) + rect(24, 52, 72, 24, C.coral, 3) + stroke("M60 52 V76", LINE, 2.5) + thick("M96 20 L70 56", C.brown, 6) + rect(84, 10, 28, 16, C.grey, 4),
  grow: path("M10 104 Q60 80 110 104 V112 H10Z", C.brown) + stroke("M60 98 V54", C.green, 6) + path("M60 74 Q30 70 26 46 Q56 46 60 74Z", C.leaf) + path("M60 62 Q92 58 96 34 Q66 34 60 62Z", C.leaf) + rays(60, 30, 14, 22, 6, C.gold, 3),
  choose: [[20, C.pink], [50, C.sky], [80, C.yellow]].map(([x, c], i) => rect(x, i === 1 ? 20 : 34, 28, 60, c, 6)).join("") + stroke("M54 56 L62 66 L76 44", C.green, 6) + thick("M70 112 L84 92", C.skin, 8) + circle(86, 88, 9, C.skin),
  cut: thick("M24 96 L82 30", C.grey, 8) + thick("M24 24 L82 90", C.grey, 8) + circle(22, 100, 12, "none").replace('stroke-width="3"', 'stroke-width="6"').replace(LINE, C.coral) + circle(22, 20, 12, "none").replace('stroke-width="3"', 'stroke-width="6"').replace(LINE, C.coral) + circle(58, 60, 4, LINE),
  drive: circle(60, 62, 44, C.dark) + circle(60, 62, 30, C.white).replace('fill="#ffffff"', 'fill="#fff7e8"') + circle(60, 62, 10, C.dark) + thick("M60 62 V34 M60 62 L36 76 M60 62 L84 76", C.dark, 8) + circle(60, 62, 5, C.grey),
  fall: path("M60 16 C30 20 18 52 38 84 C70 90 100 60 60 16Z", C.orange) + stroke("M60 16 L48 76", "#c0651f", 3) + stroke("M70 92 q10 8 22 4 M82 104 q8 4 16 0", "#7ad0ff", 4) + stroke("M96 28 q-12 8 -6 24", C.grey, 3),
  feel: heart(60, 56, 3.2, C.red) + eye(48, 50, 4) + eye(72, 50, 4) + stroke("M50 62 q10 10 20 0") + thick("M20 106 Q40 94 52 96", C.skin, 8),
  find: circle(50, 50, 32, "#e6f6ff") + star(50, 50, 18, C.yellow) + thick("M74 74 L106 106", C.brown, 10) + shine("M30 36 q6 -10 16 -10"),
  give: rect(30, 24, 60, 44, C.purple, 6) + rect(24, 14, 72, 14, "#b98af0", 4) + rect(54, 14, 12, 54, C.yellow, 2) + path("M10 88 Q40 70 70 76 L112 82 Q116 92 106 96 L70 100 Q40 108 10 104Z", C.skin),
  hear: path("M44 20 Q72 12 80 42 Q82 62 66 74 Q62 88 52 96 Q40 100 40 86", C.skin) + stroke("M92 40 q10 12 0 26 M102 32 q16 20 0 42", C.deepBlue, 4),
  keep: rect(16, 48, 88, 58, C.brown, 8) + path("M16 52 Q16 26 60 26 Q104 26 104 52Z", C.tan) + circle(60, 70, 12, C.gold) + stroke("M60 66 V76", LINE, 4) + thick("M104 30 L112 18", C.gold, 5),
  meet: circle(30, 54, 20, C.skin) + circle(90, 54, 20, C.skin) + eye(24, 50, 3) + eye(36, 50, 3) + eye(84, 50, 3) + eye(96, 50, 3) + stroke("M24 62 q6 5 12 0 M84 62 q6 5 12 0") + path("M30 100 Q30 76 30 76 Q22 80 18 110 H44Z", C.coral) + path("M90 100 Q90 76 90 76 Q98 80 102 110 H76Z", C.deepBlue) + ellipse(60, 92, 20, 12, C.skin),
  pay: rect(10, 28, 68, 48, C.deepBlue, 8) + rect(10, 40, 68, 10, C.ink, 0) + rect(18, 60, 22, 8, C.white, 2) + rect(66, 54, 44, 54, C.dark, 8) + rect(72, 62, 32, 18, C.sky, 3) + [0, 1, 2].map((i) => circle(78 + i * 10, 92, 3, C.grey)).join(""),
  ride: wheel(26, 80, 20) + wheel(94, 80, 20) + thick("M26 80 L50 44 H78 L94 80 M50 44 L60 80 L26 80 M60 80 L78 44", C.coral, 5) + thick("M48 38 H62 M80 38 L88 56", C.dark, 6) + circle(60, 80, 5, C.grey),
  ring: rect(36, 12, 48, 96, C.dark, 10) + rect(42, 24, 36, 62, C.sky, 3) + stroke("M16 40 q-8 16 0 32 M6 30 q-16 26 0 52 M104 40 q8 16 0 32 M114 30 q16 26 0 52", C.yellow, 4) + circle(60, 98, 4, C.grey),
  say: circle(34, 80, 26, C.skin) + eye(26, 76, 3) + eye(42, 76, 3) + ellipse(34, 92, 6, 4, LINE) + path("M52 14 H108 Q114 14 114 20 V50 Q114 56 108 56 H76 L62 70 V56 H52 Q46 56 46 50 V20 Q46 14 52 14Z", C.white) + dot(62, 36, 3.5, LINE) + dot(80, 36, 3.5, LINE) + dot(98, 36, 3.5, LINE),
  see: path("M6 60 Q60 8 114 60 Q60 112 6 60Z", C.white) + circle(60, 60, 24, C.water) + circle(60, 60, 12, C.ink) + circle(66, 54, 4, C.white),
  sell: rect(8, 66, 104, 40, C.brown, 6) + rect(8, 60, 104, 12, C.tan, 4) + circle(36, 50, 12, C.red) + circle(60, 50, 12, C.orange) + circle(84, 50, 12, C.lime) + path("M82 8 L106 24 V40 L90 44 L72 28Z", C.yellow) + circle(98, 22, 3, LINE) + stroke("M60 80 H100 M20 92 H60", C.tan, 3),
  send: rect(10, 38, 74, 52, C.white, 6) + stroke("M12 42 L47 68 L82 42", LINE, 3) + path("M70 40 L114 18 L96 66 L88 52 Z", C.water) + stroke("M88 52 L114 18", LINE, 3) + stroke("M4 100 H30 M12 108 H40", C.sky, 4),
  speak: face({ mouth: "none" }) + ellipse(60, 82, 12, 9, LINE) + ellipse(60, 86, 8, 4, C.coral) + stroke("M100 50 q10 12 0 26 M108 42 q16 20 0 42", C.deepBlue, 4),
  spend: rect(12, 52, 64, 52, C.brown, 10) + rect(54, 64, 22, 24, C.tan, 6) + circle(65, 76, 4, C.yellow) + circle(88, 24, 14, C.gold) + circle(104, 56, 12, C.gold) + circle(82, 62, 10, C.gold) + stroke("M80 36 L74 46 M96 70 L92 78", C.grey, 3),
  teach: rect(10, 14, 100, 62, C.leaf, 6) + stroke("M24 34 H62 M24 48 H78", C.white, 4) + circle(92, 60, 14, C.skin) + path("M70 118 Q72 84 92 80 Q112 84 114 118Z", C.coral) + eye(87, 58, 2.5) + eye(97, 58, 2.5) + thick("M60 86 L40 66", C.brown, 4),
  think: cloud(66, 40, 1.4, C.white) + dot(40, 78, 7, "#d9e2ee")  + circle(30, 96, 5, C.white) + circle(48, 70, 8, C.white) + stroke("M52 38 q10 -12 22 -4 q10 4 2 14", LINE, 3),
  understand: path("M60 12 Q96 12 96 46 Q96 66 78 78 V92 H42 V78 Q24 66 24 46 Q24 12 60 12Z", C.yellow) + rect(44, 92, 32, 8, C.grey, 3) + rect(48, 100, 24, 8, C.grey, 3) + stroke("M50 70 q-2 -20 10 -22 q12 2 10 22 M54 56 H66", LINE, 3.5) + rays(60, 46, 42, 52, 8, C.gold, 3.5),
  wear: path("M60 24 L20 44 L32 64 L42 58 V108 H78 V58 L88 64 L100 44 Z", C.deepBlue) + stroke("M44 24 Q60 40 76 24", LINE, 3.5) + stroke("M60 14 V24 Q70 24 70 16 Q70 8 62 8", LINE, 3.5) + stroke("M42 58 L42 108 M78 58 V108", "#7ab0ff", 2.5),
  forget: circle(60, 60, 38, C.skin) + stroke("M44 66 H76", LINE, 3.5) + eye(46, 52, 3.5) + eye(74, 52, 3.5) + stroke("M84 14 q10 -4 14 6", C.grey, 3),
  remember: circle(46, 70, 34, C.skin) + eye(36, 64, 3.5) + eye(56, 64, 3.5) + stroke("M36 80 q10 8 20 0") + cloud(88, 34, 0.9, C.white) + star(88, 32, 11, C.yellow) + circle(68, 56, 4, C.white) + circle(62, 66, 3, C.white),
};
