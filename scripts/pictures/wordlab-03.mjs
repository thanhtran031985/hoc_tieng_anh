// Hình đáp án của Khám phá từ cho các từ cấp 3 (task 27): những thứ không phải từ vựng riêng nên không nằm ở level-03-*.mjs.
import { C, rect, thick } from "./lib.mjs";

export const pictures = {
  seat: rect(34, 12, 52, 58, C.deepBlue, 14) + rect(40, 20, 40, 18, "#5f9cf5", 8) + rect(24, 64, 72, 26, C.blue, 9) + thick("M40 92 V108 M80 92 V108", C.grey, 5),
};
