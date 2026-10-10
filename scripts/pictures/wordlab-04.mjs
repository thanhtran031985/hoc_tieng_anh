// Hình đáp án của Khám phá từ cho các từ cấp 4 (task 27): những thứ không phải từ vựng riêng nên không nằm ở level-04-*.mjs.
import { C, circle, ellipse, rect, path, poly, stroke, thick, face, torso, union, uc, eye, dot } from "./lib.mjs";

export const pictures = {
  stethoscope: thick("M34 14 V46 Q34 74 60 74 Q86 74 86 46 V14", C.dark, 5) + thick("M60 74 V90", C.dark, 5) + circle(60, 100, 14, C.grey) + circle(60, 100, 6, C.white) + circle(34, 12, 5, C.ink) + circle(86, 12, 5, C.ink),
  librarian:
    torso(C.purple) + face() + path("M24 62 Q20 20 60 20 Q100 20 96 62 Q88 38 60 36 Q32 38 24 62Z", C.brown) + circle(60, 14, 9, C.brown) +
    ellipse(46, 62, 11, 9, "none") + ellipse(74, 62, 11, 9, "none") + stroke("M57 62 H63") +
    rect(76, 92, 32, 24, C.red, 3) + rect(80, 96, 24, 16, C.white, 2) + stroke("M84 102 H100 M84 107 H96", C.grey, 2.5),
  borrow:
    rect(8, 48, 36, 56, C.blue, 5) + rect(14, 54, 8, 44, "#7ad0ff", 2) + stroke("M30 62 H38 M30 72 H38", C.white, 3) +
    thick("M50 76 H80", C.coral, 6) + poly("78,62 98,76 78,90", C.coral) +
    rect(88, 52, 28, 52, C.orange, 9) + rect(94, 44, 16, 14, "#d6761a", 4) + rect(94, 66, 16, 12, C.yellow, 3),
  dinosaur:
    path("M30 72 Q8 74 4 98 Q24 88 36 84Z", C.leaf) + rect(38, 86, 12, 26, C.green, 5) + rect(68, 86, 12, 26, C.green, 5) + ellipse(58, 74, 34, 22, C.leaf) +
    path("M76 62 Q94 44 90 24 L108 28 Q108 58 88 80Z", C.leaf) + circle(100, 22, 12, C.leaf) + eye(103, 19, 3.5) + stroke("M100 28 q4 3 8 0", "#2b2440", 2.5) +
    dot(46, 64, 4, C.green) + dot(60, 60, 4, C.green) + dot(72, 66, 4, C.green),
  popcorn:
    union(C.cream, uc(40, 50, 14), uc(58, 40, 15), uc(78, 48, 14), uc(50, 60, 12), uc(70, 60, 12)) +
    path("M26 62 H94 L86 114 H34Z", C.white) + path("M38 62 L40 114 H48 L46 62Z M58 62 V114 H66 V62Z M80 62 L76 114 H84 L90 62Z", C.red),
  tractor:
    circle(88, 90, 24, C.ink) + circle(88, 90, 10, C.grey) + rect(14, 60, 46, 30, C.green, 6) + rect(52, 32, 40, 52, C.green, 6) + rect(58, 38, 26, 26, C.sky, 4) +
    rect(14, 50, 8, 14, C.dark, 3) + circle(34, 98, 14, C.ink) + circle(34, 98, 6, C.grey),
  fire:
    path("M60 8 C68 34 98 46 92 80 C88 104 72 114 60 114 C42 114 26 100 28 76 C30 58 46 50 48 30 C56 38 56 22 60 8Z", C.orange) +
    path("M60 52 C64 68 78 74 76 92 C74 104 66 110 60 110 C50 110 42 102 44 90 C46 78 56 72 60 52Z", C.yellow),
  hose:
    thick("M16 66 A44 40 0 1 1 104 66", C.red, 9) + thick("M30 66 A30 26 0 1 1 90 66", C.red, 9) + thick("M104 66 V86", C.red, 9) + rect(92, 84, 24, 16, C.grey, 4) + rect(106, 86, 8, 12, C.dark, 2),
  rocket:
    path("M36 76 L16 104 L36 98Z", C.red) + path("M84 76 L104 104 L84 98Z", C.red) + path("M46 98 Q60 128 74 98Z", C.orange) +
    path("M60 6 Q86 28 86 70 V100 H34 V70 Q34 28 60 6Z", C.white) + path("M60 6 Q74 16 80 32 H40 Q46 16 60 6Z", C.red) + circle(60, 56, 11, C.sky),
  letter: rect(10, 30, 100, 66, C.white, 6) + path("M10 34 L60 70 L110 34", "none") + rect(88, 38, 16, 18, C.red, 2),
};
