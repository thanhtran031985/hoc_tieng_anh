// Cấp 5: Cộng đồng (community-places) và Kế hoạch tương lai (future-plans). Từ trừu tượng (society, law, tradition, plan, career…) không có hình, xem decisions.md.
import { C, LINE, circle, ellipse, rect, path, poly, dot, stroke, shine, thick, g, face, torso, star, heart, wheel, window4, cloud, tree, waves } from "./lib.mjs";

export const community = {
  thief:
    torso(C.white) + stroke("M26 110 H94 M22 102 H98", LINE, 3.5) + face() + rect(32, 50, 56, 18, C.ink, 4) + circle(46, 59, 4, C.white) + circle(74, 59, 4, C.white) + path("M26 48 Q26 14 60 14 Q94 14 94 48Z", C.ink) + rect(22, 44, 76, 8, C.dark, 4),
  prison:
    rect(8, 10, 104, 100, C.grey, 6) + rect(18, 20, 84, 80, C.dark, 4) + [30, 44, 58, 72, 86].map((x) => stroke(`M${x} 20 V100`, C.grey, 7)).join("") + stroke("M18 44 H102 M18 76 H102", C.grey, 5) + rect(48, 84, 24, 20, C.gold, 4) + stroke("M54 84 V76 Q54 68 60 68 Q66 68 66 76 V84", LINE, 4),
  mayor:
    torso(C.navy) + face() + rect(38, 6, 44, 30, C.ink, 3) + rect(26, 32, 68, 8, C.ink, 3) + rect(38, 28, 44, 6, C.red, 1) + stroke("M34 98 Q60 124 86 98", C.gold, 6) + circle(60, 112, 7, C.gold),
  "post box":
    rect(32, 94, 56, 16, C.dark, 3) + rect(34, 28, 52, 70, C.red, 8) + path("M34 36 Q34 12 60 12 Q86 12 86 36Z", C.red) + rect(42, 44, 36, 8, C.dark, 3) + rect(40, 62, 40, 6, "#c0392b", 2) + shine("M40 30 Q40 20 50 16"),
  bench:
    rect(10, 58, 100, 14, C.brown, 4) + rect(10, 30, 100, 10, C.tan, 3) + rect(10, 44, 100, 10, C.tan, 3) + stroke("M20 72 V104 M100 72 V104", LINE, 7) + stroke("M20 72 V104 M100 72 V104", C.dark, 3) + stroke("M18 30 V60 M102 30 V60", LINE, 4),
  fountain:
    ellipse(60, 98, 50, 12, C.grey) + ellipse(60, 96, 42, 8, C.water) + rect(52, 52, 16, 44, C.grey, 3) + ellipse(60, 54, 28, 8, C.grey) + ellipse(60, 52, 22, 5, C.water) + stroke("M60 50 V22", C.sky, 6) + stroke("M60 28 Q44 20 38 42 M60 28 Q76 20 82 42", C.sky, 4) + stroke("M36 60 Q28 76 30 90 M84 60 Q92 76 90 90", C.sky, 4) + dot(60, 20, 4, C.white),
  statue:
    rect(30, 84, 60, 26, C.grey, 4) + rect(24, 104, 72, 8, C.dark, 3) + circle(60, 28, 14, "#c9d1da") + path("M36 84 Q36 46 60 44 Q84 46 84 84Z", "#c9d1da") + thick("M80 56 L98 28", "#c9d1da", 9) + star(100, 20, 8, C.yellow),
  campsite:
    rect(4, 90, 112, 20, C.leaf, 6) + poly("12,92 44,36 76,92", C.coral) + poly("34,92 44,64 54,92", C.ink) + stroke("M44 36 V28", LINE, 3.5) + tree(96, 46, 0.9) + stroke("M82 100 L100 94 M82 94 L100 100", C.brown, 4) + path("M88 96 Q84 84 92 78 Q92 88 100 90 Q100 98 88 96Z", C.orange),
  "town hall":
    rect(10, 56, 100, 54, C.cream, 4) + rect(40, 24, 40, 40, C.bread, 3) + poly("34,26 60,6 86,26", C.brown) + circle(60, 42, 10, C.white) + stroke("M60 35 V43 L66 46", LINE, 2.5) + stroke("M60 6 V-2", LINE, 3) + [18, 30, 76, 90].map((x) => window4(x, 66, 12, 16)).join("") + rect(50, 82, 20, 28, C.brown, 3) + rect(4, 108, 112, 6, C.grey, 2),
  countryside:
    rect(4, 8, 112, 104, C.sky, 10) + circle(92, 28, 9, C.yellow) + cloud(36, 26, 0.5) + path("M4 70 Q30 44 60 66 Q90 84 116 54 V104 Q116 112 108 112 H12 Q4 112 4 104Z", C.leaf) + path("M4 90 Q40 76 80 92 Q100 98 116 90 V104 Q116 112 108 112 H12 Q4 112 4 104Z", C.green) + rect(50, 62, 26, 20, C.red, 2) + poly("46,64 63,48 80,64", C.brown) + rect(58, 70, 10, 12, C.cream, 1) + tree(26, 60, 0.6),
  charity:
    rect(28, 36, 64, 70, C.white, 8) + rect(40, 30, 40, 10, C.grey, 3) + rect(44, 38, 32, 5, C.dark, 2) + heart(60, 76, 1.4, C.red) + circle(98, 18, 9, C.gold) + stroke("M98 14 V22", LINE, 2.5) + stroke("M70 24 L66 36", LINE, 2.5),
  vote:
    rect(26, 62, 68, 46, C.blue, 6) + rect(36, 56, 48, 10, C.deepBlue, 3) + rect(44, 59, 32, 4, C.ink, 1) + g("rotate(-8 60 30)", rect(38, 8, 44, 40, C.white, 3) + stroke("M48 28 L56 38 L74 16", C.green, 5)),
  "swimming pool":
    rect(6, 22, 108, 80, C.white, 10) + rect(14, 30, 92, 64, C.water, 8) + waves("M20 46 q10 -6 20 0 t20 0 t20 0 t20 0") + waves("M20 68 q10 -6 20 0 t20 0 t20 0 t20 0") + stroke("M14 56 H106 M14 80 H106", C.red, 3).replace("/>", ' stroke-dasharray="6 5"/>') + stroke("M96 20 V34 M104 20 V34", C.grey, 4) + stroke("M96 26 H104", C.grey, 3),
  police:
    rect(6, 54, 108, 36, C.white, 10) + path("M24 54 L36 30 H84 L98 54Z", C.sky) + rect(6, 68, 108, 10, C.deepBlue, 2) + rect(52, 20, 10, 10, C.red, 2) + rect(62, 20, 10, 10, C.blue, 2) + wheel(32, 92, 11) + wheel(88, 92, 11) + circle(14, 62, 4, C.yellow) + circle(106, 62, 4, C.red),
};

export const future = {
  wedding:
    rect(26, 76, 68, 30, C.white, 6) + rect(36, 48, 48, 30, C.pink, 6) + rect(46, 26, 28, 24, C.white, 6) + stroke("M26 90 q8 6 17 0 t17 0 t17 0 t17 0", C.pink, 3.5) + heart(60, 20, 0.8, C.red) + rect(14, 106, 92, 6, C.grey, 3) + star(16, 36, 6, C.yellow) + star(104, 44, 5, C.yellow),
};
