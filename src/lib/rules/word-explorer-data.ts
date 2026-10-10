// Khám phá từ mẫu (task 25): “bird” và “cat”, chuyển từ dữ liệu mẫu `Bong.W.wx` của thiết kế (designs/components/bundle.js).
// Là dữ liệu cho seed (prisma/seed/word-explorer.ts); hình lấy từ public/media/pictures (17 hình riêng do scripts/gen-explorer-art.mjs sinh).
// Nội dung thật của các từ khác do task 27 soạn. Mẫu ở trạng thái Nháp cho tới khi các đáp án có âm thanh và đoạn văn có giọng đọc.
import type { ExplorerAnswer, ExplorerDistractor, ExplorerSentence, WordQuestionKind } from "../schemas/word-explorer.ts";

export type ExplorerSeedBranch = {
  kind: WordQuestionKind;
  questionEn: string;
  questionVi: string;
  answers: ExplorerAnswer[];
  distractors: ExplorerDistractor[];
  /** Câu của nhánh trong đoạn văn “Đọc cả đoạn”. */
  sentence: ExplorerSentence;
};

export type ExplorerSeedWord = { word: string; branches: ExplorerSeedBranch[] };

const pic = (key: string) => `/media/pictures/${key}.svg`;
/** Đáp án: [khóa hình, chữ Anh, nghĩa Việt]; `guess` đánh dấu đáp án bé đoán bằng hình. */
const ans = (key: string, text: string, textVi: string, guess = false): ExplorerAnswer => ({ text, textVi, image: pic(key), ...(guess ? { guess } : {}) });
/** Hình nhiễu: [khóa hình, nhãn tiếng Anh Bông đọc khi bé chọn]. */
const dis = (key: string, text: string): ExplorerDistractor => ({ text, image: pic(key) });
const sent = (en: string, vi: string): ExplorerSentence => ({ en, vi });

export const EXPLORER_SEED: ExplorerSeedWord[] = [
  {
    word: "bird",
    branches: [
      { kind: "identify", questionEn: "What’s this?", questionVi: "Đây là gì?", answers: [ans("bird", "a bird", "một con chim")], distractors: [dis("cat", "a cat"), dis("fish", "a fish")], sentence: sent("This is a bird.", "Đây là một con chim.") },
      {
        kind: "color",
        questionEn: "What color is a bird?",
        questionVi: "Chim có màu gì?",
        answers: [ans("brown", "brown", "màu nâu"), ans("yellow", "yellow", "màu vàng"), ans("blue", "blue", "màu xanh dương")],
        distractors: [dis("stripes", "black and white stripes")],
        sentence: sent("It is brown, yellow or blue.", "Chim có màu nâu, vàng hoặc xanh dương."),
      },
      {
        kind: "food",
        questionEn: "What does a bird like to eat?",
        questionVi: "Chim thích ăn gì?",
        answers: [ans("seeds", "seeds", "hạt"), ans("insects", "insects", "sâu bọ"), ans("berries", "berries", "quả mọng")],
        distractors: [dis("book", "a book"), dis("ball", "a ball")],
        sentence: sent("It likes to eat seeds, insects and berries.", "Chim thích ăn hạt, sâu bọ và quả mọng."),
      },
      {
        kind: "parts",
        questionEn: "What does a bird have?",
        questionVi: "Chim có những gì?",
        answers: [ans("wings", "wings", "đôi cánh"), ans("feathers", "feathers", "lông vũ"), ans("beak", "a beak", "cái mỏ"), ans("claws", "claws", "móng vuốt")],
        distractors: [dis("wheel", "wheels")],
        sentence: sent("It has wings, feathers, a beak and claws.", "Chim có cánh, lông vũ, mỏ và móng vuốt."),
      },
      {
        kind: "action",
        questionEn: "What can a bird do?",
        questionVi: "Chim làm được gì?",
        answers: [ans("flysky", "fly in the sky", "bay trên trời"), ans("nest", "build a nest", "làm tổ")],
        distractors: [dis("girlbook", "read a book"), dis("run", "run")],
        sentence: sent("It can fly in the sky and build a nest.", "Chim biết bay trên trời và làm tổ."),
      },
      {
        kind: "place",
        questionEn: "Where does a bird live?",
        questionVi: "Chim sống ở đâu?",
        answers: [ans("nest", "in the nest", "trong tổ"), ans("tree", "on the tree", "trên cây", true)],
        distractors: [dis("fishtank", "in a fish tank")],
        sentence: sent("It lives in a nest on a tree.", "Chim sống trong tổ trên cây."),
      },
    ],
  },
  {
    word: "cat",
    branches: [
      { kind: "identify", questionEn: "What’s this?", questionVi: "Đây là gì?", answers: [ans("cat", "a cat", "một con mèo")], distractors: [dis("dog", "a dog"), dis("bird", "a bird")], sentence: sent("This is a cat.", "Đây là một con mèo.") },
      {
        kind: "color",
        questionEn: "What color is a cat?",
        questionVi: "Mèo có màu gì?",
        answers: [ans("ginger", "orange", "màu cam"), ans("white", "white", "màu trắng"), ans("black", "black", "màu đen")],
        distractors: [dis("stripes", "black and white stripes")],
        sentence: sent("It is orange, white or black.", "Mèo có màu cam, trắng hoặc đen."),
      },
      {
        kind: "food",
        questionEn: "What does a cat like?",
        questionVi: "Mèo thích gì?",
        answers: [ans("fish", "fish", "cá"), ans("milk", "milk", "sữa")],
        distractors: [dis("wheel", "wheels"), dis("book", "a book")],
        sentence: sent("It likes fish and milk.", "Mèo thích cá và sữa."),
      },
      {
        kind: "parts",
        questionEn: "What does a cat have?",
        questionVi: "Mèo có những gì?",
        answers: [ans("whiskers", "whiskers", "ria"), ans("tail", "a tail", "cái đuôi"), ans("paw", "paws", "bàn chân có đệm", true)],
        distractors: [dis("wings", "wings")],
        sentence: sent("It has whiskers, a tail and paws.", "Mèo có ria, đuôi và bàn chân có đệm."),
      },
      {
        kind: "action",
        questionEn: "What can a cat do?",
        questionVi: "Mèo làm được gì?",
        answers: [ans("run", "run", "chạy"), ans("jump", "jump", "nhảy", true), ans("climb", "climb", "leo trèo")],
        distractors: [dis("flysky", "fly in the sky")],
        sentence: sent("It can run, jump and climb.", "Mèo biết chạy, nhảy và leo trèo."),
      },
    ],
  },
];
