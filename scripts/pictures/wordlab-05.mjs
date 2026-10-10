// Hình đáp án của Khám phá từ cấp 5 (task 28) không phải từ vựng riêng: smoke, mountain, cactus, scorpion, wood, steam.
import { C, LINE, circle, ellipse, rect, path, poly, stroke, thick, cloud } from "./lib.mjs";

export const pictures = {
  smoke:
    rect(4, 90, 112, 20, C.grey, 6) + cloud(60, 74, 0.9, C.grey) + cloud(78, 46, 0.8, "#aab0bb") + cloud(52, 22, 0.7, C.dark),
  mountain:
    rect(4, 8, 112, 104, C.sky, 10) + circle(96, 28, 9, C.yellow) + poly("4,104 40,36 76,104", C.dark) + poly("28,60 40,36 52,60 46,56 40,62 34,56", C.white) + poly("50,104 84,52 116,104", C.grey) + path("M4 104 H116 V104 Q116 110 108 110 H12 Q4 110 4 104Z", C.leaf),
  cactus:
    rect(46, 24, 28, 84, C.green, 14) + rect(20, 46, 14, 36, C.green, 7) + rect(86, 36, 14, 34, C.green, 7) + rect(20, 70, 36, 12, C.green, 6) + rect(66, 58, 34, 12, C.green, 6) + stroke("M60 34 V100 M53 40 V96 M67 40 V96", "#2f7a2a", 2) + circle(60, 22, 6, C.pink) + rect(30, 106, 60, 8, C.bread, 4),
  scorpion:
    ellipse(52, 74, 26, 16, C.orange) + circle(78, 72, 11, C.orange) + path("M26 70 Q8 56 14 34 Q22 22 36 30 Q28 34 26 44 Q24 56 34 66Z", C.orange) + poly("32,28 24,16 40,24", C.red) + path("M78 60 Q96 54 102 66 Q100 76 88 72Z", C.orange) + path("M78 84 Q96 90 102 80 Q100 70 88 74Z", C.orange) + stroke("M40 86 L34 100 M54 90 L52 104 M66 88 L70 102", LINE, 3) + circle(82, 70, 2.5, LINE),
  wood:
    rect(10, 78, 100, 26, C.brown, 12) + circle(98, 91, 12, C.tan) + circle(98, 91, 6, C.brown) + rect(18, 50, 90, 26, "#a3703f", 12) + circle(100, 63, 12, C.bread) + circle(100, 63, 6, C.tan) + stroke("M28 62 H70 M22 92 H64", LINE, 2.5),
  steam:
    thick("M30 104 q-14 -14 0 -28 q14 -14 0 -28 q-10 -10 0 -24", C.grey, 5) + thick("M60 108 q-14 -16 0 -32 q14 -16 0 -32 q-10 -10 0 -22", "#e3e7ee", 5) + thick("M90 104 q-14 -14 0 -28 q14 -14 0 -28 q-10 -10 0 -24", C.grey, 5),
};
