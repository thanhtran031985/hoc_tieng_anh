// Cấp 5: Cảm xúc, tính cách (feelings-personality). Chỉ vẽ nét mặt rõ nghĩa; tính cách và phần lớn tính từ không có hình, xem decisions.md.
import { C, LINE, circle, ellipse, path, dot, stroke, thick, g, face, torso, heart } from "./lib.mjs";

const bare = (opts = {}) => face({ eyes: false, mouth: "none", ...opts });
const bigEye = (x, y, r = 8) => circle(x, y, r, C.white) + dot(x, y + 1, r * 0.45, LINE);
const drop = (x, y) => path(`M${x} ${y} q7 10 0 16 q-7 -6 0 -16Z`, C.water);
const question = (x, y) => stroke(`M${x} ${y} q0 -12 12 -12 q12 0 12 10 q0 8 -8 12 v6`, LINE, 4) + dot(x + 16, y + 28, 2.8, LINE);

export const feelings = {
  scared:
    bare({ skin: "#f6e3c9", cheeks: false }) + bigEye(46, 58) + bigEye(74, 58) + stroke("M36 44 L54 40 M84 44 L66 40", LINE, 3.5) + ellipse(60, 86, 7, 5, C.ink) + drop(94, 36) + drop(26, 40),
  surprised:
    bare() + bigEye(46, 58, 9) + bigEye(74, 58, 9) + stroke("M36 40 Q46 32 56 40 M64 40 Q74 32 84 40", LINE, 3.5) + ellipse(60, 86, 8, 10, C.ink) + stroke("M96 30 L104 22 M24 30 L16 22 M60 24 V16", C.gold, 4),
  bored:
    bare() + path("M36 62 Q46 54 56 62Z", C.white) + path("M64 62 Q74 54 84 62Z", C.white) + stroke("M36 62 H56 M64 62 H84", LINE, 3.5) + dot(46, 61, 3, LINE) + dot(74, 61, 3, LINE) + stroke("M48 86 H72", LINE, 3.5) + stroke("M90 30 h10 l-10 10 h10", LINE, 3),
  confused:
    bare() + eyeDots() + stroke("M36 44 L54 48 M64 38 Q74 34 84 40", LINE, 3.5) + stroke("M48 86 q4 -6 8 0 t8 0 t8 0", LINE, 3.5) + question(90, 34),
  calm:
    bare({ cheeks: true }) + stroke("M38 62 q8 7 16 0 M66 62 q8 7 16 0", LINE, 3.5) + stroke("M48 80 Q60 90 72 80", LINE, 3.5) + path("M96 40 Q108 28 114 40 Q104 48 96 40Z", C.leaf) + stroke("M10 22 q6 -6 12 0 t12 0", C.water, 3.5),
  laugh:
    bare() + stroke("M38 62 q8 -8 16 0 M66 62 q8 -8 16 0", LINE, 3.5) + path("M42 76 Q60 104 78 76Z", C.ink) + path("M50 90 Q60 82 70 90 Q60 98 50 90Z", C.coral) + drop(28, 66) + drop(88, 66),
  cry:
    bare() + stroke("M38 62 q8 7 16 0 M66 62 q8 7 16 0", LINE, 3.5) + path("M46 90 Q60 78 74 90 Q60 84 46 90Z", C.ink) + path("M42 68 q-4 20 2 34 q6 -12 4 -30Z", C.water) + path("M78 68 q4 20 -2 34 q-6 -12 -4 -30Z", C.water),
  hug:
    g("translate(10 22) scale(.55)", torso(C.coral) + face()) + g("translate(48 22) scale(.55)", torso(C.green) + face({ skin: C.tan })) +
    stroke("M30 98 Q60 112 90 98", LINE, 9) + stroke("M30 98 Q60 112 90 98", C.coral, 5) + heart(60, 26, 0.9, C.red),
  curious:
    bare() + bigEye(48, 60, 8) + bigEye(76, 60, 8) + dot(52, 60, 3, LINE) + dot(80, 60, 3, LINE) + stroke("M36 46 L54 44 M66 38 Q76 34 86 40", LINE, 3.5) + ellipse(60, 84, 5, 4, C.ink) +
    thick("M86 98 L104 114", C.brown, 7) + circle(80, 90, 15, "#e8f6ff") + stroke("M72 84 Q76 80 82 80", C.white, 3),
};

function eyeDots() {
  return circle(46, 60, 5, LINE) + circle(74, 60, 5, LINE);
}
