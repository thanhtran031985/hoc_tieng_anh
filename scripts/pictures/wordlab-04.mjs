// Hình đáp án của Khám phá từ cho các từ cấp 4 (task 27): những thứ không phải từ vựng riêng nên không nằm ở level-04-*.mjs.
import { C, circle, ellipse, rect, path, poly, stroke, thick, face, torso } from "./lib.mjs";

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
};
