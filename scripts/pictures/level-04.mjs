// Hình minh họa cho các từ cụ thể của cấp 4. Từ trừu tượng (động từ, tính từ, từ chỉ thời gian…) không có hình, xem decisions.md.
import { places } from "./level-04-places.mjs";
import { jobs } from "./level-04-jobs.mjs";
import { things } from "./level-04-things.mjs";
import { verbs } from "./level-04-verbs.mjs";

export const pictures = { ...places, ...jobs, ...things, ...verbs };
