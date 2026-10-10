// Họ vần của task 27 (ngoài hai họ mẫu “-at”, “-ir” của thiết kế ở word-family-data.ts). Từ chưa có trong kho thì nằm ở prisma/seed/wordlab/family-words.json.
// Mọi họ ở trạng thái Nháp cho tới khi đoạn văn vui có giọng đọc và người dùng xuất bản.
import type { FamilySeedEntry } from "../word-family-data.ts";
import { FAMILIES_WORDLAB_MORE } from "./families-more.ts";

const SAMPLES: FamilySeedEntry[] = [
  {
    pattern: "ake",
    soundIpa: "/eɪk/",
    levelNumber: 1,
    buildRime: null,
    decoys: ["g", "v", "z"],
    trapNote: "",
    members: ["snake", "cake", "lake", "make", "take", "bake", "wake"],
    traps: [],
    sentences: [
      { en: "The snake wakes up at the lake.", vi: "Con rắn thức dậy bên hồ." },
      { en: "He bakes a cake and takes it to his friend.", vi: "Nó nướng một chiếc bánh và mang cho bạn của nó." },
    ],
  },
  {
    pattern: "ight",
    soundIpa: "/aɪt/",
    levelNumber: 3,
    buildRime: null,
    decoys: ["z", "v", "j"],
    trapNote: "Ba từ này cũng có chữ “ight” nhưng đọc khác: eight đọc là /eɪt/, weight đọc là /weɪt/, straight đọc là /streɪt/. Nghe kỹ nhé!",
    members: ["night", "light", "right", "fight", "knight", "tight", "might", "sight"],
    traps: ["eight", "weight", "straight"],
    sentences: [
      { en: "At night, a knight has a light.", vi: "Ban đêm, một hiệp sĩ cầm một ngọn đèn." },
      { en: "He can fight, but he might sit and read.", vi: "Anh ấy biết chiến đấu, nhưng có thể anh ấy sẽ ngồi đọc sách." },
    ],
  },
];

export const FAMILIES_WORDLAB: FamilySeedEntry[] = [...SAMPLES, ...FAMILIES_WORDLAB_MORE];
