// Hình minh họa cho các từ cụ thể của cấp 5. Từ trừu tượng (cảm xúc, kế hoạch, động từ…) không có hình, xem decisions.md.
import { travel } from "./level-05-travel.mjs";
import { nature } from "./level-05-nature.mjs";
import { feelings } from "./level-05-feelings.mjs";
import { science } from "./level-05-science.mjs";
import { media } from "./level-05-media.mjs";
import { home } from "./level-05-home.mjs";
import { community, future } from "./level-05-community.mjs";

export const pictures = { ...travel, ...nature, ...feelings, ...science, ...media, ...home, ...community, ...future };
