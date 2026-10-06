// Hình minh họa cho các từ cụ thể của cấp 2. Từ trừu tượng (từ hỏi, đại từ, vài tính từ…) không có hình, xem decisions.md.
import { things } from "./level-02-things.mjs";
import { living } from "./level-02-living.mjs";

export const pictures = { ...things, ...living };
