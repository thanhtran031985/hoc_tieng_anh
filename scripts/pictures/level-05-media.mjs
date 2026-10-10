// Cấp 5: Giải trí (entertainment-media). Từ trừu tượng (media, plot, review, publish…) không có hình, xem decisions.md.
import { C, LINE, circle, ellipse, rect, path, poly, dot, stroke, shine, thick, g, star, rays, face, torso, cap, heart } from "./lib.mjs";

const flags = (y, xs, colors) => xs.map((x, i) => poly(`${x},${y} ${x + 12},${y} ${x + 6},${y + 12}`, colors[i % colors.length])).join("");

export const media = {
  newspaper:
    rect(12, 20, 96, 80, C.white, 4) + rect(20, 28, 80, 14, C.ink, 2) + rect(20, 48, 34, 28, C.sky, 2) + poly("22,74 32,60 42,74", C.green) + circle(46, 56, 4, C.yellow) + stroke("M60 52 H100 M60 62 H100 M60 72 H92 M20 84 H100 M20 92 H84", LINE, 2.5),
  microphone:
    stroke("M60 70 V96 M40 108 H80", LINE, 5) + rect(52, 62, 16, 36, C.dark, 4) + circle(60, 36, 24, C.grey) + stroke("M42 28 H78 M38 38 H82 M42 48 H78 M50 16 V56 M60 14 V58 M70 16 V56", LINE, 1.8) + shine("M44 24 Q48 18 56 16"),
  headphones:
    thick("M22 72 Q22 16 60 16 Q98 16 98 72", C.dark, 8) + rect(12, 60, 26, 40, C.red, 11) + rect(82, 60, 26, 40, C.red, 11) + rect(18, 68, 8, 24, C.coral, 4) + rect(94, 68, 8, 24, C.coral, 4),
  speaker:
    rect(26, 8, 68, 104, C.dark, 10) + circle(60, 34, 11, C.grey) + circle(60, 34, 4, C.dark) + circle(60, 78, 25, C.grey) + circle(60, 78, 15, C.dark) + circle(60, 78, 6, C.grey) + dot(36, 18, 2.5, C.red),
  "remote control":
    rect(38, 8, 44, 104, C.dark, 14) + circle(60, 26, 8, C.red) + rect(46, 44, 12, 10, C.sky, 3) + rect(62, 44, 12, 10, C.sky, 3) + rect(46, 60, 12, 10, C.sky, 3) + rect(62, 60, 12, 10, C.sky, 3) + rect(46, 76, 28, 10, C.yellow, 3) + rect(46, 92, 12, 10, C.green, 3) + rect(62, 92, 12, 10, C.blue, 3),
  stage:
    rect(4, 8, 112, 104, C.navy, 10) + path("M4 8 H46 Q40 52 12 98 H4Z", C.red) + path("M116 8 H74 Q80 52 108 98 H116Z", C.red) + rect(4, 94, 112, 16, C.brown, 6) + poly("46,8 74,8 90,92 30,92", "#fff3b0") + circle(60, 14, 6, C.gold),
  album:
    circle(78, 62, 34, C.ink) + circle(78, 62, 11, C.yellow) + circle(78, 62, 3, C.ink) + stroke("M60 44 Q78 36 96 44", C.dark, 2) + rect(8, 26, 70, 70, C.coral, 4) + circle(43, 61, 18, C.cream) + stroke("M38 70 V52 L52 48 V66", LINE, 3.5) + circle(36, 70, 4, LINE) + circle(50, 66, 4, LINE),
  actress:
    path("M24 62 Q20 12 60 12 Q100 12 96 62 V112 H78 V74 H42 V112 H24Z", C.brown) + torso(C.pink) + face() + path("M30 52 Q40 30 60 30 Q80 30 90 52 Q74 38 60 40 Q44 38 30 52Z", C.brown) + star(100, 20, 9, C.yellow) + star(18, 28, 6, C.yellow),
  director:
    torso(C.blue) + face() + cap(C.ink, C.dark) + rect(64, 82, 48, 30, C.ink, 3) + poly("64,82 112,82 112,70 70,66", C.white) + stroke("M72 70 L78 82 M84 68 L90 82 M96 69 L102 82", LINE, 3),
  podcast:
    stroke("M60 70 V92 M44 100 H76", LINE, 5) + rect(46, 14, 28, 46, C.purple, 14) + stroke("M34 44 Q34 76 60 76 Q86 76 86 44", LINE, 4) + stroke("M14 34 Q8 52 14 70 M24 38 Q20 52 24 66 M106 34 Q112 52 106 70 M96 38 Q100 52 96 66", C.purple, 4),
  festival:
    stroke("M4 22 Q60 38 116 22", LINE, 3) + flags(26, [14, 32, 50, 68, 86, 102], [C.red, C.yellow, C.blue, C.green]) + rays(32, 58, 4, 18, 8, C.orange, 3.5) + rays(92, 50, 4, 16, 8, C.pink, 3.5) + dot(32, 58, 4, C.yellow) + dot(92, 50, 4, C.yellow) +
    poly("40,112 60,74 80,112", C.coral) + poly("52,112 60,92 68,112", C.ink) + rect(4, 106, 112, 6, C.leaf, 3),
  drama:
    g("rotate(-10 40 60)", path("M14 40 Q14 20 40 20 Q66 20 66 40 V62 Q66 94 40 96 Q14 94 14 62Z", C.yellow) + path("M24 44 q5 -5 10 0 M46 44 q5 -5 10 0", "none") + stroke("M24 46 q6 -6 12 0 M44 46 q6 -6 12 0", LINE, 3) + stroke("M28 68 Q40 82 52 68", LINE, 3.5)) +
    g("rotate(10 80 70)", path("M54 52 Q54 32 80 32 Q106 32 106 52 V74 Q106 106 80 108 Q54 106 54 74Z", C.water) + stroke("M64 58 q6 6 12 0 M84 58 q6 6 12 0", LINE, 3) + stroke("M68 90 Q80 78 92 90", LINE, 3.5)),
  advertisement:
    stroke("M30 66 V108 M90 66 V108", LINE, 6) + rect(8, 14, 104, 56, C.white, 5) + rect(14, 20, 92, 44, C.sky, 3) + circle(32, 34, 8, C.yellow) + poly("14,64 44,36 74,64", C.green) + poly("56,64 82,40 106,64", "#3d9a35") + heart(94, 32, 0.8, C.red),
};
