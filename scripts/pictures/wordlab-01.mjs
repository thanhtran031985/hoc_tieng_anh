// Hình đáp án của Khám phá từ cho các từ cấp 1 (task 27): những thứ không phải từ vựng riêng nên không nằm ở level-01-*.mjs.
import { C, circle, ellipse, rect, path, poly, stroke, thick, union, uc, eye, dot } from "./lib.mjs";

export const pictures = {
  mane: union(C.brown, uc(60, 60, 50), uc(24, 44, 22), uc(96, 44, 22), uc(18, 78, 20), uc(102, 78, 20), uc(40, 100, 22), uc(80, 100, 22), uc(60, 16, 22)) + circle(60, 62, 30, C.bread) + eye(49, 56, 4) + eye(71, 56, 4) + stroke("M52 74 q8 7 16 0") + path("M54 64 H66 L60 72Z", C.coral),
  horns: path("M18 100 Q12 50 40 24 Q36 52 46 74Z", C.cream) + path("M102 100 Q108 50 80 24 Q84 52 74 74Z", C.cream) + stroke("M26 82 q6 -4 12 0 M28 62 q5 -4 10 0", "#c9a77a", 3) + stroke("M94 82 q-6 -4 -12 0 M92 62 q-5 -4 -10 0", "#c9a77a", 3) + ellipse(60, 92, 26, 16, C.tan),
  trunk: ellipse(20, 52, 17, 26, "#8f9db0") + ellipse(100, 52, 17, 26, "#8f9db0") + circle(60, 50, 34, "#a8b4c4") + eye(48, 44, 4) + eye(72, 44, 4) + thick("M60 58 V92 Q60 106 76 106", "#a8b4c4", 16) + stroke("M54 70 V90 M66 70 V90", "#7f8da0", 2.5),
  peel: path("M60 12 Q36 40 40 84 Q46 108 64 112 Q54 84 62 56 Q70 34 60 12Z", C.yellow) + path("M60 12 Q84 40 80 84 Q74 108 56 112 Q66 84 58 56 Q50 34 60 12Z", "#ffe27a") + stroke("M60 14 V30", "#8a5a35", 5),
  pages: rect(14, 22, 92, 80, C.white, 5) + stroke("M60 24 V100", "#2b2440", 3) + stroke("M24 40 H50 M24 54 H50 M24 68 H50 M70 40 H96 M70 54 H96 M70 68 H90", C.grey, 3.5) + path("M14 102 H106", "none"),
};
