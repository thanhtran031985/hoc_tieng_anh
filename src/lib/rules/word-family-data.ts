// Họ vần mẫu (task 26): “-at” /æt/ và “-ir” /ɜː/, chuyển từ dữ liệu mẫu `Bong.W.fam` / `Bong.W.build` của thiết kế (designs/components/bundle.js).
// Là dữ liệu cho seed (prisma/seed/word-family.ts). Từ chưa có trong kho từ vựng (mat, chat, that, first, third…) được bỏ qua khi nạp; nội dung đủ do task 27 soạn.
// Mẫu ở trạng thái Nháp cho tới khi đoạn văn vui có giọng đọc.
import type { ExplorerSentence } from "../schemas/word-explorer.ts";

export type FamilySeedEntry = {
  pattern: string;
  soundIpa: string;
  /** Số cấp của họ (cấp thấp nhất mà bé gặp từ trong họ). */
  levelNumber: number;
  /** Vần dùng để Ghép chữ đầu khi khác vần hiển thị. */
  buildRime: string | null;
  decoys: string[];
  trapNote: string;
  /** Từ cùng âm, theo thứ tự hiện quanh vần. */
  members: string[];
  /** Từ Bẫy chính tả: cùng chữ nhưng khác âm. */
  traps: string[];
  sentences: ExplorerSentence[];
};

export const FAMILY_SEED: FamilySeedEntry[] = [
  {
    pattern: "at",
    soundIpa: "/æt/",
    levelNumber: 1,
    buildRime: null,
    decoys: ["z", "v"],
    trapNote: "Hai từ này cũng có chữ “at” nhưng đọc khác hẳn: eat đọc là /iːt/, what đọc là /wɒt/. Nghe kỹ nhé!",
    members: ["bat", "cat", "hat", "fat", "mat", "flat", "chat", "that"],
    traps: ["eat", "what"],
    sentences: [
      { en: "The fat cat sat on a mat.", vi: "Con mèo béo ngồi trên tấm thảm." },
      { en: "It has a hat.", vi: "Nó có một cái mũ." },
    ],
  },
  {
    pattern: "ir",
    soundIpa: "/ɜː/",
    levelNumber: 2,
    buildRime: "irt",
    decoys: ["f", "m", "z"],
    trapNote: "Từ fire cũng có chữ “ir” nhưng đọc là /ˈfaɪə/, không phải âm /ɜː/ như cả họ.",
    members: ["bird", "girl", "shirt", "skirt", "first", "third"],
    traps: ["fire"],
    sentences: [
      { en: "The first girl has a bird on her shirt.", vi: "Bạn gái đầu tiên mặc áo có hình con chim." },
      { en: "Her skirt is blue.", vi: "Chân váy của bạn ấy màu xanh dương." },
    ],
  },
];
