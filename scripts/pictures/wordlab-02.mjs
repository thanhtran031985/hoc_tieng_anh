// Hình đáp án của Khám phá từ cho các từ cấp 2 (task 27): những thứ không phải từ vựng riêng nên không nằm ở level-02-*.mjs.
import { C, path, rect, stroke, waves } from "./lib.mjs";

export const pictures = {
  fin: rect(4, 78, 112, 38, C.water, 10) + waves("M10 92 q10 -6 20 0 t20 0 t20 0 t20 0 t20 0") + path("M30 80 Q40 36 80 18 Q76 48 94 80Z", "#2f8fd8") + stroke("M50 74 Q56 52 70 38", "#9fd4ff", 3),
};
